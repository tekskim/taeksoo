import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  Select,
  SectionCard,
  Radio,
  Textarea,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconEdit,
  IconCheck,
  IconProgress,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'settings' | 'policy';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  settings: SectionState;
  policy: SectionState;
}

interface TagItem {
  id: string;
  key: string;
  value: string;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  settings: 'Settings',
  policy: 'Policy',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'settings',
  'policy',
];

/* ----------------------------------------
   PreSection Component (대기 상태)
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component (작업 중인 섹션)
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSection Component (완료 상태)
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
        showDivider
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>
        {children}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   SectionStatusIcon Component
   ---------------------------------------- */

function SectionStatusIcon({ status }: { status: SectionState }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }
  
  // active → spinning progress (currently working)
  if (status === 'active') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }
  
  // writing → no icon, show "Writing..." text instead (handled in parent)
  if (status === 'writing') {
    return null;
  }
  
  // pre → empty circle (waiting)
  return (
    <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
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

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateEnabled }: SummarySidebarProps) {
  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Summary
            </h5>
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';
                
                return (
                  <div
                    key={sectionKey}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-[12px] leading-5 text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
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
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            className="flex-[0.3]"
          >
            Cancel
          </Button>
          <Button
            variant={isCreateEnabled ? 'primary' : 'secondary'}
            size="md"
            onClick={onCreate}
            disabled={!isCreateEnabled}
            className="flex-[0.7]"
          >
            Create Bucket
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  bucketName: string;
  onBucketNameChange: (value: string) => void;
  bucketNameError: string | null;
  onBucketNameErrorChange: (error: string | null) => void;
  region: string;
  onRegionChange: (value: string) => void;
  owner: string;
  onOwnerChange: (value: string) => void;
  ownerError: string | null;
  onOwnerErrorChange: (error: string | null) => void;
  onNext: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  bucketName,
  onBucketNameChange,
  bucketNameError,
  onBucketNameErrorChange,
  region,
  onRegionChange,
  owner,
  onOwnerChange,
  ownerError,
  onOwnerErrorChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  const handleNext = () => {
    let hasError = false;
    
    if (!bucketName.trim()) {
      onBucketNameErrorChange('Bucket name is required.');
      hasError = true;
    }
    
    if (!owner) {
      onOwnerErrorChange('Owner is required.');
      hasError = true;
    }
    
    if (hasError) return;
    onNext();
  };

  const handleDone = () => {
    let hasError = false;
    
    if (!bucketName.trim()) {
      onBucketNameErrorChange('Bucket name is required.');
      hasError = true;
    }
    
    if (!owner) {
      onOwnerErrorChange('Owner is required.');
      hasError = true;
    }
    
    if (hasError) return;
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header 
        title="Basic Information" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Bucket Name */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Bucket Name <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Input
              placeholder="Enter bucket name"
              value={bucketName}
              onChange={(e) => {
                onBucketNameChange(e.target.value);
                onBucketNameErrorChange(null);
              }}
              error={!!bucketNameError}
              fullWidth
            />
            <div className="flex flex-col gap-1 mt-1">
              {bucketNameError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {bucketNameError}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                The name should start with upper letter, lower letter or chinese, and be a string of 1 to 128, characters can only contain "0-9, a-z, A-Z, "-'_.".
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Region */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Region <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Select
              options={[
                { value: 'default', label: 'Default' },
              ]}
              value={region}
              onChange={onRegionChange}
              fullWidth
            />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Owner */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Owner <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Select
              options={[
                { value: '', label: 'Select Owner' },
                { value: 'user-1', label: 'admin@thaki.cloud' },
                { value: 'user-2', label: 'user@thaki.cloud' },
              ]}
              value={owner}
              onChange={(value) => {
                onOwnerChange(value);
                onOwnerErrorChange(null);
              }}
              error={!!ownerError}
              fullWidth
            />
            {ownerError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px] mt-1">
                {ownerError}
              </span>
            )}
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
   SettingsSection Component
   ---------------------------------------- */

interface SettingsSectionProps {
  objectLocking: 'disabled' | 'enabled';
  onObjectLockingChange: (value: 'disabled' | 'enabled') => void;
  lockingMode: string;
  onLockingModeChange: (value: string) => void;
  retentionDays: string;
  onRetentionDaysChange: (value: string) => void;
  tags: TagItem[];
  onAddTag: () => void;
  onRemoveTag: (id: string) => void;
  onUpdateTag: (id: string, field: 'key' | 'value', value: string) => void;
  placementTarget: string;
  onPlacementTargetChange: (value: string) => void;
  onNext: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function SettingsSection({
  objectLocking,
  onObjectLockingChange,
  lockingMode,
  onLockingModeChange,
  retentionDays,
  onRetentionDaysChange,
  tags,
  onAddTag,
  onRemoveTag,
  onUpdateTag,
  placementTarget,
  onPlacementTargetChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: SettingsSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header 
        title="Settings" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Object Locking */}
          <div className="flex flex-col pt-2 pb-6">
            <span className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Object Locking
            </span>
            <HStack gap={6}>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Radio
                  value="disabled"
                  checked={objectLocking === 'disabled'}
                  onChange={() => onObjectLockingChange('disabled')}
                />
                <span className="text-[12px] text-[var(--color-text-default)]">Disabled</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Radio
                  value="enabled"
                  checked={objectLocking === 'enabled'}
                  onChange={() => onObjectLockingChange('enabled')}
                />
                <span className="text-[12px] text-[var(--color-text-default)]">Enabled</span>
              </label>
            </HStack>
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
              Store objects using a write-once-read-many (WORM) model to prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely. Object Locking works only in versioned buckets.
            </span>

            {/* Object Locking Options - shown when enabled */}
            {objectLocking === 'enabled' && (
              <div className="flex flex-col gap-3 mt-3">
                {/* Mode */}
                <div className="flex flex-col">
                  <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
                    Mode
                  </label>
                  <Select
                    options={[
                      { value: 'compliance', label: 'COMPLIANCE / GOVERNANCE' },
                      { value: 'compliance-only', label: 'COMPLIANCE' },
                      { value: 'governance', label: 'GOVERNANCE' },
                    ]}
                    value={lockingMode}
                    onChange={onLockingModeChange}
                    fullWidth
                  />
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                      In COMPLIANCE an object version cannot be overwritten or deleted for the duration of the period.
                    </span>
                    <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                      In GOVERNANCE mode, users cannot overwrite or delete an object version or alter its lock settings unless they have special permissions.
                    </span>
                  </div>
                </div>

                {/* Days */}
                <div className="flex flex-col">
                  <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
                    Days
                  </label>
                  <Input
                    placeholder="-"
                    value={retentionDays}
                    onChange={(e) => onRetentionDaysChange(e.target.value)}
                    fullWidth
                  />
                  <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
                    The number of days that you want to specify for the default retention period that will be applied to new objects placed in this bucket.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Tags */}
          <VStack gap={4} className="py-6">
            <HStack justify="between" align="center">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                Tags
              </span>
              <Button variant="secondary" size="sm" onClick={onAddTag}>
                Add
              </Button>
            </HStack>
            <VStack gap={1} align="stretch">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-6 px-4 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px]"
                >
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                      Key <span className="text-[var(--color-state-danger)]">*</span>
                    </span>
                    <Input
                      value={tag.key}
                      onChange={(e) => onUpdateTag(tag.id, 'key', e.target.value)}
                      style={{ width: '120px' }}
                    />
                  </HStack>
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                      Value <span className="text-[var(--color-state-danger)]">*</span>
                    </span>
                    <Input
                      value={tag.value}
                      onChange={(e) => onUpdateTag(tag.id, 'value', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </HStack>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onRemoveTag(tag.id)}
                    className="text-[var(--color-state-danger)]"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </VStack>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Placement target */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Placement target
            </label>
            <Select
              options={[
                { value: '', label: '-- Select a placement target --' },
                { value: 'default', label: 'default-placement' },
                { value: 'archive', label: 'archive-placement' },
              ]}
              value={placementTarget}
              onChange={onPlacementTargetChange}
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
              When creating a bucket, a placement target can be provided as part of the LocationConstraint to override the default placement targets from the user and zonegroup.
            </span>
          </div>

          {/* Divider + Next Button (only when not editing) */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={onNext}>
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
   PolicySection Component
   ---------------------------------------- */

interface PolicySectionProps {
  bucketPolicy: string;
  onBucketPolicyChange: (value: string) => void;
  policyValid: boolean;
  policyError: string | null;
  onClearPolicy: () => void;
  grantee: string;
  onGranteeChange: (value: string) => void;
  permissions: string;
  onPermissionsChange: (value: string) => void;
  onNext: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function PolicySection({
  bucketPolicy,
  onBucketPolicyChange,
  policyValid,
  policyError,
  onClearPolicy,
  grantee,
  onGranteeChange,
  permissions,
  onPermissionsChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: PolicySectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header 
        title="Policy" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Bucket policy */}
          <div className="flex flex-col pt-2 pb-6">
            <HStack justify="between" align="center" className="mb-2">
              <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                Bucket policy
              </label>
              <Button variant="secondary" size="sm" onClick={onClearPolicy}>
                Clear
              </Button>
            </HStack>
            <Textarea
              value={bucketPolicy}
              onChange={(e) => onBucketPolicyChange(e.target.value)}
              rows={3}
              fullWidth
              style={{
                borderColor: policyValid ? 'var(--color-state-success)' : 'var(--color-state-danger)',
              }}
            />
            {policyValid ? (
              <span className="text-[11px] text-[var(--color-state-success)] leading-[16px] mt-1">
                valid json text.
              </span>
            ) : (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px] mt-1">
                {policyError}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ACL */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              ACL
            </label>
            <div className="flex items-center gap-6 px-4 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px]">
              <HStack gap={1.5} align="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">Grantee</span>
                <Select
                  options={[
                    { value: 'owner', label: 'Owner' },
                    { value: 'everyone', label: 'Everyone' },
                    { value: 'authenticated', label: 'Authenticated User' },
                  ]}
                  value={grantee}
                  onChange={onGranteeChange}
                  style={{ width: '276px' }}
                />
              </HStack>
              <HStack gap={1.5} align="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">Permissions</span>
                <Select
                  options={
                    grantee === 'owner'
                      ? [{ value: 'full-control', label: 'Full control' }]
                      : grantee === 'everyone'
                      ? [
                          { value: 'read', label: 'Read' },
                          { value: 'read-write', label: 'Read and write' },
                        ]
                      : [{ value: 'read', label: 'Read' }]
                  }
                  value={permissions}
                  onChange={onPermissionsChange}
                  style={{ width: '140px' }}
                />
              </HStack>
            </div>
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
              Any changes to the ACL will overwrite previous one. You can choose any of the available options to modify the specified user group.
            </span>
          </div>

          {/* Divider + Next Button (only when not editing) */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={onNext}>
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
   CreateBucketPage Component
   ---------------------------------------- */

export default function CreateBucketPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    settings: 'pre',
    policy: 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Basic Information form state
  const [bucketName, setBucketName] = useState('');
  const [bucketNameError, setBucketNameError] = useState<string | null>(null);
  const [region, setRegion] = useState('default');
  const [owner, setOwner] = useState('');
  const [ownerError, setOwnerError] = useState<string | null>(null);

  // Settings form state
  const [objectLocking, setObjectLocking] = useState<'disabled' | 'enabled'>('disabled');
  const [lockingMode, setLockingMode] = useState('compliance');
  const [retentionDays, setRetentionDays] = useState('');
  const [tags, setTags] = useState<TagItem[]>([]);
  const [placementTarget, setPlacementTarget] = useState('');

  // Policy form state
  const [bucketPolicy, setBucketPolicy] = useState('{}');
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [policyValid, setPolicyValid] = useState(true);
  const [grantee, setGrantee] = useState('owner');
  const [permissions, setPermissions] = useState('full-control');

  // Helper functions for editing
  const handleEdit = useCallback((section: SectionStep) => {
    setEditingSection(section);
    const sectionIndex = SECTION_ORDER.indexOf(section);
    
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      
      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((s, idx) => {
        if (s === section) {
          // The section being edited becomes active
          newStatus[s] = 'active';
        } else if (idx < sectionIndex) {
          // Sections before the edited one stay 'done'
          // (they were already completed)
        } else if (idx > sectionIndex) {
          // Sections after the edited one:
          // - If they were 'active' or 'done', they become 'writing' (in progress but waiting)
          // - If they were 'pre', they stay 'pre'
          if (prev[s] === 'active' || prev[s] === 'done') {
            newStatus[s] = 'writing';
          }
        }
      });
      
      return newStatus;
    });
  }, []);

  const handleEditCancel = useCallback(() => {
    if (editingSection) {
      setSectionStatus((prev) => {
        const newStatus = { ...prev, [editingSection]: 'done' };
        
        // Find the first 'writing' or 'pre' section after the edited one and make it active
        const editedIndex = SECTION_ORDER.indexOf(editingSection);
        for (let i = editedIndex + 1; i < SECTION_ORDER.length; i++) {
          const section = SECTION_ORDER[i];
          if (newStatus[section] === 'writing') {
            // 'writing' sections become 'active' (resume where we left off)
            newStatus[section] = 'active';
            break;
          } else if (newStatus[section] === 'pre') {
            newStatus[section] = 'active';
            break;
          }
        }
        
        return newStatus;
      });
      setEditingSection(null);
    }
  }, [editingSection]);

  const handleEditDone = useCallback(() => {
    if (editingSection) {
      setSectionStatus((prev) => {
        const newStatus = { ...prev, [editingSection]: 'done' };
        
        // Find the first 'writing' or 'pre' section after the edited one and make it active
        const editedIndex = SECTION_ORDER.indexOf(editingSection);
        for (let i = editedIndex + 1; i < SECTION_ORDER.length; i++) {
          const section = SECTION_ORDER[i];
          if (newStatus[section] === 'writing') {
            // 'writing' sections become 'active' (resume where we left off)
            newStatus[section] = 'active';
            break;
          } else if (newStatus[section] === 'pre') {
            newStatus[section] = 'active';
            break;
          }
        }
        
        return newStatus;
      });
      setEditingSection(null);
    }
  }, [editingSection]);

  // Navigation helpers
  const handleNext = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
      const nextSection = SECTION_ORDER[currentIndex + 1];
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
        [nextSection]: 'active',
      }));
    } else {
      // Last section
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
      }));
    }
  }, []);

  // Tag management
  const addTag = useCallback(() => {
    setTags((prev) => [
      ...prev,
      { id: `tag-${Date.now()}`, key: '', value: '' },
    ]);
  }, []);

  const removeTag = useCallback((id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  const updateTag = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setTags((prev) =>
      prev.map((tag) =>
        tag.id === id ? { ...tag, [field]: value } : tag
      )
    );
  }, []);

  // Validate bucket policy JSON
  const validatePolicy = useCallback((policy: string) => {
    try {
      JSON.parse(policy);
      setPolicyValid(true);
      setPolicyError(null);
      return true;
    } catch {
      setPolicyValid(false);
      setPolicyError('Invalid JSON format');
      return false;
    }
  }, []);

  // Handle bucket policy change
  const handlePolicyChange = useCallback((value: string) => {
    setBucketPolicy(value);
    validatePolicy(value);
  }, [validatePolicy]);

  // Clear policy
  const handleClearPolicy = useCallback(() => {
    setBucketPolicy('{}');
    setPolicyValid(true);
    setPolicyError(null);
  }, []);

  // Handle create bucket
  const handleCreate = useCallback(() => {
    console.log('Creating bucket:', {
      bucketName,
      region,
      owner,
      objectLocking,
      tags,
      placementTarget,
      bucketPolicy,
      grantee,
      permissions,
    });
    navigate('/storage/buckets');
  }, [bucketName, region, owner, objectLocking, tags, placementTarget, bucketPolicy, grantee, permissions, navigate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/storage/buckets');
  }, [navigate]);

  // Check if all sections are done
  const allSectionsDone = Object.values(sectionStatus).every((status) => status === 'done');

  // Get region display name
  const getRegionDisplay = () => {
    const regionMap: Record<string, string> = {
      default: 'Default',
    };
    return regionMap[region] || region;
  };

  // Get grantee display name
  const getGranteeDisplay = () => {
    const granteeMap: Record<string, string> = {
      owner: 'Owner',
      everyone: 'Everyone',
      authenticated: 'Authenticated User',
    };
    return granteeMap[grantee] || grantee;
  };

  // Get permissions display name
  const getPermissionsDisplay = () => {
    const permissionsMap: Record<string, string> = {
      'full-control': 'Full control',
      read: 'Read',
      'read-write': 'Read and write',
    };
    return permissionsMap[permissions] || permissions;
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main content area */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: sidebarOpen ? '200px' : '0px' }}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Storage', href: '/storage' },
                  { label: 'Buckets', href: '/storage/buckets' },
                  { label: 'Create Bucket' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Bucket
                </h1>
              </div>

              {/* Content Area */}
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
                      bucketName={bucketName}
                      onBucketNameChange={setBucketName}
                      bucketNameError={bucketNameError}
                      onBucketNameErrorChange={setBucketNameError}
                      region={region}
                      onRegionChange={setRegion}
                      owner={owner}
                      onOwnerChange={setOwner}
                      ownerError={ownerError}
                      onOwnerErrorChange={setOwnerError}
                      onNext={() => handleNext('basic-info')}
                      isActive
                      isEditing={editingSection === 'basic-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['basic-info']} onEdit={() => handleEdit('basic-info')}>
                      <SectionCard.DataRow label="Bucket Name" value={bucketName || '-'} showDivider={false} />
                      <SectionCard.DataRow label="Region" value={getRegionDisplay()} />
                      <SectionCard.DataRow label="Owner" value={owner || '-'} />
                    </DoneSection>
                  )}

                  {/* Settings Section */}
                  {sectionStatus['settings'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['settings']} />
                  )}
                  {sectionStatus['settings'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['settings']} />
                  )}
                  {sectionStatus['settings'] === 'active' && (
                    <SettingsSection
                      objectLocking={objectLocking}
                      onObjectLockingChange={setObjectLocking}
                      lockingMode={lockingMode}
                      onLockingModeChange={setLockingMode}
                      retentionDays={retentionDays}
                      onRetentionDaysChange={setRetentionDays}
                      tags={tags}
                      onAddTag={addTag}
                      onRemoveTag={removeTag}
                      onUpdateTag={updateTag}
                      placementTarget={placementTarget}
                      onPlacementTargetChange={setPlacementTarget}
                      onNext={() => handleNext('settings')}
                      isActive
                      isEditing={editingSection === 'settings'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['settings'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['settings']} onEdit={() => handleEdit('settings')}>
                      <SectionCard.DataRow label="Object Locking" value={objectLocking === 'disabled' ? 'Disabled' : 'Enabled'} showDivider={false} />
                      {objectLocking === 'enabled' && (
                        <>
                          <SectionCard.DataRow label="Mode" value={lockingMode === 'compliance' ? 'COMPLIANCE / GOVERNANCE' : lockingMode === 'compliance-only' ? 'COMPLIANCE' : 'GOVERNANCE'} />
                          <SectionCard.DataRow label="Retention Days" value={retentionDays || '-'} />
                        </>
                      )}
                      <SectionCard.DataRow label="Tags" value={tags.length > 0 ? `${tags.length} tag(s)` : 'None'} />
                      <SectionCard.DataRow label="Placement target" value={placementTarget || '-'} />
                    </DoneSection>
                  )}

                  {/* Policy Section */}
                  {sectionStatus['policy'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['policy']} />
                  )}
                  {sectionStatus['policy'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['policy']} />
                  )}
                  {sectionStatus['policy'] === 'active' && (
                    <PolicySection
                      bucketPolicy={bucketPolicy}
                      onBucketPolicyChange={handlePolicyChange}
                      policyValid={policyValid}
                      policyError={policyError}
                      onClearPolicy={handleClearPolicy}
                      grantee={grantee}
                      onGranteeChange={(value) => {
                        setGrantee(value);
                        // Update permissions based on grantee
                        if (value === 'owner') {
                          setPermissions('full-control');
                        } else if (value === 'everyone') {
                          setPermissions('read');
                        } else if (value === 'authenticated') {
                          setPermissions('read');
                        }
                      }}
                      permissions={permissions}
                      onPermissionsChange={setPermissions}
                      onNext={() => {
                        if (validatePolicy(bucketPolicy)) {
                          handleNext('policy');
                        }
                      }}
                      isActive
                      isEditing={editingSection === 'policy'}
                      onEditCancel={handleEditCancel}
                      onEditDone={() => {
                        if (validatePolicy(bucketPolicy)) {
                          handleEditDone();
                        }
                      }}
                    />
                  )}
                  {sectionStatus['policy'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['policy']} onEdit={() => handleEdit('policy')}>
                      <SectionCard.DataRow label="Bucket policy" value={bucketPolicy === '{}' ? 'Empty' : 'Configured'} showDivider={false} />
                      <SectionCard.DataRow label="Grantee" value={getGranteeDisplay()} />
                      <SectionCard.DataRow label="Permissions" value={getPermissionsDisplay()} />
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
          </div>
        </div>
      </main>
    </div>
  );
}
