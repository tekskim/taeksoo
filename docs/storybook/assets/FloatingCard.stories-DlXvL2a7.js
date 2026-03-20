import{r as E,j as e}from"./iframe-ko1KmZFS.js";import{r as ye}from"./index-ChYZSdsP.js";import{t as Ne}from"./cn-BMXv33oC.js";import{I as je}from"./IconX-CZRrzHtO.js";import{I as Ie}from"./IconChevronDown-BvjhRmI4.js";import{I as Te}from"./IconChevronRight-BpkBDwLd.js";import{c as we}from"./createReactComponent-B-brzlrB.js";import{P as Se}from"./ProgressBar-BJLj6onR.js";import{N as ke}from"./NumberInput-s3iG6DeN.js";import{B as A}from"./Button-BQge8bfe.js";import{I as Ee}from"./IconCircleDashed-BN0jh8J_.js";import{I as Ae}from"./IconProgress-Cx6hVvrY.js";import{I as qe}from"./IconAlertTriangle-RSM7ayVf.js";import{I as Ve}from"./IconCheck-BA2DoG5q.js";import"./preload-helper-C1FmrZbK.js";import"./IconAlertCircle-GZBv8N7A.js";import"./IconChevronUp-D3wAWK98.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0",key:"svg-1"}],["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-2"}]],q=we("outline","target","Target",Be),V={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4"};function ze({status:i}){switch(i){case"success":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center",children:e.jsx(Ve,{size:10,stroke:2,className:"text-white"})});case"warning":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center",children:e.jsx(qe,{size:10,stroke:2,className:"text-white"})});case"processing":return e.jsx("div",{className:"size-4 shrink-0 flex items-center justify-center",children:e.jsx(Ae,{size:20,stroke:1.5,className:"text-[var(--color-text-muted)]"})});default:return e.jsx("div",{className:"size-4 shrink-0 flex items-center justify-center",children:e.jsx(Ee,{size:20,stroke:1.5,className:"text-[var(--color-border-default)]"})})}}function a({title:i,sections:l=[],quota:y=[],instanceCount:ie=1,onInstanceCountChange:N,cancelLabel:oe="Cancel",actionLabel:ne="Create",actionEnabled:ce=!1,onCancel:x,onAction:b,position:ue="top-left",showCloseButton:de=!1,onClose:j,isOpen:pe=!0,zIndex:I,portal:h=!0,width:me="320px",className:fe,style:ge,...ve}){const[xe,T]=E.useState(()=>{const t={};return l.forEach((s,o)=>{t[o]=s.collapsible?s.defaultExpanded??!0:!0}),t});if(E.useEffect(()=>{const t={};l.forEach((s,o)=>{t[o]=s.collapsible?s.defaultExpanded??!0:!0}),T(t)},[l]),!pe)return null;const be=t=>{T(s=>({...s,[t]:!s[t]}))},he=[h?"fixed":"relative","z-[var(--z-popover)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--primitive-radius-lg)]","overflow-hidden","flex flex-col","h-fit","max-h-[calc(100vh-2rem)]",...h?[V[ue||"top-left"]||V["top-left"]]:[]],Ce={...ge,width:me,...I&&{zIndex:I}},C=e.jsxs("div",{"data-figma-name":"[TDS] FloatingCard",className:Ne(he.join(" "),fe),style:Ce,...ve,children:[de&&j&&e.jsx("button",{type:"button",onClick:j,className:`
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
          `,"aria-label":"Close",children:e.jsx(je,{size:12,stroke:1})}),e.jsxs("div",{className:"flex flex-col h-fit min-h-0 gap-0",children:[e.jsxs("div",{className:"overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md",style:{maxHeight:"340px",minHeight:"160px",padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-subtle)"},children:[e.jsx("h2",{className:"text-label-lg text-[var(--color-text-default)] shrink-0",children:i}),l&&l.length>0&&e.jsx("div",{className:"flex flex-col gap-6 w-full",children:l.map((t,s)=>{const o=t.items.length>0&&t.items.every(r=>r.status==="success"),w=t.showSuccessIcon&&o,S=t.collapsible??t.items.length>0,k=xe[s]??t.defaultExpanded??!0;return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[S?e.jsxs("button",{type:"button",onClick:()=>be(s),className:"flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[k?e.jsx(Ie,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}):e.jsx(Te,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}),e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle})]}),w&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(q,{size:12,stroke:1})})]}):e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle}),w&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(q,{size:12,stroke:1})})]}),S&&k&&t.items.length>0&&e.jsx("div",{className:"flex flex-col gap-1 pl-4 w-full",children:t.items.map(r=>e.jsxs("button",{type:"button",className:"flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]",onClick:r.onClick,disabled:!r.onClick,children:[e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors",children:r.title}),r.status==="writing"?e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)] shrink-0",children:"Writing..."}):e.jsx(ze,{status:r.status})]},r.id))})]},s)})})]}),y.length>0&&e.jsx("div",{className:"shrink-0 m-4 rounded-md",style:{padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-default)"},children:e.jsxs("div",{className:"flex flex-col items-start gap-3 w-full",children:[e.jsx("h3",{className:"text-label-md text-[var(--color-text-default)]",children:"Quota"}),e.jsx("div",{className:"flex flex-col gap-3 w-full",children:y.map((t,s)=>e.jsxs("div",{className:"flex flex-col gap-1 w-full",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:t.label}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-muted)]",children:[t.current,"/",t.total,t.unit?` ${t.unit}`:""]})]}),e.jsx(Se,{value:t.current,max:t.total,variant:"default",showValue:!1,className:"h-1"})]},s))})]})}),N&&e.jsxs("div",{className:"px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[e.jsx("label",{className:"text-label-md text-[var(--color-text-default)]",children:"Number of Instances"}),e.jsx(ke,{value:ie,onChange:t=>N(t),min:1,size:"sm",fullWidth:!0})]}),(x||b)&&e.jsxs("div",{className:"px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[x&&e.jsx(A,{variant:"secondary",size:"md",onClick:x,className:"flex-[0.3]",children:oe}),b&&e.jsx(A,{variant:"primary",size:"md",onClick:b,disabled:!ce,className:"flex-[0.7]",children:ne})]})]})]});return h&&typeof document<"u"&&document.body?ye.createPortal(C,document.body):C}a.__docgenInfo={description:"",methods:[],displayName:"FloatingCard",props:{title:{required:!0,tsType:{name:"string"},description:""},sections:{required:!1,tsType:{name:"Array",elements:[{name:"FloatingCardSection"}],raw:"FloatingCardSection[]"},description:"",defaultValue:{value:"[]",computed:!1}},quota:{required:!1,tsType:{name:"Array",elements:[{name:"QuotaItem"}],raw:"QuotaItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},instanceCount:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},onInstanceCountChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(count: number) => void",signature:{arguments:[{type:{name:"number"},name:"count"}],return:{name:"void"}}},description:""},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Cancel'",computed:!1}},actionLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Create'",computed:!1}},actionEnabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},position:{required:!1,tsType:{name:"union",raw:"'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",elements:[{name:"literal",value:"'top-left'"},{name:"literal",value:"'top-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'bottom-right'"}]},description:"",defaultValue:{value:"'top-left'",computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},zIndex:{required:!1,tsType:{name:"number"},description:""},portal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},width:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'320px'",computed:!1}}},composes:["Omit"]};const Ze={title:"Components/FloatingCard",component:a,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
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
        `}}},argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"화면 위치",table:{defaultValue:{summary:"top-left"}}},actionEnabled:{control:"boolean",description:"액션 버튼 활성화",table:{defaultValue:{summary:"false"}}},showCloseButton:{control:"boolean",description:"닫기 버튼 표시",table:{defaultValue:{summary:"false"}}}}},n={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Basic Information",items:[{id:"1",title:"Instance Name",status:"success"},{id:"2",title:"Description",status:"success"}]},{tabTitle:"Configuration",items:[{id:"3",title:"Instance Type",status:"processing"},{id:"4",title:"Storage",status:"default"}]}],onCancel:()=>console.log("Cancel"),onAction:()=>console.log("Create")})})},c={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create VM Instance",portal:!1,sections:[{tabTitle:"Instance Settings",items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Type",status:"success"},{id:"3",title:"Image",status:"success"}]}],quota:[{label:"vCPU",current:8,total:32},{label:"Memory",current:16,total:128,unit:"GB"},{label:"Storage",current:100,total:500,unit:"GB"}],onCancel:()=>{},onAction:()=>{}})})},u={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Deploy Application",portal:!1,sections:[{tabTitle:"Deployment",items:[{id:"1",title:"Image",status:"success"},{id:"2",title:"Ports",status:"success"}]}],instanceCount:3,onInstanceCountChange:i=>console.log("Count:",i),actionLabel:"Deploy",actionEnabled:!0,onCancel:()=>{},onAction:()=>{}})})},d={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Status Examples",portal:!1,sections:[{tabTitle:"Various Statuses",items:[{id:"1",title:"Completed Item",status:"success"},{id:"2",title:"Processing Item",status:"processing"},{id:"3",title:"Warning Item",status:"warning"},{id:"4",title:"Pending Item",status:"default"}]}],onCancel:()=>{},onAction:()=>{}})})},p={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Ready to Create",portal:!1,sections:[{tabTitle:"Configuration",showSuccessIcon:!0,items:[{id:"1",title:"All settings configured",status:"success"}]}],actionEnabled:!0,actionLabel:"Create Instance",onCancel:()=>{},onAction:()=>{}})})},m={render:()=>e.jsx("div",{className:"relative h-[400px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Summary",portal:!1,showCloseButton:!0,onClose:()=>console.log("Close"),sections:[]})})},f={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Basic Information",items:[{id:"1",title:"Instance Name",status:"success"},{id:"2",title:"Description",status:"writing"}]},{tabTitle:"Configuration",items:[{id:"3",title:"Instance Type",status:"default"},{id:"4",title:"Storage",status:"default"}]}],onCancel:()=>{},onAction:()=>{}})})},g={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Configuration",items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Image",status:"processing"}]}],actionEnabled:!1,actionLabel:"Create Instance",onCancel:()=>{},onAction:()=>{}})})},v={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]",children:e.jsx(a,{title:"Create Kubernetes Deployment",portal:!1,sections:[{tabTitle:"Basic Info",collapsible:!0,defaultExpanded:!0,items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Namespace",status:"success"}]},{tabTitle:"Container",collapsible:!0,defaultExpanded:!0,items:[{id:"3",title:"Image",status:"success"},{id:"4",title:"Resources",status:"processing"},{id:"5",title:"Env Variables",status:"default"}]},{tabTitle:"Networking",collapsible:!0,defaultExpanded:!1,items:[{id:"6",title:"Service",status:"default"},{id:"7",title:"Ingress",status:"default"}]}],quota:[{label:"Pods",current:15,total:100}],onCancel:()=>{},onAction:()=>{}})})};var B,z,D;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(D=(z=n.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var P,F,M;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(M=(F=c.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};var W,L,R;u.parameters={...u.parameters,docs:{...(W=u.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(R=(L=u.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var Q,_,G;d.parameters={...d.parameters,docs:{...(Q=d.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(G=(_=d.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var O,U,H;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(H=(U=p.parameters)==null?void 0:U.docs)==null?void 0:H.source}}};var K,X,$;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div className="relative h-[400px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Summary" portal={false} showCloseButton onClose={() => console.log('Close')} sections={[]} />
    </div>
}`,...($=(X=m.parameters)==null?void 0:X.docs)==null?void 0:$.source}}};var J,Y,Z;f.parameters={...f.parameters,docs:{...(J=f.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
        status: 'writing'
      }]
    }, {
      tabTitle: 'Configuration',
      items: [{
        id: '3',
        title: 'Instance Type',
        status: 'default'
      }, {
        id: '4',
        title: 'Storage',
        status: 'default'
      }]
    }]} onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(Z=(Y=f.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,se;g.parameters={...g.parameters,docs:{...(ee=g.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)]">
      <FloatingCard title="Create Instance" portal={false} sections={[{
      tabTitle: 'Configuration',
      items: [{
        id: '1',
        title: 'Name',
        status: 'success'
      }, {
        id: '2',
        title: 'Image',
        status: 'processing'
      }]
    }]} actionEnabled={false} actionLabel="Create Instance" onCancel={() => {}} onAction={() => {}} />
    </div>
}`,...(se=(te=g.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var ae,re,le;v.parameters={...v.parameters,docs:{...(ae=v.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
}`,...(le=(re=v.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};const et=["Default","WithQuota","WithInstanceCount","AllStatuses","ActionEnabled","WithCloseButton","WritingStatus","DisabledAction","MultipleSections"];export{p as ActionEnabled,d as AllStatuses,n as Default,g as DisabledAction,v as MultipleSections,m as WithCloseButton,u as WithInstanceCount,c as WithQuota,f as WritingStatus,et as __namedExportsOrder,Ze as default};
