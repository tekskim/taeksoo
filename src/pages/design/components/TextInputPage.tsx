import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack, HStack, Input, FormField } from '@/design-system';
import { IconSearch, IconMail } from '@tabler/icons-react';

export function TextInputPage() {
  return (
    <ComponentPageTemplate
      title="Text Input"
      description="사용자가 문자열 값을 입력할 수 있도록 하는 기본 입력 컴포넌트이다. 주로 리소스 이름, 식별자(ID), 설명, 포트 번호 등 텍스트 기반 데이터를 입력할 때 사용한다."
      whenToUse={[
        '사용자가 자유 텍스트 값을 입력해야 하는 경우 사용한다.',
        'Instance name',
        'Project ID',
        'Port',
        'Description',
        'Tag value',
      ]}
      whenNotToUse={[
        '정해진 값 선택 (→ Select)',
        '숫자 증가/감소 입력 (→ Number Input)',
        '날짜 입력 (→ Date picker)',
        '검색 입력 (→ Search)',
      ]}
      preview={
        <ComponentPreview code={`<Input placeholder="Enter instance name" fullWidth />`}>
          <Input placeholder="Enter instance name" width="md" />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Placeholder</span>
                <Input placeholder="Enter name" className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Value</span>
                <Input defaultValue="my-instance" className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Focus</span>
                <Input
                  defaultValue="Focused"
                  className="w-full border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Read-only</span>
                <Input defaultValue="Read only" readOnly className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Disabled</span>
                <Input defaultValue="Disabled" disabled className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Error</span>
                <Input defaultValue="Error" error="Required field" className="w-full" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Variants</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Default (text)
                </span>
                <Input placeholder="Enter instance name" width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Password</span>
                <Input type="password" defaultValue="secretpass" width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Email</span>
                <Input type="email" placeholder="user@example.com" width="md" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Sizes</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">SM (28px)</span>
                <Input size="sm" placeholder="Small" width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">MD (32px)</span>
                <Input size="md" placeholder="Medium" width="md" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Width</Label>
            <div className="flex flex-col gap-3 w-full">
              <VStack gap={1} className="items-start">
                <span className="text-label-sm text-[var(--color-text-subtle)]">XS (80px)</span>
                <Input placeholder="XS" width="xs" />
              </VStack>
              <VStack gap={1} className="items-start">
                <span className="text-label-sm text-[var(--color-text-subtle)]">SM (160px)</span>
                <Input placeholder="SM" width="sm" />
              </VStack>
              <VStack gap={1} className="items-start">
                <span className="text-label-sm text-[var(--color-text-subtle)]">MD (240px)</span>
                <Input placeholder="MD" width="md" />
              </VStack>
              <VStack gap={1} className="items-start">
                <span className="text-label-sm text-[var(--color-text-subtle)]">LG (360px)</span>
                <Input placeholder="LG" width="lg" />
              </VStack>
              <VStack gap={1} className="w-full">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Half (50%)</span>
                <Input placeholder="Half" width="half" />
              </VStack>
              <VStack gap={1} className="w-full">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Full (100%)</span>
                <Input placeholder="Full" width="full" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Icons</Label>
            <div className="flex gap-4">
              <Input placeholder="Search..." leftElement={<IconSearch size={14} />} width="md" />
              <Input
                placeholder="Email"
                rightElement={<IconMail size={14} stroke={1.5} />}
                width="md"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With FormField</Label>
            <div className="flex gap-6 items-start">
              <FormField label="Instance Name" helperText="2-64 characters" required>
                <Input placeholder="e.g., web-server-01" fullWidth />
              </FormField>
              <FormField
                label="Password"
                error
                errorMessage="Password must be at least 8 characters."
                required
              >
                <Input type="password" placeholder="Enter password" fullWidth />
              </FormField>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Suffix (Outside)</Label>
            <div className="flex gap-4 items-end">
              <HStack gap={2} align="center">
                <Input placeholder="0" width="sm" />
                <span className="text-body-md text-[var(--color-text-default)]">Seconds</span>
              </HStack>
              <HStack gap={2} align="center">
                <Input placeholder="100" width="sm" />
                <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
              </HStack>
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
                사용자가 문자열 값을 입력할 수 있도록 하는 기본 입력 컴포넌트이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                주로 리소스 이름, 식별자(ID), 설명, 포트 번호 등 텍스트 기반 데이터를 입력할 때
                사용한다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Text Input은 항상{' '}
                <strong className="text-[var(--color-text-default)]">
                  Form Field 패턴(Label, Description, Constraint text, Validation message)
                </strong>{' '}
                안에서 사용되며, 입력 규칙과 오류 상태는 Form Field 정책을 따른다.
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
                    <td className="p-2 border border-[var(--color-border-default)]">Input field</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      텍스트 입력 영역
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
                      일반 입력
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      Name, ID
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[var(--color-border-default)]">Password</td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      입력값 마스킹
                    </td>
                    <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                      Password
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
            {/* 8 behavior subsections */}
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) Input type</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        Type
                      </th>
                      <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">text</td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        기본 문자열 입력
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">password</td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        입력값 마스킹
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[var(--color-border-default)]">email</td>
                      <td className="p-2 border border-[var(--color-border-default)] text-[var(--color-text-muted)]">
                        이메일 형식 입력
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                3) Allowed characters
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>허용 문자 규칙이 존재하는 경우 Constraint text로 안내한다.</li>
                <li>허용되지 않는 문자는 Validation 표시</li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">4) Placeholder</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>입력 예시를 제공할 때 사용한다.</li>
                <li>Placeholder는 Label을 대체할 수 없다.</li>
                <li>
                  다음 조건 중 하나라도 해당하면 사용한다.
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>입력 형식이 모호한 경우</li>
                    <li>예시 값이 도움이 되는 경우</li>
                    <li>특정 패턴이 필요한 경우</li>
                  </ul>
                </li>
              </ul>
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                6) Copyable value
              </h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>복사가 필요한 필드에 대해서는 Copy 아이콘 버튼 제공</li>
                <li>Read-only 상태에서도 복사 가능</li>
              </ul>
            </VStack>
            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">7) Disabled</h4>
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">8) Read-only</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Read-only 상태에서는 값을 수정할 수 없지만 확인은 가능하다.
              </p>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                'Constraint text로 입력 규칙을 미리 안내한다.',
                'Validation 메시지를 명확하게 작성한다.',
                'Text Input은 Form Field 구조 안에서 사용한다.',
              ]}
              dontItems={[
                'Placeholder를 Label 대신 사용하지 않는다.',
                'Validation 메시지를 토스트로 표시하지 않는다.',
                'Constraint text와 Validation 메시지를 동시에 표시하지 않는다.',
              ]}
            />
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Form Field', path: '/design/patterns/form-field-pattern' },
        { label: 'Number Input', path: '/design/components/number-input' },
        { label: 'Textarea', path: '/design/components/textarea' },
        { label: 'Select', path: '/design/components/select' },
      ]}
    />
  );
}
