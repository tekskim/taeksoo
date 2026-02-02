import{r as t,j as e}from"./iframe-Dtaoqwlr.js";import{t as A}from"./bundle-mjs-BZSatpsL.js";import{I as ve}from"./IconChevronDown-Cq_QoJmu.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-oNNwel7Z.js";const ue=t.createContext(null),ge=()=>{const o=t.useContext(ue);if(!o)throw new Error("Accordion components must be used within an Accordion.Root");return o},he=t.createContext(null),Ae=()=>{const o=t.useContext(he);if(!o)throw new Error("Accordion.Trigger and Accordion.Panel must be used within an Accordion.Item");return o},R=t.forwardRef(({allowMultiple:o=!1,defaultExpanded:n=[],expanded:s,onChange:i,variant:a="default",children:l,className:m,...u},x)=>{const[c,g]=t.useState(n),p=s!==void 0,d=p?s:c,E=t.useCallback(f=>{let h;d.includes(f)?h=d.filter(be=>be!==f):o?h=[...d,f]:h=[f],p||g(h),i==null||i(h)},[d,o,p,i]),fe={default:"",bordered:"border border-[var(--color-border-default)] rounded-[var(--radius-md)]",separated:"space-y-2"};return e.jsx(ue.Provider,{value:{expandedItems:d,toggleItem:E,allowMultiple:o,variant:a},children:e.jsx("div",{ref:x,className:A(fe[a],m),...u,children:l})})});R.displayName="Accordion.Root";const k=t.forwardRef(({id:o,disabled:n=!1,children:s,className:i,...a},l)=>{const{expandedItems:m,variant:u}=ge(),x=t.useId(),c=m.includes(o),g=`accordion-trigger-${x}`,p=`accordion-panel-${x}`,d={default:"border-b border-[var(--color-border-subtle)] last:border-b-0",bordered:"border-b border-[var(--color-border-subtle)] last:border-b-0",separated:"border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden"};return e.jsx(he.Provider,{value:{itemId:o,isExpanded:c,triggerId:g,panelId:p},children:e.jsx("div",{ref:l,"data-state":c?"open":"closed","data-disabled":n||void 0,className:A(d[u],n&&"opacity-50",i),...a,children:s})})});k.displayName="Accordion.Item";const q=t.forwardRef(({children:o,iconPosition:n="right",hideIcon:s=!1,className:i,...a},l)=>{const{toggleItem:m,variant:u}=ge(),{itemId:x,isExpanded:c,triggerId:g,panelId:p}=Ae(),d=()=>{m(x)},E={default:"",bordered:c?"bg-[var(--color-surface-subtle)]":"",separated:c?"bg-[var(--color-surface-subtle)]":""};return e.jsxs("button",{ref:l,type:"button",id:g,"aria-expanded":c,"aria-controls":p,onClick:d,className:A("flex items-center justify-between w-full","px-4 py-3","text-body-md font-medium text-[var(--color-text-default)]","cursor-pointer","hover:bg-[var(--color-surface-subtle)]","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-action-primary)]",E[u],n==="left"&&"flex-row-reverse",i),...a,children:[e.jsx("span",{className:"flex-1 text-left",children:o}),!s&&e.jsx(ve,{size:16,stroke:1.5,className:A("shrink-0 text-[var(--color-text-muted)]","transition-transform duration-[var(--duration-fast)]",c&&"rotate-180",n==="left"&&"mr-2",n==="right"&&"ml-2")})]})});q.displayName="Accordion.Trigger";const M=t.forwardRef(({children:o,className:n,...s},i)=>{const{isExpanded:a,triggerId:l,panelId:m}=Ae();return a?e.jsx("div",{ref:i,id:m,role:"region","aria-labelledby":l,className:A("px-4 py-3 text-body-md text-[var(--color-text-default)]",n),...s,children:o}):null});M.displayName="Accordion.Panel";const r={Root:R,Item:k,Trigger:q,Panel:M};R.__docgenInfo={description:"",methods:[],displayName:"Accordion.Root",props:{allowMultiple:{required:!1,tsType:{name:"boolean"},description:"Allow multiple items to be expanded",defaultValue:{value:"false",computed:!1}},defaultExpanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"Default expanded items",defaultValue:{value:"[]",computed:!1}},expanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"Controlled expanded items"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(expanded: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"expanded"}],return:{name:"void"}}},description:"Callback when expanded items change"},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'bordered' | 'separated'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'bordered'"},{name:"literal",value:"'separated'"}]},description:"Visual variant",defaultValue:{value:"'default'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Children (Accordion.Item)"}},composes:["HTMLAttributes"]};k.__docgenInfo={description:"",methods:[],displayName:"Accordion.Item",props:{id:{required:!0,tsType:{name:"string"},description:"Unique identifier for this item"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Children"}},composes:["HTMLAttributes"]};q.__docgenInfo={description:"",methods:[],displayName:"Accordion.Trigger",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Trigger content"},iconPosition:{required:!1,tsType:{name:"union",raw:"'left' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"Icon position",defaultValue:{value:"'right'",computed:!1}},hideIcon:{required:!1,tsType:{name:"boolean"},description:"Hide icon",defaultValue:{value:"false",computed:!1}}},composes:["HTMLAttributes"]};M.__docgenInfo={description:"",methods:[],displayName:"Accordion.Panel",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Panel content"}},composes:["HTMLAttributes"]};const Ne={title:"Components/Accordion",component:r.Root,parameters:{layout:"centered"}},b={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"What is a design system?"}),e.jsx(r.Panel,{children:"A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Why use a design system?"}),e.jsx(r.Panel,{children:"Design systems help teams build better products faster by providing a shared language and reusable components that ensure consistency across all touchpoints."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"How do I get started?"}),e.jsx(r.Panel,{children:"Start by installing the package and importing the components you need. Check out our documentation for detailed examples and usage guidelines."})]})]})})},v={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{defaultExpanded:["item-1"],children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Section 1 (Initially Expanded)"}),e.jsx(r.Panel,{children:"This section is expanded by default. Click to collapse it."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Section 2"}),e.jsx(r.Panel,{children:"Content for section 2."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Section 3"}),e.jsx(r.Panel,{children:"Content for section 3."})]})]})})},j={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{allowMultiple:!0,defaultExpanded:["item-1","item-2"],children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Section 1"}),e.jsx(r.Panel,{children:"Multiple sections can be open at the same time with allowMultiple prop."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Section 2"}),e.jsx(r.Panel,{children:"This section is also open by default."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Section 3"}),e.jsx(r.Panel,{children:"Click to expand this section without closing others."})]})]})})},y={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{variant:"bordered",children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Bordered Section 1"}),e.jsx(r.Panel,{children:"Content for bordered accordion section 1."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Bordered Section 2"}),e.jsx(r.Panel,{children:"Content for bordered accordion section 2."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Bordered Section 3"}),e.jsx(r.Panel,{children:"Content for bordered accordion section 3."})]})]})})},I={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{variant:"separated",children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Separated Section 1"}),e.jsx(r.Panel,{children:"Each section has its own border and spacing."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Separated Section 2"}),e.jsx(r.Panel,{children:"Good for when sections need visual separation."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Separated Section 3"}),e.jsx(r.Panel,{children:"Each item is individually styled."})]})]})})},T={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{iconPosition:"left",children:"Icon on the left"}),e.jsx(r.Panel,{children:"The chevron icon is positioned on the left side."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{iconPosition:"left",children:"Another section"}),e.jsx(r.Panel,{children:"Content goes here."})]})]})})},P={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{hideIcon:!0,children:"No icon visible"}),e.jsx(r.Panel,{children:"This accordion has no chevron icon."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{hideIcon:!0,children:"Another section"}),e.jsx(r.Panel,{children:"Content goes here."})]})]})})},N={render:()=>{const[o,n]=t.useState(["item-1"]);return e.jsxs("div",{className:"w-[400px] space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{className:"px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded hover:bg-[var(--color-surface-subtle)]",onClick:()=>n(["item-1","item-2","item-3"]),children:"Expand All"}),e.jsx("button",{className:"px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded hover:bg-[var(--color-surface-subtle)]",onClick:()=>n([]),children:"Collapse All"})]}),e.jsxs(r.Root,{expanded:o,onChange:n,allowMultiple:!0,children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Controlled Section 1"}),e.jsx(r.Panel,{children:"This accordion is controlled externally."})]}),e.jsxs(r.Item,{id:"item-2",children:[e.jsx(r.Trigger,{children:"Controlled Section 2"}),e.jsx(r.Panel,{children:"Use the buttons above to control all sections."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Controlled Section 3"}),e.jsx(r.Panel,{children:"Or click individual sections to toggle them."})]})]}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Expanded: ",o.length>0?o.join(", "):"None"]})]})}},w={render:()=>e.jsx("div",{className:"w-[400px]",children:e.jsxs(r.Root,{children:[e.jsxs(r.Item,{id:"item-1",children:[e.jsx(r.Trigger,{children:"Enabled Section"}),e.jsx(r.Panel,{children:"This section can be expanded and collapsed."})]}),e.jsxs(r.Item,{id:"item-2",disabled:!0,children:[e.jsx(r.Trigger,{children:"Disabled Section"}),e.jsx(r.Panel,{children:"This section cannot be interacted with."})]}),e.jsxs(r.Item,{id:"item-3",children:[e.jsx(r.Trigger,{children:"Another Enabled Section"}),e.jsx(r.Panel,{children:"Content for this section."})]})]})})},S={render:()=>e.jsxs("div",{className:"w-[500px]",children:[e.jsx("h2",{className:"text-heading-h5 text-[var(--color-text-default)] mb-4",children:"Frequently Asked Questions"}),e.jsxs(r.Root,{variant:"separated",children:[e.jsxs(r.Item,{id:"faq-1",children:[e.jsx(r.Trigger,{children:"How do I reset my password?"}),e.jsx(r.Panel,{children:e.jsx("p",{className:"text-[var(--color-text-muted)]",children:`Click on the "Forgot Password" link on the login page. Enter your email address and we'll send you instructions to reset your password.`})})]}),e.jsxs(r.Item,{id:"faq-2",children:[e.jsx(r.Trigger,{children:"What payment methods do you accept?"}),e.jsx(r.Panel,{children:e.jsx("p",{className:"text-[var(--color-text-muted)]",children:"We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers."})})]}),e.jsxs(r.Item,{id:"faq-3",children:[e.jsx(r.Trigger,{children:"How can I contact support?"}),e.jsx(r.Panel,{children:e.jsx("p",{className:"text-[var(--color-text-muted)]",children:"You can reach our support team via email at support@example.com or through the live chat feature available in your dashboard 24/7."})})]}),e.jsxs(r.Item,{id:"faq-4",children:[e.jsx(r.Trigger,{children:"Is there a free trial available?"}),e.jsx(r.Panel,{children:e.jsx("p",{className:"text-[var(--color-text-muted)]",children:"Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."})})]})]})]})},C={render:()=>e.jsxs("div",{className:"w-[400px]",children:[e.jsx("h3",{className:"text-heading-h6 text-[var(--color-text-default)] mb-3",children:"Settings"}),e.jsxs(r.Root,{variant:"bordered",allowMultiple:!0,children:[e.jsxs(r.Item,{id:"general",children:[e.jsx(r.Trigger,{children:"General"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Language"}),e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"English"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Timezone"}),e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"UTC+9"})]})]})})]}),e.jsxs(r.Item,{id:"notifications",children:[e.jsx(r.Trigger,{children:"Notifications"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Email"}),e.jsx("span",{className:"text-body-md text-[var(--color-state-success)]",children:"Enabled"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Push"}),e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"Disabled"})]})]})})]}),e.jsxs(r.Item,{id:"security",children:[e.jsx(r.Trigger,{children:"Security"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Two-factor auth"}),e.jsx("span",{className:"text-body-md text-[var(--color-state-success)]",children:"Active"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-body-md",children:"Session timeout"}),e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:"30 minutes"})]})]})})]})]})]})};var D,H,W;b.parameters={...b.parameters,docs:{...(D=b.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>What is a design system?</Accordion.Trigger>
          <Accordion.Panel>
            A design system is a collection of reusable components, guided by clear standards, that
            can be assembled together to build any number of applications.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Why use a design system?</Accordion.Trigger>
          <Accordion.Panel>
            Design systems help teams build better products faster by providing a shared language
            and reusable components that ensure consistency across all touchpoints.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>How do I get started?</Accordion.Trigger>
          <Accordion.Panel>
            Start by installing the package and importing the components you need. Check out our
            documentation for detailed examples and usage guidelines.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(W=(H=b.parameters)==null?void 0:H.docs)==null?void 0:W.source}}};var _,V,B;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root defaultExpanded={['item-1']}>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1 (Initially Expanded)</Accordion.Trigger>
          <Accordion.Panel>
            This section is expanded by default. Click to collapse it.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content for section 2.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Section 3</Accordion.Trigger>
          <Accordion.Panel>Content for section 3.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(B=(V=v.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};var L,F,U;j.parameters={...j.parameters,docs:{...(L=j.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root allowMultiple defaultExpanded={['item-1', 'item-2']}>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>
            Multiple sections can be open at the same time with allowMultiple prop.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>This section is also open by default.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Section 3</Accordion.Trigger>
          <Accordion.Panel>Click to expand this section without closing others.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(U=(F=j.parameters)==null?void 0:F.docs)==null?void 0:U.source}}};var G,Q,Y;y.parameters={...y.parameters,docs:{...(G=y.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root variant="bordered">
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Bordered Section 1</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 1.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Bordered Section 2</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 2.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Bordered Section 3</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 3.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(Y=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};var z,O,$;I.parameters={...I.parameters,docs:{...(z=I.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root variant="separated">
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Separated Section 1</Accordion.Trigger>
          <Accordion.Panel>Each section has its own border and spacing.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Separated Section 2</Accordion.Trigger>
          <Accordion.Panel>Good for when sections need visual separation.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Separated Section 3</Accordion.Trigger>
          <Accordion.Panel>Each item is individually styled.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...($=(O=I.parameters)==null?void 0:O.docs)==null?void 0:$.source}}};var J,K,X;T.parameters={...T.parameters,docs:{...(J=T.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger iconPosition="left">Icon on the left</Accordion.Trigger>
          <Accordion.Panel>The chevron icon is positioned on the left side.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger iconPosition="left">Another section</Accordion.Trigger>
          <Accordion.Panel>Content goes here.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(X=(K=T.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var Z,ee,re;P.parameters={...P.parameters,docs:{...(Z=P.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger hideIcon>No icon visible</Accordion.Trigger>
          <Accordion.Panel>This accordion has no chevron icon.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger hideIcon>Another section</Accordion.Trigger>
          <Accordion.Panel>Content goes here.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(re=(ee=P.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var oe,ne,te;N.parameters={...N.parameters,docs:{...(oe=N.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['item-1']);
    return <div className="w-[400px] space-y-4">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded hover:bg-[var(--color-surface-subtle)]" onClick={() => setExpanded(['item-1', 'item-2', 'item-3'])}>
            Expand All
          </button>
          <button className="px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded hover:bg-[var(--color-surface-subtle)]" onClick={() => setExpanded([])}>
            Collapse All
          </button>
        </div>

        <Accordion.Root expanded={expanded} onChange={setExpanded} allowMultiple>
          <Accordion.Item id="item-1">
            <Accordion.Trigger>Controlled Section 1</Accordion.Trigger>
            <Accordion.Panel>This accordion is controlled externally.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="item-2">
            <Accordion.Trigger>Controlled Section 2</Accordion.Trigger>
            <Accordion.Panel>Use the buttons above to control all sections.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="item-3">
            <Accordion.Trigger>Controlled Section 3</Accordion.Trigger>
            <Accordion.Panel>Or click individual sections to toggle them.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>

        <p className="text-body-sm text-[var(--color-text-muted)]">
          Expanded: {expanded.length > 0 ? expanded.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(te=(ne=N.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var ie,ce,de;w.parameters={...w.parameters,docs:{...(ie=w.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Enabled Section</Accordion.Trigger>
          <Accordion.Panel>This section can be expanded and collapsed.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2" disabled>
          <Accordion.Trigger>Disabled Section</Accordion.Trigger>
          <Accordion.Panel>This section cannot be interacted with.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Another Enabled Section</Accordion.Trigger>
          <Accordion.Panel>Content for this section.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(de=(ce=w.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var se,ae,le;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="w-[500px]">
      <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-4">
        Frequently Asked Questions
      </h2>
      <Accordion.Root variant="separated">
        <Accordion.Item id="faq-1">
          <Accordion.Trigger>How do I reset my password?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              Click on the "Forgot Password" link on the login page. Enter your email address and
              we'll send you instructions to reset your password.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-2">
          <Accordion.Trigger>What payment methods do you accept?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and
              bank transfers for enterprise customers.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-3">
          <Accordion.Trigger>How can I contact support?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              You can reach our support team via email at support@example.com or through the live
              chat feature available in your dashboard 24/7.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-4">
          <Accordion.Trigger>Is there a free trial available?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              Yes! We offer a 14-day free trial with full access to all features. No credit card
              required to start.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(le=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};var me,pe,xe;C.parameters={...C.parameters,docs:{...(me=C.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-3">Settings</h3>
      <Accordion.Root variant="bordered" allowMultiple>
        <Accordion.Item id="general">
          <Accordion.Trigger>General</Accordion.Trigger>
          <Accordion.Panel>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Language</span>
                <span className="text-body-md text-[var(--color-text-muted)]">English</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Timezone</span>
                <span className="text-body-md text-[var(--color-text-muted)]">UTC+9</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="notifications">
          <Accordion.Trigger>Notifications</Accordion.Trigger>
          <Accordion.Panel>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Email</span>
                <span className="text-body-md text-[var(--color-state-success)]">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Push</span>
                <span className="text-body-md text-[var(--color-text-muted)]">Disabled</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="security">
          <Accordion.Trigger>Security</Accordion.Trigger>
          <Accordion.Panel>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Two-factor auth</span>
                <span className="text-body-md text-[var(--color-state-success)]">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Session timeout</span>
                <span className="text-body-md text-[var(--color-text-muted)]">30 minutes</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
}`,...(xe=(pe=C.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};const we=["Default","DefaultExpanded","AllowMultiple","Bordered","Separated","IconLeft","HideIcon","Controlled","DisabledItems","FAQExample","SettingsExample"];export{j as AllowMultiple,y as Bordered,N as Controlled,b as Default,v as DefaultExpanded,w as DisabledItems,S as FAQExample,P as HideIcon,T as IconLeft,I as Separated,C as SettingsExample,we as __namedExportsOrder,Ne as default};
