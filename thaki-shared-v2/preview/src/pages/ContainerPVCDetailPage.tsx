import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Input, NumberInput } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Checkbox } from '@shared/components/Checkbox';
import { RadioButton } from '@shared/components/RadioButton';
import { Dropdown } from '@shared/components/Dropdown';
import { Popover } from '@shared/components/Popover';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { IconChevronDown, IconDownload, IconTrash } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';

const searchInputClass =
  'h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 outline-none shrink-0 w-[min(100%,320px)]';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PVCCondition {
  id: string;
  condition: string;
  size: string;
  message: string;
  updated: string;
  [key: string]: unknown;
}

interface PVCEvent {
  id: string;
  lastSeen: string;
  type: 'Normal' | 'Warning';
  reason: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
  name: string;
  [key: string]: unknown;
}

interface PersistentVolumeClaimData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  source: 'storage-class' | 'existing-pv';
  storageClass: string;
  requestStorage: number;
  storageUnit: string;
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  conditions: PVCCondition[];
  events: PVCEvent[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPersistentVolumeClaimData: Record<string, PersistentVolumeClaimData> = {
  '1': {
    id: '1',
    name: 'cert-manager',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'Default Storage Class',
    requestStorage: 10,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound successfully',
        updated: 'Jul 25, 2025',
      },
      {
        id: '2',
        condition: 'FileSystemResizePending',
        size: 'False',
        message: '[Info] No resize pending',
        updated: 'Jul 25, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '30m',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Successfully provisioned volume pvc-cert-manager-001',
        firstSeen: '30m',
        count: 1,
        name: 'cert-manager.17a8b9c0d1e2f3',
      },
      {
        id: '2',
        lastSeen: '25m',
        type: 'Normal',
        reason: 'Bound',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Volume bound successfully to pod',
        firstSeen: '25m',
        count: 1,
        name: 'cert-manager.17a8b9c0d1e2f4',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'data-postgres-0',
    status: 'OK',
    namespace: 'database',
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: {
      app: 'postgres',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'standard',
    requestStorage: 50,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound to pvc-abc12345',
        updated: 'Nov 9, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '1h',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Successfully provisioned volume pvc-abc12345',
        firstSeen: '1h',
        count: 1,
        name: 'data-postgres-0.18a9c0d2e3f4',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'redis-data',
    status: 'True',
    namespace: 'cache',
    createdAt: 'Nov 8, 2025 11:51:27',
    labels: {
      app: 'redis',
    },
    annotations: {},
    source: 'existing-pv',
    storageClass: '',
    requestStorage: 5,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: true,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Bound to existing PV',
        updated: 'Nov 8, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '2h',
        type: 'Normal',
        reason: 'ExternalProvisioning',
        subobject: 'pvc',
        source: 'external-provisioner',
        message: 'Bound to existing PV redis-pv-001',
        firstSeen: '2h',
        count: 1,
        name: 'redis-data.19b0d1e3f4g5',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'pending-claim',
    status: 'Raw',
    namespace: 'default',
    createdAt: 'Nov 10, 2025 01:17:01',
    labels: {},
    annotations: {},
    source: 'storage-class',
    storageClass: 'nfs',
    requestStorage: 20,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: false,
      manyNodesReadWrite: true,
    },
    conditions: [
      {
        id: '1',
        condition: 'Pending',
        size: 'True',
        message: '[Waiting] Waiting for volume to be provisioned',
        updated: 'Nov 10, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '5m',
        type: 'Warning',
        reason: 'ProvisioningFailed',
        subobject: 'pvc',
        source: 'nfs-provisioner',
        message: 'Failed to provision volume: no storage capacity available',
        firstSeen: '30m',
        count: 6,
        name: 'pending-claim.20c1e2f4g5h6',
      },
      {
        id: '2',
        lastSeen: '10m',
        type: 'Normal',
        reason: 'ExternalProvisioning',
        subobject: 'pvc',
        source: 'nfs-provisioner',
        message: 'Waiting for a volume to be created',
        firstSeen: '30m',
        count: 3,
        name: 'pending-claim.20c1e2f4g5h7',
      },
    ],
  },
  '5': {
    id: '5',
    name: 'elasticsearch-data-0',
    status: 'OK',
    namespace: 'logging',
    createdAt: 'Nov 7, 2025 04:38:10',
    labels: {
      app: 'elasticsearch',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'Ceph',
    requestStorage: 100,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound to pvc-elastic-001',
        updated: 'Nov 7, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '3h',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'ceph-provisioner',
        message: 'Successfully provisioned volume pvc-elastic-001',
        firstSeen: '3h',
        count: 1,
        name: 'elasticsearch-data-0.21d2f3g5h6i7',
      },
    ],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerPVCDetailPage() {
  const { pvcId } = useParams<{ pvcId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'volume-claim';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedEventKeys, setSelectedEventKeys] = useState<(string | number)[]>([]);
  const [conditionsSort, setConditionsSort] = useState('');
  const [conditionsOrder, setConditionsOrder] = useState<SortOrder>('asc');

  const [pvcData, setPvcData] = useState<PersistentVolumeClaimData | null>(null);

  useEffect(() => {
    if (pvcId && mockPersistentVolumeClaimData[pvcId]) {
      setPvcData(mockPersistentVolumeClaimData[pvcId]);
    } else {
      setPvcData(mockPersistentVolumeClaimData['1']);
    }
  }, [pvcId]);

  const storageClassOptions = [
    { value: '', label: '—' },
    { value: 'Default Storage Class', label: 'Default storage class' },
    { value: 'standard', label: 'standard' },
    { value: 'fast', label: 'fast' },
    { value: 'Ceph', label: 'Ceph' },
    { value: 'nfs', label: 'nfs' },
  ];

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!pvcData) return [];
    const labelsCount = Object.keys(pvcData.labels).length;
    const annotationsCount = Object.keys(pvcData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={pvcData.status === 'Bound' ? 'Active' : pvcData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {pvcData.status === 'Bound' ? 'Active' : pvcData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link
            to={`/container/namespaces/${encodeURIComponent(pvcData.namespace)}`}
            className="text-12 font-medium text-primary hover:underline"
          >
            {pvcData.namespace}
          </Link>
        ),
      },
      { label: 'Created at', value: pvcData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0 ? (
            <div className="flex items-center gap-1 min-w-0">
              {Object.entries(pvcData.labels)
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
                        {Object.entries(pvcData.labels).map(([k, v]) => (
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
              {Object.entries(pvcData.annotations)
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
                        {Object.entries(pvcData.annotations).map(([k, v]) => (
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
  }, [pvcData]);

  const conditionsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'condition', header: 'Condition', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'message', header: 'Message', sortable: true },
      { key: 'updated', header: 'Updated', sortable: true },
    ],
    []
  );

  const eventsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'lastSeen', header: 'Last seen', sortable: true, width: 100 },
      { key: 'type', header: 'Type', sortable: true, width: 88 },
      { key: 'reason', header: 'Reason', sortable: true },
      { key: 'subobject', header: 'Subobject', width: 100 },
      { key: 'source', header: 'Source', sortable: true, width: 120 },
      { key: 'message', header: 'Message', sortable: true },
      { key: 'firstSeen', header: 'First seen', sortable: true, width: 100 },
      { key: 'count', header: 'Count', sortable: true, width: 72 },
      { key: 'name', header: 'Name', sortable: true },
    ],
    []
  );

  const cc = useCallback(
    (cols: TableColumn[], key: string) => cols.find((col) => col.key === key)!,
    []
  );

  const handleConditionsSort = useCallback((s: string | null, o: SortOrder) => {
    setConditionsSort(s ?? '');
    setConditionsOrder(o);
  }, []);

  if (!pvcData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  const labelsCount = Object.keys(pvcData.labels).length;
  const annotationsCount = Object.keys(pvcData.annotations).length;

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Persistent Volume Claim: ${pvcData.name}`}
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
            <ContextMenu.Item action={() => navigate(`/container/pvc/${pvcId}/edit`)}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item action={() => navigate(`/container/pvc/${pvcData.name}/edit-yaml`)}>
              Edit YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download YAML')}>
              Download
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
        infoFields={infoFields}
      />

      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
        <Tab id="volume-claim" label="Volume claim">
          <div className="border border-border rounded-lg bg-surface-default">
            <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
              <span className="text-16 font-semibold leading-6 text-text">Volume claim</span>
            </div>
            <div className="p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-3 items-start">
                <h4 className="text-13 font-medium leading-18 text-text">Source</h4>
                <div
                  className="flex flex-col gap-2 items-start"
                  role="radiogroup"
                  aria-label="Volume source"
                >
                  <RadioButton
                    name="pvc-source"
                    value="storage-class"
                    label="Use a Storage Class to provision a new Persistent Volume"
                    checked={pvcData.source === 'storage-class'}
                    onChange={() => {}}
                    disabled
                  />
                  <RadioButton
                    name="pvc-source"
                    value="existing-pv"
                    label="Use an existing Persistent Volume"
                    checked={pvcData.source === 'existing-pv'}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              <FormField label="Storage Class" disabled className="w-full">
                <Dropdown.Select
                  value={pvcData.storageClass}
                  onChange={() => {}}
                  placeholder="Default storage class"
                  size="sm"
                  disabled
                >
                  {storageClassOptions.map((opt) => (
                    <Dropdown.Option
                      key={opt.value === '' ? '__empty' : opt.value}
                      value={opt.value}
                      label={opt.label}
                    />
                  ))}
                </Dropdown.Select>
              </FormField>

              <FormField label="Request Storage" required disabled className="w-full">
                <div className="flex items-center gap-3">
                  <NumberInput
                    value={pvcData.requestStorage}
                    onChange={() => {}}
                    min={1}
                    disabled
                    hideSteppers
                  />
                  <span className="text-12 text-text">{pvcData.storageUnit}</span>
                </div>
              </FormField>
            </div>
          </div>
        </Tab>

        <Tab id="customize" label="Customize">
          <div className="border border-border rounded-lg bg-surface-default">
            <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
              <span className="text-16 font-semibold leading-6 text-text">Customize</span>
            </div>
            <div className="p-4 flex flex-col gap-3 items-start">
              <h4 className="text-13 font-medium leading-18 text-text">Access modes</h4>
              <div className="flex flex-col gap-2 items-start">
                <Checkbox
                  label="Single node read-write"
                  checked={pvcData.accessModes.singleNodeReadWrite}
                  onChange={() => {}}
                  disabled
                />
                <Checkbox
                  label="Many nodes read-only"
                  checked={pvcData.accessModes.manyNodesReadOnly}
                  onChange={() => {}}
                  disabled
                />
                <Checkbox
                  label="Many nodes read-write"
                  checked={pvcData.accessModes.manyNodesReadWrite}
                  onChange={() => {}}
                  disabled
                />
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="conditions" label="Conditions">
          <div className="flex flex-col gap-3">
            <h3 className="text-16 font-semibold leading-6 text-text">Conditions</h3>
            <Pagination
              currentAt={1}
              totalCount={pvcData.conditions.length}
              size={10}
              onPageChange={() => {}}
              totalCountLabel="items"
              onSettingClick={() => {}}
              settingAriaLabel="Pagination settings"
            />
            {pvcData.conditions.length > 0 ? (
              <Table<PVCCondition>
                columns={conditionsColumns}
                rows={pvcData.conditions}
                sort={conditionsSort}
                order={conditionsOrder}
                onSortChange={handleConditionsSort}
              >
                {pvcData.conditions.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={cc(conditionsColumns, 'condition')}>
                      {row.condition}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(conditionsColumns, 'size')}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(conditionsColumns, 'message')}>
                      <span className="truncate block min-w-0" title={row.message}>
                        {row.message}
                      </span>
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(conditionsColumns, 'updated')}>
                      {row.updated}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            ) : (
              <p className="text-12 text-text-muted">No conditions to display.</p>
            )}
          </div>
        </Tab>

        <Tab id="labels-annotations" label="Labels & annotations">
          <div className="border border-border rounded-lg bg-surface-default">
            <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
              <span className="text-16 font-semibold leading-6 text-text">
                Labels & annotations
              </span>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2 items-start w-full">
                <h4 className="text-13 font-medium leading-18 text-text">Labels</h4>
                {labelsCount > 0 ? (
                  <div className="w-full border border-border rounded-md p-3">
                    <div className="flex flex-col gap-2">
                      {Object.entries(pvcData.labels).map(([key, val]) => (
                        <div key={key} className="flex gap-2 w-full flex-col sm:flex-row">
                          <FormField label="Key" disabled className="flex-1 min-w-0">
                            <Input value={key} onChange={() => {}} className="w-full" />
                          </FormField>
                          <FormField label="Value" disabled className="flex-1 min-w-0">
                            <Input value={val} onChange={() => {}} className="w-full" />
                          </FormField>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-12 text-text-muted">No labels</p>
                )}
              </div>

              <div className="flex flex-col gap-2 items-start w-full">
                <h4 className="text-13 font-medium leading-18 text-text">Annotations</h4>
                {annotationsCount > 0 ? (
                  <div className="w-full border border-border rounded-md p-3">
                    <div className="flex flex-col gap-2">
                      {Object.entries(pvcData.annotations).map(([key, val]) => (
                        <div key={key} className="flex gap-2 w-full flex-col sm:flex-row">
                          <FormField label="Key" disabled className="flex-1 min-w-0">
                            <Input value={key} onChange={() => {}} className="w-full" />
                          </FormField>
                          <FormField label="Value" disabled className="flex-1 min-w-0">
                            <Input value={val} onChange={() => {}} className="w-full" />
                          </FormField>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-12 text-text-muted">No annotations</p>
                )}
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="recent-events" label="Recent events">
          <div className="flex flex-col gap-3">
            <h3 className="text-16 font-semibold leading-6 text-text">Recent events</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="search"
                placeholder="Search events by attributes"
                className={searchInputClass}
                aria-label="Search events by attributes"
              />
              <div className="w-px h-5 bg-border shrink-0" />
              <div className="flex items-center gap-1">
                <Button
                  appearance="outline"
                  variant="muted"
                  size="sm"
                  disabled={selectedEventKeys.length === 0}
                >
                  <IconDownload size={12} stroke={1.5} /> Download YAML
                </Button>
                <Button
                  appearance="outline"
                  variant="muted"
                  size="sm"
                  disabled={selectedEventKeys.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>
            </div>
            <Pagination
              currentAt={1}
              totalCount={pvcData.events.length}
              size={10}
              onPageChange={() => {}}
              totalCountLabel="items"
              selectedCount={selectedEventKeys.length}
              onSettingClick={() => {}}
              settingAriaLabel="Pagination settings"
            />
            {pvcData.events.length > 0 ? (
              <SelectableTable<PVCEvent>
                columns={eventsColumns}
                rows={pvcData.events}
                selectionType="checkbox"
                selectedRows={selectedEventKeys}
                onRowSelectionChange={setSelectedEventKeys}
                getRowId={(row) => row.id}
              >
                {pvcData.events.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'lastSeen')}>
                      {row.lastSeen}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'type')}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'reason')}>
                      {row.reason}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'subobject')}>
                      {row.subobject}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'source')}>
                      {row.source}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'message')}>
                      <span className="truncate block min-w-0" title={row.message}>
                        {row.message}
                      </span>
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'firstSeen')}>
                      {row.firstSeen}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'count')}>
                      {row.count}
                    </Table.Td>
                    <Table.Td rowData={row} column={cc(eventsColumns, 'name')}>
                      <span className="text-12 font-medium text-primary cursor-pointer hover:underline">
                        {row.name}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            ) : (
              <p className="text-12 text-text-muted">No recent events to display.</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
