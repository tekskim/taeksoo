# Page Map: TDS <-> thaki-ui

## 7개 Compute Create 페이지 매핑

| #   | 이름                 | TDS (소스)                               | thaki-ui (타겟)                                                                 |
| --- | -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | CreateInstance       | `src/pages/CreateInstancePage.tsx`       | `packages/compute/src/features/compute/ui/pages/InstanceCreatePage.tsx`         |
| 2   | CreateTemplate       | `src/pages/CreateTemplatePage.tsx`       | `packages/compute/src/features/compute/ui/pages/InstanceTemplateCreatePage.tsx` |
| 3   | CreateImage          | `src/pages/CreateImagePage.tsx`          | `packages/compute/src/features/compute/ui/pages/ImageCreatePage.tsx`            |
| 4   | CreateVolume         | `src/pages/CreateVolumePage.tsx`         | `packages/compute/src/features/storage/ui/pages/VolumeCreatePage.tsx`           |
| 5   | CreateNetwork        | `src/pages/CreateNetworkPage.tsx`        | `packages/compute/src/features/network/ui/pages/NetworkCreatePage.tsx`          |
| 6   | CreateVirtualAdapter | `src/pages/CreateVirtualAdapterPage.tsx` | `packages/compute/src/features/network/ui/pages/PortCreatePage.tsx`             |
| 7   | CreateLoadBalancer   | `src/pages/CreateLoadBalancerPage.tsx`   | `packages/compute/src/features/network/ui/pages/LoadBalancerCreatePage.tsx`     |

## 구조 차이 메모

### TDS (프로토타입)

- **레이아웃 패턴**: `PageShell` > 2컬럼 (`HStack gap={6}`)
  - 좌: 폼 영역 (`VStack gap={4}`, flex-1)
  - 우: 사이드바 (`w-[var(--wizard-summary-width)]`, sticky)
- **섹션 컴포넌트**: `SectionCard` 기반 (일관됨)
- **섹션 리듬**: `py-6` padding, `gap-4` 내부 spacing
- **버튼 패턴**: 사이드바 하단에 Cancel + Create 버튼
- **Wizard Summary**: 사이드바에 진행 상황 요약 표시

### thaki-ui (dev)

- **레이아웃 패턴**: `CreateLayout` 또는 커스텀 레이아웃 (페이지마다 다름)
- **섹션 컴포넌트**: 페이지별 상이
  - Instance: `Accordion` (아코디언 기반)
  - Template: `TcAccordion` (커스텀 아코디언)
  - Image, Volume, Network 등: `Stepper` 또는 `SectionCard` 혼용
- **버튼 패턴**: size/variant 불일치
  - 일부: `sm`/`outline`
  - 일부: `md`/`secondary`
- **Wizard Summary**: 구현 방식 상이

### 핵심 차이점 (변경 대상이 되는 비주얼 속성)

| 속성               | TDS (목표)              | thaki-ui (현재 상태 다양)                |
| ------------------ | ----------------------- | ---------------------------------------- |
| 폼-사이드바 간 gap | `gap-6` (24px)          | 페이지마다 상이                          |
| 섹션 간 gap        | `gap-4` (16px)          | 페이지마다 상이                          |
| 섹션 내부 gap      | `gap-3` ~ `gap-4`       | 페이지마다 상이                          |
| FormField 간 gap   | `gap-4` (16px)          | 페이지마다 상이                          |
| 버튼 size          | `md`                    | `sm` 또는 `md` 혼재                      |
| 버튼 variant       | `primary` / `secondary` | `primary` / `outline` / `secondary` 혼재 |
| 헤더 텍스트 토큰   | `text-heading-h5`       | 페이지마다 상이                          |
| 컨텐츠 padding     | `pt-4 px-8 pb-20`       | 페이지마다 상이                          |

### 변경 불가 구조 차이 (컴포넌트 체계)

아래 차이는 dev의 컴포넌트 체계를 유지하므로 변경하지 않습니다:

- `Accordion` / `TcAccordion` / `Stepper` → TDS의 `SectionCard`로 교체하지 않음
- API 호출 패턴 (React Query hooks 등)
- 폼 상태 관리 패턴 (formik, react-hook-form 등)
- 라우팅 구조 및 경로
