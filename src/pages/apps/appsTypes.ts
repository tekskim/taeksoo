/**
 * Apps (Catalog / Installed Apps) 공통 타입
 * 기능명세서·정책서 기준 (v1.0 범위)
 *
 * v1.0 제공 앱 목록: PostgreSQL (CNPG), Valkey, Gitea, nginx, Kafka, Milvus
 * (Hadoop ecosystem은 제공 방식 미정으로 v1.0 제외)
 *
 * v0.5 변경: Edit Options 정책서 부록 2 반영 (boolean toggle, select, resource-tier, conditional)
 */

/** v1.0 카탈로그 카테고리 */
export type AppCategory =
  | 'All'
  | 'Database'
  | 'Data Processing'
  | 'Networking'
  | 'Vector DB'
  | 'Developer Tools';

/**
 * Required Option UI 타입 (정책서 부록 2)
 * - string: 일반 텍스트 입력
 * - password: 마스킹 입력 (PasswordInput)
 * - int: 정수 입력
 * - storageclass: StorageClass 드롭다운
 * - boolean: 토글 스위치 (true/false 문자열로 저장)
 * - select: 커스텀 옵션 드롭다운 (options 필드 필수)
 * - resource-tier: 리소스 티어 선택 (Small/Medium/Large/Custom) — UI 전용, tierPresets 자동 반영
 */
export type RequiredOptionType =
  | 'string'
  | 'password'
  | 'int'
  | 'storageclass'
  | 'boolean'
  | 'select'
  | 'resource-tier';

export interface RequiredOption {
  key: string;
  label: string;
  type?: RequiredOptionType;
  /** 옵션 그룹 헤더 (동일 group 값의 첫 항목 위에 헤더로 표시) */
  group?: string;
  /** Input suffix 단위 (예: "GiB"). 지정 시 단위 표시 */
  unit?: string;
  /** 필수 입력 여부 (정책서 3: Required 항목 미입력 시 Install/Edit 요청 차단) */
  required?: boolean;
  /** type='select' 일 때 드롭다운 옵션 목록 */
  options?: { value: string; label: string }[];
  /**
   * 조건부 표시: 특정 필드가 특정 값일 때만 노출
   * e.g. showWhen: { key: 'REPLICA_ENABLED', value: 'true' }
   */
  showWhen?: { key: string; value: string };
  /** 폼 초기값 (설치 시 기본 선택/입력값) */
  defaultValue?: string;
  /** 설명 텍스트 (FormField.Description 으로 표시) */
  description?: string;
}

/**
 * Chart.yaml 메타데이터 (정책서 4-3, FR-026)
 * Catalog 및 Installed App 상세 페이지 Chart Info 탭에서 사용
 */
export interface ChartInfo {
  /** 차트 이름 */
  name: string;
  /** 차트 버전 */
  version: string;
  /** 앱 버전 (chart version과 별개) */
  appVersion: string;
  /** 차트 설명 */
  description: string;
}

/**
 * 리소스 티어 프리셋 (정책서 §1-2)
 * 티어 선택 시 해당 values로 CPU/Memory/Storage 필드를 자동 채움
 */
export interface TierPreset {
  /** 티어별 자동 채울 optionKey → value 맵 */
  values: Record<string, string>;
}

/** Catalog에 노출되는 앱 (Helm Chart 기반) */
export interface CatalogChart {
  id: string;
  name: string;
  description: string;
  /** 현재 최신 안정(Stable) 버전 (기본 선택) */
  version: string;
  /** 선택 가능한 버전 목록 (최신순). 없으면 version 단일 항목으로 처리 */
  availableVersions?: string[];
  category: AppCategory;
  /** 로고 이미지 URL (없으면 아이콘 fallback) */
  logoUrl?: string;
  /**
   * 동일 네임스페이스 내 중복 설치 허용 여부.
   * true이면 Release 이름에 자동 suffix를 붙여 생성 (예: nginx-1, nginx-2).
   */
  allowMultiple?: boolean;
  /**
   * Edit Options 항목 정의 (정책서 부록 2)
   * 없으면 Install 시 편집 UI 없이 확인 다이얼로그만 표시
   */
  requiredOptions?: RequiredOption[];
  /** 기본 values.yaml 템플릿 (Install 시 편집 기준값) */
  defaultValuesYaml?: string;
  /** Chart.yaml 메타데이터 (Catalog 페이지 다운로드용, FR-004) */
  chartInfo?: ChartInfo;
  /**
   * 리소스 티어 프리셋 (정책서 §1-2)
   * resource-tier 필드 선택 시 매핑된 optionKey들을 자동 채움
   * key: 'Small' | 'Medium' | 'Large'
   */
  tierPresets?: Record<string, TierPreset>;
  /** 설치 의존성: 먼저 설치되어야 하는 앱 이름 (정책서 §1-5) */
  dependsOn?: string;
  /** 설치 타입 표시 레이블 (예: "Operator 기반 (2단계)", "단일 앱") */
  installType?: string;
}

