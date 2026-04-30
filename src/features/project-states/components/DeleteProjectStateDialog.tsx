import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { ProjectState } from "../types/projectstate.types";

interface DeleteProjectStateDialogProps {
  projectState: ProjectState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteProjectStateDialog({
  projectState,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteProjectStateDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Project Status"
      description={
        <>
          This action is permanent. Are you sure you want to delete the project status{" "}
          <span className="font-semibold">"{projectState.state}"</span>?
        </>
      }
      confirmText="Delete"
    />
  );
}
