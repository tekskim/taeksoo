import{j as e}from"./iframe-cCzR4jo2.js";import{S as a}from"./SectionCard-Bh5mGjAb.js";import{S as A}from"./StatusIndicator-BrLBZO2Q.js";import{H as N}from"./Stack-BoehbdEb.js";import{C as l}from"./Chip-D2HKwkia.js";import{B as L}from"./Button-C2RGuKHm.js";import{I as W}from"./IconEdit-CkAzsNkW.js";import{B as E}from"./chunk-JZWAC4HX-CCSa_MtD.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./createReactComponent-CYYKpV4_.js";import"./IconTool-MAxEu-gw.js";import"./IconCircleX-DXqf3vg7.js";import"./IconAlertTriangle-B6R9At_J.js";import"./IconX-KvYFK2XI.js";const Z={title:"Components/SectionCard",component:a,tags:["autodocs"],decorators:[B=>e.jsx(E,{children:e.jsx("div",{style:{maxWidth:"600px"},children:e.jsx(B,{})})})],parameters:{docs:{description:{component:`
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
  <SectionCard.Header title="Basic Information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="my-instance" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>
\`\`\`
        `}}},argTypes:{isActive:{control:"boolean",description:"활성 상태 (파란색 테두리)",table:{defaultValue:{summary:"false"}}}}},t={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Basic Information"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"my-instance-01"}),e.jsx(a.DataRow,{label:"Description",value:"Production server for web application"}),e.jsx(a.DataRow,{label:"Created",value:"2024-01-15 10:30:00"})]})]})},n={render:()=>e.jsxs(a,{isActive:!0,children:[e.jsx(a.Header,{title:"Selected Section"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"active-item"}),e.jsx(a.DataRow,{label:"Status",value:"Running"})]})]})},r={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Configuration",actions:e.jsx(L,{size:"sm",variant:"secondary",leftIcon:e.jsx(W,{size:14}),children:"Edit"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"CPU",value:"4 vCPU"}),e.jsx(a.DataRow,{label:"Memory",value:"16 GB"}),e.jsx(a.DataRow,{label:"Storage",value:"100 GB SSD"})]})]})},o={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Status & Labels"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Status",children:e.jsx(A,{status:"active",label:"Running"})}),e.jsx(a.DataRow,{label:"Labels",children:e.jsxs(N,{gap:1,children:[e.jsx(l,{value:"production"}),e.jsx(l,{value:"web"}),e.jsx(l,{value:"frontend"})]})})]})]})},i={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Related Resources"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Network",value:"vpc-network-01",isLink:!0,linkHref:"/network/vpc-001"}),e.jsx(a.DataRow,{label:"Subnet",value:"subnet-primary",isLink:!0,linkHref:"/network/subnet-001"})]})]})},s={render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{title:"Account Details",showDivider:!0}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Account ID",value:"acc-12345678",showDivider:!1}),e.jsx(a.DataRow,{label:"Owner",value:"admin@example.com"}),e.jsx(a.DataRow,{label:"Created",value:"2024-01-01"})]})]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(a,{children:[e.jsx(a.Header,{title:"Instance Details"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Instance ID",value:"i-1234567890abcdef0"}),e.jsx(a.DataRow,{label:"Type",value:"m5.large"})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Private IP",value:"10.0.1.15"}),e.jsx(a.DataRow,{label:"Public IP",value:"52.14.123.45"})]})]})]})};var d,C,u;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Basic Information" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="my-instance-01" />
        <SectionCard.DataRow label="Description" value="Production server for web application" />
        <SectionCard.DataRow label="Created" value="2024-01-15 10:30:00" />
      </SectionCard.Content>
    </SectionCard>
}`,...(u=(C=t.parameters)==null?void 0:C.docs)==null?void 0:u.source}}};var S,m,p;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <SectionCard isActive>
      <SectionCard.Header title="Selected Section" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="active-item" />
        <SectionCard.DataRow label="Status" value="Running" />
      </SectionCard.Content>
    </SectionCard>
}`,...(p=(m=n.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var v,x,w;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Configuration" actions={<Button size="sm" variant="secondary" leftIcon={<IconEdit size={14} />}>
            Edit
          </Button>} />
      <SectionCard.Content>
        <SectionCard.DataRow label="CPU" value="4 vCPU" />
        <SectionCard.DataRow label="Memory" value="16 GB" />
        <SectionCard.DataRow label="Storage" value="100 GB SSD" />
      </SectionCard.Content>
    </SectionCard>
}`,...(w=(x=r.parameters)==null?void 0:x.docs)==null?void 0:w.source}}};var D,b,j;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(j=(b=o.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var R,h,f;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Related Resources" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Network" value="vpc-network-01" isLink linkHref="/network/vpc-001" />
        <SectionCard.DataRow label="Subnet" value="subnet-primary" isLink linkHref="/network/subnet-001" />
      </SectionCard.Content>
    </SectionCard>
}`,...(f=(h=i.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var H,g,k;s.parameters={...s.parameters,docs:{...(H=s.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <SectionCard>
      <SectionCard.Header title="Account Details" showDivider />
      <SectionCard.Content>
        <SectionCard.DataRow label="Account ID" value="acc-12345678" showDivider={false} />
        <SectionCard.DataRow label="Owner" value="admin@example.com" />
        <SectionCard.DataRow label="Created" value="2024-01-01" />
      </SectionCard.Content>
    </SectionCard>
}`,...(k=(g=s.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};var I,y,P;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(P=(y=c.parameters)==null?void 0:y.docs)==null?void 0:P.source}}};const $=["Default","ActiveState","WithHeaderActions","WithCustomContent","WithLink","WithDivider","MultipleCards"];export{n as ActiveState,t as Default,c as MultipleCards,o as WithCustomContent,s as WithDivider,r as WithHeaderActions,i as WithLink,$ as __namedExportsOrder,Z as default};
