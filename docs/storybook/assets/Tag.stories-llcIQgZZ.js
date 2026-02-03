import{r as u,j as e}from"./iframe-CqQbtNpW.js";import{t as z}from"./bundle-mjs-BZSatpsL.js";import{I as Ce}from"./IconX-CNFYI74y.js";import{I as De}from"./IconTag-DC9ph_yO.js";import{I as ze}from"./IconUser-ti1TbcJd.js";import{I as Ge}from"./IconStar-D9SgTXgO.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dcnxk0R3.js";const Ie={default:{solid:"bg-[var(--color-surface-muted)] text-[var(--color-text-default)] border-transparent",outline:"bg-transparent text-[var(--color-text-default)] border-[var(--color-border-default)]"},primary:{solid:"bg-[var(--color-action-primary)] text-white border-transparent",outline:"bg-transparent text-[var(--color-action-primary)] border-[var(--color-action-primary)]"},success:{solid:"bg-[var(--color-state-success)] text-white border-transparent",outline:"bg-[var(--color-state-success-subtle)] text-[var(--color-state-success)] border-[var(--color-state-success)]"},warning:{solid:"bg-[var(--color-state-warning)] text-white border-transparent",outline:"bg-[var(--color-state-warning-subtle)] text-[var(--color-state-warning)] border-[var(--color-state-warning)]"},danger:{solid:"bg-[var(--color-state-danger)] text-white border-transparent",outline:"bg-[var(--color-state-danger-subtle)] text-[var(--color-state-danger)] border-[var(--color-state-danger)]"},info:{solid:"bg-[var(--color-state-info)] text-white border-transparent",outline:"bg-[var(--color-state-info-subtle)] text-[var(--color-state-info)] border-[var(--color-state-info)]"}},ke={sm:{container:"h-5 px-1.5 text-body-xs gap-1",icon:10,closeIcon:10},md:{container:"h-6 px-2 text-body-sm gap-1.5",icon:12,closeIcon:12},lg:{container:"h-7 px-2.5 text-body-md gap-1.5",icon:14,closeIcon:14}},a=u.forwardRef(({children:t,variant:n="default",size:l="md",closable:s=!1,onClose:r,icon:c,disabled:i=!1,rounded:he=!1,outline:be=!1,clickable:ye=!1,className:je="",onClick:g,...Ne},Se)=>{const m=ye||!!g,G=ke[l],I=Ie[n],we=d=>{d.stopPropagation(),r==null||r()};return e.jsxs("span",{ref:Se,role:m?"button":void 0,tabIndex:m&&!i?0:void 0,onClick:i?void 0:g,onKeyDown:m&&!i?d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),g==null||g(d))}:void 0,className:z("inline-flex items-center justify-center","border","font-medium","leading-none","whitespace-nowrap",G.container,be?I.outline:I.solid,he?"rounded-full":"rounded",m&&!i&&"cursor-pointer hover:opacity-80 transition-opacity",i&&"opacity-50 cursor-not-allowed",je),...Ne,children:[c&&e.jsx("span",{className:"shrink-0 flex items-center",children:c}),e.jsx("span",{className:"truncate",children:t}),s&&e.jsx("button",{type:"button",onClick:we,disabled:i,className:z("shrink-0 flex items-center justify-center","rounded-full","hover:bg-black/10","transition-colors","focus:outline-none",i&&"pointer-events-none"),"aria-label":"Remove tag",children:e.jsx(Ce,{size:G.closeIcon,strokeWidth:2})})]})});a.displayName="Tag";const Ve={sm:"gap-1",md:"gap-2",lg:"gap-3"},o=u.forwardRef(({gap:t="md",children:n,className:l="",...s},r)=>e.jsx("div",{ref:r,className:z("flex flex-wrap items-center",Ve[t],l),...s,children:n}));o.displayName="TagGroup";a.__docgenInfo={description:"",methods:[],displayName:"Tag",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Tag content"},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'primary'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'info'"}]},description:"Tag variant/color",defaultValue:{value:"'default'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Tag size",defaultValue:{value:"'md'",computed:!1}},closable:{required:!1,tsType:{name:"boolean"},description:"Show close button",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Close button click handler"},icon:{required:!1,tsType:{name:"ReactNode"},description:"Left icon"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},rounded:{required:!1,tsType:{name:"boolean"},description:"Rounded style (pill shape)",defaultValue:{value:"false",computed:!1}},outline:{required:!1,tsType:{name:"boolean"},description:"Outline style (bordered, no fill)",defaultValue:{value:"false",computed:!1}},clickable:{required:!1,tsType:{name:"boolean"},description:"Clickable tag",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}}},composes:["Omit"]};o.__docgenInfo={description:"",methods:[],displayName:"TagGroup",props:{gap:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Gap between tags",defaultValue:{value:"'md'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Children tags"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};const Oe={title:"Components/Tag",component:a,parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["default","primary","success","warning","danger","info"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},p={args:{children:"Tag"}},x={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"primary",children:"Primary"}),e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"warning",children:"Warning"}),e.jsx(a,{variant:"danger",children:"Danger"}),e.jsx(a,{variant:"info",children:"Info"})]})},v={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"default",outline:!0,children:"Default"}),e.jsx(a,{variant:"primary",outline:!0,children:"Primary"}),e.jsx(a,{variant:"success",outline:!0,children:"Success"}),e.jsx(a,{variant:"warning",outline:!0,children:"Warning"}),e.jsx(a,{variant:"danger",outline:!0,children:"Danger"}),e.jsx(a,{variant:"info",outline:!0,children:"Info"})]})},f={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{size:"sm",children:"Small"}),e.jsx(a,{size:"md",children:"Medium"}),e.jsx(a,{size:"lg",children:"Large"})]})},T={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{rounded:!0,children:"Default"}),e.jsx(a,{variant:"primary",rounded:!0,children:"Primary"}),e.jsx(a,{variant:"success",rounded:!0,children:"Success"}),e.jsx(a,{variant:"danger",rounded:!0,outline:!0,children:"Danger Outline"})]})},h={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{icon:e.jsx(De,{size:12}),children:"Category"}),e.jsx(a,{variant:"primary",icon:e.jsx(ze,{size:12}),children:"User"}),e.jsx(a,{variant:"success",icon:e.jsx(Ge,{size:12}),children:"Featured"})]})},b={render:()=>{const[t,n]=u.useState(["React","TypeScript","Tailwind","Vite"]),l=s=>{n(t.filter(r=>r!==s))};return e.jsxs(o,{children:[t.map(s=>e.jsx(a,{closable:!0,onClose:()=>l(s),children:s},s)),t.length===0&&e.jsx("span",{className:"text-body-sm text-[var(--color-text-muted)]",children:"No tags"})]})}},y={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"default",closable:!0,onClose:()=>{},children:"Default"}),e.jsx(a,{variant:"primary",closable:!0,onClose:()=>{},children:"Primary"}),e.jsx(a,{variant:"success",closable:!0,onClose:()=>{},children:"Success"}),e.jsx(a,{variant:"danger",closable:!0,onClose:()=>{},children:"Danger"})]})},j={render:()=>{const[t,n]=u.useState(["react"]),l=r=>{n(c=>c.includes(r)?c.filter(i=>i!==r):[...c,r])},s=["react","vue","angular","svelte"];return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(o,{children:s.map(r=>e.jsx(a,{variant:t.includes(r)?"primary":"default",onClick:()=>l(r),clickable:!0,children:r},r))}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Selected: ",t.join(", ")||"None"]})]})}},N={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{disabled:!0,children:"Disabled"}),e.jsx(a,{variant:"primary",disabled:!0,children:"Disabled Primary"}),e.jsx(a,{closable:!0,disabled:!0,onClose:()=>{},children:"Disabled Closable"})]})},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Small Gap"}),e.jsxs(o,{gap:"sm",children:[e.jsx(a,{children:"Tag 1"}),e.jsx(a,{children:"Tag 2"}),e.jsx(a,{children:"Tag 3"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Medium Gap (default)"}),e.jsxs(o,{gap:"md",children:[e.jsx(a,{children:"Tag 1"}),e.jsx(a,{children:"Tag 2"}),e.jsx(a,{children:"Tag 3"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Large Gap"}),e.jsxs(o,{gap:"lg",children:[e.jsx(a,{children:"Tag 1"}),e.jsx(a,{children:"Tag 2"}),e.jsx(a,{children:"Tag 3"})]})]})]})},w={render:()=>e.jsxs("div",{className:"p-4 bg-[var(--color-surface-subtle)] rounded-lg",children:[e.jsx("h3",{className:"text-heading-h6 text-[var(--color-text-default)] mb-3",children:"Skills"}),e.jsxs(o,{children:[e.jsx(a,{variant:"primary",children:"JavaScript"}),e.jsx(a,{variant:"primary",children:"TypeScript"}),e.jsx(a,{variant:"primary",children:"React"}),e.jsx(a,{variant:"info",children:"Node.js"}),e.jsx(a,{variant:"info",children:"Python"}),e.jsx(a,{variant:"success",children:"AWS"}),e.jsx(a,{variant:"success",children:"Docker"})]})]})},C={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)] w-24",children:"Production:"}),e.jsx(a,{variant:"success",size:"sm",children:"Healthy"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)] w-24",children:"Staging:"}),e.jsx(a,{variant:"warning",size:"sm",children:"Deploying"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)] w-24",children:"Development:"}),e.jsx(a,{variant:"danger",size:"sm",children:"Failed"})]})]})},D={render:()=>{const[t,n]=u.useState(["Status: Active","Type: VM","Region: US-East"]),l=s=>{n(t.filter(r=>r!==s))};return e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("div",{className:"text-label-sm text-[var(--color-text-subtle)]",children:"Active Filters"}),e.jsxs(o,{children:[t.map(s=>e.jsx(a,{variant:"primary",outline:!0,closable:!0,onClose:()=>l(s),children:s},s)),t.length>0&&e.jsx("button",{className:"text-body-sm text-[var(--color-action-primary)] hover:underline",onClick:()=>n([]),children:"Clear all"})]})]})}};var k,V,R;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    children: 'Tag'
  }
}`,...(R=(V=p.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var F,P,q;x.parameters={...x.parameters,docs:{...(F=x.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
      <Tag variant="info">Info</Tag>
    </div>
}`,...(q=(P=x.parameters)==null?void 0:P.docs)==null?void 0:q.source}}};var W,A,E;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag variant="default" outline>
        Default
      </Tag>
      <Tag variant="primary" outline>
        Primary
      </Tag>
      <Tag variant="success" outline>
        Success
      </Tag>
      <Tag variant="warning" outline>
        Warning
      </Tag>
      <Tag variant="danger" outline>
        Danger
      </Tag>
      <Tag variant="info" outline>
        Info
      </Tag>
    </div>
}`,...(E=(A=v.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var M,O,L;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
}`,...(L=(O=f.parameters)==null?void 0:O.docs)==null?void 0:L.source}}};var U,_,H;T.parameters={...T.parameters,docs:{...(U=T.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag rounded>Default</Tag>
      <Tag variant="primary" rounded>
        Primary
      </Tag>
      <Tag variant="success" rounded>
        Success
      </Tag>
      <Tag variant="danger" rounded outline>
        Danger Outline
      </Tag>
    </div>
}`,...(H=(_=T.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var J,K,X;h.parameters={...h.parameters,docs:{...(J=h.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag icon={<IconTag size={12} />}>Category</Tag>
      <Tag variant="primary" icon={<IconUser size={12} />}>
        User
      </Tag>
      <Tag variant="success" icon={<IconStar size={12} />}>
        Featured
      </Tag>
    </div>
}`,...(X=(K=h.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var B,Q,Y;b.parameters={...b.parameters,docs:{...(B=b.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind', 'Vite']);
    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };
    return <TagGroup>
        {tags.map(tag => <Tag key={tag} closable onClose={() => handleClose(tag)}>
            {tag}
          </Tag>)}
        {tags.length === 0 && <span className="text-body-sm text-[var(--color-text-muted)]">No tags</span>}
      </TagGroup>;
  }
}`,...(Y=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};var Z,$,ee;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag variant="default" closable onClose={() => {}}>
        Default
      </Tag>
      <Tag variant="primary" closable onClose={() => {}}>
        Primary
      </Tag>
      <Tag variant="success" closable onClose={() => {}}>
        Success
      </Tag>
      <Tag variant="danger" closable onClose={() => {}}>
        Danger
      </Tag>
    </div>
}`,...(ee=($=y.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ae,re,se;j.parameters={...j.parameters,docs:{...(ae=j.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>(['react']);
    const toggleTag = (tag: string) => {
      setSelected(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };
    const tags = ['react', 'vue', 'angular', 'svelte'];
    return <div className="flex flex-col gap-4">
        <TagGroup>
          {tags.map(tag => <Tag key={tag} variant={selected.includes(tag) ? 'primary' : 'default'} onClick={() => toggleTag(tag)} clickable>
              {tag}
            </Tag>)}
        </TagGroup>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Selected: {selected.join(', ') || 'None'}
        </p>
      </div>;
  }
}`,...(se=(re=j.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var te,ne,le;N.parameters={...N.parameters,docs:{...(te=N.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag disabled>Disabled</Tag>
      <Tag variant="primary" disabled>
        Disabled Primary
      </Tag>
      <Tag closable disabled onClose={() => {}}>
        Disabled Closable
      </Tag>
    </div>
}`,...(le=(ne=N.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var ie,oe,ce;S.parameters={...S.parameters,docs:{...(ie=S.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small Gap</h4>
        <TagGroup gap="sm">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium Gap (default)</h4>
        <TagGroup gap="md">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Large Gap</h4>
        <TagGroup gap="lg">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
    </div>
}`,...(ce=(oe=S.parameters)==null?void 0:oe.docs)==null?void 0:ce.source}}};var de,ge,ue;w.parameters={...w.parameters,docs:{...(de=w.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
      <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-3">Skills</h3>
      <TagGroup>
        <Tag variant="primary">JavaScript</Tag>
        <Tag variant="primary">TypeScript</Tag>
        <Tag variant="primary">React</Tag>
        <Tag variant="info">Node.js</Tag>
        <Tag variant="info">Python</Tag>
        <Tag variant="success">AWS</Tag>
        <Tag variant="success">Docker</Tag>
      </TagGroup>
    </div>
}`,...(ue=(ge=w.parameters)==null?void 0:ge.docs)==null?void 0:ue.source}}};var me,pe,xe;C.parameters={...C.parameters,docs:{...(me=C.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Production:</span>
        <Tag variant="success" size="sm">
          Healthy
        </Tag>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Staging:</span>
        <Tag variant="warning" size="sm">
          Deploying
        </Tag>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Development:</span>
        <Tag variant="danger" size="sm">
          Failed
        </Tag>
      </div>
    </div>
}`,...(xe=(pe=C.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};var ve,fe,Te;D.parameters={...D.parameters,docs:{...(ve=D.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => {
    const [filters, setFilters] = useState(['Status: Active', 'Type: VM', 'Region: US-East']);
    const removeFilter = (filter: string) => {
      setFilters(filters.filter(f => f !== filter));
    };
    return <div className="flex flex-col gap-2">
        <div className="text-label-sm text-[var(--color-text-subtle)]">Active Filters</div>
        <TagGroup>
          {filters.map(filter => <Tag key={filter} variant="primary" outline closable onClose={() => removeFilter(filter)}>
              {filter}
            </Tag>)}
          {filters.length > 0 && <button className="text-body-sm text-[var(--color-action-primary)] hover:underline" onClick={() => setFilters([])}>
              Clear all
            </button>}
        </TagGroup>
      </div>;
  }
}`,...(Te=(fe=D.parameters)==null?void 0:fe.docs)==null?void 0:Te.source}}};const Le=["Default","Variants","OutlineVariants","Sizes","Rounded","WithIcon","Closable","ClosableVariants","Clickable","Disabled","TagGroupExample","SkillTags","StatusTags","FilterTags"];export{j as Clickable,b as Closable,y as ClosableVariants,p as Default,N as Disabled,D as FilterTags,v as OutlineVariants,T as Rounded,f as Sizes,w as SkillTags,C as StatusTags,S as TagGroupExample,x as Variants,h as WithIcon,Le as __namedExportsOrder,Oe as default};
