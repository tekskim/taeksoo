import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, DetailHeader, VStack } from '@/design-system';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
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

const detailHeaderProps: PropDef[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Title + Actions + InfoGrid',
  },
];

const detailHeaderInfoCardProps: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Info card label' },
  { name: 'value', type: 'ReactNode', required: false, description: 'Info card value' },
  {
    name: 'copyable',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show copy button',
  },
  { name: 'status', type: 'StatusType', required: false, description: 'Status indicator' },
  { name: 'tooltip', type: 'string', required: false, description: 'Help tooltip text' },
];

function DetailHeaderGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">구분</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>Title + Actions + Info Grid를 모두 포함하는 기본형</Td>
            </tr>
            <tr>
              <Td>
                <strong>Title Only</strong>
              </Td>
              <Td>
                Info Grid 없이 Title과 Actions만 표시하는 단순형. 표시할 핵심 속성이 없는 리소스에
                사용
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`┌─────────────────────────────────────────┐
│  [Title]                  [Actions]     │  ← 1. 헤더 영역
├─────────────────────────────────────────┤
│  [InfoCard] [InfoCard] [InfoCard] ...   │  ← 2. InfoGrid 영역
└─────────────────────────────────────────┘`}</pre>
        </div>

        <SubSectionTitle>1. 헤더 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. Title</Td>
              <Td>리소스 이름. 텍스트가 길 경우 말줄임 처리</Td>
            </tr>
            <tr>
              <Td>b. Actions</Td>
              <Td>리소스에 대한 주요 액션 버튼. Secondary sm 크기. ContextMenu로 추가 액션 제공</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. InfoGrid 영역</SubSectionTitle>
        <Prose>
          <p>4~6개의 주요 정보를 Info Card로 표시. Status, ID(copyable), 생성일 등을 포함한다.</p>
        </Prose>

        <SubSectionTitle>Info Card 유형</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">유형</Th>
              <Th>설명</Th>
              <Th className="w-[240px]">예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Status indicator</strong>
              </Td>
              <Td>StatusIndicator로 실시간 상태를 표시</Td>
              <Td>Active / Shutoff / Degraded / Error</Td>
            </tr>
            <tr>
              <Td>
                <strong>Copyable value</strong>
              </Td>
              <Td>클립보드 복사 아이콘과 함께 표시. ID, IP 등 식별자에 사용</Td>
              <Td>Instance ID, IP Address</Td>
            </tr>
            <tr>
              <Td>
                <strong>Basic text</strong>
              </Td>
              <Td>단순 텍스트 값 표시</Td>
              <Td>Host, Created at, Availability zone</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>InfoCard 규칙</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Status</strong>: StatusIndicator로 실시간 상태를 표시. 항상 첫 번째 카드에
              배치
            </li>
            <li>
              <strong>ID</strong>: <code>copyable</code> 속성으로 클립보드 복사 기능을 제공
            </li>
            <li>
              <strong>날짜</strong>: Created at, Updated at 등 시간 정보를 표시
            </li>
            <li>
              <strong>권장 개수</strong>: 4~6개 권장. 최대 12개까지 자동 멀티 행 배치 지원
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>InfoGrid 배치 규칙 (갯수별 자동 레이아웃)</SubSectionTitle>
        <Prose>
          <p>
            InfoCard 개수에 따라 행 배치가 자동으로 결정된다. 한 행에 최대 4개까지 배치되며, 5개
            이상일 경우 멀티 행으로 분배된다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[100px]">갯수</Th>
              <Th className="w-[140px]">레이아웃</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1~4</Td>
              <Td>N</Td>
              <Td>단일 행에 모두 배치</Td>
            </tr>
            <tr>
              <Td>5</Td>
              <Td>3 / 2</Td>
              <Td>첫 행 3개, 두 번째 행 2개</Td>
            </tr>
            <tr>
              <Td>6</Td>
              <Td>4 / 2</Td>
              <Td>첫 행 4개, 두 번째 행 2개</Td>
            </tr>
            <tr>
              <Td>7</Td>
              <Td>4 / 3</Td>
              <Td>첫 행 4개, 두 번째 행 3개</Td>
            </tr>
            <tr>
              <Td>8</Td>
              <Td>4 / 4</Td>
              <Td>두 행 균등 배치</Td>
            </tr>
            <tr>
              <Td>9</Td>
              <Td>4 / 3 / 2</Td>
              <Td>3행 분배</Td>
            </tr>
            <tr>
              <Td>10</Td>
              <Td>4 / 4 / 2</Td>
              <Td>3행 분배</Td>
            </tr>
            <tr>
              <Td>11</Td>
              <Td>4 / 4 / 3</Td>
              <Td>3행 분배</Td>
            </tr>
            <tr>
              <Td>12</Td>
              <Td>4 / 4 / 4</Td>
              <Td>3행 균등 배치 (최대)</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>InfoCard 배치 순서</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>1번째</strong>: Status (StatusIndicator) — 리소스 상태를 가장 먼저 파악
            </li>
            <li>
              <strong>2번째</strong>: ID (copyable) — 리소스 식별자
            </li>
            <li>
              <strong>3~4번째</strong>: 핵심 속성 (Host, Image, Network 등)
            </li>
            <li>
              <strong>마지막</strong>: 시간 정보 (Created at, Updated at)
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>container.padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>container.radius</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>container.gap</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>title</code>
              </Td>
              <Td>16px / semibold</Td>
            </tr>
            <tr>
              <Td>
                <code>actions.gap</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-grid.gap</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.radius</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.gap</code>
              </Td>
              <Td>6px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>
        <VStack gap={3}>
          <SubSectionTitle>로딩 상태</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>데이터 로딩 중에는 Title, InfoCard 영역에 Skeleton 컴포넌트를 표시한다.</li>
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
            '복사 가능한 값(ID, IP 등)에는 copyable 속성을 적용해 클립보드 복사를 지원한다.',
            'Actions에는 해당 리소스에서 가장 빈번하게 사용하는 액션만 노출하고, 나머지는 Context Menu에 정의한다.',
            'Info Card 개수는 4~6개를 권장한다. 사용자가 한눈에 파악할 수 있는 핵심 정보만 포함한다.',
          ]}
          dontItems={[
            'Title 영역에 리소스 이름 외 부가 설명을 함께 표기하지 않는다. 부가 정보는 Tooltip 등으로 분리한다.',
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
              <strong>Title</strong>: 리소스 고유 이름을 그대로 표시한다. 임의로 축약하거나 수정하지
              않는다.
            </li>
            <li>
              <strong>Info Card label</strong>: 속성명은 간결하게 작성한다 (예: "Created at" ✅ /
              "리소스가 생성된 날짜" ❌).
            </li>
            <li>
              <strong>Actions 레이블</strong>: 동사형으로 작성한다 (예: "Edit" ✅ / "Editing" ❌).
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function DetailHeaderPage() {
  return (
    <ComponentPageTemplate
      title="Detail Header"
      description="리소스 상세 페이지 최상단에 위치하는 헤더 컴포넌트로, 리소스의 제목·주요 액션·핵심 정보를 한눈에 파악할 수 있도록 제공한다."
      whenToUse={[
        '리소스 상세(Detail) 페이지의 최상단 헤더',
        '리소스 이름, 상태, 핵심 속성(ID·IP·생성일 등)을 요약 표시해야 할 때',
        '해당 리소스에 대한 주요 액션(수정, 삭제 등)을 상단에 노출해야 할 때',
      ]}
      whenNotToUse={[
        '리소스 목록(List) 페이지의 헤더로는 사용하지 않는다.',
        'Info Card가 필요 없는 단순 설정 페이지에서는 일반 Page Header를 사용한다.',
      ]}
      preview={
        <ComponentPreview
          code={`<DetailHeader>
  <DetailHeader.Title>tk-test</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button variant="secondary" size="sm">Console</Button>
    <Button variant="secondary" size="sm">Start</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" />
    <DetailHeader.InfoCard label="ID" value="7284d917..." copyable />
    <DetailHeader.InfoCard label="Host" value="compute-03" />
    <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
  </DetailHeader.InfoGrid>
</DetailHeader>`}
        >
          <DetailHeader>
            <DetailHeader.Title>tk-test</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconTerminal2 size={12} stroke={1.5} />}
              >
                Console
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
              >
                Start
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconPlayerStop size={12} stroke={1.5} />}
              >
                Stop
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconRefresh size={12} stroke={1.5} />}
              >
                Reboot
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
                Delete
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More Actions
              </Button>
            </DetailHeader.Actions>
            <DetailHeader.InfoGrid>
              <DetailHeader.InfoCard label="Status" status="active" />
              <DetailHeader.InfoCard label="ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
              <DetailHeader.InfoCard label="Host" value="compute-03" />
              <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
            </DetailHeader.InfoGrid>
          </DetailHeader>
        </ComponentPreview>
      }
      usage={{
        code: `import { DetailHeader, Button } from '@/design-system';

<DetailHeader>
  <DetailHeader.Title>{resourceName}</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button variant="secondary" size="sm">Edit</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" />
    <DetailHeader.InfoCard label="ID" value={id} copyable />
  </DetailHeader.InfoGrid>
</DetailHeader>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Status Indicator States</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                StatusIndicator로 실시간 상태 표시. 항상 첫 번째 카드에 배치.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <div className="grid grid-cols-4 gap-2">
                <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                <DetailHeader.InfoCard label="Status" value="Shutoff" status="shutoff" />
                <DetailHeader.InfoCard label="Status" value="Degraded" status="degraded" />
                <DetailHeader.InfoCard label="Status" value="Error" status="error" />
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Copyable Values</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                클립보드 복사 아이콘과 함께 표시. ID, IP 등 식별자에 사용.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <div className="grid grid-cols-2 gap-2">
                <DetailHeader.InfoCard
                  label="Instance ID"
                  value="7284d9174e81431e93060a9bbcf2cdfd"
                  copyable
                />
                <DetailHeader.InfoCard label="IP Address" value="192.168.1.100" copyable />
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Basic Text</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                단순 텍스트 값 표시. Host, Created at, Availability zone 등.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <div className="grid grid-cols-3 gap-2">
                <DetailHeader.InfoCard label="Host" value="compute-03" />
                <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
                <DetailHeader.InfoCard label="Availability zone" value="nova" />
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Title Only (단순형)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Info Grid 없이 Title과 Actions만 표시. 표시할 핵심 속성이 없는 리소스에 사용.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <DetailHeader>
                <DetailHeader.Title>my-config</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} stroke={1.5} />}
                  >
                    Delete
                  </Button>
                </DetailHeader.Actions>
              </DetailHeader>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<DetailHeaderGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>container.padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>container.radius</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>container.gap</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>title</code>
              </Td>
              <Td>16px / semibold</Td>
            </tr>
            <tr>
              <Td>
                <code>actions.gap</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-grid.gap</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.radius</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>info-card.gap</code>
              </Td>
              <Td>6px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      apiReference={detailHeaderProps}
      subComponentApis={[{ name: 'DetailHeader.InfoCard', props: detailHeaderInfoCardProps }]}
      keyboardInteractions={[
        {
          key: 'Tab',
          description: 'Header 내 액션 버튼과 복사 가능한 InfoCard 간 포커스 이동',
        },
        {
          key: 'Enter / Space',
          description: '포커스된 액션 버튼 활성화 또는 ID 복사',
        },
      ]}
      relatedLinks={[
        {
          label: 'Section Card',
          path: '/design/components/section-card',
          description: '정보 그룹화 카드 컨테이너',
        },
        { label: 'Tabs', path: '/design/components/tabs', description: '콘텐츠 탭 전환' },
        {
          label: 'Context Menu',
          path: '/design/components/context-menu',
          description: '추가 액션 메뉴',
        },
      ]}
      notionPageId="30d9eddc34e680fda3cfe37d8da333a7"
    />
  );
}
