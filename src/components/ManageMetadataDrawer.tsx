import { useState } from 'react';
import { Drawer, Button, Input, SearchInput, InlineMessage } from '@/design-system';
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

export interface ManageMetadataImageInfo {
  id: string;
  name: string;
}

export interface ManageMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  image: ManageMetadataImageInfo;
  onSave?: (metadata: Array<{ key: string; value: string }>) => void;
}

/* ----------------------------------------
   Mock Data — same shape as Create Flavor page
   ---------------------------------------- */

interface AvailableMetadataOption {
  key: string;
  label: string;
  children?: string[];
}

const availableMetadataOptions: AvailableMetadataOption[] = [
  {
    key: 'cpu_allocation_ratio',
    label: 'CPU Allocation Ratio',
    children: ['1.0', '2.0', '4.0', '8.0', '16.0'],
  },
  { key: 'ram_allocation_ratio', label: 'RAM Allocation Ratio', children: ['1.0', '1.5', '2.0'] },
  { key: 'disk_allocation_ratio', label: 'Disk Allocation Ratio', children: ['1.0', '2.0'] },
  { key: 'hw:cpu_policy', label: 'CPU Policy', children: ['shared', 'dedicated'] },
  {
    key: 'hw:cpu_thread_policy',
    label: 'CPU Thread Policy',
    children: ['prefer', 'isolate', 'require'],
  },
  { key: 'hw:numa_nodes', label: 'NUMA Nodes', children: ['1', '2', '4'] },
  { key: 'hw:mem_page_size', label: 'Memory Page Size', children: ['small', 'large', 'any'] },
  { key: 'quota:disk_read_bytes_sec', label: 'Disk Read Bytes/sec' },
  { key: 'quota:disk_write_bytes_sec', label: 'Disk Write Bytes/sec' },
  { key: 'quota:vif_inbound_average', label: 'VIF Inbound Average' },
];

/* ----------------------------------------
   ManageMetadataDrawer Component
   ---------------------------------------- */

