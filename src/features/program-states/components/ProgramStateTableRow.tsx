import { Pencil, Trash2, Tag } from "lucide-react";
import type { ProgramState } from "../types/programState.types";
import { toast } from "sonner";

interface ProgramStateTableRowProps {
  programState: ProgramState;
  onEdit: (programState: ProgramState) => void;
}

export function ProgramStateTableRow({
  programState,
  onEdit,
}: ProgramStateTableRowProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(programState);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Delete functionality", {
      description: "Delete feature is not yet implemented in the backend",
    });
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-sky-50/50 transition-all duration-200 group">
      {/* ID */}
      <td className="py-4 pl-8 pr-6 w-32">
        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-semibold bg-sky-100 text-sky-700 min-w-[70px]">
          #{programState.id}
        </span>
      </td>

      {/* State Name */}
      <td className="py-4 pl-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
            <Tag className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-base font-medium text-gray-900 truncate">{programState.name}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 pr-8 w-36">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleEdit}
            className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md transition-all duration-200 border border-blue-100"
            title="Edit Program State"
          >
            <Pencil className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md transition-all duration-200 border border-red-100"
            title="Delete Program State (not implemented)"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
