import{r,j as e}from"./iframe-DD6jyF7N.js";import{t as L}from"./cn-BMXv33oC.js";import{I as Ae}from"./IconSearch-ChtMy6qq.js";import{C as ke}from"./Chip-CtR3-5ck.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BZMrecJg.js";import"./IconX-t6wpnM2j.js";function Ie({filters:p,onFilterSelect:l,selectedFilter:a,onOptionSelect:i,onBack:c,isOpen:m,listboxId:I}){return m?a&&a.type==="select"&&a.options?e.jsxs("div",{className:"absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] overflow-hidden",children:[e.jsx("div",{className:"px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]",children:a.label}),e.jsx("div",{id:I,role:"listbox",children:a.options.map(n=>e.jsx("button",{type:"button",role:"option",onClick:()=>i(n),className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:n.label},n.value))}),e.jsx("div",{className:"border-t border-[var(--color-border-subtle)]",children:e.jsx("button",{type:"button",onClick:c,className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-muted)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:"← Back to filters"})})]}):e.jsxs("div",{className:"absolute left-0 top-full mt-1 min-w-[var(--context-menu-min-width)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] overflow-hidden",children:[e.jsx("div",{className:"px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]",children:"Filter by"}),e.jsx("div",{id:I,role:"listbox",children:p.map(n=>e.jsx("button",{type:"button",role:"option",onClick:()=>l(n),className:"w-full px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-left text-body-sm text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] transition-colors duration-[var(--duration-fast)]",children:n.label},n.id))})]}):null}const d=r.forwardRef(({size:p,filters:l=[],appliedFilters:a=[],onFiltersChange:i,onFilterRemove:c,onFiltersClear:m,searchValue:I="",onSearchChange:n,fullWidth:se=!1,clearFiltersLabel:ie="Clear Filters",hideAppliedFilters:ne=!1,className:V="",placeholder:oe,disabled:x,...de},g)=>{const z=r.useRef(null),E=r.useRef(null),T=r.useId(),[q,h]=r.useState(!1),[s,u]=r.useState(null),[b,v]=r.useState(""),[ce,C]=r.useState(!1);r.useEffect(()=>{const t=o=>{z.current&&!z.current.contains(o.target)&&(h(!1),u(null),v(""))};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const pe=r.useCallback(()=>{C(!0),l.length>0&&h(!0)},[l.length]),ue=r.useCallback(()=>{C(!1)},[]),me=r.useCallback(t=>{var o;u(t),t.type==="text"&&(v(""),(o=E.current)==null||o.focus())},[]),be=r.useCallback(t=>{if(!s)return;const o={id:`${s.id}-${Date.now()}`,fieldId:s.id,fieldLabel:s.label,value:t.value,valueLabel:t.label},y=[...a,o];i==null||i(y),u(null),v(""),h(!1)},[s,a,i]),ve=r.useCallback(t=>{if(t.key==="Enter"&&b.trim())if(s&&s.type==="text"){const o={id:`${s.id}-${Date.now()}`,fieldId:s.id,fieldLabel:s.label,value:b.trim()},y=[...a,o];i==null||i(y),u(null),v(""),h(!1)}else s||n==null||n(b.trim());else t.key==="Escape"?(h(!1),u(null),v("")):t.key==="Backspace"&&b===""&&s&&u(null)},[b,s,a,i,n]),fe=r.useCallback(t=>{v(t.target.value),!s&&l.length===0&&(n==null||n(t.target.value))},[s,l.length,n]),xe=r.useCallback(()=>{u(null)},[]),he=r.useCallback(t=>{c==null||c(t);const o=a.filter(y=>y.id!==t);i==null||i(o)},[a,c,i]),ye=r.useCallback(()=>{m==null||m(),i==null||i([])},[m,i]),ge=()=>s?s.placeholder||`Enter ${s.label.toLowerCase()}...`:oe||(l.length>0?"Search by attributes":"Search..."),Fe=()=>s?e.jsxs("span",{className:"flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm mr-1",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-default)]",children:s.label}),e.jsx("span",{className:"text-[var(--color-border-strong)]",children:"|"})]}):null,D=/\bw-\[?[^\s]+\]?/g,W=V.match(D)||[],Se=W.length>0,we=V.replace(D,"").trim(),Ne=L("flex flex-col gap-2",se||!Se?"w-full":W.join(" ")),je=L("flex items-center gap-1","w-full","px-[var(--input-padding-x)]","bg-[var(--input-bg)]","border-[length:var(--input-border-width)]","border-solid","border-[var(--input-border)]","rounded-[var(--input-radius)]","transition-all duration-[var(--duration-fast)]",ce&&"border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]",x&&"bg-[var(--input-bg-disabled)] cursor-not-allowed","h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]",we);return e.jsxs("div",{className:Ne,ref:z,"data-figma-name":"[TDS] FilterSearchInput",children:[e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:je,children:[Fe(),e.jsx("input",{ref:t=>{typeof g=="function"?g(t):g&&(g.current=t),E.current=t},type:"text",className:L("flex-1 bg-transparent outline-none","text-[var(--color-text-default)]","placeholder:text-[var(--color-text-subtle)]",x&&"cursor-not-allowed"),value:b,onChange:fe,onFocus:pe,onBlur:ue,onKeyDown:ve,placeholder:ge(),disabled:x,...de,...l.length>0?{role:"combobox","aria-expanded":q&&!x,"aria-haspopup":"listbox","aria-autocomplete":"list","aria-controls":T}:{}}),e.jsx("div",{className:"text-[var(--color-text-subtle)] pointer-events-none",children:e.jsx(Ae,{size:12,strokeWidth:2})})]}),l.length>0&&e.jsx(Ie,{filters:l,onFilterSelect:me,selectedFilter:s,onOptionSelect:be,onBack:xe,isOpen:q&&!x,listboxId:T})]}),!ne&&a.length>0&&e.jsxs("div",{className:"flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]",children:[e.jsx("div",{className:"flex items-center gap-1 flex-wrap",children:a.map(t=>e.jsx(ke,{label:t.fieldLabel,value:t.valueLabel||t.value,onRemove:()=>he(t.id)},t.id))}),e.jsx("button",{type:"button",onClick:ye,className:"text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors whitespace-nowrap",children:ie})]})]})});d.displayName="FilterSearchInput";d.__docgenInfo={description:"",methods:[],displayName:"FilterSearchInput",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"@deprecated Single size only (28px). Prop kept for backward compatibility."},filters:{required:!1,tsType:{name:"Array",elements:[{name:"FilterField"}],raw:"FilterField[]"},description:"Available filter fields",defaultValue:{value:"[]",computed:!1}},appliedFilters:{required:!1,tsType:{name:"Array",elements:[{name:"AppliedFilter"}],raw:"AppliedFilter[]"},description:"Currently applied filters",defaultValue:{value:"[]",computed:!1}},onFiltersChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(filters: AppliedFilter[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"AppliedFilter"}],raw:"AppliedFilter[]"},name:"filters"}],return:{name:"void"}}},description:"Callback when filters change"},onFilterRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(filterId: string) => void",signature:{arguments:[{type:{name:"string"},name:"filterId"}],return:{name:"void"}}},description:"Callback when a single filter is removed"},onFiltersClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when all filters are cleared"},searchValue:{required:!1,tsType:{name:"string"},description:"Search value (for freeform search without filter)",defaultValue:{value:"''",computed:!1}},onSearchChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback when search value changes"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},clearFiltersLabel:{required:!1,tsType:{name:"string"},description:"Clear filters button label",defaultValue:{value:"'Clear Filters'",computed:!1}},hideAppliedFilters:{required:!1,tsType:{name:"boolean"},description:"Hide applied filters display (useful when rendering filters externally)",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const f=[{id:"status",label:"Status",type:"select",options:[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"error",label:"Error"},{value:"building",label:"Building"}]},{id:"name",label:"Name",type:"text",placeholder:"Enter instance name..."},{id:"namespace",label:"Namespace",type:"select",options:[{value:"default",label:"default"},{value:"kube-system",label:"kube-system"},{value:"production",label:"production"},{value:"staging",label:"staging"}]},{id:"label",label:"Label",type:"text",placeholder:"e.g. app=nginx"}],De={title:"Components/FilterSearchInput",component:d,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"입력 필드 크기",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},hideAppliedFilters:{control:"boolean",description:"적용된 필터 표시 숨김 (외부에서 별도 렌더링 시)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},F={args:{placeholder:"Search..."}},S={render:function(){const[l,a]=r.useState([]);return e.jsx("div",{className:"w-[400px]",children:e.jsx(d,{filters:f,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})})}},w={render:function(){const[l,a]=r.useState([{id:"status-1",fieldId:"status",fieldLabel:"Status",value:"active",valueLabel:"Active"},{id:"namespace-1",fieldId:"namespace",fieldLabel:"Namespace",value:"production",valueLabel:"production"}]);return e.jsx("div",{className:"w-[500px]",children:e.jsx(d,{filters:f,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})})}},N={render:function(){const[l,a]=r.useState([]),[i,c]=r.useState([]);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[400px]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Small"}),e.jsx(d,{filters:f,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Medium"}),e.jsx(d,{filters:f,appliedFilters:i,onFiltersChange:c,placeholder:"Search by attributes",size:"md"})]})]})}},j={render:function(){const[l,a]=r.useState([{id:"status-1",fieldId:"status",fieldLabel:"Status",value:"active",valueLabel:"Active"}]);return e.jsxs("div",{className:"w-[400px]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"hideAppliedFilters=true — 필터 칩이 입력 아래에 표시되지 않음 (ListToolbar에서 별도 렌더링)"}),e.jsx(d,{filters:f,appliedFilters:l,onFiltersChange:a,placeholder:"Search by attributes",size:"sm",hideAppliedFilters:!0})]})}},A={args:{filters:f,placeholder:"Search by attributes",disabled:!0}},k={render:function(){const[l,a]=r.useState("");return e.jsxs("div",{className:"w-[320px]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"필터 없이 단순 검색만 사용하는 경우"}),e.jsx(d,{searchValue:l,onSearchChange:a,placeholder:"Search...",size:"sm"}),l&&e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-2)]",children:['검색어: "',l,'"']})]})}};var _,O,B;F.parameters={...F.parameters,docs:{...(_=F.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...'
  }
}`,...(B=(O=F.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var H,R,$;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: function WithFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
    return <div className="w-[400px]">
        <FilterSearchInput filters={sampleFilters} appliedFilters={appliedFilters} onFiltersChange={setAppliedFilters} placeholder="Search by attributes" size="sm" />
      </div>;
  }
}`,...($=(R=S.parameters)==null?void 0:R.docs)==null?void 0:$.source}}};var M,P,K;w.parameters={...w.parameters,docs:{...(M=w.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(K=(P=w.parameters)==null?void 0:P.docs)==null?void 0:K.source}}};var G,J,Q;N.parameters={...N.parameters,docs:{...(G=N.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(Q=(J=N.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var U,X,Y;j.parameters={...j.parameters,docs:{...(U=j.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(Y=(X=j.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,te;A.parameters={...A.parameters,docs:{...(Z=A.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    filters: sampleFilters,
    placeholder: 'Search by attributes',
    disabled: true
  }
}`,...(te=(ee=A.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,re,le;k.parameters={...k.parameters,docs:{...(ae=k.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
}`,...(le=(re=k.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};const We=["Default","WithFilters","WithAppliedFilters","Sizes","HiddenAppliedFilters","Disabled","SimpleSearch"];export{F as Default,A as Disabled,j as HiddenAppliedFilters,k as SimpleSearch,N as Sizes,w as WithAppliedFilters,S as WithFilters,We as __namedExportsOrder,De as default};
