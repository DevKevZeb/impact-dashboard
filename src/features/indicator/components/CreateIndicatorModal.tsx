import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import type { CreateIndicatorDTO, Indicator, UpdateIndicatorDTO } from "../types/indicatorTypes";
import { IndicatorTypeComboboxSearchable } from "./IndicatorComboboxSearcheable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const indicatorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  target: z.number().positive("Target must be greater than 0"),
  measure_id: z.number(),

  type: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable()
    .refine((v) => v !== null, { message: "Type is required" }),
});

type FormValues = z.infer<typeof indicatorSchema>;

interface Props {
  open: boolean;
  indicator: Indicator | null;
  parentMeasureId: number;
  onClose: () => void;
  onSubmit: (dto: CreateIndicatorDTO) => void;
}

export default function CreateIndicatorModal({ open, indicator, parentMeasureId, onClose, onSubmit }: Props) {
  const isEditing = !!indicator;

  const form = useForm<FormValues>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: {
      name: "",
      target: undefined,
      measure_id: parentMeasureId,
      type: null,
    },
  });

  const { register, handleSubmit, reset, control, formState: { errors } } = form;

  useEffect(() => {
    if (open) {
      console.log(indicator)
      reset(
        indicator ? {
              name: indicator.name,
              target: indicator.target,
              measure_id: indicator.measure_id,
              type: indicator.type,
            } : {
              name: "",
              target: undefined,
              measure_id: parentMeasureId,
              type: null,
            }
      );
    }
  }, [open, indicator, parentMeasureId, reset]);

  const submitHandler = (data: FormValues) => {
    const dto: CreateIndicatorDTO = {
      name: data.name,
      target: data.target,
      measure_id: parentMeasureId,
      type_id: data.type!.id,
    };

    onSubmit(dto);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Indicator" : "Create Indicator"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <Label>NAME</Label>
            <Input className="input-default" placeholder="E.G: Indicator" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-rose-600!">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label>TARGET</Label>
            <Input className="input-default" placeholder="E.G: 100.50" type="number" step="any" {...register("target", { valueAsNumber: true })} />
            {errors.target && (
              <p className="text-sm text-rose-600!">
                {errors.target.message}
              </p>
            )}
          </div>
          <Controller control={control} name="type" render={({ field }) => (
              <IndicatorTypeComboboxSearchable value={field.value?? null} onChange={field.onChange} error={errors.type?.message} /> )} />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
