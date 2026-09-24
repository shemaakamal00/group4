import type { Request, Response } from "express";
import type { ArticleInput } from "../types/article";
import * as service from "../services/articleService";


//Plockar explicit ut de properties vi använder och 
// säkrar att inget "skräp" kommer med i body 
function pickArticleFields(body: any): ArticleInput{
  const{
    article_title,
    article_description,
    article_text,
    required_subscription_level_id,
  } = body;

  return {
    article_title,
    article_description,
    article_text,
    required_subscription_level_id,
  };
}

export async function create(req: Request, res: Response){
  const fields = pickArticleFields(req.body);

  if (!fields.article_title?.trim() || !fields.article_text?.trim()){

    return res.status(400).json({
      error: 'Titel och artikeltext får inte vara tomma!',
    });
  }

  fields.article_title = fields.article_title.trim();
  fields.article_text = fields.article_text.trim();

  const {data, error} = await service.createArticle(
    req.user!.id,
    fields,
  );

  if (error){
    return res.status(500).json({
      error: error.message,
    });
  };

  res.status(201).json(data);
};