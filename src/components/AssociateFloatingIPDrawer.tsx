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
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  network: string;
  networkId: string;
  subnetCidr: string;
}

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  status: 'active' | 'error' | 'down';
  network: string;
  networkId: string;
  description: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface AssociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  fixedIPs?: FixedIPItem[];
  floatingIPs?: FloatingIPItem[];
  onAssociate?: (fixedIpId: string, floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFixedIPs: FixedIPItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `fixed-ip-${i + 1}`,
  fixedIp: '10.0.0.5',
  macAddress: '10.0.0.5',
  network: 'net-02',
  networkId: '17kfj123',
  subnetCidr: '192.168.10.0/24',
}));

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `floating-ip-${i + 1}`,
  floatingIp: '203.0.140.25',
  status: 'active',
  network: 'net-02',
  networkId: '17kfj123',
  description: '-',
}));

/* ----------------------------------------
   AssociateFloatingIPDrawer Component
   ---------------------------------------- */

export function AssociateFloatingIPDrawer({
  isOpen,
  onClose,
  instance,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onAssociate,
}: AssociateFloatingIPDrawerProps) {
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [fixedIpSearchQuery, setFixedIpSearchQuery] = useState('');
  const [floatingIpSearchQuery, setFloatingIpSearchQuery] = useState('');
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);
  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAssociate = async () => {
    if (!selectedFixedIpId || !selectedFloatingIpId) return;
    
    setIsSubmitting(true);
    try {
      await onAssociate?.(selectedFixedIpId, selectedFloatingIpId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFixedIpId(null);
    setSelectedFloatingIpId(null);
    setFixedIpSearchQuery('');
    setFloatingIpSearchQuery('');
    setFixedIpCurrentPage(1);
    setFloatingIpCurrentPage(1);
    onClose();
  };

  const filteredFixedIPs = fixedIPs.filter(ip => 
    ip.fixedIp.includes(fixedIpSearchQuery) ||
    ip.macAddress.includes(fixedIpSearchQuery) ||
    ip.network.toLowerCase().includes(fixedIpSearchQuery.toLowerCase())
  );

  const filteredFloatingIPs = floatingIPs.filter(ip => 
    ip.floatingIp.includes(floatingIpSearchQuery) ||
    ip.network.toLowerCase().includes(floatingIpSearchQuery.toLowerCase())
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
            onClick={handleAssociate}
            disabled={!selectedFixedIpId || !selectedFloatingIpId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Associate Floating IP
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Assign a floating IP to this instance for external network access.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-subtle)] mb-1.5">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Fixed IP Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Fixed IP</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={fixedIpSearchQuery}
              onChange={(e) => setFixedIpSearchQuery(e.target.value)}
              onClear={() => setFixedIpSearchQuery('')}
              placeholder="Search fixed IP by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={fixedIpCurrentPage}
              totalPages={totalPages}
              onPageChange={setFixedIpCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">{totalItems} items</span>
          </HStack>

          {/* Fixed IP Table */}
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
              <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Fixed IP</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Mac Address</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Network</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Subnet CIDR</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Rows */}
            <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredFixedIPs.map((ip) => (
                <div 
                  key={ip.id}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedFixedIpId === ip.id 
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                  onClick={() => setSelectedFixedIpId(ip.id)}
                >
                  {/* Radio */}
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Radio
                      name="fixed-ip-select"
                      value={ip.id}
                      checked={selectedFixedIpId === ip.id}
                      onChange={() => setSelectedFixedIpId(ip.id)}
                    />
                  </div>
                  {/* Fixed IP */}
                  <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{ip.fixedIp}</span>
                  </div>
                  {/* Mac Address */}
                  <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{ip.macAddress}</span>
                  </div>
                  {/* Network */}
                  <div style={{ width: '152px', flexShrink: 0 }} className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{ip.network}</span>
                      <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : {ip.networkId}</span>
                  </div>
                  {/* Subnet CIDR */}
                  <div style={{ width: '152px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{ip.subnetCidr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Indicator for Fixed IP */}
          <SelectionIndicator
            selectedItems={selectedFixedIpId ? [{ id: selectedFixedIpId, label: fixedIPs.find(ip => ip.id === selectedFixedIpId)?.fixedIp || '' }] : []}
            onRemove={() => setSelectedFixedIpId(null)}
            emptyText="No item selected"
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>

        {/* Floating IPs Section */}
        <VStack gap={3} className="pb-5">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Floating IPs</h3>

          {!selectedFixedIpId ? (
            /* Empty state when no Fixed IP selected */
            <VStack gap={3}>
              <div className="w-[280px]">
                <SearchInput
                  value={floatingIpSearchQuery}
                  onChange={(e) => setFloatingIpSearchQuery(e.target.value)}
                  onClear={() => setFloatingIpSearchQuery('')}
                  placeholder="Search floating IP by attributes"
                  size="sm"
                  fullWidth
                  disabled
                />
              </div>
              
              {/* Empty Table */}
              <div style={{ width: '648px' }}>
                {/* Header */}
                <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
                  <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
                  </div>
                  <div style={{ flex: 1 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Floating IP</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                  <div style={{ flex: 1 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Network</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                  <div style={{ flex: 1 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Description</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                </div>
                
                {/* Empty state body */}
                <div className="mt-1 border border-[var(--color-border-default)] rounded-md bg-[var(--color-surface-default)] py-10 px-4">
                  <p className="text-[12px] text-[var(--color-text-subtle)] text-center leading-4">
                    Select an instance IP address from the list above<br />
                    to view available Floating IPs for association.
                  </p>
                </div>
              </div>
            </VStack>
          ) : (
            /* Show Floating IPs when Fixed IP is selected */
            <>
              {/* Pagination */}
              <HStack gap={2} align="center">
                <Pagination
                  currentPage={floatingIpCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setFloatingIpCurrentPage}
                />
                <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
                <span className="text-[11px] text-[var(--color-text-subtle)]">{totalItems} items</span>
              </HStack>

              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  value={floatingIpSearchQuery}
                  onChange={(e) => setFloatingIpSearchQuery(e.target.value)}
                  onClear={() => setFloatingIpSearchQuery('')}
                  placeholder="Search floating IP by attributes"
                  size="sm"
                  fullWidth
                />
              </div>

              {/* Floating IP Table */}
              <div style={{ width: '648px', maxWidth: '648px' }}>
                {/* Header */}
                <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
                  <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
                  </div>
                  <div style={{ width: '183px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Floating IP</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                  <div style={{ width: '183px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Network</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                  <div style={{ width: '183px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Description</span>
                    <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                  </div>
                </div>

                {/* Rows */}
                <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {filteredFloatingIPs.map((ip) => (
                    <div 
                      key={ip.id}
                      style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                      className={`border rounded-md cursor-pointer transition-all ${
                        selectedFloatingIpId === ip.id 
                          ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                          : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                      }`}
                      onClick={() => setSelectedFloatingIpId(ip.id)}
                    >
                      {/* Radio */}
                      <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Radio
                          name="floating-ip-select"
                          value={ip.id}
                          checked={selectedFloatingIpId === ip.id}
                          onChange={() => setSelectedFloatingIpId(ip.id)}
                        />
                      </div>
                      {/* Status */}
                      <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center">
                        <StatusIndicator status="active" layout="icon-only" size="sm" />
                      </div>
                      {/* Floating IP */}
                      <div style={{ width: '183px', flexShrink: 0 }} className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{ip.floatingIp}</span>
                          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                        </div>
                        <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : k2l2j123</span>
                      </div>
                      {/* Network */}
                      <div style={{ width: '183px', flexShrink: 0 }} className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{ip.network}</span>
                          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                        </div>
                        <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : {ip.networkId}</span>
                      </div>
                      {/* Description */}
                      <div style={{ width: '183px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                        <span className="text-[12px] text-[var(--color-text-default)] truncate">{ip.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Indicator for Floating IP */}
              <SelectionIndicator
                selectedItems={selectedFloatingIpId ? [{ id: selectedFloatingIpId, label: floatingIPs.find(ip => ip.id === selectedFloatingIpId)?.floatingIp || '' }] : []}
                onRemove={() => setSelectedFloatingIpId(null)}
                emptyText="No item selected"
                className="shrink-0"
                style={{ width: '648px' }}
              />
            </>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AssociateFloatingIPDrawer;
