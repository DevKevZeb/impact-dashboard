import { SquarePen, Trash2 } from "lucide-react";
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
    <tr className="border-b border-gray-100 hover:bg-sky-100 transition">
      {/* ID */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {programState.id}
      </td>

      {/* State Name */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {programState.name}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-sm text-gray-700 space-x-2">
        <button
          onClick={handleEdit}
          className="btn-edit-table"
          title="Edit Program State"
        >
          <SquarePen className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="btn-delete-table"
          title="Delete Program State (not implemented)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
