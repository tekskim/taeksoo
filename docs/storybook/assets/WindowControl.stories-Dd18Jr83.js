import{j as e}from"./iframe-iHQO5Mqm.js";import{I as O}from"./IconX-gJXINq1T.js";import{I as R}from"./IconSquare-A_p-XpCT.js";import{I as U}from"./IconMinus-B--iY0Bg.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CEVQAvfZ.js";const o=({type:r,onClick:u,disabled:x=!1,className:g=""})=>{const i=()=>{switch(r){case"minimize":return e.jsx(U,{size:12,stroke:1});case"maximize":return e.jsx(R,{size:12,stroke:1});case"close":return e.jsx(O,{size:12,stroke:1})}};return e.jsx("button",{"data-figma-name":"WindowControl",type:"button",onClick:u,disabled:x,className:`
        flex items-center justify-center
        w-[var(--window-control-size)]
        h-[var(--window-control-size)]
        rounded-[var(--window-control-radius)]
        text-[var(--color-text-default)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface-subtle)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${g}
      `,"aria-label":r,children:i()})},s=({showMinimize:r=!0,showMaximize:u=!0,showClose:x=!0,onMinimize:g,onMaximize:z,onClose:v,disabled:i=!1,className:B=""})=>e.jsxs("div",{"data-figma-name":"WindowControls",className:`flex items-center gap-[var(--window-control-gap)] ${B}`,children:[r&&e.jsx(o,{type:"minimize",onClick:g,disabled:i}),u&&e.jsx(o,{type:"maximize",onClick:z,disabled:i}),x&&e.jsx(o,{type:"close",onClick:v,disabled:i})]});o.__docgenInfo={description:"",methods:[],displayName:"WindowControl",props:{type:{required:!0,tsType:{name:"union",raw:"'minimize' | 'maximize' | 'close'",elements:[{name:"literal",value:"'minimize'"},{name:"literal",value:"'maximize'"},{name:"literal",value:"'close'"}]},description:"Control type"},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};s.__docgenInfo={description:"",methods:[],displayName:"WindowControls",props:{showMinimize:{required:!1,tsType:{name:"boolean"},description:"Show minimize button",defaultValue:{value:"true",computed:!1}},showMaximize:{required:!1,tsType:{name:"boolean"},description:"Show maximize button",defaultValue:{value:"true",computed:!1}},showClose:{required:!1,tsType:{name:"boolean"},description:"Show close button",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Minimize click handler"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Maximize click handler"},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Close click handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const Y={title:"Components/WindowControl",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{type:{control:"select",options:["minimize","maximize","close"],description:"컨트롤 타입"},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}}}},a={args:{type:"minimize",onClick:()=>console.log("Minimize")}},n={args:{type:"maximize",onClick:()=>console.log("Maximize")}},t={args:{type:"close",onClick:()=>console.log("Close")}},l={args:{type:"minimize",disabled:!0}},c={render:()=>e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:[e.jsx(o,{type:"minimize",onClick:()=>console.log("Minimize")}),e.jsx(o,{type:"maximize",onClick:()=>console.log("Maximize")}),e.jsx(o,{type:"close",onClick:()=>console.log("Close")})]})},m={render:()=>e.jsx(s,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Close only"}),e.jsx(s,{showMinimize:!1,showMaximize:!1,onClose:()=>console.log("Close")})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Minimize & Close"}),e.jsx(s,{showMaximize:!1,onMinimize:()=>console.log("Minimize"),onClose:()=>console.log("Close")})]})]})},p={render:()=>e.jsxs("div",{className:"flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-label-md text-[var(--color-text-default)]",children:"Application Window"}),e.jsx(s,{onMinimize:()=>console.log("Minimize"),onMaximize:()=>console.log("Maximize"),onClose:()=>console.log("Close")})]})};var C,f,y;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    onClick: () => console.log('Minimize')
  }
}`,...(y=(f=a.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var w,M,b;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    type: 'maximize',
    onClick: () => console.log('Maximize')
  }
}`,...(b=(M=n.parameters)==null?void 0:M.docs)==null?void 0:b.source}}};var h,j,k;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    type: 'close',
    onClick: () => console.log('Close')
  }
}`,...(k=(j=t.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var W,N,S;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    type: 'minimize',
    disabled: true
  }
}`,...(S=(N=l.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var T,q,I;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div className="flex gap-[var(--primitive-spacing-2)]">
      <WindowControl type="minimize" onClick={() => console.log('Minimize')} />
      <WindowControl type="maximize" onClick={() => console.log('Maximize')} />
      <WindowControl type="close" onClick={() => console.log('Close')} />
    </div>
}`,...(I=(q=c.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var V,_,A;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
}`,...(A=(_=m.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var D,E,G;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(G=(E=d.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var H,P,$;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
      <span className="text-label-md text-[var(--color-text-default)]">Application Window</span>
      <WindowControls onMinimize={() => console.log('Minimize')} onMaximize={() => console.log('Maximize')} onClose={() => console.log('Close')} />
    </div>
}`,...($=(P=p.parameters)==null?void 0:P.docs)==null?void 0:$.source}}};const Z=["Minimize","Maximize","Close","Disabled","AllControls","ControlsGroup","PartialControls","InHeaderContext"];export{c as AllControls,t as Close,m as ControlsGroup,l as Disabled,p as InHeaderContext,n as Maximize,a as Minimize,d as PartialControls,Z as __namedExportsOrder,Y as default};
