import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Disclosure } from '@shared/components/Disclosure';
import { Button } from '@shared/components/Button';
import {
  IconCirclePlus,
  IconExternalLink,
  IconTrash,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

const STEP_IDS = ['basic', 'listener', 'pool', 'member', 'health'] as const;

type Provider = 'ovn' | 'amphora';

interface NetworkRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  subnetCidr: string;
  external: string;
  shared: string;
  [key: string]: unknown;
}

interface SubnetOption {
  id: string;
  name: string;
  cidr: string;
  networkId: string;
}

interface PortRow {
  id: string;
  name: string;
  attachedInstance: string | null;
  attachedInstanceId: string | null;
  ipAddresses: string[];
  [key: string]: unknown;
}

interface AllocatedMember {
  id: string;
  portId: string;
  portName: string;
  ipAddress: string;
  instanceName: string | null;
  weight: number;
  [key: string]: unknown;
}

interface ExternalMemberRow {
  id: string;
  ipAddress: string;
  port: number;
  weight: number;
}

const mockNetworks: NetworkRow[] = [
  {
    id: '29tgj234',
    name: 'net-01',
    status: 'active',
    subnetCidr: '10.0.0.0/24',
    external: 'Yes',
    shared: 'On',
  },
  {
    id: '38rhk345',
    name: 'net-02',
    status: 'active',
    subnetCidr: '10.0.1.0/24',
    external: 'Yes',
    shared: 'On',
  },
  {
    id: '47sil456',
    name: 'net-03',
    status: 'active',
    subnetCidr: '10.0.2.0/24',
    external: 'No',
    shared: 'Off',
  },
  {
    id: '56tjm567',
    name: 'net-04',
    status: 'error',
    subnetCidr: '10.0.3.0/24',
    external: 'No',
    shared: 'Off',
  },
  {
    id: '65ukn678',
    name: 'net-05',
    status: 'active',
    subnetCidr: '10.0.4.0/24',
    external: 'Yes',
    shared: 'On',
  },
  {
    id: '74vlo789',
    name: 'net-06',
    status: 'building',
    subnetCidr: '10.0.5.0/24',
    external: 'No',
    shared: 'On',
  },
];

const mockSubnets: SubnetOption[] = [
  { id: 'sub-01', name: 'subnet-a', cidr: '10.0.0.0/24', networkId: '29tgj234' },
  { id: 'sub-02', name: 'subnet-b', cidr: '10.0.0.128/25', networkId: '29tgj234' },
  { id: 'sub-03', name: 'subnet-front', cidr: '10.0.1.0/24', networkId: '38rhk345' },
  { id: 'sub-04', name: 'subnet-db', cidr: '10.0.2.0/26', networkId: '47sil456' },
  { id: 'sub-05', name: 'subnet-edge', cidr: '10.0.4.0/24', networkId: '65ukn678' },
  { id: 'sub-06', name: 'subnet-staging', cidr: '10.0.5.0/25', networkId: '74vlo789' },
  { id: 'sub-07', name: 'svc-subnet', cidr: '172.16.0.0/20', networkId: '38rhk345' },
];

const mockPorts: PortRow[] = [
  {
    id: '45ghj567',
    name: 'port-web-01',
    attachedInstance: 'instance-web',
    attachedInstanceId: 'i-45ghj567',
    ipAddresses: ['10.63.0.47', '10.63.0.48'],
  },
  {
    id: '56hik678',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: ['10.63.0.50', '10.63.0.51'],
  },
  {
    id: '67ijl789',
    name: 'port-api',
    attachedInstance: 'api-srv',
    attachedInstanceId: 'i-67ijl789',
    ipAddresses: ['10.63.0.52'],
  },
  {
    id: '78jkm890',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: ['10.63.0.53'],
  },
  {
    id: '89kln901',
    name: 'port-cache',
    attachedInstance: 'cache-01',
    attachedInstanceId: 'i-89kln901',
    ipAddresses: ['10.63.0.54', '10.63.0.55'],
  },
  {
    id: '90lmo012',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: [],
  },
];

const networkFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter network name...' },
];

const portFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter port name...' },
];

const ALGORITHM_OPTIONS = [
  { value: 'ROUND_ROBIN', label: 'Round robin' },
  { value: 'LEAST_CONNECTIONS', label: 'Least connections' },
  { value: 'SOURCE_IP', label: 'Source IP' },
  { value: 'WEIGHTED_ROUND_ROBIN', label: 'Weighted round robin' },
] as const;

const ALGORITHM_HELPERS: Record<string, string> = {
  ROUND_ROBIN: 'Distributes new connections evenly across all healthy members in rotation.',
  LEAST_CONNECTIONS: 'Sends traffic to the member with the fewest active connections.',
  SOURCE_IP: 'Maps each client IP to a consistent backend member (session affinity by IP).',
  WEIGHTED_ROUND_ROBIN: 'Rotates through members respecting their relative weights.',
};

function networkStatusVariant(s: NetworkRow['status']): StatusVariant {
  if (s === 'muted') return 'shutoff';
  return s;
}

function newExternalRow(): ExternalMemberRow {
  return { id: crypto.randomUUID(), ipAddress: '', port: 80, weight: 1 };
}

