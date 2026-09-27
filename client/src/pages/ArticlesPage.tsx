import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

import ArticleCard from "../components/articles/articleCard";
import ArticleModal from "../components/articles/articleModal";

import type { Article, ArticleSummary } from "../types/article";



function ArticlesPage(){

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState <Article |null>(null);

  //innehåller en !array av Article!
  const [articles, setArticles] = useState<ArticleSummary[]> ([]);


  async function loadArticles() {
    try{
      const data = await apiFetch<ArticleSummary[]>('/api/articles');
      setArticles(data);
    } catch (error) {
      console.error('Kunde inte hämta artiklar:', error);
    }
  }

  async function handleEditArticle(articleId: string) {
  try {
    const article = await apiFetch<Article>(
      `/api/articles/${articleId}`
    );

    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  } catch (error) {
    console.error('Kunde inte hämta artikeln för redigering:', error);
  }
}

  useEffect(() => {
    loadArticles();
  }, []);

  
  {/* TODO: Skicka ENDAST onEdit för admins */}
  return(
    <main className='container'>
      <h1>Artiklar</h1>

      {articles.length === 0 ?(<p>Det finns inga tillgängliga artiklar än!</p>):
      (
        <div className='article-grid'>
          {articles.map((article) =>(

            <ArticleCard key = {article.id} article={article} 
              onUpgrade={()=>{
                console.log('Öppna uppgradering för:', article.id);
              }} 

              
              onEdit={() => handleEditArticle(article.id)}
            />

          ))}
        </div>
      )}
      

      <button type='button' 
        className='btn btn--primary create-article-btn' 
        onClick={() => {setSelectedArticle(null); setIsArticleModalOpen(true);}}
      >
        Skapa artikel
      </button>

      <ArticleModal isOpen={isArticleModalOpen} 
        onClose={() => setIsArticleModalOpen(false)}
        onSaved={loadArticles}
        article={selectedArticle}
      />

    </main>
  );
};

export default ArticlesPage;