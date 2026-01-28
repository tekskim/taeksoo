/**
 * Table Column Width Presets
 *
 * 테이블 컬럼 너비 정책:
 * 1. 완전 고정 컬럼 (fixedColumns): 아이콘/버튼만 표시, 크기 불변
 * 2. 유연 컬럼 (columnMinWidths): flex + minWidth 조합으로 사용
 *
 * @example
 * import { fixedColumns, columnMinWidths } from '@/design-system';
 *
 * const columns = [
 *   { key: 'status', width: fixedColumns.status },           // 완전 고정
 *   { key: 'name', flex: 1, minWidth: columnMinWidths.name }, // 유연
 *   { key: 'createdAt', flex: 1, minWidth: columnMinWidths.createdAt }, // 유연
 *   { key: 'actions', width: fixedColumns.actions },         // 완전 고정
 * ];
 *
 * @note
 * - 컬럼 숨김 기능 사용 시에도 레이아웃이 깨지지 않음
 * - 유연 컬럼들이 남은 공간을 자동으로 채움
 * - minWidth로 최소 가독성 보장
 *
 * @changelog
 * 2026-01-27: 컬럼 너비 정책 리팩토링
 *   - fixedColumns / columnMinWidths 이원화
 *   - 컬럼 숨김 시 여백 문제 해결
 * 2026-01-26: 헤더 truncate 방지를 위한 너비 조정
 */

// =============================================================================
// 완전 고정 컬럼 (Fixed Columns)
// 아이콘/버튼만 표시되어 크기가 변할 필요 없는 컬럼
// 사용: { key: 'status', width: fixedColumns.status }
// =============================================================================

export const fixedColumns = {
  // 선택/체크박스
  select: '40px',
  checkbox: '40px',
  radio: '40px',
  favorite: '40px',

  // 상태 아이콘
  status: '64px',

  // 잠금
  locked: '64px',

  // 액션 메뉴
  actions: '64px',
  action: '64px',
  actionWide: '72px',

  // 기타 아이콘/버튼
  identify: '80px',
} as const;

// =============================================================================
// 유연 컬럼 minWidth 값 (Flexible Column Min Widths)
// flex: 1과 함께 사용하여 공간을 유연하게 채움
// 사용: { key: 'name', flex: 1, minWidth: columnMinWidths.name }
// =============================================================================

