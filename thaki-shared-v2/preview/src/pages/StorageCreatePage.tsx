import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { IconPlus, IconX } from '@tabler/icons-react';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

type Tag = { id: string; key: string; value: string };

const STEP_IDS = ['basic', 'settings', 'policy'] as const;

const REGION_LABELS: Record<string, string> = {
  default: 'Default',
  'us-east-1': 'us-east-1',
};

const OWNER_LABELS: Record<string, string> = {
  admin: 'admin',
  'backup-user': 'backup-user',
  'app-service': 'app-service',
};

const ACL_GRANTEE_LABELS: Record<string, string> = {
  owner: 'Owner',
  everyone: 'Everyone',
  authenticated: 'Authenticated users',
};

const ACL_PERMISSION_LABELS: Record<string, string> = {
  'full-control': 'Full control',
  read: 'Read',
  write: 'Write',
  'read-acp': 'Read ACP',
  'write-acp': 'Write ACP',
};

export function StorageCreatePage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  // Basic information
  const [bucketName, setBucketName] = useState('');
  const [region, setRegion] = useState('default');
  const [owner, setOwner] = useState('');

  // Settings
  const [objectLocking, setObjectLocking] = useState('disabled');
  const [versioning, setVersioning] = useState('suspended');
  const [mfaDelete, setMfaDelete] = useState('disabled');
  const [tags, setTags] = useState<Tag[]>([]);
  const [placementTarget, setPlacementTarget] = useState('default-placement');

  // Policy
  const [bucketPolicy, setBucketPolicy] = useState('');
  const [policyValid, setPolicyValid] = useState<boolean | null>(null);
  const [aclGrantee, setAclGrantee] = useState('owner');
  const [aclPermission, setAclPermission] = useState('full-control');

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    settings: 'default',
    policy: 'default',
  });

  const addTag = () => {
    setTags((prev) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTag = (id: string, field: 'key' | 'value', val: string) => {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  };

  const validatePolicy = () => {
    if (!bucketPolicy.trim()) {
      setPolicyValid(null);
      return;
    }
    try {
      JSON.parse(bucketPolicy);
      setPolicyValid(true);
    } catch {
      setPolicyValid(false);
    }
  };

  const nameError = submitted && !bucketName.trim() ? 'Bucket name is required.' : null;
  const ownerError = submitted && !owner ? 'Please select an owner.' : null;
  const canSubmit = !!bucketName.trim() && !!owner;

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return !!bucketName.trim() && !!owner;
  }, [bucketName, owner]);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    []
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      for (const id of STEP_IDS) next[id] = 'success';
      return next;
    });
  }, []);

  return (
    <CreateLayout
      title="Create Bucket"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Settings', status: stepStatuses.settings },
                { label: 'Policy', status: stepStatuses.policy },
              ],
            },
          ]}
          onCancel={() => navigate('/storage/buckets')}
          onAction={() => {
            setSubmitted(true);
            if (!canSubmit) return;
            setConfirmOpen(true);
          }}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="basic"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'basic' as const,
            label: 'Basic information',
            onComplete: validateBasicInfo,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Bucket name <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        The name should start with a lowercase letter or number, and be a string of
                        3 to 63 characters. Characters can only contain lowercase letters, numbers,
                        and hyphens.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. my-bucket"
                      value={bucketName}
                      onChange={(e) => setBucketName(e.target.value)}
                      error={!!nameError}
                    />
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Region</span>
                    </div>
                    <Dropdown.Select value={region} onChange={(v) => setRegion(String(v))}>
                      <Dropdown.Option value="default" label="Default" />
                      <Dropdown.Option value="us-east-1" label="us-east-1" />
                    </Dropdown.Select>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Owner <span className="text-error">*</span>
                      </span>
                    </div>
                    <Dropdown.Select
                      placeholder="Select owner"
                      value={owner}
                      onChange={(v) => setOwner(String(v))}
                    >
                      <Dropdown.Option value="admin" label="admin" />
                      <Dropdown.Option value="backup-user" label="backup-user" />
                      <Dropdown.Option value="app-service" label="app-service" />
                    </Dropdown.Select>
                    {ownerError && <span className="text-11 text-error">{ownerError}</span>}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Bucket name</span>
                  <span className="text-12 text-text">{bucketName}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Region</span>
                  <span className="text-12 text-text">{REGION_LABELS[region] ?? region}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Owner</span>
                  <span className="text-12 text-text">
                    {owner ? (OWNER_LABELS[owner] ?? owner) : '-'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'settings' as const,
            label: 'Settings',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Object locking</span>
                      <span className="text-12 text-text-muted">
                        Store objects using a write-once-read-many (WORM) model to prevent objects
                        from being deleted or overwritten for a fixed amount of time or
                        indefinitely. Object Locking works only in versioned buckets.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="objectLocking"
                        value="disabled"
                        label="Disabled"
                        checked={objectLocking === 'disabled'}
                        onChange={() => setObjectLocking('disabled')}
                      />
                      <RadioButton
                        name="objectLocking"
                        value="enabled"
                        label="Enabled"
                        checked={objectLocking === 'enabled'}
                        onChange={() => setObjectLocking('enabled')}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Versioning</span>
                      <span className="text-12 text-text-muted">
                        Enables versioning for the objects in the bucket.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="versioning"
                        value="suspended"
                        label="Suspended"
                        checked={versioning === 'suspended'}
                        onChange={() => setVersioning('suspended')}
                      />
                      <RadioButton
                        name="versioning"
                        value="enabled"
                        label="Enabled"
                        checked={versioning === 'enabled'}
                        onChange={() => setVersioning('enabled')}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">MFA Delete</span>
                      <span className="text-12 text-text-muted">
                        Enables MFA (multi-factor authentication) Delete, which requires additional
                        authentication for changing the bucket versioning state.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="mfaDelete"
                        value="disabled"
                        label="Disabled"
                        checked={mfaDelete === 'disabled'}
                        onChange={() => setMfaDelete('disabled')}
                      />
                      <RadioButton
                        name="mfaDelete"
                        value="enabled"
                        label="Enabled"
                        checked={mfaDelete === 'enabled'}
                        onChange={() => setMfaDelete('enabled')}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Tags</span>
                      <span className="text-12 text-text-muted">
                        Key-value pairs for organization
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center"
                        >
                          <Input
                            placeholder="Key"
                            value={tag.key}
                            onChange={(e) => updateTag(tag.id, 'key', e.target.value)}
                          />
                          <Input
                            placeholder="Value"
                            value={tag.value}
                            onChange={(e) => updateTag(tag.id, 'value', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(tag.id)}
                            className="flex items-center justify-center w-5 h-5 rounded bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none text-text-muted hover:text-text"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ))}
                      <Button appearance="outline" variant="secondary" size="sm" onClick={addTag}>
                        <IconPlus size={12} /> Add Tag
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Placement target</span>
                      <span className="text-12 text-text-muted">
                        When creating a bucket, a placement target can be provided as part of the
                        LocationConstraint to override the default placement targets from the user
                        and zonegroup.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={placementTarget}
                      onChange={(v) => setPlacementTarget(String(v))}
                    >
                      <Dropdown.Option value="default-placement" label="default-placement" />
                      <Dropdown.Option value="archive-placement" label="archive-placement" />
                    </Dropdown.Select>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Object locking</span>
                  <span className="text-12 text-text">
                    {objectLocking === 'enabled' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Versioning</span>
                  <span className="text-12 text-text">
                    {versioning === 'enabled' ? 'Enabled' : 'Suspended'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">MFA Delete</span>
                  <span className="text-12 text-text">
                    {mfaDelete === 'enabled' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Tags</span>
                  <span className="text-12 text-text">
                    {tags.length === 0 ? '-' : `${tags.length} tag(s)`}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Placement target</span>
                  <span className="text-12 text-text">{placementTarget}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'policy' as const,
            label: 'Policy',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Bucket policy</span>
                      <span className="text-12 text-text-muted">JSON format</span>
                    </div>
                    <Textarea
                      placeholder='{"Version":"2012-10-17","Statement":[...]}'
                      value={bucketPolicy}
                      onChange={(e) => {
                        setBucketPolicy(e.target.value);
                        setPolicyValid(null);
                      }}
                      onBlur={validatePolicy}
                      rows={6}
                    />
                    {policyValid === true && (
                      <span className="text-11 text-state-success">Valid JSON</span>
                    )}
                    {policyValid === false && (
                      <span className="text-11 text-error">Invalid JSON format</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">ACL — Grantee</span>
                    </div>
                    <Dropdown.Select value={aclGrantee} onChange={(v) => setAclGrantee(String(v))}>
                      <Dropdown.Option value="owner" label="Owner" />
                      <Dropdown.Option value="everyone" label="Everyone" />
                      <Dropdown.Option value="authenticated" label="Authenticated users" />
                    </Dropdown.Select>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">ACL — Permission</span>
                    </div>
                    <Dropdown.Select
                      value={aclPermission}
                      onChange={(v) => setAclPermission(String(v))}
                    >
                      <Dropdown.Option value="full-control" label="Full control" />
                      <Dropdown.Option value="read" label="Read" />
                      <Dropdown.Option value="write" label="Write" />
                      <Dropdown.Option value="read-acp" label="Read ACP" />
                      <Dropdown.Option value="write-acp" label="Write ACP" />
                    </Dropdown.Select>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Bucket policy</span>
                  <span className="text-12 text-text">
                    {!bucketPolicy.trim()
                      ? '-'
                      : policyValid === false
                        ? 'Invalid JSON'
                        : 'Configured'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">ACL grantee</span>
                  <span className="text-12 text-text">
                    {ACL_GRANTEE_LABELS[aclGrantee] ?? aclGrantee}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">ACL permission</span>
                  <span className="text-12 text-text">
                    {ACL_PERMISSION_LABELS[aclPermission] ?? aclPermission}
                  </span>
                </div>
              </div>
            ),
          },
        ]}
      </Stepper>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/storage/buckets');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create Bucket',
            subtitle: 'This is UI-only. No actual bucket will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default StorageCreatePage;
