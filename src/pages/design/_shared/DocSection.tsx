import type { ReactNode } from 'react';
import { VStack } from '@/design-system';

interface DocSectionProps {
  id?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DocSection({ id, title, description, actions, children }: DocSectionProps) {
  return (
    <div id={id} className="scroll-mt-6">
      <div className="w-full h-px bg-[var(--color-border-default)]" />
      <VStack gap={5} align="stretch" className="pt-8 pb-4">
        <div className="flex items-center justify-between">
          <VStack gap={1} align="start">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h3>
            {description && (
              <p className="text-body-md text-[var(--color-text-muted)]">{description}</p>
            )}
          </VStack>
          {actions}
        </div>
        {children}
      </VStack>
    </div>
  );
}
