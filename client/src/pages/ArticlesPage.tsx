import type { Article } from "../types/article";
import ArticleCard from "../components/articles/articleCard";

import React from 'react'


//TEST
const testArticles: Article[] = [
  {
    id: "1",
    article_title: "Så skriver du ett bra CV",
    article_description: "Fem enkla tips för att förbättra ditt CV.",
    article_text: "Här kommer hela artikeltexten senare.",
    required_subscription_level_id: 1,
    created_by: null,
    created_at: "2026-09-22",
    updated_at: "2026-09-22",
  },
  {
    id: "2",
    article_title: "Förbered dig inför arbetsintervjun",
    article_description: "Så känner du dig mer förberedd inför intervjun.",
    article_text: "Här kommer hela artikeltexten senare.",
    required_subscription_level_id: 2,
    created_by: null,
    created_at: "2026-09-22",
    updated_at: "2026-09-22",
  },
];

function ArticlesPage(){
  return(
    <main className="container">
      <h1>Artiklar</h1>

      {testArticles.map((article) =>(
        <ArticleCard key={article.id} article={article} />
      ))}

    </main>
  );
};

export default ArticlesPage;