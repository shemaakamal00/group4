import {supabase} from "./supabase";


//NOTE: Email hämtas inte här, finns redan i session
export function getProfile(userId: string){
  return supabase
    .from('profile')
    .select(`
      id,
      first_name,
      last_name,
      role,
      level_id,
      created_at,
      subscription_level(
        level_name,
        access_level
        )
    `)
    .eq('id', userId)
    .single();
};