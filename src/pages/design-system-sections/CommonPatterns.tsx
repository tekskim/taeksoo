import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  SearchInput,
  FilterSearchInput,
  Table,
  Pagination,
  Toggle,
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
  VStack,
  HStack,
  DetailHeader,
  SectionCard,
  FormField,
  Chip,
  SelectionIndicator,
  Modal,
  Drawer,
  ListToolbar,
  ContextMenu,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import {
  IconChevronDown,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconDownload,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTerminal2,
} from '@tabler/icons-react';

/* ========================================
   1. Page Layout Patterns
   ======================================== */

/**
 * List Page Pattern
 * 가장 많이 사용되는 패턴 (60+ 파일)
 * 구성: Page Header + ListToolbar + Pagination + Table
 */
export function ListPagePatternDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Filter fields configuration
  const filterFields: FilterField[] = [
    { id: 'name', label: 'Name', type: 'text' },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'error', label: 'Error' },
      ],
    },
  ];

  const columns = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center' as const,
      render: (_: string, row: { status: string }) => (
        <StatusIndicator
          status={row.status as 'active' | 'error' | 'building'}
          layout="icon-only"
        />
      ),
    },
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name },
    { key: 'type', label: 'Type', flex: 1, minWidth: columnMinWidths.type },
    { key: 'createdAt', label: 'Created', flex: 1, minWidth: columnMinWidths.createdAt },
    { key: 'actions', label: '', width: fixedColumns.actions, align: 'center' as const },
  ];

  const data = [
    { id: '1', status: 'active', name: 'instance-01', type: 'Standard', createdAt: '2024-01-15' },
    { id: '2', status: 'error', name: 'instance-02', type: 'High Memory', createdAt: '2024-01-14' },
    { id: '3', status: 'building', name: 'instance-03', type: 'Standard', createdAt: '2024-01-13' },
  ];

  // Convert applied filters to toolbar format
  const toolbarFilters = appliedFilters.map((f) => ({
    id: f.fieldId,
    label: `${filterFields.find((field) => field.id === f.fieldId)?.label}: ${f.value}`,
  }));

  return (
    <VStack gap={3} className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between h-8">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">Instances</h1>
        <Button size="md">Create Instance</Button>
      </div>

      {/* ListToolbar */}
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <FilterSearchInput
              filters={filterFields}
              appliedFilters={appliedFilters}
              onFiltersChange={setAppliedFilters}
              placeholder="Search instances by attributes"
              size="sm"
              className="w-[var(--search-input-width)]"
              hideAppliedFilters
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<IconDownload size={12} />}
              aria-label="Download"
            />
          </ListToolbar.Actions>
        }
        bulkActions={
          <ListToolbar.Actions>
            <Button
              variant="muted"
              size="sm"
              leftIcon={<IconPlayerPlay size={12} />}
              disabled={selectedKeys.length === 0}
            >
              Start
            </Button>
            <Button
              variant="muted"
              size="sm"
              leftIcon={<IconPlayerStop size={12} />}
              disabled={selectedKeys.length === 0}
            >
              Stop
            </Button>
            <Button
              variant="muted"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              disabled={selectedKeys.length === 0}
            >
              Delete
            </Button>
          </ListToolbar.Actions>
        }
        filters={toolbarFilters}
        onFilterRemove={(id) => setAppliedFilters((prev) => prev.filter((f) => f.fieldId !== id))}
        onFiltersClear={() => setAppliedFilters([])}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={5}
        totalItems={50}
        onPageChange={setCurrentPage}
        showSettings
        onSettingsClick={() => {}}
        selectedCount={selectedKeys.length}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </VStack>
  );
}

/**
 * Detail Page Pattern
 * 상세 페이지 패턴 (50+ 파일)
 * 구성: DetailHeader + Tabs + SectionCards
 */
