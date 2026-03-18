import{r as S,j as e}from"./iframe-BkR05wRD.js";import{t as q}from"./cn-8AORBNJN.js";import{I as Ge}from"./IconCopy-BSPwqmBh.js";import{I as Pe}from"./IconCheck-CIJ6FU2k.js";import{I as Re}from"./IconLink-xaxcRCc_.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BvkjW2jm.js";const He={default:"bg-[var(--color-surface-muted)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent",ghost:"bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] border-transparent",outline:"bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]"},Fe={sm:{button:"h-6 px-1.5 text-body-sm gap-1",icon:12},md:{button:"h-8 px-2 text-body-md gap-1.5",icon:14},lg:{button:"h-9 px-2.5 text-body-md gap-2",icon:16}},Ke="text-[var(--color-state-success)]",a=S.forwardRef(({value:t,variant:r="ghost",size:l="sm",copyIcon:O,successIcon:z,label:T="Copy",successLabel:k="Copied!",successDuration:L=2e3,onCopy:n,onError:i,iconOnly:w=!1,tooltip:qe,className:Le="",disabled:o,...Ve},_e)=>{const[B,V]=S.useState(!1),D=Fe[l],We=S.useCallback(async()=>{if(!o)try{await navigator.clipboard.writeText(t),V(!0),n==null||n(t),setTimeout(()=>{V(!1)},L)}catch(W){const A=W instanceof Error?W:new Error("Failed to copy");i==null||i(A),console.error("Failed to copy:",A)}},[t,o,n,i,L]),Ae=e.jsx(Ge,{size:D.icon,stroke:1.5}),Me=e.jsx(Pe,{size:D.icon,stroke:2}),Ee=B?z??Me:O??Ae,_=B?k:T;return e.jsxs("button",{ref:_e,"data-figma-name":"[TDS] CopyButton",type:"button",onClick:We,disabled:o,title:qe,"aria-label":w?_:void 0,className:q("inline-flex items-center justify-center","border rounded-[var(--radius-sm)]","font-medium","transition-colors duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",D.button,He[r],o&&"opacity-50 cursor-not-allowed",w&&"px-1.5",Le,B&&Ke),...Ve,children:[e.jsx("span",{className:"shrink-0 flex items-center",children:Ee}),!w&&e.jsx("span",{children:_})]})});a.displayName="CopyButton";const s=S.forwardRef(({value:t,truncate:r=!1,maxWidth:l,size:O="sm",className:z="",onCopy:T},k)=>e.jsxs("div",{ref:k,"data-figma-name":"[TDS] Copyable",className:q("inline-flex items-center gap-1.5","px-2 py-1","bg-[var(--color-surface-subtle)]","rounded-[var(--radius-sm)]","text-body-md text-[var(--color-text-default)]",z),style:l?{maxWidth:l}:void 0,children:[e.jsx("span",{className:q("flex-1",r&&"truncate"),title:r?t:void 0,children:t}),e.jsx(a,{value:t,size:O,iconOnly:!0,onCopy:T})]}));s.displayName="Copyable";a.__docgenInfo={description:"",methods:[],displayName:"CopyButton",props:{value:{required:!0,tsType:{name:"string"},description:"Text to copy to clipboard"},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'ghost' | 'outline'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'outline'"}]},description:"Button variant",defaultValue:{value:"'ghost'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Button size",defaultValue:{value:"'sm'",computed:!1}},copyIcon:{required:!1,tsType:{name:"ReactNode"},description:"Custom copy icon"},successIcon:{required:!1,tsType:{name:"ReactNode"},description:"Custom success icon"},label:{required:!1,tsType:{name:"string"},description:"Label text (optional, shows text next to icon)",defaultValue:{value:"'Copy'",computed:!1}},successLabel:{required:!1,tsType:{name:"string"},description:"Success label (shown after copy)",defaultValue:{value:"'Copied!'",computed:!1}},successDuration:{required:!1,tsType:{name:"number"},description:"Time to show success state (ms)",defaultValue:{value:"2000",computed:!1}},onCopy:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback on successful copy"},onError:{required:!1,tsType:{name:"signature",type:"function",raw:"(error: Error) => void",signature:{arguments:[{type:{name:"Error"},name:"error"}],return:{name:"void"}}},description:"Callback on copy error"},iconOnly:{required:!1,tsType:{name:"boolean"},description:"Show only icon (no label)",defaultValue:{value:"false",computed:!1}},tooltip:{required:!1,tsType:{name:"string"},description:"Tooltip text"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}}},composes:["Omit"]};s.__docgenInfo={description:"",methods:[],displayName:"Copyable",props:{value:{required:!0,tsType:{name:"string"},description:"Value to display and copy"},truncate:{required:!1,tsType:{name:"boolean"},description:"Truncate the displayed value",defaultValue:{value:"false",computed:!1}},maxWidth:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Max width for truncation"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Size of the copy button",defaultValue:{value:"'sm'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes for the container",defaultValue:{value:"''",computed:!1}},onCopy:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback on successful copy"}}};const ea={title:"Components/CopyButton",component:a,parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["default","ghost","outline"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},c={args:{value:"Hello, World!",label:"Copy"}},d={args:{value:"Hello, World!",iconOnly:!0,tooltip:"Copy to clipboard"}},m={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"default",label:"Default"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"ghost",label:"Ghost"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"outline",label:"Outline"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},p={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"default",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"ghost",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"outline",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},u={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"sm",label:"Small"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"md",label:"Medium"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"lg",label:"Large"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},v={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"sm",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"md",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"lg",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},x={args:{value:"https://example.com",copyIcon:e.jsx(Re,{size:14}),label:"Copy Link"}},g={args:{value:"secret-key-123",label:"복사",successLabel:"복사됨!"}},b={args:{value:"Cannot copy this",label:"Copy",disabled:!0}},f={args:{value:"Tracked copy",label:"Copy",onCopy:t=>{console.log("Copied:",t),alert(`Copied: ${t}`)}}},y={render:()=>e.jsx(s,{value:"instance-abc-123"})},h={render:()=>e.jsx(s,{value:"very-long-resource-id-that-should-be-truncated-for-display",truncate:!0,maxWidth:"200px"})},N={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Instance ID"}),e.jsx(s,{value:"i-0123456789abcdef0"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"IP Address"}),e.jsx(s,{value:"192.168.1.100"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Long ID (truncated)"}),e.jsx(s,{value:"arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0",truncate:!0,maxWidth:"250px"})]})]})},j={render:()=>e.jsxs("div",{className:"p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]",children:[e.jsxs("div",{className:"flex items-center justify-between gap-[var(--primitive-spacing-4)] mb-[var(--primitive-spacing-3)]",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:"API Key"}),e.jsx(a,{value:"sk_live_abcdefghijklmnop",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy API key"})]}),e.jsx("code",{className:"text-body-md text-[var(--color-text-default)] font-mono",children:"sk_live_••••••••••••••op"})]})},C={render:()=>e.jsxs("div",{className:"relative",children:[e.jsx("pre",{className:"p-[var(--primitive-spacing-4)] pr-12 bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-lg)] text-body-md text-[var(--color-text-default)] overflow-x-auto",children:e.jsx("code",{children:"npm install @tds/design-system"})}),e.jsx("div",{className:"absolute top-2 right-2",children:e.jsx(a,{value:"npm install @tds/design-system",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy command"})})]})},I={render:()=>e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("th",{className:"p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]",children:"Name"}),e.jsx("th",{className:"p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]",children:"ID"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-[var(--primitive-spacing-3)] text-body-md",children:"Instance 1"}),e.jsx("td",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-abc123"}),e.jsx(a,{value:"i-abc123",variant:"ghost",size:"sm",iconOnly:!0})]})})]}),e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-[var(--primitive-spacing-3)] text-body-md",children:"Instance 2"}),e.jsx("td",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-def456"}),e.jsx(a,{value:"i-def456",variant:"ghost",size:"sm",iconOnly:!0})]})})]})]})]})};var M,E,G;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    label: 'Copy'
  }
}`,...(G=(E=c.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var P,R,H;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    iconOnly: true,
    tooltip: 'Copy to clipboard'
  }
}`,...(H=(R=d.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var F,K,U;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="default" label="Default" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="ghost" label="Ghost" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="outline" label="Outline" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
}`,...(U=(K=m.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var $,J,Q;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="default" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="ghost" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" variant="outline" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
}`,...(Q=(J=p.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var X,Y,Z;u.parameters={...u.parameters,docs:{...(X=u.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="sm" label="Small" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="md" label="Medium" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="lg" label="Large" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
}`,...(Z=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,te;v.parameters={...v.parameters,docs:{...(ee=v.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="sm" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="md" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <CopyButton value="text" size="lg" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
}`,...(te=(ae=v.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var se,re,le;x.parameters={...x.parameters,docs:{...(se=x.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    value: 'https://example.com',
    copyIcon: <IconLink size={14} />,
    label: 'Copy Link'
  }
}`,...(le=(re=x.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var ne,ie,oe;g.parameters={...g.parameters,docs:{...(ne=g.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    value: 'secret-key-123',
    label: '복사',
    successLabel: '복사됨!'
  }
}`,...(oe=(ie=g.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var ce,de,me;b.parameters={...b.parameters,docs:{...(ce=b.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    value: 'Cannot copy this',
    label: 'Copy',
    disabled: true
  }
}`,...(me=(de=b.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var pe,ue,ve;f.parameters={...f.parameters,docs:{...(pe=f.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    value: 'Tracked copy',
    label: 'Copy',
    onCopy: value => {
      console.log('Copied:', value);
      alert(\`Copied: \${value}\`);
    }
  }
}`,...(ve=(ue=f.parameters)==null?void 0:ue.docs)==null?void 0:ve.source}}};var xe,ge,be;y.parameters={...y.parameters,docs:{...(xe=y.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <Copyable value="instance-abc-123" />
}`,...(be=(ge=y.parameters)==null?void 0:ge.docs)==null?void 0:be.source}}};var fe,ye,he;h.parameters={...h.parameters,docs:{...(fe=h.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <Copyable value="very-long-resource-id-that-should-be-truncated-for-display" truncate maxWidth="200px" />
}`,...(he=(ye=h.parameters)==null?void 0:ye.docs)==null?void 0:he.source}}};var Ne,je,Ce;N.parameters={...N.parameters,docs:{...(Ne=N.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Instance ID
        </h4>
        <Copyable value="i-0123456789abcdef0" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          IP Address
        </h4>
        <Copyable value="192.168.1.100" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Long ID (truncated)
        </h4>
        <Copyable value="arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0" truncate maxWidth="250px" />
      </div>
    </div>
}`,...(Ce=(je=N.parameters)==null?void 0:je.docs)==null?void 0:Ce.source}}};var Ie,Se,Oe;j.parameters={...j.parameters,docs:{...(Ie=j.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div className="p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
      <div className="flex items-center justify-between gap-[var(--primitive-spacing-4)] mb-[var(--primitive-spacing-3)]">
        <span className="text-label-sm text-[var(--color-text-subtle)]">API Key</span>
        <CopyButton value="sk_live_abcdefghijklmnop" variant="ghost" size="sm" iconOnly tooltip="Copy API key" />
      </div>
      <code className="text-body-md text-[var(--color-text-default)] font-mono">
        sk_live_••••••••••••••op
      </code>
    </div>
}`,...(Oe=(Se=j.parameters)==null?void 0:Se.docs)==null?void 0:Oe.source}}};var ze,Te,ke;C.parameters={...C.parameters,docs:{...(ze=C.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div className="relative">
      <pre className="p-[var(--primitive-spacing-4)] pr-12 bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-lg)] text-body-md text-[var(--color-text-default)] overflow-x-auto">
        <code>{\`npm install @tds/design-system\`}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton value="npm install @tds/design-system" variant="ghost" size="sm" iconOnly tooltip="Copy command" />
      </div>
    </div>
}`,...(ke=(Te=C.parameters)==null?void 0:Te.docs)==null?void 0:ke.source}}};var we,Be,De;I.parameters={...I.parameters,docs:{...(we=I.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <th className="p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]">
            Name
          </th>
          <th className="p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]">
            ID
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-[var(--primitive-spacing-3)] text-body-md">Instance 1</td>
          <td className="p-[var(--primitive-spacing-3)]">
            <div className="flex items-center gap-[var(--primitive-spacing-2)]">
              <span className="text-body-md text-[var(--color-text-default)]">i-abc123</span>
              <CopyButton value="i-abc123" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-[var(--primitive-spacing-3)] text-body-md">Instance 2</td>
          <td className="p-[var(--primitive-spacing-3)]">
            <div className="flex items-center gap-[var(--primitive-spacing-2)]">
              <span className="text-body-md text-[var(--color-text-default)]">i-def456</span>
              <CopyButton value="i-def456" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
}`,...(De=(Be=I.parameters)==null?void 0:Be.docs)==null?void 0:De.source}}};const aa=["Default","IconOnly","Variants","VariantsIconOnly","Sizes","SizesIconOnly","CustomIcons","CustomLabels","Disabled","WithCallback","CopyableDefault","CopyableTruncated","CopyableExamples","InlineUsage","CodeBlock","TableCell"];export{C as CodeBlock,y as CopyableDefault,N as CopyableExamples,h as CopyableTruncated,x as CustomIcons,g as CustomLabels,c as Default,b as Disabled,d as IconOnly,j as InlineUsage,u as Sizes,v as SizesIconOnly,I as TableCell,m as Variants,p as VariantsIconOnly,f as WithCallback,aa as __namedExportsOrder,ea as default};
