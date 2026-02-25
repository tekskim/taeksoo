# TDS 테마 커스터마이징 가이드

TDS의 3-tier 토큰 아키텍처, 다크 모드 구현, 커스텀 테마 만들기, 컴포넌트별 토큰 레퍼런스를 정리합니다.

---

## 토큰 아키텍처

### 3-Tier 구조

```
┌─────────────────────────────────────────────────────┐
│  Component Tokens                                   │
│  (button, input, badge, card, modal, ...)           │
│  예: --component-button-radius: var(--semantic-...) │
├─────────────────────────────────────────────────────┤
│  Semantic Tokens                                    │
│  (primary, surface, text, border, state-*)          │
│  예: --semantic-color-primary: var(--primitive-...) │
├─────────────────────────────────────────────────────┤
│  Primitive Tokens                                   │
│  (color, spacing, fontSize, radius, ...)            │
│  예: --primitive-color-blue500: #3b82f6             │
└─────────────────────────────────────────────────────┘
```

| Tier          | 역할                                      | 변경 빈도        | 예시                                  |
| ------------- | ----------------------------------------- | ---------------- | ------------------------------------- |
| **Primitive** | 원시 값 (색상 팔레트, 간격, 폰트 크기 등) | 거의 변경 안 됨  | `--primitive-color-blue500: #3b82f6`  |
| **Semantic**  | 용도 기반 (텍스트, 배경, 테두리, 상태 등) | 테마 변경 시     | `--semantic-color-primary: #2563eb`   |
| **Component** | 컴포넌트별 (버튼, 인풋, 뱃지 등)          | 컴포넌트 수정 시 | `--component-button-radius: 0.375rem` |

### 토큰 소스 파일

```
tokens/
├── light.json    ← Light 테마 토큰 정의
└── dark.json     ← Dark 테마 토큰 정의 (semantic만 다름)
```

#### light.json 구조

```json
{
  "primitive": {
    "color": {
      "white": "#ffffff",
      "black": "#000000",
      "blueGray50": "#f8fafc",
      "blueGray100": "#f1f5f9",
      "blue500": "#3b82f6",
      "blue600": "#2563eb"
    },
    "spacing": { "0": "0", "1": "4px", "2": "8px", "4": "16px" },
    "fontSize": { "12": "0.75rem", "14": "0.875rem" },
    "lineHeight": { "18": "1.125rem", "20": "1.25rem" },
    "fontWeight": { "regular": "400", "medium": "500", "semibold": "600" },
    "fontFamily": { "sans": "Mona Sans", "mono": "Menlo" },
    "radius": { "none": "0", "sm": "4px", "md": "6px", "lg": "8px" },
    "borderWidth": { "0": "0", "1": "1px", "2": "2px" },
    "opacity": { "0": "0", "100": "1" },
    "duration": { "fast": "150ms", "normal": "200ms", "slow": "300ms" }
  },
  "semantic": {
    "color": {
      "primary": "#2563eb",
      "primaryHover": "#1d4ed8",
      "surface": "#ffffff",
      "text": "#0f172a",
      "textMuted": "#475569",
      "border": "#e2e8f0",
      "stateInfo": "#2563eb",
      "stateSuccess": "#16a34a",
      "stateDanger": "#dc2626"
    },
    "spacing": {
      "componentSm": "4px",
      "componentMd": "8px",
      "layoutMd": "24px"
    },
    "radius": {
      "field": "6px",
      "button": "6px",
      "card": "8px",
      "modal": "16px"
    }
  },
  "component": {
    "button": { "radius": "0.375rem", "smHeight": "1.75rem" },
    "input": { "radius": "0.375rem", "smHeight": "1.75rem" },
    "badge": { "radius": "0.25rem" },
    "card": { "radius": "0.5rem", "paddingMd": "1rem" },
    "modal": { "radius": "1rem", "padding": "1.5rem" },
    "checkbox": { "size": "1rem", "radius": "0.25rem" },
    "tooltip": { "radius": "0.25rem", "fontSize": "0.6875rem" },
    "statusIndicator": { "radius": "1rem" },
    "menu": { "itemRadius": "0.375rem" }
  }
}
```

