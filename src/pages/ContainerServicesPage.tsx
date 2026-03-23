import { useState } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  SearchInput,
  Pagination,
  Chip,
  ContextMenu,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDownload,
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IpAddress {
  ip: string;
  type: 'Cluster' | 'External' | 'LoadBalancer';
}

// Structured target types per Service type
interface ClusterIPTarget {
  kind: 'clusterip';
  portName: string;
  targetPort: string;
  protocol: string;
}
interface ExternalNameTarget {
  kind: 'externalname';
  dnsName: string;
}
interface LoadBalancerTarget {
  kind: 'loadbalancer';
  listeningPort: string;
  protocol: string;
}
interface NodePortTarget {
  kind: 'nodeport';
  nodePort: string;
}

type ServiceTarget = ClusterIPTarget | ExternalNameTarget | LoadBalancerTarget | NodePortTarget;

interface ServiceRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  target: ServiceTarget[];
  selector: string[];
  type: 'ClusterIP' | 'ClusterIP (Headless)' | 'ExternalName' | 'LoadBalancer' | 'NodePort';
  ipAddresses?: IpAddress[];
  createdAt: string;
}

// Format a single ServiceTarget into display string
function formatTarget(t: ServiceTarget): string {
  switch (t.kind) {
    case 'clusterip':
      return `${t.portName} → ${t.targetPort}/${t.protocol}`;
    case 'externalname':
      return t.dnsName;
    case 'loadbalancer':
      return `${t.listeningPort}/${t.protocol}`;
    case 'nodeport':
      return `[Any Node]:${t.nodePort}`;
  }
}

