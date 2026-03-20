import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { ProjectTable } from "../types/project.types";

interface DeleteProjectDialogProps {
  project: ProjectTable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Delete Project"
      description={
        <>
          Are you sure you want to permanently delete <strong>{project.name}</strong>?
          <br />
          <br />
          <span className="text-red-600 font-semibold">Warning: This action cannot be undone.</span>
          <br />
          The project and its related assignments will be permanently removed.
        </>
      }
      confirmText="Delete"
      variant="destructive"
      icon={XCircle}
    />
  );
}
