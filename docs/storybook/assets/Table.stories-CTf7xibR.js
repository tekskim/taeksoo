import{j as e,r as f}from"./iframe-iHQO5Mqm.js";import{T as s}from"./Table-ILr629vn.js";import{B as i}from"./Button-9zQlOYxA.js";import{B as oe}from"./Badge-RkZjZf5Q.js";import{g as ce}from"./CustomIcons-XuzGxuWG.js";import{I as me}from"./IconEdit-CSXljq5-.js";import{I as de}from"./IconTrash-V9FplMLj.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./Checkbox-DP42stgX.js";import"./IconMinus-B--iY0Bg.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconCheck-ai78HtyZ.js";import"./IconChevronUp-DKe8af00.js";import"./IconChevronDown-LyXUQX2K.js";const r=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"active",createdAt:"Jan 15, 2024 12:22:26"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"active",createdAt:"Jan 20, 2024 23:27:51"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"inactive",createdAt:"Feb 1, 2024 10:20:28"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"pending",createdAt:"Feb 10, 2024 01:17:01"},{id:"5",name:"Charlie Davis",email:"charlie@example.com",role:"Viewer",status:"active",createdAt:"Feb 15, 2024 12:22:26"}],c=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status"}],ze={title:"Components/Table",component:s,tags:["autodocs"],parameters:{docs:{description:{component:`
## Table 컴포넌트

데이터를 행과 열로 표시하는 테이블 컴포넌트입니다.

### 기능
- **정렬**: 컬럼별 오름차순/내림차순 정렬
- **선택**: 단일/다중 행 선택
- **컬럼 리사이즈**: 드래그로 컬럼 너비 조절, 더블클릭으로 콘텐츠 자동 맞춤, 키보드(ArrowLeft/Right) 지원
- **커스텀 렌더링**: 셀 내용 커스터마이징
- **스크롤**: 고정 헤더 + 본문 스크롤

### 사용 시기
- 데이터 목록 표시
- CRUD 작업 인터페이스
- 대시보드 데이터 테이블

### 접근성
- 표준 HTML table 구조 사용
- 정렬 버튼에 aria-sort 적용
- 선택 체크박스 레이블 자동 생성
- 리사이즈 핸들: role="separator", aria-orientation="vertical", 키보드 탐색 지원

