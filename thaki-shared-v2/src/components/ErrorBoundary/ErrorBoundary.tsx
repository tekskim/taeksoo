import React from 'react';

/**
 * ErrorBoundary의 속성
 * @member children - 자식 UI.
 * @member fallback - 에러가 발생했을 때 표시할 폴백 UI.
 * @member hasRestored - 에러가 발생했을 때 폴백 UI를 표시한 후 에러가 해결되었는지 여부.
 * @member onError - 에러가 발생했을 때 호출할 함수.
 */
type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  hasRestored?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

/**
 * ErrorBoundary의 상태
 * @member hasError - 자식 UI에서 에러가 발생했는지 여부에 대한 상태.
 */
type State = {
  hasError: boolean;
};

/**
 * 기본 폴백 UI
 * 서비스에서 기본으로 제공할 fallback UI
 */
const DEFAULT_FALLBACK = <>-</>;

/**
 * ErrorBoundary 컴포넌트
 * 자식 UI에서 에러가 발생하면 폴백 UI를 표시합니다.
 * @param props.children - 자식 UI
 * @param props.fallback - 폴백 UI
 * @param props.onError - 에러가 발생했을 때 호출할 함수.
 * @returns 자식 UI 또는 폴백 UI
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    // logErrorToMyService(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    // hasRestored prop이 true로 변경되면 에러 상태를 초기화합니다.
    if (
      !prevProps.hasRestored &&
      this.props.hasRestored &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return this.props.fallback || DEFAULT_FALLBACK;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { Props as ErrorBoundaryProps };
