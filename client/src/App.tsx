import { Routes, Route } from "react-router-dom";

//Pages
import HomePage from "./pages/HomePage/HomePage";
import ApplicationPage from "./pages/HomePage/ApplicationsPage/ApplicationsPage";
import ArticlesPage from "./pages/ArticlesPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationPage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/articles" 
        element={
          //<ProtectedRoute>
            <ArticlesPage />
          //</ProtectedRoute>

        }
      />

    </Routes>
  );
}
