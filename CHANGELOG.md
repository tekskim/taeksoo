# TDS (THAKI Design System) Changelog

모든 주요 변경 사항은 이 파일에 기록됩니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## 버저닝 정책

### 시맨틱 버저닝 (SemVer)

```
MAJOR.MINOR.PATCH
```

| 버전 유형 | 변경 시점              | 하위 호환성      |
| --------- | ---------------------- | ---------------- |
| **MAJOR** | Breaking Changes       | ❌ 호환되지 않음 |
| **MINOR** | 새 기능 추가           | ✅ 호환됨        |
| **PATCH** | 버그 수정, 스타일 조정 | ✅ 호환됨        |

### MAJOR 버전 변경 기준 (Breaking Changes)

다음의 경우 MAJOR 버전을 올립니다:

- **컴포넌트 삭제**: 기존 컴포넌트 제거
- **Props 변경**: 필수 prop 추가, prop 이름 변경, prop 타입 변경
- **Props 삭제**: 기존 prop 제거
- **기본값 변경**: 기존 동작에 영향을 주는 기본값 변경
- **토큰 삭제/이름 변경**: CSS 변수명 변경 또는 삭제
- **Import 경로 변경**: 컴포넌트 import 경로 변경

```tsx
// ❌ Breaking Change 예시
// Before
<Button variant="primary" />

// After (variant 값 변경)
<Button variant="filled" />
```

### MINOR 버전 변경 기준 (New Features)

다음의 경우 MINOR 버전을 올립니다:

- **신규 컴포넌트**: 새로운 컴포넌트 추가
- **신규 Props**: 기존 컴포넌트에 새로운 옵션 prop 추가
- **신규 Variants**: 컴포넌트의 새로운 variant 추가
- **신규 토큰**: 새로운 CSS 변수 추가
- **신규 유틸리티**: 새로운 유틸리티 클래스 추가

```tsx
// ✅ Minor Change 예시
// 새로운 size 옵션 추가 (기존 기본값 유지)
<Button size="xs" />  // 신규 추가
<Button size="sm" />  // 기존 유지
```

### PATCH 버전 변경 기준 (Bug Fixes)

다음의 경우 PATCH 버전을 올립니다:

- **버그 수정**: 컴포넌트 동작 오류 수정
- **스타일 조정**: 시각적 버그 수정, 미세한 스타일 조정
- **문서 업데이트**: 문서 오류 수정, 설명 보완
- **타입 수정**: TypeScript 타입 정의 수정
- **성능 개선**: 내부 구현 최적화 (API 변경 없음)

---

### 변경 로그 작성 규칙

각 버전의 변경 사항은 다음 카테고리로 분류합니다:

- **Added**: 새로운 기능
- **Changed**: 기존 기능의 변경
- **Deprecated**: 곧 삭제될 기능
- **Removed**: 삭제된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 수정

### 지원 정책

| 버전 | 지원 상태 | 비고                 |
| ---- | --------- | -------------------- |
| 1.x  | ✅ Active | 현재 버전, 적극 지원 |
| 0.x  | ❌ EOL    | 개발 기간, 지원 종료 |

---

## [1.0.0] - 2026-02-06

### 🎉 첫 번째 안정 버전 릴리스

TDS(THAKI Design System)의 공식 첫 안정 버전입니다.

### Added

#### 컴포넌트

- **Form Controls**: Button, Input, Select, Checkbox, Radio, Toggle, Slider, SearchInput, FilterSearchInput, NumberInput, Textarea, DatePicker, FormField
- **Data Display**: Table, Pagination, Badge, Chip, StatusIndicator, ProgressBar, Tooltip
- **Layout**: VStack, HStack, Container, SectionCard, DetailHeader, ListToolbar
- **Navigation**: Tabs, TabList, Tab, TabPanel, TabBar, TopBar, Breadcrumb, SNBMenuItem
- **Feedback**: Modal, ConfirmModal, Drawer, InlineMessage, ContextMenu, Toast
- **Disclosure**: Disclosure, Accordion

#### 디자인 토큰

- **Colors**: Primary, Secondary, Tertiary, Surface, Text, Border, State colors
- **Spacing**: 0-16 단계 (px 단위)
- **Typography**: Heading (h1-h6), Body (xs-lg), Label (sm-lg)
- **Radius**: none, sm, md, lg, xl, full (px 단위)
- **Transitions**: fast, normal, slow

#### 아이콘

- Tabler Icons 연동 (200+ 아이콘)
- Custom Icons: IconExpandOff, IconExpandOn, IconTimeout, IconHistory2, IconRobotCustom, IconAction, IconAddRobot, IconUbuntu2, IconRocky2

#### 문서

- Storybook 컴포넌트 문서
- Iconography 페이지
- Table Style Guide
- Production Comparison 페이지

#### 개발 도구

- Cursor IDE 규칙 파일 (`.cursor/rules/tds-design-system.mdc`)
- Tailwind CSS 프리셋

---

## [0.x.x] - Pre-release (개발 기간)

> 1.0.0 이전의 모든 변경 사항은 개발 기간으로 간주합니다.
> 상세 이력은 Git 커밋 히스토리를 참조하세요.

---

## 업그레이드 가이드

### 0.x → 1.0.0

1.0.0은 첫 안정 버전으로, 0.x에서의 마이그레이션 가이드는 제공하지 않습니다.
새로운 프로젝트에서는 1.0.0부터 사용하시기 바랍니다.

---

## 기여하기

변경 로그에 기록이 필요한 PR을 생성할 때:

1. PR 설명에 변경 유형 명시 (Added/Changed/Fixed 등)
2. Breaking Change가 있는 경우 명확히 표시
3. 마이그레이션 방법 제시 (Breaking Change 시)

---

## 관련 문서

- [디자인 시스템 규칙](.cursor/rules/tds-design-system.mdc)
- [Storybook](http://localhost:6006)
- [디자인 시스템 페이지](/design)
