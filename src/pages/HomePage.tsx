import { useNavigate } from 'react-router-dom';
import { TopBar, TopBarAction, Breadcrumb, VStack } from '@/design-system';
import {
  IconMessagePlus,
  IconRobotFace,
  IconSquarePlus,
  IconPuzzle,
  IconBell,
  IconPalette,
  IconTarget,
  IconPencil,
} from '@tabler/icons-react';

/* ----------------------------------------
   Stat Card Component (TDS Style)
   ---------------------------------------- */
interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  const textColor =
    value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';

  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 border-2 border-transparent transition-colors hover:border-[var(--color-action-primary)] cursor-pointer">
      <div className={`text-heading-h4 ${textColor} pb-1`}>{value}</div>
      <div className="text-body-sm text-[var(--color-text-subtle)]">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Status Card Component (TDS Style)
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'active' | 'inactive' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--primitive-color-green400)]';
  }

  const getStatusIcon = () => {
    if (status === 'active') {
      return <IconTarget size={12} stroke={1.5} className="text-white" />;
    } else if (status === 'inactive') {
      return (
        <div className="flex flex-col gap-0.5 items-center justify-center">
          <div className="h-1 w-2 bg-white rounded-sm" />
          <div className="h-1 w-2 bg-white rounded-sm" />
        </div>
      );
    } else if (status === 'draft') {
      return <IconPencil size={12} stroke={1.5} className="text-white" />;
    }
  };

  return (
    <div className={`${bgColor} flex flex-1 items-center justify-between px-4 py-3 rounded-lg`}>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{count}</span>
      </div>
      <div className={`${iconBg} flex items-center justify-center p-1 rounded-full w-6 h-6`}>
        {getStatusIcon()}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Quick Action Card Component (TDS Style)
   ---------------------------------------- */
interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  highlighted?: boolean;
  onClick?: () => void;
}

