import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TagItem {
  id: string;
  key: string;
  value: string;
}

export interface EditObjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objectName?: string;
  initialTags?: TagItem[];
  onSubmit?: (name: string, tags: TagItem[]) => void;
}

/* ----------------------------------------
   EditObjectDrawer Component
   ---------------------------------------- */

export function EditObjectDrawer({
  isOpen,
  onClose,
  objectName = '',
  initialTags = [],
  onSubmit,
}: EditObjectDrawerProps) {
  const [name, setName] = useState(objectName);
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(objectName);
      setTags(
        initialTags.length > 0
          ? initialTags
          : [
              { id: '1', key: '30', value: '30' },
              { id: '2', key: '30', value: '30' },
            ]
      );
    }
  }, [isOpen, objectName, initialTags]);

  const handleAddTag = () => {
    const newTag: TagItem = {
      id: `tag-${Date.now()}`,
      key: '',
      value: '',
    };
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleTagChange = (tagId: string, field: 'key' | 'value', value: string) => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, [field]: value } : tag)));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(name, tags);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(objectName);
    setTags(initialTags);
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
            disabled={isSubmitting || !name.trim()}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3}>
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit Object</h2>

        <VStack gap={4} className="w-full">
          {/* Folder Name Input */}
          <VStack gap={2} className="w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Folder Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="{Current Folder Name}"
              fullWidth
            />
          </VStack>

          {/* Tags Section */}
          <VStack gap={1} className="w-full">
            <HStack justify="between" className="w-full">
              <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                Tags
              </label>
              <Button variant="primary" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </HStack>

            {/* Tags Table */}
            <VStack gap={1} className="w-full">
              {/* Table Header */}
              <div className="flex items-center w-full bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                <div className="flex-1 px-3 py-2.5">
                  <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                    Key
                  </span>
                </div>
                <div className="flex-1 px-3 py-2.5">
                  <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                    Value
                  </span>
                </div>
                <div className="w-10 p-3" />
              </div>

              {/* Table Rows */}
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                >
                  <div className="flex-1 px-3 py-2">
                    <input
                      type="text"
                      value={tag.key}
                      onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                      className="w-20 px-2.5 py-1 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md leading-4 outline-none focus:border-[var(--color-action-primary)]"
                      placeholder="Key"
                    />
                  </div>
                  <div className="flex-1 px-3 py-2">
                    <input
                      type="text"
                      value={tag.value}
                      onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                      className="w-20 px-2.5 py-1 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md leading-4 outline-none focus:border-[var(--color-action-primary)]"
                      placeholder="Value"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.id)}
                      className="p-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <IconX size={16} className="text-[var(--color-text-default)]" />
                    </button>
                  </div>
                </div>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditObjectDrawer;
