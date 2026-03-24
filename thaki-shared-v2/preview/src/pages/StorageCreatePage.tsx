import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Fieldset } from '@shared/components/Fieldset';
import Layout from '@shared/components/Layout';
import { IconPlus, IconX } from '@tabler/icons-react';

type Tag = { id: string; key: string; value: string };

export function StorageCreatePage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
  const basicInfoFilled = !!bucketName.trim() && !!owner;

  return (
    <CreateLayout
      title="Create Bucket"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: basicInfoFilled ? 'success' : undefined },
                {
                  label: 'Settings',
                  status:
                    tags.length > 0 || objectLocking === 'enabled' || versioning === 'enabled'
                      ? 'success'
                      : undefined,
                },
                { label: 'Policy', status: bucketPolicy.trim() ? 'success' : undefined },
              ],
            },
          ]}
          onCancel={() => navigate('/storage/buckets')}
          onAction={() => {
            setSubmitted(true);
            if (!canSubmit) return;
            setConfirmOpen(true);
          }}
          actionEnabled
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Layout.VStack gap="md">
        <Fieldset legend="Basic information" variant="bordered" active>
          <div className="grid grid-cols-12 gap-y-5 gap-x-6">
            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Bucket name <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">
                3-63 characters, lowercase letters, numbers, hyphens
              </div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. my-bucket"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                error={!!nameError}
              />
              {nameError && <span className="text-11 text-error mt-1 block">{nameError}</span>}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Region</div>
            </div>
            <div className="col-span-8">
              <Dropdown.Select value={region} onChange={(v) => setRegion(String(v))}>
                <Dropdown.Option value="default" label="Default" />
                <Dropdown.Option value="us-east-1" label="us-east-1" />
              </Dropdown.Select>
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Owner <span className="text-error">*</span>
              </div>
            </div>
            <div className="col-span-8">
              <Dropdown.Select
                placeholder="Select owner"
                value={owner}
                onChange={(v) => setOwner(String(v))}
              >
                <Dropdown.Option value="admin" label="admin" />
                <Dropdown.Option value="backup-user" label="backup-user" />
                <Dropdown.Option value="app-service" label="app-service" />
              </Dropdown.Select>
              {ownerError && <span className="text-11 text-error mt-1 block">{ownerError}</span>}
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Settings" variant="bordered" active>
          <div className="grid grid-cols-12 gap-y-5 gap-x-6">
            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Object locking</div>
              <div className="mt-1 text-11 text-text-muted">Once enabled, cannot be disabled</div>
            </div>
            <div className="col-span-8 flex items-center gap-4">
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

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Versioning</div>
            </div>
            <div className="col-span-8 flex items-center gap-4">
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

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">MFA Delete</div>
            </div>
            <div className="col-span-8 flex items-center gap-4">
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

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Tags</div>
              <div className="mt-1 text-11 text-text-muted">Key-value pairs for organization</div>
            </div>
            <div className="col-span-8">
              <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center">
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

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Placement target</div>
            </div>
            <div className="col-span-8">
              <Dropdown.Select
                value={placementTarget}
                onChange={(v) => setPlacementTarget(String(v))}
              >
                <Dropdown.Option value="default-placement" label="default-placement" />
                <Dropdown.Option value="archive-placement" label="archive-placement" />
              </Dropdown.Select>
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Policy" variant="bordered" active>
          <div className="grid grid-cols-12 gap-y-5 gap-x-6">
            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Bucket policy</div>
              <div className="mt-1 text-11 text-text-muted">JSON format</div>
            </div>
            <div className="col-span-8">
              <div className="flex flex-col gap-2">
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

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">ACL — Grantee</div>
            </div>
            <div className="col-span-8">
              <Dropdown.Select value={aclGrantee} onChange={(v) => setAclGrantee(String(v))}>
                <Dropdown.Option value="owner" label="Owner" />
                <Dropdown.Option value="everyone" label="Everyone" />
                <Dropdown.Option value="authenticated" label="Authenticated users" />
              </Dropdown.Select>
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">ACL — Permission</div>
            </div>
            <div className="col-span-8">
              <Dropdown.Select value={aclPermission} onChange={(v) => setAclPermission(String(v))}>
                <Dropdown.Option value="full-control" label="Full control" />
                <Dropdown.Option value="read" label="Read" />
                <Dropdown.Option value="write" label="Write" />
                <Dropdown.Option value="read-acp" label="Read ACP" />
                <Dropdown.Option value="write-acp" label="Write ACP" />
              </Dropdown.Select>
            </div>
          </div>
        </Fieldset>
      </Layout.VStack>

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
