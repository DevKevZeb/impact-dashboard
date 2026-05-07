import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import type { CreateIndicatorDTO, Indicator } from "../types/indicatorTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import type { IndicatorType } from "@/features/indicator-type/types/IndicatorTypeType";
import { fetchIndicatorTypesForSelect } from "@/features/indicator-type/services/indicatortype.api";

const indicatorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  target: z.number().positive("Target must be greater than 0"),
  actual_value: z.number().min(0, "Actual value cannot be negative"),
  measure_id: z.number(),

  type: z
    .object({
      id: z.number(),
      name: z.string(),
      is_bottom_up: z.boolean(),
    })
    .nullable()
    .refine((v) => v !== null, { message: "Type is required" }),
}).superRefine((data, ctx) => {
  if (data.type !== null && data.type.is_bottom_up === false) {
    // actual_value (αₓ) must be > 0 for TD
    if (data.actual_value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Actual value (αₓ) is required for Top-Down indicators",
        path: ["actual_value"],
      });
    }
    // αₓ cannot exceed Tₓ
    if (
      data.actual_value > 0 &&
      data.target > 0 &&
      data.actual_value > data.target
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Actual value (αₓ) cannot exceed Target (Tₓ = ${data.target})`,
        path: ["actual_value"],
      });
    }
  }
});

type FormValues = z.infer<typeof indicatorSchema>;

interface Props {
  open: boolean;
  indicator: Indicator | null;
  parentMeasureId: number;
  onClose: () => void;
  onSubmit: (dto: CreateIndicatorDTO) => void;
  disableTypeChange?: boolean;
}

export default function CreateIndicatorModal({ open, indicator, parentMeasureId, onClose, onSubmit, disableTypeChange }: Props) {
  const isEditing = !!indicator;

  const form = useForm<FormValues>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: {
      name: "",
      target: undefined,
      actual_value: 0,
      measure_id: parentMeasureId,
      type: null,
    },
  });

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = form;

  const selectedType = watch("type");
  const isTopDown = selectedType !== null && selectedType?.is_bottom_up === false;

  // Clear actual_value when switching from TD → BU so it doesn't persist
  useEffect(() => {
    if (!isTopDown) {
      setValue("actual_value", 0);
    }
  }, [isTopDown, setValue]);

  useEffect(() => {
    if (open) {
      reset(
        indicator ? {
              name: indicator.name,
              target: indicator.target,
              actual_value: indicator.actual_value ?? 0,
              measure_id: indicator.measure_id,
              type: indicator.type
                ? { id: indicator.type.id, name: indicator.type.name, is_bottom_up: indicator.type.is_bottom_up }
                : null,
            } : {
              name: "",
              target: undefined,
              actual_value: 0,
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
      actual_value: data.type?.is_bottom_up === false ? (data.actual_value ?? 0) : 0,
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
              <p className="text-sm text-rose-600!">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <Label>TARGET (Tₓ)</Label>
            <Input
              className="input-default"
              placeholder="E.G: 100"
              type="number"
              step="any"
              min="0.01"
              {...register("target", { valueAsNumber: true })}
            />
            {errors.target && (
              <p className="text-sm text-rose-600!">{errors.target.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <AsyncSearchSelect<IndicatorType>
                value={field.value ?? null}
                onChange={field.onChange}
                placeholder="Search Indicator Types..."
                fetchOptions={fetchIndicatorTypesForSelect}
                getOptionLabel={(k) => k.name}
                getOptionKey={(k) => k.id}
                disabled={isEditing && !!disableTypeChange}
              />
            )}
          />
          {errors.type && (
            <p className="text-sm text-rose-600!">{errors.type.message}</p>
          )}

          {isTopDown && (
            <div className="flex flex-col space-y-1">
              <Label>
                ACTUAL VALUE (αₓ){" "}
                <span className="text-muted-foreground text-xs font-normal">
                  — observed value entered by Country Manager
                </span>
              </Label>
              <Input
                className="input-default"
                placeholder="E.G: 60"
                type="number"
                step="any"
                min="0"
                {...register("actual_value", {
                  setValueAs: (v) => (v === "" || v === null || v === undefined ? 0 : parseFloat(v)),
                })}
              />
              <p className="text-xs text-muted-foreground">
                Implementation = αₓ / Tₓ × 100 = {" "}
                {watch("actual_value") > 0 && watch("target") > 0
                  ? `${((watch("actual_value")! / watch("target")) * 100).toFixed(2)}%`
                  : "—"}
              </p>
              {errors.actual_value && (
                <p className="text-sm text-rose-600!">{errors.actual_value.message}</p>
              )}
            </div>
          )}

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

