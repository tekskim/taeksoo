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
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
);
IconExpandOff.displayName = 'IconExpandOff';


/**
 * Action - 16x16 프레임
 */
export const IconAction = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAction.displayName = 'IconAction';

/**
 * Active - 16x16 프레임
 */
export const IconActive = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10.599 13.4069V13.4136M12.6923 11.7402V11.7469M13.8457 9.33333V9.34M13.8457 6.66667V6.67333M12.6923 4.25977V4.26643M10.599 2.5931V2.59977M7.99902 2V2.00667M5.39901 2.5931V2.59977M3.3057 4.25977V4.26643M2.15234 6.66667V6.67333M2.15234 9.33333V9.34M3.3057 11.7402V11.7469M5.39901 13.4069V13.4136M7.99902 14V14.0067M7.33236 8C7.33236 8.17681 7.40259 8.34638 7.52762 8.4714C7.65264 8.59643 7.82221 8.66667 7.99902 8.66667C8.17583 8.66667 8.3454 8.59643 8.47043 8.4714C8.59545 8.34638 8.66569 8.17681 8.66569 8C8.66569 7.82319 8.59545 7.65362 8.47043 7.5286C8.3454 7.40357 8.17583 7.33333 7.99902 7.33333C7.82221 7.33333 7.65264 7.40357 7.52762 7.5286C7.40259 7.65362 7.33236 7.82319 7.33236 8ZM4.66569 8C4.66569 8.88406 5.01688 9.7319 5.642 10.357C6.26712 10.9821 7.11497 11.3333 7.99902 11.3333C8.88308 11.3333 9.73092 10.9821 10.356 10.357C10.9812 9.7319 11.3324 8.88406 11.3324 8C11.3324 7.11595 10.9812 6.2681 10.356 5.64298C9.73092 5.01786 8.88308 4.66667 7.99902 4.66667C7.11497 4.66667 6.26712 5.01786 5.642 5.64298C5.01688 6.2681 4.66569 7.11595 4.66569 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconActive.displayName = 'IconActive';

/**
 * Add Volume - 16x16 프레임
 */
export const IconAddVolume = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M10.6 12.7H14.6M12.6 10.7V12.7V14.7"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAddVolume.displayName = 'IconAddVolume';

/**
 * Add robot - 16x16 프레임
 */
export const IconAddRobot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.5 8.5V4.51396C13.5 4.15739 13.3551 3.81543 13.0973 3.5633C12.8394 3.31116 12.4897 3.16952 12.125 3.16952H3.875C3.51033 3.16952 3.16059 3.31116 2.90273 3.5633C2.64487 3.81543 2.5 4.15739 2.5 4.51396V12.5806C2.5 12.9372 2.64487 13.2792 2.90273 13.5313C3.16059 13.7834 3.51033 13.9251 3.875 13.9251H8M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M10.8 12.7H14.4M12.6 10.9V14.5"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAddRobot.displayName = 'IconAddRobot';

/**
 * Alert - 16x16 프레임
 */
export const IconAlert = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 6V8.66667M8 10.6667V10.6733M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAlert.displayName = 'IconAlert';

/**
 * Attach - 16x16 프레임
 */
export const IconAttach = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10 4.66667L5.66667 9C5.40145 9.26522 5.25245 9.62493 5.25245 10C5.25245 10.3751 5.40145 10.7348 5.66667 11C5.93188 11.2652 6.29159 11.4142 6.66667 11.4142C7.04174 11.4142 7.40145 11.2652 7.66667 11L12 6.66667C12.5304 6.13624 12.8284 5.41681 12.8284 4.66667C12.8284 3.91652 12.5304 3.1971 12 2.66667C11.4696 2.13624 10.7501 1.83824 10 1.83824C9.24986 1.83824 8.53043 2.13624 8 2.66667L3.66667 7C2.87102 7.79565 2.42403 8.87478 2.42403 10C2.42403 11.1252 2.87102 12.2044 3.66667 13C4.46232 13.7957 5.54145 14.2426 6.66667 14.2426C7.79189 14.2426 8.87102 13.7957 9.66667 13L14 8.66667"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAttach.displayName = 'IconAttach';

/**
 * Backup - 16x16 프레임
 */
export const IconBackup = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66761 11.9999C3.8358 11.9999 3.03805 11.6839 2.44987 11.1212C1.86169 10.5586 1.53125 9.79558 1.53125 8.99993C1.53125 8.20428 1.86169 7.44122 2.44987 6.87861C3.03805 6.316 3.8358 5.99993 4.66761 5.99993C4.86407 5.12471 5.43879 4.35558 6.26534 3.86174C6.6746 3.61721 7.13338 3.44763 7.61546 3.36267C8.09755 3.27771 8.59351 3.27905 9.07502 3.36659C9.55653 3.45414 10.0142 3.62619 10.4218 3.87291C10.8294 4.11964 11.1791 4.43621 11.4508 4.80455C11.7225 5.17288 11.9109 5.58578 12.0053 6.01966C12.0997 6.45354 12.0982 6.8999 12.0009 7.33326H12.6676C13.2865 7.33326 13.8799 7.57909 14.3175 8.01668C14.7551 8.45426 15.0009 9.04775 15.0009 9.66659C15.0009 10.2854 14.7551 10.8789 14.3175 11.3165C13.8799 11.7541 13.2865 11.9999 12.6676 11.9999H12.0009M6.00098 9.99996L8.00098 7.99996M8.00098 7.99996L10.001 9.99996M8.00098 7.99996V14"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconBackup.displayName = 'IconBackup';

/**
 * Building - 16x16 프레임
 */
export const IconBuilding = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M8 4V2M10.8333 5.16667L12.2667 3.73334M12 8H14M10.8333 10.8333L12.2667 12.2667M8 12V14M5.16665 10.8333L3.73332 12.2667M4 8H2M5.16665 5.16667L3.73332 3.73334"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconBuilding.displayName = 'IconBuilding';

/**
 * Certificate - 16x16 프레임
 */
export const IconCertificate = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33333 2V4.66667C9.33333 4.84348 9.40357 5.01305 9.5286 5.13807C9.65362 5.2631 9.82319 5.33333 10 5.33333H12.6667M9.33333 2H4.66667C4.31304 2 3.97391 2.14048 3.72386 2.39052C3.47381 2.64057 3.33333 2.97971 3.33333 3.33333V5.33333M9.33333 2L12.6667 5.33333M12.6667 5.33333V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H8M3 11.3333L2 14.6667L4 13.6667L6 14.6667L5 11.3333M2 9.33333C2 9.86377 2.21071 10.3725 2.58579 10.7475C2.96086 11.1226 3.46957 11.3333 4 11.3333C4.53043 11.3333 5.03914 11.1226 5.41421 10.7475C5.78929 10.3725 6 9.86377 6 9.33333C6 8.8029 5.78929 8.29419 5.41421 7.91912C5.03914 7.54405 4.53043 7.33333 4 7.33333C3.46957 7.33333 2.96086 7.54405 2.58579 7.91912C2.21071 8.29419 2 8.8029 2 9.33333Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCertificate.displayName = 'IconCertificate';

/**
 * Chart - 16x16 프레임
 */
export const IconChart = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9 11.3078V6.76416M12.4286 11.3082V4.45459M5.57141 11.3082V9.49072M14 13.6196L3 13.6196L3 3"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChart.displayName = 'IconChart';

/**
 * CheckCircle - 16x16 프레임
 */
export const IconCheckcircle = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13 7.53993V7.99993C12.9994 9.07814 12.6503 10.1273 12.0047 10.9908C11.3591 11.8544 10.4516 12.4862 9.41768 12.7919C8.38372 13.0976 7.27863 13.0609 6.26724 12.6872C5.25584 12.3136 4.39233 11.623 3.80548 10.7185C3.21863 9.81395 2.9399 8.74396 3.01084 7.66809C3.08178 6.59221 3.4986 5.5681 4.19914 4.74847C4.89968 3.92884 5.84639 3.35762 6.89809 3.12001C7.9498 2.88239 9.05013 2.9911 10.035 3.42993M13 4L8 9.005L6.5 7.505"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCheckcircle.displayName = 'IconCheckcircle';

/**
 * ChevronDown - 16x16 프레임
 */
export const IconChevrondown = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4 6L8 10L12 6"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChevrondown.displayName = 'IconChevrondown';

/**
 * ChevronLeft - 16x16 프레임
 */
export const IconChevronleft = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10 4L6 8L10 12"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChevronleft.displayName = 'IconChevronleft';

/**
 * ChevronRight - 16x16 프레임
 */
export const IconChevronright = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 4L10 8L6 12"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChevronright.displayName = 'IconChevronright';

/**
 * ChevronUp - 16x16 프레임
 */
export const IconChevronup = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4 10L8 6L12 10"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChevronup.displayName = 'IconChevronup';

/**
 * CloseSmall - 16x16 프레임
 */
export const IconClosesmall = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12 4L3.99996 12M3.99996 4L12 12"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconClosesmall.displayName = 'IconClosesmall';

/**
 * Code-Console - 16x16 프레임
 */
export const IconCodeConsole = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33333 5.99984L7.33333 7.99984L5.33333 9.99984M8.66667 9.99984H10.6667M2 3.99984C2 3.64622 2.14048 3.30708 2.39052 3.05703C2.64057 2.80698 2.97971 2.6665 3.33333 2.6665H12.6667C13.0203 2.6665 13.3594 2.80698 13.6095 3.05703C13.8595 3.30708 14 3.64622 14 3.99984V11.9998C14 12.3535 13.8595 12.6926 13.6095 12.9426C13.3594 13.1927 13.0203 13.3332 12.6667 13.3332H3.33333C2.97971 13.3332 2.64057 13.1927 2.39052 12.9426C2.14048 12.6926 2 12.3535 2 11.9998V3.99984Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCodeConsole.displayName = 'IconCodeConsole';

/**
 * Copy - 16x16 프레임
 */
export const IconCopy = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.67467 11.158C2.47023 11.0415 2.30018 10.873 2.18172 10.6697C2.06325 10.4663 2.00057 10.2353 2 10V3.33333C2 2.6 2.6 2 3.33333 2H10C10.5 2 10.772 2.25667 11 2.66667M4.66667 6.44467C4.66667 5.97311 4.85399 5.52087 5.18743 5.18743C5.52087 4.85399 5.97311 4.66667 6.44467 4.66667H12.222C12.4555 4.66667 12.6867 4.71266 12.9024 4.80201C13.1181 4.89136 13.3141 5.02233 13.4792 5.18743C13.6443 5.35253 13.7753 5.54854 13.8647 5.76426C13.954 5.97997 14 6.21118 14 6.44467V12.222C14 12.4555 13.954 12.6867 13.8647 12.9024C13.7753 13.1181 13.6443 13.3141 13.4792 13.4792C13.3141 13.6443 13.1181 13.7753 12.9024 13.8647C12.6867 13.954 12.4555 14 12.222 14H6.44467C6.21118 14 5.97997 13.954 5.76426 13.8647C5.54854 13.7753 5.35253 13.6443 5.18743 13.4792C5.02233 13.3141 4.89136 13.1181 4.80201 12.9024C4.71266 12.6867 4.66667 12.4555 4.66667 12.222V6.44467Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCopy.displayName = 'IconCopy';

/**
 * Dashboards - 16x16 프레임
 */
export const IconDashboards = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.83398 5.39431V2.93915C8.83398 2.76515 8.89193 2.6207 9.00782 2.50581C9.12371 2.39081 9.26726 2.33331 9.43848 2.33331H13.0655C13.2368 2.33331 13.3799 2.39081 13.4948 2.50581C13.6098 2.6207 13.6673 2.76515 13.6673 2.93915V5.39431C13.6673 5.5682 13.6094 5.71259 13.4935 5.82748C13.3776 5.94248 13.234 5.99998 13.0628 5.99998H9.43582C9.26448 5.99998 9.12137 5.94248 9.00648 5.82748C8.89148 5.71259 8.83398 5.5682 8.83398 5.39431ZM2.33398 7.73331V2.93315C2.33398 2.76315 2.39193 2.6207 2.50782 2.50581C2.62371 2.39081 2.76726 2.33331 2.93848 2.33331H6.56548C6.73682 2.33331 6.87993 2.39081 6.99482 2.50581C7.10982 2.62081 7.16732 2.76331 7.16732 2.93331V5.3334V7.73348C7.16732 7.90348 7.10937 8.04592 6.99348 8.16081C6.87759 8.27581 6.73404 8.33331 6.56282 8.33331H2.93582C2.76448 8.33331 2.62137 8.27581 2.50648 8.16081C2.39148 8.04581 2.33398 7.90331 2.33398 7.73331ZM8.83398 13.0666V8.26648C8.83398 8.09648 8.89193 7.95403 9.00782 7.83915C9.12371 7.72415 9.26726 7.66665 9.43848 7.66665H13.0655C13.2368 7.66665 13.3799 7.72415 13.4948 7.83915C13.6098 7.95415 13.6673 8.09665 13.6673 8.26665V13.0668C13.6673 13.2368 13.6094 13.3793 13.4935 13.4941C13.3776 13.6091 13.234 13.6666 13.0628 13.6666H9.43582C9.26448 13.6666 9.12137 13.6091 9.00648 13.4941C8.89148 13.3791 8.83398 13.2366 8.83398 13.0666ZM2.33398 13.0608V10.6056C2.33398 10.4318 2.39193 10.2874 2.50782 10.1725C2.62371 10.0575 2.76726 9.99998 2.93848 9.99998H6.56548C6.73682 9.99998 6.87993 10.0575 6.99482 10.1725C7.10982 10.2874 7.16732 10.4318 7.16732 10.6056V13.0608C7.16732 13.2348 7.10937 13.3793 6.99348 13.4941C6.87759 13.6091 6.73404 13.6666 6.56282 13.6666H2.93582C2.76448 13.6666 2.62137 13.6091 2.50648 13.4941C2.39148 13.3793 2.33398 13.2348 2.33398 13.0608ZM3.33398 7.33331H6.16732V3.33331H3.33398V7.33331ZM9.83398 12.6666H12.6673V8.66665H9.83398V12.6666ZM9.83398 4.99998H12.6673V3.33331H9.83398V4.99998ZM3.33398 12.6666H6.16732V11H3.33398V12.6666Z" fill={color} />

      </svg>
    );
  }
);
IconDashboards.displayName = 'IconDashboards';

/**
 * Deactivated - 16x16 프레임
 */
export const IconDeactivated = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.53059 7.52669C7.4055 7.6517 7.33519 7.82128 7.33512 7.99812C7.33509 8.08569 7.35231 8.1724 7.38579 8.25332C7.41927 8.33423 7.46836 8.40775 7.53026 8.46969C7.59216 8.53163 7.66565 8.58078 7.74653 8.61431C7.82742 8.64785 7.91412 8.66513 8.00169 8.66516C8.17854 8.66522 8.34817 8.59503 8.47326 8.47003M5.64875 5.63713C5.33724 5.9464 5.08988 6.31414 4.92088 6.71925C4.75187 7.12436 4.66454 7.55886 4.6639 7.99781C4.66327 8.43677 4.74933 8.87152 4.91716 9.27712C5.08499 9.68272 5.33127 10.0512 5.64188 10.3614C5.95248 10.6715 6.32129 10.9173 6.72713 11.0845C7.13297 11.2518 7.56784 11.3372 8.00679 11.336C8.44574 11.3347 8.88012 11.2468 9.28499 11.0772C9.68987 10.9076 10.0573 10.6597 10.3661 10.3478M11.2761 8.62047C11.3769 8.08893 11.3468 7.54084 11.1884 7.02353C11.03 6.50622 10.7481 6.03523 10.367 5.65124C9.98592 5.26724 9.51707 4.98178 9.00097 4.8195C8.48487 4.65723 7.93703 4.62301 7.40475 4.7198M10.5999 13.4069V13.4136M12.6934 11.7402V11.7469M13.8467 9.33333V9.34M13.8467 6.66667V6.67333M12.6934 4.25977V4.26643M10.5999 2.5931V2.59977M8 2V2.00667M5.40007 2.5931V2.59977M3.30664 4.25977V4.26643M2.15332 6.66667V6.67333M2.15332 9.33333V9.34M3.30664 11.7402V11.7469M5.40007 13.4069V13.4136M8 14V14.0067M2 2L14 14"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDeactivated.displayName = 'IconDeactivated';

/**
 * Delete - 16x16 프레임
 */
export const IconDelete = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4.66667H13.3327M6.66602 7.33333V11.3333M9.33268 7.33333V11.3333M3.33268 4.66667L3.99935 12.6667C3.99935 13.0203 4.13982 13.3594 4.38987 13.6095C4.63992 13.8595 4.97906 14 5.33268 14H10.666C11.0196 14 11.3588 13.8595 11.6088 13.6095C11.8589 13.3594 11.9993 13.0203 11.9993 12.6667L12.666 4.66667M5.99935 4.66667V2.66667C5.99935 2.48986 6.06959 2.32029 6.19461 2.19526C6.31964 2.07024 6.4892 2 6.66602 2H9.33268C9.50949 2 9.67906 2.07024 9.80409 2.19526C9.92911 2.32029 9.99935 2.48986 9.99935 2.66667V4.66667"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDelete.displayName = 'IconDelete';

/**
 * Deleting - 16x16 프레임
 */
export const IconDeleting = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M1.9987 4.24959H14M2.74878 4.24959L3.49886 13.2506C3.49886 13.6484 3.65691 14.03 3.93825 14.3113C4.21958 14.5927 4.60115 14.7507 4.99902 14.7507H6.49918M13.2499 4.24959L12.9686 7.62496M5.7491 4.24959V1.99935C5.7491 1.80042 5.82813 1.60963 5.9688 1.46896C6.10946 1.32829 6.30025 1.24927 6.49918 1.24927H9.49951C9.69844 1.24927 9.88923 1.32829 10.0299 1.46896C10.1706 1.60963 10.2496 1.80042 10.2496 1.99935V4.24959M12 10V9M13.4167 10.5833L14.1333 9.86667M14 12H15M13.4167 13.4167L14.1333 14.1333M12 14V15M10.5833 13.4167L9.86666 14.1333M10 12H9M10.5833 10.5833L9.86666 9.86667M6.6665 7.33331V11.3333M9.33317 7.33331V8"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDeleting.displayName = 'IconDeleting';

/**
 * Download - 16x16 프레임
 */
