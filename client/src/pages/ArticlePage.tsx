import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import {apiFetch} from "../lib/api";

import type {Article} from "../types/article";

function ArticlePage() {

  const {id} = useParams();
  const [article, setArticle] = useState <Article | null> (null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadArticle(){

      setIsLoading(true);
      setErrorMessage('');
      setArticle(null);

      if (!id){
        setErrorMessage('Artikel-ID saknas!')
        setIsLoading(false)
        return;
      };

      try{
        const data = await apiFetch<Article>(`/api/articles/${id}`);
        setArticle(data);

      } catch (error) {

        console.error('Kunde inte hämta artikeln:', error);

        setErrorMessage(error instanceof Error
          ? error.message
          : 'Kunde inte hämta artikeln'
        );

      }finally{
        setIsLoading(false)
      };
    };

    loadArticle();
  }, [id]);

  if (isLoading){
    return (
      <main className='container'>
        <p>Laddar artikeln...</p>
      </main>
    );
  };

  if(errorMessage){
    return (
      <main className='container'>
        <p>{errorMessage}</p>
      </main>
    );
  };

  if(!article){
    return(
      <main className='container'>
        <p>Artikeln kunde inte hittas</p>
      </main>
    )
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