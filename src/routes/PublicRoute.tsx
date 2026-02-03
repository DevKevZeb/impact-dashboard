import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app"  replace />;
  }
  return <>{children}</>;
}