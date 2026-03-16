import{j as e}from"./iframe-iHQO5Mqm.js";import{S as s}from"./SNBMenuItem-DvHa9FoJ.js";import{I as o}from"./IconHome-wYBQld76.js";import{I as _}from"./IconServer-VY-q2olf.js";import{I as O}from"./IconDatabase-D24hvDMS.js";import{I as q}from"./IconCloud-BiT457M7.js";import{I as G}from"./IconFolder-CFuHyp3x.js";import{I as R}from"./IconSettings-D0BAVBr7.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CEVQAvfZ.js";const ee={title:"Components/SNBMenuItem",component:s,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{type:{control:"select",options:["icon","text"],description:"메뉴 아이템 타입",table:{defaultValue:{summary:"icon"}}},status:{control:"select",options:["default","hover","selected"],description:"상태"},isSelected:{control:"boolean",description:"선택 상태",table:{defaultValue:{summary:"false"}}},iconSize:{control:"number",description:"아이콘 크기",table:{defaultValue:{summary:"22"}}}}},r={args:{icon:e.jsx(o,{size:22,stroke:1.5}),status:"default"}},t={args:{icon:e.jsx(o,{size:22,stroke:1.5}),status:"hover"}},a={args:{icon:e.jsx(o,{size:22,stroke:1.5}),status:"selected"}},i={args:{type:"text",text:"A",status:"default"}},c={args:{type:"text",text:"B",status:"selected"}},n={render:()=>e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),status:"default"}),e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),status:"hover"}),e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),status:"selected"})]})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-1)] bg-[var(--color-surface-default)] p-[var(--primitive-spacing-2)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] w-fit",children:[e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),isSelected:!0,onClick:()=>console.log("Home")}),e.jsx(s,{icon:e.jsx(_,{size:22,stroke:1.5}),onClick:()=>console.log("Compute")}),e.jsx(s,{icon:e.jsx(O,{size:22,stroke:1.5}),onClick:()=>console.log("Storage")}),e.jsx(s,{icon:e.jsx(q,{size:22,stroke:1.5}),onClick:()=>console.log("Cloud")}),e.jsx(s,{icon:e.jsx(G,{size:22,stroke:1.5}),onClick:()=>console.log("Files")}),e.jsx("div",{className:"h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]"}),e.jsx(s,{icon:e.jsx(R,{size:22,stroke:1.5}),onClick:()=>console.log("Settings")})]})},d={render:()=>e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),isSelected:!1}),e.jsx(s,{icon:e.jsx(R,{size:22,stroke:1.5}),isSelected:!0})]})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-1)] bg-[var(--color-surface-default)] p-[var(--primitive-spacing-2)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] w-fit",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-1)]",children:"Hover to see effect"}),e.jsx(s,{icon:e.jsx(o,{size:22,stroke:1.5}),onClick:()=>alert("Home clicked!")}),e.jsx(s,{icon:e.jsx(_,{size:22,stroke:1.5}),onClick:()=>alert("Server clicked!")}),e.jsx(s,{icon:e.jsx(O,{size:22,stroke:1.5}),onClick:()=>alert("Database clicked!")})]})};var p,u,v;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'default'
  }
}`,...(v=(u=r.parameters)==null?void 0:u.docs)==null?void 0:v.source}}};var g,x,f;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'hover'
  }
}`,...(f=(x=t.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var k,S,I;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'selected'
  }
}`,...(I=(S=a.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var j,b,z;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    type: 'text',
    text: 'A',
    status: 'default'
  }
}`,...(z=(b=i.parameters)==null?void 0:b.docs)==null?void 0:z.source}}};var N,C,B;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    type: 'text',
    text: 'B',
    status: 'selected'
  }
}`,...(B=(C=c.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};var H,M,y;n.parameters={...n.parameters,docs:{...(H=n.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex gap-[var(--primitive-spacing-2)]">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="default" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="hover" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="selected" />
    </div>
}`,...(y=(M=n.parameters)==null?void 0:M.docs)==null?void 0:y.source}}};var h,T,D;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-1)] bg-[var(--color-surface-default)] p-[var(--primitive-spacing-2)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] w-fit">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} isSelected onClick={() => console.log('Home')} />
      <SNBMenuItem icon={<IconServer size={22} stroke={1.5} />} onClick={() => console.log('Compute')} />
      <SNBMenuItem icon={<IconDatabase size={22} stroke={1.5} />} onClick={() => console.log('Storage')} />
      <SNBMenuItem icon={<IconCloud size={22} stroke={1.5} />} onClick={() => console.log('Cloud')} />
      <SNBMenuItem icon={<IconFolder size={22} stroke={1.5} />} onClick={() => console.log('Files')} />
      <div className="h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]" />
      <SNBMenuItem icon={<IconSettings size={22} stroke={1.5} />} onClick={() => console.log('Settings')} />
    </div>
}`,...(D=(T=l.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var w,A,F;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="flex gap-[var(--primitive-spacing-2)]">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} isSelected={false} />
      <SNBMenuItem icon={<IconSettings size={22} stroke={1.5} />} isSelected={true} />
    </div>
}`,...(F=(A=d.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var V,E,W;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-[var(--primitive-spacing-1)] bg-[var(--color-surface-default)] p-[var(--primitive-spacing-2)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] w-fit">
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-1)]">
          Hover to see effect
        </p>
        <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} onClick={() => alert('Home clicked!')} />
        <SNBMenuItem icon={<IconServer size={22} stroke={1.5} />} onClick={() => alert('Server clicked!')} />
        <SNBMenuItem icon={<IconDatabase size={22} stroke={1.5} />} onClick={() => alert('Database clicked!')} />
      </div>;
  }
}`,...(W=(E=m.parameters)==null?void 0:E.docs)==null?void 0:W.source}}};const se=["Default","Hover","Selected","TextType","TextTypeSelected","AllStates","NavigationMenu","WithIsSelected","Interactive"];export{n as AllStates,r as Default,t as Hover,m as Interactive,l as NavigationMenu,a as Selected,i as TextType,c as TextTypeSelected,d as WithIsSelected,se as __namedExportsOrder,ee as default};
