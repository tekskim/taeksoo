import { useState } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TagItem {
  id: string;
  key: string;
  value: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface ManageTagsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  initialTags?: TagItem[];
  onSave?: (tags: TagItem[]) => void;
  maxTags?: number;
}

/* ----------------------------------------
   ManageTagsDrawer Component
   ---------------------------------------- */

export function ManageTagsDrawer({
  isOpen,
  onClose,
  instance,
  initialTags = [],
  onSave,
  maxTags = 50,
}: ManageTagsDrawerProps) {
  const [tags, setTags] = useState<TagItem[]>(
    initialTags.length > 0
      ? initialTags
      : [
          { id: '1', key: '', value: '' },
          { id: '2', key: 'e.g. team', value: 'e.g. team' },
        ]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tags.length >= maxTags) return;

    const newTag: TagItem = {
      id: Date.now().toString(),
      key: '',
      value: '',
    };
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleTagChange = (tagId: string, field: 'key' | 'value', newValue: string) => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, [field]: newValue } : tag)));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Filter out empty tags
      const validTags = tags.filter((tag) => tag.key.trim() !== '');
      await onSave?.(validTags);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTags(initialTags.length > 0 ? initialTags : []);
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
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Manage Tags
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Tags are used to categorize and manage resources.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance name</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Tags Section */}
        <VStack gap={3}>
          {/* Tags Header */}
          <VStack gap={2}>
            <HStack gap={1.5} align="center">
              <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">(Optional)</span>
            </HStack>
            <div className="text-body-sm text-[var(--color-text-subtle)]">
              <p className="mb-0">
                A tag consists of a Key that defines the resource category and a Value that
                describes it.
              </p>
              <p>
                Keys must be unique and 1-256 characters long. A maximum of {maxTags} tags can be
                added. ({tags.length}/{maxTags})
              </p>
            </div>
          </VStack>

          {/* Tag Container */}
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
                    type="button"
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
                  disabled={tags.length >= maxTags}
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

export default ManageTagsDrawer;
