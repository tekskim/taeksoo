/**
 * Apps (Catalog / Installed Apps) 공통 타입
 * thaki-ui catalogData.ts 기준 정책서 정합
 */

export type AppCategory =
  | 'All'
  | 'Database'
  | 'Developer Tools'
  | 'Data Processing'
  | 'Networking'
  | 'Vector DB';

export type PackageType = 'application' | 'operator';
export type PackageLabel = 'Helm' | 'Operator-managed' | 'Operator';
export type InstallScope = 'namespace' | 'cluster';

export type ConfigurationFieldType = 'text' | 'password' | 'number' | 'select' | 'boolean';

/** App 설치 시 사용자가 입력하는 설정 항목 */
export interface ConfigurationField {
  key: string;
  label: string;
  type: ConfigurationFieldType;
  required?: boolean;
  defaultValue: string | number | boolean;
  options?: string[];
}

export type ConfigurationValue = string | number | boolean;

/** Catalog에 노출되는 App 정의 (thaki-ui AppCatalogItem 기준) */
export interface CatalogChart {
  /** chartName (e.g. 'valkey', 'cnpg') */
  id: string;
  /** chartName — URL 파라미터, 설치/검색 키 */
  name: string;
  /** 사용자에게 표시되는 이름 (e.g. 'Valkey', 'CNPG') */
  displayName: string;
  description: string;
  version: string;
  availableVersions?: string[];
  category: AppCategory;
  packageType: PackageType;
  packageLabel: PackageLabel;
  installScope: InstallScope;
  /** 동일 차트 여러 번 설치 허용 여부 */
  duplicateInstallable: boolean;
  /** 로고 이미지 URL (없으면 iconText fallback) */
  logoUrl?: string;
  /** 아이콘 텍스트 fallback */
  iconText?: string;
  /** 설치 시 설정 항목 목록 */
  configurationFields: ConfigurationField[];
  /** Operator-managed 앱의 선행 Operator chartName */
  requiredOperatorChartName?: string;
  /** 기본 values.yaml (YAML 에디터용) */
  defaultValuesYaml?: string;
}

/** 설치 상태 */
export type InstalledAppStatus = 'Deployed' | 'Pending' | 'Failed';

/** Release가 생성한 Kubernetes 리소스 1건 */
export interface InstalledAppResource {
  kind: string;
  name: string;
  namespace?: string;
}

/** 설치된 App (Helm Release / Operator-managed instance) */
export interface InstalledApp {
  id: string;
  /** chartName = releaseName (단순화) */
  name: string;
  /** 사용자 표시용 이름 */
  displayName?: string;
  version: string;
  namespace: string;
  status: InstalledAppStatus;
  installedAt: string;
  lastDeployed?: string;
  clusterId?: string;
  errorMessage?: string;
  /** Install 시 사용자가 입력한 설정값 */
  configurationValues?: Record<string, ConfigurationValue>;
  /** Chart values YAML (상세 Values 탭) */
  valuesYaml?: string;
  /** Kubernetes 리소스 목록 */
  resources?: InstalledAppResource[];
}

/** 설치된 Operator */
export interface InstalledOperator {
  id: string;
  name: string;
  displayName: string;
  version: string;
  status: InstalledAppStatus;
  namespace: string;
  installedAt: string;
  dependentApplicationCount: number;
  logoUrl?: string;
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
