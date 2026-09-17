import type { ReactNode } from "react";

//Modal-props setup
type ModalProps ={
  isOpen: boolean;
  onClose: () => void; //onClose = ska innehålla en void-funktion (ska inte returnera något relevant)
  children: ReactNode; //Säger att innehållet kan vara sånt som React kan rendera
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return(
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__head">
          <h2>Modal-mall</h2>

          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Stäng
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;