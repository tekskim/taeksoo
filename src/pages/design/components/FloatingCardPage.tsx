import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { VStack, FloatingCard } from '@/design-system';
import { IconCheck, IconAlertTriangle, IconProgress } from '@tabler/icons-react';

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

function FloatingCardGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={2}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Variant</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>Configuration·Quota·Summary 전부 포함</Td>
            </tr>
            <tr>
              <Td>
                <strong>Without Quota</strong>
              </Td>
              <Td>Quota 없는 축약형</Td>
            </tr>
            <tr>
              <Td>
                <strong>View Log / Read-only</strong>
              </Td>
              <Td>읽기 전용</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <Prose>
          <p>4개 영역으로 구성된다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th>영역</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Configuration 영역</strong>
              </Td>
              <Td>섹션 레이블 + 상태 아이콘으로 각 섹션 입력 완료 상태 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Quota 영역</strong>
              </Td>
              <Td>Gauge bar chart로 시각화</Td>
            </tr>
            <tr>
              <Td>
                <strong>Summary 영역</strong>
              </Td>
              <Td>실시간 업데이트</Td>
            </tr>
            <tr>
              <Td>
                <strong>액션 버튼 영역</strong>
              </Td>
              <Td>Cancel(Secondary), Create-Save(Primary)</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <TableWrapper>
          <thead>
            <tr>
              <Th>상태</Th>
              <Th>아이콘</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>빈 원형</Td>
            </tr>
            <tr>
              <Td>
                <strong>Processing</strong>
              </Td>
              <Td>점선 원형</Td>
            </tr>
            <tr>
              <Td>
                <strong>Warning</strong>
              </Td>
              <Td>경고 삼각형</Td>
            </tr>
            <tr>
              <Td>
                <strong>Success</strong>
              </Td>
              <Td>체크 원형</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>초기 상태</strong>
              </Td>
              <Td>섹션 미입력</Td>
            </tr>
            <tr>
              <Td>
                <strong>입력 중</strong>
              </Td>
              <Td>Processing 아이콘</Td>
            </tr>
            <tr>
              <Td>
                <strong>완료</strong>
              </Td>
              <Td>Success 아이콘</Td>
            </tr>
            <tr>
              <Td>
                <strong>오류</strong>
              </Td>
              <Td>Warning 아이콘</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Behavior</SectionTitle>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)]">
            위치 및 레이아웃 정책
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create/Edit 페이지 우측에 sticky로 고정되어 스크롤 시에도 항상 노출된다.</li>
            <li>뷰포트 너비가 충분할 때만 우측 고정 레이아웃을 적용한다.</li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            실시간 업데이트 정책
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>입력값 변경 시 Summary와 Quota가 즉시 반영된다.</li>
            <li>섹션 완료 시 해당 Configuration 아이콘이 Success로 전환된다.</li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            Create/Save 버튼 동작 정책
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create 클릭 시 전체 탭/섹션에 대한 Global Validation을 수행한다.</li>
            <li>Validation 실패 시 해당 섹션으로 자동 스크롤하고 오류를 표시한다.</li>
            <li>모든 필수 섹션이 완료되어야 Create 버튼이 활성화된다.</li>
            <li>Edit 모드에서는 Save 버튼으로 동일한 검증·저장 흐름을 따른다.</li>
          </ol>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            Quota 초과 시 동작 정책
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quota 초과 시 Gauge bar에 danger 색상을 적용한다.</li>
            <li>Create 버튼을 비활성화하거나, 클릭 시 Quota 초과 안내 메시지를 표시한다.</li>
            <li>사용자에게 할당량 증설 또는 기존 리소스 정리 안내를 제공한다.</li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '다수의 섹션/탭이 있는 Create 플로우에서 우측에 배치한다.',
            'Quota가 있는 리소스 생성 시 할당량을 Gauge bar로 시각화한다.',
            '입력 진행 상태를 섹션별 아이콘으로 명확히 표시한다.',
            'Summary 영역에 핵심 설정값만 간결하게 요약한다.',
          ]}
          dontItems={[
            '단순 폼(섹션 1개)에 Floating card를 사용하지 않는다.',
            '모바일 등 좁은 뷰포트에서 우측 고정 레이아웃을 강제하지 않는다.',
            'Quota·Summary가 없는 Confirm 다이얼로그에 사용하지 않는다.',
            'Summary에 과도한 정보를 넣어 가독성을 해치지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

const floatingCardProps: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Summary 영역 타이틀' },
  {
    name: 'sections',
    type: 'FloatingCardSection[]',
    default: '[]',
    required: false,
    description: '섹션별 진행 상태 아이템 목록. 각 섹션은 tabTitle, items, collapsible 등을 포함',
  },
  {
    name: 'quota',
    type: 'QuotaItem[]',
    default: '[]',
    required: false,
    description: 'Quota(할당량) 표시 항목. label, current, total, unit으로 구성',
  },
  {
    name: 'instanceCount',
    type: 'number',
    default: '1',
    required: false,
    description: '인스턴스 수 입력 필드 초기값',
  },
  {
    name: 'onInstanceCountChange',
    type: '(count: number) => void',
    required: false,
    description: '인스턴스 수 변경 콜백. 전달 시 Number of Instances 입력 필드가 표시됨',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    default: "'Cancel'",
    required: false,
    description: 'Cancel 버튼 라벨',
  },
  {
    name: 'actionLabel',
    type: 'string',
    default: "'Create'",
    required: false,
    description: 'Action 버튼 라벨 (Create / Save)',
  },
  {
    name: 'actionEnabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Action 버튼 활성화 여부. 모든 필수 섹션 완료 시 true',
  },
  {
    name: 'onCancel',
    type: '() => void',
    required: false,
    description: 'Cancel 버튼 클릭 핸들러. 전달 시 Cancel 버튼 표시',
  },
  {
    name: 'onAction',
    type: '() => void',
    required: false,
    description: 'Action 버튼 클릭 핸들러. 전달 시 Action 버튼 표시',
  },
  {
    name: 'portal',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'true면 document.body에 포탈로 렌더링, false면 인라인 렌더링',
  },
  {
    name: 'position',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: "'top-left'",
    required: false,
    description: 'portal 모드에서의 위치',
  },
  {
    name: 'isOpen',
    type: 'boolean',
    default: 'true',
    required: false,
    description: '카드 노출 여부',
  },
  { name: 'width', type: 'string', default: "'320px'", required: false, description: '카드 너비' },
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: 'false',
    required: false,
    description: '닫기 버튼 표시 여부',
  },
];

