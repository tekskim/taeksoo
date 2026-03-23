import{j as e,r as he}from"./iframe-CzLct1Ct.js";import{S as l}from"./Select-tQoa6OSr.js";import{F as r}from"./FormField-DsPb4fJ_.js";import"./preload-helper-C1FmrZbK.js";import"./index-CZa75-BM.js";import"./cn-BMXv33oC.js";import"./IconX-Br_T-QG9.js";import"./createReactComponent-Djx9unWR.js";import"./IconChevronDown-wxdkvj6Y.js";import"./IconCheck-Dy71EyJ1.js";const t=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"},{value:"option5",label:"Option 5"}],F=[{value:"kr",label:"대한민국"},{value:"us",label:"United States"},{value:"jp",label:"日本"},{value:"cn",label:"中国"},{value:"uk",label:"United Kingdom"}],g=[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"pending",label:"Pending"},{value:"archived",label:"Archived",disabled:!0}],Oe={title:"Components/Select",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
## Select 컴포넌트

드롭다운에서 옵션을 선택하는 폼 컴포넌트입니다.

### 너비 정책
- **고정 너비**: sm (160px), md (240px), lg (320px)
- **fullWidth**: 부모 컨테이너에 맞춤

### 사용 시기
- 미리 정의된 옵션 중 하나 선택
- 국가, 카테고리, 상태 등 선택

### 접근성
- 키보드 네비게이션 지원 (↑↓ 화살표, Enter, ESC)
- aria-expanded, aria-haspopup 자동 적용
- 스크린리더 옵션 읽기 지원

