'use client';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const handleExportExcel = (data: any, country: any) => {
  const kpas = !Array.isArray(data) && data?.kpas ? data.kpas : [];

  const formattedData = kpas.map((kpa: any, index: number) => ({
    "#": index + 1,
    KPAs: kpa.name,
    "STRATEGIC OUTPUTS": kpa.strategic_outputs_count,
    MEASURES: kpa.measures_count,
    INDICATORS: kpa.indicators_count,
    TARGETS: kpa.indicators_count, // según tu ejemplo
    IMPLEMENTATION: `${kpa.implementation}%`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "KPAs");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `KPAs_${country?.name}.xlsx`);
};
