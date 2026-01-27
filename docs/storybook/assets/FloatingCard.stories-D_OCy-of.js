import{r as b,j as e}from"./iframe-D96dQDLz.js";import{r as xe}from"./index-Dm9gNcw7.js";import{t as ve}from"./bundle-mjs-BZSatpsL.js";import{I as be}from"./IconX-DlnDTnrf.js";import{I as ge}from"./IconChevronDown-B3KfbvkI.js";import{I as he}from"./IconChevronRight-DfXvK1WI.js";import{c as ye}from"./createReactComponent-Dvr8b43U.js";import{P as Ce}from"./ProgressBar-Bu5dScw2.js";import{I as Ne}from"./IconChevronUp-ZtmF7E_l.js";import{B as G}from"./Button-BBWIKsKq.js";import{I as je}from"./IconLoader2-BDnN6LXY.js";import{I as Ie}from"./IconAlertTriangle-DhegDY0-.js";import{I as we}from"./IconCheck-KE79Jf-a.js";import"./preload-helper-C1FmrZbK.js";import"./IconAlertCircle-B9pPO_v_.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0",key:"svg-1"}],["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-2"}]],U=ye("outline","target","Target",Te),$=b.forwardRef(({label:p,helperText:o,error:i,fullWidth:M=!1,min:n,max:c,step:h=1,value:y,defaultValue:C,onChange:m,className:_="",id:W,disabled:l,hideSteppers:S=!1,...k},N)=>{const f=W||`number-input-${Math.random().toString(36).substr(2,9)}`,x=y!==void 0,[L,z]=b.useState(C),u=x?y:L,j=b.useCallback(r=>{let s=r;return n!==void 0&&s<n&&(s=n),c!==void 0&&s>c&&(s=c),s},[n,c]),I=b.useCallback(r=>{const s=j(r);x||z(s),m==null||m(s)},[x,j,m]),R=()=>{l||I((u??0)+h)},q=()=>{l||I((u??0)-h)},Q=r=>{const s=r.target.value;if(s===""){x||z(void 0);return}const T=parseFloat(s);isNaN(T)||I(T)},w=r=>{l||(r.key==="ArrowUp"?(r.preventDefault(),R()):r.key==="ArrowDown"&&(r.preventDefault(),q()))},t=ve("w-full","h-[var(--number-input-height)]","pl-[var(--input-padding-x)]",S?"pr-[var(--input-padding-x)]":"pr-8","py-[var(--number-input-padding-y)]","text-[length:var(--input-font-size)]","leading-[var(--input-line-height)]","bg-[var(--input-bg)]","text-[var(--color-text-default)]","border-[length:var(--input-border-width)]","border-solid","rounded-[var(--input-radius)]","transition-all duration-[var(--duration-fast)]","focus:outline-none","focus:border-[var(--input-border-focus)]","focus:shadow-[0_0_0_1px_var(--input-border-focus)]","[appearance:textfield]","[&::-webkit-outer-spin-button]:appearance-none","[&::-webkit-inner-spin-button]:appearance-none",i?"border-[var(--input-border-error)]":"border-[var(--input-border)]",l?"bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed":"",_),a=["flex flex-col gap-[var(--input-label-gap)]",M?"w-full":"w-fit"].join(" "),v=["flex items-center justify-center","w-[var(--number-input-button-size)]","h-[var(--number-input-button-size)]","text-[var(--color-text-subtle)]","hover:text-[var(--color-text-default)]","transition-colors duration-[var(--duration-fast)]",l?"pointer-events-none opacity-50":"cursor-pointer"].join(" ");return e.jsxs("div",{className:a,children:[p&&e.jsx("label",{htmlFor:f,className:"font-medium text-[var(--color-text-default)] text-[length:var(--font-size-11)]",children:p}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{ref:N,type:"number",id:f,className:t,value:u??"",onChange:Q,onKeyDown:w,disabled:l,min:n,max:c,step:h,"aria-invalid":!!i,"aria-describedby":i?`${f}-error`:o?`${f}-helper`:void 0,...k}),!S&&e.jsxs("div",{className:"absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 flex flex-col",children:[e.jsx("button",{type:"button",tabIndex:-1,className:v,onClick:R,disabled:l||c!==void 0&&u!==void 0&&u>=c,"aria-label":"Increase value",children:e.jsx(Ne,{size:12,strokeWidth:2})}),e.jsx("button",{type:"button",tabIndex:-1,className:v,onClick:q,disabled:l||n!==void 0&&u!==void 0&&u<=n,"aria-label":"Decrease value",children:e.jsx(ge,{size:12,strokeWidth:2})})]})]}),i&&e.jsx("p",{id:`${f}-error`,className:"text-[length:var(--font-size-11)] text-[var(--color-state-danger)]",children:i}),o&&!i&&e.jsx("p",{id:`${f}-helper`,className:"text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]",children:o})]})});$.displayName="NumberInput";$.__docgenInfo={description:"",methods:[],displayName:"NumberInput",props:{label:{required:!1,tsType:{name:"string"},description:"Label text"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text"},error:{required:!1,tsType:{name:"string"},description:"Error message"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},min:{required:!1,tsType:{name:"number"},description:"Minimum value"},max:{required:!1,tsType:{name:"number"},description:"Maximum value"},step:{required:!1,tsType:{name:"number"},description:"Step value",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"number"},description:"Current value (controlled)"},defaultValue:{required:!1,tsType:{name:"number"},description:"Default value (uncontrolled)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Change handler"},hideSteppers:{required:!1,tsType:{name:"boolean"},description:"Hide stepper buttons",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const H={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4"};function Se({status:p}){switch(p){case"success":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center",children:e.jsx(we,{size:10,stroke:2,className:"text-white"})});case"warning":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center",children:e.jsx(Ie,{size:10,stroke:2,className:"text-white"})});case"processing":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 flex items-center justify-center",style:{borderStyle:"dashed"},children:e.jsx(je,{size:10,stroke:2,className:"text-[var(--color-text-muted)] animate-spin"})});default:return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-border-default)] shrink-0",style:{borderStyle:"dashed"}})}}function d({title:p,sections:o=[],quota:i=[],instanceCount:M=1,onInstanceCountChange:n,cancelLabel:c="Cancel",actionLabel:h="Create",actionEnabled:y=!1,onCancel:C,onAction:m,position:_="top-left",showCloseButton:W=!1,onClose:l,isOpen:S=!0,zIndex:k,portal:N=!0,width:f="320px",className:x,style:L,...z}){const[u,j]=b.useState(()=>{const t={};return o.forEach((a,v)=>{t[v]=a.collapsible?a.defaultExpanded??!0:!0}),t});if(b.useEffect(()=>{const t={};o.forEach((a,v)=>{t[v]=a.collapsible?a.defaultExpanded??!0:!0}),j(t)},[o]),!S)return null;const I=t=>{j(a=>({...a,[t]:!a[t]}))},q=[N?"fixed":"relative","z-[var(--z-popover)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[8px]","overflow-hidden","flex flex-col","h-fit","max-h-[calc(100vh-2rem)]",...N?[H[_||"top-left"]||H["top-left"]]:[]],Q={...L,width:f,...k&&{zIndex:k}},w=e.jsxs("div",{className:ve(q.join(" "),x),style:Q,...z,children:[W&&l&&e.jsx("button",{type:"button",onClick:l,className:`
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
          `,"aria-label":"Close",children:e.jsx(be,{size:16,stroke:1})}),e.jsxs("div",{className:"flex flex-col h-fit min-h-0 gap-0",children:[e.jsxs("div",{className:"overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md",style:{maxHeight:"340px",minHeight:"160px",padding:"16px",border:"1px solid var(--color-border-default, #E2E8F0)",background:"var(--color-surface-subtle, #F8FAFC)"},children:[e.jsx("h2",{className:"font-medium text-[length:var(--font-size-14)] leading-[var(--line-height-20)] text-[var(--color-text-default)] shrink-0",children:p}),o&&o.length>0&&e.jsx("div",{className:"flex flex-col gap-6 w-full",children:o.map((t,a)=>{const v=t.items.length>0&&t.items.every(g=>g.status==="success"),r=t.showSuccessIcon&&v,s=t.collapsible??t.items.length>0,T=u[a]??t.defaultExpanded??!0;return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[s?e.jsxs("button",{type:"button",onClick:()=>I(a),className:"flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[T?e.jsx(ge,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}):e.jsx(he,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}),e.jsx("span",{className:"font-medium text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]",children:t.tabTitle})]}),r&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(U,{size:12,stroke:1})})]}):e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"font-medium text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]",children:t.tabTitle}),r&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(U,{size:12,stroke:1})})]}),s&&T&&t.items.length>0&&e.jsx("div",{className:"flex flex-col gap-1 pl-4 w-full",children:t.items.map(g=>e.jsxs("button",{type:"button",className:"flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]",onClick:g.onClick,disabled:!g.onClick,children:[e.jsx("span",{className:"text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors",children:g.title}),e.jsx(Se,{status:g.status})]},g.id))})]},a)})})]}),i.length>0&&e.jsx("div",{className:"shrink-0 m-4 rounded-md",style:{padding:"16px",border:"1px solid var(--color-border-default, #E2E8F0)",background:"var(--color-surface-default, #FFF)"},children:e.jsxs("div",{className:"flex flex-col items-start gap-3 w-full",children:[e.jsx("h3",{className:"font-medium text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]",children:"Quota"}),e.jsx("div",{className:"flex flex-col gap-3 w-full",children:i.map((t,a)=>e.jsxs("div",{className:"flex flex-col gap-1 w-full",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]",children:t.label}),e.jsxs("span",{className:"text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]",children:[t.current,"/",t.total,t.unit?` ${t.unit}`:""]})]}),e.jsx(Ce,{value:t.current,max:t.total,variant:"default",showValue:!1,className:"h-1"})]},a))})]})}),n&&e.jsxs("div",{className:"px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[e.jsx("label",{className:"font-medium text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]",children:"Number of Instances"}),e.jsx($,{value:M,onChange:t=>n(t),min:1,size:"sm"})]}),(C||m)&&e.jsxs("div",{className:"px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[C&&e.jsx(G,{variant:"secondary",size:"md",onClick:C,className:"flex-[0.3]",children:c}),m&&e.jsx(G,{variant:y?"primary":"secondary",size:"md",onClick:m,disabled:!y,className:"flex-[0.7]",children:h})]})]})]});return N&&typeof document<"u"&&document.body?xe.createPortal(w,document.body):w}d.__docgenInfo={description:"",methods:[],displayName:"FloatingCard",props:{title:{required:!0,tsType:{name:"string"},description:""},sections:{required:!1,tsType:{name:"Array",elements:[{name:"FloatingCardSection"}],raw:"FloatingCardSection[]"},description:"",defaultValue:{value:"[]",computed:!1}},quota:{required:!1,tsType:{name:"Array",elements:[{name:"QuotaItem"}],raw:"QuotaItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},instanceCount:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},onInstanceCountChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(count: number) => void",signature:{arguments:[{type:{name:"number"},name:"count"}],return:{name:"void"}}},description:""},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Cancel'",computed:!1}},actionLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Create'",computed:!1}},actionEnabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},position:{required:!1,tsType:{name:"union",raw:"'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",elements:[{name:"literal",value:"'top-left'"},{name:"literal",value:"'top-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'bottom-right'"}]},description:"",defaultValue:{value:"'top-left'",computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},zIndex:{required:!1,tsType:{name:"number"},description:""},portal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},width:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'320px'",computed:!1}}},composes:["Omit"]};const Qe={title:"Components/FloatingCard",component:d,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
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
        `}}},argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"화면 위치",table:{defaultValue:{summary:"top-left"}}},actionEnabled:{control:"boolean",description:"액션 버튼 활성화",table:{defaultValue:{summary:"false"}}},showCloseButton:{control:"boolean",description:"닫기 버튼 표시",table:{defaultValue:{summary:"false"}}}}},E={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Basic Information",items:[{id:"1",title:"Instance Name",status:"success"},{id:"2",title:"Description",status:"success"}]},{tabTitle:"Configuration",items:[{id:"3",title:"Instance Type",status:"processing"},{id:"4",title:"Storage",status:"default"}]}],onCancel:()=>console.log("Cancel"),onAction:()=>console.log("Create")})})},V={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create VM Instance",portal:!1,sections:[{tabTitle:"Instance Settings",items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Type",status:"success"},{id:"3",title:"Image",status:"success"}]}],quota:[{label:"vCPU",current:8,total:32},{label:"Memory",current:16,total:128,unit:"GB"},{label:"Storage",current:100,total:500,unit:"GB"}],onCancel:()=>{},onAction:()=>{}})})},A={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Deploy Application",portal:!1,sections:[{tabTitle:"Deployment",items:[{id:"1",title:"Image",status:"success"},{id:"2",title:"Ports",status:"success"}]}],instanceCount:3,onInstanceCountChange:p=>console.log("Count:",p),actionLabel:"Deploy",actionEnabled:!0,onCancel:()=>{},onAction:()=>{}})})},F={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Status Examples",portal:!1,sections:[{tabTitle:"Various Statuses",items:[{id:"1",title:"Completed Item",status:"success"},{id:"2",title:"Processing Item",status:"processing"},{id:"3",title:"Warning Item",status:"warning"},{id:"4",title:"Pending Item",status:"default"}]}],onCancel:()=>{},onAction:()=>{}})})},D={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Ready to Create",portal:!1,sections:[{tabTitle:"Configuration",showSuccessIcon:!0,items:[{id:"1",title:"All settings configured",status:"success"}]}],actionEnabled:!0,actionLabel:"Create Instance",onCancel:()=>{},onAction:()=>{}})})},B={render:()=>e.jsx("div",{className:"relative h-[400px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Summary",portal:!1,showCloseButton:!0,onClose:()=>console.log("Close"),sections:[]})})},P={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create Kubernetes Deployment",portal:!1,sections:[{tabTitle:"Basic Info",collapsible:!0,defaultExpanded:!0,items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Namespace",status:"success"}]},{tabTitle:"Container",collapsible:!0,defaultExpanded:!0,items:[{id:"3",title:"Image",status:"success"},{id:"4",title:"Resources",status:"processing"},{id:"5",title:"Env Variables",status:"default"}]},{tabTitle:"Networking",collapsible:!0,defaultExpanded:!1,items:[{id:"6",title:"Service",status:"default"},{id:"7",title:"Ingress",status:"default"}]}],quota:[{label:"Pods",current:15,total:100}],onCancel:()=>{},onAction:()=>{}})})};var K,O,X;E.parameters={...E.parameters,docs:{...(K=E.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(X=(O=E.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};var J,Y,Z;V.parameters={...V.parameters,docs:{...(J=V.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(Z=(Y=V.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ae;A.parameters={...A.parameters,docs:{...(ee=A.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(ae=(te=A.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var se,re,le;F.parameters={...F.parameters,docs:{...(se=F.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(le=(re=F.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var oe,ne,ie;D.parameters={...D.parameters,docs:{...(oe=D.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(ie=(ne=D.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var ce,ue,de;B.parameters={...B.parameters,docs:{...(ce=B.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="relative h-[400px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard title="Summary" portal={false} showCloseButton onClose={() => console.log('Close')} sections={[]} />
    </div>
}`,...(de=(ue=B.parameters)==null?void 0:ue.docs)==null?void 0:de.source}}};var pe,me,fe;P.parameters={...P.parameters,docs:{...(pe=P.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
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
}`,...(fe=(me=P.parameters)==null?void 0:me.docs)==null?void 0:fe.source}}};const $e=["Default","WithQuota","WithInstanceCount","AllStatuses","ActionEnabled","WithCloseButton","MultipleSections"];export{D as ActionEnabled,F as AllStatuses,E as Default,P as MultipleSections,B as WithCloseButton,A as WithInstanceCount,V as WithQuota,$e as __namedExportsOrder,Qe as default};
