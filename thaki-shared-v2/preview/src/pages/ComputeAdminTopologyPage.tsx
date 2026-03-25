import { IconTopologyRing3 } from '@tabler/icons-react';

export function ComputeAdminTopologyPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-semibold leading-7 text-text">Network topology</h1>

      <div className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
        <IconTopologyRing3 size={48} stroke={1} className="text-text-muted" />
        <div className="flex flex-col gap-1">
          <span className="text-13 font-medium text-text">Network topology visualization</span>
          <span className="text-12 text-text-subtle max-w-md">
            An interactive graph of routers, networks, and subnets will appear here. D3 or similar
            rendering is not included in this preview.
          </span>
        </div>
      </div>
    </div>
  );
}
