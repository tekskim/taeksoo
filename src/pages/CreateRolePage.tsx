import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  SectionCard,
  Pagination,
  SelectionIndicator,
  SearchInput,
  Chip,
  Checkbox,
  FormField,
  PageShell,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconCheck,
  IconExternalLink,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'add-policies';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  'add-policies': SectionState;
}

interface PolicyPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface Policy {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  roles: string;
  description: string;
  editedAt: string;
  permissions?: PolicyPermission[];
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'add-policies': 'Attach policies',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'add-policies'];

/* ----------------------------------------
   Mock Data - Policies
   ---------------------------------------- */

const mockPolicies: Policy[] = [
  {
    id: 'policy-1',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute:tenantA (+3)',
    roles: 'member (+2)',
    description: '-',
    editedAt: 'Sep 12, 2025',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Instance',
        actions: ['Read', 'List'],
      },
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write'],
      },
    ],
  },
  {
    id: 'policy-2',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute (+3)',
    roles: 'member (+2)',
    description: '-',
    editedAt: 'Sep 12, 2025',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'AI_server',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Container',
        partition: '*all',
        resource: '*all',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'IAM',
        partition: '-',
        resource: '*all',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      { application: 'Storage', partition: '-', resource: 'block_01', actions: ['Read'] },
    ],
  },
  {
    id: 'policy-3',
    name: 'ComputeFullAccess',
    type: 'Built-in',
    apps: 'compute',
    roles: 'admin',
    description: 'Full access to compute resources',
    editedAt: 'Aug 15, 2025',
    permissions: [
      {
        application: 'Compute',
        partition: '*all',
        resource: 'Instance',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Compute',
        partition: '*all',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
    ],
  },
  {
    id: 'policy-4',
    name: 'StorageReadOnly',
    type: 'Built-in',
    apps: 'storage',
    roles: 'viewer',
    description: 'Read-only access to storage',
    editedAt: 'Aug 10, 2025',
    permissions: [
      { application: 'Storage', partition: '*all', resource: 'Bucket', actions: ['Read', 'List'] },
      { application: 'Storage', partition: '*all', resource: 'Object', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'policy-5',
    name: 'NetworkAdmin',
    type: 'Custom',
    apps: 'network',
    roles: 'network-admin',
    description: 'Network administration policy',
    editedAt: 'Jul 20, 2025',
    permissions: [
      {
        application: 'Network',
        partition: '*all',
        resource: 'VPC',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Network',
        partition: '*all',
        resource: 'Subnet',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
    ],
  },
  {
    id: 'policy-6',
    name: 'ContainerDeploy',
    type: 'Custom',
    apps: 'container (+2)',
    roles: 'developer (+1)',
    description: 'Container deployment permissions',
    editedAt: 'Jul 15, 2025',
    permissions: [
      {
        application: 'Container',
        partition: 'tenantA',
        resource: 'Deployment',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'Container',
        partition: 'tenantA',
        resource: 'Service',
        actions: ['Read', 'List', 'Write'],
      },
    ],
  },
  {
    id: 'policy-7',
    name: 'IAMViewOnly',
    type: 'Built-in',
    apps: 'iam',
    roles: 'viewer',
    description: 'View-only IAM permissions',
    editedAt: 'Jun 30, 2025',
    permissions: [
      { application: 'IAM', partition: '-', resource: 'User', actions: ['Read', 'List'] },
      { application: 'IAM', partition: '-', resource: 'Role', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'policy-8',
    name: 'SecurityAudit',
    type: 'Built-in',
    apps: 'security (+3)',
    roles: 'auditor',
    description: 'Security audit permissions',
    editedAt: 'Jun 25, 2025',
    permissions: [
      {
        application: 'Security',
        partition: '*all',
        resource: 'AuditLog',
        actions: ['Read', 'List'],
      },
      {
        application: 'Security',
        partition: '*all',
        resource: 'Compliance',
        actions: ['Read', 'List'],
      },
    ],
  },
  {
    id: 'policy-9',
    name: 'DatabaseAdmin',
    type: 'Custom',
    apps: 'database',
    roles: 'db-admin',
    description: 'Database administration policy',
    editedAt: 'Jun 20, 2025',
    permissions: [
      {
        application: 'Database',
        partition: '*all',
        resource: 'Instance',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Database',
        partition: '*all',
        resource: 'Backup',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
    ],
  },
  {
    id: 'policy-10',
    name: 'LoggingAccess',
    type: 'Built-in',
    apps: 'logging',
    roles: 'support',
    description: 'Access to logging services',
    editedAt: 'Jun 15, 2025',
    permissions: [
      { application: 'Logging', partition: '*all', resource: 'Log', actions: ['Read', 'List'] },
      { application: 'Logging', partition: '*all', resource: 'Metric', actions: ['Read', 'List'] },
    ],
  },
];

/* ----------------------------------------
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
        <span className="text-body-sm text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSection Component
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header
        title={title}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   SectionStatusIcon Component
   ---------------------------------------- */

function SectionStatusIcon({ status }: { status: SectionState }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div
        className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }

  if (status === 'writing') {
    return (
      <div
        className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }

  return (
    <div
      className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   SummarySidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: SectionStatus;
  onCancel: () => void;
  onCreate: () => void;
  isCreateEnabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateEnabled,
}: SummarySidebarProps) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card with Header and Status */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Header */}
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Create role</h4>

            {/* Section Status List */}
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Writing...
                      </span>
                    ) : (
                      <SectionStatusIcon status={sectionStatus[sectionKey]} />
                    )}
                  </div>
                );
              })}
            </div>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={isCreateEnabled ? 'primary' : 'secondary'}
            onClick={onCreate}
            disabled={!isCreateEnabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  roleName: string;
  onRoleNameChange: (value: string) => void;
  roleNameError: string | null;
  onRoleNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  roleName,
  onRoleNameChange,
  roleNameError,
  onRoleNameErrorChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  const handleNext = () => {
    if (!roleName.trim()) {
      onRoleNameErrorChange('Role name is required.');
      return;
    }
    onNext();
  };

  const handleDone = () => {
    if (!roleName.trim()) {
      onRoleNameErrorChange('Role name is required.');
      return;
    }
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic information"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Role Name */}
          <div className="py-6">
            <FormField required error={!!roleNameError}>
              <FormField.Label>Role name</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => {
                    onRoleNameChange(e.target.value);
                    onRoleNameErrorChange(null);
                  }}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{roleNameError}</FormField.ErrorMessage>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (+=,.@-_), and the length must
                be between 2-128 characters.
              </FormField.HelperText>
            </FormField>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <div className="py-6">
            <FormField>
              <FormField.Label>Description</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
                characters.
              </FormField.HelperText>
            </FormField>
          </div>

          {/* Divider + Next Button (only when not editing) */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   PolicyDetails Component
   ---------------------------------------- */

interface PolicyDetailsProps {
  permissions: PolicyPermission[];
}

function PolicyDetails({ permissions }: PolicyDetailsProps) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] p-4 bg-[var(--color-surface-default)]">
      <div className="flex flex-col gap-[var(--table-row-gap)]">
        {/* Table Header */}
        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
          <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
            #
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Application
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Partition
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Resource
          </div>
          <div className="flex-[2] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Action
          </div>
        </div>

        {/* Table Rows */}
        {permissions.map((perm, index) => (
          <div
            key={index}
            className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-colors"
          >
            <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-muted)] flex items-center">
              {index + 1}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.application}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.partition}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.resource}
            </div>
            <div className="flex-[2] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center gap-1 flex-wrap">
              {perm.actions.map((action, i) => (
                <Chip key={i} value={action} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   AddPoliciesSection Component
   ---------------------------------------- */

interface AddPoliciesSectionProps {
  selectedPolicies: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
  policiesError: string | null;
  onPoliciesErrorChange: (error: string | null) => void;
}

function AddPoliciesSection({
  selectedPolicies,
  onSelectionChange,
  onNext,
  onSkip,
  isEditing,
  onEditCancel,
  onEditDone,
  policiesError,
  onPoliciesErrorChange,
}: AddPoliciesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['policy-2']));
  const itemsPerPage = 5;

  const filteredPolicies = mockPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.apps.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle policy expansion
  const togglePolicyExpansion = (policyId: string) => {
    setExpandedPolicies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  // Toggle row selection
  const toggleRowSelection = (policyId: string) => {
    if (selectedPolicies.includes(policyId)) {
      onSelectionChange(selectedPolicies.filter((id) => id !== policyId));
    } else {
      onSelectionChange([...selectedPolicies, policyId]);
    }
  };

  // Toggle all rows selection
  const toggleAllSelection = (checked: boolean) => {
    if (checked) {
      onSelectionChange(paginatedPolicies.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Attach policies"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (selectedPolicies.length === 0) {
                    onPoliciesErrorChange('Please select at least one policy.');
                    return;
                  }
                  onEditDone();
                }}
              >
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        <VStack gap={0} className="py-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)]">Policies</span>
              <span className="text-[var(--color-state-danger)]">*</span>
            </div>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select policies to apply to this role. If policies include conditions, all conditions
              must be satisfied for the permission to be granted.
            </span>
          </div>

          {/* Search */}
          <div className="mt-4">
            <SearchInput
              placeholder="Search policies by attributes"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              size="sm"
              className="w-[var(--search-input-width)]"
            />
          </div>

          {/* Pagination above table */}
          {totalPages > 0 && (
            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredPolicies.length}
                selectedCount={selectedPolicies.length}
              />
            </div>
          )}

          {/* Table */}
          <div className="mt-3 w-full flex flex-col gap-1">
            {/* Table Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              {/* Checkbox column */}
              <div className="w-[40px] flex items-center justify-center px-3 py-2">
                <Checkbox
                  checked={
                    selectedPolicies.length > 0 &&
                    selectedPolicies.length === paginatedPolicies.length
                  }
                  indeterminate={
                    selectedPolicies.length > 0 &&
                    selectedPolicies.length < paginatedPolicies.length
                  }
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                />
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Name
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Type
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Apps
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Roles
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Description
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Edited at
              </div>
            </div>

            {/* Table Rows */}
            {paginatedPolicies.map((policy) => (
              <div
                key={policy.id}
                className="rounded-[var(--table-row-radius)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] transition-colors overflow-hidden"
              >
                {/* Main Row */}
                <div className="flex items-stretch min-h-[var(--table-row-height)] hover:bg-[var(--table-row-hover-bg)] transition-colors">
                  {/* Checkbox */}
                  <div className="w-[40px] flex items-center justify-center px-3 py-2">
                    <Checkbox
                      checked={selectedPolicies.includes(policy.id)}
                      onChange={() => toggleRowSelection(policy.id)}
                    />
                  </div>
                  {/* Name with expand icon */}
                  <div className="flex-1 flex items-center gap-2 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    <button
                      onClick={() => policy.permissions && togglePolicyExpansion(policy.id)}
                      className={`p-0.5 hover:bg-[var(--color-surface-subtle)] rounded ${!policy.permissions ? 'invisible' : ''}`}
                    >
                      {expandedPolicies.has(policy.id) ? (
                        <IconChevronDown size={12} stroke={1.5} />
                      ) : (
                        <IconChevronRight size={12} stroke={1.5} />
                      )}
                    </button>
                    <HStack gap={1.5} align="center">
                      <span className="text-label-md text-[var(--color-action-primary)]">
                        {policy.name}
                      </span>
                      <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                    </HStack>
                  </div>
                  {/* Type */}
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.type}
                  </div>
                  {/* Apps */}
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.apps}
                  </div>
                  {/* Roles */}
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.roles}
                  </div>
                  {/* Description */}
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.description}
                  </div>
                  {/* Edited at */}
                  <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.editedAt}
                  </div>
                </div>

                {/* Expanded Policy Details */}
                {expandedPolicies.has(policy.id) && policy.permissions && (
                  <PolicyDetails permissions={policy.permissions} />
                )}
              </div>
            ))}
          </div>

          {/* Selection indicator */}
          <div className="mt-2">
            <SelectionIndicator
              selectedItems={selectedPolicies.map((policyId) => {
                const policy = mockPolicies.find((p) => p.id === policyId);
                return { id: policyId, label: policy?.name || policyId };
              })}
              onRemove={(id) => {
                onSelectionChange(selectedPolicies.filter((pId) => pId !== id));
              }}
              error={!!policiesError}
              errorMessage={policiesError || undefined}
            />
          </div>
        </VStack>
        {/* Skip and Next Buttons (only when not editing) */}
        {!isEditing && (
          <>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" gap={2} className="pt-3">
              <Button variant="secondary" onClick={onSkip}>
                Skip
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedPolicies.length === 0) {
                    onPoliciesErrorChange('Please select at least one policy.');
                    return;
                  }
                  onNext();
                }}
              >
                Next
              </Button>
            </HStack>
          </>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main CreateRolePage Component
   ---------------------------------------- */

