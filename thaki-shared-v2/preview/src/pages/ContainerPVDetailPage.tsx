import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Checkbox } from '@shared/components/Checkbox';
import { Dropdown } from '@shared/components/Dropdown';
import { Popover } from '@shared/components/Popover';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PersistentVolumeData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  storageClass: string;
  mountOptions: string;
  nodeSelectors: NodeSelectorGroup[];
}

interface NodeSelectorGroup {
  id: string;
  items: NodeSelectorItem[];
}

interface NodeSelectorItem {
  id: string;
  key: string;
  operator: string;
  value: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPersistentVolumeData: Record<string, PersistentVolumeData> = {
  '1': {
    id: '1',
    name: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    status: 'OK',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'pv.kubernetes.io/provisioned-by': 'rbd.csi.ceph.com',
    },
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    storageClass: 'None',
    mountOptions: 'e.g. bar',
    nodeSelectors: [
      {
        id: '1',
        items: [
          { id: '1-1', key: 'key1', operator: 'in list', value: 'value1' },
          { id: '1-2', key: 'key2', operator: 'is set', value: '-' },
        ],
      },
      {
        id: '2',
        items: [{ id: '2-1', key: 'key3', operator: '>', value: 'value3' }],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    status: 'OK',
    createdAt: 'Jul 24, 2025 03:19:59',
    labels: {
      app: 'postgres',
    },
    annotations: {
      'pv.kubernetes.io/provisioned-by': 'nfs.csi.k8s.io',
    },
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: true,
      manyNodesReadWrite: false,
    },
    storageClass: 'standard',
    mountOptions: '',
    nodeSelectors: [],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerPVDetailPage() {
  const { pvId } = useParams<{ pvId: string }>();
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState('customize');

  const [pvData, setPvData] = useState<PersistentVolumeData | null>(null);

  useEffect(() => {
    if (pvId && mockPersistentVolumeData[pvId]) {
      setPvData(mockPersistentVolumeData[pvId]);
    } else {
      setPvData(mockPersistentVolumeData['1']);
    }
  }, [pvId]);

  const operatorOptions = [
    { value: 'in list', label: 'in list' },
    { value: 'not in list', label: 'not in list' },
    { value: 'is set', label: 'is set' },
    { value: 'is not set', label: 'is not set' },
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
  ];

  const storageClassOptions = [
    { value: 'None', label: 'None' },
    { value: 'standard', label: 'standard' },
    { value: 'fast', label: 'fast' },
  ];

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!pvData) return [];
    const labelsCount = Object.keys(pvData.labels).length;
    const annotationsCount = Object.keys(pvData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={pvData.status === 'Bound' ? 'Active' : pvData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {pvData.status === 'Bound' ? 'Active' : pvData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      { label: 'Created at', value: pvData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0 ? (
            <div className="flex items-center gap-1 min-w-0">
              {Object.entries(pvData.labels)
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
                        {Object.entries(pvData.labels).map(([k, v]) => (
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
            <span className="text-12 text-text-muted">-</span>
          ),
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0 ? (
            <div className="flex items-center gap-1 min-w-0">
              {Object.entries(pvData.annotations)
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
                        {Object.entries(pvData.annotations).map(([k, v]) => (
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
            <span className="text-12 text-text-muted">-</span>
          ),
      },
    ];
  }, [pvData]);

  if (!pvData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Persistent Volume: ${pvData.name}`}
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
            <ContextMenu.Item action={() => navigate(`/container/persistent-volumes/${pvId}/edit`)}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/persistent-volumes/${pvData.name}/edit-yaml`)}
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
        <Tab id="customize" label="Customize">
          <div className="flex flex-col gap-3">
            <div className="w-full border border-border rounded-lg p-4 bg-surface-default">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 items-start">
                  <h3 className="text-13 font-medium leading-18 text-text">Access modes</h3>
                  <div className="flex flex-col gap-1.5 items-start">
                    <Checkbox
                      label="Single node read-write"
                      checked={pvData.accessModes.singleNodeReadWrite}
                      onChange={() => {}}
                      disabled
                    />
                    <Checkbox
                      label="Many nodes read-only"
                      checked={pvData.accessModes.manyNodesReadOnly}
                      onChange={() => {}}
                      disabled
                    />
                    <Checkbox
                      label="Many nodes read-write"
                      checked={pvData.accessModes.manyNodesReadWrite}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>

                <FormField label="Assign to StorageClass" disabled className="w-full">
                  <Dropdown.Select
                    value={pvData.storageClass}
                    onChange={() => {}}
                    placeholder="None"
                    size="sm"
                    disabled
                  >
                    {storageClassOptions.map((opt) => (
                      <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>

                <div className="flex flex-col gap-2 items-start w-full">
                  <h3 className="text-13 font-medium leading-18 text-text">Mount options</h3>
                  <div className="bg-surface-muted rounded-md px-4 py-3 w-full">
                    <div className="grid grid-cols-[1fr] gap-2">
                      <span className="text-11 text-text-muted">Value</span>
                      <Input
                        value={pvData.mountOptions}
                        onChange={() => {}}
                        className="w-full"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-start w-full">
                  <h3 className="text-13 font-medium leading-18 text-text">Node selectors</h3>
                  <div className="flex flex-col gap-2 w-full">
                    {pvData.nodeSelectors.map((group) => (
                      <div key={group.id} className="bg-surface-muted rounded-md px-4 py-3 w-full">
                        <div className="grid grid-cols-[1fr_140px_1fr] gap-2 items-center">
                          <span className="text-11 text-text-muted">Key</span>
                          <span className="text-11 text-text-muted">Operator</span>
                          <span className="text-11 text-text-muted">Value</span>
                          {group.items.map((item) => (
                            <React.Fragment key={item.id}>
                              <Input
                                value={item.key}
                                onChange={() => {}}
                                className="w-full"
                                readOnly
                              />
                              <Input
                                value={
                                  operatorOptions.find((o) => o.value === item.operator)?.label ??
                                  item.operator
                                }
                                onChange={() => {}}
                                className="w-full"
                                readOnly
                              />
                              <Input
                                value={item.value}
                                onChange={() => {}}
                                className="w-full"
                                readOnly
                              />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                    {pvData.nodeSelectors.length === 0 && (
                      <div className="w-full text-center py-4 text-text-muted text-12">
                        No node selectors configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
