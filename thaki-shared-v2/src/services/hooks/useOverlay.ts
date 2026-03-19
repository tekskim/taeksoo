import { useContext } from 'react';
import { OverlayContext } from '../providers/OverlayProvider';

/**
 * @description 오버레이(모달, 드로어) 관리를 위한 커스텀 훅
 *
 * OverlayProvider 내부에서 오버레이를 열고 닫는 기능을 제공합니다.
 * Promise 기반으로 동작하여 사용자의 응답(확인/취소)을 async/await로 처리할 수 있습니다.
 *
 * @returns {Object} 오버레이 관리 객체
 * @returns {Function} returns.openOverlay - 오버레이를 여는 함수. Promise를 반환하여 사용자 응답을 처리
 * @returns {Function} returns.closeOverlayById - 특정 ID의 오버레이를 닫는 함수
 * @returns {OverlayStoreApi} returns.overlayStore - Zustand 오버레이 스토어 (고급 사용)
 *
 * @throws {Error} OverlayProvider 외부에서 사용 시 에러 발생
 *
 * @example
 * ```tsx
 * import { useOverlay } from '@thaki/shared';
 *
 * const MyComponent = () => {
 *   const { openOverlay } = useOverlay();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await openOverlay({
 *       component: DeleteConfirmModal,
 *       props: { itemName: 'User' },
 *       options: {
 *         type: 'modal',
 *         title: 'Delete User',
 *         description: 'Are you sure you want to delete this user?',
 *       },
 *     });
 *
 *     if (confirmed) {
 *       // 사용자가 확인을 눌렀을 때의 로직
 *       await deleteUser();
 *     }
 *   };
 *
 *   return <Button onClick={handleDelete}>Delete</Button>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 드로어 사용 예시
 * const handleEdit = async () => {
 *   const result = await openOverlay({
 *     component: UserEditDrawer,
 *     props: { user },
 *     options: {
 *       type: 'drawer-horizontal',
 *       size: 'md',
 *       title: 'Edit User',
 *     },
 *   });
 *
 *   if (result) {
 *     // 수정된 데이터 처리
 *     console.log('Updated user:', result);
 *   }
 * };
 * ```
 */
const useOverlay = () => {
  const overlayContext = useContext(OverlayContext)!;

  if (!overlayContext) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }

  return overlayContext;
};

export default useOverlay;
