import { useParams } from "react-router-dom";

function ArticlePage() {
  const {id} = useParams();

  return (
    <main className='container'>
      <h1>Artikel</h1>
      <p>Artikelns ID är: {id}</p>
    </main>
  );
};

export default ArticlePage;