export const IconDownload = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 11.3333V12.6666C2.66602 13.0202 2.80649 13.3594 3.05654 13.6094C3.30659 13.8595 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8595 12.9422 13.6094C13.1922 13.3594 13.3327 13.0202 13.3327 12.6666V11.3333M4.66602 7.33329L7.99935 10.6666M7.99935 10.6666L11.3327 7.33329M7.99935 10.6666V2.66663"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDownload.displayName = 'IconDownload';

/**
 * DrawerClose - 16x16 프레임
 */
export const IconDrawerclose = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66602 4.66663L7.99935 7.99996L4.66602 11.3333M8.66602 4.66663L11.9993 7.99996L8.66602 11.3333"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDrawerclose.displayName = 'IconDrawerclose';

/**
 * Edit - 16x16 프레임
 */
export const IconEdit = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66602 4.66667H3.99935C3.64573 4.66667 3.30659 4.80714 3.05654 5.05719C2.80649 5.30724 2.66602 5.64638 2.66602 6V12C2.66602 12.3536 2.80649 12.6928 3.05654 12.9428C3.30659 13.1929 3.64573 13.3333 3.99935 13.3333H9.99935C10.353 13.3333 10.6921 13.1929 10.9422 12.9428C11.1922 12.6928 11.3327 12.3536 11.3327 12V11.3333M10.666 3.33333L12.666 5.33333M13.5893 4.39007C13.8519 4.12751 13.9994 3.77139 13.9994 3.40007C13.9994 3.02875 13.8519 2.67264 13.5893 2.41007C13.3268 2.14751 12.9707 2 12.5993 2C12.228 2 11.8719 2.14751 11.6093 2.41007L5.99935 8.00007V10.0001H7.99935L13.5893 4.39007Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconEdit.displayName = 'IconEdit';

/**
 * Error-Warning - 16x16 프레임
 */
export const IconErrorWarning = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00033 6.00016V8.66683M8.00033 10.6668H8.00699M6.90898 2.39417L1.50498 11.4168C1.39358 11.6098 1.33463 11.8285 1.33399 12.0513C1.33335 12.274 1.39105 12.4931 1.50135 12.6867C1.61164 12.8802 1.77069 13.0415 1.96268 13.1545C2.15466 13.2676 2.37289 13.3283 2.59565 13.3308H13.405C13.6276 13.3283 13.8458 13.2675 14.0377 13.1545C14.2295 13.0415 14.3885 12.8803 14.4988 12.6868C14.6091 12.4934 14.6668 12.2744 14.6663 12.0517C14.6657 11.8291 14.6069 11.6104 14.4956 11.4175L9.09165 2.3935C8.97795 2.20584 8.81778 2.05066 8.62662 1.94296C8.43545 1.83527 8.21973 1.77869 8.00032 1.77869C7.7809 1.77869 7.56519 1.83527 7.37402 1.94296C7.18285 2.05066 7.02268 2.20584 6.90898 2.3935V2.39417Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconErrorWarning.displayName = 'IconErrorWarning';

/**
 * Error - 16x16 프레임
 */
export const IconError = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 1.5C11.5898 1.50001 14.4999 4.41023 14.5 8C14.5 11.5898 11.5898 14.5 8 14.5C4.41032 14.4998 1.50001 11.5897 1.5 8C1.50007 4.41033 4.41036 1.50018 8 1.5ZM8 2.5C4.96264 2.50018 2.50007 4.96262 2.5 8C2.50001 11.0374 4.9626 13.4998 8 13.5C11.0375 13.5 13.5 11.0375 13.5 8C13.4999 4.96252 11.0375 2.50001 8 2.5ZM9.44629 5.84668C9.64149 5.65148 9.95804 5.65161 10.1533 5.84668C10.3484 6.04195 10.3485 6.3585 10.1533 6.55371L8.70703 8L10.1533 9.44629C10.3484 9.64156 10.3485 9.95811 10.1533 10.1533C9.9581 10.3485 9.64156 10.3484 9.44629 10.1533L8 8.70703L6.55371 10.1533C6.3585 10.3485 6.04195 10.3484 5.84668 10.1533C5.65161 9.95805 5.65149 9.64149 5.84668 9.44629L7.29297 8L5.84668 6.55371C5.65142 6.35845 5.65143 6.04194 5.84668 5.84668C6.04194 5.65142 6.35845 5.65142 6.55371 5.84668L8 7.29297L9.44629 5.84668Z" fill={color} />

      </svg>
    );
  }
);
IconError.displayName = 'IconError';

/**
 * ExpandOff - 16x16 프레임
 */
export const IconExpandoff = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M4 2.66685V13.3335C3.99997 13.4521 4.03158 13.5686 4.09159 13.6709C4.15159 13.7733 4.23781 13.8577 4.34135 13.9156C4.44489 13.9735 4.562 14.0027 4.68059 14.0002C4.79918 13.9978 4.91497 13.9637 5.016 13.9015L13.6827 8.56819C13.7797 8.50854 13.8599 8.42502 13.9155 8.32558C13.9711 8.22614 14.0003 8.11412 14.0003 8.00019C14.0003 7.88626 13.9711 7.77423 13.9155 7.6748C13.8599 7.57536 13.7797 7.49183 13.6827 7.43219L5.016 2.09885C4.91497 2.0367 4.79918 2.00262 4.68059 2.00015C4.562 1.99767 4.44489 2.02688 4.34135 2.08476C4.23781 2.14265 4.15159 2.22711 4.09159 2.32943C4.03158 2.43175 3.99997 2.54823 4 2.66685Z" fill={color} />
</ns0:g>

      </svg>
    );
  }
);
IconExpandoff.displayName = 'IconExpandoff';

/**
 * ExpandOn - 16x16 프레임
 */
export const IconExpandon = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M13.3335 3L2.66685 3C2.54823 2.99997 2.43175 3.03158 2.32943 3.09159C2.22711 3.15159 2.14264 3.23781 2.08476 3.34135C2.02688 3.44489 1.99767 3.562 2.00014 3.68059C2.00262 3.79918 2.0367 3.91497 2.09885 4.016L7.43219 12.6827C7.49183 12.7797 7.57536 12.8599 7.67479 12.9155C7.77423 12.9711 7.88626 13.0003 8.00019 13.0003C8.11411 13.0003 8.22614 12.9711 8.32558 12.9155C8.42501 12.8599 8.50854 12.7797 8.56819 12.6827L13.9015 4.016C13.9637 3.91497 13.9978 3.79918 14.0002 3.68059C14.0027 3.562 13.9735 3.44489 13.9156 3.34135C13.8577 3.23781 13.7733 3.15159 13.6709 3.09159C13.5686 3.03158 13.4521 2.99997 13.3335 3Z" fill={color} />
</ns0:g>

      </svg>
    );
  }
);
IconExpandon.displayName = 'IconExpandon';

/**
 * ExternalLink - 16x16 프레임
 */
export const IconExternallink = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.99935 3.99996H3.99935C3.64573 3.99996 3.30659 4.14044 3.05654 4.39048C2.80649 4.64053 2.66602 4.97967 2.66602 5.33329V12C2.66602 12.3536 2.80649 12.6927 3.05654 12.9428C3.30659 13.1928 3.64573 13.3333 3.99935 13.3333H10.666C11.0196 13.3333 11.3588 13.1928 11.6088 12.9428C11.8589 12.6927 11.9993 12.3536 11.9993 12V7.99996M7.33268 8.66663L13.3327 2.66663M13.3327 2.66663H9.99935M13.3327 2.66663V5.99996"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconExternallink.displayName = 'IconExternallink';

/**
 * FavoriteOff - 16x16 프레임
 */
export const IconFavoriteoff = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00005 11.8333L3.88538 13.9966L4.67138 9.41464L1.33805 6.16997L5.93805 5.50331L7.99538 1.33464L10.0527 5.50331L14.6527 6.16997L11.3194 9.41464L12.1054 13.9966L8.00005 11.8333Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconFavoriteoff.displayName = 'IconFavoriteoff';

/**
 * FavoriteOn - 16x16 프레임
 */
