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
  Checkbox,
  Radio,
  RadioGroup,
  InlineMessage,
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
    <VStack gap={1.5}>
      {rows.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
          <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
          <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
          <div />
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
            <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
        </div>
      ))}
      <div className="w-fit">
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
    <VStack gap={1.5}>
      {expressions.length > 0 && (
        <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full">
          <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
          <span className="block text-label-sm text-[var(--color-text-default)]">Operator</span>
          <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
          <div />
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
            <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
        </div>
      ))}
      <div className="w-fit">
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
      <SectionCard.Header title="Pattern A: Dynamic Form Fields (bg-subtle wrapper)" />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
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
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
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
   Node Scheduling — Final: Disclosure + Variant A internal layout
   ══════════════════════════════════════════════ */

function NodeSchedulingFinal() {
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
      <SectionCard.Header title="Final: Disclosure + Variant A Internal Layout" />
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
                    <VStack gap={6}>
                      <HStack gap={2} className="w-full">
                        <VStack gap={2} className="flex-1">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Priority
                          </span>
                          <Select
                            options={PRIORITY_OPTIONS}
                            value={term.priority}
                            onChange={(val) => updateTerm(ti, 'priority', val)}
                            fullWidth
                          />
                        </VStack>
                        <VStack gap={2} className="shrink-0">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
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
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <MatchExpressionsGrid
                          expressions={term.matchExpressions}
                          onAdd={() => addExpression(ti)}
                          onRemove={(ei) => removeExpression(ti, ei)}
                          onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                        />
                      </div>
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
   Pod Affinity — Disclosure pattern
   ══════════════════════════════════════════════ */

interface PodAffinityTerm {
  type: string;
  priority: string;
  topologyKey: string;
  weight: number;
  matchExpressions: MatchExpression[];
}

const AFFINITY_TYPE_OPTIONS = [
  { value: 'affinity', label: 'Affinity' },
  { value: 'anti-affinity', label: 'Anti-Affinity' },
];

const TOPOLOGY_KEY_OPTIONS = [
  { value: 'kubernetes.io/hostname', label: 'kubernetes.io/hostname' },
  { value: 'topology.kubernetes.io/zone', label: 'topology.kubernetes.io/zone' },
  { value: 'topology.kubernetes.io/region', label: 'topology.kubernetes.io/region' },
];

function usePodAffinityTerms() {
  const [terms, setTerms] = useState<PodAffinityTerm[]>([
    {
      type: 'affinity',
      priority: 'required',
      topologyKey: 'kubernetes.io/hostname',
      weight: 100,
      matchExpressions: [{ key: 'app', operator: 'In', value: 'web' }],
    },
    {
      type: 'anti-affinity',
      priority: 'preferred',
      topologyKey: 'topology.kubernetes.io/zone',
      weight: 50,
      matchExpressions: [{ key: 'app', operator: 'In', value: 'cache' }],
    },
  ]);

  const addTerm = () =>
    setTerms([
      ...terms,
      {
        type: 'affinity',
        priority: 'preferred',
        topologyKey: '',
        weight: 1,
        matchExpressions: [{ key: '', operator: 'In', value: '' }],
      },
    ]);

  const removeTerm = (i: number) => setTerms(terms.filter((_, idx) => idx !== i));

  const updateTerm = (i: number, field: string, val: string | number) =>
    setTerms(terms.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)));

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