export function DetailPagePatternDemo() {
  const [activeTab, setActiveTab] = useState('details');

  const moreActionsMenuItems = [
    { id: 'resize', label: 'Resize', onClick: () => {} },
    { id: 'migrate', label: 'Migrate', onClick: () => {}, divider: true },
    { id: 'delete', label: 'Delete', onClick: () => {}, status: 'danger' as const },
  ];

  return (
    <VStack gap={6} className="w-full">
      {/* DetailHeader */}
      <DetailHeader>
        <DetailHeader.Title>instance-production-01</DetailHeader.Title>

        <DetailHeader.Actions>
          <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
            Console
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
            Start
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
            Reboot
          </Button>
          <ContextMenu items={moreActionsMenuItems} trigger="click">
            <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
              More Actions
            </Button>
          </ContextMenu>
        </DetailHeader.Actions>

        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" status="active" />
          <DetailHeader.InfoCard label="ID" value="i-1234567890abcdef0" copyable />
          <DetailHeader.InfoCard label="Host" value="compute-node-01" />
          <DetailHeader.InfoCard label="Created at" value="2024-01-15 10:30:00" />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="details">Details</Tab>
          <Tab value="volumes">Volumes</Tab>
          <Tab value="network">Network</Tab>
        </TabList>

        <TabPanel value="details" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SectionCard>
              <SectionCard.Header
                title="Basic information"
                actions={
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                }
              />
              <SectionCard.Content>
                <SectionCard.DataRow label="Instance name" value="instance-production-01" />
                <SectionCard.DataRow label="Availability zone" value="ap-northeast-2a" />
                <SectionCard.DataRow label="Description" value="Production web server" />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Flavor" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Flavor name" value="Standard.Large" />
                <SectionCard.DataRow label="vCPU" value="4" />
                <SectionCard.DataRow label="Memory" value="8 GB" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>

        <TabPanel value="volumes" className="pt-0">
          <div className="text-body-md text-[var(--color-text-muted)] pt-4">
            Volumes tab content...
          </div>
        </TabPanel>

        <TabPanel value="network" className="pt-0">
          <div className="text-body-md text-[var(--color-text-muted)] pt-4">
            Network tab content...
          </div>
        </TabPanel>
      </Tabs>
    </VStack>
  );
}

/* ========================================
   2. Drawer Patterns
   ======================================== */

/**
 * Form Drawer Pattern
 * 폼 Drawer 패턴
 * 구성: Custom Header + Form Fields + Footer (Cancel/Submit)
 */
export function FormDrawerPatternDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Drawer</Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title=""
        showCloseButton={false}
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)} className="flex-1">
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Edit Instance</h2>

          {/* Info Box Pattern */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Instance ID</div>
            <div className="text-body-md text-[var(--color-text-default)]">i-1234567890abcdef0</div>
          </div>

          {/* Form Fields */}
          <FormField required>
            <FormField.Label>Name</FormField.Label>
            <FormField.Control>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter instance name"
                fullWidth
              />
            </FormField.Control>
          </FormField>

          <FormField>
            <FormField.Label>Description</FormField.Label>
            <FormField.Control>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>Optional description for this instance</FormField.HelperText>
          </FormField>
        </VStack>
      </Drawer>
    </>
  );
}

/**
 * Selection Drawer Pattern
 * 선택 Drawer 패턴
 * 구성: Search + Table with Radio + SelectionIndicator
 */
export function SelectionDrawerPatternDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = [
    { id: '1', name: 'network-01', status: 'active', cidr: '10.0.0.0/16' },
    { id: '2', name: 'network-02', status: 'active', cidr: '10.1.0.0/16' },
    { id: '3', name: 'network-03', status: 'error', cidr: '10.2.0.0/16' },
  ];

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Selection Drawer</Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title=""
        showCloseButton={false}
        width={696}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsOpen(false)}
              disabled={!selectedId}
              className="flex-1"
            >
              Select
            </Button>
          </HStack>
        }
      >
        <VStack gap={4}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Select Network</h2>

          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search networks..."
            size="sm"
            fullWidth
          />

          {/* Selection Indicator */}
          {selectedItem && (
            <SelectionIndicator
              selectedItems={[{ id: selectedItem.id, label: selectedItem.name }]}
              onRemove={() => setSelectedId(null)}
            />
          )}

          {/* Selection Table */}
          <div className="w-full border border-[var(--color-border-default)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                  <th className="w-10 p-3"></th>
                  <th className="text-left p-3 text-label-sm text-[var(--color-text-muted)]">
                    Status
                  </th>
                  <th className="text-left p-3 text-label-sm text-[var(--color-text-muted)]">
                    Name
                  </th>
                  <th className="text-left p-3 text-label-sm text-[var(--color-text-muted)]">
                    CIDR
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td className="p-3">
                      <Radio
                        checked={selectedId === item.id}
                        onChange={() => setSelectedId(item.id)}
                      />
                    </td>
                    <td className="p-3">
                      <StatusIndicator
                        status={item.status as 'active' | 'error'}
                        layout="icon-only"
                      />
                    </td>
                    <td className="p-3 text-body-md text-[var(--color-text-default)]">
                      {item.name}
                    </td>
                    <td className="p-3 text-body-md text-[var(--color-text-default)]">
                      {item.cidr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>
      </Drawer>
    </>
  );
}

