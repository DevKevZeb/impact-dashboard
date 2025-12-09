import { useState } from "react";
import type { CreateKpaDto, Kpa } from "../types/KpaType";
import KpaTable from "../components/KpaTable";
import { useKpas } from "../hooks/useKpas";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useCreateKpa } from "../hooks/useCreateKpa";
import { useUpdateKpa } from "../hooks/useUpdateKpa";
import CreateKpaModal from "../components/CreateKpaModal";

export default function KpasListPage(){
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);

  const { data, isLoading, error } = useKpas(page, perPage);

  const {mutateAsync: createKpa } = useCreateKpa();
  const {mutateAsync: updateKpa} = useUpdateKpa();

  const handleSubmit = async (formData: CreateKpaDto) => {
    if(selectedKpa) await updateKpa({ id: selectedKpa.id, dto:formData});
    else{
      await createKpa(formData);
      setPage(1);
    }
    setOpenModal(false);  
  }

  const handleOpenCreate = () => {
      setSelectedKpa(null);        
      setOpenModal(true);
  };

  const handleEdit = (kpa: Kpa) => {
    setSelectedKpa(kpa);
    setOpenModal(true);
  };

  return(
  <div className="p-6 space-y-4">
      <div className="flex flex-col justify-between">
      <h1 className="label-default">KPAs</h1>
      <div className="flex py-6 space-x-3">
        <input
          type="text"
          placeholder="Search by name..."
          //value={search}
          //onChange={handleSearchChange}
          className="input-default w-auto"
        />
        <button onClick={handleOpenCreate} className="btn-secondary">CREATE</button>
      </div>
    </div>

    <CreateKpaModal open={openModal} kpa={selectedKpa} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

    {isLoading && <TableSkeleton columns={3} rows={10}/>}
    {error && <p>Error loading agencies</p>}
    {data && (
      <KpaTable kpas={data?.kpas} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)} setPerPage={setPerPage} />
    )}
  </div>
);
}