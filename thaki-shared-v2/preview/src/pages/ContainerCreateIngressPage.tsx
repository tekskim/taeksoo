import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Disclosure } from '@shared/components/Disclosure';
import { InlineMessage } from '@shared/components/InlineMessage';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

type WizardSectionState = 'pre' | 'active' | 'done' | 'writing';

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

type IngressSectionStep =
  | 'basic-info'
  | 'rules'
  | 'default-backend'
  | 'certificates'
  | 'ingress-class'
  | 'labels-annotations';

// Section labels for display
const INGRESS_SECTION_LABELS: Record<IngressSectionStep, string> = {
  'basic-info': 'Basic information',
  rules: 'Rules',
  'default-backend': 'Default backend',
  certificates: 'Certificates',
  'ingress-class': 'Ingress class',
  'labels-annotations': 'Labels & annotations',
};

// Section order for navigation
const INGRESS_SECTION_ORDER: IngressSectionStep[] = [
  'basic-info',
  'rules',
  'default-backend',
  'certificates',
  'ingress-class',
  'labels-annotations',
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

// Path Type options
const PATH_TYPE_OPTIONS = [
  { value: 'Prefix', label: 'Prefix' },
  { value: 'Exact', label: 'Exact' },
  { value: 'ImplementationSpecific', label: 'ImplementationSpecific' },
];

// Target service options
const TARGET_SERVICE_OPTIONS = [
  { value: '', label: '' },
  { value: 'nginx-service', label: 'nginx-service' },
  { value: 'frontend-service', label: 'frontend-service' },
  { value: 'backend-service', label: 'backend-service' },
  { value: 'api-service', label: 'api-service' },
];

// Ingress class options
const INGRESS_CLASS_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'nginx', label: 'nginx' },
  { value: 'traefik', label: 'traefik' },
  { value: 'haproxy', label: 'haproxy' },
];

