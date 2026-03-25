import { useEffect, useRef, useState } from "react"
import CreateIndicatorTypeModal from "../components/CreateIndicatorTypeModal";
import { DeleteIndicatorTypeDialog } from "../components/DeleteIndicatorTypeDialog";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { useCreateIndicatorType } from "../hooks/useCreateIndicatorType";
import { useUpdateIndicatorType } from "../hooks/useUpdateIndicatorType";
import { useDeleteIndicatorType } from "../hooks/useDeleteIndicatorType";
import { useIndicatorTypes } from "../hooks/useIndicatorTypes";
import TableSkeleton from "@/components/ui/TableSkeleton";
import IndicatorTypeTable from "../components/IndicatorTypeTable";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";

export default function IndicatorTypesListPage(){
    const canWrite = useHasScope("indicators:write");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedType, setSelectedType] = useState<IndicatorType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const prevSearch = useRef(searchTerm);
    const prevPage = useRef(page);
    
    const searchChanged = prevSearch.current !== searchTerm;
    const pageChanged = prevPage.current !== page;

    const debouncedSearch = useDebounce(searchTerm, 400);

    const { data, isLoading, isFetching, error } = useIndicatorTypes(page, perPage, debouncedSearch);

    const showSkeleton = isFetching && (searchChanged || pageChanged);

    const [typeToDelete, setTypeToDelete] = useState<IndicatorType | null>(null);

    const { mutateAsync: createIndicatorType } = useCreateIndicatorType();
    const { mutateAsync: updateIndicatorType } = useUpdateIndicatorType();
    const { mutateAsync: deleteIndicatorType, isPending: isDeletingType } = useDeleteIndicatorType();

    const handleSubmit = async (formData: IndicatorTypeDTO) => {
        if(selectedType) await updateIndicatorType( { id: selectedType.id, dto: formData } );
        else {
            await createIndicatorType(formData);
            setPage(1);
        }
        setOpenModal(false);
    }

    const handleOpenCreate = () => {
        setSelectedType(null);
        setOpenModal(true);
    }

    const handleEdit = (type: IndicatorType) => {
        setSelectedType(type);
        setOpenModal(true);
    }

    const handleDelete = (type: IndicatorType) => {
        setTypeToDelete(type);
    };

    const handleConfirmDelete = async () => {
        if (!typeToDelete) return;
        await deleteIndicatorType(typeToDelete.id);
        setTypeToDelete(null);
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
            <p className="text-gray-500">Loading Indicator Types...</p>
            </div>
        </div>
        );
    }
    
    if (error) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-600 font-medium">Error loading indicator types</p>
                <p className="text-sm text-gray-600">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
            </div>
        </div>
        );
    }

    return(
        <div className="page-container">
            <div className="title-container">
                <div>
                    <h1 className="page-title">Indicator Types</h1>   
                    <p className="page-description">
                        Manage the Indicator Types
                    </p> 
                </div>
                {canWrite && (<Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
                    <Plus className="w-5 h-5 mr-2"/>
                    New Indicator Type
                </Button>)}
            </div>
                
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by indicator type name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
            </div>

            <CreateIndicatorTypeModal open={openModal} type={selectedType} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />    
            
            {showSkeleton ? <TableSkeleton columns={2}/> :
            data && data.types.length>0 ? (
                <IndicatorTypeTable types={data?.types} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={handleDelete} canWrite={canWrite}/>
            ) : (
                <EmptyState
                    icon={Tag}
                    title={searchTerm ? "No Indicator Types found" : "No Indicator Types available"}
                    description={
                        searchTerm
                        ? "Try adjusting your search terms"
                        : "Click 'New Indicator Type' to create your first indicator Type"
                    }
                />
            )}
            <DeleteIndicatorTypeDialog
                typeName={typeToDelete?.name ?? ""}
                open={!!typeToDelete}
                onOpenChange={(open) => { if (!open) setTypeToDelete(null); }}
                onConfirm={handleConfirmDelete}
                isLoading={isDeletingType}
            />
        </div>
    )
}