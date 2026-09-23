export type ArticleInput = {
  article_title: string;
  article_description?: string | null;
  article_text: string;
  required_subscription_level_id: number;
};