import { SquarePen } from "lucide-react";
import type { Sdg } from "../types/sdg.types";

interface SdgTableRowProps {
  sdg: Sdg;
  index: number;
  onEdit: (sdg: Sdg) => void;
  canWrite: boolean;
}

export function SdgTableRow({ sdg, index, onEdit, canWrite }: SdgTableRowProps) {
  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(sdg);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-sky-100 transition">
      {/* # (Index) */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {index}
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
      <td className="px-4 py-3 text-sm text-gray-700">
        {canWrite ? (
          <button
            onClick={handleEdit}
            className="btn-edit-table"
            title="Edit SDG"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-gray-400 text-xs">No actions</span>
        )}
      </td>
    </tr>
  );
}
