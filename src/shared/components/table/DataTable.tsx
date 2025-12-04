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
        <table className={`w-full table-fixed ${className}`}>{children}</table>
      </div>
    </div>
  );
}

export function DataTableHeader({ children }: DataTableHeaderProps) {
  return (
    <thead className="bg-gradient-to-r from-sky-50 to-emerald-50 border-b-2 border-sky-200">
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
      className="border-b border-gray-200 hover:bg-sky-50/50 transition-all duration-200 group"
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
      return <ArrowUp className="w-4 h-4 text-emerald-600" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="w-4 h-4 text-emerald-600" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  return (
    <th
      className={`py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide ${
        sortable ? "cursor-pointer select-none hover:bg-sky-100/50 transition-colors" : ""
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
  return <td className={`py-4 ${className}`}>{children}</td>;
}
