import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, SNBMenuItem } from '@/design-system';
import {
  IconDatabase,
  IconPuzzle,
  IconSettings,
  IconMessages,
  IconRobotFace,
  IconArrowLeft,
} from '@tabler/icons-react';
import AgentLogo from '@/assets/icons/agent-logo.svg';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectSelector } from '@/components/ProjectSelector';

/* ----------------------------------------
   Agent Sidebar Component
   ---------------------------------------- */

export function AgentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  // Helper to check if path is active
  const isActive = (paths: string[]) => {
    return paths.some((path) =>
      path.endsWith('*')
        ? location.pathname.startsWith(path.slice(0, -1))
        : location.pathname === path
    );
  };

  return (
    <nav className="fixed left-0 top-0 w-[60px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col items-center pb-3 z-50">
      {/* Logo - Home/Dashboard link */}
      <Link
        to="/agent"
        className="border-b border-[var(--color-border-default)] flex h-[36px] items-center justify-center w-full hover:bg-[var(--color-surface-muted)] transition-colors shrink-0"
      >
        <img src={AgentLogo} alt="Agent" className="h-6 w-6" />
      </Link>

      {/* Sidebar Container */}
      <div className="flex flex-col flex-1 items-center justify-between pt-1.5 px-2 w-full min-h-0">
        {/* Top Section - Project & Navigation */}
        <div className="flex flex-col items-center w-full">
          {/* Back to All Services */}
          <div className="flex items-center justify-center py-1.5">
            <Tooltip content="All services" position="right">
              <Link
                to="/"
                className="size-[38px] rounded-lg bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center shrink-0"
              >
                <IconArrowLeft
                  size={20}
                  stroke={1.5}
                  className="text-[var(--color-text-default)]"
                />
              </Link>
            </Tooltip>
          </div>

          {/* Project Selector */}
          <div className="flex items-center justify-center py-1.5">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={setSelectedProjectId}
              variant="sidebar-icon"
            />
          </div>

          {/* Divider */}
          <div className="w-9 h-px bg-[var(--color-border-default)] my-1.5" />

          {/* Navigation Items */}
          <div className="flex flex-col gap-2 items-center">
            {/* Chat */}
            <Tooltip content="Chat" position="right">
              <SNBMenuItem
                isSelected={isActive(['/chat', '/chat/*'])}
                onClick={() => navigate('/chat')}
              >
                <IconMessages size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* Agent */}
            <Tooltip content="Agent" position="right">
              <SNBMenuItem
                isSelected={isActive([
                  '/agent/list',
                  '/agent/list/*',
                  '/agent/create',
                  '/agent/create/*',
                ])}
                onClick={() => navigate('/agent/list')}
              >
                <IconRobotFace size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* Data sources */}
            <Tooltip content="Data sources" position="right">
              <SNBMenuItem
                isSelected={isActive(['/agent/storage', '/agent/storage/*'])}
                onClick={() => navigate('/agent/storage')}
              >
                <IconDatabase size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* MCP Tools */}
            <Tooltip content="MCP tools" position="right">
              <SNBMenuItem
                isSelected={isActive(['/mcp-tools', '/mcp-tools/*'])}
                onClick={() => navigate('/mcp-tools')}
              >
                <IconPuzzle size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>
          </div>
        </div>

        {/* Bottom Section - Settings */}
        <div className="flex items-center justify-center">
          <Tooltip content="Settings" position="right">
            <SNBMenuItem onClick={() => navigate('/settings')}>
              <IconSettings size={20} stroke={1.5} />
            </SNBMenuItem>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}
