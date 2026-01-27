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
 *   { key: 'select', width: columnWidths.select },
 *   { key: 'status', width: columnWidths.status },
 *   { key: 'name', minWidth: columnWidths.name.minWidth },
 *   { key: 'actions', width: columnWidths.actions },
 * ];
 */

/* ----------------------------------------
   Fixed Width Columns (고정 너비)
   ---------------------------------------- */

export const columnWidths = {
  // 선택/액션
  select: '40px',
  actions: '64px',
  action: '64px',

  // 상태
  status: '64px',
  ready: '70px',
  adminState: '64px',
  health: '80px',
  condition: '90px',

  // 네트워크
  ip: '130px',
  fixedIp: '130px',
  floatingIp: '130px',
  ipAddress: '130px',
  macAddress: '150px',
  subnetCidr: '120px',
  port: '70px',
  protocol: '70px',

  // 리소스
  cpu: '80px',
  vcpu: '80px',
  vCPU: '80px',
  ram: '80px',
  memory: '100px',
  disk: '80px',
  size: '100px',
  pods: '80px',
  ephemeralDisk: '100px',
  minDisk: '100px',
  minRam: '100px',
  minRAM: '100px',

  // 시간
  createdAt: '140px',
  updatedAt: '140px',
  lastSeen: '100px',
  firstSeen: '100px',
  timestamp: '160px',
  duration: '80px',
  expiresAt: '120px',
  lastSignIn: '120px',

  // 숫자/카운트
  count: '70px',
  restarts: '70px',
  replicas: '70px',
  userCount: '80px',
  memberCount: '100px',

  // 짧은 텍스트
  type: '80px',
  version: '80px',
  access: '80px',
  visibility: '80px',
  namespace: '120px',
  category: '100px',

  // 기타
  fingerprint: '200px',
  kubernetesVersion: '140px',
} as const;

/* ----------------------------------------
   Flexible Width Columns (가변 너비)
   ---------------------------------------- */

export const flexColumnPresets = {
  /** 리소스 이름 - 주요 식별자 */
  name: {
    minWidth: '150px',
    maxWidth: '300px',
    flex: 1,
  },

  /** 설명 텍스트 - 긴 내용 */
  description: {
    minWidth: '200px',
    flex: 2,
  },

  /** 이벤트 메시지 */
  message: {
    minWidth: '200px',
    flex: 2,
  },

  /** 상태 이유 */
  reason: {
    minWidth: '120px',
    maxWidth: '200px',
    flex: 1,
  },

  /** 컨테이너 이미지 */
  image: {
    minWidth: '120px',
    maxWidth: '250px',
    flex: 1,
  },

  /** 소스/타겟 */
  source: {
    minWidth: '100px',
    flex: 1,
  },

  /** 네트워크 이름 */
  network: {
    minWidth: '120px',
    flex: 1,
  },
} as const;

/* ----------------------------------------
   Helper Functions
   ---------------------------------------- */

/**
 * 컬럼 키에 해당하는 너비를 반환합니다.
 * 고정 너비가 없으면 flex 프리셋을 반환합니다.
 */
export function getColumnPreset(
  key: string
): { width?: string } | { minWidth?: string; maxWidth?: string; flex?: number } | undefined {
  if (key in columnWidths) {
    return { width: columnWidths[key as keyof typeof columnWidths] };
  }
  if (key in flexColumnPresets) {
    return flexColumnPresets[key as keyof typeof flexColumnPresets];
  }
  return undefined;
}

/**
 * 여러 컬럼에 프리셋을 일괄 적용합니다.
 */
export function applyColumnPresets<T extends { key: string }>(
  columns: T[]
): (T & { width?: string; minWidth?: string; maxWidth?: string; flex?: number })[] {
  return columns.map((column) => {
    const preset = getColumnPreset(column.key);
    if (preset) {
      return { ...column, ...preset };
    }
    return column;
  });
}

export type ColumnWidthKey = keyof typeof columnWidths;
export type FlexColumnKey = keyof typeof flexColumnPresets;
