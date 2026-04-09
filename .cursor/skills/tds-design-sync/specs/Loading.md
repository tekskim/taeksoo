# Loading — Design Sync Spec

## 매핑

| TDS                          | thaki-shared                 | 비고                                                                        |
| ---------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `Loading` (variant=spinner)  | `LoadingSpinner`             | 구조 차이: TDS는 Tabler IconLoader2 + 텍스트 라벨, shared는 CSS border ring |
| `Loading` (variant=progress) | 없음                         | 신규 추가 필요                                                              |
| `Loading` (variant=button)   | 없음                         | Button 내부에 loading 상태 존재, 별도 추가 불필요                           |
| `SpinnerPage` (docs)         | Storybook `Feedback/Loading` | 문서 페이지                                                                 |

## TDS 컴포넌트 분석

### Loading (variant=spinner)

| 항목          | 값                                     |
| ------------- | -------------------------------------- |
| 아이콘        | `IconLoader2` (Tabler), `stroke={1.5}` |
| 아이콘 색상   | `--color-action-primary`               |
| 텍스트 색상   | `--color-text-subtle`                  |
| 텍스트 스타일 | `font-normal`, `text-center`           |
| 애니메이션    | `animate-spin`                         |

#### Spinner 사이즈

| Size | 아이콘 크기 | 텍스트                   | 간격            |
| ---- | ----------- | ------------------------ | --------------- |
| sm   | 16px        | `text-body-sm leading-4` | `gap-1.5` (6px) |
| md   | 22px        | `text-body-md leading-4` | `gap-2` (8px)   |
| lg   | 32px        | `text-body-lg leading-5` | `gap-3` (12px)  |

### Loading (variant=progress)

| 항목           | 값                                                           |
| -------------- | ------------------------------------------------------------ |
| 전체 간격      | `gap-3` (12px)                                               |
| 제목 색상      | `--color-text-default`, `font-medium text-body-lg leading-5` |
| 설명 색상      | `font-normal text-body-md leading-4 text-center`             |
| 제목-설명 간격 | `gap-2` (8px)                                                |
| 바 너비        | `w-[300px]`                                                  |
| 바 높이        | `h-1` (4px)                                                  |
| 트랙 배경      | `--color-border-subtle`, `rounded-lg`                        |
| 필 색상        | `--color-state-info`, `rounded-lg`                           |
| 필 전환        | `transition-all duration-300`                                |
| 상태 텍스트    | `text-body-md leading-4 text-[var(--color-text-subtle)]`     |

## thaki-shared 현재 상태

### LoadingSpinner

| 항목        | 값                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| 구조        | 2개 div (outer + inner border circle)                                                                               |
| 사이즈      | xs: 12px/1.5px, sm: 16px/2px, md: 24px/3px, lg: 32px/4px                                                            |
| 색상        | `.spinner-primary`, `.spinner-secondary`, `.spinner-white`                                                          |
| 토큰        | `--semantic-color-border`, `--semantic-color-primary`, `--semantic-color-textLight`, `--semantic-color-textInverse` |
| 애니메이션  | `animate-spin`                                                                                                      |
| 텍스트 라벨 | 없음                                                                                                                |

## 주요 디자인 차이

| #   | 항목                | thaki-shared                            | TDS                                    |
| --- | ------------------- | --------------------------------------- | -------------------------------------- |
| 1   | 스피너 구현         | CSS border ring (div)                   | Tabler `IconLoader2` SVG               |
| 2   | 스피너 사이즈 (sm)  | 16px / border-2                         | 16px icon                              |
| 3   | 스피너 사이즈 (md)  | 24px / border-3px                       | 22px icon                              |
| 4   | 스피너 사이즈 (lg)  | 32px / border-4                         | 32px icon                              |
| 5   | 스피너 primary 색상 | `--semantic-color-primary` (border-top) | `--color-action-primary` (아이콘 전체) |
| 6   | 텍스트 라벨         | 없음                                    | 있음 (`text` prop)                     |
| 7   | 프로그레스 바       | 없음                                    | 있음 (variant=progress)                |
| 8   | 버튼 variant        | 없음                                    | 있음 (variant=button)                  |
| 9   | xs 사이즈           | 12px                                    | 없음 (TDS는 sm/md/lg만)                |

## 싱크 전략

1. **기존 LoadingSpinner 유지**: CSS border ring 구조는 유지 (Button, Chart 등에서 사용 중)
2. **Spinner에 텍스트 라벨 추가**: TDS처럼 `text` prop 지원
3. **Loading (progress) 추가**: 신규 variant로 progress bar 추가
4. **Storybook 구성**: "Spinner" 스토리 + "Loading (Progress)" 스토리를 Loading 카테고리 하위에 배치
