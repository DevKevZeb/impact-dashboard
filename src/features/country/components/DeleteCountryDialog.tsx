import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import type { Country } from "../types/CountryType";

interface DeleteCountryDialogProps {
  country: Country;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteCountryDialog({
  country,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteCountryDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Country"
      description={
        <>
          This action is permanent. Are you sure you want to delete the country{" "}
          <span className="font-semibold">"{country.name}"</span>?
        </>
      }
      confirmText="Delete"
    />
  );
}