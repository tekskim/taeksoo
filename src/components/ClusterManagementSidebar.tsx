import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  VStack,
  MenuItem,
  MenuSection,
  Drawer,
  Button,
  HStack,
  FormField,
  Input,
} from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconAffiliate,
  IconPlus,
  IconChevronDown,
  IconLayoutSidebar,
} from '@tabler/icons-react';
import { FolderCog } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import containerIcon from '@/assets/appIcon/container.png';

/* ----------------------------------------
   Cluster Management Sidebar Component
   Features dual-sidebar layout:
   - Icon sidebar (48px) on the left
   - Menu sidebar (200px) on the right
   ---------------------------------------- */

interface ClusterManagementSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// Icon sidebar item component
interface IconSidebarItemProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

function IconSidebarItem({ icon, active, onClick, tooltip }: IconSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-[36px] h-[36px] flex items-center justify-center rounded-[var(--radius-md)]
        transition-colors duration-[var(--duration-fast)]
        ${
          active
            ? 'bg-[var(--menu-item-active-bg)] text-[var(--menu-item-active-text)]'
            : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
        }
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

interface ClusterItem {
  id: string;
  name: string;
  iconText?: string;
}

// Sample clusters data for the sidebar
const defaultClusters: ClusterItem[] = [
  { id: 'cluster-001', name: 'Cluster1' },
  { id: 'cluster-002', name: 'ClusterName' },
  { id: 'cluster-003', name: 'production-cluster' },
];

function ClusterAppearanceDrawer({
  isOpen,
  onClose,
  cluster,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  cluster: ClusterItem | null;
  onSave: (clusterId: string, iconText: string) => void;
}) {
  const [draftText, setDraftText] = useState('');

  useEffect(() => {
    if (isOpen && cluster) {
      setDraftText(cluster.iconText || '');
    }
  }, [isOpen, cluster]);

  const handleSave = () => {
    if (cluster) {
      onSave(cluster.id, draftText.trim());
    }
    onClose();
  };

  const previewText = draftText.trim().toUpperCase().slice(0, 3);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Cluster appearance"
      width={280}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Preview</span>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-4">
            <span className="text-body-xs text-[var(--color-text-subtle)] uppercase tracking-wider">
              Menu style
            </span>
            <div className="mt-3 flex items-center">
              <div className="w-[36px] h-[36px] flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)]">
                {previewText ? (
                  <span className="text-[11px] font-semibold leading-none select-none text-[var(--color-text-default)]">
                    {previewText}
                  </span>
                ) : (
                  <IconAffiliate
                    size={16}
                    stroke={1.5}
                    className="text-[var(--color-text-default)]"
                  />
                )}
              </div>
            </div>
          </div>
        </VStack>

        <FormField
          label="Icon text"
          helperText="Up to 3 characters in any language. Leave blank to use the default icon."
        >
          <Input
            value={draftText}
            onChange={(e) => setDraftText(e.target.value.slice(0, 3))}
            placeholder=""
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export function ClusterManagementSidebar({
  isOpen = true,
  onToggle,
}: ClusterManagementSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookmarksExpanded, setBookmarksExpanded] = useState(false);

  // Cluster appearance state
  const [clusters, setClusters] = useState<ClusterItem[]>(defaultClusters);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterItem | null>(null);

  const openAppearance = (cluster: ClusterItem) => {
    setEditingCluster(cluster);
    setAppearanceOpen(true);
  };

  const handleSaveAppearance = (clusterId: string, iconText: string) => {
    setClusters((prev) => prev.map((c) => (c.id === clusterId ? { ...c, iconText } : c)));
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const clusterId = (e as CustomEvent<string>).detail;
      const cluster = clusters.find((c) => c.id === clusterId);
      if (cluster) {
        openAppearance(cluster);
      } else if (clusters.length > 0) {
        openAppearance(clusters[0]);
      }
    };
    window.addEventListener('open-cluster-appearance', handler);
    return () => window.removeEventListener('open-cluster-appearance', handler);
  }, [clusters]);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Determine which icon section is active
  const getActiveIconSection = () => {
    const path = location.pathname;
    if (path.startsWith('/container/cluster-management')) {
      return 'cluster-management';
    }
    if (path.startsWith('/container/dashboard') || path.startsWith('/container/namespaces')) {
      return 'cluster';
    }
    if (path === '/container') {
      return 'home';
    }
    return 'cluster-management';
  };

  const activeIconSection = getActiveIconSection();

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (48px) - Always visible */}
      <aside className="w-[48px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col">
        {/* App Icon */}
        <div className="h-[36px] flex items-center justify-center border-b border-[var(--color-border-subtle)]">
          <img src={containerIcon} alt="Container" className="w-[24px] h-[24px]" />
        </div>

        {/* Icon Navigation */}
        <div className="flex-1 flex flex-col items-center py-3 gap-0">
          <IconSidebarItem
            icon={<IconHome size={16} stroke={1.5} />}
            active={activeIconSection === 'home'}
            onClick={() => navigate('/container')}
            tooltip="Home"
          />
          <IconSidebarItem
            icon={<FolderCog size={16} strokeWidth={1.5} />}
            active={activeIconSection === 'cluster-management'}
            onClick={() => navigate('/container/cluster-management')}
            tooltip="Cluster management"
          />
          <IconSidebarItem
            icon={<IconAffiliate size={16} stroke={1.5} />}
            active={activeIconSection === 'cluster'}
            onClick={() => navigate('/container/dashboard')}
            tooltip="Cluster"
          />
          <IconSidebarItem
            icon={<IconPlus size={16} stroke={1.5} />}
            active={false}
            tooltip="Add new"
          />
        </div>
      </aside>

      {/* Menu Sidebar (200px) - Toggleable */}
      {isOpen && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          {/* Logo */}
          <div className="h-[33px] px-3 flex items-center justify-between">
            <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-4" />
            <button
              type="button"
              onClick={onToggle}
              className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar
                size={14}
                className="text-[var(--color-text-muted)] pointer-events-none"
                stroke={1.5}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll">
            <VStack gap={4} className="w-full min-w-0">
              {/* Bookmarks */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
                  className="flex items-center gap-2 px-0 py-1.5 text-label-md text-[var(--color-text-default)]"
                >
                  <IconChevronDown
                    size={12}
                    stroke={2}
                    className={`transition-transform ${bookmarksExpanded ? '' : 'rotate-[-90deg]'}`}
                  />
                  <span>Bookmarks</span>
                </button>
                {bookmarksExpanded && (
                  <div className="mt-2 pl-4">
                    <p className="text-body-sm text-[var(--color-text-muted)]">No bookmarks yet</p>
                  </div>
                )}
              </div>

              {/* Cluster Management Section */}
              <MenuSection title="Cluster management" defaultOpen={true}>
                <MenuItem
                  icon={<FolderCog size={16} strokeWidth={1.5} />}
                  label="Clusters"
                  href="/container/cluster-management"
                  active={isActive('/container/cluster-management')}
                />
              </MenuSection>

              {/* Cluster Section */}
              <MenuSection title="Cluster" defaultOpen={true}>
                {clusters.map((cluster) => (
                  <MenuItem
                    key={cluster.id}
                    icon={<IconAffiliate size={16} stroke={1.5} />}
                    label={cluster.name}
                    href={`/container/cluster-management/${cluster.id}`}
                    active={isActive(`/container/cluster-management/${cluster.id}`)}
                  />
                ))}
              </MenuSection>
            </VStack>
          </nav>
        </aside>
      )}
      {createPortal(
        <ClusterAppearanceDrawer
          isOpen={appearanceOpen}
          onClose={() => setAppearanceOpen(false)}
          cluster={editingCluster}
          onSave={handleSaveAppearance}
        />,
        document.body
      )}
    </div>
  );
}

export default ClusterManagementSidebar;
