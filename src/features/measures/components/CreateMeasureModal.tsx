import { useForm } from "react-hook-form";
import type { CreateMeasureDTO, UpdateMeasureDTO } from "../types/measureTypes";
import { useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";


const soSchema = z.object({
  name: z.string().min(2, "Name is required"),
  strategic_output_id:  z.number(),
});

interface Props {
    open: boolean,
    measure: UpdateMeasureDTO | null;
    parentStrategicOutputId: number;
    onClose: ()=> void;
    onSubmit: (dto: CreateMeasureDTO) => void;
}

export default function CreateMeasureModal({ open, measure, parentStrategicOutputId, onClose, onSubmit }: Props){
    const form = useForm<CreateMeasureDTO>({
        resolver: zodResolver(soSchema),
        defaultValues:{
            name: "",
            strategic_output_id: parentStrategicOutputId
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = form;
    const isEditing = !!measure;

    useEffect(()=>{
        if(open){
            reset(
                measure ? {
                    name: measure.name,
                    strategic_output_id: measure.strategic_output_id
                } : {
                    name: "",
                    strategic_output_id: parentStrategicOutputId
                }
            )
        }
    }, [open, measure, parentStrategicOutputId, reset]);

    const submitHandler = (data: CreateMeasureDTO) => {
        data.strategic_output_id = parentStrategicOutputId;

        onSubmit(data);
        reset();
        onClose();
    }

    return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Measure" : "Create Measure"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">NAME</Label>

            <Input
              className="input-default"
              placeholder="E.G.: Example Measure"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="btn-primary">
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