export const columnMinWidths = {
  // ============================================================================
  // 공통 (Common)
  // ============================================================================

  // 식별자/이름 ----------------------------------------------------------------
  id: '64px',
  name: '180px',
  nameLg: '240px',
  nameWide: '220px',
  nameXl: '300px',
  nameXxl: '250px',
  hostname: '150px',
  node: '150px',

  // 상태 (텍스트 포함) ---------------------------------------------------------
  statusLg: '160px',
  ready: '80px',
  health: '80px',
  condition: '90px',
  phase: '100px',

  // 시간/날짜 ------------------------------------------------------------------
  createdAt: '140px',
  updatedAt: '140px',
  editedAt: '140px',
  startTime: '140px',
  started: '140px',
  firstSeen: '100px',
  lastSeen: '100px',
  lastAccess: '140px',
  lastSignIn: '120px',
  lastUpdate: '140px',
  lastUpdated: '140px',
  lastRefreshed: '140px',
  lastUsed: '140px',
  expiresAt: '120px',
  timestamp: '160px',
  duration: '100px',
  age: '150px',
  creationDate: '140px',

  // 숫자/카운트 ----------------------------------------------------------------
  count: '80px',
  data: '80px',
  userCount: '80px',

  // 타입/분류 ------------------------------------------------------------------
  type: '100px',
  typeLg: '100px',
  typeXl: '200px',
  category: '140px',
  version: '100px',

  // 텍스트 --------------------------------------------------------------------
  description: '200px',
  labels: '300px',
  annotations: '300px',
  key: '300px',
  value: '300px',
  owner: '160px',

  // ============================================================================
  // Compute
  // ============================================================================

  // 리소스 --------------------------------------------------------------------
  cpu: '80px',
  vcpu: '80px',
  vCPU: '80px',
  ram: '80px',
  memory: '100px',
  disk: '80px',
  gpu: '80px',
  ephemeralDisk: '100px',

  // 인스턴스 ------------------------------------------------------------------
  image: '110px',
  flavor: '90px',
  az: '80px',
  availabilityZone: '80px',
  sourceInstance: '140px',
  instances: '100px',

  // 이미지/스냅샷 --------------------------------------------------------------
  size: '100px',
  minDisk: '100px',
  minRam: '100px',
  minRAM: '100px',
  diskTag: '100px',
  bootable: '80px',
  diskFormat: '100px',
  access: '80px',
  visibility: '100px',
  protected: '80px',

  // 서버 그룹/키페어 -----------------------------------------------------------
  policy: '120px',
  fingerprint: '300px',

  // Flavor 상세 ---------------------------------------------------------------
  gpuType: '120px',
  numaNodes: '100px',
  cpuPolicy: '120px',
  cpuThreadPolicy: '140px',

  // 호스트 하드웨어 ------------------------------------------------------------
  model: '120px',
  cpus: '80px',
  cores: '80px',
  totalMemory: '120px',
  rawCapacity: '120px',
  hdds: '80px',
  flash: '80px',
  nics: '80px',
  vendor: '120px',
  memoryUsage: '100px',

  // 디바이스/데몬 --------------------------------------------------------------
  deviceId: '100px',
  deviceName: '150px',
  devicePath: '150px',
  daemons: '100px',
  daemonName: '150px',
  daemonEvents: '100px',
  osd: '80px',
  osds: '80px',

  // ============================================================================
  // Network
  // ============================================================================

  // IP 주소 -------------------------------------------------------------------
  ip: '130px',
  fixedIp: '130px',
  fixedIP: '130px',
  floatingIp: '130px',
  ipAddress: '130px',
  vipAddress: '130px',
  gatewayIp: '130px',
  cidr: '130px',
  subnetCidr: '120px',
  mgmtIp: '130px',

  // 네트워크 ------------------------------------------------------------------
  network: '140px',
  networkName: '140px',
  ownedNetwork: '140px',
  ownedSubnet: '150px',
  external: '80px',
  allocationPools: '140px',
  portCount: '80px',

  // MAC/포트 ------------------------------------------------------------------
  macAddress: '150px',
  macPrimary: '150px',
  port: '70px',
  portRange: '100px',

  // 연결 대상 -----------------------------------------------------------------
  attachedTo: '160px',
  associatedTo: '160px',
  associatedResources: '160px',

  // 프로토콜/방향 --------------------------------------------------------------
  protocol: '90px',
  direction: '80px',
  etherType: '100px',
  remoteIpPrefix: '140px',
  networkBandwidth: '180px',
  internalNetworkBandwidth: '180px',

  // 라우터 --------------------------------------------------------------------
  externalGateway: '130px',
  externalFixedIp: '130px',
  externalNetwork: '150px',
  destination: '130px',
  nextHop: '130px',

  // 보안그룹 ------------------------------------------------------------------
  securityGroups: '150px',
  ingressRules: '100px',
  egressRules: '100px',
  remote: '130px',
  icmpTypeCode: '100px',

  // 인증서/도메인 --------------------------------------------------------------
  domain: '150px',
  issuer: '150px',

  // ============================================================================
  // LoadBalancer
  // ============================================================================

  // 상태 ----------------------------------------------------------------------
  adminState: '100px',
  adminStateUp: '100px',
  provisioningStatus: '120px',
  operatingStatus: '120px',

  // 구성요소 ------------------------------------------------------------------
  loadBalancer: '150px',
  listeners: '100px',
  listener: '120px',
  pools: '100px',
  members: '120px',
  memberCount: '120px',

  // 설정 ----------------------------------------------------------------------
  algorithm: '120px',
  weight: '80px',
  connectionLimit: '100px',
  backup: '80px',

  // L7 Policy -----------------------------------------------------------------
  behavior: '100px',
  position: '80px',
  compareType: '100px',
  invert: '80px',

  // ============================================================================
  // Storage
  // ============================================================================

  // 볼륨/스토리지 클래스 --------------------------------------------------------
  volume: '150px',
  sourceVolume: '150px',
  storageClass: '120px',
  volumeMode: '100px',
  volumeAttributesClass: '160px',
  persistentVolumeClaim: '180px',

  // 용량/접근 -----------------------------------------------------------------
  capacity: '100px',
  storageCapacity: '520px',
  usedCapacity: '120px',
  capacityLimit: '120px',
  accessModes: '120px',
  reclaimPolicy: '120px',

  // 프로비저너/소스 ------------------------------------------------------------
  provisioner: '150px',
  source: '100px',
  backupMode: '100px',
  default: '100px',
  isDefault: '80px',

  // Bucket/Object -------------------------------------------------------------
  objects: '80px',
  objectLimit: '100px',
  documents: '100px',
  grantee: '150px',
  permissions: '120px',

  // Ceph Storage --------------------------------------------------------------
  deviceClass: '100px',
  pgs: '80px',
  pgStatus: '100px',
  flags: '100px',
  usage: '100px',
  usagePercent: '100px',
  dataProtection: '120px',
  applications: '120px',
  crushRuleset: '120px',
  readOps: '100px',
  writeOps: '100px',

  // ============================================================================
  // Container (Kubernetes)
  // ============================================================================

  // 워크로드 상태 --------------------------------------------------------------
  desired: '80px',
  current: '80px',
  available: '80px',
  upToDate: '80px',
  replicas: '80px',
  restarts: '80px',
  pods: '80px',

  // 스케일링 (HPA) ------------------------------------------------------------
  workload: '150px',
  minReplicas: '100px',
  maxReplicas: '100px',
  currentReplicas: '120px',

  // 스케줄/잡 -----------------------------------------------------------------
  schedule: '120px',
  lastSchedule: '120px',
  suspend: '80px',
  completions: '100px',
  parallelism: '100px',

  // 컨테이너 ------------------------------------------------------------------
  containerImage: '150px',
  initContainer: '120px',
  namespace: '120px',

  // Selector ------------------------------------------------------------------
  selector: '200px',
  podSelector: '200px',
  namespaceSelector: '200px',

  // Ingress -------------------------------------------------------------------
  ingressClass: '120px',
  pathType: '300px',
  path: '300px',
  host: '300px',
  target: '300px',
  targetService: '150px',
  certificates: '150px',

  // PDB (PodDisruptionBudget) -------------------------------------------------
  minAvailable: '100px',
  maxUnavailable: '100px',
  disruptionsAllowed: '100px',
  allowedDisruption: '120px',
  currentHealthy: '100px',
  desiredHealthy: '100px',
  expectedPods: '100px',

  // ResourceQuota/LimitRange --------------------------------------------------
  request: '100px',
  limit: '100px',

  // 이벤트 --------------------------------------------------------------------
  reason: '120px',
  object: '120px',
  subobject: '100px',
  message: '240px',

  // Node ----------------------------------------------------------------------
  roles: '100px',
  os: '120px',
  cpuUsage: '100px',
  ramUsage: '100px',
  podsUsage: '100px',
  kubernetesVersion: '140px',

  // ============================================================================
  // IAM
  // ============================================================================

  // 사용자 --------------------------------------------------------------------
  user: '150px',
  username: '150px',
  users: '100px',
  userGroups: '150px',
  userGroupCount: '100px',

  // 인증/권한 -----------------------------------------------------------------
  policies: '150px',
  iamRoles: '150px',
  attachedRoles: '150px',
  scope: '100px',

  // 세션/디바이스 --------------------------------------------------------------
  device: '120px',

  // API Key -------------------------------------------------------------------
  keyId: '150px',

  // MFA -----------------------------------------------------------------------
  mfa: '80px',

  // 기타 ----------------------------------------------------------------------
  apps: '100px',

  // ============================================================================
  // Cloud Builder
  // ============================================================================

  // 서버/하드웨어 --------------------------------------------------------------
  serial: '120px',
  location: '100px',
  nicPrimaryName: '150px',
  frontierNet: '100px',
  observedHealth: '120px',
  provisionStatus: '120px',
  role: '100px',
  purpose: '120px',
  region: '100px',

  // pCPU 리소스 ---------------------------------------------------------------
  pcpuUsage: '100px',
  pcpusTotal: '100px',
  pcpusUsed: '100px',
  pcpusReserved: '100px',
  pcpusAllocationRatio: '140px',

  // vCPU 리소스 ---------------------------------------------------------------
  vcpuCore: '100px',
  vcpus: '80px',
  vcpusTotal: '100px',
  vcpusUsed: '100px',
  vcpusReserved: '100px',
  vcpusAllocationRatio: '140px',

  // RAM 리소스 ----------------------------------------------------------------
  ramTotal: '100px',
  ramUsed: '100px',
  ramReserved: '100px',
  ramAllocationRatio: '140px',
  configuredMemoryGiB: '140px',

  // Storage 리소스 ------------------------------------------------------------
  storageTotal: '120px',
  storageUsed: '120px',
  storageReserved: '120px',
  storageAllocationRatio: '140px',
  storageCapacityGiB: '140px',

  // GPU 리소스 ----------------------------------------------------------------
  gpuUsage: '100px',

  // 서비스 --------------------------------------------------------------------
  service: '120px',
  serviceState: '100px',
  serviceStatus: '120px',
  engineId: '120px',
  endpoints: '150px',
  backendName: '150px',
  rpName: '120px',
} as const;

