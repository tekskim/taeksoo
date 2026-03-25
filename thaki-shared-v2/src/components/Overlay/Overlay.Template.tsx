import React from 'react';
import { createPortal } from 'react-dom';
import { OverlayOptions } from '../../services/stores';
import { cn } from '../../services/utils/cn';
import { Button } from '../Button';
import { Dim } from '../Dim';
import {
  overlayBodyStyles,
  overlayButtonBaseStyles,
  overlayContentStyles,
  overlayDescriptionStyles,
  overlayDrawerFooterBorderStyles,
  overlayFooterWithButtonsStyles,
  overlayFooterStyles,
  overlayHeaderStyles,
  overlayModalButtonStyles,
  overlayStyles,
  overlayTitleStyles,
} from './Overlay.styles';

/**
 * @type 오버레이의 props 내부 인터페이스
 *
 * shared 패키지 외부로 노출되지 않고 shared/components/Overlay 폴더 안에서만 사용되는 오버레이 컴포넌트의 props 인터페이스
 *
 * 아래의 필드들은 개발자가 사용하는 외부에서 주입될 필요 X (Overlay.Container.tsx에서 직접 주입함)
 */
interface PrivateOverlayProps extends OverlayOptions {
  className?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  appeared: boolean;
  /** Shows loading spinner on confirm button */
  isLoading?: boolean;
  /** Disables confirm button */
  confirmDisabled?: boolean;
  /** Drawer type identifier for CSS scoping and E2E testing (adds data-drawer-type attribute) */
  drawerType?: string;
  /** Portal scope for Tailwind (internal) */
  portalScope?: string;
}

/**
 * @type 오버레이의 options 인터페이스
 *
 * 오버레이 컴포넌트의 props 타입을 선언할 때, 이 인터페이스를 import하여 확장해서 사용 필요 (스토리북 참고)
 */
interface Props extends Omit<PrivateOverlayProps, 'onConfirm'> {
  onConfirm: (result?: unknown) => void;
}

/** 기본 오버레이 생성, 제거 기간 ms */
const DEFAULT_DURATION_MS = 300;

/**
 * [Design System] 오버레이 템플릿 컴포넌트
 *
 * 모달, 드로어 등 오버레이 UI를 구성하는 템플릿입니다.
 *
 * @example
 * // 기본 모달
 * <Overlay.Template
 *   type="modal"
 *   title="확인"
 *   description="정말 삭제하시겠습니까?"
 *   appeared={isOpen}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 *   confirmUI="삭제"
 *   cancelUI="취소"
 * />
 *
 * @example
 * // 수평 드로어 (사이드 패널)
 * <Overlay.Template
 *   type="drawer-horizontal"
 *   size="md"
 *   title="설정 편집"
 *   appeared={isOpen}
 *   onConfirm={handleSave}
 *   onCancel={handleClose}
 * >
 *   <FormField label="이름">
 *     <Input value={name} onChange={handleChange} />
 *   </FormField>
 * </Overlay.Template>
 *
 * @example
 * // 수직 드로어 (바텀 시트)
 * <Overlay.Template
 *   type="drawer-vertical"
 *   title="옵션 선택"
 *   appeared={isOpen}
 *   onConfirm={handleSelect}
 *   onCancel={handleClose}
 * >
 *   <RadioGroup options={options} selectedValue={selected} onChange={setSelected} />
 * </Overlay.Template>
 *
 * @example
 * // 커스텀 푸터
 * <Overlay.Template
 *   type="modal"
 *   title="커스텀 액션"
 *   appeared={isOpen}
 *   onCancel={handleClose}
 *   footer={
 *     <Layout.HStack gap="sm">
 *       <Button variant="error" onClick={handleDelete}>삭제</Button>
 *       <Button variant="primary" onClick={handleSave}>저장</Button>
 *     </Layout.HStack>
 *   }
 * >
 *   내용
 * </Overlay.Template>
 *
 * @example
 * // 전역 포탈 (body에 렌더링)
 * <Overlay.Template type="modal" isGlobal appeared={isOpen} onCancel={onClose}>
 *   전역 모달 내용
 * </Overlay.Template>
 *
 * @param type - 오버레이 타입 ('modal' | 'drawer-horizontal' | 'drawer-vertical')
 * @param size - 드로어 크기 ('sm' | 'md' | 'lg')
 * @param title - 제목
 * @param description - 설명
 * @param appeared - 표시 여부
 * @param showDim - 딤 배경 표시 여부 (기본: true)
 * @param closeOnDimClick - 딤 클릭 시 닫기 (기본: true)
 * @param confirmUI - 확인 버튼 텍스트 (기본: 'Save')
 * @param cancelUI - 취소 버튼 텍스트 (기본: 'Cancel')
 * @param footer - 커스텀 푸터 요소
 * @param onConfirm - 확인 콜백
 * @param onCancel - 취소 콜백
 * @param isGlobal - 전역 포탈 사용 여부
 * @param isLoading - 확인 버튼 로딩 상태 (기본: false)
 * @param confirmDisabled - 확인 버튼 비활성화 (기본: false)
 * @param children - 본문 내용
 */
