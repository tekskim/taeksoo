import React, { ComponentType } from 'react';
import { ToasterProps } from 'sonner';

const TOAST_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
} as const;

interface ToastProviderProps {
  frameId?: string;
  position?: (typeof TOAST_POSITIONS)[keyof typeof TOAST_POSITIONS];
  richColors?: boolean;
  expand?: boolean;
  visibleToasts?: number;
  closeButton?: boolean;
  toastOptions?: {
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
  };
  duration?: number;
  Toaster: ComponentType<ToasterProps>;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  frameId,
  position = TOAST_POSITIONS.TOP_RIGHT,
  richColors = true,
  expand = false,
  visibleToasts = 1,
  closeButton = false,
  toastOptions,
  duration = 3000,
  Toaster: ToasterComponent,
}) => {
  return (
    <ToasterComponent
      id={frameId}
      position={position}
      richColors={richColors}
      expand={expand}
      visibleToasts={visibleToasts}
      closeButton={closeButton}
      toastOptions={toastOptions}
      duration={duration} // 기획상 기본 5초이며, 중요한 메시지가 아닌 경우 3초로 커스텀하여 처리
    />
  );
};

export default ToastProvider;
