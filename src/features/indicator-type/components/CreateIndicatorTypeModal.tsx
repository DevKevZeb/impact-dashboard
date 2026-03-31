import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const typeSchema = z.object({
  name: z
    .string()
    .min(2, "The indicator type name is required")
    .max(100, "Maximum value is 100"),
  is_bottom_up: z.boolean(),
});

interface Props {
    open: boolean,
    type?: IndicatorType | null,
    onClose: () => void,
    onSubmit: (data: IndicatorTypeDTO) => void;
}

export default function CreateIndicatorTypeModal({ open, type, onClose, onSubmit }:Props){
    const form = useForm<IndicatorTypeDTO>({
        resolver: zodResolver(typeSchema),
        defaultValues: {
            name: "",
            is_bottom_up: true,
        }
    })

    const { register, handleSubmit, reset, control, formState: { errors } } = form;

  const isEditing = !!type;

  useEffect(() => {
    if(open){
        reset(
            type ? {
                name: type.name,
                is_bottom_up: type.is_bottom_up,
            } : {
                name: "",
                is_bottom_up: true,
            }
        );
    }
  }, [open, type, reset]);

  const submitHandler = (data: IndicatorTypeDTO) => {
    onSubmit(data);
    reset();
    onClose();
  }

  return(
    <Dialog open = {open} onOpenChange={onClose}>
        <DialogContent className="rounded-xl max-w-md">
            <DialogHeader>
                <DialogTitle>
                    { isEditing ? "Edit Indicator Type": "Create Indicator Type"}
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <Label className="text-gray-700">
                        INDICATOR TYPE NAME
                    </Label>
                    <Input className="input-default" placeholder="E.G.: Bottom Up" {...register("name")}/>
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Bottom-Up</Label>
                        <p className="text-xs text-muted-foreground">
                            Uses project progress weighted by project weight. Uncheck for Top-Down (actual value / target).
                        </p>
                    </div>
                    <Controller
                        control={control}
                        name="is_bottom_up"
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                    </Button>
                    <Button type="submit">
                    {isEditing ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )

}