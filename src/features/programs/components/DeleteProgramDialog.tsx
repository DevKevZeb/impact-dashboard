import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { Program } from "../types/program.types";

interface DeleteProgramDialogProps {
  program: Program;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteProgramDialog({
  program,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteProgramDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Program"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{program.name}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
