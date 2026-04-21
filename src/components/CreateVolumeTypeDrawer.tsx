import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Toggle,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  Tooltip,
  Table,
  FormField,
  CopyButton,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExclamationCircle, IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CreateVolumeTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    description: string;
    isPublic: boolean;
    tenantIds: string[];
  }) => void;
}

interface TenantItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deactivated';
  description: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTenants: TenantItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: `tenant ${String.fromCharCode(65 + (i % 26))}`,
  status: i === 4 ? 'deactivated' : 'active',
  description: '-',
}));

/* ----------------------------------------
   CreateVolumeTypeDrawer Component
   ---------------------------------------- */

export function CreateVolumeTypeDrawer({ isOpen, onClose, onSubmit }: CreateVolumeTypeDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setIsPublic(false);
      setSearchQuery('');
      setCurrentPage(1);
      setSelectedTenantIds([]);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setNameError(null);
      setTenantError(false);
    }
  }, [isOpen]);

  const filteredTenants = mockTenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const disabledTenantIds = paginatedTenants
    .filter((t) => t.status === 'deactivated')
    .map((t) => t.id);

  const tenantColumns: TableColumn<TenantItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_value, row) => (
        <StatusIndicator
          status={row.status === 'active' ? 'active' : 'deactivated'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/compute-admin/tenants/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)] shrink-0" />
            {row.status === 'deactivated' && (
              <Tooltip content="This tenant is disabled.">
                <IconExclamationCircle
                  size={12}
                  className="text-[var(--color-state-danger)] shrink-0"
                />
              </Tooltip>
            )}
          </div>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-disabled)] truncate">
            ID: {row.id}
            <CopyButton
              value={row.id}
              size="sm"
              iconOnly
              variant="ghost"
              className="h-auto p-0 text-[var(--color-text-disabled)] hover:text-[var(--color-text-muted)]"
            />
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)]">{value as string}</span>
      ),
    },
  ];

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Please enter a name.');
      valid = false;
    } else if (name.trim().length < 2 || name.trim().length > 128) {
      setNameError('Name must be between 2-128 characters.');
      valid = false;
    } else {
      setNameError(null);
    }
    if (selectedTenantIds.length === 0) {
      setTenantError(true);
      valid = false;
    } else {
      setTenantError(false);
    }
    return valid;
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: name.trim(),
        description: description.trim(),
        isPublic,
        tenantIds: selectedTenantIds,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setNameError(null);
    setTenantError(false);
    onClose();
  };

  const selectedTenantItems = selectedTenantIds.map((id) => {
    const t = mockTenants.find((t) => t.id === id);
    return { id, label: t?.name ?? id };
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create volume type"
      description="Creates a new volume type and configures its basic properties."
      width={560}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
          error={hasAttemptedSubmit && !!nameError}
          errorMessage={hasAttemptedSubmit && nameError ? nameError : undefined}
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            fullWidth
          />
        </FormField>

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_(){}[]), and maximum 255 characters."
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
          />
        </FormField>

        <FormField
          label="Public"
          description="Indicates whether the volume type is available to all projects."
          spacing="loose"
        >
          <Toggle checked={isPublic} onChange={setIsPublic} label={isPublic ? 'On' : 'Off'} />
        </FormField>

        <VStack gap={3} className="w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Tenants <span className="text-[var(--color-state-danger)]">*</span>
            </h3>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select the tenants that are allowed to use the volume type.
            </p>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tenants by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTenants.length}
          />

          <VStack gap={2}>
            <Table
              columns={tenantColumns}
              data={paginatedTenants}
              rowKey="id"
              selectable
              selectedKeys={selectedTenantIds}
              onSelectionChange={(keys) => {
                setSelectedTenantIds(keys as string[]);
                if (tenantError && keys.length > 0) setTenantError(false);
              }}
              disabledKeys={disabledTenantIds}
              onRowClick={(row) => {
                if (row.status === 'deactivated') return;
                setSelectedTenantIds((prev) =>
                  prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
                );
                if (tenantError) setTenantError(false);
              }}
              emptyMessage="No tenants found"
            />

            <SelectionIndicator
              selectedItems={selectedTenantItems}
              onRemove={(id) => setSelectedTenantIds((prev) => prev.filter((tid) => tid !== id))}
              emptyText="No items selected"
              error={tenantError}
              errorMessage="Please select at least one tenant."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeTypeDrawer;
