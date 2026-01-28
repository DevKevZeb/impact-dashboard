import { SquarePen, Trash2 } from "lucide-react";
import type { Kpa } from "../types/KpaType";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  kpas: Kpa[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  onEdit: (kpa: Kpa) => void;
  onDelete: (kpa: Kpa) => void;
  
  canWrite?: boolean;
}

export default function KpaTable({ kpas, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete, canWrite }: Props) {
  if (!pagination) return <div>Enter the pagination</div>;

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setPerPage(newPerPage);
    setPage(1);
  };

  return (
    <div className="table-wrapper">
      <table className="table-default">
        <thead className="table-head">
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>IMPLEMENTATION</th>
            {canWrite && <th>ACTIONS</th>}
          </tr>
        </thead>

        <tbody>
          {kpas.map((kpa, index) => (
            <tr key={kpa.id} className="table-row">
              <td className="table-cell">{index+1}</td>
              <td className="table-cell">{kpa.name}</td>
              <td className="table-cell">{kpa.implementation}%</td>

              {canWrite && (<td className="table-cell space-x-2">
                <button className="btn-edit-table" onClick={() => onEdit(kpa)}>
                  <SquarePen className="w-4 h-4" />
                </button>
                <button className="btn-delete-table" onClick={() => onDelete(kpa)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>)}
            </tr>
          ))}

          {/* Pagination */}
          <tr className="table-pagination-row">
            <td colSpan={canWrite ? 4 : 3} className="table-pagination-cell">
              <div className="table-pagination-container">

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Rows per page:</span>
                  <select
                    className="table-perpage-select"
                    value={perPage}
                    onChange={handlePerPageChange}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="table-pagination-actions">
                  <button
                    className="table-pagination-btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>

                  <span className="text-gray-600 text-xs">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button
                    className="table-pagination-btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.last_page}
                  >
                    Next →
                  </button>
                </div>

              </div>
            </td>
          </tr>

          {kpas.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No KPAs registered
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
