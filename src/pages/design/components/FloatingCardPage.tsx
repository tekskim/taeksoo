import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, VStack, HStack, NumberInput, ProgressBar } from '@/design-system';
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';

export function FloatingCardPage() {
  return (
    <ComponentPageTemplate
      title="Floating card"
      description="Floating summary card for create/edit flows with sections, quota, and actions"
      relatedLinks={[
        { label: 'Drawer', path: '/design/components/drawer', description: 'Form panel' },
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Content sections',
        },
        { label: 'Progress bar', path: '/design/components/table', description: 'Quota display' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">개요</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Create/Edit 페이지의 우측에 고정되어 입력 진행 상태와 요약 정보를 제공하는
                  카드입니다. 사용자가 전체 구성을 한눈에 파악하고, 리소스 할당량(Quota)을
                  실시간으로 확인할 수 있습니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">구성 요소</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>Configuration</strong>: 각 섹션/탭의 입력 완료 상태를 아이콘과 라벨로
                    표시합니다.
                  </li>
                  <li>
                    <strong>Quota</strong>: 현재 사용량 대비 할당량을 프로그레스 바로 시각화합니다.
                    초과 시 danger 색상.
                  </li>
                  <li>
                    <strong>Summary</strong>: 사용자가 입력한 주요 설정값을 요약 표시합니다.
                  </li>
                  <li>
                    <strong>버튼 영역</strong>: Cancel(secondary)과 Create(primary) 버튼을 하단에
                    고정 배치합니다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">동작 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>스크롤 시에도 Floating card는 우측에 고정(sticky) 상태를 유지합니다.</li>
                  <li>입력값 변경 시 실시간으로 Summary와 Quota가 업데이트됩니다.</li>
                  <li>Create 클릭 시 전체 탭/섹션에 대한 Global Validation을 수행합니다.</li>
                  <li>Validation 오류 시 해당 섹션으로 자동 스크롤하고 오류를 표시합니다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Basic Example - QuotaSidebar Style */}
        <VStack gap={4}>
          <Label>Basic Example (QuotaSidebar from Create Instance)</Label>
          <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
            <div className="w-[var(--wizard-summary-width)] shrink-0">
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
                {/* Summary Card */}
                <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
                  <VStack gap={3}>
                    <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                      Summary
                    </h5>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Launch type
                        </span>
                        <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                          <IconCheck size={10} stroke={2.5} className="text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Basic information
                        </span>
                        <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                          <IconCheck size={10} stroke={2.5} className="text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Source
                        </span>
                        <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                          <IconCheck size={10} stroke={2.5} className="text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Flavor
                        </span>
                        <div
                          className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
                          style={{ borderStyle: 'dashed', animationDuration: '2s' }}
                        />
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Network
                        </span>
                        <div
                          className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                          style={{ borderStyle: 'dashed' }}
                        />
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Authentication
                        </span>
                        <div
                          className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                          style={{ borderStyle: 'dashed' }}
                        />
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          Advanced
                        </span>
                        <div
                          className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                          style={{ borderStyle: 'dashed' }}
                        />
                      </div>
                    </div>
                  </VStack>
                </div>

                {/* Quota Card */}
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
                  <VStack gap={3}>
                    <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                      Quota
                    </h5>
                    <VStack gap={3}>
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={3}
                        max={10}
                        newValue={1}
                        showValue
                      />
                      <ProgressBar
                        variant="quota"
                        label="vCPU"
                        value={7}
                        max={20}
                        newValue={2}
                        showValue
                      />
                      <ProgressBar
                        variant="quota"
                        label="RAM (GiB)"
                        value={18}
                        max={50}
                        newValue={4}
                        showValue
                      />
                      <ProgressBar
                        variant="quota"
                        label="Disk"
                        value={3}
                        max={10}
                        newValue={1}
                        showValue
                      />
                      <ProgressBar
                        variant="quota"
                        label="Disk capacity (GiB)"
                        value={70}
                        max={1000}
                        newValue={50}
                        showValue
                      />
                    </VStack>
                  </VStack>
                </div>

                {/* Number of Instances */}
                <VStack gap={2}>
                  <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                    Number of Instances
                  </label>
                  <NumberInput value={1} onChange={() => {}} min={1} max={10} fullWidth />
                </VStack>

                {/* Action Buttons */}
                <HStack gap={2}>
                  <Button
                    variant="secondary"
                    onClick={() => console.log('Cancel')}
                    className="w-[80px]"
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" disabled className="flex-1">
                    Create
                  </Button>
                </HStack>
              </div>
            </div>
          </div>
        </VStack>

        {/* Status Icons */}
        <VStack gap={4}>
          <Label>Status icons</Label>
          <div className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className="size-4 rounded-full border border-[var(--color-border-default)]"
                style={{ borderStyle: 'dashed' }}
              />
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                Default
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-4 rounded-full border border-[var(--color-text-muted)] animate-spin"
                style={{ borderStyle: 'dashed', animationDuration: '2s' }}
              />
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                Processing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] flex items-center justify-center">
                <IconAlertTriangle size={10} stroke={2} className="text-white" />
              </div>
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                Warning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] flex items-center justify-center">
                <IconCheck size={10} stroke={2} className="text-white" />
              </div>
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                Success
              </span>
            </div>
          </div>
        </VStack>

        {/* Props Reference */}
        <VStack gap={4}>
          <Label>Props reference</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-12)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Prop
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Type
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Default
                  </th>
                  <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">title</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">required</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Card title in summary section
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    sections
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    FloatingCardSection[]
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Collapsible sections with items
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">quota</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">QuotaItem[]</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                  <td className="py-2 text-[var(--color-text-default)]">Quota progress bars</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    position
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">FloatingCardPosition</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">&apos;top-left&apos;</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Position when portal is true
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">portal</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Render in portal (fixed position)
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    actionEnabled
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">false</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Enable primary action button
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">width</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">&apos;320px&apos;</td>
                  <td className="py-2 text-[var(--color-text-default)]">Card width</td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
