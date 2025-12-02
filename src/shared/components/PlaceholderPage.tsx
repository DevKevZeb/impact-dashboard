import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/20">
        <Construction className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 max-w-md">
        {description || "This page is currently under construction. Please check back later."}
      </p>
    </div>
  );
}
