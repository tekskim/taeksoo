import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DrawerDemo } from '../../design-system-sections/OverlayDemos';
import { VStack, Button } from '@/design-system';
import { CreateInstanceSnapshotDrawer } from '@/components/CreateInstanceSnapshotDrawer';
import { EditInstanceDrawer } from '@/components/EditInstanceDrawer';
import { LockInstanceDrawer } from '@/components/LockInstanceDrawer';

const DRAWER_GUIDELINES = `## Overview

**Drawer**는 화면 **왼쪽**에서 **세로 전체 높이**로 슬라이드되어 열리는 **오버레이 패널**이다.
**반투명 딤(배경)** 위에 표시되며, 열린 동안 **배경 스크롤을 잠그고** 패널 안에 **포커스를 가두는** 동작(포커스 트랩)을 기본으로 한다.
**짧은 폼·리스트 선택·보조 상세** 등 **작업을 끝까지 같은 맥락에서** 처리할 때 쓴다.

---

## Composition

구조는 **기획·화면 스펙**이 정하고, **간격·타이포 토큰·스크롤바** 등 세부는 **디자인 시스템 구현**을 따른다.

\`\`\`
[딤: 전체 화면]
[패널 aside: dialog]
  [헤더: title(필수) · description(선택)]
  [본문: 스크롤 영역 — 필수]
  [푸터: 버튼 영역 — 필수]
\`\`\`

| 영역 / 슬롯 | 필수 | 기획 역할 |
| --- | --- | --- |
| **title** | 필수 | 패널 목적을 한눈에 알 수 있는 **제목** |
| **description** | 선택 | 타이틀 아래 **부가 설명** — 짧은 안내·범위 |
| **children (본문)** | 필수 | 화면 목적에 맞는 콘텐츠(아래 **본문 구성** 참고) |
| **footer** | 필수 | **하단 버튼** — Drawer를 닫거나 주요 액션을 수행(아래 **푸터 버튼** 참고) |

### 본문 (children)

- 본문에는 **Input**, **Table**, **Toggle**, **Select**, **Form field** 등 **TDS 컴포넌트를 조합**해 넣는다. **한 화면·한 Drawer**의 목적에 맞게 구성한다.

### 본문 내 테이블 (행 수)

- **기본(일반)**: 테이블 **데이터 행**은 **5개 이하**를 기준으로 한다(헤더 제외).
- **예외**: 본문에 **테이블이 하나만** 있는 등 **특수한 경우**에는 **최대 10행**까지 허용한다.
- 여러 블록(폼+표 등)이 함께 있을 때는 **기본 5행** 규칙을 우선한다.

### 푸터 (footer) 버튼

- **버튼이 1개일 때**: Drawer를 닫기 위한 **\`Close\` 버튼**으로 **통일**한다.
- **버튼이 2개 이상일 때**: **Secondary** 슬롯에는 반드시 **\`Cancel\`** 또는 **\`Close\`** 중 하나를 두어 **닫기 경로**를 포함한다. Primary는 저장·확인 등 주요 액션에 둔다.
- **정렬**: 2개 이상일 때 **Cancel/Close(secondary) 왼쪽 · Primary 오른쪽**을 기본으로 한다.

### 구조 규칙 (제품·레이아웃)

- **헤더**: \`title\`은 **필수**, \`description\`은 **선택**.
- **닫기**: **드로어 외부 딤 처리 영역 클릭 또는** 푸터의 **Close / Cancel 클릭.**
- **푸터**: 액션은 **footer** 슬롯에 둔다.
- **스크롤**: 내용이 길면 **본문만** 스크롤하고 **푸터는 하단 고정**. 스크롤바는 **오버레이** 방식으로 좌우 패딩이 흔들리지 않게 한다.
- **중첩**: **Drawer 안에서 또 다른 Drawer를 열지 않는다.**

---

## Behavior

### 열기·닫기

- **제어**: \`isOpen\` / \`onClose\`로 연다·닫는다.
- **딤 클릭**: 기본 **닫기** (\`closeOnBackdropClick\`, 기본 true).
- **스크롤 잠금**: 열린 동안 \`document.body\` **overflow hidden**으로 배경 스크롤을 막는다.

### 포커스·접근성

- **포커스 트랩**: 패널이 열리면 포커스는 **패널 내부**에 유지된다.
- **시맨틱**: \`role="dialog"\`, \`aria-modal="true"\`, 타이틀이 있으면 \`aria-labelledby\`와 제목 \`id\` 연결.
- **애니메이션**: 슬라이드·딤 페이드 **300ms** \`ease-out\` 계열(구현 기준).

### 상태 (기획 관점)

| 상태 | 설명 |
| --- | --- |
| Closed | 마운트 해제 또는 대기 — 배경 상호작용 가능 |
| Open | 패널·딤 표시, 포커스 트랩·배경 스크롤 잠금 |
| Dirty (제품 상태) | 저장 안 된 변경 — 닫기 시 **확인 Modal** |

---

## Usage Guidelines

### 너비 정책 (Grid 기반)

Column **60px**, Gutter **24px**, Margin **24px** 그리드 기준.

| 컬럼 | 너비 | 용도 |
| --- | --- | --- |
| **4 columns** | 360px | 폼 Drawer (Edit, 필드 적은 Create) |
| **8 columns** | 696px | 선택 Drawer (목록에서 리소스 선택·상세) |
| **12 columns** | 1032px | 대형 Drawer (복잡 레이아웃·멀티 패널) |

구현 **기본 width**는 **320**이나, 제품 정책상 폼·선택 용도에 맞춰 **360 / 696 / 1032**를 지정한다. **전체 뷰포트 너비에 가깝게 쓰지 않는다.**

---

## Related

| 항목 | 유형 | 비고 |
| --- | --- | --- |
| Modal | Component | 중앙·차단형 확인·짧은 결정 |
| Popover | Pattern | 트리거 옆 경량 패널 (딤 없음) |
| Form Field | Pattern | Drawer 내 폼 구성 |
| Wizard (Create Flow) | Pattern | 필드 많은 생성 플로우 |
`;

