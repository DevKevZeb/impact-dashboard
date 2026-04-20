import { Link, useNavigate } from "react-router-dom";
import { useEmbedMode } from "@/hooks/useEmbedMode";

interface ProjectCardProps {
  id: number | string;
  name: string;
  description: string;
}

export default function ProjectCard({ id, name, description }: ProjectCardProps) {
  const navigate = useNavigate();
  const isEmbedded = useEmbedMode();

  const href = isEmbedded ? `/development/projects/${id}?embed=true` : `/development/projects/${id}`;

  return (
    <div key={id} className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition hover:shadow-lg">
      <div className="h-78 w-full overflow-hidden">
        <img src="https://orchid-alligator-247477.hostingersite.com/wp-content/uploads/2022/04/grid-item-image.png" alt={name} className="h-full w-full object-cover"/>
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
