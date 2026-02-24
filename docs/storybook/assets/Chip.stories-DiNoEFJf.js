import{j as e,r as o}from"./iframe-C-CGJmyb.js";import{C as a}from"./Chip-D_DqeVCv.js";import{I as y}from"./IconTag-BYUBCb0i.js";import{I as re}from"./IconUser-CiGwyNU7.js";import{I as oe}from"./IconCalendar-CIY04pUC.js";import{c as ce}from"./createReactComponent-BvK7gRRe.js";import"./preload-helper-C1FmrZbK.js";import"./cn-CshvV4Tc.js";import"./IconX---FUZfxB.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["path",{d:"M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",key:"svg-0"}],["path",{d:"M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0",key:"svg-1"}]],pe=ce("outline","map-pin","MapPin",de),ye={title:"Components/Chip",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
## Chip 컴포넌트

필터, 태그, 선택된 옵션 등을 표시하는 인터랙티브 컴포넌트입니다.

### Badge vs Chip
| | Badge | Chip |
|---|---|---|
| **상호작용** | 표시만 | 삭제/선택 가능 |
| **사용 시점** | 상태 표시 | 필터, 태그 입력 |
| **크기** | 작음 | 중간 |

### 사용 시기
- 필터 조건 표시 및 제거
- 태그 입력/관리
- 선택된 옵션 표시
- 키-값 쌍 표시

### 구조
- **label**: 카테고리/키 (선택)
- **value**: 실제 값 (필수)
- **icon**: 아이콘 (선택)
- **onRemove**: 삭제 버튼 (선택)

