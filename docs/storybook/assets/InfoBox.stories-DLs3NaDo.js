import{j as e}from"./iframe-iHQO5Mqm.js";import{I as a}from"./InfoBox-X7eTQtaA.js";import{C as l}from"./Chip-bNT7XFRE.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./StatusIndicator-BNTz6X4B.js";import"./IconTool-B1HFVtUT.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconEdit-CSXljq5-.js";import"./IconAlertCircle-xIuC-r38.js";import"./IconAlertTriangle-C3nCRCP9.js";import"./Tooltip-C1upJdm8.js";import"./index-HVRJ0oH1.js";import"./IconInfoCircle-Bf4MTjPJ.js";import"./IconCheck-ai78HtyZ.js";import"./IconCopy-BfwpXdAX.js";import"./IconX-gJXINq1T.js";const M={title:"Data Display/InfoBox",component:a,parameters:{layout:"padded",docs:{description:{component:`
정보를 라벨-값 쌍으로 표시하는 박스 컴포넌트. Drawer/Modal의 컨텍스트 정보 또는 상세 페이지의 요약 정보에 사용합니다.

**사용 위치:**
- Form Drawer의 리소스 정보 표시
- Modal의 삭제 대상 정보
- 상세 페이지의 요약 카드
        `}}},tags:["autodocs"]},r={args:{label:"Instance ID",value:"i-1234567890abcdef0"}},o={render:()=>e.jsx(a,{label:"Labels (3)",children:e.jsxs("div",{className:"flex flex-wrap items-center gap-[var(--primitive-spacing-1)]",children:[e.jsx(l,{label:"app=nginx",size:"sm"}),e.jsx(l,{label:"env=production",size:"sm"}),e.jsx(l,{label:"version=1.0",size:"sm"})]})})},s={render:()=>e.jsxs(a.Group,{children:[e.jsx(a,{label:"Resource Name",value:"my-deployment"}),e.jsx(a,{label:"Namespace",value:"default"}),e.jsx(a,{label:"Created at",value:"Feb 06, 2026 14:30:00"})]})},n={render:()=>e.jsx("div",{className:"w-[344px]",children:e.jsxs(a.Group,{children:[e.jsx(a,{label:"Resource ID",value:"vol-0123456789abcdef"}),e.jsx(a,{label:"Current Status",value:"Available"})]})})};var t,i,p;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    label: 'Instance ID',
    value: 'i-1234567890abcdef0'
  }
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var m,c,d;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <InfoBox label="Labels (3)">
      <div className="flex flex-wrap items-center gap-[var(--primitive-spacing-1)]">
        <Chip label="app=nginx" size="sm" />
        <Chip label="env=production" size="sm" />
        <Chip label="version=1.0" size="sm" />
      </div>
    </InfoBox>
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,x,b;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <InfoBox.Group>
      <InfoBox label="Resource Name" value="my-deployment" />
      <InfoBox label="Namespace" value="default" />
      <InfoBox label="Created at" value="Feb 06, 2026 14:30:00" />
    </InfoBox.Group>
}`,...(b=(x=s.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var v,f,I;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="w-[344px]">
      <InfoBox.Group>
        <InfoBox label="Resource ID" value="vol-0123456789abcdef" />
        <InfoBox label="Current Status" value="Available" />
      </InfoBox.Group>
    </div>
}`,...(I=(f=n.parameters)==null?void 0:f.docs)==null?void 0:I.source}}};const W=["Default","WithChildren","Group","InDrawerContext"];export{r as Default,s as Group,n as InDrawerContext,o as WithChildren,W as __namedExportsOrder,M as default};
