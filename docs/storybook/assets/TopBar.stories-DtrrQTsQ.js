import{j as e}from"./iframe-CzLct1Ct.js";import{T as r,a}from"./TopBar-C75NDGnt.js";import{I as P}from"./IconSearch-C1F8G_YC.js";import{I as m}from"./IconBell-UO9Ol32x.js";import{I as d}from"./IconSettings-BXa-o0yY.js";import{B as o}from"./Breadcrumb-h6EUv0Dn.js";import{I as W}from"./IconUser-B_-1aLBz.js";import{B as V}from"./chunk-JZWAC4HX-C7nbi7mi.js";import"./preload-helper-C1FmrZbK.js";import"./IconLayoutSidebar-DV2C2EBX.js";import"./createReactComponent-Djx9unWR.js";import"./cn-BMXv33oC.js";import"./IconChevronRight-CGyay9dN.js";const Y={title:"Components/TopBar",component:r,tags:["autodocs"],decorators:[C=>e.jsx(V,{children:e.jsx(C,{})})],parameters:{docs:{description:{component:`
## TopBar 컴포넌트

애플리케이션 상단 네비게이션 바 컴포넌트입니다.

### 구성 요소
- **사이드바 토글**: 좌측 사이드바 열기/닫기
- **네비게이션**: 뒤로가기/앞으로가기 버튼
- **Breadcrumb**: 현재 위치 표시
- **액션**: 우측 액션 버튼들

### TopBarAction
일관된 스타일의 액션 버튼 컴포넌트입니다.
- 알림 뱃지 지원
- 접근성 레이블 필수

### 사용 시기
- 메인 애플리케이션 헤더
- 대시보드 상단 네비게이션
- IDE 스타일 레이아웃

### 예시
\`\`\`tsx
<TopBar
  onSidebarToggle={() => {}}
  breadcrumb={<Breadcrumb items={[...]} />}
  actions={
    <>
      <TopBarAction icon={<IconBell />} aria-label="Notifications" badge />
      <TopBarAction icon={<IconSettings />} aria-label="Settings" />
    </>
  }
/>
\`\`\`
        `}}},argTypes:{showSidebarToggle:{control:"boolean",description:"사이드바 토글 버튼 표시",table:{defaultValue:{summary:"false"}}},showNavigation:{control:"boolean",description:"네비게이션 버튼 표시",table:{defaultValue:{summary:"true"}}},canGoBack:{control:"boolean",description:"뒤로가기 활성화",table:{defaultValue:{summary:"true"}}},canGoForward:{control:"boolean",description:"앞으로가기 활성화",table:{defaultValue:{summary:"true"}}}}},s={render:()=>e.jsx(r,{breadcrumb:e.jsx(o,{items:[{label:"Compute",href:"/compute"},{label:"Instances",href:"/compute/instances"},{label:"web-server-01"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(P,{size:16}),"aria-label":"Search"}),e.jsx(a,{icon:e.jsx(m,{size:16}),"aria-label":"Notifications"}),e.jsx(a,{icon:e.jsx(d,{size:16}),"aria-label":"Settings"})]})})},i={render:()=>e.jsx(r,{showSidebarToggle:!0,onSidebarToggle:()=>console.log("Toggle sidebar"),breadcrumb:e.jsx(o,{items:[{label:"Container",href:"/container"},{label:"Deployments"}]}),actions:e.jsx(a,{icon:e.jsx(W,{size:16}),"aria-label":"Profile"})})},t={render:()=>e.jsx(r,{breadcrumb:e.jsx(o,{items:[{label:"Dashboard"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(m,{size:16}),"aria-label":"Notifications",badge:!0}),e.jsx(a,{icon:e.jsx(d,{size:16}),"aria-label":"Settings"})]})})},c={render:()=>e.jsx(r,{showNavigation:!1,breadcrumb:e.jsx(o,{items:[{label:"Settings",href:"/settings"},{label:"Account"}]})})},n={render:()=>e.jsx(r,{canGoBack:!1,canGoForward:!1,breadcrumb:e.jsx(o,{items:[{label:"Home"}]})})},l={render:()=>e.jsx(r,{showNavigation:!1,breadcrumb:e.jsx(o,{items:[{label:"Simple Page"}]})})},b={render:()=>e.jsx(r,{showSidebarToggle:!0,onSidebarToggle:()=>console.log("Toggle"),onBack:()=>console.log("Back"),onForward:()=>console.log("Forward"),canGoBack:!0,canGoForward:!1,breadcrumb:e.jsx(o,{items:[{label:"Storage",href:"/storage"},{label:"Buckets",href:"/storage/buckets"},{label:"my-bucket",href:"/storage/buckets/my-bucket"},{label:"files"}]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(a,{icon:e.jsx(P,{size:16}),"aria-label":"Search"}),e.jsx(a,{icon:e.jsx(m,{size:16}),"aria-label":"Notifications",badge:!0}),e.jsx(a,{icon:e.jsx(d,{size:16}),"aria-label":"Settings"}),e.jsx(a,{icon:e.jsx(W,{size:16}),"aria-label":"Profile"})]})})};var u,g,p;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <TopBar breadcrumb={<Breadcrumb items={[{
    label: 'Compute',
    href: '/compute'
  }, {
    label: 'Instances',
    href: '/compute/instances'
  }, {
    label: 'web-server-01'
  }]} />} actions={<>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>} />
}`,...(p=(g=s.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var B,f,x;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <TopBar showSidebarToggle onSidebarToggle={() => console.log('Toggle sidebar')} breadcrumb={<Breadcrumb items={[{
    label: 'Container',
    href: '/container'
  }, {
    label: 'Deployments'
  }]} />} actions={<TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />} />
}`,...(x=(f=i.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var S,h,T;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <TopBar breadcrumb={<Breadcrumb items={[{
    label: 'Dashboard'
  }]} />} actions={<>
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>} />
}`,...(T=(h=t.parameters)==null?void 0:h.docs)==null?void 0:T.source}}};var j,I,w;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <TopBar showNavigation={false} breadcrumb={<Breadcrumb items={[{
    label: 'Settings',
    href: '/settings'
  }, {
    label: 'Account'
  }]} />} />
}`,...(w=(I=c.parameters)==null?void 0:I.docs)==null?void 0:w.source}}};var z,k,N;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <TopBar canGoBack={false} canGoForward={false} breadcrumb={<Breadcrumb items={[{
    label: 'Home'
  }]} />} />
}`,...(N=(k=n.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var A,F,v;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <TopBar showNavigation={false} breadcrumb={<Breadcrumb items={[{
    label: 'Simple Page'
  }]} />} />
}`,...(v=(F=l.parameters)==null?void 0:F.docs)==null?void 0:v.source}}};var y,G,D;b.parameters={...b.parameters,docs:{...(y=b.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <TopBar showSidebarToggle onSidebarToggle={() => console.log('Toggle')} onBack={() => console.log('Back')} onForward={() => console.log('Forward')} canGoBack={true} canGoForward={false} breadcrumb={<Breadcrumb items={[{
    label: 'Storage',
    href: '/storage'
  }, {
    label: 'Buckets',
    href: '/storage/buckets'
  }, {
    label: 'my-bucket',
    href: '/storage/buckets/my-bucket'
  }, {
    label: 'files'
  }]} />} actions={<>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
          <TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />
        </>} />
}`,...(D=(G=b.parameters)==null?void 0:G.docs)==null?void 0:D.source}}};const Z=["Default","WithSidebarToggle","WithNotificationBadge","WithoutNavigation","DisabledNavigation","Minimal","FullFeatured"];export{s as Default,n as DisabledNavigation,b as FullFeatured,l as Minimal,t as WithNotificationBadge,i as WithSidebarToggle,c as WithoutNavigation,Z as __namedExportsOrder,Y as default};
