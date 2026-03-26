import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { IconMoon, IconSun, IconBook } from '@tabler/icons-react';
import { Button } from '@/design-system';

// App icons
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

/* ----------------------------------------
   Types ---------------------------------------- */

interface AppCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  available: boolean;
  badge?: string;
}

/* ----------------------------------------
   App Cards Data ---------------------------------------- */

const appCards: AppCard[] = [
  {
    id: 'compute',
    title: 'Compute',
    description: 'Virtual machines, instances, and cloud infrastructure management',
    icon: <img src={ComputeIcon} alt="Compute" className="w-[72px] h-[72px]" />,
    path: '/compute',
    color: 'from-blue-500 to-cyan-500',
    available: true,
  },
  {
    id: 'compute-admin',
    title: 'Compute Admin',
    description: 'Virtual machines, instances, and cloud infrastructure management',
    icon: <img src={ComputeAdminIcon} alt="Compute Admin" className="w-[72px] h-[72px]" />,
    path: '/compute-admin',
    color: 'from-blue-500 to-cyan-500',
    available: true,
  },
  {
    id: 'container',
    title: 'Container',
    description: 'Kubernetes clusters, container orchestration, and microservices',
    icon: <img src={ContainerIcon} alt="Container" className="w-[72px] h-[72px]" />,
    path: '/container',
    color: 'from-violet-500 to-purple-500',
    available: true,
  },
  {
    id: 'iam',
    title: 'IAM',
    description: 'Identity and access management, users, roles, and permissions',
    icon: <img src={IAMIcon} alt="IAM" className="w-[72px] h-[72px]" />,
    path: '/iam',
    color: 'from-amber-500 to-yellow-500',
    available: true,
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'Object storage, file systems, and data management',
    icon: <img src={StorageIcon} alt="Storage" className="w-[72px] h-[72px]" />,
    path: '/storage',
    color: 'from-indigo-500 to-blue-500',
    available: true,
  },
  {
    id: 'desktop',
    title: 'Desktop',
    description: 'Virtual desktops, remote workstations, and VDI solutions',
    icon: <img src={DesktopIcon} alt="Desktop" className="w-[72px] h-[72px]" />,
    path: '/desktop',
    color: 'from-slate-500 to-zinc-500',
    available: true,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Application settings, preferences, and configuration',
    icon: <img src={SettingsIcon} alt="Settings" className="w-[72px] h-[72px]" />,
    path: '/settings',
    color: 'from-gray-500 to-slate-500',
    available: true,
  },
  {
    id: 'cloud-builder',
    title: 'Cloud Builder',
    description: 'CI/CD pipelines, build automation, and deployment workflows',
    icon: <img src={CloudBuilderIcon} alt="Cloud Builder" className="w-[72px] h-[72px]" />,
    path: '/cloudbuilder',
    color: 'from-orange-500 to-amber-500',
    available: true,
  },
  {
    id: 'ai-platform',
    title: 'AI Platform',
    description: 'Machine learning models, training pipelines, and MLOps',
    icon: <img src={AIPlatformIcon} alt="AI Platform" className="w-[72px] h-[72px]" />,
    path: '/ai-platform',
    color: 'from-pink-500 to-rose-500',
    available: true,
    badge: 'In Progress...',
  },
  {
    id: 'ai-agent',
    title: 'AI Agent',
    description: 'Intelligent agents, automation bots, and AI assistants',
    icon: <img src={AIAgentIcon} alt="AI Agent" className="w-[72px] h-[72px]" />,
    path: '/agent',
    color: 'from-emerald-500 to-teal-500',
    available: true,
    badge: 'In Progress...',
  },
];

/* ----------------------------------------
   AppCardComponent ---------------------------------------- */

interface AppCardComponentProps {
  card: AppCard;
  onClick: () => void;
}

function AppCardComponent({ card, onClick }: AppCardComponentProps) {
  const isAvailable = card.available;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      className={`
        group relative overflow-hidden w-full rounded-2xl bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        transition-all duration-300 ease-out text-left ${
          isAvailable
            ? 'hover:border-[var(--color-border-strong)] hover:shadow-xl hover:-translate-y-1 cursor-pointer'
            : 'opacity-60 cursor-not-allowed'
        }
      `}
    >
      {/* Gradient Background */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 ${isAvailable ? 'group-hover:opacity-10' : ''}
        `}
      />

      {/* Content */}
      <div className="relative h-full pl-3 pr-4 py-4 flex items-center justify-between gap-4">
        {/* Icon */}
        <div
          className={`
            w-[72px] h-[72px] shrink-0 transition-transform duration-300 origin-center ${isAvailable ? 'group-hover:scale-110' : ''}
          `}
        >
          {card.icon}
        </div>

        {/* Title */}
        <h4 className="text-label-lg text-[var(--color-text-default)] text-right">{card.title}</h4>

        {/* Badge */}
        {card.badge && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] rounded-full">
              {card.badge}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

/* ----------------------------------------
   EntryPage ---------------------------------------- */

export function EntryPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const handleCardClick = (card: AppCard) => {
    if (card.available) {
      navigate(card.path);
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)] flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-5" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/design')}>
              Design system{' '}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/lab')}>
              Lab{' '}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconBook size={14} stroke={1.5} />}
              onClick={() =>
                window.open(
                  import.meta.env.DEV
                    ? 'http://localhost:6006'
                    : 'https://thakicloud.github.io/tds_ssot/storybook/',
                  '_blank'
                )
              }
            >
              Storybook{' '}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                isDark ? <IconSun size={14} stroke={1.5} /> : <IconMoon size={14} stroke={1.5} />
              }
              onClick={toggleDarkMode}
            >
              {isDark ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-16">
          {/* App Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {appCards.map((card) => (
              <AppCardComponent key={card.id} card={card} onClick={() => handleCardClick(card)} />
            ))}
          </div>

          {/* Developer Resources */}
          <div className="mt-12">
            <div className="mb-6">
              <h4 className="text-body-md uppercase text-[var(--color-text-muted)] mb-4">
                Resources
              </h4>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Button variant="muted" size="md" onClick={() => navigate('/design/drawers')}>
                  Drawers
                </Button>
                <Button variant="muted" size="md" onClick={() => navigate('/design/modals')}>
                  Modals
                </Button>
                <Button variant="muted" size="md" onClick={() => navigate('/system-errors')}>
                  System Errors
                </Button>
                <Button variant="muted" size="md" onClick={() => navigate('/mail-template')}>
                  Mail Template
                </Button>
                <Button
                  variant="muted"
                  size="md"
                  onClick={() => {
                    const url =
                      window.location.hostname === 'localhost'
                        ? 'http://localhost:5174'
                        : `${window.location.origin}/tds_ssot/shared-v2`;
                    window.open(url, '_blank');
                  }}
                >
                  Shared V2 Preview
                </Button>
                <Button variant="muted" size="md" onClick={() => navigate('/table-style-guide')}>
                  Table Style Guide
                </Button>
                <Button variant="muted" size="md" onClick={() => navigate('/detail-pages')}>
                  Create Pages 2
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-body-md text-[var(--color-text-subtle)] text-center">
            © 2025 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default EntryPage;
