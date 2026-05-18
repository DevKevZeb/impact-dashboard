import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function JoinRequestModal({ action, onSubmit, onClose, isLoading }: { action: string | null; onSubmit: (note?: string)=>void; onClose: ()=>void; isLoading?: boolean }) {
  const [note, setNote] = useState('');
  const labels: Record<string,string> = { approve: 'Approve', reject: 'Reject', revoke: 'Revoke' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold">{labels[action ?? 'approve']} Request</h3>
        <p className="text-sm text-muted mt-2">Add an optional note to include in the decision notification.</p>

        <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full mt-4 border rounded p-2" rows={4} />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onSubmit(note)} disabled={isLoading}>{isLoading ? 'Processing...' : labels[action ?? 'approve']}</Button>
        </div>
      </div>
    </div>
  );
}
