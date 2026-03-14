import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { Button } from '@/design-system';
import { IconSettings } from '@tabler/icons-react';

const VIEW_PREFERENCES_GUIDELINES = `## Overview

사용자가 **테이블 표시 방식을 사용자 환경에 맞게 조정할 수 있도록 제공되는 설정 드로어**이다.
사용자는 이 패널을 통해 다음 항목을 설정할 수 있다.
- 페이지당 표시 Row 수
- 표시할 Column 선택
- Column 표시 순서

---

## Composition

\`\`\`
View preferences
--------------------------------

Rows per page
[ 10 | 20 | 50 | 100 ]

Columns
☑ Name
☑ Status
☑ Region
☑ Created
☐ Owner

--------------------------------

Reset to default
Cancel
Save
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Drawer header | 기능명(View preferences) |
| Row count selector | 페이지당 Row 수 설정 |
| Column visibility list | 표시할 Column 선택 |
| Column Drag handle | Column 순서 변경 |
| Reset/Cancel/Save action | 기본값으로 복원/취소/저장 액션 |

---

## Behavior

### 1) Row count selector
- 기본값은 10이다.
- 선택할 수 있는 옵션값은 10, 20, 50, 100이 있다.

### 2) Column Visibility
- Column 선택은 토글 버튼으로 on/off 된다.
- 선택 해제 시 해당 Column은 Table에서 숨겨진다.
- 최소 1개 이상의 Column이 표시되어야 한다.

### 3) Fixed Columns
- Status, Name, Action 컬럼은 항상 표시되며, 순서 변경도 불가하다.
- Column 목록에는 표시되지만 **비활성 상태로 표시된다.**
- Drag & Drop 대상에서도 제외된다.

### 4) Column Order
- Drag & Drop으로 순서를 변경한다.
- **고정 컬럼(Status / Name / Action)은 이동할 수 없다.**
- 변경 가능한 영역은 'Name 이후 ~ Action 이전' 범위 내이다.

### 5) Excluded Columns
- 체크 박스 컬럼은 데이터 정보와 관련된 컬럼이 아니므로 컬럼 리스트에서 제외된다.

### 6) Settings Flow
1. View preferences 버튼 클릭
2. View preferences 드로어 열림
3. 설정값 선택
4. Save 클릭
5. 테이블 UI 업데이트

### 7) Reset to default 버튼
- 클릭 시 기본값으로 복원된다.
- 복원 항목
  - Row count
  - Column visibility
  - Column order

### 8) Scope
테이블 설정은 **List page Table에만 적용되는 설정 기능**이다.
다음 Table에는 적용되지 않는다.
- Create page 내부 Table
- 설정 Drawer 내부 Table
- 선택용 Table

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Table | Component | 설정 대상 |
| Pagination | Component | Row 수 설정 반영 |
| Drawer | Component | 패널 UI |
| Checkbox | Component | Column 선택 |
| List page | Pattern | 적용 대상 |
`;

const mockColumns: ColumnConfig[] = [
  { id: 'status', label: 'Status', visible: true, locked: true },
  { id: 'name', label: 'Name', visible: true, locked: true },
  { id: 'image', label: 'Image', visible: true },
  { id: 'flavor', label: 'Flavor', visible: true },
  { id: 'vcpu', label: 'vCPU', visible: true },
  { id: 'ram', label: 'RAM', visible: true },
  { id: 'network', label: 'Network', visible: true },
  { id: 'createdAt', label: 'Created at', visible: false },
  { id: 'actions', label: 'Action', visible: true, locked: true },
];

function ViewPreferencesPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState<ColumnConfig[]>(mockColumns);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<IconSettings size={12} />}
        onClick={() => setIsOpen(true)}
      >
        View preferences
      </Button>
      <ViewPreferencesDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columns}
        onColumnsChange={setColumns}
        defaultColumns={mockColumns}
      />
    </div>
  );
}

export function ViewPreferencesPage() {
  return (
    <ComponentPageTemplate
      title="View Preferences"
      description="사용자가 테이블 표시 방식을 사용자 환경에 맞게 조정할 수 있도록 제공되는 설정 드로어이다. 페이지당 Row 수, 표시할 Column 선택, Column 표시 순서를 설정할 수 있다."
      whenToUse={['리소스 목록을 표시하는 화면에서의 테이블 속성 변경']}
      whenNotToUse={[
        '생성 화면, 드로어 내부 테이블은 보조 데이터를 표기하는 것으로 테이블 속성 변경 기능 미지원',
      ]}
      preview={
        <ComponentPreview
          code={`import { ViewPreferencesDrawer } from '@/components/ViewPreferencesDrawer';

<ViewPreferencesDrawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={setRowsPerPage}
  columns={columns}
  onColumnsChange={setColumns}
  defaultColumns={defaultColumns}
/>`}
        >
          <ViewPreferencesPreview />
        </ComponentPreview>
      }
      guidelines={
        <>
          <NotionRenderer markdown={VIEW_PREFERENCES_GUIDELINES} />
          <DosDonts
            doItems={[
              '사용자에게 Column 표시 제어 권한 제공',
              'Row 수 설정 제공',
              '설정 변경을 명확히 표시',
            ]}
            dontItems={['필터 기능을 포함하지 않는다', '데이터 수정 기능을 포함하지 않는다']}
          />
        </>
      }
      relatedLinks={[
        { label: 'Table', path: '/design/components/table' },
        { label: 'Pagination', path: '/design/components/pagination' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Checkbox', path: '/design/components/checkbox' },
        { label: 'List Page', path: '/design/patterns/common' },
      ]}
    />
  );
}
