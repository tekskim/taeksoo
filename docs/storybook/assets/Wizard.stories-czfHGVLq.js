import{j as e}from"./iframe-IHmg4wqj.js";import{S as t}from"./SectionCard-_DB3VzG5.js";import{B as v}from"./Button-MQh3e0bs.js";import{I as S}from"./IconEdit-Dbw80On5.js";import{I as L}from"./IconCheck-CyvMmbTB.js";import{I as Q}from"./IconMinus-ChFWmO2b.js";import{H as X,V as g}from"./Stack-QAhmbgZe.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./chunk-JZWAC4HX-D0TSxNzy.js";import"./createReactComponent-BhwuFqFO.js";function s({status:a}){return a==="done"?e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center",children:e.jsx(L,{size:10,stroke:2.5,className:"text-white"})}):a==="active"?e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin",style:{borderStyle:"dashed",animationDuration:"2s"}}):a==="writing"?e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin",style:{borderStyle:"dashed",animationDuration:"2s"}}):a==="skipped"?e.jsx("div",{className:"w-4 h-4 shrink-0 flex items-center justify-center",children:e.jsx(Q,{size:12,stroke:1.5,className:"text-[var(--color-text-subtle)]"})}):e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]",style:{borderStyle:"dashed"}})}function f({title:a}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsx("div",{className:"h-[28px] flex items-center",children:e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a})})})}function h({title:a,onEdit:r}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsxs("div",{className:"h-[28px] flex items-center justify-between",children:[e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a}),r?e.jsxs(X,{gap:3,align:"center",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-subtle)]",children:"Writing..."}),e.jsx(v,{variant:"secondary",size:"sm",leftIcon:e.jsx(S,{size:12}),onClick:r,children:"Edit"})]}):e.jsx("span",{className:"text-body-md text-[var(--color-text-subtle)]",children:"Writing..."})]})})}function j({title:a,onEdit:r}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsxs("div",{className:"flex items-center justify-between h-[28px]",children:[e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"Not configured"}),e.jsx(v,{variant:"secondary",size:"sm",leftIcon:e.jsx(S,{size:12}),onClick:r,children:"Edit"})]})]})})}function y({title:a,onEdit:r,children:n}){return e.jsxs(t,{children:[e.jsx(t.Header,{title:a,showDivider:!1,actions:e.jsx(v,{variant:"outline",size:"sm",leftIcon:e.jsx(S,{size:12}),onClick:r,children:"Edit"})}),e.jsx("div",{className:"flex flex-col w-full gap-3",children:n})]})}function i({title:a,status:r,onEdit:n,summaryContent:J,children:K}){switch(r){case"pre":return e.jsx(f,{title:a});case"writing":return e.jsx(h,{title:a});case"skipped":return e.jsx(j,{title:a,onEdit:n||(()=>{})});case"done":return e.jsx(y,{title:a,onEdit:n||(()=>{}),children:J});case"active":default:return e.jsx(e.Fragment,{children:K})}}s.__docgenInfo={description:"",methods:[],displayName:"WizardSectionStatusIcon",props:{status:{required:!0,tsType:{name:"union",raw:"'pre' | 'active' | 'done' | 'skipped' | 'writing'",elements:[{name:"literal",value:"'pre'"},{name:"literal",value:"'active'"},{name:"literal",value:"'done'"},{name:"literal",value:"'skipped'"},{name:"literal",value:"'writing'"}]},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"PreSection",props:{title:{required:!0,tsType:{name:"string"},description:""}}};h.__docgenInfo={description:"",methods:[],displayName:"WritingSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};j.__docgenInfo={description:"",methods:[],displayName:"SkippedSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};y.__docgenInfo={description:"",methods:[],displayName:"DoneSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};i.__docgenInfo={description:`WizardSection - 마법사(Wizard) 패턴의 섹션 컴포넌트

상태에 따라 다른 UI를 렌더링합니다:
- pre: 대기 중 (빈 원 아이콘)
- active: 활성화됨 (회전 아이콘, children 렌더링)
- done: 완료됨 (체크 아이콘, summaryContent 렌더링)
- skipped: 건너뜀 (마이너스 아이콘, Not configured 표시)
- writing: 작성 중 (회전 아이콘, Writing... 표시)`,methods:[],displayName:"WizardSection",props:{title:{required:!0,tsType:{name:"string"},description:""},status:{required:!0,tsType:{name:"union",raw:"'pre' | 'active' | 'done' | 'skipped' | 'writing'",elements:[{name:"literal",value:"'pre'"},{name:"literal",value:"'active'"},{name:"literal",value:"'done'"},{name:"literal",value:"'skipped'"},{name:"literal",value:"'writing'"}]},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},summaryContent:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to show when status is 'done'"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to show when status is 'active'"}}};const ce={title:"Components/Wizard",component:i,tags:["autodocs"],decorators:[a=>e.jsx("div",{className:"max-w-2xl",children:e.jsx(a,{})})],parameters:{docs:{description:{component:`
## Wizard 컴포넌트

단계별 폼 위자드 패턴을 구현하는 컴포넌트 세트입니다.

### 구성 요소
- **WizardSection**: 상태에 따라 다른 UI를 렌더링하는 메인 컴포넌트
- **WizardSectionStatusIcon**: 상태 아이콘
- **PreSection**: 대기 중인 섹션
- **WritingSection**: 작성 중인 섹션
- **SkippedSection**: 건너뛴 섹션
- **DoneSection**: 완료된 섹션
- **DoneSectionRow**: 완료 섹션의 데이터 행

### 상태 (WizardSectionState)
- **pre**: 대기 중 (빈 원 아이콘)
- **active**: 활성화됨 (회전 아이콘)
- **done**: 완료됨 (체크 아이콘)
- **skipped**: 건너뜀 (마이너스 아이콘)
- **writing**: 작성 중 (회전 아이콘)

### 사용 시기
- 리소스 생성 마법사
- 다단계 폼
- 설정 위자드

### 예시
\`\`\`tsx
<WizardSection
  title="Basic information"
  status="done"
  onEdit={() => setStep(1)}
  summaryContent={
    <>
      <SectionCard.DataRow label="Name" value="my-instance" />
      <SectionCard.DataRow label="Type" value="m5.large" />
    </>
  }
/>
\`\`\`
        `}}},argTypes:{status:{control:"select",options:["pre","active","done","skipped","writing"],description:"섹션 상태"}}},o={name:"Status Icons",render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{status:"pre"}),e.jsx("span",{className:"text-body-md",children:"Pre (Waiting)"})]}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{status:"active"}),e.jsx("span",{className:"text-body-md",children:"Active"})]}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{status:"writing"}),e.jsx("span",{className:"text-body-md",children:"Writing"})]}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{status:"done"}),e.jsx("span",{className:"text-body-md",children:"Done"})]}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(s,{status:"skipped"}),e.jsx("span",{className:"text-body-md",children:"Skipped"})]})]})},c={name:"Pre Section",render:()=>e.jsx(f,{title:"Network Configuration"})},d={name:"Writing Section",render:()=>e.jsx(h,{title:"Storage Settings",onEdit:()=>console.log("Edit clicked")})},l={name:"Skipped Section",render:()=>e.jsx(j,{title:"Advanced Options",onEdit:()=>console.log("Edit clicked")})},p={name:"Done Section",render:()=>e.jsxs(y,{title:"Basic information",onEdit:()=>console.log("Edit clicked"),children:[e.jsx(t.DataRow,{label:"Instance Name",value:"production-server-01",showDivider:!1}),e.jsx(t.DataRow,{label:"Description",value:"Main production web server"}),e.jsx(t.DataRow,{label:"Region",value:"us-east-1"})]})},m={name:"All States",render:()=>e.jsxs(g,{gap:4,children:[e.jsx(i,{title:"Step 1: Basic Info",status:"done",onEdit:()=>{},summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Name",value:"my-instance",showDivider:!1}),e.jsx(t.DataRow,{label:"Type",value:"m5.large"})]})}),e.jsx(i,{title:"Step 2: Configuration",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Step 2: Configuration"}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Configure your instance settings here..."})})]})}),e.jsx(i,{title:"Step 3: Network",status:"pre"}),e.jsx(i,{title:"Step 4: Storage",status:"pre"})]})},u={name:"Full Wizard Example",render:()=>e.jsxs(g,{gap:4,children:[e.jsx(i,{title:"Basic information",status:"done",onEdit:()=>console.log("Edit Basic Info"),summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Instance Name",value:"web-server-prod-01",showDivider:!1}),e.jsx(t.DataRow,{label:"Description",value:"Production web server for main application"}),e.jsx(t.DataRow,{label:"Project",value:"E-commerce Platform"})]})}),e.jsx(i,{title:"Instance Type",status:"done",onEdit:()=>console.log("Edit Instance Type"),summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Type",value:"m5.xlarge",showDivider:!1}),e.jsx(t.DataRow,{label:"vCPU",value:"4"}),e.jsx(t.DataRow,{label:"Memory",value:"16 GB"})]})}),e.jsx(i,{title:"Network Configuration",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Network Configuration"}),e.jsx(t.Content,{children:e.jsx("div",{className:"text-body-md text-[var(--color-text-muted)] py-[var(--primitive-spacing-4)]",children:"Select VPC, subnet, and security group settings..."})})]})}),e.jsx(i,{title:"Storage",status:"pre"}),e.jsx(i,{title:"Security",status:"pre"}),e.jsx(i,{title:"Review & Create",status:"pre"})]})},x={name:"With Skipped Steps",render:()=>e.jsxs(g,{gap:4,children:[e.jsx(i,{title:"Required Settings",status:"done",onEdit:()=>{},summaryContent:e.jsx(t.DataRow,{label:"Name",value:"my-resource",showDivider:!1})}),e.jsx(i,{title:"Optional: Tags",status:"skipped",onEdit:()=>console.log("Configure tags")}),e.jsx(i,{title:"Optional: Monitoring",status:"skipped",onEdit:()=>console.log("Configure monitoring")}),e.jsx(i,{title:"Review",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Review"}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Review your configuration before creating..."})})]})})]})};var w,b,C;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Status Icons',
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="pre" />
        <span className="text-body-md">Pre (Waiting)</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="active" />
        <span className="text-body-md">Active</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="writing" />
        <span className="text-body-md">Writing</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="done" />
        <span className="text-body-md">Done</span>
      </div>
      <div className="flex items-center gap-[var(--primitive-spacing-2)]">
        <WizardSectionStatusIcon status="skipped" />
        <span className="text-body-md">Skipped</span>
      </div>
    </div>
}`,...(C=(b=o.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};var N,k,W;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'Pre Section',
  render: () => <PreSection title="Network Configuration" />
}`,...(W=(k=c.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};var D,E,R;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Writing Section',
  render: () => <WritingSection title="Storage Settings" onEdit={() => console.log('Edit clicked')} />
}`,...(R=(E=d.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var z,I,T;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Skipped Section',
  render: () => <SkippedSection title="Advanced Options" onEdit={() => console.log('Edit clicked')} />
}`,...(T=(I=l.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var P,q,A;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Done Section',
  render: () => <DoneSection title="Basic information" onEdit={() => console.log('Edit clicked')}>
      <SectionCard.DataRow label="Instance Name" value="production-server-01" showDivider={false} />
      <SectionCard.DataRow label="Description" value="Main production web server" />
      <SectionCard.DataRow label="Region" value="us-east-1" />
    </DoneSection>
}`,...(A=(q=p.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};var _,B,V;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'All States',
  render: () => <VStack gap={4}>
      <WizardSection title="Step 1: Basic Info" status="done" onEdit={() => {}} summaryContent={<>
            <SectionCard.DataRow label="Name" value="my-instance" showDivider={false} />
            <SectionCard.DataRow label="Type" value="m5.large" />
          </>} />
      <WizardSection title="Step 2: Configuration" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Step 2: Configuration" />
          <SectionCard.Content>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Configure your instance settings here...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
      <WizardSection title="Step 3: Network" status="pre" />
      <WizardSection title="Step 4: Storage" status="pre" />
    </VStack>
}`,...(V=(B=m.parameters)==null?void 0:B.docs)==null?void 0:V.source}}};var H,F,M;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Full Wizard Example',
  render: () => <VStack gap={4}>
      {/* Completed Step */}
      <WizardSection title="Basic information" status="done" onEdit={() => console.log('Edit Basic Info')} summaryContent={<>
            <SectionCard.DataRow label="Instance Name" value="web-server-prod-01" showDivider={false} />
            <SectionCard.DataRow label="Description" value="Production web server for main application" />
            <SectionCard.DataRow label="Project" value="E-commerce Platform" />
          </>} />

      {/* Completed Step */}
      <WizardSection title="Instance Type" status="done" onEdit={() => console.log('Edit Instance Type')} summaryContent={<>
            <SectionCard.DataRow label="Type" value="m5.xlarge" showDivider={false} />
            <SectionCard.DataRow label="vCPU" value="4" />
            <SectionCard.DataRow label="Memory" value="16 GB" />
          </>} />

      {/* Active Step */}
      <WizardSection title="Network Configuration" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Network Configuration" />
          <SectionCard.Content>
            <div className="text-body-md text-[var(--color-text-muted)] py-[var(--primitive-spacing-4)]">
              Select VPC, subnet, and security group settings...
            </div>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>

      {/* Pending Steps */}
      <WizardSection title="Storage" status="pre" />
      <WizardSection title="Security" status="pre" />
      <WizardSection title="Review & Create" status="pre" />
    </VStack>
}`,...(M=(F=u.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};var O,U,G;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'With Skipped Steps',
  render: () => <VStack gap={4}>
      <WizardSection title="Required Settings" status="done" onEdit={() => {}} summaryContent={<SectionCard.DataRow label="Name" value="my-resource" showDivider={false} />} />
      <WizardSection title="Optional: Tags" status="skipped" onEdit={() => console.log('Configure tags')} />
      <WizardSection title="Optional: Monitoring" status="skipped" onEdit={() => console.log('Configure monitoring')} />
      <WizardSection title="Review" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Review" />
          <SectionCard.Content>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Review your configuration before creating...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
    </VStack>
}`,...(G=(U=x.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};const de=["StatusIcons","PreSectionExample","WritingSectionExample","SkippedSectionExample","DoneSectionExample","AllStates","FullWizardExample","WithSkippedSteps"];export{m as AllStates,p as DoneSectionExample,u as FullWizardExample,c as PreSectionExample,l as SkippedSectionExample,o as StatusIcons,x as WithSkippedSteps,d as WritingSectionExample,de as __namedExportsOrder,ce as default};
