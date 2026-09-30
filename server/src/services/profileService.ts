import { supabase } from "./supabase";

// Hämtar profil + nivåinfo
export async function getProfile(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("first_name, last_name, role, level_id")
    .eq("id", userId)
    .single();
  if (profileError) return { data: null, error: profileError };

  const { data: level, error: levelError } = await supabase
    .from("subscription_level")
    .select("level_name, access_level")
    .eq("id", profile.level_id)
    .single();
  if (levelError) return { data: null, error: levelError };

  return {
    data: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
      level_name: level.level_name,
      access_level: level.access_level,
    },
    error: null,
  };
}

// Uppdaterar för- och efternamn
export function updateProfile(
  userId: string,
  input: { first_name: string; last_name: string },
) {
  return supabase
    .from("profile")
    .update(input)
    .eq("id", userId)
    .select("first_name, last_name")
    .single();
}