export const IconFavoriteon = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" clip-path="url(#clip0_379_3474)">
<ns0:path d="M5.49615 4.89328L1.24282 5.50995L1.16749 5.52528C1.05345 5.55556 0.949484 5.61555 0.866215 5.69915C0.782947 5.78274 0.723356 5.88694 0.693529 6.0011C0.663701 6.11526 0.664705 6.23529 0.696439 6.34893C0.728172 6.46257 0.789498 6.56576 0.874154 6.64795L3.95549 9.64728L3.22882 13.8839L3.22015 13.9573C3.21317 14.0752 3.23766 14.1929 3.29112 14.2983C3.34458 14.4037 3.42508 14.4929 3.52438 14.557C3.62368 14.621 3.73821 14.6575 3.85625 14.6627C3.97429 14.6679 4.0916 14.6416 4.19615 14.5866L8.00015 12.5866L11.7955 14.5866L11.8622 14.6173C11.9722 14.6606 12.0918 14.6739 12.2087 14.6558C12.3255 14.6377 12.4355 14.5888 12.5272 14.5141C12.619 14.4395 12.6892 14.3418 12.7307 14.231C12.7722 14.1203 12.7835 14.0005 12.7635 13.8839L12.0362 9.64728L15.1188 6.64728L15.1708 6.59062C15.2451 6.49913 15.2938 6.38958 15.312 6.27315C15.3301 6.15671 15.3171 6.03753 15.2742 5.92777C15.2313 5.818 15.1601 5.72157 15.0678 5.64829C14.9755 5.57501 14.8654 5.52751 14.7488 5.51062L10.4955 4.89328L8.59415 1.03995C8.53914 0.928305 8.45397 0.834292 8.34828 0.768551C8.24259 0.702811 8.12062 0.667969 7.99615 0.667969C7.87169 0.667969 7.74971 0.702811 7.64403 0.768551C7.53834 0.834292 7.45317 0.928305 7.39815 1.03995L5.49615 4.89328Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_379_3474">
<ns0:rect width="16" height="16" fill="white" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconFavoriteon.displayName = 'IconFavoriteon';

/**
 * File - 16x16 프레임
 */
export const IconFile = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9 3H5C4.73478 3 4.48043 3.10536 4.29289 3.29289C4.10536 3.48043 4 3.73478 4 4V12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11C11.2652 13 11.5196 12.8946 11.7071 12.7071C11.8946 12.5196 12 12.2652 12 12V6M9 3L12 6M9 3V6H12M10 8.5H6M10 10.5H6M7 6.5H6"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconFile.displayName = 'IconFile';

/**
 * Flavor - 16x16 프레임
 */
export const IconFlavor = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2 6.66667H3.33333M2 9.33333H3.33333M6.66667 2V3.33333M9.33333 2V3.33333M14 6.66667H12.6667M14 9.33333H12.6667M9.33333 14V12.6667M6.66667 14V12.6667M3.33333 4C3.33333 3.82319 3.40357 3.65362 3.5286 3.5286C3.65362 3.40357 3.82319 3.33333 4 3.33333H12C12.1768 3.33333 12.3464 3.40357 12.4714 3.5286C12.5964 3.65362 12.6667 3.82319 12.6667 4V12C12.6667 12.1768 12.5964 12.3464 12.4714 12.4714C12.3464 12.5964 12.1768 12.6667 12 12.6667H4C3.82319 12.6667 3.65362 12.5964 3.5286 12.4714C3.40357 12.3464 3.33333 12.1768 3.33333 12V4ZM6 6H10V10H6V6Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconFlavor.displayName = 'IconFlavor';

/**
 * FloatingIp - 16x16 프레임
 */
export const IconFloatingip = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 8.66666V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12M8 10.6667C7.64638 10.6667 7.30724 10.8071 7.05719 11.0572C6.80714 11.3072 6.66667 11.6464 6.66667 12M6.66667 12C6.66667 12.3536 6.80714 12.6928 7.05719 12.9428C7.30724 13.1928 7.64638 13.3333 8 13.3333C8.35362 13.3333 8.69276 13.1928 8.94281 12.9428C9.19286 12.6928 9.33333 12.3536 9.33333 12M6.66667 12H2M9.33333 12H14M3.33333 6.59792C3.33333 5.45525 4.30667 4.52858 5.50667 4.52858C5.69 3.71525 6.34333 3.05192 7.22133 2.78792C8.09933 2.52325 9.068 2.69858 9.762 3.24792C10.4567 3.79592 10.7713 4.63458 10.588 5.44792H11.05C11.4778 5.44703 11.8884 5.61607 12.1915 5.91786C12.4947 6.21965 12.6656 6.62948 12.6667 7.05725C12.6656 7.48502 12.4947 7.89485 12.1915 8.19664C11.8884 8.49843 11.4778 8.66747 11.05 8.66658H5.50667C4.30667 8.66658 3.33333 7.73992 3.33333 6.59792Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconFloatingip.displayName = 'IconFloatingip';

/**
 * Hard_drive - 16x16 프레임
 */
export const IconHardDrive = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.476 8.00004H2.49939M4.49935 10.3334H4.50518M6.83268 10.3334H6.83852M4.17852 3.98087L2.16602 8.00004V11.5C2.16602 11.8095 2.28893 12.1062 2.50772 12.325C2.72652 12.5438 3.02326 12.6667 3.33268 12.6667H12.666C12.9754 12.6667 13.2722 12.5438 13.491 12.325C13.7098 12.1062 13.8327 11.8095 13.8327 11.5V8.00004L11.8202 3.98087C11.7236 3.7865 11.5747 3.62292 11.3902 3.50854C11.2058 3.39415 10.9931 3.33349 10.776 3.33337H5.22268C5.00563 3.33349 4.79292 3.39415 4.60846 3.50854C4.424 3.62292 4.2751 3.7865 4.17852 3.98087Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHardDrive.displayName = 'IconHardDrive';

/**
 * Help - 16x16 프레임
 */
export const IconHelp = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 11.3333V11.34M8 9.00011C7.98773 8.78369 8.0461 8.56915 8.16635 8.38879C8.28659 8.20842 8.46218 8.07202 8.66667 8.00011C8.91725 7.90428 9.14217 7.7516 9.32371 7.55408C9.50526 7.35656 9.63848 7.11959 9.71288 6.86184C9.78729 6.60408 9.80084 6.33257 9.75249 6.06869C9.70413 5.8048 9.59518 5.55574 9.43421 5.34112C9.27324 5.1265 9.06465 4.95217 8.82486 4.83186C8.58507 4.71155 8.32063 4.64854 8.05235 4.64779C7.78407 4.64705 7.51928 4.70859 7.27883 4.82757C7.03838 4.94655 6.82882 5.11972 6.66667 5.33344M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHelp.displayName = 'IconHelp';

/**
 * Hide - 16x16 프레임
 */
export const IconHide = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M14 6C12.4 7.778 10.4 8.66667 8 8.66667C5.6 8.66667 3.6 7.778 2 6M2 9.99997L3.66667 7.46663M14 9.98397L12.3387 7.46663M6 11.3333L6.33333 8.66667M10 11.3333L9.66667 8.66667"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHide.displayName = 'IconHide';

/**
 * Home - 16x16 프레임
 */
export const IconHome = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 14V10C6 9.64638 6.14048 9.30724 6.39052 9.05719C6.64057 8.80714 6.97971 8.66667 7.33333 8.66667H8.66667C9.02029 8.66667 9.35943 8.80714 9.60948 9.05719C9.85952 9.30724 10 9.64638 10 10V14M3.33333 8H2L8 2L14 8H12.6667V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHome.displayName = 'IconHome';

/**
 * Host Aggregates - 16x16 프레임
 */
export const IconHostAggregates = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4 7.99999H12C12.5304 7.99999 13.0391 7.78928 13.4142 7.4142C13.7893 7.03913 14 6.53042 14 5.99999V4.66666C14 4.13622 13.7893 3.62752 13.4142 3.25244C13.0391 2.87737 12.5304 2.66666 12 2.66666H4C3.46957 2.66666 2.96086 2.87737 2.58579 3.25244C2.21071 3.62752 2 4.13622 2 4.66666V5.99999C2 6.53042 2.21071 7.03913 2.58579 7.4142C2.96086 7.78928 3.46957 7.99999 4 7.99999ZM4 7.99999C3.46957 7.99999 2.96086 8.2107 2.58579 8.58578C2.21071 8.96085 2 9.46956 2 9.99999V11.3333C2 11.8638 2.21071 12.3725 2.58579 12.7475C2.96086 13.1226 3.46957 13.3333 4 13.3333H8M4 7.99999H11M12 13.3333C11.6464 13.3333 11.3072 13.1928 11.0572 12.9428C10.8071 12.6928 10.6667 12.3536 10.6667 12C10.6667 11.6464 10.8071 11.3072 11.0572 11.0572C11.3072 10.8071 11.6464 10.6667 12 10.6667M12 13.3333C12.3536 13.3333 12.6928 13.1928 12.9428 12.9428C13.1929 12.6928 13.3333 12.3536 13.3333 12C13.3333 11.6464 13.1929 11.3072 12.9428 11.0572C12.6928 10.8071 12.3536 10.6667 12 10.6667M12 13.3333V14.3333M12 10.6667V9.66666M14.0213 10.8333L13.1553 11.3333M10.8468 12.6667L9.98014 13.1667M9.98014 10.8333L10.8468 11.3333M13.1553 12.6667L14.0219 13.1667M4.66667 5.33332V5.33999M4.66667 10.6667V10.6733"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHostAggregates.displayName = 'IconHostAggregates';

/**
 * Hypervisor - 16x16 프레임
 */
export const IconHypervisor = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.99935 5.99998H7.99935M2.66602 3.33331H5.33268M3.99935 3.33331V10.6666C3.99935 10.8435 4.06959 11.013 4.19461 11.1381C4.31964 11.2631 4.4892 11.3333 4.66602 11.3333H7.99935M7.99935 5.33331C7.99935 5.1565 8.06959 4.98693 8.19461 4.86191C8.31964 4.73688 8.4892 4.66665 8.66602 4.66665H12.666C12.8428 4.66665 13.0124 4.73688 13.1374 4.86191C13.2624 4.98693 13.3327 5.1565 13.3327 5.33331V6.66665C13.3327 6.84346 13.2624 7.01303 13.1374 7.13805C13.0124 7.26307 12.8428 7.33331 12.666 7.33331H8.66602C8.4892 7.33331 8.31964 7.26307 8.19461 7.13805C8.06959 7.01303 7.99935 6.84346 7.99935 6.66665V5.33331ZM7.99935 10.6666C7.99935 10.4898 8.06959 10.3203 8.19461 10.1952C8.31964 10.0702 8.4892 9.99998 8.66602 9.99998H12.666C12.8428 9.99998 13.0124 10.0702 13.1374 10.1952C13.2624 10.3203 13.3327 10.4898 13.3327 10.6666V12C13.3327 12.1768 13.2624 12.3464 13.1374 12.4714C13.0124 12.5964 12.8428 12.6666 12.666 12.6666H8.66602C8.4892 12.6666 8.31964 12.5964 8.19461 12.4714C8.06959 12.3464 7.99935 12.1768 7.99935 12V10.6666Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHypervisor.displayName = 'IconHypervisor';

/**
 * Images - 16x16 프레임
 */
export const IconImages = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66667 8C4.66667 7.11595 5.01786 6.2681 5.64298 5.64298C6.2681 5.01786 7.11595 4.66667 8 4.66667M8 11.3333C8.88406 11.3333 9.7319 10.9821 10.357 10.357C10.9821 9.7319 11.3333 8.88406 11.3333 8M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66667 8 8.66667C8.17681 8.66667 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.5286C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.5286C7.40357 7.65362 7.33333 7.82319 7.33333 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconImages.displayName = 'IconImages';

/**
 * Info - 16x16 프레임
 */
export const IconInfo = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 10.7L8 7.53333M8 5.53333L8 5.52667M14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97594 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconInfo.displayName = 'IconInfo';

/**
 * Instances - 16x16 프레임
 */
export const IconInstances = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.3327 5L7.99935 2L2.66602 5M13.3327 5V11L7.99935 14M13.3327 5L7.99935 8M7.99935 14L2.66602 11V5M7.99935 14V8M2.66602 5L7.99935 8"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconInstances.displayName = 'IconInstances';

/**
 * Inuse - 16x16 프레임
 */
export const IconInuse = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66667 8V6C2.66667 5.46957 2.87738 4.96086 3.25245 4.58579C3.62753 4.21071 4.13623 4 4.66667 4H13.3333M13.3333 4L11.3333 2M13.3333 4L11.3333 6M13.3333 8V10C13.3333 10.5304 13.1226 11.0391 12.7475 11.4142C12.3725 11.7893 11.8638 12 11.3333 12H2.66667M2.66667 12L4.66667 14M2.66667 12L4.66667 10"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconInuse.displayName = 'IconInuse';

/**
 * Key - 16x16 프레임
 */
export const IconKey = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.25 2.16666L12.0833 3.33332M12.0833 3.33332L13.8333 5.08332L11.7917 7.12499L10.0417 5.37499M12.0833 3.33332L10.0417 5.37499M7.64417 7.77249C7.34698 7.47129 6.99314 7.23185 6.60304 7.06797C6.21293 6.90408 5.79426 6.81897 5.37113 6.81756C4.948 6.81614 4.52877 6.89844 4.13757 7.05971C3.74638 7.22098 3.39095 7.45804 3.09175 7.75724C2.79255 8.05644 2.55549 8.41187 2.39422 8.80306C2.23295 9.19426 2.15065 9.61349 2.15207 10.0366C2.15349 10.4598 2.23859 10.8784 2.40248 11.2685C2.56637 11.6586 2.8058 12.0125 3.107 12.3097C3.7121 12.8941 4.52253 13.2175 5.36375 13.2102C6.20496 13.2028 7.00965 12.8654 7.6045 12.2706C8.19935 11.6757 8.53677 10.871 8.54408 10.0298C8.55139 9.1886 8.22801 8.37817 7.64358 7.77307L7.64417 7.77249ZM7.64417 7.77249L10.0417 5.37499"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconKey.displayName = 'IconKey';

/**
 * KeyPairs - 16x16 프레임
 */
export const IconKeypairs = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10 6H10.0067M11.0367 2.56187L13.438 4.96321C13.6161 5.14131 13.7574 5.35276 13.8538 5.58548C13.9503 5.81821 13.9999 6.06764 13.9999 6.31954C13.9999 6.57144 13.9503 6.82087 13.8538 7.05359C13.7574 7.28631 13.6161 7.49776 13.438 7.67587L11.676 9.43787C11.4979 9.616 11.2864 9.75731 11.0537 9.85372C10.821 9.95012 10.5716 9.99974 10.3197 9.99974C10.0678 9.99974 9.81833 9.95012 9.58561 9.85372C9.35289 9.75731 9.14144 9.616 8.96333 9.43787L8.76267 9.2372L4.39067 13.6092C4.16915 13.8307 3.87672 13.9671 3.56467 13.9945L3.448 13.9999H2.66667C2.50338 13.9998 2.34578 13.9399 2.22375 13.8314C2.10173 13.7229 2.02377 13.5734 2.00467 13.4112L2 13.3332V12.5519C2.00008 12.2388 2.11029 11.9358 2.31133 11.6959L2.39067 11.6092L2.66667 11.3332H4V9.99987H5.33333V8.66654L6.76267 7.2372L6.562 7.03654C6.38387 6.85843 6.24256 6.64698 6.14615 6.41426C6.04975 6.18154 6.00013 5.9321 6.00013 5.6802C6.00013 5.42831 6.04975 5.17887 6.14615 4.94615C6.24256 4.71343 6.38387 4.50198 6.562 4.32387L8.324 2.56187C8.50211 2.38374 8.71356 2.24243 8.94628 2.14603C9.179 2.04962 9.42843 2 9.68033 2C9.93223 2 10.1817 2.04962 10.4144 2.14603C10.6471 2.24243 10.8586 2.38374 11.0367 2.56187Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconKeypairs.displayName = 'IconKeypairs';

/**
 * Layers - 16x16 프레임
 */
export const IconLayers = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3 10.5L8 13L13 10.5M3 8L8 10.5L13 8M8 3L3 5.5L8 8L13 5.5L8 3Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconLayers.displayName = 'IconLayers';

/**
 * LoadBalancer - 16x16 프레임
 */
export const IconLoadbalancer = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconLoadbalancer.displayName = 'IconLoadbalancer';

/**
 * Lock - 16x16 프레임
 */
export const IconLock = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33398 7.33333V4.66667C5.33398 3.95942 5.61494 3.28115 6.11503 2.78105C6.61513 2.28095 7.29341 2 8.00065 2C8.70789 2 9.38617 2.28095 9.88627 2.78105C10.3864 3.28115 10.6673 3.95942 10.6673 4.66667V7.33333M3.33398 8.66667C3.33398 8.31304 3.47446 7.97391 3.72451 7.72386C3.97456 7.47381 4.3137 7.33333 4.66732 7.33333H11.334C11.6876 7.33333 12.0267 7.47381 12.2768 7.72386C12.5268 7.97391 12.6673 8.31304 12.6673 8.66667V12.6667C12.6673 13.0203 12.5268 13.3594 12.2768 13.6095C12.0267 13.8595 11.6876 14 11.334 14H4.66732C4.3137 14 3.97456 13.8595 3.72451 13.6095C3.47446 13.3594 3.33398 13.0203 3.33398 12.6667V8.66667ZM7.33398 10.6667C7.33398 10.8435 7.40422 11.013 7.52925 11.1381C7.65427 11.2631 7.82384 11.3333 8.00065 11.3333C8.17746 11.3333 8.34703 11.2631 8.47206 11.1381C8.59708 11.013 8.66732 10.8435 8.66732 10.6667C8.66732 10.4899 8.59708 10.3203 8.47206 10.1953C8.34703 10.0702 8.17746 10 8.00065 10C7.82384 10 7.65427 10.0702 7.52925 10.1953C7.40422 10.3203 7.33398 10.4899 7.33398 10.6667Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconLock.displayName = 'IconLock';

/**
 * Maintenance - 16x16 프레임
 */
export const IconMaintenance = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" clip-path="url(#clip0_1805_2)">
<ns0:path d="M9.8 4.2C9.67785 4.32462 9.60943 4.49216 9.60943 4.66667C9.60943 4.84117 9.67785 5.00871 9.8 5.13333L10.8667 6.2C10.9913 6.32215 11.1588 6.39057 11.3333 6.39057C11.5078 6.39057 11.6754 6.32215 11.8 6.2L13.8707 4.13C14.084 3.91533 14.446 3.98333 14.526 4.27533C14.7274 5.00792 14.716 5.78271 14.4932 6.50906C14.2703 7.23541 13.8452 7.88327 13.2676 8.37682C12.69 8.87038 11.9837 9.18923 11.2315 9.29604C10.4793 9.40286 9.71219 9.29324 9.02 8.98L3.74667 14.2533C3.48145 14.5185 3.12178 14.6674 2.74677 14.6673C2.37175 14.6672 2.01213 14.5182 1.747 14.253C1.48187 13.9878 1.33296 13.6281 1.33302 13.2531C1.33309 12.8781 1.48212 12.5185 1.74733 12.2533L7.02067 6.98C6.70743 6.28781 6.59781 5.52072 6.70462 4.7685C6.81144 4.01628 7.13028 3.31003 7.62384 2.73241C8.1174 2.15479 8.76526 1.72967 9.49161 1.50682C10.218 1.28396 10.9928 1.27258 11.7253 1.474C12.0173 1.554 12.0853 1.91533 11.8713 2.13L9.8 4.2Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_1805_2">
<ns0:rect width="16" height="16" fill="white" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconMaintenance.displayName = 'IconMaintenance';

/**
 * More-kebab - 16x16 프레임
 */
export const IconMoreKebab = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52855C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52855C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52855C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52855C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconMoreKebab.displayName = 'IconMoreKebab';

/**
 * Network - 16x16 프레임
 */
export const IconNetwork = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.91667 10.3333V8.58332C3.91667 8.42861 3.97813 8.28024 4.08753 8.17084C4.19692 8.06145 4.3453 7.99999 4.50001 7.99999H11.5C11.6547 7.99999 11.8031 8.06145 11.9125 8.17084C12.0219 8.28024 12.0833 8.42861 12.0833 8.58332V10.3333M8 7.99999V5.66666M10.9167 10.3333H13.25C13.5722 10.3333 13.8333 10.5945 13.8333 10.9167V13.25C13.8333 13.5722 13.5722 13.8333 13.25 13.8333H10.9167C10.5945 13.8333 10.3333 13.5722 10.3333 13.25V10.9167C10.3333 10.5945 10.5945 10.3333 10.9167 10.3333ZM2.75001 10.3333H5.08334C5.4055 10.3333 5.66667 10.5945 5.66667 10.9167V13.25C5.66667 13.5722 5.4055 13.8333 5.08334 13.8333H2.75001C2.42784 13.8333 2.16667 13.5722 2.16667 13.25V10.9167C2.16667 10.5945 2.42784 10.3333 2.75001 10.3333ZM6.83334 2.16666H9.16667C9.48884 2.16666 9.75 2.42782 9.75 2.74999V5.08332C9.75 5.40549 9.48884 5.66666 9.16667 5.66666H6.83334C6.51117 5.66666 6.25 5.40549 6.25 5.08332V2.74999C6.25 2.42782 6.51117 2.16666 6.83334 2.16666Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconNetwork.displayName = 'IconNetwork';

/**
 * Networks - 16x16 프레임
 */
export const IconNetworks = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10M4 6C4 4.93913 4.42143 3.92172 5.17157 3.17157C5.92172 2.42143 6.93913 2 8 2M4 6H12M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6M8 10C8.88867 9.778 9.33333 8.44467 9.33333 6C9.33333 3.55533 8.88867 2.222 8 2M8 10C7.11133 9.778 6.66667 8.44467 6.66667 6C6.66667 3.55533 7.11133 2.222 8 2M8 10V12M12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2M2 13.3333H6.66667M6.66667 13.3333C6.66667 13.687 6.80714 14.0261 7.05719 14.2761C7.30724 14.5262 7.64638 14.6667 8 14.6667C8.35362 14.6667 8.69276 14.5262 8.94281 14.2761C9.19286 14.0261 9.33333 13.687 9.33333 13.3333M6.66667 13.3333C6.66667 12.9797 6.80714 12.6406 7.05719 12.3905C7.30724 12.1405 7.64638 12 8 12M9.33333 13.3333H14M9.33333 13.3333C9.33333 12.9797 9.19286 12.6406 8.94281 12.3905C8.69276 12.1405 8.35362 12 8 12"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconNetworks.displayName = 'IconNetworks';

/**
 * NewTab - 16x16 프레임
 */
export const IconNewtab = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00065 3.33337V12.6667M3.33398 8.00004H12.6673"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconNewtab.displayName = 'IconNewtab';

/**
 * Notification-new - 16x16 프레임
 */
export const IconNotificationNew = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.99935 11.3333V12C5.99935 12.5304 6.21006 13.0391 6.58514 13.4142C6.96021 13.7893 7.46892 14 7.99935 14C8.52978 14 9.03849 13.7893 9.41356 13.4142C9.78864 13.0391 9.99935 12.5304 9.99935 12V11.3333M6.66602 3.33333C6.66602 2.97971 6.80649 2.64057 7.05654 2.39052C7.30659 2.14048 7.64573 2 7.99935 2C8.35297 2 8.69211 2.14048 8.94216 2.39052C9.19221 2.64057 9.33268 2.97971 9.33268 3.33333C10.0983 3.69535 10.751 4.25888 11.2207 4.96353C11.6905 5.66818 11.9596 6.48738 11.9993 7.33333V9.33333C12.0495 9.7478 12.1963 10.1447 12.4279 10.4921C12.6595 10.8395 12.9694 11.1276 13.3327 11.3333H2.66602C3.02931 11.1276 3.33922 10.8395 3.57081 10.4921C3.80239 10.1447 3.94918 9.7478 3.99935 9.33333V7.33333C4.03906 6.48738 4.30822 5.66818 4.77798 4.96353C5.24775 4.25888 5.90041 3.69535 6.66602 3.33333Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12 2C12 2.53043 12.2107 3.03914 12.5858 3.41421C12.9609 3.78929 13.4696 4 14 4C14.5304 4 15.0391 3.78929 15.4142 3.41421C15.7893 3.03914 16 2.53043 16 2C16 1.46957 15.7893 0.960859 15.4142 0.585787C15.0391 0.210714 14.5304 0 14 0C13.4696 0 12.9609 0.210714 12.5858 0.585787C12.2107 0.960859 12 1.46957 12 2Z" fill="#DC2626" />

      </svg>
    );
  }
);
IconNotificationNew.displayName = 'IconNotificationNew';

/**
 * Notification - 16x16 프레임
 */
export const IconNotification = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.99935 11.3333V12C5.99935 12.5304 6.21006 13.0391 6.58514 13.4142C6.96021 13.7893 7.46892 14 7.99935 14C8.52978 14 9.03849 13.7893 9.41356 13.4142C9.78864 13.0391 9.99935 12.5304 9.99935 12V11.3333M6.66602 3.33333C6.66602 2.97971 6.80649 2.64057 7.05654 2.39052C7.30659 2.14048 7.64573 2 7.99935 2C8.35297 2 8.69211 2.14048 8.94216 2.39052C9.19221 2.64057 9.33268 2.97971 9.33268 3.33333C10.0983 3.69535 10.751 4.25888 11.2207 4.96353C11.6905 5.66818 11.9596 6.48738 11.9993 7.33333V9.33333C12.0495 9.7478 12.1963 10.1447 12.4279 10.4921C12.6595 10.8395 12.9694 11.1276 13.3327 11.3333H2.66602C3.02931 11.1276 3.33922 10.8395 3.57081 10.4921C3.80239 10.1447 3.94918 9.7478 3.99935 9.33333V7.33333C4.03906 6.48738 4.30822 5.66818 4.77798 4.96353C5.24775 4.25888 5.90041 3.69535 6.66602 3.33333Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconNotification.displayName = 'IconNotification';

/**
 * Order - 16x16 프레임
 */
export const IconOrder = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33398 3.33329C5.33398 3.5101 5.40422 3.67967 5.52925 3.8047C5.65427 3.92972 5.82384 3.99996 6.00065 3.99996C6.17746 3.99996 6.34703 3.92972 6.47206 3.8047C6.59708 3.67967 6.66732 3.5101 6.66732 3.33329C6.66732 3.15648 6.59708 2.98691 6.47206 2.86189C6.34703 2.73686 6.17746 2.66663 6.00065 2.66663C5.82384 2.66663 5.65427 2.73686 5.52925 2.86189C5.40422 2.98691 5.33398 3.15648 5.33398 3.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33398 7.99996C5.33398 8.17677 5.40422 8.34634 5.52925 8.47136C5.65427 8.59639 5.82384 8.66663 6.00065 8.66663C6.17746 8.66663 6.34703 8.59639 6.47206 8.47136C6.59708 8.34634 6.66732 8.17677 6.66732 7.99996C6.66732 7.82315 6.59708 7.65358 6.47206 7.52856C6.34703 7.40353 6.17746 7.33329 6.00065 7.33329C5.82384 7.33329 5.65427 7.40353 5.52925 7.52856C5.40422 7.65358 5.33398 7.82315 5.33398 7.99996Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.33398 12.6666C5.33398 12.8434 5.40422 13.013 5.52925 13.138C5.65427 13.2631 5.82384 13.3333 6.00065 13.3333C6.17746 13.3333 6.34703 13.2631 6.47206 13.138C6.59708 13.013 6.66732 12.8434 6.66732 12.6666C6.66732 12.4898 6.59708 12.3202 6.47206 12.1952C6.34703 12.0702 6.17746 12 6.00065 12C5.82384 12 5.65427 12.0702 5.52925 12.1952C5.40422 12.3202 5.33398 12.4898 5.33398 12.6666Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33398 3.33329C9.33398 3.5101 9.40422 3.67967 9.52925 3.8047C9.65427 3.92972 9.82384 3.99996 10.0007 3.99996C10.1775 3.99996 10.347 3.92972 10.4721 3.8047C10.5971 3.67967 10.6673 3.5101 10.6673 3.33329C10.6673 3.15648 10.5971 2.98691 10.4721 2.86189C10.347 2.73686 10.1775 2.66663 10.0007 2.66663C9.82384 2.66663 9.65427 2.73686 9.52925 2.86189C9.40422 2.98691 9.33398 3.15648 9.33398 3.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33398 7.99996C9.33398 8.17677 9.40422 8.34634 9.52925 8.47136C9.65427 8.59639 9.82384 8.66663 10.0007 8.66663C10.1775 8.66663 10.347 8.59639 10.4721 8.47136C10.5971 8.34634 10.6673 8.17677 10.6673 7.99996C10.6673 7.82315 10.5971 7.65358 10.4721 7.52856C10.347 7.40353 10.1775 7.33329 10.0007 7.33329C9.82384 7.33329 9.65427 7.40353 9.52925 7.52856C9.40422 7.65358 9.33398 7.82315 9.33398 7.99996Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33398 12.6666C9.33398 12.8434 9.40422 13.013 9.52925 13.138C9.65427 13.2631 9.82384 13.3333 10.0007 13.3333C10.1775 13.3333 10.347 13.2631 10.4721 13.138C10.5971 13.013 10.6673 12.8434 10.6673 12.6666C10.6673 12.4898 10.5971 12.3202 10.4721 12.1952C10.347 12.0702 10.1775 12 10.0007 12C9.82384 12 9.65427 12.0702 9.52925 12.1952C9.40422 12.3202 9.33398 12.4898 9.33398 12.6666Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconOrder.displayName = 'IconOrder';

