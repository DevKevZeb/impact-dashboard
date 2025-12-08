import { useState } from "react";
import { useCountries } from "../hooks/country/useCountries";
import { useCreateCountry } from "../hooks/country/useCreateCountry.ts";

import TableSkeleton from "@/components/ui/TableSkeleton";
import CountryTable from "../components/CountryTable";
import CreateCountryModal from "../components/CreateCountryModal";
import { useCurrencies } from "../hooks/currency/useCurrency.ts";

import type { Country } from "../types/CountryType.tsx";
import { useUpdateCountry } from "../hooks/country/useUpdateCountry.ts";

export default function CountryListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const { data, isLoading, error } = useCountries(page, perPage);

  const { data: currencies, isLoading: loadingCurrencies, error: errorCurrencies } = useCurrencies();


  const { mutateAsync: createCountry } = useCreateCountry();
  const { mutateAsync: updateCountry} = useUpdateCountry();

  const handleCreate = () => {
    setEditingCountry(null);
    setOpenModal(true);
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setOpenModal(true);
  }

  const handleSubmit  = async (dto: any) => {
    if(editingCountry) await updateCountry( { id: editingCountry.id, dto: dto} );
    else{
      await createCountry(dto);
      setPage(1);
    }

    setOpenModal(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="label-default">Countries</h1>    
        <button className="btn-secondary" onClick={handleCreate}>
          + CREATE
        </button>
      </div>

      {isLoading && <TableSkeleton columns={3} rows={10} />}
      {error && <p>Error loading countries</p>}

      {data && (
        <CountryTable countries={data?.countries} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(country) => console.log("DELETE", country)} />
      )}

      <CreateCountryModal open={openModal} country={editingCountry} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} currencies={currencies?.currencies ?? []} />
    </div>
  );
}
