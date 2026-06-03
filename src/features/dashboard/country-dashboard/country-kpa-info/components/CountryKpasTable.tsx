import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { CountryKpaImplementation } from "../types/kpas.type";

const formatHierarchyNumber = (...parts: number[]) => parts.join(".");
const formatHierarchyLabel = (number: string, label: string) => `${number}. ${label}`;

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface CountryKpasTableProps {
  kpas: CountryKpaImplementation[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

export default function CountryKpasTable({ kpas, pagination, page, perPage, setPage, setPerPage }: CountryKpasTableProps) {
  const [expandedKpas, setExpandedKpas] = useState<Record<number, boolean>>({});
  const [expandedSos, setExpandedSos] = useState<Record<number, boolean>>({});
  const [expandedMeasures, setExpandedMeasures] = useState<Record<number, boolean>>({});

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const toggleKpa = (kpaId: number) => {
    const isCurrentlyExpanded = !!expandedKpas[kpaId];

    if (isCurrentlyExpanded) {
      const kpa = kpas.find((item) => item.id === kpaId);
      const strategicOutputIds = new Set<number>((kpa?.strategic_outputs ?? []).map((so) => so.id));
      const measureIds = new Set<number>(
        (kpa?.strategic_outputs ?? []).flatMap((so) => so.measures.map((measure) => measure.id)),
      );

      setExpandedSos((current) => {
        const next = { ...current };
        strategicOutputIds.forEach((id) => {
          delete next[id];
        });
        return next;
      });

      setExpandedMeasures((current) => {
        const next = { ...current };
        measureIds.forEach((id) => {
          delete next[id];
        });
        return next;
      });
    }

    setExpandedKpas((current) => ({ ...current, [kpaId]: !current[kpaId] }));
  };

  const toggleSo = (soId: number) => {
    const isCurrentlyExpanded = !!expandedSos[soId];

    if (isCurrentlyExpanded) {
      const measureIds = kpas.flatMap((kpa) =>
        kpa.strategic_outputs
          .filter((so) => so.id === soId)
          .flatMap((so) => so.measures.map((measure) => measure.id)),
      );

      setExpandedMeasures((current) => {
        const next = { ...current };
        measureIds.forEach((id) => {
          delete next[id];
        });
        return next;
      });
    }

    setExpandedSos((current) => ({ ...current, [soId]: !current[soId] }));
  };

  const toggleMeasure = (measureId: number) => {
    setExpandedMeasures((current) => ({ ...current, [measureId]: !current[measureId] }));
  };

  const formatImplementation = (value?: number | null) => `${Number(value ?? 0).toFixed(2)}%`;

  const tableRows = (() => {
    const rows: React.ReactNode[] = [];

    for (const [kpaIndex, kpa] of kpas.entries()) {
      const kpaNumber = kpaIndex + 1;
      const isKpaExpanded = !!expandedKpas[kpa.id];

      rows.push(
        <tr key={`kpa-${kpa.id}`} className="table-row hover:bg-slate-50 transition-colors">
          <td className="table-cell">{kpaNumber}</td>
          <td className="table-cell font-medium">
            {kpa.strategic_outputs_count > 0 && (
              <button
                aria-expanded={isKpaExpanded}
                aria-label={`${isKpaExpanded ? "Collapse" : "Expand"} KPA: ${kpa.name}`}
                onClick={() => toggleKpa(kpa.id)}
                className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                title={`${isKpaExpanded ? "Collapse" : "Expand"} Strategic Outputs`}
              >
                {isKpaExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {formatHierarchyLabel(String(kpaNumber), kpa.name)}
          </td>
          <td className="table-cell text-center font-medium">{kpa.strategic_outputs_count}</td>
          <td className="table-cell text-center font-medium">{kpa.measures_count}</td>
          <td className="table-cell text-center font-medium">{kpa.indicators_count}</td>
          <td className="table-cell text-center font-medium"></td>
          <td className="table-cell text-center font-medium"></td>
          <td className="table-cell text-center font-medium">{formatImplementation(kpa.implementation)}</td>
        </tr>,
      );

      if (!isKpaExpanded) {
        continue;
      }

      for (const [soIndex, so] of kpa.strategic_outputs.entries()) {
        const soNumber = formatHierarchyNumber(kpaNumber, soIndex + 1);
        const isSoExpanded = !!expandedSos[so.id];

        rows.push(
          <tr key={`so-${so.id}`} className="table-row bg-slate-50 hover:bg-slate-100 transition-colors">
            <td className="table-cell"></td>
            <td className="table-cell"></td>
            <td className="table-cell font-medium pl-8">
              {so.measures_count > 0 && (
                <button
                  aria-expanded={isSoExpanded}
                  aria-label={`${isSoExpanded ? "Collapse" : "Expand"} Strategic Output: ${so.name}`}
                  onClick={() => toggleSo(so.id)}
                  className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                  title={`${isSoExpanded ? "Collapse" : "Expand"} Measures`}
                >
                  {isSoExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {formatHierarchyLabel(soNumber, so.name)}
            </td>
            <td className="table-cell text-center font-medium">{so.measures_count}</td>
            <td className="table-cell text-center font-medium">{so.indicators_count}</td>
            <td className="table-cell text-center font-medium"></td>
            <td className="table-cell text-center font-medium"></td>
            <td className="table-cell text-center font-medium">{formatImplementation(so.implementation)}</td>
          </tr>,
        );

        if (!isSoExpanded) {
          continue;
        }

        for (const [measureIndex, measure] of so.measures.entries()) {
          const measureNumber = formatHierarchyNumber(kpaNumber, soIndex + 1, measureIndex + 1);
          const isMeasureExpanded = !!expandedMeasures[measure.id];

          rows.push(
            <tr key={`measure-${measure.id}`} className="table-row bg-slate-100 hover:bg-slate-150 transition-colors">
              <td className="table-cell"></td>
              <td className="table-cell"></td>
              <td className="table-cell"></td>
              <td className="table-cell font-medium pl-16">
                {measure.indicators_count > 0 && (
                  <button
                    aria-expanded={isMeasureExpanded}
                    aria-label={`${isMeasureExpanded ? "Collapse" : "Expand"} Measure: ${measure.name}`}
                    onClick={() => toggleMeasure(measure.id)}
                    className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-gray-600 hover:text-gray-900"
                    title={`${isMeasureExpanded ? "Collapse" : "Expand"} Indicators`}
                  >
                    <span className="text-sm">{isMeasureExpanded ? "▾" : "▸"}</span>
                  </button>
                )}
                {formatHierarchyLabel(measureNumber, measure.name)}
              </td>
              <td className="table-cell text-center font-medium">{measure.indicators_count}</td>
              <td className="table-cell text-center font-medium"></td>
              <td className="table-cell text-center font-medium"></td>
              <td className="table-cell text-center font-medium">{formatImplementation(measure.implementation)}</td>
            </tr>,
          );

          if (!isMeasureExpanded) {
            continue;
          }

          for (const indicator of measure.indicators) {
            rows.push(
              <tr key={`indicator-${indicator.id}`} className="table-row">
                <td className="table-cell"></td>
                <td className="table-cell"></td>
                <td className="table-cell"></td>
                <td className="table-cell"></td>
                <td className="table-cell font-medium pl-20">{indicator.name}</td>
                <td className="table-cell text-center">{indicator.type?.name ?? ""}</td>
                <td className="table-cell text-center">{indicator.target ?? ""}</td>
                <td className="table-cell text-center">{formatImplementation(indicator.implementation)}</td>
              </tr>,
            );
          }
        }
      }
    }

    return rows;
  })();

  return (
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
          {tableRows}

          <tr className="table-pagination-row">
            <td colSpan={8} className="table-pagination-cell">
              <div className="table-pagination-container">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Rows per page:</span>
                  <select className="table-perpage-select" value={perPage} onChange={handlePerPageChange}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="table-pagination-actions">
                  <button className="table-pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    ← Prev
                  </button>

                  <span className="text-gray-600 text-xs">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button className="table-pagination-btn" onClick={() => setPage(page + 1)} disabled={page === pagination.last_page}>
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