import { useState, useMemo, useCallback, useEffect, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import {
  IconDots,
  IconExternalLink,
  IconAlertCircle,
  IconBrandUbuntu,
  IconBrandWindows,
  IconHexagon,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

type SourceType = 'blank' | 'image' | 'snapshot';

const STEP_IDS = ['basic', 'source', 'config'] as const;

interface ImageRow {
  id: string;
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRAM: string;
  visibility: string;
  os: string;
  status: 'active' | 'error' | 'building' | 'muted';
  [key: string]: unknown;
}

interface SnapshotRow {
  id: string;
  name: string;
  volumeType: string;
  size: string;
  createdAt: string;
  status: 'active' | 'error' | 'building' | 'muted';
  [key: string]: unknown;
}

interface VolumeTypeRow {
  id: string;
  name: string;
  description: string;
  isPublic: string;
  [key: string]: unknown;
}

const mockImages: ImageRow[] = [
  {
    id: 'img-001',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '799.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-002',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '199.00 MiB',
    minDisk: '199.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-003',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '199.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '1 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-004',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '159.00 MiB',
    minDisk: '10.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-005',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '799.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-006',
    name: 'Windows-Server-2019',
    version: '2019',
    size: '4.5 GiB',
    minDisk: '40 GiB',
    minRAM: '2 GiB',
    visibility: 'Public',
    os: 'windows',
    status: 'active',
  },
  {
    id: 'img-007',
    name: 'Rocky-Linux-9',
    version: '9.0',
    size: '1.2 GiB',
    minDisk: '10 GiB',
    minRAM: '1 GiB',
    visibility: 'Public',
    os: 'rocky',
    status: 'active',
  },
];

const mockSnapshots: SnapshotRow[] = [
  {
    id: 'snap-001',
    name: 'snapshot-01',
    volumeType: '_DEFAULT_',
    size: '50 GiB',
    createdAt: 'Nov 1, 2025 10:20:28',
    status: 'active',
  },
  {
    id: 'snap-002',
    name: 'snapshot-02',
    volumeType: '_DEFAULT_',
    size: '0.0 GiB',
    createdAt: 'Nov 20, 2025 23:27:51',
    status: 'active',
  },
  {
    id: 'snap-003',
    name: 'snapshot-03',
    volumeType: '_DEFAULT_',
    size: '10 GiB',
    createdAt: 'Nov 20, 2025 23:27:51',
    status: 'active',
  },
  {
    id: 'snap-004',
    name: 'snapshot-04',
    volumeType: '_DEFAULT_',
    size: '68 GiB',
    createdAt: 'Nov 20, 2025 23:27:51',
    status: 'active',
  },
  {
    id: 'snap-005',
    name: 'snapshot-05',
    volumeType: '_DEFAULT_',
    size: '68 GiB',
    createdAt: 'Nov 30, 2025 21:37:41',
    status: 'active',
  },
];

const mockVolumeTypes: VolumeTypeRow[] = [
  { id: 'vt-001', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-002', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-003', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-004', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-005', name: '_DEFAULT_', description: '-', isPublic: 'On' },
];

const azOptions = [
  { value: 'nova', label: 'nova' },
  { value: 'nova-2', label: 'nova-2' },
  { value: 'nova-3', label: 'nova-3' },
];

const imageFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter image name...' },
];

const snapshotFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter snapshot name...' },
];

const volumeTypeFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter volume type name...' },
];

function imageStatusVariant(s: ImageRow['status']): StatusVariant {
  if (s === 'muted') return 'shutoff';
  return s;
}

function snapshotStatusVariant(s: SnapshotRow['status']): StatusVariant {
  if (s === 'muted') return 'shutoff';
  return s;
}

function formatSnapshotCreatedAt(value: string): string {
  return value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? value;
}

const OS_TABS: { id: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'all', label: 'Others', icon: IconDots },
  { id: 'ubuntu', label: 'Ubuntu', icon: IconBrandUbuntu },
  { id: 'windows', label: 'Windows', icon: IconBrandWindows },
  { id: 'rocky', label: 'Rocky', icon: IconHexagon },
];

