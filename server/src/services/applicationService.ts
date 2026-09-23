import { supabase } from "./supabase";
import type { ApplicationInput } from "../types/application";
import { error } from "node:console";

// Listar ansökningar
export function listApplications(userId: string) {
  return supabase
    .from("application")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

// Hämtar ansökningar
export function getApplication(userId: string, id: string) {
  return supabase
    .from("application")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .single();
}

// Skapar en ny ansökan
export function createApplication(userId: string, input: ApplicationInput) {
  return supabase
    .from("application")
    .insert({ ...input, user_id: userId })
    .select()
    .single();
}

// Updaterar ansökningar
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

// Raderar ansökningar
export function deleteApplication(userId: string, id: string) {
  return supabase
    .from("application")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
}

// Hämtar användarens nivå
export async function getUsage(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("level_id")
    .eq("id", userId)
    .single();

  if (profileError) return { data: null, error: profileError };

  // Hämtar nivåns detaljer (tak + namn)
  const { data: level, error: levelError } = await supabase
    .from("subscription_level")
    .select("level_name, application_limit")
    .eq("id", profile.level_id)
    .single();

  if (levelError) return { data: null, error: levelError };

  // Räknar användarens befintliga ansökningar
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

// Hämtar användarens nivå för statistiken
export async function getStats(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("level_id")
    .eq("id", userId)
    .single();

  if (profileError) return { data: null, error: profileError };

  const { data: level, error: levelError } = await supabase
    .from("subscription_level")
    .select("access_level, level_name")
    .eq("id", profile.level_id)
    .single();

  if (levelError) return { data: null, error: levelError };

  // Alla användarens ansökningar
  const { data: apps, error: appsError } = await supabase
    .from("application")
    .select("application_status_id, applied_at, response_date, created_at")
    .eq("user_id", userId);
  if (appsError) return { data: null, error: appsError };

  // Statisnamn för läsbar output
  const { data: statuses, error: statusError } = await supabase
    .from("application_status")
    .select("id, status_name")
    .order("id");
  if (statusError) return { data: null, error: statusError };

  // Nivå 1+ Räknare per status
  const countsByStatus = (statuses ?? []).map((s) => ({
    status_id: s.id as number,
    status_name: s.status_name as string,
    count: (apps ?? []).filter((a) => a.application_status_id === s.id).length,
  }));

  const result: {
    level_name: string;
    access_level: number;
    total: number;
    counts_by_status: {
      status_id: number;
      status_name: string;
      count: number;
    }[];
    applications_per_month?: { month: string; count: number }[];
    insights?: {
      response_rate: number;
      average_days_to_response: number | null;
    };
  } = {
    level_name: level.level_name as string,
    access_level: level.access_level as number,
    total: (apps ?? []).length,
    counts_by_status: countsByStatus,
  };

  // Nivå 2+: diagram data (ansökningar per månad)
  if (level.access_level >= 2) {
    const perMonth = new Map<string, number>();
    for (const app of apps ?? []) {
      const date = app.applied_at ?? app.created_at;
      if (!date) continue;
      const month = String(date).slice(0, 7);
      perMonth.set(month, (perMonth.get(month) ?? 0) + 1);
    }
    result.applications_per_month = Array.from(perMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }

  // Nivå 3+: insikter
  if (level.access_level >= 3) {
    const withResponse = (apps ?? []).filter((a) => a.response_date !== null);
    const responseRate =
      (apps ?? []).length > 0
        ? Math.round((withResponse.length / (apps ?? []).length) * 100)
        : 0;

    let avgDays: number | null = null;
    const daysArr = withResponse
      .filter((a) => a.applied_at && a.response_date)
      .map((a) => {
        const applied = new Date(a.applied_at as string).getTime();
        const responded = new Date(a.response_date as string).getTime();
        return (responded - applied) / (1000 * 60 * 60 * 24);
      });
    if (daysArr.length > 0) {
      avgDays = Math.round(daysArr.reduce((s, d) => s + d, 0) / daysArr.length);
    }

    result.insights = {
      response_rate: responseRate,
      average_days_to_response: avgDays,
    };
  }

  return { data: result, error: null };
}
