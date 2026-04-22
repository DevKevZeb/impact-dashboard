import { useState } from "react";
import type { ProjectDashboardRow } from "../types/projectDashboard.types";
import { ProjectProgressModal } from "./ProjectProgressModal";
import { ProjectWeightModal } from "./ProjectWeightModal";
import { ProjectCommentModal } from "./ProjectCommentModal";
import { TruncatedCell } from "@/shared/components/table";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Props {
  rows: ProjectDashboardRow[];
  pagination: Pagination;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  isCountryTable: boolean;
  canEditProgress: boolean;
  canEditWeight: boolean;
  isUpdatingProgress: boolean;
  isUpdatingWeight: boolean;
  onSaveProgress: (projectId: number, progress: number) => Promise<unknown>;
  onSaveWeight: (projectId: number, weight: number) => Promise<unknown>;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

const formatWeight = (weight: number) => Number(weight ?? 0).toFixed(2);

const PROGRESS_MIN = 0;
const PROGRESS_MAX = 100;
const WEIGHT_MIN = 0;
const WEIGHT_MAX = 1;
const TABLE_COLUMN_COUNT = 12;

const clampProgress = (value: number) => Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, value));
const normalizeProgressInteger = (value: number) => Math.round(clampProgress(value));

export default function ProjectDashboardTable({
  rows,
  pagination,
  page,
  perPage,
  setPage,
  setPerPage,
  isCountryTable,
  canEditProgress,
  canEditWeight,
  isUpdatingProgress,
  isUpdatingWeight,
  onSaveProgress,
  onSaveWeight,
}: Props) {
  const [editingProgressRow, setEditingProgressRow] = useState<ProjectDashboardRow | null>(null);
  const [editingWeightRow, setEditingWeightRow] = useState<ProjectDashboardRow | null>(null);
  const [viewingCommentRow, setViewingCommentRow] = useState<ProjectDashboardRow | null>(null);
  const [progressInput, setProgressInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [progressError, setProgressError] = useState("");
  const [weightError, setWeightError] = useState("");

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const canOpenProgressModal = (row: ProjectDashboardRow) => canEditProgress && row.can_edit;

  const openProgressModal = (row: ProjectDashboardRow) => {
    if (!canOpenProgressModal(row)) {
      return;
    }

    setEditingProgressRow(row);
    setProgressInput(String(normalizeProgressInteger(row.progress)));
    setProgressError("");
  };

  const closeProgressModal = () => {
    setEditingProgressRow(null);
    setProgressInput("");
    setProgressError("");
  };

  const openWeightModal = (row: ProjectDashboardRow) => {
    if (!canEditWeight || !isCountryTable) {
      return;
    }

    setEditingWeightRow(row);
    setWeightInput(String(row.weight));
    setWeightError("");
  };

  const closeWeightModal = () => {
    setEditingWeightRow(null);
    setWeightInput("");
    setWeightError("");
  };

  const openCommentModal = (row: ProjectDashboardRow) => {
    setViewingCommentRow(row);
  };

  const closeCommentModal = () => {
    setViewingCommentRow(null);
  };

  const handleProgressInputChange = (value: string) => {
    if (value === "") {
      setProgressInput("");
      setProgressError("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setProgressInput(value);
    setProgressError("");
  };

  const handleWeightInputChange = (value: string) => {
    setWeightInput(value);
    setWeightError("");
  };

  const handleProgressBarChange = (value: string) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    setProgressInput(String(normalizeProgressInteger(parsedValue)));
    setProgressError("");
  };

  const progressPreview = (() => {
    const parsedValue = Number(progressInput);

    if (Number.isNaN(parsedValue)) {
      return 0;
    }

    return normalizeProgressInteger(parsedValue);
  })();

  const handleSaveProgress = async () => {
    if (!editingProgressRow) {
      return;
    }

    const parsedValue = Number(progressInput);

    if (
      Number.isNaN(parsedValue) ||
      !Number.isInteger(parsedValue) ||
      parsedValue < PROGRESS_MIN ||
      parsedValue > PROGRESS_MAX
    ) {
      setProgressError("Progress must be an integer between 0 and 100.");
      return;
    }

    await onSaveProgress(editingProgressRow.id, parsedValue);
    closeProgressModal();
  };

  const handleSaveWeight = async () => {
    if (!editingWeightRow) {
      return;
    }

    const parsedValue = Number(weightInput);

    if (Number.isNaN(parsedValue) || parsedValue < WEIGHT_MIN || parsedValue > WEIGHT_MAX) {
      setWeightError("ICV/W (Weight) must be between 0 and 1.");
      return;
    }

    await onSaveWeight(editingWeightRow.id, Number(parsedValue.toFixed(4)));
    closeWeightModal();
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="table-default">
          <thead className="table-head sticky top-0 z-10">
            <tr>
              <th>#</th>
              {!isCountryTable && <th>COUNTRY</th>}
              <th>MEASURE</th>
              <th>PROGRAM TITLE</th>
              <th>PROJECT TITLE</th>
              <th>LEAD PROJECT MANAGER</th>
              <th>LEAD IMPLEMENTING AGENCY</th>
              <th>BUDGET</th>
              <th>START DATE</th>
              <th>END DATE</th>
              <th>PROGRESS</th>
              {isCountryTable && <th>ICV/W</th>}
              <th>COMMENT</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="table-row">
                <td className="table-cell">{index + 1}</td>
                {!isCountryTable && <td className="table-cell max-w-[120px]"><TruncatedCell text={row.country ?? "—"} maxWidth="max-w-[100px]" /></td>}
                <td className="table-cell max-w-[140px]"><TruncatedCell text={row.measure ?? "—"} maxWidth="max-w-[120px]" /></td>
                <td className="table-cell max-w-40"><TruncatedCell text={row.program_title ?? "—"} maxWidth="max-w-[160px]" /></td>
                <td className="table-cell max-w-40"><TruncatedCell text={row.project_title} maxWidth="max-w-[160px]" /></td>
                <td className="table-cell max-w-[150px]"><TruncatedCell text={row.lead_project_manager ?? "—"} maxWidth="max-w-[130px]" /></td>
                <td className="table-cell max-w-[150px]"><TruncatedCell text={row.lead_implementing_agency ?? "—"} maxWidth="max-w-[130px]" /></td>
                <td className="table-cell">{formatCurrency(row.budget)}</td>
                <td className="table-cell">{formatDate(row.start_date)}</td>
                <td className="table-cell">{formatDate(row.end_date)}</td>
                <td className="table-cell min-w-[150px]">
                  {canOpenProgressModal(row) ? (
                    <button type="button" className="w-full text-left group cursor-pointer" onClick={() => openProgressModal(row)}>
                      <div className="w-full bg-[#61C8E7]/70 rounded-full h-4 relative overflow-hidden min-w-[120px]">
                        <div
                          className="bg-[#1E3291] h-4 rounded-full transition-all duration-500"
                          style={{ width: `${row.progress}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white transition-opacity group-hover:opacity-0">
                          {row.progress}%
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 bg-[#1E3291]/50 rounded-full">
                          ✎ Edit
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full bg-[#61C8E7]/70 rounded-full h-4 relative overflow-hidden min-w-[120px]">
                      <div
                        className="bg-[#1E3291] h-4 rounded-full transition-all duration-500"
                        style={{ width: `${row.progress}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                        {row.progress}%
                      </span>
                    </div>
                  )}
                </td>
                {isCountryTable && (
                  <td className="table-cell min-w-[140px]">
                    {canEditWeight ? (
                      <button
                        type="button"
                        onClick={() => openWeightModal(row)}
                        className="btn-secondary-table inline-flex min-w-[84px] items-center justify-center"
                      >
                        {formatWeight(row.weight)}
                      </button>
                    ) : (
                      <span className="inline-flex min-w-[84px] items-center justify-center rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-[#1E3291]">
                        {formatWeight(row.weight)}
                      </span>
                    )}
                  </td>
                )}
                <td className="table-cell min-w-[130px]">
                  <button
                    type="button"
                    onClick={() => openCommentModal(row)}
                    className="btn-tertiary-table inline-flex min-w-[110px] items-center justify-center"
                  >
                    View comment
                  </button>
                </td>
              </tr>
            ))}

            <tr className="table-pagination-row">
              <td colSpan={TABLE_COLUMN_COUNT} className="table-pagination-cell">
                <div className="table-pagination-container">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Rows per page:</span>
                    <select className="table-perpage-select cursor-pointer" value={perPage} onChange={handlePerPageChange}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="table-pagination-actions">
                    <button className="table-pagination-btn cursor-pointer disabled:cursor-not-allowed" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      ← Prev
                    </button>

                    <span className="text-gray-600 text-xs">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>

                    <button
                      className="table-pagination-btn cursor-pointer disabled:cursor-not-allowed"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.last_page}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </td>
            </tr>

            {rows.length === 0 && (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT} className="px-4 py-6 text-center text-gray-500">
                  There are no rows available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProjectProgressModal
        open={!!editingProgressRow}
        projectTitle={editingProgressRow?.project_title}
        progressInput={progressInput}
        progressPreview={progressPreview}
        progressError={progressError}
        isSaving={isUpdatingProgress}
        onClose={closeProgressModal}
        onProgressInputChange={handleProgressInputChange}
        onProgressSliderChange={handleProgressBarChange}
        onSave={handleSaveProgress}
      />

      <ProjectWeightModal
        open={!!editingWeightRow}
        projectTitle={editingWeightRow?.project_title}
        weightInput={weightInput}
        weightError={weightError}
        isSaving={isUpdatingWeight}
        onClose={closeWeightModal}
        onWeightInputChange={handleWeightInputChange}
        onSave={handleSaveWeight}
      />

      <ProjectCommentModal
        open={!!viewingCommentRow}
        projectTitle={viewingCommentRow?.project_title}
        comment={viewingCommentRow?.comment ?? null}
        onClose={closeCommentModal}
      />
    </>
  );
}
