import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  Input,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconPlus, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface Tag {
  id: string;
  key: string;
  value: string;
}

export interface ManageTagsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  initialTags?: Tag[];
  maxTags?: number;
  onSave?: (tags: Tag[]) => void;
}

/* ----------------------------------------
   ManageTagsDrawer Component
   ---------------------------------------- */

export function ManageTagsDrawer({
  isOpen,
  onClose,
  instanceName,
  initialTags = [],
  maxTags = 50,
  onSave,
}: ManageTagsDrawerProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags.length > 0 ? initialTags : [
    { id: 'tag-1', key: '', value: '' },
    { id: 'tag-2', key: 'e.g. team', value: 'e.g. team' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tags.length >= maxTags) return;
    
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      key: '',
      value: '',
    };
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleUpdateTag = (tagId: string, field: 'key' | 'value', newValue: string) => {
    setTags(tags.map(tag => 
      tag.id === tagId ? { ...tag, [field]: newValue } : tag
    ));
  };

  const handleClearField = (tagId: string, field: 'key' | 'value') => {
    setTags(tags.map(tag => 
      tag.id === tagId ? { ...tag, [field]: '' } : tag
    ));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Filter out empty tags
      const validTags = tags.filter(tag => tag.key.trim() !== '' || tag.value.trim() !== '');
      await onSave?.(validTags);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTags(initialTags.length > 0 ? initialTags : [
      { id: 'tag-1', key: '', value: '' },
      { id: 'tag-2', key: 'e.g. team', value: 'e.g. team' },
    ]);
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
          <Button 
            variant="secondary" 
            onClick={handleClose}
            size="md"
            className="w-[152px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Manage Tags
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Tags are used to categorize and manage resources.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance Name</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Tags Section */}
        <VStack gap={3}>
          {/* Section Header */}
          <VStack gap={2}>
            <HStack gap={1.5} align="center">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Tags</span>
              <span className="text-[12px] text-[var(--color-text-muted)]">(Optional)</span>
            </HStack>
            <div className="text-[12px] text-[var(--color-text-muted)] leading-4">
              <p className="mb-0">A tag consists of a Key that defines the resource category and a Value that describes it.</p>
              <p>Keys must be unique and 1-256 characters long. A maximum of {maxTags} tags can be added. ({tags.length}/{maxTags})</p>
            </div>
          </VStack>

          {/* Add Tag Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddTag}
            disabled={tags.length >= maxTags}
            className="w-fit"
          >
            <IconPlus size={12} />
            Add Tag
          </Button>

          {/* Tag Rows */}
          <VStack gap={2}>
            {tags.map((tag, index) => (
              <TagRow
                key={tag.id}
                tag={tag}
                isFirst={index === 0}
                onUpdateKey={(value) => handleUpdateTag(tag.id, 'key', value)}
                onUpdateValue={(value) => handleUpdateTag(tag.id, 'value', value)}
                onClearKey={() => handleClearField(tag.id, 'key')}
                onClearValue={() => handleClearField(tag.id, 'value')}
                onRemove={() => handleRemoveTag(tag.id)}
              />
            ))}
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

/* ----------------------------------------
   TagRow Component
   ---------------------------------------- */

interface TagRowProps {
  tag: Tag;
  isFirst: boolean;
  onUpdateKey: (value: string) => void;
  onUpdateValue: (value: string) => void;
  onClearKey: () => void;
  onClearValue: () => void;
  onRemove: () => void;
}

function TagRow({ 
  tag, 
  isFirst,
  onUpdateKey, 
  onUpdateValue, 
  onClearKey, 
  onClearValue, 
  onRemove 
}: TagRowProps) {
  const hasKeyValue = tag.key !== '' || tag.value !== '';

  return (
    <div className="flex items-center gap-6 px-4 py-2 border border-[var(--color-border-default)] rounded-md bg-[var(--color-surface-default)]">
      {/* Key Field */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-[14px] font-medium text-[var(--color-text-default)] w-[40px]">Key</span>
        <div className="flex-1 relative">
          <input
            type="text"
            value={tag.key}
            onChange={(e) => onUpdateKey(e.target.value)}
            placeholder="e.g. team"
            className="w-full px-2.5 py-2 text-[12px] text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md outline-none focus:border-[var(--color-action-primary)] placeholder:text-[var(--color-text-muted)]"
          />
          {!isFirst && tag.key && (
            <button 
              onClick={onClearKey}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
            >
              <IconX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Value Field */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-[14px] font-medium text-[var(--color-text-default)] w-[40px]">Value</span>
        <div className="flex-1 relative">
          <input
            type="text"
            value={tag.value}
            onChange={(e) => onUpdateValue(e.target.value)}
            placeholder="e.g. team"
            className="w-full px-2.5 py-2 text-[12px] text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md outline-none focus:border-[var(--color-action-primary)] placeholder:text-[var(--color-text-muted)]"
          />
          {!isFirst && tag.value && (
            <button 
              onClick={onClearValue}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
            >
              <IconX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Remove Button */}
      <button 
        onClick={onRemove}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] p-1"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

export default ManageTagsDrawer;


