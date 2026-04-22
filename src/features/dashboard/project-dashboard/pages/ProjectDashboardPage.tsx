import { useEffect, useRef, useState } from "react";
import { FolderOpenDot, Loader2, Search } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ProjectDashboardTable from "../components/ProjectDashboardTable";
import {
  useProjectDashboard,
  useUpdateProjectDashboardProgress,
  useUpdateProjectDashboardWeight,
} from "../hooks/useProjectDashboard";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function ProjectDashboardPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const prevSearch = useRef(searchTerm);
  const prevPage = useRef(page);

  const searchChanged = prevSearch.current !== searchTerm;
  const pageChanged = prevPage.current !== page;

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data, isLoading, isFetching, error } = useProjectDashboard(page, perPage, debouncedSearch);
  const updateProgressMutation = useUpdateProjectDashboardProgress();
  const updateWeightMutation = useUpdateProjectDashboardWeight();
  const { hasScope, hasAnyScope } = useAuthStore();

  const isCountryTable = hasAnyScope(["projects:view_by_country", "programs:view_by_country"]);
  const canEditProgress = hasScope("projects:progress");
  const canEditWeight = hasScope("projects:weight");

  const showSkeleton = isFetching && (searchChanged || pageChanged);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
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
          <p className="text-gray-500">Loading dashboard rows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading project dashboard</p>
          <p className="text-sm text-gray-600">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4 h-full overflow-hidden">

      <div className="title-container shrink-0">
        <div>
          <h1 className="page-title">Project Dashboard</h1>
          <p className="page-description">
            This dashboard consolidates country, measure, program, management, agency and progress data for projects.
          </p>
        </div>
      </div>

      <div className="relative max-w-md shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by project, program, country, measure..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-default"
        />
      </div>

      <div className="flex-1 min-h-0">

      {showSkeleton ? (
        <TableSkeleton columns={12} />
      ) : data && data.rows.length > 0 ? (
        <ProjectDashboardTable
          rows={data.rows}
          pagination={data.pagination}
          page={page}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          isCountryTable={isCountryTable}
          canEditProgress={canEditProgress}
          canEditWeight={canEditWeight}
          isUpdatingProgress={updateProgressMutation.isPending}
          isUpdatingWeight={updateWeightMutation.isPending}
          onSaveProgress={(projectId, progress) =>
            updateProgressMutation.mutateAsync({ projectId, progress })
          }
          onSaveWeight={(projectId, weight) =>
            updateWeightMutation.mutateAsync({ projectId, weight })
          }
        />
      ) : (
        <EmptyState
          icon={FolderOpenDot}
          title={searchTerm ? "No rows found" : "No rows available"}
          description={searchTerm ? "Try adjusting your search terms" : "No project dashboard data is currently available."}
        />
      )}
      </div>
    </div>
  );
}
