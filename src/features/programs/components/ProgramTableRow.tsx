import { SquarePen, Trash2 } from "lucide-react";
import type { Program } from "../types/program.types";
import { DataTableRow, DataTableCell } from "@/shared/components/table";
import { toast } from "sonner";

interface ProgramTableRowProps {
  program: Program;
  onEdit: (program: Program) => void;
}

export function ProgramTableRow({ program, onEdit }: ProgramTableRowProps) {
  const bannerUrl = program.banner_img
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${program.banner_img}`
    : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(program);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Delete functionality", {
      description: "Delete feature is not yet implemented in the backend",
    });
  };

  return (
    <DataTableRow>
      <DataTableCell>
        <span className="font-medium text-gray-900">{program.id}</span>
      </DataTableCell>
      
      <DataTableCell>
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={program.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </DataTableCell>

      <DataTableCell>
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{program.name}</div>
          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
            {program.description}
          </div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {program.contact.first_name} {program.contact.last_name}
          </div>
          <div className="text-xs text-gray-500">{program.contact.title}</div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700 font-medium">
          {program.program_state.name}
        </span>
      </DataTableCell>

      <DataTableCell>
        {program.sdgs && program.sdgs.length > 0 ? (
          <div className="flex gap-1">
            {program.sdgs.slice(0, 3).map((sdg) => (
              <img
                key={sdg.id}
                src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`}
                alt={sdg.filename}
                className="w-8 h-8 rounded"
                title={sdg.filename}
              />
            ))}
            {program.sdgs.length > 3 && (
              <span className="text-xs text-gray-500">+{program.sdgs.length - 3}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </DataTableCell>

      <DataTableCell>
        <div className="space-x-2">
          <button
            onClick={handleEdit}
            className="btn-edit-table"
            title="Edit Program"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="btn-delete-table"
            title="Delete Program (not implemented)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
