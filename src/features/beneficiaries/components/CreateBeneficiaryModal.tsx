import z from "zod";
import { type BeneficiaryDTO, type Beneficiary } from "../types/beneficiaries.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const beneficiarySchema = z.object({
    name: z.string().min(2, "The Beneficiary name is required"),
})

interface Props {
    open: boolean;
    beneficiary?: Beneficiary | null;
    onClose: () => void;
    onSubmit: (data: BeneficiaryDTO) => void;
}

export default function CreateBeneficiaryModal( { open, beneficiary, onClose, onSubmit }: Props) {
    // Modal and form logic for creating or editing a beneficiary
    const form = useForm<BeneficiaryDTO>({
        resolver: zodResolver(beneficiarySchema),
        defaultValues: {
            name: "",
        },
    });
    const { register, handleSubmit, reset, formState: { errors } } = form;

    const isEditing = !!beneficiary;

    useEffect(() => {
        if (open) {
            reset({
                name: beneficiary?.name || "",
            });
        }
    }, [open, beneficiary]);

    const submitHandler = (data: BeneficiaryDTO) => {
        onSubmit(data);
        reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-xl">
                <DialogHeader>
                    <DialogTitle className="modal-title">
                        {isEditing ? "Edit Beneficiary" : "Create Beneficiary"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    {/* NAME */}
                    <div className="flex flex-col space-y-1">
                        <Label className="text-gray-700">NAME</Label>
                        <Input
                        className="input-default"
                        placeholder="E.G.: Global Agency"
                        {...register("name")}
                        />
                        {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="btn-primary" >
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-secondary" >
                            {isEditing ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}