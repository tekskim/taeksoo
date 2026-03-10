import { Link } from 'react-router-dom';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, VStack } from '@/design-system';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import {
  IconPlus,
  IconArrowRight,
  IconHeart,
  IconStar,
  IconPlayerPlay,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';

const BUTTON_GUIDELINES = `## Overview

사용자가 시스템에 변화를 일으키는 액션을 실행하기 위한 기본 인터랙션 컴포넌트이다. Button은 기능의 존재와 실행 가능 여부를 명확히 전달해야 하며, 동일한 의미의 액션은 제품 전반에서 동일한 라벨/위치/동작으로 일관되게 제공되어야 한다.
본 문서는 클라우드 콘솔 환경(권한/RBAC, 리소스 상태, 비동기 작업, 파괴적 작업)을 전제로 Button의 노출/상태/라벨/예외 규칙을 정의한다.

---

## Variants

### 1) 유형 분류

버튼은 의미와 위험도에 따라 Variant를 구분한다.

| Variant | 목적 | 사용 예 |
| --- | --- | --- |
| Primary | 화면의 주요 액션 | Create, Save |
| Secondary | 보조 액션 | Cancel |
| Outline | 보조 CTA | Create (sub context) |
| Ghost | 낮은 강조의 보조 액션 | Retry |
| Muted | 매우 낮은 중요도의 보조 액션 | Copy ID |
| Danger | 파괴적 액션 | Delete |
| Link | 내부 페이지로 이동 | View details |
| Anchor Link | 외부 링크 | |

**정책**
- 한 화면/컨테이너(모달, 카드, 섹션) 내 Primary는 기본 1개만 허용한다.
- Danger는 Primary 자리에 오지 않는다(예외: "Delete modal"처럼 목적 자체가 삭제인 화면만 허용).

### 2) 사이즈 분류

버튼은 세 가지 크기를 제공한다.

| Size | Height | Minimum width | 사용 상황 |
| --- | --- | --- | --- |
| SM | 28px | 60px | 테이블 툴바, 밀집된 UI |
| MD | 32px | 80px | 일반 UI, 모달, 드로어 |
| LG | 36px | 80px | 페이지 주요 CTA |

**정렬 규칙**
- 같은 영역의 버튼은 동일한 사이즈를 사용한다.

---

## States

| State | 설명 |
| --- | --- |
| Enabled | 클릭 가능한 상태 |
| Hover | 포인터가 올라간 상태 |
| Pressed | 클릭 중 |
| Focus | 키보드 포커스 |
| Disabled | 클릭 불가(기능 존재는 노출) |
| Loading | 실행 중(중복 클릭 방지) |

---

## Behavior

### 1) 노출 정책: Disabled vs Hidden

- **원칙**: 기본은 **Disabled + (필요 시 Tooltip)** 이다. Hidden은 예외로만 허용한다.
- **이유**: 기능 존재를 명확히 인지 / "안 보임 = 오류" 오인 방지 / 권한/상태 기반 콘솔 UX 일관성 유지
- **Hidden 허용 케이스(예외)**:
  - 상호 배타적 토글 액션(버튼 교체): 상태에 따라 둘 중 하나만 논리적으로 존재 (예: Attach / Detach)
  - 동일 컨텍스트에서 노출 시 혼란이 명확한 경우(디자인 리뷰/정책 승인 필요)

### 2) Disabled 적용 기준

버튼은 다음 조건에서 Disabled가 된다.

| 유형 | Disabled 조건 |
| --- | --- |
| 리소스 상태 | 현재 상태에서 실행 불가(예: Running VM은 Start 불가) |
| 선행 조건 | 선택 필요/종속성 해결 필요 |

### 3) Disabled Tooltip 정책

Tooltip은 "사용자가 화면만 보고 이유를 알 수 있는가"로 결정한다.

- **Tooltip 제공(필수)**: 리소스 상태, 보호/잠금 등 내부 로직 기반
- **Tooltip 미제공**: 사용자가 1초 내 인지 가능한 이유(예: 선택 없음, 필수 입력 누락)
- **Tooltip 문구 원칙**:
  - 현재 상태 또는 제한 이유를 설명한다.
  - 간결한 문장을 사용한다.
  - 명령형 문장을 사용하지 않는다.
  - 해결 방법 안내는 포함하지 않는다.
  - 문장 패턴: \`This {object} is {state}.\` / \`This {object} cannot be {action}.\` / \`This {object} cannot be {action} due to {reason}.\`
  - 예시: \`"This tenant is disabled."\` / \`"The L7 rule cannot be deleted due to the current L7 policy state."\` / \`"This rule is associated with a policy and cannot be deleted."\`

### 4) 입력 기반 액션

- Create/Save/Apply처럼 입력값이 필요한 액션은 **버튼을 기본 Enabled로 유지**하고, 클릭 시 검증을 수행한다.
- 검증 실패 시 에러는 버튼이 아니라 **해당 필드/섹션의 Validation**으로 제공한다.

### 5) Loading(중복 실행 방지)

- 네트워크/비동기 작업을 트리거하는 버튼은 클릭 즉시 Loading 상태로 전환한다.
- Loading 중에는 중복 클릭이 불가하다(Disabled 처리 또는 로딩 상태 자체로 차단).
- Loading 상태에서는 라벨/아이콘 변화로 실행 중임을 명확히 한다.

### 6) 파괴적 액션 규칙

- Danger 버튼은 기본적으로 "즉시 실행"하지 않는다.
- Confirm Modal를 제공한다.
- Danger 버튼은 CTA 영역의 마지막 위치 또는 분리된 그룹에 배치한다.

### 7) Icon

| 위치 | 의미 |
| --- | --- |
| Left icon | 액션 강조 |
| Right icon | 이동 / 다음 단계 |
| Only icon | 다운로드, 즐겨찾기 등 아이콘만으로도 의미 전달이 가능한 보편적 액션 |

---

## Content Guidelines

### 1) 라벨 기본 원칙

- 사용자의 "다음 행동"을 명확히 지시하는 단어 사용
- \`EN\`: 동사형
- \`KO\`: '~하기' 생략한 단일 명사형
- 동일 의미는 전 제품에서 동일 용어로 통일

### 2) 주요 액션 용어 표준

| 영어(EN) | 한국어(KO) | 잘못된 사용 예시 | 비고 |
| --- | --- | --- | --- |
| Create | 생성 | 만들기, 생성하기, 추가, 추가하기 | 새로운 값을 넣어서 특정 리소스를 만드는 행위는 '생성' |
| Create {resource} | {리소스} 생성 | | 어떤 리소스를 생성하는 기능인지 설명이 필요할 때 생성 버튼은 "{리소스} 생성"으로 통일. → 인스턴스 리스트 화면에서는 '인스턴스 생성' 버튼. → 인스턴스 생성 화면에서는 '생성' 버튼 |
| Add | 추가 | 생성, 만들기 | 기존 리소스에 하위 항목이나 속성을 더하는 행위는 '추가' |
| Delete | 삭제 | | 만들어진 리소스가 사라지는 행위는 '삭제' |
| Remove | 제거 | | 연결을 끊기 등 리소스가 직접적으로 사라지지는 않는 행위는 '제거' |
| Edit | 편집 | 수정, 변경 | 기존 설정, 속성, 내용을 변경하는 행위는 '편집' |
| Cancel | 취소 | 닫기, 아니오 | 영단어 Cancel은 '취소'로 통일 |
| Confirm | 확인 | 적용, 예, 네 | 삭제 등 액션에 대한 의사를 다시 확인하는 행위는 '확인' |
| Save | 저장 | | 여러가지의 속성을 변경해 저장하는 행위는 '저장' |
| Manage {resources} | {리소스} 관리 | | Manage 뒤에는 복수형. → Manage tags, Manage groups |
| Close | 닫기 | | 선택권이 없는 모달에서 사용 |
| Skip | 건너뛰기 | | 여러 단계가 있는 구성에서 속성값 설정이 없이 다음 단계로 넘어감 |
| Previous | 이전 | Back, 되돌아가기 | 여러 단계가 있는 구성에서 바로 '이전' 단계로 돌아감 |
| Next | 다음 | | 여러 단계가 있는 구성에서 바로 '앞'단계로 넘어감 |
| Done | 완료 | | 여러 단계가 있는 구성에서 정보 확인 및 변경이 끝났을 때 사용 |
| Copy | 복사 | | |
| Download | 다운로드 | 올리기 | |
| Upload | 업로드 | 내보내기 | |
| Reset to default | 초기화 | 기본값으로 재설정 | 기본값으로 되돌리는 행위는 '초기화' |
| View details | 상세 보기 | | 아코디언, 드로어를 통해 추가적인 정보가 확인 가능할 때 사용 |

---

## Usage Guidelines

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Tooltip | Component | Disabled 사유 전달 |
| Validation | Component | 입력 오류 표시(버튼 대신 필드 근처) |
| Modal | Component | Destructive confirm, 의사 확인 |
| Context Menu | Component | 다중 액션 수용 |
| Card | Component | CTA 버튼 포함 |
| Create page | Pattern | 카드 입력 시 버튼 규칙 |
| UX Writing Guide | Foundation | 용어/표기 통일 |

---

<details>
<summary>이전 버전</summary>

## 버튼 노출 정책

### 1. 비활성화 or 비노출
- 사용자에게 기능의 존재 여부를 명확히 알리기 위해 '비활성화 + 툴팁'을 기본으로 한다.
- 버튼이 보이지 않을 경우 시스템 오류로 오인하는 것을 방지한다.
- 단, 논리적으로 불가능하거나 사용자에게 불필요한 인지 부하를 주는 경우에 한해 예외적으로 '비노출(Hidden)' 처리한다.

### 2. 상태별 상세 정책

1. 활성화 상태
   - 정의: 기능을 즉시 실행할 수 있는 정상 상태로, 클릭 이벤트가 정상 동작함.
   - 적용 기준:
     1. 권한 충족: 사용자가 해당 기능을 실행할 권한을 가지고 있음.
     2. 상태 적합: 대상 리소스가 해당 기능을 수행할 수 있는 상태임 (예: 정지된 VM -> '시작' 가능).
   - 예외: 생성, 편집 등 입력 조건이 필요한 상황에서도 버튼은 '활성화 상태'를 유지하고, 클릭 시 어떤 입력값이 충족하지 못했는지 얼럿으로 표시
     - 예외의 예외: 단계별로 진행되는 생성 화면에서는 플로팅 카드의 primary 버튼이 활성화될 경우 입력 카드의 primary 버튼과 시각적인 교란이 가능하고, 입력 사항이 많아 단계별로 입력값 체크가 필요하므로 모든 단계가 입력 완료 될 때까지 비활성화한다.

2. 비활성화 상태
   - 정의: 기능은 존재하지만 현재는 실행할 수 없음을 안내하는 상태로, 호버 시 사유를 설명하는 툴팁이 선택적으로 노출됨.
   - 적용 기준:
     1. 상태 부적합: 대상의 현재 상태 때문에 실행 불가
     2. 권한 부족: 기능은 존재하나 사용자에게 권한이 없음
     3. 선행 조건 미달: 지금은 액션이 안되지만, 종속성 문제 해결, 목록에서 아이템 선택 등 선행되는 조건을 수행하면 액션이 가능한 경우

3. 비노출 상태
   - 정의: 사용자에게 보여주는 것이 논리적으로 맞지 않거나 혼란을 주는 경우 버튼 비노출
   - 적용 기준:
     1. 상호 배타적 토글(버튼 교체): 하나의 리소스에 대해 두 개의 정반대 기능이 존재하며, 상태에 따라 둘 중 하나만 실행 가능할 때
        - 예) 볼륨에 하나의 인스턴스 연결만 가능할 때 Attach instance/Detach instance 중 하나의 버튼만 노출

### 3. 언어 원칙
- 사용자의 다음 행동을 명확하게 지시하는 간결한 단어 사용한다.
  - 영어: 동사형 사용
  - 한국어: '~하기'를 생략한 단일 명사형 사용

</details>
`;

const buttonProps: PropDef[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'muted' | 'danger' | 'warning' | 'link'",
    default: "'primary'",
    required: false,
    description: 'Button style variant',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Button size',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show loading spinner',
  },
  { name: 'leftIcon', type: 'ReactNode', required: false, description: 'Icon before text' },
  { name: 'rightIcon', type: 'ReactNode', required: false, description: 'Icon after text' },
  {
    name: 'icon',
    type: 'ReactNode',
    required: false,
    description: 'Icon-only button (requires aria-label)',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Full width button',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'as',
    type: 'ElementType',
    default: "'button'",
    required: false,
    description: 'Polymorphic element type',
  },
  { name: 'children', type: 'ReactNode', required: false, description: 'Button content' },
];

