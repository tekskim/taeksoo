import{r as f,j as e}from"./iframe-cCzR4jo2.js";import{t as p}from"./bundle-mjs-BZSatpsL.js";import{C as fe}from"./Chip-D2HKwkia.js";import{H as he}from"./Stack-BoehbdEb.js";import{I as ve}from"./IconX-KvYFK2XI.js";import{I as be}from"./IconSearch-BsrOCPHk.js";import{B as n}from"./Button-C2RGuKHm.js";import{I as re}from"./IconDownload-CVUXe2wi.js";import{I as se}from"./IconTrash-C1WPfwg4.js";import{I as xe}from"./IconPlus-Cza8AnSM.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CYYKpV4_.js";const ge={sm:"h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]",md:"h-[var(--search-input-height-md)] text-[length:var(--input-font-size-sm)]"},l=f.forwardRef(({size:r="md",label:t,fullWidth:d=!1,clearable:c=!0,onClear:o,className:a="",id:j,disabled:u,value:i,defaultValue:A,onChange:m,...ae},ie)=>{const F=j||`search-input-${Math.random().toString(36).substr(2,9)}`,[oe,I]=f.useState(A??""),S=i!==void 0?i:oe,z=String(S).length>0,ne=f.useCallback(D=>{i===void 0&&I(D.target.value),m==null||m(D)},[i,m]),le=f.useCallback(()=>{i===void 0&&I(""),o==null||o()},[i,o]),R=/\bw-\[?[^\s]+\]?/g,C=/\b(m[tblrxy]?-\[?[^\s]+\]?)/g,N=a.match(R)||[],ce=a.match(C)||[],de=N.length>0,ue=a.replace(R,"").replace(C,"").trim(),me=p("w-full","pl-[var(--input-padding-x)]",c&&z&&!u?"pr-14":"pr-8","py-[var(--input-padding-y)]","leading-[var(--input-line-height)]","bg-[var(--input-bg)]","text-[var(--color-text-default)]","border-[length:var(--input-border-width)]","border-solid","border-[var(--input-border)]","rounded-[var(--input-radius)]","transition-all duration-[var(--duration-fast)]","placeholder:text-[var(--color-text-subtle)]","focus:outline-none","focus:border-[var(--input-border-focus)]","focus:shadow-[0_0_0_1px_var(--input-border-focus)]",u?"bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed":"",ge[r],ue),pe=p("flex flex-col gap-[var(--input-label-gap)]",d||!de?"w-full":N.join(" "),ce.join(" "));return e.jsxs("div",{className:pe,children:[t&&e.jsx("label",{htmlFor:F,className:"text-label-sm text-[var(--color-text-default)]",children:t}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{ref:ie,type:"search",id:F,className:me,value:S,onChange:ne,disabled:u,"aria-label":t||"Search",...ae}),c&&z&&!u&&e.jsx("button",{type:"button",tabIndex:-1,className:"absolute right-7 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors duration-[var(--duration-fast)]",onClick:le,"aria-label":"Clear search",children:e.jsx(ve,{size:12,strokeWidth:2})}),e.jsx("div",{className:"absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] pointer-events-none",children:e.jsx(be,{size:12,strokeWidth:2})})]})]})});l.displayName="SearchInput";l.__docgenInfo={description:"",methods:[],displayName:"SearchInput",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Input size",defaultValue:{value:"'md'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},clearable:{required:!1,tsType:{name:"boolean"},description:"Show clear button when has value",defaultValue:{value:"true",computed:!1}},onClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when clear button is clicked"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};function te({children:r,className:t}){return e.jsx(he,{gap:1,className:t,children:r})}function L({className:r}){return e.jsx("div",{className:p("h-4 w-px bg-[var(--color-border-default)]",r)})}function w({filters:r,onFilterRemove:t,onFiltersClear:d,clearFiltersLabel:c="Clear Filters",className:o}){return r.length===0?null:e.jsxs("div",{className:p("flex items-center justify-between pl-2 pr-4 py-2","bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]",o),children:[e.jsx("div",{className:"flex items-center gap-1",children:r.map(a=>e.jsx(fe,{label:a.field,value:a.value,onRemove:t?()=>t(a.id):void 0},a.id))}),d&&e.jsx("button",{onClick:d,className:"text-label-sm font-medium text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors",children:c})]})}function s({primaryActions:r,bulkActions:t,showDivider:d=!0,filters:c=[],onFilterRemove:o,onFiltersClear:a,clearFiltersLabel:j="Clear Filters",className:u,children:i}){const A=r||t||i,m=c.length>0;return e.jsxs("div",{className:p("flex flex-col gap-2",u),children:[A&&e.jsxs("div",{className:"flex items-center gap-2",children:[r,d&&r&&t&&e.jsx(L,{}),t,i]}),m&&e.jsx(w,{filters:c,onFilterRemove:o,onFiltersClear:a,clearFiltersLabel:j})]})}s.Actions=te;s.Divider=L;s.Filters=w;te.__docgenInfo={description:"",methods:[],displayName:"ListToolbarActions",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};L.__docgenInfo={description:"",methods:[],displayName:"ListToolbarDivider",props:{className:{required:!1,tsType:{name:"string"},description:""}}};w.__docgenInfo={description:"",methods:[],displayName:"ListToolbarFilters",props:{filters:{required:!0,tsType:{name:"Array",elements:[{name:"FilterItem"}],raw:"FilterItem[]"},description:""},onFilterRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onFiltersClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},clearFiltersLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Clear Filters'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};s.__docgenInfo={description:"",methods:[{name:"Actions",docblock:null,modifiers:["static"],params:[{name:"{ children, className }: ListToolbarActionsProps",optional:!1,type:{name:"ListToolbarActionsProps",alias:"ListToolbarActionsProps"}}],returns:null},{name:"Divider",docblock:null,modifiers:["static"],params:[{name:"{ className }: ListToolbarDividerProps",optional:!1,type:{name:"ListToolbarDividerProps",alias:"ListToolbarDividerProps"}}],returns:null},{name:"Filters",docblock:null,modifiers:["static"],params:[{name:`{
  filters,
  onFilterRemove,
  onFiltersClear,
  clearFiltersLabel = 'Clear Filters',
  className,
}: ListToolbarFiltersProps`,optional:!1,type:{name:"ListToolbarFiltersProps",alias:"ListToolbarFiltersProps"}}],returns:null}],displayName:"ListToolbar",props:{primaryActions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Primary actions (left side) - typically search, download"},bulkActions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Bulk actions - actions for selected items"},showDivider:{required:!1,tsType:{name:"boolean"},description:"Whether to show divider between primary and bulk actions",defaultValue:{value:"true",computed:!1}},filters:{required:!1,tsType:{name:"Array",elements:[{name:"FilterItem"}],raw:"FilterItem[]"},description:"Active filters",defaultValue:{value:"[]",computed:!1}},onFilterRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Callback when a filter is removed"},onFiltersClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when all filters are cleared"},clearFiltersLabel:{required:!1,tsType:{name:"string"},description:"Label for clear filters button",defaultValue:{value:"'Clear Filters'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional class name"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Children for custom content"}}};const Ne={title:"Components/ListToolbar",component:s,tags:["autodocs"],decorators:[r=>e.jsx("div",{className:"max-w-3xl",children:e.jsx(r,{})})],parameters:{docs:{description:{component:`
## ListToolbar 컴포넌트

