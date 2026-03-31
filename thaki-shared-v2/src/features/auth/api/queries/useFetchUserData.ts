import { useQuery } from '@tanstack/react-query';
import { getResultOrWithFallback } from '../../../../services/utils/apiUtils';

const URL = '/v1/auth/user/info';

const fetchUserData = async () => {
  // const { data } = await authClient.get(URL); // 추후에 파라미터 추가 아니면 jwt 토큰으로 조회

  // return data;

  return Promise.resolve({ id: '1', username: 'test', roles: ['admin'] });
};

/**
 * @description 현재 로그인한 사용자의 정보를 조회합니다. 앱을 킬 때 한 번 조회하고 그 이후로는 서버에서 조회하지 않게 위해 캐시타임을 24시간으로 가져갑니다.
 */
const useFetchUserData = () => {
  return getResultOrWithFallback({
    queryResult: useQuery({
      queryKey: [URL],
      queryFn: fetchUserData,
      staleTime: 1000 * 60 * 60 * 24, // 24시간
      gcTime: 1000 * 60 * 60 * 24, // 24시간
    }),
    fallbackData: {
      id: '',
      username: '',
      roles: [],
    },
  });
};

export default useFetchUserData;
