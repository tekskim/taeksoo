import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import {
  IconMoon,
  IconSun,
  IconPalette,
  IconLayoutSidebar,
  IconSquare,
} from '@tabler/icons-react';

// App Icons
import ComputeIcon from '@/assets/compute.png';
import ContainerIcon from '@/assets/container.png';
import CloudBuilderIcon from '@/assets/cloudbuilder.png';
import AIPlatformIcon from '@/assets/aiplatform.png';
import AIAgentIcon from '@/assets/agentops.png';
import StorageIcon from '@/assets/storage.png';
import IAMIcon from '@/assets/iam.png';
import DesktopIcon from '@/assets/settings.png';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AppCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  available: boolean;
}

/* ----------------------------------------
   App Cards Data
   ---------------------------------------- */

const appCards: AppCard[] = [
  {
    id: 'compute',
    title: 'Compute',
    description: 'Virtual machines, instances, and cloud infrastructure management',
    icon: <img src={ComputeIcon} alt="Compute" className="w-16 h-16" />,
    path: '/compute',
    color: 'from-blue-500 to-cyan-500',
    available: true,
  },
  {
    id: 'container',
    title: 'Container',
    description: 'Kubernetes clusters, container orchestration, and microservices',
    icon: <img src={ContainerIcon} alt="Container" className="w-16 h-16" />,
    path: '/container',
    color: 'from-violet-500 to-purple-500',
    available: false,
  },
  {
    id: 'cloud-builder',
    title: 'Cloud Builder',
    description: 'CI/CD pipelines, build automation, and deployment workflows',
    icon: <img src={CloudBuilderIcon} alt="Cloud Builder" className="w-16 h-16" />,
    path: '/cloudbuilder',
    color: 'from-orange-500 to-amber-500',
    available: true,
  },
  {
    id: 'ai-platform',
    title: 'AI Platform',
    description: 'Machine learning models, training pipelines, and MLOps',
    icon: <img src={AIPlatformIcon} alt="AI Platform" className="w-16 h-16" />,
    path: '/ai-platform',
    color: 'from-pink-500 to-rose-500',
    available: false,
  },
  {
    id: 'ai-agent',
    title: 'AI Agent',
    description: 'Intelligent agents, automation bots, and AI assistants',
    icon: <img src={AIAgentIcon} alt="AI Agent" className="w-16 h-16" />,
    path: '/agent',
    color: 'from-emerald-500 to-teal-500',
    available: true,
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'Object storage, file systems, and data management',
    icon: <img src={StorageIcon} alt="Storage" className="w-16 h-16" />,
    path: '/storage',
    color: 'from-indigo-500 to-blue-500',
    available: true,
  },
  {
    id: 'desktop',
    title: 'Desktop',
    description: 'Virtual desktops, remote workstations, and VDI solutions',
    icon: <img src={DesktopIcon} alt="Desktop" className="w-16 h-16" />,
    path: '/desktop',
    color: 'from-slate-500 to-zinc-500',
    available: true,
  },
  {
    id: 'iam',
    title: 'IAM',
    description: 'Identity and access management, users, roles, and permissions',
    icon: <img src={IAMIcon} alt="IAM" className="w-16 h-16" />,
    path: '/iam',
    color: 'from-amber-500 to-yellow-500',
    available: false,
  },
];

/* ----------------------------------------
   AppCardComponent
   ---------------------------------------- */

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
        group relative overflow-hidden
        w-full min-h-[200px] rounded-2xl
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        transition-all duration-300 ease-out
        text-left
        ${isAvailable 
          ? 'hover:border-[var(--color-border-strong)] hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
          : 'opacity-60 cursor-not-allowed'
        }
      `}
    >
      {/* Gradient Background */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${card.color} opacity-0
          transition-opacity duration-300
          ${isAvailable ? 'group-hover:opacity-10' : ''}
        `}
      />

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Icon */}
        <div 
          className={`
            w-16 h-16
            transition-transform duration-300 origin-center
            ${isAvailable ? 'group-hover:scale-110' : ''}
          `}
        >
          {card.icon}
        </div>

        {/* Title & Description */}
        <div className="mt-auto">
          <h3 className="text-[16px] font-semibold text-[var(--color-text-default)] mb-1">
            {card.title}
          </h3>
          <p className="text-[12px] text-[var(--color-text-subtle)] line-clamp-2">
            {card.description}
          </p>
        </div>

        {/* Coming Soon Badge */}
        {!isAvailable && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 text-[10px] font-medium bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] rounded-full">
              Coming Soon
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

/* ----------------------------------------
   EntryPage
   ---------------------------------------- */

export function EntryPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const handleCardClick = (card: AppCard) => {
    if (card.available) {
      navigate(card.path);
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={isDark ? ThakiLogoDark : ThakiLogoLight} 
              alt="THAKI Cloud" 
              className="h-5"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-[var(--color-surface-subtle)] transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <IconSun size={18} className="text-[var(--color-text-subtle)]" stroke={1.5} />
              ) : (
                <IconMoon size={18} className="text-[var(--color-text-subtle)]" stroke={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-bold text-[var(--color-text-default)] mb-3">
              Welcome to THAKI Cloud
            </h1>
            <p className="text-[16px] text-[var(--color-text-subtle)] max-w-2xl mx-auto">
              Select a service to get started. Build, deploy, and scale your applications with our comprehensive cloud platform.
            </p>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appCards.map((card) => (
              <AppCardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>

          {/* Developer Resources */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-default)]">
            <div className="text-center mb-6">
              <p className="text-[12px] text-[var(--color-text-subtle)]">
                Developer Resources
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* Design System Card */}
              <button
                type="button"
                onClick={() => navigate('/design')}
                className="
                  group relative overflow-hidden
                  w-full p-4 rounded-xl
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  hover:border-[var(--color-border-strong)]
                  hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 ease-out
                  text-left
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconPalette size={20} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--color-text-default)]">
                    Design System
                  </span>
                </div>
              </button>

              {/* Drawers Card */}
              <button
                type="button"
                onClick={() => navigate('/design/drawers')}
                className="
                  group relative overflow-hidden
                  w-full p-4 rounded-xl
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  hover:border-[var(--color-border-strong)]
                  hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 ease-out
                  text-left
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconLayoutSidebar size={20} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--color-text-default)]">
                    Drawers
                  </span>
                </div>
              </button>

              {/* Modals Card */}
              <button
                type="button"
                onClick={() => navigate('/design/modals')}
                className="
                  group relative overflow-hidden
                  w-full p-4 rounded-xl
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  hover:border-[var(--color-border-strong)]
                  hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 ease-out
                  text-left
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconSquare size={20} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--color-text-default)]">
                    Modals
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-[12px] text-[var(--color-text-subtle)] text-center">
            © 2025 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default EntryPage;

