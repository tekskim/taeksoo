import{r as l,j as e}from"./iframe-C-CGJmyb.js";import{t as f}from"./cn-CshvV4Tc.js";import"./preload-helper-C1FmrZbK.js";function u({min:a=0,max:r=100,step:n=1,value:Z,defaultValue:Le=0,onChange:v,disabled:s=!1,showValue:Re=!1,formatValue:qe=B=>String(B),className:Ze="","aria-label":Ue="Slider",...ze}){const[B,Ge]=l.useState(Le),[d,T]=l.useState(!1),A=l.useRef(null),E=Z!==void 0,c=E?Z:B,L=Math.max(0,Math.min(100,(c-a)/(r-a)*100)),U=16,z=L/100*U,o=l.useCallback(t=>{const i=Math.min(r,Math.max(a,t)),x=Math.round(i/n)*n;E||Ge(x),v==null||v(x)},[E,a,r,n,v]),m=l.useCallback(t=>{if(!A.current)return c;const i=A.current.getBoundingClientRect(),x=(t-i.left)/i.width;return a+x*(r-a)},[a,r,c]),Ie=l.useCallback(t=>{s||(t.preventDefault(),T(!0),o(m(t.clientX)))},[s,m,o]),R=l.useCallback(t=>{!d||s||o(m(t.clientX))},[d,s,m,o]),p=l.useCallback(()=>{T(!1)},[]),We=l.useCallback(t=>{s||(T(!0),o(m(t.touches[0].clientX)))},[s,m,o]),q=l.useCallback(t=>{!d||s||o(m(t.touches[0].clientX))},[d,s,m,o]),Xe=l.useCallback(t=>{if(s)return;let i=c;switch(t.key){case"ArrowRight":case"ArrowUp":t.preventDefault(),i=c+n;break;case"ArrowLeft":case"ArrowDown":t.preventDefault(),i=c-n;break;case"Home":t.preventDefault(),i=a;break;case"End":t.preventDefault(),i=r;break;default:return}o(i)},[s,c,n,a,r,o]);return l.useEffect(()=>(d&&(window.addEventListener("mousemove",R),window.addEventListener("mouseup",p),window.addEventListener("touchmove",q),window.addEventListener("touchend",p)),()=>{window.removeEventListener("mousemove",R),window.removeEventListener("mouseup",p),window.removeEventListener("touchmove",q),window.removeEventListener("touchend",p)}),[d,R,p,q]),e.jsxs("div",{className:f("flex items-center gap-[var(--slider-gap)]",s&&"opacity-50 cursor-not-allowed",Ze),...ze,children:[e.jsxs("div",{ref:A,className:f("relative flex-1 h-[var(--slider-track-height)]","bg-[var(--slider-track-bg)]","rounded-[var(--slider-track-radius)]",!s&&"cursor-pointer"),onMouseDown:Ie,onTouchStart:We,children:[e.jsx("div",{className:f("absolute top-0 left-0 h-full","bg-[var(--slider-fill-bg)]","rounded-[var(--slider-track-radius)]","transition-none"),style:{width:`calc(${L}% - ${z-U/2}px)`}}),e.jsx("div",{role:"slider",tabIndex:s?-1:0,"aria-label":Ue,"aria-valuemin":a,"aria-valuemax":r,"aria-valuenow":c,"aria-disabled":s,onKeyDown:Xe,className:f("absolute top-1/2","w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]","bg-[var(--slider-thumb-bg)]","border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]","rounded-full","shadow-[var(--slider-thumb-shadow)]","transition-shadow duration-[var(--duration-fast)]",!s&&"cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",d&&!s&&"cursor-grabbing"),style:{left:`calc(${L}% - ${z}px)`,marginTop:"-8px"}})]}),Re&&e.jsx("span",{className:"text-[length:var(--slider-value-font-size)] text-[var(--color-text-default)] font-medium min-w-[3ch] text-right",children:qe(c)})]})}u.__docgenInfo={description:"",methods:[],displayName:"Slider",props:{min:{required:!1,tsType:{name:"number"},description:"Minimum value",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"Maximum value",defaultValue:{value:"100",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"Step increment",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"number"},description:"Current value (controlled)"},defaultValue:{required:!1,tsType:{name:"number"},description:"Default value (uncontrolled)",defaultValue:{value:"0",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showValue:{required:!1,tsType:{name:"boolean"},description:"Show value label",defaultValue:{value:"false",computed:!1}},formatValue:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:"Format value for display",defaultValue:{value:"(v) => String(v)",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:"Aria label",defaultValue:{value:"'Slider'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const He={title:"Components/Slider",component:u,parameters:{layout:"centered",docs:{description:{component:"범위 내에서 값을 선택하는 슬라이더 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{min:{control:{type:"number"},description:"최소 값"},max:{control:{type:"number"},description:"최대 값"},step:{control:{type:"number"},description:"증가 단위"},value:{control:{type:"number"},description:"현재 값 (제어)"},defaultValue:{control:{type:"number"},description:"기본 값 (비제어)"},disabled:{control:"boolean",description:"비활성화 상태"},showValue:{control:"boolean",description:"값 표시 여부"},"aria-label":{control:"text",description:"접근성 라벨"}},decorators:[a=>e.jsx("div",{style:{width:"300px"},children:e.jsx(a,{})})]},g={args:{min:0,max:100,defaultValue:50,"aria-label":"Default slider"}},b={name:"With Value Display",args:{min:0,max:100,defaultValue:50,showValue:!0,"aria-label":"Slider with value"}},h={name:"Custom Range (0-1000)",args:{min:0,max:1e3,step:50,defaultValue:500,showValue:!0,"aria-label":"Custom range slider"}},V={name:"Small Step (0.1)",args:{min:0,max:1,step:.1,defaultValue:.5,showValue:!0,formatValue:a=>a.toFixed(1),"aria-label":"Small step slider"}},w={name:"Percentage Format",args:{min:0,max:100,defaultValue:75,showValue:!0,formatValue:a=>`${a}%`,"aria-label":"Percentage slider"}},S={name:"Pixel Format",args:{min:0,max:500,step:10,defaultValue:200,showValue:!0,formatValue:a=>`${a}px`,"aria-label":"Pixel slider"}},C={name:"Currency Format",args:{min:0,max:1e3,step:10,defaultValue:500,showValue:!0,formatValue:a=>`$${a}`,"aria-label":"Currency slider"}},y={args:{min:0,max:100,defaultValue:30,disabled:!0,showValue:!0,"aria-label":"Disabled slider"}},N={name:"At Minimum",args:{min:0,max:100,defaultValue:0,showValue:!0,"aria-label":"Slider at minimum"}},j={name:"At Maximum",args:{min:0,max:100,defaultValue:100,showValue:!0,"aria-label":"Slider at maximum"}},M={render:()=>{const[a,r]=l.useState(50);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(u,{min:0,max:100,value:a,onChange:r,showValue:!0,"aria-label":"Controlled slider"}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("button",{onClick:()=>r(0),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"Min"}),e.jsx("button",{onClick:()=>r(50),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"50%"}),e.jsx("button",{onClick:()=>r(100),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"Max"}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-subtle)] ml-auto",children:["Current: ",a]})]})]})}},k={name:"Use Case - Volume Control",render:()=>{const[a,r]=l.useState(70);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Volume"}),e.jsx(u,{min:0,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Volume control"})]})}},P={name:"Use Case - Brightness",render:()=>{const[a,r]=l.useState(80);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Brightness"}),e.jsx(u,{min:10,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Brightness control"})]})}},D={name:"Use Case - Price Filter",render:()=>{const[a,r]=l.useState(500);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsxs("div",{className:"flex justify-between text-body-md",children:[e.jsx("span",{className:"text-label-lg",children:"Max Price"}),e.jsxs("span",{className:"text-[var(--color-text-subtle)]",children:["$",a]})]}),e.jsx(u,{min:0,max:1e3,step:50,value:a,onChange:r,"aria-label":"Maximum price filter"}),e.jsxs("div",{className:"flex justify-between text-body-sm text-[var(--color-text-subtle)]",children:[e.jsx("span",{children:"$0"}),e.jsx("span",{children:"$1,000"})]})]})}},$={name:"Use Case - Zoom Level",render:()=>{const[a,r]=l.useState(100);return e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx("button",{onClick:()=>r(Math.max(25,a-25)),className:"p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]",children:"−"}),e.jsx(u,{min:25,max:200,step:25,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Zoom level"}),e.jsx("button",{onClick:()=>r(Math.min(200,a+25)),className:"p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]",children:"+"})]})}},F={name:"Multiple Sliders",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Red"}),e.jsx(u,{min:0,max:255,defaultValue:128,showValue:!0,"aria-label":"Red channel"})]}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Green"}),e.jsx(u,{min:0,max:255,defaultValue:200,showValue:!0,"aria-label":"Green channel"})]}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Blue"}),e.jsx(u,{min:0,max:255,defaultValue:64,showValue:!0,"aria-label":"Blue channel"})]})]})};var G,I,W;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    'aria-label': 'Default slider'
  }
}`,...(W=(I=g.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var X,_,O;b.parameters={...b.parameters,docs:{...(X=b.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'With Value Display',
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
    'aria-label': 'Slider with value'
  }
}`,...(O=(_=b.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var K,H,J;h.parameters={...h.parameters,docs:{...(K=h.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Custom Range (0-1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 500,
    showValue: true,
    'aria-label': 'Custom range slider'
  }
}`,...(J=(H=h.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Q,Y,ee;V.parameters={...V.parameters,docs:{...(Q=V.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'Small Step (0.1)',
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.5,
    showValue: true,
    formatValue: v => v.toFixed(1),
    'aria-label': 'Small step slider'
  }
}`,...(ee=(Y=V.parameters)==null?void 0:Y.docs)==null?void 0:ee.source}}};var ae,re,te;w.parameters={...w.parameters,docs:{...(ae=w.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'Percentage Format',
  args: {
    min: 0,
    max: 100,
    defaultValue: 75,
    showValue: true,
    formatValue: v => \`\${v}%\`,
    'aria-label': 'Percentage slider'
  }
}`,...(te=(re=w.parameters)==null?void 0:re.docs)==null?void 0:te.source}}};var le,se,ne;S.parameters={...S.parameters,docs:{...(le=S.parameters)==null?void 0:le.docs,source:{originalSource:`{
  name: 'Pixel Format',
  args: {
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    showValue: true,
    formatValue: v => \`\${v}px\`,
    'aria-label': 'Pixel slider'
  }
}`,...(ne=(se=S.parameters)==null?void 0:se.docs)==null?void 0:ne.source}}};var oe,ie,ue;C.parameters={...C.parameters,docs:{...(oe=C.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'Currency Format',
  args: {
    min: 0,
    max: 1000,
    step: 10,
    defaultValue: 500,
    showValue: true,
    formatValue: v => \`$\${v}\`,
    'aria-label': 'Currency slider'
  }
}`,...(ue=(ie=C.parameters)==null?void 0:ie.docs)==null?void 0:ue.source}}};var ce,me,de;y.parameters={...y.parameters,docs:{...(ce=y.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 30,
    disabled: true,
    showValue: true,
    'aria-label': 'Disabled slider'
  }
}`,...(de=(me=y.parameters)==null?void 0:me.docs)==null?void 0:de.source}}};var pe,ve,xe;N.parameters={...N.parameters,docs:{...(pe=N.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  name: 'At Minimum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 0,
    showValue: true,
    'aria-label': 'Slider at minimum'
  }
}`,...(xe=(ve=N.parameters)==null?void 0:ve.docs)==null?void 0:xe.source}}};var fe,ge,be;j.parameters={...j.parameters,docs:{...(fe=j.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'At Maximum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 100,
    showValue: true,
    'aria-label': 'Slider at maximum'
  }
}`,...(be=(ge=j.parameters)==null?void 0:ge.docs)==null?void 0:be.source}}};var he,Ve,we;M.parameters={...M.parameters,docs:{...(he=M.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(50);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
        <Slider min={0} max={100} value={value} onChange={setValue} showValue aria-label="Controlled slider" />
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button onClick={() => setValue(0)} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            Min
          </button>
          <button onClick={() => setValue(50)} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            50%
          </button>
          <button onClick={() => setValue(100)} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            Max
          </button>
          <span className="text-body-md text-[var(--color-text-subtle)] ml-auto">
            Current: {value}
          </span>
        </div>
      </div>;
  }
}`,...(we=(Ve=M.parameters)==null?void 0:Ve.docs)==null?void 0:we.source}}};var Se,Ce,ye;k.parameters={...k.parameters,docs:{...(Se=k.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Use Case - Volume Control',
  render: () => {
    const [volume, setVolume] = useState(70);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Volume</label>
        <Slider min={0} max={100} value={volume} onChange={setVolume} showValue formatValue={v => \`\${v}%\`} aria-label="Volume control" />
      </div>;
  }
}`,...(ye=(Ce=k.parameters)==null?void 0:Ce.docs)==null?void 0:ye.source}}};var Ne,je,Me;P.parameters={...P.parameters,docs:{...(Ne=P.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  name: 'Use Case - Brightness',
  render: () => {
    const [brightness, setBrightness] = useState(80);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Brightness</label>
        <Slider min={10} max={100} value={brightness} onChange={setBrightness} showValue formatValue={v => \`\${v}%\`} aria-label="Brightness control" />
      </div>;
  }
}`,...(Me=(je=P.parameters)==null?void 0:je.docs)==null?void 0:Me.source}}};var ke,Pe,De;D.parameters={...D.parameters,docs:{...(ke=D.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  name: 'Use Case - Price Filter',
  render: () => {
    const [maxPrice, setMaxPrice] = useState(500);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <div className="flex justify-between text-body-md">
          <span className="text-label-lg">Max Price</span>
          <span className="text-[var(--color-text-subtle)]">\${maxPrice}</span>
        </div>
        <Slider min={0} max={1000} step={50} value={maxPrice} onChange={setMaxPrice} aria-label="Maximum price filter" />
        <div className="flex justify-between text-body-sm text-[var(--color-text-subtle)]">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>;
  }
}`,...(De=(Pe=D.parameters)==null?void 0:Pe.docs)==null?void 0:De.source}}};var $e,Fe,Be;$.parameters={...$.parameters,docs:{...($e=$.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  name: 'Use Case - Zoom Level',
  render: () => {
    const [zoom, setZoom] = useState(100);
    return <div className="flex items-center gap-[var(--primitive-spacing-3)] w-full">
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]">
          −
        </button>
        <Slider min={25} max={200} step={25} value={zoom} onChange={setZoom} showValue formatValue={v => \`\${v}%\`} aria-label="Zoom level" />
        <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]">
          +
        </button>
      </div>;
  }
}`,...(Be=(Fe=$.parameters)==null?void 0:Fe.docs)==null?void 0:Be.source}}};var Te,Ae,Ee;F.parameters={...F.parameters,docs:{...(Te=F.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Multiple Sliders',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Red</label>
        <Slider min={0} max={255} defaultValue={128} showValue aria-label="Red channel" />
      </div>
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Green</label>
        <Slider min={0} max={255} defaultValue={200} showValue aria-label="Green channel" />
      </div>
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Blue</label>
        <Slider min={0} max={255} defaultValue={64} showValue aria-label="Blue channel" />
      </div>
    </div>
}`,...(Ee=(Ae=F.parameters)==null?void 0:Ae.docs)==null?void 0:Ee.source}}};const Je=["Default","WithValue","CustomRange","SmallStep","PercentageFormat","PixelFormat","CurrencyFormat","Disabled","AtMinimum","AtMaximum","Controlled","VolumeControl","BrightnessControl","PriceFilter","ZoomLevel","MultipleSliders"];export{j as AtMaximum,N as AtMinimum,P as BrightnessControl,M as Controlled,C as CurrencyFormat,h as CustomRange,g as Default,y as Disabled,F as MultipleSliders,w as PercentageFormat,S as PixelFormat,D as PriceFilter,V as SmallStep,k as VolumeControl,b as WithValue,$ as ZoomLevel,Je as __namedExportsOrder,He as default};
