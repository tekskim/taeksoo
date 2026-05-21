# TDS Page Design Sync

TDS 프로토타입 페이지의 비주얼 스펙(여백, 크기, 순서 등)을 thaki-ui dev 페이지에 반영하는 스킬입니다.
**순수 비주얼 속성만 변경**하며, 로직·상태·이벤트 등 작동에 영향을 주는 코드는 일절 건드리지 않습니다.

## 트리거

- "Create 페이지 싱크해줘", "page sync", "페이지 디자인 싱크"
- 페이지명과 함께: "CreateInstance 싱크해줘", "CreateInstance, CreateVolume 싱크해줘"
- 전체: "compute Create 페이지 전체 싱크해줘"

## 입력

- **페이지명**: 1개 또는 콤마 구분 리스트, 또는 "전체"
- 예: `"CreateInstance"` 또는 `"CreateInstance, CreateVolume"` 또는 `"전체"`

## 참조 파일

- `page-map.md`: 이 폴더 내 TDS ↔ thaki-ui 페이지 매핑
- `specs/`: 추출된 페이지별 스펙 저장 위치

## 절대 변경 금지 (Hard Rule)

이 스킬은 **비주얼 속성만** 변경합니다. 아래 항목은 어떤 상황에서도 변경하지 않습니다:

- 비즈니스 로직, 상태 관리(`useState`, `useEffect`, `useMemo` 등), 이벤트 핸들러(`onClick`, `onChange`, `onSubmit` 등)
- API 호출, 데이터 페칭, 뮤테이션
- 조건부 렌더링 로직(`if`, 삼항 연산자, `&&` 렌더링)
- 유효성 검증, 폼 제출 흐름, 에러 처리
- React Hook 호출 순서, 의존성 배열, 상태 초기값
- 컴포넌트 교체 (예: `Accordion` → `SectionCard`) — dev의 컴포넌트 체계 유지
- i18n 키, 라우팅 경로, props 인터페이스, 타입 정의
- import 구문 (비주얼 속성 변경에 필요한 경우 제외)

**변경 허용 대상:**

- `className` 내의 Tailwind 클래스 (gap, padding, margin, width, height, font-size 등)
- 컴포넌트의 `size`, `variant`, `align` 등 비주얼 props
- `style` 속성의 spacing/sizing 값
- 레이아웃 컴포넌트의 `gap`, `align`, `justify` props
- JSX 요소의 순서 변경 (비주얼 순서만, 로직 흐름에 영향 없는 경우)

---

## 동작 절차

### Phase 0: Environment Setup (환경 준비)

싱크 작업 전 TDS/thaki-ui 로컬 서버를 확인하고, 필요시 실행합니다.

#### Step 0-1: 포트 점유 확인

```bash
lsof -ti :5173   # TDS dev server
lsof -ti :20000  # thaki-ui platform
lsof -ti :20002  # thaki-ui compute
```

각 포트에 프로세스가 있으면 해당 서버는 이미 실행 중이므로 SKIP합니다.

#### Step 0-2: TDS dev 서버 (port 5173)

포트 5173이 비어있으면:

```bash
cd /Users/pobae/tds/tds && pnpm dev
```

- `block_until_ms: 0`으로 백그라운드 실행
- `localhost:5173` 패턴으로 Await하여 서버 시작 확인

#### Step 0-3: thaki-ui compute 서버 (port 20002)

포트 20002가 비어있으면:

```bash
cd /Users/pobae/thaki-ui && pnpm compute
```

- **반드시 `pnpm compute`** (STANDALONE=false) — standalone 모드는 로그인 불가
- `Rspack compiled successfully` 패턴으로 Await하여 빌드 완료 확인

#### Step 0-4: thaki-ui platform 서버 (port 20000)

포트 20000이 비어있으면:

```bash
cd /Users/pobae/thaki-ui && pnpm platform
```

- `Rspack compiled successfully` 패턴으로 Await하여 빌드 완료 확인
- platform은 `mf-manifest.json`을 통해 로컬 compute 서버(`localhost:20002/remoteEntry.js`)를 Module Federation으로 로드

#### Step 0-5: 브라우저 열기

browser MCP로 두 페이지를 순차 오픈:

1. **TDS**: `http://localhost:5173/compute/{page-route}`
2. **thaki-ui**: `http://local.thakicloud.net:20000/desktop` → compute 앱에서 해당 Create 페이지로 이동

`{page-route}`는 `page-map.md`의 TDS 경로에서 파생합니다.
예: CreateInstancePage → `/compute/instance/create`

로그인이 필요한 경우 사용자에게 수동 로그인을 요청하고 대기합니다.

#### Step 0-6: 환경 준비 완료 리포트

