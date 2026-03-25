import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconChevronDown, IconEye, IconEyeOff } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SecretData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  secretType: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  data: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecretData: Record<string, SecretData> = {
  '1': {
    id: '1',
    name: 'secretName',
    status: 'OK',
    namespace: 'namespaceName',
    secretType: 'Custom type - customType',
    createdAt: 'Nov 10, 2025 09:23:41',
    labels: {},
    annotations: {},
    data: {
      Key1: 'supersecretvalue1',
      Key2: 'supersecretvalue2',
    },
  },
  '2': {
    id: '2',
    name: 'db-credentials',
    status: 'True',
    namespace: 'default',
    secretType: 'Opaque',
    createdAt: 'Nov 9, 2025 14:07:22',
    labels: {
      app: 'database',
    },
    annotations: {
      description: 'Database credentials',
    },
    data: {
      username: 'admin',
      password: 'dbpassword123',
    },
  },
  '3': {
    id: '3',
    name: 'tls-secret',
    status: 'Raw',
    namespace: 'nginx-ingress',
    secretType: 'kubernetes.io/tls',
    createdAt: 'Nov 8, 2025 11:45:33',
    labels: {},
    annotations: {},
    data: {
      'tls.crt': '-----BEGIN CERTIFICATE-----...',
      'tls.key': '-----BEGIN PRIVATE KEY-----...',
    },
  },
  '4': {
    id: '4',
    name: 'docker-registry',
    status: 'None',
    namespace: 'default',
    secretType: 'kubernetes.io/dockerconfigjson',
    createdAt: 'Nov 7, 2025 16:52:08',
    labels: {},
    annotations: {},
    data: {
      '.dockerconfigjson': '{"auths":{"registry.example.com":{"auth":"..."}}}',
    },
  },
  '5': {
    id: '5',
    name: 'service-account-token',
    status: 'OK',
    namespace: 'kube-system',
    secretType: 'kubernetes.io/service-account-token',
    createdAt: 'Nov 6, 2025 08:30:15',
    labels: {
      'kubernetes.io/service-account.name': 'default',
    },
    annotations: {
      'kubernetes.io/service-account.uid': 'abc-123-def',
    },
    data: {
      'ca.crt': '-----BEGIN CERTIFICATE-----...',
      namespace: 'kube-system',
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerSecretDetailPage() {
  const navigate = useNavigate();
  const { secretId } = useParams<{ secretId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'data';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>({});

  const [secretData, setSecretData] = useState<SecretData | null>(null);

  useEffect(() => {
    if (secretId && mockSecretData[secretId]) {
      setSecretData(mockSecretData[secretId]);
    } else {
      setSecretData(mockSecretData['1']);
    }
  }, [secretId]);

  const toggleValueVisibility = (key: string) => {
    setVisibleValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const maskValue = (_value: string) => '••••••••';

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!secretData) return [];
    const labelsCount = Object.keys(secretData.labels).length;
    const annotationsCount = Object.keys(secretData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={secretData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {secretData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link
            to={`/container/namespaces/${encodeURIComponent(secretData.namespace)}`}
            className="text-12 font-medium text-primary hover:underline"
          >
            {secretData.namespace}
          </Link>
        ),
      },
      { label: 'Secret type', value: secretData.secretType },
      { label: 'Created at', value: secretData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0
            ? Object.entries(secretData.labels)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : '-',
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0
            ? Object.entries(secretData.annotations)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : '-',
      },
    ];
  }, [secretData]);

  if (!secretData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  const dataEntries = Object.entries(secretData.data);

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Secret: ${secretData.name}`}
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
            <ContextMenu.Item action={() => navigate(`/container/secrets/${secretId}/edit`)}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() =>
                navigate(`/container/secrets/${encodeURIComponent(secretData.name)}/edit-yaml`)
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
          <div className="w-full border border-border rounded-md p-3 mt-0">
            <div className="flex flex-col gap-3">
              <span className="text-16 font-semibold leading-6 text-text">Data</span>

              {dataEntries.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {dataEntries.map(([key, value]) => (
                    <div key={key} className="w-full border border-border rounded-md p-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 sm:items-start w-full">
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <span className="text-13 font-medium leading-18 text-text">Key</span>
                          <Input value={key} onChange={() => {}} disabled className="w-full" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <span className="text-13 font-medium leading-18 text-text">Value</span>
                          <div className="flex items-center gap-2 w-full min-w-0">
                            <div className="flex-1 min-w-0">
                              <Input
                                value={visibleValues[key] ? value : maskValue(value)}
                                onChange={() => {}}
                                disabled
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleValueVisibility(key)}
                                className="p-1.5 text-text-muted hover:text-text transition-colors border-none bg-transparent cursor-pointer rounded-md"
                                aria-label={visibleValues[key] ? 'Hide value' : 'Show value'}
                              >
                                {visibleValues[key] ? (
                                  <IconEyeOff size={14} stroke={1.5} />
                                ) : (
                                  <IconEye size={14} stroke={1.5} />
                                )}
                              </button>
                              <CopyButton text={value} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-12 leading-18 text-text-muted">No data entries.</p>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
