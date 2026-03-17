import{r as c,j as e}from"./iframe-DkQu90e3.js";import{t as b}from"./cn-8AORBNJN.js";import{I as $}from"./IconChevronDown-Bk0ShmHi.js";import{I as J}from"./IconChevronRight-CI0CgaLS.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bn1mjhIb.js";const B=c.createContext(null);function G(){const i=c.useContext(B);if(!i)throw new Error("Disclosure components must be used within a Disclosure");return i}function r({defaultOpen:i=!1,open:s,onChange:a,children:t,className:o,...l}){const[x,U]=c.useState(i),h=c.useId(),f=s!==void 0,D=f?s:x,Y={isOpen:D,toggle:()=>{const y=!D;f||U(y),a==null||a(y)},triggerId:`disclosure-trigger-${h}`,panelId:`disclosure-panel-${h}`};return e.jsx(B.Provider,{value:Y,children:e.jsx("div",{"data-figma-name":"Disclosure",className:b("",o),...l,children:t})})}function H({children:i,className:s,...a}){const{isOpen:t,toggle:o,triggerId:l,panelId:x}=G();return e.jsxs("button",{type:"button",id:l,"aria-expanded":t,"aria-controls":x,onClick:o,className:b("flex items-center gap-[var(--disclosure-gap)]","text-label-lg","text-[var(--color-text-default)]","cursor-pointer select-none","hover:text-[var(--color-text-subtle)]","transition-colors duration-[var(--duration-fast)]",s),...a,children:[e.jsx("span",{className:"shrink-0 flex items-center justify-center w-[var(--disclosure-icon-size)] h-[var(--disclosure-icon-size)]",children:t?e.jsx($,{size:12,strokeWidth:2}):e.jsx(J,{size:12,strokeWidth:2})}),i]})}function L({children:i,className:s,...a}){const{isOpen:t,triggerId:o,panelId:l}=G();return t?e.jsx("div",{id:l,role:"region","aria-labelledby":o,className:b("",s),...a,children:i}):null}r.Trigger=H;r.Panel=L;r.__docgenInfo={description:"",methods:[{name:"Trigger",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DisclosureTriggerProps",optional:!1,type:{name:"DisclosureTriggerProps",alias:"DisclosureTriggerProps"}}],returns:null},{name:"Panel",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DisclosurePanelProps",optional:!1,type:{name:"DisclosurePanelProps",alias:"DisclosurePanelProps"}}],returns:null}],displayName:"Disclosure",props:{defaultOpen:{required:!1,tsType:{name:"boolean"},description:"Default open state (uncontrolled)",defaultValue:{value:"false",computed:!1}},open:{required:!1,tsType:{name:"boolean"},description:"Controlled open state"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:"Callback when open state changes"},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};H.__docgenInfo={description:"",methods:[],displayName:"DisclosureTrigger",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};L.__docgenInfo={description:"",methods:[],displayName:"DisclosurePanel",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const ae={title:"Components/Disclosure",component:r,parameters:{layout:"centered",docs:{description:{component:"콘텐츠를 접거나 펼칠 수 있는 아코디언 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{defaultOpen:{control:"boolean",description:"기본 열림 상태 (비제어)"},open:{control:"boolean",description:"열림 상태 (제어)"},onChange:{action:"changed",description:"상태 변경 콜백"}},decorators:[i=>e.jsx("div",{style:{width:"400px"},children:e.jsx(i,{})})]},n={render:()=>e.jsxs(r,{children:[e.jsx(r.Trigger,{children:"Click to expand"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"This is the hidden content that appears when you click the trigger. It can contain any content you want."})})]})},d={name:"Default Open",render:()=>e.jsxs(r,{defaultOpen:!0,children:[e.jsx(r.Trigger,{children:"Already expanded"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"This disclosure starts in the open state."})})]})},p={render:()=>{const[i,s]=c.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsxs("button",{onClick:()=>s(!i),className:"px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-1)] text-body-md bg-[var(--color-action-primary)] text-[var(--color-on-primary)] rounded-[var(--primitive-radius-md)]",children:[i?"Close":"Open"," from outside"]}),e.jsxs("span",{className:"text-body-md text-[var(--color-text-subtle)]",children:["State: ",i?"Open":"Closed"]})]}),e.jsxs(r,{open:i,onChange:s,children:[e.jsx(r.Trigger,{children:"Controlled disclosure"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"This disclosure is controlled by external state."})})]})]})}},u={name:"Multiple Disclosures",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)] w-full",children:[e.jsxs(r,{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]",children:[e.jsx(r.Trigger,{children:"Section 1: Getting Started"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"Learn how to get started with our product. This section covers installation, setup, and basic configuration."})})]}),e.jsxs(r,{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]",children:[e.jsx(r.Trigger,{children:"Section 2: Advanced Features"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"Explore advanced features and customization options. This includes API integrations and plugins."})})]}),e.jsxs(r,{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]",children:[e.jsx(r.Trigger,{children:"Section 3: Troubleshooting"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"Common issues and their solutions. Contact support if you need additional help."})})]})]})},v={name:"Use Case - FAQ",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)] w-full",children:[e.jsx("h3",{className:"text-heading-h4 mb-[var(--primitive-spacing-2)]",children:"Frequently Asked Questions"}),e.jsxs(r,{className:"border-b border-[var(--color-border-default)] pb-3",children:[e.jsx(r.Trigger,{children:"What is your return policy?"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"We offer a 30-day return policy for all unused items in their original packaging. Please contact our support team to initiate a return."})})]}),e.jsxs(r,{className:"border-b border-[var(--color-border-default)] pb-3",children:[e.jsx(r.Trigger,{children:"How long does shipping take?"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery at an additional cost."})})]}),e.jsxs(r,{className:"border-b border-[var(--color-border-default)] pb-3",children:[e.jsx(r.Trigger,{children:"Do you offer international shipping?"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]",children:"Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."})})]})]})},m={name:"Use Case - Settings Panel",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-full bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)] rounded-[var(--primitive-radius-lg)]",children:[e.jsxs(r,{defaultOpen:!0,children:[e.jsx(r.Trigger,{children:"General Settings"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsxs("label",{className:"flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Enable notifications"]}),e.jsxs("label",{className:"flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]",children:[e.jsx("input",{type:"checkbox"}),"Dark mode"]}),e.jsxs("label",{className:"flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Auto-save"]})]})})]}),e.jsxs(r,{children:[e.jsx(r.Trigger,{children:"Privacy Settings"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsxs("label",{className:"flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Share usage data"]}),e.jsxs("label",{className:"flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]",children:[e.jsx("input",{type:"checkbox"}),"Allow third-party cookies"]})]})})]}),e.jsxs(r,{children:[e.jsx(r.Trigger,{children:"Advanced Settings"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-muted)]",children:[e.jsx("p",{children:"Developer mode: Disabled"}),e.jsx("p",{children:"API Version: v2.1.0"}),e.jsx("p",{children:"Cache: Enabled"})]})})]})]})},g={name:"Nested Disclosures",render:()=>e.jsxs(r,{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]",children:[e.jsx(r.Trigger,{children:"Parent Section"}),e.jsx(r.Panel,{children:e.jsxs("div",{className:"pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"This section contains nested disclosures."}),e.jsxs(r,{className:"border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]",children:[e.jsx(r.Trigger,{children:"Child Section A"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]",children:"Content for child section A"})})]}),e.jsxs(r,{className:"border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]",children:[e.jsx(r.Trigger,{children:"Child Section B"}),e.jsx(r.Panel,{children:e.jsx("div",{className:"pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]",children:"Content for child section B"})})]})]})})]})};var j,N,T;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Disclosure>
      <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
          This is the hidden content that appears when you click the trigger. It can contain any
          content you want.
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(T=(N=n.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var P,C,k;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Default Open',
  render: () => <Disclosure defaultOpen>
      <Disclosure.Trigger>Already expanded</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
          This disclosure starts in the open state.
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(k=(C=d.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var S,w,O;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button onClick={() => setIsOpen(!isOpen)} className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-1)] text-body-md bg-[var(--color-action-primary)] text-[var(--color-on-primary)] rounded-[var(--primitive-radius-md)]">
            {isOpen ? 'Close' : 'Open'} from outside
          </button>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            State: {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <Disclosure open={isOpen} onChange={setIsOpen}>
          <Disclosure.Trigger>Controlled disclosure</Disclosure.Trigger>
          <Disclosure.Panel>
            <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
              This disclosure is controlled by external state.
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>;
  }
}`,...(O=(w=p.parameters)==null?void 0:w.docs)==null?void 0:O.source}}};var I,A,E;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Multiple Disclosures',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 1: Getting Started</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Learn how to get started with our product. This section covers installation, setup, and
            basic configuration.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 2: Advanced Features</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Explore advanced features and customization options. This includes API integrations and
            plugins.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 3: Troubleshooting</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Common issues and their solutions. Contact support if you need additional help.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(E=(A=u.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var q,F,_;v.parameters={...v.parameters,docs:{...(q=v.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Use Case - FAQ',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
      <h3 className="text-heading-h4 mb-[var(--primitive-spacing-2)]">
        Frequently Asked Questions
      </h3>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>What is your return policy?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            We offer a 30-day return policy for all unused items in their original packaging. Please
            contact our support team to initiate a return.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>How long does shipping take?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Standard shipping takes 5-7 business days. Express shipping is available for 2-3
            business day delivery at an additional cost.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>Do you offer international shipping?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Yes, we ship to over 50 countries worldwide. International shipping rates and delivery
            times vary by location.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(_=(F=v.parameters)==null?void 0:F.docs)==null?void 0:_.source}}};var M,z,Q;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Use Case - Settings Panel',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)] rounded-[var(--primitive-radius-lg)]">
      <Disclosure defaultOpen>
        <Disclosure.Trigger>General Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" />
              Dark mode
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Auto-save
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Privacy Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Share usage data
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" />
              Allow third-party cookies
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Advanced Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-muted)]">
            <p>Developer mode: Disabled</p>
            <p>API Version: v2.1.0</p>
            <p>Cache: Enabled</p>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(Q=(z=m.parameters)==null?void 0:z.docs)==null?void 0:Q.source}}};var W,R,V;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Nested Disclosures',
  render: () => <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]">
      <Disclosure.Trigger>Parent Section</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
          <p className="text-body-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
            This section contains nested disclosures.
          </p>

          <Disclosure className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]">
            <Disclosure.Trigger>Child Section A</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]">
                Content for child section A
              </div>
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]">
            <Disclosure.Trigger>Child Section B</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]">
                Content for child section B
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(V=(R=g.parameters)==null?void 0:R.docs)==null?void 0:V.source}}};const te=["Default","DefaultOpen","Controlled","Multiple","FAQ","SettingsPanel","Nested"];export{p as Controlled,n as Default,d as DefaultOpen,v as FAQ,u as Multiple,g as Nested,m as SettingsPanel,te as __namedExportsOrder,ae as default};
