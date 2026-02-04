import{r as y,j as e}from"./iframe-CiM_PzFy.js";import{r as he}from"./index-B2ySIuyi.js";import{t as U}from"./bundle-mjs-BZSatpsL.js";import{I as ye}from"./IconX-y5i2oOQF.js";import{I as ge}from"./IconChevronDown-CBNx6VPf.js";import{I as Ce}from"./IconChevronRight-B66hzYCq.js";import{c as Ne}from"./createReactComponent-Dtj5WpGl.js";import{P as je}from"./ProgressBar-DdHAmWIQ.js";import{I as we}from"./IconChevronUp-VpTiUOux.js";import{B as K}from"./Button-RS3XCeKS.js";import{I as Ie}from"./IconLoader2-Eh3btt0p.js";import{I as Te}from"./IconAlertTriangle-Bi_bv6Li.js";import{I as Se}from"./IconCheck-EP2TORLX.js";import"./preload-helper-C1FmrZbK.js";import"./IconAlertCircle-DeHorwMT.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["path",{d:"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0",key:"svg-1"}],["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-2"}]],O=Ne("outline","target","Target",ke),G=y.forwardRef(({label:p,helperText:l,error:i,fullWidth:_=!1,width:f,min:c,max:u,step:b=1,value:x,defaultValue:C,onChange:g,className:L="",id:T,disabled:o,hideSteppers:N=!1,...j},R)=>{const m=T||`number-input-${Math.random().toString(36).substr(2,9)}`,h=x!==void 0,[$,S]=y.useState(C),n=h?x:$,k=y.useCallback(a=>{let r=a;return c!==void 0&&r<c&&(r=c),u!==void 0&&r>u&&(r=u),r},[c,u]),q=y.useCallback(a=>{const r=k(a);h||S(r),g==null||g(r)},[h,k,g]),V=()=>{o||q((n??0)+b)},E=()=>{o||q((n??0)-b)},w=a=>{const r=a.target.value;if(r===""){h||S(void 0);return}const H=parseFloat(r);isNaN(H)||q(H)},t=a=>{o||(a.key==="ArrowUp"?(a.preventDefault(),V()):a.key==="ArrowDown"&&(a.preventDefault(),E()))},s=U("w-full","h-[var(--number-input-height)]","pl-[var(--input-padding-x)]",N?"pr-[var(--input-padding-x)]":"pr-8","py-[var(--number-input-padding-y)]","text-[length:var(--input-font-size)]","leading-[var(--input-line-height)]","bg-[var(--input-bg)]","text-[var(--color-text-default)]","border-[length:var(--input-border-width)]","border-solid","rounded-[var(--input-radius)]","transition-all duration-[var(--duration-fast)]","focus:outline-none","focus:border-[var(--input-border-focus)]","focus:shadow-[0_0_0_1px_var(--input-border-focus)]","[appearance:textfield]","[&::-webkit-outer-spin-button]:appearance-none","[&::-webkit-inner-spin-button]:appearance-none",i?"border-[var(--input-border-error)]":"border-[var(--input-border)]",o?"bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed":""),v={sm:"w-[160px]",md:"w-[240px]",lg:"w-[320px]",half:"w-1/2",full:"w-full"},A=U("flex flex-col gap-[var(--input-label-gap)]",_?"w-full":f===void 0?"w-fit":typeof f=="number"?`w-[${f}px]`:v[f],L),I=["flex items-center justify-center","w-5 h-[14px]","rounded-[var(--radius-sm)]","text-[var(--color-text-subtle)]","hover:text-[var(--color-text-default)]","hover:bg-[var(--color-surface-muted)]","active:bg-[var(--color-border-subtle)]","transition-colors duration-[var(--duration-fast)]",o?"pointer-events-none opacity-50":"cursor-pointer"].join(" ");return e.jsxs("div",{className:A,children:[p&&e.jsx("label",{htmlFor:m,className:"text-label-sm text-[var(--color-text-default)]",children:p}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{ref:R,type:"number",id:m,className:s,value:n??"",onChange:w,onKeyDown:t,disabled:o,min:c,max:u,step:b,"aria-invalid":!!i,"aria-describedby":i?`${m}-error`:l?`${m}-helper`:void 0,...j}),!N&&e.jsxs("div",{className:"absolute right-1 top-1/2 -translate-y-1/2 flex flex-col",children:[e.jsx("button",{type:"button",tabIndex:-1,className:I,onClick:V,disabled:o||u!==void 0&&n!==void 0&&n>=u,"aria-label":"Increase value",children:e.jsx(we,{size:12,strokeWidth:2})}),e.jsx("button",{type:"button",tabIndex:-1,className:I,onClick:E,disabled:o||c!==void 0&&n!==void 0&&n<=c,"aria-label":"Decrease value",children:e.jsx(ge,{size:12,strokeWidth:2})})]})]}),i&&e.jsx("p",{id:`${m}-error`,className:"text-body-sm text-[var(--color-state-danger)]",children:i}),l&&!i&&e.jsx("p",{id:`${m}-helper`,className:"text-body-sm text-[var(--color-text-subtle)]",children:l})]})});G.displayName="NumberInput";G.__docgenInfo={description:"",methods:[],displayName:"NumberInput",props:{label:{required:!1,tsType:{name:"string"},description:"Label text"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text"},error:{required:!1,tsType:{name:"string"},description:"Error message"},fullWidth:{required:!1,tsType:{name:"boolean"},description:'@deprecated Use width="full" instead',defaultValue:{value:"false",computed:!1}},width:{required:!1,tsType:{name:"union",raw:"NumberInputWidth | number",elements:[{name:"union",raw:"'sm' | 'md' | 'lg' | 'half' | 'full'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'half'"},{name:"literal",value:"'full'"}]},{name:"number"}]},description:"Width variant: sm (160px), md (240px), lg (320px), half (50%), full (100%), or number for custom pixel width"},min:{required:!1,tsType:{name:"number"},description:"Minimum value"},max:{required:!1,tsType:{name:"number"},description:"Maximum value"},step:{required:!1,tsType:{name:"number"},description:"Step value",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"number"},description:"Current value (controlled)"},defaultValue:{required:!1,tsType:{name:"number"},description:"Default value (uncontrolled)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Change handler"},hideSteppers:{required:!1,tsType:{name:"boolean"},description:"Hide stepper buttons",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const X={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4"};function qe({status:p}){switch(p){case"success":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center",children:e.jsx(Se,{size:10,stroke:2,className:"text-white"})});case"warning":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center",children:e.jsx(Te,{size:10,stroke:2,className:"text-white"})});case"processing":return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 flex items-center justify-center",style:{borderStyle:"dashed"},children:e.jsx(Ie,{size:10,stroke:2,className:"text-[var(--color-text-muted)] animate-spin"})});default:return e.jsx("div",{className:"size-4 rounded-full border border-[var(--color-border-default)] shrink-0",style:{borderStyle:"dashed"}})}}function d({title:p,sections:l=[],quota:i=[],instanceCount:_=1,onInstanceCountChange:f,cancelLabel:c="Cancel",actionLabel:u="Create",actionEnabled:b=!1,onCancel:x,onAction:C,position:g="top-left",showCloseButton:L=!1,onClose:T,isOpen:o=!0,zIndex:N,portal:j=!0,width:R="320px",className:m,style:h,...$}){const[S,n]=y.useState(()=>{const t={};return l.forEach((s,v)=>{t[v]=s.collapsible?s.defaultExpanded??!0:!0}),t});if(y.useEffect(()=>{const t={};l.forEach((s,v)=>{t[v]=s.collapsible?s.defaultExpanded??!0:!0}),n(t)},[l]),!o)return null;const k=t=>{n(s=>({...s,[t]:!s[t]}))},V=[j?"fixed":"relative","z-[var(--z-popover)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--primitive-radius-lg)]","overflow-hidden","flex flex-col","h-fit","max-h-[calc(100vh-2rem)]",...j?[X[g||"top-left"]||X["top-left"]]:[]],E={...h,width:R,...N&&{zIndex:N}},w=e.jsxs("div",{className:U(V.join(" "),m),style:E,...$,children:[L&&T&&e.jsx("button",{type:"button",onClick:T,className:`
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
          `,"aria-label":"Close",children:e.jsx(ye,{size:16,stroke:1})}),e.jsxs("div",{className:"flex flex-col h-fit min-h-0 gap-0",children:[e.jsxs("div",{className:"overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md",style:{maxHeight:"340px",minHeight:"160px",padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-subtle)"},children:[e.jsx("h2",{className:"text-label-lg text-[var(--color-text-default)] shrink-0",children:p}),l&&l.length>0&&e.jsx("div",{className:"flex flex-col gap-6 w-full",children:l.map((t,s)=>{const v=t.items.length>0&&t.items.every(a=>a.status==="success"),Q=t.showSuccessIcon&&v,A=t.collapsible??t.items.length>0,I=S[s]??t.defaultExpanded??!0;return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[A?e.jsxs("button",{type:"button",onClick:()=>k(s),className:"flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[I?e.jsx(ge,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}):e.jsx(Ce,{size:12,stroke:1,className:"text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"}),e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle})]}),Q&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(O,{size:12,stroke:1})})]}):e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:t.tabTitle}),Q&&e.jsx("span",{className:"text-[var(--color-state-success)]",children:e.jsx(O,{size:12,stroke:1})})]}),A&&I&&t.items.length>0&&e.jsx("div",{className:"flex flex-col gap-1 pl-4 w-full",children:t.items.map(a=>e.jsxs("button",{type:"button",className:"flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]",onClick:a.onClick,disabled:!a.onClick,children:[e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors",children:a.title}),e.jsx(qe,{status:a.status})]},a.id))})]},s)})})]}),i.length>0&&e.jsx("div",{className:"shrink-0 m-4 rounded-md",style:{padding:"16px",border:"1px solid var(--color-border-default)",background:"var(--color-surface-default)"},children:e.jsxs("div",{className:"flex flex-col items-start gap-3 w-full",children:[e.jsx("h3",{className:"text-label-md text-[var(--color-text-default)]",children:"Quota"}),e.jsx("div",{className:"flex flex-col gap-3 w-full",children:i.map((t,s)=>e.jsxs("div",{className:"flex flex-col gap-1 w-full",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:t.label}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-muted)]",children:[t.current,"/",t.total,t.unit?` ${t.unit}`:""]})]}),e.jsx(je,{value:t.current,max:t.total,variant:"default",showValue:!1,className:"h-1"})]},s))})]})}),f&&e.jsxs("div",{className:"px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[e.jsx("label",{className:"text-label-md text-[var(--color-text-default)]",children:"Number of Instances"}),e.jsx(G,{value:_,onChange:t=>f(t),min:1,size:"sm"})]}),(x||C)&&e.jsxs("div",{className:"px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]",children:[x&&e.jsx(K,{variant:"secondary",size:"md",onClick:x,className:"flex-[0.3]",children:c}),C&&e.jsx(K,{variant:b?"primary":"secondary",size:"md",onClick:C,disabled:!b,className:"flex-[0.7]",children:u})]})]})]});return j&&typeof document<"u"&&document.body?he.createPortal(w,document.body):w}d.__docgenInfo={description:"",methods:[],displayName:"FloatingCard",props:{title:{required:!0,tsType:{name:"string"},description:""},sections:{required:!1,tsType:{name:"Array",elements:[{name:"FloatingCardSection"}],raw:"FloatingCardSection[]"},description:"",defaultValue:{value:"[]",computed:!1}},quota:{required:!1,tsType:{name:"Array",elements:[{name:"QuotaItem"}],raw:"QuotaItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},instanceCount:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},onInstanceCountChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(count: number) => void",signature:{arguments:[{type:{name:"number"},name:"count"}],return:{name:"void"}}},description:""},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Cancel'",computed:!1}},actionLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Create'",computed:!1}},actionEnabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},position:{required:!1,tsType:{name:"union",raw:"'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",elements:[{name:"literal",value:"'top-left'"},{name:"literal",value:"'top-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'bottom-right'"}]},description:"",defaultValue:{value:"'top-left'",computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},zIndex:{required:!1,tsType:{name:"number"},description:""},portal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},width:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'320px'",computed:!1}}},composes:["Omit"]};const Ue={title:"Components/FloatingCard",component:d,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
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
        `}}},argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"화면 위치",table:{defaultValue:{summary:"top-left"}}},actionEnabled:{control:"boolean",description:"액션 버튼 활성화",table:{defaultValue:{summary:"false"}}},showCloseButton:{control:"boolean",description:"닫기 버튼 표시",table:{defaultValue:{summary:"false"}}}}},z={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create Instance",portal:!1,sections:[{tabTitle:"Basic Information",items:[{id:"1",title:"Instance Name",status:"success"},{id:"2",title:"Description",status:"success"}]},{tabTitle:"Configuration",items:[{id:"3",title:"Instance Type",status:"processing"},{id:"4",title:"Storage",status:"default"}]}],onCancel:()=>console.log("Cancel"),onAction:()=>console.log("Create")})})},D={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create VM Instance",portal:!1,sections:[{tabTitle:"Instance Settings",items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Type",status:"success"},{id:"3",title:"Image",status:"success"}]}],quota:[{label:"vCPU",current:8,total:32},{label:"Memory",current:16,total:128,unit:"GB"},{label:"Storage",current:100,total:500,unit:"GB"}],onCancel:()=>{},onAction:()=>{}})})},B={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Deploy Application",portal:!1,sections:[{tabTitle:"Deployment",items:[{id:"1",title:"Image",status:"success"},{id:"2",title:"Ports",status:"success"}]}],instanceCount:3,onInstanceCountChange:p=>console.log("Count:",p),actionLabel:"Deploy",actionEnabled:!0,onCancel:()=>{},onAction:()=>{}})})},P={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Status Examples",portal:!1,sections:[{tabTitle:"Various Statuses",items:[{id:"1",title:"Completed Item",status:"success"},{id:"2",title:"Processing Item",status:"processing"},{id:"3",title:"Warning Item",status:"warning"},{id:"4",title:"Pending Item",status:"default"}]}],onCancel:()=>{},onAction:()=>{}})})},F={render:()=>e.jsx("div",{className:"relative h-[500px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Ready to Create",portal:!1,sections:[{tabTitle:"Configuration",showSuccessIcon:!0,items:[{id:"1",title:"All settings configured",status:"success"}]}],actionEnabled:!0,actionLabel:"Create Instance",onCancel:()=>{},onAction:()=>{}})})},M={render:()=>e.jsx("div",{className:"relative h-[400px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Summary",portal:!1,showCloseButton:!0,onClose:()=>console.log("Close"),sections:[]})})},W={render:()=>e.jsx("div",{className:"relative h-[600px] bg-[var(--color-surface-subtle)] p-4",children:e.jsx(d,{title:"Create Kubernetes Deployment",portal:!1,sections:[{tabTitle:"Basic Info",collapsible:!0,defaultExpanded:!0,items:[{id:"1",title:"Name",status:"success"},{id:"2",title:"Namespace",status:"success"}]},{tabTitle:"Container",collapsible:!0,defaultExpanded:!0,items:[{id:"3",title:"Image",status:"success"},{id:"4",title:"Resources",status:"processing"},{id:"5",title:"Env Variables",status:"default"}]},{tabTitle:"Networking",collapsible:!0,defaultExpanded:!1,items:[{id:"6",title:"Service",status:"default"},{id:"7",title:"Ingress",status:"default"}]}],quota:[{label:"Pods",current:15,total:100}],onCancel:()=>{},onAction:()=>{}})})};var J,Y,Z;z.parameters={...z.parameters,docs:{...(J=z.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Z=(Y=z.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ae;D.parameters={...D.parameters,docs:{...(ee=D.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ae=(te=D.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var se,re,le;B.parameters={...B.parameters,docs:{...(se=B.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(le=(re=B.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var oe,ne,ie;P.parameters={...P.parameters,docs:{...(oe=P.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ie=(ne=P.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var ce,ue,de;F.parameters={...F.parameters,docs:{...(ce=F.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(de=(ue=F.parameters)==null?void 0:ue.docs)==null?void 0:de.source}}};var pe,me,fe;M.parameters={...M.parameters,docs:{...(pe=M.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="relative h-[400px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard title="Summary" portal={false} showCloseButton onClose={() => console.log('Close')} sections={[]} />
    </div>
}`,...(fe=(me=M.parameters)==null?void 0:me.docs)==null?void 0:fe.source}}};var ve,be,xe;W.parameters={...W.parameters,docs:{...(ve=W.parameters)==null?void 0:ve.docs,source:{originalSource:`{
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
}`,...(xe=(be=W.parameters)==null?void 0:be.docs)==null?void 0:xe.source}}};const Ge=["Default","WithQuota","WithInstanceCount","AllStatuses","ActionEnabled","WithCloseButton","MultipleSections"];export{F as ActionEnabled,P as AllStatuses,z as Default,W as MultipleSections,M as WithCloseButton,B as WithInstanceCount,D as WithQuota,Ge as __namedExportsOrder,Ue as default};