```
[Environment Ready]
  TDS:        http://localhost:5173              (port 5173)  -- OK
  Platform:   http://local.thakicloud.net:20000  (port 20000) -- OK
  Compute:    http://localhost:20002             (port 20002) -- OK
  Browser:    TDS 탭 + thaki-ui 탭 열림          -- OK
```

#### 에러 처리

| 상황                                      | 조치                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| 포트 충돌 (EADDRINUSE)                    | `lsof -ti :{port} \| xargs kill -9`로 정리 후 재시작         |
| `pnpm install` 필요 (module not found 등) | 해당 프로젝트에서 `pnpm install` 실행 후 재시도              |
| thaki-shared 빌드 필요                    | 사용자에게 `cd /Users/pobae/thaki-shared && pnpm build` 안내 |
| 브라우저 로그인 필요                      | 사용자에게 수동 로그인 요청, 완료 후 계속 진행               |
| 30초 내 서버 미응답                       | 터미널 로그 확인 후 사용자에게 보고                          |

---

### Phase 1: Extract (TDS 페이지 스펙 추출)

TDS 페이지(소스)의 레이아웃/비주얼 스펙을 분석하여 구조화된 스펙 문서를 생성합니다.

#### Step 1-1: 페이지 파싱

`page-map.md`에서 TDS 페이지 경로를 확인하고, 해당 `.tsx` 파일을 읽습니다.

#### Step 1-2: 스펙 추출

다음 항목을 추출합니다:

```markdown
## {PageName} Design Spec

### 1. 전체 레이아웃

- 컨텐츠 영역 padding: (예: `pt-4 px-8 pb-20`)
- 메인 컬럼 구조: (예: `HStack gap={6}`)
- 폼 컬럼: (예: `VStack gap={4} flex-1`)
- 사이드바: (예: `w-[var(--wizard-summary-width)] sticky top-4`)
- 최소 너비: (예: `min-w-[1176px]`)

### 2. 헤더/브레드크럼

- 브레드크럼 항목: (예: `Instances > Create Instance`)
- 타이틀 텍스트 토큰: (예: `text-heading-h5`)
- 타이틀 행 높이: (예: `h-8`)

### 3. 섹션 구조

- 섹션 수: N개
- 섹션별:
  | # | 섹션 제목 | 컴포넌트 | 내부 gap | padding | divider |
  |---|----------|---------|---------|---------|---------|
  | 1 | Basic Info | SectionCard | gap-4 | py-6 | 1px solid |
  | 2 | Source | SectionCard | gap-4 | py-6 | 1px solid |

### 4. 폼 필드 배치

- 기본 배치: (예: 단일 컬럼, fullWidth)
- 그리드 배치: (예: `grid-cols-[1fr_1fr_20px]` for tags)
- FormField 간 gap: (예: VStack gap={4})
- FormField label 토큰: (예: text-label-sm)

### 5. 버튼

- 섹션 내 Next 버튼: (예: `HStack justify="end" pt-3`, Button variant="primary")
- 사이드바 버튼 영역:
  - 레이아웃: (예: `HStack gap={2}`)
  - Cancel: (예: variant="secondary" size="md")
  - Create: (예: variant="primary" size="md" flex-1)

### 6. 사이드바 상세

- WizardSummary 유무: Y/N
- Quota 카드 유무: Y/N
- 카드 내부 padding: (예: p-4)
- 카드 내부 gap: (예: gap-6)
```

#### Step 1-3: 스펙 저장

추출 결과를 `specs/{PageName}.md`에 저장합니다.

---

### Phase 2: Map (매핑 대조)

TDS 스펙과 thaki-ui 현재 상태를 대조하여 변경이 필요한 항목을 식별합니다.

#### Step 2-1: thaki-ui 페이지 분석

`page-map.md`에서 대응하는 thaki-ui 페이지 경로를 확인하고, 동일한 스펙 항목을 추출합니다.

#### Step 2-2: 대조 리포트 생성

```markdown
## {PageName} 대조 리포트

### 변경 필요 항목

| #   | 항목               | TDS (목표) | thaki-ui (현재) | 파일                   | 변경 유형      |
| --- | ------------------ | ---------- | --------------- | ---------------------- | -------------- |
| 1   | 사이드바 버튼 size | md         | sm              | InstanceCreatePage.tsx | props 변경     |
| 2   | 섹션 간 gap        | gap-4      | gap-3           | InstanceCreatePage.tsx | className 변경 |

### 일치 항목 (변경 불필요)

| #   | 항목                | 값             |
| --- | ------------------- | -------------- |
| 1   | 전체 레이아웃 2컬럼 | HStack gap={6} |
```

#### Step 2-3: 사용자 확인

대조 리포트를 사용자에게 보여주고 승인을 받습니다.

- **"승인"**: Phase 3으로 진행
- **"일부 제외"**: 제외 항목 지정 후 진행
- **"취소"**: 해당 페이지 SKIP

