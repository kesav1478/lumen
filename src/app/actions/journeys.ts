"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createNudgeForStep, createNudgeForJourney } from "./nudges";

// ── Create journey + steps ────────────────────────────────────────────────────

export async function createJourney(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = ((formData.get("title") as string) ?? "").trim();
  const description =
    ((formData.get("description") as string) ?? "").trim() || null;
  const stepsJson = (formData.get("steps") as string) ?? "[]";

  if (!title) return { error: "Journey title is required." };

  let stepTitles: string[] = [];
  try {
    stepTitles = (JSON.parse(stepsJson) as string[])
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    stepTitles = [];
  }

  // 1. Create the journey
  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .insert({ user_id: user.id, title, description, status: "active" })
    .select("id")
    .single();

  if (journeyError || !journey) {
    return { error: journeyError?.message ?? "Failed to create journey." };
  }

  // 2. Create steps (user_id required by RLS policy)
  if (stepTitles.length > 0) {
    const stepRows = stepTitles.map((t, i) => ({
      journey_id: journey.id,
      user_id: user.id,
      title: t,
      position: i,
      completed: false,
    }));
    const { error: stepsError } = await supabase
      .from("journey_steps")
      .insert(stepRows);
    if (stepsError) return { error: stepsError.message };
  }

  redirect(`/journeys/${journey.id}`);
}

// ── Mark a step done ──────────────────────────────────────────────────────────

export async function markStepDone(stepId: string, journeyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Verify ownership and get journey title
  const { data: journey } = await supabase
    .from("journeys")
    .select("id, title, status")
    .eq("id", journeyId)
    .eq("user_id", user.id)
    .single();

  if (!journey) return { error: "Journey not found." };

  // Get step title before marking done (for nudge)
  const { data: stepData } = await supabase
    .from("journey_steps")
    .select("title")
    .eq("id", stepId)
    .eq("journey_id", journeyId)
    .single();

  // Mark step complete
  await supabase
    .from("journey_steps")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", stepId)
    .eq("journey_id", journeyId);

  // Recount completion
  const { data: allSteps } = await supabase
    .from("journey_steps")
    .select("completed")
    .eq("journey_id", journeyId);

  const total = allSteps?.length ?? 0;
  const done = allSteps?.filter((s) => s.completed).length ?? 0;
  const allDone = total > 0 && done === total;

  if (allDone && journey.status !== "completed") {
    await supabase
      .from("journeys")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", journeyId);
    await createNudgeForJourney(user.id, journey.title);
  } else {
    await supabase
      .from("journeys")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", journeyId);
    if (stepData) {
      await createNudgeForStep(user.id, stepData.title, journey.title);
    }
  }

  revalidatePath(`/journeys/${journeyId}`);
  revalidatePath("/journeys");
  revalidatePath("/home");
}

// ── Manually complete a journey ───────────────────────────────────────────────

export async function markJourneyComplete(journeyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: journey } = await supabase
    .from("journeys")
    .select("title")
    .eq("id", journeyId)
    .eq("user_id", user.id)
    .single();

  if (!journey) return;

  await supabase
    .from("journeys")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", journeyId);

  await createNudgeForJourney(user.id, journey.title);

  revalidatePath(`/journeys/${journeyId}`);
  revalidatePath("/journeys");
  revalidatePath("/home");
}
