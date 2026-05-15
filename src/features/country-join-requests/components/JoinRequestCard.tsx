import { Button } from '@/components/ui/button';
import type { JoinRequest } from '../types';
import { useReviewJoinRequest } from '../hooks/useReviewJoinRequest';

export function JoinRequestCard({ request }: { request: JoinRequest }) {
  const mutation = useReviewJoinRequest();

  const reviewAction = request.status === 'approved' ? 'revoke' : 'approve';

  const handleReview = () => {
    mutation.mutate({ id: request.id, action: reviewAction });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    revoked: 'bg-gray-100 text-gray-800',
  };

  return (
    <tr className="border-b last:border-b-0 align-top">
      <td className="py-4 pr-4 font-medium">{request.requester_user_role?.user?.name ?? 'Unknown'}</td>
      <td className="py-4 pr-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[request.status]}`}>
          {request.status.toUpperCase()}
        </span>
      </td>
      <td className="py-4 pr-0">
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleReview}
            disabled={mutation.isPending}
            variant={request.status === 'approved' ? 'destructive' : 'default'}
          >
            {request.status === 'approved' ? 'Unapprove' : 'Approve'}
          </Button>
        </div>
      </td>
    </tr>
  );
}
