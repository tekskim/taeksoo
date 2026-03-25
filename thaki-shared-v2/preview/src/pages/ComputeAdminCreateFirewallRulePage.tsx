import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

const STEP_IDS = ['basic', 'rule'] as const;

export function ComputeAdminCreateFirewallRulePage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState('');
  const [sourceIp, setSourceIp] = useState('');
  const [sourcePort, setSourcePort] = useState('');
  const [destIp, setDestIp] = useState('');
  const [destPort, setDestPort] = useState('');
  const [action, setAction] = useState<'allow' | 'deny' | ''>('');

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    rule: 'default',
  });

  const nameError = submitted && !name.trim() ? 'Please enter a rule name.' : null;
  const protocolError = submitted && !protocol ? 'Please select a protocol.' : null;
  const actionError = submitted && !action ? 'Please select an action.' : null;

  const validateBasic = useCallback((): boolean => {
    setSubmitted(true);
    return !!name.trim();
  }, [name]);

  const validateRule = useCallback((): boolean => {
    setSubmitted(true);
    return !!protocol && !!action;
  }, [protocol, action]);

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
      title="Create firewall rule"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Rule configuration', status: stepStatuses.rule },
              ],
            },
          ]}
          onCancel={() => navigate('/compute-admin/firewall')}
          onAction={() => setConfirmOpen(true)}
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
            onComplete: validateBasic,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Name <span className="text-error">*</span>
                    </span>
                    <Input
                      placeholder="Rule name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!nameError}
                    />
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <Textarea
                      placeholder="Optional description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Name</span>
                  <span className="text-12 text-text">{name || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{description || '-'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'rule' as const,
            label: 'Rule configuration',
            onComplete: validateRule,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Protocol <span className="text-error">*</span>
                    </span>
                    <Dropdown.Select
                      value={protocol}
                      onChange={(v) => {
                        setProtocol(String(v));
                        setSubmitted(false);
                      }}
                      placeholder="Select protocol"
                    >
                      <Dropdown.Option value="tcp" label="TCP" />
                      <Dropdown.Option value="udp" label="UDP" />
                      <Dropdown.Option value="icmp" label="ICMP" />
                      <Dropdown.Option value="any" label="Any" />
                    </Dropdown.Select>
                    {protocolError && <span className="text-11 text-error">{protocolError}</span>}
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Source IP</span>
                    <Input
                      placeholder="e.g. 0.0.0.0/0 or 10.0.0.0/24"
                      value={sourceIp}
                      onChange={(e) => setSourceIp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Source port</span>
                    <Input
                      placeholder="e.g. 80 or 1024-65535"
                      value={sourcePort}
                      onChange={(e) => setSourcePort(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Destination IP</span>
                    <Input
                      placeholder="e.g. 192.168.1.10"
                      value={destIp}
                      onChange={(e) => setDestIp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Destination port</span>
                    <Input
                      placeholder="e.g. 443"
                      value={destPort}
                      onChange={(e) => setDestPort(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Action <span className="text-error">*</span>
                    </span>
                    <Dropdown.Select
                      value={action}
                      onChange={(v) => {
                        setAction(v as 'allow' | 'deny');
                        setSubmitted(false);
                      }}
                      placeholder="Allow or deny"
                    >
                      <Dropdown.Option value="allow" label="Allow" />
                      <Dropdown.Option value="deny" label="Deny" />
                    </Dropdown.Select>
                    {actionError && <span className="text-11 text-error">{actionError}</span>}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Protocol</span>
                  <span className="text-12 text-text">{protocol || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Source</span>
                  <span className="text-12 text-text">
                    {sourceIp || 'Any'}:{sourcePort || '*'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Destination</span>
                  <span className="text-12 text-text">
                    {destIp || 'Any'}:{destPort || '*'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Action</span>
                  <span className="text-12 text-text">{action || '-'}</span>
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
            navigate('/compute-admin/firewall');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create firewall rule',
            subtitle: 'This is UI-only. No actual rule will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
