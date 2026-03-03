import { useState } from 'react';
import {
  VStack,
  HStack,
  Button,
  Input,
  Select,
  SectionCard,
  Disclosure,
  NumberInput,
  Badge,
} from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

/* ──────────────────────────────────────────────
   Shared types & helpers
   ────────────────────────────────────────────── */

type KVRow = { key: string; value: string };

function useKVState(initial: KVRow[] = [{ key: '', value: '' }]) {
  const [rows, setRows] = useState<KVRow[]>(initial);
  const add = () => setRows([...rows, { key: '', value: '' }]);
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  return { rows, add, remove, update };
}

function KVGrid({
  rows,
  onAdd,
  onRemove,
  onUpdate,
  addLabel,
  keyPlaceholder = 'key',
  valuePlaceholder = 'value',
}: {
  rows: KVRow[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdate: (i: number, field: 'key' | 'value', val: string) => void;
  addLabel: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  return (
    <VStack gap={1}>
      {rows.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
          <span className="block text-label-sm text-[var(--color-text-subtle)]">Key</span>
          <span className="block text-label-sm text-[var(--color-text-subtle)]">Value</span>
          <div className="w-5" />
        </div>
      )}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
          <Input
            placeholder={keyPlaceholder}
            value={row.key}
            onChange={(e) => onUpdate(i, 'key', e.target.value)}
            fullWidth
          />
          <Input
            placeholder={valuePlaceholder}
            value={row.value}
            onChange={(e) => onUpdate(i, 'value', e.target.value)}
            fullWidth
          />
          <button
            onClick={() => onRemove(i)}
            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          >
            <IconX size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      ))}
      <div className="w-fit mt-1">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      </div>
    </VStack>
  );
}

/* ──────────────────────────────────────────────
   Shared types for Node Scheduling
   ────────────────────────────────────────────── */

interface MatchExpression {
  key: string;
  operator: string;
  value: string;
}

interface AffinityTerm {
  priority: string;
  weight: number;
  matchExpressions: MatchExpression[];
}

const OPERATOR_OPTIONS = [
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'NotIn' },
  { value: 'Exists', label: 'Exists' },
  { value: 'DoesNotExist', label: 'DoesNotExist' },
  { value: 'Gt', label: 'Gt' },
  { value: 'Lt', label: 'Lt' },
];

const PRIORITY_OPTIONS = [
  { value: 'required', label: 'Required' },
  { value: 'preferred', label: 'Preferred' },
];

function createDefaultTerms(): AffinityTerm[] {
  return [
    {
      priority: 'required',
      weight: 50,
      matchExpressions: [
        { key: 'kubernetes.io/os', operator: 'In', value: 'linux' },
        { key: 'node-type', operator: 'In', value: 'compute' },
      ],
    },
    {
      priority: 'preferred',
      weight: 30,
      matchExpressions: [
        { key: 'topology.kubernetes.io/zone', operator: 'In', value: 'us-east-1a' },
      ],
    },
  ];
}

function useTerms() {
  const [terms, setTerms] = useState<AffinityTerm[]>(createDefaultTerms);

  const addTerm = () =>
    setTerms([
      ...terms,
      {
        priority: 'preferred',
        weight: 1,
        matchExpressions: [{ key: '', operator: 'In', value: '' }],
      },
    ]);

  const removeTerm = (ti: number) => setTerms(terms.filter((_, i) => i !== ti));

  const updateTerm = (ti: number, field: 'priority' | 'weight', val: string | number) =>
    setTerms(terms.map((t, i) => (i === ti ? { ...t, [field]: val } : t)));

  const addExpression = (ti: number) =>
    setTerms(
      terms.map((t, i) =>
        i === ti
          ? {
              ...t,
              matchExpressions: [...t.matchExpressions, { key: '', operator: 'In', value: '' }],
            }
          : t
      )
    );

  const removeExpression = (ti: number, ei: number) =>
    setTerms(
      terms.map((t, i) =>
        i === ti ? { ...t, matchExpressions: t.matchExpressions.filter((_, j) => j !== ei) } : t
      )
    );

  const updateExpression = (ti: number, ei: number, field: keyof MatchExpression, val: string) =>
    setTerms(
      terms.map((t, i) =>
        i === ti
          ? {
              ...t,
              matchExpressions: t.matchExpressions.map((e, j) =>
                j === ei ? { ...e, [field]: val } : e
              ),
            }
          : t
      )
    );

  return {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  };
}