#### dark.json 차이점

`primitive`는 동일, `semantic.color`만 다크 테마에 맞게 변경됩니다:

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| `primary`        | `#2563eb` | `#3b82f6` |
| `primaryHover`   | `#1d4ed8` | `#60a5fa` |
| `surface`        | `#ffffff` | `#0f172a` |
| `surfaceMuted`   | `#f8fafc` | `#1e293b` |
| `text`           | `#0f172a` | `#f8fafc` |
| `textMuted`      | `#475569` | `#94a3b8` |
| `border`         | `#e2e8f0` | `#334155` |
| `tertiary`       | `#f1f5f9` | `#334155` |
| `onTertiary`     | `#0f172a` | `#f8fafc` |
| `stateInfoBg`    | `#eff6ff` | `#1e3a8a` |
| `stateSuccessBg` | `#f0fdf4` | `#14532d` |

### 빌드 파이프라인

```
tokens/light.json ──┐
                    ├── scripts/build-tokens.js ──┬── src/styles/tokens/light.css
tokens/dark.json ───┘                            ├── src/styles/tokens/dark.css
                                                  ├── src/styles/tokens/compatibility.css
                                                  ├── src/styles/tokens/index.css
                                                  └── tailwind.preset.js
```

**실행:**

```bash
pnpm tokens          # node scripts/build-tokens.js
```

**`build-tokens.js` 처리 과정:**

1. JSON 읽기 → `flattenTokens()` 으로 중첩 객체를 평탄화
2. `toKebabCase()` 로 camelCase → kebab-case 변환
3. `generateCSS()` 로 CSS 변수 생성
4. `generateCompatibilityAliases()` 로 호환성 별칭 생성
5. `generateTailwindPreset()` 로 Tailwind 확장 생성

**이름 변환 규칙:**

```
JSON: { primitive: { color: { blueGray50: "#f8fafc" } } }
CSS:  --primitive-color-blue-gray50: #f8fafc;
```

### 출력 파일

#### `light.css`

```css
:root,
[data-theme='light'] {
  --primitive-color-white: #ffffff;
  --primitive-color-blue-gray50: #f8fafc;
  --semantic-color-primary: #2563eb;
  --semantic-color-text: #0f172a;
  --component-button-radius: 0.375rem;
  /* ... */
}
```

#### `dark.css`

```css
[data-theme='dark'] {
  --primitive-color-white: #ffffff;
  --semantic-color-primary: #3b82f6;
  --semantic-color-text: #f8fafc;
  /* ... */
}
```

#### `compatibility.css`

코드에서 사용하는 `--color-*` 별칭을 `--semantic-color-*`에 매핑합니다.

```css
:root,
[data-theme='light'],
[data-theme='dark'] {
  --color-text-default: var(--semantic-color-text);
  --color-text-muted: var(--semantic-color-text-muted);
  --color-text-subtle: var(--semantic-color-text-subtle);
  --color-action-primary: var(--semantic-color-primary);
  --color-surface-default: var(--semantic-color-surface);
  --color-surface-subtle: var(--semantic-color-surface-muted);
  --color-border-default: var(--semantic-color-border);
  --color-border-focus: var(--semantic-color-border-focus);
  --color-state-info: var(--semantic-color-state-info);
  --color-state-success: var(--semantic-color-state-success);
  --color-state-warning: var(--semantic-color-state-warning);
  --color-state-danger: var(--semantic-color-state-danger);
  /* ... */
}
```

#### `index.css`

```css
@import './light.css';
@import './dark.css';
@import './compatibility.css';

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    /* Dark 토큰 인라인 — 시스템 설정 따를 때 */
  }
}
```

