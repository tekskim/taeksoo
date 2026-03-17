import{r,j as e}from"./iframe-DkQu90e3.js";import{t as v}from"./cn-8AORBNJN.js";import{I as Ne}from"./IconX-BaIg4cV2.js";import{a as W,I as Ie}from"./IconExternalLink-73BL4MLn.js";import{I as Se}from"./IconChevronUp-d8uXQPdH.js";import{I as Ee}from"./IconInfoCircle-CvJlSHGK.js";import{I as Me}from"./IconAlertTriangle-6k637Q7w.js";import{I as We}from"./IconCircleCheck-ht8d0gnU.js";import{B as x}from"./Button-yxfW6jRo.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bn1mjhIb.js";const Pe={success:e.jsx(We,{size:20,className:"text-[var(--color-state-success)]",strokeWidth:1.5}),warning:e.jsx(Me,{size:20,className:"text-[var(--color-state-warning)]",strokeWidth:1.5}),error:e.jsx(Ie,{size:20,className:"text-[var(--color-state-danger)]",strokeWidth:1.5}),info:e.jsx(Ee,{size:20,className:"text-[var(--color-state-info)]",strokeWidth:1.5})},ze={"top-right":"top-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]","top-left":"top-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]","bottom-right":"bottom-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]","bottom-left":"bottom-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]","top-center":"top-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2","bottom-center":"bottom-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2"},be=r.createContext(null);function Ae(){const s=r.useContext(be);if(!s)throw new Error("useToast must be used within a ToastProvider");return s}function Ve(s){const i=s.getHours().toString().padStart(2,"0"),t=s.getMinutes().toString().padStart(2,"0");return`${i}:${t}`}function a({toast:s,onDismiss:i,className:t=""}){const[m,d]=r.useState(!1),[u,f]=r.useState(!1),l=r.useRef(null),p=s.duration??5e3,M=s.dismissible??!0,n=s.timestamp??new Date,o=r.useCallback(()=>{d(!0),setTimeout(()=>{i(s.id)},200)},[i,s.id]);r.useEffect(()=>(p>0&&(l.current=window.setTimeout(o,p)),()=>{l.current&&clearTimeout(l.current)}),[p,o]);const we=()=>{l.current&&clearTimeout(l.current)},Ce=()=>{p>0&&(l.current=window.setTimeout(o,p))},De=()=>{var h,A;(h=s.link)!=null&&h.onClick?s.link.onClick():(A=s.link)!=null&&A.href&&window.open(s.link.href,"_blank","noopener,noreferrer")},ye=()=>{f(h=>!h)};return e.jsxs("div",{"data-figma-name":"Toast",role:"alert",className:v("flex flex-col gap-[var(--primitive-spacing-2)]","w-[360px]","p-[var(--primitive-spacing-3)]","rounded-[var(--primitive-radius-lg)]","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","shadow-lg","hover:border-[var(--color-action-primary)] hover:border-2","transition-all duration-200 ease-out",m?"opacity-0 translate-x-2":"opacity-100 translate-x-0 animate-toast-in",t),onMouseEnter:we,onMouseLeave:Ce,children:[e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"shrink-0 mt-0.5",children:Pe[s.variant]}),e.jsxs("div",{className:"flex-1 min-w-0 flex flex-col gap-[var(--primitive-spacing-1)]",children:[s.title&&e.jsx("p",{className:"text-label-md text-[var(--color-text-default)]",children:s.title}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:s.message}),s.project&&e.jsx("span",{className:"inline-flex self-start px-[var(--primitive-spacing-1-5)] py-[var(--primitive-spacing-0-5)] text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)]",children:s.project})]}),e.jsxs("div",{className:"shrink-0 flex flex-col items-end gap-[var(--primitive-spacing-1)]",children:[M&&e.jsx("button",{type:"button",onClick:o,className:v("p-[var(--primitive-spacing-1)] -m-[var(--primitive-spacing-1)]","rounded-[var(--primitive-radius-sm)]","text-[var(--color-text-subtle)]","hover:text-[var(--color-text-default)]","hover:bg-[var(--color-surface-hover)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":"닫기",children:e.jsx(Ne,{size:16,strokeWidth:1.5})}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:Ve(n)}),s.action&&e.jsx("button",{type:"button",onClick:s.action.onClick,className:v("p-[var(--primitive-spacing-1-5)]","rounded-[var(--primitive-radius-sm)]","text-[var(--color-text-muted)]","bg-[var(--color-surface-subtle)]","hover:bg-[var(--color-surface-hover)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":s.action.label??"액션",children:s.action.icon??e.jsx(W,{size:14,strokeWidth:1.5})})]})]}),s.link&&e.jsx("div",{className:"flex items-center justify-end gap-[var(--primitive-spacing-1-5)]",children:e.jsxs("button",{type:"button",onClick:De,className:v("inline-flex items-center gap-[var(--primitive-spacing-1)]","text-label-md","text-[var(--color-action-primary)]","hover:underline hover:underline-offset-2","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"),children:[e.jsx("span",{children:s.link.label}),e.jsx(W,{size:12,strokeWidth:1.5})]})}),s.detail&&e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[e.jsxs("button",{type:"button",onClick:ye,className:v("inline-flex items-center justify-end gap-[var(--primitive-spacing-1-5)] w-full","text-label-md","text-[var(--color-text-default)]","hover:text-[var(--color-text-muted)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]"),"aria-expanded":u,children:[e.jsx("span",{children:"View detail"}),e.jsx(Se,{size:16,strokeWidth:1.5,className:v("transition-transform duration-[var(--duration-fast)]",!u&&"rotate-180")})]}),u&&e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-1-5)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-3)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]",children:[s.detail.code&&e.jsxs("p",{className:"text-label-md text-[var(--color-text-default)]",children:["code: ",s.detail.code]}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:s.detail.content})]})]})]})}function Te({position:s="top-right",maxToasts:i=5,className:t=""}){const{toasts:m,dismiss:d}=Le(),u=m.slice(0,i),f=s.includes("bottom");return e.jsx("div",{className:v("fixed z-[var(--z-toast)]","flex flex-col gap-[var(--primitive-spacing-2)]",ze[s],f&&"flex-col-reverse",t),role:"region","aria-live":"polite","aria-label":"알림",children:u.map(l=>e.jsx(a,{toast:l,onDismiss:d},l.id))})}let g=[];const P=new Set;function z(){P.forEach(s=>s())}function qe(s){return P.add(s),()=>P.delete(s)}function V(){return g}function _e(s){g=[s,...g],z()}function ke(s){g=g.filter(i=>i.id!==s),z()}function Re(){g=[],z()}function Le(){const[s,i]=r.useState(V());return r.useEffect(()=>qe(()=>{i(V())}),[]),{toasts:s,dismiss:ke}}let Fe=0;function je({children:s}){const i=r.useCallback(()=>`toast-${++Fe}-${Date.now()}`,[]),t=r.useCallback(n=>{const o=i();return _e({...n,id:o,timestamp:n.timestamp??new Date}),o},[i]),m=r.useCallback((n,o)=>t({variant:"success",message:n,...o}),[t]),d=r.useCallback((n,o)=>t({variant:"warning",message:n,...o}),[t]),u=r.useCallback((n,o)=>t({variant:"error",message:n,...o}),[t]),f=r.useCallback((n,o)=>t({variant:"info",message:n,...o}),[t]),l=r.useCallback(n=>{ke(n)},[]),p=r.useCallback(()=>{Re()},[]),M={toast:t,success:m,warning:d,error:u,info:f,dismiss:l,dismissAll:p};return e.jsx(be.Provider,{value:M,children:s})}a.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{toast:{required:!0,tsType:{name:"ToastData"},description:"Toast data"},onDismiss:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Called when toast should be removed"},className:{required:!1,tsType:{name:"string"},description:"Custom className",defaultValue:{value:"''",computed:!1}}}};Te.__docgenInfo={description:"",methods:[],displayName:"ToastContainer",props:{position:{required:!1,tsType:{name:"union",raw:`| 'top-right'
| 'top-left'
| 'bottom-right'
| 'bottom-left'
| 'top-center'
| 'bottom-center'`,elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"Position of the toast container",defaultValue:{value:"'top-right'",computed:!1}},maxToasts:{required:!1,tsType:{name:"number"},description:"Maximum number of toasts to show",defaultValue:{value:"5",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom className for container",defaultValue:{value:"''",computed:!1}}}};je.__docgenInfo={description:"",methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const es={title:"Components/Toast",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},c=s=>({id:"mock-toast",variant:"success",message:"This is a toast message",timestamp:new Date,...s}),b={render:()=>e.jsx(a,{toast:c({variant:"success",message:"Instance created successfully"}),onDismiss:()=>{}})},T={render:()=>e.jsx(a,{toast:c({variant:"warning",message:"Your session will expire in 5 minutes"}),onDismiss:()=>{}})},k={render:()=>e.jsx(a,{toast:c({variant:"error",message:"Failed to connect to the server"}),onDismiss:()=>{}})},j={render:()=>e.jsx(a,{toast:c({variant:"info",message:"A new update is available"}),onDismiss:()=>{}})},w={render:()=>e.jsx(a,{toast:c({variant:"success",title:"Deployment Complete",message:"Your application has been deployed to production"}),onDismiss:()=>{}})},C={render:()=>e.jsx(a,{toast:c({variant:"info",title:"Build Started",message:"Pipeline #1234 has started",project:"my-project"}),onDismiss:()=>{}})},D={render:()=>e.jsx(a,{toast:c({variant:"success",message:"Instance web-server-01 is now running",link:{label:"View instance",href:"#"}}),onDismiss:()=>{}})},y={render:()=>e.jsx(a,{toast:c({variant:"warning",message:"Certificate expires in 7 days",action:{label:"Renew",icon:e.jsx(W,{size:14}),onClick:()=>console.log("Action clicked")}}),onDismiss:()=>{}})},N={render:()=>e.jsx(a,{toast:c({variant:"error",title:"Connection Failed",message:"Unable to establish connection to database",detail:{code:"ECONNREFUSED",content:"The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections."}}),onDismiss:()=>{}})},I={render:()=>e.jsx(a,{toast:c({variant:"info",message:"Processing your request...",dismissible:!1,duration:0}),onDismiss:()=>{}})},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[e.jsx(a,{toast:c({variant:"success",message:"Success message"}),onDismiss:()=>{}}),e.jsx(a,{toast:c({variant:"warning",message:"Warning message"}),onDismiss:()=>{}}),e.jsx(a,{toast:c({variant:"error",message:"Error message"}),onDismiss:()=>{}}),e.jsx(a,{toast:c({variant:"info",message:"Info message"}),onDismiss:()=>{}})]})};function Be(){const{success:s,warning:i,error:t,info:m,dismissAll:d}=Ae();return e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[e.jsx(x,{size:"sm",variant:"primary",onClick:()=>s("Operation completed successfully!"),children:"Success"}),e.jsx(x,{size:"sm",variant:"secondary",onClick:()=>i("Please review before proceeding"),children:"Warning"}),e.jsx(x,{size:"sm",variant:"danger",onClick:()=>t("Something went wrong",{title:"Error"}),children:"Error"}),e.jsx(x,{size:"sm",variant:"secondary",onClick:()=>m("New features are available"),children:"Info"}),e.jsx(x,{size:"sm",variant:"ghost",onClick:()=>d(),children:"Clear All"})]})}const E={render:()=>e.jsxs(je,{children:[e.jsx(Be,{}),e.jsx(Te,{position:"top-right"})]}),parameters:{docs:{description:{story:"버튼을 클릭하여 다양한 토스트를 테스트해보세요."}}}};var q,_,R;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance created successfully'
  })} onDismiss={() => {}} />
}`,...(R=(_=b.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var L,F,B;T.parameters={...T.parameters,docs:{...(L=T.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Your session will expire in 5 minutes'
  })} onDismiss={() => {}} />
}`,...(B=(F=T.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var U,$,O;k.parameters={...k.parameters,docs:{...(U=k.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    message: 'Failed to connect to the server'
  })} onDismiss={() => {}} />
}`,...(O=($=k.parameters)==null?void 0:$.docs)==null?void 0:O.source}}};var Y,X,H;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'A new update is available'
  })} onDismiss={() => {}} />
}`,...(H=(X=j.parameters)==null?void 0:X.docs)==null?void 0:H.source}}};var G,J,K;w.parameters={...w.parameters,docs:{...(G=w.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    title: 'Deployment Complete',
    message: 'Your application has been deployed to production'
  })} onDismiss={() => {}} />
}`,...(K=(J=w.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,Z,ee;C.parameters={...C.parameters,docs:{...(Q=C.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    title: 'Build Started',
    message: 'Pipeline #1234 has started',
    project: 'my-project'
  })} onDismiss={() => {}} />
}`,...(ee=(Z=C.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,te,re;D.parameters={...D.parameters,docs:{...(se=D.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance web-server-01 is now running',
    link: {
      label: 'View instance',
      href: '#'
    }
  })} onDismiss={() => {}} />
}`,...(re=(te=D.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ae,ie,oe;y.parameters={...y.parameters,docs:{...(ae=y.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Certificate expires in 7 days',
    action: {
      label: 'Renew',
      icon: <IconExternalLink size={14} />,
      onClick: () => console.log('Action clicked')
    }
  })} onDismiss={() => {}} />
}`,...(oe=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var ne,ce,le;N.parameters={...N.parameters,docs:{...(ne=N.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    title: 'Connection Failed',
    message: 'Unable to establish connection to database',
    detail: {
      code: 'ECONNREFUSED',
      content: 'The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections.'
    }
  })} onDismiss={() => {}} />
}`,...(le=(ce=N.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var me,de,ue;I.parameters={...I.parameters,docs:{...(me=I.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'Processing your request...',
    dismissible: false,
    duration: 0
  })} onDismiss={() => {}} />
}`,...(ue=(de=I.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var pe,ve,ge;S.parameters={...S.parameters,docs:{...(pe=S.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
}`,...(ge=(ve=S.parameters)==null?void 0:ve.docs)==null?void 0:ge.source}}};var fe,xe,he;E.parameters={...E.parameters,docs:{...(fe=E.parameters)==null?void 0:fe.docs,source:{originalSource:`{
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
}`,...(he=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};const ss=["Success","Warning","Error","Info","WithTitle","WithProject","WithLink","WithAction","WithDetail","NonDismissible","AllVariants","Interactive"];export{S as AllVariants,k as Error,j as Info,E as Interactive,I as NonDismissible,b as Success,T as Warning,y as WithAction,N as WithDetail,D as WithLink,C as WithProject,w as WithTitle,ss as __namedExportsOrder,es as default};
