import{j as e,r as h}from"./iframe-CsZHcOUf.js";import{P as X,I as $}from"./PageShell-DMm4LXA8.js";import{P as w}from"./PageHeader-C8xeg9Me.js";import{E as q}from"./EmptyState-C55amz6u.js";import{T as Q}from"./Table-BgAmSw5t.js";import{L as S}from"./ListToolbar-raanC7CA.js";import{P as Y}from"./Pagination-DLzgU-bT.js";import{B as s}from"./Button-B8wqjk7E.js";import{S as ee}from"./SearchInput-BD4B1_Ww.js";import{S as v}from"./StatusIndicator-BzhIDnZM.js";import{T as ae,a as te,b as u,c as k}from"./Tabs-B_sDLYCk.js";import{D as i}from"./DetailHeader-DC_5prRO.js";import{S as a}from"./SectionCard-CI3YLutI.js";import{M as d}from"./MetricCard-BsYrJ1-y.js";import{V as l}from"./Stack-CKOQlJBR.js";import{I as re,a as W}from"./IconTerminal2-BZYkZEJD.js";import{C as se}from"./ContextMenu-UwelfmN4.js";import{I as oe}from"./IconChevronDown-CoAmE0_C.js";import{I as ie}from"./IconEdit-DUgdQ0nE.js";import{I as y}from"./IconPlus-BJ75MqOC.js";import{I as J}from"./IconDatabase-CcTKjoRU.js";import{I as ne}from"./IconPlayerStop-3scifs0K.js";import{I as le}from"./IconTrash-KHfvkqwk.js";import{I as ce}from"./IconDownload-Dvqe30jT.js";import{T as de}from"./TopBar-CZTl7YrO.js";import{B as me}from"./Breadcrumb-xbVaccRB.js";import{T as pe}from"./TabBar-rFbJ0aKg.js";import{S as ue}from"./SNBMenuItem-Bgn1cSA1.js";import{I as xe}from"./IconServer-rrFOm8wf.js";import{a as be,I as je}from"./IconShield-BLg6Vxo2.js";import{I as ge}from"./IconSettings-C06uiwkf.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-C2Lh4gVY.js";import"./Checkbox-BxGfG1OC.js";import"./cn-CshvV4Tc.js";import"./IconMinus-DPC1OfOV.js";import"./IconCheck-VSfqs-sU.js";import"./IconChevronUp-Bv0ZBqhr.js";import"./Chip-Dxi17M5y.js";import"./IconX-DSnl1fNg.js";import"./IconChevronLeft-nzKjfkZz.js";import"./IconChevronRight-CHyVK_ct.js";import"./IconSearch-CsEnqrzh.js";import"./IconTool-BXtxWviy.js";import"./IconCircleX-Dl1ofNRH.js";import"./IconAlertTriangle-DcxzAe_n.js";import"./Tooltip-D9kQ8ijK.js";import"./index-rV59UgPg.js";import"./IconHelpCircle-36MxwV7v.js";import"./IconCopy-CF-5ZGvq.js";import"./chunk-JZWAC4HX-BkQowvzV.js";import"./IconLayoutSidebar-CxX1k2qr.js";import"./IconSquare-DVon0w2T.js";const wa={title:"Patterns/Page Patterns",parameters:{layout:"fullscreen",docs:{description:{component:`
## TDS 페이지 패턴 가이드

모든 CRUD 페이지는 아래 패턴 중 하나를 따릅니다.

### 패턴 목록
1. **List Page** — 리소스 목록 (Table + Toolbar + Pagination)
2. **Detail Page** — 리소스 상세 (DetailHeader + SectionCard)
3. **Empty State Page** — 데이터 없음 상태
4. **Dashboard Page** — 메트릭/차트 대시보드

### 공통 레이아웃 구성
- **PageShell**: 전체 레이아웃 래퍼
- **SNBMenuItem**: 좁은 사이드바 네비게이션
- **TabBar**: 브라우저 스타일 탭바
- **TopBar** + **Breadcrumb**: 상단 네비게이션
        `}}},tags:["autodocs"]};function ve({isOpen:t,onToggle:r,selectedMenu:n,onSelectMenu:m}){const p=[{id:"instances",icon:e.jsx(xe,{size:22,stroke:1.5}),label:"Instances"},{id:"volumes",icon:e.jsx(J,{size:22,stroke:1.5}),label:"Volumes"},{id:"networks",icon:e.jsx(be,{size:22,stroke:1.5}),label:"Networks"},{id:"security",icon:e.jsx(je,{size:22,stroke:1.5}),label:"Security Groups"},{id:"dns",icon:e.jsx($,{size:22,stroke:1.5}),label:"DNS Zones"},{id:"settings",icon:e.jsx(ge,{size:22,stroke:1.5}),label:"Settings"}];return e.jsxs("div",{className:"fixed top-0 bottom-0 left-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col z-10",style:{width:t?240:40},children:[e.jsx("div",{className:"w-[40px] flex flex-col items-center pt-[var(--primitive-spacing-2)] gap-[var(--primitive-spacing-1)] shrink-0",children:p.map(o=>e.jsx(ue,{icon:o.icon,isSelected:n===o.id,onClick:()=>m(o.id)},o.id))}),t&&e.jsxs("div",{className:"absolute left-[40px] top-0 bottom-0 w-[200px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] pt-[var(--primitive-spacing-4)] px-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-heading-h7 text-[var(--color-text-muted)] uppercase px-[var(--primitive-spacing-2)] mb-[var(--primitive-spacing-2)]",children:"Resources"}),e.jsx("nav",{className:"flex flex-col gap-[var(--primitive-spacing-0-5)]",children:p.map(o=>e.jsx("button",{onClick:()=>m(o.id),className:`text-left px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md rounded-[var(--primitive-radius-md)] transition-colors ${n===o.id?"bg-[var(--color-surface-hover)] text-[var(--color-text-default)] font-medium":"text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"}`,children:o.label},o.id))})]})]})}function f({children:t,breadcrumbItems:r,tabs:n,activeTab:m,onTabChange:p,onTabClose:o,onTabAdd:Z}){var D,C;const[c,I]=h.useState(!0),[O,V]=h.useState(((D=r[r.length-1])==null?void 0:D.label.toLowerCase().replace(/\s+/g,""))||"instances"),K=c?240:40,P=n||[{id:"main",label:((C=r[r.length-1])==null?void 0:C.label)||"Tab",closable:!1}],_=m||P[0].id;return e.jsx(X,{sidebar:e.jsx(ve,{isOpen:c,onToggle:()=>I(!c),selectedMenu:O,onSelectMenu:V}),sidebarWidth:K,tabBar:e.jsx(pe,{tabs:P,activeTab:_,onTabChange:p||(()=>{}),onTabClose:o,onTabAdd:Z,showWindowControls:!1}),topBar:e.jsx(de,{showSidebarToggle:!c,onSidebarToggle:()=>I(!c),showNavigation:!0,onBack:()=>{},onForward:()=>{},breadcrumb:e.jsx(me,{items:r})}),children:t})}const T=[{id:"1",name:"web-server-01",status:"active",type:"Medium",region:"us-east-1",createdAt:"Jan 10, 2026"},{id:"2",name:"db-server-01",status:"active",type:"Large",region:"us-east-1",createdAt:"Jan 9, 2026"},{id:"3",name:"cache-01",status:"building",type:"Small",region:"eu-west-1",createdAt:"Jan 10, 2026"},{id:"4",name:"worker-01",status:"error",type:"XLarge",region:"ap-northeast-1",createdAt:"Jan 8, 2026"},{id:"5",name:"api-gateway",status:"active",type:"Medium",region:"us-east-1",createdAt:"Jan 7, 2026"}],he=[{key:"status",label:"Status",width:60,align:"center",render:(t,r)=>e.jsx(v,{status:r.status,layout:"icon-only"})},{key:"name",label:"Name",flex:2,minWidth:120,sortable:!0,render:t=>e.jsx("span",{className:"text-label-lg text-[var(--color-action-primary)] hover:underline cursor-pointer",children:t})},{key:"type",label:"Type",flex:1,minWidth:80,sortable:!0},{key:"region",label:"Region",flex:1,minWidth:100},{key:"createdAt",label:"Created at",flex:1,minWidth:100,align:"right",sortable:!0}];function fe(){const[t,r]=h.useState([]);return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Instances"}],children:e.jsxs(l,{gap:3,children:[e.jsx(w,{title:"Instances",actions:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(y,{size:12,stroke:1.5}),children:"Create Instance"})}),e.jsx(S,{primaryActions:e.jsxs(S.Actions,{children:[e.jsx(ee,{placeholder:"Search by name",size:"sm",className:"w-[240px]"}),e.jsx(s,{variant:"secondary",size:"sm",icon:e.jsx(ce,{size:12,stroke:1.5}),"aria-label":"Download"})]}),bulkActions:e.jsxs(S.Actions,{children:[e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(W,{size:12,stroke:1.5}),disabled:t.length===0,children:"Start"}),e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(ne,{size:12,stroke:1.5}),disabled:t.length===0,children:"Stop"}),e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(le,{size:12,stroke:1.5}),disabled:t.length===0,children:"Delete"})]})}),e.jsx(Y,{currentPage:1,totalPages:1,onPageChange:()=>{},totalItems:T.length,selectedCount:t.length}),e.jsx(Q,{columns:he,data:T,rowKey:"id",selectable:!0,selectedKeys:t,onSelectionChange:r,emptyMessage:"No instances found"})]})})}const x={render:()=>e.jsx(fe,{}),parameters:{docs:{description:{story:"\n**List Page 패턴** — 가장 일반적인 CRUD 리스트 페이지.\n\n구성요소 순서:\n1. `PageHeader` — 제목 + Create 버튼\n2. `ListToolbar` — 검색 + 필터 + 벌크 액션\n3. `Pagination` — 페이지네이션 + 설정\n4. `Table` — 데이터 테이블 (선택 가능)\n        "}}}};function Se(){const[t,r]=h.useState("overview"),n=[{id:"edit",label:"Edit",onClick:()=>{}},{id:"resize",label:"Resize",onClick:()=>{}},{id:"snapshot",label:"Create Snapshot",onClick:()=>{},divider:!0},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}];return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Instances",href:"#"},{label:"web-server-01"}],tabs:[{id:"instances",label:"Instances",closable:!1},{id:"web-server",label:"web-server-01",closable:!0}],activeTab:"web-server",children:e.jsxs(l,{gap:6,children:[e.jsxs(i,{children:[e.jsx(i.Title,{children:"web-server-01"}),e.jsxs(i.Actions,{children:[e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(re,{size:12,stroke:1.5}),children:"Console"}),e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(W,{size:12,stroke:1.5}),children:"Start"}),e.jsx(se,{items:n,trigger:"click",children:e.jsx(s,{variant:"secondary",size:"sm",rightIcon:e.jsx(oe,{size:12,stroke:1.5}),children:"More Actions"})})]}),e.jsxs(i.InfoGrid,{children:[e.jsx(i.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(i.InfoCard,{label:"ID",value:"inst-a1b2c3d4",copyable:!0}),e.jsx(i.InfoCard,{label:"Flavor",value:"Medium (4 vCPU, 8GB)"}),e.jsx(i.InfoCard,{label:"Created at",value:"Jan 10, 2026 14:30"})]})]}),e.jsxs(ae,{value:t,onChange:r,variant:"underline",size:"sm",children:[e.jsxs(te,{children:[e.jsx(u,{value:"overview",children:"Overview"}),e.jsx(u,{value:"network",children:"Network"}),e.jsx(u,{value:"storage",children:"Storage"}),e.jsx(u,{value:"monitoring",children:"Monitoring"})]}),e.jsx(k,{value:"overview",className:"pt-0",children:e.jsxs(l,{gap:4,className:"pt-4",children:[e.jsxs(a,{children:[e.jsx(a.Header,{title:"Basic Information",actions:e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(ie,{size:12,stroke:1.5}),children:"Edit"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"web-server-01"}),e.jsx(a.DataRow,{label:"Image",value:"Ubuntu 22.04 LTS"}),e.jsx(a.DataRow,{label:"Flavor",value:"Medium (4 vCPU, 8GB RAM)"}),e.jsx(a.DataRow,{label:"Region",value:"us-east-1"}),e.jsx(a.DataRow,{label:"Key Pair",value:"my-keypair"})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Fixed IP",value:"10.20.30.40"}),e.jsx(a.DataRow,{label:"Floating IP",value:"203.0.113.10"}),e.jsx(a.DataRow,{label:"Security Group",value:"default",isLink:!0,linkHref:"#"})]})]})]})}),e.jsx(k,{value:"network",className:"pt-0",children:e.jsx(l,{gap:4,className:"pt-4",children:e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network Interfaces"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Network",value:"default-network",isLink:!0,linkHref:"#"}),e.jsx(a.DataRow,{label:"Subnet",value:"10.20.30.0/24"}),e.jsx(a.DataRow,{label:"MAC Address",value:"fa:16:3e:aa:bb:cc"})]})]})})})]})]})})}const b={render:()=>e.jsx(Se,{}),parameters:{docs:{description:{story:`
**Detail Page 패턴** — 리소스 상세 정보 페이지.

구성요소 순서:
1. \`DetailHeader\` — 제목 + 액션 버튼 + InfoGrid
2. \`Tabs\` (underline) — 섹션별 탭 네비게이션
3. \`SectionCard\` — 정보 그룹 (Header + DataRow)
        `}}}};function ye(){return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"DNS Zones"}],children:e.jsxs(l,{gap:3,children:[e.jsx(w,{title:"DNS Zones",actions:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(y,{size:12,stroke:1.5}),children:"Create Zone"})}),e.jsx(q,{icon:e.jsx(J,{size:48,stroke:1}),title:"No DNS zones found",description:"Create your first DNS zone to manage domain records.",action:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(y,{size:12,stroke:1.5}),children:"Create Zone"})})]})})}const j={render:()=>e.jsx(ye,{}),parameters:{docs:{description:{story:"\n**Empty State 패턴** — 데이터가 없을 때의 페이지.\n\n구성요소:\n1. `PageHeader` — 제목 + Create 버튼\n2. `EmptyState` — 아이콘 + 제목 + 설명 + 액션 버튼\n\n`EmptyState`의 `variant`는 `card`(기본값)와 `inline` 중 선택 가능.\n        "}}}};function we(){return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Dashboard"}],children:e.jsxs(l,{gap:4,children:[e.jsx(w,{title:"Dashboard"}),e.jsxs(d.Group,{children:[e.jsx(d,{title:"Total Instances",value:24,tooltip:"Total number of compute instances."}),e.jsx(d,{title:"Running",value:18,tooltip:"Currently running instances."}),e.jsx(d,{title:"Stopped",value:4,tooltip:"Stopped instances."}),e.jsx(d,{title:"Errors",value:2,tooltip:"Instances with errors."})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Recent Activity",actions:e.jsx(s,{variant:"ghost",size:"sm",children:"View All"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"web-server-01",value:e.jsx(v,{status:"active",label:"Started"})}),e.jsx(a.DataRow,{label:"db-server-02",value:e.jsx(v,{status:"error",label:"Failed"})}),e.jsx(a.DataRow,{label:"worker-03",value:e.jsx(v,{status:"building",label:"Building"})})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Resource Usage"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"vCPUs Used",value:"48 / 128"}),e.jsx(a.DataRow,{label:"Memory Used",value:"96 GB / 256 GB"}),e.jsx(a.DataRow,{label:"Storage Used",value:"1.2 TB / 5 TB"}),e.jsx(a.DataRow,{label:"Floating IPs",value:"6 / 20"})]})]})]})})}const g={render:()=>e.jsx(we,{}),parameters:{docs:{description:{story:`
**Dashboard 패턴** — 개요/대시보드 페이지.

구성요소:
1. \`PageHeader\` — 제목
2. \`MetricCard.Group\` — 주요 메트릭 카드
3. \`SectionCard\` — 최근 활동, 리소스 사용량 등
        `}}}};var z,R,N;x.parameters={...x.parameters,docs:{...(z=x.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <ListPageExample />,
  parameters: {
    docs: {
      description: {
        story: \`
**List Page 패턴** — 가장 일반적인 CRUD 리스트 페이지.

구성요소 순서:
1. \\\`PageHeader\\\` — 제목 + Create 버튼
2. \\\`ListToolbar\\\` — 검색 + 필터 + 벌크 액션
3. \\\`Pagination\\\` — 페이지네이션 + 설정
4. \\\`Table\\\` — 데이터 테이블 (선택 가능)
        \`
      }
    }
  }
}`,...(N=(R=x.parameters)==null?void 0:R.docs)==null?void 0:N.source}}};var E,B,A;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <DetailPageExample />,
  parameters: {
    docs: {
      description: {
        story: \`
**Detail Page 패턴** — 리소스 상세 정보 페이지.

구성요소 순서:
1. \\\`DetailHeader\\\` — 제목 + 액션 버튼 + InfoGrid
2. \\\`Tabs\\\` (underline) — 섹션별 탭 네비게이션
3. \\\`SectionCard\\\` — 정보 그룹 (Header + DataRow)
        \`
      }
    }
  }
}`,...(A=(B=b.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var H,M,L;j.parameters={...j.parameters,docs:{...(H=j.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <EmptyStatePageExample />,
  parameters: {
    docs: {
      description: {
        story: \`
**Empty State 패턴** — 데이터가 없을 때의 페이지.

구성요소:
1. \\\`PageHeader\\\` — 제목 + Create 버튼
2. \\\`EmptyState\\\` — 아이콘 + 제목 + 설명 + 액션 버튼

\\\`EmptyState\\\`의 \\\`variant\\\`는 \\\`card\\\`(기본값)와 \\\`inline\\\` 중 선택 가능.
        \`
      }
    }
  }
}`,...(L=(M=j.parameters)==null?void 0:M.docs)==null?void 0:L.source}}};var G,U,F;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <DashboardPageExample />,
  parameters: {
    docs: {
      description: {
        story: \`
**Dashboard 패턴** — 개요/대시보드 페이지.

구성요소:
1. \\\`PageHeader\\\` — 제목
2. \\\`MetricCard.Group\\\` — 주요 메트릭 카드
3. \\\`SectionCard\\\` — 최근 활동, 리소스 사용량 등
        \`
      }
    }
  }
}`,...(F=(U=g.parameters)==null?void 0:U.docs)==null?void 0:F.source}}};const Ia=["ListPage","DetailPage","EmptyStatePage","DashboardPage"];export{g as DashboardPage,b as DetailPage,j as EmptyStatePage,x as ListPage,Ia as __namedExportsOrder,wa as default};
