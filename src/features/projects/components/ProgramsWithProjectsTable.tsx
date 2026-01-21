import type { Program } from "@/features/programs/types/program.types";
import { Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
    programs: Program[];
    pagination: Pagination;
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export default function ProgramsWithProjectsTable({ programs, pagination, page, perPage, setPage, setPerPage }: Props) {

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPerPage(Number(e.target.value));
      setPage(1);
    };

    return(
        <div className="table-wrapper">
            <table className="table-default">
                <thead className="table-head">
                    <tr>
                        <th>#</th>
                        <th>PROGRAM NAME</th>
                        <th>DESCRIPTION</th>
                        <th>PROJECTS ASSIGNED</th>
                        <th>VIEW PROJECTS</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program, index) => (
                        <tr key={program.id} className="table-row hover:bg-gray-50">
                            <td className="table-cell">{index + 1}</td>
                            <td className="table-cell">{program.name}</td>
                            <td className="table-cell">{program.description}</td>
                            <td className="table-cell">{program.projects_count}</td>
                            <td className="table-cell ">
                                <Link to={`/projects/new/${program.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex hover:cursor-pointer items-center justify-center w-8 h-8 rounded-md text-green-600 hover:bg-sky-50 transition-colors" title="Add Project" >
                                    <Plus className="w-4 h-4" />
                                </Link>
                                <Link to={`/projects/program/${program.id}`} className="inline-flex hover:cursor-pointer items-center justify-center w-8 h-8 rounded-md text-sky-600 hover:bg-sky-50 transition-colors" title="View Projects" >
                                    <Eye className="w-4 h-4" />
                                </Link>
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
                </tbody>
            </table>
        </div>
    )
}