/**
 * Paused - 16x16 프레임
 */
export const IconPaused = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M4.00004 4C4.00004 3.82319 4.07028 3.65362 4.1953 3.52859C4.32033 3.40357 4.4899 3.33333 4.66671 3.33333H6.00004C6.17685 3.33333 6.34642 3.40357 6.47145 3.52859C6.59647 3.65362 6.66671 3.82319 6.66671 4V12C6.66671 12.1768 6.59647 12.3464 6.47145 12.4714C6.34642 12.5964 6.17685 12.6667 6.00004 12.6667H4.66671C4.4899 12.6667 4.32033 12.5964 4.1953 12.4714C4.07028 12.3464 4.00004 12.1768 4.00004 12V4Z"  stroke-linecap="round" stroke-linejoin="round" />
<ns0:path d="M9.33338 4C9.33338 3.82319 9.40361 3.65362 9.52864 3.52859C9.65366 3.40357 9.82323 3.33333 10 3.33333H11.3334C11.5102 3.33333 11.6798 3.40357 11.8048 3.52859C11.9298 3.65362 12 3.82319 12 4V12C12 12.1768 11.9298 12.3464 11.8048 12.4714C11.6798 12.5964 11.5102 12.6667 11.3334 12.6667H10C9.82323 12.6667 9.65366 12.5964 9.52864 12.4714C9.40361 12.3464 9.33338 12.1768 9.33338 12V4Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconPaused.displayName = 'IconPaused';

/**
 * Play - 16x16 프레임
 */
export const IconPlay = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M4.66602 2.66663V13.3333L13.3327 7.99996L4.66602 2.66663Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconPlay.displayName = 'IconPlay';

/**
 * Plugin - 16x16 프레임
 */
export const IconPlugin = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M4.6667 8L8.00004 11.3333L7.00004 12.3333C6.78248 12.5581 6.52238 12.7373 6.23487 12.8605C5.94737 12.9837 5.63823 13.0484 5.32545 13.051C5.01267 13.0535 4.70251 12.9938 4.41304 12.8753C4.12358 12.7567 3.8606 12.5818 3.63942 12.3606C3.41825 12.1394 3.2433 11.8765 3.12477 11.587C3.00625 11.2975 2.94651 10.9874 2.94905 10.6746C2.95159 10.3618 3.01635 10.0527 3.13956 9.76516C3.26277 9.47766 3.44197 9.21756 3.66671 9L4.6667 8ZM11.3333 8.00004L8 4.6667L9 3.66671C9.21756 3.44197 9.47766 3.26277 9.76516 3.13956C10.0527 3.01635 10.3618 2.95159 10.6746 2.94905C10.9874 2.94651 11.2975 3.00625 11.587 3.12477C11.8765 3.2433 12.1394 3.41825 12.3606 3.63942C12.5818 3.8606 12.7567 4.12358 12.8753 4.41304C12.9938 4.70251 13.0535 5.01267 13.051 5.32545C13.0484 5.63823 12.9837 5.94737 12.8605 6.23487C12.7373 6.52238 12.5581 6.78248 12.3333 7.00004L11.3333 8.00004Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPlugin.displayName = 'IconPlugin';

/**
 * Plus-circle - 16x16 프레임
 */
export const IconPlusCircle = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 5.6V10.4M5.6 8H10.4M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPlusCircle.displayName = 'IconPlusCircle';

/**
 * Ports-1 - 16x16 프레임
 */
export const IconPorts1 = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 13.8333C11.2217 13.8333 13.8333 11.2217 13.8333 7.99999C13.8333 4.77824 11.2217 2.16666 8 2.16666C4.77825 2.16666 2.16667 4.77824 2.16667 7.99999C2.16667 11.2217 4.77825 13.8333 8 13.8333Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 9.75C8.9665 9.75 9.75 8.9665 9.75 8C9.75 7.0335 8.9665 6.25 8 6.25C7.0335 6.25 6.25 7.0335 6.25 8C6.25 8.9665 7.0335 9.75 8 9.75Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPorts1.displayName = 'IconPorts1';

/**
 * Ports - 16x16 프레임
 */
export const IconPorts = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 5.33332C7.64638 5.33332 7.30724 5.19285 7.05719 4.9428C6.80714 4.69275 6.66667 4.35361 6.66667 3.99999C6.66667 3.64637 6.80714 3.30723 7.05719 3.05718C7.30724 2.80713 7.64638 2.66666 8 2.66666C8.35362 2.66666 8.69276 2.80713 8.94281 3.05718C9.19286 3.30723 9.33333 3.64637 9.33333 3.99999C9.33333 4.35361 9.19286 4.69275 8.94281 4.9428C8.69276 5.19285 8.35362 5.33332 8 5.33332ZM8 5.33332V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12C9.33333 12.3536 9.19286 12.6928 8.94281 12.9428C8.69276 13.1928 8.35362 13.3333 8 13.3333C7.64638 13.3333 7.30724 13.1928 7.05719 12.9428C6.80714 12.6928 6.66667 12.3536 6.66667 12C6.66667 11.6464 6.80714 11.3072 7.05719 11.0572C7.30724 10.8071 7.64638 10.6667 8 10.6667ZM4.21061 8.33059L7.12261 5.00259M11.7892 8.33056L8.87858 5.0039M4.66667 9.33332C4.66667 8.9797 4.52619 8.64056 4.27614 8.39051C4.02609 8.14047 3.68696 7.99999 3.33333 7.99999C2.97971 7.99999 2.64057 8.14047 2.39052 8.39051C2.14048 8.64056 2 8.9797 2 9.33332C2 9.68695 2.14048 10.0261 2.39052 10.2761C2.64057 10.5262 2.97971 10.6667 3.33333 10.6667C3.68696 10.6667 4.02609 10.5262 4.27614 10.2761C4.52619 10.0261 4.66667 9.68695 4.66667 9.33332ZM14 9.33332C14 8.9797 13.8595 8.64056 13.6095 8.39051C13.3594 8.14047 13.0203 7.99999 12.6667 7.99999C12.313 7.99999 11.9739 8.14047 11.7239 8.39051C11.4738 8.64056 11.3333 8.9797 11.3333 9.33332C11.3333 9.68695 11.4738 10.0261 11.7239 10.2761C11.9739 10.5262 12.313 10.6667 12.6667 10.6667C13.0203 10.6667 13.3594 10.5262 13.6095 10.2761C13.8595 10.0261 14 9.68695 14 9.33332Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPorts.displayName = 'IconPorts';

/**
 * Publish - 16x16 프레임
 */
export const IconPublish = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.3327 4.99955V3.66622C13.3327 3.3126 13.1922 2.97346 12.9422 2.72341C12.6921 2.47336 12.353 2.33289 11.9993 2.33289L3.99935 2.33289C3.64573 2.33289 3.30659 2.47336 3.05654 2.72341C2.80649 2.97346 2.66602 3.3126 2.66602 3.66622L2.66602 4.99955M4.66606 8.33337L7.99939 5.00004M7.99939 5.00004L11.3327 8.33337M7.99939 5.00004V13"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPublish.displayName = 'IconPublish';

/**
 * Reboot - 16x16 프레임
 */
export const IconReboot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66732 3.99996C3.85824 4.68314 3.27863 5.59843 3.00694 6.62192C2.73525 7.6454 2.7846 8.72766 3.14832 9.72217C3.51204 10.7167 4.17256 11.5754 5.04046 12.1821C5.90836 12.7888 6.94172 13.1142 8.00065 13.1142C9.05959 13.1142 10.0929 12.7888 10.9608 12.1821C11.8287 11.5754 12.4893 10.7167 12.853 9.72217C13.2167 8.72766 13.2661 7.6454 12.9944 6.62192C12.7227 5.59843 12.1431 4.68314 11.334 3.99996M8.00065 2.66663V7.99996"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconReboot.displayName = 'IconReboot';

/**
 * Refresh - 16x16 프레임
 */
export const IconRefresh = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M13.3327 7.33346C13.1696 6.16027 12.6254 5.07324 11.7838 4.23979C10.9422 3.40635 9.84985 2.87274 8.67513 2.72116C7.50041 2.56959 6.30843 2.80845 5.28282 3.40096C4.2572 3.99347 3.45485 4.90675 2.99935 6.00013M2.66602 3.33346V6.00013H5.33268M2.66602 8.66667C2.82906 9.83985 3.3733 10.9269 4.21492 11.7603C5.05654 12.5938 6.14884 13.1274 7.32357 13.279C8.49829 13.4305 9.69027 13.1917 10.7159 12.5992C11.7415 12.0067 12.5438 11.0934 12.9993 10M13.3327 12.6667V10H10.666"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconRefresh.displayName = 'IconRefresh';

/**
 * Request - 16x16 프레임
 */
export const IconRequest = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 8L7.33333 9.33333L10 6.66667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconRequest.displayName = 'IconRequest';

/**
 * Routers-1 - 16x16 프레임
 */
