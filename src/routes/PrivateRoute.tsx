import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useRef } from "react";
import { handleUnauthorized } from "@/features/auth/utils/logout";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hasHandledLogout = useRef(false);

  // Sync check: ensure token exists if Zustand says user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    
    // Auth state mismatch - force logout to maintain consistency
    if (isAuthenticated && !token && !hasHandledLogout.current) {
      hasHandledLogout.current = true;
      handleUnauthorized();
    }
    
    // Reset flag when user logs back in
    if (isAuthenticated && token) {
      hasHandledLogout.current = false;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
