import { Link } from "react-router-dom";

import type { ArticleSummary } from "../../types/article";


//Wrapper-type: Vad ska ArticleCard ta emot för props? 
type ArticleCardProps = {
  article: ArticleSummary;
  onUpgrade: ()=> void;
};

//article_description renderas endast om det FINNS en article description- nullable. 
function ArticleCard({article, onUpgrade}: ArticleCardProps){

  if(article.is_locked){
    return(

      <article className='article-card article-card--locked'>

        <div className='article-card_content'>

          <h2>{article.article_title}</h2>
          {article.article_description && (<p>{article.article_description}</p>)}

        </div>

        <div className='article-card_locked-content'>

          <p>Detta är en {article.subscription_level.level_name}-artikel.</p>
          <p>Uppgradera för att läsa!</p>
    

          <button type ='button' className='btn btn--primary' onClick={onUpgrade}>
            Uppgradera
          </button>

        </div>
      </article>
    );
  };

  return(

    <Link to={`/articles/${article.id}`} className = 'article-card_link'>
      <article className='card article-card'>

        <h2>{article.article_title}</h2>

        {article.article_description && (
          <p>{article.article_description}</p>
        )}

      </article>
    </Link>

  );
};

export default ArticleCard;