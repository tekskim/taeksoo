# thaki-ui 프로덕션 코드베이스 분석

> **분석 기준일**: 2026-03-11
> **소스**: `ThakiCloud/thaki-ui` (private repo, `develop` branch)
> **관련 문서**: [COMPONENT_API_COMPARISON.md](./COMPONENT_API_COMPARISON.md)

---

## 1. 레포지토리 개요

| 항목              | 값                                                        |
| ----------------- | --------------------------------------------------------- |
| **이름**          | `@thaki/root`                                             |
| **설명**          | Thaki Cloud Platform and Suite web application repository |
| **언어**          | TypeScript                                                |
| **패키지 매니저** | pnpm 10.8.1                                               |
| **Node 버전**     | ~22.17.0                                                  |
| **빌드 도구**     | Rspack                                                    |
| **스타일링**      | TailwindCSS 3.x + PostCSS                                 |
| **상태 관리**     | Zustand + React Context + useReducer                      |
| **데이터 페칭**   | TanStack React Query (v5)                                 |
| **라우팅**        | TanStack React Router                                     |
| **폼 관리**       | React Hook Form + Zod                                     |
| **i18n**          | i18next + react-i18next                                   |
| **테스트**        | Vitest + Playwright (E2E)                                 |

---

## 2. 모노레포 구조

```
thaki-ui/
├── packages/
│   ├── platform/          # 호스트 셸 (데스크톱 환경)
│   ├── compute/           # Compute + Network + Storage(Volume)
│   ├── container/         # Kubernetes 리소스 관리
│   ├── iam/               # 사용자/역할/정책
│   ├── storage/           # Object/Block Storage
│   ├── user-settings/     # 사용자 설정
│   ├── user-guide/        # 사용자 가이드
│   └── module-federation/ # MF 런타임 유틸리티
├── docs/
│   ├── architecture/      # 아키텍처 문서
│   ├── codex/
│   ├── guides/
│   └── research/
├── locales/               # 공통 i18n 리소스
├── scripts/               # 빌드/배포/유틸 스크립트
└── pnpm-workspace.yaml
```

### 워크스페이스 설정

```yaml
packages:
  - packages/*
  - '!packages/shared' # @thaki/shared는 외부 npm 패키지로 관리
```

`@thaki/shared`는 모노레포 내 로컬 패키지가 아니라, **GitHub Packages에 퍼블리시된 외부 npm 패키지**(`npm:@ThakiCloud/shared@^1.3.1`)로 참조됩니다.

---

## 3. 패키지별 역할과 의존성

### 3.1 @thaki/platform (호스트 셸)

데스크톱 환경의 **호스트 애플리케이션**. 윈도우 관리, 앱 런처, Module Federation 런타임을 담당합니다.

| 항목            | 내용                                                                        |
| --------------- | --------------------------------------------------------------------------- |
| **역할**        | 데스크톱 셸 — 윈도우 생성/관리, 리모트 앱 로딩, 앱 간 통신                  |
| **주요 기능**   | 앱 레지스트리, 윈도우 매니저, RemoteLoader, 브리지 시스템                   |
| **주요 의존성** | `@module-federation/runtime`, `react-rnd` (드래그/리사이즈), `qrcode.react` |

**내부 구조:**

```
platform/src/
├── App.tsx
├── api/
├── bootstrap.tsx
├── components/
├── features/
│   └── desktop/           # 데스크톱 윈도우 관리
│       ├── ui/pages/      # DesktopPage
│       ├── ui/components/ # DesktopWindow
│       └── services/      # windowStore, tabSessionUtils
├── pages/
├── routes/
├── services/
├── setupModuleFederationRuntime.ts
└── styles/
```

### 3.2 @thaki/compute (Compute + Network)

Compute, Network 도메인의 리소스 관리를 담당하는 리모트 앱.

| 항목            | 내용                                                       |
| --------------- | ---------------------------------------------------------- |
| **역할**        | 인스턴스, 볼륨, 네트워크 등 Compute/Network 리소스 CRUD    |
| **API 베이스**  | `/v1/compute`, `/v1/network`                               |
| **주요 의존성** | `echarts`, `recharts`, `d3`, `reactflow` (토폴로지 시각화) |

