import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserStatusBadge } from "./UserStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "../types/user.types";

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            👤 User Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  ID
                </label>
                <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Status & Roles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
              Status & Roles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </label>
                <div className="mt-1">
                  <UserStatusBadge state={user.userState.name} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Roles
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {role.name === "project-manager"
                        ? "Project Manager"
                        : role.name === "country-manager"
                          ? "Country Manager"
                          : role.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
              Dates
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Registration Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatFullDate(user.createdAt)}
                  <span className="text-gray-500 text-xs ml-2">
                    ({formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })})
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Last Update
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatFullDate(user.updatedAt)}
                  <span className="text-gray-500 text-xs ml-2">
                    ({formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
