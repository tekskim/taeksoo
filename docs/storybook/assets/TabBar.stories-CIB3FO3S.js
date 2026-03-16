import{j as a}from"./iframe-iHQO5Mqm.js";import{T as t,u as i}from"./TabBar-1wbPtY0m.js";import{I as H}from"./IconFile-By82ngy8.js";import{I as M}from"./IconHome-wYBQld76.js";import{I as _}from"./IconSettings-D0BAVBr7.js";import{I as $}from"./IconFolder-CFuHyp3x.js";import"./preload-helper-C1FmrZbK.js";import"./IconX-gJXINq1T.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconPlus-6YPJMn77.js";import"./IconMinus-B--iY0Bg.js";import"./IconSquare-A_p-XpCT.js";const Q={title:"Components/TabBar",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{showAddButton:{control:"boolean",description:"탭 추가 버튼 표시",table:{defaultValue:{summary:"true"}}},showWindowControls:{control:"boolean",description:"윈도우 컨트롤 버튼 표시",table:{defaultValue:{summary:"true"}}},showBottomBorder:{control:"boolean",description:"하단 테두리 표시",table:{defaultValue:{summary:"true"}}}}},l={render:()=>{const{tabs:e,activeTab:n,addTab:s,closeTab:o,selectTab:b}=i({initialTabs:[{id:"1",label:"Overview",closable:!1},{id:"2",label:"Settings"},{id:"3",label:"Documents"}],initialActiveTab:"1"});return a.jsx(t,{tabs:e,activeTab:n,onTabChange:b,onTabClose:o,onTabAdd:()=>s()})}},r={render:()=>{const{tabs:e,activeTab:n,addTab:s,closeTab:o,selectTab:b}=i({initialTabs:[{id:"1",label:"Home",icon:a.jsx(M,{size:14}),closable:!1},{id:"2",label:"Settings",icon:a.jsx(_,{size:14})},{id:"3",label:"Files",icon:a.jsx($,{size:14})}],initialActiveTab:"1"});return a.jsx(t,{tabs:e,activeTab:n,onTabChange:b,onTabClose:o,onTabAdd:()=>s({id:`new-${Date.now()}`,label:"New Tab",icon:a.jsx(H,{size:14})})})}},c={render:()=>{const{tabs:e,activeTab:n,addTab:s,closeTab:o,selectTab:b}=i({initialTabs:[{id:"1",label:"Tab 1"},{id:"2",label:"Tab 2"}],initialActiveTab:"1"});return a.jsx(t,{tabs:e,activeTab:n,onTabChange:b,onTabClose:o,onTabAdd:()=>s(),showWindowControls:!1})}},T={render:()=>{const{tabs:e,activeTab:n,closeTab:s,selectTab:o}=i({initialTabs:[{id:"1",label:"Fixed Tab 1",closable:!1},{id:"2",label:"Fixed Tab 2",closable:!1},{id:"3",label:"Fixed Tab 3",closable:!1}],initialActiveTab:"1"});return a.jsx(t,{tabs:e,activeTab:n,onTabChange:o,onTabClose:s,showAddButton:!1,showWindowControls:!1})}},d={render:()=>a.jsx(t,{tabs:[{id:"1",label:"Main",closable:!1}],activeTab:"1",onTabChange:()=>{},showAddButton:!1})},u={render:()=>{const{tabs:e,activeTab:n,closeTab:s,selectTab:o}=i({initialTabs:Array.from({length:8},(b,m)=>({id:String(m+1),label:`Tab ${m+1}`,closable:m>0})),initialActiveTab:"1"});return a.jsx(t,{tabs:e,activeTab:n,onTabChange:o,onTabClose:s,showAddButton:!1})}};var p,v,f;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(f=(v=l.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var h,g,C;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(C=(g=r.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};var w,A,B;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(B=(A=c.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var x,S,I;T.parameters={...T.parameters,docs:{...(x=T.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(I=(S=T.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var W,j,F;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <TabBar tabs={[{
    id: '1',
    label: 'Main',
    closable: false
  }]} activeTab="1" onTabChange={() => {}} showAddButton={false} />
}`,...(F=(j=d.parameters)==null?void 0:j.docs)==null?void 0:F.source}}};var y,z,D;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(D=(z=u.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};const U=["Default","WithIcons","WithoutWindowControls","WithoutAddButton","SingleTab","ManyTabs"];export{l as Default,u as ManyTabs,d as SingleTab,r as WithIcons,T as WithoutAddButton,c as WithoutWindowControls,U as __namedExportsOrder,Q as default};
