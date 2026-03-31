import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from '@/design-system';

import ComputeIcon from '@/assets/appIcon/compute.png';
import ComputeAdminIcon from '@/assets/appIcon/computeadmin.png';
import ContainerIcon from '@/assets/appIcon/container.png';
import CloudBuilderIcon from '@/assets/appIcon/cloudbuilder.png';
import AIPlatformIcon from '@/assets/appIcon/aiplatform.png';
import AIAgentIcon from '@/assets/appIcon/agentops.png';
import StorageIcon from '@/assets/appIcon/storage.png';
import IAMIcon from '@/assets/appIcon/iam.png';
import DesktopIcon from '@/assets/appIcon/settings.png';
import SettingsIcon from '@/assets/appIcon/settings.png';

interface AppCard {
  id: string;
  title: string;
  iconSrc: string;
  path: string;
}

const appCards: AppCard[] = [
  { id: 'compute', title: 'Compute', iconSrc: ComputeIcon, path: '/compute' },
  {
    id: 'compute-admin',
    title: 'Compute Admin',
    iconSrc: ComputeAdminIcon,
    path: '/compute-admin',
  },
  { id: 'container', title: 'Container', iconSrc: ContainerIcon, path: '/container' },
  { id: 'iam', title: 'IAM', iconSrc: IAMIcon, path: '/iam' },
  { id: 'storage', title: 'Storage', iconSrc: StorageIcon, path: '/storage' },
  { id: 'desktop', title: 'Desktop', iconSrc: DesktopIcon, path: '/desktop' },
  { id: 'settings', title: 'Settings', iconSrc: SettingsIcon, path: '/settings' },
  { id: 'cloud-builder', title: 'Cloud Builder', iconSrc: CloudBuilderIcon, path: '/cloudbuilder' },
  { id: 'ai-platform', title: 'AI Platform', iconSrc: AIPlatformIcon, path: '/ai-platform' },
  { id: 'ai-agent', title: 'AI Agent', iconSrc: AIAgentIcon, path: '/agent' },
];

export function EntryPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-default)] flex flex-col min-h-screen">
      {/* Header — Cargo-style flat bar */}
      <header className="w-full bg-[var(--color-surface-default)]">
        <div className="w-full px-10 h-12 flex items-center justify-between relative">
          <div className="flex items-center">
            <img
              src={isDark ? ThakiLogoDark : ThakiLogoLight}
              alt="THAKI Cloud"
              className="h-[18px]"
            />
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
            <span className="select-none">,&nbsp;</span>
            <button
              type="button"
              onClick={() =>
                window.open(
                  import.meta.env.DEV
                    ? 'http://localhost:6006'
                    : 'https://thakicloud.github.io/tds_ssot/storybook/',
                  '_blank'
                )
              }
              className="hover:text-[var(--color-text-default)] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Storybook
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

      {/* Main — 3-column grid with generous whitespace */}
      <main className="flex-1">
        <div className="w-full px-10 pt-20 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {appCards.map((card) => (
              <div key={card.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="group w-full aspect-[4/3] bg-[var(--color-surface-subtle)] rounded-lg flex items-center justify-center cursor-pointer border-none p-0 transition-all duration-200 hover:shadow-lg hover:brightness-[0.97]"
                >
                  <img
                    src={card.iconSrc}
                    alt={card.title}
                    className="w-[96px] h-[96px] transition-transform duration-200 group-hover:scale-110"
                  />
                </button>
                <span className="mt-2.5 text-body-md text-[var(--color-text-default)]">
                  {card.title}
                </span>
              </div>
            ))}
          </div>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const url =
                  window.location.hostname === 'localhost'
                    ? 'http://localhost:5174'
                    : `${window.location.origin}/tds_ssot/shared-v2`;
                window.location.href = url;
              }}
            >
              Shared V2 Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/table-style-guide')}>
              Table Style Guide
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/detail-pages')}>
              Create Pages 2
            </Button>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)] text-center mt-10">
            © 2025 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default EntryPage;
