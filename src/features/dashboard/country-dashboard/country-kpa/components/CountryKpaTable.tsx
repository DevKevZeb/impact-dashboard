import { useState } from "react";
import { Info, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Country } from "@/features/country/types/CountryType";
import type { Kpa } from "@/features/kpa/types/KpaType";
import { useCountryKpas } from "../hooks/useCountryKpas";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  countries: Country[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  onEdit: (kpa: Kpa, relationId: number) => void;
}

export default function CountryKpaTable({ countries, pagination, page, perPage, setPage, setPerPage, onEdit }: Props) {
  const [expanded, setExpanded] = useState<number[]>([]);  
  const navigate = useNavigate();

  const toggleExpand = (countryId: number) => {
    if (expanded.includes(countryId)) {
      setExpanded(prev => prev.filter(id => id !== countryId));
    } else {
      setExpanded(prev => [...prev, countryId]);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="table-wrapper">
      <table className="table-default">
        <thead className="table-head">
          <tr>
            <th>#</th>
            <th>COUNTRY</th>
            <th className="text-center!">KPAs</th>
            <th className="text-center!">STRATEGIC OUTPUTS</th>
            <th className="text-center!">MEASURES</th>
            <th className="text-center!">INDICATORS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <Fragment key={country.id}>
              <tr className="table-row cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(country.id)} >
                <td className="table-cell">{index + 1}</td>
                <td className="table-cell font-medium">
                  {country.name}
                </td>
                <td className="table-cell text-center font-medium">
                  {country.kpas_count}
                </td>
                <td className="table-cell text-center font-medium">
                  {country.strategic_outputs_count}
                </td>
                <td className="table-cell text-center font-medium">
                  {country.measures_count}
                </td>
                <td className="table-cell text-center font-medium">
                  {country.indicators_count}
                </td>
                <td className="table-cell text-left">
                  {(country.kpas_count ?? 0) > 0 && 
                  <button title="More info" className="btn-warning-table" onClick={(e) => { e.stopPropagation(); navigate(`/app/country-kpa/${country.id}`, { state: {country}}); }} >
                    <Info className="w-4 h-4" />
                  </button>}
                </td>
              </tr>

              {expanded.includes(country.id) && (
                <tr className="bg-gray-50/50">
                  <td colSpan={7}>
                    <SubKpaTable countryId={country.id} onEdit={onEdit} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}

          <tr className="table-pagination-row">
            <td colSpan={7} className="table-pagination-cell">
              <div className="table-pagination-container">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Rows per page:</span>
                  <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange} >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="table-pagination-actions">
                  <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1} >
                    ← Prev
                  </button>

                  <span className="text-gray-600 text-xs">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button className="table-pagination-btn" onClick={() => setPage(page + 1)} disabled={page === pagination.last_page} >
                    Next →
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import { Fragment } from "react";

function SubKpaTable({ countryId }: { countryId: number; onEdit: (kpa: Kpa, relationId: number) => void; }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
    
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const { data, isLoading } = useCountryKpas(countryId, page, perPage, true);
  const kpas = !Array.isArray(data) && data?.kpas ? data.kpas : [];

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Loading KPAs...
      </div>
    );
  }

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-center" colSpan={5}>ASSIGNED KPAs</th>         
        </tr>
        <tr className="bg-gray-100">
          <th></th>
          <th className="px-4 py-2 text-left">No.</th>
          <th className="px-4 py-2 text-left">KPA</th>
          <th className="px-4 py-2 text-left">IMPLEMENTATION</th>
          <th className="px-4 py-2 text-left">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {kpas?.map((kpa, index) => (
          <tr key={kpa.id_kpa} className="border-t">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{kpa.name}</td>
            <td className="px-4 py-2">{kpa.implementation}%</td>
            <td className="table-cell text-left">
              <button title="Edit" className="btn-delete-table">
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}

        {kpas != undefined && kpas.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
              No KPAs assigned
            </td>
          </tr>
        )}

        <tr className="table-pagination-row">
            <td colSpan={7} className="table-pagination-cell">
              <div className="table-pagination-container">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Rows per page:</span>
                  <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange} >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                 {!Array.isArray(data) && (
                <div className="table-pagination-actions">
                  <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1} >
                    ← Prev
                  </button>
                    <span className="text-gray-600 text-xs">
                      Page {data?.pagination?.current_page} of {data?.pagination?.last_page}
                    </span>
                  <button className="table-pagination-btn" onClick={() => setPage(page + 1)} disabled={page === data?.pagination.last_page} >
                    Next →
                  </button>
                </div>
                  )}
              </div>
            </td>
          </tr>
      </tbody>
    </table>
  );
}
