import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { VStack, FormField, Input } from '@/design-system';

export function FormFieldPatternPage() {
  return (
    <ComponentPageTemplate
      title="Form Field"
      description="사용자 입력을 구성하는 기본 UI 패턴이다. Label, Description, Input control, Constraint text, Validation message를 하나의 구조로 묶어 입력 항목의 의미와 상태를 명확하게 전달한다."
      whenToUse={[
        '사용자가 값을 입력하거나 설정해야 하는 모든 UI에서 사용한다.',
        '리소스 생성',
        '설정 변경',
        '정책 작성',
      ]}
      whenNotToUse={[
        '툴바 또는 리스트 상단에 검색 입력은 독립적인 Search Input 컴포넌트로 사용한다.',
      ]}
      guidelines={
        <VStack gap={10} align="stretch">
          {/* Composition */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Composition</h3>
            <pre className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-text-muted)] overflow-x-auto whitespace-pre">
              {`<구조>
Label
Description
Input control
Constraint text / Validation message`}
            </pre>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      요소
                    </th>
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">① Label</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 항목 이름. 필수 입력값일 때 라벨 옆에 (*)표시
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">② Description</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 항목의 목적이나 맥락 설명
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">③ Input Control</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">실제 입력 컴포넌트</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">
                      ④ Constraint text
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 형식 또는 규칙 설명
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">
                      ⑤ Validation Message
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">입력 오류 메시지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Variants */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Variants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      Variant
                    </th>
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      구성
                    </th>
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      사용 예시
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Full form</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      Label, Description, Input control, Constraint text
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 규칙이 존재하는 경우, 설명이 필요한 경우, 정책이나 리소스 설정
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Standard form</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      Label, Input control, Constraint text
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 규칙은 있지만 추가 설명이 필요 없는 경우
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Minimal form</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      Label, Input control
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      입력 규칙이 없는 경우, 단순 값 입력
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* States */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">States</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      State
                    </th>
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Default</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">기본 상태</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Focus</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">입력 중</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Error</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">입력 오류</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Disabled</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">입력 불가</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Read-only</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      읽기 전용, 복사 가능, 수정 불가
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
                1) Validation timing
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        Timing
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">on blur</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">입력 종료 시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">on submit</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">제출 시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2) Constraint and Validation
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Constraint Text와 Validation Message는 동일한 위치에서 상태에 따라 교체되어
                표시된다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <VStack
                  gap={2}
                  align="stretch"
                  className="p-4 border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]"
                >
                  <span className="text-body-sm text-[var(--color-text-subtle)]">기본 상태:</span>
                  <FormField
                    label="Instance name"
                    helperText="3–63 characters Lowercase letters and numbers only"
                  >
                    <Input placeholder="Enter instance name" fullWidth />
                  </FormField>
                </VStack>
                <VStack
                  gap={2}
                  align="stretch"
                  className="p-4 border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]"
                >
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    입력 오류 발생:
                  </span>
                  <FormField
                    label="Instance name"
                    error
                    errorMessage="Instance name must start with a letter."
                  >
                    <Input placeholder="Enter instance name" fullWidth error />
                  </FormField>
                </VStack>
              </div>
              <VStack gap={2} align="stretch">
                <p className="text-body-md text-[var(--color-text-muted)]">Rules:</p>
                <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>기본 상태에서는 Constraint text를 표시한다.</li>
                  <li>
                    입력 값이 제약 조건을 위반하면 Constraint text 대신 Validation 메시지를
                    표시한다.
                  </li>
                  <li>Validation 메시지는 한 번에 하나만 표시한다.</li>
                  <li>오류가 해결되면 Constraint text로 다시 전환된다.</li>
                </ol>
              </VStack>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                'Constraint text로 입력 규칙을 미리 안내한다.',
                'Validation 메시지는 명확하게 작성한다.',
                'Form Field 구조를 일관되게 사용한다.',
              ]}
              dontItems={[
                'Placeholder를 Label 대신 사용하지 않는다.',
                'Validation 메시지를 토스트나 모달로 표시하지 않는다.',
                'Constraint text와 Validation 메시지를 동시에 표시하지 않는다.',
              ]}
            />
          </VStack>

          {/* Content Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Content Guidelines</h3>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) Label</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                입력해야 하는 값을 명확하게 설명한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Examples: Instance name, Port
              </p>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">2) Description</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자가 낯선 입력 항목도 이해할 수 있도록 항목의 목적, 역할을 설명한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                입력값을 유도하지 않는다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Example: &quot;Defines the maximum time allowed for a login request to
                complete.&quot;
              </p>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                3) Constraint text
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                입력 형식 또는 제한 조건을 설명한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">전역 디폴트 제약:</p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  범용: KO &quot;영문 소문자, 숫자, 하이픈(-)만 사용하여 2~63자 사이로 입력해
                  주세요.&quot; EN &quot;Enter 2 to 63 characters using only lowercase letters,
                  numbers, and hyphens.&quot;
                </li>
                <li>
                  디스크립션: KO &quot;영문, 숫자 및 특수문자(+=,.@-_)를 사용해 224자 이내로 입력해
                  주세요.&quot; EN &quot;Enter up to 224 characters using letters, numbers, and
                  special characters (+=,.@-_).&quot;
                </li>
              </ul>

              <p className="text-body-md text-[var(--color-text-muted)]">표준 제약:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        길이 제한
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">최대 제한</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        최대 [max]자까지 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Maximum [max] characters.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">최소 제한</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        최소 [min]자 이상 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Must be at least [min] characters.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">범위 제한</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        [min]~[max]자 사이로 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Must be between [min]-[max] characters.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        허용 문자 제한
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">숫자만</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        숫자만 사용 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Only numbers are allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        영문(대소문자)만
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문만 사용 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Only letters are allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">영문(소문자)만</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문 소문자만 사용 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Only lowercase letters are allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        숫자+영문+특수문자
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문, 숫자, 특수문자(+=,.@-_)만 사용 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Letters, numbers, and special characters (+=,.@-_) are allowed.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        복합 제한
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">길이+허용 문자</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문 및 숫자를 사용하여 [min]~[max]자 사이로 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Enter [min] to [max] characters using letters and numbers.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        길이+공백불가+허용 문자
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        공백 없이 영문 및 숫자를 사용하여 [min]~[max]자 사이로 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Enter [min] to [max] characters using letters and numbers without spaces.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        길이+특정 패턴+허용 문자 1
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문 소문자로 시작해야 하며, 영문 소문자, 숫자, 특수문자(-, _)를 사용하여
                        [min]~[max]자 사이로 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Must start with a lowercase letter. Use lowercase letters, numbers, and
                        symbols (-, _) between [min] and [max] characters.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <VStack gap={2} align="stretch" className="pt-2">
                <p className="text-body-md font-medium text-[var(--color-text-default)]">4. 예외</p>
                <p className="text-body-md font-medium text-[var(--color-text-muted)]">
                  복합 제한이 4개가 초과될 경우(길이+특정 패턴+허용 문자+최소 입력) → 인라인 텍스트
                  대신 툴팁으로 제한 조건 노출
                </p>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>사용자가 제약 조건을 놓치지 않도록 조건 만족 시 확인할 수 있는 표시 필요</li>
                  <li>주로 비밀번호 입력 필드</li>
                </ul>
              </VStack>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                4) Validation message
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                유효성 검사 오류가 있을 때 메세지로 오류 이유 고지
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                전역 디폴트 유효성 실패 메세지:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        필수 입력 및 형식 관련
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        미입력 (Required)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        필수 입력 항목입니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        This field is required.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        형식 오류 (Invalid)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        올바른 형식이 아닙니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Enter a valid format.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        중복 발생 (Duplicate)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        {'이미 사용 중인 {value}입니다.'}
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        {'This {value} is already in use.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        글자 수 제한 관련
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">최소 길이 미달</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        최소 [min]자 이상 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Enter at least [min] characters.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">최대 길이 초과</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        최대 [max]자까지만 입력 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Maximum [max] characters allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">범위 미준수</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        [min]~[max]자 사이로 입력해 주세요.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Enter between [min] and [max] characters.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        문자 규칙 위반 관련
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        KO
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        EN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">불허 문자 포함</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        허용되지 않는 문자가 포함되어 있습니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Includes invalid characters.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">대문자 입력 시</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문 소문자만 사용 가능합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Only lowercase letters are allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">공백 포함 시</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        공백은 포함할 수 없습니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Spaces are not allowed.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        시작/끝 문자 오류
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        영문 소문자나 숫자로 시작해야 합니다.
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Must start with a letter or number.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <VStack gap={2} align="stretch" className="pt-2">
                <p className="text-body-md text-[var(--color-text-muted)]">정책:</p>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>Validation timing: on blur + on submit</li>
                  <li>최대 길이: 입력이 차단 + Validation message 노출</li>
                  <li>여러 정책 위반: 가장 먼저 실패한 조건 하나만 표시</li>
                </ul>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Text Input', path: '/design/components/input' },
        { label: 'Number Input', path: '/design/components/number-input' },
        { label: 'Textarea', path: '/design/components/textarea' },
        { label: 'Select', path: '/design/components/select' },
      ]}
      notionPageId="2a89eddc34e680ceb289dda7bade01b8"
    />
  );
}
