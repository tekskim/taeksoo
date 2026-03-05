import { useState } from 'react';
import {
  Modal,
  Drawer,
  ConfirmModal,
  Button,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Slider,
  NumberInput,
  Radio,
  RadioGroup,
  Chip,
  InlineMessage,
  FormField,
  SearchInput,
  StatusIndicator,
  Badge,
  Table,
  SelectionIndicator,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { Label } from './HelperComponents';
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';

/* ----------------------------------------
   Modal Demo Components ---------------------------------------- */

// Basic Modal Demo
export function ModalDemo({
  variant,
}: {
  variant: 'basic' | 'delete' | 'size-sm' | 'size-md' | 'size-lg';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonLabel = () => {
    switch (variant) {
      case 'basic':
        return 'Open Basic Modal';
      case 'delete':
        return 'Open Delete Modal';
      case 'size-sm':
        return 'Small (320px)';
      case 'size-md':
        return 'Medium (400px)';
      case 'size-lg':
        return 'Large (560px)';
      default:
        return 'Open Modal';
    }
  };

  const getSize = (): 'sm' | 'md' | 'lg' => {
    if (variant === 'size-sm') return 'sm';
    if (variant === 'size-lg') return 'lg';
    return variant === 'delete' ? 'sm' : 'md';
  };

  if (variant === 'delete') {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          {getButtonLabel()}
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('Deleted!');
            setIsOpen(false);
          }}
          title="Delete template"
          description="Removing the selected instances is permanent and cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Template name"
          infoValue="My-web-template"
        />
      </>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {getButtonLabel()}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="This is a modal description that provides additional context."
        size={getSize()}
      >
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-body-md text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside a modal.
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel{' '}
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Confirm{' '}
          </Button>
        </div>
      </Modal>
    </>
  );
}

