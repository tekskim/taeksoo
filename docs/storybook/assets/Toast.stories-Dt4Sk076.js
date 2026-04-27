import{r,j as s}from"./iframe-DD6jyF7N.js";import{t as v}from"./cn-BMXv33oC.js";import{I as Se}from"./IconX-t6wpnM2j.js";import{I as P}from"./IconExternalLink-BibLk9oN.js";import{I as Ne}from"./IconChevronUp-Dt5qBDbK.js";import{B as x}from"./Button-DRmVrDtr.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BZMrecJg.js";const Ee={"top-right":"top-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]","top-left":"top-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]","bottom-right":"bottom-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]","bottom-left":"bottom-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]","top-center":"top-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2","bottom-center":"bottom-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2"},be=r.createContext(null);function Ie(){const e=r.useContext(be);if(!e)throw new Error("useToast must be used within a ToastProvider");return e}function Me(e){const n=e.getHours().toString().padStart(2,"0"),t=e.getMinutes().toString().padStart(2,"0");return`${n}:${t}`}function a({toast:e,onDismiss:n,className:t=""}){const[m,d]=r.useState(!1),[u,f]=r.useState(!1),l=r.useRef(null),p=e.duration??5e3,h=e.dismissible??!0,i=e.timestamp,o=r.useCallback(()=>{d(!0),setTimeout(()=>{n(e.id)},200)},[n,e.id]);r.useEffect(()=>(p>0&&(l.current=window.setTimeout(o,p)),()=>{l.current&&clearTimeout(l.current)}),[p,o]);const we=()=>{l.current&&clearTimeout(l.current)},Ce=()=>{p>0&&(l.current=window.setTimeout(o,p))},De=()=>{var b,z;(b=e.link)!=null&&b.onClick?e.link.onClick():(z=e.link)!=null&&z.href&&window.open(e.link.href,"_blank","noopener,noreferrer")},ye=()=>{f(b=>!b)};return s.jsxs("div",{"data-figma-name":"[TDS] Toast",role:"alert",className:v("flex flex-col gap-[var(--primitive-spacing-2)]","w-fit max-w-[320px]","p-[var(--primitive-spacing-3)]","rounded-[var(--primitive-radius-lg)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","shadow-lg","transition-all duration-200 ease-out",m?"opacity-0 translate-x-2":"opacity-100 translate-x-0 animate-toast-in",t),onMouseEnter:we,onMouseLeave:Ce,children:[s.jsxs("div",{className:"flex items-start gap-[var(--primitive-spacing-2)]",children:[s.jsxs("div",{className:"flex-1 min-w-0 flex flex-col gap-[var(--primitive-spacing-1)]",children:[e.title&&s.jsx("p",{className:"text-label-md text-[var(--color-text-default)]",children:e.title}),s.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:e.message}),e.project&&s.jsx("span",{className:"inline-flex self-start px-[var(--primitive-spacing-1-5)] py-[var(--primitive-spacing-0-5)] text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)]",children:e.project})]}),(h||i||e.action)&&s.jsxs("div",{className:"shrink-0 flex flex-col items-end gap-[var(--primitive-spacing-1)]",children:[h&&s.jsx("button",{type:"button",onClick:o,className:v("p-[var(--primitive-spacing-1)] -m-[var(--primitive-spacing-1)]","rounded-[var(--primitive-radius-sm)]","text-[var(--color-text-subtle)]","hover:text-[var(--color-text-default)]","hover:bg-[var(--color-surface-hover)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":"닫기",children:s.jsx(Se,{size:16,strokeWidth:1.5})}),i&&s.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:Me(i)}),e.action&&s.jsx("button",{type:"button",onClick:e.action.onClick,className:v("p-[var(--primitive-spacing-1-5)]","rounded-[var(--primitive-radius-sm)]","text-[var(--color-text-muted)]","bg-[var(--color-surface-subtle)]","hover:bg-[var(--color-surface-hover)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":e.action.label??"액션",children:e.action.icon??s.jsx(P,{size:14,strokeWidth:1.5})})]})]}),e.link&&s.jsx("div",{className:"flex items-center justify-end gap-[var(--primitive-spacing-1-5)]",children:s.jsxs("button",{type:"button",onClick:De,className:v("inline-flex items-center gap-[var(--primitive-spacing-1)]","text-label-md","text-[var(--color-action-primary)]","hover:underline hover:underline-offset-2","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"),children:[s.jsx("span",{children:e.link.label}),s.jsx(P,{size:12,strokeWidth:1.5})]})}),e.detail&&s.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[s.jsxs("button",{type:"button",onClick:ye,className:v("inline-flex items-center justify-end gap-[var(--primitive-spacing-1-5)] w-full","text-label-md","text-[var(--color-text-default)]","hover:text-[var(--color-text-muted)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"),"aria-expanded":u,children:[s.jsx("span",{children:"View detail"}),s.jsx(Ne,{size:16,strokeWidth:1.5,className:v("transition-transform duration-[var(--duration-fast)]",!u&&"rotate-180")})]}),u&&s.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-1-5)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-3)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]",children:[e.detail.code&&s.jsxs("p",{className:"text-label-md text-[var(--color-text-default)]",children:["code: ",e.detail.code]}),s.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:e.detail.content})]})]})]})}function Te({position:e="top-right",maxToasts:n=5,className:t=""}){const{toasts:m,dismiss:d}=ze(),u=m.slice(0,n),f=e.includes("bottom");return s.jsx("div",{className:v("fixed z-[var(--z-toast)]","flex flex-col gap-[var(--primitive-spacing-2)]",Ee[e],f&&"flex-col-reverse",t),role:"region","aria-live":"polite","aria-label":"알림",children:u.map(l=>s.jsx(a,{toast:l,onDismiss:d},l.id))})}let g=[];const W=new Set;function A(){W.forEach(e=>e())}function Pe(e){return W.add(e),()=>W.delete(e)}function V(){return g}function We(e){g=[e,...g],A()}function ke(e){g=g.filter(n=>n.id!==e),A()}function Ae(){g=[],A()}function ze(){const[e,n]=r.useState(V());return r.useEffect(()=>Pe(()=>{n(V())}),[]),{toasts:e,dismiss:ke}}let Ve=0;function je({children:e}){const n=r.useCallback(()=>`toast-${++Ve}-${Date.now()}`,[]),t=r.useCallback(i=>{const o=n();return We({...i,id:o,timestamp:i.timestamp??new Date}),o},[n]),m=r.useCallback((i,o)=>t({variant:"success",message:i,...o}),[t]),d=r.useCallback((i,o)=>t({variant:"warning",message:i,...o}),[t]),u=r.useCallback((i,o)=>t({variant:"error",message:i,...o}),[t]),f=r.useCallback((i,o)=>t({variant:"info",message:i,...o}),[t]),l=r.useCallback(i=>{ke(i)},[]),p=r.useCallback(()=>{Ae()},[]),h={toast:t,success:m,warning:d,error:u,info:f,dismiss:l,dismissAll:p};return s.jsx(be.Provider,{value:h,children:e})}a.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{toast:{required:!0,tsType:{name:"ToastData"},description:"Toast data"},onDismiss:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Called when toast should be removed"},className:{required:!1,tsType:{name:"string"},description:"Custom className",defaultValue:{value:"''",computed:!1}}}};Te.__docgenInfo={description:"",methods:[],displayName:"ToastContainer",props:{position:{required:!1,tsType:{name:"union",raw:`| 'top-right'
| 'top-left'
| 'bottom-right'
| 'bottom-left'
| 'top-center'
| 'bottom-center'`,elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"Position of the toast container",defaultValue:{value:"'top-right'",computed:!1}},maxToasts:{required:!1,tsType:{name:"number"},description:"Maximum number of toasts to show",defaultValue:{value:"5",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom className for container",defaultValue:{value:"''",computed:!1}}}};je.__docgenInfo={description:"",methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const Ye={title:"Components/Toast",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
## Toast 컴포넌트

사용자에게 피드백 메시지를 표시하는 알림 컴포넌트입니다.

### 구성 요소
- **Toast**: 개별 토스트 메시지
- **ToastContainer**: 토스트를 표시할 컨테이너
- **ToastProvider**: 토스트 컨텍스트 제공자
- **useToast**: 토스트 훅

### Variants
- **success**: 성공 메시지 (녹색)
- **info**: 정보 메시지 (파란색)
- **warning**: 경고 메시지 (노란색) — 디자인 가이드라인에서는 Snackbar 사용 권장
- **error**: 에러 메시지 (빨간색) — 디자인 가이드라인에서는 Snackbar/InlineMessage 사용 권장

> **디자인 가이드라인**: Toast는 가벼운 피드백(Success/Info)에 사용합니다. Error/Warning 수준의 알림은 사용자의 확인이나 후속 액션이 필요하므로 Snackbar 또는 InlineMessage를 권장합니다.

### 사용법
\`\`\`tsx
// App.tsx에서 Provider 설정
<ToastProvider>
  <App />
  <ToastContainer position="top-right" />
</ToastProvider>

// 컴포넌트에서 사용
const { success, error, warning, info } = useToast();

success('작업이 완료되었습니다');
error('오류가 발생했습니다', { title: 'Error' });
\`\`\`
        `}}}},c=e=>({id:"mock-toast",variant:"success",message:"This is a toast message",timestamp:new Date,...e}),T={render:()=>s.jsx(a,{toast:c({variant:"success",message:"Instance created successfully"}),onDismiss:()=>{}})},k={render:()=>s.jsx(a,{toast:c({variant:"warning",message:"Your session will expire in 5 minutes"}),onDismiss:()=>{}})},j={render:()=>s.jsx(a,{toast:c({variant:"error",message:"Failed to connect to the server"}),onDismiss:()=>{}})},w={render:()=>s.jsx(a,{toast:c({variant:"info",message:"A new update is available"}),onDismiss:()=>{}})},C={render:()=>s.jsx(a,{toast:c({variant:"success",title:"Deployment Complete",message:"Your application has been deployed to production"}),onDismiss:()=>{}})},D={render:()=>s.jsx(a,{toast:c({variant:"info",title:"Build Started",message:"Pipeline #1234 has started",project:"my-project"}),onDismiss:()=>{}})},y={render:()=>s.jsx(a,{toast:c({variant:"success",message:"Instance web-server-01 is now running",link:{label:"View instance",href:"#"}}),onDismiss:()=>{}})},S={render:()=>s.jsx(a,{toast:c({variant:"warning",message:"Certificate expires in 7 days",action:{label:"Renew",icon:s.jsx(P,{size:14}),onClick:()=>console.log("Action clicked")}}),onDismiss:()=>{}})},N={render:()=>s.jsx(a,{toast:c({variant:"error",title:"Connection Failed",message:"Unable to establish connection to database",detail:{code:"ECONNREFUSED",content:"The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections."}}),onDismiss:()=>{}})},E={render:()=>s.jsx(a,{toast:c({variant:"info",message:"Processing your request...",dismissible:!1,duration:0}),onDismiss:()=>{}})},I={render:()=>s.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[s.jsx(a,{toast:c({variant:"success",message:"Success message"}),onDismiss:()=>{}}),s.jsx(a,{toast:c({variant:"warning",message:"Warning message"}),onDismiss:()=>{}}),s.jsx(a,{toast:c({variant:"error",message:"Error message"}),onDismiss:()=>{}}),s.jsx(a,{toast:c({variant:"info",message:"Info message"}),onDismiss:()=>{}})]})};function qe(){const{success:e,warning:n,error:t,info:m,dismissAll:d}=Ie();return s.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[s.jsx(x,{size:"sm",variant:"primary",onClick:()=>e("Operation completed successfully!"),children:"Success"}),s.jsx(x,{size:"sm",variant:"secondary",onClick:()=>n("Please review before proceeding"),children:"Warning"}),s.jsx(x,{size:"sm",variant:"danger",onClick:()=>t("Something went wrong",{title:"Error"}),children:"Error"}),s.jsx(x,{size:"sm",variant:"secondary",onClick:()=>m("New features are available"),children:"Info"}),s.jsx(x,{size:"sm",variant:"ghost",onClick:()=>d(),children:"Clear All"})]})}const M={render:()=>s.jsxs(je,{children:[s.jsx(qe,{}),s.jsx(Te,{position:"top-right"})]}),parameters:{docs:{description:{story:"버튼을 클릭하여 다양한 토스트를 테스트해보세요."}}}};var q,_,R;T.parameters={...T.parameters,docs:{...(q=T.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance created successfully'
  })} onDismiss={() => {}} />
}`,...(R=(_=T.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var L,F,B;k.parameters={...k.parameters,docs:{...(L=k.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Your session will expire in 5 minutes'
  })} onDismiss={() => {}} />
}`,...(B=(F=k.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var U,$,O;j.parameters={...j.parameters,docs:{...(U=j.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    message: 'Failed to connect to the server'
  })} onDismiss={() => {}} />
}`,...(O=($=j.parameters)==null?void 0:$.docs)==null?void 0:O.source}}};var Y,H,X;w.parameters={...w.parameters,docs:{...(Y=w.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'A new update is available'
  })} onDismiss={() => {}} />
}`,...(X=(H=w.parameters)==null?void 0:H.docs)==null?void 0:X.source}}};var G,J,K;C.parameters={...C.parameters,docs:{...(G=C.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    title: 'Deployment Complete',
    message: 'Your application has been deployed to production'
  })} onDismiss={() => {}} />
}`,...(K=(J=C.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,Z,ee;D.parameters={...D.parameters,docs:{...(Q=D.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    title: 'Build Started',
    message: 'Pipeline #1234 has started',
    project: 'my-project'
  })} onDismiss={() => {}} />
}`,...(ee=(Z=D.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,te,re;y.parameters={...y.parameters,docs:{...(se=y.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance web-server-01 is now running',
    link: {
      label: 'View instance',
      href: '#'
    }
  })} onDismiss={() => {}} />
}`,...(re=(te=y.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ae,ie,ne;S.parameters={...S.parameters,docs:{...(ae=S.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Certificate expires in 7 days',
    action: {
      label: 'Renew',
      icon: <IconExternalLink size={14} />,
      onClick: () => console.log('Action clicked')
    }
  })} onDismiss={() => {}} />
}`,...(ne=(ie=S.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var oe,ce,le;N.parameters={...N.parameters,docs:{...(oe=N.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    title: 'Connection Failed',
    message: 'Unable to establish connection to database',
    detail: {
      code: 'ECONNREFUSED',
      content: 'The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections.'
    }
  })} onDismiss={() => {}} />
}`,...(le=(ce=N.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var me,de,ue;E.parameters={...E.parameters,docs:{...(me=E.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'Processing your request...',
    dismissible: false,
    duration: 0
  })} onDismiss={() => {}} />
}`,...(ue=(de=E.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var pe,ve,ge;I.parameters={...I.parameters,docs:{...(pe=I.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <Toast toast={createMockToast({
      variant: 'success',
      message: 'Success message'
    })} onDismiss={() => {}} />
      <Toast toast={createMockToast({
      variant: 'warning',
      message: 'Warning message'
    })} onDismiss={() => {}} />
      <Toast toast={createMockToast({
      variant: 'error',
      message: 'Error message'
    })} onDismiss={() => {}} />
      <Toast toast={createMockToast({
      variant: 'info',
      message: 'Info message'
    })} onDismiss={() => {}} />
    </div>
}`,...(ge=(ve=I.parameters)==null?void 0:ve.docs)==null?void 0:ge.source}}};var fe,xe,he;M.parameters={...M.parameters,docs:{...(fe=M.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <ToastProvider>
      <InteractiveDemo />
      <ToastContainer position="top-right" />
    </ToastProvider>,
  parameters: {
    docs: {
      description: {
        story: '버튼을 클릭하여 다양한 토스트를 테스트해보세요.'
      }
    }
  }
}`,...(he=(xe=M.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};const He=["Success","Warning","Error","Info","WithTitle","WithProject","WithLink","WithAction","WithDetail","NonDismissible","AllVariants","Interactive"];export{I as AllVariants,j as Error,w as Info,M as Interactive,E as NonDismissible,T as Success,k as Warning,S as WithAction,N as WithDetail,y as WithLink,D as WithProject,C as WithTitle,He as __namedExportsOrder,Ye as default};
