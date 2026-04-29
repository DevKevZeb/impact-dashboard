import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { ProgramState } from "../types/programState.types";

interface ProgramStateDeleteDialogProps {
  programState: ProgramState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ProgramStateDeleteDialog({
  programState,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ProgramStateDeleteDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Program Status"
      description={
        <>
          This action is permanent. Are you sure you want to delete the status{" "}
          <span className="font-semibold">"{programState.name}"</span>?
        </>
      }
      confirmText="Delete"
    />
  );
}
