import type { AxiosError } from "axios";
import { useState } from "react";
import { useDidChange } from "@/shared/hooks/useDidChange";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import { useCreateBeneficiary } from "../hooks/useCreateBeneficiary";
import { useDeleteBeneficiary } from "../hooks/useDeleteBeneficiary";
import { useUpdateBeneficiary } from "../hooks/useUpdateBeneficiary";
import type { Beneficiary, BeneficiaryDTO } from "../types/beneficiaries.types";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateBeneficiaryModal from "../components/CreateBeneficiaryModal";
import DeleteBeneficiaryDialog from "../components/DeleteBeneficiaryDialog";
import BeneficiariesTable from "../components/BeneficiariesTable";
import { EmptyState } from "@/shared/components/EmptyState";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function BeneficiariesListPage(){
    const queryClient = useQueryClient();
    const canWrite = useHasScope("beneficiaries:write");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const searchChanged = useDidChange(searchTerm);
    const pageChanged = useDidChange(page);

    const debouncedSearch = useDebounce(searchTerm, 400);

    const { data, isLoading, isFetching, error } = useBeneficiaries(page, perPage, debouncedSearch);

    const showSkeleton = isFetching && (searchChanged || pageChanged);

    const { mutateAsync: createBeneficiary} = useCreateBeneficiary();
    const { mutateAsync: updateBeneficiary } = useUpdateBeneficiary();
    const { mutateAsync: deleteBeneficiary, isPending: isDeletingBeneficiary } = useDeleteBeneficiary();

    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

    const  handleSubmit = async (formData: BeneficiaryDTO) => {
        if(selectedBeneficiary) await updateBeneficiary({ id: selectedBeneficiary.id, dto: formData});
        else {
            await createBeneficiary(formData);
            setPage(1);
        }
        setOpenModal(false);
    }

    const handleOpenCreate = () => {
        setSelectedBeneficiary(null);
        setOpenModal(true);
    }

    const handleEdit = async (beneficiary: Beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setOpenModal(true);
    }

    const handleDelete = (beneficiary: Beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setOpenDeleteModal(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedBeneficiary) return;

        try {
            const result = await deleteBeneficiary(selectedBeneficiary.id);
            toast.success(result?.message || "Beneficiary deleted successfully");
            setOpenDeleteModal(false);
            setSelectedBeneficiary(null);
        } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
            const status = axiosError?.response?.status;
            const message = axiosError?.response?.data?.message;

            if (status === 409) {
                toast.error(message || "Cannot delete beneficiary because it is related to other records.");
                setOpenDeleteModal(false);
                return;
            }

            if (status === 404) {
                toast.info("The beneficiary no longer exists. The list will be refreshed.");
                queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
                setOpenDeleteModal(false);
                setSelectedBeneficiary(null);
                return;
            }

            if (status === 403) {
                toast.error("You do not have permission to delete beneficiaries.");
                return;
            }

            if (status === 401) {
                return;
            }

            toast.error(message || "Error deleting beneficiary.");
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    }
    
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
            <Loader2 className="loader-default" />
            <p className="text-gray-500">Loading Beneficiaries...</p>
            </div>
        </div>
    );

    if (error) return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading beneficiaries</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );

    return (
        <div className="page-container">
            <div className="title-container">
                <div>
                    <h1 className="page-title">Beneficiaries</h1>   
                    <p className="page-description">
                        Manage the Beneficiaries
                    </p> 
                </div>
                { canWrite && (
                    <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
                        <Plus className="w-5 h-5 mr-2"/>
                        Create Beneficiary
                    </Button>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            <CreateBeneficiaryModal beneficiary={selectedBeneficiary} open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

            {selectedBeneficiary && (
                <DeleteBeneficiaryDialog
                    beneficiary={selectedBeneficiary}
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    onConfirm={handleConfirmDelete}
                    isLoading={isDeletingBeneficiary}
                />
            )}
            
            {showSkeleton ? <TableSkeleton columns={2}/> :
            data && data?.beneficiaries.length > 0 ? (
                <BeneficiariesTable beneficiaries={data?.beneficiaries} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={handleDelete} canWrite={canWrite}/>
            ) : (
                <EmptyState
                    icon={Tag}
                    title={searchTerm ? "No beneficiaries found" : "No beneficiaries available"}
                    description={searchTerm ? "Try adjusting your search criteria." : "Start by creating a new beneficiary."}
                />
            )}
        </div>
    )
}
