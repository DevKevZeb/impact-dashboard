import type { KPATable } from "../types/kpas.type"
interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface CountryKpasTableProps{
    kpas: KPATable[],
    pagination: Pagination;
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export default function CountryKpasTable({kpas, pagination, page, perPage, setPage, setPerPage }: CountryKpasTableProps){
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setPage(1);
    };
    return(
        <div className="table-wrapper">
            <table className="table-default">
                <thead className="table-head">
                    <tr>
                        <th>#</th>
                        <th className="text-center!">KPAs</th>
                        <th className="text-center!">STRATEGIC OUTPUTS</th>
                        <th className="text-center!">MEASURES</th>
                        <th className="text-center!">INDICATORS</th>
                        <th className="text-center!">TARGETS</th>
                        <th className="text-center!">IMPLEMENTATION</th>
                    </tr>
                </thead>
                <tbody>
                    {kpas.map((kpa, index) => (
                        <tr key={kpa.id_kpa} className="table-row">
                            <td className="table-cell">{index + 1}</td>
                            <td className="table-cell font-medium">{kpa.name}</td>
                            <td className="table-cell text-center font-medium">{kpa.strategic_outputs_count}</td>
                            <td className="table-cell text-center font-medium">{kpa.measures_count}</td>
                            <td className="table-cell text-center font-medium">{kpa.indicators_count}</td>
                            <td className="table-cell text-center font-medium">{kpa.indicators_count}</td>
                            <td className="table-cell text-center font-medium">{kpa.implementation + "%"}</td>
                        </tr>
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
    )
}