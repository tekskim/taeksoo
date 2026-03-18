import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../services/utils/cn';
import {
  containerStyles,
  blockStyles,
  blockHeaderStyles,
  blockIconStyles,
  blockHeaderTextStyles,
  blockTitleStyles,
  blockSubtitleStyles,
  blockContentStyles,
  stackStyles,
  gridContainerStyles,
  gridItemStyles,
  dividerStyles,
} from './Layout.styles';

/**
 * [Design System] 레이아웃 컴포넌트 모음
 *
 * 페이지 및 섹션 레이아웃을 구성하는 컴포넌트들입니다.
 *
 * @example
 * // 기본 페이지 레이아웃
 * <Layout.Container maxWidth="lg" padding="md">
 *   <Layout.VStack gap="lg">
 *     <Layout.HStack justify="between" align="center">
 *       <Typography.Title level={1}>페이지 제목</Typography.Title>
 *       <Button variant="primary">액션</Button>
 *     </Layout.HStack>
 *     <Layout.Block title="섹션 제목" subtitle="설명 텍스트">
 *       섹션 내용
 *     </Layout.Block>
 *   </Layout.VStack>
 * </Layout.Container>
 *
 * @example
 * // 그리드 레이아웃
 * <Layout.Grid.Container columns={3} gap="md">
 *   <Layout.Grid.Item colSpan={2}>넓은 영역</Layout.Grid.Item>
 *   <Layout.Grid.Item>좁은 영역</Layout.Grid.Item>
 * </Layout.Grid.Container>
 *
 * @example
 * // 수평/수직 스택
 * <Layout.HStack gap="sm" align="center">
 *   <Badge>상태</Badge>
 *   <Typography.Text>설명</Typography.Text>
 * </Layout.HStack>
 *
 * @example
 * // 구분선
 * <Layout.VStack gap="md">
 *   <div>위 섹션</div>
 *   <Layout.Divider spacing="sm" />
 *   <div>아래 섹션</div>
 * </Layout.VStack>
 */

// 2.1. 골격 컨테이너
type ContainerProps = {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth, padding, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(containerStyles({ maxWidth, padding }), className)} {...props}>
        {children}
      </div>
    );
  }
);
Container.displayName = 'Layout.Container';

// 2.2. 콘텐츠 컨테이너
type BlockProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  padding?: 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg';
  flex?: number | string;
} & HTMLAttributes<HTMLDivElement>;

const Block = forwardRef<HTMLDivElement, BlockProps>(
  (
    {
      title,
      subtitle,
      icon,
      variant = 'default',
      padding,
      borderRadius,
      flex,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const style = flex ? { flex } : {};
    return (
      <div
        ref={ref}
        className={cn(blockStyles({ variant, padding, borderRadius }), className)}
        style={style}
        {...props}
      >
        {(title || subtitle || icon) && (
          <div className={blockHeaderStyles}>
            {icon && <span className={blockIconStyles}>{icon}</span>}
            {(title || subtitle) && (
              <div className={blockHeaderTextStyles}>
                {title && <h3 className={blockTitleStyles}>{title}</h3>}
                {subtitle && <p className={blockSubtitleStyles}>{subtitle}</p>}
              </div>
            )}
          </div>
        )}
        <div className={blockContentStyles}>{children}</div>
      </div>
    );
  }
);
Block.displayName = 'Layout.Block';

// 2.3. 배치 컨테이너
type StackProps = {
  direction?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = 'vertical', gap, align, justify, wrap = false, className, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(stackStyles({ direction, gap, align, justify, wrap }), className)}
        {...props}
        data-layout="stack"
        data-direction={direction}
      >
        {children}
      </div>
    );
  }
);
Stack.displayName = 'Layout.Stack';

const HStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>((props, ref) => (
  <Stack {...props} direction="horizontal" ref={ref} />
));
HStack.displayName = 'Layout.HStack';

const VStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>((props, ref) => (
  <Stack {...props} direction="vertical" ref={ref} />
));
VStack.displayName = 'Layout.VStack';

type GridContainerProps = {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLDivElement>;

const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  ({ columns = 12, gap, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(gridContainerStyles({ columns, gap }), className)} {...props}>
        {children}
      </div>
    );
  }
);
GridContainer.displayName = 'Layout.GridContainer';

type GridItemProps = {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  colStart?: 1 | 2 | 3 | 4 | 5 | 6;
} & HTMLAttributes<HTMLDivElement>;

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ colSpan, colStart, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(gridItemStyles({ colSpan, colStart }), className)} {...props}>
        {children}
      </div>
    );
  }
);
GridItem.displayName = 'Layout.GridItem';

// 2.4. 기타
type DividerProps = {
  direction?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLHRElement | HTMLDivElement>;

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ direction = 'horizontal', spacing, className, ...props }, ref) => {
    const dividerClassName = cn(dividerStyles({ direction, spacing }), className);
    if (direction === 'vertical') {
      return <div ref={ref as React.Ref<HTMLDivElement>} className={dividerClassName} {...props} />;
    }
    return <hr ref={ref} className={dividerClassName} {...props} />;
  }
);
Divider.displayName = 'Layout.Divider';

// Default export for unified API
export default {
  Container,
  Block,
  Stack,
  HStack,
  VStack,
  Grid: {
    Container: GridContainer,
    Item: GridItem,
  },
  Divider,
};

// Named exports for individual imports (optional)
export { Block, Container, Divider, GridContainer, GridItem, HStack, Stack, VStack };

export type {
  BlockProps,
  ContainerProps,
  DividerProps,
  GridContainerProps,
  GridItemProps,
  StackProps,
};
