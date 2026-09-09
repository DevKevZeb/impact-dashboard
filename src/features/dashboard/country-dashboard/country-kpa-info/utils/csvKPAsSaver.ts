'use client';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { CountryDashboardImplementationResponse } from "../types/kpas.type";

interface ExportRow {
  "#": string;
  KPAs: string;
  "STRATEGIC OUTPUTS": string;
  MEASURES: string;
  INDICATORS: string;
  "INDICATOR TYPE": string;
  TARGET: string;
  IMPLEMENTATION: string;
}

const formatImplementation = (value?: number | null) =>
  `${Number(value ?? 0).toFixed(2)}%`;

export const handleExportExcel = (
  data: CountryDashboardImplementationResponse | undefined,
  country: { name?: string } | undefined
) => {
  const kpas = data?.kpas ?? [];
  const rows: ExportRow[] = [];

  for (const [kpaIndex, kpa] of kpas.entries()) {
    const kpaNumber = kpaIndex + 1;

    // KPA row
    rows.push({
      "#": String(kpaNumber),
      KPAs: kpa.name,
      "STRATEGIC OUTPUTS": "",
      MEASURES: "",
      INDICATORS: "",
      "INDICATOR TYPE": "",
      TARGET: "",
      IMPLEMENTATION: formatImplementation(kpa.implementation),
    });

    for (const [soIndex, so] of kpa.strategic_outputs.entries()) {
      const soNumber = `${kpaNumber}.${soIndex + 1}`;

      // Strategic Output row
      rows.push({
        "#": "",
        KPAs: "",
        "STRATEGIC OUTPUTS": `${soNumber}. ${so.name}`,
        MEASURES: "",
        INDICATORS: "",
        "INDICATOR TYPE": "",
        TARGET: "",
        IMPLEMENTATION: formatImplementation(so.implementation),
      });

      for (const [measureIndex, measure] of so.measures.entries()) {
        const measureNumber = `${soNumber}.${measureIndex + 1}`;

        // Measure row
        rows.push({
          "#": "",
          KPAs: "",
          "STRATEGIC OUTPUTS": "",
          MEASURES: `${measureNumber}. ${measure.name}`,
          INDICATORS: "",
          "INDICATOR TYPE": "",
          TARGET: "",
          IMPLEMENTATION: formatImplementation(measure.implementation),
        });

        // Indicator rows
        for (const indicator of measure.indicators) {
          rows.push({
            "#": "",
            KPAs: "",
            "STRATEGIC OUTPUTS": "",
            MEASURES: "",
            INDICATORS: indicator.name,
            "INDICATOR TYPE": indicator.type?.name ?? "",
            TARGET: indicator.target != null ? String(indicator.target) : "",
            IMPLEMENTATION: formatImplementation(indicator.implementation),
          });
        }
      }
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for readability
  worksheet["!cols"] = [
    { wch: 4 },   // #
    { wch: 30 },  // KPAs
    { wch: 40 },  // STRATEGIC OUTPUTS
    { wch: 40 },  // MEASURES
    { wch: 35 },  // INDICATORS
    { wch: 15 },  // INDICATOR TYPE
    { wch: 10 },  // TARGET
    { wch: 15 },  // IMPLEMENTATION
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "KPAs");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `KPAs_${country?.name ?? "country"}.xlsx`);
};
