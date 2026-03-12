import{j as a}from"./iframe-IHmg4wqj.js";import"./preload-helper-C1FmrZbK.js";const f={title:"Tokens/Spacing",parameters:{docs:{description:{component:`
## 간격 토큰

TDS에서 사용하는 간격(spacing) 값입니다.

### 기본 단위
4px 기반 간격 시스템을 사용합니다.

### 사용법
\`\`\`css
padding: var(--spacing-4);
gap: var(--spacing-2);
margin: var(--spacing-6);
\`\`\`

\`\`\`tsx
<div className="p-[var(--spacing-4)] gap-[var(--spacing-2)]">
  ...
</div>
\`\`\`
        `}}}},e=({name:s,value:r})=>a.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:[a.jsxs("div",{className:"w-24 shrink-0",children:[a.jsx("div",{className:"font-mono text-body-md",children:s}),a.jsx("div",{className:"text-body-xs text-[var(--color-text-muted)]",children:r})]}),a.jsx("div",{className:"bg-[var(--color-action-primary)] h-4",style:{width:`var(${s})`}})]}),i={render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[a.jsx("h3",{className:"text-heading-h7 mb-[var(--primitive-spacing-4)]",children:"Spacing Scale"}),a.jsx(e,{name:"--spacing-1",value:"4px"}),a.jsx(e,{name:"--spacing-2",value:"8px"}),a.jsx(e,{name:"--spacing-3",value:"12px"}),a.jsx(e,{name:"--spacing-4",value:"16px"}),a.jsx(e,{name:"--spacing-5",value:"20px"}),a.jsx(e,{name:"--spacing-6",value:"24px"}),a.jsx(e,{name:"--spacing-8",value:"32px"}),a.jsx(e,{name:"--spacing-10",value:"40px"}),a.jsx(e,{name:"--spacing-12",value:"48px"}),a.jsx(e,{name:"--spacing-16",value:"64px"})]})},t={render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-heading-h7",children:"Border Radius"}),a.jsx("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-4)]",children:[{name:"--radius-sm",value:"4px"},{name:"--radius-md",value:"6px"},{name:"--radius-lg",value:"8px"},{name:"--radius-xl",value:"16px"},{name:"--radius-full",value:"9999px"}].map(({name:s,value:r})=>a.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[a.jsx("div",{className:"w-16 h-16 bg-[var(--color-action-primary)]",style:{borderRadius:`var(${s})`}}),a.jsx("div",{className:"text-body-xs font-mono",children:s}),a.jsx("div",{className:"text-body-xs text-[var(--color-text-muted)]",children:r})]},s))})]})},c={render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[a.jsx("h3",{className:"text-heading-h7",children:"Shadows"}),a.jsx("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-8)] p-[var(--primitive-spacing-8)]",children:[{name:"shadow-sm",class:"shadow-sm"},{name:"shadow",class:"shadow"},{name:"shadow-md",class:"shadow-md"},{name:"shadow-lg",class:"shadow-lg"},{name:"shadow-xl",class:"shadow-xl"}].map(({name:s,class:r})=>a.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[a.jsx("div",{className:`w-24 h-24 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] ${r}`}),a.jsx("div",{className:"text-body-xs font-mono",children:s})]},s))})]})},l={render:()=>a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[a.jsx("h3",{className:"text-heading-h7",children:"Common Component Spacing"}),a.jsxs("div",{children:[a.jsx("h4",{className:"text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Button Padding"}),a.jsxs("table",{className:"w-full text-body-md",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[a.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Size"}),a.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Height"}),a.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Padding X"})]})}),a.jsxs("tbody",{children:[a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"sm"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"28px"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"10px"})]}),a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"md"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"32px"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"12px"})]}),a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"lg"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"40px"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"12px"})]})]})]})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]",children:"Input/Select Width"}),a.jsxs("table",{className:"w-full text-body-md",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[a.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Size"}),a.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Width"})]})}),a.jsxs("tbody",{children:[a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"sm"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"160px"})]}),a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"md"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"240px"})]}),a.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"lg"}),a.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:"320px"})]})]})]})]})]})};var n,d,p;i.parameters={...i.parameters,docs:{...(n=i.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Spacing Scale</h3>
      <SpacingSample name="--spacing-1" value="4px" />
      <SpacingSample name="--spacing-2" value="8px" />
      <SpacingSample name="--spacing-3" value="12px" />
      <SpacingSample name="--spacing-4" value="16px" />
      <SpacingSample name="--spacing-5" value="20px" />
      <SpacingSample name="--spacing-6" value="24px" />
      <SpacingSample name="--spacing-8" value="32px" />
      <SpacingSample name="--spacing-10" value="40px" />
      <SpacingSample name="--spacing-12" value="48px" />
      <SpacingSample name="--spacing-16" value="64px" />
    </div>
}`,...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var m,v,o;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Border Radius</h3>
      <div className="flex flex-wrap gap-[var(--primitive-spacing-4)]">
        {[{
        name: '--radius-sm',
        value: '4px'
      }, {
        name: '--radius-md',
        value: '6px'
      }, {
        name: '--radius-lg',
        value: '8px'
      }, {
        name: '--radius-xl',
        value: '16px'
      }, {
        name: '--radius-full',
        value: '9999px'
      }].map(({
        name,
        value
      }) => <div key={name} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
            <div className="w-16 h-16 bg-[var(--color-action-primary)]" style={{
          borderRadius: \`var(\${name})\`
        }} />
            <div className="text-body-xs font-mono">{name}</div>
            <div className="text-body-xs text-[var(--color-text-muted)]">{value}</div>
          </div>)}
      </div>
    </div>
}`,...(o=(v=t.parameters)==null?void 0:v.docs)==null?void 0:o.source}}};var x,g,h;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Shadows</h3>
      <div className="flex flex-wrap gap-[var(--primitive-spacing-8)] p-[var(--primitive-spacing-8)]">
        {[{
        name: 'shadow-sm',
        class: 'shadow-sm'
      }, {
        name: 'shadow',
        class: 'shadow'
      }, {
        name: 'shadow-md',
        class: 'shadow-md'
      }, {
        name: 'shadow-lg',
        class: 'shadow-lg'
      }, {
        name: 'shadow-xl',
        class: 'shadow-xl'
      }].map(({
        name,
        class: className
      }) => <div key={name} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
            <div className={\`w-24 h-24 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] \${className}\`} />
            <div className="text-body-xs font-mono">{name}</div>
          </div>)}
      </div>
    </div>
}`,...(h=(g=c.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var b,N,u;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <h3 className="text-heading-h7">Common Component Spacing</h3>

      <div>
        <h4 className="text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Button Padding
        </h4>
        <table className="w-full text-body-md">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Height</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Padding X</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">sm</td>
              <td className="py-[var(--primitive-spacing-2)]">28px</td>
              <td className="py-[var(--primitive-spacing-2)]">10px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">md</td>
              <td className="py-[var(--primitive-spacing-2)]">32px</td>
              <td className="py-[var(--primitive-spacing-2)]">12px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">lg</td>
              <td className="py-[var(--primitive-spacing-2)]">40px</td>
              <td className="py-[var(--primitive-spacing-2)]">12px</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Input/Select Width
        </h4>
        <table className="w-full text-body-md">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Width</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">sm</td>
              <td className="py-[var(--primitive-spacing-2)]">160px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">md</td>
              <td className="py-[var(--primitive-spacing-2)]">240px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">lg</td>
              <td className="py-[var(--primitive-spacing-2)]">320px</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
}`,...(u=(N=l.parameters)==null?void 0:N.docs)==null?void 0:u.source}}};const S=["SpacingScale","BorderRadius","Shadows","ComponentSpacing"];export{t as BorderRadius,l as ComponentSpacing,c as Shadows,i as SpacingScale,S as __namedExportsOrder,f as default};
