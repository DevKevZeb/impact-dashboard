import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  state: string;
}

const stateConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending Approval",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

export function UserStatusBadge({ state }: UserStatusBadgeProps) {
  const config = stateConfig[state.toLowerCase()] || stateConfig.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
