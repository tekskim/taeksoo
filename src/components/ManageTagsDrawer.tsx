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
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Tags are used to categorize and manage resources.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance Name</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Tags Section */}
        <VStack gap={3}>
          {/* Tags Header */}
          <VStack gap={2}>
            <HStack gap={1.5} align="center">
              <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
            </HStack>
            <div className="text-body-md text-[var(--color-text-subtle)] leading-4">
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

          {/* Add Tag Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddTag}
            disabled={tags.length >= maxTags}
            className="w-fit"
          >
            <IconCirclePlus size={12} className="mr-1.5" />
            Add Tag
          </Button>

          {/* Tag Rows */}
          <VStack gap={2}>
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-6 px-4 py-2 border border-[var(--color-border-default)] rounded-md bg-white"
                style={{ width: '648px' }}
              >
                {/* Key Field */}
                <HStack gap={3} align="center" className="flex-1 min-w-0">
                  <span className="text-label-lg text-[var(--color-text-default)] shrink-0">
                    Key
                  </span>
                  <Input
                    value={tag.key}
                    onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                    placeholder="e.g. team"
                    fullWidth
                  />
                </HStack>

                {/* Value Field */}
                <HStack gap={3} align="center" className="flex-1 min-w-0">
                  <span className="text-label-lg text-[var(--color-text-default)] shrink-0">
                    Value
                  </span>
                  <Input
                    value={tag.value}
                    onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                    placeholder="e.g. team"
                    fullWidth
                  />
                </HStack>

                {/* Remove Tag Button */}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded shrink-0"
                >
                  <IconX size={16} className="text-[var(--color-text-default)]" />
                </button>
              </div>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageTagsDrawer;
