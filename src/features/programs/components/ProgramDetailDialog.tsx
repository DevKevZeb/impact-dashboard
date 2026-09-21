import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Mail, Phone, Globe, Calendar } from "lucide-react";
import type { Program } from "../types/program.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveStorageUrl } from "@/lib/utils";

interface ProgramDetailDialogProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramDetailDialog({
  program,
  open,
  onOpenChange,
}: ProgramDetailDialogProps) {
  if (!program) return null;

  const bannerUrl = resolveStorageUrl(program.banner_img);

  const currencyCode = program.country_user_roles?.[0]?.country?.currency_code ?? "";
  const budget = program.program_summary?.budget ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {program.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 text-xs rounded-full bg-sky-100 text-sky-700 font-medium">
                  {program.program_state.name}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Country */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Country
            </h3>
            {program.country_user_roles && program.country_user_roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {program.country_user_roles
                  .map((cur) => cur.country?.name)
                  .filter((name): name is string => Boolean(name))
                  .map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium"
                    >
                      {name}
                    </span>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">N/A</p>
            )}
          </div>
          {/* Banner Image */}
          {bannerUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={bannerUrl}
                alt={program.name}
                className="w-full h-64 object-contain"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          {/* Program URL */}
          {program.program_url && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Website
              </h3>
              <a
                href={program.program_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 hover:underline"
              >
                <Globe className="w-4 h-4" />
                {program.program_url}
              </a>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
              Contact Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {program.contact.first_name} {program.contact.last_name}
                </div>
                <div className="text-sm text-gray-600">{program.contact.title}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${program.contact.email}`}
                  className="text-sky-600 hover:underline"
                >
                  {program.contact.email}
                </a>
              </div>

              {program.contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a
                    href={`tel:${program.contact.phone}`}
                    className="text-gray-700"
                  >
                    {program.contact.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {program.program_summary && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Budget</div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {formatCurrency(budget, currencyCode)}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Donors</div>
                  <div className="mt-2 space-y-1">
                    {program.program_summary.donors.length > 0 ? (
                      program.program_summary.donors.map((donor) => (
                        <div key={donor.id} className="text-sm text-gray-700">
                          {donor.name}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">N/A</div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Implementing Agencies</div>
                  <div className="mt-2 space-y-1">
                    {program.program_summary.implementing_agencies.length > 0 ? (
                      program.program_summary.implementing_agencies.map((agency) => (
                        <div key={agency.id} className="text-sm text-gray-700">
                          {agency.name}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">N/A</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SDGs */}
          {program.sdgs && program.sdgs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
                Sustainable Development Goals ({program.sdgs.length})
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {program.sdgs.map((sdg) => {
                  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;
                  return (
                    <div
                      key={sdg.id}
                      className="group relative"
                      title={sdg.filename}
                    >
                      <img
                        src={imageUrl}
                        alt={sdg.filename}
                        className="w-full h-auto rounded border-2 border-gray-200 group-hover:border-sky-400 transition-all"
                      />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        {sdg.filename}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(program.created_at || program.updated_at) && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6 text-xs text-gray-500">
                {program.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {new Date(program.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {program.updated_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated: {new Date(program.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Close button at bottom */}
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