/** Chart의 Required Option key 목록 */
export function getRequiredOptionKeys(chart: CatalogChart): string[] {
  if (chart.requiredOptions?.length) return chart.requiredOptions.map((o) => o.key);
  return [];
}

/** 설치 상태 (정책서 2-5) */
export type InstalledAppStatus = 'Deployed' | 'Pending' | 'Failed';

/** Release가 생성한 Kubernetes 리소스 1건 (상세 Resources 탭) */
export interface InstalledAppResource {
  kind: string;
  name: string;
  namespace?: string;
}

/**
 * 설치된 앱의 연결 정보 (정책서 4-4)
 * 외부 엔드포인트, 내부 서비스 도메인, 포트
 */
export interface AppConnectionInfo {
  /** 브라우저 등 외부에서 접근하는 주소 (예: https://grafana.example.com) */
  externalEndpoint?: string;
  /** 클러스터 내부 앱 간 통신 주소 (예: postgresql.default.svc.cluster.local) */
  internalServiceDomain?: string;
  /** 서비스가 수신하는 포트 번호 (예: 5432) */
  port?: number;
}

/** 설치된 App (Helm Release) */
export interface InstalledApp {
  id: string;
  /**
   * Release 이름 — 사용자에게 표시되는 인스턴스 식별자.
   * allowMultiple 차트는 자동 suffix 포함 (예: nginx-1, nginx-2).
   */
  releaseName: string;
  /**
   * Chart 이름 (내부 카탈로그 조회 키, 예: postgresql, nginx).
   * CatalogChart.name과 대응.
   */
  name: string;
  version: string;
  namespace: string;
  status: InstalledAppStatus;
  installedAt: string;
  /** Helm 저장소/차트 참조 (예: bitnami/postgresql) */
  chart?: string;
  /** 마지막 배포 시각 */
  lastDeployed?: string;
  /** 클러스터 식별 (단일 클러스터 시 생략 가능) */
  clusterId?: string;
  /** 실패 시 오류 메시지 */
  errorMessage?: string;
  /** 현재 적용된 values.yaml (상세 Values YAML 탭 — 읽기 전용, 정책서 4-2) */
  valuesYaml?: string;
  /**
   * Install/Edit 폼에서 입력한 Required Options 값.
   * key: CatalogChart.requiredOptions[].key (점 표기법 경로), value: 폼 입력값.
   * Edit 시 폼 초기값으로 사용.
   */
  configValues?: Record<string, string>;
  /** Release가 생성한 Kubernetes 리소스 목록 (상세 Resources 탭) */
  resources?: InstalledAppResource[];
  /** 연결 정보 (정책서 4-4) */
  connectionInfo?: AppConnectionInfo;
  /** Chart.yaml 메타데이터 (정책서 4-3, FR-026) — Pending/Failed 상태에서도 항상 표시 */
  chartInfo?: ChartInfo;
}

/** Install 시 선택: 클러스터 + 네임스페이스 */
export interface InstallTarget {
  clusterId: string;
  clusterName: string;
  namespace: string;
}

/** 특정 클러스터·네임스페이스에 해당 Chart가 이미 설치되어 있는지 (정책서 2-2) */
export function isChartInstalledInTarget(
  installedApps: InstalledApp[],
  chartName: string,
  clusterId: string,
  namespace: string
): boolean {
  return installedApps.some(
    (app) =>
      app.name === chartName &&
      app.namespace === namespace &&
      (app.clusterId ?? clusterId) === clusterId
  );
}
