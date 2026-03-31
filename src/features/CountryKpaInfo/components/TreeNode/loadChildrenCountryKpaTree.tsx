import { Target, BarChart2, Dot } from "lucide-react";
import type { TreeNode } from "./TreeType";

import { getStrategicOutputsByCountryKpaId } from "@/features/strategic-output/services/strategic-output.api";
import { getMeasuresByStrategicOutputId } from "@/features/measures/services/measure.api";
import { getIndicatorsByMeasureId } from "@/features/indicator/services/indicator.api";

export async function loadChildrenCountryKpaTree(nodeKey: string, page: number = 1, perPage: number = 20): Promise<TreeNode[]> {
  const [type, id] = nodeKey.split("-");
  const numericId = Number(id);
  
  switch (type) {
    case "ck": {
      const res = await getStrategicOutputsByCountryKpaId(numericId, page, perPage);
      const outputs = res.strategic_outputs;
      const pagination = res.pagination;
      
      const nodes: TreeNode[] = [
        ...outputs.map((so) => ({
          key: `so-${so.id}`,
          label: so.name,
          icon: <Target className="w-4 h-4 text-orange-500"/>,
          lazy: true,
          leaf: false,
          data: { 
            type: "so" as const, 
            id: so.id,
            count: so.measures_count
          },
          parent_id: numericId
        })),
      ];

      if(pagination.current_page < pagination.last_page) {
        nodes.push({
          key: `loadmore-so-${numericId}-${page}`,
          label: "Load more...",
          leaf: true,
          selectable: false,
          data: {
            type: "load-more",
            parentType: "ck",
            parentId: numericId,
            nextPage: page + 1,
          },
          parent_id: numericId,
        })
      }
      return nodes;
    }

    case "so": {
      const res = await getMeasuresByStrategicOutputId(numericId, page, perPage);

      const measures = res.measures;
      const pagination = res.pagination;

      const nodes: TreeNode[] = [
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

      if(pagination.current_page < pagination.last_page) {
        nodes.push({
          key: `loadmore-me-${numericId}-${page}`,  
          label: "Load more...",
          leaf: true,
          selectable: false,
          data: {
            type: "load-more",
            parentType: "so",
            parentId: numericId,
            nextPage: page + 1,
          },
          parent_id: numericId,
        })
      }
      return nodes;
    }

    case "m": {
      const res = await getIndicatorsByMeasureId(numericId, page, perPage);
      const indicators = res.indicators;
      const pagination = res.pagination;

      const nodes: TreeNode[] = [
        ...indicators
        .map((i) => (  {
          key: `i-${i.id}`,
          label: i.name,
          icon: <Dot className="w-4 h-4 text-gray-400" />,
          leaf: true,
          data: { type: "i" as const, id: i.id },
          meta: {
            type: i.type?.name,
            type_id: i.type?.id,
            target: i.target,
            is_bottom_up: i.type?.is_bottom_up,
            actual_value: i.actual_value ?? null,
          },
          parent_id: numericId
        })),
      ];

      if(pagination.current_page < pagination.last_page) {
        nodes.push({
          key: `loadmore-in-${numericId}-${page}`,
          label: "Load more...",
          leaf: true,
          selectable: false,
          data: {
            type: "load-more",
            parentType: "m",
            parentId: numericId,
            nextPage: page + 1,
          },
          parent_id: numericId,
        })
      }
      return nodes;
    }

    default:
      return [];
  }
}
