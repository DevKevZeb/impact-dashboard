import { useEffect, useRef, useState } from "react";
import { useCountries } from "../hooks/country/useCountries";
import { useCreateCountry } from "../hooks/country/useCreateCountry.ts";

import TableSkeleton from "@/components/ui/TableSkeleton";
import CountryTable from "../components/CountryTable";
import CreateCountryModal from "../components/CreateCountryModal";
import { useCurrencies } from "../hooks/currency/useCurrency.ts";

import type { Country } from "../types/CountryType.tsx";
import { useUpdateCountry } from "../hooks/country/useUpdateCountry.ts";
import { Loader2, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { EmptyState } from "@/shared/components/EmptyState.tsx";
import { useHasScope } from "@/features/auth/hooks/useHasScope.ts";
import { useDebounce } from "@/shared/hooks/useDebounce.ts";

export default function CountryListPage() {
  const canWrite = useHasScope("countries:write");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const prevSearch = useRef(searchTerm);
  const prevPage = useRef(page);
  
  const searchChanged = prevSearch.current !== searchTerm;
  const pageChanged = prevPage.current !== page;

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isFetching, error } = useCountries(page, perPage, debouncedSearch);

  const showSkeleton = isFetching && (searchChanged || pageChanged);

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  useEffect(() => {
      prevSearch.current = searchTerm;
      prevPage.current = page;
  }, [searchTerm, page]);

  if (isLoading || loadingCurrencies) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading Countries...</p>
        </div>
      </div>
    );
  }

  if (error || errorCurrencies) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-600 font-medium">Error loading countries</p>
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
         <h1 className="page-title">Countries</h1>   
          <p className="page-description">
            Manage the Countries
          </p> 
       </div>
        {canWrite && (<Button className="btn-secondary" size="lg" onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2"/>
          New Country
        </Button>)}
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search by country name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
      </div>

      {showSkeleton ? <TableSkeleton columns={3}  /> : 
      data && data.countries.length > 0 ? (
        <CountryTable countries={data?.countries} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(country) => console.log("DELETE", country)} canWrite={canWrite} />
      ): (
        <EmptyState
          icon={Tag}
          title={searchTerm ? "No Country found" : "No Country available"}
          description={
            searchTerm
              ? "Try adjusting your search terms"
              : "Click 'New Country' to create your first Country"
          }
        />
      )}

      <CreateCountryModal open={openModal} country={editingCountry} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} currencies={currencies?.currencies ?? []} />
    </div>
  );
}
