import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import { CreateAdminForm } from "../components/CreateAdminForm";
import { DeleteAdminDialog } from "../components/DeleteAdminDialog";
import { useAdminUsers, useDeleteAdminUser } from "../api/userQueries";
import type { User } from "../types/user.types";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { SCOPES } from "@/features/auth/utils/permissions";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { UserStatusBadge } from "../components/UserStatusBadge";

export function CreateAdminPage() {
    const canCreateAdmins = useHasScope(SCOPES.USERS_WRITE);
    const currentUserId = useAuthStore((state) => state.user?.id);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAdminToDelete, setSelectedAdminToDelete] = useState<User | null>(null);

    const { data, isLoading, error } = useAdminUsers(currentPage, perPage);
    const deleteAdminMutation = useDeleteAdminUser();

    const admins = useMemo(() => {
        if (!data?.users) return [];
        return data.users.filter((admin) => admin.id !== currentUserId);
    }, [data?.users, currentUserId]);

    const handleDeleteClick = (admin: User) => {
        if (admin.id === currentUserId) return;
        setSelectedAdminToDelete(admin);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAdminToDelete) return;
        await deleteAdminMutation.mutateAsync(selectedAdminToDelete.id);
        setSelectedAdminToDelete(null);
    };

    if (!canCreateAdmins) {
        return (
            <div className="p-6">
                <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6">
                    <div className="mb-3 flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        <h1 className="text-lg font-semibold">Access denied</h1>
                    </div>
                    <p className="text-sm text-amber-800">
                        You do not have permission to manage administrator accounts.
                    </p>
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <Link to="/app/admin/users/active">Back to user management</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="loader-default" />
                    <p className="text-gray-500">Loading administrator users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Error loading administrators</h3>
                        <p className="text-gray-500 mt-1">
                            {error instanceof Error ? error.message : "Please try again"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="page-title">Admin Management</h1>
                    <p className="mt-2 text-gray-500">
                        Register new administrators and manage active admin accounts.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Register Admin
                    </Button>
                </div>
            </div>

            {admins.length > 0 ? (
                <>
                    <DataTable>
                        <DataTableHeader>
                            <tr>
                                <DataTableHead className="w-16">#</DataTableHead>
                                <DataTableHead className="min-w-[180px]">Name</DataTableHead>
                                <DataTableHead className="min-w-[220px]">Email</DataTableHead>
                                <DataTableHead className="min-w-[160px]">Role</DataTableHead>
                                <DataTableHead className="w-32">State</DataTableHead>
                                <DataTableHead className="w-28">Actions</DataTableHead>
                            </tr>
                        </DataTableHeader>
                        <DataTableBody>
                            {admins.map((admin, index) => (
                                <DataTableRow key={admin.id}>
                                    <DataTableCell className="w-16 whitespace-nowrap">
                                        <span className="font-medium text-gray-900">
                                            {(currentPage - 1) * perPage + index + 1}
                                        </span>
                                    </DataTableCell>
                                    <DataTableCell className="min-w-[180px] whitespace-nowrap">
                                        <span className="font-medium text-gray-900">{admin.name}</span>
                                    </DataTableCell>
                                    <DataTableCell className="min-w-[220px] whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{admin.email}</span>
                                    </DataTableCell>
                                    <DataTableCell className="min-w-[160px]">
                                        <div className="flex flex-wrap gap-1">
                                            {admin.roles.map((role) => (
                                                <span
                                                    key={`${admin.id}-${role.id}`}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap"
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </DataTableCell>
                                    <DataTableCell className="w-32 whitespace-nowrap">
                                        <UserStatusBadge state={admin.userState.name} />
                                    </DataTableCell>
                                    <DataTableCell className="w-28 whitespace-nowrap">
                                        <button
                                            type="button"
                                            className="btn-delete-table"
                                            title="Delete admin"
                                            onClick={() => handleDeleteClick(admin)}
                                            disabled={deleteAdminMutation.isPending || admin.id === currentUserId}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>

                    {data && data.pagination.last_page > 1 ? (
                        <TablePagination
                            currentPage={data.pagination.current_page}
                            totalPages={data.pagination.last_page}
                            totalItems={data.pagination.total}
                            itemsPerPage={data.pagination.per_page}
                            onPageChange={setCurrentPage}
                        />
                    ) : null}
                </>
            ) : (
                <EmptyState
                    icon={AlertTriangle}
                    title="No admin users found"
                    description="Register a new administrator to get started"
                />
            )}

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Register administrator</DialogTitle>
                        <DialogDescription>
                            Create a new admin account with immediate active status.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateAdminForm
                        onSuccess={() => setIsCreateModalOpen(false)}
                        onCancel={() => setIsCreateModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {selectedAdminToDelete ? (
                <DeleteAdminDialog
                    admin={selectedAdminToDelete}
                    open={!!selectedAdminToDelete}
                    onOpenChange={(open) => {
                        if (!open) setSelectedAdminToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    isLoading={deleteAdminMutation.isPending}
                />
            ) : null}
        </div>
    );
}
