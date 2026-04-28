import { useState, useEffect, useMemo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  Checkbox,
  SectionCard,
  Table,
  Chip,
  ContextMenu,
  InfoBox,
  PageShell,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { StorageMemberSidebar as StorageSidebar } from '@/components/StorageMemberSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconFile,
  IconDotsVertical,
  IconDotsCircleHorizontal,
  IconFolderOpen,
  IconCirclePlus,
  IconLayoutSidebar,
  IconSelector,
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
  versions?: {
    versionId: string;
    storageClass: string;
    type: string;
    size: string;
    lastModified: string;
  }[];
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
  creationDate: 'Sep 19, 2026 14:30:00',
};

const mockObjectTree: ObjectItem[] = [
  {
    id: 'folder-a',
    name: 'folder A',
    type: 'folder',
    expanded: true,
    children: [
      { id: 'object-a', name: 'object A', type: 'object' },
      { id: 'folder-b', name: 'folder B', type: 'folder' },
      {
        id: 'folder-c',
        name: 'folder C',
        type: 'folder',
        expanded: true,
        children: [
          { id: 'object-b', name: 'object B', type: 'object' },
          {
            id: 'folder-d',
            name: 'folder D',
            type: 'folder',
            expanded: true,
            children: [
              {
                id: 'folder-e',
                name: 'folder E',
                type: 'folder',
                expanded: true,
                children: [
                  {
                    id: 'folder-f',
                    name: 'folder F',
                    type: 'folder',
                    expanded: true,
                    children: [
                      {
                        id: 'folder-g',
                        name: 'folder G',
                        type: 'folder',
                        expanded: true,
                        children: [{ id: 'folder-b2', name: 'folder B', type: 'folder' }],
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
    id: 'object-343da87798e1c6356b47236f21099b63',
    name: '343da87798e1c6356b47236f21099b63.jpg',
    type: 'object',
    owner: '-',
    objectType: 'file',
    size: '51.0 KiB',
    storageClass: 'STANDARD',
    etag: '9ec45b70efc38e0d6',
    lastModified: 'Dec 22, 2026',
    s3Uri: 's3://images/343da87798e1c6356b47236f21099b63.jpg',
    objectUrl:
      'http://10.7.50.253.80/images/343da87798e1c6356b47236f21099b63.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4J350T4JB1JKIZUN1AS4%2F20260107%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T072559Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ea6089c110b3b219b8c2c7d530e67fdd0d2f281064588c1a8db4bb133249e9a1',
    tags: [{ key: '-', value: '-' }],
    versions: [
      {
        versionId: 'null',
        storageClass: 'STANDARD',
        type: 'file',
        size: '51.0 KiB',
        lastModified: 'Dec 22, 2026',
      },
    ],
  },
  {
    id: 'folder-a-table',
    name: 'folder A',
    type: 'folder',
    owner: '-',
    objectType: 'folder',
    size: '-',
    storageClass: 'STANDARD',
    etag: '-',
    lastModified: '-',
  },
];

const OBJECTS_PAGE_SIZE = 10;

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
  const isFolder = item.type === 'folder';

  return (
    <div>
      <div
        className={`
          group flex items-center gap-1 h-[25px] rounded cursor-pointer text-body-md
          ${isSelected ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium' : 'hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]'}
        `}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => onSelect(item.id)}
      >
        {isFolder ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
            className="shrink-0 flex items-center justify-center w-4 h-4"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
          >
            {hasChildren && isExpanded ? (
              <IconChevronDown size={16} stroke={1.5} />
            ) : (
              <IconChevronRight size={16} stroke={1.5} />
            )}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {isFolder ? (
          isExpanded ? (
            <IconFolderOpen
              size={16}
              stroke={1.5}
              className={`shrink-0 ${isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'}`}
            />
          ) : (
            <IconFolder
              size={16}
              stroke={1.5}
              className={`shrink-0 ${isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'}`}
            />
          )
        ) : (
          <IconFile
            size={16}
            stroke={1.5}
            className={`shrink-0 ${isSelected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'}`}
          />
        )}

        <span className="flex-1 truncate">{item.name}</span>

        <button
          type="button"
          aria-label="File actions"
          className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-surface-muted)]"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDotsVertical size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
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

function ObjectRow({
  object,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
}: ObjectRowProps) {
  const isFolder = object.type === 'folder';

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
              type="button"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded shrink-0"
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <IconChevronDown
                  size={12}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              ) : (
                <IconChevronRight
                  size={12}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              )}
            </button>
          )}
          {isFolder ? (
            <IconFolder
              size={14}
              stroke={1.5}
              className="text-[var(--color-text-muted)] shrink-0"
            />
          ) : (
            <IconFile size={14} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
          )}
          <Link
            to={isFolder ? `/storage-member/buckets/${object.id}` : '#'}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-[length:var(--table-font-size)] leading-[var(--table-line-height)] truncate"
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
          <ContextMenu
            trigger="click"
            align="right"
            items={
              isFolder
                ? [
                    {
                      id: 'delete',
                      label: 'Delete',
                      status: 'danger' as const,
                      onClick: () => console.log('Delete folder:', object.name),
                    },
                    {
                      id: 'edit',
                      label: 'Edit Folder',
                      onClick: () => console.log('Edit folder:', object.name),
                    },
                    {
                      id: 'move',
                      label: 'Move folder',
                      onClick: () => console.log('Move folder:', object.name),
                    },
                    {
                      id: 'download',
                      label: 'Download',
                      onClick: () => console.log('Download folder:', object.name),
                    },
                  ]
                : [
                    {
                      id: 'delete',
                      label: 'Delete',
                      status: 'danger' as const,
                      onClick: () => console.log('Delete file:', object.name),
                    },
                    {
                      id: 'edit',
                      label: 'Edit File',
                      onClick: () => console.log('Edit file:', object.name),
                    },
                    {
                      id: 'copy-s3',
                      label: 'Copy S3 URI',
                      onClick: () => console.log('Copy S3 URI:', object.s3Uri),
                    },
                    {
                      id: 'copy-url',
                      label: 'Copy URL',
                      onClick: () => console.log('Copy URL:', object.objectUrl),
                    },
                    {
                      id: 'move',
                      label: 'Move file',
                      onClick: () => console.log('Move file:', object.name),
                    },
                    {
                      id: 'download',
                      label: 'Download',
                      onClick: () => console.log('Download file:', object.name),
                    },
                  ]
            }
          >
            <button
              type="button"
              aria-label="File actions"
              className="w-[25px] h-[25px] flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && !isFolder && (
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          {/* S3 URI & Object URL */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <InfoBox label="S3 URI" value={object.s3Uri || '-'} copyable />
            </div>
            <div className="flex-1 min-w-0">
              <InfoBox label="Object URL" value={object.objectUrl || '-'} copyable />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-[var(--table-row-gap)]">
            <div className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-muted)]">
              Tags
            </div>
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
              <div
                key={idx}
                className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]"
              >
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
            <div className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-muted)]">
              Versions
            </div>
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
              <div
                key={idx}
                className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]"
              >
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>('folder-a');
  const [objectTree, setObjectTree] = useState<ObjectItem[]>(mockObjectTree);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [treeSidebarOpen, setTreeSidebarOpen] = useState(true);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

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
  const filteredObjects = useMemo(
    () =>
      mockTableObjects.filter(
        (obj) =>
          obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          obj.owner?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredObjects.length / OBJECTS_PAGE_SIZE));

  const paginatedObjects = useMemo(
    () =>
      filteredObjects.slice((currentPage - 1) * OBJECTS_PAGE_SIZE, currentPage * OBJECTS_PAGE_SIZE),
    [filteredObjects, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageObjectIds = paginatedObjects.map((o) => o.id);
  const allPageRowsSelected =
    pageObjectIds.length > 0 && pageObjectIds.every((id) => selectedRows.includes(id));

  // Tags table columns
  const tagsColumns: TableColumn<{ key: string; value: string }>[] = [
    { key: 'key', label: 'Key', flex: 1, minWidth: columnMinWidths.key },
    { key: 'value', label: 'Value', flex: 1, minWidth: columnMinWidths.value },
  ];

  // ACL table columns
  const aclColumns: TableColumn<{ grantee: string; permissions: string }>[] = [
    { key: 'grantee', label: 'Grantee', flex: 1, minWidth: columnMinWidths.grantee },
    { key: 'permissions', label: 'Permissions', flex: 1, minWidth: columnMinWidths.permissions },
  ];

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Buckets', href: '/storage-member/buckets' },
                { label: bucketData.name },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6}>
        {/* Page Header with Info Cards */}
        <DetailHeader>
          <DetailHeader.Title>{bucketData.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} stroke={1.5} />}
              onClick={() => navigate(`/storage-member/buckets/${id}/edit`)}
            >
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Used capacity" value={bucketData.usedCapacity} />
            <DetailHeader.InfoCard label="Objects" value={String(bucketData.objects)} />
            <DetailHeader.InfoCard label="Created at" value={bucketData.creationDate} />
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
              {/* Basic information Section */}
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Region" value="Default" showDivider />
                  <SectionCard.DataRow label="Versioning" value="Suspended" />
                  <SectionCard.DataRow label="MFA Delete" value="Disabled" />
                  <SectionCard.DataRow label="Encryption" value="Disabled" />
                  <SectionCard.DataRow label="Index type" value="Normal / Indexless" />
                  <SectionCard.DataRow label="Placement rule" value="hdd" />
                  <SectionCard.DataRow label="Tags">
                    <div className="flex flex-wrap gap-1">
                      <Chip label="key" value="value" />
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Capacity limit %" value="No limit" />
                  <SectionCard.DataRow label="Object limit %" value="No limit" />
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
                    <pre className="text-body-md text-[var(--color-text-default)] whitespace-pre-wrap">
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
              <VStack gap={4}>
                {/* Header Row */}
                <div className="flex items-center justify-between h-7">
                  <div className="flex items-center gap-2">
                    {!treeSidebarOpen && (
                      <button
                        className="p-1 rounded border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-strong)] transition-colors"
                        onClick={() => setTreeSidebarOpen(true)}
                      >
                        <IconLayoutSidebar
                          size={14}
                          stroke={1.5}
                          className="text-[var(--color-text-muted)]"
                        />
                      </button>
                    )}
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">Objects</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                      Create folder
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                      Create object
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Left Sidebar - Objects Tree */}
                  {treeSidebarOpen && (
                    <div className="w-[224px] shrink-0 border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-default)]">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)]">
                        <span className="text-label-md text-[var(--color-text-default)]">
                          Objects
                        </span>
                        <button
                          className="p-1 hover:bg-[var(--color-surface-muted)] rounded"
                          onClick={() => setTreeSidebarOpen(false)}
                        >
                          <IconLayoutSidebar
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-muted)]"
                          />
                        </button>
                      </div>
                      <OverlayScrollbarsComponent
                        options={{ scrollbars: { autoHide: 'scroll', autoHideDelay: 800 } }}
                        defer={false}
                        className="p-2 max-h-[600px]"
                      >
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
                      </OverlayScrollbarsComponent>
                    </div>
                  )}

                  {/* Right Content - Object List */}
                  <VStack gap={3} className="flex-1 min-w-0">
                    {/* Selected folder name */}
                    <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                      {objectTree.find((o) => o.id === selectedTreeItem)?.name ?? 'Objects'}
                    </h3>

                    {/* Search and Actions Row */}
                    <div className="flex items-center gap-2">
                      <div className="w-[280px]">
                        <SearchInput
                          placeholder="Search objects by attributes"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClear={() => setSearchQuery('')}
                          size="sm"
                          fullWidth
                        />
                      </div>
                      <div className="w-px h-4 bg-[var(--color-border-default)]" />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="muted"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedRows.length === 0}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="muted"
                          size="sm"
                          leftIcon={<IconDownload size={12} />}
                          disabled={selectedRows.length === 0}
                        >
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={filteredObjects.length}
                    />

                    {/* Table */}
                    <div className="flex flex-col gap-[var(--table-row-gap)]">
                      {/* Table Header */}
                      <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                        <div className="w-[var(--table-checkbox-width)] flex items-center justify-center shrink-0 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]">
                          <Checkbox
                            checked={allPageRowsSelected}
                            onChange={() => {
                              if (allPageRowsSelected) {
                                setSelectedRows((prev) =>
                                  prev.filter((id) => !pageObjectIds.includes(id))
                                );
                              } else {
                                setSelectedRows((prev) => [
                                  ...new Set([...prev, ...pageObjectIds]),
                                ]);
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                          Name (= Key)
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-disabled)]"
                          />
                        </div>
                        <div className="w-[120px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                          Owner
                        </div>
                        <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                          Type
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-disabled)]"
                          />
                        </div>
                        <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                          Size
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-disabled)]"
                          />
                        </div>
                        <div className="w-[100px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                          StorageClass
                        </div>
                        <div className="w-[140px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                          ETag
                        </div>
                        <div className="w-[130px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center gap-1 border-l border-[var(--color-border-default)]">
                          Last Modified
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-disabled)]"
                          />
                        </div>
                        <div className="w-[60px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
                          Action
                        </div>
                      </div>

                      {/* Table Body */}
                      {paginatedObjects.map((object) => (
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
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default BucketDetailPage;