// Modal Use Case Demos
export function ModalUseCaseDemo({
  useCase,
}: {
  useCase: 'delete-single' | 'delete-multiple' | 'disassociate' | 'restore-warning';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const config = {
    'delete-single': {
      button: 'Delete (Single)',
      title: 'Delete Security group',
      description: 'Removing the selected instances is permanent and cannot be undone.',
      size: 'sm' as const,
      infoLabel: 'Security group',
      infoValue: 'sg-01',
      hasWarning: true,
      warningText:
        'This action will permanently delete the security group and all its rules. If this group is attached to any instances, their network traffic may be affected.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    'delete-multiple': {
      button: 'Delete (Multiple)',
      title: 'Delete Security groups',
      description: 'Removing the selected instances is permanent and cannot be undone.',
      size: 'md' as const,
      infoLabel: 'Security groups (5)',
      infoList: ['sg-01', 'sg-02', 'sg-03', 'sg-04', 'sg-05'],
      hasWarning: true,
      warningText: 'This action will permanently delete the security groups and all their rules.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    disassociate: {
      button: 'Disassociate',
      title: 'Disassociate floating IP',
      description:
        'Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately.',
      size: 'sm' as const,
      infoLabel: 'Floating IP',
      infoValue: '123.45.67.8',
      secondInfoLabel: 'Associated to',
      secondInfoList: ['Type : Instance', 'Name : server-01', 'Fixed IP : 10.0.0.10'],
      hasWarning: false,
      actionText: 'Disassociate',
      actionVariant: 'primary' as const,
    },
    'restore-warning': {
      button: 'Restore (Disabled)',
      title: 'Restore backup',
      description: 'Large volume backups may impact performance and network throughput.',
      size: 'md' as const,
      infoLabel: 'Volume name',
      infoValue: 'vol-01 (Available)',
      secondInfoLabel: 'Instance name',
      secondInfoList: ['web-server-1 (Running)', 'dev-team (Running)'],
      hasWarning: true,
      warningText:
        'Restore cannot proceed. Change the backup status to Available or shut down the attached instance.',
      actionText: 'Restore',
      actionVariant: 'primary' as const,
      disabled: true,
    },
  };

  const c = config[useCase];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {c.button}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={c.title}
        description={c.description}
        size={c.size}
      >
        <div className="flex flex-col gap-2">
          {/* Info Box */}
          <div
            className={`bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 ${'infoList' in c ? 'max-h-[96px] overflow-y-auto sidebar-scroll' : ''}`}
          >
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              {c.infoLabel}
            </span>
            {'infoValue' in c && (
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {c.infoValue}
              </span>
            )}
            {'infoList' in c && (
              <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.infoList?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Second Info Box (if exists) */}
          {'secondInfoLabel' in c && (
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                {c.secondInfoLabel}
              </span>
              <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.secondInfoList?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Alert */}
          {c.hasWarning && <InlineMessage variant="error">{c.warningText}</InlineMessage>}
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant={c.actionVariant}
            size="md"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            disabled={'disabled' in c && c.disabled}
          >
            {c.actionText}
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ----------------------------------------
   Drawer Demo (with state)
   ---------------------------------------- */

export function DrawerDemo() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAttachVolumeOpen, setIsAttachVolumeOpen] = useState(false);
  const [formValue, setFormValue] = useState('');

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Basic Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsBasicOpen(true)}>
        Basic Drawer{' '}
      </Button>
      <Drawer
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Drawer Title"
        width={360}
      >
        <VStack gap={6}>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-body-md text-[var(--color-text-default)]">
              This is a basic drawer with content. Drawers are useful for secondary content, forms,
              or detail views.
            </p>
          </div>
          <VStack gap={2}>
            <Label>Example content</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              You can put any content inside a drawer, including forms, lists, or details.
            </p>
          </VStack>
        </VStack>
      </Drawer>

      {/* Drawer with Footer */}
      <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
        With button{' '}
      </Button>
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Edit Settings"
        width={360}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Cancel{' '}
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Save{' '}
            </Button>
          </div>
        }
      >
        <VStack gap={6}>
          <VStack gap={2}>
            <label className="text-label-md text-[var(--color-text-default)]">Setting Name</label>
            <Input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Enter value..."
              fullWidth
            />
          </VStack>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-3">
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Drawers with footers are useful for forms with action buttons.
            </p>
          </div>
        </VStack>
      </Drawer>

      {/* Attach volume Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsAttachVolumeOpen(true)}>
        Attach volume{' '}
      </Button>
      <AttachVolumeDrawer
        isOpen={isAttachVolumeOpen}
        onClose={() => setIsAttachVolumeOpen(false)}
        instanceName="web-server-10"
        onAttach={(volumeId) => {
          console.log('Attach volume:', volumeId);
          setIsAttachVolumeOpen(false);
        }}
        onCreateNewVolume={() => {
          console.log('Create new volume');
        }}
      />
    </div>
  );
}

/* ----------------------------------------
   AI Agent Drawer Demos
   ---------------------------------------- */

// Edit Basic Information Drawer
export function EditBasicInfoDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('inactive');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2', 'Tag 3']);

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit basic Information"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Agent Name */}
        <FormField label="Agent name" required>
          <Input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter a name for this agent"
            fullWidth
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add an description"
            fullWidth
            rows={3}
          />
        </FormField>

        {/* Status */}
        <FormField
          label="Status"
          description="Choose whether the agent will be active immediately or remain inactive."
          spacing="loose"
          required
        >
          <RadioGroup value={status} onChange={setStatus}>
            <VStack gap={2}>
              <Radio value="inactive" label="Inactive" />
              <Radio value="active" label="Active" />
            </VStack>
          </RadioGroup>
        </FormField>

        {/* Tag */}
        <FormField
          label="Tag"
          description="Tags help categorize and identify your resources."
          helperText="Up to 10 tags allowed."
        >
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Enter tags"
            fullWidth
          />
        </FormField>
        {tags.length > 0 && (
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-2 py-2 w-full -mt-4">
            <div className="flex gap-1 flex-wrap">
              {tags.map((tag, index) => (
                <Chip key={index} label={tag} onRemove={() => handleRemoveTag(index)} />
              ))}
            </div>
          </div>
        )}

        {/* Warning Message */}
        <InlineMessage variant="warning">
          If there is an active chat session, the settings are applied immediately and may affect
          the ongoing conversation.
        </InlineMessage>
      </VStack>
    </Drawer>
  );
}

// Edit Model Settings Drawer
export function EditModelSettingsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [modelProvider, setModelProvider] = useState('anthropic');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [temperature, setTemperature] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(50000);

  const providerOptions = [
    { value: 'anthropic', label: 'Anthropic (Claude)' },
    { value: 'openai', label: 'OpenAI (GPT)' },
    { value: 'google', label: 'Google (Gemini)' },
  ];

  const modelOptions = [
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Latest) - Recommended' },
    { value: 'claude-opus-4', label: 'Claude Opus 4' },
    { value: 'claude-haiku-3', label: 'Claude Haiku 3' },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit model settings"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Model Provider */}
        <FormField
          label="Model provider"
          description="Select the LLM provider for this agent."
          required
        >
          <Select
            options={providerOptions}
            value={modelProvider}
            onChange={setModelProvider}
            fullWidth
          />
        </FormField>

        {/* Model */}
        <FormField
          label="Model"
          description="Choose the model version offered by the selected provider."
          required
        >
          <Select options={modelOptions} value={model} onChange={setModel} fullWidth />
        </FormField>

        {/* Temperature */}
        <FormField
          label="Temperature"
          description="Adjust how creative or deterministic the model's responses should be."
          helperText="Lower values make answers more consistent, while higher values increase variability."
          required
        >
          <div className="flex items-center gap-2">
            <Slider min={0} max={1} step={0.1} value={temperature} onChange={setTemperature} />
            <span className="text-body-md text-[var(--color-text-subtle)] w-8 text-right">
              {temperature}
            </span>
          </div>
        </FormField>

        {/* Max Tokens */}
        <FormField
          label="Max tokens"
          description="Set the maximum number of tokens for the response."
          helperText="Max: 64,000"
          required
        >
          <div className="flex items-center gap-2">
            <Slider min={1000} max={64000} step={1000} value={maxTokens} onChange={setMaxTokens} />
            <span className="text-body-md text-[var(--color-text-subtle)] w-16 text-right">
              {maxTokens.toLocaleString()}
            </span>
          </div>
        </FormField>

        {/* Warning Message */}
        <InlineMessage variant="warning">
          If there is an active chat session, the settings are applied immediately and may affect
          the ongoing conversation.
        </InlineMessage>
      </VStack>
    </Drawer>
  );
}

