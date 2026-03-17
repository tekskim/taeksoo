import{r as l,j as e}from"./iframe-DkQu90e3.js";import{t as f}from"./cn-8AORBNJN.js";import"./preload-helper-C1FmrZbK.js";function u({min:a=0,max:r=100,step:n=1,value:Z,defaultValue:Re=0,onChange:v,disabled:s=!1,showValue:qe=!1,formatValue:Ze=B=>String(B),fullWidth:U=!1,className:Ue="","aria-label":ze="Slider",...Ge}){const[B,Ie]=l.useState(Re),[d,T]=l.useState(!1),A=l.useRef(null),E=Z!==void 0,c=E?Z:B,L=Math.max(0,Math.min(100,(c-a)/(r-a)*100)),z=16,G=L/100*z,i=l.useCallback(t=>{const o=Math.min(r,Math.max(a,t)),x=Math.round(o/n)*n;E||Ie(x),v==null||v(x)},[E,a,r,n,v]),m=l.useCallback(t=>{if(!A.current)return c;const o=A.current.getBoundingClientRect(),x=(t-o.left)/o.width;return a+x*(r-a)},[a,r,c]),We=l.useCallback(t=>{s||(t.preventDefault(),T(!0),i(m(t.clientX)))},[s,m,i]),R=l.useCallback(t=>{!d||s||i(m(t.clientX))},[d,s,m,i]),p=l.useCallback(()=>{T(!1)},[]),Xe=l.useCallback(t=>{s||(T(!0),i(m(t.touches[0].clientX)))},[s,m,i]),q=l.useCallback(t=>{!d||s||i(m(t.touches[0].clientX))},[d,s,m,i]),_e=l.useCallback(t=>{if(s)return;let o=c;switch(t.key){case"ArrowRight":case"ArrowUp":t.preventDefault(),o=c+n;break;case"ArrowLeft":case"ArrowDown":t.preventDefault(),o=c-n;break;case"Home":t.preventDefault(),o=a;break;case"End":t.preventDefault(),o=r;break;default:return}i(o)},[s,c,n,a,r,i]);return l.useEffect(()=>(d&&(window.addEventListener("mousemove",R),window.addEventListener("mouseup",p),window.addEventListener("touchmove",q),window.addEventListener("touchend",p)),()=>{window.removeEventListener("mousemove",R),window.removeEventListener("mouseup",p),window.removeEventListener("touchmove",q),window.removeEventListener("touchend",p)}),[d,R,p,q]),e.jsxs("div",{"data-figma-name":"Slider",className:f("flex items-center gap-[var(--slider-gap)]",U&&"flex-1 min-w-0",s&&"opacity-50 cursor-not-allowed",Ue),...Ge,children:[e.jsxs("div",{ref:A,className:f("relative h-[var(--slider-track-height)]",U?"w-full":"w-[var(--slider-track-width)]","bg-[var(--slider-track-bg)]","rounded-[var(--slider-track-radius)]",!s&&"cursor-pointer"),onMouseDown:We,onTouchStart:Xe,children:[e.jsx("div",{className:f("absolute top-0 left-0 h-full","bg-[var(--slider-fill-bg)]","rounded-[var(--slider-track-radius)]","transition-none"),style:{width:`calc(${L}% - ${G-z/2}px)`}}),e.jsx("div",{role:"slider",tabIndex:s?-1:0,"aria-label":ze,"aria-valuemin":a,"aria-valuemax":r,"aria-valuenow":c,"aria-disabled":s,onKeyDown:_e,className:f("absolute top-1/2","w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]","bg-[var(--slider-thumb-bg)]","border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]","rounded-full","shadow-[var(--slider-thumb-shadow)]","transition-shadow duration-[var(--duration-fast)]",!s&&"cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",d&&!s&&"cursor-grabbing"),style:{left:`calc(${L}% - ${G}px)`,marginTop:"-8px"}})]}),qe&&e.jsx("span",{className:"text-[length:var(--slider-value-font-size)] text-[var(--color-text-default)] font-medium min-w-[3ch] text-right",children:Ze(c)})]})}u.__docgenInfo={description:"",methods:[],displayName:"Slider",props:{min:{required:!1,tsType:{name:"number"},description:"Minimum value",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"Maximum value",defaultValue:{value:"100",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"Step increment",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"number"},description:"Current value (controlled)"},defaultValue:{required:!1,tsType:{name:"number"},description:"Default value (uncontrolled)",defaultValue:{value:"0",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showValue:{required:!1,tsType:{name:"boolean"},description:"Show value label",defaultValue:{value:"false",computed:!1}},formatValue:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:"Format value for display",defaultValue:{value:"(v) => String(v)",computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Stretch track to fill available width",defaultValue:{value:"false",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:"Aria label",defaultValue:{value:"'Slider'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const Je={title:"Components/Slider",component:u,parameters:{layout:"centered",docs:{description:{component:"범위 내에서 값을 선택하는 슬라이더 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{min:{control:{type:"number"},description:"최소 값"},max:{control:{type:"number"},description:"최대 값"},step:{control:{type:"number"},description:"증가 단위"},value:{control:{type:"number"},description:"현재 값 (제어)"},defaultValue:{control:{type:"number"},description:"기본 값 (비제어)"},disabled:{control:"boolean",description:"비활성화 상태"},showValue:{control:"boolean",description:"값 표시 여부"},"aria-label":{control:"text",description:"접근성 라벨"}},decorators:[a=>e.jsx("div",{style:{width:"300px"},children:e.jsx(a,{})})]},g={args:{min:0,max:100,defaultValue:50,"aria-label":"Default slider"}},b={name:"With Value Display",args:{min:0,max:100,defaultValue:50,showValue:!0,"aria-label":"Slider with value"}},h={name:"Custom Range (0-1000)",args:{min:0,max:1e3,step:50,defaultValue:500,showValue:!0,"aria-label":"Custom range slider"}},V={name:"Small Step (0.1)",args:{min:0,max:1,step:.1,defaultValue:.5,showValue:!0,formatValue:a=>a.toFixed(1),"aria-label":"Small step slider"}},w={name:"Percentage Format",args:{min:0,max:100,defaultValue:75,showValue:!0,formatValue:a=>`${a}%`,"aria-label":"Percentage slider"}},S={name:"Pixel Format",args:{min:0,max:500,step:10,defaultValue:200,showValue:!0,formatValue:a=>`${a}px`,"aria-label":"Pixel slider"}},y={name:"Currency Format",args:{min:0,max:1e3,step:10,defaultValue:500,showValue:!0,formatValue:a=>`$${a}`,"aria-label":"Currency slider"}},C={args:{min:0,max:100,defaultValue:30,disabled:!0,showValue:!0,"aria-label":"Disabled slider"}},N={name:"At Minimum",args:{min:0,max:100,defaultValue:0,showValue:!0,"aria-label":"Slider at minimum"}},j={name:"At Maximum",args:{min:0,max:100,defaultValue:100,showValue:!0,"aria-label":"Slider at maximum"}},M={render:()=>{const[a,r]=l.useState(50);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[e.jsx(u,{min:0,max:100,value:a,onChange:r,showValue:!0,"aria-label":"Controlled slider"}),e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("button",{onClick:()=>r(0),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"Min"}),e.jsx("button",{onClick:()=>r(50),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"50%"}),e.jsx("button",{onClick:()=>r(100),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"Max"}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-subtle)] ml-auto",children:["Current: ",a]})]})]})}},k={name:"Use Case - Volume Control",render:()=>{const[a,r]=l.useState(70);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Volume"}),e.jsx(u,{min:0,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Volume control"})]})}},P={name:"Use Case - Brightness",render:()=>{const[a,r]=l.useState(80);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Brightness"}),e.jsx(u,{min:10,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Brightness control"})]})}},D={name:"Use Case - Price Filter",render:()=>{const[a,r]=l.useState(500);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsxs("div",{className:"flex justify-between text-body-md",children:[e.jsx("span",{className:"text-label-lg",children:"Max Price"}),e.jsxs("span",{className:"text-[var(--color-text-subtle)]",children:["$",a]})]}),e.jsx(u,{min:0,max:1e3,step:50,value:a,onChange:r,"aria-label":"Maximum price filter"}),e.jsxs("div",{className:"flex justify-between text-body-sm text-[var(--color-text-subtle)]",children:[e.jsx("span",{children:"$0"}),e.jsx("span",{children:"$1,000"})]})]})}},$={name:"Use Case - Zoom Level",render:()=>{const[a,r]=l.useState(100);return e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx("button",{onClick:()=>r(Math.max(25,a-25)),className:"p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]",children:"−"}),e.jsx(u,{min:25,max:200,step:25,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Zoom level"}),e.jsx("button",{onClick:()=>r(Math.min(200,a+25)),className:"p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]",children:"+"})]})}},F={name:"Multiple Sliders",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Red"}),e.jsx(u,{min:0,max:255,defaultValue:128,showValue:!0,"aria-label":"Red channel"})]}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Green"}),e.jsx(u,{min:0,max:255,defaultValue:200,showValue:!0,"aria-label":"Green channel"})]}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Blue"}),e.jsx(u,{min:0,max:255,defaultValue:64,showValue:!0,"aria-label":"Blue channel"})]})]})};var I,W,X;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    'aria-label': 'Default slider'
  }
}`,...(X=(W=g.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var _,O,K;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'With Value Display',
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
    'aria-label': 'Slider with value'
  }
}`,...(K=(O=b.parameters)==null?void 0:O.docs)==null?void 0:K.source}}};var H,J,Q;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Custom Range (0-1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 500,
    showValue: true,
    'aria-label': 'Custom range slider'
  }
}`,...(Q=(J=h.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var Y,ee,ae;V.parameters={...V.parameters,docs:{...(Y=V.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(ae=(ee=V.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var re,te,le;w.parameters={...w.parameters,docs:{...(re=w.parameters)==null?void 0:re.docs,source:{originalSource:`{
  name: 'Percentage Format',
  args: {
    min: 0,
    max: 100,
    defaultValue: 75,
    showValue: true,
    formatValue: v => \`\${v}%\`,
    'aria-label': 'Percentage slider'
  }
}`,...(le=(te=w.parameters)==null?void 0:te.docs)==null?void 0:le.source}}};var se,ne,ie;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(ie=(ne=S.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var oe,ue,ce;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ce=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:ce.source}}};var me,de,pe;C.parameters={...C.parameters,docs:{...(me=C.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 30,
    disabled: true,
    showValue: true,
    'aria-label': 'Disabled slider'
  }
}`,...(pe=(de=C.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var ve,xe,fe;N.parameters={...N.parameters,docs:{...(ve=N.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'At Minimum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 0,
    showValue: true,
    'aria-label': 'Slider at minimum'
  }
}`,...(fe=(xe=N.parameters)==null?void 0:xe.docs)==null?void 0:fe.source}}};var ge,be,he;j.parameters={...j.parameters,docs:{...(ge=j.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'At Maximum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 100,
    showValue: true,
    'aria-label': 'Slider at maximum'
  }
}`,...(he=(be=j.parameters)==null?void 0:be.docs)==null?void 0:he.source}}};var Ve,we,Se;M.parameters={...M.parameters,docs:{...(Ve=M.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
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
}`,...(Se=(we=M.parameters)==null?void 0:we.docs)==null?void 0:Se.source}}};var ye,Ce,Ne;k.parameters={...k.parameters,docs:{...(ye=k.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Use Case - Volume Control',
  render: () => {
    const [volume, setVolume] = useState(70);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Volume</label>
        <Slider min={0} max={100} value={volume} onChange={setVolume} showValue formatValue={v => \`\${v}%\`} aria-label="Volume control" />
      </div>;
  }
}`,...(Ne=(Ce=k.parameters)==null?void 0:Ce.docs)==null?void 0:Ne.source}}};var je,Me,ke;P.parameters={...P.parameters,docs:{...(je=P.parameters)==null?void 0:je.docs,source:{originalSource:`{
  name: 'Use Case - Brightness',
  render: () => {
    const [brightness, setBrightness] = useState(80);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Brightness</label>
        <Slider min={10} max={100} value={brightness} onChange={setBrightness} showValue formatValue={v => \`\${v}%\`} aria-label="Brightness control" />
      </div>;
  }
}`,...(ke=(Me=P.parameters)==null?void 0:Me.docs)==null?void 0:ke.source}}};var Pe,De,$e;D.parameters={...D.parameters,docs:{...(Pe=D.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
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
}`,...($e=(De=D.parameters)==null?void 0:De.docs)==null?void 0:$e.source}}};var Fe,Be,Te;$.parameters={...$.parameters,docs:{...(Fe=$.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
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
}`,...(Te=(Be=$.parameters)==null?void 0:Be.docs)==null?void 0:Te.source}}};var Ae,Ee,Le;F.parameters={...F.parameters,docs:{...(Ae=F.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
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
}`,...(Le=(Ee=F.parameters)==null?void 0:Ee.docs)==null?void 0:Le.source}}};const Qe=["Default","WithValue","CustomRange","SmallStep","PercentageFormat","PixelFormat","CurrencyFormat","Disabled","AtMinimum","AtMaximum","Controlled","VolumeControl","BrightnessControl","PriceFilter","ZoomLevel","MultipleSliders"];export{j as AtMaximum,N as AtMinimum,P as BrightnessControl,M as Controlled,y as CurrencyFormat,h as CustomRange,g as Default,C as Disabled,F as MultipleSliders,w as PercentageFormat,S as PixelFormat,D as PriceFilter,V as SmallStep,k as VolumeControl,b as WithValue,$ as ZoomLevel,Qe as __namedExportsOrder,Je as default};
