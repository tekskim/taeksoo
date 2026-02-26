import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  SearchInput,
  Tabs,
  TabList,
  Tab,
  Radio,
  Table,
  Pagination,
  SectionCard,
  VStack,
  HStack,
  WizardSummary,
  WizardSectionStatusIcon,
  PreSection,
  WritingSection,
  SkippedSection,
  DoneSection,
  DoneSectionRow,
  StatusIndicator,
  SelectionIndicator,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { Label } from './HelperComponents';
import { IconDots } from '@tabler/icons-react';
import { IconUbuntu, IconRocky, IconGrid } from '@/design-system';

/* ----------------------------------------
   OpenSection Demo Component (Basic Form)
   ---------------------------------------- */

function OpenSectionDemo() {
  const [instanceName, setInstanceName] = useState('');
  const [instanceNameError, setInstanceNameError] = useState<string | null>(null);

  const handleNextClick = () => {
    if (!instanceName.trim()) {
      setInstanceNameError('Instance name is required.');
      return;
    }
    setInstanceNameError(null);
    console.log('Next clicked - instance name:', instanceName);
  };

  const handleInstanceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstanceName(e.target.value);
    if (instanceNameError && e.target.value.trim()) {
      setInstanceNameError(null);
    }
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header title="Basic information" showDivider={false} />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Instance name */}
          <VStack gap={2} className="py-6">
            <label className="text-label-lg text-[var(--color-text-default)]">
              Instance name <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </label>
            <VStack gap={2}>
              <Input
                placeholder="Enter instance name"
                fullWidth
                value={instanceName}
                onChange={handleInstanceNameChange}
                error={!!instanceNameError}
              />
              {instanceNameError && (
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  {instanceNameError}
                </span>
              )}
            </VStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              You can use letters, numbers, and special characters (+=.@-_).
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* AZ (Availability zone) */}
          <VStack gap={2} className="py-6">
            <label className="text-label-lg text-[var(--color-text-default)]">
              AZ (Availability zone){' '}
              <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </label>
            <Select
              options={[
                { value: 'nova', label: 'nova (Default)' },
                { value: 'az-1', label: 'az-1' },
                { value: 'az-2', label: 'az-2' },
              ]}
              value="nova"
              onChange={() => {}}
              placeholder="Select AZ"
              fullWidth
            />
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Select the availability zone for the instance.
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button */}
          <HStack justify="end" className="pt-3">
            <Button variant="primary" onClick={handleNextClick}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   OpenSection Table Demo Component
   ---------------------------------------- */

interface DemoImageRow {
  id: string;
  status: 'active' | 'building' | 'error';
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  access: string;
  os: 'ubuntu' | 'windows' | 'rocky' | 'other';
}

const demoImages: DemoImageRow[] = [
  {
    id: 'e920j10d',
    status: 'active',
    name: 'ubuntu-22.04-tk-base',
    version: '22.04',
    size: '709.98 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j20d',
    status: 'active',
    name: 'ubuntu-20.04-tk-base',
    version: '20.04',
    size: '650.00 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j30d',
    status: 'active',
    name: 'windows-server-2022',
    version: '2022',
    size: '4.5 GiB',
    minDisk: '40.00 GiB',
    minRam: '4 GiB',
    access: 'Public',
    os: 'windows',
  },
  {
    id: 'e920j40d',
    status: 'active',
    name: 'rocky-8.9-tk-base',
    version: '8.9',
    size: '850.11 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'rocky',
  },
  {
    id: 'e920j50d',
    status: 'building',
    name: 'centos-stream-9',
    version: '9',
    size: '920.00 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'other',
  },
];

