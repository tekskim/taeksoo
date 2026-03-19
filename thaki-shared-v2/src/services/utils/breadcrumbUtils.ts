/**
 * 홈 경로인지 확인
 */
const isHomePath = (path: string | undefined, homePath: string): boolean => {
  return path === homePath || !path;
};

/**
 * 경로에서 세그먼트 배열 추출
 */
const getPathSegments = (path: string): string[] => {
  return path.split('/').filter(Boolean);
};

/**
 * 세그먼트를 누적하여 전체 경로 배열 생성
 * 예: ['instances', 'create'] → ['/instances', '/instances/create']
 */
const buildCumulativePaths = (segments: string[]): string[] => {
  return segments.reduce<string[]>((paths, segment) => {
    const previousPath = paths[paths.length - 1] || '';
    return [...paths, `${previousPath}/${segment}`];
  }, []);
};

/**
 * 세그먼트를 사람이 읽을 수 있는 레이블로 변환 (fallback)
 */
const formatSegmentLabel = (segment: string): string => {
  const decoded = decodeURIComponent(segment);
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
};

export {
  buildCumulativePaths,
  formatSegmentLabel,
  getPathSegments,
  isHomePath,
};
