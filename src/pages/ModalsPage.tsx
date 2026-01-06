import { useState } from 'react';
import { useTabs } from '@/contexts/TabContext';
import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { TopBar, Breadcrumb } from '@/design-system';
import { Button, VStack, HStack, Badge, Modal } from '@/design-system';
import { IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Modal List Item Component
   ---------------------------------------- */

interface ModalListItemProps {
  title: string;
  description: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  onOpen: () => void;
}

function ModalListItem({ title, description, category, size, onOpen }: ModalListItemProps) {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group"
      onClick={onOpen}
    >
      <HStack gap={3} className="flex-1 items-center min-w-0">
        {size && (
          <Badge 
            variant={size === 'lg' ? 'yellow' : size === 'md' ? 'info' : 'gray'} 
            size="sm" 
            className="shrink-0 w-[32px] justify-center font-mono uppercase"
          >
            {size}
          </Badge>
        )}
        {category && (
          <Badge variant="purple" size="sm" className="shrink-0 w-[100px] justify-center">
            {category}
          </Badge>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] truncate">
            {title}
          </h3>
          <p className="text-[12px] text-[var(--color-text-subtle)] truncate mt-0.5">
            {description}
          </p>
        </div>
      </HStack>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Open
      </Button>
    </div>
  );
}

/* ----------------------------------------
   ModalsPage Component
   ---------------------------------------- */

export function ModalsPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleteSecurityGroupOpen, setIsDeleteSecurityGroupOpen] = useState(false);
  const [isDeleteSecurityGroupsMultipleOpen, setIsDeleteSecurityGroupsMultipleOpen] = useState(false);
  const [isDeleteRuleOpen, setIsDeleteRuleOpen] = useState(false);
  const [isDeleteRulesMultipleOpen, setIsDeleteRulesMultipleOpen] = useState(false);
  const [isDetachVolumeOpen, setIsDetachVolumeOpen] = useState(false);
  const [isRestoreBackupSmallOpen, setIsRestoreBackupSmallOpen] = useState(false);
  const [isRestoreBackupMediumOpen, setIsRestoreBackupMediumOpen] = useState(false);
  const [isRestoreBackupLargeOpen, setIsRestoreBackupLargeOpen] = useState(false);
  const [isDisassociateFloatingIPOpen, setIsDisassociateFloatingIPOpen] = useState(false);
  const [isDisassociateFloatingIPLBOpen, setIsDisassociateFloatingIPLBOpen] = useState(false);
  const [isReleaseFloatingIPSmallOpen, setIsReleaseFloatingIPSmallOpen] = useState(false);
  const [isReleaseFloatingIPMediumOpen, setIsReleaseFloatingIPMediumOpen] = useState(false);
  const [isDeleteLoadBalancerOpen, setIsDeleteLoadBalancerOpen] = useState(false);
  const [isDeleteLoadBalancersMultipleOpen, setIsDeleteLoadBalancersMultipleOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* TabBar */}
          <TabBar
            tabs={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
            }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
          />

          {/* TopBar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Design System', href: '/design-system' },
                  { label: 'Modals' },
                ]}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Content */}
          <div className="px-8 py-6">
            <VStack gap={8}>
              {/* Header */}
              <VStack gap={2}>
                <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                  Modal Components
                </h1>
                <p className="text-[14px] text-[var(--color-text-subtle)]">
                  Collection of modal components used across the application. Click to preview each modal.
                </p>
              </VStack>

              {/* Modal Categories */}
              <VStack gap={4}>
                {/* Delete Modals */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Delete Modals
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete Snapshot"
                      description="Confirm deletion of a snapshot with warning about permanent action."
                      category="Confirm"
                      size="sm"
                      onOpen={() => setIsConfirmDeleteOpen(true)}
                    />
                    <ModalListItem
                      title="Delete Security Group"
                      description="Confirm deletion of a single security group with warning."
                      category="Confirm"
                      size="sm"
                      onOpen={() => setIsDeleteSecurityGroupOpen(true)}
                    />
                    <ModalListItem
                      title="Delete Security Groups (Multiple)"
                      description="Confirm deletion of multiple security groups with scrollable list."
                      category="Confirm"
                      size="md"
                      onOpen={() => setIsDeleteSecurityGroupsMultipleOpen(true)}
                    />
                    <ModalListItem
                      title="Delete Rule"
                      description="Confirm deletion of a single security group rule."
                      category="Confirm"
                      size="sm"
                      onOpen={() => setIsDeleteRuleOpen(true)}
                    />
                    <ModalListItem
                      title="Delete Rules (Multiple)"
                      description="Confirm deletion of multiple rules with scrollable list and warning."
                      category="Confirm"
                      size="md"
                      onOpen={() => setIsDeleteRulesMultipleOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Volume Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Volume Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Detach Volume"
                      description="Confirm detachment of a volume with warning about data corruption."
                      category="Volume"
                      size="sm"
                      onOpen={() => setIsDetachVolumeOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Backup Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Backup Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Restore Backup"
                      description="Simple restore backup confirmation with volume info."
                      category="Backup"
                      size="sm"
                      onOpen={() => setIsRestoreBackupSmallOpen(true)}
                    />
                    <ModalListItem
                      title="Restore Backup (with instance name)"
                      description="Restore backup with volume and instance list information."
                      category="Backup"
                      size="md"
                      onOpen={() => setIsRestoreBackupMediumOpen(true)}
                    />
                    <ModalListItem
                      title="Restore Backup (with instance name and warning)"
                      description="Restore backup with warning alert and disabled action button."
                      category="Backup"
                      size="lg"
                      onOpen={() => setIsRestoreBackupLargeOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Floating IP */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Floating IP
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Disassociate Floating IP"
                      description="Confirm disassociation of a floating IP from a resource."
                      category="Network"
                      size="sm"
                      onOpen={() => setIsDisassociateFloatingIPOpen(true)}
                    />
                    <ModalListItem
                      title="Disassociate Floating IP (Load Balancer)"
                      description="Disassociate a floating IP from a load balancer."
                      category="Network"
                      size="sm"
                      onOpen={() => setIsDisassociateFloatingIPLBOpen(true)}
                    />
                    <ModalListItem
                      title="Release Floating IP"
                      description="Release a single floating IP with warning about permanent action."
                      category="Network"
                      size="sm"
                      onOpen={() => setIsReleaseFloatingIPSmallOpen(true)}
                    />
                    <ModalListItem
                      title="Release Floating IP (Associated to)"
                      description="Release multiple floating IPs with scrollable list."
                      category="Network"
                      size="md"
                      onOpen={() => setIsReleaseFloatingIPMediumOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Load Balancers */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Load Balancers
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete Load Balancer"
                      description="Delete a single load balancer with warning about associated resources."
                      category="Network"
                      size="sm"
                      onOpen={() => setIsDeleteLoadBalancerOpen(true)}
                    />
                    <ModalListItem
                      title="Release Load Balancers"
                      description="Delete multiple load balancers with scrollable list and warning."
                      category="Network"
                      size="md"
                      onOpen={() => setIsDeleteLoadBalancersMultipleOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Placeholder for Future Modals */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Coming Soon
                  </h2>
                  <div className="flex flex-col gap-2">
                    <div className="p-6 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                      <VStack gap={2} className="items-center justify-center h-full">
                        <p className="text-[14px] text-[var(--color-text-muted)]">
                          More modals will be added here...
                        </p>
                      </VStack>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </VStack>
          </div>
        </div>
      </main>

      {/* Modal Components */}

      {/* Delete Snapshot Modal */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Delete Snapshot"
        description="Are you sure you want to delete this Snapshot?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Snapshot Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshot name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              2cdfafc1
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting a snapshot is a permanent action and cannot be undone. Any volumes or instances created from this snapshot will not be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Snapshot deleted');
              setIsConfirmDeleteOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Modal (Single) */}
      <Modal
        isOpen={isDeleteSecurityGroupOpen}
        onClose={() => setIsDeleteSecurityGroupOpen(false)}
        title="Delete Security Group"
        description="Are you sure you want to delete this security group? This action cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Security Group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security Group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              sg-01
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules.
              <br />
              If this group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteSecurityGroupOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Security group deleted');
              setIsDeleteSecurityGroupOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Groups Modal (Multiple) */}
      <Modal
        isOpen={isDeleteSecurityGroupsMultipleOpen}
        onClose={() => setIsDeleteSecurityGroupsMultipleOpen(false)}
        title="Delete Security Groups"
        description="Are you sure you want to delete the selected security groups? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Security Groups Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security Groups(10)
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>sg-01</li>
              <li>sg-02</li>
              <li>sg-03</li>
              <li>sg-04</li>
              <li>sg-05</li>
              <li>sg-06</li>
              <li>sg-07</li>
              <li>sg-08</li>
              <li>sg-09</li>
              <li>sg-10</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all its rules.
              <br />
              If these groups are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteSecurityGroupsMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Security groups deleted');
              setIsDeleteSecurityGroupsMultipleOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Rule Modal (Single) */}
      <Modal
        isOpen={isDeleteRuleOpen}
        onClose={() => setIsDeleteRuleOpen(false)}
        title="Delete Rule"
        description="Are you sure you want to delete this rule? This action cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Rule Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rule
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              Ingress TCP 80 from 0.0.0.0/0
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteRuleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Rule deleted');
              setIsDeleteRuleOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Rules Modal (Multiple with Warning) */}
      <Modal
        isOpen={isDeleteRulesMultipleOpen}
        onClose={() => setIsDeleteRulesMultipleOpen(false)}
        title="Delete Rules"
        description="Are you sure you want to delete the selected rules? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Rules Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rules(10)
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Ingress TCP 80 from 0.0.0.0/0</li>
              <li>Ingress TCP 443 from 0.0.0.0/0</li>
              <li>Ingress TCP 22 from 10.0.0.0/8</li>
              <li>Egress TCP 80 to 0.0.0.0/0</li>
              <li>Egress TCP 443 to 0.0.0.0/0</li>
              <li>Ingress UDP 53 from 0.0.0.0/0</li>
              <li>Egress UDP 53 to 0.0.0.0/0</li>
              <li>Ingress ICMP from 0.0.0.0/0</li>
              <li>Egress ICMP to 0.0.0.0/0</li>
              <li>Ingress TCP 3306 from 10.0.0.0/8</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the selected rules.
              <br />
              If these rules are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteRulesMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Rules deleted');
              setIsDeleteRulesMultipleOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Detach Volume Modal */}
      <Modal
        isOpen={isDetachVolumeOpen}
        onClose={() => setIsDetachVolumeOpen(false)}
        title="Detach Volume"
        description="Are you sure you want to detach this volume?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol57
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Make sure the filesystem inside the instance is unmounted before detaching. Detaching a volume while the instance is running may cause data corruption.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDetachVolumeOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Volume detached');
              setIsDetachVolumeOpen(false);
            }} 
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Restore Backup (Small) Modal */}
      <Modal
        isOpen={isRestoreBackupSmallOpen}
        onClose={() => setIsRestoreBackupSmallOpen(false)}
        title="Restore Backup"
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupSmallOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Backup restored');
              setIsRestoreBackupSmallOpen(false);
            }} 
            className="flex-1"
          >
            Restore
          </Button>
        </div>
      </Modal>

      {/* Restore Backup (Medium) Modal */}
      <Modal
        isOpen={isRestoreBackupMediumOpen}
        onClose={() => setIsRestoreBackupMediumOpen(false)}
        title="Restore Backup"
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance name
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupMediumOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Backup restored');
              setIsRestoreBackupMediumOpen(false);
            }} 
            className="flex-1"
          >
            Restore
          </Button>
        </div>
      </Modal>

      {/* Restore Backup (Large) Modal */}
      <Modal
        isOpen={isRestoreBackupLargeOpen}
        onClose={() => setIsRestoreBackupLargeOpen(false)}
        title="Restore Backup"
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
        size="lg"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance name
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Restore cannot proceed. Change the backup status to Available or shut down the attached instance.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupLargeOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            disabled
            className="flex-1"
          >
            Restore
          </Button>
        </div>
      </Modal>

      {/* Disassociate Floating IP Modal */}
      <Modal
        isOpen={isDisassociateFloatingIPOpen}
        onClose={() => setIsDisassociateFloatingIPOpen(false)}
        title="Disassociate Floating IP"
        description="Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately. The IP will remain in your project and can be re-associated later."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>

          {/* Associated To Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Associated To
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Type : Instance</li>
              <li>Name : server-01</li>
              <li>Fixed IP : 10.0.0.10</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDisassociateFloatingIPOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Disassociate floating IP confirmed');
              setIsDisassociateFloatingIPOpen(false);
            }} 
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Disassociate Floating IP (Load Balancer) Modal */}
      <Modal
        isOpen={isDisassociateFloatingIPLBOpen}
        onClose={() => setIsDisassociateFloatingIPLBOpen(false)}
        title="Disassociate Floating IP"
        description="Disassociating will detach the floating IP from this load balancer. External access to the load balancer will be interrupted."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load Balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load Balancer
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-lb-01(10.0.0.10)
            </span>
          </div>

          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDisassociateFloatingIPLBOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Disassociate floating IP from load balancer confirmed');
              setIsDisassociateFloatingIPLBOpen(false);
            }} 
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Release Floating IP (Small) Modal */}
      <Modal
        isOpen={isReleaseFloatingIPSmallOpen}
        onClose={() => setIsReleaseFloatingIPSmallOpen(false)}
        title="Release Floating IP"
        description="Are you sure you want to release this floating IP? This action cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach this IP from its target and remove it from your project. External access via this IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsReleaseFloatingIPSmallOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Release floating IP confirmed');
              setIsReleaseFloatingIPSmallOpen(false);
            }} 
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Release Floating IP (Medium) Modal */}
      <Modal
        isOpen={isReleaseFloatingIPMediumOpen}
        onClose={() => setIsReleaseFloatingIPMediumOpen(false)}
        title="Release Floating IP"
        description="Are you sure you want to release this floating IP? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Associated To Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Associated To
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>123.45.67.8</li>
              <li>123.45.67.2</li>
              <li>123.45.67.4</li>
              <li>123.45.67.7</li>
              <li>123.45.67.1</li>
              <li>123.45.67.2</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach these IPs from their target and remove them from your project. External access via these IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsReleaseFloatingIPMediumOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Disassociate floating IPs confirmed');
              setIsReleaseFloatingIPMediumOpen(false);
            }} 
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Delete Load Balancer Modal (Single) */}
      <Modal
        isOpen={isDeleteLoadBalancerOpen}
        onClose={() => setIsDeleteLoadBalancerOpen(false)}
        title="Delete Load Balancer"
        description="Are you sure you want to delete this load balancer? This action cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load Balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load Balancer
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-lb-01
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with it will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteLoadBalancerOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Load balancer deleted');
              setIsDeleteLoadBalancerOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Release Load Balancers Modal (Multiple) */}
      <Modal
        isOpen={isDeleteLoadBalancersMultipleOpen}
        onClose={() => setIsDeleteLoadBalancersMultipleOpen(false)}
        title="Release Load Balancers"
        description="Are you sure you want to delete the selected load balancers? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Load Balancers Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load Balancers
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-lb-01</li>
              <li>web-lb-02</li>
              <li>web-lb-03</li>
              <li>web-lb-04</li>
              <li>web-lb-05</li>
              <li>web-lb-06</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with them will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteLoadBalancersMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              console.log('Load balancers deleted');
              setIsDeleteLoadBalancersMultipleOpen(false);
            }} 
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalsPage;

