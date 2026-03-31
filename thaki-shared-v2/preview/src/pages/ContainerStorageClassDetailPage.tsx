import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { RadioButton } from '@shared/components/RadioButton';
import { Popover } from '@shared/components/Popover';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StorageClassData {
  id: string;
  name: string;
  status: string;
  isDefault: boolean;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  parameters: Record<string, string>;
  reclaimPolicy: 'Delete' | 'Retain';
  volumeBindingMode: 'Immediate' | 'WaitForFirstConsumer';
  allowVolumeExpansion: boolean;
  mountOptions: string[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockStorageClassData: Record<string, StorageClassData> = {
  '1': {
    id: '1',
    name: 'storageclassName1',
    status: 'OK',
    isDefault: true,
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'storageclass.kubernetes.io/is-default-class': 'true',
    },
    parameters: {
      foo: 'bar',
      type: 'gp3',
      fsType: 'ext4',
    },
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    mountOptions: ['bar', 'bar', 'bar'],
  },
  '2': {
    id: '2',
    name: 'storageclassName2',
    status: 'True',
    isDefault: false,
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      app: 'storage',
    },
    annotations: {
      description: 'Standard storage class',
    },
    parameters: {
      type: 'standard',
    },
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: false,
    mountOptions: ['noatime', 'nodiratime'],
  },
  '3': {
    id: '3',
    name: 'ceph-rbd',
    status: 'Raw',
    isDefault: false,
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: {},
    annotations: {},
    parameters: {
      clusterID: 'ceph-cluster-1',
      pool: 'replicapool',
    },
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    mountOptions: [],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerStorageClassDetailPage() {
  const { storageClassId } = useParams<{ storageClassId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'parameters';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [scData, setScData] = useState<StorageClassData | null>(null);

  useEffect(() => {
    if (storageClassId && mockStorageClassData[storageClassId]) {
      setScData(mockStorageClassData[storageClassId]);
    } else {
      setScData(mockStorageClassData['1']);
    }
  }, [storageClassId]);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!scData) return [];
    const labelsCount = Object.keys(scData.labels).length;
    const annotationsCount = Object.keys(scData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={scData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {scData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      { label: 'Default', value: scData.isDefault ? 'Yes' : 'No' },
      { label: 'Created at', value: scData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0 ? (
            <div className="flex items-center gap-1 min-w-0">
              {Object.entries(scData.labels)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {labelsCount > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-10 font-medium text-text-muted mb-2">
                        All labels ({labelsCount})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(scData.labels).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-10 font-medium text-text-muted bg-surface-subtle hover:bg-surface-hover transition-colors h-5 cursor-pointer">
                    +{labelsCount - 1}
                  </span>
                </Popover>
              )}
            </div>
          ) : (
            <span className="text-12 text-text">-</span>
          ),
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0 ? (
            <div className="flex items-center gap-1 min-w-0">
              {Object.entries(scData.annotations)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {annotationsCount > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-10 font-medium text-text-muted mb-2">
                        All annotations ({annotationsCount})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(scData.annotations).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-10 font-medium text-text-muted bg-surface-subtle hover:bg-surface-hover transition-colors h-5 cursor-pointer">
                    +{annotationsCount - 1}
                  </span>
                </Popover>
              )}
            </div>
          ) : (
            <span className="text-12 text-text">-</span>
          ),
      },
    ];
  }, [scData]);

  if (!scData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  const parametersEntries = Object.entries(scData.parameters);

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Storage Class: ${scData.name}`}
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
            <ContextMenu.Item action={() => console.log('Set as default')}>
              Set as default
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/storage-classes/${storageClassId}/edit`)}
            >
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() =>
                navigate(`/container/storage-classes/${encodeURIComponent(scData.name)}/edit-yaml`)
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
        <Tab id="parameters" label="Parameters">
          <div className="w-full border border-border rounded-lg p-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-16 font-semibold leading-6 text-text">Parameters</h3>
              {parametersEntries.length > 0 ? (
                <div className="flex flex-col gap-2 w-full">
                  {parametersEntries.map(([key, val]) => (
                    <div key={key} className="w-full border border-border rounded-md p-3">
                      <div className="flex gap-2 w-full flex-col sm:flex-row">
                        <FormField label="Key" disabled className="flex-1 min-w-0">
                          <Input value={key} onChange={() => {}} className="w-full" />
                        </FormField>
                        <FormField label="Value" disabled className="flex-1 min-w-0">
                          <Input value={val} onChange={() => {}} className="w-full" />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-12 text-text-muted">No parameters defined.</p>
              )}
            </div>
          </div>
        </Tab>

        <Tab id="customize" label="Customize">
          <div className="w-full border border-border rounded-lg p-4">
            <div className="flex flex-col gap-6">
              <h3 className="text-16 font-semibold leading-6 text-text">Customize</h3>

              <div className="flex flex-col gap-3 items-start">
                <label className="text-13 font-medium leading-18 text-text">Reclaim policy</label>
                <div className="flex flex-col gap-2 items-start">
                  <RadioButton
                    name="reclaim-policy"
                    value="delete"
                    label="Delete volumes and underlying device when volume claim is deleted"
                    checked={scData.reclaimPolicy === 'Delete'}
                    onChange={() => {}}
                    disabled
                  />
                  <RadioButton
                    name="reclaim-policy"
                    value="retain"
                    label="Retain the volume for manual cleanup"
                    checked={scData.reclaimPolicy === 'Retain'}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 items-start">
                <label className="text-13 font-medium leading-18 text-text">
                  Allow volume expansion
                </label>
                <div className="flex flex-col gap-2 items-start">
                  <RadioButton
                    name="volume-expansion"
                    value="enabled"
                    label="Enabled"
                    checked={scData.allowVolumeExpansion === true}
                    onChange={() => {}}
                    disabled
                  />
                  <RadioButton
                    name="volume-expansion"
                    value="disabled"
                    label="Disabled"
                    checked={scData.allowVolumeExpansion === false}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 items-start">
                <label className="text-13 font-medium leading-18 text-text">
                  Volume binding mode
                </label>
                <div className="flex flex-col gap-2 items-start">
                  <RadioButton
                    name="binding-mode"
                    value="immediate"
                    label="Bind and provision a persistent volume once the PersistentVolumeClaim is created"
                    checked={scData.volumeBindingMode === 'Immediate'}
                    onChange={() => {}}
                    disabled
                  />
                  <RadioButton
                    name="binding-mode"
                    value="wait"
                    label="Bind and provision a persistent volume once a Pod using the PersistentVolumeClaim is created"
                    checked={scData.volumeBindingMode === 'WaitForFirstConsumer'}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <label className="text-13 font-medium leading-18 text-text">Mount options</label>
                {scData.mountOptions.length > 0 ? (
                  <div className="flex flex-col gap-2 w-full">
                    {scData.mountOptions.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={() => {}}
                        className="w-full"
                        disabled
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-12 text-text-muted">No mount options defined.</p>
                )}
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
