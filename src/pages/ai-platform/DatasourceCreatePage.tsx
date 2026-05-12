import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  SectionCard,
  VStack,
  HStack,
  Drawer,
  Checkbox,
  RadioGroup,
  Radio,
  Badge,
  Chip,
  SearchInput,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconUpload, IconTrash, IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type DataType = 'file' | 'gcs' | 'postgres';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

interface SearchResultItem {
  id: string;
  primaryBadges: string[];
  neutralBadges: string[];
  snippet: string;
  footer?: string;
  showViewMore?: boolean;
}

interface ChunkPreviewItem {
  id: string;
  typeLabel: string;
  chars: string;
  tokens: string;
  body: string;
  chunkId: string;
}

const DATA_TYPE_OPTIONS = [
  { value: 'file', label: 'File upload' },
  { value: 'gcs', label: 'Google cloud storage' },
  { value: 'postgres', label: 'PostgreSQL' },
] as const;

const CHUNKING_OPTIONS = [
  { value: 'recursive', label: 'Recursive character chunking' },
  { value: 'structure', label: 'Structure-based chunking' },
  { value: 'semantic', label: 'Semantic-based chunking' },
];

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST, UTC+9)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (ET)' },
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const v = String(i).padStart(2, '0');
  return { value: v, label: v };
});

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const v = String(i).padStart(2, '0');
  return { value: v, label: v };
});

const MOCK_SEARCH_A: SearchResultItem[] = [
  {
    id: '1',
    primaryBadges: ['Score: 0.3946'],
    neutralBadges: ['Chunk #5', '512 chars', '128 tokens', 'text'],
    snippet:
      'erved Font Name Pretendard. This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is copied below, and is also available with a FAQ at: https://scripts.sil.org/OFL----------------------------------------------------------- SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007 ----------------------------------------------------------- PREAMBLE The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others. ',
    footer:
      'Document ID: 974f3af8-6db7-4d23-8d5f-5a89451f122a | Chunk ID: 96d0c554-ed53-480c-95e7-5121371b30ab',
    showViewMore: true,
  },
  {
    id: '2',
    primaryBadges: ['Document'],
    neutralBadges: ['1024 chars', '256 tokens'],
    snippet:
      'Copyright (c) 2023, John Smith (https://example.com/docs), licensed under Creative Commons Attribution 4.0 International License. This document can be shared and adapted with appropriate credit, available at: https://creativecommons.org/licenses/by/4.0/',
    footer: 'Chunk ID : doc4567g-89h0-i1j2-34k5-6789lmnop',
    showViewMore: true,
  },
  {
    id: '3',
    primaryBadges: ['Video'],
    neutralBadges: ['2048 chars', '512 tokens'],
    snippet:
      'The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.',
    footer: 'Chunk ID : vid7890q-12r3-s45t-67u8-90vwx1234',
    showViewMore: true,
  },
];

/** Drawer 2001:6670 — first card omits “view more”; footer directly under snippet */
const MOCK_SEARCH_B: SearchResultItem[] = [
  {
    id: '1',
    primaryBadges: ['Score: 0.3946'],
    neutralBadges: ['Chunk #5', '512 chars', '128 tokens', 'text'],
    snippet:
      'erved Font Name Pretendard. This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is copied below, and is also available with a FAQ at: https://scripts.sil.org/OFL----------------------------------------------------------- SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007 ----------------------------------------------------------- PREAMBLE The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others. The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.',
    footer:
      'Document ID: 974f3af8-6db7-4d23-8d5f-5a89451f122a | Chunk ID: 96d0c554-ed53-480c-95e7-5121371b30ab',
    showViewMore: false,
  },
  ...MOCK_SEARCH_A.slice(1),
];

const MOCK_CHUNKS: ChunkPreviewItem[] = [
  {
    id: 'c1',
    typeLabel: 'Video',
    chars: '2048 chars',
    tokens: '512 tokens',
    body: 'Copyright (c) 2023, Alice Johnson (https://example.com/videos), all rights reserved. The terms of use for this video content are defined in the terms and conditions found at: https://example.com/terms',
    chunkId: 'vid7890q-12r3-s45t-67u8-90vwx1234',
  },
  {
    id: 'c2',
    typeLabel: 'Image',
    chars: '512 chars',
    tokens: '128 tokens',
    body: 'The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.',
    chunkId: 'img1234a-56b7-c8d9-01e2-34fg567h89',
  },
  {
    id: 'c3',
    typeLabel: 'Image',
    chars: '512 chars',
    tokens: '128 tokens',
    body: 'The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.',
    chunkId: 'img1234a-56b7-c8d9-01e2-34fg567h89',
  },
  {
    id: 'c4',
    typeLabel: 'Image',
    chars: '512 chars',
    tokens: '128 tokens',
    body: 'The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.',
    chunkId: 'img1234a-56b7-c8d9-01e2-34fg567h89',
  },
];

