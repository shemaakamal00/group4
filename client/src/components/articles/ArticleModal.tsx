import { useEffect, useState, SubmitEvent} from "react";
import ModalFooter from "../shared/modalFooter";

import { apiFetch } from "../../lib/api";

import type { Article, CreateArticleData } from "../../types/article";
import Modal from "../shared/modal";

type ArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: ()=> Promise<void>; //"Promise" för används i await/fetch
  article?: Article | null;
};

function ArticleModal({isOpen, onClose, onSaved, article = null}: ArticleModalProps){

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [articleText, setArticleText] = useState('');
  const [requiredLevel, setRequiredLevel] = useState(1);

  const [errorMessage, setErrorMessage] = useState('');

  //Om article finns = "edit mode", annars "create mode"
  const isEditing = article !== null;

  //Om article finns = fyll formulär, om inte = tomt formulär
  useEffect(() =>{
    if (!isOpen) {
      return;
    }

    if (article){
      setTitle(article.article_title);
      setDescription(article.article_description ?? '');
      setArticleText(article.article_text);
      setRequiredLevel(article.required_subscription_level_id);
    } else {
      setTitle('');
      setDescription('');
      setArticleText('');
      setRequiredLevel(1);
    }

    setErrorMessage('');

  },[isOpen, article]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
    event.preventDefault();

    setErrorMessage('');

    const articleData: CreateArticleData ={
      article_title: title,
      article_description: description || null,
      article_text: articleText,
      required_subscription_level_id: requiredLevel,
    };

    try {
      if (article){
        await apiFetch<Article>(`/api/articles/${article.id}`,{
          method: 'PATCH',
          body: JSON.stringify(articleData),
        });
      }else {
        await apiFetch<Article>('/api/articles', {
          method: 'POST',
          body: JSON.stringify(articleData),
        });
      }

      await onSaved();
      onClose();

    }catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Kunde inte spara artikeln'
      );
    }
  };


  async function handleDelete(){
    if (!article) {
      return;
    }

    //Liten varning
    if (!window.confirm("Vill du verkligen ta bort artikeln?")){
      return;
    }

    try{
      await apiFetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
      });

      await onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Kunde inte ta bort artikeln'
      );
    }
  };

  //OBS. Kommer alternativt lägga in beskrivande placeholders ist för labels. Stilfråga- diskutera med grupp
  return(
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Redigera artikel' : 'Skapa artikel'}>

      <form id='article-form' onSubmit={handleSubmit}>
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


      </form>

      {/*Såhär kan ModalFooter användas!! */}
      <ModalFooter>
        {isEditing && (<button type="button" className='btn btn--secondary' onClick ={handleDelete}>
          Ta bort
        </button>)}

        <button type='button' className='btn btn--secondary' onClick={onClose}>
          Avbryt
        </button>

        <button type='submit' form='article-form' className='btn btn--primary'>
          {isEditing ? 'Spara ändringar':'Skapa artikel'}
        </button>
      </ModalFooter>

    </Modal>
  );
};

export default ArticleModal;