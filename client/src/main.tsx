import { AuthProvider } from "./context/AuthContext";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";

import "./styles/main.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
