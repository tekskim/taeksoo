import{j as e}from"./iframe-ko1KmZFS.js";import{S as a}from"./SectionCard-DeZcty1p.js";import{S as K}from"./StatusIndicator-hwAPf0Zl.js";import{H as Q}from"./Stack-Dh9f_Si_.js";import{C as S}from"./Chip-z8dgdLQ7.js";import{B as X}from"./Button-BQge8bfe.js";import{I as Y}from"./IconEdit-DzucwhfQ.js";import{B as Z}from"./chunk-JZWAC4HX-7wHwC4xL.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./Tooltip-BMQcszHH.js";import"./index-ChYZSdsP.js";import"./IconTool-D7d82R25.js";import"./createReactComponent-B-brzlrB.js";import"./IconAlertCircle-GZBv8N7A.js";import"./IconAlertTriangle-RSM7ayVf.js";import"./IconX-CZRrzHtO.js";const ve={title:"Components/SectionCard",component:a,tags:["autodocs"],decorators:[q=>e.jsx(Z,{children:e.jsx("div",{style:{maxWidth:"600px"},children:e.jsx(q,{})})})],parameters:{docs:{description:{component:`
## SectionCard 컴포넌트

상세 페이지에서 정보를 구조화하여 표시하는 카드 컴포넌트입니다.

### 구성 요소
- **SectionCard**: 메인 컨테이너
- **SectionCard.Header**: 섹션 제목과 액션 버튼
- **SectionCard.Content**: 내용 영역
- **SectionCard.DataRow**: 라벨-값 쌍으로 데이터 표시

### 사용 시기
- 상세 페이지에서 관련 정보 그룹화
- 설정 페이지의 섹션 구분
- 대시보드 정보 카드

### 예시
\`\`\`tsx
<SectionCard>
  <SectionCard.Header title="Basic information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="my-instance" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>
\`\`\`
        `}}},argTypes:{isActive:{control:"boolean",description:"활성 상태 (파란색 테두리)",table:{defaultValue:{summary:"false"}}}}},t={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Basic information"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"my-instance-01"}),e.jsx(a.DataRow,{label:"Description",value:"Production server for web application"}),e.jsx(a.DataRow,{label:"Created",value:"Jan 15, 2024 10:30:00"})]})]})},n={render:()=>e.jsxs(a,{isActive:!0,children:[e.jsx(a.Header,{title:"Selected Section"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"active-item"}),e.jsx(a.DataRow,{label:"Status",value:"Running"})]})]})},r={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Configuration",actions:e.jsx(X,{size:"sm",variant:"secondary",leftIcon:e.jsx(Y,{size:12}),children:"Edit"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"CPU",value:"4 vCPU"}),e.jsx(a.DataRow,{label:"Memory",value:"16 GB"}),e.jsx(a.DataRow,{label:"Storage",value:"100 GB SSD"})]})]})},o={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Status & Labels"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Status",children:e.jsx(K,{status:"active",label:"Running"})}),e.jsx(a.DataRow,{label:"Labels",children:e.jsxs(Q,{gap:1,children:[e.jsx(S,{value:"production"}),e.jsx(S,{value:"web"}),e.jsx(S,{value:"frontend"})]})})]})]})},i={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Related Resources"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Network",value:"vpc-network-01",isLink:!0,linkHref:"/network/vpc-001"}),e.jsx(a.DataRow,{label:"Subnet",value:"subnet-primary",isLink:!0,linkHref:"/network/subnet-001"})]})]})},s={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Account Details",showDivider:!0}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Account ID",value:"acc-12345678",showDivider:!1}),e.jsx(a.DataRow,{label:"Owner",value:"admin@example.com"}),e.jsx(a.DataRow,{label:"Created",value:"Jan 1, 2024"})]})]})},l={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Scheduling",description:"Configure pod scheduling rules and node affinity."}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Node Selector",value:"gpu=true"}),e.jsx(a.DataRow,{label:"Tolerations",value:"NoSchedule"})]})]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(a,{children:[e.jsx(a.Header,{title:"Basic Information",statusIcon:e.jsx("div",{className:"size-4 rounded-full bg-[var(--color-state-success)] flex items-center justify-center shrink-0",children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})})}),e.jsx(a.Content,{children:e.jsx(a.DataRow,{label:"Name",value:"my-instance"})})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Configuration",statusIcon:e.jsx("div",{className:"size-4 shrink-0 flex items-center justify-center text-[var(--color-text-muted)]",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",children:e.jsx("circle",{cx:"12",cy:"12",r:"10",strokeDasharray:"4 4"})})})}),e.jsx(a.Content,{children:e.jsx(a.DataRow,{label:"Type",value:"Not set"})})]})]})},d={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Form Section",showDivider:!1}),e.jsxs(a.Content,{showDividers:!1,children:[e.jsx("div",{className:"py-6",children:e.jsx("span",{className:"text-label-lg text-[var(--color-text-default)]",children:"Instance name"})}),e.jsx("div",{className:"w-full h-px bg-[var(--color-border-subtle)]"}),e.jsx("div",{className:"py-6",children:e.jsx("span",{className:"text-label-lg text-[var(--color-text-default)]",children:"Availability zone"})})]})]})},u={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Compact Layout"}),e.jsxs(a.Content,{gap:1,children:[e.jsx(a.DataRow,{label:"CPU",value:"4 vCPU"}),e.jsx(a.DataRow,{label:"Memory",value:"8 GB"}),e.jsx(a.DataRow,{label:"Storage",value:"100 GB"})]})]})},C={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(a,{children:[e.jsx(a.Header,{title:"Instance Details"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Instance ID",value:"i-1234567890abcdef0"}),e.jsx(a.DataRow,{label:"Type",value:"m5.large"})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Private IP",value:"10.0.1.15"}),e.jsx(a.DataRow,{label:"Public IP",value:"52.14.123.45"})]})]})]})};var m,p,v;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="my-instance-01" />
        <SectionCard.DataRow label="Description" value="Production server for web application" />
        <SectionCard.DataRow label="Created" value="Jan 15, 2024 10:30:00" />
      </SectionCard.Content>
    </SectionCard>
}`,...(v=(p=t.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};var x,h,j;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <SectionCard isActive>
      <SectionCard.Header title="Selected Section" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="active-item" />
        <SectionCard.DataRow label="Status" value="Running" />
      </SectionCard.Content>
    </SectionCard>
}`,...(j=(h=n.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var w,b,D;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Configuration" actions={<Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>} />
      <SectionCard.Content>
        <SectionCard.DataRow label="CPU" value="4 vCPU" />
        <SectionCard.DataRow label="Memory" value="16 GB" />
        <SectionCard.DataRow label="Storage" value="100 GB SSD" />
      </SectionCard.Content>
    </SectionCard>
}`,...(D=(b=r.parameters)==null?void 0:b.docs)==null?void 0:D.source}}};var f,R,g;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Status & Labels" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Status">
          <StatusIndicator status="active" label="Running" />
        </SectionCard.DataRow>
        <SectionCard.DataRow label="Labels">
          <HStack gap={1}>
            <Chip value="production" />
            <Chip value="web" />
            <Chip value="frontend" />
          </HStack>
        </SectionCard.DataRow>
      </SectionCard.Content>
    </SectionCard>
}`,...(g=(R=o.parameters)==null?void 0:R.docs)==null?void 0:g.source}}};var k,H,y;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Related Resources" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Network" value="vpc-network-01" isLink linkHref="/network/vpc-001" />
        <SectionCard.DataRow label="Subnet" value="subnet-primary" isLink linkHref="/network/subnet-001" />
      </SectionCard.Content>
    </SectionCard>
}`,...(y=(H=i.parameters)==null?void 0:H.docs)==null?void 0:y.source}}};var N,I,B;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Account Details" showDivider />
      <SectionCard.Content>
        <SectionCard.DataRow label="Account ID" value="acc-12345678" showDivider={false} />
        <SectionCard.DataRow label="Owner" value="admin@example.com" />
        <SectionCard.DataRow label="Created" value="Jan 1, 2024" />
      </SectionCard.Content>
    </SectionCard>
}`,...(B=(I=s.parameters)==null?void 0:I.docs)==null?void 0:B.source}}};var W,L,P;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Scheduling" description="Configure pod scheduling rules and node affinity." />
      <SectionCard.Content>
        <SectionCard.DataRow label="Node Selector" value="gpu=true" />
        <SectionCard.DataRow label="Tolerations" value="NoSchedule" />
      </SectionCard.Content>
    </SectionCard>
}`,...(P=(L=l.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var A,z,G;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <SectionCard>
        <SectionCard.Header title="Basic Information" statusIcon={<div className="size-4 rounded-full bg-[var(--color-state-success)] flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>} />
        <SectionCard.Content>
          <SectionCard.DataRow label="Name" value="my-instance" />
        </SectionCard.Content>
      </SectionCard>
      <SectionCard>
        <SectionCard.Header title="Configuration" statusIcon={<div className="size-4 shrink-0 flex items-center justify-center text-[var(--color-text-muted)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            </div>} />
        <SectionCard.Content>
          <SectionCard.DataRow label="Type" value="Not set" />
        </SectionCard.Content>
      </SectionCard>
    </div>
}`,...(G=(z=c.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var U,T,E;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Form Section" showDivider={false} />
      <SectionCard.Content showDividers={false}>
        <div className="py-6">
          <span className="text-label-lg text-[var(--color-text-default)]">Instance name</span>
        </div>
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        <div className="py-6">
          <span className="text-label-lg text-[var(--color-text-default)]">Availability zone</span>
        </div>
      </SectionCard.Content>
    </SectionCard>
}`,...(E=(T=d.parameters)==null?void 0:T.docs)==null?void 0:E.source}}};var M,J,O;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Compact Layout" />
      <SectionCard.Content gap={1}>
        <SectionCard.DataRow label="CPU" value="4 vCPU" />
        <SectionCard.DataRow label="Memory" value="8 GB" />
        <SectionCard.DataRow label="Storage" value="100 GB" />
      </SectionCard.Content>
    </SectionCard>
}`,...(O=(J=u.parameters)==null?void 0:J.docs)==null?void 0:O.source}}};var F,_,V;C.parameters={...C.parameters,docs:{...(F=C.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <SectionCard>
        <SectionCard.Header title="Instance Details" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Instance ID" value="i-1234567890abcdef0" />
          <SectionCard.DataRow label="Type" value="m5.large" />
        </SectionCard.Content>
      </SectionCard>
      <SectionCard>
        <SectionCard.Header title="Network" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Private IP" value="10.0.1.15" />
          <SectionCard.DataRow label="Public IP" value="52.14.123.45" />
        </SectionCard.Content>
      </SectionCard>
    </div>
}`,...(V=(_=C.parameters)==null?void 0:_.docs)==null?void 0:V.source}}};const xe=["Default","ActiveState","WithHeaderActions","WithCustomContent","WithLink","WithDivider","HeaderWithDescription","HeaderWithStatusIcon","ContentWithoutDividers","ContentWithCustomGap","MultipleCards"];export{n as ActiveState,u as ContentWithCustomGap,d as ContentWithoutDividers,t as Default,l as HeaderWithDescription,c as HeaderWithStatusIcon,C as MultipleCards,o as WithCustomContent,s as WithDivider,r as WithHeaderActions,i as WithLink,xe as __namedExportsOrder,ve as default};
