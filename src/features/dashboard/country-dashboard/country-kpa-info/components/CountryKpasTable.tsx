import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { KPATable } from "../types/kpas.type";
import { getStrategicOutputsByCountryKpaId } from "@/features/strategic-output/services/strategic-output.api";
import { getMeasuresByStrategicOutputId } from "@/features/measures/services/measure.api";
import { getIndicatorsByMeasureId } from "@/features/indicator/services/indicator.api";

const formatHierarchyNumber = (...parts: number[]) => parts.join(".");
const formatHierarchyLabel = (number: string, label: string) => `${number}. ${label}`;

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
    const [expandedKpas, setExpandedKpas] = useState<Record<number, boolean>>({});
    const [expandedSos, setExpandedSos] = useState<Record<number, boolean>>({});
    const [expandedMeasures, setExpandedMeasures] = useState<Record<number, boolean>>({});

    const [loadingKpaIds, setLoadingKpaIds] = useState<Record<number, boolean>>({});
    const [loadingSoIds, setLoadingSoIds] = useState<Record<number, boolean>>({});
    const [loadingMeasureIds, setLoadingMeasureIds] = useState<Record<number, boolean>>({});

    const [soByKpa, setSoByKpa] = useState<Record<number, any[]>>({});
    const [measuresBySo, setMeasuresBySo] = useState<Record<number, any[]>>({});
    const [indicatorsByMeasure, setIndicatorsByMeasure] = useState<Record<number, any[]>>({});

    const toggleKpa = async (kpa: KPATable) => {
        const id = kpa.id_ck ?? kpa.id_kpa;
        const currently = !!expandedKpas[id];
        setExpandedKpas((s) => ({ ...s, [id]: !currently }));

        if (!currently && !soByKpa[id] && kpa.strategic_outputs_count > 0) {
            setLoadingKpaIds((s) => ({ ...s, [id]: true }));
            try {
                const res = await getStrategicOutputsByCountryKpaId(id, 1, 100);
                setSoByKpa((s) => ({ ...s, [id]: res.strategic_outputs || [] }));
            } finally {
                setLoadingKpaIds((s) => ({ ...s, [id]: false }));
            }
        }
    };

    const toggleSo = async (soId: number) => {
        const currently = !!expandedSos[soId];
        setExpandedSos((s) => ({ ...s, [soId]: !currently }));

        if (!currently && !measuresBySo[soId]) {
            setLoadingSoIds((s) => ({ ...s, [soId]: true }));
            try {
                const res = await getMeasuresByStrategicOutputId(soId, 1, 100);
                setMeasuresBySo((s) => ({ ...s, [soId]: res.measures || [] }));
            } finally {
                setLoadingSoIds((s) => ({ ...s, [soId]: false }));
            }
        }
    };

    const toggleMeasure = async (measureId: number) => {
        const currently = !!expandedMeasures[measureId];
        setExpandedMeasures((s) => ({ ...s, [measureId]: !currently }));

        if (!currently && !indicatorsByMeasure[measureId]) {
            setLoadingMeasureIds((s) => ({ ...s, [measureId]: true }));
            try {
                const res = await getIndicatorsByMeasureId(measureId, 1, 100);
                setIndicatorsByMeasure((s) => ({ ...s, [measureId]: res.indicators || [] }));
            } finally {
                setLoadingMeasureIds((s) => ({ ...s, [measureId]: false }));
            }
        }
    };

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
                        <th>KPAs</th>
                        <th>STRATEGIC OUTPUTS</th>
                        <th>MEASURES</th>
                        <th>INDICATORS</th>
                        <th>INDICATOR TYPE</th>
                        <th>TARGET</th>
                        <th>IMPLEMENTATION</th>
                    </tr>
                </thead>
                <tbody>
                    {kpas.map((kpa, index) => {
                        const id = kpa.id_ck ?? kpa.id_kpa;
                        const kpaNumber = index + 1;
                        const sos = soByKpa[id] ?? [];
                        return (
                            <React.Fragment key={id}>
                                <tr className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell">{index + 1}</td>
                                    <td className="table-cell font-medium">
                                        {kpa.strategic_outputs_count > 0 && (
                                            <button 
                                                aria-expanded={!!expandedKpas[id]} 
                                                aria-label={`${expandedKpas[id] ? 'Collapse' : 'Expand'} KPA: ${kpa.name}`}
                                                onClick={() => toggleKpa(kpa)} 
                                                className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                                                title={`${expandedKpas[id] ? 'Collapse' : 'Expand'} Strategic Outputs`}
                                            >
                                                {expandedKpas[id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        )}
                                        {formatHierarchyLabel(String(kpaNumber), kpa.name)}
                                    </td>
                                    <td className="table-cell text-center font-medium">{kpa.strategic_outputs_count}</td>
                                    <td className="table-cell text-center font-medium">{kpa.measures_count}</td>
                                    <td className="table-cell text-center font-medium">{kpa.indicators_count}</td>
                                    <td className="table-cell text-center font-medium"></td>
                                    <td className="table-cell text-center font-medium"></td>
                                    <td className="table-cell text-center font-medium">{kpa.implementation + "%"}</td>
                                </tr>

                                {expandedKpas[id] && (
                                    <>
                                        {loadingKpaIds[id] ? (
                                            <tr><td colSpan={8} className="table-cell">Loading strategic outputs...</td></tr>
                                        ) : sos.length === 0 ? (
                                            <tr><td colSpan={8} className="table-cell">No strategic outputs</td></tr>
                                        ) : (
                                            sos.map((so, soIndex) => {
                                                const soNumber = formatHierarchyNumber(kpaNumber, soIndex + 1);
                                                const soMeasures = measuresBySo[so.id] ?? [];
                                                return (
                                                    <React.Fragment key={so.id}>
                                                        <tr className="table-row bg-slate-50 hover:bg-slate-100 transition-colors">
                                                            <td className="table-cell"></td>
                                                            <td className="table-cell"></td>
                                                            <td className="table-cell font-medium pl-8">
                                                                {so.measures_count > 0 && (
                                                                    <button 
                                                                        aria-expanded={!!expandedSos[so.id]} 
                                                                        aria-label={`${expandedSos[so.id] ? 'Collapse' : 'Expand'} Strategic Output: ${so.name}`}
                                                                        onClick={() => toggleSo(so.id)} 
                                                                        className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                                                                        title={`${expandedSos[so.id] ? 'Collapse' : 'Expand'} Measures`}
                                                                    >
                                                                        {expandedSos[so.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                    </button>
                                                                )}
                                                                {formatHierarchyLabel(soNumber, so.name)}
                                                            </td>
                                                            <td className="table-cell text-center font-medium">{so.measures_count}</td>
                                                            <td className="table-cell text-center font-medium">{0}</td>
                                                            <td className="table-cell"></td>
                                                            <td className="table-cell"></td>
                                                            <td className="table-cell"></td>
                                                        </tr>

                                                        {expandedSos[so.id] ? (
                                                            loadingSoIds[so.id] ? (
                                                                <tr><td colSpan={8} className="table-cell">Loading measures...</td></tr>
                                                            ) : soMeasures.length === 0 ? (
                                                                <tr><td colSpan={8} className="table-cell">No measures</td></tr>
                                                            ) : (
                                                                soMeasures.map((m: any, measureIndex: number) => {
                                                                    const measureNumber = formatHierarchyNumber(kpaNumber, soIndex + 1, measureIndex + 1);
                                                                    const mIndicators = indicatorsByMeasure[m.id] ?? [];
                                                                    return (
                                                                        <React.Fragment key={m.id}>
                                                                            <tr className="table-row bg-slate-100 hover:bg-slate-150 transition-colors">
                                                                                <td className="table-cell"></td>
                                                                                <td className="table-cell"></td>
                                                                                <td className="table-cell"></td>
                                                                                <td className="table-cell font-medium pl-16">
                                                                                    {m.indicators_count > 0 && (
                                                                                        <button 
                                                                                            aria-expanded={!!expandedMeasures[m.id]} 
                                                                                            aria-label={`${expandedMeasures[m.id] ? 'Collapse' : 'Expand'} Measure: ${m.name}`}
                                                                                            onClick={() => toggleMeasure(m.id)} 
                                                                                            className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                                                                                            title={`${expandedMeasures[m.id] ? 'Collapse' : 'Expand'} Indicators`}
                                                                                        >
                                                                                            <span className="text-sm">{expandedMeasures[m.id] ? "▾" : "▸"}</span>
                                                                                        </button>
                                                                                    )}
                                                                                    {formatHierarchyLabel(measureNumber, m.name)}
                                                                                </td>
                                                                                <td className="table-cell text-center font-medium">{m.indicators_count}</td>
                                                                                <td className="table-cell"></td>
                                                                                <td className="table-cell"></td>
                                                                                <td className="table-cell"></td>
                                                                            </tr>

                                                                            {expandedMeasures[m.id] ? (
                                                                                loadingMeasureIds[m.id] ? (
                                                                                    <tr><td colSpan={8} className="table-cell">Loading indicators...</td></tr>
                                                                                ) : mIndicators.length === 0 ? (
                                                                                    <tr><td colSpan={8} className="table-cell">No indicators</td></tr>
                                                                                ) : (
                                                                                    mIndicators.map((ind: any) => (
                                                                                        <tr key={ind.id} className="table-row">
                                                                                            <td className="table-cell"></td>
                                                                                            <td className="table-cell"></td>
                                                                                            <td className="table-cell"></td>
                                                                                            <td className="table-cell"></td>
                                                                                            <td className="table-cell font-medium pl-20">{ind.name}</td>
                                                                                            <td className="table-cell text-center">{ind.type?.name ?? ""}</td>
                                                                                            <td className="table-cell text-center">{ind.target ?? ""}</td>
                                                                                            <td className="table-cell text-center">{ind.actual_value ? `${((ind.actual_value / (ind.target || 1)) * 100).toFixed(0)}%` : "0%"}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                )
                                                                            ) : null}
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            )
                                                        ) : null}
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </>
                                )}
                            </React.Fragment>
                        )
                    })}

                    <tr className="table-pagination-row">
                        <td colSpan={8} className="table-pagination-cell">
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