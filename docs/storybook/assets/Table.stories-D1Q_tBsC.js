import{j as e,r as j}from"./iframe-CzLct1Ct.js";import{T as l}from"./Table-G8ugu2bB.js";import{B as c}from"./Button-kAA1kjx0.js";import{B as ze}from"./Badge-PfS4B4C-.js";import{c as Ne}from"./createReactComponent-Djx9unWR.js";import{I as Ae}from"./IconEdit-C4TPH2hK.js";import{I as Te}from"./IconTrash-oozeluA6.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./Checkbox-CggtZ8td.js";import"./IconMinus-C--IzGJr.js";import"./IconCheck-Dy71EyJ1.js";import"./IconChevronUp-DRXj0Adb.js";import"./IconChevronDown-wxdkvj6Y.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=[["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-0"}],["path",{d:"M8 12l0 .01",key:"svg-1"}],["path",{d:"M12 12l0 .01",key:"svg-2"}],["path",{d:"M16 12l0 .01",key:"svg-3"}]],Ue=Ne("outline","dots-circle-horizontal","DotsCircleHorizontal",Ee),r=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"active",createdAt:"Jan 15, 2024 12:22:26"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"active",createdAt:"Jan 20, 2024 23:27:51"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"inactive",createdAt:"Feb 1, 2024 10:20:28"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"pending",createdAt:"Feb 10, 2024 01:17:01"},{id:"5",name:"Charlie Davis",email:"charlie@example.com",role:"Viewer",status:"active",createdAt:"Feb 15, 2024 12:22:26"}],o=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status"}],qe={title:"Components/Table",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},d={render:()=>e.jsx(l,{columns:o,data:r,rowKey:"id"})},m={render:()=>{const a=[{key:"name",label:"Name",width:"180px"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"status",label:"Status",width:"100px",align:"center",render:s=>{const n={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}}[s];return e.jsx(ze,{theme:n.theme,type:"subtle",size:"sm",children:n.label})}}];return e.jsx(l,{columns:a,data:r,rowKey:"id"})}},u={render:function(){const[s,t]=j.useState([]);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{columns:o,data:r,rowKey:"id",selectable:!0,selectedKeys:s,onSelectionChange:t}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",s.length>0?s.join(", "):"None"]})]})}},p={render:()=>{const a=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"createdAt",label:"Created at",sortable:!0,width:"120px"}];return e.jsx(l,{columns:a,data:r,rowKey:"id"})}},b={render:()=>{const a=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"actions",label:"",width:"100px",align:"center",render:(s,t)=>e.jsxs("div",{className:"flex items-center justify-end gap-[var(--primitive-spacing-1)]",children:[e.jsx(c,{variant:"ghost",size:"sm",icon:e.jsx(Ae,{size:12}),"aria-label":`Edit ${t.name}`}),e.jsx(c,{variant:"ghost",size:"sm",icon:e.jsx(Te,{size:12}),"aria-label":`Delete ${t.name}`})]})}];return e.jsx(l,{columns:a,data:r,rowKey:"id"})}},y={render:()=>{const a=s=>{alert(`Clicked on: ${s.name}`)};return e.jsx(l,{columns:o,data:r,rowKey:"id",onRowClick:a})}},g={render:()=>e.jsx(l,{columns:o,data:[],rowKey:"id",emptyMessage:"No users found. Create your first user to get started."})},x={render:()=>{const a=Array.from({length:20},(s,t)=>({id:String(t+1),name:`User ${t+1}`,email:`user${t+1}@example.com`,role:t%3===0?"Admin":t%3===1?"Editor":"Viewer",status:t%3===0?"active":t%3===1?"inactive":"pending",createdAt:"Jan 1, 2024 10:20:28"}));return e.jsx(l,{columns:o,data:a,rowKey:"id",maxHeight:"300px",stickyHeader:!0})}},h={render:()=>{const a=[{key:"name",label:"Name (Left)",align:"left"},{key:"email",label:"Email (Center)",align:"center"},{key:"role",label:"Role (Right)",align:"center"}];return e.jsx(l,{columns:a,data:r,rowKey:"id"})}},v={render:function(){const s=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status",width:"100px",align:"center"},{key:"createdAt",label:"Created at"}];return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Drag column edges to resize. Double-click to auto-fit content width."}),e.jsx(l,{columns:s,data:r,rowKey:"id",resizable:!0,onColumnResize:(t,n)=>console.log(`Column ${t} resized to ${n}px`)})]})}},C={render:function(){const[s,t]=j.useState([]),n=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"createdAt",label:"Created at",align:"right"}];return e.jsx(l,{columns:n,data:r,rowKey:"id",resizable:!0,selectable:!0,selectedKeys:s,onSelectionChange:t})}},w={render:function(){const[s,t]=j.useState([]),n=[{key:"name",label:"User",width:"200px",sortable:!0,render:(i,R)=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-label-lg",children:i}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:R.email})]})},{key:"role",label:"Role",width:"100px",sortable:!0},{key:"status",label:"Status",width:"100px",align:"center",render:i=>{const R={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}},{theme:je,label:Re}=R[i];return e.jsx(ze,{theme:je,type:"subtle",size:"sm",dot:!0,children:Re})}},{key:"createdAt",label:"Created",width:"120px",sortable:!0,render:i=>e.jsx("span",{className:"text-[var(--color-text-muted)]",children:i})},{key:"actions",label:"",width:"48px",align:"center",render:()=>e.jsx(c,{variant:"ghost",size:"sm",icon:e.jsx(Ue,{size:16,stroke:1.5}),"aria-label":"More actions"})}];return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[s.length>0&&e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)] rounded",children:[e.jsxs("span",{className:"text-body-md",children:[s.length," selected"]}),e.jsx(c,{variant:"ghost",size:"sm",onClick:()=>t([]),children:"Clear"}),e.jsx(c,{variant:"danger",size:"sm",children:"Delete Selected"})]}),e.jsx(l,{columns:n,data:r,rowKey:"id",selectable:!0,selectedKeys:s,onSelectionChange:t})]})}},k={render:function(){const[s,t]=j.useState([]);return e.jsx(l,{columns:o,data:r,rowKey:"id",selectable:!0,hideSelectAll:!0,selectedKeys:s,onSelectionChange:t})}},S={render:()=>e.jsx(l,{columns:o,data:r,rowKey:"id",rowHeight:"56px"})},f={render:()=>e.jsx(l,{columns:o,data:r,rowKey:"id",expandedContent:a=>e.jsx("div",{className:"px-4 py-3 bg-[var(--color-surface-subtle)] text-body-md text-[var(--color-text-muted)]",children:e.jsxs("div",{className:"flex gap-6",children:[e.jsxs("span",{children:["Email: ",a.email]}),e.jsxs("span",{children:["Role: ",a.role]}),e.jsxs("span",{children:["Created: ",a.createdAt]})]})})})},K={render:()=>e.jsx(l,{columns:o,data:r,rowKey:"id",resizable:!0,columnResizeMode:"onChange",onColumnResize:(a,s)=>console.log(`${a}: ${s}px`)})},z={render:()=>e.jsx(l,{columns:o,data:r,rowKey:"id",resizable:!0,minColumnWidth:100})};var N,A,T;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />
}`,...(T=(A=d.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var E,U,B;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(B=(U=m.parameters)==null?void 0:U.docs)==null?void 0:B.source}}};var $,D,H;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(H=(D=u.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};var M,W,I;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(I=(W=p.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var _,J,L;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(L=(J=b.parameters)==null?void 0:J.docs)==null?void 0:L.source}}};var P,V,F;y.parameters={...y.parameters,docs:{...(P=y.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const handleRowClick = (row: User) => {
      alert(\`Clicked on: \${row.name}\`);
    };
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />;
  }
}`,...(F=(V=y.parameters)==null?void 0:V.docs)==null?void 0:F.source}}};var O,q,G;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={[]} rowKey="id" emptyMessage="No users found. Create your first user to get started." />
}`,...(G=(q=g.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var Q,X,Y;x.parameters={...x.parameters,docs:{...(Q=x.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(Y=(X=x.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;h.parameters={...h.parameters,docs:{...(Z=h.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ae=(ee=h.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var te,se,le;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(le=(se=v.parameters)==null?void 0:se.docs)==null?void 0:le.source}}};var re,oe,ne;C.parameters={...C.parameters,docs:{...(re=C.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(ne=(oe=C.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var ie,ce,de;w.parameters={...w.parameters,docs:{...(ie=w.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
      render: () => <Button variant="ghost" size="sm" icon={<IconDotsCircleHorizontal size={16} stroke={1.5} />} aria-label="More actions" />
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
}`,...(de=(ce=w.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var me,ue,pe;k.parameters={...k.parameters,docs:{...(me=k.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: function HideSelectAllExample() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable hideSelectAll selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />;
  }
}`,...(pe=(ue=k.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var be,ye,ge;S.parameters={...S.parameters,docs:{...(be=S.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" rowHeight="56px" />
}`,...(ge=(ye=S.parameters)==null?void 0:ye.docs)==null?void 0:ge.source}}};var xe,he,ve;f.parameters={...f.parameters,docs:{...(xe=f.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" expandedContent={row => <div className="px-4 py-3 bg-[var(--color-surface-subtle)] text-body-md text-[var(--color-text-muted)]">
          <div className="flex gap-6">
            <span>Email: {row.email}</span>
            <span>Role: {row.role}</span>
            <span>Created: {row.createdAt}</span>
          </div>
        </div>} />
}`,...(ve=(he=f.parameters)==null?void 0:he.docs)==null?void 0:ve.source}}};var Ce,we,ke;K.parameters={...K.parameters,docs:{...(Ce=K.parameters)==null?void 0:Ce.docs,source:{originalSource:'{\n  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" resizable columnResizeMode="onChange" onColumnResize={(key, width) => console.log(`${key}: ${width}px`)} />\n}',...(ke=(we=K.parameters)==null?void 0:we.docs)==null?void 0:ke.source}}};var Se,fe,Ke;z.parameters={...z.parameters,docs:{...(Se=z.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" resizable minColumnWidth={100} />
}`,...(Ke=(fe=z.parameters)==null?void 0:fe.docs)==null?void 0:Ke.source}}};const Ge=["Default","WithCustomRendering","Selectable","Sortable","WithActions","RowClickable","Empty","Scrollable","ColumnAlignment","Resizable","ResizableWithSelection","ComplexExample","HideSelectAll","CustomRowHeight","ExpandedContent","ResizeModeOnChange","MinColumnWidth"];export{h as ColumnAlignment,w as ComplexExample,S as CustomRowHeight,d as Default,g as Empty,f as ExpandedContent,k as HideSelectAll,z as MinColumnWidth,v as Resizable,C as ResizableWithSelection,K as ResizeModeOnChange,y as RowClickable,x as Scrollable,u as Selectable,p as Sortable,b as WithActions,m as WithCustomRendering,Ge as __namedExportsOrder,qe as default};
