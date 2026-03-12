import{j as e}from"./iframe-IHmg4wqj.js";import{C as i}from"./Chip-D4S8DWYx.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./IconX-Cqqx2THU.js";import"./createReactComponent-BhwuFqFO.js";function a({label:l,value:t,children:j,className:B=""}){return e.jsx("div",{className:`w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] ${B}`.trim(),children:e.jsxs("div",{className:"flex flex-col gap-[6px]",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:l}),j??e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:t})]})})}function N({children:l,className:t=""}){return e.jsx("div",{className:`flex flex-col gap-[12px] ${t}`.trim(),children:l})}a.Group=N;a.__docgenInfo={description:"",methods:[{name:"Group",docblock:null,modifiers:["static"],params:[{name:"{ children, className = '' }: InfoBoxGroupProps",optional:!1,type:{name:"InfoBoxGroupProps",alias:"InfoBoxGroupProps"}}],returns:null}],displayName:"InfoBox",props:{label:{required:!0,tsType:{name:"string"},description:"라벨"},value:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"값 (텍스트)"},children:{required:!1,tsType:{name:"ReactNode"},description:"복잡한 값은 children으로"},className:{required:!1,tsType:{name:"string"},description:"추가 CSS 클래스",defaultValue:{value:"''",computed:!1}}}};const z={title:"Data Display/InfoBox",component:a,parameters:{layout:"padded",docs:{description:{component:`
정보를 라벨-값 쌍으로 표시하는 박스 컴포넌트. Drawer/Modal의 컨텍스트 정보 또는 상세 페이지의 요약 정보에 사용합니다.

**사용 위치:**
- Form Drawer의 리소스 정보 표시
- Modal의 삭제 대상 정보
- 상세 페이지의 요약 카드
        `}}},tags:["autodocs"]},r={args:{label:"Instance ID",value:"i-1234567890abcdef0"}},s={render:()=>e.jsx(a,{label:"Labels (3)",children:e.jsxs("div",{className:"flex flex-wrap items-center gap-[var(--primitive-spacing-1)]",children:[e.jsx(i,{label:"app=nginx",size:"sm"}),e.jsx(i,{label:"env=production",size:"sm"}),e.jsx(i,{label:"version=1.0",size:"sm"})]})})},o={render:()=>e.jsxs(a.Group,{children:[e.jsx(a,{label:"Resource Name",value:"my-deployment"}),e.jsx(a,{label:"Namespace",value:"default"}),e.jsx(a,{label:"Created at",value:"2026-02-06 14:30:00"})]})},n={render:()=>e.jsx("div",{className:"w-[344px]",children:e.jsxs(a.Group,{children:[e.jsx(a,{label:"Resource ID",value:"vol-0123456789abcdef"}),e.jsx(a,{label:"Current Status",value:"Available"})]})})};var p,c,d;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: 'Instance ID',
    value: 'i-1234567890abcdef0'
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,m,x;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <InfoBox label="Labels (3)">
      <div className="flex flex-wrap items-center gap-[var(--primitive-spacing-1)]">
        <Chip label="app=nginx" size="sm" />
        <Chip label="env=production" size="sm" />
        <Chip label="version=1.0" size="sm" />
      </div>
    </InfoBox>
}`,...(x=(m=s.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var f,v,b;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <InfoBox.Group>
      <InfoBox label="Resource Name" value="my-deployment" />
      <InfoBox label="Namespace" value="default" />
      <InfoBox label="Created at" value="2026-02-06 14:30:00" />
    </InfoBox.Group>
}`,...(b=(v=o.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var I,g,h;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="w-[344px]">
      <InfoBox.Group>
        <InfoBox label="Resource ID" value="vol-0123456789abcdef" />
        <InfoBox label="Current Status" value="Available" />
      </InfoBox.Group>
    </div>
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const R=["Default","WithChildren","Group","InDrawerContext"];export{r as Default,o as Group,n as InDrawerContext,s as WithChildren,R as __namedExportsOrder,z as default};
