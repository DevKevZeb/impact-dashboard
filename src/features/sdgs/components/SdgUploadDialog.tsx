import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SdgUploadZone } from "./SdgUploadZone";
import { useCreateSdg } from "../api/sdgQueries";
import { Loader2 } from "lucide-react";

interface SdgUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SdgUploadDialog({ open, onOpenChange }: SdgUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: createSdg, isPending } = useCreateSdg();

  const handleSubmit = () => {
    if (!selectedFile) return;

    createSdg(
      { image: selectedFile },
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New SDG</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SdgUploadZone
            onFileSelect={setSelectedFile}
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
              {isPending ? "Uploading..." : "Upload SDG"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
