type TokenType =
  | 'access_token'
  | 'refresh_token_ref'
  | 'scoped_token'
  | 'project_id';

const getFromStorage = (tokenType: TokenType) => {
  return localStorage.getItem(tokenType);
};

type SetToStorage = { tokenType: TokenType; token: string };

const setToStorage = (...args: SetToStorage[]) => {
  for (const { tokenType, token } of args) {
    if (token) {
      localStorage.setItem(tokenType, token);
    }
  }
};

const removeFromStorage = (...args: TokenType[]) => {
  for (const tokenType of args) {
    if (tokenType) {
      localStorage.removeItem(tokenType);
    }
  }
};

const getAuthTokenHeaderFromStorage = () => {
  const accessToken = getFromStorage('access_token');

  return {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

/**
 * Compute API용 인증 헤더 생성 (scoped token + project_id)
 */
const getComputeAuthHeadersFromStorage = () => {
  const scopedToken = getFromStorage('scoped_token');
  const projectId = getFromStorage('project_id');

  return {
    ...(scopedToken ? { Authorization: `Bearer ${scopedToken}` } : {}),
    ...(projectId ? { 'X-Project-Id': projectId } : {}),
  };
};

const LOGOUT_INTENT_KEY = 'platform:logout-intent';

/** 로그아웃 의도 플래그 설정 — LoginPage 자동 리다이렉트 방지용 */
const setLogoutIntent = () =>
  sessionStorage.setItem(LOGOUT_INTENT_KEY, 'true');

/** 로그아웃 의도 플래그 확인 */
const hasLogoutIntent = () =>
  sessionStorage.getItem(LOGOUT_INTENT_KEY) === 'true';

/** 로그아웃 의도 플래그 제거 */
const clearLogoutIntent = () =>
  sessionStorage.removeItem(LOGOUT_INTENT_KEY);

export {
  clearLogoutIntent,
  getAuthTokenHeaderFromStorage,
  getComputeAuthHeadersFromStorage,
  getFromStorage,
  hasLogoutIntent,
  removeFromStorage,
  setLogoutIntent,
  setToStorage,
};
