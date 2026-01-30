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
} from '@/design-system';
import { IconAlertCircle } from '@tabler/icons-react';
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
          title="Delete Template"
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
          {c.hasWarning && (
            <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
              <IconAlertCircle
                size={16}
                className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
                stroke={1.5}
              />
              <p className="text-body-sm text-[var(--color-text-default)] leading-4">
                {c.warningText}
              </p>
            </div>
          )}
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
        width={376}
      >
        <VStack gap={4}>
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
        width={376}
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
        <VStack gap={4}>
          <VStack gap={2}>
            <label className="text-label-md text-[var(--color-text-default)]">Setting Name </label>
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
export function EditBasicInfoDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Edit basic Information</h2>

        {/* Agent Name */}
        <FormField required>
          <FormField.Label>Agent name</FormField.Label>
          <FormField.Control>
            <Input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter a name for this agent"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Description */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an description"
              fullWidth
              rows={3}
            />
          </FormField.Control>
        </FormField>

        {/* Status */}
        <FormField required>
          <FormField.Label>Status</FormField.Label>
          <FormField.HelperText>
            Choose whether the agent will be active immediately or remain inactive.
          </FormField.HelperText>
          <FormField.Control>
            <RadioGroup value={status} onChange={setStatus}>
              <VStack gap={3}>
                <Radio value="inactive" label="Inactive" />
                <Radio value="active" label="Active" />
              </VStack>
            </RadioGroup>
          </FormField.Control>
        </FormField>

        {/* Tag */}
        <FormField>
          <FormField.Label>Tag</FormField.Label>
          <FormField.HelperText>
            Tags help categorize and identify your resources.
          </FormField.HelperText>
          <FormField.Control>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Enter tags"
              fullWidth
            />
          </FormField.Control>
          <p className="text-body-sm text-[var(--color-text-subtle)]">Up to 10 tags allowed.</p>
          {tags.length > 0 && (
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-2 py-2 w-full">
              <div className="flex gap-1 flex-wrap">
                {tags.map((tag, index) => (
                  <Chip key={index} label={tag} onRemove={() => handleRemoveTag(index)} />
                ))}
              </div>
            </div>
          )}
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
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Edit model settings</h2>

        {/* Model Provider */}
        <FormField required>
          <FormField.Label>Model provider</FormField.Label>
          <FormField.HelperText>Select the LLM provider for this agent.</FormField.HelperText>
          <FormField.Control>
            <Select
              options={providerOptions}
              value={modelProvider}
              onChange={setModelProvider}
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Model */}
        <FormField required>
          <FormField.Label>Model</FormField.Label>
          <FormField.HelperText>
            Choose the model version offered by the selected provider.
          </FormField.HelperText>
          <FormField.Control>
            <Select options={modelOptions} value={model} onChange={setModel} fullWidth />
          </FormField.Control>
        </FormField>

        {/* Temperature */}
        <FormField required>
          <FormField.Label>Temperature</FormField.Label>
          <FormField.HelperText>
            Adjust how creative or deterministic the model's responses should be.
          </FormField.HelperText>
          <FormField.Control>
            <div className="flex items-center gap-2 w-full">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={setTemperature}
                className="flex-1"
              />
              <span className="text-body-md text-[var(--color-text-subtle)] w-8 text-right">
                {temperature}
              </span>
            </div>
          </FormField.Control>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Lower values make answers more consistent, while higher values increase variability.
          </p>
        </FormField>

        {/* Max Tokens */}
        <FormField required>
          <FormField.Label>Max tokens</FormField.Label>
          <FormField.HelperText>
            Set the maximum number of tokens for the response.
          </FormField.HelperText>
          <FormField.Control>
            <div className="flex items-center gap-2 w-full">
              <Slider
                min={1000}
                max={64000}
                step={1000}
                value={maxTokens}
                onChange={setMaxTokens}
                className="flex-1"
              />
              <span className="text-body-md text-[var(--color-text-subtle)] w-16 text-right">
                {maxTokens.toLocaleString()}
              </span>
            </div>
          </FormField.Control>
          <p className="text-body-sm text-[var(--color-text-subtle)]">Max: 64,000</p>
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
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Edit prompt settings</h2>

        {/* System Prompt */}
        <FormField>
          <FormField.Label>System prompt</FormField.Label>
          <FormField.HelperText>
            Defines the agent's core behavior and response rules.
          </FormField.HelperText>
          <FormField.Control>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter a prompt or task for your agent"
              fullWidth
              rows={3}
            />
          </FormField.Control>
        </FormField>

        {/* Tone */}
        <FormField required>
          <FormField.Label>Tone</FormField.Label>
          <FormField.HelperText>Select the response style the agent should use.</FormField.HelperText>
          <FormField.Control>
            <RadioGroup value={tone} onChange={setTone}>
              <VStack gap={3}>
                <Radio value="default" label="Default" />
                <Radio value="professional" label="Professional" />
                <Radio value="casual" label="Casual" />
                <Radio value="technical" label="Technical" />
                <Radio value="creative" label="Creative" />
              </VStack>
            </RadioGroup>
          </FormField.Control>
        </FormField>

        {/* Max Iteration */}
        <FormField required>
          <FormField.Label>Max iteration</FormField.Label>
          <FormField.HelperText>
            Limits how many reasoning cycles the agent can run.
          </FormField.HelperText>
          <FormField.Control>
            <NumberInput
              value={maxIteration}
              onChange={setMaxIteration}
              min={1}
              max={10}
              step={1}
            />
          </FormField.Control>
          <p className="text-body-sm text-[var(--color-text-subtle)]">Max: 10</p>
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

