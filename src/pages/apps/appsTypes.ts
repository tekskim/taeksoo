/**
 * Apps (Catalog / Installed Apps) 공통 타입
 * 기능명세서·정책서 기준 (Apps 정책서 3-3, 3-3-1)
 */

export type AppCategory =
  | 'Big Data'
  | 'Database'
  | 'Monitoring'
  | 'Networking'
  | 'Security'
  | 'All';

/** Required Option UI 타입 (정책서 3-3-1: password 마스킹, storageclass 드롭다운 등) */
export type RequiredOptionType = 'string' | 'password' | 'int' | 'storageclass';

export interface RequiredOption {
  key: string;
  label: string;
  type?: RequiredOptionType;
  /** 옵션 그룹 헤더 (동일 group 값의 첫 항목 위에 헤더로 표시) */
  group?: string;
  /** Input suffix 단위 (예: "Gi", "d"). 지정 시 UnitInput으로 렌더링 */
  unit?: string;
}

/** Catalog에 노출되는 Helm Chart (서비스) */
export interface CatalogChart {
  id: string;
  name: string;
  description: string;
  version: string;
  /** 선택 가능한 버전 목록 (최신순). 없으면 version 단일 항목으로 처리 */
  availableVersions?: string[];
  category: AppCategory;
  /** 로고 이미지 URL (없으면 아이콘 fallback) */
  logoUrl?: string;
  /** Required Options 정의 (정책서 3-3-1. 없으면 Install 시 편집 UI 없이 확인 다이얼로그만) */
  requiredOptions?: RequiredOption[];
  /** 기본 values.yaml 템플릿 (Install 시 YAML 에디터에 표시) */
  defaultValuesYaml?: string;
}

/** Chart의 Required Option key 목록 (requiredOptions 또는 레거시 requiredOptionKeys 기준) */
export function getRequiredOptionKeys(chart: CatalogChart): string[] {
  if (chart.requiredOptions?.length) return chart.requiredOptions.map((o) => o.key);
  return (chart as { requiredOptionKeys?: string[] }).requiredOptionKeys ?? [];
}

/** 설치 상태 */
export type InstalledAppStatus = 'Deployed' | 'Pending' | 'Failed';

/** Release가 생성한 Kubernetes 리소스 1건 (상세 Resources 탭) */
export interface InstalledAppResource {
  kind: string;
  name: string;
  namespace?: string;
}

/** 설치된 App (Release) */
export interface InstalledApp {
  id: string;
  name: string; // Chart 이름 = Release 이름
  version: string;
  namespace: string;
  status: InstalledAppStatus;
  installedAt: string;
  /** Helm chart (e.g. bitnami/postgresql). 프로토타입 목록/상세 표시용 */
  chart?: string;
  /** 마지막 배포 시각 (목록/상세 표시용) */
  lastDeployed?: string;
  clusterId?: string; // 클러스터 식별 (단일 클러스터 시 생략 가능)
  /** 실패 시 오류 메시지 */
  errorMessage?: string;
  /** Chart values YAML (상세 Values YAML 탭, read-only) */
  valuesYaml?: string;
  /** 이 Release가 생성한 Kubernetes 리소스 목록 (상세 Resources 탭) */
  resources?: InstalledAppResource[];
}

/** Install 시 선택: 클러스터 + 네임스페이스 */
export interface InstallTarget {
  clusterId: string;
  clusterName: string;
  namespace: string;
}

/** 특정 클러스터·네임스페이스에 해당 Chart가 이미 설치되어 있는지 */
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
