import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import {
  IconMoon,
  IconSun,
  IconHistory,
} from '@tabler/icons-react';
import { Button } from '@/design-system';
import changelogData from '@/data/changelog.json';

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

/* ----------------------------------------
   Changelog Data
   ---------------------------------------- */

interface ChangelogItem {
  id: string;
  date: string;
  app: string;
  appColor: string;
  changes: string[];
}

// Fallback 데이터 (Git 로그가 없을 때 사용)
const fallbackChanges: ChangelogItem[] = [
  {
    id: '1',
    date: '2025-01-08',
    app: 'Design System',
    appColor: 'from-purple-500 to-fuchsia-500',
    changes: [
      'EntryPage 서브타이틀 문구 수정',
      'NotificationCenter 스크롤 스타일 적용',
    ],
  },
  {
    id: '2',
    date: '2025-01-07',
    app: 'Storage',
    appColor: 'from-indigo-500 to-blue-500',
    changes: [
      'BucketDetailPage Objects 테이블 디자인 시스템 적용',
      'Tags/Versions 테이블 헤더 구분선 추가',
      'S3 URI 박스 패딩 통일 (16px)',
    ],
  },
  {
    id: '3',
    date: '2025-01-07',
    app: 'Compute',
    appColor: 'from-blue-500 to-cyan-500',
    changes: [
      'HostDetailPage Device health 탭 지글링 현상 수정',
      'OSDDetailPage smartctl output 스크롤 제한 제거',
      'Physical Disks Type 컬럼 truncate 수정',
    ],
  },
  {
    id: '4',
    date: '2025-01-06',
    app: 'Cloud Builder',
    appColor: 'from-orange-500 to-amber-500',
    changes: [
      'ListToolbar Refresh 버튼 위치 조정',
      'Table 가로 스크롤 및 텍스트 truncate 적용',
      'Network Agents name 컬럼 너비 조정',
    ],
  },
];

// Git에서 생성된 데이터가 있으면 사용, 없으면 fallback 사용
const recentChanges: ChangelogItem[] = 
  (changelogData as ChangelogItem[]).length > 0 
    ? (changelogData as ChangelogItem[]) 
    : fallbackChanges;

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
    available: true,
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
            <Button
              variant="secondary"
              size="md"
              icon={isDark ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
              onClick={toggleDarkMode}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-bold text-[var(--color-text-default)] mb-3">
              Thaki Design System SSoT
            </h1>
            <p className="text-[14px] text-[var(--color-text-subtle)] mx-auto leading-relaxed">
              Thaki Design System SSoT는 디자인 원칙, 컴포넌트, 토큰, 가이드라인을 한 곳에 모은 '단일 기준'입니다.
              <br />
              디자이너와 개발자가 동일한 소스를 참고해 의사결정과 구현을 정렬하고, 제품 전반의 일관성과 개발 속도를 함께 높입니다.
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

          {/* Recent Changes */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-default)]">
            <div className="flex items-center gap-2 mb-6">
              <IconHistory size={20} stroke={1.5} className="text-[var(--color-text-muted)]" />
              <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                최근 반영사항
              </h2>
            </div>
            
            <div className="space-y-3">
              {recentChanges.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-lg bg-[var(--color-surface-default)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors"
                >
                  {/* Header: Badge + Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`
                      inline-flex items-center
                      px-[var(--chip-padding-left)] py-[var(--chip-padding-y)]
                      border border-[var(--chip-border)]
                      rounded-[var(--chip-radius)]
                      text-[length:var(--chip-font-size)] leading-[var(--chip-line-height)]
                      font-medium
                      text-[var(--color-text-default)]
                      bg-[var(--chip-bg)]
                    `}>
                      {item.app}
                    </span>
                    <span className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-muted)]">
                      {item.date}
                    </span>
                  </div>
                  
                  {/* Changes List */}
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] marker:text-[var(--color-text-muted)]">
                    {item.changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Resources */}
          <div className="mt-12 pt-8 border-t border-[var(--color-border-default)]">
            <div className="text-center mb-6">
              <p className="text-[12px] text-[var(--color-text-subtle)] mb-4">
                Developer Resources
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="muted"
                  size="md"
                  onClick={() => navigate('/design')}
                >
                  Design System
                </Button>
                <Button
                  variant="muted"
                  size="md"
                  onClick={() => navigate('/design/drawers')}
                >
                  Drawers
                </Button>
                <Button
                  variant="muted"
                  size="md"
                  onClick={() => navigate('/design/modals')}
                >
                  Modals
                </Button>
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

