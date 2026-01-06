import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import {
  IconMoon,
  IconSun,
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
    path: '/cloud-builder',
    color: 'from-orange-500 to-amber-500',
    available: false,
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
    path: '/ai-agent',
    color: 'from-emerald-500 to-teal-500',
    available: false,
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'Object storage, file systems, and data management',
    icon: <img src={StorageIcon} alt="Storage" className="w-16 h-16" />,
    path: '/storage',
    color: 'from-indigo-500 to-blue-500',
    available: false,
  },
  {
    id: 'desktop',
    title: 'Desktop',
    description: 'Virtual desktops, remote workstations, and VDI solutions',
    icon: <img src={DesktopIcon} alt="Desktop" className="w-16 h-16" />,
    path: '/desktop',
    color: 'from-slate-500 to-zinc-500',
    available: false,
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
        w-full aspect-[4/3] rounded-2xl
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
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
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
      <main className="pt-14">
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

          {/* Design System Link */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-default)]">
            <div className="text-center">
              <p className="text-[12px] text-[var(--color-text-subtle)] mb-4">
                Developer Resources
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/design')}
                  className="px-4 py-2 text-[13px] font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] rounded-lg transition-colors"
                >
                  Design System
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/design/drawers')}
                  className="px-4 py-2 text-[13px] font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] rounded-lg transition-colors"
                >
                  Drawers
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/design/modals')}
                  className="px-4 py-2 text-[13px] font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] rounded-lg transition-colors"
                >
                  Modals
                </button>
              </div>
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

