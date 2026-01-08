import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  Checkbox,
  SectionCard,
  Table,
  type TableColumn,
  ListToolbar,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTrash,
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconFile,
  IconDotsVertical,
  IconPlus,
  IconCopy,
  IconCheck,
  IconLayoutSidebar,
  IconEdit,
  IconSelector,
  IconRefresh,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface BucketDetail {
  id: string;
  name: string;
  owner: string;
  usedCapacity: string;
  objects: number;
  creationDate: string;
}

interface ObjectItem {
  id: string;
  name: string;
  type: 'folder' | 'object';
  owner?: string;
  objectType?: string;
  size?: string;
  storageClass?: string;
  etag?: string;
  lastModified?: string;
  s3Uri?: string;
  objectUrl?: string;
  tags?: { key: string; value: string }[];
  versions?: { versionId: string; storageClass: string; type: string; size: string; lastModified: string }[];
  children?: ObjectItem[];
  expanded?: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockBucketDetail: BucketDetail = {
  id: 'bucket-1',
  name: 'cloud_tech/cloud-tech-cold',
  owner: 'ai_platform$ai.platform',
  usedCapacity: 'ai_platform$ai.platform',
  objects: 13,
  creationDate: '2025-09-19 04:06',
};

const mockObjectTree: ObjectItem[] = [
  {
    id: 'folder-yeonii',
    name: 'yeonii',
    type: 'folder',
    expanded: true,
    children: [
      { id: 'folder-test', name: 'test', type: 'folder' },
      { id: 'object-343da1', name: '343da87798e1c6356', type: 'object' },
    ],
  },
  { id: 'object-343da2', name: '343da87798e1c6356b4', type: 'object' },
];

const mockTableObjects: ObjectItem[] = [
  {
    id: 'object-343da87798e1c6356b47236f21099b63',
    name: '343da87798e1c6356b47236f21099b63.jpg',
    type: 'object',
    owner: '-',
    objectType: 'file',
    size: '51.0 KiB',
    storageClass: 'STANDARD',
    etag: '9ec45b70efc38e0d6',
    lastModified: '2025-12-22 02:24',
    s3Uri: 's3://images/343da87798e1c6356b47236f21099b63.jpg',
    objectUrl: 'http://10.7.50.253.80/images/343da87798e1c6356b47236f21099b63.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4J350T4JB1JKIZUN1AS4%2F20260107%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T072559Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ea6089c110b3b219b8c2c7d530e67fdd0d2f281064588c1a8db4bb133249e9a1',
    tags: [{ key: '-', value: '-' }],
    versions: [
      { versionId: 'null', storageClass: 'STANDARD', type: 'file', size: '51.0 KiB', lastModified: '2025-12-22 02:24' },
    ],
  },
  {
    id: 'folder-yeonii-table',
    name: 'yeonii',
    type: 'folder',
    owner: '-',
    objectType: 'folder',
    size: '-',
    storageClass: 'STANDARD',
    etag: '-',
    lastModified: '-',
  },
];

/* ----------------------------------------
   Tree Item Component
   ---------------------------------------- */

interface TreeItemProps {
  item: ObjectItem;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

function TreeItem({ item, level, selectedId, onSelect, onToggle }: TreeItemProps) {
  const isSelected = selectedId === item.id;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.expanded;

  return (
    <div>
      <div
        className={`
          group flex items-center gap-1 h-[28px] px-2 rounded cursor-pointer text-[11px]
          ${isSelected ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium' : 'hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]'}
        `}
        style={{ paddingLeft: `${8 + level * 20}px` }}
        onClick={() => onSelect(item.id)}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-black/10 rounded shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
          >
            {isExpanded ? (
              <IconChevronDown size={14} stroke={1.5} />
            ) : (
              <IconChevronRight size={14} stroke={1.5} />
            )}
          </button>
        ) : (
          <span className="w-[22px] shrink-0" />
        )}
        
        {item.type === 'folder' ? (
          <IconFolder size={14} stroke={1.5} className={`shrink-0 ${isSelected ? 'text-white' : 'text-[var(--color-text-muted)]'}`} />
        ) : (
          <IconFile size={14} stroke={1.5} className={`shrink-0 ${isSelected ? 'text-white' : 'text-[var(--color-text-muted)]'}`} />
        )}
        