// Edit Prompt Settings Drawer
export function EditPromptSettingsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState('default');
  const [maxIteration, setMaxIteration] = useState(5);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit prompt settings"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* System Prompt */}
        <FormField
          label="System prompt"
          description="Defines the agent's core behavior and response rules."
        >
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter a prompt or task for your agent"
            fullWidth
            rows={3}
          />
        </FormField>

        {/* Tone */}
        <FormField
          label="Tone"
          description="Select the response style the agent should use."
          spacing="loose"
          required
        >
          <RadioGroup value={tone} onChange={setTone}>
            <VStack gap={2}>
              <Radio value="default" label="Default" />
              <Radio value="professional" label="Professional" />
              <Radio value="casual" label="Casual" />
              <Radio value="technical" label="Technical" />
              <Radio value="creative" label="Creative" />
            </VStack>
          </RadioGroup>
        </FormField>

        {/* Max Iteration */}
        <FormField
          label="Max iteration"
          description="Limits how many reasoning cycles the agent can run."
          helperText="Max: 10"
          required
        >
          <NumberInput value={maxIteration} onChange={setMaxIteration} min={1} max={10} step={1} />
        </FormField>

        {/* Warning Message */}
        <InlineMessage variant="warning">
          If there is an active chat session, the settings are applied immediately and may affect
          the ongoing conversation.
        </InlineMessage>
      </VStack>
    </Drawer>
  );
}

// Connect Data Source Drawer - Data source type
interface DataSourceItem {
  id: string;
  name: string;
  source: string;
  category: string;
  tags: string[];
  createdAt: string;
  status: 'active' | 'error';
}

