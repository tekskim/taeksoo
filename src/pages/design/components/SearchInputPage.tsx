import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { VStack, SearchInput } from '@/design-system';

export function SearchInputPage() {
  return (
    <ComponentPageTemplate
      title="Search Input"
      description="사용자가 리소스 목록 또는 데이터 집합을 빠르게 탐색하고 필터링할 수 있도록 하는 검색 입력 컴포넌트이다. Keyword Search와 Filter Search 두 가지 방식의 검색을 지원한다."
      whenToUse={[
        '리스트 또는 데이터 집합을 필터링해야 하는 경우 사용한다.',
        '리소스 목록 검색',
        '테이블 필터링',
        '설정 항목 검색',
      ]}
      whenNotToUse={['폼 입력 (→ Text input, Textarea)', '정해진 값 선택 (→ Select)']}
      preview={
        <ComponentPreview
          code={`<SearchInput placeholder="Search resources by attributes" size="sm" className="w-[320px]" />`}
        >
          <SearchInput
            placeholder="Search resources by attributes"
            size="sm"
            className="w-[320px]"
          />
        </ComponentPreview>
      }
      guidelines={
        <VStack gap={10} align="stretch">
          {/* Overview */}
          <VStack gap={4} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Overview</h3>
            <VStack gap={2} align="stretch">
              <p className="text-body-md text-[var(--color-text-muted)]">
                Search Input은 사용자가{' '}
                <strong className="text-[var(--color-text-default)]">
                  리소스 목록 또는 데이터 집합을 빠르게 탐색하고 필터링할 수 있도록 하는 검색 입력
                  컴포넌트
                </strong>
                이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Search Input은 두 가지 방식의 검색을 지원한다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong className="text-[var(--color-text-default)]">Keyword Search</strong>: 일반
                  텍스트 기반 검색
                </li>
                <li>
                  <strong className="text-[var(--color-text-default)]">Filter Search</strong>: 필터
                  키 기반 구조화된 검색
                </li>
              </ul>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자는 검색어를 직접 입력하여 데이터를 검색하거나, 필터 키(Filter key)를 선택한 후
                필터 값을 입력 또는 선택하여 필터 조건을 생성할 수 있다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                완성된 필터는 검색 필드 아래에{' '}
                <strong className="text-[var(--color-text-default)]">Chip 형태로 표시</strong>되며
                개별 필터를 제거하거나 전체 필터를 초기화할 수 있다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Search Input은 주로{' '}
                <strong className="text-[var(--color-text-default)]">
                  리소스 리스트, 테이블 데이터, 로그 조회 등 데이터 탐색 UI
                </strong>
                에서 사용된다.
              </p>
            </VStack>
          </VStack>

          {/* Composition */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Composition</h3>
            <pre className="text-body-sm text-[var(--color-text-muted)] font-mono p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] overflow-x-auto">
              {`[ Search / Filter field ]

Status: Running   Region: Seoul   Owner: admin   ✕`}
            </pre>
            <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)]">
                      요소
                    </th>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Search field
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      필터 조건 입력 영역
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Filter key dropdown
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      필터 키 선택 메뉴
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Filter value input
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      필터 값 입력 또는 선택
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Filter chips
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      적용된 필터 목록
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Clear action
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      전체 필터 초기화
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Variants */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Variants</h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              기본적으로 필터가 없으면 Keyword search로 사용된다.
            </p>
            <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                      Variant
                    </th>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                      컴포넌트
                    </th>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                      설명
                    </th>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                      사용 시점
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Keyword search
                    </td>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      <span className="font-mono text-body-sm">SearchInput</span>
                    </td>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      텍스트 기반 검색. 입력된 키워드로 전체 데이터를 필터링한다.
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      단순 이름/키워드 검색만 필요한 경우
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Filter search
                    </td>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      <span className="font-mono text-body-sm">FilterSearchInput</span>
                    </td>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      필터 키 기반 구조화된 검색. 필터 키를 선택한 후 값을 입력 또는 선택하여 조건을
                      생성한다.
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      여러 속성(Status, Type 등)으로 복합 필터링이 필요한 경우
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* States */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">States</h3>
            <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                      State
                    </th>
                    <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Default
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      기본 상태
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Focus
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      입력 중
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                      Active
                    </td>
                    <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      필터 키 입력 완료 + 필터 값 입력 중
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Behavior */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Behavior</h3>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                1) Filter creation flow
              </h4>
              <ol className="list-decimal pl-6 text-body-md text-[var(--color-text-muted)] space-y-2">
                <li>검색 필드 클릭 또는 입력 → 필터 키 드롭다운 노출</li>
                <li>필터 키 선택 → 검색 필드에 키 정보가 chip 형태로 노출</li>
                <li>필터값 입력 또는 선택 → Filter chips 영역에 새로운 필터(chip) 생성</li>
              </ol>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2) Filter value input types
              </h4>
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                        타입
                      </th>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                        입력 방식
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        text
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Text input
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        enum
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Select
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        boolean
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Select
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        number
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Text input
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        tag
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Select
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3) Filter chip</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>필터는 Chip 형태로 표시한다.</li>
                <li>
                  Chip에는 <strong className="text-[var(--color-text-default)]">[키 + 값]</strong>이
                  표시된다.
                </li>
                <li>Chip에는 제거 버튼이 포함된다.</li>
                <li>Filter chip은 다음 시점에 생성된다.</li>
              </ul>
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                        동작
                      </th>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                        동작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        Enter
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        필터 생성
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        Value 선택
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        필터 생성
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">4) Chip removal</h4>
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                        동작
                      </th>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                        결과
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        Chip ✕ 버튼 클릭
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        해당 필터 제거
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        Clear 클릭
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        모든 필터 제거
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                5) Multiple filters
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                여러 필터를 동시에 사용할 수 있다.
              </p>
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r border-[var(--color-border-subtle)]">
                        조건
                      </th>
                      <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)]">
                        로직
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        같은 필터 키
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        OR
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-t border-r border-[var(--color-border-subtle)]">
                        다른 필터 키
                      </td>
                      <td className="px-3 py-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        AND
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">6) Placeholder</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Filter Search는 Label 대신 Placeholder를 사용한다.</li>
                <li>표준 문구: &quot;Search {'{resources}'} by attributes&quot;</li>
              </ul>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                '필터 키 기반 검색을 제공한다.',
                '생성된 필터를 Chip으로 표시한다.',
                'Clear action을 제공한다.',
              ]}
              dontItems={[
                '필터 조건을 텍스트로만 표시하지 않는다.',
                '여러 필터를 하나의 문자열로 표현하지 않는다.',
              ]}
            />
          </VStack>
        </VStack>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Keyword Search</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              일반 텍스트 기반 검색. 필터 키 없이 자유 텍스트로 검색.
            </span>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <SearchInput placeholder="Search resources" size="sm" className="w-[320px]" />
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'List Page', path: '/design/patterns/list-page' },
        { label: 'Chip', path: '/design/components/chip' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
