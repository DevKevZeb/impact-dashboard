import { useState } from "react";
import AgencyTable from "../components/AgencyTable";
import CreateAgencyModal from "../components/CreateAgencyModal";

import { useAgencies } from "../hooks/useAgencies";
import { useCreateAgency } from "../hooks/useCreateAgency";
import { useUpdateAgency } from "../hooks/useUpdateAgency";

import type { Agency, CreateAgencyDto } from "../types/agency.types";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useHasScope } from "@/features/auth/hooks/useHasScope";

export default function AgencyListPage() {
  const canWrite = useHasScope("agencies:write");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error } = useAgencies(page, perPage);

  const { mutateAsync: createAgency } = useCreateAgency();
  const { mutateAsync: updateAgency } = useUpdateAgency();

  const [openModal, setOpenModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading Agencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
       <div>
         <h1 className="page-title">Agencies</h1>   
          <p className="page-description">
            Manage the Agencies
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
        <input
          type="text"
          placeholder="Search by agency name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-default"
        />
      </div>

      <CreateAgencyModal open={openModal} agency={selectedAgency} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

      {isLoading && <TableSkeleton columns={4} rows={10}/>}
      {error && <p>Error loading agencies</p>}

      {data && data.agencies.length > 0 ? (
        <AgencyTable agencies={data?.agencies} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)} onApprove={handleApprove} setPerPage={setPerPage} canWrite={canWrite}  />
      ):
      <EmptyState 
      icon={Tag} title={searchTerm ? "No agencies found" : "No agencies available"}
      description={
        searchTerm ? "Try adjusting your search terms" : "Click 'New Agency' to create your first Agency"
      }/>}
    </div>
  );
}