        <span className="flex-1 truncate ml-1">{item.name}</span>
        
        <button
          className={`p-0.5 rounded opacity-0 group-hover:opacity-100 shrink-0 ${isSelected ? 'hover:bg-white/20' : 'hover:bg-[var(--color-surface-muted)]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <IconDotsVertical size={14} stroke={1.5} />
        </button>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Object Row Component (with inline expansion)
   ---------------------------------------- */

interface ObjectRowProps {
  object: ObjectItem;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
}

function ObjectRow({ object, isExpanded, isSelected, onToggleExpand, onToggleSelect }: ObjectRowProps) {
  const isFolder = object.type === 'folder';
  const [copiedField, setCopiedField] = useState<'s3Uri' | 'objectUrl' | null>(null);

  const handleCopy = (text: string, field: 's3Uri' | 'objectUrl') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className={`
        rounded-[var(--table-row-radius)]
        border border-[var(--color-border-default)] bg-[var(--color-surface-default)]
        transition-colors overflow-hidden
      `}
    >
      {/* Main Row */}
      <div
        className={`
          flex items-stretch min-h-[var(--table-row-height)]
          hover:bg-[var(--table-row-hover-bg)] transition-colors
        `}
      >
        {/* Checkbox */}
        <div className="w-[var(--table-checkbox-width)] flex items-center justify-center shrink-0 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
          <Checkbox checked={isSelected} onChange={onToggleSelect} />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center gap-2">
          {!isFolder && (
            <button
              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded shrink-0"
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <IconChevronDown size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
              ) : (
                <IconChevronRight size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
              )}
            </button>
          )}
          {isFolder ? (
            <IconFolder size={14} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
          ) : (
            <IconFile size={14} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
          )}
          <Link
            to={isFolder ? `/storage/buckets/${object.id}` : '#'}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-[length:var(--table-font-size)] leading-[var(--table-line-height)] truncate"
          >
            {object.name}
          </Link>
        </div>

        {/* Owner */}
        <div className="w-[120px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center truncate">
          {object.owner || '-'}
        </div>

        {/* Type */}
        <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
          {object.objectType || '-'}
        </div>

        {/* Size */}
        <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
          {object.size || '-'}
        </div>

        {/* StorageClass */}
        <div className="w-[100px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
          {object.storageClass || '-'}
        </div>

        {/* ETag */}
        <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center truncate">
          {object.etag || '-'}
        </div>

        {/* LastModified */}
        <div className="w-[130px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
          {object.lastModified || '-'}
        </div>

        {/* Action */}
        <div className="w-[60px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center justify-center">
          <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded">
            <IconDotsVertical size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && !isFolder && (
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          {/* S3 URI & Object URL */}
          <div className="flex gap-4 mb-6">
            {/* S3 URI Box */}
            <div className="flex-1 p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] text-[var(--color-text-muted)]">S3 URI</span>
                <button 
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded"
                  onClick={() => object.s3Uri && handleCopy(object.s3Uri, 's3Uri')}
                >
                  {copiedField === 's3Uri' ? (
                    <IconCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
                  ) : (
                    <IconCopy size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
              <div className="text-[12px] text-[var(--color-text-default)] break-all">
                {object.s3Uri || '-'}
              </div>
            </div>
            {/* Object URL Box */}
            <div className="flex-1 p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] text-[var(--color-text-muted)]">Object URL</span>
                <button 
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded"
                  onClick={() => object.objectUrl && handleCopy(object.objectUrl, 'objectUrl')}
                >
                  {copiedField === 'objectUrl' ? (
                    <IconCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
                  ) : (
                    <IconCopy size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
              <div className="text-[12px] text-[var(--color-text-default)] break-all">
                {object.objectUrl || '-'}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-[var(--table-row-gap)]">
            <div className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-muted)]">Tags</div>
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
                Key
              </div>
              <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                Value
              </div>
            </div>
            {/* Rows */}
            {object.tags?.map((tag, idx) => (
              <div key={idx} className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {tag.key}
                </div>
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {tag.value}
                </div>
              </div>
            ))}
          </div>

          {/* Versions */}
          <div className="flex flex-col gap-[var(--table-row-gap)] mt-4">
            <div className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-muted)]">Versions</div>
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
                VersionID
              </div>
              <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                Storage Class
              </div>
              <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                Type
              </div>
              <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                Size
              </div>
              <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                Last modified
              </div>
            </div>
            {/* Rows */}
            {object.versions?.map((version, idx) => (
              <div key={idx} className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {version.versionId}
                </div>
                <div className="w-[180px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {version.storageClass}
                </div>
                <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {version.type}
                </div>
                <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {version.size}
                </div>
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
                  {version.lastModified}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Bucket Detail Page Component
   ---------------------------------------- */

export function BucketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // Details tab active
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>('folder-yeonii');
  const [objectTree, setObjectTree] = useState<ObjectItem[]>(mockObjectTree);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [treeSidebarOpen, setTreeSidebarOpen] = useState(true);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel } = useTabs();

  // Use mock data (in real app, fetch based on id)
  const bucketData = mockBucketDetail;

  // Update tab label to match the bucket name (most recent breadcrumb)
  useEffect(() => {
    if (bucketData?.name) {
      updateActiveTabLabel(bucketData.name);
    }
  }, [bucketData?.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Toggle tree item expansion
  const toggleTreeItem = (itemId: string) => {
    const updateItem = (items: ObjectItem[]): ObjectItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };
    setObjectTree(updateItem(objectTree));
  };

  // Toggle row expansion
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  // Toggle row selection
  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  // Filter objects based on search
  const filteredObjects = mockTableObjects.filter(
    (obj) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tags table columns
  const tagsColumns: TableColumn<{ key: string; value: string }>[] = [
    { key: 'key', label: 'Key', flex: 1 },
    { key: 'value', label: 'Value', flex: 1 },
  ];

  // ACL table columns
  const aclColumns: TableColumn<{ grantee: string; permissions: string }>[] = [
    { key: 'grantee', label: 'Grantee', flex: 1 },
    { key: 'permissions', label: 'Permissions', flex: 1 },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Buckets', href: '/storage/buckets' },
                  { label: bucketData.name },
                ]}
              />
            }
            actions={
              <TopBarAction icon={<IconBell size={16} stroke={1.5} />} label="Notifications" />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Header with Info Cards */}
              <DetailHeader>
                <DetailHeader.Title>{bucketData.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
                    Delete
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
                    Edit
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Owner" value={bucketData.owner} />
                  <DetailHeader.InfoCard label="Used Capacity" value={bucketData.usedCapacity} />
                  <DetailHeader.InfoCard label="Objects" value={String(bucketData.objects)} />
                  <DetailHeader.InfoCard label="CreationDate" value={bucketData.creationDate} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="policies">Policies</Tab>
                    <Tab value="objects">Objects</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value="details" className="pt-4">
                    {/* Basic Information Section */}
                    <SectionCard>
                      <SectionCard.Header title="Basic Information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Region" value="Default" showDivider />
                        <SectionCard.DataRow label="Versioning" value="Suspended" />
                        <SectionCard.DataRow label="MFA Delete" value="Disabled" />
                        <SectionCard.DataRow label="Encryption" value="Disabled" />
                        <SectionCard.DataRow label="Index type" value="Normal / Indexless" />
                        <SectionCard.DataRow label="Placement rule" value="hdd" />
                        <SectionCard.DataRow label="Tags">
                          <Table<{ key: string; value: string }>
                            columns={tagsColumns}
                            data={[{ key: 'test', value: 'test' }]}
                            rowKey="key"
                          />
                        </SectionCard.DataRow>
                        <SectionCard.DataRow label="Capacity Limit %" value="No Limit" />
                        <SectionCard.DataRow label="Object Limit %" value="No Limit" />
                      </SectionCard.Content>
                    </SectionCard>
                  </TabPanel>

                  {/* Policies Tab Panel */}
                  <TabPanel value="policies" className="pt-4">
                    {/* Policies Section */}
                    <SectionCard>
                      <SectionCard.Header title="Policies" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Bucket policy" value="null" showDivider />
                        <SectionCard.DataRow label="Lifecycle" value="{}" />
                        <SectionCard.DataRow label="Replication policy">
                          <pre className="text-[12px] text-[var(--color-text-default)] whitespace-pre-wrap">
{`{
      "Role": ""
}`}
                          </pre>
                        </SectionCard.DataRow>
                        <SectionCard.DataRow label="ACL">
                          <Table<{ grantee: string; permissions: string }>
                            columns={aclColumns}
                            data={[{ grantee: 'Bucket Owner', permissions: 'FULL_CONTROL' }]}
                            rowKey="grantee"
                          />
                        </SectionCard.DataRow>
                      </SectionCard.Content>
                    </SectionCard>
                  </TabPanel>

                  {/* Objects Tab Panel */}
                  <TabPanel value="objects" className="pt-4">
                    <div className="flex gap-4">
                      {/* Left Sidebar - Objects Tree */}
                      {treeSidebarOpen && (
                        <div className="w-[224px] shrink-0 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)]">
                            <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                              Objects
                            </span>
                            <button 
                              className="p-1 hover:bg-[var(--color-surface-muted)] rounded"
                              onClick={() => setTreeSidebarOpen(false)}
                            >
                              <IconLayoutSidebar size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                            </button>
                          </div>
                          <div className="p-2 max-h-[600px] overflow-auto">
                            {objectTree.map((item) => (
                              <TreeItem
                                key={item.id}
                                item={item}
                                level={0}
                                selectedId={selectedTreeItem}
                                onSelect={setSelectedTreeItem}
                                onToggle={toggleTreeItem}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Right Content - Object List */}
                      <VStack gap={3} className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center justify-between h-7">
                          <div className="flex items-center gap-2">
                            {!treeSidebarOpen && (
                              <button
                                className="p-1 rounded border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-strong)] transition-colors"
                                onClick={() => setTreeSidebarOpen(true)}
                              >
                                <IconLayoutSidebar size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                              </button>
                            )}
                            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                              Objects
                            </h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Create folder
                            </Button>
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Create Object
                            </Button>
                          </div>
                        </div>

                        {/* Search and Actions Row */}
                        <ListToolbar
                          primaryActions={
                            <ListToolbar.Actions>
                              <div className="w-[280px]">
                                <SearchInput
                                  placeholder="Find object with filters"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onClear={() => setSearchQuery('')}
                                  size="sm"
                                  fullWidth
                                />
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<IconDownload size={12} stroke={1.5} />}
                                aria-label="Download"
                              />
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<IconRefresh size={14} stroke={1.5} />}
                                aria-label="Refresh"
                              />
                            </ListToolbar.Actions>
                          }
                          bulkActions={
                            <ListToolbar.Actions>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconTrash size={14} stroke={1.5} />}
                              >
                                Delete
                              </Button>
                            </ListToolbar.Actions>
                          }
                        />

                        {/* Pagination */}
                        <Pagination
                          currentPage={currentPage}
                          totalPages={1}
                          onPageChange={setCurrentPage}
                          totalItems={2}
                        />

                        {/* Table */}
                        <div className="flex flex-col gap-[var(--table-row-gap)]">
                          {/* Table Header */}
                          <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                            <div className="w-[var(--table-checkbox-width)] flex items-center justify-center shrink-0 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]">
                              <Checkbox 
                                checked={selectedRows.length === filteredObjects.length && filteredObjects.length > 0}
                                onChange={() => {
                                  if (selectedRows.length === filteredObjects.length) {
                                    setSelectedRows([]);
                                  } else {
                                    setSelectedRows(filteredObjects.map(o => o.id));
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                              Name (= Key)
                              <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />
                            </div>
                            <div className="w-[120px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">Owner</div>
                            <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                              Type
                              <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />
                            </div>
                            <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                              Size
                              <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />
                            </div>
                            <div className="w-[100px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">StorageClass</div>
                            <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">ETag</div>
                            <div className="w-[130px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                              LastModified
                              <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />
                            </div>
                            <div className="w-[60px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">Action</div>
                          </div>

                          {/* Table Body */}
                          {filteredObjects.map((object) => (
                            <ObjectRow
                              key={object.id}
                              object={object}
                              isExpanded={expandedRows.includes(object.id)}
                              isSelected={selectedRows.includes(object.id)}
                              onToggleExpand={() => toggleRowExpansion(object.id)}
                              onToggleSelect={() => toggleRowSelection(object.id)}
                            />
                          ))}
                        </div>
                      </VStack>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BucketDetailPage;
