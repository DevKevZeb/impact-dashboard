import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProjects";
import BackArrow from "@/shared/components/backArrow/BackArrow";

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const parsedId = Number(id);

  if (Number.isNaN(parsedId)) {
    return <div>Invalid project</div>;
  }

  const { data, isLoading, error } = useProject(parsedId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading project details</p>
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
          <h1 className="page-title">Project details</h1>
          <p className="page-description">Read-only project information view.</p>
        </div>
        <BackArrow backTo="/app/projects" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Project Name</p>
          <p className="text-base font-medium text-gray-900">{data.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">State</p>
          <p className="text-base font-medium text-gray-900">{data.project_state?.state ?? "-"}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
          <p className="text-base text-gray-900">{data.description}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Project URL</p>
          <p className="text-base text-gray-900">{data.project_url || "-"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Progress</p>
          <p className="text-base font-medium text-gray-900">{data.progress}%</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Start date</p>
          <p className="text-base text-gray-900">{formatDate(data.start_date)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">End date</p>
          <p className="text-base text-gray-900">{formatDate(data.end_date)}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Budget</p>
          <p className="text-base text-gray-900">${Number(data.budget ?? 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Weight</p>
          <p className="text-base text-gray-900">{data.weight ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Beneficiary</p>
          <p className="text-base text-gray-900">{data.beneficiary?.name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Contact</p>
          <p className="text-base text-gray-900">
            {data.contact ? `${data.contact.first_name} ${data.contact.last_name}` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
