import { supabase } from "./supabase";
import type { ArticleInput } from "../types/article";

export function createArticle(userId: string, input: ArticleInput,){

  return supabase
    .from('article')
    .insert({
      ...input,
      created_by: userId,
    })
    .select()
    .single();
};

//Note: article_text hämtas INTE. Denna get används då ArticlesPage hämtar articleCard's, 
//och dessa ska INTE visa article_text.
export function getArticles() {
  return supabase
    .from('article')
    .select(`
      id,
      article_title,
      article_description,
      required_subscription_level_id,
      created_by,
      created_at,
      updated_at
      `)
    .order('created_at', { ascending: false });
}

export function getArticleById(id: string){
  return supabase
    .from('article')
    .select('*')
    .eq('id', id)//Behåller bara raden där kolumnen "id" = värdet i variabeln 'id'
    .single();
}