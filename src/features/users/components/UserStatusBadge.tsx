import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  state: string;
}

/**
 * Determina el estilo del badge basado en palabras clave del estado.
 * Es dinámico: funciona con CUALQUIER estado del backend sin modificar código.
 */
function getStateBadgeStyle(state: string): string {
  const stateLower = state.toLowerCase();

  // Buscar palabras clave para determinar el color (no hardcodea estados específicos)
  if (stateLower.includes("active") || stateLower.includes("approved")) {
    return "bg-green-100 text-green-700 border-green-200";
  }
  
  if (stateLower.includes("pending") || stateLower.includes("awaiting")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  
  if (stateLower.includes("unverified") || stateLower.includes("verification")) {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  
  if (stateLower.includes("inactive") || stateLower.includes("disabled") || stateLower.includes("suspended")) {
    return "bg-gray-100 text-gray-700 border-gray-200";
  }
  
  if (stateLower.includes("rejected") || stateLower.includes("banned") || stateLower.includes("deleted")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  // Fallback para estados desconocidos: azul neutral
  return "bg-blue-100 text-blue-700 border-blue-200";
}

/**
 * Formatea el nombre del estado para mostrar (capitaliza palabras)
 */
function formatStateLabel(state: string): string {
  return state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function UserStatusBadge({ state }: UserStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStateBadgeStyle(state)
      )}
    >
      {formatStateLabel(state)}
    </span>
  );
}
