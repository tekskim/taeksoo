import { SVGProps } from 'react';
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
export declare const IconExpandOff: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
/**
 * ExpandOn (CaretDown) - 16x16 프레임, 내부 화살표 12x10
 * 펼쳐진 상태의 화살표 (아래 방향)
 * 화살표 위치: x=2, y=3 (중앙 정렬)
 */
export declare const IconExpandOn: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
/**
 * Timeout - 16x16 프레임
 * 시계와 오른쪽 아래 화살표가 결합된 아이콘
 */
export declare const IconTimeout: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
/**
 * History - 16x16 프레임
 * 시계와 역방향 화살표가 결합된 아이콘
 */
export declare const IconHistory: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
/**
 * Robot (Agent) - 16x16 프레임
 * Figma 디자인에 맞는 로봇 아이콘
 */
export declare const IconRobotCustom: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
/**
 * AddRobot - 16x16 프레임
 * 로봇 아이콘에 더하기 기호가 있는 아이콘
 */
export declare const IconAddRobotCustom: import('react').ForwardRefExoticComponent<Omit<CustomIconProps, "ref"> & import('react').RefAttributes<SVGSVGElement>>;