**API 커버리지 (Compute 도메인):**

| 리소스             | Query                                 | Mutation                                          |
| ------------------ | ------------------------------------- | ------------------------------------------------- |
| Instances          | List, Detail, ActionLogs, ConsoleLogs | Create, Bulk, Update, Delete, Action, BatchAction |
| Flavors            | List, Detail                          | -                                                 |
| Images             | List, Detail                          | Create, Delete, BatchAction                       |
| Instance Snapshots | List, Detail                          | Create, Update, Delete, BatchAction               |
| Key Pairs          | List, Detail, Quota                   | Create, Delete, BatchAction                       |
| Server Groups      | List, Detail                          | Create, Delete, BatchAction                       |
| Instance Templates | List, Detail                          | Create, Update, Delete, BatchAction               |

### 3.3 @thaki/container (Kubernetes)

Kubernetes 리소스 관리를 담당하는 리모트 앱.

| 항목            | 내용                                                          |
| --------------- | ------------------------------------------------------------- |
| **역할**        | Pod, Deployment, Service, Namespace 등 K8s 리소스 관리        |
| **주요 의존성** | `@monaco-editor/react` (YAML 편집), `xterm` (터미널), `jszip` |
| **특이 사항**   | WebSocket 기반 터미널(exec), YAML 편집기 내장                 |

### 3.4 @thaki/iam (Identity & Access Management)

사용자, 역할, 정책 관리를 담당하는 리모트 앱.

| 항목            | 내용                                              |
| --------------- | ------------------------------------------------- |
| **역할**        | 사용자 관리, 역할/정책 CRUD, 세션/MFA/로그인 정책 |
| **주요 의존성** | `recharts` (대시보드 차트)                        |

### 3.5 @thaki/storage (Block/Object Storage)

스토리지 관리를 담당하는 리모트 앱.

| 항목                | 내용                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| **역할**            | Object Storage(Bucket), Block Storage, 클러스터/풀/OSD 관리                |
| **주요 의존성**     | `echarts`, `react-hook-form` + `zod`                                       |
| **User/Admin 분리** | 단일 앱 내에서 Admin 모드 분기 (Dashboard + Buckets = User / 전체 = Admin) |

### 3.6 @thaki/module-federation (MF 유틸리티)

Module Federation 런타임 유틸리티 패키지.

| 항목       | 내용                                               |
| ---------- | -------------------------------------------------- |
| **역할**   | RemoteLoader, WindowControlBridge, AppLaunchBridge |
| **배포**   | GitHub Packages (`@thaki/module-federation`)       |
| **의존성** | `@module-federation/runtime`, `@thaki/shared`      |

---

## 4. @thaki/shared — 공유 UI 라이브러리

모든 패키지가 공통으로 사용하는 UI 컴포넌트 라이브러리입니다.

### 4.1 배포 정보

| 항목           | 값                                                  |
| -------------- | --------------------------------------------------- |
| **패키지명**   | `@ThakiCloud/shared`                                |
| **레지스트리** | GitHub Packages (npm)                               |
| **현재 버전**  | `^1.3.1`                                            |
| **참조 방식**  | `"@thaki/shared": "npm:@ThakiCloud/shared@^1.3.1"`  |
| **관리 방식**  | 모노레포 외부, 별도 레포(또는 별도 빌드)로 퍼블리시 |

### 4.2 확인된 컴포넌트 (18개)

`COMPONENT_API_COMPARISON.md`에서 TDS와 비교 분석된 컴포넌트 목록:

