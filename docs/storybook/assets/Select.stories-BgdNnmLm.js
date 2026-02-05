import{j as e,r as he}from"./iframe-B4qQhCO6.js";import{S as t}from"./Select-D2IfIOeh.js";import"./preload-helper-C1FmrZbK.js";import"./index-DWHu83xY.js";import"./bundle-mjs-BZSatpsL.js";import"./IconX-FNl1vDsy.js";import"./createReactComponent-Bds5dDb0.js";import"./IconChevronDown-BLmatsEi.js";import"./IconCheck-BgbQWatL.js";const l=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"},{value:"option5",label:"Option 5"}],S=[{value:"kr",label:"대한민국"},{value:"us",label:"United States"},{value:"jp",label:"日本"},{value:"cn",label:"中国"},{value:"uk",label:"United Kingdom"}],g=[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"pending",label:"Pending"},{value:"archived",label:"Archived",disabled:!0}],We={title:"Components/Select",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
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
import { Select } from '@thaki/tds';

const options = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: 'United States' },
];

// 기본 사용
<Select 
  label="국가"
  options={options}
  placeholder="선택하세요"
/>

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
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"셀렉트 높이 (sm: 28px, md: 32px)",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},width:{control:"select",options:["xs","sm","md","lg","half","full"],description:"셀렉트 고정 너비 (xs: 80px, sm: 160px, md: 240px, lg: 320px, half: 50%, full: 100%)",table:{type:{summary:'"xs" | "sm" | "md" | "lg" | "half" | "full"'},defaultValue:{summary:'"md"'},category:"크기"}},label:{control:"text",description:"셀렉트 라벨",table:{type:{summary:"string"}}},helperText:{control:"text",description:"도움말 텍스트",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"선택 해제 버튼 표시 (X 아이콘)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},options:{description:"선택 가능한 옵션 배열",table:{type:{summary:"Array<{ value: string; label: string; disabled?: boolean }>"}}}},args:{options:l,placeholder:"Select an option"}},a={args:{options:l,placeholder:"Select an option"}},o={args:{label:"Category",options:l,placeholder:"Select category"}},s={args:{label:"Country",options:S,placeholder:"Select country",required:!0}},r={args:{label:"Status",options:g,placeholder:"Select status",helperText:"Choose the current status of the item"}},n={args:{label:"Category",options:l,placeholder:"Select category",error:"Please select a category"}},i={args:{label:"Country",options:S,defaultValue:"kr"}},c={render:function(){const[v,me]=he.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{label:"Controlled Select",options:l,value:v,onChange:me}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected value: ",e.jsx("strong",{children:v||"None"})]})]})}},p={args:{label:"Clearable Select",options:l,defaultValue:"option1",clearable:!0,clearLabel:"Clear selection"}},d={args:{label:"Status",options:g,placeholder:"Select status",helperText:'"Archived" option is disabled'}},u={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{size:"sm",options:l,placeholder:"Small (sm)"}),e.jsx(t,{size:"md",options:l,placeholder:"Medium (md)"})]})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{width:"xs",options:l,placeholder:"XS (80px)"}),e.jsx(t,{width:"sm",options:l,placeholder:"Small (160px)"}),e.jsx(t,{width:"md",options:l,placeholder:"Medium (240px)"}),e.jsx(t,{width:"lg",options:l,placeholder:"Large (320px)"}),e.jsx(t,{width:"half",options:l,placeholder:"Half (50%)"}),e.jsx(t,{width:"full",options:l,placeholder:"Full (100%)"})]})},h={args:{label:"Full Width Select",options:l,placeholder:"This select takes full width",fullWidth:!0},decorators:[y=>e.jsx("div",{style:{width:"400px"},children:e.jsx(y,{})})]},f={args:{label:"Disabled Select",options:l,placeholder:"Cannot select",disabled:!0}},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(t,{label:"Country",options:S,placeholder:"Select country",required:!0,fullWidth:!0}),e.jsx(t,{label:"Status",options:g,placeholder:"Select status",helperText:"Choose the current status",fullWidth:!0}),e.jsx(t,{label:"Category",options:l,placeholder:"Select category",clearable:!0,fullWidth:!0})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(t,{label:"Default",options:l,placeholder:"Default state",fullWidth:!0}),e.jsx(t,{label:"With Value",options:l,defaultValue:"option1",fullWidth:!0}),e.jsx(t,{label:"Disabled",options:l,placeholder:"Disabled",disabled:!0,fullWidth:!0}),e.jsx(t,{label:"Error",options:l,placeholder:"Select option",error:"This field has an error",fullWidth:!0}),e.jsx(t,{label:"Clearable with Value",options:l,defaultValue:"option2",clearable:!0,fullWidth:!0})]})};var C,O,W;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    placeholder: 'Select an option'
  }
}`,...(W=(O=a.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var j,w,V;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category'
  }
}`,...(V=(w=o.parameters)==null?void 0:w.docs)==null?void 0:V.source}}};var D,N,T;s.parameters={...s.parameters,docs:{...(D=s.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select country',
    required: true
  }
}`,...(T=(N=s.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var E,k,F;r.parameters={...r.parameters,docs:{...(E=r.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    options: statusOptions,
    placeholder: 'Select status',
    helperText: 'Choose the current status of the item'
  }
}`,...(F=(k=r.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var q,z,A;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category',
    error: 'Please select a category'
  }
}`,...(A=(z=n.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var L,H,M;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'kr'
  }
}`,...(M=(H=i.parameters)==null?void 0:H.docs)==null?void 0:M.source}}};var P,R,U;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: function ControlledSelect() {
    const [value, setValue] = useState('option2');
    return <div className="flex flex-col gap-4">
        <Select label="Controlled Select" options={defaultOptions} value={value} onChange={setValue} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>;
  }
}`,...(U=(R=c.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var X,_,I;p.parameters={...p.parameters,docs:{...(X=p.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    label: 'Clearable Select',
    options: defaultOptions,
    defaultValue: 'option1',
    clearable: true,
    clearLabel: 'Clear selection'
  }
}`,...(I=(_=p.parameters)==null?void 0:_.docs)==null?void 0:I.source}}};var K,B,G;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    options: statusOptions,
    placeholder: 'Select status',
    helperText: '"Archived" option is disabled'
  }
}`,...(G=(B=d.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var J,Q,Y;u.parameters={...u.parameters,docs:{...(J=u.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Select size="sm" options={defaultOptions} placeholder="Small (sm)" />
      <Select size="md" options={defaultOptions} placeholder="Medium (md)" />
    </div>
}`,...(Y=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};var Z,$,ee;m.parameters={...m.parameters,docs:{...(Z=m.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Select width="xs" options={defaultOptions} placeholder="XS (80px)" />
      <Select width="sm" options={defaultOptions} placeholder="Small (160px)" />
      <Select width="md" options={defaultOptions} placeholder="Medium (240px)" />
      <Select width="lg" options={defaultOptions} placeholder="Large (320px)" />
      <Select width="half" options={defaultOptions} placeholder="Half (50%)" />
      <Select width="full" options={defaultOptions} placeholder="Full (100%)" />
    </div>
}`,...(ee=($=m.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var le,te,ae;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    label: 'Full Width Select',
    options: defaultOptions,
    placeholder: 'This select takes full width',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '400px'
  }}>
        <Story />
      </div>]
}`,...(ae=(te=h.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var oe,se,re;f.parameters={...f.parameters,docs:{...(oe=f.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Select',
    options: defaultOptions,
    placeholder: 'Cannot select',
    disabled: true
  }
}`,...(re=(se=f.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ne,ie,ce;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Select label="Country" options={countryOptions} placeholder="Select country" required fullWidth />
      <Select label="Status" options={statusOptions} placeholder="Select status" helperText="Choose the current status" fullWidth />
      <Select label="Category" options={defaultOptions} placeholder="Select category" clearable fullWidth />
    </div>
}`,...(ce=(ie=b.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var pe,de,ue;x.parameters={...x.parameters,docs:{...(pe=x.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Select label="Default" options={defaultOptions} placeholder="Default state" fullWidth />
      <Select label="With Value" options={defaultOptions} defaultValue="option1" fullWidth />
      <Select label="Disabled" options={defaultOptions} placeholder="Disabled" disabled fullWidth />
      <Select label="Error" options={defaultOptions} placeholder="Select option" error="This field has an error" fullWidth />
      <Select label="Clearable with Value" options={defaultOptions} defaultValue="option2" clearable fullWidth />
    </div>
}`,...(ue=(de=x.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};const je=["Default","WithLabel","Required","WithHelperText","WithError","WithDefaultValue","Controlled","Clearable","WithDisabledOptions","Sizes","Widths","FullWidth","Disabled","FormExample","AllStates"];export{x as AllStates,p as Clearable,c as Controlled,a as Default,f as Disabled,b as FormExample,h as FullWidth,s as Required,u as Sizes,m as Widths,i as WithDefaultValue,d as WithDisabledOptions,n as WithError,r as WithHelperText,o as WithLabel,je as __namedExportsOrder,We as default};
