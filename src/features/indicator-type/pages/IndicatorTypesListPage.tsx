import { useState } from "react"
import CreateIndicatorTypeModal from "../components/CreateIndicatorTypeModal";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { useCreateIndicatorType } from "../hooks/useCreateIndicatorType";
import { useUpdateIndicatorType } from "../hooks/useUpdateIndicatorType";
import { useIndicatorTypes } from "../hooks/useIndicatorTypes";
import TableSkeleton from "@/components/ui/TableSkeleton";
import IndicatorTapeTable from "../components/IndicatorTypeTable";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";

export default function IndicatorTypesListPage(){

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedType, setSelectedType] = useState<IndicatorType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, error } = useIndicatorTypes(page, perPage);

    const { mutateAsync: createIndicatorType } = useCreateIndicatorType();
    const { mutateAsync: updateIndicatorType } = useUpdateIndicatorType();

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

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-gray-500">Loading Indicator Types...</p>
        </div>
      </div>
    );
  }

    return(
        <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Indicator Types</h1>   
                    <p className="page-description">
                        Manage the Indicator Types
                    </p> 
                </div>
                    <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
                    <Plus className="w-5 h-5 mr-2"/>
                    New Indicator Type
                    </Button>
                </div>
                
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search by indicator type name..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-default"
                    />
                </div>

            <CreateIndicatorTypeModal open={openModal} type={selectedType} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />    
            
            {isLoading && <TableSkeleton columns={2} rows={1}/>}
            {error && <p>Error loading agencies</p>}
            {data && data.types.length>0 ? (
                <IndicatorTapeTable types={data?.types} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)}/>
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
        </div>
    )
}