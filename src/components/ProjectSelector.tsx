import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconSearch, IconCheck } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  disabled?: boolean;
}

export interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

export const mockProjects: Project[] = [
  {
    id: '04ebfa43',
    name: 'Project-01',
    description: "Development environment for the 'service' backend services.",
    createdAt: '2025-10-22',
  },
  {
    id: '14ebfa44',
    name: 'Project-02',
    description: "Development environment for the 'service' backend services.",
    createdAt: '2025-10-22',
  },
  {
    id: '24ebfa45',
    name: 'Project-03',
    description: "Development environment for the 'service' backend services.",
    createdAt: '2025-10-22',
  },
  {
    id: '34ebfa46',
    name: 'Project-04',
    description: "Development environment for the 'service' backend services.",
    createdAt: '2025-10-22',
    disabled: true,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
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

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 280),
    };
  };

  const handleProjectClick = (project: Project) => {
    if (project.disabled) return;
    onProjectSelect(project.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between"
      >
        <span className="text-[11px] font-medium text-[var(--color-text-default)]">
          {selectedProject?.name || 'Select Project'}
        </span>
        <ArrowRightLeft
          size={12}
          className="text-[var(--color-text-default)]"
          strokeWidth={1.5}
        />
      </button>

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
                className="flex-1 bg-transparent text-[11px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] outline-none"
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
                          className={`text-[12px] font-medium ${
                            isDisabled
                              ? 'text-[var(--color-text-muted)]'
                              : 'text-[var(--color-text-default)]'
                          }`}
                        >
                          {project.name}
                        </span>
                        {isSelected && !isDisabled && (
                          <IconCheck
                            size={16}
                            className="text-[var(--color-action-primary)]"
                            stroke={1}
                          />
                        )}
                        {isDisabled && (
                          <span className="text-[11px] text-[var(--color-status-error)]">
                            Disabled
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className={`text-[11px] leading-4 ${
                          isDisabled
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text-subtle)]'
                        }`}
                      >
                        {project.description}
                      </p>

                      {/* Footer */}
                      <div
                        className={`flex items-center justify-between text-[10px] ${
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
                <div className="text-center py-4 text-[11px] text-[var(--color-text-muted)]">
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

