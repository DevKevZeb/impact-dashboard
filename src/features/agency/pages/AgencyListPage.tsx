import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AgencyTable from "../components/AgencyTable";
import CreateAgencyModal from "../components/CreateAgencyModal";
import DeleteAgencyDialog from "../components/DeleteAgencyDialog";

import { useAgencies } from "../hooks/useAgencies";
import { useCreateAgency } from "../hooks/useCreateAgency";
import { useUpdateAgency } from "../hooks/useUpdateAgency";
import { useDeleteAgency } from "../hooks/useDeleteAgency";

import type { Agency, CreateAgencyDto } from "../types/agency.types";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { toast } from "sonner";

export default function AgencyListPage() {
  const queryClient = useQueryClient();
  const canWrite = useHasScope("agencies:write");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
   const [searchTerm, setSearchTerm] = useState('');

  const prevSearch = useRef(searchTerm);
  const prevPage = useRef(page);
  
  const searchChanged = prevSearch.current !== searchTerm;
  const pageChanged = prevPage.current !== page;
  
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isFetching, error } = useAgencies(page, perPage, debouncedSearch);
  
  const showSkeleton = isFetching && (searchChanged || pageChanged);

  const { mutateAsync: createAgency } = useCreateAgency();
  const { mutateAsync: updateAgency } = useUpdateAgency();
  const { mutateAsync: deleteAgency, isPending: isDeletingAgency } = useDeleteAgency();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const handleSubmit = async (formData: CreateAgencyDto) => {
    if (selectedAgency) await updateAgency({ id: selectedAgency.id, dto: formData });
    else {
      await createAgency(formData);
      setPage(1);
    }

    setOpenModal(false);
  };

  const handleOpenCreate = () => {
    setSelectedAgency(null);
    setOpenModal(true);
  };

  const handleEdit = (agency: Agency) => {
    setSelectedAgency(agency);
    setOpenModal(true);
  };

  const handleDelete = (agency: Agency) => {
    setSelectedAgency(agency);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAgency) return;

    try {
      const result = await deleteAgency(selectedAgency.id);
      toast.success(result?.message || "Agency deleted successfully");
      setOpenDeleteModal(false);
      setSelectedAgency(null);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 409) {
        toast.error(message || "Cannot delete agency because it is related to other records.");
        setOpenDeleteModal(false);
        return;
      }

      if (status === 404) {
        toast.info("The agency no longer exists. The list will be refreshed.");
        queryClient.invalidateQueries({ queryKey: ["agencies"] });
        setOpenDeleteModal(false);
        setSelectedAgency(null);
        return;
      }

      if (status === 403) {
        toast.error("You do not have permission to delete agencies.");
        return;
      }

      if (status === 401) {
        return;
      }

      toast.error(message || "Error deleting agency.");
    }
  };

  const handleApprove = async (agency: Agency) => {
    await updateAgency({
      id: agency.id,
      dto: { ...agency, isApproved: true },
    });
  };

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
          <p className="text-gray-500">Loading Implementing Agencies...</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 font-medium">Error loading agencies</p>
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
         <h1 className="page-title">Implementing Agencies</h1>   
          <p className="page-description">
            Manage the Implementing Agencies
          </p> 
       </div>
        {canWrite && (<Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
          <Plus className="w-5 h-5 mr-2"/>
          New Agency
        </Button>)}
      </div>
      
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search by agency name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
      </div>

      <CreateAgencyModal open={openModal} agency={selectedAgency} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

      {selectedAgency && (
        <DeleteAgencyDialog
          agency={selectedAgency}
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          onConfirm={handleConfirmDelete}
          isLoading={isDeletingAgency}
        />
      )}

      {showSkeleton && <TableSkeleton columns={4} />}
      {!showSkeleton && data && data.agencies.length > 0 && (
        <AgencyTable
          agencies={data?.agencies}
          pagination={data?.pagination}
          page={page}
          perPage={perPage}
          setPage={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          setPerPage={setPerPage}
          canWrite={canWrite}
        />
      )}

      {!showSkeleton && (!data || data.agencies.length === 0) && (
        <EmptyState
          icon={Tag}
          title={searchTerm ? "No implementing agencies found" : "No implementing agencies available"}
          description={
            searchTerm ? "Try adjusting your search terms" : "Click 'New Agency' to create your first implementing agency"
          }
        />
      )}
    </div>
  );
}
