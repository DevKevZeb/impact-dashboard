import { useHasScope, useHasAnyScope, useHasAllScopes } from "../hooks/useHasScope";

interface CanProps {
  scope: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ scope, children, fallback = null }: CanProps) {
  const hasPermission = useHasScope(scope);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface CanAnyProps {
  scopes: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CanAny({ scopes, children, fallback = null }: CanAnyProps) {
  const hasPermission = useHasAnyScope(scopes);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface CanAllProps {
  scopes: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CanAll({ scopes, children, fallback = null }: CanAllProps) {
  const hasPermission = useHasAllScopes(scopes);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
