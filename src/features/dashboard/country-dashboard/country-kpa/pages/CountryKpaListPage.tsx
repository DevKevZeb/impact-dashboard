import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "@/components/ui/TableSkeleton";
import CountryKpaTable from "../components/CountryKpaTable";
import { useCountries } from "@/features/country/hooks/country/useCountries";
import { useSharedCountriesForAdmin } from "../hooks/useSharedCountriesForAdmin";
import { useCreateCountryKpa } from "../hooks/useCreateCountryKpa";
import { useUpdateCountryKpa } from "../hooks/useUpdateCountryKpa";
import CreateCountryKpaModal from "../components/CreateCountryKpaModal";
import type { Kpa } from "@/features/kpa/types/KpaType";
import { Loader2, Plus, Search, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function CountryKpaListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Verify if user is admin
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin') ?? false;
  
  // Redirect non-admin users to their country dashboard
  useEffect(() => {
    if (!isAdmin) {
      if (user?.country_user_role?.country?.id) {
        navigate(`/app/country-kpa/${user.country_user_role.country.id}`);
      } else {
        navigate('/app');
      }
    }
  }, [isAdmin, user, navigate]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const prevSearch = useRef(searchTerm);
  const prevPage = useRef(page);
  
  const searchChanged = prevSearch.current !== searchTerm;
  const pageChanged = prevPage.current !== page;

  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedKpa, setSelectedKpa] = useState<Kpa | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  // Admins only see countries that country-managers have shared with them
  const { data: allCountriesData, isLoading, isFetching, error } = useCountries(page, perPage, debouncedSearch);
  const { data: sharedCountriesData } = useSharedCountriesForAdmin(1, 200, debouncedSearch);

  const sharedCountryIds = new Set((sharedCountriesData?.countries ?? []).map((country) => country.id));
  const data = allCountriesData
    ? {
        countries: allCountriesData.countries.filter((country) => sharedCountryIds.has(country.id)),
        pagination: allCountriesData.pagination,
      }
    : undefined;

  const showSkeleton = isFetching && (searchChanged || pageChanged);

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

  useEffect(() => {
      prevSearch.current = searchTerm;
      prevPage.current = page;
  }, [searchTerm, page]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-600 font-medium">Access Denied</p>
          <p className="text-sm text-gray-600">Only administrators can access this page</p>
        </div>
      </div>
    );
  }

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
              <p className="text-red-600 font-medium">Error loading KPAs</p>
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
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search by country name..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
      </div>

      {showSkeleton ? <TableSkeleton columns={3} rows={10} /> :
      data && data.countries.length > 0 ? 
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
