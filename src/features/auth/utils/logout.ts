import { useAuthStore } from "../store/authStore";

/**
 * Handles unauthorized access (401 errors)
 * Clears all authentication state
 * Note: Navigation to /login is handled automatically by PrivateRoute guard
 */
export function handleUnauthorized(): void {
  // Clear Zustand auth store
  const authStore = useAuthStore.getState();
  authStore.logout();
  
  // Note: No manual redirect needed
  // PrivateRoute will automatically redirect to /login when it detects isAuthenticated=false
  // This avoids a full page reload and provides instant SPA navigation
}

/**
 * Check if a valid token exists in localStorage
 */
export function hasValidToken(): boolean {
  const token = localStorage.getItem("auth_token");
  return !!token;
}
