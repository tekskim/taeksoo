import type { Meta, StoryObj } from '@storybook/react';
import Accordion from './Accordion';
import { Typography } from '../Typography';
import Layout from '../Layout';
import {
  ChevronRightIcon,
  HomeIcon,
  ChartIcon,
  SettingIcon,
  DashboardIcon,
} from '../Icon';
import { useState } from 'react';

const expandingCardStyle = {
  border: '1px dashed var(--semantic-color-border)',
  borderRadius: 'var(--primitive-space-2)',
  overflow: 'hidden',
  marginBottom: 'var(--primitive-space-2)',
} as const;

const meta: Meta<typeof Accordion.Group> = {
  title: 'Layout/Accordion',
  component: Accordion.Group,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## 스타일 옵션

### 아코디언 타입 (Type)
- **single**: 한 번에 하나의 아이템만 열림 (기본값)
- **multiple**: 여러 아이템을 동시에 열 수 있음

### 상태 (State)
- **기본 상태**: 닫혀있거나 열려있는 상태
- **열림 상태**: 콘텐츠가 표시되고 헤더에 시각적 피드백
- **비활성화 상태**: 모든 상호작용 차단 (disabled=true)
- **Collapsible**: Single 모드에서 모든 아이템을 닫을 수 있는지 여부

## 주요 기능
- **단일/다중 열기**: type="single" 또는 "multiple"로 동작 방식 제어
- **제어 모드**: Controlled/Uncontrolled 모드 모두 지원
- **상태 유지**: keepMounted로 닫혀도 DOM 유지 (폼/상태 보존)
- **비활성화**: 전체 또는 개별 아이템 비활성화 가능
- **Collapsible 제어**: single 모드에서 모든 아이템 닫기 허용/차단
- **접근성**: 키보드 탐색, ARIA 속성, 스크린 리더 지원
- **성능 최적화**: React.memo로 불필요한 리렌더링 방지
- **애니메이션**: CSS 트랜지션으로 부드러운 펼침/접힘

## 사용 가이드라인

### 언제 사용하나요?
- 긴 콘텐츠를 섹션별로 나눠 표시할 때
- FAQ, 설정, 메뉴 등 계층적 정보 구조
- 공간이 제한적이지만 많은 정보를 담아야 할 때
- 사용자가 원하는 섹션만 선택적으로 볼 수 있어야 할 때
- 사이드바 메뉴, 필터 패널, 상세 정보 등

### 언제 사용하지 말아야 하나요?
- 모든 콘텐츠를 항상 표시해야 할 때 (탭 권장)
- 2-3개 이하의 짧은 콘텐츠 (일반 리스트 권장)
- 복잡한 테이블이나 차트 (별도 페이지 권장)
- 사용자가 여러 섹션을 동시에 비교해야 할 때
- 핵심 정보가 숨겨지면 안 되는 경우

### 사용 팁
- **아이템 개수**: 5-10개 이하 권장 (너무 많으면 스크롤 필요)
- **헤더 명확성**: 콘텐츠를 명확히 설명하는 헤더 사용
- **시각적 피드백**: 아이콘이나 화살표로 열림/닫힘 상태 표시
- **단일 vs 다중**: 관련 정보 비교가 필요하면 multiple 사용
- **keepMounted**: 폼이나 비디오 등 상태 유지가 필요한 경우 사용
- **collapsible**: FAQ나 설정에서는 true, 필수 선택 항목에서는 false
- **초기 상태**: 중요한 섹션은 defaultValue로 열어두기

## 접근성
- **키보드 지원**: Tab으로 포커스 이동, Enter/Space로 토글
- **ARIA 속성**: aria-expanded, aria-label, aria-disabled 자동 설정
- **포커스 관리**: tabIndex로 비활성화 상태 처리
- **스크린 리더**: 헤더와 콘텐츠 구조 명확히 전달
- **시각적 피드백**: disabled 상태 시각적으로 표시

## 성능 최적화
- **메모이제이션**: React.memo로 불필요한 리렌더링 방지
- **안정적인 핸들러**: toggleHandlers로 함수 참조 안정화
- **조건부 렌더링**: keepMounted=false 시 DOM에서 완전히 제거
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Layout.Container maxWidth="md" padding="md">
      <Accordion.Group type="single" defaultValue="item1">
        <Accordion.Item
          id="item1"
          aria-label="Section 1"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
            overflow: 'hidden',
          }}
          header={
            <Layout.HStack
              justify="between"
              align="center"
              style={{
                padding: 'var(--semantic-space-md)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text>Section 1</Typography.Text>
              <ChevronRightIcon
                variant="muted"
                size="sm"
                style={{
                  transition:
                    'transform var(--semantic-transition-normal) ease',
                }}
              />
            </Layout.HStack>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
              borderTop: '1px solid var(--semantic-color-border)',
            }}
          >
            <Typography.Text>
              This is the content for Section 1. You can put any content here.
            </Typography.Text>
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="item2"
          aria-label="Section 2"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
            overflow: 'hidden',
          }}
          header={
            <Layout.HStack
              justify="between"
              align="center"
              style={{
                padding: 'var(--semantic-space-md)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text>Section 2</Typography.Text>
              <ChevronRightIcon
                variant="muted"
                size="sm"
                style={{
                  transition:
                    'transform var(--semantic-transition-normal) ease',
                }}
              />
            </Layout.HStack>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
              borderTop: '1px solid var(--semantic-color-border)',
            }}
          >
            <Typography.Text>
              This is the content for Section 2. Standard accordion design with
              arrow indicators.
            </Typography.Text>
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="item3"
          aria-label="Section 3"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
            overflow: 'hidden',
          }}
          header={
            <Layout.HStack
              justify="between"
              align="center"
              style={{
                padding: 'var(--semantic-space-md)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text>Section 3</Typography.Text>
              <ChevronRightIcon
                variant="muted"
                size="sm"
                style={{
                  transition:
                    'transform var(--semantic-transition-normal) ease',
                }}
              />
            </Layout.HStack>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
              borderTop: '1px solid var(--semantic-color-border)',
            }}
          >
            <Typography.Text>
              This is the content for Section 3. Click the arrow to expand and
              collapse.
            </Typography.Text>
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </Layout.Container>
  ),
};

