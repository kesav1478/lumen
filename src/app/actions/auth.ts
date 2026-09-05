"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Guarantees a profiles row exists for the given user.
 * Only inserts `id` — the one column guaranteed to exist as the primary key.
 * Safe to call on every login/signup; exits early if the row is already there.
 */
async function ensureProfile(supabase: SupabaseClient, userId: string) {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("[ensureProfile] select error:", selectError.message);
    return;
  }

  if (existing) return; // row already present — nothing to do

  const { error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId });

  if (insertError) {
    console.error("[ensureProfile] insert error:", insertError.message);
  }
}

// ── Sign up ───────────────────────────────────────────────────────────────────

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureProfile(supabase, data.user.id);
  }

  redirect("/home");
}

// ── Log in ────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureProfile(supabase, data.user.id);
  }

  redirect("/home");
}

// ── Log out ───────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
