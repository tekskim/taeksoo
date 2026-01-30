import { useState, useEffect } from 'react';
import { Drawer, Button } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  children?: FolderNode[];
}

export interface MoveFilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
  folders?: FolderNode[];
  onSubmit?: (targetPath: string) => void;
}

/* ----------------------------------------
   FolderTreeItem Component
   ---------------------------------------- */

interface FolderTreeItemProps {
  folder: FolderNode;
  level: number;
  selectedPath: string | null;
  expandedFolders: Set<string>;
  onSelect: (path: string) => void;
  onToggle: (folderId: string) => void;
}

function FolderTreeItem({
  folder,
  level,
  selectedPath,
  expandedFolders,
  onSelect,
  onToggle,
}: FolderTreeItemProps) {
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = selectedPath === folder.path;

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-1 h-6 cursor-pointer rounded transition-colors hover:bg-[var(--color-surface-subtle)] ${
          isSelected ? 'text-[var(--color-action-primary)]' : ''
        }`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => onSelect(folder.path)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <button
            type="button"
            className="p-0 bg-transparent border-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
          >
            {isExpanded ? (
              <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
            ) : (
              <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Folder Icon */}
        {isExpanded && hasChildren ? (
          <IconFolderOpen
            size={16}
            className={
              isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'
            }
          />
        ) : (
          <IconFolder
            size={16}
            className={
              isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'
            }
          />
        )}

        {/* Folder Name */}
        <span
          className={`text-label-sm leading-4 truncate ${
            isSelected ? ' text-[var(--color-action-primary)]' : 'text-[var(--color-text-default)]'
          }`}
        >
          {folder.name}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Default Mock Folders
   ---------------------------------------- */

const DEFAULT_FOLDERS: FolderNode[] = [
  {
    id: 'folder-a',
    name: 'folder A',
    path: '/folder A',
    children: [
      {
        id: 'folder-b',
        name: 'folder B',
        path: '/folder A/folder B',
      },
      {
        id: 'folder-c',
        name: 'folder C',
        path: '/folder A/folder C',
        children: [
          {
            id: 'folder-d',
            name: 'folder D',
            path: '/folder A/folder C/folder D',
            children: [
              {
                id: 'folder-e',
                name: 'folder E',
                path: '/folder A/folder C/folder D/folder E',
                children: [
                  {
                    id: 'folder-f',
                    name: 'folder F',
                    path: '/folder A/folder C/folder D/folder E/folder F',
                    children: [
                      {
                        id: 'folder-g',
                        name: 'folder G',
                        path: '/folder A/folder C/folder D/folder E/folder F/folder G',
                        children: [
                          {
                            id: 'folder-h',
                            name: 'folder B',
                            path: '/folder A/folder C/folder D/folder E/folder F/folder G/folder B',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ----------------------------------------
   MoveFilesDrawer Component
   ---------------------------------------- */

export function MoveFilesDrawer({
  isOpen,
  onClose,
  currentPath = 'folder/~',
  folders = DEFAULT_FOLDERS,
  onSubmit,
}: MoveFilesDrawerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['folder-a', 'folder-c', 'folder-d', 'folder-e', 'folder-f', 'folder-g'])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedPath(null);
    }
  }, [isOpen]);

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedPath) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedPath);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPath(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPath}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Moving...' : 'Move'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Move Files</h2>

        {/* Folder Path and Location */}
        <VStack gap={3} className="w-full">
          {/* Folder Path (read-only) */}
          <VStack gap={2} className="w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Folder path
            </label>
            <div className="w-full px-[10px] py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md">
              <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
                {currentPath}
              </span>
            </div>
          </VStack>

          {/* Folder Location Tree */}
          <div className="w-full p-[13px] bg-white border border-[var(--color-border-default)] rounded-[10px]">
            <VStack gap={3}>
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Folder location
              </span>
              <div className="w-full">
                {folders.map((folder) => (
                  <FolderTreeItem
                    key={folder.id}
                    folder={folder}
                    level={0}
                    selectedPath={selectedPath}
                    expandedFolders={expandedFolders}
                    onSelect={setSelectedPath}
                    onToggle={handleToggleFolder}
                  />
                ))}
              </div>
            </VStack>
          </div>

          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            Choose a parent folder to create this folder in.
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default MoveFilesDrawer;
