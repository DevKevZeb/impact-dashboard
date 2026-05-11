import { Loader2, Plus, Search, Tag } from "lucide-react";
import { useDonors } from "../hooks/useDonors";
import { useCreateDonor } from "../hooks/useCreateDonor";
import { useUpdateDonor } from "../hooks/useUpdateDonor";
import { useEffect, useRef, useState } from "react";
import type { Donor, DonorDTO } from "../types/donor.types";
import { Button } from "@/components/ui/button";
import CreateDonorModal from "../components/CreateDonorModal";
import DonorTable from "../components/DonorTable";
import DeleteDonorDialog from "../components/DeleteDonorDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useDeleteDonor } from "../hooks/useDeleteDonor";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DonorsListPage() {
  const queryClient = useQueryClient();
    const canCreate = useHasScope("donors:create");
    const canEdit = useHasScope("donors:update");
    const canDelete = useHasScope("donors:delete");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const prevSearch = useRef(searchTerm);
    const prevPage = useRef(page);
    
    const searchChanged = prevSearch.current !== searchTerm;
    const pageChanged = prevPage.current !== page;

    const debouncedSearch = useDebounce(searchTerm, 400);

    const { data, isLoading, isFetching, error } = useDonors(page, perPage, debouncedSearch);

    const showSkeleton = isFetching && (searchChanged || pageChanged);

    const { mutateAsync: createDonor } = useCreateDonor();
    const { mutateAsync: updateDonor } = useUpdateDonor();
    const { mutateAsync: deleteDonor, isPending: isDeletingDonor } = useDeleteDonor();

    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    
    const handleSubmit = async (formData: DonorDTO) => {
        if(selectedDonor) await updateDonor({ id: selectedDonor.id, dto: formData});
        else {
            await createDonor(formData);
            setPage(1);
        }
        setOpenModal(false);
    }

    const handleOpenCreate = () => {
        if (!canCreate) return;
        setSelectedDonor(null);
        setOpenModal(true);
    }

    const handleEdit = async (donor: Donor) => {
        if (!canEdit) return;
        setSelectedDonor(donor);
        setOpenModal(true);
    }

    const handleDelete = (donor: Donor) => {
      if (!canDelete) return;
      setSelectedDonor(donor);
      setOpenDeleteModal(true);
    }

    const handleConfirmDelete = async () => {
      if (!selectedDonor) return;

      try {
        const result = await deleteDonor(selectedDonor.id);
        toast.success(result?.message || "Donor eliminado correctamente");
        setOpenDeleteModal(false);
        setSelectedDonor(null);
      } catch (error: any) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        if (status === 409) {
          toast.error(
            message ||
              "No se puede eliminar porque el donor esta relacionado a uno o mas proyectos."
          );
          setOpenDeleteModal(false);
          return;
        }

        if (status === 404) {
          toast.info("El donor ya no existe. Se actualizara la lista.");
          queryClient.invalidateQueries({ queryKey: ["donors"] });
          setOpenDeleteModal(false);
          setSelectedDonor(null);
          return;
        }

        if (status === 403) {
          toast.error("No tienes permisos para eliminar donors.");
          return;
        }

        if (status === 401) {
          return;
        }

        toast.error(message || "Error al eliminar el donor.");
      }
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    }

    useEffect(() => {
        prevSearch.current = searchTerm;
        prevPage.current = page;
    }, [searchTerm, page]);

    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading Donors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading donors</p>
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
                <h1 className="page-title">Donors</h1>
                <p className="page-description">
                        Manage all donors
                </p>
            </div>
            {canCreate &&
            <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
               <Plus className="w-5 h-5 mr-2"/>
                New Donor 
            </Button>
            }
        </div>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by name ..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
        </div>
        
        <CreateDonorModal open={openModal} donor={selectedDonor} onClose={()=> setOpenModal(false)} onSubmit={handleSubmit}/>

        {selectedDonor && (
          <DeleteDonorDialog
            donor={selectedDonor}
            open={openDeleteModal}
            onOpenChange={setOpenDeleteModal}
            onConfirm={handleConfirmDelete}
            isLoading={isDeletingDonor}
          />
        )}
        
        {showSkeleton ? <TableSkeleton columns={2}/> :
        data && data.donors.length > 0 ?
        <DonorTable donors={data.donors} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={handleDelete} canEdit={canEdit} canDelete={canDelete}/>
        :
        <EmptyState
          icon={Tag} title={searchTerm ? "No donor found" : "No donors available"}
          description={
              searchTerm
              ? "Try adjusting your search terms"
              : "Click 'New Donor' to create your first donor"
        }/>
        }
    </div>
    );
}