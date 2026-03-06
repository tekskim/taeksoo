/**
 * Notion 페이지 ID 매핑
 *
 * 각 컴포넌트/페이지의 slug를 Notion 페이지 ID에 매핑합니다.
 * Notion 페이지 URL에서 마지막 32자리 hex가 페이지 ID입니다.
 * 예: https://www.notion.so/thakicloud/Page-Title-2b79eddc34e6809a96f3d95192282bba
 *     → ID: 2b79eddc34e6809a96f3d95192282bba
 *
 * 새 매핑을 추가하려면:
 * 1. Notion에서 가이드라인 페이지를 생성
 * 2. 해당 페이지를 Notion Integration과 공유
 * 3. 아래 매핑에 slug: pageId 추가
 * 4. `npm run sync-notion` 실행
 */
export const notionMapping: Record<string, string> = {
  // Foundation
  'ux-writing': '2a49eddc34e6806289f7c36e59461385',

  // Components
  button: '2b79eddc34e6809a96f3d95192282bba',
  'status-indicator': '30d9eddc34e680099ef9c4aa24614fbb',
  // 'input': '',
  // 'modal': '',
  // 'select': '',
  // 'table': '',
};

/** Notion 페이지 URL 생성 (편집 링크용) */
export function getNotionEditUrl(pageId: string): string {
  return `https://www.notion.so/${pageId.replace(/-/g, '')}`;
}
