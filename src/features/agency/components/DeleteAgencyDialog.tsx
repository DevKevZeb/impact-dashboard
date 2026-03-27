import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { Agency } from "../types/agency.types";

interface DeleteAgencyDialogProps {
  agency: Agency;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteAgencyDialog({
  agency,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAgencyDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Agency"
      description={
        <>
          This action is permanent. Are you sure you want to delete the agency{" "}
          <span className="font-semibold">"{agency.name}"</span>?
        </>
      }
      confirmText="Delete"
    />
  );
}
