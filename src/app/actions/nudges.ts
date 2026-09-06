"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Mark one nudge seen ───────────────────────────────────────────────────────

export async function markNudgeSeen(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("nudges")
    .update({ dismissed: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

// ── Mark all nudges seen ──────────────────────────────────────────────────────

export async function markAllNudgesSeen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("nudges")
    .update({ dismissed: true })
    .eq("user_id", user.id)
    .eq("dismissed", false);
}

// ── Nudge message templates ───────────────────────────────────────────────────

const STEP_MESSAGES: Array<(step: string, journey: string) => string> = [
  (step, journey) => `"${step}" is done. You're moving through ${journey}.`,
  (step, journey) => `Nice — "${step}" ticked off on your ${journey} journey.`,
  (step, journey) => `One step closer on ${journey}: "${step}" complete.`,
  (step, journey) => `Marked done: "${step}" on ${journey}. Keep the thread going.`,
  (step, journey) => `Another step forward on ${journey} — "${step}" done.`,
];

const JOURNEY_MESSAGES = [
  (journey: string) =>
    `"${journey}" — complete. That's worth pausing to notice.`,
  (journey: string) =>
    `You followed your ${journey} journey all the way through.`,
  (journey: string) =>
    `The ${journey} journey is done. Every step counted.`,
  (journey: string) =>
    `You finished "${journey}". That took real follow-through.`,
];

function pickMessage<T extends (...args: string[]) => string>(
  templates: T[],
  seed: string
): T {
  // Deterministic pick based on a hash of the seed so it doesn't change on re-render
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return templates[h % templates.length];
}

// ── Create nudge for completing a step ───────────────────────────────────────
// Call this from the journey-steps action when a step is marked complete.

export async function createNudgeForStep(
  userId: string,
  stepTitle: string,
  journeyTitle: string
) {
  const supabase = await createClient();
  const template = pickMessage(STEP_MESSAGES, stepTitle + journeyTitle);
  const message = template(stepTitle, journeyTitle);

  await supabase.from("nudges").insert({
    user_id: userId,
    message,
    dismissed: false,
  });

  revalidatePath("/home");
}

// ── Create nudge for completing an entire journey ────────────────────────────
// Call this from the journey action when all steps are marked complete.

export async function createNudgeForJourney(
  userId: string,
  journeyTitle: string
) {
  const supabase = await createClient();
  const template = pickMessage(JOURNEY_MESSAGES, journeyTitle);
  const message = template(journeyTitle);

  await supabase.from("nudges").insert({
    user_id: userId,
    message,
    dismissed: false,
  });

  revalidatePath("/home");
}
