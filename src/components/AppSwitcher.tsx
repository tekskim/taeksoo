import { useLocation } from 'react-router-dom';
import { IconLayoutSidebar } from '@tabler/icons-react';
import { useIsDesktopWindow, useDesktopWindowControls } from '@/contexts/DesktopWindowContext';

// App icons
import ComputeIcon from '@/assets/appIcon/compute.webp';
import ComputeAdminIcon from '@/assets/appIcon/computeadmin.webp';
import ContainerIcon from '@/assets/appIcon/container.webp';
import CloudBuilderIcon from '@/assets/appIcon/cloudbuilder.webp';
import AIPlatformIcon from '@/assets/appIcon/aiplatform.png';
import AgentOpsIcon from '@/assets/appIcon/agentops.webp';
import ServeIcon from '@/assets/appIcon/metis-serve.webp';
import MLStudioIcon from '@/assets/appIcon/metis-ml-studio.webp';
import RunIcon from '@/assets/appIcon/metis-run.webp';
import FabricIcon from '@/assets/appIcon/metis-fabric.webp';
import StorageIcon from '@/assets/appIcon/storage.webp';
import StorageAdminIcon from '@/assets/appIcon/storageadmin.webp';
import IAMIcon from '@/assets/appIcon/iam.webp';
import SecurityIcon from '@/assets/appIcon/security.webp';
import SettingsIcon from '@/assets/appIcon/settings.webp';
import AdminCenterIcon from '@/assets/appIcon/admincenter.png';

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
  { id: 'security', title: 'Security', icon: SecurityIcon, path: '/security' },
  { id: 'compute-admin', title: 'Compute', icon: ComputeAdminIcon, path: '/compute-admin' },
  { id: 'compute', title: 'Compute', icon: ComputeIcon, path: '/compute' },
  { id: 'storage-admin', title: 'Storage', icon: StorageAdminIcon, path: '/storage-admin' },
  {
    id: 'storage-system-admin',
    title: 'Storage',
    icon: StorageAdminIcon,
    path: '/storage',
  },
  {
    id: 'storage-domain-admin',
    title: 'Storage',
    icon: StorageAdminIcon,
    path: '/storage-domain-admin',
  },
  { id: 'storage-member', title: 'Storage', icon: StorageIcon, path: '/storage-member' },
  { id: 'container', title: 'Container', icon: ContainerIcon, path: '/container' },
  { id: 'ai-platform', title: 'AI Platform', icon: AIPlatformIcon, path: '/ai-platform' },
  { id: 'agent-ops', title: 'Agent Studio', icon: AgentOpsIcon, path: '/agent' },
  { id: 'serve', title: 'Serve', icon: ServeIcon, path: '/serve' },
  { id: 'ml-studio', title: 'ML Studio', icon: MLStudioIcon, path: '/ml-studio' },
  { id: 'run', title: 'Run', icon: RunIcon, path: '/run' },
  { id: 'fabric', title: 'Fabric', icon: FabricIcon, path: '/fabric' },
  { id: 'settings', title: 'Settings', icon: SettingsIcon, path: '/settings' },
  { id: 'cloud-builder', title: 'Cloud Builder', icon: CloudBuilderIcon, path: '/cloudbuilder' },
  { id: 'admin-center', title: 'Admin Center', icon: AdminCenterIcon, path: '/admin-center' },
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
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();

  // Determine current app from path if not provided
  const getCurrentApp = () => {
    if (currentAppId) {
      return apps.find((app) => app.id === currentAppId);
    }
    // Try to match by path
    const currentPath = location.pathname;
    return apps.find((app) => currentPath.startsWith(app.path));
  };

  const currentApp = getCurrentApp();

  return (
    <div
      className="h-10 px-3 flex items-center gap-2"
      onMouseDown={isDesktopWindow ? desktopControls?.onDragStart : undefined}
      onDoubleClick={isDesktopWindow ? desktopControls?.onDoubleClick : undefined}
    >
      {currentApp && (
        <>
          <img
            src={currentApp.icon}
            alt={currentApp.title}
            className="w-[24px] h-[24px] flex-shrink-0"
          />
          <span className="flex-1 text-label-lg leading-[20px] text-[var(--color-text-default)] truncate select-none">
            {currentApp.title}
          </span>
        </>
      )}
      {onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          onMouseDown={(e) => e.stopPropagation()}
          className="group p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar
            size={14}
            className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors pointer-events-none"
            stroke={1.5}
          />
        </button>
      )}
    </div>
  );
}

export default AppSwitcher;
