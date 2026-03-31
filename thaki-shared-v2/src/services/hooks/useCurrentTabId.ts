import { useContext } from 'react';
import { CurrentTabIdContext } from '../providers/CurrentTabIdProvider/CurrentTabIdContext';

/**
 * 현재 컴포넌트가 속한 탭의 ID를 반환합니다.
 * @returns 현재 탭 ID 또는 null (탭 컨텍스트 외부에서 사용 시)
 */
export const useCurrentTabId = (): string | null => {
  return useContext(CurrentTabIdContext);
};

export default useCurrentTabId;
