import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { Kpa, CreateKpaDto } from "../types/KpaType";

const kpaSchema = z.object({
  name: z
    .string()
    .min(2, "The KPA name is required"),
  implementation: z
    .number({
      message: "Implementation must be a number",
    })
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
});

interface Props {
  open: boolean;
  kpa?: Kpa | null;
  onClose: () => void;
  onSubmit: (data: CreateKpaDto) => void;
}

export default function CreateKpaModal({ open, kpa, onClose, onSubmit }: Props) {

  const form = useForm<CreateKpaDto>({
    resolver: zodResolver(kpaSchema),
    defaultValues: {
      name: "",
      implementation: 0,
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  const isEditing = !!kpa;

  useEffect(() => {
    if (open) {
      reset(
        kpa
          ? {
              name: kpa.name,
              implementation: kpa.implementation,
            }
          : {
              name: "",
              implementation: 0,
            }
      );
    }
  }, [open, kpa, reset]);

  const submitHandler = (data: CreateKpaDto) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit KPA" : "Create KPA"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

          {/* NAME */}
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">KPA NAME</Label>
            <Input
              className="input-default"
              placeholder="E.G.: Governance"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">IMPLEMENTATION (%)</Label>
            <Input
              type="number"
              step="0.01"
              className="input-default"
              placeholder="0 - 100"
              {...register("implementation", { valueAsNumber: true })}
            />
            {errors.implementation && (
              <p className="text-sm text-red-600">
                {errors.implementation.message}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="btn-primary" >
              Cancel
            </Button>

            <Button type="submit" className="btn-secondary">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
