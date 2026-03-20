import{j as e}from"./iframe-ko1KmZFS.js";import{E as N}from"./EmptyState-CtrpuPk2.js";import{B as k}from"./Button-BQge8bfe.js";import{I as j}from"./IconPlus-DF_1TQez.js";import{I as b}from"./IconDatabase-CEk_lbIp.js";import{I as x}from"./IconFolder-DVQe7vuN.js";import{I as S}from"./IconSearch-DGZDdks0.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./createReactComponent-B-brzlrB.js";const P={title:"Feedback/EmptyState",component:N,parameters:{layout:"padded",docs:{description:{component:`
빈 상태를 표시하는 컴포넌트. 데이터가 없거나 검색 결과가 없을 때 사용합니다.

**변형:**
- \`card\`: 테두리와 배경이 있는 카드 형태 (기본)
- \`inline\`: 패딩만 있는 인라인 형태
        `}}},tags:["autodocs"]},t={args:{icon:e.jsx(b,{size:48,stroke:1}),title:"No instances found",description:"Create your first instance to get started.",action:e.jsx(k,{variant:"primary",size:"md",leftIcon:e.jsx(j,{size:12,stroke:1.5}),children:"Create Instance"})}},o={args:{icon:e.jsx(S,{size:48,stroke:1}),title:"No results found",description:"Try adjusting your search or filter criteria."}},a={args:{icon:e.jsx(x,{size:48,stroke:1}),title:"No files uploaded",description:"Drag and drop files here or click the upload button.",variant:"inline",action:e.jsx(k,{variant:"secondary",size:"sm",children:"Upload File"})}},r={args:{title:"No data available",description:"Data will appear here once it becomes available."}},s={args:{icon:e.jsx(b,{size:48,stroke:1}),title:"No volumes attached",description:"This instance does not have any volumes attached."}};var i,n,c;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    icon: <IconDatabase size={48} stroke={1} />,
    title: 'No instances found',
    description: 'Create your first instance to get started.',
    action: <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
        Create Instance
      </Button>
  }
}`,...(c=(n=t.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var d,l,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    icon: <IconSearch size={48} stroke={1} />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.'
  }
}`,...(p=(l=o.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    icon: <IconFolder size={48} stroke={1} />,
    title: 'No files uploaded',
    description: 'Drag and drop files here or click the upload button.',
    variant: 'inline',
    action: <Button variant="secondary" size="sm">
        Upload File
      </Button>
  }
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var f,g,I;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    title: 'No data available',
    description: 'Data will appear here once it becomes available.'
  }
}`,...(I=(g=r.parameters)==null?void 0:g.docs)==null?void 0:I.source}}};var v,y,z;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    icon: <IconDatabase size={48} stroke={1} />,
    title: 'No volumes attached',
    description: 'This instance does not have any volumes attached.'
  }
}`,...(z=(y=s.parameters)==null?void 0:y.docs)==null?void 0:z.source}}};const U=["Default","NoSearchResults","Inline","WithoutIcon","WithoutAction"];export{t as Default,a as Inline,o as NoSearchResults,s as WithoutAction,r as WithoutIcon,U as __namedExportsOrder,P as default};