리스트/테이블 상단에 배치되는 툴바 컴포넌트입니다.

### 구성 요소
- **ListToolbar**: 메인 컨테이너
- **ListToolbar.Actions**: 액션 버튼 그룹
- **ListToolbar.Divider**: 구분선
- **ListToolbar.Filters**: 필터 칩 영역

### 특징
- 검색, 다운로드 등 기본 액션
- 선택된 항목에 대한 일괄 액션
- 활성 필터 표시 및 제거

### 사용 시기
- 데이터 테이블 상단
- 리스트 페이지 액션 바
- 필터링 가능한 목록

### 예시
\`\`\`tsx
<ListToolbar
  primaryActions={
    <>
      <SearchInput placeholder="Search..." />
      <Button variant="secondary">Download</Button>
    </>
  }
  bulkActions={
    <Button variant="danger">Delete Selected</Button>
  }
  filters={[
    { id: '1', field: 'Status', value: 'Running' },
  ]}
  onFilterRemove={(id) => removeFilter(id)}
/>
\`\`\`
        `}}},argTypes:{showDivider:{control:"boolean",description:"구분선 표시",table:{defaultValue:{summary:"true"}}}}},h={render:()=>e.jsx(s,{primaryActions:e.jsxs(s.Actions,{children:[e.jsx(l,{placeholder:"Search instances...",size:"sm"}),e.jsx(n,{variant:"secondary",size:"sm",leftIcon:e.jsx(re,{size:14}),children:"Download"})]})})},v={render:()=>e.jsx(s,{primaryActions:e.jsx(s.Actions,{children:e.jsx(l,{placeholder:"Search...",size:"sm"})}),bulkActions:e.jsx(s.Actions,{children:e.jsx(n,{variant:"danger",size:"sm",leftIcon:e.jsx(se,{size:14}),children:"Delete (3)"})})})},b={render:()=>e.jsx(s,{primaryActions:e.jsx(s.Actions,{children:e.jsx(l,{placeholder:"Search...",size:"sm"})}),filters:[{id:"1",field:"Status",value:"Running"},{id:"2",field:"Type",value:"m5.large"},{id:"3",field:"Region",value:"us-east-1"}],onFilterRemove:r=>console.log("Remove filter:",r),onFiltersClear:()=>console.log("Clear all filters")})},x={render:()=>e.jsx(s,{primaryActions:e.jsxs(s.Actions,{children:[e.jsx(l,{placeholder:"Search instances...",size:"sm"}),e.jsx(n,{variant:"secondary",size:"sm",leftIcon:e.jsx(re,{size:14}),children:"Export"}),e.jsx(n,{variant:"primary",size:"sm",leftIcon:e.jsx(xe,{size:14}),children:"Create"})]}),bulkActions:e.jsxs(s.Actions,{children:[e.jsx(n,{variant:"secondary",size:"sm",children:"Stop (2)"}),e.jsx(n,{variant:"danger",size:"sm",leftIcon:e.jsx(se,{size:14}),children:"Delete (2)"})]}),filters:[{id:"1",field:"Status",value:"Running"},{id:"2",field:"Type",value:"m5.large"}],onFilterRemove:r=>console.log("Remove:",r),onFiltersClear:()=>console.log("Clear all")})},g={render:()=>e.jsx(s,{showDivider:!1,primaryActions:e.jsx(s.Actions,{children:e.jsx(l,{placeholder:"Search...",size:"sm"})}),bulkActions:e.jsx(s.Actions,{children:e.jsx(n,{variant:"secondary",size:"sm",children:"Action"})})})},y={render:()=>e.jsx(s,{filters:[{id:"1",field:"Environment",value:"Production"},{id:"2",field:"Owner",value:"admin@example.com"},{id:"3",field:"Created",value:"Last 7 days"}],onFilterRemove:r=>console.log("Remove:",r),onFiltersClear:()=>console.log("Clear all"),clearFiltersLabel:"Reset All"})},T={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx(l,{placeholder:"Search...",size:"sm"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm text-[var(--color-text-muted)]",children:"Showing 1-10 of 100"}),e.jsx(n,{variant:"primary",size:"sm",children:"Create New"})]})]})})};var B,k,q;h.parameters={...h.parameters,docs:{...(B=h.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search instances..." size="sm" />
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
            Download
          </Button>
        </ListToolbar.Actions>} />
}`,...(q=(k=h.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var _,P,V;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>} bulkActions={<ListToolbar.Actions>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={14} />}>
            Delete (3)
          </Button>
        </ListToolbar.Actions>} />
}`,...(V=(P=v.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var W,E,O;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>} filters={[{
    id: '1',
    field: 'Status',
    value: 'Running'
  }, {
    id: '2',
    field: 'Type',
    value: 'm5.large'
  }, {
    id: '3',
    field: 'Region',
    value: 'us-east-1'
  }]} onFilterRemove={id => console.log('Remove filter:', id)} onFiltersClear={() => console.log('Clear all filters')} />
}`,...(O=(E=b.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var H,M,X;x.parameters={...x.parameters,docs:{...(H=x.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search instances..." size="sm" />
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
            Export
          </Button>
          <Button variant="primary" size="sm" leftIcon={<IconPlus size={14} />}>
            Create
          </Button>
        </ListToolbar.Actions>} bulkActions={<ListToolbar.Actions>
          <Button variant="secondary" size="sm">
            Stop (2)
          </Button>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={14} />}>
            Delete (2)
          </Button>
        </ListToolbar.Actions>} filters={[{
    id: '1',
    field: 'Status',
    value: 'Running'
  }, {
    id: '2',
    field: 'Type',
    value: 'm5.large'
  }]} onFilterRemove={id => console.log('Remove:', id)} onFiltersClear={() => console.log('Clear all')} />
}`,...(X=(M=x.parameters)==null?void 0:M.docs)==null?void 0:X.source}}};var $,G,J;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <ListToolbar showDivider={false} primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>} bulkActions={<ListToolbar.Actions>
          <Button variant="secondary" size="sm">
            Action
          </Button>
        </ListToolbar.Actions>} />
}`,...(J=(G=g.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var K,Q,U;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <ListToolbar filters={[{
    id: '1',
    field: 'Environment',
    value: 'Production'
  }, {
    id: '2',
    field: 'Owner',
    value: 'admin@example.com'
  }, {
    id: '3',
    field: 'Created',
    value: 'Last 7 days'
  }]} onFilterRemove={id => console.log('Remove:', id)} onFiltersClear={() => console.log('Clear all')} clearFiltersLabel="Reset All" />
}`,...(U=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var Y,Z,ee;T.parameters={...T.parameters,docs:{...(Y=T.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <ListToolbar>
      <div className="flex items-center justify-between w-full">
        <SearchInput placeholder="Search..." size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-muted)]">Showing 1-10 of 100</span>
          <Button variant="primary" size="sm">
            Create New
          </Button>
        </div>
      </div>
    </ListToolbar>
}`,...(ee=(Z=T.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};const De=["Default","WithBulkActions","WithFilters","FullFeatured","WithoutDivider","FiltersOnly","CustomChildren"];export{T as CustomChildren,h as Default,y as FiltersOnly,x as FullFeatured,v as WithBulkActions,b as WithFilters,g as WithoutDivider,De as __namedExportsOrder,Ne as default};
