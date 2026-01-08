# 라우트 구조 문서

이 문서는 프로젝트의 라우트 구조와 관리 방법을 설명합니다.

## 개요

프로젝트는 60개 이상의 페이지를 포함하고 있어, 효율적인 관리를 위해 도메인별로 라우트를 모듈화했습니다. 또한 코드 스플리팅을 통해 초기 번들 크기를 최적화했습니다.

## 디렉토리 구조

```
src/
├── routes/
│   ├── index.tsx           # 메인 라우트 파일 (모든 도메인 라우트 통합)
│   ├── compute.routes.tsx  # Compute 도메인 라우트
│   ├── storage.routes.tsx # Storage 도메인 라우트
│   ├── agent.routes.tsx    # Agent 도메인 라우트
│   └── design.routes.tsx  # Design System 도메인 라우트
└── pages/                  # 모든 페이지 컴포넌트
```

## 도메인별 라우트 분리

### 1. Compute Routes (`compute.routes.tsx`)
- 인스턴스, 볼륨, 네트워크, 보안 그룹 등 Compute 관련 모든 페이지
- 약 40개 이상의 라우트 포함

### 2. Storage Routes (`storage.routes.tsx`)
- Storage 풀, 호스트, OSD 등 Storage 관련 페이지
- 약 7개의 라우트 포함

### 3. Agent Routes (`agent.routes.tsx`)
- Agent, Chat, MCP Tools 등 Agent 관련 페이지
- 약 6개의 라우트 포함

### 4. Design Routes (`design.routes.tsx`)
- 디자인 시스템, 컴포넌트 쇼케이스 등 Design 관련 페이지
- 약 9개의 라우트 포함

## 코드 스플리팅

모든 페이지는 `React.lazy()`를 사용하여 동적으로 로드됩니다:

```tsx
const InstanceListPage = lazy(() => import('@/pages/InstanceListPage'));
```

이를 통해:
- **초기 번들 크기 감소**: 필요한 페이지만 로드
- **로딩 성능 향상**: 사용자가 방문하는 페이지만 다운로드
- **캐싱 효율성**: 각 페이지가 별도 청크로 분리되어 캐싱 최적화

## 라우트 추가 방법

### 새 페이지 추가 시

1. **페이지 파일 생성**: `src/pages/YourPage.tsx`
2. **해당 도메인의 라우트 파일에 추가**:
   ```tsx
   // src/routes/compute.routes.tsx (예시)
   const YourPage = lazy(() => import('@/pages/YourPage'));
   
   // Routes JSX에 추가
   <Route path="/compute/your-page" element={<YourPage />} />
   ```

### 새 도메인 추가 시

1. **새 라우트 파일 생성**: `src/routes/your-domain.routes.tsx`
2. **라우트 정의**:
   ```tsx
   import { lazy } from 'react';
   import { Route } from 'react-router-dom';
   
   const YourPage = lazy(() => import('@/pages/YourPage'));
   
   export const yourDomainRoutes = (
     <>
       <Route path="/your-domain" element={<YourPage />} />
     </>
   );
   ```
3. **`src/routes/index.tsx`에 통합**:
   ```tsx
   import { yourDomainRoutes } from './your-domain.routes';
   
   // Routes 내부에 추가
   {yourDomainRoutes}
   ```

## 페이지 간 연결성 유지

페이지 간 연결성은 다음과 같이 유지됩니다:

1. **라우트 경로**: 모든 라우트는 `src/routes/index.tsx`에서 통합 관리
2. **네비게이션**: `react-router-dom`의 `Link`와 `useNavigate` 사용
3. **타입 안정성**: TypeScript로 경로 타입 체크 가능

## 장점

### 1. 브랜치 관리 효율성
- 도메인별로 라우트가 분리되어 변경 사항 추적 용이
- 각 도메인을 독립적으로 관리 가능

### 2. 코드 가독성
- `App.tsx`가 간결해짐 (60개 이상의 import 제거)
- 도메인별로 명확하게 구분

### 3. 성능 최적화
- 코드 스플리팅으로 초기 로딩 시간 단축
- 필요한 페이지만 로드하여 메모리 사용량 감소

### 4. 유지보수성
- 새 페이지 추가 시 해당 도메인 파일만 수정
- 도메인별로 독립적인 테스트 및 배포 가능

## 주의사항

1. **Export 방식**: 
   - 대부분의 페이지는 `default export` 사용
   - `DesignSystemPage`와 `GradientShowcasePage`는 `named export` 사용
   - 라우트 파일에서 올바른 import 방식 사용 필요

2. **Suspense 경계**:
   - 모든 lazy-loaded 컴포넌트는 `Suspense`로 감싸져야 함
   - `src/routes/index.tsx`에서 전역 `Suspense` 제공

3. **라우트 순서**:
   - 더 구체적인 라우트를 먼저 정의
   - 와일드카드 라우트는 마지막에 배치

## 마이그레이션 가이드

기존 `App.tsx`에서 새 구조로 마이그레이션:
- ✅ 완료: 모든 라우트가 도메인별로 분리됨
- ✅ 완료: 코드 스플리팅 적용
- ✅ 완료: `App.tsx` 간소화

## 참고

- React Router v7 문서: https://reactrouter.com/
- React.lazy 문서: https://react.dev/reference/react/lazy
- Vite 코드 스플리팅: https://vitejs.dev/guide/features.html#async-chunk-loading-optimization


