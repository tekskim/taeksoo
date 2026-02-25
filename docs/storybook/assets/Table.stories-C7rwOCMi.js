import{j as e,r as X}from"./iframe-CsZHcOUf.js";import{T as l}from"./Table-BgAmSw5t.js";import{B as o}from"./Button-B8wqjk7E.js";import{B as Y}from"./Badge-02pMjZv4.js";import{g as ae}from"./CustomIcons-C6lf9XpS.js";import{I as te}from"./IconEdit-DUgdQ0nE.js";import{I as se}from"./IconTrash-KHfvkqwk.js";import"./preload-helper-C1FmrZbK.js";import"./Checkbox-BxGfG1OC.js";import"./cn-CshvV4Tc.js";import"./IconMinus-DPC1OfOV.js";import"./createReactComponent-C2Lh4gVY.js";import"./IconCheck-VSfqs-sU.js";import"./IconChevronUp-Bv0ZBqhr.js";import"./IconChevronDown-CoAmE0_C.js";const r=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"active",createdAt:"Jan 15, 2024"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"active",createdAt:"Jan 20, 2024"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"inactive",createdAt:"Feb 1, 2024"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"pending",createdAt:"Feb 10, 2024"},{id:"5",name:"Charlie Davis",email:"charlie@example.com",role:"Viewer",status:"active",createdAt:"Feb 15, 2024"}],i=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status"}],ve={title:"Components/Table",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
## Table 컴포넌트

데이터를 행과 열로 표시하는 테이블 컴포넌트입니다.

### 기능
- **정렬**: 컬럼별 오름차순/내림차순 정렬
- **선택**: 단일/다중 행 선택
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
        `}}}},m={render:()=>e.jsx(l,{columns:i,data:r,rowKey:"id"})},d={render:()=>{const t=[{key:"name",label:"Name",width:"180px"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"status",label:"Status",width:"100px",align:"center",render:s=>{const c={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}}[s];return e.jsx(Y,{theme:c.theme,type:"subtle",size:"sm",children:c.label})}}];return e.jsx(l,{columns:t,data:r,rowKey:"id"})}},u={render:function(){const[s,a]=X.useState([]);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{columns:i,data:r,rowKey:"id",selectable:!0,selectedKeys:s,onSelectionChange:a}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",s.length>0?s.join(", "):"None"]})]})}},p={render:()=>{const t=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"createdAt",label:"Created at",sortable:!0,width:"120px"}];return e.jsx(l,{columns:t,data:r,rowKey:"id"})}},b={render:()=>{const t=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"actions",label:"",width:"100px",align:"center",render:(s,a)=>e.jsxs("div",{className:"flex items-center justify-end gap-[var(--primitive-spacing-1)]",children:[e.jsx(o,{variant:"ghost",size:"sm",icon:e.jsx(te,{size:12}),"aria-label":`Edit ${a.name}`}),e.jsx(o,{variant:"ghost",size:"sm",icon:e.jsx(se,{size:12}),"aria-label":`Delete ${a.name}`})]})}];return e.jsx(l,{columns:t,data:r,rowKey:"id"})}},g={render:()=>{const t=s=>{alert(`Clicked on: ${s.name}`)};return e.jsx(l,{columns:i,data:r,rowKey:"id",onRowClick:t})}},y={render:()=>e.jsx(l,{columns:i,data:[],rowKey:"id",emptyMessage:"No users found. Create your first user to get started."})},x={render:()=>{const t=Array.from({length:20},(s,a)=>({id:String(a+1),name:`User ${a+1}`,email:`user${a+1}@example.com`,role:a%3===0?"Admin":a%3===1?"Editor":"Viewer",status:a%3===0?"active":a%3===1?"inactive":"pending",createdAt:"Jan 1, 2024"}));return e.jsx(l,{columns:i,data:t,rowKey:"id",maxHeight:"300px",stickyHeader:!0})}},h={render:()=>{const t=[{key:"name",label:"Name (Left)",align:"left"},{key:"email",label:"Email (Center)",align:"center"},{key:"role",label:"Role (Right)",align:"center"}];return e.jsx(l,{columns:t,data:r,rowKey:"id"})}},v={render:function(){const[s,a]=X.useState([]),c=[{key:"name",label:"User",width:"200px",sortable:!0,render:(n,k)=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-label-lg",children:n}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:k.email})]})},{key:"role",label:"Role",width:"100px",sortable:!0},{key:"status",label:"Status",width:"100px",align:"center",render:n=>{const k={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}},{theme:Z,label:ee}=k[n];return e.jsx(Y,{theme:Z,type:"subtle",size:"sm",dot:!0,children:ee})}},{key:"createdAt",label:"Created",width:"120px",sortable:!0,render:n=>e.jsx("span",{className:"text-[var(--color-text-muted)]",children:n})},{key:"actions",label:"",width:"48px",align:"center",render:()=>e.jsx(o,{variant:"ghost",size:"sm",icon:e.jsx(ae,{size:16,stroke:1}),"aria-label":"More actions"})}];return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[s.length>0&&e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)] rounded",children:[e.jsxs("span",{className:"text-body-md",children:[s.length," selected"]}),e.jsx(o,{variant:"ghost",size:"sm",onClick:()=>a([]),children:"Clear"}),e.jsx(o,{variant:"danger",size:"sm",children:"Delete Selected"})]}),e.jsx(l,{columns:c,data:r,rowKey:"id",selectable:!0,selectedKeys:s,onSelectionChange:a})]})}};var w,f,C;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />
}`,...(C=(f=m.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var S,K,j;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(j=(K=d.parameters)==null?void 0:K.docs)==null?void 0:j.source}}};var N,A,T;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(T=(A=u.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var E,R,U;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(U=(R=p.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var z,B,I;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(I=(B=b.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var $,D,W;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const handleRowClick = (row: User) => {
      alert(\`Clicked on: \${row.name}\`);
    };
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />;
  }
}`,...(W=(D=g.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};var J,_,H;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={[]} rowKey="id" emptyMessage="No users found. Create your first user to get started." />
}`,...(H=(_=y.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var M,P,V;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const manyUsers = Array.from({
      length: 20
    }, (_, i) => ({
      id: String(i + 1),
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
      status: (i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending') as User['status'],
      createdAt: 'Jan 1, 2024'
    }));
    return <Table columns={basicColumns} data={manyUsers} rowKey="id" maxHeight="300px" stickyHeader />;
  }
}`,...(V=(P=x.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var F,L,O;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(O=(L=h.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var q,G,Q;v.parameters={...v.parameters,docs:{...(q=v.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(Q=(G=v.parameters)==null?void 0:G.docs)==null?void 0:Q.source}}};const ke=["Default","WithCustomRendering","Selectable","Sortable","WithActions","RowClickable","Empty","Scrollable","ColumnAlignment","ComplexExample"];export{h as ColumnAlignment,v as ComplexExample,m as Default,y as Empty,g as RowClickable,x as Scrollable,u as Selectable,p as Sortable,b as WithActions,d as WithCustomRendering,ke as __namedExportsOrder,ve as default};
