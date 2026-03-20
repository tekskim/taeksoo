import{j as e}from"./iframe-ko1KmZFS.js";import{B as ne}from"./Badge-Co-C5Vm0.js";import{S as oe}from"./StatusIndicator-hwAPf0Zl.js";import{I as le}from"./IconLock-BLUjhO08.js";import{I as ce}from"./IconCloud-DtwJHo5v.js";import{I as ue}from"./IconStar-C2Iskl4L.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./Tooltip-BMQcszHH.js";import"./index-ChYZSdsP.js";import"./IconTool-D7d82R25.js";import"./createReactComponent-B-brzlrB.js";import"./IconEdit-DzucwhfQ.js";import"./IconAlertCircle-GZBv8N7A.js";import"./IconAlertTriangle-RSM7ayVf.js";const de={success:"active",warning:"pending",error:"error",info:"building",muted:"disabled"},me={default:"default",success:"success",info:"info",warning:"warning",muted:"default"};function t({title:p,description:v,showStatus:Z=!1,statusColor:ee="success",badges:g,side:h="none",gaugeValue:te,gaugeLabel:ae,sideIcon:b,className:se="",onClick:x}){const re=g&&g.length>0;return e.jsxs("div",{"data-figma-name":"[TDS] CardTitle",className:`flex items-start gap-3 ${se} ${x?"cursor-pointer":""}`,onClick:x,children:[Z&&e.jsx(oe,{status:de[ee]||"active",layout:"icon-only",size:"lg",className:"shrink-0"}),e.jsxs("div",{className:"flex-1 min-w-0 flex flex-col gap-3",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("h4",{className:"text-heading-h5 leading-6 text-[var(--color-text-default)] truncate",children:p}),v&&e.jsx("p",{className:"text-body-md leading-4 text-[var(--color-text-muted)] line-clamp-2",children:v})]}),re&&e.jsx("div",{className:"flex flex-wrap gap-1",children:g.map((f,ie)=>e.jsx(ne,{variant:me[f.variant||"muted"],size:"sm",leftIcon:f.icon,children:f.label},ie))})]}),h==="gauge"&&e.jsxs("div",{className:"flex flex-col items-end gap-1 shrink-0",children:[e.jsx("span",{className:"text-heading-h5 leading-6 text-[var(--color-text-default)]",children:te}),e.jsx("span",{className:"text-body-md leading-4 text-[var(--color-text-subtle)]",children:ae})]}),h==="icon"&&b&&e.jsx("div",{className:"flex items-center justify-end shrink-0",children:b})]})}t.__docgenInfo={description:`CardTitle - A flexible card header component

Displays a title with optional status indicator, description, badges, and side content.
Commonly used in list items, cards, and detail headers.

@example
\`\`\`tsx
// Basic usage
<CardTitle title="lively-sunset-6041" />

// With description and status
<CardTitle
  title="lively-sunset-6041"
  description="PyTorch GPU-enabled template for AI/ML workloads"
  showStatus
  statusColor="success"
/>

// With badges
<CardTitle
  title="lively-sunset-6041"
  badges={[
    { label: 'Public', variant: 'success' },
    { label: 'ai-ml', variant: 'info' },
  ]}
/>

// With gauge side content
<CardTitle
  title="lively-sunset-6041"
  side="gauge"
  gaugeValue="0.0%"
  gaugeLabel="Utilization"
/>
\`\`\``,methods:[],displayName:"CardTitle",props:{title:{required:!0,tsType:{name:"string"},description:"Main title text"},description:{required:!1,tsType:{name:"string"},description:"Optional description text"},showStatus:{required:!1,tsType:{name:"boolean"},description:"Show status indicator",defaultValue:{value:"false",computed:!1}},statusColor:{required:!1,tsType:{name:"union",raw:"'success' | 'warning' | 'error' | 'info' | 'muted'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'error'"},{name:"literal",value:"'info'"},{name:"literal",value:"'muted'"}]},description:"Status indicator color",defaultValue:{value:"'success'",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"CardTitleBadge"}],raw:"CardTitleBadge[]"},description:"Badges to display"},side:{required:!1,tsType:{name:"union",raw:"'none' | 'gauge' | 'icon'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'gauge'"},{name:"literal",value:"'icon'"}]},description:"Side content type",defaultValue:{value:"'none'",computed:!1}},gaugeValue:{required:!1,tsType:{name:"string"},description:'Gauge value (for side="gauge")'},gaugeLabel:{required:!1,tsType:{name:"string"},description:'Gauge label (for side="gauge")'},sideIcon:{required:!1,tsType:{name:"ReactNode"},description:'Icon element (for side="icon")'},className:{required:!1,tsType:{name:"string"},description:"Additional class name",defaultValue:{value:"''",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"}}};const Pe={title:"Components/CardTitle",component:t,tags:["autodocs"],decorators:[p=>e.jsx("div",{className:"max-w-md p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]",children:e.jsx(p,{})})],parameters:{docs:{description:{component:`
## CardTitle 컴포넌트

카드나 리스트 아이템의 제목 영역을 표시하는 컴포넌트입니다.

### 특징
- 상태 인디케이터 (성공, 경고, 에러 등)
- 뱃지 표시 (Public, Beta 등)
- 사이드 콘텐츠 (게이지, 아이콘)
- 설명 텍스트

### Props
- **title**: 메인 제목 텍스트
- **description**: 부가 설명
- **showStatus**: 상태 인디케이터 표시
- **statusColor**: 상태 색상
- **badges**: 뱃지 배열
- **side**: 사이드 콘텐츠 타입 (none, gauge, icon)

### 사용 시기
- 리소스 목록 아이템
- 카드 헤더
- 대시보드 위젯

### 예시
\`\`\`tsx
<CardTitle
  title="my-instance-01"
  description="Production server"
  showStatus
  statusColor="success"
  badges={[{ label: 'Public', variant: 'success' }]}
/>
\`\`\`
        `}}},argTypes:{showStatus:{control:"boolean",description:"상태 인디케이터 표시",table:{defaultValue:{summary:"false"}}},statusColor:{control:"select",options:["success","warning","error","info","muted"],description:"상태 색상",table:{defaultValue:{summary:"success"}}},side:{control:"select",options:["none","gauge","icon"],description:"사이드 콘텐츠 타입",table:{defaultValue:{summary:"none"}}}}},a={args:{title:"lively-sunset-6041"}},s={args:{title:"pytorch-ml-instance",description:"PyTorch GPU-enabled template for AI/ML workloads with CUDA support"}},r={args:{title:"production-server-01",description:"Main production server",showStatus:!0,statusColor:"success"}},i={args:{title:"community-template",description:"Community contributed template",badges:[{label:"Public",variant:"success"},{label:"ai-ml",variant:"info"},{label:"pytorch",variant:"muted"}]}},n={args:{title:"ml-training-pod",description:"GPU-enabled training environment",showStatus:!0,statusColor:"success",badges:[{label:"GPU",variant:"info"},{label:"Running",variant:"success"}]}},o={args:{title:"compute-node-01",description:"High-performance compute instance",showStatus:!0,statusColor:"success",side:"gauge",gaugeValue:"45.2%",gaugeLabel:"CPU Utilization"}},l={args:{title:"starred-template",description:"Your favorite template",side:"icon",sideIcon:e.jsx(ue,{size:20,className:"text-[var(--color-state-warning)]",fill:"currentColor"})}},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(t,{title:"Success Status",showStatus:!0,statusColor:"success"}),e.jsx(t,{title:"Warning Status",showStatus:!0,statusColor:"warning"}),e.jsx(t,{title:"Error Status",showStatus:!0,statusColor:"error"}),e.jsx(t,{title:"Info Status",showStatus:!0,statusColor:"info"}),e.jsx(t,{title:"Muted Status",showStatus:!0,statusColor:"muted"})]})},u={render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:e.jsx(t,{title:"Badge Examples",badges:[{label:"Default",variant:"default"},{label:"Success",variant:"success"},{label:"Info",variant:"info"},{label:"Warning",variant:"warning"},{label:"Muted",variant:"muted"}]})})},d={render:()=>e.jsx(t,{title:"enterprise-ml-platform",description:"Enterprise-grade machine learning platform with integrated model training, deployment, and monitoring capabilities",showStatus:!0,statusColor:"success",badges:[{label:"Enterprise",variant:"info",icon:e.jsx(le,{size:9})},{label:"Cloud",variant:"muted",icon:e.jsx(ce,{size:9})},{label:"Active",variant:"success"}],side:"gauge",gaugeValue:"87.5%",gaugeLabel:"Uptime"})},m={args:{title:"clickable-item",description:"Click to view details",onClick:()=>alert("Clicked!")}};var C,S,w;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    title: 'lively-sunset-6041'
  }
}`,...(w=(S=a.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var y,T,j;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    title: 'pytorch-ml-instance',
    description: 'PyTorch GPU-enabled template for AI/ML workloads with CUDA support'
  }
}`,...(j=(T=s.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var I,N,P;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    title: 'production-server-01',
    description: 'Main production server',
    showStatus: true,
    statusColor: 'success'
  }
}`,...(P=(N=r.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var A,k,W;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    title: 'community-template',
    description: 'Community contributed template',
    badges: [{
      label: 'Public',
      variant: 'success'
    }, {
      label: 'ai-ml',
      variant: 'info'
    }, {
      label: 'pytorch',
      variant: 'muted'
    }]
  }
}`,...(W=(k=i.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};var B,U,V;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'ml-training-pod',
    description: 'GPU-enabled training environment',
    showStatus: true,
    statusColor: 'success',
    badges: [{
      label: 'GPU',
      variant: 'info'
    }, {
      label: 'Running',
      variant: 'success'
    }]
  }
}`,...(V=(U=n.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var E,G,L;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    title: 'compute-node-01',
    description: 'High-performance compute instance',
    showStatus: true,
    statusColor: 'success',
    side: 'gauge',
    gaugeValue: '45.2%',
    gaugeLabel: 'CPU Utilization'
  }
}`,...(L=(G=o.parameters)==null?void 0:G.docs)==null?void 0:L.source}}};var M,q,z;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    title: 'starred-template',
    description: 'Your favorite template',
    side: 'icon',
    sideIcon: <IconStar size={20} className="text-[var(--color-state-warning)]" fill="currentColor" />
  }
}`,...(z=(q=l.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var D,_,R;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <CardTitle title="Success Status" showStatus statusColor="success" />
      <CardTitle title="Warning Status" showStatus statusColor="warning" />
      <CardTitle title="Error Status" showStatus statusColor="error" />
      <CardTitle title="Info Status" showStatus statusColor="info" />
      <CardTitle title="Muted Status" showStatus statusColor="muted" />
    </div>
}`,...(R=(_=c.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var O,H,Y;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <CardTitle title="Badge Examples" badges={[{
      label: 'Default',
      variant: 'default'
    }, {
      label: 'Success',
      variant: 'success'
    }, {
      label: 'Info',
      variant: 'info'
    }, {
      label: 'Warning',
      variant: 'warning'
    }, {
      label: 'Muted',
      variant: 'muted'
    }]} />
    </div>
}`,...(Y=(H=u.parameters)==null?void 0:H.docs)==null?void 0:Y.source}}};var $,F,J;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <CardTitle title="enterprise-ml-platform" description="Enterprise-grade machine learning platform with integrated model training, deployment, and monitoring capabilities" showStatus statusColor="success" badges={[{
    label: 'Enterprise',
    variant: 'info',
    icon: <IconLock size={9} />
  }, {
    label: 'Cloud',
    variant: 'muted',
    icon: <IconCloud size={9} />
  }, {
    label: 'Active',
    variant: 'success'
  }]} side="gauge" gaugeValue="87.5%" gaugeLabel="Uptime" />
}`,...(J=(F=d.parameters)==null?void 0:F.docs)==null?void 0:J.source}}};var K,Q,X;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    title: 'clickable-item',
    description: 'Click to view details',
    onClick: () => alert('Clicked!')
  }
}`,...(X=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const Ae=["Default","WithDescription","WithStatus","WithBadges","WithStatusAndBadges","WithGauge","WithIcon","AllStatusColors","BadgeVariants","ComplexExample","Clickable"];export{c as AllStatusColors,u as BadgeVariants,m as Clickable,d as ComplexExample,a as Default,i as WithBadges,s as WithDescription,o as WithGauge,l as WithIcon,r as WithStatus,n as WithStatusAndBadges,Ae as __namedExportsOrder,Pe as default};
