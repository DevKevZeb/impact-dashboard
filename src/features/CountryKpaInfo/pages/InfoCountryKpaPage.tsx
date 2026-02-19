import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import type { Indicator } from "@/features/indicator/types/indicatorTypes";
import CreateIndicatorModal from "@/features/indicator/components/CreateIndicatorModal";
import { useCreateIndicator } from "@/features/indicator/hooks/useCreateIndicator";
import { useUpdateIndicator } from "@/features/indicator/hooks/useUpdateIndicator";
import CountryKpasTable from "../components/CountryKpasTable";

export default function InfoCountryKpaPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { countryId } = useParams();
  const id = Number(countryId);

  const { data, isLoading } = useCountryKpas(id, page, perPage, true);

  const kpas = !Array.isArray(data) && data?.kpas ? data.kpas : [];
  const country = Array.isArray(data) ? undefined : data?.country;

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
  const [editIndicator, setEditIndicator] = useState<Indicator | null>(null);
  const {mutateAsync: createIndicator } = useCreateIndicator();
  const {mutateAsync: updateIndicator } = useUpdateIndicator(); 



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
          lazy: true,
          leaf: false,
          data: {
            type: "ck" as const,
            id: k.id_ck,
            count: k.strategic_outputs_count,
          },
        })),
      ],
    },
  ], [id, country, kpas ]);


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
    const parentKey = editStrategicOutput ? `ck-${editStrategicOutput.country_kpa_id}` : `ck-${dto.country_kpa_id}`;

    if(editStrategicOutput) await updateStrategicOutput({id: editStrategicOutput.id, dto: dto});
    else await createStrategicOutput(dto);
    
    setOpenStrategicOutputModal(false);
    setEditStrategicOutput(null);
    setParentKpaId(null);

    refreshNode?.(parentKey);

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
    const parentKey = editMeasure ? `so-${editMeasure.strategic_output_id}` : `so-${dto.strategic_output_id}`;

    if(editMeasure) await updateMeasure({ id: editMeasure.id, dto: dto });
    else await createMeasure(dto);
    

    setOpenMeasureModal(false);
    setEditMeasure(null);
    setParentStrategicOutputId(null);

    refreshNode?.(parentKey);
  }

  const handleCreateIndicator = async (node: TreeNode) => {
    setEditIndicator(null);
    setParentMeasureId(node?.data?.id ?? null);
    setOpenIndicatorModal(true);
  }

  const handleEditIndicator = (node: TreeNode) => {
    setOpenIndicatorModal(true);
    setParentMeasureId(node.parent_id ?? null);
    const indicator = {
      id: node.data!.id!,
      name: node.label,
      target: Number(node.meta!.target!),
      measure_id: node.parent_id!,
      type: {
        id: node.meta!.type_id!,
        name: node.meta!.type!,
      }
    }

    setEditIndicator(indicator);
  }

  const handleSubmitIndicator = async (dto: any) => {
    const parentKey = editIndicator ? `m-${editIndicator.measure_id}` : `m-${dto.measure_id}`;

    if(editIndicator) await updateIndicator({ id: editIndicator.id, dto: dto});
    else await createIndicator(dto);

    setOpenIndicatorModal(false);
    setEditIndicator(null);
    setParentMeasureId(null);
    refreshNode?.(parentKey);
  }


  return (
    <div className="p-6 space-y-4">
      <h1 className="label-default">Information about {country?.name}</h1>

      {!isLoading && (
        <>
          <LazyTree 
            value={initial} 
            onRefreshNode={(fn) => setRefreshNode(() => fn)} 
            selectionKey={selected} 
            onSelectionChange={(key) => setSelected(key)} 
            loadChildren={loadChildrenCountryKpaTree} 
            onAddStrategicOutput={handleCreateStrategicOutput} 
            onEditStrategicOutput={handleEditStrategicOutput} 
            onAddMeasure={handleCreateMeasure} 
            onEditMeasure={handleEditMeasure}
            onAddIndicator={handleCreateIndicator} 
            onEditIndicator={handleEditIndicator}
          />

          {data && !Array.isArray(data) && kpas.length > 0 && (
            <CountryKpasTable
              kpas={kpas}
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
              pagination={data.pagination}
            />
          )}
        </>
      )}

      {parentKpaId !== null && (
        <CreateStrategicOutputModal open={openStrategicOutputModal} strategicOutput={editStrategicOutput} parentCountryKpaId={parentKpaId} onClose={()=> setOpenStrategicOutputModal(false)} onSubmit={handleSubmitStrategicOutput} />
      )}

      {parentStrategicOutputId !== null && (
        <CreateMeasureModal open={openMeasureModal} measure={editMeasure} parentStrategicOutputId={parentStrategicOutputId} onClose={() => setOpenMeasureModal(false)} onSubmit={handleSubmitMeasure}/>
      )}  

      {parentMeasureId !== null && (
        <CreateIndicatorModal open={openIndicatorModal} indicator={editIndicator} parentMeasureId={parentMeasureId} onClose={() => setOpenIndicatorModal(false)} onSubmit={handleSubmitIndicator}/>
      )}

    </div>
  );
}
