import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  FormField,
  HStack,
  Input,
  PageHeader,
  PageShell,
  SearchInput,
  Select,
  TabBar,
  TopBar,
  Breadcrumb,
  VStack,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash } from '@tabler/icons-react';

type CatalogAction = {
  id: string;
  description: string;
};

type ActionClassSection = {
  name: string;
  actions: CatalogAction[];
};

type DrawerAction = {
  id: string;
  description: string;
  resource: string;
};

const APP_OPTIONS = [
  { value: 'Compute', label: 'Compute' },
  { value: 'IAM', label: 'IAM' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Container', label: 'Container' },
  { value: 'Network', label: 'Network' },
] as const;

function catalogRows(pairs: readonly (readonly [string, string])[]): CatalogAction[] {
  return pairs.map(([id, description]) => ({ id, description }));
}

const READ_PAIRS = [
  ['compute.aggregate.read', 'Get Host Aggregate'],
  ['compute.autoscaling.read', 'Get Auto Scaling'],
  ['compute.az.read', 'Get Availability Zone'],
  ['compute.backup.read', 'Get Backup'],
  ['compute.flavor.read', 'Get Flavor'],
  ['compute.floatingip.read', 'Get Floating IP'],
  ['compute.gpu.read', 'Get GPU'],
  ['compute.host.read', 'Get Dedicated Host'],
  ['compute.hypervisor.read', 'Get Hypervisor'],
  ['compute.image.read', 'Get Image'],
  ['compute.instance.console', 'Console Access'],
  ['compute.instance.read', 'Get Instance'],
  ['compute.interface.read', 'Get Network Interface'],
  ['compute.keypair.read', 'Get Key Pair'],
  ['compute.metadata.read', 'Get Metadata'],
  ['compute.migration.read', 'Get Migration'],
  ['compute.placement.read', 'Get Placement Group'],
  ['compute.port.read', 'Get Port'],
  ['compute.schedule.read', 'Get Schedule'],
  ['compute.secgroup.read', 'Get Security Group'],
  ['compute.servergroup.read', 'Get Server Group'],
  ['compute.snapshot.read', 'Get Snapshot'],
  ['compute.template.read', 'Get Instance Template'],
  ['compute.usage.read', 'Get Usage Stats'],
  ['compute.volume.read', 'Get Volume Attachment'],
] as const;

const LIST_PAIRS = [
  ['compute.aggregate.list', 'List Host Aggregate'],
  ['compute.autoscaling.list', 'List Auto Scaling'],
  ['compute.az.list', 'List Availability Zone'],
  ['compute.backup.list', 'List Backup'],
  ['compute.flavor.list', 'List Flavor'],
  ['compute.floatingip.list', 'List Floating IP'],
  ['compute.gpu.list', 'List GPU'],
  ['compute.host.list', 'List Dedicated Host'],
  ['compute.hypervisor.list', 'List Hypervisor'],
  ['compute.image.list', 'List Image'],
  ['compute.instance.list', 'List Instances'],
  ['compute.interface.list', 'List Network Interface'],
  ['compute.keypair.list', 'List Key Pair'],
  ['compute.metadata.list', 'List Metadata'],
  ['compute.migration.list', 'List Migration'],
  ['compute.placement.list', 'List Placement Group'],
  ['compute.port.list', 'List Port'],
  ['compute.schedule.list', 'List Schedule'],
  ['compute.secgroup.list', 'List Security Group'],
  ['compute.servergroup.list', 'List Server Group'],
  ['compute.snapshot.list', 'List Snapshot'],
  ['compute.template.list', 'List Instance Template'],
  ['compute.usage.list', 'List Usage Stats'],
  ['compute.volume.list', 'List Volume Attachment'],
] as const;

const WRITE_PAIRS = [
  ['compute.aggregate.write', 'Create/Update Host Aggregate'],
  ['compute.autoscaling.write', 'Create/Update Auto Scaling'],
  ['compute.az.write', 'Create/Update Availability Zone'],
  ['compute.backup.write', 'Create/Update Backup'],
  ['compute.flavor.write', 'Create/Update Flavor'],
  ['compute.floatingip.write', 'Create/Update Floating IP'],
  ['compute.gpu.write', 'Create/Update GPU'],
  ['compute.host.write', 'Create/Update Dedicated Host'],
  ['compute.hypervisor.write', 'Create/Update Hypervisor'],
  ['compute.image.write', 'Create/Update Image'],
  ['compute.instance.write', 'Create/Update Instance'],
  ['compute.interface.write', 'Create/Update Network Interface'],
  ['compute.keypair.write', 'Create/Update Key Pair'],
  ['compute.metadata.write', 'Create/Update Metadata'],
  ['compute.migration.write', 'Create/Update Migration'],
  ['compute.placement.write', 'Create/Update Placement Group'],
  ['compute.port.write', 'Create/Update Port'],
  ['compute.schedule.write', 'Create/Update Schedule'],
  ['compute.secgroup.write', 'Create/Update Security Group'],
  ['compute.servergroup.write', 'Create/Update Server Group'],
  ['compute.snapshot.write', 'Create/Update Snapshot'],
  ['compute.template.write', 'Create/Update Instance Template'],
  ['compute.usage.write', 'Create/Update Usage Stats'],
  ['compute.volume.write', 'Create/Update Volume Attachment'],
] as const;

const DELETE_PAIRS = [
  ['compute.aggregate.delete', 'Delete Host Aggregate'],
  ['compute.autoscaling.delete', 'Delete Auto Scaling'],
  ['compute.az.delete', 'Delete Availability Zone'],
  ['compute.backup.delete', 'Delete Backup'],
  ['compute.flavor.delete', 'Delete Flavor'],
  ['compute.floatingip.delete', 'Delete Floating IP'],
  ['compute.gpu.delete', 'Delete GPU'],
  ['compute.host.delete', 'Delete Dedicated Host'],
  ['compute.hypervisor.delete', 'Delete Hypervisor'],
  ['compute.image.delete', 'Delete Image'],
  ['compute.instance.delete', 'Delete Instance'],
  ['compute.interface.delete', 'Delete Network Interface'],
  ['compute.keypair.delete', 'Delete Key Pair'],
  ['compute.metadata.delete', 'Delete Metadata'],
  ['compute.migration.delete', 'Delete Migration'],
  ['compute.placement.delete', 'Delete Placement Group'],
  ['compute.port.delete', 'Delete Port'],
  ['compute.schedule.delete', 'Delete Schedule'],
  ['compute.secgroup.delete', 'Delete Security Group'],
  ['compute.servergroup.delete', 'Delete Server Group'],
  ['compute.snapshot.delete', 'Delete Snapshot'],
  ['compute.template.delete', 'Delete Instance Template'],
  ['compute.usage.delete', 'Delete Usage Stats'],
  ['compute.volume.delete', 'Delete Volume Attachment'],
] as const;

const ADMIN_PAIRS = [
  ['compute.autoscaling.admin', 'Auto Scaling Full Admin'],
  ['compute.gpu.admin', 'GPU Full Admin'],
  ['compute.image.admin', 'Image Full Admin'],
  ['compute.instance.admin', 'Instances Full Admin'],
  ['compute.keypair.admin', 'Key Pair Full Admin'],
  ['compute.secgroup.admin', 'Security Group Full Admin'],
  ['compute.snapshot.admin', 'Snapshot Full Admin'],
] as const;

const COMPUTE_ACTION_CLASSES: ActionClassSection[] = [
  { name: 'Read', actions: catalogRows(READ_PAIRS) },
  { name: 'List', actions: catalogRows(LIST_PAIRS) },
  { name: 'Write', actions: catalogRows(WRITE_PAIRS) },
  { name: 'Delete', actions: catalogRows(DELETE_PAIRS) },
  { name: 'Admin', actions: catalogRows(ADMIN_PAIRS) },
];

const ACTION_CLASSES_BY_APP: Record<string, ActionClassSection[]> = {
  Compute: COMPUTE_ACTION_CLASSES,
};

const DRAWER_ACTIONS: DrawerAction[] = [
  { id: 'audit.alert.list', description: 'List Alert', resource: 'alert' },
  { id: 'audit.alert.read', description: 'Get Alert', resource: 'alert' },
  { id: 'audit.alert.write', description: 'Create/Update Alert', resource: 'alert' },
  { id: 'audit.alert.delete', description: 'Delete Alert', resource: 'alert' },
  { id: 'audit.alert.admin', description: 'Alert Full Admin', resource: 'alert' },
  { id: 'audit.anomaly.list', description: 'List Anomaly Detection', resource: 'anomaly' },
  { id: 'audit.anomaly.read', description: 'Get Anomaly Detection', resource: 'anomaly' },
  {
    id: 'audit.anomaly.write',
    description: 'Create/Update Anomaly Detection',
    resource: 'anomaly',
  },
  { id: 'audit.anomaly.delete', description: 'Delete Anomaly Detection', resource: 'anomaly' },
  { id: 'audit.archive.list', description: 'List Archive', resource: 'archive' },
  { id: 'audit.archive.read', description: 'Get Archive', resource: 'archive' },
  { id: 'audit.archive.write', description: 'Create/Update Archive', resource: 'archive' },
  { id: 'audit.archive.delete', description: 'Delete Archive', resource: 'archive' },
  { id: 'audit.bookmark.list', description: 'List Bookmark', resource: 'bookmark' },
  { id: 'audit.bookmark.read', description: 'Get Bookmark', resource: 'bookmark' },
  { id: 'audit.bookmark.write', description: 'Create/Update Bookmark', resource: 'bookmark' },
  { id: 'audit.bookmark.delete', description: 'Delete Bookmark', resource: 'bookmark' },
  { id: 'audit.channel.list', description: 'List Channel', resource: 'channel' },
  { id: 'audit.channel.read', description: 'Get Channel', resource: 'channel' },
  { id: 'audit.channel.write', description: 'Create/Update Channel', resource: 'channel' },
  { id: 'audit.channel.delete', description: 'Delete Channel', resource: 'channel' },
  { id: 'audit.compliance.list', description: 'List Compliance Check', resource: 'compliance' },
  { id: 'audit.compliance.read', description: 'Get Compliance Check', resource: 'compliance' },
  {
    id: 'audit.compliance.write',
    description: 'Create/Update Compliance Check',
    resource: 'compliance',
  },
  { id: 'audit.compliance.delete', description: 'Delete Compliance Check', resource: 'compliance' },
  {
    id: 'audit.compliance.admin',
    description: 'Compliance Check Full Admin',
    resource: 'compliance',
  },
  { id: 'audit.dashboard.list', description: 'List Dashboard', resource: 'dashboard' },
  { id: 'audit.dashboard.read', description: 'Get Dashboard', resource: 'dashboard' },
  { id: 'audit.dashboard.write', description: 'Create/Update Dashboard', resource: 'dashboard' },
  { id: 'audit.dashboard.delete', description: 'Delete Dashboard', resource: 'dashboard' },
  { id: 'audit.event.list', description: 'List Event', resource: 'event' },
  { id: 'audit.event.read', description: 'Get Event', resource: 'event' },
  { id: 'audit.event.write', description: 'Create/Update Event', resource: 'event' },
  { id: 'audit.event.delete', description: 'Delete Event', resource: 'event' },
  { id: 'audit.export.list', description: 'List Export', resource: 'export' },
  { id: 'audit.export.read', description: 'Get Export', resource: 'export' },
  { id: 'audit.export.write', description: 'Create/Update Export', resource: 'export' },
  { id: 'audit.export.delete', description: 'Delete Export', resource: 'export' },
  { id: 'audit.filter.list', description: 'List Filter', resource: 'filter' },
  { id: 'audit.filter.read', description: 'Get Filter', resource: 'filter' },
  { id: 'audit.filter.write', description: 'Create/Update Filter', resource: 'filter' },
  { id: 'audit.filter.delete', description: 'Delete Filter', resource: 'filter' },
  { id: 'audit.integration.list', description: 'List Integration', resource: 'integration' },
  { id: 'audit.integration.read', description: 'Get Integration', resource: 'integration' },
  {
    id: 'audit.integration.write',
    description: 'Create/Update Integration',
    resource: 'integration',
  },
  { id: 'audit.integration.delete', description: 'Delete Integration', resource: 'integration' },
  { id: 'audit.report.list', description: 'List Report', resource: 'report' },
  { id: 'audit.report.read', description: 'Get Report', resource: 'report' },
  { id: 'audit.report.write', description: 'Create/Update Report', resource: 'report' },
  { id: 'audit.report.delete', description: 'Delete Report', resource: 'report' },
  { id: 'audit.webhook.list', description: 'List Webhook', resource: 'webhook' },
  { id: 'audit.webhook.read', description: 'Get Webhook', resource: 'webhook' },
  { id: 'audit.webhook.write', description: 'Create/Update Webhook', resource: 'webhook' },
  { id: 'audit.webhook.delete', description: 'Delete Webhook', resource: 'webhook' },
];

function groupByResource(actions: DrawerAction[]): { resource: string; actions: DrawerAction[] }[] {
  const map = new Map<string, DrawerAction[]>();
  for (const action of actions) {
    const group = map.get(action.resource) ?? [];
    group.push(action);
    map.set(action.resource, group);
  }
  return Array.from(map, ([resource, acts]) => ({ resource, actions: acts }));
}

export default function IAMActionCatalogPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string>('Compute');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerClassName, setDrawerClassName] = useState('');
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerSelectAll, setDrawerSelectAll] = useState(false);
  const [drawerSelected, setDrawerSelected] = useState<Set<string>>(new Set());

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Action catalog' }];

  const baseClasses = ACTION_CLASSES_BY_APP[selectedApp] ?? [];

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const mapped = baseClasses.map((section) => ({
      ...section,
      actions: section.actions.filter((action) => {
        if (!q) return true;
        return action.id.toLowerCase().includes(q) || action.description.toLowerCase().includes(q);
      }),
    }));
    if (!q) return mapped;
    return mapped.filter((s) => s.actions.length > 0);
  }, [baseClasses, searchQuery]);

  const filteredDrawerActions = useMemo(() => {
    const q = drawerSearch.trim().toLowerCase();
    if (!q) return DRAWER_ACTIONS;
    return DRAWER_ACTIONS.filter(
      (a) => a.id.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }, [drawerSearch]);

  const drawerGroups = useMemo(
    () => groupByResource(filteredDrawerActions),
    [filteredDrawerActions]
  );

  const handleOpenDrawer = () => {
    setDrawerClassName('');
    setDrawerSearch('');
    setDrawerSelectAll(false);
    setDrawerSelected(new Set());
    setIsDrawerOpen(true);
  };

  const handleToggleAction = (actionId: string) => {
    setDrawerSelected((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  };

  const handleToggleAll = (checked: boolean) => {
    setDrawerSelectAll(checked);
    if (checked) {
      setDrawerSelected(new Set(filteredDrawerActions.map((a) => a.id)));
    } else {
      setDrawerSelected(new Set());
    }
  };

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <PageHeader title="Action catalog" />

        <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 bg-[var(--color-surface-default)]">
          <VStack gap={6}>
            <VStack gap={4}>
              <VStack gap={0}>
                <span className="text-label-lg text-[var(--color-text-default)]">App</span>
              </VStack>
              <Select
                options={[...APP_OPTIONS]}
                value={selectedApp}
                onChange={setSelectedApp}
                className="w-[240px]"
              />
            </VStack>

            <VStack gap={4}>
              <HStack justify="between" align="start" gap={4} className="w-full">
                <VStack gap={1} className="min-w-0 flex-1">
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Actions by class
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    Catalog actions assigned to each action class for the selected app.
                  </span>
                </VStack>
                <Button variant="primary" size="md" className="shrink-0" onClick={handleOpenDrawer}>
                  Add action class
                </Button>
              </HStack>

              <SearchInput
                placeholder="Search action"
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px]"
              />

              <VStack gap={4} className="w-full">
                {filteredSections.length === 0 ? (
                  <p className="text-body-md text-[var(--color-text-subtle)] py-4">
                    No action classes match your search for this app.
                  </p>
                ) : (
                  filteredSections.map((section) => (
                    <div
                      key={section.name}
                      className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-[13px] py-[9px]"
                    >
                      <VStack gap={2}>
                        <div className="flex items-center justify-between w-full">
                          <HStack gap={2} align="center">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              {section.name}
                            </span>
                            <Badge variant="info" size="sm">
                              {section.actions.length}
                            </Badge>
                          </HStack>
                          <HStack gap={2}>
                            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconTrash size={12} />}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </div>
                        <div className="flex flex-col">
                          {section.actions.map((action) => (
                            <p
                              key={action.id}
                              className="font-mono text-body-md text-[var(--color-text-default)] leading-[18px]"
                            >
                              {action.id}
                              {action.description}
                            </p>
                          ))}
                        </div>
                      </VStack>
                    </div>
                  ))
                )}
              </VStack>
            </VStack>
          </VStack>
        </div>
      </VStack>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add action class"
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsDrawerOpen(false)} className="flex-1">
              Add
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <FormField label="Action class name" required>
            <Input
              placeholder="Enter policy name"
              fullWidth
              value={drawerClassName}
              onChange={(e) => setDrawerClassName(e.target.value)}
            />
          </FormField>

          <VStack gap={4}>
            <span className="text-label-lg text-[var(--color-text-default)]">Actions</span>

            <VStack gap={2}>
              <SearchInput
                placeholder="Search actions"
                size="sm"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                className="w-[280px]"
              />
              <Checkbox
                label="All actions"
                checked={drawerSelectAll}
                onChange={(e) => handleToggleAll(e.target.checked)}
              />
              <span className="text-label-sm text-[var(--color-text-subtle)]">
                {drawerSelected.size} selected / {filteredDrawerActions.length} items
              </span>
            </VStack>

            <VStack gap={2} className="w-full">
              {drawerGroups.map((group) => {
                const selectedInGroup = group.actions.filter((a) =>
                  drawerSelected.has(a.id)
                ).length;
                return (
                  <div key={group.resource} className="w-full">
                    <div className="flex items-center justify-between bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)] px-3 py-1.5">
                      <span className="text-label-sm text-[var(--color-text-default)]">
                        {group.resource}
                      </span>
                      {selectedInGroup > 0 ? (
                        <Badge variant="info" size="sm">
                          {selectedInGroup}/{group.actions.length}
                        </Badge>
                      ) : (
                        <Badge theme="white" size="sm">
                          {group.actions.length}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col">
                      {group.actions.map((action) => (
                        <label
                          key={action.id}
                          className={`flex items-start gap-2 px-2 py-2 cursor-pointer rounded-[var(--radius-sm)] ${drawerSelected.has(action.id) ? 'bg-[var(--color-state-info-bg)]' : 'hover:bg-[var(--color-surface-subtle)]'}`}
                        >
                          <Checkbox
                            checked={drawerSelected.has(action.id)}
                            onChange={() => handleToggleAction(action.id)}
                            className="mt-0.5"
                          />
                          <VStack gap={0.5} className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] leading-[14px] text-[var(--color-text-default)]">
                              {action.id}
                            </span>
                            <span className="text-body-sm text-[var(--color-text-muted)]">
                              {action.description}
                            </span>
                          </VStack>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </VStack>
          </VStack>
        </VStack>
      </Drawer>
    </PageShell>
  );
}
