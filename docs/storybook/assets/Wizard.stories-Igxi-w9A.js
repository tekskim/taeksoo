import{j as e}from"./iframe-Dtaoqwlr.js";import{S as t}from"./SectionCard-CFvMwdFw.js";import{B as S}from"./Button-Cn98FFLP.js";import{I as g}from"./IconEdit-Drd9wG00.js";import{I as Q}from"./IconCheck-Yo-Txvb4.js";import{I as N}from"./IconProgress-DY0tIKV5.js";import{I as X}from"./IconMinus-BygYRnoR.js";import{H as Y,V as v}from"./Stack-CIivmXNP.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./chunk-JZWAC4HX-ZZojURsx.js";import"./createReactComponent-oNNwel7Z.js";function r({status:a}){return a==="done"?e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center",children:e.jsx(Q,{size:10,stroke:2.5,className:"text-white"})}):a==="active"?e.jsx("div",{className:"w-4 h-4 shrink-0 flex items-center justify-center",children:e.jsx(N,{size:16,stroke:1.5,className:"text-[var(--color-text-subtle)] animate-spin"})}):a==="writing"?e.jsx("div",{className:"w-4 h-4 shrink-0 flex items-center justify-center",children:e.jsx(N,{size:16,stroke:1.5,className:"text-[var(--color-text-subtle)] animate-spin"})}):a==="skipped"?e.jsx("div",{className:"w-4 h-4 shrink-0 flex items-center justify-center",children:e.jsx(X,{size:16,stroke:1.5,className:"text-[var(--color-text-subtle)]"})}):e.jsx("div",{className:"w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"})}function f({title:a}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsx("div",{className:"h-8 flex items-center",children:e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a})})})}function j({title:a,onEdit:s}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsxs("div",{className:"h-8 flex items-center justify-between",children:[e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a}),s?e.jsxs(Y,{gap:3,align:"center",children:[e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Writing..."}),e.jsx(S,{variant:"outline",size:"sm",leftIcon:e.jsx(g,{size:12}),onClick:s,children:"Edit"})]}):e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Writing..."})]})})}function h({title:a,onEdit:s}){return e.jsx("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3",children:e.jsxs("div",{className:"flex items-center justify-between h-8",children:[e.jsx("h5",{className:"text-heading-h5 text-[var(--color-text-default)]",children:a}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"Not configured"}),e.jsx(S,{variant:"outline",size:"sm",leftIcon:e.jsx(g,{size:12}),onClick:s,children:"Edit"})]})]})})}function w({title:a,onEdit:s,children:n}){return e.jsxs(t,{children:[e.jsx(t.Header,{title:a,showDivider:!1,actions:e.jsx(S,{variant:"outline",size:"sm",leftIcon:e.jsx(g,{size:12}),onClick:s,children:"Edit"})}),e.jsx("div",{className:"flex flex-col w-full gap-3",children:n})]})}function i({title:a,status:s,onEdit:n,summaryContent:K,children:L}){switch(s){case"pre":return e.jsx(f,{title:a});case"writing":return e.jsx(j,{title:a});case"skipped":return e.jsx(h,{title:a,onEdit:n||(()=>{})});case"done":return e.jsx(w,{title:a,onEdit:n||(()=>{}),children:K});case"active":default:return e.jsx(e.Fragment,{children:L})}}r.__docgenInfo={description:"",methods:[],displayName:"WizardSectionStatusIcon",props:{status:{required:!0,tsType:{name:"union",raw:"'pre' | 'active' | 'done' | 'skipped' | 'writing'",elements:[{name:"literal",value:"'pre'"},{name:"literal",value:"'active'"},{name:"literal",value:"'done'"},{name:"literal",value:"'skipped'"},{name:"literal",value:"'writing'"}]},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"PreSection",props:{title:{required:!0,tsType:{name:"string"},description:""}}};j.__docgenInfo={description:"",methods:[],displayName:"WritingSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};h.__docgenInfo={description:"",methods:[],displayName:"SkippedSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};w.__docgenInfo={description:"",methods:[],displayName:"DoneSection",props:{title:{required:!0,tsType:{name:"string"},description:""},onEdit:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};i.__docgenInfo={description:`WizardSection - 마법사(Wizard) 패턴의 섹션 컴포넌트

상태에 따라 다른 UI를 렌더링합니다:
- pre: 대기 중 (빈 원 아이콘)
- active: 활성화됨 (회전 아이콘, children 렌더링)
- done: 완료됨 (체크 아이콘, summaryContent 렌더링)
- skipped: 건너뜀 (마이너스 아이콘, Not configured 표시)
- writing: 작성 중 (회전 아이콘, Writing... 표시)`,methods:[],displayName:"WizardSection",props:{title:{required:!0,tsType:{name:"string"},description:""},status:{required:!0,tsType:{name:"union",raw:"'pre' | 'active' | 'done' | 'skipped' | 'writing'",elements:[{name:"literal",value:"'pre'"},{name:"literal",value:"'active'"},{name:"literal",value:"'done'"},{name:"literal",value:"'skipped'"},{name:"literal",value:"'writing'"}]},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},summaryContent:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to show when status is 'done'"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to show when status is 'active'"}}};const de={title:"Components/Wizard",component:i,tags:["autodocs"],decorators:[a=>e.jsx("div",{className:"max-w-2xl",children:e.jsx(a,{})})],parameters:{docs:{description:{component:`
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
  title="Basic Information"
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
        `}}},argTypes:{status:{control:"select",options:["pre","active","done","skipped","writing"],description:"섹션 상태"}}},o={name:"Status Icons",render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{status:"pre"}),e.jsx("span",{className:"text-sm",children:"Pre (Waiting)"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{status:"active"}),e.jsx("span",{className:"text-sm",children:"Active"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{status:"writing"}),e.jsx("span",{className:"text-sm",children:"Writing"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{status:"done"}),e.jsx("span",{className:"text-sm",children:"Done"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{status:"skipped"}),e.jsx("span",{className:"text-sm",children:"Skipped"})]})]})},c={name:"Pre Section",render:()=>e.jsx(f,{title:"Network Configuration"})},l={name:"Writing Section",render:()=>e.jsx(j,{title:"Storage Settings",onEdit:()=>console.log("Edit clicked")})},d={name:"Skipped Section",render:()=>e.jsx(h,{title:"Advanced Options",onEdit:()=>console.log("Edit clicked")})},p={name:"Done Section",render:()=>e.jsxs(w,{title:"Basic Information",onEdit:()=>console.log("Edit clicked"),children:[e.jsx(t.DataRow,{label:"Instance Name",value:"production-server-01",showDivider:!1}),e.jsx(t.DataRow,{label:"Description",value:"Main production web server"}),e.jsx(t.DataRow,{label:"Region",value:"us-east-1"})]})},m={name:"All States",render:()=>e.jsxs(v,{gap:4,children:[e.jsx(i,{title:"Step 1: Basic Info",status:"done",onEdit:()=>{},summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Name",value:"my-instance",showDivider:!1}),e.jsx(t.DataRow,{label:"Type",value:"m5.large"})]})}),e.jsx(i,{title:"Step 2: Configuration",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Step 2: Configuration"}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Configure your instance settings here..."})})]})}),e.jsx(i,{title:"Step 3: Network",status:"pre"}),e.jsx(i,{title:"Step 4: Storage",status:"pre"})]})},u={name:"Full Wizard Example",render:()=>e.jsxs(v,{gap:4,children:[e.jsx(i,{title:"Basic Information",status:"done",onEdit:()=>console.log("Edit Basic Info"),summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Instance Name",value:"web-server-prod-01",showDivider:!1}),e.jsx(t.DataRow,{label:"Description",value:"Production web server for main application"}),e.jsx(t.DataRow,{label:"Project",value:"E-commerce Platform"})]})}),e.jsx(i,{title:"Instance Type",status:"done",onEdit:()=>console.log("Edit Instance Type"),summaryContent:e.jsxs(e.Fragment,{children:[e.jsx(t.DataRow,{label:"Type",value:"m5.xlarge",showDivider:!1}),e.jsx(t.DataRow,{label:"vCPU",value:"4"}),e.jsx(t.DataRow,{label:"Memory",value:"16 GB"})]})}),e.jsx(i,{title:"Network Configuration",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Network Configuration"}),e.jsx(t.Content,{children:e.jsx("div",{className:"text-sm text-[var(--color-text-muted)] py-4",children:"Select VPC, subnet, and security group settings..."})})]})}),e.jsx(i,{title:"Storage",status:"pre"}),e.jsx(i,{title:"Security",status:"pre"}),e.jsx(i,{title:"Review & Create",status:"pre"})]})},x={name:"With Skipped Steps",render:()=>e.jsxs(v,{gap:4,children:[e.jsx(i,{title:"Required Settings",status:"done",onEdit:()=>{},summaryContent:e.jsx(t.DataRow,{label:"Name",value:"my-resource",showDivider:!1})}),e.jsx(i,{title:"Optional: Tags",status:"skipped",onEdit:()=>console.log("Configure tags")}),e.jsx(i,{title:"Optional: Monitoring",status:"skipped",onEdit:()=>console.log("Configure monitoring")}),e.jsx(i,{title:"Review",status:"active",children:e.jsxs(t,{isActive:!0,children:[e.jsx(t.Header,{title:"Review"}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Review your configuration before creating..."})})]})})]})};var C,y,k;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Status Icons',
  render: () => <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <WizardSectionStatusIcon status="pre" />
        <span className="text-sm">Pre (Waiting)</span>
      </div>
      <div className="flex items-center gap-2">
        <WizardSectionStatusIcon status="active" />
        <span className="text-sm">Active</span>
      </div>
      <div className="flex items-center gap-2">
        <WizardSectionStatusIcon status="writing" />
        <span className="text-sm">Writing</span>
      </div>
      <div className="flex items-center gap-2">
        <WizardSectionStatusIcon status="done" />
        <span className="text-sm">Done</span>
      </div>
      <div className="flex items-center gap-2">
        <WizardSectionStatusIcon status="skipped" />
        <span className="text-sm">Skipped</span>
      </div>
    </div>
}`,...(k=(y=o.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var b,W,D;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'Pre Section',
  render: () => <PreSection title="Network Configuration" />
}`,...(D=(W=c.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var E,R,z;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'Writing Section',
  render: () => <WritingSection title="Storage Settings" onEdit={() => console.log('Edit clicked')} />
}`,...(z=(R=l.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var I,T,P;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Skipped Section',
  render: () => <SkippedSection title="Advanced Options" onEdit={() => console.log('Edit clicked')} />
}`,...(P=(T=d.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};var q,A,_;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Done Section',
  render: () => <DoneSection title="Basic Information" onEdit={() => console.log('Edit clicked')}>
      <SectionCard.DataRow label="Instance Name" value="production-server-01" showDivider={false} />
      <SectionCard.DataRow label="Description" value="Main production web server" />
      <SectionCard.DataRow label="Region" value="us-east-1" />
    </DoneSection>
}`,...(_=(A=p.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var B,V,H;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
            <p className="text-sm text-[var(--color-text-muted)]">
              Configure your instance settings here...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
      <WizardSection title="Step 3: Network" status="pre" />
      <WizardSection title="Step 4: Storage" status="pre" />
    </VStack>
}`,...(H=(V=m.parameters)==null?void 0:V.docs)==null?void 0:H.source}}};var F,M,O;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Full Wizard Example',
  render: () => <VStack gap={4}>
      {/* Completed Step */}
      <WizardSection title="Basic Information" status="done" onEdit={() => console.log('Edit Basic Info')} summaryContent={<>
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
            <div className="text-sm text-[var(--color-text-muted)] py-4">
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
}`,...(O=(M=u.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var U,G,J;x.parameters={...x.parameters,docs:{...(U=x.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'With Skipped Steps',
  render: () => <VStack gap={4}>
      <WizardSection title="Required Settings" status="done" onEdit={() => {}} summaryContent={<SectionCard.DataRow label="Name" value="my-resource" showDivider={false} />} />
      <WizardSection title="Optional: Tags" status="skipped" onEdit={() => console.log('Configure tags')} />
      <WizardSection title="Optional: Monitoring" status="skipped" onEdit={() => console.log('Configure monitoring')} />
      <WizardSection title="Review" status="active">
        <SectionCard isActive>
          <SectionCard.Header title="Review" />
          <SectionCard.Content>
            <p className="text-sm text-[var(--color-text-muted)]">
              Review your configuration before creating...
            </p>
          </SectionCard.Content>
        </SectionCard>
      </WizardSection>
    </VStack>
}`,...(J=(G=x.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};const pe=["StatusIcons","PreSectionExample","WritingSectionExample","SkippedSectionExample","DoneSectionExample","AllStates","FullWizardExample","WithSkippedSteps"];export{m as AllStates,p as DoneSectionExample,u as FullWizardExample,c as PreSectionExample,d as SkippedSectionExample,o as StatusIcons,x as WithSkippedSteps,l as WritingSectionExample,pe as __namedExportsOrder,de as default};
