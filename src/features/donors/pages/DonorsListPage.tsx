import { Loader2, Plus, Search, Tag } from "lucide-react";
import { useDonors } from "../hooks/useDonors";
import { useCreateDonor } from "../hooks/useCreateDonor";
import { useUpdateDonor } from "../hooks/useUpdateDonor";
import { useState } from "react";
import type { Donor, DonorDTO } from "../types/donor.types";
import { Button } from "@/components/ui/button";
import CreateDonorModal from "../components/CreateDonorModal";
import DonorTable from "../components/DonorTable";
import { EmptyState } from "@/shared/components/EmptyState";

export default function DonorsListPage() {
    
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const { data, isLoading, error } = useDonors(page, perPage);

    const { mutateAsync: createDonor } = useCreateDonor();
    const { mutateAsync: updateDonor } = useUpdateDonor();

    const [openModal, setOpenModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (formData: DonorDTO) => {
        if(selectedDonor) await updateDonor({ id: selectedDonor.id, dto: formData});
        else {
            await createDonor(formData);
            setPage(1);
        }
        setOpenModal(false);
    }

    const handleOpenCreate = () => {
        setSelectedDonor(null);
        setOpenModal(true);
    }

    const handleEdit = async (donor: Donor) => {
        setSelectedDonor(donor);
        setOpenModal(true);
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    }

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
          <p className="text-red-600 font-medium">Error loading programs</p>
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
            <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
               <Plus className="w-5 h-5 mr-2"/>
                New Donor 
            </Button>
        </div>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name ..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-default"
          />
        </div>
        <CreateDonorModal open={openModal} donor={selectedDonor} onClose={()=> setOpenModal(false)} onSubmit={handleSubmit}/>
        {data && data.donors.length > 0 ?
        <DonorTable donors={data.donors} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(donor) => console.log("DELETE", donor)}/>
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