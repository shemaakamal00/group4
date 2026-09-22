import { Routes, Route } from "react-router-dom";
import ApplicationPage from "./pages/HomePage/ApplicationsPage/ApplicationsPage";
import HomePage from "./pages/HomePage/HomePage";
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
    </Routes>
  );
}
