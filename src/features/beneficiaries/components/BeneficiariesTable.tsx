import { SquarePen, Trash2 } from "lucide-react";
import type { Beneficiary } from "../types/beneficiaries.types";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}


interface Props {
    beneficiaries: Beneficiary[];
    pagination: Pagination;
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;

    onEdit: (beneficiary: Beneficiary) => void;
    onDelete: (beneficiary: Beneficiary) => void;

    canWrite?: boolean;
}

export default function BeneficiariesTable({ beneficiaries, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete, canWrite }: Props) {
  
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
            {canWrite && (<th>ACTIONS</th>)}
            </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary, index) => (
            <tr key={beneficiary.id} className="table-row">
                <td className="table-cell">{index + 1}</td>
                <td className="table-cell">{beneficiary.name}</td>
                {canWrite && (<td className="table-cell space-x-2">
                  <button className="btn-edit-table" onClick={() => onEdit(beneficiary)}>
                    <SquarePen className="w-4 h-4" />
                  </button>
                  <button className="btn-delete-table" onClick={() => onDelete(beneficiary)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>)}
            </tr>
          ))}
          <tr className="table-pagination-row">
            <td colSpan={canWrite ? 3 : 2} className="table-pagination-cell">
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
        </tbody>
      </table>
    </div>
  );
}