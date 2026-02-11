import { useState } from 'react';
import { Drawer, Button, NumberInput, Disclosure } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TenantInfo {
  id: string;
  name: string;
}

export interface QuotaValues {
  // Compute
  vcpus: number;
  ram: number;
  gpu: number;
  instances: number;
  keyPairs: number;
  serverGroups: number;
  serverGroupMembers: number;
  metadataItems: number;
  // Volume
  volumes: number;
  volumeCapacity: number;
  volumeSnapshots: number;
  volumeBackups: number;
  volumeBackupCapacity: number;
  // Volume Advanced
  volumeTypeType: number;
  volumeTypeCapacity: number;
  volumeTypeSnapshots: number;
  // Network
  routers: number;
  networks: number;
  subnets: number;
  floatingIps: number;
  ports: number;
  securityGroups: number;
  securityGroupRules: number;
  firewalls: number;
  firewallPolicies: number;
  firewallRules: number;
}

export interface ModifyQuotasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantInfo;
  onSave?: (quotas: QuotaValues) => void;
}

/* ----------------------------------------
   Default Quotas
   ---------------------------------------- */

const defaultQuotas: QuotaValues = {
  vcpus: 20,
  ram: 50,
  gpu: 0,
  instances: 10,
  keyPairs: 100,
  serverGroups: 10,
  serverGroupMembers: 10,
  metadataItems: 128,
  volumes: 10,
  volumeCapacity: 1000,
  volumeSnapshots: 10,
  volumeBackups: 10,
  volumeBackupCapacity: 1000,
  volumeTypeType: -1,
  volumeTypeCapacity: -1,
  volumeTypeSnapshots: -1,
  routers: 10,
  networks: 100,
  subnets: 100,
  floatingIps: 50,
  ports: 500,
  securityGroups: 10,
  securityGroupRules: 100,
  firewalls: 10,
  firewallPolicies: 10,
  firewallRules: 100,
};

/* ----------------------------------------
   QuotaRow Component
   ---------------------------------------- */

function QuotaRow({
  label,
  value,
  onChange,
  min = -1,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
}) {
  return (
    <HStack className="w-full py-2" align="center" justify="between">
      <span className="text-body-md text-[var(--color-text-default)] flex-1">{label}</span>
      <NumberInput value={value} onChange={onChange} min={min} step={1} width="sm" />
    </HStack>
  );
}

/* ----------------------------------------
   ModifyQuotasDrawer Component
   ---------------------------------------- */

export function ModifyQuotasDrawer({ isOpen, onClose, tenant, onSave }: ModifyQuotasDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotas, setQuotas] = useState<QuotaValues>(defaultQuotas);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateQuota = <K extends keyof QuotaValues>(key: K, value: QuotaValues[K]) => {
    setQuotas((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(quotas);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuotas(defaultQuotas);
    setIsAdvancedOpen(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="w-[152px]">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Title */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Modify quotas</h2>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Modifies the resource usage limits allocated to the tenant.
          </p>
        </VStack>

        {/* Tenant Info */}
        <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
          <div className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Tenant</div>
          <div className="text-body-md text-[var(--color-text-default)]">{tenant.name}</div>
        </div>

        {/* Compute Section */}
        <VStack gap={0} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5 mb-2">
            Compute <span className="text-[var(--color-state-danger)]">*</span>
          </h3>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="vCPUs"
            value={quotas.vcpus}
            onChange={(v) => updateQuota('vcpus', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="RAM (GiB)"
            value={quotas.ram}
            onChange={(v) => updateQuota('ram', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="GPU(T4)"
            value={quotas.gpu}
            onChange={(v) => updateQuota('gpu', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Instances"
            value={quotas.instances}
            onChange={(v) => updateQuota('instances', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Key pairs"
            value={quotas.keyPairs}
            onChange={(v) => updateQuota('keyPairs', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Server groups"
            value={quotas.serverGroups}
            onChange={(v) => updateQuota('serverGroups', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Server group members"
            value={quotas.serverGroupMembers}
            onChange={(v) => updateQuota('serverGroupMembers', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Metadata items"
            value={quotas.metadataItems}
            onChange={(v) => updateQuota('metadataItems', v)}
            min={0}
          />
        </VStack>

        {/* Volume Section */}
        <VStack gap={0} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5 mb-2">
            Volume <span className="text-[var(--color-state-danger)]">*</span>
          </h3>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Volumes"
            value={quotas.volumes}
            onChange={(v) => updateQuota('volumes', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Volume capacity (GiB)"
            value={quotas.volumeCapacity}
            onChange={(v) => updateQuota('volumeCapacity', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Volume snapshots"
            value={quotas.volumeSnapshots}
            onChange={(v) => updateQuota('volumeSnapshots', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Volume backups"
            value={quotas.volumeBackups}
            onChange={(v) => updateQuota('volumeBackups', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Volume backup capacity (GiB)"
            value={quotas.volumeBackupCapacity}
            onChange={(v) => updateQuota('volumeBackupCapacity', v)}
            min={0}
          />

          {/* Advanced */}
          <div className="w-full mt-2">
            <Disclosure open={isAdvancedOpen} onChange={setIsAdvancedOpen}>
              <Disclosure.Trigger>Advanced</Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={0} className="w-full pt-2">
                  <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                  <QuotaRow
                    label="{volume_type_name} type"
                    value={quotas.volumeTypeType}
                    onChange={(v) => updateQuota('volumeTypeType', v)}
                  />
                  <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                  <QuotaRow
                    label="{volume_type_name} type capacity (GiB)"
                    value={quotas.volumeTypeCapacity}
                    onChange={(v) => updateQuota('volumeTypeCapacity', v)}
                  />
                  <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                  <QuotaRow
                    label="{volume_type_name} type snapshots"
                    value={quotas.volumeTypeSnapshots}
                    onChange={(v) => updateQuota('volumeTypeSnapshots', v)}
                  />
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>
        </VStack>

        {/* Network Section */}
        <VStack gap={0} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5 mb-2">
            Network <span className="text-[var(--color-state-danger)]">*</span>
          </h3>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Routers"
            value={quotas.routers}
            onChange={(v) => updateQuota('routers', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Networks"
            value={quotas.networks}
            onChange={(v) => updateQuota('networks', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Subnets"
            value={quotas.subnets}
            onChange={(v) => updateQuota('subnets', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Floating IPs"
            value={quotas.floatingIps}
            onChange={(v) => updateQuota('floatingIps', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Ports"
            value={quotas.ports}
            onChange={(v) => updateQuota('ports', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Security groups"
            value={quotas.securityGroups}
            onChange={(v) => updateQuota('securityGroups', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Security group rules"
            value={quotas.securityGroupRules}
            onChange={(v) => updateQuota('securityGroupRules', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Firewalls"
            value={quotas.firewalls}
            onChange={(v) => updateQuota('firewalls', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Firewall policies"
            value={quotas.firewallPolicies}
            onChange={(v) => updateQuota('firewallPolicies', v)}
            min={0}
          />
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <QuotaRow
            label="Firewall rules"
            value={quotas.firewallRules}
            onChange={(v) => updateQuota('firewallRules', v)}
            min={0}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ModifyQuotasDrawer;
