import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table, SelectableTable, ExpandableTable } from '.';
import Layout from '../Layout';
import { Button } from '../Button';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## 스타일 옵션

### 컬럼 정렬 (Alignment)
- **left**: 왼쪽 정렬 (기본값)
- **center**: 가운데 정렬
- **right**: 오른쪽 정렬

### 상태 (State)
- **기본 상태**: 데이터 표시
- **로딩 상태**: 스켈레톤 UI 표시
- **빈 상태**: No Data 메시지 표시
- **에러 상태**: 에러 행 강조 표시
- **선택 상태**: 체크박스/라디오 선택 (SelectableTable)

## 주요 기능
- **정렬**: 컬럼 헤더 클릭으로 오름차순/내림차순 정렬 (API 표준)
- **선택**: 체크박스/라디오 버튼으로 행 선택 (SelectableTable)
- **컬럼 리사이징**: 드래그로 컬럼 너비 조정
- **고정 컬럼**: 마지막 컬럼 고정 (가로 스크롤 시)
- **행 클릭**: 전체 행 클릭 이벤트 처리
- **커스텀 렌더링**: Table.Tr, Table.Td로 셀 내용 자유롭게 구성
- **성능 최적화**: React.memo로 불필요한 리렌더링 방지

## 사용 가이드라인

### 언제 사용하나요?
- 구조화된 데이터를 행과 열로 표시할 때
- 많은 항목을 정렬하거나 비교해야 할 때
- 데이터를 선택하거나 일괄 작업이 필요할 때
- 상세 정보 페이지로 이동할 링크가 필요할 때

### 언제 사용하지 말아야 하나요?
- 데이터가 3개 이하로 적을 때 (카드나 리스트 권장)
- 모바일에서 복잡한 테이블 (간단한 리스트 권장)
- 계층 구조 데이터 (트리 뷰 권장)
- 실시간 업데이트가 빈번한 경우 (부분 업데이트 고려)

### 사용 팁
- **컬럼 개수**: 5-8개 이하 권장 (모바일 3-5개)
- **컬럼 너비**: 고정 너비 지정으로 레이아웃 안정성 확보
- **정렬**: 자주 정렬하는 컬럼만 sortable: true 설정
- **선택**: 단일 선택은 radio, 다중 선택은 checkbox 사용
- **고정 컬럼**: 액션 버튼이나 중요 정보는 마지막 컬럼에 배치
- **로딩**: isLoading과 loadingRowCount로 스켈레톤 표시
- **커스텀**: 복잡한 셀은 Table.Td로 직접 렌더링

## 접근성
- **키보드 지원**: Tab 키로 포커스 이동
- **행 선택**: 체크박스/라디오는 키보드로 조작 가능
- **정렬**: Enter 키로 정렬 토글
- **스크린 리더**: 테이블 구조와 헤더 정보 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 공통 데이터
type User = {
  id: number;
  name: string;
  os: string;
  cpu: string;
  status: 'active' | 'inactive' | 'error';
  image?: string;
};

const sampleData: User[] = [
  {
    id: 1,
    name: 'th.tiny',
    os: 'Ubuntu 22.04 LTS',
    cpu: '2',
    status: 'active',
    image: 'Custom',
  },
  {
    id: 2,
    name: 'web-server',
    os: 'CentOS 7',
    cpu: '4',
    status: 'active',
    image: 'Built in',
  },
  {
    id: 3,
    name: 'database-01',
    os: 'Ubuntu 20.04 LTS',
    cpu: '8',
    status: 'error',
    image: 'Custom',
  },
  {
    id: 4,
    name: 'api-gateway',
    os: 'Rocky Linux 8',
    cpu: '2',
    status: 'error',
    image: 'Built in',
  },
];

const basicColumns = [
  { key: 'name' as const, header: 'Name', width: 150 },
  { key: 'os' as const, header: 'OS', width: 200 },
  { key: 'cpu' as const, header: 'vCPU', width: 100 },
  { key: 'status' as const, header: 'Status', width: 120 },
  { key: 'image' as const, header: 'Type', width: 120 },
];

// Basic Table
const BasicComponent = () => {
  return <Table<User> columns={basicColumns} rows={sampleData} />;
};

export const Basic: Story = {
  render: () => <BasicComponent />,
};

// Loading State
export const Loading: Story = {
  render: () => (
    <Table<User> rows={sampleData} columns={basicColumns} isLoading={true} loadingRowCount={5} />
  ),
};

// Empty State
export const Empty: Story = {
  render: () => <Table<User> rows={[]} columns={basicColumns} isLoading={false} />,
};

