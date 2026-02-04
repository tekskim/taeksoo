import{j as e}from"./iframe-CiM_PzFy.js";import{I as O}from"./IconX-y5i2oOQF.js";import{I as R}from"./IconSquare-BVPw5d7W.js";import{I as U}from"./IconMinus-CY5VOS19.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dtj5WpGl.js";const o=({type:n,onClick:p,disabled:x=!1,className:z=""})=>{const s=()=>{switch(n){case"minimize":return e.jsx(U,{size:12,stroke:1});case"maximize":return e.jsx(R,{size:12,stroke:1});case"close":return e.jsx(O,{size:12,stroke:1})}};return e.jsx("button",{type:"button",onClick:p,disabled:x,className:`
        flex items-center justify-center
        w-[var(--window-control-size)]
        h-[var(--window-control-size)]
        rounded-[var(--window-control-radius)]
        text-[var(--color-text-default)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface-subtle)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${z}
      `,"aria-label":n,children:s()})},i=({showMinimize:n=!0,showMaximize:p=!0,showClose:x=!0,onMinimize:z,onMaximize:g,onClose:C,disabled:s=!1,className:B=""})=>e.jsxs("div",{className:`flex items-center gap-[var(--window-control-gap)] ${B}`,children:[n&&e.jsx(o,{type:"minimize",onClick:z,disabled:s}),p&&e.jsx(o,{type:"maximize",onClick:g,disabled:s}),x&&e.jsx(o,{type:"close",onClick:C,disabled:s})]});o.__docgenInfo={description:"",methods:[],displayName:"WindowControl",props:{type:{required:!0,tsType:{name:"union",raw:"'minimize' | 'maximize' | 'close'",elements:[{name:"literal",value:"'minimize'"},{name:"literal",value:"'maximize'"},{name:"literal",value:"'close'"}]},description:"Control type"},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};i.__docgenInfo={description:"",methods:[],displayName:"WindowControls",props:{showMinimize:{required:!1,tsType:{name:"boolean"},description:"Show minimize button",defaultValue:{value:"true",computed:!1}},showMaximize:{required:!1,tsType:{name:"boolean"},description:"Show maximize button",defaultValue:{value:"true",computed:!1}},showClose:{required:!1,tsType:{name:"boolean"},description:"Show close button",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Minimize click handler"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Maximize click handler"},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Close click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const Y={title:"Components/WindowControl",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{type:{control:"select",options:["minimize","maximize","close"],description:"컨트롤 타입"},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}}}},r={args:{type:"minimize",onClick:()=>console.log("Minimize")}},a={args:{type:"maximize",onClick:()=>console.log("Maximize")}},l={args:{type:"close",onClick:()=>console.log("Close")}},t={args:{type:"minimize",disabled:!0}},c={render:()=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{type:"minimize",onClick:()=>console.log("Minimize")}),e.jsx(o,{type:"maximize",onClick:()=>console.log("Maximize")}),e.jsx(o,{type:"close",onClick:()=>console.log("Close")})]})},m={render:()=>e.jsx(i,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-[var(--color-text-muted)] mb-2",children:"Close only"}),e.jsx(i,{showMinimize:!1,showMaximize:!1,onClose:()=>console.log("Close")})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-[var(--color-text-muted)] mb-2",children:"Minimize & Close"}),e.jsx(i,{showMaximize:!1,onMinimize:()=>console.log("Minimize"),onClose:()=>console.log("Close")})]})]})},u={render:()=>e.jsxs("div",{className:"flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-2",children:[e.jsx("span",{className:"text-sm font-medium",children:"Application Window"}),e.jsx(i,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})]})};var f,v,M;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    onClick: () => console.log('Minimize')
  }
}`,...(M=(v=r.parameters)==null?void 0:v.docs)==null?void 0:M.source}}};var w,y,b;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    type: 'maximize',
    onClick: () => console.log('Maximize')
  }
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var h,j,k;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    type: 'close',
    onClick: () => console.log('Close')
  }
}`,...(k=(j=l.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var W,N,S;t.parameters={...t.parameters,docs:{...(W=t.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    disabled: true
  }
}`,...(S=(N=t.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var T,q,I;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      <WindowControl type="minimize" onClick={() => console.log('Minimize')} />
      <WindowControl type="maximize" onClick={() => console.log('Maximize')} />
      <WindowControl type="close" onClick={() => console.log('Close')} />
    </div>
}`,...(I=(q=c.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var V,_,A;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
}`,...(A=(_=m.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var D,E,G;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Close only</p>
        <WindowControls showMinimize={false} showMaximize={false} onClose={() => console.log('Close')} />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Minimize & Close</p>
        <WindowControls showMaximize={false} onMinimize={() => console.log('Minimize')} onClose={() => console.log('Close')} />
      </div>
    </div>
}`,...(G=(E=d.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var H,P,$;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-2">
      <span className="text-sm font-medium">Application Window</span>
      <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
    </div>
}`,...($=(P=u.parameters)==null?void 0:P.docs)==null?void 0:$.source}}};const Z=["Minimize","Maximize","Close","Disabled","AllControls","ControlsGroup","PartialControls","InHeaderContext"];export{c as AllControls,l as Close,m as ControlsGroup,t as Disabled,u as InHeaderContext,a as Maximize,r as Minimize,d as PartialControls,Z as __namedExportsOrder,Y as default};
