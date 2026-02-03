import{r as k,j as a}from"./iframe-DF19JO67.js";import{I as W}from"./IconX-3fVqduwL.js";import{I as oe}from"./IconPlus-BcmJT4zm.js";import{I as ie}from"./IconMinus-Dr6gim1t.js";import{I as le}from"./IconSquare-mp__KNBs.js";import{I as de}from"./IconFile-BWaxZ-2U.js";import{I as ce}from"./IconHome-Cw3KXpNu.js";import{I as be}from"./IconSettings-C_91fDSk.js";import{I as ue}from"./IconFolder-Dvwy81sv.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-D4u5JA0x.js";const u=({tabs:n,activeTab:s,onTabChange:o,onTabClose:t,onTabAdd:l,onTabReorder:d,showAddButton:w=!0,showWindowControls:f=!0,showBottomBorder:D=!0,onMinimize:N,onMaximize:q,onWindowClose:y,className:b=""})=>{const[i,c]=k.useState(null),[p,T]=k.useState(null),S=e=>{o(e)},Z=(e,r)=>{e.stopPropagation(),t==null||t(r)},ee=(e,r)=>{c(r),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",r),requestAnimationFrame(()=>{e.target.style.opacity="0.5"})},ae=e=>{c(null),T(null),e.target.style.opacity="1"},te=(e,r)=>{e.preventDefault(),e.dataTransfer.dropEffect="move",i&&i!==r&&T(r)},ne=()=>{T(null)},re=(e,r)=>{if(e.preventDefault(),T(null),!i||!d)return;const v=n.findIndex(x=>x.id===i),g=n.findIndex(x=>x.id===r);v!==-1&&g!==-1&&v!==g&&d(v,g),c(null)};return a.jsxs("div",{className:`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${D?"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10":""}
        ${b}
      `,children:[a.jsx("div",{className:`
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        `,children:n.map(e=>{const r=e.id===s,v=e.label??e.title??"",g=e.fixed?!1:e.closable!==!1,x=i===e.id,se=p===e.id;return a.jsxs("div",{"data-tab-id":e.id,onClick:()=>S(e.id),draggable:!!d,onDragStart:m=>ee(m,e.id),onDragEnd:ae,onDragOver:m=>te(m,e.id),onDragLeave:ne,onDrop:m=>re(m,e.id),className:`
                group
                relative
                flex items-center
                h-full
                w-[160px]
                min-w-0
                shrink
                px-[var(--tabbar-tab-padding-x)]
                gap-[var(--tabbar-tab-gap)]
                cursor-pointer
                transition-colors duration-[var(--duration-fast)]
                border-r border-[var(--color-border-subtle)]
                ${r?"bg-[var(--color-surface-default)]":"bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]"}
                ${x?"opacity-50":""}
                ${se?"border-l-2 border-l-[var(--color-action-primary)]":""}
              `,children:[r&&a.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20"}),e.icon&&a.jsx("span",{className:`
                  shrink-0
                  ${r?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:e.icon}),a.jsx("span",{className:`
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${r?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:v}),g&&t&&a.jsx("button",{type:"button",onClick:m=>Z(m,e.id),className:`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${r?"text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]":"opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,"aria-label":`Close ${v}`,children:a.jsx(W,{size:12,stroke:1})})]},e.id)})}),w&&l&&a.jsx("button",{type:"button",onClick:l,className:`
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          `,"aria-label":"Add new tab",children:a.jsx(oe,{size:14,stroke:1})}),a.jsx("div",{className:"flex-1"}),f&&a.jsxs("div",{className:"flex items-center gap-1 px-2",children:[a.jsx("button",{type:"button",onClick:N,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:a.jsx(ie,{size:12,stroke:1})}),a.jsx("button",{type:"button",onClick:q,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Maximize",children:a.jsx(le,{size:12,stroke:1})}),a.jsx("button",{type:"button",onClick:y,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-state-danger-bg)]
              hover:text-[var(--color-state-danger-text)]
            `,"aria-label":"Close window",children:a.jsx(W,{size:12,stroke:1})})]})]})};function h(n={}){var y;const{initialTabs:s=[],initialActiveTab:o,onCreateTab:t}=n,[l,d]=k.useState(s),[w,f]=k.useState(o||((y=s[0])==null?void 0:y.id)||"");return{tabs:l,activeTab:w,addTab:b=>{const i=b||(t==null?void 0:t())||{id:`tab-${Date.now()}`,label:"New Tab",closable:!0};return d(c=>[...c,i]),f(i.id),i},closeTab:b=>{d(i=>{const c=i.filter(p=>p.id!==b);if(w===b&&c.length>0){const p=i.findIndex(S=>S.id===b),T=Math.min(p,c.length-1);f(c[T].id)}return c})},selectTab:b=>{f(b)},setTabs:d}}u.__docgenInfo={description:"",methods:[],displayName:"TabBar",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabBarItem"}],raw:"TabBarItem[]"},description:"Tab items"},activeTab:{required:!0,tsType:{name:"string"},description:"Currently active tab id"},onTabChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is selected"},onTabClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is closed"},onTabAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when add button is clicked"},onTabReorder:{required:!1,tsType:{name:"signature",type:"function",raw:"(fromIndex: number, toIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"fromIndex"},{type:{name:"number"},name:"toIndex"}],return:{name:"void"}}},description:"Callback when tabs are reordered via drag and drop"},showAddButton:{required:!1,tsType:{name:"boolean"},description:"Show add button",defaultValue:{value:"true",computed:!1}},showWindowControls:{required:!1,tsType:{name:"boolean"},description:"Show window controls (minimize, maximize, close)",defaultValue:{value:"true",computed:!1}},showBottomBorder:{required:!1,tsType:{name:"boolean"},description:"Show bottom border (default: true)",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when minimize button is clicked"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when maximize button is clicked"},onWindowClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when window close button is clicked"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const Ie={title:"Components/TabBar",component:u,tags:["autodocs"],parameters:{docs:{description:{component:`
## TabBar 컴포넌트

브라우저 스타일의 탭 바 컴포넌트입니다.

### 특징
- 다중 탭 관리
- 탭 추가/닫기 기능
- 드래그 앤 드롭으로 탭 순서 변경
- 윈도우 컨트롤 (최소화, 최대화, 닫기)

### useTabBar 훅
탭 상태 관리를 위한 훅을 제공합니다.

\`\`\`tsx
const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
  initialTabs: [{ id: '1', label: 'Home' }],
  initialActiveTab: '1',
});
\`\`\`

### 사용 시기
- IDE/에디터 스타일의 탭 인터페이스
- 다중 문서/페이지 관리
- 브라우저 탭 시뮬레이션
        `}}},argTypes:{showAddButton:{control:"boolean",description:"탭 추가 버튼 표시",table:{defaultValue:{summary:"true"}}},showWindowControls:{control:"boolean",description:"윈도우 컨트롤 버튼 표시",table:{defaultValue:{summary:"true"}}},showBottomBorder:{control:"boolean",description:"하단 테두리 표시",table:{defaultValue:{summary:"true"}}}}},C={render:()=>{const{tabs:n,activeTab:s,addTab:o,closeTab:t,selectTab:l}=h({initialTabs:[{id:"1",label:"Overview",closable:!1},{id:"2",label:"Settings"},{id:"3",label:"Documents"}],initialActiveTab:"1"});return a.jsx(u,{tabs:n,activeTab:s,onTabChange:l,onTabClose:t,onTabAdd:()=>o()})}},I={render:()=>{const{tabs:n,activeTab:s,addTab:o,closeTab:t,selectTab:l}=h({initialTabs:[{id:"1",label:"Home",icon:a.jsx(ce,{size:14}),closable:!1},{id:"2",label:"Settings",icon:a.jsx(be,{size:14})},{id:"3",label:"Files",icon:a.jsx(ue,{size:14})}],initialActiveTab:"1"});return a.jsx(u,{tabs:n,activeTab:s,onTabChange:l,onTabClose:t,onTabAdd:()=>o({id:`new-${Date.now()}`,label:"New Tab",icon:a.jsx(de,{size:14})})})}},A={render:()=>{const{tabs:n,activeTab:s,addTab:o,closeTab:t,selectTab:l}=h({initialTabs:[{id:"1",label:"Tab 1"},{id:"2",label:"Tab 2"}],initialActiveTab:"1"});return a.jsx(u,{tabs:n,activeTab:s,onTabChange:l,onTabClose:t,onTabAdd:()=>o(),showWindowControls:!1})}},j={render:()=>{const{tabs:n,activeTab:s,closeTab:o,selectTab:t}=h({initialTabs:[{id:"1",label:"Fixed Tab 1",closable:!1},{id:"2",label:"Fixed Tab 2",closable:!1},{id:"3",label:"Fixed Tab 3",closable:!1}],initialActiveTab:"1"});return a.jsx(u,{tabs:n,activeTab:s,onTabChange:t,onTabClose:o,showAddButton:!1,showWindowControls:!1})}},B={render:()=>a.jsx(u,{tabs:[{id:"1",label:"Main",closable:!1}],activeTab:"1",onTabChange:()=>{},showAddButton:!1})},z={render:()=>{const{tabs:n,activeTab:s,closeTab:o,selectTab:t}=h({initialTabs:Array.from({length:8},(l,d)=>({id:String(d+1),label:`Tab ${d+1}`,closable:d>0})),initialActiveTab:"1"});return a.jsx(u,{tabs:n,activeTab:s,onTabChange:t,onTabClose:o,showAddButton:!1})}};var $,F,M;C.parameters={...C.parameters,docs:{...($=C.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const {
      tabs,
      activeTab,
      addTab,
      closeTab,
      selectTab
    } = useTabBar({
      initialTabs: [{
        id: '1',
        label: 'Overview',
        closable: false
      }, {
        id: '2',
        label: 'Settings'
      }, {
        id: '3',
        label: 'Documents'
      }],
      initialActiveTab: '1'
    });
    return <TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={() => addTab()} />;
  }
}`,...(M=(F=C.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};var O,E,V;I.parameters={...I.parameters,docs:{...(O=I.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    const {
      tabs,
      activeTab,
      addTab,
      closeTab,
      selectTab
    } = useTabBar({
      initialTabs: [{
        id: '1',
        label: 'Home',
        icon: <IconHome size={14} />,
        closable: false
      }, {
        id: '2',
        label: 'Settings',
        icon: <IconSettings size={14} />
      }, {
        id: '3',
        label: 'Files',
        icon: <IconFolder size={14} />
      }],
      initialActiveTab: '1'
    });
    return <TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={() => addTab({
      id: \`new-\${Date.now()}\`,
      label: 'New Tab',
      icon: <IconFile size={14} />
    })} />;
  }
}`,...(V=(E=I.parameters)==null?void 0:E.docs)==null?void 0:V.source}}};var _,H,L;A.parameters={...A.parameters,docs:{...(_=A.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => {
    const {
      tabs,
      activeTab,
      addTab,
      closeTab,
      selectTab
    } = useTabBar({
      initialTabs: [{
        id: '1',
        label: 'Tab 1'
      }, {
        id: '2',
        label: 'Tab 2'
      }],
      initialActiveTab: '1'
    });
    return <TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={() => addTab()} showWindowControls={false} />;
  }
}`,...(L=(H=A.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var P,X,G;j.parameters={...j.parameters,docs:{...(P=j.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const {
      tabs,
      activeTab,
      closeTab,
      selectTab
    } = useTabBar({
      initialTabs: [{
        id: '1',
        label: 'Fixed Tab 1',
        closable: false
      }, {
        id: '2',
        label: 'Fixed Tab 2',
        closable: false
      }, {
        id: '3',
        label: 'Fixed Tab 3',
        closable: false
      }],
      initialActiveTab: '1'
    });
    return <TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} showAddButton={false} showWindowControls={false} />;
  }
}`,...(G=(X=j.parameters)==null?void 0:X.docs)==null?void 0:G.source}}};var J,K,Q;B.parameters={...B.parameters,docs:{...(J=B.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <TabBar tabs={[{
    id: '1',
    label: 'Main',
    closable: false
  }]} activeTab="1" onTabChange={() => {}} showAddButton={false} />
}`,...(Q=(K=B.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var R,U,Y;z.parameters={...z.parameters,docs:{...(R=z.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const {
      tabs,
      activeTab,
      closeTab,
      selectTab
    } = useTabBar({
      initialTabs: Array.from({
        length: 8
      }, (_, i) => ({
        id: String(i + 1),
        label: \`Tab \${i + 1}\`,
        closable: i > 0
      })),
      initialActiveTab: '1'
    });
    return <TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} showAddButton={false} />;
  }
}`,...(Y=(U=z.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};const Ae=["Default","WithIcons","WithoutWindowControls","WithoutAddButton","SingleTab","ManyTabs"];export{C as Default,z as ManyTabs,B as SingleTab,I as WithIcons,j as WithoutAddButton,A as WithoutWindowControls,Ae as __namedExportsOrder,Ie as default};