// Custom Body
const CustomBodyComponent = () => {
  const customColumns = [
    { key: 'name' as const, header: '서버 이름', width: 180 },
    { key: 'status' as const, header: '상태', width: 120 },
    { key: 'os' as const, header: '운영체제', width: 160 },
    { key: 'cpu' as const, header: 'CPU', width: 80 },
    { key: 'actions' as const, header: '작업', width: 200, clickable: false },
  ];

  return (
    <Table<User> rows={sampleData} columns={customColumns}>
      {sampleData.map((user, _index) => (
        <Table.Tr key={user.id} rowData={user} isError={user.status === 'error'}>
          <Table.Td rowData={user} column={customColumns[0]}>
            <Layout.HStack gap="sm" align="center">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    user.status === 'active'
                      ? 'var(--semantic-color-success)'
                      : 'var(--semantic-color-error)',
                }}
              />
              <strong>{user.name}</strong>
            </Layout.HStack>
          </Table.Td>
          <Table.Td rowData={user} column={customColumns[1]}>
            <strong>{user.status === 'active' ? '실행중' : '중지됨'}</strong>
          </Table.Td>
          <Table.Td rowData={user} column={customColumns[2]}>
            {user.os}
          </Table.Td>
          <Table.Td rowData={user} column={customColumns[3]}>
            <strong>{user.cpu} Core</strong>
          </Table.Td>
          <Table.Td rowData={user} column={customColumns[4]} preventClickPropagation={true}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => console.log('시작:', user.name)}
              disabled={user.status === 'active'}
            >
              시작
            </Button>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table>
  );
};

export const CustomBody: Story = {
  render: () => <CustomBodyComponent />,
};

