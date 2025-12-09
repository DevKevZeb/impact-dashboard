import { useState } from "react";
import AgencyTable from "../components/AgencyTable";
import CreateAgencyModal from "../components/CreateAgencyModal";

import { useAgencies } from "../hooks/useAgencies";
import { useCreateAgency } from "../hooks/useCreateAgency";
import { useUpdateAgency } from "../hooks/useUpdateAgency";

import type { Agency, CreateAgencyDto } from "../types/agency.types";
import TableSkeleton from "@/components/ui/TableSkeleton";

export default function AgencyListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error } = useAgencies(page, perPage);

  const { mutateAsync: createAgency } = useCreateAgency();
  const { mutateAsync: updateAgency } = useUpdateAgency();

  const [openModal, setOpenModal] = useState(false);
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

  const handleApprove = async (agency: Agency) => {
    await updateAgency({
      id: agency.id,
      dto: { ...agency, isApproved: true },
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col justify-between">
        <h1 className="label-default">Agencies</h1>
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


      <CreateAgencyModal open={openModal} agency={selectedAgency} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />


      {isLoading && <TableSkeleton columns={4} rows={10}/>}
      {error && <p>Error loading agencies</p>}

      {data && (
        <AgencyTable agencies={data?.agencies} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} onEdit={handleEdit} onDelete={(agency) => console.log("DELETE", agency)} onApprove={handleApprove} setPerPage={setPerPage} />
      )}
    </div>
  );
}
