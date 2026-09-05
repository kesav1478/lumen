"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = ((formData.get("title") as string) ?? "").trim() || "Untitled";
  const content = ((formData.get("content") as string) ?? "").trim();
  const tags = parseTags((formData.get("tags") as string) ?? "");

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title,
    content,
    tags,
    is_favorite: false,
  });

  if (error) return { error: error.message };

  redirect("/notes");
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = ((formData.get("title") as string) ?? "").trim() || "Untitled";
  const content = ((formData.get("content") as string) ?? "").trim();
  const tags = parseTags((formData.get("tags") as string) ?? "");

  const { error } = await supabase
    .from("notes")
    .update({ title, content, tags, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  return { success: true };
}

// ── Toggle favourite ──────────────────────────────────────────────────────────

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notes")
    .update({ is_favorite: !isFavorite })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);

  redirect("/notes");
}
