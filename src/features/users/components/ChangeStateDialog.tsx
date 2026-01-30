import { Lock, Unlock } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { User } from "../types/user.types";

interface ChangeStateDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ChangeStateDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ChangeStateDialogProps) {
  if (!user) return null;

  const isActive = user.userState.name.toLowerCase() === "active";
  const action = isActive ? "deactivate" : "activate";
  const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);

  return (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title={`${actionCapitalized} User`}
      description={
        <>
          Are you sure you want to {action}{" "}
          <strong className="text-gray-900">{user.name}</strong>?
        </>
      }
      confirmText={actionCapitalized}
      variant={isActive ? "destructive" : "success"}
      icon={isActive ? Lock : Unlock}
      details={
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">User:</span>
                <span className="text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Current Status:</span>
                <span
                  className={`font-semibold ${isActive ? "text-green-600" : "text-red-600"}`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">New Status:</span>
                <span
                  className={`font-semibold ${!isActive ? "text-green-600" : "text-red-600"}`}
                >
                  {!isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {isActive ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-600 font-semibold">⚠️</span>
              <p className="text-sm text-red-800">
                This user will lose access to the system immediately.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-600 font-semibold">✓</span>
              <p className="text-sm text-green-800">
                This user will regain access to the system.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
