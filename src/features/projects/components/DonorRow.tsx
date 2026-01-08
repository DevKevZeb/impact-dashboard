import React, { useEffect, useState } from "react";
import { AsyncSearchSelect } from "./AsyncSearchSelect/AsyncSearchSelect";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DonorFormValue = { id: number; name: string; contribution: number };
type DonorRowProps = { index: number; donor: DonorFormValue; getMaxForDonor: (index: number) => number; setValue: any; removeDonor: (index: number) => void; fetchDonors: any; };


export const DonorRow = React.memo(({ index, donor, getMaxForDonor, setValue, removeDonor, fetchDonors}: DonorRowProps) => {
    const [sliderValue, setSliderValue] = useState<number>(donor.contribution ?? 0);

    useEffect(() => {
      setSliderValue(donor.contribution ?? 0);
    }, [donor.contribution]);

    return (
      <div className="grid grid-cols-2 gap-3">
        <AsyncSearchSelect value={donor.id ? donor : null} onChange={(v) => { if (!v) return; setValue(`donors.${index}`, { ...v, contribution: 0 }, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); }} fetchOptions={fetchDonors} getOptionLabel={(i) => i.name} getOptionKey={(i) => i.id}/>
        <div className="flex space-x-4">
          <Label className="whitespace-nowrap">CONTRIBUTION</Label>
          <Slider min={0} max={100} step={1} value={[sliderValue]} onValueChange={([val]) => { const clamped = Math.min(val, getMaxForDonor(index)); setSliderValue(clamped); setValue(`donors.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="flex-1 "/>
          <Input type="number" min={0} max={100} value={sliderValue} onChange={(e) => { const val = Number(e.target.value); const clamped = Math.min( Math.max(val, 0), getMaxForDonor(index) ); setSliderValue(clamped); setValue(`donors.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="w-20 text-right"/>
          <Button type="button" variant="ghost" onClick={() => removeDonor(index)}>
            Remove
          </Button>
        </div>
      </div>
    );
  }
);