function OpenSectionTableDemo() {
  const [sourceTab, setSourceTab] = useState<'image' | 'snapshot' | 'volume'>('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const filteredImages = demoImages.filter((img) => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch =
      searchQuery === '' || img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const selectedImage = demoImages.find((img) => img.id === selectedImageId);

  const handleImageSelect = (id: string) => {
    setSelectedImageId(id);
    setSourceError(null);
  };

  const handleNextClick = () => {
    if (!selectedImageId) {
      setSourceError('Please select a start source.');
      return;
    }
    setSourceError(null);
    console.log('Next clicked - selected:', selectedImageId);
  };

  const imageColumns = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      render: (_: unknown, row: DemoImageRow) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => handleImageSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_: unknown, row: DemoImageRow) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: columnMinWidths.name,
      render: (value: string, row: DemoImageRow) => (
        <VStack gap={0}>
          <span className="text-[var(--color-action-primary)] text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium">
            {value}
          </span>
          <span className="text-[11px] text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'size', label: 'Size', sortable: true, align: 'right' as const },
    { key: 'minDisk', label: 'Min disk', sortable: true, align: 'right' as const },
    { key: 'access', label: 'Visibility', sortable: true },
  ];

  return (
    <div className="w-[840px]">
      <SectionCard isActive>
        <SectionCard.Header title="Source" showDivider={false} />
        <SectionCard.Content showDividers={false}>
          <VStack gap={0}>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />

            <VStack gap={2} className="py-6">
              <label className="text-label-lg text-[var(--color-text-default)]">
                Start source<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </label>
              <span className="text-body-md text-[var(--color-text-subtle)] mb-2">
                Select a template to launch the instance. You can start from an OS image, a
                snapshot, or an existing volume.
              </span>

              <Tabs
                value={sourceTab}
                onChange={(v) => setSourceTab(v as 'image' | 'snapshot' | 'volume')}
                variant="underline"
                size="sm"
              >
                <TabList>
                  <Tab value="image">Image</Tab>
                  <Tab value="snapshot">Instance snapshot</Tab>
                  <Tab value="volume">Bootable volume</Tab>
                </TabList>
              </Tabs>

              {sourceTab === 'image' && (
                <div className="mt-2">
                  <div className="inline-flex gap-1 p-1 bg-[var(--color-surface-subtle)] shadow-[inset_0_0_0_1px_var(--color-border-default)] rounded-[8px] w-fit">
                    {(['other', 'ubuntu', 'windows', 'rocky'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setOsFilter(filter);
                          setCurrentPage(1);
                        }}
                        className={`
                        flex items-center gap-1 px-[10px] py-[6px] rounded-[6px] text-[12px] font-medium leading-5 text-center transition-all
                        ${
                          osFilter === filter
                            ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
                            : 'bg-transparent text-[var(--color-text-default)]'
                        }
                      `}
                      >
                        {filter === 'other' && <IconDots size={14} />}
                        {filter === 'ubuntu' && <IconUbuntu size={14} />}
                        {filter === 'windows' && <IconGrid size={14} />}
                        {filter === 'rocky' && <IconRocky size={14} />}
                        {filter === 'other'
                          ? 'Others'
                          : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <SearchInput
                placeholder="Search image by attributes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                size="sm"
                className="w-[var(--search-input-width)] mt-2"
              />

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredImages.length / 5) || 1}
                totalItems={filteredImages.length}
                onPageChange={setCurrentPage}
              />

              <VStack gap={2}>
                <div className="w-[806px]">
                  <Table
                    columns={imageColumns}
                    data={filteredImages}
                    rowKey="id"
                    onRowClick={(row) => handleImageSelect(row.id)}
                  />
                </div>

                <SelectionIndicator
                  selectedItems={
                    selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                  }
                  onRemove={() => setSelectedImageId(null)}
                  error={!!sourceError}
                  errorMessage={sourceError || undefined}
                />
              </VStack>
            </VStack>

            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" className="pt-3">
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </HStack>
          </VStack>
        </SectionCard.Content>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------
   Wizard Pattern Section
   ---------------------------------------- */

export function WizardPatternSection() {
  const [sectionStatus, setSectionStatus] = useState<Record<string, WizardSectionState>>({
    'launch-type': 'done',
    'basic-info': 'active',
    source: 'writing',
    flavor: 'pre',
    network: 'pre',
    advanced: 'skipped',
  });

  const summaryItems: WizardSummaryItem[] = [
    { key: 'launch-type', label: 'Launch type', status: sectionStatus['launch-type'] },
    { key: 'basic-info', label: 'Basic information', status: sectionStatus['basic-info'] },
    { key: 'source', label: 'Source', status: sectionStatus['source'] },
    { key: 'flavor', label: 'Flavor', status: sectionStatus['flavor'] },
    { key: 'network', label: 'Network', status: sectionStatus['network'] },
    { key: 'advanced', label: 'Advanced', status: sectionStatus['advanced'] },
  ];

  const handleStatusChange = (key: string, status: WizardSectionState) => {
    setSectionStatus((prev) => ({ ...prev, [key]: status }));
  };

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <Label>1. 개요</Label>
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                하나의 리소스를 생성하기 위한 필수 입력값이 많을 경우, 단계를 나눠 사용자가 입력값을
                놓치지 않고 리소스를 생성할 수 있도록 하는 UX 패턴입니다.
              </p>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">레이아웃</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Create Resource(자원 생성) 페이지는 <strong>Two columns layout</strong>으로
                구성됩니다. 왼쪽에는 &apos;Input card&apos;가 배치되고 오른쪽에는 &apos;Floating
                card&apos;가 배치됩니다.
              </p>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>사용자가 길고 복잡한 리소스 구성을 하는 리소스 생성에 사용을 권장합니다.</li>
                <li>
                  <strong>필수 입력이 5개의 항목을 초과하는 경우</strong> 적용합니다.
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>2. 구성요소</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
              입력 카드 (Input Card)
            </h4>
            <p className="text-body-sm text-[var(--color-text-muted)]">
              각 단계별 입력 필드를 포함하는 카드. 6가지 상태(미작성, 입력 중, 시작, 수정, 완료,
              자동 입력)를 가집니다.
            </p>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">Floating Card</h4>
            <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
              Create/Edit 페이지에서 고정된 위치로 표시 (기본 position: <code>top-left</code>,
              스크롤 시에도 sticky 유지)
            </p>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
              <li>
                <strong>Summary</strong> — 단계명 및 단계별 상태
              </li>
              <li>
                <strong>쿼터 정보</strong>(선택) — 생성 가능한 리소스의 잔여량, 진행률 바 표기
              </li>
              <li>
                <strong>Cancel</strong> — 클릭 시 이전 화면으로 이동
              </li>
              <li>
                <strong>Create</strong> — 모든 입력 카드가 요약 상태가 되면 활성화
              </li>
            </ul>
          </div>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>3. Input card 상태 정책</Label>
        <p className="text-body-md text-[var(--color-text-muted)]">
          각 단계 카드는 다음 6가지 상태 중 하나를 가집니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  상태
                </th>
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  표시
                </th>
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  설명
                </th>
                <th className="text-left font-medium text-[var(--color-text-subtle)]">
                  Footer 버튼
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  1) 미작성 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">접힘</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  사용자가 아직 해당 단계에 한 번도 진입하지 않은 상태. 카드 헤더만 보이며, 이전
                  단계가 완료되기 전까지 열리지 않음.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  2) 입력 중 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">접힘</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  작성 중이던 카드가, 다른 카드를 편집하기 위해 이동하면서 닫힌 상태. &apos;작성
                  중&apos; 표시. 입력값은 자동 저장.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  3) 시작 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">열림</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  처음 해당 단계에 진입해 값을 입력하는 상태. 필드 전체 활성화.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Next / Skip(선택)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  4) 수정 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">열림</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  이미 완료된 단계를 다시 열어 수정하는 상태. 필드 전체 활성화, 기존 입력값 유지.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Cancel / Done</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  5) 완료 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">요약</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  필수 입력이 완료된 단계. Summary가 표시되며 Edit 버튼 제공. 스킵 시 Summary 생략.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Edit</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  6) 자동 입력 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">요약</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  자동 입력값이 설정되었거나, 필수 입력이 없는 고급(advanced) 단계.
                  &apos;Auto-filled&apos; 표시. Edit 버튼 제공.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Edit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>4. 단계 진행 플로우 정책</Label>
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">기본 정책</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  생성 플로우는 <strong>순차적 진행</strong>을 기본으로 한다.
                </li>
                <li>사용자는 1단계부터 순서대로 진행하며, 한 번에 하나의 단계만 열린다.</li>
                <li>단계 간 이동 시 입력값은 항상 보존된다.</li>
                <li>입력 중에 다른 카드를 수정하더라도, 입력 중인 값은 보존된다.</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                이전 단계 수정(Edit) 시 이동 규칙
              </h4>
              <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>현재 단계는 닫힘 상태(입력 중 카드)로 전환</li>
                <li>수정 단계만 열림 상태(수정 카드)로 전환</li>
                <li>수정 단계 완료 후 요약 상태(완료 카드)로 전환</li>
                <li>수정 이전의 단계로 복귀 — 열림 상태(시작 카드)로 전환, 입력값 유지</li>
              </ol>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                <span className="text-[var(--color-state-danger)]">(예외)</span> 수정이 다른 단계에
                영향을 주는 경우
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                종속성이 있는 단계의 입력값이 리셋되고, 해당 단계는 열림 상태(시작 카드)로
                전환됩니다.
              </p>
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                  시나리오 예시: 5단계 작성 중 2단계를 수정, 3단계에 종속성 영향
                </p>
                <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-mono leading-relaxed">{`Step 5 작성 중 → Step 2 Edit 클릭
  Step 5 → 닫힘 (입력 중 카드)
  Step 2 → 열림 (수정 카드)
Step 2 Done 클릭
  Step 2 → 요약 (완료 카드)
  Step 3 → 종속성 영향으로 일부 값 Reset
  Step 3 → 열림 (시작 카드, 리셋된 항목 제외 기존값 유지)
Step 3 Next 클릭
  Step 3 → 요약 (완료 카드)
  Step 5 → 열림 (시작 카드, 기존 입력값 유지)`}</pre>
              </div>
            </VStack>
          </VStack>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>5. 인터랙션 정책</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">기본 원칙</h4>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>순차적 진행</strong> — 1단계부터 순서대로, 한 번에 하나의 단계만 활성화
              </li>
              <li>
                <strong>상태 시각화</strong> — 각 카드의 현재 상태를 명확하게 표시
              </li>
              <li>
                <strong>입력값 보존</strong> — 단계 간 이동 시 입력값을 항상 보존하여 데이터 손실
                방지
              </li>
              <li>
                <strong>명확한 액션</strong> — 다음 단계 진행, 수정, 취소 등 명확한 피드백 제공
              </li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
              주요 인터랙션 요소
            </h4>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>Next</strong> — 현재 단계를 완료하고 다음 단계로 진행
              </li>
              <li>
                <strong>Skip</strong> — 현재 단계를 건너뛰고 다음 단계로 진행
              </li>
              <li>
                <strong>Edit</strong> — 완료된 단계를 다시 수정
              </li>
              <li>
                <strong>Done</strong> — 수정을 완료하고 요약 상태로 전환
              </li>
              <li>
                <strong>Cancel</strong> — 수정을 취소하고 이전 상태로 복귀
              </li>
            </ul>
          </div>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>Section States (WizardSectionState)</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>
            &apos;pre&apos; | &apos;active&apos; | &apos;done&apos; | &apos;skipped&apos; |
            &apos;writing&apos;
          </code>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>Wizard section status icon</Label>
        <HStack gap={6}>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="pre" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              pre (대기)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="active" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              active (진행 중)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="done" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              done (완료)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="skipped" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              skipped (건너뜀)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="writing" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              writing (작성 중)
            </span>
          </HStack>
        </HStack>
      </VStack>

      <VStack gap={3}>
        <Label>Wizard summary</Label>
        <div className="w-[var(--wizard-summary-width)]">
          <WizardSummary
            title="Summary"
            items={summaryItems}
            onItemClick={(key) => console.log('Clicked:', key)}
          />
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>Section components</Label>
        <VStack gap={4} className="max-w-[600px]">
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              PreSection (대기 중)
            </span>
            <PreSection title="Source" />
          </VStack>

          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              WritingSection (작성 중)
            </span>
            <WritingSection title="Source" />
          </VStack>

          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              SkippedSection (건너뜀)
            </span>
            <SkippedSection title="Advanced" onEdit={() => console.log('Edit clicked')} />
          </VStack>

          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              DoneSection (완료)
            </span>
            <DoneSection title="Basic information" onEdit={() => console.log('Edit clicked')}>
              <DoneSectionRow label="Instance name" value="my-instance-01" />
              <DoneSectionRow label="AZ" value="nova (Default)" />
              <DoneSectionRow label="Description" value="Test instance for development" />
            </DoneSection>
          </VStack>

          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              OpenSection (열림/활성)
            </span>
            <OpenSectionDemo />
          </VStack>
        </VStack>

        <VStack gap={1}>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            OpenSection-Table (테이블 선택)
          </span>
          <OpenSectionTableDemo />
        </VStack>
      </VStack>

      <VStack gap={3}>
        <Label>Interactive demo</Label>
        <HStack gap={4} align="start">
          <VStack gap={2} className="w-[200px]">
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              Change Status:
            </span>
            {Object.keys(sectionStatus).map((key) => (
              <HStack key={key} gap={2} align="center" className="w-full">
                <span className="text-[length:var(--font-size-11)] w-[100px] truncate">{key}</span>
                <Select
                  size="sm"
                  value={sectionStatus[key]}
                  onChange={(value) => handleStatusChange(key, value as WizardSectionState)}
                  options={[
                    { value: 'pre', label: 'pre' },
                    { value: 'active', label: 'active' },
                    { value: 'done', label: 'done' },
                    { value: 'skipped', label: 'skipped' },
                    { value: 'writing', label: 'writing' },
                  ]}
                  fullWidth
                />
              </HStack>
            ))}
          </VStack>

          <div className="w-[var(--wizard-summary-width)]">
            <WizardSummary title="Summary" items={summaryItems} />
          </div>
        </HStack>
      </VStack>
    </VStack>
  );
}