### 예시
\`\`\`tsx
import { Select, FormField } from '@thaki/tds';

const options = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: 'United States' },
];

// FormField와 함께 사용
<FormField label="국가">
  <Select options={options} placeholder="선택하세요" fullWidth />
</FormField>

// Controlled
<Select 
  value={country}
  onChange={setCountry}
  options={options}
/>

// 선택 해제 가능
<Select 
  options={options}
  clearable
/>
\`\`\`
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"셀렉트 높이 (sm: 28px, md: 32px)",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},width:{control:"select",options:["xs","sm","md","lg","half","full"],description:"셀렉트 고정 너비 (xs: 80px, sm: 160px, md: 240px, lg: 320px, half: 50%, full: 100%)",table:{type:{summary:'"xs" | "sm" | "md" | "lg" | "half" | "full"'},defaultValue:{summary:'"md"'},category:"크기"}},label:{control:"text",description:"셀렉트 라벨",table:{type:{summary:"string"}}},helperText:{control:"text",description:"도움말 텍스트",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"선택 해제 버튼 표시 (X 아이콘)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},options:{description:"선택 가능한 옵션 배열",table:{type:{summary:"Array<{ value: string; label: string; disabled?: boolean }>"}}}},args:{options:t,placeholder:"Select an option"}},o={args:{options:t,placeholder:"Select an option"}},a={render:()=>e.jsx(r,{label:"Category",children:e.jsx(l,{options:t,placeholder:"Select category",fullWidth:!0})})},s={render:()=>e.jsx(r,{label:"Country",required:!0,children:e.jsx(l,{options:F,placeholder:"Select country",fullWidth:!0})})},i={render:()=>e.jsx(r,{label:"Status",helperText:"Choose the current status of the item",children:e.jsx(l,{options:g,placeholder:"Select status",fullWidth:!0})})},n={render:()=>e.jsx(r,{label:"Category",errorMessage:"Please select a category",error:!0,children:e.jsx(l,{options:t,placeholder:"Select category",fullWidth:!0})})},d={render:()=>e.jsx(r,{label:"Country",children:e.jsx(l,{options:F,defaultValue:"kr",fullWidth:!0})})},c={render:function(){const[v,me]=he.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(r,{label:"Controlled Select",children:e.jsx(l,{options:t,value:v,onChange:me,fullWidth:!0})}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected value: ",e.jsx("strong",{children:v||"None"})]})]})}},p={render:()=>e.jsx(r,{label:"Clearable Select",children:e.jsx(l,{options:t,defaultValue:"option1",clearable:!0,clearLabel:"Clear selection",fullWidth:!0})})},u={render:()=>e.jsx(r,{label:"Status",helperText:'"Archived" option is disabled',children:e.jsx(l,{options:g,placeholder:"Select status",fullWidth:!0})})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{size:"sm",options:t,placeholder:"Small (sm)"}),e.jsx(l,{size:"md",options:t,placeholder:"Medium (md)"})]})},h={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{width:"xs",options:t,placeholder:"XS (80px)"}),e.jsx(l,{width:"sm",options:t,placeholder:"Small (160px)"}),e.jsx(l,{width:"md",options:t,placeholder:"Medium (240px)"}),e.jsx(l,{width:"lg",options:t,placeholder:"Large (320px)"}),e.jsx(l,{width:"half",options:t,placeholder:"Half (50%)"}),e.jsx(l,{width:"full",options:t,placeholder:"Full (100%)"})]})},f={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Full Width Select",children:e.jsx(l,{options:t,placeholder:"This select takes full width",fullWidth:!0})})})},x={render:()=>e.jsx(r,{label:"Disabled Select",children:e.jsx(l,{options:t,placeholder:"Cannot select",disabled:!0,fullWidth:!0})})},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]",children:[e.jsx(r,{label:"Country",required:!0,children:e.jsx(l,{options:F,placeholder:"Select country",fullWidth:!0})}),e.jsx(r,{label:"Status",helperText:"Choose the current status",children:e.jsx(l,{options:g,placeholder:"Select status",fullWidth:!0})}),e.jsx(r,{label:"Category",children:e.jsx(l,{options:t,placeholder:"Select category",clearable:!0,fullWidth:!0})})]})},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]",children:[e.jsx(r,{label:"Default",children:e.jsx(l,{options:t,placeholder:"Default state",fullWidth:!0})}),e.jsx(r,{label:"With Value",children:e.jsx(l,{options:t,defaultValue:"option1",fullWidth:!0})}),e.jsx(r,{label:"Disabled",children:e.jsx(l,{options:t,placeholder:"Disabled",disabled:!0,fullWidth:!0})}),e.jsx(r,{label:"Error",errorMessage:"This field has an error",error:!0,children:e.jsx(l,{options:t,placeholder:"Select option",fullWidth:!0})}),e.jsx(r,{label:"Clearable with Value",children:e.jsx(l,{options:t,defaultValue:"option2",clearable:!0,fullWidth:!0})})]})};var y,W,j;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    placeholder: 'Select an option'
  }
}`,...(j=(W=o.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};var C,O,w;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <FormField label="Category">
      <Select options={defaultOptions} placeholder="Select category" fullWidth />
    </FormField>
}`,...(w=(O=a.parameters)==null?void 0:O.docs)==null?void 0:w.source}}};var V,D,N;s.parameters={...s.parameters,docs:{...(V=s.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <FormField label="Country" required>
      <Select options={countryOptions} placeholder="Select country" fullWidth />
    </FormField>
}`,...(N=(D=s.parameters)==null?void 0:D.docs)==null?void 0:N.source}}};var T,E,k;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <FormField label="Status" helperText="Choose the current status of the item">
      <Select options={statusOptions} placeholder="Select status" fullWidth />
    </FormField>
}`,...(k=(E=i.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};var M,q,z;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <FormField label="Category" errorMessage="Please select a category" error>
      <Select options={defaultOptions} placeholder="Select category" fullWidth />
    </FormField>
}`,...(z=(q=n.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var A,L,H;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <FormField label="Country">
      <Select options={countryOptions} defaultValue="kr" fullWidth />
    </FormField>
}`,...(H=(L=d.parameters)==null?void 0:L.docs)==null?void 0:H.source}}};var P,R,U;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: function ControlledSelect() {
    const [value, setValue] = useState('option2');
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <FormField label="Controlled Select">
          <Select options={defaultOptions} value={value} onChange={setValue} fullWidth />
        </FormField>
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>;
  }
}`,...(U=(R=c.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var X,_,I;p.parameters={...p.parameters,docs:{...(X=p.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <FormField label="Clearable Select">
      <Select options={defaultOptions} defaultValue="option1" clearable clearLabel="Clear selection" fullWidth />
    </FormField>
}`,...(I=(_=p.parameters)==null?void 0:_.docs)==null?void 0:I.source}}};var K,B,G;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <FormField label="Status" helperText={'"Archived" option is disabled'}>
      <Select options={statusOptions} placeholder="Select status" fullWidth />
    </FormField>
}`,...(G=(B=u.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var J,Q,Y;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Select size="sm" options={defaultOptions} placeholder="Small (sm)" />
      <Select size="md" options={defaultOptions} placeholder="Medium (md)" />
    </div>
}`,...(Y=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};var Z,$,ee;h.parameters={...h.parameters,docs:{...(Z=h.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Select width="xs" options={defaultOptions} placeholder="XS (80px)" />
      <Select width="sm" options={defaultOptions} placeholder="Small (160px)" />
      <Select width="md" options={defaultOptions} placeholder="Medium (240px)" />
      <Select width="lg" options={defaultOptions} placeholder="Large (320px)" />
      <Select width="half" options={defaultOptions} placeholder="Half (50%)" />
      <Select width="full" options={defaultOptions} placeholder="Full (100%)" />
    </div>
}`,...(ee=($=h.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var le,te,re;f.parameters={...f.parameters,docs:{...(le=f.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Full Width Select">
        <Select options={defaultOptions} placeholder="This select takes full width" fullWidth />
      </FormField>
    </div>
}`,...(re=(te=f.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var oe,ae,se;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <FormField label="Disabled Select">
      <Select options={defaultOptions} placeholder="Cannot select" disabled fullWidth />
    </FormField>
}`,...(se=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var ie,ne,de;b.parameters={...b.parameters,docs:{...(ie=b.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Country" required>
        <Select options={countryOptions} placeholder="Select country" fullWidth />
      </FormField>
      <FormField label="Status" helperText="Choose the current status">
        <Select options={statusOptions} placeholder="Select status" fullWidth />
      </FormField>
      <FormField label="Category">
        <Select options={defaultOptions} placeholder="Select category" clearable fullWidth />
      </FormField>
    </div>
}`,...(de=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:de.source}}};var ce,pe,ue;S.parameters={...S.parameters,docs:{...(ce=S.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Default">
        <Select options={defaultOptions} placeholder="Default state" fullWidth />
      </FormField>
      <FormField label="With Value">
        <Select options={defaultOptions} defaultValue="option1" fullWidth />
      </FormField>
      <FormField label="Disabled">
        <Select options={defaultOptions} placeholder="Disabled" disabled fullWidth />
      </FormField>
      <FormField label="Error" errorMessage="This field has an error" error>
        <Select options={defaultOptions} placeholder="Select option" fullWidth />
      </FormField>
      <FormField label="Clearable with Value">
        <Select options={defaultOptions} defaultValue="option2" clearable fullWidth />
      </FormField>
    </div>
}`,...(ue=(pe=S.parameters)==null?void 0:pe.docs)==null?void 0:ue.source}}};const we=["Default","WithLabel","Required","WithHelperText","WithError","WithDefaultValue","Controlled","Clearable","WithDisabledOptions","Sizes","Widths","FullWidth","Disabled","FormExample","AllStates"];export{S as AllStates,p as Clearable,c as Controlled,o as Default,x as Disabled,b as FormExample,f as FullWidth,s as Required,m as Sizes,h as Widths,d as WithDefaultValue,u as WithDisabledOptions,n as WithError,i as WithHelperText,a as WithLabel,we as __namedExportsOrder,Oe as default};
