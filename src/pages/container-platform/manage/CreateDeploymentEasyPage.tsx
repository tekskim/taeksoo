import { useState, useMemo } from 'react';
import {
  PageHeader,
  VStack,
  HStack,
  Button,
  FormField,
  Input,
  Select,
  InlineMessage,
} from '@/design-system';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ManageShell, useManageCluster } from './ManageShell';
import { manageBasePath } from '../ClusterManageSidebar';
import { getNamespaces } from '../containerPlatformMockData';

/* ----------------------------------------
   Create Deployment — simplified concept

   Design probe for "an easier Container Platform": only the fields most
   deployments actually need, strong defaults, everything else behind one
   "Advanced settings" fold. Review this against the existing full form
   (Aegis Container > Workloads > Create Deployment) and judge what else
   can be cut.
   ---------------------------------------- */

const REPLICA_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
];

export default function CreateDeploymentEasyPage() {
  const navigate = useNavigate();
  const { clusterId } = useManageCluster();
  const base = manageBasePath(clusterId);

  const namespaceOptions = useMemo(() => {
    const inCluster = getNamespaces().filter((n) => n.clusterId === clusterId);
    const names = inCluster.length > 0 ? inCluster.map((n) => n.name) : ['default'];
    return Array.from(new Set(names)).map((name) => ({ value: name, label: name }));
  }, [clusterId]);

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState(namespaceOptions[0]?.value ?? 'default');
  const [image, setImage] = useState('');
  const [replicas, setReplicas] = useState('2');
  const [port, setPort] = useState('80');
  const [nameError, setNameError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [labels, setLabels] = useState('');
  const [cpuRequest, setCpuRequest] = useState('250m');
  const [memRequest, setMemRequest] = useState('256Mi');

  const handleCreate = () => {
    const hasName = name.trim().length > 0;
    const hasImage = image.trim().length > 0;
    setNameError(!hasName);
    setImageError(!hasImage);
    if (!hasName || !hasImage) return;
    navigate(`${base}/workloads`);
  };

  return (
    <ManageShell clusterId={clusterId} crumb="Create Deployment">
      <VStack gap={4} className="max-w-[560px]">
        <PageHeader title="Create Deployment" />

        <InlineMessage variant="info">
          Simplified create (concept) — just the essentials with strong defaults. Compare with the
          existing full form (name / YAML / 12+ sections) and judge what else can be cut.
        </InlineMessage>

        <FormField
          label="Name"
          required
          error={nameError}
          errorMessage={nameError ? 'Name is required.' : undefined}
        >
          <Input
            placeholder="my-app"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(false);
            }}
            fullWidth
          />
        </FormField>

        <FormField label="Namespace" required>
          <Select
            options={namespaceOptions}
            value={namespace}
            onChange={(value) => setNamespace(value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Image"
          required
          error={imageError}
          errorMessage={imageError ? 'Container image is required.' : undefined}
          helperText="Registry path and tag, e.g. nginx:1.27"
        >
          <Input
            placeholder="nginx:1.27"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (imageError) setImageError(false);
            }}
            fullWidth
          />
        </FormField>

        <HStack gap={4} className="w-full">
          <div className="flex-1">
            <FormField label="Replicas">
              <Select
                options={REPLICA_OPTIONS}
                value={replicas}
                onChange={(value) => setReplicas(value)}
                fullWidth
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="Container port">
              <Input value={port} onChange={(e) => setPort(e.target.value)} fullWidth />
            </FormField>
          </div>
        </HStack>

        {/* Advanced fold — everything the full form front-loads lives here */}
        <VStack gap={3} className="w-full">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex items-center gap-1 text-label-md text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
          >
            {advancedOpen ? (
              <IconChevronDown size={14} stroke={1.5} />
            ) : (
              <IconChevronRight size={14} stroke={1.5} />
            )}
            Advanced settings
          </button>

          {advancedOpen && (
            <VStack
              gap={4}
              className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4"
            >
              <FormField label="Labels" helperText="key=value, comma separated">
                <Input
                  placeholder="app=my-app, tier=web"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  fullWidth
                />
              </FormField>
              <HStack gap={4} className="w-full">
                <div className="flex-1">
                  <FormField label="CPU request">
                    <Input
                      value={cpuRequest}
                      onChange={(e) => setCpuRequest(e.target.value)}
                      fullWidth
                    />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="Memory request">
                    <Input
                      value={memRequest}
                      onChange={(e) => setMemRequest(e.target.value)}
                      fullWidth
                    />
                  </FormField>
                </div>
              </HStack>
              <span className="text-body-sm text-[var(--color-text-muted)]">
                Env vars, volume mounts, probes, affinity, and YAML editing stay out of the quick
                path — they would live here or in the full editor.
              </span>
            </VStack>
          )}
        </VStack>

        <HStack gap={2} className="pt-2">
          <Button variant="secondary" onClick={() => navigate(`${base}/workloads`)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </HStack>
      </VStack>
    </ManageShell>
  );
}