#### `tailwind.preset.js`

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--semantic-color-primary)',
        'primary-hover': 'var(--semantic-color-primary-hover)',
        surface: 'var(--semantic-color-surface)',
        /* ... */
      },
      spacing: {
        /* primitive + semantic spacing */
      },
      borderRadius: {
        /* primitive + semantic radius */
      },
      fontSize: {
        /* primitive fontSize */
      },
      lineHeight: {
        /* primitive lineHeight */
      },
      fontWeight: {
        /* primitive fontWeight */
      },
      fontFamily: {
        /* primitive fontFamily */
      },
    },
  },
};
```

---

## 다크 모드 구현

### 적용 메커니즘

TDS 다크 모드는 두 가지 메커니즘이 병행됩니다:

| 메커니즘          | 선택자                                | 토큰 적용          | 담당               |
| ----------------- | ------------------------------------- | ------------------ | ------------------ |
| `data-theme` 속성 | `[data-theme="dark"]`                 | CSS 변수 전환      | 토큰 시스템        |
| `dark` 클래스     | `.dark`                               | Tailwind dark 변형 | `DarkModeProvider` |
| 시스템 설정       | `@media (prefers-color-scheme: dark)` | CSS 변수 전환      | 브라우저           |

### DarkModeProvider

```tsx
import { DarkModeProvider, useDarkMode } from '@/hooks/useDarkMode';

// App 루트에서 감싸기
<DarkModeProvider>
  <App />
</DarkModeProvider>;

// 컴포넌트에서 사용
const { theme, isDark, setTheme, toggleDarkMode } = useDarkMode();
```

**타입:**

```ts
type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  theme: Theme; // 현재 설정된 테마
  isDark: boolean; // 실제 다크 모드 여부
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void; // light ↔ dark 토글
}
```

**동작:**

1. `localStorage` 키 `'tds-theme'`에서 초기값 로드 (없으면 `'system'`)
2. `theme === 'system'` → `prefers-color-scheme` 미디어 쿼리 감시
3. `isDark` 결정 → `document.documentElement.classList.add/remove('dark')`
4. 테마 전환 시 `theme-transition` 클래스 300ms 추가 (부드러운 전환)

### DarkModeToggle

```tsx
import { DarkModeToggle, DarkModeToggleButton } from '@/components/DarkModeToggle';

// 3가지 모드 선택 (Light / Dark / System)
<DarkModeToggle size="md" showLabel />

// 간단한 토글 버튼 (Light ↔ Dark)
<DarkModeToggleButton size="md" />
```

### 테마 우선순위

```
1. [data-theme="light"] 또는 [data-theme="dark"] 명시 → 해당 테마 적용
2. data-theme 없음 + prefers-color-scheme: dark → 다크 테마 적용
3. data-theme 없음 + prefers-color-scheme: light → 라이트 테마 적용 (:root)
```

---

## 커스텀 테마 만들기

### 방법 1: CSS 변수 오버라이드 (간단)

기존 토큰을 CSS로 오버라이드합니다. 별도 빌드 불필요.

```css
/* custom-theme.css */
:root,
[data-theme='light'] {
  /* 브랜드 Primary 색상 변경 */
  --semantic-color-primary: #7c3aed; /* violet-600 */
  --semantic-color-primary-hover: #6d28d9; /* violet-700 */
  --semantic-color-primary-focus: #5b21b6; /* violet-800 */

  /* 호환성 레이어도 자동 반영됨 (var() 참조이므로) */
}