| #   | 컴포넌트                     | 패턴                                                                 | 특이 사항                                                  |
| --- | ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | **Input**                    | 단일 컴포넌트                                                        | `filter`, `showPasswordToggle` 제공                        |
| 2   | **Textarea**                 | 별도 컴포넌트                                                        | `resize`, `autoResize`, `showCharacterCount`               |
| 3   | **Dropdown**                 | Compound (`Dropdown.Select`, `Dropdown.ComboBox`, `Dropdown.Option`) | Children 패턴                                              |
| 4   | **RadioButton / RadioGroup** | `RadioGroup` + `RadioButton`                                         | `options` 배열 + `renderOption` 커스텀                     |
| 5   | **Tooltip**                  | 단일 컴포넌트                                                        | `visibile` (외부 제어), `focusable`                        |
| 6   | **Toast**                    | 단일 컴포넌트                                                        | `positive/negative` 타입, `resourceName`                   |
| 7   | **Pagination**               | 단일 컴포넌트                                                        | `totalCount` + `size` → 자동 계산                          |
| 8   | **Breadcrumb**               | 단일 컴포넌트                                                        | `path` (vs TDS `href`), `isLoading`                        |
| 9   | **ProgressBar**              | 단일 컴포넌트                                                        | `variant` (success/error/warning), `showValue` 형식 선택   |
| 10  | **StatusIndicator**          | 단일 컴포넌트                                                        | 16개 variant + `colorScheme` + `customIcon`                |
| 11  | **Toggle**                   | 단일 컴포넌트                                                        | `checkedLabel` / `uncheckedLabel`                          |
| 12  | **Disclosure**               | 단일 컴포넌트                                                        | `disabled`, `keepMounted`, `width`                         |
| 13  | **FormField**                | 단일 (children에 props 자동 주입)                                    | `label`, `hint`, `error`(string), `success`, `description` |
| 14  | **ContextMenu**              | Compound (`ContextMenu.Root`, `ContextMenu.Item`)                    | Children 패턴                                              |
| 15  | **DatePicker**               | 단일 컴포넌트                                                        | `onApply`/`onCancel` 패턴, `numberOfMonths`                |
| 16  | **FloatingCard**             | 단일 컴포넌트                                                        | 섹션 접기/펼치기 제어                                      |
| 17  | **InlineMessage**            | 단일 컴포넌트                                                        | `closable`, `expandable`                                   |
| 18  | **MonitoringToolbar**        | 단일 컴포넌트                                                        | 시간 범위 + 커스텀 기간 선택                               |

### 4.3 추가 확인된 공유 요소

| 항목                     | 역할                                              |
| ------------------------ | ------------------------------------------------- |
| **AppLayout**            | Compute 등 각 앱의 공통 레이아웃 셸               |
| **TabBar / TabProvider** | 가상 탭 라우팅 시스템 (브라우저 라우터 대신 사용) |
| **AuthProvider**         | 인증 Context (토큰 관리, 자동 갱신)               |
| **ThemeContext**         | 테마 전환 (light/dark)                            |
| **i18n 유틸**            | 다국어 지원 유틸리티                              |
| **API Client**           | Axios 기반 공통 HTTP 클라이언트                   |

---

## 5. 마이크로 프론트엔드 아키텍처

### 5.1 Module Federation 구조

```
┌──────────────────────────────────────────────┐
│  @thaki/platform (Host)                      │
│  ┌─────────────────────────────────────────┐ │
│  │ Desktop Shell                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌───────┐ │ │
│  │  │ Window 1 │  │ Window 2 │  │  ...  │ │ │
│  │  │ Compute  │  │   IAM    │  │       │ │ │
│  │  └──────────┘  └──────────┘  └───────┘ │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
         ▲               ▲              ▲
         │               │              │
    RemoteLoader    RemoteLoader    RemoteLoader
         │               │              │
    ┌────┴────┐    ┌─────┴────┐   ┌────┴─────┐
    │ Compute │    │   IAM    │   │ Storage  │
    │ Remote  │    │  Remote  │   │  Remote  │
    └─────────┘    └──────────┘   └──────────┘
```

- **Host**: `@thaki/platform` — 앱 레지스트리에서 리모트 URL 로딩
- **Remote**: 각 패키지가 `RemoteApp.tsx`에서 `mount`/`unmount` export
- **공유**: `@thaki/shared` + `@thaki/module-federation`을 모든 앱이 공유

### 5.2 앱 간 통신 — 브리지 시스템

#### WindowControlBridge

리모트 앱 → 호스트: 윈도우 제어 요청 (최소화/최대화/닫기)

```
[Remote App] → WindowControlBridge.emit('minimize') → [Host: windowStore]
```

#### AppLaunchBridge

리모트 앱 → 호스트: 다른 앱 열기 요청

