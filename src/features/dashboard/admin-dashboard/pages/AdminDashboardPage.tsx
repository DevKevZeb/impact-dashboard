import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { FolderOpenDot, Loader2, Search } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { EmptyState } from "@/shared/components/EmptyState";
import { useVisibleCountryDashboardSharesForAdmin } from "@/features/dashboard/country-dashboard/country-dashboard-share/api/countryDashboardShare.queries";
import { useProjectDashboardByCountry } from "@/features/dashboard/project-dashboard/hooks/useProjectDashboard";
import { ProjectCommentModal } from "@/features/dashboard/project-dashboard/components/ProjectCommentModal";
import { useProgramsByCountry } from "@/features/programs/api/programQueries";
import type { Program } from "@/features/programs/types/program.types";
import type { ProjectDashboardRow } from "@/features/dashboard/project-dashboard/types/projectDashboard.types";
import { formatCurrency } from "@/utils/formatCurrency";

const formatDate = (date: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatWeight = (weight: number) => Number(weight ?? 0).toFixed(5);

interface AdminCountrySectionProps {
  countryId: number;
  countryName: string;
}

function AdminCountrySection({ countryId, countryName }: AdminCountrySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);
  const [selectedCommentRow, setSelectedCommentRow] = useState<ProjectDashboardRow | null>(null);

  const searchTermTrimmed = debouncedSearchTerm.trim();

  const { data: programData } = useProgramsByCountry(countryId, 1, 200, "");
  const { data: dashboardData, isLoading, error } = useProjectDashboardByCountry(
    countryId,
    1,
    500,
    searchTermTrimmed
  );

  const programMap = useMemo(() => {
    const map = new Map<string, Program>();
    (programData?.programs ?? []).forEach((program) => {
      if (program.name) {
        map.set(program.name, program);
      }
    });
    return map;
  }, [programData]);

  const groupedPrograms = useMemo(() => {
    const groups = new Map<string, ProjectDashboardRow[]>();
    (dashboardData?.rows ?? []).forEach((row) => {
      const key = row.program_title ?? "Unknown Program";
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(row);
    });

    return Array.from(groups.entries()).map(([programTitle, rows]) => {
      const sortedByStart = [...rows].sort((a, b) => a.start_date.localeCompare(b.start_date));
      const sortedByEnd = [...rows].sort((a, b) => b.end_date.localeCompare(a.end_date));
      const program = programMap.get(programTitle);

      return {
        title: programTitle,
        description: program?.description ?? "N/A",
        startDate: program?.program_summary?.start_date ?? sortedByStart[0]?.start_date ?? "",
        endDate: program?.program_summary?.end_date ?? sortedByEnd[0]?.end_date ?? "",
        rows,
      };
    });
  }, [dashboardData, programMap]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-600">Loading programs for {countryName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading programs for {countryName}</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{countryName}</h2>
          <p className="text-sm text-gray-500">
            Shared programs and projects for this country.
          </p>
        </div>

        <div className="relative max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-default w-full"
          />
        </div>
      </div>

      {groupedPrograms.length > 0 ? (
        <div className="space-y-8">
          {groupedPrograms.map((program) => (
            <div key={program.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-gray-900">{program.title}</h3>
                  <p className="text-xs text-gray-500">
                    Short Description: {program.description || "N/A"}
                  </p>
                </div>
                <div className="text-xs text-gray-500 flex flex-col items-end gap-1">
                  <span>Start Date: {formatDate(program.startDate)}</span>
                  <span>End Date: {formatDate(program.endDate)}</span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <p className="text-xs font-semibold text-gray-700 mb-2">Projects:</p>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">PROJECT TITLE</th>
                        <th className="px-4 py-2 text-left">LEAD MANAGER</th>
                        <th className="px-4 py-2 text-left">LEAD AGENCY</th>
                        <th className="px-4 py-2 text-left">BUDGET (TOP)</th>
                        <th className="px-4 py-2 text-left">START DATE</th>
                        <th className="px-4 py-2 text-left">END DATE</th>
                        <th className="px-4 py-2 text-left">KPI</th>
                        <th className="px-4 py-2 text-left">PROGRESS</th>
                        <th className="px-4 py-2 text-left">ICV/W</th>
                        <th className="px-4 py-2 text-left">COMMENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.rows.map((row) => (
                        <tr key={row.id} className="border-t border-slate-200">
                          <td className="px-4 py-2 text-gray-900">{row.project_title}</td>
                          <td className="px-4 py-2">{row.lead_project_manager ?? "N/A"}</td>
                          <td className="px-4 py-2">{row.lead_implementing_agency ?? "N/A"}</td>
                          <td className="px-4 py-2">{formatCurrency(row.budget, row.currency_code)}</td>
                          <td className="px-4 py-2">{formatDate(row.start_date)}</td>
                          <td className="px-4 py-2">{formatDate(row.end_date)}</td>
                          <td className="px-4 py-2">{row.measure ?? "N/A"}</td>
                          <td className="px-4 py-2">{Math.round(row.progress)}%</td>
                          <td className="px-4 py-2">{formatWeight(row.weight)}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="text-sky-600 hover:underline"
                              onClick={() => setSelectedCommentRow(row)}
                            >
                              View Comment
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpenDot}
          title={searchTermTrimmed ? "No projects found" : "No programs available"}
          description={searchTermTrimmed ? "Try adjusting your search terms" : "No programs have been shared for this country."}
        />
      )}

      <ProjectCommentModal
        open={!!selectedCommentRow}
        projectTitle={selectedCommentRow?.project_title}
        comment={selectedCommentRow?.comment ?? null}
        onClose={() => setSelectedCommentRow(null)}
      />
    </section>
  );
}

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = (user?.roles ?? []).some((role) => role.name === "admin");

  const { data, isLoading, error } = useVisibleCountryDashboardSharesForAdmin(1, 200);

  const countries = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    (data?.shares ?? []).forEach((share) => {
      const country = share.country;
      if (country?.id && country.name) {
        map.set(country.id, { id: country.id, name: country.name });
      }
    });
    return Array.from(map.values()).sort((left, right) =>
      left.name.localeCompare(right.name, undefined, { sensitivity: "base" })
    );
  }, [data]);

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading shared countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading admin dashboard</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={FolderOpenDot}
          title="No shared dashboards"
          description="Country managers have not shared any dashboards with your account yet."
        />
      </div>
    );
  }

  return (
    <div className="page-container space-y-8">
      <div className="title-container">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Explore programs and projects shared by country managers.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {countries.map((country) => (
          <AdminCountrySection
            key={country.id}
            countryId={country.id}
            countryName={country.name}
          />
        ))}
      </div>
    </div>
  );
}