function PodAffinityFinal() {
  const {
    terms,
    addTerm,
    removeTerm,
    updateTerm,
    addExpression,
    removeExpression,
    updateExpression,
  } = usePodAffinityTerms();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Pod Scheduling — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Pod affinity / anti-affinity rules
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define rules for co-locating or spreading pods relative to other pods.
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
                          <Badge
                            variant={term.type === 'anti-affinity' ? 'warning' : 'info'}
                            size="sm"
                          >
                            {term.type === 'anti-affinity' ? 'Anti-Affinity' : 'Affinity'}
                          </Badge>
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
                    <VStack gap={6}>
                      <HStack gap={2} className="w-full">
                        <VStack gap={2} className="flex-1">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Type
                          </span>
                          <Select
                            options={AFFINITY_TYPE_OPTIONS}
                            value={term.type}
                            onChange={(val) => updateTerm(ti, 'type', val)}
                            fullWidth
                          />
                        </VStack>
                        <VStack gap={2} className="flex-1">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Priority
                          </span>
                          <Select
                            options={PRIORITY_OPTIONS}
                            value={term.priority}
                            onChange={(val) => updateTerm(ti, 'priority', val)}
                            fullWidth
                          />
                        </VStack>
                        <VStack gap={2} className="shrink-0">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
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
                      <VStack gap={2} className="w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Topology Key
                        </span>
                        <Select
                          options={TOPOLOGY_KEY_OPTIONS}
                          value={term.topologyKey}
                          onChange={(val) => updateTerm(ti, 'topologyKey', val)}
                          placeholder="Select topology key"
                          fullWidth
                        />
                      </VStack>
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <MatchExpressionsGrid
                          expressions={term.matchExpressions}
                          onAdd={() => addExpression(ti)}
                          onRemove={(ei) => removeExpression(ti, ei)}
                          onUpdate={(ei, field, val) => updateExpression(ti, ei, field, val)}
                        />
                      </div>
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
                Add Pod Selector
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Ingress Rules — Disclosure pattern
   ══════════════════════════════════════════════ */

interface IngressPath {
  id: string;
  pathType: string;
  path: string;
  targetService: string;
  port: string;
}

interface IngressRule {
  id: string;
  host: string;
  paths: IngressPath[];
}

const PATH_TYPE_OPTIONS = [
  { value: 'Prefix', label: 'Prefix' },
  { value: 'Exact', label: 'Exact' },
  { value: 'ImplementationSpecific', label: 'ImplementationSpecific' },
];

const SERVICE_OPTIONS = [
  { value: 'web-svc', label: 'web-svc' },
  { value: 'api-svc', label: 'api-svc' },
  { value: 'auth-svc', label: 'auth-svc' },
];

function useIngressRules() {
  const [rules, setRules] = useState<IngressRule[]>([
    {
      id: crypto.randomUUID(),
      host: 'example.com',
      paths: [
        {
          id: crypto.randomUUID(),
          pathType: 'Prefix',
          path: '/',
          targetService: 'web-svc',
          port: '80',
        },
        {
          id: crypto.randomUUID(),
          pathType: 'Prefix',
          path: '/api',
          targetService: 'api-svc',
          port: '8080',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      host: 'api.example.com',
      paths: [
        {
          id: crypto.randomUUID(),
          pathType: 'Exact',
          path: '/v1',
          targetService: 'api-svc',
          port: '8080',
        },
      ],
    },
  ]);

  const addRule = () =>
    setRules([
      ...rules,
      {
        id: crypto.randomUUID(),
        host: '',
        paths: [
          { id: crypto.randomUUID(), pathType: 'Prefix', path: '', targetService: '', port: '' },
        ],
      },
    ]);

  const removeRule = (ruleId: string) => setRules(rules.filter((r) => r.id !== ruleId));

  const updateRule = (ruleId: string, field: string, val: string) =>
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, [field]: val } : r)));

  const addPath = (ruleId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              paths: [
                ...r.paths,
                {
                  id: crypto.randomUUID(),
                  pathType: 'Prefix',
                  path: '',
                  targetService: '',
                  port: '',
                },
              ],
            }
          : r
      )
    );

  const removePath = (ruleId: string, pathId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId ? { ...r, paths: r.paths.filter((p) => p.id !== pathId) } : r
      )
    );

  const updatePath = (ruleId: string, pathId: string, field: string, val: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? { ...r, paths: r.paths.map((p) => (p.id === pathId ? { ...p, [field]: val } : p)) }
          : r
      )
    );

  return { rules, addRule, removeRule, updateRule, addPath, removePath, updatePath };
}

