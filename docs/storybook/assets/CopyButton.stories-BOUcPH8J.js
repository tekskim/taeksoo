import{j as e}from"./iframe-BGa_n0Au.js";import{C as a,a as t}from"./CopyButton-D_q-guHs.js";import{I as xe}from"./IconLink-oplh1IYS.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./IconCopy-36z7C_l7.js";import"./createReactComponent-B5dOz73m.js";import"./IconCheck-pdhJp_YJ.js";const Ce={title:"Components/CopyButton",component:a,parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["default","ghost","outline"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},s={args:{value:"Hello, World!",label:"Copy"}},r={args:{value:"Hello, World!",iconOnly:!0,tooltip:"Copy to clipboard"}},l={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"default",label:"Default"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"ghost",label:"Ghost"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"outline",label:"Outline"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},i={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"default",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"ghost",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Ghost"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",variant:"outline",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Outline"})]})]})},n={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"sm",label:"Small"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"md",label:"Medium"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"lg",label:"Large"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},c={render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"sm",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"md",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Medium"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{value:"text",size:"lg",iconOnly:!0}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Large"})]})]})},o={args:{value:"https://example.com",copyIcon:e.jsx(xe,{size:14}),label:"Copy Link"}},m={args:{value:"secret-key-123",label:"복사",successLabel:"복사됨!"}},d={args:{value:"Cannot copy this",label:"Copy",disabled:!0}},p={args:{value:"Tracked copy",label:"Copy",onCopy:f=>{console.log("Copied:",f),alert(`Copied: ${f}`)}}},v={render:()=>e.jsx(t,{value:"instance-abc-123"})},x={render:()=>e.jsx(t,{value:"very-long-resource-id-that-should-be-truncated-for-display",truncate:!0,maxWidth:"200px"})},u={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Instance ID"}),e.jsx(t,{value:"i-0123456789abcdef0"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"IP Address"}),e.jsx(t,{value:"192.168.1.100"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Long ID (truncated)"}),e.jsx(t,{value:"arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0",truncate:!0,maxWidth:"250px"})]})]})},g={render:()=>e.jsxs("div",{className:"p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]",children:[e.jsxs("div",{className:"flex items-center justify-between gap-[var(--primitive-spacing-4)] mb-[var(--primitive-spacing-3)]",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:"API Key"}),e.jsx(a,{value:"sk_live_abcdefghijklmnop",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy API key"})]}),e.jsx("code",{className:"text-body-md text-[var(--color-text-default)] font-mono",children:"sk_live_••••••••••••••op"})]})},b={render:()=>e.jsxs("div",{className:"relative",children:[e.jsx("pre",{className:"p-[var(--primitive-spacing-4)] pr-12 bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-lg)] text-body-md text-[var(--color-text-default)] overflow-x-auto",children:e.jsx("code",{children:"npm install @tds/design-system"})}),e.jsx("div",{className:"absolute top-2 right-2",children:e.jsx(a,{value:"npm install @tds/design-system",variant:"ghost",size:"sm",iconOnly:!0,tooltip:"Copy command"})})]})},y={render:()=>e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("th",{className:"p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]",children:"Name"}),e.jsx("th",{className:"p-[var(--primitive-spacing-3)] text-left text-label-sm text-[var(--color-text-subtle)]",children:"ID"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-[var(--primitive-spacing-3)] text-body-md",children:"Instance 1"}),e.jsx("td",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-abc123"}),e.jsx(a,{value:"i-abc123",variant:"ghost",size:"sm",iconOnly:!0})]})})]}),e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"p-[var(--primitive-spacing-3)] text-body-md",children:"Instance 2"}),e.jsx("td",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"i-def456"}),e.jsx(a,{value:"i-def456",variant:"ghost",size:"sm",iconOnly:!0})]})})]})]})]})};var h,N,j;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    label: 'Copy'
  }
}`,...(j=(N=s.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var C,O,I;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    value: 'Hello, World!',
    iconOnly: true,
    tooltip: 'Copy to clipboard'
  }
}`,...(I=(O=r.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var z,S,k;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(k=(S=l.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var B,D,L;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(L=(D=i.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var W,_,w;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(w=(_=n.parameters)==null?void 0:_.docs)==null?void 0:w.source}}};var T,A,G;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(G=(A=c.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var M,P,E;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: 'https://example.com',
    copyIcon: <IconLink size={14} />,
    label: 'Copy Link'
  }
}`,...(E=(P=o.parameters)==null?void 0:P.docs)==null?void 0:E.source}}};var H,V,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    value: 'secret-key-123',
    label: '복사',
    successLabel: '복사됨!'
  }
}`,...(K=(V=m.parameters)==null?void 0:V.docs)==null?void 0:K.source}}};var U,$,R;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    value: 'Cannot copy this',
    label: 'Copy',
    disabled: true
  }
}`,...(R=($=d.parameters)==null?void 0:$.docs)==null?void 0:R.source}}};var q,F,J;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    value: 'Tracked copy',
    label: 'Copy',
    onCopy: value => {
      console.log('Copied:', value);
      alert(\`Copied: \${value}\`);
    }
  }
}`,...(J=(F=p.parameters)==null?void 0:F.docs)==null?void 0:J.source}}};var Q,X,Y;v.parameters={...v.parameters,docs:{...(Q=v.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Copyable value="instance-abc-123" />
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;x.parameters={...x.parameters,docs:{...(Z=x.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <Copyable value="very-long-resource-id-that-should-be-truncated-for-display" truncate maxWidth="200px" />
}`,...(ae=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var te,se,re;u.parameters={...u.parameters,docs:{...(te=u.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(re=(se=u.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var le,ie,ne;g.parameters={...g.parameters,docs:{...(le=g.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div className="p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
      <div className="flex items-center justify-between gap-[var(--primitive-spacing-4)] mb-[var(--primitive-spacing-3)]">
        <span className="text-label-sm text-[var(--color-text-subtle)]">API Key</span>
        <CopyButton value="sk_live_abcdefghijklmnop" variant="ghost" size="sm" iconOnly tooltip="Copy API key" />
      </div>
      <code className="text-body-md text-[var(--color-text-default)] font-mono">
        sk_live_••••••••••••••op
      </code>
    </div>
}`,...(ne=(ie=g.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var ce,oe,me;b.parameters={...b.parameters,docs:{...(ce=b.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="relative">
      <pre className="p-[var(--primitive-spacing-4)] pr-12 bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-lg)] text-body-md text-[var(--color-text-default)] overflow-x-auto">
        <code>{\`npm install @tds/design-system\`}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton value="npm install @tds/design-system" variant="ghost" size="sm" iconOnly tooltip="Copy command" />
      </div>
    </div>
}`,...(me=(oe=b.parameters)==null?void 0:oe.docs)==null?void 0:me.source}}};var de,pe,ve;y.parameters={...y.parameters,docs:{...(de=y.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
}`,...(ve=(pe=y.parameters)==null?void 0:pe.docs)==null?void 0:ve.source}}};const Oe=["Default","IconOnly","Variants","VariantsIconOnly","Sizes","SizesIconOnly","CustomIcons","CustomLabels","Disabled","WithCallback","CopyableDefault","CopyableTruncated","CopyableExamples","InlineUsage","CodeBlock","TableCell"];export{b as CodeBlock,v as CopyableDefault,u as CopyableExamples,x as CopyableTruncated,o as CustomIcons,m as CustomLabels,s as Default,d as Disabled,r as IconOnly,g as InlineUsage,n as Sizes,c as SizesIconOnly,y as TableCell,l as Variants,i as VariantsIconOnly,p as WithCallback,Oe as __namedExportsOrder,Ce as default};
