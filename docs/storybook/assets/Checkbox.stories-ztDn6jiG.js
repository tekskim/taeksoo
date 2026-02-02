import{j as e,r as f}from"./iframe-Dtaoqwlr.js";import{C as t}from"./Checkbox-tY4QOu71.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./IconMinus-BygYRnoR.js";import"./createReactComponent-oNNwel7Z.js";import"./IconCheck-Yo-Txvb4.js";const se={title:"Components/Checkbox",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## Checkbox 컴포넌트

여러 옵션 중 하나 이상을 선택할 수 있는 체크박스입니다.

### 사용 시기
- 여러 항목 중 다중 선택
- 약관 동의, 옵션 선택
- "모두 선택" 패턴 구현

### 상태
- **unchecked**: 선택되지 않음
- **checked**: 선택됨
- **indeterminate**: 부분 선택 (모두 선택 패턴에서 일부만 선택된 경우)

### 접근성
- 네이티브 \`<input type="checkbox">\` 사용
- 라벨 클릭으로 토글 가능
- 키보드(Space)로 토글 가능
- 스크린리더 상태 전달

### 예시
\`\`\`tsx
import { Checkbox } from '@thaki/tds';

// 기본 사용
<Checkbox label="동의합니다" />

// Controlled
<Checkbox 
  checked={agreed} 
  onChange={(e) => setAgreed(e.target.checked)} 
  label="약관에 동의합니다"
/>

// 부분 선택 (Select All)
<Checkbox 
  indeterminate={someSelected} 
  checked={allSelected}
  label="모두 선택"
/>
\`\`\`
        `}}},argTypes:{label:{control:"text",description:"체크박스 라벨",table:{type:{summary:"ReactNode"}}},description:{control:"text",description:"라벨 아래 설명 텍스트",table:{type:{summary:"ReactNode"}}},checked:{control:"boolean",description:"체크 상태 (controlled)",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"초기 체크 상태 (uncontrolled)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},indeterminate:{control:"boolean",description:"부분 선택 상태 (일부만 선택됨)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"에러 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}}}},n={args:{label:"Checkbox label"}},i={args:{label:"Checked checkbox",defaultChecked:!0}},m={args:{label:"Subscribe to newsletter",description:"Receive weekly updates about new features and promotions."}},u={args:{label:"Select all",indeterminate:!0}},h={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{label:"Disabled unchecked",disabled:!0}),e.jsx(t,{label:"Disabled checked",disabled:!0,defaultChecked:!0})]})},p={args:{label:"I agree to the terms and conditions",error:!0,errorMessage:"You must agree to continue"}},b={render:function(){const[l,c]=f.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{label:"Controlled checkbox",checked:l,onChange:s=>c(s.target.checked)}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Checked: ",e.jsx("strong",{children:l?"Yes":"No"})]})]})}},x={render:function(){const[l,c]=f.useState([{id:"1",label:"Item 1",checked:!0},{id:"2",label:"Item 2",checked:!1},{id:"3",label:"Item 3",checked:!0}]),s=l.every(a=>a.checked),C=l.some(a=>a.checked)&&!s,r=()=>{c(l.map(a=>({...a,checked:!s})))},o=a=>{c(l.map(d=>d.id===a?{...d,checked:!d.checked}:d))};return e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(t,{label:"Select all",checked:s,indeterminate:C,onChange:r}),e.jsx("div",{className:"ml-6 flex flex-col gap-2",children:l.map(a=>e.jsx(t,{label:a.label,checked:a.checked,onChange:()=>o(a.id)},a.id))})]})}},k={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{label:"Default"}),e.jsx(t,{label:"Checked",defaultChecked:!0}),e.jsx(t,{label:"Indeterminate",indeterminate:!0}),e.jsx(t,{label:"Disabled",disabled:!0}),e.jsx(t,{label:"Disabled checked",disabled:!0,defaultChecked:!0}),e.jsx(t,{label:"Error",error:!0,errorMessage:"This field is required"}),e.jsx(t,{label:"With description",description:"This is a helpful description text."})]})},g={render:function(){const[l,c]=f.useState(["react"]),s=[{value:"react",label:"React"},{value:"vue",label:"Vue"},{value:"angular",label:"Angular"},{value:"svelte",label:"Svelte"}],C=r=>{c(o=>o.includes(r)?o.filter(a=>a!==r):[...o,r])};return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm font-medium",children:"Select frameworks:"}),e.jsx("div",{className:"flex flex-col gap-2",children:s.map(r=>e.jsx(t,{label:r.label,checked:l.includes(r.value),onChange:()=>C(r.value)},r.value))}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("strong",{children:l.join(", ")||"None"})]})]})}};var S,j,y;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: 'Checkbox label'
  }
}`,...(y=(j=n.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};var N,I,D;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: 'Checked checkbox',
    defaultChecked: true
  }
}`,...(D=(I=i.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var A,E,w;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive weekly updates about new features and promotions.'
  }
}`,...(w=(E=m.parameters)==null?void 0:E.docs)==null?void 0:w.source}}};var R,V,W;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: 'Select all',
    indeterminate: true
  }
}`,...(W=(V=u.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};var M,T,G;h.parameters={...h.parameters,docs:{...(M=h.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
}`,...(G=(T=h.parameters)==null?void 0:T.docs)==null?void 0:G.source}}};var Y,q,P;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    error: true,
    errorMessage: 'You must agree to continue'
  }
}`,...(P=(q=p.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var _,O,z;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return <div className="flex flex-col gap-4">
        <Checkbox label="Controlled checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Checked: <strong>{checked ? 'Yes' : 'No'}</strong>
        </p>
      </div>;
  }
}`,...(z=(O=b.parameters)==null?void 0:O.docs)==null?void 0:z.source}}};var B,F,H;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: function SelectAllExample() {
    const [items, setItems] = useState([{
      id: '1',
      label: 'Item 1',
      checked: true
    }, {
      id: '2',
      label: 'Item 2',
      checked: false
    }, {
      id: '3',
      label: 'Item 3',
      checked: true
    }]);
    const allChecked = items.every(item => item.checked);
    const someChecked = items.some(item => item.checked) && !allChecked;
    const handleSelectAll = () => {
      setItems(items.map(item => ({
        ...item,
        checked: !allChecked
      })));
    };
    const handleItemChange = (id: string) => {
      setItems(items.map(item => item.id === id ? {
        ...item,
        checked: !item.checked
      } : item));
    };
    return <div className="flex flex-col gap-2">
        <Checkbox label="Select all" checked={allChecked} indeterminate={someChecked} onChange={handleSelectAll} />
        <div className="ml-6 flex flex-col gap-2">
          {items.map(item => <Checkbox key={item.id} label={item.label} checked={item.checked} onChange={() => handleItemChange(item.id)} />)}
        </div>
      </div>;
  }
}`,...(H=(F=x.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var J,K,L;k.parameters={...k.parameters,docs:{...(J=k.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Error" error errorMessage="This field is required" />
      <Checkbox label="With description" description="This is a helpful description text." />
    </div>
}`,...(L=(K=k.parameters)==null?void 0:K.docs)==null?void 0:L.source}}};var Q,U,X;g.parameters={...g.parameters,docs:{...(Q=g.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: function CheckboxGroupExample() {
    const [selected, setSelected] = useState<string[]>(['react']);
    const options = [{
      value: 'react',
      label: 'React'
    }, {
      value: 'vue',
      label: 'Vue'
    }, {
      value: 'angular',
      label: 'Angular'
    }, {
      value: 'svelte',
      label: 'Svelte'
    }];
    const handleChange = (value: string) => {
      setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };
    return <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Select frameworks:</p>
        <div className="flex flex-col gap-2">
          {options.map(option => <Checkbox key={option.value} label={option.label} checked={selected.includes(option.value)} onChange={() => handleChange(option.value)} />)}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: <strong>{selected.join(', ') || 'None'}</strong>
        </p>
      </div>;
  }
}`,...(X=(U=g.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};const ce=["Default","Checked","WithDescription","Indeterminate","Disabled","WithError","Controlled","SelectAllPattern","AllStates","GroupExample"];export{k as AllStates,i as Checked,b as Controlled,n as Default,h as Disabled,g as GroupExample,u as Indeterminate,x as SelectAllPattern,m as WithDescription,p as WithError,ce as __namedExportsOrder,se as default};
