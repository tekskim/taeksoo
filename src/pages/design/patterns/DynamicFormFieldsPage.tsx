import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack, HStack, Button, Input, Select, Badge } from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

const ENV_TYPE_OPTIONS = [
  { value: 'value', label: 'Key/Value Pair' },
  { value: 'configmap', label: 'ConfigMap' },
  { value: 'secret', label: 'Secret' },
];

function DynamicFieldTableDemo() {
  const [rows, setRows] = useState([
    { name: 'DATABASE_URL', type: 'value', value: 'postgresql://localhost:5432' },
  ]);

  return (
    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1}>
        {rows.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
            <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">Value Type</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">
              Value/Source
            </span>
            <div />
          </div>
        )}
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
            <Input
              placeholder="input variable name"
              value={row.name}
              onChange={(e) => {
                const n = [...rows];
                n[i].name = e.target.value;
                setRows(n);
              }}
              fullWidth
            />
            <Select
              options={ENV_TYPE_OPTIONS}
              value={row.type}
              onChange={(v) => {
                const n = [...rows];
                n[i].type = v;
                setRows(n);
              }}
              fullWidth
            />
            <Input
              placeholder="input value"
              value={row.value}
              onChange={(e) => {
                const n = [...rows];
                n[i].value = e.target.value;
                setRows(n);
              }}
              fullWidth
            />
            <button
              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
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
            onClick={() => setRows([...rows, { name: '', type: 'value', value: '' }])}
          >
            Add Variable
          </Button>
        </div>
      </VStack>
    </div>
  );
}

function RepeatableFieldGroupDemo() {
  const [groups, setGroups] = useState([
    [{ name: 'API_KEY', type: 'value', value: 'sk-1234567890' }],
  ]);

  return (
    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1} className="w-full">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
          >
            <VStack gap={1}>
              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
                <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Value Type
                </span>
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Value/Source
                </span>
                <button
                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  onClick={() => setGroups(groups.filter((_, idx) => idx !== gi))}
                >
                  <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </div>
              {group.map((ev, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                >
                  <Input
                    placeholder="input variable name"
                    value={ev.name}
                    onChange={(e) => {
                      const n = groups.map((g, idx) =>
                        idx === gi
                          ? g.map((r, ri) => (ri === i ? { ...r, name: e.target.value } : r))
                          : g
                      );
                      setGroups(n);
                    }}
                    fullWidth
                  />
                  <Select
                    options={ENV_TYPE_OPTIONS}
                    value={ev.type}
                    onChange={(v) => {
                      const n = groups.map((g, idx) =>
                        idx === gi ? g.map((r, ri) => (ri === i ? { ...r, type: v } : r)) : g
                      );
                      setGroups(n);
                    }}
                    fullWidth
                  />
                  <Input
                    placeholder="input value"
                    value={ev.value}
                    onChange={(e) => {
                      const n = groups.map((g, idx) =>
                        idx === gi
                          ? g.map((r, ri) => (ri === i ? { ...r, value: e.target.value } : r))
                          : g
                      );
                      setGroups(n);
                    }}
                    fullWidth
                  />
                  <div />
                </div>
              ))}
            </VStack>
          </div>
        ))}
        <div className="w-fit">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
            onClick={() => setGroups([...groups, [{ name: '', type: 'value', value: '' }]])}
          >
            Add Variable
          </Button>
        </div>
      </VStack>
    </div>
  );
}

function DescriptionHeaderDemo() {
  const [rows, setRows] = useState([{ name: 'ndots', value: '5' }]);

  return (
    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1}>
        {rows.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
            <VStack gap={1}>
              <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Specify the option name.
              </p>
            </VStack>
            <VStack gap={1}>
              <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                The value for this option.
              </p>
            </VStack>
            <div className="w-5" />
          </div>
        )}
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
            <Input
              placeholder="e.g. ndots"
              value={row.name}
              onChange={(e) => {
                const n = [...rows];
                n[i].name = e.target.value;
                setRows(n);
              }}
              fullWidth
            />
            <Input
              placeholder="e.g. 5"
              value={row.value}
              onChange={(e) => {
                const n = [...rows];
                n[i].value = e.target.value;
                setRows(n);
              }}
              fullWidth
            />
            <button
              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
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
            onClick={() => setRows([...rows, { name: '', value: '' }])}
          >
            Add Option
          </Button>
        </div>
      </VStack>
    </div>
  );
}

const descriptionHeaderCode = `<div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
  <VStack gap={1}>
    {/* Column headers with description */}
    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
      <VStack gap={1}>
        <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
        <p className="text-body-sm text-[var(--color-text-subtle)]">Specify the option name.</p>
      </VStack>
      <VStack gap={1}>
        <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
        <p className="text-body-sm text-[var(--color-text-subtle)]">The value for this option.</p>
      </VStack>
      <div className="w-5" />
    </div>
    {/* Rows */}
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
        <Input placeholder="e.g. ndots" value={row.name} onChange={...} fullWidth />
        <Input placeholder="e.g. 5" value={row.value} onChange={...} fullWidth />
        <button onClick={() => removeRow(i)}><IconX size={16} /></button>
      </div>
    ))}
    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
      onClick={() => addRow()}>
      Add Option
    </Button>
  </VStack>
</div>`;

