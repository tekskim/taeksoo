import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  SearchInput,
  Pagination,
  Radio,
  Toggle,
  Disclosure,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  subnetCidr: string;
  size: string;
}

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited
}

export interface CreateRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networks?: NetworkItem[];
  routerQuota?: QuotaInfo;
  onSubmit?: (data: RouterFormData) => void;
}

export interface RouterFormData {
  name: string;
  description: string;
  adminStateUp: boolean;
  externalGatewayEnabled: boolean;
  externalNetworkId?: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'net-01',
  status: 'active',
  subnetCidr: '10.0.0.0/24',
  size: 'On',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number | null;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const isUnlimited = total === null;
  const percentage = !isUnlimited && total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = !isUnlimited && total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <HStack gap={0} align="center">
          <span className="text-body-md text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" />
          ) : (
            <span className="text-body-md text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: isUnlimited ? '5%' : `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--color-state-success-bg)] rounded-lg z-[1]"
          style={{ width: isUnlimited ? '10%' : `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateRouterDrawer Component
   ---------------------------------------- */

export function CreateRouterDrawer({
  isOpen,
  onClose,
  networks = defaultNetworks,
  routerQuota = { used: 5, total: 10 },
  onSubmit,
}: CreateRouterDrawerProps) {
  // Form state
  const [routerName, setRouterName] = useState('');
  const [description, setDescription] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [externalGatewayEnabled, setExternalGatewayEnabled] = useState(true);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Network selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced options disclosure state
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Filter networks
  const filteredNetworks = networks.filter(
    (net) =>
      net.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      net.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      net.subnetCidr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNetworks.length / ITEMS_PER_PAGE);
  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setRouterName('');
      setDescription('');
      setAdminStateUp(true);
      setExternalGatewayEnabled(true);
      setSelectedNetworkId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setShowAdvanced(true);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!routerName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: routerName,
        description,
        adminStateUp,
        externalGatewayEnabled,
        externalNetworkId: externalGatewayEnabled ? (selectedNetworkId ?? undefined) : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRouterName('');
    setDescription('');
    setAdminStateUp(true);
    setExternalGatewayEnabled(true);
    setSelectedNetworkId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedNetwork = networks.find((n) => n.id === selectedNetworkId);

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'radio',
      label: '',
      width: '40px',
      render: (_, row) => (
        <Radio
          name="network-select"
          value={row.id}
          checked={selectedNetworkId === row.id}
          onChange={() => setSelectedNetworkId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </span>
      ),
    },
    { key: 'subnetCidr', label: 'Subnet CIDR', flex: 1 },
    { key: 'size', label: 'Size', flex: 1 },
  ];

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
            <QuotaProgressBar
              label="Router quota"
              used={routerQuota.used}
              total={routerQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={3} className="h-full">
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Router
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Create a virtual router to route traffic between different networks or subnets. You can
            optionally connect the router to an external network to enable internet access or
            floating IP usage.
          </p>
        </VStack>

        <VStack gap={6}>
          {/* Router name */}
          <FormField
            label="Router name"
            helperText={'Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"'}
            error={hasAttemptedSubmit && !routerName.trim()}
            errorMessage="Router name is required"
          >
            <Input
              value={routerName}
              onChange={(e) => setRouterName(e.target.value)}
              placeholder="e.g. web-router-01"
              fullWidth
              error={hasAttemptedSubmit && !routerName.trim()}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description (Optional)">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Router for production web servers"
              fullWidth
            />
          </FormField>

          {/* Advanced Options Disclosure */}
          <Disclosure open={showAdvanced} onChange={setShowAdvanced}>
            <Disclosure.Trigger>Label</Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={6} className="mt-3">
                {/* Admin state */}
                <FormField
                  label="Admin state"
                  description='Setting it to "Down" disables all related network or control operations, regardless of runtime status.'
                  spacing="loose"
                >
                  <Toggle
                    checked={adminStateUp}
                    onChange={(e) => setAdminStateUp(e.target.checked)}
                    label={adminStateUp ? 'Up' : 'Down'}
                  />
                </FormField>

                {/* External Gateway */}
                <FormField
                  label="External Gateway"
                  description="The external gateway connects your router to an external (public) network. When enabled, instances in the connected subnets can access the internet using floating IPs."
                  spacing="loose"
                >
                  <Toggle
                    checked={externalGatewayEnabled}
                    onChange={(e) => setExternalGatewayEnabled(e.target.checked)}
                    label={externalGatewayEnabled ? 'Open' : 'Close'}
                  />
                </FormField>
              </VStack>
            </Disclosure.Panel>
          </Disclosure>

          {/* Network Selection (only shown when External Gateway is enabled) */}
          {externalGatewayEnabled && (
            <VStack gap={3} className="pb-5">
              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search network by attributes"
                  size="sm"
                  fullWidth
                />
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredNetworks.length}
                onPageChange={setCurrentPage}
                selectedCount={selectedNetworkId ? 1 : 0}
              />

              {/* Networks Table */}
              <VStack gap={2}>
                <Table<NetworkItem>
                  columns={networkColumns}
                  data={paginatedNetworks}
                  rowKey="id"
                  onRowClick={(row) => setSelectedNetworkId(row.id)}
                  emptyMessage="No networks found"
                />
                <SelectionIndicator
                  selectedItems={
                    selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
                  }
                  onRemove={() => setSelectedNetworkId(null)}
                  emptyText="No item selected"
                />
              </VStack>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateRouterDrawer;
