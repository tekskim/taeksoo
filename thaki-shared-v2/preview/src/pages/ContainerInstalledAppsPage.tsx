import { Badge } from '@shared/components/Badge';

interface InstalledApp {
  id: string;
  name: string;
  version: string;
  namespace: string;
  status: string;
  chart: string;
  updatedAt: string;
}

const installedApps: InstalledApp[] = [
  {
    id: '1',
    name: 'postgresql-primary',
    version: '16.2.0',
    namespace: 'default',
    status: 'Deployed',
    chart: 'postgresql-16.2.0',
    updatedAt: 'Mar 15, 2026 10:30:00',
  },
  {
    id: '2',
    name: 'nginx-ingress',
    version: '4.11.0',
    namespace: 'ingress-nginx',
    status: 'Deployed',
    chart: 'nginx-ingress-4.11.0',
    updatedAt: 'Mar 10, 2026 14:22:00',
  },
];

export function ContainerInstalledAppsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-sans text-20 font-semibold leading-28 text-text m-0">Installed Apps</h1>

      <div className="w-full border border-border rounded-base8 overflow-hidden">
        <table className="w-full border-collapse text-12 leading-4 font-sans">
          <thead>
            <tr className="bg-surface-muted">
              <th className="text-left px-3 py-2 font-medium text-text-muted border-b border-border">
                Status
              </th>
              <th className="text-left px-3 py-2 font-medium text-text-muted border-b border-border">
                Name
              </th>
              <th className="text-left px-3 py-2 font-medium text-text-muted border-b border-border">
                Chart
              </th>
              <th className="text-left px-3 py-2 font-medium text-text-muted border-b border-border">
                Version
              </th>
              <th className="text-left px-3 py-2 font-medium text-text-muted border-b border-border">
                Namespace
              </th>
              <th className="text-right px-3 py-2 font-medium text-text-muted border-b border-border">
                Updated at
              </th>
            </tr>
          </thead>
          <tbody>
            {installedApps.map((app) => (
              <tr key={app.id} className="hover:bg-surface-hover">
                <td className="px-3 py-2 border-b border-border">
                  <Badge theme="green" size="sm">
                    {app.status}
                  </Badge>
                </td>
                <td className="px-3 py-2 border-b border-border text-text">{app.name}</td>
                <td className="px-3 py-2 border-b border-border text-text">{app.chart}</td>
                <td className="px-3 py-2 border-b border-border text-text">{app.version}</td>
                <td className="px-3 py-2 border-b border-border text-text">{app.namespace}</td>
                <td className="px-3 py-2 border-b border-border text-text text-right">
                  {app.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
