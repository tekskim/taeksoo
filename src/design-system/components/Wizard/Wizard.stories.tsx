import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  WizardSection,
  WizardSectionStatusIcon,
  PreSection,
  WritingSection,
  SkippedSection,
  DoneSection,
} from './WizardSection';
import { SectionCard } from '../SectionCard/SectionCard';
import { VStack } from '../../layouts';

const meta: Meta<typeof WizardSection> = {
  title: 'Components/Wizard',
  component: WizardSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## Wizard 컴포넌트

단계별 폼 위자드 패턴을 구현하는 컴포넌트 세트입니다.

### 구성 요소
- **WizardSection**: 상태에 따라 다른 UI를 렌더링하는 메인 컴포넌트
- **WizardSectionStatusIcon**: 상태 아이콘
- **PreSection**: 대기 중인 섹션
- **WritingSection**: 작성 중인 섹션
- **SkippedSection**: 건너뛴 섹션
- **DoneSection**: 완료된 섹션
- **DoneSectionRow**: 완료 섹션의 데이터 행

### 상태 (WizardSectionState)
- **pre**: 대기 중 (빈 원 아이콘)
- **active**: 활성화됨 (회전 아이콘)
- **done**: 완료됨 (체크 아이콘)
- **skipped**: 건너뜀 (마이너스 아이콘)
- **writing**: 작성 중 (회전 아이콘)

### 사용 시기
- 리소스 생성 마법사
- 다단계 폼
- 설정 위자드

### 예시
\`\`\`tsx
<WizardSection
  title="Basic information"
  status="done"
  onEdit={() => setStep(1)}
  summaryContent={
    <>
      <SectionCard.DataRow label="Name" value="my-instance" />
      <SectionCard.DataRow label="Type" value="m5.large" />
    </>
  }
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['pre', 'active', 'done', 'skipped', 'writing'],
      description: '섹션 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WizardSection>;

// Status Icons
export const StatusIcons: Story = {
  name: 'Status Icons',
  render: () => (
    <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="pre" />
        <span className="text-body-md">Pre (Waiting)</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="active" />
        <span className="text-body-md">Active</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="writing" />
        <span className="text-body-md">Writing</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="done" />
        <span className="text-body-md">Done</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="skipped" />
        <span className="text-body-md">Skipped</span>
      </div>
    </div>
  ),
};

// Pre Section
export const PreSectionExample: Story = {
  name: 'Pre Section',
  render: () => <PreSection title="Network Configuration" />,
};

// Writing Section
export const WritingSectionExample: Story = {
  name: 'Writing Section',
  render: () => (
    <WritingSection title="Storage Settings" onEdit={() => console.log('Edit clicked')} />
  ),
};

// Skipped Section
export const SkippedSectionExample: Story = {
  name: 'Skipped Section',
  render: () => (
    <SkippedSection title="Advanced Options" onEdit={() => console.log('Edit clicked')} />
  ),
};

// Done Section
export const DoneSectionExample: Story = {
  name: 'Done Section',
  render: () => (
    <DoneSection title="Basic information" onEdit={() => console.log('Edit clicked')}>
      <SectionCard.DataRow label="Instance Name" value="production-server-01" showDivider={false} />
      <SectionCard.DataRow label="Description" value="Main production web server" />
      <SectionCard.DataRow label="Region" value="us-east-1" />
    </DoneSection>
  ),
};

// WizardSection - All States
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <VStack gap={4}>
      <WizardSection
        title="Step 1: Basic Info"
        status="done"
        onEdit={() => {}}
        summaryContent={
          <>
            <SectionCard.DataRow label="Name" value="my-instance" showDivider={false} />
            <SectionCard.DataRow label="Type" value="m5.large" />
          </>
        }
      />
      <WizardSection title="Step 2: Configuration" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Step 2: Configuration" />
          <SectionCard.Content>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Configure your instance settings here...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
      <WizardSection title="Step 3: Network" status="pre" />
      <WizardSection title="Step 4: Storage" status="pre" />
    </VStack>
  ),
};

// Full Wizard Example
export const FullWizardExample: Story = {
  name: 'Full Wizard Example',
  render: () => (
    <VStack gap={4}>
      {/* Completed Step */}
      <WizardSection
        title="Basic information"
        status="done"
        onEdit={() => console.log('Edit Basic Info')}
        summaryContent={
          <>
            <SectionCard.DataRow
              label="Instance Name"
              value="web-server-prod-01"
              showDivider={false}
            />
            <SectionCard.DataRow
              label="Description"
              value="Production web server for main application"
            />
            <SectionCard.DataRow label="Project" value="E-commerce Platform" />
          </>
        }
      />

      {/* Completed Step */}
      <WizardSection
        title="Instance Type"
        status="done"
        onEdit={() => console.log('Edit Instance Type')}
        summaryContent={
          <>
            <SectionCard.DataRow label="Type" value="m5.xlarge" showDivider={false} />
            <SectionCard.DataRow label="vCPU" value="4" />
            <SectionCard.DataRow label="Memory" value="16 GB" />
          </>
        }
      />

      {/* Active Step */}
      <WizardSection title="Network Configuration" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Network Configuration" />
          <SectionCard.Content>
            <div className="text-body-md text-[var(--color-text-muted)] py-[var(--primitive-spacing-4)]">
              Select VPC, subnet, and security group settings...
            </div>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>

      {/* Pending Steps */}
      <WizardSection title="Storage" status="pre" />
      <WizardSection title="Security" status="pre" />
      <WizardSection title="Review & Create" status="pre" />
    </VStack>
  ),
};

// With Skipped Steps
export const WithSkippedSteps: Story = {
  name: 'With Skipped Steps',
  render: () => (
    <VStack gap={4}>
      <WizardSection
        title="Required Settings"
        status="done"
        onEdit={() => {}}
        summaryContent={
          <SectionCard.DataRow label="Name" value="my-resource" showDivider={false} />
        }
      />
      <WizardSection
        title="Optional: Tags"
        status="skipped"
        onEdit={() => console.log('Configure tags')}
      />
      <WizardSection
        title="Optional: Monitoring"
        status="skipped"
        onEdit={() => console.log('Configure monitoring')}
      />
      <WizardSection title="Review" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Review" />
          <SectionCard.Content>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Review your configuration before creating...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
    </VStack>
  ),
};
