import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { VStack } from '@/design-system';

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

function Good({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-state-success)] font-medium">{children}</span>;
}

function Bad({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-state-danger)] font-medium">{children}</span>;
}

function EmptyStatesGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <Prose>
          <p>
            Empty State는 아이콘, 제목, 설명, 액션 버튼으로 구성된다. 각 요소는 위에서 아래로 수직
            정렬되며 중앙 정렬을 기본으로 한다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">요소</Th>
              <Th className="w-[100px]">필수 여부</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>아이콘</strong>
              </Td>
              <Td>권장</Td>
              <Td>
                상황을 시각적으로 전달. size={'{48}'}, stroke={'{1}'} 통일. 리소스 타입에 맞는
                아이콘 사용
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>제목</strong>
              </Td>
              <Td>✅ 필수</Td>
              <Td>현재 상태를 명확하게 전달. &quot;No [리소스] found&quot; 패턴 권장</Td>
            </tr>
            <tr>
              <Td>
                <strong>설명</strong>
              </Td>
              <Td>권장</Td>
              <Td>다음 행동을 안내. 1~2문장으로 간결하게 작성</Td>
            </tr>
            <tr>
              <Td>
                <strong>액션 버튼</strong>
              </Td>
              <Td>조건부</Td>
              <Td>
                Empty state를 벗어날 수 있는 주요 행동 제공. 생성·업로드 등. 액션이 없는 경우 생략
                가능
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior & Flow */}
      <VStack gap={6}>
        <SectionTitle>Behavior &amp; Flow</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>상태 전환 흐름</SubSectionTitle>
          <Prose>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                <strong>초기 Empty State</strong> — 데이터가 아직 없는 상태. 생성 유도 액션 버튼을
                함께 제공한다.
              </li>
              <li>
                <strong>액션 실행</strong> — 버튼 클릭 시 해당 리소스 생성 플로우로 진입한다.
              </li>
              <li>
                <strong>데이터 생성 완료</strong> — 리소스가 생성되면 Empty State는 사라지고 정상
                컨텐츠가 표시된다.
              </li>
            </ol>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>엣지 케이스</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">케이스</Th>
                <Th>처리 방법</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>로딩 중 깜빡임 방지</strong>
                </Td>
                <Td>
                  데이터 로딩 완료 전에 Empty State가 먼저 노출되지 않도록 한다. 로딩 완료 후에도
                  데이터가 없을 때만 Empty State를 표시한다.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>필터·검색 결과 없음</strong>
                </Td>
                <Td>
                  검색어나 필터를 초기화할 수 있는 보조 액션(예: &quot;Clear filters&quot;)을 함께
                  제공하는 것을 권장한다.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>권한 없음 상태</strong>
                </Td>
                <Td>액션 버튼을 노출하지 않거나, 권한 요청 방법을 안내하는 설명으로 대체한다.</Td>
              </tr>
              <tr>
                <Td>
                  <strong>중첩 Empty State 방지</strong>
                </Td>
                <Td>
                  페이지 내 여러 섹션에 Empty State가 동시에 노출될 경우, 페이지 레벨의 Empty State
                  하나로 통합하는 것을 권장한다.
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
            '상황에 맞는 메시지를 사용한다. 초기 상태와 검색 결과 없음은 다른 메시지와 아이콘으로 구분한다.',
            '명확한 액션을 제공한다. 사용자가 Empty State를 벗어날 수 있는 행동을 버튼으로 안내한다.',
            '간결하게 작성한다. 제목은 1줄, 설명은 1~2문장을 넘지 않도록 한다.',
            '리소스 타입에 맞는 아이콘을 사용한다. 맥락 없는 범용 아이콘보다 리소스를 직관적으로 표현하는 아이콘을 선택한다.',
          ]}
          dontItems={[
            '데이터 로딩 중 Empty State를 노출하지 않는다. 로딩 완료 후에도 데이터가 없을 때만 표시한다.',
            '여러 액션 버튼을 나열하지 않는다. 주요 행동 1개(Primary), 보조 행동 1개(Secondary) 이내로 제한한다.',
            '오류 상황에 Empty State를 사용하지 않는다. 오류는 별도의 Error 패턴 또는 Inline Message로 처리한다.',
            '아이콘을 장식 목적으로 남용하지 않는다. 아이콘이 상태 전달에 기여하지 않는다면 생략할 수 있다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={6}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <p>
            제목과 설명은 사용자가 현재 상태를 이해하고 다음 행동을 결정하는 데 직접적인 영향을
            미친다.
          </p>
        </Prose>

        <VStack gap={3}>
          <SubSectionTitle>제목 작성 원칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>현재 상태를 명확하게 전달하는 명사형 문장으로 작성한다.</li>
              <li>
                <strong>권장 패턴</strong>: &quot;No [리소스] found&quot;
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>
                    <Good>✅</Good> No instances found
                  </li>
                  <li>
                    <Good>✅</Good> No results found
                  </li>
                  <li>
                    <Bad>❌</Bad> Nothing here! (상태가 불명확)
                  </li>
                </ul>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>설명 작성 원칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>사용자가 취할 수 있는 다음 행동을 안내한다.</li>
              <li>1~2문장, 간결하고 직접적으로 작성한다.</li>
              <li>
                <strong>권장 패턴</strong>: &quot;[행동]하여 시작하세요.&quot; 또는 &quot;[조건]을
                조정해보세요.&quot;
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>
                    <Good>✅</Good> Create your first instance to get started.
                  </li>
                  <li>
                    <Good>✅</Good> Try adjusting your search or filter criteria.
                  </li>
                  <li>
                    <Bad>❌</Bad> There is nothing to display at the moment because no data has been
                    entered yet. (과도하게 길다)
                  </li>
                </ul>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>액션 버튼 레이블</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                동사로 시작하는 간결한 레이블을 사용한다.
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>
                    <Good>✅</Good> Create instance, Upload file, Clear filters
                  </li>
                  <li>
                    <Bad>❌</Bad> Click here to create, Go to creation page
                  </li>
                </ul>
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>
    </VStack>
  );
}

export function EmptyStatesPage() {
  return (
    <ComponentPageTemplate
      title="Empty States"
      description="데이터가 없을 때 사용자에게 현재 상태를 안내하고 다음 행동을 유도하는 패턴. 단순히 빈 화면을 노출하는 대신, 상황에 맞는 메시지와 액션을 제공하여 사용자가 막힘 없이 다음 단계로 진행할 수 있도록 돕는다."
      whenToUse={[
        '아직 데이터가 생성되지 않은 초기 상태일 때 (예: 첫 리소스 생성 유도)',
        '검색 또는 필터 조건에 해당하는 결과가 없을 때',
      ]}
      whenNotToUse={[
        '데이터 로딩 중인 상태 → Loading 컴포넌트 사용',
        '오류로 인해 데이터를 불러오지 못한 경우 → Inline Message 또는 Error 패턴 사용',
      ]}
      guidelines={<EmptyStatesGuidelines />}
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Button', path: '/design/components/button' },
        { label: 'Skeleton', path: '/design/components/skeleton' },
      ]}
    />
  );
}
