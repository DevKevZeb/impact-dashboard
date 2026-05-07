import { Eye, SquarePen, Trash2, UserPlus } from "lucide-react";
import type { Program } from "../types/program.types";
import { DataTableRow, DataTableCell } from "@/shared/components/table";
import { Can } from "@/features/auth/components/Can";
import { SCOPES } from "@/features/auth/utils/permissions";

interface ProgramTableRowProps {
  program: Program;
  index: number;
  onEdit: (program: Program) => void;
  onView: (program: Program) => void;
  onDelete?: (program: Program) => void;
  onInvite?: (program: Program) => void;
  canInvite?: boolean;
  isCountryActive?: boolean;
}

export function ProgramTableRow({
  program,
  index,
  onEdit,
  onView,
  onDelete,
  onInvite,
  canInvite = false,
  isCountryActive = true,
}: ProgramTableRowProps) {
  const bannerUrl = program.banner_img
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${program.banner_img}`
    : null;

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(program);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(program);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(program);
  };

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInvite?.(program);
  };

  return (
    <DataTableRow>
      <DataTableCell>
        <span className="font-medium text-gray-900">{index}</span>
      </DataTableCell>
      
      <DataTableCell>
        {bannerUrl ? (
          <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={bannerUrl}
              alt={program.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
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
        <div className="grid grid-cols-2 gap-1 w-fit">
          {/* Row 1: View + Invite */}
          <button
            onClick={handleView}
            className="inline-flex hover:cursor-pointer items-center justify-center w-8 h-8 rounded-md text-sky-600 hover:bg-sky-50 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <Can scope={SCOPES.PROGRAMS_WRITE}>
            {canInvite && isCountryActive && program.can_edit !== false && onInvite ? (
              <button
                onClick={handleInvite}
                className="inline-flex hover:cursor-pointer items-center justify-center w-8 h-8 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Invite Project Manager"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            ) : (
              <span className="w-8 h-8" />
            )}
          </Can>

          {/* Row 2: Edit + Delete */}
          <Can scope={SCOPES.PROGRAMS_WRITE}>
            {isCountryActive && program.can_edit !== false ? (
              <button
                onClick={handleEdit}
                className="btn-edit-table"
                title="Edit Program"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            ) : (
              <span className="w-8 h-8" />
            )}
            {program.can_edit !== false && onDelete && isCountryActive ? (
              <button
                onClick={handleDelete}
                className="btn-delete-table"
                title="Delete Program"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <span className="w-8 h-8" />
            )}
          </Can>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
