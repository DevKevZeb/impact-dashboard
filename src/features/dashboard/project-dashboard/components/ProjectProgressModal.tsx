import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  projectTitle?: string;
  progressInput: string;
  progressPreview: number;
  progressError: string;
  isSaving: boolean;
  onClose: () => void;
  onProgressInputChange: (value: string) => void;
  onProgressSliderChange: (value: string) => void;
  onSave: () => void;
}

const PROGRESS_MIN = 0;
const PROGRESS_MAX = 100;

export function ProjectProgressModal({
  open,
  projectTitle,
  progressInput,
  progressPreview,
  progressError,
  isSaving,
  onClose,
  onProgressInputChange,
  onProgressSliderChange,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">Update Project Progress</DialogTitle>
          <DialogDescription>
            Set an integer progress value between 0 and 100 for {projectTitle ?? "this project"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="dashboard-progress-input">
            Progress (%)
          </label>

          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="w-full bg-[#61C8E7]/70 rounded-full h-4 relative overflow-hidden">
                <div
                  className="bg-[#1E3291] h-4 rounded-full transition-all duration-200"
                  style={{ width: `${progressPreview}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                  {progressPreview}%
                </span>
              </div>

              <div className="custom-slider" style={{ ["--progress" as string]: `${progressPreview}%` }}>
                <input
                  aria-label="Progress slider"
                  type="range"
                  min={PROGRESS_MIN}
                  max={PROGRESS_MAX}
                  step="1"
                  value={progressPreview}
                  onChange={(e) => onProgressSliderChange(e.target.value)}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="w-24">
              <Input
                id="dashboard-progress-input"
                type="number"
                min={PROGRESS_MIN}
                max={PROGRESS_MAX}
                step="1"
                value={progressInput}
                onChange={(e) => onProgressInputChange(e.target.value)}
                placeholder="0 - 100"
                className="input-default no-spinner text-right py-2"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500">Drag the bar or type an integer value. Both stay synchronized.</p>
          {progressError && <p className="text-sm text-red-600">{progressError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="btn-secondary">
            {isSaving ? "Saving..." : "Save progress"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}