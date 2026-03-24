import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ConfigMapData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  data: Record<string, string>;
  binaryData: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockConfigMapData: Record<string, ConfigMapData> = {
  '1': {
    id: '1',
    name: 'app-config',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Nov 10, 2025 01:17:01',
    labels: {},
    annotations: {},
    data: {
      'config.yaml': 'server:\n  port: 8080\n  host: 0.0.0.0',
      'settings.json': '{"debug": true, "logLevel": "info"}',
    },
    binaryData: {
      'cert.pem': 'base64encodeddata...',
      'key.pem': 'base64encodeddata...',
    },
  },
  '2': {
    id: '2',
    name: 'nginx-config',
    status: 'True',
    namespace: 'nginx-ingress',
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: {
      app: 'nginx',
    },
    annotations: {
      description: 'Nginx configuration',
    },
    data: {
      'nginx.conf': 'worker_processes 1;\nevents { worker_connections 1024; }',
    },
    binaryData: {},
  },
  '3': {
    id: '3',
    name: 'kube-root-ca.crt',
    status: 'Raw',
    namespace: 'kube-system',
    createdAt: 'Nov 8, 2025 11:51:27',
    labels: {},
    annotations: {},
    data: {
      'ca.crt': '-----BEGIN CERTIFICATE-----\nMIIBdjCCAR2gAwIBAgI...',
    },
    binaryData: {},
  },
  '4': {
    id: '4',
    name: 'coredns',
    status: 'None',
    namespace: 'kube-system',
    createdAt: 'Nov 7, 2025 04:38:10',
    labels: {
      'k8s-app': 'kube-dns',
    },
    annotations: {},
    data: {
      Corefile: '.:53 {\n    errors\n    health\n    kubernetes cluster.local\n}',
      NodeHosts: '# Kubernetes-managed hosts file',
      'Corefile.bak': '# Backup configuration',
      'custom.zones': '# Custom DNS zones',
    },
    binaryData: {},
  },
  '5': {
    id: '5',
    name: 'prometheus-config',
    status: 'OK',
    namespace: 'monitoring',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: {
      app: 'prometheus',
    },
    annotations: {
      'prometheus.io/scrape': 'true',
    },
    data: {
      'prometheus.yml':
        'global:\n  scrape_interval: 15s\nscrape_configs:\n  - job_name: prometheus',
      'rules.yml': 'groups:\n  - name: example\n    rules: []',
      'alerts.yml': 'groups:\n  - name: alerts\n    rules: []',
      'recording.yml': '# Recording rules',
      'custom.yml': '# Custom configuration',
      'targets.json': '[]',
    },
    binaryData: {},
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerConfigMapDetailPage() {
  const { configMapId } = useParams<{ configMapId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'data';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [configMapData, setConfigMapData] = useState<ConfigMapData | null>(null);

  useEffect(() => {
    if (configMapId && mockConfigMapData[configMapId]) {
      setConfigMapData(mockConfigMapData[configMapId]);
    } else {
      setConfigMapData(mockConfigMapData['1']);
    }
  }, [configMapId]);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!configMapData) return [];
    const labelsCount = Object.keys(configMapData.labels).length;
    const annotationsCount = Object.keys(configMapData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={configMapData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {configMapData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link
            to={`/container/namespaces/${encodeURIComponent(configMapData.namespace)}`}
            className="text-12 text-primary hover:underline cursor-pointer"
          >
            {configMapData.namespace}
          </Link>
        ),
      },
      { label: 'Created at', value: configMapData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0
            ? Object.entries(configMapData.labels)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : '-',
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0
            ? Object.entries(configMapData.annotations)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : '-',
      },
    ];
  }, [configMapData]);

  if (!configMapData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  const dataEntries = Object.entries(configMapData.data);
  const binaryDataEntries = Object.entries(configMapData.binaryData);

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`ConfigMap: ${configMapData.name}`}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                type="button"
                onClick={toggle}
              >
                More actions
                <IconChevronDown size={12} stroke={1.5} />
              </Button>
            )}
          >
            <ContextMenu.Item action={() => navigate(`/container/configmaps/${configMapId}/edit`)}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() =>
                navigate(
                  `/container/configmaps/${encodeURIComponent(configMapData.name)}/edit-yaml`
                )
              }
            >
              Edit YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download YAML')}>
              Download YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
        infoFields={infoFields}
      />

      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
        <Tab id="data" label="Data">
          <div className="flex flex-col gap-3">
            <div className="w-full border border-border rounded-md p-3">
              <div className="flex flex-col gap-3">
                <span className="text-16 font-semibold leading-6 text-text">Data</span>
                {dataEntries.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {dataEntries.map(([key, value]) => (
                      <div key={key} className="w-full border border-border rounded-md p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 sm:items-start w-full">
                          <FormField label="Key" className="flex-1 min-w-0">
                            <Input value={key} onChange={() => {}} className="w-full" />
                          </FormField>
                          <FormField label="Value" className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <Input
                                value={value}
                                onChange={() => {}}
                                className="flex-1 min-w-0 w-full"
                              />
                              <CopyButton text={value} />
                            </div>
                          </FormField>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-12 text-text-muted">No data entries.</p>
                )}
              </div>
            </div>

            <div className="w-full border border-border rounded-md p-3">
              <div className="flex flex-col gap-3">
                <span className="text-16 font-semibold leading-6 text-text">Binary data</span>
                {binaryDataEntries.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {binaryDataEntries.map(([key, value]) => (
                      <div key={key} className="w-full border border-border rounded-md p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 sm:items-start w-full">
                          <FormField label="Key" className="flex-1 min-w-0">
                            <Input value={key} onChange={() => {}} className="w-full" />
                          </FormField>
                          <FormField label="Value" className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <Input
                                value={value}
                                onChange={() => {}}
                                className="flex-1 min-w-0 w-full"
                              />
                              <CopyButton text={value} />
                            </div>
                          </FormField>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-12 text-text-muted">No binary data entries.</p>
                )}
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
