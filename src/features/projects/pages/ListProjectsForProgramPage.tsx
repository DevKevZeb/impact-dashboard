import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useParams } from "react-router-dom";
import { FolderOpenDot, Loader2, Search } from "lucide-react";
import { useProgram } from "@/features/programs/api/programQueries";
import { EmptyState } from "@/shared/components/EmptyState";
import ProjectsForProgramTable from "../components/ProjectsForProgramTable";

export default function ListProjectsForProgramPage(){
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { programId } = useParams();
    const parsedProgramId = Number(programId);

    if (Number.isNaN(parsedProgramId) ) return <div>Invalid program</div>;

    const { data: programData, error: programError } = useProgram(parsedProgramId);

    if(programError) return <div>Invalid program</div>;

    const { data, isLoading, error } = useProjects(page, perPage, parsedProgramId, searchTerm);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
            <Loader2 className="loader-default" />
            <p className="text-gray-600">Loading projects...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-600 font-medium">Error loading projects</p>
            <p className="text-sm text-gray-600">
                {error instanceof Error ? error.message : "Unknown error"}
            </p>
            </div>
        </div>
        );
    }

    return (
        <div className="page-container">
            <div className="title-container">
                <div>
                    <h1 className="page-title">Projects of "{programData?.name}" program </h1>
                    <p className="page-description">Use this page to view and manage information about projects assigned to a specific program.</p>
                </div>
            </div>
            
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by program name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            { data && data.projects.length > 0 ?
                <ProjectsForProgramTable projects={data.projects} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
                : <EmptyState icon={FolderOpenDot} title={searchTerm ? "No Projects found" : "No Projects available"}
                    description={
                        searchTerm && "Try adjusting your search terms"
                } />
            }
        </div>
    )
}