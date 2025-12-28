import z from "zod";
import type { Donor, DonorDTO } from "../types/donor.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const soSchema = z.object({
    name: z.string().min(2, "Name is required"),
});

interface Props {
    open: boolean,
    donor: Donor | null;
    onClose: ()=> void;
    onSubmit: (dto: DonorDTO) => void;
}

export default function CreateDonorModal({ open, donor, onClose, onSubmit }: Props){

    const form = useForm<DonorDTO>({
        resolver: zodResolver(soSchema),
        defaultValues:{
            name: "",
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = form;
    const isEditing = !!donor;

    useEffect(()=>{
        if(open){
            reset(
                donor ? {
                    name: donor.name,
                } : {
                    name: "",
                }
            )
        }
    }, [open, donor, reset]);

    const submitHandler = (data: DonorDTO) => {
        onSubmit(data);
        reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-xl">
                <DialogHeader>
                    <DialogTitle className="modal-title">
                        {isEditing ? "Edit Donor": "Create Donor"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                    <div className="flex flex-col space-y-1">
                        <Label className="text-gray-700">NAME</Label>
                        <Input 
                            className="input-default"
                            placeholder="E.G.: E.E.U.U."
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