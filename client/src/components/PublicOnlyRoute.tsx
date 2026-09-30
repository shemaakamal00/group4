import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

type PublicOnlyRouteProps = {
  children: ReactNode;
};

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return <p>Laddar...</p>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default PublicOnlyRoute;