function IngressRulesFinal() {
  const { rules, addRule, removeRule, updateRule, addPath, removePath, updatePath } =
    useIngressRules();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Ingress Rules — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">Rules</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define routing rules to map incoming requests to backend services.
            </p>
          </VStack>

          <VStack gap={2}>
            {rules.map((rule, ri) => (
              <div
                key={rule.id}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={ri === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>Rule {ri + 1}</span>
                          {rule.host && (
                            <Badge variant="info" size="sm">
                              {rule.host}
                            </Badge>
                          )}
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {rule.paths.length} path{rule.paths.length !== 1 ? 's' : ''}
                          </span>
                        </HStack>
                      </Disclosure.Trigger>
                      {rules.length > 1 && (
                        <button
                          onClick={() => removeRule(rule.id)}
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
                          Request Host
                        </span>
                        <Input
                          placeholder="e.g. example.com"
                          value={rule.host}
                          onChange={(e) => updateRule(rule.id, 'host', e.target.value)}
                          fullWidth
                        />
                      </VStack>
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <VStack gap={1.5}>
                          {rule.paths.length > 0 && (
                            <div className="grid grid-cols-[2fr_1fr_1fr_20px] gap-1 w-full">
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Path
                              </span>
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Target Service
                              </span>
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Port
                              </span>
                              <div />
                            </div>
                          )}
                          {rule.paths.map((path) => (
                            <div
                              key={path.id}
                              className="grid grid-cols-[2fr_1fr_1fr_20px] gap-1 w-full items-center"
                            >
                              <HStack gap={1}>
                                <Select
                                  options={PATH_TYPE_OPTIONS}
                                  value={path.pathType}
                                  onChange={(val) => updatePath(rule.id, path.id, 'pathType', val)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="e.g. /foo"
                                  value={path.path}
                                  onChange={(e) =>
                                    updatePath(rule.id, path.id, 'path', e.target.value)
                                  }
                                  fullWidth
                                />
                              </HStack>
                              <Select
                                options={SERVICE_OPTIONS}
                                value={path.targetService}
                                onChange={(val) =>
                                  updatePath(rule.id, path.id, 'targetService', val)
                                }
                                fullWidth
                              />
                              <Input
                                placeholder="e.g. 80"
                                value={path.port}
                                onChange={(e) =>
                                  updatePath(rule.id, path.id, 'port', e.target.value)
                                }
                                fullWidth
                              />
                              <button
                                onClick={() => removePath(rule.id, path.id)}
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
                              onClick={() => addPath(rule.id)}
                            >
                              Add Path
                            </Button>
                          </div>
                        </VStack>
                      </div>
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
                onClick={addRule}
              >
                Add Rule
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Network Policy Rules — Disclosure pattern
   ══════════════════════════════════════════════ */

interface LabelSelector {
  id: string;
  key: string;
  operator: string;
  values: string;
}

interface NetworkTarget {
  id: string;
  ruleType: string;
  cidr: string;
  selectors: LabelSelector[];
}

interface AllowedPort {
  id: string;
  port: string;
  protocol: string;
}

interface NetworkRule {
  id: string;
  name: string;
  targets: NetworkTarget[];
  allowedPorts: AllowedPort[];
}

const RULE_TYPE_OPTIONS = [
  { value: 'ip-block', label: 'IP Block' },
  { value: 'namespace-label-selector', label: 'Namespace Label Selector' },
  { value: 'pod-label-selector', label: 'Pod Label Selector' },
];

const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
];

function useNetworkRules() {
  const [rules, setRules] = useState<NetworkRule[]>([
    {
      id: crypto.randomUUID(),
      name: 'Rule-1',
      targets: [
        {
          id: crypto.randomUUID(),
          ruleType: 'namespace-label-selector',
          cidr: '',
          selectors: [
            { id: crypto.randomUUID(), key: 'env', operator: 'In', values: 'production' },
          ],
        },
      ],
      allowedPorts: [{ id: crypto.randomUUID(), port: '8080', protocol: 'TCP' }],
    },
    {
      id: crypto.randomUUID(),
      name: 'Rule-2',
      targets: [
        {
          id: crypto.randomUUID(),
          ruleType: 'ip-block',
          cidr: '10.0.0.0/8',
          selectors: [],
        },
      ],
      allowedPorts: [{ id: crypto.randomUUID(), port: '443', protocol: 'TCP' }],
    },
  ]);

  const addRule = () =>
    setRules([
      ...rules,
      {
        id: crypto.randomUUID(),
        name: `Rule-${rules.length + 1}`,
        targets: [],
        allowedPorts: [],
      },
    ]);

  const removeRule = (ruleId: string) => setRules(rules.filter((r) => r.id !== ruleId));

  const addTarget = (ruleId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              targets: [
                ...r.targets,
                { id: crypto.randomUUID(), ruleType: 'ip-block', cidr: '', selectors: [] },
              ],
            }
          : r
      )
    );

  const removeTarget = (ruleId: string, targetId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId ? { ...r, targets: r.targets.filter((t) => t.id !== targetId) } : r
      )
    );

  const updateTarget = (ruleId: string, targetId: string, field: string, val: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              targets: r.targets.map((t) => (t.id === targetId ? { ...t, [field]: val } : t)),
            }
          : r
      )
    );

  const addSelector = (ruleId: string, targetId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              targets: r.targets.map((t) =>
                t.id === targetId
                  ? {
                      ...t,
                      selectors: [
                        ...t.selectors,
                        { id: crypto.randomUUID(), key: '', operator: 'In', values: '' },
                      ],
                    }
                  : t
              ),
            }
          : r
      )
    );

  const removeSelector = (ruleId: string, targetId: string, selId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              targets: r.targets.map((t) =>
                t.id === targetId
                  ? { ...t, selectors: t.selectors.filter((s) => s.id !== selId) }
                  : t
              ),
            }
          : r
      )
    );

  const updateSelector = (
    ruleId: string,
    targetId: string,
    selId: string,
    field: string,
    val: string
  ) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              targets: r.targets.map((t) =>
                t.id === targetId
                  ? {
                      ...t,
                      selectors: t.selectors.map((s) =>
                        s.id === selId ? { ...s, [field]: val } : s
                      ),
                    }
                  : t
              ),
            }
          : r
      )
    );

  const addPort = (ruleId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              allowedPorts: [
                ...r.allowedPorts,
                { id: crypto.randomUUID(), port: '', protocol: 'TCP' },
              ],
            }
          : r
      )
    );

  const removePort = (ruleId: string, portId: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId ? { ...r, allowedPorts: r.allowedPorts.filter((p) => p.id !== portId) } : r
      )
    );

  const updatePort = (ruleId: string, portId: string, field: string, val: string) =>
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              allowedPorts: r.allowedPorts.map((p) =>
                p.id === portId ? { ...p, [field]: val } : p
              ),
            }
          : r
      )
    );

  return {
    rules,
    addRule,
    removeRule,
    addTarget,
    removeTarget,
    updateTarget,
    addSelector,
    removeSelector,
    updateSelector,
    addPort,
    removePort,
    updatePort,
  };
}

