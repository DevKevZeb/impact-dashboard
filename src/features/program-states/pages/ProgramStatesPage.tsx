import { useState } from "react";
import { Search, Plus, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgramStatesPaginated } from "../api/programStateQueries";
import { ProgramStateTableRow } from "../components/ProgramStateTableRow";
import { ProgramStateCreateDialog } from "../components/ProgramStateCreateDialog";
import { ProgramStateEditDialog } from "../components/ProgramStateEditDialog";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTableSort } from "@/shared/hooks/useTableSort";
import type { ProgramState } from "../types/programState.types";

export function ProgramStatesPage() {
  const canWrite = useHasScope("program_states:write");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Fixed items per page for now
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProgramState, setSelectedProgramState] =
    useState<ProgramState | null>(null);

  const { data, isLoading, error } = useProgramStatesPaginated(currentPage, perPage);

  // Sorting on current page data
  const { sortedData, sortConfig, requestSort } = useTableSort<ProgramState>(
    data?.programStates || [],
    "id" // default sort by ID
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (programState: ProgramState) => {
    setSelectedProgramState(programState);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading Program States...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Error loading program states</h3>
            <p className="text-gray-500 mt-1">Please try again</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">
            Program States
          </h1>
          <p className="text-gray-500 mt-2">
            Manage lifecycle states for programs
          </p>
        </div>

        {canWrite && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="btn-secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            New State
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search program states..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Table */}
      {data && data.programStates.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>#</DataTableHead>
                <DataTableHead
                  sortable
                  sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                  onSort={() => requestSort("name")}
                >
                  State Name
                </DataTableHead>
                <DataTableHead>
                  Actions
                </DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedData.map((programState, index) => {
                const rowIndex = (data.pagination.current_page - 1) * data.pagination.per_page + index + 1;
                return (
                  <ProgramStateTableRow
                    key={programState.id}
                    programState={programState}
                    index={rowIndex}
                    onEdit={handleEdit}
                    canWrite={canWrite}
                  />
                );
              })}
            </DataTableBody>
          </DataTable>

          {/* Pagination */}
          {data.pagination.last_page > 1 && (
            <TablePagination
              currentPage={data.pagination.current_page}
              totalPages={data.pagination.last_page}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.per_page}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Tag}
          title={searchTerm ? "No program states found" : "No program states available"}
          description={
            searchTerm
              ? "Try adjusting your search terms"
              : "Click 'New State' to create your first program state"
          }
        />
      )}

      {/* Dialogs */}
      {canWrite && (
        <>
          <ProgramStateCreateDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
          <ProgramStateEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            programState={selectedProgramState}
          />
        </>
      )}
    </div>
  );
}
