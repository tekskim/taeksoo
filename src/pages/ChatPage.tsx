import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBarAction,
  VStack,
  Button,
} from '@/design-system';
import { AgentSidebar } from '@/pages/AgentPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconMessage,
  IconBell,
  IconSearch,
  IconPlus,
  IconDots,
} from '@tabler/icons-react';
import { Icons } from '@/design-system';

/* ----------------------------------------
   Chat Sidebar Component
   ---------------------------------------- */
function ChatSidebar() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] flex flex-col h-full items-start relative shrink-0 w-[200px]">
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-1 items-center justify-between px-2 pt-3 pb-2 w-full sticky top-0 bg-[var(--color-surface-subtle)] z-10">
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full">
            <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
              Chats
            </p>
            <div className="flex gap-1 items-center justify-end relative shrink-0">
              <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
                <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center"
              >
                <IconPlus size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-1 items-start px-2 w-full">
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 1
            </p>
            <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
              <IconDots size={12} stroke={1} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="flex h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 2
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 3
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 4
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main ChatPage Component
   ---------------------------------------- */
export function ChatPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex items-start" style={{ minWidth: '1440px', width: '1440px', height: '1020px' }}>
      <AgentSidebar />

      <main className="flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative shrink-0 bg-[var(--color-surface-default)] ml-[62px]">
        <div className="min-w-[var(--layout-content-min-width)] w-full h-full flex flex-col">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Main Content */}
          <div className="flex flex-1 items-start min-h-0 min-w-px relative shrink-0 w-full h-full">
            {/* Chat Sidebar */}
            <ChatSidebar />

            {/* Content Area */}
            <div className="flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative shrink-0">
              {/* Breadcrumb Navigation */}
              <div className="bg-[var(--color-surface-default)] flex items-center justify-end px-3 py-1 relative shrink-0 w-full">
                <div className="bg-[var(--color-surface-default)] flex items-center p-1 relative rounded-md shrink-0">
                  <TopBarAction
                    icon={<IconBell size={16} stroke={1} />}
                    aria-label="Notifications"
                    badge={true}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="bg-[var(--color-surface-default)] flex flex-[1_0_0] flex-col gap-6 items-center min-h-px min-w-px pb-3 pt-6 px-8 relative shrink-0 w-full">
                {/* Header */}
                <div className="flex flex-col gap-2 items-start justify-center relative shrink-0 w-full">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-['Mona_Sans:SemiBold',sans-serif] leading-7 not-italic relative shrink-0 text-[var(--color-text-default)] text-[18px]">
                      New Chat
                    </p>
                  </div>
                  <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 min-w-full not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[12px] w-[min-content] whitespace-pre-wrap">
                    Choose an agent and start a new chat.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex gap-0 items-center relative shrink-0 w-full">
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between min-w-[200px] pl-2.5 pr-2 py-1.5 relative rounded-md shrink-0 w-[280px]">
                    <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
                      Find agent with filters
                    </p>
                    <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)] shrink-0" />
                  </div>
                </div>

                {/* Empty State */}
                <div className="bg-[var(--color-surface-default)] flex flex-col gap-2 h-[240px] items-center justify-center px-[300px] py-[496px] relative shrink-0 w-full">
                  <div className="flex flex-col gap-2 h-11 items-center relative shrink-0">
                    <p className="font-['Mona_Sans:Medium',sans-serif] leading-5 not-italic relative shrink-0 text-[var(--color-text-default)] text-[14px]">
                      No Available Agents
                    </p>
                    <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] text-center">
                      Create a new agent or switch an existing agent to Active status.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/agent')}
                    >
                      View Agents
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;

