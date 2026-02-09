import { useLocation } from 'react-router-dom';
import { IconLayoutSidebar } from '@tabler/icons-react';

// App icons
import ComputeIcon from '@/assets/appIcon/compute.png';
import ComputeAdminIcon from '@/assets/appIcon/computeadmin.png';
import ContainerIcon from '@/assets/appIcon/container.png';
import CloudBuilderIcon from '@/assets/appIcon/cloudbuilder.png';
import AIPlatformIcon from '@/assets/appIcon/aiplatform.png';
import AgentOpsIcon from '@/assets/appIcon/agentops.png';
import StorageIcon from '@/assets/appIcon/storage.png';
import IAMIcon from '@/assets/appIcon/iam.png';
import SettingsIcon from '@/assets/appIcon/settings.png';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AppItem {
  id: string;
  title: string;
  icon: string;
  path: string;
}

/* ----------------------------------------
   Apps Data
   ---------------------------------------- */

// Order matters for path matching - more specific paths should come first
const apps: AppItem[] = [
  { id: 'iam', title: 'IAM', icon: IAMIcon, path: '/iam' },
  { id: 'compute-admin', title: 'Compute Admin', icon: ComputeAdminIcon, path: '/compute-admin' },
  { id: 'compute', title: 'Compute', icon: ComputeIcon, path: '/compute' },
  { id: 'storage', title: 'Storage', icon: StorageIcon, path: '/storage' },
  { id: 'container', title: 'Container', icon: ContainerIcon, path: '/container' },
  { id: 'ai-platform', title: 'AI Platform', icon: AIPlatformIcon, path: '/ai-platform' },
  { id: 'agent-ops', title: 'Agent Ops', icon: AgentOpsIcon, path: '/agent' },
  { id: 'settings', title: 'Settings', icon: SettingsIcon, path: '/settings' },
  { id: 'cloud-builder', title: 'Cloud Builder', icon: CloudBuilderIcon, path: '/cloudbuilder' },
];

/* ----------------------------------------
   AppSwitcher Component
   ---------------------------------------- */

interface AppSwitcherProps {
  currentAppId?: string;
  onToggleSidebar?: () => void;
}

export function AppSwitcher({ currentAppId, onToggleSidebar }: AppSwitcherProps) {
  const location = useLocation();

  // Determine current app from path if not provided
  const getCurrentApp = () => {
    if (currentAppId) {
      return apps.find((app) => app.id === currentAppId);
    }
    // Try to match by path
    const currentPath = location.pathname;
    return apps.find((app) => currentPath.startsWith(app.path)) || apps[0];
  };

  const currentApp = getCurrentApp();

  return (
    <div className="h-10 px-3 flex items-center gap-2">
      {currentApp && (
        <>
          <img
            src={currentApp.icon}
            alt={currentApp.title}
            className="w-[24px] h-[24px] flex-shrink-0"
          />
          <span className="flex-1 text-label-lg leading-[20px] text-[var(--color-text-default)] truncate">
            {currentApp.title}
          </span>
        </>
      )}
      {onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar
            size={14}
            className="text-[var(--color-text-muted)] pointer-events-none"
            stroke={1.5}
          />
        </button>
      )}
    </div>
  );
}

export default AppSwitcher;
