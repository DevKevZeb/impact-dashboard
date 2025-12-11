import { useState, useEffect } from "react";
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
import { useUpdateProgramState } from "../api/programStateQueries";
import {
  programStateSchema,
  type ProgramStateFormData,
} from "../types/programState.schema";
import type { ProgramState } from "../types/programState.types";

interface ProgramStateEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programState: ProgramState | null;
}

export function ProgramStateEditDialog({
  open,
  onOpenChange,
  programState,
}: ProgramStateEditDialogProps) {
  const updateMutation = useUpdateProgramState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgramStateFormData>({
    resolver: zodResolver(programStateSchema),
  });

  // Reset form when programState changes
  useEffect(() => {
    if (programState) {
      reset({ name: programState.name });
    }
  }, [programState, reset]);

  const onSubmit = async (data: ProgramStateFormData) => {
    if (!programState) return;

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: programState.id,
        data,
      });
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
          <DialogTitle>Edit Program State</DialogTitle>
          <DialogDescription>
            Update the program state name. This will affect all programs
            currently using this state.
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
              {isSubmitting ? "Updating..." : "Update State"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
