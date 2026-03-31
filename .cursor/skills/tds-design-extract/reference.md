# TDS Token System Reference

## 토큰 정의 파일 위치

| 파일                                  | 역할                                                                 |
| ------------------------------------- | -------------------------------------------------------------------- |
| `src/index.css`                       | 주 토큰 정의 (primitive + semantic + component). Light/Dark 모드     |
| `src/styles/tokens/compatibility.css` | `--color-*` → `--semantic-color-*` 별칭 매핑                         |
| `src/styles/tokens/light.css`         | 생성된 light 토큰 (`--primitive-*`, `--semantic-*`, `--component-*`) |
| `src/styles/tokens/dark.css`          | 생성된 dark 토큰 (override)                                          |

## CSS 변수 Resolve 방법

### 직접값

```css
--spacing-4: 16px;
--radius-md: 6px;
--button-height-sm: 28px;
```

→ 값이 바로 확정

### 1단계 참조

```css
--color-action-primary: var(--color-blue-600);
--color-blue-600: #2563eb;
```

→ `--color-action-primary` = `#2563eb`

### 2단계 참조 (compatibility.css 경유)

```css
/* compatibility.css */
--color-text-default: var(--semantic-color-text);
/* light.css */
--semantic-color-text: #0f172a;
```

→ `--color-text-default` = `#0f172a`

### 우선순위 (Light 모드)

1. `src/index.css`의 `:root, [data-theme='light']` 블록 (최종 결정)
2. `compatibility.css` (기본 매핑)
3. `light.css` (생성된 값)

**주의**: `index.css`가 `compatibility.css`보다 나중에 로드되므로 같은 변수를 재정의하면 `index.css`가 우선.

## Tailwind 유틸리티 클래스 → 실제값 매핑

### Typography 클래스

```
text-heading-h1 → 40px/48px, weight 600
text-heading-h2 → 32px/40px, weight 600
text-heading-h3 → 24px/32px, weight 600
text-heading-h4 → 18px/28px, weight 600
text-heading-h5 → 16px/24px, weight 600
text-heading-h6 → 14px/20px, weight 600

text-body-lg → 14px/20px, weight 400
text-body-md → 12px/18px, weight 400
text-body-sm → 11px/16px, weight 400
text-body-xs → 10px/14px, weight 400

text-label-lg → 13px/18px, weight 500
text-label-md → 12px/18px, weight 500
text-label-sm → 11px/16px, weight 500
```

### Spacing 클래스 (Tailwind 기본)

```
p-1 = 4px, p-2 = 8px, p-3 = 12px, p-4 = 16px
p-5 = 20px, p-6 = 24px, p-8 = 32px
gap-1 = 4px, gap-2 = 8px, gap-3 = 12px, gap-4 = 16px
```

## 주요 토큰 카테고리

### 색상 토큰 (Light 모드)

```css
/* Action */
--color-action-primary: #2563eb;
--color-action-primary-hover: #1d4ed8;
--color-action-primary-active: #1e40af;

/* Text */
--color-text-default: #0f172a;
--color-text-muted: #475569;
--color-text-subtle: #64748b;
--color-text-disabled: #94a3b8;
--color-text-on-primary: #ffffff;

/* Surface */
--color-surface-default: #ffffff;
--color-surface-subtle: #f8fafc;
--color-surface-muted: #f1f5f9;

/* Border */
--color-border-default: #e2e8f0;
--color-border-subtle: #f1f5f9;
--color-border-strong: #cbd5e1;
--color-border-focus: #3b82f6;

/* State */
--color-state-info: #2563eb;
--color-state-success: #22c55e;
--color-state-warning: #f97316;
--color-state-danger: #ef4444;
```

### 컴포넌트 토큰 예시 (Button)

```css
--button-height-sm: 28px;
--button-height-md: 32px;
--button-height-lg: 36px;
--button-padding-x-sm: 10px;
--button-padding-x-md: 12px;
--button-padding-x-lg: 16px;
--button-padding-y-sm: 6px;
--button-padding-y-md: 8px;
--button-padding-y-lg: 10px;
--button-gap-sm: 6px;
--button-gap-md: 6px;
--button-gap-lg: 8px;
--button-font-size-sm: 11px;
--button-font-size-md: 11px;
--button-font-size-lg: 12px;
--button-line-height-sm: 16px;
--button-line-height-md: 16px;
--button-line-height-lg: 18px;
--button-icon-size-sm: 12px;
--button-icon-size-md: 12px;
--button-icon-size-lg: 12px;
--button-radius: 6px;
```
