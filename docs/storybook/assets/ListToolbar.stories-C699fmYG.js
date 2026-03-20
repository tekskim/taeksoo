import{j as e}from"./iframe-ko1KmZFS.js";import{L as r}from"./ListToolbar-Dv0brMxD.js";import{S as t}from"./SearchInput-SpqbhZZS.js";import{B as s}from"./Button-BQge8bfe.js";import{I as D}from"./IconDownload-CIoQP3hf.js";import{I as k}from"./IconTrash-Bp6PO-fu.js";import{I as N}from"./IconPlus-DF_1TQez.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./Chip-z8dgdLQ7.js";import"./IconX-CZRrzHtO.js";import"./createReactComponent-B-brzlrB.js";import"./Stack-Dh9f_Si_.js";import"./IconSearch-DGZDdks0.js";const X={title:"Components/ListToolbar",component:r,tags:["autodocs"],decorators:[o=>e.jsx("div",{className:"max-w-3xl",children:e.jsx(o,{})})],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{showDivider:{control:"boolean",description:"구분선 표시",table:{defaultValue:{summary:"true"}}}}},i={render:()=>e.jsx(r,{primaryActions:e.jsxs(r.Actions,{children:[e.jsx(t,{placeholder:"Search instances...",size:"sm"}),e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(D,{size:14}),children:"Download"})]})})},a={render:()=>e.jsx(r,{primaryActions:e.jsx(r.Actions,{children:e.jsx(t,{placeholder:"Search...",size:"sm"})}),bulkActions:e.jsx(r.Actions,{children:e.jsx(s,{variant:"danger",size:"sm",leftIcon:e.jsx(k,{size:14}),children:"Delete (3)"})})})},n={render:()=>e.jsx(r,{primaryActions:e.jsx(r.Actions,{children:e.jsx(t,{placeholder:"Search...",size:"sm"})}),filters:[{id:"1",field:"Status",value:"Running"},{id:"2",field:"Type",value:"m5.large"},{id:"3",field:"Region",value:"us-east-1"}],onFilterRemove:o=>console.log("Remove filter:",o),onFiltersClear:()=>console.log("Clear all filters")})},l={render:()=>e.jsx(r,{primaryActions:e.jsxs(r.Actions,{children:[e.jsx(t,{placeholder:"Search instances...",size:"sm"}),e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(D,{size:14}),children:"Export"}),e.jsx(s,{variant:"primary",size:"sm",leftIcon:e.jsx(N,{size:14}),children:"Create"})]}),bulkActions:e.jsxs(r.Actions,{children:[e.jsx(s,{variant:"secondary",size:"sm",children:"Stop (2)"}),e.jsx(s,{variant:"danger",size:"sm",leftIcon:e.jsx(k,{size:14}),children:"Delete (2)"})]}),filters:[{id:"1",field:"Status",value:"Running"},{id:"2",field:"Type",value:"m5.large"}],onFilterRemove:o=>console.log("Remove:",o),onFiltersClear:()=>console.log("Clear all")})},c={render:()=>e.jsx(r,{showDivider:!1,primaryActions:e.jsx(r.Actions,{children:e.jsx(t,{placeholder:"Search...",size:"sm"})}),bulkActions:e.jsx(r.Actions,{children:e.jsx(s,{variant:"secondary",size:"sm",children:"Action"})})})},d={render:()=>e.jsx(r,{filters:[{id:"1",field:"Environment",value:"Production"},{id:"2",field:"Owner",value:"admin@example.com"},{id:"3",field:"Created",value:"Last 7 days"}],onFilterRemove:o=>console.log("Remove:",o),onFiltersClear:()=>console.log("Clear all"),clearFiltersLabel:"Reset All"})},m={render:()=>e.jsx(r,{children:e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx(t,{placeholder:"Search...",size:"sm"}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"Showing 1-10 of 100"}),e.jsx(s,{variant:"primary",size:"sm",children:"Create New"})]})]})})};var u,p,h;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search instances..." size="sm" />
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
            Download
          </Button>
        </ListToolbar.Actions>} />
}`,...(h=(p=i.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var v,f,x;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <ListToolbar primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>} bulkActions={<ListToolbar.Actions>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={14} />}>
            Delete (3)
          </Button>
        </ListToolbar.Actions>} />
}`,...(x=(f=a.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var A,b,g;n.parameters={...n.parameters,docs:{...(A=n.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(g=(b=n.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var j,T,S;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(S=(T=l.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};var y,z,L;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <ListToolbar showDivider={false} primaryActions={<ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>} bulkActions={<ListToolbar.Actions>
          <Button variant="secondary" size="sm">
            Action
          </Button>
        </ListToolbar.Actions>} />
}`,...(L=(z=c.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};var I,F,B;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(B=(F=d.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var C,R,w;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <ListToolbar>
      <div className="flex items-center justify-between w-full">
        <SearchInput placeholder="Search..." size="sm" />
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <span className="text-body-md text-[var(--color-text-muted)]">Showing 1-10 of 100</span>
          <Button variant="primary" size="sm">
            Create New
          </Button>
        </div>
      </div>
    </ListToolbar>
}`,...(w=(R=m.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};const Y=["Default","WithBulkActions","WithFilters","FullFeatured","WithoutDivider","FiltersOnly","CustomChildren"];export{m as CustomChildren,i as Default,d as FiltersOnly,l as FullFeatured,a as WithBulkActions,n as WithFilters,c as WithoutDivider,Y as __namedExportsOrder,X as default};
