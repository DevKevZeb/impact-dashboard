import ResourceGrid from "../components/ResourceGrid";
import { TOOLKITS } from "../data/resourcesData";

export default function ToolkitsPage() {
  return (
    <ResourceGrid
      title="E-Biz Toolkits"
      description="Practical toolkits to help Pacific businesses move online"
      items={TOOLKITS}
    />
  );
}
