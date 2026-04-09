# FileListCard Design Spec

> Extracted from TDS `src/design-system/components/FileListCard/FileListCard.tsx`  
> thaki-shared reference: `src/components/FileListCard/FileListCard.tsx` (별도 도메인 구현 — component-map: **TDS 고유 → shared 신규** 검토 대상이나, 저장소에는 이미 별도 API의 `FileListCard` 존재)  
> Design page: `http://localhost:5173/design/components/file-list-card` (`navigationData`: `file-list-card`)

## 싱크 범위 메모

- TDS **`FileListCard`**는 **업로드 완료 파일 메타데이터 목록(카드 스택)** UI이고, **`FileListSection`**은 라벨·업로드 버튼·에러·`FileListCard`를 묶는 **폼 필드형 패턴**이다.
- thaki-shared **`FileListCard`**는 **HTML 테이블 + 드롭존 + 파일 선택 + outline 버튼**까지 포함한 **파일 업로드/첨부 전체 플로우** 컴포넌트다. **역할·API가 동일하지 않음** — 디자인 싱크는 “토큰/타이포/아이콘 규격” 정렬 수준으로 한정하고, **구조 통합은 별도 제품 결정**이 필요하다.

---

## API 차이 (디자인 싱크 범위 밖 — 참고)

| 구분        | TDS `FileListCard`                              | TDS `FileListSection`                                                      | thaki-shared `FileListCard`                                    |
| ----------- | ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 데이터 모델 | `FileItem { id, name, tags?, description? }`    | 위 + `label`, `required`, `onUpload`, `uploadLabel`, `uploadIcon`, `error` | `FileItem { file, name, type, size }` + 파일 입력/드래그앤드롭 |
| 목록 표시   | 세로 카드 행 (flex)                             | 동일                                                                       | `<table>` (Name / Type / Size / Remove)                        |
| 업로드 UI   | `FileListSection`의 `Button`만                  | `Button` secondary sm                                                      | 드롭존 버튼 + `Button` outline sm                              |
| 삭제        | `onRemove?(id)` + ghost 아이콘 버튼             | 동일                                                                       | 행별 `button` + `CloseSmallIcon`                               |
| 빈 상태     | `emptyMessage` 문자열만 (`text-body-sm` subtle) | 동일 prop을 하위에 전달                                                    | 테이블 숨김, 드롭존/버튼 유지, `labels.empty` 등               |

**Props 기본값 (시각에 영향)**

|                          | TDS                                                          | thaki-shared                                    |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------- |
| `emptyMessage`           | `'No files'`                                                 | (labels) `'No files uploaded'` 등               |
| `FileListSection` / 루트 | `label` 기본 `'Upload Files'`, `uploadLabel` `'Choose file'` | `multiple` 기본 `true`, `disabled` 기본 `false` |

---

## Base Styles — TDS `FileListCard` (파일이 1개 이상일 때)

| Property         | Resolved                                       | TDS token / class                                                                  |
| ---------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| 외곽 배경        | `#f8fafc`                                      | `bg-[var(--color-surface-subtle)]` → `--color-surface-subtle` → slate-50           |
| 외곽 테두리      | 1px `#e2e8f0`                                  | `border-[var(--color-border-default)]`                                             |
| 외곽 radius      | **6px**                                        | `rounded-[var(--primitive-radius-md)]` (`light.css`: `--primitive-radius-md: 6px`) |
| 외곽 padding     | **12px**                                       | `p-[var(--primitive-spacing-3)]`                                                   |
| 행 간 gap        | **8px**                                        | `gap-[var(--primitive-spacing-2)]`                                                 |
| 행 카드 배경     | `#ffffff`                                      | `bg-[var(--color-surface-default)]`                                                |
| 행 카드 padding  | **16px × 8px**                                 | `px-4 py-2`                                                                        |
| 행 테두리·radius | 1px `#e2e8f0`, **6px**                         | 동일 토큰 조합                                                                     |
| 제목(파일명)     | 12px / 18px, 400, `#0f172a`                    | `text-body-md` + `text-[var(--color-text-default)]`                                |
| 보조(태그/설명)  | 11px / 16px, 400, `#64748b`                    | `text-body-sm` + `text-[var(--color-text-subtle)]`                                 |
| 태그 구분선      | 1×**10px** 세로선, `#e2e8f0`                   | `TagDivider`: `w-px h-[10px] bg-[var(--color-border-default)]`                     |
| 태그 행 gap      | **8px** (태그 사이), 이름↔태그 **4px**         | 태그 `flex gap-2`; 내부 `VStack gap={1}` → `gap-[4px]`                             |
| 삭제 버튼        | `transition-colors`                            | subtle → default 텍스트 색 호버                                                    |
| focus            | (버튼에 별도 ring 스타일 없음 — 브라우저 기본) | —                                                                                  |

