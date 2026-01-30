import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Users as UsersIcon, Search } from "lucide-react";
import { useAllUsers, useChangeUserState } from "../api/userQueries";
import { ActiveUserTableRow } from "../components/ActiveUserTableRow";
import { ChangeStateDialog } from "../components/ChangeStateDialog";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableHead,
  TablePagination,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTableSort } from "@/shared/hooks/useTableSort";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "../types/user.types";

export function ActiveUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserForToggle, setSelectedUserForToggle] = useState<User | null>(null);
  const [isStateChangeDialogOpen, setIsStateChangeDialogOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data, isLoading, error } = useAllUsers(currentPage, perPage);
  const changeStateMutation = useChangeUserState();

  // Filter users: exclude admin role and apply filters
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];

    let users = data.users.filter((user) => {
      // Exclude admin role
      const hasAdminRole = user.roles.some(
        (role) => role.name.toLowerCase() === "admin"
      );
      if (hasAdminRole) return false;

      // Exclude pending state
      if (user.userState.name.toLowerCase() === "pending") return false;

      return true;
    });

    // Apply state filter
    if (stateFilter !== "all") {
      users = users.filter(
        (user) => user.userState.name.toLowerCase() === stateFilter
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      users = users.filter((user) =>
        user.roles.some((role) => role.name === roleFilter)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    return users;
  }, [data, stateFilter, roleFilter, searchTerm]);

  // Sorting on filtered data
  const { sortedData, sortConfig, requestSort } = useTableSort<User>(
    filteredUsers,
    "createdAt"
  );

  // Calculate stats
  const stats = useMemo(() => {
    if (!filteredUsers) return { active: 0, inactive: 0, total: 0 };

    return {
      total: filteredUsers.length,
      active: filteredUsers.filter(
        (u) => u.userState.name.toLowerCase() === "active"
      ).length,
      inactive: filteredUsers.filter(
        (u) => u.userState.name.toLowerCase() === "inactive"
      ).length,
    };
  }, [filteredUsers]);

  const handleToggleState = (user: User) => {
    setSelectedUserForToggle(user);
    setIsStateChangeDialogOpen(true);
  };

  const handleConfirmStateChange = () => {
    if (!selectedUserForToggle) return;

    const currentState = selectedUserForToggle.userState.name.toLowerCase();
    const newState = currentState === "active" ? "inactive" : "active";

    changeStateMutation.mutate(
      {
        userId: selectedUserForToggle.id,
        newState,
      },
      {
        onSuccess: () => {
          setIsStateChangeDialogOpen(false);
          setSelectedUserForToggle(null);
        },
      }
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStateFilterChange = (value: string) => {
    setStateFilter(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading users...</p>
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
            <h3 className="text-lg font-semibold text-gray-900">
              Error loading users
            </h3>
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
          <h1 className="page-title">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage all system users (excluding administrators)
          </p>
        </div>

        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            📋 View Pending Approvals
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1">Total Users</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-500 mt-1">🟢 Active</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {stats.inactive}
          </div>
          <div className="text-sm text-gray-500 mt-1">🔴 Inactive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* State Filter */}
        <div className="sm:col-span-3">
          <Select value={stateFilter} onValueChange={handleStateFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">🟢 Active</SelectItem>
              <SelectItem value="inactive">🔴 Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="sm:col-span-3">
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="project-manager">🏗️ Project Manager</SelectItem>
              <SelectItem value="country-manager">🌍 Country Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      {sortedData.length > 0 ? (
        <>
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead
                  className="w-16"
                  sortable
                  sortDirection={
                    sortConfig.key === "id" ? sortConfig.direction : null
                  }
                  onSort={() => requestSort("id")}
                >
                  #
                </DataTableHead>
                <DataTableHead
                  className="min-w-[180px]"
                  sortable
                  sortDirection={
                    sortConfig.key === "name" ? sortConfig.direction : null
                  }
                  onSort={() => requestSort("name")}
                >
                  Name
                </DataTableHead>
                <DataTableHead
                  className="min-w-[220px]"
                  sortable
                  sortDirection={
                    sortConfig.key === "email" ? sortConfig.direction : null
                  }
                  onSort={() => requestSort("email")}
                >
                  Email
                </DataTableHead>
                <DataTableHead className="min-w-[140px]">Role</DataTableHead>
                <DataTableHead className="w-32">Status</DataTableHead>
                <DataTableHead
                  className="min-w-[140px]"
                  sortable
                  sortDirection={
                    sortConfig.key === "createdAt"
                      ? sortConfig.direction
                      : null
                  }
                  onSort={() => requestSort("createdAt")}
                >
                  Registered
                </DataTableHead>
                <DataTableHead className="w-32">Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedData.map((user, idx) => (
                <ActiveUserTableRow
                  key={user.id}
                  user={user}
                  index={
                    (currentPage - 1) * perPage + idx + 1
                  }
                  onToggleState={handleToggleState}
                />
              ))}
            </DataTableBody>
          </DataTable>

          {data && data.pagination.last_page > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={data.pagination.last_page}
              onPageChange={setCurrentPage}
              totalItems={data.pagination.total}
              itemsPerPage={perPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description={
            searchTerm || stateFilter !== "all" || roleFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No registered users in the system yet"
          }
        />
      )}

      {/* State Change Confirmation Dialog */}
      <ChangeStateDialog
        user={selectedUserForToggle}
        isOpen={isStateChangeDialogOpen}
        onClose={() => {
          setIsStateChangeDialogOpen(false);
          setSelectedUserForToggle(null);
        }}
        onConfirm={handleConfirmStateChange}
        isLoading={changeStateMutation.isPending}
      />
    </div>
  );
}
