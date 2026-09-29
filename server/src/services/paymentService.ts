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