### 예시
\`\`\`tsx
import { Table } from '@thaki/tds';

const columns = [
  { key: 'name', label: '이름', sortable: true },
  { key: 'email', label: '이메일' },
  { 
    key: 'status', 
    label: '상태',
    render: (value) => <Badge>{value}</Badge>
  },
];

const data = [
  { id: '1', name: '홍길동', email: 'hong@example.com', status: 'active' },
];

<Table 
  columns={columns} 
  data={data} 
  rowKey="id"
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
/>
\`\`\`
        `}}}},m={render:()=>e.jsx(s,{columns:c,data:r,rowKey:"id"})},d={render:()=>{const l=[{key:"name",label:"Name",width:"180px"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"status",label:"Status",width:"100px",align:"center",render:t=>{const o={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}}[t];return e.jsx(oe,{theme:o.theme,type:"subtle",size:"sm",children:o.label})}}];return e.jsx(s,{columns:l,data:r,rowKey:"id"})}},u={render:function(){const[t,a]=f.useState([]);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(s,{columns:c,data:r,rowKey:"id",selectable:!0,selectedKeys:t,onSelectionChange:a}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",t.length>0?t.join(", "):"None"]})]})}},b={render:()=>{const l=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"createdAt",label:"Created at",sortable:!0,width:"120px"}];return e.jsx(s,{columns:l,data:r,rowKey:"id"})}},p={render:()=>{const l=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"actions",label:"",width:"100px",align:"center",render:(t,a)=>e.jsxs("div",{className:"flex items-center justify-end gap-[var(--primitive-spacing-1)]",children:[e.jsx(i,{variant:"ghost",size:"sm",icon:e.jsx(me,{size:12}),"aria-label":`Edit ${a.name}`}),e.jsx(i,{variant:"ghost",size:"sm",icon:e.jsx(de,{size:12}),"aria-label":`Delete ${a.name}`})]})}];return e.jsx(s,{columns:l,data:r,rowKey:"id"})}},y={render:()=>{const l=t=>{alert(`Clicked on: ${t.name}`)};return e.jsx(s,{columns:c,data:r,rowKey:"id",onRowClick:l})}},g={render:()=>e.jsx(s,{columns:c,data:[],rowKey:"id",emptyMessage:"No users found. Create your first user to get started."})},x={render:()=>{const l=Array.from({length:20},(t,a)=>({id:String(a+1),name:`User ${a+1}`,email:`user${a+1}@example.com`,role:a%3===0?"Admin":a%3===1?"Editor":"Viewer",status:a%3===0?"active":a%3===1?"inactive":"pending",createdAt:"Jan 1, 2024 10:20:28"}));return e.jsx(s,{columns:c,data:l,rowKey:"id",maxHeight:"300px",stickyHeader:!0})}},h={render:()=>{const l=[{key:"name",label:"Name (Left)",align:"left"},{key:"email",label:"Email (Center)",align:"center"},{key:"role",label:"Role (Right)",align:"center"}];return e.jsx(s,{columns:l,data:r,rowKey:"id"})}},v={render:function(){const t=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status",width:"100px",align:"center"},{key:"createdAt",label:"Created at"}];return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Drag column edges to resize. Double-click to auto-fit content width."}),e.jsx(s,{columns:t,data:r,rowKey:"id",resizable:!0,onColumnResize:(a,o)=>console.log(`Column ${a} resized to ${o}px`)})]})}},k={render:function(){const[t,a]=f.useState([]),o=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"createdAt",label:"Created at",align:"right"}];return e.jsx(s,{columns:o,data:r,rowKey:"id",resizable:!0,selectable:!0,selectedKeys:t,onSelectionChange:a})}},C={render:function(){const[t,a]=f.useState([]),o=[{key:"name",label:"User",width:"200px",sortable:!0,render:(n,w)=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-label-lg",children:n}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:w.email})]})},{key:"role",label:"Role",width:"100px",sortable:!0},{key:"status",label:"Status",width:"100px",align:"center",render:n=>{const w={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}},{theme:ne,label:ie}=w[n];return e.jsx(oe,{theme:ne,type:"subtle",size:"sm",dot:!0,children:ie})}},{key:"createdAt",label:"Created",width:"120px",sortable:!0,render:n=>e.jsx("span",{className:"text-[var(--color-text-muted)]",children:n})},{key:"actions",label:"",width:"48px",align:"center",render:()=>e.jsx(i,{variant:"ghost",size:"sm",icon:e.jsx(ce,{size:16,stroke:1}),"aria-label":"More actions"})}];return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[t.length>0&&e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)] rounded",children:[e.jsxs("span",{className:"text-body-md",children:[t.length," selected"]}),e.jsx(i,{variant:"ghost",size:"sm",onClick:()=>a([]),children:"Clear"}),e.jsx(i,{variant:"danger",size:"sm",children:"Delete Selected"})]}),e.jsx(s,{columns:o,data:r,rowKey:"id",selectable:!0,selectedKeys:t,onSelectionChange:a})]})}};var S,K,j;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />
}`,...(j=(K=m.parameters)==null?void 0:K.docs)==null?void 0:j.source}}};var z,N,R;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => {
    const columns: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name',
      width: '180px'
    }, {
      key: 'email',
      label: 'Email'
    }, {
      key: 'role',
      label: 'Role',
      width: '100px'
    }, {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center',
      render: value => {
        const statusConfig = {
          active: {
            theme: 'green' as const,
            label: 'Active'
          },
          inactive: {
            theme: 'gray' as const,
            label: 'Inactive'
          },
          pending: {
            theme: 'yellow' as const,
            label: 'Pending'
          }
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        return <Badge theme={config.theme} type="subtle" size="sm">
              {config.label}
            </Badge>;
      }
    }];
    return <Table columns={columns} data={sampleUsers} rowKey="id" />;
  }
}`,...(R=(N=d.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};var T,A,E;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(E=(A=u.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var U,B,$;b.parameters={...b.parameters,docs:{...(U=b.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const sortableColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'email',
      label: 'Email',
      sortable: true
    }, {
      key: 'role',
      label: 'Role',
      sortable: true
    }, {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      width: '120px'
    }];
    return <Table columns={sortableColumns} data={sampleUsers} rowKey="id" />;
  }
}`,...($=(B=b.parameters)==null?void 0:B.docs)==null?void 0:$.source}}};var D,I,W;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    const columnsWithActions: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'email',
      label: 'Email'
    }, {
      key: 'role',
      label: 'Role',
      width: '100px'
    }, {
      key: 'actions',
      label: '',
      width: '100px',
      align: 'center',
      render: (_value, row) => <div className="flex items-center justify-end gap-[var(--primitive-spacing-1)]">
            <Button variant="ghost" size="sm" icon={<IconEdit size={12} />} aria-label={\`Edit \${row.name}\`} />
            <Button variant="ghost" size="sm" icon={<IconTrash size={12} />} aria-label={\`Delete \${row.name}\`} />
          </div>
    }];
    return <Table columns={columnsWithActions} data={sampleUsers} rowKey="id" />;
  }
}`,...(W=(I=p.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var J,_,H;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => {
    const handleRowClick = (row: User) => {
      alert(\`Clicked on: \${row.name}\`);
    };
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />;
  }
}`,...(H=(_=y.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var M,L,P;g.parameters={...g.parameters,docs:{...(M=g.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={[]} rowKey="id" emptyMessage="No users found. Create your first user to get started." />
}`,...(P=(L=g.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var V,F,O;x.parameters={...x.parameters,docs:{...(V=x.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const manyUsers = Array.from({
      length: 20
    }, (_, i) => ({
      id: String(i + 1),
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
      status: (i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending') as User['status'],
      createdAt: 'Jan 1, 2024 10:20:28'
    }));
    return <Table columns={basicColumns} data={manyUsers} rowKey="id" maxHeight="300px" stickyHeader />;
  }
}`,...(O=(F=x.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var q,G,Q;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => {
    const alignedColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name (Left)',
      align: 'left'
    }, {
      key: 'email',
      label: 'Email (Center)',
      align: 'center'
    }, {
      key: 'role',
      label: 'Role (Right)',
      align: 'center'
    }];
    return <Table columns={alignedColumns} data={sampleUsers} rowKey="id" />;
  }
}`,...(Q=(G=h.parameters)==null?void 0:G.docs)==null?void 0:Q.source}}};var X,Y,Z;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: function ResizableTable() {
    const resizableColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'email',
      label: 'Email'
    }, {
      key: 'role',
      label: 'Role'
    }, {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center'
    }, {
      key: 'createdAt',
      label: 'Created at'
    }];
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Drag column edges to resize. Double-click to auto-fit content width.
        </p>
        <Table columns={resizableColumns} data={sampleUsers} rowKey="id" resizable onColumnResize={(key, width) => console.log(\`Column \${key} resized to \${width}px\`)} />
      </div>;
  }
}`,...(Z=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,te;k.parameters={...k.parameters,docs:{...(ee=k.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: function ResizableSelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const columns: TableColumn<User>[] = [{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'email',
      label: 'Email'
    }, {
      key: 'role',
      label: 'Role'
    }, {
      key: 'createdAt',
      label: 'Created at',
      align: 'right'
    }];
    return <Table columns={columns} data={sampleUsers} rowKey="id" resizable selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />;
  }
}`,...(te=(ae=k.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var le,se,re;C.parameters={...C.parameters,docs:{...(le=C.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: function ComplexTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const complexColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'User',
      width: '200px',
      sortable: true,
      render: (value, row) => <div className="flex flex-col">
            <span className="text-label-lg">{value}</span>
            <span className="text-body-sm text-[var(--color-text-muted)]">{row.email}</span>
          </div>
    }, {
      key: 'role',
      label: 'Role',
      width: '100px',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center',
      render: value => {
        const config = {
          active: {
            theme: 'green' as const,
            label: 'Active'
          },
          inactive: {
            theme: 'gray' as const,
            label: 'Inactive'
          },
          pending: {
            theme: 'yellow' as const,
            label: 'Pending'
          }
        };
        const {
          theme,
          label
        } = config[value as keyof typeof config];
        return <Badge theme={theme} type="subtle" size="sm" dot>
              {label}
            </Badge>;
      }
    }, {
      key: 'createdAt',
      label: 'Created',
      width: '120px',
      sortable: true,
      render: value => <span className="text-[var(--color-text-muted)]">{value}</span>
    }, {
      key: 'actions',
      label: '',
      width: '48px',
      align: 'center',
      render: () => <Button variant="ghost" size="sm" icon={<IconAction size={16} stroke={1} />} aria-label="More actions" />
    }];
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        {selectedKeys.length > 0 && <div className="flex items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)] rounded">
            <span className="text-body-md">{selectedKeys.length} selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedKeys([])}>
              Clear
            </Button>
            <Button variant="danger" size="sm">
              Delete Selected
            </Button>
          </div>}
        <Table columns={complexColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
      </div>;
  }
}`,...(re=(se=C.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};const Ne=["Default","WithCustomRendering","Selectable","Sortable","WithActions","RowClickable","Empty","Scrollable","ColumnAlignment","Resizable","ResizableWithSelection","ComplexExample"];export{h as ColumnAlignment,C as ComplexExample,m as Default,g as Empty,v as Resizable,k as ResizableWithSelection,y as RowClickable,x as Scrollable,u as Selectable,b as Sortable,p as WithActions,d as WithCustomRendering,Ne as __namedExportsOrder,ze as default};