export default function CreateRolePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Create role');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    'add-policies': 'pre',
  });
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Form state - Basic Information
  const [roleName, setRoleName] = useState('');
  const [roleNameError, setRoleNameError] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Form state - Policies
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [policiesError, setPoliciesError] = useState<string | null>(null);

  // Check if all sections are done
  const allSectionsDone = Object.values(sectionStatus).every((s) => s === 'done');

  // Helper functions for editing
  const handleEdit = useCallback((section: SectionStep) => {
    setEditingSection(section);
    const sectionIndex = SECTION_ORDER.indexOf(section);

    setSectionStatus((prev) => {
      const newStatus = { ...prev };

      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((key, index) => {
        if (index < sectionIndex) {
          newStatus[key] = 'done';
        } else if (index === sectionIndex) {
          newStatus[key] = 'active';
        } else if (prev[key] === 'done' || prev[key] === 'active') {
          newStatus[key] = 'writing';
        }
      });

      return newStatus;
    });
  }, []);

  const handleEditCancel = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle section navigation
  const handleNext = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    setSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/iam/roles');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    console.log('Creating role:', {
      roleName,
      description,
      selectedPolicies,
    });
    navigate('/iam/roles');
  }, [navigate, roleName, description, selectedPolicies]);

  // Get display values for done sections
  const getSelectedPoliciesDisplay = () => {
    if (selectedPolicies.length === 0) return 'No policies selected';
    const policyNames = selectedPolicies
      .map((id) => mockPolicies.find((p) => p.id === id)?.name)
      .filter(Boolean);
    return policyNames.join(', ');
  };

  return (
    <PageShell
      sidebar={
        <IAMSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath="/iam/roles"
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'Roles', href: '/iam/roles' },
                { label: 'Create role' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      {/* Main content area */}
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create role</h1>
        </div>
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            {sectionStatus['basic-info'] === 'pre' && (
              <PreSection title={SECTION_LABELS['basic-info']} />
            )}
            {sectionStatus['basic-info'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['basic-info']} />
            )}
            {sectionStatus['basic-info'] === 'active' && (
              <BasicInformationSection
                roleName={roleName}
                onRoleNameChange={setRoleName}
                roleNameError={roleNameError}
                onRoleNameErrorChange={setRoleNameError}
                description={description}
                onDescriptionChange={setDescription}
                onNext={() => handleNext('basic-info')}
                isEditing={editingSection === 'basic-info'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {sectionStatus['basic-info'] === 'done' && (
              <DoneSection
                title={SECTION_LABELS['basic-info']}
                onEdit={() => handleEdit('basic-info')}
              >
                <SectionCard.DataRow label="Role name" value={roleName} showDivider={false} />
                <SectionCard.DataRow label="Description" value={description || '-'} />
              </DoneSection>
            )}

            {/* Add Policies Section */}
            {sectionStatus['add-policies'] === 'pre' && (
              <PreSection title={SECTION_LABELS['add-policies']} />
            )}
            {sectionStatus['add-policies'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['add-policies']} />
            )}
            {sectionStatus['add-policies'] === 'active' && (
              <AddPoliciesSection
                selectedPolicies={selectedPolicies}
                onSelectionChange={(ids) => {
                  setSelectedPolicies(ids);
                  if (ids.length > 0) {
                    setPoliciesError(null);
                  }
                }}
                onNext={() => handleNext('add-policies')}
                onSkip={() => handleNext('add-policies')}
                isEditing={editingSection === 'add-policies'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
                policiesError={policiesError}
                onPoliciesErrorChange={setPoliciesError}
              />
            )}
            {sectionStatus['add-policies'] === 'done' && (
              <DoneSection
                title={SECTION_LABELS['add-policies']}
                onEdit={() => handleEdit('add-policies')}
              >
                <SectionCard.DataRow
                  label="Selected policies"
                  value={getSelectedPoliciesDisplay()}
                  showDivider={false}
                />
              </DoneSection>
            )}
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateEnabled={allSectionsDone && !editingSection}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}
