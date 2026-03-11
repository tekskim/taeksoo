import { useState, useMemo, useCallback } from 'react';
import {
  VStack,
  HStack,
  Badge,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ProgressBar,
  PageHeader,
  Drawer,
  FormField,
  Input,
  Textarea,
  Select,
  ConfirmModal,
  SearchInput,
} from '@/design-system';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconGripVertical,
  IconCircleCheck,
  IconCircle,
} from '@tabler/icons-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type TodoStatus = 'todo' | 'in-progress' | 'done';
type TodoCategory = 'feature' | 'bug' | 'enhancement' | 'refactor';
type TodoPriority = 'p0' | 'p1' | 'p2' | 'p3';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  category: TodoCategory;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
  order: number;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: 'todo', label: 'TODO' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug', label: 'Bug' },
  { value: 'enhancement', label: 'Enhancement' },
  { value: 'refactor', label: 'Refactor' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 'p0', label: 'P0 Critical' },
  { value: 'p1', label: 'P1 High' },
  { value: 'p2', label: 'P2 Medium' },
  { value: 'p3', label: 'P3 Low' },
];

const CATEGORY_THEME: Record<TodoCategory, string> = {
  feature: 'blue',
  bug: 'red',
  enhancement: 'green',
  refactor: 'yellow',
};

const PRIORITY_THEME: Record<TodoPriority, string> = {
  p0: 'red',
  p1: 'yellow',
  p2: 'blue',
  p3: 'white',
};

const PRIORITY_BADGE_TYPE: Record<TodoPriority, 'solid' | 'subtle'> = {
  p0: 'solid',
  p1: 'solid',
  p2: 'subtle',
  p3: 'subtle',
};

const PRIORITY_LABEL: Record<TodoPriority, string> = {
  p0: 'P0',
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
};

const STATUS_LABEL: Record<TodoStatus, string> = {
  todo: 'TODO',
  'in-progress': 'In Progress',
  done: 'Done',
};

const STATUS_INDICATOR: Record<TodoStatus, 'muted' | 'building' | 'active'> = {
  todo: 'muted',
  'in-progress': 'building',
  done: 'active',
};

const COLUMNS: TodoStatus[] = ['todo', 'in-progress', 'done'];

/* ----------------------------------------
   useTodoStore Hook
   ---------------------------------------- */

const STORAGE_KEY = 'tds-project-todos';

function loadItems(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TodoItem[];
  } catch {
    return [];
  }
}

function saveItems(items: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function useTodoStore() {
  const [items, setItems] = useState<TodoItem[]>(loadItems);

  const persist = useCallback((next: TodoItem[]) => {
    setItems(next);
    saveItems(next);
  }, []);

  const add = useCallback(
    (data: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
      const now = new Date().toISOString();
      const maxOrder = items
        .filter((i) => i.status === data.status)
        .reduce((m, i) => Math.max(m, i.order), -1);
      const item: TodoItem = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        order: maxOrder + 1,
      };
      persist([...items, item]);
    },
    [items, persist]
  );

  const update = useCallback(
    (id: string, data: Partial<Omit<TodoItem, 'id' | 'createdAt'>>) => {
      persist(
        items.map((i) => (i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i))
      );
    },
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const reorder = useCallback(
    (nextItems: TodoItem[]) => {
      persist(nextItems);
    },
    [persist]
  );

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.status === 'done').length;
    return { total, done };
  }, [items]);

  return { items, add, update, remove, reorder, stats };
}

/* ----------------------------------------
   Sortable Kanban Card
   ---------------------------------------- */

