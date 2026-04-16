import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { User } from "../types/user.types";

interface DeleteAdminDialogProps {
  admin: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAdminDialog({
  admin,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAdminDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Delete administrator"
      description={
        <>
          Are you sure you want to delete <strong>{admin.name}</strong>?
          <br />
          <br />
          <span className="text-red-600 font-semibold">
            This action cannot be undone.
          </span>
        </>
      }
      confirmText="Delete"
      variant="destructive"
      icon={Trash2}
    />
  );
}
