// projects/components/IndicatorFieldArray.tsx
import { Button } from "@/components/ui/button";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<any>;
  fieldArray: UseFieldArrayReturn<any, "indicators", "id">;
  measureId?: number;
  fetchOptions: (excludeIds: number[]) => any;
}

export function IndicatorFieldArray({ form, fieldArray, measureId, fetchOptions, }: Props) {
  const { fields, remove } = fieldArray;
  const { watch, setValue, formState } = form;

  const indicators = watch("indicators");
  const excludeIds = indicators?.map((i: any) => i?.id).filter(Boolean) ?? [];



  if (!measureId) return null;

  return (
    <div className="flex flex-col space-y-3">
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-center gap-2">
            <AsyncSearchSelect
              enab={false} 
              value={indicators?.[index] ?? null}
              onChange={(v) =>
              setValue(`indicators.${index}`, v, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
              })
              }
              fetchOptions={fetchOptions(excludeIds)}

              getOptionLabel={(i) => i.name ?? ""}
              getOptionKey={(i) => i.id}
              placeholder="Select an indicator"
              emptyMessage="No indicators found"
            />

            <Button
              type="button"
              variant="ghost"
              className="text-red-600"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>

          {Array.isArray(formState.errors.indicators) &&
            formState.errors.indicators[index]?.id && (
              <p className="text-sm text-red-600 mt-1">
                {formState.errors.indicators[index]?.id?.message as string}
              </p>
          )}
        </div>
      ))}

      {formState.errors.indicators && (
        <p className="text-sm text-red-600">
          {formState.errors.indicators.message as string}
        </p>
      )}
    </div>
  );
}
