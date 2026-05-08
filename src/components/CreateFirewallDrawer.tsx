import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  Input,
  Select,
  Toggle,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TenantItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'error' | 'building' | 'shutoff' | 'muted';
  disabled?: boolean;
}

export interface PolicyOption {
  value: string;
  label: string;
}

export interface CreateFirewallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenants?: TenantItem[];
  ingressPolicies?: PolicyOption[];
  egressPolicies?: PolicyOption[];
  onSubmit?: (data: {
    name: string;
    description: string;
    tenantId: string;
    ingressPolicyId: string;
    egressPolicyId: string;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultTenants: TenantItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `12345678`,
  name: 'tenant A',
  description: '-',
  status: i === 4 ? 'error' : ('active' as TenantItem['status']),
  disabled: i === 4,
}));

const defaultIngressPolicies: PolicyOption[] = [
  { value: 'policy-1', label: 'ingress-policy-1' },
  { value: 'policy-2', label: 'ingress-policy-2' },
  { value: 'policy-3', label: 'ingress-policy-3' },
];

const defaultEgressPolicies: PolicyOption[] = [
  { value: 'policy-1', label: 'egress-policy-1' },
  { value: 'policy-2', label: 'egress-policy-2' },
  { value: 'policy-3', label: 'egress-policy-3' },
];

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Column definitions
   ---------------------------------------- */

const getTenantColumns = (
  selectedTenantId: string | null,
  onSelect: (id: string) => void
): TableColumn<TenantItem>[] => [
  {
    key: 'radio' as keyof TenantItem,
    label: '',
    width: '40px',
    render: (_, row) => (
      <Radio
        name="tenant-select"
        value={row.id}
        checked={selectedTenantId === row.id}
        onChange={() => onSelect(row.id)}
        disabled={row.disabled}
      />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    sortable: true,
    render: (_, row) =>
      row.disabled ? (
        <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
      ) : (
        <StatusIndicator layout="icon-only" status={row.status} size="sm" />
      ),
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-text-default)] truncate">
            {row.name}
          </span>
          {row.disabled && (
            <IconAlertCircle size={14} className="shrink-0 text-[var(--color-state-danger)]" />
          )}
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID: {row.id}</span>
      </div>
    ),
  },
  {
    key: 'description',
    label: 'Description',
    flex: 1,
    sortable: true,
  },
];

/* ----------------------------------------
   CreateFirewallDrawer Component
   ---------------------------------------- */

export function CreateFirewallDrawer({
  isOpen,
  onClose,
  tenants = defaultTenants,
  ingressPolicies = defaultIngressPolicies,
  egressPolicies = defaultEgressPolicies,
  onSubmit,
}: CreateFirewallDrawerProps) {
  const [firewallName, setFirewallName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [ingressPolicy, setIngressPolicy] = useState('');
  const [egressPolicy, setEgressPolicy] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const filteredTenants = useMemo(
    () =>
      tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [tenants, searchQuery]
  );

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (isOpen) {
      setFirewallName('');
      setDescription('');
      setSelectedTenantId(null);
      setIngressPolicy('');
      setEgressPolicy('');
      setAdminStateUp(true);
      setSearchQuery('');
      setCurrentPage(1);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setNameError(null);
      setTenantError(null);
    }
  }, [isOpen]);

  const handleSelectTenant = (id: string) => {
    const tenant = tenants.find((t) => t.id === id);
    if (tenant?.disabled) return;
    setSelectedTenantId(id);
    if (tenantError) setTenantError(null);
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    let hasError = false;

    if (!firewallName.trim()) {
      setNameError('Please enter a firewall name.');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!selectedTenantId) {
      setTenantError('Please select a tenant.');
      hasError = true;
    } else {
      setTenantError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: firewallName,
        description,
        tenantId: selectedTenantId!,
        ingressPolicyId: ingressPolicy,
        egressPolicyId: egressPolicy,
        adminStateUp,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFirewallName('');
    setDescription('');
    setSelectedTenantId(null);
    setIngressPolicy('');
    setEgressPolicy('');
    setAdminStateUp(true);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    setNameError(null);
    setTenantError(null);
    onClose();
  };

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const tenantColumns = getTenantColumns(selectedTenantId, handleSelectTenant);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create firewall"
      width={540}
      footer={
        <HStack gap={2} className="w-full">
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
      }
    >
      <VStack gap={6}>
        {/* Firewall name */}
        <FormField
          label="Firewall name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          error={hasAttemptedSubmit && !!nameError}
          required
        >
          <Input
            value={firewallName}
            onChange={(e) => {
              setFirewallName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter policy name"
            fullWidth
            error={hasAttemptedSubmit && !!nameError}
          />
          {hasAttemptedSubmit && nameError && (
            <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          )}
        </FormField>

        {/* Description */}
        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
          />
        </FormField>

        {/* Owned tenant */}
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Owned tenant <span className="text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the tenant that will own the policy.
            </span>
          </VStack>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearchQuery('');
              setCurrentPage(1);
            }}
            placeholder="Search tenants by attributes"
            size="sm"
            className="w-[280px]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTenants.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedTenantId ? 1 : 0}
          />

          <VStack gap={2} className="w-full">
            <Table<TenantItem>
              columns={tenantColumns}
              data={paginatedTenants}
              rowKey="id"
              onRowClick={(row) => {
                if (!row.disabled) handleSelectTenant(row.id);
              }}
              emptyMessage="No tenants found"
            />

            <SelectionIndicator
              selectedItems={
                selectedTenant ? [{ id: selectedTenant.id, label: selectedTenant.name }] : []
              }
              onRemove={() => setSelectedTenantId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedTenantId}
              errorMessage="Please select a tenant."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>

        {/* Ingress Policy */}
        <FormField label="Ingress Policy">
          <FormField.Description>
            Select the ingress policy to apply to the firewall.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={ingressPolicy}
              onChange={(val) => setIngressPolicy(val)}
              options={ingressPolicies}
              placeholder="Select a policy"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Egress Policy */}
        <FormField label="Egress Policy">
          <FormField.Description>
            Select the egress policy to apply to the firewall.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={egressPolicy}
              onChange={(val) => setEgressPolicy(val)}
              options={egressPolicies}
              placeholder="Select a policy"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Admin state */}
        <FormField label="Admin state" spacing="loose">
          <FormField.Description>
            Indicates whether the policy rules have been audited.
          </FormField.Description>
          <FormField.Control>
            <HStack gap={2} align="center">
              <Toggle checked={adminStateUp} onChange={setAdminStateUp} />
              <span className="text-body-md text-[var(--color-text-default)]">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateFirewallDrawer;
