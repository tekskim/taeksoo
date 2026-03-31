# Design Apply Reference

## thaki-shared 파일 구조

```
src/components/{Name}/
  index.ts          — barrel export
  {Name}.tsx        — 렌더 로직 (변경 금지)
  {Name}.styles.ts  — CVA variant 정의 (주 수정 대상)
  {Name}.types.ts   — props 타입 정의 (읽기 전용, 추가만 허용)
  {Name}.stories.tsx — Storybook stories (참고용)
```

## CVA (Class Variance Authority) 수정 가이드

thaki-shared의 `.styles.ts` 파일은 CVA로 variant를 정의합니다.

### 구조 예시

```typescript
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  // base classes (공통 스타일)
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      appearance: {
        solid: '',
        outline: '',
        ghost: '',
      },
      variant: {
        primary: '',
        secondary: '',
        danger: '',
      },
      size: {
        sm: 'h-control-sm px-2.5 text-11 gap-1.5',
        md: 'h-control-md px-3 text-11 gap-1.5',
        lg: 'h-control-lg px-4 text-12 gap-2',
      },
    },
    compoundVariants: [
      {
        appearance: 'solid',
        variant: 'primary',
        class: 'bg-[var(--component-button-solid-primary-bg)] ...',
      },
    ],
  }
);
```

### 수정 규칙

1. **base classes**: 공통 스타일 수정 가능
2. **variants**: 각 variant의 클래스 문자열 수정 가능
3. **compoundVariants**: 복합 조건 클래스 수정 가능
4. **새 variant 추가**: 사용자 확인 후 가능
5. **variant 삭제**: 금지

### Tailwind 클래스 변환 예시

```
TDS 스타일                          → thaki-shared 스타일
bg-[var(--color-action-primary)]    → bg-[var(--component-button-solid-primary-bg)]
h-[var(--button-height-sm)]         → h-control-sm 또는 h-[var(--semantic-control-height-sm)]
text-[length:var(--font-size-11)]   → text-11
rounded-[var(--button-radius)]      → rounded-md
duration-[var(--duration-fast)]     → duration-normal
```

## 토큰 값 수정 가이드

### tokens/light.json 수정 방법

```json
// 변경 전
{
  "semantic": {
    "color": {
      "text": "{primitive.color.trueGray900}"
    }
  }
}

// 변경 후 (값만 변경, 키 유지)
{
  "semantic": {
    "color": {
      "text": "{primitive.color.blueGray900}"
    }
  }
}
```

**주의**: 참조 대상을 변경하는 것이므로, 해당 primitive가 존재하는지 먼저 확인.

### 캐스케이드 영향 확인

토큰 값 변경 전, 해당 토큰을 참조하는 다른 토큰 확인:

```bash
cd /Users/pobae/thaki-shared
# semantic.color.text를 참조하는 다른 토큰 검색
rg "semantic\.color\.text" tokens/light.json
```

### Tailwind Preset 재생성

토큰 값 변경 후 반드시 실행:

```bash
cd /Users/pobae/thaki-shared && pnpm generate:tailwind-preset
```

## 금지 패턴

### .tsx 파일에서 절대 변경하면 안 되는 것

```typescript
// 이벤트 핸들러 변경 금지
const handleClick = () => { ... }

// state 변경 금지
const [isOpen, setIsOpen] = useState(false);

// hooks 호출 변경 금지
useEffect(() => { ... }, []);

// 조건부 렌더링 변경 금지
{isOpen && <div>...</div>}

// props destructuring 변경 금지
const { onClick, onChange, ...rest } = props;
```

### props 삭제 금지 패턴

```typescript
// ❌ 금지: 기존 props 삭제
interface ButtonProps {
  // variant: string; ← 삭제 금지
}

// ✅ 허용: deprecated 처리
interface ButtonProps {
  /** @deprecated Use `appearance` instead */
  variant?: string;
}
```
