import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
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
  type TableColumn,
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
  IconFolderPlus,
  IconFilePlus,
  IconCopy,
  IconLink,
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
    id: 'folder-a',
    name: 'folder A',
    type: 'folder',
    expanded: true,
    children: [
      { id: 'object-a', name: 'object A', type: 'object' },
      {
        id: 'folder-b',
        name: 'folder B',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: 'folder-c',
            name: 'folder C',
            type: 'folder',
            children: [
              { id: 'object-b', name: 'object B', type: 'object' },
              {
                id: 'folder-d',
                name: 'folder D',
                type: 'folder',
                children: [
                  {
                    id: 'folder-e',
                    name: 'folder E',
                    type: 'folder',
                    children: [
                      {
                        id: 'folder-f',
                        name: 'folder F',
                        type: 'folder',
                        children: [
                          {
                            id: 'folder-g',
                            name: 'folder G',
                            type: 'folder',
                            children: [
                              { id: 'folder-h', name: 'folder B', type: 'folder' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { id: 'object-c', name: 'object C', type: 'object' },
  { id: 'object-d', name: 'object D', type: 'object' },
];

const mockTableObjects: ObjectItem[] = [
  {
    id: 'folder-b-item',
    name: 'folder B',
    type: 'folder',
    owner: 'cloud_tech$youngnoh.kim',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '6f4bf2328aee1cb6756b2bd1f679ebe0',
    lastModified: '2025-09-19 04:06',
  },
  {
    id: 'object-a-item',
    name: 'object A',
    type: 'object',
    owner: 'cloud_tech$youngnoh.kim',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '6f4bf2328aee1cb6756b2bd1f679ebe0',
    lastModified: '2025-09-19 04:06',
    s3Uri: 'tt://tt/tt/tt.mp4',
    objectUrl: 'tt://tt/tt/tt.mp4',
    tags: [{ key: 'test', value: 'test' }],
    versions: [
      { versionId: '-', storageClass: '-', type: '-', size: '-', lastModified: '-' },
      { versionId: '-', storageClass: '-', type: '-', size: '-', lastModified: '-' },
    ],
  },
  {
    id: 'object-b-item',
    name: 'object B',
    type: 'object',
    owner: 'cloud_tech$youngnoh.kim',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '6f4bf2328aee1cb6756b2bd1f679ebe0',
    lastModified: '2025-09-19 04:06',
    expanded: true,
    s3Uri: 'tt://tt/tt/tt.mp4',
    objectUrl: 'tt://tt/tt/tt.mp4',
    tags: [{ key: 'test', value: 'test' }],
    versions: [
      { versionId: '-', storageClass: '-', type: '-', size: '-', lastModified: '-' },
      { versionId: '-', storageClass: '-', type: '-', size: '-', lastModified: '-' },
    ],
  },
  {
    id: 'folder-c-item',
    name: 'folder C',
    type: 'folder',
    owner: 'cloud_tech$youngnoh.kim',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '6f4bf2328aee1cb6756b2bd1f679ebe0',
    lastModified: '2025-09-19 04:06',
  },
  {
    id: 'object-c-item',
    name: 'object C',
    type: 'object',
    owner: 'cloud_tech$youngnoh.kim',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '6f4bf2328aee1cb6756b2bd1f679ebe0',
    lastModified: '2025-09-19 04:06',
  },
  {
    id: 'object-d-item',
    name: 'object D',
    type: 'object',
    owner: 'ai_innovation$alex.smith',
    objectType: 'Normal',
    size: '2.3 K',
    storageClass: 'STANDARD',
    etag: 'c4cfe7b3ccb62fbd1e9c71de9f0eac9b',
    lastModified: '2025-09-20 10:15',
  },
  {
    id: 'object-e-item',
    name: 'object E',
    type: 'object',
    owner: 'data_analysis$jamie.lee',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: '7b8f2a63e44b98c3d88b2cb1a8fe5o',
    lastModified: '2025-09-21 15:30',
  },
  {
    id: 'object-f-item',
    name: 'object F',
    type: 'object',
    owner: 'ux_design$pat.taylor',
    objectType: 'Normal',
    size: '1.1 K',
    storageClass: 'STANDARD',
    etag: 'a2ffb6d92bf947c2b95028c1a1c0bf67',
    lastModified: '2025-09-22 09:45',
  },
  {
    id: 'object-g-item',
    name: 'object G',
    type: 'object',
    owner: 'web_dev$kim.johnson',
    objectType: 'Normal',
    size: '3.5 K',
    storageClass: 'STANDARD',
    etag: 'f9a2e1c1d397a4c8bf8ac4f2f83c5e6',
    lastModified: '2025-09-23 11:00',
  },
  {
    id: 'object-h-item',
    name: 'object H',
    type: 'object',
    owner: 'blockchain$ryan.miller',
    objectType: 'Normal',
    size: '1.4 K',
    storageClass: 'STANDARD',
    etag: 'b7c2a6be2c4e56d87e1d5b1d8f7b2d65',
    lastModified: '2025-09-24 14:20',
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
          flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-[11px]
          ${isSelected ? 'bg-[var(--color-action-primary)] text-white' : 'hover:bg-[var(--color-surface-subtle)]'}
        `}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => onSelect(item.id)}
      >
        {item.type === 'folder' ? (
          <button
            className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded"
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
          <span className="w-5" />
        )}
        
        {item.type === 'folder' ? (
          <IconFolder size={14} stroke={1.5} className={isSelected ? 'text-white' : 'text-[var(--color-text-muted)]'} />
        ) : (
          <IconFile size={14} stroke={1.5} className={isSelected ? 'text-white' : 'text-[var(--color-text-muted)]'} />
        )}
        
        <span className="flex-1 truncate">{item.name}</span>
        
        <button
          className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${isSelected ? 'hover:bg-white/20' : 'hover:bg-[var(--color-surface-muted)]'}`}
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
   Object Details Expansion Component
   ---------------------------------------- */

interface ObjectDetailsProps {
  object: ObjectItem;
}

function ObjectDetails({ object }: ObjectDetailsProps) {
  return (
    <div className="p-4 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border-subtle)]">
      {/* S3 URI & Object URL */}
      <div className="flex gap-6 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[var(--color-text-muted)]">S3 URI</span>
            <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded">
              <IconCopy size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="text-[11px] text-[var(--color-text-default)]">{object.s3Uri || '-'}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[var(--color-text-muted)]">Object URL</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-default)]">{object.objectUrl || '-'}</div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="text-[11px] text-[var(--color-text-muted)] mb-2">Tags</div>
        <table className="w-full text-[11px] border border-[var(--color-border-default)] rounded">
          <thead>
            <tr className="bg-[var(--color-surface-default)]">
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Key</th>
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {object.tags?.map((tag, idx) => (
              <tr key={idx} className="bg-[var(--color-surface-default)]">
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{tag.key}</td>
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{tag.value}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={2} className="p-2 text-center text-[var(--color-text-muted)]">No tags</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Versions */}
      <div>
        <div className="text-[11px] text-[var(--color-text-muted)] mb-2">Versions</div>
        <table className="w-full text-[11px] border border-[var(--color-border-default)] rounded">
          <thead>
            <tr className="bg-[var(--color-surface-default)]">
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">VersionID</th>
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Storage Class</th>
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Type</th>
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Size</th>
              <th className="text-left p-2 border-b border-[var(--color-border-default)] font-medium">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {object.versions?.map((version, idx) => (
              <tr key={idx} className="bg-[var(--color-surface-default)]">
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{version.versionId}</td>
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{version.storageClass}</td>
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{version.type}</td>
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{version.size}</td>
                <td className="p-2 border-b border-[var(--color-border-subtle)]">{version.lastModified}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={5} className="p-2 text-center text-[var(--color-text-muted)]">No versions</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Bucket Detail Page Component
   ---------------------------------------- */

export function BucketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(2); // Objects tab active
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>('folder-a');
  const [objectTree, setObjectTree] = useState<ObjectItem[]>(mockObjectTree);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>(['object-b-item']);

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

  // Table columns
  const columns: TableColumn<ObjectItem>[] = [
    {
      key: 'name',
      label: 'Name (+ Key)',
      width: 140,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.type === 'object' && (
            <button
              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpansion(row.id);
              }}
            >
              {expandedRows.includes(row.id) ? (
                <IconChevronDown size={12} stroke={1.5} />
              ) : (
                <IconChevronRight size={12} stroke={1.5} />
              )}
            </button>
          )}
          {row.type === 'folder' ? (
            <IconFolder size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
          ) : (
            <IconFile size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
          )}
          <span className="text-[var(--color-action-primary)] font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      width: 180,
      sortable: true,
    },
    {
      key: 'objectType',
      label: 'Type',
      width: 80,
      sortable: true,
      render: (_, row) => row.objectType || '-',
    },
    {
      key: 'size',
      label: 'Size',
      width: 80,
      sortable: true,
    },
    {
      key: 'storageClass',
      label: 'StorageClass',
      width: 100,
      sortable: true,
    },
    {
      key: 'etag',
      label: 'ETag',
      width: 200,
      sortable: true,
    },
    {
      key: 'lastModified',
      label: 'LastModified',
      width: 140,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: 72,
      render: (_, row) => (
        <button
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Action clicked for:', row.name);
          }}
        >
          <IconDotsVertical size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  // Filter objects based on search
  const filteredObjects = mockTableObjects.filter(
    (obj) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected folder name
  const getSelectedFolderName = () => {
    const findFolder = (items: ObjectItem[]): string | null => {
      for (const item of items) {
        if (item.id === selectedTreeItem) return item.name;
        if (item.children) {
          const found = findFolder(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findFolder(objectTree) || 'Root';
  };


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
                      <div className="w-[224px] shrink-0 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)]">
                          <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                            Objects
                          </span>
                          <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded">
                            <IconChevronRight size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
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

                      {/* Right Content - Object List */}
                      <div className="flex-1 min-w-0">
                        {/* Search */}
                        <div className="mb-4">
                          <SearchInput
                            placeholder="Search objects by attributes"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[280px]"
                          />
                        </div>

                        {/* Current Folder Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                              {getSelectedFolderName()}
                            </span>
                            <div className="w-px h-4 bg-[var(--color-border-default)]" />
                            <Button variant="ghost" size="sm">
                              <IconTrash size={12} stroke={1.5} />
                              Delete
                            </Button>
                            <Button variant="ghost" size="sm">
                              <IconDownload size={12} stroke={1.5} />
                              Download
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm">
                              <IconFolderPlus size={12} stroke={1.5} />
                              Create folder
                            </Button>
                            <Button variant="primary" size="sm">
                              <IconFilePlus size={12} stroke={1.5} />
                              Create Object
                            </Button>
                          </div>
                        </div>

                        {/* Pagination */}
                        <div className="mb-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={5}
                            onPageChange={setCurrentPage}
                            totalItems={115}
                          />
                        </div>

                        {/* Table with expandable rows */}
                        <div className="flex flex-col gap-[var(--table-row-gap)]">
                          <Table
                            columns={columns}
                            data={filteredObjects}
                            rowKey="id"
                            selectable
                            selectedKeys={selectedRows}
                            onSelectionChange={setSelectedRows}
                          />
                          
                          {/* Expanded row details (shown below for expanded items) */}
                          {filteredObjects.map((row) => (
                            expandedRows.includes(row.id) && row.type === 'object' && (
                              <ObjectDetails key={`expanded-${row.id}`} object={row} />
                            )
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

