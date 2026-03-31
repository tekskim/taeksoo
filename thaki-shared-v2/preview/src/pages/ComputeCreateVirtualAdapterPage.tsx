import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { Toggle } from '@shared/components/Toggle';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { IconExternalLink, IconCirclePlus, IconX, IconEdit } from '@tabler/icons-react';

const STEP_IDS = ['basic', 'network', 'security'] as const;

const STEP_LABELS: Record<(typeof STEP_IDS)[number], string> = {
  basic: 'Basic information',
  network: 'Network',
  security: 'Security',
};

const ITEMS_PER_PAGE = 5;

interface NetworkRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  external: string;
  shared: string;
  subnetCidr: string;
  [key: string]: unknown;
}

const mockNetworks: NetworkRow[] = [
  {
    id: '29tgj234',
    name: 'net-01',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '38rhk345',
    name: 'net-02',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '47sil456',
    name: 'net-03',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '56tjm567',
    name: 'net-04',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '65ukn678',
    name: 'net-05',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
];

const mockSubnetOptions = [
  { value: 'subnet-01', label: 'subnet-01 (192.168.1.0/24)' },
  { value: 'subnet-02', label: 'subnet-02 (10.0.1.0/24)' },
  { value: 'subnet-03', label: 'subnet-03 (172.16.0.0/24)' },
];

const subnetAllocationRanges: Record<string, string> = {
  'subnet-01': '192.168.1.100 - 192.168.1.200',
  'subnet-02': '10.0.1.100 - 10.0.1.200',
  'subnet-03': '172.16.0.100 - 172.16.0.200',
};

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  subtitle: string;
  [key: string]: unknown;
}

const mockSecurityGroups: SecurityGroupRow[] = [
  {
    id: 'sg-01',
    name: 'default-sg',
    description: '-',
    createdAt: 'Aug 23, 2025 20:06:42',
    subtitle: 'internal-02',
  },
  {
    id: 'sg-02',
    name: 'web-sg',
    description: 'Web server security group',
    createdAt: 'Aug 22, 2025 13:53:25',
    subtitle: 'web-tier',
  },
  {
    id: 'sg-03',
    name: 'db-sg',
    description: 'Database security group',
    createdAt: 'Aug 21, 2025 06:40:08',
    subtitle: 'db-tier',
  },
  {
    id: 'sg-04',
    name: 'app-sg',
    description: 'Application security group',
    createdAt: 'Aug 20, 2025 23:27:51',
    subtitle: 'app-tier',
  },
  {
    id: 'sg-05',
    name: 'internal-sg',
    description: '-',
    createdAt: 'Aug 19, 2025 16:14:34',
    subtitle: 'internal-01',
  },
];

interface FixedIpEntry {
  id: string;
  subnet: string;
  ipMode: 'auto' | 'manual';
  ipAddress: string;
}

const networkFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter network name…' },
];

const sgFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter security group name…' },
];

function networkStatusVariant(s: NetworkRow['status']): StatusVariant {
  if (s === 'muted') return 'shutoff';
  return s;
}

function stripTimeFromCreatedAt(value: string): string {
  return value.replace(/\s+\d{2}:\d{2}:\d{2}$/, '').trim();
}

function newFixedIpRow(): FixedIpEntry {
  return { id: crypto.randomUUID(), subnet: '', ipMode: 'auto', ipAddress: '' };
}

function fixedIpDoneSummary(rows: FixedIpEntry[]): string {
  if (rows.length === 0) return 'Auto-allocate';
  const configured = rows.filter((r) => r.subnet);
  if (configured.length === 0) return 'Auto-allocate';
  if (configured.every((r) => r.ipMode === 'auto')) return 'Auto-allocate';
  return configured
    .map((r) =>
      r.ipMode === 'manual' && r.ipAddress.trim() ? r.ipAddress.trim() : 'Auto-allocate'
    )
    .join(', ');
}

const networkColumns: TableColumn[] = [
  { key: 'status', header: 'Status', width: 60 },
  { key: 'name', header: 'Name' },
  { key: 'external', header: 'External', width: 80 },
  { key: 'shared', header: 'Shared', width: 80 },
  { key: 'subnetCidr', header: 'Subnet CIDR', width: 120 },
];

const sgColumns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'createdAt', header: 'Created at', width: 140 },
];

