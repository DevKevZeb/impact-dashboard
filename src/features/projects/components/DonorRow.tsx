import React from "react";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";

type DonorFormValue = {
  id: number;
  name: string;
  contribution: number;
};

type DonorRowProps = {
  index: number;
  donor?: DonorFormValue;
  getMaxForDonor: (index: number) => number;
  setValue: any;
  removeDonor: (index: number) => void;
  fetchDonors: any;
};

export const DonorRow = React.memo(
  ({ index, donor, getMaxForDonor, setValue, removeDonor, fetchDonors }: DonorRowProps) => {
    if (!donor) return null;

    const contribution = donor.contribution ?? 0;
    const max = getMaxForDonor(index);

    return (
      <div className="grid lg:grid-cols-2 gap-3">
        <AsyncSearchSelect
         enab={false} 
          value={donor.id ? donor : null}
          onChange={(v) => {
            setValue(
              `donors.${index}`,
              { ...v, contribution: 0 },
              { shouldDirty: true, shouldValidate: true }
            );
          }}
          fetchOptions={fetchDonors}
          getOptionLabel={(i) => i.name}
          getOptionKey={(i) => i.id}
        />

        <div className="flex flex-col space-y-3 md:flex-row space-x-4 items-center">
          <Label className="whitespace-nowrap">CONTRIBUTION</Label>

          <Slider
            min={0}
            max={100}
            step={1}
            value={[contribution]}
            onValueChange={([val]) => {
              const clamped = Math.min(val, max);
              setValue(`donors.${index}.contribution`, clamped, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            className="flex-1"
          />

          <div className="relative w-[90px] flex items-center">
            <Input
              type="number"
              min={0}
              max={max}
              value={contribution}
              onChange={(e) => {
                const val = Number(e.target.value);
                const clamped = Math.min(Math.max(val, 0), max);
                setValue(`donors.${index}.contribution`, clamped, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              className="w-20 text-center input-default no-spinner"
            />
            <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <Button
            className="text-red-600 cursor-pointer"
            type="button"
            variant="ghost"
            onClick={() => removeDonor(index)}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }
);