/* ========================================
   3. Modal Patterns
   ======================================== */

/**
 * Confirmation Modal Pattern
 * 확인 Modal 패턴
 * 구성: Info Box + Description + Action Buttons
 */
export function ConfirmationModalPatternDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Instance
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Instance"
        description="This action is permanent and cannot be undone."
        size="sm"
      >
        {/* Info Box */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Instance name</span>
          <span className="text-body-md text-[var(--color-text-default)]">
            instance-production-01
          </span>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}

/**
 * Warning Modal Pattern
 * 경고 Modal 패턴
 * 구성: Info Box + Warning Alert + Action Buttons
 */
export function WarningModalPatternDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Reboot Instance
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Reboot Instance"
        description="This will restart the instance."
        size="sm"
      >
        <VStack gap={3}>
          {/* Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Instance name</span>
            <span className="text-body-md text-[var(--color-text-default)]">
              instance-production-01
            </span>
          </div>

          {/* Warning Alert */}
          <div className="bg-[var(--color-state-warning-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-warning)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)]">
              Rebooting will cause temporary downtime. All unsaved data may be lost.
            </p>
          </div>
        </VStack>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)} className="flex-1">
            Reboot
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ========================================
   4. Form Patterns
   ======================================== */

/**
 * FormField Pattern
 * FormField 패턴
 * 구성: Required, Error, Helper Text 상태
 */
export function FormFieldPatternDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('invalid-email');
  const [type, setType] = useState('');

  return (
    <VStack gap={4} className="w-full max-w-md">
      {/* Required Field */}
      <FormField required>
        <FormField.Label>Name</FormField.Label>
        <FormField.Control>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            fullWidth
          />
        </FormField.Control>
        <FormField.HelperText>This will be displayed as the resource name</FormField.HelperText>
      </FormField>

      {/* Error State */}
      <FormField required error>
        <FormField.Label>Email</FormField.Label>
        <FormField.Control>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            error
            fullWidth
          />
        </FormField.Control>
        <FormField.ErrorMessage>Please enter a valid email address</FormField.ErrorMessage>
      </FormField>

      {/* Select Field */}
      <FormField required>
        <FormField.Label>Type</FormField.Label>
        <FormField.Control>
          <Select
            value={type}
            onChange={setType}
            placeholder="Select type"
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'high-memory', label: 'High Memory' },
              { value: 'high-cpu', label: 'High CPU' },
            ]}
            fullWidth
          />
        </FormField.Control>
      </FormField>
    </VStack>
  );
}

/**
 * Toggle with Label Pattern
 * Toggle + Label 패턴
 */
export function TogglePatternDemo() {
  const [enabled, setEnabled] = useState(true);
  const [adminState, setAdminState] = useState(true);

  return (
    <VStack gap={4}>
      {/* Basic Toggle */}
      <HStack gap={3} align="center">
        <Toggle checked={enabled} onChange={setEnabled} />
        <span className="text-body-md text-[var(--color-text-default)]">
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
      </HStack>

      {/* Admin State Toggle */}
      <HStack gap={3} align="center">
        <Toggle checked={adminState} onChange={setAdminState} />
        <span className="text-body-md text-[var(--color-text-default)]">
          Admin State: {adminState ? 'Up' : 'Down'}
        </span>
      </HStack>
    </VStack>
  );
}

