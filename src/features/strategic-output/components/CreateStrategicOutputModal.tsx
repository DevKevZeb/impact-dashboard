// src/features/strategic-output/components/CreateStrategicOutputModal.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateStrategicOutputDTO, StrategicOutput } from "../types/StrategicOutput";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const soSchema = z.object({
  name: z.string().min(2, "Name is required"),
  country_kpa_id: z.number(),
});

interface Props {
  open: boolean;
  strategicOutput: StrategicOutput | null;
  parentCountryKpaId: number;
  onClose: () => void;
  onSubmit: (dto: CreateStrategicOutputDTO) => void;
}

export default function CreateStrategicOutputModal({
  open,
  strategicOutput,
  parentCountryKpaId,
  onClose,
  onSubmit
}: Props) {

  const form = useForm<CreateStrategicOutputDTO>({
    resolver: zodResolver(soSchema),
    defaultValues: {
      name: "",
      country_kpa_id: parentCountryKpaId
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;
  const isEditing = !!strategicOutput;

  useEffect(() => {
    if (open) {
      reset(
        strategicOutput
          ? {
              name: strategicOutput.name,
              country_kpa_id: strategicOutput.country_kpa_id
            }
          : {
              name: "",
              country_kpa_id: parentCountryKpaId
            }
      );
    }
  }, [open, strategicOutput, parentCountryKpaId, reset]);

  const submitHandler = (data: CreateStrategicOutputDTO) => {
    // ❗NO se edita el parent — lo recibimos por props
    data.country_kpa_id = parentCountryKpaId;

    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Strategic Output" : "Create Strategic Output"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">NAME</Label>

            <Input
              className="input-default"
              placeholder="E.G.: Digital Policy Reform"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="btn-primary">
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
