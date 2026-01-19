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
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle, IconHelp, IconChevronDown, IconExternalLink } from '@tabler/icons-react';

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
  onResize?: (targetFlavorId: string, approvalMethod: 'manual' | 'auto', autoConfirmMinutes?: number, autoConfirmAction?: string) => void;
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

  const selectedFlavor = flavors.find(f => f.id === selectedFlavorId);

  const handleResize = async () => {
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
          <VStack gap={6} className="w-full px-0 pt-4 border-t border-[var(--color-border-subtle)]">
            {/* vCPU Quota */}
            <VStack gap={2} className="w-full">
              <HStack justify="space-between" className="w-full">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">vCPU Quota</span>
                <span className="text-[12px] text-[var(--color-text-default)]">{quota.vcpu.used}/{quota.vcpu.total}</span>
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
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">RAM Quota (GiB)</span>
                <span className="text-[12px] text-[var(--color-text-default)]">{quota.ram.used}/{quota.ram.total}</span>
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
          <HStack gap={2} justify="center" className="w-full pt-4 border-t border-[var(--color-border-subtle)]">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              size="md"
              className="w-[152px]"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleResize}
              disabled={isSubmitting || !selectedFlavorId}
              size="md"
              className="w-[152px]"
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
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Resize Instance
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Change the flavor of this instance to adjust its vCPU, memory, or disk capacity.
            </p>
          </VStack>

          {/* Warning Message */}
          <div className="w-full p-3 bg-[var(--color-state-danger-bg)] rounded-lg flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              The instance will be stopped and restarted automatically during resize. All running processes and connections will be interrupted.
            </p>
          </div>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-subtle)] mb-1.5">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Flavor Section */}
        <VStack gap={3}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Flavor</span>

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
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
              <div style={{ width: '120px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">vCPU</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">RAM</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Disk</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Ephemeral Disk</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '140px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Internal Network Bandwidth</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Body */}
            <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {paginatedFlavors.map((flavor) => (
                <div
                  key={flavor.id}
                  onClick={() => setSelectedFlavorId(flavor.id)}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedFlavorId === flavor.id
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                >
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center">
                    <Radio
                      name="flavor-select"
                      value={flavor.id}
                      checked={selectedFlavorId === flavor.id}
                      onChange={() => setSelectedFlavorId(flavor.id)}
                    />
                  </div>
                  <div style={{ width: '120px', flexShrink: 0 }} className="flex flex-col justify-center px-3 py-2 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{flavor.name}</span>
                      <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : 17kfj123</span>
                  </div>
                  <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{flavor.vcpu}</span>
                  </div>
                  <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{flavor.ram}</span>
                  </div>
                  <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{flavor.disk}</span>
                  </div>
                  <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{flavor.ephemeralDisk}</span>
                  </div>
                  <div style={{ width: '140px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{flavor.internalBandwidth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Indicator */}
          <SelectionIndicator
            style={{ width: '648px' }}
            selectedItems={selectedFlavorId ? [{ id: selectedFlavorId, label: flavors.find(f => f.id === selectedFlavorId)?.name || '' }] : []}
            onRemove={() => setSelectedFlavorId(null)}
            emptyText="No item selected"
          />
        </VStack>

        {/* Flavor Comparison Section */}
        <VStack gap={3}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Flavor Comparison</span>

          {/* Comparison Table */}
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '90px', flexShrink: 0 }} className="flex items-center px-3">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Comparison</span>
              </div>
              <div style={{ width: '90px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">vCPU</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">RAM</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Disk</span>
              </div>
              <div style={{ width: '95px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Ephemeral Disk</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">GPU</span>
              </div>
              <div style={{ width: '113px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">NPU</span>
              </div>
            </div>

            {/* Current Flavor Row */}
            <div style={{ display: 'flex', width: '648px', minHeight: '40px', marginTop: '4px' }} className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '90px', flexShrink: 0 }} className="flex items-center justify-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)] text-center">Current<br/>flavor</span>
              </div>
              <div style={{ width: '90px', flexShrink: 0 }} className="flex flex-col justify-center px-3 py-2 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{instance.currentFlavor.name}</span>
                  <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                </div>
                <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : 90jkl567</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.vcpu}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.ram}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.disk}</span>
              </div>
              <div style={{ width: '95px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.ephemeralDisk}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.gpu}</span>
              </div>
              <div style={{ width: '113px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentFlavor.npu}</span>
              </div>
            </div>

            {/* Target Flavor Row */}
            <div style={{ display: 'flex', width: '648px', minHeight: '40px', marginTop: '4px' }} className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '90px', flexShrink: 0 }} className="flex items-center justify-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)] text-center">Target<br/>flavor</span>
              </div>
              <div style={{ width: '90px', flexShrink: 0 }} className="flex flex-col justify-center px-3 py-2 overflow-hidden">
                {selectedFlavor ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{selectedFlavor.name}</span>
                      <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : 90jkl567</span>
                  </>
                ) : (
                  <span className="text-[12px] text-[var(--color-text-subtle)]">-</span>
                )}
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{selectedFlavor?.vcpu ?? '-'}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{selectedFlavor?.ram ?? '-'}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{selectedFlavor?.disk ?? '-'}</span>
              </div>
              <div style={{ width: '95px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">{selectedFlavor?.ephemeralDisk ?? '-'}</span>
              </div>
              <div style={{ width: '65px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">-</span>
              </div>
              <div style={{ width: '113px', flexShrink: 0 }} className="flex items-center px-3 py-2">
                <span className="text-[12px] text-[var(--color-text-default)]">-</span>
              </div>
            </div>
          </div>
        </VStack>

        {/* Approval Method Section */}
        <VStack gap={3}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Approval Method</span>
          
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
              <IconHelp size={16} className="text-[var(--color-text-subtle)] cursor-help" />
            </HStack>
          </VStack>

          {/* Auto-confirm settings */}
          {approvalMethod === 'auto' && (
            <div className="w-full px-4 py-2 border border-[var(--color-border-default)] rounded-md flex items-center gap-6">
              <HStack gap={1.5} align="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">After</span>
                <NumberInput
                  value={autoConfirmMinutes}
                  onChange={setAutoConfirmMinutes}
                  min={1}
                  max={60}
                  className="w-[80px]"
                />
                <span className="text-[12px] text-[var(--color-text-default)]">minutes,</span>
              </HStack>
              <HStack gap={1.5} align="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">do</span>
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
