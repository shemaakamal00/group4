import { Link } from "react-router-dom";

import type { ArticleSummary } from "../../types/article";


//Wrapper-type: Vad ska ArticleCard ta emot för props? 
type ArticleCardProps = {
  article: ArticleSummary;
  onUpgrade: ()=> void;
  onEdit?: () => void;
};

//article_description renderas endast om det FINNS en article description- nullable. 
function ArticleCard({article, onUpgrade, onEdit}: ArticleCardProps){

  //Admin får alltid redigeringsversionen av kortet
  if (onEdit){
    return (
      <article className='card article-card'>

      <Link to={`/articles/${article.id}`} className='article-card_link'>
          <div className='article-card_content'>

            <h2>{article.article_title}</h2>

            {article.article_description && (
              <p>{article.article_description}</p>
            )}
          </div>
        </Link>

        <div className='article-card_actions'>
          <button
            type='button'
            className='btn btn--secondary'
            onClick={onEdit}
          >
            Redigera
          </button>
        </div>

      </article>
    );
  }

  if(article.is_locked){
    return(

      <article className='article-card article-card--locked'>

        <div className='article-card_content'>

          <h2>{article.article_title}</h2>
          {article.article_description && (<p>{article.article_description}</p>)}

        </div>

        <div className='article-card_locked-content'>

          <p>Detta är en {article.subscription_level.level_name}-artikel</p>
          <p>Uppgradera för att läsa!</p>
    

          <button type ='button' className='btn btn--primary' onClick={onUpgrade}>
            Uppgradera
          </button>

        </div>
      </article>
    );
  };

  return(
    <Link to={`/articles/${article.id}`} className='card article-card article-card_link'>
      <div className='article-card_content'>
        <h2>{article.article_title}</h2>

        {article.article_description && (<p>{article.article_description}</p>)}
      </div>
    </Link>
  );
};

export default ArticleCard;