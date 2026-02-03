import { UserStatusBadge } from "./UserStatusBadge";
import { Can } from "@/features/auth/components/Can";
import { SCOPES } from "@/features/auth/utils/permissions";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { User } from "../types/user.types";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableCell,
} from "@/shared/components/table";

interface UsersTableProps {
  users: User[];
  onActivate: (user: User) => void;
}

export function UsersTable({ users, onActivate }: UsersTableProps) {
  return (
    <DataTable>
      <DataTableHeader>
        <tr>
          <DataTableHead>#</DataTableHead>
          <DataTableHead>Name</DataTableHead>
          <DataTableHead>Email</DataTableHead>
          <DataTableHead>Role</DataTableHead>
          <DataTableHead>State</DataTableHead>
          <DataTableHead>Registered</DataTableHead>
          <DataTableHead>Actions</DataTableHead>
        </tr>
      </DataTableHeader>
      <DataTableBody>
        {users.map((user, index) => (
          <DataTableRow key={user.id}>
            <DataTableCell>
              <span className="font-medium text-gray-900">{index + 1}</span>
            </DataTableCell>

            <DataTableCell>
              <div className="font-medium text-gray-900">{user.name}</div>
            </DataTableCell>

            <DataTableCell>
              <div className="text-sm text-gray-600">{user.email}</div>
            </DataTableCell>

            <DataTableCell>
              <div className="text-sm">
                {user.roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </DataTableCell>

            <DataTableCell>
              {user.userState ? (
                <UserStatusBadge state={user.userState.name} />
              ) : (
                <span className="text-xs text-gray-400">Unknown</span>
              )}
            </DataTableCell>

            <DataTableCell>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </div>
            </DataTableCell>

            <DataTableCell>
              {user.userState && user.userState.name.toLowerCase() === "pending" && (
                <Can scope={SCOPES.USERS_WRITE}>
                  <Button
                    size="sm"
                    onClick={() => onActivate(user)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                </Can>
              )}
              {user.userState && user.userState.name.toLowerCase() === "active" && (
                <span className="text-xs text-gray-400">No actions</span>
              )}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
