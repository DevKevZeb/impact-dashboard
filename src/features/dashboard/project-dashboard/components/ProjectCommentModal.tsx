import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  projectTitle?: string;
  comment: string | null;
  onClose: () => void;
}

export function ProjectCommentModal({
  open,
  projectTitle,
  comment,
  onClose,
}: Props) {
  const normalizedComment = comment?.trim() ?? "";
  const hasComment = normalizedComment.length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">Project Comment</DialogTitle>
          <DialogDescription>
            Comment details for {projectTitle ?? "this project"}.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-sky-100 bg-sky-50/50 p-3">
          {hasComment ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">{normalizedComment}</p>
          ) : (
            <p className="text-sm text-gray-600">No comment available.</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="btn-secondary">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