function SearchResultsList({ items }: { items: SearchResultItem[] }) {
  return (
    <VStack gap={3} className="w-full">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 flex flex-col gap-5"
        >
          <HStack gap={1} className="flex-wrap">
            {item.primaryBadges.map((t, i) => (
              <Badge key={`${item.id}-p-${i}`} theme="green" size="sm">
                {t}
              </Badge>
            ))}
            {item.neutralBadges.map((t, i) => (
              <Badge key={`${item.id}-n-${i}`} theme="gray" size="sm">
                {t}
              </Badge>
            ))}
          </HStack>
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
            <p className="text-body-md text-[var(--color-text-default)] line-clamp-6">
              {item.snippet}
            </p>
          </div>
          {item.showViewMore ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              rightIcon={<IconChevronDown size={12} />}
            >
              view more
            </Button>
          ) : null}
          {item.footer ? (
            <p className="text-label-sm text-[var(--color-text-subtle)] whitespace-pre-wrap">
              {item.footer}
            </p>
          ) : null}
        </div>
      ))}
    </VStack>
  );
}

function ViewChunksList({ items }: { items: ChunkPreviewItem[] }) {
  return (
    <VStack gap={3} className="w-full">
      {items.map((c) => (
        <div
          key={c.id}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 flex flex-col gap-5"
        >
          <HStack gap={1} className="flex-wrap">
            <Badge theme="green" size="sm">
              {c.typeLabel}
            </Badge>
            <Badge theme="gray" size="sm">
              {c.chars}
            </Badge>
            <Badge theme="gray" size="sm">
              {c.tokens}
            </Badge>
          </HStack>
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-[var(--spacing-2-5)] py-2">
            <p className="text-body-md text-[var(--color-text-muted)]">{c.body}</p>
          </div>
          <p className="text-label-sm text-[var(--color-text-subtle)]">Chunk ID : {c.chunkId}</p>
        </div>
      ))}
    </VStack>
  );
}

