import { useCountryJoinRequests } from '../hooks/useCountryJoinRequests';
import { JoinRequestCard } from './JoinRequestCard';

export function CountryManagerSection() {
  const { data, isLoading } = useCountryJoinRequests();
  const requests = data?.data?.requests ?? [];

  if (isLoading) return <div>Loading review queue...</div>;

  // Partition requests by requester role
  const adminRequests = requests.filter(
    (r) => r.requester_user_role?.role?.name === 'admin'
  );
  const pmRequests = requests.filter(
    (r) => r.requester_user_role?.role?.name === 'project-manager'
  );

  return (
    <div className="space-y-6">
      {/* Admins table */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Admins</h2>
          <p className="text-sm text-muted-foreground">Administrators for your country. Approve or revoke admin requests.</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-0 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground">No admin requests.</td>
                </tr>
              ) : (
                adminRequests.map((request) => (
                  <JoinRequestCard key={request.id} request={request} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Project Managers table */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Project Managers</h2>
          <p className="text-sm text-muted-foreground">Project managers requesting access. Approve or revoke memberships.</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-0 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pmRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground">No project manager requests.</td>
                </tr>
              ) : (
                pmRequests.map((request) => (
                  <JoinRequestCard key={request.id} request={request} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
