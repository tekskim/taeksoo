import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
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
  Tooltip,
} from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconLayoutDashboard,
  IconAffiliate,
  IconShieldLock,
  IconPlus,
  IconBox,
  IconClock,
  IconCalendarTime,
  IconLayoutSidebar,
  IconFolders,
  IconRocket,
  IconRefresh,
  IconStack3,
  IconFileSettings,
  IconKey,
  IconTopologyStar,
  IconTimelineEvent,
  IconArrowsShuffle,
  IconDatabase,
  IconReorder,
  IconCategory,
  IconChartPie3,
  IconRulerMeasure,
  IconApps,
  IconPackage,
} from '@tabler/icons-react';
import { FolderCog, HardDrive, Scaling, Group, Network } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import containerIcon from '@/assets/appIcon/container.webp';
import metisContainerIcon from '@/assets/appIcon/metis-container.webp';
import containerPlatformIcon from '@/assets/appIcon/container-platform.svg?url';
import { useIsDesktopWindow, useDesktopWindowControls } from '@/contexts/DesktopWindowContext';
import { useContainerMode } from '@/contexts/ContainerModeContext';
import {
  CP_CLUSTERS,
  getActiveCpCluster,
  setActiveCpClusterId,
} from '@/pages/containerActiveCluster';
import {
  DASHBOARD_PATH,
  DASHBOARD_MENU_LABEL,
  clusterEntryPath,
} from '@/pages/containerDashboardLayout';

/* ----------------------------------------
   Container Sidebar Component
   Features dual-sidebar layout:
   - Icon sidebar (48px) on the left
   - Menu sidebar (200px) on the right
   ---------------------------------------- */

interface ContainerSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// Cluster data
export interface ClusterItem {
  id: string;
  name: string;
  iconText?: string;
}

// Clusters registered on the platform.
// Empty this array to exercise the "no clusters" empty state (Metis Container).
export const INITIAL_CONTAINER_CLUSTERS: ClusterItem[] = [
  { id: 'cluster-001', name: 'Cluster', iconText: '' },
  { id: 'cluster-002', name: 'Cluster', iconText: '' },
];

