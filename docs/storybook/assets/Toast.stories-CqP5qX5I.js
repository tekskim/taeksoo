import{r as a,j as e}from"./iframe-cCzR4jo2.js";import{t as f}from"./bundle-mjs-BZSatpsL.js";import{I as Ne}from"./IconX-KvYFK2XI.js";import{I as M}from"./IconExternalLink-BzTN7gho.js";import{I as Ie}from"./IconChevronUp-LY0j_bN8.js";import{I as Se}from"./IconInfoCircle-l0BrnTCL.js";import{I as Ee}from"./IconCircleX-DXqf3vg7.js";import{I as We}from"./IconAlertTriangle-B6R9At_J.js";import{I as Me}from"./IconCircleCheck-BWyZ5bfG.js";import{B as x}from"./Button-C2RGuKHm.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CYYKpV4_.js";const Pe={success:e.jsx(Me,{size:20,className:"text-[var(--toast-success-icon)]",strokeWidth:1.5}),warning:e.jsx(We,{size:20,className:"text-[var(--toast-warning-icon)]",strokeWidth:1.5}),error:e.jsx(Ee,{size:20,className:"text-[var(--toast-error-icon)]",strokeWidth:1.5}),info:e.jsx(Se,{size:20,className:"text-[var(--toast-info-icon)]",strokeWidth:1.5})},ze={"top-right":"top-[var(--toast-container-offset)] right-[var(--toast-container-offset)]","top-left":"top-[var(--toast-container-offset)] left-[var(--toast-container-offset)]","bottom-right":"bottom-[var(--toast-container-offset)] right-[var(--toast-container-offset)]","bottom-left":"bottom-[var(--toast-container-offset)] left-[var(--toast-container-offset)]","top-center":"top-[var(--toast-container-offset)] left-1/2 -translate-x-1/2","bottom-center":"bottom-[var(--toast-container-offset)] left-1/2 -translate-x-1/2"},be=a.createContext(null);function Ae(){const s=a.useContext(be);if(!s)throw new Error("useToast must be used within a ToastProvider");return s}function Ve(s){const o=s.getHours().toString().padStart(2,"0"),t=s.getMinutes().toString().padStart(2,"0");return`${o}:${t}`}function r({toast:s,onDismiss:o,className:t=""}){const[d,m]=a.useState(!1),[u,g]=a.useState(!1),l=a.useRef(null),p=s.duration??5e3,W=s.dismissible??!0,i=s.timestamp??new Date,n=a.useCallback(()=>{m(!0),setTimeout(()=>{o(s.id)},200)},[o,s.id]);a.useEffect(()=>(p>0&&(l.current=window.setTimeout(n,p)),()=>{l.current&&clearTimeout(l.current)}),[p,n]);const we=()=>{l.current&&clearTimeout(l.current)},Ce=()=>{p>0&&(l.current=window.setTimeout(n,p))},De=()=>{var h,A;(h=s.link)!=null&&h.onClick?s.link.onClick():(A=s.link)!=null&&A.href&&window.open(s.link.href,"_blank","noopener,noreferrer")},ye=()=>{g(h=>!h)};return e.jsxs("div",{role:"alert",className:f("flex flex-col gap-[var(--toast-gap)]","w-[var(--toast-width)]","p-[var(--toast-padding)]","rounded-[var(--toast-radius)]","bg-[var(--toast-bg)]","border border-[var(--color-border-default)]","shadow-[var(--toast-shadow)]","hover:border-[var(--color-action-primary)] hover:border-2","transition-all duration-200 ease-out",d?"opacity-0 translate-x-2":"opacity-100 translate-x-0 animate-toast-in",t),onMouseEnter:we,onMouseLeave:Ce,children:[e.jsxs("div",{className:"flex gap-[var(--space-2)]",children:[e.jsx("span",{className:"shrink-0 mt-0.5",children:Pe[s.variant]}),e.jsxs("div",{className:"flex-1 min-w-0 flex flex-col gap-[var(--space-2)]",children:[s.title&&e.jsx("p",{className:"text-label-md text-[var(--color-text-default)]",children:s.title}),e.jsx("p",{className:"text-[length:var(--toast-font-size)] leading-[var(--toast-line-height)] text-[var(--toast-text)]",children:s.message}),s.project&&e.jsx("span",{className:"inline-flex self-start px-[var(--space-1-5)] py-[var(--space-0-5)] text-body-sm text-[var(--toast-project-text)] bg-[var(--toast-project-bg)] rounded-[var(--radius-sm)]",children:s.project})]}),e.jsxs("div",{className:"shrink-0 flex flex-col items-end gap-1",children:[W&&e.jsx("button",{type:"button",onClick:n,className:f("p-1 -m-1","rounded-[var(--radius-sm)]","text-[var(--toast-close-color)]","hover:text-[var(--toast-close-hover)]","hover:bg-[var(--toast-close-hover-bg)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":"닫기",children:e.jsx(Ne,{size:16,strokeWidth:1.5})}),e.jsx("span",{className:"text-body-sm text-[var(--toast-time-color)]",children:Ve(i)}),s.action&&e.jsx("button",{type:"button",onClick:s.action.onClick,className:f("p-1.5","rounded-[var(--radius-sm)]","text-[var(--toast-action-color)]","bg-[var(--toast-action-bg)]","hover:bg-[var(--toast-action-hover-bg)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"),"aria-label":s.action.label??"액션",children:s.action.icon??e.jsx(M,{size:14,strokeWidth:1.5})})]})]}),s.link&&e.jsx("div",{className:"flex items-center justify-end gap-[var(--space-1-5)]",children:e.jsxs("button",{type:"button",onClick:De,className:f("inline-flex items-center gap-[var(--space-1)]","text-label-md","text-[var(--color-action-primary)]","hover:underline hover:underline-offset-2","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)]"),children:[e.jsx("span",{children:s.link.label}),e.jsx(M,{size:12,strokeWidth:1.5})]})}),s.detail&&e.jsxs("div",{className:"flex flex-col gap-[var(--space-3)]",children:[e.jsxs("button",{type:"button",onClick:ye,className:f("inline-flex items-center justify-end gap-[var(--space-1-5)] w-full","text-label-md","text-[var(--color-text-default)]","hover:text-[var(--color-text-muted)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)]"),"aria-expanded":u,children:[e.jsx("span",{children:"View detail"}),e.jsx(Ie,{size:16,strokeWidth:1.5,className:f("transition-transform duration-[var(--duration-fast)]",!u&&"rotate-180")})]}),u&&e.jsxs("div",{className:"flex flex-col gap-[var(--space-1-5)] px-[var(--space-4)] py-[var(--space-3)] bg-[var(--color-gray-50)] rounded-[var(--radius-base)]",children:[s.detail.code&&e.jsxs("p",{className:"text-label-md text-[var(--color-text-default)]",children:["code: ",s.detail.code]}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:s.detail.content})]})]})]})}function Te({position:s="top-right",maxToasts:o=5,className:t=""}){const{toasts:d,dismiss:m}=Le(),u=d.slice(0,o),g=s.includes("bottom");return e.jsx("div",{className:f("fixed z-[var(--z-toast)]","flex flex-col gap-[var(--toast-container-gap)]",ze[s],g&&"flex-col-reverse",t),"aria-live":"polite","aria-label":"알림",children:u.map(l=>e.jsx(r,{toast:l,onDismiss:m},l.id))})}let v=[];const P=new Set;function z(){P.forEach(s=>s())}function qe(s){return P.add(s),()=>P.delete(s)}function V(){return v}function _e(s){v=[s,...v],z()}function je(s){v=v.filter(o=>o.id!==s),z()}function Re(){v=[],z()}function Le(){const[s,o]=a.useState(V());return a.useEffect(()=>qe(()=>{o(V())}),[]),{toasts:s,dismiss:je}}let Fe=0;function ke({children:s}){const o=a.useCallback(()=>`toast-${++Fe}-${Date.now()}`,[]),t=a.useCallback(i=>{const n=o();return _e({...i,id:n,timestamp:i.timestamp??new Date}),n},[o]),d=a.useCallback((i,n)=>t({variant:"success",message:i,...n}),[t]),m=a.useCallback((i,n)=>t({variant:"warning",message:i,...n}),[t]),u=a.useCallback((i,n)=>t({variant:"error",message:i,...n}),[t]),g=a.useCallback((i,n)=>t({variant:"info",message:i,...n}),[t]),l=a.useCallback(i=>{je(i)},[]),p=a.useCallback(()=>{Re()},[]),W={toast:t,success:d,warning:m,error:u,info:g,dismiss:l,dismissAll:p};return e.jsx(be.Provider,{value:W,children:s})}r.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{toast:{required:!0,tsType:{name:"ToastData"},description:"Toast data"},onDismiss:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Called when toast should be removed"},className:{required:!1,tsType:{name:"string"},description:"Custom className",defaultValue:{value:"''",computed:!1}}}};Te.__docgenInfo={description:"",methods:[],displayName:"ToastContainer",props:{position:{required:!1,tsType:{name:"union",raw:`| 'top-right'
| 'top-left'
| 'bottom-right'
| 'bottom-left'
| 'top-center'
| 'bottom-center'`,elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"Position of the toast container",defaultValue:{value:"'top-right'",computed:!1}},maxToasts:{required:!1,tsType:{name:"number"},description:"Maximum number of toasts to show",defaultValue:{value:"5",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom className for container",defaultValue:{value:"''",computed:!1}}}};ke.__docgenInfo={description:"",methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const ss={title:"Components/Toast",component:r,tags:["autodocs"],parameters:{docs:{description:{component:`
## Toast 컴포넌트

사용자에게 피드백 메시지를 표시하는 알림 컴포넌트입니다.

### 구성 요소
- **Toast**: 개별 토스트 메시지
- **ToastContainer**: 토스트를 표시할 컨테이너
- **ToastProvider**: 토스트 컨텍스트 제공자
- **useToast**: 토스트 훅

### Variants
- **success**: 성공 메시지 (녹색)
- **warning**: 경고 메시지 (노란색)
- **error**: 에러 메시지 (빨간색)
- **info**: 정보 메시지 (파란색)

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
        `}}}},c=s=>({id:"mock-toast",variant:"success",message:"This is a toast message",timestamp:new Date,...s}),b={render:()=>e.jsx(r,{toast:c({variant:"success",message:"Instance created successfully"}),onDismiss:()=>{}})},T={render:()=>e.jsx(r,{toast:c({variant:"warning",message:"Your session will expire in 5 minutes"}),onDismiss:()=>{}})},j={render:()=>e.jsx(r,{toast:c({variant:"error",message:"Failed to connect to the server"}),onDismiss:()=>{}})},k={render:()=>e.jsx(r,{toast:c({variant:"info",message:"A new update is available"}),onDismiss:()=>{}})},w={render:()=>e.jsx(r,{toast:c({variant:"success",title:"Deployment Complete",message:"Your application has been deployed to production"}),onDismiss:()=>{}})},C={render:()=>e.jsx(r,{toast:c({variant:"info",title:"Build Started",message:"Pipeline #1234 has started",project:"my-project"}),onDismiss:()=>{}})},D={render:()=>e.jsx(r,{toast:c({variant:"success",message:"Instance web-server-01 is now running",link:{label:"View instance",href:"#"}}),onDismiss:()=>{}})},y={render:()=>e.jsx(r,{toast:c({variant:"warning",message:"Certificate expires in 7 days",action:{label:"Renew",icon:e.jsx(M,{size:14}),onClick:()=>console.log("Action clicked")}}),onDismiss:()=>{}})},N={render:()=>e.jsx(r,{toast:c({variant:"error",title:"Connection Failed",message:"Unable to establish connection to database",detail:{code:"ECONNREFUSED",content:"The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections."}}),onDismiss:()=>{}})},I={render:()=>e.jsx(r,{toast:c({variant:"info",message:"Processing your request...",dismissible:!1,duration:0}),onDismiss:()=>{}})},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{toast:c({variant:"success",message:"Success message"}),onDismiss:()=>{}}),e.jsx(r,{toast:c({variant:"warning",message:"Warning message"}),onDismiss:()=>{}}),e.jsx(r,{toast:c({variant:"error",message:"Error message"}),onDismiss:()=>{}}),e.jsx(r,{toast:c({variant:"info",message:"Info message"}),onDismiss:()=>{}})]})};function Be(){const{success:s,warning:o,error:t,info:d,dismissAll:m}=Ae();return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(x,{size:"sm",variant:"primary",onClick:()=>s("Operation completed successfully!"),children:"Success"}),e.jsx(x,{size:"sm",variant:"secondary",onClick:()=>o("Please review before proceeding"),children:"Warning"}),e.jsx(x,{size:"sm",variant:"danger",onClick:()=>t("Something went wrong",{title:"Error"}),children:"Error"}),e.jsx(x,{size:"sm",variant:"secondary",onClick:()=>d("New features are available"),children:"Info"}),e.jsx(x,{size:"sm",variant:"ghost",onClick:()=>m(),children:"Clear All"})]})}const E={render:()=>e.jsxs(ke,{children:[e.jsx(Be,{}),e.jsx(Te,{position:"top-right"})]}),parameters:{docs:{description:{story:"버튼을 클릭하여 다양한 토스트를 테스트해보세요."}}}};var q,_,R;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance created successfully'
  })} onDismiss={() => {}} />
}`,...(R=(_=b.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var L,F,B;T.parameters={...T.parameters,docs:{...(L=T.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Your session will expire in 5 minutes'
  })} onDismiss={() => {}} />
}`,...(B=(F=T.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var U,$,O;j.parameters={...j.parameters,docs:{...(U=j.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    message: 'Failed to connect to the server'
  })} onDismiss={() => {}} />
}`,...(O=($=j.parameters)==null?void 0:$.docs)==null?void 0:O.source}}};var Y,X,H;k.parameters={...k.parameters,docs:{...(Y=k.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'A new update is available'
  })} onDismiss={() => {}} />
}`,...(H=(X=k.parameters)==null?void 0:X.docs)==null?void 0:H.source}}};var G,J,K;w.parameters={...w.parameters,docs:{...(G=w.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(ee=(Z=C.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,te,ae;D.parameters={...D.parameters,docs:{...(se=D.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'success',
    message: 'Instance web-server-01 is now running',
    link: {
      label: 'View instance',
      href: '#'
    }
  })} onDismiss={() => {}} />
}`,...(ae=(te=D.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var re,oe,ne;y.parameters={...y.parameters,docs:{...(re=y.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'warning',
    message: 'Certificate expires in 7 days',
    action: {
      label: 'Renew',
      icon: <IconExternalLink size={14} />,
      onClick: () => console.log('Action clicked')
    }
  })} onDismiss={() => {}} />
}`,...(ne=(oe=y.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var ie,ce,le;N.parameters={...N.parameters,docs:{...(ie=N.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'error',
    title: 'Connection Failed',
    message: 'Unable to establish connection to database',
    detail: {
      code: 'ECONNREFUSED',
      content: 'The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections.'
    }
  })} onDismiss={() => {}} />
}`,...(le=(ce=N.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var de,me,ue;I.parameters={...I.parameters,docs:{...(de=I.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <Toast toast={createMockToast({
    variant: 'info',
    message: 'Processing your request...',
    dismissible: false,
    duration: 0
  })} onDismiss={() => {}} />
}`,...(ue=(me=I.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var pe,fe,ve;S.parameters={...S.parameters,docs:{...(pe=S.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
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
}`,...(ve=(fe=S.parameters)==null?void 0:fe.docs)==null?void 0:ve.source}}};var ge,xe,he;E.parameters={...E.parameters,docs:{...(ge=E.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(he=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};const ts=["Success","Warning","Error","Info","WithTitle","WithProject","WithLink","WithAction","WithDetail","NonDismissible","AllVariants","Interactive"];export{S as AllVariants,j as Error,k as Info,E as Interactive,I as NonDismissible,b as Success,T as Warning,y as WithAction,N as WithDetail,D as WithLink,C as WithProject,w as WithTitle,ts as __namedExportsOrder,ss as default};
