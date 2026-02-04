import{r as S,j as e}from"./iframe-CiM_PzFy.js";import{t as L}from"./bundle-mjs-BZSatpsL.js";import{I as Ge}from"./IconCopy-InJZhNUT.js";import{I as Pe}from"./IconCheck-EP2TORLX.js";import{I as Re}from"./IconLink-B5wVeoxV.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dtj5WpGl.js";const He={default:"bg-[var(--color-surface-muted)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent",ghost:"bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] border-transparent",outline:"bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]"},Fe={sm:{button:"h-6 px-1.5 text-body-sm gap-1",icon:12},md:{button:"h-8 px-2 text-body-md gap-1.5",icon:14},lg:{button:"h-9 px-2.5 text-body-md gap-2",icon:16}},Ke="text-[var(--color-state-success)]",t=S.forwardRef(({value:a,variant:l="ghost",size:r="sm",copyIcon:O,successIcon:z,label:T="Copy",successLabel:k="Copied!",successDuration:D=2e3,onCopy:o,onError:n,iconOnly:w=!1,tooltip:Le,className:De="",disabled:c,...Ve},_e)=>{const[B,V]=S.useState(!1),q=Fe[r],We=S.useCallback(async()=>{if(!c)try{await navigator.clipboard.writeText(a),V(!0),o==null||o(a),setTimeout(()=>{V(!1)},D)}catch(W){const A=W instanceof Error?W:new Error("Failed to copy");n==null||n(A),console.error("Failed to copy:",A)}},[a,c,o,n,D]),Ae=e.jsx(Ge,{size:q.icon,stroke:1.5}),Me=e.jsx(Pe,{size:q.icon,stroke:2}),Ee=B?z??Me:O??Ae,_=B?k:T;return e.jsxs("button",{ref:_e,type:"button",onClick:We,disabled:c,title:Le,"aria-label":w?_:void 0,className:L("inline-flex items-center justify-center","border rounded-[var(--radius-sm)]","font-medium","transition-all duration-[var(--duration-fast)]","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",q.button,He[l],B&&Ke,c&&"opacity-50 cursor-not-allowed",w&&"px-1.5",De),...Ve,children:[e.jsx("span",{className:"shrink-0 flex items-center",children:Ee}),!w&&e.jsx("span",{children:_})]})});t.displayName="CopyButton";const s=S.forwardRef(({value:a,truncate:l=!1,maxWidth:r,size:O="sm",className:z="",onCopy:T},k)=>e.jsxs("div",{ref:k,className:L("inline-flex items-center gap-1.5","px-2 py-1","bg-[var(--color-surface-subtle)]","rounded-[var(--radius-sm)]","text-body-md text-[var(--color-text-default)]",z),style:r?{maxWidth:r}:void 0,children:[e.jsx("span",{className:L("flex-1",l&&"truncate"),title:l?a:void 0,children:a}),e.jsx(t,{value:a,size:O,iconOnly:!0,onCopy:T})]}));s.displayName="Copyable";t.__docgenInfo={description:"",methods:[],displayName:"CopyButton",props:{value:{required:!0,tsType:{name:"string"},description:"Text to copy to clipboard"},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'ghost' | 'outline'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'outline'"}]},description:"Button variant",defaultValue:{value:"'ghost'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Button size",defaultValue:{value:"'sm'",computed:!1}},copyIcon:{required:!1,tsType:{name:"ReactNode"},description:"Custom copy icon"},successIcon:{required:!1,tsType:{name:"ReactNode"},description:"Custom success icon"},label:{required:!1,tsType:{name:"string"},description:"Label text (optional, shows text next to icon)",defaultValue:{value:"'Copy'",computed:!1}},successLabel:{required:!1,tsType:{name:"string"},description:"Success label (shown after copy)",defaultValue:{value:"'Copied!'",computed:!1}},successDuration:{required:!1,tsType:{name:"number"},description:"Time to show success state (ms)",defaultValue:{value:"2000",computed:!1}},onCopy:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback on successful copy"},onError:{required:!1,tsType:{name:"signature",type:"function",raw:"(error: Error) => void",signature:{arguments:[{type:{name:"Error"},name:"error"}],return:{name:"void"}}},description:"Callback on copy error"},iconOnly:{required:!1,tsType:{name:"boolean"},description:"Show only icon (no label)",defaultValue:{value:"false",computed:!1}},tooltip:{required:!1,tsType:{name:"string"},description:"Tooltip text"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}}},composes:["Omit"]};s.__docgenInfo={description:"",methods:[],displayName:"Copyable",props:{value:{required:!0,tsType:{name:"string"},description:"Value to display and copy"},truncate:{required:!1,tsType:{name:"boolean"},description:"Truncate the displayed value",defaultValue:{value:"false",computed:!1}},maxWidth:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Max width for truncation"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Size of the copy button",defaultValue:{value:"'sm'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes for the container",defaultValue:{value:"''",computed:!1}},onCopy:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Callback on successful copy"}}};const et={title:"Components/CopyButton",component:t,parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["default","ghost","outline"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},i={args:{value:"Hello, World!",label:"Copy"}},d={args:{value:"Hello, World!",iconOnly:!0,tooltip:"Copy to clipboard"}},m={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"default",label:"Default"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"ghost",label:"Ghost"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"outline",label:"Outline"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},u={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"default",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"ghost",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",variant:"outline",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},p={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"sm",label:"Small"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"md",label:"Medium"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"lg",label:"Large"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},x={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"sm",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"md",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{value:"text",size:"lg",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},v={args:{value:"https://example.com",copyIcon:e.jsx(Re,{size:14}),label:"Copy Link"}},b={args:{value:"secret-key-123",label:"복사",successLabel:"복사됨!"}},f={args:{value:"Cannot copy this",label:"Copy",disabled:!0}},y={args:{value:"Tracked copy",label:"Copy",onCopy:a=>{console.log("Copied:",a),alert(`Copied: ${a}`)}}},g={render:()=>e.jsx(s,{value:"instance-abc-123"})},h={render:()=>e.jsx(s,{value:"very-long-resource-id-that-should-be-truncated-for-display",truncate:!0,maxWidth:"200px"})},N={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Instance ID"}),e.jsx(s,{value:"i-0123456789abcdef0"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"IP Address"}),e.jsx(s,{value:"192.168.1.100"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Long ID (truncated)"}),e.jsx(s,{value:"arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0",truncate:!0,maxWidth:"250px"})]})]})},j={render:()=>e.jsxs("div",{className:"p-4 bg-[var(--color-surface-subtle)] rounded-lg",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4 mb-3",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:"API Key"}),e.jsx(t,{value:"sk_live_abcdefghijklmnop",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy API key"})]}),e.jsx("code",{className:"text-body-md text-[var(--color-text-default)] font-mono",children:"sk_live_••••••••••••••op"})]})},C={render:()=>e.jsxs("div",{className:"relative",children:[e.jsx("pre",{className:"p-4 pr-12 bg-[var(--color-surface-muted)] rounded-lg text-body-md text-[var(--color-text-default)] overflow-x-auto",children:e.jsx("code",{children:"npm install @tds/design-system"})}),e.jsx("div",{className:"absolute top-2 right-2",children:e.jsx(t,{value:"npm install @tds/design-system",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy command"})})]})},I={render:()=>e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("th",{className:"p-3 text-left text-label-sm text-[var(--color-text-subtle)]",children:"Name"}),e.jsx("th",{className:"p-3 text-left text-label-sm text-[var(--color-text-subtle)]",children:"ID"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-3 text-body-md",children:"Instance 1"}),e.jsx("td",{className:"p-3",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-abc123"}),e.jsx(t,{value:"i-abc123",variant:"ghost",size:"sm",iconOnly:!0})]})})]}),e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-3 text-body-md",children:"Instance 2"}),e.jsx("td",{className:"p-3",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-def456"}),e.jsx(t,{value:"i-def456",variant:"ghost",size:"sm",iconOnly:!0})]})})]})]})]})};var M,E,G;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    label: 'Copy'
  }
}`,...(G=(E=i.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var P,R,H;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    iconOnly: true,
    tooltip: 'Copy to clipboard'
  }
}`,...(H=(R=d.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var F,K,U;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="default" label="Default" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="ghost" label="Ghost" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="outline" label="Outline" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
}`,...(U=(K=m.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var $,J,Q;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="default" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="ghost" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="outline" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
}`,...(Q=(J=u.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var X,Y,Z;p.parameters={...p.parameters,docs:{...(X=p.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="sm" label="Small" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="md" label="Medium" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="lg" label="Large" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
}`,...(Z=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ae;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="sm" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="md" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="lg" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
}`,...(ae=(te=x.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var se,le,re;v.parameters={...v.parameters,docs:{...(se=v.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    value: 'https://example.com',
    copyIcon: <IconLink size={14} />,
    label: 'Copy Link'
  }
}`,...(re=(le=v.parameters)==null?void 0:le.docs)==null?void 0:re.source}}};var oe,ne,ce;b.parameters={...b.parameters,docs:{...(oe=b.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    value: 'secret-key-123',
    label: '복사',
    successLabel: '복사됨!'
  }
}`,...(ce=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:ce.source}}};var ie,de,me;f.parameters={...f.parameters,docs:{...(ie=f.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    value: 'Cannot copy this',
    label: 'Copy',
    disabled: true
  }
}`,...(me=(de=f.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var ue,pe,xe;y.parameters={...y.parameters,docs:{...(ue=y.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    value: 'Tracked copy',
    label: 'Copy',
    onCopy: value => {
      console.log('Copied:', value);
      alert(\`Copied: \${value}\`);
    }
  }
}`,...(xe=(pe=y.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};var ve,be,fe;g.parameters={...g.parameters,docs:{...(ve=g.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <Copyable value="instance-abc-123" />
}`,...(fe=(be=g.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};var ye,ge,he;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <Copyable value="very-long-resource-id-that-should-be-truncated-for-display" truncate maxWidth="200px" />
}`,...(he=(ge=h.parameters)==null?void 0:ge.docs)==null?void 0:he.source}}};var Ne,je,Ce;N.parameters={...N.parameters,docs:{...(Ne=N.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Instance ID</h4>
        <Copyable value="i-0123456789abcdef0" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">IP Address</h4>
        <Copyable value="192.168.1.100" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Long ID (truncated)</h4>
        <Copyable value="arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0" truncate maxWidth="250px" />
      </div>
    </div>
}`,...(Ce=(je=N.parameters)==null?void 0:je.docs)==null?void 0:Ce.source}}};var Ie,Se,Oe;j.parameters={...j.parameters,docs:{...(Ie=j.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-label-sm text-[var(--color-text-subtle)]">API Key</span>
        <CopyButton value="sk_live_abcdefghijklmnop" variant="ghost" size="sm" iconOnly tooltip="Copy API key" />
      </div>
      <code className="text-body-md text-[var(--color-text-default)] font-mono">
        sk_live_••••••••••••••op
      </code>
    </div>
}`,...(Oe=(Se=j.parameters)==null?void 0:Se.docs)==null?void 0:Oe.source}}};var ze,Te,ke;C.parameters={...C.parameters,docs:{...(ze=C.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div className="relative">
      <pre className="p-4 pr-12 bg-[var(--color-surface-muted)] rounded-lg text-body-md text-[var(--color-text-default)] overflow-x-auto">
        <code>{\`npm install @tds/design-system\`}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton value="npm install @tds/design-system" variant="ghost" size="sm" iconOnly tooltip="Copy command" />
      </div>
    </div>
}`,...(ke=(Te=C.parameters)==null?void 0:Te.docs)==null?void 0:ke.source}}};var we,Be,qe;I.parameters={...I.parameters,docs:{...(we=I.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <th className="p-3 text-left text-label-sm text-[var(--color-text-subtle)]">Name</th>
          <th className="p-3 text-left text-label-sm text-[var(--color-text-subtle)]">ID</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-3 text-body-md">Instance 1</td>
          <td className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-body-md text-[var(--color-text-default)]">i-abc123</span>
              <CopyButton value="i-abc123" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-3 text-body-md">Instance 2</td>
          <td className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-body-md text-[var(--color-text-default)]">i-def456</span>
              <CopyButton value="i-def456" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
}`,...(qe=(Be=I.parameters)==null?void 0:Be.docs)==null?void 0:qe.source}}};const tt=["Default","IconOnly","Variants","VariantsIconOnly","Sizes","SizesIconOnly","CustomIcons","CustomLabels","Disabled","WithCallback","CopyableDefault","CopyableTruncated","CopyableExamples","InlineUsage","CodeBlock","TableCell"];export{C as CodeBlock,g as CopyableDefault,N as CopyableExamples,h as CopyableTruncated,v as CustomIcons,b as CustomLabels,i as Default,f as Disabled,d as IconOnly,j as InlineUsage,p as Sizes,x as SizesIconOnly,I as TableCell,m as Variants,u as VariantsIconOnly,y as WithCallback,tt as __namedExportsOrder,et as default};
