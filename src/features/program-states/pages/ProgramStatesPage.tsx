import { useState, useMemo } from "react";
import { Search, Plus, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgramStates } from "../api/programStateQueries";
import { ProgramStateTableRow } from "../components/ProgramStateTableRow";
import { ProgramStateCreateDialog } from "../components/ProgramStateCreateDialog";
import { ProgramStateEditDialog } from "../components/ProgramStateEditDialog";
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

const ITEMS_PER_PAGE = 10;

export function ProgramStatesPage() {
  const { data: programStates, isLoading, error } = useProgramStates();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProgramState, setSelectedProgramState] =
    useState<ProgramState | null>(null);

  // Filter program states based on search
  const filteredProgramStates = useMemo(() => {
    if (!programStates) return [];
    if (!searchTerm.trim()) return programStates;

    const lowerSearch = searchTerm.toLowerCase();
    return programStates.filter((state) =>
      state.name.toLowerCase().includes(lowerSearch)
    );
  }, [programStates, searchTerm]);

  // Sorting
  const { sortedData, sortConfig, requestSort } = useTableSort<ProgramState>(
    filteredProgramStates,
    "id" // default sort by ID
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedProgramStates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

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
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
            Program States
          </h1>
          <p className="text-gray-500 mt-2">
            Manage lifecycle states for programs (e.g., Active, Inactive, Completed)
          </p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          New State
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search program states..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all max-w-md"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sky-700">Total States</p>
              <p className="text-2xl font-bold text-sky-900 mt-1">{programStates?.length || 0}</p>
            </div>
            <div className="p-3 bg-sky-500 rounded-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredProgramStates.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead
                  className="pl-8 pr-6 w-32"
                  sortable
                  sortDirection={sortConfig.key === "id" ? sortConfig.direction : null}
                  onSort={() => requestSort("id")}
                >
                  ID
                </DataTableHead>
                <DataTableHead
                  className="pl-6"
                  sortable
                  sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                  onSort={() => requestSort("name")}
                >
                  State Name
                </DataTableHead>
                <DataTableHead className="pr-8 text-right w-36">
                  Actions
                </DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginatedProgramStates.map((programState) => (
                <ProgramStateTableRow
                  key={programState.id}
                  programState={programState}
                  onEdit={handleEdit}
                />
              ))}
            </DataTableBody>
          </DataTable>

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
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
      <ProgramStateCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <ProgramStateEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        programState={selectedProgramState}
      />
    </div>
  );
}
