import { useState } from "react";
import type { CreateKpaDto, Kpa } from "../types/KpaType";
import KpaTable from "../components/KpaTable";
import { useKpas } from "../hooks/useKpas";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useCreateKpa } from "../hooks/useCreateKpa";
import { useUpdateKpa } from "../hooks/useUpdateKpa";
import CreateKpaModal from "../components/CreateKpaModal";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";

export default function KpasListPage(){
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading KPAs...</p>
        </div>
      </div>
    );
  }

  return(
  <div className="p-6 space-y-4">

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
       <div>
         <h1 className="page-title">KPAs</h1>   
          <p className="page-description">
            Manage the KPAs
          </p> 
       </div>
        <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
          <Plus className="w-5 h-5 mr-2"/>
          New KPA
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by KPA name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-default"
        />
      </div>

    <CreateKpaModal open={openModal} kpa={selectedKpa} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

    {isLoading && <TableSkeleton columns={3} rows={10}/>}
    {error && <p>Error loading agencies</p>}
    {data && data.kpas.length > 0 ? (
      <KpaTable kpas={data?.kpas} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)} setPerPage={setPerPage} />
    ): (
        <EmptyState
          icon={Tag}
          title={searchTerm ? "No KPAs found" : "No KPAs available"}
          description={
            searchTerm
              ? "Try adjusting your search terms"
              : "Click 'New KPA' to create your first KPA "
          }
        />
    )}
  </div>
);
}