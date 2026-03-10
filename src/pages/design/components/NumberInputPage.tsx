import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack, HStack, NumberInput, FormField } from '@/design-system';

export function NumberInputPage() {
  return (
    <ComponentPageTemplate
      title="Number Input"
      description="사용자가 숫자 값을 입력하거나 증가·감소시킬 수 있도록 하는 입력 컴포넌트이다. 사용자는 직접 숫자를 입력하거나 Stepper 버튼을 통해 값을 증가(+), 감소(-)시킬 수 있다."
      whenToUse={[
        '사용자가 숫자 값을 입력해야 하는 경우 사용한다.',
        'Node count',
        'Replica count',
        'Port number',
        'Timeout value',
        'Retention days',
      ]}
      whenNotToUse={[
        '가격, 금액 등 자유 숫자 입력이 필요할 때 (→ Text input)',
        '범위 선택 필요 (→ Slider)',
        '정해진 값 선택 (→ Select)',
      ]}
      preview={
        <ComponentPreview code={`<NumberInput defaultValue={1} min={0} max={100} width="sm" />`}>
          <NumberInput defaultValue={1} min={0} max={100} width="sm" />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Default</span>
                <NumberInput defaultValue={1} width="sm" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">With Min/Max</span>
                <NumberInput defaultValue={5} min={0} max={10} width="sm" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Disabled</span>
                <NumberInput defaultValue={1} disabled width="sm" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Widths</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">XS (80px)</span>
                <NumberInput defaultValue={1} width="xs" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">SM (160px)</span>
                <NumberInput defaultValue={1} width="sm" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With FormField + Suffix</Label>
            <FormField
              label="Minimum Ready"
              description="The minimum time a pod must remain in a ready state."
            >
              <HStack gap={2} align="center">
                <NumberInput defaultValue={0} min={0} width="sm" />
                <span className="text-body-md text-[var(--color-text-default)]">Seconds</span>
              </HStack>
            </FormField>
          </VStack>

          <VStack gap={3}>
            <Label>With FormField (Replicas)</Label>
            <FormField label="Replica count" helperText="1-10 replicas" required>
              <NumberInput defaultValue={3} min={1} max={10} width="xs" />
            </FormField>
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
                  숫자 값을 입력하거나 증가·감소시킬 수 있도록 하는 입력 컴포넌트
                </strong>
                이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자는 직접 숫자를 입력하거나 Stepper 버튼을 통해 값을 증가(+), 감소(-)시킬 수
                있다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Number Input은 주로{' '}
                <strong className="text-[var(--color-text-default)]">
                  수량, 포트 번호, 리소스 개수, 설정 값
                </strong>
                과 같이 정수 기반 값을 입력할 때 사용한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Number Input은 항상{' '}
                <strong className="text-[var(--color-text-default)]">
                  Form Field 패턴(Label, Description, Constraint text, Validation message)
                </strong>{' '}
                안에서 사용한다.
              </p>
            </VStack>
          </VStack>

          {/* Composition */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Composition</h3>
            <pre className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-text-muted)] overflow-x-auto whitespace-pre">
              {`[input field ↑ ↓] 또는 [ - ] [ input field ] [ + ]`}
            </pre>
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
                    <td className="p-2 border border-[var(--color-border-default)]">Input field</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      숫자 입력 영역
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">
                      Stepper controls
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      값 증가 / 감소 버튼
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) Input method</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        Method
                      </th>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">Typing</td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        숫자를 직접 입력
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">Stepper</td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        버튼으로 값 증가 / 감소
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">2) Min/Max value</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>정책으로 최소값, 최대값 조건이 결정된다.</li>
                <li>
                  범위를 벗어날 경우 자동으로 값이 보정된다.
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>최대값을 초과할 경우 최대값으로 보정</li>
                    <li>최소값 미만으로 감소할 경우 최소값으로 보정</li>
                  </ul>
                </li>
                <li>범위를 벗어날 경우 Validation message가 노출된다.</li>
              </ul>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                3) Input validation
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>숫자 외 입력은 입력을 차단한다.</li>
              </ul>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                4) Constraint text
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                숫자 범위는 Constraint text로 안내한다.
              </p>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                5) Validation behavior
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">6) Disabled</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Disabled 상태에서는 입력과 Stepper 버튼 모두 사용할 수 없다.
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">7) Read-only</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                값을 수정할 수 없지만 확인은 가능하다.
              </p>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                'Stepper 버튼으로 값 조정 가능하도록 한다.',
                'Constraint text로 범위를 안내한다.',
                '범위 초과 시 Validation 메시지를 표시한다.',
              ]}
              dontItems={[
                '숫자가 아닌 입력을 허용하지 않는다.',
                'Stepper로 범위를 초과하도록 허용하지 않는다.',
              ]}
            />
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Form Field', path: '/design/patterns/form-field-pattern' },
        { label: 'Text Input', path: '/design/components/text-input' },
        { label: 'Slider', path: '/design/components/slider' },
      ]}
      notionPageId="31b9eddc34e680af8833dd64f9a0ab0a"
    />
  );
}
