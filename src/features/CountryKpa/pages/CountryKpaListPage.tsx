import { useState } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import CountryKpaTable from "../components/CountryKpaTable";
import { useCountries } from "@/features/country/hooks/country/useCountries";
import { useCreateCountryKpa } from "../hooks/useCreateCountryKpa";
import { useUpdateCountryKpa } from "../hooks/useUpdateCountryKpa";
import CreateCountryKpaModal from "../components/CreateCountryKpaModal";
import type { Kpa } from "@/features/kpa/types/KpaType";

export default function CountryKpaListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  const { data, isLoading, error } = useCountries(page, perPage);

  const { mutateAsync: createCountryKpa } = useCreateCountryKpa();
  const { mutateAsync: updateCountryKpa } = useUpdateCountryKpa();

  const handleCreate = () => {
    setSelectedKpa(null);
    setSelectedCountryId(null);
    setOpenModal(true);
  };

  const handleEdit = (kpa: Kpa, relationId: number) => {
    setSelectedKpa(kpa);
    setSelectedCountryId(relationId);
    setOpenModal(true);
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

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="label-default">Countries with KPAs</h1>
        <button className="btn-secondary" onClick={handleCreate}>
          + ASSIGN KPA
        </button>
      </div>

      {isLoading && <TableSkeleton columns={3} rows={10} />}
      {error && <p>Error loading countries</p>}

      {data && (
        <CountryKpaTable countries={data.countries} pagination={data.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} />
      )}

      <CreateCountryKpaModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} selectedKpa={selectedKpa} selectedCountryId={selectedCountryId} />
    </div>
  );
}
