import { SquarePen, Trash } from "lucide-react";
import type { Donor } from "../types/donor.types";


interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
    donors: Donor[];
    pagination: Pagination;
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;

    onEdit: (donor: Donor) => void;
    onDelete: (donor: Donor) => void;

    canEdit?: boolean;
    canDelete?: boolean;
}

export default function DonorTable( { donors, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete, canEdit, canDelete}: Props) {
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
                            <th>DONOR NAME</th>
                            {(canEdit || canDelete) && <th>ACTIONS</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {donors.map((donor, index) => (
                            <tr key={donor.id} className="table-row">
                                <td className="table-cell">{index + 1}</td>
                                <td className="table-cell">{donor.name}</td>
                                {(canEdit || canDelete) && (
                                    <td className="table-cell space-x-2"> 
                                        {canEdit && (
                                            <button className="btn-edit-table" onClick={() => onEdit(donor)}>
                                                <SquarePen className="w-4 h-4" />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button className="btn-delete-table" onClick={() => onDelete(donor)}>
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        <tr className="table-pagination-row">
                            <td colSpan={(canEdit || canDelete) ? 3 : 2} className="table-pagination-cell">
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


    )
}
