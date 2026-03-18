import{j as e}from"./iframe-BkR05wRD.js";import{D as a}from"./DetailHeader-DXzUQprT.js";import{B as r}from"./Button-DmmxS_sv.js";import{I as E}from"./IconEdit-18B-s2ds.js";import{I as A}from"./IconTrash-46QWzYvF.js";import{I as N}from"./IconPlayerStop-CQDjLHlu.js";import{H as M}from"./Stack-D9GG5xhK.js";import{C as c}from"./Chip-C4mYQ04J.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./InfoBox-BFQKuHQD.js";import"./StatusIndicator-DNST8AmZ.js";import"./IconTool-DMGxq9yR.js";import"./createReactComponent-BvkjW2jm.js";import"./IconAlertCircle-CF4UH8B-.js";import"./IconAlertTriangle-BPJbjDzO.js";import"./Tooltip-NO5EuKlG.js";import"./index-CpsW5Voa.js";import"./IconInfoCircle-BaltZZZu.js";import"./IconCheck-CIJ6FU2k.js";import"./IconCopy-BSPwqmBh.js";import"./IconX-pKxMf0CS.js";const ie={title:"Components/DetailHeader",component:a,tags:["autodocs"],decorators:[w=>e.jsx("div",{style:{maxWidth:"900px"},children:e.jsx(w,{})})],parameters:{docs:{description:{component:`
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
        `}}}},t={render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"nginx-deployment"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(E,{size:12}),children:"Edit"}),e.jsx(r,{size:"sm",variant:"danger",leftIcon:e.jsx(A,{size:12}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Namespace",value:"default"}),e.jsx(a.InfoCard,{label:"Replicas",value:"3/3"}),e.jsx(a.InfoCard,{label:"Age",value:"5d 12h"})]})]})},l={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"my-pod-7d8f9b6c4-xyz12"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Pod IP",value:"10.244.1.15",copyable:!0}),e.jsx(a.InfoCard,{label:"Node",value:"worker-node-01",copyable:!0}),e.jsx(a.InfoCard,{label:"UID",value:"a1b2c3d4-e5f6-7890-abcd-ef1234567890",copyable:!0})]})]})},i={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"production-service"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Health",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Endpoints",value:"3 active"})]})]})},s={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"web-server"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Labels",value:e.jsxs(M,{gap:1,children:[e.jsx(c,{value:"app=web",variant:"default"}),e.jsx(c,{value:"env=prod",variant:"default"})]})}),e.jsx(a.InfoCard,{label:"Created",value:"Jan 15, 2024 10:30"})]})]})},n={name:"VM Detail Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"production-vm-01"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(N,{size:12}),children:"Stop"}),e.jsx(r,{size:"sm",variant:"secondary",leftIcon:e.jsx(E,{size:12}),children:"Edit"}),e.jsx(r,{size:"sm",variant:"danger",leftIcon:e.jsx(A,{size:12}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Instance Type",value:"m5.xlarge"}),e.jsx(a.InfoCard,{label:"Private IP",value:"10.0.1.100",copyable:!0}),e.jsx(a.InfoCard,{label:"Public IP",value:"52.14.123.45",copyable:!0})]})]})},d={name:"Kubernetes Service Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"frontend-service"}),e.jsxs(a.Actions,{children:[e.jsx(r,{size:"sm",variant:"secondary",children:"Edit YAML"}),e.jsx(r,{size:"sm",variant:"danger",children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Type",value:"ClusterIP"}),e.jsx(a.InfoCard,{label:"Cluster IP",value:"10.96.45.123",copyable:!0}),e.jsx(a.InfoCard,{label:"Port",value:"80/TCP"}),e.jsx(a.InfoCard,{label:"Target Port",value:"8080"})]})]})},o={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"simple-resource"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Created",value:"Just now"})]})]})};var u,m,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(f=(m=t.parameters)==null?void 0:m.docs)==null?void 0:f.source}}};var p,v,I;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>my-pod-7d8f9b6c4-xyz12</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Pod IP" value="10.244.1.15" copyable />
        <DetailHeader.InfoCard label="Node" value="worker-node-01" copyable />
        <DetailHeader.InfoCard label="UID" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(I=(v=l.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var D,H,x;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>production-service</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Health" status="active" value="" />
        <DetailHeader.InfoCard label="Endpoints" value="3 active" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(x=(H=i.parameters)==null?void 0:H.docs)==null?void 0:x.source}}};var b,j,C;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(C=(j=s.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var h,y,T;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(T=(y=n.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var S,z,P;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(P=(z=d.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var g,G,B;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>simple-resource</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Created" value="Just now" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(B=(G=o.parameters)==null?void 0:G.docs)==null?void 0:B.source}}};const se=["Default","WithCopyable","WithStatus","WithCustomValue","VMDetail","ServiceDetail","Minimal"];export{t as Default,o as Minimal,d as ServiceDetail,n as VMDetail,l as WithCopyable,s as WithCustomValue,i as WithStatus,se as __namedExportsOrder,ie as default};
