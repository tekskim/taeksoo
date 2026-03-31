import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import TcTable from './TcTable';

const meta = {
  title: 'Components/TcTable',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const ROW_DATA = [
  {
    id: 1,
    name: 'John Doe',
    age: 20,
    address: '123 Main St',
    phone: '123-456-7890',
    details: 'Detail A',
  },
  {
    id: 2,
    name: 'Jane Doe',
    age: 21,
    address: '456 Main St',
    phone: '234-567-8901',
    details: 'Detail B',
  },
  {
    id: 3,
    name: 'Jim Doe',
    age: 22,
    address: '789 Main St',
    phone: '345-678-9012',
    details: 'Detail C',
  },
  {
    id: 4,
    name: 'Kim Doe',
    age: 23,
    address: '101 Main St',
    phone: '456-789-0123',
    details: 'Detail D',
  },
  {
    id: 5,
    name: 'Jack Doe',
    age: 24,
    address: '202 Main St',
    phone: '567-890-1234',
    details: 'Detail E',
  },
];

const COLUMN_NAMES = ['Age', 'Name', 'Address', 'Phone'];
const STICKY_COLUMN_NAMES = ['Age', 'Name', 'Address', 'Phone', 'Department', 'Action'];

const renderRow = (
  { id, name, age, address, phone }: (typeof ROW_DATA)[number],
  {
    selectCell,
    expandButton,
  }: { selectCell: () => React.ReactNode; expandButton: () => React.ReactNode }
) => (
  <TcTable.Tr key={id}>
    {selectCell()}
    <TcTable.Td align="left" sortable>
      {expandButton()}
      {age}
    </TcTable.Td>
    <TcTable.Td align="left" sortable>
      {name}
    </TcTable.Td>
    <TcTable.Td align="right">{address}</TcTable.Td>
    <TcTable.Td>{phone}</TcTable.Td>
  </TcTable.Tr>
);

/** 기본 테이블 (체크박스 선택 + 확장) */
export const Default: StoryFn = () => (
  <TcTable.Body
    canMultipleExpand
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="checkbox"
    getSelectValue={(row) => row.id}
    selectedValues={[1, 2]}
    onChange={console.log}
    onSortChange={console.log}
    expandableUI={({ details, id }) => (
      <div className="px-4 py-3 text-xs text-text-muted">{`${details} for row ${id}`}</div>
    )}
    footer={
      <div className="flex items-center justify-between px-3 py-2 text-xs text-text-muted">
        <span>5 rows selected</span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-base6 border border-border bg-surface px-3 py-1 text-text transition-colors hover:bg-border-subtle"
            type="button"
          >
            Prev
          </button>
          <span className="text-text">1 / 3</span>
          <button
            className="rounded-base6 border border-border bg-surface px-3 py-1 text-text transition-colors hover:bg-border-subtle"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    }
  >
    {({ id, age, address, phone }, { selectCell, expandButton }) => (
      <TcTable.Tr key={id}>
        {selectCell()}
        <TcTable.Td sortable align="left">
          {expandButton()}
          {age}
        </TcTable.Td>
        <TcTable.Td sortable suffix={'(+4)'}>
          {'IAM, Compute, Storage, Network, Container, Cloud Builder'}
        </TcTable.Td>
        <TcTable.Td suffix={'(+4)'}>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** 로딩 상태 — 기본 pulse 스켈레톤 */
export const Loading: StoryFn = () => (
  <TcTable.Body isLoading={true} columnNames={COLUMN_NAMES}>
    {renderRow}
  </TcTable.Body>
);

/** 로딩 상태 — 커스텀 스켈레톤 */
export const LoadingCustomSkeleton: StoryFn = () => (
  <TcTable.Body
    isLoading={true}
    columnNames={COLUMN_NAMES}
    numberOfSkeletons={3}
    skeletonUI={<div className="h-[50px] animate-pulse bg-blue-100" />}
  >
    {renderRow}
  </TcTable.Body>
);

/** 에러 상태 — rowData가 없을 때 */
export const Error: StoryFn = () => (
  <TcTable.Body isLoading={false} rowData={null} columnNames={COLUMN_NAMES}>
    {renderRow}
  </TcTable.Body>
);

/** 빈 데이터 */
export const Empty: StoryFn = () => (
  <TcTable.Body isLoading={false} rowData={[]} columnNames={COLUMN_NAMES}>
    {renderRow}
  </TcTable.Body>
);

/** 라디오 선택 */
export const RadioSelection: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="radio"
    getSelectValue={(row) => row.id}
    onChange={console.log}
  >
    {renderRow}
  </TcTable.Body>
);

/** Row 클릭으로 체크박스 선택 */
export const SelectOnRowClick: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="checkbox"
    getSelectValue={(row) => row.id}
    onChange={console.log}
    selectOnRowClick
  >
    {({ id, name, age, address, phone }, { selectCell }) => (
      <TcTable.Tr key={id}>
        {selectCell()}
        <TcTable.Td>{age}</TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** Row 클릭으로 확장 */
export const ExpandOnRowClick: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    expandOnRowClick
    expandableUI={({ details, id }) => (
      <div className="px-4 py-3 text-xs text-text-muted">{`${details} for row ${id}`}</div>
    )}
  >
    {({ id, name, age, address, phone }, { expandButton }) => (
      <TcTable.Tr key={id}>
        <TcTable.Td>
          {expandButton()}
          {age}
        </TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** Row 클릭으로 선택 + 확장 동시 */
export const SelectAndExpandOnRowClick: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="checkbox"
    getSelectValue={(row) => row.id}
    onChange={console.log}
    canMultipleExpand
    selectOnRowClick
    expandOnRowClick
    expandableUI={({ details, id }) => (
      <div className="px-4 py-3 text-xs text-text-muted">{`${details} for row ${id}`}</div>
    )}
  >
    {({ id, name, age, address, phone }, { selectCell, expandButton }) => (
      <TcTable.Tr key={id}>
        {selectCell()}
        <TcTable.Td>
          {expandButton()}
          {age}
        </TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** Disabled Row — 짝수 id는 클릭 비활성 */
export const DisabledRow: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="checkbox"
    getSelectValue={(row) => row.id}
    getDisabled={(row) => row.id % 2 === 0}
    onChange={console.log}
    selectedValues={[2]}
    selectOnRowClick
  >
    {({ id, name, age, address, phone }, { selectCell }) => (
      <TcTable.Tr key={id}>
        {selectCell()}
        <TcTable.Td>{age}</TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** onClick 커스텀 핸들러 */
export const ClickableRow: StoryFn = () => (
  <TcTable.Body isLoading={false} rowData={ROW_DATA} columnNames={COLUMN_NAMES}>
    {({ id, name, age, address, phone }) => (
      <TcTable.Tr key={id} onClick={() => alert(`Clicked row ${id}`)}>
        <TcTable.Td>{age}</TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** 비동기 데이터 로딩 흉내 (loading → data + selectedValues) */
export const AsyncFetch: StoryFn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<typeof ROW_DATA | null>(null);
  const [defaultSelected, setDefaultSelected] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRowData(ROW_DATA);
      setDefaultSelected([1, 3]);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TcTable.Body
      key={isLoading ? 'loading' : 'loaded'}
      isLoading={isLoading}
      rowData={rowData}
      columnNames={COLUMN_NAMES}
      type="checkbox"
      getSelectValue={(row) => row.id}
      selectedValues={defaultSelected}
      onChange={console.log}
      selectOnRowClick
    >
      {({ id, name, age, address, phone }, { selectCell }) => (
        <TcTable.Tr key={id}>
          {selectCell()}
          <TcTable.Td>{age}</TcTable.Td>
          <TcTable.Td>{name}</TcTable.Td>
          <TcTable.Td>{address}</TcTable.Td>
          <TcTable.Td>{phone}</TcTable.Td>
        </TcTable.Tr>
      )}
    </TcTable.Body>
  );
};

/** 비동기 에러 흉내 (loading → error) */
export const AsyncError: StoryFn = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TcTable.Body isLoading={isLoading} rowData={null} columnNames={COLUMN_NAMES}>
      {renderRow}
    </TcTable.Body>
  );
};

/** 컬럼 리사이즈 — 헤더 우측 경계를 드래그하여 너비 조정 */
export const Resizable: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    resizable
    onSortChange={console.log}
  >
    {({ id, name, age, address, phone }) => (
      <TcTable.Tr key={id}>
        <TcTable.Td sortable>{age}</TcTable.Td>
        <TcTable.Td sortable>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** 컬럼 리사이즈 + 체크박스 선택 */
export const ResizableWithCheckbox: StoryFn = () => (
  <TcTable.Body
    isLoading={false}
    rowData={ROW_DATA}
    columnNames={COLUMN_NAMES}
    type="checkbox"
    getSelectValue={(row) => row.id}
    onChange={console.log}
    resizable
  >
    {({ id, name, age, address, phone }, { selectCell }) => (
      <TcTable.Tr key={id}>
        {selectCell()}
        <TcTable.Td>{age}</TcTable.Td>
        <TcTable.Td>{name}</TcTable.Td>
        <TcTable.Td>{address}</TcTable.Td>
        <TcTable.Td>{phone}</TcTable.Td>
      </TcTable.Tr>
    )}
  </TcTable.Body>
);

/** 마지막 컬럼 sticky 고정 */
export const StickyLastColumn: StoryFn = () => (
  <div className="max-w-[620px]">
    <TcTable.Body
      isLoading={false}
      rowData={ROW_DATA}
      columnNames={STICKY_COLUMN_NAMES}
      stickyLastColumn
    >
      {({ id, name, age, address, phone }) => (
        <TcTable.Tr key={id}>
          <TcTable.Td className="min-w-[120px]">{age}</TcTable.Td>
          <TcTable.Td className="min-w-[180px]">{name}</TcTable.Td>
          <TcTable.Td className="min-w-[220px]">{address}</TcTable.Td>
          <TcTable.Td className="min-w-[180px]">{phone}</TcTable.Td>
          <TcTable.Td className="min-w-[220px]">Compute Platform Team</TcTable.Td>
          <TcTable.Td className="min-w-[120px]" align="center">
            View
          </TcTable.Td>
        </TcTable.Tr>
      )}
    </TcTable.Body>
  </div>
);

/** 비동기 빈 데이터 흉내 (loading → empty) */
export const AsyncEmpty: StoryFn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<typeof ROW_DATA>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRowData([]);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TcTable.Body isLoading={isLoading} rowData={rowData} columnNames={COLUMN_NAMES}>
      {renderRow}
    </TcTable.Body>
  );
};
