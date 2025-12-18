import { useState } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import CountryKpaTable from "../components/CountryKpaTable";
import { useCountries } from "@/features/country/hooks/country/useCountries";
import { useCreateCountryKpa } from "../hooks/useCreateCountryKpa";
import { useUpdateCountryKpa } from "../hooks/useUpdateCountryKpa";
import CreateCountryKpaModal from "../components/CreateCountryKpaModal";
import type { Kpa } from "@/features/kpa/types/KpaType";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";

export default function CountryKpaListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useCountries(page, perPage);

  const { mutateAsync: createCountryKpa } = useCreateCountryKpa();
  const { mutateAsync: updateCountryKpa } = useUpdateCountryKpa();

  const handleCreate = () => {
    setSelectedKpa(null);
    setSelectedCountryId(null);
    setOpenModal(true);
  };

  const handleEdit = () => {
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSubmit = async (dto: any) => {
    if (selectedCountryId) {
      await updateCountryKpa({ id: selectedCountryId, dto });
    } else {
      await createCountryKpa(dto);
      setPage(1);
    }
    setOpenModal(false);
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

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
       <div>
         <h1 className="page-title">Countries with KPAs</h1>   
          <p className="page-description">
            Manage the KPAs of the Countries 
          </p> 
       </div>
        <Button className="btn-secondary" size="lg" onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2"/>
          Assign KPA
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by country name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-default"
        />
      </div>

      {isLoading && <TableSkeleton columns={3} rows={10} />}
      {error && <p>Error loading countries</p>}

      { data && data.countries.length > 0 ? 
        <CountryKpaTable countries={data.countries} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} />
       : 
        <EmptyState icon={Tag} title={searchTerm ? "No country found" : "No countries available"}
          description={
            searchTerm
              ? "Try adjusting your search terms"
              : "Click 'Assign KPA' to create your first relation"
          }/>
      }

      <CreateCountryKpaModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} selectedKpa={selectedKpa} selectedCountryId={selectedCountryId} />
    </div>
  );
}
