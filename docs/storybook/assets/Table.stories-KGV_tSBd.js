import{r as y,j as e}from"./iframe-DKmDJy9M.js";import{C as W}from"./Checkbox-uIPtlQYI.js";import{c as ye}from"./createReactComponent-DB1W9lnY.js";import{I as ze}from"./IconChevronUp-BdMlYp_W.js";import{I as Ue}from"./IconChevronDown-Dv8nCHc9.js";import{B as h}from"./Button-BjRr-4Eh.js";import{B as he}from"./Badge-C_Vf5MbZ.js";import{I as Ee}from"./IconEdit-BlS-DZQj.js";import{I as $e}from"./IconTrash-C_xd3OON.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./IconMinus-BpH-r4mg.js";import"./IconCheck-CawMNeCL.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-1"}],["path",{d:"M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-2"}]],Ie=ye("outline","dots-vertical","DotsVertical",Be);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M8 9l4 -4l4 4",key:"svg-0"}],["path",{d:"M16 15l-4 4l-4 -4",key:"svg-1"}]],_e=ye("outline","selector","Selector",De);function c({columns:l,data:r,rowKey:a,selectable:d=!1,selectedKeys:i=[],onSelectionChange:n,hideSelectAll:z=!1,stickyHeader:U=!1,maxHeight:v,onRowClick:E,emptyMessage:fe="No data",className:ve="",rowHeight:I}){const[g,D]=y.useState(null),[x,$]=y.useState(null),_=y.useCallback(t=>typeof a=="function"?a(t):String(t[a]),[a]),we=t=>{g===t?x==="asc"?$("desc"):x==="desc"&&(D(null),$(null)):(D(t),$("asc"))},p=y.useMemo(()=>!g||!x?r:[...r].sort((t,s)=>{const m=t[g],u=s[g];if(m===u)return 0;if(m==null)return 1;if(u==null)return-1;const o=m<u?-1:1;return x==="asc"?o:-o}),[r,g,x]),ke=t=>{i.includes(t)?n==null||n(i.filter(s=>s!==t)):n==null||n([...i,t])},je=()=>{const t=p.map(_);i.length===p.length&&p.length>0?n==null||n([]):n==null||n(t)},Ce=p.length>0&&i.length===p.length,Ne=i.length>0&&i.length<p.length,Te=t=>g!==t?e.jsx(_e,{size:14,stroke:1,className:"text-[var(--color-text-disabled)]"}):x==="asc"?e.jsx(ze,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}):e.jsx(Ue,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}),Se=U||!!v,V=t=>{const s={};return t.width?(s.width=t.width,s.flexShrink=0):(s.flex=t.flex??1,s.minWidth=0),t.minWidth&&(s.minWidth=t.minWidth),t.maxWidth&&(s.maxWidth=t.maxWidth),s};return e.jsx("div",{className:`flex flex-col gap-[var(--table-row-gap)] ${ve}`,style:I?{"--table-row-height":I}:void 0,children:e.jsxs("div",{className:`${v?"overflow-y-auto":""}`,style:{...v?{maxHeight:v}:{}},children:[e.jsxs("div",{className:`
            flex items-stretch
            min-h-[var(--table-row-height)]
            bg-[var(--table-header-bg)]
            border border-[var(--color-border-default)]
            rounded-[var(--table-row-radius)]
            ${Se?"sticky top-0 z-10":""}
          `,children:[d&&e.jsx("div",{className:`
                shrink-0
                flex items-center
                w-[var(--table-checkbox-width)]
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
              `,children:!z&&e.jsx(W,{checked:Ce,indeterminate:Ne,onChange:je,"aria-label":"Select all rows"})}),l.map((t,s)=>{const u=s===0?d:!0;return e.jsx("div",{className:`
                  flex items-center
                  px-[var(--table-cell-padding-x)]
                  py-[var(--table-header-padding-y)]
                  text-[length:var(--table-header-font-size)]
                  leading-[var(--table-line-height)]
                  font-medium
                  text-[var(--color-text-default)]
                  min-w-0
                  overflow-hidden
                  ${t.align==="center"?"text-center":t.align==="right"?"text-right":"text-left"}
                  ${t.sortable?"cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors":""}
                  ${u?"border-l border-[var(--color-border-default)]":""}
                `,style:V(t),onClick:t.sortable?()=>we(t.key):void 0,title:t.label,children:t.headerRender?t.headerRender():e.jsxs("div",{className:`
                      flex items-center gap-1 w-full min-w-0
                      ${t.align==="center"?"justify-center":t.align==="right"?"justify-end flex-row-reverse":"justify-start"}
                    `,children:[e.jsx("span",{className:"whitespace-nowrap truncate",title:t.label,children:t.label}),t.sortable&&e.jsx("span",{className:"flex-shrink-0",children:Te(t.key)})]})},t.key)})]}),e.jsx("div",{className:"flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)]",children:p.length===0?e.jsx("div",{className:`
                px-[var(--table-cell-padding-x)]
                py-[var(--table-empty-padding-y)]
                text-center
                text-[length:var(--table-font-size)]
                text-[var(--color-text-muted)]
                border border-[var(--color-border-default)]
                rounded-[var(--table-row-radius)]
                bg-[var(--color-surface-default)]
              `,children:fe}):p.map((t,s)=>{const m=_(t),u=i.includes(m);return e.jsxs("div",{className:`
                    flex items-stretch
                    h-[var(--table-row-height)]
                    rounded-[var(--table-row-radius)]
                    transition-all
                    hover:bg-[var(--table-row-hover-bg)]
                    border border-[var(--color-border-default)]
                    ${u?"bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]":"bg-[var(--color-surface-default)]"}
                    ${E?"cursor-pointer":""}
                  `,onClick:E?()=>E(t,s):void 0,children:[d&&e.jsx("div",{className:`
                        shrink-0
                        flex items-center
                        w-[var(--table-checkbox-width)]
                        px-[var(--table-cell-padding-x)]
                        py-[var(--table-cell-padding-y)]
                      `,onClick:o=>o.stopPropagation(),children:e.jsx(W,{checked:u,onChange:()=>ke(m),"aria-label":`Select row ${s+1}`})}),l.map((o,Ae)=>{const Ke=Ae===0?d:!0,B=t[o.key],Re=typeof B=="string"||typeof B=="number"?String(B):void 0;return e.jsx("div",{className:`
                          flex items-center
                          px-[var(--table-cell-padding-x)]
                          py-[var(--table-cell-padding-y)]
                          text-[length:var(--table-font-size)]
                          leading-[var(--table-line-height)]
                          text-[var(--color-text-default)]
                          min-w-0
                          overflow-hidden
                          ${o.align==="center"?"justify-center text-center":o.align==="right"?"justify-end text-right":"justify-start text-left"}
                          ${Ke?"border-l border-transparent":""}
                        `,style:V(o),title:Re,children:o.render?o.render(t[o.key],t,s):e.jsx("span",{className:`truncate w-full ${o.align==="center"?"text-center":o.align==="right"?"text-right":""}`,children:t[o.key]})},o.key)})]},m)})})]})})}c.__docgenInfo={description:"",methods:[],displayName:"Table",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"TableColumn",elements:[{name:"T"}],raw:"TableColumn<T>"}],raw:"TableColumn<T>[]"},description:""},data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},rowKey:{required:!0,tsType:{name:"union",raw:"keyof T | ((row: T) => string)",elements:[{name:"T"},{name:"unknown"}]},description:""},selectable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},selectedKeys:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}},onSelectionChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(keys: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"keys"}],return:{name:"void"}}},description:""},hideSelectAll:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},stickyHeader:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxHeight:{required:!1,tsType:{name:"string"},description:""},onRowClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: T, rowIndex: number) => void",signature:{arguments:[{type:{name:"T"},name:"row"},{type:{name:"number"},name:"rowIndex"}],return:{name:"void"}}},description:""},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No data'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},rowHeight:{required:!1,tsType:{name:"string"},description:""}}};const b=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"active",createdAt:"2024-01-15"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"active",createdAt:"2024-01-20"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"inactive",createdAt:"2024-02-01"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"pending",createdAt:"2024-02-10"},{id:"5",name:"Charlie Davis",email:"charlie@example.com",role:"Viewer",status:"active",createdAt:"2024-02-15"}],f=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status"}],Ze={title:"Components/Table",component:c,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},w={render:()=>e.jsx(c,{columns:f,data:b,rowKey:"id"})},k={render:()=>{const l=[{key:"name",label:"Name",width:"180px"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"status",label:"Status",width:"100px",align:"center",render:r=>{const d={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}}[r];return e.jsx(he,{theme:d.theme,type:"subtle",size:"sm",children:d.label})}}];return e.jsx(c,{columns:l,data:b,rowKey:"id"})}},j={render:function(){const[r,a]=y.useState([]);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(c,{columns:f,data:b,rowKey:"id",selectable:!0,selectedKeys:r,onSelectionChange:a}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",r.length>0?r.join(", "):"None"]})]})}},C={render:()=>{const l=[{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"createdAt",label:"Created At",sortable:!0,width:"120px"}];return e.jsx(c,{columns:l,data:b,rowKey:"id"})}},N={render:()=>{const l=[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",width:"100px"},{key:"actions",label:"",width:"100px",align:"right",render:(r,a)=>e.jsxs("div",{className:"flex items-center justify-end gap-1",children:[e.jsx(h,{variant:"ghost",size:"sm",icon:e.jsx(Ee,{size:14}),"aria-label":`Edit ${a.name}`}),e.jsx(h,{variant:"ghost",size:"sm",icon:e.jsx($e,{size:14}),"aria-label":`Delete ${a.name}`})]})}];return e.jsx(c,{columns:l,data:b,rowKey:"id"})}},T={render:()=>{const l=r=>{alert(`Clicked on: ${r.name}`)};return e.jsx(c,{columns:f,data:b,rowKey:"id",onRowClick:l})}},S={render:()=>e.jsx(c,{columns:f,data:[],rowKey:"id",emptyMessage:"No users found. Create your first user to get started."})},A={render:()=>{const l=Array.from({length:20},(r,a)=>({id:String(a+1),name:`User ${a+1}`,email:`user${a+1}@example.com`,role:a%3===0?"Admin":a%3===1?"Editor":"Viewer",status:a%3===0?"active":a%3===1?"inactive":"pending",createdAt:"2024-01-01"}));return e.jsx(c,{columns:f,data:l,rowKey:"id",maxHeight:"300px",stickyHeader:!0})}},K={render:()=>{const l=[{key:"name",label:"Name (Left)",align:"left"},{key:"email",label:"Email (Center)",align:"center"},{key:"role",label:"Role (Right)",align:"right"}];return e.jsx(c,{columns:l,data:b,rowKey:"id"})}},R={render:function(){const[r,a]=y.useState([]),d=[{key:"name",label:"User",width:"200px",sortable:!0,render:(i,n)=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-medium",children:i}),e.jsx("span",{className:"text-[11px] text-[var(--color-text-muted)]",children:n.email})]})},{key:"role",label:"Role",width:"100px",sortable:!0},{key:"status",label:"Status",width:"100px",align:"center",render:i=>{const n={active:{theme:"green",label:"Active"},inactive:{theme:"gray",label:"Inactive"},pending:{theme:"yellow",label:"Pending"}},{theme:z,label:U}=n[i];return e.jsx(he,{theme:z,type:"subtle",size:"sm",dot:!0,children:U})}},{key:"createdAt",label:"Created",width:"120px",sortable:!0,render:i=>e.jsx("span",{className:"text-[var(--color-text-muted)]",children:i})},{key:"actions",label:"",width:"48px",align:"center",render:()=>e.jsx(h,{variant:"ghost",size:"sm",icon:e.jsx(Ie,{size:14}),"aria-label":"More actions"})}];return e.jsxs("div",{className:"flex flex-col gap-4",children:[r.length>0&&e.jsxs("div",{className:"flex items-center gap-2 p-2 bg-[var(--color-surface-subtle)] rounded",children:[e.jsxs("span",{className:"text-sm",children:[r.length," selected"]}),e.jsx(h,{variant:"ghost",size:"sm",onClick:()=>a([]),children:"Clear"}),e.jsx(h,{variant:"danger",size:"sm",children:"Delete Selected"})]}),e.jsx(c,{columns:d,data:b,rowKey:"id",selectable:!0,selectedKeys:r,onSelectionChange:a})]})}};var q,M,H;w.parameters={...w.parameters,docs:{...(q=w.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />
}`,...(H=(M=w.parameters)==null?void 0:M.docs)==null?void 0:H.source}}};var P,F,L;k.parameters={...k.parameters,docs:{...(P=k.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
        return <Badge theme={config.theme} type="subtle" size="sm">{config.label}</Badge>;
      }
    }];
    return <Table columns={columns} data={sampleUsers} rowKey="id" />;
  }
}`,...(L=(F=k.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var J,O,G;j.parameters={...j.parameters,docs:{...(J=j.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    return <div className="flex flex-col gap-4">
        <Table columns={basicColumns} data={sampleUsers} rowKey="id" selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(G=(O=j.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var Q,X,Y;C.parameters={...C.parameters,docs:{...(Q=C.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(Y=(X=C.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,te;N.parameters={...N.parameters,docs:{...(Z=N.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(te=(ee=N.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,re,se;T.parameters={...T.parameters,docs:{...(ae=T.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => {
    const handleRowClick = (row: User) => {
      alert(\`Clicked on: \${row.name}\`);
    };
    return <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />;
  }
}`,...(se=(re=T.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var le,ne,oe;S.parameters={...S.parameters,docs:{...(le=S.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <Table columns={basicColumns} data={[]} rowKey="id" emptyMessage="No users found. Create your first user to get started." />
}`,...(oe=(ne=S.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ie,ce,de;A.parameters={...A.parameters,docs:{...(ie=A.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(de=(ce=A.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var me,ue,pe;K.parameters={...K.parameters,docs:{...(me=K.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(pe=(ue=K.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var be,ge,xe;R.parameters={...R.parameters,docs:{...(be=R.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: function ComplexTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const complexColumns: TableColumn<User>[] = [{
      key: 'name',
      label: 'User',
      width: '200px',
      sortable: true,
      render: (value, row) => <div className="flex flex-col">
            <span className="font-medium">{value}</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{row.email}</span>
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
        return <Badge theme={theme} type="subtle" size="sm" dot>{label}</Badge>;
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
}`,...(xe=(ge=R.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};const et=["Default","WithCustomRendering","Selectable","Sortable","WithActions","RowClickable","Empty","Scrollable","ColumnAlignment","ComplexExample"];export{K as ColumnAlignment,R as ComplexExample,w as Default,S as Empty,T as RowClickable,A as Scrollable,j as Selectable,C as Sortable,N as WithActions,k as WithCustomRendering,et as __namedExportsOrder,Ze as default};