// =============================================================================
// 레거시 호환 (columnWidths)
// @deprecated - fixedColumns와 columnMinWidths 사용 권장
// =============================================================================

export const columnWidths = {
  ...fixedColumns,
  ...columnMinWidths,
} as const;

// =============================================================================
// Type Exports
// =============================================================================

export type FixedColumnKey = keyof typeof fixedColumns;
export type ColumnMinWidthKey = keyof typeof columnMinWidths;
export type ColumnWidthKey = keyof typeof columnWidths;

// =============================================================================
// 사용 가이드
// =============================================================================
//
// [권장 패턴]
//
// 1. 완전 고정 컬럼 (아이콘/버튼):
//    { key: 'status', width: fixedColumns.status }
//    { key: 'actions', width: fixedColumns.actions }
//
// 2. 유연 컬럼 (텍스트/데이터):
//    { key: 'name', flex: 1, minWidth: columnMinWidths.name }
//    { key: 'createdAt', flex: 1, minWidth: columnMinWidths.createdAt }
//
// [전체 예시]
//
// columns={[
//   { key: 'status', width: fixedColumns.status },           // 고정 64px
//   { key: 'name', flex: 1, minWidth: columnMinWidths.name }, // 유연, 최소 180px
//   { key: 'type', flex: 1, minWidth: columnMinWidths.type }, // 유연, 최소 100px
//   { key: 'createdAt', flex: 1, minWidth: columnMinWidths.createdAt }, // 유연
//   { key: 'actions', width: fixedColumns.actions },         // 고정 64px
// ]}
//
// [장점]
// - 컬럼 숨김 시에도 남은 flex 컬럼들이 공간을 채움
// - minWidth로 최소 가독성 보장
// - 고정 컬럼(status, actions)은 항상 일정한 크기 유지
//
// =============================================================================