```typescript
// Compute 앱에서 IAM 앱 열기
launchApp({
  appId: 'suite_iam',
  path: '/iam/roles?projectId=...&roleName=Admin&autoOpen=true',
  openInNewWindow: true,
});
```

호스트가 이벤트를 수신 → 새 윈도우 생성 → 해당 앱 로딩 + `initialPath` 전달

### 5.3 가상 탭 라우팅

각 리모트 앱은 **브라우저 URL 라우터를 사용하지 않고**, 자체 가상 탭 라우팅 시스템을 사용합니다.

```
레이아웃 래퍼
├── ComputeAppHeaderTab (탭 바)
├── ComputeSidebar (네비게이션)
└── Content Area (가상 라우트 페이지)
```

**TabState 구조:**

```typescript
interface TabInfo {
  id: string;
  title: string;
  virtualPath: string;
  componentName: TComponentName;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
}
```

---

## 6. 전역 상태 관리

### 6.1 상태 레이어 구조

| 레이어                  | 도구           | 스코프         | 용도                                   |
| ----------------------- | -------------- | -------------- | -------------------------------------- |
| **FrameContext**        | React Context  | 프레임         | `frameId`, 드래그 핸들                 |
| **ProjectStore**        | Zustand        | 앱 전체        | 활성 탭, 프로젝트-탭 매핑, 리프레시 키 |
| **TabState**            | useReducer     | 앱 전체        | 탭 목록, 탭 히스토리 스택              |
| **ThemeContext**        | React Context  | 앱 전체        | 테마 전환                              |
| **AuthContext**         | React Context  | 앱 전체        | 사용자 데이터, 로딩/에러               |
| **NotificationHistory** | Zustand        | 앱 전체        | 알림 이력                              |
| **서버 상태**           | TanStack Query | 쿼리 키 스코프 | API 데이터 캐시                        |

### 6.2 데이터 페칭 전략

| 패턴                 | staleTime | refetchOnMount | refetchInterval | 용도          |
| -------------------- | --------- | -------------- | --------------- | ------------- |
| `LIST_QUERY_OPTIONS` | `0`       | `always`       | varies          | 리스트 페이지 |
| `keepPreviousData`   | -         | -              | -               | 페이지네이션  |
| Detail               | default   | default        | 10s             | 상세 페이지   |
| Static               | 5min+     | default        | -               | 설정, 쿼타    |

**캐시 무효화 전략:**

- Mutation 후 `refetchType: 'all'`로 모든 탭에서 무효화
- Predicate 기반으로 특정 URL 패턴의 쿼리만 타겟팅
- 탭 스코프 쿼리는 `activeTabId`를 쿼리 키에 포함

---

## 7. 라우트 구조

### Compute App 라우트 맵

| 도메인      | 라우트                                                                      | 비고                     |
| ----------- | --------------------------------------------------------------------------- | ------------------------ |
| **Compute** | `/instances`, `/instances/create`, `/instances/:id`                         |                          |
|             | `/console/:id`                                                              | 별도 패널                |
|             | `/instance-template`, `/instance-template/create`, `/instance-template/:id` |                          |
|             | `/instance-snapshots`, `/instance-snapshots/:id`                            |                          |
|             | `/images`, `/images/create`, `/images/:id`                                  |                          |
|             | `/flavors`, `/flavors/:id`                                                  |                          |
|             | `/key-pairs`, `/key-pairs/:id`                                              |                          |
|             | `/server-groups`, `/server-groups/:id`                                      |                          |
| **Network** | `/networks`, `/networks/create`, `/networks/:id`                            |                          |
|             | `/networks/:networkId/subnets/:id`                                          | 중첩 라우트              |
|             | `/routers`, `/routers/:id`                                                  |                          |
|             | `/ports`, `/ports/create`, `/ports/:id`                                     |                          |
|             | `/floating-ips`, `/floating-ips/:id`                                        |                          |
|             | `/security-groups`, `/security-groups/create`, `/security-groups/:id`       |                          |
|             | `/certificates`, `/certificates/:id`                                        |                          |
|             | `/topology`                                                                 | 네트워크 토폴로지 시각화 |
|             | `/load-balancers`, `/load-balancers/create`                                 |                          |
| **공통**    | `/dashboard`                                                                | 사용자 대시보드          |
|             | `/admin-dashboard`                                                          | 관리자 대시보드          |

