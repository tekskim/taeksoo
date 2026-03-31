import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { Disclosure } from '@shared/components/Disclosure';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type WizardSectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

const mapStatus = (state: WizardSectionState): FloatingCardStatus => {
  switch (state) {
    case 'done':
      return 'success';
    case 'active':
      return 'processing';
    case 'writing':
      return 'writing';
    default:
      return 'default';
  }
};

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

  const basicInfoState: WizardSectionState = nodeName ? 'done' : 'active';
  const taintsState: WizardSectionState = taints.some((t) => t.key.trim()) ? 'done' : 'active';
  const labelsAnnotationsState: WizardSectionState =
    labels.some((l) => l.key.trim()) || annotations.some((a) => a.key.trim()) ? 'done' : 'active';

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Node: {nodeName}</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Edit node configuration including taints, labels, and annotations.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic Information', status: mapStatus(basicInfoState) },
                { label: 'Taints', status: mapStatus(taintsState) },
                { label: 'Labels & Annotations', status: mapStatus(labelsAnnotationsState) },
              ],
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Save"
          actionEnabled
          onCancel={() => navigate('/container/nodes')}
          onAction={handleSave}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {/* Basic Information Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Basic information" />
          <SectionCard.Content showDividers={false}>
            <div className="flex flex-col gap-6">
              <FormField label="Node Name" required>
                <Input
                  value={nodeName}
                  disabled
                  className="w-full bg-[var(--color-surface-muted)]"
                />
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
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Taints Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Taints" />
          <SectionCard.Content showDividers={false}>
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
                  <Button variant="muted" appearance="outline" size="sm" onClick={addTaint}>
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} stroke={1.5} />
                      Add Taint
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Labels & Annotations Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Labels & Annotations" />
          <SectionCard.Content showDividers={false}>
            <div className="flex flex-col gap-6">
              {/* Labels */}
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
                      <Button variant="muted" appearance="outline" size="sm" onClick={addLabel}>
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} stroke={1.5} />
                          Add Label
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annotations */}
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
                        variant="muted"
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
          </SectionCard.Content>
        </SectionCard>
      </div>
    </CreateLayout>
  );
}

export default ContainerEditNodeConfigPage;
