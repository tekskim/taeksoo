import { VStack, MenuItem, MenuSection, Button } from '@/design-system';
import {
  IconFolderOpen,
  IconMessageCircle,
  IconDatabase,
  IconPuzzle,
  IconTemplate,
  IconFolder,
} from '@tabler/icons-react';

function IconAgent({
  size = 16,
  className,
}: {
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-0.5 -0.5 13 14.1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.9375 9.23901C4.625 9.68738 5.3125 9.91123 6 9.91123C6.6875 9.91123 7.375 9.68738 8.0625 9.23901M3.9375 3.18901L3.25 0.50012M8.0625 3.18901L8.75 0.50012M3.9375 6.55012V5.8779M8.0625 6.55012V5.8779M1.875 1.84456H10.125C10.4897 1.84456 10.8394 1.98621 11.0973 2.23834C11.3551 2.49048 11.5 2.83244 11.5 3.18901V11.2557C11.5 11.6122 11.3551 11.9542 11.0973 12.2063C10.8394 12.4585 10.4897 12.6001 10.125 12.6001H1.875C1.51033 12.6001 1.16059 12.4585 0.902728 12.2063C0.644866 11.9542 0.5 11.6122 0.5 11.2557V3.18901C0.5 2.83244 0.644866 2.49048 0.902728 2.23834C1.16059 1.98621 1.51033 1.84456 1.875 1.84456Z" />
    </svg>
  );
}
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AIPlatformSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  forceVisible?: boolean;
}

export function AIPlatformSidebar({
  isOpen = true,
  onToggle,
  forceVisible,
}: AIPlatformSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/agent' && location.pathname.startsWith(href + '/')) return true;
    if (href === '/chat' && location.pathname.startsWith('/chat')) return true;
    return false;
  };

  if (!isOpen && !forceVisible) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="agent-ops" onToggleSidebar={onToggle} />

      <div className="px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center"
          onClick={() => navigate('/agent/create')}
        >
          Create project
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconFolderOpen size={16} stroke={1.5} />}
            label="Home"
            href="/agent"
            active={isActive('/agent')}
          />

          <MenuSection title="Chat" defaultOpen={true}>
            <MenuItem
              icon={<IconMessageCircle size={16} stroke={1.5} />}
              label="Chatting"
              href="/chat"
              active={isActive('/chat')}
            />
          </MenuSection>

          <MenuSection title="Agent Builder" defaultOpen={true}>
            <MenuItem
              icon={<IconAgent size={16} stroke={1.5} />}
              label="Agent"
              href="/agent/list"
              active={isActive('/agent/list')}
            />
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Datasource"
              href="/agent/datasource"
              active={isActive('/agent/datasource')}
            />
            <MenuItem
              icon={<IconPuzzle size={16} stroke={1.5} />}
              label="MCP catalog"
              href="/agent/mcp-catalog"
              active={isActive('/agent/mcp-catalog')}
            />
          </MenuSection>

          <MenuSection title="Admin management" defaultOpen={true}>
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="MCP templates"
              href="/agent/mcp-templates"
              active={isActive('/agent/mcp-templates')}
            />
            <MenuItem
              icon={<IconFolder size={16} stroke={1.5} />}
              label="Projects"
              href="/agent/projects"
              active={isActive('/agent/projects')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default AIPlatformSidebar;
