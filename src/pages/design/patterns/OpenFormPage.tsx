import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import {
  VStack,
  HStack,
  SectionCard,
  FormField,
  Input,
  Select,
  Button,
  Badge,
} from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'production', label: 'production' },
  { value: 'staging', label: 'staging' },
];

const TYPE_OPTIONS = [
  { value: 'ClusterIP', label: 'ClusterIP' },
  { value: 'NodePort', label: 'NodePort' },
  { value: 'LoadBalancer', label: 'LoadBalancer' },
];

function LabelsSection() {
  const [labels, setLabels] = useState([{ key: 'app', value: 'my-service' }]);

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Labels & Annotations" />
      <SectionCard.Content>
        <VStack gap={6}>
          <FormField label="Labels">
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1.5}>
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div />
                  </div>
                )}
                {labels.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                    <Input
                      placeholder="key"
                      value={row.key}
                      onChange={(e) => {
                        const next = [...labels];
                        next[i] = { ...next[i], key: e.target.value };
                        setLabels(next);
                      }}
                      fullWidth
                    />
                    <Input
                      placeholder="value"
                      value={row.value}
                      onChange={(e) => {
                        const next = [...labels];
                        next[i] = { ...next[i], value: e.target.value };
                        setLabels(next);
                      }}
                      fullWidth
                    />
                    <button
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      onClick={() => setLabels(labels.filter((_, idx) => idx !== i))}
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
                    onClick={() => setLabels([...labels, { key: '', value: '' }])}
                  >
                    Add Label
                  </Button>
                </div>
              </VStack>
            </div>
          </FormField>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function OpenFormPreview() {
  return (
    <VStack gap={4} className="w-full">
      <SectionCard className="pb-4">
        <SectionCard.Header title="Basic information" />
        <SectionCard.Content>
          <VStack gap={6}>
            <FormField
              label="Name"
              required
              helperText="2-64 characters, lowercase letters and hyphens only"
            >
              <Input placeholder="Enter resource name" fullWidth />
            </FormField>
            <FormField label="Namespace" required>
              <Select options={NAMESPACE_OPTIONS} placeholder="Select namespace" fullWidth />
            </FormField>
            <FormField label="Type" required helperText="Determines how the resource is exposed">
              <Select options={TYPE_OPTIONS} placeholder="Select type" fullWidth />
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <SectionCard className="pb-4">
        <SectionCard.Header title="Configuration" />
        <SectionCard.Content>
          <VStack gap={6}>
            <FormField label="Port" required>
              <Input placeholder="e.g. 8080" fullWidth />
            </FormField>
            <FormField label="Target Port" required>
              <Input placeholder="e.g. 80" fullWidth />
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <LabelsSection />
    </VStack>
  );
}

const previewCode = `<VStack gap={4} className="flex-1">
  {/* Section 1 — pb-4 overrides default 12px → 16px for Open Form */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Basic information" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Name" required helperText="...">
          <Input placeholder="Enter resource name" fullWidth />
        </FormField>
        <FormField label="Namespace" required>
          <Select options={namespaces} placeholder="Select namespace" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>

  {/* Section 2 */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Configuration" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Port" required>
          <Input placeholder="e.g. 8080" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>

  {/* Section 3 */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Labels & Annotations" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Labels">
          <Input placeholder="e.g. app=my-service" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>
</VStack>`;

export function OpenFormPage() {
  return (
    <ComponentPageTemplate
      title="Open Form (Create Flow)"
      description="All-sections-visible create page pattern used by Container (Kubernetes) pages. Every section is expanded and scrollable — no wizard steps or progressive disclosure."
      preview={
        <ComponentPreview code={previewCode}>
          <OpenFormPreview />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Pattern Structure
                </h4>
                <Badge variant="info" size="sm">
                  Layout
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                All SectionCards are rendered simultaneously in a vertical stack. The user scrolls
                through the form and fills in all fields before submitting. An optional summary
                sidebar can be placed on the right.
              </p>
            </VStack>

            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-mono leading-relaxed">
                {`PageShell
└── VStack gap={6}
    ├── Page Header (h1 + description)
    └── HStack gap={6} align="start"
        ├── VStack gap={4} className="flex-1"   ← SectionCards
        │   ├── SectionCard (Basic information)
        │   ├── SectionCard (Configuration)
        │   ├── SectionCard (Labels & Annotations)
        │   └── ... more sections
        └── SummarySidebar (optional, sticky)`}
              </pre>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Comparison with Wizard
              </h4>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Choose between Open Form and Wizard based on the complexity and dependencies of the
                form.
              </p>
            </VStack>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Aspect
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Open Form
                    </th>
                    <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                      Wizard
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Section visibility
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      All sections visible at once
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      One active section at a time
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Navigation
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Scroll / Tabs</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Next / Edit buttons</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Section states
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">None (always open)</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Pre / Active / Done</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      SectionCard isActive
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Not used</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Used (blue border)</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Best for
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      Independent fields, Kubernetes resources
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      Dependent steps, Infrastructure resources
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Used by
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Container</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Compute, Storage, IAM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={4}>
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">When to use</h4>
          <VStack gap={2}>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Use Open Form when:</strong> Fields are independent (no step-to-step
                dependencies), users benefit from seeing the full form at once, or the resource has
                5-20+ fields across 3-6 logical sections.
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Use Wizard instead when:</strong> Later sections depend on earlier choices
                (e.g., flavor options depend on selected image), or a summary/review step is needed
                before submission.
              </p>
            </div>
          </VStack>

          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Spacing tokens</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Element
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Between SectionCards
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">16px (gap-4)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Header divider → content
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">16px (SectionCard gap-4)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Between form fields
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">24px (gap-6)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Label → input</td>
                  <td className="py-2 text-[var(--color-text-muted)]">8px (gap-2)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    SectionCard bottom padding
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">16px (pb-4)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Content area padding
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    pt-3 px-8 pb-20 (page level)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
            Implementation checklist
          </h4>
          <VStack gap={2}>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <ul className="text-body-sm text-[var(--color-text-default)] list-disc list-inside space-y-1">
                <li>
                  Wrap all SectionCards in <code className="text-body-sm">VStack gap={'{4}'}</code>
                </li>
                <li>
                  Add <code className="text-body-sm">className=&quot;pb-4&quot;</code> to every{' '}
                  <code className="text-body-sm">SectionCard</code> (16px bottom padding for Open
                  Form only)
                </li>
                <li>
                  Use <code className="text-body-sm">VStack gap={'{6}'}</code> inside Content for
                  field spacing
                </li>
                <li>
                  Do NOT use <code className="text-body-sm">isActive</code> on SectionCards
                </li>
                <li>Use FormField for all form inputs (label + control + helper text)</li>
                <li>Optional: Add SummarySidebar on the right with sticky positioning</li>
              </ul>
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Wizard (Create Flow)',
          path: '/design/patterns/wizard',
          description: 'Step-by-step wizard pattern with section states',
        },
        {
          label: 'Multi Tab Create',
          path: '/design/patterns/multi-tab-create',
          description: 'Tab-based creation for complex forms',
        },
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Container component for form sections',
        },
        {
          label: 'Dynamic Form Fields',
          path: '/design/patterns/dynamic-form-fields',
          description: 'Repeatable row and group patterns',
        },
      ]}
    />
  );
}
