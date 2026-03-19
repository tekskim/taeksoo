import type { ReactElement } from 'react';
import React from 'react';
import { cn } from '../../services';
import { Button } from '../Button';
import type { OverlayProps } from '../Overlay';
import { Overlay } from '../Overlay';
import {
  actionModalStyles,
  footerContainerStyles,
  modalContentStyles,
} from './ActionModal.styles';

/**
 * 액션 설정 인터페이스
 */
export interface ActionConfig {
  /** 모달 제목 */
  title: string;
  /** 모달 부제목/설명 */
  subtitle?: string;
  /** 확인 버튼 텍스트 */
  actionButtonText: string;
  /** 확인 버튼 스타일 */
  actionButtonVariant: 'error' | 'primary' | 'secondary';
  /** 취소 버튼 텍스트 */
  cancelButtonText?: string;
}

export interface ActionModalProps
  extends Omit<OverlayProps, 'title' | 'description' | 'children'> {
  /** 액션 설정 */
  actionConfig: ActionConfig;
  /** 확인 버튼 클릭 시 호출되는 콜백 */
  onAction?: () => void | Promise<void>;
  /** 모달이 열릴 때 확인 버튼에 자동 포커스를 줄지 여부 (기본: true) */
  focusActionButtonOnOpen?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 로딩 중 버튼 텍스트 */
  loadingText?: string;
  /** 확인 버튼 비활성화 여부 */
  confirmDisabled?: boolean;
  /** 모달 내용 */
  children?: React.ReactNode;
}

/**
 * 범용 액션 모달 컴포넌트
 *
 * Overlay.Template 기반의 추상화된 액션 모달로,
 * 확인/취소 버튼과 기본 레이아웃을 제공합니다.
 */
const ActionModal = ({
  actionConfig,
  onAction,
  onConfirm,
  onCancel,
  appeared = false,
  focusActionButtonOnOpen = true,
  isLoading = false,
  loadingText = 'Processing...',
  confirmDisabled = false,
  children,
  className,
  ...props
}: ActionModalProps): ReactElement => {
  const actionButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!focusActionButtonOnOpen || !appeared) {
      return;
    }

    actionButtonRef.current?.focus();
  }, [appeared, focusActionButtonOnOpen]);

  const handleConfirmClick = async (): Promise<void> => {
    await onAction?.();
    onConfirm(true);
  };

  const isButtonDisabled = isLoading || confirmDisabled;

  return (
    <Overlay.Template
      {...props}
      type="modal"
      appeared={appeared}
      className={cn(actionModalStyles, className)}
      onConfirm={handleConfirmClick}
      onCancel={onCancel}
      title={actionConfig.title}
      description={actionConfig.subtitle}
      footer={
        <div className={footerContainerStyles}>
          <Button
            variant="secondary"
            appearance="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {actionConfig.cancelButtonText ?? 'Cancel'}
          </Button>
          <Button
            ref={actionButtonRef}
            variant={actionConfig.actionButtonVariant}
            onClick={handleConfirmClick}
            disabled={isButtonDisabled}
          >
            {isLoading ? loadingText : actionConfig.actionButtonText}
          </Button>
        </div>
      }
    >
      {children && <div className={modalContentStyles}>{children}</div>}
    </Overlay.Template>
  );
};

export default ActionModal;
