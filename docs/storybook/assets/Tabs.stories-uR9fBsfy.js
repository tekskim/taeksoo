import{j as a,r as z}from"./iframe-ko1KmZFS.js";import{T as t,a as n,b as e,c as i}from"./Tabs-sIM69MU8.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";const I={title:"Components/Tabs",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{value:{control:"text",description:"활성 탭 값 (controlled)",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"초기 활성 탭 값 (uncontrolled)",table:{type:{summary:"string"}}},variant:{control:"select",options:["underline","boxed"],description:"탭 스타일 변형",table:{type:{summary:'"underline" | "boxed"'},defaultValue:{summary:'"underline"'}}},size:{control:"select",options:["sm","md"],description:"탭 크기",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},onChange:{description:"탭 변경 콜백",table:{type:{summary:"(value: string) => void"}}}}},s={render:()=>a.jsxs(t,{defaultValue:"tab1",children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"Overview"}),a.jsx(e,{value:"tab2",children:"Features"}),a.jsx(e,{value:"tab3",children:"Settings"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Overview content goes here."})}),a.jsx(i,{value:"tab2",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Features content goes here."})}),a.jsx(i,{value:"tab3",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Settings content goes here."})})]})},r={render:()=>a.jsxs(t,{defaultValue:"tab1",variant:"boxed",children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"Day"}),a.jsx(e,{value:"tab2",children:"Week"}),a.jsx(e,{value:"tab3",children:"Month"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Daily view content"})}),a.jsx(i,{value:"tab2",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Weekly view content"})}),a.jsx(i,{value:"tab3",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Monthly view content"})})]})},l={render:function(){const[o,B]=z.useState("tab1");return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[a.jsxs(t,{value:o,onChange:B,children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"First"}),a.jsx(e,{value:"tab2",children:"Second"}),a.jsx(e,{value:"tab3",children:"Third"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"First tab content"})}),a.jsx(i,{value:"tab2",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Second tab content"})}),a.jsx(i,{value:"tab3",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Third tab content"})})]}),a.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Active tab: ",a.jsx("strong",{children:o})]})]})}},c={render:()=>a.jsxs(t,{defaultValue:"tab1",children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"Active"}),a.jsx(e,{value:"tab2",children:"Also Active"}),a.jsx(e,{value:"tab3",disabled:!0,children:"Disabled"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"First tab content"})}),a.jsx(i,{value:"tab2",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Second tab content"})}),a.jsx(i,{value:"tab3",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"This tab is disabled"})})]})},d={render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-8)]",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Small (sm)"}),a.jsxs(t,{defaultValue:"tab1",size:"sm",children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Small tab content"})})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Medium (md)"}),a.jsxs(t,{defaultValue:"tab1",size:"md",children:[a.jsxs(n,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]}),a.jsx(i,{value:"tab1",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:"Medium tab content"})})]})]})]})},v={render:()=>a.jsxs("div",{className:"w-[600px] p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)]",children:[a.jsx("h2",{className:"text-heading-h4 mb-[var(--primitive-spacing-4)]",children:"Account Settings"}),a.jsxs(t,{defaultValue:"profile",children:[a.jsxs(n,{children:[a.jsx(e,{value:"profile",children:"Profile"}),a.jsx(e,{value:"security",children:"Security"}),a.jsx(e,{value:"notifications",children:"Notifications"}),a.jsx(e,{value:"billing",children:"Billing"})]}),a.jsx(i,{value:"profile",children:a.jsxs("div",{className:"py-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-label-lg mb-[var(--primitive-spacing-2)]",children:"Profile Settings"}),a.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Update your name, email, and profile picture."})]})}),a.jsx(i,{value:"security",children:a.jsxs("div",{className:"py-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-label-lg mb-[var(--primitive-spacing-2)]",children:"Security Settings"}),a.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Manage your password and two-factor authentication."})]})}),a.jsx(i,{value:"notifications",children:a.jsxs("div",{className:"py-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-label-lg mb-[var(--primitive-spacing-2)]",children:"Notification Preferences"}),a.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Configure how and when you receive notifications."})]})}),a.jsx(i,{value:"billing",children:a.jsxs("div",{className:"py-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-label-lg mb-[var(--primitive-spacing-2)]",children:"Billing Information"}),a.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"Manage your subscription and payment methods."})]})})]})]})},b={render:()=>a.jsx("div",{className:"w-[300px]",children:a.jsxs(t,{defaultValue:"list",variant:"boxed",children:[a.jsxs(n,{children:[a.jsx(e,{value:"list",children:"List"}),a.jsx(e,{value:"grid",children:"Grid"}),a.jsx(e,{value:"calendar",children:"Calendar"})]}),a.jsx(i,{value:"list",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]",children:"List view content"})}),a.jsx(i,{value:"grid",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]",children:"Grid view content"})}),a.jsx(i,{value:"calendar",children:a.jsx("div",{className:"p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]",children:"Calendar view content"})})]})})};var p,m,u;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Features</Tab>
        <Tab value="tab3">Settings</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-[var(--primitive-spacing-4)]">Overview content goes here.</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-[var(--primitive-spacing-4)]">Features content goes here.</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-[var(--primitive-spacing-4)]">Settings content goes here.</div>
      </TabPanel>
    </Tabs>
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var x,T,h;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" variant="boxed">
      <TabList>
        <Tab value="tab1">Day</Tab>
        <Tab value="tab2">Week</Tab>
        <Tab value="tab3">Month</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-[var(--primitive-spacing-4)]">Daily view content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-[var(--primitive-spacing-4)]">Weekly view content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-[var(--primitive-spacing-4)]">Monthly view content</div>
      </TabPanel>
    </Tabs>
}`,...(h=(T=r.parameters)==null?void 0:T.docs)==null?void 0:h.source}}};var g,j,N;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('tab1');
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="tab1">First</Tab>
            <Tab value="tab2">Second</Tab>
            <Tab value="tab3">Third</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-[var(--primitive-spacing-4)]">First tab content</div>
          </TabPanel>
          <TabPanel value="tab2">
            <div className="p-[var(--primitive-spacing-4)]">Second tab content</div>
          </TabPanel>
          <TabPanel value="tab3">
            <div className="p-[var(--primitive-spacing-4)]">Third tab content</div>
          </TabPanel>
        </Tabs>
        <p className="text-body-md text-[var(--color-text-muted)]">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>;
  }
}`,...(N=(j=l.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var f,y,P;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Active</Tab>
        <Tab value="tab2">Also Active</Tab>
        <Tab value="tab3" disabled>
          Disabled
        </Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-[var(--primitive-spacing-4)]">First tab content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-[var(--primitive-spacing-4)]">Second tab content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-[var(--primitive-spacing-4)]">This tab is disabled</div>
      </TabPanel>
    </Tabs>
}`,...(P=(y=c.parameters)==null?void 0:y.docs)==null?void 0:P.source}}};var S,w,L;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-8)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Small (sm)
        </p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-[var(--primitive-spacing-4)]">Small tab content</div>
          </TabPanel>
        </Tabs>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Medium (md)
        </p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-[var(--primitive-spacing-4)]">Medium tab content</div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
}`,...(L=(w=d.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var V,C,A;v.parameters={...v.parameters,docs:{...(V=v.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <div className="w-[600px] p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)]">
      <h2 className="text-heading-h4 mb-[var(--primitive-spacing-4)]">Account Settings</h2>
      <Tabs defaultValue="profile">
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="profile">
          <div className="py-[var(--primitive-spacing-4)]">
            <h3 className="text-label-lg mb-[var(--primitive-spacing-2)]">Profile Settings</h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Update your name, email, and profile picture.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="security">
          <div className="py-[var(--primitive-spacing-4)]">
            <h3 className="text-label-lg mb-[var(--primitive-spacing-2)]">Security Settings</h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Manage your password and two-factor authentication.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="notifications">
          <div className="py-[var(--primitive-spacing-4)]">
            <h3 className="text-label-lg mb-[var(--primitive-spacing-2)]">
              Notification Preferences
            </h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Configure how and when you receive notifications.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="billing">
          <div className="py-[var(--primitive-spacing-4)]">
            <h3 className="text-label-lg mb-[var(--primitive-spacing-2)]">Billing Information</h3>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Manage your subscription and payment methods.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
}`,...(A=(C=v.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var M,D,F;b.parameters={...b.parameters,docs:{...(M=b.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="w-[300px]">
      <Tabs defaultValue="list" variant="boxed">
        <TabList>
          <Tab value="list">List</Tab>
          <Tab value="grid">Grid</Tab>
          <Tab value="calendar">Calendar</Tab>
        </TabList>
        <TabPanel value="list">
          <div className="p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]">
            List view content
          </div>
        </TabPanel>
        <TabPanel value="grid">
          <div className="p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]">
            Grid view content
          </div>
        </TabPanel>
        <TabPanel value="calendar">
          <div className="p-[var(--primitive-spacing-4)] text-center text-[var(--color-text-muted)]">
            Calendar view content
          </div>
        </TabPanel>
      </Tabs>
    </div>
}`,...(F=(D=b.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};const U=["Default","Boxed","Controlled","WithDisabledTab","Sizes","SettingsPage","BoxedToggle"];export{r as Boxed,b as BoxedToggle,l as Controlled,s as Default,v as SettingsPage,d as Sizes,c as WithDisabledTab,U as __namedExportsOrder,I as default};
