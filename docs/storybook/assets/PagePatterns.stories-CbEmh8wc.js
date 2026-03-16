import{j as e,r as h}from"./iframe-iHQO5Mqm.js";import{P as $,I as X}from"./PageShell-DzSWYca1.js";import{P as w}from"./PageHeader-C96XxNEs.js";import{E as q}from"./EmptyState-DkOsoHSh.js";import{T as Q}from"./Table-ILr629vn.js";import{L as S}from"./ListToolbar-CJFPmr4m.js";import{P as Y}from"./Pagination-CjNkkT32.js";import{B as s}from"./Button-9zQlOYxA.js";import{S as ee}from"./SearchInput-7bfaQ1GZ.js";import{S as v}from"./StatusIndicator-BNTz6X4B.js";import{T as ae,a as te,b as p,c as C}from"./Tabs-BYunixt7.js";import{D as n}from"./DetailHeader-CLf93ZXL.js";import{S as a}from"./SectionCard-5h9Pp3cU.js";import{I as x}from"./InfoBox-X7eTQtaA.js";import{V as l}from"./Stack-CS-kulzC.js";import{I as re,a as W}from"./IconTerminal2-cL0QBtDT.js";import{C as se}from"./ContextMenu-B_O4Lzgo.js";import{I as oe}from"./IconChevronDown-LyXUQX2K.js";import{I as ne}from"./IconEdit-CSXljq5-.js";import{I}from"./IconPlus-6YPJMn77.js";import{I as J}from"./IconDatabase-D24hvDMS.js";import{I as ie}from"./IconPlayerStop-BgsAb6ZW.js";import{I as le}from"./IconTrash-V9FplMLj.js";import{I as ce}from"./IconDownload-DGxMlxxg.js";import{T as de}from"./TopBar-6dsyANcS.js";import{B as me}from"./Breadcrumb-Dvo34dWp.js";import{T as pe}from"./TabBar-1wbPtY0m.js";import{S as xe}from"./SNBMenuItem-DvHa9FoJ.js";import{I as ue}from"./IconServer-VY-q2olf.js";import{a as be,I as je}from"./IconShield-CXlsucnT.js";import{I as ge}from"./IconSettings-D0BAVBr7.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CEVQAvfZ.js";import"./cn-8AORBNJN.js";import"./Checkbox-DP42stgX.js";import"./IconMinus-B--iY0Bg.js";import"./IconCheck-ai78HtyZ.js";import"./IconChevronUp-DKe8af00.js";import"./Chip-bNT7XFRE.js";import"./IconX-gJXINq1T.js";import"./IconChevronLeft-D-wv1f6G.js";import"./IconChevronRight-Ctj-S6VH.js";import"./IconSearch-BO6ufcCM.js";import"./IconTool-B1HFVtUT.js";import"./IconAlertCircle-xIuC-r38.js";import"./IconAlertTriangle-C3nCRCP9.js";import"./chunk-JZWAC4HX-em8q0N27.js";import"./Tooltip-C1upJdm8.js";import"./index-HVRJ0oH1.js";import"./IconInfoCircle-Bf4MTjPJ.js";import"./IconCopy-BfwpXdAX.js";import"./IconLayoutSidebar-CSvDlQF8.js";import"./IconSquare-A_p-XpCT.js";const wa={title:"Patterns/Page Patterns",parameters:{layout:"fullscreen",docs:{description:{component:`
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
        `}}},tags:["autodocs"]};function ve({isOpen:t,onToggle:r,selectedMenu:i,onSelectMenu:d}){const m=[{id:"instances",icon:e.jsx(ue,{size:22,stroke:1.5}),label:"Instances"},{id:"volumes",icon:e.jsx(J,{size:22,stroke:1.5}),label:"Volumes"},{id:"networks",icon:e.jsx(be,{size:22,stroke:1.5}),label:"Networks"},{id:"security",icon:e.jsx(je,{size:22,stroke:1.5}),label:"Security Groups"},{id:"dns",icon:e.jsx(X,{size:22,stroke:1.5}),label:"DNS Zones"},{id:"settings",icon:e.jsx(ge,{size:22,stroke:1.5}),label:"Settings"}];return e.jsxs("div",{className:"fixed top-0 bottom-0 left-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col z-10",style:{width:t?240:40},children:[e.jsx("div",{className:"w-[40px] flex flex-col items-center pt-[var(--primitive-spacing-2)] gap-[var(--primitive-spacing-1)] shrink-0",children:m.map(o=>e.jsx(xe,{icon:o.icon,isSelected:i===o.id,onClick:()=>d(o.id)},o.id))}),t&&e.jsxs("div",{className:"absolute left-[40px] top-0 bottom-0 w-[200px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] pt-[var(--primitive-spacing-4)] px-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-heading-h7 text-[var(--color-text-muted)] uppercase px-[var(--primitive-spacing-2)] mb-[var(--primitive-spacing-2)]",children:"Resources"}),e.jsx("nav",{className:"flex flex-col gap-[var(--primitive-spacing-0-5)]",children:m.map(o=>e.jsx("button",{onClick:()=>d(o.id),className:`text-left px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md rounded-[var(--primitive-radius-md)] transition-colors ${i===o.id?"bg-[var(--color-surface-hover)] text-[var(--color-text-default)] font-medium":"text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"}`,children:o.label},o.id))})]})]})}function f({children:t,breadcrumbItems:r,tabs:i,activeTab:d,onTabChange:m,onTabClose:o,onTabAdd:Z}){var D,k;const[c,y]=h.useState(!0),[O,V]=h.useState(((D=r[r.length-1])==null?void 0:D.label.toLowerCase().replace(/\s+/g,""))||"instances"),K=c?240:40,P=i||[{id:"main",label:((k=r[r.length-1])==null?void 0:k.label)||"Tab",closable:!1}],_=d||P[0].id;return e.jsx($,{sidebar:e.jsx(ve,{isOpen:c,onToggle:()=>y(!c),selectedMenu:O,onSelectMenu:V}),sidebarWidth:K,tabBar:e.jsx(pe,{tabs:P,activeTab:_,onTabChange:m||(()=>{}),onTabClose:o,onTabAdd:Z,showWindowControls:!1}),topBar:e.jsx(de,{showSidebarToggle:!c,onSidebarToggle:()=>y(!c),showNavigation:!0,onBack:()=>{},onForward:()=>{},breadcrumb:e.jsx(me,{items:r})}),children:t})}const T=[{id:"1",name:"web-server-01",status:"active",type:"Medium",region:"us-east-1",createdAt:"Jan 10, 2026 01:17:01"},{id:"2",name:"db-server-01",status:"active",type:"Large",region:"us-east-1",createdAt:"Jan 9, 2026 18:04:44"},{id:"3",name:"cache-01",status:"building",type:"Small",region:"eu-west-1",createdAt:"Jan 10, 2026 01:17:01"},{id:"4",name:"worker-01",status:"error",type:"XLarge",region:"ap-northeast-1",createdAt:"Jan 8, 2026 11:51:27"},{id:"5",name:"api-gateway",status:"active",type:"Medium",region:"us-east-1",createdAt:"Jan 7, 2026 04:38:10"}],he=[{key:"status",label:"Status",width:60,align:"center",render:(t,r)=>e.jsx(v,{status:r.status,layout:"icon-only"})},{key:"name",label:"Name",flex:2,minWidth:120,sortable:!0,render:t=>e.jsx("span",{className:"text-label-lg text-[var(--color-action-primary)] hover:underline cursor-pointer",children:t})},{key:"type",label:"Type",flex:1,minWidth:80,sortable:!0},{key:"region",label:"Region",flex:1,minWidth:100},{key:"createdAt",label:"Created at",flex:1,minWidth:100,align:"right",sortable:!0,render:t=>t==null?void 0:t.replace(/\s+\d{2}:\d{2}:\d{2}$/,"")}];function fe(){const[t,r]=h.useState([]);return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Instances"}],children:e.jsxs(l,{gap:3,children:[e.jsx(w,{title:"Instances",actions:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(I,{size:12,stroke:1.5}),children:"Create Instance"})}),e.jsx(S,{primaryActions:e.jsxs(S.Actions,{children:[e.jsx(ee,{placeholder:"Search by name",size:"sm",className:"w-[240px]"}),e.jsx(s,{variant:"secondary",size:"sm",icon:e.jsx(ce,{size:12,stroke:1.5}),"aria-label":"Download"})]}),bulkActions:e.jsxs(S.Actions,{children:[e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(W,{size:12,stroke:1.5}),disabled:t.length===0,children:"Start"}),e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(ie,{size:12,stroke:1.5}),disabled:t.length===0,children:"Stop"}),e.jsx(s,{variant:"muted",size:"sm",leftIcon:e.jsx(le,{size:12,stroke:1.5}),disabled:t.length===0,children:"Delete"})]})}),e.jsx(Y,{currentPage:1,totalPages:1,onPageChange:()=>{},totalItems:T.length,selectedCount:t.length}),e.jsx(Q,{columns:he,data:T,rowKey:"id",selectable:!0,selectedKeys:t,onSelectionChange:r,emptyMessage:"No instances found"})]})})}const u={render:()=>e.jsx(fe,{}),parameters:{docs:{description:{story:"\n**List Page 패턴** — 가장 일반적인 CRUD 리스트 페이지.\n\n구성요소 순서:\n1. `PageHeader` — 제목 + Create 버튼\n2. `ListToolbar` — 검색 + 필터 + 벌크 액션\n3. `Pagination` — 페이지네이션 + 설정\n4. `Table` — 데이터 테이블 (선택 가능)\n        "}}}};function Se(){const[t,r]=h.useState("overview"),i=[{id:"edit",label:"Edit",onClick:()=>{}},{id:"resize",label:"Resize",onClick:()=>{}},{id:"snapshot",label:"Create Snapshot",onClick:()=>{},divider:!0},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}];return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Instances",href:"#"},{label:"web-server-01"}],tabs:[{id:"instances",label:"Instances",closable:!1},{id:"web-server",label:"web-server-01",closable:!0}],activeTab:"web-server",children:e.jsxs(l,{gap:6,children:[e.jsxs(n,{children:[e.jsx(n.Title,{children:"web-server-01"}),e.jsxs(n.Actions,{children:[e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(re,{size:12,stroke:1.5}),children:"Console"}),e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(W,{size:12,stroke:1.5}),children:"Start"}),e.jsx(se,{items:i,trigger:"click",children:e.jsx(s,{variant:"secondary",size:"sm",rightIcon:e.jsx(oe,{size:12,stroke:1.5}),children:"More Actions"})})]}),e.jsxs(n.InfoGrid,{children:[e.jsx(n.InfoCard,{label:"Status",status:"active",value:""}),e.jsx(n.InfoCard,{label:"ID",value:"inst-a1b2c3d4",copyable:!0}),e.jsx(n.InfoCard,{label:"Flavor",value:"Medium (4 vCPU, 8GB)"}),e.jsx(n.InfoCard,{label:"Created at",value:"Jan 10, 2026 14:30"})]})]}),e.jsxs(ae,{value:t,onChange:r,variant:"underline",size:"sm",children:[e.jsxs(te,{children:[e.jsx(p,{value:"overview",children:"Overview"}),e.jsx(p,{value:"network",children:"Network"}),e.jsx(p,{value:"storage",children:"Storage"}),e.jsx(p,{value:"monitoring",children:"Monitoring"})]}),e.jsx(C,{value:"overview",className:"pt-0",children:e.jsxs(l,{gap:4,className:"pt-4",children:[e.jsxs(a,{children:[e.jsx(a.Header,{title:"Basic Information",actions:e.jsx(s,{variant:"secondary",size:"sm",leftIcon:e.jsx(ne,{size:12,stroke:1.5}),children:"Edit"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Name",value:"web-server-01"}),e.jsx(a.DataRow,{label:"Image",value:"Ubuntu 22.04 LTS"}),e.jsx(a.DataRow,{label:"Flavor",value:"Medium (4 vCPU, 8GB RAM)"}),e.jsx(a.DataRow,{label:"Region",value:"us-east-1"}),e.jsx(a.DataRow,{label:"Key Pair",value:"my-keypair"})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Fixed IP",value:"10.20.30.40"}),e.jsx(a.DataRow,{label:"Floating IP",value:"203.0.113.10"}),e.jsx(a.DataRow,{label:"Security Group",value:"default",isLink:!0,linkHref:"#"})]})]})]})}),e.jsx(C,{value:"network",className:"pt-0",children:e.jsx(l,{gap:4,className:"pt-4",children:e.jsxs(a,{children:[e.jsx(a.Header,{title:"Network Interfaces"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"Network",value:"default-network",isLink:!0,linkHref:"#"}),e.jsx(a.DataRow,{label:"Subnet",value:"10.20.30.0/24"}),e.jsx(a.DataRow,{label:"MAC Address",value:"fa:16:3e:aa:bb:cc"})]})]})})})]})]})})}const b={render:()=>e.jsx(Se,{}),parameters:{docs:{description:{story:`
**Detail Page 패턴** — 리소스 상세 정보 페이지.

구성요소 순서:
1. \`DetailHeader\` — 제목 + 액션 버튼 + InfoGrid
2. \`Tabs\` (underline) — 섹션별 탭 네비게이션
3. \`SectionCard\` — 정보 그룹 (Header + DataRow)
        `}}}};function Ie(){return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"DNS Zones"}],children:e.jsxs(l,{gap:3,children:[e.jsx(w,{title:"DNS Zones",actions:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(I,{size:12,stroke:1.5}),children:"Create Zone"})}),e.jsx(q,{icon:e.jsx(J,{size:48,stroke:1}),title:"No DNS zones found",description:"Create your first DNS zone to manage domain records.",action:e.jsx(s,{variant:"primary",size:"md",leftIcon:e.jsx(I,{size:12,stroke:1.5}),children:"Create Zone"})})]})})}const j={render:()=>e.jsx(Ie,{}),parameters:{docs:{description:{story:"\n**Empty State 패턴** — 데이터가 없을 때의 페이지.\n\n구성요소:\n1. `PageHeader` — 제목 + Create 버튼\n2. `EmptyState` — 아이콘 + 제목 + 설명 + 액션 버튼\n\n`EmptyState`의 `variant`는 `card`(기본값)와 `inline` 중 선택 가능.\n        "}}}};function we(){return e.jsx(f,{breadcrumbItems:[{label:"Proj-1",href:"#"},{label:"Dashboard"}],children:e.jsxs(l,{gap:4,children:[e.jsx(w,{title:"Dashboard"}),e.jsxs("div",{className:"flex items-stretch gap-[12px] w-full",children:[e.jsx(x,{label:"Total Instances",value:24,tooltip:"Total number of compute instances.",className:"flex-1"}),e.jsx(x,{label:"Running",value:18,tooltip:"Currently running instances.",className:"flex-1"}),e.jsx(x,{label:"Stopped",value:4,tooltip:"Stopped instances.",className:"flex-1"}),e.jsx(x,{label:"Errors",value:2,tooltip:"Instances with errors.",className:"flex-1"})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Recent Activity",actions:e.jsx(s,{variant:"ghost",size:"sm",children:"View All"})}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"web-server-01",value:e.jsx(v,{status:"active",label:"Started"})}),e.jsx(a.DataRow,{label:"db-server-02",value:e.jsx(v,{status:"error",label:"Failed"})}),e.jsx(a.DataRow,{label:"worker-03",value:e.jsx(v,{status:"building",label:"Building"})})]})]}),e.jsxs(a,{children:[e.jsx(a.Header,{title:"Resource Usage"}),e.jsxs(a.Content,{children:[e.jsx(a.DataRow,{label:"vCPUs Used",value:"48 / 128"}),e.jsx(a.DataRow,{label:"Memory Used",value:"96 GB / 256 GB"}),e.jsx(a.DataRow,{label:"Storage Used",value:"1.2 TB / 5 TB"}),e.jsx(a.DataRow,{label:"Floating IPs",value:"6 / 20"})]})]})]})})}const g={render:()=>e.jsx(we,{}),parameters:{docs:{description:{story:`
**Dashboard 패턴** — 개요/대시보드 페이지.

구성요소:
1. \`PageHeader\` — 제목
2. \`InfoBox\` — 주요 메트릭 카드 (가로 배치)
3. \`SectionCard\` — 최근 활동, 리소스 사용량 등
        `}}}};var z,N,R;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(R=(N=u.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};var E,B,A;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(A=(B=b.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var H,L,M;j.parameters={...j.parameters,docs:{...(H=j.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(M=(L=j.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var U,G,F;g.parameters={...g.parameters,docs:{...(U=g.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <DashboardPageExample />,
  parameters: {
    docs: {
      description: {
        story: \`
**Dashboard 패턴** — 개요/대시보드 페이지.

구성요소:
1. \\\`PageHeader\\\` — 제목
2. \\\`InfoBox\\\` — 주요 메트릭 카드 (가로 배치)
3. \\\`SectionCard\\\` — 최근 활동, 리소스 사용량 등
        \`
      }
    }
  }
}`,...(F=(G=g.parameters)==null?void 0:G.docs)==null?void 0:F.source}}};const ya=["ListPage","DetailPage","EmptyStatePage","DashboardPage"];export{g as DashboardPage,b as DetailPage,j as EmptyStatePage,u as ListPage,ya as __namedExportsOrder,wa as default};
