/**
 * 차트 단위 포매팅 유틸리티 함수
 */

const trimTrailingZeros = (value: string): string => {
  return value.replace(/\.?0+$/, '');
};

/**
 * 기본 숫자 표시 정책
 * - < 10: 소수 2자리
 * - 10 ~ 100: 소수 2자리 (0이면 생략)
 * - >= 100: 정수 (>= 1000은 천 단위 콤마)
 */
const formatNumberByScale = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1000) {
    return Math.round(value).toLocaleString();
  }
  if (absValue >= 100) {
    return Math.round(value).toString();
  }
  return trimTrailingZeros(value.toFixed(2));
};

const formatWithUnit = (value: number, unit: string): string => {
  return `${formatNumberByScale(value)} ${unit}`;
};

const formatOneDecimal = (value: number): string => {
  return trimTrailingZeros(value.toFixed(1));
};

/**
 * ops/s 단위를 K/M/B 축약으로 포맷팅
 */
const formatOpsPerSec = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${formatOneDecimal(value / 1_000_000_000)}B ops/s`;
  }
  if (absValue >= 1_000_000) {
    return `${formatOneDecimal(value / 1_000_000)}M ops/s`;
  }
  if (absValue >= 1_000) {
    return `${formatOneDecimal(value / 1_000)}K ops/s`;
  }
  return `${formatNumberByScale(value)} ops/s`;
};

/**
 * packets/s 단위를 K/M/B 축약으로 포맷팅
 */
const formatPacketsPerSec = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${formatOneDecimal(value / 1_000_000_000)}B p/s`;
  }
  if (absValue >= 1_000_000) {
    return `${formatOneDecimal(value / 1_000_000)}M p/s`;
  }
  if (absValue >= 1_000) {
    return `${formatOneDecimal(value / 1_000)}K p/s`;
  }
  return `${formatNumberByScale(value)} p/s`;
};

/**
 * 바이트 단위(B/ KiB / MiB / GiB / TiB / PiB) 자동 변환
 */
export const formatBytesFromUnit = (value: number, unit: string): string => {
  if (unit === 'B') {
    if (value >= 1024 ** 5) {
      return formatWithUnit(value / 1024 ** 5, 'PiB');
    }
    if (value >= 1024 ** 4) {
      return formatWithUnit(value / 1024 ** 4, 'TiB');
    }
    if (value >= 1024 ** 3) {
      return formatWithUnit(value / 1024 ** 3, 'GiB');
    }
    if (value >= 1024 ** 2) {
      return formatWithUnit(value / 1024 ** 2, 'MiB');
    }
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'KiB');
    }
    return formatWithUnit(value, 'B');
  }
  if (unit === 'KiB') {
    if (value >= 1024 ** 3) {
      return formatWithUnit(value / 1024 ** 3, 'TiB');
    }
    if (value >= 1024 ** 2) {
      return formatWithUnit(value / 1024 ** 2, 'GiB');
    }
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'MiB');
    }
    return formatWithUnit(value, 'KiB');
  }
  if (unit === 'MiB') {
    if (value >= 1024 ** 2) {
      return formatWithUnit(value / 1024 ** 2, 'PiB');
    }
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'TiB');
    }
    return formatWithUnit(value, 'MiB');
  }
  if (unit === 'GiB') {
    if (value >= 1024 ** 2) {
      return formatWithUnit(value / 1024 ** 2, 'PiB');
    }
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'TiB');
    }
    return formatWithUnit(value, 'GiB');
  }
  if (unit === 'TiB') {
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'PiB');
    }
    return formatWithUnit(value, 'TiB');
  }
  if (unit === 'PiB') {
    return formatWithUnit(value, 'PiB');
  }
  return formatWithUnit(value, unit);
};

/**
 * KiB 단위를 사람이 읽기 쉬운 형식으로 포맷팅
 */