const dynamicFieldTableCode = `<div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
  <VStack gap={1}>
    {/* Column headers */}
    <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
      <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
      <span className="block text-label-sm text-[var(--color-text-default)]">Value Type</span>
      <span className="block text-label-sm text-[var(--color-text-default)]">Value/Source</span>
      <div />
    </div>
    {/* Rows */}
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
        <Input placeholder="input variable name" value={row.name} onChange={...} fullWidth />
        <Select options={options} value={row.type} onChange={...} fullWidth />
        <Input placeholder="input value" value={row.value} onChange={...} fullWidth />
        <button onClick={() => removeRow(i)}>
          <IconX size={16} />
        </button>
      </div>
    ))}
    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
      onClick={() => addRow()}>
      Add Variable
    </Button>
  </VStack>
</div>`;

const repeatableFieldGroupCode = `<div className="bg-[var(--color-surface-subtle)] border ... rounded-[6px] p-3 w-full">
  <VStack gap={1} className="w-full">
    {groups.map((group, gi) => (
      <div key={gi} className="bg-[var(--color-surface-default)] border ... rounded-[6px] p-3 w-full">
        <VStack gap={1}>
          {/* Headers + close button */}
          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
            <span className="text-label-sm ...">Name</span>
            <span className="text-label-sm ...">Value Type</span>
            <span className="text-label-sm ...">Value/Source</span>
            <button onClick={() => removeGroup(gi)}><IconX size={16} /></button>
          </div>
          {/* Rows */}
          {group.map((ev, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
              <Input ... /><Select ... /><Input ... />
              <div />
            </div>
          ))}
        </VStack>
      </div>
    ))}
    <Button variant="secondary" size="sm" onClick={() => addGroup()}>Add Variable</Button>
  </VStack>
</div>`;

export function DynamicFormFieldsPage() {
  return (
    <ComponentPageTemplate
      title="Dynamic Form Fields"
      description="Dynamic form field patterns for adding, removing, and managing rows of structured data in Create pages and Drawers."
      preview={
        <ComponentPreview code={dynamicFieldTableCode}>
          <VStack gap={4} className="w-full">
            <DynamicFieldTableDemo />
          </VStack>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Dynamic Field Table
                </h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Single container with shared column headers and multiple input rows. Each row has
                its own delete button. Use for flat, tabular data entry like labels, env vars, or
                ports.
              </p>
            </VStack>
            <DynamicFieldTableDemo />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  With Description Headers
                </h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Column headers include a description line below the label. Wrap each header in a
                VStack with gap-1 containing the label (text-label-sm) and description
                (text-body-sm, subtle). Use when columns need additional context to clarify expected
                input.
              </p>
            </VStack>
            <ComponentPreview code={descriptionHeaderCode}>
              <DescriptionHeaderDemo />
            </ComponentPreview>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Repeatable Field Group
                </h4>
                <Badge variant="info" size="sm">
                  Card
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Outer container with multiple independent cards. Each card has its own column
                headers and close button. &quot;Add&quot; creates a new card. Use for
                self-contained, repeatable sections like storage volumes or network interfaces.
              </p>
            </VStack>
            <ComponentPreview code={repeatableFieldGroupCode}>
              <RepeatableFieldGroupDemo />
            </ComponentPreview>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={4}>
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">When to use</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Pattern
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Use when
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Examples
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                    Dynamic Field Table (List)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    All rows share the same structure under one set of headers
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Labels, Annotations, Env Vars, Ports, Host Aliases
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                    With Description Headers (List)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    Columns need extra context via description text below headers
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Resolver Options, Host Aliases with IP format hints
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                    Repeatable Field Group (Card)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    Each group is self-contained and may have different configurations
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Storage Volumes, Network Interfaces, Affinity Rules
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Structure</h4>
          <VStack gap={2}>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Dynamic Field Table (List):</strong> bg-subtle container → column headers
                (text-label-sm) → input rows (grid-aligned) → Add button
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>With Description Headers (List):</strong> bg-subtle container → column
                headers (VStack gap-1: text-label-sm label + text-body-sm description) → input rows
                (grid-aligned) → Add button
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Repeatable Field Group (Card):</strong> bg-subtle outer container → white
                inner cards (each with headers + close button + input rows) → Add button
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
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Container padding</td>
                  <td className="py-2 text-[var(--color-text-muted)]">12px (p-3)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Header → rows gap (List)
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">4px (gap-1)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Header → rows gap (Card)
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">4px (gap-1)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Column gap</td>
                  <td className="py-2 text-[var(--color-text-muted)]">8px (gap-2)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Delete button column
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">20px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Column header</td>
                  <td className="py-2 text-[var(--color-text-muted)]">text-label-sm</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Header description</td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    text-body-sm text-subtle, gap-1 from label
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Border radius</td>
                  <td className="py-2 text-[var(--color-text-muted)]">6px (rounded-[6px])</td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Label + input + helper text composition',
        },
        {
          label: 'Common Patterns',
          path: '/design/patterns/common',
          description: 'List Page, Detail Page, and other standard patterns',
        },
        {
          label: 'Wizard (Create Flow)',
          path: '/design/patterns/wizard',
          description: 'Multi-step create form pattern',
        },
      ]}
    />
  );
}
