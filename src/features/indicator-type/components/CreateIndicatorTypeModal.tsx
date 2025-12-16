import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const typeSchema = z.object({
  name: z
    .string()
    .min(2, "The indicator type name is required")
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
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
            name: ""
        }
    })

    const { register, handleSubmit, reset, formState: { errors } } = form;

  const isEditing = !!type;

  useEffect(() => {
    if(open){
        reset(
            type ? {
                name: type.name
            } : {
                name:""
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
                    { isEditing ? "Edit IndicatorType": "Create Indicator Type"}
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submitHandler)} className="spce-y-4">
                <div className="flex fex-col space-y-1">
                    <Label className="text-gray-700">
                        INDICATOR TYPE NAME
                    </Label>
                    <Input className="input-default" placeholder="E.G.: BU" {...register("name")}/>
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="btn-primary" >
                    Cancel
                    </Button>
                    <Button type="submit" className="btn-secondary">
                    {isEditing ? "Update" : "Create"}
                    </Button>
                </div>


            </form>
        </DialogContent>
    </Dialog>
  )

}