import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

import ArticleCard from "../components/articles/articleCard";
import ArticleModal from "../components/articles/articleModal";

import type { ArticleSummary } from "../types/article";



function ArticlesPage(){

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  //innehåller en !array av Article!
  const [articles, setArticles] = useState<ArticleSummary[]> ([]);


  useEffect(() =>{
    async function loadArticles(){
      try{
        const data = await apiFetch<ArticleSummary[]>('/api/articles');
        setArticles(data);

      }catch (error){
        console.error('Kunde inte hämta artiklar:', error);

      };
    };

    loadArticles();
  }, []);

  return(
    <main className='container'>
      <h1>Artiklar</h1>

      {articles.length === 0 ?(
        <p>Det finns inga tillgängliga artiklar än!</p>
      ):(
        articles.map((article) =>(
          <ArticleCard key = {article.id} article={article} />
        ))
      )}

      <button type='button' 
        className='btn btn--primary' 
        onClick={() => setIsArticleModalOpen(true)}
      >
        Skapa artikel
      </button>

      <ArticleModal isOpen={isArticleModalOpen} 
        onClose={() => setIsArticleModalOpen(false)}
      />

    </main>
  );
};

export default ArticlesPage;