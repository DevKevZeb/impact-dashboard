import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { CreateCountryKpaDTO } from "../types/CountryKpaType";
import type { Kpa } from "@/features/kpa/types/KpaType";
import { CountryComboboxSearchable } from "./CountryComboboxSearcheable";
import { KpaComboboxSearchable } from "./KpaComboboxSearcheable";

const schema = z.object({
  country: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(v => v !== null, { message: "Country is required" }),

  kpa: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(v => v !== null, { message: "KPA is required" }),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCountryKpaDTO) => void;
  selectedKpa?: Kpa | null;
  selectedCountryId?: number | null;
}

export default function CreateCountryKpaModal({
  open,
  onClose,
  onSubmit,
  selectedKpa,
  selectedCountryId,
}: Props) {

  const isEditing = !!selectedKpa;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { country: null, kpa: null }
  });

  const { control, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (open) {
      reset({
        country: selectedCountryId ? { id: selectedCountryId, name: "Loading..." } : null,
        kpa: selectedKpa ? { id: selectedKpa.id, name: selectedKpa.name } : null
      });
    }
  }, [open, selectedCountryId, selectedKpa, reset]);

  const submitHandler = (data: any) => {
    const dto: CreateCountryKpaDTO = {
      country_id: data.country.id,
      id_kpa: data.kpa.id
    };
    onSubmit(dto);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Relation" : "Assign KPA to Country"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

          <div className="flex flex-col space-y-1">
            <Label>COUNTRY</Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountryComboboxSearchable value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.country && <p className="error">{errors.country.message as string}</p>}
          </div>

          <div className="flex flex-col space-y-1">
            <Label>KPA</Label>
            <Controller
              control={control}
              name="kpa"
              render={({ field }) => (
                <KpaComboboxSearchable value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.kpa && <p className="error">{errors.kpa.message as string}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-secondary">
              {isEditing ? "Update" : "Assign"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
