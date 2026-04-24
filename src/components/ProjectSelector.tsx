import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconFolder, IconDotsVertical } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { type Project } from '@/contexts/ProjectContext';
import { Tooltip, Badge, ContextMenu, SearchInput, ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
  /** ID of the primary project (displays "Primary" badge) */
  primaryProjectId?: string;
  /** Callback to set/unset primary project */
  onSetPrimary?: (projectId: string) => void;
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
  primaryProjectId,
  onSetPrimary,
  variant = 'default',
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [primaryModalTarget, setPrimaryModalTarget] = useState<Project | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <button
      ref={buttonRef}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={buttonClass}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
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
      {variant === 'sidebar-icon' && selectedProject ? (
        <Tooltip
          content={<div className="max-w-[var(--tooltip-max-width)]">{selectedProject.name}</div>}
          position="right"
        >
          {buttonElement}
        </Tooltip>
      ) : (
        buttonElement
      )}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl shadow-lg p-2 flex flex-col gap-2"
            style={{
              top: getDropdownPosition().top,
              left: getDropdownPosition().left,
              width: getDropdownPosition().width,
              maxHeight: '400px',
            }}
          >
            {/* Search Input */}
            <SearchInput
              placeholder="Search tenants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              fullWidth
              autoFocus
            />

            {/* Tenant List */}
            <OverlayScrollbarsComponent
              options={{
                overflow: { x: 'hidden', y: 'scroll' },
                scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
              }}
              defer={false}
              style={{ maxHeight: 300 }}
            >
              <div className="flex flex-col gap-2">
                {filteredProjects.map((project) => {
                  const isSelected = project.id === selectedProjectId;
                  const isPrimary = project.id === primaryProjectId;
                  const isDisabled = project.disabled;

                  const contextMenuItems =
                    onSetPrimary && !isPrimary
                      ? [
                          {
                            id: 'set-primary',
                            label: 'Set primary tenant',
                            onClick: () => setPrimaryModalTarget(project),
                          },
                        ]
                      : [];

                  return (
                    <div
                      key={project.id}
                      className={`
                        w-full text-left pl-3 pr-2 py-2 rounded-lg border transition-colors
                        ${isSelected ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]' : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex flex-col gap-2">
                        {/* Row 1: tenant name + dots menu */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            className="flex-1 text-left min-w-0"
                            onClick={() => handleProjectClick(project)}
                            disabled={isDisabled}
                          >
                            <span className="text-label-md text-[var(--color-text-default)]">
                              {project.name}
                            </span>
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            {isPrimary && (
                              <Badge theme="white" size="sm">
                                Primary
                              </Badge>
                            )}
                            {!isDisabled &&
                              onSetPrimary &&
                              (isPrimary ? (
                                <button
                                  type="button"
                                  className="size-5 flex items-center justify-center rounded text-[var(--color-text-disabled)] cursor-not-allowed"
                                  disabled
                                >
                                  <IconDotsVertical size={14} stroke={1.5} />
                                </button>
                              ) : (
                                <ContextMenu items={contextMenuItems} trigger="click">
                                  <button
                                    type="button"
                                    className="size-5 flex items-center justify-center rounded hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <IconDotsVertical size={14} stroke={1.5} />
                                  </button>
                                </ContextMenu>
                              ))}
                          </div>
                        </div>

                        {/* Row 2: description */}
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => handleProjectClick(project)}
                          disabled={isDisabled}
                        >
                          <p className="text-body-sm text-[var(--color-text-default)]">
                            {project.description}
                          </p>
                        </button>

                        {/* Row 3: ID */}
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => handleProjectClick(project)}
                          disabled={isDisabled}
                        >
                          <span className="text-[11px] leading-4 text-[var(--color-text-muted)]">
                            ID: {project.id}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <div className="text-center py-4 text-body-sm text-[var(--color-text-muted)]">
                    No tenants found
                  </div>
                )}
              </div>
            </OverlayScrollbarsComponent>
          </div>,
          document.body
        )}

      {/* Set Primary Tenant Modal */}
      {primaryModalTarget && (
        <ConfirmModal
          isOpen={!!primaryModalTarget}
          onClose={() => setPrimaryModalTarget(null)}
          title="Set primary tenant"
          description={`Set ${primaryModalTarget.name} as your primary tenant? This tenant will be selected by default when you open the Compute app.`}
          confirmText="Save"
          cancelText="Cancel"
          confirmVariant="primary"
          onConfirm={() => {
            onSetPrimary?.(primaryModalTarget.id);
            setPrimaryModalTarget(null);
          }}
          size="sm"
        />
      )}
    </>
  );
}

export default ProjectSelector;
