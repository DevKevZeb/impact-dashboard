import { FileImage, Pencil, Trash2 } from "lucide-react";
import type { Sdg } from "../types/sdg.types";
import { toast } from "sonner";

interface SdgTableRowProps {
  sdg: Sdg;
  onEdit: (sdg: Sdg) => void;
}

export function SdgTableRow({ sdg, onEdit }: SdgTableRowProps) {
  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(sdg);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Delete functionality", {
      description: "Delete feature is not yet implemented in the backend",
    });
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-sky-50/50 transition-all duration-200 group"
    >
      {/* Thumbnail */}
      <td className="py-4 pl-8 pr-6 w-40">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-50 to-emerald-50 rounded-lg overflow-hidden flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
          <img
            src={imageUrl}
            alt={sdg.filename}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23f3f4f6' width='64' height='64'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </td>

      {/* ID */}
      <td className="py-4 px-6 w-32">
        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-semibold bg-sky-100 text-sky-700 min-w-[70px]">
          #{sdg.id}
        </span>
      </td>

      {/* Filename */}
      <td className="py-4 pl-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
            <FileImage className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-base font-medium text-gray-900 truncate">{sdg.filename}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 pr-8 w-36">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleEdit}
            className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md transition-all duration-200 border border-blue-100"
            title="Edit SDG"
          >
            <Pencil className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md transition-all duration-200 border border-red-100"
            title="Delete SDG (not implemented)"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
