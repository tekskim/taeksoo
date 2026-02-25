import{j as e}from"./iframe-CsZHcOUf.js";import{I as ne}from"./IconLock-Ct_XsLgk.js";import{I as oe}from"./IconCloud-B2ToivC_.js";import{I as le}from"./IconStar-DbDOBhR-.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-C2Lh4gVY.js";function ce({color:t="success"}){const s={success:"bg-[var(--color-state-success)]",warning:"bg-[var(--color-state-warning)]",error:"bg-[var(--color-state-danger)]",info:"bg-[var(--color-action-primary)]",muted:"bg-[var(--color-text-muted)]"};return e.jsx("div",{className:`w-6 h-6 rounded-full ${s[t]} flex items-center justify-center shrink-0`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M13.3334 4L6.00008 11.3333L2.66675 8",stroke:"white",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function ue({badge:t}){const s={default:"bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]",success:"bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]",info:"bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]",warning:"bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]",muted:"bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]"};return e.jsxs("span",{className:`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-label-sm leading-4 ${s[t.variant||"muted"]}`,children:[t.icon&&e.jsx("span",{className:"w-[9px] h-[9px]",children:t.icon}),t.label]})}function a({title:t,description:s,showStatus:X=!1,statusColor:Z="success",badges:v,side:f="none",gaugeValue:ee,gaugeLabel:te,sideIcon:x,className:ae="",onClick:h}){const se=v&&v.length>0;return e.jsxs("div",{className:`flex items-start gap-3 ${ae} ${h?"cursor-pointer":""}`,onClick:h,children:[X&&e.jsx(ce,{color:Z}),e.jsxs("div",{className:"flex-1 min-w-0 flex flex-col gap-3",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("h4",{className:"text-heading-h5 leading-6 text-[var(--color-text-default)] truncate",children:t}),s&&e.jsx("p",{className:"text-body-md leading-4 text-[var(--color-text-subtle)] line-clamp-2",children:s})]}),se&&e.jsx("div",{className:"flex flex-wrap gap-1",children:v.map((re,ie)=>e.jsx(ue,{badge:re},ie))})]}),f==="gauge"&&e.jsxs("div",{className:"flex flex-col items-end gap-1 shrink-0",children:[e.jsx("span",{className:"text-heading-h5 leading-6 text-[var(--color-text-default)]",children:ee}),e.jsx("span",{className:"text-body-md leading-4 text-[var(--color-text-subtle)]",children:te})]}),f==="icon"&&x&&e.jsx("div",{className:"flex items-center justify-end shrink-0",children:x})]})}a.__docgenInfo={description:`CardTitle - A flexible card header component

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
\`\`\``,methods:[],displayName:"CardTitle",props:{title:{required:!0,tsType:{name:"string"},description:"Main title text"},description:{required:!1,tsType:{name:"string"},description:"Optional description text"},showStatus:{required:!1,tsType:{name:"boolean"},description:"Show status indicator (colored dot)",defaultValue:{value:"false",computed:!1}},statusColor:{required:!1,tsType:{name:"union",raw:"'success' | 'warning' | 'error' | 'info' | 'muted'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'error'"},{name:"literal",value:"'info'"},{name:"literal",value:"'muted'"}]},description:"Status indicator color",defaultValue:{value:"'success'",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"CardTitleBadge"}],raw:"CardTitleBadge[]"},description:"Badges to display"},side:{required:!1,tsType:{name:"union",raw:"'none' | 'gauge' | 'icon'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'gauge'"},{name:"literal",value:"'icon'"}]},description:"Side content type",defaultValue:{value:"'none'",computed:!1}},gaugeValue:{required:!1,tsType:{name:"string"},description:'Gauge value (for side="gauge")'},gaugeLabel:{required:!1,tsType:{name:"string"},description:'Gauge label (for side="gauge")'},sideIcon:{required:!1,tsType:{name:"ReactNode"},description:'Icon element (for side="icon")'},className:{required:!1,tsType:{name:"string"},description:"Additional class name",defaultValue:{value:"''",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"}}};const xe={title:"Components/CardTitle",component:a,tags:["autodocs"],decorators:[t=>e.jsx("div",{className:"max-w-md p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]",children:e.jsx(t,{})})],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{showStatus:{control:"boolean",description:"상태 인디케이터 표시",table:{defaultValue:{summary:"false"}}},statusColor:{control:"select",options:["success","warning","error","info","muted"],description:"상태 색상",table:{defaultValue:{summary:"success"}}},side:{control:"select",options:["none","gauge","icon"],description:"사이드 콘텐츠 타입",table:{defaultValue:{summary:"none"}}}}},r={args:{title:"lively-sunset-6041"}},i={args:{title:"pytorch-ml-instance",description:"PyTorch GPU-enabled template for AI/ML workloads with CUDA support"}},n={args:{title:"production-server-01",description:"Main production server",showStatus:!0,statusColor:"success"}},o={args:{title:"community-template",description:"Community contributed template",badges:[{label:"Public",variant:"success"},{label:"ai-ml",variant:"info"},{label:"pytorch",variant:"muted"}]}},l={args:{title:"ml-training-pod",description:"GPU-enabled training environment",showStatus:!0,statusColor:"success",badges:[{label:"GPU",variant:"info"},{label:"Running",variant:"success"}]}},c={args:{title:"compute-node-01",description:"High-performance compute instance",showStatus:!0,statusColor:"success",side:"gauge",gaugeValue:"45.2%",gaugeLabel:"CPU Utilization"}},u={args:{title:"starred-template",description:"Your favorite template",side:"icon",sideIcon:e.jsx(le,{size:20,className:"text-[var(--color-state-warning)]",fill:"currentColor"})}},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(a,{title:"Success Status",showStatus:!0,statusColor:"success"}),e.jsx(a,{title:"Warning Status",showStatus:!0,statusColor:"warning"}),e.jsx(a,{title:"Error Status",showStatus:!0,statusColor:"error"}),e.jsx(a,{title:"Info Status",showStatus:!0,statusColor:"info"}),e.jsx(a,{title:"Muted Status",showStatus:!0,statusColor:"muted"})]})},m={render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Badge Examples",badges:[{label:"Default",variant:"default"},{label:"Success",variant:"success"},{label:"Info",variant:"info"},{label:"Warning",variant:"warning"},{label:"Muted",variant:"muted"}]})})},p={render:()=>e.jsx(a,{title:"enterprise-ml-platform",description:"Enterprise-grade machine learning platform with integrated model training, deployment, and monitoring capabilities",showStatus:!0,statusColor:"success",badges:[{label:"Enterprise",variant:"info",icon:e.jsx(ne,{size:9})},{label:"Cloud",variant:"muted",icon:e.jsx(oe,{size:9})},{label:"Active",variant:"success"}],side:"gauge",gaugeValue:"87.5%",gaugeLabel:"Uptime"})},g={args:{title:"clickable-item",description:"Click to view details",onClick:()=>alert("Clicked!")}};var b,C,w;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    title: 'lively-sunset-6041'
  }
}`,...(w=(C=r.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var S,y,j;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    title: 'pytorch-ml-instance',
    description: 'PyTorch GPU-enabled template for AI/ML workloads with CUDA support'
  }
}`,...(j=(y=i.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var T,k,I;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    title: 'production-server-01',
    description: 'Main production server',
    showStatus: true,
    statusColor: 'success'
  }
}`,...(I=(k=n.parameters)==null?void 0:k.docs)==null?void 0:I.source}}};var N,W,P;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(P=(W=o.parameters)==null?void 0:W.docs)==null?void 0:P.source}}};var B,U,L;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(L=(U=l.parameters)==null?void 0:U.docs)==null?void 0:L.source}}};var V,A,E;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    title: 'compute-node-01',
    description: 'High-performance compute instance',
    showStatus: true,
    statusColor: 'success',
    side: 'gauge',
    gaugeValue: '45.2%',
    gaugeLabel: 'CPU Utilization'
  }
}`,...(E=(A=c.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var q,G,M;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    title: 'starred-template',
    description: 'Your favorite template',
    side: 'icon',
    sideIcon: <IconStar size={20} className="text-[var(--color-state-warning)]" fill="currentColor" />
  }
}`,...(M=(G=u.parameters)==null?void 0:G.docs)==null?void 0:M.source}}};var D,z,R;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <CardTitle title="Success Status" showStatus statusColor="success" />
      <CardTitle title="Warning Status" showStatus statusColor="warning" />
      <CardTitle title="Error Status" showStatus statusColor="error" />
      <CardTitle title="Info Status" showStatus statusColor="info" />
      <CardTitle title="Muted Status" showStatus statusColor="muted" />
    </div>
}`,...(R=(z=d.parameters)==null?void 0:z.docs)==null?void 0:R.source}}};var _,$,H;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(H=($=m.parameters)==null?void 0:$.docs)==null?void 0:H.source}}};var O,Y,F;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(F=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:F.source}}};var J,K,Q;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    title: 'clickable-item',
    description: 'Click to view details',
    onClick: () => alert('Clicked!')
  }
}`,...(Q=(K=g.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const he=["Default","WithDescription","WithStatus","WithBadges","WithStatusAndBadges","WithGauge","WithIcon","AllStatusColors","BadgeVariants","ComplexExample","Clickable"];export{d as AllStatusColors,m as BadgeVariants,g as Clickable,p as ComplexExample,r as Default,o as WithBadges,i as WithDescription,c as WithGauge,u as WithIcon,n as WithStatus,l as WithStatusAndBadges,he as __namedExportsOrder,xe as default};
