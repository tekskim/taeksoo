import{r as o,j as e}from"./iframe-CiM_PzFy.js";import{t as f}from"./bundle-mjs-BZSatpsL.js";import{I as $}from"./IconChevronDown-CBNx6VPf.js";import{I as J}from"./IconChevronRight-B66hzYCq.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dtj5WpGl.js";const B=o.createContext(null);function G(){const r=o.useContext(B);if(!r)throw new Error("Disclosure components must be used within a Disclosure");return r}function s({defaultOpen:r=!1,open:t,onChange:l,children:a,className:i,...n}){const[h,U]=o.useState(r),b=o.useId(),D=t!==void 0,y=D?t:h,Y={isOpen:y,toggle:()=>{const v=!y;D||U(v),l==null||l(v)},triggerId:`disclosure-trigger-${b}`,panelId:`disclosure-panel-${b}`};return e.jsx(B.Provider,{value:Y,children:e.jsx("div",{className:f("",i),...n,children:a})})}function H({children:r,className:t,...l}){const{isOpen:a,toggle:i,triggerId:n,panelId:h}=G();return e.jsxs("button",{type:"button",id:n,"aria-expanded":a,"aria-controls":h,onClick:i,className:f("flex items-center gap-[var(--disclosure-gap)]","text-[length:var(--disclosure-font-size)] leading-[var(--disclosure-line-height)] font-medium","text-[var(--color-text-default)]","cursor-pointer select-none","hover:text-[var(--color-text-subtle)]","transition-colors duration-[var(--duration-fast)]",t),...l,children:[e.jsx("span",{className:"shrink-0 flex items-center justify-center w-[var(--disclosure-icon-size)] h-[var(--disclosure-icon-size)]",children:a?e.jsx($,{size:12,strokeWidth:2}):e.jsx(J,{size:12,strokeWidth:2})}),r]})}function L({children:r,className:t,...l}){const{isOpen:a,triggerId:i,panelId:n}=G();return a?e.jsx("div",{id:n,role:"region","aria-labelledby":i,className:f("",t),...l,children:r}):null}s.Trigger=H;s.Panel=L;s.__docgenInfo={description:"",methods:[{name:"Trigger",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DisclosureTriggerProps",optional:!1,type:{name:"DisclosureTriggerProps",alias:"DisclosureTriggerProps"}}],returns:null},{name:"Panel",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DisclosurePanelProps",optional:!1,type:{name:"DisclosurePanelProps",alias:"DisclosurePanelProps"}}],returns:null}],displayName:"Disclosure",props:{defaultOpen:{required:!1,tsType:{name:"boolean"},description:"Default open state (uncontrolled)",defaultValue:{value:"false",computed:!1}},open:{required:!1,tsType:{name:"boolean"},description:"Controlled open state"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:"Callback when open state changes"},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};H.__docgenInfo={description:"",methods:[],displayName:"DisclosureTrigger",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};L.__docgenInfo={description:"",methods:[],displayName:"DisclosurePanel",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const le={title:"Components/Disclosure",component:s,parameters:{layout:"centered",docs:{description:{component:"콘텐츠를 접거나 펼칠 수 있는 아코디언 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{defaultOpen:{control:"boolean",description:"기본 열림 상태 (비제어)"},open:{control:"boolean",description:"열림 상태 (제어)"},onChange:{action:"changed",description:"상태 변경 콜백"}},decorators:[r=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{})})]},c={render:()=>e.jsxs(s,{children:[e.jsx(s.Trigger,{children:"Click to expand"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"This is the hidden content that appears when you click the trigger. It can contain any content you want."})})]})},d={name:"Default Open",render:()=>e.jsxs(s,{defaultOpen:!0,children:[e.jsx(s.Trigger,{children:"Already expanded"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"This disclosure starts in the open state."})})]})},p={render:()=>{const[r,t]=o.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{onClick:()=>t(!r),className:"px-3 py-1 text-sm bg-blue-500 text-white rounded",children:[r?"Close":"Open"," from outside"]}),e.jsxs("span",{className:"text-sm text-gray-500",children:["State: ",r?"Open":"Closed"]})]}),e.jsxs(s,{open:r,onChange:t,children:[e.jsx(s.Trigger,{children:"Controlled disclosure"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"This disclosure is controlled by external state."})})]})]})}},u={name:"Multiple Disclosures",render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[e.jsxs(s,{className:"border border-gray-200 rounded-lg p-3",children:[e.jsx(s.Trigger,{children:"Section 1: Getting Started"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"Learn how to get started with our product. This section covers installation, setup, and basic configuration."})})]}),e.jsxs(s,{className:"border border-gray-200 rounded-lg p-3",children:[e.jsx(s.Trigger,{children:"Section 2: Advanced Features"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"Explore advanced features and customization options. This includes API integrations and plugins."})})]}),e.jsxs(s,{className:"border border-gray-200 rounded-lg p-3",children:[e.jsx(s.Trigger,{children:"Section 3: Troubleshooting"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"Common issues and their solutions. Contact support if you need additional help."})})]})]})},g={name:"Use Case - FAQ",render:()=>e.jsxs("div",{className:"flex flex-col gap-3 w-full",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Frequently Asked Questions"}),e.jsxs(s,{className:"border-b border-gray-200 pb-3",children:[e.jsx(s.Trigger,{children:"What is your return policy?"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"We offer a 30-day return policy for all unused items in their original packaging. Please contact our support team to initiate a return."})})]}),e.jsxs(s,{className:"border-b border-gray-200 pb-3",children:[e.jsx(s.Trigger,{children:"How long does shipping take?"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery at an additional cost."})})]}),e.jsxs(s,{className:"border-b border-gray-200 pb-3",children:[e.jsx(s.Trigger,{children:"Do you offer international shipping?"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-600",children:"Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."})})]})]})},m={name:"Use Case - Settings Panel",render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-full bg-gray-50 p-4 rounded-lg",children:[e.jsxs(s,{defaultOpen:!0,children:[e.jsx(s.Trigger,{children:"General Settings"}),e.jsx(s.Panel,{children:e.jsxs("div",{className:"pt-3 pl-5 flex flex-col gap-2",children:[e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Enable notifications"]}),e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox"}),"Dark mode"]}),e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Auto-save"]})]})})]}),e.jsxs(s,{children:[e.jsx(s.Trigger,{children:"Privacy Settings"}),e.jsx(s.Panel,{children:e.jsxs("div",{className:"pt-3 pl-5 flex flex-col gap-2",children:[e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),"Share usage data"]}),e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox"}),"Allow third-party cookies"]})]})})]}),e.jsxs(s,{children:[e.jsx(s.Trigger,{children:"Advanced Settings"}),e.jsx(s.Panel,{children:e.jsxs("div",{className:"pt-3 pl-5 flex flex-col gap-2 text-sm text-gray-600",children:[e.jsx("p",{children:"Developer mode: Disabled"}),e.jsx("p",{children:"API Version: v2.1.0"}),e.jsx("p",{children:"Cache: Enabled"})]})})]})]})},x={name:"Nested Disclosures",render:()=>e.jsxs(s,{className:"border border-gray-200 rounded-lg p-4",children:[e.jsx(s.Trigger,{children:"Parent Section"}),e.jsx(s.Panel,{children:e.jsxs("div",{className:"pt-3 pl-5 flex flex-col gap-2",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"This section contains nested disclosures."}),e.jsxs(s,{className:"border border-gray-100 rounded p-2 bg-gray-50",children:[e.jsx(s.Trigger,{children:"Child Section A"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-500",children:"Content for child section A"})})]}),e.jsxs(s,{className:"border border-gray-100 rounded p-2 bg-gray-50",children:[e.jsx(s.Trigger,{children:"Child Section B"}),e.jsx(s.Panel,{children:e.jsx("div",{className:"pt-2 pl-5 text-sm text-gray-500",children:"Content for child section B"})})]})]})})]})};var j,N,T;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Disclosure>
      <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-2 pl-5 text-sm text-gray-600">
          This is the hidden content that appears when you click the trigger. It can contain any
          content you want.
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(T=(N=c.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var P,C,k;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Default Open',
  render: () => <Disclosure defaultOpen>
      <Disclosure.Trigger>Already expanded</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-2 pl-5 text-sm text-gray-600">
          This disclosure starts in the open state.
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(k=(C=d.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var S,w,O;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            {isOpen ? 'Close' : 'Open'} from outside
          </button>
          <span className="text-sm text-gray-500">State: {isOpen ? 'Open' : 'Closed'}</span>
        </div>

        <Disclosure open={isOpen} onChange={setIsOpen}>
          <Disclosure.Trigger>Controlled disclosure</Disclosure.Trigger>
          <Disclosure.Panel>
            <div className="pt-2 pl-5 text-sm text-gray-600">
              This disclosure is controlled by external state.
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>;
  }
}`,...(O=(w=p.parameters)==null?void 0:w.docs)==null?void 0:O.source}}};var I,A,E;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Multiple Disclosures',
  render: () => <div className="flex flex-col gap-2 w-full">
      <Disclosure className="border border-gray-200 rounded-lg p-3">
        <Disclosure.Trigger>Section 1: Getting Started</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            Learn how to get started with our product. This section covers installation, setup, and
            basic configuration.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-gray-200 rounded-lg p-3">
        <Disclosure.Trigger>Section 2: Advanced Features</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            Explore advanced features and customization options. This includes API integrations and
            plugins.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-gray-200 rounded-lg p-3">
        <Disclosure.Trigger>Section 3: Troubleshooting</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            Common issues and their solutions. Contact support if you need additional help.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(E=(A=u.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var q,F,_;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Use Case - FAQ',
  render: () => <div className="flex flex-col gap-3 w-full">
      <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>

      <Disclosure className="border-b border-gray-200 pb-3">
        <Disclosure.Trigger>What is your return policy?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            We offer a 30-day return policy for all unused items in their original packaging. Please
            contact our support team to initiate a return.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-gray-200 pb-3">
        <Disclosure.Trigger>How long does shipping take?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            Standard shipping takes 5-7 business days. Express shipping is available for 2-3
            business day delivery at an additional cost.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-gray-200 pb-3">
        <Disclosure.Trigger>Do you offer international shipping?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-2 pl-5 text-sm text-gray-600">
            Yes, we ship to over 50 countries worldwide. International shipping rates and delivery
            times vary by location.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(_=(F=g.parameters)==null?void 0:F.docs)==null?void 0:_.source}}};var z,M,Q;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Use Case - Settings Panel',
  render: () => <div className="flex flex-col gap-4 w-full bg-gray-50 p-4 rounded-lg">
      <Disclosure defaultOpen>
        <Disclosure.Trigger>General Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-3 pl-5 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Dark mode
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Auto-save
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Privacy Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-3 pl-5 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Share usage data
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Allow third-party cookies
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Advanced Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-3 pl-5 flex flex-col gap-2 text-sm text-gray-600">
            <p>Developer mode: Disabled</p>
            <p>API Version: v2.1.0</p>
            <p>Cache: Enabled</p>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
}`,...(Q=(M=m.parameters)==null?void 0:M.docs)==null?void 0:Q.source}}};var W,R,V;x.parameters={...x.parameters,docs:{...(W=x.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Nested Disclosures',
  render: () => <Disclosure className="border border-gray-200 rounded-lg p-4">
      <Disclosure.Trigger>Parent Section</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-3 pl-5 flex flex-col gap-2">
          <p className="text-sm text-gray-600 mb-2">This section contains nested disclosures.</p>

          <Disclosure className="border border-gray-100 rounded p-2 bg-gray-50">
            <Disclosure.Trigger>Child Section A</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2 pl-5 text-sm text-gray-500">Content for child section A</div>
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure className="border border-gray-100 rounded p-2 bg-gray-50">
            <Disclosure.Trigger>Child Section B</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2 pl-5 text-sm text-gray-500">Content for child section B</div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </Disclosure.Panel>
    </Disclosure>
}`,...(V=(R=x.parameters)==null?void 0:R.docs)==null?void 0:V.source}}};const ae=["Default","DefaultOpen","Controlled","Multiple","FAQ","SettingsPanel","Nested"];export{p as Controlled,c as Default,d as DefaultOpen,g as FAQ,u as Multiple,x as Nested,m as SettingsPanel,ae as __namedExportsOrder,le as default};
