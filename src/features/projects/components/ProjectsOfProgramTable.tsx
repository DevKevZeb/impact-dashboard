import type { ProjectTable } from "../types/project.types";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import { useHasScope } from "@/features/auth/hooks/useHasScope";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
    projects: ProjectTable[];
    pagination: Pagination;
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export default function ProjectsOfProgramTable({projects, pagination, page, perPage, setPage, setPerPage }: Props){
    const canWrite = useHasScope("projects:write") && useHasScope("kpas:write") && useHasScope("indicators:write");
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPerPage(Number(e.target.value));
      setPage(1);
    };

    const formatDate = (date: any) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    
    const navigate = useNavigate();

    return(
        <div className="table-wrapper">
            <table className="table-default">
                <thead className="table-head">
                    <tr>
                        <th>#</th> 
                        <th>NAME</th> 
                        <th>DESCRIPTION</th> 
                        <th>PROJECT URL</th> 
                        <th>START DATE</th> 
                        <th>END DATE</th> 
                        <th>PROGRESS</th>
                        <th>STATE</th> 
                        {canWrite && <th>ACTIONS</th>}
                    </tr>
                </thead>

                <tbody>
                    {projects.map((project, index) => (
                    <tr key={project.id} className="table-row hover:bg-gray-50">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{project.name}</td>

                        <td className="table-cell">{project.description}</td>
                        <td className="table-cell">{project.project_url || "—"}</td>

                        <td className="table-cell">
                            {formatDate(project.start_date)}
                        </td>

                        <td className="table-cell">
                            {formatDate(project.end_date)}
                        </td>

                        <td className="px-4 py-2">
                            <div className="w-full bg-emerald-300 rounded-full h-4 relative overflow-hidden">
                                <div className="bg-emerald-800 h-4 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} ></div>
                                <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                                {project.progress}%
                                </span>
                            </div>
                        </td>
                        <td className="table-cell">
                            {project.state.state}
                        </td>
                        {canWrite && (
                        <td className="table-cell text-center">
                            <button className="btn-edit-table" onClick={() => navigate(`/app/projects/edit/${project.program_id}/${project.id}`)}>
                                <SquarePen className="w-4 h-4" />
                            </button>
                        </td>)}

                    </tr>
                    ))}
                    <tr className="table-pagination-row">
                        <td colSpan={canWrite ? 9 : 8} className="table-pagination-cell">
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