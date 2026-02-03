import{r as h,j as t}from"./iframe-CqQbtNpW.js";import{C as M}from"./Checkbox-DoOalT7_.js";import{c as Ee}from"./createReactComponent-Dcnxk0R3.js";import{I as $e}from"./IconChevronUp-BHzCmBEz.js";import{I as Ie}from"./IconChevronDown-DdBMsWJh.js";import{B as f}from"./Button-CJ3Zgj2Z.js";import{B as fe}from"./Badge-D_5jWKJM.js";import{I as Be}from"./IconDotsVertical-DZSHmVns.js";import{I as De}from"./IconEdit-DaRVQSHK.js";import{I as Ve}from"./IconTrash-D_-jQ3Ix.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./IconMinus-D_E2T9QN.js";import"./IconCheck-BImhwLkT.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M8 9l4 -4l4 4",key:"svg-0"}],["path",{d:"M16 15l-4 4l-4 -4",key:"svg-1"}]],_e=Ee("outline","selector","Selector",We);function c({columns:l,data:n,rows:a,rowKey:m,selectable:d=!1,selectedKeys:i=[],onSelectionChange:o,hideSelectAll:U=!1,stickyHeader:ve=!1,maxHeight:w,onRowClick:E,emptyMessage:we="No data",className:ke="",rowHeight:D}){const $=n??a??[],V=l.map(e=>({...e,label:e.label||e.header||""})),[y,W]=h.useState(null),[g,I]=h.useState(null),_=h.useCallback(e=>typeof m=="function"?m(e):String(e[m]),[m]),je=e=>{y===e?g==="asc"?I("desc"):g==="desc"&&(W(null),I(null)):(W(e),I("asc"))},b=h.useMemo(()=>!y||!g?$:[...$].sort((e,r)=>{const u=e[y],p=r[y];if(u===p)return 0;if(u==null)return 1;if(p==null)return-1;const s=u<p?-1:1;return g==="asc"?s:-s}),[$,y,g]),Ce=e=>{i.includes(e)?o==null||o(i.filter(r=>r!==e)):o==null||o([...i,e])},Te=()=>{const e=b.map(_);i.length===b.length&&b.length>0?o==null||o([]):o==null||o(e)},Ne=b.length>0&&i.length===b.length,Se=i.length>0&&i.length<b.length,Ae=e=>y!==e?t.jsx(_e,{size:14,stroke:1,className:"text-[var(--color-text-disabled)]"}):g==="asc"?t.jsx($e,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}):t.jsx(Ie,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}),Ke=ve||!!w,q=e=>{const r={};return e.width?(r.width=e.width,r.flexShrink=0,r.flexGrow=0):(r.flex=e.flex??1,r.minWidth=0),e.minWidth&&(r.minWidth=e.minWidth),e.maxWidth&&(r.maxWidth=e.maxWidth),r};return t.jsx("div",{className:`flex flex-col gap-[var(--table-row-gap)] ${ke}`,style:D?{"--table-row-height":D}:void 0,children:t.jsx("div",{className:`overflow-x-auto ${w?"overflow-y-auto":""}`,style:{...w?{maxHeight:w}:{}},children:t.jsxs("div",{className:"min-w-fit w-full",children:[t.jsxs("div",{className:`
            flex items-stretch
            min-h-[var(--table-row-height)]
            w-full
            bg-[var(--table-header-bg)]
            border border-[var(--color-border-default)]
            rounded-[var(--table-row-radius)]
            ${Ke?"sticky top-0 z-10":""}
          `,children:[d&&t.jsx("div",{className:`
                shrink-0
                flex items-center
                w-[var(--table-checkbox-width)]
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
              `,children:!U&&t.jsx(M,{checked:Ne,indeterminate:Se,onChange:Te,"aria-label":"Select all rows"})}),V.map((e,r)=>{const p=r===0?d:!0;return t.jsx("div",{className:`
                  flex items-center
                  px-[var(--table-cell-padding-x)]
                  py-[var(--table-header-padding-y)]
                  text-[length:var(--table-header-font-size)]
                  leading-[var(--table-line-height)]
                  font-medium
                  text-[var(--color-text-default)]
                  min-w-0
                  overflow-hidden
                  ${e.align==="center"?"text-center":e.align==="right"?"text-right":"text-left"}
                  ${e.sortable?"cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors":""}
                  ${p?"border-l border-[var(--color-border-default)]":""}
                `,style:q(e),onClick:e.sortable?()=>je(e.key):void 0,title:e.label,children:e.headerRender?e.headerRender():t.jsxs("div",{className:`
                      flex items-center gap-1 w-full min-w-0
                      ${e.align==="center"?"justify-center":e.align==="right"?"justify-end flex-row-reverse":"justify-start"}
                    `,children:[t.jsx("span",{className:"whitespace-nowrap truncate",title:e.label,children:e.label}),e.sortable&&t.jsx("span",{className:"flex-shrink-0",children:Ae(e.key)})]})},e.key)})]}),t.jsx("div",{className:"flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full",children:b.length===0?t.jsx("div",{className:`
                px-[var(--table-cell-padding-x)]
                py-[var(--table-empty-padding-y)]
                text-center
                text-[length:var(--table-font-size)]
                text-[var(--color-text-muted)]
                border border-[var(--color-border-default)]
                rounded-[var(--table-row-radius)]
                bg-[var(--color-surface-default)]
              `,children:we}):b.map((e,r)=>{const u=_(e),p=i.includes(u);return t.jsxs("div",{className:`
                    flex items-stretch
                    min-h-[var(--table-row-height)]
                    w-full
                    rounded-[var(--table-row-radius)]
                    transition-all
                    hover:bg-[var(--table-row-hover-bg)]
                    border border-[var(--color-border-default)]
                    ${p?"bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]":"bg-[var(--color-surface-default)]"}
                    ${E?"cursor-pointer":""}
                  `,onClick:E?()=>E(e,r):void 0,children:[d&&t.jsx("div",{className:`
                        shrink-0
                        flex items-center
                        w-[var(--table-checkbox-width)]
                        px-[var(--table-cell-padding-x)]
                        py-[var(--table-cell-padding-y)]
                      `,onClick:s=>s.stopPropagation(),children:t.jsx(M,{checked:p,onChange:()=>Ce(u),"aria-label":`Select row ${r+1}`})}),V.map((s,Re)=>{const ze=Re===0?d:!0,B=e[s.key],Ue=typeof B=="string"||typeof B=="number"?String(B):void 0;return t.jsx("div",{className:`
                          flex items-center
                          px-[var(--table-cell-padding-x)]
                          py-[var(--table-cell-padding-y)]
                          text-[length:var(--table-font-size)]
                          leading-[var(--table-line-height)]
                          text-[var(--color-text-default)]
                          min-w-0
                          overflow-hidden
                          ${s.align==="center"?"justify-center text-center":s.align==="right"?"justify-end text-right":"justify-start text-left"}
                          ${ze?"border-l border-transparent":""}
                        `,style:q(s),title:Ue,children:s.render?s.render(e[s.key],e,r):t.jsx("span",{className:`truncate w-full ${s.align==="center"?"text-center":s.align==="right"?"text-right":""}`,children:e[s.key]})},s.key)})]},u)})})]})})})}c.__docgenInfo={description:"",methods:[],displayName:"Table",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"TableColumn",elements:[{name:"T"}],raw:"TableColumn<T>"}],raw:"TableColumn<T>[]"},description:""},data:{required:!1,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:"Table data"},rows:{required:!1,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:"@deprecated Use data instead (thaki-ui compatibility)"},rowKey:{required:!0,tsType:{name:"union",raw:"keyof T | ((row: T) => string)",elements:[{name:"T"},{name:"unknown"}]},description:""},selectable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},selectedKeys:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}},onSelectionChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(keys: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"keys"}],return:{name:"void"}}},description:""},hideSelectAll:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},stickyHeader:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxHeight:{required:!1,tsType:{name:"string"},description:""},onRowClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: T, rowIndex: number) => void",signature:{arguments:[{type:{name:"T"},name:"row"},{type:{name:"number"},name:"rowIndex"}],return:{name:"void"}}},description:""},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No data'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},rowHeight:{required:!1,tsType:{name:"string"},description:""}}};const x=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"active",createdAt:"2024-01-15"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"active",createdAt:"2024-01-20"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"inactive",createdAt:"2024-02-01"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"pending",createdAt:"2024-02-10"},{id:"5",name:"Charlie Davis",email:"charlie@example.com",role:"Viewer",status:"active",createdAt:"2024-02-15"}],v=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status"}],at={title:"Components/Table",component:c,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},k={render:()=>t.jsx(c,{columns:v,data:x,rowKey:"id"})},j={render:()=>{const l=[{key:"name",label:"Name",width:"180px"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"status",label:"Status",width:"100px",align:"center",render:n=>{const m={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}}[n];return t.jsx(fe,{theme:m.theme,type:"subtle",size:"sm",children:m.label})}}];return t.jsx(c,{columns:l,data:x,rowKey:"id"})}},C={render:function(){const[n,a]=h.useState([]);return t.jsxs("div",{className:"flex flex-col gap-4",children:[t.jsx(c,{columns:v,data:x,rowKey:"id",selectable:!0,selectedKeys:n,onSelectionChange:a}),t.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",n.length>0?n.join(", "):"None"]})]})}},T={render:()=>{const l=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"createdAt",label:"Created At",sortable:!0,width:"120px"}];return t.jsx(c,{columns:l,data:x,rowKey:"id"})}},N={render:()=>{const l=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"actions",label:"",width:"100px",align:"right",render:(n,a)=>t.jsxs("div",{className:"flex items-center justify-end gap-1",children:[t.jsx(f,{variant:"ghost",size:"sm",icon:t.jsx(De,{size:14}),"aria-label":`Edit ${a.name}`}),t.jsx(f,{variant:"ghost",size:"sm",icon:t.jsx(Ve,{size:14}),"aria-label":`Delete ${a.name}`})]})}];return t.jsx(c,{columns:l,data:x,rowKey:"id"})}},S={render:()=>{const l=n=>{alert(`Clicked on: ${n.name}`)};return t.jsx(c,{columns:v,data:x,rowKey:"id",onRowClick:l})}},A={render:()=>t.jsx(c,{columns:v,data:[],rowKey:"id",emptyMessage:"No users found. Create your first user to get started."})},K={render:()=>{const l=Array.from({length:20},(n,a)=>({id:String(a+1),name:`User ${a+1}`,email:`user${a+1}@example.com`,role:a%3===0?"Admin":a%3===1?"Editor":"Viewer",status:a%3===0?"active":a%3===1?"inactive":"pending",createdAt:"2024-01-01"}));return t.jsx(c,{columns:v,data:l,rowKey:"id",maxHeight:"300px",stickyHeader:!0})}},R={render:()=>{const l=[{key:"name",label:"Name (Left)",align:"left"},{key:"email",label:"Email (Center)",align:"center"},{key:"role",label:"Role (Right)",align:"right"}];return t.jsx(c,{columns:l,data:x,rowKey:"id"})}},z={render:function(){const[n,a]=h.useState([]),m=[{key:"name",label:"User",width:"200px",sortable:!0,render:(d,i)=>t.jsxs("div",{className:"flex flex-col",children:[t.jsx("span",{className:"font-medium",children:d}),t.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:i.email})]})},{key:"role",label:"Role",width:"100px",sortable:!0},{key:"status",label:"Status",width:"100px",align:"center",render:d=>{const i={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}},{theme:o,label:U}=i[d];return t.jsx(fe,{theme:o,type:"subtle",size:"sm",dot:!0,children:U})}},{key:"createdAt",label:"Created",width:"120px",sortable:!0,render:d=>t.jsx("span",{className:"text-[var(--color-text-muted)]",children:d})},{key:"actions",label:"",width:"48px",align:"center",render:()=>t.jsx(f,{variant:"ghost",size:"sm",icon:t.jsx(Be,{size:14}),"aria-label":"More actions"})}];return t.jsxs("div",{className:"flex flex-col gap-4",children:[n.length>0&&t.jsxs("div",{className:"flex items-center gap-2 p-2 bg-[var(--color-surface-subtle)] rounded",children:[t.jsxs("span",{className:"text-sm",children:[n.length," selected"]}),t.jsx(f,{variant:"ghost",size:"sm",onClick:()=>a([]),children:"Clear"}),t.jsx(f,{variant:"danger",size:"sm",children:"Delete Selected"})]}),t.jsx(c,{columns:m,data:x,rowKey:"id",selectable:!0,selectedKeys:n,onSelectionChange:a})]})}};var H,P,F;k.parameters={...k.parameters,docs:{...(H=k.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />
}`,...(F=(P=k.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};var L,J,G;j.parameters={...j.parameters,docs:{...(L=j.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(G=(J=j.parameters)==null?void 0:J.docs)==null?void 0:G.source}}};var O,Q,X;C.parameters={...C.parameters,docs:{...(O=C.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <div className="flex flex-col gap-4">
        <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(X=(Q=C.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;T.parameters={...T.parameters,docs:{...(Y=T.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
      label: 'Created At',
      sortable: true,
      width: '120px'
    }];
    return <Table columns={sortableColumns} data={sampleUsers} rowKey="id" />;
  }
}`,...(ee=(Z=T.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,ae,re;N.parameters={...N.parameters,docs:{...(te=N.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
      align: 'right',
      render: (_value, row) => <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" icon={<IconEdit size={14} />} aria-label={\`Edit \${row.name}\`} />
            <Button variant="ghost" size="sm" icon={<IconTrash size={14} />} aria-label={\`Delete \${row.name}\`} />
          </div>
    }];
    return <Table columns={columnsWithActions} data={sampleUsers} rowKey="id" />;
  }
}`,...(re=(ae=N.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var se,le,ne;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const handleRowClick = (row: User) => {
      alert(\`Clicked on: \${row.name}\`);
    };
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />;
  }
}`,...(ne=(le=S.parameters)==null?void 0:le.docs)==null?void 0:ne.source}}};var oe,ie,ce;A.parameters={...A.parameters,docs:{...(oe=A.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={[]} rowKey="id" emptyMessage="No users found. Create your first user to get started." />
}`,...(ce=(ie=A.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var de,me,ue;K.parameters={...K.parameters,docs:{...(de=K.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => {
    const manyUsers = Array.from({
      length: 20
    }, (_, i) => ({
      id: String(i + 1),
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
      status: (i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending') as User['status'],
      createdAt: '2024-01-01'
    }));
    return <Table columns={basicColumns} data={manyUsers} rowKey="id" maxHeight="300px" stickyHeader />;
  }
}`,...(ue=(me=K.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var pe,be,xe;R.parameters={...R.parameters,docs:{...(pe=R.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
      align: 'right'
    }];
    return <Table columns={alignedColumns} data={sampleUsers} rowKey="id" />;
  }
}`,...(xe=(be=R.parameters)==null?void 0:be.docs)==null?void 0:xe.source}}};var ye,ge,he;z.parameters={...z.parameters,docs:{...(ye=z.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: function ComplexTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const complexColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'User',
      width: '200px',
      sortable: true,
      render: (value, row) => <div className="flex flex-col">
            <span className="font-medium">{value}</span>
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
      render: () => <Button variant="ghost" size="sm" icon={<IconDotsVertical size={14} />} aria-label="More actions" />
    }];
    return <div className="flex flex-col gap-4">
        {selectedKeys.length > 0 && <div className="flex items-center gap-2 p-2 bg-[var(--color-surface-subtle)] rounded">
            <span className="text-sm">{selectedKeys.length} selected</span>
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
}`,...(he=(ge=z.parameters)==null?void 0:ge.docs)==null?void 0:he.source}}};const rt=["Default","WithCustomRendering","Selectable","Sortable","WithActions","RowClickable","Empty","Scrollable","ColumnAlignment","ComplexExample"];export{R as ColumnAlignment,z as ComplexExample,k as Default,A as Empty,S as RowClickable,K as Scrollable,C as Selectable,T as Sortable,N as WithActions,j as WithCustomRendering,rt as __namedExportsOrder,at as default};
