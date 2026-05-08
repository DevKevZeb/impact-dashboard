import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  projectTitle?: string;
  weightInput: string;
  weightError: string;
  isSaving: boolean;
  onClose: () => void;
  onWeightInputChange: (value: string) => void;
  onSave: () => void;
}

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 1;

export function ProjectWeightModal({
  open,
  projectTitle,
  weightInput,
  weightError,
  isSaving,
  onClose,
  onWeightInputChange,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">Update Weight</DialogTitle>
          <DialogDescription>
            Set a weight value between 0 and 1 for {projectTitle ?? "this project"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="dashboard-weight-input">
            Weight
          </label>
          <Input
            id="dashboard-weight-input"
            type="number"
            min={WEIGHT_MIN}
            max={WEIGHT_MAX}
            step="0.01"
            value={weightInput}
            onChange={(e) => onWeightInputChange(e.target.value)}
            placeholder="0 - 1"
            className="input-default no-spinner text-right py-2"
          />
          {weightError && <p className="text-sm text-red-600">{weightError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="btn-secondary">
            {isSaving ? "Saving..." : "Save weight"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}