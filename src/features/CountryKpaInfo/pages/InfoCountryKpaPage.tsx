import { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LazyTree } from "../components/TreeNode/Tree";
import { loadChildrenCountryKpaTree } from "../components/TreeNode/loadChildrenCountryKpaTree";
import { useCountryKpas } from "@/features/CountryKpa/hooks/useCountryKpas";
import { Globe2, Flag } from "lucide-react";
import type { TreeNode } from "../components/TreeNode/TreeType";
import CreateStrategicOutputModal from "@/features/strategic-output/components/CreateStrategicOutputModal";
import type {  UpdateStrategicOutputDTO } from "@/features/strategic-output/types/StrategicOutput";
import { useUpdateStrategicOutput } from "@/features/strategic-output/hooks/useUpdateStrategicOutput";
import { useCreateStrategicOutput } from "@/features/strategic-output/hooks/useCreateStrategicOutput";
import type { UpdateMeasureDTO } from "@/features/measures/types/measureTypes";
import { useCreateMeasure } from "@/features/measures/hooks/useCreateMeasure";
import { useUpdateMeasure } from "@/features/measures/hooks/useUpdateMeasure";
import CreateMeasureModal from "@/features/measures/components/CreateMeasureModal";
import type { UpdateIndicatorDTO } from "@/features/indicator/types/indicatorTypes";

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
  const [refreshNode, setRefreshNode] = useState<(key: string) => void>();

  const [parentKpaId, setParentKpaId] = useState<number|null>(null);
  const [openStrategicOutputModal, setOpenStrategicOutputModal] = useState(false);
  const [editStrategicOutput, setEditStrategicOutput] = useState<UpdateStrategicOutputDTO | null>(null); 
  const { mutateAsync: updateStrategicOutput } = useUpdateStrategicOutput();
  const { mutateAsync: createStrategicOutput } = useCreateStrategicOutput();

  const [parentStrategicOutputId, setParentStrategicOutputId] = useState<number|null>(null);
  const [openMeasureModal, setOpenMeasureModal] = useState(false);
  const [editMeasure, setEditMeasure] = useState<UpdateMeasureDTO | null>(null);
  const { mutateAsync: createMeasure } = useCreateMeasure();
  const { mutateAsync: updateMeasure } = useUpdateMeasure();

  const [parentMeasureId, setParentMeasureId] = useState<number | null>(null);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const [editIndicator, setEditIndicator] = useState<UpdateIndicatorDTO | null>(null);


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


  const handleCreateStrategicOutput = async (node: TreeNode) => {
    setEditStrategicOutput(null);
    setParentKpaId(node.data?.id ?? null);
    setOpenStrategicOutputModal(true);
  }

  const handleEditStrategicOutput = (node: TreeNode) => {
    setOpenStrategicOutputModal(true);
    setParentKpaId(node.parent_id ?? null);
    const strategicOut = {
      id:node.data!.id!,
      name: node.label,
      country_kpa_id: node.parent_id!
    }
    setEditStrategicOutput(strategicOut);
    
  }

  const handleSubmitStrategicOutput = async (dto: any) => {
    if(editStrategicOutput) await updateStrategicOutput({id: editStrategicOutput.id, dto: dto});
    
    else{
      await createStrategicOutput(dto);
    }
    setOpenStrategicOutputModal(false);
    setEditStrategicOutput(null);
    setParentKpaId(null);

    if (refreshNode && parentKpaId !== null) {
    refreshNode(`ck-${parentKpaId}`);
    }
  }

  const handleCreateMeasure = async (node: TreeNode) => {
    setEditMeasure(null);
    setParentStrategicOutputId(node.data?.id ?? null);
    setOpenMeasureModal(true);
  }

  const handleEditMeasure = (node: TreeNode) => {
    setOpenMeasureModal(true);
    setParentStrategicOutputId(node.parent_id ?? null);
    const measure = {
      id: node.data!.id!,
      name: node.label,
      strategic_output_id: node.parent_id!
    }
    setEditMeasure(measure)
  }

  const handleSubmitMeasure = async (dto: any) => {
    if(editMeasure) await updateMeasure({ id: editMeasure.id, dto: dto });
    else{
      await createMeasure(dto);
    }

    setOpenMeasureModal(false);
    setEditMeasure(null);
    setParentStrategicOutputId(null);

    if (refreshNode && parentStrategicOutputId !== null) {
    refreshNode(`so-${parentStrategicOutputId}`);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="label-default">KPAs of {country?.name}</h1>

      {!isLoading && (
        <LazyTree value={initial} onRefreshNode={(fn) => setRefreshNode(() => fn)} selectionKey={selected} onSelectionChange={(key) => setSelected(key)} loadChildren={loadChildrenCountryKpaTree} 
          onAddStrategicOutput={handleCreateStrategicOutput} onEditStrategicOutput={handleEditStrategicOutput} 
          onAddMeasure={handleCreateMeasure} onEditMeasure={handleEditMeasure}

        />
      )}

      {parentKpaId !== null && (
        <CreateStrategicOutputModal open={openStrategicOutputModal} strategicOutput={editStrategicOutput} parentCountryKpaId={parentKpaId} onClose={()=> setOpenStrategicOutputModal(false)} onSubmit={handleSubmitStrategicOutput} />
      )}

      {parentStrategicOutputId !== null && (
        <CreateMeasureModal open={openMeasureModal} measure={editMeasure} parentStrategicOutputId={parentStrategicOutputId} onClose={() => setOpenMeasureModal(false)} onSubmit={handleSubmitMeasure}/>
      )}  


    </div>
  );
}
