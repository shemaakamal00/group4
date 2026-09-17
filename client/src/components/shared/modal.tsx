import { useEffect, type ReactNode } from "react";

//Modal-types
type ModalProps ={
  isOpen: boolean;
  onClose: () => void; //onClose = ska innehålla en void-funktion (ska inte returnera något relevant). Måste INTE vara en arrow-function.
  title?: string; //"?" = MÅSTE inte användas- alternativ prop.
  children: ReactNode; //ReactNode = TypeScript-typ, precis som t.ex "string": Innehållet måste vara sånt som React kan rendera
};

//Modal-komponenten. Se ** för annat sätt att logiskt skriva hur "function Modal"-raden kan skrivas
function Modal({ isOpen, onClose, title, children }:ModalProps){


    //Stäng modal med ESC-keydown event
    useEffect(() => {

        //Om modalen är stängd, avsluta useEffect
        if (!isOpen){
            return;
        };
    
        //skapar ett keyboard-event 'on escape pressed'
        function handleKeyDown(event: KeyboardEvent){
            if (event.key ==="Escape"){
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };


    }, [isOpen, onClose]);

    //Om modalen är stängd, avsluta funktion
    if (!isOpen){
        return null;
    };


  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__head">
          {title && <h2>{title}</h2>}

          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Stäng
          </button>
        </div>

        {/*HÄR kommer all varierande content ligga */}
        {/*{children} = allt som kommer ligga mellan modalens öppna/stäng-taggar */}
        {children}
        
      </div>
    </div>
  );
}

export default Modal;


/**

 function Modal(props: ModalProps) {
  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const children = props.children;

 ...

} */