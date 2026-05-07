import { VStack, MenuItem, MenuSection, Button } from '@/design-system';
import {
  IconHome,
  IconMessageCircle,
  IconRobot,
  IconDatabase,
  IconApps,
  IconTemplate,
  IconFolder,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AIPlatformSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AIPlatformSidebar({ isOpen = true, onToggle }: AIPlatformSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/agent' && location.pathname.startsWith(href + '/')) return true;
    if (href === '/chat' && location.pathname.startsWith('/chat')) return true;
    return false;
  };

  if (!isOpen) return null;

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

      <nav className="flex-1 px-3 py-2 pb-6 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-[175px] min-w-0">
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
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
              icon={<IconRobot size={16} stroke={1.5} />}
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
              icon={<IconApps size={16} stroke={1.5} />}
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
      </OverlayScrollbarsComponent>
    </aside>
  );
}

export default AIPlatformSidebar;
