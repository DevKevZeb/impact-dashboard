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

  const donors = program.program_summary?.donors ?? [];
  const agencies = program.program_summary?.implementing_agencies ?? [];
  const budget = program.program_summary?.budget ?? 0;
  const countryAssignments = program.country_user_roles ?? [];
  const primaryCountry = countryAssignments[0]?.country?.name ?? "-";
  const extraCountries = countryAssignments.length > 1
    ? `+${countryAssignments.length - 1} more`
    : "";

  const renderSummaryList = (items: { id: number; name: string }[]) => {
    if (items.length === 0) {
      return <span className="text-xs text-gray-400">-</span>;
    }

    const visibleItems = items.slice(0, 2);

    return (
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <div key={item.id} className="text-xs font-medium text-gray-900 truncate max-w-[7rem]" title={item.name}>
            {item.name}
          </div>
        ))}
        {items.length > 2 && (
          <div className="text-xs text-gray-500">+{items.length - 2} more</div>
        )}
      </div>
    );
  };

  return (
    <DataTableRow>
      <DataTableCell>
        <span className="font-medium text-gray-900">{index}</span>
      </DataTableCell>
      
      <DataTableCell>
        {bannerUrl ? (
          <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={bannerUrl}
              alt={program.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </DataTableCell>

      <DataTableCell>
          <div className="max-w-[9rem]">
          <div className="font-medium text-gray-900 truncate text-xs">{program.name}</div>
          <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">
            {program.description}
          </div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="text-xs">
          <div className="font-medium text-gray-900 truncate">{primaryCountry}</div>
          {extraCountries && (
            <div className="text-xs text-gray-500">{extraCountries}</div>
          )}
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="text-xs">
          <div className="font-medium text-gray-900 whitespace-nowrap">
            {program.contact.first_name} {program.contact.last_name}
          </div>
          <div className="text-[11px] text-gray-500">{program.contact.title}</div>
        </div>
      </DataTableCell>

      <DataTableCell>
        {renderSummaryList(donors)}
      </DataTableCell>

      <DataTableCell>
        {renderSummaryList(agencies)}
      </DataTableCell>

      <DataTableCell>
        <span className="text-xs font-semibold text-gray-900">
          ${budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
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
