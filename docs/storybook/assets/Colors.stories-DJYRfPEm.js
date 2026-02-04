import{j as e}from"./iframe-tYQsglED.js";import"./preload-helper-C1FmrZbK.js";const k={title:"Tokens/Colors",parameters:{docs:{description:{component:`
## 컬러 토큰

TDS에서 사용하는 시맨틱 컬러 토큰입니다.  
CSS 변수로 정의되어 있어 다크 모드 자동 지원됩니다.

### 사용법
\`\`\`css
/* CSS에서 */
.element {
  color: var(--color-text-default);
  background: var(--color-surface-default);
}
\`\`\`

\`\`\`tsx
/* Tailwind에서 */
<div className="text-[var(--color-text-default)] bg-[var(--color-surface-default)]">
  ...
</div>
\`\`\`
        `}}}},M=({name:d,variable:a,description:o})=>e.jsxs("div",{className:"flex items-center gap-4 py-2",children:[e.jsx("div",{className:"w-12 h-12 rounded-lg border border-[var(--color-border-default)] shrink-0",style:{background:`var(${a})`}}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-mono text-sm",children:a}),e.jsx("div",{className:"text-xs text-[var(--color-text-muted)]",children:d}),o&&e.jsx("div",{className:"text-xs text-[var(--color-text-subtle)] mt-0.5",children:o})]})]}),r=({title:d,colors:a})=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4 pb-2 border-b border-[var(--color-border-default)]",children:d}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2",children:a.map(o=>e.jsx(M,{...o},o.variable))})]}),l={render:()=>e.jsx(r,{title:"Text Colors",colors:[{name:"Default",variable:"--color-text-default",description:"기본 텍스트"},{name:"Muted",variable:"--color-text-muted",description:"보조 텍스트"},{name:"Subtle",variable:"--color-text-subtle",description:"약한 텍스트"},{name:"Disabled",variable:"--color-text-disabled",description:"비활성 텍스트"},{name:"Inverse",variable:"--color-text-inverse",description:"반전 텍스트"}]})},t={render:()=>e.jsx(r,{title:"Surface Colors",colors:[{name:"Default",variable:"--color-surface-default",description:"기본 배경"},{name:"Subtle",variable:"--color-surface-subtle",description:"약한 배경"},{name:"Muted",variable:"--color-surface-muted",description:"보조 배경"},{name:"Overlay",variable:"--color-surface-overlay",description:"오버레이 배경"}]})},s={render:()=>e.jsx(r,{title:"Border Colors",colors:[{name:"Default",variable:"--color-border-default",description:"기본 테두리"},{name:"Subtle",variable:"--color-border-subtle",description:"약한 테두리"},{name:"Strong",variable:"--color-border-strong",description:"강한 테두리"},{name:"Focus",variable:"--color-border-focus",description:"포커스 링"}]})},c={render:()=>e.jsx(r,{title:"State Colors",colors:[{name:"Info",variable:"--color-state-info",description:"정보 (파란색)"},{name:"Success",variable:"--color-state-success",description:"성공 (초록색)"},{name:"Warning",variable:"--color-state-warning",description:"경고 (노란색)"},{name:"Danger",variable:"--color-state-danger",description:"위험/에러 (빨간색)"}]})},i={render:()=>e.jsx(r,{title:"Action Colors",colors:[{name:"Primary",variable:"--color-action-primary",description:"주요 액션 색상"},{name:"Primary Hover",variable:"--color-action-primary-hover",description:"호버 시"}]})},n={name:"All Colors",render:()=>e.jsxs("div",{className:"max-w-3xl",children:[e.jsx(r,{title:"Text Colors",colors:[{name:"Default",variable:"--color-text-default"},{name:"Muted",variable:"--color-text-muted"},{name:"Subtle",variable:"--color-text-subtle"},{name:"Disabled",variable:"--color-text-disabled"}]}),e.jsx(r,{title:"Surface Colors",colors:[{name:"Default",variable:"--color-surface-default"},{name:"Subtle",variable:"--color-surface-subtle"},{name:"Muted",variable:"--color-surface-muted"}]}),e.jsx(r,{title:"Border Colors",colors:[{name:"Default",variable:"--color-border-default"},{name:"Subtle",variable:"--color-border-subtle"},{name:"Strong",variable:"--color-border-strong"}]}),e.jsx(r,{title:"State Colors",colors:[{name:"Info",variable:"--color-state-info"},{name:"Success",variable:"--color-state-success"},{name:"Warning",variable:"--color-state-warning"},{name:"Danger",variable:"--color-state-danger"}]})]})};var m,u,b;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <ColorSection title="Text Colors" colors={[{
    name: 'Default',
    variable: '--color-text-default',
    description: '기본 텍스트'
  }, {
    name: 'Muted',
    variable: '--color-text-muted',
    description: '보조 텍스트'
  }, {
    name: 'Subtle',
    variable: '--color-text-subtle',
    description: '약한 텍스트'
  }, {
    name: 'Disabled',
    variable: '--color-text-disabled',
    description: '비활성 텍스트'
  }, {
    name: 'Inverse',
    variable: '--color-text-inverse',
    description: '반전 텍스트'
  }]} />
}`,...(b=(u=l.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var v,p,f;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <ColorSection title="Surface Colors" colors={[{
    name: 'Default',
    variable: '--color-surface-default',
    description: '기본 배경'
  }, {
    name: 'Subtle',
    variable: '--color-surface-subtle',
    description: '약한 배경'
  }, {
    name: 'Muted',
    variable: '--color-surface-muted',
    description: '보조 배경'
  }, {
    name: 'Overlay',
    variable: '--color-surface-overlay',
    description: '오버레이 배경'
  }]} />
}`,...(f=(p=t.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var x,S,C;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <ColorSection title="Border Colors" colors={[{
    name: 'Default',
    variable: '--color-border-default',
    description: '기본 테두리'
  }, {
    name: 'Subtle',
    variable: '--color-border-subtle',
    description: '약한 테두리'
  }, {
    name: 'Strong',
    variable: '--color-border-strong',
    description: '강한 테두리'
  }, {
    name: 'Focus',
    variable: '--color-border-focus',
    description: '포커스 링'
  }]} />
}`,...(C=(S=s.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var g,j,D;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <ColorSection title="State Colors" colors={[{
    name: 'Info',
    variable: '--color-state-info',
    description: '정보 (파란색)'
  }, {
    name: 'Success',
    variable: '--color-state-success',
    description: '성공 (초록색)'
  }, {
    name: 'Warning',
    variable: '--color-state-warning',
    description: '경고 (노란색)'
  }, {
    name: 'Danger',
    variable: '--color-state-danger',
    description: '위험/에러 (빨간색)'
  }]} />
}`,...(D=(j=c.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var h,y,N;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <ColorSection title="Action Colors" colors={[{
    name: 'Primary',
    variable: '--color-action-primary',
    description: '주요 액션 색상'
  }, {
    name: 'Primary Hover',
    variable: '--color-action-primary-hover',
    description: '호버 시'
  }]} />
}`,...(N=(y=i.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var w,T,A;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'All Colors',
  render: () => <div className="max-w-3xl">
      <ColorSection title="Text Colors" colors={[{
      name: 'Default',
      variable: '--color-text-default'
    }, {
      name: 'Muted',
      variable: '--color-text-muted'
    }, {
      name: 'Subtle',
      variable: '--color-text-subtle'
    }, {
      name: 'Disabled',
      variable: '--color-text-disabled'
    }]} />
      <ColorSection title="Surface Colors" colors={[{
      name: 'Default',
      variable: '--color-surface-default'
    }, {
      name: 'Subtle',
      variable: '--color-surface-subtle'
    }, {
      name: 'Muted',
      variable: '--color-surface-muted'
    }]} />
      <ColorSection title="Border Colors" colors={[{
      name: 'Default',
      variable: '--color-border-default'
    }, {
      name: 'Subtle',
      variable: '--color-border-subtle'
    }, {
      name: 'Strong',
      variable: '--color-border-strong'
    }]} />
      <ColorSection title="State Colors" colors={[{
      name: 'Info',
      variable: '--color-state-info'
    }, {
      name: 'Success',
      variable: '--color-state-success'
    }, {
      name: 'Warning',
      variable: '--color-state-warning'
    }, {
      name: 'Danger',
      variable: '--color-state-danger'
    }]} />
    </div>
}`,...(A=(T=n.parameters)==null?void 0:T.docs)==null?void 0:A.source}}};const P=["TextColors","SurfaceColors","BorderColors","StateColors","ActionColors","AllColors"];export{i as ActionColors,n as AllColors,s as BorderColors,c as StateColors,t as SurfaceColors,l as TextColors,P as __namedExportsOrder,k as default};
