import{j as e}from"./iframe-DkQu90e3.js";import"./preload-helper-C1FmrZbK.js";const S={title:"Tokens/Typography",parameters:{docs:{description:{component:`
## 타이포그래피 토큰

TDS에서 사용하는 폰트 크기와 줄 높이입니다.

### 폰트 패밀리
- **기본**: Mona Sans (Variable)
- **코드**: Menlo, Monaco, monospace

### 사용법
\`\`\`css
font-size: var(--font-size-14);
line-height: var(--line-height-20);
\`\`\`
        `}}}},i=({name:a,fontSize:t,lineHeight:o,weight:u="normal"})=>e.jsxs("div",{className:"flex items-baseline gap-[var(--primitive-spacing-8)] py-[var(--primitive-spacing-4)] border-b border-[var(--color-border-subtle)]",children:[e.jsxs("div",{className:"w-24 shrink-0",children:[e.jsx("div",{className:"text-label-md",children:a}),e.jsxs("div",{className:"text-body-xs text-[var(--color-text-muted)] font-mono",children:[t,"/",o]})]}),e.jsx("div",{style:{fontSize:`var(${t})`,lineHeight:`var(${o})`,fontWeight:u==="bold"?600:400},children:"The quick brown fox jumps over the lazy dog"})]}),s={render:()=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("h3",{className:"text-heading-h7 mb-[var(--primitive-spacing-4)]",children:"Headings"}),e.jsx(i,{name:"H1",fontSize:"--font-size-40",lineHeight:"--line-height-48",weight:"bold"}),e.jsx(i,{name:"H2",fontSize:"--font-size-32",lineHeight:"--line-height-40",weight:"bold"}),e.jsx(i,{name:"H3",fontSize:"--font-size-24",lineHeight:"--line-height-32",weight:"bold"}),e.jsx(i,{name:"H4",fontSize:"--font-size-18",lineHeight:"--line-height-28",weight:"bold"}),e.jsx(i,{name:"H5",fontSize:"--font-size-16",lineHeight:"--line-height-24",weight:"bold"}),e.jsx(i,{name:"H6",fontSize:"--font-size-14",lineHeight:"--line-height-20",weight:"bold"})]})},r={render:()=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("h3",{className:"text-heading-h7 mb-[var(--primitive-spacing-4)]",children:"Body Text"}),e.jsx(i,{name:"body.lg",fontSize:"--font-size-14",lineHeight:"--line-height-20"}),e.jsx(i,{name:"body.md",fontSize:"--font-size-12",lineHeight:"--line-height-18"}),e.jsx(i,{name:"body.sm",fontSize:"--font-size-11",lineHeight:"--line-height-16"}),e.jsx(i,{name:"body.xs",fontSize:"--font-size-10",lineHeight:"--line-height-14"})]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx("h3",{className:"text-heading-h7",children:"Font Size Variables"}),e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Variable"}),e.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Size"}),e.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Example"})]})}),e.jsx("tbody",{children:[{var:"--font-size-10",size:"10px"},{var:"--font-size-11",size:"11px"},{var:"--font-size-12",size:"12px"},{var:"--font-size-14",size:"14px"},{var:"--font-size-16",size:"16px"},{var:"--font-size-18",size:"18px"},{var:"--font-size-24",size:"24px"},{var:"--font-size-32",size:"32px"},{var:"--font-size-40",size:"40px"}].map(({var:a,size:t})=>e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-[var(--primitive-spacing-2)] font-mono text-body-xs",children:a}),e.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:t}),e.jsx("td",{className:"py-[var(--primitive-spacing-2)]",style:{fontSize:`var(${a})`},children:"Aa"})]},a))})]})]})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx("h3",{className:"text-heading-h7",children:"Line Height Variables"}),e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Variable"}),e.jsx("th",{className:"text-left py-[var(--primitive-spacing-2)]",children:"Value"})]})}),e.jsx("tbody",{children:[{var:"--line-height-14",value:"14px"},{var:"--line-height-16",value:"16px"},{var:"--line-height-18",value:"18px"},{var:"--line-height-20",value:"20px"},{var:"--line-height-24",value:"24px"},{var:"--line-height-28",value:"28px"},{var:"--line-height-32",value:"32px"},{var:"--line-height-40",value:"40px"},{var:"--line-height-48",value:"48px"}].map(({var:a,value:t})=>e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-[var(--primitive-spacing-2)] font-mono text-body-xs",children:a}),e.jsx("td",{className:"py-[var(--primitive-spacing-2)]",children:t})]},a))})]})]})};var h,p,d;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Headings</h3>
      <TypographySample name="H1" fontSize="--font-size-40" lineHeight="--line-height-48" weight="bold" />
      <TypographySample name="H2" fontSize="--font-size-32" lineHeight="--line-height-40" weight="bold" />
      <TypographySample name="H3" fontSize="--font-size-24" lineHeight="--line-height-32" weight="bold" />
      <TypographySample name="H4" fontSize="--font-size-18" lineHeight="--line-height-28" weight="bold" />
      <TypographySample name="H5" fontSize="--font-size-16" lineHeight="--line-height-24" weight="bold" />
      <TypographySample name="H6" fontSize="--font-size-14" lineHeight="--line-height-20" weight="bold" />
    </div>
}`,...(d=(p=s.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var c,m,v;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Body Text</h3>
      <TypographySample name="body.lg" fontSize="--font-size-14" lineHeight="--line-height-20" />
      <TypographySample name="body.md" fontSize="--font-size-12" lineHeight="--line-height-18" />
      <TypographySample name="body.sm" fontSize="--font-size-11" lineHeight="--line-height-16" />
      <TypographySample name="body.xs" fontSize="--font-size-10" lineHeight="--line-height-14" />
    </div>
}`,...(v=(m=r.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var g,x,f;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Font Size Variables</h3>
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-[var(--primitive-spacing-2)]">Variable</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Example</th>
          </tr>
        </thead>
        <tbody>
          {[{
          var: '--font-size-10',
          size: '10px'
        }, {
          var: '--font-size-11',
          size: '11px'
        }, {
          var: '--font-size-12',
          size: '12px'
        }, {
          var: '--font-size-14',
          size: '14px'
        }, {
          var: '--font-size-16',
          size: '16px'
        }, {
          var: '--font-size-18',
          size: '18px'
        }, {
          var: '--font-size-24',
          size: '24px'
        }, {
          var: '--font-size-32',
          size: '32px'
        }, {
          var: '--font-size-40',
          size: '40px'
        }].map(({
          var: v,
          size
        }) => <tr key={v} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)] font-mono text-body-xs">{v}</td>
              <td className="py-[var(--primitive-spacing-2)]">{size}</td>
              <td className="py-[var(--primitive-spacing-2)]" style={{
            fontSize: \`var(\${v})\`
          }}>
                Aa
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var b,z,y;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Line Height Variables</h3>
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-[var(--primitive-spacing-2)]">Variable</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Value</th>
          </tr>
        </thead>
        <tbody>
          {[{
          var: '--line-height-14',
          value: '14px'
        }, {
          var: '--line-height-16',
          value: '16px'
        }, {
          var: '--line-height-18',
          value: '18px'
        }, {
          var: '--line-height-20',
          value: '20px'
        }, {
          var: '--line-height-24',
          value: '24px'
        }, {
          var: '--line-height-28',
          value: '28px'
        }, {
          var: '--line-height-32',
          value: '32px'
        }, {
          var: '--line-height-40',
          value: '40px'
        }, {
          var: '--line-height-48',
          value: '48px'
        }].map(({
          var: v,
          value
        }) => <tr key={v} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)] font-mono text-body-xs">{v}</td>
              <td className="py-[var(--primitive-spacing-2)]">{value}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
}`,...(y=(z=l.parameters)==null?void 0:z.docs)==null?void 0:y.source}}};const H=["Headings","Body","FontSizes","LineHeights"];export{r as Body,n as FontSizes,s as Headings,l as LineHeights,H as __namedExportsOrder,S as default};
