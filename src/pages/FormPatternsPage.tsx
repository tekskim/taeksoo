import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, HStack, PageHeader, Button, Input, Select, Badge } from '@/design-system';
import { IconCirclePlus, IconX, IconArrowLeft, IconFile } from '@tabler/icons-react';

function PatternSection({
  id,
  title,
  description,
  source,
  children,
}: {
  id: string;
  title: string;
  description: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden"
    >
      <div className="px-5 py-4 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
        <VStack gap={1}>
          <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{description}</span>
          <span className="text-body-xs text-[var(--color-text-disabled)] mt-0.5">{source}</span>
        </VStack>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

const OPERATOR_OPTIONS = [
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'NotIn' },
  { value: 'Exists', label: 'Exists' },
  { value: 'DoesNotExist', label: 'DoesNotExist' },
  { value: 'Gt', label: 'Gt' },
  { value: 'Lt', label: 'Lt' },
];

const ENV_TYPE_OPTIONS = [
  { value: 'value', label: 'Key/Value Pair' },
  { value: 'configmap', label: 'ConfigMap' },
  { value: 'secret', label: 'Secret' },
];

export function FormPatternsPage() {
  const navigate = useNavigate();

  const [labels, setLabels] = useState([
    { key: 'app', value: 'nginx' },
    { key: 'env', value: 'production' },
  ]);
  const [expressions, setExpressions] = useState([
    { key: 'kubernetes.io/os', operator: 'In', value: 'linux' },
  ]);
  const [ports, setPorts] = useState([
    {
      id: '1',
      name: 'http',
      listeningPort: '80',
      protocol: 'TCP',
      targetPort: '8080',
      nodePort: '30080',
    },
  ]);
  const [dataEntries, setDataEntries] = useState([
    { key: 'config.yaml', value: 'server:\\n  port: 8080' },
  ]);
  const [envVars, setEnvVars] = useState([
    { name: 'DATABASE_URL', type: 'value', value: 'postgresql://localhost:5432' },
  ]);
  const [envVarGroups, setEnvVarGroups] = useState([
    [{ name: 'API_KEY', type: 'value', value: 'sk-1234567890' }],
  ]);
  const [nameservers, setNameservers] = useState(['8.8.8.8', '8.8.4.4']);
  const [hostAliases, setHostAliases] = useState([{ ip: '127.0.0.1', hostname: 'foo.local' }]);
  const [virtualLANs, setVirtualLANs] = useState([
    { id: 'vlan1', network: 'network', subnet: 'subnet', autoAssign: 'Auto-assign' },
  ]);

  const patterns = [
    { id: 'kv', label: '1. Key-Value pairs' },
    { id: 'kv-file', label: '2. Key-Value + Read from File' },
    { id: 'kov', label: '3. Key-Operator-Value' },
    { id: 'ports', label: '4. Multi-column ports' },
    { id: 'envvars', label: '5. Env variables (Name+Type+Value)' },
    { id: 'single-list', label: '6. Single-value list' },
    { id: 'host-aliases', label: '7. Host aliases (with descriptions)' },
    { id: 'vlan', label: '8. Virtual LAN inline row' },
  ];

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-default)]">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <VStack gap={6}>
          <VStack gap={4}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-body-md text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors w-fit"
            >
              <IconArrowLeft size={14} stroke={1.5} />
              Back to Home
            </button>
            <PageHeader
              title="Form Patterns"
              titleExtra={
                <Badge variant="info" size="sm">
                  {patterns.length}
                </Badge>
              }
            />
            <p className="text-body-md text-[var(--color-text-subtle)]">
              All form field patterns used across Create pages and Drawers.
            </p>
          </VStack>

          <div className="rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4">
            <VStack gap={2}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Table of Contents
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {patterns.map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className="text-body-sm text-[var(--color-action-primary)] hover:underline"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </VStack>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 1 — from CreateDeploymentPage, CreateServicePage, CreateConfigMapPage, +20 */}
            <PatternSection
              id="kv"
              title="1. Key-Value Pair Inputs"
              description="Dynamic key-value rows with add/remove."
              source="CreateDeploymentPage, CreateServicePage, CreateConfigMapPage, CreateSecretPage, CreateIngressPage, +20 more"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {labels.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Key
                      </span>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Value
                      </span>
                      <div />
                    </div>
                  )}
                  {labels.map((label, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="label key"
                        value={label.key}
                        onChange={(e) => {
                          const n = [...labels];
                          n[index].key = e.target.value;
                          setLabels(n);
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="label value"
                        value={label.value}
                        onChange={(e) => {
                          const n = [...labels];
                          n[index].value = e.target.value;
                          setLabels(n);
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setLabels(labels.filter((_, i) => i !== index))}
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
            </PatternSection>

            {/* 2 — from CreateConfigMapPage, CreateSecretPage */}
            <PatternSection
              id="kv-file"
              title="2. Key-Value + Read from File"
              description="Key-value with 'Read from File' button."
              source="CreateConfigMapPage, CreateSecretPage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={3}>
                  {dataEntries.length > 0 && (
                    <VStack gap={2} className="w-full">
                      <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                        <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                          Key
                        </span>
                        <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                          Value
                        </span>
                        <div />
                      </div>
                      {dataEntries.map((entry, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center"
                        >
                          <Input
                            placeholder="Enter key"
                            value={entry.key}
                            onChange={(e) => {
                              const n = [...dataEntries];
                              n[index].key = e.target.value;
                              setDataEntries(n);
                            }}
                            fullWidth
                          />
                          <Input
                            placeholder="Enter value"
                            value={entry.value}
                            onChange={(e) => {
                              const n = [...dataEntries];
                              n[index].value = e.target.value;
                              setDataEntries(n);
                            }}
                            fullWidth
                          />
                          <button
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            onClick={() =>
                              setDataEntries(dataEntries.filter((_, i) => i !== index))
                            }
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </div>
                      ))}
                    </VStack>
                  )}
                  <HStack gap={2}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                      onClick={() => setDataEntries([...dataEntries, { key: '', value: '' }])}
                      className="bg-[var(--color-surface-default)]"
                    >
                      Add Data Entry
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconFile size={12} stroke={1.5} />}
                      className="bg-[var(--color-surface-default)]"
                    >
                      Read from File
                    </Button>
                  </HStack>
                </VStack>
              </div>
            </PatternSection>

            {/* 3 — from CreateDeploymentPage, CreatePodPage, CreateStatefulSetPage */}
            <PatternSection
              id="kov"
              title="3. Key-Operator-Value Rows"
              description="Three-column grid with Select for operator."
              source="CreateDeploymentPage, CreatePodPage, CreateStatefulSetPage, CreateNetworkPolicyPage, CreatePodDisruptionBudgetPage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {expressions.length > 0 && (
                    <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 w-full">
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
                  {expressions.map((expr, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="e.g. kubernetes.io/os"
                        value={expr.key}
                        onChange={(e) => {
                          const n = [...expressions];
                          n[i].key = e.target.value;
                          setExpressions(n);
                        }}
                        fullWidth
                      />
                      <Select
                        options={OPERATOR_OPTIONS}
                        value={expr.operator}
                        onChange={(v) => {
                          const n = [...expressions];
                          n[i].operator = v;
                          setExpressions(n);
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="e.g. linux"
                        value={expr.value}
                        onChange={(e) => {
                          const n = [...expressions];
                          n[i].value = e.target.value;
                          setExpressions(n);
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setExpressions(expressions.filter((_, idx) => idx !== i))}
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
                      onClick={() =>
                        setExpressions([...expressions, { key: '', operator: 'In', value: '' }])
                      }
                    >
                      Add Expression
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>

            {/* 4 — from CreateServicePage */}
            <PatternSection
              id="ports"
              title="4. Multi-Column Port Rows"
              description="Dynamic rows with 4-5 columns for service port configuration."
              source="CreateServicePage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Port Name <span className="text-[#ea580c]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Listening Port <span className="text-[#ea580c]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Protocol
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Target Port <span className="text-[#ea580c]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Node Port
                    </span>
                    <div />
                  </div>
                  {ports.map((port) => (
                    <div
                      key={port.id}
                      className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="e.g. myport"
                        value={port.name}
                        onChange={(e) => {
                          setPorts(
                            ports.map((p) =>
                              p.id === port.id ? { ...p, name: e.target.value } : p
                            )
                          );
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="e.g. 8080"
                        value={port.listeningPort}
                        onChange={(e) => {
                          setPorts(
                            ports.map((p) =>
                              p.id === port.id ? { ...p, listeningPort: e.target.value } : p
                            )
                          );
                        }}
                        fullWidth
                      />
                      <Select
                        options={[
                          { value: 'TCP', label: 'TCP' },
                          { value: 'UDP', label: 'UDP' },
                          { value: 'SCTP', label: 'SCTP' },
                        ]}
                        value={port.protocol}
                        onChange={(value) => {
                          setPorts(
                            ports.map((p) => (p.id === port.id ? { ...p, protocol: value } : p))
                          );
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="e.g. 80 or http"
                        value={port.targetPort}
                        onChange={(e) => {
                          setPorts(
                            ports.map((p) =>
                              p.id === port.id ? { ...p, targetPort: e.target.value } : p
                            )
                          );
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="e.g. 30000"
                        value={port.nodePort || ''}
                        onChange={(e) => {
                          setPorts(
                            ports.map((p) =>
                              p.id === port.id ? { ...p, nodePort: e.target.value } : p
                            )
                          );
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setPorts(ports.filter((p) => p.id !== port.id))}
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
                      onClick={() =>
                        setPorts([
                          ...ports,
                          {
                            id: String(ports.length + 1),
                            name: '',
                            listeningPort: '',
                            protocol: 'TCP',
                            targetPort: '',
                            nodePort: '',
                          },
                        ])
                      }
                    >
                      Add Port
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>

            {/* 5 — from CreatePodPage, CreateDeploymentPage, CreateStatefulSetPage, CreateDaemonSetPage */}
            <PatternSection
              id="envvars"
              title="5. Environment Variables (Name + Type + Value)"
              description="Three-column grid: Name, Value Type (Select), Value/Source."
              source="CreatePodPage, CreateDeploymentPage, CreateStatefulSetPage, CreateDaemonSetPage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Name
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value Type
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value/Source
                    </span>
                    <div />
                  </div>
                  {envVars.map((ev, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="input variable name"
                        value={ev.name}
                        onChange={(e) => {
                          const n = [...envVars];
                          n[i].name = e.target.value;
                          setEnvVars(n);
                        }}
                        fullWidth
                      />
                      <Select
                        options={ENV_TYPE_OPTIONS}
                        value={ev.type}
                        onChange={(v) => {
                          const n = [...envVars];
                          n[i].type = v;
                          setEnvVars(n);
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="input value"
                        value={ev.value}
                        onChange={(e) => {
                          const n = [...envVars];
                          n[i].value = e.target.value;
                          setEnvVars(n);
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
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
                      onClick={() =>
                        setEnvVars([...envVars, { name: '', type: 'value', value: '' }])
                      }
                    >
                      Add Variable
                    </Button>
                  </div>
                </VStack>
              </div>
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2} className="w-full">
                  {envVarGroups.map((group, gi) => (
                    <div
                      key={gi}
                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                    >
                      <VStack gap={1}>
                        <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Name
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value Type
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value/Source
                          </span>
                          <button
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            onClick={() =>
                              setEnvVarGroups(envVarGroups.filter((_, idx) => idx !== gi))
                            }
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
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
                                const n = envVarGroups.map((g, idx) =>
                                  idx === gi
                                    ? g.map((r, ri) =>
                                        ri === i ? { ...r, name: e.target.value } : r
                                      )
                                    : g
                                );
                                setEnvVarGroups(n);
                              }}
                              fullWidth
                            />
                            <Select
                              options={ENV_TYPE_OPTIONS}
                              value={ev.type}
                              onChange={(v) => {
                                const n = envVarGroups.map((g, idx) =>
                                  idx === gi
                                    ? g.map((r, ri) => (ri === i ? { ...r, type: v } : r))
                                    : g
                                );
                                setEnvVarGroups(n);
                              }}
                              fullWidth
                            />
                            <Input
                              placeholder="input value"
                              value={ev.value}
                              onChange={(e) => {
                                const n = envVarGroups.map((g, idx) =>
                                  idx === gi
                                    ? g.map((r, ri) =>
                                        ri === i ? { ...r, value: e.target.value } : r
                                      )
                                    : g
                                );
                                setEnvVarGroups(n);
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
                      onClick={() =>
                        setEnvVarGroups([...envVarGroups, [{ name: '', type: 'value', value: '' }]])
                      }
                    >
                      Add Variable
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>

            {/* 6 — from CreatePodPage, CreatePersistentVolumePage, CreateStorageClassPage */}
            <PatternSection
              id="single-list"
              title="6. Single-Value List"
              description="One-column dynamic list with add/remove."
              source="CreatePodPage (Nameservers, Search Domains), CreatePersistentVolumePage (Mount Options), CreateStorageClassPage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  <div className="grid grid-cols-[1fr_20px] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div />
                  </div>
                  {nameservers.map((ns, i) => (
                    <div key={i} className="grid grid-cols-[1fr_20px] gap-2 w-full items-center">
                      <Input
                        placeholder="e.g. 8.8.8.8"
                        value={ns}
                        onChange={(e) => {
                          const n = [...nameservers];
                          n[i] = e.target.value;
                          setNameservers(n);
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setNameservers(nameservers.filter((_, idx) => idx !== i))}
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
                      onClick={() => setNameservers([...nameservers, ''])}
                    >
                      Add Nameserver
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>

            {/* 7 — from CreateDeploymentPage, CreatePodPage */}
            <PatternSection
              id="host-aliases"
              title="7. Host Aliases (with Column Descriptions)"
              description="Key-value grid where column headers have descriptions."
              source="CreateDeploymentPage, CreatePodPage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full">
                    <VStack gap={1}>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        IP Address
                      </span>
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the IP address used for the host alias.
                      </p>
                    </VStack>
                    <VStack gap={1}>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Hostname
                      </span>
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the hostname mapped to the IP address.
                      </p>
                    </VStack>
                    <div className="w-5" />
                  </div>
                  {hostAliases.map((alias, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="e.g. 127.0.0.1"
                        value={alias.ip}
                        onChange={(e) => {
                          const n = [...hostAliases];
                          n[i].ip = e.target.value;
                          setHostAliases(n);
                        }}
                        fullWidth
                      />
                      <Input
                        placeholder="e.g. foo.company.com"
                        value={alias.hostname}
                        onChange={(e) => {
                          const n = [...hostAliases];
                          n[i].hostname = e.target.value;
                          setHostAliases(n);
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setHostAliases(hostAliases.filter((_, idx) => idx !== i))}
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
                      onClick={() => setHostAliases([...hostAliases, { ip: '', hostname: '' }])}
                    >
                      Add Alias
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>

            {/* 8 — from CreateTemplatePage */}
            <PatternSection
              id="vlan"
              title="8. Virtual LAN Inline Row"
              description="Inline label + Select pairs (Network, Subnet, Auto-assign) with add/remove."
              source="CreateTemplatePage, ComputeAdminCreateTemplatePage"
            >
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {virtualLANs.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Network
                      </span>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Subnet
                      </span>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        IP Assignment
                      </span>
                      <div />
                    </div>
                  )}
                  {virtualLANs.map((vlan) => (
                    <div
                      key={vlan.id}
                      className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Select
                        options={[{ value: 'network', label: 'network' }]}
                        value={vlan.network}
                        onChange={(v) => {
                          setVirtualLANs(
                            virtualLANs.map((item) =>
                              item.id === vlan.id ? { ...item, network: v } : item
                            )
                          );
                        }}
                        fullWidth
                      />
                      <Select
                        options={[{ value: 'subnet', label: 'subnet' }]}
                        value={vlan.subnet}
                        onChange={(v) => {
                          setVirtualLANs(
                            virtualLANs.map((item) =>
                              item.id === vlan.id ? { ...item, subnet: v } : item
                            )
                          );
                        }}
                        fullWidth
                      />
                      <Select
                        options={[{ value: 'Auto-assign', label: 'Auto-assign' }]}
                        value={vlan.autoAssign}
                        onChange={(v) => {
                          setVirtualLANs(
                            virtualLANs.map((item) =>
                              item.id === vlan.id ? { ...item, autoAssign: v } : item
                            )
                          );
                        }}
                        fullWidth
                      />
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => setVirtualLANs(virtualLANs.filter((v) => v.id !== vlan.id))}
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
                      onClick={() =>
                        setVirtualLANs([
                          ...virtualLANs,
                          {
                            id: `vlan${Date.now()}`,
                            network: 'network',
                            subnet: 'subnet',
                            autoAssign: 'Auto-assign',
                          },
                        ])
                      }
                    >
                      Add virtual LAN
                    </Button>
                  </div>
                </VStack>
              </div>
            </PatternSection>
          </div>
        </VStack>
      </div>
    </div>
  );
}

export default FormPatternsPage;
