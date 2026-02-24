import type { ReactNode } from 'react';
import { VStack } from '@/design-system';

interface DocSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocSection({ id, title, description, children }: DocSectionProps) {
  return (
    <VStack
      id={id}
      gap={5}
      align="stretch"
      className="scroll-mt-6 p-6 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]"
    >
      <VStack gap={1} align="start">
        <h3 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h3>
        {description && (
          <p className="text-body-md text-[var(--color-text-muted)]">{description}</p>
        )}
      </VStack>
      {children}
    </VStack>
  );
}
