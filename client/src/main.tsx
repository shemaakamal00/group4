import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//components
import App from "./App";

//css
import "./styles/main.css";

//"!" = non-null assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);