// Icon sidebar item component
interface IconSidebarItemProps {
  icon: React.ReactNode;
  iconText?: string;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

function IconSidebarItem({ icon, iconText, active, onClick, tooltip }: IconSidebarItemProps) {
  const renderContent = () => {
    if (iconText) {
      return (
        <span className="text-body-sm font-semibold leading-none select-none uppercase">
          {iconText}
        </span>
      );
    }
    return icon;
  };

  return (
    <button
      type="button"
      aria-label={tooltip}
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
      {renderContent()}
    </button>
  );
}

// Store scroll position outside component to persist across re-renders
let savedScrollPosition = 0;

// Cluster Appearance Drawer
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
                  <span className="text-body-sm font-semibold leading-none select-none text-[var(--color-text-default)]">
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

export function ContainerSidebar({ isOpen = true, onToggle }: ContainerSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();
  const { mode, isMetis, isPlatform } = useContainerMode();
  const appTitle =
    mode === 'aegis-container'
      ? 'Aegis Container'
      : mode === 'metis-container'
        ? 'Metis Container'
        : mode === 'container-platform'
          ? ''
          : 'Container';
  const appIcon =
    mode === 'metis-container'
      ? metisContainerIcon
      : mode === 'container-platform'
        ? containerPlatformIcon
        : containerIcon;
  const osRef = useRef<React.ComponentRef<typeof OverlayScrollbarsComponent>>(null);

  // Cluster state
  const [clusters, setClusters] = useState<ClusterItem[]>(INITIAL_CONTAINER_CLUSTERS);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterItem | null>(null);

  const openAppearance = (cluster: ClusterItem) => {
    setEditingCluster(cluster);
    setAppearanceOpen(true);
  };

  const handleSaveAppearance = (clusterId: string, iconText: string) => {
    setClusters((prev) => prev.map((c) => (c.id === clusterId ? { ...c, iconText } : c)));
    window.dispatchEvent(
      new CustomEvent('cluster-appearance-changed', { detail: { clusterId, iconText } })
    );
  };

  // Listen for external "open appearance" events from other pages
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

  const getViewport = () =>
    osRef.current?.osInstance()?.elements().viewport as HTMLElement | undefined;

  // Restore scroll position after route change
  useLayoutEffect(() => {
    const vp = getViewport();
    if (vp && savedScrollPosition > 0) {
      vp.scrollTop = savedScrollPosition;
    }
  }, [location.pathname]);

  // Also restore on mount with a slight delay as backup
  useEffect(() => {
    const vp = getViewport();
    if (vp && savedScrollPosition > 0) {
      vp.scrollTop = savedScrollPosition;
      const timeoutId = setTimeout(() => {
        const vp2 = getViewport();
        if (vp2) vp2.scrollTop = savedScrollPosition;
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Check if current path matches href
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (
      href !== '/container' &&
      href !== '/container/dashboard' &&
      location.pathname.startsWith(href + '/')
    )
      return true;
    return false;
  };

  // Determine active icon section based on current route
  const getActiveIconSection = () => {
    const path = location.pathname;

    if (path === '/container') {
      return 'home';
    }

    if (path.startsWith('/container/cluster-management')) {
      return 'cluster-management';
    }

    return 'cluster';
  };

  const activeIconSection = getActiveIconSection();

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (48px) - Always visible */}
      <aside className="w-[48px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col">
        {/* App Icon */}
        <div
          className="h-[36px] flex items-center justify-center border-b border-[var(--color-border-subtle)] select-none"
          onMouseDown={isDesktopWindow ? desktopControls?.onDragStart : undefined}
          onDoubleClick={isDesktopWindow ? desktopControls?.onDoubleClick : undefined}
        >
          <img src={appIcon} alt={appTitle} className="w-[24px] h-[24px]" />
        </div>

        {/* Icon Navigation */}
        <div className="flex-1 flex flex-col items-center py-3 gap-1">
          {/* Metis Container has no Home — only cluster menus */}
          {!isMetis && (
            <IconSidebarItem
              icon={<IconHome size={16} stroke={1.5} />}
              active={activeIconSection === 'home'}
              onClick={() => navigate('/container')}
              tooltip="Home"
            />
          )}
          {/* Metis Container has no Cluster Management page */}
          {!isMetis && (
            <IconSidebarItem
              icon={<FolderCog size={16} strokeWidth={1.5} />}
              active={location.pathname.startsWith('/container/cluster-management')}
              onClick={() => navigate('/container/cluster-management')}
              tooltip="Cluster management"
            />
          )}
          {isPlatform
            ? // Container Platform: General 클러스터 + Metis/Maxis 전용(등록형) 클러스터 (D-27)
              CP_CLUSTERS.map((cluster) => (
                <IconSidebarItem
                  key={cluster.id}
                  icon={<IconAffiliate size={16} stroke={1.5} />}
                  iconText={cluster.iconText || undefined}
                  active={cluster.id === getActiveCpCluster().id && activeIconSection === 'cluster'}
                  onClick={() => {
                    setActiveCpClusterId(cluster.id);
                    navigate(clusterEntryPath());
                  }}
                  tooltip={
                    cluster.dedicated ? `${cluster.name} (Metis/Maxis dedicated)` : cluster.name
                  }
                />
              ))
            : clusters.map((cluster, idx) => (
                <IconSidebarItem
                  key={cluster.id}
                  icon={<IconAffiliate size={16} stroke={1.5} />}
                  iconText={cluster.iconText || undefined}
                  active={idx === 0 && activeIconSection === 'cluster'}
                  onClick={() => navigate(clusterEntryPath())}
                  tooltip={cluster.name}
                />
              ))}
          {!isMetis && (
            <IconSidebarItem
              icon={<IconPlus size={16} stroke={1.5} />}
              active={false}
              tooltip="Add new"
              onClick={() => navigate('/container/cluster-management/create')}
            />
          )}
        </div>
      </aside>

      {/* Menu Sidebar (200px) - Toggleable, hidden on Home page */}
      {isOpen && activeIconSection !== 'home' && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          {/* Logo / Title */}
          <div
            className="h-[33px] px-3 flex items-center justify-between select-none"
            onMouseDown={isDesktopWindow ? desktopControls?.onDragStart : undefined}
            onDoubleClick={isDesktopWindow ? desktopControls?.onDoubleClick : undefined}
          >
            <span className="text-label-lg text-[var(--color-text-default)]">{appTitle}</span>
            <button
              type="button"
              onClick={onToggle}
              onMouseDown={(e) => e.stopPropagation()}
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

          {/* Active cluster identity (Container Platform mode, D-27).
              용도(General·Metis·Maxis)는 여기서 보여주지 않는다 — 목록·상세가 보여준다.
              이름은 비활성 입력칸에 담아 아래 메뉴가 어느 클러스터 것인지 묶어 보이게 한다. */}
          {isPlatform && activeIconSection === 'cluster' && (
            <div className="px-3 pb-2">
              {/* 표시 전용이라 포커스 링을 두지 않는다. 전역 :focus-visible 규칙이 클릭 시
                  outline을 그리고, transition-all 때문에 outline 색이 진한 색에서 투명으로
                  넘어가며 잠깐 보인다. 평소·포커스 모두 투명 outline으로 고정해 변화를 없앤다.
                  탭 순서에서도 뺀다. */}
              {/* 긴 이름은 잘리므로 전체 이름은 디자인 시스템 Tooltip으로 보여준다.
                  네이티브 title 툴팁은 이 환경에서 뜨지 않았다. Tooltip 래퍼가 inline-flex라
                  style로 폭을 채운다. */}
              <Tooltip
                content={getActiveCpCluster().name}
                position="bottom"
                style={{ width: '100%' }}
              >
                <Input
                  size="sm"
                  fullWidth
                  readOnly
                  tabIndex={-1}
                  className="outline-none focus:outline-none focus-visible:outline-none"
                  value={getActiveCpCluster().name}
                />
              </Tooltip>
            </div>
          )}

          {/* Navigation */}
          <OverlayScrollbarsComponent
            ref={osRef}
            element="nav"
            options={{
              overflow: { x: 'hidden', y: 'scroll' },
              scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
            }}
            events={{
              scroll: () => {
                const vp = getViewport();
                if (vp) savedScrollPosition = vp.scrollTop;
              },
            }}
            defer={false}
            className="flex-1 px-3 py-3 [&>div]:!min-w-0"
          >
            <VStack gap={4} className="w-full min-w-0">
              {activeIconSection === 'cluster-management' ? (
                <>
                  {/* Cluster Management Section */}
                  <MenuSection title="Cluster management" defaultOpen={true}>
                    <MenuItem
                      icon={<FolderCog size={16} strokeWidth={1.5} />}
                      label="Clusters"
                      href="/container/cluster-management"
                      active={isActive('/container/cluster-management')}
                    />
                  </MenuSection>
                </>
              ) : (
                <>
                  {/* Cluster Section */}
                  <MenuSection title="Cluster" defaultOpen={true}>
                    {/* 대시보드는 Cluster 묶음 맨 위에 Dashboard로 둔다 (CAPSIS-D-70) */}
                    <MenuItem
                      icon={<IconLayoutDashboard size={16} stroke={1.5} />}
                      label={DASHBOARD_MENU_LABEL}
                      href={DASHBOARD_PATH}
                      active={isActive(DASHBOARD_PATH)}
                    />
                    <MenuItem
                      icon={<IconFolders size={16} stroke={1.5} />}
                      label="Namespaces"
                      href="/container/namespaces"
                      active={isActive('/container/namespaces')}
                    />
                    <MenuItem
                      icon={<IconTopologyStar size={16} stroke={1.5} />}
                      label="Nodes"
                      href="/container/nodes"
                      active={isActive('/container/nodes')}
                    />
                    <MenuItem
                      icon={<IconTimelineEvent size={16} stroke={1.5} />}
                      label="Events"
                      href="/container/events"
                      active={isActive('/container/events')}
                    />
                  </MenuSection>

                  {/* Workloads Section */}
                  <MenuSection title="Workloads" defaultOpen={true}>
                    <MenuItem
                      icon={<IconRocket size={16} stroke={1.5} />}
                      label="Deployments"
                      href="/container/deployments"
                      active={isActive('/container/deployments')}
                    />
                    <MenuItem
                      icon={<Group size={16} strokeWidth={1.5} />}
                      label="StatefulSets"
                      href="/container/statefulsets"
                      active={isActive('/container/statefulsets')}
                    />
                    <MenuItem
                      icon={<IconRefresh size={16} stroke={1.5} />}
                      label="DaemonSets"
                      href="/container/daemonsets"
                      active={isActive('/container/daemonsets')}
                    />
                    <MenuItem
                      icon={<IconClock size={16} stroke={1.5} />}
                      label="Jobs"
                      href="/container/jobs"
                      active={isActive('/container/jobs')}
                    />
                    <MenuItem
                      icon={<IconCalendarTime size={16} stroke={1.5} />}
                      label="CronJobs"
                      href="/container/cronjobs"
                      active={isActive('/container/cronjobs')}
                    />
                    <MenuItem
                      icon={<IconBox size={16} stroke={1.5} />}
                      label="Pods"
                      href="/container/pods"
                      active={isActive('/container/pods')}
                    />
                  </MenuSection>

                  {/* App Catalog Section — Metis 모드와 Capsis 모드에서 미노출.
                      Capsis에서는 묶음째 뺀다: Hub Apps가 파드 하나로 뜨는 앱만 올리게 되면서
                      (HUB-D-206) 설치 위저드·Installed Apps·Installed Operators의 자리가 없어진다.
                      Hub에서 넘어온 앱은 Pod 만들기 화면으로 가고, 설치된 것은 Pods 목록에서 본다.
                      결정은 HUB-D-211(D-206 ③ 개정)·CAPSIS-D-82(D-38 개정)로 로그에 올렸다(2026-09-15).
                      Aegis 모드는 그대로다. */}
                  {!isMetis && !isPlatform && (
                    <MenuSection title="App Catalog" defaultOpen={true}>
                      {!isPlatform && (
                        <MenuItem
                          icon={<IconApps size={16} stroke={1.5} />}
                          label="Catalog"
                          href="/container/catalog"
                          active={isActive('/container/catalog')}
                        />
                      )}
                      <MenuItem
                        icon={<IconPackage size={16} stroke={1.5} />}
                        label="Apps"
                        href="/container/installed-apps"
                        active={isActive('/container/installed-apps')}
                      />
                      <MenuItem
                        icon={<IconShieldLock size={16} stroke={1.5} />}
                        label="Operators"
                        href="/container/installed-operators"
                        active={isActive('/container/installed-operators')}
                      />
                    </MenuSection>
                  )}

                  {/* Service Discovery Section */}
                  <MenuSection title="Service discovery" defaultOpen={true}>
                    <MenuItem
                      icon={<Network size={16} strokeWidth={1.5} />}
                      label="Services"
                      href="/container/services"
                      active={isActive('/container/services')}
                    />
                    <MenuItem
                      icon={<IconArrowsShuffle size={16} stroke={1.5} />}
                      label="Ingresses"
                      href="/container/ingresses"
                      active={isActive('/container/ingresses')}
                    />
                    <MenuItem
                      icon={<Scaling size={16} strokeWidth={1.5} />}
                      label="Horizontal pod autoscalers"
                      href="/container/hpa"
                      active={isActive('/container/hpa')}
                    />
                  </MenuSection>

                  {/* Storage Section */}
                  <MenuSection title="Storage" defaultOpen={true}>
                    <MenuItem
                      icon={<HardDrive size={16} strokeWidth={1.5} />}
                      label="Persistent volumes"
                      href="/container/persistent-volumes"
                      active={isActive('/container/persistent-volumes')}
                    />
                    <MenuItem
                      icon={<IconDatabase size={16} stroke={1.5} />}
                      label="Persistent volume claims"
                      href="/container/pvc"
                      active={isActive('/container/pvc')}
                    />
                    <MenuItem
                      icon={<IconStack3 size={16} stroke={1.5} />}
                      label="Storage classes"
                      href="/container/storage-classes"
                      active={isActive('/container/storage-classes')}
                    />
                    <MenuItem
                      icon={<IconFileSettings size={16} stroke={1.5} />}
                      label="ConfigMaps"
                      href="/container/configmaps"
                      active={isActive('/container/configmaps')}
                    />
                    <MenuItem
                      icon={<IconKey size={16} stroke={1.5} />}
                      label="Secrets"
                      href="/container/secrets"
                      active={isActive('/container/secrets')}
                    />
                  </MenuSection>

                  {/* Policy Section */}
                  <MenuSection title="Policy" defaultOpen={true}>
                    <MenuItem
                      icon={<IconRulerMeasure size={16} stroke={1.5} />}
                      label="Limit ranges"
                      href="/container/limit-ranges"
                      active={isActive('/container/limit-ranges')}
                    />
                    <MenuItem
                      icon={<IconChartPie3 size={16} stroke={1.5} />}
                      label="Resource quotas"
                      href="/container/resource-quotas"
                      active={isActive('/container/resource-quotas')}
                    />
                    <MenuItem
                      icon={<IconShieldLock size={16} stroke={1.5} />}
                      label="Network policies"
                      href="/container/network-policies"
                      active={isActive('/container/network-policies')}
                    />
                    <MenuItem
                      icon={<IconReorder size={16} stroke={1.5} />}
                      label="Pod disruption budgets"
                      href="/container/pdb"
                      active={isActive('/container/pdb')}
                    />
                  </MenuSection>

                  {/* Administration — Container Platform 전용(D-35).
                      상위 제품이 만든 커스텀 리소스도 CP가 조회한다(D-24 유지).
                      Aegis/Metis 모드는 무변경(D-26 ②). */}
                  {isPlatform && (
                    <MenuSection title="Administration" defaultOpen={true}>
                      <MenuItem
                        icon={<IconCategory size={16} stroke={1.5} />}
                        label="Resource types"
                        href="/container/resource-types"
                        active={isActive('/container/resource-types')}
                      />
                    </MenuSection>
                  )}
                </>
              )}
            </VStack>
          </OverlayScrollbarsComponent>
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

export default ContainerSidebar;