### 예시
\`\`\`tsx
import { Chip } from '@thaki/tds';

// 기본 사용
<Chip value="Tag" />

// 라벨 + 값
<Chip label="Status" value="Active" />

// 삭제 가능
<Chip 
  value="Filter" 
  onRemove={() => handleRemove()} 
/>

// 아이콘 포함
<Chip 
  label="User" 
  value="John" 
  icon={<IconUser />} 
  onRemove={() => {}}
/>
\`\`\`
        `}}},argTypes:{label:{control:"text",description:"카테고리/키 라벨 (선택)",table:{type:{summary:"string"}}},value:{control:"text",description:"표시할 값 (필수)",table:{type:{summary:"string"}}},variant:{control:"select",options:["default","selected"],description:"칩 스타일 변형",table:{type:{summary:'"default" | "selected"'},defaultValue:{summary:'"default"'}}},icon:{description:"값 앞에 표시할 아이콘",table:{type:{summary:"ReactNode"}}},onRemove:{description:"삭제 버튼 클릭 콜백 (제공 시 X 버튼 표시)",table:{type:{summary:"() => void"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},maxWidth:{control:"text",description:"최대 너비 (초과 시 말줄임)",table:{type:{summary:"string"}}}},args:{value:"Value"}},c={args:{value:"Chip"}},d={args:{label:"Status",value:"Active"}},p={args:{value:"Tag",icon:e.jsx(y,{size:12})}},m={args:{label:"Assignee",value:"John Doe",icon:e.jsx(re,{size:12})}},v={render:function(){const[t,l]=o.useState(!0);return t?e.jsx(a,{value:"Removable",onRemove:()=>l(!1)}):e.jsx("button",{className:"text-body-md text-[var(--color-action-primary)]",onClick:()=>l(!0),children:"Reset chip"})}},u={render:function(){const[t,l]=o.useState([{id:"1",label:"Status",value:"Active"},{id:"2",label:"Region",value:"US East"},{id:"3",label:"Type",value:"Production"}]),n=s=>{l(t.filter(i=>i.id!==s))};return e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[t.map(s=>e.jsx(a,{label:s.label,value:s.value,onRemove:()=>n(s.id)},s.id)),t.length===0&&e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"All chips removed"})]})}},x={args:{label:"Filter",value:"Selected",variant:"selected"}},b={args:{value:"Disabled",disabled:!0,onRemove:()=>{}}},g={args:{label:"Description",value:"This is a very long value that should be truncated",maxWidth:"200px",onRemove:()=>{}}},h={render:function(){const[t,l]=o.useState([{id:"1",label:"Status",value:"Running",icon:e.jsx(y,{size:12})},{id:"2",label:"User",value:"john@example.com",icon:e.jsx(re,{size:12})},{id:"3",label:"Date",value:"Jan 15, 2024",icon:e.jsx(oe,{size:12})},{id:"4",label:"Region",value:"US East",icon:e.jsx(pe,{size:12})}]),n=i=>{l(t.filter(j=>j.id!==i))},s=()=>{l([])};return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)] flex-wrap",children:[t.map(i=>e.jsx(a,{label:i.label,value:i.value,icon:i.icon,onRemove:()=>n(i.id)},i.id)),t.length>0&&e.jsx("button",{className:"text-body-sm text-[var(--color-action-primary)] hover:underline",onClick:s,children:"Clear all"})]}),t.length===0&&e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"No active filters"})]})}},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Default"}),e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"Basic"}),e.jsx(a,{label:"Status",value:"Active"}),e.jsx(a,{value:"With Icon",icon:e.jsx(y,{size:12})}),e.jsx(a,{label:"Label",value:"Removable",onRemove:()=>{}})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Selected"}),e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"Basic",variant:"selected"}),e.jsx(a,{label:"Status",value:"Active",variant:"selected"}),e.jsx(a,{value:"With Icon",icon:e.jsx(y,{size:12}),variant:"selected"}),e.jsx(a,{label:"Label",value:"Removable",variant:"selected",onRemove:()=>{}})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Disabled"}),e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"Disabled",disabled:!0}),e.jsx(a,{label:"Status",value:"Active",disabled:!0}),e.jsx(a,{value:"With Remove",disabled:!0,onRemove:()=>{}})]})]})]})},R={render:function(){const[t,l]=o.useState(["React","TypeScript","Tailwind"]),[n,s]=o.useState(""),i=r=>{r.key==="Enter"&&n.trim()&&(r.preventDefault(),t.includes(n.trim())||l([...t,n.trim()]),s(""))},j=r=>{l(t.filter(ne=>ne!==r))};return e.jsxs("div",{className:"w-[400px]",children:[e.jsx("label",{className:"block text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Tags"}),e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] min-h-[80px]",children:[t.map(r=>e.jsx(a,{value:r,onRemove:()=>j(r)},r)),e.jsx("input",{type:"text",value:n,onChange:r=>s(r.target.value),onKeyDown:i,placeholder:"Add tag...",className:"flex-1 min-w-[100px] outline-none bg-transparent text-body-md"})]}),e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mt-[var(--primitive-spacing-1)]",children:"Press Enter to add a tag"})]})}};var S,N,T;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    value: 'Chip'
  }
}`,...(T=(N=c.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var I,D,A;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    value: 'Active'
  }
}`,...(A=(D=d.parameters)==null?void 0:D.docs)==null?void 0:A.source}}};var w,W,E;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    value: 'Tag',
    icon: <IconTag size={12} />
  }
}`,...(E=(W=p.parameters)==null?void 0:W.docs)==null?void 0:E.source}}};var z,k,L;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: 'Assignee',
    value: 'John Doe',
    icon: <IconUser size={12} />
  }
}`,...(L=(k=m.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};var F,U,V;v.parameters={...v.parameters,docs:{...(F=v.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: function RemovableChip() {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return <button className="text-body-md text-[var(--color-action-primary)]" onClick={() => setVisible(true)}>
          Reset chip
        </button>;
    }
    return <Chip value="Removable" onRemove={() => setVisible(false)} />;
  }
}`,...(V=(U=v.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var P,B,K;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: function RemovableChipWithLabel() {
    const [chips, setChips] = useState([{
      id: '1',
      label: 'Status',
      value: 'Active'
    }, {
      id: '2',
      label: 'Region',
      value: 'US East'
    }, {
      id: '3',
      label: 'Type',
      value: 'Production'
    }]);
    const handleRemove = (id: string) => {
      setChips(chips.filter(chip => chip.id !== id));
    };
    return <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
        {chips.map(chip => <Chip key={chip.id} label={chip.label} value={chip.value} onRemove={() => handleRemove(chip.id)} />)}
        {chips.length === 0 && <span className="text-body-md text-[var(--color-text-muted)]">All chips removed</span>}
      </div>;
  }
}`,...(K=(B=u.parameters)==null?void 0:B.docs)==null?void 0:K.source}}};var M,J,_;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Filter',
    value: 'Selected',
    variant: 'selected'
  }
}`,...(_=(J=x.parameters)==null?void 0:J.docs)==null?void 0:_.source}}};var H,O,X;b.parameters={...b.parameters,docs:{...(H=b.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    value: 'Disabled',
    disabled: true,
    onRemove: () => {}
  }
}`,...(X=(O=b.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};var q,G,Q;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    label: 'Description',
    value: 'This is a very long value that should be truncated',
    maxWidth: '200px',
    onRemove: () => {}
  }
}`,...(Q=(G=g.parameters)==null?void 0:G.docs)==null?void 0:Q.source}}};var Y,Z,$;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function FilterTagsExample() {
    const [filters, setFilters] = useState([{
      id: '1',
      label: 'Status',
      value: 'Running',
      icon: <IconTag size={12} />
    }, {
      id: '2',
      label: 'User',
      value: 'john@example.com',
      icon: <IconUser size={12} />
    }, {
      id: '3',
      label: 'Date',
      value: 'Jan 15, 2024',
      icon: <IconCalendar size={12} />
    }, {
      id: '4',
      label: 'Region',
      value: 'US East',
      icon: <IconMapPin size={12} />
    }]);
    const handleRemove = (id: string) => {
      setFilters(filters.filter(f => f.id !== id));
    };
    const handleClearAll = () => {
      setFilters([]);
    };
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="flex items-center gap-[var(--primitive-spacing-2)] flex-wrap">
          {filters.map(filter => <Chip key={filter.id} label={filter.label} value={filter.value} icon={filter.icon} onRemove={() => handleRemove(filter.id)} />)}
          {filters.length > 0 && <button className="text-body-sm text-[var(--color-action-primary)] hover:underline" onClick={handleClearAll}>
              Clear all
            </button>}
        </div>
        {filters.length === 0 && <p className="text-body-md text-[var(--color-text-muted)]">No active filters</p>}
      </div>;
  }
}`,...($=(Z=h.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,te;f.parameters={...f.parameters,docs:{...(ee=f.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Default
        </p>
        <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
          <Chip value="Basic" />
          <Chip label="Status" value="Active" />
          <Chip value="With Icon" icon={<IconTag size={12} />} />
          <Chip label="Label" value="Removable" onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Selected
        </p>
        <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
          <Chip value="Basic" variant="selected" />
          <Chip label="Status" value="Active" variant="selected" />
          <Chip value="With Icon" icon={<IconTag size={12} />} variant="selected" />
          <Chip label="Label" value="Removable" variant="selected" onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Disabled
        </p>
        <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
          <Chip value="Disabled" disabled />
          <Chip label="Status" value="Active" disabled />
          <Chip value="With Remove" disabled onRemove={() => {}} />
        </div>
      </div>
    </div>
}`,...(te=(ae=f.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var se,ie,le;R.parameters={...R.parameters,docs:{...(se=R.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: function TagInputExample() {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);
    const [input, setInput] = useState('');
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        if (!tags.includes(input.trim())) {
          setTags([...tags, input.trim()]);
        }
        setInput('');
      }
    };
    const handleRemove = (tag: string) => {
      setTags(tags.filter(t => t !== tag));
    };
    return <div className="w-[400px]">
        <label className="block text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Tags
        </label>
        <div className="flex flex-wrap gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] min-h-[80px]">
          {tags.map(tag => <Chip key={tag} value={tag} onRemove={() => handleRemove(tag)} />)}
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add tag..." className="flex-1 min-w-[100px] outline-none bg-transparent text-body-md" />
        </div>
        <p className="text-body-sm text-[var(--color-text-muted)] mt-[var(--primitive-spacing-1)]">
          Press Enter to add a tag
        </p>
      </div>;
  }
}`,...(le=(ie=R.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};const Ce=["Default","WithLabel","WithIcon","WithLabelAndIcon","Removable","RemovableWithLabel","Selected","Disabled","Truncated","FilterTags","AllVariants","TagInput"];export{f as AllVariants,c as Default,b as Disabled,h as FilterTags,v as Removable,u as RemovableWithLabel,x as Selected,R as TagInput,g as Truncated,p as WithIcon,d as WithLabel,m as WithLabelAndIcon,Ce as __namedExportsOrder,ye as default};
