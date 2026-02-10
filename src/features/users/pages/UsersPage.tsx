import { useState } from "react";
import { Loader2, Users as UsersIcon, Search } from "lucide-react";
import { usePendingUsers, useApproveUser, useRejectUser } from "../api/userQueries";
import { UserTableRow } from "../components/UserTableRow";
import { ApproveUserDialog } from "../components/ActivateUserDialog";
import { RejectUserDialog } from "../components/RejectUserDialog";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTableSort } from "@/shared/hooks/useTableSort";
import type { User } from "../types/user.types";

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { data, isLoading, error } = usePendingUsers(currentPage, perPage);
  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();

  // Sorting on current page data
  const { sortedData, sortConfig, requestSort } = useTableSort<User>(
    data?.users || [],
    "id"
  );

  const handleApprove = (user: User) => {
    setSelectedUser(user);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (user: User) => {
    setSelectedUser(user);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedUser) return;

    await approveMutation.mutateAsync(selectedUser.id);

    setIsApproveDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmReject = async () => {
    if (!selectedUser) return;

    await rejectMutation.mutateAsync(selectedUser.id);

    setIsRejectDialogOpen(false);
    setSelectedUser(null);
  };

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading pending users...</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Error loading users</h3>
            <p className="text-gray-500 mt-1">
              {error instanceof Error ? error.message : "Please try again"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Pending Users</h1>
          <p className="text-gray-500 mt-2">
            Review and activate user registrations awaiting approval
          </p>
        </div>

        {data && data.users.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-yellow-700 font-medium text-sm">
              {data.pagination.total} Pending
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Users List */}
      {data && data.users.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead
                  className="w-16"
                  sortable
                  sortDirection={sortConfig.key === "id" ? sortConfig.direction : null}
                  onSort={() => requestSort("id")}
                >
                  #
                </DataTableHead>
                <DataTableHead
                  className="min-w-[180px]"
                  sortable
                  sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                  onSort={() => requestSort("name")}
                >
                  Name
                </DataTableHead>
                <DataTableHead
                  className="min-w-[220px]"
                  sortable
                  sortDirection={sortConfig.key === "email" ? sortConfig.direction : null}
                  onSort={() => requestSort("email")}
                >
                  Email
                </DataTableHead>
                <DataTableHead className="min-w-[140px]">
                  Role
                </DataTableHead>
                <DataTableHead className="w-32">
                  State
                </DataTableHead>
                <DataTableHead
                  className="min-w-[140px]"
                  sortable
                  sortDirection={sortConfig.key === "createdAt" ? sortConfig.direction : null}
                  onSort={() => requestSort("createdAt")}
                >
                  Registered
                </DataTableHead>
                <DataTableHead className="w-48">
                  Actions
                </DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedData.map((user, index) => {
                const rowIndex = (data.pagination.current_page - 1) * data.pagination.per_page + index + 1;
                return (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={rowIndex}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                );
              })}
            </DataTableBody>
          </DataTable>

          {/* Pagination */}
          {data.pagination.last_page > 1 && (
            <TablePagination
              currentPage={data.pagination.current_page}
              totalPages={data.pagination.last_page}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.per_page}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={UsersIcon}
          title={searchTerm ? "No results found" : "No pending users"}
          description={
            searchTerm
              ? "Try another search term"
              : "All user registrations have been processed"
          }
        />
      )}

      {selectedUser && (
        <>
          <ApproveUserDialog
            user={selectedUser}
            open={isApproveDialogOpen}
            onOpenChange={setIsApproveDialogOpen}
            onConfirm={handleConfirmApprove}
            isLoading={approveMutation.isPending}
          />

          <RejectUserDialog
            user={selectedUser}
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
            onConfirm={handleConfirmReject}
            isLoading={rejectMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
