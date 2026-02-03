import { useState, useRef, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";
import { useParams } from "react-router-dom";
import { FolderOpenDot, Loader2, Search } from "lucide-react";
import { useProgram } from "@/features/programs/api/programQueries";
import { EmptyState } from "@/shared/components/EmptyState";
import ProjectsOfProgramTable from "../components/ProjectsOfProgramTable";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useDebounce } from "@/shared/hooks/useDebounce";
import BackArrow from "@/shared/components/backArrow/BackArrow";


export default function ListProjectsOfProgramPage(){
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { programId } = useParams();
    const parsedProgramId = Number(programId);
    const prevSearch = useRef(searchTerm);
    const prevPage = useRef(page);

    const searchChanged = prevSearch.current !== searchTerm;
    const pageChanged = prevPage.current !== page;

    if (Number.isNaN(parsedProgramId) ) return <div>Invalid program</div>;
    const { data: programData, error: programError } = useProgram(parsedProgramId);
    if(programError) return <div>Invalid program</div>;

    const debouncedSearch = useDebounce(searchTerm, 400);
    const { data, isLoading, isFetching, error } = useProjects(page, perPage, parsedProgramId, debouncedSearch);
    const showSkeleton = isFetching && (searchChanged || pageChanged);


    const handleSearchChange = (value: string) => {
        setPage(1);
        setSearchTerm(value);
    };

    useEffect(() => {
        prevSearch.current = searchTerm;
        prevPage.current = page;
    }, [searchTerm, page]);

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
                <BackArrow backTo="/projects"/>
            </div>
            
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by program name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            {showSkeleton ? <TableSkeleton columns={9} /> :
            data && data.projects.length > 0 ?
                <ProjectsOfProgramTable projects={data.projects} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
                : <EmptyState icon={FolderOpenDot} title={searchTerm ? "No Projects found" : "No Projects available"}
                    description={
                        searchTerm && "Try adjusting your search terms"
                } />
            }
        </div>
    )
}