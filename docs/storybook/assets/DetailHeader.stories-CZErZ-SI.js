import{j as e,r as Q}from"./iframe-B4qQhCO6.js";import{t as s}from"./bundle-mjs-BZSatpsL.js";import{S as X}from"./StatusIndicator-BUC_wwEA.js";import{T as Z}from"./Tooltip-BG2RuLXw.js";import{I as $}from"./IconHelpCircle-C_pNhbAi.js";import{I as ee}from"./IconCheck-BgbQWatL.js";import{I as ae}from"./IconCopy-qMoekWIC.js";import{B as i}from"./Button-BTL-mhRW.js";import{I as V}from"./IconEdit-DTriKS-t.js";import{I as q}from"./IconTrash-CtbT213v.js";import{I as te}from"./IconPlayerStop-DsOv7Crv.js";import{H as re}from"./Stack-Dcn3-Ul-.js";import{C as D}from"./Chip-BFxeTYBR.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bds5dDb0.js";import"./IconTool-WwUgVS44.js";import"./IconCircleX-DBNXelDr.js";import"./IconAlertTriangle-DnJGkjE4.js";import"./index-DWHu83xY.js";import"./IconX-FNl1vDsy.js";function a({children:r,className:t,...l}){return e.jsx("div",{className:s("bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-lg","px-4 pt-3 pb-4","w-full",t),...l,children:r})}function L({children:r,className:t,...l}){return e.jsx("h5",{className:s("text-heading-h5","text-[var(--color-text-default)]","mb-3",t),...l,children:r})}function W({children:r,className:t,...l}){return e.jsx("div",{className:s("flex items-center gap-1","mb-3",t),...l,children:r})}function J({children:r,className:t,...l}){return e.jsx("div",{className:s("flex items-center gap-3","w-full",t),...l,children:r})}function K({label:r,value:t,copyable:l=!1,status:f,tooltip:x,className:O,...U}){const[Y,I]=Q.useState(!1),v=typeof t=="string",F=()=>{v&&(navigator.clipboard.writeText(t),I(!0),setTimeout(()=>I(!1),2e3))};return e.jsxs("div",{className:s("flex-1","bg-[var(--color-surface-subtle)]","rounded-lg","px-4 py-3","relative","min-w-0",O),...U,children:[f&&e.jsx("div",{className:"absolute top-1/2 right-3 -translate-y-1/2",children:e.jsx(X,{status:f,layout:"icon-only",size:"lg"})}),e.jsxs("div",{className:s("flex flex-col gap-1.5 min-w-0",f&&"pr-6"),children:[e.jsxs("span",{className:"text-label-sm leading-4 text-[var(--color-text-subtle)] whitespace-nowrap flex items-center gap-1",children:[r,x&&e.jsx(Z,{content:x,position:"top",children:e.jsx($,{size:12,className:"text-[var(--color-text-subtle)] cursor-help"})})]}),e.jsxs("div",{className:"flex items-center gap-1 min-w-0 min-h-[26px]",children:[v?e.jsx("span",{className:"text-body-md leading-4 font-normal truncate text-[var(--color-text-default)]",title:t,children:t}):t,l&&v&&e.jsx("button",{onClick:F,className:"shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-default)] transition-colors","aria-label":"Copy to clipboard",children:Y?e.jsx(ee,{size:12,className:"text-[var(--color-state-success)]"}):e.jsx(ae,{size:12,className:"text-[var(--color-action-primary)]"})})]})]})]})}a.Title=L;a.Actions=W;a.InfoGrid=J;a.InfoCard=K;a.__docgenInfo={description:"",methods:[{name:"Title",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderTitleProps",optional:!1,type:{name:"DetailHeaderTitleProps",alias:"DetailHeaderTitleProps"}}],returns:null},{name:"Actions",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderActionsProps",optional:!1,type:{name:"DetailHeaderActionsProps",alias:"DetailHeaderActionsProps"}}],returns:null},{name:"InfoGrid",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderInfoGridProps",optional:!1,type:{name:"DetailHeaderInfoGridProps",alias:"DetailHeaderInfoGridProps"}}],returns:null},{name:"InfoCard",docblock:null,modifiers:["static"],params:[{name:`{
  label,
  value,
  copyable = false,
  status,
  tooltip,
  className,
  ...props
}: DetailHeaderInfoCardProps`,optional:!1,type:{name:"DetailHeaderInfoCardProps",alias:"DetailHeaderInfoCardProps"}}],returns:null}],displayName:"DetailHeader",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Child components"}},composes:["HTMLAttributes"]};L.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderTitle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Title text or children"}},composes:["HTMLAttributes"]};W.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderActions",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Action buttons"}},composes:["HTMLAttributes"]};J.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderInfoGrid",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"InfoCard components"}},composes:["HTMLAttributes"]};K.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderInfoCard",props:{label:{required:!0,tsType:{name:"string"},description:"Label for the info card"},value:{required:!0,tsType:{name:"ReactNode"},description:"Value to display - can be string or ReactNode"},copyable:{required:!1,tsType:{name:"boolean"},description:"Show copy button for the value (only works with string values)",defaultValue:{value:"false",computed:!1}},status:{required:!1,tsType:{name:"union",raw:`| 'active'
| 'error'
| 'building'
| 'deleting'
| 'suspended'
| 'shelved'
| 'shelved-offloaded'
| 'mounted'
| 'shutoff'
| 'paused'
| 'pending'
| 'draft'
| 'verify-resized'
| 'deactivated'
| 'in-use'
| 'maintenance'
| 'degraded'
| 'no-monitor'
| 'down'`,elements:[{name:"literal",value:"'active'"},{name:"literal",value:"'error'"},{name:"literal",value:"'building'"},{name:"literal",value:"'deleting'"},{name:"literal",value:"'suspended'"},{name:"literal",value:"'shelved'"},{name:"literal",value:"'shelved-offloaded'"},{name:"literal",value:"'mounted'"},{name:"literal",value:"'shutoff'"},{name:"literal",value:"'paused'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'draft'"},{name:"literal",value:"'verify-resized'"},{name:"literal",value:"'deactivated'"},{name:"literal",value:"'in-use'"},{name:"literal",value:"'maintenance'"},{name:"literal",value:"'degraded'"},{name:"literal",value:"'no-monitor'"},{name:"literal",value:"'down'"}]},description:"Show status indicator instead of value"},tooltip:{required:!1,tsType:{name:"string"},description:"Tooltip text for help icon next to label"}},composes:["Omit"]};const ye={title:"Components/DetailHeader",component:a,tags:["autodocs"],decorators:[r=>e.jsx("div",{style:{maxWidth:"900px"},children:e.jsx(r,{})})],parameters:{docs:{description:{component:`
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
        `}}}},n={render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"nginx-deployment"}),e.jsxs(a.Actions,{children:[e.jsx(i,{size:"sm",variant:"secondary",leftIcon:e.jsx(V,{size:14}),children:"Edit"}),e.jsx(i,{size:"sm",variant:"danger",leftIcon:e.jsx(q,{size:14}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Namespace",value:"default"}),e.jsx(a.InfoCard,{label:"Replicas",value:"3/3"}),e.jsx(a.InfoCard,{label:"Age",value:"5d 12h"})]})]})},o={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"my-pod-7d8f9b6c4-xyz12"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Pod IP",value:"10.244.1.15",copyable:!0}),e.jsx(a.InfoCard,{label:"Node",value:"worker-node-01",copyable:!0}),e.jsx(a.InfoCard,{label:"UID",value:"a1b2c3d4-e5f6-7890-abcd-ef1234567890",copyable:!0})]})]})},d={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"production-service"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Health",status:"success",value:""}),e.jsx(a.InfoCard,{label:"Endpoints",value:"3 active"})]})]})},c={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"web-server"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Labels",value:e.jsxs(re,{gap:1,children:[e.jsx(D,{value:"app=web",variant:"muted"}),e.jsx(D,{value:"env=prod",variant:"muted"})]})}),e.jsx(a.InfoCard,{label:"Created",value:"2024-01-15 10:30"})]})]})},u={name:"VM Detail Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"production-vm-01"}),e.jsxs(a.Actions,{children:[e.jsx(i,{size:"sm",variant:"secondary",leftIcon:e.jsx(te,{size:14}),children:"Stop"}),e.jsx(i,{size:"sm",variant:"secondary",leftIcon:e.jsx(V,{size:14}),children:"Edit"}),e.jsx(i,{size:"sm",variant:"danger",leftIcon:e.jsx(q,{size:14}),children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Instance Type",value:"m5.xlarge"}),e.jsx(a.InfoCard,{label:"Private IP",value:"10.0.1.100",copyable:!0}),e.jsx(a.InfoCard,{label:"Public IP",value:"52.14.123.45",copyable:!0})]})]})},p={name:"Kubernetes Service Example",render:()=>e.jsxs(a,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a.Title,{children:"frontend-service"}),e.jsxs(a.Actions,{children:[e.jsx(i,{size:"sm",variant:"secondary",children:"Edit YAML"}),e.jsx(i,{size:"sm",variant:"danger",children:"Delete"})]})]}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Type",value:"ClusterIP"}),e.jsx(a.InfoCard,{label:"Cluster IP",value:"10.96.45.123",copyable:!0}),e.jsx(a.InfoCard,{label:"Port",value:"80/TCP"}),e.jsx(a.InfoCard,{label:"Target Port",value:"8080"})]})]})},m={render:()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"simple-resource"}),e.jsxs(a.InfoGrid,{children:[e.jsx(a.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(a.InfoCard,{label:"Created",value:"Just now"})]})]})};var b,H,h;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>nginx-deployment</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={14} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={14} />}>
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
}`,...(h=(H=n.parameters)==null?void 0:H.docs)==null?void 0:h.source}}};var j,C,y;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>my-pod-7d8f9b6c4-xyz12</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Pod IP" value="10.244.1.15" copyable />
        <DetailHeader.InfoCard label="Node" value="worker-node-01" copyable />
        <DetailHeader.InfoCard label="UID" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(y=(C=o.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var T,g,N;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>production-service</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Health" status="success" value="" />
        <DetailHeader.InfoCard label="Endpoints" value="3 active" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(N=(g=d.parameters)==null?void 0:g.docs)==null?void 0:N.source}}};var P,S,z;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>web-server</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Labels" value={<HStack gap={1}>
              <Chip value="app=web" variant="muted" />
              <Chip value="env=prod" variant="muted" />
            </HStack>} />
        <DetailHeader.InfoCard label="Created" value="2024-01-15 10:30" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(z=(S=c.parameters)==null?void 0:S.docs)==null?void 0:z.source}}};var G,w,A;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'VM Detail Example',
  render: () => <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>production-vm-01</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconPlayerStop size={14} />}>
            Stop
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={14} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={14} />}>
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
}`,...(A=(w=u.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var E,B,M;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(M=(B=p.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var k,_,R;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <DetailHeader>
      <DetailHeader.Title>simple-resource</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Created" value="Just now" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
}`,...(R=(_=m.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};const Te=["Default","WithCopyable","WithStatus","WithCustomValue","VMDetail","ServiceDetail","Minimal"];export{n as Default,m as Minimal,p as ServiceDetail,u as VMDetail,o as WithCopyable,c as WithCustomValue,d as WithStatus,Te as __namedExportsOrder,ye as default};
