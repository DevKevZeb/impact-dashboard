import { useCallback, useMemo, useState } from "react";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHasAnyScope, useHasScope } from "@/features/auth/hooks/useHasScope";
import {
  useAssignPermissionToRole,
  usePermissions,
  useRemovePermissionFromRole,
  useRolePermissions,
  useRoles,
} from "../api/rolesPermissions.queries";

export function RolesPermissionsPage() {
  const canReadRoles = useHasAnyScope(["roles", "roles:write"]);
  const canWriteRoles = useHasScope("roles:write");

  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const rolesQuery = useRoles();
  const permissionsQuery = usePermissions();
  const rolePermissionsQuery = useRolePermissions(selectedRoleId);

  const assignMutation = useAssignPermissionToRole();
  const removeMutation = useRemovePermissionFromRole();

  useSyncOnChange(rolesQuery.data, (data) => {
    if (!selectedRoleId && data?.length) {
      setSelectedRoleId(data[0].id);
    }
  });

  const assignedPermissions = useMemo(() => rolePermissionsQuery.data ?? [], [rolePermissionsQuery.data]);
  const allPermissions = useMemo(() => permissionsQuery.data ?? [], [permissionsQuery.data]);

  const assignedIds = useMemo(
    () => new Set(assignedPermissions.map((p) => p.id)),
    [assignedPermissions]
  );

  const availablePermissions = useMemo(
    () => allPermissions.filter((p) => !assignedIds.has(p.id)),
    [allPermissions, assignedIds]
  );

  const modules = useMemo(() => {
    return Array.from(new Set(allPermissions.map((p) => p.module))).sort();
  }, [allPermissions]);

  const filterFn = useCallback(
    (permission: { name: string; module: string; description: string }) => {
      const term = searchTerm.trim().toLowerCase();
      const moduleMatches = moduleFilter === "all" || permission.module === moduleFilter;
      const textMatches =
        !term ||
        permission.name.toLowerCase().includes(term) ||
        permission.module.toLowerCase().includes(term) ||
        permission.description.toLowerCase().includes(term);
      return moduleMatches && textMatches;
    },
    [searchTerm, moduleFilter]
  );

  const filteredAssigned = useMemo(
    () => assignedPermissions.filter(filterFn),
    [assignedPermissions, filterFn]
  );

  const filteredAvailable = useMemo(
    () => availablePermissions.filter(filterFn),
    [availablePermissions, filterFn]
  );

  if (!canReadRoles) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto border border-amber-300 bg-amber-50 rounded-xl p-5 text-amber-900">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Access denied</h1>
          </div>
          <p className="text-sm">
            You need scope <strong>roles</strong> to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (rolesQuery.isLoading || permissionsQuery.isLoading || (selectedRoleId > 0 && rolePermissionsQuery.isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading roles and permissions...</p>
        </div>
      </div>
    );
  }

  if (rolesQuery.error || permissionsQuery.error || rolePermissionsQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Error loading roles and permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="page-title">Roles &amp; Permissions</h1>
        <p className="text-gray-500 mt-1">
          Assign or remove permissions for each role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-white space-y-3 min-h-[620px]">
          <h2 className="font-semibold text-slate-800">Role</h2>
          <Select
            value={selectedRoleId > 0 ? String(selectedRoleId) : undefined}
            onValueChange={(value) => setSelectedRoleId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-64 overflow-y-auto">
              {rolesQuery.data?.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2 pt-2">
            <label className="block text-sm text-gray-600">Search</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, module or description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Module</label>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-64 overflow-y-auto">
                <SelectItem value="all">All modules</SelectItem>
                {modules.map((moduleName) => (
                  <SelectItem key={moduleName} value={moduleName}>
                    {moduleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!canWriteRoles && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
              Read only mode. You need <strong>roles:write</strong> to assign/remove permissions.
            </p>
          )}
        </div>

        <div className="border rounded-xl p-4 bg-white lg:col-span-1 min-h-[620px]">
          <h2 className="font-semibold text-slate-800 mb-3">
            Assigned Permissions ({filteredAssigned.length})
          </h2>
          <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
            {filteredAssigned.length === 0 && (
              <p className="text-sm text-gray-500">No assigned permissions for this filter.</p>
            )}
            {filteredAssigned.map((permission) => (
              <div
                key={permission.id}
                className="border border-slate-200 rounded-lg p-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 break-all">{permission.name}</p>
                  <p className="text-xs text-slate-500">{permission.module}</p>
                  <p className="text-xs text-slate-600 mt-1">{permission.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!canWriteRoles || removeMutation.isPending}
                  onClick={() =>
                    removeMutation.mutate({ roleId: selectedRoleId, permissionId: permission.id })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-xl p-4 bg-white lg:col-span-1 min-h-[620px]">
          <h2 className="font-semibold text-slate-800 mb-3">
            Available Permissions ({filteredAvailable.length})
          </h2>
          <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
            {filteredAvailable.length === 0 && (
              <p className="text-sm text-gray-500">No available permissions for this filter.</p>
            )}
            {filteredAvailable.map((permission) => (
              <div
                key={permission.id}
                className="border border-slate-200 rounded-lg p-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 break-all">{permission.name}</p>
                  <p className="text-xs text-slate-500">{permission.module}</p>
                  <p className="text-xs text-slate-600 mt-1">{permission.description}</p>
                </div>
                <Button
                  size="sm"
                  className="btn-secondary"
                  disabled={!canWriteRoles || assignMutation.isPending}
                  onClick={() =>
                    assignMutation.mutate({ roleId: selectedRoleId, permissionId: permission.id })
                  }
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
