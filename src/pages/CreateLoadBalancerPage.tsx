import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  Select,
  SectionCard,
  FormField,
  WizardSummary,
  Tabs,
  TabList,
  Tab,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  RadioGroup,
  Radio,
  Toggle,
  NumberInput,
  Checkbox,
  Disclosure,
  Tooltip,
  InlineMessage,
  SelectionIndicator,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconBell,
  IconEdit,
  IconExternalLink,
  IconInfoCircle,
  IconPlus,
  IconAlertCircle,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'listener' | 'pool' | 'member' | 'health-monitor';

// Network table row type
interface NetworkRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  subnetCidr: string;
  external: string;
  shared: string;
}

// Mock network data
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
];

// Certificate table row type
interface CertificateRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'paused';
  san: string;
  listener: string;
  listenerId: string;
  listenerCount: number;
  expiresAt: string;
  createdAt: string;
}

// Mock certificate data
const mockCertificates: CertificateRow[] = [
  {
    id: '29tgj234',
    name: 'sc-1',
    status: 'active',
    san: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '38rhk345',
    name: 'sc-2',
    status: 'active',
    san: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '47sil456',
    name: 'sc-3',
    status: 'active',
    san: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '56tjm567',
    name: 'sc-4',
    status: 'active',
    san: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '65ukn678',
    name: 'sc-5',
    status: 'paused',
    san: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
];

// CA Certificate table row type
interface CaCertificateRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'paused';
  listener: string;
  listenerId: string;
  listenerCount: number;
  expiresAt: string;
  createdAt: string;
}

// Mock CA certificate data
const mockCaCertificates: CaCertificateRow[] = [
  {
    id: '29tgj234',
    name: 'ca-1',
    status: 'active',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '38rhk345',
    name: 'ca-2',
    status: 'active',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '47sil456',
    name: 'ca-3',
    status: 'active',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '56tjm567',
    name: 'ca-4',
    status: 'active',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '65ukn678',
    name: 'ca-5',
    status: 'paused',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
];

// SNI Certificate table row type
interface SniCertificateRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'paused';
  domain: string;
  listener: string;
  listenerId: string;
  listenerCount: number;
  expiresAt: string;
  createdAt: string;
}

// Mock SNI certificate data
const mockSniCertificates: SniCertificateRow[] = [
  {
    id: '29tgj234',
    name: 'sc-1',
    status: 'active',
    domain: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '38rhk345',
    name: 'sc-2',
    status: 'active',
    domain: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '47sil456',
    name: 'sc-3',
    status: 'active',
    domain: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '56tjm567',
    name: 'sc-4',
    status: 'active',
    domain: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: '65ukn678',
    name: 'sc-5',
    status: 'paused',
    domain: '.domain.com',
    listener: 'net',
    listenerId: '294u92s2',
    listenerCount: 3,
    expiresAt: '2025-12-31',
    createdAt: '2025-10-01',
  },
];

// Port row type for member selection
interface PortRow {
  id: string;
  name: string;
  attachedInstance: string | null;
  attachedInstanceId: string | null;
  ipAddresses: string[];
}

// Allocated member type
interface AllocatedMember {
  id: string;
  portId: string;
  portName: string;
  ipAddress: string;
  instanceName: string | null;
  weight: number;
  monitorPort: number;
  monitorAddress: string;
  backup: boolean;
  adminStateUp: boolean;
}

