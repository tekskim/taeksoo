import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconSearch, IconCheck, IconFolder } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import { type Project } from '@/contexts/ProjectContext';
import { Tooltip } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
  /** Variant style: 'default' for sidebar, 'compact' for TopBar, 'sidebar-icon' for AgentSidebar */
  variant?: 'default' | 'compact' | 'sidebar-icon';
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
  variant = 'default',
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Filter projects by search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleProjectClick = (project: Project) => {
    if (project.disabled) return;
    onProjectSelect(project.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Get project initial (first letter of project name)
  const projectInitial = selectedProject?.name?.charAt(0).toUpperCase() || 'P';

  // Calculate dropdown position - for sidebar-icon, position to the right
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 280 };
    const rect = buttonRef.current.getBoundingClientRect();
    if (variant === 'sidebar-icon') {
      return {
        top: rect.top,
        left: rect.right + 4,
        width: 320,
      };
    }
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 280),
    };
  };

  const buttonClass =
    variant === 'compact'
      ? 'px-2.5 py-1 h-[var(--topbar-button-size)] rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between gap-2'
      : variant === 'sidebar-icon'
        ? 'size-[38px] rounded-lg bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center shrink-0'
        : 'w-full px-2.5 py-1.5 rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between';

  const buttonElement = (
    <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className={buttonClass}>
      {variant === 'sidebar-icon' ? (
        <IconFolder size={20} className="text-[var(--color-text-muted)]" stroke={1.5} />
      ) : (
        <>
          <span
            className={`font-medium text-[var(--color-text-default)] ${variant === 'compact' ? 'text-label-md' : 'text-label-sm'}`}
          >
            {selectedProject?.name || 'Select Project'}
          </span>
          <ArrowRightLeft
            size={variant === 'compact' ? 14 : 12}
            className="text-[var(--color-text-default)] shrink-0"
            strokeWidth={1.5}
          />
        </>
      )}
    </button>
  );

  return (
    <>
      {/* Trigger Button with Tooltip for sidebar-icon variant */}
      {variant === 'sidebar-icon' && selectedProject ? (
        <Tooltip
          content={
            <div
              style={{
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedProject.name}
            </div>
          }
          position="right"
        >
          {buttonElement}
        </Tooltip>
      ) : (
        buttonElement
      )}

      {/* Dropdown Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg p-3 flex flex-col gap-2"
            style={{
              top: getDropdownPosition().top,
              left: getDropdownPosition().left,
              width: getDropdownPosition().width,
              maxHeight: '400px',
            }}
          >
            {/* Search Input */}
            <div className="flex items-center justify-between px-2.5 py-1.5 border border-[var(--color-border-strong)] rounded-md bg-[var(--color-surface-default)]">
              <input
                type="text"
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-body-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] outline-none"
                autoFocus
              />
              <IconSearch size={12} className="text-[var(--color-text-muted)]" />
            </div>

            {/* Project List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] sidebar-scroll">
              {filteredProjects.map((project) => {
                const isSelected = project.id === selectedProjectId;
                const isDisabled = project.disabled;

                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    disabled={isDisabled}
                    className={`
                      w-full text-left px-3 py-2 rounded-md border transition-colors
                      ${
                        isSelected
                          ? 'border-2 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]'
                          : 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)]'
                      }
                      ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex flex-col gap-1.5">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-label-md ${
                            isDisabled
                              ? 'text-[var(--color-text-muted)]'
                              : 'text-[var(--color-text-default)]'
                          }`}
                        >
                          {project.name}
                        </span>
                        {isSelected && !isDisabled && (
                          <IconCheck
                            size={20}
                            className="text-[var(--color-action-primary)]"
                            stroke={1}
                          />
                        )}
                        {isDisabled && (
                          <span className="text-body-sm text-[var(--color-status-error)]">
                            Disabled
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className={`text-body-sm leading-4 ${
                          isDisabled
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text-subtle)]'
                        }`}
                      >
                        {project.description}
                      </p>

                      {/* Footer */}
                      <div
                        className={`flex items-center justify-between text-body-xs ${
                          isDisabled
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text-subtle)]'
                        }`}
                      >
                        <span>ID: {project.id}</span>
                        <span>{project.createdAt}</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className="text-center py-4 text-body-sm text-[var(--color-text-muted)]">
                  No projects found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default ProjectSelector;
