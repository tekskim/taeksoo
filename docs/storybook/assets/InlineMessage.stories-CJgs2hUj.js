import{j as e}from"./iframe-DkQu90e3.js";import{t as ne}from"./cn-8AORBNJN.js";import{I as re}from"./IconInfoCircle-CvJlSHGK.js";import{I as ie}from"./IconAlertTriangle-6k637Q7w.js";import{I as te}from"./IconAlertCircle-6eENcwff.js";import{I as oe}from"./IconCircleCheck-ht8d0gnU.js";import{I as ce}from"./IconBell-CDlWaXtY.js";import{I as le}from"./IconRocket-80wR2FIH.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bn1mjhIb.js";const me={success:{bg:"bg-[var(--inline-message-success-bg)]",icon:e.jsx(oe,{size:16,className:"text-[var(--inline-message-success-icon)]",strokeWidth:1.5})},warning:{bg:"bg-[var(--inline-message-warning-bg)]",icon:e.jsx(te,{size:16,className:"text-[var(--inline-message-warning-icon)]",strokeWidth:1.5})},error:{bg:"bg-[var(--inline-message-error-bg)]",icon:e.jsx(ie,{size:16,className:"text-[var(--inline-message-error-icon)]",strokeWidth:1.5})},info:{bg:"bg-[var(--inline-message-info-bg)]",icon:e.jsx(re,{size:16,className:"text-[var(--inline-message-info-icon)]",strokeWidth:1.5})}};function a({variant:p,children:J,hideIcon:K=!1,icon:Q,className:X="",type:Z,message:$,closable:de,onClose:ue,expandable:pe,...ee}){const ae=p??Z??"info",se=J??$,g=me[ae];return e.jsxs("div",{"data-figma-name":"InlineMessage",role:"status",className:ne("flex items-start gap-[var(--inline-message-gap)]","p-[var(--inline-message-padding)]","rounded-[var(--inline-message-radius)]",g.bg,X),...ee,children:[!K&&e.jsx("span",{className:"shrink-0",children:Q??g.icon}),e.jsx("p",{className:"text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]",children:se})]})}a.__docgenInfo={description:"",methods:[],displayName:"InlineMessage",props:{variant:{required:!1,tsType:{name:"union",raw:"'success' | 'warning' | 'error' | 'info'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'error'"},{name:"literal",value:"'info'"}]},description:"Message variant (also accepts thaki-ui 'type')"},children:{required:!1,tsType:{name:"ReactNode"},description:"Message content"},hideIcon:{required:!1,tsType:{name:"boolean"},description:"Hide icon",defaultValue:{value:"false",computed:!1}},icon:{required:!1,tsType:{name:"ReactNode"},description:"Custom icon"},type:{required:!1,tsType:{name:"union",raw:"'success' | 'warning' | 'error' | 'info'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'error'"},{name:"literal",value:"'info'"}]},description:"@deprecated thaki-ui compatibility - use variant instead"},message:{required:!1,tsType:{name:"ReactNode"},description:"@deprecated thaki-ui compatibility - use children instead"},closable:{required:!1,tsType:{name:"boolean"},description:"@deprecated thaki-ui compatibility - close button (not implemented, handle in parent)"},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"@deprecated thaki-ui compatibility - close callback"},expandable:{required:!1,tsType:{name:"boolean"},description:"@deprecated thaki-ui compatibility - expandable content (not implemented)"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};const ke={title:"Components/InlineMessage",component:a,parameters:{layout:"centered",docs:{description:{component:"인라인 알림 메시지를 표시하는 컴포넌트입니다. info, success, warning, error 네 가지 variant를 제공합니다."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["info","success","warning","error"],description:"메시지 유형"},children:{control:"text",description:"메시지 내용"},hideIcon:{control:"boolean",description:"아이콘 숨김 여부"},icon:{control:!1,description:"커스텀 아이콘"}},decorators:[p=>e.jsx("div",{style:{width:"400px"},children:e.jsx(p,{})})]},s={args:{variant:"info",children:"This is an informational message to help guide the user."}},n={args:{variant:"success",children:"Your changes have been saved successfully."}},r={args:{variant:"warning",children:"Please review your settings before proceeding."}},i={args:{variant:"error",children:"An error occurred while processing your request."}},t={name:"Without Icon",args:{variant:"info",children:"This message is displayed without an icon.",hideIcon:!0}},o={name:"With Custom Icon",args:{variant:"info",children:"New feature available! Check out the latest updates.",icon:e.jsx(le,{size:12,className:"text-[var(--inline-message-info-icon)]",strokeWidth:1.5})}},c={name:"Long Message",args:{variant:"warning",children:"This is a longer message that demonstrates how the component handles multiple lines of text. The icon should stay aligned to the top while the text wraps naturally."}},l={name:"All Variants",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(a,{variant:"info",children:"Info: This is an informational message."}),e.jsx(a,{variant:"success",children:"Success: Your operation completed successfully."}),e.jsx(a,{variant:"warning",children:"Warning: Please review before continuing."}),e.jsx(a,{variant:"error",children:"Error: Something went wrong."})]})},m={name:"Use Case - Form Validation",render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:e.jsx(a,{variant:"error",children:"Password must be at least 8 characters long and contain a number."})})},d={name:"Use Case - Feature Announcement",render:()=>e.jsx(a,{variant:"info",icon:e.jsx(ce,{size:12,className:"text-[var(--inline-message-info-icon)]",strokeWidth:1.5}),children:"New: Dark mode is now available! Go to Settings to enable it."})},u={name:"Use Case - Deployment Status",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(a,{variant:"success",children:"Deployment successful! Your application is now live."}),e.jsx(a,{variant:"warning",children:"Deployment in progress. This may take a few minutes."}),e.jsx(a,{variant:"error",children:"Deployment failed. Please check the logs for more details."})]})};var h,v,f;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'This is an informational message to help guide the user.'
  }
}`,...(f=(v=s.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var x,w,I;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully.'
  }
}`,...(I=(w=n.parameters)==null?void 0:w.docs)==null?void 0:I.source}}};var y,b,M;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Please review your settings before proceeding.'
  }
}`,...(M=(b=r.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var k,N,j;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.'
  }
}`,...(j=(N=i.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var S,T,C;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Without Icon',
  args: {
    variant: 'info',
    children: 'This message is displayed without an icon.',
    hideIcon: true
  }
}`,...(C=(T=t.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var W,A,q;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'With Custom Icon',
  args: {
    variant: 'info',
    children: 'New feature available! Check out the latest updates.',
    icon: <IconRocket size={12} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />
  }
}`,...(q=(A=o.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var D,V,z;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Long Message',
  args: {
    variant: 'warning',
    children: 'This is a longer message that demonstrates how the component handles multiple lines of text. The icon should stay aligned to the top while the text wraps naturally.'
  }
}`,...(z=(V=c.parameters)==null?void 0:V.docs)==null?void 0:z.source}}};var F,P,E;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'All Variants',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <InlineMessage variant="info">Info: This is an informational message.</InlineMessage>
      <InlineMessage variant="success">
        Success: Your operation completed successfully.
      </InlineMessage>
      <InlineMessage variant="warning">Warning: Please review before continuing.</InlineMessage>
      <InlineMessage variant="error">Error: Something went wrong.</InlineMessage>
    </div>
}`,...(E=(P=l.parameters)==null?void 0:P.docs)==null?void 0:E.source}}};var R,U,Y;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Use Case - Form Validation',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <InlineMessage variant="error">
        Password must be at least 8 characters long and contain a number.
      </InlineMessage>
    </div>
}`,...(Y=(U=m.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var L,_,B;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Use Case - Feature Announcement',
  render: () => <InlineMessage variant="info" icon={<IconBell size={12} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />}>
      New: Dark mode is now available! Go to Settings to enable it.
    </InlineMessage>
}`,...(B=(_=d.parameters)==null?void 0:_.docs)==null?void 0:B.source}}};var G,H,O;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'Use Case - Deployment Status',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <InlineMessage variant="success">
        Deployment successful! Your application is now live.
      </InlineMessage>
      <InlineMessage variant="warning">
        Deployment in progress. This may take a few minutes.
      </InlineMessage>
      <InlineMessage variant="error">
        Deployment failed. Please check the logs for more details.
      </InlineMessage>
    </div>
}`,...(O=(H=u.parameters)==null?void 0:H.docs)==null?void 0:O.source}}};const Ne=["Info","Success","Warning","Error","WithoutIcon","WithCustomIcon","LongMessage","AllVariants","FormValidation","FeatureAnnouncement","DeploymentStatus"];export{l as AllVariants,u as DeploymentStatus,i as Error,d as FeatureAnnouncement,m as FormValidation,s as Info,c as LongMessage,n as Success,r as Warning,o as WithCustomIcon,t as WithoutIcon,Ne as __namedExportsOrder,ke as default};
