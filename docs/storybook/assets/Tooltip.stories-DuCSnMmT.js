import{j as e}from"./iframe-D96dQDLz.js";import{T as t}from"./Tooltip-DA-ecspq.js";import{B as o}from"./Button-BBWIKsKq.js";import{I as u}from"./IconInfoCircle-DL6dkfl5.js";import{c as X}from"./createReactComponent-Dvr8b43U.js";import"./preload-helper-C1FmrZbK.js";import"./index-Dm9gNcw7.js";import"./bundle-mjs-BZSatpsL.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",key:"svg-0"}],["path",{d:"M12 16v.01",key:"svg-1"}],["path",{d:"M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483",key:"svg-2"}]],x=X("outline","help-circle","HelpCircle",K),oe={title:"Components/Tooltip",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## Tooltip 컴포넌트

마우스 호버 또는 키보드 포커스 시 추가 정보를 표시하는 컴포넌트입니다.

### 사용 시기
- 아이콘 버튼 설명
- 용어/기능 부가 설명
- 잘린 텍스트 전체 표시
- 비활성화된 요소 이유 설명

### 주의사항
- 중요한 정보는 Tooltip에만 두지 마세요
- 모바일에서는 호버가 어려우므로 대안 고려
- 너무 긴 내용은 Popover 사용 권장

### 접근성
- 포커스 시에도 툴팁 표시
- role="tooltip" 자동 적용
- ESC로 닫기 가능
- 적절한 지연 시간 (200ms 권장)

### 예시
\`\`\`tsx
import { Tooltip } from '@thaki/tds';

// 기본 사용
<Tooltip content="추가 정보">
  <Button>호버하세요</Button>
</Tooltip>

// 위치 지정
<Tooltip content="아래에 표시" position="bottom">
  <span>텍스트</span>
</Tooltip>

// 아이콘에 사용
<Tooltip content="도움말">
  <IconInfoCircle className="cursor-help" />
</Tooltip>
\`\`\`
        `}}},argTypes:{content:{control:"text",description:"툴팁에 표시할 내용 (텍스트 또는 JSX)",table:{type:{summary:"ReactNode"}}},position:{control:"select",options:["top","bottom","left","right"],description:"툴팁 표시 위치",table:{type:{summary:'"top" | "bottom" | "left" | "right"'},defaultValue:{summary:'"top"'}}},delay:{control:"number",description:"표시까지 지연 시간 (ms)",table:{type:{summary:"number"},defaultValue:{summary:"200"}}},disabled:{control:"boolean",description:"툴팁 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}},args:{content:"Tooltip content",position:"top",delay:200}},n={render:V=>e.jsx(t,{...V,children:e.jsx(o,{children:"Hover me"})})},s={render:()=>e.jsxs("div",{className:"flex gap-8 p-12 justify-center",children:[e.jsx(t,{content:"Top tooltip",position:"top",children:e.jsx(o,{variant:"secondary",children:"Top"})}),e.jsx(t,{content:"Bottom tooltip",position:"bottom",children:e.jsx(o,{variant:"secondary",children:"Bottom"})}),e.jsx(t,{content:"Left tooltip",position:"left",children:e.jsx(o,{variant:"secondary",children:"Left"})}),e.jsx(t,{content:"Right tooltip",position:"right",children:e.jsx(o,{variant:"secondary",children:"Right"})})]})},a={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm",children:"Instance type"}),e.jsx(t,{content:"Select the compute capacity for your instance",children:e.jsx(u,{size:16,className:"text-[var(--color-text-muted)] cursor-help"})})]})},r={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx(t,{content:"Create a new item",children:e.jsx(o,{children:"Create"})}),e.jsx(t,{content:"This action is disabled",position:"bottom",children:e.jsx("span",{children:e.jsx(o,{disabled:!0,children:"Disabled"})})})]})},i={render:()=>e.jsx(t,{content:"This is a longer tooltip that provides more detailed information about the element being hovered.",children:e.jsx(o,{variant:"secondary",children:"Hover for details"})})},c={render:()=>e.jsx(t,{content:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(x,{size:14}),e.jsx("span",{children:"Click for more help"})]}),children:e.jsx(o,{variant:"ghost",icon:e.jsx(x,{size:16}),"aria-label":"Help"})})},l={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx(t,{content:"Instant (0ms)",delay:0,children:e.jsx(o,{variant:"secondary",children:"Instant"})}),e.jsx(t,{content:"Fast (100ms)",delay:100,children:e.jsx(o,{variant:"secondary",children:"Fast"})}),e.jsx(t,{content:"Default (200ms)",delay:200,children:e.jsx(o,{variant:"secondary",children:"Default"})}),e.jsx(t,{content:"Slow (500ms)",delay:500,children:e.jsx(o,{variant:"secondary",children:"Slow"})})]})},d={render:()=>e.jsx(t,{content:"This tooltip is disabled",disabled:!0,children:e.jsx(o,{children:"No tooltip"})})},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"Tab through the buttons to see tooltips on focus"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(t,{content:"First action",children:e.jsx(o,{variant:"secondary",children:"Action 1"})}),e.jsx(t,{content:"Second action",children:e.jsx(o,{variant:"secondary",children:"Action 2"})}),e.jsx(t,{content:"Third action",children:e.jsx(o,{variant:"secondary",children:"Action 3"})})]})]})},m={render:()=>e.jsx("div",{className:"w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"CPU Usage"}),e.jsx(t,{content:"Current CPU utilization across all cores",children:e.jsx(u,{size:14,className:"text-[var(--color-text-muted)] cursor-help"})})]}),e.jsx("span",{className:"text-[var(--color-state-success)]",children:"23%"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Memory"}),e.jsx(t,{content:"RAM usage including cache and buffers",children:e.jsx(u,{size:14,className:"text-[var(--color-text-muted)] cursor-help"})})]}),e.jsx("span",{className:"text-[var(--color-state-warning)]",children:"67%"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Disk I/O"}),e.jsx(t,{content:"Read/Write operations per second",children:e.jsx(u,{size:14,className:"text-[var(--color-text-muted)] cursor-help"})})]}),e.jsx("span",{children:"1.2K IOPS"})]})]})})};var h,v,f;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var j,g,T;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="flex gap-8 p-12 justify-center">
      <Tooltip content="Top tooltip" position="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
}`,...(T=(g=s.parameters)==null?void 0:g.docs)==null?void 0:T.source}}};var y,N,b;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <span className="text-sm">Instance type</span>
      <Tooltip content="Select the compute capacity for your instance">
        <IconInfoCircle size={16} className="text-[var(--color-text-muted)] cursor-help" />
      </Tooltip>
    </div>
}`,...(b=(N=a.parameters)==null?void 0:N.docs)==null?void 0:b.source}}};var B,C,I;r.parameters={...r.parameters,docs:{...(B=r.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Tooltip content="Create a new item">
        <Button>Create</Button>
      </Tooltip>
      <Tooltip content="This action is disabled" position="bottom">
        <span>
          <Button disabled>Disabled</Button>
        </span>
      </Tooltip>
    </div>
}`,...(I=(C=r.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};var S,w,z;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Tooltip content="This is a longer tooltip that provides more detailed information about the element being hovered.">
      <Button variant="secondary">Hover for details</Button>
    </Tooltip>
}`,...(z=(w=i.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var D,R,H;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <Tooltip content={<div className="flex items-center gap-2">
          <IconHelpCircle size={14} />
          <span>Click for more help</span>
        </div>}>
      <Button variant="ghost" icon={<IconHelpCircle size={16} />} aria-label="Help" />
    </Tooltip>
}`,...(H=(R=c.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var P,k,A;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Tooltip content="Instant (0ms)" delay={0}>
        <Button variant="secondary">Instant</Button>
      </Tooltip>
      <Tooltip content="Fast (100ms)" delay={100}>
        <Button variant="secondary">Fast</Button>
      </Tooltip>
      <Tooltip content="Default (200ms)" delay={200}>
        <Button variant="secondary">Default</Button>
      </Tooltip>
      <Tooltip content="Slow (500ms)" delay={500}>
        <Button variant="secondary">Slow</Button>
      </Tooltip>
    </div>
}`,...(A=(k=l.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};var F,W,M;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <Tooltip content="This tooltip is disabled" disabled>
      <Button>No tooltip</Button>
    </Tooltip>
}`,...(M=(W=d.parameters)==null?void 0:W.docs)==null?void 0:M.source}}};var O,L,U;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Tab through the buttons to see tooltips on focus
      </p>
      <div className="flex gap-4">
        <Tooltip content="First action">
          <Button variant="secondary">Action 1</Button>
        </Tooltip>
        <Tooltip content="Second action">
          <Button variant="secondary">Action 2</Button>
        </Tooltip>
        <Tooltip content="Third action">
          <Button variant="secondary">Action 3</Button>
        </Tooltip>
      </div>
    </div>
}`,...(U=(L=p.parameters)==null?void 0:L.docs)==null?void 0:U.source}}};var E,_,J;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">CPU Usage</span>
            <Tooltip content="Current CPU utilization across all cores">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span className="text-[var(--color-state-success)]">23%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Memory</span>
            <Tooltip content="RAM usage including cache and buffers">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span className="text-[var(--color-state-warning)]">67%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Disk I/O</span>
            <Tooltip content="Read/Write operations per second">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span>1.2K IOPS</span>
        </div>
      </div>
    </div>
}`,...(J=(_=m.parameters)==null?void 0:_.docs)==null?void 0:J.source}}};const ne=["Default","Positions","WithIcon","OnButton","LongContent","WithJSXContent","Delays","Disabled","FocusSupport","RealWorldExample"];export{n as Default,l as Delays,d as Disabled,p as FocusSupport,i as LongContent,r as OnButton,s as Positions,m as RealWorldExample,a as WithIcon,c as WithJSXContent,ne as __namedExportsOrder,oe as default};
