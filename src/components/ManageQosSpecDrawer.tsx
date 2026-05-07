import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  SelectionIndicator,
  InfoBox,
  Table,
  CopyButton,
  BadgeList,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ManageQosSpecVolumeTypeInfo {
  id: string;
  name: string;
}

export interface ManageQosSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeType: ManageQosSpecVolumeTypeInfo;
  onSubmit?: (qosSpecId: string) => void;
}

interface QosSpecItem {
  id: string;
  name: string;
  consumer: string;
  specs: string[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockQosSpecs: QosSpecItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `qos-${String(i + 1).padStart(3, '0')}`,
  name: 'spec',
  consumer: 'Frontend',
  specs: [
    'read_iops_sec=5',
    'write_iops_sec=5',
    'read_bytes_sec=5',
    'write_bytes_sec=5',
    'total_iops_sec=10',
    'total_bytes_sec=10',
  ],
}));

/* ----------------------------------------
   ManageQosSpecDrawer Component
   ---------------------------------------- */

export function ManageQosSpecDrawer({
  isOpen,
  onClose,
  volumeType,
  onSubmit,
}: ManageQosSpecDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCurrentPage(1);
      setSelectedSpecId(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const filteredSpecs = mockQosSpecs.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.consumer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSpecs.length / ITEMS_PER_PAGE);
  const paginatedSpecs = filteredSpecs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const specColumns: TableColumn<QosSpecItem>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/compute-admin/qos-specs/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)] shrink-0" />
          </div>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-disabled)] truncate">
            ID: {row.id}
            <CopyButton
              value={row.id}
              size="sm"
              iconOnly
              variant="ghost"
              className="h-auto p-0 text-[var(--color-text-disabled)] hover:text-[var(--color-text-muted)]"
            />
          </span>
        </div>
      ),
    },
    {
      key: 'consumer',
      label: 'Consumer',
      flex: 1,
      sortable: true,
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)]">{value as string}</span>
      ),
    },
    {
      key: 'specs',
      label: 'Specs',
      flex: 1,
      render: (_value, row) => (
        <BadgeList
          items={row.specs}
          maxVisible={1}
          maxBadgeWidth="140px"
          popoverTitle={`All Specs (${row.specs.length})`}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!selectedSpecId) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedSpecId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const selectedSpec = selectedSpecId ? mockQosSpecs.find((s) => s.id === selectedSpecId) : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage QoS spec"
      description="Adds or updates QoS specifications to configure quality policies for the volume type."
      width={560}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Volume type" value={volumeType.name} />

        <VStack gap={3} className="w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">QoS spec</h3>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select the QoS specification to apply to the volume type.
            </p>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search specs by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredSpecs.length}
          />

          <VStack gap={2}>
            <Table
              columns={specColumns}
              data={paginatedSpecs}
              rowKey="id"
              selectable
              selectionType="radio"
              selectedKeys={selectedSpecId ? [selectedSpecId] : []}
              onSelectionChange={(keys) => {
                const id = keys[0] ?? null;
                setSelectedSpecId(id as string | null);
              }}
              onRowClick={(row) => {
                setSelectedSpecId(row.id);
              }}
              emptyMessage="No QoS specs found"
            />

            <SelectionIndicator
              selectedItems={
                selectedSpec ? [{ id: selectedSpec.id, label: selectedSpec.name }] : []
              }
              onRemove={() => setSelectedSpecId(null)}
              emptyText="No items selected"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageQosSpecDrawer;
