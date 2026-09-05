"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upserts a row in the profiles table for the given user.
 * Safe to call on every signup AND login — if the row already exists
 * (matched by the primary key `id`) it leaves it untouched.
 */
async function ensureProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | undefined,
  displayName?: string
) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: email ?? null,
      display_name: displayName ?? null,
    },
    {
      onConflict: "id",      // primary key — no-op if the row already exists
      ignoreDuplicates: true, // don't overwrite existing data on conflict
    }
  );

  if (error) {
    // Non-fatal: log and continue. The app degrades gracefully to "Traveller".
    console.error("[ensureProfile] error:", error.message);
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
    await ensureProfile(supabase, data.user.id, data.user.email);
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

  // Guarantee a profile row exists — handles users who signed up before
  // profile creation was reliable, or whose insert silently failed.
  if (data.user) {
    await ensureProfile(supabase, data.user.id, data.user.email);
  }

  redirect("/home");
}

// ── Log out ───────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
