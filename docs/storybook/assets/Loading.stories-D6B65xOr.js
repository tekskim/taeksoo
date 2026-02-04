import{j as e}from"./iframe-Cu1YwpPb.js";import{t}from"./bundle-mjs-BZSatpsL.js";import{I as j}from"./IconLoader2-ex43QoLD.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CCqVgkXm.js";const ye={sm:{icon:16,text:"text-body-sm leading-4",gap:"gap-1.5"},md:{icon:22,text:"text-body-md leading-4",gap:"gap-2"},lg:{icon:32,text:"text-body-lg leading-5",gap:"gap-3"}},s=({variant:b="spinner",size:ve="md",text:S="Loading",description:h,progress:fe=0,statusText:L,buttonLabel:be="Loading",className:y=""})=>{const N=ye[ve];if(b==="spinner")return e.jsxs("div",{className:t("flex flex-col items-center",N.gap,y),children:[e.jsx(j,{size:N.icon,stroke:1.5,className:"text-[var(--color-action-primary)] animate-spin"}),S&&e.jsx("p",{className:t("font-normal text-[var(--color-text-subtle)] text-center",N.text),children:S})]});if(b==="progress"){const Se=Math.min(Math.max(fe,0),100);return e.jsxs("div",{className:t("flex flex-col items-center gap-3",y),children:[e.jsxs("div",{className:"flex flex-col items-center gap-2 text-[var(--color-text-default)]",children:[e.jsx("p",{className:"font-medium text-body-lg leading-5",children:S}),h&&e.jsx("p",{className:"font-normal text-body-md leading-4 text-center",children:h})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2 w-[300px]",children:[e.jsxs("div",{className:"relative w-full h-1",children:[e.jsx("div",{className:"absolute inset-0 bg-[var(--color-border-subtle)] rounded-lg"}),e.jsx("div",{className:"absolute inset-y-0 left-0 bg-[var(--color-state-info)] rounded-lg transition-all duration-300",style:{width:`${Se}%`}})]}),L&&e.jsx("p",{className:"font-normal text-body-md leading-4 text-[var(--color-text-subtle)] text-center",children:L})]})]})}return b==="button"?e.jsx("div",{className:t("inline-flex",y),children:e.jsxs("button",{type:"button",disabled:!0,className:t("flex items-center justify-center gap-1.5","min-w-[80px] px-3 py-2","bg-[var(--color-border-strong)] rounded-[var(--primitive-radius-md)]","cursor-not-allowed"),children:[e.jsx(j,{size:12,stroke:2,className:"text-white animate-spin"}),e.jsx("span",{className:"font-medium text-body-md leading-4 text-white text-center",children:be})]})}):null};s.__docgenInfo={description:"",methods:[],displayName:"Loading",props:{variant:{required:!1,tsType:{name:"union",raw:"'spinner' | 'progress' | 'button'",elements:[{name:"literal",value:"'spinner'"},{name:"literal",value:"'progress'"},{name:"literal",value:"'button'"}]},description:"Loading variant",defaultValue:{value:"'spinner'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Size",defaultValue:{value:"'md'",computed:!1}},text:{required:!1,tsType:{name:"string"},description:"Loading text",defaultValue:{value:"'Loading'",computed:!1}},description:{required:!1,tsType:{name:"string"},description:"Description text (for progress variant)"},progress:{required:!1,tsType:{name:"number"},description:"Progress value (0-100) for progress variant",defaultValue:{value:"0",computed:!1}},statusText:{required:!1,tsType:{name:"string"},description:"Status text for progress variant"},buttonLabel:{required:!1,tsType:{name:"string"},description:"Button label for button variant",defaultValue:{value:"'Loading'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const Pe={title:"Components/Loading",component:s,parameters:{layout:"centered",docs:{description:{component:"로딩 상태를 표시하는 컴포넌트입니다. spinner, progress, button 세 가지 variant를 제공합니다."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["spinner","progress","button"],description:"로딩 표시 유형"},size:{control:"select",options:["sm","md","lg"],description:"크기 (spinner variant에만 적용)"},text:{control:"text",description:"로딩 텍스트"},description:{control:"text",description:"설명 텍스트 (progress variant)"},progress:{control:{type:"range",min:0,max:100,step:1},description:"진행률 (progress variant)"},statusText:{control:"text",description:"상태 텍스트 (progress variant)"},buttonLabel:{control:"text",description:"버튼 라벨 (button variant)"}}},a={args:{variant:"spinner",size:"md",text:"Loading"}},r={name:"Spinner - Small",args:{variant:"spinner",size:"sm",text:"Loading..."}},n={name:"Spinner - Medium",args:{variant:"spinner",size:"md",text:"Loading data..."}},i={name:"Spinner - Large",args:{variant:"spinner",size:"lg",text:"Please wait..."}},o={name:"Spinner - Without Text",args:{variant:"spinner",size:"md",text:""}},l={args:{variant:"progress",text:"Uploading file",description:"Please wait while we upload your file...",progress:45,statusText:"45% complete"}},c={name:"Progress - Start",args:{variant:"progress",text:"Starting upload",progress:0,statusText:"Preparing..."}},m={name:"Progress - Halfway",args:{variant:"progress",text:"Processing data",description:"Analyzing your data for insights",progress:50,statusText:"50% - Halfway there!"}},p={name:"Progress - Almost Done",args:{variant:"progress",text:"Almost done",description:"Finalizing your request",progress:90,statusText:"90% - Just a moment..."}},d={name:"Progress - Complete",args:{variant:"progress",text:"Complete!",progress:100,statusText:"Done!"}},g={args:{variant:"button",buttonLabel:"Loading"}},u={name:"Button - Saving",args:{variant:"button",buttonLabel:"Saving..."}},x={name:"Button - Submitting",args:{variant:"button",buttonLabel:"Submitting"}},v={name:"All Sizes",render:()=>e.jsxs("div",{className:"flex items-end gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"spinner",size:"sm",text:"Small"}),e.jsx("span",{className:"text-xs text-gray-500",children:"sm"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"spinner",size:"md",text:"Medium"}),e.jsx("span",{className:"text-xs text-gray-500",children:"md"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"spinner",size:"lg",text:"Large"}),e.jsx("span",{className:"text-xs text-gray-500",children:"lg"})]})]})},f={name:"All Variants",render:()=>e.jsxs("div",{className:"flex flex-col gap-12 items-center",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"spinner",size:"md",text:"Loading data..."}),e.jsx("span",{className:"text-xs text-gray-500 mt-2",children:"spinner"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"progress",text:"Uploading file",description:"document.pdf",progress:65,statusText:"65% complete"}),e.jsx("span",{className:"text-xs text-gray-500 mt-2",children:"progress"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{variant:"button",buttonLabel:"Saving..."}),e.jsx("span",{className:"text-xs text-gray-500 mt-2",children:"button"})]})]})};var z,P,T;a.parameters={...a.parameters,docs:{...(z=a.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: 'spinner',
    size: 'md',
    text: 'Loading'
  }
}`,...(T=(P=a.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var w,A,B;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Spinner - Small',
  args: {
    variant: 'spinner',
    size: 'sm',
    text: 'Loading...'
  }
}`,...(B=(A=r.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var q,V,C;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Spinner - Medium',
  args: {
    variant: 'spinner',
    size: 'md',
    text: 'Loading data...'
  }
}`,...(C=(V=n.parameters)==null?void 0:V.docs)==null?void 0:C.source}}};var D,M,H;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Spinner - Large',
  args: {
    variant: 'spinner',
    size: 'lg',
    text: 'Please wait...'
  }
}`,...(H=(M=i.parameters)==null?void 0:M.docs)==null?void 0:H.source}}};var U,W,_;o.parameters={...o.parameters,docs:{...(U=o.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'Spinner - Without Text',
  args: {
    variant: 'spinner',
    size: 'md',
    text: ''
  }
}`,...(_=(W=o.parameters)==null?void 0:W.docs)==null?void 0:_.source}}};var I,k,E;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: 'progress',
    text: 'Uploading file',
    description: 'Please wait while we upload your file...',
    progress: 45,
    statusText: '45% complete'
  }
}`,...(E=(k=l.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var F,J,O;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Progress - Start',
  args: {
    variant: 'progress',
    text: 'Starting upload',
    progress: 0,
    statusText: 'Preparing...'
  }
}`,...(O=(J=c.parameters)==null?void 0:J.docs)==null?void 0:O.source}}};var R,$,G;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Progress - Halfway',
  args: {
    variant: 'progress',
    text: 'Processing data',
    description: 'Analyzing your data for insights',
    progress: 50,
    statusText: '50% - Halfway there!'
  }
}`,...(G=($=m.parameters)==null?void 0:$.docs)==null?void 0:G.source}}};var K,Q,X;p.parameters={...p.parameters,docs:{...(K=p.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Progress - Almost Done',
  args: {
    variant: 'progress',
    text: 'Almost done',
    description: 'Finalizing your request',
    progress: 90,
    statusText: '90% - Just a moment...'
  }
}`,...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'Progress - Complete',
  args: {
    variant: 'progress',
    text: 'Complete!',
    progress: 100,
    statusText: 'Done!'
  }
}`,...(ee=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,te,ae;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    variant: 'button',
    buttonLabel: 'Loading'
  }
}`,...(ae=(te=g.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var re,ne,ie;u.parameters={...u.parameters,docs:{...(re=u.parameters)==null?void 0:re.docs,source:{originalSource:`{
  name: 'Button - Saving',
  args: {
    variant: 'button',
    buttonLabel: 'Saving...'
  }
}`,...(ie=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var oe,le,ce;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'Button - Submitting',
  args: {
    variant: 'button',
    buttonLabel: 'Submitting'
  }
}`,...(ce=(le=x.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var me,pe,de;v.parameters={...v.parameters,docs:{...(me=v.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'All Sizes',
  render: () => <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="sm" text="Small" />
        <span className="text-xs text-gray-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="md" text="Medium" />
        <span className="text-xs text-gray-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="lg" text="Large" />
        <span className="text-xs text-gray-500">lg</span>
      </div>
    </div>
}`,...(de=(pe=v.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};var ge,ue,xe;f.parameters={...f.parameters,docs:{...(ge=f.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'All Variants',
  render: () => <div className="flex flex-col gap-12 items-center">
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="md" text="Loading data..." />
        <span className="text-xs text-gray-500 mt-2">spinner</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="progress" text="Uploading file" description="document.pdf" progress={65} statusText="65% complete" />
        <span className="text-xs text-gray-500 mt-2">progress</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="button" buttonLabel="Saving..." />
        <span className="text-xs text-gray-500 mt-2">button</span>
      </div>
    </div>
}`,...(xe=(ue=f.parameters)==null?void 0:ue.docs)==null?void 0:xe.source}}};const Te=["Default","SpinnerSmall","SpinnerMedium","SpinnerLarge","SpinnerWithoutText","Progress","ProgressStart","ProgressHalfway","ProgressAlmostDone","ProgressComplete","Button","ButtonSaving","ButtonSubmitting","AllSizes","AllVariants"];export{v as AllSizes,f as AllVariants,g as Button,u as ButtonSaving,x as ButtonSubmitting,a as Default,l as Progress,p as ProgressAlmostDone,d as ProgressComplete,m as ProgressHalfway,c as ProgressStart,i as SpinnerLarge,n as SpinnerMedium,r as SpinnerSmall,o as SpinnerWithoutText,Te as __namedExportsOrder,Pe as default};
