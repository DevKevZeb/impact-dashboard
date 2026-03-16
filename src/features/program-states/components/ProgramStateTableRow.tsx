import { SquarePen } from "lucide-react";
import type { ProgramState } from "../types/programState.types";

interface ProgramStateTableRowProps {
  programState: ProgramState;
  index: number;
  onEdit: (programState: ProgramState) => void;
  canWrite?: boolean;
}

export function ProgramStateTableRow({
  programState,
  index,
  onEdit,
  canWrite,
}: ProgramStateTableRowProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(programState);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-sky-100 transition">
      {/* # (Index) */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {index}
      </td>

      {/* State Name */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {programState.name}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {canWrite && (
          <button
            onClick={handleEdit}
            className="btn-edit-table"
            title="Edit Program State"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}