// Connect Data Source Drawer
export function ConnectDataSourceDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const dataSources = [
    { id: '1', name: 'Document Store A', type: 'File', documents: 150, size: '2.3 GB' },
    { id: '2', name: 'Knowledge Base', type: 'Database', documents: 500, size: '5.1 GB' },
    { id: '3', name: 'FAQ Collection', type: 'File', documents: 75, size: '120 MB' },
  ];

  const handleToggle = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1"
            disabled={selectedSources.length === 0}
          >
            Connect ({selectedSources.length})
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <div>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Connect data source</h2>
          <p className="text-body-md text-[var(--color-text-subtle)] mt-2">
            Select data sources to connect to this agent.
          </p>
        </div>

        {/* Data Source List */}
        <VStack gap={2} className="w-full">
          {dataSources.map((source) => (
            <div
              key={source.id}
              onClick={() => handleToggle(source.id)}
              className={`
                w-full p-4 rounded-lg border cursor-pointer transition-all
                ${
                  selectedSources.includes(source.id)
                    ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-md font-medium text-[var(--color-text-default)]">
                    {source.name}
                  </p>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    {source.type} • {source.documents} documents • {source.size}
                  </p>
                </div>
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedSources.includes(source.id)
                      ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]'
                      : 'border-[var(--color-border-strong)]'
                  }
                `}
                >
                  {selectedSources.includes(source.id) && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </VStack>
      </VStack>
    </Drawer>
  );
}

// Connect MCP Server Drawer
export function ConnectMCPServerDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedServers, setSelectedServers] = useState<string[]>([]);

  const mcpServers = [
    { id: '1', name: 'Slack Integration', category: 'Communication', tags: ['slack', 'messaging'] },
    { id: '2', name: 'GitHub Tools', category: 'Development', tags: ['github', 'git', 'code'] },
    { id: '3', name: 'Jira Connector', category: 'Project Management', tags: ['jira', 'tickets'] },
  ];

  const handleToggle = (id: string) => {
    setSelectedServers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1"
            disabled={selectedServers.length === 0}
          >
            Connect ({selectedServers.length})
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <div>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Connect MCP server</h2>
          <p className="text-body-md text-[var(--color-text-subtle)] mt-2">
            Select MCP servers to connect to this agent.
          </p>
        </div>

        {/* MCP Server List */}
        <VStack gap={2} className="w-full">
          {mcpServers.map((server) => (
            <div
              key={server.id}
              onClick={() => handleToggle(server.id)}
              className={`
                w-full p-4 rounded-lg border cursor-pointer transition-all
                ${
                  selectedServers.includes(server.id)
                    ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-md font-medium text-[var(--color-text-default)]">
                    {server.name}
                  </p>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">{server.category}</p>
                  <div className="flex gap-1 mt-1">
                    {server.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-body-xs bg-[var(--color-surface-subtle)] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedServers.includes(server.id)
                      ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]'
                      : 'border-[var(--color-border-strong)]'
                  }
                `}
                >
                  {selectedServers.includes(server.id) && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
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

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={() => setIsEditBasicInfoOpen(true)}>
        Edit Basic Info
      </Button>
      <EditBasicInfoDrawer isOpen={isEditBasicInfoOpen} onClose={() => setIsEditBasicInfoOpen(false)} />

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
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 w-full">
        <div className="border-l-2 border-[var(--color-border-default)] pl-3">
          <p className="text-body-md font-medium text-[var(--color-text-default)]">agent Name</p>
          <p className="text-body-md text-[var(--color-text-subtle)]">{agentName}</p>
        </div>
      </div>

      {/* Danger Warning */}
      <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start w-full">
        <IconAlertCircle
          size={16}
          className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
          stroke={1.5}
        />
        <p className="text-body-sm text-[var(--color-text-default)]">
          Deleting a agent source is a permanent action and cannot be undone.
        </p>
      </div>

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
