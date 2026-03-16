import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack, HStack } from '@/design-system';

export function CsvDownloadPage() {
  return (
    <ComponentPageTemplate
      title="List Download (CSV Export)"
      description="리스트 화면에 표시된 데이터를 CSV 파일로 내보내는 기능 패턴이다. 사용자는 현재 화면의 검색 및 필터 조건이 적용된 데이터를 다운로드하여 외부 분석, 공유, 백업 등에 활용할 수 있다."
      whenToUse={[
        '검색 / 필터 기능이 있는 리스트 화면',
        '테이블 데이터 분석 및 추출이 필요한 경우',
      ]}
      whenNotToUse={[
        '테이블의 데이터를 관리하는 화면이 아닌 경우',
        '테이블 있는 드로어 화면',
        '테이블이 있는 리소스 생성 화면',
      ]}
      guidelines={
        <VStack gap={10}>
          {/* Overview */}
          <VStack gap={3}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Overview</h3>
            <VStack gap={3}>
              <p className="text-body-md text-[var(--color-text-muted)]">
                List Download는 리스트 화면에 표시된 데이터를{' '}
                <strong>CSV 파일로 내보내는 기능 패턴</strong>이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자는 현재 화면의 <strong>검색 및 필터 조건이 적용된 데이터</strong>를
                다운로드하여 외부 분석, 공유, 백업 등에 활용할 수 있다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                이 패턴은 다음 상황에서 사용된다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>리소스 목록 데이터를 외부 분석 도구에서 사용해야 하는 경우</li>
                <li>필터링된 데이터 결과를 공유해야 하는 경우</li>
                <li>시스템 데이터 백업이 필요한 경우</li>
              </ul>
            </VStack>
          </VStack>

          {/* Composition */}
          <VStack gap={4}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Composition</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                      컴포넌트
                    </th>
                    <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                      역할
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-muted)]">
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Table
                    </td>
                    <td className="py-2.5">다운로드 대상 데이터 표시</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Search
                    </td>
                    <td className="py-2.5">다운로드 데이터 범위 결정</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Button
                    </td>
                    <td className="py-2.5">CSV 다운로드 실행</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Toast
                    </td>
                    <td className="py-2.5">다운로드 실패 안내</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Modal
                    </td>
                    <td className="py-2.5">필터 다운로드 확인</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Behavior */}
          <VStack gap={6}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Behavior</h3>

            {/* 1) 다운로드 흐름 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) 다운로드 흐름</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                다운로드는 다음 흐름으로 동작한다.
              </p>
              <pre className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-text-muted)] overflow-x-auto whitespace-pre">
                {`(사용자) (선택) Filter 적용
↓
(사용자) Download 버튼 클릭
↓
(시스템) (적용된 Filter가 있을 경우) 확인 모달 노출
↓
(사용자) (모달이 노출된 경우) Download 버튼 클릭
↓
(시스템) 현재 검색/필터 조건 확인
↓
(시스템) 데이터 조회
↓
(시스템) CSV 파일 생성
↓
(시스템) 파일 다운로드 시작`}
              </pre>
            </VStack>

            {/* 2) 빈 데이터 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">2) 빈 데이터</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                검색 또는 필터 결과가 없는 경우에도 CSV 파일은 생성된다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>파일구조: 컬럼 헤더만 포함. 데이터 행 없음.</li>
              </ul>
            </VStack>

            {/* 3) 대용량 데이터 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3) 대용량 데이터</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                데이터가 일정 기준을 초과하면 <strong>대용량 다운로드 방식</strong>을 사용한다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  기준: <strong>10,000 row 초과</strong>
                </li>
                <li>처리방식</li>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CSV 파일을 ZIP으로 압축</li>
                  <li>ZIP 파일 다운로드</li>
                  <li>
                    파일명 규칙:{' '}
                    <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                      {'{resource_name}_{YYYYMMDD}_{HHMM}.zip'}
                    </span>
                  </li>
                </ul>
              </ul>
            </VStack>

            {/* 4) 다운로드 실패 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">4) 다운로드 실패</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                다운로드 실패 시 사용자에게 토스트 메시지를 표시한다.
              </p>
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">토스트 메시지</span>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                      {'Failed to download the {resource_name} list.'}
                    </span>
                  </li>
                  <li>
                    <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                      {'{resource_name} 목록 다운로드를 실패했습니다.'}
                    </span>
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">실패 상황</span>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>네트워크 오류</li>
                  <li>서버 오류</li>
                  <li>데이터 조회 실패</li>
                </ul>
              </VStack>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>

            {/* 1) 다운로드 데이터 범위 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                1) 다운로드 데이터 범위
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  테이블 속성에서 설정된 보이는 컬럼, 숨겨진 컬럼에 상관없이 리소스의 전체 컬럼
                  데이터가 포함된다.
                </li>
                <li>
                  다운로드 데이터는 <strong>현재 리스트 조건을 기준으로 한다.</strong>
                </li>
              </ul>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                        다운로드 데이터
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2.5 pr-4">검색 없음</td>
                      <td className="py-2.5">전체 데이터</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">검색 있음</td>
                      <td className="py-2.5">검색 결과</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            {/* 2) 다운로드 파일 정책 */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2) 다운로드 파일 정책
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>포맷: CSV, ZIP(대용량 파일일 때)</li>
                <li>
                  파일명 규칙:{' '}
                  <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    {'{resource_name}_{YYYYMMDD}_{HHMM}.csv / .zip'}
                  </span>
                </li>
              </ul>
            </VStack>
          </VStack>

          {/* Content Guidelines */}
          <VStack gap={6}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Content Guidelines</h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              다운로드 관련 UI 텍스트는 다음 규칙을 따른다.
            </p>

            {/* 1) Button */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) Button</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Only icon 버튼</li>
                <li>
                  호버 시 툴팁:{' '}
                  <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    "Download CSV"
                  </span>
                </li>
              </ul>
            </VStack>

            {/* 2) Modal */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">2) Modal</h4>
              <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
                <VStack gap={2}>
                  <HStack gap={2} align="center">
                    <span className="text-label-sm text-[var(--color-text-subtle)] w-[60px]">
                      Title:
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)]">
                      Download CSV
                    </span>
                  </HStack>
                  <HStack gap={2} align="start">
                    <span className="text-label-sm text-[var(--color-text-subtle)] w-[60px] shrink-0">
                      Body:
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)]">
                      This action downloads only the data that matches the current search and filter
                      conditions.
                    </span>
                  </HStack>
                  <HStack gap={2} align="center">
                    <span className="text-label-sm text-[var(--color-text-subtle)] w-[60px]">
                      Button:
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)]">
                      Cancel / Download
                    </span>
                  </HStack>
                </VStack>
              </div>
            </VStack>

            {/* 3) Toast message */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3) Toast message</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                다운로드 실패 시 토스트 메시지
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    EN
                  </span>{' '}
                  {'Failed to download the {resource_name} list.'}
                </li>
                <li>
                  <span className="font-mono text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    KO
                  </span>{' '}
                  {'{resource_name} 목록 다운로드를 실패했습니다.'}
                </li>
              </ul>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Table', path: '/design/components/table' },
        { label: 'Search Input', path: '/design/components/filter-search-input' },
        { label: 'Button', path: '/design/components/button' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Common Patterns', path: '/design/patterns/common' },
      ]}
    />
  );
}
