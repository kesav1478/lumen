"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ── Create ────────────────────────────────────────────────────────────────────

export async function createCuriosityItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = ((formData.get("title") as string) ?? "").trim();
  const description = ((formData.get("description") as string) ?? "").trim();

  if (!title) return { error: "A title is required." };

  const { error } = await supabase.from("curiosity_items").insert({
    user_id: user.id,
    title,
    description: description || null,
  });

  if (error) return { error: error.message };

  redirect("/curiosity");
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteCuriosityItem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("curiosity_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/curiosity");
}