[data-theme='dark'] {
  --semantic-color-primary: #a78bfa; /* violet-400 */
  --semantic-color-primary-hover: #c4b5fd; /* violet-300 */
}
```

**적용:**

```tsx
// main.tsx 또는 App.tsx
import '@/styles/tokens/index.css';
import './custom-theme.css'; // 토큰 CSS 이후에 import
```

**오버라이드 가능한 주요 토큰:**

| 카테고리 | 토큰                             | 설명              |
| -------- | -------------------------------- | ----------------- |
| 브랜드   | `--semantic-color-primary`       | Primary 액션 색상 |
|          | `--semantic-color-primary-hover` | Primary hover     |
|          | `--semantic-color-primary-focus` | Primary focus     |
| 배경     | `--semantic-color-surface`       | 기본 배경         |
|          | `--semantic-color-surface-muted` | 약한 배경         |
| 텍스트   | `--semantic-color-text`          | 기본 텍스트       |
|          | `--semantic-color-text-muted`    | 보조 텍스트       |
| 테두리   | `--semantic-color-border`        | 기본 테두리       |
|          | `--semantic-color-border-focus`  | 포커스 테두리     |
| 상태     | `--semantic-color-state-danger`  | 에러/위험         |
|          | `--semantic-color-state-success` | 성공              |
| 컴포넌트 | `--component-button-radius`      | 버튼 radius       |
|          | `--component-input-radius`       | 인풋 radius       |
|          | `--component-card-radius`        | 카드 radius       |

### 방법 2: 토큰 JSON 수정 (완전한 커스터마이징)

토큰 소스를 직접 수정하고 빌드합니다.

```bash
# 1. 토큰 수정
vi tokens/light.json   # semantic.color.primary 등 수정
vi tokens/dark.json    # 다크 테마 수정

# 2. 빌드
pnpm tokens

# 3. 결과 확인
# src/styles/tokens/light.css, dark.css, compatibility.css 업데이트됨
# tailwind.preset.js 업데이트됨
```

### 방법 3: Tailwind Preset 확장

`tailwind.preset.js`는 자동 생성되므로 직접 수정하지 마세요. 대신 `tailwind.config.js`에서 확장합니다:

```js
// tailwind.config.js
import tdsPreset from './tailwind.preset.js';

export default {
  presets: [tdsPreset],
  theme: {
    extend: {
      colors: {
        brand: 'var(--custom-brand-color)',
      },
    },
  },
};
```

### Compatibility 레이어 주의사항

코드에서는 `--color-*` 별칭(compatibility)을 사용합니다. 이 별칭은 `var(--semantic-color-*)`를 참조하므로, semantic 토큰을 오버라이드하면 자동으로 반영됩니다.

```
--color-text-default ──→ var(--semantic-color-text) ──→ 실제 값
                                    ↑
                            여기를 오버라이드하면 됨
```

> `compatibility.css`의 별칭 자체를 오버라이드하지 마세요. 항상 `--semantic-color-*`를 오버라이드하세요.

---

## 컴포넌트별 테마 토큰 레퍼런스

각 컴포넌트가 참조하는 토큰 목록입니다. 컴포넌트 커스터마이징 시 이 토큰들을 오버라이드합니다.

### Button

```css
--component-button-radius: 0.375rem;        /* 6px */
--component-button-sm-height: 1.75rem;      /* 28px */
--component-button-md-height: 2rem;         /* 32px */
--component-button-lg-height: 2.25rem;      /* 36px */

/* 참조하는 semantic 토큰 */
--semantic-color-primary;                    /* primary variant bg */
--semantic-color-primary-hover;              /* primary variant hover */
--semantic-color-on-primary;                 /* primary variant text */
--semantic-color-secondary;                  /* secondary variant bg */
--semantic-color-tertiary;                   /* muted variant bg */
--semantic-color-state-danger;               /* danger variant bg */
```

### Input

```css
--component-input-radius: 0.375rem;          /* 6px */
--component-input-sm-height: 1.75rem;        /* 28px */
--component-input-md-height: 2rem;           /* 32px */
--component-input-lg-height: 2.5rem;         /* 40px */

