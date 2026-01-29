import type { ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortDirection } from "@/shared/hooks/useTableSort";

interface DataTableProps {
  children: ReactNode;
  className?: string;
}

interface DataTableHeaderProps {
  children: ReactNode;
}

interface DataTableBodyProps {
  children: ReactNode;
}

interface DataTableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

interface DataTableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}

interface DataTableCellProps {
  children: ReactNode;
  className?: string;
}

export function DataTable({ children, className = "" }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className={`w-full table-auto ${className}`}>{children}</table>
      </div>
    </div>
  );
}

export function DataTableHeader({ children }: DataTableHeaderProps) {
  return (
    <thead className="bg-[#1E3291] border-b border-gray-100">
      {children}
    </thead>
  );
}

export function DataTableBody({ children }: DataTableBodyProps) {
  return <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>;
}

export function DataTableRow({ children, onClick }: DataTableRowProps) {
  return (
    <tr
      className="border-b border-gray-100 hover:bg-sky-100 transition"
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function DataTableHead({
  children,
  className = "",
  sortable = false,
  sortDirection = null,
  onSort,
}: DataTableHeadProps) {
  const getSortIcon = () => {
    if (!sortable) return null;

    if (sortDirection === "asc") {
      return <ArrowUp className="w-4 h-4 text-white" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="w-4 h-4 text-white" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-white/70" />;
  };

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide ${
        sortable ? "cursor-pointer select-none hover:bg-[#142161] transition-colors" : ""
      } ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {getSortIcon()}
      </div>
    </th>
  );
}

export function DataTableCell({ children, className = "" }: DataTableCellProps) {
  return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}
