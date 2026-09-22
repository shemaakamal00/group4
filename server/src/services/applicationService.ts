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
