import { Fragment, useState } from 'react';
import { Drawer, Button, Input, FormField, FileListSection } from '@/design-system';
import type { FileItem } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import {
  IconUpload,
  IconX,
  IconCirclePlus,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconFolderOpen,
} from '@tabler/icons-react';
import type { FolderNode } from './CreateFolderDrawer';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  count: number;
}

interface Tag {
  id: string;
  key: string;
  value: string;
}

type AclType = 'individual' | 'inherit';
type Grantee = 'owner' | 'everyone' | 'authenticated';
type Permission = 'full' | 'read' | 'write';

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
              <IconChevronDown size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
            ) : (
              <IconChevronRight
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-subtle)]"
              />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        {isExpanded && hasChildren ? (
          <IconFolderOpen
            size={16}
            stroke={1.5}
            className={
              isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'
            }
          />
        ) : (
          <IconFolder
            size={16}
            stroke={1.5}
            className={
              isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-subtle)]'
            }
          />
        )}
        <span
          className={`text-label-sm leading-4 truncate ${
            isSelected ? ' text-[var(--color-action-primary)]' : 'text-[var(--color-text-default)]'
          }`}
        >
          {folder.name}
        </span>
      </div>
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

const DEFAULT_FOLDERS: FolderNode[] = [
  {
    id: 'folder-a',
    name: 'folder A',
    path: '/folder A',
    children: [
      { id: 'folder-b', name: 'folder B', path: '/folder A/folder B' },
      {
        id: 'folder-c',
        name: 'folder C',
        path: '/folder A/folder C',
        children: [{ id: 'folder-d', name: 'folder D', path: '/folder A/folder C/folder D' }],
      },
    ],
  },
];

export interface CreateObjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
  onSubmit?: (data: {
    files: UploadedFile[];
    aclType: AclType;
    grantee: Grantee;
    permission: Permission;
    tags: Tag[];
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const GRANTEE_OPTIONS = [
  { value: 'owner', label: 'Owner' },
  { value: 'everyone', label: 'Everyone' },
  { value: 'authenticated', label: 'Authenticated user' },
];

const PERMISSION_OPTIONS = [
  { value: 'full', label: 'Full control' },
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
];

/* ----------------------------------------
   CreateObjectDrawer Component
   ---------------------------------------- */

export function CreateObjectDrawer({
  isOpen,
  onClose,
  currentPath = '/folder/current-directory',
  onSubmit,
}: CreateObjectDrawerProps) {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: '1', name: 'document.pdf', type: 'pdf', size: '2.5 MB', count: 10 },
    { id: '2', name: 'image.png', type: 'png', size: '1.2 MB', count: 1 },
    { id: '3', name: 'data.json', type: 'json', size: '45 KB', count: 1 },
  ]);
  const [aclType, setAclType] = useState<AclType>('individual');
  const [grantee, setGrantee] = useState<Grantee>('owner');
  const [permission, setPermission] = useState<Permission>('full');
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', key: '30', value: '30' },
    { id: '2', key: '30', value: '30' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(DEFAULT_FOLDERS[0]?.path ?? null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-a']));

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleAddTag = () => {
    const newTag: Tag = {
      id: Date.now().toString(),
      key: '',
      value: '',
    };
    setTags((prev) => [...prev, newTag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const handleTagChange = (tagId: string, field: 'key' | 'value', value: string) => {
    setTags((prev) => prev.map((t) => (t.id === tagId ? { ...t, [field]: value } : t)));
  };

  const handleUploadClick = () => {
    // In a real implementation, this would open a file picker
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: `file-${files.length + 1}.txt`,
      type: 'txt',
      size: '1 KB',
      count: 1,
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (files.length === 0) {
      setFilesError('Please upload at least one file.');
      return;
    }
    setFilesError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.({ files, aclType, grantee, permission, tags });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Object"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        {/* Folder Path */}
        <FormField required>
          <FormField.Label>Folder path</FormField.Label>
          <FormField.Control>
            <Input value={selectedPath ?? ''} placeholder={currentPath} fullWidth readOnly />
          </FormField.Control>
        </FormField>

        {/* Folder Location Tree */}
        <VStack gap={3} className="w-full">
          <div className="w-full p-[13px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)]">
            <VStack gap={3}>
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Folder location
              </span>
              <div className="w-full">
                {DEFAULT_FOLDERS.map((folder) => (
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

        {/* Upload Files Section */}
        <FileListSection
          label="Upload Files"
          required
          files={files.map(
            (f): FileItem => ({
              id: f.id,
              name: f.name,
              tags: f.count > 1 ? [f.size, `${f.count} files`] : [f.size],
            })
          )}
          onRemove={handleRemoveFile}
          onUpload={() => {
            handleUploadClick();
            if (filesError) setFilesError(null);
          }}
          uploadLabel="Choose file"
          uploadIcon={<IconUpload size={12} stroke={1.5} />}
          error={filesError}
          emptyMessage=""
        />

        {/* Tags Section */}
        <VStack gap={3} className="w-full">
          <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>

          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center">
              {tags.length > 0 && (
                <>
                  <span className="text-label-sm text-[var(--color-text-default)]">Key</span>
                  <span className="text-label-sm text-[var(--color-text-default)]">Value</span>
                  <div />
                </>
              )}
              {tags.map((tag) => (
                <Fragment key={tag.id}>
                  <Input
                    placeholder="tag key"
                    value={tag.key}
                    onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                    fullWidth
                  />
                  <Input
                    placeholder="tag value"
                    value={tag.value}
                    onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={14} className="text-[var(--color-text-muted)]" />
                  </button>
                </Fragment>
              ))}
            </div>
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCirclePlus size={12} />}
                onClick={handleAddTag}
              >
                Add Tag
              </Button>
            </div>
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateObjectDrawer;
