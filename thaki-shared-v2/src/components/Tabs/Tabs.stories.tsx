import type { Meta, StoryObj } from '@storybook/react';
import { Tab, Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component: `
## 스타일 옵션

### 디자인 스타일 (Variant)
- **line**: 기본 라인 스타일 - 탭 하단에 라인이 표시됨 (기본값)
- **button**: 버튼 스타일 - 탭이 버튼 형태로 표시됨

### 크기 (Size)
- **sm**: 작은 크기 (14px 폰트, 24px 간격)
- **md**: 기본 크기 (14px 폰트, 32px 간격) - 권장

### 상태 (State)
- **기본 상태**: 클릭 가능한 상태
- **활성 상태**: 현재 선택된 탭 (primary 색상 표시)
- **비활성화 상태**: 클릭할 수 없는 상태 (disabled)
- **호버 상태**: 마우스를 올렸을 때 색상 변경

## 주요 기능
- **슬라이딩 인디케이터**: 선택된 탭 아래 바가 부드럽게 이동하는 애니메이션
- **자동 스크롤**: 탭이 많을 때 좌우 화살표 버튼으로 스크롤 가능
- **키보드 접근성**: Tab 키로 활성 탭에 포커스, Enter/Space로 탭 선택
- **웹 접근성**: ARIA 속성 및 role을 통한 스크린 리더 지원
- **destroyOnHidden**: 비활성 탭 DOM 제거/유지 선택으로 성능 최적화

## 사용 가이드라인

### 언제 사용하나요?
- 관련된 콘텐츠를 논리적 그룹으로 구성할 때
- 사용자가 여러 뷰 사이를 쉽게 전환해야 할 때
- 페이지 내비게이션을 간소화하고 싶을 때
- 복잡한 폼을 여러 단계로 나눌 때

### 언제 사용하지 말아야 하나요?
- 순차적인 프로세스 (Stepper 사용 권장)
- 2개 미만의 섹션 (아코디언이나 섹션 분리 권장)
- 위계가 깊은 네비게이션 (트리 메뉴 권장)
- 페이지 전환이 필요한 경우 (라우팅 사용)

### 사용 팁
- **탭 개수**: 5-7개 이하 권장 (모바일에서 3-5개)
- **탭 라벨**: 짧고 명확하게 (1-2 단어)
- **탭 순서**: 사용 빈도순 또는 논리적 흐름에 따라 배치
- **기본 탭**: 가장 중요하거나 자주 사용되는 탭을 첫 번째로
- **destroyOnHidden**: 성능이 중요하면 true, 상태 유지가 중요하면 false

## 접근성
- **키보드 지원**: Tab 키로 포커스 이동, Enter/Space 키로 탭 선택
- **스크린 리더**: 탭 역할과 상태를 음성으로 안내
- **ARIA 속성**: role="tablist", role="tab", role="tabpanel"
- **상태 표시**: aria-selected, aria-controls, aria-labelledby
        `,
      },
    },
  },
  decorators: [Story => <Story />],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '탭 크기 (sm: 24px, md: 32px)',
    },
    variant: {
      control: 'select',
      options: ['line', 'button'],
      description: '탭 디자인 스타일 (line: 기본 라인 스타일, button: 버튼 스타일)',
    },
    destroyOnHidden: {
      control: 'boolean',
      description: '비활성 탭의 내용을 DOM에서 제거할지 여부',
    },
    activeTabId: {
      control: 'text',
      description: '활성화할 탭 ID (controlled)',
    },
    defaultActiveTabId: {
      control: 'text',
      description: '기본 활성화 탭 ID (uncontrolled)',
    },
    onChange: {
      action: 'changed',
      description: '탭 변경 시 호출되는 콜백 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs size="sm" destroyOnHidden={false}>
      <Tab id="tab1" label="첫 번째 탭">
        <h3>첫 번째 탭 내용</h3>
      </Tab>
      <Tab id="tab2" label="두 번째 탭">
        <h3>두 번째 탭 내용</h3>
      </Tab>
      <Tab id="tab3" label="세 번째 탭">
        <h3>세 번째 탭 내용</h3>
      </Tab>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs>
      <Tab id="tab1" label="첫 번째 탭">
        <h3>첫 번째 탭 내용</h3>
      </Tab>
      <Tab id="tab2" label="두 번째 탭">
        <h3>두 번째 탭 내용</h3>
      </Tab>
      <Tab id="tab3" label="세 번째 탭 (Disabled)" disabled>
        <h3>세 번째 탭 내용 (Disabled)</h3>
      </Tab>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        border: '1px solid var(--semantic-color-border)',
        padding: '16px',
      }}
    >
      <h4 style={{ marginBottom: '16px' }}>
        탭이 많을 때 스크롤 기능 테스트 (컨테이너 너비: 600px)
      </h4>
      <Tabs size="sm" destroyOnHidden={false}>
        <Tab id="instances" label="Instances">
          <div>
            <h3>인스턴스 관리</h3>
            <p>가상 머신 인스턴스를 생성, 관리, 모니터링할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="networks" label="Networks">
          <div>
            <h3>네트워크 관리</h3>
            <p>가상 네트워크와 서브넷을 구성하고 관리할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="volumes" label="Volumes">
          <div>
            <h3>볼륨 관리</h3>
            <p>블록 스토리지 볼륨을 생성하고 인스턴스에 연결할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="security-groups" label="Security Groups">
          <div>
            <h3>보안 그룹</h3>
            <p>방화벽 규칙을 설정하여 네트워크 보안을 관리할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="floating-ips" label="Floating IPs">
          <div>
            <h3>플로팅 IP</h3>
            <p>외부에서 접근 가능한 공용 IP 주소를 관리할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="load-balancers" label="Load Balancers">
          <div>
            <h3>로드 밸런서</h3>
            <p>
              트래픽을 여러 인스턴스로 분산하는 로드 밸런서를 구성할 수
              있습니다.
            </p>
          </div>
        </Tab>
        <Tab id="containers" label="Containers">
          <div>
            <h3>컨테이너 관리</h3>
            <p>Kubernetes 클러스터와 컨테이너 워크로드를 관리할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="machine-learning" label="Machine Learning">
          <div>
            <h3>머신러닝</h3>
            <p>ML 파이프라인과 모델 학습 환경을 구성할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="monitoring" label="Monitoring & Analytics">
          <div>
            <h3>모니터링 & 분석</h3>
            <p>시스템 메트릭과 로그를 수집하고 분석할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="backup" label="Backup & Disaster Recovery">
          <div>
            <h3>백업 & 재해복구</h3>
            <p>데이터 백업과 재해복구 계획을 설정할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="identity" label="Identity & Access Management">
          <div>
            <h3>신원 & 접근 관리</h3>
            <p>사용자 계정과 권한을 관리할 수 있습니다.</p>
          </div>
        </Tab>
        <Tab id="billing" label="Billing & Cost Management">
          <div>
            <h3>요금 & 비용 관리</h3>
            <p>클라우드 사용량과 비용을 추적하고 관리할 수 있습니다.</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  ),
};

