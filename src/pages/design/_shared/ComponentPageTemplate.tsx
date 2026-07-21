import { type ReactNode, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { VStack, Tabs, TabList, Tab, TabPanel } from '@/design-system';
import { IconCheck, IconX } from '@tabler/icons-react';
import { type PropDef } from './PropsTable';
import { PrevNextNav } from './PrevNextNav';
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const lastUpdated = pageLastUpdated[location.pathname];

  const formattedDate = lastUpdated
    ? (() => {
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
      })()
    : null;

  const hasExamples = !!(examples || children);
  const hasGuidelines = !!guidelines;
  const hasTokens = !!(tokens || structureSpecs);

  const availableTabs = useMemo(() => {
    const tabs: { value: string; label: string }[] = [{ value: 'overview', label: 'Overview' }];
    if (hasExamples) tabs.push({ value: 'examples', label: 'Examples' });
    if (hasGuidelines) tabs.push({ value: 'guidelines', label: 'Guidelines' });
    if (hasTokens) tabs.push({ value: 'tokens', label: 'Design Tokens' });
    return tabs;
  }, [hasExamples, hasGuidelines, hasTokens]);

  const tabFromUrl = searchParams.get('tab') ?? 'overview';
  const activeTab = availableTabs.some((t) => t.value === tabFromUrl) ? tabFromUrl : 'overview';

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === 'overview') {
        next.delete('tab');
      } else {
        next.set('tab', value);
      }
      return next;
    });
  };

  return (
    <div>
      <VStack gap={0} align="stretch">
        {/* Header: Title + Description */}
        <div className="flex items-start justify-between gap-8 pt-2 pb-6">
          <div className="flex flex-col gap-2">
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
            <p className="text-body-lg text-[var(--color-text-muted)] max-w-[720px]">
              {description}
            </p>
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-body-xs font-medium bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {formattedDate && (
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Updated {formattedDate}
              </span>
            )}
            {headerActions}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} variant="underline" size="sm">
          <TabList>
            {availableTabs.map((t) => (
              <Tab key={t.value} value={t.value}>
                {t.label}
              </Tab>
            ))}
          </TabList>

          {/* Overview Tab */}
          <TabPanel value="overview" className="pt-0">
            <VStack gap={8} align="stretch" className="pt-8">
              {preview && (
                <VStack gap={4} align="stretch" id="preview">
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-h5 text-[var(--color-text-default)]">Preview</h3>
                    {previewActions}
                  </div>
                  {preview}
                </VStack>
              )}

              {(whenToUse || whenNotToUse) && (
                <VStack gap={4} align="stretch" id="when-to-use">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">When to use</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whenToUse && whenToUse.length > 0 && (
                      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-state-success)] bg-[var(--color-state-success-bg)]">
                        <div className="flex items-center gap-2 mb-3">
                          <IconCheck
                            size={16}
                            stroke={2}
                            className="text-[var(--color-state-success)]"
                          />
                          <span className="text-label-md text-[var(--color-state-success)]">
                            When to use
                          </span>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {whenToUse.map((item, i) => (
                            <li
                              key={i}
                              className="text-body-md text-[var(--color-text-default)] pl-1"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {whenNotToUse && whenNotToUse.length > 0 && (
                      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
                        <div className="flex items-center gap-2 mb-3">
                          <IconX
                            size={16}
                            stroke={2}
                            className="text-[var(--color-state-danger)]"
                          />
                          <span className="text-label-md text-[var(--color-state-danger)]">
                            When not to use
                          </span>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {whenNotToUse.map((item, i) => (
                            <li
                              key={i}
                              className="text-body-md text-[var(--color-text-default)] pl-1"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </VStack>
              )}

              {relatedLinks && relatedLinks.length > 0 && (
                <VStack gap={3} align="stretch" id="related">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">Related</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {relatedLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </VStack>
              )}
            </VStack>
          </TabPanel>

          {/* Examples Tab */}
          {hasExamples && (
            <TabPanel value="examples" className="pt-0">
              <VStack gap={5} align="stretch" className="pt-8">
                {examples}
                {children}
              </VStack>
            </TabPanel>
          )}

          {/* Guidelines Tab */}
          {hasGuidelines && (
            <TabPanel value="guidelines" className="pt-0">
              <VStack gap={5} align="stretch" className="pt-8">
                {guidelines}
              </VStack>
            </TabPanel>
          )}

          {/* Design Tokens Tab */}
          {hasTokens && (
            <TabPanel value="tokens" className="pt-0">
              <VStack gap={6} align="stretch" className="pt-8">
                {tokens}
                {structureSpecs?.map((group) => (
                  <VStack key={group.label} gap={2} align="stretch">
                    <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                      {group.label}
                    </h4>
                    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
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
            </TabPanel>
          )}
        </Tabs>

        {/* Prev/Next Navigation */}
        <div className="pt-12">
          <PrevNextNav />
        </div>
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
