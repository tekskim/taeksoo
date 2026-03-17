import{r as S,j as e}from"./iframe-DkQu90e3.js";import{r as me}from"./index-DvWE9N_0.js";import{t as fe}from"./cn-8AORBNJN.js";import{I as ge}from"./IconX-BaIg4cV2.js";import{I as xe}from"./IconChevronDown-Bk0ShmHi.js";import{I as ve}from"./IconChevronRight-CI0CgaLS.js";import{c as be}from"./createReactComponent-Bn1mjhIb.js";import{P as he}from"./ProgressBar-BvuZLKOG.js";import{N as Ce}from"./NumberInput-dnAO0e-q.js";import{B as k}from"./Button-yxfW6jRo.js";import{I as ye}from"./IconCircleDashed-DGaZ99Ig.js";import{I as je}from"./IconProgress-Byh7d_wb.js";import{I as Ne}from"./IconAlertTriangle-6k637Q7w.js";import{I as Ie}from"./IconCheck-BrBu6NVu.js";import"./preload-helper-C1FmrZbK.js";import"./IconAlertCircle-6eENcwff.js";import"./IconChevronUp-d8uXQPdH.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0",key:"svg-1"}],["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-2"}]],E=be("outline","target","Target",Te),A={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4"};function we({status:o}){switch(o){case"success":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center",children:e.jsx(Ie,{size:10,stroke:2,className:"text-white"})});case"warning":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center",children:e.jsx(Ne,{size:10,stroke:2,className:"text-white"})});case"processing":return e.jsx("div",{className:"size-4 shrink-0 flex items-center justify-center",children:e.jsx(je,{size:20,stroke:1.5,className:"text-[var(--color-text-muted)]"})});default:return e.jsx("div",{className:"size-4 shrink-0 flex items-center justify-center",children:e.jsx(ye,{size:20,stroke:1.5,className:"text-[var(--color-border-default)]"})})}}function a({title:o,sections:l=[],quota:h=[],instanceCount:Y=1,onInstanceCountChange:C,cancelLabel:Z="Cancel",actionLabel:ee="Create",actionEnabled:te=!1,onCancel:g,onAction:x,position:se="top-left",showCloseButton:ae=!1,onClose:y,isOpen:re=!0,zIndex:j,portal:v=!0,width:le="320px",className:oe,style:ie,...ne}){const[ce,N]=S.useState(()=>{const t={};return l.forEach((s,i)=>{t[i]=s.collapsible?s.defaultExpanded??!0:!0}),t});if(S.useEffect(()=>{const t={};l.forEach((s,i)=>{t[i]=s.collapsible?s.defaultExpanded??!0:!0}),N(t)},[l]),!re)return null;const ue=t=>{N(s=>({...s,[t]:!s[t]}))},de=[v?"fixed":"relative","z-[var(--z-popover)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--primitive-radius-lg)]","overflow-hidden","flex flex-col","h-fit","max-h-[calc(100vh-2rem)]",...v?[A[se||"top-left"]||A["top-left"]]:[]],pe={...ie,width:le,...j&&{zIndex:j}},b=e.jsxs("div",{"data-figma-name":"FloatingCard",className:fe(de.join(" "),oe),style:pe,...ne,children:[ae&&y&&e.jsx("button",{type:"button",onClick:y,className:`
            absolute top-2 right-2
            flex items-center justify-center
            size-6
            rounded-md
            text-[var(--color-text-muted)]
            hover:bg-[var(--color-surface-subtle)]
            hover:text-[var(--color-text-default)]
            transition-colors duration-[var(--duration-fast)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-border-focus)]
            z-10
          `,"aria-label":"Close",children:e.jsx(ge,{size:12,stroke:1})}),e.jsxs("div",{className:"flex flex-col h-fit min-h-0 gap-0",children:[e.jsxs("div",{className:"overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md",style:{maxHeight:"340px",minHeight:"160px",padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-subtle)"},children:[e.jsx("h2",{className:"text-label-lg text-[var(--color-text-default)] shrink-0",children:o}),l&&l.length>0&&e.jsx("div",{className:"flex flex-col gap-6 w-full",children:l.map((t,s)=>{const i=t.items.length>0&&t.items.every(r=>r.status==="success"),I=t.showSuccessIcon&&i,T=t.collapsible??t.items.length>0,w=ce[s]??t.defaultExpanded??!0;return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[T?e.jsxs("button",{type:"button",onClick:()=>ue(s),className:"flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[w?e.jsx(xe,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}):e.jsx(ve,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}),e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle})]}),I&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(E,{size:12,stroke:1})})]}):e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle}),I&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(E,{size:12,stroke:1})})]}),T&&w&&t.items.length>0&&e.jsx("div",{className:"flex flex-col gap-1 pl-4 w-full",children:t.items.map(r=>e.jsxs("button",{type:"button",className:"flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]",onClick:r.onClick,disabled:!r.onClick,children:[e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors",children:r.title}),r.status==="writing"?e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)] shrink-0",children:"Writing..."}):e.jsx(we,{status:r.status})]},r.id))})]},s)})})]}),h.length>0&&e.jsx("div",{className:"shrink-0 m-4 rounded-md",style:{padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-default)"},children:e.jsxs("div",{className:"flex flex-col items-start gap-3 w-full",children:[e.jsx("h3",{className:"text-label-md text-[var(--color-text-default)]",children:"Quota"}),e.jsx("div",{className:"flex flex-col gap-3 w-full",children:h.map((t,s)=>e.jsxs("div",{className:"flex flex-col gap-1 w-full",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:t.label}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-muted)]",children:[t.current,"/",t.total,t.unit?` ${t.unit}`:""]})]}),e.jsx(he,{value:t.current,max:t.total,variant:"default",showValue:!1,className:"h-1"})]},s))})]})}),C&&e.jsxs("div",{className:"px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[e.jsx("label",{className:"text-label-md text-[var(--color-text-default)]",children:"Number of Instances"}),e.jsx(Ce,{value:Y,onChange:t=>C(t),min:1,size:"sm",fullWidth:!0})]}),(g||x)&&e.jsxs("div",{className:"px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[g&&e.jsx(k,{variant:"secondary",size:"md",onClick:g,className:"flex-[0.3]",children:Z}),x&&e.jsx(k,{variant:"primary",size:"md",onClick:x,disabled:!te,className:"flex-[0.7]",children:ee})]})]})]});return v&&typeof document<"u"&&document.body?me.createPortal(b,document.body):b}a.__docgenInfo={description:"",methods:[],displayName:"FloatingCard",props:{title:{required:!0,tsType:{name:"string"},description:""},sections:{required:!1,tsType:{name:"Array",elements:[{name:"FloatingCardSection"}],raw:"FloatingCardSection[]"},description:"",defaultValue:{value:"[]",computed:!1}},quota:{required:!1,tsType:{name:"Array",elements:[{name:"QuotaItem"}],raw:"QuotaItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},instanceCount:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},onInstanceCountChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(count: number) => void",signature:{arguments:[{type:{name:"number"},name:"count"}],return:{name:"void"}}},description:""},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Cancel'",computed:!1}},actionLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Create'",computed:!1}},actionEnabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},position:{required:!1,tsType:{name:"union",raw:"'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",elements:[{name:"literal",value:"'top-left'"},{name:"literal",value:"'top-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'bottom-right'"}]},description:"",defaultValue:{value:"'top-left'",computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},zIndex:{required:!1,tsType:{name:"number"},description:""},portal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},width:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'320px'",computed:!1}}},composes:["Omit"]};const Oe={title:"Components/FloatingCard",component:a,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
## FloatingCard 컴포넌트

리소스 생성 위자드 등에서 사용하는 플로팅 요약 카드입니다.

### 특징
- 화면 모서리에 고정 위치 (top-left, top-right, bottom-left, bottom-right)
- 섹션별 상태 표시 (success, warning, processing, default)
- 쿼타(Quota) 진행률 표시
- 인스턴스 개수 입력
- 액션 버튼 (Cancel, Create)

### 사용 시기
- VM, Pod 생성 위자드
- 리소스 설정 요약 표시
- 진행 상태 추적

### 예시
\`\`\`tsx
<FloatingCard
  title="Create Instance"
  sections={[
    {
      tabTitle: 'Basic Info',
      items: [
        { id: '1', title: 'Name', status: 'success' },
        { id: '2', title: 'Type', status: 'processing' },
      ],
    },
  ]}
  quota={[
    { label: 'vCPU', current: 4, total: 20 },
    { label: 'Memory', current: 8, total: 64, unit: 'GB' },
  ]}
  onCancel={() => {}}
  onAction={() => {}}
/>
\`\`\`
        `}}},argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"화면 위치",table:{defaultValue:{summary:"top-left"}}},actionEnabled:{control:"boolean",description:"액션 버튼 활성화",table:{defaultValue:{summary:"false"}}},showCloseButton:{control:"boolean",description:"닫기 버튼 표시",table:{defaultValue:{summary:"false"}}}}},n={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Basic Information",items:[{id:"1",title:"Instance Name",status:"success"},{id:"2",title:"Description",status:"success"}]},{tabTitle:"Configuration",items:[{id:"3",title:"Instance Type",status:"processing"},{id:"4",title:"Storage",status:"default"}]}],onCancel:()=>console.log("Cancel"),onAction:()=>console.log("Create")})})},c={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create VM Instance",portal:!1,sections:[{tabTitle:"Instance Settings",items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Type",status:"success"},{id:"3",title:"Image",status:"success"}]}],quota:[{label:"vCPU",current:8,total:32},{label:"Memory",current:16,total:128,unit:"GB"},{label:"Storage",current:100,total:500,unit:"GB"}],onCancel:()=>{},onAction:()=>{}})})},u={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Deploy Application",portal:!1,sections:[{tabTitle:"Deployment",items:[{id:"1",title:"Image",status:"success"},{id:"2",title:"Ports",status:"success"}]}],instanceCount:3,onInstanceCountChange:o=>console.log("Count:",o),actionLabel:"Deploy",actionEnabled:!0,onCancel:()=>{},onAction:()=>{}})})},d={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Status Examples",portal:!1,sections:[{tabTitle:"Various Statuses",items:[{id:"1",title:"Completed Item",status:"success"},{id:"2",title:"Processing Item",status:"processing"},{id:"3",title:"Warning Item",status:"warning"},{id:"4",title:"Pending Item",status:"default"}]}],onCancel:()=>{},onAction:()=>{}})})},p={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Ready to Create",portal:!1,sections:[{tabTitle:"Configuration",showSuccessIcon:!0,items:[{id:"1",title:"All settings configured",status:"success"}]}],actionEnabled:!0,actionLabel:"Create Instance",onCancel:()=>{},onAction:()=>{}})})},m={render:()=>e.jsx("div",{className:"relative h-[400px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Summary",portal:!1,showCloseButton:!0,onClose:()=>console.log("Close"),sections:[]})})},f={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Kubernetes Deployment",portal:!1,sections:[{tabTitle:"Basic Info",collapsible:!0,defaultExpanded:!0,items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Namespace",status:"success"}]},{tabTitle:"Container",collapsible:!0,defaultExpanded:!0,items:[{id:"3",title:"Image",status:"success"},{id:"4",title:"Resources",status:"processing"},{id:"5",title:"Env Variables",status:"default"}]},{tabTitle:"Networking",collapsible:!0,defaultExpanded:!1,items:[{id:"6",title:"Service",status:"default"},{id:"7",title:"Ingress",status:"default"}]}],quota:[{label:"Pods",current:15,total:100}],onCancel:()=>{},onAction:()=>{}})})};var q,V,z;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Create Instance" portal={false} sections={[{
      tabTitle: 'Basic Information',
      items: [{
        id: '1',
        title: 'Instance Name',
        status: 'success'
      }, {
        id: '2',
        title: 'Description',
        status: 'success'
      }]
    }, {
      tabTitle: 'Configuration',
      items: [{
        id: '3',
        title: 'Instance Type',
        status: 'processing'
      }, {
        id: '4',
        title: 'Storage',
        status: 'default'
      }]
    }]} onCancel={() => console.log('Cancel')} onAction={() => console.log('Create')} />
    </div>
}`,...(z=(V=n.parameters)==null?void 0:V.docs)==null?void 0:z.source}}};var B,P,D;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Create VM Instance" portal={false} sections={[{
      tabTitle: 'Instance Settings',
      items: [{
        id: '1',
        title: 'Name',
        status: 'success'
      }, {
        id: '2',
        title: 'Type',
        status: 'success'
      }, {
        id: '3',
        title: 'Image',
        status: 'success'
      }]
    }]} quota={[{
      label: 'vCPU',
      current: 8,
      total: 32
    }, {
      label: 'Memory',
      current: 16,
      total: 128,
      unit: 'GB'
    }, {
      label: 'Storage',
      current: 100,
      total: 500,
      unit: 'GB'
    }]} onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(D=(P=c.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};var F,M,W;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Deploy Application" portal={false} sections={[{
      tabTitle: 'Deployment',
      items: [{
        id: '1',
        title: 'Image',
        status: 'success'
      }, {
        id: '2',
        title: 'Ports',
        status: 'success'
      }]
    }]} instanceCount={3} onInstanceCountChange={count => console.log('Count:', count)} actionLabel="Deploy" actionEnabled onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(W=(M=u.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var R,L,Q;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Status Examples" portal={false} sections={[{
      tabTitle: 'Various Statuses',
      items: [{
        id: '1',
        title: 'Completed Item',
        status: 'success'
      }, {
        id: '2',
        title: 'Processing Item',
        status: 'processing'
      }, {
        id: '3',
        title: 'Warning Item',
        status: 'warning'
      }, {
        id: '4',
        title: 'Pending Item',
        status: 'default'
      }]
    }]} onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(Q=(L=d.parameters)==null?void 0:L.docs)==null?void 0:Q.source}}};var _,G,O;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Ready to Create" portal={false} sections={[{
      tabTitle: 'Configuration',
      showSuccessIcon: true,
      items: [{
        id: '1',
        title: 'All settings configured',
        status: 'success'
      }]
    }]} actionEnabled actionLabel="Create Instance" onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(O=(G=p.parameters)==null?void 0:G.docs)==null?void 0:O.source}}};var U,H,K;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="relative h-[400px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Summary" portal={false} showCloseButton onClose={() => console.log('Close')} sections={[]} />
    </div>
}`,...(K=(H=m.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var X,$,J;f.parameters={...f.parameters,docs:{...(X=f.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Create Kubernetes Deployment" portal={false} sections={[{
      tabTitle: 'Basic Info',
      collapsible: true,
      defaultExpanded: true,
      items: [{
        id: '1',
        title: 'Name',
        status: 'success'
      }, {
        id: '2',
        title: 'Namespace',
        status: 'success'
      }]
    }, {
      tabTitle: 'Container',
      collapsible: true,
      defaultExpanded: true,
      items: [{
        id: '3',
        title: 'Image',
        status: 'success'
      }, {
        id: '4',
        title: 'Resources',
        status: 'processing'
      }, {
        id: '5',
        title: 'Env Variables',
        status: 'default'
      }]
    }, {
      tabTitle: 'Networking',
      collapsible: true,
      defaultExpanded: false,
      items: [{
        id: '6',
        title: 'Service',
        status: 'default'
      }, {
        id: '7',
        title: 'Ingress',
        status: 'default'
      }]
    }]} quota={[{
      label: 'Pods',
      current: 15,
      total: 100
    }]} onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(J=($=f.parameters)==null?void 0:$.docs)==null?void 0:J.source}}};const Ue=["Default","WithQuota","WithInstanceCount","AllStatuses","ActionEnabled","WithCloseButton","MultipleSections"];export{p as ActionEnabled,d as AllStatuses,n as Default,f as MultipleSections,m as WithCloseButton,u as WithInstanceCount,c as WithQuota,Ue as __namedExportsOrder,Oe as default};