function KanbanCard({
  item,
  onEdit,
  onDelete,
  onToggleDone,
  isDragOverlay,
}: {
  item: TodoItem;
  onEdit: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
  onToggleDone: (item: TodoItem) => void;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const catLabel = CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category;
  const isDone = item.status === 'done';

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      className={`group bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-3 cursor-grab active:cursor-grabbing ${
        isDragOverlay ? 'shadow-lg ring-2 ring-[var(--color-border-focus)]' : ''
      } ${isDone ? 'opacity-60' : ''}`}
      {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
    >
      <VStack gap={2} align="stretch">
        <HStack justify="between" align="start">
          <HStack gap={2} align="start" className="flex-1 mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDone(item);
              }}
              className={`shrink-0 mt-0.5 cursor-pointer transition-colors ${
                isDone
                  ? 'text-[var(--color-state-success)]'
                  : 'text-[var(--color-text-disabled)] hover:text-[var(--color-state-success)]'
              }`}
              aria-label={isDone ? 'Undo done' : 'Mark as done'}
            >
              {isDone ? <IconCircleCheck size={16} /> : <IconCircle size={16} />}
            </button>
            <span
              className={`text-label-md line-clamp-2 ${isDone ? 'line-through text-[var(--color-text-subtle)]' : 'text-[var(--color-text-default)]'}`}
            >
              {item.title}
            </span>
          </HStack>
          <HStack gap={1} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-subtle)] cursor-pointer"
              aria-label="Edit"
            >
              <IconEdit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-state-danger-bg)] text-[var(--color-text-subtle)] hover:text-[var(--color-state-danger)] cursor-pointer"
              aria-label="Delete"
            >
              <IconTrash size={14} />
            </button>
          </HStack>
        </HStack>
        {item.description && (
          <span className="text-body-sm text-[var(--color-text-subtle)] line-clamp-2">
            {item.description}
          </span>
        )}
        <HStack gap={1} align="center">
          <Badge size="sm" type="subtle" theme={CATEGORY_THEME[item.category] as never}>
            {catLabel}
          </Badge>
          <Badge
            size="sm"
            type={PRIORITY_BADGE_TYPE[item.priority]}
            theme={PRIORITY_THEME[item.priority] as never}
          >
            {PRIORITY_LABEL[item.priority]}
          </Badge>
        </HStack>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   Kanban Column
   ---------------------------------------- */

