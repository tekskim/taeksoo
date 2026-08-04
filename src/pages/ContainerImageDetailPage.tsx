import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  PageShell,
  ErrorState,
  InlineMessage,
  Table,
  TableLink,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { IconAlertTriangle, IconChevronDown, IconRocket } from '@tabler/icons-react';
import {
  findImageById,
  findSiblingTags,
  getFindings,
  severityTheme,
  DEFAULT_REGISTRY_HOST,
  getRegistry,
  imageReferenceByTag,
  imageReferenceByDigest,
  type ContainerImageRow,
  type VulnFinding,
} from './containerImagesData';

/* ----------------------------------------
   Container image 상세 — 레지스트리에서 오는 화면.

   ⚠ 다른 상세 화면과 출처가 다르다. 이미지는 쿠버네티스 API 객체가 아니라서
   클러스터에 물어볼 수 없다. 태그·다이제스트·용량·취약점은 모두 레지스트리가 준다.
   그래서 여기에는 "삭제"나 "편집"이 없다 — 이미지는 CI가 push하는 것이다.
   ---------------------------------------- */

export function ContainerImageDetailPage() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const shellPanel = useShellPanel();
  const image = findImageById(imageId);
  const registryHost = DEFAULT_REGISTRY_HOST;
  const registry = getRegistry(registryHost);

  useEffect(() => {
    if (image) updateActiveTabLabel(`${image.repository}:${image.tag}`);
  }, [updateActiveTabLabel, image]);

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

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const shell = (children: React.ReactNode, crumbLabel: string) => (
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
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Container Images', href: '/container/container-images' },
                { label: crumbLabel },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
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
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      {children}
    </PageShell>
  );

  if (!image) {
    return shell(
      <ErrorState
        icon={<IconAlertTriangle size={16} strokeWidth={1.5} />}
        title="Image not found"
        description={`The image "${imageId ?? ''}" is not in this registry.`}
        action={
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/container/container-images')}
          >
            Back to Container Images
          </Button>
        }
      />,
      imageId ?? 'Image'
    );
  }

  const tagRef = imageReferenceByTag(image, registryHost);
  const digestRef = imageReferenceByDigest(image, registryHost);
  const findings = getFindings(image);
  const siblings = findSiblingTags(image);

  const deploy = () =>
    navigate(`/container/deployments/create?image=${encodeURIComponent(tagRef)}`);

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'copy-tag',
      label: 'Copy image reference (tag)',
      onClick: () => navigator.clipboard?.writeText(tagRef),
    },
    {
      id: 'copy-digest',
      label: 'Copy image reference (digest)',
      onClick: () => navigator.clipboard?.writeText(digestRef),
    },
  ];

  const findingColumns: TableColumn<VulnFinding>[] = [
    {
      key: 'severity',
      label: 'Severity',
      width: 120,
      render: (value: VulnFinding['severity']) => (
        <Badge theme={severityTheme[value]} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'cve',
      label: 'CVE',
      flex: 1,
      minWidth: 180,
      render: (value: string) => (
        <span className="truncate block min-w-0 font-mono text-[12px]" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'packageName',
      label: 'Package',
      flex: 1,
      minWidth: 160,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'installed',
      label: 'Installed',
      flex: 1,
      minWidth: 120,
      render: (value: string) => (
        <span className="truncate block min-w-0 font-mono text-[12px]" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'fixedIn',
      label: 'Fixed in',
      flex: 1,
      minWidth: 140,
      render: (value: string | undefined) =>
        value ? (
          <span className="truncate block min-w-0 font-mono text-[12px]" title={value}>
            {value}
          </span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">No fix yet</span>
        ),
    },
  ];

  const siblingColumns: TableColumn<ContainerImageRow>[] = [
    {
      key: 'tag',
      label: 'Tag',
      flex: 1,
      minWidth: 160,
      render: (value: string, row: ContainerImageRow) => (
        <div className="min-w-0">
          {row.id === image.id ? (
            <span className="truncate block min-w-0 text-[var(--color-text-default)]">
              {value} <span className="text-[var(--color-text-subtle)]">(current)</span>
            </span>
          ) : (
            <TableLink
              title={value}
              onClick={() => navigate(`/container/container-images/${row.id}`)}
            >
              {value}
            </TableLink>
          )}
        </div>
      ),
    },
    {
      key: 'digest',
      label: 'Digest',
      flex: 1,
      minWidth: 180,
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
      render: (value: string) => <span className="truncate block min-w-0">{value}</span>,
    },
    {
      key: 'pushedAt',
      label: 'Pushed at',
      flex: 1,
      minWidth: 180,
      render: (value: string) => (
        <span className="truncate block min-w-0">{value.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}</span>
      ),
    },
  ];

  return shell(
    <VStack gap={6}>
      <DetailHeader>
        <DetailHeader.Title>
          Image: {image.project}/{image.repository}:{image.tag}
        </DetailHeader.Title>
        <DetailHeader.Actions>
          <HStack gap={2}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconRocket size={12} stroke={1.5} />}
              onClick={deploy}
            >
              Deploy this image
            </Button>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More actions
              </Button>
            </ContextMenu>
          </HStack>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Registry" value={registryHost} />
          <DetailHeader.InfoCard label="Project" value={image.project} />
          <DetailHeader.InfoCard label="Tag" value={image.tag} />
          <DetailHeader.InfoCard label="Size" value={image.size} />
          <DetailHeader.InfoCard
            label="Vulnerabilities"
            value={
              <Tooltip
                content={
                  image.severity === 'None' ? 'No known issues' : `${image.vulnCount} finding(s)`
                }
              >
                <span className="max-w-[120px] truncate">
                  <Badge theme={severityTheme[image.severity]} type="subtle" size="sm">
                    {image.severity === 'None' ? 'None' : `${image.severity} ${image.vulnCount}`}
                  </Badge>
                </span>
              </Tooltip>
            }
          />
          <DetailHeader.InfoCard
            label="Signed"
            value={
              <Badge theme={image.signed ? 'green' : 'gray'} type="subtle" size="sm">
                {image.signed ? 'Yes' : 'No'}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="Pushed at" value={image.pushedAt} />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <Tabs value={activeTab} onChange={setActiveTab} size="sm">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="vulnerabilities">Vulnerabilities ({findings.length})</Tab>
          <Tab value="tags">Tags ({siblings.length})</Tab>
        </TabList>

        <TabPanel value="overview">
          <VStack gap={4}>
            {registry.isPrivate && registry.pullSecret && (
              <InlineMessage variant="info">
                This is a private registry. Deploying from here also needs the pull secret{' '}
                <strong>{registry.pullSecret}</strong> in the target namespace — the deployment form
                fills it in for you.
              </InlineMessage>
            )}

            {!image.signed && (
              <InlineMessage variant="warning">
                This image is not signed. There is no way to verify who built it.
              </InlineMessage>
            )}

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Image reference
                </h3>
                {/* 태그는 나중에 다른 이미지를 가리킬 수 있고, 다이제스트는 절대 바뀌지 않는다. */}
                <DetailRow label="By tag (can change later)" value={tagRef} mono />
                <DetailRow label="By digest (always the same image)" value={digestRef} mono />
              </VStack>
            </div>

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Details
                </h3>
                <DetailRow label="Repository" value={`${image.project}/${image.repository}`} />
                <DetailRow label="Size" value={image.size} />
                <DetailRow label="Pushed at" value={image.pushedAt} />
                <DetailRow label="Signed" value={image.signed ? 'Yes' : 'No'} />
              </VStack>
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="vulnerabilities">
          <VStack gap={3}>
            {findings.length > 0 && (
              <InlineMessage variant="info">
                Scan results come from the registry, not from the cluster. An image with findings
                can still be deployed — this list is information, not a gate.
              </InlineMessage>
            )}
            <Table<VulnFinding>
              columns={findingColumns}
              data={findings}
              rowKey="cve"
              emptyMessage="No known vulnerabilities in this image"
            />
          </VStack>
        </TabPanel>

        <TabPanel value="tags">
          <VStack gap={3}>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Other tags of {image.project}/{image.repository} in this registry.
            </span>
            <Table<ContainerImageRow>
              columns={siblingColumns}
              data={siblings}
              rowKey="id"
              emptyMessage="No other tags"
            />
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>,
    `${image.repository}:${image.tag}`
  );
}

/* ----------------------------------------
   Row
   ---------------------------------------- */

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <HStack gap={4} className="w-full" align="start">
      <span className="text-body-md text-[var(--color-text-subtle)] w-[260px] shrink-0">
        {label}
      </span>
      <span
        className={[
          'text-body-md text-[var(--color-text-default)] min-w-0 break-all',
          mono ? 'font-mono text-[12px]' : '',
        ].join(' ')}
      >
        {value}
      </span>
    </HStack>
  );
}

export default ContainerImageDetailPage;
