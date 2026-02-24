import{j as a}from"./iframe-C-CGJmyb.js";import{P as e}from"./ProgressBar-H6blkTQw.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BvK7gRRe.js";import"./IconAlertCircle-XDfspJao.js";const la={title:"Components/ProgressBar",component:e,parameters:{layout:"centered",docs:{description:{component:"진행률이나 리소스 사용량을 시각적으로 표시하는 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","quota"],description:"프로그레스 바 유형"},value:{control:{type:"number",min:0},description:"현재 값 (사용량)"},max:{control:{type:"number",min:1},description:"최대 값 (총량), undefined = 무제한"},newValue:{control:{type:"number",min:0},description:"추가될 새 값 (quota variant)"},label:{control:"text",description:"라벨 텍스트"},showValue:{control:"boolean",description:"값 표시 여부"},error:{control:"boolean",description:"에러 상태"},errorMessage:{control:"text",description:"에러 메시지 (툴팁)"},statusText:{control:"text",description:"상태 텍스트"},status:{control:"select",options:["success","warning","danger","info","neutral"],description:"상태 색상 (default variant)"},size:{control:"select",options:["sm","md"],description:"크기"}},decorators:[aa=>a.jsx("div",{style:{width:"300px"},children:a.jsx(aa,{})})]},t={args:{variant:"default",value:45,max:100,label:"Progress",showValue:!0}},r={name:"Default - With Status Text",args:{variant:"default",value:65,max:100,label:"Uploading",statusText:"65%",status:"info"}},s={name:"Default - Success",args:{variant:"default",value:30,max:100,label:"CPU Usage",statusText:"30%",status:"success"}},n={name:"Default - Warning",args:{variant:"default",value:75,max:100,label:"Memory Usage",statusText:"75%",status:"warning"}},l={name:"Default - Danger",args:{variant:"default",value:95,max:100,label:"Storage",statusText:"95%",status:"danger"}},u={name:"Default - Error State",args:{variant:"default",value:100,max:100,label:"Disk Space",error:!0,errorMessage:"Storage quota exceeded",statusText:"Full"}},o={args:{variant:"quota",value:5,max:10,label:"Instances",showValue:!0}},i={name:"Quota - With New Value",args:{variant:"quota",value:3,newValue:2,max:10,label:"Instances",showValue:!0}},c={name:"Quota - Warning Level",args:{variant:"quota",value:6,newValue:2,max:10,label:"vCPU",showValue:!0}},m={name:"Quota - Exceeding",args:{variant:"quota",value:8,newValue:5,max:10,label:"Memory (GB)",showValue:!0}},d={name:"Quota - Unlimited",args:{variant:"quota",value:15,max:void 0,label:"API Calls",showValue:!0}},v={name:"All Status Colors",render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[a.jsx(e,{variant:"default",value:50,max:100,label:"Info",status:"info",statusText:"50%"}),a.jsx(e,{variant:"default",value:50,max:100,label:"Success",status:"success",statusText:"50%"}),a.jsx(e,{variant:"default",value:50,max:100,label:"Warning",status:"warning",statusText:"50%"}),a.jsx(e,{variant:"default",value:50,max:100,label:"Danger",status:"danger",statusText:"50%"}),a.jsx(e,{variant:"default",value:50,max:100,label:"Neutral",status:"neutral",statusText:"50%"})]})},g={name:"Quota - All Levels",render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[a.jsx(e,{variant:"quota",value:3,newValue:1,max:10,label:"Normal (40%)",showValue:!0}),a.jsx(e,{variant:"quota",value:5,newValue:2,max:10,label:"Warning (70%)",showValue:!0}),a.jsx(e,{variant:"quota",value:7,newValue:3,max:10,label:"Warning (100%)",showValue:!0}),a.jsx(e,{variant:"quota",value:8,newValue:5,max:10,label:"Danger (130%)",showValue:!0})]})};var p,x,f;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    value: 45,
    max: 100,
    label: 'Progress',
    showValue: true
  }
}`,...(f=(x=t.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var w,b,V;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Default - With Status Text',
  args: {
    variant: 'default',
    value: 65,
    max: 100,
    label: 'Uploading',
    statusText: '65%',
    status: 'info'
  }
}`,...(V=(b=r.parameters)==null?void 0:b.docs)==null?void 0:V.source}}};var S,h,D;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Default - Success',
  args: {
    variant: 'default',
    value: 30,
    max: 100,
    label: 'CPU Usage',
    statusText: '30%',
    status: 'success'
  }
}`,...(D=(h=s.parameters)==null?void 0:h.docs)==null?void 0:D.source}}};var T,q,Q;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Default - Warning',
  args: {
    variant: 'default',
    value: 75,
    max: 100,
    label: 'Memory Usage',
    statusText: '75%',
    status: 'warning'
  }
}`,...(Q=(q=n.parameters)==null?void 0:q.docs)==null?void 0:Q.source}}};var W,P,j;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Default - Danger',
  args: {
    variant: 'default',
    value: 95,
    max: 100,
    label: 'Storage',
    statusText: '95%',
    status: 'danger'
  }
}`,...(j=(P=l.parameters)==null?void 0:P.docs)==null?void 0:j.source}}};var U,B,N;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'Default - Error State',
  args: {
    variant: 'default',
    value: 100,
    max: 100,
    label: 'Disk Space',
    error: true,
    errorMessage: 'Storage quota exceeded',
    statusText: 'Full'
  }
}`,...(N=(B=u.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var y,E,C;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'quota',
    value: 5,
    max: 10,
    label: 'Instances',
    showValue: true
  }
}`,...(C=(E=o.parameters)==null?void 0:E.docs)==null?void 0:C.source}}};var A,I,M;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'Quota - With New Value',
  args: {
    variant: 'quota',
    value: 3,
    newValue: 2,
    max: 10,
    label: 'Instances',
    showValue: true
  }
}`,...(M=(I=i.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var L,k,F;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Quota - Warning Level',
  args: {
    variant: 'quota',
    value: 6,
    newValue: 2,
    max: 10,
    label: 'vCPU',
    showValue: true
  }
}`,...(F=(k=c.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var G,_,z;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'Quota - Exceeding',
  args: {
    variant: 'quota',
    value: 8,
    newValue: 5,
    max: 10,
    label: 'Memory (GB)',
    showValue: true
  }
}`,...(z=(_=m.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var O,R,H;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'Quota - Unlimited',
  args: {
    variant: 'quota',
    value: 15,
    max: undefined,
    label: 'API Calls',
    showValue: true
  }
}`,...(H=(R=d.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var J,K,X;v.parameters={...v.parameters,docs:{...(J=v.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'All Status Colors',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <ProgressBar variant="default" value={50} max={100} label="Info" status="info" statusText="50%" />
      <ProgressBar variant="default" value={50} max={100} label="Success" status="success" statusText="50%" />
      <ProgressBar variant="default" value={50} max={100} label="Warning" status="warning" statusText="50%" />
      <ProgressBar variant="default" value={50} max={100} label="Danger" status="danger" statusText="50%" />
      <ProgressBar variant="default" value={50} max={100} label="Neutral" status="neutral" statusText="50%" />
    </div>
}`,...(X=(K=v.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var Y,Z,$;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'Quota - All Levels',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <ProgressBar variant="quota" value={3} newValue={1} max={10} label="Normal (40%)" showValue />
      <ProgressBar variant="quota" value={5} newValue={2} max={10} label="Warning (70%)" showValue />
      <ProgressBar variant="quota" value={7} newValue={3} max={10} label="Warning (100%)" showValue />
      <ProgressBar variant="quota" value={8} newValue={5} max={10} label="Danger (130%)" showValue />
    </div>
}`,...($=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};const ua=["Default","DefaultWithStatus","DefaultSuccess","DefaultWarning","DefaultDanger","DefaultError","Quota","QuotaWithNewValue","QuotaWarning","QuotaExceeding","QuotaUnlimited","AllStatuses","QuotaLevels"];export{v as AllStatuses,t as Default,l as DefaultDanger,u as DefaultError,s as DefaultSuccess,n as DefaultWarning,r as DefaultWithStatus,o as Quota,m as QuotaExceeding,g as QuotaLevels,d as QuotaUnlimited,c as QuotaWarning,i as QuotaWithNewValue,ua as __namedExportsOrder,la as default};
