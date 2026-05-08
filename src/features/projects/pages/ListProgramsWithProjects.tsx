import { useMyPrograms } from "@/features/programs/api/programQueries";
import { BookOpenCheck, Loader2, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import ProgramsWithProjectsTable from "../components/ProgramsWithProjectsTable";
import { EmptyState } from "@/shared/components/EmptyState";
import { getProjectPaginatedByProgramId } from "../services/project.api";

export default function ListProgramsWithProjects(){
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const debounceRef = useRef<number | null>(null);

    const { programs, pagination, isLoading, error } = useMyPrograms(page, perPage);
    const searchTermTrimmed = debouncedSearchTerm.trim();

    useEffect(() => {
        // simple debounce (300ms)
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 300);

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    const projectSearchQueries = useQueries({
        queries: programs.map((program) => ({
            queryKey: ["projects", program.id, 1, 1, searchTermTrimmed],
            queryFn: () => getProjectPaginatedByProgramId(1, 1, program.id, searchTermTrimmed),
            enabled: searchTermTrimmed.length > 0,
            staleTime: 10 * 1000,
        })),
    });

    const visiblePrograms = searchTermTrimmed.length > 0
        ? programs.filter((_, index) => {
            return (projectSearchQueries[index]?.data?.pagination?.total ?? 0) > 0;
        })
        : programs;

    const isFilteringProjects = searchTermTrimmed.length > 0 && projectSearchQueries.some((query) => query.isLoading || query.isFetching);

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
                    <h1 className="page-title">Projects assigned</h1>   
                    <p className="page-description">Click on a program row to expand and manage its projects.</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by project name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            {visiblePrograms.length > 0 && pagination ? (
                <div className="relative">
                    {isFilteringProjects && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                            <div className="text-center space-y-2">
                                <Loader2 className="loader-default" />
                                <p className="text-gray-600">Searching projects...</p>
                            </div>
                        </div>
                    )}

                    <ProgramsWithProjectsTable
                        programs={visiblePrograms}
                        pagination={pagination}
                        page={page}
                        perPage={perPage}
                        setPage={setPage}
                        setPerPage={setPerPage}
                        searchTerm={searchTermTrimmed}
                    />
                </div>
            ) : (
                <EmptyState
                    icon={BookOpenCheck}
                    title={searchTermTrimmed ? "No projects found" : "No Programs available"}
                    description={searchTermTrimmed && "Try adjusting your search terms"}
                />
            )}
        </div>
    )
}
