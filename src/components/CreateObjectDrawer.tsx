import { useState } from 'react';
import { Drawer, Button, Input, Select, Radio, FormField, FileListSection } from '@/design-system';
import type { FileItem } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconUpload, IconX, IconCirclePlus } from '@tabler/icons-react';

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
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Create Object
        </h2>

        {/* Folder Path */}
        <FormField>
          <FormField.Label>Folder path</FormField.Label>
          <FormField.Control>
            <div className="w-full px-2.5 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md">
              <span className="text-body-sm text-[var(--color-text-subtle)]">{currentPath}</span>
            </div>
          </FormField.Control>
        </FormField>

        {/* Upload Files Section */}
        <FileListSection
          label="Upload Files"
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
          uploadLabel="Upload a File"
          uploadIcon={<IconUpload size={12} stroke={1.5} />}
          error={filesError}
          emptyMessage=""
        />

        {/* ACL Section */}
        <VStack gap={3} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">ACL</label>

          {/* ACL Type Radio */}
          <HStack gap={6}>
            <Radio
              checked={aclType === 'individual'}
              onChange={() => setAclType('individual')}
              label="Individual settings"
            />
            <Radio
              checked={aclType === 'inherit'}
              onChange={() => setAclType('inherit')}
              label="Inherit from bucket"
            />
          </HStack>

          {/* Grantee and Permissions */}
          {aclType === 'individual' && (
            <div className="w-full p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
              <VStack gap={1.5}>
                <FormField label="Grantee">
                  <Select
                    value={grantee}
                    onChange={(v) => setGrantee(v as Grantee)}
                    options={GRANTEE_OPTIONS}
                    width="half"
                  />
                </FormField>
                <FormField label="Permissions">
                  <Select
                    value={permission}
                    onChange={(v) => setPermission(v as Permission)}
                    options={PERMISSION_OPTIONS}
                    width="half"
                  />
                </FormField>
              </VStack>
            </div>
          )}

          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            Any changes to the ACL will overwrite previous one. You can choose any of the available
            options to modify the specified user group.
          </p>
        </VStack>

        {/* Tags Section */}
        <VStack gap={3} className="w-full">
          <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>

          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
            <VStack gap={2}>
              {tags.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                  <span className="block text-label-lg text-[var(--color-text-default)]">Key</span>
                  <span className="block text-label-lg text-[var(--color-text-default)]">
                    Value
                  </span>
                  <div />
                </div>
              )}
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                >
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
                    onClick={() => handleRemoveTag(tag.id)}
                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}

              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                  onClick={handleAddTag}
                >
                  Add Tag
                </Button>
              </div>
            </VStack>
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateObjectDrawer;
