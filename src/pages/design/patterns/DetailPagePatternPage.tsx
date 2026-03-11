import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import {
  VStack,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  Button,
} from '@/design-system';
import { IconEdit, IconPlayerPlay, IconPower, IconChevronDown } from '@tabler/icons-react';

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

function DetailPagePreview() {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <VStack gap={4}>
      <DetailHeader>
        <DetailHeader.Title>web-server-01</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
            Start
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconPower size={12} />}>
            Stop
          </Button>
          <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
            More Actions
          </Button>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" status="active" />
          <DetailHeader.InfoCard label="ID" value="i-0a1b2c3d4e5f" copyable />
          <DetailHeader.InfoCard label="Host" value="compute-node-03" />
          <DetailHeader.InfoCard label="Created at" value="2026-02-15 09:30" />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="details">Details</Tab>
          <Tab value="volumes">Volumes</Tab>
          <Tab value="network">Network</Tab>
        </TabList>

        <TabPanel value="details" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SectionCard>
              <SectionCard.Header
                title="Basic information"
                actions={
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                }
              />
              <SectionCard.Content>
                <SectionCard.DataRow label="Instance name" value="web-server-01" />
                <SectionCard.DataRow label="Availability zone" value="nova" />
                <SectionCard.DataRow label="Description" value="Production web server" />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Flavor" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Flavor name" value="m1.large" isLink linkHref="#" />
                <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>

        <TabPanel value="volumes" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SectionCard>
              <SectionCard.Header title="Attached Volumes" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Root volume" value="vol-abc123" isLink linkHref="#" />
                <SectionCard.DataRow label="Size" value="80 GiB" />
                <SectionCard.DataRow label="Type" value="SSD" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>

        <TabPanel value="network" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SectionCard>
              <SectionCard.Header title="Network configuration" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Private IP" value="10.0.1.12" />
                <SectionCard.DataRow label="Public IP" value="—" />
                <SectionCard.DataRow label="Security group" value="default" isLink linkHref="#" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>
  );
}

function DetailPageGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>

        <SubSectionTitle>전체 레이아웃 구조</SubSectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[DetailHeader]
  ├── 리소스명 (타이틀)
  ├── 액션 버튼 그룹
  └── 메타 정보 카드 (Status, ID, Host, Created at 등)

[Tabs]
  └── 탭별 콘텐츠 (Details / Volumes / Network 등)

