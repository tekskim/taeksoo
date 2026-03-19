import { type ReactNode, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { VStack } from '@/design-system';
import { IconArrowRight, IconCheck, IconX, IconClock } from '@tabler/icons-react';
import { DocSection } from './DocSection';
import { type PropDef } from './PropsTable';
import { TableOfContents } from './TableOfContents';
import { PrevNextNav } from './PrevNextNav';
import { useDesignLayoutContext } from '../DesignSystemLayout';
import { pageLastUpdated } from './navigationData';

export type { PropDef };

export interface RelatedLink {
  label: string;
  path: string;
  description?: string;
}

export interface StructureSpec {
  property: string;
  value: string;
  token?: string;
}

export type ComponentMaturity = 'draft' | 'beta' | 'stable';
export type ComponentStatus = 'planned' | 'desktop-only';

interface ComponentPageTemplateProps {
  title: string;
  description: string;
  category?: string;
  maturity?: ComponentMaturity;
  status?: ComponentStatus;
  tags?: string[];
  preview?: ReactNode;
  previewActions?: ReactNode;
  examples?: ReactNode;
  guidelines?: ReactNode;
  whenToUse?: string[];
  whenNotToUse?: string[];
  tokens?: ReactNode;
  structureSpecs?: { label: string; specs: StructureSpec[] }[];
  relatedLinks?: RelatedLink[];
  headerActions?: ReactNode;
  children?: ReactNode;
}

const maturityConfig: Record<ComponentMaturity, { label: string; color: string; bg: string }> = {
  draft: {
    label: 'Draft',
    color: 'var(--color-state-warning)',
    bg: 'var(--color-state-warning-bg)',
  },
  beta: {
    label: 'Beta',
    color: 'var(--color-state-info)',
    bg: 'var(--color-state-info-bg)',
  },
  stable: {
    label: 'Stable',
    color: 'var(--color-state-success)',
    bg: 'var(--color-state-success-bg)',
  },
};

const statusConfig: Record<ComponentStatus, { label: string; color: string; bg: string }> = {
  planned: {
    label: 'Implementation Pending',
    color: 'var(--color-state-warning)',
    bg: 'var(--color-state-warning-bg)',
  },
  'desktop-only': {
    label: 'Desktop App Only',
    color: 'var(--color-text-subtle)',
    bg: 'var(--color-surface-muted)',
  },
};

export function ComponentPageTemplate({
  title,
  description,
  maturity,
  status,
  tags,
  preview,
  previewActions,
  examples,
  guidelines,
  whenToUse,
  whenNotToUse,
  tokens,
  structureSpecs,
  children,
  relatedLinks,
  headerActions,
}: ComponentPageTemplateProps) {
  const mainRef = useDesignLayoutContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isCaptureMode = searchParams.get('capture') === 'true';
  const lastUpdated = pageLastUpdated[location.pathname];

  const tocItems = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (preview) items.push({ id: 'preview', label: 'Preview' });
    if (whenToUse || whenNotToUse) items.push({ id: 'when-to-use', label: 'When to use' });
    if (examples) items.push({ id: 'examples', label: 'Examples' });
    if (guidelines) items.push({ id: 'guidelines', label: 'Guidelines' });
    if (tokens || structureSpecs) items.push({ id: 'tokens', label: 'Design tokens' });
    if (relatedLinks && relatedLinks.length > 0) items.push({ id: 'related', label: 'Related' });
    return items;
  }, [
    preview,
    whenToUse,
    whenNotToUse,
    examples,
    guidelines,
    tokens,
    structureSpecs,
    relatedLinks,
  ]);

  return (
    <div className="relative">
      {!isCaptureMode && <TableOfContents items={tocItems} scrollContainerRef={mainRef} />}

      <VStack gap={10} align="stretch">
        {/* Page Header */}
        <VStack gap={2} align="start">
          <div className="flex items-center gap-2">
            <h2 className="text-heading-h3 text-[var(--color-text-default)]">{title}</h2>
            {maturity && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-body-xs font-medium"
                style={{
                  color: maturityConfig[maturity].color,
                  backgroundColor: maturityConfig[maturity].bg,
                }}
              >
                {maturityConfig[maturity].label}
              </span>
            )}
            {status && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-body-xs font-medium"
                style={{
                  color: statusConfig[status].color,
                  backgroundColor: statusConfig[status].bg,
                }}
              >
                {statusConfig[status].label}
              </span>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-body-xs font-medium bg-[var(--color-state-info-bg)] text-[var(--color-state-info)] border border-[var(--color-state-info)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-body-lg text-[var(--color-text-muted)]">{description}</p>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 mt-1">
              <IconClock size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Last updated{' '}
                {(() => {
                  const [y, m, d] = lastUpdated.split(' ')[0].split('-');
                  const months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ];
                  return `${months[parseInt(m) - 1]} ${d}, ${y}`;
                })()}
              </span>
            </div>
          )}
          {headerActions}
        </VStack>

        {/* Preview */}
        {preview && (
          <DocSection id="preview" title="Preview" actions={previewActions}>
            {preview}
          </DocSection>
        )}

        {/* When to use / When not to use */}
        {(whenToUse || whenNotToUse) && (
          <DocSection id="when-to-use" title="When to use">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whenToUse && whenToUse.length > 0 && (
                <div className="p-4 rounded-[var(--primitive-radius-lg)] border border-[var(--color-state-success)] bg-[var(--color-state-success-bg)]">
                  <div className="flex items-center gap-2 mb-3">
                    <IconCheck size={16} stroke={2} className="text-[var(--color-state-success)]" />
                    <span className="text-label-md text-[var(--color-state-success)]">
                      When to use
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {whenToUse.map((item, i) => (
                      <li key={i} className="text-body-md text-[var(--color-text-default)] pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {whenNotToUse && whenNotToUse.length > 0 && (
                <div className="p-4 rounded-[var(--primitive-radius-lg)] border border-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
                  <div className="flex items-center gap-2 mb-3">
                    <IconX size={16} stroke={2} className="text-[var(--color-state-danger)]" />
                    <span className="text-label-md text-[var(--color-state-danger)]">
                      When not to use
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {whenNotToUse.map((item, i) => (
                      <li key={i} className="text-body-md text-[var(--color-text-default)] pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DocSection>
        )}

        {/* Examples */}
        {examples && (
          <DocSection id="examples" title="Examples">
            {examples}
          </DocSection>
        )}

        {/* Legacy children slot */}
        {children}

        {/* Guidelines */}
        {guidelines && (
          <DocSection id="guidelines" title="Guidelines">
            {guidelines}
          </DocSection>
        )}

        {/* Design Tokens + Structure Specs */}
        {(tokens || structureSpecs) && (
          <DocSection id="tokens" title="Design tokens">
            <VStack gap={6} align="stretch">
              {tokens}
              {structureSpecs?.map((group) => (
                <VStack key={group.label} gap={2} align="stretch">
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                    {group.label}
                  </h4>
                  <div className="overflow-x-auto rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]">
                    <table className="w-full text-body-md">
                      <thead>
                        <tr className="bg-[var(--color-surface-muted)]">
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            Property
                          </th>
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            Value
                          </th>
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            Token
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.specs.map((spec, i) => (
                          <tr key={i} className="border-t border-[var(--color-border-subtle)]">
                            <td className="px-3 py-2 text-[var(--color-text-default)]">
                              {spec.property}
                            </td>
                            <td className="px-3 py-2 text-[var(--color-text-default)] font-mono text-body-sm">
                              {spec.value}
                            </td>
                            <td className="px-3 py-2 text-[var(--color-text-subtle)] font-mono text-body-sm">
                              {spec.token || '–'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>
              ))}
            </VStack>
          </DocSection>
        )}

        {/* Related Links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <VStack
            id="related"
            gap={4}
            align="stretch"
            className="scroll-mt-6 p-6 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]"
          >
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Related</h3>
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

        {/* Prev/Next Navigation */}
        <PrevNextNav />
      </VStack>
    </div>
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
