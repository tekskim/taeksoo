import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
  HStack,
  Button,
} from '@/design-system';
import { AgentSidebar } from '@/pages/AgentPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconMessage,
  IconMessagePlus,
  IconRobot,
  IconRobotFace,
  IconDatabase,
  IconSquarePlus,
  IconPuzzle,
  IconBell,
  IconPalette,
} from '@tabler/icons-react';
// import { Icons } from '@/design-system'; // Temporarily disabled for debugging

/* ----------------------------------------
   Card Component
   ---------------------------------------- */
interface CardProps {
  title?: string;
  bgColor?: string;
  className?: string;
  children: React.ReactNode;
}

function Card({ title, bgColor = 'bg-[var(--color-surface-default)]', className = '', children }: CardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 ${className}`}>
      {title && (
        <h4 className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */
interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-[#fafafa] flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px p-4 rounded-lg">
      <div className="flex flex-col items-start pb-1 pt-0 px-0 relative shrink-0 w-full">
        <div className="flex flex-col font-medium justify-center relative shrink-0 text-[20px] leading-normal text-[var(--color-text-default)] w-full">
          <p>{value}</p>
        </div>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col font-normal justify-center relative shrink-0 text-[var(--color-text-muted)] text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] w-full">
          <p>{label}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Quick Action Card Component
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
      className={`bg-[var(--color-surface-subtle)] flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px p-4 rounded-lg transition-colors hover:bg-[var(--color-surface-muted)] ${
        highlighted ? 'border border-[var(--color-action-primary)]' : ''
      }`}
    >
      <div className="flex flex-col items-start pb-1 pt-0 px-0 relative shrink-0 w-full">
        <div className="flex items-start justify-start shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col items-start font-normal justify-start relative shrink-0 text-[var(--color-text-muted)] text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] w-full">
          <p className="text-left">{label}</p>
        </div>
      </div>
    </button>
  );
}

/* ----------------------------------------
   Chat Item Component
   ---------------------------------------- */
interface ChatItemProps {
  title: string;
  description: string;
  createdAt: string;
}

function ChatItem({ title, description, createdAt, onClick }: ChatItemProps & { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex flex-col gap-3 items-start px-4 py-3 rounded-lg cursor-pointer hover:border-[var(--color-border-focus)] transition-colors"
    >
      <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
        <p className="font-medium leading-[length:var(--line-height-20)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-14)]">
          {title}
        </p>
        <p className="font-normal leading-[length:var(--line-height-16)] min-w-full relative shrink-0 text-[var(--color-text-subtle)] text-[length:var(--font-size-11)] w-[min-content] whitespace-pre-wrap line-clamp-2">
          {description}
        </p>
      </div>
      <div className="flex gap-0 items-center relative shrink-0">
        <div className="flex gap-1 items-center justify-center px-0 py-0.5 relative rounded-full shrink-0">
          <div className="flex flex-col font-medium justify-center relative shrink-0 text-[var(--color-text-subtle)] text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] whitespace-nowrap">
            <p>Created at: {createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main HomePage Component
   ---------------------------------------- */
export function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex w-full">
      <AgentSidebar />

      <main className="flex flex-1 flex-col min-h-screen bg-[var(--color-surface-default)] ml-[60px]">
        <div className="w-full flex flex-col min-h-screen">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={() => navigate('/')}
          />

          <TopBar
            showSidebarToggle={false}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconPalette size={16} stroke={1} />}
                  aria-label="Design System"
                  onClick={() => navigate('/design-system')}
                />
                <TopBarAction
                  icon={<IconBell size={16} stroke={1} />}
                  aria-label="Notifications"
                  badge={true}
                />
              </>
            }
          />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* EntryPage Content */}
          <div className="px-8 py-6 pb-[120px] flex flex-col gap-6">
          {/* Header & Stats Cards */}
              <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
                {/* Title */}
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-semibold leading-[length:var(--line-height-28)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-18)]">
                      Home
                    </p>
                  </div>
                </div>
                {/* Stats Cards */}
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <StatCard value={10} label="Chat sessions" />
                  <StatCard value={6} label="Agents" />
                  <StatCard value={12} label="Data sources" />
                  <StatCard value={4} label="Tools (My Servers)" />
                </div>
              </div>

              {/* Quick Action Section */}
              <div className="flex flex-col gap-4 items-start min-w-[1176px] relative shrink-0 w-full">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-semibold leading-[length:var(--line-height-28)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-18)]">
                      Quick action
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <QuickActionCard
                    icon={<IconMessagePlus size={20} stroke={1} />}
                    label="New chat"
                    onClick={() => navigate('/chat')}
                  />
                  <QuickActionCard
                    icon={<IconRobotFace size={20} stroke={1} />}
                    label="New agent"
                    highlighted
                  />
                  <QuickActionCard
                    icon={<IconSquarePlus size={20} stroke={1} />}
                    label="New data source"
                  />
                  <QuickActionCard
                    icon={<IconPuzzle size={20} stroke={1} />}
                    label="Manage tools"
                  />
                </div>
              </div>

              {/* Recent Chats Section */}
              <div className="flex flex-col gap-6 items-start min-w-[1176px] relative shrink-0 w-full">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-semibold leading-[length:var(--line-height-28)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-18)]">
                      Recent chats
                    </p>
                  </div>
                </div>

                {/* Today Section */}
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <p className="font-normal leading-[length:var(--line-height-16)] relative shrink-0 text-[var(--color-text-subtle)] text-[length:var(--font-size-11)] w-full">
                    Today
                  </p>
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
                </div>

                {/* Last 7 days Section */}
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <p className="font-normal leading-[length:var(--line-height-16)] relative shrink-0 text-[var(--color-text-subtle)] text-[length:var(--font-size-11)] w-full">
                    Last 7 days
                  </p>
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
                      title="New Chat 222"
                      description="# 🎬 라따뚜이 등장인물 정리 대본 내용을 바탕으로 주요 등장인물들을 표로 정리해드릴게요! | 캐릭터명 | 종류/직책 | 특징 및 역할 | |---------|----------|----..."
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
                </div>
              </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
