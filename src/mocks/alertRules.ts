// 제품 관리자가 사전 정의하여 제공하는 Alert Rule 목록 (정책서 0-3, §4)
// v1.0에서 사용자는 Alert Rule을 생성·수정·삭제할 수 없으며, 조회/참조만 가능하다.
// Delivery Settings의 Rule 매칭 조건 선택 시 이 목록을 참조한다.

export type AlertRuleSeverity = 'Critical' | 'Warning';

export type PredefinedAlertRule = {
  /** 고유 ID */
  id: string;
  /** 제품 관리자가 정의한 Alert Rule 이름 */
  name: string;
  /** Alert 자체의 조치 긴급도 (로그 레벨과 별개) */
  severity: AlertRuleSeverity;
  /** 짧은 설명 (참조용) */
  description: string;
};

export const PREDEFINED_ALERT_RULES: PredefinedAlertRule[] = [
  {
    id: 'rule-001',
    name: 'HighCpuUsage Rule',
    severity: 'Critical',
    description: 'CPU 사용률 임계치 초과',
  },
  {
    id: 'rule-002',
    name: 'DiskSpaceLow Rule',
    severity: 'Critical',
    description: '디스크 여유 공간 부족',
  },
  {
    id: 'rule-003',
    name: 'LogRateSpike Rule',
    severity: 'Warning',
    description: '로그 발생량 급증',
  },
  {
    id: 'rule-004',
    name: 'MemoryPressure Rule',
    severity: 'Warning',
    description: '메모리 사용률 임계치 초과',
  },
  {
    id: 'rule-005',
    name: 'CertExpiry Rule',
    severity: 'Warning',
    description: 'TLS 인증서 만료 임박',
  },
  {
    id: 'rule-006',
    name: 'PodCrashLoop Rule',
    severity: 'Critical',
    description: 'Pod 반복 크래시',
  },
  {
    id: 'rule-007',
    name: 'NetworkLatency Rule',
    severity: 'Warning',
    description: '네트워크 지연 임계치 초과',
  },
  {
    id: 'rule-008',
    name: 'ErrorRateHigh Rule',
    severity: 'Critical',
    description: '에러율 임계치 초과',
  },
];
