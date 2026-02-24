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
  Table,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconCirclePlus, IconX } from '@tabler/icons-react';

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
  {
    id: 'inst-1',
    name: 'my-server-3',
    status: 'active',
    ipAddresses: ['10.63.0.47', '10.63.0.48', '10.63.0.49'],
  },
  {
    id: 'inst-2',
    name: 'my-server-4',
    status: 'active',
    ipAddresses: ['10.63.0.50', '10.63.0.51'],
  },
  { id: 'inst-3', name: 'my-server-5', status: 'building', ipAddresses: ['10.63.0.52'] },
  {
    id: 'inst-4',
    name: 'my-server-6',
    status: 'active',
    ipAddresses: ['10.63.0.53', '10.63.0.54'],
  },
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
    <HStack
      gap={3}
      align="end"
      className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2"
    >
      <FormField label="IP address">
        <Input value={member.ipAddress} disabled width="sm" />
      </FormField>

      <FormField label="Port">
        <NumberInput
          value={member.port}
          onChange={(value) => onPortChange(value ?? 80)}
          min={1}
          max={65535}
          width="sm"
        />
      </FormField>

      <FormField label="Weight">
        <NumberInput
          value={member.weight}
          onChange={(value) => onWeightChange(value ?? 1)}
          min={0}
          max={256}
          width="sm"
        />
      </FormField>

      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 shrink-0 ml-auto mb-[10px] hover:bg-[var(--color-surface-muted)] rounded transition-colors"
      >
        <IconX size={12} className="text-[var(--color-text-default)]" />
      </button>
    </HStack>
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

  const itemsPerPage = 5;

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setMembers(initialMembers);
      setSearchQuery('');
      setCurrentPage(1);
      setSelectedIps({});
    }
  }, [isOpen, initialMembers]);

  // Filtering
  const filteredInstances = instances.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ipAddresses.some((ip) => ip.includes(searchQuery))
  );

  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);

  const instanceColumns: TableColumn<InstanceItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_value, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span className="text-label-md text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'ipAddresses',
      label: 'IP',
      flex: 1,
      render: (_value, row) => {
        const selectedIp = selectedIps[row.id] || row.ipAddresses[0];
        return (
          <Select
            value={selectedIp}
            onChange={(value) => setSelectedIps((prev) => ({ ...prev, [row.id]: value }))}
            options={row.ipAddresses.map((ip) => ({ value: ip, label: ip }))}
            width="sm"
          />
        );
      },
    },
    {
      key: 'id' as keyof InstanceItem,
      label: 'Action',
      flex: 1,
      align: 'center',
      render: (_value, row) => {
        const selectedIp = selectedIps[row.id] || row.ipAddresses[0];
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAddMember(row, selectedIp)}
            leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
            className="w-fit"
          >
            Add member
          </Button>
        );
      },
    },
  ];

  const handleAddMember = (instance: InstanceItem, ip: string) => {
    const newMember: MemberItem = {
      id: `member-${Date.now()}`,
      ipAddress: ip,
      port: 80,
      weight: 1,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleAddExternalMember = () => {
    const newMember: MemberItem = {
      id: `member-${Date.now()}`,
      ipAddress: '',
      port: 80,
      weight: 1,
      isExternal: true,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handlePortChange = (memberId: string, port: number) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, port } : m)));
  };

  const handleWeightChange = (memberId: string, weight: number) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, weight } : m)));
  };

  const handleIpAddressChange = (memberId: string, ipAddress: string) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, ipAddress } : m)));
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
      title="Manage members"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={onClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="w-[152px] h-8">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Pool Info */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <p className="text-label-sm text-[var(--color-text-subtle)] leading-4 mb-1.5">
            Pool name
          </p>
          <p className="text-body-md text-[var(--color-text-default)] leading-4">{pool.name}</p>
        </div>

        {/* Available Instances Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Available instances
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

          <Table<InstanceItem>
            columns={instanceColumns}
            data={paginatedInstances}
            rowKey="id"
            emptyMessage="No instances found"
          />
        </VStack>

        {/* Allocated Members Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Allocated members
          </h3>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddExternalMember}
            leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
            className="w-fit"
          >
            Add external member
          </Button>

          {/* Member Rows */}
          {members.length > 0 && (
            <VStack gap={2} className="w-full">
              {members.map((member) =>
                member.isExternal ? (
                  <HStack
                    key={member.id}
                    gap={3}
                    align="end"
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2"
                  >
                    <FormField label="IP address" className="flex-1 min-w-0">
                      <Input
                        value={member.ipAddress}
                        onChange={(e) => handleIpAddressChange(member.id, e.target.value)}
                        placeholder="Enter IP address"
                        fullWidth
                      />
                    </FormField>

                    <FormField label="Port">
                      <NumberInput
                        value={member.port}
                        onChange={(value) => handlePortChange(member.id, value ?? 80)}
                        min={1}
                        max={65535}
                        width="sm"
                      />
                    </FormField>

                    <FormField label="Weight">
                      <NumberInput
                        value={member.weight}
                        onChange={(value) => handleWeightChange(member.id, value ?? 1)}
                        min={0}
                        max={256}
                        width="sm"
                      />
                    </FormField>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-0.5 shrink-0 ml-auto mb-[10px] hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={12} className="text-[var(--color-text-default)]" />
                    </button>
                  </HStack>
                ) : (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onPortChange={(port) => handlePortChange(member.id, port)}
                    onWeightChange={(weight) => handleWeightChange(member.id, weight)}
                    onRemove={() => handleRemoveMember(member.id)}
                  />
                )
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}
