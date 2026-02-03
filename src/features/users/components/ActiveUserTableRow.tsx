import { Lock, Unlock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserStatusBadge } from "./UserStatusBadge";
import { Can } from "@/features/auth/components/Can";
import { SCOPES } from "@/features/auth/utils/permissions";
import { Button } from "@/components/ui/button";
import { DataTableRow, DataTableCell } from "@/shared/components/table";
import type { User } from "../types/user.types";

interface ActiveUserTableRowProps {
  user: User;
  index: number;
  onToggleState: (user: User) => void;
}

export function ActiveUserTableRow({
  user,
  index,
  onToggleState,
}: ActiveUserTableRowProps) {
  const isActive = user.userState.name.toLowerCase() === "active";

  return (
    <DataTableRow>
      {/* # - Fixed small width (Frontend index) */}
      <DataTableCell className="w-16 whitespace-nowrap">
        <span className="font-medium text-gray-900">{index}</span>
      </DataTableCell>

      {/* Name - Medium width */}
      <DataTableCell className="min-w-[180px] whitespace-nowrap">
        <div className="font-medium text-gray-900">{user.name}</div>
      </DataTableCell>

      {/* Email - Large width */}
      <DataTableCell className="min-w-[220px] whitespace-nowrap">
        <div className="text-sm text-gray-600">{user.email}</div>
      </DataTableCell>

      {/* Role - Medium width */}
      <DataTableCell className="min-w-[140px]">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <span
              key={role.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap"
            >
              {role.name === "project-manager"
                ? "Project Manager"
                : role.name === "country-manager"
                  ? "Country Manager"
                  : role.name}
            </span>
          ))}
        </div>
      </DataTableCell>

      {/* State - Fixed small width */}
      <DataTableCell className="w-32 whitespace-nowrap">
        <UserStatusBadge state={user.userState.name} />
      </DataTableCell>

      {/* Registered - Medium width */}
      <DataTableCell className="min-w-[140px] whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </div>
      </DataTableCell>

      {/* Actions */}
      <DataTableCell className="w-40 whitespace-nowrap">
        <Can scope={SCOPES.USERS_WRITE}>
          <Button
            size="sm"
            variant={isActive ? "destructive" : "default"}
            onClick={() => onToggleState(user)}
            className={
              isActive
                ? ""
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {isActive ? (
              <>
                <Lock className="w-4 h-4 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-1" />
                Activate
              </>
            )}
          </Button>
        </Can>
      </DataTableCell>
    </DataTableRow>
  );
}
