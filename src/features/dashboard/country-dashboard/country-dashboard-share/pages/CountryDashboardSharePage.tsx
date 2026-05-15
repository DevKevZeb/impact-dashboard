import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/shared/components/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  useCountryDashboardShareAdminCandidates,
  useCreateCountryDashboardShare,
  useDeleteCountryDashboardShare,
  useMyCountryDashboardShares,
} from "../api/countryDashboardShare.queries";
import { useCountryJoinRequests } from "@/features/country-join-requests/hooks/useCountryJoinRequests";
import { useReviewJoinRequest } from "@/features/country-join-requests/hooks/useReviewJoinRequest";

export default function CountryDashboardSharePage() {
  const user = useAuthStore((state) => state.user);
  const isCountryManager = (user?.roles ?? []).some((r) => r.name === "country-manager");
  const countryId = user?.country_user_role?.country?.id;

  const {
    data: adminsData,
    isLoading: isLoadingAdmins,
    error: adminsError,
  } = useCountryDashboardShareAdminCandidates(1, 100);
  const { data: mySharesData, isLoading: isLoadingShares } = useMyCountryDashboardShares(1, 200);
  const { data: joinRequestsData, isLoading: isLoadingPMs } = useCountryJoinRequests();

  const createShareMutation = useCreateCountryDashboardShare();
  const deleteShareMutation = useDeleteCountryDashboardShare();
  const reviewMutation = useReviewJoinRequest();

  const approvedByAdminUserId = useMemo(() => {
    const map = new Map<number, number>();
    (mySharesData?.shares ?? []).forEach((share) => {
      const adminUserId = share.shared_user_role?.user?.id;
      if (adminUserId) {
        map.set(adminUserId, share.id);
      }
    });
    return map;
  }, [mySharesData]);

  // Filter PM requests for this country
  const pmRequests = useMemo(() => {
    return (joinRequestsData?.data?.requests ?? []).filter(
      (r) => r.country_id === countryId && r.requester_user_role?.role?.name === 'project-manager'
    );
  }, [joinRequestsData, countryId]);

  if (!isCountryManager) {
    return <Navigate to="/app" replace />;
  }

  if (!countryId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={Share2}
          title="Country not assigned"
          description="Your account needs an assigned country before sharing the dashboard."
        />
      </div>
    );
  }

  if (isLoadingAdmins || isLoadingShares || isLoadingPMs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (adminsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-600 font-medium">Failed to load administrators</p>
          <p className="text-sm text-gray-600">
            {(adminsError as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              "Please try again in a moment."}
          </p>
        </div>
      </div>
    );
  }

  const admins = adminsData?.users ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="page-title">Manage Users</h1>
        <p className="mt-2 text-gray-500">
          Approve or revoke administrator and project manager access to your country.
        </p>
      </div>

      {/* Admins Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Admins</h2>
        {admins.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No administrators found"
            description="There are no administrator accounts available to share with."
          />
        ) : (
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead className="min-w-[220px]">Name</DataTableHead>
                <DataTableHead className="min-w-[200px]">Status</DataTableHead>
                <DataTableHead className="min-w-[180px]">Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {admins.map((admin) => {
                const shareId = approvedByAdminUserId.get(admin.id);
                const isApproved = !!shareId;

                return (
                  <DataTableRow key={admin.id}>
                    <DataTableCell className="font-medium text-gray-900">{admin.name}</DataTableCell>
                    <DataTableCell>
                      <span className={isApproved ? "text-green-700 font-medium" : "text-amber-700 font-medium"}>
                        {isApproved ? "Approved" : "Pending"}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      {isApproved ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deleteShareMutation.isPending}
                          onClick={() => {
                            if (shareId) {
                              deleteShareMutation.mutate(shareId);
                            }
                          }}
                        >
                          Unapprove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={createShareMutation.isPending || !admin.userRoleId}
                          onClick={() => {
                            if (!admin.userRoleId) return;
                            createShareMutation.mutate({
                              country_id: countryId,
                              shared_user_role_id: admin.userRoleId,
                            });
                          }}
                        >
                          Approve
                        </Button>
                      )}
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTable>
        )}
      </div>

      {/* Project Managers Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Project Managers</h2>
        {pmRequests.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No project manager requests"
            description="No project managers have requested access to your country."
          />
        ) : (
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead className="min-w-[220px]">Name</DataTableHead>
                <DataTableHead className="min-w-[200px]">Status</DataTableHead>
                <DataTableHead className="min-w-[180px]">Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {pmRequests.map((request) => {
                const isApproved = request.status === 'approved';
                const statusColors: Record<string, string> = {
                  pending: 'text-amber-700 font-medium',
                  approved: 'text-green-700 font-medium',
                  revoked: 'text-gray-700 font-medium',
                };

                return (
                  <DataTableRow key={request.id}>
                    <DataTableCell className="font-medium text-gray-900">
                      {request.requester_user_role?.user?.name ?? 'Unknown'}
                    </DataTableCell>
                    <DataTableCell>
                      <span className={statusColors[request.status]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      {isApproved ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={reviewMutation.isPending}
                          onClick={() => {
                            reviewMutation.mutate({ id: request.id, action: 'revoke' });
                          }}
                        >
                          Unapprove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={reviewMutation.isPending}
                          onClick={() => {
                            reviewMutation.mutate({ id: request.id, action: 'approve' });
                          }}
                        >
                          Approve
                        </Button>
                      )}
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTable>
        )}
      </div>
    </div>
  );
}