/**
 * Radio Group Pattern
 * RadioGroup 패턴
 */
export function RadioGroupPatternDemo() {
  const [source, setSource] = useState('blank');

  return (
    <RadioGroup
      label="Source"
      description="Select the source for the new volume"
      value={source}
      onChange={setSource}
      direction="vertical"
    >
      <Radio value="blank" label="Blank Volume" />
      <Radio value="image" label="From Image" />
      <Radio value="snapshot" label="From Snapshot" />
    </RadioGroup>
  );
}

/* ========================================
   5. Data Display Patterns
   ======================================== */

/**
 * Info Box Pattern
 * Info Box 패턴 (Drawer/Modal 내부에서 사용)
 */
export function InfoBoxPatternDemo() {
  return (
    <VStack gap={4} className="w-full max-w-md">
      {/* Single Value */}
      <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
        <span className="text-label-sm text-[var(--color-text-subtle)]">Instance Name</span>
        <span className="text-body-md text-[var(--color-text-default)]">
          instance-production-01
        </span>
      </div>

      {/* Multiple Values */}
      <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3">
        <HStack gap={6}>
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)]">Name</span>
            <span className="text-body-md text-[var(--color-text-default)]">instance-01</span>
          </VStack>
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)]">Type</span>
            <span className="text-body-md text-[var(--color-text-default)]">Standard</span>
          </VStack>
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)]">Status</span>
            <StatusIndicator status="active" label="Running" />
          </VStack>
        </HStack>
      </div>
    </VStack>
  );
}

/**
 * SectionCard with Actions Pattern
 * SectionCard + Actions 패턴
 */
export function SectionCardWithActionsDemo() {
  return (
    <SectionCard>
      <SectionCard.Header
        title="Account Information"
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="Username" value="john.doe" />
        <SectionCard.DataRow label="Email" value="john.doe@example.com" />
        <SectionCard.DataRow label="Role" value="Administrator" />
        <SectionCard.DataRow label="Labels">
          <HStack gap={1}>
            <Chip value="admin" />
            <Chip value="developer" />
          </HStack>
        </SectionCard.DataRow>
      </SectionCard.Content>
    </SectionCard>
  );
}

/**
 * Key-Value Grid Pattern
 * Key-Value Grid 패턴 (Labels, Annotations 표시)
 */
export function KeyValueGridPatternDemo() {
  const data = [
    { key: 'app', value: 'nginx' },
    { key: 'environment', value: 'production' },
    { key: 'version', value: 'v1.2.3' },
  ];

  return (
    <VStack gap={3} className="w-full">
      {data.map((item, index) => (
        <HStack key={item.key} gap={2} align="end" className="w-full">
          <div className="w-[200px]">
            {index === 0 && (
              <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                Key
              </label>
            )}
            <div className="w-full h-9 px-3 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md text-body-md text-[var(--color-text-default)] flex items-center">
              {item.key}
            </div>
          </div>
          <div className="flex-1">
            {index === 0 && (
              <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                Value
              </label>
            )}
            <div className="w-full h-9 px-3 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md text-body-md text-[var(--color-text-default)] flex items-center">
              {item.value}
            </div>
          </div>
        </HStack>
      ))}
    </VStack>
  );
}

/* ========================================
   6. Button Patterns
   ======================================== */

/**
 * Action Button Patterns
 * 버튼 패턴 모음
 */
