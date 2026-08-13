import { useNavigate } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ThakiLogoAnimated } from '@/components/ThakiLogoAnimated';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from '@/design-system';

import ComputeIcon from '@/assets/appIcon/compute.webp';
import ComputeAdminIcon from '@/assets/appIcon/computeadmin.webp';
import ContainerIcon from '@/assets/appIcon/container.webp';
import ContainerPlatformIcon from '@/assets/appIcon/container-platform.svg';
import MetisContainerIcon from '@/assets/appIcon/metis-container.webp';
import CloudBuilderIcon from '@/assets/appIcon/cloudbuilder.webp';
import AIPlatformIcon from '@/assets/appIcon/aiplatform.png';
import AIAgentIcon from '@/assets/appIcon/agentops.webp';
import ServeIcon from '@/assets/appIcon/metis-serve.webp';
import MLStudioIcon from '@/assets/appIcon/metis-ml-studio.webp';
import RunIcon from '@/assets/appIcon/metis-run.webp';
import FabricIcon from '@/assets/appIcon/metis-fabric.webp';
import StorageIcon from '@/assets/appIcon/storage.webp';
import StorageAdminIcon from '@/assets/appIcon/storageadmin.webp';
import IAMIcon from '@/assets/appIcon/iam.webp';
import SecurityIcon from '@/assets/appIcon/security.webp';
import AdminCenterIcon from '@/assets/appIcon/admincenter.png';
import SettingsIcon from '@/assets/appIcon/settings.webp';

interface AppCard {
  id: string;
  title: string;
  iconSrc: string;
  path: string;
}

const appCards: AppCard[] = [
  { id: 'desktop', title: 'Desktop', iconSrc: AdminCenterIcon, path: '/desktop' },
  { id: 'system-mode', title: 'System Mode', iconSrc: AdminCenterIcon, path: '/system-mode' },
  { id: 'compute', title: 'Compute', iconSrc: ComputeIcon, path: '/compute' },
  {
    id: 'compute-admin',
    title: 'Compute Admin',
    iconSrc: ComputeAdminIcon,
    path: '/compute-admin',
  },
  /* Container 계열 3종은 같은 앱을 모드로 가른다(ContainerModeContext).
     `?mode=`를 넘기지 않으면 전부 default로 떨어져 같은 화면이 되므로 반드시 붙인다.
     구 'Container'(모드 없음) 항목은 Aegis Container와 구분되지 않아 제거했다. */
  {
    id: 'container-platform',
    title: 'Capsis',
    iconSrc: ContainerPlatformIcon,
    path: '/container?mode=container-platform',
  },
  {
    id: 'aegis-container',
    title: 'Aegis Container',
    iconSrc: ContainerIcon,
    path: '/container?mode=aegis-container',
  },
  {
    id: 'metis-container',
    title: 'Metis Container',
    iconSrc: MetisContainerIcon,
    path: '/container?mode=metis-container',
  },
  { id: 'iam', title: 'IAM', iconSrc: IAMIcon, path: '/iam' },
  { id: 'security', title: 'Security', iconSrc: SecurityIcon, path: '/security' },
  {
    id: 'storage-system-admin',
    title: 'Storage - System Admin',
    iconSrc: StorageAdminIcon,
    path: '/storage',
  },
  {
    id: 'storage-domain-admin',
    title: 'Storage - Domain Admin',
    iconSrc: StorageAdminIcon,
    path: '/storage-domain-admin',
  },
  {
    id: 'storage-member',
    title: 'Storage - Member',
    iconSrc: StorageIcon,
    path: '/storage-member',
  },
  { id: 'settings', title: 'Settings', iconSrc: SettingsIcon, path: '/settings' },
  { id: 'cloud-builder', title: 'Cloud Builder', iconSrc: CloudBuilderIcon, path: '/cloudbuilder' },
];

const aiCards: AppCard[] = [
  { id: 'ai-platform', title: 'AI Platform', iconSrc: AIPlatformIcon, path: '/ai-platform' },
  { id: 'agent-ops', title: 'Agent Ops', iconSrc: AIAgentIcon, path: '/agent' },
  { id: 'serve', title: 'Serve', iconSrc: ServeIcon, path: '/serve' },
  { id: 'ml-studio', title: 'ML Studio', iconSrc: MLStudioIcon, path: '/ml-studio' },
  { id: 'run', title: 'Run', iconSrc: RunIcon, path: '/run' },
  { id: 'fabric', title: 'Fabric', iconSrc: FabricIcon, path: '/fabric' },
];

function AppCardItem({ card, onNavigate }: { card: AppCard; onNavigate: (path: string) => void }) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onNavigate(card.path)}
        className="group w-full aspect-[4/3] bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] flex items-center justify-center cursor-pointer border-none p-0 transition-all duration-200 hover:shadow-lg hover:brightness-[0.97]"
      >
        <img
          src={card.iconSrc}
          alt={card.title}
          className="w-[96px] h-[96px] transition-transform duration-200 group-hover:scale-110"
        />
      </button>
      <span className="mt-2.5 text-body-md text-[var(--color-text-default)]">{card.title}</span>
    </div>
  );
}

export function EntryPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: 'scroll', autoHideDelay: 800 } }}
      defer={false}
      className="fixed inset-0 bg-[var(--color-surface-default)] flex flex-col min-h-screen"
    >
      {/* Header — Cargo-style flat bar */}
      <header className="w-full bg-[var(--color-surface-default)]">
        <div className="w-full px-10 h-[60px] flex items-center justify-between relative">
          <div className="flex items-center">
            <ThakiLogoAnimated isDark={isDark} className="h-[18px]" />
          </div>

          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-body-md text-[var(--color-text-muted)]">
            <button
              type="button"
              onClick={() => navigate('/design')}
              className="hover:text-[var(--color-text-default)] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Design system
            </button>
            <span className="select-none">,&nbsp;</span>
            <button
              type="button"
              onClick={() => navigate('/lab')}
              className="hover:text-[var(--color-text-default)] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Lab
            </button>
          </nav>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer bg-transparent border-none text-[var(--color-text-muted)]"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <IconSun size={16} stroke={1.5} /> : <IconMoon size={16} stroke={1.5} />}
          </button>
        </div>
      </header>

      {/* Main — grouped card grids */}
      <main className="flex-1">
        <div className="w-full px-10 pt-8 pb-16 flex flex-col gap-10">
          {/* Cloud Services */}
          <section>
            <h2 className="text-heading-h6 text-[var(--color-text-muted)] mb-4">Cloud</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {appCards.map((card) => (
                <AppCardItem key={card.id} card={card} onNavigate={navigate} />
              ))}
            </div>
          </section>

          {/* AI Products */}
          <section>
            <h2 className="text-heading-h6 text-[var(--color-text-muted)] mb-4">AI</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aiCards.map((card) => (
                <AppCardItem key={card.id} card={card} onNavigate={navigate} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer — Resources + copyright */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="w-full px-10 py-8">
          <h4 className="text-body-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
            Resources
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate('/design/drawers')}>
              Drawers
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/design/modals')}>
              Modals
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/system-errors')}>
              System Errors
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/mail-template')}>
              Mail Template
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/table-style-guide')}>
              Table Style Guide
            </Button>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)] text-center mt-10">
            © 2026 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </OverlayScrollbarsComponent>
  );
}

export default EntryPage;
