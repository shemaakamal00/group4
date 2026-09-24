import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import {apiFetch} from "../lib/api";

import type {Article} from "../types/article";

function ArticlePage() {

  const {id} = useParams();
  const [article, setArticle] = useState <Article | null> (null);

  useEffect(() => {
    async function loadArticle(){
      if (!id) {
        return;
      }

      try{
        const data = await apiFetch<Article>(`/api/articles/${id}`);
        setArticle(data);

      } catch (error) {
        console.error('Kunde inte hämta artikeln:', error);

      }
    };

    loadArticle();
  }, [id]);

  if (!article){
    return (
      <main className='container'>
        <p>Laddar artikeln...</p>
      </main>
    );
  };

  return(
    <main className="container">
      <article>
        <h1>{article.article_title}</h1>

        {article.article_description && (
          <p>{article.article_description}</p>
        )}

        <p>{article.article_text}</p>
      </article>
    </main>
  );
};

export default ArticlePage;