export function ComputeCreateVolumePage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [basicSubmitted, setBasicSubmitted] = useState(false);
  const [sourceSubmitted, setSourceSubmitted] = useState(false);
  const [configSubmitted, setConfigSubmitted] = useState(false);

  const [volumeName, setVolumeName] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('');
  const [description, setDescription] = useState('');

  const [sourceType, setSourceType] = useState<SourceType>('blank');
  const [selectedImage, setSelectedImage] = useState<(string | number)[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<(string | number)[]>([]);
  const [imageOsFilter, setImageOsFilter] = useState('all');
  const [imageFilters, setImageFilters] = useState<FilterKeyWithValue[]>([]);
  const [snapshotFilters, setSnapshotFilters] = useState<FilterKeyWithValue[]>([]);
  const [volumeTypeFilters, setVolumeTypeFilters] = useState<FilterKeyWithValue[]>([]);
  const [imagePage, setImagePage] = useState(1);
  const [snapshotPage, setSnapshotPage] = useState(1);
  const [volumeTypePage, setVolumeTypePage] = useState(1);

  const [selectedVolumeType, setSelectedVolumeType] = useState<(string | number)[]>([]);
  const [volumeCapacity, setVolumeCapacity] = useState(10);

  const [sourceError, setSourceError] = useState<string | null>(null);
  const [volumeTypeError, setVolumeTypeError] = useState<string | null>(null);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    source: 'default',
    config: 'default',
  });

  const volumeNameError =
    basicSubmitted && !volumeName.trim() ? 'Please enter a volume name.' : null;
  const azError =
    basicSubmitted && !availabilityZone ? 'Please select an availability zone.' : null;

  const capacityMax = sourceType === 'snapshot' ? 1460 : 1000;
  const capacityStep = 10;
  const capacityHelper = sourceType === 'snapshot' ? '1–1460 GiB' : '1–1000 GiB';

  useEffect(() => {
    setVolumeCapacity((c) => Math.min(Math.max(c, 1), capacityMax));
  }, [capacityMax]);

  const itemsPerPage = 5;

  const filteredImages = useMemo(() => {
    return mockImages.filter((img) => {
      const matchesOs = imageOsFilter === 'all' || img.os === imageOsFilter;
      const matchesFilters =
        imageFilters.length === 0 ||
        imageFilters.every((f) => {
          const val = String(img[f.key] ?? '').toLowerCase();
          return val.includes(String(f.value ?? '').toLowerCase());
        });
      return matchesOs && matchesFilters;
    });
  }, [imageOsFilter, imageFilters]);

  const filteredSnapshots = useMemo(() => {
    if (snapshotFilters.length === 0) return mockSnapshots;
    return mockSnapshots.filter((snap) =>
      snapshotFilters.every((f) => {
        const val = String(snap[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [snapshotFilters]);

  const filteredVolumeTypes = useMemo(() => {
    if (volumeTypeFilters.length === 0) return mockVolumeTypes;
    return mockVolumeTypes.filter((vt) =>
      volumeTypeFilters.every((f) => {
        const val = String(vt[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [volumeTypeFilters]);

  const paginatedImages = filteredImages.slice(
    (imagePage - 1) * itemsPerPage,
    imagePage * itemsPerPage
  );
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotPage - 1) * itemsPerPage,
    snapshotPage * itemsPerPage
  );
  const paginatedVolumeTypes = filteredVolumeTypes.slice(
    (volumeTypePage - 1) * itemsPerPage,
    volumeTypePage * itemsPerPage
  );

  const handleImageFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setImageFilters((prev) => [...prev, filter]);
    setImagePage(1);
  }, []);

  const handleSnapshotFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setSnapshotFilters((prev) => [...prev, filter]);
    setSnapshotPage(1);
  }, []);

  const handleVolumeTypeFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setVolumeTypeFilters((prev) => [...prev, filter]);
    setVolumeTypePage(1);
  }, []);

  const validateBasicInfo = useCallback((): boolean => {
    setBasicSubmitted(true);
    return !!volumeName.trim() && !!availabilityZone;
  }, [volumeName, availabilityZone]);

  const validateSource = useCallback((): boolean => {
    setSourceSubmitted(true);
    if (sourceType === 'image' && selectedImage.length === 0) {
      setSourceError('Please select an image.');
      return false;
    }
    if (sourceType === 'snapshot' && selectedSnapshot.length === 0) {
      setSourceError('Please select a snapshot.');
      return false;
    }
    setSourceError(null);
    return true;
  }, [sourceType, selectedImage.length, selectedSnapshot.length]);

  const validateConfiguration = useCallback((): boolean => {
    setConfigSubmitted(true);
    if (sourceType === 'snapshot') {
      setVolumeTypeError(null);
      return true;
    }
    if (selectedVolumeType.length === 0) {
      setVolumeTypeError('Please select a volume type.');
      return false;
    }
    setVolumeTypeError(null);
    return true;
  }, [sourceType, selectedVolumeType.length]);

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

  const imageColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'version', header: 'Version', width: 100 },
    { key: 'size', header: 'Size', width: 120 },
    { key: 'minDisk', header: 'Min disk', width: 120 },
    { key: 'minRAM', header: 'Min RAM', width: 100 },
    { key: 'visibility', header: 'Visibility', width: 100 },
  ];

  const snapshotColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'volumeType', header: 'Volume type', width: 120 },
    { key: 'size', header: 'Size', width: 100 },
    { key: 'createdAt', header: 'Created at', width: 160 },
  ];

  const volumeTypeColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'isPublic', header: 'Public', width: 100 },
  ];

  const sourceTypeLabel =
    sourceType === 'blank' ? 'Blank volume' : sourceType === 'image' ? 'Image' : 'Volume snapshot';

  const selectedImageRow = mockImages.find((img) => img.id === String(selectedImage[0]));
  const selectedSnapshotRow = mockSnapshots.find((s) => s.id === String(selectedSnapshot[0]));
  const selectedVolumeTypeRow = mockVolumeTypes.find((v) => v.id === String(selectedVolumeType[0]));

  const resolvedVolumeTypeName =
    sourceType === 'snapshot'
      ? (selectedSnapshotRow?.volumeType ?? '_DEFAULT_')
      : (selectedVolumeTypeRow?.name ?? '-');

  const selectionErrorBorder = sourceSubmitted && sourceError;
  const volumeTypeSelectionErrorBorder = configSubmitted && volumeTypeError;

  return (
    <CreateLayout
      title="Create volume"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Source', status: stepStatuses.source },
                { label: 'Configuration', status: stepStatuses.config },
              ],
            },
          ]}
          onCancel={() => navigate('/compute/volumes')}
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
            onComplete: validateBasicInfo,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Volume name <span className="text-error">*</span>
                      </span>
                    </div>
                    <Input
                      placeholder="Enter volume name"
                      value={volumeName}
                      onChange={(e) => {
                        setVolumeName(e.target.value);
                        setBasicSubmitted(false);
                      }}
                      error={!!volumeNameError}
                    />
                    {volumeNameError && (
                      <span className="text-11 text-error">{volumeNameError}</span>
                    )}
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_), and the length
                      must be between 2-64 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Description</span>
                    </div>
                    <Input
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_()), and maximum
                      255 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        AZ (Availability zone) <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select the availability zone for the volume.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={availabilityZone}
                      onChange={(v) => {
                        setAvailabilityZone(String(v));
                        setBasicSubmitted(false);
                      }}
                      placeholder="Select AZ"
                    >
                      {azOptions.map((opt) => (
                        <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </Dropdown.Select>
                    {azError && <span className="text-11 text-error">{azError}</span>}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Volume name</span>
                  <span className="text-12 text-text">{volumeName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">AZ</span>
                  <span className="text-12 text-text">{availabilityZone || '-'}</span>
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
            id: 'source' as const,
            label: 'Source',
            onComplete: validateSource,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Volume source type <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select the source for the new volume. You can create a blank volume or
                        generate a volume from an image or an existing volume.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="volumeSourceType"
                        value="blank"
                        label="Blank volume"
                        checked={sourceType === 'blank'}
                        onChange={() => {
                          setSourceType('blank');
                          setSelectedImage([]);
                          setSelectedSnapshot([]);
                          setSourceError(null);
                          setSourceSubmitted(false);
                        }}
                      />
                      <RadioButton
                        name="volumeSourceType"
                        value="image"
                        label="Image"
                        checked={sourceType === 'image'}
                        onChange={() => {
                          setSourceType('image');
                          setSelectedImage([]);
                          setSelectedSnapshot([]);
                          setSourceError(null);
                          setSourceSubmitted(false);
                        }}
                      />
                      <RadioButton
                        name="volumeSourceType"
                        value="snapshot"
                        label="Volume snapshot"
                        checked={sourceType === 'snapshot'}
                        onChange={() => {
                          setSourceType('snapshot');
                          setSelectedImage([]);
                          setSelectedSnapshot([]);
                          setSourceError(null);
                          setSourceSubmitted(false);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {sourceType === 'image' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <span className="text-13 font-medium italic text-text">Image</span>

                        <div className="inline-flex w-fit rounded-md border border-border bg-surface-subtle p-1">
                          {OS_TABS.map((tab) => {
                            const isSelected = imageOsFilter === tab.id;
                            const Icon = tab.icon;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setImageOsFilter(tab.id);
                                  setImagePage(1);
                                }}
                                className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-2 text-12 font-medium transition-colors ${
                                  isSelected
                                    ? 'bg-surface-default text-primary shadow-sm'
                                    : 'bg-transparent text-text hover:bg-surface-default'
                                }`}
                              >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        <FilterSearchInput
                          filterKeys={imageFilterKeys}
                          onFilterAdd={handleImageFilterAdd}
                          selectedFilters={imageFilters}
                          placeholder="Search images by attributes"
                          defaultFilterKey="name"
                        />

                        <Pagination
                          totalCount={filteredImages.length}
                          size={itemsPerPage}
                          currentAt={imagePage}
                          onPageChange={setImagePage}
                          totalCountLabel="images"
                          selectedCount={selectedImage.length}
                        />

                        <SelectableTable<ImageRow>
                          columns={imageColumns}
                          rows={paginatedImages}
                          selectionType="radio"
                          selectedRows={selectedImage}
                          onRowSelectionChange={(ids) => {
                            setSelectedImage(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="volume-source-image"
                        >
                          {paginatedImages.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={imageColumns[0]}>
                                <StatusIndicator
                                  variant={imageStatusVariant(row.status)}
                                  layout="iconOnly"
                                />
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[1]}>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[2]}>
                                {row.version}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[3]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[4]}>
                                {row.minDisk}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[5]}>
                                {row.minRAM}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[6]}>
                                {row.visibility}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>

                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${
                            selectionErrorBorder
                              ? 'border-danger bg-danger-light'
                              : 'border-border bg-surface-muted'
                          }`}
                        >
                          {selectedImage.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {sourceError || 'No image selected'}
                            </span>
                          ) : (
                            selectedImage.map((id) => {
                              const img = mockImages.find((i) => i.id === String(id));
                              return (
                                <Tag
                                  key={String(id)}
                                  label={img?.name ?? String(id)}
                                  variant="multiSelect"
                                  onClose={() => {
                                    setSelectedImage(selectedImage.filter((x) => x !== id));
                                    setSourceError(null);
                                  }}
                                />
                              );
                            })
                          )}
                        </div>
                        {selectionErrorBorder && selectedImage.length > 0 && (
                          <span className="text-11 text-error">{sourceError}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {sourceType === 'snapshot' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <span className="text-13 font-medium italic text-text">
                          Volume snapshot
                        </span>

                        <FilterSearchInput
                          filterKeys={snapshotFilterKeys}
                          onFilterAdd={handleSnapshotFilterAdd}
                          selectedFilters={snapshotFilters}
                          placeholder="Search snapshots by attributes"
                          defaultFilterKey="name"
                        />

                        <Pagination
                          totalCount={filteredSnapshots.length}
                          size={itemsPerPage}
                          currentAt={snapshotPage}
                          onPageChange={setSnapshotPage}
                          totalCountLabel="snapshots"
                          selectedCount={selectedSnapshot.length}
                        />

                        <SelectableTable<SnapshotRow>
                          columns={snapshotColumns}
                          rows={paginatedSnapshots}
                          selectionType="radio"
                          selectedRows={selectedSnapshot}
                          onRowSelectionChange={(ids) => {
                            setSelectedSnapshot(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="volume-source-snapshot"
                        >
                          {paginatedSnapshots.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={snapshotColumns[0]}>
                                <StatusIndicator
                                  variant={snapshotStatusVariant(row.status)}
                                  layout="iconOnly"
                                />
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[1]}>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                    {row.status === 'error' && (
                                      <IconAlertCircle size={14} className="text-error" />
                                    )}
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[2]}>
                                {row.volumeType}
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[3]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[4]}>
                                {formatSnapshotCreatedAt(row.createdAt)}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>

                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${
                            selectionErrorBorder
                              ? 'border-danger bg-danger-light'
                              : 'border-border bg-surface-muted'
                          }`}
                        >
                          {selectedSnapshot.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {sourceError || 'No snapshot selected'}
                            </span>
                          ) : (
                            (() => {
                              const snap = mockSnapshots.find(
                                (s) => s.id === String(selectedSnapshot[0])
                              );
                              return (
                                <Tag
                                  label={snap?.name ?? String(selectedSnapshot[0])}
                                  variant="multiSelect"
                                  onClose={() => {
                                    setSelectedSnapshot([]);
                                    setSourceError(null);
                                  }}
                                />
                              );
                            })()
                          )}
                        </div>
                        {selectionErrorBorder && selectedSnapshot.length > 0 && (
                          <span className="text-11 text-error">{sourceError}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Source type</span>
                  <span className="text-12 text-text">{sourceTypeLabel}</span>
                </div>
                {sourceType === 'image' && selectedImageRow && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Image</span>
                      <span className="text-12 text-text">{selectedImageRow.name}</span>
                    </div>
                  </>
                )}
                {sourceType === 'snapshot' && selectedSnapshotRow && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Snapshot</span>
                      <span className="text-12 text-text">{selectedSnapshotRow.name}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'config' as const,
            label: 'Configuration',
            onComplete: validateConfiguration,
            editUI: (
              <div className="flex flex-col gap-0">
                {sourceType === 'snapshot' ? (
                  <>
                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium italic text-text">
                          Volume snapshot
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            Volume type <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Automatically set to the volume type of the source volume used to create
                            the snapshot.
                          </span>
                        </div>
                        <div className="flex h-8 w-full items-center rounded-lg bg-surface-subtle px-4">
                          <span className="text-12 text-text">
                            {selectedSnapshot.length > 0
                              ? (mockSnapshots.find((s) => s.id === String(selectedSnapshot[0]))
                                  ?.volumeType ?? '_DEFAULT_')
                              : '_DEFAULT_'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            Volume type capacity <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Defines the size of the volume. Depending on the selected source, a
                            minimum required size may apply.
                          </span>
                        </div>
                        <div className="flex max-w-[312px] items-center gap-3">
                          <input
                            type="range"
                            min={1}
                            max={capacityMax}
                            step={capacityStep}
                            value={Math.min(volumeCapacity, capacityMax)}
                            onChange={(e) => setVolumeCapacity(Number(e.target.value))}
                            className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-surface-muted accent-primary"
                          />
                          <NumberInput
                            min={1}
                            max={capacityMax}
                            step={1}
                            value={volumeCapacity}
                            onChange={(v) => setVolumeCapacity(v)}
                            suffix="GiB"
                          />
                        </div>
                        <span className="text-11 text-text-subtle">{capacityHelper}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium italic text-text">
                          Blank source or image
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            Volume type <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Select the volume type that determines performance characteristics for
                            the volume.
                          </span>
                        </div>

                        <FilterSearchInput
                          filterKeys={volumeTypeFilterKeys}
                          onFilterAdd={handleVolumeTypeFilterAdd}
                          selectedFilters={volumeTypeFilters}
                          placeholder="Search volume types by attributes"
                          defaultFilterKey="name"
                        />

                        <Pagination
                          totalCount={filteredVolumeTypes.length}
                          size={itemsPerPage}
                          currentAt={volumeTypePage}
                          onPageChange={setVolumeTypePage}
                          totalCountLabel="volume types"
                          selectedCount={selectedVolumeType.length}
                        />

                        <SelectableTable<VolumeTypeRow>
                          columns={volumeTypeColumns}
                          rows={paginatedVolumeTypes}
                          selectionType="radio"
                          selectedRows={selectedVolumeType}
                          onRowSelectionChange={(ids) => {
                            setSelectedVolumeType(ids);
                            setVolumeTypeError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="volume-type-select"
                        >
                          {paginatedVolumeTypes.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={volumeTypeColumns[0]}>
                                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                  {row.name}
                                  <IconExternalLink size={12} />
                                </span>
                              </Table.Td>
                              <Table.Td rowData={row} column={volumeTypeColumns[1]}>
                                {row.description}
                              </Table.Td>
                              <Table.Td rowData={row} column={volumeTypeColumns[2]}>
                                {row.isPublic}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>

                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${
                            volumeTypeSelectionErrorBorder
                              ? 'border-danger bg-danger-light'
                              : 'border-border bg-surface-muted'
                          }`}
                        >
                          {selectedVolumeType.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {volumeTypeError || 'No volume type selected'}
                            </span>
                          ) : (
                            (() => {
                              const vt = mockVolumeTypes.find(
                                (v) => v.id === String(selectedVolumeType[0])
                              );
                              return (
                                <Tag
                                  label={vt?.name ?? String(selectedVolumeType[0])}
                                  variant="multiSelect"
                                  onClose={() => {
                                    setSelectedVolumeType([]);
                                    setVolumeTypeError(null);
                                  }}
                                />
                              );
                            })()
                          )}
                        </div>
                        {volumeTypeSelectionErrorBorder && selectedVolumeType.length > 0 && (
                          <span className="text-11 text-error">{volumeTypeError}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            Volume type capacity <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Defines the size of the volume. Depending on the selected source, a
                            minimum required size may apply.
                          </span>
                        </div>
                        <div className="flex max-w-[312px] items-center gap-3">
                          <input
                            type="range"
                            min={1}
                            max={capacityMax}
                            step={capacityStep}
                            value={Math.min(volumeCapacity, capacityMax)}
                            onChange={(e) => setVolumeCapacity(Number(e.target.value))}
                            className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-surface-muted accent-primary"
                          />
                          <NumberInput
                            min={1}
                            max={capacityMax}
                            step={1}
                            value={volumeCapacity}
                            onChange={(v) => setVolumeCapacity(v)}
                            suffix="GiB"
                          />
                        </div>
                        <span className="text-11 text-text-subtle">{capacityHelper}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Volume type</span>
                  <span className="text-12 text-text">{resolvedVolumeTypeName}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Capacity</span>
                  <span className="text-12 text-text">{volumeCapacity} GiB</span>
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
            navigate('/compute/volumes');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create volume',
            subtitle: 'This is UI-only. No actual volume will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default ComputeCreateVolumePage;
