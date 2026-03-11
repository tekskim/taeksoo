import{j as e}from"./iframe-IHmg4wqj.js";import{I as f}from"./IconLayoutSidebar-CHEek_Yj.js";import{c as l}from"./createReactComponent-BhwuFqFO.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M5 12l6 6",key:"svg-1"}],["path",{d:"M5 12l6 -6",key:"svg-2"}]],v=l("outline","arrow-left","ArrowLeft",m);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M13 18l6 -6",key:"svg-1"}],["path",{d:"M13 6l6 6",key:"svg-2"}]],h=l("outline","arrow-right","ArrowRight",g),x=({onSidebarToggle:a,onBack:t,onForward:r,canGoBack:o=!0,canGoForward:s=!0,breadcrumb:i,actions:d,showSidebarToggle:c=!1,showSidebarToggleAfterBreadcrumb:u=!1,showNavigation:b=!0,className:p=""})=>{const n=`
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
  `;return e.jsxs("header",{className:`
        flex items-center
        w-full
        h-[var(--topbar-height)]
        px-[var(--topbar-padding-x)]
        gap-[var(--topbar-gap)]
        bg-[var(--color-surface-default)]
        border-b border-[var(--color-border-default)]
        ${p}
      `,children:[e.jsxs("div",{className:"flex items-center gap-[var(--topbar-section-gap)]",children:[(c||u)&&e.jsx("button",{type:"button",onClick:a,className:n,"aria-label":"Toggle sidebar",children:e.jsx(f,{size:14,stroke:1.5})}),b&&e.jsxs("div",{className:"flex items-center gap-[var(--topbar-nav-gap)]",children:[e.jsx("button",{type:"button",onClick:t,disabled:!o,className:n,"aria-label":"Go back",children:e.jsx(v,{size:12,stroke:1.5})}),e.jsx("button",{type:"button",onClick:r,disabled:!s,className:n,"aria-label":"Go forward",children:e.jsx(h,{size:12,stroke:1.5})})]})]}),e.jsx("div",{className:"flex-1 min-w-0 flex items-center gap-[var(--topbar-section-gap)]",children:i}),e.jsx("div",{className:"flex items-center gap-[var(--topbar-action-gap)]",children:d})]})},y=({icon:a,onClick:t,"aria-label":r,disabled:o=!1,badge:s=!1,className:i=""})=>e.jsxs("button",{type:"button",onClick:t,disabled:o,className:`
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
        ${i}
      `,"aria-label":r,children:[a,s&&e.jsx("span",{className:`
            absolute
            top-1 right-1
            size-[6px]
            bg-[var(--color-state-danger)]
            rounded-full
          `})]});x.__docgenInfo={description:"",methods:[],displayName:"TopBar",props:{onSidebarToggle:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when sidebar toggle is clicked"},onBack:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when back button is clicked"},onForward:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when forward button is clicked"},canGoBack:{required:!1,tsType:{name:"boolean"},description:"Whether back button is disabled",defaultValue:{value:"true",computed:!1}},canGoForward:{required:!1,tsType:{name:"boolean"},description:"Whether forward button is disabled",defaultValue:{value:"true",computed:!1}},breadcrumb:{required:!1,tsType:{name:"ReactNode"},description:"Breadcrumb content (use Breadcrumb component)"},actions:{required:!1,tsType:{name:"ReactNode"},description:"Right side actions (icons, buttons)"},showSidebarToggle:{required:!1,tsType:{name:"boolean"},description:"Show sidebar toggle button on the left",defaultValue:{value:"false",computed:!1}},showSidebarToggleAfterBreadcrumb:{required:!1,tsType:{name:"boolean"},description:"Show sidebar toggle button after breadcrumbs",defaultValue:{value:"false",computed:!1}},showNavigation:{required:!1,tsType:{name:"boolean"},description:"Show navigation buttons",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};y.__docgenInfo={description:"",methods:[],displayName:"TopBarAction",props:{icon:{required:!0,tsType:{name:"ReactNode"},description:"Icon to display"},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},"aria-label":{required:!0,tsType:{name:"string"},description:"Aria label for accessibility"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},badge:{required:!1,tsType:{name:"boolean"},description:"Show notification indicator (red dot)",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{x as T,y as a};
