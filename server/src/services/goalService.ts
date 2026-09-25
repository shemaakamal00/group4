import { supabase } from "./supabase";
import type { GoalInput } from "../types/goal";

function goalLimitFor(accessLevel: number): number | null {
  if (accessLevel >= 3) return null;
  if (accessLevel >= 2) return 2;
  return 0;
}

export function listGoals(userId: string) {
  return supabase
    .from("goal")
    .select("*, goal_criteria(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export function deleteGoal(userId: string, id: string) {
  return supabase.from("goal").delete().eq("user_id", userId).eq("id", id);
}

export async function createGoal(userId: string, input: GoalInput) {
  const { data: goal, error: goalError } = await supabase
    .from("goal")
    .insert({
      user_id: userId,
      goal_name: input.goal_name,
      goal_description: input.goal_description ?? null,
    })
    .select()
    .single();

  if (goalError) return { data: null, error: goalError };

  if (input.criteria.length > 0) {
    const rows = input.criteria.map((c) => ({
      goal_id: goal.id,
      criteria_name: c.criteria_name,
      is_done: c.is_done,
    }));
    const { error: criteriaError } = await supabase
      .from("goal_criteria")
      .insert(rows);
    if (criteriaError) {
      // Rollback: radera målet så vi inte får ett halvskapat mål
      await supabase.from("goal").delete().eq("id", goal.id);
      return { data: null, error: criteriaError };
    }
  }

  return { data: goal, error: null };
}

export async function updateGoal(userId: string, id: string, input: GoalInput) {
  const { data: goal, error: goalError } = await supabase
    .from("goal")
    .update({
      goal_name: input.goal_name,
      goal_description: input.goal_description ?? null,
    })
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();

  if (goalError) return { data: null, error: goalError };

  const { error: deleteError } = await supabase
    .from("goal_criteria")
    .delete()
    .eq("goal_id", id);
  if (deleteError) return { data: null, error: deleteError };

  if (input.criteria.length > 0) {
    const rows = input.criteria.map((c) => ({
      goal_id: id,
      criteria_name: c.criteria_name,
      is_done: c.is_done,
    }));
    const { error: insertError } = await supabase
      .from("goal_criteria")
      .insert(rows);
    if (insertError) return { data: null, error: insertError };
  }
  return { data: goal, error: null };
}

export async function getGoalUsage(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("level_id")
    .eq("id", userId)
    .single();
  if (profileError) return { data: null, error: profileError };

  const { data: level, error: levelError } = await supabase
    .from("subscription_level")
    .select("level_name, access_level")
    .eq("id", profile.level_id)
    .single();
  if (levelError) return { data: null, error: levelError };

  const { data: goals, error: countError } = await supabase
    .from("goal")
    .select("id")
    .eq("user_id", userId);
  if (countError) return { data: null, error: countError };

  return {
    data: {
      used: goals?.length ?? 0,
      limit: goalLimitFor(level.access_level as number),
      level_name: level.level_name as string,
      access_level: level.access_level as number,
    },
    error: null,
  };
}
