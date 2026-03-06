import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
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
          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
            <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">Value Type</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">
              Value/Source
            </span>
            <div />
          </div>
        )}
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center">
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
          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
            <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">Value Type</span>
            <span className="block text-label-sm text-[var(--color-text-default)]">
              Value/Source
            </span>
            <div />
          </div>
        )}
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center">
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
            <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
              <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
              <div className="w-5" />
            </div>
          )}
          {labels.map((label, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
            <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
              <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
              <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
              <div className="w-5" />
            </div>
          )}
          {labels.map((label, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
          <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
          <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
        <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
        <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
        <div className="w-5" />
      </div>
      {/* Rows */}
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
        <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
        <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
        <div className="w-5" />
      </div>
      {/* Rows */}
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
      <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
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
    <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
      <span className="block text-label-sm text-[var(--color-text-default)]">Name</span>
      <span className="block text-label-sm text-[var(--color-text-default)]">Value Type</span>
      <span className="block text-label-sm text-[var(--color-text-default)]">Value/Source</span>
      <div />
    </div>
    {/* Rows */}
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center">
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
          className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
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
                        <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
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
                          className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
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
        rounded-[var(--primitive-radius-md)] w-full overflow-hidden">
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
                <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full">
                  <span className="text-label-sm">Key</span>
                  <span className="text-label-sm">Operator</span>
                  <span className="text-label-sm">Value</span>
                  <div />
                </div>
                {term.expressions.map((expr, ei) => (
                  <div key={ei} className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 ...">
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
          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center">
            <span className="text-label-sm ...">Name</span>
            <span className="text-label-sm ...">Value Type</span>
            <span className="text-label-sm ...">Value/Source</span>
            <button onClick={() => removeGroup(gi)}><IconX size={16} /></button>
          </div>
          {/* Rows */}
          {group.map((ev, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center">
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
                    With Label &amp; Description (List)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    The field group needs a section-level title and contextual description
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Labels, Annotations, Selectors
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                    With Label (List)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    The field group title is self-explanatory with no additional context needed
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Labels, Selectors, Tolerations
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
                    DNS Options, Host Aliases with IP format hints
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
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                    Disclosure with Nested Grid (Disclosure)
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    Complex items with form controls at the top and a nested key-operator-value grid
                    or match expression table inside
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    Node Scheduling, Pod Affinity, HPA Metrics, Network Policy Rules
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
                (text-label-sm) → input rows (grid-aligned, gap-1.5) → Add button (gap-1.5)
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>With Label &amp; Description (List):</strong> VStack gap-2 → label
                (text-label-lg) + description (text-body-md, subtle) → bg-subtle container → column
                headers + input rows (gap-1.5) + Add button (gap-1.5)
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>With Label (List):</strong> VStack gap-2 → label (text-label-lg) → bg-subtle
                container → column headers + input rows (gap-1.5) + Add button (gap-1.5)
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>With Description Headers (List):</strong> VStack gap-2 → label
                (text-label-lg) + description (text-body-md, subtle) → bg-subtle container → column
                headers (VStack gap-0.5: text-label-sm label + text-body-sm description) → input
                rows (grid-aligned, gap-1.5) → Add button (gap-1.5)
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Repeatable Field Group (Card):</strong> bg-subtle outer container → white
                inner cards (each with headers + close button + input rows) → Add button (mt-1)
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              <p className="text-body-sm text-[var(--color-text-default)]">
                <strong>Disclosure with Nested Grid (Disclosure):</strong> bordered container with
                overflow-hidden → Disclosure → bg-subtle trigger header (title + badges + summary) →
                Panel (px-4 py-4): top-level form controls (Select, NumberInput) + bg-subtle
                key-operator-value grid → Add button outside
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
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Label → table gap</td>
                  <td className="py-2 text-[var(--color-text-muted)]">8px (gap-2)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Label → description gap
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">4px (gap-1)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Section label</td>
                  <td className="py-2 text-[var(--color-text-muted)]">text-label-lg</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Section description
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">text-body-md text-subtle</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Container padding</td>
                  <td className="py-2 text-[var(--color-text-muted)]">12px (p-3)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Header → rows gap (List)
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">6px (gap-1.5)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Header → rows gap (Card)
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">6px (gap-1.5)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Rows → Add button gap
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">6px (gap-1.5)</td>
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
                    text-body-sm text-subtle, gap-0.5 (2px) from label
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Border radius</td>
                  <td className="py-2 text-[var(--color-text-muted)]">6px (rounded-[6px])</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Disclosure trigger padding
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">px-4 py-3 (16px × 12px)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Disclosure panel padding
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">px-4 py-4 (16px × 16px)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Disclosure panel internal gap
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">24px (gap-6)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Disclosure items gap
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">8px (gap-2)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                    Disclosure border radius
                  </td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    var(--primitive-radius-md) (6px)
                  </td>
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
        {
          label: 'Nested Box Pattern',
          path: '/design/test/nested-box',
          description: 'Full Disclosure pattern examples with real-world data',
        },
      ]}
    />
  );
}
