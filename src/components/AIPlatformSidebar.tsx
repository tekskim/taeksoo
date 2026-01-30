import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconCompass,
  IconPackages,
  IconBrain,
  IconDatabase,
  IconTemplate,
  IconBox,
  IconBolt,
  IconMessageCircle,
  IconCode,
  IconRoute,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconList,
  IconActivity,
  IconGitBranch,
  IconUserCog,
  IconLayoutSidebar,
  IconArrowLeft,
} from '@tabler/icons-react';
import { RefreshCw, CircleGauge, BrainCircuit } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

/* ----------------------------------------
   AI Platform Sidebar Component
   ---------------------------------------- */

interface AIPlatformSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AIPlatformSidebar({ isOpen = true, onToggle }: AIPlatformSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();

  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages
    if (href !== '/ai-platform' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-8 px-3 flex items-center justify-between">
        <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-4" />
        <button
          type="button"
          onClick={onToggle}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar
            size={16}
            className="text-[var(--color-text-muted)] pointer-events-none"
            stroke={1.5}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 pb-6 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-body-sm transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
          >
            <IconArrowLeft size={16} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {/* Dashboard */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Dashboard"
            href="/ai-platform"
            active={isActive('/ai-platform')}
          />

          {/* Explore */}
          <MenuItem
            icon={<IconCompass size={16} stroke={1.5} />}
            label="Explore"
            href="/ai-platform/explore"
            active={isActive('/ai-platform/explore')}
          />

          {/* Hub Section */}
          <MenuSection title="Hub" defaultOpen={true}>
            <MenuItem
              icon={<IconPackages size={16} stroke={1.5} />}
              label="Packages"
              href="/ai-platform/packages"
              active={isActive('/ai-platform/packages')}
            />
            <MenuItem
              icon={<IconBrain size={16} stroke={1.5} />}
              label="Models"
              href="/ai-platform/models"
              active={isActive('/ai-platform/models')}
            />
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Datasets"
              href="/ai-platform/datasets"
              active={isActive('/ai-platform/datasets')}
            />
          </MenuSection>

          {/* Infrastructure Section */}
          <MenuSection title="Infrastructure" defaultOpen={true}>
            <MenuItem
              icon={<CircleGauge size={16} strokeWidth={1.5} />}
              label="Workloads"
              href="/ai-platform/workloads"
              active={isActive('/ai-platform/workloads')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="My templates"
              href="/ai-platform/my-templates"
              active={isActive('/ai-platform/my-templates')}
            />
            <MenuItem
              icon={<IconBox size={16} stroke={1.5} />}
              label="Storage"
              href="/ai-platform/storage"
              active={isActive('/ai-platform/storage')}
            />
            <MenuItem
              icon={<IconBolt size={16} stroke={1.5} />}
              label="Serverless"
              href="/ai-platform/serverless"
              active={isActive('/ai-platform/serverless')}
            />
          </MenuSection>

          {/* ML Studio Section */}
          <MenuSection title="ML Studio" defaultOpen={true}>
            <MenuItem
              icon={<IconMessageCircle size={16} stroke={1.5} />}
              label="Text generation"
              href="/ai-platform/text-generation"
              active={isActive('/ai-platform/text-generation')}
            />
          </MenuSection>

          {/* MLOps Section */}
          <MenuSection title="MLOps" defaultOpen={true}>
            <MenuItem
              icon={<IconCode size={16} stroke={1.5} />}
              label="DevSpace"
              href="/ai-platform/devspace"
              active={isActive('/ai-platform/devspace')}
            />
            <MenuItem
              icon={<IconRoute size={16} stroke={1.5} />}
              label="Pipeline builder"
              href="/ai-platform/pipeline-builder"
              active={isActive('/ai-platform/pipeline-builder')}
            />
            <MenuItem
              icon={<IconChartBar size={16} stroke={1.5} />}
              label="Benchmarks"
              href="/ai-platform/benchmarks"
              active={isActive('/ai-platform/benchmarks')}
            />
            <MenuItem
              icon={<BrainCircuit size={16} strokeWidth={1.5} />}
              label="Kubeflow"
              href="/ai-platform/kubeflow"
              active={isActive('/ai-platform/kubeflow')}
            />
            <MenuItem
              icon={<RefreshCw size={16} strokeWidth={1.5} />}
              label="MLflow"
              href="/ai-platform/mlflow"
              active={isActive('/ai-platform/mlflow')}
            />
          </MenuSection>

          {/* Settings Section */}
          <MenuSection title="Settings" defaultOpen={true}>
            <MenuItem
              icon={<IconSettings size={16} stroke={1.5} />}
              label="Settings"
              href="/ai-platform/settings"
              active={isActive('/ai-platform/settings')}
            />
            <MenuItem
              icon={<IconHelp size={16} stroke={1.5} />}
              label="FAQ"
              href="/ai-platform/faq"
              active={isActive('/ai-platform/faq')}
            />
          </MenuSection>

          {/* Operations Section */}
          <MenuSection title="Operations" defaultOpen={true}>
            <MenuItem
              icon={<IconList size={16} stroke={1.5} />}
              label="Kueue"
              href="/ai-platform/kueue"
              active={isActive('/ai-platform/kueue')}
            />
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Monitoring"
              href="/ai-platform/monitoring"
              active={isActive('/ai-platform/monitoring')}
            />
            <MenuItem
              icon={<IconGitBranch size={16} stroke={1.5} />}
              label="Dependencies"
              href="/ai-platform/dependencies"
              active={isActive('/ai-platform/dependencies')}
            />
            <MenuItem
              icon={<IconUserCog size={16} stroke={1.5} />}
              label="System administration"
              href="/ai-platform/system-admin"
              active={isActive('/ai-platform/system-admin')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default AIPlatformSidebar;
