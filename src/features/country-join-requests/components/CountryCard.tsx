import { Button } from '@/components/ui/button';
import type { Country } from '../types';
import { useSubmitJoinRequest } from '../hooks/useSubmitJoinRequest';
import type { JoinRequest } from '../types';
import {
  DataTableRow,
  DataTableCell,
} from "@/shared/components/table";

interface Props {
  country: Country;
  request?: JoinRequest;
  canJoin?: boolean;
}

export function CountryCard({ country, request, canJoin = true }: Props) {
  const mutation = useSubmitJoinRequest();
  const isPending = request?.status === 'pending';
  const isApproved = request?.status === 'approved';

  const handleRequest = () => {
    mutation.mutate(country.id);
  };

  return (
    <DataTableRow>
      <DataTableCell className="min-w-[220px] font-medium text-gray-900">{country.name}</DataTableCell>
      <DataTableCell className="min-w-[180px]">
        {isApproved ? (
          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
            Approved
          </span>
        ) : isPending ? (
          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            Request Send
          </span>
        ) : (
          <span
            className="inline-block"
            title={
              canJoin
                ? undefined
                : 'Your country dashboard must be confirmed before you can join other countries.'
            }
          >
            <Button onClick={handleRequest} disabled={!canJoin || mutation.isPending} size="sm">
              {mutation.isPending ? 'Sending...' : 'Join'}
            </Button>
          </span>
        )}
      </DataTableCell>
    </DataTableRow>
  );
}