export const formatDataSize = (kib?: number | null): string => {
  if (kib === null || kib === undefined) return '-';
  if (kib === 0) return formatWithUnit(0, 'KiB');
  return formatBytesFromUnit(kib, 'KiB');
};

/**
 * 퍼센트 값을 포맷팅 (0-100 또는 0-1)
 */
export const formatPercentage = (percent?: number | null, asDecimal = false): string => {
  if (percent === null || percent === undefined) return '-';
  const value = asDecimal ? percent * 100 : percent;
  return `${formatOneDecimal(value)}%`;
};

/**
 * 바이트 단위를 사람이 읽기 쉬운 형식으로 포맷팅
 */
export const formatBytes = (bytes?: number | null): string => {
  if (bytes === null || bytes === undefined) return '-';
  if (bytes === 0) return formatWithUnit(0, 'B');
  return formatBytesFromUnit(bytes, 'B');
};

/**
 * unit 기준으로 숫자를 표시 단위로 변환
 */
const normalizeChartUnit = (unit: string): string => {
  const trimmedUnit = unit.trim();
  const lowerUnit = trimmedUnit.toLowerCase();
  if (lowerUnit === 'percent') return '%';
  if (
    lowerUnit === 'b/s' ||
    lowerUnit === 'bps' ||
    lowerUnit === 'bytes/s' ||
    lowerUnit === 'byte/s'
  ) {
    return 'B/s';
  }
  if (lowerUnit === 'p/s' || lowerUnit === 'pps' || lowerUnit === 'packets/s') {
    return 'p/s';
  }
  return trimmedUnit;
};

export const formatChartValueByUnit = (value: number, unit: string): string => {
  const trimmedUnit = normalizeChartUnit(unit);
  if (!trimmedUnit) {
    return formatNumberByScale(value);
  }
  if (trimmedUnit === '%') {
    return `${formatOneDecimal(value)}%`;
  }
  if (trimmedUnit === 'B/s') {
    if (value >= 1024 ** 3) {
      return formatWithUnit(value / 1024 ** 3, 'GiB/s');
    }
    if (value >= 1024 ** 2) {
      return formatWithUnit(value / 1024 ** 2, 'MiB/s');
    }
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'KiB/s');
    }
    return formatWithUnit(value, 'B/s');
  }
  if (trimmedUnit === 'MiB/s') {
    if (value >= 1024) {
      return formatWithUnit(value / 1024, 'GiB/s');
    }
    return formatWithUnit(value, 'MiB/s');
  }
  if (trimmedUnit === 'ops/s' || trimmedUnit === 'IOPS') {
    return formatOpsPerSec(value);
  }
  if (trimmedUnit === 'p/s') {
    return formatPacketsPerSec(value);
  }
  if (trimmedUnit === 'req/s') {
    return formatWithUnit(value, 'req/s');
  }
  if (trimmedUnit === 'ms') {
    if (value >= 1000) {
      return `${formatOneDecimal(value / 1000)} s`;
    }
    return `${formatOneDecimal(value)} ms`;
  }
  if (trimmedUnit === 'ns') {
    if (value >= 1_000_000) {
      return `${formatOneDecimal(value / 1_000_000)} ms`;
    }
    if (value >= 1_000) {
      return `${formatOneDecimal(value / 1_000)} μs`;
    }
    return formatWithUnit(value, 'ns');
  }
  if (trimmedUnit === 'μs' || trimmedUnit === 'us') {
    if (value >= 1_000) {
      return `${formatOneDecimal(value / 1_000)} ms`;
    }
    return formatWithUnit(value, 'μs');
  }
  if (
    trimmedUnit === 'B' ||
    trimmedUnit === 'KiB' ||
    trimmedUnit === 'MiB' ||
    trimmedUnit === 'GiB' ||
    trimmedUnit === 'TiB' ||
    trimmedUnit === 'PiB'
  ) {
    return formatBytesFromUnit(value, trimmedUnit);
  }
  return formatWithUnit(value, trimmedUnit);
};