export function DatasourceCreatePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [dataSourceName, setDataSourceName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2', 'Tag 3']);

  const [dataType, setDataType] = useState<DataType>('file');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: '1', name: '품의서_한민정_독감예방.pdf', size: '67.7 KB' },
    { id: '2', name: 'AI Platform_상품소개서.pdf', size: '2.5 MB' },
    { id: '3', name: '품의서_한민정_독감예방.pdf', size: '67.7 KB' },
    { id: '4', name: '품의서_한민정_독감예방.pdf', size: '67.7 KB' },
  ]);

  const [gcsBucket, setGcsBucket] = useState('');
  const [gcsPrefix, setGcsPrefix] = useState('');
  const [gcsJson, setGcsJson] = useState('');

  const [pgHost, setPgHost] = useState('');
  const [pgPort, setPgPort] = useState('5432');
  const [pgDatabase, setPgDatabase] = useState('');
  const [pgSchema, setPgSchema] = useState('');
  const [pgUser, setPgUser] = useState('');
  const [pgPassword, setPgPassword] = useState('');

  const [chunkingStrategy, setChunkingStrategy] = useState('recursive');
  const [syncMode, setSyncMode] = useState<'once' | 'scheduled'>('once');
  const [scheduleKind, setScheduleKind] = useState<'simple' | 'cron'>('simple');
  const [scheduleHour, setScheduleHour] = useState('00');
  const [scheduleMinute, setScheduleMinute] = useState('00');
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [cronExpression, setCronExpression] = useState('');

  const [drawerSearchMinimal, setDrawerSearchMinimal] = useState(false);
  const [drawerSearchA, setDrawerSearchA] = useState(false);
  const [drawerSearchB, setDrawerSearchB] = useState(false);
  const [drawerViewChunks, setDrawerViewChunks] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [hybridSearch, setHybridSearch] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPostgres = dataType === 'postgres';

  useEffect(() => {
    document.title = 'Create data source — THAKI Cloud';
    return () => {
      document.title = 'THAKI Cloud';
    };
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Create data source');
  }, [updateActiveTabLabel]);

  const toggleWeekday = useCallback((d: number) => {
    setWeekdays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }, []);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (!t || tags.length >= 10 || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setTagInput('');
  }, [tagInput, tags]);

  const removeTag = useCallback((t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  }, []);

  const onChooseFiles = useCallback(() => fileInputRef.current?.click(), []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    const next: UploadedFile[] = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      next.push({
        id: crypto.randomUUID(),
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
      });
    }
    setUploadedFiles((prev) => [...prev, ...next]);
    e.target.value = '';
  }, []);

  const dataSettingComplete = useMemo(() => {
    if (dataType === 'file') return uploadedFiles.length > 0;
    if (dataType === 'gcs') return Boolean(gcsBucket.trim() && gcsJson.trim());
    return Boolean(
      pgHost.trim() && pgPort.trim() && pgDatabase.trim() && pgUser.trim() && pgPassword.trim()
    );
  }, [
    dataType,
    uploadedFiles.length,
    gcsBucket,
    gcsJson,
    pgHost,
    pgPort,
    pgDatabase,
    pgUser,
    pgPassword,
  ]);

  const chunkingComplete = useMemo(() => {
    if (isPostgres) return true;
    return Boolean(chunkingStrategy);
  }, [isPostgres, chunkingStrategy]);

  const syncComplete = useMemo(() => {
    if (isPostgres) return true;
    if (syncMode === 'once') return true;
    if (scheduleKind === 'cron') return Boolean(cronExpression.trim());
    return Boolean(scheduleHour && scheduleMinute && timezone && weekdays.length > 0);
  }, [
    isPostgres,
    syncMode,
    scheduleKind,
    cronExpression,
    scheduleHour,
    scheduleMinute,
    timezone,
    weekdays.length,
  ]);

  const basicComplete = useMemo(() => dataSourceName.trim().length > 0, [dataSourceName]);

  const canCreate = basicComplete && dataSettingComplete && chunkingComplete && syncComplete;

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={false}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6} className="max-w-[1320px] mx-auto w-full">
        <h1 className="text-heading-h4 text-[var(--color-text-default)] w-full">
          Create data source
        </h1>

        <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
          <VStack gap={6} className="flex-1 min-w-0 w-full">
            <SectionCard>
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label={
                      <>
                        Data source name <span className="text-[var(--color-state-danger)]">*</span>
                      </>
                    }
                    required
                  >
                    <Input
                      placeholder="Enter a name for this data source"
                      value={dataSourceName}
                      onChange={(e) => setDataSourceName(e.target.value)}
                      fullWidth
                    />
                  </FormField>
                  <FormField label="Description">
                    <Textarea
                      placeholder="Add an description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      rows={4}
                    />
                  </FormField>
                  <FormField
                    label="Tag"
                    description="Tags help categorize and identify your resources"
                    helperText="Up to 10 tags allowed"
                  >
                    <VStack gap={2}>
                      <Input
                        placeholder="Enter tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        fullWidth
                      />
                      {tags.length > 0 ? (
                        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] py-2 pl-2 pr-4 w-full">
                          <HStack gap={1} className="flex-wrap">
                            {tags.map((t) => (
                              <Chip key={t} value={t} onRemove={() => removeTag(t)} />
                            ))}
                          </HStack>
                        </div>
                      ) : null}
                    </VStack>
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Data setting" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label={
                      <>
                        Data type <span className="text-[var(--color-state-danger)]">*</span>
                      </>
                    }
                    description="Select a type and complete the connection."
                    required
                  >
                    <Select
                      options={[...DATA_TYPE_OPTIONS]}
                      value={dataType}
                      onChange={(v) => setDataType(v as DataType)}
                      fullWidth
                    />
                  </FormField>

                  {dataType === 'file' ? (
                    <VStack gap={3}>
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Support : PDF, DOC, DOCX, TXT, MD, CSV (max 100MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={onFileChange}
                        accept=".pdf,.doc,.docx,.txt,.md,.csv"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconUpload size={12} />}
                        onClick={onChooseFiles}
                      >
                        Upload file
                      </Button>
                      {uploadedFiles.length > 0 ? (
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-3 w-full flex flex-col gap-2">
                          {uploadedFiles.map((f) => (
                            <div
                              key={f.id}
                              className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-2 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p
                                  className="text-body-md text-[var(--color-text-default)] truncate"
                                  title={f.name}
                                >
                                  {f.name}
                                </p>
                                <p className="text-label-sm text-[var(--color-text-subtle)]">
                                  {f.size}
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${f.name}`}
                                className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] shrink-0"
                                onClick={() =>
                                  setUploadedFiles((prev) => prev.filter((x) => x.id !== f.id))
                                }
                              >
                                <IconTrash
                                  size={16}
                                  stroke={1.5}
                                  className="text-[var(--color-text-muted)]"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </VStack>
                  ) : null}

                  {dataType === 'gcs' ? (
                    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-3 w-full flex flex-col gap-6">
                      <p className="text-heading-h5 text-[var(--color-text-default)]">
                        Database connection
                      </p>
                      <FormField
                        label={
                          <>
                            GCS bucket name{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the name of the Google Cloud Storage bucket to connect."
                        required
                      >
                        <Input
                          placeholder="e.g., my-bucket-name"
                          value={gcsBucket}
                          onChange={(e) => setGcsBucket(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label="Prefix (Folder path)"
                        description="Enter the folder path to sync. Leave empty to sync the entire bucket."
                        helperText="Leave empty to sync the entire bucket."
                      >
                        <Input
                          placeholder="e.g., documents/folder1"
                          value={gcsPrefix}
                          onChange={(e) => setGcsPrefix(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label={
                          <>
                            Service account JSON{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Paste the service account JSON key for GCS access."
                        helperText="Paste your GCS Service Account JSON credentials."
                        required
                      >
                        <Textarea
                          placeholder={`{"type": "service_account", "project_id": "...", ...}`}
                          value={gcsJson}
                          onChange={(e) => setGcsJson(e.target.value)}
                          fullWidth
                          rows={5}
                          className="font-mono text-body-md"
                        />
                      </FormField>
                      <Button variant="secondary" size="sm">
                        Test connection
                      </Button>
                    </div>
                  ) : null}

                  {dataType === 'postgres' ? (
                    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-3 w-full flex flex-col gap-6">
                      <p className="text-heading-h5 text-[var(--color-text-default)]">
                        Database connection
                      </p>
                      <FormField
                        label={
                          <>
                            Host <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the host address of the database server."
                        required
                      >
                        <Input
                          placeholder="localhost or postgres-food"
                          value={pgHost}
                          onChange={(e) => setPgHost(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label={
                          <>
                            Port <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the port number used by the database."
                        required
                      >
                        <Input
                          value={pgPort}
                          onChange={(e) => setPgPort(e.target.value)}
                          fullWidth
                          className="max-w-[120px]"
                        />
                      </FormField>
                      <FormField
                        label={
                          <>
                            Database name{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the name of the database to connect."
                        required
                      >
                        <Input
                          placeholder="my_database"
                          value={pgDatabase}
                          onChange={(e) => setPgDatabase(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label="Schema"
                        description="Enter the database schema to use."
                        helperText='Default is "public". Leave empty to use default.'
                      >
                        <Input
                          placeholder="Enter the database schema to use"
                          value={pgSchema}
                          onChange={(e) => setPgSchema(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label={
                          <>
                            Username <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the username for database access."
                        required
                      >
                        <Input
                          value={pgUser}
                          onChange={(e) => setPgUser(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <FormField
                        label={
                          <>
                            Password <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Enter the password for the user account."
                        helperText="Password will be encrypted before storage."
                        required
                      >
                        <Input
                          type="password"
                          value={pgPassword}
                          onChange={(e) => setPgPassword(e.target.value)}
                          fullWidth
                        />
                      </FormField>
                      <Button variant="secondary" size="sm">
                        Test connection
                      </Button>
                    </div>
                  ) : null}

                  {!isPostgres ? (
                    <>
                      <FormField
                        label={
                          <>
                            Chunking strategy{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Select how documents should be split into chunks."
                        required
                      >
                        <Select
                          options={CHUNKING_OPTIONS}
                          value={chunkingStrategy}
                          onChange={setChunkingStrategy}
                          fullWidth
                        />
                      </FormField>
                      <p className="text-body-md text-[var(--color-text-subtle)] -mt-4">
                        Split text by characters with overlap
                      </p>

                      <FormField
                        label={
                          <>
                            Sync setting <span className="text-[var(--color-state-danger)]">*</span>
                          </>
                        }
                        description="Select how and when data should be synced."
                        spacing="loose"
                        required
                      >
                        <RadioGroup
                          value={syncMode}
                          onChange={(v) => setSyncMode(v as 'once' | 'scheduled')}
                        >
                          <Radio value="once">One-time Sync (Sync Now)</Radio>
                          <Radio value="scheduled">Automatic Sync (Scheduled)</Radio>
                        </RadioGroup>
                      </FormField>

                      {syncMode === 'scheduled' ? (
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-3 w-full flex flex-col gap-6">
                          <p className="text-heading-h5 text-[var(--color-text-default)]">
                            Scheduled update
                          </p>
                          <FormField
                            label={
                              <>
                                Type <span className="text-[var(--color-state-danger)]">*</span>
                              </>
                            }
                            description="Select how the update schedule is configured."
                            spacing="loose"
                            required
                          >
                            <RadioGroup
                              value={scheduleKind}
                              onChange={(v) => setScheduleKind(v as 'simple' | 'cron')}
                            >
                              <Radio value="simple">Simple</Radio>
                              <Radio value="cron">Advanced (Cron)</Radio>
                            </RadioGroup>
                          </FormField>

                          {scheduleKind === 'simple' ? (
                            <>
                              <FormField
                                label={
                                  <>
                                    Time <span className="text-[var(--color-state-danger)]">*</span>
                                  </>
                                }
                                description="Specify the time when the update will run."
                                required
                              >
                                <HStack gap={2} align="center">
                                  <Select
                                    options={HOUR_OPTIONS}
                                    value={scheduleHour}
                                    onChange={setScheduleHour}
                                    className="w-[80px]"
                                  />
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    :
                                  </span>
                                  <Select
                                    options={MINUTE_OPTIONS}
                                    value={scheduleMinute}
                                    onChange={setScheduleMinute}
                                    className="w-[80px]"
                                  />
                                </HStack>
                              </FormField>
                              <FormField
                                label={
                                  <>
                                    Timezone{' '}
                                    <span className="text-[var(--color-state-danger)]">*</span>
                                  </>
                                }
                                description="Select the timezone used for the update schedule."
                                required
                              >
                                <Select
                                  options={TIMEZONE_OPTIONS}
                                  value={timezone}
                                  onChange={setTimezone}
                                  fullWidth
                                />
                              </FormField>
                              <FormField
                                label="Repeat on"
                                description="Select days for the schedule."
                                required
                              >
                                <HStack gap={1} className="flex-wrap">
                                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, idx) => {
                                    const selected = weekdays.includes(idx);
                                    return (
                                      <button
                                        key={`${label}-${idx}`}
                                        type="button"
                                        onClick={() => toggleWeekday(idx)}
                                        className={`size-8 rounded-full text-label-sm border transition-colors ${
                                          selected
                                            ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)] border-[var(--color-action-primary)]'
                                            : 'bg-[var(--color-surface-default)] text-[var(--color-text-muted)] border-[var(--color-border-default)]'
                                        }`}
                                        aria-pressed={selected}
                                        aria-label={`${label} day ${idx}`}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </HStack>
                              </FormField>
                            </>
                          ) : (
                            <>
                              <FormField
                                label={
                                  <>
                                    Cron expression{' '}
                                    <span className="text-[var(--color-state-danger)]">*</span>
                                  </>
                                }
                                description={
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Example: <code className="font-mono">0 9 * * 1-5</code>. See{' '}
                                    <a
                                      href="https://crontab.guru"
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[var(--color-action-primary)] underline"
                                    >
                                      crontab.guru
                                    </a>
                                    .
                                  </span>
                                }
                                required
                              >
                                <Input
                                  placeholder="0 9 * * *"
                                  value={cronExpression}
                                  onChange={(e) => setCronExpression(e.target.value)}
                                  fullWidth
                                  className="font-mono"
                                />
                              </FormField>
                              <FormField
                                label={
                                  <>
                                    Timezone{' '}
                                    <span className="text-[var(--color-state-danger)]">*</span>
                                  </>
                                }
                                required
                              >
                                <Select
                                  options={TIMEZONE_OPTIONS}
                                  value={timezone}
                                  onChange={setTimezone}
                                  fullWidth
                                />
                              </FormField>
                            </>
                          )}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                  <VStack gap={2}>
                    <span className="text-label-md text-[var(--color-text-default)]">
                      Drawer previews (Figma)
                    </span>
                    <p className="text-body-sm text-[var(--color-text-subtle)]">
                      Open the four drawer layouts from nodes 2001:6576, 6587, 6670, 6758.
                    </p>
                    <HStack gap={2} className="flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDrawerSearchMinimal(true)}
                      >
                        Search
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDrawerSearchA(true)}>
                        Search + results
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDrawerSearchB(true)}>
                        Search + results (B)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDrawerViewChunks(true)}>
                        View chunks
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <aside className="w-full xl:w-[280px] shrink-0 xl:sticky xl:top-[var(--spacing-4)]">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 flex flex-col gap-4">
              <p className="text-heading-h6 text-[var(--color-text-default)]">Summary</p>
              <VStack gap={3}>
                {[
                  { ok: basicComplete, label: 'Basic information' },
                  { ok: dataSettingComplete, label: 'Data setting' },
                  ...(!isPostgres
                    ? [
                        { ok: chunkingComplete, label: 'Chunking strategy' },
                        { ok: syncComplete, label: 'Sync setting' },
                      ]
                    : []),
                ].map((row) => (
                  <HStack key={row.label} gap={2} align="center">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full ${
                        row.ok
                          ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]'
                          : 'bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)]'
                      }`}
                    >
                      {row.ok ? <IconCheck size={12} stroke={2} /> : null}
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {row.label}
                    </span>
                  </HStack>
                ))}
              </VStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                You can start indexing after each step is finished.
              </p>
              <VStack gap={2} className="w-full pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/agent/datasource')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={!canCreate}
                  onClick={() => navigate('/agent/datasource')}
                >
                  Create
                </Button>
              </VStack>
            </div>
          </aside>
        </div>
      </VStack>

      <Drawer
        isOpen={drawerSearchMinimal}
        onClose={() => setDrawerSearchMinimal(false)}
        title="Search"
        description="Search across all uploaded documents and data sources to find relevant content. Shows top 5 results."
        width={400}
        footer={
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setDrawerSearchMinimal(false)}
          >
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          <SearchInput
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            fullWidth
          />
          <Checkbox
            label="Use hybrid search (BM25 + Dense)"
            checked={hybridSearch}
            onChange={(e) => setHybridSearch(e.target.checked)}
          />
        </VStack>
      </Drawer>

      <Drawer
        isOpen={drawerSearchA}
        onClose={() => setDrawerSearchA(false)}
        title="Search"
        description="Search across all uploaded documents and data sources to find relevant content. Shows top 5 results."
        width={480}
        footer={
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setDrawerSearchA(false)}
          >
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          <SearchInput
            placeholder="Search value"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            fullWidth
          />
          <Checkbox
            label="Use hybrid search (BM25 + Dense)"
            checked={hybridSearch}
            onChange={(e) => setHybridSearch(e.target.checked)}
          />
          <SearchResultsList items={MOCK_SEARCH_A} />
        </VStack>
      </Drawer>

      <Drawer
        isOpen={drawerSearchB}
        onClose={() => setDrawerSearchB(false)}
        title="Search"
        description="Search across all uploaded documents and data sources to find relevant content. Shows top 5 results."
        width={480}
        footer={
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setDrawerSearchB(false)}
          >
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          <SearchInput
            placeholder="Search value"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            fullWidth
          />
          <Checkbox
            label="Use hybrid search (BM25 + Dense)"
            checked={hybridSearch}
            onChange={(e) => setHybridSearch(e.target.checked)}
          />
          <SearchResultsList items={MOCK_SEARCH_B} />
        </VStack>
      </Drawer>

      <Drawer
        isOpen={drawerViewChunks}
        onClose={() => setDrawerViewChunks(false)}
        title="View chunks"
        description="Review how your documents have been split into searchable chunks. Each chunk represents a portion of your original content optimized for semantic search."
        width={480}
        footer={
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setDrawerViewChunks(false)}
          >
            Close
          </Button>
        }
      >
        <ViewChunksList items={MOCK_CHUNKS} />
      </Drawer>
    </PageShell>
  );
}

export default DatasourceCreatePage;
