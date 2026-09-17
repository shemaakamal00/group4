import { useState } from "react";

//components
import Modal from "../src/components/shared/modal"

function App() {

  //Modal-öppen/stängd-state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return(
    <main className="container">
      <h1>KarriärKoll</h1>

      <button type="button" className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
        Modal-testknapp
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>Innehåll per källa! Exempel:</p>
        <br></br>

        <section className="placeholder-content">
            <h1>Registrera dig</h1>
            <form>
                <input placeholder="Förnamn"></input>
                <br></br>
                <input placeholder="Efternamn"></input>
                <br></br>
                <input placeholder="Email"></input>
                <br></br>
                <input placeholder="Lösenord"></input>
                <br></br>
                <input placeholder="Repetera lösenord"></input>
                <br></br>
                <button>Registrera</button>
            </form>
        </section>
        

      </Modal>
    </main>
  );
};

export default App;