function QuickActionCard({ icon, label, highlighted = false, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 text-left transition-colors hover:bg-[var(--color-surface-muted)] ${
        highlighted
          ? 'border-2 border-[var(--color-action-primary)]'
          : 'border-2 border-transparent hover:border-[var(--color-action-primary)]'
      }`}
    >
      <div className="pb-1">
        <span className="text-[var(--color-text-muted)]">{icon}</span>
      </div>
      <div className="text-body-sm text-[var(--color-text-muted)]">{label}</div>
    </button>
  );
}

/* ----------------------------------------
   Chat Item Component (TDS Style)
   ---------------------------------------- */
interface ChatItemProps {
  title: string;
  description: string;
  createdAt: string;
  onClick?: () => void;
}

function ChatItem({ title, description, createdAt, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3 cursor-pointer transition-colors hover:border-[var(--color-border-focus)]"
    >
      <div className="flex flex-col gap-1 mb-3">
        <p className="text-label-lg text-[var(--color-text-default)]">{title}</p>
        <p className="text-body-sm text-[var(--color-text-subtle)] line-clamp-2">{description}</p>
      </div>
      <div className="text-label-sm text-[var(--color-text-subtle)]">Created at: {createdAt}</div>
    </div>
  );
}

/* ----------------------------------------
   Section Title Component (TDS Style)
   ---------------------------------------- */
interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

/* ----------------------------------------
   Sub Label Component (TDS Style)
   ---------------------------------------- */
interface SubLabelProps {
  children: React.ReactNode;
}

function SubLabel({ children }: SubLabelProps) {
  return <p className="text-body-sm text-[var(--color-text-subtle)]">{children}</p>;
}

/* ----------------------------------------
   Main HomePage Component
   ---------------------------------------- */
export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        showSidebarToggle={false}
        showNavigation={true}
        onBack={() => window.history.back()}
        onForward={() => window.history.forward()}
        breadcrumb={<Breadcrumb items={[{ label: 'Home' }]} />}
        actions={
          <>
            <TopBarAction
              icon={<IconPalette size={16} stroke={1.5} />}
              aria-label="Design system"
              onClick={() => navigate('/design-system')}
            />
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          </>
        }
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
        <div className="px-8 py-6 pb-[120px] flex flex-col gap-[var(--spacing-6)]">
          {/* Header & Stats Cards */}
          <VStack gap={6}>
            <SectionTitle>Home</SectionTitle>

            {/* Stats Cards */}
            <div className="flex gap-[var(--spacing-2)] w-full">
              <StatCard value={10} label="Chat sessions" />
              <StatCard value={6} label="Agents" />
              <StatCard value={12} label="Data sources" />
              <StatCard value={4} label="Tools (My Servers)" />
            </div>
          </VStack>

          {/* Quick Action Section */}
          <VStack gap={4}>
            <SectionTitle>Quick action</SectionTitle>

            <div className="flex gap-[var(--spacing-2)] w-full">
              <QuickActionCard
                icon={<IconMessagePlus size={20} stroke={1.5} />}
                label="New chat"
                onClick={() => navigate('/chat')}
              />
              <QuickActionCard
                icon={<IconRobotFace size={20} stroke={1.5} />}
                label="New agent"
                highlighted
              />
              <QuickActionCard
                icon={<IconSquarePlus size={20} stroke={1.5} />}
                label="New data source"
              />
              <QuickActionCard icon={<IconPuzzle size={20} stroke={1.5} />} label="Manage tools" />
            </div>
          </VStack>

          {/* Recent Chats Section */}
          <VStack gap={6}>
            <SectionTitle>Recent chats</SectionTitle>

            {/* Today Section */}
            <VStack gap={2}>
              <SubLabel>Today</SubLabel>
              <VStack gap={2} className="w-full">
                <ChatItem
                  title="New Chat"
                  description="Analyze SQL queries and recommend optimal indexes"
                  createdAt="Sep 26, 2025"
                  onClick={() => navigate('/chat')}
                />
                <ChatItem
                  title="New Chat"
                  description="# 🎬 라따뚜이 등장인물 정리 대본 내용을 바탕으로 주요 등장인물들을 표로 정리해드릴게요! | 캐릭터명 | 종류/직책 | 특징 및 역할 | |---------|----------|----..."
                  createdAt="Sep 26, 2025"
                />
              </VStack>
            </VStack>

            {/* Last 7 days Section */}
            <VStack gap={2}>
              <SubLabel>Last 7 days</SubLabel>
              <VStack gap={2} className="w-full">
                <ChatItem
                  title="New Chat"
                  description="Analyze SQL queries and recommend optimal indexes"
                  createdAt="Sep 26, 2025"
                />
                <ChatItem
                  title="New Chat 222"
                  description="# 🎬 라따뚜이 등장인물 정리 대본 내용을 바탕으로 주요 등장인물들을 표로 정리해드릴게요! | 캐릭터명 | 종류/직책 | 특징 및 역할 | |---------|----------|----..."
                  createdAt="Sep 26, 2025"
                />
                <ChatItem
                  title="API 최적화 분석"
                  description="REST API 응답 시간을 개선하기 위한 캐싱 전략과 데이터베이스 쿼리 최적화 방법을 검토했습니다."
                  createdAt="Sep 25, 2025"
                />
                <ChatItem
                  title="코드 리뷰 요청"
                  description="새로운 인증 모듈에 대한 코드 리뷰를 진행하고 보안 취약점을 분석했습니다."
                  createdAt="Sep 25, 2025"
                />
                <ChatItem
                  title="데이터 마이그레이션"
                  description="레거시 시스템에서 새 데이터베이스로 마이그레이션하는 스크립트를 작성하고 검증했습니다."
                  createdAt="Sep 24, 2025"
                />
                <ChatItem
                  title="성능 테스트 결과"
                  description="로드 테스트 결과를 분석하고 병목 현상이 발생하는 구간을 식별했습니다."
                  createdAt="Sep 24, 2025"
                />
                <ChatItem
                  title="UI 컴포넌트 설계"
                  description="새로운 대시보드를 위한 재사용 가능한 UI 컴포넌트 라이브러리 설계를 논의했습니다."
                  createdAt="Sep 23, 2025"
                />
                <ChatItem
                  title="배포 자동화"
                  description="CI/CD 파이프라인을 구성하고 자동 배포 프로세스를 설정했습니다."
                  createdAt="Sep 23, 2025"
                />
                <ChatItem
                  title="에러 로깅 시스템"
                  description="중앙 집중식 에러 로깅 시스템을 구축하고 알림 설정을 완료했습니다."
                  createdAt="Sep 22, 2025"
                />
                <ChatItem
                  title="문서화 작업"
                  description="API 문서와 사용자 가이드를 업데이트하고 예제 코드를 추가했습니다."
                  createdAt="Sep 22, 2025"
                />
              </VStack>
            </VStack>
          </VStack>
        </div>
      </div>
    </>
  );
}

export default HomePage;
