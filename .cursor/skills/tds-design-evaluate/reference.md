# Design Evaluate Reference

## Storybook 접근 정보

| 대상         | URL                                    | 비고                           |
| ------------ | -------------------------------------- | ------------------------------ |
| TDS          | `http://localhost:5173` 또는 배포 docs | 디자인 시스템 페이지 `/design` |
| thaki-shared | `http://localhost:6006`                | Storybook                      |

## Storybook Story URL 패턴

thaki-shared Storybook의 Story URL:

```
http://localhost:6006/?path=/story/{folder}--{component}--{story}
```

예시:

```
http://localhost:6006/?path=/story/components-button--default
http://localhost:6006/?path=/story/components-badge--variants
http://localhost:6006/?path=/story/components-input--sizes
```

iframe 직접 접근 (스크린샷 캡처용):

```
http://localhost:6006/iframe.html?id=components-button--default
```

## git diff 분석 가이드

### 변경 파일 범위 확인

```bash
cd /Users/pobae/thaki-shared
git diff --name-only
```

### 허용 파일 패턴

```
src/components/{Name}/{Name}.styles.ts  ✅
tokens/light.json                       ✅ (값만)
tokens/dark.json                        ✅ (값만)
tailwind.preset.js                      ✅ (자동 생성)
```

### 금지 파일 패턴

```
src/components/{Name}/{Name}.tsx        ❌ (로직)
src/components/{Name}/{Name}.types.ts   ❌ (props 삭제)
src/components/{Name}/index.ts          ❌ (export 구조)
```

### 토큰 키 변경 감지

```bash
# light.json의 키 변경 감지
cd /Users/pobae/thaki-shared
git diff tokens/light.json | grep '^[-+]' | grep -v '[-+][-+][-+]' | grep '"[^"]*":'
```

키 변경 패턴:

```diff
# ❌ 키 변경 (금지)
- "text": "{primitive.color.trueGray900}"
+ "textDefault": "{primitive.color.blueGray900}"

# ✅ 값만 변경 (허용)
- "text": "{primitive.color.trueGray900}"
+ "text": "{primitive.color.blueGray900}"
```

## 시각적 비교 포인트

컴포넌트별 비교해야 할 주요 variant/state 조합:

### Button

- variant: primary, secondary, danger, ghost, outline
- size: sm, md, lg
- state: default, hover, disabled
- with icon: leftIcon, rightIcon, iconOnly

### Input

- size: sm, md, lg
- state: default, focus, error, disabled
- with label, helperText

### Badge

- variant: info, success, warning, danger
- size: sm, md

### 일반 규칙

- 모든 variant 조합의 default 상태
- hover 상태 (color 변화 확인)
- disabled 상태
- focus 상태 (ring/outline 확인)
- size 차이 (height, padding, font-size)

## Canvas 비교 화면 가이드

Canvas에 양쪽 스크린샷을 나란히 배치할 때:

1. **제목**: "{ComponentName} Design Comparison"
2. **왼쪽**: TDS 스크린샷 (라벨: "TDS (Target)")
3. **오른쪽**: thaki-shared 스크린샷 (라벨: "thaki-shared (Current)")
4. **차이점 하이라이트**: 빨간 테두리로 차이 영역 표시
5. **텍스트 설명**: 각 차이점에 대한 간략한 설명