/* ──────────────────────────────────────────────
   Match Expressions Grid (reusable)
   ────────────────────────────────────────────── */

function MatchExpressionsGrid({
  expressions,
  onAdd,
  onRemove,
  onUpdate,
}: {
  expressions: MatchExpression[];
  onAdd: () => void;
  onRemove: (ei: number) => void;
  onUpdate: (ei: number, field: keyof MatchExpression, val: string) => void;
}) {
  return (
    <VStack gap={1}>
      {expressions.length > 0 && (
        <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full">
          <span className="block text-label-sm text-[var(--color-text-subtle)]">Key</span>
          <span className="block text-label-sm text-[var(--color-text-subtle)]">Operator</span>
          <span className="block text-label-sm text-[var(--color-text-subtle)]">Value</span>
          <div className="w-5" />
        </div>
      )}
      {expressions.map((expr, ei) => (
        <div key={ei} className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full items-center">
          <Input
            placeholder="e.g. kubernetes.io/os"
            value={expr.key}
            onChange={(e) => onUpdate(ei, 'key', e.target.value)}
            fullWidth
          />
          <Select
            options={OPERATOR_OPTIONS}
            value={expr.operator}
            onChange={(val) => onUpdate(ei, 'operator', val)}
            fullWidth
          />
          <Input
            placeholder="e.g. linux"
            value={expr.value}
            onChange={(e) => onUpdate(ei, 'value', e.target.value)}
            fullWidth
          />
          <button
            onClick={() => onRemove(ei)}
            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          >
            <IconX size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      ))}
      <div className="w-fit mt-1">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
          onClick={onAdd}
        >
          Add Rule
        </Button>
      </div>
    </VStack>
  );
}

/* ──────────────────────────────────────────────
   Labels & Annotations — Patterns A–D
   ────────────────────────────────────────────── */

function PatternA() {
  const labels = useKVState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);
  const annotations = useKVState([{ key: 'description', value: 'Main web server' }]);

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Pattern A: Current (Bordered Containers)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <KVGrid
                rows={labels.rows}
                onAdd={labels.add}
                onRemove={labels.remove}
                onUpdate={labels.update}
                addLabel="Add Label"
                keyPlaceholder="label key"
                valuePlaceholder="label value"
              />
            </div>
          </VStack>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <KVGrid
                rows={annotations.rows}
                onAdd={annotations.add}
                onRemove={annotations.remove}
                onUpdate={annotations.update}
                addLabel="Add Annotation"
                keyPlaceholder="annotation key"
                valuePlaceholder="annotation value"
              />
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function PatternB() {
  const labels = useKVState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);
  const annotations = useKVState([{ key: 'description', value: 'Main web server' }]);

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Pattern B: Flat (No Inner Box)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>
            <KVGrid
              rows={labels.rows}
              onAdd={labels.add}
              onRemove={labels.remove}
              onUpdate={labels.update}
              addLabel="Add Label"
              keyPlaceholder="label key"
              valuePlaceholder="label value"
            />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>
            <KVGrid
              rows={annotations.rows}
              onAdd={annotations.add}
              onRemove={annotations.remove}
              onUpdate={annotations.update}
              addLabel="Add Annotation"
              keyPlaceholder="annotation key"
              valuePlaceholder="annotation value"
            />
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function PatternC() {
  const labels = useKVState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);
  const annotations = useKVState([{ key: 'description', value: 'Main web server' }]);

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Pattern C: Background Only (No Border)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] px-4 py-3 w-full">
              <KVGrid
                rows={labels.rows}
                onAdd={labels.add}
                onRemove={labels.remove}
                onUpdate={labels.update}
                addLabel="Add Label"
                keyPlaceholder="label key"
                valuePlaceholder="label value"
              />
            </div>
          </VStack>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] px-4 py-3 w-full">
              <KVGrid
                rows={annotations.rows}
                onAdd={annotations.add}
                onRemove={annotations.remove}
                onUpdate={annotations.update}
                addLabel="Add Annotation"
                keyPlaceholder="annotation key"
                valuePlaceholder="annotation value"
              />
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function PatternD() {
  const labels = useKVState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);
  const annotations = useKVState([{ key: 'description', value: 'Main web server' }]);

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Pattern D: Divider + Indented" />
      <SectionCard.Content className="pt-3">
        <VStack gap={6}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>
            <div className="pl-3 border-l-2 border-[var(--color-border-default)]">
              <KVGrid
                rows={labels.rows}
                onAdd={labels.add}
                onRemove={labels.remove}
                onUpdate={labels.update}
                addLabel="Add Label"
                keyPlaceholder="label key"
                valuePlaceholder="label value"
              />
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>
            <div className="pl-3 border-l-2 border-[var(--color-border-default)]">
              <KVGrid
                rows={annotations.rows}
                onAdd={annotations.add}
                onRemove={annotations.remove}
                onUpdate={annotations.update}
                addLabel="Add Annotation"
                keyPlaceholder="annotation key"
                valuePlaceholder="annotation value"
              />
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Node Scheduling — Variant A: Current (4-level)
   ══════════════════════════════════════════════ */

