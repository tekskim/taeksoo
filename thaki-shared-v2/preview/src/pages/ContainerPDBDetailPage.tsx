import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Input } from '@shared/components/Input';
import { NumberInput } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Dropdown } from '@shared/components/Dropdown';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconChevronDown,
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconX,
} from '@tabler/icons-react';

const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline truncate block min-w-0';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface MatchingPod {
  name: string;
  createdAt: string;
}

interface Condition {
  condition: string;
  size: string;
  message: string;
  updated: string;
}

interface RecentEvent {
  id: string;
  lastSeen: string;
  type: string;
  reason: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
  name: string;
}

interface PodDisruptionBudgetData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  minAvailable: string;
  maxUnavailable: string;
  selector: Record<string, string>;
  matchingPods: MatchingPod[];
  conditions: Condition[];
  recentEvents: RecentEvent[];
}

type MatchingPodRow = MatchingPod & Record<string, unknown>;
type RecentEventRow = RecentEvent & Record<string, unknown>;

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPdbData: Record<string, PodDisruptionBudgetData> = {
  '1': {
    id: '1',
    name: 'poddisruptionbudgetName',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: { app: 'web' },
    annotations: { description: 'PDB for web application' },
    minAvailable: '2',
    maxUnavailable: '',
    selector: { app: 'web', tier: 'frontend' },
    matchingPods: [
      { name: 'web-deployment-77f6bb9c69-4aw7f', createdAt: 'Jul 25, 2025 10:32:16' },
      { name: 'web-deployment-77f6bb9c69-8xk2p', createdAt: 'Jul 25, 2025 10:32:16' },
      { name: 'web-deployment-77f6bb9c69-9m3qt', createdAt: 'Jul 25, 2025 10:32:16' },
    ],
    conditions: [
      {
        condition: 'ConditionName',
        size: 'True',
        message: '[MessageHeader] Message text',
        updated: 'Nov 10, 2025',
      },
    ],
    recentEvents: [
      {
        id: 'event1',
        lastSeen: '30m',
        type: 'Normal',
        reason: 'reasonText',
        subobject: 'subobjectText',
        source: 'source',
        message: 'Message text',
        firstSeen: '30m',
        count: 1,
        name: 'eventName',
      },
      {
        id: 'event2',
        lastSeen: '30m',
        type: 'Normal',
        reason: 'reasonText',
        subobject: 'subobjectText',
        source: 'source',
        message: 'Message text',
        firstSeen: '30m',
        count: 1,
        name: 'eventName',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'web-pdb',
    status: 'True',
    namespace: 'production',
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: { env: 'production' },
    annotations: {},
    minAvailable: '',
    maxUnavailable: '1',
    selector: { app: 'api' },
    matchingPods: [],
    conditions: [],
    recentEvents: [],
  },
};

const operatorOptions = [
  { value: 'In List', label: 'In List' },
  { value: 'Not In', label: 'Not In' },
  { value: 'Exists', label: 'Exists' },
  { value: 'Does Not Exist', label: 'Does Not Exist' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerPDBDetailPage() {
  const navigate = useNavigate();
  const { pdbId } = useParams<{ pdbId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'budget';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [matchingPodsPage, setMatchingPodsPage] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<(string | number)[]>([]);
  const [appliedEventFilters, setAppliedEventFilters] = useState<FilterKeyWithValue[]>([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [conditionsPage, setConditionsPage] = useState(1);

  const pdbData = mockPdbData[pdbId || '1'] || mockPdbData['1'];

  const labelsCount = Object.keys(pdbData.labels).length;
  const annotationsCount = Object.keys(pdbData.annotations).length;

  const matchingPodsPerPage = 10;
  const paginatedMatchingPods = pdbData.matchingPods.slice(
    (matchingPodsPage - 1) * matchingPodsPerPage,
    matchingPodsPage * matchingPodsPerPage
  );

  const selectorPaginationTotalCount = Math.max(pdbData.matchingPods.length, 50);

  const [sortPods, setSortPods] = useState('');
  const [orderPods, setOrderPods] = useState<SortOrder>('asc');
  const handleSortPods = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSortPods(nextSort ?? '');
    setOrderPods(nextOrder);
  }, []);

  const [sortCond, setSortCond] = useState('');
  const [orderCond, setOrderCond] = useState<SortOrder>('asc');
  const handleSortCond = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSortCond(nextSort ?? '');
    setOrderCond(nextOrder);
  }, []);

  const [sortEvents, setSortEvents] = useState('');
  const [orderEvents, setOrderEvents] = useState<SortOrder>('asc');
  const handleSortEvents = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSortEvents(nextSort ?? '');
    setOrderEvents(nextOrder);
  }, []);

  const eventFilterKeys: FilterKey[] = useMemo(
    () => [
      { key: 'reason', label: 'Reason', type: 'input', placeholder: 'Enter reason...' },
      { key: 'message', label: 'Message', type: 'input', placeholder: 'Enter message...' },
      { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
    ],
    []
  );

  const handleEventFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedEventFilters((prev) => [...prev, filter]);
    setEventsPage(1);
  }, []);

  const handleEventFilterRemove = useCallback((filterId: string) => {
    setAppliedEventFilters((prev) => prev.filter((f) => f.id !== filterId));
    setEventsPage(1);
  }, []);

  const filteredRecentEvents = useMemo(
    () =>
      pdbData.recentEvents.filter((r) =>
        appliedEventFilters.every((f) => {
          const fv = String(f.value ?? '').toLowerCase();
          if (!fv) return true;
          const key = f.key as keyof RecentEvent;
          return String(r[key] ?? '')
            .toLowerCase()
            .includes(fv);
        })
      ),
    [pdbData.recentEvents, appliedEventFilters]
  );

  const matchingPodsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
    ],
    []
  );

  const conditionsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'condition', header: 'Condition', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'message', header: 'Message', sortable: true },
      { key: 'updated', header: 'Updated', sortable: true },
    ],
    []
  );

  const recentEventsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'lastSeen', header: 'Last seen', sortable: true },
      { key: 'type', header: 'Type', sortable: true },
      { key: 'reason', header: 'Reason', sortable: true },
      { key: 'subobject', header: 'Subobject', sortable: true },
      { key: 'source', header: 'Source', sortable: true },
      { key: 'message', header: 'Message', sortable: true },
      { key: 'firstSeen', header: 'First seen', sortable: true },
      { key: 'count', header: 'Count', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={pdbData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {pdbData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link
            to={`/container/namespaces/${encodeURIComponent(pdbData.namespace)}`}
            className="text-12 font-medium text-primary hover:underline"
          >
            {pdbData.namespace}
          </Link>
        ),
      },
      { label: 'Created at', value: pdbData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0
            ? Object.entries(pdbData.labels)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'labels',
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0
            ? Object.entries(pdbData.annotations)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'annotations',
      },
    ],
    [annotationsCount, labelsCount, pdbData]
  );

  const conditionRows = pdbData.conditions as (Condition & Record<string, unknown>)[];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Pod Disruption Budget: ${pdbData.name}`}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                type="button"
                onClick={toggle}
              >
                More actions
                <IconChevronDown size={12} stroke={1.5} />
              </Button>
            )}
          >
            <ContextMenu.Item action={() => console.log('Edit Config')}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Edit YAML')}>Edit YAML</ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download YAML')}>
              Download YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
        infoFields={infoFields}
      />

      <div className="flex flex-col h-fit w-full">
        <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
          <Tab id="budget" label="Budget">
            <div className="w-full border border-border rounded-lg p-4 pt-4">
              <div className="flex flex-col gap-6">
                <h3 className="text-16 font-semibold leading-6 text-text m-0">Budget</h3>

                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Min. available pods</span>
                    <div className="flex gap-3 items-center">
                      <NumberInput
                        value={Number(pdbData.minAvailable) || 0}
                        onChange={() => {}}
                        min={0}
                        size="sm"
                        disabled
                      />
                      <span className="text-12 text-text">Pods</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Max. unavailable pods</span>
                    <div className="flex gap-3 items-center">
                      <NumberInput
                        value={Number(pdbData.maxUnavailable) || 0}
                        onChange={() => {}}
                        min={0}
                        size="sm"
                        disabled
                      />
                      <span className="text-12 text-text">Pods</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>

          <Tab id="selector" label="Selector">
            <div className="w-full border border-border rounded-md p-4 pt-4">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-16 font-semibold leading-6 text-text m-0">Selectors</h3>

                  <div className="w-full border border-border rounded-md p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 w-full">
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Key</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Operator</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Value</span>
                        </div>
                      </div>

                      {Object.entries(pdbData.selector).length > 0 ? (
                        Object.entries(pdbData.selector).map(([key, value]) => (
                          <div key={key} className="flex gap-2 w-full">
                            <div className="flex-1 min-w-0">
                              <Input
                                value={key}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full bg-surface-muted"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Dropdown.Select
                                value="In List"
                                onChange={() => {}}
                                size="md"
                                disabled
                              >
                                {operatorOptions.map((opt) => (
                                  <Dropdown.Option
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                  />
                                ))}
                              </Dropdown.Select>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full bg-surface-muted"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-12 leading-18 text-text-muted m-0">
                          No selectors configured.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-13 font-medium text-text">
                    Matching pods ({pdbData.matchingPods.length}/10)
                  </span>

                  <Pagination
                    totalCount={selectorPaginationTotalCount}
                    size={matchingPodsPerPage}
                    currentAt={matchingPodsPage}
                    onPageChange={setMatchingPodsPage}
                    totalCountLabel="items"
                  />

                  <Table<MatchingPodRow>
                    columns={matchingPodsColumns}
                    rows={paginatedMatchingPods as MatchingPodRow[]}
                    sort={sortPods}
                    order={orderPods}
                    onSortChange={handleSortPods}
                  >
                    {paginatedMatchingPods.map((row) => (
                      <Table.Tr key={row.name} rowData={row as MatchingPodRow}>
                        <Table.Td rowData={row as MatchingPodRow} column={matchingPodsColumns[0]}>
                          <Link
                            to={`/container/pods/${encodeURIComponent(row.name)}`}
                            className={`${linkClass} max-w-full`}
                            title={row.name}
                          >
                            {row.name}
                          </Link>
                        </Table.Td>
                        <Table.Td rowData={row as MatchingPodRow} column={matchingPodsColumns[1]}>
                          {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </div>
              </div>
            </div>
          </Tab>

          <Tab id="conditions" label="Conditions">
            <div className="flex flex-col gap-3 pt-4">
              <h3 className="text-16 font-semibold leading-6 text-text m-0">Conditions</h3>

              <Pagination
                totalCount={pdbData.conditions.length}
                size={10}
                currentAt={conditionsPage}
                onPageChange={setConditionsPage}
                totalCountLabel="items"
              />

              {pdbData.conditions.length > 0 ? (
                <Table<Condition & Record<string, unknown>>
                  columns={conditionsColumns}
                  rows={conditionRows}
                  sort={sortCond}
                  order={orderCond}
                  onSortChange={handleSortCond}
                >
                  {pdbData.conditions.map((row, idx) => (
                    <Table.Tr
                      key={`${row.condition}-${idx}`}
                      rowData={row as Condition & Record<string, unknown>}
                    >
                      <Table.Td
                        rowData={row as Condition & Record<string, unknown>}
                        column={conditionsColumns[0]}
                      >
                        {row.condition}
                      </Table.Td>
                      <Table.Td
                        rowData={row as Condition & Record<string, unknown>}
                        column={conditionsColumns[1]}
                      >
                        {row.size}
                      </Table.Td>
                      <Table.Td
                        rowData={row as Condition & Record<string, unknown>}
                        column={conditionsColumns[2]}
                      >
                        {row.message}
                      </Table.Td>
                      <Table.Td
                        rowData={row as Condition & Record<string, unknown>}
                        column={conditionsColumns[3]}
                      >
                        {row.updated}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table>
              ) : (
                <p className="text-12 leading-18 text-text-muted m-0">No conditions available.</p>
              )}
            </div>
          </Tab>

          <Tab id="labels-annotations" label="Labels & annotations">
            <div className="w-full border border-border rounded-lg p-4 pt-4">
              <div className="flex flex-col gap-6">
                <h3 className="text-16 font-semibold leading-6 text-text m-0">
                  Labels & annotations
                </h3>

                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-13 font-medium text-text m-0">Labels</h4>
                  <div className="w-full border border-border rounded-md p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 w-full">
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Key</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Value</span>
                        </div>
                      </div>
                      {labelsCount > 0 ? (
                        Object.entries(pdbData.labels).map(([key, value]) => (
                          <div key={key} className="flex gap-2 w-full">
                            <div className="flex-1 min-w-0">
                              <Input
                                value={key}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-12 leading-18 text-text-muted m-0">
                          No labels configured.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-13 font-medium text-text m-0">Annotations</h4>
                  <div className="w-full border border-border rounded-md p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 w-full">
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Key</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-13 font-medium text-text">Value</span>
                        </div>
                      </div>
                      {annotationsCount > 0 ? (
                        Object.entries(pdbData.annotations).map(([key, value]) => (
                          <div key={key} className="flex gap-2 w-full">
                            <div className="flex-1 min-w-0">
                              <Input
                                value={key}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                disabled
                                className="w-full"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-12 leading-18 text-text-muted m-0">
                          No annotations configured.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>

          <Tab id="recent-events" label="Recent events">
            <div className="flex flex-col gap-3 pt-4">
              <h3 className="text-16 font-semibold leading-6 text-text m-0">Recent events</h3>

              <div className="flex gap-2 items-center w-full flex-wrap">
                <FilterSearchInput
                  filterKeys={eventFilterKeys}
                  onFilterAdd={handleEventFilterAdd}
                  selectedFilters={appliedEventFilters}
                  placeholder="Search events by attributes"
                  defaultFilterKey="name"
                />
                <div className="w-px h-5 bg-border shrink-0" />
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    disabled={selectedEvents.length === 0}
                  >
                    <IconDownload size={12} stroke={1.5} /> Download YAML
                  </Button>
                  <Button
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    disabled={selectedEvents.length === 0}
                  >
                    <IconTrash size={12} stroke={1.5} /> Delete
                  </Button>
                </div>
              </div>

              {appliedEventFilters.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {appliedEventFilters.map((filter) => (
                    <span
                      key={filter.id}
                      className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                    >
                      {filter.label}: {filter.displayValue ?? filter.value}
                      <button
                        type="button"
                        className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                        onClick={() => handleEventFilterRemove(filter.id!)}
                        aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                      >
                        <IconX size={12} strokeWidth={2} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <Pagination
                totalCount={filteredRecentEvents.length}
                size={10}
                currentAt={eventsPage}
                onPageChange={setEventsPage}
                totalCountLabel="items"
                selectedCount={selectedEvents.length}
              />

              {filteredRecentEvents.length > 0 ? (
                <SelectableTable<RecentEventRow>
                  columns={recentEventsColumns}
                  rows={filteredRecentEvents as RecentEventRow[]}
                  selectionType="checkbox"
                  selectedRows={selectedEvents}
                  onRowSelectionChange={setSelectedEvents}
                  getRowId={(row) => row.id}
                  sort={sortEvents}
                  order={orderEvents}
                  onSortChange={handleSortEvents}
                  stickyLastColumn
                >
                  {filteredRecentEvents.map((row) => (
                    <Table.Tr key={row.id} rowData={row as RecentEventRow}>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[0]}>
                        {row.lastSeen}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[1]}>
                        {row.type}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[2]}>
                        {row.reason}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[3]}>
                        {row.subobject}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[4]}>
                        {row.source}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[5]}>
                        {row.message}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[6]}>
                        {row.firstSeen}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[7]}>
                        {row.count}
                      </Table.Td>
                      <Table.Td rowData={row as RecentEventRow} column={recentEventsColumns[8]}>
                        <Link
                          to={`/container/events/${encodeURIComponent(row.name)}`}
                          className={linkClass}
                          title={row.name}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.name}
                        </Link>
                      </Table.Td>
                      <Table.Td
                        rowData={row as RecentEventRow}
                        column={recentEventsColumns[9]}
                        preventClickPropagation
                      >
                        <div className="flex justify-center w-full">
                          <ContextMenu.Root
                            direction="bottom-end"
                            gap={4}
                            trigger={({ toggle }) => (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggle();
                                }}
                                className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                                aria-label="Row actions"
                              >
                                <IconDotsCircleHorizontal
                                  size={16}
                                  stroke={1.5}
                                  className="text-text-muted"
                                />
                              </button>
                            )}
                          >
                            <ContextMenu.Item action={() => console.log('View:', row.id)}>
                              View details
                            </ContextMenu.Item>
                            <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
                              Delete
                            </ContextMenu.Item>
                          </ContextMenu.Root>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </SelectableTable>
              ) : (
                <p className="text-12 leading-18 text-text-muted m-0">No recent events.</p>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
