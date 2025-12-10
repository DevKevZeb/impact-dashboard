import { SquarePen, Trash2 } from "lucide-react";
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
    <tr className="border-b border-gray-100 hover:bg-sky-100 transition">
      {/* ID */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {sdg.id}
      </td>

      {/* Thumbnail */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex items-center justify-center border border-gray-200">
          <img
            src={imageUrl}
            alt={sdg.filename}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23f3f4f6' width='64' height='64'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </td>

      {/* Filename */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {sdg.filename}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-sm text-gray-700 space-x-2">
        <button
          onClick={handleEdit}
          className="btn-edit-table"
          title="Edit SDG"
        >
          <SquarePen className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="btn-delete-table"
          title="Delete SDG (not implemented)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