export function ButtonPage() {
  return (
    <ComponentPageTemplate
      title="Button"
      description="사용자가 시스템에 변화를 일으키는 액션을 실행하기 위한 기본 인터랙션 컴포넌트. 기능의 존재와 실행 가능 여부를 명확히 전달하며, 동일 의미의 액션은 제품 전반에서 일관된 라벨/위치/동작으로 제공한다."
      whenToUse={[
        '사용자의 행동으로 시스템 상태가 변경되는 경우 (→ Start, Edit)',
        '명확한 작업 실행 (→ Download, Run)',
        '작업 플로우 제어 (→ Next, Previous)',
        '사용자 의사 확인 (→ Confirm, Close)',
        '페이지 이동 (→ Link button)',
      ]}
      whenNotToUse={[
        '옵션 선택 (→ Radio/Select 등 사용)',
        'On/Off 설정 (→ Toggle/Switch 사용)',
        '다중 액션 (→ Context Menu 사용)',
        '정보 표시 (→ Tag/Badge 사용)',
      ]}
      preview={
        <ComponentPreview code={`<Button variant="primary" size="md">Create</Button>`}>
          <Button variant="primary" size="md">
            Create
          </Button>
        </ComponentPreview>
      }
      usage={{
        code: `import { Button } from '@/design-system';\n\n<Button variant="primary" size="md">\n  Create\n</Button>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Sizes</Label>
            <div className="flex gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </VStack>

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
                <strong>수직 정렬:</strong> 같은 행에 있는 요소는 같은 사이즈 사용 (Input md +
                Button md ✓)
              </div>
              <div>
                <strong>min-width:</strong> 버튼은 최소 너비가 설정되어 있어 짧은 텍스트도 균일한
                크기 유지 (SM: 60px, MD/LG: 80px)
              </div>
            </div>
          </VStack>

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
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-[var(--button-secondary-hover-bg)]"
                >
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
              <Button
                size="sm"
                variant="secondary"
                icon={<IconStar size={12} />}
                aria-label="Star"
              />
            </div>
            <div className="mt-4">
              <Label>Icon + Text (Action Buttons)</Label>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                Toolbar bulk action에는{' '}
                <code className="text-body-sm font-mono text-[var(--color-text-muted)]">
                  variant=&quot;muted&quot;
                </code>
                를 사용합니다. 선택 없음 시 disabled, 선택 시 enabled으로 전환됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-[var(--color-text-subtle)] w-[120px]">
                  No selection
                </span>
                <Button size="sm" variant="muted" leftIcon={<IconPlayerPlay size={12} />} disabled>
                  Start
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconPlus size={12} />} disabled>
                  Create
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconEdit size={12} />} disabled>
                  Edit
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconTrash size={12} />} disabled>
                  Delete
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-[var(--color-text-subtle)] w-[120px]">
                  With selection
                </span>
                <Button size="sm" variant="muted" leftIcon={<IconPlayerPlay size={12} />}>
                  Start
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconPlus size={12} />}>
                  Create
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconEdit size={12} />}>
                  Edit
                </Button>
                <Button size="sm" variant="muted" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
              </div>
            </div>
          </VStack>

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
                    <td className="py-2 text-[var(--color-text-muted)]">
                      모달/드로어 액션, 폼 제출
                    </td>
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
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={BUTTON_GUIDELINES} />
          <DosDonts
            doItems={[
              'Disabled를 기본으로 사용하고, 숨김은 예외로만 허용한다.',
              'Primary는 컨테이너당 1개 원칙을 지킨다.',
              '비동기 버튼은 Loading으로 중복 실행을 방지한다.',
              '파괴적 액션 버튼은 Confirm 단계를 반드시 제공한다.',
              '동일 액션의 라벨/순서/위치를 전반에서 일관되게 유지한다.',
            ]}
            dontItems={[
              '같은 의미의 액션을 다른 라벨로 혼용하지 않는다.',
              '이유 설명 없이 Disabled를 남발하지 않는다.',
              '컨테이너 내 Primary를 여러 개 두지 않는다(CTA 경쟁).',
            ]}
          />
        </VStack>
      }
      tokens={
        <>
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
        </>
      }
      apiReference={buttonProps}
      keyboardInteractions={[
        { key: 'Enter', description: 'Activates the button' },
        { key: 'Space', description: 'Activates the button' },
        { key: 'Tab', description: 'Moves focus to the next focusable element' },
      ]}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Icon-only buttons require aria-label for screen reader accessibility.</li>
          <li>
            Disabled buttons should provide context about why they are disabled (e.g., tooltip or
            helper text).
          </li>
          <li>Loading state buttons are automatically set to aria-busy=&quot;true&quot;.</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Tooltip', path: '/design/components/tooltip' },
        { label: 'Validation', path: '/design/components/form-field' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Context Menu', path: '/design/components/context-menu' },
        { label: 'Card', path: '/design/components/card' },
        { label: 'Create Page', path: '/design/patterns/wizard' },
        { label: 'UX Writing Guide', path: '/design/foundation/ux-writing' },
      ]}
    />
  );
}
