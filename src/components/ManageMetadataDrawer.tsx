import { useState } from 'react';
import { Drawer, Button, Input, Select, SearchInput, Table } from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import {
  IconCirclePlus,
  IconCircleMinus,
  IconChevronRight,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface MetadataItem {
  id: string;
  key: string;
  children?: MetadataItem[];
}

export interface ExistingMetadataItem {
  id: string;
  key: string;
  valueType: 'text' | 'select';
  value: string;
  options?: { value: string; label: string }[];
}

export interface ManageMetadataImageInfo {
  id: string;
  name: string;
}

export interface ManageMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  image: ManageMetadataImageInfo;
  onSave?: (metadata: ExistingMetadataItem[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockAvailableMetadata: MetadataItem[] = [
  {
    id: 'meta-1',
    key: 'hw',
    children: [
      { id: 'meta-1-1', key: 'hw_disk_bus' },
      { id: 'meta-1-2', key: 'hw_vif_model' },
    ],
  },
  { id: 'meta-2', key: 'os_distro' },
  { id: 'meta-3', key: 'os_version' },
  { id: 'meta-4', key: 'os_type' },
  { id: 'meta-5', key: 'architecture' },
  { id: 'meta-6', key: 'hypervisor_type' },
  { id: 'meta-7', key: 'instance_uuid' },
  { id: 'meta-8', key: 'img_config_drive' },
  { id: 'meta-9', key: 'hw_qemu_guest_agent' },
  { id: 'meta-10', key: 'hw_machine_type' },
];

const mockExistingMetadata: ExistingMetadataItem[] = [
  {
    id: 'existing-1',
    key: 'os_distro',
    valueType: 'text',
    value: '',
  },
  {
    id: 'existing-2',
    key: 'os_type',
    valueType: 'select',
    value: '',
    options: [
      { value: 'linux', label: 'Linux' },
      { value: 'windows', label: 'Windows' },
    ],
  },
];

/* ----------------------------------------
   AvailableMetadataPanel Component
   ---------------------------------------- */

function AvailableMetadataPanel({
  searchQuery,
  onSearchChange,
  customKey,
  onCustomKeyChange,
  onAddCustomKey,
  availableItems,
  expandedItems,
  onToggleExpand,
  onAddItem,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  customKey: string;
  onCustomKeyChange: (value: string) => void;
  onAddCustomKey: () => void;
  availableItems: MetadataItem[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  onAddItem: (key: string) => void;
}) {
  const filteredItems = availableItems.filter((item) =>
    item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Flatten tree into table-compatible data */
  interface FlatMetadataRow {
    id: string;
    key: string;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    originalItem: MetadataItem;
  }

  const flattenItems = (items: MetadataItem[], depth = 0): FlatMetadataRow[] => {
    const rows: FlatMetadataRow[] = [];
    for (const item of items) {
      const hasChildren = !!(item.children && item.children.length > 0);
      const isExpanded = expandedItems.has(item.id);
      rows.push({ id: item.id, key: item.key, depth, hasChildren, isExpanded, originalItem: item });
      if (hasChildren && isExpanded) {
        rows.push(...flattenItems(item.children!, depth + 1));
      }
    }
    return rows;
  };

  const flatData = flattenItems(filteredItems);

  const availableColumns: TableColumn<FlatMetadataRow>[] = [
    {
      key: 'key',
      label: 'Key',
      flex: 1,
      render: (_value, row) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          style={{ paddingLeft: `${row.depth * 16}px` }}
          onClick={(e) => {
            e.stopPropagation();
            if (row.hasChildren) onToggleExpand(row.id);
          }}
        >
          {row.hasChildren ? (
            row.isExpanded ? (
              <IconChevronDown
                size={12}
                className="shrink-0 text-[var(--color-text-default)]"
                stroke={1.5}
              />
            ) : (
              <IconChevronRight
                size={12}
                className="shrink-0 text-[var(--color-text-default)]"
                stroke={1.5}
              />
            )
          ) : (
            <div className="w-3 shrink-0" />
          )}
          <span className="text-body-md text-[var(--color-text-default)] truncate">{row.key}</span>
        </div>
      ),
    },
    {
      key: 'id' as keyof FlatMetadataRow,
      label: '',
      width: '40px',
      align: 'center',
      render: (_value, row) => (
        <Button
          variant="ghost"
          size="xs"
          icon={<IconCirclePlus size={14} stroke={1.5} />}
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(row.key);
          }}
          aria-label={`Add ${row.key}`}
          className="!min-w-0 !p-0"
        />
      ),
    },
  ];

  return (
    <VStack gap={2} className="flex-1 min-w-0 h-[550px] overflow-hidden">
      <span className="text-label-lg text-[var(--color-text-default)]">Available metadata</span>

      <SearchInput
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search metadata"
        size="sm"
      />

      {/* Custom key input row */}
      <HStack gap={2} className="w-full" align="center">
        <Input
          placeholder="Enter custom metadata key"
          value={customKey}
          onChange={(e) => onCustomKeyChange(e.target.value)}
          fullWidth
          size="sm"
        />
        <Button
          variant="ghost"
          size="xs"
          icon={<IconCirclePlus size={14} stroke={1.5} />}
          onClick={onAddCustomKey}
          disabled={!customKey.trim()}
          aria-label="Add custom metadata"
          className="!min-w-0 !p-0 shrink-0"
        />
      </HStack>

      {/* Available items table */}
      <div className="flex-1 overflow-y-auto">
        <Table
          columns={availableColumns}
          data={flatData}
          rowKey="id"
          emptyMessage="No metadata found"
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   ExistingMetadataPanel Component
   ---------------------------------------- */

function ExistingMetadataPanel({
  searchQuery,
  onSearchChange,
  existingItems,
  onValueChange,
  onRemoveItem,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  existingItems: ExistingMetadataItem[];
  onValueChange: (id: string, value: string) => void;
  onRemoveItem: (id: string) => void;
}) {
  const filteredItems = existingItems.filter((item) =>
    item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const existingColumns: TableColumn<ExistingMetadataItem>[] = [
    {
      key: 'key',
      label: 'Key',
      minWidth: '80px',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
          {row.key}
        </span>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      flex: 1,
      minWidth: '120px',
      render: (_value, row) =>
        row.valueType === 'select' ? (
          <Select
            options={row.options || []}
            value={row.value}
            onChange={(val) => onValueChange(row.id, val)}
            placeholder="Select value"
            width="sm"
          />
        ) : (
          <Input
            placeholder="Enter value"
            value={row.value}
            onChange={(e) => onValueChange(row.id, e.target.value)}
            size="sm"
            fullWidth
          />
        ),
    },
    {
      key: 'id' as keyof ExistingMetadataItem,
      label: '',
      width: '40px',
      align: 'center',
      render: (_value, row) => (
        <Button
          variant="ghost"
          size="xs"
          icon={<IconCircleMinus size={14} stroke={1.5} />}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveItem(row.id);
          }}
          aria-label={`Remove ${row.key}`}
          className="!min-w-0 !p-0"
        />
      ),
    },
  ];

  return (
    <VStack gap={2} className="flex-1 min-w-0 h-[550px] overflow-hidden">
      <span className="text-label-lg text-[var(--color-text-default)]">Existing metadata</span>

      <SearchInput
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search metadata"
        size="sm"
      />

      {/* Existing items table */}
      <div className="flex-1 overflow-y-auto">
        <Table
          columns={existingColumns}
          data={filteredItems}
          rowKey="id"
          emptyMessage="No metadata added"
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   ManageMetadataDrawer Component
   ---------------------------------------- */

export function ManageMetadataDrawer({
  isOpen,
  onClose,
  image,
  onSave,
}: ManageMetadataDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available metadata state
  const [availableSearchQuery, setAvailableSearchQuery] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['meta-1']));

  // Existing metadata state
  const [existingSearchQuery, setExistingSearchQuery] = useState('');
  const [existingMetadata, setExistingMetadata] =
    useState<ExistingMetadataItem[]>(mockExistingMetadata);

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddItem = (key: string) => {
    // Check if already exists
    if (existingMetadata.some((item) => item.key === key)) return;

    const newItem: ExistingMetadataItem = {
      id: `existing-${Date.now()}`,
      key,
      valueType: 'text',
      value: '',
    };
    setExistingMetadata([...existingMetadata, newItem]);
  };

  const handleAddCustomKey = () => {
    if (!customKey.trim()) return;
    handleAddItem(customKey.trim());
    setCustomKey('');
  };

  const handleValueChange = (id: string, value: string) => {
    setExistingMetadata(
      existingMetadata.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setExistingMetadata(existingMetadata.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(existingMetadata);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAvailableSearchQuery('');
    setExistingSearchQuery('');
    setCustomKey('');
    setExistingMetadata(mockExistingMetadata);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
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
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Manage metadata</h2>

          {/* Image Info */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <div className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Image</div>
            <div className="text-body-md text-[var(--color-text-default)]">{image.name}</div>
          </div>
        </VStack>

        {/* Metadata Section */}
        <VStack gap={4} className="w-full">
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Metadata</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select existing metadata or define new metadata to apply to the image.
            </p>
          </VStack>

          {/* Dual Panel Layout */}
          <HStack gap={4} className="w-full" align="start">
            <AvailableMetadataPanel
              searchQuery={availableSearchQuery}
              onSearchChange={setAvailableSearchQuery}
              customKey={customKey}
              onCustomKeyChange={setCustomKey}
              onAddCustomKey={handleAddCustomKey}
              availableItems={mockAvailableMetadata}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
              onAddItem={handleAddItem}
            />
            <ExistingMetadataPanel
              searchQuery={existingSearchQuery}
              onSearchChange={setExistingSearchQuery}
              existingItems={existingMetadata}
              onValueChange={handleValueChange}
              onRemoveItem={handleRemoveItem}
            />
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageMetadataDrawer;
