import{r as n,j as e}from"./iframe-B4qQhCO6.js";import{r as _e}from"./index-DWHu83xY.js";import{t as y}from"./bundle-mjs-BZSatpsL.js";import{I as Ke}from"./IconChevronDown-BLmatsEi.js";import{I as $e}from"./IconCheck-BgbQWatL.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bds5dDb0.js";const Ve=n.createContext(null),Pe=()=>{const t=n.useContext(Ve);if(!t)throw new Error("Dropdown components must be used within a Dropdown.Root");return t};function Ie({children:t,value:a,defaultValue:s="",onChange:d,disabled:C=!1}){const[w,S]=n.useState(!1),[R,N]=n.useState(s),[j,D]=n.useState(""),[O,x]=n.useState(new Map),u=a!==void 0,b=u?a:R,r=n.useCallback((h,i,f)=>{x(B=>{const V=new Map(B);return V.set(h,{label:i,disabled:f}),V})},[]),v=n.useCallback(h=>{x(i=>{const f=new Map(i);return f.delete(h),f})},[]),m=n.useCallback((h,i)=>{u||N(h),d==null||d(h),S(!1)},[u,d]),G=n.useCallback(h=>{D(h)},[]);return e.jsx(Ve.Provider,{value:{isOpen:w,selectedValue:b,focusedValue:j,onSelect:m,onFocus:G,registerOption:r,unregisterOption:v},children:e.jsx(Te.Provider,{value:{isOpen:w,setIsOpen:S,disabled:C,options:O},children:t})})}const Te=n.createContext(null),He=()=>{const t=n.useContext(Te);if(!t)throw new Error("Dropdown components must be used within a Dropdown.Root");return t},H=n.forwardRef(({placeholder:t="Select an option",children:a,size:s="md",error:d=!1,fullWidth:C=!1,width:w="md",className:S,...R},N)=>{const j=n.useId(),D=`dropdown-trigger-${j}`,O=`dropdown-listbox-${j}`,{selectedValue:x,focusedValue:u,onFocus:b}=Pe(),{isOpen:r,setIsOpen:v,disabled:m,options:G}=He(),h=n.useRef(null),i=N||h,f=n.useRef(null),[B,V]=n.useState({top:0,left:0,width:0}),$=G.get(x),J=$==null?void 0:$.label,g=n.useCallback(()=>{const l=i.current;if(!l)return;const c=l.getBoundingClientRect();V({top:c.bottom+4,left:c.left,width:c.width})},[i]),P=n.useCallback(()=>{m||(g(),v(!0))},[m,g,v]),A=n.useCallback(()=>{var l;v(!1),(l=i.current)==null||l.focus()},[v,i]),Q=n.useCallback(l=>{if(m)return;const c=Array.from(G.entries()).filter(([,p])=>!p.disabled),k=c.findIndex(([p])=>p===u);switch(l.key){case"Enter":case" ":l.preventDefault(),r||P();break;case"ArrowDown":if(l.preventDefault(),!r)P();else{const p=k+1;p<c.length&&b(c[p][0])}break;case"ArrowUp":if(l.preventDefault(),r){const p=k-1;p>=0&&b(c[p][0])}break;case"Escape":l.preventDefault(),A();break}},[m,G,u,r,P,A,b]);n.useEffect(()=>{if(!r)return;const l=c=>{var k,p;(k=i.current)!=null&&k.contains(c.target)||(p=f.current)!=null&&p.contains(c.target)||A()};return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[r,A,i]),n.useEffect(()=>{if(r)return window.addEventListener("resize",g),window.addEventListener("scroll",g,!0),()=>{window.removeEventListener("resize",g),window.removeEventListener("scroll",g,!0)}},[r,g]);const qe={sm:"w-[160px]",md:"w-[240px]",lg:"w-[320px]"},Le=()=>C?"w-full":typeof w=="number"?`w-[${w}px]`:qe[w],Me={sm:"h-[var(--input-height-sm)] px-2 text-body-sm leading-4",md:"h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)]"},We=y("flex items-center justify-between gap-2",Le(),Me[s],"bg-[var(--select-bg)]","border border-solid rounded-[var(--select-radius)]","transition-colors duration-[var(--duration-fast)]","cursor-pointer",d?"border-[var(--input-border-error)]":r?"border-[var(--select-border-focus)]":"border-[var(--select-border)]",m&&"bg-[var(--select-bg-disabled)] border-[var(--color-border-default)] cursor-not-allowed",S),Fe=y("fixed z-[1300]","bg-[var(--select-menu-bg)]","border border-[var(--select-menu-border)]","rounded-[var(--select-menu-radius)]","shadow-[var(--select-menu-shadow)]","overflow-hidden","focus:outline-none","py-1");return e.jsxs(e.Fragment,{children:[e.jsxs("button",{ref:i,id:D,type:"button",role:"combobox","aria-expanded":r,"aria-haspopup":"listbox","aria-controls":O,disabled:m,onClick:()=>r?A():P(),onKeyDown:Q,className:We,...R,children:[e.jsx("span",{className:y("text-body-md truncate",J?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]",m&&"text-[var(--color-text-subtle)]"),children:J??t}),e.jsx(Ke,{size:16,stroke:1.5,className:y("shrink-0 transition-transform duration-[var(--duration-fast)]","text-[var(--color-text-default)]",r&&"rotate-180",m&&"text-[var(--color-text-subtle)]")})]}),r&&_e.createPortal(e.jsx("div",{ref:f,id:O,role:"listbox","aria-labelledby":D,tabIndex:-1,onKeyDown:Q,className:Fe,style:{top:B.top,left:B.left,width:B.width},children:a}),document.body)]})});H.displayName="Dropdown.Select";function Ee({value:t,label:a,disabled:s=!1,children:d,className:C,...w}){const{selectedValue:S,focusedValue:R,onSelect:N,onFocus:j,registerOption:D,unregisterOption:O}=Pe(),x=a??(typeof d=="string"?d:""),u=S===t,b=R===t;n.useEffect(()=>(D(t,x,s),()=>O(t)),[t,x,s,D,O]);const r=()=>{s||N(t,x)},v=()=>{s||j(t)};return e.jsxs("div",{role:"option","aria-selected":u,"aria-disabled":s,onClick:r,onMouseEnter:v,className:y("flex items-center justify-between","px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]","text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)]","cursor-pointer transition-colors duration-[var(--duration-fast)]",s?"text-[var(--color-text-subtle)] cursor-not-allowed":u?"bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]":b?"bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)]":"text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]",C),...w,children:[e.jsx("span",{className:"truncate",children:d}),u&&e.jsx($e,{size:14,className:"shrink-0 text-[var(--select-item-selected-text)]"})]})}function Ue({className:t,...a}){return e.jsx("div",{role:"separator",className:y("h-px bg-[var(--color-border-subtle)] my-1",t),...a})}function ze({label:t,children:a,className:s,...d}){return e.jsxs("div",{role:"group","aria-label":t,className:s,...d,children:[t&&e.jsx("div",{className:"px-[var(--select-item-padding-x)] py-1 text-body-sm text-[var(--color-text-subtle)] font-medium",children:t}),a]})}const o={Root:Ie,Select:H,Option:Ee,Divider:Ue,Group:ze};Ie.__docgenInfo={description:"",methods:[],displayName:"DropdownRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Children (Dropdown.Select, Dropdown.ComboBox)"},value:{required:!1,tsType:{name:"string"},description:"Controlled value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Default value",defaultValue:{value:"''",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}}}};H.__docgenInfo={description:"",methods:[],displayName:"Dropdown.Select",props:{placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text",defaultValue:{value:"'Select an option'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Children (Dropdown.Option)"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Size variant",defaultValue:{value:"'md'",computed:!1}},error:{required:!1,tsType:{name:"boolean"},description:"Error state",defaultValue:{value:"false",computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},width:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg' | number",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"number"}]},description:"Width",defaultValue:{value:"'md'",computed:!1}}},composes:["Omit"]};Ee.__docgenInfo={description:"",methods:[],displayName:"DropdownOption",props:{value:{required:!0,tsType:{name:"string"},description:"Option value"},label:{required:!1,tsType:{name:"string"},description:"Option label (defaults to children)"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Children"}},composes:["HTMLAttributes"]};Ue.__docgenInfo={description:"",methods:[],displayName:"DropdownDivider"};ze.__docgenInfo={description:"",methods:[],displayName:"DropdownGroup",props:{label:{required:!1,tsType:{name:"string"},description:"Group label"},children:{required:!0,tsType:{name:"ReactNode"},description:"Children"}},composes:["HTMLAttributes"]};const to={title:"Components/Dropdown",component:o.Root,parameters:{layout:"centered"}},I={render:()=>e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select an option",width:"md",children:[e.jsx(o.Option,{value:"apple",children:"Apple"}),e.jsx(o.Option,{value:"banana",children:"Banana"}),e.jsx(o.Option,{value:"cherry",children:"Cherry"}),e.jsx(o.Option,{value:"grape",children:"Grape"})]})})},T={render:()=>e.jsx(o.Root,{defaultValue:"banana",children:e.jsxs(o.Select,{placeholder:"Select a fruit",width:"md",children:[e.jsx(o.Option,{value:"apple",children:"Apple"}),e.jsx(o.Option,{value:"banana",children:"Banana"}),e.jsx(o.Option,{value:"cherry",children:"Cherry"})]})})},E={render:()=>{const[t,a]=n.useState("cherry");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(o.Root,{value:t,onChange:a,children:e.jsxs(o.Select,{placeholder:"Select a fruit",width:"md",children:[e.jsx(o.Option,{value:"apple",children:"Apple"}),e.jsx(o.Option,{value:"banana",children:"Banana"}),e.jsx(o.Option,{value:"cherry",children:"Cherry"})]})}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("strong",{children:t})]})]})}},U={render:()=>e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select an option",width:"md",children:[e.jsx(o.Option,{value:"available",children:"Available"}),e.jsx(o.Option,{value:"disabled1",disabled:!0,children:"Disabled Option 1"}),e.jsx(o.Option,{value:"another",children:"Another Option"}),e.jsx(o.Option,{value:"disabled2",disabled:!0,children:"Disabled Option 2"})]})})},z={render:()=>e.jsx(o.Root,{disabled:!0,defaultValue:"apple",children:e.jsxs(o.Select,{placeholder:"Select a fruit",width:"md",children:[e.jsx(o.Option,{value:"apple",children:"Apple"}),e.jsx(o.Option,{value:"banana",children:"Banana"})]})})},q={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 items-start",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Small"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",size:"sm",width:"sm",children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Medium (default)"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",size:"md",width:"md",children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]})]})},L={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 items-start",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Small (160px)"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",width:"sm",children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Medium (240px)"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",width:"md",children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Large (320px)"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",width:"lg",children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]}),e.jsxs("div",{className:"w-full max-w-md",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Full Width"}),e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select",fullWidth:!0,children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})})]})]})},M={render:()=>e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select a region",width:"lg",children:[e.jsxs(o.Group,{label:"Asia Pacific",children:[e.jsx(o.Option,{value:"ap-northeast-1",children:"Tokyo (ap-northeast-1)"}),e.jsx(o.Option,{value:"ap-northeast-2",children:"Seoul (ap-northeast-2)"}),e.jsx(o.Option,{value:"ap-southeast-1",children:"Singapore (ap-southeast-1)"})]}),e.jsx(o.Divider,{}),e.jsxs(o.Group,{label:"United States",children:[e.jsx(o.Option,{value:"us-east-1",children:"N. Virginia (us-east-1)"}),e.jsx(o.Option,{value:"us-west-2",children:"Oregon (us-west-2)"})]}),e.jsx(o.Divider,{}),e.jsxs(o.Group,{label:"Europe",children:[e.jsx(o.Option,{value:"eu-west-1",children:"Ireland (eu-west-1)"}),e.jsx(o.Option,{value:"eu-central-1",children:"Frankfurt (eu-central-1)"})]})]})})},W={render:()=>e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select action",width:"md",children:[e.jsx(o.Option,{value:"edit",children:"Edit"}),e.jsx(o.Option,{value:"duplicate",children:"Duplicate"}),e.jsx(o.Divider,{}),e.jsx(o.Option,{value:"archive",children:"Archive"}),e.jsx(o.Option,{value:"move",children:"Move"}),e.jsx(o.Divider,{}),e.jsx(o.Option,{value:"delete",children:"Delete"})]})})},F={render:()=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o.Root,{children:e.jsxs(o.Select,{placeholder:"Select a value",width:"md",error:!0,children:[e.jsx(o.Option,{value:"a",children:"Option A"}),e.jsx(o.Option,{value:"b",children:"Option B"})]})}),e.jsx("p",{className:"text-body-sm text-[var(--color-state-danger)]",children:"This field is required"})]})},_={render:()=>e.jsx(o.Root,{children:e.jsx(o.Select,{placeholder:"Select a country",width:"lg",children:["United States","Canada","United Kingdom","Germany","France","Italy","Spain","Japan","South Korea","China","Australia","Brazil","India","Mexico","Russia"].map(t=>e.jsx(o.Option,{value:t.toLowerCase().replace(" ","-"),children:t},t))})})},K={name:"thaki-ui Style (Compound Pattern)",render:()=>{const[t,a]=n.useState("");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-heading-h6 text-[var(--color-text-default)]",children:"thaki-ui Compound Component Pattern"}),e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"This follows the thaki-ui Dropdown pattern with Dropdown.Root, Dropdown.Select, and Dropdown.Option components."}),e.jsx(o.Root,{value:t,onChange:a,children:e.jsxs(o.Select,{placeholder:"Select instance type",width:"lg",children:[e.jsxs(o.Group,{label:"General Purpose",children:[e.jsx(o.Option,{value:"m5.large",children:"m5.large (2 vCPU, 8 GB)"}),e.jsx(o.Option,{value:"m5.xlarge",children:"m5.xlarge (4 vCPU, 16 GB)"}),e.jsx(o.Option,{value:"m5.2xlarge",children:"m5.2xlarge (8 vCPU, 32 GB)"})]}),e.jsx(o.Divider,{}),e.jsxs(o.Group,{label:"Compute Optimized",children:[e.jsx(o.Option,{value:"c5.large",children:"c5.large (2 vCPU, 4 GB)"}),e.jsx(o.Option,{value:"c5.xlarge",children:"c5.xlarge (4 vCPU, 8 GB)"})]}),e.jsx(o.Divider,{}),e.jsxs(o.Group,{label:"Memory Optimized",children:[e.jsx(o.Option,{value:"r5.large",children:"r5.large (2 vCPU, 16 GB)"}),e.jsx(o.Option,{value:"r5.xlarge",children:"r5.xlarge (4 vCPU, 32 GB)"})]})]})}),t&&e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("code",{className:"text-body-sm",children:t})]})]})}};var X,Y,Z;I.parameters={...I.parameters,docs:{...(X=I.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Dropdown.Root>
      <Dropdown.Select placeholder="Select an option" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
        <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
        <Dropdown.Option value="grape">Grape</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(Z=(Y=I.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,oe,te;T.parameters={...T.parameters,docs:{...(ee=T.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <Dropdown.Root defaultValue="banana">
      <Dropdown.Select placeholder="Select a fruit" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
        <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(te=(oe=T.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};var ne,re,ae;E.parameters={...E.parameters,docs:{...(ne=E.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('cherry');
    return <div className="flex flex-col gap-4">
        <Dropdown.Root value={value} onChange={setValue}>
          <Dropdown.Select placeholder="Select a fruit" width="md">
            <Dropdown.Option value="apple">Apple</Dropdown.Option>
            <Dropdown.Option value="banana">Banana</Dropdown.Option>
            <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>;
  }
}`,...(ae=(re=E.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var le,se,de;U.parameters={...U.parameters,docs:{...(le=U.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <Dropdown.Root>
      <Dropdown.Select placeholder="Select an option" width="md">
        <Dropdown.Option value="available">Available</Dropdown.Option>
        <Dropdown.Option value="disabled1" disabled>
          Disabled Option 1
        </Dropdown.Option>
        <Dropdown.Option value="another">Another Option</Dropdown.Option>
        <Dropdown.Option value="disabled2" disabled>
          Disabled Option 2
        </Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(de=(se=U.parameters)==null?void 0:se.docs)==null?void 0:de.source}}};var ie,pe,ce;z.parameters={...z.parameters,docs:{...(ie=z.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <Dropdown.Root disabled defaultValue="apple">
      <Dropdown.Select placeholder="Select a fruit" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(ce=(pe=z.parameters)==null?void 0:pe.docs)==null?void 0:ce.source}}};var ue,me,he;q.parameters={...q.parameters,docs:{...(ue=q.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 items-start">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" size="sm" width="sm">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium (default)</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" size="md" width="md">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
    </div>
}`,...(he=(me=q.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};var we,xe,ve;L.parameters={...L.parameters,docs:{...(we=L.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 items-start">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small (160px)</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="sm">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium (240px)</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="md">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Large (320px)</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="lg">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div className="w-full max-w-md">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Full Width</h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" fullWidth>
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
    </div>
}`,...(ve=(xe=L.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var De,Oe,be;M.parameters={...M.parameters,docs:{...(De=M.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <Dropdown.Root>
      <Dropdown.Select placeholder="Select a region" width="lg">
        <Dropdown.Group label="Asia Pacific">
          <Dropdown.Option value="ap-northeast-1">Tokyo (ap-northeast-1)</Dropdown.Option>
          <Dropdown.Option value="ap-northeast-2">Seoul (ap-northeast-2)</Dropdown.Option>
          <Dropdown.Option value="ap-southeast-1">Singapore (ap-southeast-1)</Dropdown.Option>
        </Dropdown.Group>
        <Dropdown.Divider />
        <Dropdown.Group label="United States">
          <Dropdown.Option value="us-east-1">N. Virginia (us-east-1)</Dropdown.Option>
          <Dropdown.Option value="us-west-2">Oregon (us-west-2)</Dropdown.Option>
        </Dropdown.Group>
        <Dropdown.Divider />
        <Dropdown.Group label="Europe">
          <Dropdown.Option value="eu-west-1">Ireland (eu-west-1)</Dropdown.Option>
          <Dropdown.Option value="eu-central-1">Frankfurt (eu-central-1)</Dropdown.Option>
        </Dropdown.Group>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(be=(Oe=M.parameters)==null?void 0:Oe.docs)==null?void 0:be.source}}};var fe,ge,Se;W.parameters={...W.parameters,docs:{...(fe=W.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <Dropdown.Root>
      <Dropdown.Select placeholder="Select action" width="md">
        <Dropdown.Option value="edit">Edit</Dropdown.Option>
        <Dropdown.Option value="duplicate">Duplicate</Dropdown.Option>
        <Dropdown.Divider />
        <Dropdown.Option value="archive">Archive</Dropdown.Option>
        <Dropdown.Option value="move">Move</Dropdown.Option>
        <Dropdown.Divider />
        <Dropdown.Option value="delete">Delete</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(Se=(ge=W.parameters)==null?void 0:ge.docs)==null?void 0:Se.source}}};var je,ye,Ce;F.parameters={...F.parameters,docs:{...(je=F.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      <Dropdown.Root>
        <Dropdown.Select placeholder="Select a value" width="md" error>
          <Dropdown.Option value="a">Option A</Dropdown.Option>
          <Dropdown.Option value="b">Option B</Dropdown.Option>
        </Dropdown.Select>
      </Dropdown.Root>
      <p className="text-body-sm text-[var(--color-state-danger)]">This field is required</p>
    </div>
}`,...(Ce=(ye=F.parameters)==null?void 0:ye.docs)==null?void 0:Ce.source}}};var Re,Ne,Ge;_.parameters={..._.parameters,docs:{...(Re=_.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <Dropdown.Root>
      <Dropdown.Select placeholder="Select a country" width="lg">
        {['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'China', 'Australia', 'Brazil', 'India', 'Mexico', 'Russia'].map(country => <Dropdown.Option key={country} value={country.toLowerCase().replace(' ', '-')}>
            {country}
          </Dropdown.Option>)}
      </Dropdown.Select>
    </Dropdown.Root>
}`,...(Ge=(Ne=_.parameters)==null?void 0:Ne.docs)==null?void 0:Ge.source}}};var Be,Ae,ke;K.parameters={...K.parameters,docs:{...(Be=K.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  name: 'thaki-ui Style (Compound Pattern)',
  render: () => {
    const [value, setValue] = useState('');
    return <div className="flex flex-col gap-4">
        <h3 className="text-heading-h6 text-[var(--color-text-default)]">
          thaki-ui Compound Component Pattern
        </h3>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          This follows the thaki-ui Dropdown pattern with Dropdown.Root, Dropdown.Select, and
          Dropdown.Option components.
        </p>

        <Dropdown.Root value={value} onChange={setValue}>
          <Dropdown.Select placeholder="Select instance type" width="lg">
            <Dropdown.Group label="General Purpose">
              <Dropdown.Option value="m5.large">m5.large (2 vCPU, 8 GB)</Dropdown.Option>
              <Dropdown.Option value="m5.xlarge">m5.xlarge (4 vCPU, 16 GB)</Dropdown.Option>
              <Dropdown.Option value="m5.2xlarge">m5.2xlarge (8 vCPU, 32 GB)</Dropdown.Option>
            </Dropdown.Group>
            <Dropdown.Divider />
            <Dropdown.Group label="Compute Optimized">
              <Dropdown.Option value="c5.large">c5.large (2 vCPU, 4 GB)</Dropdown.Option>
              <Dropdown.Option value="c5.xlarge">c5.xlarge (4 vCPU, 8 GB)</Dropdown.Option>
            </Dropdown.Group>
            <Dropdown.Divider />
            <Dropdown.Group label="Memory Optimized">
              <Dropdown.Option value="r5.large">r5.large (2 vCPU, 16 GB)</Dropdown.Option>
              <Dropdown.Option value="r5.xlarge">r5.xlarge (4 vCPU, 32 GB)</Dropdown.Option>
            </Dropdown.Group>
          </Dropdown.Select>
        </Dropdown.Root>

        {value && <p className="text-body-sm text-[var(--color-text-muted)]">
            Selected: <code className="text-body-sm">{value}</code>
          </p>}
      </div>;
  }
}`,...(ke=(Ae=K.parameters)==null?void 0:Ae.docs)==null?void 0:ke.source}}};const no=["Default","WithDefaultValue","Controlled","WithDisabledOptions","Disabled","Sizes","Widths","WithGroups","WithDividers","ErrorState","LongList","ThakiUIStyle"];export{E as Controlled,I as Default,z as Disabled,F as ErrorState,_ as LongList,q as Sizes,K as ThakiUIStyle,L as Widths,T as WithDefaultValue,U as WithDisabledOptions,W as WithDividers,M as WithGroups,no as __namedExportsOrder,to as default};
