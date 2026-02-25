import{r as c,j as a}from"./iframe-CsZHcOUf.js";import{t as f}from"./cn-CshvV4Tc.js";import{N as D}from"./NumberInput-C6g0Y7Ii.js";import{H as Ne}from"./Stack-CKOQlJBR.js";import"./preload-helper-C1FmrZbK.js";import"./IconChevronUp-Bv0ZBqhr.js";import"./createReactComponent-C2Lh4gVY.js";import"./IconChevronDown-CoAmE0_C.js";function x({min:t=0,max:r=100,step:n=1,value:p,defaultValue:Se=[25,75],onChange:h,disabled:s=!1,className:je="","aria-label":O="Range Slider",...Me}){const[Pe,Ve]=c.useState(Se),[g,E]=c.useState(null),$=c.useRef(null),L=p!==void 0,ke=L?p:Pe,[o,i]=ke,w=Math.max(0,Math.min(100,(o-t)/(r-t)*100)),F=Math.max(0,Math.min(100,(i-t)/(r-t)*100)),q=16,I=w/100*q,X=F/100*q,m=c.useCallback(e=>{const u=Math.min(r,Math.max(t,e[0])),l=Math.min(r,Math.max(t,e[1])),d=Math.round(u/n)*n,K=Math.round(l/n)*n,B=[Math.min(d,K),Math.max(d,K)];L||Ve(B),h==null||h(B)},[L,t,r,n,h]),v=c.useCallback(e=>{if(!$.current)return t;const u=$.current.getBoundingClientRect(),l=Math.max(0,Math.min(1,(e-u.left)/u.width));return t+l*(r-t)},[t,r]),R=c.useCallback(e=>{const u=Math.abs(e-o),l=Math.abs(e-i);return u<=l?"min":"max"},[o,i]),U=c.useCallback((e,u)=>{if(s)return;e.preventDefault();const l=v(e.clientX),d=u??R(l);E(d),m(d==="min"?[l,i]:[o,l])},[s,v,R,m,o,i]),z=c.useCallback(e=>{if(!g||s)return;const u=v(e.clientX);m(g==="min"?[Math.min(u,i),i]:[o,Math.max(u,o)])},[g,s,v,m,o,i]),b=c.useCallback(()=>{E(null)},[]),A=c.useCallback((e,u)=>{if(s)return;const l=v(e.touches[0].clientX),d=u??R(l);E(d),m(d==="min"?[l,i]:[o,l])},[s,v,R,m,o,i]),H=c.useCallback(e=>{if(!g||s)return;const u=v(e.touches[0].clientX);m(g==="min"?[Math.min(u,i),i]:[o,Math.max(u,o)])},[g,s,v,m,o,i]),_=c.useCallback((e,u)=>{if(s)return;let l;const d=u==="min"?o:i;switch(e.key){case"ArrowRight":case"ArrowUp":e.preventDefault(),l=d+n;break;case"ArrowLeft":case"ArrowDown":e.preventDefault(),l=d-n;break;case"Home":e.preventDefault(),l=t;break;case"End":e.preventDefault(),l=r;break;default:return}m(u==="min"?[Math.min(l,i),i]:[o,Math.max(l,o)])},[s,o,i,n,t,r,m]);return c.useEffect(()=>(g&&(window.addEventListener("mousemove",z),window.addEventListener("mouseup",b),window.addEventListener("touchmove",H),window.addEventListener("touchend",b)),()=>{window.removeEventListener("mousemove",z),window.removeEventListener("mouseup",b),window.removeEventListener("touchmove",H),window.removeEventListener("touchend",b)}),[g,z,b,H]),a.jsx("div",{className:f("flex items-center gap-[var(--slider-gap)]",s&&"opacity-50 cursor-not-allowed",je),...Me,children:a.jsxs("div",{ref:$,className:f("relative w-[var(--slider-track-width)] h-[var(--slider-track-height)]","bg-[var(--slider-track-bg)]","rounded-[var(--slider-track-radius)]",!s&&"cursor-pointer"),onMouseDown:e=>U(e),onTouchStart:e=>A(e),children:[a.jsx("div",{className:f("absolute top-0 h-full","bg-[var(--slider-fill-bg)]","rounded-[var(--slider-track-radius)]","transition-none"),style:{left:`calc(${w}% - ${I-q/2}px)`,width:`calc(${F-w}% - ${X-I}px)`}}),a.jsx("div",{role:"slider",tabIndex:s?-1:0,"aria-label":`${O} minimum`,"aria-valuemin":t,"aria-valuemax":i,"aria-valuenow":o,"aria-disabled":s,onKeyDown:e=>_(e,"min"),onMouseDown:e=>{e.stopPropagation(),U(e,"min")},onTouchStart:e=>{e.stopPropagation(),A(e,"min")},className:f("absolute top-1/2","w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]","bg-[var(--slider-thumb-bg)]","border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]","rounded-full","shadow-[var(--slider-thumb-shadow)]","transition-shadow duration-[var(--duration-fast)]",!s&&"cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",g==="min"&&!s&&"cursor-grabbing","z-10"),style:{left:`calc(${w}% - ${I}px)`,marginTop:"-8px"}}),a.jsx("div",{role:"slider",tabIndex:s?-1:0,"aria-label":`${O} maximum`,"aria-valuemin":o,"aria-valuemax":r,"aria-valuenow":i,"aria-disabled":s,onKeyDown:e=>_(e,"max"),onMouseDown:e=>{e.stopPropagation(),U(e,"max")},onTouchStart:e=>{e.stopPropagation(),A(e,"max")},className:f("absolute top-1/2","w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]","bg-[var(--slider-thumb-bg)]","border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]","rounded-full","shadow-[var(--slider-thumb-shadow)]","transition-shadow duration-[var(--duration-fast)]",!s&&"cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1",g==="max"&&!s&&"cursor-grabbing","z-10"),style:{left:`calc(${F}% - ${X}px)`,marginTop:"-8px"}})]})})}x.__docgenInfo={description:"",methods:[],displayName:"RangeSlider",props:{min:{required:!1,tsType:{name:"number"},description:"Minimum value",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"Maximum value",defaultValue:{value:"100",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"Step increment",defaultValue:{value:"1",computed:!1}},value:{required:!1,tsType:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},description:"Current value (controlled) - [min, max]"},defaultValue:{required:!1,tsType:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},description:"Default value (uncontrolled)",defaultValue:{value:"[25, 75]",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: [number, number]) => void",signature:{arguments:[{type:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:"Aria label",defaultValue:{value:"'Range Slider'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const Ue={title:"Components/RangeSlider",component:x,parameters:{layout:"centered",docs:{description:{component:"두 개의 thumb으로 min~max 범위를 선택하는 슬라이더 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{min:{control:{type:"number"},description:"최소 값"},max:{control:{type:"number"},description:"최대 값"},step:{control:{type:"number"},description:"증가 단위"},disabled:{control:"boolean",description:"비활성화 상태"},"aria-label":{control:"text",description:"접근성 라벨"}},decorators:[t=>a.jsx("div",{style:{width:"300px"},children:a.jsx(t,{})})]},y={args:{min:0,max:100,defaultValue:[25,75],"aria-label":"Default range slider"}},C={name:"Custom Range (0–1000)",args:{min:0,max:1e3,step:50,defaultValue:[200,800],"aria-label":"Custom range slider"}},N={name:"Small Step (0.1)",args:{min:0,max:1,step:.1,defaultValue:[.2,.8],"aria-label":"Small step range slider"}},S={args:{min:0,max:100,defaultValue:[20,60],disabled:!0,"aria-label":"Disabled range slider"}},j={name:"Full Range",args:{min:0,max:100,defaultValue:[0,100],"aria-label":"Full range slider"}},M={name:"Narrow Range",args:{min:0,max:100,defaultValue:[45,55],"aria-label":"Narrow range slider"}},P={render:function(){const[r,n]=c.useState([25,75]);return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full",children:[a.jsx(x,{min:0,max:100,value:r,onChange:n,"aria-label":"Controlled range slider"}),a.jsxs("div",{className:"flex justify-between text-body-md text-[var(--color-text-subtle)]",children:[a.jsxs("span",{children:["Min: ",r[0]]}),a.jsxs("span",{children:["Max: ",r[1]]})]}),a.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[a.jsx("button",{onClick:()=>n([0,100]),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"Reset"}),a.jsx("button",{onClick:()=>n([25,75]),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"25–75"}),a.jsx("button",{onClick:()=>n([40,60]),className:"px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]",children:"40–60"})]})]})}},V={name:"Use Case — Password Length Policy",render:function(){const[r,n]=c.useState([8,64]);return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[a.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Password Length"}),a.jsxs(Ne,{gap:3,align:"center",children:[a.jsx(D,{min:4,max:r[1],value:r[0],onChange:p=>n([p,r[1]]),width:"xs"}),a.jsx(x,{min:4,max:128,value:r,onChange:n,"aria-label":"Password length range"}),a.jsx(D,{min:r[0],max:128,value:r[1],onChange:p=>n([r[0],p]),width:"xs"})]}),a.jsxs("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:["Allowed length: ",r[0],"–",r[1]," characters"]})]})}},k={name:"Use Case — Price Range Filter",render:function(){const[r,n]=c.useState([100,500]);return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[a.jsxs("div",{className:"flex justify-between",children:[a.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Price Range"}),a.jsxs("span",{className:"text-body-md text-[var(--color-text-subtle)]",children:["$",r[0]," – $",r[1]]})]}),a.jsx(x,{min:0,max:1e3,step:10,value:r,onChange:n,"aria-label":"Price range filter"}),a.jsxs("div",{className:"flex justify-between text-body-sm text-[var(--color-text-subtle)]",children:[a.jsx("span",{children:"$0"}),a.jsx("span",{children:"$1,000"})]})]})}},T={name:"Use Case — Port Range",render:function(){const[r,n]=c.useState([8e3,9e3]);return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[a.jsx("label",{className:"text-label-lg text-[var(--color-text-default)]",children:"Port Range"}),a.jsxs(Ne,{gap:3,align:"center",children:[a.jsx(D,{min:1,max:r[1],value:r[0],onChange:p=>n([p,r[1]]),width:"xs"}),a.jsx(x,{min:1,max:65535,step:100,value:r,onChange:n,"aria-label":"Port range"}),a.jsx(D,{min:r[0],max:65535,value:r[1],onChange:p=>n([r[0],p]),width:"xs"})]})]})}};var G,J,Q;y.parameters={...y.parameters,docs:{...(G=y.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: [25, 75],
    'aria-label': 'Default range slider'
  }
}`,...(Q=(J=y.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var W,Y,Z;C.parameters={...C.parameters,docs:{...(W=C.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Custom Range (0–1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: [200, 800],
    'aria-label': 'Custom range slider'
  }
}`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,re;N.parameters={...N.parameters,docs:{...(ee=N.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Small Step (0.1)',
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: [0.2, 0.8],
    'aria-label': 'Small step range slider'
  }
}`,...(re=(ae=N.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var ne,te,se;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: [20, 60],
    disabled: true,
    'aria-label': 'Disabled range slider'
  }
}`,...(se=(te=S.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var le,oe,ie;j.parameters={...j.parameters,docs:{...(le=j.parameters)==null?void 0:le.docs,source:{originalSource:`{
  name: 'Full Range',
  args: {
    min: 0,
    max: 100,
    defaultValue: [0, 100],
    'aria-label': 'Full range slider'
  }
}`,...(ie=(oe=j.parameters)==null?void 0:oe.docs)==null?void 0:ie.source}}};var ue,ce,me;M.parameters={...M.parameters,docs:{...(ue=M.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  name: 'Narrow Range',
  args: {
    min: 0,
    max: 100,
    defaultValue: [45, 55],
    'aria-label': 'Narrow range slider'
  }
}`,...(me=(ce=M.parameters)==null?void 0:ce.docs)==null?void 0:me.source}}};var de,pe,ge;P.parameters={...P.parameters,docs:{...(de=P.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: function ControlledExample() {
    const [value, setValue] = useState<[number, number]>([25, 75]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
        <RangeSlider min={0} max={100} value={value} onChange={setValue} aria-label="Controlled range slider" />
        <div className="flex justify-between text-body-md text-[var(--color-text-subtle)]">
          <span>Min: {value[0]}</span>
          <span>Max: {value[1]}</span>
        </div>
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button onClick={() => setValue([0, 100])} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            Reset
          </button>
          <button onClick={() => setValue([25, 75])} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            25–75
          </button>
          <button onClick={() => setValue([40, 60])} className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]">
            40–60
          </button>
        </div>
      </div>;
  }
}`,...(ge=(pe=P.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};var ve,xe,be;V.parameters={...V.parameters,docs:{...(ve=V.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Use Case — Password Length Policy',
  render: function PasswordLengthExample() {
    const [range, setRange] = useState<[number, number]>([8, 64]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Password Length</label>
        <HStack gap={3} align="center">
          <NumberInput min={4} max={range[1]} value={range[0]} onChange={v => setRange([v, range[1]])} width="xs" />
          <RangeSlider min={4} max={128} value={range} onChange={setRange} aria-label="Password length range" />
          <NumberInput min={range[0]} max={128} value={range[1]} onChange={v => setRange([range[0], v])} width="xs" />
        </HStack>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          Allowed length: {range[0]}–{range[1]} characters
        </span>
      </div>;
  }
}`,...(be=(xe=V.parameters)==null?void 0:xe.docs)==null?void 0:be.source}}};var fe,he,we;k.parameters={...k.parameters,docs:{...(fe=k.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'Use Case — Price Range Filter',
  render: function PriceRangeExample() {
    const [range, setRange] = useState<[number, number]>([100, 500]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <div className="flex justify-between">
          <label className="text-label-lg text-[var(--color-text-default)]">Price Range</label>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            \${range[0]} – \${range[1]}
          </span>
        </div>
        <RangeSlider min={0} max={1000} step={10} value={range} onChange={setRange} aria-label="Price range filter" />
        <div className="flex justify-between text-body-sm text-[var(--color-text-subtle)]">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>;
  }
}`,...(we=(he=k.parameters)==null?void 0:he.docs)==null?void 0:we.source}}};var Re,ye,Ce;T.parameters={...T.parameters,docs:{...(Re=T.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'Use Case — Port Range',
  render: function PortRangeExample() {
    const [range, setRange] = useState<[number, number]>([8000, 9000]);
    return <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Port Range</label>
        <HStack gap={3} align="center">
          <NumberInput min={1} max={range[1]} value={range[0]} onChange={v => setRange([v, range[1]])} width="xs" />
          <RangeSlider min={1} max={65535} step={100} value={range} onChange={setRange} aria-label="Port range" />
          <NumberInput min={range[0]} max={65535} value={range[1]} onChange={v => setRange([range[0], v])} width="xs" />
        </HStack>
      </div>;
  }
}`,...(Ce=(ye=T.parameters)==null?void 0:ye.docs)==null?void 0:Ce.source}}};const ze=["Default","CustomRange","SmallStep","Disabled","FullRange","NarrowRange","Controlled","PasswordLengthPolicy","PriceRangeFilter","PortRange"];export{P as Controlled,C as CustomRange,y as Default,S as Disabled,j as FullRange,M as NarrowRange,V as PasswordLengthPolicy,T as PortRange,k as PriceRangeFilter,N as SmallStep,ze as __namedExportsOrder,Ue as default};
