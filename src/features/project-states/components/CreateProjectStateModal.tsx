import z from "zod";
import type { ProjectState, ProjectStateDTO } from "../types/projectstate.types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const projectStaateSchema = z.object({
    state: z.string("The state must be a string").min(3, "The state must contain a minimum of 3 characters.").max(100, "The state must contain a maximum of 3 characters.")
})

interface Props {
    open: boolean,
    projectState?: ProjectState | null,
    onClose: () => void,
    onSubmit: (data: ProjectStateDTO) => void
}

export default function CreateProjectStateModal({open, projectState, onClose, onSubmit}: Props){
    const form = useForm<ProjectStateDTO>({
        defaultValues: {
            state: ""
        }
    })

    const { register, handleSubmit, reset, formState: { errors } } = form;
    
      const isEditing = !!projectState;
    
      useEffect(() => {
        if (open) {
          reset(
            projectState
              ? {
                  state: projectState.state,
                }
              : {
                  state: "",
                }
          );
        }
      }, [open, projectState, reset]);

      const submitHandler = (data: ProjectStateDTO)=>{
        onSubmit(data);
        reset();
        onClose();
      };

      return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-xl">
                <DialogHeader>
                    <DialogTitle className="modal-title">
                        {isEditing ? "Edit Project State": "Create Project State"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <div className="space-y-4">
                        <Label className="text-gray-700">STATE</Label>
                        <Input className="input-default" placeholder="E.G.: Approved" {...register("state")}/>
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
      )
    
}