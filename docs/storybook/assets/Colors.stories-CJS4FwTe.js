import{j as e}from"./iframe-C-CGJmyb.js";import"./preload-helper-C1FmrZbK.js";const k={title:"Tokens/Colors",parameters:{docs:{description:{component:`
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
        `}}}},M=({name:d,variable:a,description:o})=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:[e.jsx("div",{className:"w-12 h-12 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] shrink-0",style:{background:`var(${a})`}}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-mono text-body-md",children:a}),e.jsx("div",{className:"text-body-xs text-[var(--color-text-muted)]",children:d}),o&&e.jsx("div",{className:"text-body-xs text-[var(--color-text-subtle)] mt-0.5",children:o})]})]}),r=({title:d,colors:a})=>e.jsxs("div",{className:"mb-[var(--primitive-spacing-8)]",children:[e.jsx("h3",{className:"text-heading-h7 mb-[var(--primitive-spacing-4)] pb-[var(--primitive-spacing-2)] border-b border-[var(--color-border-default)]",children:d}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-[var(--primitive-spacing-2)]",children:a.map(o=>e.jsx(M,{...o},o.variable))})]}),t={render:()=>e.jsx(r,{title:"Text Colors",colors:[{name:"Default",variable:"--color-text-default",description:"기본 텍스트"},{name:"Muted",variable:"--color-text-muted",description:"보조 텍스트"},{name:"Subtle",variable:"--color-text-subtle",description:"약한 텍스트"},{name:"Disabled",variable:"--color-text-disabled",description:"비활성 텍스트"},{name:"Inverse",variable:"--color-text-inverse",description:"반전 텍스트"}]})},l={render:()=>e.jsx(r,{title:"Surface Colors",colors:[{name:"Default",variable:"--color-surface-default",description:"기본 배경"},{name:"Subtle",variable:"--color-surface-subtle",description:"약한 배경"},{name:"Muted",variable:"--color-surface-muted",description:"보조 배경"},{name:"Overlay",variable:"--color-surface-overlay",description:"오버레이 배경"}]})},s={render:()=>e.jsx(r,{title:"Border Colors",colors:[{name:"Default",variable:"--color-border-default",description:"기본 테두리"},{name:"Subtle",variable:"--color-border-subtle",description:"약한 테두리"},{name:"Strong",variable:"--color-border-strong",description:"강한 테두리"},{name:"Focus",variable:"--color-border-focus",description:"포커스 링"}]})},i={render:()=>e.jsx(r,{title:"State Colors",colors:[{name:"Info",variable:"--color-state-info",description:"정보 (파란색)"},{name:"Success",variable:"--color-state-success",description:"성공 (초록색)"},{name:"Warning",variable:"--color-state-warning",description:"경고 (노란색)"},{name:"Danger",variable:"--color-state-danger",description:"위험/에러 (빨간색)"}]})},c={render:()=>e.jsx(r,{title:"Action Colors",colors:[{name:"Primary",variable:"--color-action-primary",description:"주요 액션 색상"},{name:"Primary Hover",variable:"--color-action-primary-hover",description:"호버 시"}]})},n={name:"All Colors",render:()=>e.jsxs("div",{className:"max-w-3xl",children:[e.jsx(r,{title:"Text Colors",colors:[{name:"Default",variable:"--color-text-default"},{name:"Muted",variable:"--color-text-muted"},{name:"Subtle",variable:"--color-text-subtle"},{name:"Disabled",variable:"--color-text-disabled"}]}),e.jsx(r,{title:"Surface Colors",colors:[{name:"Default",variable:"--color-surface-default"},{name:"Subtle",variable:"--color-surface-subtle"},{name:"Muted",variable:"--color-surface-muted"}]}),e.jsx(r,{title:"Border Colors",colors:[{name:"Default",variable:"--color-border-default"},{name:"Subtle",variable:"--color-border-subtle"},{name:"Strong",variable:"--color-border-strong"}]}),e.jsx(r,{title:"State Colors",colors:[{name:"Info",variable:"--color-state-info"},{name:"Success",variable:"--color-state-success"},{name:"Warning",variable:"--color-state-warning"},{name:"Danger",variable:"--color-state-danger"}]})]})};var m,u,b;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(b=(u=t.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var v,p,x;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(p=l.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,S,g;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(g=(S=s.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var C,j,D;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(D=(j=i.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var h,y,N;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <ColorSection title="Action Colors" colors={[{
    name: 'Primary',
    variable: '--color-action-primary',
    description: '주요 액션 색상'
  }, {
    name: 'Primary Hover',
    variable: '--color-action-primary-hover',
    description: '호버 시'
  }]} />
}`,...(N=(y=c.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var w,T,A;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(A=(T=n.parameters)==null?void 0:T.docs)==null?void 0:A.source}}};const P=["TextColors","SurfaceColors","BorderColors","StateColors","ActionColors","AllColors"];export{c as ActionColors,n as AllColors,s as BorderColors,i as StateColors,l as SurfaceColors,t as TextColors,P as __namedExportsOrder,k as default};
