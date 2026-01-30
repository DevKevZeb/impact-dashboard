import { CheckCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { User } from "../types/user.types";

interface ApproveUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ApproveUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ApproveUserDialogProps) {
  if (!user) return null;

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Approve User"
      description={
        <>
          Are you sure you want to approve <strong>{user.name}</strong>?
          <br />
          <br />
          This user will be able to log in and access the system with their
          assigned role: <strong>{user.roles.map((r) => r.name).join(", ")}</strong>
        </>
      }
      confirmText="Approve"
      variant="success"
      icon={CheckCircle}
    />
  );
}
