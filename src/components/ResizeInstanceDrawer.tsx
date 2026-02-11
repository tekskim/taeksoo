import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  SelectionIndicator,
  Select,
  NumberInput,
  Table,
  InlineMessage,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconHelp, IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceInfo {
  id: string;
  name: string;
  currentFlavor: {
    id: string;
    name: string;
    vcpu: number;
    ram: string;
    disk: string;
    ephemeralDisk: string;
    gpu: number;
    npu: number;
  };
}

export interface FlavorItem {
  id: string;
  name: string;
  vcpu: number;
  ram: string;
  disk: string;
  ephemeralDisk: string;
  internalBandwidth: string;
}

export interface QuotaInfo {
  vcpu: { used: number; total: number };
  ram: { used: number; total: number };
}

export interface ResizeInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  flavors?: FlavorItem[];
  quota?: QuotaInfo;
  onResize?: (
    targetFlavorId: string,
    approvalMethod: 'manual' | 'auto',
    autoConfirmMinutes?: number,
    autoConfirmAction?: string
  ) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFlavors: FlavorItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `flavor-${i + 1}`,
  name: 'm5.large',
  vcpu: 2,
  ram: '2GiB',
  disk: '50GiB',
  ephemeralDisk: '0GiB',
  internalBandwidth: '-',
}));

interface ComparisonRow {
  id: string;
  comparison: string;
  name: string;
  nameId: string;
  vcpu: string;
  ram: string;
  disk: string;
  ephemeralDisk: string;
  gpu: string;
  npu: string;
  isLink: boolean;
}

type FlavorTab = 'vcpu' | 'gpu' | 'npu' | 'custom';

/* ----------------------------------------
   ResizeInstanceDrawer Component
   ---------------------------------------- */

