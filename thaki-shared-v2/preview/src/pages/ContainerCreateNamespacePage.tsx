import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';
import { Title } from '@shared/components/Title';
import { Disclosure } from '@shared/components/Disclosure';
import { InlineMessage } from '@shared/components/InlineMessage';
import { Range } from '@shared/components/Range';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import { RadioGroup, Radio, StandaloneRadioScope } from '../components/TdsRadioCompat';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconCirclePlus,
  IconX,
  IconPlus,
  IconChevronRight,
  IconHelpCircle,
  IconInfoCircle,
  IconCheck,
  IconDots,
} from '@tabler/icons-react';
type WizardSectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

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
   Summary Status Icon Component
   ---------------------------------------- */
function SummaryStatusIcon({ status }: { status: WizardSectionState }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  // active → dashed circle with spinning animation
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  // pre/default → empty dashed circle
  return (
    <div
      className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */
function SummarySidebar({
  sectionStates,
}: {
  sectionStates: Record<NamespaceSectionStep, WizardSectionState>;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <span className="text-heading-h5">Summary</span>
            <div className="flex flex-col gap-0">
              {NAMESPACE_SECTION_ORDER.map((step) => (
                <div key={step} className="flex flex-row justify-between items-center py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {NAMESPACE_SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={sectionStates[step]} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button row */}
        <div className="flex flex-row gap-2">
          <Button variant="secondary" size="md" onClick={() => navigate('/container/namespaces')}>
            Cancel
          </Button>
          <Button variant="primary" size="md" className="flex-1">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
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

  return (
    <div className="flex flex-col gap-6 pt-4 px-8 pb-20">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <Title title="Create namespace" size="large" />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Namespace is a logical partition within a cluster that isolates and organizes resources
            for easier management and access control.
          </p>
        </div>

        {/* Main Content with Summary Sidebar */}
        <div className="flex flex-row gap-6 w-full items-start">
          {/* Form Sections */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Basic Information Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                  Basic information
                </h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  {/* Namespace Name */}
                  <FormField label="Namespace Name" required>
                    <Input
                      placeholder="Enter a unique name"
                      value={namespaceName}
                      onChange={(e) => setNamespaceName(e.target.value)}
                      className="w-full"
                    />
                  </FormField>

                  {/* Description (collapsible) */}
                  <Disclosure label="Description" expanded={true}>
                    <div className="pt-2">
                      <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </Disclosure>
                </div>
              </div>
            </div>

            {/* Pod Security Admission Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                  Pod security admission
                </h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
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
                        onChange={setEnforceProfile}
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
                        className="w-full"
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
                        onChange={setAuditProfile}
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
                        className="w-full"
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
                        onChange={setWarnProfile}
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
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Labels & Annotations Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                  Labels & annotations
                </h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  {/* Labels */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Labels
                      </label>
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
                              className="w-full"
                            />
                            <Input
                              placeholder="label value"
                              value={label.value}
                              onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                              className="w-full"
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
                          <Button variant="secondary" size="sm" onClick={addLabel}>
                            Add Label
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
                        Specify the annotations used to provide additional metadata for the
                        resource.
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
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'key', e.target.value)
                              }
                              className="w-full"
                            />
                            <Input
                              placeholder="annotation value"
                              value={annotation.value}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'value', e.target.value)
                              }
                              className="w-full"
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
                          <Button variant="secondary" size="sm" onClick={addAnnotation}>
                            Add annotation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <SummarySidebar sectionStates={getSectionStates()} />
        </div>
      </div>
    </div>
  );
}
