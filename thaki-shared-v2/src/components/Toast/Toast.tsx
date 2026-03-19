import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

import { cn } from '../../services';
import {
  ChevronDownIcon,
  CloseSmallIcon,
  ToastErrorIcon,
  ToastSuccessIcon,
} from '../Icon';

import {
  appIconStyles,
  closeButtonStyles,
  descriptionContainerStyles,
  descriptionStyles,
  expandButtonStyles,
  expandIconStyles,
  messageStyles,
  resourceNameBadgeStyles,
  statusIconStyles,
  timestampStyles,
  toastContainerStyles,
  toastContentStyles,
  toastRightSectionStyles,
  toastStyles,
  viewDetailTextStyles,
} from './Toast.styles';

/**
 * 타임스탬프를 hh:mm 형식으로 포맷하는 순수 함수
 * @param timestamp - milliseconds from Date.now()
 * @returns hh:mm 형식의 시간 문자열 (예: "14:32")
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Toast 데이터 타입 (handleDismiss 제외)
 */
export interface ToastType {
  /** 토스트 타입 */
  type?: 'positive' | 'negative';
  /** 타임스탬프 (milliseconds from Date.now()) */
  timestamp?: number;
  /** 앱 식별 아이콘 */
  appIcon?: ReactElement;
  /** 토스트 메시지 */
  message: string;
  /** 토스트 설명 */
  description?: string;
  /** 리소스 이름 (프로젝트명 등) */
  resourceName?: string | null;
  /** 클릭 시 네비게이션 함수 */
  onNavigate?: () => void;
}

/**
 * @description
 * Toast 컴포넌트에서 사용하는 공개 속성입니다.
 *
 * @property type - 토스트의 상태 유형 (기본값: 'negative')
 * @property message - 토스트 메시지 (필수)
 * @property description - 토스트 설명 (선택값)
 * @property resourceName - 리소스 이름 (선택값, 프로젝트명 등)
 * @property handleDismiss - 토스트 닫기 핸들러 (필수)
 * @property timestamp - 타임스탬프 (선택값, milliseconds from Date.now())
 * @property appIcon - 앱 식별 아이콘 (선택값, 각 앱에서 주입)
 */
export interface Props extends ToastType {
  handleDismiss: () => void;
}

/**
 * [Design System] 토스트 알림 컴포넌트
 *
 * 사용자에게 상태 메시지를 전달하는 간결한 알림 UI입니다.
 * sonner 라이브러리 기반으로 동작하며, handleDismiss 콜백을 통해 닫기 동작을 처리합니다.
 *
 * @example
 * // 기본 사용법: toast.custom + Toast 컴포넌트
 * import { toast } from 'sonner';
 * import { Toast } from '@thaki/shared';
 *
 * toast.custom(id => (
 *   <Toast
 *     type="positive"
 *     message='Instance "web-server-01" created successfully.'
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 *
 * @example
 * // 에러 알림
 * toast.custom(id => (
 *   <Toast
 *     type="negative"
 *     message='Failed to create instance "web-server-01".'
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 *
 * @example
 * // 타임스탬프 및 앱 아이콘 포함 (각 앱의 QueryProvider에서 주입)
 * toast.custom(id => (
 *   <Toast
 *     type="positive"
 *     message='Instance created successfully.'
 *     timestamp={Date.now()}
 *     appIcon={<ComputeIcon size={16} />}
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 *
 * @example
 * // 리소스 이름(프로젝트명) 포함
 * toast.custom(id => (
 *   <Toast
 *     type="positive"
 *     message='Instance "web-server-01" created successfully.'
 *     resourceName="Proj1"
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 *
 * @param type - 상태 유형 ('positive' = 성공 | 'negative' = 오류)
 * @param message - 메시지 텍스트
 * @param resourceName - 리소스 이름 (선택값, 프로젝트명 등 배지 형태로 표시)
 * @param timestamp - 타임스탬프(ms, `Date.now()` 형식)
 * @param appIcon - 앱 식별 아이콘 (각 앱에서 주입, 예: <ComputeIcon size={16} />)
 * @param handleDismiss - 토스트 닫기 핸들러 (필수)
 */
const Toast = ({
  type = 'negative',
  message,
  description,
  resourceName,
  timestamp,
  appIcon,
  onNavigate,
  handleDismiss,
}: Props): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsExpanded(prev => !prev);
    },
    []
  );

  return (
    <div
      className={cn(toastStyles({ clickable: Boolean(onNavigate) }))}
      role={type === 'positive' ? 'status' : 'alert'}
      aria-live={type === 'positive' ? 'polite' : 'assertive'}
      onClick={() => {
        if (onNavigate) {
          onNavigate();
        }
      }}
    >
      <div className={cn(toastContainerStyles)}>
        {/* Status Icon */}
        {type === 'positive' ? (
          <ToastSuccessIcon
            size={15}
            color="var(--primitive-color-green400)"
            className={cn(statusIconStyles({ type }))}
          />
        ) : (
          <ToastErrorIcon
            size={15}
            color="var(--primitive-color-orange600)"
            className={cn(statusIconStyles({ type }))}
          />
        )}

        {/* Message Content */}
        <div className={cn(toastContentStyles)}>
          <p className={cn(messageStyles)}>{message}</p>
          {resourceName && (
            <span className={cn(resourceNameBadgeStyles)}>{resourceName}</span>
          )}
        </div>

        {/* Right Section: Close Button + Timestamp + App Icon */}
        <div className={cn(toastRightSectionStyles)}>
          <button
            type="button"
            className={cn(closeButtonStyles)}
            onClick={e => {
              e.stopPropagation();
              handleDismiss();
            }}
            aria-label="토스트 닫기"
          >
            <CloseSmallIcon size={16} color="currentColor" />
          </button>
          {timestamp && (
            <span className={cn(timestampStyles)}>
              {formatTimestamp(timestamp)}
            </span>
          )}
          {appIcon && <div className={cn(appIconStyles)}>{appIcon}</div>}
        </div>
      </div>

      {/* View Detail Button - Bottom Right */}
      {description && (
        <div className="flex flex-col items-end mt-1 gap-2">
          <button
            type="button"
            className={cn(expandButtonStyles)}
            onClick={handleToggleExpand}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide details' : 'View details'}
          >
            <span className={cn(viewDetailTextStyles)}>
              {isExpanded ? 'Hide' : 'View'} Detail
            </span>
            <ChevronDownIcon
              size={12}
              className={cn(
                expandIconStyles({ expanded: isExpanded }),
                'text-text-subtle'
              )}
            />
          </button>
          {isExpanded && (
            <div className={cn(descriptionContainerStyles)}>
              <p className={cn(descriptionStyles)}>{description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Toast;
