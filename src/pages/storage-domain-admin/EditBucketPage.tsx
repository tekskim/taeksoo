import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Select,
  SectionCard,
  Toggle,
  Textarea,
  PageShell,
  PageHeader,
  InfoBox,
  WizardSectionStatusIcon,
} from '@/design-system';
import { StorageDomainAdminSidebar as StorageSidebar } from '@/components/StorageDomainAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconCirclePlus, IconX } from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'settings' | 'policy';

interface TagItem {
  id: string;
  key: string;
  value: string;
}

const SECTION_ORDER: SectionStep[] = ['settings', 'policy'];

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  settings: 'Settings',
  policy: 'Policy',
};

function DoneSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
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

function BasicInformationForm({
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
  onDone,
  onCancel,
}: {
  bucketName: string;
  onBucketNameChange: (v: string) => void;
  bucketNameError: string | null;
  onBucketNameErrorChange: (e: string | null) => void;
  region: string;
  onRegionChange: (v: string) => void;
  owner: string;
  onOwnerChange: (v: string) => void;
  ownerError: string | null;
  onOwnerErrorChange: (e: string | null) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
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
    onDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic information"
        showDivider={false}
        actions={
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleDone}>
              Done
            </Button>
          </HStack>
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField required error={!!bucketNameError}>
              <FormField.Label>Bucket Name</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter bucket name"
                  value={bucketName}
                  onChange={(e) => {
                    onBucketNameChange(e.target.value);
                    onBucketNameErrorChange(null);
                  }}
                  fullWidth
                  error={!!bucketNameError}
                />
              </FormField.Control>
              <FormField.ErrorMessage>{bucketNameError}</FormField.ErrorMessage>
            </FormField>
          </div>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField required>
              <FormField.Label>Region</FormField.Label>
              <FormField.Control>
                <Select
                  options={[{ value: 'default', label: 'Default' }]}
                  value={region}
                  onChange={onRegionChange}
                  fullWidth
                />
              </FormField.Control>
            </FormField>
          </div>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField required error={!!ownerError}>
              <FormField.Label>Owner</FormField.Label>
              <FormField.Control>
                <Select
                  options={[
                    { value: '', label: 'Select Owner' },
                    { value: 'user-1', label: 'admin@thaki.cloud' },
                    { value: 'user-2', label: 'user@thaki.cloud' },
                  ]}
                  value={owner}
                  onChange={(v) => {
                    onOwnerChange(v);
                    onOwnerErrorChange(null);
                  }}
                  fullWidth
                  error={!!ownerError}
                />
              </FormField.Control>
              <FormField.ErrorMessage>{ownerError}</FormField.ErrorMessage>
            </FormField>
          </div>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function SettingsForm({
  objectLocking,
  onObjectLockingChange,
  mfaDelete,
  onMfaDeleteChange,
  mfaSerialNumber,
  onMfaSerialNumberChange,
  mfaTokenPin,
  onMfaTokenPinChange,
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
  onDone,
  onCancel,
}: {
  objectLocking: 'disabled' | 'enabled';
  onObjectLockingChange: (v: 'disabled' | 'enabled') => void;
  mfaDelete: 'disabled' | 'enabled';
  onMfaDeleteChange: (v: 'disabled' | 'enabled') => void;
  mfaSerialNumber: string;
  onMfaSerialNumberChange: (v: string) => void;
  mfaTokenPin: string;
  onMfaTokenPinChange: (v: string) => void;
  lockingMode: string;
  onLockingModeChange: (v: string) => void;
  retentionDays: string;
  onRetentionDaysChange: (v: string) => void;
  tags: TagItem[];
  onAddTag: () => void;
  onRemoveTag: (id: string) => void;
  onUpdateTag: (id: string, field: 'key' | 'value', value: string) => void;
  placementTarget: string;
  onPlacementTargetChange: (v: string) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Settings"
        showDivider={false}
        actions={
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onDone}>
              Done
            </Button>
          </HStack>
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField spacing="loose">
              <FormField.Label>Versioning</FormField.Label>
              <FormField.Description>
                Enables versioning for the objects in the bucket.
              </FormField.Description>
              <FormField.Control>
                <Toggle
                  checked={objectLocking === 'enabled'}
                  onChange={(checked) => onObjectLockingChange(checked ? 'enabled' : 'disabled')}
                  label={objectLocking === 'enabled' ? 'Enabled' : 'Suspended'}
                />
              </FormField.Control>
            </FormField>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField spacing="loose">
              <FormField.Label>MFA delete</FormField.Label>
              <FormField.Description>
                Enables MFA (multi-factor authentication) Delete, which requires additional
                authentication for changing the bucket versioning state.
              </FormField.Description>
              <FormField.Control>
                <Toggle
                  checked={mfaDelete === 'enabled'}
                  onChange={(checked) => onMfaDeleteChange(checked ? 'enabled' : 'disabled')}
                  label={mfaDelete === 'enabled' ? 'Enabled' : 'Disabled'}
                />
              </FormField.Control>
            </FormField>
          </div>

          {mfaDelete === 'enabled' && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <div className="py-6">
                <FormField label="MFA serial number" required>
                  <Input
                    placeholder="Enter MFA serial number"
                    value={mfaSerialNumber}
                    onChange={(e) => onMfaSerialNumberChange(e.target.value)}
                    fullWidth
                  />
                </FormField>
              </div>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <div className="py-6">
                <FormField label="MFA token PIN" required>
                  <Input
                    placeholder="Enter MFA token PIN"
                    value={mfaTokenPin}
                    onChange={(e) => onMfaTokenPinChange(e.target.value)}
                    fullWidth
                  />
                </FormField>
              </div>
            </>
          )}

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <VStack gap={2}>
              <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                <VStack gap={1.5}>
                  {tags.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Key
                      </span>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Value
                      </span>
                      <div className="w-5" />
                    </div>
                  )}
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="tag key"
                        value={tag.key}
                        onChange={(e) => onUpdateTag(tag.id, 'key', e.target.value)}
                        fullWidth
                      />
                      <Input
                        placeholder="tag value"
                        value={tag.value}
                        onChange={(e) => onUpdateTag(tag.id, 'value', e.target.value)}
                        fullWidth
                      />
                      <button
                        onClick={() => onRemoveTag(tag.id)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      >
                        <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  ))}
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                      onClick={onAddTag}
                    >
                      Add Tags
                    </Button>
                  </div>
                </VStack>
              </div>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField>
              <FormField.Label>Placement target</FormField.Label>
              <FormField.Description>
                When creating a bucket, a placement target can be provided as part of the
                LocationConstraint to override the default placement targets from the user and
                zonegroup.
              </FormField.Description>
              <FormField.Control>
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
              </FormField.Control>
            </FormField>
          </div>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function PolicyForm({
  bucketPolicy,
  onBucketPolicyChange,
  policyValid,
  policyError,
  onClearPolicy,
  grantee,
  onGranteeChange,
  permissions,
  onPermissionsChange,
  onDone,
  onCancel,
}: {
  bucketPolicy: string;
  onBucketPolicyChange: (v: string) => void;
  policyValid: boolean;
  policyError: string | null;
  onClearPolicy: () => void;
  grantee: string;
  onGranteeChange: (v: string) => void;
  permissions: string;
  onPermissionsChange: (v: string) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Policy"
        showDivider={false}
        actions={
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onDone}>
              Done
            </Button>
          </HStack>
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <FormField error={!policyValid}>
              <FormField.Label>
                <HStack justify="between" align="center" className="w-full">
                  <span>Bucket policy</span>
                  <Button variant="secondary" size="sm" onClick={onClearPolicy}>
                    Clear
                  </Button>
                </HStack>
              </FormField.Label>
              <FormField.Control>
                <Textarea
                  value={bucketPolicy}
                  onChange={(e) => onBucketPolicyChange(e.target.value)}
                  rows={3}
                  fullWidth
                  style={{
                    borderColor: policyValid
                      ? 'var(--color-state-success)'
                      : 'var(--color-state-danger)',
                  }}
                />
              </FormField.Control>
              {policyValid ? (
                <FormField.HelperText>
                  <span className="text-[var(--color-state-success)]">valid json text.</span>
                </FormField.HelperText>
              ) : (
                <FormField.ErrorMessage>{policyError}</FormField.ErrorMessage>
              )}
            </FormField>
          </div>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            <VStack gap={3}>
              <VStack gap={2}>
                <span className="text-label-lg text-[var(--color-text-default)]">ACL</span>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  When creating a bucket, a placement target can be provided as part of the
                  LocationConstraint to override the default placement targets from the user and
                  zonegroup.
                </span>
              </VStack>
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                  <VStack gap={2}>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Grantee
                    </span>
                    <Select
                      options={[
                        { value: 'owner', label: 'Owner' },
                        { value: 'everyone', label: 'Everyone' },
                        { value: 'authenticated', label: 'Authenticated User' },
                      ]}
                      value={grantee}
                      onChange={onGranteeChange}
                      fullWidth
                    />
                  </VStack>
                  <VStack gap={2}>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Permissions
                    </span>
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
                      fullWidth
                    />
                  </VStack>
                </div>
              </div>
            </VStack>
          </div>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

export default function EditBucketPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Pre-filled mock data
  const [bucketName, setBucketName] = useState(id || 'my-bucket');
  const [bucketNameError, setBucketNameError] = useState<string | null>(null);
  const [region, setRegion] = useState('default');
  const [owner, setOwner] = useState('user-1');
  const [ownerError, setOwnerError] = useState<string | null>(null);

  const [objectLocking, setObjectLocking] = useState<'disabled' | 'enabled'>('disabled');
  const [mfaDelete, setMfaDelete] = useState<'disabled' | 'enabled'>('disabled');
  const [mfaSerialNumber, setMfaSerialNumber] = useState('');
  const [mfaTokenPin, setMfaTokenPin] = useState('');
  const [lockingMode, setLockingMode] = useState('compliance');
  const [retentionDays, setRetentionDays] = useState('');
  const [tags, setTags] = useState<TagItem[]>([]);
  const [placementTarget, setPlacementTarget] = useState('');

  const [bucketPolicy, setBucketPolicy] = useState('{}');
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [policyValid, setPolicyValid] = useState(true);
  const [grantee, setGrantee] = useState('owner');
  const [permissions, setPermissions] = useState('full-control');

  const addTag = useCallback(() => {
    setTags((prev) => [...prev, { id: `tag-${Date.now()}`, key: '', value: '' }]);
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }, []);

  const updateTag = useCallback((tagId: string, field: 'key' | 'value', value: string) => {
    setTags((prev) => prev.map((tag) => (tag.id === tagId ? { ...tag, [field]: value } : tag)));
  }, []);

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

  const handlePolicyChange = useCallback(
    (value: string) => {
      setBucketPolicy(value);
      validatePolicy(value);
    },
    [validatePolicy]
  );

  const handleSave = useCallback(() => {
    console.log('Saving bucket:', {
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
    navigate('/storage-domain-admin/buckets');
  }, [
    bucketName,
    region,
    owner,
    objectLocking,
    tags,
    placementTarget,
    bucketPolicy,
    grantee,
    permissions,
    navigate,
  ]);

  const getRegionDisplay = () => ({ default: 'Default' })[region] || region;
  const getGranteeDisplay = () =>
    ({ owner: 'Owner', everyone: 'Everyone', authenticated: 'Authenticated User' })[grantee] ||
    grantee;
  const getPermissionsDisplay = () =>
    ({ 'full-control': 'Full control', read: 'Read', 'read-write': 'Read and write' })[
      permissions
    ] || permissions;

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Buckets', href: '/storage-domain-admin/buckets' },
                { label: `Edit ${bucketName}` },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3} className="min-w-[1176px]">
        <PageHeader title="Edit bucket" />

        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
          <VStack gap={4} className="flex-1">
            <InfoBox label="Bucket name" value={bucketName} />

            {/* Settings */}
            {editingSection === 'settings' ? (
              <SettingsForm
                objectLocking={objectLocking}
                onObjectLockingChange={setObjectLocking}
                mfaDelete={mfaDelete}
                onMfaDeleteChange={setMfaDelete}
                mfaSerialNumber={mfaSerialNumber}
                onMfaSerialNumberChange={setMfaSerialNumber}
                mfaTokenPin={mfaTokenPin}
                onMfaTokenPinChange={setMfaTokenPin}
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
                onDone={() => setEditingSection(null)}
                onCancel={() => setEditingSection(null)}
              />
            ) : (
              <DoneSection
                title={SECTION_LABELS.settings}
                onEdit={() => setEditingSection('settings')}
              >
                <SectionCard.DataRow
                  label="Versioning"
                  value={objectLocking === 'disabled' ? 'Suspended' : 'Enabled'}
                  showDivider={false}
                />
                <SectionCard.DataRow
                  label="MFA delete"
                  value={mfaDelete === 'disabled' ? 'Disabled' : 'Enabled'}
                />
                <SectionCard.DataRow
                  label="Tags"
                  value={tags.length > 0 ? `${tags.length} tag(s)` : 'None'}
                />
                <SectionCard.DataRow label="Placement target" value={placementTarget || '-'} />
              </DoneSection>
            )}

            {/* Policy */}
            {editingSection === 'policy' ? (
              <PolicyForm
                bucketPolicy={bucketPolicy}
                onBucketPolicyChange={handlePolicyChange}
                policyValid={policyValid}
                policyError={policyError}
                onClearPolicy={() => {
                  setBucketPolicy('{}');
                  setPolicyValid(true);
                  setPolicyError(null);
                }}
                grantee={grantee}
                onGranteeChange={(v) => {
                  setGrantee(v);
                  if (v === 'owner') setPermissions('full-control');
                  else setPermissions('read');
                }}
                permissions={permissions}
                onPermissionsChange={setPermissions}
                onDone={() => {
                  if (validatePolicy(bucketPolicy)) setEditingSection(null);
                }}
                onCancel={() => setEditingSection(null)}
              />
            ) : (
              <DoneSection title={SECTION_LABELS.policy} onEdit={() => setEditingSection('policy')}>
                <SectionCard.DataRow
                  label="Bucket policy"
                  value={bucketPolicy === '{}' ? 'Empty' : 'Configured'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="Grantee" value={getGranteeDisplay()} />
                <SectionCard.DataRow label="Permissions" value={getPermissionsDisplay()} />
              </DoneSection>
            )}
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-4">
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={3}>
                  <h5 className="text-heading-h5 text-[var(--color-text-default)]">Summary</h5>
                  <div className="flex flex-col">
                    {SECTION_ORDER.map((sectionKey) => (
                      <div key={sectionKey} className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          {SECTION_LABELS[sectionKey]}
                        </span>
                        {editingSection === sectionKey ? (
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Editing...
                          </span>
                        ) : (
                          <WizardSectionStatusIcon status="done" />
                        )}
                      </div>
                    ))}
                  </div>
                </VStack>
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/storage-domain-admin/buckets')}
                  className="flex-[0.3]"
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSave} className="flex-[0.7]">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </HStack>
      </VStack>
    </PageShell>
  );
}
