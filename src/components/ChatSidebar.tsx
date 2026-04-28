import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip, ContextMenu } from '@/design-system';
import { IconPlus, IconDots, IconSearch } from '@tabler/icons-react';

interface ChatItem {
  id: string;
  label: string;
}

const mockChats: ChatItem[] = [
  { id: 'empty', label: 'Empty conversation' },
  { id: 'basic', label: 'Basic conversation' },
  { id: 'readonly', label: 'Read-only mode' },
  { id: 'no-datasource', label: 'No data source' },
  { id: 'full', label: 'Full conversation' },
];

interface ChatSidebarItemProps {
  chat: ChatItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function ChatSidebarItem({ chat, isSelected, onSelect }: ChatSidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { id: 'rename', label: 'Rename', onClick: () => {} },
    { id: 'share', label: 'Share', onClick: () => {} },
    { id: 'delete', label: 'Delete', status: 'danger' as const, divider: true, onClick: () => {} },
  ];

  const showMore = isSelected || isHovered;

  const bgClass = isSelected ? 'bg-[#e2e8f0]' : isHovered ? 'bg-[#f1f5f9]' : '';

  return (
    <div
      className={`flex h-[24px] items-center overflow-clip pl-[6px] rounded-[6px] shrink-0 w-full cursor-pointer transition-colors ${bgClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(chat.id)}
    >
      <p className="flex-1 min-w-0 text-[12px] leading-[16px] font-normal text-[var(--color-text-default)] truncate whitespace-nowrap overflow-hidden text-ellipsis">
        {chat.label}
      </p>
      {showMore ? (
        <ContextMenu items={menuItems} trigger="click">
          <button
            className="relative rounded-[6px] shrink-0 size-[24px] flex items-center justify-center hover:bg-[#f1f5f9] transition-colors"
            aria-label="More options"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDots
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)] rotate-90"
            />
          </button>
        </ContextMenu>
      ) : (
        <div className="shrink-0 w-[6px]" />
      )}
    </div>
  );
}

export function ChatSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentChatId =
    currentPath.startsWith('/chat/') && currentPath !== '/chat' && currentPath !== '/chat/search'
      ? currentPath.replace('/chat/', '')
      : null;

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`, {
      state: { agentName: 'Agent name' },
    });
  };

  return (
    <div className="bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] flex flex-col items-start relative h-full w-[200px] shrink-0">
      <div className="flex h-[24px] items-center justify-between mx-[8px] mt-[12px] w-[184px] shrink-0">
        <p className="text-[11px] leading-[16px] font-medium text-[var(--color-text-subtle)] whitespace-nowrap">
          Chats
        </p>
        <div className="flex gap-[4px] items-center justify-end shrink-0">
          <Tooltip content="Search">
            <button
              onClick={() => navigate('/chat/search')}
              className="relative rounded-[6px] shrink-0 size-[24px] hover:bg-[#f1f5f9] transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              <IconSearch size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
            </button>
          </Tooltip>
          <Tooltip content="New chat">
            <button
              onClick={() => navigate('/chat')}
              className="relative rounded-[6px] shrink-0 size-[24px] hover:bg-[#f1f5f9] transition-colors flex items-center justify-center"
              aria-label="New chat"
            >
              <IconPlus size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-[4px] items-start mx-[8px] mt-[12px] w-[184px] flex-1 overflow-y-auto min-h-0">
        {mockChats.map((chat) => (
          <ChatSidebarItem
            key={chat.id}
            chat={chat}
            isSelected={currentChatId === chat.id}
            onSelect={handleSelectChat}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
