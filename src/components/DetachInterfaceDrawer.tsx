import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Radio,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InterfaceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface DetachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  interfaces?: InterfaceItem[];
  onDetach?: (interfaceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInterfaces: InterfaceItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `iface-${i + 1}`,
  name: 'net-02',
  status: 'active',
  fixedIp: '192.168.10.1',
  floatingIp: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
}));

/* ----------------------------------------
   DetachInterfaceDrawer Component
   ---------------------------------------- */

export function DetachInterfaceDrawer({
  isOpen,
  onClose,
  instance,
  interfaces = mockInterfaces,
  onDetach,
}: DetachInterfaceDrawerProps) {
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
    if (!selectedInterfaceId) return;
    
    setIsSubmitting(true);
    try {
      await onDetach?.(selectedInterfaceId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInterfaceId(null);
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const filteredInterfaces = interfaces.filter(iface => 
    iface.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    iface.fixedIp.includes(searchQuery) ||
    iface.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={handleDetach}
            disabled={!selectedInterfaceId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Detaching...' : 'Detach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Detach Interface
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Detach a network interface from this instance. This may interrupt connectivity if the selected port is primary.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-subtle)] mb-1.5">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instance.name}</div>
          </div>

          {/* Warning Message */}
          <div className="w-full p-3 bg-[#fef2f2] rounded-lg flex gap-2 items-start">
            <IconAlertCircle size={16} className="shrink-0 text-[#f87171] mt-0.5" />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before detaching a interface.
            </p>
          </div>
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3} className="flex-1 min-h-0">
          {/* Interfaces Header */}
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Interfaces</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search interface by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">{totalItems} items</span>
          </HStack>

          {/* Interfaces Table */}
          <div className="flex-1 overflow-y-auto sidebar-scroll" style={{ width: '648px', maxWidth: '648px', overflowX: 'hidden', paddingRight: '2px' }}>
            {/* Header */}
            <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
              <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
              </div>
              <div style={{ width: '125px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Fixed IP</span>
              </div>
              <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Floating IP</span>
              </div>
              <div style={{ width: '148px', flexShrink: 0 }} className="flex items-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">MAC Address</span>
              </div>
            </div>

            {/* Rows */}
            <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredInterfaces.map((iface) => (
                <div 
                  key={iface.id}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedInterfaceId === iface.id 
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                  onClick={() => setSelectedInterfaceId(iface.id)}
                >
                  {/* Radio */}
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Radio
                      name="interface-select"
                      value={iface.id}
                      checked={selectedInterfaceId === iface.id}
                      onChange={() => setSelectedInterfaceId(iface.id)}
                    />
                  </div>
                  {/* Status */}
                  <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center">
                    <StatusIndicator status="active" layout="icon-only" size="sm" />
                  </div>
                  {/* Name */}
                  <div style={{ width: '125px', flexShrink: 0 }} className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{iface.name}</span>
                      <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : 17kfj123</span>
                  </div>
                  {/* Fixed IP */}
                  <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{iface.fixedIp}</span>
                  </div>
                  {/* Floating IP */}
                  <div style={{ width: '108px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{iface.floatingIp}</span>
                  </div>
                  {/* MAC Address */}
                  <div style={{ width: '148px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{iface.macAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </VStack>

        {/* Selection Indicator */}
        <SelectionIndicator
          selectedItems={selectedInterfaceId ? [{ id: selectedInterfaceId, label: interfaces.find(i => i.id === selectedInterfaceId)?.name || '' }] : []}
          onRemove={() => setSelectedInterfaceId(null)}
          emptyText="No item selected"
          className="shrink-0"
          style={{ width: '648px' }}
        />
      </VStack>
    </Drawer>
  );
}

export default DetachInterfaceDrawer;
