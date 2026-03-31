/**
 * 날짜 및 시간 포맷팅 유틸리티 함수들
 */

/**
 * 현재 로케일 가져오기
 * localStorage에서 저장된 언어 설정을 읽어옵니다.
 */
const getCurrentLocale = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('thaki_suite_language') || 'ko';
  }
  return 'ko';
};

/**
 * 영문 월 이름 배열
 */
const MONTH_NAMES_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * 날짜를 로케일에 맞게 포맷팅
 * - EN: MMM DD, YYYY (e.g., "Jan 16, 2026")
 * - KO/기타: YYYY-MM-DD (e.g., "2026-01-16")
 *
 * @param date - Date 객체
 * @param locale - 로케일 (옵션, 기본값: 현재 로케일)
 * @returns 포맷팅된 날짜 문자열
 */
const formatDateByLocale = (date: Date, locale?: string): string => {
  const currentLocale = locale || getCurrentLocale();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if (currentLocale === 'en') {
    // EN: MMM DD, YYYY
    const monthName = MONTH_NAMES_EN[month];
    const paddedDay = String(day).padStart(2, '0');
    return `${monthName} ${paddedDay}, ${year}`;
  }

  // KO and others: YYYY-MM-DD
  const paddedMonth = String(month + 1).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
};

/**
 * 날짜 문자열을 로케일에 맞게 포맷팅
 * - EN: MMM DD, YYYY (e.g., "Jan 16, 2026")
 * - KO/기타: YYYY-MM-DD (e.g., "2026-01-16")
 *
 * @param dateString - ISO 날짜 문자열 또는 Date 객체로 변환 가능한 문자열
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 *   // locale: en
 *   formatDate('2025-09-10T12:30:00Z') // 'Sep 10, 2025'
 *   // locale: ko
 *   formatDate('2025-09-10T12:30:00Z') // '2025-09-10'
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // 유효하지 않은 날짜인 경우 '-' 반환
  if (isNaN(date.getTime())) {
    return '-';
  }

  return formatDateByLocale(date);
};

/**
 * 날짜 문자열을 로케일에 맞게 포맷팅 (시간 제외)
 * - EN: MMM DD, YYYY (e.g., "Jan 16, 2026")
 * - KO/기타: YYYY-MM-DD (e.g., "2026-01-16")
 *
 * @param dateString - ISO 날짜 문자열 또는 Date 객체로 변환 가능한 문자열
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 *   // locale: en
 *   formatDateOnly('2025-09-10T12:30:00Z') // 'Sep 10, 2025'
 *   // locale: ko
 *   formatDateOnly('2025-09-10T12:30:00Z') // '2025-09-10'
 */
export const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString);

  // 유효하지 않은 날짜인 경우 '-' 반환
  if (isNaN(date.getTime())) {
    return '-';
  }

  return formatDateByLocale(date);
};

/**
 * Date 객체를 ISO8601 날짜 형식(yyyy-mm-dd)으로 변환
 * API 요청 파라미터에 사용
 *
 * @param date - 변환할 Date 객체
 * @returns ISO8601 날짜 형식 문자열 (yyyy-mm-dd)
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 타임스탬프를 상대 시간으로 포맷팅 (e.g., "2 minutes ago")
 *
 * @param date - 포맷팅할 날짜
 * @returns 상대 시간 문자열
 *
 * @example
 *   formatRelativeTime(new Date(Date.now() - 60000)) // '1 minute ago'
 *   formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // Format as date for older notifications using locale-aware formatting
  return formatDateByLocale(date);
};

/**
 * 날짜와 시간을 로케일에 맞게 포맷팅
 * - EN: MMM DD, YYYY HH:MM (e.g., "Jan 16, 2026 14:30")
 * - KO/기타: YYYY-MM-DD HH:MM (e.g., "2026-01-16 14:30")
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷팅된 시간 문자열
 *
 * @example
 *   // locale: en
 *   formatAbsoluteTime(new Date('2025-10-22T11:43:00')) // 'Oct 22, 2025 11:43'
 *   // locale: ko
 *   formatAbsoluteTime(new Date('2025-10-22T11:43:00')) // '2025-10-22 11:43'
 */
export const formatAbsoluteTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '-';
  }

  const currentLocale = getCurrentLocale();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const datePart = formatDateByLocale(d, currentLocale);
  return `${datePart} ${hours}:${minutes}`;
};

/**
 * 날짜를 로케일에 맞게 포맷팅 (시간 제외)
 * - EN: MMM DD, YYYY (e.g., "Jan 16, 2026")
 * - KO/기타: YYYY-MM-DD (e.g., "2026-01-16")
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 *   // locale: en
 *   formatAbsoluteDate(new Date('2025-10-22')) // 'Oct 22, 2025'
 *   // locale: ko
 *   formatAbsoluteDate(new Date('2025-10-22')) // '2025-10-22'
 */
export const formatAbsoluteDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '-';
  }

  return formatDateByLocale(d);
};

/**
 * 날짜와 시간을 로케일에 맞게 포맷팅 (초 포함)
 * - EN: MMM DD, YYYY HH:MM:SS (e.g., "Jan 16, 2026 14:30:45")
 * - KO/기타: YYYY-MM-DD HH:MM:SS (e.g., "2026-01-16 14:30:45")
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷팅된 날짜-시간 문자열
 *
 * @example
 *   // locale: en
 *   formatAbsoluteDatetime(new Date('2025-07-25T09:12:20')) // 'Jul 25, 2025 09:12:20'
 *   // locale: ko
 *   formatAbsoluteDatetime(new Date('2025-07-25T09:12:20')) // '2025-07-25 09:12:20'
 */
export const formatAbsoluteDatetime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '-';
  }

  const currentLocale = getCurrentLocale();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  const datePart = formatDateByLocale(d, currentLocale);
  return `${datePart} ${hours}:${minutes}:${seconds}`;
};
