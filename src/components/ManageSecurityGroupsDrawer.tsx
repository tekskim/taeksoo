import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  SelectionIndicator,
  InfoBox,
  Toggle,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SecurityGroupItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface ManageSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  portName?: string;
  securityGroups?: SecurityGroupItem[];
  onSave?: (securityGroupIds: string[], portSecurityEnabled: boolean) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultSecurityGroups: SecurityGroupItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `sg-${i + 1}`,
  name: i === 0 ? 'default_sg' : `internal-${String(i + 1).padStart(2, '0')}`,
  description: '-',
  createdAt: i % 2 === 0 ? 'Sep 23, 2025' : 'Aug 23, 2025',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Column Definitions
   ---------------------------------------- */

const securityGroupColumns: TableColumn<SecurityGroupItem>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'createdAt', label: 'Created at', sortable: true },
];

/* ----------------------------------------
   ManageSecurityGroupsDrawer Component
   ---------------------------------------- */

export function ManageSecurityGroupsDrawer({
  isOpen,
  onClose,
  instance,
  portName = 'port-01',
  securityGroups = defaultSecurityGroups,
  onSave,
}: ManageSecurityGroupsDrawerProps) {
  const [portSecurityEnabled, setPortSecurityEnabled] = useState(true);
  const [selectedSecurityGroupIds, setSelectedSecurityGroupIds] = useState<string[]>([]);
  const [sgSearchQuery, setSgSearchQuery] = useState('');
  const [sgPage, setSgPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPortSecurityEnabled(true);
      setSelectedSecurityGroupIds([]);
      setSgSearchQuery('');
      setSgPage(1);
    }
  }, [isOpen]);

  const filteredSecurityGroups = securityGroups.filter(
    (sg) =>
      sg.name.toLowerCase().includes(sgSearchQuery.toLowerCase()) ||
      sg.description.toLowerCase().includes(sgSearchQuery.toLowerCase())
  );

  const sgTotalPages = Math.ceil(filteredSecurityGroups.length / ITEMS_PER_PAGE);
  const paginatedSecurityGroups = filteredSecurityGroups.slice(
    (sgPage - 1) * ITEMS_PER_PAGE,
    sgPage * ITEMS_PER_PAGE
  );

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(selectedSecurityGroupIds, portSecurityEnabled);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSecurityGroupIds([]);
    setSgSearchQuery('');
    setSgPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage security groups"
      description="When disabled, no security groups will be applied, and anti-spoofing checks are turned off."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <InfoBox label="Port name" value={portName} />

        <FormField spacing="loose" required>
          <FormField.Label>Port security</FormField.Label>
          <FormField.Description>
            Indicates whether to enable security features on the port, including security groups.
          </FormField.Description>
          <FormField.Control>
            <Toggle
              checked={portSecurityEnabled}
              onChange={(e) => setPortSecurityEnabled(e.target.checked)}
              label={portSecurityEnabled ? 'On' : 'Off'}
            />
          </FormField.Control>
        </FormField>

        {portSecurityEnabled && (
          <VStack gap={3} className="pb-5">
            <VStack gap={1}>
              <h3 className="text-label-lg text-[var(--color-text-default)]">Security groups</h3>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select the security groups to apply to the port.
              </span>
            </VStack>

            <div className="w-[280px]">
              <SearchInput
                value={sgSearchQuery}
                onChange={(e) => setSgSearchQuery(e.target.value)}
                onClear={() => setSgSearchQuery('')}
                placeholder="Search security groups by attributes"
                size="sm"
                fullWidth
              />
            </div>

            <Pagination
              currentPage={sgPage}
              totalPages={sgTotalPages}
              totalItems={filteredSecurityGroups.length}
              onPageChange={setSgPage}
              selectedCount={selectedSecurityGroupIds.length}
            />

            <VStack gap={2} className="w-full">
              <Table<SecurityGroupItem>
                columns={securityGroupColumns}
                data={paginatedSecurityGroups}
                rowKey="id"
                selectable
                selectedKeys={selectedSecurityGroupIds}
                onSelectionChange={(keys) => setSelectedSecurityGroupIds(keys as string[])}
                emptyMessage="No security groups found"
              />
              <SelectionIndicator
                selectedItems={selectedSecurityGroupIds.map((id) => ({
                  id,
                  label: securityGroups.find((sg) => sg.id === id)?.name || '',
                }))}
                onRemove={(id) =>
                  setSelectedSecurityGroupIds((prev) => prev.filter((sgId) => sgId !== id))
                }
                emptyText="No items selected"
                className="shrink-0 w-full"
              />
            </VStack>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default ManageSecurityGroupsDrawer;
