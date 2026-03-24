import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Checkbox } from '@shared/components/Checkbox';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Fieldset } from '@shared/components/Fieldset';
import Layout from '@shared/components/Layout';
import { IconPlus, IconX, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

interface Permission {
  id: string;
  application: string;
  partition: string;
  resource: string;
  resourceId: string;
  actions: { read: boolean; list: boolean; write: boolean; delete: boolean; admin: boolean };
  mfaRequired: boolean;
}

const createEmptyPermission = (): Permission => ({
  id: `perm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  application: '',
  partition: '',
  resource: '',
  resourceId: '',
  actions: { read: false, list: false, write: false, delete: false, admin: false },
  mfaRequired: false,
});

const APPLICATION_OPTIONS = ['*all', 'compute', 'container', 'storage', 'network', 'iam'];
const PARTITION_OPTIONS = ['*all', 'partition-a', 'partition-b', 'partition-c'];
const RESOURCE_OPTIONS = [
  '*all',
  'instance',
  'volume',
  'image',
  'network',
  'security-group',
  'key-pair',
];
const RESOURCE_ID_OPTIONS = ['*all'];

const ACTION_CATEGORIES = [
  { key: 'read' as const, label: 'Read' },
  { key: 'list' as const, label: 'List' },
  { key: 'write' as const, label: 'Write' },
  { key: 'delete' as const, label: 'Delete' },
  { key: 'admin' as const, label: 'Admin' },
];

const MAX_PERMISSIONS = 50;

export function IAMCreatePolicyPage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([createEmptyPermission()]);
  const [conditionsExpanded, setConditionsExpanded] = useState(false);

  const nameError = submitted && !policyName.trim() ? 'Policy name is required.' : null;
  const permissionError =
    submitted && permissions.length === 0 ? 'At least one permission is required.' : null;

  const canSubmit = !!policyName.trim() && permissions.length > 0;
  const basicInfoFilled = !!policyName.trim();

  const addPermission = () => {
    setPermissions((prev) => [...prev, createEmptyPermission()]);
  };

  const removePermission = (id: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePermission = (id: string, updates: Partial<Permission>) => {
    setPermissions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const toggleAction = (permId: string, action: keyof Permission['actions']) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === permId ? { ...p, actions: { ...p.actions, [action]: !p.actions[action] } } : p
      )
    );
  };

  const toggleAllActions = (permId: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id !== permId) return p;
        const allSelected = Object.values(p.actions).every((v) => v);
        const newVal = !allSelected;
        return {
          ...p,
          actions: { read: newVal, list: newVal, write: newVal, delete: newVal, admin: newVal },
        };
      })
    );
  };

  const toggleMfa = (checked: boolean) => {
    setPermissions((prev) => prev.map((p) => ({ ...p, mfaRequired: checked })));
  };

  return (
    <CreateLayout
      title="Create policy"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: basicInfoFilled ? 'success' : undefined },
                {
                  label: 'Policy editor',
                  status: permissions.length > 0 ? 'processing' : undefined,
                },
              ],
            },
          ]}
          quotaTitle="Quota"
          quotas={[{ label: 'Permissions', used: permissions.length, limit: MAX_PERMISSIONS }]}
          onCancel={() => navigate('/iam/policies')}
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
                Policy name <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">2-128 characters</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. ComputeAdminAccess"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                error={!!nameError}
              />
              {nameError && <span className="text-11 text-error mt-1 block">{nameError}</span>}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Description</div>
              <div className="mt-1 text-11 text-text-muted">Optional policy description</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. Full access to compute resources"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset
          legend="Policy editor"
          description="Define permissions by specifying targets and actions."
          variant="bordered"
          active
        >
          <div className="flex flex-col gap-4">
            {permissions.map((perm, idx) => (
              <div key={perm.id} className="border border-border rounded-md bg-surface-subtle">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                  <span className="text-12 font-medium text-text">Permission {idx + 1}</span>
                  {permissions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePermission(perm.id)}
                      className="flex items-center justify-center w-5 h-5 rounded bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none text-text-muted hover:text-text"
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>

                <div className="px-4 py-4 flex flex-col gap-4">
                  <div>
                    <div className="text-11 font-medium text-text mb-2">Target</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-11 text-text-muted">Application</span>
                        <Dropdown.Select
                          placeholder="Select"
                          value={perm.application}
                          onChange={(v) => updatePermission(perm.id, { application: String(v) })}
                        >
                          {APPLICATION_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt} value={opt} label={opt} />
                          ))}
                        </Dropdown.Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-11 text-text-muted">Partition</span>
                        <Dropdown.Select
                          placeholder="Select"
                          value={perm.partition}
                          onChange={(v) => updatePermission(perm.id, { partition: String(v) })}
                        >
                          {PARTITION_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt} value={opt} label={opt} />
                          ))}
                        </Dropdown.Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-11 text-text-muted">Resource</span>
                        <Dropdown.Select
                          placeholder="Select"
                          value={perm.resource}
                          onChange={(v) => updatePermission(perm.id, { resource: String(v) })}
                        >
                          {RESOURCE_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt} value={opt} label={opt} />
                          ))}
                        </Dropdown.Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-11 text-text-muted">Resource ID</span>
                        <Dropdown.Select
                          placeholder="Select"
                          value={perm.resourceId}
                          onChange={(v) => updatePermission(perm.id, { resourceId: String(v) })}
                        >
                          {RESOURCE_ID_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt} value={opt} label={opt} />
                          ))}
                        </Dropdown.Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-11 font-medium text-text">Actions</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-surface rounded-md border border-border-subtle">
                      <Checkbox
                        checked={Object.values(perm.actions).every((v) => v)}
                        onChange={() => toggleAllActions(perm.id)}
                        label="All actions"
                      />
                      <div className="h-4 w-px bg-border-subtle" />
                      {ACTION_CATEGORIES.map((cat) => (
                        <Checkbox
                          key={cat.key}
                          checked={perm.actions[cat.key]}
                          onChange={() => toggleAction(perm.id, cat.key)}
                          label={cat.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {permissionError && <span className="text-11 text-error">{permissionError}</span>}

            <Button appearance="outline" variant="secondary" size="sm" onClick={addPermission}>
              <IconPlus size={12} /> Add Permission
            </Button>
          </div>

          <div className="mt-4 border-t border-border-subtle pt-4">
            <button
              type="button"
              onClick={() => setConditionsExpanded(!conditionsExpanded)}
              className="flex items-center gap-1 text-12 font-medium text-text bg-transparent border-none cursor-pointer p-0"
            >
              {conditionsExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              Conditions
            </button>
            {conditionsExpanded && (
              <div className="mt-3 p-3 bg-surface-subtle rounded-md">
                <Checkbox
                  checked={permissions[0]?.mfaRequired ?? false}
                  onChange={(checked) => toggleMfa(checked)}
                  label="Only applies if the user has completed MFA"
                />
              </div>
            )}
          </div>
        </Fieldset>
      </Layout.VStack>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/iam/policies');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create policy',
            subtitle: 'This is UI-only. No actual policy will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default IAMCreatePolicyPage;
