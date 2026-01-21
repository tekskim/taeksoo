import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

export interface CreateFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bucketName?: string;
  currentPath?: string;
  folders?: FolderNode[];
  onSubmit?: (folderName: string, parentPath: string) => void;
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
          <IconFolderOpen size={16} className={isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'} />
        ) : (
          <IconFolder size={16} className={isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'} />
        )}

        {/* Folder Name */}
        <span
          className={`text-[11px] leading-4 truncate ${
            isSelected
              ? 'font-medium text-[var(--color-action-primary)]'
              : 'text-[var(--color-text-default)]'
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
   CreateFolderDrawer Component
   ---------------------------------------- */

export function CreateFolderDrawer({
  isOpen,
  onClose,
  bucketName = 'bucket',
  currentPath = '/',
  folders = DEFAULT_FOLDERS,
  onSubmit,
}: CreateFolderDrawerProps) {
  const [folderName, setFolderName] = useState('');
  const [selectedPath, setSelectedPath] = useState<string | null>(currentPath);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-a']));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setSelectedPath(currentPath);
      setError(null);
    }
  }, [isOpen, currentPath]);

  // Validate folder name
  const validateFolderName = (name: string): string | null => {
    if (!name) return null;
    if (name.length > 128) return 'Folder name must be 128 characters or less';
    const validPattern = /^[a-zA-Z0-9\-_.\(\)\[\]]+$/;
    if (!validPattern.test(name)) {
      return 'Invalid characters. Allowed: letters, numbers, "-", "_", ".", "()", "[]"';
    }
    return null;
  };

  const handleFolderNameChange = (value: string) => {
    setFolderName(value);
    setError(validateFolderName(value));
  };

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
    const validationError = validateFolderName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(folderName, selectedPath || '/');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setSelectedPath(currentPath);
    setError(null);
    onClose();
  };

  // Compute display path
  const displayPath = selectedPath
    ? `${selectedPath}/${folderName || '~'}`
    : `/${folderName || '~'}`;

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
            disabled={isSubmitting || !folderName.trim() || !!error}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Create Folder
        </h2>

        {/* Folder Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Folder Name
          </label>
          <Input
            value={folderName}
            onChange={(e) => handleFolderNameChange(e.target.value)}
            placeholder="Name"
            fullWidth
            error={!!error}
          />
          <p className={`text-[11px] leading-4 ${error ? 'text-[var(--color-state-danger)]' : 'text-[var(--color-text-subtle)]'}`}>
            {error || 'Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"'}
          </p>
        </VStack>

        {/* Folder Path (read-only) */}
        <VStack gap={3} className="w-full">
          <VStack gap={2} className="w-full">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Folder path
            </label>
            <div className="w-full px-[10px] py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md">
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                {displayPath}
              </span>
            </div>
          </VStack>

          {/* Folder Location Tree */}
          <div className="w-full p-[13px] bg-white border border-[var(--color-border-default)] rounded-[10px]">
            <VStack gap={3}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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

          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Choose a parent folder to create this folder in.
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateFolderDrawer;
