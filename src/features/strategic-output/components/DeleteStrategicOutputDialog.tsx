import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";

interface DeleteStrategicOutputDialogProps {
  strategicOutputName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteStrategicOutputDialog({
  strategicOutputName,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteStrategicOutputDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Strategic Output"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{strategicOutputName}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