export const IconRouters1 = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 1.16667, className, style, ...props }, ref) => {
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12.6667 4.5H3.33333C2.689 4.5 2.16666 5.02233 2.16666 5.66667V10.3333C2.16666 10.9777 2.689 11.5 3.33333 11.5H12.6667C13.311 11.5 13.8333 10.9777 13.8333 10.3333V5.66667C13.8333 5.02233 13.311 4.5 12.6667 4.5Z"   stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.5 8H4.50583"   stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6.83334 8H6.83917"   stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.16666 8H9.1725"   stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M11.5 8H11.5058"   stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconRouters1.displayName = 'IconRouters1';

/**
 * Routers - 16x16 프레임
 */
export const IconRouters = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M11.3333 11.3333V11.34M8.66667 11.3333V11.34M10 8.66667V7.33333M7.83333 5.83346C8.08022 5.48936 8.40552 5.20901 8.78229 5.01562C9.15907 4.82222 9.57649 4.72135 10 4.72135C10.4235 4.72135 10.8409 4.82222 11.2177 5.01562C11.5945 5.20901 11.9198 5.48936 12.1667 5.83346M5.66667 4.33358C6.16045 3.64538 6.81104 3.08468 7.56459 2.6979C8.31814 2.31112 9.15298 2.10937 10 2.10938C10.847 2.10937 11.6819 2.31112 12.4354 2.6979C13.189 3.08468 13.8396 3.64538 14.3333 4.33358M2 10C2 9.64638 2.14048 9.30724 2.39052 9.05719C2.64057 8.80714 2.97971 8.66667 3.33333 8.66667H12.6667C13.0203 8.66667 13.3594 8.80714 13.6095 9.05719C13.8595 9.30724 14 9.64638 14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconRouters.displayName = 'IconRouters';

/**
 * Schedule - 16x16 프레임
 */
export const IconSchedule = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2" clip-path="url(#clip0_379_3462)">
<ns0:path d="M8.00065 4.00004V8.00004L10.6673 9.33337M14.6673 8.00004C14.6673 11.6819 11.6825 14.6667 8.00065 14.6667C4.31875 14.6667 1.33398 11.6819 1.33398 8.00004C1.33398 4.31814 4.31875 1.33337 8.00065 1.33337C11.6825 1.33337 14.6673 4.31814 14.6673 8.00004Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_379_3462">
<ns0:rect width="16" height="16" fill="white" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconSchedule.displayName = 'IconSchedule';

/**
 * Search - 16x16 프레임
 */
export const IconSearch = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M14 14L9.99995 10M1.99995 6.66667C1.99995 7.2795 2.12066 7.88634 2.35518 8.45252C2.58971 9.01871 2.93345 9.53316 3.36679 9.9665C3.80013 10.3998 4.31458 10.7436 4.88077 10.9781C5.44695 11.2126 6.05379 11.3333 6.66662 11.3333C7.27946 11.3333 7.88629 11.2126 8.45248 10.9781C9.01866 10.7436 9.53311 10.3998 9.96645 9.9665C10.3998 9.53316 10.7435 9.01871 10.9781 8.45252C11.2126 7.88634 11.3333 7.2795 11.3333 6.66667C11.3333 6.05383 11.2126 5.447 10.9781 4.88081C10.7435 4.31462 10.3998 3.80018 9.96645 3.36683C9.53311 2.93349 9.01866 2.58975 8.45248 2.35523C7.88629 2.12071 7.27946 2 6.66662 2C6.05379 2 5.44695 2.12071 4.88077 2.35523C4.31458 2.58975 3.80013 2.93349 3.36679 3.36683C2.93345 3.80018 2.58971 4.31462 2.35518 4.88081C2.12066 5.447 1.99995 6.05383 1.99995 6.66667Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSearch.displayName = 'IconSearch';

/**
 * Security - 16x16 프레임
 */
export const IconSecurity = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 13.8333C8 13.8333 12.6667 11.5 12.6667 7.99999V3.91666L8 2.16666L3.33333 3.91666V7.99999C3.33333 11.5 8 13.8333 8 13.8333Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSecurity.displayName = 'IconSecurity';

/**
 * SecurityError - 16x16 프레임
 */
export const IconSecurityerror = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10.0267 13.1633C9.39872 13.5307 8.71739 13.814 8.00005 14C6.9622 13.7308 5.98904 13.2557 5.13842 12.603C4.28779 11.9503 3.57706 11.1332 3.04845 10.2004C2.51984 9.26751 2.18414 8.23793 2.06131 7.17279C1.93847 6.10764 2.03099 5.02868 2.33339 4C4.41041 4.09504 6.44283 3.37772 8.00005 2C9.55728 3.37772 11.5897 4.09504 13.6667 4C14.05 5.30392 14.0947 6.68399 13.7967 8.01M12.6667 10.6667V12.6667M12.6667 14.6667V14.6733"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSecurityerror.displayName = 'IconSecurityerror';

/**
 * SecurityGroup - 16x16 프레임
 */
export const IconSecuritygroup = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.99919 8C7.82238 8 7.65281 7.92976 7.52778 7.80474C7.40276 7.67971 7.33252 7.51014 7.33252 7.33333C7.33252 7.15652 7.40276 6.98695 7.52778 6.86193C7.65281 6.7369 7.82238 6.66667 7.99919 6.66667C8.176 6.66667 8.34557 6.7369 8.47059 6.86193C8.59562 6.98695 8.66585 7.15652 8.66585 7.33333C8.66585 7.51014 8.59562 7.67971 8.47059 7.80474C8.34557 7.92976 8.176 8 7.99919 8ZM7.99919 8V9.66667M7.99924 2C9.55646 3.37772 11.5889 4.09504 13.6659 4C13.9683 5.02868 14.0608 6.10764 13.938 7.17279C13.8151 8.23793 13.4795 9.26751 12.9508 10.2004C12.4222 11.1332 11.7115 11.9503 10.8609 12.603C10.0103 13.2557 9.0371 13.7308 7.99924 14C6.96138 13.7308 5.98823 13.2557 5.1376 12.603C4.28698 11.9503 3.57625 11.1332 3.04764 10.2004C2.51903 9.26751 2.18333 8.23793 2.06049 7.17279C1.93765 6.10764 2.03018 5.02868 2.33257 4C4.40959 4.09504 6.44202 3.37772 7.99924 2Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSecuritygroup.displayName = 'IconSecuritygroup';

/**
 * Server - 16x16 프레임
 */
export const IconServer = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12 7.99999C12.5304 7.99999 13.0391 7.78928 13.4142 7.4142C13.7893 7.03913 14 6.53042 14 5.99999V4.66666C14 4.13622 13.7893 3.62752 13.4142 3.25244C13.0391 2.87737 12.5304 2.66666 12 2.66666H4C3.46957 2.66666 2.96086 2.87737 2.58579 3.25244C2.21071 3.62752 2 4.13622 2 4.66666V5.99999C2 6.53042 2.21071 7.03913 2.58579 7.4142C2.96086 7.78928 3.46957 7.99999 4 7.99999M12 7.99999H4M12 7.99999C12.5304 7.99999 13.0391 8.2107 13.4142 8.58578C13.7893 8.96085 14 9.46956 14 9.99999V11.3333C14 11.8638 13.7893 12.3725 13.4142 12.7475C13.0391 13.1226 12.5304 13.3333 12 13.3333H4C3.46957 13.3333 2.96086 13.1226 2.58579 12.7475C2.21071 12.3725 2 11.8638 2 11.3333V9.99999C2 9.46956 2.21071 8.96085 2.58579 8.58578C2.96086 8.2107 3.46957 7.99999 4 7.99999M4.66667 5.33332V5.33999M4.66667 10.6667V10.6733"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconServer.displayName = 'IconServer';

/**
 * Setting - 16x16 프레임
 */
export const IconSetting = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6.88333 2.878C7.16733 1.70733 8.83267 1.70733 9.11667 2.878C9.15928 3.05387 9.24281 3.21719 9.36047 3.35467C9.47813 3.49215 9.62659 3.5999 9.79377 3.66916C9.96094 3.73843 10.1421 3.76723 10.3225 3.75325C10.5029 3.73926 10.6775 3.68287 10.832 3.58867C11.8607 2.962 13.0387 4.13933 12.412 5.16867C12.3179 5.3231 12.2616 5.49756 12.2477 5.67785C12.2337 5.85814 12.2625 6.03918 12.3317 6.20625C12.4009 6.37333 12.5085 6.52172 12.6458 6.63937C12.7831 6.75702 12.9463 6.8406 13.122 6.88333C14.2927 7.16733 14.2927 8.83267 13.122 9.11667C12.9461 9.15928 12.7828 9.24281 12.6453 9.36047C12.5079 9.47813 12.4001 9.62659 12.3308 9.79377C12.2616 9.96094 12.2328 10.1421 12.2468 10.3225C12.2607 10.5029 12.3171 10.6775 12.4113 10.832C13.038 11.8607 11.8607 13.0387 10.8313 12.412C10.6769 12.3179 10.5024 12.2616 10.3222 12.2477C10.1419 12.2337 9.96082 12.2625 9.79375 12.3317C9.62667 12.4009 9.47828 12.5085 9.36063 12.6458C9.24298 12.7831 9.1594 12.9463 9.11667 13.122C8.83267 14.2927 7.16733 14.2927 6.88333 13.122C6.84072 12.9461 6.75719 12.7828 6.63953 12.6453C6.52187 12.5079 6.37341 12.4001 6.20623 12.3308C6.03906 12.2616 5.85789 12.2328 5.67748 12.2468C5.49706 12.2607 5.3225 12.3171 5.168 12.4113C4.13933 13.038 2.96133 11.8607 3.588 10.8313C3.68207 10.6769 3.73837 10.5024 3.75232 10.3222C3.76628 10.1419 3.7375 9.96082 3.66831 9.79375C3.59913 9.62667 3.49151 9.47828 3.35418 9.36063C3.21686 9.24298 3.05371 9.1594 2.878 9.11667C1.70733 8.83267 1.70733 7.16733 2.878 6.88333C3.05387 6.84072 3.21719 6.75719 3.35467 6.63953C3.49215 6.52187 3.5999 6.37341 3.66916 6.20623C3.73843 6.03906 3.76723 5.85789 3.75325 5.67748C3.73926 5.49706 3.68287 5.3225 3.58867 5.168C2.962 4.13933 4.13933 2.96133 5.16867 3.588C5.83533 3.99333 6.69933 3.63467 6.88333 2.878Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 8C6 8.53043 6.21071 9.03914 6.58579 9.41421C6.96086 9.78929 7.46957 10 8 10C8.53043 10 9.03914 9.78929 9.41421 9.41421C9.78929 9.03914 10 8.53043 10 8C10 7.46957 9.78929 6.96086 9.41421 6.58579C9.03914 6.21071 8.53043 6 8 6C7.46957 6 6.96086 6.21071 6.58579 6.58579C6.21071 6.96086 6 7.46957 6 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSetting.displayName = 'IconSetting';

/**
 * Shelved - 16x16 프레임
 */
export const IconShelved = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.3333 10.6667L10.6667 13.3333M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M10.6667 10.6667L13.3333 13.3333M4.66666 8L8 11.3333L7 12.3333C6.78244 12.5581 6.52234 12.7373 6.23483 12.8605C5.94733 12.9837 5.63818 13.0484 5.3254 13.051C5.01262 13.0535 4.70247 12.9938 4.413 12.8753C4.12354 12.7567 3.86056 12.5818 3.63938 12.3606C3.4182 12.1394 3.24326 11.8765 3.12473 11.587C3.00621 11.2975 2.94647 10.9874 2.94901 10.6746C2.95155 10.3618 3.01631 10.0527 3.13952 9.76516C3.26273 9.47766 3.44193 9.21756 3.66666 9L4.66666 8ZM11.3333 8L8 4.66666L9 3.66666C9.21756 3.44193 9.47766 3.26273 9.76516 3.13952C10.0527 3.01631 10.3618 2.95155 10.6746 2.94901C10.9874 2.94647 11.2975 3.00621 11.587 3.12473C11.8765 3.24326 12.1394 3.4182 12.3606 3.63938C12.5818 3.86056 12.7567 4.12354 12.8753 4.413C12.9938 4.70247 13.0535 5.01262 13.051 5.3254C13.0484 5.63818 12.9837 5.94733 12.8605 6.23483C12.7373 6.52234 12.5581 6.78244 12.3333 7L11.3333 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconShelved.displayName = 'IconShelved';

/**
 * Show - 16x16 프레임
 */
export const IconShow = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6.66667 8C6.66667 8.35362 6.80714 8.69276 7.05719 8.94281C7.30724 9.19286 7.64638 9.33333 8 9.33333C8.35362 9.33333 8.69276 9.19286 8.94281 8.94281C9.19286 8.69276 9.33333 8.35362 9.33333 8C9.33333 7.64638 9.19286 7.30724 8.94281 7.05719C8.69276 6.80714 8.35362 6.66667 8 6.66667C7.64638 6.66667 7.30724 6.80714 7.05719 7.05719C6.80714 7.30724 6.66667 7.64638 6.66667 8Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M14 8C12.4 10.6667 10.4 12 8 12C5.6 12 3.6 10.6667 2 8C3.6 5.33333 5.6 4 8 4C10.4 4 12.4 5.33333 14 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconShow.displayName = 'IconShow';

/**
 * Sidebar - 16x16 프레임
 */
export const IconSidebar = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 4V12M3 5.25C3 4.91848 3.1317 4.60054 3.36612 4.36612C3.60054 4.1317 3.91848 4 4.25 4H11.75C12.0815 4 12.3995 4.1317 12.6339 4.36612C12.8683 4.60054 13 4.91848 13 5.25V10.75C13 11.0815 12.8683 11.3995 12.6339 11.6339C12.3995 11.8683 12.0815 12 11.75 12H4.25C3.91848 12 3.60054 11.8683 3.36612 11.6339C3.1317 11.3995 3 11.0815 3 10.75V5.25Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSidebar.displayName = 'IconSidebar';

/**
 * Snapshot - 16x16 프레임
 */
export const IconSnapshot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.33333 4.66666H4C4.35362 4.66666 4.69276 4.52619 4.94281 4.27614C5.19286 4.02609 5.33333 3.68695 5.33333 3.33333C5.33333 3.15652 5.40357 2.98695 5.5286 2.86193C5.65362 2.7369 5.82319 2.66666 6 2.66666H10C10.1768 2.66666 10.3464 2.7369 10.4714 2.86193C10.5964 2.98695 10.6667 3.15652 10.6667 3.33333C10.6667 3.68695 10.8071 4.02609 11.0572 4.27614C11.3072 4.52619 11.6464 4.66666 12 4.66666H12.6667C13.0203 4.66666 13.3594 4.80714 13.6095 5.05719C13.8595 5.30724 14 5.64638 14 6V12C14 12.3536 13.8595 12.6928 13.6095 12.9428C13.3594 13.1929 13.0203 13.3333 12.6667 13.3333H3.33333C2.97971 13.3333 2.64057 13.1929 2.39052 12.9428C2.14048 12.6928 2 12.3536 2 12V6C2 5.64638 2.14048 5.30724 2.39052 5.05719C2.64057 4.80714 2.97971 4.66666 3.33333 4.66666Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 8.66666C6 9.1971 6.21071 9.70581 6.58579 10.0809C6.96086 10.456 7.46957 10.6667 8 10.6667C8.53043 10.6667 9.03914 10.456 9.41421 10.0809C9.78929 9.70581 10 9.1971 10 8.66666C10 8.13623 9.78929 7.62752 9.41421 7.25245C9.03914 6.87738 8.53043 6.66666 8 6.66666C7.46957 6.66666 6.96086 6.87738 6.58579 7.25245C6.21071 7.62752 6 8.13623 6 8.66666Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSnapshot.displayName = 'IconSnapshot';

/**
 * Stop - 16x16 프레임
 */
export const IconStop = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M3.33398 4.66671C3.33398 4.31309 3.47446 3.97395 3.72451 3.7239C3.97456 3.47385 4.3137 3.33337 4.66732 3.33337H11.334C11.6876 3.33337 12.0267 3.47385 12.2768 3.7239C12.5268 3.97395 12.6673 4.31309 12.6673 4.66671V11.3334C12.6673 11.687 12.5268 12.0261 12.2768 12.2762C12.0267 12.5262 11.6876 12.6667 11.334 12.6667H4.66732C4.3137 12.6667 3.97456 12.5262 3.72451 12.2762C3.47446 12.0261 3.33398 11.687 3.33398 11.3334V4.66671Z"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconStop.displayName = 'IconStop';

/**
 * Storage - 16x16 프레임
 */
export const IconStorage = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4C2.66602 4.53043 3.22792 5.03914 4.22811 5.41421C5.22831 5.78929 6.58486 6 7.99935 6C9.41384 6 10.7704 5.78929 11.7706 5.41421C12.7708 5.03914 13.3327 4.53043 13.3327 4M2.66602 4C2.66602 3.46957 3.22792 2.96086 4.22811 2.58579C5.22831 2.21071 6.58486 2 7.99935 2C9.41384 2 10.7704 2.21071 11.7706 2.58579C12.7708 2.96086 13.3327 3.46957 13.3327 4M2.66602 4V8M13.3327 4V8M2.66602 8C2.66602 8.53043 3.22792 9.03914 4.22811 9.41421C5.22831 9.78929 6.58486 10 7.99935 10C9.41384 10 10.7704 9.78929 11.7706 9.41421C12.7708 9.03914 13.3327 8.53043 13.3327 8M2.66602 8V12C2.66602 12.5304 3.22792 13.0391 4.22811 13.4142C5.22831 13.7893 6.58486 14 7.99935 14C9.41384 14 10.7704 13.7893 11.7706 13.4142C12.7708 13.0391 13.3327 12.5304 13.3327 12V8"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconStorage.displayName = 'IconStorage';

/**
 * Suspended - 16x16 프레임
 */
export const IconSuspended = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.17162 8H10.8285M3.75741 12.2426C4.31456 12.7998 4.97599 13.2417 5.70395 13.5433C6.4319 13.8448 7.21211 14 8.00005 14C8.78798 14 9.56819 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2427 12.2426C12.7998 11.6855 13.2418 11.0241 13.5433 10.2961C13.8449 9.56815 14 8.78793 14 8C14 7.21207 13.8449 6.43185 13.5433 5.7039C13.2418 4.97595 12.7998 4.31451 12.2427 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56819 2.15519 8.78798 2 8.00005 2C7.21211 2 6.4319 2.15519 5.70395 2.45672C4.97599 2.75825 4.31456 3.20021 3.75741 3.75736C3.20025 4.31451 2.7583 4.97595 2.45677 5.7039C2.15524 6.43185 2.00005 7.21207 2.00005 8C2.00005 8.78793 2.15524 9.56815 2.45677 10.2961C2.7583 11.0241 3.20025 11.6855 3.75741 12.2426Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSuspended.displayName = 'IconSuspended';

/**
 * Template - 16x16 프레임
 */
export const IconTemplate = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33268 8.00002H13.3327M9.33268 10.6667H13.3327M9.33268 13.3334H13.3327M2.66602 3.33335C2.66602 3.15654 2.73625 2.98697 2.86128 2.86195C2.9863 2.73693 3.15587 2.66669 3.33268 2.66669H12.666C12.8428 2.66669 13.0124 2.73693 13.1374 2.86195C13.2624 2.98697 13.3327 3.15654 13.3327 3.33335V4.66669C13.3327 4.8435 13.2624 5.01307 13.1374 5.13809C13.0124 5.26312 12.8428 5.33335 12.666 5.33335H3.33268C3.15587 5.33335 2.9863 5.26312 2.86128 5.13809C2.73625 5.01307 2.66602 4.8435 2.66602 4.66669V3.33335ZM2.66602 8.66669C2.66602 8.48988 2.73625 8.32031 2.86128 8.19528C2.9863 8.07026 3.15587 8.00002 3.33268 8.00002H5.99935C6.17616 8.00002 6.34573 8.07026 6.47075 8.19528C6.59578 8.32031 6.66602 8.48988 6.66602 8.66669V12.6667C6.66602 12.8435 6.59578 13.0131 6.47075 13.1381C6.34573 13.2631 6.17616 13.3334 5.99935 13.3334H3.33268C3.15587 13.3334 2.9863 13.2631 2.86128 13.1381C2.73625 13.0131 2.66602 12.8435 2.66602 12.6667V8.66669Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconTemplate.displayName = 'IconTemplate';

/**
 * Topology - 16x16 프레임
 */
export const IconTopology = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.00065 8C4.00065 7.64638 3.86018 7.30724 3.61013 7.05719C3.36008 6.80714 3.02094 6.66667 2.66732 6.66667C2.3137 6.66667 1.97456 6.80714 1.72451 7.05719C1.47446 7.30724 1.33398 7.64638 1.33398 8C1.33398 8.35362 1.47446 8.69276 1.72451 8.94281C1.97456 9.19286 2.3137 9.33333 2.66732 9.33333C3.02094 9.33333 3.36008 9.19286 3.61013 8.94281C3.86018 8.69276 4.00065 8.35362 4.00065 8ZM4.00065 8H6.66732M9.33398 8C9.33398 7.64638 9.19351 7.30724 8.94346 7.05719C8.69341 6.80714 8.35427 6.66667 8.00065 6.66667C7.64703 6.66667 7.30789 6.80714 7.05784 7.05719C6.80779 7.30724 6.66732 7.64638 6.66732 8M9.33398 8C9.33398 8.35362 9.19351 8.69276 8.94346 8.94281C8.69341 9.19286 8.35427 9.33333 8.00065 9.33333C7.64703 9.33333 7.30789 9.19286 7.05784 8.94281C6.80779 8.69276 6.66732 8.35362 6.66732 8M9.33398 8H12.0007M12.0007 8C12.0007 7.64638 12.1411 7.30724 12.3912 7.05719C12.6412 6.80714 12.9804 6.66667 13.334 6.66667C13.6876 6.66667 14.0267 6.80714 14.2768 7.05719C14.5268 7.30724 14.6673 7.64638 14.6673 8C14.6673 8.35362 14.5268 8.69276 14.2768 8.94281C14.0267 9.19286 13.6876 9.33333 13.334 9.33333C12.9804 9.33333 12.6412 9.19286 12.3912 8.94281C12.1411 8.69276 12.0007 8.35362 12.0007 8ZM10.0007 4.66667L8.66732 6.66667M6.00065 4.66667L7.33398 6.66667M7.33398 9.33333L6.00065 11.3333M8.66732 9.33333L10.0007 11.3333M6.66732 12.6667C6.66732 12.313 6.52684 11.9739 6.27679 11.7239C6.02674 11.4738 5.68761 11.3333 5.33398 11.3333C4.98036 11.3333 4.64122 11.4738 4.39118 11.7239C4.14113 11.9739 4.00065 12.313 4.00065 12.6667C4.00065 13.0203 4.14113 13.3594 4.39118 13.6095C4.64122 13.8595 4.98036 14 5.33398 14C5.68761 14 6.02674 13.8595 6.27679 13.6095C6.52684 13.3594 6.66732 13.0203 6.66732 12.6667ZM12.0007 3.33333C12.0007 2.97971 11.8602 2.64057 11.6101 2.39052C11.3601 2.14048 11.0209 2 10.6673 2C10.3137 2 9.97456 2.14048 9.72451 2.39052C9.47446 2.64057 9.33398 2.97971 9.33398 3.33333C9.33398 3.68696 9.47446 4.02609 9.72451 4.27614C9.97456 4.52619 10.3137 4.66667 10.6673 4.66667C11.0209 4.66667 11.3601 4.52619 11.6101 4.27614C11.8602 4.02609 12.0007 3.68696 12.0007 3.33333ZM6.66732 3.33333C6.66732 2.97971 6.52684 2.64057 6.27679 2.39052C6.02674 2.14048 5.68761 2 5.33398 2C4.98036 2 4.64122 2.14048 4.39118 2.39052C4.14113 2.64057 4.00065 2.97971 4.00065 3.33333C4.00065 3.68696 4.14113 4.02609 4.39118 4.27614C4.64122 4.52619 4.98036 4.66667 5.33398 4.66667C5.68761 4.66667 6.02674 4.52619 6.27679 4.27614C6.52684 4.02609 6.66732 3.68696 6.66732 3.33333ZM12.0007 12.6667C12.0007 12.313 11.8602 11.9739 11.6101 11.7239C11.3601 11.4738 11.0209 11.3333 10.6673 11.3333C10.3137 11.3333 9.97456 11.4738 9.72451 11.7239C9.47446 11.9739 9.33398 12.313 9.33398 12.6667C9.33398 13.0203 9.47446 13.3594 9.72451 13.6095C9.97456 13.8595 10.3137 14 10.6673 14C11.0209 14 11.3601 13.8595 11.6101 13.6095C11.8602 13.3594 12.0007 13.0203 12.0007 12.6667Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconTopology.displayName = 'IconTopology';

/**
 * Upload - 16x16 프레임
 */
export const IconUpload = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 11.3333V12.6666C2.66602 13.0202 2.80649 13.3594 3.05654 13.6094C3.30659 13.8595 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8595 12.9422 13.6094C13.1922 13.3594 13.3327 13.0202 13.3327 12.6666V11.3333M4.66602 5.99996L7.99935 2.66663M7.99935 2.66663L11.3327 5.99996M7.99935 2.66663V10.6666"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconUpload.displayName = 'IconUpload';

/**
 * Verify - 16x16 프레임
 */
export const IconVerify = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.7066 2.46029C4.97865 2.76161 4.31717 3.20335 3.75993 3.76029M2.46 5.70638C2.1577 6.43325 2.0014 7.21249 2 7.99971M2.45996 10.2936C2.76129 11.0216 3.20302 11.683 3.75996 12.2403M5.70671 13.5397C6.43357 13.842 7.21282 13.9983 8.00004 13.9997M10.2933 13.5402C11.0212 13.2389 11.6827 12.7972 12.24 12.2402M13.54 10.2933C13.8423 9.56647 13.9986 8.78722 14 8M13.5401 5.70643C13.2387 4.97849 12.797 4.31701 12.2401 3.75977M10.2933 2.46C9.56647 2.1577 8.78722 2.0014 8 2M6 8L7.33333 9.33333L10 6.66667"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconVerify.displayName = 'IconVerify';

/**
 * Volume Search - 16x16 프레임
 */
export const IconVolumeSearch = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M14 14L12.6667 12.6667M10 11.5556C10 11.7598 10.0402 11.9621 10.1184 12.1508C10.1966 12.3396 10.3112 12.5111 10.4556 12.6555C10.6001 12.7999 10.7715 12.9145 10.9603 12.9927C11.149 13.0709 11.3513 13.1111 11.5556 13.1111C11.7598 13.1111 11.9621 13.0709 12.1508 12.9927C12.3396 12.9145 12.5111 12.7999 12.6555 12.6555C12.7999 12.5111 12.9145 12.3396 12.9927 12.1508C13.0709 11.9621 13.1111 11.7598 13.1111 11.5556C13.1111 11.3513 13.0709 11.149 12.9927 10.9603C12.9145 10.7715 12.7999 10.6001 12.6555 10.4556C12.5111 10.3112 12.3396 10.1966 12.1508 10.1184C11.9621 10.0402 11.7598 10 11.5556 10C11.3513 10 11.149 10.0402 10.9603 10.1184C10.7715 10.1966 10.6001 10.3112 10.4556 10.4556C10.3112 10.6001 10.1966 10.7715 10.1184 10.9603C10.0402 11.149 10 11.3513 10 11.5556Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconVolumeSearch.displayName = 'IconVolumeSearch';

/**
 * Volume Type - 16x16 프레임
 */
export const IconVolumeType = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M12.6667 14C12.313 14 11.9739 13.8595 11.7239 13.6095C11.4738 13.3594 11.3333 13.0203 11.3333 12.6667C11.3333 12.313 11.4738 11.9739 11.7239 11.7239C11.9739 11.4738 12.313 11.3333 12.6667 11.3333M12.6667 14C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667C14 12.313 13.8595 11.9739 13.6095 11.7239C13.3594 11.4738 13.0203 11.3333 12.6667 11.3333M12.6667 14V15M12.6667 11.3333V10.3333M14.6873 11.5L13.8213 12M11.5127 13.3333L10.646 13.8333M10.646 11.5L11.5127 12M13.8213 13.3333L14.688 13.8333"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconVolumeType.displayName = 'IconVolumeType';

/**
 * Warning - 16x16 프레임
 */
export const IconWarning = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 5.33333V8M8 10.6667H8.00667M13.25 4.17972C13.7167 4.44505 14.0033 4.94172 14 5.47839V10.3344C14 10.8737 13.7047 11.3711 13.228 11.6331L8.728 14.4797C8.5049 14.6022 8.25451 14.6664 8 14.6664C7.74549 14.6664 7.4951 14.6022 7.272 14.4797L2.772 11.6331C2.53878 11.5056 2.34408 11.3178 2.20827 11.0894C2.07247 10.8609 2.00053 10.6002 2 10.3344V5.47772C2 4.93839 2.29533 4.44172 2.772 4.17972L7.272 1.52639C7.50169 1.39975 7.75971 1.33333 8.022 1.33333C8.28429 1.33333 8.54231 1.39975 8.772 1.52639L13.272 4.17972H13.25Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconWarning.displayName = 'IconWarning';

/**
 * activity - 16x16 프레임
 */
export const IconActivity = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13 8H11L9.5 12.5L6.5 3.5L5 8H3"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconActivity.displayName = 'IconActivity';

/**
 * add - 16x16 프레임
 */
export const IconAdd = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 8H10M8 6V10M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAdd.displayName = 'IconAdd';

/**
 * adjustments-alt - 16x16 프레임
 */
export const IconAdjustmentsAlt = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.99935 2.66699V5.33366M3.99935 5.33366C4.73573 5.33366 5.33268 5.93061 5.33268 6.66699C5.33268 7.40337 4.73573 8.00033 3.99935 8.00033M3.99935 5.33366C3.26297 5.33366 2.66602 5.93061 2.66602 6.66699C2.66602 7.40337 3.26297 8.00033 3.99935 8.00033M3.99935 8.00033V13.3337M7.99935 2.66699V9.33366M7.99935 9.33366C8.73573 9.33366 9.33268 9.93061 9.33268 10.667C9.33268 11.4034 8.73573 12.0003 7.99935 12.0003M7.99935 9.33366C7.26297 9.33366 6.66602 9.93061 6.66602 10.667C6.66602 11.4034 7.26297 12.0003 7.99935 12.0003M7.99935 12.0003V13.3337M11.9993 2.66699V3.33366M11.9993 3.33366C12.7357 3.33366 13.3327 3.93061 13.3327 4.66699C13.3327 5.40337 12.7357 6.00033 11.9993 6.00033M11.9993 3.33366C11.263 3.33366 10.666 3.93061 10.666 4.66699C10.666 5.40337 11.263 6.00033 11.9993 6.00033M11.9993 6.00033V13.3337"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAdjustmentsAlt.displayName = 'IconAdjustmentsAlt';

/**
 * affiliate - 16x16 프레임
 */
export const IconAffiliate = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.95378 4.45736L4.80378 7.29002M8.54178 11.0294L11.3758 11.8794M7.78841 8.04474L11.6277 4.2054M2.66602 3.5C2.66602 3.63132 2.69188 3.76136 2.74214 3.88268C2.79239 4.00401 2.86605 4.11425 2.95891 4.20711C3.05177 4.29997 3.16201 4.37362 3.28333 4.42388C3.40466 4.47413 3.53469 4.5 3.66602 4.5C3.79734 4.5 3.92737 4.47413 4.0487 4.42388C4.17002 4.37362 4.28026 4.29997 4.37312 4.20711C4.46598 4.11425 4.53964 4.00401 4.5899 3.88268C4.64015 3.76136 4.66602 3.63132 4.66602 3.5C4.66602 3.36868 4.64015 3.23864 4.5899 3.11732C4.53964 2.99599 4.46598 2.88575 4.37312 2.79289C4.28026 2.70003 4.17002 2.62638 4.0487 2.57612C3.92737 2.52587 3.79734 2.5 3.66602 2.5C3.53469 2.5 3.40466 2.52587 3.28333 2.57612C3.16201 2.62638 3.05177 2.70003 2.95891 2.79289C2.86605 2.88575 2.79239 2.99599 2.74214 3.11732C2.69188 3.23864 2.66602 3.36868 2.66602 3.5ZM11.3327 3.5C11.3327 3.76522 11.438 4.01957 11.6256 4.20711C11.8131 4.39464 12.0675 4.5 12.3327 4.5C12.5979 4.5 12.8523 4.39464 13.0398 4.20711C13.2273 4.01957 13.3327 3.76522 13.3327 3.5C13.3327 3.23478 13.2273 2.98043 13.0398 2.79289C12.8523 2.60536 12.5979 2.5 12.3327 2.5C12.0675 2.5 11.8131 2.60536 11.6256 2.79289C11.438 2.98043 11.3327 3.23478 11.3327 3.5ZM11.3327 12.1667C11.3327 12.4319 11.438 12.6862 11.6256 12.8738C11.8131 13.0613 12.0675 13.1667 12.3327 13.1667C12.5979 13.1667 12.8523 13.0613 13.0398 12.8738C13.2273 12.6862 13.3327 12.4319 13.3327 12.1667C13.3327 11.9015 13.2273 11.6471 13.0398 11.4596C12.8523 11.272 12.5979 11.1667 12.3327 11.1667C12.0675 11.1667 11.8131 11.272 11.6256 11.4596C11.438 11.6471 11.3327 11.9015 11.3327 12.1667ZM2.66602 10.1667C2.66602 10.9623 2.98209 11.7254 3.5447 12.288C4.1073 12.8506 4.87037 13.1667 5.66602 13.1667C6.46167 13.1667 7.22473 12.8506 7.78734 12.288C8.34994 11.7254 8.66602 10.9623 8.66602 10.1667C8.66602 9.37102 8.34994 8.60796 7.78734 8.04535C7.22473 7.48274 6.46167 7.16667 5.66602 7.16667C4.87037 7.16667 4.1073 7.48274 3.5447 8.04535C2.98209 8.60796 2.66602 9.37102 2.66602 10.1667Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconAffiliate.displayName = 'IconAffiliate';

/**
 * article-history - 16x16 프레임
 */
export const IconArticleHistory = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.22222 5.5H10.7778M5.22222 8H10.7778M5.22222 10.5H10.7778M3 4.25C3 3.91848 3.11706 3.60054 3.32544 3.36612C3.53381 3.1317 3.81643 3 4.11111 3H11.8889C12.1836 3 12.4662 3.1317 12.6746 3.36612C12.8829 3.60054 13 3.91848 13 4.25V11.75C13 12.0815 12.8829 12.3995 12.6746 12.6339C12.4662 12.8683 12.1836 13 11.8889 13H4.11111C3.81643 13 3.53381 12.8683 3.32544 12.6339C3.11706 12.3995 3 12.0815 3 11.75V4.25Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconArticleHistory.displayName = 'IconArticleHistory';

/**
 * brain - 16x16 프레임
 */
export const IconBrain = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10.3333 8.66667C9.7145 8.66667 9.121 8.9125 8.68342 9.35008C8.24583 9.78767 8 10.3812 8 11M8 11V11.6667M8 11C8 10.3812 7.75417 9.78767 7.31658 9.35008C6.879 8.9125 6.28551 8.66667 5.66667 8.66667M8 11V4.33333M8 11.6667C8 12.2855 8.24583 12.879 8.68342 13.3166C9.121 13.7542 9.7145 14 10.3333 14C10.9522 14 11.5457 13.7542 11.9832 13.3166C12.4208 12.879 12.6667 12.2855 12.6667 11.6667V10.4667M8 11.6667C8 12.2855 7.75417 12.879 7.31658 13.3166C6.879 13.7542 6.28551 14 5.66667 14C5.04783 14 4.45434 13.7542 4.01675 13.3166C3.57917 12.879 3.33333 12.2855 3.33333 11.6667V10.4667M11.6667 10.6667C12.2855 10.6667 12.879 10.4208 13.3166 9.98325C13.7542 9.54566 14 8.95217 14 8.33333C14 7.7145 13.7542 7.121 13.3166 6.68342C12.879 6.24583 12.2855 6 11.6667 6H11.3333M12.6667 6.2V4.33333C12.6667 3.71449 12.4208 3.121 11.9832 2.68342C11.5457 2.24583 10.9522 2 10.3333 2C9.7145 2 9.121 2.24583 8.68342 2.68342C8.24583 3.121 8 3.71449 8 4.33333M8 4.33333C8 3.71449 7.75417 3.121 7.31658 2.68342C6.879 2.24583 6.28551 2 5.66667 2C5.04783 2 4.45434 2.24583 4.01675 2.68342C3.57917 3.121 3.33333 3.71449 3.33333 4.33333V6.2M4.33333 10.6667C3.71449 10.6667 3.121 10.4208 2.68342 9.98325C2.24583 9.54566 2 8.95217 2 8.33333C2 7.7145 2.24583 7.121 2.68342 6.68342C3.121 6.24583 3.71449 6 4.33333 6H4.66667"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconBrain.displayName = 'IconBrain';

/**
 * branch - 16x16 프레임
 */
export const IconBranch = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6.00065 11.9998C6.00065 12.3535 5.86018 12.6926 5.61013 12.9426C5.36008 13.1927 5.02094 13.3332 4.66732 13.3332C4.3137 13.3332 3.97456 13.1927 3.72451 12.9426C3.47446 12.6926 3.33398 12.3535 3.33398 11.9998C3.33398 11.6462 3.47446 11.3071 3.72451 11.057C3.97456 10.807 4.3137 10.6665 4.66732 10.6665M6.00065 11.9998C6.00065 11.6462 5.86018 11.3071 5.61013 11.057C5.36008 10.807 5.02094 10.6665 4.66732 10.6665M6.00065 11.9998H10.0007C10.3543 11.9998 10.6934 11.8594 10.9435 11.6093C11.1935 11.3593 11.334 11.0201 11.334 10.6665V7.33317M4.66732 10.6665V5.33317M4.66732 5.33317C4.3137 5.33317 3.97456 5.19269 3.72451 4.94265C3.47446 4.6926 3.33398 4.35346 3.33398 3.99984C3.33398 3.64622 3.47446 3.30708 3.72451 3.05703C3.97456 2.80698 4.3137 2.6665 4.66732 2.6665C5.02094 2.6665 5.36008 2.80698 5.61013 3.05703C5.86018 3.30708 6.00065 3.64622 6.00065 3.99984C6.00065 4.35346 5.86018 4.6926 5.61013 4.94265C5.36008 5.19269 5.02094 5.33317 4.66732 5.33317ZM11.334 7.33317L9.33398 9.33317M11.334 7.33317L13.334 9.33317M10.0007 3.99984C10.0007 4.35346 10.1411 4.6926 10.3912 4.94265C10.6412 5.19269 10.9804 5.33317 11.334 5.33317C11.6876 5.33317 12.0267 5.19269 12.2768 4.94265C12.5268 4.6926 12.6673 4.35346 12.6673 3.99984C12.6673 3.64622 12.5268 3.30708 12.2768 3.05703C12.0267 2.80698 11.6876 2.6665 11.334 2.6665C10.9804 2.6665 10.6412 2.80698 10.3912 3.05703C10.1411 3.30708 10.0007 3.64622 10.0007 3.99984Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconBranch.displayName = 'IconBranch';

/**
 * cahatbot - 16x16 프레임
 */
export const IconCahatbot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6.33333 6.33333H6.34M9.66667 6.33333H9.67333M6.33333 9C6.55059 9.22173 6.8099 9.39789 7.09608 9.51814C7.38227 9.6384 7.68957 9.70034 8 9.70034C8.31043 9.70034 8.61773 9.6384 8.90392 9.51814C9.1901 9.39789 9.44941 9.22173 9.66667 9M12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V10.3333C14 10.8638 13.7893 11.3725 13.4142 11.7475C13.0391 12.1226 12.5304 12.3333 12 12.3333H8.66667L5.33333 14.3333V12.3333H4C3.46957 12.3333 2.96086 12.1226 2.58579 11.7475C2.21071 11.3725 2 10.8638 2 10.3333V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H12Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCahatbot.displayName = 'IconCahatbot';

/**
 * card - 16x16 프레임
 */
export const IconCard = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3 4.25C3 3.91848 3.1317 3.60054 3.36612 3.36612C3.60054 3.1317 3.91848 3 4.25 3H11.75C12.0815 3 12.3995 3.1317 12.6339 3.36612C12.8683 3.60054 13 3.91848 13 4.25V5.5C13 5.83152 12.8683 6.14946 12.6339 6.38388C12.3995 6.6183 12.0815 6.75 11.75 6.75H4.25C3.91848 6.75 3.60054 6.6183 3.36612 6.38388C3.1317 6.14946 3 5.83152 3 5.5V4.25Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3 10.5C3 10.1685 3.1317 9.85054 3.36612 9.61612C3.60054 9.3817 3.91848 9.25 4.25 9.25H11.75C12.0815 9.25 12.3995 9.3817 12.6339 9.61612C12.8683 9.85054 13 10.1685 13 10.5V11.75C13 12.0815 12.8683 12.3995 12.6339 12.6339C12.3995 12.8683 12.0815 13 11.75 13H4.25C3.91848 13 3.60054 12.8683 3.36612 12.6339C3.1317 12.3995 3 12.0815 3 11.75V10.5Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCard.displayName = 'IconCard';

/**
 * category - 16x16 프레임
 */
export const IconCategory = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33268 2.66699H13.3327V6.66699H9.33268V2.66699Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 9.33366H6.66602V13.3337H2.66602V9.33366Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33268 11.3337C9.33268 11.8641 9.5434 12.3728 9.91847 12.7479C10.2935 13.1229 10.8022 13.3337 11.3327 13.3337C11.8631 13.3337 12.3718 13.1229 12.7469 12.7479C13.122 12.3728 13.3327 11.8641 13.3327 11.3337C13.3327 10.8032 13.122 10.2945 12.7469 9.91945C12.3718 9.54437 11.8631 9.33366 11.3327 9.33366C10.8022 9.33366 10.2935 9.54437 9.91847 9.91945C9.5434 10.2945 9.33268 10.8032 9.33268 11.3337Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66602 4.66699C2.66602 4.92964 2.71775 5.18971 2.81826 5.43236C2.91877 5.67501 3.06608 5.89549 3.2518 6.08121C3.43752 6.26692 3.658 6.41424 3.90065 6.51475C4.1433 6.61526 4.40337 6.66699 4.66602 6.66699C4.92866 6.66699 5.18873 6.61526 5.43138 6.51475C5.67403 6.41424 5.89451 6.26692 6.08023 6.08121C6.26595 5.89549 6.41327 5.67501 6.51377 5.43236C6.61428 5.18971 6.66602 4.92964 6.66602 4.66699C6.66602 4.40435 6.61428 4.14428 6.51377 3.90163C6.41327 3.65897 6.26595 3.4385 6.08023 3.25278C5.89451 3.06706 5.67403 2.91974 5.43138 2.81923C5.18873 2.71872 4.92866 2.66699 4.66602 2.66699C4.40337 2.66699 4.1433 2.71872 3.90065 2.81923C3.658 2.91974 3.43752 3.06706 3.2518 3.25278C3.06608 3.4385 2.91877 3.65897 2.81826 3.90163C2.71775 4.14428 2.66602 4.40435 2.66602 4.66699Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCategory.displayName = 'IconCategory';

/**
 * chat - 16x16 프레임
 */
export const IconChat = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M9.33333 10V11.3333C9.33333 11.5101 9.2631 11.6797 9.13807 11.8047C9.01305 11.9298 8.84348 12 8.66667 12H4L2 14V7.33333C2 7.15652 2.07024 6.98695 2.19526 6.86193C2.32029 6.7369 2.48986 6.66667 2.66667 6.66667H4M14 9.33333L12 7.33333H7.33333C7.15652 7.33333 6.98695 7.2631 6.86193 7.13807C6.7369 7.01305 6.66667 6.84348 6.66667 6.66667V2.66667C6.66667 2.48986 6.7369 2.32029 6.86193 2.19526C6.98695 2.07024 7.15652 2 7.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V9.33333Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconChat.displayName = 'IconChat';

/**
 * check - 16x16 프레임
 */
export const IconCheck = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 7.33334L8 9.33334L13.3333 4.00001M13.3333 8.00001V12C13.3333 12.3536 13.1929 12.6928 12.9428 12.9428C12.6928 13.1929 12.3536 13.3333 12 13.3333H4C3.64638 13.3333 3.30724 13.1929 3.05719 12.9428C2.80714 12.6928 2.66666 12.3536 2.66666 12V4.00001C2.66666 3.64638 2.80714 3.30724 3.05719 3.0572C3.30724 2.80715 3.64638 2.66667 4 2.66667H10"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCheck.displayName = 'IconCheck';

/**
 * cloud-computing - 16x16 프레임
 */
export const IconCloudComputing = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.43865 10.6666C2.72398 10.6666 1.33398 9.32859 1.33398 7.67792C1.33398 6.02792 2.72398 4.68992 4.43865 4.68992C4.70065 3.51526 5.63465 2.55659 6.88865 2.17459C8.14198 1.79326 9.52598 2.04592 10.518 2.84126C11.51 3.63459 11.9593 4.84592 11.698 6.02059H12.358C13.6333 6.02059 14.6673 7.06059 14.6673 8.34459C14.6673 9.62926 13.6333 10.6693 12.3573 10.6693H4.43865M8.00065 10.6667V14M10.6673 10.6667V13.3333C10.6673 13.5101 10.7376 13.6797 10.8626 13.8047C10.9876 13.9298 11.1572 14 11.334 14H14.0007M5.33398 10.6667V13.3333C5.33398 13.5101 5.26375 13.6797 5.13872 13.8047C5.0137 13.9298 4.84413 14 4.66732 14H2.00065"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconCloudComputing.displayName = 'IconCloudComputing';

/**
 * device-desktop-analytics - 16x16 프레임
 */
export const IconDeviceDesktopAnalytics = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.66667 13.3332H11.3333M6 10.6665V13.3332M10 10.6665V13.3332M6 7.99984V5.33317M8 7.99984V7.33317M10 7.99984V6.6665M2 3.33317C2 3.15636 2.07024 2.98679 2.19526 2.86177C2.32029 2.73674 2.48986 2.6665 2.66667 2.6665H13.3333C13.5101 2.6665 13.6797 2.73674 13.8047 2.86177C13.9298 2.98679 14 3.15636 14 3.33317V9.99984C14 10.1766 13.9298 10.3462 13.8047 10.4712C13.6797 10.5963 13.5101 10.6665 13.3333 10.6665H2.66667C2.48986 10.6665 2.32029 10.5963 2.19526 10.4712C2.07024 10.3462 2 10.1766 2 9.99984V3.33317Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDeviceDesktopAnalytics.displayName = 'IconDeviceDesktopAnalytics';

/**
 * dollar-sign - 16x16 프레임
 */
export const IconDollarSign = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 2.50014V13.5001M10.5 4.49986H6.75C6.28587 4.49986 5.84075 4.68423 5.51256 5.01242C5.18437 5.34061 5 5.78573 5 6.24986C5 6.71399 5.18437 7.15911 5.51256 7.4873C5.84075 7.81548 6.28587 7.99986 6.75 7.99986H9.25C9.71413 7.99986 10.1592 8.18423 10.4874 8.51242C10.8156 8.84061 11 9.28573 11 9.74986C11 10.214 10.8156 10.6591 10.4874 10.9873C10.1592 11.3155 9.71413 11.4999 9.25 11.4999H5"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconDollarSign.displayName = 'IconDollarSign';

/**
 * dot - 16x16 프레임
 */
export const IconDot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00067 5.99997C7.47024 5.99997 6.96153 6.21068 6.58646 6.58575C6.21138 6.96083 6.00067 7.46953 6.00067 7.99997C6.00067 8.5304 6.21138 9.03911 6.58646 9.41418C6.96153 9.78925 7.47024 9.99997 8.00067 9.99997C8.5311 9.99997 9.03981 9.78925 9.41489 9.41418C9.78996 9.03911 10.0007 8.5304 10.0007 7.99997C10.0007 7.46953 9.78996 6.96083 9.41489 6.58575C9.03981 6.21068 8.5311 5.99997 8.00067 5.99997Z" fill={color} />

      </svg>
    );
  }
);
IconDot.displayName = 'IconDot';

