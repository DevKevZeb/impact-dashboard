import { useHasScope } from "@/features/auth/hooks/useHasScope";
import type { Program } from "@/features/programs/types/program.types";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useProjects } from "../hooks/useProjects";
import type { ProjectTable } from "../types/project.types";
import { ChevronDown, ChevronRight, Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteProjectDialog from "./DeleteProjectDialog";

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
    searchTerm: string;
}

export default function ProgramsWithProjectsTable({ programs, pagination, page, perPage, setPage, setPerPage, searchTerm }: Props) {
    const canCreate = useHasScope("projects:create");
    const [expandedPrograms, setExpandedPrograms] = useState<number[]>([]);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setPage(1);
    };

    const toggleExpand = (programId: number) => {
        if (expandedPrograms.includes(programId)) {
            setExpandedPrograms((prev) => prev.filter((id) => id !== programId));
            return;
        }

        setExpandedPrograms((prev) => [...prev, programId]);
    };

    return (
        <div className="table-wrapper">
            <table className="table-default">
                <thead className="table-head">
                    <tr>
                        <th>#</th>
                        <th>PROGRAM NAME</th>
                        <th>COUNTRY</th>
                        <th>ROLE</th>
                        <th className="text-center!">PROJECTS ASSIGNED</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program, index) => {
                        const isExpanded = expandedPrograms.includes(program.id);
                        const isEditor = program.can_edit !== false;
                        const isProgramCountryActive = program.country_user_roles?.some(cur => cur.country?.active === true) ?? false;

                        return (
                            <Fragment key={program.id}>
                                <tr className="table-row cursor-pointer" onClick={() => toggleExpand(program.id)}>
                                    <td className="table-cell">{index + 1}</td>
                                    <td className="table-cell font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="p-1 rounded hover:bg-sky-100 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpand(program.id);
                                                }}
                                            >
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                            <span>{program.name}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        {program.country_user_roles && program.country_user_roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {program.country_user_roles
                                                    .filter((cur) => cur.country)
                                                    .map((cur) => (
                                                        <span key={cur.id} className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                                            {cur.country!.name}
                                                        </span>
                                                    ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="table-cell">
                                        <span
                                            className={
                                                isEditor
                                                    ? "inline-flex rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700"
                                                    : "inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
                                            }
                                        >
                                            {isEditor ? "Editor" : "Invited"}
                                        </span>
                                    </td>
                                    <td className="table-cell text-center font-medium">{program.projects_count ?? 0}</td>
                                    <td className="table-cell" onClick={(e) => e.stopPropagation()}>
                                        {canCreate && isProgramCountryActive && (
                                            <Link
                                                to={`/app/projects/new/${program.id}`}
                                                className="btn-secondary-table inline-flex items-center gap-1"
                                                title="Add Project"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Project
                                            </Link>
                                        )}
                                    </td>
                                </tr>

                                {isExpanded && (
                                    <tr className="bg-sky-50/50">
                                        <td colSpan={6} className="p-0">
                                            <ProgramProjectsSubTable programId={program.id} isCountryActive={isProgramCountryActive} searchTerm={searchTerm} />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}

                    <tr className="table-pagination-row">
                        <td colSpan={6} className="table-pagination-cell">
                            <div className="table-pagination-container">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span>Rows per page:</span>
                                    <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange}>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <div className="table-pagination-actions">
                                    <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                        ← Prev
                                    </button>
                                    <span className="text-gray-600 text-xs">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button className="table-pagination-btn" onClick={() => setPage(page + 1)} disabled={page === pagination.last_page}>
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

interface ProgramProjectsSubTableProps {
    programId: number;
    isCountryActive: boolean;
    searchTerm: string;
}

function ProgramProjectsSubTable({ programId, isCountryActive, searchTerm }: ProgramProjectsSubTableProps) {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [selectedProject, setSelectedProject] = useState<ProjectTable | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const canEdit = useHasScope("projects:write");
    const canDelete = useHasScope("projects:delete");
    const navigate = useNavigate();

    const { data, isLoading } = useProjects(page, perPage, programId, searchTerm);
    const deleteProjectMutation = useDeleteProject(programId);

    const projects = data?.projects ?? [];
    const pagination = data?.pagination;

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setPage(1);
    };

    const handleDeleteClick = (project: ProjectTable) => {
        setSelectedProject(project);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProject) {
            return;
        }

        await deleteProjectMutation.mutateAsync(selectedProject.id);
        setIsDeleteDialogOpen(false);
        setSelectedProject(null);
    };

    const formatDate = (date: Date | string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    if (isLoading) {
        return <div className="p-4 text-center text-sm text-gray-500">Loading projects...</div>;
    }

    return (
        <div className="p-3">
            {searchTerm && (
                <div className="mb-3 text-xs text-gray-600">
                    Filtering projects by: <span className="font-medium">{searchTerm}</span>
                </div>
            )}
            <table className="w-full text-xs bg-white">
                <thead>
                    <tr className="bg-sky-100/70 text-[#1E3291]">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">PROJECT NAME</th>
                        <th className="px-4 py-2 text-left">START DATE</th>
                        <th className="px-4 py-2 text-left">END DATE</th>
                        <th className="px-4 py-2 text-left">PROGRESS</th>
                        <th className="px-4 py-2 text-left">ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((project, index) => (
                        <tr key={project.id} className="border-t border-gray-100">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{project.name}</td>
                            <td className="px-4 py-2">{formatDate(project.start_date)}</td>
                            <td className="px-4 py-2">{formatDate(project.end_date)}</td>
                              <td className="px-4 py-2 min-w-40">
                                <div className="w-full bg-[#61C8E7]/70 rounded-full h-4 relative overflow-hidden">
                                    <div
                                        className="bg-[#1E3291] h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.round(project.progress)}%` }}
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
                                        {Math.round(project.progress)}%
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                    {!Boolean(project.can_edit) && (
                                        <button
                                            type="button"
                                            className="btn-primary-table"
                                            onClick={() => navigate(`/app/projects/view/${project.id}`)}
                                            title="View Project"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}

                                    {canEdit && Boolean(project.can_edit) && isCountryActive && (
                                        <button
                                            type="button"
                                            className="btn-edit-table"
                                            onClick={() => navigate(`/app/projects/edit/${project.program_id}/${project.id}`)}
                                            title="Edit Project"
                                        >
                                            <SquarePen className="w-4 h-4" />
                                        </button>
                                    )}

                                    {canEdit && Boolean(project.can_edit) && !isCountryActive && (
                                        <button
                                            type="button"
                                            className="btn-primary-table"
                                            onClick={() => navigate(`/app/projects/view/${project.id}`)}
                                            title="View Project"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}

                                    {canDelete && Boolean(project.can_edit) && isCountryActive && (
                                        <button
                                            type="button"
                                            className="btn-delete-table"
                                            onClick={() => handleDeleteClick(project)}
                                            title="Delete Project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}

                    {projects.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                                No projects assigned to this program.
                            </td>
                        </tr>
                    )}

                    {pagination && (
                        <tr className="table-pagination-row">
                            <td colSpan={7} className="table-pagination-cell">
                                <div className="table-pagination-container">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span>Rows per page:</span>
                                        <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange}>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>

                                    <div className="table-pagination-actions">
                                        <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
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
                    )}
                </tbody>
            </table>

            {selectedProject && (
                <DeleteProjectDialog
                    project={selectedProject}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleConfirmDelete}
                    isLoading={deleteProjectMutation.isPending}
                />
            )}
        </div>
    );
}

