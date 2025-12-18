import { SquarePen, Trash2 } from "lucide-react";
import type { IndicatorType } from "../types/IndicatorTypeType";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  types: IndicatorType[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  onEdit: (type: IndicatorType) => void;
  onDelete: (type: IndicatorType) => void;
}
export default function IndicatorTapeTable({types, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete } : Props){
    if(!pagination) return <div>Enter the pagination</div>

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = Number(e.target.value);
        setPerPage(newPerPage);
        setPage(1);
    };

    return(
        <div className="table-wrapper">
            <table className="table-default">
                <thead className="table-head">
                    <tr>
                        <th>N°</th>
                        <th>NAME</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {types.map((type, index)=> (
                        <tr key={type.id} className="table-row">
                            <td className="table-cell">{index+1}</td>
                            <td className="table-cell">{type.name}</td>
                            <td className="table-cell space-x-2">
                                <button className="btn-edit-table" onClick={() => onEdit(type)}>
                                    <SquarePen className="w-4 h-4" />
                                </button>
                                <button className="btn-delete-table" onClick={() => onDelete(type)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}

                    <tr className="table-pagination-row">
                        <td colSpan={4} className="table-pagination-cell">
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

                    {types.length === 0 && (
                        <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                            No Indicator Types registered
                        </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )



}