// Connect Data Source Drawer
export function ConnectDataSourceDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const dataSources: DataSourceItem[] = [
    {
      id: '1',
      name: 'Document Store A',
      source: 'AWS S3',
      category: 'Storage',
      tags: ['docs'],
      createdAt: 'Nov 11, 2025',
      status: 'active',
    },
    {
      id: '2',
      name: 'Knowledge Base',
      source: 'PostgreSQL',
      category: 'Database',
      tags: ['knowledge'],
      createdAt: 'Nov 10, 2025',
      status: 'active',
    },
    {
      id: '3',
      name: 'FAQ Collection',
      source: 'MongoDB',
      category: 'Database',
      tags: ['faq'],
      createdAt: 'Nov 9, 2025',
      status: 'active',
    },
    {
      id: '4',
      name: 'Product Catalog',
      source: 'Redis',
      category: 'Cache',
      tags: ['product'],
      createdAt: 'Nov 8, 2025',
      status: 'active',
    },
  ];

  const filteredSources = dataSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns following design guidelines
  const columns: TableColumn<DataSourceItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator
          status={row.status === 'active' ? 'active' : 'shutoff'}
          layout="icon-only"
        />
      ),
    },
    {
      key: 'name',
      label: 'Title',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <span
          className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
          title={String(value)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
      minWidth: '100px',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      minWidth: columnMinWidths.category,
      sortable: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      flex: 1,
      minWidth: columnMinWidths.labels,
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="gray" size="sm">
              {tag}
            </Badge>
          ))}
          {row.tags.length > 2 && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              +{row.tags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Connect data sources"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Add
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Data Sources Section */}
        <VStack gap={2}>
          <p className="text-label-md text-[var(--color-text-default)]">Data sources</p>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Choose the data sources the agent can access to retrieve information for its responses.
            (Multiple selection available)
          </p>
        </VStack>

        {/* Search and Table */}
        <VStack gap={2}>
          {/* Search Input */}
          <SearchInput
            placeholder="Find data sources with filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            className="w-[280px]"
          />

          {/* Pagination Info */}
          <div className="flex items-center gap-2 text-label-sm text-[var(--color-text-subtle)]">
            <span className="text-[var(--color-action-primary)]">{selectedSources.length}</span>
            <span>/</span>
            <span>{filteredSources.length} items</span>
          </div>

          <VStack gap={2}>
            {/* Table - following design guidelines */}
            <Table
              columns={columns}
              data={filteredSources}
              rowKey="id"
              rowHeight="40px"
              selectable
              selectedKeys={selectedSources}
              onSelectionChange={setSelectedSources}
              emptyMessage="No data sources found"
            />

            {/* Selection Indicator */}
            <SelectionIndicator
              selectedItems={selectedSources.map((id) => {
                const source = dataSources.find((s) => s.id === id);
                return { id, label: source?.name || id };
              })}
              onRemove={(id) => setSelectedSources((prev) => prev.filter((s) => s !== id))}
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// MCP Tool type
interface MCPToolItem {
  id: string;
  name: string;
  server: string;
  category: string;
  tags: string[];
  createdAt: string;
  status: 'active' | 'error';
}

// Connect MCP Server Drawer
export function ConnectMCPServerDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const mcpTools: MCPToolItem[] = [
    {
      id: '1',
      name: 'send_slack_message',
      server: 'Slack',
      category: 'Communication',
      tags: ['messaging'],
      createdAt: 'Nov 11, 2025',
      status: 'active',
    },
    {
      id: '2',
      name: 'create_github_issue',
      server: 'GitHub',
      category: 'Development',
      tags: ['code'],
      createdAt: 'Nov 10, 2025',
      status: 'active',
    },
    {
      id: '3',
      name: 'search_jira_tickets',
      server: 'Jira',
      category: 'Project Management',
      tags: ['tickets'],
      createdAt: 'Nov 9, 2025',
      status: 'active',
    },
    {
      id: '4',
      name: 'query_database',
      server: 'PostgreSQL',
      category: 'Database',
      tags: ['sql'],
      createdAt: 'Nov 8, 2025',
      status: 'active',
    },
  ];

  const filteredTools = mcpTools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns following design guidelines
  const columns: TableColumn<MCPToolItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator
          status={row.status === 'active' ? 'active' : 'shutoff'}
          layout="icon-only"
        />
      ),
    },
    {
      key: 'name',
      label: 'Title',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <span
          className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
          title={String(value)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'server',
      label: 'MCP server',
      flex: 1,
      minWidth: '100px',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-md border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] shrink-0" />
          <span className="truncate" title={row.server}>
            {row.server}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      minWidth: columnMinWidths.category,
      sortable: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      flex: 1,
      minWidth: columnMinWidths.labels,
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="gray" size="sm">
              {tag}
            </Badge>
          ))}
          {row.tags.length > 2 && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              +{row.tags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Connect MCP tools"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Add
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* MCP Tools Section */}
        <VStack gap={2}>
          <p className="text-label-md text-[var(--color-text-default)]">MCP tools</p>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Choose the MCP tools the agent can use to perform actions or retrieve external
            information. (Multiple selection available)
          </p>
        </VStack>

        {/* Search and Table */}
        <VStack gap={2}>
          {/* Search Input */}
          <SearchInput
            placeholder="Find MCP tools with filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            className="w-[280px]"
          />

          {/* Pagination Info */}
          <div className="flex items-center gap-2 text-label-sm text-[var(--color-text-subtle)]">
            <span className="text-[var(--color-action-primary)]">{selectedTools.length}</span>
            <span>/</span>
            <span>{filteredTools.length} items</span>
          </div>

          {/* Table - following design guidelines */}
          <Table
            columns={columns}
            data={filteredTools}
            rowKey="id"
            rowHeight="40px"
            selectable
            selectedKeys={selectedTools}
            onSelectionChange={setSelectedTools}
            emptyMessage="No MCP tools found"
          />

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={selectedTools.map((id) => {
              const tool = mcpTools.find((t) => t.id === id);
              return { id, label: tool?.name || id };
            })}
            onRemove={(id) => setSelectedTools((prev) => prev.filter((s) => s !== id))}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Agent Log Detail Drawer
export function AgentLogDetailDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>(['step-2', 'step-3']);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const logData = {
    question: '2025년 한국 GDP 성장률 전망은?',
    response: `# 2025년 한국 GDP 성장률 전망

한국은행의 **2025년 8월 경제전망보고서**에 따르면, 2025년 한국 GDP 성장률은 **0.9%**로 전망됩니다.

## 📊 주요 전망 내용

### **연간 성장률**
- **2025년**: 0.9% (5월 전망 0.8%에서 0.1%p 상향)
- **2026년**: 1.6% (5월 전망과 동일)

### **분기별 전망 (2025년)**
- **1분기**: 0.0% (전년동기대비)
- **2분기**: 0.5%
- **3분기**: 1.6% (예상)
- **4분기**: 1.5% (예상)`,
    createdAt: 'Sep 26, 2025',
    responseTime: '29.4s',
    steps: 6,
    status: 'Completed',
  };

  const steps = [
    {
      id: 'step-1',
      type: 'Think',
      color: 'bg-[var(--primitive-color-yellow500)]',
      textColor: 'text-[var(--primitive-color-yellow50)]',
      confidence: 81,
      analyze: `사용자가 '2025년 한국 GDP 성장률 전망'을 질문했습니다. 이전 대화에서 사용자가 '한국은행 경제전망보고서 2025년 8월' 문서를 언급했고, 이 문서에 GDP 전망이 포함되어 있다고 언급했습니다.`,
      plan: `이전 대화에서 문서의 존재는 확인되었으나, 구체적인 GDP 성장률 수치는 아직 제공되지 않았습니다. 'rag_search' 도구를 사용하여 한국은행 경제전망보고서에서 2025년 GDP 성장률 전망 데이터를 찾아야 합니다.`,
    },
    {
      id: 'step-2',
      type: 'Act',
      color: 'bg-[var(--primitive-color-green600)]',
      textColor: 'text-[var(--primitive-color-green50)]',
      confidence: 81,
      analyze: 'rag_search',
      tool: `{
  "limit": 10,
  "query": "2025년 한국 GDP 성장률 전망 경제성장률 한국은행",
  "agent_id": "44f63560-0a77-42b1-901e-31981c0459b6",
  "datasource_id": null,
  "score_threshold": 0.3
}`,
    },
    {
      id: 'step-3',
      type: 'Observe',
      color: 'bg-[var(--primitive-color-blue500)]',
      textColor: 'text-[var(--primitive-color-blue50)]',
      confidence: 81,
      analyze: 'rag_search',
      toolResult: `Found 10 search results.
[Search Result 1] 📁 Document: 한국경제전망보고서_텍스트파일.pdf
📄 Chunk ID: b14b2791-f0b7-4293-b955-9655a988af51
📑 Document ID: fa41ea17-a910-4f0c-9451-0fb7d4e3c52a
🎯 Relevance Score: 0.560

GDP 성장률(%)3) 2.0 0.2 1.6 0.9 [+0.1] 2.0 1.3 1.6 [ - ]
• 민간소비 1.1 0.7 2.0 1.4 [+0.3] 2.2 1.1 1.6 [ - ]
• 건설투자 -3.3 -12.4 -4.3 -8.3 [-2.2] 4.4 3.2 3.8 [+1.0]`,
      nextAction: 'complete',
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Log detail" width={696}>
      <VStack gap={6}>
        <VStack gap={2}>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Shows a history of the agent's operations and results.
          </p>
        </VStack>

        {/* Summary Section */}
        <div className="w-full p-4 border border-[var(--color-border-default)] rounded-md">
          <VStack gap={5}>
            {/* Question & Response */}
            <VStack gap={2}>
              <p className="text-label-sm text-[var(--color-text-muted)]">
                질문: {logData.question}
              </p>
              <p className="text-label-sm text-[var(--color-text-muted)]">최종 응답</p>
              <div className="w-full h-[200px] max-h-[200px] overflow-auto bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg px-3 py-2">
                <p className="text-body-md text-[var(--color-text-subtle)] whitespace-pre-wrap">
                  {logData.response}
                </p>
              </div>
            </VStack>

            {/* Metadata */}
            <div className="flex items-center justify-between w-full">
              <HStack gap={4}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Created at: {logData.createdAt}
                </span>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Response Time: {logData.responseTime}
                </span>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Steps: {logData.steps}
                </span>
              </HStack>
              <Badge variant="success" size="sm">
                {logData.status}
              </Badge>
            </div>
          </VStack>
        </div>

        {/* Steps */}
        <VStack gap={3}>
          {steps.map((step, index) => {
            const isExpanded = expandedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className="w-full border border-[var(--color-border-default)] rounded-md overflow-hidden"
              >
                {/* Step Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--color-surface-subtle)]"
                  onClick={() => toggleStep(step.id)}
                >
                  <HStack gap={1.5}>
                    <span
                      className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path
                          d="M4.5 2L8.5 6L4.5 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-label-sm ${step.color} ${step.textColor}`}
                    >
                      {index + 1}. {step.type}
                    </span>
                  </HStack>
                  <Badge variant="gray" size="sm">
                    Confidence: {step.confidence}%
                  </Badge>
                </div>

                {/* Step Content */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <VStack gap={5}>
                      {/* Analyze */}
                      <VStack gap={1}>
                        <p className="text-label-sm text-[var(--color-text-subtle)]">Analyze</p>
                        <div className="w-full px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            {step.analyze}
                          </p>
                        </div>
                      </VStack>

                      {/* Plan (Think step) */}
                      {step.plan && (
                        <VStack gap={1}>
                          <p className="text-label-sm text-[var(--color-text-subtle)]">Plan</p>
                          <div className="w-full px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                            <p className="text-body-md text-[var(--color-text-muted)]">
                              {step.plan}
                            </p>
                          </div>
                        </VStack>
                      )}

                      {/* Tool (Act step) */}
                      {step.tool && (
                        <VStack gap={1}>
                          <p className="text-label-sm text-[var(--color-text-subtle)]">Tool</p>
                          <div className="w-full px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                            <pre className="text-body-md text-[var(--color-text-muted)] whitespace-pre-wrap font-mono text-[11px]">
                              {step.tool}
                            </pre>
                          </div>
                        </VStack>
                      )}

                      {/* Tool Result (Observe step) */}
                      {step.toolResult && (
                        <VStack gap={1}>
                          <p className="text-label-sm text-[var(--color-text-subtle)]">Tool</p>
                          <div className="w-full h-[200px] max-h-[200px] overflow-auto px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                            <p className="text-body-md text-[var(--color-text-subtle)] whitespace-pre-wrap">
                              {step.toolResult}
                            </p>
                          </div>
                        </VStack>
                      )}

                      {/* Next Action (Observe step) */}
                      {step.nextAction && (
                        <VStack gap={1}>
                          <p className="text-label-sm text-[var(--color-text-subtle)]">다음행동</p>
                          <div className="w-full px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                            <p className="text-body-md text-[var(--color-text-muted)]">
                              {step.nextAction}
                            </p>
                          </div>
                        </VStack>
                      )}
                    </VStack>
                  </div>
                )}
              </div>
            );
          })}
        </VStack>
      </VStack>
    </Drawer>
  );
}