export function FloatingCardPage() {
  return (
    <ComponentPageTemplate
      title="Floating card"
      description="Create/Edit 페이지 우측에 고정되어, 사용자가 입력한 내용의 진행 상태와 요약 정보를 실시간으로 제공하는 카드 컴포넌트다. 페이지를 스크롤하는 동안에도 항상 노출되어, 전체 구성을 한눈에 파악하고 리소스 할당량(Quota)을 즉시 확인할 수 있도록 돕는다."
      whenToUse={[
        '다수의 섹션 또는 탭으로 구성된 Create/Edit 플로우에서 입력 진행 상태를 시각화해야 할 때',
        '리소스 생성 전에 Quota(할당량) 초과 여부를 사전에 인지시켜야 할 때',
        '사용자가 긴 폼을 작성하는 동안 현재까지 입력한 설정값을 요약하여 확인할 수 있어야 할 때',
      ]}
      whenNotToUse={[
        '입력 섹션이 1개뿐이거나 폼이 단순한 경우 (단순한 경우 요약 카드가 불필요한 복잡도를 추가함)',
        '모바일 환경 등 뷰포트 너비가 충분하지 않아 우측 고정 레이아웃을 지원하기 어려운 경우',
        'Quota 정보가 없고 요약 내용이 없는 단순 확인(Confirm) 다이얼로그 상황',
      ]}
      preview={
        <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
          <FloatingCard
            title="Summary"
            sections={[
              {
                tabTitle: 'Configuration',
                items: [
                  { id: 'basic', title: 'Basic information', status: 'success' },
                  { id: 'source', title: 'Source', status: 'success' },
                  { id: 'flavor', title: 'Flavor', status: 'processing' },
                  { id: 'network', title: 'Network', status: 'default' },
                ],
                collapsible: true,
                defaultExpanded: true,
              },
            ]}
            quota={[
              { label: 'Instance', current: 3, total: 10 },
              { label: 'vCPU', current: 7, total: 20 },
              { label: 'RAM', current: 18, total: 50, unit: 'GiB' },
            ]}
            instanceCount={1}
            onInstanceCountChange={() => {}}
            onCancel={() => {}}
            onAction={() => {}}
            actionLabel="Create"
            actionEnabled={false}
            portal={false}
            width="var(--wizard-summary-width)"
          />
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Create Instance — Full (Summary + Quota + Instance Count)
            </span>
            <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
              <FloatingCard
                title="Summary"
                sections={[
                  {
                    tabTitle: 'Configuration',
                    items: [
                      { id: 'launch', title: 'Launch type', status: 'success' },
                      { id: 'basic', title: 'Basic information', status: 'success' },
                      { id: 'source', title: 'Source', status: 'success' },
                      { id: 'flavor', title: 'Flavor', status: 'processing' },
                      { id: 'network', title: 'Network', status: 'default' },
                      { id: 'auth', title: 'Authentication', status: 'default' },
                      { id: 'advanced', title: 'Advanced', status: 'default' },
                    ],
                    collapsible: true,
                    defaultExpanded: true,
                  },
                ]}
                quota={[
                  { label: 'Instance', current: 3, total: 10 },
                  { label: 'vCPU', current: 7, total: 20 },
                  { label: 'RAM', current: 18, total: 50, unit: 'GiB' },
                ]}
                instanceCount={1}
                onInstanceCountChange={() => {}}
                onCancel={() => {}}
                onAction={() => {}}
                actionLabel="Create"
                actionEnabled={false}
                portal={false}
                width="var(--wizard-summary-width)"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Create Agent — Multi-section (Collapsible Tabs, No Quota)
            </span>
            <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
              <FloatingCard
                title="Summary"
                sections={[
                  {
                    tabTitle: 'Configuration',
                    items: [
                      { id: 'basic-info', title: 'Basic information', status: 'success' },
                      { id: 'model', title: 'Model settings', status: 'processing' },
                      { id: 'prompt', title: 'Prompt settings', status: 'default' },
                    ],
                    collapsible: true,
                    defaultExpanded: true,
                    showSuccessIcon: false,
                  },
                  {
                    tabTitle: 'Data & MCP Connection',
                    items: [
                      { id: 'data', title: 'Connect data sources', status: 'default' },
                      { id: 'mcp', title: 'Connect MCP tools', status: 'default' },
                    ],
                    collapsible: true,
                    defaultExpanded: false,
                  },
                ]}
                onCancel={() => {}}
                onAction={() => {}}
                actionLabel="Create"
                actionEnabled={true}
                portal={false}
                width="var(--wizard-summary-width)"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Status Icons</span>
            <div className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-lg">
              <div className="flex items-center gap-2">
                <div
                  className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
                  style={{ borderStyle: 'dashed' }}
                />
                <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
              </div>
              <div className="flex items-center gap-2">
                <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                <span className="text-body-sm text-[var(--color-text-muted)]">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full bg-[var(--color-state-danger)] flex items-center justify-center">
                  <IconAlertTriangle size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-body-sm text-[var(--color-text-muted)]">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                  <IconCheck size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-body-sm text-[var(--color-text-muted)]">Success</span>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<FloatingCardGuidelines />}
      apiReference={floatingCardProps}
      relatedLinks={[
        { label: 'Create Page (Wizard)', path: '/design/patterns/wizard' },
        { label: 'Create Page (Multi tab)', path: '/design/patterns/open-form' },
        { label: 'Usage Chart', path: '/design/charts/usage-chart' },
      ]}
    />
  );
}
