import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack, SearchInput, Pagination, Table, SelectionIndicator } from '@/design-system';

const LIST_SELECTOR_GUIDELINES = `## Overview

사용자가 리소스 목록에서 하나 이상의 항목을 검색하고 선택하기 위한 UI 패턴이다.
이 패턴은 주로 카드, 드로어 또는 설정 패널 내부에서 사용된다.

---

## Components

\`\`\`
Search

Pagination

--------------------------------
Table
--------------------------------

Selection Area
[chip] [chip] [chip]
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Tab | 리소스를 유형별로 분류해서 조회 |
| Create button | 새로운 리소스 생성 |
| Search input | 리소스 검색 및 필터링 |
| Pagination | 리스트 페이지 이동 |
| Item count | 데이터 규모 표시 |
| Table | 리소스 목록 표시 |
| Selection area | 선택된 리소스 표시 |

---

## Variants

| Variant | 설명 |
| --- | --- |
| Single select | 하나의 항목만 선택 가능 |
| Multi select | 여러 항목 선택 가능 |
| Create enabled | 새 리소스 생성 버튼 포함 |

---

## Behavior

### 1) 선택
- 단일 또는 다중 선택이 가능하다. (단일: Radio, 다중: Checkbox)
- 선택된 항목은 Selection area에 Chip 형태로 표시된다.

### 2) 선택 해제

| 동작 | 결과 |
| --- | --- |
| Chip ✕ 클릭 | 선택 해제 |
| Row 선택 해제 | Chip 제거 |

### 3) 페이지 이동
- Pagination을 통해 페이지를 이동할 수 있다.
- 페이지 이동 시 선택 상태는 유지된다.

### 4) 생성 버튼
- 기본적으로 제외되는 기능이다.
- 선택 시 새 리소스 생성이 필요한 경우가 많을 때 추가.
- 클릭 시 새 탭에서 화면 이동, 기존 화면은 선택 사항 유지.

### 5) 행 개수
- 단독으로 존재하는 리스트: 10개 고정
- 한 카드/드로어에 List Selector가 2개 이상이거나 입력값이 많을 때: 5개 고정
`;

const selectorData = [
  { id: 'net-001', name: 'default-network', type: 'Flat', subnet: '10.0.0.0/24' },
  { id: 'net-002', name: 'internal-mgmt', type: 'VLAN', subnet: '172.16.0.0/16' },
  { id: 'net-003', name: 'public-external', type: 'Flat', subnet: '192.168.1.0/24' },
  { id: 'net-004', name: 'storage-backend', type: 'VXLAN', subnet: '10.10.0.0/20' },
  { id: 'net-005', name: 'tenant-isolated', type: 'VLAN', subnet: '10.20.0.0/16' },
];

const selectorColumns = [
  { key: 'name', label: 'Name', flex: 1 },
  { key: 'type', label: 'Type', width: '100px' },
  { key: 'subnet', label: 'Subnet', flex: 1 },
];

function ListSelectorPreview() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>(['net-001', 'net-003']);

  const filtered = selectorData.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <VStack gap={3}>
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search networks by name, type, or subnet"
        size="sm"
        className="w-[280px]"
      />

      <Pagination
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        totalItems={filtered.length}
        selectedCount={selected.length}
      />

      <VStack gap={2}>
        <Table
          columns={selectorColumns}
          data={filtered}
          rowKey="id"
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          emptyMessage="No networks found"
        />

        <SelectionIndicator
          selectedItems={selected.map((id) => ({
            id,
            label: selectorData.find((d) => d.id === id)?.name ?? id,
          }))}
          onRemove={(id) => setSelected((prev) => prev.filter((s) => s !== id))}
          emptyText="No network selected"
        />
      </VStack>
    </VStack>
  );
}

export function ListSelectorPage() {
  return (
    <ComponentPageTemplate
      title="List Selector"
      description="사용자가 리소스 목록에서 하나 이상의 항목을 검색하고 선택하기 위한 UI 패턴. 주로 카드, 드로어 또는 설정 패널 내부에서 사용된다."
      preview={
        <ComponentPreview
          code={`<VStack gap={3}>
  <SearchInput placeholder="Search networks" size="sm" />

  <Pagination currentPage={page} totalPages={1} onPageChange={setPage}
    totalItems={data.length} selectedCount={selected.length} />

  <Table columns={columns} data={data} rowKey="id" selectable
    selectedKeys={selected} onSelectionChange={setSelected} />

  {selected.length > 0 && (
    <div className="selection-area">
      {selected.map((id) => (
        <Chip key={id} label={name} size="sm" onRemove={() => deselect(id)} />
      ))}
    </div>
  )}
</VStack>`}
        >
          <ListSelectorPreview />
        </ComponentPreview>
      }
      whenToUse={[
        '다른 리소스를 참조하여 설정해야 하는 경우',
        '리소스를 선택하여 연결해야 하는 경우',
        '여러 리소스 중 일부를 선택해야 하는 경우',
      ]}
      whenNotToUse={[
        '리소스 관리 화면 (→ List page)',
        '속성 정보까지 확인 필요없이 단일 정보로 가능한 선택 (→ Select)',
        '간단한 옵션 선택 (→ Radio/Checkbox)',
      ]}
      guidelines={
        <>
          <NotionRenderer markdown={LIST_SELECTOR_GUIDELINES} />
          <DosDonts
            doItems={[
              '검색 기능을 제공한다.',
              '선택된 항목을 명확하게 표시한다.',
              'Chip을 통해 선택 상태를 쉽게 제거할 수 있도록 한다.',
            ]}
            dontItems={[
              '선택 결과를 숨기지 않는다.',
              '선택 상태를 Table과 분리하여 표시하지 않는다.',
              'Create 기능을 필수 요소로 만들지 않는다.',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Search Input', path: '/design/components/filter-search-input' },
        { label: 'Table', path: '/design/components/table' },
        { label: 'Pagination', path: '/design/components/pagination' },
        { label: 'Chip', path: '/design/components/chip' },
        { label: 'Drawer', path: '/design/components/drawer' },
      ]}
    />
  );
}
