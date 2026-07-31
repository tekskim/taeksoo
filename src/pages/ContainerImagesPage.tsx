import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  FilterSearchInput,
  Pagination,
  ContextMenu,
  PageShell,
  PageHeader,
  ListToolbar,
  InlineMessage,
  Select,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import { IconDownload, IconDotsCircleHorizontal, IconRocket } from '@tabler/icons-react';
import {
  containerImagesData,
  severityTheme,
  REGISTRIES,
  DEFAULT_REGISTRY_HOST,
  imageReferenceByTag,
  imageReferenceByDigest,
  type ContainerImageRow,
  type VulnSeverity,
} from './containerImagesData';

/* ----------------------------------------
   Container images — 레지스트리 조회 화면.

   ⚠ 다른 목록 화면과 출처가 다르다. 컨테이너 이미지는 쿠버네티스 API 객체가 아니라서
   클러스터에 물어봐서 목록을 얻을 수 없다. 이 화면의 데이터는 **레지스트리**에서 온다
   (OCI Distribution 표준 조회 API + Harbor 자체 API). 그래서
   - 네임스페이스가 아니라 레지스트리의 **프로젝트**로 묶인다
   - push 시각·용량·취약점 스캔 결과처럼 K8s에 없는 정보가 붙는다
   - 생성(Create)이 없다. 이미지는 CI가 push하는 것이지 콘솔에서 만드는 것이 아니다

   선결 조건(미결) — 레지스트리 채택 여부, 레지스트리 프로젝트와 CP 테넌트의 권한 매핑,
   pull secret 자동 주입. 특히 pull secret이 없으면 이미지를 골라도 배포는
   ImagePullBackOff로 실패한다. 고르기와 인증 정보 주입은 한 세트여야 한다.
   ---------------------------------------- */

/* ----------------------------------------
   Filter fields
   ---------------------------------------- */

const containerImageFilterFields: FilterField[] = [
  { id: 'repository', label: 'Repository', type: 'text' },
  { id: 'tag', label: 'Tag', type: 'text' },
  {
    id: 'project',
    label: 'Project',
    type: 'select',
    options: [
      { value: 'tenant-a', label: 'tenant-a' },
      { value: 'tenant-b', label: 'tenant-b' },
      { value: 'metis', label: 'metis' },
      { value: 'maxis', label: 'maxis' },
      { value: 'library', label: 'library' },
    ],
  },
  {
    id: 'severity',
    label: 'Vulnerabilities',
    type: 'select',
    options: [
      { value: 'Critical', label: 'Critical' },
      { value: 'High', label: 'High' },
      { value: 'Medium', label: 'Medium' },
      { value: 'None', label: 'None' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerImagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [registry, setRegistry] = useState(DEFAULT_REGISTRY_HOST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Container Images');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const filteredData = useMemo(() => {
    if (appliedFilters.length === 0) return containerImagesData;

    return containerImagesData.filter((item) => {
      return appliedFilters.every((filter) => {
        const value = item[filter.fieldId as keyof ContainerImageRow];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [appliedFilters]);

  const navigate = useNavigate();

  const shellPanel = useShellPanel();

  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const deployWithImage = (row: ContainerImageRow) =>
    navigate(
      `/container/deployments/create?image=${encodeURIComponent(imageReferenceByTag(row, registry))}`
    );

  const getRowMenuItems = (row: ContainerImageRow): ContextMenuItem[] => [
    {
      id: 'deploy',
      label: 'Deploy this image',
      onClick: () => deployWithImage(row),
    },
    {
      id: 'copy-tag',
      label: 'Copy image reference (tag)',
      onClick: () => navigator.clipboard?.writeText(imageReferenceByTag(row, registry)),
    },
    {
      id: 'copy-digest',
      label: 'Copy image reference (digest)',
      onClick: () => navigator.clipboard?.writeText(imageReferenceByDigest(row, registry)),
    },
  ];

  const columns: TableColumn<ContainerImageRow>[] = [
    {
      key: 'repository',
      label: 'Repository',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: ContainerImageRow) => (
        <div className="min-w-0">
          <TableLink
            title={imageReferenceByTag(row, registry)}
            onClick={() => navigate(`/container/container-images/${row.id}`)}
          >
            {value}
          </TableLink>
        </div>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'tag',
      label: 'Tag',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'digest',
      label: 'Digest',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: false,
      render: (value: string) => (
        <span className="truncate block min-w-0 font-mono text-[12px]" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: 100,
      align: 'right',
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'severity',
      label: 'Vulnerabilities',
      flex: 1,
      minWidth: 140,
      align: 'center',
      sortable: true,
      render: (value: VulnSeverity, row: ContainerImageRow) => (
        <span className="min-w-0 block">
          <Tooltip content={value === 'None' ? 'No known issues' : `${row.vulnCount} finding(s)`}>
            <Badge theme={severityTheme[value]} type="subtle" size="sm">
              {value === 'None' ? 'None' : `${value} ${row.vulnCount}`}
            </Badge>
          </Tooltip>
        </span>
      ),
    },
    {
      key: 'signed',
      label: 'Signed',
      flex: 1,
      minWidth: 100,
      align: 'center',
      sortable: true,
      render: (value: boolean) => (
        <Badge theme={value ? 'green' : 'gray'} type="subtle" size="sm">
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'pushedAt',
      label: 'Pushed at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="truncate block min-w-0" title={display}>
            {display}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRowMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Container Images' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-container-images', 'Kubectl: ClusterName');
                }
              }}
              isTerminalActive={shellPanel.isExpanded}
            />
          }
        />
      }
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          minHeight={300}
          sidebarOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="Container Images"
          actions={
            <Button
              variant="primary"
              leftIcon={<IconRocket size={14} stroke={1.5} />}
              onClick={() => navigate('/container/deployments/create')}
            >
              Deploy by image reference
            </Button>
          }
        />

        {/* 목록에 없는 공용 이미지를 써야 하는 경우가 반드시 생긴다.
            고르기와 직접 입력을 함께 둔다. */}
        <InlineMessage variant="info">
          This list comes from the connected registry, not from the cluster. Images outside this
          registry can still be deployed by typing the image reference directly.
        </InlineMessage>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <HStack gap={2} align="center">
                <Select
                  size="sm"
                  value={registry}
                  onChange={setRegistry}
                  options={REGISTRIES.map((r) => ({ value: r.host, label: r.label }))}
                  width="md"
                />
                <FilterSearchInput
                  filters={containerImageFilterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search images by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  hideAppliedFilters
                />
              </HStack>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
                onClick={() => console.log('Download')}
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
        />

        <Table<ContainerImageRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          onRowClick={(row) => navigate(`/container/container-images/${row.id}`)}
          emptyMessage="No images found in this registry"
        />
      </VStack>
    </PageShell>
  );
}

export default ContainerImagesPage;
