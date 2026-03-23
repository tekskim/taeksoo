/**
 * Apps (Catalog / Installed Apps) 공통 타입
 * 기능명세서·정책서 기준 (v1.0 범위)
 *
 * v1.0 제공 앱 목록: PostgreSQL, nginx, Kafka, Valkey, Milvus
 * (Hadoop ecosystem은 제공 방식 미정으로 v1.0 제외)
 *
 * v0.4 변경: Chart Info 탭 추가 (FR-026, 정책서 4-3)
 */

/** v1.0 카탈로그 카테고리 */
export type AppCategory = 'All' | 'Database' | 'Data Processing' | 'Networking' | 'Vector DB';

/** Required Option UI 타입 (정책서 3: password 마스킹, storageclass 드롭다운 등) */
export type RequiredOptionType = 'string' | 'password' | 'int' | 'storageclass';

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
   * Edit Options 항목 정의 (정책서 3)
   * 없으면 Install 시 편집 UI 없이 확인 다이얼로그만 표시
   */
  requiredOptions?: RequiredOption[];
  /** 기본 values.yaml 템플릿 (Install 시 편집 기준값) */
  defaultValuesYaml?: string;
  /** Chart.yaml 메타데이터 (Catalog 페이지 다운로드용, FR-004) */
  chartInfo?: ChartInfo;
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
