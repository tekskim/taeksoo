import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SearchInput, TopBar, TopBarAction, PageShell, TabBar } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  agentName: string;
}

const mockChatHistory: ChatHistoryItem[] = [
  {
    id: 'chat-1',
    title: 'New Chat',
    preview: 'Analyze SQL queries and recommend optimal indexes',
    createdAt: '2025-09-26',
    agentName: 'SQL Optimizer',
  },
  {
    id: 'chat-2',
    title: 'New Chat',
    preview:
      '# 🎬 라따뚜이 등장인물 정리 대본 내용을 바탕으로 주요 등장인물들을 표로 정리해드릴게요! | 캐릭터명 | 종류/직책 | 특징 및 역할 | |---------|----------|----...',
    createdAt: '2025-09-26',
    agentName: 'Code Reviewer',
  },
  {
    id: 'chat-3',
    title: 'New Chat',
    preview: 'Analyze SQL queries and recommend optimal indexes',
    createdAt: '2025-09-20',
    agentName: 'Data Analyst',
  },
  {
    id: 'chat-4',
    title: 'New Chat 222',
    preview:
      '# 🎬 라따뚜이 등장인물 정리 대본 내용을 바탕으로 주요 등장인물들을 표로 정리해드릴게요! | 캐릭터명 | 종류/직책 | 특징 및 역할 | |---------|----------|----...',
    createdAt: '2025-09-20',
    agentName: 'DevOps Helper',
  },
];

function ChatHistoryCard({
  item,
  query,
  onClick,
}: {
  item: ChatHistoryItem;
  query: string;
  onClick: () => void;
}) {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[var(--color-action-primary)]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-3 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      <div className="flex flex-col gap-1">
        <p className="text-heading-h6 text-[var(--color-text-default)]">
          {highlightText(item.title, query)}
        </p>
        <p className="text-body-sm text-[var(--color-text-subtle)] line-clamp-2">
          {highlightText(item.preview, query)}
        </p>
      </div>
      <div className="flex items-center">
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          Created at:{' '}
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

function groupByDate(items: ChatHistoryItem[]): { label: string; items: ChatHistoryItem[] }[] {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const todayItems: ChatHistoryItem[] = [];
  const lastWeekItems: ChatHistoryItem[] = [];
  const olderItems: ChatHistoryItem[] = [];

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    if (date.toDateString() === today.toDateString()) {
      todayItems.push(item);
    } else if (date >= sevenDaysAgo) {
      lastWeekItems.push(item);
    } else {
      olderItems.push(item);
    }
  });

  const groups: { label: string; items: ChatHistoryItem[] }[] = [];
  if (todayItems.length > 0) groups.push({ label: 'Today', items: todayItems });
  if (lastWeekItems.length > 0) groups.push({ label: 'Last 7 days', items: lastWeekItems });
  if (olderItems.length > 0) groups.push({ label: 'Older', items: olderItems });

  return groups;
}

export function ChatSearchPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return mockChatHistory;
    const q = searchQuery.toLowerCase();
    return mockChatHistory.filter(
      (item) => item.title.toLowerCase().includes(q) || item.preview.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedChats = useMemo(() => groupByDate(filteredChats), [filteredChats]);

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={false}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="p-0"
    >
      <div className="flex flex-1 min-h-0 h-full">
        <ChatSidebar />

        <div className="flex-1 flex flex-col h-full bg-[var(--color-surface-default)]">
          <div className="flex-1 flex flex-col items-center overflow-y-auto">
            <div className="w-full max-w-[659px] flex flex-col gap-3 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-heading-h4 text-[var(--color-text-default)]">Search</h4>
                <Button variant="primary" size="md" onClick={() => navigate('/chat')}>
                  New chat
                </Button>
              </div>

              <SearchInput
                placeholder="Search the chat"
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />

              <div className="flex flex-col gap-3">
                {groupedChats.map((group) => (
                  <div key={group.label} className="flex flex-col gap-2">
                    <p className="text-body-sm text-[var(--color-text-subtle)]">{group.label}</p>
                    {group.items.map((item) => (
                      <ChatHistoryCard
                        key={item.id}
                        item={item}
                        query={searchQuery}
                        onClick={() => navigate(`/chat/${item.id}`)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {filteredChats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <p className="text-body-lg text-[var(--color-text-muted)]">No chats found</p>
                  <p className="text-body-md text-[var(--color-text-subtle)]">
                    Try adjusting your search query.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default ChatSearchPage;
