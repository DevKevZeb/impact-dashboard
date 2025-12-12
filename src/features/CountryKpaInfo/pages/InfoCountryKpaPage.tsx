import { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LazyTree } from "../components/TreeNode/Tree";
import { loadChildrenCountryKpaTree } from "../components/TreeNode/loadChildrenCountryKpaTree";
import { useCountryKpas } from "@/features/CountryKpa/hooks/useCountryKpas";
import { Globe2, Flag } from "lucide-react";
import type { TreeNode } from "../components/TreeNode/TreeType";
import CreateStrategicOutputModal from "@/features/strategic-output/components/CreateStrategicOutputModal";
import type { StrategicOutput } from "@/features/strategic-output/types/StrategicOutput";

interface CountryOption {
  id: number;
  name: string;
}

export default function InfoCountryKpaPage() {
  const { countryId } = useParams();
  const { state } = useLocation();

  const id = Number(countryId);
  const country = state?.country as CountryOption | undefined;

  const { data: kpas = [], isLoading } = useCountryKpas(id, true);
  const [selected, setSelected] = useState<string | null>(null);

  const [openStrategicOutputModal, setOpenStrategicOutputModal] = useState(false);
  const [editStraegicOutput, setEditStrattegicOutput] = useState<StrategicOutput | null>(null); 
  const [parentKpaId, setParentKpaId] = useState<number|null>(null);

  const initial = useMemo<TreeNode[]>(() => [
    {
      key: `country-${id}`,
      label: country?.name ?? `Country #${id}`,
      icon: <Globe2 className="w-4 h-4 text-emerald-700" />,
      lazy: false,
      data: { type: "country", id, count: kpas.length },
      children: [
        {
          key: `title-kpa-${id}`,
          label: "KPAs",
          isTitle: true,
          selectable: false,
        },

        ...kpas.map((k) => ({
          key: `ck-${k.id_ck}`,
          label: k.name,
          icon: <Flag className="w-4 h-4 text-sky-600" />,
          lazy: k.strategic_outputs_count > 0,
          leaf: k.strategic_outputs_count === 0,
          data: {
            type: "ck" as const,
            id: k.id_ck,
            count: k.strategic_outputs_count,
          },
        })),
      ],
    },
  ], [id, country, kpas]);


  const handleAddStrategicOutput = (node: TreeNode) => {
    setParentKpaId(node.data?.id ?? null);
    setOpenStrategicOutputModal(true);
  }


  return (
    <div className="p-6 space-y-4">
      <h1 className="label-default">KPAs of {country?.name}</h1>

      {!isLoading && (
        <LazyTree value={initial} selectionKey={selected} onSelectionChange={(key) => setSelected(key)} loadChildren={loadChildrenCountryKpaTree} onAddStrategicOutput={handleAddStrategicOutput}/>
      )}

      {parentKpaId !== null && (
        <CreateStrategicOutputModal open={openStrategicOutputModal} strategicOutput={editStraegicOutput} parentCountryKpaId={parentKpaId} onClose={()=> setOpenStrategicOutputModal(false)} onSubmit={(dto) => console.log("CREANDO STRATEGIC OUTPUT")}/>
      )}
    </div>
  );
}
