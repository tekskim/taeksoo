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
  IconCheck,
  IconCopy,
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
        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[var(--color-text-default)] w-full">
          <p className="leading-[normal] whitespace-pre-wrap">{value}</p>
        </div>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col font-[family-name:var(--fontfamily/sans,'Mona_Sans:Regular',sans-serif)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--color-text-muted)] text-[length:var(--fontsize/sm,11px)] w-full">
          <p className="leading-[var(--lineheight/sm,16px)] whitespace-pre-wrap">{label}</p>
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
      className={`bg-[#fafafa] flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px p-4 rounded-lg transition-colors hover:bg-[var(--color-surface-muted)] ${
        highlighted ? 'border border-[var(--color-action-primary)]' : ''
      }`}
    >
      <div className="flex flex-col items-start pb-1 pt-0 px-0 relative shrink-0 w-full">
        <div className="flex items-start justify-start shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col items-start font-[family-name:var(--fontfamily/sans,'Mona_Sans:Regular',sans-serif)] justify-start leading-[0] not-italic relative shrink-0 text-[color:var(--color-text-muted)] text-[length:var(--fontsize/sm,11px)] w-full">
          <p className="leading-[var(--lineheight/sm,16px)] whitespace-pre-wrap text-left">{label}</p>
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
      <div className="flex flex-col gap-1 items-start not-italic relative shrink-0 w-full">
        <p className="font-[family-name:var(--primitive/fontfamily/sans,'Mona_Sans:Medium',sans-serif)] leading-[var(--primitive/lineheight/md,20px)] relative shrink-0 text-[color:var(--color-text-default)] text-[length:var(--primitive/fontsize/md,14px)]">
          {title}
        </p>
        <p className="font-[family-name:var(--fontfamily/sans,'Mona_Sans:Regular',sans-serif)] leading-[var(--lineheight/sm,16px)] min-w-full relative shrink-0 text-[color:var(--color-text-subtle)] text-[length:var(--fontsize/sm,11px)] w-[min-content] whitespace-pre-wrap line-clamp-2">
          {description}
        </p>
      </div>
      <div className="flex gap-0 items-center relative shrink-0">
        <div className="flex gap-1 items-center justify-center px-0 py-0.5 relative rounded-full shrink-0">
          <div className="flex flex-col font-[family-name:var(--font-family-sans,'Mona_Sans:Medium',sans-serif)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--color/text/subtle,#64748b)] text-[length:var(--font-size-11,11px)] whitespace-nowrap">
            <p className="leading-[var(--line-height-16,16px)]">Created at: {createdAt}</p>
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
  const [copied, setCopied] = useState(false);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();
  
  const projectId = 'proj-abc123-def456';
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex w-full">
      <AgentSidebar />

      <main className="flex flex-1 flex-col min-h-screen bg-[var(--color-surface-default)] ml-[62px]">
        <div className="w-full flex flex-col min-h-screen">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
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
          <div className="px-8 py-6">
          {/* PROJECT INFO Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 flex flex-col justify-between mb-6">
            <div className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2 uppercase">PROJECT INFO</div>
            <div>
              <h3 className="text-[32px] font-semibold text-[var(--color-text-default)] mb-4">proj-1</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-[var(--color-text-muted)] mb-1">ID</div>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-[var(--color-text-default)]">{projectId}</span>
                  <button 
                    onClick={handleCopyId}
                    className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors"
                    title={copied ? 'Copied!' : 'Copy ID'}
                  >
                    {copied ? (
                      <IconCheck size={12} className="text-[var(--color-state-success)]" />
                    ) : (
                      <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-text-muted)] mb-1">Description</div>
                <p className="text-[12px] text-[var(--color-text-default)]">
                  Development environment for the 'service' backend services.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <StatCard value={10} label="Chat sessions" />
                <StatCard value={6} label="Agents" />
                <StatCard value={12} label="Data sources" />
                <StatCard value={4} label="Tools (My Servers)" />
              </div>

              {/* Quick Action Section */}
              <div className="flex flex-col gap-6 items-start min-w-[1176px] relative shrink-0 w-full">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-[family-name:var(--fontfamily/sans,'Mona_Sans:SemiBold',sans-serif)] leading-[var(--lineheight/xl,28px)] not-italic relative shrink-0 text-[color:var(--color-text-default)] text-[length:var(--fontsize/xl,18px)]">
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
                    <p className="font-[family-name:var(--fontfamily/sans,'Mona_Sans:SemiBold',sans-serif)] leading-[var(--lineheight/xl,28px)] not-italic relative shrink-0 text-[color:var(--color-text-default)] text-[length:var(--fontsize/xl,18px)]">
                      Recent chats
                    </p>
                  </div>
                </div>

                {/* Today Section */}
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <p className="font-[family-name:var(--fontfamily/sans,'Mona_Sans:Regular',sans-serif)] leading-[var(--lineheight/sm,16px)] not-italic relative shrink-0 text-[color:var(--color-text-subtle)] text-[length:var(--fontsize/sm,11px)] w-full whitespace-pre-wrap">
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
                  <p className="font-[family-name:var(--fontfamily/sans,'Mona_Sans:Regular',sans-serif)] leading-[var(--lineheight/sm,16px)] not-italic relative shrink-0 text-[color:var(--color-text-subtle)] text-[length:var(--fontsize/sm,11px)] w-full whitespace-pre-wrap">
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