### 인증 모델

- **Standalone**: `access_token` in localStorage → 없으면 `StandaloneLoginModal`
- **Embedded (Platform)**: `AuthProvider`가 외부에서 처리
- 401/403 → 자동 로그아웃 + 세션 만료 디스패치

---

## 8. 기술 스택 상세

### 8.1 공통 의존성 (pnpm catalog)

| 카테고리   | 패키지                     | 버전      |
| ---------- | -------------------------- | --------- |
| **코어**   | React                      | 19.1.2    |
|            | React DOM                  | 19.1.2    |
|            | TypeScript                 | ~5.9.0    |
| **빌드**   | Rspack (CLI + Core)        | ^1.3.10   |
| **라우팅** | @tanstack/react-router     | ^1.120.11 |
| **데이터** | @tanstack/react-query      | ^5.77.2   |
|            | Axios                      | ^1.13.5   |
| **상태**   | Zustand                    | ^5.0.5    |
| **폼**     | React Hook Form            | ^7.62.0   |
|            | @hookform/resolvers        | ^5.2.1    |
|            | Zod                        | ^4.1.5    |
| **스타일** | TailwindCSS                | ^3.4.17   |
|            | PostCSS                    | ^8.5.3    |
|            | Autoprefixer               | ^10.4.21  |
| **i18n**   | i18next                    | ^25.2.1   |
|            | react-i18next              | ^15.5.3   |
| **MF**     | @module-federation/runtime | ^0.18.0   |
| **아이콘** | @tabler/icons-react        | ^3.31.0   |
| **차트**   | Recharts                   | ^3.4.1    |
| **알림**   | Sonner                     | ^2.0.5    |

### 8.2 패키지별 고유 의존성

| 패키지        | 고유 의존성                  | 용도                   |
| ------------- | ---------------------------- | ---------------------- |
| **platform**  | `react-rnd`                  | 윈도우 드래그/리사이즈 |
|               | `qrcode.react`               | QR 코드 생성           |
| **compute**   | `echarts`, `d3`, `reactflow` | 차트, 토폴로지 시각화  |
| **container** | `@monaco-editor/react`       | YAML 편집기            |
|               | `xterm` + addons             | 웹 터미널              |
|               | `jszip`                      | ZIP 파일 처리          |
| **storage**   | `echarts`                    | 모니터링 차트          |

---

## 9. 배포 구조

### 빌드 스크립트

```bash
# 개별 앱 빌드
pnpm build:compute      # Compute 리모트 앱
pnpm build:container     # Container 리모트 앱
pnpm build:iam           # IAM 리모트 앱
pnpm build:storage       # Storage 리모트 앱
pnpm build:platform      # Platform 호스트 앱
pnpm build:all           # = build:platform (호스트가 모든 리모트 포함)
```

### 배포 파이프라인

```bash
# RGW(Rados Gateway) 기반 정적 파일 배포
deploy:compute     # build → upload to RGW (MinIO Client)
deploy:container   # build → upload to RGW
deploy:platform    # build → upload to RGW
deploy:storage     # build → upload to RGW
```

### 실행 모드

| 모드           | 설명                              | 실행                      |
| -------------- | --------------------------------- | ------------------------- |
| **Standalone** | 독립 실행 (MSW 모킹, 자체 로그인) | `pnpm compute:standalone` |
| **Embedded**   | Platform 호스트 내 리모트로 실행  | `pnpm platform`           |
| **Admin**      | 관리자 모드 (추가 페이지 노출)    | `pnpm compute:admin`      |
| **Demo**       | 데모 API 게이트웨이 연결          | `pnpm compute:demo`       |

---

## 10. TDS SSOT와의 관계

### 10.1 현황

| 항목              | thaki-ui                          | TDS SSOT (tds_ssot)        |
| ----------------- | --------------------------------- | -------------------------- |
| **용도**          | 프로덕션 코드베이스               | 디자인 시스템 + 데모       |
| **UI 라이브러리** | `@thaki/shared` (GitHub Packages) | `@thaki/tds` (로컬 빌드)   |
| **컴포넌트 수**   | ~18개 (shared)                    | 54개                       |
| **데모 페이지**   | 없음 (실제 페이지만)              | 315+개                     |
| **디자인 토큰**   | TailwindCSS 설정                  | CSS 변수 + Figma 토큰 빌드 |
| **라우팅**        | TanStack Router + 가상 탭         | React Router DOM           |
| **빌드**          | Rspack                            | Rspack                     |

