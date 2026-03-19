import React from 'react';
import { cn } from '../../services/utils/cn';
import { LoadingSpinner } from '../LoadingSpinner';
import { buttonVariants } from './Button.styles';
import { ButtonProps } from './Button.types';

/**
 * [Design System] 공통 버튼 컴포넌트
 *
 * CVA 기반으로 variant × appearance × size 조합을 관리합니다.
 *
 * @example
 * // Primary solid button (default)
 * <Button variant="primary" onClick={handleSave}>저장</Button>
 *
 * @example
 * // Destructive action with outline style
 * <Button variant="error" appearance="outline" size="sm" onClick={handleDelete}>
 *   삭제
 * </Button>
 *
 * @example
 * // Ghost button for subtle actions
 * <Button variant="secondary" appearance="ghost">취소</Button>
 *
 * @example
 * // Loading state
 * <Button variant="primary" isLoading disabled>처리 중...</Button>
 *
 * @example
 * // Full width button
 * <Button variant="primary" fullWidth>전체 너비 버튼</Button>
 *
 * @example
 * // Icon-only button (auto-detected when child is single icon)
 * <Button variant="muted" appearance="ghost" size="sm">
 *   <Icon name="settings" />
 * </Button>
 *
 * @param variant - 버튼 색상 테마 ('primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'muted')
 * @param appearance - 버튼 스타일 ('solid' | 'outline' | 'ghost')
 * @param size - 버튼 크기 ('xs' | 'sm' | 'md' | 'lg')
 * @param isLoading - 로딩 상태 표시
 * @param disabled - 비활성화 상태
 * @param fullWidth - 전체 너비 사용 여부
 * @param loadingElement - 커스텀 로딩 요소
 * @param children - 버튼 내용
 */
const isRenderableChild = (
  child: React.ReactNode
): child is Exclude<React.ReactNode, boolean | null | undefined> =>
  child !== null && child !== undefined && child !== false && child !== true;

const isTextChild = (child: React.ReactNode): boolean =>
  typeof child === 'string' || typeof child === 'number';

const isIconLikeElement = (element: React.ReactElement | null): boolean => {
  if (!element) return false;

  const elementType = element.type as unknown as {
    displayName?: string;
    name?: string;
  };
  const displayName = elementType?.displayName || elementType?.name;

  if (
    typeof displayName === 'string' &&
    displayName.toLowerCase().includes('icon')
  ) {
    return true;
  }

  // Tabler Icons: displayName is just the icon name (e.g. "Download") without "Icon" prefix.
  // Detect by checking for typical icon props (size/stroke) on a forwardRef component.
  if (typeof element.type === 'function' || typeof element.type === 'object') {
    const props = element.props as Record<string, unknown> | undefined;
    if (props && ('size' in props || 'stroke' in props)) {
      return true;
    }
  }

  if (typeof element.type === 'string') {
    if (element.type === 'svg') {
      return true;
    }

    if (
      element.type === 'span' &&
      Object.prototype.hasOwnProperty.call(
        element.props ?? {},
        'dangerouslySetInnerHTML'
      )
    ) {
      return true;
    }
  }

  return false;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      appearance = 'solid',
      size = 'md',
      loadingElement = (
        <div className={'flex items-center gap-control gap-1.5'}>
          <LoadingSpinner size="sm" />
          loading
        </div>
      ),
      isLoading = false,
      disabled,
      fullWidth = false,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const content = isLoading ? loadingElement : children;

    const renderableChildren =
      React.Children.toArray(content).filter(isRenderableChild);
    const hasTextContent = renderableChildren.some(isTextChild);

    const soleElementChild =
      renderableChildren.length === 1 &&
      React.isValidElement(renderableChildren[0])
        ? (renderableChildren[0] as React.ReactElement)
        : null;

    const isIconOnly =
      Boolean(soleElementChild) &&
      !hasTextContent &&
      isIconLikeElement(soleElementChild);

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({
            appearance,
            variant,
            size,
            fullWidth,
            iconOnly: isIconOnly,
          }),
          className
        )}
        disabled={disabled || isLoading}
        type={type}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
