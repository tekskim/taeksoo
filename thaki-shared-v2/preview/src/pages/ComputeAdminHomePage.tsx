import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import {
  IconCube,
  IconTemplate,
  IconDisc,
  IconCpu,
  IconDatabase,
  IconNetwork,
  IconShieldLock,
  IconActivity,
  IconTopologyRing3,
} from '@tabler/icons-react';

const overviewStats = [
  { value: '1,248', label: 'Total Instances' },
  { value: '1,102', label: 'Running Instances' },
  { value: '14', label: 'Error Instances' },
  { value: '9,420', label: 'Total vCPUs' },
  { value: '42.8 TiB', label: 'Total RAM' },
  { value: '3,891', label: 'Total Volumes' },
] as const;

const quickLinks = [
  { to: '/compute-admin/instances', label: 'Instances', icon: IconCube },
  { to: '/compute-admin/instance-templates', label: 'Instance templates', icon: IconTemplate },
  { to: '/compute-admin/images', label: 'Images', icon: IconDisc },
  { to: '/compute-admin/flavors', label: 'Flavors', icon: IconCpu },
  { to: '/compute-admin/volumes', label: 'Volumes', icon: IconDatabase },
  { to: '/compute-admin/networks', label: 'Networks', icon: IconNetwork },
  { to: '/compute-admin/security-groups', label: 'Security groups', icon: IconShieldLock },
  { to: '/compute-admin/monitor-overview', label: 'Monitor overview', icon: IconActivity },
  { to: '/compute-admin/topology', label: 'Network topology', icon: IconTopologyRing3 },
] as const;

export function ComputeAdminHomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[20px] font-semibold leading-7 text-text">Compute Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewStats.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-1"
          >
            <div className="text-[24px] font-semibold leading-8 text-text">{card.value}</div>
            <div className="text-11 leading-4 text-text-subtle">{card.label}</div>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-13 font-medium text-text">Quick links</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              variant="secondary"
              appearance="outline"
              size="sm"
              type="button"
              onClick={() => navigate(to)}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon size={14} stroke={1.5} />
                {label}
              </span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
