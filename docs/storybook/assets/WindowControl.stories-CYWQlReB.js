import{j as e}from"./iframe-BGa_n0Au.js";import{I as Y}from"./IconX-Cu2ORRPW.js";import{a as Z,I as ee}from"./IconSquares-BdpgDDa1.js";import{I as oe}from"./IconMinus-QE_SmDkA.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-B5dOz73m.js";const o=({type:s,isMaximized:a=!1,onClick:z,disabled:v=!1,className:f=""})=>{const r=()=>{switch(s){case"minimize":return e.jsx(oe,{size:12,stroke:1});case"maximize":return a?e.jsx(Z,{size:12,stroke:1}):e.jsx(ee,{size:12,stroke:1});case"close":return e.jsx(Y,{size:12,stroke:1})}},C=s==="maximize"?a?"Restore":"Maximize":s;return e.jsx("button",{"data-figma-name":"[TDS] FrameControls",type:"button",onClick:z,disabled:v,className:`
        flex items-center justify-center
        w-[var(--window-control-size)]
        h-[var(--window-control-size)]
        rounded-[var(--window-control-radius)]
        text-[var(--color-text-default)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface-subtle)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${f}
      `,"aria-label":C,children:r()})},i=({showMinimize:s=!0,showMaximize:a=!0,showClose:z=!0,isMaximized:v=!1,onMinimize:f,onMaximize:M,onClose:y,disabled:r=!1,className:C=""})=>e.jsxs("div",{"data-figma-name":"[TDS] FrameControls",className:`flex items-center gap-[var(--window-control-gap)] ${C}`,children:[s&&e.jsx(o,{type:"minimize",onClick:f,disabled:r}),a&&e.jsx(o,{type:"maximize",isMaximized:v,onClick:M,disabled:r}),z&&e.jsx(o,{type:"close",onClick:y,disabled:r})]});o.__docgenInfo={description:"",methods:[],displayName:"WindowControl",props:{type:{required:!0,tsType:{name:"union",raw:"'minimize' | 'maximize' | 'close'",elements:[{name:"literal",value:"'minimize'"},{name:"literal",value:"'maximize'"},{name:"literal",value:"'close'"}]},description:"Control type"},isMaximized:{required:!1,tsType:{name:"boolean"},description:"Whether the window is currently maximized (only affects maximize button icon)",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};i.__docgenInfo={description:"",methods:[],displayName:"WindowControls",props:{showMinimize:{required:!1,tsType:{name:"boolean"},description:"Show minimize button",defaultValue:{value:"true",computed:!1}},showMaximize:{required:!1,tsType:{name:"boolean"},description:"Show maximize button",defaultValue:{value:"true",computed:!1}},showClose:{required:!1,tsType:{name:"boolean"},description:"Show close button",defaultValue:{value:"true",computed:!1}},isMaximized:{required:!1,tsType:{name:"boolean"},description:"Whether the window is currently maximized",defaultValue:{value:"false",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Minimize click handler"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Maximize click handler"},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Close click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const le={title:"Components/WindowControl",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
## WindowControl 컴포넌트

윈도우 컨트롤 버튼 (최소화, 최대화, 닫기)을 제공하는 컴포넌트입니다.

### 구성 요소
- **WindowControl**: 개별 컨트롤 버튼
- **WindowControls**: 컨트롤 버튼 그룹

### 타입
- **minimize**: 최소화 버튼 (-)
- **maximize**: 최대화 버튼 (□)
- **close**: 닫기 버튼 (×)

### 사용 시기
- 데스크톱 앱 스타일 UI
- 모달/다이얼로그 헤더
- TabBar와 함께 사용

### 예시
\`\`\`tsx
<WindowControls
  onMinimize={() => {}}
  onMaximize={() => {}}
  onClose={() => {}}
/>
\`\`\`
        `}}},argTypes:{type:{control:"select",options:["minimize","maximize","close"],description:"컨트롤 타입"},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}}}},n={args:{type:"minimize",onClick:()=>console.log("Minimize")}},t={args:{type:"maximize",onClick:()=>console.log("Maximize")}},l={args:{type:"maximize",isMaximized:!0,onClick:()=>console.log("Restore")}},c={args:{type:"close",onClick:()=>console.log("Close")}},m={args:{type:"minimize",disabled:!0}},d={render:()=>e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:[e.jsx(o,{type:"minimize",onClick:()=>console.log("Minimize")}),e.jsx(o,{type:"maximize",onClick:()=>console.log("Maximize")}),e.jsx(o,{type:"close",onClick:()=>console.log("Close")})]})},p={render:()=>e.jsx(i,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})},u={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Close only"}),e.jsx(i,{showMinimize:!1,showMaximize:!1,onClose:()=>console.log("Close")})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Minimize & Close"}),e.jsx(i,{showMaximize:!1,onMinimize:()=>console.log("Minimize"),onClose:()=>console.log("Close")})]})]})},x={render:()=>e.jsxs("div",{className:"flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:"Application Window"}),e.jsx(i,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})]})},g={render:()=>e.jsxs("div",{className:"flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:"Application Window (Maximized)"}),e.jsx(i,{isMaximized:!0,onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Restore"),onClose:()=>console.log("Close")})]})};var b,w,h;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    onClick: () => console.log('Minimize')
  }
}`,...(h=(w=n.parameters)==null?void 0:w.docs)==null?void 0:h.source}}};var j,k,W;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    type: 'maximize',
    onClick: () => console.log('Maximize')
  }
}`,...(W=(k=t.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};var N,S,T;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    type: 'maximize',
    isMaximized: true,
    onClick: () => console.log('Restore')
  }
}`,...(T=(S=l.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var q,I,V;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    type: 'close',
    onClick: () => console.log('Close')
  }
}`,...(V=(I=c.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var R,A,D;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    disabled: true
  }
}`,...(D=(A=m.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var _,H,E;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="flex gap-[var(--primitive-spacing-2)]">
      <WindowControl type="minimize" onClick={() => console.log('Minimize')} />
      <WindowControl type="maximize" onClick={() => console.log('Maximize')} />
      <WindowControl type="close" onClick={() => console.log('Close')} />
    </div>
}`,...(E=(H=d.parameters)==null?void 0:H.docs)==null?void 0:E.source}}};var F,G,P;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
}`,...(P=(G=p.parameters)==null?void 0:G.docs)==null?void 0:P.source}}};var $,B,L;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Close only
        </p>
        <WindowControls showMinimize={false} showMaximize={false} onClose={() => console.log('Close')} />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Minimize & Close
        </p>
        <WindowControls showMaximize={false} onMinimize={() => console.log('Minimize')} onClose={() => console.log('Close')} />
      </div>
    </div>
}`,...(L=(B=u.parameters)==null?void 0:B.docs)==null?void 0:L.source}}};var O,U,X;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
      <span className="text-label-md text-[var(--color-text-default)]">Application Window</span>
      <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
    </div>
}`,...(X=(U=x.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var J,K,Q;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
      <span className="text-label-md text-[var(--color-text-default)]">
        Application Window (Maximized)
      </span>
      <WindowControls isMaximized onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Restore')} onClose={() => console.log('Close')} />
    </div>
}`,...(Q=(K=g.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const ce=["Minimize","Maximize","Restore","Close","Disabled","AllControls","ControlsGroup","PartialControls","InHeaderContext","InHeaderContextMaximized"];export{d as AllControls,c as Close,p as ControlsGroup,m as Disabled,x as InHeaderContext,g as InHeaderContextMaximized,t as Maximize,n as Minimize,u as PartialControls,l as Restore,ce as __namedExportsOrder,le as default};