---

### Phase 3: Apply (적용)

승인된 변경 사항을 thaki-ui 페이지에 적용합니다.

#### Step 3-1: 변경 적용

대조 리포트의 "변경 필요 항목"을 순서대로 적용합니다.

**적용 순서:**

1. className 내 spacing/sizing 값 변경
2. 컴포넌트 비주얼 props 변경 (size, variant 등)
3. 레이아웃 props 변경 (gap, align 등)

#### Step 3-2: 변경 검증

적용 후 즉시 확인:

```bash
# 변경된 파일에서 로직 변경이 없는지 확인
git diff -- {changed_file} | grep -E '(useState|useEffect|onClick|onChange|onSubmit|fetch|mutation|api)'
```

로직 관련 키워드가 diff에 포함되면 **즉시 롤백**하고 사용자에게 알립니다.

---

### Phase 4: Verify (검증)

#### Step 4-1: 빌드 검증

```bash
cd /path/to/thaki-ui
pnpm --filter @thaki/compute build
npx tsc --noEmit
```

빌드 실패 시:

1. 해당 페이지 변경 롤백: `git checkout -- {files}`
2. 사용자에게 실패 원인 보고
3. 나머지 페이지는 계속 진행

#### Step 4-2: 시각적 확인 (선택)

사용자가 요청하면 browser MCP로 TDS vs thaki-ui 스크린샷을 비교합니다.
Phase 0에서 환경이 준비된 상태여야 합니다.

**비교 방법:**

1. browser MCP로 TDS 페이지(`localhost:5173/compute/{route}`) 스크린샷 캡처
2. browser MCP로 thaki-ui 페이지(`local.thakicloud.net:20000/desktop` 내 compute) 스크린샷 캡처
3. 레이아웃, 여백, 버튼 크기 등 비주얼 스펙이 일치하는지 확인
4. compute 코드 변경 시 HMR로 즉시 반영됨 (새로고침 필요할 수 있음)

#### Step 4-3: 결과 리포트

```markdown
## Page Sync Report

### 처리 결과

| #   | 페이지         | Extract | Map | Apply | Build | 최종 |
| --- | -------------- | ------- | --- | ----- | ----- | ---- |
| 1   | CreateInstance | ✅      | ✅  | ✅    | ✅    | ✅   |
| 2   | CreateVolume   | ✅      | ✅  | ✅    | ❌    | 롤백 |

### 변경 파일 목록

- `packages/compute/src/features/compute/ui/pages/InstanceCreatePage.tsx`
- ...

### SKIP/롤백 페이지

- CreateVolume — 빌드 실패 (원인: ...)
```

---

## 실행 모드

| 모드 | 입력 예시                               | 동작                             |
| ---- | --------------------------------------- | -------------------------------- |
| 단일 | "CreateInstance 싱크해줘"               | 1개 페이지만 Phase 1-4           |
| 선택 | "CreateInstance, CreateVolume 싱크해줘" | 지정 페이지만 순차 처리          |
| 전체 | "compute Create 전체 싱크해줘"          | page-map.md의 7개 전부 순차 처리 |

전체/선택 모드에서도 **순차 처리**합니다 (페이지 간 파일 충돌 가능성은 낮지만, 빌드 검증을 페이지별로 하기 위함).

---

## 에러 처리: 페이지 단위 격리

개별 페이지 실패가 전체 배치를 중단하지 않습니다:

| Phase           | 실패 시                 | 조치                                   |
| --------------- | ----------------------- | -------------------------------------- |
| Phase 1 Extract | TDS 파일 없음/파싱 오류 | 해당 페이지 SKIP, 나머지 진행          |
| Phase 2 Map     | thaki-ui 파일 없음      | 해당 페이지 SKIP, 나머지 진행          |
| Phase 3 Apply   | 파일 편집 실패          | `git checkout -- {files}`로 롤백, SKIP |
| Phase 4 Verify  | 빌드 실패               | 해당 페이지 롤백, 나머지 유지          |
| Phase 3 Apply   | 로직 변경 감지          | **즉시 롤백**, 사용자 경고, SKIP       |

---

## 진행 상황 표시

```
[Phase 1] Extract: 3/7 완료
  ✅ CreateInstance — 섹션 7개, 스펙 추출 완료
  ✅ CreateImage — 섹션 4개, 스펙 추출 완료
  ✅ CreateVolume — 섹션 3개, 스펙 추출 완료
  ⏳ CreateNetwork ...

[Phase 2] Map: 대조 리포트 준비 완료 — 확인해주세요
(대조 리포트 표시)

→ 사용자 확인 후

[Phase 3] Apply: 3/3 적용 완료
[Phase 4] Verify: Build ✅ PASS

[완료] 3/7 PASS — 변경 내용을 확인해주세요
```
