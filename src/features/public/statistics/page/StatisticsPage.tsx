import { Globe2, LayoutGrid, FolderKanban, TrendingUp } from "lucide-react";
import Banner from "../../components/Banner";
import HorizontalMultiBarChart from "../../progress/components/charts/HorizontalMultiBarChart";
import { useStatisticsOverview } from "../hooks/useStatisticsOverview";

const STAT_CARDS = [
  { key: "countries_active" as const, label: "Active Countries", icon: Globe2 },
  { key: "programs_total" as const, label: "Programs", icon: LayoutGrid },
  { key: "projects_total" as const, label: "Projects", icon: FolderKanban },
  { key: "avg_implementation" as const, label: "Average KPI Implementation", icon: TrendingUp, suffix: "%" },
];

export default function StatisticsPage() {
  const { data, isLoading, error } = useStatisticsOverview();

  return (
    <div className="mb-20">
      <Banner
        title="Statistics"
        description="The most comprehensive compendium of E-commerce statistics available for the Pacific region"
        image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"
      />

      <div className="flex flex-col items-center justify-center">
        <div className="w-5/7 py-14">
          {isLoading && <p className="text-center text-slate-500 py-20">Loading regional statistics...</p>}
          {error && <p className="text-center text-red-600 py-20">Error loading statistics.</p>}

          {data && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {STAT_CARDS.map(({ key, label, icon: Icon, suffix }) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center text-center gap-3">
                    <Icon className="w-8 h-8 text-primary" />
                    <p className="text-3xl font-bold text-secondary">
                      {data[key]}
                      {suffix ?? ""}
                    </p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-20">
                <h1 className="third-head-label">Implementation by Country</h1>
                <h3 className="mt-6">
                  Degree of implementation of the E-commerce Strategy and Roadmap, averaged across each country's adopted Key Priority Areas.
                </h3>
                <div className="mt-10">
                  <HorizontalMultiBarChart data={data.countries} />
                </div>
              </div>

              <div>
                <h1 className="third-head-label">Implementation by Key Priority Area</h1>
                <h3 className="mt-6">
                  Regional average degree of implementation for each Key Priority Area, across every country that has adopted it.
                </h3>
                <div className="mt-10">
                  <HorizontalMultiBarChart data={data.kpas} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