/* 참조하는 semantic 토큰 */
--semantic-color-surface;                     /* 배경 */
--semantic-color-border;                      /* 기본 테두리 */
--semantic-color-border-focus;                /* 포커스 테두리 */
--semantic-color-text;                        /* 입력 텍스트 */
--semantic-color-text-subtle;                 /* placeholder */
--semantic-color-state-danger;                /* 에러 테두리 */
```

### Select

```css
/* Input과 동일한 크기/radius 토큰 사용 */
--component-input-radius;
--component-input-sm-height;
--component-input-md-height;
--component-input-lg-height;

/* 드롭다운 아이템 */
--select-item-padding-x: 10px;
--select-item-padding-y: 6px;
--select-item-font-size: 0.75rem;

/* 참조하는 semantic 토큰 */
--semantic-color-surface;                     /* 드롭다운 배경 */
--semantic-color-surface-hover;               /* 아이템 hover */
--semantic-color-primary;                     /* 선택된 아이템 체크 */
```

### Badge

```css
--component-badge-radius: 0.25rem;           /* 4px */

/* 참조하는 semantic 토큰 */
--semantic-color-state-info;                  /* info variant */
--semantic-color-state-info-bg;               /* info variant bg */
--semantic-color-state-success;               /* success variant */
--semantic-color-state-success-bg;            /* success variant bg */
--semantic-color-state-warning;               /* warning variant */
--semantic-color-state-warning-bg;            /* warning variant bg */
--semantic-color-state-danger;                /* danger variant */
--semantic-color-state-danger-bg;             /* danger variant bg */
```

### Card / SectionCard

```css
--component-card-radius: 0.5rem;             /* 8px */
--component-card-padding-md: 1rem;           /* 16px */

/* 참조하는 semantic 토큰 */
--semantic-color-surface;                     /* 카드 배경 */
--semantic-color-border;                      /* 카드 테두리 */
--semantic-color-border-subtle;               /* 내부 구분선 */
```

### Modal

```css
--component-modal-radius: 1rem;              /* 16px */
--component-modal-padding: 1.5rem;           /* 24px */

/* 참조하는 semantic 토큰 */
--semantic-color-surface;                     /* 모달 배경 */
--semantic-color-text;                        /* 모달 텍스트 */
```

### Tooltip

```css
--component-tooltip-radius: 0.25rem;         /* 4px */
--component-tooltip-font-size: 0.6875rem;    /* 11px */

/* 참조하는 semantic 토큰 */
--semantic-color-surface-tertiary;            /* 툴팁 배경 (어두운) */
--semantic-color-on-tertiary;                 /* 툴팁 텍스트 */
```

### StatusIndicator

```css
--component-status-indicator-radius: 1rem; /* pill */

/* 고유 색상 토큰 */
--semantic-color-status-indicator-active-bg: #4ade80; /* green400 */
--semantic-color-status-indicator-error-bg: #f87171; /* red400 */
--semantic-color-status-indicator-muted-bg: #64748b; /* blueGray500 */
--semantic-color-status-indicator-building-bg: #60a5fa; /* blue400 */
```

### Checkbox

```css
--component-checkbox-size: 1rem;             /* 16px */
--component-checkbox-radius: 0.25rem;        /* 4px */

/* 참조하는 semantic 토큰 */
--semantic-color-primary;                     /* 체크된 배경 */
--semantic-color-on-primary;                  /* 체크 아이콘 */
--semantic-color-border;                      /* 미체크 테두리 */
```

### Menu / ContextMenu

```css
--component-menu-item-radius: 0.375rem;      /* 6px */

/* 참조하는 semantic 토큰 */
--semantic-color-surface;                     /* 메뉴 배경 */
--semantic-color-surface-hover;               /* 아이템 hover */
--semantic-color-text;                        /* 아이템 텍스트 */
--semantic-color-state-danger;                /* danger 아이템 */
```

### Breadcrumb

```css
/* 참조하는 semantic 토큰 */
--semantic-color-text-subtle;                 /* 비활성 항목 */
--semantic-color-text;                        /* 현재 항목 */
--semantic-color-primary;                     /* 링크 hover */
```
