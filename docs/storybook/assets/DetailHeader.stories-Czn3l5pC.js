import{j as e}from"./iframe-CzLct1Ct.js";import{D as a}from"./DetailHeader-Lec5L6jG.js";import{B as r}from"./Button-kAA1kjx0.js";import{I as N}from"./IconEdit-C4TPH2hK.js";import{I as W}from"./IconTrash-oozeluA6.js";import{I as V}from"./IconPlayerStop-DnKwi1Ch.js";import{H as k}from"./Stack-B5Z0-4MO.js";import{C as u}from"./Chip-DKymslNZ.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./InfoBox-Ph3ZI0WV.js";import"./StatusIndicator-DpVUbwLt.js";import"./Tooltip-DBLkmXcb.js";import"./index-CZa75-BM.js";import"./IconTool-Dqg2br2W.js";import"./createReactComponent-Djx9unWR.js";import"./IconAlertCircle-BTarO_oW.js";import"./IconAlertTriangle-CkpkjMBL.js";import"./IconInfoCircle-CIDkU_To.js";import"./IconCheck-Dy71EyJ1.js";import"./IconCopy-CB-0roxe.js";import"./IconX-Br_T-QG9.js";const oe={title:"Components/DetailHeader",component:a,tags:["autodocs"],decorators:[O=>e.jsx("div",{style:{maxWidth:"900px"},children:e.jsx(O,{})})],parameters:{docs:{description:{component:`
## DetailHeader 컴포넌트

상세 페이지 상단에 리소스의 핵심 정보를 표시하는 헤더 컴포넌트입니다.

### 구성 요소
- **DetailHeader**: 메인 컨테이너
- **DetailHeader.Title**: 리소스 이름/제목
- **DetailHeader.Actions**: 액션 버튼 그룹
- **DetailHeader.InfoGrid**: 정보 카드 그리드
- **DetailHeader.InfoCard**: 개별 정보 카드 (라벨, 값, 복사 버튼, 상태 표시)

### 사용 시기
- VM, Pod, Service 등 리소스 상세 페이지 상단
- 핵심 메타데이터를 한눈에 보여줄 때
- 빠른 액션 버튼이 필요할 때

### 예시
\`\`\`tsx
<DetailHeader>
  <DetailHeader.Title>my-deployment</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button size="sm">Edit</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" value="" />
    <DetailHeader.InfoCard label="Replicas" value="3/3" />
  </DetailHeader.InfoGrid>
</DetailHeader>
\`\`\`
        `}}}},t={render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"nginx-deployment"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(N,{size:12}),children:"Edit"}),e.jsx(r,{size:"sm",variant:"danger",leftIcon:e.jsx(W,{size:12}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Namespace",value:"default"}),e.jsx(a.InfoCard,{label:"Replicas",value:"3/3"}),e.jsx(a.InfoCard,{label:"Age",value:"5d 12h"})]})]})},l={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"my-pod-7d8f9b6c4-xyz12"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Pod IP",value:"10.244.1.15",copyable:!0}),e.jsx(a.InfoCard,{label:"Node",value:"worker-node-01",copyable:!0}),e.jsx(a.InfoCard,{label:"UID",value:"a1b2c3d4-e5f6-7890-abcd-ef1234567890",copyable:!0})]})]})},i={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"production-service"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Health",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Endpoints",value:"3 active"})]})]})},s={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"web-server"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Labels",value:e.jsxs(k,{gap:1,children:[e.jsx(u,{value:"app=web",variant:"default"}),e.jsx(u,{value:"env=prod",variant:"default"})]})}),e.jsx(a.InfoCard,{label:"Created",value:"Jan 15, 2024 10:30"})]})]})},n={name:"VM Detail Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"production-vm-01"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(V,{size:12}),children:"Stop"}),e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(N,{size:12}),children:"Edit"}),e.jsx(r,{size:"sm",variant:"danger",leftIcon:e.jsx(W,{size:12}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Instance Type",value:"m5.xlarge"}),e.jsx(a.InfoCard,{label:"Private IP",value:"10.0.1.100",copyable:!0}),e.jsx(a.InfoCard,{label:"Public IP",value:"52.14.123.45",copyable:!0})]})]})},d={name:"Kubernetes Service Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"frontend-service"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",children:"Edit YAML"}),e.jsx(r,{size:"sm",variant:"danger",children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Type",value:"ClusterIP"}),e.jsx(a.InfoCard,{label:"Cluster IP",value:"10.96.45.123",copyable:!0}),e.jsx(a.InfoCard,{label:"Port",value:"80/TCP"}),e.jsx(a.InfoCard,{label:"Target Port",value:"8080"})]})]})},o={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"compute-node-01"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"ID",value:"n-a1b2c3d4",copyable:!0}),e.jsx(a.InfoCard,{label:"IOPS",value:"3000",tooltip:"Input/Output Operations Per Second"}),e.jsx(a.InfoCard,{label:"Throughput",value:"125 MB/s",tooltip:"Maximum sustained data transfer rate"})]})]})},c={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"simple-resource"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Created",value:"Just now"})]})]})};var p,f,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>nginx-deployment</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Namespace" value="default" />
        <DetailHeader.InfoCard label="Replicas" value="3/3" />
        <DetailHeader.InfoCard label="Age" value="5d 12h" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(m=(f=t.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var I,v,D;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>my-pod-7d8f9b6c4-xyz12</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Pod IP" value="10.244.1.15" copyable />
        <DetailHeader.InfoCard label="Node" value="worker-node-01" copyable />
        <DetailHeader.InfoCard label="UID" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(D=(v=l.parameters)==null?void 0:v.docs)==null?void 0:D.source}}};var H,x,b;i.parameters={...i.parameters,docs:{...(H=i.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>production-service</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Health" status="active" value="" />
        <DetailHeader.InfoCard label="Endpoints" value="3 active" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(b=(x=i.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var j,C,h;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>web-server</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Labels" value={<HStack gap={1}>
              <Chip value="app=web" variant="default" />
              <Chip value="env=prod" variant="default" />
            </HStack>} />
        <DetailHeader.InfoCard label="Created" value="Jan 15, 2024 10:30" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(h=(C=s.parameters)==null?void 0:C.docs)==null?void 0:h.source}}};var y,T,S;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'VM Detail Example',
  render: () => <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>production-vm-01</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconPlayerStop size={12} />}>
            Stop
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Instance Type" value="m5.xlarge" />
        <DetailHeader.InfoCard label="Private IP" value="10.0.1.100" copyable />
        <DetailHeader.InfoCard label="Public IP" value="52.14.123.45" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(S=(T=n.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};var P,g,z;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Kubernetes Service Example',
  render: () => <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>frontend-service</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary">
            Edit YAML
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Type" value="ClusterIP" />
        <DetailHeader.InfoCard label="Cluster IP" value="10.96.45.123" copyable />
        <DetailHeader.InfoCard label="Port" value="80/TCP" />
        <DetailHeader.InfoCard label="Target Port" value="8080" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(z=(g=d.parameters)==null?void 0:g.docs)==null?void 0:z.source}}};var G,B,E;o.parameters={...o.parameters,docs:{...(G=o.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>compute-node-01</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="ID" value="n-a1b2c3d4" copyable />
        <DetailHeader.InfoCard label="IOPS" value="3000" tooltip="Input/Output Operations Per Second" />
        <DetailHeader.InfoCard label="Throughput" value="125 MB/s" tooltip="Maximum sustained data transfer rate" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(E=(B=o.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var A,w,M;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>simple-resource</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Created" value="Just now" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(M=(w=c.parameters)==null?void 0:w.docs)==null?void 0:M.source}}};const ce=["Default","WithCopyable","WithStatus","WithCustomValue","VMDetail","ServiceDetail","WithInfoCardTooltip","Minimal"];export{t as Default,c as Minimal,d as ServiceDetail,n as VMDetail,l as WithCopyable,s as WithCustomValue,o as WithInfoCardTooltip,i as WithStatus,ce as __namedExportsOrder,oe as default};
