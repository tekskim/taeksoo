import { HStack } from '@/design-system';
import { IconDatabase, IconDatabaseOff } from '@tabler/icons-react';

export type DataMode = 'empty' | 'few' | 'many';

interface DataTestToolbarProps {
  mode: DataMode;
  onChange: (mode: DataMode) => void;
}

const MODES: { value: DataMode; label: string }[] = [
  { value: 'empty', label: 'Empty' },
  { value: 'few', label: 'Few' },
  { value: 'many', label: 'Many' },
];

export function DataTestToolbar({ mode, onChange }: DataTestToolbarProps) {
  return (
    <HStack
      gap={1}
      align="center"
      className="fixed bottom-4 right-4 z-[200] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] px-2 py-1.5 shadow-lg"
    >
      {mode === 'empty' ? (
        <IconDatabaseOff size={14} className="text-[var(--color-text-subtle)] mr-1" />
      ) : (
        <IconDatabase size={14} className="text-[var(--color-text-subtle)] mr-1" />
      )}
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-2.5 py-1 rounded-[var(--radius-md)] text-label-sm transition-colors ${
            mode === m.value
              ? 'bg-[var(--color-action-primary)] text-white'
              : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)]'
          }`}
        >
          {m.label}
        </button>
      ))}
    </HStack>
  );
}

/**
 * Helper to generate "many" items from a source array by duplicating with unique IDs.
 */
export function multiplyData<T extends { id: string }>(source: T[], targetCount: number): T[] {
  if (source.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < targetCount; i++) {
    const item = source[i % source.length];
    result.push({ ...item, id: `${item.id}-dup-${i}` });
  }
  return result;
}
