import { useState } from "react";
import { useSdgsPaginated } from "../api/sdgQueries";
import { SdgTableRow } from "../components/SdgTableRow";
import { SdgUploadDialog } from "../components/SdgUploadDialog";
import { SdgEditDialog } from "../components/SdgEditDialog";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTableSort } from "@/shared/hooks/useTableSort";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FolderOpen, Search } from "lucide-react";
import type { Sdg } from "../types/sdg.types";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { SCOPES } from "@/features/auth/utils/permissions";

export function SdgsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSdg, setSelectedSdg] = useState<Sdg | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const canWrite = useHasScope(SCOPES.SDGS_WRITE);
  const { data, isLoading, error } = useSdgsPaginated(currentPage, perPage);

  const handleEdit = (sdg: Sdg) => {
    setSelectedSdg(sdg);
    setEditDialogOpen(true);
  };

  // Sorting on current page data
  const { sortedData, sortConfig, requestSort } = useTableSort<Sdg>(
    data?.sdgs || [],
    "id"
  );

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading SDGs...</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Error loading SDGs</h3>
            <p className="text-gray-500 mt-1">Please try again</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">
            SDGs
          </h1>
          <p className="text-gray-500 mt-2">
            Manage the images of the 17 UN Sustainable Development Goals
          </p>
        </div>

        {canWrite && (
          <Button
            onClick={() => setUploadDialogOpen(true)}
            size="lg"
            className="btn-secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload SDG
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* SDG List */}
      {data && data.sdgs.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>#</DataTableHead>
                <DataTableHead>
                  Preview
                </DataTableHead>
                <DataTableHead
                  sortable
                  sortDirection={sortConfig.key === "filename" ? sortConfig.direction : null}
                  onSort={() => requestSort("filename")}
                >
                  Filename
                </DataTableHead>
                <DataTableHead>
                  Actions
                </DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedData.map((sdg, index) => {
                const rowIndex = (data.pagination.current_page - 1) * data.pagination.per_page + index + 1;
                return (
                  <SdgTableRow key={sdg.id} sdg={sdg} index={rowIndex} onEdit={handleEdit} canWrite={canWrite} />
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
          icon={FolderOpen}
          title={searchTerm ? "No results found" : "No SDGs available"}
          description={
            searchTerm
              ? "Try another search term"
              : "Start by uploading Sustainable Development Goal images"
          }
          action={
            !searchTerm && canWrite ? (
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="btn-secondary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload First SDG
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Upload Dialog */}
      <SdgUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      
      {/* Edit Dialog */}
      <SdgEditDialog sdg={selectedSdg} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
}
