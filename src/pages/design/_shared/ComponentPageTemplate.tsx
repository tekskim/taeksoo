import { type ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VStack } from '@/design-system';
import { IconArrowRight, IconCheck, IconX, IconClock } from '@tabler/icons-react';
import { DocSection } from './DocSection';
import { PropsTable, type PropDef } from './PropsTable';
import { CodeBlock } from './CodeBlock';
import { NotionDesignNotes } from './NotionDesignNotes';
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

export interface KeyboardInteraction {
  key: string;
  description: string;
}

export interface StructureSpec {
  property: string;
  value: string;
  token?: string;
}

interface ComponentPageTemplateProps {
  title: string;
  description: string;
  category?: string;
  preview?: ReactNode;
  usage?: { code: string; description?: string };
  examples?: ReactNode;
  guidelines?: ReactNode;
  whenToUse?: string[];
  whenNotToUse?: string[];
  tokens?: ReactNode;
  structureSpecs?: { label: string; specs: StructureSpec[] }[];
  apiReference?: PropDef[];
  subComponentApis?: { name: string; props: PropDef[] }[];
  accessibility?: ReactNode;
  keyboardInteractions?: KeyboardInteraction[];
  relatedLinks?: RelatedLink[];
  children?: ReactNode;
  notionPageId?: string;
}

export function ComponentPageTemplate({
  title,
  description,
  preview,
  usage,
  examples,
  guidelines,
  whenToUse,
  whenNotToUse,
  tokens,
  structureSpecs,
  apiReference,
  subComponentApis,
  accessibility,
  keyboardInteractions,
  children,
  relatedLinks,
  notionPageId,
}: ComponentPageTemplateProps) {
  const mainRef = useDesignLayoutContext();
  const location = useLocation();
  const lastUpdated = pageLastUpdated[location.pathname];

  const tocItems = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (preview) items.push({ id: 'preview', label: 'Preview' });
    if (usage) items.push({ id: 'usage', label: 'Usage' });
    if (whenToUse || whenNotToUse) items.push({ id: 'when-to-use', label: 'When to use' });
    if (examples) items.push({ id: 'examples', label: 'Examples' });
    if (guidelines) items.push({ id: 'guidelines', label: 'Guidelines' });
    if (tokens || structureSpecs) items.push({ id: 'tokens', label: 'Design tokens' });
    if (apiReference || subComponentApis) items.push({ id: 'api', label: 'API Reference' });
    if (accessibility || keyboardInteractions)
      items.push({ id: 'accessibility', label: 'Accessibility' });
    if (relatedLinks && relatedLinks.length > 0) items.push({ id: 'related', label: 'Related' });
    return items;
  }, [
    preview,
    usage,
    whenToUse,
    whenNotToUse,
    examples,
    guidelines,
    tokens,
    structureSpecs,
    apiReference,
    subComponentApis,
    accessibility,
    keyboardInteractions,
    relatedLinks,
  ]);

  return (
    <div className="relative">
      <TableOfContents items={tocItems} scrollContainerRef={mainRef} />

      <VStack gap={10} align="stretch">
        {/* Page Header */}
        <VStack gap={2} align="start">
          <h2 className="text-heading-h3 text-[var(--color-text-default)]">{title}</h2>
          <p className="text-body-lg text-[var(--color-text-muted)]">{description}</p>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 mt-1">
              <IconClock size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Last updated {lastUpdated}
              </span>
            </div>
          )}
        </VStack>

        {/* Preview */}
        {preview && (
          <DocSection id="preview" title="Preview">
            {preview}
          </DocSection>
        )}

        {/* Usage */}
        {usage && (
          <DocSection id="usage" title="Usage" description={usage.description}>
            <CodeBlock code={usage.code} language="tsx" />
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

        {/* Design Notes (from Notion) */}
        {notionPageId && <NotionDesignNotes notionPageId={notionPageId} />}

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

        {/* API Reference */}
        {(apiReference || subComponentApis) && (
          <DocSection id="api" title="API Reference">
            <VStack gap={6} align="stretch">
              {apiReference && <PropsTable props={apiReference} name={title + 'Props'} />}
              {subComponentApis?.map((sub) => (
                <PropsTable key={sub.name} props={sub.props} name={sub.name} />
              ))}
            </VStack>
          </DocSection>
        )}

        {/* Accessibility */}
        {(accessibility || keyboardInteractions) && (
          <DocSection id="accessibility" title="Accessibility">
            <VStack gap={5} align="stretch">
              {accessibility}
              {keyboardInteractions && keyboardInteractions.length > 0 && (
                <VStack gap={2} align="stretch">
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                    Keyboard interactions
                  </h4>
                  <div className="overflow-x-auto rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]">
                    <table className="w-full text-body-md">
                      <thead>
                        <tr className="bg-[var(--color-surface-muted)]">
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[140px]">
                            Key
                          </th>
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {keyboardInteractions.map((interaction, i) => (
                          <tr key={i} className="border-t border-[var(--color-border-subtle)]">
                            <td className="px-3 py-2">
                              <kbd className="inline-block px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] text-body-sm font-mono text-[var(--color-text-default)]">
                                {interaction.key}
                              </kbd>
                            </td>
                            <td className="px-3 py-2 text-[var(--color-text-default)]">
                              {interaction.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>
              )}
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
