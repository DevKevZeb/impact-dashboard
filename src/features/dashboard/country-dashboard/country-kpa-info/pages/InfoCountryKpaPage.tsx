import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LazyTree } from "../components/TreeNode/Tree";
import { loadChildrenCountryKpaTree } from "../components/TreeNode/loadChildrenCountryKpaTree";

import { Globe2, Flag, AlertCircle } from "lucide-react";
import type { TreeNode } from "../components/TreeNode/TreeType";
import CreateStrategicOutputModal from "@/features/strategic-output/components/CreateStrategicOutputModal";
import type {  UpdateStrategicOutputDTO } from "@/features/strategic-output/types/StrategicOutput";
import { useUpdateStrategicOutput } from "@/features/strategic-output/hooks/useUpdateStrategicOutput";
import { useCreateStrategicOutput } from "@/features/strategic-output/hooks/useCreateStrategicOutput";
import { useDeleteStrategicOutput } from "@/features/strategic-output/hooks/useDeleteStrategicOutput";
import { DeleteStrategicOutputDialog } from "@/features/strategic-output/components/DeleteStrategicOutputDialog";
import type { UpdateMeasureDTO } from "@/features/measures/types/measureTypes";
import { useCreateMeasure } from "@/features/measures/hooks/useCreateMeasure";
import { useUpdateMeasure } from "@/features/measures/hooks/useUpdateMeasure";
import { useDeleteMeasure } from "@/features/measures/hooks/useDeleteMeasure";
import CreateMeasureModal from "@/features/measures/components/CreateMeasureModal";
import { DeleteMeasureDialog } from "@/features/measures/components/DeleteMeasureDialog";
import type { Indicator } from "@/features/indicator/types/indicatorTypes";
import CreateIndicatorModal from "@/features/indicator/components/CreateIndicatorModal";
import { DeleteIndicatorDialog } from "@/features/indicator/components/DeleteIndicatorDialog";
import { useCreateIndicator } from "@/features/indicator/hooks/useCreateIndicator";
import { useUpdateIndicator } from "@/features/indicator/hooks/useUpdateIndicator";
import { useDeleteIndicator } from "@/features/indicator/hooks/useDeleteIndicator";
import CountryKpasTable from "../components/CountryKpasTable";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { handleExportExcel } from "../utils/csvKPAsSaver";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCountryKpas } from "../../country-kpa/hooks/useCountryKpas";
import { useActivateCountry } from "@/features/country/hooks/country/useActivateCountry";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import { Snowflake } from "lucide-react";

export default function InfoCountryKpaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Verify if user is admin
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin') ?? false;
  const userCountryId = user?.country_user_role?.country?.id;

  const [tablePage, setTablePage] = useState(1);
  const [tablePerPage, setTablePerPage] = useState(10);

  const { countryId } = useParams();
  const id = Number(countryId);

  // Check if user has access to this country
  const hasAccess = isAdmin || (userCountryId === id);
  
  // Early return if non-admin user tries to access a different country
  const [accessDenied, setAccessDenied] = useState(false);
  useEffect(() => {
    if (!hasAccess && userCountryId) {
      setAccessDenied(true);
    }
  }, [hasAccess, userCountryId]);

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-600 font-medium">Access Denied</p>
          <p className="text-sm text-gray-600">You don't have permission to access this country</p>
          <button
            onClick={() => {
              if (userCountryId) {
                navigate(`/app/country-kpa/${userCountryId}`);
              } else {
                navigate('/app');
              }
            }}
            className="text-blue-600 hover:underline text-sm mt-4"
          >
            Go to your country
          </button>
        </div>
      </div>
    );
  }

  // Only fetch data if user has access
  const { data, isLoading, refetch: refetchTree } = useCountryKpas(id, 1, -1, hasAccess);
  const { data: dataTable, isLoading: isLoadingTable, refetch } = useCountryKpas(id, tablePage, tablePerPage, hasAccess);

  const kpasTable = !Array.isArray(dataTable) && dataTable?.kpas ? dataTable.kpas : [];
  const kpas = !Array.isArray(data) && data?.kpas ? data.kpas : [];
  const country = Array.isArray(data) ? undefined : data?.country;

  const [selected, setSelected] = useState<string | null>(null);
  const [refreshNode, setRefreshNode] = useState<((key: string) => Promise<void>) | null>(null);

  const handleRegisterRefreshNode = useCallback((fn: (key: string) => Promise<void>) => {
    setRefreshNode(() => fn);
  }, []);

  const [parentKpaId, setParentKpaId] = useState<number|null>(null);
  const [openStrategicOutputModal, setOpenStrategicOutputModal] = useState(false);
  const [editStrategicOutput, setEditStrategicOutput] = useState<UpdateStrategicOutputDTO | null>(null); 
  const { mutateAsync: updateStrategicOutput } = useUpdateStrategicOutput();
  const { mutateAsync: createStrategicOutput } = useCreateStrategicOutput();
  const [strategicOutputToDelete, setStrategicOutputToDelete] = useState<{ id: number; name: string; countryKpaId: number } | null>(null);
  const { mutateAsync: deleteStrategicOutputMutation, isPending: isDeletingStrategicOutput } = useDeleteStrategicOutput();

  const [parentStrategicOutputId, setParentStrategicOutputId] = useState<number|null>(null);
  const [openMeasureModal, setOpenMeasureModal] = useState(false);
  const [editMeasure, setEditMeasure] = useState<UpdateMeasureDTO | null>(null);
  const { mutateAsync: createMeasure } = useCreateMeasure();
  const { mutateAsync: updateMeasure } = useUpdateMeasure();
  const [measureToDelete, setMeasureToDelete] = useState<{ id: number; name: string; strategicOutputId: number } | null>(null);
  const { mutateAsync: deleteMeasureMutation, isPending: isDeletingMeasure } = useDeleteMeasure();

  const [parentMeasureId, setParentMeasureId] = useState<number | null>(null);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const [editIndicator, setEditIndicator] = useState<Indicator | null>(null);
  const {mutateAsync: createIndicator } = useCreateIndicator();
  const {mutateAsync: updateIndicator } = useUpdateIndicator();

  const [indicatorToDelete, setIndicatorToDelete] = useState<{ id: number; name: string; measureId: number } | null>(null);
  const { mutateAsync: deleteIndicatorMutation, isPending: isDeletingIndicator } = useDeleteIndicator(indicatorToDelete?.measureId);

