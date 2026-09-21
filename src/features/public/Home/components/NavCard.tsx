import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to?: string;
}

export default function NavCard({ title, description, icon: Icon, to }: NavCardProps) {
  const content = (
    <>
      <div className="cursor-pointer h-70 bg-primary flex items-center hover:shadow-lg transition-shadow duration-200 justify-center">
        <div className="rounded-sm p-4">
          <Icon className="w-38 h-38 text-white" />
        </div>
      </div>

      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-secondary mb-2">
          {title}
        </h3>

        <p className="leading-relaxed">
          {description}
        </p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="w-auto overflow-hidden text-card-foreground transition-shadow block">
        {content}
      </Link>
    );
  }

  return <div className="w-auto overflow-hidden text-card-foreground transition-shadow">{content}</div>;
}
