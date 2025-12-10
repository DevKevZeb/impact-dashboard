import { useState } from "react";
import { Search, Plus, Loader2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgramsPaginated } from "../api/programQueries";
import { ProgramTableRow } from "../components/ProgramTableRow";
import { ProgramCreateDialog } from "../components/ProgramCreateDialog";
import { ProgramEditDialog } from "../components/ProgramEditDialog";
import { ProgramDetailDialog } from "../components/ProgramDetailDialog";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTableSort } from "@/shared/hooks/useTableSort";
import type { Program } from "../types/program.types";

export function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { data, isLoading, error } = useProgramsPaginated(currentPage, perPage);

  // Filter data by search term
  const filteredData = (data?.programs || []).filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting on filtered data
  const { sortedData, sortConfig, requestSort } = useTableSort<Program>(
    filteredData,
    "id"
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleView = (program: Program) => {
    setSelectedProgram(program);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto" />
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Programs</h1>
          <p className="text-gray-500 mt-2">
            Manage programs with contacts, SDGs and states
          </p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="btn-secondary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Table */}
      {sortedData && sortedData.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>#</DataTableHead>
                <DataTableHead>Banner</DataTableHead>
                <DataTableHead
                  sortable
                  sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                  onSort={() => requestSort("name")}
                >
                  Program Info
                </DataTableHead>
                <DataTableHead>Contact</DataTableHead>
                <DataTableHead>State</DataTableHead>
                <DataTableHead>SDGs</DataTableHead>
                <DataTableHead>Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedData.map((program, index) => {
                const rowIndex = (data.pagination.current_page - 1) * data.pagination.per_page + index + 1;
                return (
                  <ProgramTableRow
                    key={program.id}
                    program={program}
                    index={rowIndex}
                    onView={handleView}
                    onEdit={handleEdit}
                  />
                );
              })}
            </DataTableBody>
          </DataTable>
          
          {data && (
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
          icon={FolderKanban}
          title="No programs found"
          description={
            searchTerm
              ? "Try adjusting your search criteria"
              : "Get started by creating your first program"
          }
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Create Program
            </Button>
          }
        />
      )}

      {/* Dialogs */}
      <ProgramCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <ProgramEditDialog
        program={selectedProgram}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <ProgramDetailDialog
        program={selectedProgram}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
