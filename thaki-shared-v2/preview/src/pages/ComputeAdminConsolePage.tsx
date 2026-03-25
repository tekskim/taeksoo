import { Link, useParams } from 'react-router-dom';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { IconArrowLeft } from '@tabler/icons-react';

const MOCK_NAME_BY_ID: Record<string, string> = {
  'i-7a3f9c2e': 'prod-api-01',
  'i-demo-001': 'demo-worker-a',
};

export function ComputeAdminConsolePage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const id = instanceId ?? 'unknown';
  const displayName = MOCK_NAME_BY_ID[id] ?? `instance-${id}`;

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/compute-admin/instances"
            className="inline-flex items-center gap-1 text-12 text-primary hover:underline shrink-0"
          >
            <IconArrowLeft size={14} stroke={1.5} />
            Back to instances
          </Link>
          <h1 className="text-[18px] font-semibold text-text truncate">{displayName}</h1>
          <span className="text-11 text-text-muted font-mono truncate">({id})</span>
        </div>
        <StatusIndicator variant="active" label="Connected" />
      </div>

      <div
        className="flex-1 min-h-[400px] rounded-lg bg-gray-900 text-green-400 font-mono text-12 p-4 overflow-auto border border-border"
        role="log"
        aria-live="polite"
      >
        <pre className="whitespace-pre-wrap m-0">
          {`[ok] Serial console session established
[${new Date().toISOString()}] guest login: 
Ubuntu 24.04.2 LTS ${displayName} ttyS0

${displayName} login: _
`}
        </pre>
      </div>
    </div>
  );
}
