import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  VStack,
  HStack,
  SectionCard,
  FormField,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Chip,
  FloatingCard,
} from '@/design-system';
import type { FloatingCardSection, SectionItem } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';

const DATA_TYPE_OPTIONS = [
  { value: 'file-upload', label: 'File Upload' },
  { value: 'postgresql', label: 'PostgreSQL' },
];

const CHUNKING_OPTIONS = [
  { value: 'structure', label: 'Structure-based chunking' },
  { value: 'fixed', label: 'Fixed-size chunking' },
];

const REPEAT_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const REPEAT_INTERVAL_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

function scrollToSection(elementId: string) {
  requestAnimationFrame(() => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/** Mock loader — replace with API when wired. */
function getMockDatasource(id: string | undefined) {
  return {
    name: id ? `Data source ${id.slice(0, 8)}` : 'Sample data source',
    description: 'Indexes product documentation for support agents.',
    tags: ['Tag 1', 'Tag 2', 'Tag 3'] as string[],
    dataType: 'file-upload',
    chunking: 'structure',
    syncMode: 'scheduled' as 'once' | 'scheduled',
    repeat: 'weekly',
    repeatEvery: '1',
    repeatOn: new Set<WeekdayKey>(['mon']),
  };
}

export function DatasourceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const initial = useMemo(() => getMockDatasource(id), [id]);

  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [tags, setTags] = useState<string[]>(initial.tags);
  const [tagInput, setTagInput] = useState('');
  const [dataType, setDataType] = useState(initial.dataType);
  const [chunking, setChunking] = useState(initial.chunking);
  const [syncMode, setSyncMode] = useState<'once' | 'scheduled'>(initial.syncMode);
  const [repeat, setRepeat] = useState(initial.repeat);
  const [repeatEvery, setRepeatEvery] = useState(initial.repeatEvery);
  const [repeatOn, setRepeatOn] = useState<Set<WeekdayKey>>(() => new Set(initial.repeatOn));

  useEffect(() => {
    document.title = 'Edit data source - THAKI Cloud';
    return () => {
      document.title = 'THAKI Cloud';
    };
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Edit data source');
  }, [updateActiveTabLabel]);

  const chunkingHelper =
    chunking === 'structure'
      ? 'Split text by characters with overlap'
      : 'Split text into fixed-size segments';

  const toggleWeekday = useCallback((key: WeekdayKey) => {
    setRepeatOn((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const addTagFromInput = useCallback(() => {
    const next = tagInput.trim();
    if (!next) return;
    if (tags.includes(next) || tags.length >= 10) return;
    setTags((t) => [...t, next]);
    setTagInput('');
  }, [tagInput, tags]);

  const basicSectionStatus = useMemo((): SectionItem['status'] => {
    return name.trim() ? 'success' : 'default';
  }, [name]);

  const dataSettingStatus = useMemo((): SectionItem['status'] => {
    if (!dataType || !chunking) return 'default';
    if (syncMode === 'once') return 'success';
    if (!repeat || !repeatEvery || repeatOn.size === 0) return 'default';
    return 'success';
  }, [chunking, dataType, repeat, repeatEvery, repeatOn.size, syncMode]);

  const summarySections = useMemo<FloatingCardSection[]>(
    () => [
      {
        tabTitle: 'Progress',
        items: [
          {
            id: 'basic',
            title: 'Basic information',
            status: basicSectionStatus,
            onClick: () => scrollToSection('datasource-basic-information'),
          },
          {
            id: 'data',
            title: 'Data setting',
            status: dataSettingStatus,
            onClick: () => scrollToSection('datasource-data-setting'),
          },
        ],
        collapsible: false,
      },
    ],
    [basicSectionStatus, dataSettingStatus]
  );

  const canSave =
    name.trim().length > 0 &&
    Boolean(dataType && chunking) &&
    (syncMode === 'once' || (Boolean(repeat && repeatEvery) && repeatOn.size > 0));

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
      <div className="flex w-full items-start justify-center gap-6">
        <VStack gap={6} className="min-w-0 flex-1 max-w-[896px]">
          <div className="flex h-8 items-center">
            <h1 className="text-heading-h4 text-[var(--color-text-default)]">Edit data source</h1>
          </div>

          <SectionCard id="datasource-basic-information">
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content className="gap-6">
              <FormField label="Data source name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for this data source"
                  fullWidth
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add an description"
                  rows={4}
                  fullWidth
                />
              </FormField>

              <VStack gap={2} className="w-full">
                <FormField
                  label="Tag"
                  description="Tags help categorize and identify your resources"
                  helperText="Up to 10 tags allowed"
                >
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTagFromInput();
                      }
                    }}
                    placeholder="Enter tags"
                    fullWidth
                    disabled={tags.length >= 10}
                  />
                </FormField>

                {tags.length > 0 ? (
                  <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-2 py-2 w-full">
                    <HStack gap={1} className="flex-wrap">
                      {tags.map((t) => (
                        <Chip
                          key={t}
                          value={t}
                          onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
                        />
                      ))}
                    </HStack>
                  </div>
                ) : null}
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard id="datasource-data-setting">
            <SectionCard.Header title="Data setting" />
            <SectionCard.Content className="gap-6">
              <FormField
                label="Data type"
                required
                description="Select a type and complete the connection."
                helperText={
                  dataType === 'file-upload'
                    ? 'Support : PDF, DOC, DOCX, TXT, MD, CSV (max 100MB)'
                    : undefined
                }
              >
                <Select
                  options={DATA_TYPE_OPTIONS}
                  value={dataType}
                  onChange={setDataType}
                  fullWidth
                />
              </FormField>

              <FormField
                label="Chunking strategy"
                required
                description="Select how documents should be split into chunks."
                helperText={chunkingHelper}
              >
                <Select
                  options={CHUNKING_OPTIONS}
                  value={chunking}
                  onChange={setChunking}
                  fullWidth
                />
              </FormField>

              <FormField
                label="Sync setting"
                required
                description="Select how and when data should be synced."
                spacing="loose"
              >
                <RadioGroup
                  name="sync-mode"
                  value={syncMode}
                  onChange={(v) => setSyncMode(v as 'once' | 'scheduled')}
                  direction="vertical"
                  options={[
                    { value: 'once', label: 'One-time Sync (Sync Now)' },
                    { value: 'scheduled', label: 'Automatic Sync (Scheduled)' },
                  ]}
                />
              </FormField>

              {syncMode === 'scheduled' ? (
                <div className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-3">
                  <VStack gap={6} className="w-full">
                    <span className="text-heading-h5 text-[var(--color-text-default)]">
                      Scheduled update
                    </span>

                    <FormField label="Repeat" required>
                      <Select
                        options={REPEAT_OPTIONS}
                        value={repeat}
                        onChange={setRepeat}
                        className="w-[120px]"
                      />
                    </FormField>

                    <FormField label="Repeat every" required>
                      <HStack gap={2} align="center">
                        <Select
                          options={REPEAT_INTERVAL_OPTIONS}
                          value={repeatEvery}
                          onChange={setRepeatEvery}
                          className="w-[80px]"
                        />
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          {repeat === 'daily'
                            ? 'day(s)'
                            : repeat === 'monthly'
                              ? 'month(s)'
                              : 'week(s)'}
                        </span>
                      </HStack>
                    </FormField>

                    <FormField label="Repeat on" required>
                      <HStack gap={2} className="flex-wrap">
                        {WEEKDAY_KEYS.map((key, i) => {
                          const selected = repeatOn.has(key);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => toggleWeekday(key)}
                              className={[
                                'min-w-0 size-6 rounded-[var(--radius-sm)] flex items-center justify-center text-label-md transition-colors',
                                selected
                                  ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]'
                                  : 'bg-[var(--color-border-default)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-muted)]',
                              ].join(' ')}
                              aria-pressed={selected}
                              aria-label={key}
                            >
                              {WEEKDAY_LABELS[i]}
                            </button>
                          );
                        })}
                      </HStack>
                    </FormField>
                  </VStack>
                </div>
              ) : null}
            </SectionCard.Content>
          </SectionCard>
        </VStack>

        <div className="shrink-0 w-[312px] sticky top-4 self-start">
          <FloatingCard
            title="Summary"
            sections={summarySections}
            cancelLabel="Cancel"
            actionLabel="Save"
            actionEnabled={canSave}
            onCancel={() => navigate('/agent/datasource')}
            onAction={() => navigate('/agent/datasource')}
            portal={false}
            width="312px"
          />
        </div>
      </div>
    </PageShell>
  );
}

export default DatasourceEditPage;
