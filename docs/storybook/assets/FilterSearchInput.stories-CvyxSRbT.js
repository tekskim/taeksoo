import{r,j as e}from"./iframe-C-CGJmyb.js";import{t as L}from"./cn-CshvV4Tc.js";import{I as je}from"./IconSearch-DUVym5g7.js";import{C as Ae}from"./Chip-D_DqeVCv.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BvK7gRRe.js";import"./IconX---FUZfxB.js";const ke={sm:"h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]",md:"h-[var(--search-input-height-md)] text-[length:var(--input-font-size-sm)]"};function Ie({filters:d,onFilterSelect:l,selectedFilter:a,onOptionSelect:i,onBack:c,isOpen:v}){return v?a&&a.type==="select"&&a.options?e.jsxs("div",{className:"absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-50 overflow-hidden",children:[e.jsx("div",{className:"px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]",children:a.label}),e.jsx("div",{children:a.options.map(u=>e.jsx("button",{type:"button",onClick:()=>i(u),className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:u.label},u.value))}),e.jsx("div",{className:"border-t border-[var(--color-border-subtle)]",children:e.jsx("button",{type:"button",onClick:c,className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-muted)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:"← Back to filters"})})]}):e.jsxs("div",{className:"absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-50 overflow-hidden",children:[e.jsx("div",{className:"px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]",children:"Filter by"}),e.jsx("div",{children:d.map(u=>e.jsx("button",{type:"button",onClick:()=>l(u),className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:u.label},u.id))})]}):null}const o=r.forwardRef(({size:d="md",filters:l=[],appliedFilters:a=[],onFiltersChange:i,onFilterRemove:c,onFiltersClear:v,searchValue:u="",onSearchChange:p,fullWidth:re=!1,clearFiltersLabel:le="Clear Filters",hideAppliedFilters:se=!1,className:V="",placeholder:ie,disabled:g,...ne},F)=>{const z=r.useRef(null),E=r.useRef(null),[oe,h]=r.useState(!1),[s,m]=r.useState(null),[b,f]=r.useState(""),[de,T]=r.useState(!1);r.useEffect(()=>{const t=n=>{z.current&&!z.current.contains(n.target)&&(h(!1),m(null),f(""))};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const ce=r.useCallback(()=>{T(!0),l.length>0&&h(!0)},[l.length]),ue=r.useCallback(()=>{T(!1)},[]),pe=r.useCallback(t=>{var n;m(t),t.type==="text"&&(f(""),(n=E.current)==null||n.focus())},[]),me=r.useCallback(t=>{if(!s)return;const n={id:`${s.id}-${Date.now()}`,fieldId:s.id,fieldLabel:s.label,value:t.value,valueLabel:t.label},y=[...a,n];i==null||i(y),m(null),f(""),h(!1)},[s,a,i]),ve=r.useCallback(t=>{if(t.key==="Enter"&&b.trim())if(s&&s.type==="text"){const n={id:`${s.id}-${Date.now()}`,fieldId:s.id,fieldLabel:s.label,value:b.trim()},y=[...a,n];i==null||i(y),m(null),f(""),h(!1)}else s||p==null||p(b.trim());else t.key==="Escape"?(h(!1),m(null),f("")):t.key==="Backspace"&&b===""&&s&&m(null)},[b,s,a,i,p]),be=r.useCallback(t=>{f(t.target.value),!s&&l.length===0&&(p==null||p(t.target.value))},[s,l.length,p]),fe=r.useCallback(()=>{m(null)},[]),xe=r.useCallback(t=>{c==null||c(t);const n=a.filter(y=>y.id!==t);i==null||i(n)},[a,c,i]),he=r.useCallback(()=>{v==null||v(),i==null||i([])},[v,i]),ye=()=>s?s.placeholder||`Enter ${s.label.toLowerCase()}...`:ie||(l.length>0?"Search by attributes":"Search..."),ge=()=>s?e.jsxs("span",{className:"flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm mr-1",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-default)]",children:s.label}),e.jsx("span",{className:"text-[var(--color-border-strong)]",children:"|"})]}):null,q=/\bw-\[?[^\s]+\]?/g,C=V.match(q)||[],Fe=C.length>0,Se=V.replace(q,"").trim(),we=L("flex flex-col gap-2",re||!Fe?"w-full":C.join(" ")),Ne=L("flex items-center gap-1","w-full","px-[var(--input-padding-x)]","bg-[var(--input-bg)]","border-[length:var(--input-border-width)]","border-solid","border-[var(--input-border)]","rounded-[var(--input-radius)]","transition-all duration-[var(--duration-fast)]",de&&"border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]",g&&"bg-[var(--input-bg-disabled)] cursor-not-allowed",ke[d],Se);return e.jsxs("div",{className:we,ref:z,children:[e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:Ne,children:[ge(),e.jsx("input",{ref:t=>{typeof F=="function"?F(t):F&&(F.current=t),E.current=t},type:"text",className:L("flex-1 bg-transparent outline-none","text-[var(--color-text-default)]","placeholder:text-[var(--color-text-subtle)]",g&&"cursor-not-allowed"),value:b,onChange:be,onFocus:ce,onBlur:ue,onKeyDown:ve,placeholder:ye(),disabled:g,...ne}),e.jsx("div",{className:"text-[var(--color-text-subtle)] pointer-events-none",children:e.jsx(je,{size:12,strokeWidth:2})})]}),l.length>0&&e.jsx(Ie,{filters:l,onFilterSelect:pe,selectedFilter:s,onOptionSelect:me,onBack:fe,isOpen:oe&&!g})]}),!se&&a.length>0&&e.jsxs("div",{className:"flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]",children:[e.jsx("div",{className:"flex items-center gap-1 flex-wrap",children:a.map(t=>e.jsx(Ae,{label:t.fieldLabel,value:t.valueLabel||t.value,onRemove:()=>xe(t.id)},t.id))}),e.jsx("button",{type:"button",onClick:he,className:"text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors whitespace-nowrap",children:le})]})]})});o.displayName="FilterSearchInput";o.__docgenInfo={description:"",methods:[],displayName:"FilterSearchInput",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Input size",defaultValue:{value:"'md'",computed:!1}},filters:{required:!1,tsType:{name:"Array",elements:[{name:"FilterField"}],raw:"FilterField[]"},description:"Available filter fields",defaultValue:{value:"[]",computed:!1}},appliedFilters:{required:!1,tsType:{name:"Array",elements:[{name:"AppliedFilter"}],raw:"AppliedFilter[]"},description:"Currently applied filters",defaultValue:{value:"[]",computed:!1}},onFiltersChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(filters: AppliedFilter[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"AppliedFilter"}],raw:"AppliedFilter[]"},name:"filters"}],return:{name:"void"}}},description:"Callback when filters change"},onFilterRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(filterId: string) => void",signature:{arguments:[{type:{name:"string"},name:"filterId"}],return:{name:"void"}}},description:"Callback when a single filter is removed"},onFiltersClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when all filters are cleared"},searchValue:{required:!1,tsType:{name:"string"},description:"Search value (for freeform search without filter)",defaultValue:{value:"''",computed:!1}},onSearchChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback when search value changes"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},clearFiltersLabel:{required:!1,tsType:{name:"string"},description:"Clear filters button label",defaultValue:{value:"'Clear Filters'",computed:!1}},hideAppliedFilters:{required:!1,tsType:{name:"boolean"},description:"Hide applied filters display (useful when rendering filters externally)",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const x=[{id:"status",label:"Status",type:"select",options:[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"error",label:"Error"},{value:"building",label:"Building"}]},{id:"name",label:"Name",type:"text",placeholder:"Enter instance name..."},{id:"namespace",label:"Namespace",type:"select",options:[{value:"default",label:"default"},{value:"kube-system",label:"kube-system"},{value:"production",label:"production"},{value:"staging",label:"staging"}]},{id:"label",label:"Label",type:"text",placeholder:"e.g. app=nginx"}],We={title:"Components/FilterSearchInput",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
## FilterSearchInput 컴포넌트

