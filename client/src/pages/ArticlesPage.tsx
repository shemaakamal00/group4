import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";


import ArticleCard from "../components/articles/ArticleCard";
import ArticleModal from "../components/articles/ArticleModal";
import { useUpgradeModal } from "../context/UpgradeModalContext";

import type { Article, ArticleSummary } from "../types/article";
import type {Profile} from "../types/profile";

import "../styles/articlesPage.css";


function ArticlesPage(){

  const { openUpgradeModal } = useUpgradeModal();
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState <Article |null>(null);

  //innehåller en !array av Article!
  const [articles, setArticles] = useState<ArticleSummary[]> ([]);
  const [profile, setProfile] = useState<Profile | null>(null);

    const isAdmin = profile?.role === "admin";

  async function loadArticles() {
    try{
      const data = await apiFetch<ArticleSummary[]>('/api/articles');
      setArticles(data);
    } catch (error) {
      console.error('Kunde inte hämta artiklar:', error);
    }
  }

    async function loadProfile() {
    try {
      const data = await apiFetch<Profile>("/api/profile");
      setProfile(data);
    } catch (error) {
      console.error("Kunde inte hämta profilen:", error);
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
    loadProfile();
  }, []);

  
  {/* TODO: Skicka ENDAST onEdit för admins */}
  return(
    <main className='container articles-page'>

      <div className='articles-page_head'>
        <div>
          <h1>Artiklar</h1>
          <p className='subtitle'> Tips och guider för ditt jobbsökande </p>
        </div>

        {isAdmin && (
          <button
            type='button'
            className='btn btn--primary articles-page_create'
            onClick={() => {
              setSelectedArticle(null);
              setIsArticleModalOpen(true);
            }}
          >
            Skapa artikel
          </button>
        )}
      </div>

      {articles.length === 0 ?(<p>Det finns inga tillgängliga artiklar än!</p>):
      (
        <div className='article-grid'>
          {articles.map((article) =>(

            <ArticleCard key = {article.id} article={article} 
              onUpgrade={openUpgradeModal} 
              onEdit={ isAdmin ? () => handleEditArticle(article.id) : undefined}
            />

          ))}
        </div>
      )}

      {isAdmin && (
        <ArticleModal isOpen={isArticleModalOpen} 
          onClose={() => setIsArticleModalOpen(false)}
          onSaved={loadArticles}
          article={selectedArticle}
        />
      )}

    </main>
  );
};

export default ArticlesPage;