/**
 * finetuning - 16x16 프레임
 */
export const IconFinetuning = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 16, color = 'currentColor', stroke = 0.89458, className, style, ...props }, ref) => {
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.06944 12.2683C7.30611 13.2439 8.69389 13.2439 8.93055 12.2683C8.96616 12.1219 9.03582 11.986 9.13386 11.8715C9.2319 11.7571 9.35556 11.6674 9.49479 11.6097C9.63402 11.5521 9.78488 11.5281 9.93513 11.5397C10.0854 11.5514 10.2307 11.5983 10.3594 11.6767C11.2172 12.1989 12.1983 11.2172 11.6761 10.36C11.5976 10.2312 11.5506 10.0858 11.539 9.93544C11.5273 9.78509 11.5513 9.63412 11.609 9.49481C11.6667 9.35549 11.7565 9.23178 11.8711 9.13373C11.9857 9.03568 12.1218 8.96606 12.2683 8.93055C13.2439 8.69389 13.2439 7.30611 12.2683 7.06944C12.1219 7.03384 11.986 6.96418 11.8715 6.86614C11.7571 6.7681 11.6674 6.64444 11.6097 6.50521C11.5521 6.36598 11.5281 6.21512 11.5397 6.06487C11.5514 5.91463 11.5983 5.76925 11.6767 5.64056C12.1989 4.78278 11.2172 3.80167 10.36 4.32389C10.2312 4.40239 10.0858 4.44938 9.93544 4.46104C9.78509 4.47269 9.63412 4.44869 9.49481 4.39097C9.35549 4.33325 9.23178 4.24346 9.13373 4.12889C9.03568 4.01432 8.96606 3.87822 8.93055 3.73167C8.69389 2.75611 7.30611 2.75611 7.06944 3.73167C6.91611 4.36222 6.19611 4.66111 5.64056 4.32333C4.78278 3.80111 3.80167 4.78278 4.32389 5.64C4.40239 5.76875 4.44938 5.91422 4.46104 6.06456C4.47269 6.21491 4.44869 6.36588 4.39097 6.50519C4.33325 6.64451 4.24346 6.76822 4.12889 6.86627C4.01432 6.96432 3.87822 7.03393 3.73167 7.06944C2.75611 7.30611 2.75611 8.69389 3.73167 8.93055M7.30989 7.58514C7.2424 7.65399 7.2046 7.74656 7.2046 7.84297C7.2046 7.93938 7.2424 8.03194 7.30989 8.10079L7.89921 8.69011C7.96806 8.7576 8.06062 8.7954 8.15703 8.7954C8.25344 8.7954 8.34601 8.7576 8.41486 8.69011L9.80345 7.30153C9.98865 7.71081 10.0447 8.16681 9.9642 8.60877C9.88368 9.05072 9.67038 9.45765 9.35272 9.7753C9.03506 10.093 8.62814 10.3063 8.18619 10.3868C7.74423 10.4673 7.28823 10.4112 6.87895 10.226L4.33382 12.7712C4.18729 12.9177 3.98856 13 3.78133 13C3.57411 13 3.37538 12.9177 3.22885 12.7712C3.08232 12.6246 3 12.4259 3 12.2187C3 12.0114 3.08232 11.8127 3.22885 11.6662L5.77397 9.12105C5.58877 8.71177 5.53269 8.25577 5.61321 7.81381C5.69374 7.37186 5.90704 6.96494 6.2247 6.64728C6.54236 6.32962 6.94928 6.11632 7.39123 6.0358C7.83319 5.95527 8.28919 6.01135 8.69847 6.19655L7.30989 7.58514Z"   stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconFinetuning.displayName = 'IconFinetuning';

/**
 * history - 16x16 프레임
 */
export const IconHistory = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.5 4.50716C3.92848 2.2434 6.64284 1.08121 9.32129 1.639L9.61816 1.70736C10.7608 2.00128 11.802 2.60115 12.6299 3.44173C13.4578 4.28241 14.0419 5.33276 14.3184 6.47982C14.5947 7.62687 14.5533 8.82796 14.1992 9.95345C13.8451 11.0789 13.191 12.0873 12.3076 12.8695C11.4243 13.6514 10.3445 14.1787 9.18457 14.3939C8.02462 14.609 6.82767 14.5043 5.72266 14.0911C4.61764 13.6779 3.64536 12.9716 2.91113 12.0482C2.17689 11.1246 1.70718 10.0178 1.55371 8.84798C1.51791 8.57437 1.7118 8.32352 1.98535 8.28744C2.25898 8.2518 2.51001 8.44445 2.5459 8.7181C2.67575 9.70777 3.07229 10.6437 3.69336 11.4251C4.31459 12.2066 5.13726 12.8049 6.07227 13.1546C7.00727 13.5043 8.02045 13.5925 9.00195 13.4105C9.9835 13.2284 10.898 12.7822 11.6455 12.1204C12.3927 11.4587 12.9455 10.6057 13.2451 9.65365C13.5447 8.7013 13.5796 7.68479 13.3457 6.7142C13.1118 5.74373 12.6184 4.85517 11.918 4.14388C11.2174 3.43249 10.3361 2.92484 9.36914 2.67611L9.11719 2.61752C6.76273 2.12736 4.38539 3.20418 3.21875 5.25228H3.75C4.02598 5.25246 4.24999 5.47626 4.25 5.75228C4.24982 6.02816 4.02588 6.2521 3.75 6.25228H2C1.72412 6.2521 1.50018 6.02816 1.5 5.75228V4.00228C1.5 3.72625 1.72401 3.50246 2 3.50228C2.27598 3.50247 2.5 3.72626 2.5 4.00228V4.50716Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 4.00033C8.2761 4.00033 8.49995 4.22422 8.5 4.50033V7.66146L10.6855 8.53646C10.9418 8.63907 11.0664 8.92954 10.9639 9.18588C10.8612 9.44201 10.5707 9.56662 10.3145 9.4642L7.81445 8.4642C7.62508 8.38818 7.50115 8.20441 7.50098 8.00033L7.5 4.50033C7.5 4.22423 7.72389 4.00038 8 4.00033Z" fill={color} />

      </svg>
    );
  }
);
IconHistory.displayName = 'IconHistory';

