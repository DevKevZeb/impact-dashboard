import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SdgUploadZone } from "./SdgUploadZone";
import { useUpdateSdg } from "../api/sdgQueries";
import { Loader2 } from "lucide-react";
import type { Sdg } from "../types/sdg.types";

interface SdgEditDialogProps {
  sdg: Sdg | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SdgEditDialog({ sdg, open, onOpenChange }: SdgEditDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: updateSdg, isPending } = useUpdateSdg();

  const handleSubmit = () => {
    if (!selectedFile || !sdg) return;

    updateSdg(
      { id: sdg.id, input: { image: selectedFile } },
      {
        onSuccess: () => {
          setSelectedFile(null);
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  if (!sdg) return null;

  const currentImageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit SDG</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Current: <span className="font-medium text-gray-700">{sdg.filename}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <SdgUploadZone
            onFileSelect={setSelectedFile}
            currentImage={currentImageUrl}
            disabled={isPending}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="btn-modal-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isPending}
              className="btn-modal-submit"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isPending ? "Updating..." : "Update SDG"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
