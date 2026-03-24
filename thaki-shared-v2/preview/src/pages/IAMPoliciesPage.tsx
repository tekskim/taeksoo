import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Badge } from '@shared/components/Badge';
import { Title } from '@shared/components/Title';
import { Checkbox } from '@shared/components/Checkbox';
import {
  IconDownload,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

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

const mockPolicies: Policy[] = [
  {
    id: 'p-001',
    name: 'FullAccess',
    type: 'Built-in',
    apps: 'All (*)',
    roles: 'admin',
    description: 'Full access to all resources',
    editedAt: 'Sep 12, 2025',
    permissions: [
      {
        application: 'All',
        partition: '*',
        resource: '*',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
    ],
  },
  {
    id: 'p-002',
    name: 'ReadCompute',
    type: 'Built-in',
    apps: 'compute:tenantA (+3)',
    roles: 'compute-admin (+1)',
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
    id: 'p-003',
    name: 'ViewNetwork',
    type: 'Built-in',
    apps: 'network (+1)',
    roles: 'network-viewer',
    description: 'Read-only network access',
    editedAt: 'Aug 20, 2025',
  },
  {
    id: 'p-004',
    name: 'ManageStorage',
    type: 'Custom',
    apps: 'storage (+2)',
    roles: 'storage-manager',
    description: 'Storage management policy',
    editedAt: 'Aug 15, 2025',
    permissions: [
      {
        application: 'Storage',
        partition: '-',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      {
        application: 'Storage',
        partition: '-',
        resource: 'Snapshot',
        actions: ['Read', 'List', 'Write'],
      },
    ],
  },
  {
    id: 'p-005',
    name: 'DeveloperAccess',
    type: 'Custom',
    apps: 'compute (+2)',
    roles: 'developer',
    description: 'Developer access policy',
    editedAt: 'Sep 1, 2025',
  },
  {
    id: 'p-006',
    name: 'QAAccess',
    type: 'Custom',
    apps: 'compute (+1)',
    roles: 'qa-tester',
    description: 'QA tester access',
    editedAt: 'Sep 5, 2025',
  },
  {
    id: 'p-007',
    name: 'SecurityFullAccess',
    type: 'Built-in',
    apps: 'iam (+2)',
    roles: 'security-admin',
    description: 'Security administration',
    editedAt: 'Jul 10, 2025',
  },
  {
    id: 'p-008',
    name: 'ViewBilling',
    type: 'Built-in',
    apps: 'billing',
    roles: 'billing-viewer',
    description: 'View billing information',
    editedAt: 'Jul 1, 2025',
  },
  {
    id: 'p-009',
    name: 'SupportAccess',
    type: 'Custom',
    apps: 'support (+2)',
    roles: 'support-agent',
    description: 'Customer support access',
    editedAt: 'Aug 10, 2025',
  },
  {
    id: 'p-010',
    name: 'ReadAll',
    type: 'Built-in',
    apps: 'All (*)',
    roles: 'read-only',
    description: 'Read-only access to all',
    editedAt: 'Jun 20, 2025',
  },
];

function PolicyDetails({ permissions }: { permissions: PolicyPermission[] }) {
  return (
    <div className="border-t border-border p-4 bg-surface">
      <div className="flex flex-col gap-1">
        <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md">
          <div className="w-10 px-3 py-1.5 text-11 font-medium leading-16 text-text flex items-center">
            #
          </div>
          <div className="flex-1 px-3 py-1.5 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Application
          </div>
          <div className="flex-1 px-3 py-1.5 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Partition
          </div>
          <div className="flex-1 px-3 py-1.5 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Resource
          </div>
          <div className="flex-[2] px-3 py-1.5 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Action
          </div>
        </div>
        {permissions.map((perm, index) => (
          <div
            key={index}
            className="flex items-stretch min-h-9 bg-surface border border-border rounded-md"
          >
            <div className="w-10 px-3 py-1.5 text-12 leading-16 text-text-muted flex items-center">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">
              {perm.application}
            </div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">
              {perm.partition}
            </div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">
              {perm.resource}
            </div>
            <div className="flex-[2] min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center gap-1 flex-wrap">
              {perm.actions.map((action, i) => (
                <Badge key={i} theme="gry" size="sm">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={toggle}
    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
    aria-label="Actions"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter policy name...' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'Built-in', label: 'Built-in' },
      { value: 'Custom', label: 'Custom' },
    ],
  },
  { key: 'apps', label: 'Apps', type: 'input', placeholder: 'Enter app name...' },
  { key: 'roles', label: 'Roles', type: 'input', placeholder: 'Enter role name...' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'apps', label: 'Apps', visible: true },
  { key: 'roles', label: 'Roles', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'editedAt', label: 'Edited at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function IAMPoliciesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['p-002']));
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredPolicies = useMemo(() => {
    if (appliedFilters.length === 0) return mockPolicies;
    return mockPolicies.filter((p) =>
      appliedFilters.every((f) => {
        const val = String((p as unknown as Record<string, unknown>)[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const hasSelection = selectedRows.length > 0;

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedPolicies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const allSelected =
    paginatedPolicies.length > 0 && selectedRows.length === paginatedPolicies.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < paginatedPolicies.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Policies" />
        <Button variant="primary" size="md" onClick={() => navigate('/iam/policies/create')}>
          Create policy
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search policies by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredPolicies.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      {/* Custom div-based table for expandable rows */}
      <div className="w-full flex flex-col gap-1">
        {/* Table Header */}
        <div className="flex items-stretch min-h-[36px] bg-surface-muted border border-border rounded-base6">
          <div className="w-[40px] flex items-center justify-center px-3 py-2">
            <Checkbox
              checked={allSelected}
              onChange={() => {
                if (allSelected || someSelected) setSelectedRows([]);
                else setSelectedRows(paginatedPolicies.map((p) => p.id));
              }}
              size="sm"
            />
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Name
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Type
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Apps
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Roles
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Description
          </div>
          <div className="flex-1 flex items-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Edited at
          </div>
          <div className="w-[64px] flex items-center justify-center px-3 py-2 text-11 font-medium leading-16 text-text border-l border-border">
            Action
          </div>
        </div>

        {/* Table Rows */}
        {paginatedPolicies.map((policy) => {
          const isSelected = selectedRows.includes(policy.id);
          return (
            <div
              key={policy.id}
              className={`rounded-base6 border overflow-hidden ${isSelected ? 'bg-info-weak-bg border-primary' : 'bg-surface border-border'}`}
            >
              <div className="flex items-stretch min-h-[36px] hover:bg-surface-hover transition-colors">
                <div className="w-[40px] flex items-center justify-center px-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRowSelection(policy.id)}
                    size="sm"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2 px-3 text-12 leading-16 text-text">
                  <button
                    type="button"
                    onClick={() => policy.permissions && toggleExpand(policy.id)}
                    className={`p-0.5 hover:bg-surface-muted rounded bg-transparent border-none cursor-pointer flex-shrink-0 ${!policy.permissions ? 'invisible' : ''}`}
                  >
                    {expandedPolicies.has(policy.id) ? (
                      <IconChevronDown size={16} stroke={1.5} />
                    ) : (
                      <IconChevronRight size={16} stroke={1.5} />
                    )}
                  </button>
                  <Link
                    to={`/iam/policies/${policy.name}`}
                    className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                  >
                    {policy.name}
                  </Link>
                </div>
                <div className="flex-1 min-w-0 flex items-center px-3 text-12 leading-16 text-text truncate">
                  {policy.type}
                </div>
                <div className="flex-1 min-w-0 flex items-center px-3 text-12 leading-16 text-text truncate">
                  {policy.apps}
                </div>
                <div className="flex-1 min-w-0 flex items-center px-3 text-12 leading-16 text-text truncate">
                  {policy.roles}
                </div>
                <div className="flex-1 min-w-0 flex items-center px-3 text-12 leading-16 text-text truncate">
                  {policy.description}
                </div>
                <div className="flex-1 min-w-0 flex items-center px-3 text-12 leading-16 text-text whitespace-nowrap">
                  {policy.editedAt}
                </div>
                <div className="w-[64px] flex items-center justify-center px-3">
                  <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                    <ContextMenu.Item action={() => {}} disabled={policy.type === 'Built-in'}>
                      Manage roles
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => {}}>Duplicate</ContextMenu.Item>
                    <ContextMenu.Item action={() => {}} disabled={policy.type === 'Built-in'}>
                      Edit
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      action={() => {}}
                      danger={policy.type !== 'Built-in'}
                      disabled={policy.type === 'Built-in'}
                    >
                      Delete
                    </ContextMenu.Item>
                  </ContextMenu.Root>
                </div>
              </div>
              {expandedPolicies.has(policy.id) && policy.permissions && (
                <PolicyDetails permissions={policy.permissions} />
              )}
            </div>
          );
        })}
      </div>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
