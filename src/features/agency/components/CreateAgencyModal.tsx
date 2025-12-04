import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { Agency, CreateAgencyDto } from "../types/agency.types";

const agencySchema = z.object({
  name: z.string().min(1, "The name is required"),
  url: z.string().url("The URL is required"),
  isApproved: z.boolean().default(false),
});

interface Props {
  open: boolean;
  agency?: Agency | null;
  onClose: () => void;
  onSubmit: (data: CreateAgencyDto) => void;
}

export default function CreateAgencyModal({ open, agency, onClose, onSubmit }: Props) {
  const form = useForm<CreateAgencyDto>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      name: "",
      url: "",
      isApproved: false,
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  const isEditing = !!agency;

  useEffect(() => {
    if (open) {
      reset(
        agency
          ? {
              name: agency.name,
              url: agency.url,
              isApproved: agency.isApproved,
            }
          : {
              name: "",
              url: "",
              isApproved: false,
            }
      );
    }
  }, [open, agency, reset]);

  const submitHandler = (data: CreateAgencyDto) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="modal-title">
            {isEditing ? "Edit Agency" : "Create Agency"}
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

          {/* URL */}
          <div className="flex flex-col space-y-1">
            <Label className="text-gray-700">URL</Label>
            <Input
            className="input-default"
              placeholder="https://example.com"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-sm text-red-600">{errors.url.message}</p>
            )}
          </div>

          {/* APPROVED */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              {...register("isApproved")}
              className="w-4 h-4 accent-emerald-500"
            />
            <Label className="text-gray-700">Approve</Label>
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

            <Button
              type="submit"
              className="btn-secondary"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
