import { supabase } from "./supabase";
import type { ArticleInput } from "../types/article";

export function createArticle(userId: string, input: ArticleInput,){

  return supabase
    .from("article")
    .insert({
      ...input,
      created_by: userId,
    })
    .select()
    .single();
};

export function getArticles() {
  return supabase
    .from("article")
    .select("*")
    .order("created_at", { ascending: false });
}