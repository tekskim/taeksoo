/**
 * Table Column Width Presets
 *
 * 테이블 컬럼의 표준 너비를 정의합니다.
 * 일관된 UI를 위해 이 프리셋을 사용하세요.
 *
 * @example
 * import { columnWidths } from '@/design-system';
 *
 * const columns = [
 *   { key: 'select', width: columnWidths.select },   // 고정 40px
 *   { key: 'status', width: columnWidths.status },   // 고정 64px
 *   { key: 'name', flex: 1 },                        // 가변 (남은 공간 채움)
 *   { key: 'actions', width: columnWidths.actions }, // 고정 64px
 * ];
 *
 * @note
 * - sortable 컬럼은 소팅 아이콘(~16px) 공간 필요
 * - 컬럼 8개 이상 테이블은 flex + minWidth 권장
 * - 총 고정 너비 800px 초과 시 오버플로우 위험
 *
 * @changelog
 * 2026-01-26: 헤더 truncate 방지를 위한 너비 조정
 *   - gpu: 64px → 80px
 *   - type: 80px → 100px
 *   - protocol: 70px → 90px
 *   - adminState: 64px → 100px
 */

export const columnWidths = {
  // ============================================================================
  // 공통 (Common)
  // ============================================================================

  // 선택/체크박스 ---------------------------------------------------------------
  select: '40px',
  checkbox: '40px',
  favorite: '40px',

  // 액션 ----------------------------------------------------------------------
  actions: '64px',
  actionWide: '72px',
  actionXl: '80px',
  locked: '68px',
  lockedWide: '70px',
  identify: '80px',

  // 상태 ----------------------------------------------------------------------
  status: '64px',
  statusLg: '160px',
  ready: '80px',
  health: '80px',
  condition: '90px',
  phase: '100px',

  // 식별자/이름 ----------------------------------------------------------------
  id: '64px',
  name: '180px',
  nameLg: '240px',
  nameWide: '220px',
  nameXl: '300px',
  nameXxl: '250px',
  hostname: '150px',
  node: '150px',

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
  ram: '80px',
  memory: '100px',
  disk: '80px',
  gpu: '80px',
  ephemeralDisk: '100px',

  // 인스턴스 ------------------------------------------------------------------
  image: '110px',
  flavor: '90px',
  az: '80px',
  sourceInstance: '140px',
  instances: '100px',

  // 이미지/스냅샷 --------------------------------------------------------------
  size: '100px',
  minDisk: '100px',
  minRam: '100px',
  diskTag: '100px',
  bootable: '80px',
  diskFormat: '100px',
  access: '80px',
  visibility: '100px',
  protected: '80px',

  // 서버 그룹/키페어 -----------------------------------------------------------
  policy: '120px',
  fingerprint: '360px',

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
  floatingIp: '130px',
  ipAddress: '130px',
  vipAddress: '130px',
  gatewayIp: '130px',
  cidr: '130px',
  subnetCidr: '120px',

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
  mfa: '80px',
  policies: '150px',
  iamRoles: '150px',
  attachedRoles: '150px',
  scope: '100px',

  // 세션/디바이스 --------------------------------------------------------------
  device: '120px',

  // API Key -------------------------------------------------------------------
  keyId: '150px',

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

  // ============================================================================
  // 키 별칭 (Aliases) - 대소문자/네이밍 호환
  // ============================================================================

  action: '64px', // → actions
  creationDate: '140px', // → createdAt
  fixedIP: '130px', // → fixedIp
  macPrimary: '150px', // → macAddress
  mgmtIp: '130px', // → ip
  availabilityZone: '80px', // → az
  vCPU: '80px', // → vcpu
  minRAM: '100px', // → minRam
} as const;

// =============================================================================
// Type Export
// =============================================================================

export type ColumnWidthKey = keyof typeof columnWidths;

// =============================================================================
// 사용 가이드
// =============================================================================
//
// 1. 고정 너비:
//    { key: 'status', width: columnWidths.status }
//
// 2. 가변 너비 (flex):
//    { key: 'name', flex: 1 }
//    { key: 'description', flex: 2 }  // 2배 공간
//
// 3. 반응형 (flex + minWidth):
//    { key: 'name', flex: 1, minWidth: '120px' }
//
// 4. 혼합 사용:
//    [
//      { key: 'status', width: columnWidths.status },  // 고정
//      { key: 'name', flex: 1 },                       // 가변
//      { key: 'actions', width: columnWidths.actions } // 고정
//    ]
//
// =============================================================================
