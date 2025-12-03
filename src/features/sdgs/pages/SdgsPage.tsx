import { useState, useMemo } from "react";
import { useSdgs } from "../api/sdgQueries";
import { SdgCard } from "../components/SdgCard";
import { SdgTableRow } from "../components/SdgTableRow";
import { SdgUploadDialog } from "../components/SdgUploadDialog";
import { SdgEditDialog } from "../components/SdgEditDialog";
import { Pagination } from "../components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FolderOpen, Search, Grid3x3, List } from "lucide-react";
import type { Sdg } from "../types/sdg.types";

const ITEMS_PER_PAGE_GRID = 12;
const ITEMS_PER_PAGE_LIST = 10;

export function SdgsPage() {
  const { data: sdgs, isLoading, error } = useSdgs();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSdg, setSelectedSdg] = useState<Sdg | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  // Reset to page 1 when search term or view mode changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  // Pagination calculations
  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
  const totalPages = Math.ceil(filteredSdgs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSdgs = filteredSdgs.slice(startIndex, endIndex);

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
              <Grid3x3 className="w-6 h-6 text-white" />
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
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

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleViewModeChange("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Grid view"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewModeChange("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sky-700">Total SDGs</p>
              <p className="text-2xl font-bold text-sky-900 mt-1">{sdgs?.length || 0}</p>
            </div>
            <div className="p-3 bg-sky-500 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* SDG Grid/List */}
      {filteredSdgs.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {paginatedSdgs.map((sdg) => (
                <SdgCard key={sdg.id} sdg={sdg} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full table-fixed">
                <thead className="bg-gradient-to-r from-sky-50 to-emerald-50 border-b-2 border-sky-200">
                  <tr>
                    <th className="py-3 pl-8 pr-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-40">
                      Preview
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32">
                      ID
                    </th>
                    <th className="py-3 pl-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Filename
                    </th>
                    <th className="py-3 pr-8 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide w-36">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedSdgs.map((sdg) => (
                    <SdgTableRow key={sdg.id} sdg={sdg} onEdit={handleEdit} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSdgs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FolderOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {searchTerm ? "No results found" : "No SDGs available"}
          </h3>
          <p className="text-gray-500 mt-2 max-w-md">
            {searchTerm
              ? "Try another search term"
              : "Start by uploading Sustainable Development Goal images"}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload First SDG
            </Button>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <SdgUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      
      {/* Edit Dialog */}
      <SdgEditDialog sdg={selectedSdg} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
}
