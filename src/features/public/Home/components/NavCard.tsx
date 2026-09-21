import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export type NavCardAccent = "sky" | "amber" | "violet" | "emerald" | "rose";

interface NavCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to?: string;
  accent?: NavCardAccent;
}

// Static class strings (not template literals) so Tailwind's build-time
// scanner can find and keep them - a dynamic `bg-${accent}-100` would get
// purged since it never appears verbatim in the source.
const ACCENT_CLASSES: Record<NavCardAccent, { badge: string; icon: string }> = {
  sky: { badge: "bg-sky-100", icon: "text-sky-600" },
  amber: { badge: "bg-amber-100", icon: "text-amber-600" },
  violet: { badge: "bg-violet-100", icon: "text-violet-600" },
  emerald: { badge: "bg-emerald-100", icon: "text-emerald-600" },
  rose: { badge: "bg-rose-100", icon: "text-rose-600" },
};

export default function NavCard({ title, description, icon: Icon, to, accent = "sky" }: NavCardProps) {
  const { badge, icon } = ACCENT_CLASSES[accent];

  const content = (
    <div className="h-full flex flex-col items-center text-center rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${badge}`}>
        <Icon className={`h-10 w-10 ${icon}`} strokeWidth={1.75} />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-secondary mb-2">
        {title}
      </h3>

      <p className="leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full cursor-pointer text-card-foreground">
        {content}
      </Link>
    );
  }

  return <div className="h-full text-card-foreground">{content}</div>;
}
