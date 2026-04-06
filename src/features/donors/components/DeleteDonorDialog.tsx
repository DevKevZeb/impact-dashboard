import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { Donor } from "../types/donor.types";

interface DeleteDonorDialogProps {
  donor: Donor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteDonorDialog({
  donor,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteDonorDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Eliminar donor"
      description={
        <>
          Esta accion es permanente. Deseas eliminar el donor{" "}
          <span className="font-semibold">"{donor.name}"</span>?
        </>
      }
      confirmText="Eliminar"
    />
  );
}
