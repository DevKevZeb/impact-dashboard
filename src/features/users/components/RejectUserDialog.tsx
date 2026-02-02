import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { User } from "../types/user.types";

interface RejectUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function RejectUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: RejectUserDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Delete User"
      description={
        <>
          Are you sure you want to permanently delete <strong>{user.name}</strong>?
          <br />
          <br />
          <span className="text-red-600 font-semibold">⚠️ This action cannot be undone.</span>
          <br />
          The user account will be completely removed from the database.
        </>
      }
      confirmText="Delete"
      variant="destructive"
      icon={XCircle}
    />
  );
}
