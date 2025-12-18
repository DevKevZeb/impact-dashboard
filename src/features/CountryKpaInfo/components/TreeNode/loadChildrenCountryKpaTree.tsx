import { Target, BarChart2, Dot } from "lucide-react";
import type { TreeNode } from "./TreeType";

import { getStrategicOutputsByCountryKpaId } from "@/features/strategic-output/services/strategic-output.api";
import { getMeasuresByStrategicOutputId } from "@/features/measures/services/measure.api";
import { getIndicatorsByMeasureId } from "@/features/indicator/services/indicator.api";

export async function loadChildrenCountryKpaTree(nodeKey: string): Promise<TreeNode[]> {
  const [type, id] = nodeKey.split("-");
  const numericId = Number(id);

  console.log(type, id)

  switch (type) {
    case "ck": {
      const outputs = await getStrategicOutputsByCountryKpaId(numericId);
      return [
        { key: `title-so-${numericId}`, label: "Strategic Outputs", isTitle: true, selectable: false },
        ...outputs.map((so) => ({
          key: `so-${so.id}`,
          label: so.name,
          icon: <Target className="w-4 h-4 text-orange-500" />,
          lazy: true,
          leaf: false,
          data: { type: "so" as const, id: so.id,  count: so.measures_count},
          parent_id: numericId
        })),
      ];
    }

    case "so": {
      const measures = await getMeasuresByStrategicOutputId(numericId);
      return [
        { key: `title-me-${numericId}`, label: "Measures", isTitle: true, selectable: false },
        ...measures.map((m) => ({
          key: `m-${m.id}`,
          label: m.name,
          icon: <BarChart2 className="w-4 h-4 text-purple-500" />,
          lazy: true,
          leaf: false,
          data: { type: "m" as const, id: m.id, count: m.indicators_count },
          parent_id: numericId
        })),
      ];
    }

    case "m": {
      const indicators = await getIndicatorsByMeasureId(numericId);
      return [
        { key: `title-in-${numericId}`, label: "Indicators", isTitle: true, selectable: false },
        ...indicators.map((i) => ({
          key: `i-${i.id}`,
          label: i.name,
          icon: <Dot className="w-4 h-4 text-gray-400" />,
          leaf: true,
          data: { type: "i" as const, id: i.id },
          meta: {
            type: i.type?.name,
            type_id: i.type?.id,
            target: i.target as number,
          },
          parent_id: numericId
        })),
      ];
    }

    default:
      return [];
  }
}
