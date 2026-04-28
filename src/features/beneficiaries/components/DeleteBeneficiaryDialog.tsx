import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { Beneficiary } from "../types/beneficiaries.types";

interface DeleteBeneficiaryDialogProps {
  beneficiary: Beneficiary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteBeneficiaryDialog({
  beneficiary,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteBeneficiaryDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Beneficiary"
      description={
        <>
          This action is permanent. Are you sure you want to delete the beneficiary{" "}
          <span className="font-semibold">"{beneficiary.name}"</span>?
        </>
      }
      confirmText="Delete"
    />
  );
}