// Renders first item as text + gray Badge (+N) with tooltip for the rest
function TextOverflowCell({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="text-body-md text-[var(--color-text-subtle)]">-</span>;
  }
  const [first, ...rest] = items;
  return (
    <span className="flex items-center gap-1 min-w-0">
      <span className="truncate text-body-md text-[var(--color-text-default)]">{first}</span>
      {rest.length > 0 && (
        <Tooltip
          content={
            <div className="flex flex-col gap-0.5 text-left">
              {rest.map((item, i) => (
                <span key={i} className="whitespace-nowrap">
                  {item}
                </span>
              ))}
            </div>
          }
        >
          <Badge theme="gray" type="subtle" size="sm" className="shrink-0 cursor-pointer">
            +{rest.length}
          </Badge>
        </Tooltip>
      )}
    </span>
  );
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const servicesData: ServiceRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-loadbalancer-service',
    namespace: 'namespaceName',
    target: [
      { kind: 'clusterip', portName: 'http', targetPort: '80', protocol: 'TCP' },
      { kind: 'clusterip', portName: 'https-internal', targetPort: '444', protocol: 'TCP' },
    ],
    selector: ['key1=value1'],
    type: 'ClusterIP',
    ipAddresses: [{ ip: '10.43.100.10', type: 'Cluster' }],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'backend-api-gateway-cluster-internal-service',
    namespace: 'namespaceName',
    target: [{ kind: 'clusterip', portName: 'myport', targetPort: '80', protocol: 'TCP' }],
    selector: ['key1=value1', 'key2=value2', 'key3=value3'],
    type: 'ClusterIP (Headless)',
    ipAddresses: [],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '3',
    status: 'None',
    name: 'external-database-connection-externalname-service',
    namespace: 'namespaceName',
    target: [{ kind: 'externalname', dnsName: 'my.database.example.com' }],
    selector: ['-'],
    type: 'ExternalName',
    ipAddresses: [],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'ingress-nginx-loadbalancer-external-service',
    namespace: 'namespaceName',
    target: [
      { kind: 'loadbalancer', listeningPort: '80', protocol: 'TCP' },
      { kind: 'loadbalancer', listeningPort: '443', protocol: 'TCP' },
    ],
    selector: ['key1=value1', 'key2=value2'],
    type: 'LoadBalancer',
    ipAddresses: [
      { ip: '10.43.136.100', type: 'Cluster' },
      { ip: '192.168.10.50', type: 'LoadBalancer' },
    ],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'legacy-application-nodeport-external-access-service',
    namespace: 'namespaceName',
    target: [{ kind: 'nodeport', nodePort: '31575' }],
    selector: ['key1=value1'],
    type: 'NodePort',
    ipAddresses: [
      { ip: '10.43.200.20', type: 'Cluster' },
      { ip: '203.0.113.5', type: 'External' },
    ],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '6',
    status: 'OK',
    name: 'multi-region-loadbalancer-with-many-external-ips',
    namespace: 'production',
    target: [
      { kind: 'loadbalancer', listeningPort: '80', protocol: 'TCP' },
      { kind: 'loadbalancer', listeningPort: '443', protocol: 'TCP' },
      { kind: 'loadbalancer', listeningPort: '8080', protocol: 'TCP' },
    ],
    selector: ['app=multi-region'],
    type: 'LoadBalancer',
    ipAddresses: [
      { ip: '10.43.50.100', type: 'Cluster' },
      { ip: '192.168.10.10', type: 'LoadBalancer' },
      { ip: '203.0.113.1', type: 'External' },
      { ip: '203.0.113.2', type: 'External' },
      { ip: '203.0.113.3', type: 'External' },
      { ip: '203.0.113.4', type: 'External' },
      { ip: '203.0.113.5', type: 'External' },
    ],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerServicesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const navigate = useNavigate();

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/services/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/services/create-yaml'),
    },
  ];

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(servicesData.length / rowsPerPage);
  const paginatedData = servicesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns configuration — order: status, name, namespace, type, target, ipAddresses, selector, createdAt, actions
  const columns: TableColumn<ServiceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      align: 'left',
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge theme="white" size="sm" className="max-w-[80px]">
            <span className="truncate">{value}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: ServiceRow) => (
        <TableLink title={value} onClick={() => navigate(`/container/services/${row.id}`)}>
          {value}
        </TableLink>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: 160,
      sortable: false,
      render: (value: ServiceTarget[]) => <TextOverflowCell items={value.map(formatTarget)} />,
    },
    {
      key: 'ipAddresses',
      label: 'IP Addresses',
      flex: 1,
      minWidth: 160,
      sortable: false,
      render: (value: IpAddress[] | undefined) => {
        const items = (value ?? []).map((item) => `${item.ip} (${item.type})`);
        return <TextOverflowCell items={items} />;
      },
    },
    {
      key: 'selector',
      label: 'Selector',
      flex: 1,
      minWidth: 140,
      sortable: false,
      render: (value: string[]) => {
        const items = value[0] === '-' ? [] : value;
        return <TextOverflowCell items={items} />;
      },
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-config',
            label: 'Edit config',
            onClick: () =>
              navigate(`/container/services/${row.id}/edit?name=${encodeURIComponent(row.name)}`),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/services/${row.id}/edit-yaml`),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => console.log('Delete:', row.id),
            danger: true,
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Services' }]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-services', 'Kubectl: ClusterName');
                  }
                }}
              >
                <IconTerminal2
                  size={16}
                  className={
                    shellPanel.isExpanded
                      ? 'text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }
                  stroke={1.5}
                />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          minHeight={300}
          sidebarOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Services"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                Create service
              </Button>
            </ContextMenu>
          }
        />

        {/* Toolbar */}
        <div className="flex flex-col gap-2">
          {/* Action Bar */}
          <HStack gap={2} align="center" className="w-full min-h-7">
            {/* Search */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search service by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
            </HStack>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--color-border-default)]" />

            {/* Actions */}
            <HStack gap={1} align="center">
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </HStack>
          </HStack>

          {/* Filter Bar */}
          {filters.length > 0 && (
            <HStack
              gap={2}
              justify="between"
              align="center"
              className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]"
            >
              <HStack gap={1} align="center">
                {filters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter.key}
                    value={filter.value}
                    onRemove={() => handleRemoveFilter(index)}
                  />
                ))}
              </HStack>
              <button
                onClick={handleClearFilters}
                className="text-label-sm text-[var(--color-action-primary)] hover:underline"
              >
                Clear filters
              </button>
            </HStack>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={servicesData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<ServiceRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </VStack>
    </PageShell>
  );
}

export default ContainerServicesPage;
