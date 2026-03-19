import type { Meta, StoryObj } from '@storybook/react';
import DetailCard, { DetailCardText } from './DetailCard';
import { Button } from '../Button';
import Layout from '../Layout';
import { CopyButton } from '../CopyButton';

const meta: Meta<typeof DetailCard> = {
  title: 'Layout/Detail Card',
  component: DetailCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## 스타일 옵션

### 필드 타입 (Field Type)
- **text**: 일반 텍스트 표시 (기본값)
- **component**: 커스텀 React 컴포넌트

### 상태 (State)
- **기본 상태**: 라벨-값 쌍으로 데이터 표시
- **로딩 상태**: 스켈레톤 UI 표시
- **숨김 상태**: visible={false}로 카드 숨김
- **빈 값**: null/undefined/빈 문자열은 "-"로 표시

## 주요 기능
- **라벨-값 표시**: 구조화된 정보를 라벨과 값 쌍으로 표현
- **헤더 액션**: 타이틀 옆에 버튼 등의 액션 배치 가능
- **커스텀 컴포넌트**: 복잡한 값은 component로 자유롭게 렌더링
- **타이틀 생략**: 타이틀 없이 컨텐츠만 표시 가능
- **반응형 레이아웃**: 라벨과 값이 자동으로 정렬

## DetailCardText 컴포넌트

\`type: 'component'\` 필드에서 텍스트를 렌더링할 때 **일관된 스타일**을 보장하는 컴포넌트입니다.

### 왜 사용해야 하나요?
- DetailCard 내부에서 텍스트 스타일(font-size, font-weight, line-height)이 **자동으로 통일**됩니다.
- \`Typography.Text\` 대신 사용하면 별도 스타일 지정 없이 DetailCard 기본 텍스트 스타일이 적용됩니다.
- Link, StatusIndicator 등 다른 컴포넌트와 함께 사용할 때 폴백 텍스트("-")도 일관된 스타일을 유지합니다.

### 기본 사용법
\`\`\`tsx
import { DetailCard, DetailCardText } from '@thaki/shared';

// component 타입에서 텍스트 렌더링
{
  label: 'Field Name',
  type: 'component',
  value: '',
  component: hasLink ? (
    <Link text={linkText} to={linkUrl} />
  ) : (
    <DetailCardText>-</DetailCardText>
  ),
}

// 여러 줄 텍스트
{
  label: 'Multi-line',
  type: 'component',
  value: '',
  component: (
    <>
      <DetailCardText className="mb-1.5">{primaryText}</DetailCardText>
      <DetailCardText color="secondary">{secondaryText}</DetailCardText>
    </>
  ),
}
\`\`\`

## 사용 가이드라인

### 언제 사용하나요?
- 상세 페이지에서 리소스 정보를 표시할 때
- 생성/수정 플로우의 요약 카드로 사용할 때
- 관련 리소스 정보를 그룹화하여 보여줄 때
- 읽기 전용 정보를 구조화하여 표시할 때

### 언제 사용하지 말아야 하나요?
- 편집 가능한 폼 (Form 컴포넌트 사용)
- 많은 필드 (10개 이상이면 섹션 분리 권장)
- 테이블 형태의 반복 데이터 (Table 사용)
- 실시간 변경되는 데이터 (업데이트 빈도 고려)

### 사용 팁
- **필드 개수**: 5-8개 이하 권장 (가독성 유지)
- **라벨 텍스트**: 짧고 명확하게 (1-3 단어)
- **필드 순서**: 중요도순 또는 논리적 흐름에 따라 배치
- **그룹화**: 관련 필드끼리 여러 DetailCard로 분리
- **커스텀**: 복잡한 값(배지, 아이콘 등)은 component 타입 사용
- **타이틀**: 명확한 섹션명으로 카드 용도 표시
- **텍스트 스타일**: component 타입 내 텍스트는 \`DetailCardText\` 사용

## 접근성
- **시맨틱 마크업**: 라벨과 값의 명확한 구조
- **키보드 지원**: 링크는 Tab 키로 포커스, Enter로 이동
- **스크린 리더**: 라벨-값 관계를 음성으로 안내
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '1000px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Basic Information',
    fields: [
      { label: 'Name', value: 'web-server-01', type: 'text' },
      { label: 'Status', value: 'Active', type: 'text' },
      { label: 'Created', value: '2024/10/15 14:30:00', type: 'text' },
      { label: 'IP Address', value: '192.168.1.100', type: 'text' },
    ],
  },
};

export const WithActions: Story = {
  args: {
    title: 'Server Details',
    fields: [
      { label: 'Server Name', value: 'production-01', type: 'text' },
      { label: 'Region', value: 'Asia Pacific', type: 'text' },
      { label: 'Instance Type', value: 't3.medium', type: 'text' },
    ],
    actions: (
      <Button size="sm" variant="secondary">
        Edit
      </Button>
    ),
  },
};

export const WithLinks: Story = {
  args: {
    title: 'Related Resources',
    fields: [
      {
        label: 'Flavor',
        value: 'th.medium',
        type: 'text',
      },
      {
        label: 'Network',
        value: 'default-network',
        type: 'text',
      },
      { label: 'Owner', value: 'admin@example.com', type: 'text' },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    fields: [
      { label: 'Instance Name', value: 'my-instance', type: 'text' },
      { label: 'OS', value: 'Ubuntu 22.04 LTS', type: 'text' },
      { label: 'vCPU', value: '4', type: 'text' },
      { label: 'RAM', value: '8 GB', type: 'text' },
    ],
  },
};

export const WithCustomComponent: Story = {
  args: {
    title: 'Instance Configuration',
    fields: [
      { label: 'Name', value: 'web-server-01', type: 'text' },
      {
        label: 'Status',
        value: 'active',
        type: 'component',
        component: (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--semantic-color-successLight)',
              color: 'var(--semantic-color-success)',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--semantic-color-success)',
              }}
            />
            Active
          </div>
        ),
      },
      { label: 'Created', value: '2024/10/15 14:30:00', type: 'text' },
    ],
  },
};

export const WithEmptyValues: Story = {
  args: {
    title: 'Incomplete Information',
    fields: [
      { label: 'Server Name', value: 'test-server', type: 'text' },
      { label: 'Description', value: null, type: 'text' },
      { label: 'Owner', value: undefined, type: 'text' },
      { label: 'Tags', value: '', type: 'text' },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Data',
    fields: [
      { label: 'Name', value: 'loading...', type: 'text' },
      { label: 'Status', value: 'loading...', type: 'text' },
    ],
    isLoading: true,
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DetailCard
        title="Basic Information"
        fields={[
          { label: 'Name', value: 'production-server', type: 'text' },
          { label: 'Region', value: 'Asia Pacific', type: 'text' },
          { label: 'Created', value: '2024/10/15 14:30:00', type: 'text' },
        ]}
      />
      <DetailCard
        title="Network Configuration"
        fields={[
          { label: 'IP Address', value: '192.168.1.100', type: 'text' },
          { label: 'Network', value: 'default-network', type: 'text' },
          { label: 'Subnet', value: '192.168.1.0/24', type: 'text' },
        ]}
      />
      <DetailCard
        title="Resources"
        fields={[
          { label: 'vCPU', value: '4 cores', type: 'text' },
          { label: 'RAM', value: '8 GB', type: 'text' },
          { label: 'Disk', value: '100 GB SSD', type: 'text' },
        ]}
        actions={
          <Button size="sm" variant="secondary">
            Upgrade
          </Button>
        }
      />
    </div>
  ),
};

/**
 * ## DetailCardText 사용 예제
 *
 * `type: 'component'` 필드에서 텍스트 스타일을 일원화하기 위해 `DetailCardText`를 사용합니다.
 *
 * ### 언제 사용하나요?
 * - Link가 없을 때 폴백 텍스트("-")를 표시할 때
 * - CopyButton과 함께 텍스트를 표시할 때
 * - 여러 줄 텍스트(primary/secondary)를 표시할 때
 *
 * ### 사용 예시
 * ```tsx
 * // ❌ 잘못된 사용 - 스타일 불일치
 * component: hasLink ? <Link ... /> : <span>-</span>
 *
 * // ✅ 올바른 사용 - 일관된 스타일
 * component: hasLink ? <Link ... /> : <DetailCardText>-</DetailCardText>
 * ```
 */
export const WithDetailCardText: Story = {
  name: 'DetailCardText ',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* CopyButton과 함께 사용 */}
      <DetailCard
        title="CopyButton과 함께 사용"
        fields={[
          {
            label: 'MAC Address',
            type: 'component' as const,
            value: '',
            component: (
              <Layout.HStack gap="sm" align="center">
                <DetailCardText>fa:16:3e:ab:cd:ef</DetailCardText>
                <CopyButton text="fa:16:3e:ab:cd:ef" />
              </Layout.HStack>
            ),
          },
          {
            label: 'Checksum',
            type: 'component' as const,
            value: '',
            component: (
              <Layout.HStack gap="sm" align="center">
                <DetailCardText>e3b0c44298fc1c149afbf4c8</DetailCardText>
                <CopyButton text="e3b0c44298fc1c149afbf4c8" />
              </Layout.HStack>
            ),
          },
        ]}
      />
    </div>
  ),
};
