import { Routes, Route } from "react-router-dom";

//Pages

import ApplicationPage from "./pages/ApplicationsPage/ApplicationsPage";
import HomePage from "./pages/HomePage/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

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
          <ProtectedRoute>
            <ArticlesPage />
          </ProtectedRoute>

        }
      />

      <Route
        path="/articles/:id"
        element={
          <ProtectedRoute>
            <ArticlePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
