import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateProgramState } from "../api/programStateQueries";
import {
  programStateSchema,
  type ProgramStateFormData,
} from "../types/programState.schema";

interface ProgramStateCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramStateCreateDialog({
  open,
  onOpenChange,
}: ProgramStateCreateDialogProps) {
  const createMutation = useCreateProgramState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgramStateFormData>({
    resolver: zodResolver(programStateSchema),
  });

  const onSubmit = async (data: ProgramStateFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch {
      // Error handling is done in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Program State</DialogTitle>
          <DialogDescription>
            Add a new state for program lifecycle management. This state will
            be available when creating or updating programs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 block"
            >
              State Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="e.g., Active, Inactive, Completed"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-modal-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-modal-submit"
            >
              {isSubmitting ? "Creating..." : "Create State"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
