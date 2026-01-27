import{j as e}from"./iframe-DKmDJy9M.js";import{B as a}from"./Badge-C_Vf5MbZ.js";import{I as Y}from"./IconCheck-CawMNeCL.js";import{I as F}from"./IconX-D1qmt8Yz.js";import{I as U}from"./IconAlertTriangle-DIne6sSt.js";import{I as X}from"./IconInfoCircle-BHvYvbKs.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./createReactComponent-DB1W9lnY.js";const ae={title:"Components/Badge",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
## Badge 컴포넌트

상태, 카테고리, 수량 등을 표시하는 라벨 컴포넌트입니다.

### 사용 시기
- 상태 표시 (Active, Pending, Error)
- 카테고리/태그 표시
- 알림 개수 표시
- 버전 정보 표시

### 테마
| 테마 | 사용 예시 |
|------|----------|
| **blue** | 정보, 기본 상태 |
| **green** | 성공, 활성, 완료 |
| **yellow** | 경고, 대기중 |
| **red** | 오류, 위험, 삭제 |
| **gray** | 비활성, 초안 |

### 타입
- **solid**: 채워진 배경 (강조)
- **subtle**: 연한 배경 (덜 강조)

### 예시
\`\`\`tsx
import { Badge } from '@thaki/tds';

// 기본 사용
<Badge theme="green">Active</Badge>

// 점 표시
<Badge theme="green" dot>Online</Badge>

// 아이콘 포함
<Badge theme="green" leftIcon={<IconCheck />}>
  Approved
</Badge>

// Subtle 스타일
<Badge theme="red" type="subtle">Error</Badge>
\`\`\`
        `}}},argTypes:{children:{control:"text",description:"배지 내용",table:{type:{summary:"ReactNode"}}},theme:{control:"select",options:["blue","red","green","yellow","gray"],description:"배지 색상 테마",table:{type:{summary:'"blue" | "red" | "green" | "yellow" | "gray"'},defaultValue:{summary:'"blue"'}}},type:{control:"select",options:["solid","subtle"],description:"배지 스타일 타입",table:{type:{summary:'"solid" | "subtle"'},defaultValue:{summary:'"solid"'}}},size:{control:"select",options:["sm","md","lg"],description:"배지 크기",table:{type:{summary:'"sm" | "md" | "lg"'},defaultValue:{summary:'"md"'}}},dot:{control:"boolean",description:"텍스트 앞에 점 표시 (상태 강조)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftIcon:{description:"텍스트 왼쪽 아이콘",table:{type:{summary:"ReactNode"}}},rightIcon:{description:"텍스트 오른쪽 아이콘",table:{type:{summary:"ReactNode"}}}},args:{children:"Badge",theme:"blue",type:"solid",size:"md"}},t={args:{children:"Badge"}},s={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"blue",children:"Blue"}),e.jsx(a,{theme:"red",children:"Red"}),e.jsx(a,{theme:"green",children:"Green"}),e.jsx(a,{theme:"yellow",children:"Yellow"}),e.jsx(a,{theme:"gray",children:"Gray"})]})},r={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"blue",type:"subtle",children:"Blue"}),e.jsx(a,{theme:"red",type:"subtle",children:"Red"}),e.jsx(a,{theme:"green",type:"subtle",children:"Green"}),e.jsx(a,{theme:"yellow",type:"subtle",children:"Yellow"}),e.jsx(a,{theme:"gray",type:"subtle",children:"Gray"})]})},n={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{size:"sm",children:"Small"}),e.jsx(a,{size:"md",children:"Medium"}),e.jsx(a,{size:"lg",children:"Large"})]})},d={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"blue",dot:!0,children:"Active"}),e.jsx(a,{theme:"green",dot:!0,children:"Online"}),e.jsx(a,{theme:"red",dot:!0,children:"Error"}),e.jsx(a,{theme:"yellow",dot:!0,children:"Warning"}),e.jsx(a,{theme:"gray",dot:!0,children:"Offline"})]})},l={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"blue",type:"subtle",dot:!0,children:"Active"}),e.jsx(a,{theme:"green",type:"subtle",dot:!0,children:"Online"}),e.jsx(a,{theme:"red",type:"subtle",dot:!0,children:"Error"}),e.jsx(a,{theme:"yellow",type:"subtle",dot:!0,children:"Warning"}),e.jsx(a,{theme:"gray",type:"subtle",dot:!0,children:"Offline"})]})},i={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"green",leftIcon:e.jsx(Y,{size:12}),children:"Approved"}),e.jsx(a,{theme:"red",leftIcon:e.jsx(F,{size:12}),children:"Rejected"}),e.jsx(a,{theme:"yellow",leftIcon:e.jsx(U,{size:12}),children:"Warning"}),e.jsx(a,{theme:"blue",leftIcon:e.jsx(X,{size:12}),children:"Info"})]})},m={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{theme:"green",type:"subtle",dot:!0,children:"Active"}),e.jsx(a,{theme:"yellow",type:"subtle",dot:!0,children:"Pending"}),e.jsx(a,{theme:"red",type:"subtle",dot:!0,children:"Inactive"}),e.jsx(a,{theme:"gray",type:"subtle",dot:!0,children:"Draft"})]})},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Table Status"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{theme:"green",type:"subtle",children:"Running"}),e.jsx(a,{theme:"yellow",type:"subtle",children:"Building"}),e.jsx(a,{theme:"red",type:"subtle",children:"Failed"}),e.jsx(a,{theme:"gray",type:"subtle",children:"Stopped"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Tags"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{theme:"blue",type:"subtle",size:"sm",children:"React"}),e.jsx(a,{theme:"green",type:"subtle",size:"sm",children:"TypeScript"}),e.jsx(a,{theme:"yellow",type:"subtle",size:"sm",children:"Tailwind"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Notifications"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm",children:"Messages"}),e.jsx(a,{theme:"red",size:"sm",children:"5"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Versions"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{theme:"blue",children:"v2.0.0"}),e.jsx(a,{theme:"green",type:"subtle",children:"Stable"}),e.jsx(a,{theme:"yellow",type:"subtle",children:"Beta"})]})]})]})},c={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"primary",children:"Primary"}),e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"warning",children:"Warning"}),e.jsx(a,{variant:"error",children:"Error"}),e.jsx(a,{variant:"info",children:"Info"})]})};var g,p,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  }
}`,...(h=(p=t.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var u,x,B;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="blue">Blue</Badge>
      <Badge theme="red">Red</Badge>
      <Badge theme="green">Green</Badge>
      <Badge theme="yellow">Yellow</Badge>
      <Badge theme="gray">Gray</Badge>
    </div>
}`,...(B=(x=s.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var y,f,b;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="blue" type="subtle">Blue</Badge>
      <Badge theme="red" type="subtle">Red</Badge>
      <Badge theme="green" type="subtle">Green</Badge>
      <Badge theme="yellow" type="subtle">Yellow</Badge>
      <Badge theme="gray" type="subtle">Gray</Badge>
    </div>
}`,...(b=(f=r.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var j,v,w;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
}`,...(w=(v=n.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var N,I,S;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="blue" dot>Active</Badge>
      <Badge theme="green" dot>Online</Badge>
      <Badge theme="red" dot>Error</Badge>
      <Badge theme="yellow" dot>Warning</Badge>
      <Badge theme="gray" dot>Offline</Badge>
    </div>
}`,...(S=(I=d.parameters)==null?void 0:I.docs)==null?void 0:S.source}}};var z,T,R;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="blue" type="subtle" dot>Active</Badge>
      <Badge theme="green" type="subtle" dot>Online</Badge>
      <Badge theme="red" type="subtle" dot>Error</Badge>
      <Badge theme="yellow" type="subtle" dot>Warning</Badge>
      <Badge theme="gray" type="subtle" dot>Offline</Badge>
    </div>
}`,...(R=(T=l.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};var W,A,D;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="green" leftIcon={<IconCheck size={12} />}>
        Approved
      </Badge>
      <Badge theme="red" leftIcon={<IconX size={12} />}>
        Rejected
      </Badge>
      <Badge theme="yellow" leftIcon={<IconAlertTriangle size={12} />}>
        Warning
      </Badge>
      <Badge theme="blue" leftIcon={<IconInfoCircle size={12} />}>
        Info
      </Badge>
    </div>
}`,...(D=(A=i.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var E,O,V;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge theme="green" type="subtle" dot>Active</Badge>
      <Badge theme="yellow" type="subtle" dot>Pending</Badge>
      <Badge theme="red" type="subtle" dot>Inactive</Badge>
      <Badge theme="gray" type="subtle" dot>Draft</Badge>
    </div>
}`,...(V=(O=m.parameters)==null?void 0:O.docs)==null?void 0:V.source}}};var C,G,P;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      {/* Table Status */}
      <div>
        <p className="text-sm font-medium mb-2">Table Status</p>
        <div className="flex gap-2">
          <Badge theme="green" type="subtle">Running</Badge>
          <Badge theme="yellow" type="subtle">Building</Badge>
          <Badge theme="red" type="subtle">Failed</Badge>
          <Badge theme="gray" type="subtle">Stopped</Badge>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm font-medium mb-2">Tags</p>
        <div className="flex gap-2">
          <Badge theme="blue" type="subtle" size="sm">React</Badge>
          <Badge theme="green" type="subtle" size="sm">TypeScript</Badge>
          <Badge theme="yellow" type="subtle" size="sm">Tailwind</Badge>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="text-sm font-medium mb-2">Notifications</p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Messages</span>
          <Badge theme="red" size="sm">5</Badge>
        </div>
      </div>

      {/* Versioning */}
      <div>
        <p className="text-sm font-medium mb-2">Versions</p>
        <div className="flex gap-2">
          <Badge theme="blue">v2.0.0</Badge>
          <Badge theme="green" type="subtle">Stable</Badge>
          <Badge theme="yellow" type="subtle">Beta</Badge>
        </div>
      </div>
    </div>
}`,...(P=(G=o.parameters)==null?void 0:G.docs)==null?void 0:P.source}}};var k,L,M;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
}`,...(M=(L=c.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};const te=["Default","ThemesSolid","ThemesSubtle","Sizes","WithDot","WithDotSubtle","WithIcons","StatusBadges","UseCases","LegacyVariants"];export{t as Default,c as LegacyVariants,n as Sizes,m as StatusBadges,s as ThemesSolid,r as ThemesSubtle,o as UseCases,d as WithDot,l as WithDotSubtle,i as WithIcons,te as __namedExportsOrder,ae as default};
