import{r as s,j as e}from"./iframe-tYQsglED.js";import{t as g}from"./bundle-mjs-BZSatpsL.js";import"./preload-helper-C1FmrZbK.js";function i({min:a=0,max:r=100,step:n=1,value:q,defaultValue:Ae=0,onChange:x,disabled:t=!1,showValue:Ee=!1,formatValue:Le=B=>String(B),className:Re="","aria-label":qe="Slider",...Ze}){const[B,Ue]=s.useState(Ae),[d,T]=s.useState(!1),A=s.useRef(null),E=q!==void 0,m=E?q:B,Z=(m-a)/(r-a)*100,o=s.useCallback(l=>{const u=Math.min(r,Math.max(a,l)),f=Math.round(u/n)*n;E||Ue(f),x==null||x(f)},[E,a,r,n,x]),c=s.useCallback(l=>{if(!A.current)return m;const u=A.current.getBoundingClientRect(),f=(l-u.left)/u.width;return a+f*(r-a)},[a,r,m]),ze=s.useCallback(l=>{t||(l.preventDefault(),T(!0),o(c(l.clientX)))},[t,c,o]),L=s.useCallback(l=>{!d||t||o(c(l.clientX))},[d,t,c,o]),p=s.useCallback(()=>{T(!1)},[]),Ge=s.useCallback(l=>{t||(T(!0),o(c(l.touches[0].clientX)))},[t,c,o]),R=s.useCallback(l=>{!d||t||o(c(l.touches[0].clientX))},[d,t,c,o]),Ie=s.useCallback(l=>{if(t)return;let u=m;switch(l.key){case"ArrowRight":case"ArrowUp":l.preventDefault(),u=m+n;break;case"ArrowLeft":case"ArrowDown":l.preventDefault(),u=m-n;break;case"Home":l.preventDefault(),u=a;break;case"End":l.preventDefault(),u=r;break;default:return}o(u)},[t,m,n,a,r,o]);return s.useEffect(()=>(d&&(window.addEventListener("mousemove",L),window.addEventListener("mouseup",p),window.addEventListener("touchmove",R),window.addEventListener("touchend",p)),()=>{window.removeEventListener("mousemove",L),window.removeEventListener("mouseup",p),window.removeEventListener("touchmove",R),window.removeEventListener("touchend",p)}),[d,L,p,R]),e.jsxs("div",{className:g("flex items-center gap-[var(--slider-gap)]",t&&"opacity-50 cursor-not-allowed",Re),...Ze,children:[e.jsxs("div",{ref:A,className:g("relative flex-1 h-[var(--slider-track-height)]","bg-[var(--slider-track-bg)]","rounded-[var(--slider-track-radius)]",!t&&"cursor-pointer"),onMouseDown:ze,onTouchStart:Ge,children:[e.jsx("div",{className:g("absolute top-0 left-0 h-full","bg-[var(--slider-fill-bg)]","rounded-[var(--slider-track-radius)]","transition-none"),style:{width:`${Z}%`}}),e.jsx("div",{role:"slider",tabIndex:t?-1:0,"aria-label":qe,"aria-valuemin":a,"aria-valuemax":r,"aria-valuenow":m,"aria-disabled":t,onKeyDown:Ie,className:g("absolute top-1/2","w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]","bg-[var(--slider-thumb-bg)]","border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]","rounded-full","shadow-[var(--slider-thumb-shadow)]","transition-shadow duration-[var(--duration-fast)]",!t&&"cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",d&&!t&&"cursor-grabbing"),style:{left:`calc(${Z}% - 8px)`,marginTop:"-8px"}})]}),Ee&&e.jsx("span",{className:"text-[length:var(--slider-value-font-size)] text-[var(--color-text-default)] font-medium min-w-[3ch] text-right",children:Le(m)})]})}i.__docgenInfo={description:"",methods:[],displayName:"Slider",props:{min:{required:!1,tsType:{name:"number"},description:"Minimum value",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"Maximum value",defaultValue:{value:"100",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"Step increment",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"number"},description:"Current value (controlled)"},defaultValue:{required:!1,tsType:{name:"number"},description:"Default value (uncontrolled)",defaultValue:{value:"0",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showValue:{required:!1,tsType:{name:"boolean"},description:"Show value label",defaultValue:{value:"false",computed:!1}},formatValue:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:"Format value for display",defaultValue:{value:"(v) => String(v)",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:"Aria label",defaultValue:{value:"'Slider'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const Ke={title:"Components/Slider",component:i,parameters:{layout:"centered",docs:{description:{component:"범위 내에서 값을 선택하는 슬라이더 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{min:{control:{type:"number"},description:"최소 값"},max:{control:{type:"number"},description:"최대 값"},step:{control:{type:"number"},description:"증가 단위"},value:{control:{type:"number"},description:"현재 값 (제어)"},defaultValue:{control:{type:"number"},description:"기본 값 (비제어)"},disabled:{control:"boolean",description:"비활성화 상태"},showValue:{control:"boolean",description:"값 표시 여부"},"aria-label":{control:"text",description:"접근성 라벨"}},decorators:[a=>e.jsx("div",{style:{width:"300px"},children:e.jsx(a,{})})]},v={args:{min:0,max:100,defaultValue:50,"aria-label":"Default slider"}},h={name:"With Value Display",args:{min:0,max:100,defaultValue:50,showValue:!0,"aria-label":"Slider with value"}},b={name:"Custom Range (0-1000)",args:{min:0,max:1e3,step:50,defaultValue:500,showValue:!0,"aria-label":"Custom range slider"}},V={name:"Small Step (0.1)",args:{min:0,max:1,step:.1,defaultValue:.5,showValue:!0,formatValue:a=>a.toFixed(1),"aria-label":"Small step slider"}},w={name:"Percentage Format",args:{min:0,max:100,defaultValue:75,showValue:!0,formatValue:a=>`${a}%`,"aria-label":"Percentage slider"}},y={name:"Pixel Format",args:{min:0,max:500,step:10,defaultValue:200,showValue:!0,formatValue:a=>`${a}px`,"aria-label":"Pixel slider"}},S={name:"Currency Format",args:{min:0,max:1e3,step:10,defaultValue:500,showValue:!0,formatValue:a=>`$${a}`,"aria-label":"Currency slider"}},C={args:{min:0,max:100,defaultValue:30,disabled:!0,showValue:!0,"aria-label":"Disabled slider"}},N={name:"At Minimum",args:{min:0,max:100,defaultValue:0,showValue:!0,"aria-label":"Slider at minimum"}},j={name:"At Maximum",args:{min:0,max:100,defaultValue:100,showValue:!0,"aria-label":"Slider at maximum"}},M={render:()=>{const[a,r]=s.useState(50);return e.jsxs("div",{className:"flex flex-col gap-4 w-full",children:[e.jsx(i,{min:0,max:100,value:a,onChange:r,showValue:!0,"aria-label":"Controlled slider"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(0),className:"px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200",children:"Min"}),e.jsx("button",{onClick:()=>r(50),className:"px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200",children:"50%"}),e.jsx("button",{onClick:()=>r(100),className:"px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200",children:"Max"}),e.jsxs("span",{className:"text-sm text-gray-500 ml-auto",children:["Current: ",a]})]})]})}},k={name:"Use Case - Volume Control",render:()=>{const[a,r]=s.useState(70);return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[e.jsx("label",{className:"text-sm font-medium",children:"Volume"}),e.jsx(i,{min:0,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Volume control"})]})}},P={name:"Use Case - Brightness",render:()=>{const[a,r]=s.useState(80);return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[e.jsx("label",{className:"text-sm font-medium",children:"Brightness"}),e.jsx(i,{min:10,max:100,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Brightness control"})]})}},D={name:"Use Case - Price Filter",render:()=>{const[a,r]=s.useState(500);return e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"font-medium",children:"Max Price"}),e.jsxs("span",{className:"text-gray-500",children:["$",a]})]}),e.jsx(i,{min:0,max:1e3,step:50,value:a,onChange:r,"aria-label":"Maximum price filter"}),e.jsxs("div",{className:"flex justify-between text-xs text-gray-400",children:[e.jsx("span",{children:"$0"}),e.jsx("span",{children:"$1,000"})]})]})}},$={name:"Use Case - Zoom Level",render:()=>{const[a,r]=s.useState(100);return e.jsxs("div",{className:"flex items-center gap-3 w-full",children:[e.jsx("button",{onClick:()=>r(Math.max(25,a-25)),className:"p-1 text-gray-500 hover:text-gray-700",children:"−"}),e.jsx(i,{min:25,max:200,step:25,value:a,onChange:r,showValue:!0,formatValue:n=>`${n}%`,"aria-label":"Zoom level"}),e.jsx("button",{onClick:()=>r(Math.min(200,a+25)),className:"p-1 text-gray-500 hover:text-gray-700",children:"+"})]})}},F={name:"Multiple Sliders",render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-full",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Red"}),e.jsx(i,{min:0,max:255,defaultValue:128,showValue:!0,"aria-label":"Red channel"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Green"}),e.jsx(i,{min:0,max:255,defaultValue:200,showValue:!0,"aria-label":"Green channel"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Blue"}),e.jsx(i,{min:0,max:255,defaultValue:64,showValue:!0,"aria-label":"Blue channel"})]})]})};var U,z,G;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    'aria-label': 'Default slider'
  }
}`,...(G=(z=v.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var I,W,X;h.parameters={...h.parameters,docs:{...(I=h.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'With Value Display',
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
    'aria-label': 'Slider with value'
  }
}`,...(X=(W=h.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var _,K,O;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'Custom Range (0-1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 500,
    showValue: true,
    'aria-label': 'Custom range slider'
  }
}`,...(O=(K=b.parameters)==null?void 0:K.docs)==null?void 0:O.source}}};var H,J,Q;V.parameters={...V.parameters,docs:{...(H=V.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(Q=(J=V.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var Y,ee,ae;w.parameters={...w.parameters,docs:{...(Y=w.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'Percentage Format',
  args: {
    min: 0,
    max: 100,
    defaultValue: 75,
    showValue: true,
    formatValue: v => \`\${v}%\`,
    'aria-label': 'Percentage slider'
  }
}`,...(ae=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var re,le,se;y.parameters={...y.parameters,docs:{...(re=y.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(se=(le=y.parameters)==null?void 0:le.docs)==null?void 0:se.source}}};var te,ne,oe;S.parameters={...S.parameters,docs:{...(te=S.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(oe=(ne=S.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ue,ie,me;C.parameters={...C.parameters,docs:{...(ue=C.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 30,
    disabled: true,
    showValue: true,
    'aria-label': 'Disabled slider'
  }
}`,...(me=(ie=C.parameters)==null?void 0:ie.docs)==null?void 0:me.source}}};var ce,de,pe;N.parameters={...N.parameters,docs:{...(ce=N.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'At Minimum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 0,
    showValue: true,
    'aria-label': 'Slider at minimum'
  }
}`,...(pe=(de=N.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var xe,fe,ge;j.parameters={...j.parameters,docs:{...(xe=j.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  name: 'At Maximum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 100,
    showValue: true,
    'aria-label': 'Slider at maximum'
  }
}`,...(ge=(fe=j.parameters)==null?void 0:fe.docs)==null?void 0:ge.source}}};var ve,he,be;M.parameters={...M.parameters,docs:{...(ve=M.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(50);
    return <div className="flex flex-col gap-4 w-full">
        <Slider min={0} max={100} value={value} onChange={setValue} showValue aria-label="Controlled slider" />
        <div className="flex items-center gap-2">
          <button onClick={() => setValue(0)} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
            Min
          </button>
          <button onClick={() => setValue(50)} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
            50%
          </button>
          <button onClick={() => setValue(100)} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
            Max
          </button>
          <span className="text-sm text-gray-500 ml-auto">Current: {value}</span>
        </div>
      </div>;
  }
}`,...(be=(he=M.parameters)==null?void 0:he.docs)==null?void 0:be.source}}};var Ve,we,ye;k.parameters={...k.parameters,docs:{...(Ve=k.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Use Case - Volume Control',
  render: () => {
    const [volume, setVolume] = useState(70);
    return <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium">Volume</label>
        <Slider min={0} max={100} value={volume} onChange={setVolume} showValue formatValue={v => \`\${v}%\`} aria-label="Volume control" />
      </div>;
  }
}`,...(ye=(we=k.parameters)==null?void 0:we.docs)==null?void 0:ye.source}}};var Se,Ce,Ne;P.parameters={...P.parameters,docs:{...(Se=P.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Use Case - Brightness',
  render: () => {
    const [brightness, setBrightness] = useState(80);
    return <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium">Brightness</label>
        <Slider min={10} max={100} value={brightness} onChange={setBrightness} showValue formatValue={v => \`\${v}%\`} aria-label="Brightness control" />
      </div>;
  }
}`,...(Ne=(Ce=P.parameters)==null?void 0:Ce.docs)==null?void 0:Ne.source}}};var je,Me,ke;D.parameters={...D.parameters,docs:{...(je=D.parameters)==null?void 0:je.docs,source:{originalSource:`{
  name: 'Use Case - Price Filter',
  render: () => {
    const [maxPrice, setMaxPrice] = useState(500);
    return <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Max Price</span>
          <span className="text-gray-500">\${maxPrice}</span>
        </div>
        <Slider min={0} max={1000} step={50} value={maxPrice} onChange={setMaxPrice} aria-label="Maximum price filter" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>;
  }
}`,...(ke=(Me=D.parameters)==null?void 0:Me.docs)==null?void 0:ke.source}}};var Pe,De,$e;$.parameters={...$.parameters,docs:{...(Pe=$.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  name: 'Use Case - Zoom Level',
  render: () => {
    const [zoom, setZoom] = useState(100);
    return <div className="flex items-center gap-3 w-full">
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1 text-gray-500 hover:text-gray-700">
          −
        </button>
        <Slider min={25} max={200} step={25} value={zoom} onChange={setZoom} showValue formatValue={v => \`\${v}%\`} aria-label="Zoom level" />
        <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 text-gray-500 hover:text-gray-700">
          +
        </button>
      </div>;
  }
}`,...($e=(De=$.parameters)==null?void 0:De.docs)==null?void 0:$e.source}}};var Fe,Be,Te;F.parameters={...F.parameters,docs:{...(Fe=F.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  name: 'Multiple Sliders',
  render: () => <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Red</label>
        <Slider min={0} max={255} defaultValue={128} showValue aria-label="Red channel" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Green</label>
        <Slider min={0} max={255} defaultValue={200} showValue aria-label="Green channel" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Blue</label>
        <Slider min={0} max={255} defaultValue={64} showValue aria-label="Blue channel" />
      </div>
    </div>
}`,...(Te=(Be=F.parameters)==null?void 0:Be.docs)==null?void 0:Te.source}}};const Oe=["Default","WithValue","CustomRange","SmallStep","PercentageFormat","PixelFormat","CurrencyFormat","Disabled","AtMinimum","AtMaximum","Controlled","VolumeControl","BrightnessControl","PriceFilter","ZoomLevel","MultipleSliders"];export{j as AtMaximum,N as AtMinimum,P as BrightnessControl,M as Controlled,S as CurrencyFormat,b as CustomRange,v as Default,C as Disabled,F as MultipleSliders,w as PercentageFormat,y as PixelFormat,D as PriceFilter,V as SmallStep,k as VolumeControl,h as WithValue,$ as ZoomLevel,Oe as __namedExportsOrder,Ke as default};
