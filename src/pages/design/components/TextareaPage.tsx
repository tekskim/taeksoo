import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack, Textarea, FormField } from '@/design-system';

export function TextareaPage() {
  return (
    <ComponentPageTemplate
      title="Textarea"
      description="사용자가 여러 줄의 텍스트를 입력할 수 있도록 하는 입력 컴포넌트이다. 주로 설명, 메모, 정책 문서, 스크립트 등 길이가 길거나 여러 줄로 작성되는 텍스트 입력에 사용한다."
      whenToUse={[
        '사용자가 여러 줄의 자유 텍스트 값을 입력해야 하는 경우 사용한다.',
        'Description',
        'Notes',
        'Comments',
        'Policy text',
        'JSON configuration',
        'Script',
      ]}
      whenNotToUse={[
        '짧은 텍스트 입력 (→ Text Input)',
        '정해진 값 선택 (→ Select)',
        '숫자 증가/감소 입력 (→ Number Input)',
      ]}
      preview={
        <ComponentPreview
          code={`<Textarea placeholder="Enter description..." className="w-[320px]" />`}
        >
          <Textarea placeholder="Enter description..." className="w-[320px]" />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Placeholder</span>
                <Textarea placeholder="Enter description..." className="w-[240px]" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Value</span>
                <Textarea
                  defaultValue="This is a multi-line description with some content."
                  className="w-[240px]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Disabled</span>
                <Textarea defaultValue="Disabled textarea" disabled className="w-[240px]" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Code Variant</Label>
            <Textarea
              variant="code"
              placeholder="Enter user data script..."
              defaultValue={`#!/bin/bash\necho "Hello World"\napt-get update`}
              className="w-[400px]"
            />
          </VStack>

          <VStack gap={3}>
            <Label>With FormField</Label>
            <div className="flex gap-6 items-start">
              <FormField label="Description" helperText="Max 500 characters">
                <Textarea placeholder="Enter resource description..." className="w-[320px]" />
              </FormField>
              <FormField label="Notes" description="Additional notes for this resource">
                <Textarea placeholder="Enter notes..." className="w-[320px]" />
              </FormField>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={10} align="stretch">
          {/* Overview */}
          <VStack gap={4} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Overview</h3>
            <VStack gap={2} align="stretch">
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자가{' '}
                <strong className="text-[var(--color-text-default)]">
                  여러 줄의 텍스트를 입력할 수 있도록 하는 입력 컴포넌트
                </strong>
                이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                주로 설명, 메모, 정책 문서, 스크립트 등{' '}
                <strong className="text-[var(--color-text-default)]">
                  길이가 길거나 여러 줄로 작성되는 텍스트 입력
                </strong>
                에 사용한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Textarea는 항상{' '}
                <strong className="text-[var(--color-text-default)]">
                  Form Field 패턴(Label, Description, Constraint text, Validation message)
                </strong>{' '}
                안에서 사용하며, 입력 규칙과 Validation 동작은 Form Field 정책을 따른다.
              </p>
            </VStack>
          </VStack>

          {/* Composition */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Composition</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      요소
                    </th>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Textarea field
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      멀티라인 텍스트 입력 영역
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Resize handle
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력 영역 크기 조절 (optional)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Character counter
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력 문자 수 표시 (optional)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Variants */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Variants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      Variant
                    </th>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      설명
                    </th>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      사용 예
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Default</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      일반 텍스트 입력, 입력 길이에 따라 자동 확장 (Auto expand)
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      Description
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Fixed height
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      높이 고정
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      Policy description
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Manual resize
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      사용자가 높이를 조절
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      Notes
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
              <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      State
                    </th>
                    <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Default</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      기본 상태
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Hover</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      포인터가 입력 영역 위에 있음
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Focus</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력 중
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Error</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력 값이 제약 조건을 위반
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Disabled</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력 불가
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Read-only</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      읽기 전용, 수정 불가
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
                1) Multi-line input
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Textarea는 여러 줄 입력을 지원한다.</li>
                <li>Enter 키 입력 시 새로운 줄이 생성된다.</li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2) Character limit
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>문자 수 제한은 Constraint text로 안내한다.</li>
                <li>
                  최대 길이 초과 시{' '}
                  <strong className="text-[var(--color-text-default)]">입력이 차단되고</strong>,{' '}
                  <strong className="text-[var(--color-text-default)]">
                    Validation message가 표시된다.
                  </strong>
                </li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                3) Character counter
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  형식:{' '}
                  <code className="rounded bg-[var(--color-surface-muted)] px-1 py-0.5 text-body-sm">
                    {'{입력된 글자수} / {최대 글자수}'}
                  </code>
                </li>
                <li>문자 제한이 있을 때만 표시한다.</li>
                <li>입력 영역 하단에 표시한다.</li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                4) Validation behavior
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  Validation 동작은{' '}
                  <strong className="text-[var(--color-text-default)]">
                    Form Field 정책을 따른다.
                  </strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      Constraint text와 Validation message는{' '}
                      <strong className="text-[var(--color-text-default)]">
                        동일 위치에서 교체 표시
                      </strong>
                    </li>
                    <li>
                      Validation은{' '}
                      <strong className="text-[var(--color-text-default)]">
                        한 번에 하나만 표시
                      </strong>
                    </li>
                  </ul>
                </li>
                <li>Validation timing: on blur + on submit</li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">5) Disabled</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Disabled 상태에서는 입력이 불가능하다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  사용 예
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>선행 조건 달성 안됨</li>
                  </ul>
                </li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">6) Read-only</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Read-only 상태에서는 값을 수정할 수 없지만 확인은 가능하다.
              </p>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                7) Keyboard interaction
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        Key
                      </th>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">
                        <kbd className="inline-block px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] text-body-sm font-mono text-[var(--color-text-default)]">
                          Enter
                        </kbd>
                      </td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        새 줄 생성
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">
                        <kbd className="inline-block px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] text-body-sm font-mono text-[var(--color-text-default)]">
                          Shift + Enter
                        </kbd>
                      </td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        새 줄 생성
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                '긴 텍스트 입력에 Textarea를 사용한다.',
                'Constraint text로 문자 제한을 안내한다.',
                '필요 시 Character counter를 제공한다.',
              ]}
              dontItems={['짧은 입력에 Textarea를 사용하지 않는다.']}
            />
          </VStack>
        </VStack>
      }
      keyboardInteractions={[
        { key: 'Tab', description: '다음 포커스 가능 요소로 이동' },
        { key: 'Shift + Tab', description: '이전 포커스 가능 요소로 이동' },
      ]}
      relatedLinks={[
        { label: 'Form Field', path: '/design/patterns/form-field-pattern' },
        { label: 'Text Input', path: '/design/components/text-input' },
      ]}
      notionPageId="31b9eddc34e6800e927dcb07b94bbd12"
    />
  );
}
