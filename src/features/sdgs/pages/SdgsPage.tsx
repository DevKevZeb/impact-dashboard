import { useState, useMemo } from "react";
import { useSdgs } from "../api/sdgQueries";
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
import { Plus, Loader2, FolderOpen, Search, List } from "lucide-react";
import type { Sdg } from "../types/sdg.types";

const ITEMS_PER_PAGE = 10;

export function SdgsPage() {
  const { data: sdgs, isLoading, error } = useSdgs();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSdg, setSelectedSdg] = useState<Sdg | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (sdg: Sdg) => {
    setSelectedSdg(sdg);
    setEditDialogOpen(true);
  };

  const filteredSdgs = useMemo(() => {
    return sdgs?.filter((sdg) =>
      sdg.filename.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [sdgs, searchTerm]);

  // Sorting
  const { sortedData, sortConfig, requestSort } = useTableSort<Sdg>(
    filteredSdgs,
    "id" // default sort by ID
  );

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSdgs = sortedData.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg">
              <List className="w-6 h-6 text-white" />
            </div>
            SDGs
          </h1>
          <p className="text-gray-500 mt-2">
            Manage the images of the 17 UN Sustainable Development Goals
          </p>
        </div>

        <Button
          onClick={() => setUploadDialogOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Upload SDG
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-fit sm:ml-auto">
          <div className="p-2 bg-sky-500 rounded-lg">
            <List className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-sky-700 whitespace-nowrap">Total SDGs:</span>
            <span className="text-xl font-bold text-sky-900">{sdgs?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* SDG List */}
      {filteredSdgs.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead className="pl-8 pr-6 w-40">
                  Preview
                </DataTableHead>
                <DataTableHead
                  className="px-6 w-32"
                  sortable
                  sortDirection={sortConfig.key === "id" ? sortConfig.direction : null}
                  onSort={() => requestSort("id")}
                >
                  ID
                </DataTableHead>
                <DataTableHead
                  className="pl-6"
                  sortable
                  sortDirection={sortConfig.key === "filename" ? sortConfig.direction : null}
                  onSort={() => requestSort("filename")}
                >
                  Filename
                </DataTableHead>
                <DataTableHead className="pr-8 text-right w-36">
                  Actions
                </DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginatedSdgs.map((sdg) => (
                <SdgTableRow key={sdg.id} sdg={sdg} onEdit={handleEdit} />
              ))}
            </DataTableBody>
          </DataTable>

          {/* Pagination */}
          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedData.length}
              itemsPerPage={ITEMS_PER_PAGE}
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
            !searchTerm ? (
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
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
