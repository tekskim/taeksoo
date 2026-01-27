/**
 * TDS Custom Icons
 *
 * Figma 디자인에 맞는 커스텀 SVG 아이콘들
 * 16x16 프레임 안에 화살표가 중앙 정렬됨
 */

import { forwardRef, type SVGProps } from 'react';

export interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  stroke?: number;
}

/**
 * ExpandOff (CaretRight) - 16x16 프레임, 내부 화살표 10x12
 * 접힌 상태의 화살표 (오른쪽 방향)
 * 화살표 위치: x=3, y=2 (중앙 정렬)
 */
export const IconExpandOff = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        {/* 10x12 화살표를 16x16 프레임 중앙에 배치 (x=3, y=2) */}
        <path
          d="M3 2.66686V13.3335C2.99997 13.4521 3.03158 13.5686 3.09159 13.6709C3.15159 13.7733 3.23781 13.8577 3.34135 13.9156C3.44489 13.9735 3.562 14.0027 3.68059 14.0002C3.79918 13.9978 3.91497 13.9637 4.016 13.9015L12.6827 8.56819C12.7797 8.50854 12.8599 8.42502 12.9155 8.32558C12.9711 8.22614 13.0003 8.11412 13.0003 8.00019C13.0003 7.88626 12.9711 7.77423 12.9155 7.6748C12.8599 7.57536 12.7797 7.49183 12.6827 7.43219L4.016 2.09885C3.91497 2.0367 3.79918 2.00262 3.68059 2.00015C3.562 1.99767 3.44489 2.02688 3.34135 2.08476C3.23781 2.14265 3.15159 2.22711 3.09159 2.32943C3.03158 2.43175 2.99997 2.54824 3 2.66686Z"
          fill={color}
        />
      </svg>
    );
  }
);
IconExpandOff.displayName = 'IconExpandOff';

/**
 * ExpandOn (CaretDown) - 16x16 프레임, 내부 화살표 12x10
 * 펼쳐진 상태의 화살표 (아래 방향)
 * 화살표 위치: x=2, y=3 (중앙 정렬)
 */
export const IconExpandOn = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        {/* 12x10 화살표를 16x16 프레임 중앙에 배치 (x=2, y=3) */}
        <path
          d="M13.3335 3H2.66686C2.54824 2.99997 2.43175 3.03158 2.32943 3.09159C2.22711 3.15159 2.14265 3.23781 2.08476 3.34135C2.02688 3.44489 1.99767 3.562 2.00015 3.68059C2.00262 3.79918 2.0367 3.91497 2.09885 4.016L7.43219 12.6827C7.49183 12.7797 7.57536 12.8599 7.6748 12.9155C7.77423 12.9711 7.88626 13.0003 8.00019 13.0003C8.11412 13.0003 8.22614 12.9711 8.32558 12.9155C8.42502 12.8599 8.50854 12.7797 8.56819 12.6827L13.9015 4.016C13.9637 3.91497 13.9978 3.79918 14.0002 3.68059C14.0027 3.562 13.9735 3.44489 13.9156 3.34135C13.8577 3.23781 13.7733 3.15159 13.6709 3.09159C13.5686 3.03158 13.4521 2.99997 13.3335 3Z"
          fill={color}
        />
      </svg>
    );
  }
);
IconExpandOn.displayName = 'IconExpandOn';

/**
 * Timeout - 16x16 프레임
 * 시계와 오른쪽 아래 화살표가 결합된 아이콘
 */
export const IconTimeout = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 1.5, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        {/* 시계 원형 (불완전한 arc) */}
        <path
          d="M13.9896 8.18702C14.0628 6.94654 13.7491 5.71392 13.0917 4.6594C12.4343 3.60487 11.4657 2.78047 10.3197 2.30005C9.17367 1.81963 7.90676 1.70688 6.69391 1.97738C5.48106 2.24788 4.38213 2.88829 3.54886 3.81015C2.7156 4.73202 2.18912 5.88986 2.04213 7.12379C1.89514 8.35771 2.1349 9.60683 2.72829 10.6986C3.32168 11.7905 4.23943 12.6711 5.3548 13.2189C6.47016 13.7668 7.72811 13.9548 8.95492 13.757"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 시계 바늘 (10:10 방향) */}
        <path
          d="M8 4.5V7.83333L10 9.83333"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 아래쪽 화살표 (왼쪽 상단) */}
        <path
          d="M3.3333 5.5L2 3.5H4.6667L3.3333 1.5"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
IconTimeout.displayName = 'IconTimeout';

/**
 * History - 16x16 프레임
 * 시계와 역방향 화살표가 결합된 아이콘
 */
export const IconHistory = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 1.5, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        {/* 시계 원형 */}
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 시계 바늘 (10:10 방향) */}
        <path
          d="M8 4.5V7.83333L10 9.83333"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 역방향 화살표 (시계 주변) */}
        <path
          d="M11.5 2.5C10.5 2.16667 9.5 2 8.5 2C7.5 2 6.5 2.16667 5.5 2.5"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 1.5L11.5 2.5L10.5 3.5"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
IconHistory.displayName = 'IconHistory';

/**
 * Robot (Agent) - 16x16 프레임
 * Figma 디자인에 맞는 로봇 아이콘
 */
export const IconRobotCustom = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 1, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        <path
          d="M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M3.875 3.16952H12.125C12.4897 3.16952 12.8394 3.31116 13.0973 3.5633C13.3551 3.81543 13.5 4.15739 13.5 4.51396V12.5806C13.5 12.9372 13.3551 13.2792 13.0973 13.5313C12.8394 13.7834 12.4897 13.9251 12.125 13.9251H3.875C3.51033 13.9251 3.16059 13.7834 2.90273 13.5313C2.64487 13.2792 2.5 12.9372 2.5 12.5806V4.51396C2.5 4.15739 2.64487 3.81543 2.90273 3.5633C3.16059 3.31116 3.51033 3.16952 3.875 3.16952Z"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
);
IconRobotCustom.displayName = 'IconRobotCustom';

/**
 * AddRobot - 16x16 프레임
 * 로봇 아이콘에 더하기 기호가 있는 아이콘
 */
export const IconAddRobotCustom = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 1, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        <path
          d="M13.5 8.5V4.51396C13.5 4.15739 13.3551 3.81543 13.0973 3.5633C12.8394 3.31116 12.4897 3.16952 12.125 3.16952H3.875C3.51033 3.16952 3.16059 3.31116 2.90273 3.5633C2.64487 3.81543 2.5 4.15739 2.5 4.51396V12.5806C2.5 12.9372 2.64487 13.2792 2.90273 13.5313C3.16059 13.7834 3.51033 13.9251 3.875 13.9251H8M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M10.8 12.7H14.4M12.6 10.9V14.5"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
);
IconAddRobotCustom.displayName = 'IconAddRobotCustom';

// Helper function to extract stroke width from SVG attributes
const getStrokeWidth = (svgContent: string): number => {
  const match = svgContent.match(/stroke-width="([^"]+)"/);
  if (match) {
    const value = parseFloat(match[1]);
    return isNaN(value) ? 1 : value;
  }
  return 1;
};

// Helper function to check if SVG has fill
const hasFill = (svgContent: string): boolean => {
  return svgContent.includes('fill=') && !svgContent.includes('fill="none"');
};

// Helper function to extract fill color
const getFillColor = (svgContent: string, defaultColor: string): string => {
  const match = svgContent.match(/fill="([^"]+)"/);
  if (match && match[1] !== 'none') {
    return match[1];
  }
  return defaultColor;
};
