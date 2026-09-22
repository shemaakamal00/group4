import { supabase } from "./supabase";
import type { ApplicationInput } from "../types/application";

export function listApplications(userId: string) {
  return supabase
    .from("application")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export function getApplication(userId: string, id: string) {
  return supabase
    .from("application")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .single();
}

export function createApplication(userId: string, input: ApplicationInput) {
  return supabase
    .from("application")
    .insert({ ...input, user_id: userId })
    .select()
    .single();
}

export function updateApplication(
  userId: string,
  id: string,
  input: Partial<ApplicationInput>,
) {
  return supabase
    .from("application")
    .update(input)
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();
}

export function deleteApplication(userId: string, id: string) {
  return supabase
    .from("application")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
}

export async function getUsage(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("level_id")
    .eq("id", userId)
    .single();

  if (profileError) return { data: null, error: profileError };

  const { data: level, error: levelError } = await supabase
    .from("subscription_level")
    .select("level_name, application_limit")
    .eq("id", profile.level_id)
    .single();

  if (levelError) return { data: null, error: levelError };

  const { data: userApps, error: countError } = await supabase
    .from("application")
    .select("id")
    .eq("user_id", userId);
  
  if (countError) return { data: null, error: countError };
  
  return {
    data: {
      used: userApps?.length ?? 0,
      limit: level.application_limit as number | null,
      level_name: level.level_name as string,
    },
    error: null,
  };
}