export function ComputeCreateVirtualAdapterPage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    network: 'default',
    security: 'default',
  });

  const [basicSubmitted, setBasicSubmitted] = useState(false);
  const [adapterName, setAdapterName] = useState('');
  const [description, setDescription] = useState('');

  const [networkTab, setNetworkTab] = useState<'tenant' | 'shared' | 'external'>('tenant');
  const [networkFilters, setNetworkFilters] = useState<FilterKeyWithValue[]>([]);
  const [networkPage, setNetworkPage] = useState(1);
  const [selectedNetworkRows, setSelectedNetworkRows] = useState<(string | number)[]>([]);
  const [networkSubmitted, setNetworkSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [fixedIpRows, setFixedIpRows] = useState<FixedIpEntry[]>([]);
  const [macMode, setMacMode] = useState<'auto' | 'manual'>('auto');
  const [macAddress, setMacAddress] = useState('');

  const [portSecurityEnabled, setPortSecurityEnabled] = useState(true);
  const [sgFilters, setSgFilters] = useState<FilterKeyWithValue[]>([]);
  const [sgPage, setSgPage] = useState(1);
  const [selectedSecurityGroupRows, setSelectedSecurityGroupRows] = useState<(string | number)[]>(
    []
  );

  const adapterNameError =
    basicSubmitted && !adapterName.trim() ? 'Please enter a virtual adapter name.' : null;

  const networksForTab = useMemo(() => {
    if (networkTab === 'tenant') return mockNetworks;
    if (networkTab === 'shared') return mockNetworks.filter((n) => n.shared === 'On');
    return mockNetworks.filter((n) => n.external === 'Yes');
  }, [networkTab]);

  const filteredNetworks = useMemo(() => {
    let list = [...networksForTab];
    for (const f of networkFilters) {
      if (f.key === 'name' && f.value) {
        const q = String(f.value).toLowerCase();
        list = list.filter((n) => n.name.toLowerCase().includes(q));
      }
    }
    return list;
  }, [networksForTab, networkFilters]);

  const paginatedNetworks = useMemo(
    () => filteredNetworks.slice((networkPage - 1) * ITEMS_PER_PAGE, networkPage * ITEMS_PER_PAGE),
    [filteredNetworks, networkPage]
  );

  const selectedNetworkRow = useMemo(
    () => mockNetworks.find((n) => n.id === String(selectedNetworkRows[0])),
    [selectedNetworkRows]
  );

  const filteredSecurityGroups = useMemo(() => {
    let list = [...mockSecurityGroups];
    for (const f of sgFilters) {
      if (f.key === 'name' && f.value) {
        const q = String(f.value).toLowerCase();
        list = list.filter((sg) => sg.name.toLowerCase().includes(q));
      }
    }
    return list;
  }, [sgFilters]);

  const paginatedSecurityGroups = useMemo(
    () => filteredSecurityGroups.slice((sgPage - 1) * ITEMS_PER_PAGE, sgPage * ITEMS_PER_PAGE),
    [filteredSecurityGroups, sgPage]
  );

  const selectionBorder = (err: boolean) =>
    err ? 'border-danger bg-danger-light' : 'border-border bg-surface-muted';

  const validateBasic = useCallback((): boolean => {
    setBasicSubmitted(true);
    return !!adapterName.trim();
  }, [adapterName]);

  const validateNetwork = useCallback((): boolean => {
    setNetworkSubmitted(true);
    if (selectedNetworkRows.length === 0) {
      setNetworkError('Please select a network.');
      return false;
    }
    setNetworkError(null);
    return true;
  }, [selectedNetworkRows.length]);

  const validateSecurity = useCallback(() => true, []);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    []
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      for (const id of STEP_IDS) next[id] = 'success';
      return next;
    });
  }, []);

  const addFixedIp = useCallback(() => {
    setFixedIpRows((prev) => [...prev, newFixedIpRow()]);
  }, []);

  const removeFixedIp = useCallback((id: string) => {
    setFixedIpRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateFixedIp = useCallback((id: string, updates: Partial<FixedIpEntry>) => {
    setFixedIpRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const securityGroupsSummary = useMemo(() => {
    if (!portSecurityEnabled) return 'None';
    if (selectedSecurityGroupRows.length === 0) return 'None';
    return selectedSecurityGroupRows
      .map((id) => mockSecurityGroups.find((sg) => sg.id === String(id))?.name ?? String(id))
      .join(', ');
  }, [portSecurityEnabled, selectedSecurityGroupRows]);

  const networkTabButtons: { id: typeof networkTab; label: string }[] = [
    { id: 'tenant', label: 'Current tenant' },
    { id: 'shared', label: 'Shared' },
    { id: 'external', label: 'External' },
  ];

  return (
    <CreateLayout
      title="Create virtual adapter"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: STEP_IDS.map((id) => ({
                label: STEP_LABELS[id],
                status: stepStatuses[id],
              })),
            },
          ]}
          onCancel={() => navigate('/compute/ports')}
          onAction={() => setConfirmOpen(true)}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="basic"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'basic' as const,
            label: 'Basic information',
            onComplete: validateBasic,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Virtual adapter Name <span className="text-error">*</span>
                    </span>
                    <Input
                      placeholder="Enter name"
                      value={adapterName}
                      onChange={(e) => {
                        setAdapterName(e.target.value);
                        setBasicSubmitted(false);
                      }}
                      error={!!adapterNameError}
                    />
                    {adapterNameError && (
                      <span className="text-11 text-error">{adapterNameError}</span>
                    )}
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_), and the length
                      must be between 2-128 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <Textarea
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_()[]), and
                      maximum 255 characters.
                    </span>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Virtual adapter Name</span>
                  <span className="text-12 text-text">{adapterName || '-'}</span>
                </div>
                {description.trim() ? (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Description</span>
                      <span className="text-12 text-text">{description}</span>
                    </div>
                  </>
                ) : null}
              </div>
            ),
          },
          {
            id: 'network' as const,
            label: 'Network',
            onComplete: validateNetwork,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Owned network <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select the network to which the virtual adaptor will be attached.
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 border-b border-border-muted">
                      {networkTabButtons.map((tab) => {
                        const selected = networkTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setNetworkTab(tab.id);
                              setNetworkPage(1);
                            }}
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-t px-3 py-2 text-12 font-medium transition-colors ${
                              selected
                                ? 'bg-surface-default text-primary shadow-sm'
                                : 'bg-transparent text-text hover:bg-surface-default'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <FilterSearchInput
                      filterKeys={networkFilterKeys}
                      onFilterAdd={(f) => {
                        setNetworkFilters((p) => [...p, f]);
                        setNetworkPage(1);
                      }}
                      selectedFilters={networkFilters}
                      placeholder="Search networks"
                      defaultFilterKey="name"
                    />

                    <Pagination
                      totalCount={filteredNetworks.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={networkPage}
                      onPageChange={setNetworkPage}
                      totalCountLabel="networks"
                      selectedCount={selectedNetworkRows.length}
                    />

                    <SelectableTable<NetworkRow>
                      columns={networkColumns}
                      rows={paginatedNetworks}
                      selectionType="radio"
                      selectedRows={selectedNetworkRows}
                      onRowSelectionChange={(ids) => {
                        setSelectedNetworkRows(ids);
                        setNetworkError(null);
                      }}
                      getRowId={(row) => row.id}
                      radioGroupName="virtual-adapter-network"
                    >
                      {paginatedNetworks.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={networkColumns[0]}>
                            <StatusIndicator
                              variant={networkStatusVariant(row.status)}
                              layout="iconOnly"
                            />
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[1]}>
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                                {row.name}
                                <IconExternalLink size={12} />
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[2]}>
                            {row.external}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[3]}>
                            {row.shared}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[4]}>
                            {row.subnetCidr}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>

                    <div
                      className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                        !!(networkSubmitted && networkError)
                      )}`}
                    >
                      {selectedNetworkRows.length === 0 ? (
                        <span className="text-11 text-text-muted">
                          {networkError ?? 'No network selected'}
                        </span>
                      ) : (
                        selectedNetworkRows.map((nid) => {
                          const n = mockNetworks.find((x) => x.id === String(nid));
                          return (
                            <Tag
                              key={String(nid)}
                              label={n?.name ?? String(nid)}
                              variant="multiSelect"
                              onClose={() => {
                                setSelectedNetworkRows([]);
                                setNetworkError(null);
                              }}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Fixed IP</span>
                      <span className="text-12 text-text-muted">
                        Select a subnet and choose whether to auto-allocate fixed IP or enter one
                        manually.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {fixedIpRows.map((entry) => (
                        <div
                          key={entry.id}
                          className="w-full rounded-md border border-border bg-surface px-4 py-2"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex shrink-0 items-center gap-1.5">
                              <span className="text-13 font-medium text-text">Subnet</span>
                              <Dropdown.Select
                                value={entry.subnet}
                                onChange={(v) =>
                                  updateFixedIp(entry.id, {
                                    subnet: String(v),
                                    ipMode: 'auto',
                                    ipAddress: '',
                                  })
                                }
                                placeholder="Select"
                              >
                                {mockSubnetOptions.map((opt) => (
                                  <Dropdown.Option
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                  />
                                ))}
                              </Dropdown.Select>
                            </div>
                            <Dropdown.Select
                              value={entry.ipMode}
                              onChange={(v) =>
                                updateFixedIp(entry.id, {
                                  ipMode: v as 'auto' | 'manual',
                                  ipAddress: v === 'auto' ? '' : entry.ipAddress,
                                })
                              }
                              disabled={!entry.subnet}
                            >
                              <Dropdown.Option value="auto" label="Auto-allocate" />
                              <Dropdown.Option value="manual" label="Custom" />
                            </Dropdown.Select>
                            {entry.ipMode === 'manual' ? (
                              <Input
                                placeholder="Enter IP address"
                                value={entry.ipAddress}
                                onChange={(e) =>
                                  updateFixedIp(entry.id, { ipAddress: e.target.value })
                                }
                              />
                            ) : null}
                            {entry.subnet && entry.ipMode === 'auto' ? (
                              <span className="shrink-0 text-11 text-text-subtle">
                                {subnetAllocationRanges[entry.subnet]}
                              </span>
                            ) : null}
                            <div className="ml-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => removeFixedIp(entry.id)}
                                className="flex size-5 items-center justify-center rounded transition-colors hover:bg-surface-muted"
                                aria-label="Remove fixed IP row"
                              >
                                <IconX size={14} className="text-text-muted" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="secondary" size="sm" type="button" onClick={addFixedIp}>
                        <span className="inline-flex items-center gap-1.5">
                          <IconCirclePlus size={12} />
                          Add fixed IP
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">MAC address</span>
                      <span className="text-12 text-text-muted">
                        Choose whether to auto-allocate a MAC address or enter one manually.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="va-mac-mode"
                        value="auto"
                        checked={macMode === 'auto'}
                        onChange={() => setMacMode('auto')}
                        label="Auto-allocate"
                      />
                      <RadioButton
                        name="va-mac-mode"
                        value="manual"
                        checked={macMode === 'manual'}
                        onChange={() => setMacMode('manual')}
                        label="Manual"
                      />
                      {macMode === 'manual' ? (
                        <div className="pl-[22px]">
                          <Input
                            placeholder="Enter MAC address (e.g. fa:16:3e:d7:f2:6c)"
                            value={macAddress}
                            onChange={(e) => setMacAddress(e.target.value)}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Network</span>
                  <span className="text-12 text-text">{selectedNetworkRow?.name ?? '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Fixed IP</span>
                  <span className="text-12 text-text">{fixedIpDoneSummary(fixedIpRows)}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">MAC address</span>
                  <span className="text-12 text-text">
                    {macMode === 'auto' ? 'Auto-allocate' : macAddress.trim() || 'Manual'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'security' as const,
            label: 'Security',
            onComplete: validateSecurity,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Port security</span>
                      <span className="text-12 text-text-muted">
                        Indicates whether to enable security features on the port, including
                        security groups.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={portSecurityEnabled}
                        onChange={(e) => setPortSecurityEnabled(e.target.checked)}
                      />
                      <span className="text-12 text-text">
                        {portSecurityEnabled ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>

                {portSecurityEnabled ? (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Security groups</span>
                          <span className="text-12 text-text-muted">
                            Select the security groups to apply to the port.
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <FilterSearchInput
                              filterKeys={sgFilterKeys}
                              onFilterAdd={(f) => {
                                setSgFilters((p) => [...p, f]);
                                setSgPage(1);
                              }}
                              selectedFilters={sgFilters}
                              placeholder="Search security groups"
                              defaultFilterKey="name"
                            />
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-12 font-medium text-text transition-colors hover:bg-surface-subtle"
                          >
                            <IconEdit size={12} />
                            Create a new security group
                          </button>
                        </div>
                        <Pagination
                          totalCount={filteredSecurityGroups.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={sgPage}
                          onPageChange={setSgPage}
                          totalCountLabel="security groups"
                          selectedCount={selectedSecurityGroupRows.length}
                        />
                        <SelectableTable<SecurityGroupRow>
                          columns={sgColumns}
                          rows={paginatedSecurityGroups}
                          selectionType="checkbox"
                          selectedRows={selectedSecurityGroupRows}
                          onRowSelectionChange={setSelectedSecurityGroupRows}
                          getRowId={(row) => row.id}
                        >
                          {paginatedSecurityGroups.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={sgColumns[0]}>
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">{row.subtitle}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={sgColumns[1]}>
                                {row.description}
                              </Table.Td>
                              <Table.Td rowData={row} column={sgColumns[2]}>
                                {stripTimeFromCreatedAt(row.createdAt)}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                            false
                          )}`}
                        >
                          {selectedSecurityGroupRows.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              No security groups selected
                            </span>
                          ) : (
                            selectedSecurityGroupRows.map((sgid) => {
                              const sg = mockSecurityGroups.find((x) => x.id === String(sgid));
                              return (
                                <Tag
                                  key={String(sgid)}
                                  label={sg?.name ?? String(sgid)}
                                  variant="multiSelect"
                                  onClose={() =>
                                    setSelectedSecurityGroupRows(
                                      selectedSecurityGroupRows.filter((x) => x !== sgid)
                                    )
                                  }
                                />
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Port security</span>
                  <span className="text-12 text-text">
                    {portSecurityEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Security groups</span>
                  <span className="text-12 text-text">{securityGroupsSummary}</span>
                </div>
              </div>
            ),
          },
        ]}
      </Stepper>

      {confirmOpen ? (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/compute/ports');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create virtual adapter',
            subtitle: 'This is UI-only. No actual virtual adapter will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      ) : null}
    </CreateLayout>
  );
}