const OverlayTemplate = ({
  type = 'drawer-horizontal',
  size,
  className,
  showDim = true,
  closeOnDimClick = true,
  title = '',
  description = '',
  footer,
  confirmUI = 'Save',
  cancelUI = 'Cancel',
  onConfirm,
  onCancel,
  children,
  isGlobal = false,
  duration = DEFAULT_DURATION_MS,
  appeared = false,
  isLoading = false,
  confirmDisabled = false,
  drawerType,
  portalScope,
}: PrivateOverlayProps) => {
  /** 딤 클릭 처리 */
  const handleDimClick = () => {
    if (closeOnDimClick) {
      onCancel();
    }
  };

  const isDrawer = type === 'drawer-horizontal' || type === 'drawer-vertical';
  const hasDefaultButtons = !footer;

  const overlayContent = (
    <div className={cn(overlayStyles({ global: isGlobal, appeared }))}>
      {showDim && <Dim appeared={appeared} onClick={handleDimClick} />}
      <div
        className={cn(
          overlayContentStyles({
            type,
            size: type === 'drawer-horizontal' ? size : undefined,
            appeared,
          }),
          className
        )}
        style={{
          transitionDuration: `${Number.isInteger(duration) && duration > 0 ? duration : DEFAULT_DURATION_MS}ms`,
        }}
        role="dialog"
        aria-modal={type === 'modal'}
        aria-labelledby={title ? 'overlay-title' : undefined}
        aria-describedby={description ? 'overlay-description' : undefined}
        {...(drawerType && { 'data-drawer-type': drawerType })}
      >
        {(title || description) && (
          <header className={cn(overlayHeaderStyles({ type }))}>
            {typeof title === 'string' ? (
              <h2 className={cn(overlayTitleStyles)} id="overlay-title">
                {title}
              </h2>
            ) : (
              title
            )}
            {typeof description === 'string' ? (
              <p className={cn(overlayDescriptionStyles)} id="overlay-description">
                {description}
              </p>
            ) : (
              description
            )}
          </header>
        )}
        <section className={cn(overlayBodyStyles({ type }))}>{children}</section>
        <footer
          className={cn(
            overlayFooterStyles({ type }),
            hasDefaultButtons && overlayFooterWithButtonsStyles,
            hasDefaultButtons && isDrawer && overlayDrawerFooterBorderStyles
          )}
        >
          {footer ? (
            footer
          ) : (
            <>
              <Button
                type="button"
                className={cn(
                  overlayButtonBaseStyles,
                  type === 'modal' && overlayModalButtonStyles
                )}
                variant={'muted'}
                appearance={'outline'}
                onClick={onCancel}
              >
                {cancelUI}
              </Button>
              <Button
                type="button"
                className={cn(
                  overlayButtonBaseStyles,
                  type === 'modal' && overlayModalButtonStyles
                )}
                variant={'primary'}
                onClick={onConfirm}
                disabled={confirmDisabled}
                isLoading={isLoading}
              >
                {confirmUI}
              </Button>
            </>
          )}
        </footer>
      </div>
    </div>
  );

  return isGlobal
    ? createPortal(
        portalScope ? <div data-portal-scope={portalScope}>{overlayContent}</div> : overlayContent,
        document.body
      )
    : overlayContent;
};

export default OverlayTemplate;
export type { Props as OverlayProps, PrivateOverlayProps };
