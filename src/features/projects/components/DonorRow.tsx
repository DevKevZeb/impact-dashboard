import React, { useState } from "react";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import type { FetchOptions } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";
import type { SetFieldValue } from "./AgencyRow";
import type { Donor } from "@/features/donors/types/donor.types";
import type { ProjectDonor } from "../types/project.types";

type DonorRowProps = {
  index: number;
  donor?: ProjectDonor;
  getMaxForDonor: (index: number) => number;
  setValue: SetFieldValue;
  removeDonor: (index: number) => void;
  fetchDonors: FetchOptions<Donor>;
};

export const DonorRow = React.memo(
  ({ index, donor, getMaxForDonor, setValue, removeDonor, fetchDonors }: DonorRowProps) => {
    const contribution = donor?.contribution ?? 0;
    const max = getMaxForDonor(index);
    const [contributionInput, setContributionInput] = useState(
      contribution === 0 ? "0" : String(contribution)
    );

    useSyncOnChange(contribution, (next) => {
      setContributionInput(next === 0 ? "0" : String(next));
    });

    if (!donor) return null;

    const commitContribution = (rawValue: string) => {
      const normalizedValue = rawValue.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

      if (normalizedValue === "") {
        setContributionInput("0");
        setValue(`donors.${index}.contribution`, 0, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      const clamped = Math.min(Number(normalizedValue), max);
      setContributionInput(String(clamped));
      setValue(`donors.${index}.contribution`, clamped, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

    return (
      <div className="grid lg:grid-cols-2 gap-3">
        <AsyncSearchSelect<Donor>
         enab={false}
          value={donor.id ? (donor as Donor) : null}
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={max}
              value={contributionInput}
              onFocus={(e) => {
                if (e.currentTarget.value === "0") {
                  e.currentTarget.select();
                  setContributionInput("");
                }
              }}
              onChange={(e) => {
                const nextValue = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
                setContributionInput(nextValue);

                const numericValue = nextValue === "" ? 0 : Math.min(Number(nextValue), max);
                setValue(`donors.${index}.contribution`, numericValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onBlur={() => commitContribution(contributionInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitContribution(contributionInput);
                }
              }}
              placeholder="0"
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
