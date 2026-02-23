import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { VStack } from '@/design-system';
import { IconArrowRight } from '@tabler/icons-react';

export interface RelatedLink {
  label: string;
  path: string;
  description?: string;
}

interface ComponentPageTemplateProps {
  title: string;
  description: string;
  category?: string;
  children: ReactNode;
  relatedLinks?: RelatedLink[];
}

export function ComponentPageTemplate({
  title,
  description,
  children,
  relatedLinks,
}: ComponentPageTemplateProps) {
  return (
    <VStack gap={8} align="stretch">
      {/* Page Header */}
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">{title}</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">{description}</p>
      </VStack>

      {/* Page Content */}
      {children}

      {/* Related Links */}
      {relatedLinks && relatedLinks.length > 0 && (
        <VStack
          gap={4}
          align="stretch"
          className="pt-4 border-t border-[var(--color-border-subtle)]"
        >
          <h3 className="text-heading-h6 text-[var(--color-text-default)]">Related</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center justify-between gap-3 p-4 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <VStack gap={0.5} align="start" className="min-w-0">
                  <span className="text-label-md text-[var(--color-text-default)] group-hover:text-[var(--color-action-primary)] transition-colors">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      {link.description}
                    </span>
                  )}
                </VStack>
                <IconArrowRight
                  size={14}
                  stroke={1.5}
                  className="shrink-0 text-[var(--color-text-subtle)] group-hover:text-[var(--color-action-primary)] transition-colors"
                />
              </Link>
            ))}
          </div>
        </VStack>
      )}
    </VStack>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageSection({ title, description, children }: SectionProps) {
  return (
    <VStack
      gap={6}
      align="stretch"
      className="p-6 bg-[var(--color-surface-default)] rounded-[var(--radius-xl)]"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <VStack gap={1} align="start">
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">{title}</h3>
        {description && (
          <p className="text-body-md text-[var(--color-text-muted)]">{description}</p>
        )}
      </VStack>
      {children}
    </VStack>
  );
}
