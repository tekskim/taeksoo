import { useState, useMemo } from 'react';
import { 
  Drawer, 
  Button, 
  Radio,
  InlineMessage,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  Table,
  Input,
  Select,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconHelpCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FlavorItem {
  id: string;
  name: string;
  vCPU: number;
  ram: string;
  disk: string;
  ephemeralDisk: string;
  gpu?: number;
  inter?: string;
}

export interface ResizeInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  currentFlavor: FlavorItem;
  flavors?: FlavorItem[];
  vcpuQuota?: { used: number; total: number };
  ramQuota?: { used: number; total: number };
  onResize?: (targetFlavorId: string, approvalMethod: 'manual' | 'auto') => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFlavors: FlavorItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `flavor-${i + 1}`,
  name: `m5.large`,
  vCPU: 2,
  ram: '2GiB',
  disk: '50GiB',
  ephemeralDisk: '0GiB',
  gpu: i % 3 === 0 ? 2 : undefined,
  inter: '-',
}));

const defaultCurrentFlavor: FlavorItem = {
  id: 'current-flavor',
  name: 'xlarge',
  vCPU: 2,
  ram: '2GiB',
  disk: '50GiB',
  ephemeralDisk: '0GiB',
  gpu: 2,
};

/* ----------------------------------------
   Quota Bar Component
   ---------------------------------------- */

