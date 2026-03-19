import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { Toast } from '../../../../../components';
import { createQueryClientConfig } from '../../../../../services';
import useFetchUserData from '../../../api/queries/useFetchUserData';

/** Toast callback - handles UI rendering */
const showToast = (content: ToastType): void => {
  toast.custom(id => (
    <Toast {...content} handleDismiss={() => toast.dismiss(id)} />
  ));
};

/**
 * 인증 전용 QueryClient 설정
 * - 사용자 데이터는 24시간 동안 캐시되어 재요청 없이 사용 (사실 윈도우를 닫기 전까지 언마운트되지 않으므로, 데이터 변경 x)
 */
const queryClient = new QueryClient(
  createQueryClientConfig({
    showToast,
    getRemoteAppRef: () => null, // AuthProvider는 AppFrame 외부에서 사용됨
    defaultQueryOptions: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  })
);

/**
 * 인증 컨텍스트
 * - 현재 로그인한 사용자 데이터를 제공
 */
const AuthContext = createContext<ReturnType<typeof useFetchUserData> | null>(
  null
);

/**
 * 사용자 데이터 Provider 내부 컴포넌트
 * - 사용자 데이터를 조회하고 Context에 제공
 * - 에러 발생 시 상위 ErrorProvider로 전파
 */
const UserData = ({ children }: { children: React.ReactNode }) => {
  const userData = useFetchUserData();

  // 나중에 여기서 useAuth를 호출하고 이걸 하나의 컨텍스트로 관리??????

  const value = useMemo(() => userData, [userData]);

  // 각 앱의 전역 프로바이더(App.tsx의 ErrorProvider)에서 캐치할 수 있도록 에러를 던집니다.
  if (value.isError) {
    throw value.error;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 인증 Provider
 * - 별도의 QueryClient로 사용자 인증 상태를 관리
 * - 앱 최상위에 한 번만 선언 (App.tsx)
 * - useAuth 훅으로 로그인/로그아웃/사용자 데이터에 접근
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <UserData>{children}</UserData>
    </QueryClientProvider>
  );
};

export default AuthProvider;
export { AuthContext };