export function ComputeCreateLoadBalancerPage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [basicAttempted, setBasicAttempted] = useState(false);
  const [listenerAttempted, setListenerAttempted] = useState(false);
  const [poolAttempted, setPoolAttempted] = useState(false);
  const [healthAttempted, setHealthAttempted] = useState(false);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    listener: 'default',
    pool: 'default',
    member: 'default',
    health: 'default',
  });

  // Basic
  const [lbName, setLbName] = useState('');
  const [lbDescription, setLbDescription] = useState('');
  const [provider, setProvider] = useState<Provider>('amphora');
  const [selectedNetworks, setSelectedNetworks] = useState<(string | number)[]>([]);
  const [networkFilters, setNetworkFilters] = useState<FilterKeyWithValue[]>([]);
  const [networkPage, setNetworkPage] = useState(1);
  const [vipSubnet, setVipSubnet] = useState('');
  const [vipAddress, setVipAddress] = useState('');
  const [lbAdminUp, setLbAdminUp] = useState(true);

  // Listener
  const [listenerName, setListenerName] = useState('listener-http-80');
  const [listenerDescription, setListenerDescription] = useState('');
  const [listenerProtocol, setListenerProtocol] = useState('HTTP');
  const [protocolPort, setProtocolPort] = useState(80);
  const [connectionLimitType, setConnectionLimitType] = useState<'unlimited' | 'limited'>(
    'unlimited'
  );
  const [connectionLimitValue, setConnectionLimitValue] = useState<number | undefined>(1000);
  const [listenerAdminUp, setListenerAdminUp] = useState(true);
  const [listenerAdvancedOpen, setListenerAdvancedOpen] = useState(false);
  const [xForwardedFor, setXForwardedFor] = useState(false);
  const [xForwardedPort, setXForwardedPort] = useState(false);
  const [clientDataTimeout, setClientDataTimeout] = useState(50000);
  const [memberConnectTimeout, setMemberConnectTimeout] = useState(5000);
  const [memberDataTimeout, setMemberDataTimeout] = useState(5000);
  const [tcpInspectTimeout, setTcpInspectTimeout] = useState(0);
  const [allowedCidrs, setAllowedCidrs] = useState<string[]>(['']);

  // Pool
  const [createPool, setCreatePool] = useState(true);
  const [poolName, setPoolName] = useState('pool-http');
  const [poolDescription, setPoolDescription] = useState('');
  const [poolAlgorithm, setPoolAlgorithm] = useState('ROUND_ROBIN');
  const [poolProtocol, setPoolProtocol] = useState('HTTP');
  const [sessionPersistence, setSessionPersistence] = useState(false);
  const [poolAdminUp, setPoolAdminUp] = useState(true);

  // Member
  const [portIpSelections, setPortIpSelections] = useState<Record<string, string>>({});
  const [portFilters, setPortFilters] = useState<FilterKeyWithValue[]>([]);
  const [portPage, setPortPage] = useState(1);
  const [allocatedMembers, setAllocatedMembers] = useState<AllocatedMember[]>([
    {
      id: 'member-1',
      portId: '45ghj567',
      portName: 'port-web-01',
      ipAddress: '10.63.0.47',
      instanceName: 'instance-web',
      weight: 1,
    },
    {
      id: 'member-2',
      portId: '67ijl789',
      portName: 'port-api',
      ipAddress: '10.63.0.52',
      instanceName: 'api-srv',
      weight: 1,
    },
  ]);
  const [externalMembers, setExternalMembers] = useState<ExternalMemberRow[]>([newExternalRow()]);

  // Health monitor
  const [createHealthMonitor, setCreateHealthMonitor] = useState(true);
  const [healthName, setHealthName] = useState('hm-pool-http');
  const [healthType, setHealthType] = useState('HTTP');
  const [healthInterval, setHealthInterval] = useState(5);
  const [healthTimeout, setHealthTimeout] = useState(3);
  const [healthMaxRetries, setHealthMaxRetries] = useState(3);
  const [healthAdminUp, setHealthAdminUp] = useState(true);

  const itemsPerPage = 5;

  const listenerProtocolOptions = useMemo(() => {
    if (provider === 'ovn') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'UDP', label: 'UDP' },
      ];
    }
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TERMINATED_HTTPS', label: 'Terminated HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'UDP', label: 'UDP' },
    ];
  }, [provider]);

  const poolProtocolOptions = useMemo(() => {
    if (provider === 'ovn') {
      if (listenerProtocol === 'UDP') return [{ value: 'UDP', label: 'UDP' }];
      return [{ value: 'TCP', label: 'TCP' }];
    }
    if (listenerProtocol === 'HTTP') return [{ value: 'HTTP', label: 'HTTP' }];
    if (listenerProtocol === 'HTTPS') {
      return [
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'TCP', label: 'TCP' },
      ];
    }
    if (listenerProtocol === 'TERMINATED_HTTPS') return [{ value: 'HTTP', label: 'HTTP' }];
    if (listenerProtocol === 'TCP') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
      ];
    }
    if (listenerProtocol === 'UDP') return [{ value: 'UDP', label: 'UDP' }];
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'UDP', label: 'UDP' },
    ];
  }, [provider, listenerProtocol]);

  const healthTypeOptions = useMemo(() => {
    if (provider === 'ovn') {
      if (listenerProtocol === 'UDP') {
        return [
          { value: 'TCP', label: 'TCP' },
          { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        ];
      }
      return [{ value: 'TCP', label: 'TCP' }];
    }
    if (listenerProtocol === 'HTTP' || listenerProtocol === 'TERMINATED_HTTPS') {
      return [
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'PING', label: 'PING' },
        { value: 'TCP', label: 'TCP' },
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'HTTPS') {
      return [
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'TCP', label: 'TCP' },
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'TCP') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'PING', label: 'PING' },
      ];
    }
    if (listenerProtocol === 'UDP') {
      return [
        { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'TCP', label: 'TCP' },
      ];
    }
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'PING', label: 'PING' },
      { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
    ];
  }, [provider, listenerProtocol]);

  useEffect(() => {
    const allowed = poolProtocolOptions.map((o) => o.value);
    if (allowed.length && !allowed.includes(poolProtocol)) {
      setPoolProtocol(allowed[0]);
    }
  }, [poolProtocolOptions, poolProtocol]);

  useEffect(() => {
    const allowed = healthTypeOptions.map((o) => o.value);
    if (allowed.length && !allowed.includes(healthType)) {
      setHealthType(allowed[0]);
    }
  }, [healthTypeOptions, healthType]);

  useEffect(() => {
    if (!listenerProtocol) return;
    switch (listenerProtocol) {
      case 'HTTP':
        setProtocolPort(80);
        setPoolProtocol('HTTP');
        setHealthType('HTTP');
        break;
      case 'HTTPS':
        setProtocolPort(443);
        setPoolProtocol('HTTPS');
        setHealthType('HTTPS');
        break;
      case 'TERMINATED_HTTPS':
        setProtocolPort(443);
        setPoolProtocol('HTTP');
        setHealthType('HTTP');
        break;
      case 'TCP':
        setProtocolPort(5000);
        setPoolProtocol(provider === 'ovn' ? 'TCP' : 'TCP');
        setHealthType('TCP');
        break;
      case 'UDP':
        setProtocolPort(53);
        setPoolProtocol('UDP');
        setHealthType(provider === 'ovn' ? 'UDP-CONNECT' : 'UDP-CONNECT');
        break;
      default:
        break;
    }
  }, [listenerProtocol, provider]);

  const filteredNetworks = useMemo(() => {
    if (networkFilters.length === 0) return mockNetworks;
    return mockNetworks.filter((n) =>
      networkFilters.every((f) => {
        const val = String(n[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [networkFilters]);

  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * itemsPerPage,
    networkPage * itemsPerPage
  );

  const subnetChoices = useMemo(() => {
    const set = new Set(selectedNetworks.map(String));
    if (set.size === 0) return [];
    return mockSubnets.filter((s) => set.has(s.networkId));
  }, [selectedNetworks]);

  useEffect(() => {
    if (vipSubnet && !subnetChoices.some((s) => s.id === vipSubnet)) {
      setVipSubnet('');
    }
  }, [subnetChoices, vipSubnet]);

  const filteredPorts = useMemo(() => {
    if (portFilters.length === 0) return mockPorts;
    return mockPorts.filter((p) =>
      portFilters.every((f) => {
        const val = String(p[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [portFilters]);

  const paginatedPorts = filteredPorts.slice(
    (portPage - 1) * itemsPerPage,
    portPage * itemsPerPage
  );

  const handleNetworkFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setNetworkFilters((prev) => [...prev, filter]);
    setNetworkPage(1);
  }, []);

  const handlePortFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setPortFilters((prev) => [...prev, filter]);
    setPortPage(1);
  }, []);

  const handleProviderChange = useCallback(
    (p: Provider) => {
      setProvider(p);
      setBasicAttempted(false);
      if (p === 'ovn' && listenerProtocol && !['TCP', 'UDP'].includes(listenerProtocol)) {
        setListenerProtocol('TCP');
      }
    },
    [listenerProtocol]
  );

  const handleListenerProtocolSelect = useCallback((v: string) => {
    setListenerProtocol(v);
    setListenerAttempted(false);
  }, []);

  const lbNameError =
    basicAttempted && !lbName.trim() ? 'Please enter a load balancer name.' : null;
  const networkError =
    basicAttempted && selectedNetworks.length === 0 ? 'Select at least one owned network.' : null;
  const subnetError = basicAttempted && !vipSubnet ? 'Please select a VIP subnet.' : null;

  const listenerNameError =
    listenerAttempted && !listenerName.trim() ? 'Please enter a listener name.' : null;
  const listenerProtocolError =
    listenerAttempted && !listenerProtocol ? 'Please select a protocol.' : null;
  const protocolPortError =
    listenerAttempted && (!protocolPort || protocolPort < 1 || protocolPort > 65535)
      ? 'Enter a valid protocol port (1–65535).'
      : null;
  const connectionLimitError =
    listenerAttempted &&
    connectionLimitType === 'limited' &&
    (connectionLimitValue === undefined || connectionLimitValue < 1)
      ? 'Enter a connection limit of at least 1.'
      : null;

  const poolNameError =
    poolAttempted && createPool && !poolName.trim() ? 'Please enter a pool name.' : null;

  const healthNameError =
    healthAttempted && createHealthMonitor && !healthName.trim()
      ? 'Please enter a health monitor name.'
      : null;

  const validateBasic = useCallback((): boolean => {
    setBasicAttempted(true);
    return !!lbName.trim() && selectedNetworks.length > 0 && !!vipSubnet;
  }, [lbName, selectedNetworks.length, vipSubnet]);

  const validateListener = useCallback((): boolean => {
    setListenerAttempted(true);
    if (!listenerName.trim()) return false;
    if (!listenerProtocol) return false;
    if (!protocolPort || protocolPort < 1 || protocolPort > 65535) return false;
    if (
      connectionLimitType === 'limited' &&
      (connectionLimitValue === undefined || connectionLimitValue < 1)
    ) {
      return false;
    }
    return true;
  }, [listenerName, listenerProtocol, protocolPort, connectionLimitType, connectionLimitValue]);

  const validatePool = useCallback((): boolean => {
    setPoolAttempted(true);
    if (!createPool) return true;
    return !!poolName.trim();
  }, [createPool, poolName]);

  const validateMember = useCallback((): boolean => {
    return true;
  }, []);

  const validateHealth = useCallback((): boolean => {
    setHealthAttempted(true);
    if (!createHealthMonitor) return true;
    return !!healthName.trim();
  }, [createHealthMonitor, healthName]);

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

  const networkColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 56 },
      { key: 'name', header: 'Name' },
      { key: 'subnetCidr', header: 'Subnet CIDR', width: 140 },
      { key: 'external', header: 'External', width: 88 },
      { key: 'shared', header: 'Shared', width: 72 },
    ],
    []
  );

  const portColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name' },
      { key: 'attachedInstance', header: 'Attached instance', width: 160 },
      { key: 'ipAddresses', header: 'IP address', width: 160 },
      { key: 'action', header: 'Action', width: 140 },
    ],
    []
  );

  const allocatedColumns: TableColumn[] = useMemo(
    () => [
      { key: 'ipAddress', header: 'IP address', width: 140 },
      { key: 'portName', header: 'Port', width: 160 },
      { key: 'instanceName', header: 'Instance', width: 140 },
      { key: 'weight', header: 'Weight', width: 80 },
      { key: 'actions', header: 'Actions', width: 72 },
    ],
    []
  );

  const selectedSubnetLabel =
    mockSubnets.find((s) => s.id === vipSubnet)?.name ?? (vipSubnet ? vipSubnet : undefined);

  const networkSelectionError = basicAttempted && networkError;
  const algorithmHelper = ALGORITHM_HELPERS[poolAlgorithm] ?? '';

  const addMemberFromPort = useCallback(
    (row: PortRow) => {
      const selectedIp = portIpSelections[row.id] ?? row.ipAddresses[0];
      if (
        !selectedIp ||
        allocatedMembers.some((m) => m.portId === row.id && m.ipAddress === selectedIp)
      ) {
        return;
      }
      setAllocatedMembers((prev) => [
        ...prev,
        {
          id: `member-${crypto.randomUUID()}`,
          portId: row.id,
          portName: row.name,
          ipAddress: selectedIp,
          instanceName: row.attachedInstance,
          weight: 1,
        },
      ]);
    },
    [portIpSelections, allocatedMembers]
  );

  const addExternalMembersFromGrid = useCallback(() => {
    const valid = externalMembers.filter(
      (r) => r.ipAddress.trim() && r.port >= 1 && r.port <= 65535
    );
    if (valid.length === 0) return;
    setAllocatedMembers((prev) => [
      ...prev,
      ...valid.map((r) => ({
        id: `ext-${crypto.randomUUID()}`,
        portId: 'external',
        portName: `TCP/${r.port}`,
        ipAddress: r.ipAddress.trim(),
        instanceName: null,
        weight: r.weight,
      })),
    ]);
    setExternalMembers([newExternalRow()]);
  }, [externalMembers]);

  return (
    <CreateLayout
      title="Create load balancer"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Listener', status: stepStatuses.listener },
                { label: 'Pool', status: stepStatuses.pool },
                { label: 'Member', status: stepStatuses.member },
                { label: 'Health monitor', status: stepStatuses.health },
              ],
            },
          ]}
          onCancel={() => navigate('/compute/load-balancers')}
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
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Load balancer name <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        A unique name for this load balancer in the project.
                      </span>
                    </div>
                    <Input
                      placeholder="Enter load balancer name"
                      value={lbName}
                      onChange={(e) => {
                        setLbName(e.target.value);
                        setBasicAttempted(false);
                      }}
                      error={!!lbNameError}
                    />
                    {lbNameError && <span className="text-11 text-error">{lbNameError}</span>}
                    <span className="text-11 text-text-subtle">
                      2–128 characters; letters, numbers, and + = , . @ - _ allowed.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Description</span>
                      <span className="text-12 text-text-muted">Optional. Shown in listings.</span>
                    </div>
                    <Textarea
                      placeholder="Enter description"
                      value={lbDescription}
                      onChange={(e) => setLbDescription(e.target.value)}
                      rows={3}
                    />
                    <span className="text-11 text-text-subtle">Maximum 255 characters.</span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Provider <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        OVN uses lightweight L3/L4; Amphora supports advanced L7 features.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="lb-provider"
                        value="ovn"
                        label="OVN"
                        checked={provider === 'ovn'}
                        onChange={() => handleProviderChange('ovn')}
                      />
                      <RadioButton
                        name="lb-provider"
                        value="amphora"
                        label="Amphora"
                        checked={provider === 'amphora'}
                        onChange={() => handleProviderChange('amphora')}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Owned network <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Choose one or more networks the VIP may attach to.
                      </span>
                    </div>

                    <FilterSearchInput
                      filterKeys={networkFilterKeys}
                      onFilterAdd={handleNetworkFilterAdd}
                      selectedFilters={networkFilters}
                      placeholder="Search networks"
                      defaultFilterKey="name"
                    />

                    <Pagination
                      totalCount={filteredNetworks.length}
                      size={itemsPerPage}
                      currentAt={networkPage}
                      onPageChange={setNetworkPage}
                      totalCountLabel="networks"
                      selectedCount={selectedNetworks.length}
                    />

                    <SelectableTable<NetworkRow>
                      columns={networkColumns}
                      rows={paginatedNetworks}
                      selectionType="checkbox"
                      selectedRows={selectedNetworks}
                      onRowSelectionChange={(ids) => {
                        setSelectedNetworks(ids);
                        setBasicAttempted(false);
                      }}
                      getRowId={(row) => row.id}
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
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                {row.name}
                                <IconExternalLink size={12} />
                                {row.status === 'error' && (
                                  <IconAlertCircle size={14} className="text-error" />
                                )}
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[2]}>
                            {row.subnetCidr}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[3]}>
                            {row.external}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[4]}>
                            {row.shared}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>

                    <div
                      className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${
                        networkSelectionError
                          ? 'border-danger bg-danger-light'
                          : 'border-border bg-surface-muted'
                      }`}
                    >
                      {selectedNetworks.length === 0 ? (
                        <span className="text-11 text-text-muted">
                          {networkError || 'No networks selected'}
                        </span>
                      ) : (
                        selectedNetworks.map((nid) => {
                          const n = mockNetworks.find((x) => x.id === String(nid));
                          return (
                            <Tag
                              key={String(nid)}
                              label={n?.name ?? String(nid)}
                              variant="multiSelect"
                              onClose={() =>
                                setSelectedNetworks(selectedNetworks.filter((id) => id !== nid))
                              }
                            />
                          );
                        })
                      )}
                    </div>
                    {networkSelectionError && selectedNetworks.length > 0 && (
                      <span className="text-11 text-error">{networkError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        VIP subnet <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Must belong to one of the selected networks.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={vipSubnet}
                      onChange={(v) => {
                        setVipSubnet(String(v));
                        setBasicAttempted(false);
                      }}
                      placeholder={
                        selectedNetworks.length === 0
                          ? 'Select networks first'
                          : 'Select VIP subnet'
                      }
                      disabled={selectedNetworks.length === 0 || subnetChoices.length === 0}
                    >
                      {subnetChoices.map((s) => (
                        <Dropdown.Option key={s.id} value={s.id} label={`${s.name} (${s.cidr})`} />
                      ))}
                    </Dropdown.Select>
                    {subnetError && <span className="text-11 text-error">{subnetError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">VIP address</span>
                      <span className="text-12 text-text-muted">
                        Leave empty to allocate automatically from the subnet.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. 10.0.0.50"
                      value={vipAddress}
                      onChange={(e) => setVipAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Admin state</span>
                      <span className="text-12 text-text-muted">
                        When down, the load balancer stops accepting new connections.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={lbAdminUp}
                        onChange={(e) => setLbAdminUp(e.target.checked)}
                      />
                      <span className="text-12 text-text">{lbAdminUp ? 'Up' : 'Down'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Name</span>
                  <span className="text-12 text-text">{lbName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Provider</span>
                  <span className="text-12 text-text">
                    {provider === 'ovn' ? 'OVN' : 'Amphora'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Networks</span>
                  <span className="text-12 text-text">
                    {selectedNetworks.length
                      ? selectedNetworks
                          .map((id) => mockNetworks.find((n) => n.id === String(id))?.name ?? id)
                          .join(', ')
                      : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">VIP subnet</span>
                  <span className="text-12 text-text">
                    {selectedSubnetLabel
                      ? `${selectedSubnetLabel} (${mockSubnets.find((s) => s.id === vipSubnet)?.cidr ?? ''})`
                      : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">VIP address</span>
                  <span className="text-12 text-text">{vipAddress.trim() || 'Auto'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Admin state</span>
                  <span className="text-12 text-text">{lbAdminUp ? 'Up' : 'Down'}</span>
                </div>
                {lbDescription.trim() && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Description</span>
                      <span className="text-12 text-text">{lbDescription}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'listener' as const,
            label: 'Listener',
            onComplete: validateListener,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Listener name <span className="text-error">*</span>
                      </span>
                    </div>
                    <Input
                      placeholder="Enter listener name"
                      value={listenerName}
                      onChange={(e) => {
                        setListenerName(e.target.value);
                        setListenerAttempted(false);
                      }}
                      error={!!listenerNameError}
                    />
                    {listenerNameError && (
                      <span className="text-11 text-error">{listenerNameError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <Textarea
                      placeholder="Optional description"
                      value={listenerDescription}
                      onChange={(e) => setListenerDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Protocol <span className="text-error">*</span>
                      </span>
                    </div>
                    <Dropdown.Select
                      value={listenerProtocol}
                      onChange={(v) => handleListenerProtocolSelect(String(v))}
                      placeholder="Select protocol"
                    >
                      {listenerProtocolOptions.map((opt) => (
                        <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </Dropdown.Select>
                    {listenerProtocolError && (
                      <span className="text-11 text-error">{listenerProtocolError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Protocol port <span className="text-error">*</span>
                      </span>
                    </div>
                    <NumberInput
                      min={1}
                      max={65535}
                      step={1}
                      value={protocolPort}
                      onChange={(v) => {
                        setProtocolPort(v);
                        setListenerAttempted(false);
                      }}
                    />
                    {protocolPortError && (
                      <span className="text-11 text-error">{protocolPortError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Connection limit</span>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="lb-conn-limit"
                        value="unlimited"
                        label="Unlimited"
                        checked={connectionLimitType === 'unlimited'}
                        onChange={() => {
                          setConnectionLimitType('unlimited');
                          setListenerAttempted(false);
                        }}
                      />
                      <RadioButton
                        name="lb-conn-limit"
                        value="limited"
                        label="Limited"
                        checked={connectionLimitType === 'limited'}
                        onChange={() => {
                          setConnectionLimitType('limited');
                          setListenerAttempted(false);
                        }}
                      />
                    </div>
                    {connectionLimitType === 'limited' && (
                      <NumberInput
                        min={1}
                        max={1000000}
                        step={1}
                        value={connectionLimitValue ?? 1}
                        onChange={(v) => {
                          setConnectionLimitValue(v);
                          setListenerAttempted(false);
                        }}
                      />
                    )}
                    {connectionLimitError && (
                      <span className="text-11 text-error">{connectionLimitError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Listener admin state</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={listenerAdminUp}
                        onChange={(e) => setListenerAdminUp(e.target.checked)}
                      />
                      <span className="text-12 text-text">{listenerAdminUp ? 'Up' : 'Down'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <Disclosure
                    label="Advanced"
                    expanded={listenerAdvancedOpen}
                    onExpandChange={setListenerAdvancedOpen}
                  >
                    <div className="flex flex-col gap-6 pt-4">
                      <div className="flex flex-col gap-3">
                        <span className="text-13 font-medium text-text">Insert headers</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Toggle
                              checked={xForwardedFor}
                              onChange={(e) => setXForwardedFor(e.target.checked)}
                            />
                            <span className="text-12 text-text">X-Forwarded-For</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Toggle
                              checked={xForwardedPort}
                              onChange={(e) => setXForwardedPort(e.target.checked)}
                            />
                            <span className="text-12 text-text">X-Forwarded-Port</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">Timeouts (ms)</span>
                        <div className="grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text-muted">Client data</span>
                            <NumberInput
                              min={0}
                              max={600000}
                              step={1000}
                              value={clientDataTimeout}
                              onChange={setClientDataTimeout}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text-muted">
                              Member connect
                            </span>
                            <NumberInput
                              min={0}
                              max={600000}
                              step={500}
                              value={memberConnectTimeout}
                              onChange={setMemberConnectTimeout}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text-muted">Member data</span>
                            <NumberInput
                              min={0}
                              max={600000}
                              step={500}
                              value={memberDataTimeout}
                              onChange={setMemberDataTimeout}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text-muted">TCP inspect</span>
                            <NumberInput
                              min={0}
                              max={600000}
                              step={100}
                              value={tcpInspectTimeout}
                              onChange={setTcpInspectTimeout}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Allowed CIDRs</span>
                          <span className="text-12 text-text-muted">
                            Restrict listener access; leave blank rows to skip.
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {allowedCidrs.map((cidr, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Input
                                placeholder="0.0.0.0/0"
                                value={cidr}
                                onChange={(e) => {
                                  const next = [...allowedCidrs];
                                  next[idx] = e.target.value;
                                  setAllowedCidrs(next);
                                }}
                              />
                              <button
                                type="button"
                                aria-label="Remove CIDR"
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover"
                                onClick={() =>
                                  setAllowedCidrs(allowedCidrs.filter((_, i) => i !== idx))
                                }
                              >
                                <IconX size={14} />
                              </button>
                            </div>
                          ))}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAllowedCidrs([...allowedCidrs, ''])}
                          >
                            <IconCirclePlus size={12} />
                            Add CIDR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Disclosure>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Listener name</span>
                  <span className="text-12 text-text">{listenerName}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Protocol / port</span>
                  <span className="text-12 text-text">
                    {listenerProtocol || '-'} / {protocolPort}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Connection limit</span>
                  <span className="text-12 text-text">
                    {connectionLimitType === 'unlimited'
                      ? 'Unlimited'
                      : String(connectionLimitValue ?? '-')}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Admin state</span>
                  <span className="text-12 text-text">{listenerAdminUp ? 'Up' : 'Down'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Advanced</span>
                  <span className="text-12 text-text">
                    XFF {xForwardedFor ? 'on' : 'off'}, XFP {xForwardedPort ? 'on' : 'off'} · Client{' '}
                    {clientDataTimeout}ms / Member {memberConnectTimeout}ms / Data{' '}
                    {memberDataTimeout}ms / TCP inspect {tcpInspectTimeout}ms
                  </span>
                </div>
                {allowedCidrs.some((c) => c.trim()) && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Allowed CIDRs</span>
                      <span className="text-12 text-text">
                        {allowedCidrs.filter((c) => c.trim()).join(', ')}
                      </span>
                    </div>
                  </>
                )}
                {listenerDescription.trim() && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Description</span>
                      <span className="text-12 text-text">{listenerDescription}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'pool' as const,
            label: 'Pool',
            onComplete: validatePool,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Create pool</span>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={createPool}
                        onChange={(e) => {
                          setCreatePool(e.target.checked);
                          setPoolAttempted(false);
                        }}
                      />
                      <span className="text-12 text-text">{createPool ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {createPool && (
                  <>
                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">
                          Pool name <span className="text-error">*</span>
                        </span>
                        <Input
                          placeholder="Enter pool name"
                          value={poolName}
                          onChange={(e) => {
                            setPoolName(e.target.value);
                            setPoolAttempted(false);
                          }}
                          error={!!poolNameError}
                        />
                        {poolNameError && (
                          <span className="text-11 text-error">{poolNameError}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">Description</span>
                        <Textarea
                          placeholder="Optional pool description"
                          value={poolDescription}
                          onChange={(e) => setPoolDescription(e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">Algorithm</span>
                        <Dropdown.Select
                          value={poolAlgorithm}
                          onChange={(v) => setPoolAlgorithm(String(v))}
                        >
                          {ALGORITHM_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                        {algorithmHelper && (
                          <span className="text-11 text-text-subtle">{algorithmHelper}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Pool protocol</span>
                          <span className="text-12 text-text-muted">
                            Allowed values depend on the listener protocol and provider.
                          </span>
                        </div>
                        <Dropdown.Select
                          value={poolProtocol}
                          onChange={(v) => setPoolProtocol(String(v))}
                        >
                          {poolProtocolOptions.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Session persistence</span>
                          <span className="text-12 text-text-muted">
                            When enabled, compatible algorithms keep clients on the same member.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={sessionPersistence}
                            onChange={(e) => setSessionPersistence(e.target.checked)}
                          />
                          <span className="text-12 text-text">
                            {sessionPersistence ? 'On' : 'Off'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <span className="text-13 font-medium text-text">Pool admin state</span>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={poolAdminUp}
                            onChange={(e) => setPoolAdminUp(e.target.checked)}
                          />
                          <span className="text-12 text-text">{poolAdminUp ? 'Up' : 'Down'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                {!createPool ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Pool</span>
                    <span className="text-12 text-text">Skipped — no pool will be created</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Pool name</span>
                      <span className="text-12 text-text">{poolName}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Algorithm</span>
                      <span className="text-12 text-text">
                        {ALGORITHM_OPTIONS.find((o) => o.value === poolAlgorithm)?.label ??
                          poolAlgorithm}
                      </span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Protocol</span>
                      <span className="text-12 text-text">{poolProtocol}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">
                        Session persistence
                      </span>
                      <span className="text-12 text-text">{sessionPersistence ? 'On' : 'Off'}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Admin state</span>
                      <span className="text-12 text-text">{poolAdminUp ? 'Up' : 'Down'}</span>
                    </div>
                    {poolDescription.trim() && (
                      <>
                        <div className="h-px w-full bg-border-muted" />
                        <div className="flex flex-col gap-1.5">
                          <span className="text-11 font-medium text-text-muted">Description</span>
                          <span className="text-12 text-text">{poolDescription}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'member' as const,
            label: 'Member',
            onComplete: validateMember,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Ports</span>
                      <span className="text-12 text-text-muted">
                        Pick an IP per port and add members to the pool.
                      </span>
                    </div>

                    <FilterSearchInput
                      filterKeys={portFilterKeys}
                      onFilterAdd={handlePortFilterAdd}
                      selectedFilters={portFilters}
                      placeholder="Search ports"
                      defaultFilterKey="name"
                    />

                    <Pagination
                      totalCount={filteredPorts.length}
                      size={itemsPerPage}
                      currentAt={portPage}
                      onPageChange={setPortPage}
                      totalCountLabel="ports"
                    />

                    <Table columns={portColumns} rows={paginatedPorts}>
                      {paginatedPorts.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={portColumns[0]}>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                {row.name}
                                <IconExternalLink size={12} />
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={portColumns[1]}>
                            {row.attachedInstance ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                  {row.attachedInstance}
                                  <IconExternalLink size={12} />
                                </span>
                                <span className="text-11 text-text-subtle">
                                  ID: {row.attachedInstanceId}
                                </span>
                              </div>
                            ) : (
                              <span className="text-12 text-text">-</span>
                            )}
                          </Table.Td>
                          <Table.Td rowData={row} column={portColumns[2]}>
                            {row.ipAddresses.length > 0 ? (
                              <Dropdown.Select
                                value={portIpSelections[row.id] ?? row.ipAddresses[0]}
                                onChange={(v) =>
                                  setPortIpSelections((prev) => ({
                                    ...prev,
                                    [row.id]: String(v),
                                  }))
                                }
                              >
                                {row.ipAddresses.map((ip) => (
                                  <Dropdown.Option key={ip} value={ip} label={ip} />
                                ))}
                              </Dropdown.Select>
                            ) : (
                              <span className="text-12 text-text-muted">No IP</span>
                            )}
                          </Table.Td>
                          <Table.Td rowData={row} column={portColumns[3]} preventClickPropagation>
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={row.ipAddresses.length === 0}
                              onClick={() => addMemberFromPort(row)}
                            >
                              <IconCirclePlus size={12} />
                              Add member
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Allocated members</span>
                    <Table columns={allocatedColumns} rows={allocatedMembers}>
                      {allocatedMembers.map((m) => (
                        <Table.Tr key={m.id} rowData={m}>
                          <Table.Td rowData={m} column={allocatedColumns[0]}>
                            {m.ipAddress}
                          </Table.Td>
                          <Table.Td rowData={m} column={allocatedColumns[1]}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-primary font-medium">{m.portName}</span>
                              <span className="text-11 text-text-subtle">ID: {m.portId}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={m} column={allocatedColumns[2]}>
                            {m.instanceName ?? '-'}
                          </Table.Td>
                          <Table.Td rowData={m} column={allocatedColumns[3]}>
                            {m.weight}
                          </Table.Td>
                          <Table.Td
                            rowData={m}
                            column={allocatedColumns[4]}
                            preventClickPropagation
                          >
                            <button
                              type="button"
                              aria-label="Remove member"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover"
                              onClick={() =>
                                setAllocatedMembers((prev) => prev.filter((x) => x.id !== m.id))
                              }
                            >
                              <IconTrash size={14} />
                            </button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">External members</span>
                      <span className="text-12 text-text-muted">
                        Add backends by IP, port, and weight, then use Add to pool.
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_100px_88px_32px] items-end gap-2">
                      <span className="text-label-sm text-text-subtle pb-1">IP address</span>
                      <span className="text-label-sm text-text-subtle pb-1">Port</span>
                      <span className="text-label-sm text-text-subtle pb-1">Weight</span>
                      <div />
                      {externalMembers.map((row) => (
                        <div key={row.id} className="contents">
                          <Input
                            placeholder="10.0.0.10"
                            value={row.ipAddress}
                            onChange={(e) =>
                              setExternalMembers((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, ipAddress: e.target.value } : r
                                )
                              )
                            }
                          />
                          <NumberInput
                            min={1}
                            max={65535}
                            step={1}
                            value={row.port}
                            onChange={(v) =>
                              setExternalMembers((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, port: v } : r))
                              )
                            }
                          />
                          <NumberInput
                            min={1}
                            max={256}
                            step={1}
                            value={row.weight}
                            onChange={(v) =>
                              setExternalMembers((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, weight: v } : r))
                              )
                            }
                          />
                          <button
                            type="button"
                            aria-label="Remove row"
                            className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover"
                            onClick={() =>
                              setExternalMembers((prev) =>
                                prev.length > 1 ? prev.filter((r) => r.id !== row.id) : prev
                              )
                            }
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setExternalMembers((prev) => [...prev, newExternalRow()])}
                      >
                        <IconCirclePlus size={12} />
                        Add row
                      </Button>
                      <Button variant="primary" size="sm" onClick={addExternalMembersFromGrid}>
                        Add to pool
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Allocated members</span>
                  <span className="text-12 text-text">
                    {allocatedMembers.length} member(s) —{' '}
                    {allocatedMembers.map((m) => `${m.ipAddress}:${m.portName}`).join(', ')}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'health' as const,
            label: 'Health monitor',
            onComplete: validateHealth,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Create health monitor</span>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={createHealthMonitor}
                        onChange={(e) => {
                          setCreateHealthMonitor(e.target.checked);
                          setHealthAttempted(false);
                        }}
                      />
                      <span className="text-12 text-text">
                        {createHealthMonitor ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {createHealthMonitor && (
                  <>
                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">
                          Name <span className="text-error">*</span>
                        </span>
                        <Input
                          placeholder="Enter health monitor name"
                          value={healthName}
                          onChange={(e) => {
                            setHealthName(e.target.value);
                            setHealthAttempted(false);
                          }}
                          error={!!healthNameError}
                        />
                        {healthNameError && (
                          <span className="text-11 text-error">{healthNameError}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">Type</span>
                        <Dropdown.Select
                          value={healthType}
                          onChange={(v) => setHealthType(String(v))}
                        >
                          {healthTypeOptions.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="grid max-w-md grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Interval (s)</span>
                          <NumberInput
                            min={1}
                            max={3600}
                            step={1}
                            value={healthInterval}
                            onChange={setHealthInterval}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Timeout (s)</span>
                          <NumberInput
                            min={1}
                            max={3600}
                            step={1}
                            value={healthTimeout}
                            onChange={setHealthTimeout}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Max retries</span>
                          <NumberInput
                            min={1}
                            max={20}
                            step={1}
                            value={healthMaxRetries}
                            onChange={setHealthMaxRetries}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <span className="text-13 font-medium text-text">Admin state</span>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={healthAdminUp}
                            onChange={(e) => setHealthAdminUp(e.target.checked)}
                          />
                          <span className="text-12 text-text">{healthAdminUp ? 'Up' : 'Down'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                {!createHealthMonitor ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Health monitor</span>
                    <span className="text-12 text-text">Skipped</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Name</span>
                      <span className="text-12 text-text">{healthName}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Type</span>
                      <span className="text-12 text-text">{healthType}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">
                        Interval / timeout
                      </span>
                      <span className="text-12 text-text">
                        {healthInterval}s / {healthTimeout}s
                      </span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Max retries</span>
                      <span className="text-12 text-text">{healthMaxRetries}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Admin state</span>
                      <span className="text-12 text-text">{healthAdminUp ? 'Up' : 'Down'}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
        ]}
      </Stepper>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/compute/load-balancers');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create load balancer',
            subtitle: 'This is UI-only. No actual load balancer will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default ComputeCreateLoadBalancerPage;