### 10.2 호환성 레이어

TDS SSOT에는 이미 **16개 컴포넌트에 thaki-ui 호환 레이어**가 구현되어 있어, `@thaki/shared`의 레거시 Props를 지원합니다:

Badge, Button, Input, Textarea, Table, StatusIndicator, Pagination, Toggle, Checkbox, Radio/RadioGroup, DatePicker, Password, ProgressBar, InlineMessage, Tabs, TabBar

### 10.3 마이그레이션 전략 (3단계)

| 단계                     | 내용                                                         | 리스크          |
| ------------------------ | ------------------------------------------------------------ | --------------- |
| **1단계: 토큰 통합**     | CSS 변수 기반 디자인 토큰을 thaki-ui에 주입                  | 낮음 (비파괴적) |
| **2단계: 컴포넌트 교체** | 호환성 높은 컴포넌트부터 `@thaki/shared` → `@thaki/tds` 교체 | 중간            |
| **3단계: 패턴 적용**     | AI Rules, 페이지 패턴, Cursor 통합                           | 낮음            |

### 10.4 주요 차이점 요약

| 차이 항목              | thaki-ui (@thaki/shared)        | TDS SSOT (@thaki/tds)                              |
| ---------------------- | ------------------------------- | -------------------------------------------------- |
| **Dropdown vs Select** | Compound (children 패턴)        | 배열 기반 (options prop)                           |
| **FormField**          | 단일 (children props 주입)      | Compound (Label + Control + HelperText)            |
| **ContextMenu**        | Compound (Root + Item)          | 배열 기반 (items prop)                             |
| **Disclosure**         | 단일 컴포넌트                   | Compound (Trigger + Panel)                         |
| **Toast**              | 단일 (`positive`/`negative`)    | Provider 패턴 (`success`/`warning`/`error`/`info`) |
| **Radio**              | `RadioGroup` + options 배열     | 개별 `Radio` + Context                             |
| **Pagination**         | `totalCount` + `size` 자동 계산 | `totalPages` 직접 제공                             |

---

## 11. 아키텍처 문서 목록

thaki-ui 레포에 존재하는 공식 아키텍처 문서:

| 문서                               | 내용                                                            |
| ---------------------------------- | --------------------------------------------------------------- |
| `01-route-structure.md`            | Compute App 라우트 계층, 인증 모델, 레이아웃 래퍼               |
| `02-data-fetching-layer.md`        | Compute/Network API 전체 스펙 (Query/Mutation, 에러 처리, 캐싱) |
| `03-global-state-management.md`    | 전역 상태 스키마 (FrameContext, ProjectStore, TabState, Auth)   |
| `host-remote-minimal-spec.ko.md`   | 호스트-리모트 연동 최소 스펙 (윈도우, 페더레이션, 브리지)       |
| `network-pages-technical-spec.md`  | 네트워크 페이지 기술 스펙                                       |
| `storage-user-admin-app-design.md` | Storage User/Admin 앱 분리 설계 (권한, 기능 분배)               |

---

## 부록: 스크립트 명령어 참조

```bash
# 개발 서버
pnpm platform              # Platform (호스트) 개발 서버
pnpm compute               # Compute (embedded 모드)
pnpm compute:standalone    # Compute (독립 실행)
pnpm compute:admin         # Compute (관리자 모드)
pnpm container             # Container
pnpm container:standalone  # Container (독립 실행)
pnpm iam                   # IAM
pnpm storage               # Storage

# 빌드
pnpm build:all             # 전체 빌드 (= build:platform)
pnpm build:compute         # Compute만 빌드
pnpm build:module-federation  # MF 유틸리티 빌드

# 배포
pnpm deploy:compute        # Compute → RGW 배포
pnpm deploy:platform       # Platform → RGW 배포

# 유틸
pnpm shared:sync-tsconfig-paths  # tsconfig paths 동기화
```
