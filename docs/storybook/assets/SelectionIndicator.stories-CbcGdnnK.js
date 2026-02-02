import{j as e}from"./iframe-Dtaoqwlr.js";import{t as te}from"./bundle-mjs-BZSatpsL.js";import{C as re}from"./Chip-DmCyc_hd.js";import{I as se}from"./IconCircleX-CaL6knUH.js";import{B as Q}from"./Button-Cn98FFLP.js";import"./preload-helper-C1FmrZbK.js";import"./IconX-BLi4J-TN.js";import"./createReactComponent-oNNwel7Z.js";function g({selectedItems:t=[],onRemove:v,emptyText:b="No item selected",rightContent:x,removable:U=!0,error:Y=!1,errorMessage:Z,className:$,...ee}){const h=t.length>0,p=Y&&!h;return e.jsxs("div",{className:te("flex flex-row items-center justify-between gap-4 w-full","px-3 py-2","rounded-[var(--table-row-radius)]","min-h-[42px]",p?"bg-[var(--inline-message-error-bg)]":"bg-[var(--color-surface-subtle)]",$),role:p?"status":void 0,...ee,children:[e.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:h?t.map(u=>e.jsx(re,{value:u.label,variant:"selected",onRemove:U&&v?()=>v(u.id):void 0},u.id)):p?e.jsxs(e.Fragment,{children:[e.jsx(se,{size:16,className:"text-[var(--inline-message-error-icon)] shrink-0",strokeWidth:1.5}),e.jsx("span",{className:"text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]",children:Z||b})]}):e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:b})}),x&&e.jsx("div",{className:"flex items-center shrink-0",children:x})]})}g.__docgenInfo={description:"",methods:[],displayName:"SelectionIndicator",props:{selectedItems:{required:!1,tsType:{name:"Array",elements:[{name:"SelectionItem"}],raw:"SelectionItem[]"},description:"Selected items to display",defaultValue:{value:"[]",computed:!1}},onRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Callback when an item is removed"},emptyText:{required:!1,tsType:{name:"string"},description:"Text to show when no items are selected",defaultValue:{value:"'No item selected'",computed:!1}},rightContent:{required:!1,tsType:{name:"ReactNode"},description:"Additional content to render on the right side"},removable:{required:!1,tsType:{name:"boolean"},description:"Whether to allow removing items",defaultValue:{value:"true",computed:!1}},error:{required:!1,tsType:{name:"boolean"},description:"Whether to show error state",defaultValue:{value:"false",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message to display when in error state and no items selected"}},composes:["Omit"]};const pe={title:"Components/SelectionIndicator",component:g,tags:["autodocs"],decorators:[t=>e.jsx("div",{className:"max-w-xl",children:e.jsx(t,{})})],parameters:{docs:{description:{component:`
## SelectionIndicator 컴포넌트

선택된 항목들을 표시하는 인디케이터 컴포넌트입니다.

### 특징
- 선택된 항목을 칩으로 표시
- 개별 항목 제거 기능
- 빈 상태 및 에러 상태 표시
- 우측 커스텀 콘텐츠 영역

### Props
- **selectedItems**: 선택된 항목 배열 \`{id, label}[]\`
- **onRemove**: 항목 제거 콜백
- **emptyText**: 빈 상태 텍스트
- **error**: 에러 상태
- **errorMessage**: 에러 메시지
- **rightContent**: 우측 콘텐츠

### 사용 시기
- 다중 선택 폼
- 필터 선택 표시
- 태그 선택기

### 예시
\`\`\`tsx
<SelectionIndicator
  selectedItems={[
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
  ]}
  onRemove={(id) => handleRemove(id)}
/>
\`\`\`
        `}}},argTypes:{removable:{control:"boolean",description:"항목 제거 가능 여부",table:{defaultValue:{summary:"true"}}},error:{control:"boolean",description:"에러 상태",table:{defaultValue:{summary:"false"}}}}},r={args:{selectedItems:[],emptyText:"No items selected"}},s={args:{selectedItems:[{id:"1",label:"web-server-01"},{id:"2",label:"api-server-02"},{id:"3",label:"db-server-03"}],onRemove:t=>console.log("Remove:",t)}},a={args:{selectedItems:[{id:"1",label:"production-cluster"}],onRemove:t=>console.log("Remove:",t)}},o={args:{selectedItems:[{id:"1",label:"Fixed Item 1"},{id:"2",label:"Fixed Item 2"}],removable:!1}},n={args:{selectedItems:[],error:!0,errorMessage:"Please select at least one item"}},l={args:{selectedItems:[{id:"1",label:"Instance 1"},{id:"2",label:"Instance 2"}],onRemove:t=>console.log("Remove:",t),rightContent:e.jsx(Q,{variant:"secondary",size:"sm",children:"Clear All"})}},i={args:{selectedItems:[{id:"1",label:"server-alpha"},{id:"2",label:"server-beta"},{id:"3",label:"server-gamma"},{id:"4",label:"server-delta"},{id:"5",label:"server-epsilon"},{id:"6",label:"server-zeta"}],onRemove:t=>console.log("Remove:",t)}},d={args:{selectedItems:[],emptyText:"Click on items to select them"}},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium text-[var(--color-text-default)]",children:"Selected Instances"}),e.jsx(g,{selectedItems:[{id:"1",label:"prod-web-01"},{id:"2",label:"prod-web-02"}],onRemove:t=>console.log("Remove:",t),rightContent:e.jsx("span",{className:"text-xs text-[var(--color-text-muted)]",children:"2 selected"})})]})},m={args:{selectedItems:[],error:!0,errorMessage:"Selection required",rightContent:e.jsx(Q,{variant:"secondary",size:"sm",children:"Browse"})}};var I,f,y;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    selectedItems: [],
    emptyText: 'No items selected'
  }
}`,...(y=(f=r.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var R,S,w;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    selectedItems: [{
      id: '1',
      label: 'web-server-01'
    }, {
      id: '2',
      label: 'api-server-02'
    }, {
      id: '3',
      label: 'db-server-03'
    }],
    onRemove: id => console.log('Remove:', id)
  }
}`,...(w=(S=s.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var C,N,j;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    selectedItems: [{
      id: '1',
      label: 'production-cluster'
    }],
    onRemove: id => console.log('Remove:', id)
  }
}`,...(j=(N=a.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var T,E,q;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    selectedItems: [{
      id: '1',
      label: 'Fixed Item 1'
    }, {
      id: '2',
      label: 'Fixed Item 2'
    }],
    removable: false
  }
}`,...(q=(E=o.parameters)==null?void 0:E.docs)==null?void 0:q.source}}};var M,W,z;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    selectedItems: [],
    error: true,
    errorMessage: 'Please select at least one item'
  }
}`,...(z=(W=n.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};var B,F,k;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    selectedItems: [{
      id: '1',
      label: 'Instance 1'
    }, {
      id: '2',
      label: 'Instance 2'
    }],
    onRemove: id => console.log('Remove:', id),
    rightContent: <Button variant="secondary" size="sm">
        Clear All
      </Button>
  }
}`,...(k=(F=l.parameters)==null?void 0:F.docs)==null?void 0:k.source}}};var V,A,_;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    selectedItems: [{
      id: '1',
      label: 'server-alpha'
    }, {
      id: '2',
      label: 'server-beta'
    }, {
      id: '3',
      label: 'server-gamma'
    }, {
      id: '4',
      label: 'server-delta'
    }, {
      id: '5',
      label: 'server-epsilon'
    }, {
      id: '6',
      label: 'server-zeta'
    }],
    onRemove: id => console.log('Remove:', id)
  }
}`,...(_=(A=i.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var P,D,O;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    selectedItems: [],
    emptyText: 'Click on items to select them'
  }
}`,...(O=(D=d.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var X,G,H;c.parameters={...c.parameters,docs:{...(X=c.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-text-default)]">
        Selected Instances
      </label>
      <SelectionIndicator selectedItems={[{
      id: '1',
      label: 'prod-web-01'
    }, {
      id: '2',
      label: 'prod-web-02'
    }]} onRemove={id => console.log('Remove:', id)} rightContent={<span className="text-xs text-[var(--color-text-muted)]">2 selected</span>} />
    </div>
}`,...(H=(G=c.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,L;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    selectedItems: [],
    error: true,
    errorMessage: 'Selection required',
    rightContent: <Button variant="secondary" size="sm">
        Browse
      </Button>
  }
}`,...(L=(K=m.parameters)==null?void 0:K.docs)==null?void 0:L.source}}};const ue=["Default","WithSelectedItems","SingleSelection","NonRemovable","ErrorState","WithRightContent","ManyItems","CustomEmptyText","InFormContext","ErrorWithRightContent"];export{d as CustomEmptyText,r as Default,n as ErrorState,m as ErrorWithRightContent,c as InFormContext,i as ManyItems,o as NonRemovable,a as SingleSelection,l as WithRightContent,s as WithSelectedItems,ue as __namedExportsOrder,pe as default};