function QuotaBar({ 
  label, 
  used, 
  total 
}: { 
  label: string; 
  used: number; 
  total: number 
}) {
  const percentage = Math.min((used / total) * 100, 100);
  const isWarning = percentage >= 80;
  
  return (
    <VStack gap={2} className="w-full">
      <HStack justifyContent="between" className="w-full">
        <span className="text-[14px] font-medium text-[var(--color-text-default)]">
          {label}
        </span>
        <span className="text-[12px] text-[var(--color-text-muted)]">
          {used}/{total}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${isWarning ? 'bg-[var(--color-state-warning)]' : 'bg-[var(--color-action-primary)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   ResizeInstanceDrawer Component
   ---------------------------------------- */

export function ResizeInstanceDrawer({
  isOpen,
  onClose,
  instanceName,
  currentFlavor = defaultCurrentFlavor,
  flavors = mockFlavors,
  vcpuQuota = { used: 5, total: 10 },
  ramQuota = { used: 10, total: 50 },
  onResize,
}: ResizeInstanceDrawerProps) {
  const [activeTab, setActiveTab] = useState('vcpu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);
  const [approvalMethod, setApprovalMethod] = useState<'manual' | 'auto'>('manual');
  const [autoConfirmMinutes, setAutoConfirmMinutes] = useState(5);
  const [autoConfirmAction, setAutoConfirmAction] = useState<'confirm' | 'revert'>('confirm');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  // Filter flavors based on search
  const filteredFlavors = useMemo(() => 
    flavors.filter(flavor =>
      flavor.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [flavors, searchTerm]
  );

  // Paginate
  const paginatedFlavors = filteredFlavors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedFlavor = flavors.find(f => f.id === selectedFlavorId);

  const flavorColumns: TableColumn<FlavorItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="resize-flavor-select"
          value={row.id}
          checked={selectedFlavorId === row.id}
          onChange={() => setSelectedFlavorId(row.id)}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/flavors/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.name}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    { key: 'vCPU', label: 'vCPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'disk', label: 'Disk' },
    { key: 'ephemeralDisk', label: 'Ephemeral Disk' },
    { key: 'inter', label: 'Inter' },
  ];

  const handleResize = async () => {
    if (!selectedFlavorId) return;
    setIsSubmitting(true);
    try {
      await onResize?.(selectedFlavorId, approvalMethod);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFlavorId(null);
    setSearchTerm('');
    setCurrentPage(1);
    setApprovalMethod('manual');
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
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
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Resize Instance
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Change the flavor of this instance to adjust its vCPU, memory, or disk capacity.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            The instance will be stopped and restarted automatically during resize. All running processes and connections will be interrupted.
          </InlineMessage>

          {/* Instance Info */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
              Instance
            </p>
            <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
              {instanceName}
            </p>
          </div>
        </VStack>

        {/* Flavor Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Flavor
          </h6>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="vcpu">vCPU</Tab>
              <Tab value="gpu">GPU</Tab>
              <Tab value="npu">NPU</Tab>
              <Tab value="custom">Custom</Tab>
            </TabList>
          </Tabs>

          {/* Search Input */}
          <SearchInput
            placeholder="Fine flavor with filters"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[280px]"
          />

          {/* Pagination */}
          <HStack gap={2} alignItems="center">
            <Pagination 
              totalItems={filteredFlavors.length} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredFlavors.length} items
            </span>
          </HStack>

          {/* Flavor Table */}
          <div className="overflow-auto">
            <Table<FlavorItem>
              columns={flavorColumns}
              data={paginatedFlavors}
              rowKey="id"
              selectedKeys={selectedFlavorId ? [selectedFlavorId] : []}
              onRowClick={(row) => setSelectedFlavorId(row.id)}
              emptyMessage="No flavors available"
            />
          </div>
        </VStack>

        {/* Flavor Comparison */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Flavor Comparison
          </h6>

          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-t-md">
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">Comparison</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">Name</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">vCPU</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">RAM</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">Disk</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">Ephemeral Disk</th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-[var(--color-text-default)]">GPU</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-[var(--color-border-default)]">
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">Current flavor</td>
                  <td className="px-3 py-2">
                    <HStack gap={1.5}>
                      <span className="text-[12px] font-medium text-[var(--color-link)]">
                        {currentFlavor.name}
                      </span>
                      <IconExternalLink size={12} className="text-[var(--color-link)]" />
                    </HStack>
                    <span className="text-[11px] text-[var(--color-text-subtle)] block">
                      ID : {currentFlavor.id}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{currentFlavor.vCPU}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{currentFlavor.ram}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{currentFlavor.disk}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{currentFlavor.ephemeralDisk}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{currentFlavor.gpu ?? '-'}</td>
                </tr>
                <tr className="border border-[var(--color-border-default)]">
                  <td className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">Target flavor</td>
                  {selectedFlavor ? (
                    <>
                      <td className="px-3 py-2">
                        <HStack gap={1.5}>
                          <span className="text-[12px] font-medium text-[var(--color-link)]">
                            {selectedFlavor.name}
                          </span>
                          <IconExternalLink size={12} className="text-[var(--color-link)]" />
                        </HStack>
                        <span className="text-[11px] text-[var(--color-text-subtle)] block">
                          ID : {selectedFlavor.id}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{selectedFlavor.vCPU}</td>
                      <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{selectedFlavor.ram}</td>
                      <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{selectedFlavor.disk}</td>
                      <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{selectedFlavor.ephemeralDisk}</td>
                      <td className="px-3 py-2 text-[12px] text-[var(--color-text-default)]">{selectedFlavor.gpu ?? '-'}</td>
                    </>
                  ) : (
                    <td colSpan={6} className="px-3 py-2 text-center text-[12px] text-[var(--color-text-muted)]">
                      Select a flavor
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>

        {/* Approval Method */}
        <VStack gap={3}>
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Approval Method
          </h6>
          <VStack gap={3}>
            <Radio
              name="approval-method"
              value="manual"
              checked={approvalMethod === 'manual'}
              onChange={() => setApprovalMethod('manual')}
              label="Manual confirm"
            />
            <HStack gap={1.5} alignItems="center">
              <Radio
                name="approval-method"
                value="auto"
                checked={approvalMethod === 'auto'}
                onChange={() => setApprovalMethod('auto')}
                label="Auto-confirm"
              />
              <IconHelpCircle size={16} className="text-[var(--color-text-subtle)]" />
            </HStack>
          </VStack>

          {/* Auto-confirm Settings */}
          {approvalMethod === 'auto' && (
            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-subtle)] rounded-md">
              <span className="text-[12px] text-[var(--color-text-default)]">After</span>
              <Input
                type="number"
                value={autoConfirmMinutes}
                onChange={(e) => setAutoConfirmMinutes(parseInt(e.target.value) || 5)}
                className="w-[80px]"
                min={1}
              />
              <span className="text-[12px] text-[var(--color-text-muted)]">minutes,</span>
              <span className="text-[12px] text-[var(--color-text-default)]">do</span>
              <Select
                value={autoConfirmAction}
                onChange={(value) => setAutoConfirmAction(value as 'confirm' | 'revert')}
                options={[
                  { label: 'Confirm', value: 'confirm' },
                  { label: 'Revert', value: 'revert' },
                ]}
                className="w-[120px]"
              />
            </div>
          )}
        </VStack>

        {/* Quota Section */}
        <VStack gap={4} className="w-full">
          <QuotaBar label="vCPU Quota" used={vcpuQuota.used} total={vcpuQuota.total} />
          <QuotaBar label="RAM Quota (GiB)" used={ramQuota.used} total={ramQuota.total} />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ResizeInstanceDrawer;

