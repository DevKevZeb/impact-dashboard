import { CheckCheck, SquarePen, Trash2 } from "lucide-react";
import type { Agency } from "../types/agency.types";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  agencies: Agency[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  onEdit: (agency: Agency) => void;
  onDelete: (agency: Agency) => void;
  onApprove: (agency: Agency) => void;
}

export default function AgencyTable({ agencies, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete, onApprove }: Props) {
  
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
            <th>N°</th>
            <th>NAME</th>
            <th>URL</th>
            <th>IS APPROVED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {agencies.map((agency, index) => (
            <tr key={agency.id} className="table-row">
              <td className="table-cell">{index + 1}</td>
              <td className="table-cell">{agency.name}</td>
              <td className="table-cell">
                <a href={agency.url} target="_blank" className="text-blue-600 underline">
                  {agency.url}
                </a>
              </td>
              <td className="table-cell">
                <span className={agency.isApproved ? "badge-yes" : "badge-no"}>
                  {agency.isApproved ? "Yes" : "No"}
                </span>
              </td>

              <td className="table-cell space-x-2">
                <button className="btn-edit-table" onClick={() => onEdit(agency)}>
                  <SquarePen className="w-4 h-4" />
                </button>
                <button className="btn-delete-table" onClick={() => onDelete(agency)}>
                  <Trash2 className="w-4 h-4" />
                </button>
                {!agency.isApproved && (
                  <button className="btn-tertiary-table" onClick={() => onApprove(agency)}>
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}

          <tr className="table-pagination-row">
            <td colSpan={5} className="table-pagination-cell">
              <div className="table-pagination-container">

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Rows per page:</span>
                  <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange} >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="table-pagination-actions">
                  <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1} >
                    ← Prev
                  </button>

                  <span className="text-gray-600 text-xs">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button className="table-pagination-btn" onClick={() => setPage(page + 1)} disabled={page === pagination.last_page} >
                    Next →
                  </button>
                </div>
              </div>
            </td>
          </tr>

          {agencies.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                There are no registered agencies
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