export const ButtonVariant: Story = {
  render: () => (
    <Tabs variant="button" destroyOnHidden={false}>
      <Tab id="roles" label="Roles">
        <div>
          <h3>역할 관리</h3>
          <p>사용자 역할을 생성하고 권한을 할당할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="policies" label="Policies">
        <div>
          <h3>정책 관리</h3>
          <p>접근 정책을 정의하고 관리할 수 있습니다.</p>
        </div>
      </Tab>
    </Tabs>
  ),
};

export const ButtonVariantSm: Story = {
  render: () => (
    <Tabs variant="button" size="sm" destroyOnHidden={false}>
      <Tab id="roles" label="Roles">
        <div>
          <h3>역할 관리</h3>
          <p>사용자 역할을 생성하고 권한을 할당할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="policies" label="Policies">
        <div>
          <h3>정책 관리</h3>
          <p>접근 정책을 정의하고 관리할 수 있습니다.</p>
        </div>
      </Tab>
    </Tabs>
  ),
};

export const ButtonVariantMd: Story = {
  render: () => (
    <Tabs variant="button" size="md" destroyOnHidden={false}>
      <Tab id="roles" label="Roles">
        <div>
          <h3>역할 관리</h3>
          <p>사용자 역할을 생성하고 권한을 할당할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="policies" label="Policies">
        <div>
          <h3>정책 관리</h3>
          <p>접근 정책을 정의하고 관리할 수 있습니다.</p>
        </div>
      </Tab>
    </Tabs>
  ),
};

export const ButtonVariantSizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Button Variant - sm (24px)</h4>
        <Tabs variant="button" size="sm" destroyOnHidden={false}>
          <Tab id="tab1" label="Overview">
            <p>sm 사이즈 (py: 3px, px: 8px)</p>
          </Tab>
          <Tab id="tab2" label="Resources">
            <p>Resources 내용</p>
          </Tab>
          <Tab id="tab3" label="Settings">
            <p>Settings 내용</p>
          </Tab>
        </Tabs>
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Button Variant - md (32px)</h4>
        <Tabs variant="button" size="md" destroyOnHidden={false}>
          <Tab id="tab1" label="Overview">
            <p>md 사이즈 (py: 5px, px: 10px)</p>
          </Tab>
          <Tab id="tab2" label="Resources">
            <p>Resources 내용</p>
          </Tab>
          <Tab id="tab3" label="Settings">
            <p>Settings 내용</p>
          </Tab>
        </Tabs>
      </div>
    </div>
  ),
};

export const ButtonVariantManyTabs: Story = {
  render: () => (
    <Tabs variant="button" destroyOnHidden={false}>
      <Tab id="tab1" label="Overview">
        <div>
          <h3>개요</h3>
          <p>전체 시스템 개요와 주요 메트릭을 확인할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="tab2" label="Resources">
        <div>
          <h3>리소스</h3>
          <p>할당된 리소스를 관리하고 모니터링할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="tab3" label="Security">
        <div>
          <h3>보안</h3>
          <p>보안 정책과 접근 제어를 관리할 수 있습니다.</p>
        </div>
      </Tab>
      <Tab id="tab4" label="Monitoring">
        <div>
          <h3>모니터링</h3>
          <p>시스템 상태와 성능을 실시간으로 확인할 수 있습니다.</p>
        </div>
      </Tab>
    </Tabs>
  ),
};
