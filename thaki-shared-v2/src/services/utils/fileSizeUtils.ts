/**
 * 데이터 크기를 사람이 읽기 쉬운 형식으로 포맷팅
 *
 * @param bytes - 바이트 단위의 크기
 * @param unit - 기본 단위 ('MB' | 'GB')
 * @returns 포맷팅된 크기 문자열
 */
export const formatDataSize = (bytes: number, unit: 'MB' | 'GB' = 'GB'): string => {
  if (bytes === 0) return '0 ' + unit;

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // 요청된 단위에 맞춰 변환
  if (unit === 'MB' && i >= 2) {
    return parseFloat((bytes / Math.pow(k, 2)).toFixed(1)) + ' MB';
  } else if (unit === 'GB' && i >= 3) {
    return parseFloat((bytes / Math.pow(k, 3)).toFixed(1)) + ' GB';
  }

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 포맷팅
 * 자동으로 적절한 단위(Bytes, KB, MB, GB)를 선택
 *
 * @param bytes - 바이트 단위의 파일 크기
 * @returns 포맷팅된 파일 크기 문자열 (예: "1.5 MB", "350 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
