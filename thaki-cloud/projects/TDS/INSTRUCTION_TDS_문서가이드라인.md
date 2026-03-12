# TDS 문서 작성 가이드라인

Thaki Cloud Design System (TDS) 문서 구조의 **일관성**을 위해 적용하는 문서 구조 표준입니다.  
AWS Cloudscape, Atlassian Design System, Apple HIG, Carbon, SAP Design System 등을 참고하여 Foundation / Component / Pattern 공통 룰을 정리했습니다.  
**주 참고**: AWS Cloudscape, Atlassian Design System, SAP Design System.

---

## 범례

| 기호 | 의미 |
|------|------|
| ✅ 필수 | 항상 포함 |
| 🔵 조건부 | 해당되는 경우에만 포함 |
| ➖ 해당 없음 | 해당 레이어에 존재하지 않는 섹션 |

---

## 1. Foundation

Foundation 문서는 **원칙형**과 **스펙형** 두 가지로 구분합니다.

| 구분 | 설명 | 예시 |
|------|------|------|
| **원칙형** | 설계 원칙·가이드 중심 | Accessibility, Motion, Writing, Iconography |
| **스펙형** | 수치·토큰·스케일 등 스펙 중심 | Color, Typography, Spacing, Elevation, Grid |

### Foundation 섹션 구성

| 섹션 | 원칙형 | 스펙형 | 판단 기준 |
|------|--------|--------|-----------|
| Overview | ✅ | ✅ | 항상 포함 |
| Principles | ✅ | 🔵 | 설계 의사결정 근거가 있을 때 (스펙형은 선택) |
| Tokens / Scale | ➖ | ✅ | 수치·토큰·색상값 등 스펙이 있을 때 |
| Usage Guidelines | 🔵 | ✅ | Do/Don't가 필요할 때 (원칙형은 해당 시만) |
| Related | ✅ | ✅ | 항상 포함 |

---

## 2. Component

컴포넌트 단위 문서의 섹션 구성입니다.

### Component 섹션 구성

| 섹션 | 필수 여부 | 판단 기준 |
|------|-----------|-----------|
| Overview (정의 + When to use / not to use) | ✅ | 항상 포함 |
| Composition (구성 요소) | ✅ | 항상 포함 |
| Usage Guidelines (Do / Don't) | ✅ | 항상 포함 |
| Related | ✅ | 항상 포함 |
| Variants | 🔵 | 같은 컴포넌트가 2가지 이상 형태로 존재하는가? |
| States | 🔵 | 사용자가 직접 상호작용(클릭·포커스·입력)하는가? |
| Behavior | 🔵 | 전환 애니메이션, 반응형 대응 등 시간적 변화가 있는가? |
| Content Guidelines | 🔵 | 작성자가 직접 결정해야 하는 레이블·텍스트가 있는가? |

### 컴포넌트 유형별 조건부 적용 예시

| 컴포넌트 | Variants | States | Behavior | Content Guidelines |
|----------|----------|--------|----------|---------------------|
| Button | 🔵 포함 | 🔵 포함 | 🔵 포함 | 🔵 포함 |
| Toast / Notification | 🔵 포함 | 🔵 포함 | 🔵 포함 | 🔵 포함 |
| Badge | 🔵 포함 | ➖ 생략 | ➖ 생략 | 🔵 포함 |
| Skeleton | 🔵 포함 | ➖ 생략 | 🔵 포함 | ➖ 생략 |
| Data Table | 🔵 포함 | 🔵 포함 | 🔵 포함 | 🔵 포함 |

---

## 3. Pattern

패턴 단위 문서의 섹션 구성입니다.

### Pattern 섹션 구성

| 섹션 | 필수 여부 | 판단 기준 |
|------|-----------|-----------|
| Overview (문제 정의 + When to use / not to use) | ✅ | 항상 포함 |
| Composition (구성 요소) | ✅ | 항상 포함 |
| Behavior & Flow (사용자 흐름 + 엣지 케이스) | ✅ | 항상 포함 |
| Usage Guidelines (Do / Don't + 안티패턴) | ✅ | 항상 포함 |
| Accessibility | ✅ | 항상 포함 |
| Related | ✅ | 항상 포함 |
| Content Guidelines | 🔵 | 패턴 안에 사용자가 읽거나 작성하는 텍스트가 있는가? |

### 패턴 유형별 조건부 적용 예시

| 패턴 | Content Guidelines |
|------|---------------------|
| Form | 🔵 포함 |
| Empty State | 🔵 포함 |
| Error | 🔵 포함 |
| Modal | 🔵 포함 |
| Layout | ➖ 생략 |
| Side Navigation Bar | ➖ 생략 |

---

## 4. 섹션 요약 매트릭스 (전체)

| 섹션 | Foundation | Component | Pattern |
|------|------------|-----------|---------|
| Overview | ✅ | ✅ | ✅ |
| Principles | ✅ (원칙형 필수, 스펙형 🔵) | ➖ | ➖ |
| Tokens / Scale | 🔵 스펙형만 | ➖ | ➖ |
| Composition | ➖ | ✅ | ✅ |
| Variants | ➖ | 🔵 | ➖ |
| States | ➖ | 🔵 | ➖ |
| Behavior | ➖ | 🔵 | ✅ |
| Usage Guidelines | 🔵 스펙형만 | ✅ | ✅ |
| Content Guidelines | ➖ | 🔵 | 🔵 |
| Related | ✅ | ✅ | ✅ |
| *(Pattern 전용)* Accessibility | — | — | ✅ |

---

## 5. 산출물 형식

- **형식**: Notion에 바로 붙여 넣을 수 있도록 **마크다운(.md)** 으로 출력합니다.
- **참고 예시**: `TDS_documentation_structure_shell.pdf` — Shell 컴포넌트 문서 예시(Overview, Variants, Composition, Behavior, Related 등 구조 참고).

---

## 6. 문서 메타정보 (선택·통일용)

문서 상단에 아래와 같은 메타를 두면 관리에 도움이 됩니다.

| 항목 | 설명 |
|------|------|
| 생성 일시 | |
| Created By | |
| Figma | 링크 (해당 시) |
| TDS SSOT 유무 | YES / NO |
| 구분 | Foundation / Component / Pattern |
| 기획 담당 | |
| 디자인 담당자 | |
| 상태 | 초안 / 검토 중 / 정책 작성 완료 등 |
| 우선순위 | P0 / P1 / P2 등 |

---

## 7. 참고 파일

- **상세 구조**: `TDS_documentation_structure.pdf`
- **예시 문서**: `TDS_documentation_structure_shell.pdf` (Shell 컴포넌트)
- **저장 위치**: `thaki-cloud/projects/TDS/` 내 마크다운(.md) 파일