### TDS 빈 상태 (`files.length === 0`)

- `emptyMessage`가 있으면: `text-body-sm` + `text-[var(--color-text-subtle)]` 단일 문단.
- `emptyMessage`가 비어 있으면: `null` (렌더 없음).

---

## Base Styles — TDS `FileListSection`

| 영역        | Resolved / 비고                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| 세로 간격   | `VStack gap={3}` → **12px**                                                                              |
| 라벨        | `text-label-lg` → **13px / 18px**, medium, `#0f172a`; required 시 `*` `#ef4444` (`--color-state-danger`) |
| 업로드 버튼 | `Button variant="secondary" size="sm"` → [Button 스펙 참고] 높이 **28px** 등                             |
| 에러 문구   | `text-body-sm` + `text-[var(--color-state-danger)]` → **#ef4444** (본문 스몰)                            |

---

## Variants / Sizes

TDS `FileListCard`는 **CVA·variant 없음** — 단일 시각 트리트먼트.

---

## Interactive States (동적)

| State       | 조건 | TDS                            | thaki-shared                                                          |
| ----------- | ---- | ------------------------------ | --------------------------------------------------------------------- |
| (파일 목록) | —    | 조건부 className 없음          | `disabled` 시 드롭존 `opacity-50 cursor-not-allowed`                  |
| 드래그 오버 | —    | 없음                           | `isDragOver` 시 배경/테두리 primary 강조 (`dropzoneActiveClassnames`) |
| 삭제        | —    | `onRemove` 있을 때만 버튼 표시 | 항상 행별 remove (테이블)                                             |

---

## CSS 구현 기법 차이

| 요소          | 시각 효과    | TDS                                                   | thaki-shared                                      | 차이 영향                                            |
| ------------- | ------------ | ----------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| 목록 레이아웃 | 파일 행 나열 | 세로 **flex**, 행마다 **독립 bordered 카드**          | **`<table>`** + `border-collapse`, 행 `border-t`  | 스크린리더/키보드 탐색·열 정렬 의미가 다름           |
| 빈 목록       | 안내 문구    | 단순 `<p>`                                            | 파일이 있을 때만 테이블 마운트                    | 빈 상태에서 테이블 헤더 없음 vs shared는 드롭존 중심 |
| 태그 구분     | 세로 구분선  | `flex` + `span.contents` + 1px 구분                   | (해당 없음 — Type/Size 컬럼)                      | 정보 밀도·UI 패턴 상이                               |
| 제거 버튼     | X 아이콘     | **Tabler `IconX` 16px**, stroke **1.5**               | **Tabler 래핑 `CloseSmallIcon` size `xs` → 12px** | 히트 영역·시각적 무게 차이                           |
| 업로드 진입   | 버튼/존      | `FileListSection`에서만 `Button` + 선택 핸들러는 부모 | 드롭존(`<button>`) + outline `Button` **두 축**   | 레이아웃·접근성 포커스 순서 다름                     |

---

## CVA Base 상속 분석

TDS·thaki-shared `FileListCard` 모두 **CVA 미사용** — 해당 없음.

---

## 아이콘 비교

