// projects/components/IndicatorSection.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IndicatorFieldArray } from "./IndicatorFieldArray";
import { fetchIndicatorForSelect } from "@/features/indicator/services/indicator.api";
import type { UseProjectFormReturn } from "../hooks/useProjectForm";

interface IndicatorSectionProps {
  form: UseProjectFormReturn;
  measure: {
    id: number;
    indicators_count: number;
  };
}

export function IndicatorSection({ form, measure }: IndicatorSectionProps) {
  const { form: rhf, indicatorsFA, indicators } = form;

  const hasUnselected = indicators?.some((i) => !i?.id);
  const reachedLimit =
    indicatorsFA.fields.length >= measure.indicators_count;

  return (
    <div className="flex flex-col space-y-3">
      <Label className="text-gray-700">INDICATORS</Label>
      <IndicatorFieldArray form={rhf} fieldArray={indicatorsFA} measureId={measure.id} fetchOptions={(exclude) => fetchIndicatorForSelect(measure.id, exclude) } />

      <Button type="button" className="btn-tertiary w-fit" disabled={hasUnselected || reachedLimit} onClick={() => indicatorsFA.append({ id: 0, name: "" })} >
        + Add indicator
      </Button>

      {reachedLimit && (
        <p className="text-sm text-gray-500">
          All indicators for this measure have been selected.
        </p>
      )}
    </div>
  );
}

