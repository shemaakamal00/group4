export type Article = {
  id: string;
  article_title: string;
  article_description: string | null;
  article_text: string;
  required_subscription_level_id: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateArticleData ={
  article_title: string;
  article_description: string | null;
  article_text: string;
  required_subscription_level_id: number;
};

export type ArticleSummary = {
  id: string;
  article_title: string;
  article_description: string | null;
  required_subscription_level_id: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};