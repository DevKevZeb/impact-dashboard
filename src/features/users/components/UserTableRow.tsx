import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserStatusBadge } from "./UserStatusBadge";
import { Can } from "@/features/auth/components/Can";
import { SCOPES } from "@/features/auth/utils/permissions";
import { Button } from "@/components/ui/button";
import { DataTableRow, DataTableCell } from "@/shared/components/table";
import type { User } from "../types/user.types";

interface UserTableRowProps {
  user: User;
  index: number;
  onApprove?: (user: User) => void;
  onReject: (user: User) => void;
  showApprove?: boolean;
}

export function UserTableRow({ user, index, onApprove, onReject, showApprove = true }: UserTableRowProps) {
  return (
    <DataTableRow>
      {/* # - Fixed small width (Frontend index, not DB ID) */}
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

      {/* Country - Medium width */}
      <DataTableCell className="min-w-[140px] whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {user.countries && user.countries.length > 0 
            ? user.countries.map(c => c.name).join(', ') 
            : <span className="text-gray-400">—</span>
          }
        </div>
      </DataTableCell>

      {/* Role - Medium width */}
      <DataTableCell className="min-w-[140px]">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <span
              key={role.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap"
            >
              {role.name}
            </span>
          ))}
        </div>
      </DataTableCell>

      {/* State - Fixed small width */}
      <DataTableCell className="w-32 whitespace-nowrap">
        {user.userState ? (
          <UserStatusBadge state={user.userState.name} />
        ) : (
          <span className="text-xs text-gray-400">Unknown</span>
        )}
      </DataTableCell>

      {/* Registered - Medium width */}
      <DataTableCell className="min-w-[140px] whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </div>
      </DataTableCell>

      {/* Actions - Larger fixed width for two buttons */}
      <DataTableCell className="w-48 whitespace-nowrap">
        {user.userState && user.userState.name.toLowerCase() === "pending" && (
          <Can scope={SCOPES.USERS_WRITE}>
            <div className="flex items-center gap-2">
              {showApprove && onApprove && (
                <Button
                  size="sm"
                  onClick={() => onApprove(user)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => onReject(user)}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </Can>
        )}
        {user.userState && user.userState.name.toLowerCase() === "unverified" && (
          <Can scope={SCOPES.USERS_WRITE}>
            <Button
              size="sm"
              onClick={() => onReject(user)}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </Can>
        )}
        {user.userState && user.userState.name.toLowerCase() === "active" && (
          <span className="text-xs text-gray-400">Active</span>
        )}
      </DataTableCell>
    </DataTableRow>
  );
}
