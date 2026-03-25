import { useState, useCallback, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { Disclosure } from '@shared/components/Disclosure';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconCirclePlus,
  IconX,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

const TAINT_EFFECT_OPTIONS = [
  { value: 'NoSchedule', label: 'NoSchedule' },
  { value: 'PreferNoSchedule', label: 'PreferNoSchedule' },
  { value: 'NoExecute', label: 'NoExecute' },
];

interface Taint {
  key: string;
  value: string;
  effect: string;
}

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

/* ----------------------------------------
   Summary Status Icon Component
   ---------------------------------------- */

type SummaryStatus = 'done' | 'active' | 'pending';

function SummaryStatusIcon({ status }: { status: SummaryStatus }) {
  if (status === 'done') {
    return (
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)]">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div
        className="size-4 shrink-0 animate-spin rounded-full border border-[var(--color-text-muted)]"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  return (
    <div
      className="size-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  nodeName: string;
  description: string;
  taints: Taint[];
  labels: Label[];
  annotations: Annotation[];
  onCancel: () => void;
  onSave: () => void;
}

function SummarySidebar({
  nodeName,
  description,
  taints,
  labels,
  annotations,
  onCancel,
  onSave,
}: SummarySidebarProps) {
  const basicInfoStatus: SummaryStatus = nodeName ? 'done' : 'active';
  const taintsStatus: SummaryStatus = taints.some((t) => t.key.trim()) ? 'done' : 'active';
  const labelsAnnotationsStatus: SummaryStatus =
    labels.some((l) => l.key.trim()) || annotations.some((a) => a.key.trim()) ? 'done' : 'active';

  const sections = [
    { label: 'Basic Information', status: basicInfoStatus },
    { label: 'Taints', status: taintsStatus },
    { label: 'Labels & Annotations', status: labelsAnnotationsStatus },
  ];

  return (
    <div className="sticky top-4 w-[var(--wizard-summary-width)] shrink-0 self-start">
      <div className="flex flex-col gap-6 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4">
          <div className="flex flex-col gap-4">
            <span className="text-heading-h5 text-[var(--color-text-default)]">Summary</span>
            <div className="flex flex-col gap-0">
              {sections.map((section) => (
                <div key={section.label} className="flex items-center justify-between py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {section.label}
                  </span>
                  <SummaryStatusIcon status={section.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" appearance="outline" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave} className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] pb-4">
      <div className="px-4 pt-4">
        <h3 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h3>
      </div>
      <div className="mx-4 my-4 h-px bg-[var(--color-border-subtle)]" />
      <div className="flex flex-col gap-6 px-4">{children}</div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function ContainerEditNodeConfigPage() {
  const navigate = useNavigate();
  const { id: nodeIdParam } = useParams<{ id: string }>();
  const nodeName = nodeIdParam || 'node-control-plane-01';

  const [description, setDescription] = useState('');
  const [taints, setTaints] = useState<Taint[]>([{ key: '', value: '', effect: 'NoSchedule' }]);
  const [labels, setLabels] = useState<Label[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<Annotation[]>([{ key: '', value: '' }]);

  const handleCancel = useCallback(() => {
    navigate('/container/nodes');
  }, [navigate]);

  const handleSave = useCallback(() => {
    console.log('Saving node config:', {
      nodeName,
      description,
      taints: taints.filter((t) => t.key.trim() !== ''),
      labels: labels.filter((l) => l.key.trim() !== ''),
      annotations: annotations.filter((a) => a.key.trim() !== ''),
    });
    navigate('/container/nodes');
  }, [nodeName, description, taints, labels, annotations, navigate]);

  const addTaint = useCallback(() => {
    setTaints((prev) => [...prev, { key: '', value: '', effect: 'NoSchedule' }]);
  }, []);

  const removeTaint = useCallback((index: number) => {
    setTaints((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateTaint = useCallback(
    (index: number, field: 'key' | 'value' | 'effect', value: string) => {
      setTaints((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    []
  );

  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((index: number) => {
    setLabels((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateLabel = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setLabels((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((index: number) => {
    setAnnotations((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateAnnotation = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex min-h-8 items-center justify-between">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">Node: {nodeName}</h1>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            aria-label="Terminal"
          >
            <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            aria-label="File"
          >
            <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            aria-label="Copy"
          >
            <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            aria-label="Search"
          >
            <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            aria-label="Notifications"
          >
            <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
        </div>
      </div>

      <div className="flex w-full items-start gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <SectionShell title="Basic information">
            <FormField label="Node Name" required>
              <Input value={nodeName} disabled className="w-full bg-[var(--color-surface-muted)]" />
            </FormField>

            <Disclosure label="Description" expanded={false}>
              <div className="pt-2">
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
            </Disclosure>
          </SectionShell>

          <SectionShell title="Taints">
            <div className="rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {taints.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_1fr_1fr_20px] gap-1">
                    <span className="block text-label-lg text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-lg text-[var(--color-text-default)]">
                      Value
                    </span>
                    <span className="block text-label-lg text-[var(--color-text-default)]">
                      Effect
                    </span>
                    <div className="w-5" />
                  </div>
                )}
                {taints.map((taint, index) => (
                  <div
                    key={index}
                    className="grid w-full grid-cols-[1fr_1fr_1fr_20px] items-center gap-1"
                  >
                    <Input
                      placeholder="input key"
                      value={taint.key}
                      onChange={(e) => updateTaint(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="input value"
                      value={taint.value}
                      onChange={(e) => updateTaint(index, 'value', e.target.value)}
                      className="w-full"
                    />
                    <Dropdown.Select
                      value={taint.effect}
                      onChange={(v) => updateTaint(index, 'effect', String(v))}
                      className="w-full"
                    >
                      {TAINT_EFFECT_OPTIONS.map((o) => (
                        <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                      ))}
                    </Dropdown.Select>
                    <button
                      type="button"
                      onClick={() => removeTaint(index)}
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                      aria-label="Remove taint"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button variant="secondary" appearance="outline" size="sm" onClick={addTaint}>
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} stroke={1.5} />
                      Add Taint
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell title="Labels & Annotations">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                    Specify the labels used to identify and categorize the node.
                  </p>
                </div>

                <div className="rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
                  <div className="flex flex-col gap-3">
                    {labels.length > 0 && (
                      <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Value
                        </span>
                        <div className="w-5" />
                      </div>
                    )}
                    {labels.map((label, index) => (
                      <div
                        key={index}
                        className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1"
                      >
                        <Input
                          placeholder="label key"
                          value={label.key}
                          onChange={(e) => updateLabel(index, 'key', e.target.value)}
                          className="w-full"
                        />
                        <Input
                          placeholder="label value"
                          value={label.value}
                          onChange={(e) => updateLabel(index, 'value', e.target.value)}
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeLabel(index)}
                          className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                          aria-label="Remove label"
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
                      <Button variant="secondary" appearance="outline" size="sm" onClick={addLabel}>
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} stroke={1.5} />
                          Add Label
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Annotations
                  </span>
                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                    Add annotations to store non-identifying metadata.
                  </p>
                </div>

                <div className="rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
                  <div className="flex flex-col gap-3">
                    {annotations.length > 0 && (
                      <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Value
                        </span>
                        <div className="w-5" />
                      </div>
                    )}
                    {annotations.map((annotation, index) => (
                      <div
                        key={index}
                        className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1"
                      >
                        <Input
                          placeholder="annotation key"
                          value={annotation.key}
                          onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                          className="w-full"
                        />
                        <Input
                          placeholder="annotation value"
                          value={annotation.value}
                          onChange={(e) => updateAnnotation(index, 'value', e.target.value)}
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeAnnotation(index)}
                          className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                          aria-label="Remove annotation"
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
                        appearance="outline"
                        size="sm"
                        onClick={addAnnotation}
                      >
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} stroke={1.5} />
                          Add Annotation
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>
        </div>

        <SummarySidebar
          nodeName={nodeName}
          description={description}
          taints={taints}
          labels={labels}
          annotations={annotations}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default ContainerEditNodeConfigPage;