<<<<<<< issue/PEI-91
  const { mutateAsync: activateCountryMutation, isPending: isActivating } = useActivateCountry();
=======
  const { mutateAsync: activateCountryMutation } = useActivateCountry();
>>>>>>> develop
  const { user: storeUser, setUser } = useAuthStore();

  const [freezeConfirmOpen, setFreezeConfirmOpen] = useState(false);

  const handleFreezeCountry = () => {
    setFreezeConfirmOpen(true);
  };

  const handleConfirmFreeze = async () => {
    await activateCountryMutation(id);
    // Update auth store so isCountryActive reflects immediately across all views
    if (storeUser?.country_user_role?.country) {
      setUser({
        ...storeUser,
        country_user_role: {
          ...storeUser.country_user_role,
          country: {
            ...storeUser.country_user_role.country,
            active: true,
          },
        },
      });
    }
<<<<<<< issue/PEI-91
    setFreezeConfirmOpen(false);
=======
>>>>>>> develop
    await refetchTree();
    await refetch();
  };

  const initial = useMemo<TreeNode[]>(() => {
    if (!country || !kpas) return [];
    return [
      {
        key: `country-${id}`,
        label: country.name ?? `Country #${id}`,
        icon: <Globe2 className="w-4 h-4 text-emerald-700" />,
        lazy: false,
        data: { type: "country", id, count: kpas.length },
        children: [
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
    ];
  }, [id, country, kpas]);


  const handleCreateStrategicOutput = async (node: TreeNode) => {
    setEditStrategicOutput(null);
    setParentKpaId((node.data as any)?.id ?? null);
    setOpenStrategicOutputModal(true);
  }

  const handleEditStrategicOutput = (node: TreeNode) => {
    setOpenStrategicOutputModal(true);
    setParentKpaId(node.parent_id ?? null);
    const strategicOut = {
      id: (node.data as any)?.id!,
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
    await refetch();

  }

  const handleDeleteStrategicOutput = (node: any) => {
    setStrategicOutputToDelete({
      id: (node.data as any)?.id,
      name: node.label,
      countryKpaId: node.parent_id ?? 0,
    });
  };

  const handleConfirmDeleteStrategicOutput = async () => {
    if (!strategicOutputToDelete) return;
    await deleteStrategicOutputMutation(strategicOutputToDelete.id);
    refreshNode?.(`ck-${strategicOutputToDelete.countryKpaId}`);
    setStrategicOutputToDelete(null);
    await refetch();
  };

  const handleCreateMeasure = async (node: TreeNode) => {
    setEditMeasure(null);
    setParentStrategicOutputId((node.data as any)?.id ?? null);
    setOpenMeasureModal(true);
  }

  const handleEditMeasure = (node: TreeNode) => {
    setOpenMeasureModal(true);
    setParentStrategicOutputId(node.parent_id ?? null);
    const measure = {
      id: (node.data as any)?.id!,
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
    await refetch();
  }

  const handleCreateIndicator = async (node: TreeNode) => {
    setEditIndicator(null);
    setParentMeasureId((node.data as any)?.id ?? null);
    setOpenIndicatorModal(true);
  }

  const handleEditIndicator = (node: TreeNode) => {
    setOpenIndicatorModal(true);
    setParentMeasureId(node.parent_id ?? null);
    const indicator = {
      id: (node.data as any)?.id!,
      name: node.label,
      target: Number(node.meta!.target!),
      actual_value: node.meta!.actual_value ?? 0,
      measure_id: node.parent_id!,
      type: {
        id: node.meta!.type_id!,
        name: node.meta!.type!,
        is_bottom_up: node.meta!.is_bottom_up ?? true,
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
    await refetch();
  }

  const handleDeleteMeasure = (node: any) => {
    setMeasureToDelete({
      id: (node.data as any)?.id,
      name: node.label,
      strategicOutputId: node.parent_id ?? 0,
    });
  };

  const handleConfirmDeleteMeasure = async () => {
    if (!measureToDelete) return;
    await deleteMeasureMutation(measureToDelete.id);
    refreshNode?.(`so-${measureToDelete.strategicOutputId}`);
    setMeasureToDelete(null);
    await refetch();
  };

  const handleDeleteIndicator = (node: any) => {
    setIndicatorToDelete({
      id: (node.data as any)?.id,
      name: node.label,
      measureId: node.parent_id ?? 0,
    });
  };

  const handleConfirmDeleteIndicator = async () => {
    if (!indicatorToDelete) return;
    await deleteIndicatorMutation(indicatorToDelete.id);
    refreshNode?.(`m-${indicatorToDelete.measureId}`);
    setIndicatorToDelete(null);
    await refetch();
  };


  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="label-default">
            Information about {country?.name}
          </h1>

          <p className="text-sm text-slate-500">
            This view allows you to manage KPAs, Strategic Outputs,
            Measures and Indicators of {country?.name}.
          </p>
        </div>
        <button onClick={async () => { await refetchTree(); handleExportExcel(data, country);}} className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition" >
          <div className="flex items-center space-x-2">
            <span>Export KPAs</span>
          <span>(CSV detail)</span>
          </div>
        </button>
      </div>


      {!isLoading && (
        <>
          <LazyTree 
            value={initial} 
            onRefreshNode={handleRegisterRefreshNode}
            selectionKey={selected} 
            onSelectionChange={(key) => setSelected(key)} 
            loadChildren={loadChildrenCountryKpaTree} 
            countryActive={country?.active ?? false}
            onFreezeCountry={handleFreezeCountry}
            onAddStrategicOutput={handleCreateStrategicOutput} 
            onEditStrategicOutput={handleEditStrategicOutput}
            onDeleteStrategicOutput={handleDeleteStrategicOutput} 
            onAddMeasure={handleCreateMeasure} 
            onEditMeasure={handleEditMeasure}
            onAddIndicator={handleCreateIndicator} 
            onEditIndicator={handleEditIndicator}
            onDeleteIndicator={handleDeleteIndicator}
            onDeleteMeasure={handleDeleteMeasure}
          />
        </>
      )}

      {!isLoadingTable ? dataTable && !Array.isArray(dataTable) && kpasTable.length > 0 && (
        <CountryKpasTable
          kpas={kpasTable}
          page={tablePage}
          setPage={setTablePage}
          perPage={tablePerPage}
          setPerPage={setTablePerPage}
          pagination={dataTable?.pagination}
        />
      ) : <TableSkeleton columns={7}/>}

      {parentKpaId !== null && (
        <CreateStrategicOutputModal open={openStrategicOutputModal} strategicOutput={editStrategicOutput} parentCountryKpaId={parentKpaId} onClose={()=> setOpenStrategicOutputModal(false)} onSubmit={handleSubmitStrategicOutput} />
      )}

      {parentStrategicOutputId !== null && (
        <CreateMeasureModal open={openMeasureModal} measure={editMeasure} parentStrategicOutputId={parentStrategicOutputId} onClose={() => setOpenMeasureModal(false)} onSubmit={handleSubmitMeasure}/>
      )}  

      {parentMeasureId !== null && (
        <CreateIndicatorModal open={openIndicatorModal} indicator={editIndicator} parentMeasureId={parentMeasureId} onClose={() => setOpenIndicatorModal(false)} onSubmit={handleSubmitIndicator} disableTypeChange={country?.active ?? false}/>
      )}

      <DeleteIndicatorDialog indicatorName={indicatorToDelete?.name ?? ""} open={!!indicatorToDelete} onOpenChange={(open) => { if (!open) setIndicatorToDelete(null); }} onConfirm={handleConfirmDeleteIndicator} isLoading={isDeletingIndicator} />
      <DeleteMeasureDialog measureName={measureToDelete?.name ?? ""} open={!!measureToDelete} onOpenChange={(open) => { if (!open) setMeasureToDelete(null); }} onConfirm={handleConfirmDeleteMeasure} isLoading={isDeletingMeasure} />
      <DeleteStrategicOutputDialog strategicOutputName={strategicOutputToDelete?.name ?? ""} open={!!strategicOutputToDelete} onOpenChange={(open) => { if (!open) setStrategicOutputToDelete(null); }} onConfirm={handleConfirmDeleteStrategicOutput} isLoading={isDeletingStrategicOutput} />

      <ConfirmationDialog
        open={freezeConfirmOpen}
        onOpenChange={setFreezeConfirmOpen}
        onConfirm={handleConfirmFreeze}
        isLoading={isActivating}
        title="Freeze Country"
        description={
          <span>
            Are you sure you want to freeze <strong>{country?.name}</strong>? Once active, you will not be able to add, edit or delete strategic outputs, measures or indicators.
          </span>
        }
        confirmText="Freeze"
        cancelText="Cancel"
        variant="warning"
        icon={Snowflake}
      />

    </div>
  );
}