export function DrawerSectionPage() {
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);

  const sampleInstance = {
    id: 'i-29tgj234',
    name: 'web-server-01',
    description: 'Production web server',
    status: 'active',
    image: 'Ubuntu 22.04',
    flavor: 'm1.medium',
    isLocked: false,
  };

  return (
    <ComponentPageTemplate
      title="Drawer"
      description="화면 왼쪽에서 세로 전체 높이로 슬라이드되어 열리는 오버레이 패널이다. 반투명 딤(배경) 위에 표시되며, 열린 동안 배경 스크롤을 잠그고 패널 안에 포커스를 가두는 동작(포커스 트랩)을 기본으로 한다. 짧은 폼·리스트 선택·보조 상세 등 작업을 끝까지 같은 맥락에서 처리할 때 쓴다."
      whenToUse={[
        '리소스 생성/편집 등 필드 수가 제한된 짧은 폼을 메인 화면 위에 슬라이드로 열 때',
        '선택·검색이 필요한 목록(리소스 고르기)을 옆 패널로 둘 때',
        '상세·설정을 메인 콘텐츠와 나란히 보여줄 때',
        '스냅샷 생성·잠금 설정처럼 컨텍스트(대상 ID/이름) + 입력이 함께 필요할 때',
      ]}
      whenNotToUse={[
        '파괴적 확인(삭제 등)만 필요할 때 → Modal (sm 등)',
        '필드가 매우 많거나 위자드·다단계가 필요할 때 → 전용 Create 페이지 (Wizard 패턴)',
        '트리거 옆 경량 정보만 → Popover / Tooltip',
      ]}
      preview={<DrawerDemo />}
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Interactive demo</span>
            <DrawerDemo />
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With description</span>
            <Button variant="secondary" size="sm" onClick={() => setSnapshotOpen(true)}>
              Create Instance Snapshot
            </Button>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Basic</span>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              Edit Instance
            </Button>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With header box</span>
            <Button variant="secondary" size="sm" onClick={() => setLockOpen(true)}>
              Lock Setting
            </Button>
          </VStack>

          <CreateInstanceSnapshotDrawer
            isOpen={snapshotOpen}
            onClose={() => setSnapshotOpen(false)}
            instance={sampleInstance}
          />
          <EditInstanceDrawer
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            instance={sampleInstance}
          />
          <LockInstanceDrawer
            isOpen={lockOpen}
            onClose={() => setLockOpen(false)}
            instance={sampleInstance}
          />
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={DRAWER_GUIDELINES} />
          <DosDonts
            doItems={[
              '슬롯은 title·본문·footer 필수, description 선택을 지킨다.',
              '본문 테이블 행 수는 기본 5행 이하, 본문에 표가 하나뿐인 특수 경우에만 최대 10행까지 허용한다.',
              '푸터 버튼 1개는 Close, 2개 이상은 secondary에 Cancel 또는 Close를 둔다.',
              '열린 동안 배경 맥락을 기억할 수 있게 짧은 작업에 쓴다. ESC·딤으로 닫을 수 있게 한다.',
              '닫기 전 미저장 변경이 있으면 확인 Modal을 띄운다.',
            ]}
            dontItems={[
              'Drawer 안에서 두 번째 Drawer를 열지 않는다.',
              '필드 6개 이상을 한 Drawer에 우겨 넣지 않는다 → Create 페이지 / Wizard.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          width: 320px (default) · Form: 360px (4col) · Selection: 696px (8col) · Large: 1032px
          (12col) · padding-x: 24px · padding-y: 16px · scrollbar: 6px overlay · animation: 300ms
          ease-out
        </div>
      }
      relatedLinks={[
        {
          label: 'Modal',
          path: '/design/components/modal',
          description: '중앙·차단형 확인·짧은 결정',
        },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: '트리거 옆 경량 패널 (딤 없음)',
        },
        {
          label: 'Form Field',
          path: '/design/patterns/form-field',
          description: 'Drawer 내 폼 구성',
        },
        {
          label: 'Wizard (Create Flow)',
          path: '/design/patterns/wizard',
          description: '필드 많은 생성 플로우',
        },
      ]}
    />
  );
}