// Mock port data for member selection
const mockPorts: PortRow[] = [
  {
    id: '45ghj567',
    name: 'port',
    attachedInstance: 'instance',
    attachedInstanceId: '45ghj567',
    ipAddresses: ['10.63.0.47', '10.63.0.48', '10.63.0.49'],
  },
  {
    id: '56hik678',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: ['10.63.0.47', '10.63.0.50'],
  },
  {
    id: '67ijl789',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: ['10.63.0.47', '10.63.0.51'],
  },
  {
    id: '78jkm890',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: ['10.63.0.47', '10.63.0.52'],
  },
  {
    id: '89kln901',
    name: '(no name)',
    attachedInstance: null,
    attachedInstanceId: null,
    ipAddresses: [],
  },
];

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  listener: 'Listener',
  pool: 'Pool',
  member: 'Member',
  'health-monitor': 'Health monitor',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'listener', 'pool', 'member', 'health-monitor'];

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-3 flex flex-col gap-3">
        <WizardSummary items={summaryItems} />

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export default function CreateLoadBalancerPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    listener: 'pre',
    pool: 'pre',
    member: 'pre',
    'health-monitor': 'pre',
  });

  // Compute which section is currently active (only one should be active at a time)
  const activeSection = useMemo(() => {
    return SECTION_ORDER.find((section) => sectionStatus[section] === 'active') || null;
  }, [sectionStatus]);

  // Basic Information form state
  const [loadBalancerName, setLoadBalancerName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<'ovn' | 'amphora' | ''>('');

  // Validation errors
  const [lbNameError, setLbNameError] = useState<string | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Handler to change provider and reset listener protocol if incompatible
  const handleProviderChange = (newProvider: 'ovn' | 'amphora') => {
    setProvider(newProvider);
    setProviderError(null);
    // Reset listener protocol if it's not compatible with the new provider
    if (newProvider === 'ovn' && !['TCP', 'UDP'].includes(listenerProtocol)) {
      setListenerProtocol('');
      setPoolProtocol('TCP'); // Default for OVN
    }
  };

  // Handler to change listener protocol and auto-fill port
  const handleListenerProtocolChange = (protocol: string) => {
    setListenerProtocol(protocol);
    // Auto-fill port, pool protocol, and health monitor type based on protocol
    switch (protocol) {
      case 'HTTP':
        setProtocolPort(80);
        setPoolProtocol('HTTP');
        setHealthMonitorType('HTTP');
        break;
      case 'HTTPS':
        setProtocolPort(443);
        setPoolProtocol('HTTPS');
        setHealthMonitorType('HTTPS');
        break;
      case 'TERMINATED_HTTPS':
        setProtocolPort(443);
        setPoolProtocol('HTTP');
        setHealthMonitorType('HTTP');
        break;
      case 'TCP':
        setProtocolPort(5000);
        setPoolProtocol('TCP');
        setHealthMonitorType('TCP');
        break;
      case 'UDP':
        setProtocolPort(53);
        setPoolProtocol('UDP');
        setHealthMonitorType(provider === 'ovn' ? 'TCP' : 'UDP-CONNECT');
        break;
      default:
        break;
    }
  };
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [networkTab, setNetworkTab] = useState<'current' | 'shared' | 'external'>('current');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [subnet, setSubnet] = useState('');
  const [vipMode, setVipMode] = useState<'auto' | 'manual'>('auto');
  const [manualVip, setManualVip] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(false);

  // Listener form state
  const [listenerName, setListenerName] = useState('listener-http-80');
  const [listenerDescription, setListenerDescription] = useState('');
  const [listenerProtocol, setListenerProtocol] = useState('');
  const [protocolPort, setProtocolPort] = useState(80);
  const [connectionLimitType, setConnectionLimitType] = useState<'unlimited' | 'limited'>(
    'unlimited'
  );
  const [connectionLimitValue, setConnectionLimitValue] = useState<number | undefined>(undefined);
  const [listenerAdminState, setListenerAdminState] = useState(false);
  const [xForwardedFor, setXForwardedFor] = useState(false);
  const [xForwardedPort, setXForwardedPort] = useState(false);
  const [clientDataTimeout, setClientDataTimeout] = useState(50000);
  const [memberConnectTimeout, setMemberConnectTimeout] = useState(5000);
  const [memberDataTimeout, setMemberDataTimeout] = useState(5000);
  const [tcpInspectTimeout, setTcpInspectTimeout] = useState(0);
  const [allowedCidrs, setAllowedCidrs] = useState<string[]>([]);

  // SSL/Certificate state (for HTTP/HTTPS protocols)
  const [sslParsingMethod, setSslParsingMethod] = useState<'one-way' | 'two-way'>('one-way');
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [certificateSearch, setCertificateSearch] = useState('');
  const [certificatePage, setCertificatePage] = useState(1);
  const [sniEnabled, setSniEnabled] = useState(false);

  // CA Certificate state (for two-way authentication)
  const [selectedCaCertificate, setSelectedCaCertificate] = useState<string>('');
  const [caCertificateSearch, setCaCertificateSearch] = useState('');
  const [caCertificatePage, setCaCertificatePage] = useState(1);

  // SNI Certificate state (for SNI enabled)
  const [selectedSniCertificates, setSelectedSniCertificates] = useState<Set<string>>(new Set());
  const [sniCertificateSearch, setSniCertificateSearch] = useState('');
  const [sniCertificatePage, setSniCertificatePage] = useState(1);

  // Pool form state
  const [createPool, setCreatePool] = useState(true);
  const [poolName, setPoolName] = useState('pool-http');
  const [poolDescription, setPoolDescription] = useState('');
  const [poolAlgorithm, setPoolAlgorithm] = useState('ROUND_ROBIN');
  const [poolProtocol, setPoolProtocol] = useState('HTTP');
  const [poolAdminState, setPoolAdminState] = useState(false);
  const [poolAdvancedOpen, setPoolAdvancedOpen] = useState(false);
  const [sessionPersistence, setSessionPersistence] = useState<
    'none' | 'source_ip' | 'http_cookie' | 'app_cookie'
  >('none');
  const [cookieName, setCookieName] = useState('');

  // Member form state
  const [memberPortSearch, setMemberPortSearch] = useState('');
  const [memberPortPage, setMemberPortPage] = useState(1);
  const [allocatedMembers, setAllocatedMembers] = useState<AllocatedMember[]>([]);
  const [portIpSelections, setPortIpSelections] = useState<Record<string, string>>({});

  // External member rows (for adding members not from ports list)
  interface ExternalMemberRow {
    id: string;
    ipAddress: string;
    port: number | undefined;
    weight: number;
  }
  const [externalMembers, setExternalMembers] = useState<ExternalMemberRow[]>([]);

  // Health Monitor form state
  const [createHealthMonitor, setCreateHealthMonitor] = useState(true);
  const [healthMonitorName, setHealthMonitorName] = useState('hm-pool-http');
  const [healthMonitorType, setHealthMonitorType] = useState('HTTP');
  const [healthMonitorInterval, setHealthMonitorInterval] = useState(5);
  const [healthMonitorTimeout, setHealthMonitorTimeout] = useState(3);
  const [healthMonitorMaxRetries, setHealthMonitorMaxRetries] = useState(3);
  const [healthMonitorAdminState, setHealthMonitorAdminState] = useState(true);

  // Pool protocol options based on provider and listener protocol
  const poolProtocolOptions = useMemo(() => {
    if (provider === 'ovn') {
      // OVN provider: TCP → TCP only, UDP → UDP only
      if (listenerProtocol === 'TCP') {
        return [{ value: 'TCP', label: 'TCP' }];
      }
      if (listenerProtocol === 'UDP') {
        return [{ value: 'UDP', label: 'UDP' }];
      }
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'UDP', label: 'UDP' },
      ];
    }

    // Amphora provider
    if (listenerProtocol === 'HTTP') {
      return [{ value: 'HTTP', label: 'HTTP' }];
    }
    if (listenerProtocol === 'HTTPS') {
      return [
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'TCP', label: 'TCP' },
      ];
    }
    if (listenerProtocol === 'TERMINATED_HTTPS') {
      return [{ value: 'HTTP', label: 'HTTP' }];
    }
    if (listenerProtocol === 'TCP') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
      ];
    }
    if (listenerProtocol === 'UDP') {
      return [{ value: 'UDP', label: 'UDP' }];
    }

    // Default fallback
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'UDP', label: 'UDP' },
    ];
  }, [provider, listenerProtocol]);

  // Health monitor type options based on provider and listener protocol
  const healthMonitorTypeOptions = useMemo(() => {
    if (provider === 'ovn') {
      // OVN provider
      if (listenerProtocol === 'TCP') {
        return [{ value: 'TCP', label: 'TCP' }];
      }
      if (listenerProtocol === 'UDP') {
        return [
          { value: 'TCP', label: 'TCP' },
          { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        ];
      }
      return [{ value: 'TCP', label: 'TCP' }];
    }

    // Amphora provider
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
        { value: 'PING', label: 'PING' },
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
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'UDP') {
      return [
        { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'TCP', label: 'TCP' },
      ];
    }

    // Default fallback
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'PING', label: 'PING' },
      { value: 'TCP', label: 'TCP' },
      { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
    ];
  }, [provider, listenerProtocol]);

  // Update pool protocol when listener protocol changes
  const getDefaultPoolProtocol = (listenerProto: string, prov: string) => {
    if (prov === 'ovn') {
      return listenerProto === 'UDP' ? 'UDP' : 'TCP';
    }
    // Amphora provider
    if (listenerProto === 'HTTP') return 'HTTP';
    if (listenerProto === 'HTTPS') return 'HTTPS';
    if (listenerProto === 'TERMINATED_HTTPS') return 'HTTP';
    if (listenerProto === 'TCP') return 'TCP';
    if (listenerProto === 'UDP') return 'UDP';
    return 'HTTP';
  };

  // Get selected network details
  const selectedNetworkDetails = useMemo(() => {
    return mockNetworks.find((n) => n.id === selectedNetwork);
  }, [selectedNetwork]);

  // Network table columns
  const networkColumns: TableColumn<NetworkRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Radio
              value={row.id}
              checked={selectedNetwork === row.id}
              onChange={() => {
                setSelectedNetwork(row.id);
                setNetworkError(null);
              }}
            />
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center' as const,
        render: (_value, row) => <StatusIndicator status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
              {row.status === 'error' && (
                <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
              )}
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
          </VStack>
        ),
      },
      {
        key: 'subnetCidr',
        label: 'Subnet CIDR',
        flex: 1,
        minWidth: columnMinWidths.subnetCidr,
      },
      {
        key: 'external',
        label: 'External',
        flex: 1,
        minWidth: columnMinWidths.external,
      },
      {
        key: 'shared',
        label: 'Shared',
        flex: 1,
        minWidth: columnMinWidths.type,
      },
    ],
    [selectedNetwork]
  );

  // Certificate table columns
  const certificateColumns: TableColumn<CertificateRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Radio
              value={row.id}
              checked={selectedCertificate === row.id}
              onChange={() => setSelectedCertificate(row.id)}
              disabled={row.status !== 'active'}
            />
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center' as const,
        render: (_value, row) => <StatusIndicator status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
              {row.status === 'paused' && (
                <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
              )}
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
          </VStack>
        ),
      },
      {
        key: 'san',
        label: 'SAN',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
      },
      {
        key: 'listener',
        label: 'Listener',
        flex: 1,
        minWidth: columnMinWidths.listener,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1} align="center">
              <span className="text-body-md text-[var(--color-text-default)]">{row.listener}</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                (+{row.listenerCount})
              </span>
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID:{row.listenerId}
            </span>
          </VStack>
        ),
      },
      {
        key: 'expiresAt',
        label: 'Expires At',
        flex: 1,
        minWidth: columnMinWidths.expiresAt,
      },
      {
        key: 'createdAt',
        label: 'Created At',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
      },
    ],
    [selectedCertificate]
  );

  // CA Certificate table columns
  const caCertificateColumns: TableColumn<CaCertificateRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Radio
              value={row.id}
              checked={selectedCaCertificate === row.id}
              onChange={() => setSelectedCaCertificate(row.id)}
              disabled={row.status === 'paused'}
            />
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center' as const,
        render: (_value, row) => <StatusIndicator status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
              {row.status === 'paused' && (
                <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
              )}
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
          </VStack>
        ),
      },
      {
        key: 'listener',
        label: 'Listeners',
        flex: 1,
        minWidth: columnMinWidths.listener,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1} align="center">
              <span className="text-body-md text-[var(--color-text-default)]">{row.listener}</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                (+{row.listenerCount})
              </span>
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID:{row.listenerId}
            </span>
          </VStack>
        ),
      },
      {
        key: 'expiresAt',
        label: 'Expires At',
        flex: 1,
        minWidth: columnMinWidths.expiresAt,
      },
      {
        key: 'createdAt',
        label: 'Created At',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
      },
    ],
    [selectedCaCertificate]
  );

  // SNI Certificate table columns (with checkboxes for multi-select)
  const sniCertificateColumns: TableColumn<SniCertificateRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selectedSniCertificates.has(row.id)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSelectedSniCertificates((prev) => {
                  const next = new Set(prev);
                  if (isChecked) {
                    next.add(row.id);
                  } else {
                    next.delete(row.id);
                  }
                  return next;
                });
              }}
              disabled={row.status === 'paused'}
            />
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center' as const,
        render: (_value, row) => <StatusIndicator status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
              {row.status === 'paused' && (
                <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
              )}
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
          </VStack>
        ),
      },
      {
        key: 'domain',
        label: 'Domain',
        flex: 1,
        minWidth: columnMinWidths.domain,
        sortable: true,
      },
      {
        key: 'listener',
        label: 'Listener',
        flex: 1,
        minWidth: columnMinWidths.listener,
        sortable: true,
        render: (_value, row) => (
          <HStack gap={1} align="center">
            <VStack gap={0.5} align="start">
              <span className="text-body-md text-[var(--color-text-default)]">{row.listener}</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                ID:{row.listenerId}
              </span>
            </VStack>
            <span className="text-body-md text-[var(--color-text-default)]">
              (+{row.listenerCount})
            </span>
          </HStack>
        ),
      },
      {
        key: 'expiresAt',
        label: 'Expires At',
        flex: 1,
        minWidth: columnMinWidths.expiresAt,
      },
      {
        key: 'createdAt',
        label: 'Created At',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
      },
    ],
    [selectedSniCertificates]
  );

  // Tab bar management
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Section navigation - ensures only one section is active at a time
  const goToNextSection = (currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Mark current section as done
      newStatus[currentSection] = 'done';
      // If there's a next section, make it active
      if (currentIndex < SECTION_ORDER.length - 1) {
        const nextSection = SECTION_ORDER[currentIndex + 1];
        newStatus[nextSection] = 'active';
      }
      return newStatus;
    });
  };

  // Validation handler for basic-info section
  const handleBasicInfoNext = () => {
    let hasError = false;

    if (!loadBalancerName.trim()) {
      setLbNameError('Please enter a load balancer name.');
      hasError = true;
    } else {
      setLbNameError(null);
    }

    if (!provider) {
      setProviderError('Please select a provider.');
      hasError = true;
    } else {
      setProviderError(null);
    }

    if (!selectedNetwork) {
      setNetworkError('Please select a network.');
      hasError = true;
    } else {
      setNetworkError(null);
    }

    if (!hasError) {
      goToNextSection('basic-info');
    }
  };

  // Edit section - resets subsequent sections to 'pre' state
  const editSection = (section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set clicked section to active
      newStatus[section] = 'active';
      // Reset all sections after this one to 'pre'
      const sectionIndex = SECTION_ORDER.indexOf(section);
      for (let i = sectionIndex + 1; i < SECTION_ORDER.length; i++) {
        newStatus[SECTION_ORDER[i]] = 'pre';
      }
      return newStatus;
    });
  };

  // Create handler
  const handleCreate = () => {
    console.log('Creating load balancer:', {
      loadBalancerName,
      description,
      provider,
      networkId: selectedNetwork,
      networkName: selectedNetworkDetails?.name,
      subnet,
      vipMode,
      manualVip: vipMode === 'manual' ? manualVip : 'auto',
      adminStateUp,
    });
    navigate('/compute/load-balancers');
  };

  // Check if create button should be disabled
  const isCreateDisabled = !loadBalancerName || !selectedNetwork;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={() => addTab({ label: 'New Tab', path: '/' })}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: 'Load Balancers', href: '/compute/load-balancers' },
                  { label: 'Create load balancer' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create load balancer
                </h1>
              </div>

              {/* Main Content */}
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard isActive={activeSection === 'basic-info'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['basic-info']}
                      showDivider={activeSection === 'basic-info'}
                      actions={
                        sectionStatus['basic-info'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('basic-info')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'basic-info' && (
                      <SectionCard.Content gap={6} className="pt-2">
                        {/* Load Balancer Name */}
                        <FormField required error={!!lbNameError}>
                          <FormField.Label>Load balancer name</FormField.Label>
                          <FormField.Control>
                            <VStack gap={1}>
                              <Input
                                placeholder="Enter Load balancer name"
                                value={loadBalancerName}
                                onChange={(e) => {
                                  setLoadBalancerName(e.target.value);
                                  setLbNameError(null);
                                }}
                                fullWidth
                                error={!!lbNameError}
                              />
                              {lbNameError && (
                                <span className="text-body-sm text-[var(--color-state-danger)]">
                                  {lbNameError}
                                </span>
                              )}
                            </VStack>
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the
                            length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Description */}
                        <FormField>
                          <FormField.Label>Load balancer description</FormField.Label>
                          <FormField.Control>
                            <Input
                              placeholder="Enter description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_()[]), and
                            maximum 255 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Provider */}
                        <FormField required error={!!providerError}>
                          <FormField.Label>Provider</FormField.Label>
                          <FormField.HelperText>
                            Choose the provider to use for the load balancer.
                          </FormField.HelperText>
                          <VStack gap={1} className="mt-3">
                            <VStack gap={3}>
                              <HStack gap={1.5} align="center">
                                <Radio
                                  value="ovn"
                                  checked={provider === 'ovn'}
                                  onChange={() => handleProviderChange('ovn')}
                                  label="OVN"
                                />
                                <IconInfoCircle
                                  size={16}
                                  className="text-[var(--color-text-subtle)]"
                                />
                              </HStack>
                              <HStack gap={1.5} align="center">
                                <Radio
                                  value="amphora"
                                  checked={provider === 'amphora'}
                                  onChange={() => handleProviderChange('amphora')}
                                  label="Amphora"
                                />
                                <IconInfoCircle
                                  size={16}
                                  className="text-[var(--color-text-subtle)]"
                                />
                              </HStack>
                            </VStack>
                            {providerError && (
                              <span className="text-body-sm text-[var(--color-state-danger)]">
                                {providerError}
                              </span>
                            )}
                          </VStack>
                        </FormField>

                        {/* Owned Network */}
                        <VStack gap={4}>
                          <FormField required>
                            <FormField.Label>Owned network</FormField.Label>
                            <FormField.HelperText>
                              Select the network to attach the load balancer to.
                            </FormField.HelperText>
                          </FormField>

                          {/* Network Tabs */}
                          <Tabs
                            value={networkTab}
                            onChange={(value) =>
                              setNetworkTab(value as 'current' | 'shared' | 'external')
                            }
                            variant="underline"
                          >
                            <TabList>
                              <Tab value="current">Current tenant</Tab>
                              <Tab value="shared">Shared</Tab>
                              <Tab value="external">External</Tab>
                            </TabList>
                          </Tabs>

                          {/* Search */}
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              placeholder="Search networks by attributes"
                              value={networkSearch}
                              onChange={(e) => setNetworkSearch(e.target.value)}
                            />
                          </div>

                          {/* Pagination */}
                          <Pagination
                            currentPage={networkPage}
                            totalPages={5}
                            totalItems={115}
                            onPageChange={setNetworkPage}
                          />

                          {/* Network Table */}
                          {provider ? (
                            <Table
                              columns={networkColumns}
                              data={mockNetworks}
                              getRowId={(row) => row.id}
                              onRowClick={(row) => {
                                setSelectedNetwork(row.id);
                                setNetworkError(null);
                              }}
                            />
                          ) : (
                            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md p-4 text-center text-body-md text-[var(--color-text-default)]">
                              Select a provider to view the network list.
                            </div>
                          )}

                          {/* Error Message or Selection Indicator for Network */}
                          {networkError && !selectedNetwork ? (
                            <div className="mt-2">
                              <InlineMessage variant="error">{networkError}</InlineMessage>
                            </div>
                          ) : (
                            <SelectionIndicator
                              className="mt-2"
                              selectedItems={
                                selectedNetwork
                                  ? [
                                      {
                                        id: selectedNetwork,
                                        label:
                                          mockNetworks.find((n) => n.id === selectedNetwork)
                                            ?.name || selectedNetwork,
                                      },
                                    ]
                                  : []
                              }
                              onRemove={() => setSelectedNetwork('')}
                            />
                          )}
                        </VStack>

                        {/* VIP Address */}
                        <FormField required>
                          <FormField.Label>VIP Address</FormField.Label>
                          <FormField.HelperText>
                            Select the subnet for the VIP. You can assign an IP automatically or
                            manually enter one within the subnet range.
                          </FormField.HelperText>
                          <div className="mt-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2 flex items-center gap-2">
                            <HStack gap={2} align="center">
                              <span className="text-label-md text-[var(--color-text-default)]">
                                Subnet
                              </span>
                              <Select
                                options={[
                                  ...(selectedNetworkDetails
                                    ? [
                                        {
                                          value: selectedNetworkDetails.subnetCidr,
                                          label: selectedNetworkDetails.subnetCidr,
                                        },
                                      ]
                                    : []),
                                  { value: '10.0.0.0/24', label: '10.0.0.0/24' },
                                  { value: '10.0.1.0/24', label: '10.0.1.0/24' },
                                ]}
                                value={subnet}
                                onChange={setSubnet}
                                placeholder="Select"
                                width="sm"
                              />
                            </HStack>
                            <HStack gap={2} align="center">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                VIP
                              </span>
                              <Select
                                options={[
                                  { value: 'auto', label: 'Auto-assign' },
                                  { value: 'manual', label: 'Manual' },
                                ]}
                                value={vipMode}
                                onChange={(value) => setVipMode(value as 'auto' | 'manual')}
                                placeholder="Auto-assign"
                                width="sm"
                              />
                              {vipMode === 'manual' && (
                                <Input
                                  placeholder="Enter VIP address"
                                  value={manualVip}
                                  onChange={(e) => setManualVip(e.target.value)}
                                  style={{ width: '160px' }}
                                />
                              )}
                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                10.62.0.31 - 10.62.0.77
                              </span>
                            </HStack>
                          </div>
                        </FormField>

                        {/* Load Balancer Admin State */}
                        <FormField>
                          <FormField.Label>Load balancer admin state</FormField.Label>
                          <FormField.HelperText>
                            Set the administrative state of the load balancer. 'UP' enables traffic
                            handling, while 'DOWN' disables it.
                          </FormField.HelperText>
                          <div className="mt-2">
                            <Toggle
                              checked={adminStateUp}
                              onChange={(e) => setAdminStateUp(e.target.checked)}
                              label={adminStateUp ? 'Up' : 'Down'}
                            />
                          </div>
                        </FormField>

                        {/* Next Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button variant="primary" onClick={handleBasicInfoNext}>
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['basic-info'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Load balancer name"
                          value={loadBalancerName}
                          showDivider
                        />
                        {description && (
                          <SectionCard.DataRow
                            label="Description"
                            value={description}
                            showDivider
                          />
                        )}
                        <SectionCard.DataRow
                          label="Provider"
                          value={provider === 'ovn' ? 'OVN' : 'Amphora'}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="Owned network"
                          value={selectedNetworkDetails?.name || '-'}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="VIP Address"
                          value={`${subnet || 'Not selected'} / ${vipMode === 'auto' ? 'Auto-assign' : manualVip}`}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="Admin state"
                          value={adminStateUp ? 'Up' : 'Down'}
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Listener Section */}
                  <SectionCard isActive={activeSection === 'listener'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['listener']}
                      showDivider={activeSection === 'listener'}
                      actions={
                        sectionStatus['listener'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('listener')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'listener' && (
                      <SectionCard.Content gap={6} className="pt-2">
                        {/* Listener name */}
                        <FormField required>
                          <FormField.Label>Listener name</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={listenerName}
                              onChange={(e) => setListenerName(e.target.value)}
                              placeholder="Enter listener name"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the
                            length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Listener description */}
                        <FormField>
                          <FormField.Label>Listener description</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={listenerDescription}
                              onChange={(e) => setListenerDescription(e.target.value)}
                              placeholder="Enter description"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_()[]), and
                            maximum 255 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Listener protocol */}
                        <FormField required>
                          <FormField.Label>Listener protocol</FormField.Label>
                          <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                            Select the protocol used to handle client requests.
                          </p>
                          <FormField.Control>
                            <Select
                              value={listenerProtocol}
                              onChange={handleListenerProtocolChange}
                              options={
                                provider === 'ovn'
                                  ? [
                                      { value: 'TCP', label: 'TCP' },
                                      { value: 'UDP', label: 'UDP' },
                                    ]
                                  : [
                                      { value: 'HTTP', label: 'HTTP' },
                                      { value: 'HTTPS', label: 'HTTPS' },
                                      { value: 'TCP', label: 'TCP' },
                                      { value: 'UDP', label: 'UDP' },
                                      { value: 'TERMINATED_HTTPS', label: 'TERMINATED_HTTPS' },
                                    ]
                              }
                              placeholder="Select a protocol"
                              width="sm"
                            />
                          </FormField.Control>
                        </FormField>

                        {/* SSL Parsing Method - shown when HTTP is selected */}
                        {listenerProtocol === 'HTTP' && (
                          <FormField required>
                            <FormField.Label>SSL Parsing Method</FormField.Label>
                            <p className="text-body-md text-[var(--color-text-subtle)] mb-3">
                              Defines how SSL information is parsed from incoming HTTPS requests.
                            </p>
                            <VStack gap={3} align="start">
                              <Radio
                                label="One-way authentication"
                                checked={sslParsingMethod === 'one-way'}
                                onChange={() => setSslParsingMethod('one-way')}
                              />
                              <Radio
                                label="Two-way authentication"
                                checked={sslParsingMethod === 'two-way'}
                                onChange={() => setSslParsingMethod('two-way')}
                              />
                            </VStack>
                          </FormField>
                        )}

                        {/* Server Certificates - shown when HTTP is selected */}
                        {listenerProtocol === 'HTTP' && (
                          <VStack gap={4}>
                            <FormField required>
                              <FormField.Label>Server Certificates</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                Select a server certificate for the listener to handle HTTPS
                                traffic.
                              </p>
                            </FormField>

                            {/* Search */}
                            <div className="w-[var(--search-input-width)]">
                              <SearchInput
                                placeholder="Search certificates by attributes"
                                value={certificateSearch}
                                onChange={(e) => setCertificateSearch(e.target.value)}
                              />
                            </div>

                            {/* Pagination */}
                            <Pagination
                              currentPage={certificatePage}
                              totalPages={5}
                              totalItems={115}
                              onPageChange={setCertificatePage}
                            />

                            {/* Certificate Table */}
                            <Table
                              columns={certificateColumns}
                              data={mockCertificates}
                              getRowId={(row) => row.id}
                            />

                            {/* Selection Indicator for Certificate */}
                            <SelectionIndicator
                              className="mt-2"
                              selectedItems={
                                selectedCertificate
                                  ? [
                                      {
                                        id: selectedCertificate,
                                        label:
                                          mockCertificates.find((c) => c.id === selectedCertificate)
                                            ?.name || selectedCertificate,
                                      },
                                    ]
                                  : []
                              }
                              onRemove={() => setSelectedCertificate('')}
                            />
                          </VStack>
                        )}

                        {/* CA Certificates - shown when HTTP is selected AND two-way authentication */}
                        {listenerProtocol === 'HTTP' && sslParsingMethod === 'two-way' && (
                          <VStack gap={4} align="stretch">
                            <FormField required>
                              <FormField.Label>CA Certificates</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Select a CA certificate to validate client certificates.
                              </p>
                            </FormField>

                            {/* Search */}
                            <SearchInput
                              placeholder="Search certificates by attributes"
                              value={caCertificateSearch}
                              onChange={(e) => setCaCertificateSearch(e.target.value)}
                              className="w-[var(--search-input-width)]"
                            />

                            {/* Pagination */}
                            <Pagination
                              currentPage={caCertificatePage}
                              totalPages={5}
                              totalItems={115}
                              onPageChange={setCaCertificatePage}
                            />

                            {/* CA Certificate Table */}
                            <Table
                              columns={caCertificateColumns}
                              data={mockCaCertificates}
                              getRowId={(row) => row.id}
                            />

                            {/* Selection Indicator for CA Certificate */}
                            <SelectionIndicator
                              className="mt-2"
                              selectedItems={
                                selectedCaCertificate
                                  ? [
                                      {
                                        id: selectedCaCertificate,
                                        label:
                                          mockCaCertificates.find(
                                            (c) => c.id === selectedCaCertificate
                                          )?.name || selectedCaCertificate,
                                      },
                                    ]
                                  : []
                              }
                              onRemove={() => setSelectedCaCertificate('')}
                            />
                          </VStack>
                        )}

                        {/* SNI - shown when HTTP is selected */}
                        {listenerProtocol === 'HTTP' && (
                          <FormField>
                            <FormField.Label>SNI</FormField.Label>
                            <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                              Add more certificates here to host multiple, different HTTPS websites
                              on this single listener.
                            </p>
                            <HStack gap={2} align="center">
                              <Toggle checked={sniEnabled} onChange={setSniEnabled} />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {sniEnabled ? 'On' : 'Off'}
                              </span>
                            </HStack>
                          </FormField>
                        )}

                        {/* SNI Certificates - shown when HTTP is selected AND SNI is enabled */}
                        {listenerProtocol === 'HTTP' && sniEnabled && (
                          <VStack gap={4} align="stretch">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              SNI Certificates
                            </span>

                            {/* Search */}
                            <SearchInput
                              placeholder="Search server certificate by attributes"
                              value={sniCertificateSearch}
                              onChange={(e) => setSniCertificateSearch(e.target.value)}
                              className="w-[var(--search-input-width)]"
                            />

                            {/* Pagination */}
                            <Pagination
                              currentPage={sniCertificatePage}
                              totalPages={5}
                              totalItems={115}
                              onPageChange={setSniCertificatePage}
                            />

                            {/* SNI Certificate Table */}
                            <Table
                              columns={sniCertificateColumns}
                              data={mockSniCertificates}
                              getRowId={(row) => row.id}
                            />

                            {/* Selection Indicator for SNI Certificates */}
                            <SelectionIndicator
                              className="mt-2"
                              selectedItems={Array.from(selectedSniCertificates).map((id) => ({
                                id,
                                label: mockSniCertificates.find((c) => c.id === id)?.name || id,
                              }))}
                              onRemove={(id) => {
                                const newSet = new Set(selectedSniCertificates);
                                newSet.delete(id);
                                setSelectedSniCertificates(newSet);
                              }}
                            />
                          </VStack>
                        )}

                        {/* Protocol port */}
                        <FormField required>
                          <FormField.Label>Protocol port</FormField.Label>
                          <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                            The port on which the listener receives client requests.
                          </p>
                          <FormField.Control>
                            <NumberInput
                              value={protocolPort}
                              onChange={setProtocolPort}
                              min={1}
                              max={65535}
                              className="w-[var(--layout-sidebar-width)]"
                            />
                          </FormField.Control>
                          <FormField.HelperText>1-65535</FormField.HelperText>
                        </FormField>

                        {/* Connection limit */}
                        <FormField required>
                          <FormField.Label>Connection limit</FormField.Label>
                          <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                            Defines the maximum number of concurrent connections the listener can
                            handle.
                          </p>
                          <FormField.Control>
                            <VStack gap={3} align="start">
                              <Radio
                                label="Unlimited"
                                checked={connectionLimitType === 'unlimited'}
                                onChange={() => setConnectionLimitType('unlimited')}
                              />
                              <HStack gap={3} align="center">
                                <Radio
                                  label="Limited"
                                  checked={connectionLimitType === 'limited'}
                                  onChange={() => setConnectionLimitType('limited')}
                                />
                                <NumberInput
                                  value={connectionLimitValue}
                                  onChange={setConnectionLimitValue}
                                  disabled={connectionLimitType === 'unlimited'}
                                  min={1}
                                  className={`w-[var(--layout-sidebar-width)] ${connectionLimitType === 'unlimited' ? 'bg-[var(--color-surface-subtle)]' : ''}`}
                                />
                              </HStack>
                            </VStack>
                          </FormField.Control>
                        </FormField>

                        {/* Listener admin state */}
                        <FormField>
                          <FormField.Label>Listener admin state</FormField.Label>
                          <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                            Set the administrative state of the listener. 'UP' enables traffic
                            handling, while 'DOWN' disables it.
                          </p>
                          <FormField.Control>
                            <HStack gap={2} align="center">
                              <Toggle
                                checked={listenerAdminState}
                                onChange={(e) => setListenerAdminState(e.target.checked)}
                              />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {listenerAdminState ? 'Up' : 'Down'}
                              </span>
                            </HStack>
                          </FormField.Control>
                        </FormField>

                        {/* Advanced Section */}
                        <Disclosure defaultOpen={false}>
                          <Disclosure.Trigger>Advanced</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <VStack gap={6} className="mt-4">
                              {/* Custom headers */}
                              <FormField>
                                <FormField.Label>Custom headers</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-3">
                                  Defines custom header values to be forwarded to backend servers.
                                </p>
                                <VStack gap={3} align="start">
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={xForwardedFor}
                                      onChange={(e) => setXForwardedFor(e.target.checked)}
                                      label="X-Forwarded-For"
                                    />
                                    <Tooltip content="Captures the original client IP address">
                                      <IconInfoCircle
                                        size={16}
                                        className="text-[var(--color-text-muted)]"
                                      />
                                    </Tooltip>
                                  </HStack>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={xForwardedPort}
                                      onChange={(e) => setXForwardedPort(e.target.checked)}
                                      label="X-Forwarded-Port"
                                    />
                                    <Tooltip content="Captures the original client port">
                                      <IconInfoCircle
                                        size={16}
                                        className="text-[var(--color-text-muted)]"
                                      />
                                    </Tooltip>
                                  </HStack>
                                </VStack>
                              </FormField>

                              {/* Client data timeout */}
                              <FormField>
                                <FormField.Label>Client data timeout (ms)</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait for client request data.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={clientDataTimeout}
                                    onChange={setClientDataTimeout}
                                    min={0}
                                    className="w-[var(--layout-sidebar-width)]"
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Member connect timeout */}
                              <FormField>
                                <FormField.Label>Member connect timeout (ms)</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait when establishing a connection to a backend
                                  member.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={memberConnectTimeout}
                                    onChange={setMemberConnectTimeout}
                                    min={0}
                                    className="w-[var(--layout-sidebar-width)]"
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Member data timeout */}
                              <FormField>
                                <FormField.Label>Member data timeout (ms)</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait for response data from a backend member.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={memberDataTimeout}
                                    onChange={setMemberDataTimeout}
                                    min={0}
                                    className="w-[var(--layout-sidebar-width)]"
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* TCP Inspect Timeout */}
                              <FormField>
                                <FormField.Label>TCP Inspect Timeout (ms)</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                  Timeout for TCP packet inspection or handshake. 0 disables this
                                  feature.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={tcpInspectTimeout}
                                    onChange={setTcpInspectTimeout}
                                    min={0}
                                    className="w-[var(--layout-sidebar-width)]"
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Allowed CIDRs */}
                              <FormField>
                                <FormField.Label>Allowed CIDRs</FormField.Label>
                                <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                  Defines the client IP ranges allowed to access the listener.
                                </p>
                                <VStack gap={2} align="start">
                                  {allowedCidrs.map((cidr, index) => (
                                    <HStack key={index} gap={2} align="center">
                                      <Input
                                        value={cidr}
                                        onChange={(e) => {
                                          const newCidrs = [...allowedCidrs];
                                          newCidrs[index] = e.target.value;
                                          setAllowedCidrs(newCidrs);
                                        }}
                                        placeholder="e.g. 10.0.0.0/24"
                                        className="w-[var(--layout-sidebar-width)]"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setAllowedCidrs(
                                            allowedCidrs.filter((_, i) => i !== index)
                                          );
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </HStack>
                                  ))}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconPlus size={12} />}
                                    onClick={() => setAllowedCidrs([...allowedCidrs, ''])}
                                  >
                                    Add CIDR
                                  </Button>
                                </VStack>
                              </FormField>
                            </VStack>
                          </Disclosure.Panel>
                        </Disclosure>

                        {/* Next button */}
                        <div className="flex items-center justify-end w-full">
                          <Button
                            variant="primary"
                            onClick={() => goToNextSection('listener')}
                            disabled={!listenerName.trim() || !listenerProtocol || !protocolPort}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['listener'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Listener name" value={listenerName} />
                        <SectionCard.DataRow
                          label="Protocol / Port"
                          value={`${listenerProtocol} / ${protocolPort}`}
                        />
                        <SectionCard.DataRow
                          label="Connection limit"
                          value={
                            connectionLimitType === 'unlimited'
                              ? 'Unlimited'
                              : String(connectionLimitValue)
                          }
                        />
                        <SectionCard.DataRow
                          label="Admin state"
                          value={listenerAdminState ? 'Up' : 'Down'}
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Pool Section */}
                  <SectionCard isActive={activeSection === 'pool'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['pool']}
                      showDivider={activeSection === 'pool'}
                      actions={
                        sectionStatus['pool'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('pool')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'pool' && (
                      <SectionCard.Content gap={6} className="pt-2">
                        {/* Create Pool toggle */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Create Pool
                          </span>
                          <HStack gap={2} align="center">
                            <Toggle checked={createPool} onChange={setCreatePool} />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              {createPool ? 'Yes' : 'No'}
                            </span>
                          </HStack>
                        </VStack>

                        {createPool && (
                          <>
                            {/* Pool name */}
                            <FormField required>
                              <FormField.Label>Pool name</FormField.Label>
                              <FormField.Control>
                                <Input
                                  placeholder="Enter pool name"
                                  value={poolName}
                                  onChange={(e) => setPoolName(e.target.value)}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                You can use letters, numbers, and special characters (+=,.@-_), and
                                the length must be between 2-128 characters.
                              </FormField.HelperText>
                            </FormField>

                            {/* Pool description */}
                            <FormField>
                              <FormField.Label>Pool description</FormField.Label>
                              <FormField.Control>
                                <Input
                                  placeholder="Enter description"
                                  value={poolDescription}
                                  onChange={(e) => setPoolDescription(e.target.value)}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                You can use letters, numbers, and special characters (+=,.@-_()[]),
                                and maximum 255 characters.
                              </FormField.HelperText>
                            </FormField>

                            {/* Pool algorithm */}
                            <FormField required>
                              <FormField.Label>Pool algorithm</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Select how incoming requests are distributed across backend members.
                                The chosen algorithm determines how traffic is routed to each
                                server.
                              </p>
                              <FormField.Control>
                                <Select
                                  options={[
                                    { value: 'ROUND_ROBIN', label: 'Round Robin' },
                                    { value: 'LEAST_CONNECTIONS', label: 'Least Connections' },
                                    { value: 'SOURCE_IP', label: 'Source IP' },
                                    { value: 'SOURCE_IP_PORT', label: 'Source IP Port' },
                                  ]}
                                  value={poolAlgorithm}
                                  onChange={setPoolAlgorithm}
                                  placeholder="Select algorithm"
                                  className="w-[var(--layout-sidebar-width)]"
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                {poolAlgorithm === 'ROUND_ROBIN' &&
                                  'Round Robin: Each new connection request is assigned to the next server in order, ensuring even distribution. Best for short-lived HTTP connections.'}
                                {poolAlgorithm === 'LEAST_CONNECTIONS' &&
                                  'Least Connections: Sends traffic to the server with the fewest active connections. Suitable for long-lived sessions.'}
                                {poolAlgorithm === 'SOURCE_IP' &&
                                  "Source IP: Uses client's source IP to maintain consistent routing to the same backend."}
                                {poolAlgorithm === 'SOURCE_IP_PORT' &&
                                  'Source IP Port: Routes traffic based on both client IP and source port to maintain consistent session mapping.'}
                              </FormField.HelperText>
                            </FormField>

                            {/* Pool protocol */}
                            <FormField required>
                              <FormField.Label>Pool protocol</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Select the protocol used to communicate with backend members. It
                                must match or be compatible with the listener's protocol.
                              </p>
                              <FormField.Control>
                                <Select
                                  options={poolProtocolOptions}
                                  value={poolProtocol}
                                  onChange={setPoolProtocol}
                                  placeholder="Select protocol"
                                  className="w-[var(--layout-sidebar-width)]"
                                />
                              </FormField.Control>
                            </FormField>

                            {/* Pool admin state */}
                            <VStack gap={2} align="start">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Pool admin state
                              </span>
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                Set the administrative state of the pool. 'UP' enables traffic
                                handling, while 'DOWN' disables it.
                              </p>
                              <HStack gap={2} align="center">
                                <Toggle checked={poolAdminState} onChange={setPoolAdminState} />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  {poolAdminState ? 'Up' : 'Down'}
                                </span>
                              </HStack>
                            </VStack>

                            {/* Advanced Section */}
                            <Disclosure
                              open={poolAdvancedOpen}
                              onChange={(open) => setPoolAdvancedOpen(open)}
                            >
                              <Disclosure.Trigger>Advanced</Disclosure.Trigger>
                              <Disclosure.Panel>
                                <VStack gap={4} align="stretch" className="pt-4">
                                  {/* Session persistence */}
                                  <VStack gap={3} align="start">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Session persistence
                                    </span>
                                    <p className="text-body-md text-[var(--color-text-subtle)]">
                                      Select the protocol used to communicate with backend members.
                                      It must match or be compatible with the listener's protocol.
                                    </p>
                                    <RadioGroup
                                      value={sessionPersistence}
                                      onChange={(value) =>
                                        setSessionPersistence(
                                          value as
                                            | 'none'
                                            | 'source_ip'
                                            | 'http_cookie'
                                            | 'app_cookie'
                                        )
                                      }
                                    >
                                      <VStack gap={3} align="start">
                                        <Radio value="none" label="None" />
                                        <Radio value="source_ip" label="Source IP" />
                                        {/* HTTP Cookie - only shown when pool protocol is HTTP */}
                                        {poolProtocol === 'HTTP' && (
                                          <Radio value="http_cookie" label="HTTP Cookie" />
                                        )}
                                        {/* App Cookie - only shown when pool protocol is HTTP */}
                                        {poolProtocol === 'HTTP' && (
                                          <VStack gap={2} align="start">
                                            <Radio value="app_cookie" label="App Cookie" />
                                            <Input
                                              placeholder="Enter cookie name"
                                              value={cookieName}
                                              onChange={(e) => setCookieName(e.target.value)}
                                              disabled={sessionPersistence !== 'app_cookie'}
                                              className="w-[var(--layout-sidebar-width)]"
                                            />
                                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                                              You can use letters, numbers, and special
                                              characters(+.-_!#$%&'*^|~).
                                            </span>
                                          </VStack>
                                        )}
                                      </VStack>
                                    </RadioGroup>
                                  </VStack>
                                </VStack>
                              </Disclosure.Panel>
                            </Disclosure>
                          </>
                        )}

                        <div className="flex items-center justify-end w-full">
                          <Button variant="primary" onClick={() => goToNextSection('pool')}>
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['pool'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Create Pool"
                          value={createPool ? 'Yes' : 'No'}
                        />
                        {createPool && (
                          <>
                            <SectionCard.DataRow label="Pool name" value={poolName} />
                            <SectionCard.DataRow
                              label="Pool algorithm"
                              value={
                                poolAlgorithm === 'ROUND_ROBIN'
                                  ? 'Round Robin'
                                  : poolAlgorithm === 'LEAST_CONNECTIONS'
                                    ? 'Least Connections'
                                    : poolAlgorithm === 'SOURCE_IP'
                                      ? 'Source IP'
                                      : 'Source IP Port'
                              }
                            />
                            <SectionCard.DataRow label="Pool protocol" value={poolProtocol} />
                            <SectionCard.DataRow
                              label="Pool admin state"
                              value={poolAdminState ? 'Up' : 'Down'}
                            />
                          </>
                        )}
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Member Section */}
                  <SectionCard isActive={activeSection === 'member'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['member']}
                      showDivider={activeSection === 'member'}
                      actions={
                        sectionStatus['member'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('member')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'member' && (
                      <SectionCard.Content gap={6} className="pt-2">
                        {/* Ports Section */}
                        <VStack gap={3} align="stretch">
                          <VStack gap={2} align="start">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Ports
                            </span>
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Select one of the IP addresses associated with the port to add as a
                              member.
                            </p>
                          </VStack>

                          {/* Search and Pagination */}
                          <VStack gap={3} align="start">
                            <SearchInput
                              placeholder="Search ports by attributes"
                              value={memberPortSearch}
                              onChange={(e) => setMemberPortSearch(e.target.value)}
                              className="w-[var(--search-input-width)]"
                            />
                            <Pagination
                              currentPage={memberPortPage}
                              totalPages={5}
                              totalItems={115}
                              onPageChange={setMemberPortPage}
                            />
                          </VStack>

                          {/* Ports Table */}
                          <div className="w-full border border-[var(--color-border-default)] rounded-md overflow-hidden">
                            {/* Table Header */}
                            <div className="flex bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                              <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                Name
                              </div>
                              <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                Attached instance
                              </div>
                              <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                IP Address
                              </div>
                              <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)] text-center">
                                Action
                              </div>
                            </div>
                            {/* Table Rows */}
                            {mockPorts.map((port) => (
                              <div
                                key={port.id}
                                className="flex items-center border-b border-[var(--color-border-default)] last:border-b-0 bg-[var(--color-surface-default)]"
                              >
                                {/* Name Cell */}
                                <div className="flex-1 px-3 py-2">
                                  <VStack gap={0.5} align="start">
                                    <HStack gap={1.5} align="center">
                                      <span className="text-label-md text-[var(--color-action-primary)]">
                                        {port.name}
                                      </span>
                                      <IconExternalLink
                                        size={12}
                                        className="text-[var(--color-action-primary)]"
                                      />
                                    </HStack>
                                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                                      ID: {port.id}
                                    </span>
                                  </VStack>
                                </div>
                                {/* Attached Instance Cell */}
                                <div className="flex-1 px-3 py-2">
                                  {port.attachedInstance ? (
                                    <VStack gap={0.5} align="start">
                                      <HStack gap={1.5} align="center">
                                        <span className="text-label-md text-[var(--color-action-primary)]">
                                          {port.attachedInstance}
                                        </span>
                                        <IconExternalLink
                                          size={12}
                                          className="text-[var(--color-action-primary)]"
                                        />
                                      </HStack>
                                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                                        ID: {port.attachedInstanceId}
                                      </span>
                                    </VStack>
                                  ) : (
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      -
                                    </span>
                                  )}
                                </div>
                                {/* IP Address Cell */}
                                <div className="flex-1 px-3 py-2 flex items-center">
                                  {port.ipAddresses.length > 0 ? (
                                    <Select
                                      options={port.ipAddresses.map((ip) => ({
                                        value: ip,
                                        label: ip,
                                      }))}
                                      value={portIpSelections[port.id] || port.ipAddresses[0]}
                                      onChange={(value) =>
                                        setPortIpSelections((prev) => ({
                                          ...prev,
                                          [port.id]: value,
                                        }))
                                      }
                                      style={{ width: '152px' }}
                                    />
                                  ) : (
                                    <span className="text-body-md text-[var(--color-text-subtle)]">
                                      -
                                    </span>
                                  )}
                                </div>
                                {/* Action Cell */}
                                <div className="flex-1 px-3 py-2 flex items-center justify-center">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconPlus size={12} />}
                                    disabled={port.ipAddresses.length === 0}
                                    onClick={() => {
                                      const selectedIp =
                                        portIpSelections[port.id] || port.ipAddresses[0];
                                      if (
                                        selectedIp &&
                                        !allocatedMembers.find(
                                          (m) => m.portId === port.id && m.ipAddress === selectedIp
                                        )
                                      ) {
                                        setAllocatedMembers((prev) => [
                                          ...prev,
                                          {
                                            id: `member-${Date.now()}`,
                                            portId: port.id,
                                            portName: port.name,
                                            ipAddress: selectedIp,
                                            instanceName: port.attachedInstance,
                                            weight: 1,
                                            monitorPort: 80,
                                            monitorAddress: selectedIp,
                                            backup: false,
                                            adminStateUp: true,
                                          },
                                        ]);
                                      }
                                    }}
                                  >
                                    Add Member
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </VStack>

                        {/* Allocated Members Section */}
                        <VStack gap={3} align="start">
                          <VStack gap={2} align="start">
                            <HStack gap={1} align="center">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Allocated Members
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </HStack>
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Adding a member registers a new backend server to the pool, while
                              removing a member excludes it from load balancing.
                            </p>
                          </VStack>

                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconPlus size={12} />}
                            onClick={() => {
                              setExternalMembers((prev) => [
                                ...prev,
                                {
                                  id: `ext-${Date.now()}`,
                                  ipAddress: '',
                                  port: undefined,
                                  weight: 1,
                                },
                              ]);
                            }}
                          >
                            Add External Member
                          </Button>

                          {/* External Member Rows */}
                          {externalMembers.map((extMember) => (
                            <div
                              key={extMember.id}
                              className="w-full border border-[var(--color-border-default)] rounded-md p-3 flex gap-3 items-end bg-[var(--color-surface-default)]"
                            >
                              {/* IP Address */}
                              <div className="flex-1 flex flex-col gap-2">
                                <span className="text-label-md text-[var(--color-text-default)]">
                                  IP Address
                                </span>
                                <Input
                                  placeholder="Enter IP address"
                                  value={extMember.ipAddress}
                                  onChange={(e) => {
                                    setExternalMembers((prev) =>
                                      prev.map((m) =>
                                        m.id === extMember.id
                                          ? { ...m, ipAddress: e.target.value }
                                          : m
                                      )
                                    );
                                  }}
                                  fullWidth
                                />
                              </div>
                              {/* Port */}
                              <div className="flex-1 flex flex-col gap-2">
                                <span className="text-label-md text-[var(--color-text-default)]">
                                  Port
                                </span>
                                <NumberInput
                                  value={extMember.port}
                                  onChange={(value) => {
                                    setExternalMembers((prev) =>
                                      prev.map((m) =>
                                        m.id === extMember.id ? { ...m, port: value } : m
                                      )
                                    );
                                  }}
                                  min={1}
                                  max={65535}
                                  fullWidth
                                />
                              </div>
                              {/* Weights */}
                              <div className="flex-1 flex flex-col gap-2">
                                <span className="text-label-md text-[var(--color-text-default)]">
                                  Weights
                                </span>
                                <NumberInput
                                  value={extMember.weight}
                                  onChange={(value) => {
                                    setExternalMembers((prev) =>
                                      prev.map((m) =>
                                        m.id === extMember.id ? { ...m, weight: value } : m
                                      )
                                    );
                                  }}
                                  min={1}
                                  max={256}
                                  fullWidth
                                />
                              </div>
                              {/* Remove Button */}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setExternalMembers((prev) =>
                                    prev.filter((m) => m.id !== extMember.id)
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}

                          {/* Allocated Members Table (shown when there are members) */}
                          {allocatedMembers.length > 0 && (
                            <div className="w-full border border-[var(--color-border-default)] rounded-md overflow-hidden">
                              <div className="flex bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                                <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                  IP Address
                                </div>
                                <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                  Port
                                </div>
                                <div className="flex-1 px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                                  Instance
                                </div>
                                <div className="w-[80px] px-3 py-2 text-label-sm text-[var(--color-text-default)] text-center">
                                  Action
                                </div>
                              </div>
                              {allocatedMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center border-b border-[var(--color-border-default)] last:border-b-0 bg-[var(--color-surface-default)]"
                                >
                                  <div className="flex-1 px-3 py-2 text-body-md text-[var(--color-text-default)]">
                                    {member.ipAddress}
                                  </div>
                                  <div className="flex-1 px-3 py-2">
                                    <VStack gap={0.5} align="start">
                                      <span className="text-body-md text-[var(--color-action-primary)]">
                                        {member.portName}
                                      </span>
                                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                                        ID: {member.portId}
                                      </span>
                                    </VStack>
                                  </div>
                                  <div className="flex-1 px-3 py-2 text-body-md text-[var(--color-text-default)]">
                                    {member.instanceName || '-'}
                                  </div>
                                  <div className="w-[80px] px-3 py-2 flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setAllocatedMembers((prev) =>
                                          prev.filter((m) => m.id !== member.id)
                                        )
                                      }
                                    >
                                      <IconTrash
                                        size={14}
                                        className="text-[var(--color-state-danger)]"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </VStack>

                        {/* Buttons */}
                        <HStack gap={2} align="center" justify="end" className="w-full">
                          <Button variant="secondary" onClick={() => goToNextSection('member')}>
                            Skip
                          </Button>
                          <Button variant="primary" onClick={() => goToNextSection('member')}>
                            Next
                          </Button>
                        </HStack>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['member'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Allocated Members"
                          value={
                            allocatedMembers.length > 0
                              ? `${allocatedMembers.length} member(s)`
                              : 'Skipped'
                          }
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Health Monitor Section */}
                  <SectionCard isActive={activeSection === 'health-monitor'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['health-monitor']}
                      showDivider={activeSection === 'health-monitor'}
                      actions={
                        sectionStatus['health-monitor'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('health-monitor')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'health-monitor' && (
                      <SectionCard.Content gap={6} className="pt-2">
                        {/* Create Health Monitor toggle */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Create Health Monitor
                          </span>
                          <HStack gap={2} align="center">
                            <Toggle
                              checked={createHealthMonitor}
                              onChange={setCreateHealthMonitor}
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              {createHealthMonitor ? 'Yes' : 'No'}
                            </span>
                          </HStack>
                        </VStack>

                        {createHealthMonitor && (
                          <>
                            {/* Health monitor name */}
                            <FormField>
                              <FormField.Label>Health monitor name</FormField.Label>
                              <FormField.Control>
                                <Input
                                  placeholder="Enter health monitor name"
                                  value={healthMonitorName}
                                  onChange={(e) => setHealthMonitorName(e.target.value)}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                You can use letters, numbers, and special characters (+=,.@-_), and
                                the length must be between 2-128 characters.
                              </FormField.HelperText>
                            </FormField>

                            {/* Health monitor type */}
                            <FormField required>
                              <FormField.Label>Health monitor type</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Select the health check method used to monitor backend members.
                              </p>
                              <FormField.Control>
                                <Select
                                  options={healthMonitorTypeOptions}
                                  value={healthMonitorType}
                                  onChange={setHealthMonitorType}
                                  placeholder="Select type"
                                  style={{ width: '240px' }}
                                />
                              </FormField.Control>
                            </FormField>

                            {/* Interval (sec) */}
                            <FormField required>
                              <FormField.Label>Interval (sec)</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Specifies the interval in seconds between health checks.
                              </p>
                              <FormField.Control>
                                <NumberInput
                                  value={healthMonitorInterval}
                                  onChange={setHealthMonitorInterval}
                                  min={1}
                                  max={3600}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                Only numbers are allowed, and the value must be between 1–3,600
                                seconds.
                              </FormField.HelperText>
                            </FormField>

                            {/* Timeout (sec) */}
                            <FormField required>
                              <FormField.Label>Timeout (sec)</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Specifies the timeout in seconds for health check responses.
                              </p>
                              <FormField.Control>
                                <NumberInput
                                  value={healthMonitorTimeout}
                                  onChange={setHealthMonitorTimeout}
                                  min={1}
                                  max={3599}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                Only numbers are allowed, and the value must be between 1–3,599
                                seconds.
                              </FormField.HelperText>
                            </FormField>

                            {/* Max retries */}
                            <FormField required>
                              <FormField.Label>Max retries</FormField.Label>
                              <p className="text-body-md text-[var(--color-text-subtle)] mb-2">
                                Specifies the number of retries before marking the health check as
                                failed.
                              </p>
                              <FormField.Control>
                                <NumberInput
                                  value={healthMonitorMaxRetries}
                                  onChange={setHealthMonitorMaxRetries}
                                  min={3}
                                  max={10}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                Only numbers are allowed, and the value must be between 3–10.
                              </FormField.HelperText>
                            </FormField>

                            {/* Health monitor admin state */}
                            <VStack gap={2} align="start">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Health monitor admin state
                              </span>
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                Set the administrative state of the health monitor. 'UP' enables
                                traffic handling, while 'DOWN' disables it.
                              </p>
                              <HStack gap={2} align="center">
                                <Toggle
                                  checked={healthMonitorAdminState}
                                  onChange={setHealthMonitorAdminState}
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  {healthMonitorAdminState ? 'Up' : 'Down'}
                                </span>
                              </HStack>
                            </VStack>
                          </>
                        )}

                        <div className="flex items-center justify-end w-full">
                          <Button
                            variant="primary"
                            onClick={() => goToNextSection('health-monitor')}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['health-monitor'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Create Health Monitor"
                          value={createHealthMonitor ? 'Yes' : 'No'}
                        />
                        {createHealthMonitor && (
                          <>
                            <SectionCard.DataRow
                              label="Health monitor name"
                              value={healthMonitorName}
                            />
                            <SectionCard.DataRow
                              label="Health monitor type"
                              value={healthMonitorType}
                            />
                            <SectionCard.DataRow
                              label="Interval"
                              value={`${healthMonitorInterval} sec`}
                            />
                            <SectionCard.DataRow
                              label="Timeout"
                              value={`${healthMonitorTimeout} sec`}
                            />
                            <SectionCard.DataRow
                              label="Max retries"
                              value={healthMonitorMaxRetries.toString()}
                            />
                            <SectionCard.DataRow
                              label="Admin state"
                              value={healthMonitorAdminState ? 'Up' : 'Down'}
                            />
                          </>
                        )}
                      </SectionCard.Content>
                    )}
                  </SectionCard>
                </VStack>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={() => navigate('/compute/load-balancers')}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
