import { useState } from 'react';
import { Drawer, Button, Input, Select, Radio } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconUpload, IconX, IconChevronDown } from '@tabler/icons-react';

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
  { value: 'authenticated', label: 'Authenticated User' },
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
            disabled={isSubmitting || files.length === 0}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3}>
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Create Object
        </h2>

        {/* Folder Path */}
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

        {/* Upload Files Section */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Upload Files
          </label>
          <Button variant="secondary" size="sm" onClick={handleUploadClick} className="w-fit">
            <IconUpload size={16} className="mr-1.5" />
            Upload a File
          </Button>

          {/* Files Table */}
          {files.length > 0 && (
            <div className="w-full flex flex-col gap-1">
              {/* Header */}
              <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                <div className="flex-1 px-3 py-2 h-10 flex items-center">
                  <span className="text-label-sm text-[var(--color-text-default)]">Name</span>
                  <IconChevronDown size={16} className="ml-1.5 text-[var(--color-text-subtle)]" />
                </div>
                <div className="flex-1 px-3 py-2 h-10 flex items-center">
                  <span className="text-label-sm text-[var(--color-text-default)]">Type</span>
                  <IconChevronDown size={16} className="ml-1.5 text-[var(--color-text-subtle)]" />
                </div>
                <div className="flex-1 px-3 py-2 h-10 flex items-center">
                  <span className="text-label-sm text-[var(--color-text-default)]">Size</span>
                  <IconChevronDown size={16} className="ml-1.5 text-[var(--color-text-subtle)]" />
                </div>
                <div className="flex-1 px-3 py-2 h-10 flex items-center">
                  <span className="text-label-sm text-[var(--color-text-default)]">Count</span>
                  <IconChevronDown size={16} className="ml-1.5 text-[var(--color-text-subtle)]" />
                </div>
                <div className="w-10 p-3" />
              </div>

              {/* Rows */}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                >
                  <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {file.type}
                    </span>
                  </div>
                  <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {file.size}
                    </span>
                  </div>
                  <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {file.count}
                    </span>
                  </div>
                  <div className="w-10 p-3 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-[var(--color-text-default)] hover:text-[var(--color-state-danger)] transition-colors"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </VStack>

        {/* ACL Section */}
        <VStack gap={4} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">ACL</label>

          {/* ACL Type Radio */}
          <HStack gap={6}>
            <Radio
              checked={aclType === 'individual'}
              onChange={() => setAclType('individual')}
              label="Individual Settings"
            />
            <Radio
              checked={aclType === 'inherit'}
              onChange={() => setAclType('inherit')}
              label="Inherit from Bucket"
            />
          </HStack>

          {/* Grantee and Permissions */}
          {aclType === 'individual' && (
            <div className="w-full p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
              <VStack gap={1.5}>
                <VStack gap={2}>
                  <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                    Grantee
                  </label>
                  <Select
                    value={grantee}
                    onChange={(v) => setGrantee(v as Grantee)}
                    options={GRANTEE_OPTIONS}
                    className="w-[276px]"
                  />
                </VStack>
                <HStack gap={1.5} align="center">
                  <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                    Permissions
                  </label>
                  <Select
                    value={permission}
                    onChange={(v) => setPermission(v as Permission)}
                    options={PERMISSION_OPTIONS}
                    className="w-[111px]"
                  />
                </HStack>
              </VStack>
            </div>
          )}

          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            Any changes to the ACL will overwrite previous one. You can choose any of the available
            options to modify the specified user group.
          </p>
        </VStack>

        {/* Tags Section */}
        <VStack gap={4} className="w-full">
          <HStack justify="between" className="w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">Tags</label>
            <Button variant="primary" size="sm" onClick={handleAddTag}>
              Add
            </Button>
          </HStack>

          {/* Tags Table */}
          <div className="w-full flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="flex-1 px-3 py-2 h-10 flex items-center">
                <span className="text-label-sm text-[var(--color-text-default)]">Key</span>
              </div>
              <div className="flex-1 px-3 py-2 h-10 flex items-center">
                <span className="text-label-sm text-[var(--color-text-default)]">Value</span>
              </div>
              <div className="w-10 p-3" />
            </div>

            {/* Rows */}
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
              >
                <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                  <Input
                    value={tag.key}
                    onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                    className="w-20"
                  />
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                  <Input
                    value={tag.value}
                    onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                    className="w-20"
                  />
                </div>
                <div className="w-10 p-3 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-[var(--color-text-default)] hover:text-[var(--color-state-danger)] transition-colors"
                  >
                    <IconX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateObjectDrawer;
