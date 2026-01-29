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
} from '@/design-system';
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
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">
          {label}
        </span>
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
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
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
              label="Router Quota"
              used={routerQuota.used}
              total={routerQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[152px] h-8"
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
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Create a virtual router to route traffic between different networks or subnets. You can
            optionally connect the router to an external network to enable internet access or
            floating IP usage.
          </p>
        </VStack>

        <VStack gap={6}>
          {/* Router name */}
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)] leading-5">
              Router name
            </span>
            <Input
              value={routerName}
              onChange={(e) => setRouterName(e.target.value)}
              placeholder="e.g. web-router-01"
              fullWidth
              error={hasAttemptedSubmit && !routerName.trim()}
            />
            {hasAttemptedSubmit && !routerName.trim() ? (
              <span className="text-body-sm text-[var(--color-state-danger)]">
                Router name is required
              </span>
            ) : (
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
              </span>
            )}
          </VStack>

          {/* Description */}
          <VStack gap={2}>
            <HStack gap={1.5} align="center">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Description
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
                (Optional)
              </span>
            </HStack>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Router for production web servers"
              fullWidth
            />
          </VStack>

          {/* Advanced Options Disclosure */}
          <Disclosure open={showAdvanced} onChange={setShowAdvanced}>
            <Disclosure.Trigger>Lable</Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={6} className="mt-3">
                {/* Admin State */}
                <VStack gap={3}>
                  <VStack gap={2}>
                    <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                      Admin State
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
                      Setting it to "Down" disables all related network or control operations,
                      regardless of runtime status.
                    </span>
                  </VStack>
                  <Toggle
                    checked={adminStateUp}
                    onChange={(e) => setAdminStateUp(e.target.checked)}
                    label={adminStateUp ? 'Up' : 'Down'}
                  />
                </VStack>

                {/* External Gateway */}
                <VStack gap={3}>
                  <VStack gap={2}>
                    <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                      External Gateway
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
                      The external gateway connects your router to an external (public) network.
                      <br />
                      When enabled, instances in the connected subnets can access the internet using
                      floating IPs.
                    </span>
                  </VStack>
                  <Toggle
                    checked={externalGatewayEnabled}
                    onChange={(e) => setExternalGatewayEnabled(e.target.checked)}
                    label={externalGatewayEnabled ? 'Open' : 'Close'}
                  />
                </VStack>
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
              />

              {/* Networks Table */}
              <div
                className="flex flex-col gap-[var(--table-row-gap)]"
                style={{ width: '648px', maxWidth: '648px' }}
              >
                {/* Header */}
                <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                  <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
                  <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                    Status
                  </div>
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                    Name
                  </div>
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                    Subnet CIDR
                  </div>
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                    Size
                  </div>
                </div>

                {/* Rows */}
                {paginatedNetworks.map((net) => (
                  <div
                    key={net.id}
                    className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                      selectedNetworkId === net.id
                        ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                        : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                    }`}
                    onClick={() => setSelectedNetworkId(net.id)}
                  >
                    {/* Radio */}
                    <div
                      className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Radio
                        name="network-select"
                        value={net.id}
                        checked={selectedNetworkId === net.id}
                        onChange={() => setSelectedNetworkId(net.id)}
                      />
                    </div>
                    {/* Status */}
                    <div className="w-[59px] flex items-center justify-center">
                      <StatusIndicator status={net.status} layout="icon-only" size="sm" />
                    </div>
                    {/* Name with ID */}
                    <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                      <HStack gap={1.5} align="center">
                        <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                          {net.name}
                        </span>
                        <IconExternalLink
                          size={12}
                          stroke={1.5}
                          className="shrink-0 text-[var(--color-action-primary)]"
                        />
                      </HStack>
                      <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                        ID : {net.id}
                      </span>
                    </div>
                    {/* Subnet CIDR */}
                    <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                        {net.subnetCidr}
                      </span>
                    </div>
                    {/* Size */}
                    <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                        {net.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              <SelectionIndicator
                selectedItems={
                  selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
                }
                onRemove={() => setSelectedNetworkId(null)}
                emptyText="No item Selected"
                className="shrink-0"
                style={{ width: '648px' }}
              />
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateRouterDrawer;
