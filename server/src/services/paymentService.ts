import { supabase } from "./supabase";

function getLevel(levelId: number) {
  return supabase
    .from("subscription_level")
    .select("id, level_name, price")
    .eq("id", levelId)
    .single();
}

export async function purchaseLevel(userId: string, levelId: number) {
  const { data: level, error: levelError } = await getLevel(levelId);
  if (levelError || !level) {
    return { data: null, error: levelError ?? new Error("Nivån hittades inte") };
  }

  const { data: currentProfile, error: profileFetchError } = await supabase
    .from("profile")
    .select("level_id")
    .eq("id", userId)
    .single();
  if (profileFetchError || !currentProfile) {
    return { data: null, error: profileFetchError ?? new Error("Profilen hittades inte") };
  }

  if (currentProfile.level_id === levelId) {
    return { data: null, error: new Error("Du har redan den här nivån") };
  }

  if (Number(level.price) === 0) {
    const { error: profileError } = await supabase
      .from("profile")
      .update({ level_id: levelId })
      .eq("id", userId);
    if (profileError) return { data: null, error: profileError };

    return {
      data: { level_name: level.level_name, total: 0, is_free: true },
      error: null,
    };
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payment")
    .insert({
      user_id: userId,
      subscription_level_id: levelId,
      total: level.price,
      status: "Genomförd",
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (paymentError) return { data: null, error: paymentError };

  const { error: profileError } = await supabase
    .from("profile")
    .update({ level_id: levelId })
    .eq("id", userId);
  if (profileError) return { data: null, error: profileError };

  return { data: { ...payment, level_name: level.level_name }, error: null };
}

export async function listPayments(userId: string) {
  const { data, error } = await supabase
    .from("payment")
    .select("id, total, status, created_at, paid_at, subscription_level(level_name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const payments = data.map((row) => {
    const level = Array.isArray(row.subscription_level)
      ? row.subscription_level[0]
      : row.subscription_level;

    return {
      id: row.id,
      total: row.total,
      status: row.status,
      created_at: row.created_at,
      paid_at: row.paid_at,
      level_name: level?.level_name ?? "Okänd nivå",
    };
  });

  return { data: payments, error: null };
}