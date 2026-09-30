import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import "../Styles/ArticlesPage.css";

import { useAuth } from "../context/AuthContext";

import ArticleCard from "../components/articles/articleCard";
import ArticleModal from "../components/articles/articleModal";

import type { Article, ArticleSummary } from "../types/article";

function ArticlesPage(){

  const { profile, profileLoading } = useAuth();

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState <Article |null>(null);

  //innehåller en !array av Article!
  const [articles, setArticles] = useState<ArticleSummary[]> ([]);

  let isAdmin = profile?.role === 'admin';


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
    
    <main className='container articles-page'>

      <div className='articles-page_head'>
        <div>
          <h1>Artiklar</h1>
          <h3 className='subtitle'>Tips och guider som hjälper dig i ditt jobbsökande!</h3>
        </div>

        {isAdmin && (
          <button type='button' 
            className='btn btn--primary articles-page_create' 
            onClick={() => {setSelectedArticle(null); setIsArticleModalOpen(true);}}
          >
            + Skapa artikel
          </button>
        )}
      </div>

        {articles.length === 0 ?(<p>Det finns inga tillgängliga artiklar än!</p>):
        (
          <div className='article-grid'>
            {articles.map((article) =>(

              <ArticleCard key = {article.id} article={article} 
                onUpgrade={()=>{
                  console.log('Öppna uppgradering för:', article.id);
                }} 

                
                onEdit={ isAdmin ? () => handleEditArticle(article.id): undefined}
              />

            ))}
          </div>
        )}

      <ArticleModal isOpen={isArticleModalOpen} 
        onClose={() => setIsArticleModalOpen(false)}
        onSaved={loadArticles}
        article={selectedArticle}
      />

    </main>
  );
};

export default ArticlesPage;