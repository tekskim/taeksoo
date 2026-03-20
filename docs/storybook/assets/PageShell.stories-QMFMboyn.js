import{j as e,r as n}from"./iframe-ko1KmZFS.js";import{P as b,I as F}from"./PageShell-nlq0hKL3.js";import{V as f}from"./Stack-Dh9f_Si_.js";import{P as h}from"./PageHeader-z9S3jx4_.js";import{B as m}from"./Button-BQge8bfe.js";import{I as S}from"./IconPlus-DF_1TQez.js";import{T as E}from"./Table-C-XfKmty.js";import{B as v}from"./Breadcrumb-CeobdIkv.js";import{B as H}from"./Badge-Co-C5Vm0.js";import{I as K}from"./IconDownload-CIoQP3hf.js";import{S as _}from"./StatusIndicator-hwAPf0Zl.js";import{S as $}from"./SNBMenuItem-CV4-76rX.js";import{I as L}from"./IconRocket-D_Zfhs0X.js";import{a as U,I as q}from"./IconShield-CTEB-lyA.js";import{I as G}from"./IconDatabase-CEk_lbIp.js";import{I as J}from"./IconSettings-R0QLs4Fv.js";import{T}from"./TopBar-B8fjWply.js";import{T as M}from"./TabBar-D1Zr5Hy1.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-B-brzlrB.js";import"./cn-BMXv33oC.js";import"./Checkbox-B3ACmwwV.js";import"./IconMinus-BIcNQHsQ.js";import"./IconCheck-BA2DoG5q.js";import"./IconChevronUp-D3wAWK98.js";import"./IconChevronDown-BvjhRmI4.js";import"./chunk-JZWAC4HX-7wHwC4xL.js";import"./IconChevronRight-BpkBDwLd.js";import"./Tooltip-BMQcszHH.js";import"./index-ChYZSdsP.js";import"./IconTool-D7d82R25.js";import"./IconEdit-DzucwhfQ.js";import"./IconAlertCircle-GZBv8N7A.js";import"./IconAlertTriangle-RSM7ayVf.js";import"./IconLayoutSidebar-CEHHU3dX.js";import"./IconX-CZRrzHtO.js";import"./IconSquare-dffHLv7B.js";const De={title:"Layout/PageShell",component:b,parameters:{layout:"fullscreen",docs:{description:{component:`
## PageShell 컴포넌트

페이지 셸 레이아웃 컴포넌트. **Sidebar + TabBar + TopBar + Content** 영역을 래핑합니다.

모든 페이지에서 반복되는 \`fixed inset-0\` + Sidebar + main 구조를 추상화합니다.
사이드바 상태는 페이지에서 관리하고, \`sidebarWidth\`를 계산하여 전달합니다.

### 구성 요소
- **Sidebar**: SNBMenuItem 기반의 좁은 사이드 네비게이션 (40px icon / 240px expanded)
- **TabBar**: 브라우저 스타일 탭바 (탭 추가/닫기/드래그)
- **TopBar**: 사이드바 토글 + 네비게이션 + Breadcrumb + Actions
- **Content**: 페이지 본문 영역

### 사용 예시
\`\`\`tsx
const [sidebarOpen, setSidebarOpen] = useState(true);
const sidebarWidth = sidebarOpen ? 240 : 40;

<PageShell
  sidebar={<ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
  sidebarWidth={sidebarWidth}
  tabBar={<TabBar tabs={tabs} activeTab={activeTabId} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={addNewTab} onTabReorder={moveTab} />}
  topBar={<TopBar showSidebarToggle={!sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} breadcrumb={<Breadcrumb items={[...]} />} actions={<>...</>} />}
>
  <VStack gap={3}>
    <PageHeader title="Pods" actions={...} />
    <Table ... />
  </VStack>
</PageShell>
\`\`\`
        `}}},tags:["autodocs"]};function j({isOpen:a,onToggle:t,selectedMenu:s,onSelectMenu:o}){const i=[{id:"pods",icon:e.jsx(F,{size:22,stroke:1.5}),label:"Pods"},{id:"deployments",icon:e.jsx(L,{size:22,stroke:1.5}),label:"Deployments"},{id:"services",icon:e.jsx(U,{size:22,stroke:1.5}),label:"Services"},{id:"security",icon:e.jsx(q,{size:22,stroke:1.5}),label:"Security"},{id:"storage",icon:e.jsx(G,{size:22,stroke:1.5}),label:"Storage"},{id:"settings",icon:e.jsx(J,{size:22,stroke:1.5}),label:"Settings"}];return e.jsxs("div",{className:"fixed top-0 bottom-0 left-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col z-10",style:{width:a?240:40},children:[e.jsx("div",{className:"w-[40px] flex flex-col items-center pt-[var(--primitive-spacing-2)] gap-[var(--primitive-spacing-1)] shrink-0",children:i.map(r=>e.jsx($,{icon:r.icon,isSelected:s===r.id,onClick:()=>o(r.id)},r.id))}),a&&e.jsxs("div",{className:"absolute left-[40px] top-0 bottom-0 w-[200px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] pt-[var(--primitive-spacing-4)] px-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-label-md font-semibold uppercase text-[var(--color-text-muted)] uppercase px-[var(--primitive-spacing-2)] mb-[var(--primitive-spacing-2)]",children:"Workloads"}),e.jsx("nav",{className:"flex flex-col gap-[var(--primitive-spacing-0-5)]",children:i.map(r=>e.jsx("button",{onClick:()=>o(r.id),className:`text-left px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md rounded-[var(--primitive-radius-md)] transition-colors ${s===r.id?"bg-[var(--color-surface-hover)] text-[var(--color-text-default)] font-medium":"text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"}`,children:r.label},r.id))})]})]})}const g=[{id:"1",name:"nginx-deployment-7fb96",namespace:"default",status:"active",restarts:0,age:"2d 14h"},{id:"2",name:"redis-master-0",namespace:"default",status:"active",restarts:1,age:"5d 3h"},{id:"3",name:"api-server-6b8c4",namespace:"production",status:"building",restarts:0,age:"1h 23m"},{id:"4",name:"worker-job-x9k2l",namespace:"batch",status:"error",restarts:5,age:"12h"},{id:"5",name:"frontend-app-3d9f1",namespace:"production",status:"active",restarts:0,age:"3d 8h"}],D=[{key:"name",header:"Name",sortable:!0},{key:"namespace",header:"Namespace",sortable:!0},{key:"status",header:"Status",align:"center",render:a=>e.jsx(_,{status:a.status,label:a.status.charAt(0).toUpperCase()+a.status.slice(1)})},{key:"restarts",header:"Restarts",align:"right"},{key:"age",header:"Age",align:"right"}];function Q(){const[a,t]=n.useState(!0),[s,o]=n.useState("pods"),i=a?240:40,[r,B]=n.useState([{id:"pods",label:"Pods",closable:!1},{id:"nginx",label:"nginx-deployment-7fb96",closable:!0}]),[k,u]=n.useState("pods"),A=d=>{B(x=>x.filter(V=>V.id!==d)),k===d&&u(r[0].id)},R=()=>{const d=`tab-${Date.now()}`;B(x=>[...x,{id:d,label:"New Tab",closable:!0}]),u(d)};return e.jsx(b,{sidebar:e.jsx(j,{isOpen:a,onToggle:()=>t(!a),selectedMenu:s,onSelectMenu:o}),sidebarWidth:i,tabBar:e.jsx(M,{tabs:r,activeTab:k,onTabChange:u,onTabClose:A,onTabAdd:R,showWindowControls:!1}),topBar:e.jsx(T,{showSidebarToggle:!a,onSidebarToggle:()=>t(!a),showNavigation:!0,onBack:()=>{},onForward:()=>{},breadcrumb:e.jsx(v,{items:[{label:"default-cluster",href:"#"},{label:"Pods"}]}),actions:e.jsx(m,{variant:"ghost",size:"sm",icon:e.jsx(K,{size:14,stroke:1.5}),"aria-label":"Download"})}),children:e.jsxs(f,{gap:3,children:[e.jsx(h,{title:"Pods",titleExtra:e.jsx(H,{variant:"info",size:"sm",children:g.length}),actions:e.jsx(m,{variant:"primary",size:"md",leftIcon:e.jsx(S,{size:12,stroke:1.5}),children:"Create Pod"})}),e.jsx(E,{columns:D,data:g,rowKey:"id",selectable:!0})]})})}const l={render:()=>e.jsx(Q,{})};function X(){const[a,t]=n.useState(!1),[s,o]=n.useState("pods"),i=a?240:40;return e.jsx(b,{sidebar:e.jsx(j,{isOpen:a,onToggle:()=>t(!a),selectedMenu:s,onSelectMenu:o}),sidebarWidth:i,tabBar:e.jsx(M,{tabs:[{id:"pods",label:"Pods",closable:!1}],activeTab:"pods",onTabChange:()=>{},showWindowControls:!1}),topBar:e.jsx(T,{showSidebarToggle:!a,onSidebarToggle:()=>t(!a),showNavigation:!0,onBack:()=>{},onForward:()=>{},breadcrumb:e.jsx(v,{items:[{label:"default-cluster",href:"#"},{label:"Pods"}]})}),children:e.jsxs(f,{gap:3,children:[e.jsx(h,{title:"Pods",actions:e.jsx(m,{variant:"primary",size:"md",leftIcon:e.jsx(S,{size:12,stroke:1.5}),children:"Create Pod"})}),e.jsx(E,{columns:D,data:g,rowKey:"id",selectable:!0})]})})}const c={render:()=>e.jsx(X,{}),parameters:{docs:{description:{story:"사이드바가 접힌 상태 (40px). TopBar의 사이드바 토글 버튼이 표시됩니다."}}}};function Y(){const[a,t]=n.useState(!0),[s,o]=n.useState("pods"),i=a?240:40;return e.jsx(b,{sidebar:e.jsx(j,{isOpen:a,onToggle:()=>t(!a),selectedMenu:s,onSelectMenu:o}),sidebarWidth:i,topBar:e.jsx(T,{showSidebarToggle:!a,onSidebarToggle:()=>t(!a),showNavigation:!0,onBack:()=>{},onForward:()=>{},breadcrumb:e.jsx(v,{items:[{label:"default-cluster",href:"#"},{label:"Services"}]})}),children:e.jsxs(f,{gap:3,children:[e.jsx(h,{title:"Services",actions:e.jsx(m,{variant:"primary",size:"md",leftIcon:e.jsx(S,{size:12,stroke:1.5}),children:"Create Service"})}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"TabBar 없이 TopBar와 콘텐츠만 표시하는 레이아웃입니다."})]})})}const p={render:()=>e.jsx(Y,{}),parameters:{docs:{description:{story:"TabBar를 사용하지 않는 경우. TopBar + Content만 표시됩니다."}}}};var y,w,C;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <DefaultExample />
}`,...(C=(w=l.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var I,P,O;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <CollapsedSidebarExample />,
  parameters: {
    docs: {
      description: {
        story: '사이드바가 접힌 상태 (40px). TopBar의 사이드바 토글 버튼이 표시됩니다.'
      }
    }
  }
}`,...(O=(P=c.parameters)==null?void 0:P.docs)==null?void 0:O.source}}};var N,z,W;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <WithoutTabBarExample />,
  parameters: {
    docs: {
      description: {
        story: 'TabBar를 사용하지 않는 경우. TopBar + Content만 표시됩니다.'
      }
    }
  }
}`,...(W=(z=p.parameters)==null?void 0:z.docs)==null?void 0:W.source}}};const Ae=["Default","CollapsedSidebar","WithoutTabBar"];export{c as CollapsedSidebar,l as Default,p as WithoutTabBar,Ae as __namedExportsOrder,De as default};
