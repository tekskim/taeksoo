# TDS 프로덕션 반영 가이드

이 문서는 프론트엔드 개발자가 **TDS(THAKI Design System)**를 프로덕션(thaki-ui)에 반영하기 위한 가이드입니다.

---

## 목차

1. [개요](#1-개요)
2. [사전 준비](#2-사전-준비)
3. [Cursor Rules 적용](#3-cursor-rules-적용)
4. [토큰 마이그레이션](#4-토큰-마이그레이션)
5. [컴포넌트 마이그레이션](#5-컴포넌트-마이그레이션)
6. [아이콘 통일](#6-아이콘-통일)
7. [단계별 마이그레이션 전략](#7-단계별-마이그레이션-전략)
8. [검증 방법](#8-검증-방법)
9. [FAQ](#9-faq)

---

## 1. 개요

### TDS란?

TDS는 THAKI Cloud 플랫폼의 **Single Source of Truth(SSoT)** 디자인 시스템입니다.

- **목적**: 디자인 일관성 유지, 개발 생산성 향상
- **범위**: 디자인 토큰, UI 컴포넌트, 페이지 패턴
- **기준**: tds가 기준이며, thaki-ui가 tds에 맞춰 수정됩니다

### 참조 링크

| 리소스 | URL |
|--------|-----|
| TDS 데모 | https://thakicloud.github.io/tds_ssot |
| TDS Storybook | https://thakicloud.github.io/tds_ssot/storybook |
| TDS GitHub | https://github.com/ThakiCloud/tds_ssot |
| 디자인 시스템 페이지 | `/design` |

---

## 2. 사전 준비

### 2.1 환경 요구사항

```bash
Node.js >= 22.14.0
pnpm >= 10.0.0
Tailwind CSS 3.x
```

### 2.2 TDS 저장소 클론 (참고용)

```bash
git clone https://github.com/ThakiCloud/tds_ssot.git
cd tds_ssot
pnpm install
pnpm run dev
```

### 2.3 핵심 파일 위치

| 파일 | 설명 |
|------|------|
| `tokens/light.json` | Light 모드 디자인 토큰 |
| `tokens/dark.json` | Dark 모드 디자인 토큰 |
| `src/styles/tokens/` | CSS 변수 파일 |
| `.cursor/rules/tds-design-system.mdc` | Cursor AI 규칙 파일 |

---

## 3. Cursor Rules 적용

### 3.1 Rules 파일 복사

TDS의 Cursor Rules 파일을 thaki-ui 프로젝트에 복사합니다:

```bash
# thaki-ui 프로젝트 루트에서
mkdir -p .cursor/rules
cp ~/Downloads/tds-design-system.mdc .cursor/rules/
```

또는 TDS 저장소에서 직접 복사:
```bash
cp /path/to/tds/.cursor/rules/tds-design-system.mdc .cursor/rules/
```

### 3.2 Rules 파일 활용

Rules 파일이 적용되면 Cursor AI가 다음을 자동으로 인식합니다:

- ✅ 컴포넌트 import 경로
- ✅ 디자인 토큰 값 (색상, 간격, 타이포그래피)
- ✅ 컴포넌트 사용법 및 props
- ✅ 페이지 패턴 (List, Detail, Form)
- ✅ 버튼 규칙 (variant, size, 아이콘 크기)

### 3.3 AI에게 요청하는 방법

```
// 좋은 예
"이 컴포넌트를 TDS 규칙에 맞게 수정해줘"
"Button을 TDS primary variant로 변경해줘"
"이 페이지를 TDS List Page 패턴으로 리팩토링해줘"

// 나쁜 예
"이 URL 보고 디자인 맞춰줘" (Rules 파일이 더 정확함)
```

---

## 4. 토큰 마이그레이션

### 4.1 토큰 구조 비교

| 구분 | thaki-ui (현재) | TDS (목표) |
|------|----------------|-----------|
| 단위 | `px` / `rem` 혼용 | `rem` 통일 |
| 색상 팔레트 | 15+ 색상 | 6개 핵심 색상 |
| 컴포넌트 토큰 | semantic 참조 | 직접 값 |

### 4.2 핵심 색상 매핑

```css
/* Primary (Blue) */
--semantic-color-primary: #2563eb;        /* 주요 액션 */
--semantic-color-primary-hover: #1d4ed8;

/* Text */
--semantic-color-text: #0f172a;           /* 기본 텍스트 */
--semantic-color-text-muted: #475569;     /* 보조 텍스트 */
--semantic-color-text-subtle: #64748b;    /* 약한 텍스트 */

/* Surface */
--semantic-color-surface: #ffffff;        /* 기본 배경 */
--semantic-color-surface-muted: #f8fafc;  /* 보조 배경 */

/* Border */
--semantic-color-border: #e2e8f0;         /* 기본 테두리 */

/* State */
--semantic-color-state-danger: #dc2626;   /* 에러/위험 */
--semantic-color-state-success: #16a34a;  /* 성공 */
--semantic-color-state-warning: #ea580c;  /* 경고 */
--semantic-color-state-info: #2563eb;     /* 정보 */
```

### 4.3 Spacing (rem 기준)

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
```

### 4.4 토큰 파일 적용 방법

**Option A: CSS 변수 직접 복사**

```bash
# TDS의 CSS 토큰 파일을 thaki-ui에 복사
cp tds/src/styles/tokens/light.css thaki-ui/packages/shared/src/styles/
cp tds/src/styles/tokens/dark.css thaki-ui/packages/shared/src/styles/
```

**Option B: JSON 토큰 교체**

```bash
# TDS의 JSON 토큰을 thaki-ui에 복사
cp tds/tokens/light.json thaki-ui/packages/shared/tokens/
cp tds/tokens/dark.json thaki-ui/packages/shared/tokens/

# 토큰 재빌드
pnpm run generate:tokens
```

---

## 5. 컴포넌트 마이그레이션

### 5.1 Button

**변경 전 (thaki-ui)**
```tsx
<Button variant="solid" colorScheme="primary" size="md">
  Submit
</Button>
```

**변경 후 (TDS)**
```tsx
<Button variant="primary" size="md">
  Submit
</Button>
```

**Variant 매핑**

| thaki-ui | TDS |
|----------|-----|
| `solid` + `colorScheme="primary"` | `primary` |
| `solid` + `colorScheme="secondary"` | `secondary` |
| `outline` | `outline` |
| `ghost` | `ghost` |
| `solid` + `colorScheme="error"` | `danger` |

### 5.2 Input

**변경 전**
```tsx
<Input placeholder="Enter text" variant="outline" />
```

**변경 후**
```tsx
<Input placeholder="Enter text" fullWidth />
```

### 5.3 Modal

**변경 전**
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button>Cancel</Button>
    <Button>Confirm</Button>
  </ModalFooter>
</Modal>
```

**변경 후**
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Title"
  size="sm"
>
  <div>Content</div>
  
  <div className="flex gap-2 w-full">
    <Button variant="secondary" onClick={onClose} className="flex-1">
      Cancel
    </Button>
    <Button variant="primary" onClick={onConfirm} className="flex-1">
      Confirm
    </Button>
  </div>
</Modal>
```

### 5.4 Table

**TDS Table 기본 구조**
```tsx
<Table
  columns={[
    { key: 'name', header: 'Name', width: 200 },
    { key: 'status', header: 'Status', width: 100 },
    { key: 'actions', header: '', width: 80 },
  ]}
  data={items}
  rowKey="id"
  selectable
  selectedKeys={selectedItems}
  onSelectionChange={setSelectedItems}
  emptyMessage="No items found"
/>
```

---

## 6. 아이콘 통일

### 현재 상태

| 프로젝트 | 라이브러리 |
|----------|-----------|
| TDS | `@tabler/icons-react` |
| thaki-ui | `@phosphor-icons/react` |

### 권장: Tabler Icons로 통일

**설치**
```bash
pnpm add @tabler/icons-react
pnpm remove @phosphor-icons/react
```

**변환 예시**
```tsx
// Before (Phosphor)
import { Plus, Trash, Edit } from '@phosphor-icons/react';
<Plus size={16} weight="bold" />

// After (Tabler)
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
<IconPlus size={16} stroke={1.5} />
```

**주요 아이콘 매핑**

| Phosphor | Tabler |
|----------|--------|
| `Plus` | `IconPlus` |
| `Trash` | `IconTrash` |
| `PencilSimple` | `IconEdit` |
| `MagnifyingGlass` | `IconSearch` |
| `X` | `IconX` |
| `CaretDown` | `IconChevronDown` |
| `Check` | `IconCheck` |
| `Warning` | `IconAlertTriangle` |
| `Info` | `IconInfoCircle` |

---

## 7. 단계별 마이그레이션 전략

> **Cursor AI 활용 시 대폭 단축 가능**

### Phase 1: 기반 설정 (1일)

- [ ] Cursor Rules 파일 적용
- [ ] 디자인 토큰 파일 교체
- [ ] CSS 변수 확인 및 테스트

### Phase 2: 컴포넌트 마이그레이션 (2~3일)

Cursor AI에게 요청:
```
"이 파일의 컴포넌트들을 TDS 규칙에 맞게 수정해줘"
```

- [ ] Button, Input, Select
- [ ] Modal, Drawer
- [ ] Table, FormField
- [ ] SectionCard, DetailHeader

### Phase 3: 페이지 패턴 적용 (2~3일)

Cursor AI에게 요청:
```
"이 페이지를 TDS List Page 패턴으로 리팩토링해줘"
```

- [ ] List Page 패턴 적용
- [ ] Detail Page 패턴 적용
- [ ] Form Drawer 패턴 적용

### Phase 4: 정리 및 검증 (1일)

- [ ] 아이콘 라이브러리 통일
- [ ] 시각적 비교 검증

---

**예상 총 소요 시간: 1주일 이내** (Cursor AI 활용 시)

---

## 8. 검증 방법

### 8.1 시각적 비교

TDS에 Visual Compare 스크립트가 포함되어 있습니다:

```bash
# TDS 프로젝트에서
cd tds

# TDS Storybook 실행 (포트 6006)
pnpm run storybook

# thaki-ui Storybook 실행 (포트 6007)
cd ../thaki-ui/packages/shared
pnpm run storybook -- -p 6007

# 비교 실행
cd tds
pnpm run visual-compare -- --tds http://localhost:6006 --thaki http://localhost:6007 --all

# 리포트 확인
open visual-diff-output/report.html
```

### 8.2 체크리스트

**토큰 검증**
- [ ] 색상이 TDS와 동일한가?
- [ ] 간격(spacing)이 일관적인가?
- [ ] 타이포그래피가 맞는가?
- [ ] 반경(border-radius)이 맞는가?

**컴포넌트 검증**
- [ ] Button variant/size가 맞는가?
- [ ] Input 높이/패딩이 맞는가?
- [ ] Modal 패딩/반경이 맞는가?
- [ ] Table 스타일이 맞는가?

**패턴 검증**
- [ ] List Page 구조가 맞는가?
- [ ] Detail Page 구조가 맞는가?
- [ ] Form Drawer 구조가 맞는가?

---

## 9. FAQ

### Q: tds 패키지를 직접 설치해서 사용할 수 있나요?

A: 현재 npm에 배포되지 않았습니다. GitHub에서 직접 설치하거나 코드를 참고해서 적용하세요:

```bash
# GitHub에서 직접 설치 (선택사항)
pnpm add git+https://github.com/ThakiCloud/tds_ssot.git
```

### Q: 기존 컴포넌트와 TDS 컴포넌트를 같이 쓸 수 있나요?

A: 가능하지만 권장하지 않습니다. 점진적으로 TDS 컴포넌트로 교체하세요.

### Q: 커스텀 스타일을 추가해도 되나요?

A: TDS 토큰 기반으로 추가하세요. 하드코딩된 값 대신 CSS 변수를 사용하세요:

```tsx
// 나쁜 예
<div className="text-[12px] text-[#64748b]">

// 좋은 예
<div className="text-body-md text-[var(--color-text-subtle)]">
```

### Q: Dark 모드는 어떻게 적용하나요?

A: TDS는 CSS 변수 기반이므로 자동 지원됩니다:

```tsx
// html 또는 body에 data-theme 속성 추가
<html data-theme="dark">
// 또는
<html className="dark">
```

---

## 문의

- TDS 관련 문의: [GitHub Issues](https://github.com/ThakiCloud/tds_ssot/issues)
- 디자인 시스템 문서: https://thakicloud.github.io/tds_ssot/design

---

*Last updated: 2026-02-02*
