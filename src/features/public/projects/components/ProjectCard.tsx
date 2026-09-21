import { Link, useNavigate } from "react-router-dom";
import { useEmbedMode } from "@/hooks/useEmbedMode";

interface ProjectCardProps {
  id: number | string;
  name: string;
  description: string;
}

// Projects have no image field in the data model (unlike programs), so this
// falls back to the site's own placeholder. That placeholder is currently a
// dead link on the client's WordPress host (ORB-blocked as of this writing),
// so a deterministic per-project photo (same id always -> same photo) fills
// the gap without needing a real asset per project.
export default function ProjectCard({ id, name, description }: ProjectCardProps) {
  const navigate = useNavigate();
  const isEmbedded = useEmbedMode();

  const href = isEmbedded ? `/development/projects/${id}?embed=true` : `/development/projects/${id}`;

  return (
    <div key={id} className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition hover:shadow-lg">
      <div className="h-78 w-full overflow-hidden">
        <img src={`https://picsum.photos/seed/project-${id}/800/450`} alt={name} className="h-full w-full object-cover"/>
      </div>
      <div className="flex flex-1 flex-col p-5 px-10">
        <Link to={href} className="mb-2 line-clamp-2 text-xl font-bold text-secondary hover:text-primary"> {name}</Link>
        <p className="mb-6 line-clamp-5 text-gray-600">
          {description}
        </p>
        <div className="mt-auto">
          <button className="btn-secondary w-full" onClick={() => navigate(href)}>
            VIEW PROJECT
          </button>
        </div>
      </div>
    </div>
  );
}
