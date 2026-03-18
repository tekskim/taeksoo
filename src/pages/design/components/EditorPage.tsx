import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { VStack, HStack, Button, Input, Select, Disclosure, SearchInput } from '@/design-system';
import {
  IconPlus,
  IconChevronDown,
  IconDatabase,
  IconPlayerPlay,
  IconGitBranch,
  IconFolder,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconRefresh,
  IconLayoutGrid,
  IconTrash,
  IconLayoutSidebar,
  IconX,
} from '@tabler/icons-react';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

/* ----------------------------------------
   Block Library - Category Item
   ---------------------------------------- */
function BlockCategory({
  label,
  icon,
  count,
  color,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  count: number;
  color: 'blue' | 'yellow';
  children: React.ReactNode;
}) {
  const bgColor =
    color === 'blue' ? 'bg-[var(--color-state-info-bg)]' : 'bg-[var(--color-state-warning-bg)]';
  return (
    <div className="flex flex-col w-full">
      <div
        className={`${bgColor} border border-[var(--color-border-default)] rounded-t-[var(--radius-md)] flex items-center px-2 py-2`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
            {icon}
            <span className="text-body-md text-[var(--color-text-default)]">{label}</span>
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{count}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function BlockItem({
  icon,
  label,
  description,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`border-x border-b border-[var(--color-border-default)] px-7 py-2 flex flex-col gap-0.5 ${isLast ? 'rounded-b-[var(--radius-md)]' : ''}`}
    >
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-body-md text-[var(--color-text-default)]">{label}</span>
      </div>
      {description && (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{description}</span>
      )}
    </div>
  );
}

/* ----------------------------------------
   Tab Bar Item
   ---------------------------------------- */
function TabItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 min-w-[120px] max-w-[160px] px-3 py-2 ${
        active
          ? 'bg-[var(--color-surface-default)] border-x border-[var(--color-border-default)]'
          : ''
      }`}
    >
      <span className="text-body-md text-[var(--color-text-default)] flex-1 truncate">{label}</span>
      <IconX size={12} className="text-[var(--color-text-subtle)] shrink-0" />
    </div>
  );
}

/* ----------------------------------------
   Toolbar Separator
   ---------------------------------------- */
function ToolbarSep() {
  return <div className="w-px h-3 bg-[var(--color-border-default)]" />;
}

/* ----------------------------------------
   Editor Preview
   ---------------------------------------- */
function EditorPreview() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex w-full h-[480px] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      {/* Left: Block Library */}
      {leftOpen && (
        <div className="w-[220px] shrink-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col gap-3 pt-3 px-3 pb-4 overflow-y-auto">
          <VStack gap={2}>
            <span className="text-heading-h5 text-[var(--color-text-default)]">Block library</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Click or drag to add
            </span>
          </VStack>

          <VStack gap={3}>
            <SearchInput placeholder="Find blocks" size="sm" className="w-full" />
            <VStack gap={0}>
              <BlockCategory
                label="Data"
                icon={<IconDatabase size={16} className="text-[var(--color-text-default)]" />}
                count={2}
                color="blue"
              >
                <BlockItem
                  icon={<IconGitBranch size={16} className="text-[var(--color-text-default)]" />}
                  label="Transform"
                  description="Transform data"
                />
                <BlockItem
                  icon={<IconDatabase size={16} className="text-[var(--color-text-default)]" />}
                  label="Load Dataset"
                  description="Load datasets from storage"
                  isLast
                />
              </BlockCategory>
            </VStack>
            <VStack gap={0}>
              <BlockCategory
                label="Actions"
                icon={<IconPlayerPlay size={16} className="text-[var(--color-text-default)]" />}
                count={2}
                color="yellow"
              >
                <BlockItem
                  icon={<IconPlayerPlay size={16} className="text-[var(--color-text-default)]" />}
                  label="Train"
                  description="Train model"
                />
                <BlockItem
                  icon={<IconPlayerPlay size={16} className="text-[var(--color-text-default)]" />}
                  label="Evaluate"
                  description="Evaluate model"
                  isLast
                />
              </BlockCategory>
            </VStack>
          </VStack>
        </div>
      )}

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-surface-subtle)]">
        {/* Tab Bar */}
        <div className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <div
              className="p-2 cursor-pointer hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-md)]"
              onClick={() => setLeftOpen(!leftOpen)}
            >
              <IconLayoutSidebar
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-subtle)]"
              />
            </div>
            <TabItem label="Pipeline A" active />
            <TabItem label="Pipeline B" />
            <div className="p-2 cursor-pointer hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-md)]">
              <IconPlus size={16} className="text-[var(--color-text-subtle)]" />
            </div>
          </div>
          <div
            className="p-2 cursor-pointer hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-md)]"
            onClick={() => setRightOpen(!rightOpen)}
          >
            <IconLayoutSidebar size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)] flex items-center justify-between px-3 py-1 shrink-0">
          <HStack gap={1} align="center">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconFolder size={16} stroke={1.5} />}
              aria-label="Open"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconDeviceFloppy size={16} stroke={1.5} />}
              aria-label="Save"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconDownload size={16} stroke={1.5} />}
              aria-label="Download"
            />
            <ToolbarSep />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconFile size={16} stroke={1.5} />}
              aria-label="File"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconRefresh size={16} stroke={1.5} />}
              aria-label="Reset"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconLayoutGrid size={16} stroke={1.5} />}
              aria-label="Grid"
            />
          </HStack>
          <HStack gap={3} align="center">
            <span className="text-label-md text-[var(--color-text-default)]">0B · 0C</span>
            <ToolbarSep />
            <Button variant="primary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
              Run
            </Button>
          </HStack>
        </div>

        {/* Canvas Area (empty) */}
        <div className="flex-1" />
      </div>

      {/* Right: Property Panel */}
      {rightOpen && (
        <div className="w-[260px] shrink-0 bg-[var(--color-surface-default)] border-l border-[var(--color-border-default)] flex flex-col gap-3 pt-3 px-4 pb-4 overflow-y-auto">
          <VStack gap={2}>
            <span className="text-heading-h5 text-[var(--color-text-default)]">LOAD-DATASET-1</span>
            <span className="text-body-md text-[var(--color-text-subtle)]">DATASET</span>
          </VStack>

          {/* Section 1 */}
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3">
            <Disclosure defaultOpen>
              <Disclosure.Trigger>Expandable Section</Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={6} className="pt-4">
                  <VStack gap={2}>
                    <span className="text-label-md text-[var(--color-text-default)]">Source</span>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Description
                    </span>
                    <Input placeholder="Input placeholder" fullWidth size="sm" />
                  </VStack>
                  <VStack gap={2}>
                    <span className="text-label-md text-[var(--color-text-default)]">Format</span>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Description
                    </span>
                    <Select
                      options={[{ value: '1units', label: '1units' }]}
                      value="1units"
                      fullWidth
                      size="sm"
                    />
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          {/* Section 2 */}
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3">
            <Disclosure defaultOpen>
              <Disclosure.Trigger>Expandable Section</Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={6} className="pt-4">
                  <VStack gap={2}>
                    <span className="text-label-md text-[var(--color-text-default)]">Output</span>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Description
                    </span>
                    <Input placeholder="Input placeholder" fullWidth size="sm" />
                  </VStack>
                  <VStack gap={2}>
                    <span className="text-label-md text-[var(--color-text-default)]">Units</span>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Description
                    </span>
                    <Select
                      options={[{ value: '1units', label: '1units' }]}
                      value="1units"
                      fullWidth
                      size="sm"
                    />
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

function EditorGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`┌─────────────────┬────────────────────────────────┬───────────────┐
│                 │  1. 탭바 (Tab Bar)              │               │
│  2. 블록 라이브러리 ├────────────────────────────────┤  4. 속성       │
│  (Block Library)│                                │  패널          │
│                 │       3. 캔버스                  │  (Property    │
│                 │       (Canvas)                 │  Panel)       │
│                 │                                │               │
└─────────────────┴────────────────────────────────┴───────────────┘`}</pre>
        </div>

        <SubSectionTitle>1. 탭바 (Tab Bar)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 탭 (resourceName)</Td>
              <Td>
                현재 열려 있는 편집 세션의 이름 표시. 여러 탭을 동시에 운용할 수 있으며, 각 탭은
                독립적인 편집 컨텍스트를 가짐
              </Td>
            </tr>
            <tr>
              <Td>b. 탭 닫기 (×)</Td>
              <Td>
                현재 탭(편집 세션)을 닫음. 저장되지 않은 변경사항이 있을 경우 확인 다이얼로그 제공
              </Td>
            </tr>
            <tr>
              <Td>c. 새 탭 추가 (+)</Td>
              <Td>새로운 편집 세션을 탭으로 추가</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. 블록 라이브러리 (Block Library)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 검색 필드</Td>
              <Td>블록 이름으로 검색. 실시간 필터링 지원</Td>
            </tr>
            <tr>
              <Td>b. 블록 카테고리</Td>
              <Td>블록을 유형별로 그룹화하여 표시. 펼침/접힘(Expand/Collapse) 가능</Td>
            </tr>
            <tr>
              <Td>c. 블록</Td>
              <Td>캔버스에 배치 가능한 블록. 클릭 또는 드래그 앤 드롭으로 캔버스에 추가</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>3. 캔버스 (Canvas)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 캔버스 영역</Td>
              <Td>블록(노드)을 배치하고 연결하는 주 작업 영역. 무한 스크롤 및 줌 지원</Td>
            </tr>
            <tr>
              <Td>b. 블록(노드)</Td>
              <Td>캔버스에 배치된 블록 단위. 선택 시 속성 패널과 연동</Td>
            </tr>
            <tr>
              <Td>c. 캔버스 툴바</Td>
              <Td>저장, 실행(Run), 레이아웃 정렬 등의 캔버스 단위 액션 제공</Td>
            </tr>
            <tr>
              <Td>d. 확대/축소 컨트롤</Td>
              <Td>캔버스 줌 레벨 조절</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>4. 속성 패널 (Property Panel)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 블록 제목</Td>
              <Td>선택된 블록(노드)의 이름 및 타입 표시</Td>
            </tr>
            <tr>
              <Td>b. 섹션 (Expandable Section)</Td>
              <Td>속성 항목을 그룹으로 묶어 펼침/접힘 처리</Td>
            </tr>
            <tr>
              <Td>c. 속성 필드</Td>
              <Td>
                블록 유형에 따라 동적으로 구성되는 입력 필드 (Text Input, Select, Toggle 등). 속성
                패널은 블록(노드)이 선택되었을 때만 활성화되어 표시됨. 블록 미선택 상태에서는 빈
                상태(Empty State)로 표시되거나 안내 메시지를 노출
              </Td>
            </tr>
            <tr>
              <Td>d. 삭제 버튼</Td>
              <Td>선택된 블록(노드)을 캔버스에서 삭제</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>캔버스가 열린 초기 상태. 블록 미선택</Td>
            </tr>
            <tr>
              <Td>
                <strong>Block Selected</strong>
              </Td>
              <Td>
                캔버스에서 블록(노드)이 선택된 상태. 속성 패널이 해당 블록의 속성으로 업데이트됨
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Block Editing</strong>
              </Td>
              <Td>속성 패널에서 블록 속성을 입력/수정 중인 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Running</strong>
              </Td>
              <Td>Run 액션 실행 후, 파이프라인이 실행 중인 상태. 편집 인터랙션 비활성화</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1. 블록 추가 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>블록 라이브러리에서 클릭 또는 드래그 앤 드롭으로 캔버스에 추가</li>
              <li>추가 즉시 해당 블록(노드)이 선택 상태로 전환되며, 속성 패널이 업데이트됨</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2. 탭 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>여러 탭을 동시에 열 수 있으며, 각 탭은 독립적인 편집 컨텍스트를 유지</li>
              <li>탭 닫기 시 저장되지 않은 변경사항이 있을 경우 사용자에게 저장 확인 안내 제공</li>
              <li>
                탭 간 이동 시 각 탭의 캔버스 상태(줌 레벨, 스크롤 위치 등)가 개별적으로 유지됨
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3. 블록 삭제 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                속성 패널의 삭제 버튼 또는 키보드 Delete/Backspace 키로 선택된 블록(노드) 삭제
              </li>
              <li>삭제 시 해당 블록(노드)에 연결된 엣지(연결선)도 함께 제거됨</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4. 저장 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>캔버스 상단 툴바의 저장 버튼을 눌러 명시적으로 저장</li>
              <li>저장 전 나가기 시도 시 변경사항 경고 제공</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5. 실행(Run) 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>캔버스 툴바의 Run 버튼으로 파이프라인 실행</li>
              <li>실행 중에는 편집 인터랙션을 비활성화하여 구성 변경 방지</li>
              <li>실행 완료 또는 오류 발생 시 사용자에게 결과 피드백 제공</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '블록 라이브러리는 카테고리 기반으로 구성하여 블록 탐색 효율을 높인다.',
            '속성 패널의 필드는 선택된 블록 유형에 따라 동적으로 구성한다. 불필요한 필드는 노출하지 않는다.',
            '블록(노드) 선택 상태를 캔버스와 속성 패널 양쪽에서 시각적으로 명확히 표시한다.',
            '오류 상태의 블록(노드)은 캔버스에서 즉각적으로 시각 피드백(에러 인디케이터)을 제공한다.',
            '캔버스는 줌·스크롤 기능을 제공하여 복잡한 구조에서도 탐색이 용이하도록 한다.',
          ]}
          dontItems={[
            '편집 중 Run 버튼을 활성화된 상태로 두어 실수로 실행되는 상황을 만들지 않는다.',
            '속성 패널에 블록 유형과 관계없는 공통 속성을 과도하게 노출하지 않는다.',
            '블록(노드)을 삭제할 때 확인 없이 즉시 삭제되도록 설계하지 않는다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>블록 이름</strong>: 블록의 역할을 직관적으로 전달하는 명사형으로 작성한다.
              약어 사용 시 툴팁으로 전체 명칭을 안내한다.
            </li>
            <li>
              <strong>속성 필드 레이블</strong>: 간결하고 명확하게 작성하며, 기술 용어 사용 시
              도움말(Help text) 또는 툴팁을 함께 제공한다.
            </li>
            <li>
              <strong>탭 이름</strong>: 편집 중인 리소스 이름을 그대로 표시하며, 이름이 길 경우
              말줄임(…) 처리하고 툴팁으로 전체 이름을 제공한다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function EditorPage() {
  return (
    <ComponentPageTemplate
      title="Editor"
      tags={['AI Component']}
      description="앱 내 리소스(파이프라인, 워크플로우 등)를 시각적으로 구성하고 편집하기 위한 캔버스 기반의 편집 환경이다. 블록을 배치·연결하고, 각 블록의 속성을 구성하는 빌더(Builder) 기능을 포함한다."
      preview={
        <ComponentPreview code="">
          <EditorPreview />
        </ComponentPreview>
      }
      whenToUse={[
        '사용자가 리소스 간의 흐름이나 구조를 시각적으로 정의해야 할 때',
        '파이프라인, DAG, 워크플로우 등 블록 기반의 구성 작업이 필요할 때',
        '블록(노드) 단위로 속성을 편집하거나 연결 관계를 설정해야 할 때',
      ]}
      guidelines={<EditorGuidelines />}
      relatedLinks={[
        {
          label: 'Top Navigation Bar',
          path: '/design/components/topbar',
          description: '상단 네비게이션 바',
        },
        { label: 'Select', path: '/design/components/select', description: '드롭다운 선택' },
      ]}
    />
  );
}
