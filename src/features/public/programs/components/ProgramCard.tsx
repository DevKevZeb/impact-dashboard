import { Link, useNavigate } from "react-router-dom";
import { useEmbedMode } from "@/hooks/useEmbedMode";
import { resolveStorageUrl } from "@/lib/utils";

interface ProgramCardProps {
  id: number | string;
  name: string;
  description: string;
  bannerImg?: string | null;
}

const FALLBACK_BANNER = "https://orchid-alligator-247477.hostingersite.com/wp-content/uploads/2022/04/grid-item-image.png";

export default function ProgramCard({ id, name, description, bannerImg }: ProgramCardProps) {
  const navigate = useNavigate();
  const isEmbedded = useEmbedMode();

  const href = isEmbedded ? `/development/programs/${id}?embed=true` : `/development/programs/${id}`;

  return (
    <div
      key={id}
      className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition hover:shadow-lg"
    >
      <div className="h-78 w-full overflow-hidden">
        <img
          src={resolveStorageUrl(bannerImg) ?? FALLBACK_BANNER}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 px-10">
        <Link to={href} className="mb-2 line-clamp-2 text-xl font-bold text-secondary hover:text-primary">
          {name}
        </Link>
        <p className="mb-6 line-clamp-5 text-gray-600">{description}</p>
        <div className="mt-auto">
          <button className="btn-secondary w-full" onClick={() => navigate(href)}>
            VIEW PROGRAM
          </button>
        </div>
      </div>
    </div>
  );
}