export function ResizeInstanceDrawer({
  isOpen,
  onClose,
  instance,
  flavors = mockFlavors,
  quota = { vcpu: { used: 5, total: 10 }, ram: { used: 10, total: 50 } },
  onResize,
}: ResizeInstanceDrawerProps) {
  const [flavorTab, setFlavorTab] = useState<FlavorTab>('vcpu');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);
  const [approvalMethod, setApprovalMethod] = useState<'manual' | 'auto'>('manual');
  const [autoConfirmMinutes, setAutoConfirmMinutes] = useState(5);
  const [autoConfirmAction, setAutoConfirmAction] = useState('confirm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Filter flavors based on search
  const filteredFlavors = flavors.filter((flavor) =>
    flavor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFlavors.length / ITEMS_PER_PAGE);
  const paginatedFlavors = filteredFlavors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedFlavor = flavors.find((f) => f.id === selectedFlavorId);

  // Flavor selection table columns
  const flavorColumns: TableColumn<FlavorItem>[] = [
    {
      key: 'radio',
      label: '',
      width: '40px',
      render: (_, row) => (
        <Radio
          name="flavor-select"
          value={row.id}
          checked={selectedFlavorId === row.id}
          onChange={() => setSelectedFlavorId(row.id)}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <span className="flex flex-col">
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : 17kfj123
          </span>
        </span>
      ),
    },
    { key: 'vcpu', label: 'vCPU', width: '80px', sortable: true },
    { key: 'ram', label: 'RAM', width: '80px', sortable: true },
    { key: 'disk', label: 'Disk', width: '80px', sortable: true },
    { key: 'ephemeralDisk', label: 'Ephemeral disk', width: '100px', sortable: true },
    {
      key: 'internalBandwidth',
      label: 'Internal network bandwidth',
      width: '140px',
      sortable: true,
    },
  ];

  const comparisonData: ComparisonRow[] = [
    {
      id: 'current',
      comparison: 'Current\nflavor',
      name: instance.currentFlavor.name,
      nameId: '90jkl567',
      vcpu: String(instance.currentFlavor.vcpu),
      ram: instance.currentFlavor.ram,
      disk: instance.currentFlavor.disk,
      ephemeralDisk: instance.currentFlavor.ephemeralDisk,
      gpu: String(instance.currentFlavor.gpu),
      npu: String(instance.currentFlavor.npu),
      isLink: true,
    },
    {
      id: 'target',
      comparison: 'Target\nflavor',
      name: selectedFlavor?.name ?? '-',
      nameId: selectedFlavor ? '90jkl567' : '',
      vcpu: selectedFlavor ? String(selectedFlavor.vcpu) : '-',
      ram: selectedFlavor?.ram ?? '-',
      disk: selectedFlavor?.disk ?? '-',
      ephemeralDisk: selectedFlavor?.ephemeralDisk ?? '-',
      gpu: '-',
      npu: '-',
      isLink: !!selectedFlavor,
    },
  ];

  const comparisonColumns: TableColumn<ComparisonRow>[] = [
    {
      key: 'comparison',
      label: 'Comparison',
      width: '90px',
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)] whitespace-pre-line">
          {value}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      width: '90px',
      render: (_, row) =>
        row.isLink ? (
          <span className="flex flex-col">
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-[var(--color-action-primary)] truncate">
                {row.name}
              </span>
              <IconExternalLink
                size={12}
                stroke={1.5}
                className="shrink-0 text-[var(--color-action-primary)]"
              />
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
              ID : {row.nameId}
            </span>
          </span>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
        ),
    },
    { key: 'vcpu', label: 'vCPU', width: '65px' },
    { key: 'ram', label: 'RAM', width: '65px' },
    { key: 'disk', label: 'Disk', width: '65px' },
    { key: 'ephemeralDisk', label: 'Ephemeral disk', width: '95px' },
    { key: 'gpu', label: 'GPU', width: '65px' },
    { key: 'npu', label: 'NPU', flex: 1 },
  ];

  const handleResize = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedFlavorId) return;
    setIsSubmitting(true);
    try {
      await onResize?.(
        selectedFlavorId,
        approvalMethod,
        approvalMethod === 'auto' ? autoConfirmMinutes : undefined,
        approvalMethod === 'auto' ? autoConfirmAction : undefined
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFlavorTab('vcpu');
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedFlavorId(null);
    setApprovalMethod('auto');
    setAutoConfirmMinutes(5);
    setAutoConfirmAction('confirm');
    setHasAttemptedSubmit(false);
    onClose();
  };

  // Calculate quota percentages
  const vcpuUsedPercent = (quota.vcpu.used / quota.vcpu.total) * 100;
  const ramUsedPercent = (quota.ram.used / quota.ram.total) * 100;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full">
            {/* vCPU Quota */}
            <VStack gap={2} className="w-full">
              <HStack justify="space-between" className="w-full">
                <span className="text-label-lg text-[var(--color-text-default)]">vCPU Quota</span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  {quota.vcpu.used}/{quota.vcpu.total}
                </span>
              </HStack>
              <div className="w-full h-1 flex pr-1">
                <div
                  className="h-1 rounded-lg bg-[var(--color-state-success)] z-[3] -mr-1"
                  style={{ width: `${vcpuUsedPercent}%` }}
                />
                <div
                  className="h-1 rounded-lg bg-green-200 z-[2] -mr-1"
                  style={{ width: `${vcpuUsedPercent}%` }}
                />
                <div className="flex-1 h-1 rounded-lg bg-[var(--color-border-subtle)] z-[1]" />
              </div>
            </VStack>

            {/* RAM Quota */}
            <VStack gap={2} className="w-full">
              <HStack justify="space-between" className="w-full">
                <span className="text-label-lg text-[var(--color-text-default)]">
                  RAM Quota (GiB)
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  {quota.ram.used}/{quota.ram.total}
                </span>
              </HStack>
              <div className="w-full h-1 flex pr-1">
                <div
                  className="h-1 rounded-lg bg-[var(--color-state-success)] z-[3] -mr-1"
                  style={{ width: `${ramUsedPercent}%` }}
                />
                <div
                  className="h-1 rounded-lg bg-green-200 z-[2] -mr-1"
                  style={{ width: `${ramUsedPercent}%` }}
                />
                <div className="flex-1 h-1 rounded-lg bg-[var(--color-border-subtle)] z-[1]" />
              </div>
            </VStack>
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleResize}
              disabled={isSubmitting}
              className="w-[152px] h-8"
            >
              {isSubmitting ? 'Resizing...' : 'Resize'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Resize Instance
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Change the flavor of this instance to adjust its vCPU, memory, or disk capacity.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            The instance will be stopped and restarted automatically during resize. All running
            processes and connections will be interrupted.
          </InlineMessage>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Flavor Section */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)]">Flavor</span>

          {/* Tabs */}
          <Tabs
            variant="underline"
            size="sm"
            value={flavorTab}
            onChange={(value) => setFlavorTab(value as FlavorTab)}
          >
            <TabList>
              <Tab value="vcpu">vCPU</Tab>
              <Tab value="gpu">GPU</Tab>
              <Tab value="npu">NPU</Tab>
              <Tab value="custom">Custom</Tab>
            </TabList>
          </Tabs>

          {/* Search */}
          <SearchInput
            placeholder="Search flavor by attributes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[280px]"
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFlavors.length}
            onPageChange={setCurrentPage}
          />

          {/* Flavor Table */}
          <VStack gap={2}>
            <Table<FlavorItem>
              columns={flavorColumns}
              data={paginatedFlavors}
              rowKey="id"
              onRowClick={(row) => setSelectedFlavorId(row.id)}
              emptyMessage="No flavors found"
            />
            <SelectionIndicator
              selectedItems={
                selectedFlavorId
                  ? [
                      {
                        id: selectedFlavorId,
                        label: flavors.find((f) => f.id === selectedFlavorId)?.name || '',
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedFlavorId(null)}
              emptyText="No item selected"
              error={!selectedFlavorId && hasAttemptedSubmit}
              errorMessage="Please select a flavor"
            />
          </VStack>
        </VStack>

        {/* Flavor Comparison Section */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)]">Flavor comparison</span>

          {/* Comparison Table */}
          <Table<ComparisonRow>
            columns={comparisonColumns}
            data={comparisonData}
            rowKey="id"
            emptyMessage="No comparison data"
          />
        </VStack>

        {/* Approval Method Section */}
        <VStack gap={3} className="pb-5">
          <span className="text-label-lg text-[var(--color-text-default)]">Approval method</span>

          <VStack gap={3}>
            {/* Manual confirm option */}
            <Radio
              name="approval-method"
              value="manual"
              checked={approvalMethod === 'manual'}
              onChange={() => setApprovalMethod('manual')}
              label="Manual confirm"
            />

            {/* Auto-confirm option */}
            <HStack gap={1.5} align="center">
              <Radio
                name="approval-method"
                value="auto"
                checked={approvalMethod === 'auto'}
                onChange={() => setApprovalMethod('auto')}
                label="Auto-confirm"
              />
              <IconHelp size={12} className="text-[var(--color-text-subtle)] cursor-help" />
            </HStack>
          </VStack>

          {/* Auto-confirm settings */}
          {approvalMethod === 'auto' && (
            <div className="w-full px-4 py-2 border border-[var(--color-border-default)] rounded-md flex items-center gap-6">
              <HStack gap={1.5} align="center">
                <span className="text-label-lg text-[var(--color-text-default)]">After</span>
                <NumberInput
                  value={autoConfirmMinutes}
                  onChange={setAutoConfirmMinutes}
                  min={1}
                  max={60}
                  className="w-[80px]"
                />
                <span className="text-body-md text-[var(--color-text-default)]">minutes,</span>
              </HStack>
              <HStack gap={1.5} align="center">
                <span className="text-label-lg text-[var(--color-text-default)]">do</span>
                <Select
                  value={autoConfirmAction}
                  onChange={(value) => setAutoConfirmAction(value)}
                  options={[
                    { value: 'confirm', label: 'Confirm' },
                    { value: 'revert', label: 'Revert' },
                  ]}
                  className="w-[120px]"
                />
              </HStack>
            </div>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}
