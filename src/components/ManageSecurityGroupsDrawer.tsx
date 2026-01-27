import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  Checkbox,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InterfaceItem {
  id: string;
  portName: string;
  networkName: string;
  ipAddress: string;
  macAddress: string;
  status: 'active' | 'error' | 'building';
}

export interface SecurityGroupItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface ManageSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  interfaces?: InterfaceItem[];
  securityGroups?: SecurityGroupItem[];
  onSave?: (interfaceId: string, securityGroupIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultInterfaces: InterfaceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `iface-${i + 1}`,
  portName: 'port-02',
  networkName: 'net-02',
  ipAddress: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
  status: 'active',
}));

const defaultSecurityGroups: SecurityGroupItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `sg-${i + 1}`,
  name: 'default-sg',
  description: '-',
  createdAt: '2025-09-05',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ManageSecurityGroupsDrawer Component
   ---------------------------------------- */

export function ManageSecurityGroupsDrawer({
  isOpen,
  onClose,
  instance,
  interfaces = defaultInterfaces,
  securityGroups = defaultSecurityGroups,
  onSave,
}: ManageSecurityGroupsDrawerProps) {
  // Interface state
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  const [interfaceSearchQuery, setInterfaceSearchQuery] = useState('');
  const [interfacePage, setInterfacePage] = useState(1);

  // Security Groups state
  const [selectedSecurityGroupIds, setSelectedSecurityGroupIds] = useState<string[]>([]);
  const [sgSearchQuery, setSgSearchQuery] = useState('');
  const [sgPage, setSgPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter interfaces
  const filteredInterfaces = interfaces.filter(
    (iface) =>
      iface.portName.toLowerCase().includes(interfaceSearchQuery.toLowerCase()) ||
      iface.networkName.toLowerCase().includes(interfaceSearchQuery.toLowerCase()) ||
      iface.ipAddress.includes(interfaceSearchQuery)
  );

  const interfaceTotalPages = Math.ceil(filteredInterfaces.length / ITEMS_PER_PAGE);
  const paginatedInterfaces = filteredInterfaces.slice(
    (interfacePage - 1) * ITEMS_PER_PAGE,
    interfacePage * ITEMS_PER_PAGE
  );

  // Filter security groups
  const filteredSecurityGroups = securityGroups.filter(
    (sg) =>
      sg.name.toLowerCase().includes(sgSearchQuery.toLowerCase()) ||
      sg.description.toLowerCase().includes(sgSearchQuery.toLowerCase())
  );

  const sgTotalPages = Math.ceil(filteredSecurityGroups.length / ITEMS_PER_PAGE);
  const paginatedSecurityGroups = filteredSecurityGroups.slice(
    (sgPage - 1) * ITEMS_PER_PAGE,
    sgPage * ITEMS_PER_PAGE
  );

  const handleSave = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedInterfaceId) return;

    setIsSubmitting(true);
    try {
      await onSave?.(selectedInterfaceId, selectedSecurityGroupIds);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInterfaceId(null);
    setSelectedSecurityGroupIds([]);
    setInterfaceSearchQuery('');
    setSgSearchQuery('');
    setInterfacePage(1);
    setSgPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleSecurityGroupToggle = (sgId: string) => {
    setSelectedSecurityGroupIds((prev) =>
      prev.includes(sgId) ? prev.filter((id) => id !== sgId) : [...prev, sgId]
    );
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
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Manage Security Groups
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              You can attach or detach security groups for the selected interface. These rules
              control inbound and outbound traffic for the instance.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-subtle)] mb-1.5">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Interfaces</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={interfaceSearchQuery}
              onChange={(e) => setInterfaceSearchQuery(e.target.value)}
              onClear={() => setInterfaceSearchQuery('')}
              placeholder="Search interface by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={interfacePage}
            totalPages={interfaceTotalPages}
            totalItems={filteredInterfaces.length}
            onPageChange={setInterfacePage}
          />

          {/* Interfaces Table */}
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div
              style={{ display: 'flex', width: '648px', height: '40px' }}
              className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md"
            >
              <div
                style={{ width: '40px', flexShrink: 0 }}
                className="flex items-center justify-center"
              />
              <div
                style={{ width: '59px', flexShrink: 0 }}
                className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Status
                </span>
              </div>
              <div
                style={{ width: '137px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Network
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '137px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Port ID
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '137px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  IP Address
                </span>
              </div>
              <div
                style={{ width: '138px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Mac Address
                </span>
              </div>
            </div>

            {/* Rows */}
            <div
              style={{
                width: '648px',
                maxWidth: '648px',
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {paginatedInterfaces.map((iface) => (
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
                  <div
                    style={{ width: '40px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Radio
                      name="interface-select"
                      value={iface.id}
                      checked={selectedInterfaceId === iface.id}
                      onChange={() => setSelectedInterfaceId(iface.id)}
                    />
                  </div>
                  {/* Status */}
                  <div
                    style={{ width: '59px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                  >
                    <StatusIndicator status="active" layout="icon-only" size="sm" />
                  </div>
                  {/* Network */}
                  <div
                    style={{ width: '137px', flexShrink: 0 }}
                    className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">
                        {iface.portName}
                      </span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">
                      ID : 17kfj123
                    </span>
                  </div>
                  {/* Port ID */}
                  <div
                    style={{ width: '137px', flexShrink: 0 }}
                    className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">
                        {iface.networkName}
                      </span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">
                      ID : 17kfj123
                    </span>
                  </div>
                  {/* IP Address */}
                  <div
                    style={{ width: '137px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">
                      {iface.ipAddress}
                    </span>
                  </div>
                  {/* MAC Address */}
                  <div
                    style={{ width: '138px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">
                      {iface.macAddress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interface Selection Indicator */}
          <SelectionIndicator
            selectedItems={
              selectedInterfaceId
                ? [
                    {
                      id: selectedInterfaceId,
                      label: interfaces.find((i) => i.id === selectedInterfaceId)?.portName || '',
                    },
                  ]
                : []
            }
            onRemove={() => setSelectedInterfaceId(null)}
            emptyText="No item Selected"
            error={hasAttemptedSubmit && !selectedInterfaceId}
            errorMessage="Please select an interface."
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>

        {/* Security Groups Section */}
        <VStack gap={3} className="pb-5">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Security Groups
          </h3>

          {/* Pagination */}
          <Pagination
            currentPage={sgPage}
            totalPages={sgTotalPages}
            totalItems={filteredSecurityGroups.length}
            onPageChange={setSgPage}
          />

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={sgSearchQuery}
              onChange={(e) => setSgSearchQuery(e.target.value)}
              onClear={() => setSgSearchQuery('')}
              placeholder="Search security group by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Security Groups Table */}
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div
              style={{ display: 'flex', width: '648px', height: '40px' }}
              className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md"
            >
              <div
                style={{ width: '40px', flexShrink: 0 }}
                className="flex items-center justify-center"
              />
              <div
                style={{ width: '203px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Name
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '203px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Description
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '202px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                  Created At
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Rows */}
            <div
              style={{
                width: '648px',
                maxWidth: '648px',
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {paginatedSecurityGroups.map((sg) => (
                <div
                  key={sg.id}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedSecurityGroupIds.includes(sg.id)
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                  onClick={() => handleSecurityGroupToggle(sg.id)}
                >
                  {/* Checkbox */}
                  <div
                    style={{ width: '40px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedSecurityGroupIds.includes(sg.id)}
                      onChange={() => handleSecurityGroupToggle(sg.id)}
                    />
                  </div>
                  {/* Name */}
                  <div
                    style={{ width: '203px', flexShrink: 0 }}
                    className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">
                        {sg.name}
                      </span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">
                      ID : 21stu345
                    </span>
                  </div>
                  {/* Description */}
                  <div
                    style={{ width: '203px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">
                      {sg.description}
                    </span>
                  </div>
                  {/* Created At */}
                  <div
                    style={{ width: '202px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">
                      {sg.createdAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Groups Selection Indicator */}
          <SelectionIndicator
            selectedItems={selectedSecurityGroupIds.map((id) => ({
              id,
              label: securityGroups.find((sg) => sg.id === id)?.name || '',
            }))}
            onRemove={(id) =>
              setSelectedSecurityGroupIds((prev) => prev.filter((sgId) => sgId !== id))
            }
            emptyText="No item Selected"
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageSecurityGroupsDrawer;
