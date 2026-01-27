import{j as e}from"./iframe-DKmDJy9M.js";import"./preload-helper-C1FmrZbK.js";const S={title:"Tokens/Typography",parameters:{docs:{description:{component:`
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
        `}}}},t=({name:s,fontSize:a,lineHeight:o,weight:u="normal"})=>e.jsxs("div",{className:"flex items-baseline gap-8 py-4 border-b border-[var(--color-border-subtle)]",children:[e.jsxs("div",{className:"w-24 shrink-0",children:[e.jsx("div",{className:"text-sm font-medium",children:s}),e.jsxs("div",{className:"text-xs text-[var(--color-text-muted)] font-mono",children:[a,"/",o]})]}),e.jsx("div",{style:{fontSize:`var(${a})`,lineHeight:`var(${o})`,fontWeight:u==="bold"?600:400},children:"The quick brown fox jumps over the lazy dog"})]}),i={render:()=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4",children:"Headings"}),e.jsx(t,{name:"H1",fontSize:"--font-size-40",lineHeight:"--line-height-48",weight:"bold"}),e.jsx(t,{name:"H2",fontSize:"--font-size-32",lineHeight:"--line-height-40",weight:"bold"}),e.jsx(t,{name:"H3",fontSize:"--font-size-24",lineHeight:"--line-height-32",weight:"bold"}),e.jsx(t,{name:"H4",fontSize:"--font-size-18",lineHeight:"--line-height-28",weight:"bold"}),e.jsx(t,{name:"H5",fontSize:"--font-size-16",lineHeight:"--line-height-24",weight:"bold"}),e.jsx(t,{name:"H6",fontSize:"--font-size-14",lineHeight:"--line-height-20",weight:"bold"})]})},l={render:()=>e.jsxs("div",{className:"flex flex-col",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4",children:"Body Text"}),e.jsx(t,{name:"body.lg",fontSize:"--font-size-14",lineHeight:"--line-height-20"}),e.jsx(t,{name:"body.md",fontSize:"--font-size-12",lineHeight:"--line-height-18"}),e.jsx(t,{name:"body.sm",fontSize:"--font-size-11",lineHeight:"--line-height-16"}),e.jsx(t,{name:"body.xs",fontSize:"--font-size-10",lineHeight:"--line-height-14"})]})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"Font Size Variables"}),e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left py-2",children:"Variable"}),e.jsx("th",{className:"text-left py-2",children:"Size"}),e.jsx("th",{className:"text-left py-2",children:"Example"})]})}),e.jsx("tbody",{children:[{var:"--font-size-10",size:"10px"},{var:"--font-size-11",size:"11px"},{var:"--font-size-12",size:"12px"},{var:"--font-size-14",size:"14px"},{var:"--font-size-16",size:"16px"},{var:"--font-size-18",size:"18px"},{var:"--font-size-24",size:"24px"},{var:"--font-size-32",size:"32px"},{var:"--font-size-40",size:"40px"}].map(({var:s,size:a})=>e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-2 font-mono text-xs",children:s}),e.jsx("td",{className:"py-2",children:a}),e.jsx("td",{className:"py-2",style:{fontSize:`var(${s})`},children:"Aa"})]},s))})]})]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"Line Height Variables"}),e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left py-2",children:"Variable"}),e.jsx("th",{className:"text-left py-2",children:"Value"})]})}),e.jsx("tbody",{children:[{var:"--line-height-14",value:"14px"},{var:"--line-height-16",value:"16px"},{var:"--line-height-18",value:"18px"},{var:"--line-height-20",value:"20px"},{var:"--line-height-24",value:"24px"},{var:"--line-height-28",value:"28px"},{var:"--line-height-32",value:"32px"},{var:"--line-height-40",value:"40px"},{var:"--line-height-48",value:"48px"}].map(({var:s,value:a})=>e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-2 font-mono text-xs",children:s}),e.jsx("td",{className:"py-2",children:a})]},s))})]})]})};var h,d,m;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col">
      <h3 className="text-sm font-semibold mb-4">Headings</h3>
      <TypographySample name="H1" fontSize="--font-size-40" lineHeight="--line-height-48" weight="bold" />
      <TypographySample name="H2" fontSize="--font-size-32" lineHeight="--line-height-40" weight="bold" />
      <TypographySample name="H3" fontSize="--font-size-24" lineHeight="--line-height-32" weight="bold" />
      <TypographySample name="H4" fontSize="--font-size-18" lineHeight="--line-height-28" weight="bold" />
      <TypographySample name="H5" fontSize="--font-size-16" lineHeight="--line-height-24" weight="bold" />
      <TypographySample name="H6" fontSize="--font-size-14" lineHeight="--line-height-20" weight="bold" />
    </div>
}`,...(m=(d=i.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var x,c,p;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col">
      <h3 className="text-sm font-semibold mb-4">Body Text</h3>
      <TypographySample name="body.lg" fontSize="--font-size-14" lineHeight="--line-height-20" />
      <TypographySample name="body.md" fontSize="--font-size-12" lineHeight="--line-height-18" />
      <TypographySample name="body.sm" fontSize="--font-size-11" lineHeight="--line-height-16" />
      <TypographySample name="body.xs" fontSize="--font-size-10" lineHeight="--line-height-14" />
    </div>
}`,...(p=(c=l.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var f,g,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Font Size Variables</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-2">Variable</th>
            <th className="text-left py-2">Size</th>
            <th className="text-left py-2">Example</th>
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
              <td className="py-2 font-mono text-xs">{v}</td>
              <td className="py-2">{size}</td>
              <td className="py-2" style={{
            fontSize: \`var(\${v})\`
          }}>Aa</td>
            </tr>)}
        </tbody>
      </table>
    </div>
}`,...(v=(g=r.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var b,z,y;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Line Height Variables</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-2">Variable</th>
            <th className="text-left py-2">Value</th>
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
              <td className="py-2 font-mono text-xs">{v}</td>
              <td className="py-2">{value}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
}`,...(y=(z=n.parameters)==null?void 0:z.docs)==null?void 0:y.source}}};const H=["Headings","Body","FontSizes","LineHeights"];export{l as Body,r as FontSizes,i as Headings,n as LineHeights,H as __namedExportsOrder,S as default};
