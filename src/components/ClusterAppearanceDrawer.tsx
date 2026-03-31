import { useState, useEffect } from 'react';
import { Drawer, FormField, Input, HStack, VStack, Button } from '@/design-system';
import { IconAffiliate } from '@tabler/icons-react';
import { useClusterAppearance } from '@/hooks/useClusterAppearance';

interface ClusterAppearanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clusterId: string;
  clusterName?: string;
}

function ClusterIconPreview({ iconText, size = 32 }: { iconText: string; size?: number }) {
  const chars = Array.from(iconText.trim());
  const text = chars.slice(0, 3).join('').toUpperCase();

  if (text.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-text-default)]"
        style={{ width: size, height: size }}
      >
        <IconAffiliate size={size * 0.5} stroke={1.5} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] font-semibold select-none border border-[var(--color-border-strong)]"
      style={{
        width: size,
        height: size,
        fontSize: text.length === 1 ? size * 0.45 : text.length === 2 ? size * 0.38 : size * 0.3,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}
    >
      {text}
    </div>
  );
}

export function ClusterAppearanceDrawer({
  isOpen,
  onClose,
  clusterId,
}: ClusterAppearanceDrawerProps) {
  const { getAppearance, saveAppearance } = useClusterAppearance();
  const [iconText, setIconText] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [iconTextError, setIconTextError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = getAppearance(clusterId);
      setIconText(saved.iconText);
      setHasAttemptedSubmit(false);
      setIconTextError(null);
    }
  }, [isOpen, clusterId, getAppearance]);

  const handleIconTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chars = Array.from(e.target.value);
    const raw = chars.slice(0, 3).join('');
    setIconText(raw);
    if (hasAttemptedSubmit) setIconTextError(null);
  };

  const handleSave = () => {
    setHasAttemptedSubmit(true);
    saveAppearance(clusterId, { iconText });
    onClose();
  };

  const previewText = Array.from(iconText.trim()).slice(0, 3).join('').toUpperCase();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Cluster appearance"
      width={720}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Preview */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)]">Preview</span>
          <div className="flex gap-6 items-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            {/* Menu style preview */}
            <VStack gap={2} align="center">
              <span
                className="text-body-xs text-[var(--color-text-subtle)] uppercase tracking-widest"
                style={{ fontSize: 10 }}
              >
                Menu Style
              </span>
              <div className="p-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <ClusterIconPreview iconText={previewText} size={32} />
              </div>
            </VStack>
          </div>
        </VStack>

        {/* Icon Text field */}
        <FormField
          label="Icon text"
          helperText="Up to 3 characters in any language. Leave blank to use the default icon."
          error={hasAttemptedSubmit && !!iconTextError}
        >
          <Input
            value={iconText}
            onChange={handleIconTextChange}
            placeholder=""
            fullWidth
            error={hasAttemptedSubmit && !!iconTextError}
          />
          {hasAttemptedSubmit && iconTextError && (
            <FormField.ErrorMessage>{iconTextError}</FormField.ErrorMessage>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default ClusterAppearanceDrawer;
