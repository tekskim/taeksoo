import{j as e,r as Y}from"./iframe-B4qQhCO6.js";import{t as S}from"./bundle-mjs-BZSatpsL.js";import{L as Z,B as ee}from"./chunk-JZWAC4HX-DCwoNyDI.js";import{V as N}from"./Stack-Dcn3-Ul-.js";import{I as ae}from"./IconChevronDown-BLmatsEi.js";import{I as se}from"./IconChevronRight-C94sRJtJ.js";import{I as h}from"./IconHome-DRMATGjl.js";import{I}from"./IconFolder-C2Xb41VP.js";import{I as k}from"./IconSettings-fLTpAmkf.js";import{I as re}from"./IconFile-C0bRipFT.js";import{I as te}from"./IconUser-vUAZ43pM.js";import{I as oe}from"./IconTrash-CtbT213v.js";import{c as ne}from"./createReactComponent-Bds5dDb0.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]],le=ne("outline","logout","Logout",ie);function a({icon:s,label:n,href:l,active:t=!1,badge:i,onClick:o,disabled:r=!1}){const c=["w-[175px]","px-[var(--menu-item-padding-x)]","py-[var(--menu-item-padding-y)]","rounded-[var(--menu-item-radius)]","flex items-center","gap-[var(--menu-item-gap)]","text-body-sm","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"].join(" "),M=t?"bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium":r?"text-[var(--color-text-disabled)] cursor-not-allowed":"text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] font-normal",y=e.jsxs(e.Fragment,{children:[s&&e.jsx("span",{className:`shrink-0 ${t?"text-[var(--color-action-primary)]":"text-[var(--color-text-default)]"}`,children:s}),e.jsx("span",{className:"text-left truncate",children:n}),i&&e.jsx("span",{className:"px-1.5 py-0.5 text-body-xs font-medium bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] rounded",children:i})]});return l?e.jsx(Z,{to:l,onClick:r?X=>X.preventDefault():o,className:S(c,M),"aria-current":t?"page":void 0,"aria-disabled":r,children:y}):e.jsx("button",{type:"button",onClick:r?void 0:o,className:S(c,M),"aria-disabled":r,children:y})}a.__docgenInfo={description:"",methods:[],displayName:"MenuItem",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"Menu icon"},label:{required:!0,tsType:{name:"string"},description:"Menu label"},href:{required:!1,tsType:{name:"string"},description:"Link URL"},active:{required:!1,tsType:{name:"boolean"},description:"Active state",defaultValue:{value:"false",computed:!1}},badge:{required:!1,tsType:{name:"string"},description:"Badge text (New, Beta, etc.)"},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}}}};function j({title:s,children:n,defaultOpen:l=!0,collapsible:t=!0,onTitleClick:i}){const[o,r]=Y.useState(l),c=()=>{t&&r(!o),i&&i()};return e.jsxs(N,{gap:1.5,className:"w-[175px]",children:[t?e.jsxs("button",{onClick:c,className:"flex items-center gap-1 w-[175px] group focus:outline-none px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)]",children:s}),o?e.jsx(ae,{size:12,className:"text-[var(--color-text-disabled)]",stroke:1}):e.jsx(se,{size:12,className:"text-[var(--color-text-disabled)]",stroke:1})]}):e.jsx("span",{className:"w-[175px] text-label-sm text-[var(--color-text-subtle)] px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]",children:s}),o&&e.jsx(N,{gap:0,className:"w-[175px]",children:n})]})}j.__docgenInfo={description:"",methods:[],displayName:"MenuSection",props:{title:{required:!0,tsType:{name:"string"},description:"Section title"},children:{required:!0,tsType:{name:"ReactNode"},description:"Menu items"},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"Default open state",defaultValue:{value:"true",computed:!1}},collapsible:{required:!1,tsType:{name:"boolean"},description:"Collapsible",defaultValue:{value:"true",computed:!1}},onTitleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler for title"}}};function v({spacing:s="md"}){const n={sm:"my-1",md:"my-[var(--menu-divider-margin)]",lg:"my-3"};return e.jsx("div",{className:`w-full h-px bg-[var(--color-border-default)] ${n[s]}`})}v.__docgenInfo={description:"",methods:[],displayName:"MenuDivider",props:{spacing:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Vertical spacing",defaultValue:{value:"'md'",computed:!1}}}};const Me={title:"Components/Menu",component:a,tags:["autodocs"],decorators:[s=>e.jsx(ee,{children:e.jsx("div",{className:"bg-[var(--color-surface-default)] p-4 rounded-lg border border-[var(--color-border-default)] w-fit",children:e.jsx(s,{})})})],parameters:{docs:{description:{component:`
## Menu 컴포넌트

사이드바 또는 드롭다운에서 사용하는 메뉴 아이템 컴포넌트입니다.

### 구성 요소
- **MenuItem**: 개별 메뉴 항목
- **MenuSection**: 메뉴 섹션 (제목 포함)
- **MenuDivider**: 구분선

### MenuItem Props
- **icon**: 왼쪽 아이콘
- **label**: 메뉴 텍스트
- **href**: 링크 URL (react-router Link 사용)
- **active**: 현재 선택 상태
- **badge**: 뱃지 텍스트 (New, Beta 등)
- **disabled**: 비활성화 상태

### 사용 시기
- 사이드바 네비게이션
- 컨텍스트 메뉴
- 드롭다운 메뉴

### 예시
\`\`\`tsx
<MenuItem
  icon={<IconHome size={14} />}
  label="Dashboard"
  href="/dashboard"
  active={true}
/>
\`\`\`
        `}}},argTypes:{active:{control:"boolean",description:"활성 상태",table:{defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}},badge:{control:"text",description:"뱃지 텍스트"}}},d={args:{icon:e.jsx(h,{size:14,stroke:1.5}),label:"Dashboard",href:"/dashboard"}},u={args:{icon:e.jsx(h,{size:14,stroke:1.5}),label:"Dashboard",href:"/dashboard",active:!0}},m={args:{icon:e.jsx(k,{size:14,stroke:1.5}),label:"Settings",disabled:!0}},p={args:{icon:e.jsx(I,{size:14,stroke:1.5}),label:"New Feature",badge:"New"}},f={args:{label:"Simple Menu Item"}},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(a,{icon:e.jsx(h,{size:14,stroke:1.5}),label:"Default"}),e.jsx(a,{icon:e.jsx(I,{size:14,stroke:1.5}),label:"Active",active:!0}),e.jsx(a,{icon:e.jsx(k,{size:14,stroke:1.5}),label:"Disabled",disabled:!0}),e.jsx(a,{icon:e.jsx(re,{size:14,stroke:1.5}),label:"With Badge",badge:"Beta"})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-1 w-[200px]",children:[e.jsx(j,{label:"Main"}),e.jsx(a,{icon:e.jsx(h,{size:14,stroke:1.5}),label:"Dashboard",href:"/dashboard",active:!0}),e.jsx(a,{icon:e.jsx(te,{size:14,stroke:1.5}),label:"Profile",href:"/profile"}),e.jsx(a,{icon:e.jsx(I,{size:14,stroke:1.5}),label:"Projects",href:"/projects",badge:"12"}),e.jsx(v,{}),e.jsx(j,{label:"Settings"}),e.jsx(a,{icon:e.jsx(k,{size:14,stroke:1.5}),label:"Preferences",href:"/settings"}),e.jsx(a,{icon:e.jsx(oe,{size:14,stroke:1.5}),label:"Trash",href:"/trash"}),e.jsx(v,{}),e.jsx(a,{icon:e.jsx(le,{size:14,stroke:1.5}),label:"Logout",onClick:()=>console.log("Logout")})]})},g={render:()=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx(a,{label:"Cut",onClick:()=>{}}),e.jsx(a,{label:"Copy",onClick:()=>{}}),e.jsx(a,{label:"Paste",onClick:()=>{}}),e.jsx(v,{}),e.jsx(a,{label:"Delete",onClick:()=>{}})]})};var z,C,D;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={14} stroke={1.5} />,
    label: 'Dashboard',
    href: '/dashboard'
  }
}`,...(D=(C=d.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var w,T,q;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={14} stroke={1.5} />,
    label: 'Dashboard',
    href: '/dashboard',
    active: true
  }
}`,...(q=(T=u.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var L,B,V;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    icon: <IconSettings size={14} stroke={1.5} />,
    label: 'Settings',
    disabled: true
  }
}`,...(V=(B=m.parameters)==null?void 0:B.docs)==null?void 0:V.source}}};var _,F,P;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    icon: <IconFolder size={14} stroke={1.5} />,
    label: 'New Feature',
    badge: 'New'
  }
}`,...(P=(F=p.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var R,A,H;f.parameters={...f.parameters,docs:{...(R=f.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: 'Simple Menu Item'
  }
}`,...(H=(A=f.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var W,O,U;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-1">
      <MenuItem icon={<IconHome size={14} stroke={1.5} />} label="Default" />
      <MenuItem icon={<IconFolder size={14} stroke={1.5} />} label="Active" active />
      <MenuItem icon={<IconSettings size={14} stroke={1.5} />} label="Disabled" disabled />
      <MenuItem icon={<IconFile size={14} stroke={1.5} />} label="With Badge" badge="Beta" />
    </div>
}`,...(U=(O=b.parameters)==null?void 0:O.docs)==null?void 0:U.source}}};var E,$,G;x.parameters={...x.parameters,docs:{...(E=x.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-1 w-[200px]">
      <MenuSection label="Main" />
      <MenuItem icon={<IconHome size={14} stroke={1.5} />} label="Dashboard" href="/dashboard" active />
      <MenuItem icon={<IconUser size={14} stroke={1.5} />} label="Profile" href="/profile" />
      <MenuItem icon={<IconFolder size={14} stroke={1.5} />} label="Projects" href="/projects" badge="12" />

      <MenuDivider />

      <MenuSection label="Settings" />
      <MenuItem icon={<IconSettings size={14} stroke={1.5} />} label="Preferences" href="/settings" />
      <MenuItem icon={<IconTrash size={14} stroke={1.5} />} label="Trash" href="/trash" />

      <MenuDivider />

      <MenuItem icon={<IconLogout size={14} stroke={1.5} />} label="Logout" onClick={() => console.log('Logout')} />
    </div>
}`,...(G=($=x.parameters)==null?void 0:$.docs)==null?void 0:G.source}}};var J,K,Q;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col">
      <MenuItem label="Cut" onClick={() => {}} />
      <MenuItem label="Copy" onClick={() => {}} />
      <MenuItem label="Paste" onClick={() => {}} />
      <MenuDivider />
      <MenuItem label="Delete" onClick={() => {}} />
    </div>
}`,...(Q=(K=g.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const ye=["Default","Active","Disabled","WithBadge","WithoutIcon","AllStates","SidebarMenu","CompactMenu"];export{u as Active,b as AllStates,g as CompactMenu,d as Default,m as Disabled,x as SidebarMenu,p as WithBadge,f as WithoutIcon,ye as __namedExportsOrder,Me as default};