/**
 * hourglass-high - 16x16 프레임
 */
export const IconHourglassHigh = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.33333 4.50016H11.6667M8 7.8335C6.93913 7.8335 5.92172 8.25492 5.17157 9.00507C4.42143 9.75521 4 10.7726 4 11.8335V13.1668C4 13.3436 4.07024 13.5132 4.19526 13.6382C4.32029 13.7633 4.48986 13.8335 4.66667 13.8335H11.3333C11.5101 13.8335 11.6797 13.7633 11.8047 13.6382C11.9298 13.5132 12 13.3436 12 13.1668V11.8335C12 10.7726 11.5786 9.75521 10.8284 9.00507C10.0783 8.25492 9.06087 7.8335 8 7.8335ZM8 7.8335C6.93913 7.8335 5.92172 7.41207 5.17157 6.66192C4.42143 5.91178 4 4.89436 4 3.8335V2.50016C4 2.32335 4.07024 2.15378 4.19526 2.02876C4.32029 1.90373 4.48986 1.8335 4.66667 1.8335H11.3333C11.5101 1.8335 11.6797 1.90373 11.8047 2.02876C11.9298 2.15378 12 2.32335 12 2.50016V3.8335C12 4.89436 11.5786 5.91178 10.8284 6.66192C10.0783 7.41207 9.06087 7.8335 8 7.8335Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconHourglassHigh.displayName = 'IconHourglassHigh';

/**
 * language - 16x16 프레임
 */
export const IconLanguage = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.8327 7.99996C13.8327 11.2216 11.221 13.8333 7.99935 13.8333M13.8327 7.99996C13.8327 4.7783 11.221 2.16663 7.99935 2.16663M13.8327 7.99996H2.16602M7.99935 13.8333C4.77769 13.8333 2.16602 11.2216 2.16602 7.99996M7.99935 13.8333C9.45843 12.2359 10.2876 10.1629 10.3327 7.99996C10.2876 5.83698 9.45843 3.764 7.99935 2.16663M7.99935 13.8333C6.54027 12.2359 5.71108 10.1629 5.66602 7.99996C5.71108 5.83698 6.54027 3.764 7.99935 2.16663M2.16602 7.99996C2.16602 4.7783 4.77769 2.16663 7.99935 2.16663"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconLanguage.displayName = 'IconLanguage';

/**
 * link - 16x16 프레임
 */
export const IconLink = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.99935 10L9.99935 6.00004M7.33268 3.99992L7.64135 3.64259C8.26655 3.01747 9.11448 2.66632 9.99858 2.66638C10.8827 2.66644 11.7306 3.01772 12.3557 3.64292C12.9808 4.26812 13.3319 5.11605 13.3319 6.00015C13.3318 6.88426 12.9806 7.73214 12.3553 8.35725L11.9993 8.66659M8.66611 12L8.40144 12.356C7.76894 12.9815 6.9153 13.3323 6.02578 13.3323C5.13625 13.3323 4.28261 12.9815 3.65011 12.356C3.33835 12.0478 3.09084 11.6807 2.92192 11.2761C2.753 10.8716 2.66602 10.4375 2.66602 9.99904C2.66602 9.56061 2.753 9.12653 2.92192 8.72195C3.09084 8.31736 3.33835 7.95031 3.65011 7.64204L3.99944 7.33337"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconLink.displayName = 'IconLink';

/**
 * list - 16x16 프레임
 */
export const IconList = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.66445 4H12.9917M5.66445 7.99667H12.9917M5.66445 11.9933H12.9917M3 4V4.00666M3 7.99667V8.00333M3 11.9933V12"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconList.displayName = 'IconList';

/**
 * microsoft - 16x16 프레임
 */
