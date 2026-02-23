import { Link } from 'react-router-dom';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, VStack } from '@/design-system';
import {
  IconPlus,
  IconArrowRight,
  IconHeart,
  IconStar,
  IconPlayerPlay,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';

export function ButtonPage() {
  return (
    <ComponentPageTemplate
      title="Button"
      description="Interactive button component with multiple variants, sizes, and states"
      relatedLinks={[
        {
          label: 'Input',
          path: '/design/components/input',
          description: 'Text fields and form inputs',
        },
        {
          label: 'Select',
          path: '/design/components/select',
          description: 'Dropdown select component',
        },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label and input combinations',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Variant 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                          Variant
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          용도
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Primary
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          페이지 내 가장 중요한 단일 액션. 화면당 1개 권장.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Create, Save, Deploy
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Secondary
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          보조 액션. Primary 버튼과 함께 사용하거나 독립 액션으로 사용.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Cancel, Edit, Console
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Muted
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          Toolbar 내 Bulk 액션 등 배경에 녹아드는 버튼.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Start, Stop, Delete (toolbar)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Ghost
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          배경 없이 텍스트만 보이는 최소한의 버튼.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          More, Settings (compact areas)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Outline
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          Secondary와 유사하지만 테두리 강조가 필요한 경우.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Filter, View options
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Danger
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          파괴적/되돌릴 수 없는 액션. 반드시 확인 모달과 함께 사용.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">Delete, Terminate</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Link
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          텍스트 링크처럼 보이지만 버튼 동작을 수행.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          View all, Learn more
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  위치별 Size 규칙
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          위치
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          Size
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          아이콘 크기
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          PageHeader 생성 버튼
                        </td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          md
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          Toolbar Primary / Bulk 액션
                        </td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          sm
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          DetailHeader 액션
                        </td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          sm
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          Modal / Drawer Footer
                        </td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          md
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 가이드라인 */}
        <VStack gap={3}>
          <Label>가이드라인</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>
                  페이지당 Primary 버튼은 1개만 사용합니다. Modal, Drawer, Side Panel은 독립
                  컨텍스트로 각각 Primary 1개 허용.
                </li>
                <li>버튼 라벨은 동사로 시작합니다 (Create, Delete, Save).</li>
                <li>파괴적 액션(Delete)은 반드시 ConfirmModal과 함께 사용합니다.</li>
                <li>
                  아이콘 전용 버튼에는 반드시 <code>aria-label</code>을 지정합니다.
                </li>
                <li>로딩 중에는 버튼을 disabled 처리하고 로딩 상태를 표시합니다.</li>
                <li>버튼 그룹은 Primary를 오른쪽, Secondary를 왼쪽에 배치합니다.</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">Don&apos;t</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>한 화면에 Primary 버튼을 2개 이상 배치하지 않습니다.</li>
                <li>버튼 라벨에 &quot;Click here&quot; 같은 모호한 표현을 사용하지 않습니다.</li>
                <li>Danger 버튼을 확인 과정 없이 직접 실행하지 않습니다.</li>
                <li>disabled 상태의 이유를 사용자에게 알리지 않고 비활성화하지 않습니다.</li>
                <li>텍스트가 긴 라벨로 인해 버튼 너비가 과도하게 넓어지지 않도록 합니다.</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* Token Table */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    SM
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    MD
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">LG</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'height', sm: '28px', md: '32px', lg: '36px' },
                  { name: 'min-width', sm: '60px', md: '80px', lg: '80px' },
                  { name: 'padding-x', sm: '10px', md: '12px', lg: '16px' },
                  { name: 'padding-y', sm: '6px', md: '8px', lg: '10px' },
                  { name: 'gap', sm: '6px', md: '6px', lg: '8px' },
                  { name: 'font-size', sm: '11px', md: '11px', lg: '12px' },
                  { name: 'icon-size', sm: '12px', md: '12px', lg: '12px' },
                ].map(({ name, sm, md, lg }) => (
                  <tr key={name} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                      --button-{name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{sm}</td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{md}</td>
                    <td className="py-2 font-mono text-[var(--color-text-muted)]">{lg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
            <code>radius: 6px (md)</code> · <code>border: slate-300 (secondary)</code> ·{' '}
            <code>disabled-bg: slate-200 (primary)</code>
          </div>
        </VStack>

        {/* Sizes */}
        <VStack gap={3}>
          <Label>Sizes</Label>
          <div className="flex gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </VStack>

        {/* Size Guidelines */}
        <VStack gap={3}>
          <Label>Size guidelines</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Height
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    권장 사용처
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">SM</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">28px</td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    테이블 툴바, 밀집된 UI, 반복 가능한 보조 액션
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">MD</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">32px</td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    일반 폼, 모달/드로어 액션, 독립적인 CTA
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">LG</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">36px</td>
                  <td className="py-2 text-[var(--color-text-muted)]">
                    페이지 주요 CTA, 랜딩 페이지, 히어로 섹션
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1 space-y-1">
            <div>
              <strong>판단 기준:</strong> 밀집된 UI? → SM | 독립적인 CTA? → MD/LG | 반복 가능한
              액션? → SM | 폼의 최종 제출? → MD/LG
            </div>
            <div>
              <strong>수직 정렬:</strong> 같은 행에 있는 요소는 같은 사이즈 사용 (Input md + Button
              md ✓)
            </div>
            <div>
              <strong>min-width:</strong> 버튼은 최소 너비가 설정되어 있어 짧은 텍스트도 균일한 크기
              유지 (SM: 60px, MD/LG: 80px)
            </div>
          </div>
        </VStack>

        {/* Variants */}
        <VStack gap={3}>
          <Label>Variants</Label>
          <div className="grid grid-cols-7 gap-3">
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Primary
              </span>
              <Button size="sm" variant="primary">
                Default
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="bg-[var(--color-action-primary-hover)]"
              >
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Secondary
              </span>
              <Button size="sm" variant="secondary">
                Default
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-[var(--button-secondary-hover-bg)]"
              >
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Outline
              </span>
              <Button size="sm" variant="outline">
                Default
              </Button>
              <Button size="sm" variant="outline" className="bg-[var(--button-secondary-hover-bg)]">
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Ghost
              </span>
              <Button size="sm" variant="ghost">
                Default
              </Button>
              <Button size="sm" variant="ghost" className="bg-[var(--button-ghost-hover-bg)]">
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Muted
              </span>
              <Button size="sm" variant="muted">
                Default
              </Button>
              <Button
                size="sm"
                variant="muted"
                className="bg-[var(--color-surface-subtle)] text-[var(--color-text-default)] border-[var(--color-border-strong)]"
              >
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Danger
              </span>
              <Button size="sm" variant="danger">
                Default
              </Button>
              <Button size="sm" variant="danger" className="bg-[var(--color-state-danger-hover)]">
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Warning
              </span>
              <Button size="sm" variant="warning">
                Default
              </Button>
              <Button size="sm" variant="warning" className="bg-[var(--color-orange-700)]">
                Hover
              </Button>
            </VStack>
            <VStack gap={1.5} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Link
              </span>
              <Button size="sm" variant="link">
                Default
              </Button>
              <Button size="sm" variant="link" className="underline underline-offset-4">
                Hover
              </Button>
            </VStack>
          </div>
        </VStack>

        {/* With Icons */}
        <VStack gap={3}>
          <Label>With icons</Label>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" leftIcon={<IconPlus size={12} />}>
              Left icon
            </Button>
            <Button size="sm" rightIcon={<IconArrowRight size={12} />}>
              Right icon
            </Button>
            <Button size="sm" icon={<IconHeart size={12} />} aria-label="Like" />
            <Button size="sm" variant="secondary" icon={<IconStar size={12} />} aria-label="Star" />
          </div>
          <div className="mt-4">
            <Label>Icon + Text (Action Buttons)</Label>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">
                No selection
              </span>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconPlayerPlay size={12} />}
                disabled
              >
                Start
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />} disabled>
                Create
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />} disabled>
                Edit
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconTrash size={12} />} disabled>
                Delete
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">
                With selection
              </span>
              <Button size="sm" variant="secondary" leftIcon={<IconPlayerPlay size={12} />}>
                Start
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />}>
                Create
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
                Edit
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<IconTrash size={12} />}>
                Delete
              </Button>
            </div>
          </div>
        </VStack>

        {/* Icon Size Guidelines */}
        <VStack gap={3}>
          <Label>Icon size guidelines</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Button Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Icon Size
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    사용 예시
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">SM (28px)</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                  <td className="py-2 text-[var(--color-text-muted)]">테이블 툴바 액션 버튼</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">MD (32px)</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                  <td className="py-2 text-[var(--color-text-muted)]">모달/드로어 액션, 폼 제출</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 items-end mt-2">
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                SM + 12px
              </span>
              <Button size="sm" leftIcon={<IconPlus size={12} />}>
                Create
              </Button>
            </VStack>
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                MD + 12px
              </span>
              <Button size="md" leftIcon={<IconPlus size={12} />}>
                Create
              </Button>
            </VStack>
          </div>
          <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
            <strong>참고:</strong> SM/MD 버튼 모두 12px 아이콘을 사용하여 일관성을 유지합니다.
          </div>
        </VStack>

        {/* States */}
        <VStack gap={3}>
          <Label>States</Label>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Default</Button>
            <Button size="sm" disabled>
              Disabled
            </Button>
            <Button size="sm" isLoading>
              Loading
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="secondary">
              Default
            </Button>
            <Button size="sm" variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </VStack>

        {/* Polymorphic */}
        <VStack gap={3}>
          <Label>Polymorphic (as prop)</Label>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" as="a" href="#" target="_blank">
              As anchor
            </Button>
            <Button size="sm" as={Link} to="/">
              As router link
            </Button>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