function NetworkPolicyFinal() {
  const {
    rules,
    addRule,
    removeRule,
    addTarget,
    removeTarget,
    updateTarget,
    addSelector,
    removeSelector,
    updateSelector,
    addPort,
    removePort,
    updatePort,
  } = useNetworkRules();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Network Policy Rules — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">Ingress Rules</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define allowed traffic sources and ports for each rule. Currently uses left-tab +
              right-panel layout with 4-level nesting.
            </p>
          </VStack>

          <VStack gap={2}>
            {rules.map((rule, ri) => (
              <div
                key={rule.id}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={ri === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>{rule.name}</span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {rule.targets.length} target{rule.targets.length !== 1 ? 's' : ''} ·{' '}
                            {rule.allowedPorts.length} port
                            {rule.allowedPorts.length !== 1 ? 's' : ''}
                          </span>
                        </HStack>
                      </Disclosure.Trigger>
                      {rules.length > 1 && (
                        <button
                          onClick={() => removeRule(rule.id)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </HStack>
                  </div>
                  <Disclosure.Panel className="px-4 py-4">
                    <VStack gap={6}>
                      {/* Targets */}
                      <VStack gap={3}>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Targets
                        </span>
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <VStack gap={1.5}>
                            {rule.targets.map((target) => (
                              <div
                                key={target.id}
                                className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                              >
                                <VStack gap={3}>
                                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                                    <Select
                                      options={RULE_TYPE_OPTIONS}
                                      value={target.ruleType}
                                      onChange={(val) =>
                                        updateTarget(rule.id, target.id, 'ruleType', val)
                                      }
                                      fullWidth
                                    />
                                    {target.ruleType === 'ip-block' ? (
                                      <Input
                                        placeholder="e.g. 10.0.0.0/8"
                                        value={target.cidr}
                                        onChange={(e) =>
                                          updateTarget(rule.id, target.id, 'cidr', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    ) : (
                                      <div />
                                    )}
                                    <button
                                      onClick={() => removeTarget(rule.id, target.id)}
                                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                    >
                                      <IconX
                                        size={16}
                                        className="text-[var(--color-text-muted)]"
                                        stroke={1.5}
                                      />
                                    </button>
                                  </div>
                                  {target.ruleType !== 'ip-block' && (
                                    <VStack gap={1.5}>
                                      {target.selectors.length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Key
                                          </span>
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Operator
                                          </span>
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Values
                                          </span>
                                          <div />
                                        </div>
                                      )}
                                      {target.selectors.map((sel) => (
                                        <div
                                          key={sel.id}
                                          className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                                        >
                                          <Input
                                            placeholder="key"
                                            value={sel.key}
                                            onChange={(e) =>
                                              updateSelector(
                                                rule.id,
                                                target.id,
                                                sel.id,
                                                'key',
                                                e.target.value
                                              )
                                            }
                                            fullWidth
                                          />
                                          <Select
                                            options={OPERATOR_OPTIONS}
                                            value={sel.operator}
                                            onChange={(val) =>
                                              updateSelector(
                                                rule.id,
                                                target.id,
                                                sel.id,
                                                'operator',
                                                val
                                              )
                                            }
                                            fullWidth
                                          />
                                          <Input
                                            placeholder="values"
                                            value={sel.values}
                                            onChange={(e) =>
                                              updateSelector(
                                                rule.id,
                                                target.id,
                                                sel.id,
                                                'values',
                                                e.target.value
                                              )
                                            }
                                            fullWidth
                                          />
                                          <button
                                            onClick={() =>
                                              removeSelector(rule.id, target.id, sel.id)
                                            }
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
                                          onClick={() => addSelector(rule.id, target.id)}
                                        >
                                          Add selector
                                        </Button>
                                      </div>
                                    </VStack>
                                  )}
                                </VStack>
                              </div>
                            ))}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                onClick={() => addTarget(rule.id)}
                              >
                                Add target
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>

                      {/* Allowed Ports */}
                      <VStack gap={3}>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Allowed Ports
                        </span>
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <VStack gap={1.5}>
                            {rule.allowedPorts.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Port
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Protocol
                                </span>
                                <div />
                              </div>
                            )}
                            {rule.allowedPorts.map((port) => (
                              <div
                                key={port.id}
                                className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. 8080"
                                  value={port.port}
                                  onChange={(e) =>
                                    updatePort(rule.id, port.id, 'port', e.target.value)
                                  }
                                  fullWidth
                                />
                                <Select
                                  options={PROTOCOL_OPTIONS}
                                  value={port.protocol}
                                  onChange={(val) => updatePort(rule.id, port.id, 'protocol', val)}
                                  fullWidth
                                />
                                <button
                                  onClick={() => removePort(rule.id, port.id)}
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
                                onClick={() => addPort(rule.id)}
                              >
                                Add port
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
                onClick={addRule}
              >
                Add Rule
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Volume Claim Templates — Disclosure pattern
   ══════════════════════════════════════════════ */

interface VolumeClaimTemplate {
  id: string;
  name: string;
  useExistingPV: boolean;
  storageClass: string;
  capacity: number;
  persistentVolume: string;
  accessModes: { readWriteOnce: boolean; readOnlyMany: boolean; readWriteMany: boolean };
}

const STORAGE_CLASS_OPTIONS = [
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'premium-ssd', label: 'premium-ssd' },
];

const PV_OPTIONS = [
  { value: 'pv-1', label: 'pv-1 (50GiB, standard)' },
  { value: 'pv-2', label: 'pv-2 (100GiB, fast)' },
  { value: 'pv-3', label: 'pv-3 (200GiB, premium-ssd)' },
];

function useVolumeClaimTemplates() {
  const [templates, setTemplates] = useState<VolumeClaimTemplate[]>([
    {
      id: crypto.randomUUID(),
      name: 'data',
      useExistingPV: false,
      storageClass: 'standard',
      capacity: 50,
      persistentVolume: '',
      accessModes: { readWriteOnce: true, readOnlyMany: false, readWriteMany: false },
    },
    {
      id: crypto.randomUUID(),
      name: 'logs',
      useExistingPV: true,
      storageClass: '',
      capacity: 10,
      persistentVolume: 'pv-2',
      accessModes: { readWriteOnce: false, readOnlyMany: true, readWriteMany: false },
    },
  ]);

  const addTemplate = () =>
    setTemplates([
      ...templates,
      {
        id: crypto.randomUUID(),
        name: '',
        useExistingPV: false,
        storageClass: '',
        capacity: 10,
        persistentVolume: '',
        accessModes: { readWriteOnce: true, readOnlyMany: false, readWriteMany: false },
      },
    ]);

  const removeTemplate = (id: string) => setTemplates(templates.filter((t) => t.id !== id));

  const updateTemplate = (id: string, updates: Partial<VolumeClaimTemplate>) =>
    setTemplates(templates.map((t) => (t.id === id ? { ...t, ...updates } : t)));

  return { templates, addTemplate, removeTemplate, updateTemplate };
}

function VolumeClaimFinal() {
  const { templates, addTemplate, removeTemplate, updateTemplate } = useVolumeClaimTemplates();

  const getAccessModeSummary = (modes: VolumeClaimTemplate['accessModes']) => {
    const labels: string[] = [];
    if (modes.readWriteOnce) labels.push('RWO');
    if (modes.readOnlyMany) labels.push('ROX');
    if (modes.readWriteMany) labels.push('RWX');
    return labels.join(', ') || 'None';
  };

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Volume Claim Templates — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Volume claim templates
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define persistent volume claims for StatefulSet pods. Each template creates a unique
              PVC per replica.
            </p>
          </VStack>

          <VStack gap={2}>
            {templates.map((tpl, ti) => (
              <div
                key={tpl.id}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={ti === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>{tpl.name || `Volume ${ti + 1}`}</span>
                          <Badge variant="info" size="sm">
                            {tpl.useExistingPV ? 'Existing PV' : tpl.storageClass || 'New PV'}
                          </Badge>
                          {!tpl.useExistingPV && (
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              {tpl.capacity} GiB · {getAccessModeSummary(tpl.accessModes)}
                            </span>
                          )}
                        </HStack>
                      </Disclosure.Trigger>
                      {templates.length > 1 && (
                        <button
                          onClick={() => removeTemplate(tpl.id)}
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
                          PVC Name <span className="text-[var(--color-state-danger)]">*</span>
                        </span>
                        <Input
                          placeholder="pvc-name"
                          value={tpl.name}
                          onChange={(e) => updateTemplate(tpl.id, { name: e.target.value })}
                          fullWidth
                        />
                      </VStack>

                      <RadioGroup
                        value={tpl.useExistingPV ? 'existing' : 'new'}
                        onChange={(val) =>
                          updateTemplate(tpl.id, { useExistingPV: val === 'existing' })
                        }
                      >
                        <Radio
                          value="new"
                          label="Use storage class and create a new persistent volume"
                        />
                        <Radio value="existing" label="Use existing Persistent Volume" />
                      </RadioGroup>

                      {!tpl.useExistingPV && (
                        <HStack gap={2} className="w-full">
                          <VStack gap={2} className="flex-1">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Storage Class{' '}
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <Select
                              options={STORAGE_CLASS_OPTIONS}
                              value={tpl.storageClass}
                              onChange={(val) => updateTemplate(tpl.id, { storageClass: val })}
                              placeholder="Select storage class"
                              fullWidth
                            />
                          </VStack>
                          <VStack gap={2} className="shrink-0">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Capacity <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <NumberInput
                              value={tpl.capacity}
                              onChange={(val) => updateTemplate(tpl.id, { capacity: val ?? 1 })}
                              suffix="GiB"
                              width="sm"
                            />
                          </VStack>
                        </HStack>
                      )}

                      {tpl.useExistingPV && (
                        <VStack gap={2} className="w-full">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Persistent Volume{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </span>
                          <Select
                            options={PV_OPTIONS}
                            value={tpl.persistentVolume}
                            onChange={(val) => updateTemplate(tpl.id, { persistentVolume: val })}
                            placeholder="Select persistent volume"
                            fullWidth
                          />
                        </VStack>
                      )}

                      <VStack gap={2}>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Access Modes <span className="text-[var(--color-state-danger)]">*</span>
                        </span>
                        <VStack gap={2}>
                          <Checkbox
                            label="Single node read-write (RWO)"
                            checked={tpl.accessModes.readWriteOnce}
                            onChange={(e) =>
                              updateTemplate(tpl.id, {
                                accessModes: {
                                  ...tpl.accessModes,
                                  readWriteOnce: e.target.checked,
                                },
                              })
                            }
                          />
                          <Checkbox
                            label="Many nodes read-only (ROX)"
                            checked={tpl.accessModes.readOnlyMany}
                            onChange={(e) =>
                              updateTemplate(tpl.id, {
                                accessModes: { ...tpl.accessModes, readOnlyMany: e.target.checked },
                              })
                            }
                          />
                          <Checkbox
                            label="Many nodes read-write (RWX)"
                            checked={tpl.accessModes.readWriteMany}
                            onChange={(e) =>
                              updateTemplate(tpl.id, {
                                accessModes: {
                                  ...tpl.accessModes,
                                  readWriteMany: e.target.checked,
                                },
                              })
                            }
                          />
                        </VStack>
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
                onClick={addTemplate}
              >
                Add Volume Claim Template
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   Ingress Certificates — Disclosure pattern
   ══════════════════════════════════════════════ */

interface Certificate {
  id: string;
  secretName: string;
  hosts: string[];
}

const CERTIFICATE_OPTIONS = [
  { value: 'tls-secret-1', label: 'tls-secret-1' },
  { value: 'tls-secret-2', label: 'tls-secret-2' },
  { value: 'wildcard-cert', label: 'wildcard-cert' },
];

function useCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([
    {
      id: crypto.randomUUID(),
      secretName: 'tls-secret-1',
      hosts: ['example.com', 'www.example.com'],
    },
    {
      id: crypto.randomUUID(),
      secretName: 'wildcard-cert',
      hosts: ['*.api.example.com'],
    },
  ]);

  const addCert = () =>
    setCerts([...certs, { id: crypto.randomUUID(), secretName: '', hosts: [''] }]);

  const removeCert = (id: string) => setCerts(certs.filter((c) => c.id !== id));

  const updateCert = (id: string, field: string, val: string | string[]) =>
    setCerts(certs.map((c) => (c.id === id ? { ...c, [field]: val } : c)));

  return { certs, addCert, removeCert, updateCert };
}

function CertificatesFinal() {
  const { certs, addCert, removeCert, updateCert } = useCertificates();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Ingress Certificates — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">Certificates</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              TLS certificates for HTTPS termination. Each certificate maps a Secret to one or more
              host patterns.
            </p>
          </VStack>

          <VStack gap={2}>
            {certs.map((cert, ci) => (
              <div
                key={cert.id}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={ci === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>Certificate {ci + 1}</span>
                          {cert.secretName && (
                            <Badge variant="info" size="sm">
                              {cert.secretName}
                            </Badge>
                          )}
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {cert.hosts.filter(Boolean).length} host
                            {cert.hosts.filter(Boolean).length !== 1 ? 's' : ''}
                          </span>
                        </HStack>
                      </Disclosure.Trigger>
                      {certs.length > 1 && (
                        <button
                          onClick={() => removeCert(cert.id)}
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
                          Secret Name
                        </span>
                        <Select
                          options={CERTIFICATE_OPTIONS}
                          value={cert.secretName}
                          onChange={(val) => updateCert(cert.id, 'secretName', val)}
                          placeholder="Select certificate secret"
                          fullWidth
                        />
                      </VStack>
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <VStack gap={1.5}>
                          {cert.hosts.length > 0 && (
                            <div className="grid grid-cols-[1fr_20px] gap-1 w-full">
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Host
                              </span>
                              <div />
                            </div>
                          )}
                          {cert.hosts.map((host, hi) => (
                            <div
                              key={hi}
                              className="grid grid-cols-[1fr_20px] gap-1 w-full items-center"
                            >
                              <Input
                                placeholder="e.g. example.com"
                                value={host}
                                onChange={(e) => {
                                  const newHosts = [...cert.hosts];
                                  newHosts[hi] = e.target.value;
                                  updateCert(cert.id, 'hosts', newHosts);
                                }}
                                fullWidth
                              />
                              <button
                                onClick={() => {
                                  updateCert(
                                    cert.id,
                                    'hosts',
                                    cert.hosts.filter((_, idx) => idx !== hi)
                                  );
                                }}
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
                              onClick={() => updateCert(cert.id, 'hosts', [...cert.hosts, ''])}
                            >
                              Add host
                            </Button>
                          </div>
                        </VStack>
                      </div>
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
                onClick={addCert}
              >
                Add certificate
              </Button>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════
   HPA Metrics — Disclosure pattern
   ══════════════════════════════════════════════ */

interface HPAMetricSelector {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface HPAMetric {
  id: string;
  source: string;
  resourceName: string;
  type: string;
  quantity: number;
  metricName: string;
  referentApiVersion: string;
  referentKind: string;
  referentName: string;
  selectors: HPAMetricSelector[];
}

const METRIC_SOURCE_OPTIONS = [
  { value: 'Resource', label: 'Resource' },
  { value: 'Pods', label: 'Pods' },
  { value: 'Object', label: 'Object' },
  { value: 'External', label: 'External' },
];

const RESOURCE_NAME_OPTIONS = [
  { value: 'CPU', label: 'CPU' },
  { value: 'Memory', label: 'Memory' },
];

const TYPE_OPTIONS = [
  { value: 'AverageUtilization', label: 'Average Utilization' },
  { value: 'AverageValue', label: 'Average Value' },
  { value: 'Value', label: 'Value' },
];

function useHPAMetrics() {
  const [metrics, setMetrics] = useState<HPAMetric[]>([
    {
      id: crypto.randomUUID(),
      source: 'Resource',
      resourceName: 'CPU',
      type: 'AverageUtilization',
      quantity: 80,
      metricName: '',
      referentApiVersion: '',
      referentKind: '',
      referentName: '',
      selectors: [],
    },
    {
      id: crypto.randomUUID(),
      source: 'External',
      resourceName: '',
      type: 'AverageValue',
      quantity: 100,
      metricName: 'queue_messages_ready',
      referentApiVersion: '',
      referentKind: '',
      referentName: '',
      selectors: [{ id: crypto.randomUUID(), key: 'queue', operator: 'In', value: 'worker_tasks' }],
    },
  ]);

  const addMetric = () =>
    setMetrics([
      ...metrics,
      {
        id: crypto.randomUUID(),
        source: 'Resource',
        resourceName: 'CPU',
        type: 'AverageUtilization',
        quantity: 80,
        metricName: '',
        referentApiVersion: '',
        referentKind: '',
        referentName: '',
        selectors: [],
      },
    ]);

  const removeMetric = (id: string) => setMetrics(metrics.filter((m) => m.id !== id));

  const updateMetric = (id: string, field: string, val: string | number) =>
    setMetrics(metrics.map((m) => (m.id === id ? { ...m, [field]: val } : m)));

  const addSelector = (metricId: string) =>
    setMetrics(
      metrics.map((m) =>
        m.id === metricId
          ? {
              ...m,
              selectors: [
                ...m.selectors,
                { id: crypto.randomUUID(), key: '', operator: 'In', value: '' },
              ],
            }
          : m
      )
    );

  const removeSelector = (metricId: string, selId: string) =>
    setMetrics(
      metrics.map((m) =>
        m.id === metricId ? { ...m, selectors: m.selectors.filter((s) => s.id !== selId) } : m
      )
    );

  const updateSelector = (metricId: string, selId: string, field: string, val: string) =>
    setMetrics(
      metrics.map((m) =>
        m.id === metricId
          ? {
              ...m,
              selectors: m.selectors.map((s) => (s.id === selId ? { ...s, [field]: val } : s)),
            }
          : m
      )
    );

  return {
    metrics,
    addMetric,
    removeMetric,
    updateMetric,
    addSelector,
    removeSelector,
    updateSelector,
  };
}

function getMetricSummary(metric: HPAMetric): string {
  if (metric.source === 'Resource') {
    return `${metric.resourceName} ${metric.type === 'AverageUtilization' ? `${metric.quantity}%` : metric.quantity}`;
  }
  return metric.metricName || 'Unnamed';
}

function HPAMetricsFinal() {
  const {
    metrics,
    addMetric,
    removeMetric,
    updateMetric,
    addSelector,
    removeSelector,
    updateSelector,
  } = useHPAMetrics();

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="HPA Metrics — Disclosure" />
      <SectionCard.Content className="pt-3">
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">Metrics</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define scaling metrics for Horizontal Pod Autoscaler. Each metric has a source, type,
              and quantity with optional selectors.
            </p>
          </VStack>

          <VStack gap={2}>
            {metrics.map((metric, mi) => (
              <div
                key={metric.id}
                className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] w-full overflow-hidden"
              >
                <Disclosure defaultOpen={mi === 0}>
                  <div className="px-4 py-3 bg-[var(--color-surface-subtle)]">
                    <HStack gap={2} align="center" className="w-full">
                      <Disclosure.Trigger className="flex-1">
                        <HStack gap={2} align="center">
                          <span>Metric {mi + 1}</span>
                          <Badge variant="info" size="sm">
                            {metric.source}
                          </Badge>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {getMetricSummary(metric)}
                            {metric.selectors.length > 0 &&
                              ` · ${metric.selectors.length} selector${metric.selectors.length !== 1 ? 's' : ''}`}
                          </span>
                        </HStack>
                      </Disclosure.Trigger>
                      {metrics.length > 1 && (
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </HStack>
                  </div>
                  <Disclosure.Panel className="px-4 py-4">
                    <VStack gap={6}>
                      {(metric.source === 'External' ||
                        metric.source === 'Pods' ||
                        metric.source === 'Object') && (
                        <InlineMessage variant="warning">
                          In order to use external metrics with HPA, you need to deploy the external
                          metrics server such as prometheus adapter.
                        </InlineMessage>
                      )}

                      <HStack gap={2} className="w-full">
                        <VStack gap={2} className="flex-1">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Source
                          </span>
                          <Select
                            options={METRIC_SOURCE_OPTIONS}
                            value={metric.source}
                            onChange={(val) => updateMetric(metric.id, 'source', val)}
                            fullWidth
                          />
                        </VStack>
                        {metric.source === 'Resource' && (
                          <VStack gap={2} className="flex-1">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Resource Name
                            </span>
                            <Select
                              options={RESOURCE_NAME_OPTIONS}
                              value={metric.resourceName}
                              onChange={(val) => updateMetric(metric.id, 'resourceName', val)}
                              fullWidth
                            />
                          </VStack>
                        )}
                      </HStack>

                      <HStack gap={2} className="w-full">
                        <VStack gap={2} className="flex-1">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Type
                          </span>
                          <Select
                            options={TYPE_OPTIONS}
                            value={metric.type}
                            onChange={(val) => updateMetric(metric.id, 'type', val)}
                            fullWidth
                          />
                        </VStack>
                        <VStack gap={2} className="shrink-0">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Quantity <span className="text-[var(--color-state-danger)]">*</span>
                          </span>
                          <NumberInput
                            value={metric.quantity}
                            onChange={(val) => updateMetric(metric.id, 'quantity', val ?? 0)}
                            min={0}
                            step={1}
                            width="xs"
                            suffix={metric.type === 'AverageUtilization' ? '%' : undefined}
                          />
                        </VStack>
                      </HStack>

                      {metric.source === 'Object' && (
                        <HStack gap={2} className="w-full">
                          <VStack gap={2} className="flex-1">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              API Version{' '}
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <Input
                              placeholder="e.g. apps/v1"
                              value={metric.referentApiVersion}
                              onChange={(e) =>
                                updateMetric(metric.id, 'referentApiVersion', e.target.value)
                              }
                              fullWidth
                            />
                          </VStack>
                          <VStack gap={2} className="flex-1">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Kind <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <Input
                              placeholder="e.g. Deployment"
                              value={metric.referentKind}
                              onChange={(e) =>
                                updateMetric(metric.id, 'referentKind', e.target.value)
                              }
                              fullWidth
                            />
                          </VStack>
                          <VStack gap={2} className="flex-1">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Name <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <Input
                              placeholder="e.g. my-deployment"
                              value={metric.referentName}
                              onChange={(e) =>
                                updateMetric(metric.id, 'referentName', e.target.value)
                              }
                              fullWidth
                            />
                          </VStack>
                        </HStack>
                      )}

                      {metric.source !== 'Resource' && (
                        <>
                          <VStack gap={2} className="w-full">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Metric Name{' '}
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </span>
                            <Input
                              placeholder="e.g. packets-per-second"
                              value={metric.metricName}
                              onChange={(e) =>
                                updateMetric(metric.id, 'metricName', e.target.value)
                              }
                              fullWidth
                            />
                          </VStack>
                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <VStack gap={1.5}>
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Metric Selectors
                              </span>
                              {metric.selectors.length > 0 && (
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
                              {metric.selectors.map((sel) => (
                                <div
                                  key={sel.id}
                                  className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                                >
                                  <Input
                                    placeholder="key"
                                    value={sel.key}
                                    onChange={(e) =>
                                      updateSelector(metric.id, sel.id, 'key', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <Select
                                    options={OPERATOR_OPTIONS}
                                    value={sel.operator}
                                    onChange={(val) =>
                                      updateSelector(metric.id, sel.id, 'operator', val)
                                    }
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="value"
                                    value={sel.value}
                                    onChange={(e) =>
                                      updateSelector(metric.id, sel.id, 'value', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeSelector(metric.id, sel.id)}
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
                                  onClick={() => addSelector(metric.id)}
                                >
                                  Add selector
                                </Button>
                              </div>
                            </VStack>
                          </div>
                        </>
                      )}
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
                onClick={addMetric}
              >
                Add Metric
              </Button>
            </div>
          </VStack>
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
            Nested Box Pattern — Final
          </h1>
          <p className="text-body-lg text-[var(--color-text-muted)]">
            SectionCard 내부 중첩 박스 패턴의 최종 결정안입니다.
          </p>
        </VStack>

        {/* ── Section 1: Labels & Annotations ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            1. Labels & Annotations — Pattern A
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Dynamic form fields 스타일 — bg-subtle 래퍼로 KV 그리드를 감싸는 방식
          </p>
        </VStack>

        <PatternA />

        {/* ── Section 2: Node Scheduling ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            2. Node Scheduling — Variant C + A Internal
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Disclosure(아코디언)로 Term을 접고 펼침 · 내부 레이아웃은 Variant A 구조 (세로 배치 +
            설명 텍스트 + bg-subtle Expressions 래퍼)
          </p>
        </VStack>

        <NodeSchedulingFinal />

        {/* ── Section 3: Pod Affinity ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            3. Pod Affinity / Anti-Affinity — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Pod 간 스케줄링 규칙. Type(Affinity/Anti-Affinity) + Priority + TopologyKey + Weight +
            Match Expressions를 Disclosure로 묶음. 현재 bordered card 패턴에서 Disclosure 패턴으로
            전환.
          </p>
        </VStack>

        <PodAffinityFinal />

        {/* ── Section 4: Ingress Rules ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            4. Ingress Rules — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Ingress 라우팅 규칙. Host + 중첩된 Paths 배열을 Disclosure로 묶음. 접힌 상태에서
            호스트명과 경로 수를 요약 표시.
          </p>
        </VStack>

        <IngressRulesFinal />

        {/* ── Section 5: Network Policy Rules ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            5. Network Policy Rules — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            현재 가장 깊은 중첩 구조 (4단계). left-tab + right-panel 레이아웃에서 Disclosure
            패턴으로 전환. 각 Rule 안에 Targets(bg-subtle → bordered cards → selector grid)와
            Allowed Ports를 포함.
          </p>
        </VStack>

        <NetworkPolicyFinal />

        {/* ── Section 6: Volume Claim Templates ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            6. Volume Claim Templates — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            StatefulSet/Deployment의 PVC 템플릿. 현재 bordered card 패턴. Name +
            RadioGroup(New/Existing PV) + StorageClass/Capacity + AccessModes를 Disclosure로 묶음.
            접힌 상태에서 PVC명, 스토리지 클래스, 용량, 접근 모드를 요약 표시.
          </p>
        </VStack>

        <VolumeClaimFinal />

        {/* ── Section 7: Ingress Certificates ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            7. Ingress Certificates — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            TLS 인증서. 현재 bg-subtle card 패턴. Secret Name + Hosts 배열을 Disclosure로 묶음.
            비교적 단순한 구조라 Disclosure 적용 효과가 적을 수 있음.
          </p>
        </VStack>

        <CertificatesFinal />

        {/* ── Section 8: HPA Metrics ── */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        <VStack gap={3}>
          <h2 className="text-heading-h4 text-[var(--color-text-default)]">
            8. HPA Metrics — Disclosure
          </h2>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Horizontal Pod Autoscaler 메트릭. Source에 따라 조건부 필드가 달라지는 복잡한 구조.
            Resource(CPU/Memory) · Pods · Object(Referent 정보) · External(Metric Name + Selectors).
            접힌 상태에서 Source 뱃지와 메트릭 요약을 표시.
          </p>
        </VStack>

        <HPAMetricsFinal />
      </VStack>
    </div>
  );
}
