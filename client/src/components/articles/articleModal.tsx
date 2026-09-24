import { useState } from "react";

import { apiFetch } from "../../lib/api";

import type { Article, CreateArticleData } from "../../types/article";
import Modal from "../shared/modal";

type ArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ArticleModal({isOpen, onClose}: ArticleModalProps){

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [articleText, setArticleText] = useState('');
  const [requiredLevel, setRequiredLevel] = useState(1);

  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');

    const articleData: CreateArticleData = {
      article_title: title,
      article_description: description || null,
      article_text: articleText,
      required_subscription_level_id: requiredLevel,
    };

    try{
      const createdArticle = await apiFetch<Article>('/api/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });

      console.log('Artikel skapad:', createdArticle);

      onClose();

    }catch (error){
      console.error('Kunde inte skapa artikel:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Kunde inte skapa artikeln'
      );
    };
  };

  //OBS. Kommer alternativt lägga in beskrivande placeholders ist för labels. Stilfråga- diskutera med grupp
  return(
    <Modal isOpen={isOpen} onClose={onClose} title='Skapa artikel'>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='article-title'>Titel</label>
          <input
            id='article-title'
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='article-description'>Beskrivning</label>
          <textarea
            id='article-description'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='article-text'>Artikeltext</label>
          <textarea
            id='article-text'
            value={articleText}
            onChange={(event) => setArticleText(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='required-level'>Prenumerationsnivå</label>
          <select
            id='required-level'
            value={requiredLevel}
            onChange={(event) => setRequiredLevel(Number(event.target.value))}
          >
            <option value={1}>Grundpaket</option>
            <option value={2}>Plus</option>
            <option value={3}>Premium</option>
          </select>
        </div>

        {errorMessage && (<p className="form-error">{errorMessage}</p>)}

        <button type='submit' className='btn btn--primary'>
          Skapa artikel
        </button>
      </form>
    </Modal>
  );
};

export default ArticleModal;