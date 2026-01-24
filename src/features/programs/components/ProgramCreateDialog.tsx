import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Check } from "lucide-react";
import { Can } from "@/features/auth/components/Can";
import { CannotAccess } from "@/features/auth/components/CannotAccess";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { SCOPES } from "@/features/auth/utils/permissions";
import { toast } from "sonner";
import { useCreateProgram } from "../api/programQueries";
import { useSdgs } from "@/features/sdgs/api/sdgQueries";
import {
  programCreateSchema,
  type ProgramCreateFormData,
} from "../types/program.schema";

interface ProgramCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramCreateDialog({
  open,
  onOpenChange,
}: ProgramCreateDialogProps) {
  const canWrite = useHasScope(SCOPES.PROGRAMS_WRITE);
  const createMutation = useCreateProgram();
  const { data: sdgs } = useSdgs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProgramCreateFormData>({
    resolver: zodResolver(programCreateSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("banner_img", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setValue("banner_img", undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleSdg = (sdgId: number) => {
    setSelectedSdgs((prev) =>
      prev.includes(sdgId) ? prev.filter((id) => id !== sdgId) : [...prev, sdgId]
    );
    setValue("sdg_ids", selectedSdgs.includes(sdgId) 
      ? selectedSdgs.filter((id) => id !== sdgId)
      : [...selectedSdgs, sdgId]
    );
  };

  const onSubmit = async (data: ProgramCreateFormData) => {
    if (!canWrite) {
      toast.error("Insufficient permissions to create programs");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description,
        banner_img: data.banner_img,
        program_url: data.program_url || undefined,
        contact: {
          first_name: data.contact.first_name,
          last_name: data.contact.last_name,
          title: data.contact.title,
          email: data.contact.email,
          phone: data.contact.phone || undefined,
        },
        sdg_ids: selectedSdgs.length > 0 ? selectedSdgs : undefined,
      });
      reset();
      clearFile();
      setSelectedSdgs([]);
      onOpenChange(false);
    } catch {
      // Error handling is done in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    clearFile();
    setSelectedSdgs([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="modal-title">Create New Program</DialogTitle>
          <DialogDescription>
            Create a program with contact details, optional banner and SDGs selection.
          </DialogDescription>
        </DialogHeader>

        <Can 
          scope={SCOPES.PROGRAMS_WRITE}
          fallback={
            <CannotAccess 
              message="Create Program Restricted"
              description="You don't have permission to create programs. Contact your administrator to request access."
            />
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Program Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
              Program Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="e.g., Rural Education Program 2025"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* 2. Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 block"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Detailed description of the program objectives and activities..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* 3. Banner Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Banner Image (Optional)
            </label>
            {previewUrl ? (
              <div className="relative w-full h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 transition"
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload banner</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WEBP - Max 2MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.banner_img && (
              <p className="text-sm text-red-600">{errors.banner_img.message}</p>
            )}
          </div>

          {/* 4. Program Website */}
          <div className="space-y-2">
            <label
              htmlFor="program_url"
              className="text-sm font-medium text-gray-700 block"
            >
              Program Website (Optional)
            </label>
            <input
              id="program_url"
              type="url"
              {...register("program_url")}
              placeholder="https://www.program-website.org"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              aria-invalid={errors.program_url ? "true" : "false"}
            />
            {errors.program_url && (
              <p className="text-sm text-red-600">{errors.program_url.message}</p>
            )}
          </div>

          {/* 5. Sustainable Development Goals */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
              Sustainable Development Goals (Optional)
            </label>
            <p className="text-xs text-gray-500">Select one or more SDGs related to this program</p>
            {sdgs && sdgs.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {sdgs.map((sdg) => {
                  const isSelected = selectedSdgs.includes(sdg.id);
                  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;
                  
                  return (
                    <div
                      key={sdg.id}
                      onClick={() => toggleSdg(sdg.id)}
                      className={`relative cursor-pointer rounded border-2 transition-all ${
                        isSelected
                          ? "border-sky-500 ring-2 ring-sky-200"
                          : "border-gray-200 hover:border-sky-300"
                      }`}
                      title={sdg.filename}
                    >
                      <img
                        src={imageUrl}
                        alt={sdg.filename}
                        className="w-full h-auto rounded"
                      />
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 bg-sky-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No SDGs available. Please upload SDGs first.
              </p>
            )}
          </div>

          {/* 6. Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="contact.first_name" className="text-sm font-medium text-gray-700 block">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact.first_name"
                  type="text"
                  {...register("contact.first_name")}
                  placeholder="John"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  aria-invalid={errors.contact?.first_name ? "true" : "false"}
                />
                {errors.contact?.first_name && (
                  <p className="text-sm text-red-600">{errors.contact.first_name.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="contact.last_name" className="text-sm font-medium text-gray-700 block">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact.last_name"
                  type="text"
                  {...register("contact.last_name")}
                  placeholder="Doe"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  aria-invalid={errors.contact?.last_name ? "true" : "false"}
                />
                {errors.contact?.last_name && (
                  <p className="text-sm text-red-600">{errors.contact.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="contact.title" className="text-sm font-medium text-gray-700 block">
                Title/Position <span className="text-red-500">*</span>
              </label>
              <input
                id="contact.title"
                type="text"
                {...register("contact.title")}
                placeholder="Project Director"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                aria-invalid={errors.contact?.title ? "true" : "false"}
              />
              {errors.contact?.title && (
                <p className="text-sm text-red-600">{errors.contact.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="contact.email" className="text-sm font-medium text-gray-700 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact.email"
                  type="email"
                  {...register("contact.email")}
                  placeholder="john.doe@org.com"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  aria-invalid={errors.contact?.email ? "true" : "false"}
                />
                {errors.contact?.email && (
                  <p className="text-sm text-red-600">{errors.contact.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="contact.phone" className="text-sm font-medium text-gray-700 block">
                  Phone (Optional)
                </label>
                <input
                  id="contact.phone"
                  type="tel"
                  {...register("contact.phone")}
                  placeholder="+1234567890"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  aria-invalid={errors.contact?.phone ? "true" : "false"}
                />
                {errors.contact?.phone && (
                  <p className="text-sm text-red-600">{errors.contact.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-modal-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-modal-submit"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Program"}
            </Button>
          </DialogFooter>
        </form>
        </Can>
      </DialogContent>
    </Dialog>
  );
}
