import{r as P,j as e}from"./iframe-DkQu90e3.js";import{S as a}from"./SearchInput-B4j5Fj6L.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./IconX-BaIg4cV2.js";import"./createReactComponent-Bn1mjhIb.js";import"./IconSearch-DLKM0IkM.js";const re={title:"Components/SearchInput",component:a,parameters:{layout:"centered",docs:{description:{component:"검색 전용 입력 컴포넌트입니다. 검색 아이콘과 클리어 버튼을 포함합니다."}}},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md"],description:"입력 필드 크기",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},label:{control:"text",description:"라벨 텍스트"},placeholder:{control:"text",description:"플레이스홀더 텍스트"},fullWidth:{control:"boolean",description:"부모 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"클리어 버튼 표시 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},disabled:{control:"boolean",description:"비활성화 상태"}},decorators:[l=>e.jsx("div",{style:{width:"320px"},children:e.jsx(l,{})})]},o={args:{placeholder:"Search..."}},c={name:"With Label",args:{label:"Search",placeholder:"Search resources..."}},i={name:"With Default Value",args:{placeholder:"Search...",defaultValue:"nginx-deployment"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Small"}),e.jsx(a,{size:"sm",placeholder:"Search..."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Medium (default)"}),e.jsx(a,{size:"md",placeholder:"Search..."})]})]})},d={args:{placeholder:"Search...",disabled:!0}},p={name:"Disabled with Value",args:{placeholder:"Search...",defaultValue:"read-only-query",disabled:!0}},u={name:"Not Clearable",args:{placeholder:"Search (no clear button)...",defaultValue:"some-value",clearable:!1}},m={render:function(){const[r,t]=P.useState("");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx(a,{value:r,onChange:x=>t(x.target.value),onClear:()=>t(""),placeholder:"Type to search..."}),r&&e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:['검색어: "',r,'"']})]})}},h={name:"Use Case — Resource Search",render:function(){const[r,t]=P.useState(""),g=["nginx-deployment-01","nginx-deployment-02","redis-master","redis-slave","postgres-primary"].filter(s=>s.toLowerCase().includes(r.toLowerCase()));return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx(a,{size:"sm",value:r,onChange:s=>t(s.target.value),onClear:()=>t(""),placeholder:"Search resources..."}),e.jsxs("ul",{className:"flex flex-col gap-[var(--primitive-spacing-1)]",children:[g.map(s=>e.jsx("li",{className:"text-body-md text-[var(--color-text-default)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:s},s)),g.length===0&&e.jsx("li",{className:"text-body-sm text-[var(--color-text-subtle)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)]",children:"No results found"})]})]})}},v={name:"Custom Width",decorators:[l=>e.jsx("div",{style:{width:"500px"},children:e.jsx(l,{})})],render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx(a,{placeholder:"w-[200px]",className:"w-[200px]"}),e.jsx(a,{placeholder:"fullWidth",fullWidth:!0})]})};var f,b,S;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...'
  }
}`,...(S=(b=o.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var y,N,C;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'With Label',
  args: {
    label: 'Search',
    placeholder: 'Search resources...'
  }
}`,...(C=(N=c.parameters)==null?void 0:N.docs)==null?void 0:C.source}}};var V,j,w;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'With Default Value',
  args: {
    placeholder: 'Search...',
    defaultValue: 'nginx-deployment'
  }
}`,...(w=(j=i.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var W,D,z;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Small
        </p>
        <SearchInput size="sm" placeholder="Search..." />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Medium (default)
        </p>
        <SearchInput size="md" placeholder="Search..." />
      </div>
    </div>
}`,...(z=(D=n.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var I,L,E;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...',
    disabled: true
  }
}`,...(E=(L=d.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var R,q,T;p.parameters={...p.parameters,docs:{...(R=p.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Disabled with Value',
  args: {
    placeholder: 'Search...',
    defaultValue: 'read-only-query',
    disabled: true
  }
}`,...(T=(q=p.parameters)==null?void 0:q.docs)==null?void 0:T.source}}};var M,U,_;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Not Clearable',
  args: {
    placeholder: 'Search (no clear button)...',
    defaultValue: 'some-value',
    clearable: false
  }
}`,...(_=(U=u.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var k,O,A;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: function ControlledExample() {
    const [value, setValue] = useState('');
    return <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <SearchInput value={value} onChange={e => setValue(e.target.value)} onClear={() => setValue('')} placeholder="Type to search..." />
        {value && <p className="text-body-sm text-[var(--color-text-subtle)]">
            검색어: &quot;{value}&quot;
          </p>}
      </div>;
  }
}`,...(A=(O=m.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var B,F,G;h.parameters={...h.parameters,docs:{...(B=h.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'Use Case — Resource Search',
  render: function ResourceSearchExample() {
    const [value, setValue] = useState('');
    const resources = ['nginx-deployment-01', 'nginx-deployment-02', 'redis-master', 'redis-slave', 'postgres-primary'];
    const filtered = resources.filter(r => r.toLowerCase().includes(value.toLowerCase()));
    return <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <SearchInput size="sm" value={value} onChange={e => setValue(e.target.value)} onClear={() => setValue('')} placeholder="Search resources..." />
        <ul className="flex flex-col gap-[var(--primitive-spacing-1)]">
          {filtered.map(r => <li key={r} className="text-body-md text-[var(--color-text-default)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
              {r}
            </li>)}
          {filtered.length === 0 && <li className="text-body-sm text-[var(--color-text-subtle)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)]">
              No results found
            </li>}
        </ul>
      </div>;
  }
}`,...(G=(F=h.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};var H,J,K;v.parameters={...v.parameters,docs:{...(H=v.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Custom Width',
  decorators: [Story => <div style={{
    width: '500px'
  }}>
        <Story />
      </div>],
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
      <SearchInput placeholder="w-[200px]" className="w-[200px]" />
      <SearchInput placeholder="fullWidth" fullWidth />
    </div>
}`,...(K=(J=v.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const se=["Default","WithLabel","WithDefaultValue","Sizes","Disabled","DisabledWithValue","NotClearable","Controlled","ResourceSearch","CustomWidth"];export{m as Controlled,v as CustomWidth,o as Default,d as Disabled,p as DisabledWithValue,u as NotClearable,h as ResourceSearch,n as Sizes,i as WithDefaultValue,c as WithLabel,se as __namedExportsOrder,re as default};