function NodeSchedulingA() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = useTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Variant A: Current (4-level nesting)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Matching scheduling rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for scheduling pods on specific nodes based on node labels.
            </p>
          </VStack>

          {/* L1: outer bordered box */}
          <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
            <VStack gap={3}>
              {terms.map((term, ti) => (
                /* L2: term bordered box */
                <div
                  key={ti}
                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                >
                  <VStack gap={6} className="w-full">
                    <HStack gap={2} align="center" className="w-full">
                      <span className="text-label-sm text-[var(--color-text-default)] font-semibold">
                        Term {ti + 1}
                      </span>
                      {terms.length > 1 && (
                        <button
                          onClick={() => removeTerm(ti)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors ml-auto"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </HStack>
                    <VStack gap={2} className="w-full">
                      <VStack gap={1}>
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Priority
                        </span>
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          Specify the priority value applied to node scheduling.
                        </p>
                      </VStack>
                      <Select
                        options={PRIORITY_OPTIONS}
                        value={term.priority}
                        onChange={(val) => updateTerm(ti, 'priority', val)}
                        fullWidth
                      />
                    </VStack>
                    <VStack gap={2} className="w-full">
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Weight
                      </span>
                      <NumberInput
                        min={1}
                        max={100}
                        step={1}
                        value={term.weight}
                        onChange={(val) => updateTerm(ti, 'weight', val)}
                        width="sm"
                      />
                    </VStack>
                    {/* L3: match expressions bordered box */}
                    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
                      <MatchExpressionsGrid
                        expressions={term.matchExpressions}
                        onAdd={() => addExpression(ti)}
                        onRemove={(ei) => removeExpression(ti, ei)}
                        onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                      />
                    </div>
                  </VStack>
                </div>
              ))}
              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                  onClick={addTerm}
                >
                  Add Node Selector
                </Button>
              </div>
            </VStack>
          </div>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Node Scheduling — Variant B: Flattened (L1 removed, bg-subtle terms)
   ══════════════════════════════════════════════ */

function NodeSchedulingB() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = useTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Variant B: Flattened (bg-subtle cards, no L1 wrapper)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Matching scheduling rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for scheduling pods on specific nodes based on node labels.
            </p>
          </VStack>

          <VStack gap={3}>
            {terms.map((term, ti) => (
              <div
                key={ti}
                className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] px-4 py-4 w-full"
              >
                <VStack gap={4}>
                  <HStack gap={2} align="center" className="w-full">
                    <span className="text-label-sm text-[var(--color-text-default)] font-semibold">
                      Term {ti + 1}
                    </span>
                    {terms.length > 1 && (
                      <button
                        onClick={() => removeTerm(ti)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors ml-auto"
                      >
                        <IconX size={14} className="text-[var(--color-text-muted)]" />
                      </button>
                    )}
                  </HStack>

                  <HStack gap={4} className="w-full">
                    <VStack gap={1} className="flex-1">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Priority
                      </span>
                      <Select
                        options={PRIORITY_OPTIONS}
                        value={term.priority}
                        onChange={(val) => updateTerm(ti, 'priority', val)}
                        fullWidth
                      />
                    </VStack>
                    <VStack gap={1} className="w-[120px]">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Weight</span>
                      <NumberInput
                        min={1}
                        max={100}
                        step={1}
                        value={term.weight}
                        onChange={(val) => updateTerm(ti, 'weight', val)}
                        width="xs"
                      />
                    </VStack>
                  </HStack>

                  <VStack gap={1}>
                    <span className="text-label-sm text-[var(--color-text-subtle)]">
                      Match Expressions
                    </span>
                    <MatchExpressionsGrid
                      expressions={term.matchExpressions}
                      onAdd={() => addExpression(ti)}
                      onRemove={(ei) => removeExpression(ti, ei)}
                      onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                    />
                  </VStack>
                </VStack>
              </div>
            ))}
            <div className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addTerm}
              >
                Add Node Selector
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Node Scheduling — Variant C: Disclosure (Accordion)
   ══════════════════════════════════════════════ */

function NodeSchedulingC() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = useTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Variant C: Disclosure (Accordion per Term)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Matching scheduling rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for scheduling pods on specific nodes based on node labels.
            </p>
          </VStack>

          <VStack gap={2}>
            {terms.map((term, ti) => (
              <div
                key={ti}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={ti === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>Term {ti + 1}</span>
                          <Badge variant="info" size="sm">
                            {term.priority === 'required' ? 'Required' : 'Preferred'}
                          </Badge>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            W:{term.weight} · {term.matchExpressions.length} rule
                            {term.matchExpressions.length !== 1 ? 's' : ''}
                          </span>
                        </HStack>
                      </Disclosure.Trigger>
                      {terms.length > 1 && (
                        <button
                          onClick={() => removeTerm(ti)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </HStack>
                  </div>
                  <Disclosure.Panel className="px-4 py-4">
                    <VStack gap={4}>
                      <HStack gap={4} className="w-full">
                        <VStack gap={1} className="flex-1">
                          <span className="text-label-sm text-[var(--color-text-subtle)]">
                            Priority
                          </span>
                          <Select
                            options={PRIORITY_OPTIONS}
                            value={term.priority}
                            onChange={(val) => updateTerm(ti, 'priority', val)}
                            fullWidth
                          />
                        </VStack>
                        <VStack gap={1} className="w-[120px]">
                          <span className="text-label-sm text-[var(--color-text-subtle)]">
                            Weight
                          </span>
                          <NumberInput
                            min={1}
                            max={100}
                            step={1}
                            value={term.weight}
                            onChange={(val) => updateTerm(ti, 'weight', val)}
                            width="xs"
                          />
                        </VStack>
                      </HStack>

                      <VStack gap={1}>
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Match Expressions
                        </span>
                        <MatchExpressionsGrid
                          expressions={term.matchExpressions}
                          onAdd={() => addExpression(ti)}
                          onRemove={(ei) => removeExpression(ti, ei)}
                          onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                        />
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
                Add Node Selector
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Node Scheduling — Variant D: 2-Column Compact
   ══════════════════════════════════════════════ */

function NodeSchedulingD() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = useTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Variant D: 2-Column Compact (Priority+Weight inline)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Matching scheduling rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for scheduling pods on specific nodes based on node labels.
            </p>
          </VStack>

          <VStack gap={4}>
            {terms.map((term, ti) => (
              <div key={ti} className="w-full">
                <VStack gap={3}>
                  {/* Term header + Priority/Weight on one line */}
                  <HStack gap={3} align="end" className="w-full">
                    <span className="text-label-sm text-[var(--color-text-default)] font-semibold pb-1.5">
                      Term {ti + 1}
                    </span>
                    <VStack gap={1} className="flex-1">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Priority
                      </span>
                      <Select
                        options={PRIORITY_OPTIONS}
                        value={term.priority}
                        onChange={(val) => updateTerm(ti, 'priority', val)}
                        fullWidth
                      />
                    </VStack>
                    <VStack gap={1} className="w-[120px]">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Weight</span>
                      <NumberInput
                        min={1}
                        max={100}
                        step={1}
                        value={term.weight}
                        onChange={(val) => updateTerm(ti, 'weight', val)}
                        width="xs"
                      />
                    </VStack>
                    {terms.length > 1 && (
                      <button
                        onClick={() => removeTerm(ti)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors mb-1.5"
                      >
                        <IconX size={14} className="text-[var(--color-text-muted)]" />
                      </button>
                    )}
                  </HStack>

                  {/* Match Expressions — inline grid, no box */}
                  <MatchExpressionsGrid
                    expressions={term.matchExpressions}
                    onAdd={() => addExpression(ti)}
                    onRemove={(ei) => removeExpression(ti, ei)}
                    onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                  />

                  {/* Divider between terms */}
                  {ti < terms.length - 1 && (
                    <div className="w-full h-px bg-[var(--color-border-subtle)] mt-1" />
                  )}
                </VStack>
              </div>
            ))}
            <div className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addTerm}
              >
                Add Node Selector
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Node Scheduling — Variant E: Left Vertical Bar
   ══════════════════════════════════════════════ */

function NodeSchedulingE() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = useTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Variant E: Left Vertical Bar (Primer/GitHub style)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Matching scheduling rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for scheduling pods on specific nodes based on node labels.
            </p>
          </VStack>

          <VStack gap={0}>
            {terms.map((term, ti) => (
              <div key={ti} className="w-full">
                <div className="border-l-2 border-[var(--color-primary)] pl-4 py-3">
                  <VStack gap={4}>
                    <HStack gap={2} align="center" className="w-full">
                      <span className="text-label-sm text-[var(--color-text-default)] font-semibold">
                        Term {ti + 1}
                      </span>
                      <Badge variant="info" size="sm">
                        {term.priority === 'required' ? 'Required' : 'Preferred'}
                      </Badge>
                      {terms.length > 1 && (
                        <button
                          onClick={() => removeTerm(ti)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors ml-auto"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </HStack>

                    <HStack gap={4} className="w-full">
                      <VStack gap={1} className="flex-1">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Priority
                        </span>
                        <Select
                          options={PRIORITY_OPTIONS}
                          value={term.priority}
                          onChange={(val) => updateTerm(ti, 'priority', val)}
                          fullWidth
                        />
                      </VStack>
                      <VStack gap={1} className="w-[120px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Weight
                        </span>
                        <NumberInput
                          min={1}
                          max={100}
                          step={1}
                          value={term.weight}
                          onChange={(val) => updateTerm(ti, 'weight', val)}
                          width="xs"
                        />
                      </VStack>
                    </HStack>

                    <VStack gap={1}>
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Match Expressions
                      </span>
                      <MatchExpressionsGrid
                        expressions={term.matchExpressions}
                        onAdd={() => addExpression(ti)}
                        onRemove={(ei) => removeExpression(ti, ei)}
                        onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                      />
                    </VStack>
                  </VStack>
                </div>
                {ti < terms.length - 1 && (
                  <div className="w-full h-px bg-[var(--color-border-subtle)] ml-4" />
                )}
              </div>
            ))}
          </VStack>

          <div className="w-fit">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
              onClick={addTerm}
            >
              Add Node Selector
            </Button>
          </div>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Page Export
   ══════════════════════════════════════════════ */

export function NestedBoxTestPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <VStack gap={8}>
        <VStack gap={2}>
          <h1 className="text-heading-h3 text-[var(--color-text-default)]">
            Nested Box Pattern Test
          </h1>
          <p className="text-body-lg text-[var(--color-text-muted)]">
            SectionCard 내부에서 중첩 박스가 발생하는 패턴들에 대해 다양한 시안을 비교합니다.
          </p>
        </VStack>

        {/* ── Section 1: Labels & Annotations (2-level) ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            1. Labels & Annotations (2-level)
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            SectionCard 안에 Key-Value 그리드를 배치하는 4가지 방식
          </p>
        </VStack>

        <PatternA />
        <PatternB />
        <PatternC />
        <PatternD />

        {/* ── Section 2: Node Scheduling (4-level deep nesting) ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            2. Node Scheduling (4-level Deep Nesting)
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            SectionCard {'>'} 그룹 박스 {'>'} Term 박스 {'>'} Expressions 박스의 4단 중첩 문제에
            대한 5가지 시안. 각 시안은 동일한 데이터(2개 Term, Required/Preferred)로 비교합니다.
          </p>
        </VStack>

        <NodeSchedulingA />
        <NodeSchedulingB />
        <NodeSchedulingC />
        <NodeSchedulingD />
        <NodeSchedulingE />
      </VStack>
    </div>
  );
}