function KanbanColumn({
  status,
  items,
  onEdit,
  onDelete,
  onToggleDone,
}: {
  status: TodoStatus;
  items: TodoItem[];
  onEdit: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
  onToggleDone: (item: TodoItem) => void;
}) {
  const { setNodeRef } = useSortable({
    id: `column-${status}`,
    data: { type: 'column', status },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[240px] bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3 flex flex-col gap-2"
    >
      <HStack gap={2} align="center" className="mb-1 px-1">
        <span className="text-label-md text-[var(--color-text-default)]">
          {STATUS_LABEL[status]}
        </span>
        <Badge size="sm" type="subtle" theme="white">
          {items.length}
        </Badge>
      </HStack>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[60px]">
          {items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleDone={onToggleDone}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

/* ----------------------------------------
   Sortable Table Row
   ---------------------------------------- */

function SortableRow({
  item,
  onEdit,
  onDelete,
  onStatusCycle,
  onToggleDone,
}: {
  item: TodoItem;
  onEdit: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
  onStatusCycle: (item: TodoItem) => void;
  onToggleDone: (item: TodoItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const catLabel = CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category;
  const isDone = item.status === 'done';

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors ${isDone ? 'opacity-60' : ''}`}
    >
      <td className="py-2 px-2 w-[32px]">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[var(--color-text-disabled)] hover:text-[var(--color-text-muted)]"
        >
          <IconGripVertical size={14} />
        </span>
      </td>
      <td className="py-2 px-1 w-[32px] align-middle">
        <button
          onClick={() => onToggleDone(item)}
          className={`flex items-center cursor-pointer transition-colors ${
            isDone
              ? 'text-[var(--color-state-success)]'
              : 'text-[var(--color-text-disabled)] hover:text-[var(--color-state-success)]'
          }`}
          aria-label={isDone ? 'Undo done' : 'Mark as done'}
        >
          {isDone ? <IconCircleCheck size={16} /> : <IconCircle size={16} />}
        </button>
      </td>
      <td className="py-2 px-3 w-[120px]">
        <button
          onClick={() => onStatusCycle(item)}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-full)] text-body-sm cursor-pointer transition-colors ${
            isDone
              ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]'
              : item.status === 'in-progress'
                ? 'bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isDone
                ? 'bg-[var(--color-state-success)]'
                : item.status === 'in-progress'
                  ? 'bg-[var(--color-state-info)]'
                  : 'bg-[var(--color-text-disabled)]'
            }`}
          />
          {STATUS_LABEL[item.status]}
        </button>
      </td>
      <td className="py-2 px-3">
        <VStack gap={0.5}>
          <span
            className={`text-label-md ${isDone ? 'line-through text-[var(--color-text-subtle)]' : 'text-[var(--color-text-default)]'}`}
          >
            {item.title}
          </span>
          {item.description && (
            <span className="text-body-sm text-[var(--color-text-subtle)] line-clamp-1">
              {item.description}
            </span>
          )}
        </VStack>
      </td>
      <td className="py-2 px-3 w-[110px]">
        <Badge size="sm" type="subtle" theme={CATEGORY_THEME[item.category] as never}>
          {catLabel}
        </Badge>
      </td>
      <td className="py-2 px-3 w-[80px]">
        <Badge
          size="sm"
          type={PRIORITY_BADGE_TYPE[item.priority]}
          theme={PRIORITY_THEME[item.priority] as never}
        >
          {PRIORITY_LABEL[item.priority]}
        </Badge>
      </td>
      <td className="py-2 px-3 w-[100px] text-body-sm text-[var(--color-text-subtle)] text-right">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="py-2 px-3 w-[72px]">
        <HStack gap={1} justify="center">
          <button
            onClick={() => onEdit(item)}
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-subtle)] cursor-pointer"
            aria-label="Edit"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-state-danger-bg)] text-[var(--color-text-subtle)] hover:text-[var(--color-state-danger)] cursor-pointer"
            aria-label="Delete"
          >
            <IconTrash size={14} />
          </button>
        </HStack>
      </td>
    </tr>
  );
}

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export function DesignTodoPage() {
  const { items, add, update, remove, reorder, stats } = useTodoStore();

  // View state
  const [viewTab, setViewTab] = useState<string>('kanban');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<TodoStatus>('todo');
  const [formCategory, setFormCategory] = useState<TodoCategory>('feature');
  const [formPriority, setFormPriority] = useState<TodoPriority>('p2');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<TodoItem | null>(null);

  // DnD state
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // -- Filtering --

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.description?.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const columnItems = useMemo(() => {
    const map: Record<TodoStatus, TodoItem[]> = { todo: [], 'in-progress': [], done: [] };
    for (const item of filteredItems) {
      map[item.status].push(item);
    }
    for (const key of COLUMNS) {
      map[key].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [filteredItems]);

  // -- Toggle done --

  const toggleDone = useCallback(
    (item: TodoItem) => {
      if (item.status === 'done') {
        update(item.id, { status: 'todo' });
      } else {
        update(item.id, { status: 'done' });
      }
    },
    [update]
  );

  // -- Drawer handlers --

  const openCreateDrawer = useCallback(() => {
    setEditingItem(null);
    setFormTitle('');
    setFormDescription('');
    setFormStatus('todo');
    setFormCategory('feature');
    setFormPriority('p2');
    setHasAttemptedSubmit(false);
    setDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((item: TodoItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description ?? '');
    setFormStatus(item.status);
    setFormCategory(item.category);
    setFormPriority(item.priority);
    setHasAttemptedSubmit(false);
    setDrawerOpen(true);
  }, []);

  const handleDrawerSave = useCallback(() => {
    setHasAttemptedSubmit(true);
    if (!formTitle.trim()) return;

    if (editingItem) {
      update(editingItem.id, {
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        status: formStatus,
        category: formCategory,
        priority: formPriority,
      });
    } else {
      add({
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        status: formStatus,
        category: formCategory,
        priority: formPriority,
      });
    }
    setDrawerOpen(false);
  }, [
    editingItem,
    formTitle,
    formDescription,
    formStatus,
    formCategory,
    formPriority,
    add,
    update,
  ]);

  // -- Status cycle --

  const cycleStatus = useCallback(
    (item: TodoItem) => {
      const order: TodoStatus[] = ['todo', 'in-progress', 'done'];
      const idx = order.indexOf(item.status);
      const next = order[(idx + 1) % order.length];
      update(item.id, { status: next });
    },
    [update]
  );

  // -- DnD handlers (Kanban) --

  const findContainer = useCallback(
    (id: string): TodoStatus | null => {
      if (id.startsWith('column-')) return id.replace('column-', '') as TodoStatus;
      const item = items.find((i) => i.id === id);
      return item?.status ?? null;
    },
    [items]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id as string);
      const overContainer = findContainer(over.id as string);

      if (!activeContainer || !overContainer || activeContainer === overContainer) return;

      const activeItem = items.find((i) => i.id === active.id);
      if (!activeItem) return;

      const overItems = items
        .filter((i) => i.status === overContainer)
        .sort((a, b) => a.order - b.order);
      const maxOrder = overItems.length > 0 ? overItems[overItems.length - 1].order + 1 : 0;

      const next = items.map((i) =>
        i.id === active.id
          ? { ...i, status: overContainer, order: maxOrder, updatedAt: new Date().toISOString() }
          : i
      );
      reorder(next);
    },
    [items, findContainer, reorder]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeContainer = findContainer(active.id as string);
      const overContainer = findContainer(over.id as string);

      if (!activeContainer || !overContainer) return;

      if (activeContainer === overContainer) {
        const colItems = items
          .filter((i) => i.status === activeContainer)
          .sort((a, b) => a.order - b.order);

        const oldIndex = colItems.findIndex((i) => i.id === active.id);
        const newIndex = colItems.findIndex((i) => i.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(colItems, oldIndex, newIndex).map((item, idx) => ({
          ...item,
          order: idx,
        }));

        const otherItems = items.filter((i) => i.status !== activeContainer);
        reorder([...otherItems, ...reordered]);
      }
    },
    [items, findContainer, reorder]
  );

  // -- DnD handlers (List) --

  const handleListDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const sorted = [...filteredItems].sort((a, b) => a.order - b.order);
      const oldIndex = sorted.findIndex((i) => i.id === active.id);
      const newIndex = sorted.findIndex((i) => i.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(sorted, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        order: idx,
      }));

      const filteredIds = new Set(filteredItems.map((i) => i.id));
      const otherItems = items.filter((i) => !filteredIds.has(i.id));
      reorder([...otherItems, ...reordered]);
    },
    [items, filteredItems, reorder]
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const listSorted = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const statusOrder = { todo: 0, 'in-progress': 1, done: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.order - b.order;
    });
  }, [filteredItems]);

  const titleErrorMsg = hasAttemptedSubmit && !formTitle.trim() ? 'Title is required' : null;

  return (
    <VStack gap={6} align="stretch">
      {/* Header */}
      <PageHeader
        title="Project TODO"
        titleExtra={
          <Badge size="sm" type="subtle" theme="white">
            {stats.total}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<IconPlus size={12} />}
            onClick={openCreateDrawer}
          >
            Add TODO
          </Button>
        }
      />

      {/* Progress */}
      {stats.total > 0 && (
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          <HStack justify="between" align="center" className="mb-2">
            <span className="text-label-md text-[var(--color-text-default)]">Progress</span>
            <span className="text-body-sm text-[var(--color-text-muted)]">
              {stats.done}/{stats.total} done ({percent}%)
            </span>
          </HStack>
          <ProgressBar
            variant="quota"
            value={stats.done}
            max={stats.total}
            showValue={false}
            thresholds={{ warning: 30, danger: 10 }}
          />
        </div>
      )}

      {/* Search */}
      <SearchInput
        placeholder="Search TODO..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="sm"
        className="w-[240px]"
      />

      {/* View Tabs */}
      <Tabs value={viewTab} onChange={setViewTab} variant="underline" size="sm">
        <TabList>
          <Tab value="kanban">Kanban Board</Tab>
          <Tab value="list">List View</Tab>
        </TabList>

        <TabPanel value="kanban" className="pt-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-2">
              {COLUMNS.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  items={columnItems[status]}
                  onEdit={openEditDrawer}
                  onDelete={setDeleteTarget}
                  onToggleDone={toggleDone}
                />
              ))}
            </div>
            <DragOverlay>
              {activeItem ? (
                <KanbanCard
                  item={activeItem}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onToggleDone={() => {}}
                  isDragOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabPanel>

        <TabPanel value="list" className="pt-4">
          {listSorted.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-body-md text-[var(--color-text-subtle)]">
              {items.length === 0
                ? 'No TODO items yet. Click "Add TODO" to get started.'
                : 'No items match the current filters.'}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleListDragEnd}
            >
              <SortableContext
                items={listSorted.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                        <th className="py-2 px-2 w-[32px]" />
                        <th className="py-2 px-1 w-[32px]" />
                        <th className="py-2 px-3 text-left text-label-sm text-[var(--color-text-subtle)] w-[120px]">
                          Status
                        </th>
                        <th className="py-2 px-3 text-left text-label-sm text-[var(--color-text-subtle)]">
                          Title
                        </th>
                        <th className="py-2 px-3 text-left text-label-sm text-[var(--color-text-subtle)] w-[110px]">
                          Category
                        </th>
                        <th className="py-2 px-3 text-left text-label-sm text-[var(--color-text-subtle)] w-[80px]">
                          Priority
                        </th>
                        <th className="py-2 px-3 text-right text-label-sm text-[var(--color-text-subtle)] w-[100px]">
                          Created
                        </th>
                        <th className="py-2 px-3 text-center text-label-sm text-[var(--color-text-subtle)] w-[72px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSorted.map((item) => (
                        <SortableRow
                          key={item.id}
                          item={item}
                          onEdit={openEditDrawer}
                          onDelete={setDeleteTarget}
                          onStatusCycle={cycleStatus}
                          onToggleDone={toggleDone}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabPanel>
      </Tabs>

      {/* Create/Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingItem ? 'Edit TODO' : 'Add TODO'}
        width={360}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDrawerSave} className="flex-1">
              {editingItem ? 'Save' : 'Create'}
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <FormField
            label="Title"
            required
            error={!!titleErrorMsg}
            errorMessage={titleErrorMsg ?? undefined}
          >
            <Input
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
                if (hasAttemptedSubmit) setHasAttemptedSubmit(false);
              }}
              placeholder="Enter TODO title"
              fullWidth
              error={!!titleErrorMsg}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Optional description"
              fullWidth
              rows={3}
            />
          </FormField>

          <FormField label="Status">
            <Select
              options={STATUS_OPTIONS}
              value={formStatus}
              onChange={(val) => setFormStatus(val as TodoStatus)}
              fullWidth
            />
          </FormField>

          <FormField label="Category">
            <Select
              options={CATEGORY_OPTIONS}
              value={formCategory}
              onChange={(val) => setFormCategory(val as TodoCategory)}
              fullWidth
            />
          </FormField>

          <FormField label="Priority">
            <Select
              options={PRIORITY_OPTIONS}
              value={formPriority}
              onChange={(val) => setFormPriority(val as TodoPriority)}
              fullWidth
            />
          </FormField>
        </VStack>
      </Drawer>

      {/* Delete ConfirmModal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            remove(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete TODO"
        description="This action cannot be undone."
        infoLabel="Title"
        infoValue={deleteTarget?.title}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </VStack>
  );
}
