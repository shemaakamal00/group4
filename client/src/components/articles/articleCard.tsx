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

  if(article.is_locked){
    return(

      <article className='article-card article-card--locked'>

      {onEdit &&(
          <button type='button' className='article-card_edit' onClick={onEdit}>
            Redigera
          </button>
        )}

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
    <article className='card article-card'>

      {onEdit &&(
        <button type='button' className='article-card_edit' onClick={onEdit}>
          Redigera
        </button>
      )}

      <Link to={`/articles/${article.id}`} className='article-card_link'>
        <h2>{article.article_title}</h2>

        {article.article_description && (<p>{article.article_description}</p>)}
      </Link>

    </article>
  );
};

export default ArticleCard;