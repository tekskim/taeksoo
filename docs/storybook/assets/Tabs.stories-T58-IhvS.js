import{j as e,r as G}from"./iframe-DKmDJy9M.js";import{T as n,a as t,b as a,c as s}from"./Tabs-DMGje0WM.js";import{B as l}from"./Badge-C_Vf5MbZ.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";const J={title:"Components/Tabs",component:n,tags:["autodocs"],parameters:{docs:{description:{component:`
## Tabs 컴포넌트

관련 콘텐츠를 탭으로 구분하여 표시하는 네비게이션 컴포넌트입니다.

### 구성
- **Tabs**: 컨테이너 (Context Provider)
- **TabList**: 탭 버튼 목록
- **Tab**: 개별 탭 버튼
- **TabPanel**: 탭 콘텐츠 영역

### 변형
- **underline**: 하단 밑줄 스타일 (기본)
- **boxed**: 박스/세그먼트 스타일

### 사용 시기
- 같은 수준의 콘텐츠 그룹화
- 설정 페이지 섹션 구분
- 대시보드 뷰 전환

### 접근성
- 화살표 키로 탭 이동
- Home/End 키 지원
- role="tablist", role="tab", role="tabpanel" 자동 적용
- aria-selected 상태 관리

### 예시
\`\`\`tsx
import { Tabs, TabList, Tab, TabPanel } from '@thaki/tds';

// 기본 사용 (uncontrolled)
<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">탭 1</Tab>
    <Tab value="tab2">탭 2</Tab>
  </TabList>
  <TabPanel value="tab1">내용 1</TabPanel>
  <TabPanel value="tab2">내용 2</TabPanel>
</Tabs>

// Controlled
<Tabs value={activeTab} onChange={setActiveTab}>
  <TabList>
    <Tab value="tab1">탭 1</Tab>
    <Tab value="tab2">탭 2</Tab>
  </TabList>
  ...
</Tabs>

// 박스 스타일
<Tabs defaultValue="day" variant="boxed">
  <TabList>
    <Tab value="day">일</Tab>
    <Tab value="week">주</Tab>
    <Tab value="month">월</Tab>
  </TabList>
  ...
</Tabs>
\`\`\`
        `}}},argTypes:{value:{control:"text",description:"활성 탭 값 (controlled)",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"초기 활성 탭 값 (uncontrolled)",table:{type:{summary:"string"}}},variant:{control:"select",options:["underline","boxed"],description:"탭 스타일 변형",table:{type:{summary:'"underline" | "boxed"'},defaultValue:{summary:'"underline"'}}},size:{control:"select",options:["sm","md"],description:"탭 크기",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},onChange:{description:"탭 변경 콜백",table:{type:{summary:"(value: string) => void"}}}}},i={render:()=>e.jsxs(n,{defaultValue:"tab1",children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"Overview"}),e.jsx(a,{value:"tab2",children:"Features"}),e.jsx(a,{value:"tab3",children:"Settings"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"Overview content goes here."})}),e.jsx(s,{value:"tab2",children:e.jsx("div",{className:"p-4",children:"Features content goes here."})}),e.jsx(s,{value:"tab3",children:e.jsx("div",{className:"p-4",children:"Settings content goes here."})})]})},r={render:()=>e.jsxs(n,{defaultValue:"tab1",variant:"boxed",children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"Day"}),e.jsx(a,{value:"tab2",children:"Week"}),e.jsx(a,{value:"tab3",children:"Month"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"Daily view content"})}),e.jsx(s,{value:"tab2",children:e.jsx("div",{className:"p-4",children:"Weekly view content"})}),e.jsx(s,{value:"tab3",children:e.jsx("div",{className:"p-4",children:"Monthly view content"})})]})},d={render:function(){const[v,O]=G.useState("tab1");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(n,{value:v,onChange:O,children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"First"}),e.jsx(a,{value:"tab2",children:"Second"}),e.jsx(a,{value:"tab3",children:"Third"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"First tab content"})}),e.jsx(s,{value:"tab2",children:e.jsx("div",{className:"p-4",children:"Second tab content"})}),e.jsx(s,{value:"tab3",children:e.jsx("div",{className:"p-4",children:"Third tab content"})})]}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Active tab: ",e.jsx("strong",{children:v})]})]})}},c={render:()=>e.jsxs(n,{defaultValue:"tab1",children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"Active"}),e.jsx(a,{value:"tab2",children:"Also Active"}),e.jsx(a,{value:"tab3",disabled:!0,children:"Disabled"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"First tab content"})}),e.jsx(s,{value:"tab2",children:e.jsx("div",{className:"p-4",children:"Second tab content"})}),e.jsx(s,{value:"tab3",children:e.jsx("div",{className:"p-4",children:"This tab is disabled"})})]})},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Small (sm)"}),e.jsxs(n,{defaultValue:"tab1",size:"sm",children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"Tab 1"}),e.jsx(a,{value:"tab2",children:"Tab 2"}),e.jsx(a,{value:"tab3",children:"Tab 3"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"Small tab content"})})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Medium (md)"}),e.jsxs(n,{defaultValue:"tab1",size:"md",children:[e.jsxs(t,{children:[e.jsx(a,{value:"tab1",children:"Tab 1"}),e.jsx(a,{value:"tab2",children:"Tab 2"}),e.jsx(a,{value:"tab3",children:"Tab 3"})]}),e.jsx(s,{value:"tab1",children:e.jsx("div",{className:"p-4",children:"Medium tab content"})})]})]})]})},o={render:()=>e.jsxs(n,{defaultValue:"all",children:[e.jsxs(t,{children:[e.jsx(a,{value:"all",children:e.jsxs("span",{className:"flex items-center gap-2",children:["All ",e.jsx(l,{size:"sm",theme:"gray",type:"subtle",children:"128"})]})}),e.jsx(a,{value:"active",children:e.jsxs("span",{className:"flex items-center gap-2",children:["Active ",e.jsx(l,{size:"sm",theme:"green",type:"subtle",children:"42"})]})}),e.jsx(a,{value:"pending",children:e.jsxs("span",{className:"flex items-center gap-2",children:["Pending ",e.jsx(l,{size:"sm",theme:"yellow",type:"subtle",children:"15"})]})}),e.jsx(a,{value:"error",children:e.jsxs("span",{className:"flex items-center gap-2",children:["Error ",e.jsx(l,{size:"sm",theme:"red",type:"subtle",children:"3"})]})})]}),e.jsx(s,{value:"all",children:e.jsx("div",{className:"p-4",children:"All items (128)"})}),e.jsx(s,{value:"active",children:e.jsx("div",{className:"p-4",children:"Active items (42)"})}),e.jsx(s,{value:"pending",children:e.jsx("div",{className:"p-4",children:"Pending items (15)"})}),e.jsx(s,{value:"error",children:e.jsx("div",{className:"p-4",children:"Error items (3)"})})]})},u={render:()=>e.jsxs("div",{className:"w-[600px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg",children:[e.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Account Settings"}),e.jsxs(n,{defaultValue:"profile",children:[e.jsxs(t,{children:[e.jsx(a,{value:"profile",children:"Profile"}),e.jsx(a,{value:"security",children:"Security"}),e.jsx(a,{value:"notifications",children:"Notifications"}),e.jsx(a,{value:"billing",children:"Billing"})]}),e.jsx(s,{value:"profile",children:e.jsxs("div",{className:"py-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Profile Settings"}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Update your name, email, and profile picture."})]})}),e.jsx(s,{value:"security",children:e.jsxs("div",{className:"py-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Security Settings"}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Manage your password and two-factor authentication."})]})}),e.jsx(s,{value:"notifications",children:e.jsxs("div",{className:"py-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Notification Preferences"}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Configure how and when you receive notifications."})]})}),e.jsx(s,{value:"billing",children:e.jsxs("div",{className:"py-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Billing Information"}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Manage your subscription and payment methods."})]})})]})]})},m={render:()=>e.jsx("div",{className:"w-[300px]",children:e.jsxs(n,{defaultValue:"list",variant:"boxed",children:[e.jsxs(t,{children:[e.jsx(a,{value:"list",children:"List"}),e.jsx(a,{value:"grid",children:"Grid"}),e.jsx(a,{value:"calendar",children:"Calendar"})]}),e.jsx(s,{value:"list",children:e.jsx("div",{className:"p-4 text-center text-[var(--color-text-muted)]",children:"List view content"})}),e.jsx(s,{value:"grid",children:e.jsx("div",{className:"p-4 text-center text-[var(--color-text-muted)]",children:"Grid view content"})}),e.jsx(s,{value:"calendar",children:e.jsx("div",{className:"p-4 text-center text-[var(--color-text-muted)]",children:"Calendar view content"})})]})})};var T,x,p;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Features</Tab>
        <Tab value="tab3">Settings</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">Overview content goes here.</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Features content goes here.</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">Settings content goes here.</div>
      </TabPanel>
    </Tabs>
}`,...(p=(x=i.parameters)==null?void 0:x.docs)==null?void 0:p.source}}};var h,j,g;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" variant="boxed">
      <TabList>
        <Tab value="tab1">Day</Tab>
        <Tab value="tab2">Week</Tab>
        <Tab value="tab3">Month</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">Daily view content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Weekly view content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">Monthly view content</div>
      </TabPanel>
    </Tabs>
}`,...(g=(j=r.parameters)==null?void 0:j.docs)==null?void 0:g.source}}};var f,N,P;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('tab1');
    return <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="tab1">First</Tab>
            <Tab value="tab2">Second</Tab>
            <Tab value="tab3">Third</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">First tab content</div>
          </TabPanel>
          <TabPanel value="tab2">
            <div className="p-4">Second tab content</div>
          </TabPanel>
          <TabPanel value="tab3">
            <div className="p-4">Third tab content</div>
          </TabPanel>
        </Tabs>
        <p className="text-sm text-[var(--color-text-muted)]">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>;
  }
}`,...(P=(N=d.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var y,S,w;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Active</Tab>
        <Tab value="tab2">Also Active</Tab>
        <Tab value="tab3" disabled>Disabled</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">First tab content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Second tab content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">This tab is disabled</div>
      </TabPanel>
    </Tabs>
}`,...(w=(S=c.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var L,A,V;b.parameters={...b.parameters,docs:{...(L=b.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium mb-2">Small (sm)</p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">Small tab content</div>
          </TabPanel>
        </Tabs>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Medium (md)</p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">Medium tab content</div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
}`,...(V=(A=b.parameters)==null?void 0:A.docs)==null?void 0:V.source}}};var B,C,z;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="all">
      <TabList>
        <Tab value="all">
          <span className="flex items-center gap-2">
            All <Badge size="sm" theme="gray" type="subtle">128</Badge>
          </span>
        </Tab>
        <Tab value="active">
          <span className="flex items-center gap-2">
            Active <Badge size="sm" theme="green" type="subtle">42</Badge>
          </span>
        </Tab>
        <Tab value="pending">
          <span className="flex items-center gap-2">
            Pending <Badge size="sm" theme="yellow" type="subtle">15</Badge>
          </span>
        </Tab>
        <Tab value="error">
          <span className="flex items-center gap-2">
            Error <Badge size="sm" theme="red" type="subtle">3</Badge>
          </span>
        </Tab>
      </TabList>
      <TabPanel value="all">
        <div className="p-4">All items (128)</div>
      </TabPanel>
      <TabPanel value="active">
        <div className="p-4">Active items (42)</div>
      </TabPanel>
      <TabPanel value="pending">
        <div className="p-4">Pending items (15)</div>
      </TabPanel>
      <TabPanel value="error">
        <div className="p-4">Error items (3)</div>
      </TabPanel>
    </Tabs>
}`,...(z=(C=o.parameters)==null?void 0:C.docs)==null?void 0:z.source}}};var M,D,F;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="w-[600px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      <Tabs defaultValue="profile">
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="profile">
          <div className="py-4">
            <h3 className="font-medium mb-2">Profile Settings</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Update your name, email, and profile picture.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="security">
          <div className="py-4">
            <h3 className="font-medium mb-2">Security Settings</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Manage your password and two-factor authentication.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="notifications">
          <div className="py-4">
            <h3 className="font-medium mb-2">Notification Preferences</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Configure how and when you receive notifications.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="billing">
          <div className="py-4">
            <h3 className="font-medium mb-2">Billing Information</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Manage your subscription and payment methods.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
}`,...(F=(D=u.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var E,W,k;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="w-[300px]">
      <Tabs defaultValue="list" variant="boxed">
        <TabList>
          <Tab value="list">List</Tab>
          <Tab value="grid">Grid</Tab>
          <Tab value="calendar">Calendar</Tab>
        </TabList>
        <TabPanel value="list">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            List view content
          </div>
        </TabPanel>
        <TabPanel value="grid">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            Grid view content
          </div>
        </TabPanel>
        <TabPanel value="calendar">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            Calendar view content
          </div>
        </TabPanel>
      </Tabs>
    </div>
}`,...(k=(W=m.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};const K=["Default","Boxed","Controlled","WithDisabledTab","Sizes","WithBadges","SettingsPage","BoxedToggle"];export{r as Boxed,m as BoxedToggle,d as Controlled,i as Default,u as SettingsPage,b as Sizes,o as WithBadges,c as WithDisabledTab,K as __namedExportsOrder,J as default};