export const Card: Story = {
  render: () => (
    <Layout.Container maxWidth="lg" padding="md">
      <Accordion.Group type="single">
        <Accordion.Item
          id="expanding-card-1"
          aria-label="Expanding Card 1"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--primitive-space-2)',
            overflow: 'hidden',
            marginBottom: 'var(--primitive-space-2)',
          }}
          header={
            <div
              style={{
                padding: 'var(--primitive-space-4)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition: 'all var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text
                style={{
                  fontWeight: '600',
                  fontSize: 'var(--primitive-space-4)',
                  lineHeight: 'var(--primitive-space-6)',
                  color: 'var(--semantic-color-text)',
                }}
              >
                Data Table Management
              </Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--primitive-space-4)',
              fontSize: 'var(--primitive-space-3)',
              color: 'var(--semantic-color-text)',
              height: '300px',
            }}
          >
            내용
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="expanding-card-2"
          aria-label="Expanding Card 2"
          style={expandingCardStyle}
          header={
            <div
              style={{
                padding: 'var(--primitive-space-4)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition: 'all var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text
                style={{
                  fontWeight: '600',
                  fontSize: 'var(--primitive-space-4)',
                  lineHeight: 'var(--primitive-space-6)',
                  color: 'var(--semantic-color-text)',
                }}
              >
                Analytics Dashboard
              </Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--primitive-space-4)',
              fontSize: 'var(--primitive-space-3)',
              color: 'var(--semantic-color-text)',
              height: '300px',
            }}
          >
            내용
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="expanding-card-3"
          aria-label="Expanding Card 3"
          style={expandingCardStyle}
          header={
            <div
              style={{
                padding: 'var(--primitive-space-4)',
                background: 'var(--semantic-color-surface)',
                cursor: 'pointer',
                transition: 'all var(--semantic-transition-normal) ease',
              }}
            >
              <Typography.Text
                style={{
                  fontWeight: '600',
                  fontSize: 'var(--primitive-space-4)',
                  lineHeight: 'var(--primitive-space-6)',
                  color: 'var(--semantic-color-text)',
                }}
              >
                Settings Configuration
              </Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--primitive-space-4)',
              fontSize: 'var(--primitive-space-3)',
              color: 'var(--semantic-color-text)',
              height: '300px',
            }}
          >
            내용
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </Layout.Container>
  ),
};

