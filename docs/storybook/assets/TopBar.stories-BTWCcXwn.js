import{j as e}from"./iframe-DF19JO67.js";import{I as K}from"./IconLayoutSidebar-BEpdoyMn.js";import{c as P}from"./createReactComponent-D4u5JA0x.js";import{I as E}from"./IconSearch-D65cydC5.js";import{I as v}from"./IconBell-D8w3J-wN.js";import{I as x}from"./IconSettings-C_91fDSk.js";import{B as o}from"./Breadcrumb-BoWCrKTt.js";import{I as L}from"./IconUser-DiFUCH-V.js";import{B as Q}from"./chunk-JZWAC4HX-C__CjWZ5.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./IconChevronRight-_oIFrOM0.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M5 12l6 6",key:"svg-1"}],["path",{d:"M5 12l6 -6",key:"svg-2"}]],Y=P("outline","arrow-left","ArrowLeft",X);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M13 18l6 -6",key:"svg-1"}],["path",{d:"M13 6l6 6",key:"svg-2"}]],ee=P("outline","arrow-right","ArrowRight",Z),r=({onSidebarToggle:t,onBack:b,onForward:m,canGoBack:p=!0,canGoForward:g=!0,breadcrumb:f,actions:U,showSidebarToggle:$=!1,showSidebarToggleAfterBreadcrumb:H=!1,showNavigation:O=!0,className:J=""})=>{const h=`
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
        ${J}
      `,children:[e.jsxs("div",{className:"flex items-center gap-[var(--topbar-section-gap)]",children:[($||H)&&e.jsx("button",{type:"button",onClick:t,className:h,"aria-label":"Toggle sidebar",children:e.jsx(K,{size:16,stroke:1.5})}),O&&e.jsxs("div",{className:"flex items-center gap-[var(--topbar-nav-gap)]",children:[e.jsx("button",{type:"button",onClick:b,disabled:!p,className:h,"aria-label":"Go back",children:e.jsx(Y,{size:12,stroke:1.5})}),e.jsx("button",{type:"button",onClick:m,disabled:!g,className:h,"aria-label":"Go forward",children:e.jsx(ee,{size:12,stroke:1.5})})]})]}),e.jsx("div",{className:"flex-1 min-w-0 flex items-center gap-[var(--topbar-section-gap)]",children:f}),e.jsx("div",{className:"flex items-center gap-[var(--topbar-action-gap)]",children:U})]})},a=({icon:t,onClick:b,"aria-label":m,disabled:p=!1,badge:g=!1,className:f=""})=>e.jsxs("button",{type:"button",onClick:b,disabled:p,className:`
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
        ${f}
      `,"aria-label":m,children:[t,g&&e.jsx("span",{className:`
            absolute
            top-1 right-1
            size-[6px]
            bg-[var(--color-state-danger)]
            rounded-full
          `})]});r.__docgenInfo={description:"",methods:[],displayName:"TopBar",props:{onSidebarToggle:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when sidebar toggle is clicked"},onBack:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when back button is clicked"},onForward:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when forward button is clicked"},canGoBack:{required:!1,tsType:{name:"boolean"},description:"Whether back button is disabled",defaultValue:{value:"true",computed:!1}},canGoForward:{required:!1,tsType:{name:"boolean"},description:"Whether forward button is disabled",defaultValue:{value:"true",computed:!1}},breadcrumb:{required:!1,tsType:{name:"ReactNode"},description:"Breadcrumb content (use Breadcrumb component)"},actions:{required:!1,tsType:{name:"ReactNode"},description:"Right side actions (icons, buttons)"},showSidebarToggle:{required:!1,tsType:{name:"boolean"},description:"Show sidebar toggle button on the left",defaultValue:{value:"false",computed:!1}},showSidebarToggleAfterBreadcrumb:{required:!1,tsType:{name:"boolean"},description:"Show sidebar toggle button after breadcrumbs",defaultValue:{value:"false",computed:!1}},showNavigation:{required:!1,tsType:{name:"boolean"},description:"Show navigation buttons",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};a.__docgenInfo={description:"",methods:[],displayName:"TopBarAction",props:{icon:{required:!0,tsType:{name:"ReactNode"},description:"Icon to display"},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},"aria-label":{required:!0,tsType:{name:"string"},description:"Aria label for accessibility"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},badge:{required:!1,tsType:{name:"boolean"},description:"Show notification indicator (red dot)",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const me={title:"Components/TopBar",component:r,tags:["autodocs"],decorators:[t=>e.jsx(Q,{children:e.jsx(t,{})})],parameters:{docs:{description:{component:`
## TopBar 컴포넌트

애플리케이션 상단 네비게이션 바 컴포넌트입니다.

### 구성 요소
- **사이드바 토글**: 좌측 사이드바 열기/닫기
- **네비게이션**: 뒤로가기/앞으로가기 버튼
- **Breadcrumb**: 현재 위치 표시
- **액션**: 우측 액션 버튼들

### TopBarAction
일관된 스타일의 액션 버튼 컴포넌트입니다.
- 알림 뱃지 지원
- 접근성 레이블 필수

### 사용 시기
- 메인 애플리케이션 헤더
- 대시보드 상단 네비게이션
- IDE 스타일 레이아웃

