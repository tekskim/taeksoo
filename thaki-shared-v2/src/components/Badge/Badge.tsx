import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import { Icon } from '../Icon';
import type { IconWeight } from '../Icon/types';
import { badgeVariants } from './Badge.styles';

/** Badge size options */
type BadgeSize = 'sm' | 'md' | 'lg';

/** Badge style type: subtle (light bg) or solid (filled bg) */
type BadgeType = 'subtle' | 'solid';

/**
 * Badge color theme (abbreviated names)
 * - 'blu' = Blue (Info/Primary)
 * - 'red' = Red (Error/Danger)
 * - 'gry' = Gray (Neutral/Disabled)
 * - 'gre' = Green (Success)
 * - 'ylw' = Yellow (Warning)
 */
type BadgeTheme =
  | 'blu'  // Blue - Info/Primary
  | 'red'  // Red - Error/Danger
  | 'gry'  // Gray - Neutral/Disabled
  | 'gre'  // Green - Success
  | 'ylw'; // Yellow - Warning

/** Badge layout options for icon positioning */
type BadgeLayout = 'text-only' | 'left-icon' | 'right-icon';

interface Props {
  /** 배지에 표시될 텍스트 */
  children: ReactNode;
  /** 배지 색상 테마 (기본값: 'gry') */
  theme?: BadgeTheme;
  /** 배지 크기 (기본값: 'md') */
  size?: BadgeSize;
  /** 배지 스타일 (기본값: 'subtle') */
  type?: BadgeType;
  /** 배지 레이아웃 (텍스트만, 좌측 아이콘, 우측 아이콘) */
  layout?: BadgeLayout;
  /** 아이콘 레이아웃에서 렌더링할 아이콘 */
  icon?: ReactElement<{
    size?: number;
    weight?: IconWeight;
    color?: string;
    mirrored?: boolean;
  }>;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * [Design System] 배지 컴포넌트
 *
 * 상태, 카테고리, 레이블을 시각적으로 표시합니다.
 *
 * @example
 * // 기본 배지
 * <Badge>기본</Badge>
 *
 * @example
 * // 색상 테마별 배지
 * <Badge theme="blu">정보</Badge>
 * <Badge theme="gre">성공</Badge>
 * <Badge theme="ylw">경고</Badge>
 * <Badge theme="red">오류</Badge>
 * <Badge theme="gry">비활성</Badge>
 *
 * @example
 * // Solid 스타일 (강조)
 * <Badge theme="blu" type="solid">활성</Badge>
 * <Badge theme="red" type="solid">중요</Badge>
 *
 * @example
 * // 크기 변형
 * <Badge size="sm">Small</Badge>
 * <Badge size="md">Medium</Badge>
 * <Badge size="lg">Large</Badge>
 *
 * @example
 * // 아이콘과 함께 사용
 * <Badge theme="gre" layout="left-icon" icon={<CheckIcon />}>완료</Badge>
 * <Badge theme="red" layout="right-icon" icon={<AlertIcon />}>주의</Badge>
 *
 * @param children - 배지에 표시될 텍스트
 * @param theme - 색상 테마 ('blu' | 'red' | 'gry' | 'gre' | 'ylw')
 * @param size - 배지 크기 ('sm' | 'md' | 'lg')
 * @param type - 스타일 타입 ('subtle' | 'solid')
 * @param layout - 레이아웃 ('text-only' | 'left-icon' | 'right-icon')
 * @param icon - 아이콘 엘리먼트
 * @param className - 추가 CSS 클래스
 */
const Badge = ({
  children,
  theme = 'gry',
  size = 'md',
  type = 'subtle',
  layout = 'text-only',
  icon,
  className,
}: Props): ReactElement => {
  const inferredLayout: BadgeLayout =
    layout !== 'text-only' ? layout : icon ? 'left-icon' : 'text-only';

  const iconSizeBySize: Record<BadgeSize, number> = {
    sm: 12,
    md: 16,
    lg: 18,
  };
  const iconSize = iconSizeBySize[size];
  const shouldRenderIcon = inferredLayout !== 'text-only' && icon !== undefined;
  const isRightIcon = inferredLayout === 'right-icon';

  return (
    <span className={cn(badgeVariants({ size, theme, type }), className)}>
      {shouldRenderIcon && !isRightIcon ? (
        <span className="flex items-center shrink-0">
          <Icon size={iconSize}>{icon}</Icon>
        </span>
      ) : null}
      <span className="flex items-center">{children}</span>
      {shouldRenderIcon && isRightIcon ? (
        <span className="flex items-center shrink-0">
          <Icon size={iconSize}>{icon}</Icon>
        </span>
      ) : null}
    </span>
  );
};

export type { BadgeTheme, BadgeLayout, BadgeSize, BadgeType };

export default Badge;
