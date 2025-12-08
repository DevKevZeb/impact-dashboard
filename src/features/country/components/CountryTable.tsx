import { SquarePen, Trash2 } from "lucide-react";
import type { Country } from "../types/CountryType";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  countries: Country[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  onEdit: (agency: Country) => void;
  onDelete: (agency: Country) => void;
}

export default function CountryTable({ countries, pagination, page, perPage, setPage, setPerPage, onEdit, onDelete} : Props) {
    if(!pagination) return null;

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
                        <th>NAME</th>
                        <th>CURRENCY</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {countries.map((country) => (
                        <tr key={country.id} className="table-row">
                            <td className="table-cell">{country.name}</td>
                            <td className="table-cell">{country.currency.code}</td>

                            <td className="table-cell space-x-2">
                                <button className="btn-edit-table" onClick={() => onEdit(country)}>
                                    <SquarePen className="w-4 h-4"/>
                                </button>
                                <button className="btn-delete-table" onClick={() => onEdit(country)}>
                                    <Trash2 className="w-4 h-4"/>
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

                    {countries.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                There are no registered countries
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );
}