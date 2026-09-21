import { FileText } from "lucide-react";
import Banner from "../../components/Banner";
import type { ResourceItem } from "../data/resourcesData";

interface ResourceGridProps {
  title: string;
  description: string;
  items: ResourceItem[];
}

export default function ResourceGrid({ title, description, items }: ResourceGridProps) {
  return (
    <div className="mb-20">
      <Banner title={title} description={description} image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png" />

      <div className="flex flex-col items-center justify-center">
        <div className="w-5/7 py-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</span>
                </div>
                <h3 className="font-semibold text-secondary text-lg">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