// Checkbox Selection
const CheckboxSelectionComponent = () => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const handleCheckboxRowClick = (index: number) => {
    const isSelected = selectedRows.includes(index);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((id) => id !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  return (
    <SelectableTable<User>
      rows={sampleData}
      columns={basicColumns}
      selectionType="checkbox"
      selectedRows={selectedRows}
      onRowSelectionChange={setSelectedRows}
      getRowId={(_row, index) => index}
    >
      {sampleData.map((user, index) => (
        <Table.Tr key={index} rowData={user} onClick={() => handleCheckboxRowClick(index)}>
          {basicColumns.map((column) => (
            <Table.Td key={column.key} rowData={user} column={column}>
              {user[column.key as keyof User]}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </SelectableTable>
  );
};

export const CheckboxSelection: Story = {
  render: () => <CheckboxSelectionComponent />,
};

// Radio Selection
const RadioSelectionComponent = () => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const handleRadioRowClick = (index: number) => {
    setSelectedRows([index]);
  };

  return (
    <SelectableTable<User>
      rows={sampleData}
      columns={basicColumns}
      selectionType="radio"
      selectedRows={selectedRows}
      onRowSelectionChange={setSelectedRows}
      getRowId={(_row, index) => index}
    >
      {sampleData.map((user, index) => (
        <Table.Tr key={index} rowData={user} onClick={() => handleRadioRowClick(index)}>
          {basicColumns.map((column) => (
            <Table.Td key={column.key} rowData={user} column={column}>
              {user[column.key as keyof User]}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </SelectableTable>
  );
};

export const RadioSelection: Story = {
  render: () => <RadioSelectionComponent />,
};

// API 표준 정렬 테이블 (실제 정렬 적용)
const ApiSortableTableComponent = () => {
  const [sort, setSort] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const sortableColumns = [
    { key: 'name', header: 'Name', width: 200, sortable: true },
    { key: 'os', header: 'OS', width: 200, sortable: true },
    {
      key: 'cpu',
      header: 'CPU',
      width: 150,
      sortable: true,
      align: 'center' as const,
    },
    { key: 'status', header: 'Status', width: 150, sortable: false }, // 정렬 불가
  ];

  // 정렬 변경 핸들러
  const handleSortChange = (newSort: string | null, newOrder: 'asc' | 'desc') => {
    setSort(newSort);
    setOrder(newOrder);
  };

  // 정렬된 데이터 (클라이언트 정렬 - 실제로는 API가 정렬된 데이터를 반환)
  const sortedData = [...sampleData].sort((a, b) => {
    if (!sort) return 0;

    const aValue = String(a[sort as keyof User] || '');
    const bValue = String(b[sort as keyof User] || '');

    const comparison = aValue.localeCompare(bValue);
    return order === 'asc' ? comparison : -comparison;
  });

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <p>현재 API 쿼리: {sort ? `?sort=${sort}&order=${order}` : 'No sort'}</p>
      <Table
        rows={sortedData}
        columns={sortableColumns}
        sort={sort ?? undefined}
        order={order}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export const ApiSortableTable: Story = {
  render: () => <ApiSortableTableComponent />,
};

// Sticky Last Column
const StickyLastColumnComponent = () => {
  const wideColumns = [
    { key: 'name' as const, header: 'Name', width: 200 },
    { key: 'os' as const, header: 'Operating System', width: 300 },
    { key: 'cpu' as const, header: 'vCPU', width: 150 },
    { key: 'status' as const, header: 'Status', width: 150 },
    { key: 'image' as const, header: 'Image Type', width: 200 },
  ];

  return (
    <div style={{ width: '800px' }}>
      <Table<User> rows={sampleData} columns={wideColumns} stickyLastColumn={true} />
    </div>
  );
};

export const StickyLastColumn: Story = {
  render: () => <StickyLastColumnComponent />,
};

// Expandable Table (확장 가능한 테이블)
const ExpandableTableStoryComponent = () => {
  const expandedRowRender = (row: User) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 32px',
          minHeight: '40px',
          backgroundColor: 'var(--semantic-color-surfaceMuted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Status :</span>
          <span style={{ fontSize: '12px' }}>{row.status}</span>
        </div>
        <div
          style={{
            width: '1px',
            height: '12px',
            backgroundColor: 'var(--semantic-color-border)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>CPU :</span>
          <span style={{ fontSize: '12px' }}>{row.cpu} Core</span>
        </div>
        <div
          style={{
            width: '1px',
            height: '12px',
            backgroundColor: 'var(--semantic-color-border)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Image :</span>
          <span style={{ fontSize: '12px' }}>{row.image}</span>
        </div>
      </div>
    );
  };

  return (
    <ExpandableTable<User>
      rows={sampleData}
      columns={basicColumns}
      expandedRowRender={expandedRowRender}
      isRowDisabled={(row) => row.status === 'error'}
    />
  );
};

export const Expandable: Story = {
  render: () => <ExpandableTableStoryComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '행을 클릭하거나 확장 아이콘을 클릭하여 상세 정보를 펼칠 수 있습니다. Error 상태인 행은 비활성화되어 확장할 수 없습니다.',
      },
    },
  },
};

// Expandable + Checkbox Selection
const ExpandableCheckboxSelectionComponent = () => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const expandedRowRender = (row: User) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 32px',
          minHeight: '40px',
          backgroundColor: 'var(--semantic-color-surfaceMuted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Status :</span>
          <span style={{ fontSize: '12px' }}>{row.status}</span>
        </div>
        <div
          style={{
            width: '1px',
            height: '12px',
            backgroundColor: 'var(--semantic-color-border)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>CPU :</span>
          <span style={{ fontSize: '12px' }}>{row.cpu} Core</span>
        </div>
        <div
          style={{
            width: '1px',
            height: '12px',
            backgroundColor: 'var(--semantic-color-border)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Image :</span>
          <span style={{ fontSize: '12px' }}>{row.image}</span>
        </div>
      </div>
    );
  };

  return (
    <Layout.VStack gap="lg">
      <div>
        <p>Selected: {selectedRows.join(', ') || 'None'}</p>
      </div>
      <ExpandableTable<User>
        rows={sampleData}
        columns={basicColumns}
        expandedRowRender={expandedRowRender}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        expandRowByClick={false}
      />
    </Layout.VStack>
  );
};

export const ExpandableWithCheckbox: Story = {
  render: () => <ExpandableCheckboxSelectionComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '확장 기능과 체크박스 선택 기능을 동시에 사용할 수 있습니다. 체크박스로 선택하고, 확장 아이콘으로 상세 정보를 펼칠 수 있습니다.',
      },
    },
  },
};

// Disabled Rows
const DisabledRowsComponent = () => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  return (
    <Layout.VStack gap="lg">
      <div>
        <h3 style={{ marginBottom: '8px' }}>Basic Table</h3>
        <Table<User> columns={basicColumns} rows={sampleData}>
          {sampleData.map((user) => (
            <Table.Tr key={user.id} rowData={user} disabled={user.status === 'error'}>
              {basicColumns.map((column) => (
                <Table.Td key={column.key} rowData={user} column={column}>
                  {user[column.key as keyof User]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table>
      </div>

      <div>
        <h3 style={{ marginBottom: '8px' }}>SelectableTable</h3>
        <SelectableTable<User>
          rows={sampleData}
          columns={basicColumns}
          selectionType="checkbox"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          isRowDisabled={(row) => row.status === 'error'}
        >
          {sampleData.map((user) => (
            <Table.Tr key={user.id} rowData={user} disabled={user.status === 'error'}>
              {basicColumns.map((column) => (
                <Table.Td key={column.key} rowData={user} column={column}>
                  {user[column.key as keyof User]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </SelectableTable>
      </div>
    </Layout.VStack>
  );
};

export const DisabledRows: Story = {
  render: () => <DisabledRowsComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Error 상태인 행은 비활성화됩니다. 클릭 불가, 선택 불가, 시각적으로 흐리게 표시됩니다.',
      },
    },
  },
};
