import{j as e}from"./iframe-DD6jyF7N.js";import{I as a}from"./InlineMessage-N7FjkZA3.js";import{I as H}from"./IconBell-C60V0jmQ.js";import{I as J}from"./IconRocket-DKQbhgYf.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./IconInfoCircle-DJ-MszvL.js";import"./createReactComponent-BZMrecJg.js";import"./IconAlertTriangle-1kVqwTuZ.js";import"./IconAlertCircle-Bx_ll4J7.js";import"./IconCircleCheck-D_kh277M.js";const ie={title:"Components/InlineMessage",component:a,parameters:{layout:"centered",docs:{description:{component:"인라인 알림 메시지를 표시하는 컴포넌트입니다. info, success, warning, error 네 가지 variant를 제공합니다."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["info","success","warning","error"],description:"메시지 유형"},children:{control:"text",description:"메시지 내용"},hideIcon:{control:"boolean",description:"아이콘 숨김 여부"},icon:{control:!1,description:"커스텀 아이콘"}},decorators:[O=>e.jsx("div",{style:{width:"400px"},children:e.jsx(O,{})})]},s={args:{variant:"info",children:"This is an informational message to help guide the user."}},r={args:{variant:"success",children:"Your changes have been saved successfully."}},n={args:{variant:"warning",children:"Please review your settings before proceeding."}},o={args:{variant:"error",children:"An error occurred while processing your request."}},i={name:"Without Icon",args:{variant:"info",children:"This message is displayed without an icon.",hideIcon:!0}},t={name:"With Custom Icon",args:{variant:"info",children:"New feature available! Check out the latest updates.",icon:e.jsx(J,{size:12,className:"text-[var(--inline-message-info-icon)]",strokeWidth:1.5})}},c={name:"Long Message",args:{variant:"warning",children:"This is a longer message that demonstrates how the component handles multiple lines of text. The icon should stay aligned to the top while the text wraps naturally."}},l={name:"All Variants",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(a,{variant:"info",children:"Info: This is an informational message."}),e.jsx(a,{variant:"success",children:"Success: Your operation completed successfully."}),e.jsx(a,{variant:"warning",children:"Warning: Please review before continuing."}),e.jsx(a,{variant:"error",children:"Error: Something went wrong."})]})},m={name:"Use Case - Form Validation",render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:e.jsx(a,{variant:"error",children:"Password must be at least 8 characters long and contain a number."})})},d={name:"Use Case - Feature Announcement",render:()=>e.jsx(a,{variant:"info",icon:e.jsx(H,{size:12,className:"text-[var(--inline-message-info-icon)]",strokeWidth:1.5}),children:"New: Dark mode is now available! Go to Settings to enable it."})},u={name:"Use Case - Deployment Status",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(a,{variant:"success",children:"Deployment successful! Your application is now live."}),e.jsx(a,{variant:"warning",children:"Deployment in progress. This may take a few minutes."}),e.jsx(a,{variant:"error",children:"Deployment failed. Please check the logs for more details."})]})};var p,g,h;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'This is an informational message to help guide the user.'
  }
}`,...(h=(g=s.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var v,f,w;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully.'
  }
}`,...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var x,I,y;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Please review your settings before proceeding.'
  }
}`,...(y=(I=n.parameters)==null?void 0:I.docs)==null?void 0:y.source}}};var M,S,j;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.'
  }
}`,...(j=(S=o.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var b,W,k;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'Without Icon',
  args: {
    variant: 'info',
    children: 'This message is displayed without an icon.',
    hideIcon: true
  }
}`,...(k=(W=i.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};var N,C,T;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'With Custom Icon',
  args: {
    variant: 'info',
    children: 'New feature available! Check out the latest updates.',
    icon: <IconRocket size={12} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />
  }
}`,...(T=(C=t.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};var D,A,F;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Long Message',
  args: {
    variant: 'warning',
    children: 'This is a longer message that demonstrates how the component handles multiple lines of text. The icon should stay aligned to the top while the text wraps naturally.'
  }
}`,...(F=(A=c.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var P,V,E;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'All Variants',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <InlineMessage variant="info">Info: This is an informational message.</InlineMessage>
      <InlineMessage variant="success">
        Success: Your operation completed successfully.
      </InlineMessage>
      <InlineMessage variant="warning">Warning: Please review before continuing.</InlineMessage>
      <InlineMessage variant="error">Error: Something went wrong.</InlineMessage>
    </div>
}`,...(E=(V=l.parameters)==null?void 0:V.docs)==null?void 0:E.source}}};var U,Y,z;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'Use Case - Form Validation',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <InlineMessage variant="error">
        Password must be at least 8 characters long and contain a number.
      </InlineMessage>
    </div>
}`,...(z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:z.source}}};var L,R,q;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Use Case - Feature Announcement',
  render: () => <InlineMessage variant="info" icon={<IconBell size={12} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />}>
      New: Dark mode is now available! Go to Settings to enable it.
    </InlineMessage>
}`,...(q=(R=d.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var B,G,_;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(_=(G=u.parameters)==null?void 0:G.docs)==null?void 0:_.source}}};const te=["Info","Success","Warning","Error","WithoutIcon","WithCustomIcon","LongMessage","AllVariants","FormValidation","FeatureAnnouncement","DeploymentStatus"];export{l as AllVariants,u as DeploymentStatus,o as Error,d as FeatureAnnouncement,m as FormValidation,s as Info,c as LongMessage,r as Success,n as Warning,t as WithCustomIcon,i as WithoutIcon,te as __namedExportsOrder,ie as default};
