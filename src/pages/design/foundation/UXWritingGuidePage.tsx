import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
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

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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

function Good({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-state-success)] font-medium">{children}</span>;
}

function Bad({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-state-danger)] font-medium">{children}</span>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function SourceLink() {
  return (
    <a
      href="https://www.notion.so/thakicloud/UX-writing-Guide-2a49eddc34e6806289f7c36e59461385"
      target="_blank"
      rel="noopener noreferrer"
      className="text-body-sm text-[var(--color-state-info)] hover:underline"
    >
      Notion 원본 문서 보기 →
    </a>
  );
}

export function UXWritingGuidePage() {
  return (
    <ComponentPageTemplate
      title="UX Writing Guide"
      description="Thaki Cloud Suite의 모든 UI 텍스트에 대한 기준 문서. 언어 원칙, 컴포넌트별 작성 패턴, 날짜/시간/숫자/단위의 표기 기준을 정의합니다."
      examples={
        <VStack gap={12}>
          {/* Source Link */}
          <SourceLink />

          {/* 1. 문서의 목적 */}
          <VStack gap={4}>
            <SectionTitle>1. 문서의 목적</SectionTitle>
            <Prose>
              <p>
                본 문서는 Thaki Cloud Suite의 모든 UI 텍스트에 대한 기준 문서로 다음을 정의합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>제품 전반의 언어 원칙</li>
                <li>UI 컴포넌트별 작성 패턴</li>
                <li>날짜/시간/숫자/단위의 표기 기준</li>
              </ul>
              <p className="mt-3">본 문서의 목표:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  여러 기능이 앱 단위로 제공되더라도, 전체 서비스가 일관된 목소리를 갖게 함으로써
                  사용자의 학습 비용을 최소화한다.
                </li>
                <li>
                  전문 용어가 많고 다국어가 제공되는 서비스 특성을 고려해 표준화된 용어 체계를
                  만들어 서비스 완성도를 높인다.
                </li>
                <li>
                  통합적인 언어 규칙으로 서비스 개발 과정에서 언어 관련 의사결정을 반복하지 않도록
                  한다.
                </li>
              </ol>
            </Prose>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* 2. 보이스와 톤 */}
          <VStack gap={4}>
            <SectionTitle>2. 보이스와 톤</SectionTitle>
            <Prose>
              <p>
                보이스와 톤은 서비스가 가진 개성, 표현 방식, 어조 등 변하지 않는 언어 정체성을
                의미합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>전문적, 신뢰감</li>
                <li>불필요한 감정 표현 지양</li>
                <li>명확하고 간결한 문체</li>
                <li>기술적이고 전문적인 어휘 사용</li>
              </ul>
            </Prose>

            {/* 대기/진행중 */}
            <VStack gap={2}>
              <SubSectionTitle>대기/진행중</SubSectionTitle>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[80px]">구분</Th>
                    <Th>
                      <Good>✅ 전문적(신뢰감)</Good>
                    </Th>
                    <Th>
                      <Bad>❌ 친근함(친절)</Bad>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>문체</Td>
                    <Td>
                      <strong>설명형, 객관적</strong>
                    </Td>
                    <Td>대화체, 친근한 어조</Td>
                  </tr>
                  <tr>
                    <Td>어휘</Td>
                    <Td>
                      <strong>
                        기술 중심 (&quot;설정&quot;, &quot;리소스&quot;, &quot;세션&quot;)
                      </strong>
                    </Td>
                    <Td>일상 중심 (&quot;지금&quot;, &quot;바로&quot;, &quot;잠시만요&quot;)</Td>
                  </tr>
                  <tr>
                    <Td>예시</Td>
                    <Td>
                      <strong>&quot;리소스 생성에는 약간의 시간이 소요됩니다.&quot;</strong>
                    </Td>
                    <Td>&quot;리소스를 준비 중이에요. 잠시만 기다려 주세요.&quot;</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 성공 */}
            <VStack gap={2}>
              <SubSectionTitle>성공</SubSectionTitle>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[80px]">구분</Th>
                    <Th>
                      <Good>✅ 전문적(신뢰감)</Good>
                    </Th>
                    <Th>
                      <Bad>❌ 친근함(친절)</Bad>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>문체</Td>
                    <Td>
                      <strong>간결한 완료 통보 (&quot;완료되었습니다.&quot;)</strong>
                    </Td>
                    <Td>
                      성취 공유, 긍정 감정 표현 (&quot;완성됐어요!&quot;, &quot;좋아요!&quot;)
                    </Td>
                  </tr>
                  <tr>
                    <Td>감정 강도</Td>
                    <Td>
                      <strong>낮음 — 결과 중심</strong>
                    </Td>
                    <Td>중간 — 함께 축하, 격려</Td>
                  </tr>
                  <tr>
                    <Td>예시</Td>
                    <Td>
                      <strong>&quot;이미지 생성이 완료되었습니다.&quot;</strong>
                    </Td>
                    <Td>&quot;이미지가 완성됐어요. 멋지게 만들어졌네요!&quot;</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 경고/에러 */}
            <VStack gap={2}>
              <SubSectionTitle>경고/에러</SubSectionTitle>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[80px]">구분</Th>
                    <Th>
                      <Good>✅ 전문적(신뢰감)</Good>
                    </Th>
                    <Th>
                      <Bad>❌ 친근함(친절)</Bad>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>문체</Td>
                    <Td>
                      <strong>단정적, 명확한 어조 (&quot;…하지 않습니다.&quot;)</strong>
                    </Td>
                    <Td>공감 중심, 완화된 어조 (&quot;…한 것 같아요.&quot;)</Td>
                  </tr>
                  <tr>
                    <Td>구조</Td>
                    <Td>
                      <strong>원인 → 해결책</strong>
                    </Td>
                    <Td>공감 → 행동 제안</Td>
                  </tr>
                  <tr>
                    <Td>예시</Td>
                    <Td>
                      <strong>&quot;인증 키가 유효하지 않습니다. 새 키를 등록하세요.&quot;</strong>
                    </Td>
                    <Td>&quot;인증 키가 만료된 것 같아요. 새 키를 등록하면 해결돼요.&quot;</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* 3. 공통 표기 규칙 */}
          <VStack gap={6}>
            <SectionTitle>3. 공통 표기 규칙</SectionTitle>
            <Prose>
              <p>
                모든 앱, 컴포넌트에서 공통으로 적용되는 기본 문법에 해당합니다. 개별 컴포넌트의 세부
                규칙은 본 규칙을 침해할 수 없습니다.
              </p>
            </Prose>

            {/* 3-1. 문장부호 */}
            <VStack gap={3}>
              <SubSectionTitle>3-1. 문장부호</SubSectionTitle>
              <Prose>
                <p>
                  문장부호는 국립국어원 어문 규범을 기본으로 하되, 영문 및 디지털 채널의 쓰임새에
                  맞게 정의합니다.
                </p>
              </Prose>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[100px]">부호</Th>
                    <Th>표기 원칙</Th>
                    <Th>사용 예시</Th>
                    <Th>비사용 예시</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>마침표(.)</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>문장을 끝맺을 때 표기</li>
                        <li>시스템 메시지, 안내 문구, 상태 설명에 적용</li>
                        <li>예외: 플레이스홀더, 버튼, 짧은 상태 라벨</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>리소스 생성이 완료되었습니다.</li>
                        <li>권한이 없습니다.</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>&quot;저장&quot; (버튼)</li>
                        <li>&quot;이름을 입력하세요&quot; (플레이스홀더)</li>
                      </ul>
                    </Td>
                  </tr>
                  <tr>
                    <Td>쉼표(,)</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>문장 내 의미 단위를 구분할 때만 사용</li>
                        <li>숫자, 조건, 나열 관계를 명확히 할 목적</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>영문만 사용할 수 있으며, 길이는 10~20자 사이로 입력해 주세요.</li>
                        <li>15,000 GiB</li>
                      </ul>
                    </Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>빗금(/)</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>사용 현황을 나타낼 때 사용량과 할당량 사이에 사용</li>
                        <li>대응, 대립되는 단어를 나열할 때 표기</li>
                      </ul>
                    </Td>
                    <Td>10/50</Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>소괄호(())</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>앞 단어에 대한 보조 정보, 부연 설명, 기준 정보</li>
                        <li>소괄호 앞은 반드시 앞 단어에 붙여 쓴다</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>MFA 활성화된 계정: 117(78%)</li>
                        <li>default (+5)</li>
                      </ul>
                    </Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>대괄호([])</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>괄호 안에 또 괄호를 쓸 때 바깥쪽 괄호</li>
                        <li>메뉴명, 버튼명, 경로를 눈에 띄게 표시할 때</li>
                      </ul>
                    </Td>
                    <Td>[확인] 버튼을 눌러주세요.</Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>콜론(:)</Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>뒤에 구체적인 내용을 열거하거나 설명을 덧붙일 때</li>
                        <li>앞말에는 붙여쓰고 뒤는 띄어 쓴다</li>
                        <li>시간 표기 시 콜론은 띄어쓰기 없이 사용</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>ID: thaki1234</li>
                        <li>15:10</li>
                      </ul>
                    </Td>
                    <Td />
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 3-2. 날짜, 시간 */}
            <VStack gap={3}>
              <SubSectionTitle>3-2. 날짜, 시간</SubSectionTitle>
              <Prose>
                <ul className="list-disc pl-5 space-y-1">
                  <li>기본 시간은 사용자의 로컬 시간을 기준으로 표시</li>
                  <li>오전/오후 구분 없이 24시간 표기법 적용</li>
                  <li>화면 목적에 따라 시간 표기 방식은 선택적으로 적용</li>
                  <li>
                    시각적 정렬과 일관성을 위해 10 미만의 숫자 앞에는 &quot;0&quot;을 붙인다.{' '}
                    <Bad>9시(❌)</Bad> → <Good>09시(✅)</Good>
                  </li>
                  <li>
                    날짜와 시간 사이에는 한 칸 띄어쓰기, 기간 표기 시 물결표(~) 또는 하이픈(–)
                    앞뒤로 띄어쓰기 없이 표기
                  </li>
                </ul>
              </Prose>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[120px]">유형</Th>
                    <Th>한국어 표기 원칙</Th>
                    <Th>영어 표기 원칙</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>
                      <strong>기한</strong>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1 text-body-sm">
                        <li>(같은 일자) YYYY-MM-DD HH:mm~HH:mm (UTC+N)</li>
                        <li>(같은 연도) YYYY-MM-DD~MM-DD (UTC+N)</li>
                        <li>(다른 연도) YYYY-MM-DD~YYYY-MM-DD (UTC+N)</li>
                        <li>(마감일) YYYY-MM-DD HH:mm (UTC+N)까지</li>
                      </ul>
                    </Td>
                    <Td>
                      <ul className="list-disc pl-4 space-y-1 text-body-sm">
                        <li>(같은 일자) Mth DD, YYYY HH:mm–HH:mm (UTC+N)</li>
                        <li>(같은 연도) Mth DD–Mth DD, YYYY (UTC+N)</li>
                        <li>(다른 연도) Mth DD, YYYY–Mth DD, YYYY (UTC+N)</li>
                        <li>(마감일) Due by Mth DD, YYYY HH:mm (UTC+N)</li>
                      </ul>
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <strong>일자(표준형)</strong>
                    </Td>
                    <Td className="text-body-sm">YYYY-MM-DD HH:mm:ss (UTC+N)</Td>
                    <Td className="text-body-sm">Mth DD, YYYY HH:mm:ss (UTC+N)</Td>
                  </tr>
                  <tr>
                    <Td>
                      <strong>일자(축약형)</strong>
                    </Td>
                    <Td className="text-body-sm">YYYY-MM-DD</Td>
                    <Td className="text-body-sm">Mth DD, YYYY</Td>
                  </tr>
                  <tr>
                    <Td>
                      <strong>시각</strong>
                    </Td>
                    <Td className="text-body-sm">HH:mm</Td>
                    <Td className="text-body-sm">HH:mm</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 3-3. 숫자, 단위 */}
            <VStack gap={3}>
              <SubSectionTitle>3-3. 숫자, 단위</SubSectionTitle>

              {/* 공통 규칙 */}
              <p className="text-label-lg text-[var(--color-text-default)]">공통 규칙</p>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th className="w-[140px]">항목</Th>
                    <Th>규칙</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>적용 대상</Td>
                    <Td>
                      값의 크기를 비교하거나 더할 수 있는 숫자를 대상으로 한다. 예외: 네트워크
                      식별자, ID/코드, 버전/규격, 날짜/시각, 사용자 입력값
                    </Td>
                  </tr>
                  <tr>
                    <Td>반올림</Td>
                    <Td>모든 반올림은 round half-up을 사용한다.</Td>
                  </tr>
                  <tr>
                    <Td>숫자-단위 공백</Td>
                    <Td>
                      숫자와 단위 사이에는 공백 1칸을 둔다. (예: 123.4 ms, 1.2 GiB/s) 예외: 퍼센트
                      기호(%)는 숫자 뒤에 공백 없이 표기 (예: 12.3%)
                    </Td>
                  </tr>
                  <tr>
                    <Td>trailing zero</Td>
                    <Td>의미를 추가하지 않는 소수점 .0은 제거한다. (2.0 GiB → 2 GiB, 1.0K → 1K)</Td>
                  </tr>
                  <tr>
                    <Td>차트(Y축)</Td>
                    <Td>
                      하나의 차트(Y축)는 단일 단위만 사용한다. (범위 내 max 기준으로 단위 결정 후
                      고정)
                    </Td>
                  </tr>
                  <tr>
                    <Td>툴팁</Td>
                    <Td>차트 단위와 동일 단위 사용</Td>
                  </tr>
                </tbody>
              </TableWrapper>

              {/* 숫자 표기 */}
              <p className="text-label-lg text-[var(--color-text-default)]">숫자 표기</p>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>값 범위</Th>
                    <Th>표시 정책</Th>
                    <Th>예시</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>&lt; 10</Td>
                    <Td>소수 1자리까지 표시, trailing zero 제거 가능</Td>
                    <Td>9.7 또는 9</Td>
                  </tr>
                  <tr>
                    <Td>10 ~ 100</Td>
                    <Td>소수 1자리까지 표시, trailing zero 제거 가능</Td>
                    <Td>12.3 또는 12</Td>
                  </tr>
                  <tr>
                    <Td>&gt;= 100</Td>
                    <Td>정수</Td>
                    <Td>125</Td>
                  </tr>
                  <tr>
                    <Td>천 단위 구분</Td>
                    <Td>정수. 3자리 콤마 적용</Td>
                    <Td>12,345</Td>
                  </tr>
                  <tr>
                    <Td>로케일 적용</Td>
                    <Td>
                      숫자는 사용자 로케일을 기준으로 포맷. 천 단위 구분자와 소수점 기호는 로케일에
                      따라 자동 적용하며, 로케일 정보가 없는 경우 콤마(,)를 기본값으로 사용
                    </Td>
                    <Td />
                  </tr>
                </tbody>
              </TableWrapper>

              {/* 단위 자동 변환 표기 */}
              <p className="text-label-lg text-[var(--color-text-default)]">단위 자동 변환 표기</p>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>입력 단위</Th>
                    <Th>표시 단위</Th>
                    <Th>표시 정책</Th>
                    <Th>예시</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>B</Td>
                    <Td>KiB/MiB/GiB/TiB/PiB</Td>
                    <Td>값 크기에 따라 자동 변환, 소수 1자리</Td>
                    <Td>1,536 B → 1.5 KiB</Td>
                  </tr>
                  <tr>
                    <Td>B/s</Td>
                    <Td>KiB/s → MiB/s → GiB/s</Td>
                    <Td>값 크기에 따라 자동 변환, 소수 1자리</Td>
                    <Td>1,048,576 B/s → 1 MiB/s</Td>
                  </tr>
                  <tr>
                    <Td>ops/s</Td>
                    <Td>ops/s (축약 가능)</Td>
                    <Td>큰 수는 K/M/B 축약 적용, 소수 1자리</Td>
                    <Td>15,320 ops/s → 15.3K ops/s</Td>
                  </tr>
                  <tr>
                    <Td>p/s</Td>
                    <Td>p/s (축약 가능)</Td>
                    <Td>K/M/B 축약 적용, 소수 1자리</Td>
                    <Td>15,320 p/s → 15.3K p/s</Td>
                  </tr>
                  <tr>
                    <Td>ns</Td>
                    <Td>ns/μs/ms/s</Td>
                    <Td>값 크기에 따라 자동 변환, 소수 1자리</Td>
                    <Td>1,200 ns → 1.2 μs</Td>
                  </tr>
                  <tr>
                    <Td>ms</Td>
                    <Td>ms/s</Td>
                    <Td>&lt;1000 ms는 ms, ≥1000 ms는 s, 소수 1자리</Td>
                    <Td>1,200 ms → 1.2 s</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 3-4. 영문 표기 */}
            <VStack gap={3}>
              <SubSectionTitle>3-4. 영문 표기</SubSectionTitle>

              <Prose>
                <p>
                  <strong>대소문자</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    약어, 고유명사를 제외한 모든 문장은 Sentence case(첫 단어만 대문자)를 기본으로
                    한다.
                  </li>
                  <li>
                    <Good>Create instance ✅</Good> / <Bad>Create Instance ❌</Bad>
                  </li>
                </ul>
              </Prose>

              <Prose>
                <p>
                  <strong>관사</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    테이블 컬럼/메뉴 라벨/탭 라벨/액션+대상 조합의 버튼 등 어떤 &quot;종류&quot;
                    전체를 말하는 일반 개념은 관사를 생략한다.
                  </li>
                  <li>
                    <Good>Add tag ✅</Good> / <Bad>Add a tag ❌</Bad>
                  </li>
                  <li>문장형에서는 the, a(an)를 작문 규칙에 알맞게 사용한다.</li>
                </ul>
              </Prose>

              <Prose>
                <p>
                  <strong>복수/단수</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    테이블 컬럼/메뉴 라벨/탭 라벨 등 수량이 아니라 개념 집합일 때 복수형을 사용한다.{' '}
                    <Good>Users ✅</Good> / <Bad>User ❌</Bad>
                  </li>
                  <li>
                    &quot;액션+대상&quot; 조합인 버튼에서 새로운 하나의 객체를 생성/수정/삭제하는
                    행위일 때는 단수형을 사용한다. <Good>Create user ✅</Good> /{' '}
                    <Bad>Create users ❌</Bad>
                  </li>
                  <li>
                    집합 전체를 관리하는 버튼일 때는 복수형을 사용한다. <Good>Manage users ✅</Good>{' '}
                    / <Bad>Manage user ❌</Bad>
                  </li>
                  <li>
                    숫자와 함께 표기 되는 경우: 0 또는 1일 때 단수형, 2 이상일 때 복수형. (1 user, 3
                    users)
                  </li>
                </ul>
              </Prose>
            </VStack>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* 4. UI 컴포넌트 별 표기 규칙 */}
          <VStack gap={6}>
            <SectionTitle>4. UI 컴포넌트 별 표기 규칙</SectionTitle>

            {/* 4-1 GNB/사이드 메뉴 */}
            <VStack gap={3}>
              <SubSectionTitle>4-1. 글로벌 네비게이션 (GNB/사이드 메뉴)</SubSectionTitle>
              <Prose>
                <p>제품의 정보 구조를 표현하는 영역으로, 통일성을 우선합니다.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>언어 설정과 관계없이 영어 원어를 유지</li>
                  <li>명사형 사용</li>
                  <li>최대 2단어 (2줄 이하)</li>
                </ol>
              </Prose>
            </VStack>

            {/* 4-2 버튼 */}
            <VStack gap={3}>
              <SubSectionTitle>4-2. 버튼</SubSectionTitle>
              <Prose>
                <p>사용자의 다음 행동을 명확하게 지시하는 간결한 단어를 사용합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>영어</strong>: 동사형 사용
                  </li>
                  <li>
                    <strong>한국어</strong>: &apos;~하기&apos;를 생략한 단일 명사형 사용
                  </li>
                </ul>
              </Prose>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>영어(EN)</Th>
                    <Th>한국어(KO)</Th>
                    <Th>❌ 잘못된 사용</Th>
                    <Th>비고</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>Create</Td>
                    <Td>생성</Td>
                    <Td>만들기, 생성하기, 추가</Td>
                    <Td>새로운 값을 넣어서 특정 리소스를 만드는 행위</Td>
                  </tr>
                  <tr>
                    <Td>{'Create {resource}'}</Td>
                    <Td>{'{리소스} 생성'}</Td>
                    <Td />
                    <Td>어떤 리소스를 생성하는 기능인지 설명이 필요할 때</Td>
                  </tr>
                  <tr>
                    <Td>Add</Td>
                    <Td>추가</Td>
                    <Td>생성, 만들기</Td>
                    <Td>기존 리소스에 하위 항목이나 속성을 더하는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Delete</Td>
                    <Td>삭제</Td>
                    <Td />
                    <Td>만들어진 리소스가 사라지는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Remove</Td>
                    <Td>제거</Td>
                    <Td />
                    <Td>연결 끊기 등 리소스가 직접적으로 사라지지 않는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Edit</Td>
                    <Td>편집</Td>
                    <Td>수정, 변경</Td>
                    <Td>기존 설정, 속성, 내용을 변경하는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Cancel</Td>
                    <Td>취소</Td>
                    <Td>닫기, 아니오</Td>
                    <Td>진행 중인 작업을 중단 및 없던 일로 만드는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Confirm</Td>
                    <Td>확인</Td>
                    <Td>적용, 예, 네</Td>
                    <Td>삭제 등 액션에 대한 의사를 다시 확인하는 행위</Td>
                  </tr>
                  <tr>
                    <Td>Save</Td>
                    <Td>저장</Td>
                    <Td />
                    <Td>여러 속성을 변경해 저장하는 행위</Td>
                  </tr>
                  <tr>
                    <Td>{'Manage {resources}'}</Td>
                    <Td>{'{리소스} 관리'}</Td>
                    <Td />
                    <Td>Manage 뒤에는 복수형 (Manage tags, Manage groups)</Td>
                  </tr>
                  <tr>
                    <Td>Close</Td>
                    <Td>닫기</Td>
                    <Td />
                    <Td>선택권이 없는 모달에서 사용</Td>
                  </tr>
                  <tr>
                    <Td>Skip</Td>
                    <Td>건너뛰기</Td>
                    <Td />
                    <Td>여러 단계에서 속성값 설정 없이 다음 단계로 넘어감</Td>
                  </tr>
                  <tr>
                    <Td>Previous</Td>
                    <Td>이전</Td>
                    <Td>Back, 되돌아가기</Td>
                    <Td>여러 단계에서 바로 이전 단계로 돌아감</Td>
                  </tr>
                  <tr>
                    <Td>Next</Td>
                    <Td>다음</Td>
                    <Td />
                    <Td>여러 단계에서 바로 앞 단계로 넘어감</Td>
                  </tr>
                  <tr>
                    <Td>Done</Td>
                    <Td>완료</Td>
                    <Td />
                    <Td>여러 단계에서 정보 확인 및 변경이 끝났을 때 사용</Td>
                  </tr>
                  <tr>
                    <Td>Copy</Td>
                    <Td>복사</Td>
                    <Td />
                    <Td />
                  </tr>
                  <tr>
                    <Td>Download</Td>
                    <Td>다운로드</Td>
                    <Td>올리기</Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>Upload</Td>
                    <Td>업로드</Td>
                    <Td>내보내기</Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>{'Reset to default, Reset {리소스}'}</Td>
                    <Td>초기화</Td>
                    <Td>기본값으로 재설정</Td>
                    <Td>기본값으로 되돌리는 행위</Td>
                  </tr>
                  <tr>
                    <Td>View details</Td>
                    <Td>상세 보기</Td>
                    <Td />
                    <Td>아코디언, 드로어를 통해 추가적인 정보 확인 가능할 때</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </VStack>

            {/* 4-3 인풋 필드 */}
            <VStack gap={3}>
              <SubSectionTitle>4-3. 인풋 필드</SubSectionTitle>
              <Prose>
                <p>인풋 필드의 작성 규칙은 별도 문서를 참고하세요.</p>
              </Prose>
            </VStack>

            {/* 4-4 모달 */}
            <VStack gap={3}>
              <SubSectionTitle>4-4. 모달</SubSectionTitle>
              <Prose>
                <p>모달의 작성 규칙은 별도 문서를 참고하세요.</p>
              </Prose>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Button',
          path: '/design/components/button',
          description: '버튼 컴포넌트 및 라벨 규칙',
        },
        {
          label: 'Input',
          path: '/design/components/input',
          description: '인풋 필드 컴포넌트',
        },
        {
          label: 'Modal',
          path: '/design/components/modal',
          description: '모달 컴포넌트',
        },
        {
          label: 'Typography',
          path: '/design/foundation/typography',
          description: '타이포그래피 기준',
        },
      ]}
      notionPageId="ux-writing"
    />
  );
}
