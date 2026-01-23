import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
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
  subnetCidr: string;
}

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  networkName: string;
  networkId: string;
  description: string;
}

export interface PortInfo {
  name: string;
}

export interface AssociateFloatingIPToPortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  port: PortInfo;
  fixedIPs?: FixedIPItem[];
  floatingIPs?: FloatingIPItem[];
  onSubmit?: (data: { fixedIpId: string; floatingIpId: string }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFixedIPs: FixedIPItem[] = [
  { id: 'fip-1', fixedIp: '10.0.0.5', macAddress: '10.0.01', subnetCidr: '192.168.10.0/24' },
  { id: 'fip-2', fixedIp: '10.0.0.5', macAddress: '10.0.01', subnetCidr: '192.168.10.0/24' },
  { id: 'fip-3', fixedIp: '10.0.0.5', macAddress: '10.0.01', subnetCidr: '192.168.10.0/24' },
  { id: 'fip-4', fixedIp: '10.0.0.5', macAddress: '10.0.01', subnetCidr: '192.168.10.0/24' },
  { id: 'fip-5', fixedIp: '10.0.0.5', macAddress: '10.0.01', subnetCidr: '192.168.10.0/24' },
];

const mockFloatingIPs: FloatingIPItem[] = [
  { id: 'flp-1', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
  { id: 'flp-2', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
  { id: 'flp-3', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
  { id: 'flp-4', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
  { id: 'flp-5', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
  { id: 'flp-6', floatingIp: '203.0.140.25', status: 'active', networkName: 'net-02', networkId: '17kfj123', description: '-' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AssociateFloatingIPToPortDrawer({
  isOpen,
  onClose,
  port,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onSubmit,
}: AssociateFloatingIPToPortDrawerProps) {
  // Fixed IP state
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);
  const [fixedIpSearchQuery, setFixedIpSearchQuery] = useState('');
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);
  const [fixedIpSortField, setFixedIpSortField] = useState<'fixedIp' | null>('fixedIp');
  const [fixedIpSortDirection, setFixedIpSortDirection] = useState<'asc' | 'desc'>('asc');

  // Floating IP state
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [floatingIpSearchQuery, setFloatingIpSearchQuery] = useState('');
  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);
  const [floatingIpSortField, setFloatingIpSortField] = useState<'floatingIp' | 'networkName' | 'description' | null>('floatingIp');
  const [floatingIpSortDirection, setFloatingIpSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Reset state function
  const resetState = () => {
      setSelectedFixedIpId(null);
      setSelectedFloatingIpId(null);
      setFixedIpSearchQuery('');
      setFloatingIpSearchQuery('');
      setFixedIpCurrentPage(1);
      setFloatingIpCurrentPage(1);
  };

  // Handle close with reset
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Fixed IP filtering and sorting
  const filteredFixedIPs = fixedIPs
    .filter(item => 
      item.fixedIp.toLowerCase().includes(fixedIpSearchQuery.toLowerCase()) ||
      item.macAddress.toLowerCase().includes(fixedIpSearchQuery.toLowerCase()) ||
      item.subnetCidr.toLowerCase().includes(fixedIpSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!fixedIpSortField) return 0;
      const aVal = a[fixedIpSortField];
      const bVal = b[fixedIpSortField];
      const comparison = aVal.localeCompare(bVal);
      return fixedIpSortDirection === 'asc' ? comparison : -comparison;
    });

  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIpCurrentPage - 1) * itemsPerPage,
    fixedIpCurrentPage * itemsPerPage
  );

  const fixedIpTotalPages = Math.ceil(filteredFixedIPs.length / itemsPerPage);

  // Floating IP filtering and sorting
  const filteredFloatingIPs = floatingIPs
    .filter(item =>
      item.floatingIp.toLowerCase().includes(floatingIpSearchQuery.toLowerCase()) ||
      item.networkName.toLowerCase().includes(floatingIpSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(floatingIpSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!floatingIpSortField) return 0;
      const aVal = a[floatingIpSortField];
      const bVal = b[floatingIpSortField];
      const comparison = aVal.localeCompare(bVal);
      return floatingIpSortDirection === 'asc' ? comparison : -comparison;
    });

  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (floatingIpCurrentPage - 1) * itemsPerPage,
    floatingIpCurrentPage * itemsPerPage
  );

  const floatingIpTotalPages = Math.ceil(filteredFloatingIPs.length / itemsPerPage);

  // Selected items
  const selectedFixedIp = fixedIPs.find(item => item.id === selectedFixedIpId);
  const selectedFloatingIp = floatingIPs.find(item => item.id === selectedFloatingIpId);

  // Handlers
  const handleFixedIpSort = (field: 'fixedIp') => {
    if (fixedIpSortField === field) {
      setFixedIpSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setFixedIpSortField(field);
      setFixedIpSortDirection('asc');
    }
  };

  const handleFloatingIpSort = (field: 'floatingIp' | 'networkName' | 'description') => {
    if (floatingIpSortField === field) {
      setFloatingIpSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setFloatingIpSortField(field);
      setFloatingIpSortDirection('asc');
    }
  };

  const handleSubmit = () => {
    if (selectedFixedIpId && selectedFloatingIpId && onSubmit) {
      onSubmit({ fixedIpId: selectedFixedIpId, floatingIpId: selectedFloatingIpId });
    }
    handleClose();
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Associate Floating IP"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!selectedFixedIpId || !selectedFloatingIpId}
            className="w-[152px] h-8"
          >
            Associate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description */}
        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
          Associate a floating IP with this port to enable external network access.
        </p>

        {/* Port Info */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <p className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4 mb-1.5">
            Port
          </p>
          <p className="text-[12px] text-[var(--color-text-default)] leading-4">
            {port.name}
          </p>
        </div>

        {/* Fixed IP Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Fixed IP
          </h3>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search fixed IP by attributes"
              value={fixedIpSearchQuery}
              onChange={(e) => {
                setFixedIpSearchQuery(e.target.value);
                setFixedIpCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={fixedIpCurrentPage}
            totalPages={fixedIpTotalPages}
            totalItems={filteredFixedIPs.length}
            onPageChange={setFixedIpCurrentPage}
          />

          {/* Fixed IP Table */}
          <div className="w-full flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="w-[40px] p-3" />
              <div 
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleFixedIpSort('fixedIp')}
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Fixed IP</span>
                <IconChevronDown size={12} className={`transition-transform ${fixedIpSortField === 'fixedIp' && fixedIpSortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex-1 px-3 py-2 h-[40px] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">MAC Address</span>
              </div>
              <div className="flex-1 px-3 py-2 h-[40px] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Subnet CIDR</span>
              </div>
            </div>

            {/* Rows */}
            {paginatedFixedIPs.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md cursor-pointer hover:bg-[var(--color-surface-subtle)] ${
                  selectedFixedIpId === item.id ? 'border-[var(--color-action-primary)]' : ''
                }`}
                onClick={() => setSelectedFixedIpId(item.id)}
              >
                <div className="w-[40px] p-3 flex items-center justify-center">
                  <Radio
                    checked={selectedFixedIpId === item.id}
                    onChange={() => setSelectedFixedIpId(item.id)}
                  />
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                    {item.fixedIp}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                    {item.macAddress}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                    {item.subnetCidr}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator for Fixed IP */}
          <SelectionIndicator
            selectedItems={selectedFixedIp ? [{ id: selectedFixedIp.id, label: selectedFixedIp.fixedIp }] : []}
            onRemove={() => setSelectedFixedIpId(null)}
            emptyText="No item Selected"
          />
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Floating IP Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Floating IP
          </h3>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search floating IP by attributes"
              value={floatingIpSearchQuery}
              onChange={(e) => {
                setFloatingIpSearchQuery(e.target.value);
                setFloatingIpCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={floatingIpCurrentPage}
            totalPages={floatingIpTotalPages}
            totalItems={filteredFloatingIPs.length}
            onPageChange={setFloatingIpCurrentPage}
          />

          {/* Floating IP Table */}
          <div className="w-full flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="w-[40px] p-3" />
              <div className="w-[59px] px-3 py-2 h-[40px] flex items-center justify-center border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
              </div>
              <div 
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleFloatingIpSort('floatingIp')}
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Floating IP</span>
                <IconChevronDown size={12} className={`transition-transform ${floatingIpSortField === 'floatingIp' && floatingIpSortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </div>
              <div 
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleFloatingIpSort('networkName')}
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Network</span>
                <IconChevronDown size={12} className={`transition-transform ${floatingIpSortField === 'networkName' && floatingIpSortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </div>
              <div 
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleFloatingIpSort('description')}
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Description</span>
                <IconChevronDown size={12} className={`transition-transform ${floatingIpSortField === 'description' && floatingIpSortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Rows */}
            {paginatedFloatingIPs.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md cursor-pointer hover:bg-[var(--color-surface-subtle)] ${
                  selectedFloatingIpId === item.id ? 'border-[var(--color-action-primary)]' : ''
                }`}
                onClick={() => setSelectedFloatingIpId(item.id)}
              >
                <div className="w-[40px] p-3 flex items-center justify-center">
                  <Radio
                    checked={selectedFloatingIpId === item.id}
                    onChange={() => setSelectedFloatingIpId(item.id)}
                  />
                </div>
                <div className="w-[59px] p-2 flex items-center justify-center">
                  <StatusIndicator status={item.status} />
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center gap-0.5">
                  <HStack gap={1.5} align="center">
                    <span className="text-[12px] font-medium text-[var(--color-action-primary)] leading-4">
                      {item.floatingIp}
                    </span>
                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                    ID : {item.id}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center gap-0.5">
                  <HStack gap={1.5} align="center">
                    <span className="text-[12px] font-medium text-[var(--color-action-primary)] leading-4">
                      {item.networkName}
                    </span>
                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                    ID : {item.networkId}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator for Floating IP */}
          <SelectionIndicator
            selectedItems={selectedFloatingIp ? [{ id: selectedFloatingIp.id, label: selectedFloatingIp.floatingIp }] : []}
            onRemove={() => setSelectedFloatingIpId(null)}
            emptyText="No item Selected"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}
