import { useAuthStore } from '@/features/auth/store/authStore';
import { ProjectManagerSection } from '../components/ProjectManagerSection';
import { CountryManagerSection } from '../components/CountryManagerSection';

export function CountryJoinRequestPage() {
  const user = useAuthStore((state) => state.user);
  const hasScope = useAuthStore((state) => state.hasScope);
  const roleNames = user?.roles?.map((role) => role.name) ?? [];
  // Strict role-only check for PM requests
  const canRequest = roleNames.includes('project-manager');
  const canReview = roleNames.includes('country-manager') || hasScope('country_join_requests:approve');

  return (
    <div className="space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Country Join Requests</h1>
        <p className="text-sm text-muted">
          PMs can request access to active countries. CMs review the incoming requests for their country.
        </p>
      </header>

      {canRequest && <ProjectManagerSection />}
      {canReview && <CountryManagerSection />}
    </div>
  );
}
