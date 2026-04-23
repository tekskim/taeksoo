import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React3 from "react";
import React3__default, { forwardRef, memo, useState, useCallback, useRef, useEffect, useId, useContext, createContext, useMemo, useLayoutEffect, isValidElement, cloneElement, Children, Fragment as Fragment$1 } from "react";
import { IconCircleX, IconProgress as IconProgress$1, IconRotateClockwise, IconRefreshDot, IconQuestionMark, IconCircleDot, IconBrandWindows, IconBrandUbuntu, IconUserCircle as IconUserCircle$1, IconGitBranch, IconBuilding as IconBuilding$1, IconGauge, IconCurrencyDollar, IconBolt, IconLanguage as IconLanguage$1, IconDeviceDesktopAnalytics as IconDeviceDesktopAnalytics$1, IconTerminal, IconTerminal2, IconLinkOff, IconLink as IconLink$1, IconTransfer as IconTransfer$1, IconShare as IconShare$1, IconMessagePlus, IconMessage, IconHelp as IconHelp$1, IconAffiliate as IconAffiliate$1, IconCategory as IconCategory$1, IconPlug, IconFile as IconFile$1, IconTemplate as IconTemplate$1, IconArticle, IconHourglass, IconClock, IconTestPipe, IconBook, IconAdjustments, IconMessageChatbot, IconPuzzle as IconPuzzle$1, IconRobotFace, IconRobot as IconRobot$1, IconBrain as IconBrain$1, IconTopologyStar3, IconCloud, IconServerCog, IconCpu, IconDatabaseSearch, IconSquarePlus, IconBoxMultiple, IconDeviceSdCard, IconPhoto, IconShield, IconKey as IconKey$1, IconCertificate as IconCertificate$1, IconShieldLock, IconServer2, IconScale, IconWorldWww, IconRouter, IconNetwork as IconNetwork$1, IconDeviceFloppy, IconDatabase, IconServer as IconServer$1, IconCube, IconActivity as IconActivity$1, IconLayoutDashboard, IconStack2, IconChartBar, IconArrowsSort, IconCamera, IconEyeOff, IconEye, IconSend, IconDownload as IconDownload$1, IconUpload as IconUpload$1, IconGridDots, IconLayoutGrid, IconList as IconList$1, IconArchive, IconLock as IconLock$1, IconPlugConnected, IconShieldX, IconAlertTriangle, IconTool, IconCircleOff, IconCircle, IconShieldCheck, IconCheck as IconCheck$1, IconCircleCheck, IconHelpCircle, IconBan, IconAlertOctagon, IconInfoCircle, IconAlertCircle, IconTrashX, IconRefresh as IconRefresh$1, IconPlayerPause, IconPlayerStop, IconPlayerPlay, IconX, IconStarFilled, IconStar, IconBellRinging, IconBell, IconHome as IconHome$1, IconLayoutSidebar, IconSettings, IconMenu2, IconPoint, IconDots, IconDotsVertical, IconCopy as IconCopy$1, IconTrash, IconPencil, IconSearch as IconSearch$1, IconPlus, IconCirclePlus, IconExternalLink, IconLayoutSidebarLeftCollapse, IconChevronUp, IconChevronDown, IconChevronRight, IconChevronLeft, IconMinus, IconSquare, IconInfinity, IconArrowLeft, IconArrowRight, IconSelector, IconLivePhotoOff, IconEdit as IconEdit$1, IconPower, IconPlugConnectedX, IconCircleMinus, IconShieldExclamation, IconAlertHexagon, IconCircleDashedCheck, IconLoader, IconLivePhoto, IconTarget, IconCircleDashed, IconCalendar, IconCheckbox, IconLoader2 } from "@tabler/icons-react";
import { IconMenu2 as IconMenu22, IconCircle as IconCircle2, IconActivity, IconPlus as IconPlus2, IconRobotFace as IconRobotFace2, IconSquarePlus as IconSquarePlus2, IconAffiliate, IconAlertTriangle as IconAlertTriangle2, IconArticle as IconArticle2, IconDeviceSdCard as IconDeviceSdCard2, IconBrain, IconGitBranch as IconGitBranch2, IconBuilding, IconLayoutGrid as IconLayoutGrid2, IconCategory, IconCertificate, IconChartBar as IconChartBar2, IconMessage as IconMessage2, IconMessageChatbot as IconMessageChatbot2, IconCheck, IconCircleCheck as IconCircleCheck2, IconChevronDown as IconChevronDown2, IconChevronLeft as IconChevronLeft2, IconChevronRight as IconChevronRight2, IconChevronUp as IconChevronUp2, IconX as IconX2, IconCloud as IconCloud2, IconTerminal2 as IconTerminal22, IconTerminal as IconTerminal3, IconCopy, IconLayoutDashboard as IconLayoutDashboard2, IconCircleOff as IconCircleOff2, IconTrash as IconTrash2, IconTrashX as IconTrashX2, IconDeviceDesktopAnalytics, IconCurrencyDollar as IconCurrencyDollar2, IconPoint as IconPoint2, IconDownload, IconLayoutSidebarLeftCollapse as IconLayoutSidebarLeftCollapse2, IconPencil as IconPencil2, IconAlertCircle as IconAlertCircle2, IconAlertOctagon as IconAlertOctagon2, IconExternalLink as IconExternalLink2, IconStar as IconStar2, IconStarFilled as IconStarFilled2, IconFile, IconAdjustments as IconAdjustments2, IconCpu as IconCpu2, IconWorldWww as IconWorldWww2, IconGridDots as IconGridDots2, IconDeviceFloppy as IconDeviceFloppy2, IconHelp, IconEyeOff as IconEyeOff2, IconHome, IconServerCog as IconServerCog2, IconHourglass as IconHourglass2, IconServer2 as IconServer22, IconPhoto as IconPhoto2, IconInfoCircle as IconInfoCircle2, IconCube as IconCube2, IconPlugConnected as IconPlugConnected2, IconKey, IconKey as IconKey2, IconLanguage, IconStack2 as IconStack22, IconLink, IconList, IconScale as IconScale2, IconLock, IconTool as IconTool2, IconBrandWindows as IconBrandWindows2, IconDotsVertical as IconDotsVertical2, IconDots as IconDots2, IconNetwork, IconNetwork as IconNetwork2, IconMessagePlus as IconMessagePlus2, IconExternalLink as IconExternalLink3, IconBell as IconBell2, IconBellRinging as IconBellRinging2, IconArrowsSort as IconArrowsSort2, IconQuestionMark as IconQuestionMark2, IconPlayerPause as IconPlayerPause2, IconProgress, IconPlayerPlay as IconPlayerPlay2, IconPlug as IconPlug2, IconCirclePlus as IconCirclePlus2, IconPlug as IconPlug3, IconProgress as IconProgress2, IconSend as IconSend2, IconPuzzle, IconRefreshDot as IconRefreshDot2, IconRefresh, IconHelpCircle as IconHelpCircle2, IconRotateClockwise as IconRotateClockwise2, IconRobot, IconCircleDot as IconCircleDot2, IconRouter as IconRouter2, IconClock as IconClock2, IconSearch, IconShield as IconShield2, IconShieldX as IconShieldX2, IconShieldLock as IconShieldLock2, IconServer, IconSettings as IconSettings2, IconShare, IconArchive as IconArchive2, IconEye as IconEye2, IconLayoutSidebar as IconLayoutSidebar2, IconCamera as IconCamera2, IconGauge as IconGauge2, IconPlayerStop as IconPlayerStop2, IconDatabase as IconDatabase2, IconBook as IconBook2, IconBan as IconBan2, IconTemplate, IconCircleX as IconCircleX2, IconTestPipe as IconTestPipe2, IconTopologyStar3 as IconTopologyStar32, IconTopologyStar3 as IconTopologyStar33, IconTransfer, IconBrandUbuntu as IconBrandUbuntu2, IconLinkOff as IconLinkOff2, IconUpload, IconUserCircle, IconShieldCheck as IconShieldCheck2, IconDatabaseSearch as IconDatabaseSearch2, IconBoxMultiple as IconBoxMultiple2, IconAlertTriangle as IconAlertTriangle3, IconBolt as IconBolt2 } from "@tabler/icons-react";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
const IconExpandOff = forwardRef(
  ({ size = 16, color = "currentColor", className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3 2.66686V13.3335C2.99997 13.4521 3.03158 13.5686 3.09159 13.6709C3.15159 13.7733 3.23781 13.8577 3.34135 13.9156C3.44489 13.9735 3.562 14.0027 3.68059 14.0002C3.79918 13.9978 3.91497 13.9637 4.016 13.9015L12.6827 8.56819C12.7797 8.50854 12.8599 8.42502 12.9155 8.32558C12.9711 8.22614 13.0003 8.11412 13.0003 8.00019C13.0003 7.88626 12.9711 7.77423 12.9155 7.6748C12.8599 7.57536 12.7797 7.49183 12.6827 7.43219L4.016 2.09885C3.91497 2.0367 3.79918 2.00262 3.68059 2.00015C3.562 1.99767 3.44489 2.02688 3.34135 2.08476C3.23781 2.14265 3.15159 2.22711 3.09159 2.32943C3.03158 2.43175 2.99997 2.54824 3 2.66686Z",
            fill: color
          }
        )
      }
    );
  }
);
IconExpandOff.displayName = "IconExpandOff";
const IconExpandOn = forwardRef(
  ({ size = 16, color = "currentColor", className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3335 3H2.66686C2.54824 2.99997 2.43175 3.03158 2.32943 3.09159C2.22711 3.15159 2.14265 3.23781 2.08476 3.34135C2.02688 3.44489 1.99767 3.562 2.00015 3.68059C2.00262 3.79918 2.0367 3.91497 2.09885 4.016L7.43219 12.6827C7.49183 12.7797 7.57536 12.8599 7.6748 12.9155C7.77423 12.9711 7.88626 13.0003 8.00019 13.0003C8.11412 13.0003 8.22614 12.9711 8.32558 12.9155C8.42502 12.8599 8.50854 12.7797 8.56819 12.6827L13.9015 4.016C13.9637 3.91497 13.9978 3.79918 14.0002 3.68059C14.0027 3.562 13.9735 3.44489 13.9156 3.34135C13.8577 3.23781 13.7733 3.15159 13.6709 3.09159C13.5686 3.03158 13.4521 2.99997 13.3335 3Z",
            fill: color
          }
        )
      }
    );
  }
);
IconExpandOn.displayName = "IconExpandOn";
const IconRobotCustom = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M3.875 3.16952H12.125C12.4897 3.16952 12.8394 3.31116 13.0973 3.5633C13.3551 3.81543 13.5 4.15739 13.5 4.51396V12.5806C13.5 12.9372 13.3551 13.2792 13.0973 13.5313C12.8394 13.7834 12.4897 13.9251 12.125 13.9251H3.875C3.51033 13.9251 3.16059 13.7834 2.90273 13.5313C2.64487 13.2792 2.5 12.9372 2.5 12.5806V4.51396C2.5 4.15739 2.64487 3.81543 2.90273 3.5633C3.16059 3.31116 3.51033 3.16952 3.875 3.16952Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconRobotCustom.displayName = "IconRobotCustom";
const IconAddRobotCustom = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.5 8.5V4.51396C13.5 4.15739 13.3551 3.81543 13.0973 3.5633C12.8394 3.31116 12.4897 3.16952 12.125 3.16952H3.875C3.51033 3.16952 3.16059 3.31116 2.90273 3.5633C2.64487 3.81543 2.5 4.15739 2.5 4.51396V12.5806C2.5 12.9372 2.64487 13.2792 2.90273 13.5313C3.16059 13.7834 3.51033 13.9251 3.875 13.9251H8M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M10.8 12.7H14.4M12.6 10.9V14.5",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
            style: { height: "9px" }
          }
        )
      }
    );
  }
);
IconAddRobotCustom.displayName = "IconAddRobotCustom";
const IconActive2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.599 13.4069V13.4136M12.6923 11.7402V11.7469M13.8457 9.33333V9.34M13.8457 6.66667V6.67333M12.6923 4.25977V4.26643M10.599 2.5931V2.59977M7.99902 2V2.00667M5.39901 2.5931V2.59977M3.3057 4.25977V4.26643M2.15234 6.66667V6.67333M2.15234 9.33333V9.34M3.3057 11.7402V11.7469M5.39901 13.4069V13.4136M7.99902 14V14.0067M7.33236 8C7.33236 8.17681 7.40259 8.34638 7.52762 8.4714C7.65264 8.59643 7.82221 8.66667 7.99902 8.66667C8.17583 8.66667 8.3454 8.59643 8.47043 8.4714C8.59545 8.34638 8.66569 8.17681 8.66569 8C8.66569 7.82319 8.59545 7.65362 8.47043 7.5286C8.3454 7.40357 8.17583 7.33333 7.99902 7.33333C7.82221 7.33333 7.65264 7.40357 7.52762 7.5286C7.40259 7.65362 7.33236 7.82319 7.33236 8ZM4.66569 8C4.66569 8.88406 5.01688 9.7319 5.642 10.357C6.26712 10.9821 7.11497 11.3333 7.99902 11.3333C8.88308 11.3333 9.73092 10.9821 10.356 10.357C10.9812 9.7319 11.3324 8.88406 11.3324 8C11.3324 7.11595 10.9812 6.2681 10.356 5.64298C9.73092 5.01786 8.88308 4.66667 7.99902 4.66667C7.11497 4.66667 6.26712 5.01786 5.642 5.64298C5.01688 6.2681 4.66569 7.11595 4.66569 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconActive2.displayName = "IconActive2";
const IconAddVolume2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M10.6 12.7H14.6M12.6 10.7V12.7V14.7",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAddVolume2.displayName = "IconAddVolume2";
const IconAddRobot = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.5 8.5V4.51396C13.5 4.15739 13.3551 3.81543 13.0973 3.5633C12.8394 3.31116 12.4897 3.16952 12.125 3.16952H3.875C3.51033 3.16952 3.16059 3.31116 2.90273 3.5633C2.64487 3.81543 2.5 4.15739 2.5 4.51396V12.5806C2.5 12.9372 2.64487 13.2792 2.90273 13.5313C3.16059 13.7834 3.51033 13.9251 3.875 13.9251H8M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M10.8 12.7H14.4M12.6 10.9V14.5",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAddRobot.displayName = "IconAddRobot";
const IconAlert2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 6V8.66667M8 10.6667V10.6733M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAlert2.displayName = "IconAlert2";
const IconAttach2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10 4.66667L5.66667 9C5.40145 9.26522 5.25245 9.62493 5.25245 10C5.25245 10.3751 5.40145 10.7348 5.66667 11C5.93188 11.2652 6.29159 11.4142 6.66667 11.4142C7.04174 11.4142 7.40145 11.2652 7.66667 11L12 6.66667C12.5304 6.13624 12.8284 5.41681 12.8284 4.66667C12.8284 3.91652 12.5304 3.1971 12 2.66667C11.4696 2.13624 10.7501 1.83824 10 1.83824C9.24986 1.83824 8.53043 2.13624 8 2.66667L3.66667 7C2.87102 7.79565 2.42403 8.87478 2.42403 10C2.42403 11.1252 2.87102 12.2044 3.66667 13C4.46232 13.7957 5.54145 14.2426 6.66667 14.2426C7.79189 14.2426 8.87102 13.7957 9.66667 13L14 8.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAttach2.displayName = "IconAttach2";
const IconBackup2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66761 11.9999C3.8358 11.9999 3.03805 11.6839 2.44987 11.1212C1.86169 10.5586 1.53125 9.79558 1.53125 8.99993C1.53125 8.20428 1.86169 7.44122 2.44987 6.87861C3.03805 6.316 3.8358 5.99993 4.66761 5.99993C4.86407 5.12471 5.43879 4.35558 6.26534 3.86174C6.6746 3.61721 7.13338 3.44763 7.61546 3.36267C8.09755 3.27771 8.59351 3.27905 9.07502 3.36659C9.55653 3.45414 10.0142 3.62619 10.4218 3.87291C10.8294 4.11964 11.1791 4.43621 11.4508 4.80455C11.7225 5.17288 11.9109 5.58578 12.0053 6.01966C12.0997 6.45354 12.0982 6.8999 12.0009 7.33326H12.6676C13.2865 7.33326 13.8799 7.57909 14.3175 8.01668C14.7551 8.45426 15.0009 9.04775 15.0009 9.66659C15.0009 10.2854 14.7551 10.8789 14.3175 11.3165C13.8799 11.7541 13.2865 11.9999 12.6676 11.9999H12.0009M6.00098 9.99996L8.00098 7.99996M8.00098 7.99996L10.001 9.99996M8.00098 7.99996V14",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconBackup2.displayName = "IconBackup2";
const IconBuilding2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx("g", { opacity: "0.2", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 4V2M10.8333 5.16667L12.2667 3.73334M12 8H14M10.8333 10.8333L12.2667 12.2667M8 12V14M5.16665 10.8333L3.73332 12.2667M4 8H2M5.16665 5.16667L3.73332 3.73334",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    );
  }
);
IconBuilding2.displayName = "IconBuilding";
const IconCertificate2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.33333 2V4.66667C9.33333 4.84348 9.40357 5.01305 9.5286 5.13807C9.65362 5.2631 9.82319 5.33333 10 5.33333H12.6667M9.33333 2H4.66667C4.31304 2 3.97391 2.14048 3.72386 2.39052C3.47381 2.64057 3.33333 2.97971 3.33333 3.33333V5.33333M9.33333 2L12.6667 5.33333M12.6667 5.33333V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H8M3 11.3333L2 14.6667L4 13.6667L6 14.6667L5 11.3333M2 9.33333C2 9.86377 2.21071 10.3725 2.58579 10.7475C2.96086 11.1226 3.46957 11.3333 4 11.3333C4.53043 11.3333 5.03914 11.1226 5.41421 10.7475C5.78929 10.3725 6 9.86377 6 9.33333C6 8.8029 5.78929 8.29419 5.41421 7.91912C5.03914 7.54405 4.53043 7.33333 4 7.33333C3.46957 7.33333 2.96086 7.54405 2.58579 7.91912C2.21071 8.29419 2 8.8029 2 9.33333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCertificate2.displayName = "IconCertificate2";
const IconChart2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9 11.3078V6.76416M12.4286 11.3082V4.45459M5.57141 11.3082V9.49072M14 13.6196L3 13.6196L3 3",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChart2.displayName = "IconChart2";
const IconCheckcircle = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13 7.53993V7.99993C12.9994 9.07814 12.6503 10.1273 12.0047 10.9908C11.3591 11.8544 10.4516 12.4862 9.41768 12.7919C8.38372 13.0976 7.27863 13.0609 6.26724 12.6872C5.25584 12.3136 4.39233 11.623 3.80548 10.7185C3.21863 9.81395 2.9399 8.74396 3.01084 7.66809C3.08178 6.59221 3.4986 5.5681 4.19914 4.74847C4.89968 3.92884 5.84639 3.35762 6.89809 3.12001C7.9498 2.88239 9.05013 2.9911 10.035 3.42993M13 4L8 9.005L6.5 7.505",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCheckcircle.displayName = "IconCheckcircle";
const IconChevrondown = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 6L8 10L12 6",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChevrondown.displayName = "IconChevrondown";
const IconChevronleft = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10 4L6 8L10 12",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChevronleft.displayName = "IconChevronleft";
const IconChevronright = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 4L10 8L6 12",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChevronright.displayName = "IconChevronright";
const IconChevronup = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 10L8 6L12 10",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChevronup.displayName = "IconChevronup";
const IconClosesmall = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M12 4L3.99996 12M3.99996 4L12 12",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconClosesmall.displayName = "IconClosesmall";
const IconCodeConsole = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.33333 5.99984L7.33333 7.99984L5.33333 9.99984M8.66667 9.99984H10.6667M2 3.99984C2 3.64622 2.14048 3.30708 2.39052 3.05703C2.64057 2.80698 2.97971 2.6665 3.33333 2.6665H12.6667C13.0203 2.6665 13.3594 2.80698 13.6095 3.05703C13.8595 3.30708 14 3.64622 14 3.99984V11.9998C14 12.3535 13.8595 12.6926 13.6095 12.9426C13.3594 13.1927 13.0203 13.3332 12.6667 13.3332H3.33333C2.97971 13.3332 2.64057 13.1927 2.39052 12.9426C2.14048 12.6926 2 12.3535 2 11.9998V3.99984Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCodeConsole.displayName = "IconCodeConsole";
const IconCopy2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.67467 11.158C2.47023 11.0415 2.30018 10.873 2.18172 10.6697C2.06325 10.4663 2.00057 10.2353 2 10V3.33333C2 2.6 2.6 2 3.33333 2H10C10.5 2 10.772 2.25667 11 2.66667M4.66667 6.44467C4.66667 5.97311 4.85399 5.52087 5.18743 5.18743C5.52087 4.85399 5.97311 4.66667 6.44467 4.66667H12.222C12.4555 4.66667 12.6867 4.71266 12.9024 4.80201C13.1181 4.89136 13.3141 5.02233 13.4792 5.18743C13.6443 5.35253 13.7753 5.54854 13.8647 5.76426C13.954 5.97997 14 6.21118 14 6.44467V12.222C14 12.4555 13.954 12.6867 13.8647 12.9024C13.7753 13.1181 13.6443 13.3141 13.4792 13.4792C13.3141 13.6443 13.1181 13.7753 12.9024 13.8647C12.6867 13.954 12.4555 14 12.222 14H6.44467C6.21118 14 5.97997 13.954 5.76426 13.8647C5.54854 13.7753 5.35253 13.6443 5.18743 13.4792C5.02233 13.3141 4.89136 13.1181 4.80201 12.9024C4.71266 12.6867 4.66667 12.4555 4.66667 12.222V6.44467Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCopy2.displayName = "IconCopy";
const IconDashboards = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.83398 5.39431V2.93915C8.83398 2.76515 8.89193 2.6207 9.00782 2.50581C9.12371 2.39081 9.26726 2.33331 9.43848 2.33331H13.0655C13.2368 2.33331 13.3799 2.39081 13.4948 2.50581C13.6098 2.6207 13.6673 2.76515 13.6673 2.93915V5.39431C13.6673 5.5682 13.6094 5.71259 13.4935 5.82748C13.3776 5.94248 13.234 5.99998 13.0628 5.99998H9.43582C9.26448 5.99998 9.12137 5.94248 9.00648 5.82748C8.89148 5.71259 8.83398 5.5682 8.83398 5.39431ZM2.33398 7.73331V2.93315C2.33398 2.76315 2.39193 2.6207 2.50782 2.50581C2.62371 2.39081 2.76726 2.33331 2.93848 2.33331H6.56548C6.73682 2.33331 6.87993 2.39081 6.99482 2.50581C7.10982 2.62081 7.16732 2.76331 7.16732 2.93331V5.3334V7.73348C7.16732 7.90348 7.10937 8.04592 6.99348 8.16081C6.87759 8.27581 6.73404 8.33331 6.56282 8.33331H2.93582C2.76448 8.33331 2.62137 8.27581 2.50648 8.16081C2.39148 8.04581 2.33398 7.90331 2.33398 7.73331ZM8.83398 13.0666V8.26648C8.83398 8.09648 8.89193 7.95403 9.00782 7.83915C9.12371 7.72415 9.26726 7.66665 9.43848 7.66665H13.0655C13.2368 7.66665 13.3799 7.72415 13.4948 7.83915C13.6098 7.95415 13.6673 8.09665 13.6673 8.26665V13.0668C13.6673 13.2368 13.6094 13.3793 13.4935 13.4941C13.3776 13.6091 13.234 13.6666 13.0628 13.6666H9.43582C9.26448 13.6666 9.12137 13.6091 9.00648 13.4941C8.89148 13.3791 8.83398 13.2366 8.83398 13.0666ZM2.33398 13.0608V10.6056C2.33398 10.4318 2.39193 10.2874 2.50782 10.1725C2.62371 10.0575 2.76726 9.99998 2.93848 9.99998H6.56548C6.73682 9.99998 6.87993 10.0575 6.99482 10.1725C7.10982 10.2874 7.16732 10.4318 7.16732 10.6056V13.0608C7.16732 13.2348 7.10937 13.3793 6.99348 13.4941C6.87759 13.6091 6.73404 13.6666 6.56282 13.6666H2.93582C2.76448 13.6666 2.62137 13.6091 2.50648 13.4941C2.39148 13.3793 2.33398 13.2348 2.33398 13.0608ZM3.33398 7.33331H6.16732V3.33331H3.33398V7.33331ZM9.83398 12.6666H12.6673V8.66665H9.83398V12.6666ZM9.83398 4.99998H12.6673V3.33331H9.83398V4.99998ZM3.33398 12.6666H6.16732V11H3.33398V12.6666Z",
            fill: color,
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDashboards.displayName = "IconDashboards";
const IconDeactivated2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.53059 7.52669C7.4055 7.6517 7.33519 7.82128 7.33512 7.99812C7.33509 8.08569 7.35231 8.1724 7.38579 8.25332C7.41927 8.33423 7.46836 8.40775 7.53026 8.46969C7.59216 8.53163 7.66565 8.58078 7.74653 8.61431C7.82742 8.64785 7.91412 8.66513 8.00169 8.66516C8.17854 8.66522 8.34817 8.59503 8.47326 8.47003M5.64875 5.63713C5.33724 5.9464 5.08988 6.31414 4.92088 6.71925C4.75187 7.12436 4.66454 7.55886 4.6639 7.99781C4.66327 8.43677 4.74933 8.87152 4.91716 9.27712C5.08499 9.68272 5.33127 10.0512 5.64188 10.3614C5.95248 10.6715 6.32129 10.9173 6.72713 11.0845C7.13297 11.2518 7.56784 11.3372 8.00679 11.336C8.44574 11.3347 8.88012 11.2468 9.28499 11.0772C9.68987 10.9076 10.0573 10.6597 10.3661 10.3478M11.2761 8.62047C11.3769 8.08893 11.3468 7.54084 11.1884 7.02353C11.03 6.50622 10.7481 6.03523 10.367 5.65124C9.98592 5.26724 9.51707 4.98178 9.00097 4.8195C8.48487 4.65723 7.93703 4.62301 7.40475 4.7198M10.5999 13.4069V13.4136M12.6934 11.7402V11.7469M13.8467 9.33333V9.34M13.8467 6.66667V6.67333M12.6934 4.25977V4.26643M10.5999 2.5931V2.59977M8 2V2.00667M5.40007 2.5931V2.59977M3.30664 4.25977V4.26643M2.15332 6.66667V6.67333M2.15332 9.33333V9.34M3.30664 11.7402V11.7469M5.40007 13.4069V13.4136M8 14V14.0067M2 2L14 14",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDeactivated2.displayName = "IconDeactivated2";
const IconDelete = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4.66667H13.3327M6.66602 7.33333V11.3333M9.33268 7.33333V11.3333M3.33268 4.66667L3.99935 12.6667C3.99935 13.0203 4.13982 13.3594 4.38987 13.6095C4.63992 13.8595 4.97906 14 5.33268 14H10.666C11.0196 14 11.3588 13.8595 11.6088 13.6095C11.8589 13.3594 11.9993 13.0203 11.9993 12.6667L12.666 4.66667M5.99935 4.66667V2.66667C5.99935 2.48986 6.06959 2.32029 6.19461 2.19526C6.31964 2.07024 6.4892 2 6.66602 2H9.33268C9.50949 2 9.67906 2.07024 9.80409 2.19526C9.92911 2.32029 9.99935 2.48986 9.99935 2.66667V4.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDelete.displayName = "IconDelete";
const IconDeleting2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M1.9987 4.24959H14M2.74878 4.24959L3.49886 13.2506C3.49886 13.6484 3.65691 14.03 3.93825 14.3113C4.21958 14.5927 4.60115 14.7507 4.99902 14.7507H6.49918M13.2499 4.24959L12.9686 7.62496M5.7491 4.24959V1.99935C5.7491 1.80042 5.82813 1.60963 5.9688 1.46896C6.10946 1.32829 6.30025 1.24927 6.49918 1.24927H9.49951C9.69844 1.24927 9.88923 1.32829 10.0299 1.46896C10.1706 1.60963 10.2496 1.80042 10.2496 1.99935V4.24959M12 10V9M13.4167 10.5833L14.1333 9.86667M14 12H15M13.4167 13.4167L14.1333 14.1333M12 14V15M10.5833 13.4167L9.86666 14.1333M10 12H9M10.5833 10.5833L9.86666 9.86667M6.6665 7.33331V11.3333M9.33317 7.33331V8",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDeleting2.displayName = "IconDeleting2";
const IconDownload2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 11.3333V12.6666C2.66602 13.0202 2.80649 13.3594 3.05654 13.6094C3.30659 13.8595 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8595 12.9422 13.6094C13.1922 13.3594 13.3327 13.0202 13.3327 12.6666V11.3333M4.66602 7.33329L7.99935 10.6666M7.99935 10.6666L11.3327 7.33329M7.99935 10.6666V2.66663",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDownload2.displayName = "IconDownload";
const IconDrawerclose = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66602 4.66663L7.99935 7.99996L4.66602 11.3333M8.66602 4.66663L11.9993 7.99996L8.66602 11.3333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDrawerclose.displayName = "IconDrawerclose";
const IconEdit = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66602 4.66667H3.99935C3.64573 4.66667 3.30659 4.80714 3.05654 5.05719C2.80649 5.30724 2.66602 5.64638 2.66602 6V12C2.66602 12.3536 2.80649 12.6928 3.05654 12.9428C3.30659 13.1929 3.64573 13.3333 3.99935 13.3333H9.99935C10.353 13.3333 10.6921 13.1929 10.9422 12.9428C11.1922 12.6928 11.3327 12.3536 11.3327 12V11.3333M10.666 3.33333L12.666 5.33333M13.5893 4.39007C13.8519 4.12751 13.9994 3.77139 13.9994 3.40007C13.9994 3.02875 13.8519 2.67264 13.5893 2.41007C13.3268 2.14751 12.9707 2 12.5993 2C12.228 2 11.8719 2.14751 11.6093 2.41007L5.99935 8.00007V10.0001H7.99935L13.5893 4.39007Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconEdit.displayName = "IconEdit";
const IconErrorWarning = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00033 6.00016V8.66683M8.00033 10.6668H8.00699M6.90898 2.39417L1.50498 11.4168C1.39358 11.6098 1.33463 11.8285 1.33399 12.0513C1.33335 12.274 1.39105 12.4931 1.50135 12.6867C1.61164 12.8802 1.77069 13.0415 1.96268 13.1545C2.15466 13.2676 2.37289 13.3283 2.59565 13.3308H13.405C13.6276 13.3283 13.8458 13.2675 14.0377 13.1545C14.2295 13.0415 14.3885 12.8803 14.4988 12.6868C14.6091 12.4934 14.6668 12.2744 14.6663 12.0517C14.6657 11.8291 14.6069 11.6104 14.4956 11.4175L9.09165 2.3935C8.97795 2.20584 8.81778 2.05066 8.62662 1.94296C8.43545 1.83527 8.21973 1.77869 8.00032 1.77869C7.7809 1.77869 7.56519 1.83527 7.37402 1.94296C7.18285 2.05066 7.02268 2.20584 6.90898 2.3935V2.39417Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconErrorWarning.displayName = "IconErrorWarning";
const IconError2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 1.5C11.5898 1.50001 14.4999 4.41023 14.5 8C14.5 11.5898 11.5898 14.5 8 14.5C4.41032 14.4998 1.50001 11.5897 1.5 8C1.50007 4.41033 4.41036 1.50018 8 1.5ZM8 2.5C4.96264 2.50018 2.50007 4.96262 2.5 8C2.50001 11.0374 4.9626 13.4998 8 13.5C11.0375 13.5 13.5 11.0375 13.5 8C13.4999 4.96252 11.0375 2.50001 8 2.5ZM9.44629 5.84668C9.64149 5.65148 9.95804 5.65161 10.1533 5.84668C10.3484 6.04195 10.3485 6.3585 10.1533 6.55371L8.70703 8L10.1533 9.44629C10.3484 9.64156 10.3485 9.95811 10.1533 10.1533C9.9581 10.3485 9.64156 10.3484 9.44629 10.1533L8 8.70703L6.55371 10.1533C6.3585 10.3485 6.04195 10.3484 5.84668 10.1533C5.65161 9.95805 5.65149 9.64149 5.84668 9.44629L7.29297 8L5.84668 6.55371C5.65142 6.35845 5.65143 6.04194 5.84668 5.84668C6.04194 5.65142 6.35845 5.65142 6.55371 5.84668L8 7.29297L9.44629 5.84668Z",
            fill: color,
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconError2.displayName = "IconError2";
const IconExternallink = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.99935 3.99996H3.99935C3.64573 3.99996 3.30659 4.14044 3.05654 4.39048C2.80649 4.64053 2.66602 4.97967 2.66602 5.33329V12C2.66602 12.3536 2.80649 12.6927 3.05654 12.9428C3.30659 13.1928 3.64573 13.3333 3.99935 13.3333H10.666C11.0196 13.3333 11.3588 13.1928 11.6088 12.9428C11.8589 12.6927 11.9993 12.3536 11.9993 12V7.99996M7.33268 8.66663L13.3327 2.66663M13.3327 2.66663H9.99935M13.3327 2.66663V5.99996",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconExternallink.displayName = "IconExternallink";
const IconFavoriteoff = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00005 11.8333L3.88538 13.9966L4.67138 9.41464L1.33805 6.16997L5.93805 5.50331L7.99538 1.33464L10.0527 5.50331L14.6527 6.16997L11.3194 9.41464L12.1054 13.9966L8.00005 11.8333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconFavoriteoff.displayName = "IconFavoriteoff";
const IconFavoriteon = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx("g", { "clip-path": "url(#clip0_379_3474)", children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.49615 4.89328L1.24282 5.50995L1.16749 5.52528C1.05345 5.55556 0.949484 5.61555 0.866215 5.69915C0.782947 5.78274 0.723356 5.88694 0.693529 6.0011C0.663701 6.11526 0.664705 6.23529 0.696439 6.34893C0.728172 6.46257 0.789498 6.56576 0.874154 6.64795L3.95549 9.64728L3.22882 13.8839L3.22015 13.9573C3.21317 14.0752 3.23766 14.1929 3.29112 14.2983C3.34458 14.4037 3.42508 14.4929 3.52438 14.557C3.62368 14.621 3.73821 14.6575 3.85625 14.6627C3.97429 14.6679 4.0916 14.6416 4.19615 14.5866L8.00015 12.5866L11.7955 14.5866L11.8622 14.6173C11.9722 14.6606 12.0918 14.6739 12.2087 14.6558C12.3255 14.6377 12.4355 14.5888 12.5272 14.5141C12.619 14.4395 12.6892 14.3418 12.7307 14.231C12.7722 14.1203 12.7835 14.0005 12.7635 13.8839L12.0362 9.64728L15.1188 6.64728L15.1708 6.59062C15.2451 6.49913 15.2938 6.38958 15.312 6.27315C15.3301 6.15671 15.3171 6.03753 15.2742 5.92777C15.2313 5.818 15.1601 5.72157 15.0678 5.64829C14.9755 5.57501 14.8654 5.52751 14.7488 5.51062L10.4955 4.89328L8.59415 1.03995C8.53914 0.928305 8.45397 0.834292 8.34828 0.768551C8.24259 0.702811 8.12062 0.667969 7.99615 0.667969C7.87169 0.667969 7.74971 0.702811 7.64403 0.768551C7.53834 0.834292 7.45317 0.928305 7.39815 1.03995L5.49615 4.89328Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_379_3474", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "16",
              height: "16",
              fill: "white",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconFavoriteon.displayName = "IconFavoriteon";
const IconFile2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9 3H5C4.73478 3 4.48043 3.10536 4.29289 3.29289C4.10536 3.48043 4 3.73478 4 4V12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11C11.2652 13 11.5196 12.8946 11.7071 12.7071C11.8946 12.5196 12 12.2652 12 12V6M9 3L12 6M9 3V6H12M10 8.5H6M10 10.5H6M7 6.5H6",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconFile2.displayName = "IconFile2";
const IconFlavor = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2 6.66667H3.33333M2 9.33333H3.33333M6.66667 2V3.33333M9.33333 2V3.33333M14 6.66667H12.6667M14 9.33333H12.6667M9.33333 14V12.6667M6.66667 14V12.6667M3.33333 4C3.33333 3.82319 3.40357 3.65362 3.5286 3.5286C3.65362 3.40357 3.82319 3.33333 4 3.33333H12C12.1768 3.33333 12.3464 3.40357 12.4714 3.5286C12.5964 3.65362 12.6667 3.82319 12.6667 4V12C12.6667 12.1768 12.5964 12.3464 12.4714 12.4714C12.3464 12.5964 12.1768 12.6667 12 12.6667H4C3.82319 12.6667 3.65362 12.5964 3.5286 12.4714C3.40357 12.3464 3.33333 12.1768 3.33333 12V4ZM6 6H10V10H6V6Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconFlavor.displayName = "IconFlavor";
const IconFloatingip = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 8.66666V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12M8 10.6667C7.64638 10.6667 7.30724 10.8071 7.05719 11.0572C6.80714 11.3072 6.66667 11.6464 6.66667 12M6.66667 12C6.66667 12.3536 6.80714 12.6928 7.05719 12.9428C7.30724 13.1928 7.64638 13.3333 8 13.3333C8.35362 13.3333 8.69276 13.1928 8.94281 12.9428C9.19286 12.6928 9.33333 12.3536 9.33333 12M6.66667 12H2M9.33333 12H14M3.33333 6.59792C3.33333 5.45525 4.30667 4.52858 5.50667 4.52858C5.69 3.71525 6.34333 3.05192 7.22133 2.78792C8.09933 2.52325 9.068 2.69858 9.762 3.24792C10.4567 3.79592 10.7713 4.63458 10.588 5.44792H11.05C11.4778 5.44703 11.8884 5.61607 12.1915 5.91786C12.4947 6.21965 12.6656 6.62948 12.6667 7.05725C12.6656 7.48502 12.4947 7.89485 12.1915 8.19664C11.8884 8.49843 11.4778 8.66747 11.05 8.66658H5.50667C4.30667 8.66658 3.33333 7.73992 3.33333 6.59792Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconFloatingip.displayName = "IconFloatingip";
const IconHardDrive2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.476 8.00004H2.49939M4.49935 10.3334H4.50518M6.83268 10.3334H6.83852M4.17852 3.98087L2.16602 8.00004V11.5C2.16602 11.8095 2.28893 12.1062 2.50772 12.325C2.72652 12.5438 3.02326 12.6667 3.33268 12.6667H12.666C12.9754 12.6667 13.2722 12.5438 13.491 12.325C13.7098 12.1062 13.8327 11.8095 13.8327 11.5V8.00004L11.8202 3.98087C11.7236 3.7865 11.5747 3.62292 11.3902 3.50854C11.2058 3.39415 10.9931 3.33349 10.776 3.33337H5.22268C5.00563 3.33349 4.79292 3.39415 4.60846 3.50854C4.424 3.62292 4.2751 3.7865 4.17852 3.98087Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHardDrive2.displayName = "IconHardDrive2";
const IconHelp2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 11.3333V11.34M8 9.00011C7.98773 8.78369 8.0461 8.56915 8.16635 8.38879C8.28659 8.20842 8.46218 8.07202 8.66667 8.00011C8.91725 7.90428 9.14217 7.7516 9.32371 7.55408C9.50526 7.35656 9.63848 7.11959 9.71288 6.86184C9.78729 6.60408 9.80084 6.33257 9.75249 6.06869C9.70413 5.8048 9.59518 5.55574 9.43421 5.34112C9.27324 5.1265 9.06465 4.95217 8.82486 4.83186C8.58507 4.71155 8.32063 4.64854 8.05235 4.64779C7.78407 4.64705 7.51928 4.70859 7.27883 4.82757C7.03838 4.94655 6.82882 5.11972 6.66667 5.33344M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHelp2.displayName = "IconHelp";
const IconHide = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M14 6C12.4 7.778 10.4 8.66667 8 8.66667C5.6 8.66667 3.6 7.778 2 6M2 9.99997L3.66667 7.46663M14 9.98397L12.3387 7.46663M6 11.3333L6.33333 8.66667M10 11.3333L9.66667 8.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHide.displayName = "IconHide";
const IconHome2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 14V10C6 9.64638 6.14048 9.30724 6.39052 9.05719C6.64057 8.80714 6.97971 8.66667 7.33333 8.66667H8.66667C9.02029 8.66667 9.35943 8.80714 9.60948 9.05719C9.85952 9.30724 10 9.64638 10 10V14M3.33333 8H2L8 2L14 8H12.6667V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHome2.displayName = "IconHome";
const IconHostAggregates2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 7.99999H12C12.5304 7.99999 13.0391 7.78928 13.4142 7.4142C13.7893 7.03913 14 6.53042 14 5.99999V4.66666C14 4.13622 13.7893 3.62752 13.4142 3.25244C13.0391 2.87737 12.5304 2.66666 12 2.66666H4C3.46957 2.66666 2.96086 2.87737 2.58579 3.25244C2.21071 3.62752 2 4.13622 2 4.66666V5.99999C2 6.53042 2.21071 7.03913 2.58579 7.4142C2.96086 7.78928 3.46957 7.99999 4 7.99999ZM4 7.99999C3.46957 7.99999 2.96086 8.2107 2.58579 8.58578C2.21071 8.96085 2 9.46956 2 9.99999V11.3333C2 11.8638 2.21071 12.3725 2.58579 12.7475C2.96086 13.1226 3.46957 13.3333 4 13.3333H8M4 7.99999H11M12 13.3333C11.6464 13.3333 11.3072 13.1928 11.0572 12.9428C10.8071 12.6928 10.6667 12.3536 10.6667 12C10.6667 11.6464 10.8071 11.3072 11.0572 11.0572C11.3072 10.8071 11.6464 10.6667 12 10.6667M12 13.3333C12.3536 13.3333 12.6928 13.1928 12.9428 12.9428C13.1929 12.6928 13.3333 12.3536 13.3333 12C13.3333 11.6464 13.1929 11.3072 12.9428 11.0572C12.6928 10.8071 12.3536 10.6667 12 10.6667M12 13.3333V14.3333M12 10.6667V9.66666M14.0213 10.8333L13.1553 11.3333M10.8468 12.6667L9.98014 13.1667M9.98014 10.8333L10.8468 11.3333M13.1553 12.6667L14.0219 13.1667M4.66667 5.33332V5.33999M4.66667 10.6667V10.6733",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHostAggregates2.displayName = "IconHostAggregates2";
const IconHypervisor2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.99935 5.99998H7.99935M2.66602 3.33331H5.33268M3.99935 3.33331V10.6666C3.99935 10.8435 4.06959 11.013 4.19461 11.1381C4.31964 11.2631 4.4892 11.3333 4.66602 11.3333H7.99935M7.99935 5.33331C7.99935 5.1565 8.06959 4.98693 8.19461 4.86191C8.31964 4.73688 8.4892 4.66665 8.66602 4.66665H12.666C12.8428 4.66665 13.0124 4.73688 13.1374 4.86191C13.2624 4.98693 13.3327 5.1565 13.3327 5.33331V6.66665C13.3327 6.84346 13.2624 7.01303 13.1374 7.13805C13.0124 7.26307 12.8428 7.33331 12.666 7.33331H8.66602C8.4892 7.33331 8.31964 7.26307 8.19461 7.13805C8.06959 7.01303 7.99935 6.84346 7.99935 6.66665V5.33331ZM7.99935 10.6666C7.99935 10.4898 8.06959 10.3203 8.19461 10.1952C8.31964 10.0702 8.4892 9.99998 8.66602 9.99998H12.666C12.8428 9.99998 13.0124 10.0702 13.1374 10.1952C13.2624 10.3203 13.3327 10.4898 13.3327 10.6666V12C13.3327 12.1768 13.2624 12.3464 13.1374 12.4714C13.0124 12.5964 12.8428 12.6666 12.666 12.6666H8.66602C8.4892 12.6666 8.31964 12.5964 8.19461 12.4714C8.06959 12.3464 7.99935 12.1768 7.99935 12V10.6666Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHypervisor2.displayName = "IconHypervisor2";
const IconImages2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66667 8C4.66667 7.11595 5.01786 6.2681 5.64298 5.64298C6.2681 5.01786 7.11595 4.66667 8 4.66667M8 11.3333C8.88406 11.3333 9.7319 10.9821 10.357 10.357C10.9821 9.7319 11.3333 8.88406 11.3333 8M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66667 8 8.66667C8.17681 8.66667 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.5286C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.5286C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconImages2.displayName = "IconImages2";
const IconInfo = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 10.7L8 7.53333M8 5.53333L8 5.52667M14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97594 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconInfo.displayName = "IconInfo";
const IconInstances2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3327 5L7.99935 2L2.66602 5M13.3327 5V11L7.99935 14M13.3327 5L7.99935 8M7.99935 14L2.66602 11V5M7.99935 14V8M2.66602 5L7.99935 8",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconInstances2.displayName = "IconInstances2";
const IconInuse2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66667 8V6C2.66667 5.46957 2.87738 4.96086 3.25245 4.58579C3.62753 4.21071 4.13623 4 4.66667 4H13.3333M13.3333 4L11.3333 2M13.3333 4L11.3333 6M13.3333 8V10C13.3333 10.5304 13.1226 11.0391 12.7475 11.4142C12.3725 11.7893 11.8638 12 11.3333 12H2.66667M2.66667 12L4.66667 14M2.66667 12L4.66667 10",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconInuse2.displayName = "IconInuse2";
const IconKey22 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.25 2.16666L12.0833 3.33332M12.0833 3.33332L13.8333 5.08332L11.7917 7.12499L10.0417 5.37499M12.0833 3.33332L10.0417 5.37499M7.64417 7.77249C7.34698 7.47129 6.99314 7.23185 6.60304 7.06797C6.21293 6.90408 5.79426 6.81897 5.37113 6.81756C4.948 6.81614 4.52877 6.89844 4.13757 7.05971C3.74638 7.22098 3.39095 7.45804 3.09175 7.75724C2.79255 8.05644 2.55549 8.41187 2.39422 8.80306C2.23295 9.19426 2.15065 9.61349 2.15207 10.0366C2.15349 10.4598 2.23859 10.8784 2.40248 11.2685C2.56637 11.6586 2.8058 12.0125 3.107 12.3097C3.7121 12.8941 4.52253 13.2175 5.36375 13.2102C6.20496 13.2028 7.00965 12.8654 7.6045 12.2706C8.19935 11.6757 8.53677 10.871 8.54408 10.0298C8.55139 9.1886 8.22801 8.37817 7.64358 7.77307L7.64417 7.77249ZM7.64417 7.77249L10.0417 5.37499",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconKey22.displayName = "IconKey2";
const IconKeypairs = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10 6H10.0067M11.0367 2.56187L13.438 4.96321C13.6161 5.14131 13.7574 5.35276 13.8538 5.58548C13.9503 5.81821 13.9999 6.06764 13.9999 6.31954C13.9999 6.57144 13.9503 6.82087 13.8538 7.05359C13.7574 7.28631 13.6161 7.49776 13.438 7.67587L11.676 9.43787C11.4979 9.616 11.2864 9.75731 11.0537 9.85372C10.821 9.95012 10.5716 9.99974 10.3197 9.99974C10.0678 9.99974 9.81833 9.95012 9.58561 9.85372C9.35289 9.75731 9.14144 9.616 8.96333 9.43787L8.76267 9.2372L4.39067 13.6092C4.16915 13.8307 3.87672 13.9671 3.56467 13.9945L3.448 13.9999H2.66667C2.50338 13.9998 2.34578 13.9399 2.22375 13.8314C2.10173 13.7229 2.02377 13.5734 2.00467 13.4112L2 13.3332V12.5519C2.00008 12.2388 2.11029 11.9358 2.31133 11.6959L2.39067 11.6092L2.66667 11.3332H4V9.99987H5.33333V8.66654L6.76267 7.2372L6.562 7.03654C6.38387 6.85843 6.24256 6.64698 6.14615 6.41426C6.04975 6.18154 6.00013 5.9321 6.00013 5.6802C6.00013 5.42831 6.04975 5.17887 6.14615 4.94615C6.24256 4.71343 6.38387 4.50198 6.562 4.32387L8.324 2.56187C8.50211 2.38374 8.71356 2.24243 8.94628 2.14603C9.179 2.04962 9.42843 2 9.68033 2C9.93223 2 10.1817 2.04962 10.4144 2.14603C10.6471 2.24243 10.8586 2.38374 11.0367 2.56187Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconKeypairs.displayName = "IconKeypairs";
const IconLayers = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3 10.5L8 13L13 10.5M3 8L8 10.5L13 8M8 3L3 5.5L8 8L13 5.5L8 3Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconLayers.displayName = "IconLayers";
const IconLoadbalancer = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconLoadbalancer.displayName = "IconLoadbalancer";
const IconLock2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.33398 7.33333V4.66667C5.33398 3.95942 5.61494 3.28115 6.11503 2.78105C6.61513 2.28095 7.29341 2 8.00065 2C8.70789 2 9.38617 2.28095 9.88627 2.78105C10.3864 3.28115 10.6673 3.95942 10.6673 4.66667V7.33333M3.33398 8.66667C3.33398 8.31304 3.47446 7.97391 3.72451 7.72386C3.97456 7.47381 4.3137 7.33333 4.66732 7.33333H11.334C11.6876 7.33333 12.0267 7.47381 12.2768 7.72386C12.5268 7.97391 12.6673 8.31304 12.6673 8.66667V12.6667C12.6673 13.0203 12.5268 13.3594 12.2768 13.6095C12.0267 13.8595 11.6876 14 11.334 14H4.66732C4.3137 14 3.97456 13.8595 3.72451 13.6095C3.47446 13.3594 3.33398 13.0203 3.33398 12.6667V8.66667ZM7.33398 10.6667C7.33398 10.8435 7.40422 11.013 7.52925 11.1381C7.65427 11.2631 7.82384 11.3333 8.00065 11.3333C8.17746 11.3333 8.34703 11.2631 8.47206 11.1381C8.59708 11.013 8.66732 10.8435 8.66732 10.6667C8.66732 10.4899 8.59708 10.3203 8.47206 10.1953C8.34703 10.0702 8.17746 10 8.00065 10C7.82384 10 7.65427 10.0702 7.52925 10.1953C7.40422 10.3203 7.33398 10.4899 7.33398 10.6667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconLock2.displayName = "IconLock";
const IconMaintenance2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx("g", { "clip-path": "url(#clip0_1805_2)", children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.8 4.2C9.67785 4.32462 9.60943 4.49216 9.60943 4.66667C9.60943 4.84117 9.67785 5.00871 9.8 5.13333L10.8667 6.2C10.9913 6.32215 11.1588 6.39057 11.3333 6.39057C11.5078 6.39057 11.6754 6.32215 11.8 6.2L13.8707 4.13C14.084 3.91533 14.446 3.98333 14.526 4.27533C14.7274 5.00792 14.716 5.78271 14.4932 6.50906C14.2703 7.23541 13.8452 7.88327 13.2676 8.37682C12.69 8.87038 11.9837 9.18923 11.2315 9.29604C10.4793 9.40286 9.71219 9.29324 9.02 8.98L3.74667 14.2533C3.48145 14.5185 3.12178 14.6674 2.74677 14.6673C2.37175 14.6672 2.01213 14.5182 1.747 14.253C1.48187 13.9878 1.33296 13.6281 1.33302 13.2531C1.33309 12.8781 1.48212 12.5185 1.74733 12.2533L7.02067 6.98C6.70743 6.28781 6.59781 5.52072 6.70462 4.7685C6.81144 4.01628 7.13028 3.31003 7.62384 2.73241C8.1174 2.15479 8.76526 1.72967 9.49161 1.50682C10.218 1.28396 10.9928 1.27258 11.7253 1.474C12.0173 1.554 12.0853 1.91533 11.8713 2.13L9.8 4.2Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_1805_2", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "16",
              height: "16",
              fill: "white",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconMaintenance2.displayName = "IconMaintenance2";
const IconMoreKebab = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52855C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52855C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52855C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52855C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconMoreKebab.displayName = "IconMoreKebab";
const IconNetwork22 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.91667 10.3333V8.58332C3.91667 8.42861 3.97813 8.28024 4.08753 8.17084C4.19692 8.06145 4.3453 7.99999 4.50001 7.99999H11.5C11.6547 7.99999 11.8031 8.06145 11.9125 8.17084C12.0219 8.28024 12.0833 8.42861 12.0833 8.58332V10.3333M8 7.99999V5.66666M10.9167 10.3333H13.25C13.5722 10.3333 13.8333 10.5945 13.8333 10.9167V13.25C13.8333 13.5722 13.5722 13.8333 13.25 13.8333H10.9167C10.5945 13.8333 10.3333 13.5722 10.3333 13.25V10.9167C10.3333 10.5945 10.5945 10.3333 10.9167 10.3333ZM2.75001 10.3333H5.08334C5.4055 10.3333 5.66667 10.5945 5.66667 10.9167V13.25C5.66667 13.5722 5.4055 13.8333 5.08334 13.8333H2.75001C2.42784 13.8333 2.16667 13.5722 2.16667 13.25V10.9167C2.16667 10.5945 2.42784 10.3333 2.75001 10.3333ZM6.83334 2.16666H9.16667C9.48884 2.16666 9.75 2.42782 9.75 2.74999V5.08332C9.75 5.40549 9.48884 5.66666 9.16667 5.66666H6.83334C6.51117 5.66666 6.25 5.40549 6.25 5.08332V2.74999C6.25 2.42782 6.51117 2.16666 6.83334 2.16666Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconNetwork22.displayName = "IconNetwork2";
const IconNetworks = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10M4 6C4 4.93913 4.42143 3.92172 5.17157 3.17157C5.92172 2.42143 6.93913 2 8 2M4 6H12M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6M8 10C8.88867 9.778 9.33333 8.44467 9.33333 6C9.33333 3.55533 8.88867 2.222 8 2M8 10C7.11133 9.778 6.66667 8.44467 6.66667 6C6.66667 3.55533 7.11133 2.222 8 2M8 10V12M12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2M2 13.3333H6.66667M6.66667 13.3333C6.66667 13.687 6.80714 14.0261 7.05719 14.2761C7.30724 14.5262 7.64638 14.6667 8 14.6667C8.35362 14.6667 8.69276 14.5262 8.94281 14.2761C9.19286 14.0261 9.33333 13.687 9.33333 13.3333M6.66667 13.3333C6.66667 12.9797 6.80714 12.6406 7.05719 12.3905C7.30724 12.1405 7.64638 12 8 12M9.33333 13.3333H14M9.33333 13.3333C9.33333 12.9797 9.19286 12.6406 8.94281 12.3905C8.69276 12.1405 8.35362 12 8 12",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconNetworks.displayName = "IconNetworks";
const IconNewtab = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00065 3.33337V12.6667M3.33398 8.00004H12.6673",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconNewtab.displayName = "IconNewtab";
const IconNotificationNew = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.99935 11.3333V12C5.99935 12.5304 6.21006 13.0391 6.58514 13.4142C6.96021 13.7893 7.46892 14 7.99935 14C8.52978 14 9.03849 13.7893 9.41356 13.4142C9.78864 13.0391 9.99935 12.5304 9.99935 12V11.3333M6.66602 3.33333C6.66602 2.97971 6.80649 2.64057 7.05654 2.39052C7.30659 2.14048 7.64573 2 7.99935 2C8.35297 2 8.69211 2.14048 8.94216 2.39052C9.19221 2.64057 9.33268 2.97971 9.33268 3.33333C10.0983 3.69535 10.751 4.25888 11.2207 4.96353C11.6905 5.66818 11.9596 6.48738 11.9993 7.33333V9.33333C12.0495 9.7478 12.1963 10.1447 12.4279 10.4921C12.6595 10.8395 12.9694 11.1276 13.3327 11.3333H2.66602C3.02931 11.1276 3.33922 10.8395 3.57081 10.4921C3.80239 10.1447 3.94918 9.7478 3.99935 9.33333V7.33333C4.03906 6.48738 4.30822 5.66818 4.77798 4.96353C5.24775 4.25888 5.90041 3.69535 6.66602 3.33333Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 2C12 2.53043 12.2107 3.03914 12.5858 3.41421C12.9609 3.78929 13.4696 4 14 4C14.5304 4 15.0391 3.78929 15.4142 3.41421C15.7893 3.03914 16 2.53043 16 2C16 1.46957 15.7893 0.960859 15.4142 0.585787C15.0391 0.210714 14.5304 0 14 0C13.4696 0 12.9609 0.210714 12.5858 0.585787C12.2107 0.960859 12 1.46957 12 2Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconNotificationNew.displayName = "IconNotificationNew";
const IconNotification = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.99935 11.3333V12C5.99935 12.5304 6.21006 13.0391 6.58514 13.4142C6.96021 13.7893 7.46892 14 7.99935 14C8.52978 14 9.03849 13.7893 9.41356 13.4142C9.78864 13.0391 9.99935 12.5304 9.99935 12V11.3333M6.66602 3.33333C6.66602 2.97971 6.80649 2.64057 7.05654 2.39052C7.30659 2.14048 7.64573 2 7.99935 2C8.35297 2 8.69211 2.14048 8.94216 2.39052C9.19221 2.64057 9.33268 2.97971 9.33268 3.33333C10.0983 3.69535 10.751 4.25888 11.2207 4.96353C11.6905 5.66818 11.9596 6.48738 11.9993 7.33333V9.33333C12.0495 9.7478 12.1963 10.1447 12.4279 10.4921C12.6595 10.8395 12.9694 11.1276 13.3327 11.3333H2.66602C3.02931 11.1276 3.33922 10.8395 3.57081 10.4921C3.80239 10.1447 3.94918 9.7478 3.99935 9.33333V7.33333C4.03906 6.48738 4.30822 5.66818 4.77798 4.96353C5.24775 4.25888 5.90041 3.69535 6.66602 3.33333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconNotification.displayName = "IconNotification";
const IconOrder2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 3.33329C5.33398 3.5101 5.40422 3.67967 5.52925 3.8047C5.65427 3.92972 5.82384 3.99996 6.00065 3.99996C6.17746 3.99996 6.34703 3.92972 6.47206 3.8047C6.59708 3.67967 6.66732 3.5101 6.66732 3.33329C6.66732 3.15648 6.59708 2.98691 6.47206 2.86189C6.34703 2.73686 6.17746 2.66663 6.00065 2.66663C5.82384 2.66663 5.65427 2.73686 5.52925 2.86189C5.40422 2.98691 5.33398 3.15648 5.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 7.99996C5.33398 8.17677 5.40422 8.34634 5.52925 8.47136C5.65427 8.59639 5.82384 8.66663 6.00065 8.66663C6.17746 8.66663 6.34703 8.59639 6.47206 8.47136C6.59708 8.34634 6.66732 8.17677 6.66732 7.99996C6.66732 7.82315 6.59708 7.65358 6.47206 7.52856C6.34703 7.40353 6.17746 7.33329 6.00065 7.33329C5.82384 7.33329 5.65427 7.40353 5.52925 7.52856C5.40422 7.65358 5.33398 7.82315 5.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 12.6666C5.33398 12.8434 5.40422 13.013 5.52925 13.138C5.65427 13.2631 5.82384 13.3333 6.00065 13.3333C6.17746 13.3333 6.34703 13.2631 6.47206 13.138C6.59708 13.013 6.66732 12.8434 6.66732 12.6666C6.66732 12.4898 6.59708 12.3202 6.47206 12.1952C6.34703 12.0702 6.17746 12 6.00065 12C5.82384 12 5.65427 12.0702 5.52925 12.1952C5.40422 12.3202 5.33398 12.4898 5.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 3.33329C9.33398 3.5101 9.40422 3.67967 9.52925 3.8047C9.65427 3.92972 9.82384 3.99996 10.0007 3.99996C10.1775 3.99996 10.347 3.92972 10.4721 3.8047C10.5971 3.67967 10.6673 3.5101 10.6673 3.33329C10.6673 3.15648 10.5971 2.98691 10.4721 2.86189C10.347 2.73686 10.1775 2.66663 10.0007 2.66663C9.82384 2.66663 9.65427 2.73686 9.52925 2.86189C9.40422 2.98691 9.33398 3.15648 9.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 7.99996C9.33398 8.17677 9.40422 8.34634 9.52925 8.47136C9.65427 8.59639 9.82384 8.66663 10.0007 8.66663C10.1775 8.66663 10.347 8.59639 10.4721 8.47136C10.5971 8.34634 10.6673 8.17677 10.6673 7.99996C10.6673 7.82315 10.5971 7.65358 10.4721 7.52856C10.347 7.40353 10.1775 7.33329 10.0007 7.33329C9.82384 7.33329 9.65427 7.40353 9.52925 7.52856C9.40422 7.65358 9.33398 7.82315 9.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 12.6666C9.33398 12.8434 9.40422 13.013 9.52925 13.138C9.65427 13.2631 9.82384 13.3333 10.0007 13.3333C10.1775 13.3333 10.347 13.2631 10.4721 13.138C10.5971 13.013 10.6673 12.8434 10.6673 12.6666C10.6673 12.4898 10.5971 12.3202 10.4721 12.1952C10.347 12.0702 10.1775 12 10.0007 12C9.82384 12 9.65427 12.0702 9.52925 12.1952C9.40422 12.3202 9.33398 12.4898 9.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconOrder2.displayName = "IconOrder2";
const IconPaused = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsxs("g", { opacity: "0.2", children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M4.00004 4C4.00004 3.82319 4.07028 3.65362 4.1953 3.52859C4.32033 3.40357 4.4899 3.33333 4.66671 3.33333H6.00004C6.17685 3.33333 6.34642 3.40357 6.47145 3.52859C6.59647 3.65362 6.66671 3.82319 6.66671 4V12C6.66671 12.1768 6.59647 12.3464 6.47145 12.4714C6.34642 12.5964 6.17685 12.6667 6.00004 12.6667H4.66671C4.4899 12.6667 4.32033 12.5964 4.1953 12.4714C4.07028 12.3464 4.00004 12.1768 4.00004 12V4Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33338 4C9.33338 3.82319 9.40361 3.65362 9.52864 3.52859C9.65366 3.40357 9.82323 3.33333 10 3.33333H11.3334C11.5102 3.33333 11.6798 3.40357 11.8048 3.52859C11.9298 3.65362 12 3.82319 12 4V12C12 12.1768 11.9298 12.3464 11.8048 12.4714C11.6798 12.5964 11.5102 12.6667 11.3334 12.6667H10C9.82323 12.6667 9.65366 12.5964 9.52864 12.4714C9.40361 12.3464 9.33338 12.1768 9.33338 12V4Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ] })
      }
    );
  }
);
IconPaused.displayName = "IconPaused";
const IconPlay = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx("g", { opacity: "0.2", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66602 2.66663V13.3333L13.3327 7.99996L4.66602 2.66663Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    );
  }
);
IconPlay.displayName = "IconPlay";
const IconPlugin2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M4.6667 8L8.00004 11.3333L7.00004 12.3333C6.78248 12.5581 6.52238 12.7373 6.23487 12.8605C5.94737 12.9837 5.63823 13.0484 5.32545 13.051C5.01267 13.0535 4.70251 12.9938 4.41304 12.8753C4.12358 12.7567 3.8606 12.5818 3.63942 12.3606C3.41825 12.1394 3.2433 11.8765 3.12477 11.587C3.00625 11.2975 2.94651 10.9874 2.94905 10.6746C2.95159 10.3618 3.01635 10.0527 3.13956 9.76516C3.26277 9.47766 3.44197 9.21756 3.66671 9L4.6667 8ZM11.3333 8.00004L8 4.6667L9 3.66671C9.21756 3.44197 9.47766 3.26277 9.76516 3.13956C10.0527 3.01635 10.3618 2.95159 10.6746 2.94905C10.9874 2.94651 11.2975 3.00625 11.587 3.12477C11.8765 3.2433 12.1394 3.41825 12.3606 3.63942C12.5818 3.8606 12.7567 4.12358 12.8753 4.41304C12.9938 4.70251 13.0535 5.01267 13.051 5.32545C13.0484 5.63823 12.9837 5.94737 12.8605 6.23487C12.7373 6.52238 12.5581 6.78248 12.3333 7.00004L11.3333 8.00004Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPlugin2.displayName = "IconPlugin2";
const IconPlusCircle = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 5.6V10.4M5.6 8H10.4M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPlusCircle.displayName = "IconPlusCircle";
const IconPorts1 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8 13.8333C11.2217 13.8333 13.8333 11.2217 13.8333 7.99999C13.8333 4.77824 11.2217 2.16666 8 2.16666C4.77825 2.16666 2.16667 4.77824 2.16667 7.99999C2.16667 11.2217 4.77825 13.8333 8 13.8333Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8 9.75C8.9665 9.75 9.75 8.9665 9.75 8C9.75 7.0335 8.9665 6.25 8 6.25C7.0335 6.25 6.25 7.0335 6.25 8C6.25 8.9665 7.0335 9.75 8 9.75Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconPorts1.displayName = "IconPorts1";
const IconPorts22 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 5.33332C7.64638 5.33332 7.30724 5.19285 7.05719 4.9428C6.80714 4.69275 6.66667 4.35361 6.66667 3.99999C6.66667 3.64637 6.80714 3.30723 7.05719 3.05718C7.30724 2.80713 7.64638 2.66666 8 2.66666C8.35362 2.66666 8.69276 2.80713 8.94281 3.05718C9.19286 3.30723 9.33333 3.64637 9.33333 3.99999C9.33333 4.35361 9.19286 4.69275 8.94281 4.9428C8.69276 5.19285 8.35362 5.33332 8 5.33332ZM8 5.33332V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12C9.33333 12.3536 9.19286 12.6928 8.94281 12.9428C8.69276 13.1928 8.35362 13.3333 8 13.3333C7.64638 13.3333 7.30724 13.1928 7.05719 12.9428C6.80714 12.6928 6.66667 12.3536 6.66667 12C6.66667 11.6464 6.80714 11.3072 7.05719 11.0572C7.30724 10.8071 7.64638 10.6667 8 10.6667ZM4.21061 8.33059L7.12261 5.00259M11.7892 8.33056L8.87858 5.0039M4.66667 9.33332C4.66667 8.9797 4.52619 8.64056 4.27614 8.39051C4.02609 8.14047 3.68696 7.99999 3.33333 7.99999C2.97971 7.99999 2.64057 8.14047 2.39052 8.39051C2.14048 8.64056 2 8.9797 2 9.33332C2 9.68695 2.14048 10.0261 2.39052 10.2761C2.64057 10.5262 2.97971 10.6667 3.33333 10.6667C3.68696 10.6667 4.02609 10.5262 4.27614 10.2761C4.52619 10.0261 4.66667 9.68695 4.66667 9.33332ZM14 9.33332C14 8.9797 13.8595 8.64056 13.6095 8.39051C13.3594 8.14047 13.0203 7.99999 12.6667 7.99999C12.313 7.99999 11.9739 8.14047 11.7239 8.39051C11.4738 8.64056 11.3333 8.9797 11.3333 9.33332C11.3333 9.68695 11.4738 10.0261 11.7239 10.2761C11.9739 10.5262 12.313 10.6667 12.6667 10.6667C13.0203 10.6667 13.3594 10.5262 13.6095 10.2761C13.8595 10.0261 14 9.68695 14 9.33332Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPorts22.displayName = "IconPorts22";
const IconPublish2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3327 4.99955V3.66622C13.3327 3.3126 13.1922 2.97346 12.9422 2.72341C12.6921 2.47336 12.353 2.33289 11.9993 2.33289L3.99935 2.33289C3.64573 2.33289 3.30659 2.47336 3.05654 2.72341C2.80649 2.97346 2.66602 3.3126 2.66602 3.66622L2.66602 4.99955M4.66606 8.33337L7.99939 5.00004M7.99939 5.00004L11.3327 8.33337M7.99939 5.00004V13",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPublish2.displayName = "IconPublish2";
const IconReboot2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66732 3.99996C3.85824 4.68314 3.27863 5.59843 3.00694 6.62192C2.73525 7.6454 2.7846 8.72766 3.14832 9.72217C3.51204 10.7167 4.17256 11.5754 5.04046 12.1821C5.90836 12.7888 6.94172 13.1142 8.00065 13.1142C9.05959 13.1142 10.0929 12.7888 10.9608 12.1821C11.8287 11.5754 12.4893 10.7167 12.853 9.72217C13.2167 8.72766 13.2661 7.6454 12.9944 6.62192C12.7227 5.59843 12.1431 4.68314 11.334 3.99996M8.00065 2.66663V7.99996",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconReboot2.displayName = "IconReboot2";
const IconRefresh2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx("g", { opacity: "0.2", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3327 7.33346C13.1696 6.16027 12.6254 5.07324 11.7838 4.23979C10.9422 3.40635 9.84985 2.87274 8.67513 2.72116C7.50041 2.56959 6.30843 2.80845 5.28282 3.40096C4.2572 3.99347 3.45485 4.90675 2.99935 6.00013M2.66602 3.33346V6.00013H5.33268M2.66602 8.66667C2.82906 9.83985 3.3733 10.9269 4.21492 11.7603C5.05654 12.5938 6.14884 13.1274 7.32357 13.279C8.49829 13.4305 9.69027 13.1917 10.7159 12.5992C11.7415 12.0067 12.5438 11.0934 12.9993 10M13.3327 12.6667V10H10.666",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    );
  }
);
IconRefresh2.displayName = "IconRefresh";
const IconRequest = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 8L7.33333 9.33333L10 6.66667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconRequest.displayName = "IconRequest";
const IconRouterArrows = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsxs("g", { clipPath: "url(#routerArrowsClip)", children: [
            /* @__PURE__ */ jsx("path", { d: "M1 8H5", stroke: color, strokeLinecap: "round" }),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M3.25 6L5.25 8L3.25 10",
                stroke: color,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx("path", { d: "M8 5V1", stroke: color, strokeLinecap: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M6 3L8 1L10 3", stroke: color, strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M8 11V15", stroke: color, strokeLinecap: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M6 13L8 15L10 13", stroke: color, strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M15 8L11 8", stroke: color, strokeLinecap: "round" }),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M12.75 6L10.75 8L12.75 10",
                stroke: color,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "routerArrowsClip", children: /* @__PURE__ */ jsx("rect", { width: "16", height: "16", fill: "white" }) }) })
        ]
      }
    );
  }
);
IconRouterArrows.displayName = "IconRouterArrows";
const IconRouters1 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.16667, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12.6667 4.5H3.33333C2.689 4.5 2.16666 5.02233 2.16666 5.66667V10.3333C2.16666 10.9777 2.689 11.5 3.33333 11.5H12.6667C13.311 11.5 13.8333 10.9777 13.8333 10.3333V5.66667C13.8333 5.02233 13.311 4.5 12.6667 4.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M4.5 8H4.50583",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6.83334 8H6.83917",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.16666 8H9.1725",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M11.5 8H11.5058",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconRouters1.displayName = "IconRouters1";
const IconRouters2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M11.3333 11.3333V11.34M8.66667 11.3333V11.34M10 8.66667V7.33333M7.83333 5.83346C8.08022 5.48936 8.40552 5.20901 8.78229 5.01562C9.15907 4.82222 9.57649 4.72135 10 4.72135C10.4235 4.72135 10.8409 4.82222 11.2177 5.01562C11.5945 5.20901 11.9198 5.48936 12.1667 5.83346M5.66667 4.33358C6.16045 3.64538 6.81104 3.08468 7.56459 2.6979C8.31814 2.31112 9.15298 2.10937 10 2.10938C10.847 2.10937 11.6819 2.31112 12.4354 2.6979C13.189 3.08468 13.8396 3.64538 14.3333 4.33358M2 10C2 9.64638 2.14048 9.30724 2.39052 9.05719C2.64057 8.80714 2.97971 8.66667 3.33333 8.66667H12.6667C13.0203 8.66667 13.3594 8.80714 13.6095 9.05719C13.8595 9.30724 14 9.64638 14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconRouters2.displayName = "IconRouters2";
const IconSchedule = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx("g", { opacity: "0.2", "clip-path": "url(#clip0_379_3462)", children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8.00065 4.00004V8.00004L10.6673 9.33337M14.6673 8.00004C14.6673 11.6819 11.6825 14.6667 8.00065 14.6667C4.31875 14.6667 1.33398 11.6819 1.33398 8.00004C1.33398 4.31814 4.31875 1.33337 8.00065 1.33337C11.6825 1.33337 14.6673 4.31814 14.6673 8.00004Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_379_3462", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "16",
              height: "16",
              fill: "white",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconSchedule.displayName = "IconSchedule";
const IconSearch2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M14 14L9.99995 10M1.99995 6.66667C1.99995 7.2795 2.12066 7.88634 2.35518 8.45252C2.58971 9.01871 2.93345 9.53316 3.36679 9.9665C3.80013 10.3998 4.31458 10.7436 4.88077 10.9781C5.44695 11.2126 6.05379 11.3333 6.66662 11.3333C7.27946 11.3333 7.88629 11.2126 8.45248 10.9781C9.01866 10.7436 9.53311 10.3998 9.96645 9.9665C10.3998 9.53316 10.7435 9.01871 10.9781 8.45252C11.2126 7.88634 11.3333 7.2795 11.3333 6.66667C11.3333 6.05383 11.2126 5.447 10.9781 4.88081C10.7435 4.31462 10.3998 3.80018 9.96645 3.36683C9.53311 2.93349 9.01866 2.58975 8.45248 2.35523C7.88629 2.12071 7.27946 2 6.66662 2C6.05379 2 5.44695 2.12071 4.88077 2.35523C4.31458 2.58975 3.80013 2.93349 3.36679 3.36683C2.93345 3.80018 2.58971 4.31462 2.35518 4.88081C2.12066 5.447 1.99995 6.05383 1.99995 6.66667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSearch2.displayName = "IconSearch";
const IconSecurity = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 13.8333C8 13.8333 12.6667 11.5 12.6667 7.99999V3.91666L8 2.16666L3.33333 3.91666V7.99999C3.33333 11.5 8 13.8333 8 13.8333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSecurity.displayName = "IconSecurity";
const IconSecurityerror = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.0267 13.1633C9.39872 13.5307 8.71739 13.814 8.00005 14C6.9622 13.7308 5.98904 13.2557 5.13842 12.603C4.28779 11.9503 3.57706 11.1332 3.04845 10.2004C2.51984 9.26751 2.18414 8.23793 2.06131 7.17279C1.93847 6.10764 2.03099 5.02868 2.33339 4C4.41041 4.09504 6.44283 3.37772 8.00005 2C9.55728 3.37772 11.5897 4.09504 13.6667 4C14.05 5.30392 14.0947 6.68399 13.7967 8.01M12.6667 10.6667V12.6667M12.6667 14.6667V14.6733",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSecurityerror.displayName = "IconSecurityerror";
const IconSecuritygroup = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.99919 8C7.82238 8 7.65281 7.92976 7.52778 7.80474C7.40276 7.67971 7.33252 7.51014 7.33252 7.33333C7.33252 7.15652 7.40276 6.98695 7.52778 6.86193C7.65281 6.7369 7.82238 6.66667 7.99919 6.66667C8.176 6.66667 8.34557 6.7369 8.47059 6.86193C8.59562 6.98695 8.66585 7.15652 8.66585 7.33333C8.66585 7.51014 8.59562 7.67971 8.47059 7.80474C8.34557 7.92976 8.176 8 7.99919 8ZM7.99919 8V9.66667M7.99924 2C9.55646 3.37772 11.5889 4.09504 13.6659 4C13.9683 5.02868 14.0608 6.10764 13.938 7.17279C13.8151 8.23793 13.4795 9.26751 12.9508 10.2004C12.4222 11.1332 11.7115 11.9503 10.8609 12.603C10.0103 13.2557 9.0371 13.7308 7.99924 14C6.96138 13.7308 5.98823 13.2557 5.1376 12.603C4.28698 11.9503 3.57625 11.1332 3.04764 10.2004C2.51903 9.26751 2.18333 8.23793 2.06049 7.17279C1.93765 6.10764 2.03018 5.02868 2.33257 4C4.40959 4.09504 6.44202 3.37772 7.99924 2Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSecuritygroup.displayName = "IconSecuritygroup";
const IconServer3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M12 7.99999C12.5304 7.99999 13.0391 7.78928 13.4142 7.4142C13.7893 7.03913 14 6.53042 14 5.99999V4.66666C14 4.13622 13.7893 3.62752 13.4142 3.25244C13.0391 2.87737 12.5304 2.66666 12 2.66666H4C3.46957 2.66666 2.96086 2.87737 2.58579 3.25244C2.21071 3.62752 2 4.13622 2 4.66666V5.99999C2 6.53042 2.21071 7.03913 2.58579 7.4142C2.96086 7.78928 3.46957 7.99999 4 7.99999M12 7.99999H4M12 7.99999C12.5304 7.99999 13.0391 8.2107 13.4142 8.58578C13.7893 8.96085 14 9.46956 14 9.99999V11.3333C14 11.8638 13.7893 12.3725 13.4142 12.7475C13.0391 13.1226 12.5304 13.3333 12 13.3333H4C3.46957 13.3333 2.96086 13.1226 2.58579 12.7475C2.21071 12.3725 2 11.8638 2 11.3333V9.99999C2 9.46956 2.21071 8.96085 2.58579 8.58578C2.96086 8.2107 3.46957 7.99999 4 7.99999M4.66667 5.33332V5.33999M4.66667 10.6667V10.6733",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconServer3.displayName = "IconServer";
const IconSetting = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6.88333 2.878C7.16733 1.70733 8.83267 1.70733 9.11667 2.878C9.15928 3.05387 9.24281 3.21719 9.36047 3.35467C9.47813 3.49215 9.62659 3.5999 9.79377 3.66916C9.96094 3.73843 10.1421 3.76723 10.3225 3.75325C10.5029 3.73926 10.6775 3.68287 10.832 3.58867C11.8607 2.962 13.0387 4.13933 12.412 5.16867C12.3179 5.3231 12.2616 5.49756 12.2477 5.67785C12.2337 5.85814 12.2625 6.03918 12.3317 6.20625C12.4009 6.37333 12.5085 6.52172 12.6458 6.63937C12.7831 6.75702 12.9463 6.8406 13.122 6.88333C14.2927 7.16733 14.2927 8.83267 13.122 9.11667C12.9461 9.15928 12.7828 9.24281 12.6453 9.36047C12.5079 9.47813 12.4001 9.62659 12.3308 9.79377C12.2616 9.96094 12.2328 10.1421 12.2468 10.3225C12.2607 10.5029 12.3171 10.6775 12.4113 10.832C13.038 11.8607 11.8607 13.0387 10.8313 12.412C10.6769 12.3179 10.5024 12.2616 10.3222 12.2477C10.1419 12.2337 9.96082 12.2625 9.79375 12.3317C9.62667 12.4009 9.47828 12.5085 9.36063 12.6458C9.24298 12.7831 9.1594 12.9463 9.11667 13.122C8.83267 14.2927 7.16733 14.2927 6.88333 13.122C6.84072 12.9461 6.75719 12.7828 6.63953 12.6453C6.52187 12.5079 6.37341 12.4001 6.20623 12.3308C6.03906 12.2616 5.85789 12.2328 5.67748 12.2468C5.49706 12.2607 5.3225 12.3171 5.168 12.4113C4.13933 13.038 2.96133 11.8607 3.588 10.8313C3.68207 10.6769 3.73837 10.5024 3.75232 10.3222C3.76628 10.1419 3.7375 9.96082 3.66831 9.79375C3.59913 9.62667 3.49151 9.47828 3.35418 9.36063C3.21686 9.24298 3.05371 9.1594 2.878 9.11667C1.70733 8.83267 1.70733 7.16733 2.878 6.88333C3.05387 6.84072 3.21719 6.75719 3.35467 6.63953C3.49215 6.52187 3.5999 6.37341 3.66916 6.20623C3.73843 6.03906 3.76723 5.85789 3.75325 5.67748C3.73926 5.49706 3.68287 5.3225 3.58867 5.168C2.962 4.13933 4.13933 2.96133 5.16867 3.588C5.83533 3.99333 6.69933 3.63467 6.88333 2.878Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6 8C6 8.53043 6.21071 9.03914 6.58579 9.41421C6.96086 9.78929 7.46957 10 8 10C8.53043 10 9.03914 9.78929 9.41421 9.41421C9.78929 9.03914 10 8.53043 10 8C10 7.46957 9.78929 6.96086 9.41421 6.58579C9.03914 6.21071 8.53043 6 8 6C7.46957 6 6.96086 6.21071 6.58579 6.58579C6.21071 6.96086 6 7.46957 6 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconSetting.displayName = "IconSetting";
const IconShelved2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3333 10.6667L10.6667 13.3333M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M10.6667 10.6667L13.3333 13.3333M4.66666 8L8 11.3333L7 12.3333C6.78244 12.5581 6.52234 12.7373 6.23483 12.8605C5.94733 12.9837 5.63818 13.0484 5.3254 13.051C5.01262 13.0535 4.70247 12.9938 4.413 12.8753C4.12354 12.7567 3.86056 12.5818 3.63938 12.3606C3.4182 12.1394 3.24326 11.8765 3.12473 11.587C3.00621 11.2975 2.94647 10.9874 2.94901 10.6746C2.95155 10.3618 3.01631 10.0527 3.13952 9.76516C3.26273 9.47766 3.44193 9.21756 3.66666 9L4.66666 8ZM11.3333 8L8 4.66666L9 3.66666C9.21756 3.44193 9.47766 3.26273 9.76516 3.13952C10.0527 3.01631 10.3618 2.95155 10.6746 2.94901C10.9874 2.94647 11.2975 3.00621 11.587 3.12473C11.8765 3.24326 12.1394 3.4182 12.3606 3.63938C12.5818 3.86056 12.7567 4.12354 12.8753 4.413C12.9938 4.70247 13.0535 5.01262 13.051 5.3254C13.0484 5.63818 12.9837 5.94733 12.8605 6.23483C12.7373 6.52234 12.5581 6.78244 12.3333 7L11.3333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconShelved2.displayName = "IconShelved2";
const IconShow = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6.66667 8C6.66667 8.35362 6.80714 8.69276 7.05719 8.94281C7.30724 9.19286 7.64638 9.33333 8 9.33333C8.35362 9.33333 8.69276 9.19286 8.94281 8.94281C9.19286 8.69276 9.33333 8.35362 9.33333 8C9.33333 7.64638 9.19286 7.30724 8.94281 7.05719C8.69276 6.80714 8.35362 6.66667 8 6.66667C7.64638 6.66667 7.30724 6.80714 7.05719 7.05719C6.80714 7.30724 6.66667 7.64638 6.66667 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M14 8C12.4 10.6667 10.4 12 8 12C5.6 12 3.6 10.6667 2 8C3.6 5.33333 5.6 4 8 4C10.4 4 12.4 5.33333 14 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconShow.displayName = "IconShow";
const IconSidebar = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 4V12M3 5.25C3 4.91848 3.1317 4.60054 3.36612 4.36612C3.60054 4.1317 3.91848 4 4.25 4H11.75C12.0815 4 12.3995 4.1317 12.6339 4.36612C12.8683 4.60054 13 4.91848 13 5.25V10.75C13 11.0815 12.8683 11.3995 12.6339 11.6339C12.3995 11.8683 12.0815 12 11.75 12H4.25C3.91848 12 3.60054 11.8683 3.36612 11.6339C3.1317 11.3995 3 11.0815 3 10.75V5.25Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSidebar.displayName = "IconSidebar";
const IconSnapshot = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3.33333 4.66666H4C4.35362 4.66666 4.69276 4.52619 4.94281 4.27614C5.19286 4.02609 5.33333 3.68695 5.33333 3.33333C5.33333 3.15652 5.40357 2.98695 5.5286 2.86193C5.65362 2.7369 5.82319 2.66666 6 2.66666H10C10.1768 2.66666 10.3464 2.7369 10.4714 2.86193C10.5964 2.98695 10.6667 3.15652 10.6667 3.33333C10.6667 3.68695 10.8071 4.02609 11.0572 4.27614C11.3072 4.52619 11.6464 4.66666 12 4.66666H12.6667C13.0203 4.66666 13.3594 4.80714 13.6095 5.05719C13.8595 5.30724 14 5.64638 14 6V12C14 12.3536 13.8595 12.6928 13.6095 12.9428C13.3594 13.1929 13.0203 13.3333 12.6667 13.3333H3.33333C2.97971 13.3333 2.64057 13.1929 2.39052 12.9428C2.14048 12.6928 2 12.3536 2 12V6C2 5.64638 2.14048 5.30724 2.39052 5.05719C2.64057 4.80714 2.97971 4.66666 3.33333 4.66666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6 8.66666C6 9.1971 6.21071 9.70581 6.58579 10.0809C6.96086 10.456 7.46957 10.6667 8 10.6667C8.53043 10.6667 9.03914 10.456 9.41421 10.0809C9.78929 9.70581 10 9.1971 10 8.66666C10 8.13623 9.78929 7.62752 9.41421 7.25245C9.03914 6.87738 8.53043 6.66666 8 6.66666C7.46957 6.66666 6.96086 6.87738 6.58579 7.25245C6.21071 7.62752 6 8.13623 6 8.66666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconSnapshot.displayName = "IconSnapshot";
const IconStop = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx("g", { opacity: "0.2", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.33398 4.66671C3.33398 4.31309 3.47446 3.97395 3.72451 3.7239C3.97456 3.47385 4.3137 3.33337 4.66732 3.33337H11.334C11.6876 3.33337 12.0267 3.47385 12.2768 3.7239C12.5268 3.97395 12.6673 4.31309 12.6673 4.66671V11.3334C12.6673 11.687 12.5268 12.0261 12.2768 12.2762C12.0267 12.5262 11.6876 12.6667 11.334 12.6667H4.66732C4.3137 12.6667 3.97456 12.5262 3.72451 12.2762C3.47446 12.0261 3.33398 11.687 3.33398 11.3334V4.66671Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    );
  }
);
IconStop.displayName = "IconStop";
const IconStorage = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4C2.66602 4.53043 3.22792 5.03914 4.22811 5.41421C5.22831 5.78929 6.58486 6 7.99935 6C9.41384 6 10.7704 5.78929 11.7706 5.41421C12.7708 5.03914 13.3327 4.53043 13.3327 4M2.66602 4C2.66602 3.46957 3.22792 2.96086 4.22811 2.58579C5.22831 2.21071 6.58486 2 7.99935 2C9.41384 2 10.7704 2.21071 11.7706 2.58579C12.7708 2.96086 13.3327 3.46957 13.3327 4M2.66602 4V8M13.3327 4V8M2.66602 8C2.66602 8.53043 3.22792 9.03914 4.22811 9.41421C5.22831 9.78929 6.58486 10 7.99935 10C9.41384 10 10.7704 9.78929 11.7706 9.41421C12.7708 9.03914 13.3327 8.53043 13.3327 8M2.66602 8V12C2.66602 12.5304 3.22792 13.0391 4.22811 13.4142C5.22831 13.7893 6.58486 14 7.99935 14C9.41384 14 10.7704 13.7893 11.7706 13.4142C12.7708 13.0391 13.3327 12.5304 13.3327 12V8",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconStorage.displayName = "IconStorage";
const IconSuspended2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.17162 8H10.8285M3.75741 12.2426C4.31456 12.7998 4.97599 13.2417 5.70395 13.5433C6.4319 13.8448 7.21211 14 8.00005 14C8.78798 14 9.56819 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2427 12.2426C12.7998 11.6855 13.2418 11.0241 13.5433 10.2961C13.8449 9.56815 14 8.78793 14 8C14 7.21207 13.8449 6.43185 13.5433 5.7039C13.2418 4.97595 12.7998 4.31451 12.2427 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56819 2.15519 8.78798 2 8.00005 2C7.21211 2 6.4319 2.15519 5.70395 2.45672C4.97599 2.75825 4.31456 3.20021 3.75741 3.75736C3.20025 4.31451 2.7583 4.97595 2.45677 5.7039C2.15524 6.43185 2.00005 7.21207 2.00005 8C2.00005 8.78793 2.15524 9.56815 2.45677 10.2961C2.7583 11.0241 3.20025 11.6855 3.75741 12.2426Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSuspended2.displayName = "IconSuspended2";
const IconTemplate2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.33268 8.00002H13.3327M9.33268 10.6667H13.3327M9.33268 13.3334H13.3327M2.66602 3.33335C2.66602 3.15654 2.73625 2.98697 2.86128 2.86195C2.9863 2.73693 3.15587 2.66669 3.33268 2.66669H12.666C12.8428 2.66669 13.0124 2.73693 13.1374 2.86195C13.2624 2.98697 13.3327 3.15654 13.3327 3.33335V4.66669C13.3327 4.8435 13.2624 5.01307 13.1374 5.13809C13.0124 5.26312 12.8428 5.33335 12.666 5.33335H3.33268C3.15587 5.33335 2.9863 5.26312 2.86128 5.13809C2.73625 5.01307 2.66602 4.8435 2.66602 4.66669V3.33335ZM2.66602 8.66669C2.66602 8.48988 2.73625 8.32031 2.86128 8.19528C2.9863 8.07026 3.15587 8.00002 3.33268 8.00002H5.99935C6.17616 8.00002 6.34573 8.07026 6.47075 8.19528C6.59578 8.32031 6.66602 8.48988 6.66602 8.66669V12.6667C6.66602 12.8435 6.59578 13.0131 6.47075 13.1381C6.34573 13.2631 6.17616 13.3334 5.99935 13.3334H3.33268C3.15587 13.3334 2.9863 13.2631 2.86128 13.1381C2.73625 13.0131 2.66602 12.8435 2.66602 12.6667V8.66669Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconTemplate2.displayName = "IconTemplate";
const IconTopology = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.00065 8C4.00065 7.64638 3.86018 7.30724 3.61013 7.05719C3.36008 6.80714 3.02094 6.66667 2.66732 6.66667C2.3137 6.66667 1.97456 6.80714 1.72451 7.05719C1.47446 7.30724 1.33398 7.64638 1.33398 8C1.33398 8.35362 1.47446 8.69276 1.72451 8.94281C1.97456 9.19286 2.3137 9.33333 2.66732 9.33333C3.02094 9.33333 3.36008 9.19286 3.61013 8.94281C3.86018 8.69276 4.00065 8.35362 4.00065 8ZM4.00065 8H6.66732M9.33398 8C9.33398 7.64638 9.19351 7.30724 8.94346 7.05719C8.69341 6.80714 8.35427 6.66667 8.00065 6.66667C7.64703 6.66667 7.30789 6.80714 7.05784 7.05719C6.80779 7.30724 6.66732 7.64638 6.66732 8M9.33398 8C9.33398 8.35362 9.19351 8.69276 8.94346 8.94281C8.69341 9.19286 8.35427 9.33333 8.00065 9.33333C7.64703 9.33333 7.30789 9.19286 7.05784 8.94281C6.80779 8.69276 6.66732 8.35362 6.66732 8M9.33398 8H12.0007M12.0007 8C12.0007 7.64638 12.1411 7.30724 12.3912 7.05719C12.6412 6.80714 12.9804 6.66667 13.334 6.66667C13.6876 6.66667 14.0267 6.80714 14.2768 7.05719C14.5268 7.30724 14.6673 7.64638 14.6673 8C14.6673 8.35362 14.5268 8.69276 14.2768 8.94281C14.0267 9.19286 13.6876 9.33333 13.334 9.33333C12.9804 9.33333 12.6412 9.19286 12.3912 8.94281C12.1411 8.69276 12.0007 8.35362 12.0007 8ZM10.0007 4.66667L8.66732 6.66667M6.00065 4.66667L7.33398 6.66667M7.33398 9.33333L6.00065 11.3333M8.66732 9.33333L10.0007 11.3333M6.66732 12.6667C6.66732 12.313 6.52684 11.9739 6.27679 11.7239C6.02674 11.4738 5.68761 11.3333 5.33398 11.3333C4.98036 11.3333 4.64122 11.4738 4.39118 11.7239C4.14113 11.9739 4.00065 12.313 4.00065 12.6667C4.00065 13.0203 4.14113 13.3594 4.39118 13.6095C4.64122 13.8595 4.98036 14 5.33398 14C5.68761 14 6.02674 13.8595 6.27679 13.6095C6.52684 13.3594 6.66732 13.0203 6.66732 12.6667ZM12.0007 3.33333C12.0007 2.97971 11.8602 2.64057 11.6101 2.39052C11.3601 2.14048 11.0209 2 10.6673 2C10.3137 2 9.97456 2.14048 9.72451 2.39052C9.47446 2.64057 9.33398 2.97971 9.33398 3.33333C9.33398 3.68696 9.47446 4.02609 9.72451 4.27614C9.97456 4.52619 10.3137 4.66667 10.6673 4.66667C11.0209 4.66667 11.3601 4.52619 11.6101 4.27614C11.8602 4.02609 12.0007 3.68696 12.0007 3.33333ZM6.66732 3.33333C6.66732 2.97971 6.52684 2.64057 6.27679 2.39052C6.02674 2.14048 5.68761 2 5.33398 2C4.98036 2 4.64122 2.14048 4.39118 2.39052C4.14113 2.64057 4.00065 2.97971 4.00065 3.33333C4.00065 3.68696 4.14113 4.02609 4.39118 4.27614C4.64122 4.52619 4.98036 4.66667 5.33398 4.66667C5.68761 4.66667 6.02674 4.52619 6.27679 4.27614C6.52684 4.02609 6.66732 3.68696 6.66732 3.33333ZM12.0007 12.6667C12.0007 12.313 11.8602 11.9739 11.6101 11.7239C11.3601 11.4738 11.0209 11.3333 10.6673 11.3333C10.3137 11.3333 9.97456 11.4738 9.72451 11.7239C9.47446 11.9739 9.33398 12.313 9.33398 12.6667C9.33398 13.0203 9.47446 13.3594 9.72451 13.6095C9.97456 13.8595 10.3137 14 10.6673 14C11.0209 14 11.3601 13.8595 11.6101 13.6095C11.8602 13.3594 12.0007 13.0203 12.0007 12.6667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconTopology.displayName = "IconTopology";
const IconUpload2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 11.3333V12.6666C2.66602 13.0202 2.80649 13.3594 3.05654 13.6094C3.30659 13.8595 3.64573 14 3.99935 14H11.9993C12.353 14 12.6921 13.8595 12.9422 13.6094C13.1922 13.3594 13.3327 13.0202 13.3327 12.6666V11.3333M4.66602 5.99996L7.99935 2.66663M7.99935 2.66663L11.3327 5.99996M7.99935 2.66663V10.6666",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconUpload2.displayName = "IconUpload";
const IconVerify2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.7066 2.46029C4.97865 2.76161 4.31717 3.20335 3.75993 3.76029M2.46 5.70638C2.1577 6.43325 2.0014 7.21249 2 7.99971M2.45996 10.2936C2.76129 11.0216 3.20302 11.683 3.75996 12.2403M5.70671 13.5397C6.43357 13.842 7.21282 13.9983 8.00004 13.9997M10.2933 13.5402C11.0212 13.2389 11.6827 12.7972 12.24 12.2402M13.54 10.2933C13.8423 9.56647 13.9986 8.78722 14 8M13.5401 5.70643C13.2387 4.97849 12.797 4.31701 12.2401 3.75977M10.2933 2.46C9.56647 2.1577 8.78722 2.0014 8 2M6 8L7.33333 9.33333L10 6.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconVerify2.displayName = "IconVerify2";
const IconVolumeSearch2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M14 14L12.6667 12.6667M10 11.5556C10 11.7598 10.0402 11.9621 10.1184 12.1508C10.1966 12.3396 10.3112 12.5111 10.4556 12.6555C10.6001 12.7999 10.7715 12.9145 10.9603 12.9927C11.149 13.0709 11.3513 13.1111 11.5556 13.1111C11.7598 13.1111 11.9621 13.0709 12.1508 12.9927C12.3396 12.9145 12.5111 12.7999 12.6555 12.6555C12.7999 12.5111 12.9145 12.3396 12.9927 12.1508C13.0709 11.9621 13.1111 11.7598 13.1111 11.5556C13.1111 11.3513 13.0709 11.149 12.9927 10.9603C12.9145 10.7715 12.7999 10.6001 12.6555 10.4556C12.5111 10.3112 12.3396 10.1966 12.1508 10.1184C11.9621 10.0402 11.7598 10 11.5556 10C11.3513 10 11.149 10.0402 10.9603 10.1184C10.7715 10.1966 10.6001 10.3112 10.4556 10.4556C10.3112 10.6001 10.1966 10.7715 10.1184 10.9603C10.0402 11.149 10 11.3513 10 11.5556Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconVolumeSearch2.displayName = "IconVolumeSearch2";
const IconVolumeType2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M12.6667 14C12.313 14 11.9739 13.8595 11.7239 13.6095C11.4738 13.3594 11.3333 13.0203 11.3333 12.6667C11.3333 12.313 11.4738 11.9739 11.7239 11.7239C11.9739 11.4738 12.313 11.3333 12.6667 11.3333M12.6667 14C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667C14 12.313 13.8595 11.9739 13.6095 11.7239C13.3594 11.4738 13.0203 11.3333 12.6667 11.3333M12.6667 14V15M12.6667 11.3333V10.3333M14.6873 11.5L13.8213 12M11.5127 13.3333L10.646 13.8333M10.646 11.5L11.5127 12M13.8213 13.3333L14.688 13.8333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconVolumeType2.displayName = "IconVolumeType2";
const IconWarning2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 5.33333V8M8 10.6667H8.00667M13.25 4.17972C13.7167 4.44505 14.0033 4.94172 14 5.47839V10.3344C14 10.8737 13.7047 11.3711 13.228 11.6331L8.728 14.4797C8.5049 14.6022 8.25451 14.6664 8 14.6664C7.74549 14.6664 7.4951 14.6022 7.272 14.4797L2.772 11.6331C2.53878 11.5056 2.34408 11.3178 2.20827 11.0894C2.07247 10.8609 2.00053 10.6002 2 10.3344V5.47772C2 4.93839 2.29533 4.44172 2.772 4.17972L7.272 1.52639C7.50169 1.39975 7.75971 1.33333 8.022 1.33333C8.28429 1.33333 8.54231 1.39975 8.772 1.52639L13.272 4.17972H13.25Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconWarning2.displayName = "IconWarning2";
const IconActivity2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13 8H11L9.5 12.5L6.5 3.5L5 8H3",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconActivity2.displayName = "IconActivity";
const IconAdd = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 8H10M8 6V10M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAdd.displayName = "IconAdd";
const IconAdjustmentsAlt = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.99935 2.66699V5.33366M3.99935 5.33366C4.73573 5.33366 5.33268 5.93061 5.33268 6.66699C5.33268 7.40337 4.73573 8.00033 3.99935 8.00033M3.99935 5.33366C3.26297 5.33366 2.66602 5.93061 2.66602 6.66699C2.66602 7.40337 3.26297 8.00033 3.99935 8.00033M3.99935 8.00033V13.3337M7.99935 2.66699V9.33366M7.99935 9.33366C8.73573 9.33366 9.33268 9.93061 9.33268 10.667C9.33268 11.4034 8.73573 12.0003 7.99935 12.0003M7.99935 9.33366C7.26297 9.33366 6.66602 9.93061 6.66602 10.667C6.66602 11.4034 7.26297 12.0003 7.99935 12.0003M7.99935 12.0003V13.3337M11.9993 2.66699V3.33366M11.9993 3.33366C12.7357 3.33366 13.3327 3.93061 13.3327 4.66699C13.3327 5.40337 12.7357 6.00033 11.9993 6.00033M11.9993 3.33366C11.263 3.33366 10.666 3.93061 10.666 4.66699C10.666 5.40337 11.263 6.00033 11.9993 6.00033M11.9993 6.00033V13.3337",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAdjustmentsAlt.displayName = "IconAdjustmentsAlt";
const IconAffiliate2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.95378 4.45736L4.80378 7.29002M8.54178 11.0294L11.3758 11.8794M7.78841 8.04474L11.6277 4.2054M2.66602 3.5C2.66602 3.63132 2.69188 3.76136 2.74214 3.88268C2.79239 4.00401 2.86605 4.11425 2.95891 4.20711C3.05177 4.29997 3.16201 4.37362 3.28333 4.42388C3.40466 4.47413 3.53469 4.5 3.66602 4.5C3.79734 4.5 3.92737 4.47413 4.0487 4.42388C4.17002 4.37362 4.28026 4.29997 4.37312 4.20711C4.46598 4.11425 4.53964 4.00401 4.5899 3.88268C4.64015 3.76136 4.66602 3.63132 4.66602 3.5C4.66602 3.36868 4.64015 3.23864 4.5899 3.11732C4.53964 2.99599 4.46598 2.88575 4.37312 2.79289C4.28026 2.70003 4.17002 2.62638 4.0487 2.57612C3.92737 2.52587 3.79734 2.5 3.66602 2.5C3.53469 2.5 3.40466 2.52587 3.28333 2.57612C3.16201 2.62638 3.05177 2.70003 2.95891 2.79289C2.86605 2.88575 2.79239 2.99599 2.74214 3.11732C2.69188 3.23864 2.66602 3.36868 2.66602 3.5ZM11.3327 3.5C11.3327 3.76522 11.438 4.01957 11.6256 4.20711C11.8131 4.39464 12.0675 4.5 12.3327 4.5C12.5979 4.5 12.8523 4.39464 13.0398 4.20711C13.2273 4.01957 13.3327 3.76522 13.3327 3.5C13.3327 3.23478 13.2273 2.98043 13.0398 2.79289C12.8523 2.60536 12.5979 2.5 12.3327 2.5C12.0675 2.5 11.8131 2.60536 11.6256 2.79289C11.438 2.98043 11.3327 3.23478 11.3327 3.5ZM11.3327 12.1667C11.3327 12.4319 11.438 12.6862 11.6256 12.8738C11.8131 13.0613 12.0675 13.1667 12.3327 13.1667C12.5979 13.1667 12.8523 13.0613 13.0398 12.8738C13.2273 12.6862 13.3327 12.4319 13.3327 12.1667C13.3327 11.9015 13.2273 11.6471 13.0398 11.4596C12.8523 11.272 12.5979 11.1667 12.3327 11.1667C12.0675 11.1667 11.8131 11.272 11.6256 11.4596C11.438 11.6471 11.3327 11.9015 11.3327 12.1667ZM2.66602 10.1667C2.66602 10.9623 2.98209 11.7254 3.5447 12.288C4.1073 12.8506 4.87037 13.1667 5.66602 13.1667C6.46167 13.1667 7.22473 12.8506 7.78734 12.288C8.34994 11.7254 8.66602 10.9623 8.66602 10.1667C8.66602 9.37102 8.34994 8.60796 7.78734 8.04535C7.22473 7.48274 6.46167 7.16667 5.66602 7.16667C4.87037 7.16667 4.1073 7.48274 3.5447 8.04535C2.98209 8.60796 2.66602 9.37102 2.66602 10.1667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconAffiliate2.displayName = "IconAffiliate2";
const IconArticleHistory = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.22222 5.5H10.7778M5.22222 8H10.7778M5.22222 10.5H10.7778M3 4.25C3 3.91848 3.11706 3.60054 3.32544 3.36612C3.53381 3.1317 3.81643 3 4.11111 3H11.8889C12.1836 3 12.4662 3.1317 12.6746 3.36612C12.8829 3.60054 13 3.91848 13 4.25V11.75C13 12.0815 12.8829 12.3995 12.6746 12.6339C12.4662 12.8683 12.1836 13 11.8889 13H4.11111C3.81643 13 3.53381 12.8683 3.32544 12.6339C3.11706 12.3995 3 12.0815 3 11.75V4.25Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconArticleHistory.displayName = "IconArticleHistory";
const IconBrain2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.3333 8.66667C9.7145 8.66667 9.121 8.9125 8.68342 9.35008C8.24583 9.78767 8 10.3812 8 11M8 11V11.6667M8 11C8 10.3812 7.75417 9.78767 7.31658 9.35008C6.879 8.9125 6.28551 8.66667 5.66667 8.66667M8 11V4.33333M8 11.6667C8 12.2855 8.24583 12.879 8.68342 13.3166C9.121 13.7542 9.7145 14 10.3333 14C10.9522 14 11.5457 13.7542 11.9832 13.3166C12.4208 12.879 12.6667 12.2855 12.6667 11.6667V10.4667M8 11.6667C8 12.2855 7.75417 12.879 7.31658 13.3166C6.879 13.7542 6.28551 14 5.66667 14C5.04783 14 4.45434 13.7542 4.01675 13.3166C3.57917 12.879 3.33333 12.2855 3.33333 11.6667V10.4667M11.6667 10.6667C12.2855 10.6667 12.879 10.4208 13.3166 9.98325C13.7542 9.54566 14 8.95217 14 8.33333C14 7.7145 13.7542 7.121 13.3166 6.68342C12.879 6.24583 12.2855 6 11.6667 6H11.3333M12.6667 6.2V4.33333C12.6667 3.71449 12.4208 3.121 11.9832 2.68342C11.5457 2.24583 10.9522 2 10.3333 2C9.7145 2 9.121 2.24583 8.68342 2.68342C8.24583 3.121 8 3.71449 8 4.33333M8 4.33333C8 3.71449 7.75417 3.121 7.31658 2.68342C6.879 2.24583 6.28551 2 5.66667 2C5.04783 2 4.45434 2.24583 4.01675 2.68342C3.57917 3.121 3.33333 3.71449 3.33333 4.33333V6.2M4.33333 10.6667C3.71449 10.6667 3.121 10.4208 2.68342 9.98325C2.24583 9.54566 2 8.95217 2 8.33333C2 7.7145 2.24583 7.121 2.68342 6.68342C3.121 6.24583 3.71449 6 4.33333 6H4.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconBrain2.displayName = "IconBrain";
const IconBranch = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6.00065 11.9998C6.00065 12.3535 5.86018 12.6926 5.61013 12.9426C5.36008 13.1927 5.02094 13.3332 4.66732 13.3332C4.3137 13.3332 3.97456 13.1927 3.72451 12.9426C3.47446 12.6926 3.33398 12.3535 3.33398 11.9998C3.33398 11.6462 3.47446 11.3071 3.72451 11.057C3.97456 10.807 4.3137 10.6665 4.66732 10.6665M6.00065 11.9998C6.00065 11.6462 5.86018 11.3071 5.61013 11.057C5.36008 10.807 5.02094 10.6665 4.66732 10.6665M6.00065 11.9998H10.0007C10.3543 11.9998 10.6934 11.8594 10.9435 11.6093C11.1935 11.3593 11.334 11.0201 11.334 10.6665V7.33317M4.66732 10.6665V5.33317M4.66732 5.33317C4.3137 5.33317 3.97456 5.19269 3.72451 4.94265C3.47446 4.6926 3.33398 4.35346 3.33398 3.99984C3.33398 3.64622 3.47446 3.30708 3.72451 3.05703C3.97456 2.80698 4.3137 2.6665 4.66732 2.6665C5.02094 2.6665 5.36008 2.80698 5.61013 3.05703C5.86018 3.30708 6.00065 3.64622 6.00065 3.99984C6.00065 4.35346 5.86018 4.6926 5.61013 4.94265C5.36008 5.19269 5.02094 5.33317 4.66732 5.33317ZM11.334 7.33317L9.33398 9.33317M11.334 7.33317L13.334 9.33317M10.0007 3.99984C10.0007 4.35346 10.1411 4.6926 10.3912 4.94265C10.6412 5.19269 10.9804 5.33317 11.334 5.33317C11.6876 5.33317 12.0267 5.19269 12.2768 4.94265C12.5268 4.6926 12.6673 4.35346 12.6673 3.99984C12.6673 3.64622 12.5268 3.30708 12.2768 3.05703C12.0267 2.80698 11.6876 2.6665 11.334 2.6665C10.9804 2.6665 10.6412 2.80698 10.3912 3.05703C10.1411 3.30708 10.0007 3.64622 10.0007 3.99984Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconBranch.displayName = "IconBranch";
const IconCahatbot = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6.33333 6.33333H6.34M9.66667 6.33333H9.67333M6.33333 9C6.55059 9.22173 6.8099 9.39789 7.09608 9.51814C7.38227 9.6384 7.68957 9.70034 8 9.70034C8.31043 9.70034 8.61773 9.6384 8.90392 9.51814C9.1901 9.39789 9.44941 9.22173 9.66667 9M12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V10.3333C14 10.8638 13.7893 11.3725 13.4142 11.7475C13.0391 12.1226 12.5304 12.3333 12 12.3333H8.66667L5.33333 14.3333V12.3333H4C3.46957 12.3333 2.96086 12.1226 2.58579 11.7475C2.21071 11.3725 2 10.8638 2 10.3333V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H12Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCahatbot.displayName = "IconCahatbot";
const IconCard2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3 4.25C3 3.91848 3.1317 3.60054 3.36612 3.36612C3.60054 3.1317 3.91848 3 4.25 3H11.75C12.0815 3 12.3995 3.1317 12.6339 3.36612C12.8683 3.60054 13 3.91848 13 4.25V5.5C13 5.83152 12.8683 6.14946 12.6339 6.38388C12.3995 6.6183 12.0815 6.75 11.75 6.75H4.25C3.91848 6.75 3.60054 6.6183 3.36612 6.38388C3.1317 6.14946 3 5.83152 3 5.5V4.25Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3 10.5C3 10.1685 3.1317 9.85054 3.36612 9.61612C3.60054 9.3817 3.91848 9.25 4.25 9.25H11.75C12.0815 9.25 12.3995 9.3817 12.6339 9.61612C12.8683 9.85054 13 10.1685 13 10.5V11.75C13 12.0815 12.8683 12.3995 12.6339 12.6339C12.3995 12.8683 12.0815 13 11.75 13H4.25C3.91848 13 3.60054 12.8683 3.36612 12.6339C3.1317 12.3995 3 12.0815 3 11.75V10.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconCard2.displayName = "IconCard2";
const IconCategory2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33268 2.66699H13.3327V6.66699H9.33268V2.66699Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66602 9.33366H6.66602V13.3337H2.66602V9.33366Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33268 11.3337C9.33268 11.8641 9.5434 12.3728 9.91847 12.7479C10.2935 13.1229 10.8022 13.3337 11.3327 13.3337C11.8631 13.3337 12.3718 13.1229 12.7469 12.7479C13.122 12.3728 13.3327 11.8641 13.3327 11.3337C13.3327 10.8032 13.122 10.2945 12.7469 9.91945C12.3718 9.54437 11.8631 9.33366 11.3327 9.33366C10.8022 9.33366 10.2935 9.54437 9.91847 9.91945C9.5434 10.2945 9.33268 10.8032 9.33268 11.3337Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66602 4.66699C2.66602 4.92964 2.71775 5.18971 2.81826 5.43236C2.91877 5.67501 3.06608 5.89549 3.2518 6.08121C3.43752 6.26692 3.658 6.41424 3.90065 6.51475C4.1433 6.61526 4.40337 6.66699 4.66602 6.66699C4.92866 6.66699 5.18873 6.61526 5.43138 6.51475C5.67403 6.41424 5.89451 6.26692 6.08023 6.08121C6.26595 5.89549 6.41327 5.67501 6.51377 5.43236C6.61428 5.18971 6.66602 4.92964 6.66602 4.66699C6.66602 4.40435 6.61428 4.14428 6.51377 3.90163C6.41327 3.65897 6.26595 3.4385 6.08023 3.25278C5.89451 3.06706 5.67403 2.91974 5.43138 2.81923C5.18873 2.71872 4.92866 2.66699 4.66602 2.66699C4.40337 2.66699 4.1433 2.71872 3.90065 2.81923C3.658 2.91974 3.43752 3.06706 3.2518 3.25278C3.06608 3.4385 2.91877 3.65897 2.81826 3.90163C2.71775 4.14428 2.66602 4.40435 2.66602 4.66699Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconCategory2.displayName = "IconCategory";
const IconChat = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.33333 10V11.3333C9.33333 11.5101 9.2631 11.6797 9.13807 11.8047C9.01305 11.9298 8.84348 12 8.66667 12H4L2 14V7.33333C2 7.15652 2.07024 6.98695 2.19526 6.86193C2.32029 6.7369 2.48986 6.66667 2.66667 6.66667H4M14 9.33333L12 7.33333H7.33333C7.15652 7.33333 6.98695 7.2631 6.86193 7.13807C6.7369 7.01305 6.66667 6.84348 6.66667 6.66667V2.66667C6.66667 2.48986 6.7369 2.32029 6.86193 2.19526C6.98695 2.07024 7.15652 2 7.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V9.33333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconChat.displayName = "IconChat";
const IconCheck2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 7.33334L8 9.33334L13.3333 4.00001M13.3333 8.00001V12C13.3333 12.3536 13.1929 12.6928 12.9428 12.9428C12.6928 13.1929 12.3536 13.3333 12 13.3333H4C3.64638 13.3333 3.30724 13.1929 3.05719 12.9428C2.80714 12.6928 2.66666 12.3536 2.66666 12V4.00001C2.66666 3.64638 2.80714 3.30724 3.05719 3.0572C3.30724 2.80715 3.64638 2.66667 4 2.66667H10",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCheck2.displayName = "IconCheck2";
const IconCloudComputing = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.43865 10.6666C2.72398 10.6666 1.33398 9.32859 1.33398 7.67792C1.33398 6.02792 2.72398 4.68992 4.43865 4.68992C4.70065 3.51526 5.63465 2.55659 6.88865 2.17459C8.14198 1.79326 9.52598 2.04592 10.518 2.84126C11.51 3.63459 11.9593 4.84592 11.698 6.02059H12.358C13.6333 6.02059 14.6673 7.06059 14.6673 8.34459C14.6673 9.62926 13.6333 10.6693 12.3573 10.6693H4.43865M8.00065 10.6667V14M10.6673 10.6667V13.3333C10.6673 13.5101 10.7376 13.6797 10.8626 13.8047C10.9876 13.9298 11.1572 14 11.334 14H14.0007M5.33398 10.6667V13.3333C5.33398 13.5101 5.26375 13.6797 5.13872 13.8047C5.0137 13.9298 4.84413 14 4.66732 14H2.00065",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconCloudComputing.displayName = "IconCloudComputing";
const IconDeviceDesktopAnalytics2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66667 13.3332H11.3333M6 10.6665V13.3332M10 10.6665V13.3332M6 7.99984V5.33317M8 7.99984V7.33317M10 7.99984V6.6665M2 3.33317C2 3.15636 2.07024 2.98679 2.19526 2.86177C2.32029 2.73674 2.48986 2.6665 2.66667 2.6665H13.3333C13.5101 2.6665 13.6797 2.73674 13.8047 2.86177C13.9298 2.98679 14 3.15636 14 3.33317V9.99984C14 10.1766 13.9298 10.3462 13.8047 10.4712C13.6797 10.5963 13.5101 10.6665 13.3333 10.6665H2.66667C2.48986 10.6665 2.32029 10.5963 2.19526 10.4712C2.07024 10.3462 2 10.1766 2 9.99984V3.33317Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDeviceDesktopAnalytics2.displayName = "IconDeviceDesktopAnalytics";
const IconDollarSign = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 2.50014V13.5001M10.5 4.49986H6.75C6.28587 4.49986 5.84075 4.68423 5.51256 5.01242C5.18437 5.34061 5 5.78573 5 6.24986C5 6.71399 5.18437 7.15911 5.51256 7.4873C5.84075 7.81548 6.28587 7.99986 6.75 7.99986H9.25C9.71413 7.99986 10.1592 8.18423 10.4874 8.51242C10.8156 8.84061 11 9.28573 11 9.74986C11 10.214 10.8156 10.6591 10.4874 10.9873C10.1592 11.3155 9.71413 11.4999 9.25 11.4999H5",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDollarSign.displayName = "IconDollarSign";
const IconDot = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00067 5.99997C7.47024 5.99997 6.96153 6.21068 6.58646 6.58575C6.21138 6.96083 6.00067 7.46953 6.00067 7.99997C6.00067 8.5304 6.21138 9.03911 6.58646 9.41418C6.96153 9.78925 7.47024 9.99997 8.00067 9.99997C8.5311 9.99997 9.03981 9.78925 9.41489 9.41418C9.78996 9.03911 10.0007 8.5304 10.0007 7.99997C10.0007 7.46953 9.78996 6.96083 9.41489 6.58575C9.03981 6.21068 8.5311 5.99997 8.00067 5.99997Z",
            fill: color,
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconDot.displayName = "IconDot";
const IconFinetuning2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 0.89458, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.06944 12.2683C7.30611 13.2439 8.69389 13.2439 8.93055 12.2683C8.96616 12.1219 9.03582 11.986 9.13386 11.8715C9.2319 11.7571 9.35556 11.6674 9.49479 11.6097C9.63402 11.5521 9.78488 11.5281 9.93513 11.5397C10.0854 11.5514 10.2307 11.5983 10.3594 11.6767C11.2172 12.1989 12.1983 11.2172 11.6761 10.36C11.5976 10.2312 11.5506 10.0858 11.539 9.93544C11.5273 9.78509 11.5513 9.63412 11.609 9.49481C11.6667 9.35549 11.7565 9.23178 11.8711 9.13373C11.9857 9.03568 12.1218 8.96606 12.2683 8.93055C13.2439 8.69389 13.2439 7.30611 12.2683 7.06944C12.1219 7.03384 11.986 6.96418 11.8715 6.86614C11.7571 6.7681 11.6674 6.64444 11.6097 6.50521C11.5521 6.36598 11.5281 6.21512 11.5397 6.06487C11.5514 5.91463 11.5983 5.76925 11.6767 5.64056C12.1989 4.78278 11.2172 3.80167 10.36 4.32389C10.2312 4.40239 10.0858 4.44938 9.93544 4.46104C9.78509 4.47269 9.63412 4.44869 9.49481 4.39097C9.35549 4.33325 9.23178 4.24346 9.13373 4.12889C9.03568 4.01432 8.96606 3.87822 8.93055 3.73167C8.69389 2.75611 7.30611 2.75611 7.06944 3.73167C6.91611 4.36222 6.19611 4.66111 5.64056 4.32333C4.78278 3.80111 3.80167 4.78278 4.32389 5.64C4.40239 5.76875 4.44938 5.91422 4.46104 6.06456C4.47269 6.21491 4.44869 6.36588 4.39097 6.50519C4.33325 6.64451 4.24346 6.76822 4.12889 6.86627C4.01432 6.96432 3.87822 7.03393 3.73167 7.06944C2.75611 7.30611 2.75611 8.69389 3.73167 8.93055M7.30989 7.58514C7.2424 7.65399 7.2046 7.74656 7.2046 7.84297C7.2046 7.93938 7.2424 8.03194 7.30989 8.10079L7.89921 8.69011C7.96806 8.7576 8.06062 8.7954 8.15703 8.7954C8.25344 8.7954 8.34601 8.7576 8.41486 8.69011L9.80345 7.30153C9.98865 7.71081 10.0447 8.16681 9.9642 8.60877C9.88368 9.05072 9.67038 9.45765 9.35272 9.7753C9.03506 10.093 8.62814 10.3063 8.18619 10.3868C7.74423 10.4673 7.28823 10.4112 6.87895 10.226L4.33382 12.7712C4.18729 12.9177 3.98856 13 3.78133 13C3.57411 13 3.37538 12.9177 3.22885 12.7712C3.08232 12.6246 3 12.4259 3 12.2187C3 12.0114 3.08232 11.8127 3.22885 11.6662L5.77397 9.12105C5.58877 8.71177 5.53269 8.25577 5.61321 7.81381C5.69374 7.37186 5.90704 6.96494 6.2247 6.64728C6.54236 6.32962 6.94928 6.11632 7.39123 6.0358C7.83319 5.95527 8.28919 6.01135 8.69847 6.19655L7.30989 7.58514Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconFinetuning2.displayName = "IconFinetuning2";
const IconHourglassHigh = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.33333 4.50016H11.6667M8 7.8335C6.93913 7.8335 5.92172 8.25492 5.17157 9.00507C4.42143 9.75521 4 10.7726 4 11.8335V13.1668C4 13.3436 4.07024 13.5132 4.19526 13.6382C4.32029 13.7633 4.48986 13.8335 4.66667 13.8335H11.3333C11.5101 13.8335 11.6797 13.7633 11.8047 13.6382C11.9298 13.5132 12 13.3436 12 13.1668V11.8335C12 10.7726 11.5786 9.75521 10.8284 9.00507C10.0783 8.25492 9.06087 7.8335 8 7.8335ZM8 7.8335C6.93913 7.8335 5.92172 7.41207 5.17157 6.66192C4.42143 5.91178 4 4.89436 4 3.8335V2.50016C4 2.32335 4.07024 2.15378 4.19526 2.02876C4.32029 1.90373 4.48986 1.8335 4.66667 1.8335H11.3333C11.5101 1.8335 11.6797 1.90373 11.8047 2.02876C11.9298 2.15378 12 2.32335 12 2.50016V3.8335C12 4.89436 11.5786 5.91178 10.8284 6.66192C10.0783 7.41207 9.06087 7.8335 8 7.8335Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconHourglassHigh.displayName = "IconHourglassHigh";
const IconLanguage2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.8327 7.99996C13.8327 11.2216 11.221 13.8333 7.99935 13.8333M13.8327 7.99996C13.8327 4.7783 11.221 2.16663 7.99935 2.16663M13.8327 7.99996H2.16602M7.99935 13.8333C4.77769 13.8333 2.16602 11.2216 2.16602 7.99996M7.99935 13.8333C9.45843 12.2359 10.2876 10.1629 10.3327 7.99996C10.2876 5.83698 9.45843 3.764 7.99935 2.16663M7.99935 13.8333C6.54027 12.2359 5.71108 10.1629 5.66602 7.99996C5.71108 5.83698 6.54027 3.764 7.99935 2.16663M2.16602 7.99996C2.16602 4.7783 4.77769 2.16663 7.99935 2.16663",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconLanguage2.displayName = "IconLanguage2";
const IconLink2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.99935 10L9.99935 6.00004M7.33268 3.99992L7.64135 3.64259C8.26655 3.01747 9.11448 2.66632 9.99858 2.66638C10.8827 2.66644 11.7306 3.01772 12.3557 3.64292C12.9808 4.26812 13.3319 5.11605 13.3319 6.00015C13.3318 6.88426 12.9806 7.73214 12.3553 8.35725L11.9993 8.66659M8.66611 12L8.40144 12.356C7.76894 12.9815 6.9153 13.3323 6.02578 13.3323C5.13625 13.3323 4.28261 12.9815 3.65011 12.356C3.33835 12.0478 3.09084 11.6807 2.92192 11.2761C2.753 10.8716 2.66602 10.4375 2.66602 9.99904C2.66602 9.56061 2.753 9.12653 2.92192 8.72195C3.09084 8.31736 3.33835 7.95031 3.65011 7.64204L3.99944 7.33337",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconLink2.displayName = "IconLink";
const IconList2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.66445 4H12.9917M5.66445 7.99667H12.9917M5.66445 11.9933H12.9917M3 4V4.00666M3 7.99667V8.00333M3 11.9933V12",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconList2.displayName = "IconList";
const IconMicrosoft = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsxs("g", { "clip-path": "url(#clip0_442_58)", children: [
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M7.13 2.51501H2.5V7.13501H7.13V2.51501Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M13.5 2.51501H8.87V7.13501H13.5V2.51501Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M7.13 8.86502H2.5V13.485H7.13V8.86502Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M13.5 8.86502H8.87V13.485H13.5V8.86502Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_442_58", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "12",
              height: "11.97",
              fill: "white",
              transform: "translate(2 2.01501)",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconMicrosoft.displayName = "IconMicrosoft";
const IconMoreMeatball = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3.33398 7.33329C3.15717 7.33329 2.9876 7.40353 2.86258 7.52856C2.73755 7.65358 2.66732 7.82315 2.66732 7.99996C2.66732 8.17677 2.73755 8.34634 2.86258 8.47136C2.9876 8.59639 3.15717 8.66663 3.33398 8.66663C3.51079 8.66663 3.68036 8.59639 3.80539 8.47136C3.93041 8.34634 4.00065 8.17677 4.00065 7.99996C4.00065 7.82315 3.93041 7.65358 3.80539 7.52856C3.68036 7.40353 3.51079 7.33329 3.33398 7.33329Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12.6673 7.33329C12.4905 7.33329 12.3209 7.40353 12.1959 7.52856C12.0709 7.65358 12.0007 7.82315 12.0007 7.99996C12.0007 8.17677 12.0709 8.34634 12.1959 8.47136C12.3209 8.59639 12.4905 8.66663 12.6673 8.66663C12.8441 8.66663 13.0137 8.59639 13.1387 8.47136C13.2637 8.34634 13.334 8.17677 13.334 7.99996C13.334 7.82315 13.2637 7.65358 13.1387 7.52856C13.0137 7.40353 12.8441 7.33329 12.6673 7.33329Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3.33398 7.33329C3.15717 7.33329 2.9876 7.40353 2.86258 7.52856C2.73755 7.65358 2.66732 7.82315 2.66732 7.99996C2.66732 8.17677 2.73755 8.34634 2.86258 8.47136C2.9876 8.59639 3.15717 8.66663 3.33398 8.66663C3.51079 8.66663 3.68036 8.59639 3.80539 8.47136C3.93041 8.34634 4.00065 8.17677 4.00065 7.99996C4.00065 7.82315 3.93041 7.65358 3.80539 7.52856C3.68036 7.40353 3.51079 7.33329 3.33398 7.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12.6673 7.33329C12.4905 7.33329 12.3209 7.40353 12.1959 7.52856C12.0709 7.65358 12.0007 7.82315 12.0007 7.99996C12.0007 8.17677 12.0709 8.34634 12.1959 8.47136C12.3209 8.59639 12.4905 8.66663 12.6673 8.66663C12.8441 8.66663 13.0137 8.59639 13.1387 8.47136C13.2637 8.34634 13.334 8.17677 13.334 7.99996C13.334 7.82315 13.2637 7.65358 13.1387 7.52856C13.0137 7.40353 12.8441 7.33329 12.6673 7.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconMoreMeatball.displayName = "IconMoreMeatball";
const IconNewchat2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 4.4V6.4M8 6.4V8.4M8 6.4H6M8 6.4H10M14 13L10.7273 10.7273H3.09091C2.80158 10.7273 2.5241 10.6123 2.31952 10.4078C2.11493 10.2032 2 9.92569 2 9.63636V3.09091C2 2.80158 2.11493 2.5241 2.31952 2.31952C2.5241 2.11493 2.80158 2 3.09091 2H12.9091C13.1984 2 13.4759 2.11493 13.6805 2.31952C13.8851 2.5241 14 2.80158 14 3.09091V13Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconNewchat2.displayName = "IconNewchat2";
const IconOther = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66667 8C2.66667 8.17681 2.73691 8.34638 2.86193 8.4714C2.98696 8.59643 3.15653 8.66667 3.33334 8.66667C3.51015 8.66667 3.67972 8.59643 3.80474 8.4714C3.92977 8.34638 4.00001 8.17681 4.00001 8C4.00001 7.82319 3.92977 7.65362 3.80474 7.52859C3.67972 7.40357 3.51015 7.33333 3.33334 7.33333C3.15653 7.33333 2.98696 7.40357 2.86193 7.52859C2.73691 7.65362 2.66667 7.82319 2.66667 8Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33334 8C7.33334 8.17681 7.40358 8.34638 7.5286 8.4714C7.65363 8.59643 7.82319 8.66667 8.00001 8.66667C8.17682 8.66667 8.34639 8.59643 8.47141 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.47141 7.52859C8.34639 7.40357 8.17682 7.33333 8.00001 7.33333C7.82319 7.33333 7.65363 7.40357 7.5286 7.52859C7.40358 7.65362 7.33334 7.82319 7.33334 8Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 8C12 8.17681 12.0702 8.34638 12.1953 8.4714C12.3203 8.59643 12.4899 8.66667 12.6667 8.66667C12.8435 8.66667 13.0131 8.59643 13.1381 8.4714C13.2631 8.34638 13.3333 8.17681 13.3333 8C13.3333 7.82319 13.2631 7.65362 13.1381 7.52859C13.0131 7.40357 12.8435 7.33333 12.6667 7.33333C12.4899 7.33333 12.3203 7.40357 12.1953 7.52859C12.0702 7.65362 12 7.82319 12 8Z",
              fill: color,
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66667 8C2.66667 8.17681 2.73691 8.34638 2.86193 8.4714C2.98696 8.59643 3.15653 8.66667 3.33334 8.66667C3.51015 8.66667 3.67972 8.59643 3.80474 8.4714C3.92977 8.34638 4.00001 8.17681 4.00001 8C4.00001 7.82319 3.92977 7.65362 3.80474 7.52859C3.67972 7.40357 3.51015 7.33333 3.33334 7.33333C3.15653 7.33333 2.98696 7.40357 2.86193 7.52859C2.73691 7.65362 2.66667 7.82319 2.66667 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33334 8C7.33334 8.17681 7.40358 8.34638 7.5286 8.4714C7.65363 8.59643 7.82319 8.66667 8.00001 8.66667C8.17682 8.66667 8.34639 8.59643 8.47141 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.47141 7.52859C8.34639 7.40357 8.17682 7.33333 8.00001 7.33333C7.82319 7.33333 7.65363 7.40357 7.5286 7.52859C7.40358 7.65362 7.33334 7.82319 7.33334 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 8C12 8.17681 12.0702 8.34638 12.1953 8.4714C12.3203 8.59643 12.4899 8.66667 12.6667 8.66667C12.8435 8.66667 13.0131 8.59643 13.1381 8.4714C13.2631 8.34638 13.3333 8.17681 13.3333 8C13.3333 7.82319 13.2631 7.65362 13.1381 7.52859C13.0131 7.40357 12.8435 7.33333 12.6667 7.33333C12.4899 7.33333 12.3203 7.40357 12.1953 7.52859C12.0702 7.65362 12 7.82319 12 8Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
);
IconOther.displayName = "IconOther";
const IconPending2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.70737 2.43629C7.19023 1.83917 8.84957 1.85556 10.3203 2.48187C11.7911 3.10818 12.9528 4.2931 13.55 5.77597C14.1471 7.25883 14.1307 8.91817 13.5044 10.3889C12.8781 11.8597 11.6932 13.0214 10.2103 13.6186M10.2103 10.2789V14.0313H13.9627M3.17814 4.39507V4.40257M2 7.27694V7.28445M2.42765 10.3539V10.3615M4.32659 12.808V12.8155M7.20835 13.9863V13.9938",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPending2.displayName = "IconPending2";
const IconProgress3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx("g", { opacity: "0.2", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6.584 13.7026C6.00374 13.571 5.44645 13.3533 4.93066 13.0566M9.25065 2C10.5761 2.30271 11.7595 3.04646 12.6071 4.10947C13.4547 5.17248 13.9163 6.49177 13.9163 7.85133C13.9163 9.2109 13.4547 10.5302 12.6071 11.5932C11.7595 12.6562 10.5761 13.4 9.25065 13.7027M2.97002 11.2466C2.60635 10.7183 2.33015 10.1348 2.15202 9.51864M2 6.85133C2.10667 6.218 2.312 5.618 2.6 5.068L2.71267 4.86466M4.52197 2.904C5.14574 2.4746 5.84552 2.16781 6.58397 2",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    );
  }
);
IconProgress3.displayName = "IconProgress";
const IconPuzzle2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.12222 4.1389H5.13889C5.31717 4.1389 5.48816 4.06808 5.61422 3.94201C5.74029 3.81595 5.81111 3.64496 5.81111 3.46668V2.79446C5.81111 2.43789 5.95276 2.09592 6.20489 1.84379C6.45702 1.59166 6.79899 1.45001 7.15556 1.45001C7.51212 1.45001 7.85409 1.59166 8.10622 1.84379C8.35835 2.09592 8.5 2.43789 8.5 2.79446V3.46668C8.5 3.64496 8.57082 3.81595 8.69689 3.94201C8.82296 4.06808 8.99394 4.1389 9.17222 4.1389H11.1889C11.3672 4.1389 11.5382 4.20972 11.6642 4.33579C11.7903 4.46186 11.8611 4.63284 11.8611 4.81112V6.82779C11.8611 7.00607 11.9319 7.17706 12.058 7.30312C12.1841 7.42919 12.355 7.50001 12.5333 7.50001H13.2056C13.5621 7.50001 13.9041 7.64166 14.1562 7.89379C14.4084 8.14592 14.55 8.48789 14.55 8.84446C14.55 9.20103 14.4084 9.54299 14.1562 9.79512C13.9041 10.0473 13.5621 10.1889 13.2056 10.1889H12.5333C12.355 10.1889 12.1841 10.2597 12.058 10.3858C11.9319 10.5119 11.8611 10.6828 11.8611 10.8611V12.8778C11.8611 13.0561 11.7903 13.2271 11.6642 13.3531C11.5382 13.4792 11.3672 13.55 11.1889 13.55H9.17222C8.99394 13.55 8.82296 13.4792 8.69689 13.3531C8.57082 13.2271 8.5 13.0561 8.5 12.8778V12.2056C8.5 11.849 8.35835 11.507 8.10622 11.2549C7.85409 11.0028 7.51212 10.8611 7.15556 10.8611C6.79899 10.8611 6.45702 11.0028 6.20489 11.2549C5.95276 11.507 5.81111 11.849 5.81111 12.2056V12.8778C5.81111 13.0561 5.74029 13.2271 5.61422 13.3531C5.48816 13.4792 5.31717 13.55 5.13889 13.55H3.12222C2.94394 13.55 2.77296 13.4792 2.64689 13.3531C2.52082 13.2271 2.45 13.0561 2.45 12.8778V10.8611C2.45 10.6828 2.52082 10.5119 2.64689 10.3858C2.77296 10.2597 2.94394 10.1889 3.12222 10.1889H3.79444C4.15101 10.1889 4.49298 10.0473 4.74511 9.79512C4.99724 9.54299 5.13889 9.20103 5.13889 8.84446C5.13889 8.48789 4.99724 8.14592 4.74511 7.89379C4.49298 7.64166 4.15101 7.50001 3.79444 7.50001H3.12222C2.94394 7.50001 2.77296 7.42919 2.64689 7.30312C2.52082 7.17706 2.45 7.00607 2.45 6.82779V4.81112C2.45 4.63284 2.52082 4.46186 2.64689 4.33579C2.77296 4.20972 2.94394 4.1389 3.12222 4.1389Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconPuzzle2.displayName = "IconPuzzle2";
const IconReset1 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconReset1.displayName = "IconReset1";
const IconReset22 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconReset22.displayName = "IconReset22";
const IconReset2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconReset2.displayName = "IconReset2";
const IconRetry2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.9491 8.78274C13.8075 9.86271 13.3746 10.8838 12.6967 11.7364C12.0189 12.589 11.1218 13.241 10.1016 13.6225C9.08135 14.004 7.97652 14.1006 6.90558 13.9019C5.83463 13.7033 4.83797 13.2168 4.02249 12.4947C3.207 11.7727 2.60345 10.8422 2.27657 9.80323C1.94969 8.76422 1.9118 7.65582 2.16698 6.59692C2.42216 5.53801 2.96077 4.56854 3.72505 3.79248C4.48934 3.01642 5.45046 2.46305 6.50534 2.19171C9.4296 1.4417 12.4566 2.94696 13.5741 5.75197M13.9994 2.00196V5.75197H10.2494",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconRetry2.displayName = "IconRetry2";
const IconRobot2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.9375 10.564C6.625 11.0123 7.3125 11.2362 8 11.2362C8.6875 11.2362 9.375 11.0123 10.0625 10.564M5.9375 4.51396L5.25 1.82507M10.0625 4.51396L10.75 1.82507M5.9375 7.87507V7.20285M10.0625 7.87507V7.20285M3.875 3.16952H12.125C12.4897 3.16952 12.8394 3.31116 13.0973 3.5633C13.3551 3.81543 13.5 4.15739 13.5 4.51396V12.5806C13.5 12.9372 13.3551 13.2792 13.0973 13.5313C12.8394 13.7834 12.4897 13.9251 12.125 13.9251H3.875C3.51033 13.9251 3.16059 13.7834 2.90273 13.5313C2.64487 13.2792 2.5 12.9372 2.5 12.5806V4.51396C2.5 4.15739 2.64487 3.81543 2.90273 3.5633C3.16059 3.31116 3.51033 3.16952 3.875 3.16952Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconRobot2.displayName = "IconRobot";
const IconRocky2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsxs("g", { "clip-path": "url(#clip0_442_57)", children: [
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M13.63 10.21L9.68 6.26L3.68 12.25C2.61 11.15 1.94 9.66 1.94 8C1.94 4.65 4.65 1.94 8 1.94C11.35 1.94 14.06 4.65 14.06 8C14.06 8.78 13.91 9.53 13.63 10.21Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M12.62 11.92L9.82 9.12L5.46 13.49C6.13 13.9 7.09 14.06 8 14.06C9.85 14.06 11.51 13.23 12.62 11.92Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_442_57", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "13.12",
              height: "13.12",
              fill: "white",
              transform: "translate(1.44 1.44)",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconRocky2.displayName = "IconRocky2";
const IconShare2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.79948 7.1332L10.1995 4.86654M5.79948 8.86654L10.1995 11.1332M2 8C2 8.53043 2.21071 9.03914 2.58579 9.41421C2.96086 9.78929 3.46957 10 4 10C4.53043 10 5.03914 9.78929 5.41421 9.41421C5.78929 9.03914 6 8.53043 6 8C6 7.46957 5.78929 6.96086 5.41421 6.58579C5.03914 6.21071 4.53043 6 4 6C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8ZM10 4C10 4.53043 10.2107 5.03914 10.5858 5.41421C10.9609 5.78929 11.4696 6 12 6C12.5304 6 13.0391 5.78929 13.4142 5.41421C13.7893 5.03914 14 4.53043 14 4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2C11.4696 2 10.9609 2.21071 10.5858 2.58579C10.2107 2.96086 10 3.46957 10 4ZM10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconShare2.displayName = "IconShare";
const IconSpeed2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.75734 12.9091C2.91823 12.07 2.34679 11.0009 2.11529 9.83702C1.88378 8.67313 2.0026 7.46674 2.45673 6.37039C2.91086 5.27403 3.6799 4.33697 4.66659 3.67768C5.65328 3.0184 6.81332 2.6665 8 2.6665C9.18669 2.6665 10.3467 3.0184 11.3334 3.67768C12.3201 4.33697 13.0891 5.27403 13.5433 6.37039C13.9974 7.46674 14.1162 8.67313 13.8847 9.83702C13.6532 11.0009 13.0818 12.07 12.2427 12.9091M10.6667 5.99984L8 8.6665",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconSpeed2.displayName = "IconSpeed2";
const IconStudy2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 3.33333C8 2.97971 7.85952 2.64057 7.60948 2.39052C7.35943 2.14048 7.02029 2 6.66667 2H2.66667C2.48986 2 2.32029 2.07024 2.19526 2.19526C2.07024 2.32029 2 2.48986 2 2.66667V12C2 12.1768 2.07024 12.3464 2.19526 12.4714C2.32029 12.5964 2.48986 12.6667 2.66667 12.6667H6.66667C7.02029 12.6667 7.35943 12.8071 7.60948 13.0572C7.85952 13.3072 8 13.6464 8 14M8 3.33333C8 2.97971 8.14048 2.64057 8.39052 2.39052C8.64057 2.14048 8.97971 2 9.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V12C14 12.1768 13.9298 12.3464 13.8047 12.4714C13.6797 12.5964 13.5101 12.6667 13.3333 12.6667H9.33333C8.97971 12.6667 8.64057 12.8071 8.39052 13.0572C8.14048 13.3072 8 13.6464 8 14M8 3.33333V14M4.66667 4.66667H5.33333M4.66667 7.33333H5.33333M10.6667 4.66667H11.3333M10.6667 7.33333H11.3333M10.6667 10H11.3333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconStudy2.displayName = "IconStudy2";
const IconTransfer2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.666 2L13.3327 4.66667M13.3327 4.66667L10.666 7.33333M13.3327 4.66667H6.66602M5.33268 8.66667L2.66602 11.3333M2.66602 11.3333L5.33268 14M2.66602 11.3333H8.66602",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconTransfer2.displayName = "IconTransfer2";
const IconUbuntu2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsxs("g", { "clip-path": "url(#clip0_442_59)", children: [
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M3.42 9.055C4.20424 9.055 4.84 8.41924 4.84 7.635C4.84 6.85075 4.20424 6.215 3.42 6.215C2.63576 6.215 2 6.85075 2 7.635C2 8.41924 2.63576 9.055 3.42 9.055Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M11.05 14.075C11.8342 14.075 12.47 13.4392 12.47 12.655C12.47 11.8707 11.8342 11.235 11.05 11.235C10.2658 11.235 9.63 11.8707 9.63 12.655C9.63 13.4392 10.2658 14.075 11.05 14.075Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M13.33 5.30499C13.76 6.05499 14 6.93499 14 7.87499C14 8.99499 13.65 10.045 13.05 10.895",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M4.17 5.06498C5.11 3.55498 6.77 2.54498 8.68 2.54498C8.77 2.54498 8.87 2.54498 8.97 2.56498",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M3.92999 10.265C4.75999 11.945 6.45999 13.105 8.43999 13.185",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M11.52 4.76499C12.3043 4.76499 12.94 4.12923 12.94 3.34499C12.94 2.56074 12.3043 1.92499 11.52 1.92499C10.7358 1.92499 10.1 2.56074 10.1 3.34499C10.1 4.12923 10.7358 4.76499 11.52 4.76499Z",
                "stroke-miterlimit": "10",
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_442_59", children: /* @__PURE__ */ jsx(
            "rect",
            {
              width: "13",
              height: "13.15",
              fill: "white",
              transform: "translate(1.5 1.42499)",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    );
  }
);
IconUbuntu2.displayName = "IconUbuntu2";
const IconUnlink2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 10L8 8M9.33333 6.66667L10 6M7.33333 4.0002L7.642 3.64287C8.2672 3.01776 9.11513 2.6666 9.99924 2.66667C10.8833 2.66673 11.7312 3.018 12.3563 3.6432C12.9814 4.26841 13.3326 5.11633 13.3325 6.00044C13.3325 6.88455 12.9812 7.73242 12.356 8.35754L12 8.66687M2 2L14 14M8.6666 12L8.40193 12.356C7.76943 12.9815 6.91579 13.3323 6.02627 13.3323C5.13674 13.3323 4.2831 12.9815 3.6506 12.356C3.33884 12.0477 3.09133 11.6807 2.92241 11.2761C2.75348 10.8715 2.6665 10.4374 2.6665 9.999C2.6665 9.56057 2.75348 9.12649 2.92241 8.7219C3.09133 8.31732 3.33884 7.95027 3.6506 7.642L3.99993 7.33333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconUnlink2.displayName = "IconUnlink2";
const IconUserCircle2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.11198 12.566C4.27699 12.0168 4.61462 11.5355 5.07481 11.1933C5.535 10.8512 6.09321 10.6665 6.66665 10.6667H9.33331C9.90749 10.6665 10.4664 10.8516 10.9269 11.1945C11.3874 11.5374 11.725 12.0199 11.8893 12.57M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM6 6.66667C6 7.1971 6.21071 7.70581 6.58579 8.08088C6.96086 8.45595 7.46957 8.66667 8 8.66667C8.53043 8.66667 9.03914 8.45595 9.41421 8.08088C9.78929 7.70581 10 7.1971 10 6.66667C10 6.13623 9.78929 5.62753 9.41421 5.25245C9.03914 4.87738 8.53043 4.66667 8 4.66667C7.46957 4.66667 6.96086 4.87738 6.58579 5.25245C6.21071 5.62753 6 6.13623 6 6.66667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconUserCircle2.displayName = "IconUserCircle";
const IconZap = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.5 3L3.5 9H8L7.5 13L12.5 7H8L8.5 3Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconZap.displayName = "IconZap";
const IconActive = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.599 13.4069V13.4136M12.6923 11.7402V11.7469M13.8457 9.33333V9.34M13.8457 6.66667V6.67333M12.6923 4.25977V4.26643M10.599 2.5931V2.59977M7.99902 2V2.00667M5.39901 2.5931V2.59977M3.3057 4.25977V4.26643M2.15234 6.66667V6.67333M2.15234 9.33333V9.34M3.3057 11.7402V11.7469M5.39901 13.4069V13.4136M7.99902 14V14.0067M7.33236 8C7.33236 8.17681 7.40259 8.34638 7.52762 8.4714C7.65264 8.59643 7.82221 8.66667 7.99902 8.66667C8.17583 8.66667 8.3454 8.59643 8.47043 8.4714C8.59545 8.34638 8.66569 8.17681 8.66569 8C8.66569 7.82319 8.59545 7.65362 8.47043 7.5286C8.3454 7.40357 8.17583 7.33333 7.99902 7.33333C7.82221 7.33333 7.65264 7.40357 7.52762 7.5286C7.40259 7.65362 7.33236 7.82319 7.33236 8ZM4.66569 8C4.66569 8.88406 5.01688 9.7319 5.642 10.357C6.26712 10.9821 7.11497 11.3333 7.99902 11.3333C8.88308 11.3333 9.73092 10.9821 10.356 10.357C10.9812 9.7319 11.3324 8.88406 11.3324 8C11.3324 7.11595 10.9812 6.2681 10.356 5.64298C9.73092 5.01786 8.88308 4.66667 7.99902 4.66667C7.11497 4.66667 6.26712 5.01786 5.642 5.64298C5.01688 6.2681 4.66569 7.11595 4.66569 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconActive.displayName = "IconActive";
const IconAddVolume = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M10.6 12.7H14.6M12.6 10.7V12.7V14.7",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconAddVolume.displayName = "IconAddVolume";
const IconAlert = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 6V8.66667M8 10.6667V10.6733M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconAlert.displayName = "IconAlert";
const IconAttach = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.99999 4.66667L5.66665 9C5.40144 9.26522 5.25244 9.62493 5.25244 10C5.25244 10.3751 5.40144 10.7348 5.66665 11C5.93187 11.2652 6.29158 11.4142 6.66665 11.4142C7.04172 11.4142 7.40144 11.2652 7.66665 11L12 6.66667C12.5304 6.13624 12.8284 5.41681 12.8284 4.66667C12.8284 3.91652 12.5304 3.1971 12 2.66667C11.4696 2.13624 10.7501 1.83824 9.99999 1.83824C9.24984 1.83824 8.53042 2.13624 7.99999 2.66667L3.66665 7C2.871 7.79565 2.42401 8.87478 2.42401 10C2.42401 11.1252 2.871 12.2044 3.66665 13C4.4623 13.7957 5.54143 14.2426 6.66665 14.2426C7.79187 14.2426 8.871 13.7957 9.66665 13L14 8.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconAttach.displayName = "IconAttach";
const IconBackup = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66761 11.9999C3.8358 11.9999 3.03805 11.6839 2.44987 11.1212C1.86169 10.5586 1.53125 9.79558 1.53125 8.99993C1.53125 8.20428 1.86169 7.44122 2.44987 6.87861C3.03805 6.316 3.8358 5.99993 4.66761 5.99993C4.86407 5.12471 5.43879 4.35558 6.26534 3.86174C6.6746 3.61721 7.13338 3.44763 7.61546 3.36267C8.09755 3.27771 8.59351 3.27905 9.07502 3.36659C9.55653 3.45414 10.0142 3.62619 10.4218 3.87291C10.8294 4.11964 11.1791 4.43621 11.4508 4.80455C11.7225 5.17288 11.9109 5.58578 12.0053 6.01966C12.0997 6.45354 12.0982 6.8999 12.0009 7.33326H12.6676C13.2865 7.33326 13.8799 7.57909 14.3175 8.01668C14.7551 8.45426 15.0009 9.04775 15.0009 9.66659C15.0009 10.2854 14.7551 10.8789 14.3175 11.3165C13.8799 11.7541 13.2865 11.9999 12.6676 11.9999H12.0009M6.00098 9.99996L8.00098 7.99996M8.00098 7.99996L10.001 9.99996M8.00098 7.99996V14",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconBackup.displayName = "IconBackup";
const IconCertificate3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.33333 2V4.66667C9.33333 4.84348 9.40357 5.01305 9.5286 5.13807C9.65362 5.2631 9.82319 5.33333 10 5.33333H12.6667M9.33333 2H4.66667C4.31304 2 3.97391 2.14048 3.72386 2.39052C3.47381 2.64057 3.33333 2.97971 3.33333 3.33333V5.33333M9.33333 2L12.6667 5.33333M12.6667 5.33333V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H8M3 11.3333L2 14.6667L4 13.6667L6 14.6667L5 11.3333M2 9.33333C2 9.86377 2.21071 10.3725 2.58579 10.7475C2.96086 11.1226 3.46957 11.3333 4 11.3333C4.53043 11.3333 5.03914 11.1226 5.41421 10.7475C5.78929 10.3725 6 9.86377 6 9.33333C6 8.8029 5.78929 8.29419 5.41421 7.91912C5.03914 7.54405 4.53043 7.33333 4 7.33333C3.46957 7.33333 2.96086 7.54405 2.58579 7.91912C2.21071 8.29419 2 8.8029 2 9.33333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconCertificate3.displayName = "IconCertificate";
const IconChart = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9 11.3078V6.76416M12.4286 11.3082V4.45459M5.57141 11.3082V9.49072M14 13.6196L3 13.6196L3 3",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconChart.displayName = "IconChart";
const IconCheckCircle = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13 7.53993V7.99993C12.9994 9.07814 12.6503 10.1273 12.0047 10.9908C11.3591 11.8544 10.4516 12.4862 9.41768 12.7919C8.38372 13.0976 7.27863 13.0609 6.26724 12.6872C5.25584 12.3136 4.39233 11.623 3.80548 10.7185C3.21863 9.81395 2.9399 8.74396 3.01084 7.66809C3.08178 6.59221 3.4986 5.5681 4.19914 4.74847C4.89968 3.92884 5.84639 3.35762 6.89809 3.12001C7.9498 2.88239 9.05013 2.9911 10.035 3.42993M13 4L8 9.005L6.5 7.505",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconCheckCircle.displayName = "IconCheckCircle";
const IconDeactivated = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.53059 7.52669C7.4055 7.6517 7.33519 7.82128 7.33512 7.99812C7.33509 8.08569 7.35231 8.1724 7.38579 8.25332C7.41927 8.33423 7.46836 8.40775 7.53026 8.46969C7.59216 8.53163 7.66565 8.58078 7.74653 8.61431C7.82742 8.64785 7.91412 8.66513 8.00169 8.66516C8.17854 8.66522 8.34817 8.59503 8.47326 8.47003M5.64875 5.63713C5.33724 5.9464 5.08988 6.31414 4.92088 6.71925C4.75187 7.12436 4.66454 7.55886 4.6639 7.99781C4.66327 8.43677 4.74933 8.87152 4.91716 9.27712C5.08499 9.68272 5.33127 10.0512 5.64188 10.3614C5.95248 10.6715 6.32129 10.9173 6.72713 11.0845C7.13297 11.2518 7.56784 11.3372 8.00679 11.336C8.44574 11.3347 8.88012 11.2468 9.28499 11.0772C9.68987 10.9076 10.0573 10.6597 10.3661 10.3478M11.2761 8.62047C11.3769 8.08893 11.3468 7.54084 11.1884 7.02353C11.03 6.50622 10.7481 6.03523 10.367 5.65124C9.98592 5.26724 9.51707 4.98178 9.00097 4.8195C8.48487 4.65723 7.93703 4.62301 7.40475 4.7198M10.5999 13.4069V13.4136M12.6934 11.7402V11.7469M13.8467 9.33333V9.34M13.8467 6.66667V6.67333M12.6934 4.25977V4.26643M10.5999 2.5931V2.59977M8 2V2.00667M5.40007 2.5931V2.59977M3.30664 4.25977V4.26643M2.15332 6.66667V6.67333M2.15332 9.33333V9.34M3.30664 11.7402V11.7469M5.40007 13.4069V13.4136M8 14V14.0067M2 2L14 14",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconDeactivated.displayName = "IconDeactivated";
const IconDeleting = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M1.99872 4.24959H14M2.7488 4.24959L3.49888 13.2506C3.49888 13.6484 3.65693 14.03 3.93827 14.3113C4.2196 14.5927 4.60118 14.7507 4.99904 14.7507H6.49921M13.2499 4.24959L12.9687 7.62496M5.74913 4.24959V1.99935C5.74913 1.80042 5.82815 1.60963 5.96882 1.46896C6.10949 1.32829 6.30027 1.24927 6.49921 1.24927H9.49953C9.69847 1.24927 9.88925 1.32829 10.0299 1.46896C10.1706 1.60963 10.2496 1.80042 10.2496 1.99935V4.24959M12 10V9M13.4167 10.5833L14.1334 9.86667M14 12H15M13.4167 13.4167L14.1334 14.1333M12 14V15M10.5833 13.4167L9.86668 14.1333M10 12H9.00002M10.5833 10.5833L9.86668 9.86667M6.66652 7.33331V11.3333M9.33319 7.33331V8",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconDeleting.displayName = "IconDeleting";
const IconDrawerClose = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66602 4.66663L7.99935 7.99996L4.66602 11.3333M8.66602 4.66663L11.9993 7.99996L8.66602 11.3333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconDrawerClose.displayName = "IconDrawerClose";
const IconError = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 1.5C11.5898 1.50001 14.4999 4.41023 14.5 8C14.5 11.5898 11.5898 14.5 8 14.5C4.41032 14.4998 1.50001 11.5897 1.5 8C1.50007 4.41033 4.41036 1.50018 8 1.5ZM8 2.5C4.96264 2.50018 2.50007 4.96262 2.5 8C2.50001 11.0374 4.9626 13.4998 8 13.5C11.0375 13.5 13.5 11.0375 13.5 8C13.4999 4.96252 11.0375 2.50001 8 2.5ZM9.44629 5.84668C9.64149 5.65148 9.95804 5.65161 10.1533 5.84668C10.3484 6.04195 10.3485 6.3585 10.1533 6.55371L8.70703 8L10.1533 9.44629C10.3484 9.64156 10.3485 9.95811 10.1533 10.1533C9.9581 10.3485 9.64156 10.3484 9.44629 10.1533L8 8.70703L6.55371 10.1533C6.3585 10.3485 6.04195 10.3484 5.84668 10.1533C5.65161 9.95805 5.65149 9.64149 5.84668 9.44629L7.29297 8L5.84668 6.55371C5.65142 6.35845 5.65143 6.04194 5.84668 5.84668C6.04194 5.65142 6.35845 5.65142 6.55371 5.84668L8 7.29297L9.44629 5.84668Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "black"
          }
        )
      }
    );
  }
);
IconError.displayName = "IconError";
const IconFavoriteOn = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.49615 4.89328L1.24282 5.50995L1.16749 5.52528C1.05345 5.55556 0.949484 5.61555 0.866215 5.69915C0.782947 5.78274 0.723356 5.88694 0.693529 6.0011C0.663701 6.11526 0.664705 6.23529 0.696439 6.34893C0.728172 6.46257 0.789498 6.56576 0.874154 6.64795L3.95549 9.64728L3.22882 13.8839L3.22015 13.9573C3.21317 14.0752 3.23766 14.1929 3.29112 14.2983C3.34458 14.4037 3.42508 14.4929 3.52438 14.557C3.62368 14.621 3.73821 14.6575 3.85625 14.6627C3.97429 14.6679 4.0916 14.6416 4.19615 14.5866L8.00015 12.5866L11.7955 14.5866L11.8622 14.6173C11.9722 14.6606 12.0918 14.6739 12.2087 14.6558C12.3255 14.6377 12.4355 14.5888 12.5272 14.5141C12.619 14.4395 12.6892 14.3418 12.7307 14.231C12.7722 14.1203 12.7835 14.0005 12.7635 13.8839L12.0362 9.64728L15.1188 6.64728L15.1708 6.59062C15.2451 6.49913 15.2938 6.38958 15.312 6.27315C15.3301 6.15671 15.3171 6.03753 15.2742 5.92777C15.2313 5.818 15.1601 5.72157 15.0678 5.64829C14.9755 5.57501 14.8654 5.52751 14.7488 5.51062L10.4955 4.89328L8.59415 1.03995C8.53914 0.928305 8.45397 0.834292 8.34828 0.768551C8.24259 0.702811 8.12062 0.667969 7.99615 0.667969C7.87169 0.667969 7.74971 0.702811 7.64403 0.768551C7.53834 0.834292 7.45317 0.928305 7.39815 1.03995L5.49615 4.89328Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconFavoriteOn.displayName = "IconFavoriteOn";
const IconFile3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9 3H5C4.73478 3 4.48043 3.10536 4.29289 3.29289C4.10536 3.48043 4 3.73478 4 4V12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11C11.2652 13 11.5196 12.8946 11.7071 12.7071C11.8946 12.5196 12 12.2652 12 12V6M9 3L12 6M9 3V6H12M10 8.5H6M10 10.5H6M7 6.5H6",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconFile3.displayName = "IconFile";
const IconFloatingIp = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 8.66666V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12M8 10.6667C7.64638 10.6667 7.30724 10.8071 7.05719 11.0572C6.80714 11.3072 6.66667 11.6464 6.66667 12M6.66667 12C6.66667 12.3536 6.80714 12.6928 7.05719 12.9428C7.30724 13.1928 7.64638 13.3333 8 13.3333C8.35362 13.3333 8.69276 13.1928 8.94281 12.9428C9.19286 12.6928 9.33333 12.3536 9.33333 12M6.66667 12H2M9.33333 12H14M3.33333 6.59792C3.33333 5.45525 4.30667 4.52858 5.50667 4.52858C5.69 3.71525 6.34333 3.05192 7.22133 2.78792C8.09933 2.52325 9.068 2.69858 9.762 3.24792C10.4567 3.79592 10.7713 4.63458 10.588 5.44792H11.05C11.4778 5.44703 11.8884 5.61607 12.1915 5.91786C12.4947 6.21965 12.6656 6.62948 12.6667 7.05725C12.6656 7.48502 12.4947 7.89485 12.1915 8.19664C11.8884 8.49843 11.4778 8.66747 11.05 8.66658H5.50667C4.30667 8.66658 3.33333 7.73992 3.33333 6.59792Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconFloatingIp.displayName = "IconFloatingIp";
const IconHardDrive = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.476 8.00004H2.49939M4.49935 10.3334H4.50518M6.83268 10.3334H6.83852M4.17852 3.98087L2.16602 8.00004V11.5C2.16602 11.8095 2.28893 12.1062 2.50772 12.325C2.72652 12.5438 3.02326 12.6667 3.33268 12.6667H12.666C12.9754 12.6667 13.2722 12.5438 13.491 12.325C13.7098 12.1062 13.8327 11.8095 13.8327 11.5V8.00004L11.8202 3.98087C11.7236 3.7865 11.5747 3.62292 11.3902 3.50854C11.2058 3.39415 10.9931 3.33349 10.776 3.33337H5.22268C5.00563 3.33349 4.79292 3.39415 4.60846 3.50854C4.424 3.62292 4.2751 3.7865 4.17852 3.98087Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconHardDrive.displayName = "IconHardDrive";
const IconHostAggregates = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 7.99999H12C12.5304 7.99999 13.0391 7.78928 13.4142 7.4142C13.7893 7.03913 14 6.53042 14 5.99999V4.66666C14 4.13622 13.7893 3.62752 13.4142 3.25244C13.0391 2.87737 12.5304 2.66666 12 2.66666H4C3.46957 2.66666 2.96086 2.87737 2.58579 3.25244C2.21071 3.62752 2 4.13622 2 4.66666V5.99999C2 6.53042 2.21071 7.03913 2.58579 7.4142C2.96086 7.78928 3.46957 7.99999 4 7.99999ZM4 7.99999C3.46957 7.99999 2.96086 8.2107 2.58579 8.58578C2.21071 8.96085 2 9.46956 2 9.99999V11.3333C2 11.8638 2.21071 12.3725 2.58579 12.7475C2.96086 13.1226 3.46957 13.3333 4 13.3333H8M4 7.99999H11M12 13.3333C11.6464 13.3333 11.3072 13.1928 11.0572 12.9428C10.8071 12.6928 10.6667 12.3536 10.6667 12C10.6667 11.6464 10.8071 11.3072 11.0572 11.0572C11.3072 10.8071 11.6464 10.6667 12 10.6667M12 13.3333C12.3536 13.3333 12.6928 13.1928 12.9428 12.9428C13.1929 12.6928 13.3333 12.3536 13.3333 12C13.3333 11.6464 13.1929 11.3072 12.9428 11.0572C12.6928 10.8071 12.3536 10.6667 12 10.6667M12 13.3333V14.3333M12 10.6667V9.66666M14.0213 10.8333L13.1553 11.3333M10.8468 12.6667L9.98014 13.1667M9.98014 10.8333L10.8468 11.3333M13.1553 12.6667L14.0219 13.1667M4.66667 5.33332V5.33999M4.66667 10.6667V10.6733",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconHostAggregates.displayName = "IconHostAggregates";
const IconHypervisor = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.99935 5.99998H7.99935M2.66602 3.33331H5.33268M3.99935 3.33331V10.6666C3.99935 10.8435 4.06959 11.013 4.19461 11.1381C4.31964 11.2631 4.4892 11.3333 4.66602 11.3333H7.99935M7.99935 5.33331C7.99935 5.1565 8.06959 4.98693 8.19461 4.86191C8.31964 4.73688 8.4892 4.66665 8.66602 4.66665H12.666C12.8428 4.66665 13.0124 4.73688 13.1374 4.86191C13.2624 4.98693 13.3327 5.1565 13.3327 5.33331V6.66665C13.3327 6.84346 13.2624 7.01303 13.1374 7.13805C13.0124 7.26307 12.8428 7.33331 12.666 7.33331H8.66602C8.4892 7.33331 8.31964 7.26307 8.19461 7.13805C8.06959 7.01303 7.99935 6.84346 7.99935 6.66665V5.33331ZM7.99935 10.6666C7.99935 10.4898 8.06959 10.3203 8.19461 10.1952C8.31964 10.0702 8.4892 9.99998 8.66602 9.99998H12.666C12.8428 9.99998 13.0124 10.0702 13.1374 10.1952C13.2624 10.3203 13.3327 10.4898 13.3327 10.6666V12C13.3327 12.1768 13.2624 12.3464 13.1374 12.4714C13.0124 12.5964 12.8428 12.6666 12.666 12.6666H8.66602C8.4892 12.6666 8.31964 12.5964 8.19461 12.4714C8.06959 12.3464 7.99935 12.1768 7.99935 12V10.6666Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconHypervisor.displayName = "IconHypervisor";
const IconImages = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66667 8C4.66667 7.11595 5.01786 6.2681 5.64298 5.64298C6.2681 5.01786 7.11595 4.66667 8 4.66667M8 11.3333C8.88406 11.3333 9.7319 10.9821 10.357 10.357C10.9821 9.7319 11.3333 8.88406 11.3333 8M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66667 8 8.66667C8.17681 8.66667 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.5286C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.5286C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconImages.displayName = "IconImages";
const IconInstances = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3327 5L7.99935 2L2.66602 5M13.3327 5V11L7.99935 14M13.3327 5L7.99935 8M7.99935 14L2.66602 11V5M7.99935 14V8M2.66602 5L7.99935 8",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconInstances.displayName = "IconInstances";
const IconInuse = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66669 8V6C2.66669 5.46957 2.8774 4.96086 3.25247 4.58579C3.62755 4.21071 4.13625 4 4.66669 4H13.3334M13.3334 4L11.3334 2M13.3334 4L11.3334 6M13.3334 8V10C13.3334 10.5304 13.1226 11.0391 12.7476 11.4142C12.3725 11.7893 11.8638 12 11.3334 12H2.66669M2.66669 12L4.66669 14M2.66669 12L4.66669 10",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconInuse.displayName = "IconInuse";
const IconKey3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.25 2.16666L12.0833 3.33332M12.0833 3.33332L13.8333 5.08332L11.7917 7.12499L10.0417 5.37499M12.0833 3.33332L10.0417 5.37499M7.64416 7.77249C7.34697 7.47129 6.99313 7.23185 6.60303 7.06797C6.21292 6.90408 5.79425 6.81897 5.37112 6.81756C4.94799 6.81614 4.52876 6.89844 4.13756 7.05971C3.74637 7.22098 3.39094 7.45804 3.09174 7.75724C2.79254 8.05644 2.55548 8.41187 2.39421 8.80306C2.23293 9.19426 2.15064 9.61349 2.15206 10.0366C2.15347 10.4598 2.23858 10.8784 2.40247 11.2685C2.56635 11.6586 2.80579 12.0125 3.10699 12.3097C3.71209 12.8941 4.52252 13.2175 5.36373 13.2102C6.20495 13.2028 7.00964 12.8654 7.60449 12.2706C8.19934 11.6757 8.53676 10.871 8.54407 10.0298C8.55138 9.1886 8.228 8.37817 7.64357 7.77307L7.64416 7.77249ZM7.64416 7.77249L10.0417 5.37499",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconKey3.displayName = "IconKey";
const IconLoadBalancer = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconLoadBalancer.displayName = "IconLoadBalancer";
const IconMaintenance = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.79999 4.2C9.67783 4.32462 9.60941 4.49216 9.60941 4.66667C9.60941 4.84117 9.67783 5.00871 9.79999 5.13333L10.8667 6.2C10.9913 6.32215 11.1588 6.39057 11.3333 6.39057C11.5078 6.39057 11.6754 6.32215 11.8 6.2L13.8707 4.13C14.084 3.91533 14.446 3.98333 14.526 4.27533C14.7274 5.00792 14.716 5.78271 14.4932 6.50906C14.2703 7.23541 13.8452 7.88327 13.2676 8.37682C12.69 8.87038 11.9837 9.18923 11.2315 9.29604C10.4793 9.40286 9.71218 9.29324 9.01999 8.98L3.74665 14.2533C3.48144 14.5185 3.12176 14.6674 2.74675 14.6673C2.37174 14.6672 2.01211 14.5182 1.74699 14.253C1.48186 13.9878 1.33295 13.6281 1.33301 13.2531C1.33307 12.8781 1.4821 12.5185 1.74732 12.2533L7.02065 6.98C6.70741 6.28781 6.59779 5.52072 6.70461 4.7685C6.81143 4.01628 7.13027 3.31003 7.62383 2.73241C8.11738 2.15479 8.76524 1.72967 9.49159 1.50682C10.2179 1.28396 10.9927 1.27258 11.7253 1.474C12.0173 1.554 12.0853 1.91533 11.8713 2.13L9.79999 4.2Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconMaintenance.displayName = "IconMaintenance";
const IconMorekebab = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: color
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: color
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: color
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 7.99996C7.33398 8.17677 7.40422 8.34634 7.52925 8.47136C7.65427 8.59639 7.82384 8.66663 8.00065 8.66663C8.17746 8.66663 8.34703 8.59639 8.47206 8.47136C8.59708 8.34634 8.66732 8.17677 8.66732 7.99996C8.66732 7.82315 8.59708 7.65358 8.47206 7.52856C8.34703 7.40353 8.17746 7.33329 8.00065 7.33329C7.82384 7.33329 7.65427 7.40353 7.52925 7.52856C7.40422 7.65358 7.33398 7.82315 7.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 12.6666C7.33398 12.8434 7.40422 13.013 7.52925 13.138C7.65427 13.2631 7.82384 13.3333 8.00065 13.3333C8.17746 13.3333 8.34703 13.2631 8.47206 13.138C8.59708 13.013 8.66732 12.8434 8.66732 12.6666C8.66732 12.4898 8.59708 12.3202 8.47206 12.1952C8.34703 12.0702 8.17746 12 8.00065 12C7.82384 12 7.65427 12.0702 7.52925 12.1952C7.40422 12.3202 7.33398 12.4898 7.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M7.33398 3.33329C7.33398 3.5101 7.40422 3.67967 7.52925 3.8047C7.65427 3.92972 7.82384 3.99996 8.00065 3.99996C8.17746 3.99996 8.34703 3.92972 8.47206 3.8047C8.59708 3.67967 8.66732 3.5101 8.66732 3.33329C8.66732 3.15648 8.59708 2.98691 8.47206 2.86189C8.34703 2.73686 8.17746 2.66663 8.00065 2.66663C7.82384 2.66663 7.65427 2.73686 7.52925 2.86189C7.40422 2.98691 7.33398 3.15648 7.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconMorekebab.displayName = "IconMorekebab";
const IconNetwork3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.91669 10.3333V8.58332C3.91669 8.42861 3.97815 8.28024 4.08754 8.17084C4.19694 8.06145 4.34531 7.99999 4.50002 7.99999H11.5C11.6547 7.99999 11.8031 8.06145 11.9125 8.17084C12.0219 8.28024 12.0834 8.42861 12.0834 8.58332V10.3333M8.00002 7.99999V5.66666M10.9167 10.3333H13.25C13.5722 10.3333 13.8334 10.5945 13.8334 10.9167V13.25C13.8334 13.5722 13.5722 13.8333 13.25 13.8333H10.9167C10.5945 13.8333 10.3334 13.5722 10.3334 13.25V10.9167C10.3334 10.5945 10.5945 10.3333 10.9167 10.3333ZM2.75002 10.3333H5.08335C5.40552 10.3333 5.66669 10.5945 5.66669 10.9167V13.25C5.66669 13.5722 5.40552 13.8333 5.08335 13.8333H2.75002C2.42785 13.8333 2.16669 13.5722 2.16669 13.25V10.9167C2.16669 10.5945 2.42785 10.3333 2.75002 10.3333ZM6.83335 2.16666H9.16669C9.48885 2.16666 9.75002 2.42782 9.75002 2.74999V5.08332C9.75002 5.40549 9.48885 5.66666 9.16669 5.66666H6.83335C6.51119 5.66666 6.25002 5.40549 6.25002 5.08332V2.74999C6.25002 2.42782 6.51119 2.16666 6.83335 2.16666Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconNetwork3.displayName = "IconNetwork";
const IconNotificationnew = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.99935 11.3333V12C5.99935 12.5304 6.21006 13.0391 6.58514 13.4142C6.96021 13.7893 7.46892 14 7.99935 14C8.52978 14 9.03849 13.7893 9.41356 13.4142C9.78864 13.0391 9.99935 12.5304 9.99935 12V11.3333M6.66602 3.33333C6.66602 2.97971 6.80649 2.64057 7.05654 2.39052C7.30659 2.14048 7.64573 2 7.99935 2C8.35297 2 8.69211 2.14048 8.94216 2.39052C9.19221 2.64057 9.33268 2.97971 9.33268 3.33333C10.0983 3.69535 10.751 4.25888 11.2207 4.96353C11.6905 5.66818 11.9596 6.48738 11.9993 7.33333V9.33333C12.0495 9.7478 12.1963 10.1447 12.4279 10.4921C12.6595 10.8395 12.9694 11.1276 13.3327 11.3333H2.66602C3.02931 11.1276 3.33922 10.8395 3.57081 10.4921C3.80239 10.1447 3.94918 9.7478 3.99935 9.33333V7.33333C4.03906 6.48738 4.30822 5.66818 4.77798 4.96353C5.24775 4.25888 5.90041 3.69535 6.66602 3.33333Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 2C12 2.53043 12.2107 3.03914 12.5858 3.41421C12.9609 3.78929 13.4696 4 14 4C14.5304 4 15.0391 3.78929 15.4142 3.41421C15.7893 3.03914 16 2.53043 16 2C16 1.46957 15.7893 0.960859 15.4142 0.585787C15.0391 0.210714 14.5304 0 14 0C13.4696 0 12.9609 0.210714 12.5858 0.585787C12.2107 0.960859 12 1.46957 12 2Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "var(--color-state-danger)"
            }
          )
        ]
      }
    );
  }
);
IconNotificationnew.displayName = "IconNotificationnew";
const IconOrder = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 3.33329C5.33398 3.5101 5.40422 3.67967 5.52925 3.8047C5.65427 3.92972 5.82384 3.99996 6.00065 3.99996C6.17746 3.99996 6.34703 3.92972 6.47206 3.8047C6.59708 3.67967 6.66732 3.5101 6.66732 3.33329C6.66732 3.15648 6.59708 2.98691 6.47206 2.86189C6.34703 2.73686 6.17746 2.66663 6.00065 2.66663C5.82384 2.66663 5.65427 2.73686 5.52925 2.86189C5.40422 2.98691 5.33398 3.15648 5.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 7.99996C5.33398 8.17677 5.40422 8.34634 5.52925 8.47136C5.65427 8.59639 5.82384 8.66663 6.00065 8.66663C6.17746 8.66663 6.34703 8.59639 6.47206 8.47136C6.59708 8.34634 6.66732 8.17677 6.66732 7.99996C6.66732 7.82315 6.59708 7.65358 6.47206 7.52856C6.34703 7.40353 6.17746 7.33329 6.00065 7.33329C5.82384 7.33329 5.65427 7.40353 5.52925 7.52856C5.40422 7.65358 5.33398 7.82315 5.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.33398 12.6666C5.33398 12.8434 5.40422 13.013 5.52925 13.138C5.65427 13.2631 5.82384 13.3333 6.00065 13.3333C6.17746 13.3333 6.34703 13.2631 6.47206 13.138C6.59708 13.013 6.66732 12.8434 6.66732 12.6666C6.66732 12.4898 6.59708 12.3202 6.47206 12.1952C6.34703 12.0702 6.17746 12 6.00065 12C5.82384 12 5.65427 12.0702 5.52925 12.1952C5.40422 12.3202 5.33398 12.4898 5.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 3.33329C9.33398 3.5101 9.40422 3.67967 9.52925 3.8047C9.65427 3.92972 9.82384 3.99996 10.0007 3.99996C10.1775 3.99996 10.347 3.92972 10.4721 3.8047C10.5971 3.67967 10.6673 3.5101 10.6673 3.33329C10.6673 3.15648 10.5971 2.98691 10.4721 2.86189C10.347 2.73686 10.1775 2.66663 10.0007 2.66663C9.82384 2.66663 9.65427 2.73686 9.52925 2.86189C9.40422 2.98691 9.33398 3.15648 9.33398 3.33329Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 7.99996C9.33398 8.17677 9.40422 8.34634 9.52925 8.47136C9.65427 8.59639 9.82384 8.66663 10.0007 8.66663C10.1775 8.66663 10.347 8.59639 10.4721 8.47136C10.5971 8.34634 10.6673 8.17677 10.6673 7.99996C10.6673 7.82315 10.5971 7.65358 10.4721 7.52856C10.347 7.40353 10.1775 7.33329 10.0007 7.33329C9.82384 7.33329 9.65427 7.40353 9.52925 7.52856C9.40422 7.65358 9.33398 7.82315 9.33398 7.99996Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.33398 12.6666C9.33398 12.8434 9.40422 13.013 9.52925 13.138C9.65427 13.2631 9.82384 13.3333 10.0007 13.3333C10.1775 13.3333 10.347 13.2631 10.4721 13.138C10.5971 13.013 10.6673 12.8434 10.6673 12.6666C10.6673 12.4898 10.5971 12.3202 10.4721 12.1952C10.347 12.0702 10.1775 12 10.0007 12C9.82384 12 9.65427 12.0702 9.52925 12.1952C9.40422 12.3202 9.33398 12.4898 9.33398 12.6666Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconOrder.displayName = "IconOrder";
const IconPlugin = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M4.6667 8L8.00004 11.3333L7.00004 12.3333C6.78248 12.5581 6.52238 12.7373 6.23487 12.8605C5.94737 12.9837 5.63823 13.0484 5.32545 13.051C5.01267 13.0535 4.70251 12.9938 4.41304 12.8753C4.12358 12.7567 3.8606 12.5818 3.63942 12.3606C3.41825 12.1394 3.2433 11.8765 3.12477 11.587C3.00625 11.2975 2.94651 10.9874 2.94905 10.6746C2.95159 10.3618 3.01635 10.0527 3.13956 9.76516C3.26277 9.47766 3.44197 9.21756 3.66671 9L4.6667 8ZM11.3333 8.00004L8 4.6667L9 3.66671C9.21756 3.44197 9.47766 3.26277 9.76516 3.13956C10.0527 3.01635 10.3618 2.95159 10.6746 2.94905C10.9874 2.94651 11.2975 3.00625 11.587 3.12477C11.8765 3.2433 12.1394 3.41825 12.3606 3.63942C12.5818 3.8606 12.7567 4.12358 12.8753 4.41304C12.9938 4.70251 13.0535 5.01267 13.051 5.32545C13.0484 5.63823 12.9837 5.94737 12.8605 6.23487C12.7373 6.52238 12.5581 6.78248 12.3333 7.00004L11.3333 8.00004Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconPlugin.displayName = "IconPlugin";
const IconPorts2 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 5.33332C7.64638 5.33332 7.30724 5.19285 7.05719 4.9428C6.80714 4.69275 6.66667 4.35361 6.66667 3.99999C6.66667 3.64637 6.80714 3.30723 7.05719 3.05718C7.30724 2.80713 7.64638 2.66666 8 2.66666C8.35362 2.66666 8.69276 2.80713 8.94281 3.05718C9.19286 3.30723 9.33333 3.64637 9.33333 3.99999C9.33333 4.35361 9.19286 4.69275 8.94281 4.9428C8.69276 5.19285 8.35362 5.33332 8 5.33332ZM8 5.33332V10.6667M8 10.6667C8.35362 10.6667 8.69276 10.8071 8.94281 11.0572C9.19286 11.3072 9.33333 11.6464 9.33333 12C9.33333 12.3536 9.19286 12.6928 8.94281 12.9428C8.69276 13.1928 8.35362 13.3333 8 13.3333C7.64638 13.3333 7.30724 13.1928 7.05719 12.9428C6.80714 12.6928 6.66667 12.3536 6.66667 12C6.66667 11.6464 6.80714 11.3072 7.05719 11.0572C7.30724 10.8071 7.64638 10.6667 8 10.6667ZM4.21061 8.33059L7.12261 5.00259M11.7892 8.33056L8.87858 5.0039M4.66667 9.33332C4.66667 8.9797 4.52619 8.64056 4.27614 8.39051C4.02609 8.14047 3.68696 7.99999 3.33333 7.99999C2.97971 7.99999 2.64057 8.14047 2.39052 8.39051C2.14048 8.64056 2 8.9797 2 9.33332C2 9.68695 2.14048 10.0261 2.39052 10.2761C2.64057 10.5262 2.97971 10.6667 3.33333 10.6667C3.68696 10.6667 4.02609 10.5262 4.27614 10.2761C4.52619 10.0261 4.66667 9.68695 4.66667 9.33332ZM14 9.33332C14 8.9797 13.8595 8.64056 13.6095 8.39051C13.3594 8.14047 13.0203 7.99999 12.6667 7.99999C12.313 7.99999 11.9739 8.14047 11.7239 8.39051C11.4738 8.64056 11.3333 8.9797 11.3333 9.33332C11.3333 9.68695 11.4738 10.0261 11.7239 10.2761C11.9739 10.5262 12.313 10.6667 12.6667 10.6667C13.0203 10.6667 13.3594 10.5262 13.6095 10.2761C13.8595 10.0261 14 9.68695 14 9.33332Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconPorts2.displayName = "IconPorts2";
const IconPorts = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8.00002 13.8333C11.2218 13.8333 13.8334 11.2217 13.8334 7.99999C13.8334 4.77824 11.2218 2.16666 8.00002 2.16666C4.77827 2.16666 2.16669 4.77824 2.16669 7.99999C2.16669 11.2217 4.77827 13.8333 8.00002 13.8333Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8 9.75C8.9665 9.75 9.75 8.9665 9.75 8C9.75 7.0335 8.9665 6.25 8 6.25C7.0335 6.25 6.25 7.0335 6.25 8C6.25 8.9665 7.0335 9.75 8 9.75Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconPorts.displayName = "IconPorts";
const IconPublish = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3327 4.99955V3.66622C13.3327 3.3126 13.1922 2.97346 12.9422 2.72341C12.6921 2.47336 12.353 2.33289 11.9993 2.33289L3.99935 2.33289C3.64573 2.33289 3.30659 2.47336 3.05654 2.72341C2.80649 2.97346 2.66602 3.3126 2.66602 3.66622L2.66602 4.99955M4.66606 8.33337L7.99939 5.00004M7.99939 5.00004L11.3327 8.33337M7.99939 5.00004V13",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconPublish.displayName = "IconPublish";
const IconReboot = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.66732 3.99996C3.85824 4.68314 3.27863 5.59843 3.00694 6.62192C2.73525 7.6454 2.7846 8.72766 3.14832 9.72217C3.51204 10.7167 4.17256 11.5754 5.04046 12.1821C5.90836 12.7888 6.94172 13.1142 8.00065 13.1142C9.05959 13.1142 10.0929 12.7888 10.9608 12.1821C11.8287 11.5754 12.4893 10.7167 12.853 9.72217C13.2167 8.72766 13.2661 7.6454 12.9944 6.62192C12.7227 5.59843 12.1431 4.68314 11.334 3.99996M8.00065 2.66663V7.99996",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconReboot.displayName = "IconReboot";
const IconRouters = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12.6667 4.5H3.33335C2.68902 4.5 2.16669 5.02233 2.16669 5.66667V10.3333C2.16669 10.9777 2.68902 11.5 3.33335 11.5H12.6667C13.311 11.5 13.8334 10.9777 13.8334 10.3333V5.66667C13.8334 5.02233 13.311 4.5 12.6667 4.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M4.5 8H4.50583",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6.83331 8H6.83915",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M9.16669 8H9.17252",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M11.5 8H11.5058",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconRouters.displayName = "IconRouters";
const IconSecurityError = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.0267 13.1633C9.3987 13.5307 8.71737 13.814 8.00003 14C6.96217 13.7308 5.98902 13.2557 5.1384 12.603C4.28777 11.9503 3.57704 11.1332 3.04843 10.2004C2.51982 9.26751 2.18412 8.23793 2.06128 7.17279C1.93844 6.10764 2.03097 5.02868 2.33337 4C4.41038 4.09504 6.44281 3.37772 8.00003 2C9.55725 3.37772 11.5897 4.09504 13.6667 4C14.0499 5.30392 14.0947 6.68399 13.7967 8.01M12.6666 10.6667V12.6667M12.6666 14.6667V14.6733",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconSecurityError.displayName = "IconSecurityError";
const IconSecurityGroup = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.99919 8C7.82238 8 7.65281 7.92976 7.52778 7.80474C7.40276 7.67971 7.33252 7.51014 7.33252 7.33333C7.33252 7.15652 7.40276 6.98695 7.52778 6.86193C7.65281 6.7369 7.82238 6.66667 7.99919 6.66667C8.176 6.66667 8.34557 6.7369 8.47059 6.86193C8.59562 6.98695 8.66585 7.15652 8.66585 7.33333C8.66585 7.51014 8.59562 7.67971 8.47059 7.80474C8.34557 7.92976 8.176 8 7.99919 8ZM7.99919 8V9.66667M7.99924 2C9.55646 3.37772 11.5889 4.09504 13.6659 4C13.9683 5.02868 14.0608 6.10764 13.938 7.17279C13.8151 8.23793 13.4795 9.26751 12.9508 10.2004C12.4222 11.1332 11.7115 11.9503 10.8609 12.603C10.0103 13.2557 9.0371 13.7308 7.99924 14C6.96138 13.7308 5.98823 13.2557 5.1376 12.603C4.28698 11.9503 3.57625 11.1332 3.04764 10.2004C2.51903 9.26751 2.18333 8.23793 2.06049 7.17279C1.93765 6.10764 2.03018 5.02868 2.33257 4C4.40959 4.09504 6.44202 3.37772 7.99924 2Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconSecurityGroup.displayName = "IconSecurityGroup";
const IconShelved = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.3333 10.6667L10.6667 13.3333M2 14L3.66667 12.3333M12.3333 3.66667L14 2M6.66667 7.33333L5.33333 8.66667M8.66667 9.33333L7.33333 10.6667M10.6667 10.6667L13.3333 13.3333M4.66666 8L8 11.3333L7 12.3333C6.78244 12.5581 6.52234 12.7373 6.23483 12.8605C5.94733 12.9837 5.63818 13.0484 5.3254 13.051C5.01262 13.0535 4.70247 12.9938 4.413 12.8753C4.12354 12.7567 3.86056 12.5818 3.63938 12.3606C3.4182 12.1394 3.24326 11.8765 3.12473 11.587C3.00621 11.2975 2.94647 10.9874 2.94901 10.6746C2.95155 10.3618 3.01631 10.0527 3.13952 9.76516C3.26273 9.47766 3.44193 9.21756 3.66666 9L4.66666 8ZM11.3333 8L8 4.66666L9 3.66666C9.21756 3.44193 9.47766 3.26273 9.76516 3.13952C10.0527 3.01631 10.3618 2.95155 10.6746 2.94901C10.9874 2.94647 11.2975 3.00621 11.587 3.12473C11.8765 3.24326 12.1394 3.4182 12.3606 3.63938C12.5818 3.86056 12.7567 4.12354 12.8753 4.413C12.9938 4.70247 13.0535 5.01262 13.051 5.3254C13.0484 5.63818 12.9837 5.94733 12.8605 6.23483C12.7373 6.52234 12.5581 6.78244 12.3333 7L11.3333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconShelved.displayName = "IconShelved";
const IconSuspended = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.1716 8H10.8285M3.75739 12.2426C4.31454 12.7998 4.97598 13.2417 5.70393 13.5433C6.43188 13.8448 7.2121 14 8.00003 14C8.78796 14 9.56818 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2427 12.2426C12.7998 11.6855 13.2418 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2418 4.97595 12.7998 4.31451 12.2427 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56818 2.15519 8.78796 2 8.00003 2C7.2121 2 6.43188 2.15519 5.70393 2.45672C4.97598 2.75825 4.31454 3.20021 3.75739 3.75736C3.20024 4.31451 2.75828 4.97595 2.45675 5.7039C2.15523 6.43185 2.00003 7.21207 2.00003 8C2.00003 8.78793 2.15523 9.56815 2.45675 10.2961C2.75828 11.0241 3.20024 11.6855 3.75739 12.2426Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconSuspended.displayName = "IconSuspended";
const IconVerify = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.7066 2.46029C4.97865 2.76161 4.31717 3.20335 3.75993 3.76029M2.46 5.70638C2.1577 6.43325 2.0014 7.21249 2 7.99971M2.45996 10.2936C2.76129 11.0216 3.20302 11.683 3.75996 12.2403M5.70671 13.5397C6.43357 13.842 7.21282 13.9983 8.00004 13.9997M10.2933 13.5402C11.0212 13.2389 11.6827 12.7972 12.24 12.2402M13.54 10.2933C13.8423 9.56647 13.9986 8.78722 14 8M13.5401 5.70643C13.2387 4.97849 12.797 4.31701 12.2401 3.75977M10.2933 2.46C9.56647 2.1577 8.78722 2.0014 8 2M6 8L7.33333 9.33333L10 6.66667",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconVerify.displayName = "IconVerify";
const IconVolumeSearch = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M14 14L12.6667 12.6667M10 11.5556C10 11.7598 10.0402 11.9621 10.1184 12.1508C10.1966 12.3396 10.3112 12.5111 10.4556 12.6555C10.6001 12.7999 10.7715 12.9145 10.9603 12.9927C11.149 13.0709 11.3513 13.1111 11.5556 13.1111C11.7598 13.1111 11.9621 13.0709 12.1508 12.9927C12.3396 12.9145 12.5111 12.7999 12.6555 12.6555C12.7999 12.5111 12.9145 12.3396 12.9927 12.1508C13.0709 11.9621 13.1111 11.7598 13.1111 11.5556C13.1111 11.3513 13.0709 11.149 12.9927 10.9603C12.9145 10.7715 12.7999 10.6001 12.6555 10.4556C12.5111 10.3112 12.3396 10.1966 12.1508 10.1184C11.9621 10.0402 11.7598 10 11.5556 10C11.3513 10 11.149 10.0402 10.9603 10.1184C10.7715 10.1966 10.6001 10.3112 10.4556 10.4556C10.3112 10.6001 10.1966 10.7715 10.1184 10.9603C10.0402 11.149 10 11.3513 10 11.5556Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconVolumeSearch.displayName = "IconVolumeSearch";
const IconVolumeType = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.66602 4C2.66602 5.10467 5.05402 6 7.99935 6C10.9447 6 13.3327 5.10467 13.3327 4M2.66602 4C2.66602 2.89533 5.05402 2 7.99935 2C10.9447 2 13.3327 2.89533 13.3327 4M2.66602 4V8M13.3327 4V7.66667M2.66602 8C2.66602 9.10467 5.05402 10 7.99935 10C8.13935 10 8.27935 9.998 8.41668 9.99333M2.66602 8V12C2.66602 13.1047 5.05402 14 7.99935 14M12.6667 14C12.313 14 11.9739 13.8595 11.7239 13.6095C11.4738 13.3594 11.3333 13.0203 11.3333 12.6667C11.3333 12.313 11.4738 11.9739 11.7239 11.7239C11.9739 11.4738 12.313 11.3333 12.6667 11.3333M12.6667 14C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667C14 12.313 13.8595 11.9739 13.6095 11.7239C13.3594 11.4738 13.0203 11.3333 12.6667 11.3333M12.6667 14V15M12.6667 11.3333V10.3333M14.6873 11.5L13.8213 12M11.5127 13.3333L10.646 13.8333M10.646 11.5L11.5127 12M13.8213 13.3333L14.688 13.8333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconVolumeType.displayName = "IconVolumeType";
const IconWarning = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 5.33333V8M8 10.6667H8.00667M13.25 4.17972C13.7167 4.44505 14.0033 4.94172 14 5.47839V10.3344C14 10.8737 13.7047 11.3711 13.228 11.6331L8.728 14.4797C8.5049 14.6022 8.25451 14.6664 8 14.6664C7.74549 14.6664 7.4951 14.6022 7.272 14.4797L2.772 11.6331C2.53878 11.5056 2.34408 11.3178 2.20827 11.0894C2.07247 10.8609 2.00053 10.6002 2 10.3344V5.47772C2 4.93839 2.29533 4.44172 2.772 4.17972L7.272 1.52639C7.50169 1.39975 7.75971 1.33333 8.022 1.33333C8.28429 1.33333 8.54231 1.39975 8.772 1.52639L13.272 4.17972H13.25Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconWarning.displayName = "IconWarning";
const IconAffiliate3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.95378 4.45736L4.80378 7.29002M8.54178 11.0294L11.3758 11.8794M7.78841 8.04474L11.6277 4.2054M2.66602 3.5C2.66602 3.63132 2.69188 3.76136 2.74214 3.88268C2.79239 4.00401 2.86605 4.11425 2.95891 4.20711C3.05177 4.29997 3.16201 4.37362 3.28333 4.42388C3.40466 4.47413 3.53469 4.5 3.66602 4.5C3.79734 4.5 3.92737 4.47413 4.0487 4.42388C4.17002 4.37362 4.28026 4.29997 4.37312 4.20711C4.46598 4.11425 4.53964 4.00401 4.5899 3.88268C4.64015 3.76136 4.66602 3.63132 4.66602 3.5C4.66602 3.36868 4.64015 3.23864 4.5899 3.11732C4.53964 2.99599 4.46598 2.88575 4.37312 2.79289C4.28026 2.70003 4.17002 2.62638 4.0487 2.57612C3.92737 2.52587 3.79734 2.5 3.66602 2.5C3.53469 2.5 3.40466 2.52587 3.28333 2.57612C3.16201 2.62638 3.05177 2.70003 2.95891 2.79289C2.86605 2.88575 2.79239 2.99599 2.74214 3.11732C2.69188 3.23864 2.66602 3.36868 2.66602 3.5ZM11.3327 3.5C11.3327 3.76522 11.438 4.01957 11.6256 4.20711C11.8131 4.39464 12.0675 4.5 12.3327 4.5C12.5979 4.5 12.8523 4.39464 13.0398 4.20711C13.2273 4.01957 13.3327 3.76522 13.3327 3.5C13.3327 3.23478 13.2273 2.98043 13.0398 2.79289C12.8523 2.60536 12.5979 2.5 12.3327 2.5C12.0675 2.5 11.8131 2.60536 11.6256 2.79289C11.438 2.98043 11.3327 3.23478 11.3327 3.5ZM11.3327 12.1667C11.3327 12.4319 11.438 12.6862 11.6256 12.8738C11.8131 13.0613 12.0675 13.1667 12.3327 13.1667C12.5979 13.1667 12.8523 13.0613 13.0398 12.8738C13.2273 12.6862 13.3327 12.4319 13.3327 12.1667C13.3327 11.9015 13.2273 11.6471 13.0398 11.4596C12.8523 11.272 12.5979 11.1667 12.3327 11.1667C12.0675 11.1667 11.8131 11.272 11.6256 11.4596C11.438 11.6471 11.3327 11.9015 11.3327 12.1667ZM2.66602 10.1667C2.66602 10.9623 2.98209 11.7254 3.5447 12.288C4.1073 12.8506 4.87037 13.1667 5.66602 13.1667C6.46167 13.1667 7.22473 12.8506 7.78734 12.288C8.34994 11.7254 8.66602 10.9623 8.66602 10.1667C8.66602 9.37102 8.34994 8.60796 7.78734 8.04535C7.22473 7.48274 6.46167 7.16667 5.66602 7.16667C4.87037 7.16667 4.1073 7.48274 3.5447 8.04535C2.98209 8.60796 2.66602 9.37102 2.66602 10.1667Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconAffiliate3.displayName = "IconAffiliate";
const IconArticlehistory = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.22222 5.5H10.7778M5.22222 8H10.7778M5.22222 10.5H10.7778M3 4.25C3 3.91848 3.11706 3.60054 3.32544 3.36612C3.53381 3.1317 3.81643 3 4.11111 3H11.8889C12.1836 3 12.4662 3.1317 12.6746 3.36612C12.8829 3.60054 13 3.91848 13 4.25V11.75C13 12.0815 12.8829 12.3995 12.6746 12.6339C12.4662 12.8683 12.1836 13 11.8889 13H4.11111C3.81643 13 3.53381 12.8683 3.32544 12.6339C3.11706 12.3995 3 12.0815 3 11.75V4.25Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconArticlehistory.displayName = "IconArticlehistory";
const IconCard = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3 4.25C3 3.91848 3.1317 3.60054 3.36612 3.36612C3.60054 3.1317 3.91848 3 4.25 3H11.75C12.0815 3 12.3995 3.1317 12.6339 3.36612C12.8683 3.60054 13 3.91848 13 4.25V5.5C13 5.83152 12.8683 6.14946 12.6339 6.38388C12.3995 6.6183 12.0815 6.75 11.75 6.75H4.25C3.91848 6.75 3.60054 6.6183 3.36612 6.38388C3.1317 6.14946 3 5.83152 3 5.5V4.25Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M3 10.5C3 10.1685 3.1317 9.85054 3.36612 9.61612C3.60054 9.3817 3.91848 9.25 4.25 9.25H11.75C12.0815 9.25 12.3995 9.3817 12.6339 9.61612C12.8683 9.85054 13 10.1685 13 10.5V11.75C13 12.0815 12.8683 12.3995 12.6339 12.6339C12.3995 12.8683 12.0815 13 11.75 13H4.25C3.91848 13 3.60054 12.8683 3.36612 12.6339C3.1317 12.3995 3 12.0815 3 11.75V10.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconCard.displayName = "IconCard";
const IconCheck3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6.00002 7.33334L8.00002 9.33334L13.3334 4.00001M13.3334 8.00001V12C13.3334 12.3536 13.1929 12.6928 12.9428 12.9428C12.6928 13.1929 12.3536 13.3333 12 13.3333H4.00002C3.6464 13.3333 3.30726 13.1929 3.05721 12.9428C2.80716 12.6928 2.66669 12.3536 2.66669 12V4.00001C2.66669 3.64638 2.80716 3.30724 3.05721 3.0572C3.30726 2.80715 3.6464 2.66667 4.00002 2.66667H10",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconCheck3.displayName = "IconCheck";
const IconCloudcomputing = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.43865 10.6666C2.72398 10.6666 1.33398 9.32859 1.33398 7.67792C1.33398 6.02792 2.72398 4.68992 4.43865 4.68992C4.70065 3.51526 5.63465 2.55659 6.88865 2.17459C8.14198 1.79326 9.52598 2.04592 10.518 2.84126C11.51 3.63459 11.9593 4.84592 11.698 6.02059H12.358C13.6333 6.02059 14.6673 7.06059 14.6673 8.34459C14.6673 9.62926 13.6333 10.6693 12.3573 10.6693H4.43865M8.00065 10.6667V14M10.6673 10.6667V13.3333C10.6673 13.5101 10.7376 13.6797 10.8626 13.8047C10.9876 13.9298 11.1572 14 11.334 14H14.0007M5.33398 10.6667V13.3333C5.33398 13.5101 5.26375 13.6797 5.13872 13.8047C5.0137 13.9298 4.84413 14 4.66732 14H2.00065",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconCloudcomputing.displayName = "IconCloudcomputing";
const IconFinetuning = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M7.06944 12.2683C7.30611 13.2439 8.69389 13.2439 8.93055 12.2683C8.96616 12.1219 9.03582 11.986 9.13386 11.8715C9.2319 11.7571 9.35556 11.6674 9.49479 11.6097C9.63402 11.5521 9.78488 11.5281 9.93513 11.5397C10.0854 11.5514 10.2307 11.5983 10.3594 11.6767C11.2172 12.1989 12.1983 11.2172 11.6761 10.36C11.5976 10.2312 11.5506 10.0858 11.539 9.93544C11.5273 9.78509 11.5513 9.63412 11.609 9.49481C11.6667 9.35549 11.7565 9.23178 11.8711 9.13373C11.9857 9.03568 12.1218 8.96606 12.2683 8.93055C13.2439 8.69389 13.2439 7.30611 12.2683 7.06944C12.1219 7.03384 11.986 6.96418 11.8715 6.86614C11.7571 6.7681 11.6674 6.64444 11.6097 6.50521C11.5521 6.36598 11.5281 6.21512 11.5397 6.06487C11.5514 5.91463 11.5983 5.76925 11.6767 5.64056C12.1989 4.78278 11.2172 3.80167 10.36 4.32389C10.2312 4.40239 10.0858 4.44938 9.93544 4.46104C9.78509 4.47269 9.63412 4.44869 9.49481 4.39097C9.35549 4.33325 9.23178 4.24346 9.13373 4.12889C9.03568 4.01432 8.96606 3.87822 8.93055 3.73167C8.69389 2.75611 7.30611 2.75611 7.06944 3.73167C6.91611 4.36222 6.19611 4.66111 5.64056 4.32333C4.78278 3.80111 3.80167 4.78278 4.32389 5.64C4.40239 5.76875 4.44938 5.91422 4.46104 6.06456C4.47269 6.21491 4.44869 6.36588 4.39097 6.50519C4.33325 6.64451 4.24346 6.76822 4.12889 6.86627C4.01432 6.96432 3.87822 7.03393 3.73167 7.06944C2.75611 7.30611 2.75611 8.69389 3.73167 8.93055M7.30989 7.58514C7.2424 7.65399 7.2046 7.74656 7.2046 7.84297C7.2046 7.93938 7.2424 8.03194 7.30989 8.10079L7.89921 8.69011C7.96806 8.7576 8.06062 8.7954 8.15703 8.7954C8.25344 8.7954 8.34601 8.7576 8.41486 8.69011L9.80345 7.30153C9.98865 7.71081 10.0447 8.16681 9.9642 8.60877C9.88368 9.05072 9.67038 9.45765 9.35272 9.7753C9.03506 10.093 8.62814 10.3063 8.18619 10.3868C7.74423 10.4673 7.28823 10.4112 6.87895 10.226L4.33382 12.7712C4.18729 12.9177 3.98856 13 3.78133 13C3.57411 13 3.37538 12.9177 3.22885 12.7712C3.08232 12.6246 3 12.4259 3 12.2187C3 12.0114 3.08232 11.8127 3.22885 11.6662L5.77397 9.12105C5.58877 8.71177 5.53269 8.25577 5.61321 7.81381C5.69374 7.37186 5.90704 6.96494 6.2247 6.64728C6.54236 6.32962 6.94928 6.11632 7.39123 6.0358C7.83319 5.95527 8.28919 6.01135 8.69847 6.19655L7.30989 7.58514Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconFinetuning.displayName = "IconFinetuning";
const IconHistory = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M2.5 4.50716C3.92848 2.2434 6.64284 1.08121 9.32129 1.639L9.61816 1.70736C10.7608 2.00128 11.802 2.60115 12.6299 3.44173C13.4578 4.28241 14.0419 5.33276 14.3184 6.47982C14.5947 7.62687 14.5533 8.82796 14.1992 9.95345C13.8451 11.0789 13.191 12.0873 12.3076 12.8695C11.4243 13.6514 10.3445 14.1787 9.18457 14.3939C8.02462 14.609 6.82767 14.5043 5.72266 14.0911C4.61764 13.6779 3.64536 12.9716 2.91113 12.0482C2.17689 11.1246 1.70718 10.0178 1.55371 8.84798C1.51791 8.57437 1.7118 8.32352 1.98535 8.28744C2.25898 8.2518 2.51001 8.44445 2.5459 8.7181C2.67575 9.70777 3.07229 10.6437 3.69336 11.4251C4.31459 12.2066 5.13726 12.8049 6.07227 13.1546C7.00727 13.5043 8.02045 13.5925 9.00195 13.4105C9.9835 13.2284 10.898 12.7822 11.6455 12.1204C12.3927 11.4587 12.9455 10.6057 13.2451 9.65365C13.5447 8.7013 13.5796 7.68479 13.3457 6.7142C13.1118 5.74373 12.6184 4.85517 11.918 4.14388C11.2174 3.43249 10.3361 2.92484 9.36914 2.67611L9.11719 2.61752C6.76273 2.12736 4.38539 3.20418 3.21875 5.25228H3.75C4.02598 5.25246 4.24999 5.47626 4.25 5.75228C4.24982 6.02816 4.02588 6.2521 3.75 6.25228H2C1.72412 6.2521 1.50018 6.02816 1.5 5.75228V4.00228C1.5 3.72625 1.72401 3.50246 2 3.50228C2.27598 3.50247 2.5 3.72626 2.5 4.00228V4.50716Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "black"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8 4.00033C8.2761 4.00033 8.49995 4.22422 8.5 4.50033V7.66146L10.6855 8.53646C10.9418 8.63907 11.0664 8.92954 10.9639 9.18588C10.8612 9.44201 10.5707 9.56662 10.3145 9.4642L7.81445 8.4642C7.62508 8.38818 7.50115 8.20441 7.50098 8.00033L7.5 4.50033C7.5 4.22423 7.72389 4.00038 8 4.00033Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "black"
            }
          )
        ]
      }
    );
  }
);
IconHistory.displayName = "IconHistory";
const IconLanguage3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.8327 7.99996C13.8327 11.2216 11.221 13.8333 7.99935 13.8333M13.8327 7.99996C13.8327 4.7783 11.221 2.16663 7.99935 2.16663M13.8327 7.99996H2.16602M7.99935 13.8333C4.77769 13.8333 2.16602 11.2216 2.16602 7.99996M7.99935 13.8333C9.45843 12.2359 10.2876 10.1629 10.3327 7.99996C10.2876 5.83698 9.45843 3.764 7.99935 2.16663M7.99935 13.8333C6.54027 12.2359 5.71108 10.1629 5.66602 7.99996C5.71108 5.83698 6.54027 3.764 7.99935 2.16663M2.16602 7.99996C2.16602 4.7783 4.77769 2.16663 7.99935 2.16663",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconLanguage3.displayName = "IconLanguage";
const IconNewchat = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 4.4V6.4M8 6.4V8.4M8 6.4H6M8 6.4H10M14 13L10.7273 10.7273H3.09091C2.80158 10.7273 2.5241 10.6123 2.31952 10.4078C2.11493 10.2032 2 9.92569 2 9.63636V3.09091C2 2.80158 2.11493 2.5241 2.31952 2.31952C2.5241 2.11493 2.80158 2 3.09091 2H12.9091C13.1984 2 13.4759 2.11493 13.6805 2.31952C13.8851 2.5241 14 2.80158 14 3.09091V13Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconNewchat.displayName = "IconNewchat";
const IconPending = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M5.70737 2.43629C7.19023 1.83917 8.84957 1.85556 10.3203 2.48187C11.7911 3.10818 12.9528 4.2931 13.55 5.77597C14.1471 7.25883 14.1307 8.91817 13.5044 10.3889C12.8781 11.8597 11.6932 13.0214 10.2103 13.6186M10.2103 10.2789V14.0313H13.9627M3.17814 4.39507V4.40257M2 7.27694V7.28445M2.42765 10.3539V10.3615M4.32659 12.808V12.8155M7.20835 13.9863V13.9938",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconPending.displayName = "IconPending";
const IconPuzzle3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.12223 4.1389H5.1389C5.31719 4.1389 5.48817 4.06808 5.61423 3.94201C5.7403 3.81595 5.81112 3.64496 5.81112 3.46668V2.79446C5.81112 2.43789 5.95277 2.09592 6.2049 1.84379C6.45703 1.59166 6.799 1.45001 7.15557 1.45001C7.51214 1.45001 7.8541 1.59166 8.10623 1.84379C8.35837 2.09592 8.50001 2.43789 8.50001 2.79446V3.46668C8.50001 3.64496 8.57084 3.81595 8.6969 3.94201C8.82297 4.06808 8.99395 4.1389 9.17223 4.1389H11.1889C11.3672 4.1389 11.5382 4.20972 11.6642 4.33579C11.7903 4.46186 11.8611 4.63284 11.8611 4.81112V6.82779C11.8611 7.00607 11.9319 7.17706 12.058 7.30312C12.1841 7.42919 12.3551 7.50001 12.5333 7.50001H13.2056C13.5621 7.50001 13.9041 7.64166 14.1562 7.89379C14.4084 8.14592 14.55 8.48789 14.55 8.84446C14.55 9.20103 14.4084 9.54299 14.1562 9.79512C13.9041 10.0473 13.5621 10.1889 13.2056 10.1889H12.5333C12.3551 10.1889 12.1841 10.2597 12.058 10.3858C11.9319 10.5119 11.8611 10.6828 11.8611 10.8611V12.8778C11.8611 13.0561 11.7903 13.2271 11.6642 13.3531C11.5382 13.4792 11.3672 13.55 11.1889 13.55H9.17223C8.99395 13.55 8.82297 13.4792 8.6969 13.3531C8.57084 13.2271 8.50001 13.0561 8.50001 12.8778V12.2056C8.50001 11.849 8.35837 11.507 8.10623 11.2549C7.8541 11.0028 7.51214 10.8611 7.15557 10.8611C6.799 10.8611 6.45703 11.0028 6.2049 11.2549C5.95277 11.507 5.81112 11.849 5.81112 12.2056V12.8778C5.81112 13.0561 5.7403 13.2271 5.61423 13.3531C5.48817 13.4792 5.31719 13.55 5.1389 13.55H3.12223C2.94395 13.55 2.77297 13.4792 2.6469 13.3531C2.52084 13.2271 2.45001 13.0561 2.45001 12.8778V10.8611C2.45001 10.6828 2.52084 10.5119 2.6469 10.3858C2.77297 10.2597 2.94395 10.1889 3.12223 10.1889H3.79446C4.15103 10.1889 4.49299 10.0473 4.74512 9.79512C4.99725 9.54299 5.1389 9.20103 5.1389 8.84446C5.1389 8.48789 4.99725 8.14592 4.74512 7.89379C4.49299 7.64166 4.15103 7.50001 3.79446 7.50001H3.12223C2.94395 7.50001 2.77297 7.42919 2.6469 7.30312C2.52084 7.17706 2.45001 7.00607 2.45001 6.82779V4.81112C2.45001 4.63284 2.52084 4.46186 2.6469 4.33579C2.77297 4.20972 2.94395 4.1389 3.12223 4.1389Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconPuzzle3.displayName = "IconPuzzle";
const IconReset = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2.04036 8.6667C2.20397 10.1293 2.89943 11.4807 3.99446 12.464C5.08949 13.4473 6.50771 13.9938 7.97941 13.9996C9.4511 14.0055 10.8736 13.4702 11.9764 12.4956C13.0792 11.5211 13.7853 10.1752 13.9605 8.71392C14.1357 7.25268 13.7677 5.77801 12.9266 4.57038C12.0854 3.36274 10.8298 2.50638 9.39839 2.16416C7.96702 1.82193 6.4598 2.01772 5.16337 2.71427C3.86694 3.41083 2.87174 4.55958 2.36703 5.94204M2 2.66732V6.00065H5.33333M7.33333 8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66666 8 8.66666C8.17681 8.66666 8.34638 8.59643 8.4714 8.4714C8.59643 8.34638 8.66667 8.17681 8.66667 8C8.66667 7.82319 8.59643 7.65362 8.4714 7.52859C8.34638 7.40357 8.17681 7.33333 8 7.33333C7.82319 7.33333 7.65362 7.40357 7.5286 7.52859C7.40357 7.65362 7.33333 7.82319 7.33333 8Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconReset.displayName = "IconReset";
const IconRetry = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M13.9491 8.78274C13.8075 9.86271 13.3746 10.8838 12.6967 11.7364C12.0189 12.589 11.1218 13.241 10.1016 13.6225C9.08135 14.004 7.97652 14.1006 6.90558 13.9019C5.83463 13.7033 4.83797 13.2168 4.02249 12.4947C3.207 11.7727 2.60345 10.8422 2.27657 9.80323C1.94969 8.76422 1.9118 7.65582 2.16698 6.59692C2.42216 5.53801 2.96077 4.56854 3.72505 3.79248C4.48934 3.01642 5.45046 2.46305 6.50534 2.19171C9.4296 1.4417 12.4566 2.94696 13.5741 5.75197M13.9994 2.00196V5.75197H10.2494",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconRetry.displayName = "IconRetry";
const IconRocky = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M20.445 15.315L14.52 9.39L5.52 18.375C3.915 16.725 2.91 14.49 2.91 12C2.91 6.975 6.975 2.91 12 2.91C17.025 2.91 21.09 6.975 21.09 12C21.09 13.17 20.865 14.295 20.445 15.315Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M18.93 17.88L14.73 13.68L8.19 20.235C9.195 20.85 10.635 21.09 12 21.09C14.775 21.09 17.265 19.845 18.93 17.88Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconRocky.displayName = "IconRocky";
const IconSpeed = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3.75734 12.9091C2.91823 12.07 2.34679 11.0009 2.11529 9.83702C1.88378 8.67313 2.0026 7.46674 2.45673 6.37039C2.91086 5.27403 3.6799 4.33697 4.66659 3.67768C5.65328 3.0184 6.81332 2.6665 8 2.6665C9.18669 2.6665 10.3467 3.0184 11.3334 3.67768C12.3201 4.33697 13.0891 5.27403 13.5433 6.37039C13.9974 7.46674 14.1162 8.67313 13.8847 9.83702C13.6532 11.0009 13.0818 12.07 12.2427 12.9091M10.6667 5.99984L8 8.6665",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconSpeed.displayName = "IconSpeed";
const IconStudy = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 3.33333C8 2.97971 7.85952 2.64057 7.60948 2.39052C7.35943 2.14048 7.02029 2 6.66667 2H2.66667C2.48986 2 2.32029 2.07024 2.19526 2.19526C2.07024 2.32029 2 2.48986 2 2.66667V12C2 12.1768 2.07024 12.3464 2.19526 12.4714C2.32029 12.5964 2.48986 12.6667 2.66667 12.6667H6.66667C7.02029 12.6667 7.35943 12.8071 7.60948 13.0572C7.85952 13.3072 8 13.6464 8 14M8 3.33333C8 2.97971 8.14048 2.64057 8.39052 2.39052C8.64057 2.14048 8.97971 2 9.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V12C14 12.1768 13.9298 12.3464 13.8047 12.4714C13.6797 12.5964 13.5101 12.6667 13.3333 12.6667H9.33333C8.97971 12.6667 8.64057 12.8071 8.39052 13.0572C8.14048 13.3072 8 13.6464 8 14M8 3.33333V14M4.66667 4.66667H5.33333M4.66667 7.33333H5.33333M10.6667 4.66667H11.3333M10.6667 7.33333H11.3333M10.6667 10H11.3333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconStudy.displayName = "IconStudy";
const IconTransfer3 = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M10.666 2L13.3327 4.66667M13.3327 4.66667L10.666 7.33333M13.3327 4.66667H6.66602M5.33268 8.66667L2.66602 11.3333M2.66602 11.3333L5.33268 14M2.66602 11.3333H8.66602",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconTransfer3.displayName = "IconTransfer";
const IconUbuntu = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.13 13.5825C6.30636 13.5825 7.26 12.6289 7.26 11.4525C7.26 10.2761 6.30636 9.3225 5.13 9.3225C3.95364 9.3225 3 10.2761 3 11.4525C3 12.6289 3.95364 13.5825 5.13 13.5825Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M16.575 21.1125C17.7513 21.1125 18.705 20.1588 18.705 18.9825C18.705 17.8061 17.7513 16.8525 16.575 16.8525C15.3987 16.8525 14.445 17.8061 14.445 18.9825C14.445 20.1588 15.3987 21.1125 16.575 21.1125Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M19.995 7.9575C20.64 9.0825 21 10.4025 21 11.8125C21 13.4925 20.475 15.0675 19.575 16.3425",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M6.255 7.5975C7.665 5.3325 10.155 3.8175 13.02 3.8175C13.155 3.8175 13.305 3.8175 13.455 3.8475",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.895 15.3975C7.14 17.9175 9.69 19.6575 12.66 19.7775",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M17.28 7.1475C18.4563 7.1475 19.41 6.19386 19.41 5.0175C19.41 3.84114 18.4563 2.8875 17.28 2.8875C16.1036 2.8875 15.15 3.84114 15.15 5.0175C15.15 6.19386 16.1036 7.1475 17.28 7.1475Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconUbuntu.displayName = "IconUbuntu";
const IconUnlink = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 10L8 8M9.33333 6.66667L10 6M7.33333 4.0002L7.642 3.64287C8.2672 3.01776 9.11513 2.6666 9.99924 2.66667C10.8833 2.66673 11.7312 3.018 12.3563 3.6432C12.9814 4.26841 13.3326 5.11633 13.3325 6.00044C13.3325 6.88455 12.9812 7.73242 12.356 8.35754L12 8.66687M2 2L14 14M8.6666 12L8.40193 12.356C7.76943 12.9815 6.91579 13.3323 6.02627 13.3323C5.13674 13.3323 4.2831 12.9815 3.6506 12.356C3.33884 12.0477 3.09133 11.6807 2.92241 11.2761C2.75348 10.8715 2.6665 10.4374 2.6665 9.999C2.6665 9.56057 2.75348 9.12649 2.92241 8.7219C3.09133 8.31732 3.33884 7.95027 3.6506 7.642L3.99993 7.33333",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
          }
        )
      }
    );
  }
);
IconUnlink.displayName = "IconUnlink";
const IconWindowActive = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 12 12",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M0.5 3.16667H11.1667M3.16667 0.5V3.16667M0.5 1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5H9.83333C10.187 0.5 10.5261 0.640476 10.7761 0.890524C11.0262 1.14057 11.1667 1.47971 11.1667 1.83333V9.83333C11.1667 10.187 11.0262 10.5261 10.7761 10.7761C10.5261 11.0262 10.187 11.1667 9.83333 11.1667H1.83333C1.47971 11.1667 1.14057 11.0262 0.890524 10.7761C0.640476 10.5261 0.5 10.187 0.5 9.83333V1.83333Z",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconWindowActive.displayName = "IconWindowActive";
const IconWindowMinimized = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 13 12",
        fill: "none",
        className,
        style,
        ...props,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M0.5 3.16667H11.1667M5.83333 11.1667H1.83333C1.47971 11.1667 1.14057 11.0262 0.890524 10.7761C0.640476 10.5261 0.5 10.187 0.5 9.83333V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5H9.83333C10.187 0.5 10.5261 0.640476 10.7761 0.890524C11.0262 1.14057 11.1667 1.47971 11.1667 1.83333V7.83333M3.16667 0.5V3.16667M8.5 10.5H12.5",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
);
IconWindowMinimized.displayName = "IconWindowMinimized";
const IconGrid = forwardRef(
  ({ size = 16, color = "currentColor", stroke = 1.5, className, style, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        className,
        style,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M10.3333 4.5H4.5V10.3333H10.3333V4.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M19.5 4.5H13.6667V10.3333H19.5V4.5Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M19.5 13.6667H13.6667V19.5H19.5V13.6667Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M10.3333 13.6667H4.5V19.5H10.3333V13.6667Z",
              stroke: color,
              strokeWidth: stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none"
            }
          )
        ]
      }
    );
  }
);
IconGrid.displayName = "IconGrid";
const Icons = {
  // Navigation & UI
  ChevronLeft: IconChevronLeft,
  ChevronRight: IconChevronRight,
  ChevronDown: IconChevronDown,
  ChevronUp: IconChevronUp,
  DrawerClose: IconLayoutSidebarLeftCollapse,
  ExternalLink: IconExternalLink,
  NewTab: IconExternalLink,
  ExpandOn: IconExpandOn,
  ExpandOff: IconExpandOff,
  PlusCircle: IconCirclePlus,
  Add: IconPlus,
  Search: IconSearch$1,
  Edit: IconPencil,
  Delete: IconTrash,
  Copy: IconCopy$1,
  MoreKebab: IconDotsVertical,
  MoreMeatball: IconDots,
  Dot: IconPoint,
  Action: IconMenu2,
  Setting: IconSettings,
  Sidebar: IconLayoutSidebar,
  Home: IconHome$1,
  Notification: IconBell,
  NotificationNew: IconBellRinging,
  FavoriteOff: IconStar,
  FavoriteOn: IconStarFilled,
  CloseSmall: IconX,
  // Media Controls
  Play: IconPlayerPlay,
  Stop: IconPlayerStop,
  Paused: IconPlayerPause,
  Refresh: IconRefresh$1,
  Deleting: IconTrashX,
  // Status & State
  Error: IconAlertCircle,
  Alert: IconAlertTriangle,
  Info: IconInfoCircle,
  ErrorWarning: IconAlertOctagon,
  Suspended: IconBan,
  Request: IconHelpCircle,
  CheckCircle: IconCircleCheck,
  Check: IconCheck$1,
  Verify: IconShieldCheck,
  Active: IconCircle,
  Deactivated: IconCircleOff,
  Maintenance: IconTool,
  Warning: IconAlertTriangle,
  SecurityError: IconShieldX,
  Inuse: IconPlugConnected,
  Lock: IconLock$1,
  Shelved: IconArchive,
  // Data & View
  List: IconList$1,
  Card: IconLayoutGrid,
  Grid: IconGridDots,
  Upload: IconUpload$1,
  Download: IconDownload$1,
  Publish: IconSend,
  Show: IconEye,
  Hide: IconEyeOff,
  Snapshot: IconCamera,
  Order: IconArrowsSort,
  Chart: IconChartBar,
  Layers: IconStack2,
  Dashboards: IconLayoutDashboard,
  Activity: IconActivity$1,
  // Cloud Infrastructure
  Instances: IconCube,
  Server: IconServer$1,
  Storage: IconDatabase,
  HardDrive: IconDeviceFloppy,
  Networks: IconNetwork$1,
  Network: IconNetwork$1,
  Routers: IconRouter,
  Ports: IconPlug,
  FloatingIp: IconWorldWww,
  LoadBalancer: IconScale,
  Hypervisor: IconServer2,
  SecurityGroup: IconShieldLock,
  KeyPairs: IconKey$1,
  Certificate: IconCertificate$1,
  Key: IconKey$1,
  Security: IconShield,
  Images: IconPhoto,
  Backup: IconDeviceSdCard,
  VolumeType: IconBoxMultiple,
  AddVolume: IconSquarePlus,
  VolumeSearch: IconDatabaseSearch,
  Flavor: IconCpu,
  HostAggregates: IconServerCog,
  CloudComputing: IconCloud,
  Topology: IconTopologyStar3,
  TopologyStar3: IconTopologyStar3,
  // AI & ML
  Brain: IconBrain$1,
  Robot: IconRobotCustom || IconRobot$1,
  RobotOriginal: IconRobot$1,
  AddRobot: IconAddRobotCustom || IconRobotFace,
  AddRobotOriginal: IconRobotFace,
  Puzzle: IconPuzzle$1,
  Chatbot: IconMessageChatbot,
  Finetuning: IconAdjustments,
  Study: IconBook,
  Test: IconTestPipe,
  // Time & Schedule
  Schedule: IconClock,
  History: IconHistory,
  HourglassHigh: IconHourglass,
  ArticleHistory: IconArticle,
  // Files & Templates
  Template: IconTemplate$1,
  File: IconFile$1,
  Plugin: IconPlug,
  Category: IconCategory$1,
  Affiliate: IconAffiliate$1,
  // Communication
  Help: IconHelp$1,
  Chat: IconChat,
  ChatOriginal: IconMessage,
  NewChat: IconMessagePlus,
  Share: IconShare$1,
  // Links & Transfer
  Transfer: IconTransfer$1,
  Link: IconLink$1,
  Unlink: IconLinkOff,
  // Console & Code
  CodeConsole: IconTerminal2,
  Console: IconTerminal,
  DeviceDesktopAnalytics: IconDeviceDesktopAnalytics$1,
  // Other
  Language: IconLanguage$1,
  Zap: IconBolt,
  DollarSign: IconCurrencyDollar,
  Speed: IconGauge,
  Building: IconBuilding$1,
  Branch: IconGitBranch,
  UserCircle: IconUserCircle$1,
  // OS & Platform
  Ubuntu: IconBrandUbuntu,
  Microsoft: IconBrandWindows,
  Rocky: IconCircleDot,
  Other: IconQuestionMark,
  // Newly Added Icons (최하단 - 나중에 정렬 예정)
  Reboot: IconRefreshDot,
  Retry: IconRotateClockwise,
  Pending: IconProgress$1,
  Progress: IconProgress$1,
  Terminate: IconCircleX
};
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-heading-h1",
        "text-heading-h2",
        "text-heading-h3",
        "text-heading-h4",
        "text-heading-h5",
        "text-heading-h6",
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-body-xs",
        "text-label-lg",
        "text-label-md",
        "text-label-sm"
      ]
    }
  }
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center",
    "font-medium",
    "transition-colors duration-[var(--duration-fast)]",
    "focus-visible:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-[var(--color-border-focus)]",
    "focus-visible:ring-offset-1",
    "cursor-pointer",
    "disabled:cursor-not-allowed",
    "rounded-[var(--button-radius)]"
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]",
          "hover:bg-[var(--color-action-primary-hover)]",
          "active:bg-[var(--color-action-primary-active)]",
          "disabled:bg-[var(--color-border-default)] disabled:text-[var(--color-text-subtle)]"
        ],
        secondary: [
          "bg-[var(--color-surface-default)] text-[var(--color-text-default)]",
          "border border-[var(--color-border-strong)]",
          "hover:bg-[var(--button-secondary-hover-bg)]",
          "active:bg-[var(--color-surface-default)]",
          "disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]"
        ],
        outline: [
          "bg-transparent text-[var(--color-text-default)]",
          "border border-[var(--color-border-strong)]",
          "hover:bg-[var(--button-secondary-hover-bg)]",
          "active:bg-[var(--color-surface-default)]",
          "disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]"
        ],
        ghost: [
          "bg-transparent text-[var(--color-text-muted)]",
          "hover:bg-[var(--button-ghost-hover-bg)]",
          "active:bg-[var(--color-border-default)]",
          "disabled:text-[var(--color-text-disabled)]"
        ],
        muted: [
          "bg-[var(--color-surface-default)] text-[var(--color-text-muted)]",
          "border border-[var(--color-border-strong)]",
          "hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] hover:border-[var(--color-border-strong)]",
          "active:bg-[var(--color-surface-default)]",
          "disabled:bg-[var(--color-surface-default)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]"
        ],
        danger: [
          "bg-[var(--color-state-danger)] text-[var(--color-text-on-primary)]",
          "hover:bg-[var(--color-state-danger-hover)]",
          "active:bg-[var(--color-state-danger-active)]",
          "disabled:opacity-50"
        ],
        warning: [
          "bg-[var(--color-state-warning)] text-[var(--color-text-on-primary)]",
          "hover:bg-[var(--color-orange-600)]",
          "active:bg-[var(--color-orange-700)]",
          "disabled:opacity-50"
        ],
        link: [
          "bg-transparent text-[var(--color-action-primary)] p-0 min-w-0 h-auto rounded-none",
          "hover:underline hover:underline-offset-4",
          "active:text-[var(--color-action-primary-active)]",
          "disabled:text-[var(--color-text-disabled)] disabled:no-underline"
        ]
      },
      size: {
        xs: ["h-6", "px-2", "py-1", "gap-1", "min-w-[48px]", "text-body-sm"],
        sm: [
          "h-[var(--button-height-sm)]",
          "px-[var(--button-padding-x-sm)]",
          "py-[var(--button-padding-y-sm)]",
          "gap-[var(--button-gap-sm)]",
          "min-w-[var(--button-min-width-sm)]",
          "text-[length:var(--button-font-size-sm)]",
          "leading-[var(--button-line-height-sm)]"
        ],
        md: [
          "h-[var(--button-height-md)]",
          "px-[var(--button-padding-x-md)]",
          "py-[var(--button-padding-y-md)]",
          "gap-[var(--button-gap-md)]",
          "min-w-[var(--button-min-width-md)]",
          "text-[length:var(--button-font-size-md)]",
          "leading-[var(--button-line-height-md)]"
        ],
        lg: [
          "h-[var(--button-height-lg)]",
          "px-[var(--button-padding-x-lg)]",
          "py-[var(--button-padding-y-lg)]",
          "gap-[var(--button-gap-lg)]",
          "min-w-[var(--button-min-width-lg)]",
          "text-[length:var(--button-font-size-lg)]",
          "leading-[var(--button-line-height-lg)]"
        ]
      },
      fullWidth: {
        true: "w-full"
      },
      iconOnly: {
        true: "min-w-0 p-0"
      }
    },
    compoundVariants: [
      // Icon-only size overrides - using ! to ensure these override size variant classes
      {
        iconOnly: true,
        size: "xs",
        className: "!w-6 !min-w-0 !px-0 !py-0"
      },
      {
        iconOnly: true,
        size: "sm",
        className: "!w-[var(--button-height-sm)] !min-w-0 !px-0 !py-0"
      },
      {
        iconOnly: true,
        size: "md",
        className: "!w-[var(--button-height-md)] !min-w-0 !px-0 !py-0"
      },
      {
        iconOnly: true,
        size: "lg",
        className: "!w-[var(--button-height-lg)] !min-w-0 !px-0 !py-0"
      },
      // Link variant - remove size constraints
      {
        variant: "link",
        size: "xs",
        className: "h-auto min-w-0 px-0 py-0 text-body-sm"
      },
      {
        variant: "link",
        size: "sm",
        className: "h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-sm)]"
      },
      {
        variant: "link",
        size: "md",
        className: "h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-md)]"
      },
      {
        variant: "link",
        size: "lg",
        className: "h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-lg)]"
      }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
const resolveThakiVariant = (variant, appearance) => {
  if (!appearance || appearance === "solid") {
    if (variant === "error") return "danger";
    if (variant === "tertiary") return "secondary";
    if (variant === "success") return "primary";
    return variant;
  }
  if (appearance === "outline") return "outline";
  if (appearance === "ghost") return "ghost";
  return variant;
};
const Button = forwardRef(
  ({
    as,
    variant: rawVariant = "primary",
    appearance,
    size = "md",
    fullWidth,
    iconOnly: _iconOnly,
    // Extract to prevent passing to DOM
    isLoading = false,
    leftIcon,
    rightIcon,
    icon,
    children,
    className,
    disabled,
    "aria-label": ariaLabel,
    ...props
  }, ref) => {
    const variant = resolveThakiVariant(rawVariant, appearance);
    const Component = as || "button";
    const isIconOnly = !!icon;
    const isDisabled = disabled || isLoading;
    const classes = twMerge(
      buttonVariants({
        variant,
        size,
        fullWidth,
        iconOnly: isIconOnly
      }),
      className
    );
    const buttonProps = Component === "button" ? {
      type: props.type || "button"
    } : {};
    return /* @__PURE__ */ jsx(
      Component,
      {
        "data-figma-name": "[TDS] Button",
        ref,
        className: classes,
        disabled: Component === "button" ? isDisabled : void 0,
        "aria-disabled": isDisabled || void 0,
        "aria-busy": isLoading || void 0,
        "aria-label": ariaLabel,
        ...buttonProps,
        ...props,
        children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Spinner, { size }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading..." })
        ] }) : isIconOnly ? /* @__PURE__ */ jsx(
          "span",
          {
            className: "shrink-0 flex items-center justify-center",
            "data-figma-name": "[TDS] Button/Icon",
            children: icon
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          leftIcon && /* @__PURE__ */ jsx("span", { className: "shrink-0", "data-figma-name": "[TDS] Button/LeftIcon", children: leftIcon }),
          children,
          rightIcon && /* @__PURE__ */ jsx("span", { className: "shrink-0", "data-figma-name": "[TDS] Button/RightIcon", children: rightIcon })
        ] })
      }
    );
  }
);
Button.displayName = "Button";
const spinnerSizes$1 = {
  xs: "size-2.5",
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4"
};
const Spinner = memo(function Spinner2({ size }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className: `animate-spin ${spinnerSizes$1[size || "md"]}`,
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false",
      children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ]
    }
  );
});
const variantStyles$2 = {
  default: "bg-[var(--color-surface-muted)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent",
  ghost: "bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent",
  outline: "bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]"
};
const sizeStyles$1 = {
  sm: {
    button: "h-6 px-1.5 text-body-sm gap-1",
    icon: 12
  },
  md: {
    button: "h-8 px-2 text-body-md gap-1.5",
    icon: 14
  },
  lg: {
    button: "h-9 px-2.5 text-body-md gap-2",
    icon: 16
  }
};
const successStyles = "text-[var(--color-state-success)]";
const CopyButton = forwardRef(
  ({
    value,
    variant = "ghost",
    size = "sm",
    copyIcon,
    successIcon,
    label = "Copy",
    successLabel = "Copied!",
    successDuration = 2e3,
    onCopy,
    onError,
    iconOnly = false,
    tooltip,
    className = "",
    disabled,
    ...props
  }, ref) => {
    const [copied, setCopied] = useState(false);
    const sizeConfig = sizeStyles$1[size];
    const handleCopy = useCallback(
      async (event) => {
        event.stopPropagation();
        if (disabled) return;
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          onCopy == null ? void 0 : onCopy(value);
          setTimeout(() => {
            setCopied(false);
          }, successDuration);
        } catch (error) {
          const copyError = error instanceof Error ? error : new Error("Failed to copy");
          onError == null ? void 0 : onError(copyError);
          console.error("Failed to copy:", copyError);
        }
      },
      [value, disabled, onCopy, onError, successDuration]
    );
    const defaultCopyIcon = /* @__PURE__ */ jsx(IconCopy$1, { size: sizeConfig.icon, stroke: 1.5 });
    const defaultSuccessIcon = /* @__PURE__ */ jsx(IconCheck$1, { size: sizeConfig.icon, stroke: 2 });
    const currentIcon = copied ? successIcon ?? defaultSuccessIcon : copyIcon ?? defaultCopyIcon;
    const currentLabel = copied ? successLabel : label;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        "data-figma-name": "[TDS] CopyButton",
        type: "button",
        onClick: handleCopy,
        disabled,
        title: tooltip,
        "aria-label": iconOnly ? currentLabel : void 0,
        className: twMerge(
          "inline-flex items-center justify-center",
          "border rounded-[var(--radius-sm)]",
          "font-medium",
          "transition-colors duration-[var(--duration-fast)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",
          sizeConfig.button,
          variantStyles$2[variant],
          disabled && "opacity-50 cursor-not-allowed",
          iconOnly && "px-1.5",
          className,
          copied && successStyles
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center", children: currentIcon }),
          !iconOnly && /* @__PURE__ */ jsx("span", { children: currentLabel })
        ]
      }
    );
  }
);
CopyButton.displayName = "CopyButton";
const Copyable = forwardRef(
  ({ value, truncate = false, maxWidth, size = "sm", className = "", onCopy }, ref) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        "data-figma-name": "[TDS] Copyable",
        className: twMerge(
          "inline-flex items-center gap-1.5",
          "px-2 py-1",
          "bg-[var(--color-surface-subtle)]",
          "rounded-[var(--radius-sm)]",
          "text-body-md text-[var(--color-text-default)]",
          className
        ),
        style: maxWidth ? { maxWidth } : void 0,
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: twMerge("flex-1", truncate && "truncate"),
              title: truncate ? value : void 0,
              children: value
            }
          ),
          /* @__PURE__ */ jsx(CopyButton, { value, size, iconOnly: true, onCopy })
        ]
      }
    );
  }
);
Copyable.displayName = "Copyable";
const sizes$3 = {
  xs: "h-6 text-body-sm",
  // thaki-ui compatibility
  sm: "h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]",
  md: "h-[var(--input-height-md)] text-[length:var(--input-font-size)]",
  lg: "h-10 text-body-lg"
  // thaki-ui compatibility
};
const Input = forwardRef(
  ({
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    width,
    leftElement,
    rightElement,
    className = "",
    id,
    disabled,
    readOnly,
    required = false,
    // thaki-ui compatibility props (deprecated but supported)
    success,
    filter,
    showPasswordToggle,
    ...props
  }, ref) => {
    if (process.env.NODE_ENV === "development") {
      if (filter)
        console.warn("[Input] filter prop is deprecated. Implement filtering in onChange handler.");
      if (showPasswordToggle)
        console.warn(
          '[Input] showPasswordToggle is deprecated. Use type="password" with a custom rightElement.'
        );
      if (success)
        console.warn("[Input] success prop is deprecated. Use error={false} for valid state.");
    }
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const baseInputStyles = [
      "w-full",
      "px-[var(--input-padding-x)]",
      "py-[var(--input-padding-y)]",
      "leading-[var(--line-height-20)]",
      "bg-[var(--input-bg)]",
      "text-[var(--color-text-default)]",
      "border-[length:var(--input-border-width)]",
      "border-solid",
      "transition-all duration-[var(--duration-fast)]",
      "placeholder:text-[var(--color-text-subtle)]",
      "focus:outline-none"
    ];
    const focusStyles = !readOnly ? [
      "focus:border-[var(--input-border-focus)]",
      "focus:shadow-[0_0_0_1px_var(--input-border-focus)]"
    ] : [];
    const variantStyles2 = {
      default: "rounded-[var(--input-radius)]",
      search: "rounded-[var(--input-radius)]",
      code: "rounded-[var(--input-radius-code)] font-mono"
    };
    const getBorderColor = () => {
      if (error) return "border-[var(--input-border-error)]";
      if (success) return "border-[var(--color-state-success)]";
      if (readOnly) return "border-[var(--input-border-readonly)]";
      return "border-[var(--input-border)]";
    };
    const disabledStyles = disabled ? "bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent" : "";
    const readOnlyStyles = readOnly && !disabled ? "cursor-default" : "";
    const inputClasses = twMerge(
      baseInputStyles.join(" "),
      focusStyles.join(" "),
      sizes$3[size],
      variantStyles2[variant],
      getBorderColor(),
      disabledStyles,
      readOnlyStyles,
      leftElement ? "pl-8" : "",
      rightElement ? "pr-8" : "",
      className
    );
    const widthStyles = {
      xs: "w-[80px]",
      sm: "w-[160px]",
      md: "w-[240px]",
      lg: "w-[360px]",
      half: "w-1/2",
      full: "w-full"
    };
    const getWidthClass = () => {
      if (fullWidth) return "w-full";
      if (width === void 0) return "w-fit";
      if (typeof width === "number") return `w-[${width}px]`;
      return widthStyles[width];
    };
    const wrapperClasses = twMerge(
      "flex flex-col gap-[var(--primitive-spacing-2)]",
      getWidthClass()
    );
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, "data-figma-name": "[TDS] Input", children: [
      label && /* @__PURE__ */ jsxs("label", { htmlFor: inputId, className: `text-label-lg text-[var(--color-text-default)]`, children: [
        label,
        required && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-danger)] ml-0.5", children: "*" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        leftElement && /* @__PURE__ */ jsx("div", { className: "absolute left-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]", children: leftElement }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            id: inputId,
            className: inputClasses,
            disabled,
            readOnly,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0,
            ...props
          }
        ),
        rightElement && /* @__PURE__ */ jsx("div", { className: "absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 flex items-center text-[var(--color-text-subtle)]", children: rightElement })
      ] }),
      helperText && !error && /* @__PURE__ */ jsx("p", { id: `${inputId}-helper`, className: "text-body-sm text-[var(--color-text-subtle)]", children: helperText }),
      typeof error === "string" && error && /* @__PURE__ */ jsx("p", { id: `${inputId}-error`, className: "text-body-sm text-[var(--color-state-danger)]", children: error })
    ] });
  }
);
Input.displayName = "Input";
const Textarea = forwardRef(
  ({
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    showCount = false,
    maxLength,
    className = "",
    id,
    disabled,
    readOnly,
    value,
    defaultValue,
    required = false,
    resize = "none",
    autoResize = false,
    minRows = 3,
    maxRows,
    success,
    autosize,
    onChange,
    ...props
  }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const internalRef = useRef(null);
    const textareaRef = ref || internalRef;
    const shouldAutoResize = autoResize || autosize;
    if (process.env.NODE_ENV === "development") {
      if (success) {
        console.warn("[Textarea] success prop is deprecated. Use error={false} for valid state.");
      }
      if (autosize) {
        console.warn("[Textarea] autosize prop is deprecated. Use autoResize instead.");
      }
    }
    const currentLength = String(value ?? defaultValue ?? "").length;
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea || !shouldAutoResize) return;
      textarea.style.height = "auto";
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const paddingY = parseInt(getComputedStyle(textarea).paddingTop) + parseInt(getComputedStyle(textarea).paddingBottom) || 16;
      const minHeight = lineHeight * minRows + paddingY;
      const maxHeight = maxRows ? lineHeight * maxRows + paddingY : Infinity;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };
    useEffect(() => {
      if (shouldAutoResize) {
        adjustHeight();
      }
    }, [value, shouldAutoResize]);
    const handleChange = (e) => {
      onChange == null ? void 0 : onChange(e);
      if (shouldAutoResize) {
        adjustHeight();
      }
    };
    const resizeStyles = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize"
    };
    const baseStyles = [
      "block w-full",
      "min-h-[var(--textarea-min-height)]",
      "px-[var(--input-padding-x)]",
      "py-[var(--input-padding-y)]",
      "text-[length:var(--input-font-size)]",
      "leading-[var(--input-line-height)]",
      "bg-[var(--input-bg)]",
      "text-[var(--color-text-default)]",
      "border-[length:var(--input-border-width)]",
      "border-solid",
      "transition-all duration-[var(--duration-fast)]",
      "placeholder:text-[var(--color-text-subtle)]",
      "focus:outline-none"
    ];
    const focusStyles = !readOnly ? [
      "focus:border-[var(--input-border-focus)]",
      "focus:shadow-[0_0_0_1px_var(--input-border-focus)]"
    ] : [];
    const variantStyles2 = {
      default: "rounded-[var(--input-radius)]",
      code: "rounded-[var(--input-radius-code)] font-mono"
    };
    const getBorderColor = () => {
      if (error) return "border-[var(--input-border-error)]";
      if (success) return "border-[var(--color-state-success)]";
      if (readOnly) return "border-[var(--input-border-readonly)]";
      return "border-[var(--input-border)]";
    };
    const disabledStyles = disabled ? "bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent resize-none" : "";
    const readOnlyStyles = readOnly && !disabled ? "cursor-default" : "";
    const textareaClasses = twMerge(
      baseStyles.join(" "),
      focusStyles.join(" "),
      variantStyles2[variant],
      getBorderColor(),
      disabledStyles,
      readOnlyStyles,
      !disabled && !shouldAutoResize && resizeStyles[resize],
      shouldAutoResize && "resize-none overflow-hidden",
      className
    );
    const wrapperClasses = ["flex flex-col gap-2", fullWidth ? "w-full" : "w-fit"].join(" ");
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, "data-figma-name": "[TDS] Textarea", children: [
      label && /* @__PURE__ */ jsxs("label", { htmlFor: inputId, className: "text-label-lg text-[var(--color-text-default)]", children: [
        label,
        required && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-danger)] ml-0.5", children: "*" })
      ] }),
      helperText && !error && /* @__PURE__ */ jsx("p", { id: `${inputId}-helper`, className: "text-body-sm text-[var(--color-text-subtle)]", children: helperText }),
      /* @__PURE__ */ jsxs("div", { className: "relative h-fit", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: textareaRef,
            id: inputId,
            className: textareaClasses,
            disabled,
            readOnly,
            maxLength,
            value,
            defaultValue,
            rows: shouldAutoResize ? minRows : props.rows,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0,
            onChange: handleChange,
            ...props
          }
        ),
        showCount && maxLength && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 right-2 text-body-sm text-[var(--color-text-subtle)]", children: [
          currentLength,
          "/",
          maxLength
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("p", { id: `${inputId}-error`, className: "text-body-sm text-[var(--color-state-danger)]", children: error })
    ] });
  }
);
Textarea.displayName = "Textarea";
const NumberInput = forwardRef(
  ({
    label,
    helperText,
    error,
    fullWidth = false,
    width,
    min,
    max,
    step = 1,
    value: controlledValue,
    defaultValue,
    onChange,
    className = "",
    id,
    disabled,
    hideSteppers = false,
    suffix,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isControlled = controlledValue !== void 0;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;
    const clampValue = useCallback(
      (val) => {
        let clamped = val;
        if (min !== void 0 && clamped < min) clamped = min;
        if (max !== void 0 && clamped > max) clamped = max;
        return clamped;
      },
      [min, max]
    );
    const updateValue = useCallback(
      (newValue) => {
        const clamped = clampValue(newValue);
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange == null ? void 0 : onChange(clamped);
      },
      [isControlled, clampValue, onChange]
    );
    const increment = useCallback(() => {
      if (disabled) return;
      updateValue((currentValue ?? 0) + step);
    }, [disabled, currentValue, step, updateValue]);
    const decrement = useCallback(() => {
      if (disabled) return;
      updateValue((currentValue ?? 0) - step);
    }, [disabled, currentValue, step, updateValue]);
    const repeatTimerRef = useRef(null);
    const repeatIntervalRef = useRef(null);
    const directionRef = useRef(null);
    const incrementRef = useRef(increment);
    const decrementRef = useRef(decrement);
    incrementRef.current = increment;
    decrementRef.current = decrement;
    const stopContinuousAction = useCallback(() => {
      if (repeatTimerRef.current) {
        clearTimeout(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
        repeatIntervalRef.current = null;
      }
      directionRef.current = null;
    }, []);
    const startContinuousAction = useCallback(
      (direction) => {
        stopContinuousAction();
        directionRef.current = direction;
        const fire = () => {
          if (directionRef.current === "up") incrementRef.current();
          else if (directionRef.current === "down") decrementRef.current();
        };
        fire();
        repeatTimerRef.current = setTimeout(() => {
          repeatIntervalRef.current = setInterval(fire, 60);
        }, 400);
      },
      [stopContinuousAction]
    );
    useEffect(() => stopContinuousAction, [stopContinuousAction]);
    const handleInputChange = (e) => {
      const val = e.target.value;
      if (val === "") {
        if (!isControlled) {
          setInternalValue(void 0);
        }
        return;
      }
      const newValue = parseFloat(val);
      if (!isNaN(newValue)) {
        updateValue(newValue);
      }
    };
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
    };
    const inputClasses = twMerge(
      "w-full",
      "h-[var(--number-input-height)]",
      "pl-[var(--input-padding-x)]",
      hideSteppers ? "pr-[var(--input-padding-x)]" : "pr-8",
      "py-[var(--number-input-padding-y)]",
      "text-[length:var(--input-font-size)]",
      "leading-[var(--input-line-height)]",
      "bg-[var(--input-bg)]",
      "text-[var(--color-text-default)]",
      "border-[length:var(--input-border-width)]",
      "border-solid",
      "rounded-[var(--input-radius)]",
      "transition-all duration-[var(--duration-fast)]",
      "focus:outline-none",
      // Use box-shadow instead of border-width change to prevent text jumping
      "focus:border-[var(--input-border-focus)]",
      "focus:shadow-[0_0_0_1px_var(--input-border-focus)]",
      "[appearance:textfield]",
      "[&::-webkit-outer-spin-button]:appearance-none",
      "[&::-webkit-inner-spin-button]:appearance-none",
      error ? "border-[var(--input-border-error)]" : "border-[var(--input-border)]",
      disabled ? "bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent" : ""
    );
    const widthStyles = {
      xs: "w-[80px]",
      sm: "w-[160px]",
      md: "w-[240px]",
      lg: "w-[360px]",
      half: "w-1/2",
      full: "w-full"
    };
    const getWidthClass = () => {
      if (fullWidth) return "w-full";
      if (width === void 0) return "w-fit shrink-0";
      if (typeof width === "number") return `w-[${width}px] shrink-0`;
      if (width === "full" || width === "half") return widthStyles[width];
      return `${widthStyles[width]} shrink-0`;
    };
    const wrapperClasses = twMerge(
      "flex flex-col gap-[var(--input-label-gap)]",
      getWidthClass(),
      className
    );
    const buttonClasses = [
      "flex items-center justify-center",
      "w-5 h-[14px]",
      "rounded-[var(--radius-sm)]",
      "text-[var(--color-text-subtle)]",
      "hover:text-[var(--color-text-default)]",
      "hover:bg-[var(--color-surface-muted)]",
      "active:bg-[var(--color-border-subtle)]",
      "transition-colors duration-[var(--duration-fast)]",
      disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
    ].join(" ");
    const coreElement = /* @__PURE__ */ jsxs(Fragment, { children: [
      label && /* @__PURE__ */ jsx("label", { htmlFor: inputId, className: "text-label-lg text-[var(--color-text-default)]", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            type: "number",
            id: inputId,
            className: inputClasses,
            value: currentValue ?? "",
            onChange: handleInputChange,
            onKeyDown: handleKeyDown,
            disabled,
            min,
            max,
            step,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0,
            ...props
          }
        ),
        !hideSteppers && /* @__PURE__ */ jsxs("div", { className: "absolute right-1 top-1/2 -translate-y-1/2 flex flex-col", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: buttonClasses,
              onPointerDown: () => startContinuousAction("up"),
              onPointerUp: stopContinuousAction,
              onPointerLeave: stopContinuousAction,
              disabled: disabled || max !== void 0 && currentValue !== void 0 && currentValue >= max,
              "aria-label": "Increase value",
              children: /* @__PURE__ */ jsx(IconChevronUp, { size: 12, strokeWidth: 2 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: buttonClasses,
              onPointerDown: () => startContinuousAction("down"),
              onPointerUp: stopContinuousAction,
              onPointerLeave: stopContinuousAction,
              disabled: disabled || min !== void 0 && currentValue !== void 0 && currentValue <= min,
              "aria-label": "Decrease value",
              children: /* @__PURE__ */ jsx(IconChevronDown, { size: 12, strokeWidth: 2 })
            }
          )
        ] })
      ] }),
      typeof error === "string" && error && /* @__PURE__ */ jsx("p", { id: `${inputId}-error`, className: "text-body-sm text-[var(--color-state-danger)]", children: error }),
      helperText && !error && /* @__PURE__ */ jsx("p", { id: `${inputId}-helper`, className: "text-body-sm text-[var(--color-text-subtle)]", children: helperText })
    ] });
    if (suffix) {
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: twMerge(
            "flex items-center gap-[var(--primitive-spacing-2)] shrink-0",
            className
          ),
          "data-figma-name": "[TDS] NumberInput",
          children: [
            /* @__PURE__ */ jsx("div", { className: twMerge("flex flex-col gap-[var(--input-label-gap)]", getWidthClass()), children: coreElement }),
            /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)] shrink-0", children: suffix })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsx("div", { className: wrapperClasses, "data-figma-name": "[TDS] NumberInput", children: coreElement });
  }
);
NumberInput.displayName = "NumberInput";
const SearchInput = forwardRef(
  ({
    size: _size,
    label,
    fullWidth = false,
    clearable = true,
    onClear,
    className = "",
    id,
    disabled,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = value !== void 0 ? value : internalValue;
    const hasValue = String(currentValue).length > 0;
    const handleChange = useCallback(
      (e) => {
        if (value === void 0) {
          setInternalValue(e.target.value);
        }
        onChange == null ? void 0 : onChange(e);
      },
      [value, onChange]
    );
    const handleClear = useCallback(() => {
      if (value === void 0) {
        setInternalValue("");
      }
      onClear == null ? void 0 : onClear();
    }, [value, onClear]);
    const widthClassRegex = /\bw-\[?[^\s]+\]?/g;
    const marginClassRegex = /\b(m[tblrxy]?-\[?[^\s]+\]?)/g;
    const widthClasses = className.match(widthClassRegex) || [];
    const marginClasses = className.match(marginClassRegex) || [];
    const hasWidthClass = widthClasses.length > 0;
    const inputClassName = className.replace(widthClassRegex, "").replace(marginClassRegex, "").trim();
    const inputClasses = twMerge(
      "w-full",
      "pl-[var(--input-padding-x)]",
      // Extra padding when both clear button and search icon are shown
      clearable && hasValue && !disabled ? "pr-14" : "pr-8",
      "py-[var(--input-padding-y)]",
      "leading-[var(--input-line-height)]",
      "bg-[var(--input-bg)]",
      "text-[var(--color-text-default)]",
      "border-[length:var(--input-border-width)]",
      "border-solid",
      "border-[var(--input-border)]",
      "rounded-[var(--input-radius)]",
      "transition-all duration-[var(--duration-fast)]",
      "placeholder:text-[var(--color-text-subtle)]",
      "focus:outline-none",
      // Use box-shadow instead of border-width change to prevent text jumping
      "focus:border-[var(--input-border-focus)]",
      "focus:shadow-[0_0_0_1px_var(--input-border-focus)]",
      disabled ? "bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed" : "",
      "h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]",
      inputClassName
    );
    const wrapperClasses = twMerge(
      "flex flex-col gap-[var(--input-label-gap)]",
      // Default to w-full so the input fills its container
      fullWidth || !hasWidthClass ? "w-full" : widthClasses.join(" "),
      marginClasses.join(" ")
    );
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, "data-figma-name": "[TDS] FilterSearchInput", children: [
      label && /* @__PURE__ */ jsx("label", { htmlFor: inputId, className: "text-label-sm text-[var(--color-text-default)]", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            type: "search",
            id: inputId,
            className: inputClasses,
            value: currentValue,
            onChange: handleChange,
            disabled,
            "aria-label": label || "Search",
            ...props
          }
        ),
        clearable && hasValue && !disabled && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            tabIndex: -1,
            className: "absolute right-7 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors duration-[var(--duration-fast)]",
            onClick: handleClear,
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsx(IconX, { size: 12, strokeWidth: 2 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] pointer-events-none", children: /* @__PURE__ */ jsx(IconSearch$1, { size: 12, strokeWidth: 2 }) })
      ] })
    ] });
  }
);
SearchInput.displayName = "SearchInput";
const Chip = memo(function Chip2({
  label,
  value,
  variant = "default",
  onRemove,
  disabled = false,
  icon,
  maxWidth,
  className = "",
  ...props
}) {
  const variantStyles2 = {
    default: `shadow-[inset_0_0_0_1px_var(--chip-border)] pl-[var(--chip-padding-left)] ${onRemove ? "pr-[var(--chip-padding-right)]" : "pr-[var(--chip-padding-left)]"}`,
    selected: `shadow-[inset_0_0_0_1px_var(--chip-border-selected)] pl-[var(--chip-padding-selected)] ${onRemove ? "pr-[var(--chip-padding-right)]" : "pr-[var(--chip-padding-selected)]"}`
  };
  const fullText = label ? `${label}: ${value}` : value;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] Tag",
      className: twMerge(
        "inline-flex items-center gap-[var(--chip-gap)]",
        "py-[var(--chip-padding-y)]",
        "bg-[var(--chip-bg)]",
        "rounded-[var(--chip-radius)]",
        "text-[length:var(--chip-font-size)] leading-[var(--chip-line-height)]",
        "font-medium",
        variantStyles2[variant],
        disabled && "opacity-50 cursor-not-allowed",
        maxWidth && "max-w-full",
        className
      ),
      style: maxWidth ? { maxWidth } : void 0,
      title: fullText,
      ...props,
      children: [
        icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[var(--color-text-default)]", children: icon }),
        /* @__PURE__ */ jsxs("span", { className: twMerge("flex items-center gap-1", maxWidth && "min-w-0 truncate"), children: [
          label && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[var(--color-text-default)] truncate", children: label }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--chip-separator-color)] shrink-0", children: "|" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--color-text-default)] truncate", children: value })
        ] }),
        onRemove && !disabled && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            className: twMerge(
              "shrink-0 p-0.5 -mr-0.5",
              "text-[var(--color-text-default)]",
              "hover:text-[var(--color-text-muted)]",
              "rounded-sm",
              "transition-colors duration-[var(--duration-fast)]",
              "focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)]"
            ),
            "aria-label": `Remove ${label ? `${label}: ${value}` : value}`,
            children: /* @__PURE__ */ jsx(IconX, { size: 12, strokeWidth: 2 })
          }
        )
      ]
    }
  );
});
function FilterDropdown({
  filters,
  onFilterSelect,
  selectedFilter,
  onOptionSelect,
  onBack,
  isOpen,
  listboxId
}) {
  if (!isOpen) return null;
  if (selectedFilter && selectedFilter.type === "select" && selectedFilter.options) {
    return /* @__PURE__ */ jsxs("div", { className: "absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]", children: selectedFilter.label }),
      /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", children: selectedFilter.options.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          role: "option",
          onClick: () => onOptionSelect(option),
          className: "w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",
          children: option.label
        },
        option.value
      )) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--color-border-subtle)]", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-muted)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",
          children: "← Back to filters"
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]", children: "Filter by" }),
    /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", children: filters.map((filter) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "option",
        onClick: () => onFilterSelect(filter),
        className: "w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",
        children: filter.label
      },
      filter.id
    )) })
  ] });
}
const FilterSearchInput = forwardRef(
  ({
    size: _size,
    filters = [],
    appliedFilters = [],
    onFiltersChange,
    onFilterRemove,
    onFiltersClear,
    searchValue = "",
    onSearchChange,
    fullWidth = false,
    clearFiltersLabel = "Clear Filters",
    hideAppliedFilters = false,
    className = "",
    placeholder,
    disabled,
    ...props
  }, ref) => {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listboxId = useId();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
          setSelectedFilter(null);
          setInputValue("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleFocus = useCallback(() => {
      setIsFocused(true);
      if (filters.length > 0) {
        setIsDropdownOpen(true);
      }
    }, [filters.length]);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);
    const handleFilterSelect = useCallback((filter) => {
      var _a;
      setSelectedFilter(filter);
      if (filter.type === "text") {
        setInputValue("");
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    }, []);
    const handleOptionSelect = useCallback(
      (option) => {
        if (!selectedFilter) return;
        const newFilter = {
          id: `${selectedFilter.id}-${Date.now()}`,
          fieldId: selectedFilter.id,
          fieldLabel: selectedFilter.label,
          value: option.value,
          valueLabel: option.label
        };
        const newFilters = [...appliedFilters, newFilter];
        onFiltersChange == null ? void 0 : onFiltersChange(newFilters);
        setSelectedFilter(null);
        setInputValue("");
        setIsDropdownOpen(false);
      },
      [selectedFilter, appliedFilters, onFiltersChange]
    );
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
          if (selectedFilter && selectedFilter.type === "text") {
            const newFilter = {
              id: `${selectedFilter.id}-${Date.now()}`,
              fieldId: selectedFilter.id,
              fieldLabel: selectedFilter.label,
              value: inputValue.trim()
            };
            const newFilters = [...appliedFilters, newFilter];
            onFiltersChange == null ? void 0 : onFiltersChange(newFilters);
            setSelectedFilter(null);
            setInputValue("");
            setIsDropdownOpen(false);
          } else if (!selectedFilter) {
            onSearchChange == null ? void 0 : onSearchChange(inputValue.trim());
          }
        } else if (e.key === "Escape") {
          setIsDropdownOpen(false);
          setSelectedFilter(null);
          setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "" && selectedFilter) {
          setSelectedFilter(null);
        }
      },
      [inputValue, selectedFilter, appliedFilters, onFiltersChange, onSearchChange]
    );
    const handleInputChange = useCallback(
      (e) => {
        setInputValue(e.target.value);
        if (!selectedFilter && filters.length === 0) {
          onSearchChange == null ? void 0 : onSearchChange(e.target.value);
        }
      },
      [selectedFilter, filters.length, onSearchChange]
    );
    const handleBack = useCallback(() => {
      setSelectedFilter(null);
    }, []);
    const handleFilterRemove = useCallback(
      (filterId) => {
        onFilterRemove == null ? void 0 : onFilterRemove(filterId);
        const newFilters = appliedFilters.filter((f) => f.id !== filterId);
        onFiltersChange == null ? void 0 : onFiltersChange(newFilters);
      },
      [appliedFilters, onFilterRemove, onFiltersChange]
    );
    const handleClearFilters = useCallback(() => {
      onFiltersClear == null ? void 0 : onFiltersClear();
      onFiltersChange == null ? void 0 : onFiltersChange([]);
    }, [onFiltersClear, onFiltersChange]);
    const getPlaceholder = () => {
      if (selectedFilter) {
        return selectedFilter.placeholder || `Enter ${selectedFilter.label.toLowerCase()}...`;
      }
      return placeholder || (filters.length > 0 ? "Search by attributes" : "Search...");
    };
    const getInputPrefix = () => {
      if (selectedFilter) {
        return /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm mr-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-default)]", children: selectedFilter.label }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--color-border-strong)]", children: "|" })
        ] });
      }
      return null;
    };
    const widthClassRegex = /\bw-\[?[^\s]+\]?/g;
    const widthClasses = className.match(widthClassRegex) || [];
    const hasWidthClass = widthClasses.length > 0;
    const inputClassName = className.replace(widthClassRegex, "").trim();
    const wrapperClasses = twMerge(
      "flex flex-col gap-2",
      fullWidth || !hasWidthClass ? "w-full" : widthClasses.join(" ")
    );
    const inputContainerClasses = twMerge(
      "flex items-center gap-1",
      "w-full",
      "px-[var(--input-padding-x)]",
      "bg-[var(--input-bg)]",
      "border-[length:var(--input-border-width)]",
      "border-solid",
      "border-[var(--input-border)]",
      "rounded-[var(--input-radius)]",
      "transition-all duration-[var(--duration-fast)]",
      isFocused && "border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]",
      disabled && "bg-[var(--input-bg-disabled)] cursor-not-allowed",
      "h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]",
      inputClassName
    );
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, ref: containerRef, "data-figma-name": "[TDS] FilterSearchInput", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: inputContainerClasses, children: [
          getInputPrefix(),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: (node) => {
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                inputRef.current = node;
              },
              type: "text",
              className: twMerge(
                "flex-1 bg-transparent outline-none",
                "text-[var(--color-text-default)]",
                "placeholder:text-[var(--color-text-subtle)]",
                disabled && "cursor-not-allowed"
              ),
              value: inputValue,
              onChange: handleInputChange,
              onFocus: handleFocus,
              onBlur: handleBlur,
              onKeyDown: handleKeyDown,
              placeholder: getPlaceholder(),
              disabled,
              ...props,
              ...filters.length > 0 ? {
                role: "combobox",
                "aria-expanded": isDropdownOpen && !disabled,
                "aria-haspopup": "listbox",
                "aria-autocomplete": "list",
                "aria-controls": listboxId
              } : {}
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-[var(--color-text-subtle)] pointer-events-none", children: /* @__PURE__ */ jsx(IconSearch$1, { size: 12, strokeWidth: 2 }) })
        ] }),
        filters.length > 0 && /* @__PURE__ */ jsx(
          FilterDropdown,
          {
            filters,
            onFilterSelect: handleFilterSelect,
            selectedFilter,
            onOptionSelect: handleOptionSelect,
            onBack: handleBack,
            isOpen: isDropdownOpen && !disabled,
            listboxId
          }
        )
      ] }),
      !hideAppliedFilters && appliedFilters.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 flex-wrap", children: appliedFilters.map((filter) => /* @__PURE__ */ jsx(
          Chip,
          {
            label: filter.fieldLabel,
            value: filter.valueLabel || filter.value,
            onRemove: () => handleFilterRemove(filter.id)
          },
          filter.id
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClearFilters,
            className: "text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors whitespace-nowrap",
            children: clearFiltersLabel
          }
        )
      ] })
    ] });
  }
);
FilterSearchInput.displayName = "FilterSearchInput";
const sizes$2 = {
  sm: "h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]",
  md: "h-[var(--input-height-md)] text-[length:var(--input-font-size)]"
};
const Password = forwardRef(
  ({
    size = "md",
    label,
    helperText,
    error,
    fullWidth = false,
    showToggle = true,
    showLabel = "Show password",
    hideLabel = "Hide password",
    className = "",
    id,
    disabled,
    readOnly,
    required = false,
    success,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const errorMessage = typeof error === "string" ? error : void 0;
    if (process.env.NODE_ENV === "development") {
      if (success) {
        console.warn("[Password] success prop is deprecated. Use error={false} for valid state.");
      }
    }
    const getBorderColor = () => {
      if (hasError) return "border-[var(--input-border-error)]";
      if (success) return "border-[var(--color-state-success)]";
      if (readOnly) return "border-[var(--input-border-readonly)]";
      return "border-[var(--input-border)]";
    };
    const wrapperClasses = twMerge(
      "flex flex-col gap-[var(--input-label-gap)]",
      fullWidth ? "w-full" : "w-[var(--input-default-width)]"
    );
    const inputContainerClasses = twMerge(
      "flex items-center",
      "w-full",
      sizes$2[size],
      "px-[var(--input-padding-x)]",
      "bg-[var(--input-bg)]",
      "border rounded-[var(--input-radius)]",
      getBorderColor(),
      "transition-colors duration-[var(--duration-fast)]",
      // Focus-within styles
      "focus-within:border-[var(--input-border-focus)]",
      // Disabled styles
      disabled && "bg-[var(--input-bg-disabled)] cursor-not-allowed",
      // Read-only styles
      readOnly && "bg-[var(--input-bg-readonly)]"
    );
    const inputClasses = twMerge(
      "flex-1 h-full",
      "bg-transparent",
      "border-none outline-none",
      "text-[var(--color-text-default)]",
      "placeholder:text-[var(--color-text-subtle)]",
      disabled && "text-[var(--color-text-subtle)] cursor-not-allowed",
      readOnly && "cursor-default",
      className
    );
    const toggleClasses = twMerge(
      "flex items-center justify-center",
      "p-1 ml-2",
      "rounded",
      "text-[var(--color-text-muted)]",
      "hover:text-[var(--color-text-default)]",
      "hover:bg-[var(--color-surface-subtle)]",
      "transition-colors duration-[var(--duration-fast)]",
      "cursor-pointer",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",
      (disabled || readOnly) && "pointer-events-none opacity-50"
    );
    return /* @__PURE__ */ jsxs("div", { "data-figma-name": "[TDS] Password", className: wrapperClasses, children: [
      label && /* @__PURE__ */ jsxs("label", { htmlFor: inputId, className: "text-label-sm text-[var(--color-text-default)]", children: [
        label,
        required && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-danger)] ml-0.5", children: "*" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: inputContainerClasses, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            id: inputId,
            type: showPassword ? "text" : "password",
            disabled,
            readOnly,
            required,
            "aria-invalid": hasError,
            "aria-describedby": errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0,
            className: inputClasses,
            ...props
          }
        ),
        showToggle && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            tabIndex: disabled || readOnly ? -1 : 0,
            onClick: () => setShowPassword(!showPassword),
            "aria-label": showPassword ? hideLabel : showLabel,
            className: toggleClasses,
            children: showPassword ? /* @__PURE__ */ jsx(IconEye, { size: 16, stroke: 1.5 }) : /* @__PURE__ */ jsx(IconEyeOff, { size: 16, stroke: 1.5 })
          }
        )
      ] }),
      helperText && !hasError && /* @__PURE__ */ jsx("p", { id: `${inputId}-helper`, className: "text-body-sm text-[var(--color-text-subtle)]", children: helperText }),
      errorMessage && /* @__PURE__ */ jsx("p", { id: `${inputId}-error`, className: "text-body-sm text-[var(--color-state-danger)]", children: errorMessage })
    ] });
  }
);
Password.displayName = "Password";
const Toggle = forwardRef(
  ({
    label: rawLabel,
    description,
    checked,
    defaultChecked,
    disabled = false,
    onChange,
    className = "",
    id,
    // thaki-ui compatibility props
    checkedLabel,
    uncheckedLabel,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : void 0;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isControlled = checked !== void 0;
    const isChecked = isControlled ? checked : internalChecked;
    const label = rawLabel ?? (isChecked ? checkedLabel : uncheckedLabel);
    const handleChange = (e) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onChange == null ? void 0 : onChange(e);
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: twMerge("flex flex-col gap-[var(--toggle-description-gap)]", className),
        "data-figma-name": "[TDS] Toggle",
        children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: inputId,
              className: twMerge(
                "inline-flex items-center gap-[var(--toggle-gap)] cursor-pointer",
                disabled && "cursor-not-allowed"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref,
                    type: "checkbox",
                    role: "switch",
                    id: inputId,
                    checked: isChecked,
                    disabled,
                    onChange: handleChange,
                    "aria-checked": isChecked,
                    "aria-describedby": descriptionId,
                    className: "sr-only peer",
                    ...props
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: twMerge(
                      "relative shrink-0",
                      "w-[var(--toggle-width)] h-[var(--toggle-height)]",
                      "rounded-[var(--toggle-radius)]",
                      "transition-colors duration-[var(--duration-fast)]",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-border-focus)] peer-focus-visible:ring-offset-2",
                      // Background color based on state
                      isChecked ? disabled ? "bg-[var(--toggle-checked-disabled-bg)]" : "bg-[var(--toggle-checked-bg)]" : disabled ? "bg-[var(--toggle-disabled-bg)]" : "bg-[var(--toggle-bg)]"
                    ),
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: twMerge(
                          "absolute top-[var(--toggle-padding)] left-[var(--toggle-padding)]",
                          "w-[var(--toggle-thumb-size)] h-[var(--toggle-thumb-size)]",
                          "rounded-full",
                          "transition-transform duration-[var(--duration-fast)]",
                          // Thumb color
                          disabled ? "bg-[var(--toggle-thumb-disabled)]" : "bg-[var(--toggle-thumb)]",
                          // Position based on state
                          isChecked && "translate-x-[var(--toggle-thumb-translate)]"
                        )
                      }
                    )
                  }
                ),
                label && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: twMerge(
                      "text-[length:var(--toggle-label-size)] leading-[var(--toggle-label-line-height)] font-normal",
                      disabled ? "text-[var(--toggle-label-disabled)]" : "text-[var(--toggle-label-color)]"
                    ),
                    children: label
                  }
                )
              ]
            }
          ),
          description && /* @__PURE__ */ jsx(
            "p",
            {
              id: descriptionId,
              className: "text-[length:var(--toggle-description-size)] leading-[var(--toggle-description-line-height)] text-[var(--toggle-description-color)] ml-[calc(var(--toggle-width)+var(--toggle-gap))]",
              children: description
            }
          )
        ]
      }
    );
  }
);
Toggle.displayName = "Toggle";
const Checkbox = forwardRef(
  ({
    label,
    description,
    indeterminate = false,
    error = false,
    errorMessage,
    disabled = false,
    checked,
    defaultChecked,
    onChange,
    className = "",
    id,
    multiline,
    ...props
  }, forwardedRef) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : void 0;
    const errorId = errorMessage ? `${inputId}-error` : void 0;
    const internalRef = useRef(null);
    const setRefs = (element) => {
      internalRef.current = element;
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isControlled = checked !== void 0;
    const isCheckedValue = isControlled ? checked : internalChecked;
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    const isChecked = isCheckedValue || indeterminate;
    const handleChange = (e) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };
    const getBoxStyles = () => {
      const base = [
        "relative flex items-center justify-center shrink-0",
        "w-[var(--checkbox-size)] h-[var(--checkbox-size)]",
        "rounded-[var(--checkbox-radius)]",
        "transition-all duration-[var(--duration-fast)]",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-border-focus)] peer-focus-visible:ring-offset-2"
      ];
      if (disabled) {
        if (isChecked) {
          return [...base, "bg-[var(--checkbox-disabled-checked-bg)]"];
        }
        return [
          ...base,
          "bg-[var(--checkbox-disabled-bg)] border border-[var(--checkbox-disabled-border)]"
        ];
      }
      if (error) {
        if (isChecked) {
          return [...base, "bg-[var(--checkbox-error-bg)]"];
        }
        return [...base, "bg-[var(--checkbox-bg)] border-2 border-[var(--checkbox-error-border)]"];
      }
      if (isChecked) {
        return [...base, "bg-[var(--checkbox-checked-bg)]"];
      }
      return [
        ...base,
        "bg-[var(--checkbox-bg)] border border-[var(--checkbox-border)]",
        "group-hover:border-[var(--checkbox-border-hover)]"
      ];
    };
    const getLabelStyles = () => {
      if (disabled) {
        return "text-[var(--checkbox-label-disabled)]";
      }
      if (error) {
        return "text-[var(--checkbox-label-error)]";
      }
      return "text-[var(--checkbox-label-color)]";
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: twMerge("flex flex-col gap-[var(--checkbox-description-gap)]", className),
        "data-figma-name": "[TDS] Checkbox",
        children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: inputId,
              className: twMerge(
                "group inline-flex items-start gap-[var(--checkbox-gap)] cursor-pointer",
                disabled && "cursor-not-allowed"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: setRefs,
                    type: "checkbox",
                    id: inputId,
                    checked: isCheckedValue,
                    disabled,
                    onChange: handleChange,
                    "aria-describedby": [descriptionId, errorId].filter(Boolean).join(" ") || void 0,
                    "aria-invalid": error || void 0,
                    className: "sr-only peer",
                    ...props,
                    "aria-checked": indeterminate ? "mixed" : Boolean(isCheckedValue)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: twMerge(getBoxStyles(), multiline && "mt-[2px]"), children: isChecked && (indeterminate ? /* @__PURE__ */ jsx(
                  IconMinus,
                  {
                    size: 12,
                    strokeWidth: 3,
                    className: disabled ? "text-[var(--checkbox-icon-disabled)]" : "text-[var(--checkbox-icon-color)]"
                  }
                ) : /* @__PURE__ */ jsx(
                  IconCheck$1,
                  {
                    size: 12,
                    strokeWidth: 3,
                    className: disabled ? "text-[var(--checkbox-icon-disabled)]" : "text-[var(--checkbox-icon-color)]"
                  }
                )) }),
                label && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: twMerge(
                      "text-[length:var(--checkbox-label-size)] leading-[var(--checkbox-label-line-height)] font-normal",
                      getLabelStyles()
                    ),
                    children: label
                  }
                )
              ]
            }
          ),
          description && /* @__PURE__ */ jsx(
            "p",
            {
              id: descriptionId,
              className: "text-[length:var(--checkbox-description-size)] leading-[var(--checkbox-description-line-height)] text-[var(--checkbox-description-color)] ml-[calc(var(--checkbox-size)+var(--checkbox-gap))]",
              children: description
            }
          ),
          error && errorMessage && /* @__PURE__ */ jsx(
            "p",
            {
              id: errorId,
              role: "alert",
              className: "text-[length:var(--checkbox-error-size)] leading-[var(--checkbox-error-line-height)] text-[var(--checkbox-error-text)] ml-[calc(var(--checkbox-size)+var(--checkbox-gap))]",
              children: errorMessage
            }
          )
        ]
      }
    );
  }
);
Checkbox.displayName = "Checkbox";
const CheckboxGroupContext = createContext({});
const useCheckboxGroup = () => useContext(CheckboxGroupContext);
function CheckboxGroup({
  label,
  description,
  children,
  name,
  disabled = false,
  error = false,
  errorMessage,
  direction = "vertical",
  className = ""
}) {
  const groupId = useId();
  const labelId = label ? `${groupId}-label` : void 0;
  const descriptionId = description ? `${groupId}-description` : void 0;
  const errorId = errorMessage ? `${groupId}-error` : void 0;
  return /* @__PURE__ */ jsx(CheckboxGroupContext.Provider, { value: { name, disabled, error }, children: /* @__PURE__ */ jsxs(
    "fieldset",
    {
      className: twMerge("flex flex-col", className),
      "aria-labelledby": labelId,
      "aria-describedby": [descriptionId, errorId].filter(Boolean).join(" ") || void 0,
      "aria-invalid": error || void 0,
      disabled,
      children: [
        label && /* @__PURE__ */ jsx(
          "legend",
          {
            id: labelId,
            className: `text-label-lg text-[var(--color-text-default)] ${description ? "mb-[4px]" : "mb-[12px]"}`,
            children: label
          }
        ),
        description && /* @__PURE__ */ jsx("p", { id: descriptionId, className: "text-body-md text-[var(--color-text-subtle)] mb-[12px]", children: description }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "flex",
              direction === "vertical" ? "flex-col gap-[var(--checkbox-group-item-gap)]" : "flex-row flex-wrap gap-[var(--checkbox-group-item-gap-horizontal)]"
            ),
            children
          }
        ),
        error && errorMessage && /* @__PURE__ */ jsx(
          "p",
          {
            id: errorId,
            role: "alert",
            className: "text-[length:var(--checkbox-error-size)] leading-[var(--checkbox-error-line-height)] text-[var(--checkbox-error-text)] mt-[var(--primitive-spacing-2)]",
            children: errorMessage
          }
        )
      ]
    }
  ) });
}
const RadioGroupContext = createContext(null);
const useRadioGroup = () => useContext(RadioGroupContext);
function RadioGroup({
  label,
  description,
  children,
  options,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  direction = "vertical",
  className = ""
}) {
  const groupId = useId();
  const groupName = name ?? groupId;
  const labelId = label ? `${groupId}-label` : void 0;
  const descriptionId = description ? `${groupId}-description` : void 0;
  const errorId = errorMessage ? `${groupId}-error` : void 0;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange == null ? void 0 : onChange(newValue);
  };
  const renderContent = () => {
    if (options && options.length > 0) {
      return options.map((option) => /* @__PURE__ */ jsx(
        Radio,
        {
          value: option.value,
          label: option.label,
          description: option.description,
          disabled: option.disabled
        },
        option.value
      ));
    }
    return children;
  };
  return /* @__PURE__ */ jsx(
    RadioGroupContext.Provider,
    {
      value: {
        name: groupName,
        value: currentValue,
        disabled,
        onChange: handleChange
      },
      children: /* @__PURE__ */ jsxs(
        "fieldset",
        {
          className: twMerge("flex flex-col gap-0", className),
          "aria-labelledby": labelId,
          "aria-describedby": [descriptionId, errorId].filter(Boolean).join(" ") || void 0,
          "aria-invalid": error || void 0,
          disabled,
          children: [
            label && /* @__PURE__ */ jsx(
              "legend",
              {
                id: labelId,
                className: `text-label-lg text-[var(--color-text-default)] ${description ? "mb-[var(--primitive-spacing-1)]" : "mb-[var(--primitive-spacing-3)]"}`,
                children: label
              }
            ),
            description && /* @__PURE__ */ jsx(
              "p",
              {
                id: descriptionId,
                className: "text-body-md text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-3)]",
                children: description
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                role: "radiogroup",
                className: twMerge(
                  "flex",
                  direction === "vertical" ? "flex-col gap-[var(--radio-group-item-gap)]" : "flex-row flex-wrap gap-[var(--radio-group-item-gap-horizontal)]"
                ),
                children: renderContent()
              }
            ),
            error && errorMessage && /* @__PURE__ */ jsx(
              "p",
              {
                id: errorId,
                role: "alert",
                className: "text-body-sm text-[var(--color-state-danger)] mt-[var(--primitive-spacing-2)]",
                children: errorMessage
              }
            )
          ]
        }
      )
    }
  );
}
const Radio = forwardRef(
  ({
    label,
    description,
    value,
    disabled: propDisabled,
    className = "",
    id,
    children,
    multiline,
    ...props
  }, ref) => {
    const displayLabel = label ?? children;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : void 0;
    const groupContext = useRadioGroup();
    const name = props.name ?? (groupContext == null ? void 0 : groupContext.name);
    const disabled = propDisabled ?? (groupContext == null ? void 0 : groupContext.disabled) ?? false;
    const isChecked = groupContext ? groupContext.value === value : props.checked;
    const onChange = (groupContext == null ? void 0 : groupContext.onChange) ?? props.onChange;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: twMerge("flex flex-col gap-[var(--radio-description-gap)]", className),
        "data-figma-name": "[TDS] RadioButton",
        children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: inputId,
              className: twMerge(
                "inline-flex items-start gap-[var(--radio-gap)] cursor-pointer",
                disabled && "cursor-not-allowed"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref,
                    type: "radio",
                    id: inputId,
                    name,
                    value,
                    checked: isChecked,
                    disabled,
                    onChange,
                    "aria-describedby": descriptionId,
                    className: "sr-only peer",
                    ...props
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: twMerge(
                      "shrink-0",
                      multiline && "mt-[2px]",
                      "w-[var(--radio-size)] h-[var(--radio-size)]",
                      "rounded-full",
                      "transition-all duration-[var(--duration-fast)]",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-border-focus)] peer-focus-visible:ring-offset-2",
                      // Border and background based on state
                      disabled ? "bg-[var(--radio-disabled-bg)]" : isChecked ? "border-[length:var(--radio-checked-border-width)] border-[var(--radio-checked-border)] bg-[var(--radio-bg)]" : "border-[length:var(--radio-border-width)] border-[var(--radio-border)] bg-[var(--radio-bg)]"
                    )
                  }
                ),
                displayLabel && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: twMerge(
                      "text-[length:var(--radio-label-size)] leading-[var(--radio-label-line-height)] font-normal",
                      disabled ? "text-[var(--radio-label-disabled)]" : "text-[var(--radio-label-color)]"
                    ),
                    children: displayLabel
                  }
                )
              ]
            }
          ),
          description && /* @__PURE__ */ jsx(
            "p",
            {
              id: descriptionId,
              className: "text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] ml-[calc(var(--radio-size)+var(--radio-gap))]",
              children: description
            }
          )
        ]
      }
    );
  }
);
Radio.displayName = "Radio";
const TabsContext = createContext(null);
const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs provider");
  }
  return context;
};
const variantAliasMap = {
  line: "underline",
  button: "boxed"
};
function Tabs({
  defaultValue,
  value: controlledValue,
  activeTabId,
  onChange,
  size = "sm",
  variant: rawVariant = "underline",
  children,
  className = "",
  ...rest
}) {
  const effectiveControlledValue = controlledValue ?? activeTabId;
  const variant = rawVariant in variantAliasMap ? variantAliasMap[rawVariant] : rawVariant;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = effectiveControlledValue !== void 0;
  const activeTab = isControlled ? effectiveControlledValue : internalValue;
  const setActiveTab = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange == null ? void 0 : onChange(newValue);
  };
  const baseId = useId();
  return /* @__PURE__ */ jsx(TabsContext.Provider, { value: { activeTab, setActiveTab, size, variant, baseId }, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Tabs",
      className: twMerge("flex flex-col h-fit", className),
      ...rest,
      children
    }
  ) });
}
function TabList({ children, className = "", ...rest }) {
  const { variant, setActiveTab } = useTabsContext();
  const handleKeyDown = useCallback(
    (e) => {
      const tablist = e.currentTarget;
      const tabs = Array.from(
        tablist.querySelectorAll('[role="tab"]:not([disabled])')
      );
      if (tabs.length === 0) return;
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex < 0) return;
      let nextIndex = null;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
      }
      if (nextIndex !== null) {
        tabs[nextIndex].focus();
        const tabValue = tabs[nextIndex].getAttribute("data-tab-value");
        if (tabValue) setActiveTab(tabValue);
      }
    },
    [setActiveTab]
  );
  const variantStyles2 = {
    underline: "flex gap-[var(--tabs-gap)] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10",
    boxed: [
      "inline-flex",
      "items-center",
      "gap-1",
      "p-1",
      "h-10",
      "bg-[var(--color-surface-subtle)]",
      "shadow-[inset_0_0_0_1px_var(--color-border-subtle)]",
      "rounded-lg",
      "w-fit"
    ].join(" ")
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Tabs.List",
      ...rest,
      role: "tablist",
      className: twMerge(variantStyles2[variant], className),
      onKeyDown: handleKeyDown,
      children
    }
  );
}
function tabValueIdSegment(value) {
  return value.replace(/\s+/g, "-");
}
function Tab({ value, children, disabled = false, className = "", ...rest }) {
  const { activeTab, setActiveTab, size, variant, baseId } = useTabsContext();
  const isActive = activeTab === value;
  const idSuffix = tabValueIdSegment(value);
  const tabDomId = `${baseId}-tab-${idSuffix}`;
  const panelDomId = `${baseId}-panel-${idSuffix}`;
  const sizeStyles2 = {
    sm: "text-[length:var(--tabs-font-size-sm)] leading-[var(--tabs-line-height-sm)]",
    md: "text-[length:var(--tabs-font-size-md)] leading-[var(--tabs-line-height-md)]"
  };
  if (variant === "underline") {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        "data-figma-name": "[TDS] Tabs.Tab",
        ...rest,
        id: tabDomId,
        role: "tab",
        type: "button",
        "data-tab-value": value,
        tabIndex: isActive ? 0 : -1,
        "aria-selected": isActive,
        "aria-controls": panelDomId,
        "aria-disabled": disabled,
        disabled,
        onClick: () => !disabled && setActiveTab(value),
        className: twMerge(
          "flex flex-col items-center gap-[var(--tabs-indicator-gap)]",
          "min-w-[var(--tabs-min-width)]",
          "cursor-pointer transition-colors duration-[var(--duration-fast)]",
          disabled && "cursor-not-allowed opacity-50",
          className
        ),
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: twMerge(
                "px-[var(--tabs-padding-x)] py-0",
                "font-medium text-center whitespace-nowrap",
                sizeStyles2[size],
                isActive ? "text-[var(--tabs-active-color)]" : "text-[var(--tabs-inactive-color)] hover:text-[var(--tabs-hover-color)]"
              ),
              children
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: twMerge(
                "relative z-20",
                "w-full h-[var(--tabs-indicator-height)]",
                "transition-colors duration-[var(--duration-fast)]",
                isActive ? "bg-[var(--tabs-indicator-color)]" : "bg-transparent"
              )
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-figma-name": "[TDS] Tabs.Tab",
      ...rest,
      id: tabDomId,
      role: "tab",
      type: "button",
      "data-tab-value": value,
      tabIndex: isActive ? 0 : -1,
      "aria-selected": isActive,
      "aria-controls": panelDomId,
      "aria-disabled": disabled,
      disabled,
      onClick: () => !disabled && setActiveTab(value),
      className: twMerge(
        "flex items-center justify-center",
        "min-w-[80px] px-3 h-8",
        "font-medium text-center whitespace-nowrap",
        "rounded-md",
        "cursor-pointer transition-colors duration-[var(--duration-fast)]",
        sizeStyles2[size],
        isActive ? "bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_color-mix(in_srgb,var(--color-text-default)_5%,transparent)] text-[var(--color-action-primary)]" : "bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      ),
      children
    }
  );
}
function TabPanel({ value, children, className = "", ...rest }) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;
  const idSuffix = tabValueIdSegment(value);
  const tabDomId = `${baseId}-tab-${idSuffix}`;
  const panelDomId = `${baseId}-panel-${idSuffix}`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Tabs.Panel",
      ...rest,
      id: panelDomId,
      role: "tabpanel",
      "aria-labelledby": tabDomId,
      "aria-hidden": !isActive,
      className: twMerge("pt-[var(--tabs-panel-padding)]", !isActive && "hidden", className),
      children
    }
  );
}
function Select({
  options,
  placeholder = "Select an option",
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
  fullWidth = false,
  size = "md",
  width = "md",
  className = "",
  required = false,
  clearable = false,
  clearLabel = "Clear"
}) {
  var _a, _b, _c, _d;
  const id = useId();
  const triggerId = `select-trigger-${id}`;
  const listboxId = `select-listbox-${id}`;
  const optionIdPrefix = `select-option-${id}`;
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const containerRef = useRef(null);
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);
  const enabledOptions = options.filter((opt) => !opt.disabled);
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    });
  }, []);
  const openDropdown = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
    const selectedIndex = enabledOptions.findIndex((opt) => opt.value === currentValue);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [disabled, updatePosition, enabledOptions, currentValue]);
  const closeDropdown = useCallback(() => {
    var _a2;
    setIsOpen(false);
    setFocusedIndex(-1);
    (_a2 = triggerRef.current) == null ? void 0 : _a2.focus();
  }, []);
  const selectOption = useCallback(
    (option) => {
      if (option.disabled) return;
      if (!isControlled) {
        setInternalValue(option.value);
      }
      onChange == null ? void 0 : onChange(option.value);
      closeDropdown();
    },
    [isControlled, onChange, closeDropdown]
  );
  const handleClear = useCallback(
    (e) => {
      e == null ? void 0 : e.stopPropagation();
      if (!isControlled) {
        setInternalValue("");
      }
      onChange == null ? void 0 : onChange("");
      closeDropdown();
    },
    [isControlled, onChange, closeDropdown]
  );
  const hasValue = !!currentValue;
  const handleTriggerKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          e.preventDefault();
          openDropdown();
          break;
        case "ArrowUp":
          e.preventDefault();
          openDropdown();
          break;
      }
    },
    [disabled, openDropdown]
  );
  const handleListboxKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= enabledOptions.length ? 0 : next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? enabledOptions.length - 1 : next;
          });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && enabledOptions[focusedIndex]) {
            selectOption(enabledOptions[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    },
    [enabledOptions, focusedIndex, selectOption, closeDropdown]
  );
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      var _a2, _b2;
      if (((_a2 = triggerRef.current) == null ? void 0 : _a2.contains(e.target)) || ((_b2 = listboxRef.current) == null ? void 0 : _b2.contains(e.target))) {
        return;
      }
      closeDropdown();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeDropdown]);
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);
  useEffect(() => {
    if (isOpen && listboxRef.current) {
      listboxRef.current.focus();
    }
  }, [isOpen]);
  const widthStyles = {
    xs: "w-[80px]",
    sm: "w-[160px]",
    md: "w-[240px]",
    lg: "w-[320px]",
    half: "w-1/2",
    full: "w-full"
  };
  const getWidthClass = () => {
    if (fullWidth) return "w-full";
    if (typeof width === "number") return `w-[${width}px]`;
    return widthStyles[width];
  };
  const wrapperClasses = twMerge("flex flex-col gap-[var(--input-label-gap)]", getWidthClass());
  const sizeStyles2 = {
    sm: "h-[var(--input-height-sm)] pl-2 pr-2 text-body-sm leading-4",
    md: "h-[var(--input-height-md)] pl-[var(--select-padding-x)] pr-2 text-[length:var(--select-font-size)] leading-[var(--select-line-height)]"
  };
  const triggerClasses = twMerge(
    "flex items-center justify-between gap-2",
    "w-full",
    sizeStyles2[size],
    "bg-[var(--select-bg)]",
    "border border-solid rounded-[var(--select-radius)]",
    "transition-all duration-[var(--duration-fast)]",
    "cursor-pointer",
    // Border color based on state
    error ? "border-[var(--input-border-error)]" : isOpen ? "border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)]" : "border-[var(--select-border)]",
    // Focus state (keyboard navigation)
    !isOpen && !error && !disabled && "focus:border-[var(--select-border-focus)] focus:shadow-[0_0_0_1px_var(--select-border-focus)]",
    // Disabled
    disabled && "bg-[var(--select-bg-disabled)] border-transparent cursor-not-allowed",
    className
  );
  const dropdownClasses = twMerge(
    "fixed z-[var(--z-popover)]",
    "bg-[var(--select-menu-bg)]",
    "border border-[var(--select-menu-border)]",
    "rounded-[var(--select-menu-radius)]",
    "shadow-[var(--select-menu-shadow)]",
    "overflow-y-auto max-h-[240px]",
    "focus:outline-none"
  );
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: wrapperClasses, "data-figma-name": "[TDS] Dropdown.Select", children: [
    label && /* @__PURE__ */ jsxs("label", { htmlFor: triggerId, className: "text-label-lg text-[var(--color-text-default)]", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-danger)] ml-0.5", children: "*" })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        id: triggerId,
        type: "button",
        role: "combobox",
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        "aria-controls": listboxId,
        "aria-activedescendant": isOpen && focusedIndex >= 0 ? `${optionIdPrefix}-${(_a = enabledOptions[focusedIndex]) == null ? void 0 : _a.value}` : void 0,
        "aria-invalid": !!error,
        disabled,
        onClick: () => isOpen ? closeDropdown() : openDropdown(),
        onKeyDown: handleTriggerKeyDown,
        className: triggerClasses,
        children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: twMerge(
                "truncate flex items-center gap-1.5",
                selectedOption ? "text-[var(--color-text-default)]" : "text-[var(--color-text-muted)]",
                disabled && "text-[var(--color-text-subtle)]"
              ),
              children: [
                (selectedOption == null ? void 0 : selectedOption.icon) && /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center", children: selectedOption.icon }),
                (selectedOption == null ? void 0 : selectedOption.label) ?? placeholder
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            clearable && hasValue && !disabled && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleClear,
                className: "p-0.5 rounded hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors",
                "aria-label": "Clear selection",
                children: /* @__PURE__ */ jsx(IconX, { size: 12, strokeWidth: 2 })
              }
            ),
            /* @__PURE__ */ jsx(
              IconChevronDown,
              {
                size: 16,
                stroke: 1.5,
                className: twMerge(
                  "transition-transform duration-[var(--duration-fast)]",
                  "text-[var(--color-text-default)]",
                  isOpen && "rotate-180",
                  disabled && "text-[var(--color-text-subtle)]"
                )
              }
            )
          ] })
        ]
      }
    ),
    helperText && !error && /* @__PURE__ */ jsx("p", { className: "text-body-sm text-[var(--color-text-subtle)]", children: helperText }),
    typeof error === "string" && error && /* @__PURE__ */ jsx("p", { className: "text-body-sm text-[var(--color-state-danger)]", children: error }),
    isOpen && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-theme": ((_c = (_b = containerRef.current) == null ? void 0 : _b.closest("[data-theme]")) == null ? void 0 : _c.getAttribute("data-theme")) || void 0,
          className: ((_d = containerRef.current) == null ? void 0 : _d.closest('[data-theme="dark"]')) ? "dark" : "",
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              ref: listboxRef,
              id: listboxId,
              role: "listbox",
              "aria-labelledby": triggerId,
              tabIndex: -1,
              onKeyDown: handleListboxKeyDown,
              className: dropdownClasses,
              style: {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width
              },
              children: [
                clearable && /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "option",
                    "aria-selected": false,
                    onClick: () => handleClear(),
                    className: twMerge(
                      "flex items-center justify-between",
                      "px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]",
                      "text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)] font-[number:var(--font-weight-regular)]",
                      "cursor-pointer transition-colors duration-[var(--duration-fast)]",
                      "text-[var(--color-text-muted)] hover:bg-[var(--select-item-hover-bg)] hover:text-[var(--color-text-default)]"
                    ),
                    children: /* @__PURE__ */ jsx("span", { children: clearLabel })
                  }
                ),
                options.map((option, index) => {
                  var _a2;
                  const isSelected = option.value === currentValue;
                  const isFocused = ((_a2 = enabledOptions[focusedIndex]) == null ? void 0 : _a2.value) === option.value;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      id: `${optionIdPrefix}-${option.value}`,
                      role: "option",
                      "aria-selected": isSelected,
                      "aria-disabled": option.disabled,
                      onClick: () => selectOption(option),
                      onMouseEnter: () => {
                        if (!option.disabled) {
                          const enabledIndex = enabledOptions.findIndex(
                            (o) => o.value === option.value
                          );
                          setFocusedIndex(enabledIndex);
                        }
                      },
                      className: twMerge(
                        "flex items-center justify-between",
                        "px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]",
                        "text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)] font-[number:var(--font-weight-regular)]",
                        "cursor-pointer transition-colors duration-[var(--duration-fast)]",
                        // States
                        option.disabled ? "text-[var(--color-text-subtle)] cursor-not-allowed" : isSelected ? "bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]" : isFocused ? "bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)]" : "text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                          option.icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center", children: option.icon }),
                          option.label
                        ] }),
                        isSelected && /* @__PURE__ */ jsx(
                          IconCheck$1,
                          {
                            size: 14,
                            className: "shrink-0 text-[var(--select-item-selected-text)]"
                          }
                        )
                      ]
                    },
                    option.value
                  );
                })
              ]
            }
          )
        }
      ),
      document.body
    )
  ] });
}
const DropdownContext = createContext(null);
const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown.Root");
  }
  return context;
};
function DropdownRoot({
  children,
  value: controlledValue,
  defaultValue = "",
  onChange,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focusedValue, setFocusedValue] = useState("");
  const [options, setOptions] = useState(
    /* @__PURE__ */ new Map()
  );
  const isControlled = controlledValue !== void 0;
  const selectedValue = isControlled ? controlledValue : internalValue;
  const registerOption = useCallback((value, label, disabled2) => {
    setOptions((prev) => {
      const next = new Map(prev);
      next.set(value, { label, disabled: disabled2 });
      return next;
    });
  }, []);
  const unregisterOption = useCallback((value) => {
    setOptions((prev) => {
      const next = new Map(prev);
      next.delete(value);
      return next;
    });
  }, []);
  const onSelect = useCallback(
    (value, _label) => {
      if (!isControlled) {
        setInternalValue(value);
      }
      onChange == null ? void 0 : onChange(value);
      setIsOpen(false);
    },
    [isControlled, onChange]
  );
  const onFocus = useCallback((value) => {
    setFocusedValue(value);
  }, []);
  return /* @__PURE__ */ jsx(
    DropdownContext.Provider,
    {
      value: {
        isOpen,
        selectedValue,
        focusedValue,
        onSelect,
        onFocus,
        registerOption,
        unregisterOption
      },
      children: /* @__PURE__ */ jsx(DropdownStateContext.Provider, { value: { isOpen, setIsOpen, disabled, options }, children })
    }
  );
}
const DropdownStateContext = createContext(null);
const useDropdownState = () => {
  const context = useContext(DropdownStateContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown.Root");
  }
  return context;
};
const DropdownSelect = forwardRef(
  ({
    placeholder = "Select an option",
    children,
    size = "md",
    error = false,
    fullWidth = false,
    width = "md",
    className,
    ...props
  }, ref) => {
    const id = useId();
    const triggerId = `dropdown-trigger-${id}`;
    const listboxId = `dropdown-listbox-${id}`;
    const { selectedValue, focusedValue, onFocus } = useDropdownContext();
    const { isOpen, setIsOpen, disabled, options } = useDropdownState();
    const internalRef = useRef(null);
    const triggerRef = ref || internalRef;
    const listboxRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const selectedOption = options.get(selectedValue);
    const selectedLabel = selectedOption == null ? void 0 : selectedOption.label;
    const updatePosition = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }, [triggerRef]);
    const openDropdown = useCallback(() => {
      if (disabled) return;
      updatePosition();
      setIsOpen(true);
    }, [disabled, updatePosition, setIsOpen]);
    const closeDropdown = useCallback(() => {
      var _a;
      setIsOpen(false);
      (_a = triggerRef.current) == null ? void 0 : _a.focus();
    }, [setIsOpen, triggerRef]);
    const handleKeyDown = useCallback(
      (e) => {
        if (disabled) return;
        const enabledOptions = Array.from(options.entries()).filter(([, opt]) => !opt.disabled);
        const currentIndex = enabledOptions.findIndex(([value]) => value === focusedValue);
        switch (e.key) {
          case "Enter":
          case " ":
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else {
              const nextIndex = currentIndex + 1;
              if (nextIndex < enabledOptions.length) {
                onFocus(enabledOptions[nextIndex][0]);
              }
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (isOpen) {
              const prevIndex = currentIndex - 1;
              if (prevIndex >= 0) {
                onFocus(enabledOptions[prevIndex][0]);
              }
            }
            break;
          case "Escape":
            e.preventDefault();
            closeDropdown();
            break;
        }
      },
      [disabled, options, focusedValue, isOpen, openDropdown, closeDropdown, onFocus]
    );
    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e) => {
        var _a, _b;
        if (((_a = triggerRef.current) == null ? void 0 : _a.contains(e.target)) || ((_b = listboxRef.current) == null ? void 0 : _b.contains(e.target))) {
          return;
        }
        closeDropdown();
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, closeDropdown, triggerRef]);
    useEffect(() => {
      if (!isOpen) return;
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [isOpen, updatePosition]);
    const widthStyles = {
      sm: "w-[160px]",
      md: "w-[240px]",
      lg: "w-[360px]"
    };
    const getWidthClass = () => {
      if (fullWidth) return "w-full";
      if (typeof width === "number") return `w-[${width}px]`;
      return widthStyles[width];
    };
    const sizeStyles2 = {
      sm: "h-[var(--input-height-sm)] px-[var(--primitive-spacing-2)] text-body-sm",
      md: "h-[var(--input-height-md)] px-[var(--select-padding-x)] text-body-md"
    };
    const triggerClasses = twMerge(
      "flex items-center justify-between gap-[var(--primitive-spacing-2)]",
      getWidthClass(),
      sizeStyles2[size],
      "bg-[var(--select-bg)]",
      "border border-solid rounded-[var(--select-radius)]",
      "transition-colors duration-[var(--duration-fast)]",
      "cursor-pointer",
      error ? "border-[var(--input-border-error)]" : isOpen ? "border-[var(--select-border-focus)]" : "border-[var(--select-border)]",
      disabled && "bg-[var(--select-bg-disabled)] border-[var(--color-border-default)] cursor-not-allowed",
      className
    );
    const dropdownClasses = twMerge(
      "fixed z-[var(--z-popover)]",
      "bg-[var(--select-menu-bg)]",
      "border border-[var(--select-menu-border)]",
      "rounded-[var(--select-menu-radius)]",
      "shadow-[var(--select-menu-shadow)]",
      "overflow-hidden",
      "focus:outline-none",
      "py-[var(--primitive-spacing-1)]"
    );
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          id: triggerId,
          type: "button",
          role: "combobox",
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
          "aria-controls": listboxId,
          disabled,
          onClick: () => isOpen ? closeDropdown() : openDropdown(),
          onKeyDown: handleKeyDown,
          className: triggerClasses,
          ...props,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: twMerge(
                  "text-body-md truncate",
                  selectedLabel ? "text-[var(--color-text-default)]" : "text-[var(--color-text-muted)]",
                  disabled && "text-[var(--color-text-subtle)]"
                ),
                children: selectedLabel ?? placeholder
              }
            ),
            /* @__PURE__ */ jsx(
              IconChevronDown,
              {
                size: 16,
                stroke: 1.5,
                className: twMerge(
                  "shrink-0 transition-transform duration-[var(--duration-fast)]",
                  "text-[var(--color-text-default)]",
                  isOpen && "rotate-180",
                  disabled && "text-[var(--color-text-subtle)]"
                )
              }
            )
          ]
        }
      ),
      isOpen && createPortal(
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: listboxRef,
            id: listboxId,
            role: "listbox",
            "aria-labelledby": triggerId,
            tabIndex: -1,
            onKeyDown: handleKeyDown,
            className: dropdownClasses,
            style: {
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width
            },
            children
          }
        ),
        document.body
      )
    ] });
  }
);
DropdownSelect.displayName = "Dropdown.Select";
function DropdownOption({
  value,
  label,
  disabled = false,
  children,
  className,
  ...props
}) {
  const { selectedValue, focusedValue, onSelect, onFocus, registerOption, unregisterOption } = useDropdownContext();
  const displayLabel = label ?? (typeof children === "string" ? children : "");
  const isSelected = selectedValue === value;
  const isFocused = focusedValue === value;
  useEffect(() => {
    registerOption(value, displayLabel, disabled);
    return () => unregisterOption(value);
  }, [value, displayLabel, disabled, registerOption, unregisterOption]);
  const handleClick = () => {
    if (!disabled) {
      onSelect(value, displayLabel);
    }
  };
  const handleMouseEnter = () => {
    if (!disabled) {
      onFocus(value);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "option",
      "aria-selected": isSelected,
      "aria-disabled": disabled,
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      className: twMerge(
        "flex items-center justify-between",
        "px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]",
        "text-body-md",
        "cursor-pointer transition-colors duration-[var(--duration-fast)]",
        disabled ? "text-[var(--color-text-subtle)] cursor-not-allowed" : isSelected ? "bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]" : isFocused ? "bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)]" : "text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "truncate", children }),
        isSelected && /* @__PURE__ */ jsx(IconCheck$1, { size: 14, className: "shrink-0 text-[var(--select-item-selected-text)]" })
      ]
    }
  );
}
function DropdownDivider({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "separator",
      className: twMerge(
        "h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]",
        className
      ),
      ...props
    }
  );
}
function DropdownGroup({ label, children, className, ...props }) {
  return /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": label, className, ...props, children: [
    label && /* @__PURE__ */ jsx("div", { className: "px-[var(--select-item-padding-x)] py-[var(--primitive-spacing-1)] text-label-sm text-[var(--color-text-subtle)]", children: label }),
    children
  ] });
}
const Dropdown = {
  Root: DropdownRoot,
  Select: DropdownSelect,
  Option: DropdownOption,
  Divider: DropdownDivider,
  Group: DropdownGroup
};
function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  disabled = false,
  showValue = false,
  formatValue = (v) => String(v),
  fullWidth = false,
  className = "",
  "aria-label": ariaLabel = "Slider",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const percentage = Math.max(0, Math.min(100, (currentValue - min) / (max - min) * 100));
  const thumbSize = 16;
  const thumbOffset = percentage / 100 * thumbSize;
  const updateValue = useCallback(
    (newValue) => {
      const clampedValue = Math.min(max, Math.max(min, newValue));
      const steppedValue = Math.round(clampedValue / step) * step;
      if (!isControlled) {
        setInternalValue(steppedValue);
      }
      onChange == null ? void 0 : onChange(steppedValue);
    },
    [isControlled, min, max, step, onChange]
  );
  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!trackRef.current) return currentValue;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage2 = (clientX - rect.left) / rect.width;
      return min + percentage2 * (max - min);
    },
    [min, max, currentValue]
  );
  const handleMouseDown = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      updateValue(getValueFromPosition(e.clientX));
    },
    [disabled, getValueFromPosition, updateValue]
  );
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || disabled) return;
      updateValue(getValueFromPosition(e.clientX));
    },
    [isDragging, disabled, getValueFromPosition, updateValue]
  );
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleTouchStart = useCallback(
    (e) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(getValueFromPosition(e.touches[0].clientX));
    },
    [disabled, getValueFromPosition, updateValue]
  );
  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || disabled) return;
      updateValue(getValueFromPosition(e.touches[0].clientX));
    },
    [isDragging, disabled, getValueFromPosition, updateValue]
  );
  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      let newValue = currentValue;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = currentValue + step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = currentValue - step;
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }
      updateValue(newValue);
    },
    [disabled, currentValue, step, min, max, updateValue]
  );
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] Range",
      className: twMerge(
        "flex items-center gap-[var(--slider-gap)]",
        fullWidth && "flex-1 min-w-0",
        disabled && "opacity-50 cursor-not-allowed",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: trackRef,
            className: twMerge(
              "relative h-[var(--slider-track-height)]",
              fullWidth ? "w-full" : "w-[var(--slider-track-width)]",
              "bg-[var(--slider-track-bg)]",
              "rounded-[var(--slider-track-radius)]",
              !disabled && "cursor-pointer"
            ),
            onMouseDown: handleMouseDown,
            onTouchStart: handleTouchStart,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: twMerge(
                    "absolute top-0 left-0 h-full",
                    "bg-[var(--slider-fill-bg)]",
                    "rounded-[var(--slider-track-radius)]",
                    "transition-none"
                  ),
                  style: { width: `calc(${percentage}% - ${thumbOffset - thumbSize / 2}px)` }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  role: "slider",
                  tabIndex: disabled ? -1 : 0,
                  "aria-label": ariaLabel,
                  "aria-valuemin": min,
                  "aria-valuemax": max,
                  "aria-valuenow": currentValue,
                  "aria-disabled": disabled,
                  onKeyDown: handleKeyDown,
                  className: twMerge(
                    "absolute top-1/2",
                    "w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]",
                    "bg-[var(--slider-thumb-bg)]",
                    "border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]",
                    "rounded-full",
                    "shadow-[var(--slider-thumb-shadow)]",
                    "transition-shadow duration-[var(--duration-fast)]",
                    !disabled && "cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",
                    isDragging && !disabled && "cursor-grabbing"
                  ),
                  style: {
                    left: `calc(${percentage}% - ${thumbOffset}px)`,
                    marginTop: "-8px"
                  }
                }
              )
            ]
          }
        ),
        showValue && /* @__PURE__ */ jsx("span", { className: "text-[length:var(--slider-value-font-size)] text-[var(--color-text-default)] font-medium min-w-[3ch] text-right", children: formatValue(currentValue) })
      ]
    }
  );
}
function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = [25, 75],
  onChange,
  disabled = false,
  fullWidth = false,
  className = "",
  "aria-label": ariaLabel = "Range Slider",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [draggingThumb, setDraggingThumb] = useState(null);
  const trackRef = useRef(null);
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const [minValue, maxValue] = currentValue;
  const minPercentage = Math.max(0, Math.min(100, (minValue - min) / (max - min) * 100));
  const maxPercentage = Math.max(0, Math.min(100, (maxValue - min) / (max - min) * 100));
  const thumbSize = 16;
  const minThumbOffset = minPercentage / 100 * thumbSize;
  const maxThumbOffset = maxPercentage / 100 * thumbSize;
  const updateValue = useCallback(
    (newValue) => {
      const clampedMin = Math.min(max, Math.max(min, newValue[0]));
      const clampedMax = Math.min(max, Math.max(min, newValue[1]));
      const steppedMin = Math.round(clampedMin / step) * step;
      const steppedMax = Math.round(clampedMax / step) * step;
      const finalValue = [
        Math.min(steppedMin, steppedMax),
        Math.max(steppedMin, steppedMax)
      ];
      if (!isControlled) {
        setInternalValue(finalValue);
      }
      onChange == null ? void 0 : onChange(finalValue);
    },
    [isControlled, min, max, step, onChange]
  );
  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return min + percentage * (max - min);
    },
    [min, max]
  );
  const getClosestThumb = useCallback(
    (value) => {
      const distToMin = Math.abs(value - minValue);
      const distToMax = Math.abs(value - maxValue);
      return distToMin <= distToMax ? "min" : "max";
    },
    [minValue, maxValue]
  );
  const handleMouseDown = useCallback(
    (e, thumb) => {
      if (disabled) return;
      e.preventDefault();
      const value = getValueFromPosition(e.clientX);
      const activeThumb = thumb ?? getClosestThumb(value);
      setDraggingThumb(activeThumb);
      if (activeThumb === "min") {
        updateValue([value, maxValue]);
      } else {
        updateValue([minValue, value]);
      }
    },
    [disabled, getValueFromPosition, getClosestThumb, updateValue, minValue, maxValue]
  );
  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingThumb || disabled) return;
      const value = getValueFromPosition(e.clientX);
      if (draggingThumb === "min") {
        updateValue([Math.min(value, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(value, minValue)]);
      }
    },
    [draggingThumb, disabled, getValueFromPosition, updateValue, minValue, maxValue]
  );
  const handleMouseUp = useCallback(() => {
    setDraggingThumb(null);
  }, []);
  const handleTouchStart = useCallback(
    (e, thumb) => {
      if (disabled) return;
      const value = getValueFromPosition(e.touches[0].clientX);
      const activeThumb = thumb ?? getClosestThumb(value);
      setDraggingThumb(activeThumb);
      if (activeThumb === "min") {
        updateValue([value, maxValue]);
      } else {
        updateValue([minValue, value]);
      }
    },
    [disabled, getValueFromPosition, getClosestThumb, updateValue, minValue, maxValue]
  );
  const handleTouchMove = useCallback(
    (e) => {
      if (!draggingThumb || disabled) return;
      const value = getValueFromPosition(e.touches[0].clientX);
      if (draggingThumb === "min") {
        updateValue([Math.min(value, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(value, minValue)]);
      }
    },
    [draggingThumb, disabled, getValueFromPosition, updateValue, minValue, maxValue]
  );
  const handleKeyDown = useCallback(
    (e, thumb) => {
      if (disabled) return;
      let newValue;
      const currentThumbValue = thumb === "min" ? minValue : maxValue;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = currentThumbValue + step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = currentThumbValue - step;
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }
      if (thumb === "min") {
        updateValue([Math.min(newValue, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(newValue, minValue)]);
      }
    },
    [disabled, minValue, maxValue, step, min, max, updateValue]
  );
  useEffect(() => {
    if (draggingThumb) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [draggingThumb, handleMouseMove, handleMouseUp, handleTouchMove]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: twMerge(
        "flex items-center gap-[var(--slider-gap)]",
        fullWidth && "flex-1 min-w-0",
        disabled && "opacity-50 cursor-not-allowed",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: trackRef,
          className: twMerge(
            "relative h-[var(--slider-track-height)]",
            fullWidth ? "w-full" : "w-[var(--slider-track-width)]",
            "bg-[var(--slider-track-bg)]",
            "rounded-[var(--slider-track-radius)]",
            !disabled && "cursor-pointer"
          ),
          onMouseDown: (e) => handleMouseDown(e),
          onTouchStart: (e) => handleTouchStart(e),
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: twMerge(
                  "absolute top-0 h-full",
                  "bg-[var(--slider-fill-bg)]",
                  "rounded-[var(--slider-track-radius)]",
                  "transition-none"
                ),
                style: {
                  left: `calc(${minPercentage}% - ${minThumbOffset - thumbSize / 2}px)`,
                  width: `calc(${maxPercentage - minPercentage}% - ${maxThumbOffset - minThumbOffset}px)`
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                role: "slider",
                tabIndex: disabled ? -1 : 0,
                "aria-label": `${ariaLabel} minimum`,
                "aria-valuemin": min,
                "aria-valuemax": maxValue,
                "aria-valuenow": minValue,
                "aria-disabled": disabled,
                onKeyDown: (e) => handleKeyDown(e, "min"),
                onMouseDown: (e) => {
                  e.stopPropagation();
                  handleMouseDown(e, "min");
                },
                onTouchStart: (e) => {
                  e.stopPropagation();
                  handleTouchStart(e, "min");
                },
                className: twMerge(
                  "absolute top-1/2",
                  "w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]",
                  "bg-[var(--slider-thumb-bg)]",
                  "border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]",
                  "rounded-full",
                  "shadow-[var(--slider-thumb-shadow)]",
                  "transition-shadow duration-[var(--duration-fast)]",
                  !disabled && "cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",
                  draggingThumb === "min" && !disabled && "cursor-grabbing",
                  "z-10"
                ),
                style: {
                  left: `calc(${minPercentage}% - ${minThumbOffset}px)`,
                  marginTop: "-8px"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                role: "slider",
                tabIndex: disabled ? -1 : 0,
                "aria-label": `${ariaLabel} maximum`,
                "aria-valuemin": minValue,
                "aria-valuemax": max,
                "aria-valuenow": maxValue,
                "aria-disabled": disabled,
                onKeyDown: (e) => handleKeyDown(e, "max"),
                onMouseDown: (e) => {
                  e.stopPropagation();
                  handleMouseDown(e, "max");
                },
                onTouchStart: (e) => {
                  e.stopPropagation();
                  handleTouchStart(e, "max");
                },
                className: twMerge(
                  "absolute top-1/2",
                  "w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]",
                  "bg-[var(--slider-thumb-bg)]",
                  "border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]",
                  "rounded-full",
                  "shadow-[var(--slider-thumb-shadow)]",
                  "transition-shadow duration-[var(--duration-fast)]",
                  !disabled && "cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",
                  draggingThumb === "max" && !disabled && "cursor-grabbing",
                  "z-10"
                ),
                style: {
                  left: `calc(${maxPercentage}% - ${maxThumbOffset}px)`,
                  marginTop: "-8px"
                }
              }
            )
          ]
        }
      )
    }
  );
}
const variantStyles$1 = {
  default: {
    solid: "bg-[var(--color-surface-muted)] text-[var(--color-text-default)] border-transparent",
    outline: "bg-transparent text-[var(--color-text-default)] border-[var(--color-border-default)]"
  },
  primary: {
    solid: "bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)] border-transparent",
    outline: "bg-transparent text-[var(--color-action-primary)] border-[var(--color-action-primary)]"
  },
  success: {
    solid: "bg-[var(--color-state-success)] text-[var(--color-text-on-primary)] border-transparent",
    outline: "bg-[var(--color-state-success-subtle)] text-[var(--color-state-success)] border-[var(--color-state-success)]"
  },
  warning: {
    solid: "bg-[var(--color-state-warning)] text-[var(--color-text-on-primary)] border-transparent",
    outline: "bg-[var(--color-state-warning-subtle)] text-[var(--color-state-warning)] border-[var(--color-state-warning)]"
  },
  danger: {
    solid: "bg-[var(--color-state-danger)] text-[var(--color-text-on-primary)] border-transparent",
    outline: "bg-[var(--color-state-danger-subtle)] text-[var(--color-state-danger)] border-[var(--color-state-danger)]"
  },
  info: {
    solid: "bg-[var(--color-state-info)] text-[var(--color-text-on-primary)] border-transparent",
    outline: "bg-[var(--color-state-info-subtle)] text-[var(--color-state-info)] border-[var(--color-state-info)]"
  }
};
const sizeStyles = {
  sm: {
    container: "h-5 px-1.5 text-body-xs gap-1",
    icon: 10,
    closeIcon: 10
  },
  md: {
    container: "h-6 px-2 text-body-sm gap-1.5",
    icon: 12,
    closeIcon: 12
  },
  lg: {
    container: "h-7 px-2.5 text-body-md gap-1.5",
    icon: 14,
    closeIcon: 14
  }
};
const Tag = forwardRef(
  ({
    children,
    variant = "default",
    size = "md",
    closable = false,
    onClose,
    icon,
    disabled = false,
    rounded = false,
    outline = false,
    clickable = false,
    className = "",
    onClick,
    ...props
  }, ref) => {
    const isClickable = clickable || !!onClick;
    const sizeConfig = sizeStyles[size];
    const variantConfig = variantStyles$1[variant];
    const handleClose = (e) => {
      e.stopPropagation();
      onClose == null ? void 0 : onClose();
    };
    return /* @__PURE__ */ jsxs(
      "span",
      {
        ref,
        role: isClickable ? "button" : void 0,
        tabIndex: isClickable && !disabled ? 0 : void 0,
        onClick: disabled ? void 0 : onClick,
        onKeyDown: isClickable && !disabled ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick == null ? void 0 : onClick(e);
          }
        } : void 0,
        className: twMerge(
          "inline-flex items-center justify-center",
          "border",
          "font-medium",
          "leading-none",
          "whitespace-nowrap",
          sizeConfig.container,
          outline ? variantConfig.outline : variantConfig.solid,
          rounded ? "rounded-full" : "rounded",
          isClickable && !disabled && "cursor-pointer hover:opacity-80 transition-opacity",
          disabled && "opacity-50 cursor-not-allowed",
          className
        ),
        ...props,
        children: [
          icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center", children: icon }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children }),
          closable && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleClose,
              disabled,
              className: twMerge(
                "shrink-0 flex items-center justify-center",
                "rounded-full",
                "hover:bg-black/10",
                "transition-colors",
                "focus:outline-none",
                disabled && "pointer-events-none"
              ),
              "aria-label": "Remove tag",
              children: /* @__PURE__ */ jsx(IconX, { size: sizeConfig.closeIcon, strokeWidth: 2 })
            }
          )
        ]
      }
    );
  }
);
Tag.displayName = "Tag";
const gapStyles$1 = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-3"
};
const TagGroup = forwardRef(
  ({ gap = "md", children, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: twMerge("flex flex-wrap items-center", gapStyles$1[gap], className),
        ...props,
        children
      }
    );
  }
);
TagGroup.displayName = "TagGroup";
function SelectionIndicator({
  selectedItems = [],
  onRemove,
  emptyText = "No item selected",
  rightContent,
  removable = true,
  error = false,
  errorMessage,
  className,
  ...props
}) {
  const hasSelection = selectedItems.length > 0;
  const showError = error && !hasSelection;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] SelectionIndicator",
      className: twMerge(
        "flex flex-row items-center justify-between gap-4 w-full",
        "h-[42px]",
        "px-[var(--inline-message-padding)] py-0",
        "rounded-[var(--inline-message-radius)]",
        showError ? "bg-[var(--inline-message-error-bg)]" : "bg-[var(--color-surface-subtle)]",
        className
      ),
      role: showError ? "status" : void 0,
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[var(--inline-message-gap)] flex-wrap", children: hasSelection ? selectedItems.map((item) => /* @__PURE__ */ jsx(
          Chip,
          {
            value: item.label,
            variant: "selected",
            onRemove: removable && onRemove ? () => onRemove(item.id) : void 0
          },
          item.id
        )) : showError ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            IconAlertTriangle,
            {
              size: 16,
              className: "text-[var(--inline-message-error-icon)] shrink-0",
              strokeWidth: 1.5
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]", children: errorMessage || emptyText })
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-muted)]", children: emptyText }) }),
        rightContent && /* @__PURE__ */ jsx("div", { className: "flex items-center shrink-0", children: rightContent })
      ]
    }
  );
}
const WEEKDAYS_SUNDAY_START = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_MONDAY_START = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isSameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};
const isDateInRange = (date, start, end) => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
};
const isDateDisabled = (date, minDate, maxDate) => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
};
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};
const generateCalendarDays = (year, month, value, rangeValue, eventDates, minDate, maxDate, firstDayOfWeek = 0) => {
  const days = [];
  const today = /* @__PURE__ */ new Date();
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);
  if (firstDayOfWeek === 1) {
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
  }
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate)
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate)
    });
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate)
    });
  }
  return days;
};
const DatePicker = ({
  mode = "single",
  value = null,
  rangeValue = { start: null, end: null },
  onChange,
  onRangeChange,
  eventDates = [],
  minDate,
  maxDate,
  disabled = false,
  firstDayOfWeek = 0,
  showTime = false,
  timeFormat = "24h",
  timeInputMode = "stepper",
  showActions,
  onApply,
  onCancel,
  className = "",
  // thaki-ui compatibility props
  numberOfMonths,
  isLoading
}) => {
  if (process.env.NODE_ENV === "development") {
    if (numberOfMonths && numberOfMonths > 1)
      console.warn(
        "[DatePicker] numberOfMonths > 1 is not supported. Only single month view is available."
      );
    if (isLoading)
      console.warn(
        "[DatePicker] isLoading prop is deprecated. Handle loading state in parent component."
      );
  }
  const shouldShowActions = showActions ?? showTime;
  const initialDate = value || rangeValue.start || /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectingRangeEnd, setSelectingRangeEnd] = useState(false);
  const [focusedDate, setFocusedDate] = useState(null);
  const gridRef = useRef(null);
  const currentHour24 = value ? value.getHours() : 0;
  const currentMinute = value ? value.getMinutes() : 0;
  const is12h = timeFormat === "12h";
  const currentPeriod = currentHour24 >= 12 ? "PM" : "AM";
  const displayHour = is12h ? currentHour24 % 12 || 12 : currentHour24;
  const ampmOptions = useMemo(
    () => [
      { value: "AM", label: "AM" },
      { value: "PM", label: "PM" }
    ],
    []
  );
  const handleTimeChange = useCallback(
    (hour, minute) => {
      if (!value || mode !== "single") return;
      const updated = new Date(value);
      updated.setHours(hour, minute, 0, 0);
      onChange == null ? void 0 : onChange(updated);
    },
    [value, mode, onChange]
  );
  const handlePeriodChange = useCallback(
    (period) => {
      if (!value || mode !== "single") return;
      const h = value.getHours();
      let newHour;
      if (period === "AM") {
        newHour = h >= 12 ? h - 12 : h;
      } else {
        newHour = h < 12 ? h + 12 : h;
      }
      handleTimeChange(newHour, currentMinute);
    },
    [value, mode, currentMinute, handleTimeChange]
  );
  const handle12hHourChange = useCallback(
    (displayH) => {
      let hour24;
      if (currentPeriod === "AM") {
        hour24 = displayH === 12 ? 0 : displayH;
      } else {
        hour24 = displayH === 12 ? 12 : displayH + 12;
      }
      handleTimeChange(hour24, currentMinute);
    },
    [currentPeriod, currentMinute, handleTimeChange]
  );
  const inlineTimeStr = `${String(is12h ? displayHour : currentHour24).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
  const [inlineTimeInput, setInlineTimeInput] = useState(inlineTimeStr);
  const [inlineTimeFocused, setInlineTimeFocused] = useState(false);
  useEffect(() => {
    if (!inlineTimeFocused) {
      setInlineTimeInput(inlineTimeStr);
    }
  }, [inlineTimeStr, inlineTimeFocused]);
  const commitInlineTime = useCallback(
    (raw) => {
      const match = raw.match(/^(\d{1,2}):(\d{1,2})$/);
      if (!match) return;
      let h = Number(match[1]);
      const m = Math.min(59, Math.max(0, Number(match[2])));
      if (is12h) {
        h = Math.min(12, Math.max(1, h));
        if (currentPeriod === "AM") {
          h = h === 12 ? 0 : h;
        } else {
          h = h === 12 ? 12 : h + 12;
        }
      } else {
        h = Math.min(23, Math.max(0, h));
      }
      handleTimeChange(h, m);
    },
    [is12h, currentPeriod, handleTimeChange]
  );
  const weekdays = firstDayOfWeek === 1 ? WEEKDAYS_MONDAY_START : WEEKDAYS_SUNDAY_START;
  const calendarDays = useMemo(
    () => generateCalendarDays(
      viewYear,
      viewMonth,
      value,
      rangeValue,
      eventDates,
      minDate,
      maxDate,
      firstDayOfWeek
    ),
    [viewYear, viewMonth, value, rangeValue, eventDates, minDate, maxDate, firstDayOfWeek]
  );
  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear]);
  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear]);
  const handleDateClick = useCallback(
    (day) => {
      if (disabled || day.isDisabled) return;
      if (mode === "single") {
        onChange == null ? void 0 : onChange(day.date);
      } else {
        if (!selectingRangeEnd || !rangeValue.start) {
          onRangeChange == null ? void 0 : onRangeChange({ start: day.date, end: null });
          setSelectingRangeEnd(true);
        } else {
          if (day.date < rangeValue.start) {
            onRangeChange == null ? void 0 : onRangeChange({ start: day.date, end: rangeValue.start });
          } else {
            onRangeChange == null ? void 0 : onRangeChange({ start: rangeValue.start, end: day.date });
          }
          setSelectingRangeEnd(false);
        }
      }
    },
    [disabled, mode, onChange, onRangeChange, rangeValue.start, selectingRangeEnd]
  );
  useEffect(() => {
    if (!focusedDate || !gridRef.current) return;
    const dateStr = focusedDate.toISOString().slice(0, 10);
    const btn = gridRef.current.querySelector(`[data-date="${dateStr}"]`);
    btn == null ? void 0 : btn.focus();
  }, [focusedDate]);
  const handleGridKeyDown = useCallback(
    (e) => {
      const target = e.target;
      const dateAttr = target.getAttribute("data-date");
      if (!dateAttr) return;
      const current = /* @__PURE__ */ new Date(dateAttr + "T00:00:00");
      let next = null;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() + 7);
          break;
        case "ArrowUp":
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() - 7);
          break;
        case "Home":
          e.preventDefault();
          next = new Date(current.getFullYear(), current.getMonth(), 1);
          break;
        case "End":
          e.preventDefault();
          next = new Date(
            current.getFullYear(),
            current.getMonth(),
            getDaysInMonth(current.getFullYear(), current.getMonth())
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          {
            const day = calendarDays.find((d) => isSameDay(d.date, current));
            if (day) handleDateClick(day);
          }
          return;
      }
      if (next) {
        if (isDateDisabled(next, minDate, maxDate)) return;
        if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
          setViewYear(next.getFullYear());
          setViewMonth(next.getMonth());
        }
        setFocusedDate(next);
      }
    },
    [calendarDays, handleDateClick, minDate, maxDate, viewMonth, viewYear]
  );
  const monthYearText = useMemo(() => {
    const year = viewYear;
    const month = String(viewMonth + 1).padStart(2, "0");
    return `${year}.${month}`;
  }, [viewYear, viewMonth]);
  const calendarWidth = 7 * 32 + 6 * 6 + 2 * 12;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] DatePicker",
      className: `
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        ${disabled ? "opacity-50 pointer-events-none" : ""}
        ${className}
      `,
      style: { width: calendarWidth },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handlePrevMonth,
              disabled,
              className: "\n            flex items-center justify-center\n            w-6 h-6\n            text-[var(--color-text-default)]\n            hover:bg-[var(--datepicker-hover-bg)]\n            rounded-[var(--radius-button)]\n            transition-colors duration-[var(--duration-fast)]\n          ",
              "aria-label": "Previous month",
              children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 12, stroke: 1 })
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "\n          w-[64px]\n          text-heading-h5\n          text-[var(--color-text-default)]\n          text-left\n          select-none\n        ",
              children: monthYearText
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleNextMonth,
              disabled,
              className: "\n            flex items-center justify-center\n            w-6 h-6\n            text-[var(--color-text-default)]\n            hover:bg-[var(--datepicker-hover-bg)]\n            rounded-[var(--radius-button)]\n            transition-colors duration-[var(--duration-fast)]\n          ",
              "aria-label": "Next month",
              children: /* @__PURE__ */ jsx(IconChevronRight, { size: 12, stroke: 1 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[var(--datepicker-row-gap)]", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: weekdays.map((day, index) => {
            const isFirstCol = index === 0;
            const isLastCol = index === 6;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: "\n                  w-[var(--datepicker-cell-size)]\n                  px-2 py-0.5\n                  text-label-sm\n                  text-[var(--color-text-muted)]\n                  text-center\n                  select-none\n                ",
                style: {
                  paddingLeft: isFirstCol ? 8 : 3 + 8,
                  paddingRight: isLastCol ? 8 : 3 + 8
                },
                children: day
              },
              day
            );
          }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: gridRef,
              role: "group",
              "aria-label": "Calendar dates",
              className: "grid grid-cols-7",
              onKeyDown: handleGridKeyDown,
              children: calendarDays.map((day, index) => {
                const isSelected = day.isSelected || day.isRangeStart || day.isRangeEnd;
                const hasCompleteRange = rangeValue.start && rangeValue.end;
                const isInRange = hasCompleteRange && (day.isInRange || day.isRangeStart || day.isRangeEnd);
                const colIndex = index % 7;
                const isFirstCol = colIndex === 0;
                const isLastCol = colIndex === 6;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "relative",
                    style: {
                      // Add gap spacing via padding
                      paddingLeft: isFirstCol ? 0 : 3,
                      paddingRight: isLastCol ? 0 : 3,
                      marginBottom: index < 35 ? 6 : 0
                    },
                    children: [
                      hasCompleteRange && isInRange && !day.isRangeStart && !day.isRangeEnd && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute bg-[var(--datepicker-range-bg)]",
                          style: {
                            top: 0,
                            bottom: 0,
                            left: isFirstCol ? 0 : -3,
                            right: isLastCol ? 0 : -3
                          }
                        }
                      ),
                      hasCompleteRange && day.isRangeStart && !isSameDay(rangeValue.start, rangeValue.end) && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute bg-[var(--datepicker-range-bg)]",
                          style: {
                            top: 0,
                            bottom: 0,
                            left: 16,
                            right: isLastCol ? 0 : -3
                          }
                        }
                      ),
                      hasCompleteRange && day.isRangeEnd && !isSameDay(rangeValue.start, rangeValue.end) && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute bg-[var(--datepicker-range-bg)]",
                          style: {
                            top: 0,
                            bottom: 0,
                            left: isFirstCol ? 0 : -3,
                            right: 16
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          "data-date": `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`,
                          tabIndex: focusedDate ? isSameDay(day.date, focusedDate) ? 0 : -1 : day.isSelected || day.isToday && day.isCurrentMonth ? 0 : -1,
                          onClick: () => handleDateClick(day),
                          disabled: disabled || day.isDisabled,
                          className: `
                    relative z-10
                    flex flex-col items-center justify-center
                    w-[var(--datepicker-cell-size)]
                    h-[var(--datepicker-cell-size)]
                    p-2
                    text-label-md
                    rounded-full
                    transition-colors duration-[var(--duration-fast)]
                    outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]
                    ${isSelected ? "bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]" : day.isCurrentMonth ? "text-[var(--color-text-default)] hover:bg-[var(--datepicker-hover-bg)]" : "text-[var(--color-text-muted)] hover:bg-[var(--datepicker-hover-bg)]"}
                    ${day.isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${day.isToday && !isSelected ? "ring-1 ring-[var(--color-action-primary)]" : ""}
                  `,
                          "aria-label": day.date.toLocaleDateString(),
                          "aria-pressed": isSelected,
                          children: [
                            day.day,
                            day.hasEvent && /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `
                        absolute bottom-1
                        w-1 h-1
                        rounded-full
                        ${isSelected ? "bg-[var(--color-text-on-primary)]" : "bg-[var(--color-action-primary)]"}
                      `
                              }
                            )
                          ]
                        }
                      )
                    ]
                  },
                  index
                );
              })
            }
          )
        ] }),
        showTime && mode === "single" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-[var(--color-border-subtle)]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-label-sm text-[var(--color-text-muted)] select-none", children: [
            /* @__PURE__ */ jsx(IconClock, { size: 12, stroke: 2 }),
            "Time"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 ml-auto", children: [
            timeInputMode === "inline" ? /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inlineTimeFocused ? inlineTimeInput : inlineTimeStr,
                onChange: (e) => setInlineTimeInput(e.target.value),
                onFocus: () => {
                  setInlineTimeFocused(true);
                  setInlineTimeInput(inlineTimeStr);
                },
                onBlur: () => {
                  commitInlineTime(inlineTimeInput);
                  setInlineTimeFocused(false);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    commitInlineTime(inlineTimeInput);
                    e.target.blur();
                  }
                },
                disabled: disabled || !value,
                placeholder: "HH:MM",
                "aria-label": "Time",
                className: "w-[60px] h-8 px-2 text-body-sm text-center text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_1px_var(--color-border-focus)] transition-all duration-[var(--duration-fast)] disabled:opacity-50 disabled:cursor-not-allowed"
              }
            ) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                NumberInput,
                {
                  value: displayHour,
                  onChange: is12h ? handle12hHourChange : (v) => handleTimeChange(v, currentMinute),
                  min: is12h ? 1 : 0,
                  max: is12h ? 12 : 23,
                  step: 1,
                  disabled: disabled || !value,
                  width: 64,
                  "aria-label": "Hour"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-muted)] select-none", children: ":" }),
              /* @__PURE__ */ jsx(
                NumberInput,
                {
                  value: currentMinute,
                  onChange: (v) => handleTimeChange(currentHour24, v),
                  min: 0,
                  max: 59,
                  step: 1,
                  disabled: disabled || !value,
                  width: 64,
                  "aria-label": "Minute"
                }
              )
            ] }),
            is12h && /* @__PURE__ */ jsx(
              Select,
              {
                options: ampmOptions,
                value: currentPeriod,
                onChange: handlePeriodChange,
                disabled: disabled || !value,
                size: "md",
                width: 68,
                "aria-label": "AM/PM"
              }
            )
          ] })
        ] }),
        shouldShowActions && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "\n              flex-1\n              h-[var(--button-height-sm)]\n              text-[length:var(--button-font-size-sm)]\n              leading-[var(--button-line-height-sm)]\n              font-medium\n              text-[var(--color-text-default)]\n              bg-[var(--color-surface-default)]\n              border border-[var(--color-border-strong)]\n              rounded-[var(--button-radius)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--button-secondary-hover-bg)]\n            ",
              onClick: onCancel,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `
              flex-1
              h-[var(--button-height-sm)]
              text-[length:var(--button-font-size-sm)]
              leading-[var(--button-line-height-sm)]
              font-medium
              text-[var(--color-text-on-primary)]
              bg-[var(--color-action-primary)]
              rounded-[var(--button-radius)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-action-primary-hover)]
              ${!value ? "opacity-50 cursor-not-allowed" : ""}
            `,
              disabled: !value,
              onClick: () => value && (onApply == null ? void 0 : onApply(value)),
              children: "Apply"
            }
          )
        ] })
      ]
    }
  );
};
const MONTH_ABBR$1 = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const formatDateForDisplay$1 = (date) => {
  if (!date) return "";
  const month = MONTH_ABBR$1[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
const DateRangePicker = ({
  value,
  onChange,
  onApply,
  onCancel,
  minDate,
  maxDate,
  className = ""
}) => {
  const [tempStart, setTempStart] = useState((value == null ? void 0 : value.start) ?? null);
  const [tempEnd, setTempEnd] = useState((value == null ? void 0 : value.end) ?? null);
  const [selectingStart, setSelectingStart] = useState(true);
  const handleRangeChange = useCallback(
    (range2) => {
      setTempStart(range2.start);
      setTempEnd(range2.end);
      setSelectingStart(!range2.start || !!range2.end);
      onChange == null ? void 0 : onChange(range2);
    },
    [onChange]
  );
  const handleApply = useCallback(() => {
    if (tempStart && tempEnd) {
      onApply == null ? void 0 : onApply({ start: tempStart, end: tempEnd });
    }
  }, [tempStart, tempEnd, onApply]);
  const canApply = tempStart !== null && tempEnd !== null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        w-fit
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: `
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${selectingStart ? "bg-[var(--color-action-primary-subtle)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]" : "bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]"}
          `,
              onClick: () => setSelectingStart(true),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5", children: "START" }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]", children: formatDateForDisplay$1(tempStart) })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "px-2 text-[12px] text-[var(--color-text-subtle)]", children: "~" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: `
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${!selectingStart ? "bg-[var(--color-action-primary-subtle)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]" : "bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]"}
          `,
              onClick: () => setSelectingStart(false),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5", children: "END" }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]", children: formatDateForDisplay$1(tempEnd) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          DatePicker,
          {
            mode: "range",
            rangeValue: { start: tempStart, end: tempEnd },
            onRangeChange: handleRangeChange,
            minDate,
            maxDate,
            className: "!border-0 !p-0"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "\n            flex-1\n            h-[var(--button-height-sm)]\n            text-[length:var(--button-font-size-sm)]\n            leading-[var(--button-line-height-sm)]\n            font-medium\n            text-[var(--color-text-default)]\n            bg-[var(--color-surface-default)]\n            border border-[var(--color-border-strong)]\n            rounded-[var(--button-radius)]\n            transition-colors duration-[var(--duration-fast)]\n            hover:bg-[var(--button-secondary-hover-bg)]\n          ",
              onClick: onCancel,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `
            flex-1
            h-[var(--button-height-sm)]
            text-[length:var(--button-font-size-sm)]
            leading-[var(--button-line-height-sm)]
            font-medium
            text-[var(--color-text-on-primary)]
            bg-[var(--color-action-primary)]
            rounded-[var(--button-radius)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--color-action-primary-hover)]
            ${!canApply ? "opacity-50 cursor-not-allowed" : ""}
          `,
              disabled: !canApply,
              onClick: handleApply,
              children: "Apply"
            }
          )
        ] })
      ]
    }
  );
};
const WindowControl = ({
  type,
  onClick,
  disabled = false,
  className = ""
}) => {
  const iconSize = 12;
  const strokeWidth = 1;
  const renderIcon = () => {
    switch (type) {
      case "minimize":
        return /* @__PURE__ */ jsx(IconMinus, { size: iconSize, stroke: strokeWidth });
      case "maximize":
        return /* @__PURE__ */ jsx(IconSquare, { size: iconSize, stroke: strokeWidth });
      case "close":
        return /* @__PURE__ */ jsx(IconX, { size: iconSize, stroke: strokeWidth });
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-figma-name": "[TDS] FrameControls",
      type: "button",
      onClick,
      disabled,
      className: `
        flex items-center justify-center
        w-[var(--window-control-size)]
        h-[var(--window-control-size)]
        rounded-[var(--window-control-radius)]
        text-[var(--color-text-default)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface-subtle)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `,
      "aria-label": type,
      children: renderIcon()
    }
  );
};
const WindowControls = ({
  showMinimize = true,
  showMaximize = true,
  showClose = true,
  onMinimize,
  onMaximize,
  onClose,
  disabled = false,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] FrameControls",
      className: `flex items-center gap-[var(--window-control-gap)] ${className}`,
      children: [
        showMinimize && /* @__PURE__ */ jsx(WindowControl, { type: "minimize", onClick: onMinimize, disabled }),
        showMaximize && /* @__PURE__ */ jsx(WindowControl, { type: "maximize", onClick: onMaximize, disabled }),
        showClose && /* @__PURE__ */ jsx(WindowControl, { type: "close", onClick: onClose, disabled })
      ]
    }
  );
};
const ContextMenuItemComponent = ({ item, onClose, parentDirection: _parentDirection = "right", itemId }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [submenuDirection, setSubmenuDirection] = useState("right");
  const itemRef = useRef(null);
  const submenuRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  useEffect(() => {
    if (showSubmenu && submenuRef.current && itemRef.current) {
      const submenuRect = submenuRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const preferredDirection = item.submenuDirection || "right";
      let newX = submenuPosition.x;
      let newY = submenuPosition.y;
      let newDirection = preferredDirection;
      if (preferredDirection === "left") {
        newX = itemRect.left - submenuRect.width - 4;
        newDirection = "left";
        if (newX < 8) {
          newX = 8;
        }
      } else {
        newX = itemRect.right + 4;
        newDirection = "right";
        if (newX + submenuRect.width > viewportWidth - 8) {
          newX = itemRect.left - submenuRect.width - 4;
          newDirection = "left";
          if (newX < 8) {
            newX = 8;
          }
        }
      }
      if (newY + submenuRect.height > viewportHeight - 8) {
        newY = Math.max(8, viewportHeight - submenuRect.height - 8);
      }
      if (newX !== submenuPosition.x || newY !== submenuPosition.y) {
        setSubmenuPosition({ x: newX, y: newY });
      }
      setSubmenuDirection(newDirection);
    }
  }, [showSubmenu, submenuPosition.x, submenuPosition.y, item.submenuDirection]);
  useEffect(() => {
    if (!item.submenu) return;
    const handleCloseOtherSubmenus = (e) => {
      var _a;
      if (((_a = e.detail) == null ? void 0 : _a.itemId) === itemId) return;
      setShowSubmenu(false);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
    window.addEventListener("close-context-submenus", handleCloseOtherSubmenus);
    return () => {
      window.removeEventListener(
        "close-context-submenus",
        handleCloseOtherSubmenus
      );
    };
  }, [item.submenu, itemId]);
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (item.submenu && itemRef.current) {
      window.dispatchEvent(new CustomEvent("close-context-submenus", { detail: { itemId } }));
      const rect = itemRef.current.getBoundingClientRect();
      const direction = item.submenuDirection || "right";
      if (direction === "left") {
        setSubmenuPosition({
          x: rect.left - 4,
          // Temporary, will be adjusted
          y: rect.top - 1
        });
        setSubmenuDirection("left");
      } else {
        setSubmenuPosition({
          x: rect.right + 4,
          y: rect.top - 1
        });
        setSubmenuDirection("right");
      }
      setShowSubmenu(true);
    }
  };
  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowSubmenu(false);
    }, 150);
  };
  const handleSubmenuMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };
  const handleSubmenuMouseLeave = () => {
    setShowSubmenu(false);
  };
  const handleClick = () => {
    var _a;
    if (item.disabled) return;
    if (!item.submenu) {
      (_a = item.onClick) == null ? void 0 : _a.call(item);
      onClose();
    }
  };
  const handleMouseDown = (e) => {
    var _a;
    if (e.button !== 0) return;
    if (item.disabled) return;
    if (!item.submenu) {
      e.preventDefault();
      (_a = item.onClick) == null ? void 0 : _a.call(item);
      onClose();
    }
  };
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  const menuItem = /* @__PURE__ */ jsxs(
    "div",
    {
      ref: itemRef,
      role: "menuitem",
      tabIndex: -1,
      title: typeof item.tooltip === "string" ? item.tooltip : void 0,
      "aria-disabled": item.disabled || void 0,
      "aria-haspopup": hasSubmenu ? "menu" : void 0,
      "aria-expanded": hasSubmenu ? showSubmenu : void 0,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onClick: handleClick,
      className: `
        flex items-center justify-between
        min-w-[var(--context-menu-min-width)]
        px-[var(--context-menu-padding-x)]
        py-[var(--context-menu-padding-y)]
        text-body-sm
        whitespace-nowrap
        cursor-pointer
        transition-colors duration-[var(--duration-fast)]
        outline-none
        ${item.divider ? "border-b border-[var(--color-border-subtle)]" : ""}
        ${item.status === "danger" ? "text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] focus-visible:bg-[var(--color-state-danger-bg)]" : "text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] focus-visible:bg-[var(--context-menu-hover-bg)]"}
        ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${showSubmenu ? "bg-[var(--context-menu-hover-bg)]" : ""}
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
          item.icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[var(--color-text-muted)] flex items-center", children: item.icon }),
          /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label })
        ] }),
        hasSubmenu && /* @__PURE__ */ jsx(IconChevronRight, { size: 12, stroke: 1, className: "ml-6 shrink-0" })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    menuItem,
    showSubmenu && item.submenu && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: submenuRef,
          onMouseDown: (e) => e.stopPropagation(),
          onClick: (e) => e.stopPropagation(),
          onMouseEnter: handleSubmenuMouseEnter,
          onMouseLeave: handleSubmenuMouseLeave,
          className: "\n            fixed\n            flex flex-col\n            bg-[var(--color-surface-default)]\n            border border-[var(--color-border-strong)]\n            rounded-[var(--context-menu-radius)]\n            shadow-[var(--shadow-md)]\n            overflow-hidden\n            z-[calc(var(--z-context-menu)+1)]\n            max-h-[calc(100vh-16px)]\n            overflow-y-auto\n          ",
          style: {
            left: submenuPosition.x,
            top: submenuPosition.y
          },
          children: item.submenu.map((subItem) => /* @__PURE__ */ jsx(
            ContextMenuItemComponent,
            {
              item: subItem,
              onClose,
              parentDirection: submenuDirection,
              itemId: subItem.id
            },
            subItem.id
          ))
        }
      ),
      document.body
    )
  ] });
};
const ContextMenuContent = ({
  items,
  position,
  onClose,
  parentDirection = "right",
  menuRef: externalMenuRef,
  triggerRef,
  minTop,
  align = "left",
  triggerWidth = 0
}) => {
  const internalMenuRef = useRef(null);
  const menuRef = externalMenuRef ?? internalMenuRef;
  const [adjustedPosition, setAdjustedPosition] = useState(null);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let newX;
        if (align === "right") {
          newX = position.x + triggerWidth - rect.width;
        } else {
          newX = position.x;
        }
        let newY = position.y;
        if (newX + rect.width > viewportWidth - 8) {
          newX = viewportWidth - rect.width - 8;
        }
        if (newX < 8) {
          newX = 8;
        }
        if (position.y + rect.height > viewportHeight - 8) {
          newY = Math.max(8, viewportHeight - rect.height - 8);
        }
        if (minTop !== void 0 && newY < minTop) {
          newY = minTop;
        }
        setAdjustedPosition({ x: newX, y: newY });
      }
    });
  }, [position, triggerRef, minTop, align, triggerWidth]);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const firstItem = menuRef.current.querySelector('[role="menuitem"]');
        firstItem == null ? void 0 : firstItem.focus();
      }
    });
  }, []);
  const handleMenuKeyDown = useCallback(
    (e) => {
      const menu2 = menuRef.current;
      if (!menu2) return;
      const menuItems = Array.from(
        menu2.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
      );
      if (menuItems.length === 0) return;
      const currentIndex = menuItems.indexOf(document.activeElement);
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[next].focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prev].focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          menuItems[0].focus();
          break;
        }
        case "End": {
          e.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
        }
        case "Escape": {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (currentIndex >= 0) {
            menuItems[currentIndex].click();
          }
          break;
        }
      }
    },
    [onClose]
  );
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-figma-name": "[TDS] ContextMenu",
        ref: menuRef,
        role: "menu",
        "aria-orientation": "vertical",
        onMouseDown: (e) => e.stopPropagation(),
        onClick: (e) => e.stopPropagation(),
        onKeyDown: handleMenuKeyDown,
        className: "\n        fixed z-[var(--z-context-menu)]\n        flex flex-col\n        bg-[var(--color-surface-default)]\n        border border-[var(--color-border-strong)]\n        rounded-[var(--context-menu-radius)]\n        shadow-[var(--shadow-md)]\n        overflow-hidden\n        transition-opacity duration-[var(--duration-fast)]\n        outline-none\n      ",
        style: {
          left: (adjustedPosition == null ? void 0 : adjustedPosition.x) ?? position.x,
          top: (adjustedPosition == null ? void 0 : adjustedPosition.y) ?? position.y,
          opacity: adjustedPosition ? 1 : 0
        },
        tabIndex: -1,
        children: items.map((item) => /* @__PURE__ */ jsx(
          ContextMenuItemComponent,
          {
            item,
            onClose,
            parentDirection,
            itemId: item.id
          },
          item.id
        ))
      }
    ),
    document.body
  );
};
const ContextMenu = ({
  items,
  children,
  trigger = "contextmenu",
  disabled = false,
  className = "",
  minTop,
  align = "left",
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [triggerWidth, setTriggerWidth] = useState(0);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const previousFocusRef = useRef(null);
  const handleOpen = useCallback(
    (e) => {
      if (disabled) return;
      previousFocusRef.current = document.activeElement;
      if (trigger === "contextmenu") {
        e.preventDefault();
        const closeEvent = new CustomEvent("contextmenu:close-all");
        document.dispatchEvent(closeEvent);
        setPosition({ x: e.clientX, y: e.clientY });
        setTriggerWidth(0);
        setIsOpen(true);
      } else {
        if (isOpen) {
          setIsOpen(false);
          return;
        }
        if (triggerRef.current) {
          const triggerElement = triggerRef.current.firstElementChild;
          const rect = (triggerElement == null ? void 0 : triggerElement.getBoundingClientRect()) ?? triggerRef.current.getBoundingClientRect();
          setPosition({
            x: rect.left,
            y: rect.bottom + 4
          });
          setTriggerWidth(rect.width);
        }
        setIsOpen(true);
      }
    },
    [disabled, trigger, isOpen]
  );
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
      try {
        previousFocusRef.current.focus();
      } catch {
      }
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      var _a, _b;
      if (!isOpen) return;
      const target = e.target;
      if ((_a = triggerRef.current) == null ? void 0 : _a.contains(target)) return;
      if ((_b = menuRef.current) == null ? void 0 : _b.contains(target)) return;
      if (triggerRef.current) {
        handleClose();
      }
    };
    const handleEscape = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleClose();
      }
    };
    const handleCloseAll = () => {
      if (isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }, 0);
    }
    document.addEventListener("contextmenu:close-all", handleCloseAll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("contextmenu:close-all", handleCloseAll);
    };
  }, [isOpen, handleClose]);
  const triggerProps = trigger === "contextmenu" ? { onContextMenu: handleOpen } : { onClickCapture: handleOpen };
  return /* @__PURE__ */ jsxs("div", { ref: triggerRef, className: `inline-block w-fit ${className}`, ...rest, ...triggerProps, children: [
    children,
    isOpen && /* @__PURE__ */ jsx(
      ContextMenuContent,
      {
        items,
        position,
        onClose: handleClose,
        menuRef,
        triggerRef,
        minTop,
        align,
        triggerWidth
      }
    )
  ] });
};
const thakiVariantToStatus = {
  success: "success",
  error: "danger",
  warning: "warning"
};
const DEFAULT_THRESHOLDS = { warning: 70, danger: 90 };
const STATUS_THRESHOLDS = {
  compute: DEFAULT_THRESHOLDS,
  computeAdmin: DEFAULT_THRESHOLDS,
  storage: DEFAULT_THRESHOLDS,
  container: DEFAULT_THRESHOLDS,
  default: DEFAULT_THRESHOLDS
};
const getStatus = (usedPercent, totalPercent, isUnlimited, thresholds = DEFAULT_THRESHOLDS) => {
  if (isUnlimited) {
    return { usedStatus: "neutral", newStatus: "neutral" };
  }
  const { warning: warning2, danger } = thresholds;
  if (usedPercent >= danger) {
    return { usedStatus: "danger", newStatus: "danger" };
  }
  if (totalPercent >= danger) {
    if (usedPercent < warning2) {
      return { usedStatus: "success", newStatus: "danger" };
    }
    return { usedStatus: "danger", newStatus: "danger" };
  }
  if (totalPercent >= warning2) {
    if (usedPercent < warning2) {
      return { usedStatus: "success", newStatus: "warning" };
    }
    return { usedStatus: "warning", newStatus: "warning" };
  }
  return { usedStatus: "success", newStatus: "success" };
};
const getStatusColor = (status, isLight = false) => {
  const colors2 = {
    success: {
      default: "var(--color-state-success)",
      light: "var(--color-green-300)"
    },
    warning: {
      default: "var(--color-state-warning)",
      light: "var(--color-orange-300)"
    },
    danger: {
      default: "var(--color-state-danger)",
      light: "var(--color-red-300)"
    },
    info: {
      default: "var(--color-state-info)",
      light: "var(--color-blue-300)"
    },
    neutral: {
      default: "var(--color-border-default)",
      light: "var(--color-border-subtle)"
    }
  };
  return isLight ? colors2[status].light : colors2[status].default;
};
const ProgressBar$1 = ({
  value,
  max,
  newValue = 0,
  variant = "default",
  label,
  showValue = true,
  error = false,
  errorMessage,
  statusText,
  status: rawStatus,
  className = "",
  size = "md",
  thresholds,
  // thaki-ui compatibility props
  thakiVariant,
  color,
  pendingColor,
  ...rest
}) => {
  const status = rawStatus ?? (thakiVariant ? thakiVariantToStatus[thakiVariant] : void 0);
  if (process.env.NODE_ENV === "development") {
    if (color) console.warn("[ProgressBar] color prop is deprecated. Use status prop instead.");
    if (pendingColor)
      console.warn("[ProgressBar] pendingColor prop is deprecated. Use status prop instead.");
  }
  const [showTooltip, setShowTooltip] = useState(false);
  const isUnlimited = max === void 0 || max === Infinity;
  const total = max || 100;
  const usedPercent = isUnlimited ? 50 : Math.min(value / total * 100, 100);
  const newPercent = isUnlimited ? 0 : Math.min(newValue / total * 100, 100 - usedPercent);
  const totalPercent = usedPercent + newPercent;
  const { usedStatus, newStatus } = error ? { usedStatus: "danger", newStatus: "danger" } : getStatus(value / total * 100, (value + newValue) / total * 100, isUnlimited, thresholds);
  if (variant === "quota") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-figma-name": "[TDS] ProgressBar",
        className: `flex flex-col gap-1.5 w-full ${className}`,
        ...rest,
        children: [
          (label || showValue) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            label && /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-default)]", children: label }),
            showValue && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-body-sm text-[var(--color-text-default)]", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                value + newValue,
                "/"
              ] }),
              isUnlimited ? /* @__PURE__ */ jsx(IconInfinity, { size: 12, stroke: 1 }) : /* @__PURE__ */ jsx("span", { children: max })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative h-[var(--progress-bar-height)] w-full",
              onMouseEnter: () => setShowTooltip(true),
              onMouseLeave: () => setShowTooltip(false),
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 rounded-[var(--progress-bar-radius)]",
                    style: {
                      backgroundColor: "var(--color-border-subtle)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `absolute inset-y-0 left-0 z-[3] ${newValue > 0 ? "rounded-l-[var(--progress-bar-radius)]" : "rounded-[var(--progress-bar-radius)]"}`,
                    style: {
                      width: `${usedPercent}%`,
                      backgroundColor: getStatusColor(usedStatus),
                      minWidth: usedPercent > 0 ? 4 : 0
                    }
                  }
                ),
                newValue > 0 && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-y-0 rounded-r-[var(--progress-bar-radius)] z-[2]",
                    style: {
                      left: `${usedPercent}%`,
                      width: `${newPercent}%`,
                      backgroundColor: getStatusColor(newStatus),
                      opacity: 0.3,
                      minWidth: newPercent > 0 ? 4 : 0
                    }
                  }
                ),
                showTooltip && newValue > 0 && /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-10", children: /* @__PURE__ */ jsxs("div", { className: "relative bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-body-sm px-2 py-1 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "w-[6px] h-[6px] rounded-full",
                          style: { backgroundColor: getStatusColor(usedStatus) }
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "Used: ",
                        value
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "w-[6px] h-[6px] rounded-full",
                          style: { backgroundColor: getStatusColor(newStatus), opacity: 0.3 }
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "New: ",
                        newValue
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0",
                      style: {
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "4px solid var(--tooltip-bg)"
                      }
                    }
                  )
                ] }) })
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] ProgressBar",
      className: `flex flex-col gap-1.5 w-full ${className}`,
      ...rest,
      children: [
        (label || statusText || showValue) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            label && /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: label }),
            error && /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                IconAlertCircle,
                {
                  size: 12,
                  stroke: 1,
                  className: "text-[var(--color-state-danger)]"
                }
              ),
              errorMessage && /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-body-sm px-2 py-1 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)] whitespace-nowrap", children: errorMessage }) })
            ] })
          ] }),
          statusText && /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: statusText })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-[var(--progress-bar-height)] w-full", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 rounded-[var(--progress-bar-radius)]",
              style: {
                backgroundColor: "var(--color-border-subtle)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-y-0 left-0 rounded-[var(--progress-bar-radius)] z-[2]",
              style: {
                width: `${Math.min(totalPercent, 100)}%`,
                backgroundColor: error ? getStatusColor("danger") : status || thresholds ? getStatusColor(usedStatus) : "var(--color-action-primary)",
                minWidth: totalPercent > 0 ? 4 : 0
              }
            }
          )
        ] })
      ]
    }
  );
};
const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
const DOTS = "dots";
const Pagination = ({
  currentPage: rawCurrentPage,
  currentAt,
  totalPages: rawTotalPages,
  totalCount,
  size: pageSize,
  onPageChange,
  siblingCount = 1,
  // showFirstLast = true, // Reserved for future use
  disabled = false,
  showSettings = false,
  onSettingsClick,
  totalItems,
  selectedCount = 0,
  className = "",
  ...rest
}) => {
  const currentPage = rawCurrentPage ?? currentAt ?? 1;
  const totalPages = rawTotalPages ?? (totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 0);
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    return [];
  }, [totalPages, siblingCount, currentPage]);
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };
  const handlePageClick = (page) => {
    if (!disabled && page !== currentPage) {
      onPageChange(page);
    }
  };
  const isEmpty = totalPages <= 0;
  const baseButtonClass = `
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    leading-[var(--pagination-line-height)]
    font-medium
    rounded-[var(--pagination-radius)]
    transition-colors duration-[var(--duration-fast)]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-focus)]
  `;
  const pageButtonClass = `
    ${baseButtonClass}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `;
  const activePageClass = `
    ${baseButtonClass}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `;
  const navButtonClass = `
    ${baseButtonClass}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `;
  const dotsClass = `
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "data-figma-name": "[TDS] Pagination",
      "aria-label": "Pagination",
      className: `inline-flex items-center gap-[var(--pagination-gap)] ${className}`,
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handlePrevious,
            disabled: disabled || isEmpty || currentPage === 1,
            className: navButtonClass,
            "aria-label": "Previous page",
            children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 14, stroke: 1 })
          }
        ),
        !isEmpty && paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return /* @__PURE__ */ jsx("span", { className: dotsClass, children: "···" }, `dots-${index}`);
          }
          const page = pageNumber;
          const isActive = page === currentPage;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handlePageClick(page),
              disabled,
              className: isActive ? activePageClass : pageButtonClass,
              "aria-label": `Page ${page}`,
              "aria-current": isActive ? "page" : void 0,
              children: page
            },
            page
          );
        }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleNext,
            disabled: disabled || isEmpty || currentPage === totalPages,
            className: navButtonClass,
            "aria-label": "Next page",
            children: /* @__PURE__ */ jsx(IconChevronRight, { size: 14, stroke: 1 })
          }
        ),
        showSettings && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onSettingsClick,
            disabled,
            className: navButtonClass,
            "aria-label": "Pagination settings",
            children: /* @__PURE__ */ jsx(IconSettings, { size: 16, stroke: 1 })
          }
        ),
        totalItems !== void 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-[var(--color-border-default)]" }),
          /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: selectedCount > 0 ? /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--color-text-default)] font-medium", children: [
              selectedCount,
              " selected"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--color-text-muted)]", children: [
              " / ",
              totalItems,
              " items"
            ] })
          ] }) : `${totalItems} items` })
        ] })
      ]
    }
  );
};
const TopBar = ({
  onSidebarToggle,
  onBack,
  onForward,
  canGoBack = true,
  canGoForward = true,
  breadcrumb,
  actions,
  showSidebarToggle = false,
  showSidebarToggleAfterBreadcrumb = false,
  showNavigation = true,
  className = ""
}) => {
  const iconButtonClass = `
    inline-flex items-center justify-center
    size-[var(--topbar-button-size)]
    rounded-[var(--topbar-button-radius)]
    text-[var(--color-text-muted)]
    transition-colors duration-[var(--duration-fast)]
    hover:bg-[var(--topbar-button-hover-bg)]
    hover:text-[var(--color-text-default)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-focus)]
  `;
  return /* @__PURE__ */ jsxs(
    "header",
    {
      "data-figma-name": "[TDS] ToolBar",
      className: `
        flex items-center
        w-full
        h-[var(--topbar-height)]
        px-[var(--topbar-padding-x)]
        gap-[var(--topbar-gap)]
        bg-[var(--color-surface-default)]
        border-b border-[var(--color-border-default)]
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[var(--topbar-section-gap)]", children: [
          (showSidebarToggle || showSidebarToggleAfterBreadcrumb) && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onSidebarToggle,
              className: iconButtonClass,
              "aria-label": "Toggle sidebar",
              children: /* @__PURE__ */ jsx(IconLayoutSidebar, { size: 14, stroke: 1.5 })
            }
          ),
          showNavigation && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[var(--topbar-nav-gap)]", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onBack,
                disabled: !canGoBack,
                className: iconButtonClass,
                "aria-label": "Go back",
                children: /* @__PURE__ */ jsx(IconArrowLeft, { size: 12, stroke: 1.5 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onForward,
                disabled: !canGoForward,
                className: iconButtonClass,
                "aria-label": "Go forward",
                children: /* @__PURE__ */ jsx(IconArrowRight, { size: 12, stroke: 1.5 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 flex items-center gap-[var(--topbar-section-gap)]", children: breadcrumb }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[var(--topbar-action-gap)]", children: actions })
      ]
    }
  );
};
const TopBarAction = ({
  icon,
  onClick,
  "aria-label": ariaLabel,
  disabled = false,
  badge: badge2 = false,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      className: `
        relative
        inline-flex items-center justify-center
        size-[var(--topbar-button-size)]
        rounded-[var(--topbar-button-radius)]
        text-[var(--color-text-muted)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--topbar-button-hover-bg)]
        hover:text-[var(--color-text-default)]
        disabled:text-[var(--color-text-disabled)]
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-border-focus)]
        ${className}
      `,
      "aria-label": ariaLabel,
      children: [
        icon,
        badge2 && /* @__PURE__ */ jsx(
          "span",
          {
            className: "\n            absolute\n            top-1 right-1\n            size-[6px]\n            bg-[var(--color-state-danger)]\n            rounded-full\n          "
          }
        )
      ]
    }
  );
};
/**
 * react-router v7.13.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(
        route.children,
        branches,
        routesMeta,
        path,
        hasParentOptionalSegments
      );
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _a;
    if (route.path === "" || !((_a = route.path) == null ? void 0 : _a.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo2, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = toPathname.replace(/\/\/+/g, "/");
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m) => m.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
  let to = _to;
  if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) {
    return {
      absoluteURL: void 0,
      isExternal: false,
      to
    };
  }
  let absoluteURL = to;
  let isExternal = false;
  if (isBrowser) {
    try {
      let currentUrl = new URL(window.location.href);
      let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
      let path = stripBasename(targetUrl.pathname, basename);
      if (targetUrl.origin === currentUrl.origin && path != null) {
        to = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    } catch (e) {
      warning(
        false,
        `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  }
  return {
    absoluteURL,
    isExternal,
    to
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
new Set(validRequestMethodsArr);
var DataRouterContext = React3.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = React3.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = React3.createContext(false);
var ViewTransitionContext = React3.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = React3.createContext(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = React3.createContext(null);
AwaitContext.displayName = "Await";
var NavigationContext = React3.createContext(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = React3.createContext(
  null
);
LocationContext.displayName = "Location";
var RouteContext = React3.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = React3.createContext(null);
RouteErrorContext.displayName = "RouteError";
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(28));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") {
        return parsed;
      }
    } catch {
    }
  }
}
function decodeRouteErrorResponseDigest(digest) {
  if (digest.startsWith(
    `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`
  )) {
    try {
      let parsed = JSON.parse(digest.slice(40));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") {
        return new ErrorResponseImpl(
          parsed.status,
          parsed.statusText,
          parsed.data
        );
      }
    } catch {
    }
  }
}
function useHref(to, { relative } = {}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator: navigator2 } = React3.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return React3.useContext(LocationContext) != null;
}
function useLocation() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return React3.useContext(LocationContext).location;
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = React3.useContext(NavigationContext).static;
  if (!isStatic) {
    React3.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = React3.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = React3.useContext(DataRouterContext);
  let { basename, navigator: navigator2 } = React3.useContext(NavigationContext);
  let { matches } = React3.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = React3.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React3.useCallback(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator2.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator2.replace : navigator2.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator2,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
React3.createContext(null);
function useResolvedPath(to, { relative } = {}) {
  let { matches } = React3.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return React3.useMemo(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutesImpl(routes, locationArg, dataRouterState, onError, future) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator: navigator2 } = React3.useContext(NavigationContext);
  let { matches: parentMatches } = React3.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location;
  {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location.pathname}${location.search}${location.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    onError,
    future
  );
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ React3.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React3.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React3.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React3.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ React3.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ React3.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends React3.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "React Router caught the following error during render",
        error
      );
    }
  }
  render() {
    let error = this.state.error;
    if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
      const decoded = decodeRouteErrorResponseDigest(error.digest);
      if (decoded) error = decoded;
    }
    let result = error !== void 0 ? /* @__PURE__ */ React3.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ React3.createElement(
      RouteErrorContext.Provider,
      {
        value: error,
        children: this.props.component
      }
    )) : this.props.children;
    if (this.context) {
      return /* @__PURE__ */ React3.createElement(RSCErrorHandler, { error }, result);
    }
    return result;
  }
};
RenderErrorBoundary.contextType = RSCRouterContext;
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
function RSCErrorHandler({
  children,
  error
}) {
  let { basename } = React3.useContext(NavigationContext);
  if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
    let redirect2 = decodeRedirectErrorDigest(error.digest);
    if (redirect2) {
      let existingRedirect = errorRedirectHandledMap.get(error);
      if (existingRedirect) throw existingRedirect;
      let parsed = parseToInfo(redirect2.location, basename);
      if (isBrowser && !errorRedirectHandledMap.get(error)) {
        if (parsed.isExternal || redirect2.reloadDocument) {
          window.location.href = parsed.absoluteURL || parsed.to;
        } else {
          const redirectPromise = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(parsed.to, {
              replace: redirect2.replace
            })
          );
          errorRedirectHandledMap.set(error, redirectPromise);
          throw redirectPromise;
        }
      }
      return /* @__PURE__ */ React3.createElement(
        "meta",
        {
          httpEquiv: "refresh",
          content: `0;url=${parsed.absoluteURL || parsed.to}`
        }
      );
    }
  }
  return children;
}
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = React3.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React3.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, onErrorHandler = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState == null ? void 0 : dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== void 0
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
    var _a, _b;
    onErrorHandler(error, {
      location: dataRouterState.location,
      params: ((_b = (_a = dataRouterState.matches) == null ? void 0 : _a[0]) == null ? void 0 : _b.params) ?? {},
      unstable_pattern: getRoutePattern(dataRouterState.matches),
      errorInfo
    });
  } : void 0;
  return renderedMatches.reduceRight(
    (outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce(
              "route-fallback",
              false,
              "No `HydrateFallback` element provided to render during initial hydration"
            );
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ React3.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ React3.createElement(
          RenderedRoute,
          {
            match,
            routeContext: {
              outlet,
              matches: matches2,
              isDataRoute: dataRouterState != null
            },
            children
          }
        );
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React3.createElement(
        RenderErrorBoundary,
        {
          location: dataRouterState.location,
          revalidation: dataRouterState.revalidation,
          component: errorElement,
          error,
          children: getChildren(),
          routeContext: { outlet: null, matches: matches2, isDataRoute: true },
          onError
        }
      ) : getChildren();
    },
    null
  );
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = React3.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React3.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = React3.useContext(RouteContext);
  invariant(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId(
    "useRouteId"
    /* UseRouteId */
  );
}
function useRouteError() {
  var _a;
  let error = React3.useContext(RouteErrorContext);
  let state = useDataRouterState(
    "useRouteError"
    /* UseRouteError */
  );
  let routeId = useCurrentRouteId(
    "useRouteError"
    /* UseRouteError */
  );
  if (error !== void 0) {
    return error;
  }
  return (_a = state.errors) == null ? void 0 : _a[routeId];
}
function useNavigateStable() {
  let { router } = useDataRouterContext(
    "useNavigate"
    /* UseNavigateStable */
  );
  let id = useCurrentRouteId(
    "useNavigate"
    /* UseNavigateStable */
  );
  let activeRef = React3.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React3.useCallback(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        await router.navigate(to);
      } else {
        await router.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router, id]
  );
  return navigate;
}
var alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
    warning(false, message);
  }
}
React3.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state,
  onError
}) {
  return useRoutesImpl(routes, void 0, state, onError, future);
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function singleFetchUrl(reqUrl, basename, trailingSlashAware, extension) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (trailingSlashAware) {
    if (url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}_.${extension}`;
    } else {
      url.pathname = `${url.pathname}.${extension}`;
    }
  } else {
    if (url.pathname === "/") {
      url.pathname = `_root.${extension}`;
    } else if (basename && stripBasename(url.pathname, basename) === "/") {
      url.pathname = `${basename.replace(/\/$/, "")}/_root.${extension}`;
    } else {
      url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
    }
  }
  return url;
}
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    void 0) ;
    window.location.reload();
    return new Promise(() => {
    });
  }
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    var _a;
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      ((_a = currentMatches[index].route.path) == null ? void 0 : _a.endsWith("*")) && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      var _a;
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location.pathname + location.search + location.hash,
            window.origin
          ),
          currentParams: ((_a = currentMatches[0]) == null ? void 0 : _a.params) || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
function useDataRouterContext2() {
  let context = React3.useContext(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = React3.useContext(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = React3.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = React3.useContext(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = React3.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = React3.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React3.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = React3.useRef(null);
  React3.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  React3.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function PrefetchPageLinks({ page, ...linkProps }) {
  let { router } = useDataRouterContext2();
  let matches = React3.useMemo(
    () => matchRoutes(router.routes, page, router.basename),
    [router.routes, page, router.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ React3.createElement(PrefetchPageLinksImpl, { page, matches, ...linkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React3.useState([]);
  React3.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { future, manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = React3.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "data"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let newMatchesForAssets = React3.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "assets"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let dataHrefs = React3.useMemo(() => {
    if (page === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m) => {
      var _a;
      let manifestRoute = manifest.routes[m.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && ((_a = routeModules[m.route.id]) == null ? void 0 : _a.shouldRevalidate)) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(
      page,
      basename,
      future.unstable_trailingSlashAwareDataRequests,
      "data"
    );
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    future.unstable_trailingSlashAwareDataRequests,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = React3.useMemo(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React3.createElement("link", { key: href, rel: "prefetch", as: "fetch", href, ...linkProps })), moduleHrefs.map((href) => /* @__PURE__ */ React3.createElement("link", { key: href, rel: "modulepreload", href, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ React3.createElement(
      "link",
      {
        key,
        nonce: linkProps.nonce,
        ...link,
        crossOrigin: link.crossOrigin ?? linkProps.crossOrigin
      }
    )
  )));
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser2) {
    window.__reactRouterVersion = // @ts-expect-error
    "7.13.0";
  }
} catch (e) {
}
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = React3.forwardRef(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...rest
  }, forwardedRef) {
    let { basename, unstable_useTransitions } = React3.useContext(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let parsed = parseToInfo(to, basename);
    to = parsed.to;
    let href = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ React3.createElement(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: parsed.absoluteURL || href,
          onClick: parsed.isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React3.createElement(React3.Fragment, null, link, /* @__PURE__ */ React3.createElement(PrefetchPageLinks, { page: href })) : link;
  }
);
Link.displayName = "Link";
var NavLink = React3.forwardRef(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location = useLocation();
    let routerState = React3.useContext(DataRouterStateContext);
    let { navigator: navigator2, basename } = React3.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ React3.createElement(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = React3.forwardRef(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...props
  }, forwardedRef) => {
    let { unstable_useTransitions } = React3.useContext(NavigationContext);
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
      let doSubmit = () => submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition,
        unstable_defaultShouldRevalidate
      });
      if (unstable_useTransitions && navigate !== false) {
        React3.startTransition(() => doSubmit());
      } else {
        doSubmit();
      }
    };
    return /* @__PURE__ */ React3.createElement(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = React3.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition,
  unstable_defaultShouldRevalidate,
  unstable_useTransitions
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return React3.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
        let doNavigate = () => navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition,
          unstable_defaultShouldRevalidate
        });
        if (unstable_useTransitions) {
          React3.startTransition(() => doNavigate());
        } else {
          doNavigate();
        }
      }
    },
    [
      location,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    ]
  );
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3(
    "useSubmit"
    /* UseSubmit */
  );
  let { basename } = React3.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  let routerFetch = router.fetch;
  let routerNavigate = router.navigate;
  return React3.useCallback(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await routerFetch(key, currentRouteId, options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await routerNavigate(options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [routerFetch, routerNavigate, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = React3.useContext(NavigationContext);
  let routeContext = React3.useContext(RouteContext);
  invariant(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, { relative } = {}) {
  let vtContext = React3.useContext(ViewTransitionContext);
  invariant(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState"
    /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
const DesktopWindowContext = createContext({
  isDesktopWindow: false
});
DesktopWindowContext.Provider;
function useIsDesktopWindow() {
  return useContext(DesktopWindowContext).isDesktopWindow;
}
function useDesktopWindowControls() {
  return useContext(DesktopWindowContext).controls;
}
const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onTabAdd,
  onTabReorder,
  showAddButton = true,
  showWindowControls = true,
  showBottomBorder = true,
  onMinimize,
  onMaximize,
  onWindowClose,
  className = ""
}) => {
  const navigate = useNavigate();
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();
  const effectiveShowWindowControls = showWindowControls && !isDesktopWindow;
  const showDesktopWindowControls = isDesktopWindow && !!desktopControls;
  const handleWindowClose = useCallback(() => {
    if (isDesktopWindow && desktopControls) {
      desktopControls.onClose();
    } else if (onWindowClose) {
      onWindowClose();
    } else {
      navigate("/");
    }
  }, [isDesktopWindow, desktopControls, onWindowClose, navigate]);
  const [draggedTabId, setDraggedTabId] = useState(null);
  const [dragOverTabId, setDragOverTabId] = useState(null);
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };
  const handleTabClose = (e, tabId) => {
    e.stopPropagation();
    onTabClose == null ? void 0 : onTabClose(tabId);
  };
  const handleDragStart = (e, tabId) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", tabId);
    requestAnimationFrame(() => {
      e.target.style.opacity = "0.5";
    });
  };
  const handleDragEnd = (e) => {
    setDraggedTabId(null);
    setDragOverTabId(null);
    e.target.style.opacity = "1";
  };
  const handleDragOver = (e, tabId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedTabId && draggedTabId !== tabId) {
      setDragOverTabId(tabId);
    }
  };
  const handleDragLeave = () => {
    setDragOverTabId(null);
  };
  const handleDrop = (e, targetTabId) => {
    e.preventDefault();
    setDragOverTabId(null);
    if (!draggedTabId || !onTabReorder) return;
    const fromIndex = tabs.findIndex((t) => t.id === draggedTabId);
    const toIndex = tabs.findIndex((t) => t.id === targetTabId);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      onTabReorder(fromIndex, toIndex);
    }
    setDraggedTabId(null);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] TabBar",
      className: `
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${showBottomBorder ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10" : ""}
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "\n          flex items-end\n          overflow-hidden\n          h-full\n          min-w-0\n        ",
            children: tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const tabLabel = tab.label ?? tab.title ?? "";
              const closable = tab.fixed ? false : tab.closable !== false;
              const isDragging = draggedTabId === tab.id;
              const isDragOver = dragOverTabId === tab.id;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-tab-id": tab.id,
                  onClick: () => handleTabClick(tab.id),
                  draggable: !!onTabReorder,
                  onDragStart: (e) => handleDragStart(e, tab.id),
                  onDragEnd: handleDragEnd,
                  onDragOver: (e) => handleDragOver(e, tab.id),
                  onDragLeave: handleDragLeave,
                  onDrop: (e) => handleDrop(e, tab.id),
                  className: `
                group
                relative
                flex items-center
                h-full
                w-[160px]
                min-w-0
                shrink
                px-[var(--tabbar-tab-padding-x)]
                gap-[var(--tabbar-tab-gap)]
                cursor-pointer
                transition-colors duration-[var(--duration-fast)]
                border-r border-[var(--color-border-subtle)]
                ${isActive ? "bg-[var(--color-surface-default)]" : "bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]"}
                ${isDragging ? "opacity-50" : ""}
                ${isDragOver ? "border-l-2 border-l-[var(--color-action-primary)]" : ""}
              `,
                  children: [
                    isActive && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20" }),
                    tab.icon && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `
                  shrink-0
                  ${isActive ? "text-[var(--color-text-default)]" : "text-[var(--color-text-muted)]"}
                `,
                        children: tab.icon
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${isActive ? "text-[var(--color-text-default)]" : "text-[var(--color-text-muted)]"}
                `,
                        children: tabLabel
                      }
                    ),
                    closable && onTabClose && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => handleTabClose(e, tab.id),
                        className: `
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${isActive ? "text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]" : "opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,
                        "aria-label": `Close ${tabLabel}`,
                        children: /* @__PURE__ */ jsx(IconX, { size: 12, stroke: 1 })
                      }
                    )
                  ]
                },
                tab.id
              );
            })
          }
        ),
        showAddButton && onTabAdd && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onTabAdd,
            className: "\n            shrink-0\n            flex items-center justify-center\n            size-[var(--tabbar-add-size)]\n            mx-[var(--tabbar-add-margin)]\n            rounded-[var(--radius-sm)]\n            text-[var(--color-text-muted)]\n            transition-colors duration-[var(--duration-fast)]\n            hover:bg-[var(--tabbar-hover-bg)]\n            hover:text-[var(--color-text-default)]\n          ",
            "aria-label": "Add new tab",
            children: /* @__PURE__ */ jsx(IconPlus, { size: 14, stroke: 1 })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex-1 h-full",
            onMouseDown: showDesktopWindowControls ? desktopControls.onDragStart : void 0,
            onDoubleClick: showDesktopWindowControls ? desktopControls.onDoubleClick : void 0
          }
        ),
        effectiveShowWindowControls && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onMinimize,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Minimize",
              children: /* @__PURE__ */ jsx(IconMinus, { size: 12, stroke: 1 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onMaximize,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Maximize",
              children: /* @__PURE__ */ jsx(IconSquare, { size: 12, stroke: 1 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleWindowClose,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Close window",
              children: /* @__PURE__ */ jsx(IconX, { size: 12, stroke: 1 })
            }
          )
        ] }),
        showDesktopWindowControls && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: desktopControls.onMinimize,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Minimize",
              children: /* @__PURE__ */ jsx(IconMinus, { size: 12, stroke: 1 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: desktopControls.onMaximize,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Maximize",
              children: /* @__PURE__ */ jsx(IconSquare, { size: 12, stroke: 1 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: desktopControls.onClose,
              className: "\n              flex items-center justify-center\n              size-[24px]\n              rounded-[var(--radius-sm)]\n              text-[var(--color-text-muted)]\n              transition-colors duration-[var(--duration-fast)]\n              hover:bg-[var(--color-surface-subtle)]\n              hover:text-[var(--color-text-default)]\n            ",
              "aria-label": "Close window",
              children: /* @__PURE__ */ jsx(IconX, { size: 12, stroke: 1 })
            }
          )
        ] })
      ]
    }
  );
};
function useTabBar(options = {}) {
  var _a;
  const { initialTabs = [], initialActiveTab, onCreateTab } = options;
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState(initialActiveTab || ((_a = initialTabs[0]) == null ? void 0 : _a.id) || "");
  const addTab = (tab) => {
    const newTab = tab || (onCreateTab == null ? void 0 : onCreateTab()) || {
      id: `tab-${Date.now()}`,
      label: `New Tab`,
      closable: true
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
    return newTab;
  };
  const closeTab = (tabId) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      if (activeTab === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex((t) => t.id === tabId);
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
        setActiveTab(newTabs[newActiveIndex].id);
      }
      return newTabs;
    });
  };
  const selectTab = (tabId) => {
    setActiveTab(tabId);
  };
  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    selectTab,
    setTabs
  };
}
const Skeleton = forwardRef(
  ({
    variant = "text",
    width,
    height,
    animation = "wave",
    count = 1,
    gap = 8,
    loading = true,
    children,
    size,
    className = "",
    style,
    ...props
  }, ref) => {
    if (!loading && children) {
      return /* @__PURE__ */ jsx(Fragment, { children });
    }
    const baseStyles = [
      "bg-[var(--color-surface-muted)]",
      animation === "pulse" && "animate-pulse",
      animation === "wave" && "animate-shimmer"
    ].filter(Boolean).join(" ");
    const variantStyles2 = {
      text: "rounded-[var(--radius-sm)]",
      circular: "rounded-full",
      rectangular: "rounded-none",
      rounded: "rounded-[var(--radius-md)]"
    };
    const getWidth = () => {
      if (width) return typeof width === "number" ? `${width}px` : width;
      if (variant === "circular" && size) return `${size}px`;
      if (variant === "text") return "100%";
      return void 0;
    };
    const getHeight = () => {
      if (height) return typeof height === "number" ? `${height}px` : height;
      if (variant === "circular" && size) return `${size}px`;
      if (variant === "text") return "1em";
      return void 0;
    };
    const skeletonStyle = {
      width: getWidth(),
      height: getHeight(),
      ...style
    };
    if (count > 1) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          ref,
          "data-figma-name": "[TDS] Skeleton",
          className: twMerge("flex flex-col", className),
          style: { gap },
          ...props,
          children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsx(
            "div",
            {
              className: twMerge(baseStyles, variantStyles2[variant]),
              style: {
                ...skeletonStyle,
                width: variant === "text" && index === count - 1 ? "80%" : skeletonStyle.width
              }
            },
            index
          ))
        }
      );
    }
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        "data-figma-name": "[TDS] Skeleton",
        className: twMerge(baseStyles, variantStyles2[variant], className),
        style: skeletonStyle,
        ...props
      }
    );
  }
);
Skeleton.displayName = "Skeleton";
const SkeletonText = forwardRef(
  ({ lines = 3, ...props }, ref) => {
    return /* @__PURE__ */ jsx(Skeleton, { ref, variant: "text", count: lines, height: 16, ...props });
  }
);
SkeletonText.displayName = "SkeletonText";
const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 56
};
const SkeletonAvatar = forwardRef(
  ({ size = "md", ...props }, ref) => {
    const sizeValue = typeof size === "number" ? size : avatarSizes[size];
    return /* @__PURE__ */ jsx(Skeleton, { ref, variant: "circular", size: sizeValue, ...props });
  }
);
SkeletonAvatar.displayName = "SkeletonAvatar";
const buttonSizes = {
  sm: { width: 64, height: 28 },
  md: { width: 80, height: 32 },
  lg: { width: 96, height: 40 }
};
const SkeletonButton = forwardRef(
  ({ size = "md", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Skeleton,
      {
        ref,
        variant: "rounded",
        width: buttonSizes[size].width,
        height: buttonSizes[size].height,
        ...props
      }
    );
  }
);
SkeletonButton.displayName = "SkeletonButton";
const SkeletonImage = forwardRef(
  ({ aspectRatio = "16/9", width = "100%", ...props }, ref) => {
    return /* @__PURE__ */ jsx(Skeleton, { ref, variant: "rounded", width, style: { aspectRatio }, ...props });
  }
);
SkeletonImage.displayName = "SkeletonImage";
const SkeletonCard = forwardRef(
  ({ avatar = true, lines = 3, image = false, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: twMerge(
          "flex flex-col gap-4 p-4",
          "bg-[var(--color-surface-default)]",
          "border border-[var(--color-border-default)]",
          "rounded-[var(--radius-lg)]",
          className
        ),
        ...props,
        children: [
          image && /* @__PURE__ */ jsx(SkeletonImage, {}),
          avatar && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(SkeletonAvatar, { size: "md" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { variant: "text", width: "60%", height: 16 }),
              /* @__PURE__ */ jsx(Skeleton, { variant: "text", width: "40%", height: 12 })
            ] })
          ] }),
          /* @__PURE__ */ jsx(SkeletonText, { lines })
        ]
      }
    );
  }
);
SkeletonCard.displayName = "SkeletonCard";
const SkeletonTable = forwardRef(
  ({ rows = 5, columns = 4, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        "data-figma-name": "[TDS] SkeletonTable",
        className: twMerge("flex flex-col gap-2", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-4 py-2 border-b border-[var(--color-border-default)]", children: Array.from({ length: columns }).map((_, i) => /* @__PURE__ */ jsx(
            Skeleton,
            {
              variant: "text",
              width: i === 0 ? "20%" : `${60 / (columns - 1)}%`,
              height: 14
            },
            `header-${i}`
          )) }),
          Array.from({ length: rows }).map((_, rowIndex) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex gap-4 py-3 border-b border-[var(--color-border-subtle)]",
              children: Array.from({ length: columns }).map((_2, colIndex) => /* @__PURE__ */ jsx(
                Skeleton,
                {
                  variant: "text",
                  width: colIndex === 0 ? "20%" : `${60 / (columns - 1)}%`,
                  height: 16
                },
                `cell-${rowIndex}-${colIndex}`
              ))
            },
            `row-${rowIndex}`
          ))
        ]
      }
    );
  }
);
SkeletonTable.displayName = "SkeletonTable";
const DEFAULT_MIN_WIDTH = 50;
const KEYBOARD_STEP = 10;
function useColumnResize(options = {}) {
  const { mode = "onEnd", onColumnResize, minColumnWidth = DEFAULT_MIN_WIDTH } = options;
  const [columnWidths2, setColumnWidths] = useState({});
  const [resizingColumnKey, setResizingColumnKey] = useState(null);
  const tableRef = useRef(null);
  const dragRef = useRef({
    startX: 0,
    startWidth: 0,
    columnKey: null,
    currentWidth: 0
  });
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const columnWidthsRef = useRef(columnWidths2);
  columnWidthsRef.current = columnWidths2;
  const wasResizingRef = useRef(false);
  const isResizing = resizingColumnKey !== null;
  const hasResizedColumns = Object.keys(columnWidths2).length > 0;
  const ensureSnapshot = useCallback(() => {
    if (Object.keys(columnWidthsRef.current).length > 0) return;
    const keys = optionsRef.current.resizableColumnKeys;
    if (!keys || keys.length === 0 || !tableRef.current) return;
    const snapshot = {};
    for (const key of keys) {
      const cell = tableRef.current.querySelector(
        `[data-column-key="${key}"]`
      );
      if (cell) {
        snapshot[key] = cell.getBoundingClientRect().width;
      }
    }
    columnWidthsRef.current = snapshot;
    setColumnWidths(snapshot);
  }, []);
  const getHeaderCellWidth = useCallback(
    (columnKey) => {
      if (!tableRef.current) return minColumnWidth;
      const headerCell = tableRef.current.querySelector(
        `[data-column-key="${columnKey}"]`
      );
      if (!headerCell) return minColumnWidth;
      return headerCell.getBoundingClientRect().width;
    },
    [minColumnWidth]
  );
  const clampWidth = useCallback(
    (width, minW, maxW) => {
      const min = minW ? parseInt(minW, 10) || minColumnWidth : minColumnWidth;
      let clamped = Math.max(width, min);
      if (maxW) {
        const max = parseInt(maxW, 10);
        if (max > 0) clamped = Math.min(clamped, max);
      }
      return clamped;
    },
    [minColumnWidth]
  );
  const applyDomPreview = useCallback((columnKey, width) => {
    if (!tableRef.current) return;
    const cells = tableRef.current.querySelectorAll(
      `[data-column-key="${columnKey}"]`
    );
    cells.forEach((cell) => {
      cell.style.width = `${width}px`;
      cell.style.flexShrink = "0";
      cell.style.flexGrow = "0";
    });
  }, []);
  const onMouseMove = useCallback(
    (e) => {
      var _a;
      const drag = dragRef.current;
      if (!drag.columnKey) return;
      const opts = optionsRef.current;
      const minW = opts.minColumnWidth ?? DEFAULT_MIN_WIDTH;
      const delta = e.clientX - drag.startX;
      const newWidth = Math.max(drag.startWidth + delta, minW);
      drag.currentWidth = newWidth;
      if (opts.mode === "onChange") {
        setColumnWidths((prev) => ({ ...prev, [drag.columnKey]: newWidth }));
        (_a = opts.onColumnResize) == null ? void 0 : _a.call(opts, drag.columnKey, newWidth);
      } else {
        applyDomPreview(drag.columnKey, newWidth);
      }
    },
    [applyDomPreview]
  );
  const onMouseUp = useCallback(() => {
    var _a;
    const drag = dragRef.current;
    if (drag.columnKey) {
      const finalWidth = drag.currentWidth;
      const opts = optionsRef.current;
      setColumnWidths((prev) => ({ ...prev, [drag.columnKey]: finalWidth }));
      if (opts.mode !== "onChange") {
        (_a = opts.onColumnResize) == null ? void 0 : _a.call(opts, drag.columnKey, finalWidth);
      }
    }
    drag.columnKey = null;
    setResizingColumnKey(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    setTimeout(() => {
      wasResizingRef.current = false;
    }, 0);
  }, [onMouseMove]);
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [onMouseMove, onMouseUp]);
  const handleMouseDown = useCallback(
    (columnKey, e) => {
      e.preventDefault();
      e.stopPropagation();
      wasResizingRef.current = true;
      ensureSnapshot();
      const currentWidth = columnWidthsRef.current[columnKey] ?? getHeaderCellWidth(columnKey);
      dragRef.current = {
        startX: e.clientX,
        startWidth: currentWidth,
        columnKey,
        currentWidth
      };
      setResizingColumnKey(columnKey);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [getHeaderCellWidth, onMouseMove, onMouseUp, ensureSnapshot]
  );
  const handleDoubleClick = useCallback(
    (columnKey, e) => {
      e.preventDefault();
      e.stopPropagation();
      ensureSnapshot();
      if (!tableRef.current) return;
      const cells = tableRef.current.querySelectorAll(
        `[data-column-key="${columnKey}"]`
      );
      let maxContentWidth = 0;
      cells.forEach((cell) => {
        const inner = cell.firstElementChild;
        if (inner) {
          const savedCellWidth = cell.style.width;
          const savedCellFlex = cell.style.flex;
          const savedOverflow = inner.style.overflow;
          const savedWhiteSpace = inner.style.whiteSpace;
          const savedTextOverflow = inner.style.textOverflow;
          cell.style.width = "auto";
          cell.style.flex = "0 0 auto";
          inner.style.overflow = "visible";
          inner.style.whiteSpace = "nowrap";
          inner.style.textOverflow = "clip";
          maxContentWidth = Math.max(maxContentWidth, inner.scrollWidth);
          cell.style.width = savedCellWidth;
          cell.style.flex = savedCellFlex;
          inner.style.overflow = savedOverflow;
          inner.style.whiteSpace = savedWhiteSpace;
          inner.style.textOverflow = savedTextOverflow;
        }
      });
      const paddingX = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--table-cell-padding-x")
      ) || 12;
      const optimalWidth = maxContentWidth + paddingX * 2 + 2;
      const finalWidth = Math.max(optimalWidth, minColumnWidth);
      setColumnWidths((prev) => ({ ...prev, [columnKey]: finalWidth }));
      onColumnResize == null ? void 0 : onColumnResize(columnKey, finalWidth);
    },
    [minColumnWidth, onColumnResize, ensureSnapshot]
  );
  const handleKeyDown = useCallback(
    (columnKey, e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      ensureSnapshot();
      const currentWidth = columnWidthsRef.current[columnKey] ?? getHeaderCellWidth(columnKey);
      const delta = e.key === "ArrowRight" ? KEYBOARD_STEP : -KEYBOARD_STEP;
      const newWidth = Math.max(currentWidth + delta, minColumnWidth);
      setColumnWidths((prev) => ({ ...prev, [columnKey]: newWidth }));
      onColumnResize == null ? void 0 : onColumnResize(columnKey, newWidth);
    },
    [getHeaderCellWidth, minColumnWidth, onColumnResize, ensureSnapshot]
  );
  const shouldIgnoreHeaderClick = useCallback(() => wasResizingRef.current, []);
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const getResizeHandleProps = useCallback(
    (columnKey, columnLabel) => ({
      onClick: stopPropagation,
      onMouseDown: (e) => handleMouseDown(columnKey, e),
      onDoubleClick: (e) => handleDoubleClick(columnKey, e),
      onKeyDown: (e) => handleKeyDown(columnKey, e),
      role: "separator",
      tabIndex: 0,
      "aria-orientation": "vertical",
      "aria-valuenow": columnWidths2[columnKey] ?? minColumnWidth,
      "aria-valuemin": minColumnWidth,
      "aria-label": `Resize column ${columnLabel}`
    }),
    [
      stopPropagation,
      handleMouseDown,
      handleDoubleClick,
      handleKeyDown,
      columnWidths2,
      minColumnWidth
    ]
  );
  const getResizedColumnStyle = useCallback(
    (columnKey, originalStyle, minWidth, maxWidth) => {
      const resizedWidth = columnWidths2[columnKey];
      if (resizedWidth !== void 0) {
        const clamped = clampWidth(resizedWidth, minWidth, maxWidth);
        return { width: clamped, flexShrink: 0, flexGrow: 0 };
      }
      return originalStyle;
    },
    [columnWidths2, clampWidth]
  );
  const resetColumnWidth = useCallback((columnKey) => {
    setColumnWidths((prev) => {
      const next = { ...prev };
      delete next[columnKey];
      return next;
    });
  }, []);
  const resetAllColumnWidths = useCallback(() => {
    columnWidthsRef.current = {};
    setColumnWidths({});
  }, []);
  return {
    columnWidths: columnWidths2,
    isResizing,
    resizingColumnKey,
    getResizeHandleProps,
    getResizedColumnStyle,
    tableRef,
    resetColumnWidth,
    resetAllColumnWidths,
    shouldIgnoreHeaderClick,
    hasResizedColumns
  };
}
const HEADER_ALIGN_CLS = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
};
const CELL_ALIGN_CLS = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right"
};
const INNER_ALIGN_CLS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end flex-row-reverse"
};
function Table({
  columns: rawColumns,
  data,
  rows,
  rowKey,
  selectable = false,
  selectionType = "checkbox",
  selectedKeys = [],
  onSelectionChange,
  disabledKeys = [],
  hideSelectAll = false,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  expandedContent,
  emptyMessage = "No data",
  className = "",
  rowHeight,
  resizable = true,
  columnResizeMode = "onEnd",
  onColumnResize,
  minColumnWidth,
  loading = false,
  loadingRows = 10,
  ...rest
}) {
  const tableData = loading ? [] : data ?? rows ?? [];
  const columns = rawColumns.map((col) => ({
    ...col,
    label: col.label || col.header || ""
  }));
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const resizableColumnKeys = useMemo(() => {
    if (!resizable) return [];
    return rawColumns.filter((c) => {
      if (c.resizable !== void 0) return c.resizable;
      return !c.width;
    }).map((c) => c.key);
  }, [rawColumns, resizable]);
  const {
    isResizing,
    resizingColumnKey,
    getResizeHandleProps,
    getResizedColumnStyle,
    tableRef,
    shouldIgnoreHeaderClick,
    hasResizedColumns
  } = useColumnResize({
    mode: columnResizeMode,
    onColumnResize,
    minColumnWidth,
    resizableColumnKeys
  });
  const getRowKey = useCallback(
    (row) => {
      if (typeof rowKey === "function") {
        return rowKey(row);
      }
      return String(row[rowKey]);
    },
    [rowKey]
  );
  const handleSort = (columnKey) => {
    if (sortKey === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(columnKey);
      setSortDirection("asc");
    }
  };
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return tableData;
    return [...tableData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === void 0) return 1;
      if (bVal === null || bVal === void 0) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [tableData, sortKey, sortDirection]);
  const disabledSet = useMemo(() => new Set(disabledKeys), [disabledKeys]);
  const handleSelectRow = (key) => {
    if (disabledSet.has(key)) return;
    if (selectionType === "radio") {
      onSelectionChange == null ? void 0 : onSelectionChange(selectedKeys.includes(key) ? [] : [key]);
    } else {
      if (selectedKeys.includes(key)) {
        onSelectionChange == null ? void 0 : onSelectionChange(selectedKeys.filter((k) => k !== key));
      } else {
        onSelectionChange == null ? void 0 : onSelectionChange([...selectedKeys, key]);
      }
    }
  };
  const selectableKeysList = useMemo(
    () => sortedData.map(getRowKey).filter((key) => !disabledSet.has(key)),
    [sortedData, getRowKey, disabledSet]
  );
  const handleSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      onSelectionChange == null ? void 0 : onSelectionChange(selectableKeysList);
    } else {
      onSelectionChange == null ? void 0 : onSelectionChange([]);
    }
  };
  const allSelected = selectableKeysList.length > 0 && selectableKeysList.every((key) => selectedKeys.includes(key));
  const someSelected = selectableKeysList.length > 0 && selectedKeys.some((key) => selectableKeysList.includes(key)) && !allSelected;
  const renderSortIcon = (columnKey) => {
    if (sortKey !== columnKey) {
      return /* @__PURE__ */ jsx(IconSelector, { size: 14, stroke: 1, className: "text-[var(--color-text-subtle)]" });
    }
    if (sortDirection === "asc") {
      return /* @__PURE__ */ jsx(IconChevronUp, { size: 14, stroke: 1, className: "text-[var(--color-action-primary)]" });
    }
    return /* @__PURE__ */ jsx(IconChevronDown, { size: 14, stroke: 1, className: "text-[var(--color-action-primary)]" });
  };
  const enableStickyHeader = stickyHeader || !!maxHeight;
  const hasStickyColumns = columns.some((c) => c.sticky);
  const isColumnResizable = (column) => {
    if (!resizable) return false;
    if (column.resizable !== void 0) return column.resizable;
    return !column.width;
  };
  const getColumnStyle = (column) => {
    const style = {};
    if (column.width) {
      style.width = column.width;
      style.flexShrink = 0;
      style.flexGrow = 0;
    } else {
      style.flex = column.flex ?? 1;
      style.minWidth = 0;
    }
    if (column.minWidth) {
      style.minWidth = column.minWidth;
    }
    if (column.maxWidth) {
      style.maxWidth = column.maxWidth;
    }
    return style;
  };
  const getEffectiveColumnStyle = (column) => {
    const baseStyle = getColumnStyle(column);
    return !resizable || !isColumnResizable(column) ? { ...baseStyle } : getResizedColumnStyle(column.key, baseStyle, column.minWidth, column.maxWidth);
  };
  const scrollColumns = hasStickyColumns ? columns.filter((c) => !c.sticky) : columns;
  const stickyRightColumns = hasStickyColumns ? columns.filter((c) => c.sticky === "right") : [];
  const stickyRightWidth = stickyRightColumns.reduce((sum, c) => {
    const w = c.width ? parseInt(c.width, 10) : 72;
    return sum + w;
  }, 0);
  const renderHeaderCell = (column, index, showFirstDivider) => {
    const isFirstColumn = index === 0;
    const showDivider = isFirstColumn ? showFirstDivider : true;
    const columnResizable = isColumnResizable(column);
    const align = column.align || "left";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-column-key": column.key,
        className: cn(
          "relative flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]",
          "text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]",
          "min-w-0 overflow-hidden",
          HEADER_ALIGN_CLS[align],
          column.sortable && "cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors",
          showDivider && "border-l border-[var(--color-border-default)]"
        ),
        style: getEffectiveColumnStyle(column),
        onClick: column.sortable ? () => {
          if (!shouldIgnoreHeaderClick()) handleSort(column.key);
        } : void 0,
        title: column.label,
        children: [
          column.headerRender ? column.headerRender() : /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-1 w-full min-w-0", INNER_ALIGN_CLS[align]), children: [
            /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap truncate", title: column.label, children: column.label }),
            column.sortable && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0", children: renderSortIcon(column.key) })
          ] }),
          columnResizable && /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "absolute top-0 right-0 h-full w-[var(--table-resize-handle-width)] cursor-col-resize z-[1] flex items-center justify-center",
                "after:content-[''] after:absolute after:top-2 after:bottom-2 after:w-[1px] after:rounded-full",
                "after:bg-[var(--table-resize-handle-hover-color)] after:opacity-0 after:transition-opacity after:duration-150",
                resizingColumnKey !== column.key && "hover:after:opacity-100",
                resizingColumnKey === column.key && "after:opacity-100"
              ),
              ...getResizeHandleProps(column.key, column.label)
            }
          )
        ]
      },
      column.key
    );
  };
  const renderBodyCell = (column, row, rowIndex, colIndex, isSelected, showFirstDivider) => {
    const isFirstColumn = colIndex === 0;
    const showCellDivider = isFirstColumn ? showFirstDivider : true;
    const align = column.align || "left";
    const cellValue = row[column.key];
    const cellTitle = typeof cellValue === "string" || typeof cellValue === "number" ? String(cellValue) : void 0;
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-column-key": column.key,
        className: cn(
          "flex items-center",
          "px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]",
          "text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]",
          "min-w-0 overflow-hidden",
          CELL_ALIGN_CLS[align],
          showCellDivider && "border-l border-transparent"
        ),
        style: getEffectiveColumnStyle(column),
        title: cellTitle,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "truncate w-full min-w-0",
              align === "center" && "text-center flex justify-center",
              align === "right" && "text-right"
            ),
            children: column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]
          }
        )
      },
      column.key
    );
  };
  const skeletonWidths = ["65%", "45%", "55%", "70%", "40%", "60%", "50%", "75%", "35%", "80%"];
  const renderSkeletonCell = (column, rowIndex, colIndex, showFirstDivider) => {
    const isFirstColumn = colIndex === 0;
    const showCellDivider = isFirstColumn ? showFirstDivider : true;
    const align = column.align || "left";
    const widthIdx = (rowIndex * 7 + colIndex * 3) % skeletonWidths.length;
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-column-key": column.key,
        className: cn(
          "flex items-center",
          "px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]",
          "min-w-0 overflow-hidden",
          CELL_ALIGN_CLS[align],
          showCellDivider && "border-l border-transparent"
        ),
        style: getEffectiveColumnStyle(column),
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "w-full min-w-0",
              align === "center" && "flex justify-center",
              align === "right" && "flex justify-end"
            ),
            children: /* @__PURE__ */ jsx(Skeleton, { variant: "text", width: skeletonWidths[widthIdx], height: 14 })
          }
        )
      },
      column.key
    );
  };
  const renderSkeletonRows = (cols, showCheckbox) => /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-[var(--table-row-gap)]", children: Array.from({ length: loadingRows }).map((_, rowIndex) => /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "rounded-[var(--table-row-radius)] overflow-hidden",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-default)]"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-stretch min-h-[var(--table-row-height)] w-full", children: [
        showCheckbox && /* @__PURE__ */ jsx("div", { className: "shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]", children: /* @__PURE__ */ jsx(Skeleton, { variant: "text", width: 16, height: 16 }) }),
        cols.map((col, i) => renderSkeletonCell(col, rowIndex, i, showCheckbox)),
        hasResizedColumns && /* @__PURE__ */ jsx("div", { style: { flex: "1 0 0", minWidth: 0 }, "aria-hidden": "true" })
      ] })
    },
    `skeleton-${rowIndex}`
  )) });
  const leftBodyRef = useRef(null);
  const rightBodyRef = useRef(null);
  useLayoutEffect(() => {
    if (!hasStickyColumns) return;
    const leftBody = leftBodyRef.current;
    const rightBody = rightBodyRef.current;
    if (!leftBody || !rightBody) return;
    const syncHeights = () => {
      const leftRows2 = leftBody.querySelectorAll(":scope > [data-row-index]");
      const rightRows = rightBody.querySelectorAll(":scope > [data-row-index]");
      const count = Math.min(leftRows2.length, rightRows.length);
      for (let i = 0; i < count; i++) {
        leftRows2[i].style.height = "";
        rightRows[i].style.height = "";
      }
      for (let i = 0; i < count; i++) {
        const lh = leftRows2[i].getBoundingClientRect().height;
        const rh = rightRows[i].getBoundingClientRect().height;
        const max = Math.max(lh, rh);
        if (lh !== max) leftRows2[i].style.height = `${max}px`;
        if (rh !== max) rightRows[i].style.height = `${max}px`;
      }
    };
    syncHeights();
    const ro = new ResizeObserver(syncHeights);
    const leftRows = leftBody.querySelectorAll(":scope > [data-row-index]");
    leftRows.forEach((row) => ro.observe(row));
    return () => ro.disconnect();
  }, [hasStickyColumns, sortedData, loading, selectedKeys]);
  if (hasStickyColumns) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-figma-name": "[TDS] Table",
        ...rest,
        ref: tableRef,
        className: cn("flex flex-col gap-[var(--table-row-gap)]", className),
        style: rowHeight ? { "--table-row-height": rowHeight } : void 0,
        children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn("flex-1 min-w-0 overflow-x-auto", maxHeight && "overflow-y-auto"),
              style: maxHeight ? { maxHeight } : void 0,
              children: /* @__PURE__ */ jsxs("div", { className: "min-w-fit w-full", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: cn(
                      "flex items-stretch min-h-[var(--table-row-height)] w-full",
                      "bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-l-[var(--table-row-radius)]",
                      "border-r-0",
                      enableStickyHeader && "sticky top-0 z-10",
                      isResizing && "select-none"
                    ),
                    children: [
                      selectable && /* @__PURE__ */ jsx("div", { className: "shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]", children: !hideSelectAll && selectionType !== "radio" && /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          checked: allSelected,
                          indeterminate: someSelected,
                          onChange: handleSelectAll,
                          "aria-label": "Select all rows"
                        }
                      ) }),
                      scrollColumns.map((col, i) => renderHeaderCell(col, i, selectable)),
                      hasResizedColumns && /* @__PURE__ */ jsx("div", { style: { flex: "1 0 0", minWidth: 0 }, "aria-hidden": "true" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: leftBodyRef,
                    className: "flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full",
                    children: loading ? renderSkeletonRows(scrollColumns, selectable) : sortedData.length === 0 ? /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "px-[var(--table-cell-padding-x)] py-[var(--table-empty-padding-y)] text-center",
                          "text-[length:var(--table-font-size)] text-[var(--color-text-muted)]",
                          "border border-[var(--color-border-default)] rounded-l-[var(--table-row-radius)] border-r-0 bg-[var(--color-surface-default)]"
                        ),
                        children: emptyMessage
                      }
                    ) : sortedData.map((row, rowIndex) => {
                      const key = getRowKey(row);
                      const isSelected = selectedKeys.includes(key);
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          "data-row-index": rowIndex,
                          className: cn(
                            "flex items-stretch min-h-[var(--table-row-height)] w-full",
                            "rounded-l-[var(--table-row-radius)] border border-[var(--color-border-default)] border-r-0",
                            "transition-all hover:bg-[var(--table-row-hover-bg)]",
                            isSelected ? "bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]" : "bg-[var(--color-surface-default)]",
                            onRowClick && !disabledSet.has(key) && "cursor-pointer"
                          ),
                          onClick: onRowClick && !disabledSet.has(key) ? () => onRowClick(row, rowIndex) : void 0,
                          children: [
                            selectable && /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: "shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]",
                                onClick: (e) => e.stopPropagation(),
                                children: selectionType === "radio" ? /* @__PURE__ */ jsx(
                                  Radio,
                                  {
                                    checked: isSelected,
                                    disabled: disabledSet.has(key),
                                    onChange: () => handleSelectRow(key),
                                    "aria-label": `Select row ${rowIndex + 1}`
                                  }
                                ) : /* @__PURE__ */ jsx(
                                  Checkbox,
                                  {
                                    checked: isSelected,
                                    disabled: disabledSet.has(key),
                                    onChange: () => handleSelectRow(key),
                                    "aria-label": `Select row ${rowIndex + 1}`
                                  }
                                )
                              }
                            ),
                            scrollColumns.map(
                              (col, i) => renderBodyCell(col, row, rowIndex, i, isSelected, selectable)
                            ),
                            hasResizedColumns && /* @__PURE__ */ jsx("div", { style: { flex: "1 0 0", minWidth: 0 }, "aria-hidden": "true" })
                          ]
                        },
                        key
                      );
                    })
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "shrink-0 flex flex-col gap-[var(--table-row-gap)]",
              style: { width: stickyRightWidth },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "flex items-stretch min-h-[var(--table-row-height)]",
                      "bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-r-[var(--table-row-radius)]",
                      "border-l-0",
                      "shadow-[-8px_0_16px_-4px_color-mix(in_srgb,var(--color-text-default)_4%,transparent)]"
                    ),
                    children: stickyRightColumns.map((col, i) => renderHeaderCell(col, i, true))
                  }
                ),
                /* @__PURE__ */ jsx("div", { ref: rightBodyRef, className: "flex flex-col gap-[var(--table-row-gap)]", children: loading ? renderSkeletonRows(stickyRightColumns, false) : sortedData.length === 0 ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "min-h-[var(--table-row-height)]",
                      "border border-[var(--color-border-default)] rounded-r-[var(--table-row-radius)] border-l-0 bg-[var(--color-surface-default)]"
                    )
                  }
                ) : sortedData.map((row, rowIndex) => {
                  const key = getRowKey(row);
                  const isSelected = selectedKeys.includes(key);
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-row-index": rowIndex,
                      className: cn(
                        "flex items-stretch min-h-[var(--table-row-height)]",
                        "rounded-r-[var(--table-row-radius)] border border-[var(--color-border-default)] border-l-0",
                        "transition-all hover:bg-[var(--table-row-hover-bg)]",
                        "shadow-[-8px_0_16px_-4px_color-mix(in_srgb,var(--color-text-default)_4%,transparent)]",
                        isSelected ? "bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]" : "bg-[var(--color-surface-default)]",
                        onRowClick && !disabledSet.has(key) && "cursor-pointer"
                      ),
                      onClick: onRowClick && !disabledSet.has(key) ? () => onRowClick(row, rowIndex) : void 0,
                      children: stickyRightColumns.map(
                        (col, i) => renderBodyCell(col, row, rowIndex, i, isSelected, true)
                      )
                    },
                    key
                  );
                }) })
              ]
            }
          )
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Table",
      ...rest,
      ref: tableRef,
      className: cn("flex flex-col gap-[var(--table-row-gap)]", className),
      style: rowHeight ? { "--table-row-height": rowHeight } : void 0,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: cn("overflow-x-auto", maxHeight && "overflow-y-auto"),
          style: maxHeight ? { maxHeight } : void 0,
          children: /* @__PURE__ */ jsxs("div", { className: "min-w-fit w-full", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: cn(
                  "flex items-stretch min-h-[var(--table-row-height)] w-full",
                  "bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]",
                  enableStickyHeader && "sticky top-0 z-10",
                  isResizing && "select-none"
                ),
                children: [
                  selectable && /* @__PURE__ */ jsx("div", { className: "shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]", children: !hideSelectAll && selectionType !== "radio" && /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      checked: allSelected,
                      indeterminate: someSelected,
                      onChange: handleSelectAll,
                      "aria-label": "Select all rows"
                    }
                  ) }),
                  columns.map((column, index) => renderHeaderCell(column, index, selectable)),
                  hasResizedColumns && /* @__PURE__ */ jsx("div", { style: { flex: "1 0 0", minWidth: 0 }, "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full", children: loading ? renderSkeletonRows(columns, selectable) : sortedData.length === 0 ? /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "px-[var(--table-cell-padding-x)] py-[var(--table-empty-padding-y)] text-center",
                  "text-[length:var(--table-font-size)] text-[var(--color-text-muted)]",
                  "border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] bg-[var(--color-surface-default)]"
                ),
                children: emptyMessage
              }
            ) : sortedData.map((row, rowIndex) => {
              const key = getRowKey(row);
              const isSelected = selectedKeys.includes(key);
              const expanded = expandedContent == null ? void 0 : expandedContent(row, rowIndex);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "rounded-[var(--table-row-radius)] overflow-hidden",
                    "border border-[var(--color-border-default)]",
                    isSelected ? "bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]" : "bg-[var(--color-surface-default)]"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: cn(
                          "flex items-stretch min-h-[var(--table-row-height)] w-full",
                          "transition-all hover:bg-[var(--table-row-hover-bg)]",
                          onRowClick && !disabledSet.has(key) && "cursor-pointer"
                        ),
                        onClick: onRowClick && !disabledSet.has(key) ? () => onRowClick(row, rowIndex) : void 0,
                        children: [
                          selectable && /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: "shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]",
                              onClick: (e) => e.stopPropagation(),
                              children: selectionType === "radio" ? /* @__PURE__ */ jsx(
                                Radio,
                                {
                                  checked: isSelected,
                                  disabled: disabledSet.has(key),
                                  onChange: () => handleSelectRow(key),
                                  "aria-label": `Select row ${rowIndex + 1}`
                                }
                              ) : /* @__PURE__ */ jsx(
                                Checkbox,
                                {
                                  checked: isSelected,
                                  disabled: disabledSet.has(key),
                                  onChange: () => handleSelectRow(key),
                                  "aria-label": `Select row ${rowIndex + 1}`
                                }
                              )
                            }
                          ),
                          columns.map(
                            (col, i) => renderBodyCell(col, row, rowIndex, i, isSelected, selectable)
                          ),
                          hasResizedColumns && /* @__PURE__ */ jsx("div", { style: { flex: "1 0 0", minWidth: 0 }, "aria-hidden": "true" })
                        ]
                      }
                    ),
                    expanded && /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--color-border-subtle)] min-h-[var(--table-expanded-row-height)] flex items-center", children: expanded })
                  ]
                },
                key
              );
            }) })
          ] })
        }
      )
    }
  );
}
function TableLink({
  children,
  onClick,
  className,
  title,
  truncate = true
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: twMerge(
        "text-label-md text-[var(--color-action-primary)] cursor-pointer",
        "hover:underline hover:underline-offset-2",
        "transition-colors",
        truncate && "truncate block",
        className
      ),
      onClick,
      title,
      children
    }
  );
}
const variantStyles = {
  success: {
    bg: "bg-[var(--inline-message-success-bg)]",
    icon: /* @__PURE__ */ jsx(
      IconCircleCheck,
      {
        size: 16,
        className: "text-[var(--inline-message-success-icon)]",
        strokeWidth: 1.5
      }
    )
  },
  warning: {
    bg: "bg-[var(--inline-message-warning-bg)]",
    icon: /* @__PURE__ */ jsx(
      IconAlertCircle,
      {
        size: 16,
        className: "text-[var(--inline-message-warning-icon)]",
        strokeWidth: 1.5
      }
    )
  },
  error: {
    bg: "bg-[var(--inline-message-error-bg)]",
    icon: /* @__PURE__ */ jsx(
      IconAlertTriangle,
      {
        size: 16,
        className: "text-[var(--inline-message-error-icon)]",
        strokeWidth: 1.5
      }
    )
  },
  info: {
    bg: "bg-[var(--inline-message-info-bg)]",
    icon: /* @__PURE__ */ jsx(
      IconInfoCircle,
      {
        size: 16,
        className: "text-[var(--inline-message-info-icon)]",
        strokeWidth: 1.5
      }
    )
  }
};
function InlineMessage({
  variant: rawVariant,
  children,
  hideIcon = false,
  icon,
  className = "",
  // thaki-ui compatibility props
  type,
  message,
  closable,
  onClose,
  expandable,
  ...props
}) {
  const variant = rawVariant ?? type ?? "info";
  const content = children ?? message;
  if (process.env.NODE_ENV === "development") {
    if (closable)
      console.warn(
        "[InlineMessage] closable prop is deprecated. Implement close button in parent component."
      );
    if (expandable)
      console.warn(
        "[InlineMessage] expandable prop is deprecated. Implement expandable content in parent component."
      );
  }
  const styles = variantStyles[variant];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] InlineMessage",
      role: "status",
      className: twMerge(
        "flex items-start gap-[var(--inline-message-gap)]",
        "p-[var(--inline-message-padding)]",
        "rounded-[var(--inline-message-radius)]",
        styles.bg,
        className
      ),
      ...props,
      children: [
        !hideIcon && /* @__PURE__ */ jsx("span", { className: "shrink-0", children: icon ?? styles.icon }),
        /* @__PURE__ */ jsx("p", { className: "text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]", children: content })
      ]
    }
  );
}
const positionStyles$1 = {
  "top-right": "top-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]",
  "top-left": "top-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]",
  "bottom-right": "bottom-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]",
  "bottom-left": "bottom-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]",
  "top-center": "top-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2"
};
const ToastContext = createContext(null);
function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
function Toast({ toast, onDismiss, className = "" }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const timerRef = useRef(null);
  const duration = toast.duration ?? 5e3;
  const dismissible = toast.dismissible ?? true;
  const timestamp = toast.timestamp;
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  }, [onDismiss, toast.id]);
  useEffect(() => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, handleDismiss]);
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  const handleMouseLeave = () => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }
  };
  const handleLinkClick = () => {
    var _a, _b;
    if ((_a = toast.link) == null ? void 0 : _a.onClick) {
      toast.link.onClick();
    } else if ((_b = toast.link) == null ? void 0 : _b.href) {
      window.open(toast.link.href, "_blank", "noopener,noreferrer");
    }
  };
  const toggleDetail = () => {
    setIsDetailExpanded((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] Toast",
      role: "alert",
      className: twMerge(
        "flex flex-col gap-[var(--primitive-spacing-2)]",
        "w-fit max-w-[320px]",
        "p-[var(--primitive-spacing-3)]",
        "rounded-[var(--primitive-radius-lg)]",
        "bg-[var(--color-surface-default)]",
        "border border-[var(--color-border-default)]",
        "shadow-lg",
        // Animation
        "transition-all duration-200 ease-out",
        isExiting ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0 animate-toast-in",
        className
      ),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-[var(--primitive-spacing-2)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-[var(--primitive-spacing-1)]", children: [
            toast.title && /* @__PURE__ */ jsx("p", { className: "text-label-md text-[var(--color-text-default)]", children: toast.title }),
            /* @__PURE__ */ jsx("p", { className: "text-body-md text-[var(--color-text-muted)]", children: toast.message }),
            toast.project && /* @__PURE__ */ jsx("span", { className: "inline-flex self-start px-[var(--primitive-spacing-1-5)] py-[var(--primitive-spacing-0-5)] text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)]", children: toast.project })
          ] }),
          (dismissible || timestamp || toast.action) && /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex flex-col items-end gap-[var(--primitive-spacing-1)]", children: [
            dismissible && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleDismiss,
                className: twMerge(
                  "p-[var(--primitive-spacing-1)] -m-[var(--primitive-spacing-1)]",
                  "rounded-[var(--primitive-radius-sm)]",
                  "text-[var(--color-text-subtle)]",
                  "hover:text-[var(--color-text-default)]",
                  "hover:bg-[var(--color-surface-hover)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                ),
                "aria-label": "닫기",
                children: /* @__PURE__ */ jsx(IconX, { size: 16, strokeWidth: 1.5 })
              }
            ),
            timestamp && /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: formatTime(timestamp) }),
            toast.action && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: toast.action.onClick,
                className: twMerge(
                  "p-[var(--primitive-spacing-1-5)]",
                  "rounded-[var(--primitive-radius-sm)]",
                  "text-[var(--color-text-muted)]",
                  "bg-[var(--color-surface-subtle)]",
                  "hover:bg-[var(--color-surface-hover)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                ),
                "aria-label": toast.action.label ?? "액션",
                children: toast.action.icon ?? /* @__PURE__ */ jsx(IconExternalLink, { size: 14, strokeWidth: 1.5 })
              }
            )
          ] })
        ] }),
        toast.link && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end gap-[var(--primitive-spacing-1-5)]", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleLinkClick,
            className: twMerge(
              "inline-flex items-center gap-[var(--primitive-spacing-1)]",
              "text-label-md",
              "text-[var(--color-action-primary)]",
              "hover:underline hover:underline-offset-2",
              "transition-colors duration-[var(--duration-fast)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"
            ),
            children: [
              /* @__PURE__ */ jsx("span", { children: toast.link.label }),
              /* @__PURE__ */ jsx(IconExternalLink, { size: 12, strokeWidth: 1.5 })
            ]
          }
        ) }),
        toast.detail && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[var(--primitive-spacing-3)]", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: toggleDetail,
              className: twMerge(
                "inline-flex items-center justify-end gap-[var(--primitive-spacing-1-5)] w-full",
                "text-label-md",
                "text-[var(--color-text-default)]",
                "hover:text-[var(--color-text-muted)]",
                "transition-colors duration-[var(--duration-fast)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"
              ),
              "aria-expanded": isDetailExpanded,
              children: [
                /* @__PURE__ */ jsx("span", { children: "View detail" }),
                /* @__PURE__ */ jsx(
                  IconChevronUp,
                  {
                    size: 16,
                    strokeWidth: 1.5,
                    className: twMerge(
                      "transition-transform duration-[var(--duration-fast)]",
                      !isDetailExpanded && "rotate-180"
                    )
                  }
                )
              ]
            }
          ),
          isDetailExpanded && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[var(--primitive-spacing-1-5)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-3)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]", children: [
            toast.detail.code && /* @__PURE__ */ jsxs("p", { className: "text-label-md text-[var(--color-text-default)]", children: [
              "code: ",
              toast.detail.code
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-body-md text-[var(--color-text-muted)]", children: toast.detail.content })
          ] })
        ] })
      ]
    }
  );
}
function ToastContainer({
  position = "top-right",
  maxToasts = 5,
  className = ""
}) {
  const { toasts, dismiss } = useToastStore();
  const visibleToasts = toasts.slice(0, maxToasts);
  const isBottom = position.includes("bottom");
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: twMerge(
        "fixed z-[var(--z-toast)]",
        "flex flex-col gap-[var(--primitive-spacing-2)]",
        positionStyles$1[position],
        isBottom && "flex-col-reverse",
        className
      ),
      role: "region",
      "aria-live": "polite",
      "aria-label": "알림",
      children: visibleToasts.map((toast) => /* @__PURE__ */ jsx(Toast, { toast, onDismiss: dismiss }, toast.id))
    }
  );
}
let toastStore = [];
const listeners = /* @__PURE__ */ new Set();
function emitChange() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() {
  return toastStore;
}
function addToast(toast) {
  toastStore = [toast, ...toastStore];
  emitChange();
}
function removeToast(id) {
  toastStore = toastStore.filter((t) => t.id !== id);
  emitChange();
}
function clearAllToasts() {
  toastStore = [];
  emitChange();
}
function useToastStore() {
  const [toasts, setToasts] = useState(getSnapshot());
  useEffect(() => {
    return subscribe(() => {
      setToasts(getSnapshot());
    });
  }, []);
  return { toasts, dismiss: removeToast };
}
let toastIdCounter = 0;
function ToastProvider({ children }) {
  const generateId = useCallback(() => {
    return `toast-${++toastIdCounter}-${Date.now()}`;
  }, []);
  const toast = useCallback(
    (options) => {
      const id = generateId();
      addToast({ ...options, id, timestamp: options.timestamp ?? /* @__PURE__ */ new Date() });
      return id;
    },
    [generateId]
  );
  const success = useCallback(
    (message, options) => {
      return toast({ variant: "success", message, ...options });
    },
    [toast]
  );
  const warning2 = useCallback(
    (message, options) => {
      return toast({ variant: "warning", message, ...options });
    },
    [toast]
  );
  const error = useCallback(
    (message, options) => {
      return toast({ variant: "error", message, ...options });
    },
    [toast]
  );
  const info = useCallback(
    (message, options) => {
      return toast({ variant: "info", message, ...options });
    },
    [toast]
  );
  const dismiss = useCallback((id) => {
    removeToast(id);
  }, []);
  const dismissAll = useCallback(() => {
    clearAllToasts();
  }, []);
  const value = {
    toast,
    success,
    warning: warning2,
    error,
    info,
    dismiss,
    dismissAll
  };
  return /* @__PURE__ */ jsx(ToastContext.Provider, { value, children });
}
const DisclosureContext = createContext(null);
function useDisclosureContext() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error("Disclosure components must be used within a Disclosure");
  }
  return context;
}
function Disclosure({
  defaultOpen = false,
  open: controlledOpen,
  onChange,
  children,
  className,
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const id = useId();
  const isControlled = controlledOpen !== void 0;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const toggle = () => {
    const newValue = !isOpen;
    if (!isControlled) {
      setInternalOpen(newValue);
    }
    onChange == null ? void 0 : onChange(newValue);
  };
  const contextValue = {
    isOpen,
    toggle,
    triggerId: `disclosure-trigger-${id}`,
    panelId: `disclosure-panel-${id}`
  };
  return /* @__PURE__ */ jsx(DisclosureContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx("div", { "data-figma-name": "[TDS] Disclosure", className: twMerge("", className), ...props, children }) });
}
function DisclosureTrigger({ children, className, ...props }) {
  const { isOpen, toggle, triggerId, panelId } = useDisclosureContext();
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      id: triggerId,
      "aria-expanded": isOpen,
      "aria-controls": panelId,
      onClick: toggle,
      className: twMerge(
        "flex items-center gap-[var(--disclosure-gap)]",
        "text-label-lg",
        "text-[var(--color-text-default)]",
        "cursor-pointer select-none",
        "hover:text-[var(--color-text-subtle)]",
        "transition-colors duration-[var(--duration-fast)]",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center justify-center w-[var(--disclosure-icon-size)] h-[var(--disclosure-icon-size)]", children: isOpen ? /* @__PURE__ */ jsx(IconChevronDown, { size: 12, strokeWidth: 2 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 12, strokeWidth: 2 }) }),
        children
      ]
    }
  );
}
function DisclosurePanel({ children, className, ...props }) {
  const { isOpen, triggerId, panelId } = useDisclosureContext();
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: panelId,
      role: "region",
      "aria-labelledby": triggerId,
      className: twMerge("", className),
      ...props,
      children
    }
  );
}
Disclosure.Trigger = DisclosureTrigger;
Disclosure.Panel = DisclosurePanel;
const AccordionContext = createContext(null);
const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion.Root");
  }
  return context;
};
const AccordionItemContext = createContext(null);
const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Accordion.Trigger and Accordion.Panel must be used within an Accordion.Item");
  }
  return context;
};
const AccordionRoot = forwardRef(
  ({
    allowMultiple = false,
    defaultExpanded = [],
    expanded: controlledExpanded,
    onChange,
    variant = "default",
    children,
    className,
    ...props
  }, ref) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isControlled = controlledExpanded !== void 0;
    const expandedItems = isControlled ? controlledExpanded : internalExpanded;
    const toggleItem = useCallback(
      (itemId) => {
        let newExpanded;
        if (expandedItems.includes(itemId)) {
          newExpanded = expandedItems.filter((id) => id !== itemId);
        } else {
          if (allowMultiple) {
            newExpanded = [...expandedItems, itemId];
          } else {
            newExpanded = [itemId];
          }
        }
        if (!isControlled) {
          setInternalExpanded(newExpanded);
        }
        onChange == null ? void 0 : onChange(newExpanded);
      },
      [expandedItems, allowMultiple, isControlled, onChange]
    );
    const variantStyles2 = {
      default: "",
      bordered: "border border-[var(--color-border-default)] rounded-[var(--radius-md)]",
      separated: "space-y-2"
    };
    return /* @__PURE__ */ jsx(AccordionContext.Provider, { value: { expandedItems, toggleItem, allowMultiple, variant }, children: /* @__PURE__ */ jsx("div", { ref, className: twMerge(variantStyles2[variant], className), ...props, children }) });
  }
);
AccordionRoot.displayName = "Accordion.Root";
const AccordionItem = forwardRef(
  ({ id, disabled = false, children, className, ...props }, ref) => {
    const { expandedItems, variant } = useAccordionContext();
    const uniqueId = useId();
    const isExpanded = expandedItems.includes(id);
    const triggerId = `accordion-trigger-${uniqueId}`;
    const panelId = `accordion-panel-${uniqueId}`;
    const variantStyles2 = {
      default: "border-b border-[var(--color-border-subtle)] last:border-b-0",
      bordered: "border-b border-[var(--color-border-subtle)] last:border-b-0",
      separated: "border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden"
    };
    return /* @__PURE__ */ jsx(AccordionItemContext.Provider, { value: { itemId: id, isExpanded, triggerId, panelId }, children: /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        "data-state": isExpanded ? "open" : "closed",
        "data-disabled": disabled || void 0,
        className: twMerge(variantStyles2[variant], disabled && "opacity-50", className),
        ...props,
        children
      }
    ) });
  }
);
AccordionItem.displayName = "Accordion.Item";
const AccordionTrigger = forwardRef(
  ({ children, iconPosition = "right", hideIcon = false, className, ...props }, ref) => {
    const { toggleItem, variant } = useAccordionContext();
    const { itemId, isExpanded, triggerId, panelId } = useAccordionItemContext();
    const handleClick = () => {
      toggleItem(itemId);
    };
    const bgStyles = {
      default: "",
      bordered: isExpanded ? "bg-[var(--color-surface-subtle)]" : "",
      separated: isExpanded ? "bg-[var(--color-surface-subtle)]" : ""
    };
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        type: "button",
        id: triggerId,
        "aria-expanded": isExpanded,
        "aria-controls": panelId,
        onClick: handleClick,
        className: twMerge(
          "flex items-center justify-between w-full",
          "px-4 py-3",
          "text-body-md font-medium text-[var(--color-text-default)]",
          "cursor-pointer",
          "hover:bg-[var(--color-surface-subtle)]",
          "transition-colors duration-[var(--duration-fast)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-action-primary)]",
          bgStyles[variant],
          iconPosition === "left" && "flex-row-reverse",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children }),
          !hideIcon && /* @__PURE__ */ jsx(
            IconChevronDown,
            {
              size: 12,
              stroke: 1.5,
              className: twMerge(
                "shrink-0 text-[var(--color-text-muted)]",
                "transition-transform duration-[var(--duration-fast)]",
                isExpanded && "rotate-180",
                iconPosition === "left" && "mr-2",
                iconPosition === "right" && "ml-2"
              )
            }
          )
        ]
      }
    );
  }
);
AccordionTrigger.displayName = "Accordion.Trigger";
const AccordionPanel = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { isExpanded, triggerId, panelId } = useAccordionItemContext();
    if (!isExpanded) return null;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        id: panelId,
        role: "region",
        "aria-labelledby": triggerId,
        className: twMerge("px-4 py-3 text-body-md text-[var(--color-text-default)]", className),
        ...props,
        children
      }
    );
  }
);
AccordionPanel.displayName = "Accordion.Panel";
const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel
};
const themeAliasMap = {
  blu: "blue",
  gry: "gray",
  gre: "green",
  ylw: "yellow"
};
const variantToTheme = {
  default: "gray",
  primary: "blue",
  success: "green",
  warning: "yellow",
  error: "red",
  info: "blue"
};
const themeStyles = {
  blue: "bg-[var(--badge-subtle-blue-bg)] text-[var(--badge-subtle-blue-text)]",
  red: "bg-[var(--badge-subtle-red-bg)] text-[var(--badge-subtle-red-text)]",
  green: "bg-[var(--badge-subtle-green-bg)] text-[var(--badge-subtle-green-text)]",
  yellow: "bg-[var(--badge-subtle-yellow-bg)] text-[var(--badge-subtle-yellow-text)]",
  gray: "bg-[var(--badge-subtle-gray-bg)] text-[var(--badge-subtle-gray-text)]",
  white: "bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-[inset_0_0_0_1px_var(--badge-white-border)]"
};
const sizes$1 = {
  sm: [
    "h-5",
    "px-[var(--badge-padding-x-sm)]",
    "text-[length:var(--badge-font-size-sm)]",
    "leading-[var(--badge-line-height-sm)]"
  ],
  md: [
    "h-6",
    "px-[var(--badge-padding-x-md)]",
    "text-[length:var(--badge-font-size-md)]",
    "leading-[var(--badge-line-height-md)]"
  ]
};
const Badge = memo(function Badge2({
  theme,
  type: _type,
  size = "md",
  leftIcon: rawLeftIcon,
  rightIcon: rawRightIcon,
  dot = false,
  children,
  className = "",
  variant,
  layout,
  icon,
  ...props
}) {
  const leftIcon = layout === "left-icon" && icon ? icon : rawLeftIcon;
  const rightIcon = layout === "right-icon" && icon ? icon : rawRightIcon;
  const normalizedTheme = theme && theme in themeAliasMap ? themeAliasMap[theme] : theme;
  const resolvedTheme = normalizedTheme ?? (variant ? variantToTheme[variant] : "white");
  const baseStyles = [
    "inline-flex items-center justify-center",
    "gap-[var(--badge-gap)]",
    "font-medium",
    "min-w-[20px] text-center",
    "rounded-[var(--badge-radius)]"
  ].join(" ");
  const classes = twMerge(baseStyles, themeStyles[resolvedTheme], sizes$1[size].join(" "), className);
  const dotColors = {
    blue: "bg-[var(--color-state-info)]",
    red: "bg-[var(--color-state-danger)]",
    green: "bg-[var(--color-state-success)]",
    yellow: "bg-[var(--color-state-warning)]",
    gray: "bg-[var(--color-text-subtle)]",
    white: "bg-[var(--color-text-default)]"
  };
  return /* @__PURE__ */ jsxs("span", { "data-figma-name": "[TDS] Badge", className: classes, ...props, children: [
    dot && /* @__PURE__ */ jsx(
      "span",
      {
        className: `size-[var(--badge-dot-size)] rounded-full shrink-0 ${dotColors[resolvedTheme]}`
      }
    ),
    leftIcon && /* @__PURE__ */ jsx("span", { className: "shrink-0", children: leftIcon }),
    children,
    rightIcon && /* @__PURE__ */ jsx("span", { className: "shrink-0", children: rightIcon })
  ] });
});
function Popover({
  content,
  children,
  position = "bottom",
  align = "center",
  trigger = "click",
  delay = 200,
  hideDelay = 150,
  disabled = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showArrow = true,
  className = "",
  "aria-label": ariaLabel
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [arrowOffset, setArrowOffset] = useState(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const showTimeoutRef = useRef(void 0);
  const hideTimeoutRef = useRef(void 0);
  const isControlled = controlledIsOpen !== void 0;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = useCallback(
    (open) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange == null ? void 0 : onOpenChange(open);
    },
    [isControlled, onOpenChange]
  );
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const gap = showArrow ? 8 : 4;
    let x = 0;
    let y = 0;
    const alignX = () => {
      if (align === "start") return triggerRect.left;
      if (align === "end") return triggerRect.right - popoverRect.width;
      return triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
    };
    const alignY = () => {
      if (align === "start") return triggerRect.top;
      if (align === "end") return triggerRect.bottom - popoverRect.height;
      return triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
    };
    switch (position) {
      case "top":
        x = alignX();
        y = triggerRect.top - popoverRect.height - gap;
        break;
      case "bottom":
        x = alignX();
        y = triggerRect.bottom + gap;
        break;
      case "left":
        x = triggerRect.left - popoverRect.width - gap;
        y = alignY();
        break;
      case "right":
        x = triggerRect.right + gap;
        y = alignY();
        break;
    }
    x = Math.max(8, Math.min(x, window.innerWidth - popoverRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - popoverRect.height - 8));
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    if (position === "top" || position === "bottom") {
      setArrowOffset(triggerCenterX - x);
    } else {
      setArrowOffset(triggerCenterY - y);
    }
    setCoords({ x, y });
    setIsPositioned(true);
  }, [position, align, showArrow]);
  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = void 0;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = void 0;
    }
  }, []);
  const handleOpen = useCallback(() => {
    if (disabled) return;
    clearTimeouts();
    if (trigger === "hover") {
      showTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
      }, delay);
    } else {
      setIsOpen(true);
    }
  }, [disabled, trigger, delay, setIsOpen, clearTimeouts]);
  const handleClose = useCallback(() => {
    clearTimeouts();
    if (trigger === "hover") {
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        setIsPositioned(false);
      }, hideDelay);
    } else {
      setIsOpen(false);
      setIsPositioned(false);
    }
  }, [trigger, hideDelay, setIsOpen, clearTimeouts]);
  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [disabled, isOpen, handleOpen, handleClose]);
  const handleTriggerClick = useCallback(() => {
    if (trigger === "click") {
      handleToggle();
    }
  }, [trigger, handleToggle]);
  const handleTriggerKeyDown = useCallback(
    (event) => {
      if (trigger === "click") {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleToggle();
        }
      }
    },
    [trigger, handleToggle]
  );
  const handlePopoverMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      clearTimeouts();
    }
  }, [trigger, clearTimeouts]);
  const handlePopoverMouseLeave = useCallback(() => {
    if (trigger === "hover") {
      handleClose();
    }
  }, [trigger, handleClose]);
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (event) => {
      var _a;
      if (event.key === "Escape") {
        handleClose();
        (_a = triggerRef.current) == null ? void 0 : _a.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || trigger === "hover") return;
    const handleClickOutside = (event) => {
      var _a, _b;
      const target = event.target;
      if (((_a = triggerRef.current) == null ? void 0 : _a.contains(target)) || ((_b = popoverRef.current) == null ? void 0 : _b.contains(target))) {
        return;
      }
      handleClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnOutsideClick, trigger, handleClose]);
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isOpen, updatePosition]);
  useEffect(() => {
    if (!isOpen) return;
    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen, updatePosition]);
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);
  const renderArrow = (pos) => {
    const hStyle = arrowOffset != null ? { left: `${arrowOffset}px`, transform: "translateX(-50%)" } : { left: "50%", transform: "translateX(-50%)" };
    const vStyle = arrowOffset != null ? { top: `${arrowOffset}px`, transform: "translateY(-50%)" } : { top: "50%", transform: "translateY(-50%)" };
    switch (pos) {
      case "bottom":
        return /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full mb-[-1px]", style: hStyle, children: [
          /* @__PURE__ */ jsx("div", { className: "w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[var(--color-border-default)]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-surface-default)]" })
        ] });
      case "top":
        return /* @__PURE__ */ jsxs("div", { className: "absolute top-full -mt-px", style: hStyle, children: [
          /* @__PURE__ */ jsx("div", { className: "w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[var(--color-border-default)]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-surface-default)]" })
        ] });
      case "left":
        return /* @__PURE__ */ jsxs("div", { className: "absolute left-full -ml-px", style: vStyle, children: [
          /* @__PURE__ */ jsx("div", { className: "w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-[var(--color-border-default)]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 -ml-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--color-surface-default)]" })
        ] });
      case "right":
        return /* @__PURE__ */ jsxs("div", { className: "absolute right-full -mr-px", style: vStyle, children: [
          /* @__PURE__ */ jsx("div", { className: "w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[var(--color-border-default)]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 -mr-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[var(--color-surface-default)]" })
        ] });
    }
  };
  const reactId = useId();
  const popoverId = `popover-${reactId}`;
  const enhancedChildren = isValidElement(children) ? cloneElement(children, {
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    "aria-controls": isOpen ? popoverId : void 0
  }) : children;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: triggerRef,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
        onMouseEnter: trigger === "hover" ? handleOpen : void 0,
        onMouseLeave: trigger === "hover" ? handleClose : void 0,
        onFocus: trigger === "hover" ? handleOpen : void 0,
        onBlur: trigger === "hover" ? handleClose : void 0,
        className: "inline-flex",
        children: enhancedChildren
      }
    ),
    isOpen && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: popoverRef,
          id: popoverId,
          role: "dialog",
          "aria-label": ariaLabel ?? "Popover",
          "aria-modal": trigger === "click",
          onMouseEnter: handlePopoverMouseEnter,
          onMouseLeave: handlePopoverMouseLeave,
          className: "fixed z-[var(--z-popover)] transition-opacity duration-[var(--duration-fast)]",
          style: {
            left: coords.x,
            top: coords.y,
            opacity: isPositioned ? 1 : 0
          },
          children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "data-figma-name": "[TDS] Popover",
                className: `
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  rounded-[var(--primitive-radius-lg)]
                  shadow-lg
                  ${className}
                `,
                children: content
              }
            ),
            showArrow && renderArrow(position)
          ] })
        }
      ),
      document.body
    )
  ] });
}
const BadgeList = memo(function BadgeList2({
  items,
  maxVisible = 2,
  maxBadgeWidth,
  size = "sm",
  theme,
  type,
  popoverTitle,
  renderItem,
  overflowAlign = "inline"
}) {
  if (items.length === 0) return null;
  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;
  const renderBadge = (item, index, truncate) => renderItem ? renderItem(item, index) : /* @__PURE__ */ jsx(
    Badge,
    {
      size,
      theme,
      type,
      className: maxBadgeWidth ? void 0 : "shrink-0",
      style: maxBadgeWidth ? { maxWidth: maxBadgeWidth } : void 0,
      title: maxBadgeWidth ? item : void 0,
      children: maxBadgeWidth ? /* @__PURE__ */ jsx("span", { className: "block truncate", children: item }) : item
    },
    index
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] BadgeList",
      className: `flex flex-nowrap gap-1 items-center${overflowAlign === "right" && remainingCount > 0 ? " w-full justify-between" : ""}`,
      children: [
        visibleItems.map((item, index) => renderBadge(item, index)),
        remainingCount > 0 && /* @__PURE__ */ jsx(
          Popover,
          {
            trigger: "hover",
            position: "top",
            delay: 100,
            hideDelay: 100,
            content: /* @__PURE__ */ jsxs("div", { className: "p-3 min-w-[120px] max-w-[320px]", children: [
              /* @__PURE__ */ jsx("div", { className: "text-body-xs font-medium text-[var(--color-text-muted)] mb-2", children: popoverTitle ?? `All items (${items.length})` }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: items.map((item, index) => /* @__PURE__ */ jsx(
                Badge,
                {
                  size,
                  theme,
                  type,
                  className: "w-fit max-w-full",
                  children: /* @__PURE__ */ jsx("span", { className: "break-all", children: item })
                },
                index
              )) })
            ] }),
            children: /* @__PURE__ */ jsxs(
              "span",
              {
                className: `inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors ${size === "sm" ? "h-5" : size === "md" ? "h-6" : "h-7"}`,
                children: [
                  "+",
                  remainingCount
                ]
              }
            )
          }
        )
      ]
    }
  );
});
function Breadcrumb({ items, separator, className = "", maxItems = 0 }) {
  const displayItems = maxItems > 0 && items.length > maxItems ? [...items.slice(0, 1), { label: "...", href: void 0 }, ...items.slice(-(maxItems - 1))] : items;
  const defaultSeparator = /* @__PURE__ */ jsx(
    IconChevronRight,
    {
      size: 12,
      className: "text-[var(--breadcrumb-separator-color)] shrink-0",
      strokeWidth: 1.5
    }
  );
  return /* @__PURE__ */ jsx(
    "nav",
    {
      "data-figma-name": "[TDS] Breadcrumb",
      "aria-label": "Breadcrumb",
      className: twMerge("flex items-center gap-[var(--breadcrumb-gap)]", className),
      children: /* @__PURE__ */ jsx("ol", { className: "flex items-center gap-[var(--breadcrumb-gap)] list-none m-0 p-0", children: displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === "...";
        return /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-center gap-[var(--breadcrumb-gap)]",
            children: [
              index > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: separator ?? defaultSeparator }),
              isEllipsis ? /* @__PURE__ */ jsx("span", { className: "text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)]", children: item.label }) : isLast ? /* @__PURE__ */ jsxs(
                "span",
                {
                  "aria-current": "page",
                  className: "inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-current)]",
                  children: [
                    item.icon && /* @__PURE__ */ jsx("span", { className: "mr-1 flex items-center", children: item.icon }),
                    item.label
                  ]
                }
              ) : item.href ? /* @__PURE__ */ jsxs(
                Link,
                {
                  to: item.href,
                  onClick: item.onClick,
                  className: "inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)] hover:text-[var(--breadcrumb-text-hover)] transition-colors duration-[var(--duration-fast)]",
                  children: [
                    item.icon && /* @__PURE__ */ jsx("span", { className: "mr-1 flex items-center", children: item.icon }),
                    item.label
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: item.onClick,
                  className: "inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)] hover:text-[var(--breadcrumb-text-hover)] transition-colors duration-[var(--duration-fast)] bg-transparent border-none cursor-pointer p-0",
                  children: [
                    item.icon && /* @__PURE__ */ jsx("span", { className: "mr-1 flex items-center", children: item.icon }),
                    item.label
                  ]
                }
              )
            ]
          },
          `${item.label}-${index}`
        );
      }) })
    }
  );
}
function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  disabled = false,
  ...rest
}) {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [arrowOffset, setArrowOffset] = useState(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(void 0);
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 6;
    let x = 0;
    let y = 0;
    switch (position) {
      case "top":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - gap;
        break;
      case "bottom":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + gap;
        break;
      case "left":
        x = triggerRect.left - tooltipRect.width - gap;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case "right":
        x = triggerRect.right + gap;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    const clampedY = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));
    if (position === "top" || position === "bottom") {
      const shift = clampedX - x;
      if (Math.abs(shift) > 1) {
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        setArrowOffset(triggerCenter - clampedX);
      } else {
        setArrowOffset(null);
      }
    } else if (position === "left" || position === "right") {
      const shift = clampedY - y;
      if (Math.abs(shift) > 1) {
        const triggerCenter = triggerRect.top + triggerRect.height / 2;
        setArrowOffset(triggerCenter - clampedY);
      } else {
        setArrowOffset(null);
      }
    }
    setCoords({ x: clampedX, y: clampedY });
    setIsPositioned(true);
  }, [position]);
  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setIsPositioned(false);
  };
  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);
  useEffect(() => {
    if (!isVisible) return;
    const handleUpdate = () => updatePosition();
    const scrollOptions = { capture: true, passive: true };
    window.addEventListener("scroll", handleUpdate, scrollOptions);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, scrollOptions);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isVisible, updatePosition]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const getArrowStyles = () => {
    const base = {
      top: "bottom-0 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-[var(--tooltip-bg)]",
      bottom: "top-0 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-[var(--tooltip-bg)]",
      left: "right-0 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-[var(--tooltip-bg)]",
      right: "left-0 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-[var(--tooltip-bg)]"
    };
    if (arrowOffset !== null && (position === "top" || position === "bottom")) {
      return {
        className: base[position],
        style: {
          left: `${arrowOffset}px`,
          transform: "translateX(-50%)" + (position === "bottom" ? " translateY(-100%)" : " translateY(100%)")
        }
      };
    }
    if (arrowOffset !== null && (position === "left" || position === "right")) {
      return {
        className: base[position],
        style: {
          top: `${arrowOffset}px`,
          transform: "translateY(-50%)" + (position === "right" ? " translateX(-100%)" : " translateX(100%)")
        }
      };
    }
    const centered = {
      top: `${base.top} left-1/2 -translate-x-1/2`,
      bottom: `${base.bottom} left-1/2 -translate-x-1/2`,
      left: `${base.left} top-1/2 -translate-y-1/2`,
      right: `${base.right} top-1/2 -translate-y-1/2`
    };
    return { className: centered[position] };
  };
  const arrowProps = getArrowStyles();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ...rest,
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
        className: "inline-flex",
        "aria-describedby": isVisible ? tooltipId : void 0,
        children
      }
    ),
    isVisible && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: tooltipRef,
          id: tooltipId,
          role: "tooltip",
          className: "fixed z-[var(--z-tooltip)] pointer-events-none transition-opacity duration-[var(--duration-fast)]",
          style: {
            left: coords.x,
            top: coords.y,
            opacity: isPositioned ? 1 : 0
          },
          children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "data-figma-name": "[TDS] Tooltip",
                className: "\n                  bg-[var(--tooltip-bg)]\n                  text-[var(--tooltip-text)]\n                  px-[var(--tooltip-padding-x)]\n                  py-[var(--tooltip-padding-y)]\n                  rounded-[var(--tooltip-radius)]\n                  text-[length:var(--tooltip-font-size)]\n                  leading-[var(--tooltip-line-height)]\n                  text-left\n                  max-w-[var(--tooltip-max-width)]\n                  w-max\n                ",
                children: content
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute w-0 h-0 border-[length:var(--tooltip-arrow-size)] border-solid ${arrowProps.className}`,
                style: arrowProps.style
              }
            )
          ] })
        }
      ),
      document.body
    )
  ] });
}
const IconInUse = ({ size = 16 }) => /* @__PURE__ */ jsx(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M2.6665 8V6C2.6665 5.46957 2.87722 4.96086 3.25229 4.58579C3.62736 4.21071 4.13607 4 4.6665 4H13.3332M13.3332 4L11.3332 2M13.3332 4L11.3332 6M13.3332 8V10C13.3332 10.5304 13.1225 11.0391 12.7474 11.4142C12.3723 11.7893 11.8636 12 11.3332 12H2.6665M2.6665 12L4.6665 14M2.6665 12L4.6665 10",
        stroke: "currentColor",
        strokeWidth: 1.25,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  }
);
const ICON_SIZE = 16;
const statusConfig = {
  // Success (Green) - using semantic color
  active: {
    label: "Active",
    icon: /* @__PURE__ */ jsx(IconLivePhoto, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-success-bg)]"
  },
  enabled: {
    label: "Enabled",
    icon: /* @__PURE__ */ jsx(IconPower, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-success-bg)]"
  },
  // Danger (Red) - using semantic color
  error: {
    label: "Error",
    icon: /* @__PURE__ */ jsx(IconAlertTriangle, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-danger-bg)]"
  },
  // Info (Blue) - using semantic color (transitional states)
  building: {
    label: "Building...",
    icon: /* @__PURE__ */ jsx(IconLoader, { size: ICON_SIZE, strokeWidth: 2, className: "animate-spin-slow" }),
    bgColor: "bg-[var(--status-info-bg)]"
  },
  deleting: {
    label: "Deleting...",
    icon: /* @__PURE__ */ jsx(IconLoader, { size: ICON_SIZE, strokeWidth: 2, className: "animate-spin-slow" }),
    bgColor: "bg-[var(--status-info-bg)]"
  },
  pending: {
    label: "Pending",
    icon: /* @__PURE__ */ jsx(IconLoader, { size: ICON_SIZE, strokeWidth: 2, className: "animate-spin-slow" }),
    bgColor: "bg-[var(--status-info-bg)]"
  },
  // Warning (Orange) - using semantic color
  "verify-resized": {
    label: "Verify Resized",
    icon: /* @__PURE__ */ jsx(IconCircleDashedCheck, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-warning-bg)]"
  },
  degraded: {
    label: "Degraded",
    icon: /* @__PURE__ */ jsx(IconAlertHexagon, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-warning-bg)]"
  },
  "no-monitor": {
    label: "No Monitor",
    icon: /* @__PURE__ */ jsx(IconShieldExclamation, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-warning-bg)]"
  },
  down: {
    label: "Down",
    icon: /* @__PURE__ */ jsx(IconCircleX, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  maintenance: {
    label: "Maintenance",
    icon: /* @__PURE__ */ jsx(IconTool, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-warning-bg)]"
  },
  // Muted (Gray) - using semantic color
  suspended: {
    label: "Suspended",
    icon: /* @__PURE__ */ jsx(IconCircleMinus, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  shelved: {
    label: "Shelved Offloaded",
    icon: /* @__PURE__ */ jsx(IconPlugConnectedX, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  "shelved-offloaded": {
    label: "Shelved Offloaded",
    icon: /* @__PURE__ */ jsx(IconPlugConnectedX, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  mounted: {
    label: "Mounted",
    icon: /* @__PURE__ */ jsx(IconPlugConnected, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  shutoff: {
    label: "Shutoff",
    icon: /* @__PURE__ */ jsx(IconPower, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  paused: {
    label: "Paused",
    icon: /* @__PURE__ */ jsx(IconPlayerPause, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  draft: {
    label: "Draft",
    icon: /* @__PURE__ */ jsx(IconEdit$1, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  deactivated: {
    label: "Deactivated",
    icon: /* @__PURE__ */ jsx(IconLivePhotoOff, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  disabled: {
    label: "Disabled",
    icon: /* @__PURE__ */ jsx(IconBan, { size: ICON_SIZE, strokeWidth: 2 }),
    bgColor: "bg-[var(--status-muted-bg)]"
  },
  "in-use": {
    label: "In-use",
    icon: /* @__PURE__ */ jsx(IconInUse, { size: ICON_SIZE }),
    bgColor: "bg-[var(--status-muted-bg)]"
  }
};
const StatusIndicator = memo(function StatusIndicator2({
  status,
  layout: rawLayout = "icon-only",
  size = "md",
  label,
  className = "",
  // thaki-ui compatibility props
  colorScheme,
  customIcon,
  tooltip,
  ...props
}) {
  const layout = rawLayout === "leftIcon" || rawLayout === "default" || rawLayout === "iconOnly" ? "icon-only" : rawLayout;
  const config = statusConfig[status] ?? statusConfig.error;
  const displayIcon = customIcon ?? config.icon;
  const displayLabel = label ?? config.label;
  if (process.env.NODE_ENV === "development") {
    if (colorScheme)
      console.warn("[StatusIndicator] colorScheme prop is deprecated. Use status prop instead.");
    if (tooltip)
      console.warn(
        "[StatusIndicator] tooltip prop is deprecated. Wrap with Tooltip component instead."
      );
  }
  const iconSizes = {
    sm: 14,
    md: 14,
    lg: 16
  };
  const sizeStyles2 = {
    sm: "size-[24px]",
    md: "size-[24px]",
    lg: "size-[28px]"
  };
  if (layout === "icon-only") {
    const iconSize2 = iconSizes[size];
    const containerSize2 = sizeStyles2[size];
    const clonedIcon = isValidElement(displayIcon) ? cloneElement(displayIcon, { size: iconSize2 }) : displayIcon;
    const classes = twMerge(
      "inline-flex items-center justify-center",
      "rounded-full",
      "text-[var(--status-text)]",
      containerSize2,
      config.bgColor,
      className
    );
    return /* @__PURE__ */ jsx(Tooltip, { content: displayLabel, position: "top", children: /* @__PURE__ */ jsx(
      "span",
      {
        "data-figma-name": "[TDS] StatusIndicator",
        className: classes,
        role: "status",
        "aria-label": displayLabel,
        ...props,
        children: /* @__PURE__ */ jsx("span", { className: "shrink-0", children: clonedIcon })
      }
    ) });
  }
  if (layout === "badge") {
    const baseStyles = [
      "inline-flex items-center",
      "gap-1.5",
      "font-medium",
      "rounded-md",
      "px-2 py-0.5",
      "text-[var(--status-text)]",
      "text-body-sm",
      "leading-4"
    ].join(" ");
    const classes = twMerge(baseStyles, config.bgColor, className);
    return /* @__PURE__ */ jsxs(
      "span",
      {
        "data-figma-name": "[TDS] StatusIndicator",
        className: classes,
        role: "status",
        "aria-label": displayLabel,
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "shrink-0", children: displayIcon }),
          /* @__PURE__ */ jsx("span", { children: displayLabel })
        ]
      }
    );
  }
  const iconSize = iconSizes[size];
  const containerSize = sizeStyles2[size];
  const fallbackIcon = isValidElement(displayIcon) ? cloneElement(displayIcon, { size: iconSize }) : displayIcon;
  const fallbackClasses = twMerge(
    "inline-flex items-center justify-center",
    "rounded-full",
    "text-[var(--status-text)]",
    containerSize,
    config.bgColor,
    className
  );
  return /* @__PURE__ */ jsx(Tooltip, { content: displayLabel, position: "top", children: /* @__PURE__ */ jsx(
    "span",
    {
      "data-figma-name": "[TDS] StatusIndicator",
      className: fallbackClasses,
      role: "status",
      "aria-label": displayLabel,
      ...props,
      children: /* @__PURE__ */ jsx("span", { className: "shrink-0", children: fallbackIcon })
    }
  ) });
});
function MenuItem({
  icon,
  label,
  href,
  active = false,
  badge: badge2,
  onClick,
  disabled = false
}) {
  const baseStyles = [
    "w-[175px]",
    "px-[var(--menu-item-padding-x)]",
    "py-[var(--menu-item-padding-y)]",
    "rounded-[var(--menu-item-radius)]",
    "flex items-center",
    "gap-[var(--menu-item-gap)]",
    "text-body-sm",
    "transition-colors duration-[var(--duration-fast)]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
  ].join(" ");
  const stateStyles = active ? "bg-[var(--menu-item-active-bg)] text-[var(--menu-item-active-text)] font-medium" : disabled ? "text-[var(--color-text-disabled)] cursor-not-allowed" : "text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] font-normal";
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    icon && /* @__PURE__ */ jsx(
      "span",
      {
        className: `shrink-0 ${active ? "text-[var(--menu-item-active-text)]" : "text-[var(--color-text-default)]"}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-left truncate", children: label }),
    badge2 && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 text-body-xs font-medium bg-[var(--menu-item-active-bg)] text-[var(--menu-item-active-text)] rounded", children: badge2 })
  ] });
  if (href) {
    return /* @__PURE__ */ jsx(
      Link,
      {
        to: href,
        "data-figma-name": "[TDS] MenuItem",
        onClick: disabled ? (e) => e.preventDefault() : onClick,
        className: twMerge(baseStyles, stateStyles),
        "aria-current": active ? "page" : void 0,
        "aria-disabled": disabled,
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "data-figma-name": "[TDS] MenuItem",
      onClick: disabled ? void 0 : onClick,
      className: twMerge(baseStyles, stateStyles),
      "aria-disabled": disabled,
      children: content
    }
  );
}
const sizes = {
  sm: "max-w-screen-sm",
  // 640px
  md: "max-w-screen-md",
  // 768px
  lg: "max-w-screen-lg",
  // 1024px
  xl: "max-w-screen-xl",
  // 1280px
  full: "max-w-full"
};
function Container({
  size = "lg",
  centered = true,
  padding = true,
  children,
  className = "",
  ...props
}) {
  const classes = [
    "w-full",
    sizes[size],
    centered ? "mx-auto" : "",
    padding ? "px-4 sm:px-6 lg:px-8" : "",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { className: classes, ...props, children });
}
const directionStyles = {
  row: "flex-row",
  column: "flex-col"
};
const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
};
const justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
};
const gapStyles = {
  0: "gap-0",
  0.5: "gap-[2px]",
  1: "gap-[4px]",
  1.5: "gap-[6px]",
  2: "gap-[8px]",
  3: "gap-[12px]",
  4: "gap-[16px]",
  5: "gap-[20px]",
  6: "gap-[24px]",
  8: "gap-[32px]",
  10: "gap-[40px]",
  12: "gap-[48px]",
  16: "gap-[64px]",
  20: "gap-[80px]",
  24: "gap-[96px]"
};
function Stack({
  direction = "column",
  align = "stretch",
  justify = "start",
  gap = 6,
  wrap = false,
  children,
  className = "",
  ...props
}) {
  const classes = [
    "flex",
    directionStyles[direction],
    alignStyles[align],
    justifyStyles[justify],
    gapStyles[gap],
    wrap ? "flex-wrap" : "",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { className: classes, ...props, children });
}
function HStack(props) {
  return /* @__PURE__ */ jsx(Stack, { "data-figma-name": "[TDS] HStack", direction: "row", ...props });
}
function VStack(props) {
  return /* @__PURE__ */ jsx(Stack, { "data-figma-name": "[TDS] VStack", direction: "column", ...props });
}
function MenuSection({
  title,
  children,
  defaultOpen = true,
  collapsible = true,
  onTitleClick
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const handleTitleClick = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
    if (onTitleClick) {
      onTitleClick();
    }
  };
  return /* @__PURE__ */ jsxs(VStack, { gap: 1.5, className: "w-[175px]", "data-figma-name": "[TDS] MenuSection", children: [
    collapsible ? /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleTitleClick,
        className: "flex items-center gap-1 w-[175px] group focus:outline-none px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)]", children: title }),
          isOpen ? /* @__PURE__ */ jsx(IconChevronDown, { size: 12, className: "text-[var(--color-text-disabled)]", stroke: 1 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 12, className: "text-[var(--color-text-disabled)]", stroke: 1 })
        ]
      }
    ) : /* @__PURE__ */ jsx("span", { className: "w-[175px] text-label-sm text-[var(--color-text-subtle)] px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]", children: title }),
    isOpen && /* @__PURE__ */ jsx(VStack, { gap: 0, className: "w-[175px]", children })
  ] });
}
function MenuDivider({ spacing: spacing2 = "md" }) {
  const spacingStyles = {
    sm: "my-1",
    md: "my-[var(--menu-divider-margin)]",
    lg: "my-3"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] MenuDivider",
      className: `w-full h-px bg-[var(--color-border-default)] ${spacingStyles[spacing2]}`
    }
  );
}
const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])'
].join(", ");
function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null);
  }, []);
  useEffect(() => {
    if (!isActive) return;
    previousFocusRef.current = document.activeElement;
    const raf = requestAnimationFrame(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        const el = containerRef.current;
        if (el) {
          el.tabIndex = -1;
          el.focus();
        }
      }
    });
    const handleKeyDown = (e) => {
      var _a, _b;
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !((_a = containerRef.current) == null ? void 0 : _a.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !((_b = containerRef.current) == null ? void 0 : _b.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown, true);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        try {
          previousFocusRef.current.focus();
        } catch {
        }
      }
    };
  }, [isActive, getFocusableElements]);
  return containerRef;
}
function Drawer({
  isOpen,
  onClose,
  title,
  description,
  side = "right",
  width = 320,
  showCloseButton: _showCloseButton,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  footer,
  className
}) {
  const titleId = useId();
  const descriptionId = useId();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);
  if (!shouldRender) return null;
  const widthValue = typeof width === "number" ? `${width}px` : width;
  const backdropClasses = twMerge(
    "fixed inset-0 z-[var(--z-modal)]",
    "bg-[color-mix(in_srgb,var(--color-text-default)_60%,transparent)]",
    "transition-opacity duration-300 ease-out",
    isAnimating ? "opacity-100" : "opacity-0"
  );
  const drawerClasses = twMerge(
    "fixed top-0 bottom-0 z-[var(--z-modal)]",
    "bg-[var(--color-surface-default)]",
    "flex flex-col",
    "shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--color-text-default)_25%,transparent)]",
    "transition-transform duration-300 ease-out",
    side === "right" ? "right-0" : "left-0",
    isAnimating ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full",
    className
  );
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: backdropClasses,
          onClick: closeOnBackdropClick ? onClose : void 0,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxs(
        "aside",
        {
          "data-figma-name": "[TDS] Overlay.Drawer",
          ref: focusTrapRef,
          className: drawerClasses,
          style: { width: widthValue },
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title ? titleId : void 0,
          "aria-describedby": title && description ? descriptionId : void 0,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 px-6 pt-4 pb-8 drawer-scroll", children: [
              title && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("h2", { id: titleId, className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
                description && /* @__PURE__ */ jsx(
                  "p",
                  {
                    id: descriptionId,
                    className: "text-body-md text-[var(--color-text-subtle)] mt-1 mb-4",
                    children: description
                  }
                ),
                !description && /* @__PURE__ */ jsx("div", { className: "mb-4" })
              ] }),
              children
            ] }),
            footer && /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--color-border-default)] px-6 py-4 overflow-visible", children: footer })
          ]
        }
      )
    ] }),
    document.body
  );
}
function ListToolbarActions({ children, className }) {
  return /* @__PURE__ */ jsx(HStack, { "data-figma-name": "[TDS] ListToolbar/Actions", gap: 1, className, children });
}
function ListToolbarDivider({ className }) {
  return /* @__PURE__ */ jsx("div", { className: twMerge("h-4 w-px bg-[var(--color-border-default)]", className) });
}
function ListToolbarFilters({
  filters,
  onFilterRemove,
  onFiltersClear,
  clearFiltersLabel = "Clear Filters",
  className
}) {
  if (filters.length === 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: twMerge(
        "flex items-center justify-between pl-2 pr-4 py-2",
        "bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: filters.map((filter) => /* @__PURE__ */ jsx(
          Chip,
          {
            label: filter.field,
            value: filter.value,
            onRemove: onFilterRemove ? () => onFilterRemove(filter.id) : void 0
          },
          filter.id
        )) }),
        onFiltersClear && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onFiltersClear,
            className: "text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors",
            children: clearFiltersLabel
          }
        )
      ]
    }
  );
}
function ListToolbar({
  primaryActions,
  bulkActions,
  showDivider = true,
  filters = [],
  onFilterRemove,
  onFiltersClear,
  clearFiltersLabel = "Clear Filters",
  className,
  children,
  ...rest
}) {
  const hasActions = primaryActions || bulkActions || children;
  const hasFilters = filters.length > 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] ListToolbar",
      className: twMerge("flex flex-col gap-2", className),
      ...rest,
      children: [
        hasActions && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          primaryActions,
          showDivider && primaryActions && bulkActions && /* @__PURE__ */ jsx(ListToolbarDivider, {}),
          bulkActions,
          children
        ] }),
        hasFilters && /* @__PURE__ */ jsx(
          ListToolbarFilters,
          {
            filters,
            onFilterRemove,
            onFiltersClear,
            clearFiltersLabel
          }
        )
      ]
    }
  );
}
ListToolbar.Actions = ListToolbarActions;
ListToolbar.Divider = ListToolbarDivider;
ListToolbar.Filters = ListToolbarFilters;
function useStableId(prefix) {
  const id = useId();
  return prefix ? `${prefix}-${id}` : id;
}
function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  size = "sm",
  className,
  ...rest
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const titleId = useStableId("modal-title");
  const descriptionId = useStableId("modal-desc");
  const focusTrapRef = useFocusTrap(isOpen);
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);
  const sizeWidthClass = size === "md" ? "w-[480px]" : size === "lg" ? "w-[640px]" : "w-[360px]";
  if (!shouldRender) return null;
  const backdropClasses = twMerge(
    "fixed inset-0 z-[var(--z-modal)]",
    "bg-[color-mix(in_srgb,var(--color-text-default)_60%,transparent)]",
    "flex items-center justify-center",
    "transition-opacity duration-200 ease-out",
    isAnimating ? "opacity-100" : "opacity-0"
  );
  const modalClasses = twMerge(
    "bg-[var(--color-surface-default)]",
    "border border-[var(--color-border-default)]",
    "rounded-[var(--radius-xl)]",
    "shadow-[0px_0px_4px_0px_color-mix(in_srgb,var(--color-text-default)_10%,transparent)]",
    "p-4",
    "flex flex-col gap-4",
    "transition-all duration-200 ease-out",
    isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95",
    "max-w-[calc(100vw-2rem)]",
    sizeWidthClass,
    className
  );
  return createPortal(
    /* @__PURE__ */ jsx("div", { className: backdropClasses, onClick: handleBackdropClick, children: /* @__PURE__ */ jsxs(
      "div",
      {
        "data-figma-name": "[TDS] Overlay",
        ...rest,
        ref: focusTrapRef,
        className: modalClasses,
        onClick: (e) => e.stopPropagation(),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": description ? descriptionId : void 0,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("h2", { id: titleId, className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
            description && /* @__PURE__ */ jsx("p", { id: descriptionId, className: "text-body-md text-[var(--color-text-subtle)]", children: description })
          ] }),
          children
        ]
      }
    ) }),
    document.body
  );
}
const confirmVariantToMessageVariant = {
  danger: "error",
  warning: "warning",
  primary: "info"
};
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  infoLabel,
  infoValue,
  isLoading = false,
  ...props
}) {
  const messageVariant = confirmVariantToMessageVariant[confirmVariant] ?? "info";
  return /* @__PURE__ */ jsxs(Modal, { isOpen, onClose, title, ...props, children: [
    (infoLabel || description) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      infoLabel && infoValue && /* @__PURE__ */ jsxs("div", { className: "bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-subtle)]", children: infoLabel }),
        /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: infoValue })
      ] }),
      description && /* @__PURE__ */ jsx(InlineMessage, { variant: messageVariant, children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "md",
          onClick: onClose,
          disabled: isLoading,
          className: "flex-1",
          children: cancelText
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: confirmVariant,
          size: "md",
          onClick: onConfirm,
          disabled: isLoading,
          className: "flex-1",
          children: isLoading ? "Processing..." : confirmText
        }
      )
    ] })
  ] });
}
function InfoBox({
  label,
  value,
  children,
  tooltip,
  copyable = false,
  status,
  className = ""
}) {
  const isStringValue = typeof value === "string";
  const renderValue = () => {
    if (children) return children;
    if (value == null) return null;
    if (isStringValue) {
      return /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)] truncate", title: value, children: value });
    }
    return /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)] min-w-0 overflow-hidden", children: value });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] InfoBox",
      className: twMerge(
        "w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] relative min-w-0",
        className
      ),
      children: [
        status && /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-3 -translate-y-1/2", children: /* @__PURE__ */ jsx(StatusIndicator, { status, layout: "icon-only", size: "md" }) }),
        /* @__PURE__ */ jsxs("div", { className: twMerge("flex flex-col gap-[6px] min-w-0", status && "pr-6"), children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[4px]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-subtle)] whitespace-nowrap", children: label }),
            tooltip && /* @__PURE__ */ jsx(Tooltip, { content: tooltip, children: /* @__PURE__ */ jsx(IconInfoCircle, { size: 14, className: "text-[var(--color-text-subtle)]" }) })
          ] }),
          (renderValue() !== null || copyable && isStringValue) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            renderValue(),
            copyable && isStringValue && /* @__PURE__ */ jsx(CopyButton, { value, size: "sm", iconOnly: true })
          ] })
        ] })
      ]
    }
  );
}
function InfoBoxGroup({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `flex flex-col gap-[12px] ${className}`.trim(), children });
}
InfoBox.Group = InfoBoxGroup;
function DetailHeader({ children, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] DetailPageHeader",
      className: twMerge(
        "bg-[var(--color-surface-default)]",
        "border border-[var(--color-border-default)]",
        "rounded-[var(--radius-lg)]",
        "px-4 pt-3 pb-3",
        "w-full",
        className
      ),
      ...props,
      children
    }
  );
}
function DetailHeaderTitle({ children, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "h5",
    {
      "data-figma-name": "[TDS] DetailPageHeader/Title",
      className: twMerge("text-heading-h5", "text-[var(--color-text-default)]", "mb-3", className),
      ...props,
      children
    }
  );
}
function DetailHeaderActions({ children, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] DetailPageHeader/Actions",
      className: twMerge("flex items-center gap-1", "mb-3", className),
      ...props,
      children
    }
  );
}
function getRowLayout(count) {
  if (count <= 4) return [count];
  if (count === 5) return [3, 2];
  if (count === 6) return [4, 2];
  if (count === 7) return [4, 3];
  if (count === 8) return [4, 4];
  if (count === 9) return [4, 3, 2];
  if (count === 10) return [4, 4, 2];
  if (count === 11) return [4, 4, 3];
  if (count === 12) return [4, 4, 4];
  const rows = [];
  let remaining = count;
  while (remaining > 0) {
    rows.push(Math.min(4, remaining));
    remaining -= Math.min(4, remaining);
  }
  return rows;
}
function DetailHeaderInfoGrid({ children, className, ...props }) {
  const childArray = Children.toArray(children);
  const count = childArray.length;
  const rowLayout = getRowLayout(count);
  if (rowLayout.length === 1) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-figma-name": "[TDS] DetailPageHeader/InfoGrid",
        className: twMerge("flex items-stretch gap-3", "w-full", className),
        ...props,
        children
      }
    );
  }
  let index = 0;
  const rows = rowLayout.map((rowCount) => {
    const rowChildren = childArray.slice(index, index + rowCount);
    index += rowCount;
    return rowChildren;
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] DetailPageHeader/InfoGrid",
      className: twMerge("flex flex-col gap-3", "w-full", className),
      ...props,
      children: rows.map((rowChildren, rowIndex) => /* @__PURE__ */ jsx("div", { className: "flex items-stretch gap-3 w-full", children: rowChildren }, rowIndex))
    }
  );
}
function DetailHeaderInfoCard({
  label,
  value,
  copyable = false,
  status,
  tooltip,
  className
}) {
  return /* @__PURE__ */ jsx(
    InfoBox,
    {
      label,
      value,
      tooltip,
      copyable,
      status,
      className: twMerge("flex-1", className)
    }
  );
}
DetailHeader.Title = DetailHeaderTitle;
DetailHeader.Actions = DetailHeaderActions;
DetailHeader.InfoGrid = DetailHeaderInfoGrid;
DetailHeader.InfoCard = DetailHeaderInfoCard;
function SectionCard({ children, isActive = false, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] DetailCard",
      className: twMerge(
        "flex flex-col items-start",
        "gap-4",
        "bg-[var(--color-surface-default)]",
        "rounded-[var(--radius-md)]",
        isActive ? "border-2 border-[var(--color-action-primary)] pt-[14px] pb-[11px] px-[15px]" : "border border-[var(--color-border-default)] pt-4 pb-3 px-4",
        "w-full",
        className
      ),
      ...props,
      children
    }
  );
}
function SectionCardHeader({
  title,
  actions,
  showDivider = true,
  statusIcon,
  description,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: twMerge("flex flex-col w-full", showDivider ? "" : "gap-3"),
      style: showDivider ? { paddingBottom: "12px", borderBottom: "1px solid var(--color-border-subtle)" } : void 0,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: twMerge("flex items-center justify-between w-full h-[28px]", className),
            ...props,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                statusIcon,
                /* @__PURE__ */ jsx("h5", { className: "text-heading-h5 text-[var(--color-text-default)] h-7", children: title })
              ] }),
              actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: actions })
            ]
          }
        ),
        description && /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: description })
      ]
    }
  );
}
function DataRowDivider() {
  return /* @__PURE__ */ jsx("div", { className: "h-px w-full bg-[var(--color-border-subtle)]" });
}
function SectionCardContent({
  children,
  className,
  showDividers = true,
  gap,
  ...props
}) {
  const childArray = Children.toArray(children).filter(isValidElement);
  if (!showDividers) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: twMerge(
          "flex flex-col w-full",
          gap !== void 0 ? `gap-[${gap * 4}px]` : "gap-0",
          className
        ),
        style: gap !== void 0 ? { gap: `${gap * 4}px` } : void 0,
        ...props,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: twMerge("flex flex-col w-full", gap !== void 0 ? "" : "gap-3", className),
      style: gap !== void 0 ? { gap: `${gap * 4}px` } : void 0,
      ...props,
      children: childArray.map((child, index) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
        index > 0 && /* @__PURE__ */ jsx(DataRowDivider, {}),
        child
      ] }, index))
    }
  );
}
function SectionCardDataRow({
  label,
  value,
  children,
  isLink = false,
  linkHref,
  className,
  ...props
}) {
  const renderValue = () => {
    if (children) {
      return /* @__PURE__ */ jsx("div", { className: "text-body-md text-[var(--color-text-default)]", children });
    }
    if (isLink) {
      return /* @__PURE__ */ jsx(
        Link,
        {
          to: linkHref || "#",
          className: "text-label-md text-[var(--color-action-primary)] hover:underline",
          children: value
        }
      );
    }
    return /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: value });
  };
  return /* @__PURE__ */ jsxs("div", { className: twMerge("flex flex-col gap-1.5 w-full", className), ...props, children: [
    /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-subtle)]", children: label }),
    renderValue()
  ] });
}
SectionCard.Header = SectionCardHeader;
SectionCard.Content = SectionCardContent;
SectionCard.DataRow = SectionCardDataRow;
const FormFieldContext = createContext({});
const useFormField = () => useContext(FormFieldContext);
const FormFieldRoot = forwardRef(
  ({
    id: idProp,
    error,
    disabled,
    required,
    children,
    className,
    // Simple API props
    label,
    description,
    helperText,
    errorMessage,
    labelSize = "md",
    spacing: spacing2 = "default",
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = idProp || (label ? generatedId : void 0);
    const contextValue = {
      id,
      error,
      disabled,
      required,
      spacing: spacing2
    };
    if (label !== void 0) {
      return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref,
          className: twMerge("flex flex-col", className),
          "data-figma-name": "[TDS] FormField",
          ...props,
          children: [
            /* @__PURE__ */ jsx(FormFieldLabel, { size: labelSize, children: label }),
            description && /* @__PURE__ */ jsx(FormFieldDescription, { children: description }),
            /* @__PURE__ */ jsx(FormFieldControl, { children: Children.map(children, (child) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  id: child.props.id || id,
                  error: child.props.error ?? error,
                  disabled: child.props.disabled ?? disabled
                });
              }
              return child;
            }) }),
            error && errorMessage ? /* @__PURE__ */ jsx(FormFieldErrorMessage, { children: errorMessage }) : helperText && /* @__PURE__ */ jsx(FormFieldHelperText, { children: helperText })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: twMerge("flex flex-col", className),
        "data-figma-name": "[TDS] FormField",
        ...props,
        children
      }
    ) });
  }
);
FormFieldRoot.displayName = "FormField";
const FormFieldLabel = forwardRef(
  ({ children, required: requiredProp, size = "md", className, ...props }, ref) => {
    const { id, required: contextRequired } = useFormField();
    const isRequired = requiredProp ?? contextRequired;
    const sizeStyles2 = {
      sm: "text-label-sm",
      md: "text-label-lg"
    };
    return /* @__PURE__ */ jsxs(
      "label",
      {
        ref,
        htmlFor: id,
        className: twMerge(
          "font-medium text-[var(--color-text-default)]",
          sizeStyles2[size],
          className
        ),
        ...props,
        children: [
          children,
          isRequired && /* @__PURE__ */ jsx("span", { className: "ml-1 text-[var(--color-state-danger)]", children: "*" })
        ]
      }
    );
  }
);
FormFieldLabel.displayName = "FormField.Label";
const FormFieldControl = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { spacing: spacing2 } = useFormField();
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: twMerge(
          "w-full",
          spacing2 === "loose" ? "mt-[var(--primitive-spacing-3)]" : "mt-[var(--primitive-spacing-2)]",
          className
        ),
        ...props,
        children
      }
    );
  }
);
FormFieldControl.displayName = "FormField.Control";
const FormFieldDescription = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { id } = useFormField();
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        id: id ? `${id}-description` : void 0,
        className: twMerge(
          "text-body-md text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-1)]",
          className
        ),
        ...props,
        children
      }
    );
  }
);
FormFieldDescription.displayName = "FormField.Description";
const FormFieldHelperText = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { id, error } = useFormField();
    if (error) return null;
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        id: id ? `${id}-helper` : void 0,
        className: twMerge(
          "text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-2)]",
          className
        ),
        ...props,
        children
      }
    );
  }
);
FormFieldHelperText.displayName = "FormField.HelperText";
const FormFieldErrorMessage = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { id, error } = useFormField();
    if (!error) return null;
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        id: id ? `${id}-error` : void 0,
        role: "alert",
        className: twMerge(
          "text-body-sm text-[var(--color-state-danger)] mt-[var(--primitive-spacing-2)]",
          className
        ),
        ...props,
        children
      }
    );
  }
);
FormFieldErrorMessage.displayName = "FormField.ErrorMessage";
const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Control: FormFieldControl,
  HelperText: FormFieldHelperText,
  ErrorMessage: FormFieldErrorMessage
});
const positionStyles = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4"
};
function StatusIcon({ status }) {
  switch (status) {
    case "success":
      return /* @__PURE__ */ jsx("div", { className: "size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconCheck$1, { size: 10, stroke: 2, className: "text-[var(--color-text-on-primary)]" }) });
    case "warning":
      return /* @__PURE__ */ jsx("div", { className: "size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconAlertTriangle, { size: 10, stroke: 2, className: "text-[var(--color-text-on-primary)]" }) });
    case "processing":
      return /* @__PURE__ */ jsx("div", { className: "size-4 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconProgress$1, { size: 20, stroke: 1.5, className: "text-[var(--color-text-muted)]" }) });
    default:
      return /* @__PURE__ */ jsx("div", { className: "size-4 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconCircleDashed, { size: 20, stroke: 1.5, className: "text-[var(--color-border-default)]" }) });
  }
}
function FloatingCard({
  title,
  sections = [],
  quota = [],
  instanceCount = 1,
  onInstanceCountChange,
  cancelLabel = "Cancel",
  actionLabel = "Create",
  actionEnabled = false,
  onCancel,
  onAction,
  position = "top-left",
  showCloseButton = false,
  onClose,
  isOpen = true,
  zIndex: zIndex2,
  portal = true,
  width = "320px",
  className,
  style,
  ...props
}) {
  const [expandedSections, setExpandedSections] = useState(() => {
    const initialState = {};
    sections.forEach((section, index) => {
      initialState[index] = section.collapsible ? section.defaultExpanded ?? true : true;
    });
    return initialState;
  });
  useEffect(() => {
    const newState = {};
    sections.forEach((section, index) => {
      newState[index] = section.collapsible ? section.defaultExpanded ?? true : true;
    });
    setExpandedSections(newState);
  }, [sections]);
  if (!isOpen) return null;
  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  const safePosition = position || "top-left";
  const baseStyles = [
    portal ? "fixed" : "relative",
    "z-[var(--z-popover)]",
    "bg-[var(--color-surface-default)]",
    "border border-[var(--color-border-default)]",
    "rounded-[var(--primitive-radius-lg)]",
    "overflow-hidden",
    "flex flex-col",
    "h-fit",
    "max-h-[calc(100vh-2rem)]",
    ...portal ? [positionStyles[safePosition] || positionStyles["top-left"]] : []
  ];
  const cardStyle = {
    ...style,
    width,
    ...zIndex2 && { zIndex: zIndex2 }
  };
  const cardContent = /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] FloatingCard",
      className: twMerge(baseStyles.join(" "), className),
      style: cardStyle,
      ...props,
      children: [
        showCloseButton && onClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "\n            absolute top-2 right-2\n            flex items-center justify-center\n            size-6\n            rounded-md\n            text-[var(--color-text-muted)]\n            hover:bg-[var(--color-surface-subtle)]\n            hover:text-[var(--color-text-default)]\n            transition-colors duration-[var(--duration-fast)]\n            focus:outline-none\n            focus:ring-2\n            focus:ring-[var(--color-border-focus)]\n            z-10\n          ",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(IconX, { size: 12, stroke: 1 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-fit min-h-0 gap-0", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md",
              style: {
                maxHeight: "340px",
                minHeight: "160px",
                padding: "16px",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-subtle)"
              },
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-label-lg text-[var(--color-text-default)] shrink-0", children: title }),
                sections && sections.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6 w-full", children: sections.map((section, sectionIndex) => {
                  const allSuccess = section.items.length > 0 && section.items.every((item) => item.status === "success");
                  const showIcon = section.showSuccessIcon && allSuccess;
                  const isCollapsible = section.collapsible ?? section.items.length > 0;
                  const isExpanded = expandedSections[sectionIndex] ?? section.defaultExpanded ?? true;
                  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
                    isCollapsible ? /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSection(sectionIndex),
                        className: "flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                            isExpanded ? /* @__PURE__ */ jsx(
                              IconChevronDown,
                              {
                                size: 16,
                                stroke: 1,
                                className: "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"
                              }
                            ) : /* @__PURE__ */ jsx(
                              IconChevronRight,
                              {
                                size: 16,
                                stroke: 1,
                                className: "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { className: "text-label-md text-[var(--color-text-default)]", children: section.tabTitle })
                          ] }),
                          showIcon && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-success)]", children: /* @__PURE__ */ jsx(IconTarget, { size: 12, stroke: 1 }) })
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-label-md text-[var(--color-text-default)]", children: section.tabTitle }),
                      showIcon && /* @__PURE__ */ jsx("span", { className: "text-[var(--color-state-success)]", children: /* @__PURE__ */ jsx(IconTarget, { size: 12, stroke: 1 }) })
                    ] }),
                    isCollapsible && isExpanded && section.items.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 pl-4 w-full", children: section.items.map((item) => /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]",
                        onClick: item.onClick,
                        disabled: !item.onClick,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors", children: item.title }),
                          item.status === "writing" ? /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)] shrink-0", children: "Writing..." }) : /* @__PURE__ */ jsx(StatusIcon, { status: item.status })
                        ]
                      },
                      item.id
                    )) })
                  ] }, sectionIndex);
                }) })
              ]
            }
          ),
          quota.length > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              className: "shrink-0 m-4 rounded-md",
              style: {
                padding: "16px",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-default)"
              },
              children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-3 w-full", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-label-md text-[var(--color-text-default)]", children: "Quota" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3 w-full", children: quota.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-full", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: item.label }),
                    /* @__PURE__ */ jsxs("span", { className: "text-body-md text-[var(--color-text-muted)]", children: [
                      item.current,
                      "/",
                      item.total,
                      item.unit ? ` ${item.unit}` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    ProgressBar$1,
                    {
                      value: item.current,
                      max: item.total,
                      variant: "default",
                      showValue: false,
                      className: "h-1"
                    }
                  )
                ] }, index)) })
              ] })
            }
          ),
          onInstanceCountChange && /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]", children: [
            /* @__PURE__ */ jsx("label", { className: "text-label-md text-[var(--color-text-default)]", children: "Number of Instances" }),
            /* @__PURE__ */ jsx(
              NumberInput,
              {
                value: instanceCount,
                onChange: (value) => onInstanceCountChange(value),
                min: 1,
                size: "sm",
                fullWidth: true
              }
            )
          ] }),
          (onCancel || onAction) && /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]", children: [
            onCancel && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "md", onClick: onCancel, className: "flex-[0.3]", children: cancelLabel }),
            onAction && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "primary",
                size: "md",
                onClick: onAction,
                disabled: !actionEnabled,
                className: "flex-[0.7]",
                children: actionLabel
              }
            )
          ] })
        ] })
      ]
    }
  );
  if (portal) {
    if (typeof document !== "undefined" && document.body) {
      return createPortal(cardContent, document.body);
    }
    return cardContent;
  }
  return cardContent;
}
const defaultTimeRangeOptions = [
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
  { label: "6h", value: "6h" },
  { label: "12h", value: "12h" },
  { label: "24h", value: "24h" }
];
const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const formatDateForDisplay = (date) => {
  if (!date) return "";
  const month = MONTH_ABBR[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
const MonitoringToolbar = ({
  timeRangeOptions = defaultTimeRangeOptions,
  timeRange: controlledTimeRange,
  defaultTimeRange = "30m",
  onTimeRangeChange,
  customPeriod: controlledCustomPeriod,
  defaultCustomPeriod = null,
  onCustomPeriodChange,
  onRefresh,
  showRefresh = true,
  maxDate = /* @__PURE__ */ new Date(),
  minDate,
  className = ""
}) => {
  const isTimeRangeControlled = controlledTimeRange !== void 0;
  const isCustomPeriodControlled = controlledCustomPeriod !== void 0;
  const [internalTimeRange, setInternalTimeRange] = useState(defaultTimeRange);
  const [internalCustomPeriod, setInternalCustomPeriod] = useState(
    defaultCustomPeriod
  );
  const timeRange = isTimeRangeControlled ? controlledTimeRange : internalTimeRange;
  const customPeriod = isCustomPeriodControlled ? controlledCustomPeriod : internalCustomPeriod;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const datePickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        const el = target instanceof Element ? target : target.parentElement;
        if (el == null ? void 0 : el.closest('[role="listbox"]')) return;
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);
  const handleTimeRangeClick = (value) => {
    if (!isTimeRangeControlled) {
      setInternalTimeRange(value);
    }
    if (!isCustomPeriodControlled) {
      setInternalCustomPeriod(null);
    }
    onTimeRangeChange == null ? void 0 : onTimeRangeChange(value);
    onCustomPeriodChange == null ? void 0 : onCustomPeriodChange(null);
  };
  const handleCustomPeriodClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
    } else {
      const now = /* @__PURE__ */ new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      setTempStartDate(oneWeekAgo);
      setTempEndDate(now);
    }
    setShowDatePicker(true);
  };
  const handlePeriodTextClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
    }
    setShowDatePicker(true);
  };
  const hasCustomPeriod = customPeriod !== null;
  return /* @__PURE__ */ jsxs("div", { "data-figma-name": "[TDS] MonitoringToolbar", className: `monitoring-toolbar ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "monitoring-toolbar-segments", children: timeRangeOptions.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: `monitoring-toolbar-segment ${timeRange === option.value && !hasCustomPeriod ? "monitoring-toolbar-segment-active" : ""}`,
        onClick: () => handleTimeRangeClick(option.value),
        children: option.label
      },
      option.value
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "monitoring-toolbar-period", ref: datePickerRef, children: [
      hasCustomPeriod ? /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border border-[var(--color-border-focus)] rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors",
          onClick: handlePeriodTextClick,
          children: [
            /* @__PURE__ */ jsx(
              IconCalendar,
              {
                size: 14,
                stroke: 1.5,
                className: "shrink-0 text-[var(--color-text-subtle)]"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--color-text-default)] whitespace-nowrap font-medium", children: [
              formatDateForDisplay(customPeriod.start),
              /* @__PURE__ */ jsx("span", { className: "mx-0.5 text-[var(--color-text-subtle)]", children: "—" }),
              formatDateForDisplay(customPeriod.end)
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors ${showDatePicker ? "border-[var(--color-border-focus)]" : "border-[var(--color-border-strong)] hover:border-[var(--color-border-focus)]"}`,
          onClick: handleCustomPeriodClick,
          children: [
            /* @__PURE__ */ jsx(
              IconCalendar,
              {
                size: 14,
                stroke: 1.5,
                className: "shrink-0 text-[var(--color-text-subtle)]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--color-text-subtle)] font-medium", children: "Select period" })
          ]
        }
      ),
      showDatePicker && /* @__PURE__ */ jsx("div", { className: "monitoring-toolbar-dropdown", children: /* @__PURE__ */ jsx(
        DateRangePicker,
        {
          value: { start: tempStartDate, end: tempEndDate },
          onApply: (range2) => {
            const newPeriod = { start: range2.start, end: range2.end };
            if (!isCustomPeriodControlled) {
              setInternalCustomPeriod(newPeriod);
            }
            if (!isTimeRangeControlled) {
              setInternalTimeRange("custom");
            }
            onCustomPeriodChange == null ? void 0 : onCustomPeriodChange(newPeriod);
            onTimeRangeChange == null ? void 0 : onTimeRangeChange("custom");
            setShowDatePicker(false);
          },
          onCancel: () => setShowDatePicker(false),
          minDate,
          maxDate,
          className: "!border-0 !shadow-none"
        }
      ) })
    ] }),
    showRefresh && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "monitoring-toolbar-refresh",
        onClick: onRefresh,
        "aria-label": "Refresh",
        children: /* @__PURE__ */ jsx(IconRefresh$1, { size: 12, stroke: 1.5 })
      }
    )
  ] });
};
const NotificationCenter = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  selectedId,
  onClose,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "error") return notification.type === "error";
    return true;
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const errorCount = notifications.filter((n) => n.type === "error").length;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] NotificationCenter",
      className: `
        w-[360px]
        bg-[var(--color-surface-default)]
        rounded-lg
        border border-[var(--color-border-default)]
        shadow-lg
        overflow-hidden
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative pt-3 pb-0", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onMarkAllAsRead,
              className: "\n            absolute right-4 top-1/2 -translate-y-1/2 z-20\n            flex items-center justify-center\n            size-7\n            rounded-md\n            text-[var(--color-text-muted)]\n            hover:bg-[var(--color-surface-subtle)]\n            hover:text-[var(--color-text-default)]\n            transition-colors\n            group\n          ",
              "aria-label": "Mark all as read",
              children: [
                /* @__PURE__ */ jsx(IconCheckbox, { size: 16, stroke: 1.5 }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "\n            absolute top-full right-0 mt-1\n            px-2 py-1\n            bg-[var(--color-text-default)]\n            text-[var(--color-surface-default)]\n            text-body-sm\n            rounded\n            whitespace-nowrap\n            opacity-0\n            group-hover:opacity-100\n            transition-opacity\n            pointer-events-none\n            z-10\n          ",
                    children: "Mark all as read"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Tabs,
            {
              value: activeTab,
              onChange: setActiveTab,
              variant: "underline",
              size: "sm",
              className: "w-full",
              children: /* @__PURE__ */ jsxs(TabList, { className: "w-full px-4", children: [
                /* @__PURE__ */ jsx(Tab, { value: "all", children: "All" }),
                /* @__PURE__ */ jsxs(Tab, { value: "unread", children: [
                  "Unread",
                  unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-[var(--color-text-muted)]", children: [
                    "(",
                    unreadCount,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Tab, { value: "error", children: [
                  "Error",
                  errorCount > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-[var(--color-text-muted)]", children: [
                    "(",
                    errorCount,
                    ")"
                  ] })
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[400px] overflow-y-auto p-2 drawer-scroll", children: filteredNotifications.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md", children: "No notifications" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: filteredNotifications.map((notification) => /* @__PURE__ */ jsx(
          NotificationCard,
          {
            notification,
            isSelected: notification.id === selectedId,
            onMarkAsRead,
            onClick: onNotificationClick
          },
          notification.id
        )) }) })
      ]
    }
  );
};
const NotificationCard = ({
  notification,
  isSelected,
  onMarkAsRead,
  onClick
}) => {
  var _a, _b;
  const [isExpanded, setIsExpanded] = useState(false);
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return /* @__PURE__ */ jsx(IconCircleCheck, { size: 16, stroke: 1.5, className: "text-[var(--color-state-success)]" });
      case "error":
        return /* @__PURE__ */ jsx(IconAlertTriangle, { size: 16, stroke: 1.5, className: "text-[var(--color-state-danger)]" });
      case "warning":
        return /* @__PURE__ */ jsx(IconAlertCircle, { size: 16, stroke: 1.5, className: "text-[var(--color-state-warning)]" });
      case "info":
      default:
        return /* @__PURE__ */ jsx(IconInfoCircle, { size: 16, stroke: 1.5, className: "text-[var(--color-state-info)]" });
    }
  };
  const hasDetail = notification.detail && (notification.detail.code || notification.detail.message);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] NotificationItem",
      className: `
        relative
        rounded-lg
        border
        transition-all
        border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]
        ${!notification.isRead ? "bg-[var(--color-surface-subtle)]" : "bg-[var(--color-surface-default)]"}
      `,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => {
              if (!notification.isRead) {
                onMarkAsRead == null ? void 0 : onMarkAsRead(notification.id);
              }
              onClick == null ? void 0 : onClick(notification);
            },
            className: "flex gap-3 p-3 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx("div", { className: "shrink-0 pt-0.5", children: getIcon(notification.type) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-body-md text-[var(--color-text-default)] mb-2 pr-6", children: notification.message }),
                notification.project && /* @__PURE__ */ jsx(Chip, { value: notification.project, variant: "default" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "size-6 flex items-center justify-center", children: !notification.isRead && /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-[var(--color-action-primary)]" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-muted)]", children: notification.time })
              ] })
            ]
          }
        ),
        hasDetail && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              },
              className: "\n              flex items-center justify-end gap-1\n              w-full px-3 py-2\n              text-body-sm\n              text-[var(--color-text-muted)]\n              hover:text-[var(--color-text-default)]\n              border-t border-[var(--color-border-subtle)]\n              transition-colors\n            ",
              children: [
                /* @__PURE__ */ jsx("span", { children: "View detail" }),
                isExpanded ? /* @__PURE__ */ jsx(IconChevronUp, { size: 14, stroke: 1.5 }) : /* @__PURE__ */ jsx(IconChevronDown, { size: 14, stroke: 1.5 })
              ]
            }
          ),
          isExpanded && /* @__PURE__ */ jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[var(--color-surface-subtle)] rounded-md", children: [
            ((_a = notification.detail) == null ? void 0 : _a.code) && /* @__PURE__ */ jsxs("p", { className: "text-label-md text-[var(--color-text-default)] mb-1", children: [
              "code: ",
              notification.detail.code
            ] }),
            ((_b = notification.detail) == null ? void 0 : _b.message) && /* @__PURE__ */ jsx("p", { className: "text-body-md text-[var(--color-text-muted)]", children: notification.detail.message })
          ] }) })
        ] })
      ]
    }
  );
};
const spinnerSizes = {
  sm: { icon: 16, text: "text-body-sm leading-4", gap: "gap-1.5" },
  md: { icon: 22, text: "text-body-md leading-4", gap: "gap-2" },
  lg: { icon: 32, text: "text-body-lg leading-5", gap: "gap-3" }
};
const Loading = ({
  variant = "spinner",
  size = "md",
  text = "Loading",
  description,
  progress = 0,
  statusText,
  buttonLabel = "Loading",
  className = ""
}) => {
  const sizeConfig = spinnerSizes[size];
  if (variant === "spinner") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-figma-name": "[TDS] LoadingSpinner",
        className: twMerge("flex flex-col items-center", sizeConfig.gap, className),
        children: [
          /* @__PURE__ */ jsx(
            IconLoader2,
            {
              size: sizeConfig.icon,
              stroke: 1.5,
              className: "text-[var(--color-action-primary)] animate-spin"
            }
          ),
          text && /* @__PURE__ */ jsx(
            "p",
            {
              className: twMerge(
                "font-normal text-[var(--color-text-subtle)] text-center",
                sizeConfig.text
              ),
              children: text
            }
          )
        ]
      }
    );
  }
  if (variant === "progress") {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-figma-name": "[TDS] LoadingSpinner",
        className: twMerge("flex flex-col items-center gap-3", className),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 text-[var(--color-text-default)]", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-body-lg leading-5", children: text }),
            description && /* @__PURE__ */ jsx("p", { className: "font-normal text-body-md leading-4 text-center", children: description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 w-[300px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full h-1", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[var(--color-border-subtle)] rounded-lg" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-y-0 left-0 bg-[var(--color-state-info)] rounded-lg transition-all duration-300",
                  style: { width: `${clampedProgress}%` }
                }
              )
            ] }),
            statusText && /* @__PURE__ */ jsx("p", { className: "font-normal text-body-md leading-4 text-[var(--color-text-subtle)] text-center", children: statusText })
          ] })
        ]
      }
    );
  }
  if (variant === "button") {
    return /* @__PURE__ */ jsx("div", { "data-figma-name": "[TDS] LoadingSpinner", className: twMerge("inline-flex", className), children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: true,
        className: twMerge(
          "flex items-center justify-center gap-1.5",
          "min-w-[80px] px-3 py-2",
          "bg-[var(--color-border-strong)] rounded-[var(--primitive-radius-md)]",
          "cursor-not-allowed"
        ),
        children: [
          /* @__PURE__ */ jsx(
            IconLoader2,
            {
              size: 12,
              stroke: 2,
              className: "text-[var(--color-text-on-primary)] animate-spin"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-body-md leading-4 text-[var(--color-text-on-primary)] text-center", children: buttonLabel })
        ]
      }
    ) });
  }
  return null;
};
function SNBMenuItem({
  status: propStatus,
  type = "icon",
  icon,
  text,
  iconSize = 22,
  onClick,
  className = "",
  isSelected = false,
  children
}) {
  const [isHovered, setIsHovered] = useState(false);
  const status = propStatus || (isSelected ? "selected" : isHovered ? "hover" : "default");
  const bgStyles = {
    default: "bg-[var(--color-surface-default)]",
    hover: "bg-[var(--color-surface-subtle)]",
    selected: "bg-[var(--color-info-weak-bg)]"
  };
  const iconColorStyles = {
    default: "text-[var(--color-text-muted)]",
    hover: "text-[var(--color-text-default)]",
    selected: "text-[var(--color-action-primary)]"
  };
  const textColorStyles = {
    default: "text-[var(--color-text-muted)]",
    hover: "text-[var(--color-text-default)]",
    selected: "text-[var(--color-action-primary)]"
  };
  const baseClass = `
    flex flex-col gap-0.5 items-center justify-center
    px-2 py-1.5
    rounded-lg
    size-[38px]
    transition-colors
    cursor-pointer
  `;
  const renderIcon = () => {
    if (children) {
      return React3__default.Children.map(children, (child) => {
        if (React3__default.isValidElement(child)) {
          return React3__default.cloneElement(child, {
            className: `${child.props.className || ""} ${iconColorStyles[status]}`.trim()
          });
        }
        return child;
      });
    }
    if (icon) {
      if (React3__default.isValidElement(icon)) {
        return React3__default.cloneElement(icon, {
          className: `${icon.props.className || ""} ${iconColorStyles[status]}`.trim()
        });
      }
      return icon;
    }
    return null;
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: `${baseClass} ${bgStyles[status]} ${className}`,
      onClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        type === "icon" && renderIcon(),
        type === "text" && /* @__PURE__ */ jsx("span", { className: `text-heading-h4 ${textColorStyles[status]}`, children: text })
      ]
    }
  );
}
const STATUS_COLOR_MAP = {
  success: "active",
  warning: "pending",
  error: "error",
  info: "building",
  muted: "disabled"
};
const BADGE_VARIANT_MAP = {
  default: "default",
  success: "success",
  info: "info",
  warning: "warning",
  muted: "default"
};
function CardTitle({
  title,
  description,
  showStatus = false,
  statusColor = "success",
  badges,
  side = "none",
  gaugeValue,
  gaugeLabel,
  sideIcon,
  className = "",
  onClick
}) {
  const hasBadges = badges && badges.length > 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] CardTitle",
      className: `flex items-start gap-3 ${className} ${onClick ? "cursor-pointer" : ""}`,
      onClick,
      children: [
        showStatus && /* @__PURE__ */ jsx(
          StatusIndicator,
          {
            status: STATUS_COLOR_MAP[statusColor] || "active",
            layout: "icon-only",
            size: "lg",
            className: "shrink-0"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-heading-h5 leading-6 text-[var(--color-text-default)] truncate", children: title }),
            description && /* @__PURE__ */ jsx("p", { className: "text-body-md leading-4 text-[var(--color-text-muted)] line-clamp-2", children: description })
          ] }),
          hasBadges && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: badges.map((badge2, index) => /* @__PURE__ */ jsx(
            Badge,
            {
              variant: BADGE_VARIANT_MAP[badge2.variant || "muted"],
              size: "sm",
              leftIcon: badge2.icon,
              children: badge2.label
            },
            index
          )) })
        ] }),
        side === "gauge" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: "text-heading-h5 leading-6 text-[var(--color-text-default)]", children: gaugeValue }),
          /* @__PURE__ */ jsx("span", { className: "text-body-md leading-4 text-[var(--color-text-subtle)]", children: gaugeLabel })
        ] }),
        side === "icon" && sideIcon && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end shrink-0", children: sideIcon })
      ]
    }
  );
}
function WizardSectionStatusIcon({ status }) {
  if (status === "done") {
    return /* @__PURE__ */ jsx("div", { className: "w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center", children: /* @__PURE__ */ jsx(IconCheck$1, { size: 10, stroke: 2.5, className: "text-[var(--color-text-on-primary)]" }) });
  }
  if (status === "active" || status === "writing") {
    return /* @__PURE__ */ jsx("div", { className: "w-4 h-4 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconProgress$1, { size: 20, stroke: 1.5, className: "text-[var(--color-text-muted)]" }) });
  }
  if (status === "skipped") {
    return /* @__PURE__ */ jsx("div", { className: "w-4 h-4 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconMinus, { size: 12, stroke: 1.5, className: "text-[var(--color-text-subtle)]" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-4 h-4 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconCircleDashed, { size: 20, stroke: 1.5, className: "text-[var(--color-border-default)]" }) });
}
function PreSection({ title }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Stepper",
      className: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",
      children: /* @__PURE__ */ jsx("div", { className: "h-[28px] flex items-center", children: /* @__PURE__ */ jsx("h5", { className: "text-heading-h5 text-[var(--color-text-default)]", children: title }) })
    }
  );
}
function WritingSection({ title, onEdit }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Stepper",
      className: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",
      children: /* @__PURE__ */ jsxs("div", { className: "h-[28px] flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
        onEdit ? /* @__PURE__ */ jsxs(HStack, { gap: 3, align: "center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-subtle)]", children: "Writing..." }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              leftIcon: /* @__PURE__ */ jsx(IconEdit$1, { size: 12 }),
              onClick: onEdit,
              children: "Edit"
            }
          )
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-subtle)]", children: "Writing..." })
      ] })
    }
  );
}
function SkippedSection({ title, onEdit }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Stepper",
      className: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-[28px]", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-muted)]", children: "Not configured" }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", leftIcon: /* @__PURE__ */ jsx(IconEdit$1, { size: 12 }), onClick: onEdit, children: "Edit" })
        ] })
      ] })
    }
  );
}
function DoneSectionRow({ label, value }) {
  return /* @__PURE__ */ jsxs(VStack, { gap: 0, children: [
    /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-[var(--color-border-subtle)]" }),
    /* @__PURE__ */ jsxs(VStack, { gap: 1.5, className: "pt-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-subtle)]", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: value || "-" })
    ] })
  ] });
}
function DoneSection({ title, onEdit, children }) {
  return /* @__PURE__ */ jsxs(SectionCard, { children: [
    /* @__PURE__ */ jsx(
      SectionCard.Header,
      {
        title,
        showDivider: false,
        actions: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", leftIcon: /* @__PURE__ */ jsx(IconEdit$1, { size: 12 }), onClick: onEdit, children: "Edit" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col w-full gap-3", children })
  ] });
}
function WizardSection({
  title,
  status,
  onEdit,
  summaryContent,
  children
}) {
  switch (status) {
    case "pre":
      return /* @__PURE__ */ jsx(PreSection, { title });
    case "writing":
      return /* @__PURE__ */ jsx(WritingSection, { title });
    case "skipped":
      return /* @__PURE__ */ jsx(SkippedSection, { title, onEdit: onEdit || (() => {
      }) });
    case "done":
      return /* @__PURE__ */ jsx(DoneSection, { title, onEdit: onEdit || (() => {
      }), children: summaryContent });
    case "active":
    default:
      return /* @__PURE__ */ jsx(Fragment, { children });
  }
}
function WizardSummary({ title = "Summary", items, onItemClick }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] Stepper.Summary",
      className: "bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4",
      children: /* @__PURE__ */ jsxs(VStack, { gap: 3, children: [
        /* @__PURE__ */ jsx("span", { className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
        /* @__PURE__ */ jsx(VStack, { gap: 0, children: items.map((item) => /* @__PURE__ */ jsxs(
          HStack,
          {
            justify: "between",
            align: "center",
            className: `py-1.5 ${onItemClick ? "cursor-pointer hover:bg-[var(--color-surface-muted)] rounded px-1 -mx-1" : ""}`,
            onClick: () => onItemClick == null ? void 0 : onItemClick(item.key),
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: item.label }),
              /* @__PURE__ */ jsx("div", { className: "w-16 flex justify-end items-center", children: item.status === "writing" ? /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: "Writing..." }) : /* @__PURE__ */ jsx(WizardSectionStatusIcon, { status: item.status }) })
            ]
          },
          item.key
        )) })
      ] })
    }
  );
}
function PageShell({
  sidebar,
  sidebarWidth,
  tabBar,
  topBar,
  bottomPanel,
  children,
  contentClassName = "pt-4 px-8 pb-20",
  bottomPanelPadding,
  className = ""
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] AppLayout",
      className: `fixed inset-0 bg-[var(--color-surface-subtle)] ${className}`.trim(),
      children: [
        sidebar,
        /* @__PURE__ */ jsxs(
          "main",
          {
            className: "absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200",
            style: { left: `${sidebarWidth}px` },
            children: [
              tabBar,
              topBar,
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll",
                  style: {
                    paddingBottom: bottomPanelPadding || "0"
                  },
                  children: /* @__PURE__ */ jsx("div", { className: `bg-[var(--color-surface-default)] ${contentClassName}`.trim(), children })
                }
              )
            ]
          }
        ),
        bottomPanel
      ]
    }
  );
}
function PageHeader({
  title,
  titleExtra,
  actions,
  className = "",
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] Title",
      className: `flex items-center justify-between w-full min-h-8 ${className}`.trim(),
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[8px]", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-heading-h5 leading-6 text-[var(--color-text-default)]", children: title }),
          titleExtra
        ] }),
        actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[8px]", children: actions })
      ]
    }
  );
}
function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "card",
  className = ""
}) {
  const variantClasses = variant === "card" ? "bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-subtle)] p-16" : "py-20";
  return /* @__PURE__ */ jsx("div", { "data-figma-name": "[TDS] EmptyUI", className: `${variantClasses} ${className}`.trim(), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-[16px]", children: [
    icon && /* @__PURE__ */ jsx("div", { className: "text-[var(--color-text-disabled)]", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-[8px] text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-heading-h5 text-[var(--color-text-default)]", children: title }),
      description && /* @__PURE__ */ jsx("span", { className: "text-body-lg text-[var(--color-text-subtle)] max-w-md", children: description })
    ] }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-[8px]", children: action })
  ] }) });
}
function ErrorState({
  icon,
  title = "Something went wrong",
  description,
  action,
  className = ""
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-figma-name": "[TDS] ErrorState",
      className: `flex flex-col items-center justify-center py-20 text-center ${className}`.trim(),
      children: [
        icon && /* @__PURE__ */ jsx("div", { className: "text-[var(--color-state-danger)] mb-[16px]", children: icon }),
        /* @__PURE__ */ jsx("span", { className: "text-heading-h5 text-[var(--color-text-default)] mb-[8px]", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-body-md text-[var(--color-text-muted)] max-w-md mb-[16px]", children: description }),
        action && /* @__PURE__ */ jsx("div", { children: action })
      ]
    }
  );
}
function TagDivider() {
  return /* @__PURE__ */ jsx("div", { className: "w-px h-[10px] bg-[var(--color-border-default)]" });
}
function FileListCard({
  files,
  onRemove,
  emptyMessage = "No files",
  className = ""
}) {
  if (files.length === 0) {
    return emptyMessage ? /* @__PURE__ */ jsx("p", { className: "text-body-sm text-[var(--color-text-subtle)]", children: emptyMessage }) : null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-figma-name": "[TDS] FileListCard",
      className: `bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)] ${className}`,
      children: files.map((file) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2 flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxs(VStack, { gap: 1, children: [
              /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)]", children: file.name }),
              file.tags && file.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: file.tags.map((tag, i) => /* @__PURE__ */ jsxs("span", { className: "contents", children: [
                i > 0 && /* @__PURE__ */ jsx(TagDivider, {}),
                /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: tag })
              ] }, tag)) }),
              !file.tags && file.description && /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: file.description })
            ] }),
            onRemove && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onRemove(file.id),
                className: "shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors",
                children: /* @__PURE__ */ jsx(IconX, { size: 16, stroke: 1.5 })
              }
            )
          ]
        },
        file.id
      ))
    }
  );
}
function FileListSection({
  label = "Upload Files",
  required,
  files,
  onRemove,
  onUpload,
  uploadLabel = "Choose file",
  uploadIcon,
  error,
  emptyMessage,
  className = ""
}) {
  return /* @__PURE__ */ jsxs(VStack, { gap: 3, className: `w-full ${className}`, "data-figma-name": "[TDS] FileListSection", children: [
    label && /* @__PURE__ */ jsxs("label", { className: "text-label-lg text-[var(--color-text-default)]", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "ml-1 text-[var(--color-state-danger)]", children: "*" })
    ] }),
    onUpload && /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "sm",
        onClick: onUpload,
        className: "w-fit",
        leftIcon: uploadIcon,
        children: uploadLabel
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-state-danger)]", children: error }),
    /* @__PURE__ */ jsx(FileListCard, { files, onRemove, emptyMessage })
  ] });
}
const ExpandableChecklist = memo(function ExpandableChecklist2({
  label,
  description,
  badge: badge2,
  items,
  onChange,
  defaultExpanded = false,
  className = ""
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const allChecked = items.length > 0 && items.every((item) => item.checked);
  const someChecked = items.some((item) => item.checked) && !allChecked;
  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);
  const handleHeaderCheck = useCallback(
    (e) => {
      const updated = items.map((item) => ({ ...item, checked: e.target.checked }));
      onChange == null ? void 0 : onChange(updated);
    },
    [items, onChange]
  );
  const handleItemCheck = useCallback(
    (id, e) => {
      const updated = items.map(
        (item) => item.id === id ? { ...item, checked: e.target.checked } : item
      );
      onChange == null ? void 0 : onChange(updated);
    },
    [items, onChange]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] ${className}`,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `flex items-center bg-[var(--color-surface-default)]${expanded ? " border-b border-[var(--color-border-default)]" : ""}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-0.5 px-3 py-2 min-h-[40px] justify-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleToggleExpand,
                    className: "flex items-center justify-center shrink-0 size-3 text-[var(--color-text-muted)]",
                    "aria-expanded": expanded,
                    children: /* @__PURE__ */ jsx(
                      IconChevronRight,
                      {
                        size: 12,
                        stroke: 1.5,
                        className: `transition-transform duration-[var(--duration-fast)] ${expanded ? "rotate-90" : ""}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      label,
                      checked: allChecked,
                      indeterminate: someChecked,
                      onChange: handleHeaderCheck
                    }
                  ),
                  badge2 && /* @__PURE__ */ jsx(Badge, { size: "sm", theme: badge2.theme ?? "green", type: badge2.type ?? "subtle", children: badge2.text })
                ] })
              ] }),
              description && /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "shrink-0 w-[18px]" }),
                /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-muted)]", children: description })
              ] })
            ] })
          }
        ),
        expanded && /* @__PURE__ */ jsx("div", { children: items.map((item) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-1 border-b border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-7 py-2 last:border-b-0",
            children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  label: item.label,
                  checked: item.checked ?? false,
                  onChange: (e) => handleItemCheck(item.id, e)
                }
              ),
              item.badge && /* @__PURE__ */ jsx(
                Badge,
                {
                  size: "sm",
                  theme: item.badge.theme ?? "green",
                  type: item.badge.type ?? "subtle",
                  children: item.badge.text
                }
              )
            ]
          },
          item.id
        )) })
      ]
    }
  );
});
function CardRoot({ children, className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] flex flex-col gap-3 px-4 py-3 ${className}`,
      children
    }
  );
}
function DetailsBox({ children, className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `bg-[var(--card-details-bg)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] flex flex-col gap-5 p-2 ${className}`,
      children
    }
  );
}
function DetailRow({ items, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `flex gap-4 items-center w-full ${className}`, children: items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-label-sm text-[var(--color-text-muted)]", children: item.label }),
    /* @__PURE__ */ jsx("span", { className: "text-body-md text-[var(--color-text-default)] truncate", children: item.value })
  ] }, idx)) });
}
function ProgressBar({ label, value, className = "" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-2.5 pt-0.5 pb-1 w-full ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx("span", { className: "text-body-sm text-[var(--color-text-subtle)]", children: label }),
      /* @__PURE__ */ jsxs("span", { className: "text-body-md text-[var(--color-text-default)]", children: [
        clamped,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start h-1 w-full pr-1", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-[var(--color-action-primary)] h-1 rounded-lg -mr-1 z-[2]",
          style: { width: `${clamped}%` }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-[var(--color-border-strong)] flex-1 min-w-0 h-1 rounded-lg -mr-1 z-[1]" })
    ] })
  ] });
}
function Footer({ metadata, actions, className = "" }) {
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-3 w-full ${className}`, children: [
    metadata && metadata.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-wrap", children: metadata.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      idx > 0 && /* @__PURE__ */ jsx("div", { className: "w-0 h-2.5 border-l border-[var(--color-border-default)]" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-label-sm text-[var(--color-text-muted)]", children: [
        /* @__PURE__ */ jsx("span", { children: item.label }),
        /* @__PURE__ */ jsx("span", { children: item.value })
      ] })
    ] }, idx)) }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 justify-end w-full", children: actions })
  ] });
}
const ResourceCard = Object.assign(CardRoot, {
  DetailsBox,
  DetailRow,
  ProgressBar,
  Footer
});
function YamlEditor({
  value,
  onChange,
  readOnly = false,
  className,
  trailingActions
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef(null);
  const lineCount = value.split("\n").length;
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value]);
  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);
  const hasTrailing = Boolean(trailingActions);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: twMerge(
        "flex-1 flex min-h-0 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] bg-[var(--color-surface-default)] overflow-hidden relative",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: lineNumbersRef,
            className: "w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            children: /* @__PURE__ */ jsx("div", { className: "font-mono text-body-md leading-[18px] text-[var(--color-text-subtle)]", children: Array.from({ length: lineCount }, (_, i) => /* @__PURE__ */ jsx("div", { children: i + 1 }, i + 1)) })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 overflow-hidden", children: /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: textareaRef,
            value,
            onChange: (e) => onChange(e.target.value),
            onScroll: handleScroll,
            readOnly,
            className: twMerge(
              "w-full h-full py-2 px-2.5 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto yaml-editor-scroll",
              hasTrailing ? "pr-20" : "pr-12"
            ),
            spellCheck: false,
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleCopy,
              className: "flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors",
              title: "Copy to clipboard",
              "aria-label": copied ? "Copied" : "Copy to clipboard",
              children: copied ? /* @__PURE__ */ jsx(IconCheck$1, { size: 12, stroke: 1.5 }) : /* @__PURE__ */ jsx(IconCopy$1, { size: 12, stroke: 1.5 })
            }
          ),
          trailingActions
        ] })
      ]
    }
  );
}
const primitive = {
  color: {
    white: "var(--color-white)",
    black: "var(--color-black)",
    slate: {
      50: "var(--color-slate-50)",
      100: "var(--color-slate-100)",
      200: "var(--color-slate-200)",
      300: "var(--color-slate-300)",
      400: "var(--color-slate-400)",
      500: "var(--color-slate-500)",
      600: "var(--color-slate-600)",
      700: "var(--color-slate-700)",
      800: "var(--color-slate-800)",
      900: "var(--color-slate-900)"
    },
    blue: {
      50: "var(--color-blue-50)",
      100: "var(--color-blue-100)",
      200: "var(--color-blue-200)",
      300: "var(--color-blue-300)",
      400: "var(--color-blue-400)",
      500: "var(--color-blue-500)",
      600: "var(--color-blue-600)",
      700: "var(--color-blue-700)",
      800: "var(--color-blue-800)",
      900: "var(--color-blue-900)"
    },
    red: {
      50: "var(--color-red-50)",
      100: "var(--color-red-100)",
      500: "var(--color-red-500)",
      600: "var(--color-red-600)",
      700: "var(--color-red-700)",
      800: "var(--color-red-800)"
    },
    green: {
      50: "var(--color-green-50)",
      100: "var(--color-green-100)",
      500: "var(--color-green-500)",
      600: "var(--color-green-600)",
      700: "var(--color-green-700)",
      800: "var(--color-green-800)"
    },
    orange: {
      50: "var(--color-orange-50)",
      100: "var(--color-orange-100)",
      500: "var(--color-orange-500)",
      600: "var(--color-orange-600)",
      700: "var(--color-orange-700)",
      800: "var(--color-orange-800)"
    },
    yellow: {
      50: "var(--color-yellow-50)",
      100: "var(--color-yellow-100)"
    }
  },
  spacing: {
    0: "var(--spacing-0)",
    "0-5": "var(--spacing-0-5)",
    1: "var(--spacing-1)",
    "1-5": "var(--spacing-1-5)",
    2: "var(--spacing-2)",
    "2-5": "var(--spacing-2-5)",
    3: "var(--spacing-3)",
    4: "var(--spacing-4)",
    5: "var(--spacing-5)",
    6: "var(--spacing-6)",
    7: "var(--spacing-7)",
    8: "var(--spacing-8)",
    9: "var(--spacing-9)",
    10: "var(--spacing-10)",
    12: "var(--spacing-12)",
    14: "var(--spacing-14)",
    16: "var(--spacing-16)",
    20: "var(--spacing-20)",
    24: "var(--spacing-24)",
    32: "var(--spacing-32)"
  },
  fontSize: {
    10: "var(--font-size-10)",
    // xs - Caption
    11: "var(--font-size-11)",
    // sm - Small labels
    12: "var(--font-size-12)",
    // base - Default body
    14: "var(--font-size-14)",
    // md - Large body
    16: "var(--font-size-16)",
    // lg - Small heading
    18: "var(--font-size-18)",
    // xl - Heading
    24: "var(--font-size-24)",
    // 2xl - Large heading
    32: "var(--font-size-32)",
    // 3xl - Display
    40: "var(--font-size-40)"
    // 4xl - Hero
  },
  lineHeight: {
    14: "var(--line-height-14)",
    16: "var(--line-height-16)",
    18: "var(--line-height-18)",
    20: "var(--line-height-20)",
    24: "var(--line-height-24)",
    28: "var(--line-height-28)",
    32: "var(--line-height-32)",
    40: "var(--line-height-40)",
    48: "var(--line-height-48)"
  },
  fontWeight: {
    regular: "var(--font-weight-regular)",
    // 400
    medium: "var(--font-weight-medium)",
    // 500
    semibold: "var(--font-weight-semibold)"
    // 600
  },
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)"
  },
  radius: {
    none: "var(--radius-none)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    full: "var(--radius-full)"
  },
  duration: {
    fast: "var(--duration-fast)",
    // 150ms
    normal: "var(--duration-normal)",
    // 200ms
    slow: "var(--duration-slow)"
    // 300ms
  },
  shadow: {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)"
  },
  zIndex: {
    dropdown: 1e3,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    toast: 1500,
    contextMenu: 5e3
  }
};
const semantic = {
  color: {
    action: {
      primary: "var(--color-action-primary)",
      primaryHover: "var(--color-action-primary-hover)",
      primaryActive: "var(--color-action-primary-active)"
    },
    text: {
      default: "var(--color-text-default)",
      muted: "var(--color-text-muted)",
      subtle: "var(--color-text-subtle)",
      disabled: "var(--color-text-disabled)",
      inverse: "var(--color-text-inverse)",
      onPrimary: "var(--color-text-on-primary)"
    },
    surface: {
      default: "var(--color-surface-default)",
      subtle: "var(--color-surface-subtle)",
      muted: "var(--color-surface-muted)",
      inverse: "var(--color-surface-inverse)"
    },
    border: {
      default: "var(--color-border-default)",
      subtle: "var(--color-border-subtle)",
      strong: "var(--color-border-strong)",
      focus: "var(--color-border-focus)"
    },
    state: {
      info: {
        default: "var(--color-state-info)",
        bg: "var(--color-state-info-bg)",
        text: "var(--color-state-info-text)"
      },
      success: {
        default: "var(--color-state-success)",
        bg: "var(--color-state-success-bg)",
        text: "var(--color-state-success-text)"
      },
      warning: {
        default: "var(--color-state-warning)",
        bg: "var(--color-state-warning-bg)",
        text: "var(--color-state-warning-text)"
      },
      danger: {
        default: "var(--color-state-danger)",
        bg: "var(--color-state-danger-bg)",
        text: "var(--color-state-danger-text)"
      }
    }
  },
  radius: {
    field: "var(--radius-field)",
    button: "var(--radius-button)",
    card: "var(--radius-card)",
    modal: "var(--radius-modal)",
    pill: "var(--radius-pill)"
  },
  spacing: {
    component: {
      "3xs": "var(--spacing-component-3xs)",
      // 2px
      "2xs": "var(--spacing-component-2xs)",
      // 4px
      xs: "var(--spacing-component-xs)",
      // 6px
      sm: "var(--spacing-component-sm)",
      // 8px
      md: "var(--spacing-component-md)",
      // 12px
      lg: "var(--spacing-component-lg)",
      // 16px
      xl: "var(--spacing-component-xl)"
      // 24px
    },
    layout: {
      xs: "var(--spacing-layout-xs)",
      // 16px
      sm: "var(--spacing-layout-sm)",
      // 24px
      md: "var(--spacing-layout-md)",
      // 32px
      lg: "var(--spacing-layout-lg)",
      // 48px
      xl: "var(--spacing-layout-xl)",
      // 64px
      "2xl": "var(--spacing-layout-2xl)"
      // 96px
    }
  },
  typography: {
    heading: {
      h1: { fontSize: primitive.fontSize[40], lineHeight: primitive.lineHeight[48] },
      h2: { fontSize: primitive.fontSize[32], lineHeight: primitive.lineHeight[40] },
      h3: { fontSize: primitive.fontSize[24], lineHeight: primitive.lineHeight[32] },
      h4: { fontSize: primitive.fontSize[18], lineHeight: primitive.lineHeight[28] },
      h5: { fontSize: primitive.fontSize[16], lineHeight: primitive.lineHeight[24] },
      h6: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] }
    },
    body: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[18] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] },
      xs: { fontSize: primitive.fontSize[10], lineHeight: primitive.lineHeight[14] }
    },
    label: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[16] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] }
    },
    button: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[16] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] }
    },
    code: {
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[18] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] }
    }
  }
};
const component = {
  button: {
    height: {
      sm: "var(--button-height-sm)",
      // 28px
      md: "var(--button-height-md)",
      // 32px
      lg: "var(--button-height-lg)"
      // 36px
    },
    minWidth: {
      sm: "var(--button-min-width-sm)",
      // 60px
      md: "var(--button-min-width-md)",
      // 80px
      lg: "var(--button-min-width-lg)"
      // 80px
    },
    paddingX: {
      sm: "var(--button-padding-x-sm)",
      // 10px
      md: "var(--button-padding-x-md)",
      // 12px
      lg: "var(--button-padding-x-lg)"
      // 16px
    },
    paddingY: {
      sm: "var(--button-padding-y-sm)",
      // 6px
      md: "var(--button-padding-y-md)",
      // 8px
      lg: "var(--button-padding-y-lg)"
      // 10px
    },
    gap: {
      sm: "var(--button-gap-sm)",
      // 6px
      md: "var(--button-gap-md)",
      // 6px
      lg: "var(--button-gap-lg)"
      // 8px
    },
    radius: "var(--button-radius)",
    // 6px
    fontSize: {
      sm: "var(--button-font-size-sm)",
      // 11px
      md: "var(--button-font-size-md)",
      // 11px
      lg: "var(--button-font-size-lg)"
      // 12px
    },
    // Border colors per Figma spec
    borderColor: {
      default: "var(--color-border-strong)",
      // slate-300 for secondary
      disabled: "var(--color-border-default)"
      // slate-200 for disabled
    },
    // Disabled backgrounds per Figma spec
    disabledBg: {
      primary: "var(--color-border-default)",
      // slate-200
      secondary: "var(--color-surface-subtle)"
      // slate-50
    },
    // Disabled text colors (WCAG AA compliant)
    disabledText: {
      primary: "var(--color-text-subtle)",
      // slate-500 (4.57:1 contrast)
      secondary: "var(--color-text-disabled)"
      // slate-400
    }
  },
  input: {
    height: {
      sm: "var(--input-height-sm)",
      // 28px
      md: "var(--input-height-md)",
      // 32px
      lg: "var(--input-height-lg)"
      // 40px
    },
    paddingX: "var(--input-padding-x)",
    // 10px
    paddingY: "var(--input-padding-y)",
    // 8px
    radius: "var(--input-radius)",
    // 6px
    radiusCode: "var(--input-radius-code)",
    // 4px
    iconOffset: "var(--input-icon-offset)",
    // 8px
    labelGap: "var(--input-label-gap)",
    // 8px
    fontSize: "var(--input-font-size)",
    // 12px
    fontSizeSm: "var(--input-font-size-sm)",
    // 11px
    lineHeight: "var(--input-line-height)",
    // 16px
    borderWidth: "var(--input-border-width)",
    // 1px
    borderWidthFocus: "var(--input-border-width-focus)",
    // 2px
    bg: "var(--input-bg)",
    border: "var(--input-border)",
    borderFocus: "var(--input-border-focus)",
    borderReadonly: "var(--input-border-readonly)",
    borderError: "var(--input-border-error)",
    bgDisabled: "var(--input-bg-disabled)",
    textDisabled: "var(--input-text-disabled)"
  },
  textarea: {
    minHeight: "var(--textarea-min-height)"
    // 70px
  },
  numberInput: {
    height: "var(--number-input-height)",
    // 32px
    paddingY: "var(--number-input-padding-y)",
    // 4px
    buttonSize: "var(--number-input-button-size)"
    // 12px
  },
  searchInput: {
    heightSm: "var(--search-input-height-sm)",
    // 28px
    iconSize: "var(--search-input-icon-size)"
    // 12px
  },
  badge: {
    // Size: SM - padding 6×2px, font 11px
    paddingX: {
      sm: "var(--badge-padding-x-sm)",
      // 6px
      md: "var(--badge-padding-x-md)",
      // 8px
      lg: "var(--badge-padding-x-lg)"
      // 12px
    },
    paddingY: {
      sm: "var(--badge-padding-y-sm)",
      // 2px
      md: "var(--badge-padding-y-md)",
      // 4px
      lg: "var(--badge-padding-y-lg)"
      // 4px
    },
    fontSize: {
      sm: "var(--badge-font-size-sm)",
      // 11px
      md: "var(--badge-font-size-md)",
      // 12px
      lg: "var(--badge-font-size-lg)"
      // 14px
    },
    lineHeight: {
      sm: "var(--badge-line-height-sm)",
      // 16px
      md: "var(--badge-line-height-md)",
      // 16px
      lg: "var(--badge-line-height-lg)"
      // 20px
    },
    radius: "var(--badge-radius)",
    // 4px (sm)
    gap: "var(--badge-gap)",
    // 4px
    dotSize: "var(--badge-dot-size)"
    // 6px
  },
  menu: {
    item: {
      paddingX: "var(--menu-item-padding-x)",
      paddingY: "var(--menu-item-padding-y)",
      gap: "var(--menu-item-gap)",
      radius: "var(--menu-item-radius)"
    },
    section: {
      paddingX: "var(--menu-section-padding-x)",
      paddingY: "var(--menu-section-padding-y)"
    },
    divider: {
      margin: "var(--menu-divider-margin)"
    }
  },
  card: {
    padding: {
      sm: "var(--card-padding-sm)",
      md: "var(--card-padding-md)",
      lg: "var(--card-padding-lg)"
    },
    radius: "var(--card-radius)",
    gap: "var(--card-gap)"
  },
  modal: {
    padding: "var(--modal-padding)",
    radius: "var(--modal-radius)",
    gap: "var(--modal-gap)"
  },
  chip: {
    paddingLeft: "var(--chip-padding-left)",
    // 8px
    paddingRight: "var(--chip-padding-right)",
    // 6px
    paddingY: "var(--chip-padding-y)",
    // 4px
    gap: "var(--chip-gap)",
    // 6px
    radius: "var(--chip-radius)",
    // 6px
    fontSize: "var(--chip-font-size)",
    // 11px
    lineHeight: "var(--chip-line-height)",
    // 16px
    bg: "var(--chip-bg)",
    // surface-default
    border: "var(--chip-border)",
    // border-default
    separatorColor: "var(--chip-separator-color)"
    // border-default
  },
  slider: {
    trackHeight: "var(--slider-track-height)",
    // 6px
    trackRadius: "var(--slider-track-radius)",
    // 8px
    trackBg: "var(--slider-track-bg)",
    // border-subtle
    fillBg: "var(--slider-fill-bg)",
    // action-primary
    thumbSize: "var(--slider-thumb-size)",
    // 16px
    thumbBg: "var(--slider-thumb-bg)",
    // surface-default
    thumbBorder: "var(--slider-thumb-border)",
    // action-primary
    thumbBorderWidth: "var(--slider-thumb-border-width)",
    // 3px
    thumbShadow: "var(--slider-thumb-shadow)",
    // shadow-sm
    gap: "var(--slider-gap)",
    // 12px
    valueFontSize: "var(--slider-value-font-size)"
    // 12px
  },
  select: {
    paddingX: "var(--select-padding-x)",
    // 10px
    paddingY: "var(--select-padding-y)",
    // 8px
    radius: "var(--select-radius)",
    // 6px
    fontSize: "var(--select-font-size)",
    // 12px
    lineHeight: "var(--select-line-height)",
    // 16px
    borderWidth: "var(--select-border-width)",
    // 1px
    borderWidthFocus: "var(--select-border-width-focus)",
    // 2px
    bg: "var(--select-bg)",
    border: "var(--select-border)",
    borderFocus: "var(--select-border-focus)",
    bgDisabled: "var(--select-bg-disabled)",
    menu: {
      bg: "var(--select-menu-bg)",
      border: "var(--select-menu-border)",
      radius: "var(--select-menu-radius)",
      shadow: "var(--select-menu-shadow)"
    },
    item: {
      paddingX: "var(--select-item-padding-x)",
      // 10px
      paddingY: "var(--select-item-padding-y)",
      // 6px
      fontSize: "var(--select-item-font-size)",
      // 12px
      lineHeight: "var(--select-item-line-height)",
      // 18px
      hoverBg: "var(--select-item-hover-bg)",
      // slate-50
      selectedBg: "var(--select-item-selected-bg)",
      // blue-50
      selectedText: "var(--select-item-selected-text)"
      // action-primary
    }
  },
  disclosure: {
    gap: "var(--disclosure-gap)",
    // 6px
    iconSize: "var(--disclosure-icon-size)",
    // 12px
    fontSize: "var(--disclosure-font-size)",
    // 14px
    lineHeight: "var(--disclosure-line-height)"
    // 20px
  },
  inlineMessage: {
    padding: "var(--inline-message-padding)",
    // 12px
    gap: "var(--inline-message-gap)",
    // 8px
    radius: "var(--inline-message-radius)",
    // 6px
    fontSize: "var(--inline-message-font-size)",
    // 12px
    lineHeight: "var(--inline-message-line-height)",
    // 16px
    text: "var(--inline-message-text)",
    // text-default
    success: {
      bg: "var(--inline-message-success-bg)",
      // green-50
      icon: "var(--inline-message-success-icon)"
      // green-600
    },
    warning: {
      bg: "var(--inline-message-warning-bg)",
      // orange-50
      icon: "var(--inline-message-warning-icon)"
      // orange-600
    },
    error: {
      bg: "var(--inline-message-error-bg)",
      // red-50
      icon: "var(--inline-message-error-icon)"
      // red-600
    },
    info: {
      bg: "var(--inline-message-info-bg)",
      // blue-50
      icon: "var(--inline-message-info-icon)"
      // blue-600
    }
  },
  tabs: {
    gap: "var(--tabs-gap)",
    // 24px
    minWidth: "var(--tabs-min-width)",
    // 80px
    paddingX: "var(--tabs-padding-x)",
    // 12px
    indicatorGap: "var(--tabs-indicator-gap)",
    // 10px
    indicatorHeight: "var(--tabs-indicator-height)",
    // 2px
    panelPadding: "var(--tabs-panel-padding)",
    // 0
    fontSize: {
      sm: "var(--tabs-font-size-sm)",
      // 12px
      md: "var(--tabs-font-size-md)"
      // 14px
    },
    lineHeight: {
      sm: "var(--tabs-line-height-sm)",
      // 16px
      md: "var(--tabs-line-height-md)"
      // 20px
    },
    activeColor: "var(--tabs-active-color)",
    // action-primary
    // Boxed variant
    boxed: {
      padding: "var(--tabs-boxed-padding)",
      // 0px
      bg: "var(--tabs-boxed-bg)",
      // transparent
      border: "var(--tabs-boxed-border)",
      // border-default
      radius: "var(--tabs-boxed-radius)",
      // 4px
      itemPaddingX: "var(--tabs-boxed-item-padding-x)",
      // 24px
      itemPaddingY: "var(--tabs-boxed-item-padding-y)",
      // 8px
      itemRadius: "var(--tabs-boxed-item-radius)",
      // 4px
      activeBg: "var(--tabs-boxed-active-bg)"
      // surface-default
    },
    inactiveColor: "var(--tabs-inactive-color)",
    // text-subtle
    hoverColor: "var(--tabs-hover-color)",
    // text-default
    indicatorColor: "var(--tabs-indicator-color)"
    // action-primary
  },
  radio: {
    size: "var(--radio-size)",
    // 16px
    dotSize: "var(--radio-dot-size)",
    // 6px
    gap: "var(--radio-gap)",
    // 6px
    border: "var(--radio-border)",
    // slate-300
    borderHover: "var(--radio-border-hover)",
    // action-primary
    checkedBorder: "var(--radio-checked-border)",
    // action-primary
    checkedDot: "var(--radio-checked-dot)",
    // action-primary
    disabledBg: "var(--radio-disabled-bg)",
    disabledBorder: "var(--radio-disabled-border)",
    disabledDot: "var(--radio-disabled-dot)",
    errorText: "var(--radio-error-text)",
    label: {
      size: "var(--radio-label-size)",
      lineHeight: "var(--radio-label-line-height)",
      color: "var(--radio-label-color)",
      disabled: "var(--radio-label-disabled)"
    },
    description: {
      gap: "var(--radio-description-gap)",
      size: "var(--radio-description-size)",
      lineHeight: "var(--radio-description-line-height)",
      color: "var(--radio-description-color)"
    },
    group: {
      gap: "var(--radio-group-gap)",
      labelSize: "var(--radio-group-label-size)",
      labelGap: "var(--radio-group-label-gap)",
      itemGap: "var(--radio-group-item-gap)",
      itemGapHorizontal: "var(--radio-group-item-gap-horizontal)"
    }
  },
  toggle: {
    width: "var(--toggle-width)",
    // 48px
    height: "var(--toggle-height)",
    // 24px
    padding: "var(--toggle-padding)",
    // 4px
    radius: "var(--toggle-radius)",
    // pill
    gap: "var(--toggle-gap)",
    // 8px
    thumbSize: "var(--toggle-thumb-size)",
    // 16px
    thumbTranslate: "var(--toggle-thumb-translate)",
    // 24px
    bg: "var(--toggle-bg)",
    // slate-200
    checkedBg: "var(--toggle-checked-bg)",
    // action-primary
    disabledBg: "var(--toggle-disabled-bg)",
    checkedDisabledBg: "var(--toggle-checked-disabled-bg)",
    thumb: "var(--toggle-thumb)",
    // white
    thumbDisabled: "var(--toggle-thumb-disabled)",
    label: {
      size: "var(--toggle-label-size)",
      lineHeight: "var(--toggle-label-line-height)",
      color: "var(--toggle-label-color)",
      disabled: "var(--toggle-label-disabled)"
    },
    description: {
      gap: "var(--toggle-description-gap)",
      size: "var(--toggle-description-size)",
      lineHeight: "var(--toggle-description-line-height)",
      color: "var(--toggle-description-color)"
    }
  },
  checkbox: {
    size: "var(--checkbox-size)",
    // 16px
    radius: "var(--checkbox-radius)",
    // 4px
    gap: "var(--checkbox-gap)",
    // 6px
    border: "var(--checkbox-border)",
    // border-strong
    borderHover: "var(--checkbox-border-hover)",
    // action-primary
    checkedBg: "var(--checkbox-checked-bg)",
    // action-primary
    iconColor: "var(--checkbox-icon-color)",
    // white
    disabledBg: "var(--checkbox-disabled-bg)",
    disabledBorder: "var(--checkbox-disabled-border)",
    disabledCheckedBg: "var(--checkbox-disabled-checked-bg)",
    iconDisabled: "var(--checkbox-icon-disabled)",
    errorBg: "var(--checkbox-error-bg)",
    errorBorder: "var(--checkbox-error-border)",
    errorText: "var(--checkbox-error-text)",
    label: {
      size: "var(--checkbox-label-size)",
      lineHeight: "var(--checkbox-label-line-height)",
      color: "var(--checkbox-label-color)",
      disabled: "var(--checkbox-label-disabled)"
    },
    description: {
      gap: "var(--checkbox-description-gap)",
      size: "var(--checkbox-description-size)",
      lineHeight: "var(--checkbox-description-line-height)",
      color: "var(--checkbox-description-color)"
    },
    group: {
      gap: "var(--checkbox-group-gap)",
      labelSize: "var(--checkbox-group-label-size)",
      itemGap: "var(--checkbox-group-item-gap)",
      itemGapHorizontal: "var(--checkbox-group-item-gap-horizontal)"
    }
  },
  breadcrumb: {
    gap: "var(--breadcrumb-gap)",
    // 4px
    fontSize: "var(--breadcrumb-font-size)",
    // 11px
    lineHeight: "var(--breadcrumb-line-height)",
    // 16px
    textColor: "var(--breadcrumb-text-color)",
    // text-subtle
    textHover: "var(--breadcrumb-text-hover)",
    // text-default
    textCurrent: "var(--breadcrumb-text-current)",
    // text-default
    separatorColor: "var(--breadcrumb-separator-color)"
    // text-subtle
  },
  statusIndicator: {
    paddingX: "var(--status-padding-x)",
    // 6px
    paddingY: "var(--status-padding-y)",
    // 4px
    paddingIconOnly: "var(--status-padding-icon-only)",
    // 4px
    gap: "var(--status-gap)",
    // 4px
    radius: "var(--status-radius)",
    // pill (16px)
    fontSize: "var(--status-font-size)",
    // 11px
    lineHeight: "var(--status-line-height)",
    // 16px
    text: "var(--status-text)",
    // white
    activeBg: "var(--status-active-bg)",
    // green-400
    errorBg: "var(--status-error-bg)",
    // red-400
    mutedBg: "var(--status-muted-bg)",
    // slate-500
    buildingBg: "var(--status-building-bg)"
    // blue-400
  },
  tooltip: {
    paddingX: "var(--tooltip-padding-x)",
    // 8px
    paddingY: "var(--tooltip-padding-y)",
    // 4px
    radius: "var(--tooltip-radius)",
    // 4px
    fontSize: "var(--tooltip-font-size)",
    // 11px
    lineHeight: "var(--tooltip-line-height)",
    // 16px
    minWidth: "var(--tooltip-min-width)",
    // 60px
    maxWidth: "var(--tooltip-max-width)",
    // 240px
    bg: "var(--tooltip-bg)",
    // slate-900
    text: "var(--tooltip-text)",
    // white
    arrowSize: "var(--tooltip-arrow-size)",
    // 4px
    valueFontWeight: "var(--tooltip-value-font-weight)"
    // 500
  }
};
const colors = primitive.color;
const typography = {
  fontFamily: primitive.fontFamily,
  fontSize: primitive.fontSize,
  fontWeight: primitive.fontWeight
};
const spacing = primitive.spacing;
const radius = primitive.radius;
const shadows = primitive.shadow;
const zIndex = primitive.zIndex;
const transitions = primitive.duration;
const button = component.button;
const input = component.input;
const badge = component.badge;
const menu = component.menu;
function useControllable({
  value: controlledValue,
  defaultValue,
  onChange
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  const setValue = useCallback(
    (newValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange == null ? void 0 : onChange(newValue);
    },
    [isControlled, onChange]
  );
  return [currentValue, setValue, isControlled];
}
function useClickOutside(refs, handler, enabled = true) {
  const savedHandler = useRef(handler);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!enabled) return;
    const refsArray = Array.isArray(refs) ? refs : [refs];
    const listener = (event) => {
      const target = event.target;
      const isInside = refsArray.some((ref) => {
        var _a;
        return (_a = ref.current) == null ? void 0 : _a.contains(target);
      });
      if (!isInside) {
        savedHandler.current(event);
      }
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, enabled]);
}
const isString$1 = (obj) => typeof obj === "string";
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
const copy = (a, s, t) => {
  a.forEach((m) => {
    if (s[m]) t[m] = s[m];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
const canNotTraverseDeeper = (object) => !object || isString$1(object);
const getLastOfPath = (object, path, Empty) => {
  const stack = !isString$1(path) ? path : path.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
const setPath = (object, path, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  if (obj !== void 0 || path.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === void 0 && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if ((last == null ? void 0 : last.obj) && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
const getPath = (object, path) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj) return void 0;
  if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
  return obj[k];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const escape = (data) => {
  if (isString$1(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [" ", ",", "?", "!", ";"];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = (obj, path, keySeparator = ".") => {
  if (!obj) return void 0;
  if (obj[path]) {
    if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
    return obj[path];
  }
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = (code) => code == null ? void 0 : code.replace("_", "-");
const consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    var _a, _b;
    (_b = (_a = console == null ? void 0 : console[type]) == null ? void 0 : _a.apply) == null ? void 0 : _b.call(_a, console, args);
  }
};
class Logger {
  constructor(concreteLogger, options = {}) {
    this.init(concreteLogger, options);
  }
  init(concreteLogger, options = {}) {
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log(...args) {
    return this.forward(args, "log", "", true);
  }
  warn(...args) {
    return this.forward(args, "warn", "", true);
  }
  error(...args) {
    return this.forward(args, "error", "");
  }
  deprecate(...args) {
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();
class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
}
class ResourceStore extends EventEmitter {
  constructor(data, options = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key, options = {}) {
    var _a, _b;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString$1(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString$1(key)) return result;
    return deepFind((_b = (_a = this.data) == null ? void 0 : _a[lng]) == null ? void 0 : _b[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value, options = {
    silent: false
  }) {
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources2, options = {
    silent: false
  }) {
    for (const m in resources2) {
      if (isString$1(resources2[m]) || Array.isArray(resources2[m])) this.addResource(lng, ns, m, resources2[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources2);
  }
  addResourceBundle(lng, ns, resources2, deep, overwrite, options = {
    silent: false,
    skipCopy: false
  }) {
    let path = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      deep = resources2;
      resources2 = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources2 = JSON.parse(JSON.stringify(resources2));
    if (deep) {
      deepExtend(pack, resources2, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources2
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit("added", lng, ns, resources2);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      var _a;
      value = ((_a = this.processors[processor]) == null ? void 0 : _a.process(value, key, options, translator)) ?? value;
    });
    return value;
  }
};
const PATH_KEY = Symbol("i18next/PATH_KEY");
function createProxy() {
  const state = [];
  const handler = /* @__PURE__ */ Object.create(null);
  let proxy;
  handler.get = (target, key) => {
    var _a;
    (_a = proxy == null ? void 0 : proxy.revoke) == null ? void 0 : _a.call(proxy);
    if (key === PATH_KEY) return state;
    state.push(key);
    proxy = Proxy.revocable(target, handler);
    return proxy.proxy;
  };
  return Proxy.revocable(/* @__PURE__ */ Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
  const {
    [PATH_KEY]: path
  } = selector(createProxy());
  return path.join((opts == null ? void 0 : opts.keySeparator) ?? ".");
}
const checkedLoadedFor = {};
const shouldHandleAsObject = (res) => !isString$1(res) && typeof res !== "boolean" && typeof res !== "number";
class Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key, o = {
    interpolation: {}
  }) {
    const opt = {
      ...o
    };
    if (key == null) return false;
    const resolved = this.resolve(key, opt);
    if ((resolved == null ? void 0 : resolved.res) === void 0) return false;
    const isObject2 = shouldHandleAsObject(resolved.res);
    if (opt.returnObjects === false && isObject2) {
      return false;
    }
    return true;
  }
  extractFromKey(key, opt) {
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    let namespaces = opt.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString$1(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString$1(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, o, lastKey) {
    let opt = typeof o === "object" ? {
      ...o
    } : o;
    if (typeof opt !== "object" && this.options.overloadTranslationOptionHandler) {
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof opt === "object") opt = {
      ...opt
    };
    if (!opt) opt = {};
    if (keys == null) return "";
    if (typeof keys === "function") keys = keysFromSelector(keys, {
      ...this.options,
      ...opt
    });
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], opt);
    const namespace = namespaces[namespaces.length - 1];
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((lng == null ? void 0 : lng.toLowerCase()) === "cimode") {
      if (appendNamespaceToCIMode) {
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(opt)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(opt)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, opt);
    let res = resolved == null ? void 0 : resolved.res;
    const resUsedKey = (resolved == null ? void 0 : resolved.usedKey) || key;
    const resExactUsedKey = (resolved == null ? void 0 : resolved.exactUsedKey) || key;
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
    const hasDefaultValue = Translator.hasDefaultValue(opt);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : "";
    const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
      ordinal: false
    }) : "";
    const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
    const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString$1(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...opt,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy2[m] === deepKey) copy2[m] = resForObjHndl[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...opt,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          var _a;
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
          } else if ((_a = this.backendConnector) == null ? void 0 : _a.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, opt);
              if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, opt, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) {
        res = `${namespace}${nsSeparator}${key}`;
      }
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : void 0, opt);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(opt);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, opt, resolved, lastKey) {
    var _a, _b;
    if ((_a = this.i18nFormat) == null ? void 0 : _a.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...opt
      }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!opt.skipInterpolation) {
      if (opt.interpolation) this.interpolator.init({
        ...opt,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...opt.interpolation
          }
        }
      });
      const skipOnVariables = isString$1(res) && (((_b = opt == null ? void 0 : opt.interpolation) == null ? void 0 : _b.skipOnVariables) !== void 0 ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = opt.replace && !isString$1(opt.replace) ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) opt.nest = false;
      }
      if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
      if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
        if ((lastKey == null ? void 0 : lastKey[0]) === args[0] && !opt.context) {
          this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return this.translate(...args, key);
      }, opt);
      if (opt.interpolation) this.interpolator.reset();
    }
    const postProcess = opt.postProcess || this.options.postProcess;
    const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
    if (res != null && (postProcessorNames == null ? void 0 : postProcessorNames.length) && opt.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(opt)
        },
        ...opt
      } : opt, this);
    }
    return res;
  }
  resolve(keys, opt = {}) {
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString$1(keys)) keys = [keys];
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
      const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
      const needsContextHandling = opt.context !== void 0 && (isString$1(opt.context) || typeof opt.context === "number") && opt.context !== "";
      const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
      namespaces.forEach((ns) => {
        var _a, _b;
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && ((_a = this.utils) == null ? void 0 : _a.hasLoadedNamespace) && !((_b = this.utils) == null ? void 0 : _b.hasLoadedNamespace(usedNS))) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          var _a2;
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if ((_a2 = this.i18nFormat) == null ? void 0 : _a2.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              finalKeys.push(key + pluralSuffix);
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator || "_"}${opt.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                finalKeys.push(contextKey + pluralSuffix);
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key, options = {}) {
    var _a;
    if ((_a = this.i18nFormat) == null ? void 0 : _a.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails(options = {}) {
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
}
class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString$1(code) && code.indexOf("-") > -1) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {
      }
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngScOnly = this.getScriptPartFromCode(code);
        if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString$1(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString$1(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString$1(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
}
const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const dummyRule = {
  select: (count) => count === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class PluralResolver {
  constructor(languageUtils, options = {}) {
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code, options = {}) {
    const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
    const type = options.ordinal ? "ordinal" : "cardinal";
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (!Intl) {
        this.logger.error("No Intl support, please use an Intl polyfill!");
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    return (rule == null ? void 0 : rule.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(code, key, options = {}) {
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
  }
  getSuffix(code, count, options = {}) {
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix("dev", count, options);
  }
}
const deepFindWithDefaults = (data, defaultData, key, keySeparator = ".", ignoreJSONStructure = true) => {
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString$1(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === void 0) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
const regexSafe = (val) => val.replace(/\$/g, "$$$$");
class Interpolator {
  constructor(options = {}) {
    var _a;
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = ((_a = options == null ? void 0 : options.interpolation) == null ? void 0 : _a.format) || ((value) => value);
    this.init(options);
  }
  init(options = {}) {
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if ((existingRegExp == null ? void 0 : existingRegExp.source) === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    var _a;
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = (options == null ? void 0 : options.missingInterpolationHandler) || this.options.missingInterpolationHandler;
    const skipOnVariables = ((_a = options == null ? void 0 : options.interpolation) == null ? void 0 : _a.skipOnVariables) !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString$1(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString$1(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc, options = {}) {
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (((matchedSingleQuotes == null ? void 0 : matchedSingleQuotes.length) ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf("}") + 1 : match[1].indexOf(this.formatSeparator);
      if (keyEndIndex !== -1) {
        formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map((elem) => elem.trim()).filter(Boolean);
        match[1] = match[1].slice(0, keyEndIndex);
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString$1(value)) return value;
      if (!isString$1(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (formatters.length) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}
const parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = (fn) => {
  const cache = {};
  return (v, l, o) => {
    let optForCache = o;
    if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [o.interpolationkey]: void 0
      };
    }
    const key = l + JSON.stringify(optForCache);
    let frm = cache[key];
    if (!frm) {
      frm = fn(getCleanedCode(l), o);
      cache[key] = frm;
    }
    return frm(v);
  };
};
const createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
class Formatter {
  constructor(options = {}) {
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.init(options);
  }
  init(services, options = {
    interpolation: {}
  }) {
    this.formatSeparator = options.interpolation.formatSeparator || ",";
    const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
    this.formats = {
      number: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: cf((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: cf((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: cf((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng, options = {}) {
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f) => f.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f) => f.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      var _a;
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = ((_a = options == null ? void 0 : options.formatParams) == null ? void 0 : _a[options.interpolationkey]) || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
}
const removePending = (q, name) => {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store, services, options = {}) {
    var _a, _b;
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    (_b = (_a = this.backend) == null ? void 0 : _a.init) == null ? void 0 : _b.call(_a, services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces, options = {}, callback) {
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString$1(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name, prefix = "") {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {
  }) {
    var _a, _b, _c, _d, _e;
    if (((_b = (_a = this.services) == null ? void 0 : _a.utils) == null ? void 0 : _b.hasLoadedNamespace) && !((_d = (_c = this.services) == null ? void 0 : _c.utils) == null ? void 0 : _d.hasLoadedNamespace(namespace))) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if ((_e = this.backend) == null ? void 0 : _e.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}
const get = () => ({
  debug: false,
  initAsync: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString$1(args[1])) ret.defaultValue = args[1];
    if (isString$1(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value) => value,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  },
  cacheInBuiltFormats: true
});
const transformOptions = (options) => {
  var _a, _b;
  if (isString$1(options.ns)) options.ns = [options.ns];
  if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (((_b = (_a = options.supportedLngs) == null ? void 0 : _a.indexOf) == null ? void 0 : _b.call(_a, "cimode")) < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  if (typeof options.initImmediate === "boolean") options.initAsync = options.initImmediate;
  return options;
};
const noop = () => {
};
const bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init(options = {}, callback) {
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString$1(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    if (typeof this.options.overloadTranslationOptionHandler !== "function") {
      this.options.overloadTranslationOptionHandler = defOpts.overloadTranslationOptionHandler;
    }
    if (this.options.debug === true) {
      if (typeof console !== "undefined") console.warn("i18next is maintained with support from locize.com — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com");
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      const usingLegacyFormatFunction = this.options.interpolation.format && this.options.interpolation.format !== defOpts.interpolation.format;
      if (usingLegacyFormatFunction) {
        this.logger.deprecate(`init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting`);
      }
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        if (s.formatter.init) s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = (...args) => this.store[fcName](...args);
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = (...args) => {
        this.store[fcName](...args);
        return this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t);
        callback(err, t);
      };
      if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language, callback = noop) {
    var _a, _b;
    let usedCallback = callback;
    const usedLng = isString$1(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if ((usedLng == null ? void 0 : usedLng.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (l === "cimode") return;
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      (_b = (_a = this.options.preload) == null ? void 0 : _a.forEach) == null ? void 0 : _b.call(_a, (l) => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (["cimode", "dev"].indexOf(l) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
    if (!this.resolvedLanguage && this.languages.indexOf(l) < 0 && this.store.hasLanguageSomeTranslations(l)) {
      this.resolvedLanguage = l;
      this.languages.unshift(l);
    }
  }
  changeLanguage(lng, callback) {
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        if (this.isLanguageChangingTo === lng) {
          setLngProps(l);
          this.translator.changeLanguage(l);
          this.isLanguageChangingTo = void 0;
          this.emit("languageChanged", l);
          this.logger.log("languageChanged", l);
        }
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve((...args) => this.t(...args));
      if (callback) callback(err, (...args) => this.t(...args));
    };
    const setLng = (lngs) => {
      var _a, _b;
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const fl = isString$1(lngs) ? lngs : lngs && lngs[0];
      const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString$1(lngs) ? [lngs] : lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        (_b = (_a = this.services.languageDetector) == null ? void 0 : _a.cacheUserLanguage) == null ? void 0 : _b.call(_a, l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    const fixedT = (key, opts, ...rest) => {
      let o;
      if (typeof opts !== "object") {
        o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        o = {
          ...opts
        };
      }
      o.lng = o.lng || fixedT.lng;
      o.lngs = o.lngs || fixedT.lngs;
      o.ns = o.ns || fixedT.ns;
      if (o.keyPrefix !== "") o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = this.options.keySeparator || ".";
      let resultKey;
      if (o.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => {
          if (typeof k === "function") k = keysFromSelector(k, {
            ...this.options,
            ...opts
          });
          return `${o.keyPrefix}${keySeparator}${k}`;
        });
      } else {
        if (typeof key === "function") key = keysFromSelector(key, {
          ...this.options,
          ...opts
        });
        resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
      }
      return this.t(resultKey, o);
    };
    if (isString$1(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t(...args) {
    var _a;
    return (_a = this.translator) == null ? void 0 : _a.translate(...args);
  }
  exists(...args) {
    var _a;
    return (_a = this.translator) == null ? void 0 : _a.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns, options = {}) {
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString$1(ns)) ns = [ns];
    ns.forEach((n) => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString$1(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    var _a, _b;
    if (!lng) lng = this.resolvedLanguage || (((_a = this.languages) == null ? void 0 : _a.length) > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    try {
      const l = new Intl.Locale(lng);
      if (l && l.getTextInfo) {
        const ti = l.getTextInfo();
        if (ti && ti.direction) return ti.direction;
      }
    } catch (e) {
    }
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = ((_b = this.services) == null ? void 0 : _b.languageUtils) || new LanguageUtil(get());
    if (lng.toLowerCase().indexOf("-latn") > 1) return "ltr";
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(options = {}, callback) {
    const instance2 = new I18n(options, callback);
    instance2.createInstance = I18n.createInstance;
    return instance2;
  }
  cloneInstance(options = {}, callback = noop) {
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, prev[l]);
        return prev;
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    if (options.interpolation) {
      const defOpts = get();
      const mergedInterpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation,
        ...options.interpolation
      };
      const mergedForInterpolator = {
        ...mergedOptions,
        interpolation: mergedInterpolation
      };
      clone.services.interpolator = new Interpolator(mergedForInterpolator);
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", (event, ...args) => {
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
const warn = (i18n, code, msg, rest) => {
  var _a, _b, _c, _d;
  const args = [msg, {
    code,
    ...rest || {}
  }];
  if ((_b = (_a = i18n == null ? void 0 : i18n.services) == null ? void 0 : _a.logger) == null ? void 0 : _b.forward) {
    return i18n.services.logger.forward(args, "warn", "react-i18next::", true);
  }
  if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if ((_d = (_c = i18n == null ? void 0 : i18n.services) == null ? void 0 : _c.logger) == null ? void 0 : _d.warn) {
    i18n.services.logger.warn(...args);
  } else if (console == null ? void 0 : console.warn) {
    console.warn(...args);
  }
};
const alreadyWarned = {};
const warnOnce = (i18n, code, msg, rest) => {
  if (isString(msg) && alreadyWarned[msg]) return;
  if (isString(msg)) alreadyWarned[msg] = /* @__PURE__ */ new Date();
  warn(i18n, code, msg, rest);
};
const loadedClb = (i18n, cb) => () => {
  if (i18n.isInitialized) {
    cb();
  } else {
    const initialized = () => {
      setTimeout(() => {
        i18n.off("initialized", initialized);
      }, 0);
      cb();
    };
    i18n.on("initialized", initialized);
  }
};
const loadNamespaces = (i18n, ns, cb) => {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
const loadLanguages = (i18n, lng, ns, cb) => {
  if (isString(ns)) ns = [ns];
  if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
  ns.forEach((n) => {
    if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
const hasLoadedNamespace = (ns, i18n, options = {}) => {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce(i18n, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
      languages: i18n.languages
    });
    return true;
  }
  return i18n.hasLoadedNamespace(ns, {
    lng: options.lng,
    precheck: (i18nInstance2, loadNotPending) => {
      if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance2.services.backendConnector.backend && i18nInstance2.isLanguageChangingTo && !loadNotPending(i18nInstance2.isLanguageChangingTo, ns)) return false;
    }
  });
};
const isString = (obj) => typeof obj === "string";
const isObject = (obj) => typeof obj === "object" && obj !== null;
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
};
const unescapeHtmlEntity = (m) => htmlEntities[m];
const unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
let defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape,
  transDefaultProps: void 0
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const getDefaults = () => defaultOptions;
let i18nInstance;
const setI18n = (instance2) => {
  i18nInstance = instance2;
};
const getI18n = () => i18nInstance;
const initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
    setI18n(instance2);
  }
};
const I18nContext = createContext();
class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(namespaces) {
    namespaces.forEach((ns) => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React = React3__default;
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useState2 = React.useState, useEffect2 = React.useEffect, useLayoutEffect2 = React.useLayoutEffect, useDebugValue = React.useDebugValue;
  function useSyncExternalStore$2(subscribe2, getSnapshot2) {
    var value = getSnapshot2(), _useState = useState2({ inst: { value, getSnapshot: getSnapshot2 } }), inst = _useState[0].inst, forceUpdate = _useState[1];
    useLayoutEffect2(
      function() {
        inst.value = value;
        inst.getSnapshot = getSnapshot2;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      },
      [subscribe2, value, getSnapshot2]
    );
    useEffect2(
      function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        return subscribe2(function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        });
      },
      [subscribe2]
    );
    useDebugValue(value);
    return value;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe2, getSnapshot2) {
    return getSnapshot2();
  }
  var shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var useSyncExternalStoreShim_development = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_development;
function requireUseSyncExternalStoreShim_development() {
  if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
  hasRequiredUseSyncExternalStoreShim_development = 1;
  "production" !== process.env.NODE_ENV && function() {
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe2, getSnapshot2) {
      didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = true, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var value = getSnapshot2();
      if (!didWarnUncachedGetSnapshot) {
        var cachedValue = getSnapshot2();
        objectIs(value, cachedValue) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), didWarnUncachedGetSnapshot = true);
      }
      cachedValue = useState2({
        inst: { value, getSnapshot: getSnapshot2 }
      });
      var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
      useLayoutEffect2(
        function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot2;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe2, value, getSnapshot2]
      );
      useEffect2(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe2(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe2]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe2, getSnapshot2) {
      return getSnapshot2();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = React3__default, objectIs = "function" === typeof Object.is ? Object.is : is, useState2 = React.useState, useEffect2 = React.useEffect, useLayoutEffect2 = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = false, didWarnUncachedGetSnapshot = false, shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    useSyncExternalStoreShim_development.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim2;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }();
  return useSyncExternalStoreShim_development;
}
if (process.env.NODE_ENV === "production") {
  shim.exports = requireUseSyncExternalStoreShim_production();
} else {
  shim.exports = requireUseSyncExternalStoreShim_development();
}
var shimExports = shim.exports;
const notReadyT = (k, optsOrDefaultValue) => {
  if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
  if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
  return Array.isArray(k) ? k[k.length - 1] : k;
};
const notReadySnapshot = {
  t: notReadyT,
  ready: false
};
const dummySubscribe = () => () => {
};
const useTranslation = (ns, props = {}) => {
  var _a, _b;
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    warnOnce(i18n, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
  }
  const i18nOptions = useMemo(() => {
    var _a2;
    return {
      ...getDefaults(),
      ...(_a2 = i18n == null ? void 0 : i18n.options) == null ? void 0 : _a2.react,
      ...props
    };
  }, [i18n, props]);
  const {
    useSuspense,
    keyPrefix
  } = i18nOptions;
  const nsOrContext = ns;
  const unstableNamespaces = isString(nsOrContext) ? [nsOrContext] : nsOrContext;
  const namespaces = useMemo(() => unstableNamespaces, unstableNamespaces);
  (_b = (_a = i18n == null ? void 0 : i18n.reportNamespaces) == null ? void 0 : _a.addUsedNamespaces) == null ? void 0 : _b.call(_a, namespaces);
  const revisionRef = useRef(0);
  const subscribe2 = useCallback((callback) => {
    if (!i18n) return dummySubscribe;
    const {
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    const wrappedCallback = () => {
      revisionRef.current += 1;
      callback();
    };
    if (bindI18n) i18n.on(bindI18n, wrappedCallback);
    if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
    return () => {
      if (bindI18n) bindI18n.split(" ").forEach((e) => i18n.off(e, wrappedCallback));
      if (bindI18nStore) bindI18nStore.split(" ").forEach((e) => i18n.store.off(e, wrappedCallback));
    };
  }, [i18n, i18nOptions]);
  const snapshotRef = useRef();
  const getSnapshot2 = useCallback(() => {
    if (!i18n) {
      return notReadySnapshot;
    }
    const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every((n) => hasLoadedNamespace(n, i18n, i18nOptions));
    const currentLng = props.lng || i18n.language;
    const currentRevision = revisionRef.current;
    const lastSnapshot = snapshotRef.current;
    if (lastSnapshot && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.keyPrefix === keyPrefix && lastSnapshot.revision === currentRevision) {
      return lastSnapshot;
    }
    const calculatedT = i18n.getFixedT(currentLng, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix);
    const newSnapshot = {
      t: calculatedT,
      ready: calculatedReady,
      lng: currentLng,
      keyPrefix,
      revision: currentRevision
    };
    snapshotRef.current = newSnapshot;
    return newSnapshot;
  }, [i18n, namespaces, keyPrefix, i18nOptions, props.lng]);
  const [loadCount, setLoadCount] = useState(0);
  const {
    t,
    ready
  } = shimExports.useSyncExternalStore(subscribe2, getSnapshot2, getSnapshot2);
  useEffect(() => {
    if (i18n && !ready && !useSuspense) {
      const onLoaded = () => setLoadCount((c) => c + 1);
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    }
  }, [i18n, props.lng, namespaces, ready, useSuspense, loadCount]);
  const finalI18n = i18n || {};
  const wrapperRef = useRef(null);
  const wrapperLangRef = useRef();
  const createI18nWrapper = (original) => {
    const descriptors = Object.getOwnPropertyDescriptors(original);
    if (descriptors.__original) delete descriptors.__original;
    const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);
    if (!Object.prototype.hasOwnProperty.call(wrapper, "__original")) {
      try {
        Object.defineProperty(wrapper, "__original", {
          value: original,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (_) {
      }
    }
    return wrapper;
  };
  const ret = useMemo(() => {
    const original = finalI18n;
    const lang = original == null ? void 0 : original.language;
    let i18nWrapper = original;
    if (original) {
      if (wrapperRef.current && wrapperRef.current.__original === original) {
        if (wrapperLangRef.current !== lang) {
          i18nWrapper = createI18nWrapper(original);
          wrapperRef.current = i18nWrapper;
          wrapperLangRef.current = lang;
        } else {
          i18nWrapper = wrapperRef.current;
        }
      } else {
        i18nWrapper = createI18nWrapper(original);
        wrapperRef.current = i18nWrapper;
        wrapperLangRef.current = lang;
      }
    }
    const arr = [t, i18nWrapper, ready];
    arr.t = t;
    arr.i18n = i18nWrapper;
    arr.ready = ready;
    return arr;
  }, [t, finalI18n, ready, finalI18n.resolvedLanguage, finalI18n.language, finalI18n.languages]);
  if (i18n && useSuspense && !ready) {
    throw new Promise((resolve) => {
      const onLoaded = () => resolve();
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    });
  }
  return ret;
};
const tds$2 = {
  common: {
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    "delete": "حذف",
    edit: "تعديل",
    view: "عرض",
    create: "إنشاء",
    search: "بحث",
    filter: "فلتر",
    sort: "ترتيب",
    apply: "تطبيق",
    reset: "إعادة تعيين",
    close: "إغلاق",
    loading: "جاري التحميل...",
    error: "حدث خطأ ما",
    success: "نجاح",
    warning: "تحذير",
    info: "معلومات",
    moreActions: "المزيد من الإجراءات",
    noData: "لا توجد بيانات",
    yes: "نعم",
    no: "لا",
    all: "الكل",
    none: "لا شيء",
    select: "اختر",
    selected: "محدد",
    required: "مطلوب",
    optional: "اختياري"
  },
  table: {
    empty: {
      title: "لم يتم العثور على {{resource}}",
      description: "لا يوجد {{resource}} للعرض."
    },
    noResult: {
      title: "لا توجد نتائج",
      description: "لا يوجد {{resource}} يطابق الفلاتر الحالية."
    }
  },
  pagination: {
    itemsPerPage: "العناصر في الصفحة",
    of: "من",
    page: "صفحة"
  },
  form: {
    validation: {
      required: "هذا الحقل مطلوب",
      minLength: "الحد الأدنى {{min}} حرف مطلوب",
      maxLength: "الحد الأقصى {{max}} حرف مسموح",
      email: "يرجى إدخال عنوان بريد إلكتروني صالح",
      number: "مسموح بالأرقام فقط"
    }
  },
  modal: {
    unsavedChanges: {
      title: "تغييرات غير محفوظة",
      message: "لديك تغييرات غير محفوظة. هل تريد المتابعة؟",
      stay: "البقاء",
      leave: "المغادرة"
    }
  },
  notification: {
    success: "تمت العملية بنجاح",
    error: "حدث خطأ أثناء العملية",
    warning: "مطلوب الانتباه",
    info: "إشعار"
  },
  accessibility: {
    closeButton: "زر الإغلاق",
    expandButton: "زر التوسيع",
    collapseButton: "زر الطي",
    menuButton: "زر القائمة",
    loading: "جاري التحميل"
  }
};
const arSa = {
  tds: tds$2
};
const tds$1 = {
  common: {
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    "delete": "Delete",
    edit: "Edit",
    view: "View",
    create: "Create",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    apply: "Apply",
    reset: "Reset",
    close: "Close",
    loading: "Loading...",
    error: "Something went wrong",
    success: "Success",
    warning: "Warning",
    info: "Information",
    moreActions: "More Actions",
    noData: "No data available",
    yes: "Yes",
    no: "No",
    all: "All",
    none: "None",
    select: "Select",
    selected: "Selected",
    required: "Required",
    optional: "Optional"
  },
  table: {
    empty: {
      title: "No {{resource}} found",
      description: "There are no {{resource}} to display."
    },
    noResult: {
      title: "No results found",
      description: "No {{resource}} match your current filters."
    }
  },
  pagination: {
    itemsPerPage: "Items per page",
    of: "of",
    page: "Page"
  },
  form: {
    validation: {
      required: "This field is required",
      minLength: "Minimum {{min}} characters required",
      maxLength: "Maximum {{max}} characters allowed",
      email: "Please enter a valid email address",
      number: "Only numbers are allowed"
    }
  },
  modal: {
    unsavedChanges: {
      title: "Unsaved Changes",
      message: "You have unsaved changes. Do you want to continue?",
      stay: "Stay",
      leave: "Leave"
    }
  },
  notification: {
    success: "Operation completed successfully",
    error: "An error occurred during the operation",
    warning: "Attention required",
    info: "Notification"
  },
  accessibility: {
    closeButton: "Close button",
    expandButton: "Expand button",
    collapseButton: "Collapse button",
    menuButton: "Menu button",
    loading: "Loading"
  }
};
const en = {
  tds: tds$1
};
const tds = {
  common: {
    save: "저장",
    cancel: "취소",
    confirm: "확인",
    "delete": "삭제",
    edit: "수정",
    view: "보기",
    create: "생성",
    search: "검색",
    filter: "필터",
    sort: "정렬",
    apply: "적용",
    reset: "초기화",
    close: "닫기",
    loading: "로딩 중...",
    error: "오류가 발생했습니다",
    success: "성공",
    warning: "경고",
    info: "정보",
    moreActions: "추가 작업",
    noData: "데이터가 없습니다",
    yes: "예",
    no: "아니오",
    all: "전체",
    none: "없음",
    select: "선택",
    selected: "선택됨",
    required: "필수",
    optional: "선택사항"
  },
  table: {
    empty: {
      title: "{{resource}} 목록 없음",
      description: "표시할 {{resource}}이(가) 없습니다."
    },
    noResult: {
      title: "검색결과 없음",
      description: "검색 조건에 맞는 데이터를 찾을 수 없습니다."
    }
  },
  pagination: {
    itemsPerPage: "페이지당 항목",
    of: "/ 중",
    page: "페이지"
  },
  form: {
    validation: {
      required: "이 필드는 필수입니다",
      minLength: "최소 {{min}}자 이상 입력하세요",
      maxLength: "최대 {{max}}자까지 입력 가능합니다",
      email: "올바른 이메일 형식을 입력하세요",
      number: "숫자만 입력 가능합니다"
    }
  },
  modal: {
    unsavedChanges: {
      title: "저장되지 않은 변경사항",
      message: "저장되지 않은 변경사항이 있습니다. 계속하시겠습니까?",
      stay: "머물기",
      leave: "나가기"
    }
  },
  notification: {
    success: "작업이 완료되었습니다",
    error: "작업 중 오류가 발생했습니다",
    warning: "주의가 필요합니다",
    info: "알림"
  },
  accessibility: {
    closeButton: "닫기 버튼",
    expandButton: "펼치기 버튼",
    collapseButton: "접기 버튼",
    menuButton: "메뉴 버튼",
    loading: "로딩 중"
  }
};
const ko = {
  tds
};
const locales = {
  ko: { tds: ko.tds },
  en: { tds: en.tds },
  "ar-sa": { tds: arSa.tds }
};
const STORAGE_KEY = "tds_language";
const SUPPORTED_LANGUAGES = ["ko", "en", "ar-sa"];
const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  }
  return "ko";
};
const resources = {
  ko: locales.ko,
  en: locales.en,
  "ar-sa": locales["ar-sa"]
};
instance.use(initReactI18next).init({
  resources,
  ns: ["tds"],
  defaultNS: "tds",
  nsSeparator: ":",
  keySeparator: ".",
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
    // React already escapes values
  },
  react: {
    useSuspense: false
  }
});
const changeLanguage = (lang) => {
  instance.changeLanguage(lang);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("locale-change", { detail: lang }));
  }
};
const getCurrentLanguage = () => {
  return instance.language;
};
const isRTL = () => {
  return instance.language === "ar-sa";
};
const useLocale = () => {
  const { t, i18n } = useTranslation("tds");
  const setLanguage = useCallback((lang) => {
    changeLanguage(lang);
  }, []);
  return {
    /** Translation function - use with keys like 'common.save' */
    t,
    /** Current language code */
    language: getCurrentLanguage(),
    /** Change the current language */
    setLanguage,
    /** Whether current language is RTL (Arabic) */
    isRTL: isRTL(),
    /** List of supported language codes */
    supportedLanguages: SUPPORTED_LANGUAGES,
    /** i18n instance for advanced usage */
    i18n
  };
};
const fixedColumns = {
  // 선택/체크박스
  select: "40px",
  checkbox: "40px",
  radio: "40px",
  favorite: "40px",
  // 상태 (Icon only)
  status: "64px",
  // 상태 (Icon + Label pill)
  statusLabel: "120px",
  // 잠금
  locked: "64px",
  // 액션 메뉴
  actions: "64px",
  action: "64px",
  actionWide: "72px",
  actionsDouble: "96px",
  // 기타 아이콘/버튼
  identify: "80px"
};
const columnMinWidths = {
  // ============================================================================
  // 공통 (Common)
  // ============================================================================
  // 식별자/이름 ----------------------------------------------------------------
  id: "64px",
  name: "180px",
  nameLg: "240px",
  nameWide: "220px",
  nameXl: "300px",
  nameXxl: "250px",
  hostname: "180px",
  node: "150px",
  // 상태 (텍스트 포함) ---------------------------------------------------------
  statusLg: "160px",
  ready: "80px",
  health: "80px",
  condition: "90px",
  phase: "100px",
  // 시간/날짜 ------------------------------------------------------------------
  createdAt: "140px",
  updatedAt: "140px",
  editedAt: "140px",
  startTime: "140px",
  started: "140px",
  firstSeen: "100px",
  lastSeen: "100px",
  lastAccess: "140px",
  lastSignIn: "120px",
  lastUpdate: "140px",
  lastUpdated: "140px",
  lastRefreshed: "140px",
  lastUsed: "140px",
  expiresAt: "120px",
  timestamp: "160px",
  duration: "100px",
  age: "150px",
  creationDate: "140px",
  // 숫자/카운트 ----------------------------------------------------------------
  count: "80px",
  data: "80px",
  userCount: "80px",
  // 타입/분류 ------------------------------------------------------------------
  type: "100px",
  typeLg: "100px",
  typeXl: "200px",
  category: "140px",
  version: "100px",
  // 텍스트 --------------------------------------------------------------------
  description: "200px",
  labels: "180px",
  annotations: "300px",
  key: "300px",
  value: "300px",
  owner: "160px",
  // 서버 그룹/키페어 -----------------------------------------------------------
  fingerprint: "360px",
  // ============================================================================
  // Compute
  // ============================================================================
  // 리소스 --------------------------------------------------------------------
  cpu: "80px",
  vcpu: "80px",
  vCPU: "80px",
  ram: "80px",
  memory: "100px",
  disk: "80px",
  gpu: "80px",
  ephemeralDisk: "100px",
  // 인스턴스 ------------------------------------------------------------------
  image: "110px",
  flavor: "90px",
  az: "80px",
  availabilityZone: "80px",
  sourceInstance: "140px",
  instances: "100px",
  // 이미지/스냅샷 --------------------------------------------------------------
  size: "100px",
  minDisk: "100px",
  minRam: "100px",
  minRAM: "100px",
  diskTag: "100px",
  bootable: "80px",
  diskFormat: "100px",
  access: "80px",
  visibility: "100px",
  protected: "80px",
  // 서버 그룹/키페어 -----------------------------------------------------------
  policy: "120px",
  // Flavor 상세 ---------------------------------------------------------------
  gpuType: "120px",
  numaNodes: "100px",
  cpuPolicy: "120px",
  cpuThreadPolicy: "140px",
  // 호스트 하드웨어 ------------------------------------------------------------
  model: "250px",
  cpus: "80px",
  cores: "80px",
  totalMemory: "120px",
  rawCapacity: "120px",
  hdds: "80px",
  flash: "80px",
  nics: "80px",
  vendor: "120px",
  memoryUsage: "100px",
  // 디바이스/데몬 --------------------------------------------------------------
  deviceId: "100px",
  deviceName: "150px",
  devicePath: "150px",
  daemons: "160px",
  daemonName: "150px",
  daemonEvents: "100px",
  osd: "80px",
  osds: "160px",
  // ============================================================================
  // Network
  // ============================================================================
  // IP 주소 -------------------------------------------------------------------
  ip: "130px",
  fixedIp: "130px",
  fixedIP: "130px",
  floatingIp: "130px",
  ipAddress: "130px",
  vipAddress: "130px",
  gatewayIp: "130px",
  cidr: "130px",
  subnetCidr: "120px",
  mgmtIp: "130px",
  // 네트워크 ------------------------------------------------------------------
  network: "140px",
  networkName: "140px",
  ownedNetwork: "140px",
  ownedSubnet: "150px",
  external: "80px",
  allocationPools: "140px",
  portCount: "80px",
  // MAC/포트 ------------------------------------------------------------------
  macAddress: "150px",
  macPrimary: "150px",
  port: "70px",
  portRange: "100px",
  // 연결 대상 -----------------------------------------------------------------
  attachedTo: "160px",
  associatedTo: "160px",
  associatedResources: "160px",
  // 프로토콜/방향 --------------------------------------------------------------
  protocol: "90px",
  direction: "80px",
  etherType: "100px",
  remoteIpPrefix: "140px",
  networkBandwidth: "180px",
  internalNetworkBandwidth: "180px",
  // 라우터 --------------------------------------------------------------------
  externalGateway: "130px",
  externalFixedIp: "130px",
  externalNetwork: "150px",
  destination: "130px",
  nextHop: "130px",
  // 보안그룹 ------------------------------------------------------------------
  securityGroups: "150px",
  ingressRules: "100px",
  egressRules: "100px",
  remote: "130px",
  icmpTypeCode: "100px",
  // 인증서/도메인 --------------------------------------------------------------
  domain: "150px",
  issuer: "150px",
  // ============================================================================
  // LoadBalancer
  // ============================================================================
  // 상태 ----------------------------------------------------------------------
  adminState: "100px",
  adminStateUp: "100px",
  provisioningStatus: "120px",
  operatingStatus: "120px",
  // 구성요소 ------------------------------------------------------------------
  loadBalancer: "150px",
  listeners: "100px",
  listener: "120px",
  pools: "100px",
  members: "120px",
  memberCount: "120px",
  // 설정 ----------------------------------------------------------------------
  algorithm: "120px",
  weight: "80px",
  connectionLimit: "100px",
  backup: "80px",
  // L7 Policy -----------------------------------------------------------------
  behavior: "100px",
  position: "80px",
  compareType: "100px",
  invert: "80px",
  // ============================================================================
  // Storage
  // ============================================================================
  // 볼륨/스토리지 클래스 --------------------------------------------------------
  volume: "150px",
  sourceVolume: "150px",
  storageClass: "120px",
  volumeMode: "100px",
  volumeAttributesClass: "160px",
  persistentVolumeClaim: "180px",
  // 용량/접근 -----------------------------------------------------------------
  capacity: "100px",
  storageCapacity: "520px",
  usedCapacity: "120px",
  capacityLimit: "120px",
  accessModes: "120px",
  reclaimPolicy: "120px",
  // 프로비저너/소스 ------------------------------------------------------------
  provisioner: "150px",
  source: "100px",
  backupMode: "100px",
  default: "100px",
  isDefault: "80px",
  // Bucket/Object -------------------------------------------------------------
  objects: "80px",
  objectLimit: "100px",
  documents: "100px",
  grantee: "150px",
  permissions: "120px",
  // Ceph Storage --------------------------------------------------------------
  deviceClass: "100px",
  pgs: "80px",
  pgStatus: "100px",
  flags: "100px",
  usage: "100px",
  usagePercent: "100px",
  dataProtection: "120px",
  applications: "120px",
  crushRuleset: "120px",
  readOps: "100px",
  writeOps: "100px",
  // ============================================================================
  // Container (Kubernetes)
  // ============================================================================
  // 워크로드 상태 --------------------------------------------------------------
  desired: "80px",
  current: "80px",
  available: "80px",
  upToDate: "80px",
  replicas: "80px",
  restarts: "80px",
  pods: "80px",
  // 스케일링 (HPA) ------------------------------------------------------------
  workload: "150px",
  minReplicas: "100px",
  maxReplicas: "100px",
  currentReplicas: "120px",
  // 스케줄/잡 -----------------------------------------------------------------
  schedule: "120px",
  lastSchedule: "120px",
  suspend: "80px",
  completions: "100px",
  parallelism: "100px",
  // 컨테이너 ------------------------------------------------------------------
  containerImage: "150px",
  initContainer: "120px",
  namespace: "120px",
  // Selector ------------------------------------------------------------------
  selector: "200px",
  podSelector: "200px",
  namespaceSelector: "200px",
  // Ingress -------------------------------------------------------------------
  ingressClass: "120px",
  pathType: "300px",
  path: "300px",
  host: "300px",
  target: "300px",
  targetService: "150px",
  certificates: "150px",
  // PDB (PodDisruptionBudget) -------------------------------------------------
  minAvailable: "100px",
  maxUnavailable: "100px",
  disruptionsAllowed: "100px",
  allowedDisruption: "120px",
  currentHealthy: "100px",
  desiredHealthy: "100px",
  expectedPods: "100px",
  // ResourceQuota/LimitRange --------------------------------------------------
  request: "100px",
  limit: "100px",
  // 이벤트 --------------------------------------------------------------------
  reason: "120px",
  object: "120px",
  subobject: "100px",
  message: "240px",
  // Node ----------------------------------------------------------------------
  roles: "100px",
  os: "120px",
  cpuUsage: "100px",
  ramUsage: "100px",
  podsUsage: "100px",
  kubernetesVersion: "140px",
  // ============================================================================
  // IAM
  // ============================================================================
  // 사용자 --------------------------------------------------------------------
  user: "150px",
  username: "150px",
  users: "100px",
  userGroups: "150px",
  userGroupCount: "100px",
  // 인증/권한 -----------------------------------------------------------------
  policies: "150px",
  iamRoles: "150px",
  attachedRoles: "150px",
  scope: "100px",
  // 세션/디바이스 --------------------------------------------------------------
  device: "120px",
  // API Key -------------------------------------------------------------------
  keyId: "150px",
  // MFA -----------------------------------------------------------------------
  mfa: "80px",
  // 기타 ----------------------------------------------------------------------
  apps: "100px",
  // ============================================================================
  // Cloud Builder
  // ============================================================================
  // 서버/하드웨어 --------------------------------------------------------------
  serial: "120px",
  location: "100px",
  nicPrimaryName: "150px",
  frontierNet: "100px",
  observedHealth: "120px",
  provisionStatus: "120px",
  role: "100px",
  purpose: "120px",
  region: "100px",
  // pCPU 리소스 ---------------------------------------------------------------
  pcpuUsage: "100px",
  pcpusTotal: "100px",
  pcpusUsed: "100px",
  pcpusReserved: "100px",
  pcpusAllocationRatio: "140px",
  // vCPU 리소스 ---------------------------------------------------------------
  vcpuCore: "100px",
  vcpus: "80px",
  vcpusTotal: "100px",
  vcpusUsed: "100px",
  vcpusReserved: "100px",
  vcpusAllocationRatio: "140px",
  // RAM 리소스 ----------------------------------------------------------------
  ramTotal: "100px",
  ramUsed: "100px",
  ramReserved: "100px",
  ramAllocationRatio: "140px",
  configuredMemoryGiB: "140px",
  // Storage 리소스 ------------------------------------------------------------
  storageTotal: "120px",
  storageUsed: "120px",
  storageReserved: "120px",
  storageAllocationRatio: "140px",
  storageCapacityGiB: "140px",
  // GPU 리소스 ----------------------------------------------------------------
  gpuUsage: "100px",
  // 서비스 --------------------------------------------------------------------
  service: "120px",
  serviceState: "120px",
  serviceStatus: "120px",
  engineId: "320px",
  endpoints: "150px",
  backendName: "150px",
  rpName: "120px"
};
const columnWidths = {
  ...fixedColumns,
  ...columnMinWidths
};
export {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
  IconMenu22 as Action,
  IconCircle2 as Active,
  IconActivity as Activity,
  IconPlus2 as Add,
  IconRobotFace2 as AddRobot,
  IconSquarePlus2 as AddVolume,
  IconAffiliate as Affiliate,
  IconAlertTriangle2 as Alert,
  IconArticle2 as ArticleHistory,
  IconDeviceSdCard2 as Backup,
  Badge,
  BadgeList,
  IconBrain as Brain,
  IconGitBranch2 as Branch,
  Breadcrumb,
  IconBuilding as Building,
  Button,
  IconLayoutGrid2 as Card,
  CardTitle,
  IconCategory as Category,
  IconCertificate as Certificate,
  IconChartBar2 as Chart,
  IconMessage2 as Chat,
  IconMessageChatbot2 as Chatbot,
  IconCheck as Check,
  IconCircleCheck2 as CheckCircle,
  Checkbox,
  CheckboxGroup,
  IconChevronDown2 as ChevronDown,
  IconChevronLeft2 as ChevronLeft,
  IconChevronRight2 as ChevronRight,
  IconChevronUp2 as ChevronUp,
  Chip,
  IconX2 as CloseSmall,
  IconCloud2 as CloudComputing,
  IconTerminal22 as CodeConsole,
  ConfirmModal,
  IconTerminal3 as Console,
  Container,
  ContextMenu,
  IconCopy as Copy,
  CopyButton,
  Copyable,
  IconLayoutDashboard2 as Dashboards,
  DatePicker,
  DateRangePicker,
  IconCircleOff2 as Deactivated,
  IconTrash2 as Delete,
  IconTrashX2 as Deleting,
  DetailHeader,
  DetailHeaderActions,
  DetailHeaderInfoCard,
  DetailHeaderInfoGrid,
  DetailHeaderTitle,
  IconDeviceDesktopAnalytics as DeviceDesktopAnalytics,
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
  IconCurrencyDollar2 as DollarSign,
  DoneSection,
  DoneSectionRow,
  IconPoint2 as Dot,
  IconDownload as Download,
  Drawer,
  IconLayoutSidebarLeftCollapse2 as DrawerClose,
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownOption,
  DropdownRoot,
  DropdownSelect,
  IconPencil2 as Edit,
  EmptyState,
  IconAlertCircle2 as Error,
  ErrorState,
  IconAlertOctagon2 as ErrorWarning,
  ExpandableChecklist,
  IconExternalLink2 as ExternalLink,
  IconStar2 as FavoriteOff,
  IconStarFilled2 as FavoriteOn,
  IconFile as File,
  FileListCard,
  FileListSection,
  FilterSearchInput,
  IconAdjustments2 as Finetuning,
  IconCpu2 as Flavor,
  FloatingCard,
  IconWorldWww2 as FloatingIp,
  FormField,
  IconGridDots2 as Grid,
  HStack,
  IconDeviceFloppy2 as HardDrive,
  IconHelp as Help,
  IconEyeOff2 as Hide,
  IconHome as Home,
  IconServerCog2 as HostAggregates,
  IconHourglass2 as HourglassHigh,
  IconServer22 as Hypervisor,
  IconActive,
  IconActivity2 as IconActivity,
  IconAdd,
  IconAddRobot,
  IconAddRobotCustom,
  IconAddVolume,
  IconAdjustmentsAlt,
  IconAffiliate3 as IconAffiliate,
  IconAlert,
  IconArticlehistory,
  IconAttach,
  IconBackup,
  IconBrain2 as IconBrain,
  IconBranch,
  IconBuilding2 as IconBuilding,
  IconCahatbot,
  IconCard,
  IconCategory2 as IconCategory,
  IconCertificate3 as IconCertificate,
  IconChart,
  IconChat,
  IconCheck3 as IconCheck,
  IconCheckCircle,
  IconCheckcircle,
  IconChevrondown,
  IconChevronleft,
  IconChevronright,
  IconChevronup,
  IconClosesmall,
  IconCloudComputing,
  IconCloudcomputing,
  IconCodeConsole,
  IconCopy2 as IconCopy,
  IconDashboards,
  IconDeactivated,
  IconDelete,
  IconDeleting,
  IconDeviceDesktopAnalytics2 as IconDeviceDesktopAnalytics,
  IconDollarSign,
  IconDot,
  IconDownload2 as IconDownload,
  IconDrawerClose,
  IconEdit,
  IconError,
  IconErrorWarning,
  IconExpandOff,
  IconExpandOn,
  IconExternallink,
  IconFavoriteOn,
  IconFavoriteoff,
  IconFile3 as IconFile,
  IconFinetuning,
  IconFlavor,
  IconFloatingIp,
  IconGrid,
  IconHardDrive,
  IconHelp2 as IconHelp,
  IconHide,
  IconHistory,
  IconHome2 as IconHome,
  IconHostAggregates,
  IconHourglassHigh,
  IconHypervisor,
  IconImages,
  IconInfo,
  IconInstances,
  IconInuse,
  IconKey3 as IconKey,
  IconKeypairs,
  IconLanguage3 as IconLanguage,
  IconLayers,
  IconLink2 as IconLink,
  IconList2 as IconList,
  IconLoadBalancer,
  IconLoadbalancer,
  IconLock2 as IconLock,
  IconMaintenance,
  IconMicrosoft,
  IconMoreKebab,
  IconMoreMeatball,
  IconMorekebab,
  IconNetwork3 as IconNetwork,
  IconNetworks,
  IconNewchat,
  IconNewtab,
  IconNotification,
  IconNotificationnew,
  IconOrder,
  IconOther,
  IconPaused,
  IconPending,
  IconPlay,
  IconPlugin,
  IconPlusCircle,
  IconPorts,
  IconPorts2,
  IconProgress3 as IconProgress,
  IconPublish,
  IconPuzzle3 as IconPuzzle,
  IconReboot,
  IconRefresh2 as IconRefresh,
  IconRequest,
  IconReset,
  IconReset1,
  IconReset2,
  IconRetry,
  IconRobotCustom,
  IconRocky,
  IconRouterArrows,
  IconRouters,
  IconRouters1,
  IconSchedule,
  IconSearch2 as IconSearch,
  IconSecurity,
  IconSecurityError,
  IconSecurityGroup,
  IconSecurityerror,
  IconServer3 as IconServer,
  IconSetting,
  IconShare2 as IconShare,
  IconShelved,
  IconShow,
  IconSidebar,
  IconSnapshot,
  IconSpeed,
  IconStop,
  IconStorage,
  IconStudy,
  IconSuspended,
  IconTemplate2 as IconTemplate,
  IconTopology,
  IconTransfer3 as IconTransfer,
  IconUbuntu,
  IconUnlink,
  IconUpload2 as IconUpload,
  IconUserCircle2 as IconUserCircle,
  IconVerify,
  IconVolumeSearch,
  IconVolumeType,
  IconWarning,
  IconWindowActive,
  IconWindowMinimized,
  IconZap,
  Icons,
  IconPhoto2 as Images,
  IconInfoCircle2 as Info,
  InfoBox,
  InlineMessage,
  Input,
  IconCube2 as Instances,
  IconPlugConnected2 as Inuse,
  IconKey as Key,
  IconKey2 as KeyPairs,
  IconLanguage as Language,
  IconStack22 as Layers,
  IconLink as Link,
  IconList as List,
  ListToolbar,
  ListToolbarActions,
  ListToolbarDivider,
  ListToolbarFilters,
  IconScale2 as LoadBalancer,
  Loading,
  IconLock as Lock,
  IconTool2 as Maintenance,
  MenuDivider,
  MenuItem,
  MenuSection,
  IconBrandWindows2 as Microsoft,
  Modal,
  MonitoringToolbar,
  IconDotsVertical2 as MoreKebab,
  IconDots2 as MoreMeatball,
  IconNetwork as Network,
  IconNetwork2 as Networks,
  IconMessagePlus2 as NewChat,
  IconExternalLink3 as NewTab,
  IconBell2 as Notification,
  NotificationCenter,
  IconBellRinging2 as NotificationNew,
  NumberInput,
  IconArrowsSort2 as Order,
  IconQuestionMark2 as Other,
  PageHeader,
  PageShell,
  Pagination,
  Password,
  IconPlayerPause2 as Paused,
  IconProgress as Pending,
  IconPlayerPlay2 as Play,
  IconPlug2 as Plugin,
  IconCirclePlus2 as PlusCircle,
  Popover,
  IconPlug3 as Ports,
  PreSection,
  IconProgress2 as Progress,
  ProgressBar$1 as ProgressBar,
  IconSend2 as Publish,
  IconPuzzle as Puzzle,
  Radio,
  RadioGroup,
  RangeSlider,
  IconRefreshDot2 as Reboot,
  IconRefresh as Refresh,
  IconHelpCircle2 as Request,
  ResourceCard,
  IconRotateClockwise2 as Retry,
  IconRobot as Robot,
  IconCircleDot2 as Rocky,
  IconRouter2 as Routers,
  SNBMenuItem,
  STATUS_THRESHOLDS,
  SUPPORTED_LANGUAGES,
  IconClock2 as Schedule,
  IconSearch as Search,
  SearchInput,
  SectionCard,
  SectionCardContent,
  SectionCardDataRow,
  SectionCardHeader,
  IconShield2 as Security,
  IconShieldX2 as SecurityError,
  IconShieldLock2 as SecurityGroup,
  Select,
  SelectionIndicator,
  IconServer as Server,
  IconSettings2 as Setting,
  IconShare as Share,
  IconArchive2 as Shelved,
  IconEye2 as Show,
  IconLayoutSidebar2 as Sidebar,
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonTable,
  SkeletonText,
  SkippedSection,
  Slider,
  IconCamera2 as Snapshot,
  IconGauge2 as Speed,
  Stack,
  StatusIndicator,
  IconPlayerStop2 as Stop,
  IconDatabase2 as Storage,
  IconBook2 as Study,
  IconBan2 as Suspended,
  Tab,
  TabBar,
  TabList,
  TabPanel,
  Table,
  TableLink,
  Tabs,
  Tag,
  TagGroup,
  IconTemplate as Template,
  IconCircleX2 as Terminate,
  IconTestPipe2 as Test,
  Textarea,
  Toast,
  ToastContainer,
  ToastProvider,
  Toggle,
  Tooltip,
  TopBar,
  TopBarAction,
  IconTopologyStar32 as Topology,
  IconTopologyStar33 as TopologyStar3,
  IconTransfer as Transfer,
  IconBrandUbuntu2 as Ubuntu,
  IconLinkOff2 as Unlink,
  IconUpload as Upload,
  IconUserCircle as UserCircle,
  VStack,
  IconShieldCheck2 as Verify,
  IconDatabaseSearch2 as VolumeSearch,
  IconBoxMultiple2 as VolumeType,
  IconAlertTriangle3 as Warning,
  WindowControl,
  WindowControls,
  WizardSection,
  WizardSectionStatusIcon,
  WizardSummary,
  WritingSection,
  YamlEditor,
  IconBolt2 as Zap,
  badge,
  button,
  buttonVariants,
  changeLanguage,
  cn,
  colors,
  columnMinWidths,
  columnWidths,
  component,
  fixedColumns,
  getCurrentLanguage,
  instance as i18n,
  input,
  isRTL,
  menu,
  primitive,
  radius,
  semantic,
  shadows,
  spacing,
  transitions,
  typography,
  useCheckboxGroup,
  useClickOutside,
  useColumnResize,
  useControllable,
  useFocusTrap,
  useLocale,
  useRadioGroup,
  useStableId,
  useTabBar,
  useToast,
  zIndex
};
//# sourceMappingURL=tds.mjs.map
