import React from 'react';

const Modal = ({ show, text, title }) => {
    return (
      <>
        {show ? (
          <div className="modalContainer">
            <div className="modal">
              <header className="modal_header">
                <span className="modal_header-title">{title}</span>
              </header>
              <main className="modal_content roboto-medium">
                {text}
              </main>
              <footer className="modal_footer">
                <button className="modal-close">Entiendo</button>
              </footer>
            </div>
          </div>
        ) : null}
      </>
    );
  };
  
  export default Modal;