export const Sidebar: Story = {
  render: () => (
    <div
      style={{
        width: '280px',
        background: 'var(--semantic-color-surface)',
        border: '1px solid var(--semantic-color-border)',
        borderRadius: 'var(--semantic-radius-lg)',
        overflow: 'hidden',
      }}
    >
      <Accordion.Group type="multiple" defaultValue={['dashboard']}>
        <Accordion.Item
          id="dashboard"
          aria-label="Dashboard Menu"
          header={
            <Layout.HStack
              gap="sm"
              align="center"
              style={{
                padding: 'var(--semantic-space-sm) var(--semantic-space-md)',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <HomeIcon variant="muted" size="sm" />
              <Typography.Text
                style={{
                  fontWeight: 'var(--semantic-font-weightMedium)',
                  flex: 1,
                }}
              >
                Dashboard
              </Typography.Text>
              <ChevronRightIcon variant="muted" size="xs" />
            </Layout.HStack>
          }
        >
          <div
            style={{
              background: 'var(--semantic-color-surfaceMuted)',
              borderTop: '1px solid var(--semantic-color-border)',
            }}
          >
            <div
              style={{
                padding: 'var(--semantic-space-xs) var(--semantic-space-md)',
                paddingLeft:
                  'calc(var(--semantic-space-md) + var(--semantic-space-lg))',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Layout.HStack gap="sm" align="center">
                <ChartIcon variant="muted" size="xs" />
                <Typography.Text
                  style={{ fontSize: 'var(--semantic-font-sizeSm)' }}
                >
                  Overview
                </Typography.Text>
              </Layout.HStack>
            </div>
            <div
              style={{
                padding: 'var(--semantic-space-xs) var(--semantic-space-md)',
                paddingLeft:
                  'calc(var(--semantic-space-md) + var(--semantic-space-lg))',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Layout.HStack gap="sm" align="center">
                <ChartIcon variant="muted" size="xs" />
                <Typography.Text
                  style={{ fontSize: 'var(--semantic-font-sizeSm)' }}
                >
                  Analytics
                </Typography.Text>
              </Layout.HStack>
            </div>
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="settings"
          aria-label="Settings Menu"
          header={
            <Layout.HStack
              gap="sm"
              align="center"
              style={{
                padding: 'var(--semantic-space-sm) var(--semantic-space-md)',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
                borderTop: '1px solid var(--semantic-color-border)',
              }}
            >
              <SettingIcon variant="muted" size="sm" />
              <Typography.Text
                style={{
                  fontWeight: 'var(--semantic-font-weightMedium)',
                  flex: 1,
                }}
              >
                Settings
              </Typography.Text>
              <ChevronRightIcon variant="muted" size="xs" />
            </Layout.HStack>
          }
        >
          <div
            style={{
              background: 'var(--semantic-color-surfaceMuted)',
              borderTop: '1px solid var(--semantic-color-border)',
            }}
          >
            <div
              style={{
                padding: 'var(--semantic-space-xs) var(--semantic-space-md)',
                paddingLeft:
                  'calc(var(--semantic-space-md) + var(--semantic-space-lg))',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Layout.HStack gap="sm" align="center">
                <DashboardIcon variant="muted" size="xs" />
                <Typography.Text
                  style={{ fontSize: 'var(--semantic-font-sizeSm)' }}
                >
                  Profile
                </Typography.Text>
              </Layout.HStack>
            </div>
            <div
              style={{
                padding: 'var(--semantic-space-xs) var(--semantic-space-md)',
                paddingLeft:
                  'calc(var(--semantic-space-md) + var(--semantic-space-lg))',
                cursor: 'pointer',
                transition:
                  'background-color var(--semantic-transition-normal) ease',
              }}
            >
              <Layout.HStack gap="sm" align="center">
                <SettingIcon variant="muted" size="xs" />
                <Typography.Text
                  style={{ fontSize: 'var(--semantic-font-sizeSm)' }}
                >
                  Preferences
                </Typography.Text>
              </Layout.HStack>
            </div>
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Layout.Container maxWidth="md" padding="md">
      <Typography.Text
        style={{ marginBottom: 'var(--semantic-space-md)', display: 'block' }}
      >
        📌 <strong>collapsible=false</strong>: Single 모드에서 항상 하나는
        열려있어야 함
      </Typography.Text>

      <Accordion.Group type="single" collapsible={false} defaultValue="faq1">
        <Accordion.Item
          id="faq1"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
          }}
          header={
            <div
              style={{ padding: 'var(--semantic-space-md)', cursor: 'pointer' }}
            >
              <Typography.Text>
                FAQ 1 - 마지막 열린 아이템은 닫을 수 없음
              </Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
            }}
          >
            <Typography.Text>
              이 아이템이 마지막으로 열린 상태라면 클릭해도 닫히지 않습니다.
            </Typography.Text>
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="faq2"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
          }}
          header={
            <div
              style={{ padding: 'var(--semantic-space-md)', cursor: 'pointer' }}
            >
              <Typography.Text>FAQ 2</Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
            }}
          >
            <Typography.Text>
              다른 아이템을 클릭하면 이전 아이템이 닫히고 이 아이템이 열립니다.
            </Typography.Text>
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </Layout.Container>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Layout.Container maxWidth="md" padding="md">
      <Typography.Text
        style={{ marginBottom: 'var(--semantic-space-md)', display: 'block' }}
      >
        📌 <strong>disabled=true</strong>: 모든 상호작용이 차단되고 시각적으로
        비활성화됨
      </Typography.Text>

      <Accordion.Group type="single" disabled={true}>
        <Accordion.Item
          id="disabled1"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
          }}
          header={
            <div style={{ padding: 'var(--semantic-space-md)' }}>
              <Typography.Text>비활성화된 아이템 1</Typography.Text>
            </div>
          }
        >
          <div style={{ padding: 'var(--semantic-space-md)' }}>
            <Typography.Text>이 내용은 표시되지 않습니다.</Typography.Text>
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="disabled2"
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
          }}
          header={
            <div style={{ padding: 'var(--semantic-space-md)' }}>
              <Typography.Text>비활성화된 아이템 2 (클릭 불가)</Typography.Text>
            </div>
          }
        >
          <div style={{ padding: 'var(--semantic-space-md)' }}>
            <Typography.Text>이 내용도 표시되지 않습니다.</Typography.Text>
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </Layout.Container>
  ),
};