필터 기반 검색을 위한 입력 컴포넌트입니다. 리스트 페이지의 ListToolbar에서 주로 사용됩니다.

### 사용 시기
- 리스트 페이지에서 다중 속성으로 필터링할 때
- 검색 + 필터를 하나의 입력 필드로 통합할 때

### 주요 기능
- **필터 드롭다운**: 클릭 시 사용 가능한 필터 목록 표시
- **텍스트 필터**: 자유 텍스트 입력
- **셀렉트 필터**: 미리 정의된 옵션에서 선택
- **적용된 필터 표시**: Chip 형태로 표시, 개별/전체 삭제 가능

### 예시
\`\`\`tsx
import { FilterSearchInput } from '@thaki/tds';
import type { FilterField, AppliedFilter } from '@thaki/tds';

const filters: FilterField[] = [
  { id: 'status', label: 'Status', type: 'select', options: [...] },
  { id: 'name', label: 'Name', type: 'text' },
];

<FilterSearchInput
  filters={filters}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search by attributes"
  size="sm"
/>
\`\`\`
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"입력 필드 크기",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},hideAppliedFilters:{control:"boolean",description:"적용된 필터 표시 숨김 (외부에서 별도 렌더링 시)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},S={args:{placeholder:"Search..."}},w={render:function(){const[l,a]=r.useState([]);return e.jsx("div",{className:"w-[400px]",children:e.jsx(o,{filters:x,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})})}},N={render:function(){const[l,a]=r.useState([{id:"status-1",fieldId:"status",fieldLabel:"Status",value:"active",valueLabel:"Active"},{id:"namespace-1",fieldId:"namespace",fieldLabel:"Namespace",value:"production",valueLabel:"production"}]);return e.jsx("div",{className:"w-[500px]",children:e.jsx(o,{filters:x,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})})}},j={render:function(){const[l,a]=r.useState([]),[i,c]=r.useState([]);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[400px]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Small"}),e.jsx(o,{filters:x,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Medium"}),e.jsx(o,{filters:x,appliedFilters:i,onFiltersChange:c,placeholder:"Search by attributes",size:"md"})]})]})}},A={render:function(){const[l,a]=r.useState([{id:"status-1",fieldId:"status",fieldLabel:"Status",value:"active",valueLabel:"Active"}]);return e.jsxs("div",{className:"w-[400px]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"hideAppliedFilters=true — 필터 칩이 입력 아래에 표시되지 않음 (ListToolbar에서 별도 렌더링)"}),e.jsx(o,{filters:x,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm",hideAppliedFilters:!0})]})}},k={args:{filters:x,placeholder:"Search by attributes",disabled:!0}},I={render:function(){const[l,a]=r.useState("");return e.jsxs("div",{className:"w-[320px]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"필터 없이 단순 검색만 사용하는 경우"}),e.jsx(o,{searchValue:l,onSearchChange:a,placeholder:"Search...",size:"sm"}),l&&e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-2)]",children:['검색어: "',l,'"']})]})}};var W,D,O;S.parameters={...S.parameters,docs:{...(W=S.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...'
  }
}`,...(O=(D=S.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var _,B,H;w.parameters={...w.parameters,docs:{...(_=w.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function WithFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
    return <div className="w-[400px]">
        <FilterSearchInput filters={sampleFilters} appliedFilters={appliedFilters} onFiltersChange={setAppliedFilters} placeholder="Search by attributes" size="sm" />
      </div>;
  }
}`,...(H=(B=w.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};var R,$,M;N.parameters={...N.parameters,docs:{...(R=N.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: function WithAppliedFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([{
      id: 'status-1',
      fieldId: 'status',
      fieldLabel: 'Status',
      value: 'active',
      valueLabel: 'Active'
    }, {
      id: 'namespace-1',
      fieldId: 'namespace',
      fieldLabel: 'Namespace',
      value: 'production',
      valueLabel: 'production'
    }]);
    return <div className="w-[500px]">
        <FilterSearchInput filters={sampleFilters} appliedFilters={appliedFilters} onFiltersChange={setAppliedFilters} placeholder="Search by attributes" size="sm" />
      </div>;
  }
}`,...(M=($=N.parameters)==null?void 0:$.docs)==null?void 0:M.source}}};var K,P,G;j.parameters={...j.parameters,docs:{...(K=j.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: function SizesExample() {
    const [filters1, setFilters1] = useState<AppliedFilter[]>([]);
    const [filters2, setFilters2] = useState<AppliedFilter[]>([]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[400px]">
        <div>
          <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
            Small
          </p>
          <FilterSearchInput filters={sampleFilters} appliedFilters={filters1} onFiltersChange={setFilters1} placeholder="Search by attributes" size="sm" />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
            Medium
          </p>
          <FilterSearchInput filters={sampleFilters} appliedFilters={filters2} onFiltersChange={setFilters2} placeholder="Search by attributes" size="md" />
        </div>
      </div>;
  }
}`,...(G=(P=j.parameters)==null?void 0:P.docs)==null?void 0:G.source}}};var J,Q,U;A.parameters={...A.parameters,docs:{...(J=A.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: function HiddenFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([{
      id: 'status-1',
      fieldId: 'status',
      fieldLabel: 'Status',
      value: 'active',
      valueLabel: 'Active'
    }]);
    return <div className="w-[400px]">
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          hideAppliedFilters=true — 필터 칩이 입력 아래에 표시되지 않음 (ListToolbar에서 별도
          렌더링)
        </p>
        <FilterSearchInput filters={sampleFilters} appliedFilters={appliedFilters} onFiltersChange={setAppliedFilters} placeholder="Search by attributes" size="sm" hideAppliedFilters />
      </div>;
  }
}`,...(U=(Q=A.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;k.parameters={...k.parameters,docs:{...(X=k.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    filters: sampleFilters,
    placeholder: 'Search by attributes',
    disabled: true
  }
}`,...(Z=(Y=k.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ae;I.parameters={...I.parameters,docs:{...(ee=I.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: function SimpleSearchExample() {
    const [searchValue, setSearchValue] = useState('');
    return <div className="w-[320px]">
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          필터 없이 단순 검색만 사용하는 경우
        </p>
        <FilterSearchInput searchValue={searchValue} onSearchChange={setSearchValue} placeholder="Search..." size="sm" />
        {searchValue && <p className="text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-2)]">
            검색어: &quot;{searchValue}&quot;
          </p>}
      </div>;
  }
}`,...(ae=(te=I.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};const De=["Default","WithFilters","WithAppliedFilters","Sizes","HiddenAppliedFilters","Disabled","SimpleSearch"];export{S as Default,k as Disabled,A as HiddenAppliedFilters,I as SimpleSearch,j as Sizes,N as WithAppliedFilters,w as WithFilters,De as __namedExportsOrder,We as default};