### 예시
\`\`\`tsx
<TopBar
  onSidebarToggle={() => {}}
  breadcrumb={<Breadcrumb items={[...]} />}
  actions={
    <>
      <TopBarAction icon={<IconBell />} aria-label="Notifications" badge />
      <TopBarAction icon={<IconSettings />} aria-label="Settings" />
    </>
  }
/>
\`\`\`
        `}}},argTypes:{showSidebarToggle:{control:"boolean",description:"사이드바 토글 버튼 표시",table:{defaultValue:{summary:"false"}}},showNavigation:{control:"boolean",description:"네비게이션 버튼 표시",table:{defaultValue:{summary:"true"}}},canGoBack:{control:"boolean",description:"뒤로가기 활성화",table:{defaultValue:{summary:"true"}}},canGoForward:{control:"boolean",description:"앞으로가기 활성화",table:{defaultValue:{summary:"true"}}}}},s={render:()=>e.jsx(r,{breadcrumb:e.jsx(o,{items:[{label:"Compute",href:"/compute"},{label:"Instances",href:"/compute/instances"},{label:"web-server-01"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(E,{size:16}),"aria-label":"Search"}),e.jsx(a,{icon:e.jsx(v,{size:16}),"aria-label":"Notifications"}),e.jsx(a,{icon:e.jsx(x,{size:16}),"aria-label":"Settings"})]})})},i={render:()=>e.jsx(r,{showSidebarToggle:!0,onSidebarToggle:()=>console.log("Toggle sidebar"),breadcrumb:e.jsx(o,{items:[{label:"Container",href:"/container"},{label:"Deployments"}]}),actions:e.jsx(a,{icon:e.jsx(L,{size:16}),"aria-label":"Profile"})})},n={render:()=>e.jsx(r,{breadcrumb:e.jsx(o,{items:[{label:"Dashboard"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(v,{size:16}),"aria-label":"Notifications",badge:!0}),e.jsx(a,{icon:e.jsx(x,{size:16}),"aria-label":"Settings"})]})})},l={render:()=>e.jsx(r,{showNavigation:!1,breadcrumb:e.jsx(o,{items:[{label:"Settings",href:"/settings"},{label:"Account"}]})})},c={render:()=>e.jsx(r,{canGoBack:!1,canGoForward:!1,breadcrumb:e.jsx(o,{items:[{label:"Home"}]})})},d={render:()=>e.jsx(r,{showNavigation:!1,breadcrumb:e.jsx(o,{items:[{label:"Simple Page"}]})})},u={render:()=>e.jsx(r,{showSidebarToggle:!0,onSidebarToggle:()=>console.log("Toggle"),onBack:()=>console.log("Back"),onForward:()=>console.log("Forward"),canGoBack:!0,canGoForward:!1,breadcrumb:e.jsx(o,{items:[{label:"Storage",href:"/storage"},{label:"Buckets",href:"/storage/buckets"},{label:"my-bucket",href:"/storage/buckets/my-bucket"},{label:"files"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(E,{size:16}),"aria-label":"Search"}),e.jsx(a,{icon:e.jsx(v,{size:16}),"aria-label":"Notifications",badge:!0}),e.jsx(a,{icon:e.jsx(x,{size:16}),"aria-label":"Settings"}),e.jsx(a,{icon:e.jsx(L,{size:16}),"aria-label":"Profile"})]})})};var T,B,j;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <TopBar breadcrumb={<Breadcrumb items={[{
    label: 'Compute',
    href: '/compute'
  }, {
    label: 'Instances',
    href: '/compute/instances'
  }, {
    label: 'web-server-01'
  }]} />} actions={<>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>} />
}`,...(j=(B=s.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var S,w,y;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <TopBar showSidebarToggle onSidebarToggle={() => console.log('Toggle sidebar')} breadcrumb={<Breadcrumb items={[{
    label: 'Container',
    href: '/container'
  }, {
    label: 'Deployments'
  }]} />} actions={<TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />} />
}`,...(y=(w=i.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var k,N,I;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <TopBar breadcrumb={<Breadcrumb items={[{
    label: 'Dashboard'
  }]} />} actions={<>
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>} />
}`,...(I=(N=n.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var z,A,F;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <TopBar showNavigation={false} breadcrumb={<Breadcrumb items={[{
    label: 'Settings',
    href: '/settings'
  }, {
    label: 'Account'
  }]} />} />
}`,...(F=(A=l.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var q,C,G;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <TopBar canGoBack={false} canGoForward={false} breadcrumb={<Breadcrumb items={[{
    label: 'Home'
  }]} />} />
}`,...(G=(C=c.parameters)==null?void 0:C.docs)==null?void 0:G.source}}};var V,D,_;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <TopBar showNavigation={false} breadcrumb={<Breadcrumb items={[{
    label: 'Simple Page'
  }]} />} />
}`,...(_=(D=d.parameters)==null?void 0:D.docs)==null?void 0:_.source}}};var R,M,W;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <TopBar showSidebarToggle onSidebarToggle={() => console.log('Toggle')} onBack={() => console.log('Back')} onForward={() => console.log('Forward')} canGoBack={true} canGoForward={false} breadcrumb={<Breadcrumb items={[{
    label: 'Storage',
    href: '/storage'
  }, {
    label: 'Buckets',
    href: '/storage/buckets'
  }, {
    label: 'my-bucket',
    href: '/storage/buckets/my-bucket'
  }, {
    label: 'files'
  }]} />} actions={<>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
          <TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />
        </>} />
}`,...(W=(M=u.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};const pe=["Default","WithSidebarToggle","WithNotificationBadge","WithoutNavigation","DisabledNavigation","Minimal","FullFeatured"];export{s as Default,c as DisabledNavigation,u as FullFeatured,d as Minimal,n as WithNotificationBadge,i as WithSidebarToggle,l as WithoutNavigation,pe as __namedExportsOrder,me as default};