const KeepMountedComponent = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Layout.Container maxWidth="md" padding="md">
      <Typography.Text
        style={{ marginBottom: 'var(--semantic-space-md)', display: 'block' }}
      >
        📌 <strong>keepMounted=true</strong>: 닫혀도 DOM과 상태가 유지됨 (폼
        테스트)
      </Typography.Text>

      <Accordion.Group type="single">
        <Accordion.Item
          id="form-section"
          keepMounted={true} // 🔥 핵심 기능
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            marginBottom: 'var(--semantic-space-xs)',
          }}
          header={
            <div
              style={{
                padding: 'var(--semantic-space-md)',
                cursor: 'pointer',
              }}
            >
              <Typography.Text>폼 섹션 (keepMounted=true)</Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
            }}
          >
            <Typography.Text
              style={{
                marginBottom: 'var(--semantic-space-sm)',
                display: 'block',
              }}
            >
              텍스트를 입력하고 다른 섹션으로 이동한 후 다시 돌아와보세요:
            </Typography.Text>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="여기에 입력하세요..."
              style={{
                width: '100%',
                padding: 'var(--semantic-space-sm)',
                border: '1px solid var(--semantic-color-border)',
                borderRadius: 'var(--semantic-radius-sm)',
              }}
            />
            {inputValue && (
              <Typography.Text
                style={{
                  marginTop: 'var(--semantic-space-sm)',
                  display: 'block',
                  color: 'var(--semantic-color-success)',
                }}
              >
                입력된 값: "{inputValue}"
              </Typography.Text>
            )}
          </div>
        </Accordion.Item>

        <Accordion.Item
          id="normal-section"
          keepMounted={false} // 비교용 (기본값)
          style={{
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
          }}
          header={
            <div
              style={{
                padding: 'var(--semantic-space-md)',
                cursor: 'pointer',
              }}
            >
              <Typography.Text>일반 섹션 (keepMounted=false)</Typography.Text>
            </div>
          }
        >
          <div
            style={{
              padding: 'var(--semantic-space-md)',
              background: 'var(--semantic-color-surfaceMuted)',
            }}
          >
            <Typography.Text>
              이 섹션을 닫으면 DOM에서 완전히 제거됩니다. 위 폼 섹션과
              비교해보세요!
            </Typography.Text>
          </div>
        </Accordion.Item>
      </Accordion.Group>
    </Layout.Container>
  );
};

export const KeepMounted: Story = {
  render: () => <KeepMountedComponent />,
};