export const IconMicrosoft = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" clip-path="url(#clip0_442_58)">
<ns0:path d="M7.13 2.51501H2.5V7.13501H7.13V2.51501Z"  stroke-miterlimit="10" />
<ns0:path d="M13.5 2.51501H8.87V7.13501H13.5V2.51501Z"  stroke-miterlimit="10" />
<ns0:path d="M7.13 8.86502H2.5V13.485H7.13V8.86502Z"  stroke-miterlimit="10" />
<ns0:path d="M13.5 8.86502H8.87V13.485H13.5V8.86502Z"  stroke-miterlimit="10" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_442_58">
<ns0:rect width="12" height="11.97" fill="white" transform="translate(2 2.01501)" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconMicrosoft.displayName = 'IconMicrosoft';

/**
 * more-meatball - 16x16 프레임
 */
export const IconMoreMeatball = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.33398 7.33329C3.15717 7.33329 2.9876 7.40353 2.86258 7.52856C2.73755 7.65358 2.66732 7.82315 2.66732 7.99996C2.66732 8.17677 2.73755 8.34634 2.86258 8.47136C2.9876 8.59639 3.15717 8.66663 3.33398 8.66663C3.51079 8.66663 3.68036 8.59639 3.80539 8.47136C3.93041 8.34634 4.00065 8.17677 4.00065 7.99996C4.00065 7.82315 3.93041 7.65358 3.80539 7.52856C3.68036 7.40353 3.51079 7.33329 3.33398 7.33329Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12.6673 7.33329C12.4905 7.33329 12.3209 7.40353 12.1959 7.52856C12.0709 7.65358 12.0007 7.82315 12.0007 7.99996C12.0007 8.17677 12.0709 8.34634 12.1959 8.47136C12.3209 8.59639 12.4905 8.66663 12.6673 8.66663C12.8441 8.66663 13.0137 8.59639 13.1387 8.47136C13.2637 8.34634 13.334 8.17677 13.334 7.99996C13.334 7.82315 13.2637 7.65358 13.1387 7.52856C13.0137 7.40353 12.8441 7.33329 12.6673 7.33329Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.33398 7.33329C3.15717 7.33329 2.9876 7.40353 2.86258 7.52856C2.73755 7.65358 2.66732 7.82315 2.66732 7.99996C2.66732 8.17677 2.73755 8.34634 2.86258 8.47136C2.9876 8.59639 3.15717 8.66663 3.33398 8.66663C3.51079 8.66663 3.68036 8.59639 3.80539 8.47136C3.93041 8.34634 4.00065 8.17677 4.00065 7.99996C4.00065 7.82315 3.93041 7.65358 3.80539 7.52856C3.68036 7.40353 3.51079 7.33329 3.33398 7.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12.6673 7.33329C12.4905 7.33329 12.3209 7.40353 12.1959 7.52856C12.0709 7.65358 12.0007 7.82315 12.0007 7.99996C12.0007 8.17677 12.0709 8.34634 12.1959 8.47136C12.3209 8.59639 12.4905 8.66663 12.6673 8.66663C12.8441 8.66663 13.0137 8.59639 13.1387 8.47136C13.2637 8.34634 13.334 8.17677 13.334 7.99996C13.334 7.82315 13.2637 7.65358 13.1387 7.52856C13.0137 7.40353 12.8441 7.33329 12.6673 7.33329Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconMoreMeatball.displayName = 'IconMoreMeatball';

/**
 * newchat - 16x16 프레임
 */
export const IconNewchat = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 4.4V6.4M8 6.4V8.4M8 6.4H6M8 6.4H10M14 13L10.7273 10.7273H3.09091C2.80158 10.7273 2.5241 10.6123 2.31952 10.4078C2.11493 10.2032 2 9.92569 2 9.63636V3.09091C2 2.80158 2.11493 2.5241 2.31952 2.31952C2.5241 2.11493 2.80158 2 3.09091 2H12.9091C13.1984 2 13.4759 2.11493 13.6805 2.31952C13.8851 2.5241 14 2.80158 14 3.09091V13Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconNewchat.displayName = 'IconNewchat';

/**
 * other - 16x16 프레임
 */
export const IconOther = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66667 8C2.66667 8.17681 2.73691 8.34638 2.86193 8.4714C2.98696 8.59643 3.15653 8.66667 3.33334 8.66667C3.51015 8.66667 3.67972 8.59643 3.80474 8.4714C3.92977 8.34638 4.00001 8.17681 4.00001 8C4.00001 7.82319 3.92977 7.65362 3.80474 7.52859C3.67972 7.40357 3.51015 7.33333 3.33334 7.33333C3.15653 7.33333 2.98696 7.40357 2.86193 7.52859C2.73691 7.65362 2.66667 7.82319 2.66667 8Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33334 8C7.33334 8.17681 7.40358 8.34638 7.5286 8.4714C7.65363 8.59643 7.82319 8.66667 8.00001 8.66667C8.17682 8.66667 8.34639 8.59643 8.47141 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.47141 7.52859C8.34639 7.40357 8.17682 7.33333 8.00001 7.33333C7.82319 7.33333 7.65363 7.40357 7.5286 7.52859C7.40358 7.65362 7.33334 7.82319 7.33334 8Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12 8C12 8.17681 12.0702 8.34638 12.1953 8.4714C12.3203 8.59643 12.4899 8.66667 12.6667 8.66667C12.8435 8.66667 13.0131 8.59643 13.1381 8.4714C13.2631 8.34638 13.3333 8.17681 13.3333 8C13.3333 7.82319 13.2631 7.65362 13.1381 7.52859C13.0131 7.40357 12.8435 7.33333 12.6667 7.33333C12.4899 7.33333 12.3203 7.40357 12.1953 7.52859C12.0702 7.65362 12 7.82319 12 8Z" fill={color} />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.66667 8C2.66667 8.17681 2.73691 8.34638 2.86193 8.4714C2.98696 8.59643 3.15653 8.66667 3.33334 8.66667C3.51015 8.66667 3.67972 8.59643 3.80474 8.4714C3.92977 8.34638 4.00001 8.17681 4.00001 8C4.00001 7.82319 3.92977 7.65362 3.80474 7.52859C3.67972 7.40357 3.51015 7.33333 3.33334 7.33333C3.15653 7.33333 2.98696 7.40357 2.86193 7.52859C2.73691 7.65362 2.66667 7.82319 2.66667 8Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M7.33334 8C7.33334 8.17681 7.40358 8.34638 7.5286 8.4714C7.65363 8.59643 7.82319 8.66667 8.00001 8.66667C8.17682 8.66667 8.34639 8.59643 8.47141 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.47141 7.52859C8.34639 7.40357 8.17682 7.33333 8.00001 7.33333C7.82319 7.33333 7.65363 7.40357 7.5286 7.52859C7.40358 7.65362 7.33334 7.82319 7.33334 8Z"  stroke-linecap="round" stroke-linejoin="round" />

        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M12 8C12 8.17681 12.0702 8.34638 12.1953 8.4714C12.3203 8.59643 12.4899 8.66667 12.6667 8.66667C12.8435 8.66667 13.0131 8.59643 13.1381 8.4714C13.2631 8.34638 13.3333 8.17681 13.3333 8C13.3333 7.82319 13.2631 7.65362 13.1381 7.52859C13.0131 7.40357 12.8435 7.33333 12.6667 7.33333C12.4899 7.33333 12.3203 7.40357 12.1953 7.52859C12.0702 7.65362 12 7.82319 12 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconOther.displayName = 'IconOther';

/**
 * pending - 16x16 프레임
 */
export const IconPending = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.70737 2.43629C7.19023 1.83917 8.84957 1.85556 10.3203 2.48187C11.7911 3.10818 12.9528 4.2931 13.55 5.77597C14.1471 7.25883 14.1307 8.91817 13.5044 10.3889C12.8781 11.8597 11.6932 13.0214 10.2103 13.6186M10.2103 10.2789V14.0313H13.9627M3.17814 4.39507V4.40257M2 7.27694V7.28445M2.42765 10.3539V10.3615M4.32659 12.808V12.8155M7.20835 13.9863V13.9938"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPending.displayName = 'IconPending';

/**
 * progress - 16x16 프레임
 */
export const IconProgress = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M6.584 13.7026C6.00374 13.571 5.44645 13.3533 4.93066 13.0566M9.25065 2C10.5761 2.30271 11.7595 3.04646 12.6071 4.10947C13.4547 5.17248 13.9163 6.49177 13.9163 7.85133C13.9163 9.2109 13.4547 10.5302 12.6071 11.5932C11.7595 12.6562 10.5761 13.4 9.25065 13.7027M2.97002 11.2466C2.60635 10.7183 2.33015 10.1348 2.15202 9.51864M2 6.85133C2.10667 6.218 2.312 5.618 2.6 5.068L2.71267 4.86466M4.52197 2.904C5.14574 2.4746 5.84552 2.16781 6.58397 2"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconProgress.displayName = 'IconProgress';

/**
 * puzzle - 16x16 프레임
 */
export const IconPuzzle = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.12222 4.1389H5.13889C5.31717 4.1389 5.48816 4.06808 5.61422 3.94201C5.74029 3.81595 5.81111 3.64496 5.81111 3.46668V2.79446C5.81111 2.43789 5.95276 2.09592 6.20489 1.84379C6.45702 1.59166 6.79899 1.45001 7.15556 1.45001C7.51212 1.45001 7.85409 1.59166 8.10622 1.84379C8.35835 2.09592 8.5 2.43789 8.5 2.79446V3.46668C8.5 3.64496 8.57082 3.81595 8.69689 3.94201C8.82296 4.06808 8.99394 4.1389 9.17222 4.1389H11.1889C11.3672 4.1389 11.5382 4.20972 11.6642 4.33579C11.7903 4.46186 11.8611 4.63284 11.8611 4.81112V6.82779C11.8611 7.00607 11.9319 7.17706 12.058 7.30312C12.1841 7.42919 12.355 7.50001 12.5333 7.50001H13.2056C13.5621 7.50001 13.9041 7.64166 14.1562 7.89379C14.4084 8.14592 14.55 8.48789 14.55 8.84446C14.55 9.20103 14.4084 9.54299 14.1562 9.79512C13.9041 10.0473 13.5621 10.1889 13.2056 10.1889H12.5333C12.355 10.1889 12.1841 10.2597 12.058 10.3858C11.9319 10.5119 11.8611 10.6828 11.8611 10.8611V12.8778C11.8611 13.0561 11.7903 13.2271 11.6642 13.3531C11.5382 13.4792 11.3672 13.55 11.1889 13.55H9.17222C8.99394 13.55 8.82296 13.4792 8.69689 13.3531C8.57082 13.2271 8.5 13.0561 8.5 12.8778V12.2056C8.5 11.849 8.35835 11.507 8.10622 11.2549C7.85409 11.0028 7.51212 10.8611 7.15556 10.8611C6.79899 10.8611 6.45702 11.0028 6.20489 11.2549C5.95276 11.507 5.81111 11.849 5.81111 12.2056V12.8778C5.81111 13.0561 5.74029 13.2271 5.61422 13.3531C5.48816 13.4792 5.31717 13.55 5.13889 13.55H3.12222C2.94394 13.55 2.77296 13.4792 2.64689 13.3531C2.52082 13.2271 2.45 13.0561 2.45 12.8778V10.8611C2.45 10.6828 2.52082 10.5119 2.64689 10.3858C2.77296 10.2597 2.94394 10.1889 3.12222 10.1889H3.79444C4.15101 10.1889 4.49298 10.0473 4.74511 9.79512C4.99724 9.54299 5.13889 9.20103 5.13889 8.84446C5.13889 8.48789 4.99724 8.14592 4.74511 7.89379C4.49298 7.64166 4.15101 7.50001 3.79444 7.50001H3.12222C2.94394 7.50001 2.77296 7.42919 2.64689 7.30312C2.52082 7.17706 2.45 7.00607 2.45 6.82779V4.81112C2.45 4.63284 2.52082 4.46186 2.64689 4.33579C2.77296 4.20972 2.94394 4.1389 3.12222 4.1389Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconPuzzle.displayName = 'IconPuzzle';

/**
 * reset-1 - 16x16 프레임
 */
export const IconReset1 = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconReset1.displayName = 'IconReset1';

/**
 * reset-2 - 16x16 프레임
 */
export const IconReset2 = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconReset2.displayName = 'IconReset2';

/**
 * reset - 16x16 프레임
 */
export const IconReset = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconReset.displayName = 'IconReset';

/**
 * retry - 16x16 프레임
 */
export const IconRetry = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M13.9491 8.78274C13.8075 9.86271 13.3746 10.8838 12.6967 11.7364C12.0189 12.589 11.1218 13.241 10.1016 13.6225C9.08135 14.004 7.97652 14.1006 6.90558 13.9019C5.83463 13.7033 4.83797 13.2168 4.02249 12.4947C3.207 11.7727 2.60345 10.8422 2.27657 9.80323C1.94969 8.76422 1.9118 7.65582 2.16698 6.59692C2.42216 5.53801 2.96077 4.56854 3.72505 3.79248C4.48934 3.01642 5.45046 2.46305 6.50534 2.19171C9.4296 1.4417 12.4566 2.94696 13.5741 5.75197M13.9994 2.00196V5.75197H10.2494"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconRetry.displayName = 'IconRetry';

/**
 * robot - 16x16 프레임
 */
export const IconRobot = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M3.875 3.16952H12.125C12.4897 3.16952 12.8394 3.31116 13.0973 3.5633C13.3551 3.81543 13.5 4.15739 13.5 4.51396V12.5806C13.5 12.9372 13.3551 13.2792 13.0973 13.5313C12.8394 13.7834 12.4897 13.9251 12.125 13.9251H3.875C3.51033 13.9251 3.16059 13.7834 2.90273 13.5313C2.64487 13.2792 2.5 12.9372 2.5 12.5806V4.51396C2.5 4.15739 2.64487 3.81543 2.90273 3.5633C3.16059 3.31116 3.51033 3.16952 3.875 3.16952Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconRobot.displayName = 'IconRobot';

/**
 * rocky - 16x16 프레임
 */
export const IconRocky = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" clip-path="url(#clip0_442_57)">
<ns0:path d="M13.63 10.21L9.68 6.26L3.68 12.25C2.61 11.15 1.94 9.66 1.94 8C1.94 4.65 4.65 1.94 8 1.94C11.35 1.94 14.06 4.65 14.06 8C14.06 8.78 13.91 9.53 13.63 10.21Z"  stroke-miterlimit="10" />
<ns0:path d="M12.62 11.92L9.82 9.12L5.46 13.49C6.13 13.9 7.09 14.06 8 14.06C9.85 14.06 11.51 13.23 12.62 11.92Z"  stroke-miterlimit="10" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_442_57">
<ns0:rect width="13.12" height="13.12" fill="white" transform="translate(1.44 1.44)" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconRocky.displayName = 'IconRocky';

/**
 * share - 16x16 프레임
 */
export const IconShare = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M5.79948 7.1332L10.1995 4.86654M5.79948 8.86654L10.1995 11.1332M2 8C2 8.53043 2.21071 9.03914 2.58579 9.41421C2.96086 9.78929 3.46957 10 4 10C4.53043 10 5.03914 9.78929 5.41421 9.41421C5.78929 9.03914 6 8.53043 6 8C6 7.46957 5.78929 6.96086 5.41421 6.58579C5.03914 6.21071 4.53043 6 4 6C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8ZM10 4C10 4.53043 10.2107 5.03914 10.5858 5.41421C10.9609 5.78929 11.4696 6 12 6C12.5304 6 13.0391 5.78929 13.4142 5.41421C13.7893 5.03914 14 4.53043 14 4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2C11.4696 2 10.9609 2.21071 10.5858 2.58579C10.2107 2.96086 10 3.46957 10 4ZM10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconShare.displayName = 'IconShare';

/**
 * speed - 16x16 프레임
 */
export const IconSpeed = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M3.75734 12.9091C2.91823 12.07 2.34679 11.0009 2.11529 9.83702C1.88378 8.67313 2.0026 7.46674 2.45673 6.37039C2.91086 5.27403 3.6799 4.33697 4.66659 3.67768C5.65328 3.0184 6.81332 2.6665 8 2.6665C9.18669 2.6665 10.3467 3.0184 11.3334 3.67768C12.3201 4.33697 13.0891 5.27403 13.5433 6.37039C13.9974 7.46674 14.1162 8.67313 13.8847 9.83702C13.6532 11.0009 13.0818 12.07 12.2427 12.9091M10.6667 5.99984L8 8.6665"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconSpeed.displayName = 'IconSpeed';

/**
 * study - 16x16 프레임
 */
export const IconStudy = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8 3.33333C8 2.97971 7.85952 2.64057 7.60948 2.39052C7.35943 2.14048 7.02029 2 6.66667 2H2.66667C2.48986 2 2.32029 2.07024 2.19526 2.19526C2.07024 2.32029 2 2.48986 2 2.66667V12C2 12.1768 2.07024 12.3464 2.19526 12.4714C2.32029 12.5964 2.48986 12.6667 2.66667 12.6667H6.66667C7.02029 12.6667 7.35943 12.8071 7.60948 13.0572C7.85952 13.3072 8 13.6464 8 14M8 3.33333C8 2.97971 8.14048 2.64057 8.39052 2.39052C8.64057 2.14048 8.97971 2 9.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V12C14 12.1768 13.9298 12.3464 13.8047 12.4714C13.6797 12.5964 13.5101 12.6667 13.3333 12.6667H9.33333C8.97971 12.6667 8.64057 12.8071 8.39052 13.0572C8.14048 13.3072 8 13.6464 8 14M8 3.33333V14M4.66667 4.66667H5.33333M4.66667 7.33333H5.33333M10.6667 4.66667H11.3333M10.6667 7.33333H11.3333M10.6667 10H11.3333"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconStudy.displayName = 'IconStudy';

/**
 * timeout - 16x16 프레임
 */
export const IconTimeout = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" opacity="0.2">
<ns0:path d="M13.9896 8.18702C14.0628 6.94654 13.7491 5.71392 13.0917 4.6594C12.4343 3.60487 11.4657 2.78047 10.3197 2.30005C9.17367 1.81963 7.90676 1.70688 6.69391 1.97738C5.48106 2.24788 4.38213 2.88829 3.54886 3.81015C2.7156 4.73202 2.18912 5.88986 2.04213 7.12379C1.89514 8.35771 2.1349 9.60683 2.72829 10.6986C3.32168 11.7905 4.23943 12.6711 5.3548 13.2189C6.47016 13.7668 7.72811 13.9548 8.95492 13.757M8 4.50016V7.8335L10 9.8335M12.6667 10.5002L11.3333 12.5002H14L12.6667 14.5002"  stroke-linecap="round" stroke-linejoin="round" />
</ns0:g>

      </svg>
    );
  }
);
IconTimeout.displayName = 'IconTimeout';

/**
 * transfer - 16x16 프레임
 */
export const IconTransfer = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M10.666 2L13.3327 4.66667M13.3327 4.66667L10.666 7.33333M13.3327 4.66667H6.66602M5.33268 8.66667L2.66602 11.3333M2.66602 11.3333L5.33268 14M2.66602 11.3333H8.66602"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconTransfer.displayName = 'IconTransfer';

/**
 * ubuntu - 16x16 프레임
 */
export const IconUbuntu = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:g xmlns:ns0="http://www.w3.org/2000/svg" clip-path="url(#clip0_442_59)">
<ns0:path d="M3.42 9.055C4.20424 9.055 4.84 8.41924 4.84 7.635C4.84 6.85075 4.20424 6.215 3.42 6.215C2.63576 6.215 2 6.85075 2 7.635C2 8.41924 2.63576 9.055 3.42 9.055Z"  stroke-miterlimit="10" />
<ns0:path d="M11.05 14.075C11.8342 14.075 12.47 13.4392 12.47 12.655C12.47 11.8707 11.8342 11.235 11.05 11.235C10.2658 11.235 9.63 11.8707 9.63 12.655C9.63 13.4392 10.2658 14.075 11.05 14.075Z"  stroke-miterlimit="10" />
<ns0:path d="M13.33 5.30499C13.76 6.05499 14 6.93499 14 7.87499C14 8.99499 13.65 10.045 13.05 10.895"  stroke-miterlimit="10" />
<ns0:path d="M4.17 5.06498C5.11 3.55498 6.77 2.54498 8.68 2.54498C8.77 2.54498 8.87 2.54498 8.97 2.56498"  stroke-miterlimit="10" />
<ns0:path d="M3.92999 10.265C4.75999 11.945 6.45999 13.105 8.43999 13.185"  stroke-miterlimit="10" />
<ns0:path d="M11.52 4.76499C12.3043 4.76499 12.94 4.12923 12.94 3.34499C12.94 2.56074 12.3043 1.92499 11.52 1.92499C10.7358 1.92499 10.1 2.56074 10.1 3.34499C10.1 4.12923 10.7358 4.76499 11.52 4.76499Z"  stroke-miterlimit="10" />
</ns0:g>

        <ns0:defs xmlns:ns0="http://www.w3.org/2000/svg">
<ns0:clipPath id="clip0_442_59">
<ns0:rect width="13" height="13.15" fill="white" transform="translate(1.5 1.42499)" />
</ns0:clipPath>
</ns0:defs>

      </svg>
    );
  }
);
IconUbuntu.displayName = 'IconUbuntu';

/**
 * unlink - 16x16 프레임
 */
export const IconUnlink = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M6 10L8 8M9.33333 6.66667L10 6M7.33333 4.0002L7.642 3.64287C8.2672 3.01776 9.11513 2.6666 9.99924 2.66667C10.8833 2.66673 11.7312 3.018 12.3563 3.6432C12.9814 4.26841 13.3326 5.11633 13.3325 6.00044C13.3325 6.88455 12.9812 7.73242 12.356 8.35754L12 8.66687M2 2L14 14M8.6666 12L8.40193 12.356C7.76943 12.9815 6.91579 13.3323 6.02627 13.3323C5.13674 13.3323 4.2831 12.9815 3.6506 12.356C3.33884 12.0477 3.09133 11.6807 2.92241 11.2761C2.75348 10.8715 2.6665 10.4374 2.6665 9.999C2.6665 9.56057 2.75348 9.12649 2.92241 8.7219C3.09133 8.31732 3.33884 7.95027 3.6506 7.642L3.99993 7.33333"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconUnlink.displayName = 'IconUnlink';

/**
 * user-circle - 16x16 프레임
 */
export const IconUserCircle = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M4.11198 12.566C4.27699 12.0168 4.61462 11.5355 5.07481 11.1933C5.535 10.8512 6.09321 10.6665 6.66665 10.6667H9.33331C9.90749 10.6665 10.4664 10.8516 10.9269 11.1945C11.3874 11.5374 11.725 12.0199 11.8893 12.57M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM6 6.66667C6 7.1971 6.21071 7.70581 6.58579 8.08088C6.96086 8.45595 7.46957 8.66667 8 8.66667C8.53043 8.66667 9.03914 8.45595 9.41421 8.08088C9.78929 7.70581 10 7.1971 10 6.66667C10 6.13623 9.78929 5.62753 9.41421 5.25245C9.03914 4.87738 8.53043 4.66667 8 4.66667C7.46957 4.66667 6.96086 4.87738 6.58579 5.25245C6.21071 5.62753 6 6.13623 6 6.66667Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconUserCircle.displayName = 'IconUserCircle';

/**
 * zap - 16x16 프레임
 */
export const IconZap = forwardRef<SVGSVGElement, CustomIconProps>(
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
        <ns0:path xmlns:ns0="http://www.w3.org/2000/svg" d="M8.5 3L3.5 9H8L7.5 13L12.5 7H8L8.5 3Z"  stroke-linecap="round" stroke-linejoin="round" />

      </svg>
    );
  }
);
IconZap.displayName = 'IconZap';

