import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, SectionCard, VStack } from '@/design-system';
import { IconEdit } from '@tabler/icons-react';

export function SectionCardPage() {
  return (
    <ComponentPageTemplate
      title="Section card"
      description="Container component for grouping related content in detail views"
      relatedLinks={[
        {
          label: 'Detail header',
          path: '/design/components/detail-header',
          description: 'Page header for detail views',
        },
        {
          label: 'Disclosure',
          path: '/design/components/disclosure',
          description: 'Expandable sections',
        },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Form field with label',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>Detail Page에서 관련 정보를 그룹화하는 카드 컨테이너입니다.</li>
                <li>
                  <strong>Header</strong>: 섹션 타이틀과 선택적 액션 버튼(Edit 등)을 포함합니다.
                </li>
                <li>
                  <strong>DataRow</strong>: label-value 형태로 정보를 표시합니다.{' '}
                  <code>isLink</code>로 클릭 가능한 링크를 제공합니다.
                </li>
                <li>
                  <strong>복잡한 값</strong>: value prop 대신 <code>children</code>으로
                  StatusIndicator, Chip 등 커스텀 콘텐츠를 표시합니다.
                </li>
                <li>
                  하나의 SectionCard에는 <strong>최대 10개의 DataRow</strong>를 권장합니다. 초과 시
                  SectionCard를 분리하세요.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> ·{' '}
            <code>header.height: 32px</code> · <code>title: 14px medium</code> ·{' '}
            <code>label: 11px medium</code> · <code>value: 12px</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Basic usage</Label>
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              <SectionCard.DataRow label="Instance name" value="web-server-01" />
              <SectionCard.DataRow label="Availability zone" value="nova" />
              <SectionCard.DataRow label="Description" value="Production web server" />
            </SectionCard.Content>
          </SectionCard>
        </VStack>

        <VStack gap={3}>
          <Label>With Action Buttons</Label>
          <SectionCard>
            <SectionCard.Header
              title="Basic information"
              actions={
                <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                  Edit
                </Button>
              }
            />
            <SectionCard.Content>
              <SectionCard.DataRow label="Instance name" value="web-server-01" />
              <SectionCard.DataRow label="Availability zone" value="nova" />
            </SectionCard.Content>
          </SectionCard>
        </VStack>

        <VStack gap={3}>
          <Label>With Link Values</Label>
          <SectionCard>
            <SectionCard.Header title="Flavor" />
            <SectionCard.Content>
              <SectionCard.DataRow
                label="Flavor name"
                value="m1.large"
                isLink
                linkHref="/flavors"
              />
              <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
            </SectionCard.Content>
          </SectionCard>
        </VStack>

        <VStack gap={3}>
          <Label>Multiple Sections (Detail Page Layout)</Label>
          <VStack gap={4}>
            <SectionCard>
              <SectionCard.Header
                title="Basic information"
                actions={
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                }
              />
              <SectionCard.Content>
                <SectionCard.DataRow label="Instance name" value="tk-test" />
                <SectionCard.DataRow label="Availability zone" value="nova" />
                <SectionCard.DataRow label="Description" value="-" />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Flavor" />
              <SectionCard.Content>
                <SectionCard.DataRow
                  label="Flavor name"
                  value="web-server-10"
                  isLink
                  linkHref="/flavors"
                />
                <SectionCard.DataRow
                  label="Spec"
                  value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1"
                />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Image" />
              <SectionCard.Content>
                <SectionCard.DataRow
                  label="Image"
                  value="web-server-10"
                  isLink
                  linkHref="/images"
                />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