export function ManageMetadataDrawer({
  isOpen,
  onClose,
  image,
  onSave,
}: ManageMetadataDrawerProps) {
  // Available metadata state
  const [availableMetadataSearch, setAvailableMetadataSearch] = useState('');
  const [existingMetadataSearch, setExistingMetadataSearch] = useState('');
  const [customMetadataKey, setCustomMetadataKey] = useState('');
  const [expandedMetadata, setExpandedMetadata] = useState<Set<string>>(new Set());
  const [selectedMetadata, setSelectedMetadata] = useState<Array<{ key: string; value: string }>>(
    []
  );

  // Validation state
  const [showValueErrors, setShowValueErrors] = useState(false);
  const [customKeyError, setCustomKeyError] = useState('');

  /** Validate a custom key against selected metadata and pre-defined options. */
  const validateCustomKey = (key: string): string => {
    const trimmed = key.trim();
    if (!trimmed) return '';

    // Check for duplicate against already-selected metadata (case-insensitive)
    if (selectedMetadata.some((m) => m.key.toLowerCase() === trimmed.toLowerCase())) {
      return `"${trimmed}" already exists in existing metadata.`;
    }

    // Check for overlap with pre-defined available metadata options (key or label, case-insensitive)
    const matchingOption = availableMetadataOptions.find(
      (opt) =>
        opt.key.toLowerCase() === trimmed.toLowerCase() ||
        opt.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (matchingOption) {
      return `"${trimmed}" is a pre-defined metadata key. Use "${matchingOption.label}" from the list instead.`;
    }

    return '';
  };

  const handleSave = () => {
    // Check if any existing metadata has empty values
    const hasEmptyValues = selectedMetadata.some((m) => !m.value.trim());
    if (hasEmptyValues) {
      setShowValueErrors(true);
      return;
    }
    onSave?.(selectedMetadata);
    onClose();
  };

  const handleCustomKeyChange = (value: string) => {
    setCustomMetadataKey(value);
    const error = validateCustomKey(value);
    setCustomKeyError(error);
  };

  const handleAddCustomKey = () => {
    const trimmedKey = customMetadataKey.trim();
    if (!trimmedKey) return;

    // Re-validate before adding
    const error = validateCustomKey(trimmedKey);
    if (error) {
      setCustomKeyError(error);
      return;
    }

    setSelectedMetadata((prev) => [...prev, { key: trimmedKey, value: '' }]);
    setCustomMetadataKey('');
    setCustomKeyError('');
  };

  const handleClose = () => {
    setAvailableMetadataSearch('');
    setExistingMetadataSearch('');
    setCustomMetadataKey('');
    setExpandedMetadata(new Set());
    setSelectedMetadata([]);
    setShowValueErrors(false);
    setCustomKeyError('');
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
        <VStack gap={3} className="w-full">
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Metadata</span>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Select existing metadata or define new metadata to apply to the image.
            </p>
          </VStack>

          {/* Two Column Layout */}
          <div className="flex gap-3 h-[500px]">
            {/* Left Column - Available Metadata */}
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2 min-h-0">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Available metadata
              </span>

              {/* Search */}
              <SearchInput
                value={availableMetadataSearch}
                onChange={setAvailableMetadataSearch}
                placeholder="Search metadata"
                className="w-full"
              />

              {/* Custom metadata input row */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
                  <div className="flex-1 px-3 py-2">
                    <Input
                      value={customMetadataKey}
                      onChange={(e) => handleCustomKeyChange(e.target.value)}
                      placeholder="Enter custom metadata key"
                      fullWidth
                      error={!!customKeyError}
                    />
                  </div>
                  <div className="px-3 py-2">
                    <button
                      onClick={handleAddCustomKey}
                      className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]"
                    >
                      <IconCirclePlus
                        size={16}
                        stroke={1.5}
                        className="text-[var(--color-text-muted)]"
                      />
                    </button>
                  </div>
                </div>
                {customKeyError && <InlineMessage variant="error">{customKeyError}</InlineMessage>}
              </div>

              {/* Metadata List */}
              <div
                className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-px"
                style={{ scrollbarGutter: 'stable' }}
              >
                {availableMetadataOptions
                  .filter(
                    (item) =>
                      !selectedMetadata.some((m) => m.key === item.key) &&
                      (!availableMetadataSearch ||
                        item.label.toLowerCase().includes(availableMetadataSearch.toLowerCase()) ||
                        item.key.toLowerCase().includes(availableMetadataSearch.toLowerCase()))
                  )
                  .map((item) => (
                    <div key={item.key} className="flex flex-col">
                      {/* Parent row */}
                      <div
                        className={`
                          flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)]
                          ${expandedMetadata.has(item.key) && item.children ? 'rounded-t-md border-b-0' : 'rounded-md'}
                        `}
                      >
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 min-h-[40px]">
                          <button
                            onClick={() => {
                              if (item.children) {
                                setExpandedMetadata((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(item.key)) {
                                    newSet.delete(item.key);
                                  } else {
                                    newSet.add(item.key);
                                  }
                                  return newSet;
                                });
                              }
                            }}
                            className="p-0.5"
                          >
                            {expandedMetadata.has(item.key) ? (
                              <IconChevronDown
                                size={16}
                                className="text-[var(--color-text-default)]"
                              />
                            ) : (
                              <IconChevronRight
                                size={16}
                                className="text-[var(--color-text-default)]"
                              />
                            )}
                          </button>
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {item.label}
                          </span>
                        </div>
                        <div className="px-3 py-2">
                          <button
                            onClick={() => {
                              if (!selectedMetadata.some((m) => m.key === item.key)) {
                                setSelectedMetadata((prev) => [
                                  ...prev,
                                  { key: item.key, value: '' },
                                ]);
                              }
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                          >
                            <IconCirclePlus
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)]"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Child rows when expanded */}
                      {item.children && expandedMetadata.has(item.key) && (
                        <div className="flex flex-col">
                          {item.children.map((child, childIndex) => (
                            <div
                              key={child}
                              className={`
                                flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] border-t-0
                                ${childIndex === item.children!.length - 1 ? 'rounded-b-md' : ''}
                              `}
                            >
                              <div className="flex-1 flex items-center gap-2 px-3 py-2 pl-10 min-h-[40px]">
                                <span className="text-label-md text-[var(--color-text-default)]">
                                  {child}
                                </span>
                              </div>
                              <div className="px-3 py-2">
                                <button
                                  onClick={() => {
                                    setSelectedMetadata((prev) => {
                                      const existing = prev.find((m) => m.key === item.key);
                                      if (existing) {
                                        return prev.map((m) =>
                                          m.key === item.key ? { ...m, value: child } : m
                                        );
                                      }
                                      return [...prev, { key: item.key, value: child }];
                                    });
                                  }}
                                  className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                                >
                                  <IconCirclePlus
                                    size={16}
                                    stroke={1.5}
                                    className="text-[var(--color-text-default)]"
                                  />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Column - Existing Metadata */}
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2 min-h-0">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Existing metadata
              </span>

              {/* Search */}
              <SearchInput
                value={existingMetadataSearch}
                onChange={setExistingMetadataSearch}
                placeholder="Search metadata"
                className="w-full"
              />

              {/* Selected Metadata List */}
              <div
                className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-px"
                style={{ scrollbarGutter: 'stable' }}
              >
                {selectedMetadata
                  .filter(
                    (item) =>
                      !existingMetadataSearch ||
                      item.key.toLowerCase().includes(existingMetadataSearch.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={`${item.key}-${index}`}
                      className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                    >
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 min-h-[40px]">
                        <span className="text-label-md text-[var(--color-text-default)] shrink-0">
                          {item.key}
                        </span>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        <Input
                          value={item.value}
                          onChange={(e) => {
                            setSelectedMetadata((prev) =>
                              prev.map((m, i) =>
                                i === index ? { ...m, value: e.target.value } : m
                              )
                            );
                            if (showValueErrors && e.target.value.trim()) {
                              // Clear error once all values are filled
                              const othersFilled = selectedMetadata.every(
                                (m, i) => i === index || m.value.trim()
                              );
                              if (othersFilled) setShowValueErrors(false);
                            }
                          }}
                          placeholder="Enter value"
                          fullWidth
                          error={showValueErrors && !item.value.trim()}
                        />
                      </div>
                      <div className="px-3 py-2">
                        <button
                          onClick={() => {
                            setSelectedMetadata((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-red-50"
                        >
                          <IconCircleMinus
                            size={16}
                            stroke={1.5}
                            className="text-[var(--color-text-default)]"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                {selectedMetadata.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      No metadata selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageMetadataDrawer;