// AI Agent Drawer Demo
export function AIAgentDrawerDemo() {
  const [isEditBasicInfoOpen, setIsEditBasicInfoOpen] = useState(false);
  const [isEditModelSettingsOpen, setIsEditModelSettingsOpen] = useState(false);
  const [isEditPromptSettingsOpen, setIsEditPromptSettingsOpen] = useState(false);
  const [isConnectDataSourceOpen, setIsConnectDataSourceOpen] = useState(false);
  const [isConnectMCPServerOpen, setIsConnectMCPServerOpen] = useState(false);
  const [isLogDetailOpen, setIsLogDetailOpen] = useState(false);

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={() => setIsEditBasicInfoOpen(true)}>
        Edit Basic Info
      </Button>
      <EditBasicInfoDrawer
        isOpen={isEditBasicInfoOpen}
        onClose={() => setIsEditBasicInfoOpen(false)}
      />

      <Button variant="outline" size="sm" onClick={() => setIsEditModelSettingsOpen(true)}>
        Edit Model Settings
      </Button>
      <EditModelSettingsDrawer
        isOpen={isEditModelSettingsOpen}
        onClose={() => setIsEditModelSettingsOpen(false)}
      />

      <Button variant="outline" size="sm" onClick={() => setIsEditPromptSettingsOpen(true)}>
        Edit Prompt Settings
      </Button>
      <EditPromptSettingsDrawer
        isOpen={isEditPromptSettingsOpen}
        onClose={() => setIsEditPromptSettingsOpen(false)}
      />

      <Button variant="outline" size="sm" onClick={() => setIsConnectDataSourceOpen(true)}>
        Connect Data Source
      </Button>
      <ConnectDataSourceDrawer
        isOpen={isConnectDataSourceOpen}
        onClose={() => setIsConnectDataSourceOpen(false)}
      />

      <Button variant="outline" size="sm" onClick={() => setIsConnectMCPServerOpen(true)}>
        Connect MCP Server
      </Button>
      <ConnectMCPServerDrawer
        isOpen={isConnectMCPServerOpen}
        onClose={() => setIsConnectMCPServerOpen(false)}
      />

      <Button variant="outline" size="sm" onClick={() => setIsLogDetailOpen(true)}>
        Log Detail
      </Button>
      <AgentLogDetailDrawer isOpen={isLogDetailOpen} onClose={() => setIsLogDetailOpen(false)} />
    </div>
  );
}