[SectionCards]
  └── 섹션 타이틀 + Edit 버튼
      └── 속성 항목 (Label + Value)`}</pre>
        </div>

        <SubSectionTitle>1. DetailHeader 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 리소스명</Td>
              <Td>현재 페이지 대상 리소스의 이름을 H1 수준으로 표시</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>b. 액션 버튼 그룹</Td>
              <Td>
                해당 리소스에 수행 가능한 주요 액션 버튼 나열 (Primary / Secondary / More Actions)
              </Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>c. 메타 정보 카드</Td>
              <Td>Status, ID, Host, Created at 등 리소스의 핵심 식별 정보를 카드 형태로 표시</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>d. Status 인디케이터</Td>
              <Td>리소스의 현재 상태를 아이콘 또는 뱃지로 시각화</Td>
              <Td>상태값이 존재하는 리소스에 한함</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. Tabs 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 탭 목록</Td>
              <Td>리소스와 관련된 정보 카테고리를 탭으로 구분 (예: Details, Volumes, Network)</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>b. 활성 탭 표시</Td>
              <Td>현재 선택된 탭을 언더라인 및 색상으로 강조</Td>
              <Td>항상</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>3. SectionCards 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 섹션 타이틀</Td>
              <Td>해당 카드의 정보 범주를 나타내는 제목 (예: Basic information, Flavor)</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>b. Edit 버튼</Td>
              <Td>섹션 내 속성을 수정할 수 있는 인라인 편집 진입점</Td>
              <Td>수정 가능한 섹션에 한함</Td>
            </tr>
            <tr>
              <Td>c. 속성 항목</Td>
              <Td>
                Label + Value 쌍으로 구성된 정보 행. Value는 텍스트, 뱃지, 링크, 복사 버튼 등 다양한
                형태 가능
              </Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>d. 구분선</Td>
              <Td>속성 항목 간 시각적 구분을 위한 수평선</Td>
              <Td>항상</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior & Flow */}
      <VStack gap={4}>
        <SectionTitle>Behavior &amp; Flow</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>페이지 진입 흐름</SubSectionTitle>
          <Prose>
            <ol className="list-decimal pl-5 space-y-1">
              <li>List Page 또는 외부 링크에서 특정 리소스를 선택하면 Detail Page로 진입</li>
              <li>진입 시 기본 탭(첫 번째 탭, 통상 Details)이 활성화된 상태로 표시</li>
              <li>메타 정보 카드는 탭 전환과 무관하게 항상 고정 노출</li>
            </ol>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>탭 전환</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>탭 클릭 시 URL 파라미터 또는 해시(#)가 변경되며 해당 탭 콘텐츠로 전환</li>
              <li>탭 전환 시 페이지 전체를 새로고침하지 않고 콘텐츠 영역만 교체 (SPA 방식)</li>
              <li>이전에 조회한 탭 상태(스크롤 위치 등)는 유지하지 않음</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>액션 실행</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>액션 버튼 클릭 시 즉시 실행 또는 확인 모달(Modal)을 통해 사용자 의도를 재확인</li>
              <li>파괴적 액션(삭제, 중지 등)은 반드시 확인 모달을 거침</li>
              <li>액션 완료 후 Status 인디케이터 및 메타 정보가 실시간으로 갱신됨</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>데이터 로딩</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>초기 진입 시 Skeleton 컴포넌트로 로딩 상태를 표시</li>
              <li>
                섹션별로 데이터를 순차 로드하여 사용자가 빠르게 주요 정보를 확인할 수 있도록 함
              </li>
              <li>데이터 로드 실패 시 해당 섹션에 에러 메시지와 재시도 버튼을 인라인으로 표시</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>엣지 케이스</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[280px]">상황</Th>
                <Th>처리 방식</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>리소스가 존재하지 않을 때</Td>
                <Td>404 에러 페이지 또는 인라인 Empty State 표시</Td>
              </tr>
              <tr>
                <Td>권한이 없는 리소스에 접근할 때</Td>
                <Td>403 에러 메시지와 함께 접근 불가 안내</Td>
              </tr>
              <tr>
                <Td>리소스 상태가 변경 중일 때 (Provisioning 등)</Td>
                <Td>액션 버튼 비활성화 + Tooltip으로 사유 안내</Td>
              </tr>
              <tr>
                <Td>속성값이 없거나 미설정 상태일 때</Td>
                <Td>
                  <code>—</code> (em dash) 또는 <code>None</code> 표시, 빈 칸으로 두지 않음
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '메타 정보 카드에는 리소스를 빠르게 식별할 수 있는 핵심 속성(ID, Status, 생성일 등) 4개 이하로 제한한다.',
            '액션 버튼은 사용 빈도에 따라 Primary → Secondary → More Actions 순으로 배치한다.',
            'SectionCards는 정보의 논리적 범주에 따라 나눠 구성하고, 한 카드 내 속성은 관련성이 높은 항목끼리 묶는다.',
            '탭은 리소스와 직접적으로 연관된 카테고리만 노출하며, 불필요한 탭으로 인한 인지 부하를 줄인다.',
            'ID처럼 복사 수요가 높은 값에는 복사 버튼을 인라인으로 제공한다.',
          ]}
          dontItems={[
            '메타 정보 카드에 과도하게 많은 속성을 나열하지 않는다. 보조적인 정보는 SectionCards에 배치한다.',
            '탭 내부에 또 다른 탭을 중첩하여 사용하지 않는다. (탭 중첩 금지)',
            '파괴적 액션(삭제, 초기화 등)을 확인 단계 없이 즉시 실행하지 않는다.',
            '속성값이 없는 경우 해당 행 자체를 숨기지 않는다. 항상 — 또는 None으로 표시하여 의도적으로 비어 있음을 인지시킨다.',
            'Edit 버튼을 모든 섹션에 일괄 적용하지 않는다. 수정 불가한 읽기 전용 속성에는 Edit 버튼을 노출하지 않는다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>리소스명 (타이틀)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                리소스명은 사용자가 직접 입력한 이름을 그대로 표시하되, 최대 표시 글자 수를 초과할
                경우 말줄임(<code>…</code>)으로 처리한다.
              </li>
              <li>
                시스템이 자동 생성한 이름인 경우 사용자가 인지할 수 있는 패턴(예:{' '}
                <code>instance-production-01</code>)을 따른다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>섹션 타이틀</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                섹션 타이틀은 해당 섹션이 담고 있는 정보의 범주를 명확하게 드러내는 명사형으로
                작성한다.
              </li>
              <li>
                예시: <code>Basic information</code>, <code>Network configuration</code>,{' '}
                <code>Flavor</code>
              </li>
              <li>
                동사형이나 문장형 표현은 사용하지 않는다. (예: <s>"Configure your network"</s>)
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>속성 레이블 (Label)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>속성 레이블은 간결한 명사 또는 명사구로 작성한다.</li>
              <li>
                레이블은 해당 속성이 무엇인지를 명확히 전달해야 하며, 약어 사용 시 Tooltip으로 전체
                표현을 제공한다.
              </li>
              <li>
                예시: <code>Instance name</code>, <code>Availability zone</code>,{' '}
                <code>Created at</code>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>속성값 (Value)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                값이 없는 경우 <code>—</code>(em dash)를 사용하며 <code>N/A</code>,{' '}
                <code>null</code>, 빈 문자열은 사용하지 않는다.
              </li>
              <li>ID처럼 긴 값은 전체를 노출하되 복사 버튼을 함께 제공한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>탭 레이블</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                탭 레이블은 해당 탭의 콘텐츠 범주를 나타내는 명사형 단어 또는 짧은 명사구로
                작성한다.
              </li>
              <li>
                예시: <code>Details</code>, <code>Volumes</code>, <code>Network</code>,{' '}
                <code>Logs</code>
              </li>
              <li>동사, 문장 형태는 사용하지 않는다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>
    </VStack>
  );
}

export function DetailPagePatternPage() {
  return (
    <ComponentPageTemplate
      title="Detail Page"
      description="리소스의 상세 정보를 조회하고 관리하기 위한 페이지 패턴이다. DetailHeader + Tabs + SectionCards 조합으로 구성되며, 50개 이상의 페이지에서 사용된다."
      whenToUse={[
        '특정 리소스(인스턴스, 클러스터, 볼륨 등)의 세부 속성과 상태를 조회해야 할 때',
        '리소스에 대한 작업(수정, 삭제, 재시작 등)을 실행해야 할 때',
        '리소스와 연관된 하위 항목(볼륨, 네트워크, 로그 등)을 탭으로 구분하여 탐색해야 할 때',
      ]}
      whenNotToUse={[
        '여러 리소스를 동시에 비교하거나 목록으로 탐색해야 할 때 → List Page 사용',
        '리소스 생성·설정 입력이 주목적일 때 → Form Pattern 사용',
        '간단한 요약 정보만 필요한 경우 → Card 컴포넌트 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<VStack gap={4}>
  <DetailHeader>
    <DetailHeader.Title>web-server-01</DetailHeader.Title>
    <DetailHeader.Actions>...</DetailHeader.Actions>
    <DetailHeader.InfoGrid>
      <DetailHeader.InfoCard label="Status" status="active" />
      <DetailHeader.InfoCard label="ID" value="i-0a1b2c3d4e5f" copyable />
      ...
    </DetailHeader.InfoGrid>
  </DetailHeader>

  <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
    <TabList>
      <Tab value="details">Details</Tab>
      <Tab value="volumes">Volumes</Tab>
    </TabList>
    <TabPanel value="details">
      <SectionCard>...</SectionCard>
    </TabPanel>
  </Tabs>
</VStack>`}
        >
          <DetailPagePreview />
        </ComponentPreview>
      }
      guidelines={<DetailPageGuidelines />}
      relatedLinks={[
        {
          label: 'List Page',
          path: '/design/patterns/list-page',
          description: '리소스 목록 탐색 패턴',
        },
        {
          label: 'Empty State',
          path: '/design/patterns/empty-states',
          description: '빈 상태 표시',
        },
        { label: 'Tabs', path: '/design/components/tabs', description: '콘텐츠 탭 전환' },
        {
          label: 'Section Card',
          path: '/design/patterns/section-card',
          description: '정보 그룹화 카드',
        },
        {
          label: 'Detail Header',
          path: '/design/patterns/detail-header',
          description: '상세 페이지 헤더',
        },
      ]}
    />
  );
}
