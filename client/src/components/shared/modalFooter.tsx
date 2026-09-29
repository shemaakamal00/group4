import type { ReactNode } from "react";

type ModalFooterProps ={
  children: ReactNode;
};

function ModalFooter({ children }: ModalFooterProps){
  return (
    <div className='modal_footer'>
      {children}
    </div>
  );
};

export default ModalFooter;