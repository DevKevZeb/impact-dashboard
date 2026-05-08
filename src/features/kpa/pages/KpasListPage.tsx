import { useEffect, useRef, useState } from "react";
import type { CreateKpaDto, Kpa } from "../types/KpaType";
import KpaTable from "../components/KpaTable";
import { useKpas } from "../hooks/useKpas";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useCreateKpa } from "../hooks/useCreateKpa";
import { useUpdateKpa } from "../hooks/useUpdateKpa";
import { useDeleteKpa } from "../hooks/useDeleteKpa";
import CreateKpaModal from "../components/CreateKpaModal";
import { DeleteKpaDialog } from "../components/DeleteKpaDialog";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";

export default function KpasListPage(){
  const canWrite = useHasScope("kpas:write");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const prevSearch = useRef(searchTerm);
  const prevPage = useRef(page);
  
  const searchChanged = prevSearch.current !== searchTerm;
  const pageChanged = prevPage.current !== page;
  
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isFetching, error } = useKpas(page, perPage, debouncedSearch);

  const showSkeleton = isFetching && (searchChanged || pageChanged);

  const {mutateAsync: createKpa } = useCreateKpa();
  const {mutateAsync: updateKpa} = useUpdateKpa();
  const [kpaToDelete, setKpaToDelete] = useState<Kpa | null>(null);
  const { mutateAsync: deleteKpaMutation, isPending: isDeletingKpa } = useDeleteKpa();

  const handleSubmit = async (formData: CreateKpaDto) => {
    if (selectedKpa) {
      await updateKpa({
        id: selectedKpa.id,
        dto: { name: formData.name },
      });
    }
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

  const handleDelete = (kpa: Kpa) => {
    setKpaToDelete(kpa);
  };

  const handleConfirmDelete = async () => {
    if (!kpaToDelete) return;
    await deleteKpaMutation(kpaToDelete.id);
    setKpaToDelete(null);
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
          <p className="text-gray-500">Loading KPAs...</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 font-medium">Error loading project states</p>
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
         <h1 className="page-title">KPAs</h1>   
          <p className="page-description">
            Manage the KPAs
          </p> 
       </div>
        {canWrite && (<Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
          <Plus className="w-5 h-5 mr-2"/>
          New KPA
        </Button>)}
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search by KPA name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
      </div>

    <CreateKpaModal open={openModal} kpa={selectedKpa} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

    <DeleteKpaDialog kpaName={kpaToDelete?.name ?? ""} open={!!kpaToDelete} onOpenChange={(open) => { if (!open) setKpaToDelete(null); }} onConfirm={handleConfirmDelete} isLoading={isDeletingKpa} />

    {showSkeleton ? <TableSkeleton columns={3} /> :
    data && data.kpas.length > 0 ? (
      <KpaTable kpas={data?.kpas} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} onEdit={handleEdit} onDelete={handleDelete} setPerPage={setPerPage} canWrite={canWrite} />
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