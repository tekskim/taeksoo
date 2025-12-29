import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  SelectBox,
  NumberInput,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconPlus, IconMinus } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  ipAddresses: string[];
}

export interface AllocatedMember {
  id: string;
  ipAddress: string;
  port: number;
  weight: number;
  isExternal?: boolean;
}

export interface ManageMembersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  poolName: string;
  instances?: InstanceItem[];
  initialMembers?: AllocatedMember[];
  onSave?: (members: AllocatedMember[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: InstanceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: `my-server-${i + 1}`,
  status: 'active',
  ipAddresses: [`10.63.0.${47 + i}`, `10.63.1.${47 + i}`],
}));

const mockMembers: AllocatedMember[] = [
  { id: 'member-1', ipAddress: '10.63.0.46', port: 80, weight: 1 },
  { id: 'member-2', ipAddress: '10.63.0.46', port: 80, weight: 1 },
  { id: 'member-3', ipAddress: '10.63.0.46', port: 80, weight: 1 },
];

/* ----------------------------------------
   MemberCard Component
   ---------------------------------------- */

interface MemberCardProps {
  member: AllocatedMember;
  onPortChange: (port: number) => void;
  onWeightChange: (weight: number) => void;
  onRemove: () => void;
}

function MemberCard({ member, onPortChange, onWeightChange, onRemove }: MemberCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-4 pb-4 w-[208px] flex flex-col gap-3">
      {/* IP Address */}
      <VStack gap={2} alignItems="start">
        <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
          IP Address
        </span>
        <div className="bg-[#e5e7eb] rounded-[6px] px-2.5 py-2 w-full">
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
            {member.ipAddress}
          </span>
        </div>
      </VStack>

      {/* Port */}
      <VStack gap={2} alignItems="start">
        <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
          Port
        </span>
        <NumberInput
          value={member.port}
          onChange={onPortChange}
          min={1}
          max={65535}
          className="w-full"
        />
      </VStack>

      {/* Weight */}
      <VStack gap={2} alignItems="start">
        <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
          Weight
        </span>
        <NumberInput
          value={member.weight}
          onChange={onWeightChange}
          min={1}
          max={256}
          className="w-full"
        />
      </VStack>

      {/* Remove Button */}
      <Button variant="outline" size="sm" onClick={onRemove} className="w-fit">
        <IconMinus size={12} />
        Remove
      </Button>
    </div>
  );
}

/* ----------------------------------------
   ManageMembersDrawer Component
   ---------------------------------------- */

export function ManageMembersDrawer({
  isOpen,
  onClose,
  poolName,
  instances = mockInstances,
  initialMembers = mockMembers,
  onSave,
}: ManageMembersDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allocatedMembers, setAllocatedMembers] = useState<AllocatedMember[]>(initialMembers);
  const [selectedIps, setSelectedIps] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 1;

  // Filtering and pagination
  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.ipAddresses.some((ip) => ip.includes(searchTerm))
  );

  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddMember = (instance: InstanceItem) => {
    const selectedIp = selectedIps[instance.id] || instance.ipAddresses[0];
    const newMember: AllocatedMember = {
      id: `member-${Date.now()}`,
      ipAddress: selectedIp,
      port: 80,
      weight: 1,
    };
    setAllocatedMembers((prev) => [...prev, newMember]);
  };

  const handleAddExternalMember = () => {
    const newMember: AllocatedMember = {
      id: `external-${Date.now()}`,
      ipAddress: '0.0.0.0',
      port: 80,
      weight: 1,
      isExternal: true,
    };
    setAllocatedMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId: string) => {
    setAllocatedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handlePortChange = (memberId: string, port: number) => {
    setAllocatedMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, port } : m))
    );
  };

  const handleWeightChange = (memberId: string, weight: number) => {
    setAllocatedMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, weight } : m))
    );
  };

  const handleIpSelect = (instanceId: string, ip: string) => {
    setSelectedIps((prev) => ({ ...prev, [instanceId]: ip }));
  };

  const columns: TableColumn<InstanceItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/instances/${item.id}`}
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
    {
      key: 'ipAddresses',
      label: 'IP',
      render: (_, item) => (
        <SelectBox
          value={selectedIps[item.id] || item.ipAddresses[0]}
          onChange={(value) => handleIpSelect(item.id, value)}
          options={item.ipAddresses.map((ip) => ({ label: ip, value: ip }))}
          className="w-[152px]"
        />
      ),
    },
    {
      key: 'action',
      label: 'Status',
      align: 'center',
      render: (_, item) => (
        <Button variant="outline" size="sm" onClick={() => handleAddMember(item)}>
          <IconPlus size={12} />
          Add Member
        </Button>
      ),
    },
  ];

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(allocatedMembers);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setSelectedIps({});
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Members"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Pool Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Pool name
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {poolName}
          </p>
        </div>

        {/* Available Instances Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Available Instances
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find instance with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredInstances.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredInstances.length} items
            </span>
          </HStack>

          {/* Instance Table */}
          <div className="overflow-auto w-full">
            <Table<InstanceItem>
              columns={columns}
              data={paginatedInstances}
              rowKey="id"
              emptyMessage="No instances available"
            />
          </div>
        </VStack>

        {/* Allocated Members Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Allocated Members
          </h6>

          {/* Add External Member Button */}
          <Button variant="outline" size="sm" onClick={handleAddExternalMember} className="w-fit">
            <IconPlus size={12} />
            Add External Member
          </Button>

          {/* Member Cards */}
          {allocatedMembers.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {allocatedMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onPortChange={(port) => handlePortChange(member.id, port)}
                  onWeightChange={(weight) => handleWeightChange(member.id, weight)}
                  onRemove={() => handleRemoveMember(member.id)}
                />
              ))}
            </div>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageMembersDrawer;

