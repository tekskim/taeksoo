import { useState } from 'react';
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
  IconLayoutSidebar,
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
          ${isSelected ? 'bg-[var(--color-action-primary)] text-white' : 'hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]'}
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

  return (
    <>
      {/* Main Row */}
      <div
        className={`
          flex items-center h-[var(--table-row-height)] rounded-[var(--table-row-radius)]
          border border-[var(--color-border-default)] bg-[var(--color-surface-default)]
          hover:bg-[var(--table-row-hover-bg)] transition-colors
        `}
      >
        {/* Checkbox */}
        <div className="w-10 flex items-center justify-center shrink-0">
          <Checkbox checked={isSelected} onChange={onToggleSelect} />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-[140px] px-3 flex items-center gap-2">
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
            className="text-[var(--color-action-primary)] hover:underline text-[11px] truncate"
          >
            {object.name}
          </Link>
        </div>

        {/* Owner */}
        <div className="w-[120px] px-3 text-[11px] text-[var(--color-text-default)] truncate">
          {object.owner || '-'}
        </div>

        {/* Type */}
        <div className="w-[80px] px-3 text-[11px] text-[var(--color-text-default)]">
          {object.objectType || '-'}
        </div>

        {/* Size */}
        <div className="w-[80px] px-3 text-[11px] text-[var(--color-text-default)]">
          {object.size || '-'}
        </div>

        {/* StorageClass */}
        <div className="w-[100px] px-3 text-[11px] text-[var(--color-text-default)]">
          {object.storageClass || '-'}
        </div>

        {/* ETag */}
        <div className="w-[140px] px-3 text-[11px] text-[var(--color-text-default)] truncate">
          {object.etag || '-'}
        </div>

        {/* LastModified */}
        <div className="w-[130px] px-3 text-[11px] text-[var(--color-text-default)]">
          {object.lastModified || '-'}
        </div>

        {/* Action */}
        <div className="w-[60px] px-3 flex items-center justify-center">
          <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded">
            <IconDotsVertical size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && !isFolder && (
        <div className="ml-10 mr-4 mb-2">
          {/* S3 URI & Object URL */}
          <div className="flex gap-4 mb-6">
            {/* S3 URI Box */}
            <div className="flex-1 p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] text-[var(--color-text-muted)]">S3 URI</span>
                <button className="p-1 hover:bg-[var(--color-surface-subtle)] rounded">
                  <IconCopy size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
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
                <button className="p-1 hover:bg-[var(--color-surface-subtle)] rounded">
                  <IconCopy size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                </button>
              </div>
              <div className="text-[12px] text-[var(--color-text-default)] break-all">
                {object.objectUrl || '-'}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="text-[12px] text-[var(--color-text-muted)] mb-3">Tags</div>
            <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex bg-[var(--color-surface-subtle)]">
                <div className="flex-1 px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Key
                </div>
                <div className="flex-1 px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Value
                </div>
              </div>
              {/* Rows */}
              {object.tags?.map((tag, idx) => (
                <div key={idx} className="flex bg-[var(--color-surface-default)] border-t border-[var(--color-border-subtle)]">
                  <div className="flex-1 px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {tag.key}
                  </div>
                  <div className="flex-1 px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {tag.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Versions */}
          <div>
            <div className="text-[12px] text-[var(--color-text-muted)] mb-3">Versions</div>
            <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex bg-[var(--color-surface-subtle)]">
                <div className="w-[180px] px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  VersionID
                </div>
                <div className="w-[180px] px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Storage Class
                </div>
                <div className="w-[140px] px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Type
                </div>
                <div className="w-[140px] px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Size
                </div>
                <div className="flex-1 px-4 py-3 text-[12px] font-medium text-[var(--color-text-default)]">
                  Last modified
                </div>
              </div>
              {/* Rows */}
              {object.versions?.map((version, idx) => (
                <div key={idx} className="flex bg-[var(--color-surface-default)] border-t border-[var(--color-border-subtle)]">
                  <div className="w-[180px] px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {version.versionId}
                  </div>
                  <div className="w-[180px] px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {version.storageClass}
                  </div>
                  <div className="w-[140px] px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {version.type}
                  </div>
                  <div className="w-[140px] px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {version.size}
                  </div>
                  <div className="flex-1 px-4 py-3 text-[12px] text-[var(--color-text-default)]">
                    {version.lastModified}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ----------------------------------------
   Bucket Detail Page Component
   ---------------------------------------- */

export function BucketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(2); // Objects tab active
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>('folder-yeonii');
  const [objectTree, setObjectTree] = useState<ObjectItem[]>(mockObjectTree);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>(['object-343da87798e1c6356b47236f21099b63']);
  const [treeSidebarOpen, setTreeSidebarOpen] = useState(true);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Use mock data (in real app, fetch based on id)
  const bucketData = mockBucketDetail;

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
            activeTabId={activeTabId}
            onTabClose={closeTab}
            onTabSelect={selectTab}
            onNewTab={addNewTab}
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6} className="min-w-[1176px] max-w-[1320px]">
              {/* Page Header with Info Cards */}
              <DetailHeader>
                <DetailHeader.Title>
                  <div className="flex items-center gap-4">
                    <span>{bucketData.name}</span>
                    <Button variant="secondary" size="sm">
                      <IconTrash size={12} stroke={1.5} />
                      Delete
                    </Button>
                  </div>
                </DetailHeader.Title>
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
                    <Tab>Details</Tab>
                    <Tab>Policies</Tab>
                    <Tab>Objects</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value={0} className="pt-4">
                    <div className="text-[var(--color-text-muted)] text-sm">
                      Bucket details and configuration information will be displayed here.
                    </div>
                  </TabPanel>

                  {/* Policies Tab Panel */}
                  <TabPanel value={1} className="pt-4">
                    <div className="text-[var(--color-text-muted)] text-sm">
                      Bucket policies and access control settings will be displayed here.
                    </div>
                  </TabPanel>

                  {/* Objects Tab Panel */}
                  <TabPanel value={2} className="pt-4">
                    <div className="flex gap-4">
                      {/* Left Sidebar - Objects Tree */}
                      {treeSidebarOpen && (
                        <div className="w-[224px] shrink-0 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)]">
                            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">
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
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                            Objects
                          </span>
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
                        <div className="flex items-center gap-3 mb-4">
                          <SearchInput
                            placeholder="Find object with filters"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[280px]"
                          />
                          <Button variant="secondary" size="sm">
                            <IconTrash size={12} stroke={1.5} />
                            Delete
                          </Button>
                          <Button variant="secondary" size="sm">
                            <IconDownload size={12} stroke={1.5} />
                            Download
                          </Button>
                        </div>

                        {/* Pagination */}
                        <div className="mb-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={1}
                            onPageChange={setCurrentPage}
                            totalItems={2}
                          />
                        </div>

                        {/* Table Header */}
                        <div className="flex items-center h-[40px] bg-[var(--color-surface-subtle)] rounded-t-lg border border-[var(--color-border-default)]">
                          <div className="w-10 flex items-center justify-center shrink-0">
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
                          <div className="flex-1 min-w-[140px] px-3 text-[11px] font-medium text-[var(--color-text-default)] flex items-center gap-1">
                            Name (= Key)
                            <IconChevronDown size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          </div>
                          <div className="w-[120px] px-3 text-[11px] font-medium text-[var(--color-text-default)]">Owner</div>
                          <div className="w-[80px] px-3 text-[11px] font-medium text-[var(--color-text-default)] flex items-center gap-1">
                            Type
                            <IconChevronDown size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          </div>
                          <div className="w-[80px] px-3 text-[11px] font-medium text-[var(--color-text-default)] flex items-center gap-1">
                            Size
                            <IconChevronDown size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          </div>
                          <div className="w-[100px] px-3 text-[11px] font-medium text-[var(--color-text-default)]">StorageClass</div>
                          <div className="w-[140px] px-3 text-[11px] font-medium text-[var(--color-text-default)]">ETag</div>
                          <div className="w-[130px] px-3 text-[11px] font-medium text-[var(--color-text-default)] flex items-center gap-1">
                            LastModified
                            <IconChevronDown size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          </div>
                          <div className="w-[60px] px-3 text-[11px] font-medium text-[var(--color-text-default)]">Action</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex flex-col gap-1 mt-1">
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
                      </div>
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
