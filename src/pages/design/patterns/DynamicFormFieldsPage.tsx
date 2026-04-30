import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import {
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Badge,
  Disclosure,
  NumberInput,
} from '@/design-system';
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
    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1.5}>
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

function EmptyDynamicFieldTableDemo() {
  const [rows, setRows] = useState<{ name: string; type: string; value: string }[]>([]);

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1.5}>
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
    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1.5} className="w-full">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
          >
            <VStack gap={1.5}>
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

function WithLabelDescriptionDemo() {
  const [labels, setLabels] = useState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);

  return (
    <VStack gap={2}>
      <VStack gap={1}>
        <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Specify the labels used to identify and categorize the resource.
        </p>
      </VStack>

      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
        <VStack gap={1.5}>
          {labels.length > 0 && (
            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
              <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
              <div className="w-5" />
            </div>
          )}
          {labels.map((label, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
              <Input
                placeholder="label key"
                value={label.key}
                onChange={(e) => {
                  const n = [...labels];
                  n[i] = { ...n[i], key: e.target.value };
                  setLabels(n);
                }}
                fullWidth
              />
              <Input
                placeholder="label value"
                value={label.value}
                onChange={(e) => {
                  const n = [...labels];
                  n[i] = { ...n[i], value: e.target.value };
                  setLabels(n);
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
    </VStack>
  );
}

function WithLabelDemo() {
  const [labels, setLabels] = useState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);

  return (
    <VStack gap={2}>
      <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>

      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
        <VStack gap={1.5}>
          {labels.length > 0 && (
            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
              <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
              <div className="w-5" />
            </div>
          )}
          {labels.map((label, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
              <Input
                placeholder="label key"
                value={label.key}
                onChange={(e) => {
                  const n = [...labels];
                  n[i] = { ...n[i], key: e.target.value };
                  setLabels(n);
                }}
                fullWidth
              />
              <Input
                placeholder="label value"
                value={label.value}
                onChange={(e) => {
                  const n = [...labels];
                  n[i] = { ...n[i], value: e.target.value };
                  setLabels(n);
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
    </VStack>
  );
}

function DescriptionHeaderDemo() {
  const [rows, setRows] = useState([{ name: 'ndots', value: '5' }]);

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1.5}>
        {rows.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
            <VStack gap={0.5}>
              <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Specify the option name.
              </p>
            </VStack>
            <VStack gap={0.5}>
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

const withLabelCode = `<VStack gap={2}>
  {/* Label */}
  <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>

  {/* Key-Value Table */}
  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
    <VStack gap={1.5}>
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
        <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
        <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
        <div className="w-5" />
      </div>
      {/* Rows */}
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
          <Input placeholder="label key" value={item.key} onChange={...} fullWidth />
          <Input placeholder="label value" value={item.value} onChange={...} fullWidth />
          <button onClick={() => removeItem(i)}><IconX size={16} /></button>
        </div>
      ))}
      <div className="w-fit">
        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
          onClick={() => addItem()}>
          Add Label
        </Button>
      </div>
    </VStack>
  </div>
</VStack>`;

const withLabelDescriptionCode = `<VStack gap={2}>
  {/* Label + Description */}
  <VStack gap={1}>
    <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
    <p className="text-body-md text-[var(--color-text-subtle)]">
      Specify the labels used to identify and categorize the resource.
    </p>
  </VStack>

  {/* Key-Value Table */}
  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
    <VStack gap={1.5}>
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
        <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
        <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
        <div className="w-5" />
      </div>
      {/* Rows */}
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
          <Input placeholder="label key" value={item.key} onChange={...} fullWidth />
          <Input placeholder="label value" value={item.value} onChange={...} fullWidth />
          <button onClick={() => removeItem(i)}><IconX size={16} /></button>
        </div>
      ))}
      <div className="w-fit">
        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
          onClick={() => addItem()}>
          Add Label
        </Button>
      </div>
    </VStack>
  </div>
</VStack>`;

const descriptionHeaderCode = `<div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
  <VStack gap={1.5}>
    {/* Column headers with description */}
    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
      <VStack gap={0.5}>
        <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
        <p className="text-body-sm text-[var(--color-text-subtle)]">Specify the option name.</p>
      </VStack>
      <VStack gap={0.5}>
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
    <div className="w-fit">
      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
        onClick={() => addRow()}>
        Add Option
      </Button>
    </div>
  </VStack>
</div>`;

const dynamicFieldTableCode = `<div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
  <VStack gap={1.5}>
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
    <div className="w-fit">
      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}
        onClick={() => addRow()}>
        Add Variable
      </Button>
    </div>
  </VStack>
</div>`;

/* ──────────────────────────────────────────────
   Disclosure Nested Grid Demo (Node Scheduling-style)
   ────────────────────────────────────────────── */

const SCHED_OPERATOR_OPTIONS = [
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'NotIn' },
  { value: 'Exists', label: 'Exists' },
  { value: 'DoesNotExist', label: 'DoesNotExist' },
];

const SCHED_PRIORITY_OPTIONS = [
  { value: 'required', label: 'Required' },
  { value: 'preferred', label: 'Preferred' },
];

interface SchedExpression {
  key: string;
  operator: string;
  value: string;
}

interface SchedTerm {
  id: string;
  priority: string;
  weight: number;
  expressions: SchedExpression[];
}

function DisclosureNestedGridDemo() {
  const [terms, setTerms] = useState<SchedTerm[]>(() => {
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();
    return [
      {
        id: id1,
        priority: 'required',
        weight: 50,
        expressions: [
          { key: 'kubernetes.io/os', operator: 'In', value: 'linux' },
          { key: 'node-type', operator: 'In', value: 'compute' },
        ],
      },
      {
        id: id2,
        priority: 'preferred',
        weight: 30,
        expressions: [{ key: 'topology.kubernetes.io/zone', operator: 'In', value: 'us-east-1a' }],
      },
    ];
  });
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([terms[0]?.id]));

  const addTerm = () => {
    const newId = crypto.randomUUID();
    setTerms([
      ...terms,
      {
        id: newId,
        priority: 'preferred',
        weight: 1,
        expressions: [{ key: '', operator: 'In', value: '' }],
      },
    ]);
    setOpenIds((prev) => new Set(prev).add(newId));
  };

  const removeTerm = (id: string) => {
    setTerms(terms.filter((t) => t.id !== id));
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateTerm = (id: string, field: 'priority' | 'weight', val: string | number) =>
    setTerms(terms.map((t) => (t.id === id ? { ...t, [field]: val } : t)));

  const addExpression = (termId: string) =>
    setTerms(
      terms.map((t) =>
        t.id === termId
          ? { ...t, expressions: [...t.expressions, { key: '', operator: 'In', value: '' }] }
          : t
      )
    );

  const removeExpression = (termId: string, ei: number) =>
    setTerms(
      terms.map((t) =>
        t.id === termId ? { ...t, expressions: t.expressions.filter((_, j) => j !== ei) } : t
      )
    );

  const updateExpression = (
    termId: string,
    ei: number,
    field: keyof SchedExpression,
    val: string
  ) =>
    setTerms(
      terms.map((t) =>
        t.id === termId
          ? {
              ...t,
              expressions: t.expressions.map((e, j) => (j === ei ? { ...e, [field]: val } : e)),
            }
          : t
      )
    );

  return (
    <VStack gap={2}>
      {terms.map((term, ti) => (
        <div
          key={term.id}
          className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] w-full overflow-hidden"
        >
          <Disclosure
            open={openIds.has(term.id)}
            onChange={(isOpen) =>
              setOpenIds((prev) => {
                const next = new Set(prev);
                if (isOpen) {
                  next.add(term.id);
                } else {
                  next.delete(term.id);
                }
                return next;
              })
            }
          >
            <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
              <HStack gap={2} align="center" className="w-full">
                <Disclosure.Trigger className="flex-1">
                  <HStack gap={4} align="center">
                    <span>Term {ti + 1}</span>
                    <HStack gap={1} align="center">
                      <Badge theme="white" size="sm">
                        {term.priority === 'required' ? 'Required' : 'Preferred'}
                      </Badge>
                      {term.priority === 'preferred' && (
                        <Badge theme="white" size="sm">
                          W:{term.weight}
                        </Badge>
                      )}
                      <Badge theme="white" size="sm">
                        {term.expressions.length} rule
                        {term.expressions.length !== 1 ? 's' : ''}
                      </Badge>
                    </HStack>
                  </HStack>
                </Disclosure.Trigger>
                {terms.length > 1 && (
                  <button
                    onClick={() => removeTerm(term.id)}
                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={14} className="text-[var(--color-text-muted)]" />
                  </button>
                )}
              </HStack>
            </div>
            <Disclosure.Panel className="px-4 py-4">
              <VStack gap={6}>
                <VStack gap={2} className="w-full">
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Priority
                  </span>
                  <Select
                    options={SCHED_PRIORITY_OPTIONS}
                    value={term.priority}
                    onChange={(val) => updateTerm(term.id, 'priority', val)}
                    fullWidth
                  />
                </VStack>
                {term.priority === 'preferred' && (
                  <VStack gap={2}>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Weight
                    </span>
                    <NumberInput
                      min={1}
                      max={100}
                      step={1}
                      value={term.weight}
                      onChange={(val) => updateTerm(term.id, 'weight', val ?? 1)}
                      width="sm"
                    />
                  </VStack>
                )}
                <VStack gap={2}>
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Rules
                  </span>
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      {term.expressions.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Operator
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div />
                        </div>
                      )}
                      {term.expressions.map((expr, ei) => (
                        <div
                          key={ei}
                          className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                        >
                          <Input
                            placeholder="e.g. kubernetes.io/os"
                            value={expr.key}
                            onChange={(e) => updateExpression(term.id, ei, 'key', e.target.value)}
                            fullWidth
                          />
                          <Select
                            options={SCHED_OPERATOR_OPTIONS}
                            value={expr.operator}
                            onChange={(val) => updateExpression(term.id, ei, 'operator', val)}
                            fullWidth
                          />
                          <Input
                            placeholder="e.g. linux"
                            value={expr.value}
                            onChange={(e) => updateExpression(term.id, ei, 'value', e.target.value)}
                            fullWidth
                          />
                          <button
                            onClick={() => removeExpression(term.id, ei)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </div>
                      ))}
                      <div className="w-fit">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={() => addExpression(term.id)}
                        >
                          Add Rule
                        </Button>
                      </div>
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      ))}
      <div className="w-fit">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
          onClick={addTerm}
        >
          Add Term
        </Button>
      </div>
    </VStack>
  );
}

/* ──────────────────────────────────────────────
   Disclosure code snippets
   ────────────────────────────────────────────── */

const disclosureNestedGridCode = `<VStack gap={2}>
  {terms.map((term, i) => (
    <div key={term.id}
      className="border border-[var(--color-border-default)]
        rounded-[var(--radius-lg)] w-full overflow-hidden">
      <Disclosure defaultOpen={i === 0}>
        {/* Trigger header — bg-subtle with badges */}
        <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
          <HStack gap={2} align="center" className="w-full">
            <Disclosure.Trigger className="flex-1">
              <HStack gap={2} align="center">
                <span>Term {i + 1}</span>
                <Badge variant="info" size="sm">{term.priority}</Badge>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  W:{term.weight} · {term.expressions.length} rules
                </span>
              </HStack>
            </Disclosure.Trigger>
            <button onClick={() => removeTerm(term.id)}>
              <IconX size={14} />
            </button>
          </HStack>
        </div>
        {/* Panel — form fields + nested bg-subtle grid */}
        <Disclosure.Panel className="px-4 py-4">
          <VStack gap={6}>
            <VStack gap={2} className="w-full">
              <span className="text-label-sm">Priority</span>
              <Select options={priorityOptions} value={term.priority} ... fullWidth />
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm">Weight</span>
              <NumberInput min={1} max={100} value={term.weight} ... width="xs" />
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              {/* Key-Operator-Value grid */}
              <VStack gap={1.5}>
                <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 w-full">
                  <span className="text-label-sm">Key</span>
                  <span className="text-label-sm">Operator</span>
                  <span className="text-label-sm">Value</span>
                  <div />
                </div>
                {term.expressions.map((expr, ei) => (
                  <div key={ei} className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 ...">
                    <Input ... /><Select ... /><Input ... />
                    <button onClick={() => removeExpr(term.id, ei)}><IconX /></button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => addExpr(term.id)}>
                  Add Rule
                </Button>
              </VStack>
            </div>
          </VStack>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  ))}
  <Button variant="secondary" size="sm" onClick={addTerm}>Add Term</Button>
</VStack>`;

const repeatableFieldGroupCode = `<div className="bg-[var(--color-surface-subtle)] border ... rounded-[6px] p-3 w-full">
  <VStack gap={1.5} className="w-full">
    {groups.map((group, gi) => (
      <div key={gi} className="bg-[var(--color-surface-default)] border ... rounded-[6px] p-3 w-full">
        <VStack gap={1.5}>
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
    <div className="w-fit">
      <Button variant="secondary" size="sm" onClick={() => addGroup()}>Add Variable</Button>
    </div>
  </VStack>
</div>`;

/* ──────────────────────────────────────────────
   Validation Error Demos
   ────────────────────────────────────────────── */

function ListValidationErrorDemo() {
  return (
    <VStack gap={2}>
      <span className="text-label-lg text-[var(--color-text-default)]">
        Labels <span className="text-[var(--color-state-danger)]">*</span>
      </span>

      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
        <VStack gap={1.5}>
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
            <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
            <div className="w-5" />
          </div>
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
            <Input value="app" fullWidth />
            <Input value="nginx" fullWidth />
            <div className="size-5 flex items-center justify-center">
              <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
            <VStack gap={1}>
              <Input value="" placeholder="label key" error fullWidth />
              <span className="text-body-sm text-[var(--color-state-danger)]">
                Key is required.
              </span>
            </VStack>
            <VStack gap={1}>
              <Input value="" placeholder="label value" error fullWidth />
              <span className="text-body-sm text-[var(--color-state-danger)]">
                Value is required.
              </span>
            </VStack>
            <div className="size-5 flex items-center justify-center mt-[6px]">
              <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
            <VStack gap={1}>
              <Input value="app" error fullWidth />
              <span className="text-body-sm text-[var(--color-state-danger)]">
                Duplicate key &quot;app&quot;.
              </span>
            </VStack>
            <Input value="backend" fullWidth />
            <div className="size-5 flex items-center justify-center">
              <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </div>
          </div>
          <div className="w-fit">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
            >
              Add Label
            </Button>
          </div>
        </VStack>
      </div>
    </VStack>
  );
}

function CardValidationErrorDemo() {
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
      <VStack gap={1.5} className="w-full">
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
          <VStack gap={1.5}>
            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
              <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">
                Value Type
              </span>
              <span className="block text-label-sm text-[var(--color-text-default)]">
                Value/Source
              </span>
              <div className="size-5 flex items-center justify-center">
                <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
              <Input value="API_KEY" fullWidth />
              <Select options={ENV_TYPE_OPTIONS} value="value" onChange={() => {}} fullWidth />
              <Input value="sk-1234567890" fullWidth />
              <div />
            </div>
          </VStack>
        </div>

        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
          <VStack gap={1.5}>
            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
              <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">
                Value Type
              </span>
              <span className="block text-label-sm text-[var(--color-text-default)]">
                Value/Source
              </span>
              <div className="size-5 flex items-center justify-center">
                <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-start">
              <VStack gap={1}>
                <Input value="" placeholder="input variable name" error fullWidth />
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  Name is required.
                </span>
              </VStack>
              <Select options={ENV_TYPE_OPTIONS} value="value" onChange={() => {}} fullWidth />
              <VStack gap={1}>
                <Input value="" placeholder="input value" error fullWidth />
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  Value is required.
                </span>
              </VStack>
              <div />
            </div>
          </VStack>
        </div>

        <div className="w-fit">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
          >
            Add Variable
          </Button>
        </div>
      </VStack>
    </div>
  );
}

const DYNAMIC_FORM_FIELDS_GUIDELINES = `## Overview

Dynamic form fields는 **여러 입력 필드로 구성된 속성(Property)을 동적으로 추가·제거하거나, 관련 필드를 시각적으로 그룹화하여 표시하는 Form 패턴**이다. Form이 길어지는 문제를 해결하고, 관련 필드를 하나의 논리적 단위로 구성하여 **가독성과 구조를 개선**한다.

---

## Composition

Dynamic form fields 패턴은 적용 타입에 따라 다양한 방식으로 구성된다. Disclosure는 선택적 요소이며, 타입에 따라 Nested Grid Panel이 항상 노출되거나 Disclosure로 접고 펼 수 있다.

| 요소 | 설명 |
| --- | --- |
| ① Disclosure Trigger (조건부) | Disclosure 타입에서만 사용. 해당 속성 그룹을 접고 펼치는 토글 트리거. Disclosure 컴포넌트 정책을 따른다. |
| ② Badge (조건부) | Disclosure 타입에서만 사용. Disclosure가 접힌 상태에서 입력값 요약 정보를 Label 우측에 표시하는 배지. 입력된 항목 수 또는 대표값을 시각적으로 나타낸다. |
| ③ Nested Grid Panel | 입력 필드들을 그리드 레이아웃으로 배치하는 컨테이너. 한 속성에 속하는 여러 필드를 열(column) 단위로 구성한다. List/Card 타입에서는 항상 노출되며, Disclosure 타입에서는 펼침 상태에서만 노출된다. |
| ④ Field Row | Grid 내 개별 입력 필드 행. Label + Input/Select/Toggle 등으로 구성된다. |
| ⑤ Add/Delete Action (조건부) | 반복형 항목의 동적 추가(Add Row) 및 삭제(×) 액션. 삭제 버튼은 각 Field Row 우측에, 추가 버튼은 Panel 하단에 위치한다. |

### Visual Layout

**List 타입 (예: 환경변수, Labels)** — Disclosure 없이 Nested Grid Panel이 항상 노출. 반복 Key-Value 입력 항목.

**Card 타입 (예: Resources, Containers)** — Nested Grid Panel을 카드 단위로 그룹화하여 표시.

**Disclosure 타입** — 접힌 상태에서는 Trigger + Badge 요약, 펼침 상태에서 Nested Grid Panel과 Add/Delete가 노출된다.

---

## Variants

| 유형 | 설명 | 사용 예시 |
| --- | --- | --- |
| List | Disclosure 없이 Nested Grid Panel이 항상 노출되는 방식. 반복 입력 항목을 세로로 나열한다. | 환경변수, Labels, Annotations 등 단순 반복 Key-Value 입력 |
| Card | Disclosure 없이 관련 필드를 카드 단위로 묶어 표시하는 방식. | Volumes, Containers, Ports 등 복수 필드로 구성된 독립 항목 |
| Disclosure | Disclosure Trigger로 그룹을 접고 펼치는 방식. 접힌 상태에서 Badge로 입력값 요약을 표시한다. | Resources, Affinity, Tolerations 등 복잡하거나 선택적인 속성 그룹 |

---

## Behavior

### 1) 폴딩/언폴딩

- Disclosure Trigger 클릭 시 Nested Grid Panel이 펼쳐진다.
- 펼쳐진 상태에서 Disclosure Trigger를 다시 클릭하면 Panel이 접힌다.

### 2) 동적 항목 추가/제거 (반복형 항목)

- **추가(Add Row):** 새 Field Row가 Panel 하단에 삽입된다.
- **제거(×):** 해당 Row가 즉시 제거된다. 마지막 Row는 제거 불가 또는 빈 상태가 될 수 있는지 제품 정책으로 통일하게 정한다.
- 복수 속성이 동시에 동일한 유형의 항목을 가질 때, 각 속성마다 **독립적인** 추가/제거 액션을 제공한다.

### 3) 유효성 검사

- 필드별 값 유효성은 소속 컴포넌트(Input, Select 등)의 일반 Validation을 따른다.
- 확인/제출 시 접힌 상태인 필수 필드가 미입력되어 있다면 자동으로 펼쳐 에러를 노출한다.
`;

export function DynamicFormFieldsPage() {
  return (
    <ComponentPageTemplate
      title="Dynamic Form Fields"
      description="여러 입력 필드로 구성된 속성을 동적으로 추가·제거하거나, 관련 필드를 시각적으로 그룹화하여 표시하는 Form 패턴이다. Form이 길어지는 문제를 완화하고 논리적 단위로 묶어 가독성과 구조를 개선한다."
      whenToUse={[
        '단일 속성이 5개 이상의 입력 필드로 구성될 때',
        '키-값 쌍 또는 연산 수식 등 중첩 구조가 필요한 입력 항목',
        'Create/Edit Form에서 속성의 논리적 그룹화로 화면 밀도를 줄여야 할 때',
      ]}
      whenNotToUse={[
        '단순한 1–4개 필드로 구성된 속성 (→ 일반 Form Field 나열)',
        '데이터 입력이 아닌 데이터 표시(Display-only) 상황',
      ]}
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
                  Empty State (Closed)
                </h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Initial empty state with no rows. Only the add button is visible. Clicking it adds a
                new row and reveals the column headers. This is the default state before any data is
                entered.
              </p>
            </VStack>
            <EmptyDynamicFieldTableDemo />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  With Label &amp; Description
                </h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                A label (text-label-lg) and description (text-body-md, subtle) placed above the
                bordered table container. Use when the dynamic field group needs a section-level
                title and contextual explanation, such as Labels or Annotations.
              </p>
            </VStack>
            <ComponentPreview code={withLabelDescriptionCode}>
              <WithLabelDescriptionDemo />
            </ComponentPreview>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">With Label</h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                A label (text-label-lg) placed above the bordered table container without a
                description. Use when the field group title is self-explanatory and no additional
                context is needed.
              </p>
            </VStack>
            <ComponentPreview code={withLabelCode}>
              <WithLabelDemo />
            </ComponentPreview>
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

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Disclosure with Nested Grid
                </h4>
                <Badge variant="info" size="sm">
                  Disclosure
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Collapsible items containing form controls (Select, NumberInput) at the top level
                and a bg-subtle Key-Operator-Value grid inside. The collapsed header shows badges
                and a summary string. Use for complex scheduling rules, affinity terms, HPA metrics,
                or any multi-field item with nested match expressions.
              </p>
            </VStack>
            <ComponentPreview code={disclosureNestedGridCode}>
              <DisclosureNestedGridDemo />
            </ComponentPreview>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Validation Error
                </h4>
                <Badge variant="info" size="sm">
                  List
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Per-field validation errors appear below the input with error styling. Empty
                required fields and duplicate key conflicts are shown inline. The error message uses
                text-body-sm in danger color.
              </p>
            </VStack>
            <ListValidationErrorDemo />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Validation Error
                </h4>
                <Badge variant="info" size="sm">
                  Card
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Card-level validation highlights the entire card border in danger color. Individual
                field errors are shown within the card. Valid cards retain the default border.
              </p>
            </VStack>
            <CardValidationErrorDemo />
          </VStack>
        </VStack>
      }
      guidelines={
        <>
          <NotionRenderer markdown={DYNAMIC_FORM_FIELDS_GUIDELINES} />
          <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-4 mt-8">
            Usage Guidelines
          </h3>
          <DosDonts
            doItems={[
              '입력 복잡도에 맞는 타입을 선택한다 (단순 반복 항목 → List / 복수 필드 그룹 → Card / 더 복잡한 필드 구성 또는 선택적 속성 → Disclosure).',
              '(Disclosure 타입) 동일한 속성을 하나의 Disclosure 안에 묶고, 접힌 상태에서 입력값 요약을 Badge로 표시한다.',
            ]}
            dontItems={[
              '다른 속성의 필드를 동일 그룹에 혼합하지 않는다 (논리 그룹 원칙은 모든 타입 공통 적용).',
              '동적 추가/삭제가 지원되는 타입에서 Row 추가 버튼을 Panel 바깥(그룹 영역 외부)에 배치하지 않는다.',
              '(Disclosure 타입) Disclosure 안에 Disclosure를 중첩하지 않는다 (2단계 이상은 UX를 먼저 검토한다).',
            ]}
          />
        </>
      }
      relatedLinks={[
        {
          label: 'Disclosure',
          path: '/design/components/disclosure',
          description: '패턴의 Trigger 컴포넌트',
        },
        {
          label: 'Form Field',
          path: '/design/patterns/form-field-pattern',
          description: 'Nested Grid 내부 입력 요소',
        },
        { label: 'Input', path: '/design/components/input', description: 'Key/Value 입력 필드' },
        { label: 'Select', path: '/design/components/select', description: 'Operator 등 드롭다운' },
        {
          label: 'Create Page',
          path: '/design/patterns/wizard',
          description: '상위 Form·Create 흐름',
        },
      ]}
    />
  );
}
