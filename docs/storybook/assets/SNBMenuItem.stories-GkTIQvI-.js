import{r as ce,j as e,R as r}from"./iframe-DKmDJy9M.js";import{I as s}from"./IconHome-DavmMruy.js";import{c as K}from"./createReactComponent-DB1W9lnY.js";import{I as le}from"./IconCloud-QoGrAsGB.js";import{I as ie}from"./IconFolder-D_s2G0G1.js";import{I as P}from"./IconSettings-WI1EblWW.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["path",{d:"M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0",key:"svg-0"}],["path",{d:"M4 6v6a8 3 0 0 0 16 0v-6",key:"svg-1"}],["path",{d:"M4 12v6a8 3 0 0 0 16 0v-6",key:"svg-2"}]],Q=K("outline","database","Database",de);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3",key:"svg-0"}],["path",{d:"M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2",key:"svg-1"}],["path",{d:"M7 8l0 .01",key:"svg-2"}],["path",{d:"M7 16l0 .01",key:"svg-3"}]],U=K("outline","server","Server",ue);function t({status:X,type:v="icon",icon:o,text:Y,iconSize:me=22,onClick:Z,className:ee="",isSelected:te=!1,children:g}){const[se,S]=ce.useState(!1),a=X||(te?"selected":se?"hover":"default"),oe={default:"bg-[var(--color-surface-default)]",hover:"bg-[var(--color-surface-subtle)]",selected:"bg-[var(--color-info-weak-bg,#eff6ff)]"},k={default:"text-[var(--color-text-muted)]",hover:"text-[var(--color-text-default)]",selected:"text-[var(--color-action-primary)]"},re={default:"text-[var(--color-text-muted)]",hover:"text-[var(--color-text-default)]",selected:"text-[var(--color-action-primary)]"},ae=`
    flex flex-col gap-0.5 items-center justify-center
    px-2 py-1.5
    rounded-lg
    size-[38px]
    transition-colors
    cursor-pointer
  `,ne=()=>g?r.Children.map(g,n=>r.isValidElement(n)?r.cloneElement(n,{className:`${n.props.className||""} ${k[a]}`.trim()}):n):o?r.isValidElement(o)?r.cloneElement(o,{className:`${o.props.className||""} ${k[a]}`.trim()}):o:null;return e.jsxs("button",{className:`${ae} ${oe[a]} ${ee}`,onClick:Z,onMouseEnter:()=>S(!0),onMouseLeave:()=>S(!1),children:[v==="icon"&&ne(),v==="text"&&e.jsx("span",{className:`font-semibold text-[length:var(--font-size-18)] leading-[length:var(--line-height-28)] ${re[a]}`,children:Y})]})}t.__docgenInfo={description:`SNBMenuItem - Side Navigation Bar Menu Item

A menu item component for the narrow side navigation bar.
Supports default, hover, and selected states with appropriate styling.

Design tokens used:
- default: bg-white, icon: #64748b (text-muted)
- hover: bg-[#f8fafc] (surface-subtle), icon: #334155 (text-default)
- selected: bg-[#eff6ff] (info-weak-bg), icon: #2563eb (primary)`,methods:[],displayName:"SNBMenuItem",props:{status:{required:!1,tsType:{name:"union",raw:"'default' | 'hover' | 'selected'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'hover'"},{name:"literal",value:"'selected'"}]},description:"Status of the menu item"},type:{required:!1,tsType:{name:"union",raw:"'icon' | 'text'",elements:[{name:"literal",value:"'icon'"},{name:"literal",value:"'text'"}]},description:"Type of menu item (icon or text)",defaultValue:{value:"'icon'",computed:!1}},icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:'Icon element (for type="icon")'},text:{required:!1,tsType:{name:"string"},description:'Text content (for type="text")'},iconSize:{required:!1,tsType:{name:"number"},description:"Size of the icon (default: 22)",defaultValue:{value:"22",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},className:{required:!1,tsType:{name:"string"},description:"Additional class name",defaultValue:{value:"''",computed:!1}},isSelected:{required:!1,tsType:{name:"boolean"},description:'Whether the item is selected (alternative to status="selected")',defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Children (alternative to icon prop)"}}};const Ie={title:"Components/SNBMenuItem",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## SNBMenuItem 컴포넌트

좁은 사이드 네비게이션 바(Side Navigation Bar)의 메뉴 아이템 컴포넌트입니다.

### 특징
- 아이콘 또는 텍스트 타입 지원
- 세 가지 상태: default, hover, selected
- 38×38px 고정 크기

### 상태별 스타일
- **Default**: 흰색 배경, 회색 아이콘
- **Hover**: 연한 회색 배경, 진한 회색 아이콘
- **Selected**: 연한 파란색 배경, 파란색 아이콘

### 사용 시기
- 좁은 아이콘 기반 사이드바
- 앱 전환 메뉴
- 빠른 액션 패널

### 예시
\`\`\`tsx
<SNBMenuItem
  icon={<IconHome size={22} />}
  isSelected={false}
  onClick={() => navigate('/home')}
/>
\`\`\`
        `}}},argTypes:{type:{control:"select",options:["icon","text"],description:"메뉴 아이템 타입",table:{defaultValue:{summary:"icon"}}},status:{control:"select",options:["default","hover","selected"],description:"상태"},isSelected:{control:"boolean",description:"선택 상태",table:{defaultValue:{summary:"false"}}},iconSize:{control:"number",description:"아이콘 크기",table:{defaultValue:{summary:"22"}}}}},c={args:{icon:e.jsx(s,{size:22,stroke:1.5}),status:"default"}},l={args:{icon:e.jsx(s,{size:22,stroke:1.5}),status:"hover"}},i={args:{icon:e.jsx(s,{size:22,stroke:1.5}),status:"selected"}},d={args:{type:"text",text:"A",status:"default"}},u={args:{type:"text",text:"B",status:"selected"}},m={render:()=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),status:"default"}),e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),status:"hover"}),e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),status:"selected"})]})},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit",children:[e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),isSelected:!0,onClick:()=>console.log("Home")}),e.jsx(t,{icon:e.jsx(U,{size:22,stroke:1.5}),onClick:()=>console.log("Compute")}),e.jsx(t,{icon:e.jsx(Q,{size:22,stroke:1.5}),onClick:()=>console.log("Storage")}),e.jsx(t,{icon:e.jsx(le,{size:22,stroke:1.5}),onClick:()=>console.log("Cloud")}),e.jsx(t,{icon:e.jsx(ie,{size:22,stroke:1.5}),onClick:()=>console.log("Files")}),e.jsx("div",{className:"h-px bg-[var(--color-border-subtle)] my-1"}),e.jsx(t,{icon:e.jsx(P,{size:22,stroke:1.5}),onClick:()=>console.log("Settings")})]})},f={render:()=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),isSelected:!1}),e.jsx(t,{icon:e.jsx(P,{size:22,stroke:1.5}),isSelected:!0})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit",children:[e.jsx("p",{className:"text-xs text-[var(--color-text-muted)] mb-2 px-1",children:"Hover to see effect"}),e.jsx(t,{icon:e.jsx(s,{size:22,stroke:1.5}),onClick:()=>alert("Home clicked!")}),e.jsx(t,{icon:e.jsx(U,{size:22,stroke:1.5}),onClick:()=>alert("Server clicked!")}),e.jsx(t,{icon:e.jsx(Q,{size:22,stroke:1.5}),onClick:()=>alert("Database clicked!")})]})};var I,b,h;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'default'
  }
}`,...(h=(b=c.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var N,y,j;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'hover'
  }
}`,...(j=(y=l.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var z,C,M;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'selected'
  }
}`,...(M=(C=i.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var B,H,T;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    type: 'text',
    text: 'A',
    status: 'default'
  }
}`,...(T=(H=d.parameters)==null?void 0:H.docs)==null?void 0:T.source}}};var w,R,D;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    type: 'text',
    text: 'B',
    status: 'selected'
  }
}`,...(D=(R=u.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};var q,V,$;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="default" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="hover" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="selected" />
    </div>
}`,...($=(V=m.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};var E,_,A;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} isSelected onClick={() => console.log('Home')} />
      <SNBMenuItem icon={<IconServer size={22} stroke={1.5} />} onClick={() => console.log('Compute')} />
      <SNBMenuItem icon={<IconDatabase size={22} stroke={1.5} />} onClick={() => console.log('Storage')} />
      <SNBMenuItem icon={<IconCloud size={22} stroke={1.5} />} onClick={() => console.log('Cloud')} />
      <SNBMenuItem icon={<IconFolder size={22} stroke={1.5} />} onClick={() => console.log('Files')} />
      <div className="h-px bg-[var(--color-border-subtle)] my-1" />
      <SNBMenuItem icon={<IconSettings size={22} stroke={1.5} />} onClick={() => console.log('Settings')} />
    </div>
}`,...(A=(_=p.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var F,W,L;f.parameters={...f.parameters,docs:{...(F=f.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} isSelected={false} />
      <SNBMenuItem icon={<IconSettings size={22} stroke={1.5} />} isSelected={true} />
    </div>
}`,...(L=(W=f.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var O,G,J;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit">
        <p className="text-xs text-[var(--color-text-muted)] mb-2 px-1">Hover to see effect</p>
        <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} onClick={() => alert('Home clicked!')} />
        <SNBMenuItem icon={<IconServer size={22} stroke={1.5} />} onClick={() => alert('Server clicked!')} />
        <SNBMenuItem icon={<IconDatabase size={22} stroke={1.5} />} onClick={() => alert('Database clicked!')} />
      </div>;
  }
}`,...(J=(G=x.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};const be=["Default","Hover","Selected","TextType","TextTypeSelected","AllStates","NavigationMenu","WithIsSelected","Interactive"];export{m as AllStates,c as Default,l as Hover,x as Interactive,p as NavigationMenu,i as Selected,d as TextType,u as TextTypeSelected,f as WithIsSelected,be as __namedExportsOrder,Ie as default};
