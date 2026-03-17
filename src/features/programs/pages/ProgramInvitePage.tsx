import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Search, UserPlus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  useCancelProgramInvite,
  useCreateProgramInvite,
  useInviteCandidates,
  useProgram,
  useProgramAssignments,
  useProgramInvitesByOwner,
} from "../api/programQueries";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  TablePagination,
} from "@/shared/components/table";

export function ProgramInvitePage() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const numericProgramId = Number(programId ?? 0);

  const { hasCountryScope, countryUserRoleId } = useAuthStore();
  const { data: program, isLoading: isProgramLoading, error: programError } = useProgram(numericProgramId);
  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
  } = useProgramAssignments(countryUserRoleId, 1, 100);

  const ownerAssignment = useMemo(() => {
    return assignmentsData?.assignments.find((assignment) => assignment.program_id === numericProgramId) ?? null;
  }, [assignmentsData?.assignments, numericProgramId]);

  const canManageInvites = hasCountryScope && !!ownerAssignment;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const ownerAssignmentId = ownerAssignment?.id ?? 0;

  const { data: candidatesData, isLoading: isCandidatesLoading, isFetching: isCandidatesFetching } =
    useInviteCandidates(ownerAssignmentId, currentPage, perPage, debouncedSearch, canManageInvites);

  const { data: invitesData, isLoading: isInvitesLoading } =
    useProgramInvitesByOwner(ownerAssignmentId, canManageInvites);

  const createInvite = useCreateProgramInvite(ownerAssignmentId);
  const cancelInvite = useCancelProgramInvite(ownerAssignmentId);

  const invitesByUserRoleId = useMemo(() => {
    const map = new Map<number, number>();
    (invitesData ?? []).forEach((invite) => {
      map.set(invite.invited_user_role_id, invite.id);
    });
    return map;
  }, [invitesData]);

  const handleInviteToggle = (candidateUserRoleId: number) => {
    const existingInviteId = invitesByUserRoleId.get(candidateUserRoleId);

    if (existingInviteId) {
      cancelInvite.mutate(existingInviteId);
      return;
    }

    createInvite.mutate(candidateUserRoleId);
  };

  if (!numericProgramId || Number.isNaN(numericProgramId)) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600 font-medium">Invalid program identifier.</p>
        <Button variant="outline" onClick={() => navigate("/app/programs")}>Back to programs</Button>
      </div>
    );
  }

  if (isProgramLoading || (hasCountryScope && isAssignmentsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-600">Loading invitation workspace...</p>
        </div>
      </div>
    );
  }

  if (programError || !program) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600 font-medium">Could not load this program.</p>
        <Button variant="outline" onClick={() => navigate("/app/programs")}>Back to programs</Button>
      </div>
    );
  }

  if (assignmentsError) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600 font-medium">Could not validate owner context.</p>
        <Button variant="outline" onClick={() => navigate("/app/programs")}>Back to programs</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Invite Project Manager</h1>
          <p className="text-gray-500 mt-2">Program: {program.name}</p>
        </div>

        <Button variant="outline" onClick={() => navigate("/app/programs")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to programs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Project manager candidates
          </CardTitle>
          <CardDescription>
            Search by name or email, then invite or cancel an invitation directly from the table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!canManageInvites && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Only the program owner can invite project managers from this screen.
            </div>
          )}

          {canManageInvites && (
            <>
              <div className="relative max-w-md mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name or email"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {isCandidatesLoading || isInvitesLoading ? (
                <div className="text-center py-8 text-gray-600">Loading candidates...</div>
              ) : (
                <>
                  <DataTable>
                    <DataTableHeader>
                      <tr>
                        <DataTableHead>Name</DataTableHead>
                        <DataTableHead>Email</DataTableHead>
                        <DataTableHead>Agency</DataTableHead>
                        <DataTableHead>Actions</DataTableHead>
                      </tr>
                    </DataTableHeader>
                    <DataTableBody>
                      {(candidatesData?.candidates ?? []).length > 0 ? (
                        (candidatesData?.candidates ?? []).map((candidate) => {
                          const inviteId = invitesByUserRoleId.get(candidate.id);
                          const isInvited = !!inviteId;
                          const isBusy = createInvite.isPending || cancelInvite.isPending;

                          return (
                            <DataTableRow key={candidate.id}>
                              <DataTableCell className="font-medium text-gray-900">{candidate.name}</DataTableCell>
                              <DataTableCell>{candidate.email}</DataTableCell>
                              <DataTableCell>{candidate.agency?.name ?? "-"}</DataTableCell>
                              <DataTableCell>
                                <Button
                                  type="button"
                                  variant={isInvited ? "outline" : "default"}
                                  className={isInvited ? "border-red-200 text-red-600 hover:bg-red-50" : "btn-secondary"}
                                  onClick={() => handleInviteToggle(candidate.id)}
                                  disabled={isBusy}
                                >
                                  {isInvited ? (
                                    <>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Cancel invite
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Invite
                                    </>
                                  )}
                                </Button>
                              </DataTableCell>
                            </DataTableRow>
                          );
                        })
                      ) : (
                        <DataTableRow>
                          <td className="px-4 py-3 text-sm text-gray-500 text-center" colSpan={4}>
                            No candidates found.
                          </td>
                        </DataTableRow>
                      )}
                    </DataTableBody>
                  </DataTable>

                  {candidatesData?.pagination && (
                    <TablePagination
                      currentPage={candidatesData.pagination.current_page}
                      totalPages={candidatesData.pagination.last_page}
                      totalItems={candidatesData.pagination.total}
                      itemsPerPage={candidatesData.pagination.per_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}

              {isCandidatesFetching && (
                <p className="text-xs text-gray-500 mt-2">Refreshing list...</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
