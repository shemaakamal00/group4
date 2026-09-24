import { Link } from "react-router-dom";

import type { ArticleSummary } from "../../types/article";


//Wrapper-type: Vad ska ArticleCard ta emot för props? 
type ArticleCardProps = {
  article: ArticleSummary;
};

//article_description renderas endast om det FINNS en article description- nullable. 
function ArticleCard({article}: ArticleCardProps){
  return(

    <Link to={`/articles/${article.id}`}>
      <article>

        <h2>{article.article_title}</h2>

        {article.article_description && (
          <p>{article.article_description}</p>
        )}

      </article>
    </Link>

  );
};

export default ArticleCard;