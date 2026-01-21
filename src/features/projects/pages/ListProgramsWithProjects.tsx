import { useProgramsPaginated } from "@/features/programs/api/programQueries";
import { BookOpenCheck, Loader2, Search } from "lucide-react";
import { useState } from "react";
import ProgramsWithProjectsTable from "../components/ProgramsWithProjectsTable";
import { EmptyState } from "@/shared/components/EmptyState";

export default function ListProgramsWithProjects(){
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false); 

    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, error } = useProgramsPaginated(page, perPage);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
            <Loader2 className="loader-default" />
            <p className="text-gray-600">Loading programs...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-600 font-medium">Error loading programs</p>
            <p className="text-sm text-gray-600">
                {error instanceof Error ? error.message : "Unknown error"}
            </p>
            </div>
        </div>
        );
    }

    return(
        <div className="page-container">
            <div className="title-container">
                <div>
                    <h1 className="page-title">Programs with Projects assigned</h1>   
                    <p className="page-description">Use this page to view and manage programs with projects assigned.</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by program name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            { data && data.programs.length > 0 ?
            <ProgramsWithProjectsTable programs={data.programs} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
        : <EmptyState icon={BookOpenCheck} title={searchTerm ? "No Program found" : "No Programs available"}
          description={
            searchTerm && "Try adjusting your search terms"
          } />}
        </div>
    )
}