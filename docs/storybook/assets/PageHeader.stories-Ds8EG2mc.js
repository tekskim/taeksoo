import{j as r}from"./iframe-C-CGJmyb.js";import{P as g}from"./PageHeader-8Kyq5Bfi.js";import{B as u}from"./Button-CFzl0PLa.js";import{I as C}from"./IconPlus-18QXzXZX.js";import{C as I}from"./ContextMenu-Bf5DzK1I.js";import{I as f}from"./IconChevronDown-Db3dj90x.js";import"./preload-helper-C1FmrZbK.js";import"./cn-CshvV4Tc.js";import"./createReactComponent-BvK7gRRe.js";import"./index-KOaWZOGP.js";import"./IconChevronRight-D7GmvFMo.js";import"./Tooltip-g2-GlX-l.js";const M={title:"Layout/PageHeader",component:g,parameters:{layout:"padded",docs:{description:{component:`
리스트 페이지의 공통 헤더 컴포넌트. 제목과 우측 액션 버튼을 포함합니다.

**사용 위치:** 모든 리스트 페이지 최상단
        `}}},tags:["autodocs"]},t={args:{title:"Instances",actions:r.jsx(u,{variant:"primary",size:"md",leftIcon:r.jsx(C,{size:12,stroke:1.5}),children:"Create Instance"})}},o={args:{title:"Pods",actions:r.jsx(I,{items:[{id:"yaml",label:"From YAML",onClick:()=>{}},{id:"form",label:"From Form",onClick:()=>{}}],trigger:"click",align:"right",children:r.jsx(u,{variant:"primary",size:"md",rightIcon:r.jsx(f,{size:12,stroke:1.5}),children:"Create Pod"})})}},e={args:{title:"Dashboard"}};var a,s,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    title: 'Instances',
    actions: <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
        Create Instance
      </Button>
  }
}`,...(i=(s=t.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var n,c,m;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    title: 'Pods',
    actions: <ContextMenu items={[{
      id: 'yaml',
      label: 'From YAML',
      onClick: () => {}
    }, {
      id: 'form',
      label: 'From Form',
      onClick: () => {}
    }]} trigger="click" align="right">
        <Button variant="primary" size="md" rightIcon={<IconChevronDown size={12} stroke={1.5} />}>
          Create Pod
        </Button>
      </ContextMenu>
  }
}`,...(m=(c=o.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,d,p;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: 'Dashboard'
  }
}`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};const w=["Default","WithDropdownAction","TitleOnly"];export{t as Default,e as TitleOnly,o as WithDropdownAction,w as __namedExportsOrder,M as default};
