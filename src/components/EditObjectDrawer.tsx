import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

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

const DEFAULT_TAGS: TagItem[] = [];

export function EditObjectDrawer({
  isOpen,
  onClose,
  objectName = '',
  initialTags = DEFAULT_TAGS,
  onSubmit,
}: EditObjectDrawerProps) {
  const [name, setName] = useState(objectName);
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(objectName);
      setHasAttemptedSubmit(false);
      setNameError(null);
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
    setHasAttemptedSubmit(true);

    if (!name.trim()) {
      setNameError('Please enter a folder name.');
      return;
    }
    setNameError(null);

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
    setHasAttemptedSubmit(false);
    setNameError(null);
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
            disabled={isSubmitting}
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
          <FormField required error={!!nameError}>
            <FormField.Label>Folder Name</FormField.Label>
            <FormField.Control>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="{Current Folder Name}"
                fullWidth
                error={!!nameError}
              />
            </FormField.Control>
            <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          </FormField>

          {/* Tags Section */}
          <VStack gap={3} className="w-full">
            <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={2}>
                {tags.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                    <span className="block text-label-lg text-[var(--color-text-default)]">
                      Key
                    </span>
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
                  >
                    Add Tag
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditObjectDrawer;
