import type { Article } from "../../types/article";


//Wrapper-type: Vad ska ArticleCard ta emot för props? 
type ArticleCardProps = {
  article: Article;
};

//article_description renderas endast om det FINNS en article description- nullable. 
function ArticleCard({article}: ArticleCardProps){
  return(
    <article>

      <h2>{article.article_title}</h2>

      {article.article_description && (
        <p>{article.article_description}</p>
      )}

    </article>
  );
};

export default ArticleCard;