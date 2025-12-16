import { useState } from "react"
import CreateIndicatorTypeModal from "../components/CreateIndicatorTypeModal";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { useCreateIndicatorType } from "../hooks/useCreateIndicatorType";
import { useUpdateIndicatorType } from "../hooks/useUpdateIndicatorType";
import { useIndicatorTypes } from "../hooks/useIndicatorTypes";
import TableSkeleton from "@/components/ui/TableSkeleton";
import IndicatorTapeTable from "../components/IndicatorTypeTable";

export default function IndicatorTypesListPage(){

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedType, setSelectedType] = useState<IndicatorType | null>(null);

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

    return(
        <div className="p-6 space-y-4">
            <div className="flex flex-col justify-between">
                <h1 className="label-default">Indicator Types</h1>
                <div className="flex py-6 space-x-3">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        //value={search}
                        //onChange={handleSearchChange}
                        className="input-default w-auto"/>
                    <button onClick={handleOpenCreate} className="btn-secondary">CREATE</button>
                </div>
            </div>

            <CreateIndicatorTypeModal open={openModal} type={selectedType} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />    
            
            {isLoading && <TableSkeleton columns={2} rows={1}/>}
            {error && <p>Error loading agencies</p>}
            {data && (
                <IndicatorTapeTable types={data?.types} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)}/>
            )}
        </div>
    )
}