/* ----------------------------------------
   AI Agent Modal Components
   ---------------------------------------- */

// Delete Agent Source Modal
export function DeleteAgentSourceModal({
  isOpen,
  onClose,
  agentName = 'my-agent-01',
}: {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
}) {
  const handleDelete = () => {
    console.log('Delete agent source:', agentName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm agent source deletion"
      description="Are you sure you want to delete this agent source? This action cannot be undone."
      size="sm"
    >
      {/* Info Box */}
      <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
            Agent name
          </span>
          <span className="text-body-md text-[var(--color-text-default)] leading-4">
            {agentName}
          </span>
        </div>
      </div>

      {/* Danger Warning */}
      <InlineMessage variant="error">
        Deleting a agent source is a permanent action and cannot be undone.
      </InlineMessage>

      {/* Button Group */}
      <div className="flex gap-2 w-full">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} className="flex-1">
          Delete
        </Button>
      </div>
    </Modal>
  );
}

// AI Agent Modal Demo
export function AIAgentModalDemo() {
  const [isDeleteAgentSourceOpen, setIsDeleteAgentSourceOpen] = useState(false);

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={() => setIsDeleteAgentSourceOpen(true)}>
        Delete Agent Source
      </Button>
      <DeleteAgentSourceModal
        isOpen={isDeleteAgentSourceOpen}
        onClose={() => setIsDeleteAgentSourceOpen(false)}
        agentName="my-research-agent"
      />
    </div>
  );
}

// ==========================================
// MCP Tools Drawers
// ==========================================

