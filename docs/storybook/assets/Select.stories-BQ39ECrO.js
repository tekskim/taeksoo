import{j as e,r as he}from"./iframe-D96dQDLz.js";import{S as l}from"./Select-CwYvJg0l.js";import"./preload-helper-C1FmrZbK.js";import"./index-Dm9gNcw7.js";import"./bundle-mjs-BZSatpsL.js";import"./IconX-DlnDTnrf.js";import"./createReactComponent-Dvr8b43U.js";import"./IconChevronDown-B3KfbvkI.js";import"./IconCheck-KE79Jf-a.js";const t=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"},{value:"option5",label:"Option 5"}],x=[{value:"kr",label:"대한민국"},{value:"us",label:"United States"},{value:"jp",label:"日本"},{value:"cn",label:"中国"},{value:"uk",label:"United Kingdom"}],g=[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"pending",label:"Pending"},{value:"archived",label:"Archived",disabled:!0}],Oe={title:"Components/Select",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"셀렉트 높이 (sm: 28px, md: 32px)",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},width:{control:"select",options:["sm","md","lg"],description:"셀렉트 고정 너비",table:{type:{summary:'"sm" | "md" | "lg"'},defaultValue:{summary:'"md"'},category:"크기"}},label:{control:"text",description:"셀렉트 라벨",table:{type:{summary:"string"}}},helperText:{control:"text",description:"도움말 텍스트",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"선택 해제 버튼 표시 (X 아이콘)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},options:{description:"선택 가능한 옵션 배열",table:{type:{summary:"Array<{ value: string; label: string; disabled?: boolean }>"}}}},args:{options:t,placeholder:"Select an option"}},a={args:{options:t,placeholder:"Select an option"}},o={args:{label:"Category",options:t,placeholder:"Select category"}},r={args:{label:"Country",options:x,placeholder:"Select country",required:!0}},s={args:{label:"Status",options:g,placeholder:"Select status",helperText:"Choose the current status of the item"}},n={args:{label:"Category",options:t,placeholder:"Select category",error:"Please select a category"}},i={args:{label:"Country",options:x,defaultValue:"kr"}},c={render:function(){const[v,me]=he.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{label:"Controlled Select",options:t,value:v,onChange:me}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected value: ",e.jsx("strong",{children:v||"None"})]})]})}},p={args:{label:"Clearable Select",options:t,defaultValue:"option1",clearable:!0,clearLabel:"Clear selection"}},d={args:{label:"Status",options:g,placeholder:"Select status",helperText:'"Archived" option is disabled'}},u={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{size:"sm",options:t,placeholder:"Small (sm)"}),e.jsx(l,{size:"md",options:t,placeholder:"Medium (md)"})]})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{width:"sm",options:t,placeholder:"Small width (160px)"}),e.jsx(l,{width:"md",options:t,placeholder:"Medium width (240px)"}),e.jsx(l,{width:"lg",options:t,placeholder:"Large width (320px)"})]})},h={args:{label:"Full Width Select",options:t,placeholder:"This select takes full width",fullWidth:!0},decorators:[y=>e.jsx("div",{style:{width:"400px"},children:e.jsx(y,{})})]},b={args:{label:"Disabled Select",options:t,placeholder:"Cannot select",disabled:!0}},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(l,{label:"Country",options:x,placeholder:"Select country",required:!0,fullWidth:!0}),e.jsx(l,{label:"Status",options:g,placeholder:"Select status",helperText:"Choose the current status",fullWidth:!0}),e.jsx(l,{label:"Category",options:t,placeholder:"Select category",clearable:!0,fullWidth:!0})]})},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(l,{label:"Default",options:t,placeholder:"Default state",fullWidth:!0}),e.jsx(l,{label:"With Value",options:t,defaultValue:"option1",fullWidth:!0}),e.jsx(l,{label:"Disabled",options:t,placeholder:"Disabled",disabled:!0,fullWidth:!0}),e.jsx(l,{label:"Error",options:t,placeholder:"Select option",error:"This field has an error",fullWidth:!0}),e.jsx(l,{label:"Clearable with Value",options:t,defaultValue:"option2",clearable:!0,fullWidth:!0})]})};var C,W,O;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    placeholder: 'Select an option'
  }
}`,...(O=(W=a.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var j,w,V;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category'
  }
}`,...(V=(w=o.parameters)==null?void 0:w.docs)==null?void 0:V.source}}};var D,N,T;r.parameters={...r.parameters,docs:{...(D=r.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select country',
    required: true
  }
}`,...(T=(N=r.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var E,k,q;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    options: statusOptions,
    placeholder: 'Select status',
    helperText: 'Choose the current status of the item'
  }
}`,...(q=(k=s.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var z,A,F;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category',
    error: 'Please select a category'
  }
}`,...(F=(A=n.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var L,M,P;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'kr'
  }
}`,...(P=(M=i.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};var R,U,H;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: function ControlledSelect() {
    const [value, setValue] = useState('option2');
    return <div className="flex flex-col gap-4">
        <Select label="Controlled Select" options={defaultOptions} value={value} onChange={setValue} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>;
  }
}`,...(H=(U=c.parameters)==null?void 0:U.docs)==null?void 0:H.source}}};var _,I,K;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    label: 'Clearable Select',
    options: defaultOptions,
    defaultValue: 'option1',
    clearable: true,
    clearLabel: 'Clear selection'
  }
}`,...(K=(I=p.parameters)==null?void 0:I.docs)==null?void 0:K.source}}};var X,B,G;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
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
      <Select width="sm" options={defaultOptions} placeholder="Small width (160px)" />
      <Select width="md" options={defaultOptions} placeholder="Medium width (240px)" />
      <Select width="lg" options={defaultOptions} placeholder="Large width (320px)" />
    </div>
}`,...(ee=($=m.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var te,le,ae;h.parameters={...h.parameters,docs:{...(te=h.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ae=(le=h.parameters)==null?void 0:le.docs)==null?void 0:ae.source}}};var oe,re,se;b.parameters={...b.parameters,docs:{...(oe=b.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Select',
    options: defaultOptions,
    placeholder: 'Cannot select',
    disabled: true
  }
}`,...(se=(re=b.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var ne,ie,ce;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Select label="Country" options={countryOptions} placeholder="Select country" required fullWidth />
      <Select label="Status" options={statusOptions} placeholder="Select status" helperText="Choose the current status" fullWidth />
      <Select label="Category" options={defaultOptions} placeholder="Select category" clearable fullWidth />
    </div>
}`,...(ce=(ie=f.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var pe,de,ue;S.parameters={...S.parameters,docs:{...(pe=S.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Select label="Default" options={defaultOptions} placeholder="Default state" fullWidth />
      <Select label="With Value" options={defaultOptions} defaultValue="option1" fullWidth />
      <Select label="Disabled" options={defaultOptions} placeholder="Disabled" disabled fullWidth />
      <Select label="Error" options={defaultOptions} placeholder="Select option" error="This field has an error" fullWidth />
      <Select label="Clearable with Value" options={defaultOptions} defaultValue="option2" clearable fullWidth />
    </div>
}`,...(ue=(de=S.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};const je=["Default","WithLabel","Required","WithHelperText","WithError","WithDefaultValue","Controlled","Clearable","WithDisabledOptions","Sizes","Widths","FullWidth","Disabled","FormExample","AllStates"];export{S as AllStates,p as Clearable,c as Controlled,a as Default,b as Disabled,f as FormExample,h as FullWidth,r as Required,u as Sizes,m as Widths,i as WithDefaultValue,d as WithDisabledOptions,n as WithError,s as WithHelperText,o as WithLabel,je as __namedExportsOrder,Oe as default};
