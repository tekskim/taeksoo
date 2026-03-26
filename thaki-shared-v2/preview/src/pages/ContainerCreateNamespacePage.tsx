import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Checkbox } from '@shared/components/Checkbox';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Disclosure } from '@shared/components/Disclosure';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

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

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NamespaceSectionStep = 'basic-info' | 'pod-security' | 'labels-annotations';

// Section labels for display
const NAMESPACE_SECTION_LABELS: Record<NamespaceSectionStep, string> = {
  'basic-info': 'Basic Information',
  'pod-security': 'Pod Security Admission',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const NAMESPACE_SECTION_ORDER: NamespaceSectionStep[] = [
  'basic-info',
  'pod-security',
  'labels-annotations',
];

// Pod Security profile options
const PSA_PROFILE_OPTIONS = [
  { value: 'privileged', label: 'privileged' },
  { value: 'baseline', label: 'baseline' },
  { value: 'restricted', label: 'restricted' },
];

interface Label {
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
  value: string;
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */
export function ContainerCreateNamespacePage() {
  const navigate = useNavigate();
  const isV2 = true;
  // Sidebar state

  // Basic Information state
  const [namespaceName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  // Pod Security Admission state
  const [enforceEnabled, setEnforceEnabled] = useState(false);
  const [enforceProfile, setEnforceProfile] = useState('privileged');
  const [enforceVersion, setEnforceVersion] = useState('');
  const [auditEnabled, setAuditEnabled] = useState(false);
  const [auditProfile, setAuditProfile] = useState('privileged');
  const [auditVersion, setAuditVersion] = useState('');
  const [warnEnabled, setWarnEnabled] = useState(false);
  const [warnProfile, setWarnProfile] = useState('privileged');
  const [warnVersion, setWarnVersion] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', value: '' }] : []
  );
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', value: '' }] : []
  );

  // Section states for summary
  const getSectionStates = (): Record<NamespaceSectionStep, WizardSectionState> => {
    return {
      'basic-info': namespaceName ? 'done' : 'active',
      'pod-security': enforceEnabled || auditEnabled || warnEnabled ? 'done' : 'pre',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pre',
    };
  };

  // Label handlers
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  const states = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create namespace</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Namespace is a logical partition within a cluster that isolates and organizes resources
            for easier management and access control.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: NAMESPACE_SECTION_ORDER.map((key) => ({
                label: NAMESPACE_SECTION_LABELS[key],
                status: mapStatus(states[key]),
              })),
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Create"
          actionEnabled
          onCancel={() => navigate('/container/namespaces')}
          onAction={() => console.log('Creating...')}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {/* Basic Information Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Basic information" />
          <SectionCard.Content showDividers={false}>
            <div className="flex flex-col gap-6">
              {/* Namespace Name */}
              <FormField label="Namespace Name" required>
                <Input
                  placeholder="Enter a unique name"
                  value={namespaceName}
                  onChange={(e) => setNamespaceName(e.target.value)}
                  fullWidth
                />
              </FormField>

              {/* Description (collapsible) */}
              <Disclosure label="Description" expanded={true}>
                <div className="pt-2">
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                  />
                </div>
              </Disclosure>
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Pod Security Admission Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Pod security admission" />
          <SectionCard.Content showDividers={false}>
            <div className="flex flex-col gap-6">
              {/* Enforce */}
              <div className="flex flex-col gap-2">
                <Checkbox
                  checked={enforceEnabled}
                  onChange={(checked) => setEnforceEnabled(checked)}
                  label="Enforce"
                />
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Block the creation of pods that violate the policy.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown.Select
                    className="w-full"
                    disabled={!enforceEnabled}
                    value={enforceProfile}
                    onChange={(v) => setEnforceProfile(String(v))}
                    placeholder=""
                  >
                    {PSA_PROFILE_OPTIONS.map((opt) => (
                      <Dropdown.Option
                        key={String(opt.value)}
                        value={opt.value}
                        label={opt.label}
                      />
                    ))}
                  </Dropdown.Select>
                  <Input
                    placeholder="Version (default: latest)"
                    value={enforceVersion}
                    onChange={(e) => setEnforceVersion(e.target.value)}
                    disabled={!enforceEnabled}
                    fullWidth
                  />
                </div>
              </div>

              {/* Audit */}
              <div className="flex flex-col gap-2">
                <Checkbox
                  checked={auditEnabled}
                  onChange={(checked) => setAuditEnabled(checked)}
                  label="Audit"
                />
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Allow policy violations and records them in audit logs.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown.Select
                    className="w-full"
                    disabled={!auditEnabled}
                    value={auditProfile}
                    onChange={(v) => setAuditProfile(String(v))}
                    placeholder=""
                  >
                    {PSA_PROFILE_OPTIONS.map((opt) => (
                      <Dropdown.Option
                        key={String(opt.value)}
                        value={opt.value}
                        label={opt.label}
                      />
                    ))}
                  </Dropdown.Select>
                  <Input
                    placeholder="Version (default: latest)"
                    value={auditVersion}
                    onChange={(e) => setAuditVersion(e.target.value)}
                    disabled={!auditEnabled}
                    fullWidth
                  />
                </div>
              </div>

              {/* Warn */}
              <div className="flex flex-col gap-2">
                <Checkbox
                  checked={warnEnabled}
                  onChange={(checked) => setWarnEnabled(checked)}
                  label="Warn"
                />
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Allow the creation of violating pods but displays a warning message.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown.Select
                    className="w-full"
                    disabled={!warnEnabled}
                    value={warnProfile}
                    onChange={(v) => setWarnProfile(String(v))}
                    placeholder=""
                  >
                    {PSA_PROFILE_OPTIONS.map((opt) => (
                      <Dropdown.Option
                        key={String(opt.value)}
                        value={opt.value}
                        label={opt.label}
                      />
                    ))}
                  </Dropdown.Select>
                  <Input
                    placeholder="Version (default: latest)"
                    value={warnVersion}
                    onChange={(e) => setWarnVersion(e.target.value)}
                    disabled={!warnEnabled}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Labels & Annotations Section */}
        <SectionCard className="pb-4">
          <SectionCard.Header title="Labels & annotations" />
          <SectionCard.Content showDividers={false}>
            <div className="flex flex-col gap-6">
              {/* Labels */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-label-lg text-[var(--color-text-default)]">Labels</label>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    Specify the labels used to identify and categorize the resource.
                  </span>
                </div>

                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                  <div className="flex flex-col gap-1.5">
                    {labels.length > 0 && (
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Value
                        </span>
                        <div className="w-5" />
                      </div>
                    )}
                    {labels.map((label) => (
                      <div
                        key={label.id}
                        className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                      >
                        <Input
                          placeholder="label key"
                          value={label.key}
                          onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                          fullWidth
                        />
                        <Input
                          placeholder="label value"
                          value={label.value}
                          onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                          fullWidth
                        />
                        <button
                          onClick={() => removeLabel(label.id)}
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
                      <Button variant="muted" appearance="outline" size="sm" onClick={addLabel}>
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} />
                          Add Label
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annotations */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Annotations
                  </label>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    Specify the annotations used to provide additional metadata for the resource.
                  </span>
                </div>

                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                  <div className="flex flex-col gap-1.5">
                    {annotations.length > 0 && (
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Value
                        </span>
                        <div className="w-5" />
                      </div>
                    )}
                    {annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                      >
                        <Input
                          placeholder="annotation key"
                          value={annotation.key}
                          onChange={(e) => updateAnnotation(annotation.id, 'key', e.target.value)}
                          fullWidth
                        />
                        <Input
                          placeholder="annotation value"
                          value={annotation.value}
                          onChange={(e) => updateAnnotation(annotation.id, 'value', e.target.value)}
                          fullWidth
                        />
                        <button
                          onClick={() => removeAnnotation(annotation.id)}
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
                        variant="muted"
                        appearance="outline"
                        size="sm"
                        onClick={addAnnotation}
                      >
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} />
                          Add annotation
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
