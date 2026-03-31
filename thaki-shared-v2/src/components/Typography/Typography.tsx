import { ElementType } from 'react';
import { cn } from '../../services/utils/cn';
import { titleVariants, textVariants, labelVariants } from './Typography.styles';
import { LabelProps, TextProps, TitleProps } from './Typography.types';

/**
 * [Design System] 제목 컴포넌트
 *
 * 시맨틱 헤딩(h1-h4)을 렌더링합니다.
 *
 * @example
 * // 기본 사용법
 * <Typography.Title level={1}>페이지 제목</Typography.Title>
 * <Typography.Title level={2}>섹션 제목</Typography.Title>
 *
 * @example
 * // 색상 변형
 * <Typography.Title level={3} color="primary">강조 제목</Typography.Title>
 * <Typography.Title level={3} color="muted">부제목</Typography.Title>
 *
 * @example
 * // 다른 요소로 렌더링
 * <Typography.Title as="div" level={2}>div로 렌더링</Typography.Title>
 */
const Title = <C extends ElementType = 'h1'>({
  as,
  level = 1,
  color,
  className,
  children,
  ...props
}: TitleProps<C>): React.ReactElement => {
  const h = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const Component = as || h;

  return (
    <Component className={cn(titleVariants({ level, color }), className)} {...props}>
      {children}
    </Component>
  );
};

/**
 * [Design System] 본문 텍스트 컴포넌트
 *
 * 본문, 캡션 등 일반 텍스트를 렌더링합니다.
 *
 * @example
 * // 기본 사용법
 * <Typography.Text>기본 본문 텍스트입니다.</Typography.Text>
 *
 * @example
 * // 캡션 스타일
 * <Typography.Text variant="caption" color="muted">
 *   작은 설명 텍스트
 * </Typography.Text>
 *
 * @example
 * // 색상 변형
 * <Typography.Text color="primary">강조 텍스트</Typography.Text>
 * <Typography.Text color="error">오류 텍스트</Typography.Text>
 */
const Text = <C extends ElementType = 'p'>({
  as,
  variant = 'paragraph',
  color,
  className,
  children,
  ...props
}: TextProps<C>): React.ReactElement => {
  const Component = as || (variant === 'caption' ? 'span' : 'p');

  return (
    <Component className={cn(textVariants({ variant, color }), className)} {...props}>
      {children}
    </Component>
  );
};

/**
 * [Design System] 라벨 컴포넌트
 *
 * 폼 라벨 또는 일반 라벨을 렌더링합니다.
 *
 * @example
 * // 기본 사용법
 * <Typography.Label htmlFor="email">이메일</Typography.Label>
 *
 * @example
 * // 색상 변형
 * <Typography.Label color="muted">선택 항목</Typography.Label>
 */
const Label = <C extends ElementType = 'label'>({
  as,
  color,
  className,
  children,
  ...props
}: LabelProps<C>): React.ReactElement => {
  const Component = as || 'label';

  return (
    <Component className={cn(labelVariants({ color }), className)} {...props}>
      {children}
    </Component>
  );
};

/**
 * Typography 컴포넌트 모음
 */
export const Typography = {
  Title,
  Text,
  Label,
};