// Create MCP Template Drawer
export function CreateMCPTemplateDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2', 'Tag 3']);
  const [category, setCategory] = useState('');
  const [authType, setAuthType] = useState('');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create MCP template"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Create
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Basic Information */}
        <VStack gap={4}>
          <h3 className="text-heading-h6 text-[var(--color-text-default)]">Basic information</h3>

          <FormField required>
            <FormField.Label>Template name</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="Enter a name for this agent"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                fullWidth
              />
            </FormField.Control>
          </FormField>

          <FormField required>
            <FormField.Label>Description</FormField.Label>
            <FormField.Control>
              <Textarea
                placeholder="Add a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                rows={3}
              />
            </FormField.Control>
          </FormField>

          <FormField>
            <FormField.Label>Version</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="Enter a name for this agent"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              The version of the template. Useful for tracking changes and updates.
            </FormField.HelperText>
          </FormField>

          <FormField required>
            <FormField.Label>Homepage URL</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="https://docs.example.com/"
                value={homepageUrl}
                onChange={(e) => setHomepageUrl(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              A URL to documentation or the homepage for this template.
            </FormField.HelperText>
          </FormField>

          <FormField>
            <FormField.Label>Tags</FormField.Label>
            <FormField.Control>
              <Input placeholder="Enter tags" fullWidth />
            </FormField.Control>
            <FormField.HelperText>
              Comma-separated tags for filtering, up to 10 tags allowed.
            </FormField.HelperText>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {tags.map((tag, idx) => (
                <Badge key={idx} theme="gray" type="subtle" size="sm">
                  {tag} ×
                </Badge>
              ))}
            </div>
          </FormField>

          <FormField>
            <FormField.Label>Category</FormField.Label>
            <FormField.Control>
              <Select
                value={category}
                onChange={(value) => setCategory(value)}
                options={[
                  { value: 'communication', label: 'Communication' },
                  { value: 'development', label: 'Development' },
                  { value: 'productivity', label: 'Productivity' },
                  { value: 'other', label: 'Other' },
                ]}
                placeholder="Select"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>The category this template belongs to.</FormField.HelperText>
          </FormField>

          <FormField>
            <FormField.Label>Auth type</FormField.Label>
            <FormField.Control>
              <Select
                value={authType}
                onChange={(value) => setAuthType(value)}
                options={[
                  { value: 'config-required', label: 'Config required' },
                  { value: 'oauth', label: 'OAuth' },
                  { value: 'api-key', label: 'API Key' },
                  { value: 'none', label: 'None' },
                ]}
                placeholder="Config Required"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              Defines whether authentication or additional config action is required to use this
              template.
            </FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Template Type Settings Drawer
export function TemplateTypeSettingsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [templateType, setTemplateType] = useState<'stdio' | 'http'>('stdio');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Template type settings"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Template Type Selection */}
        <VStack gap={4}>
          <FormField>
            <FormField.Label>Template type</FormField.Label>
            <FormField.HelperText>
              Select the template type. STDIO runs in a container, HTTP connects to a remote server.
            </FormField.HelperText>
          </FormField>

          <VStack gap={2}>
            {/* STDIO Option */}
            <div
              className={`w-full p-4 border rounded-lg cursor-pointer transition-colors ${
                templateType === 'stdio'
                  ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                  : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
              }`}
              onClick={() => setTemplateType('stdio')}
            >
              <HStack gap={3}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    templateType === 'stdio'
                      ? 'border-[var(--color-action-primary)]'
                      : 'border-[var(--color-border-default)]'
                  }`}
                >
                  {templateType === 'stdio' && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-action-primary)]" />
                  )}
                </div>
                <VStack gap={0.5}>
                  <span className="text-label-md text-[var(--color-text-default)]">
                    STDIO (Container)
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    A containerized MCP server deployed on Kubernetes
                  </span>
                </VStack>
              </HStack>
            </div>

            {/* HTTP Option */}
            <div
              className={`w-full p-4 border rounded-lg cursor-pointer transition-colors ${
                templateType === 'http'
                  ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                  : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
              }`}
              onClick={() => setTemplateType('http')}
            >
              <HStack gap={3}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    templateType === 'http'
                      ? 'border-[var(--color-action-primary)]'
                      : 'border-[var(--color-border-default)]'
                  }`}
                >
                  {templateType === 'http' && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-action-primary)]" />
                  )}
                </div>
                <VStack gap={0.5}>
                  <span className="text-label-md text-[var(--color-text-default)]">
                    HTTP (Remote)
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    External HTTP MCP server endpoint
                  </span>
                </VStack>
              </HStack>
            </div>
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Container Settings Drawer
export function ContainerSettingsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [dockerImage, setDockerImage] = useState('');
  const [port, setPort] = useState('8000');
  const [cpuRequest, setCpuRequest] = useState('');
  const [cpuLimit, setCpuLimit] = useState('');
  const [memoryRequest, setMemoryRequest] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [transportType, setTransportType] = useState('');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Container settings"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Container Configuration */}
        <VStack gap={4}>
          <FormField required>
            <FormField.Label>Docker image</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="https://dockerhub.com/..."
                value={dockerImage}
                onChange={(e) => setDockerImage(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              Specify the Docker image that will be used to run the MCP server.
            </FormField.HelperText>
          </FormField>

          <FormField>
            <FormField.Label>Port</FormField.Label>
            <FormField.Control>
              <NumberInput
                value={parseInt(port) || 8000}
                onChange={(value) => setPort(String(value))}
                min={1}
                max={65535}
              />
            </FormField.Control>
            <FormField.HelperText>
              The port on which the container listens for incoming requests.
            </FormField.HelperText>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <FormField.Label>CPU request</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter a name for this agent"
                  value={cpuRequest}
                  onChange={(e) => setCpuRequest(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                The minimum amount of CPU resources guaranteed for this container.
              </FormField.HelperText>
            </FormField>

            <FormField>
              <FormField.Label>CPU limit</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter a name for this agent"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                The maximum amount of CPU resources the container is allowed to use.
              </FormField.HelperText>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <FormField.Label>Memory request</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter a name for this agent"
                  value={memoryRequest}
                  onChange={(e) => setMemoryRequest(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                The minimum amount of memory guaranteed for this container.
              </FormField.HelperText>
            </FormField>

            <FormField>
              <FormField.Label>Memory limit</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter a name for this agent"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                The maximum amount of memory the container is allowed to consume.
              </FormField.HelperText>
            </FormField>
          </div>

          <FormField required>
            <FormField.Label>Transport type</FormField.Label>
            <FormField.Control>
              <Select
                value={transportType}
                onChange={(value) => setTransportType(value)}
                options={[
                  { value: 'streamable-http', label: 'Streamable HTTP (SSE-05-1B) - incp' },
                  { value: 'http', label: 'HTTP' },
                  { value: 'websocket', label: 'WebSocket' },
                ]}
                placeholder="Streamable HTTP (SSE-05-1B) - incp"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              Select the transport protocol used to expose the MCP server to clients.
            </FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// HTTP Settings Drawer
export function HTTPSettingsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [transportType, setTransportType] = useState('');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="HTTP settings"
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* HTTP Configuration */}
        <VStack gap={4}>
          <FormField required>
            <FormField.Label>URL</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="https://externalservice.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              The base URL of the MCP server exposed over HTTP.
            </FormField.HelperText>
          </FormField>

          <FormField>
            <FormField.Label>Headers</FormField.Label>
            <FormField.Control>
              <Input
                placeholder='{"Authorization": "Bearer ..."}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              Optional HTTP headers to include in requests to the MCP server.
            </FormField.HelperText>
          </FormField>

          <FormField required>
            <FormField.Label>Transport type</FormField.Label>
            <FormField.Control>
              <Select
                value={transportType}
                onChange={(value) => setTransportType(value)}
                options={[
                  { value: 'streamable-http', label: 'Streamable HTTP (SSE-05-1B)' },
                  { value: 'http', label: 'HTTP' },
                  { value: 'websocket', label: 'WebSocket' },
                ]}
                placeholder="Streamable HTTP (SSE-05-1B)"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              Select the transport protocol used to expose the MCP server to clients.
            </FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Tool Access Control Drawer
export function ToolAccessControlDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [visibility, setVisibility] = useState('all');
  const [rateLimit, setRateLimit] = useState('50');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit access control"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Form Fields */}
        <VStack gap={4}>
          <FormField>
            <FormField.Label>Visibility</FormField.Label>
            <FormField.Control>
              <Select
                value={visibility}
                onChange={(value) => setVisibility(value)}
                options={[
                  { value: 'all', label: 'All agents' },
                  { value: 'selected', label: 'Selected agents only' },
                  { value: 'none', label: 'Hidden' },
                ]}
                fullWidth
              />
            </FormField.Control>
          </FormField>

          <FormField>
            <FormField.Label>Rate limit per agent</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="50"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>Maximum requests per minute per agent.</FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Tool Authentication Drawer
export function ToolAuthenticationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [authType, setAuthType] = useState('oauth');
  const [tokenExpiry, setTokenExpiry] = useState('1');
  const [scopes, setScopes] = useState('');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit authentication"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Form Fields */}
        <VStack gap={4}>
          <FormField>
            <FormField.Label>Auth type</FormField.Label>
            <FormField.Control>
              <Select
                value={authType}
                onChange={(value) => setAuthType(value)}
                options={[
                  { value: 'oauth', label: 'OAuth 2.0' },
                  { value: 'api-key', label: 'API Key' },
                  { value: 'basic', label: 'Basic Auth' },
                  { value: 'none', label: 'None' },
                ]}
                fullWidth
              />
            </FormField.Control>
          </FormField>

          <FormField>
            <FormField.Label>Token expiry (hours)</FormField.Label>
            <FormField.Control>
              <NumberInput
                value={parseInt(tokenExpiry) || 1}
                onChange={(value) => setTokenExpiry(String(value))}
                min={1}
                max={24}
              />
            </FormField.Control>
          </FormField>

          <FormField>
            <FormField.Label>Scopes</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="chat:write, chat:read"
                value={scopes}
                onChange={(e) => setScopes(e.target.value)}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>Comma-separated list of OAuth scopes.</FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}