export function ActionButtonPatternsDemo() {
  return (
    <VStack gap={6}>
      {/* Cancel / Submit Pattern */}
      <VStack gap={2} align="start">
        <span className="text-label-sm text-[var(--color-text-muted)]">
          Cancel / Submit (Drawer Footer)
        </span>
        <HStack gap={2}>
          <Button variant="secondary" className="flex-1 min-w-[120px]">
            Cancel
          </Button>
          <Button variant="primary" className="flex-1 min-w-[120px]">
            Save
          </Button>
        </HStack>
      </VStack>

      {/* Cancel / Danger Pattern */}
      <VStack gap={2} align="start">
        <span className="text-label-sm text-[var(--color-text-muted)]">
          Cancel / Danger (Delete Modal)
        </span>
        <HStack gap={2}>
          <Button variant="secondary" className="flex-1 min-w-[120px]">
            Cancel
          </Button>
          <Button variant="danger" className="flex-1 min-w-[120px]">
            Delete
          </Button>
        </HStack>
      </VStack>

      {/* Toolbar Actions */}
      <VStack gap={2} align="start">
        <span className="text-label-sm text-[var(--color-text-muted)]">Toolbar Actions</span>
        <HStack gap={2}>
          <Button variant="secondary" size="sm" disabled>
            Delete (0)
          </Button>
          <Button variant="primary" size="sm" leftIcon={<IconPlus size={14} />}>
            Create
          </Button>
        </HStack>
      </VStack>

      {/* Edit Mode Actions */}
      <VStack gap={2} align="start">
        <span className="text-label-sm text-[var(--color-text-muted)]">
          Edit Mode Actions (SectionCard Header)
        </span>
        <HStack gap={2}>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Done
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}

/* ========================================
   Pattern Documentation Section
   ======================================== */

export function CommonPatternsSection() {
  return (
    <VStack gap={8} className="w-full">
      {/* Page Layout Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">
          1. Page Layout Patterns
        </h3>

        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">List Page Pattern</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              리스트 페이지의 기본 구조입니다. Toolbar + Pagination + Table 조합으로 60개 이상의
              페이지에서 사용됩니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <ListPagePatternDemo />
            </div>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">
              Detail Page Pattern
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              상세 페이지의 기본 구조입니다. DetailHeader + Tabs + SectionCards 조합으로 50개 이상의
              페이지에서 사용됩니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <DetailPagePatternDemo />
            </div>
          </VStack>
        </VStack>
      </VStack>

      {/* Drawer Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">2. Drawer Patterns</h3>

        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Form Drawer</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              폼 Drawer 패턴입니다. Custom Header + Info Box + FormFields + Footer 구조입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <FormDrawerPatternDemo />
            </div>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Selection Drawer</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              선택 Drawer 패턴입니다. Search + Radio Table + SelectionIndicator 구조입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <SelectionDrawerPatternDemo />
            </div>
          </VStack>
        </VStack>
      </VStack>

      {/* Modal Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">3. Modal Patterns</h3>

        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Confirmation Modal</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              확인/삭제 Modal 패턴입니다. Info Box + Action Buttons 구조입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <HStack gap={4}>
                <ConfirmationModalPatternDemo />
                <WarningModalPatternDemo />
              </HStack>
            </div>
          </VStack>
        </VStack>
      </VStack>

      {/* Form Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">4. Form Patterns</h3>

        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">FormField States</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              FormField의 Required, Error, Helper Text 상태입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <FormFieldPatternDemo />
            </div>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">
              Toggle & RadioGroup
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Toggle + Label, RadioGroup 패턴입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <HStack gap={8} align="start">
                <TogglePatternDemo />
                <RadioGroupPatternDemo />
              </HStack>
            </div>
          </VStack>
        </VStack>
      </VStack>

      {/* Data Display Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">
          5. Data Display Patterns
        </h3>

        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Info Box</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Drawer/Modal 내부에서 컨텍스트 정보를 표시하는 Info Box 패턴입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <InfoBoxPatternDemo />
            </div>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">
              SectionCard with Actions
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Header에 Action 버튼이 있는 SectionCard 패턴입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <SectionCardWithActionsDemo />
            </div>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Key-Value Grid</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Labels, Annotations 등 Key-Value 쌍을 표시하는 Grid 패턴입니다.
            </p>
            <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
              <KeyValueGridPatternDemo />
            </div>
          </VStack>
        </VStack>
      </VStack>

      {/* Button Patterns */}
      <VStack gap={4}>
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">6. Button Patterns</h3>

        <VStack gap={2}>
          <p className="text-body-md text-[var(--color-text-muted)]">
            다양한 상황에서 사용되는 버튼 조합 패턴입니다.
          </p>
          <div className="p-4 border border-[var(--color-border-default)] rounded-lg">
            <ActionButtonPatternsDemo />
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
}
