import { useState, useRef, useEffect } from "react";
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
import { useUpdateProgram } from "../api/programQueries";
import { useSdgs } from "@/features/sdgs/api/sdgQueries";
import { useProgramStates } from "@/features/program-states/api/programStateQueries";
import {
  programUpdateSchema,
  type ProgramUpdateFormData,
} from "../types/program.schema";
import type { Program } from "../types/program.types";

interface ProgramEditDialogProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramEditDialog({
  program,
  open,
  onOpenChange,
}: ProgramEditDialogProps) {
  const canWrite = useHasScope(SCOPES.PROGRAMS_WRITE);
  const updateMutation = useUpdateProgram();
  const { data: sdgs } = useSdgs();
  const { data: programStates } = useProgramStates();
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
  } = useForm<ProgramUpdateFormData>({
    resolver: zodResolver(programUpdateSchema),
  });
  // Set default values when program changes
  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        description: program.description,
        program_url: program.program_url || "",
        contact: {
          id: program.contact.id,  // ID del contacto existente
          first_name: program.contact.first_name,
          last_name: program.contact.last_name,
          title: program.contact.title,
          email: program.contact.email,
          phone: program.contact.phone || "",
        },
        program_state_id: program.program_state.id,
        sdg_ids: program.sdgs?.map((sdg) => sdg.id) || [],
      });
      setSelectedSdgs(program.sdgs?.map((sdg) => sdg.id) || []);
      setPreviewUrl(null);
    }
  }, [program, reset]);

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

  const onSubmit = async (data: ProgramUpdateFormData) => {
    if (!program) return;

    if (!canWrite) {
      toast.error("Insufficient permissions to edit programs");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: program.id,
        input: {
          name: data.name,
          description: data.description,
          banner_img: data.banner_img,
          program_url: data.program_url || undefined,
          program_state_id: data.program_state_id,
          contact: {
            id: data.contact.id,  // ID del contacto existente
            first_name: data.contact.first_name,
            last_name: data.contact.last_name,
            title: data.contact.title,
            email: data.contact.email,
            phone: data.contact.phone || undefined,
          },
          sdg_ids: selectedSdgs.length > 0 ? selectedSdgs : undefined,
        },
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

  if (!program) return null;

  const currentBannerUrl = program.banner_img
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${program.banner_img}`
    : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="modal-title">Edit Program</DialogTitle>
          <DialogDescription>
            Update program details and contact information. Current state: <strong>{program.program_state.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Can 
          scope={SCOPES.PROGRAMS_WRITE}
          fallback={
            <CannotAccess 
              message="Edit Program Restricted"
              description="You don't have permission to edit programs. Contact your administrator to request access."
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
                  alt="New banner preview"
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
            ) : currentBannerUrl ? (
              <div className="space-y-2">
                <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentBannerUrl}
                    alt="Current banner"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Change banner image
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

          {/* 6. Program State */}
          <div className="space-y-2">
            <label htmlFor="program_state_id" className="text-sm font-medium text-gray-700 block">
              Program State <span className="text-red-500">*</span>
            </label>
            <select
              id="program_state_id"
              {...register("program_state_id", { valueAsNumber: true })}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white"
              aria-invalid={errors.program_state_id ? "true" : "false"}
            >
              {programStates?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.program_state_id && (
              <p className="text-sm text-red-600">{errors.program_state_id.message}</p>
            )}
          </div>

          {/* 7. Contact Information */}
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
              {isSubmitting ? "Updating..." : "Update Program"}
            </Button>
          </DialogFooter>
        </form>
        </Can>
      </DialogContent>
    </Dialog>
  );
}
