import type { HttpMethod } from './apiUtils';

/**
 * 현재 앱의 AppFrame이 focused된 윈도우인지 확인 (이 함수는 AppFrame 컴포넌트의 data-focused 속성을 확인하기 때문에 해당 컴포넌트에 의존성이 걸려있음)
 *
 * @returns 'true' | 'false' | 'not-in-appframe'
 * 'true' : focused된 윈도우
 * 'false' : focused된 윈도우가 아님
 * 'not-in-appframe' : 앱프레임을 통한 리모트환경이 아님
 */
const checkIsFocusedAppFrame = (remoteAppRef: HTMLDivElement | null) => {
  const appFrame = remoteAppRef?.closest<HTMLElement>('[data-focused]');

  if (!appFrame) {
    return 'not-in-appframe';
  }

  return appFrame.getAttribute('data-focused') === 'true' ? 'true' : 'false';
};

/**
 * 전역 토스트 디스패치
 *
 * @param toast 토스트 타입
 */
const dispatchGlobalToast = (toast: ToastType) => {
  window.dispatchEvent(
    new CustomEvent<ToastType>('global-toast', {
      detail: toast,
    })
  );
};

/**
 * 임시 알람 디스패치 함수 (추후 속성 규격 변경 필요)
 */
const dispatchGlobalNotification = (toastContent: ToastType) => {
  window.dispatchEvent(
    new CustomEvent('add-notification', {
      detail: {
        id: `notification-${Date.now()}`,
        appId: 'system.notification-center',
        title: toastContent.message ?? '알림',
        message: toastContent.description ?? '',
        type:
          toastContent.type === 'negative'
            ? 'error'
            : toastContent.type === 'positive'
              ? 'success'
              : 'info',
        timestamp: new Date(),
        read: false,
        dismissed: false,
        persistent: toastContent.type === 'negative',
        priority: toastContent.type === 'negative' ? 'high' : 'normal',
        source: 'system',
      },
    })
  );
};

const SUCCESS_MESSAGES: Readonly<Record<HttpMethod, string>> = {
  GET: 'Data fetched successfully.',
  POST: 'Resource created successfully.',
  PUT: 'Resource updated successfully.',
  PATCH: 'Resource updated successfully.',
  DELETE: 'Resource deleted successfully.',
} as const;

const ERROR_MESSAGES: Readonly<Record<HttpMethod, string>> = {
  GET: 'Failed to fetch data.',
  POST: 'Failed to create resource.',
  PUT: 'Failed to update resource.',
  PATCH: 'Failed to update resource.',
  DELETE: 'Failed to delete resource.',
} as const;

type CreateDefaultToastParams = {
  httpMethod?: HttpMethod;
  isSuccess: boolean;
};

/**
 * HTTP 메소드에 따른 기본 토스트 메시지 생성
 *
 * @param httpMethod HTTP 메소드 (undefined일 경우 generic 메시지 사용)
 * @param isSuccess 성공 여부
 * @returns 기본 토스트 메시지
 */
const createDefaultToast = ({ httpMethod, isSuccess }: CreateDefaultToastParams): ToastType => {
  if (isSuccess) {
    return {
      message: httpMethod ? SUCCESS_MESSAGES[httpMethod] : 'Request succeeded.',
      type: 'positive',
    };
  }

  return {
    message: httpMethod ? ERROR_MESSAGES[httpMethod] : 'Request failed.',
    type: 'negative',
  };
};

type ShowToastParams = {
  toastContent?: ToastType;
  httpMethod?: HttpMethod;
  isSuccess: boolean;
  errorDescription?: string;
  remoteAppRef: HTMLDivElement | null;
  showToast: (toast: ToastType) => void;
};

/**
 * 토스트를 띄우는 함수
 *
 * @param toastContent 토스트 컨텐츠 (선택값)
 *   - 성공 케이스: 명시적인 컨텐츠가 없으면 토스트를 띄우지 않음
 *   - 에러 케이스: 명시적인 컨텐츠가 없으면 httpMethod 기반 기본 메시지 생성
 * @param httpMethod HTTP 메소드 (필수)
 * @param isSuccess 성공 여부
 * @param errorDescription 에러 상세 설명 (에러 케이스에서 description으로 자동 추가)
 * @param remoteAppRef 리모트 앱 내부 div 참조
 * @param showToast toast.custom 메소드로 Toast 컴포넌트를 띄우는 콜백 (컴포넌트 -> utils로 참조가 불가능하여 외부에서 주입될 수 있도록 함)
 */
const showToastWithNotification = ({
  toastContent,
  httpMethod,
  isSuccess,
  errorDescription,
  remoteAppRef,
  showToast,
}: ShowToastParams) => {
  // 단순 GET 요청 성공에는 토스트를 띄우지 않음
  if (isSuccess && httpMethod === 'GET') {
    return;
  }

  /** 현재 앱의 AppFrame이 focused된 윈도우인지 확인 */
  const isFocusedAppFrame = checkIsFocusedAppFrame(remoteAppRef);

  /** toastContent가 없으면 httpMethod 기반 기본 메시지 생성 (에러 케이스만) */
  let finalToastContent = toastContent ?? createDefaultToast({ httpMethod, isSuccess });

  /** 에러 케이스에서 errorDescription이 있으면 description에 추가 */
  if (!isSuccess && errorDescription && !finalToastContent.description) {
    finalToastContent = {
      ...finalToastContent,
      description: errorDescription,
    };
  }

  // 글로벌 알림 이벤트 디스패치
  dispatchGlobalNotification(finalToastContent);

  // 포커스된 윈도우이거나 앱프레임을 통한 리모트환경이 아니라면 해당 윈도우에서 토스트를 띄우는 콜백 호출
  if (isFocusedAppFrame === 'true' || isFocusedAppFrame === 'not-in-appframe') {
    showToast(finalToastContent);
  }

  // 포커스된 윈도우가 아니라면 전역 토스트를 띄우는 이벤트 디스패치
  if (isFocusedAppFrame === 'false') {
    dispatchGlobalToast(finalToastContent);
  }
};

export { checkIsFocusedAppFrame, createDefaultToast, showToastWithNotification };
