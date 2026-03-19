/**
 * Global Context Store
 *
 * Platform/MFE에서 설정하고 API 헤더에서 사용하는 전역 컨텍스트입니다.
 * Frame 포커스와 무관하게 일관된 값을 유지합니다.
 *
 * @example
 * // Platform에서 도메인 변경 시
 * import { setGlobalDomainId } from '@thaki/shared';
 * setGlobalDomainId(orgId);
 *
 * // User 앱에서 프로젝트 변경 시
 * import { setGlobalProjectId } from '@thaki/shared';
 * setGlobalProjectId(projectId);
 */

// ============================================================================
// Domain ID (Admin API용)
// ============================================================================

let globalDomainId: string | null = null;

/**
 * 전역 domainId를 설정합니다.
 * Platform의 도메인 변경 시 호출됩니다.
 */
export const setGlobalDomainId = (domainId: string | null): void => {
  globalDomainId = domainId;
};

/**
 * 전역 domainId를 가져옵니다.
 * Admin API 호출 시 X-Domain-Id 헤더에 사용됩니다.
 */
export const getGlobalDomainId = (): string | null => {
  return globalDomainId;
};

// ============================================================================
// Project ID (User API용)
// ============================================================================
