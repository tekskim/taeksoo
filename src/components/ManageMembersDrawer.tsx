import { useState, useEffect } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput,
  Pagination,
  Select,
  StatusIndicator,
  NumberInput,
  Input,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconCirclePlus, IconCircleMinus } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  ipAddresses: string[];
}

export interface MemberItem {
  id: string;
  ipAddress: string;
  port: number;
  weight: number;
  isExternal?: boolean;
}

export interface PoolInfo {
  name: string;
}

export interface ManageMembersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: PoolInfo;
  instances?: InstanceItem[];
  initialMembers?: MemberItem[];
  onSubmit?: (members: MemberItem[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: InstanceItem[] = [
  { id: 'inst-1', name: 'my-server-3', status: 'active', ipAddresses: ['10.63.0.47', '10.63.0.48', '10.63.0.49'] },
  { id: 'inst-2', name: 'my-server-4', status: 'active', ipAddresses: ['10.63.0.50', '10.63.0.51'] },
  { id: 'inst-3', name: 'my-server-5', status: 'building', ipAddresses: ['10.63.0.52'] },
  { id: 'inst-4', name: 'my-server-6', status: 'active', ipAddresses: ['10.63.0.53', '10.63.0.54'] },
  { id: 'inst-5', name: 'my-server-7', status: 'error', ipAddresses: ['10.63.0.55'] },
];

const mockInitialMembers: MemberItem[] = [
  { id: 'member-1', ipAddress: '10.63.0.46', port: 80, weight: 1 },
  { id: 'member-2', ipAddress: '10.63.0.46', port: 80, weight: 1 },
  { id: 'member-3', ipAddress: '10.63.0.46', port: 80, weight: 1 },
];

/* ----------------------------------------
   Member Card Component
   ---------------------------------------- */

interface MemberCardProps {
  member: MemberItem;
  onPortChange: (port: number) => void;
  onWeightChange: (weight: number) => void;
  onRemove: () => void;
}

function MemberCard({ member, onPortChange, onWeightChange, onRemove }: MemberCardProps) {
  return (
    <div className="w-[200px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 pt-3 pb-4 flex flex-col gap-3">
      {/* IP Address */}
      <VStack gap={2} className="w-full">
        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
          IP Address
        </span>
        <div className="w-full bg-[var(--color-surface-muted)] rounded-md px-2.5 py-2">
          <span className="text-[12px] text-[var(--color-text-muted)] leading-4">
            {member.ipAddress}
          </span>
        </div>
      </VStack>

      {/* Port */}
      <VStack gap={2} className="w-full">
        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
          Port
        </span>
        <NumberInput
          value={member.port}
          onChange={(value) => onPortChange(value ?? 80)}
          min={1}
          max={65535}
          fullWidth
        />
      </VStack>

      {/* Weight */}
      <VStack gap={2} className="w-full">
        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
          Weight
        </span>
        <NumberInput
          value={member.weight}
          onChange={(value) => onWeightChange(value ?? 1)}
          min={0}
          max={256}
          fullWidth
        />
      </VStack>

      {/* Remove Button */}
      <Button variant="secondary" size="sm" onClick={onRemove} className="w-fit">
        <IconCircleMinus size={12} />
        Remove
      </Button>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ManageMembersDrawer({
  isOpen,
  onClose,
  pool,
  instances = mockInstances,
  initialMembers = mockInitialMembers,
  onSubmit,
}: ManageMembersDrawerProps) {
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIps, setSelectedIps] = useState<Record<string, string>>({});
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setMembers(initialMembers);
      setSearchQuery('');
      setCurrentPage(1);
      setSelectedIps({});
    }
  }, [isOpen, initialMembers]);

  // Filtering and sorting
  const filteredInstances = instances
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ipAddresses.some(ip => ip.includes(searchQuery))
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);

  const handleAddMember = (instance: InstanceItem, ip: string) => {
    const newMember: MemberItem = {
      id: `member-${Date.now()}`,
      ipAddress: ip,
      port: 80,
      weight: 1,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleAddExternalMember = () => {
    const newMember: MemberItem = {
      id: `member-${Date.now()}`,
      ipAddress: '',
      port: 80,
      weight: 1,
      isExternal: true,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handlePortChange = (memberId: string, port: number) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, port } : m));
  };

  const handleWeightChange = (memberId: string, weight: number) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, weight } : m));
  };

  const handleIpAddressChange = (memberId: string, ipAddress: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ipAddress } : m));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(members);
    }
    onClose();
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Manage Members"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={onClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            className="w-[152px] h-8"
          >
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Pool Info */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <p className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4 mb-1.5">
            Pool name
          </p>
          <p className="text-[12px] text-[var(--color-text-default)] leading-4">
            {pool.name}
          </p>
        </div>

        {/* Available Instances Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Available Instances
          </h3>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search instance by attributes"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredInstances.length}
            onPageChange={setCurrentPage}
          />

          {/* Instances Table */}
          <div className="w-full flex flex-col gap-[var(--table-row-gap)]">
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[59px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center justify-center">
                <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">Status</span>
              </div>
              <div 
                className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">Name</span>
                <IconChevronDown size={12} className={`transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </div>
              <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">IP</span>
              </div>
              <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">Action</span>
              </div>
            </div>

            {/* Rows */}
            {paginatedInstances.map((item) => {
              const selectedIp = selectedIps[item.id] || item.ipAddresses[0];
              return (
                <div
                  key={item.id}
                  className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-all"
                >
                  <div className="w-[59px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center justify-center">
                    <StatusIndicator status={item.status} />
                  </div>
                  <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex flex-col justify-center gap-0.5">
                    <HStack gap={1.5} align="center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)]">
                        {item.name}
                      </span>
                      <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                    </HStack>
                    <span className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                      ID : {item.id}
                    </span>
                  </div>
                  <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <Select
                      value={selectedIp}
                      onChange={(value) => setSelectedIps(prev => ({ ...prev, [item.id]: value }))}
                      options={item.ipAddresses.map(ip => ({ value: ip, label: ip }))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleAddMember(item, selectedIp)}
                      className="w-fit"
                    >
                      <IconCirclePlus size={12} />
                      Add Member
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </VStack>

        {/* Allocated Members Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Allocated Members
          </h3>

          <Button variant="secondary" onClick={handleAddExternalMember} className="w-fit">
            <IconCirclePlus size={12} />
            Add External Member
          </Button>

          {/* Member Cards */}
          {members.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {members.map((member) => (
                member.isExternal ? (
                  <div 
                    key={member.id}
                    className="w-[200px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 pt-3 pb-4 flex flex-col gap-3"
                  >
                    {/* IP Address Input */}
                    <VStack gap={2} className="w-full">
                      <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                        IP Address
                      </span>
                      <Input
                        value={member.ipAddress}
                        onChange={(e) => handleIpAddressChange(member.id, e.target.value)}
                        placeholder="Enter IP address"
                        fullWidth
                      />
                    </VStack>

                    {/* Port */}
                    <VStack gap={2} className="w-full">
                      <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                        Port
                      </span>
                      <NumberInput
                        value={member.port}
                        onChange={(value) => handlePortChange(member.id, value ?? 80)}
                        min={1}
                        max={65535}
                        fullWidth
                      />
                    </VStack>

                    {/* Weight */}
                    <VStack gap={2} className="w-full">
                      <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                        Weight
                      </span>
                      <NumberInput
                        value={member.weight}
                        onChange={(value) => handleWeightChange(member.id, value ?? 1)}
                        min={0}
                        max={256}
                        fullWidth
                      />
                    </VStack>

                    {/* Remove Button */}
                    <Button variant="secondary" size="sm" onClick={() => handleRemoveMember(member.id)} className="w-fit">
                      <IconCircleMinus size={12} />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onPortChange={(port) => handlePortChange(member.id, port)}
                    onWeightChange={(weight) => handleWeightChange(member.id, weight)}
                    onRemove={() => handleRemoveMember(member.id)}
                  />
                )
              ))}
            </div>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}
