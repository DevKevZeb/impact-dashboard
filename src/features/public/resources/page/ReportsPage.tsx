import ResourceGrid from "../components/ResourceGrid";
import { REPORTS } from "../data/resourcesData";

export default function ReportsPage() {
  return (
    <ResourceGrid
      title="Reports"
      description="National and regional E-commerce diagnostic reports and strategies for Pacific Island countries"
      items={REPORTS}
    />
  );
}