// Certificate options
const CERTIFICATE_OPTIONS = [
  { value: '', label: 'Select a certificate' },
  { value: 'tls-secret-1', label: 'tls-secret-1' },
  { value: 'tls-secret-2', label: 'tls-secret-2' },
  { value: 'wildcard-cert', label: 'wildcard-cert' },
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

interface Certificate {
  id: string;
  secretName: string;
  hosts: string[];
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */
export function ContainerCreateIngressPage() {
  const navigate = useNavigate();

  // Basic Information state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Rules state
  const [rules, setRules] = useState<IngressRule[]>([
    {
      id: 'initial-rule',
      host: '',
      paths: [
        {
          id: 'initial-path',
          pathType: 'Prefix',
          path: '',
          targetService: '',
          port: '',
        },
      ],
    },
  ]);

  // Default Backend state
  const [defaultBackendService, setDefaultBackendService] = useState('');
  const [defaultBackendPort, setDefaultBackendPort] = useState('');

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 'initial-cert', secretName: '', hosts: [''] },
  ]);

  // Ingress class state
  const [ingressClass, setIngressClass] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([{ id: 'initial-label', key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: 'initial-annotation', key: '', value: '' },
  ]);

  // Section states for summary
  const getSectionStates = (): Record<IngressSectionStep, WizardSectionState> => {
    return {
      'basic-info': namespace && name ? 'done' : 'active',
      rules: rules.length > 0 ? 'done' : 'pre',
      'default-backend': defaultBackendService ? 'done' : 'pre',
      certificates: certificates.length > 0 ? 'done' : 'pre',
      'ingress-class': ingressClass ? 'done' : 'pre',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pre',
    };
  };

  // Rule handlers
  const addRule = useCallback(() => {
    setRules((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        host: '',
        paths: [
          {
            id: Date.now().toString() + '-path',
            pathType: 'Prefix',
            path: '',
            targetService: '',
            port: '',
          },
        ],
      },
    ]);
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback((id: string, field: keyof IngressRule, value: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const addPath = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              paths: [
                ...r.paths,
                {
                  id: Date.now().toString(),
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
  }, []);

  const removePath = useCallback((ruleId: string, pathId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              paths: r.paths.filter((p) => p.id !== pathId),
            }
          : r
      )
    );
  }, []);

  const updatePath = useCallback(
    (ruleId: string, pathId: string, field: keyof IngressPath, value: string) => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === ruleId
            ? {
                ...r,
                paths: r.paths.map((p) => (p.id === pathId ? { ...p, [field]: value } : p)),
              }
            : r
        )
      );
    },
    []
  );

  // Certificate handlers
  const addCertificate = useCallback(() => {
    setCertificates((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        secretName: '',
        hosts: [],
      },
    ]);
  }, []);

  const removeCertificate = useCallback((id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCertificate = useCallback(
    (id: string, field: keyof Certificate, value: string | string[]) => {
      setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    },
    []
  );

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

  const sectionStates = getSectionStates();

  const handleCancel = useCallback(() => {
    navigate('/container/ingresses');
  }, [navigate]);

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create ingress</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Ingresses route incoming traffic from the internet to Services within the cluster based
            on the hostname and path specified in the request. You can expose multiple Services on
            the same external IP address and port.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: INGRESS_SECTION_ORDER.map((key) => ({
                label: INGRESS_SECTION_LABELS[key],
                status: mapStatus(sectionStates[key]),
              })),
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Create"
          actionEnabled={false}
          onCancel={handleCancel}
          onAction={() => {}}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <SectionCard className="pb-4">
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Namespace */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Namespace <span className="text-[var(--color-state-danger)]">*</span>
                  </label>
                  <Dropdown.Select
                    className="w-full"
                    value={namespace}
                    onChange={(v) => setNamespace(String(v))}
                    placeholder=""
                  >
                    {NAMESPACE_OPTIONS.map((opt) => (
                      <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                    ))}
                  </Dropdown.Select>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Name <span className="text-[var(--color-state-danger)]">*</span>
                  </label>
                  <Input
                    placeholder="Enter a unique name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

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
            </SectionCard.Content>
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionCard.Header title="Rules" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-2">
                {/* Rule rows */}
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                  >
                    <div className="flex flex-col gap-6">
                      {/* Request host with close button */}
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row w-full items-center justify-between">
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Request host
                          </label>
                          <button
                            onClick={() => removeRule(rule.id)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </div>
                        <Input
                          placeholder="e.g. example.com"
                          value={rule.host}
                          onChange={(e) => updateRule(rule.id, 'host', e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Paths container — List style */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Paths
                        </span>
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {rule.paths.length > 0 && (
                              <div className="grid grid-cols-[2fr_1fr_1fr_20px] gap-1 w-full">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Path
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Target service
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Port
                                </span>
                                <div className="w-5" />
                              </div>
                            )}
                            {rule.paths.map((path) => (
                              <div
                                key={path.id}
                                className="grid grid-cols-[2fr_1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <div className="flex flex-row gap-1">
                                  <Dropdown.Select
                                    className="w-full"
                                    value={path.pathType}
                                    onChange={(value) =>
                                      updatePath(rule.id, path.id, 'pathType', String(value))
                                    }
                                    placeholder=""
                                  >
                                    {PATH_TYPE_OPTIONS.map((opt) => (
                                      <Dropdown.Option
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                      />
                                    ))}
                                  </Dropdown.Select>
                                  <Input
                                    placeholder="e.g. /foo"
                                    value={path.path}
                                    onChange={(e) =>
                                      updatePath(rule.id, path.id, 'path', e.target.value)
                                    }
                                    className="w-full"
                                  />
                                </div>

                                <Dropdown.Select
                                  className="w-full"
                                  value={path.targetService}
                                  onChange={(value) =>
                                    updatePath(rule.id, path.id, 'targetService', String(value))
                                  }
                                  placeholder=""
                                >
                                  {TARGET_SERVICE_OPTIONS.map((opt) => (
                                    <Dropdown.Option
                                      key={opt.value || 'e'}
                                      value={opt.value}
                                      label={opt.label || '—'}
                                    />
                                  ))}
                                </Dropdown.Select>

                                <Input
                                  placeholder="e.g. 80 or http"
                                  value={path.port}
                                  onChange={(e) =>
                                    updatePath(rule.id, path.id, 'port', e.target.value)
                                  }
                                  className="w-full"
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
                                Add path
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Rule button */}
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
              </div>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionCard.Header title="Default backend" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Warning message */}
                <InlineMessage variant="error">
                  Warning: Default backend is used globally for the entire cluster.
                </InlineMessage>

                {/* Target service and Port */}
                <div className="flex flex-row gap-4 w-full">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Target service
                    </label>
                    <Dropdown.Select
                      className="w-full"
                      value={defaultBackendService}
                      onChange={(v) => setDefaultBackendService(String(v))}
                      placeholder=""
                    >
                      {[{ value: '', label: 'None' }, ...TARGET_SERVICE_OPTIONS.slice(1)].map(
                        (opt) => (
                          <Dropdown.Option
                            key={String(opt.value) + opt.label}
                            value={opt.value}
                            label={opt.label}
                          />
                        )
                      )}
                    </Dropdown.Select>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">Port</label>
                    <Input
                      placeholder="e.g. 80 or http"
                      value={defaultBackendPort}
                      onChange={(e) => setDefaultBackendPort(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionCard.Header title="Certificates" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-2">
                <span className="text-label-lg text-[var(--color-text-default)]">Certificates</span>
                <div className="flex flex-col gap-1.5 w-full">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-row w-full items-center justify-between">
                            <span className="text-label-sm text-[var(--color-text-default)]">
                              Secret name
                            </span>
                            <button
                              onClick={() => removeCertificate(cert.id)}
                              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            >
                              <IconX
                                size={16}
                                className="text-[var(--color-text-muted)]"
                                stroke={1.5}
                              />
                            </button>
                          </div>
                          <Dropdown.Select
                            className="w-full"
                            value={cert.secretName}
                            onChange={(value) =>
                              updateCertificate(cert.id, 'secretName', String(value))
                            }
                            placeholder=""
                          >
                            {CERTIFICATE_OPTIONS.map((opt) => (
                              <Dropdown.Option
                                key={String(opt.value)}
                                value={opt.value}
                                label={opt.label}
                              />
                            ))}
                          </Dropdown.Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="grid grid-cols-[1fr_20px] gap-1 w-full">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Host
                            </span>
                            <div className="w-5" />
                          </div>
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
                                  updateCertificate(cert.id, 'hosts', newHosts);
                                }}
                                className="w-full"
                              />
                              <button
                                onClick={() => {
                                  const newHosts = cert.hosts.filter((_, idx) => idx !== hi);
                                  updateCertificate(cert.id, 'hosts', newHosts);
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
                              onClick={() =>
                                updateCertificate(cert.id, 'hosts', [...cert.hosts, ''])
                              }
                            >
                              Add host
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                      onClick={addCertificate}
                    >
                      Add certificate
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionCard.Header title="Ingress class" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-2">
                <label className="text-label-lg text-[var(--color-text-default)]">
                  Ingress class
                </label>
                <Dropdown.Select
                  className="w-full"
                  value={ingressClass}
                  onChange={(v) => setIngressClass(String(v))}
                  placeholder=""
                >
                  {INGRESS_CLASS_OPTIONS.map((opt) => (
                    <Dropdown.Option key={String(opt.value)} value={opt.value} label={opt.label} />
                  ))}
                </Dropdown.Select>
              </div>
            </SectionCard.Content>
          </SectionCard>

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
                            placeholder="Input key"
                            value={label.key}
                            onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                            className="w-full"
                          />
                          <Input
                            placeholder="Input value"
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
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={addLabel}
                        >
                          Add label
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
                            placeholder="Input key"
                            value={annotation.key}
                            onChange={(e) => updateAnnotation(annotation.id, 'key', e.target.value)}
                            className="w-full"
                          />
                          <Input
                            placeholder="Input value"
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
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={addAnnotation}
                        >
                          Add annotation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>
        </div>
      </div>
    </CreateLayout>
  );
}
