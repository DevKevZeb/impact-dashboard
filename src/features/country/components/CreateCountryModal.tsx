import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { Country, CreateCountryDTO } from "../types/CountryType";
import { CurrencyComboboxCreateable } from "../components/CurrencyComboboxCreateable";

const countrySchema = z.object({
  name: z.string().min(2, "The Country name is required"),
  currency: z
    .object({
      id: z.number().optional(),
      code: z.string().min(1, "Currency code is required"),
    })
    .refine(
      (val) => val.code.trim().length > 0,
      "Currency code is required"
    ),
});

interface Props {
  open: boolean;
  country?: Country | null;
  onClose: () => void;
  onSubmit: (data: CreateCountryDTO) => void;
  currencies: { id: number; code: string }[];
}

export default function CreateCountryModal({ open, country, onClose, onSubmit, currencies }: Props) {
  const form = useForm<CreateCountryDTO>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      currency: { code: "" },
    },
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  const isEditing = !!country;

  useEffect(() => {
    if (open) {
      reset(
        country
          ? {
              name: country.name,
              currency: {
                id: country.currency.id ?? undefined,
                code: country.currency.code,
              },
            }
          : {
              name: "",
              currency: { code: "" },
            }
      );
    }
  }, [open, country, reset]);

  const submitHandler = (data: CreateCountryDTO) => {
    data.currency.code = data.currency.code.toUpperCase();

    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Country" : "Create Country"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

          {/* NAME */}
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">NAME</Label>
            <Input
              className="input-default"
              placeholder="E.G: United States"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* CURRENCY */}
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">CURRENCY</Label>

            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <CurrencyComboboxCreateable
                  options={currencies}
                  value={field?.value}
                  onChange={(v) =>
                    field.onChange(
                      typeof v === "string"
                        ? { code: v }
                        : { id: v?.id, code: v?.code } 
                    )
                  }
                />
              )}
            />

            {errors.currency?.code && (
              <p className="text-sm text-red-600">
                {errors.currency.code.message}
              </p>
            )}
          </div>

          {/* BOTONES */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn-primary"
            >
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
