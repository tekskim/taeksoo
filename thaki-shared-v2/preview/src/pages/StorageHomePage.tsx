import { Title } from '@shared/components/Title';

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 min-w-[80px]">
      <span className="text-[20px] font-semibold leading-7" style={color ? { color } : undefined}>
        {value}
      </span>
      <span className="text-11 text-text-muted">{label}</span>
    </div>
  );
}

function ChartPlaceholder({ title, height = 180 }: { title: string; height?: number }) {
  return (
    <div
      className="rounded-lg border border-border bg-surface-subtle flex items-center justify-center"
      style={{ height }}
    >
      <span className="text-12 text-text-muted">{title}</span>
    </div>
  );
}

export function StorageHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Title title="Storage Dashboard" />

      <div className="grid grid-cols-2 gap-4">
        {/* Inventory Card */}
        <div className="rounded-lg border border-border bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-14 font-semibold text-text">Inventory</span>
            <span className="text-[24px] font-bold text-text">54</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <StatBox label="Pools" value={21} />
            <StatBox label="Hosts" value={6} />
            <StatBox label="OSDs" value={24} />
            <StatBox label="Buckets" value={3} />
            <StatBox label="Object" value={1} />
          </div>
        </div>

        {/* Capacity Card */}
        <div className="rounded-lg border border-border bg-surface p-5 flex flex-col gap-4">
          <span className="text-14 font-semibold text-text">Capacity</span>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-border-default, #e2e8f0)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-primary, #2563eb)"
                    strokeWidth="3"
                    strokeDasharray="26.19, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold text-text">26.19%</span>
                  <span className="text-11 text-text-muted">Used</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-12 text-text">
                  Used: <strong>49.7 TiB</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-border" />
                <span className="text-12 text-text">
                  Total: <strong>189.9 TiB</strong>
                </span>
              </div>
              <div className="text-11 text-text-muted">Available: 140.2 TiB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Utilization */}
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-14 font-semibold text-text">Cluster Utilization</span>
          <div className="flex items-center gap-2">
            <span className="text-11 text-text-muted">Last 30 minutes</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ChartPlaceholder title="IOPS (Reads / Writes)" height={200} />
          <ChartPlaceholder title="OSD Latencies (Apply / Commit)" height={200} />
          <ChartPlaceholder title="Client Throughput (R / W)" height={200} />
          <ChartPlaceholder title="Requests / sec" height={200} />
          <ChartPlaceholder title="Latency (GET / PUT)" height={200} />
          <ChartPlaceholder title="Recovery Throughput" height={200} />
        </div>
      </div>
    </div>
  );
}

export default StorageHomePage;