| 용도                       | TDS                                                      | thaki-shared                                                                       |
| -------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 제거                       | `IconX` **16px**, stroke **1.5** (`@tabler/icons-react`) | `CloseSmallIcon` → Tabler `IconX` 래핑, **12px** (`size="xs"`), 기본 weight stroke |
| 업로드 (`FileListSection`) | 스토리 예: `IconUpload` **12px**                         | `UploadIcon` **sm=14px** / **xs=12px** (컨텍스트별)                                |

---

## Token Mapping (참조)

| TDS Token                       | TDS Resolved   | thaki-shared (대응 의미)                                                       | Match                                                         |
| ------------------------------- | -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `--color-surface-subtle`        | `#f8fafc`      | `--semantic-color-surfaceSubtle`                                               | exact (token-map)                                             |
| `--color-border-default`        | `#e2e8f0`      | `--semantic-color-border`                                                      | exact                                                         |
| `--color-surface-default`       | `#ffffff`      | `--semantic-color-surface`                                                     | exact                                                         |
| `--color-text-default`          | `#0f172a`      | `--semantic-color-text`                                                        | manual (TDS slate900 vs shared trueGray900 — token-map §주의) |
| `--color-text-subtle`           | `#64748b`      | `--semantic-color-textSubtle`                                                  | exact                                                         |
| `--color-state-danger` (텍스트) | `#ef4444`      | `--semantic-color-error` (컴포넌트에서 사용) / `--semantic-color-state-danger` | 확인 필요 (이름·참조 primitive 다를 수 있음)                  |
| `--primitive-radius-md`         | `6px`          | `rounded-base6` → 보통 **6px** 계열                                            | likely                                                        |
| `--primitive-spacing-2` / `3`   | `8px` / `12px` | spacing 유틸·`gap-2` 등과 대응                                                 | exact                                                         |

> ⚠️ shared `FileListCard`는 **파일명 셀** 등 `line-height: 1rem`(16px) 고정으로 **TDS `text-body-md`(18px line-height)** 과 어긋날 수 있음 — Apply 시 한 줄 높이·수직 정렬 확인.

---

## 주요 디자인 차이

| 항목              | 내용                                                                           | 유형                     | 영향 범위 / 마이그레이션                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 정보 구조         | TDS는 **카드 스택 + 태그/설명**; shared는 **테이블 + Type/Size 컬럼** + 드롭존 | `api-required`           | shared를 TDS처럼 쓰려면 **목록 UI 분리 또는 새 컴포넌트** 필요. 기존 앱은 **테이블·업로드 플로우 유지**하려면 prop만으로는 불충분. |
| `FileListSection` | TDS 전용 compound(라벨·필수·업로드·에러·목록)                                  | `api-required`           | shared에 동일 래퍼 없음 → 앱에서 **FormField + Button + FileListCard** 조합으로 재현 시 시각·간격을 스펙대로 맞출 것.              |
| 파일명 타이포     | TDS **12/18** (`text-body-md`); shared 셀 **12/16**                            | `style`                  | line-height 정렬 시 행 높이·baseline 변화.                                                                                         |
| 제거 아이콘       | TDS **16px**; shared **12px**                                                  | `style`                  | 터치 타겟·밸런스 — Apply 시 크기·stroke 통일 검토.                                                                                 |
| 에러 색 토큰      | TDS `--color-state-danger`; shared `--semantic-color-error`                    | `token-global` / `style` | 실제 hex 비교 후 token-map 또는 컴포넌트 토큰 정렬.                                                                                |
| 빈 상태           | TDS는 문구만; shared는 **드롭존+버튼** 유지                                    | `api-required`           | “No files” UX가 근본적으로 다름.                                                                                                   |

---

## 필수 체크리스트 요약

- **A. Props 기본값**: TDS `emptyMessage='No files'` vs shared 라벨 객체 기본값 — **다름**.
- **B. TDS 전용 패턴**: `FileListSection`, `tags` + `TagDivider` — shared에 **동일 패턴 없음**.
- **C. 글로벌 토큰**: `text` default(slate900 vs trueGray900) 불일치 시 **목록은 미세 색상 차** 가능.
- **D. 사용처**: shared `FileListCard`를 쓰는 feature 검색은 싱크 시 **별도 grep** 권장.
